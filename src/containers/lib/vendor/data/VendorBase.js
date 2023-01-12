import {SortWays, VendorMarkets} from "./VendorConsts";
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import md5 from "crypto-js/md5";
import {vendorStorage} from "../vendorStorage";
import {timeout_fetch} from "../../SportRequest";
import { defaultMemberSetting } from "../vendorSetting";
/**
 * Vendor共用父類
 */
export default class VendorBase {
  constructor (configs) {
    this.configs = Object.assign(this.configs,configs);
  }

  configs = {
    MaxParlay: 10, //串關最多選幾個
    VendorName: 'NOTSET', //供應商名稱
    VendorPage: 'NOTSET', //主頁鏈接
    EventIdType: 'NOTSET', //EventId數據形態: int/string
    HasLeagueIcon: false, //是否有聯賽Icon
    HasTeamIcon: false, //是否有隊伍Icon
  }

  isGameLocked = false; //保留字段，遊戲鎖定
  loginPromise = null; //登入的Promise

  _getLoginInfo(){
    throw '_getLoginInfo needs implement!!!';
  }


  /**
   * 刪除輪詢，在componentWillUnmount時調用，避免堆積太多無用輪詢
   *
   * @param key
   */
  deletePolling(key) {
    //console.log('===deletePolling',key);
    if (key && typeof key === 'object' && Object.keys(key).length === 2) {
      return this._unsubscribeGlobalPolling(key);
    }

    //處理輪詢
    const pollingCacheInfo = this._PollingCache[key];
    //停止輪詢
    if (pollingCacheInfo && pollingCacheInfo.handle) {
      clearTimeout(pollingCacheInfo.handle);
    }
    //刪除數據
    if (pollingCacheInfo) {
      delete this._PollingCache[key];
    }
  }

  //輪詢數據緩存
  _PollingCache = {}
  //輪詢共用函數
  _registerPolling(dataName, queryParams, queryFunction, onUpdateCallback, intervalSeconds = 10, uniqueName = '', useResultCache = false, resultCacheExpireSeconds=9*60, preCacheFunction = null) {
    //加速:從緩存中優先獲取數據
    let cachedResultKey;
    let usedCachedResult = false; //是否使用緩存數據加速
    if (useResultCache) {
      cachedResultKey = dataName + '_' + uniqueName + '_' + md5(JSON.stringify(queryParams));
      const cachedResult = this._cacheGet(cachedResultKey, null);
      if (cachedResult) {
        //console.log('===use Cached data for ',cachedResultKey);
        //回調通知數據更新
        if (onUpdateCallback) {
          try {
            onUpdateCallback(cachedResult);
          } catch (e) {
            console.log('Polling onUpdateCallback error', e);
          }
        }
        usedCachedResult = true;
      }
    }

    const cacheKey =  dataName + '_' + uniqueName;

    let cacheInfo = this._PollingCache[cacheKey];
    if (cacheInfo) {
      //有舊的

      //先停止輪詢
      if (cacheInfo && cacheInfo.handle) {
        clearTimeout(cacheInfo.handle);
      }

      //清理緩存數據
      delete this._PollingCache[cacheKey];
    }

    //重新初始化配置
    //配置一個唯一key，用於輪詢取代後，判斷是新的還是舊的輪詢
    const uniqueid = moment().format('YYYYMMDDHHmmssSSS') + uuidv4();
    //console.log('===Polling uniqueid',uniqueid)
    this._PollingCache[cacheKey] = { handle: null, params: null, uniqueid};
    cacheInfo = this._PollingCache[cacheKey];

    //檢查interval數值
    intervalSeconds = parseInt(intervalSeconds);
    if (!intervalSeconds || isNaN(intervalSeconds) || intervalSeconds<=0) {
      intervalSeconds = 15;
    }

    //用async包裹，因為需要使用到await 按順序執行
    (async () => {
      //沒有緩存數據，才利用preCacheFunction去獲取初始數據
      if (!usedCachedResult && preCacheFunction) {
        const data = await timeout_fetch(preCacheFunction(),2000).catch(e => {}); //初始數據兩秒必須返回 超過放棄
        //檢查輪詢是否還存在，可能剛好在異步查詢完成之後就被刪除了
        if (this._PollingCache[cacheKey] && this._PollingCache[cacheKey].uniqueid === uniqueid) { //輪詢存在 才繼續回調
          if (data && onUpdateCallback) {
            try {
              onUpdateCallback(data);
            } catch (e) {
              console.log('Polling onUpdateCallback from precache error',this.configs.VendorName, e);
            }
            await new Promise(r => setTimeout(r, 1000)); //停一下，讓前端優先render
          }
        } else {
          console.log('abort polling onUpdateCallback from precache due to the polling has been deleted',this.configs.VendorName,cacheKey);
        }
      }

      //配置輪詢函數
      const queryAndCallback = (thisUniqueId) => {
        queryFunction().then(data => {
          //檢查輪詢是否還存在，可能剛好在異步查詢完成之後就被刪除了
          if (this._PollingCache[cacheKey] && this._PollingCache[cacheKey].uniqueid === thisUniqueId) { //輪詢存在 才繼續回調
            if (useResultCache) {
              //console.log('===set Cached data for ',cachedResultKey);
              this._cacheSet(cachedResultKey, data, resultCacheExpireSeconds); //加速:緩存
            }

            if (onUpdateCallback) {
              try {
                onUpdateCallback(data);
              } catch (e) {
                console.log('Polling onUpdateCallback error',this.configs.VendorName, e);
              }
            }
          } else {
            console.log('abort polling onUpdateCallback due to the polling has been deleted',this.configs.VendorName,cacheKey);
          }
        }).catch(e => {console.log('polling has error',cacheKey, e )})
          .finally(() => {
          if (this._PollingCache[cacheKey] && this._PollingCache[cacheKey].uniqueid === thisUniqueId) { //輪詢存在 才繼續回調
            //console.log('register next polling setTimeout',this.configs.VendorName,cacheKey);
            //使用setTimeout而不是interval，這樣可以避免- 查詢返回很慢，造成輪詢堆積的問題
            this._PollingCache[cacheKey].handle = setTimeout(() => {
              queryAndCallback(thisUniqueId)
            }, intervalSeconds * 1000);
          } else {
            console.log('abort polling setTimeout due to the polling has been deleted',this.configs.VendorName,cacheKey);
          }
        });
      };

      //紀錄查詢參數
      cacheInfo.params = queryParams;

      //先調用一次獲取數據，並開始輪詢
      queryAndCallback(uniqueid);
    })();

    return cacheKey; //返回key
  }

  _getFavouriteStorageKey(type = 'EVENTS') {
    const loginInfo = this._getLoginInfo();
    let memberCode = '';
    if (loginInfo) {
      memberCode = loginInfo.memberCode;
    }
    return 'FAV-' + memberCode + '-' + this.configs.VendorName + '-' + type;
  }

  _cleanFavouriteEventTimeoutHandler = null;

  /**
   * 添加收藏賽事
   *
   * @param EventId
   */
  async addFavouriteEvent(EventId,SportId,IsOutRightEvent) {
    const key = this._getFavouriteStorageKey();
    const savedFavEvents = await this.getFavouriteEvents(key);
    SportId = parseInt(SportId);//固定轉為int
    if (this.configs.EventIdType === 'string') {
      EventId = EventId + '';//固定轉為string
    }
    if (this.configs.EventIdType === 'int') {
      EventId = parseInt(EventId);//固定轉為int
    }
    //去除已經有的數據
    let favEvents = savedFavEvents.filter(item => item.EventId !== EventId)
    //添加
    favEvents.push({EventId,SportId,IsOutRightEvent});
    await vendorStorage.setItemAsync(key, JSON.stringify(favEvents));

    //配置過期清理
    if (!this._cleanFavouriteEventTimeoutHandler) {
      const doClean = async () => {
        const key = this._getFavouriteStorageKey();
        const currentFavEvents = await this.getFavouriteEvents(key);

        let pr = await this.getEventsDetail(currentFavEvents);
        const thisEvents = pr.NewData;
        let existEventIds = [];
        if (thisEvents && thisEvents.length >0) {
          existEventIds = thisEvents.map(e => e.EventId);
        }
        const notExistEventIds = currentFavEvents.filter(e => existEventIds.indexOf(e.EventId) === -1).map(e => e.EventId);
        //console.log('===need clean fav events',notExistEventIds);

        let hasDeletedFavourite = false; //關注比賽 是否有被刪除
        if (notExistEventIds && notExistEventIds.length >0) {
          hasDeletedFavourite = await this.removeFavouriteEvent(notExistEventIds);
        }
        if (hasDeletedFavourite){ //關注比賽 有被刪除
          //強制刷新 體育計數
          if (typeof window !== "undefined" && window.eventListing_updateSportsCount) {
            window.eventListing_updateSportsCount(this.configs.VendorName);
          }
        }

        const currentFavEvents3 = await this.getFavouriteEvents(key);

        if (currentFavEvents3.length > 0) {
          this._cleanFavouriteEventTimeoutHandler = setTimeout(doClean,10*60*1000); //10分檢查一次
        } else {
          clearTimeout(this._cleanFavouriteEventTimeoutHandler);
          this._cleanFavouriteEventTimeoutHandler = null;
        }
      }

      this._cleanFavouriteEventTimeoutHandler = setTimeout(doClean,10*60*1000); //10分檢查一次
    }
  }

  /**
   * 刪除收藏賽事
   *
   * @param EventId 支持數組型態
   */
  async removeFavouriteEvent(EventId) {
    const key = this._getFavouriteStorageKey();
    const savedFavEvents = await this.getFavouriteEvents(key);

    //強制轉array
    let EventIdArr = EventId;
    if (!Array.isArray(EventId)) {
      EventIdArr = [EventId];
    }

    let removeEventIdArr = EventIdArr.map(eid => {
      let convertedEventId = eid;
      if (this.configs.EventIdType === 'string') {
        convertedEventId = eid + '';//固定轉為string
      }
      if (this.configs.EventIdType === 'int') {
        convertedEventId = parseInt(eid);//固定轉為int
      }
      return convertedEventId;
    })

    let favEvents = savedFavEvents.filter(item => removeEventIdArr.indexOf(item.EventId) === -1);
    const isChanged = (savedFavEvents.length !== favEvents.length);

    //console.log('===remove fav event',removeEventIdArr,isChanged);

    if (isChanged) {
      await vendorStorage.setItemAsync(key, JSON.stringify(favEvents));
    }
    return isChanged;
  }

  /**
   * 獲取收藏賽事
   *
   * @param key
   * @returns {*[]|any}
   */
  async getFavouriteEvents(key = null) {
    if (key === null) {
      key = this._getFavouriteStorageKey();
    }
    if (typeof window !== 'undefined') {
      const jsonString = await vendorStorage.getItemAsync(key);
      if (jsonString) {
        const jsonData = JSON.parse(jsonString);
        if (jsonData) {
          return jsonData;
        }
      }
    }
    return [];
  }

  //獲取用戶配置
  getMemberSetting() {
    const defaultSetting = defaultMemberSetting;

    const loginInfo = this._getLoginInfo();
    let memberCode = '';
    if (loginInfo) {
      memberCode = loginInfo.memberCode;
    }

    let result = defaultSetting;

    //從緩存獲取
    if (typeof window !== 'undefined') {
      const jsonString = vendorStorage.getItem('NotificationSetting-' + memberCode)
      if (jsonString) {
        const jsonData = JSON.parse(jsonString);
        if (jsonData) {
          result = Object.assign({},defaultSetting,jsonData);
        }
      }
    }

    return result;
  }

  /**
   * 根據體育項目獲取，最多8個，返回為 EventData數組
   *
   * @param sportId 體育id
   * @param NEventCount 要返回前幾個比賽 默認8
   * @returns {Promise<*[]|*>}
   */
  async getBannerData(sportId, NEventCount = 8 ) {
    sportId = parseInt(sportId);
    if(sportId === 1) {
      // 足球按以下三個優先序排，如果同等級  就用vendor的默認排序
      // 滾球
      // a. 第一級: 高進球可能性的賽事 優先 (賽事進行到第75分鐘前 OR 縂進球 > 1 OR 紅卡 > 0)
      // b. 第二級: 縂進球 降序排序
      // c. 第三級: 根據賽事開始時間 升序排序
      //
      // 按此順序找到前８
      const runningEventsPR = await this.getEvents(sportId,VendorMarkets.RUNNING,SortWays.LeagueName); //先用默認聯賽排序，拿到Vendor定義的順序
      let runningEvents = runningEventsPR.NewData;

      //a. 第一級: 高進球可能性的賽事 優先 (賽事進行到第75分鐘前 OR 縂進球 > 1 OR 紅卡 > 0)
      const rule1 = (event) => {
        return (event.RBMinute !== null && event.RBMinute !== '' && parseInt(event.RBMinute) <= 75)
          || event.HomeScore !== null && event.HomeScore !== ''&&  parseInt(event.HomeScore) > 0
          || event.AwayScore !== null && event.AwayScore !== ''&&  parseInt(event.AwayScore) > 0
          || event.HomeRedCard !== null && event.HomeRedCard !== ''&& parseInt(event.HomeRedCard) > 0
          || event.AwayRedCard !== null && event.AwayRedCard !== ''&& parseInt(event.AwayRedCard) > 0
      }

      //b. 第二級: 縂進球 降序排序
      const rule2 = (event) => {
        const HomeScore = (event.HomeScore !== null && event.HomeScore !== '') ? parseInt(event.HomeScore) : 0;
        const AwayScore = (event.AwayScore !== null && event.AwayScore !== '') ? parseInt(event.AwayScore) : 0;
        return HomeScore+AwayScore;
      }

      const compareFunc = (left,right) => {
        //a. 第一級: 高進球可能性的賽事 優先 (賽事進行到第75分鐘前 OR 縂進球 > 1 OR 紅卡 > 0)
        const a1 = rule1(left);
        const b1 = rule1(right);

        if (a1 === true && b1 === false) {
          return -1; //小于 0 ，那么 a 会被排列到 b 之前
        }

        if (b1 === true && a1 === false) {
          return 1; //大于 0 ， b 会被排列到 a 之前。
        }

        //b. 第二級: 縂進球 降序排序
        const a2 = rule2(left);
        const b2 = rule2(right);

        if (a2 > b2 ) {
          return -1; //小于 0 ，那么 a 会被排列到 b 之前
        }
        if (a2 < b2 ) {
          return 1; //大于 0 ， b 会被排列到 a 之前。
        }

        //c. 第三級: 根據賽事開始時間 升序排序
        const a3 = left.EventDate;
        const b3 = right.EventDate;
        if (a3 < b3 ) {
          return -1; //小于 0 ，那么 a 会被排列到 b 之前
        }
        if (a3 > b3 ) {
          return 1; //大于 0 ， b 会被排列到 a 之前。
        }
        // a must be equal to b
        return 0;
      }

      runningEvents = runningEvents.sort(compareFunc);

      if (runningEvents.length >= NEventCount) {
        return runningEvents.slice(0,NEventCount);
      } else {
        const leftCount = NEventCount - runningEvents.length;
        const leftEvents = await this._getFirstNEvents(sportId,leftCount,SortWays.EventTime, [],[VendorMarkets.TODAY,VendorMarkets.EARLY]);
        return runningEvents.concat(leftEvents).slice(0,NEventCount); //返回切好的N個比賽
      }
    } else {
      //其他體育項目
      //根據開賽時間排序 近->遠
      return this._getFirstNEvents(sportId,NEventCount,SortWays.EventTime);
    }
  }

  /**
   * 全局 輪詢獲取 banner數據 20秒一次
   *
   * @param subscriberName    訂閱者名稱，用來處理重複訂閱的狀況
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 EventData數組
   * @param sportId           體育id
   * @param NEventCount       要返回前幾個比賽 默認8
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getBannerDataPollingGlobal(subscriberName, onUpdateCallback, sportId , NEventCount = 8, uniqueName = '') {
    return this._subscribeGlobalPolling('getBannerDataPolling', subscriberName, onUpdateCallback,{sportId, NEventCount}, uniqueName, true);
  }

  /**
   * 輪詢獲取 banner數據 20秒一次
   *
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 EventData數組
   * @param sportId           體育id
   * @param NEventCount       要返回前幾個比賽 默認8
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getBannerDataPolling(onUpdateCallback, sportId , NEventCount = 8, uniqueName = '') {
    const dataQuery = () => this.getBannerData(sportId, NEventCount);
    return this._registerPolling('getBannerDataPolling', {sportId, NEventCount}, dataQuery, onUpdateCallback, 20, uniqueName, true);
  }

  //按體育項目+排序 返回前幾個比賽
  async _getFirstNEvents(sportId = 1, NEventCount = 8, sortWay = SortWays.EventTime, excludeEventIds= [],
                         markets= [VendorMarkets.RUNNING,VendorMarkets.TODAY,VendorMarkets.EARLY] //滾球->今日->早盤 的順序
  ) {
    let resultEvents = [];
    for(let market of markets) {
      const thisEventPR = await this.getEvents(sportId,market,sortWay,null,null,{MaxCount:NEventCount}); //bti加上最大數量限制 加速查詢
      let thisEvents = thisEventPR.NewData;

      if (excludeEventIds && excludeEventIds.length >0) {
        //排除不要的比賽
        thisEvents = thisEvents.filter(ev => excludeEventIds.indexOf(ev.EventId) === -1);
      }

      //去除已經在清單裡面的比賽
      if (resultEvents.length > 0) {
        thisEvents = thisEvents.filter(ev => resultEvents.indexOf(ev.EventId) === -1);
      }

      //接起來
      resultEvents = resultEvents.concat(thisEvents);

      if (resultEvents.length >= NEventCount) {
        break; //超過數量就可以退出
      }
    }

    return resultEvents.slice(0,NEventCount); //返回切好的N個比賽
  }

  /**
   * 獲取聯賽下的滾球賽事，額外傳入EventId，會把該Event放在數組的第一個，返回為 EventData數組
   *
   * @param sportId 體育id
   * @param leagueId 聯賽id
   * @param eventId 本賽事id
   * @returns {Promise<*[]|*>}
   */
  async getLiveEventsInSameLeague(sportId, leagueId, eventId = null) {
    sportId = parseInt(sportId);
    leagueId = parseInt(leagueId);

    if (this.configs.EventIdType === 'string') {
      eventId = eventId + '';//固定轉為string
    }
    if (this.configs.EventIdType === 'int') {
      eventId = parseInt(eventId);//固定轉為int
    }

    const runningEventsPR = await this.getEvents(sportId, VendorMarkets.RUNNING, SortWays.EventTime);
    let runningEvents = runningEventsPR.NewData;

    runningEvents = runningEvents.filter(re => parseInt(re.LeagueId) === parseInt(leagueId)); //獲取同聯賽


    //把目標賽事移到第一個
    if (eventId !== null) {
      const compareFunc = (left, right) => {
        const a = left.EventId === eventId;
        const b = right.EventId === eventId;

        if (a === true && b === false) {
          return -1; //小于 0 ，那么 a 会被排列到 b 之前
        }

        if (b === true && a === false) {
          return 1; //大于 0 ， b 会被排列到 a 之前。
        }

        return 0;
      }
      runningEvents = runningEvents.sort(compareFunc);
    }

    return runningEvents;
  }

  /**
   * 獲取熱門比賽-足球 今日+早盤，按開賽時間排序 選３個
   *
   * @param NEventCount 要返回前幾個比賽 默認3
   * @returns {Promise<*[]|*>}
   */
  async getHotEvents(NEventCount =3){
    return this._getFirstNEvents(1,3,SortWays.EventTime,[],[VendorMarkets.TODAY,VendorMarkets.EARLY]);
  }

  /**
   * 全局 輪詢獲取 熱門比賽 數據 20秒一次
   *
   * @param subscriberName    訂閱者名稱，用來處理重複訂閱的狀況
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 EventData數組
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getHotEventsPollingGlobal(subscriberName, onUpdateCallback, uniqueName = '') {
    return this._subscribeGlobalPolling('getBannerDataPolling', subscriberName, onUpdateCallback,{}, uniqueName);
  }

  /**
   * 輪詢獲取 熱門比賽 數據 20秒一次
   *
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 EventData數組
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getHotEventsPolling(onUpdateCallback, uniqueName = '') {
    const dataQuery = () => this.getHotEvents();
    return this._registerPolling('getHotEventsPolling', {}, dataQuery, onUpdateCallback, 20, uniqueName);
  }


  //數據緩存 有保質期
  _cacheWithExpiration = {}
  //數據緩存清理
  _cacheCleanTimeoutHandler = null

  /**
   * 設置緩存數據，保存秒數
   *
   * @param key 唯一key
   * @param data 數據
   * @param expireSeconds 緩存秒數 默認9分(因為10分清理一次)
   */
  _cacheSet(key, data, expireSeconds =9*60) {
    this._cacheWithExpiration[key] = { data, expTime: ((new Date()).getTime() + expireSeconds * 1000), expSec:expireSeconds}

    //配置過期清理
    if (!this._cacheCleanTimeoutHandler) {
      const doClean = () => {
        const nowTime = new Date().getTime();
        for(let propName in this._cacheWithExpiration) {
          const info = this._cacheWithExpiration[propName];
          if (nowTime > info.expTime) {
            console.log('=== remove expired cache by timeoutHandler',propName);
            delete this._cacheWithExpiration[propName]
          } else {
            //console.log('=== checked cache but not expire yet by timeoutHandler',propName);
          }
        }
        if (Object.keys(this._cacheWithExpiration).length > 0) {
          this._cacheCleanTimeoutHandler = setTimeout(doClean,10*60*1000); //10分檢查一次
        } else {
          clearTimeout(this._cacheCleanTimeoutHandler);
          this._cacheCleanTimeoutHandler = null;
        }
      }

      this._cacheCleanTimeoutHandler = setTimeout(doClean,10*60*1000); //10分檢查一次
    }
  }

  /**
   * 獲取緩存數據
   * 注意此操作單純獲取數據，不會延長緩存時間
   *
   * @param key 唯一key
   * @param defaultValue 沒有數據或數據已過期，返回的默認值
   */
  _cacheGet(key, defaultValue= null) {
    //檢查是否存在
    const info = this._cacheWithExpiration[key];
    if (info === undefined) {
      return defaultValue;
    }

    //檢查是否過期
    const nowTime = new Date().getTime();
    if (nowTime > info.expTime) {
      delete this._cacheWithExpiration[key]
      console.log('=== remove expired cache by cacheGet',key);
      return defaultValue
    }

    return info.data;
  }

  //全局輪詢數據
  _globalPollingCache = {}

  //訂閱全局輪詢
  _subscribeGlobalPolling(funcName, subscriberName, onUpdateCallback, params, uniqueName, keepAlive=false) {
    const pollingKey = funcName + '_' + uniqueName;

    let newPolling = false;
    let oldCallbacks = {};
    if (!this._globalPollingCache[pollingKey]) {
      newPolling = true;
    } else {
      //檢查參數是否變化了
      const thisPollingInfo = this._globalPollingCache[pollingKey];
      const thisParaJSON = JSON.stringify(params);
      const currentParaJSON = JSON.stringify(thisPollingInfo.params);
      if (thisParaJSON !== currentParaJSON) {
        //參數變化，需要重起輪詢
        newPolling = true;
        //刪除現有的輪詢
        this.deletePolling(thisPollingInfo.pollingKey);
        //保留原有的回調
        oldCallbacks = {...thisPollingInfo.updateCallBacks}
      }
    }

    if (newPolling) {
      console.log('=== new polling of',pollingKey);

      this._globalPollingCache[pollingKey] = { pollingKey:null, updateCallBacks:{...oldCallbacks}, params, keepAlive }

      const updateCallBackAdapter = (result) => {
        for(let uniqueKey in this._globalPollingCache[pollingKey].updateCallBacks) {
          const thisCallBack = this._globalPollingCache[pollingKey].updateCallBacks[uniqueKey];
          if (thisCallBack) {
            try {
              thisCallBack(result);
            } catch (e) {
              console.log('callback error', e);
            }
          }
        }
      }

      this._globalPollingCache[pollingKey].updateCallBacks[subscriberName] = onUpdateCallback; //在開始輪詢前就配置好，這樣首次輪詢才會調用到

      const arrayParams = Object.values(params);
      this._globalPollingCache[pollingKey].pollingKey = this[funcName](updateCallBackAdapter,...arrayParams,uniqueName);
    } else {
      console.log('=== old polling of',pollingKey);
      if (keepAlive === true) {
        this._globalPollingCache[pollingKey].keepAlive = true;
      }

      //從緩存獲取數據
      const cachedResultKey = funcName + '_' + uniqueName + '_' + md5(JSON.stringify(params));
      const cachedResult = this._cacheGet(cachedResultKey, null);
      if (cachedResult) {
        console.log('===use Cached data for Global:',cachedResultKey);
        //回調通知數據更新
        if (onUpdateCallback) {
          try {
            onUpdateCallback(cachedResult);
          } catch (e) {
            console.log('Global Polling onUpdateCallback error', e);
          }
        }
      }

      this._globalPollingCache[pollingKey].updateCallBacks[subscriberName] = onUpdateCallback;
    }

    return {
      pollingKey,
      subscriberName
    }
  }
  //解除訂閱全局輪詢
  _unsubscribeGlobalPolling(globalPollingKey) {
    const {pollingKey,subscriberName} = globalPollingKey;
    if (pollingKey && this._globalPollingCache[pollingKey]) {
      if (subscriberName && this._globalPollingCache[pollingKey].updateCallBacks && this._globalPollingCache[pollingKey].updateCallBacks[subscriberName]) {
        console.log('===_unsubscribeGlobalPolling',pollingKey,subscriberName);
        delete this._globalPollingCache[pollingKey].updateCallBacks[subscriberName];
      }

      //沒有訂閱者就把輪詢刪掉
      if (Object.keys(this._globalPollingCache[pollingKey]).length <=0) {
        if (!this._globalPollingCache[pollingKey].keepAlive) { //如果配置keepAlive=true 不會刪除輪詢
          //刪除現有的輪詢
          this.deletePolling(pollingKey);
          delete this._globalPollingCache[pollingKey];
        }
      }
    }
  }
}