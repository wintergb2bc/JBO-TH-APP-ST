import HostConfig from '$LIB/Host.config';
import {vendorSettings, getTokenFromGatewayImpl} from '../vendorSettingIM';
import md5 from "crypto-js/md5";
import aes from 'crypto-js/aes';
import ecb from 'crypto-js/mode-ecb';
import pkcs7 from 'crypto-js/pad-pkcs7';
import base64 from 'crypto-js/enc-base64';
import moment from 'moment';
import {
  IMAPIStatus,
  IMWagerStatus,
  IMBetType,
  IMEventType,
  IMPeriodType,
  IMSports,
  IMOddsType, IMDeltaAction, IMWagerSortWay,
} from "./IMConsts";
import SportData from '../data/SportData'
import MarketData from "../data/MarketData";
import LeagueData from "../data/LeagueData";
import EventData from "../data/EventData";
import LineData from "../data/LineData";
import SelectionData from "../data/SelectionData";
import OddsData from "../data/OddsData";
import {
  EventChangeType,
  OddsType,
  SelectionStatusType,
  SortWays, VendorConfigs,
  VendorErrorType, VendorMarketNames, VendorMarkets,
  WagerType
} from "../data/VendorConsts";
import EventChangeData from "../data/EventChangeData";
import PollingResult from "../data/PollingResult";
import SearchEventData from "../data/SearchEventData";
import SearchLeagueData from "../data/SearchLeagueData";
import BetSettingData from "../data/BetSettingData";
import BetSelectionResultData from "../data/BetSelectionResultData";
import BetResultData from "../data/BetResultData";
import WagerData from "../data/WagerData";
import WagerItemData from "../data/WagerItemData";
import AnnouncementData from "../data/AnnouncementData";
import BetInfoData from "../data/BetInfoData";
import VendorError from "../data/VendorError";
import {Decimal} from "decimal.js";
import SelectionChangeData from "../data/SelectionChangeData";
import {fetchRequest} from "../../SportRequest";
import {ApiPort} from "../../SPORTAPI";
import VendorBase from "../data/VendorBase";
import natureCompare from 'natural-compare';
import EventInfo from "../data/EventInfo";
import BetStatusData from "../data/BetStatusData";
import {vendorStorage} from '../vendorStorage';
import SearchSportData from "../data/SearchSportData";

const promiseWithTimeout = (targetPromise, timeout = 600000, timeoutMsg = '请求超时!!!') => {
  let timeout_fn = null;
  let timeout_promise = new Promise(function(resolve, reject) {
    timeout_fn = function() {
      reject(timeoutMsg);
    };
  });
  let timeout_handler = setTimeout(function() {
    timeout_fn();
  }, timeout);
  let abortable_promise =
    Promise.race([ targetPromise, timeout_promise ])
      .then(result => {
        if (timeout_handler) {
          clearTimeout(timeout_handler);
        }
        return result;
      })

  return abortable_promise;
}

/**
 * IM 體育接口
 */
class VendorIM extends VendorBase {
  //Singleton
  constructor () {
    if (!VendorIM._instance) {
      super({
        MaxParlay: 10, //串關最多選幾個
        VendorName: 'IM', //供應商名稱
        VendorPage: '/sports-im', //主頁鏈接
        EventIdType: 'int', //EventId數據形態: int/string
        HasLeagueIcon: true, //是否有聯賽Icon
        HasTeamIcon: true, //是否有隊伍Icon
      });
      console.log('VendorIM new instance');
      VendorIM._instance = this;
    }
    return VendorIM._instance;
  }

  _getLoginInfo(){
    if (typeof window !== "undefined") {
      if (vendorStorage.getItem("loginStatus") == 1) {
        const token = JSON.parse(vendorStorage.getItem("IM_Token"));
        const memberCode = JSON.parse(vendorStorage.getItem("IM_MemberCode"));
        const memberType = JSON.parse(vendorStorage.getItem("IM_MemberType")); //用戶水位
        if (token && memberCode) return {token, memberCode, memberType};
      }
    }
    return null
  }

  //獲取用戶水位
  _getMemberType() {
    let memberType = 'A';
    if (typeof window !== "undefined") {
      if (vendorStorage.getItem("loginStatus") == 1) {
        const thisMemberType = JSON.parse(vendorStorage.getItem("IM_MemberType")); //用戶水位
        if (thisMemberType) {
          memberType = thisMemberType;
        }
      }
    }
    return memberType;
  }

  //獲取用戶水位
  _queryIMmemberType() {
    const loginInfo = this._getLoginInfo();
    //查詢用戶等級
    //console.log('===getLoginInfo',loginInfo);
    if (loginInfo.token && loginInfo.memberCode && !loginInfo.memberType) {
      let params = {};
      params['TimeStamp'] = this._getTimestamp();
      params['Token'] = loginInfo.token;
      params['MemberCode'] = loginInfo.memberCode;

      const apiName = 'GETMEMBERBYTOKEN'
      const fetchParams = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(params),
      };

      const url =  HostConfig.Config.IMApi + apiName;

      promiseWithTimeout(
        fetch(url, fetchParams)
        .then(function(response) {
          return response.json();
        }).then(function(jsonData){
          console.log('===GetMemberByToken',jsonData)
          if (jsonData && jsonData.SpreadGroup) {
            vendorStorage.setItem(
              "IM_MemberType",
              JSON.stringify(jsonData.SpreadGroup)
            );
          }
        }).catch(e => {})
        ,
        60*1000, //1分超時
      ).catch(e => console.log('_queryIMmemberType query timeout error'));
    }
  }

  //從gateway獲取登入token
  getTokenFromGateway() {
    return getTokenFromGatewayImpl(this);
  }

  //等待登入完成
  _checkAndWaitLogin(){
    return new Promise(resolve => {
      if (vendorStorage.getItem("loginStatus") == 1) {
        if (this.loginPromise) {
          this.loginPromise.then(r => resolve(r)); // 如果在登入中，等待登入完成
        } else {
          //沒有loginPromise則檢查緩存數據
          const loginInfo = this._getLoginInfo();
          if (loginInfo) {
            //有數據，返回
            resolve(loginInfo.token);
          } else {
            //沒有緩存數據,可能登入後還沒來得及拿到token就刷新了，嘗試重新獲取
            this.getTokenFromGateway().then(r => resolve(r))
          }
        }
      } else {
        resolve(true); //沒登入(guest view)不需處理
      }
    })
  }

  /**
   * 生成調用接口的timestamp
   */
  _getTimestamp() {
    const key = md5(HostConfig.Config.IMAccessCode);

    //格式 Wed, 19 Jun 2019 07:59:41 GMT
    let currentTimeStamp = moment().utcOffset(0).format("ddd, DD MMM YYYY HH:mm:ss [GMT]");
    const cipher = aes.encrypt(currentTimeStamp, key, {
      mode: ecb,
      padding: pkcs7,
      iv: '',
    });
    // 将加密后的数据转换成 Base64
    const base64Cipher = cipher.ciphertext.toString(base64);
    //console.log(key,currentTimeStamp, base64Cipher);
    return base64Cipher;
  }

  //儲存接口Delta數值
  _APIDeltas = {}

  _getDeltaKey(name, params = {}) {
    let params4md5 = Object.assign({},params);
    //清掉 額外添加 或是 查詢過程中會變化 的參數
    delete params4md5['TimeStamp'];
    delete params4md5['Delta'];
    delete params4md5['Token'];
    const paramsMD5 = md5(JSON.stringify(params4md5)).toString();
    //console.log('params4md5',params4md5,'md5value---',paramsMD5,'---md5value');
    return name + '_' + paramsMD5;
  }

  /**
   * 清理delta緩存，相當於刷新數據
   * 注意這個清理函數是異步 所以需要await，不然還沒清完就往後執行了，會出現奇怪的問題
   *
   * @param apiName 等同_imFetch的參數
   * @param params 等同_imFetch的參數
   * @private
   */
  async ClearDeltaCache(apiName, params) {
    //這裡也是抄的_imFetch的處理code
    if (!params['TimeStamp']) {
      params['TimeStamp'] = this._getTimestamp();
    }
    if (!params['LanguageCode']) {
      params['LanguageCode'] = vendorSettings.LanguageCode;
    }

    if(this._supportLoginAPIs[apiName]) {
      await this._checkAndWaitLogin();

      const loginInfo = this._getLoginInfo();

      if (loginInfo !== null) {
        if (!params['Token']) {
          params['Token'] = loginInfo.token;
        }

        if (!params['MemberCode']) {
          params['MemberCode'] = loginInfo.memberCode;
        }
      }
    }

    //支持delta查詢的API
    const deltaName = this._DeltaAPIMapping[apiName];
    if (deltaName) {
      const thisDeltaKey = this._getDeltaKey(deltaName,params);
      //清理delta數據
      if (this._APIDeltas[thisDeltaKey]) {
        //等待上一個相同參數的請求完成(加上超時處理，避免卡住數據不更新)
        if (
          this._APIDeltas[thisDeltaKey].queryPromise
          //&& retryCount <=0 //排除delta過期重試retryCount>0的，不然會死鎖卡住
        ) {
          await promiseWithTimeout(
            this._APIDeltas[thisDeltaKey].queryPromise,
            60*1000, //1分超時
            '请求超时2'
          ).catch(e => console.log('_imFetch await before cancel',apiName, params ,'get error:', e));
          //.catch(e => {});
        }

        delete this._APIDeltas[thisDeltaKey];
      }
    }
  }

  /**
   * 調用IM接口
   *
   * @param apiName
   * @param params
   * @param method
   * @param retryCount
   * @returns {Promise<unknown>}
   * @private
   */
  async _imFetch(apiName, params, method='POST' , retryCount = 0) {

    //紀錄原始的參數，遇到delta過期時 使用
    const originAPIName = apiName;
    const originParams = JSON.parse(JSON.stringify(params));

    if (!params['TimeStamp']) {
      params['TimeStamp'] = this._getTimestamp();
    }
    if (!params['LanguageCode']) {
      params['LanguageCode'] = vendorSettings.LanguageCode;
    }

    if(this._supportLoginAPIs[apiName]
    ) {
      await this._checkAndWaitLogin();

      const loginInfo = this._getLoginInfo();

      if (loginInfo !== null) {
        if (!params['Token']) {
          params['Token'] = loginInfo.token;
        }

        if (!params['MemberCode']) {
          params['MemberCode'] = loginInfo.memberCode;
        }

        if (loginInfo.token && loginInfo.memberCode && !loginInfo.memberType) {
          this._queryIMmemberType(); //獲取用戶水位
        }
      }
    }

    //支持delta查詢的API
    const deltaName = this._DeltaAPIMapping[apiName];
    const thisDeltaKey = this._getDeltaKey(deltaName,params);
    if (deltaName) {
      //檢查是否已有數據
      if (!this._APIDeltas[thisDeltaKey]) {
        this._APIDeltas[thisDeltaKey] = { delta: null, params: null, full: null};
      } else {
        //等待上一個相同參數的請求完成(加上超時處理，避免卡住數據不更新)
        if (
          this._APIDeltas[thisDeltaKey].queryPromise
          && retryCount <=0 //排除delta過期重試retryCount>0的，不然會死鎖卡住
        ) {
          await promiseWithTimeout(
            this._APIDeltas[thisDeltaKey].queryPromise,
            60*1000, //1分超時
            '请求超时1'
          ).catch(e => console.log('_imFetch await',apiName,'get error:', e, JSON.stringify(params)));
          //.catch(e => {});
        }

        //結束後有可能被清空
        if (!this._APIDeltas[thisDeltaKey] || !this._APIDeltas[thisDeltaKey].delta ) {
          this._APIDeltas[thisDeltaKey] = { delta: null, params: null, full: null};
        } else {
          //使用保存的delta數值
          params['Delta'] = this._APIDeltas[thisDeltaKey].delta;
          //改成調用delta接口
          apiName = deltaName;
        }
      }
    }

    let that = this;
    let thisQueryPromise = new Promise(function(resolve, reject) {
      const fetchParams = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(params),
      };

      const url =  HostConfig.Config.IMApi + apiName;

      promiseWithTimeout(
        fetch(url, fetchParams)
        .then(function(response) {
          return response.json();
        }).then(function(jsonData){
          //console.log('_imFetch',apiName, method ,fetchParams,'getData', jsonData);

          if (jsonData && jsonData.StatusCode && jsonData.StatusCode === IMAPIStatus.OK) {
            //保存Delta數值
            if (jsonData.Delta && deltaName) {

              //判斷是不是 delta查詢
              jsonData.isDeltaQuery = false;
              if (params['Delta']) {
                jsonData.isDeltaQuery = true;  //額外加一個參數，後面數據處理會用到
              }

              jsonData.deltaKey = thisDeltaKey; //後面數據處理會用到

              //初始化配置
              that._APIDeltas[thisDeltaKey].delta = jsonData.Delta; //保存delta數值
              that._APIDeltas[thisDeltaKey].params = params; //保存查詢參數
            }

            resolve(jsonData);
          } else if (jsonData && jsonData.StatusCode && jsonData.StatusCode === IMAPIStatus.DeltaExpire) {
            //處理delta過期 - 重新調用主查詢
            delete that._APIDeltas[thisDeltaKey]; //刪除delta數據

            //最多重試3次 避免無窮循環
            if (retryCount >= 3) {
              //重試超過3次，按一般錯誤方式返回
              let thiserror = new VendorError();
              if (jsonData && jsonData.StatusCode) {
                thiserror = VendorError.fromIMError(jsonData.StatusCode,jsonData.StatusDesc)
              }
              console.log('_imFetch',apiName, method ,fetchParams,'get error:', thiserror);
              reject(thiserror);
            } else {
              //重試次數+1
              let thisRetryCount = retryCount + 1;
              console.log('_imFetch',apiName, method ,fetchParams,'delta expire retry', thisRetryCount);
              that._imFetch(originAPIName, originParams, method, thisRetryCount)
                .then(jsonData => { resolve(jsonData) })
                .catch(error => reject(error));
            }

          } else {
            let thiserror = new VendorError();
            if (jsonData && jsonData.StatusCode) {
              //特別處理投注錯誤信息
              if (jsonData.StatusCode === 350) { //投注檢查失敗，每個投注選項，分別列出無效原因
                resolve(jsonData); //直接視為成功，在投注檢查函數(getbetInfo)裡面處理
                return true;
              } else if (jsonData.StatusCode === 370) { //查滾球注單狀態失敗
                  resolve(jsonData); //直接視為成功，在_getWagerStatusPolling輪詢裡面處理
                  return true;
              } else if (jsonData.StatusCode === 1000) { //投注失敗
                if (jsonData.WagerSelectionInfos && jsonData.WagerSelectionInfos.length>0) {
                  const errorInfo = jsonData.WagerSelectionInfos[0];
                  //直接從BetStatusMessage拿出錯誤碼
                  thiserror = VendorError.fromIMError(parseInt(errorInfo.BetStatusMessage), jsonData.StatusDesc);
                }
              } else {
                thiserror = VendorError.fromIMError(jsonData.StatusCode, jsonData.StatusDesc)
              }
            }
            console.log('_imFetch',apiName, method ,fetchParams,'get error:', thiserror);
            reject(thiserror);
          }
        })
        ,
        2*60*1000, //2分超時
        '_imFetch请求超时'
        ).catch((error) => {
          console.log('_imFetch',apiName, method ,fetchParams,'has error', error);
          reject(error);
        })
    });

    if (deltaName) {
      if (!this._APIDeltas[thisDeltaKey]) {
        this._APIDeltas[thisDeltaKey] = {delta: null, params: null, full: null};
      }
      this._APIDeltas[thisDeltaKey].queryPromise = thisQueryPromise;
    }

    return thisQueryPromise;
  }

  //接口函數定義
  _APIs = {
    //2.1 索取所有体育计数
    getAllSportCount : (IsCombo=false) => this._imFetch('GETALLSPORTCOUNT', {IsCombo}),

    //2.2 索取所有竞赛计数  注意IsCombo 必須為 true 或 false
    getAllCompetitionCount: (SportId = IMSports.SOCCER, Market = VendorMarkets.EARLY, IsCombo = false,IncludeCloseEvent = false) =>
      this._imFetch('GETALLCOMPETITIONCOUNT', {SportId, Market, IsCombo, IncludeCloseEvent}),

    //2.3 索取赛事和主要玩法资料
    getEventInfoMBT:
      (SportId = IMSports.SOCCER, Market = VendorMarkets.EARLY, BetTypeIds = [IMBetType.HANDICAP,IMBetType.OVERUNDER], MarketlineLevels = [1], EventGroupTypeIds = [1] ) =>
      this._imFetch('GETEVENTINFOMBT', {SportId, Market, BetTypeIds, MarketlineLevels, EventGroupTypeIds }),

    //2.4 索取 DELTA 赛事和主要玩法详情
    getDeltaEventInfoMBT: (SportId = IMSports.SOCCER, Market = VendorMarkets.EARLY, BetTypeIds = [IMBetType.HANDICAP,IMBetType.OVERUNDER], MarketlineLevels = [1], Delta =  'Y') =>
      this._imFetch('GETDELTAEVENTINFOMBT', {SportId, Market, BetTypeIds, MarketlineLevels, Delta} ),

    //2.5 索取其他玩法资料
    getMLInfoOBT: (SportId= IMSports.SOCCER, Market= VendorMarkets.EARLY) =>
      this._imFetch('GETMLINFOOBT', {SportId, Market}),

    //2.6 索取 DELTA 其他玩法详情
    getDeltaMLInfoOBT: (SportId= IMSports.SOCCER, Market= VendorMarkets.EARLY, Delta= 'Y') =>
      this._imFetch('GETDELTAMLINFOOBT', {SportId, Market, Delta} ),

    //2.7 以页数索取赛事资料
    getEventInfoBYPAGE:
      (SportId = IMSports.SOCCER, Market = VendorMarkets.EARLY, Page = 1, PageRecords = 30,
       OrderBy = 1, BetTypeIds = [IMBetType.HANDICAP,IMBetType.OVERUNDER], MarketlineLevels = [1], EventGroupTypeIds = [1],
       IsCombo = false,) =>
        this._imFetch('GETEVENTINFOBYPAGE', {SportId, Market, Page, PageRecords, OrderBy, BetTypeIds, MarketlineLevels, EventGroupTypeIds, IsCombo }),

    //2.8 索取特定比賽資料  注意IsCombo 必須為 true 或 false 注意OddsType必帶，這個不像 GETEVENTINFOMBT 會返回全部OddsType，只會返回指定的盤口
    getSelectedEventInfo: (SportId= IMSports.SOCCER, EventIds= [123,456], OddsType= IMOddsType.HK, IsCombo= false, IncludeGroupEvents= true) =>
      this._imFetch('GETSELECTEDEVENTINFO', {SportId, EventIds, OddsType , IsCombo, IncludeGroupEvents}),

    //2.9 索取虚拟赛事列表
    getVSEventInfo: (SportId= IMSports.VIRTUALSOCCER, Season= 123, MatchDay= 123) =>
      this._imFetch('GETVSEVENTINFO', {SportId, Season, MatchDay}),

    //2.10 索取 DELTA 虚拟赛事列表
    getDeltaVSEventInfo: (SportId= IMSports.VIRTUALSOCCER, Season= 123, MatchDay= 123, Delta= 'Y') =>
      this._imFetch('GETDELTAVSEVENTINFO', {SportId, Season, MatchDay, Delta}, ),

    //2.11 索取虚拟赛事资料
    getVSEventDetails: (SportId= IMSports.VIRTUALSOCCER, EventId= 123) =>
      this._imFetch('GETVSEVENTDETAILS', {SportId, EventId}),

    //2.12 索取优胜冠军赛事
    getOutRightEvents: (SportId= IMSports.SOCCER) =>
      this._imFetch('GETOUTRIGHTEVENTS', {SportId}),

    //2.13 索取 DELTA 优胜冠军赛事
    getDeltaOutRightEventInfo: (SportId= IMSports.SOCCER, Delta= 'Y') =>
      this._imFetch('GETDELTAOUTRIGHTEVENTINFO', {SportId, Delta}),

    //2.14 索取现场赛果
    getLiveResults: (SportId= IMSports.SOCCER) =>
      this._imFetch('GETLIVERESULTS', {SportId} ),

    //2.15 SEARCH 搜索
    search : (filter, SportId= null, IsCombo=false, EventGroupTypeIds = [1]) =>
      this._imFetch('SEARCH', SportId ? {filter,SportId,IsCombo,EventGroupTypeIds} : {filter,IsCombo,EventGroupTypeIds}),

    //2.16 索取本地化翻譯
    getLocalizations: (LocalizationType= IMLocalizationType.ALL) =>
      this._imFetch('GETLOCALIZATIONS', {LocalizationType}),

    //2.17 索取 DELTA 本地化翻譯
    getDeltaLocalizations : (LocalizationType= IMLocalizationType.ALL, Delta= 'Y') =>
      this._imFetch('GETDELTALOCALIZATIONS ', {LocalizationType, Delta}, ),

    //2.18 索取完整赛果
    getCompletedResults: (SportId= IMSports.SOCCER, EventTypeId= IMEventType.FIXTURE, StartDate= '2020-09-15', EndDate= '2020-09-16') =>
      this._imFetch('GETCOMPLETEDRESULTS', {SportId, EventTypeId, StartDate, EndDate} ),

    //2.19 LOGOUT
    logOut: () =>
      this._imFetch('LOGOUT', {} ),

    //2.20 索取投注信息
    getBetInfo: (WagerType= WagerType.SINGLE, Selections= []) =>
      this._imFetch('GETBETINFO', {WagerType, WagerSelectionInfos: Selections} ),

    //2.21 投注
    placeBet: (WagerType= WagerType.SINGLE, Selections= [], ComboSelections = [], IsComboAcceptAnyOdds= false) =>
      this._imFetch('PLACEBET', {WagerType, WagerSelectionInfos: Selections, ComboSelections, IsComboAcceptAnyOdds, CustomerIP:'127.0.0.1', ServerIP:'192.168.88.88'} ),

    //2.22 索取投注明细
    getBetList: (BetConfirmationStatus= [IMWagerStatus.PENDING,IMWagerStatus.CONFIRMED,IMWagerStatus.REJECTED, IMWagerStatus.CANCELLED]) =>
      this._imFetch('GETBETLIST', {BetConfirmationStatus} ),

    //2.23 索取投注账目
    getStatement: (StartDate= '2020-09-15', EndDate= '2020-09-16', DateType = IMWagerSortWay.BETDATE) =>
      this._imFetch('GETSTATEMENT', {StartDate, EndDate, DateType} ),

    //2.24 索取余额
    getBalance: () =>
      this._imFetch('GETBALANCE', {} ),

    //2.25 索取待处理赌注状态
    getPendingWagerStatus: (WagerIds= []) =>
      this._imFetch('GETPENDINGWAGERSTATUS', {WagerIds} ),

    //2.26 索取通告
    getAnnouncement: () =>
      this._imFetch('GETANNOUNCEMENT', {OrderBy : 2} ),  //1升序 2降序

    //2.27 索取会员信息
    getMemberByToken: () =>
      this._imFetch('GETMEMBERBYTOKEN', {} ),

    //2.28 索取用户自定义
    getUserPreferences: () =>
      this._imFetch('GETUSERPREFERENCES', {} ),

    //TODO 用戶自定義應該用不到，後面看是否需要
    //2.29UPDATEUSERPREFERENCES 更新用户自定义
    //2.30GETFAVOURITEEVENT 索取所有收藏赛事资料
    //2.31ADDFAVOURITEEVENT 加收藏赛事
    //2.32REMOVEFAVOURITEEVENT 删除收藏赛事

    //TODO 這個函數特殊 delta不是必填 後面確認使用方式
    //2.33 提前兑现 DELTA
    getDeltaBetTrade: (WagerIds= []) =>
      this._imFetch('GETDELTABETTRADE', {WagerIds} ),

    //TODO 投注相關 後補
    //2.34 SUBMITBUYBACK 提交回购

    //2.35 索取赛事直播资料
    getLiveStreamingInfo: (SportId= IMSports.SOCCER, EventId= 123) =>
      this._imFetch('GETLIVESTREAMINGINFO', {SportId, EventId}),

    //TODO 用途不明，待確認
    //2.36 GETCOMPANYBYID 以 COMPANYID 索取公司设定
  };

  //哪些接口使用delta，主查詢和delta查詢  都配置指向delta查詢
  _DeltaAPIMapping = {
    //2.3 索取赛事和主要玩法资料
    GETEVENTINFOMBT:'GETDELTAEVENTINFOMBT',
    //2.4 索取 DELTA 赛事和主要玩法详情
    GETDELTAEVENTINFOMBT: 'GETDELTAEVENTINFOMBT',
    //2.5 索取其他玩法资料
    GETMLINFOOBT:'GETDELTAMLINFOOBT',
    //2.6 索取 DELTA 其他玩法详情,
    GETDELTAMLINFOOBT:'GETDELTAMLINFOOBT',
    //2.9 索取虚拟赛事列表
    GETVSEVENTINFO:'GETDELTAVSEVENTINFO',
    //2.10 索取 DELTA 虚拟赛事列表
    GETDELTAVSEVENTINFO:'GETDELTAVSEVENTINFO',
    //2.12 索取优胜冠军赛事
    GETOUTRIGHTEVENTS:'GETDELTAOUTRIGHTEVENTINFO',
    //2.13 索取 DELTA 优胜冠军赛事
    GETDELTAOUTRIGHTEVENTINFO:'GETDELTAOUTRIGHTEVENTINFO',
    //2.16 索取本地化翻譯
    GETLOCALIZATIONS:'GETDELTALOCALIZATIONS',
    //2.17 索取 DELTA 本地化翻譯
    GETDELTALOCALIZATIONS:'GETDELTALOCALIZATIONS',
  }

  //哪些接口支持登入後查詢(自動帶MemberCode和Token)
  _supportLoginAPIs = {
    GETEVENTINFOMBT:true,
    GETDELTAEVENTINFOMBT:true,
    GETEVENTINFOBYPAGE:true,
    GETSELECTEDEVENTINFO:true,
    GETVSEVENTINFO:true,
    GETDELTAVSEVENTINFO:true,
    GETOUTRIGHTEVENTS:true,
    GETDELTAOUTRIGHTEVENTINFO:true,
    LOGOUT:true,
    GETBETINFO:true,
    PLACEBET:true,
    GETBETLIST:true,
    GETSTATEMENT:true,
    GETBALANCE:true,
    GETPENDINGWAGERSTATUS:true,
    GETMEMBERBYTOKEN:true,
    GETUSERPREFERENCES:true,
    UPDATEUSERPREFERENCES:true,
    GETFAVOURITEEVENT:true,
    ADDFAVOURITEEVENT:true,
    REMOVEFAVOURITEEVENT:true,
    GETDELTABETTRADE:true,
    SUBMITBUYBACK:true,
  }

  //獲取體育項目，返回為 PollingResult 格式
  async getSports() {
    //獲取收藏賽事
    const favEvents = await this.getFavouriteEvents();

    return this._APIs.getAllSportCount()
      .then(jsonData => {
        const data = jsonData.SportCount;
        const SportDatas = data.map(item => {

          const favEventsForThisSport = favEvents.filter(favItem => item.SportId === favItem.SportId);

          const targetEventGroup = item.EventGroupTypes[0]; //只獲取主要的count

          return new SportData(
            item.SportId,
            item.SportName,
            targetEventGroup.Count,
            [  //順序 滾球 今天 關注 早盤 優勝冠軍
              new MarketData(VendorMarkets.RUNNING, VendorMarketNames[VendorMarkets.RUNNING], targetEventGroup.RBFECount ),
              new MarketData(VendorMarkets.FAVOURITE, VendorMarketNames[VendorMarkets.FAVOURITE], favEventsForThisSport.length ),
              //今日包含滾球
              new MarketData(VendorMarkets.TODAY, VendorMarketNames[VendorMarkets.TODAY], (targetEventGroup.TodayFECount ?? 0) + (targetEventGroup.RBFECount ?? 0) ),
              new MarketData(VendorMarkets.EARLY, VendorMarketNames[VendorMarkets.EARLY], targetEventGroup.EarlyFECount ),
              new MarketData(VendorMarkets.OUTRIGHT, VendorMarketNames[VendorMarkets.OUTRIGHT], targetEventGroup.ORCount ),
            ]
          )
        });
        return new PollingResult(SportDatas);
      })
  }

  //獲取聯賽(好像沒有用)
  getLeagues(SportId = IMSports.SOCCER, MarketId = VendorMarkets.EARLY) {
    //注意聯賽在IM 叫 Competition 統一修正為 League
    return this._APIs.getAllCompetitionCount(SportId, MarketId)
      .then(jsonData => {
        const data = jsonData.CompetitionCount;
        return data.map(item => {
          return new LeagueData(
            item.CompetitionId,
            item.CompetitionName,
            item.Count,
            item.SportId,
            item.Market,
          )
        });
      })
  }

  //獲取比賽列表 返回為 PollingResult 格式(支持比對數據變化)
  //extraConfigs.MaxCount 支持指定獲取前幾個賽事 banner使用 這個IM無法用，接口不支持，不影響 就是會多返回數據
  async getEvents(SportId = IMSports.SOCCER, MarketId = VendorMarkets.EARLY, sortWay = SortWays.LeagueName, startDate = null, endDate = null
            , extraConfigs = {}) {

    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //獲取收藏賽事
    const favEvents = await this.getFavouriteEvents();
    const favEventsForThisSport = favEvents.filter(item => item.SportId === SportId);
    const favEventIdsForThisSport = favEventsForThisSport.map(item => item.EventId);

    let queryPromise = null;

    //關注(收藏)
    if(MarketId === VendorMarkets.FAVOURITE) {

      //沒數據直接返回空
      if (favEventsForThisSport.length <=0) {
        return new Promise(resolve => resolve(new PollingResult([])));
      }

      //轉成EventInfo格式
      const favEventInfos = favEventsForThisSport.map(fe => {
        return new EventInfo(fe.EventId,fe.SportId,(fe.IsOutRightEvent === true ? true : false));
      })

      queryPromise = this.getEventsDetail(favEventInfos).then(async pr => {
          pr.NewData.map(item => {
            if (item.IsOutRightEvent) {
              //猜冠軍，自動切selection只保留前４個
              if (item.Lines && item.Lines.length > 0) {
                item.Lines.map(l => {
                  if (l.Selections && l.Selections.length > 4) {
                    l.Selections = l.Selections.filter((s,index) => index < 4);
                  }
                })
              }
            } else {
              //一般比賽 這裡拿到的是全投注線的，只需要讓球跟大小
              item.Lines = item.Lines.filter(l => l.BetTypeId === IMBetType.HANDICAP || l.BetTypeId === IMBetType.OVERUNDER);
              item.updateLineGroupCount();
            }
          })

          //移除 沒有數據的 關注比賽
          let existEventIds = [];
          const AllEventDatas =  pr.NewData;
          if (AllEventDatas && AllEventDatas.length >0) {
            existEventIds = AllEventDatas.map(e => e.EventId);
          }
          const notExistEventIds = favEventsForThisSport.filter(e => existEventIds.indexOf(e.EventId) === -1).map(e => e.EventId);
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

          return pr;
        });

    } else if (MarketId === VendorMarkets.OUTRIGHT) {  //優勝冠軍

      queryPromise = this._getOutRightEvents(SportId, null, true);

    } else {
      queryPromise = this._APIs.getEventInfoMBT(SportId, MarketId)
        .then(async jsonData => {

          if (!jsonData.isDeltaQuery) {
            //主查詢

            //考慮沒有盤口的情況，返回空數組
            if (!jsonData.Sports || jsonData.Sports.length <= 0) {
              //記得額外儲存一個空的主查詢結果，不然後面調用delta查詢 會報錯
              if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey]) {
                this._APIDeltas[jsonData.deltaKey].full = [];
              }
              return new PollingResult([]);
            }

            const data = jsonData.Sports[0].Events;
            const SportId = jsonData.Sports[0].SportId;
            const EventDatas = data.map((item, index) => {
              //console.log('handle',index, item.EventId)
              return EventData.createFromIMSource(item, SportId, favEvents, OddsType, MemberType);
            });

            //儲存主查詢結果
            if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey]) {
              this._APIDeltas[jsonData.deltaKey].full = EventDatas;
            }

            const cloneEventDatas = EventDatas.map(ed => EventData.clone(ed)); //複製一份 不要和保存的內容共用實例

            return new PollingResult(cloneEventDatas);
          } else {
            //Delta查詢
            //拿出之前存的主查詢結果
            let SavedEventDatas = [];
            if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey] && this._APIDeltas[jsonData.deltaKey].full) {
              SavedEventDatas = this._APIDeltas[jsonData.deltaKey].full;
            }

            //更新收藏狀態(下面只會處理變更項目，不會更新全部數據，所以要在這裡 直接全部處理)
            SavedEventDatas.map(item => {
              if (favEventIdsForThisSport.indexOf(item.EventId) !== -1) {
                item.IsFavourite = true;
              } else {
                item.IsFavourite = false;
              }
            });

            let hasDeletedFavourite = false; //關注比賽 是否有被刪除

            const data = jsonData.DeltaChanges;
            let deleteEventIds = [];
            const EventChanges = data.map((item, index) => {
              if (item.Action === IMDeltaAction.DELETE) {
                deleteEventIds.push(item.EventId);
                //刪除比賽
                return new EventChangeData(
                  item.EventId,
                  EventChangeType.Delete
                );
              } else {
                const existEvents = SavedEventDatas.filter(existItem => {
                  return existItem.EventId === item.EventId
                })
                const newEventSource = JSON.parse(item.Value);
                //console.log('newEventSource',newEventSource);
                const newEvent = EventData.createFromIMSource(newEventSource[0].Events[0], newEventSource[0].SportId, favEvents, OddsType, MemberType);
                if (!existEvents || existEvents.length <= 0) {
                  //新增比賽
                  return new EventChangeData(
                    item.EventId,
                    EventChangeType.New,
                    null,
                    newEvent,
                  );
                } else {
                  //修改比賽
                  return new EventChangeData(
                    item.EventId,
                    EventChangeType.Update,
                    existEvents[0],
                    newEvent,
                  );
                }
              }
            });

            if (deleteEventIds && deleteEventIds.length > 0) {
              //刪除收藏
              //console.log('====remove fav event from getEvents->queryPromise for VendorMarkets.NORMALs')
              hasDeletedFavourite = await this.removeFavouriteEvent(deleteEventIds);
            }

            if (hasDeletedFavourite){ //關注比賽 有被刪除
              //強制刷新 體育計數
              if (typeof window !== "undefined" && window.eventListing_updateSportsCount) {
                window.eventListing_updateSportsCount(this.configs.VendorName);
              }
            }

            //套用差異更新
            //刪除
            const DeletedEventIds = EventChanges.map(change => {
              if (change.ChangeType === EventChangeType.Delete) {
                return change.EventId;
              }
            })
            if (DeletedEventIds && DeletedEventIds.length > 0) {
              SavedEventDatas = SavedEventDatas.filter(event => {
                return (DeletedEventIds.indexOf(event.EventId) === -1);
              })
            }

            EventChanges.map(change => {
              //更新
              if (change.ChangeType === EventChangeType.Update) {
                let targetIndex = null;
                SavedEventDatas.map((event, index) => {
                  if (event.EventId === change.EventId) {
                    targetIndex = index;
                  }
                })

                if (targetIndex !== null) {
                  SavedEventDatas[targetIndex] = change.NewValue;
                }

                //新增
              } else if (change.ChangeType === EventChangeType.New) {
                SavedEventDatas.push(change.NewValue);
              }
            })

            //儲存套用差異更新後的結果
            if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey]) {
              this._APIDeltas[jsonData.deltaKey].full = SavedEventDatas;
            }

            const cloneEventDatas = SavedEventDatas.map(ed => EventData.clone(ed)); //複製一份 不要和保存的內容共用實例

            return new PollingResult(cloneEventDatas, EventChanges);
          }
        })
        .then(result => { //按配置的時間區段過濾
          if ((startDate == null && endDate == null) || MarketId !== VendorMarkets.EARLY) {
            return result;
          }

          const Events = result.NewData;
          const Changes = result.Changes;
          //console.log(startDate,endDate);
          const filteredEvents = Events !== null ? Events.filter(item => {
            if (endDate == null) {
              return (startDate <= item.EventDateLocal);
            } else {
              return (startDate <= item.EventDateLocal) && (item.EventDateLocal <= endDate);
            }
          }) : []

          const filteredChanges = Changes.filter(item => {
            if (item.ChangeType !== EventChangeType.Delete) {
              if (endDate == null) {
                return (startDate <= item.NewValue.EventDateLocal);
              } else {
                return (startDate <= item.NewValue.EventDateLocal) && (item.NewValue.EventDateLocal <= endDate);
              }
            }
          });

          return new PollingResult(filteredEvents, filteredChanges);
        })
    }

    return queryPromise
      .then(result => {
        //處理排序
        result.NewData = EventData.sortEvents(result.NewData, sortWay);

        //排序投注線
        if (result.NewData && result.NewData.length > 0) {
          result.NewData.map(item => {
            item.sortLines();
          })
        }

        return result;
      })
  }

  //獲取優勝冠軍賽事 返回為 PollingResult 格式(支持比對數據變化)
  //IM強制歐洲盤，所以沒有盤口可選
  //排序在getEvents統一處理
  //因為IM沒有提供單個查詢的函數，這裏額外加一個eventIds參數，用來過濾數據，獲取特定單個或多個
  //ForListing用來提供列表頁的數據，自動切selection只保留前４個
  async _getOutRightEvents(SportId = IMSports.SOCCER, eventIds = null, ForListing = false) {

    if (eventIds !== null && eventIds.length > 0) {
      eventIds = eventIds.map(e => parseInt(e)); //轉換一下
    }

    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //獲取收藏賽事
    const favEvents = await this.getFavouriteEvents();
    const favEventsForThisSport = favEvents.filter(item => item.SportId === SportId);
    const favEventIdsForThisSport = favEventsForThisSport.map(item => item.EventId);

    return this._APIs.getOutRightEvents(SportId)
      .then(async jsonData => {
        //注意優勝冠軍的接口不一樣，返回結構也和Events不一樣  都要特別處理

        if (!jsonData.isDeltaQuery) {
          //主查詢

          //考慮沒有盤口的情況，返回空數組
          if (!jsonData.Events || jsonData.Events.length <= 0) {  //直接返回Events 沒有Sports這層
            //記得額外儲存一個空的主查詢結果，不然後面調用delta查詢 會報錯
            if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey]) {
              this._APIDeltas[jsonData.deltaKey].full = [];
            }
            return new PollingResult([]);
          }

          const data = jsonData.Events;
          const EventDatas = data.map((item, index) => {
            //console.log('handle',index, item.EventId)
            return EventData.createFromIMOutRightSource(item, SportId, favEvents, OddsType, MemberType);
          });

          //儲存主查詢結果
          if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey]) {
            this._APIDeltas[jsonData.deltaKey].full = EventDatas;
          }

          //複製一份 不要和保存的內容共用實例
          let cloneEventDatas = EventDatas.map(ed => EventData.clone(ed));

          //過濾
          if (eventIds !== null && eventIds.length > 0) {
            cloneEventDatas = cloneEventDatas.filter(ed => eventIds.indexOf(ed.EventId) !== -1 );
          }

          return new PollingResult(cloneEventDatas);
        } else {
          //Delta查詢
          //拿出之前存的主查詢結果
          let SavedEventDatas = [];
          if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey] && this._APIDeltas[jsonData.deltaKey].full) {
            SavedEventDatas = this._APIDeltas[jsonData.deltaKey].full;
          }

          //更新收藏狀態(下面只會處理變更項目，不會更新全部數據，所以要在這裡 直接全部處理)
          SavedEventDatas.map(item => {
            if (favEventIdsForThisSport.indexOf(item.EventId) !== -1) {
              item.IsFavourite = true;
            } else {
              item.IsFavourite = false;
            }
          });

          //優勝冠軍的delta分開 InsertUpdateEvent 和 RemoveEvent

          let hasDeletedFavourite = false; //關注比賽 是否有被刪除
          let deleteEventIds = [];
          const RemoveChanges = jsonData.RemoveEvent.map(item => {
            deleteEventIds.push(item);
            //刪除比賽
            return new EventChangeData(
              item, //優勝冠軍給的是 直接 item = EventId
              EventChangeType.Delete
            );
          })

          if (deleteEventIds && deleteEventIds.length > 0) {
            //刪除收藏
            //console.log('====remove fav event from _getOutRightEvents')
            hasDeletedFavourite = await this.removeFavouriteEvent(deleteEventIds);
          }

          if (hasDeletedFavourite){ //關注比賽 有被刪除
            //強制刷新 體育計數
            if (typeof window !== "undefined" && window.eventListing_updateSportsCount) {
              window.eventListing_updateSportsCount(this.configs.VendorName);
            }
          }

          const InsertUpdateChanges = jsonData.InsertUpdateEvent.map(item => {
            const existEvents = SavedEventDatas.filter(existItem => {
              return existItem.EventId === item.EventId
            })
            //console.log('newEventSource',newEventSource);
            const newEvent = EventData.createFromIMOutRightSource(item, SportId, favEvents, OddsType, MemberType);
            if (!existEvents || existEvents.length <= 0) {
              //新增比賽
              return new EventChangeData(
                item.EventId,
                EventChangeType.New,
                null,
                newEvent,
              );
            } else {
              //修改比賽
              return new EventChangeData(
                item.EventId,
                EventChangeType.Update,
                existEvents[0],
                newEvent,
              );
            }
          });

          let EventChanges = InsertUpdateChanges.concat(RemoveChanges);

          //套用差異更新
          //刪除
          const DeletedEventIds = EventChanges.map(change => {
            if (change.ChangeType === EventChangeType.Delete) {
              return change.EventId;
            }
          })
          if (DeletedEventIds && DeletedEventIds.length > 0) {
            SavedEventDatas = SavedEventDatas.filter(event => {
              return (DeletedEventIds.indexOf(event.EventId) === -1);
            })
          }

          EventChanges.map(change => {
            //更新
            if (change.ChangeType === EventChangeType.Update) {
              let targetIndex = null;
              SavedEventDatas.map((event, index) => {
                if (event.EventId === change.EventId) {
                  targetIndex = index;
                }
              })

              if (targetIndex !== null) {
                SavedEventDatas[targetIndex] = change.NewValue;
              }

              //新增
            } else if (change.ChangeType === EventChangeType.New) {
              SavedEventDatas.push(change.NewValue);
            }
          })

          //儲存套用差異更新後的結果
          if (jsonData.deltaKey && this._APIDeltas[jsonData.deltaKey]) {
            this._APIDeltas[jsonData.deltaKey].full = SavedEventDatas;
          }

          //複製一份 不要和保存的內容共用實例
          let cloneEventDatas = SavedEventDatas.map(ed => EventData.clone(ed));

          //過濾
          if (eventIds !== null && eventIds.length > 0) {
            cloneEventDatas = cloneEventDatas.filter(ed => eventIds.indexOf(ed.EventId) !== -1 );
            EventChanges = EventChanges.filter(ec => eventIds.indexOf(ec.EventId) !== -1 )
          }

          return new PollingResult(cloneEventDatas, EventChanges);
        }
      }).then(pr => {
        //如果是 列表頁展示，自動切selection只保留前４個
        if (ForListing && pr.NewData && pr.NewData.length > 0) {
          pr.NewData.map(e => {
            if (e.Lines && e.Lines.length > 0) {
              e.Lines.map(l => {
                if (l.Selections && l.Selections.length > 4) {
                  l.Selections = l.Selections.filter((s,index) => index < 4);
                }
              })
            }
          })
        }

        return pr;
      })
      //優勝冠軍沒有時間過濾
  }

  //獲取分頁後的賽事 返回為 PollingResult 格式(不支持比對數據變化)
  async getEventsPaged(SportId = IMSports.SOCCER, MarketId = VendorMarkets.EARLY, sortWay = SortWays.LeagueName, startDate = null, endDate = null,
                       page =1, pageRecords= 30, extraConfigs = {}) {

    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //獲取收藏賽事
    const favEvents = await this.getFavouriteEvents();

    let pagedDataOrderBy = 2; //1 = 赛事日期时间顺序 2 = IM 体育顺序
    if (sortWay === SortWays.EventTime) {
      pagedDataOrderBy = 1;
    }
    return this._APIs.getEventInfoBYPAGE(SportId, MarketId, page, pageRecords, pagedDataOrderBy)
      .then(jsonData => {
        //考慮沒有盤口的情況，返回空數組
        if (!jsonData.Sports || jsonData.Sports.length <= 0) {
          return new PollingResult([]);
        }

        const data = jsonData.Sports[0].Events;
        const SportId = jsonData.Sports[0].SportId;
        const eventDatas = data.map((item, index) => {
          return EventData.createFromIMSource(item, SportId, favEvents, OddsType, MemberType);
        });

        return new PollingResult(eventDatas);
      })
      .then(result => { //按配置的時間區段過濾
        if ((startDate == null && endDate == null) || MarketId !== VendorMarkets.EARLY) {
          return result;
        }

        const Events = result.NewData;
        const filteredEvents = Events !== null ? Events.filter(item => {
          if (endDate == null) {
            return (startDate <= item.EventDateLocal);
          } else {
            return (startDate <= item.EventDateLocal) && (item.EventDateLocal <= endDate);
          }
        }) : []

        return new PollingResult(filteredEvents);
      })
      .then(result => {
        //處理排序
        result.NewData = EventData.sortEvents(result.NewData, sortWay);

        //排序投注線
        if (result.NewData && result.NewData.length > 0) {
          result.NewData.map(item => {
            item.sortLines();
          })
        }

        return result;
      })
  }

  //獲取 預緩存 賽事 返回為 PollingResult 格式(不支持比對數據變化)
  async getPreCacheEventsFromCacheAPI(SportId = IMSports.SOCCER, MarketId = VendorMarkets.EARLY, sortWay = SortWays.LeagueName, startDate = null, endDate = null) {
    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //獲取收藏賽事
    const favEvents = await this.getFavouriteEvents();
    const favEventsForThisSport = favEvents.filter(item => item.SportId === 1);
    const favEventIdsForThisSport = favEventsForThisSport.map(item => item.EventId);

    const eventDatas = await fetch(HostConfig.Config.CacheApi + '/events/im/'
        + SportId + '/' + MarketId + '/' + sortWay
        + ((startDate !== null && MarketId === VendorMarkets.EARLY) ? ('/' + startDate) : '')
        + ((endDate !== null && MarketId === VendorMarkets.EARLY)? ('/' + endDate): '')
      )
      .then(response => response.json())
      .then(jsonData => {
        let events = [];
        if (jsonData && jsonData.data && jsonData.data.length > 0) {
          events = jsonData.data.map(ev => EventData.clone(ev, OddsType, MemberType)); //需要轉換一下
          //更新收藏狀態
          events.map(item => {
            if (favEventIdsForThisSport.indexOf(item.EventId) !== -1) {
              item.IsFavourite = true;
            } else {
              item.IsFavourite = false;
            }
          });
        }
        return events;
      }).catch(e => {
        console.log('===getPreCacheEventsFromCacheAPI has error',e);
        return null;
      })

    if (eventDatas) {
      return new PollingResult(eventDatas);
    } else {
      return null;
    }
  }

  //獲取歐洲杯比賽列表 返回為 PollingResult 格式(支持比對數據變化)
  async getEUROCUP202021Events() {
    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //獲取收藏賽事
    const favEvents = await this.getFavouriteEvents();
    const favEventsForThisSport = favEvents.filter(item => item.SportId === 1);
    const favEventIdsForThisSport = favEventsForThisSport.map(item => item.EventId);

    let eventDatas = await fetch(HostConfig.Config.CacheApi + '/eurocup202021')
        .then(response => response.json())
        .then(jsonData => {
          let events = [];
          if (jsonData && jsonData.eurocup202021 && jsonData.eurocup202021.length > 0) {
            events = jsonData.eurocup202021.map(ev => EventData.clone(ev, OddsType, MemberType)); //需要轉換一下
            //更新收藏狀態
            events.map(item => {
              if (favEventIdsForThisSport.indexOf(item.EventId) !== -1) {
                item.IsFavourite = true;
              } else {
                item.IsFavourite = false;
              }
            });
          }
          return events;
        })
        .catch(e => {
          console.log('===getEUROCUP202021Events has error',e);
          return [];
        })

    const cahceKey = 'getEUROCUP202021Events';
    const oldDatas = this._cacheGet(cahceKey);

    //比對差異
    let changes = [];
    if (oldDatas !== null) {
      let newEventIds = eventDatas.map(ev => ev.EventId);
      let oldEventMap = {}
      oldDatas.map(oev => {
        oldEventMap[oev.EventId] = oev;
        //已刪除
        if (newEventIds.indexOf(oev.EventId) === -1) {
          changes.push(new EventChangeData(oev.EventId, EventChangeType.Delete, oev));
        }
      });
      eventDatas.map(ev => {
        let oev = oldEventMap[ev.EventId];
        if (oev) {
          //變更 有變化的才紀錄
          if (JSON.stringify(oev) !== JSON.stringify(ev)) {
            changes.push(new EventChangeData(ev.EventId, EventChangeType.Update, oev, ev));
          }
        } else {
          //新增
          changes.push(new EventChangeData(ev.EventId, EventChangeType.New, null, ev));
        }
      })
    }

    //記錄新數據
    this._cacheSet(cahceKey,eventDatas)
    //複製一份 不要和保存的內容共用實例
    const cloneEventDatas = eventDatas.map(ev => EventData.clone(ev));
    return new PollingResult(cloneEventDatas,changes);
  }

  //獲取 單一個 比賽信息 返回為 PollingResult 格式(支持比對數據變化)
  async getEventDetail(SportId= IMSports.SOCCER, EventId, isOutRightEvent = false) {

    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //優勝冠軍另外查
    if (isOutRightEvent) {
      return this._getOutRightEvents(SportId,[EventId]).then(pr => {
        if (pr.NewData && pr.NewData.length > 0) {
          return new PollingResult(pr.NewData[0]); //只要返回單個
        } else {
          return new PollingResult(null);
        }
      })
    }

    return this._APIs.getSelectedEventInfo(SportId, [EventId], OddsType)
      .then(async jsonData => {

        //考慮沒有盤口的情況，返回空
        if (!jsonData.Sports || jsonData.Sports.length <= 0 || !jsonData.Sports[0] || jsonData.Sports[0].Events.length <=0) {
          return new PollingResult(null);
        }

        //獲取收藏賽事
        const favEvents = await this.getFavouriteEvents();

        //現在 getSelectedEventInfo 開啟了 IncludeGroupEvents=true
        //可能會返回多個，包含不同EventGroup的數據
        const mainEvents = jsonData.Sports[0].Events.filter(ev => ev.EventGroupTypeId === 1); //EventGroupTypeId === 1的才是主要比賽

        const item = (mainEvents && mainEvents.length > 0) ? mainEvents[0] : null;
        if (item) {
          const SportId = jsonData.Sports[0].SportId;
          const eventData = EventData.createFromIMSource(item,SportId,favEvents, OddsType, MemberType);

          //合併eventGroup的投注數據
          eventData.IMMergeSideEvents(jsonData.Sports[0].Events,favEvents);

          const deltaKey = this._getDeltaKey('GETSELECTEDEVENTINFO', {EventId});
          const oldEventData = this._APIDeltas[deltaKey];
          let eventChanges = [];
          if (oldEventData) {
            //有變化的才紀錄EventChangeData
            if (JSON.stringify(oldEventData) !== JSON.stringify(eventData)) {
              eventChanges.push(new EventChangeData(eventData.EventId, EventChangeType.Update, oldEventData, eventData));
            }
          } else {
            eventChanges.push(new EventChangeData(eventData.EventId, EventChangeType.New, null, eventData));
          }

          //保存查詢結果
          this._APIDeltas[deltaKey] = eventData;

          //複製一份 不要和保存的內容共用實例
          let thisEventData = EventData.clone(eventData);

          //排序投注線
          if (thisEventData) {
            thisEventData.IMSortLinesAndSelections();
          }

          return new PollingResult(thisEventData, eventChanges);
        } else {
          return new PollingResult(null);
        }
      })
      .catch(error => {
        //處理比賽結束 or 找不到數據
        if (typeof error === 'object' && error.isVendorError === true) {
          if (error.ErrorType === VendorErrorType.BET_Event_Error) {
            return new PollingResult(null);
          }
        } else {
          throw error;
        }
      })
  }

  //獲取多個比賽信息，傳入為EventInfo數組(支持不同體育項目和 一般/優勝冠軍 賽事混查)， 返回為 PollingResult 格式(支持比對數據變化)
  async getEventsDetail(EventInfos = []) {

    const OddsType = this.getMemberSetting().oddsType;
    const MemberType = this._getMemberType(); //水位

    //支持傳入動態的EventInfo
    if (typeof EventInfos === 'function') {
      EventInfos = EventInfos();
      if (!!EventInfos && typeof EventInfos.then === 'function') {
        EventInfos = await EventInfos;
      }
    }

    //語法糖支持：單個改為數組
    if (!Array.isArray(EventInfos)) {
      EventInfos = [EventInfos];
    }

    //空查詢數據 直接返回
    if (EventInfos.length <=0) {
      return new Promise(resolve => resolve(new PollingResult([])));
    }

    //按體育和優勝冠軍分組
    let eventIdsBySportAndOutRight = {};
    EventInfos.map(item => {
      if (!eventIdsBySportAndOutRight[item.SportId]) {
        eventIdsBySportAndOutRight[item.SportId] = {normal: [], outright: []}; //裡面還要分 一般賽事 跟 優勝冠軍賽事
      }
      if (item.IsOutRightEvent) {
        eventIdsBySportAndOutRight[item.SportId].outright.push(item.EventId);
      } else {
        eventIdsBySportAndOutRight[item.SportId].normal.push(item.EventId);
      }
    })

    let promiseArr = [];
    for(let sportId in eventIdsBySportAndOutRight) {
      if (eventIdsBySportAndOutRight[sportId]) {
        //分體育項目

        //查優勝冠軍
        if (eventIdsBySportAndOutRight[sportId].outright && eventIdsBySportAndOutRight[sportId].outright.length >0) {
          const outrightPromise = this._getOutRightEvents(sportId,eventIdsBySportAndOutRight[sportId].outright);
          promiseArr.push(outrightPromise);
        }
        //查一般比賽
        if (eventIdsBySportAndOutRight[sportId].normal && eventIdsBySportAndOutRight[sportId].normal.length >0) {
          const normalPromise = this._APIs.getSelectedEventInfo(sportId, eventIdsBySportAndOutRight[sportId].normal, OddsType)
            .then(async jsonData => {

              //考慮沒有盤口的情況，返回空數組
              if (!jsonData.Sports || jsonData.Sports.length <= 0) {
                return new PollingResult([]);
              }

              //獲取收藏賽事
              const favEvents = await this.getFavouriteEvents();

              //現在 getSelectedEventInfo 開啟了 IncludeGroupEvents=true
              //可能會返回多個，包含不同EventGroup的數據

              const mainEvents = jsonData.Sports[0].Events.filter(ev => ev.EventGroupTypeId === 1); //EventGroupTypeId === 1的才是主要比賽

              let eventChanges = [];
              const eventDatas = mainEvents.map((item, index) => {
                //console.log('handle',index, item.EventId)
                const eventData = EventData.createFromIMSource(item, sportId, favEvents, OddsType, MemberType);

                //合併eventGroup的投注數據
                eventData.IMMergeSideEvents(jsonData.Sports[0].Events,favEvents);

                const deltaKey = this._getDeltaKey('GETSELECTEDEVENTINFO_getEventsDetail', {EventId: item.EventId}); //和一般的getEventDetail分開儲存
                const oldEventData = this._APIDeltas[deltaKey];
                if (oldEventData) {
                  //有變化的才紀錄EventChangeData
                  if (JSON.stringify(oldEventData) !== JSON.stringify(eventData)) {
                    eventChanges.push(new EventChangeData(eventData.EventId, EventChangeType.Update, oldEventData, eventData));
                  }
                } else {
                  eventChanges.push(new EventChangeData(eventData.EventId, EventChangeType.New, null, eventData));
                }

                //保存查詢結果
                this._APIDeltas[deltaKey] = eventData;

                //複製一份 不要和保存的內容共用實例
                let thisEventData = EventData.clone(eventData);

                //排序投注線
                if (thisEventData) {
                  thisEventData.IMSortLinesAndSelections();
                }

                return thisEventData;
              });

              return new PollingResult(eventDatas, eventChanges);
            })
            .catch(error => {
              //處理比賽結束 or 找不到數據
              if (typeof error  === 'object' && error.isVendorError === true) {
                if (error.ErrorType === VendorErrorType.BET_Event_Error) {
                  return new PollingResult([]);
                }
              } else {
                throw error;
              }
            })
          promiseArr.push(normalPromise);
        }
      }
    }

    return Promise.all(promiseArr).then(PRsArray => {
      let events = [];
      let changes = [];
      PRsArray.map(pr => {
        if (pr.NewData && pr.NewData.length > 0) {
          events = events.concat(pr.NewData);
        }
        if (pr.Changes && pr.Changes.length > 0) {
          changes = changes.concat(pr.Changes);
        }
      })

      return new PollingResult(events,changes);
    });
  }

  /**
   * 全局 輪詢獲取體育項目 30秒一次
   *
   * @param subscriberName     訂閱者名稱，用來處理重複訂閱的狀況
   * @param onUpdateCallback   輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData:SportData數組, Changes:空數組}
   * @param uniqueName         用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getSportsPollingGlobal(subscriberName, onUpdateCallback, uniqueName = '') {
    return this._subscribeGlobalPolling('getSportsPolling', subscriberName, onUpdateCallback,{}, uniqueName, true);
  }

  /**
   * 輪詢獲取體育項目 30秒一次
   *
   * @param onUpdateCallback   輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData:SportData數組, Changes:空數組}
   * @param uniqueName         用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getSportsPolling(onUpdateCallback, uniqueName = '') {
    const dataQuery = () => this.getSports();
    return this._registerPolling('getSportsPolling',{}, dataQuery, onUpdateCallback, 30, uniqueName, true);
  }

  /**
   * 全局 輪詢獲取比賽數據 10秒一次
   *
   * @param subscriberName     訂閱者名稱，用來處理重複訂閱的狀況
   * @param onUpdateCallback   輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData:EventData數組, Changes:EventChangeData數組}
   * @param SportId            體育項目ID
   * @param MarketId           市場ID
   * @param sortWay            排序方式 1聯賽 2時間
   * @param startDate          比賽日期過濾 YYYY-MM-DD 格式(只有MarketId = 早盤(1)才有效)
   * @param endDate            比賽日期過濾 YYYY-MM-DD 格式(只有MarketId = 早盤(1)才有效)
   * @param uniqueName         用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEventsPollingGlobal(subscriberName, onUpdateCallback, SportId = IMSports.SOCCER, MarketId = VendorMarkets.EARLY, sortWay = SortWays.LeagueName, startDate = null, endDate = null, uniqueName = '') {
    return this._subscribeGlobalPolling('getEventsPolling', subscriberName, onUpdateCallback,{SportId, MarketId, sortWay, startDate, endDate}, uniqueName, true);
  }

  /**
   * 輪詢獲取比賽數據 10秒一次
   *
   * @param onUpdateCallback   輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData:EventData數組, Changes:EventChangeData數組}
   * @param SportId            體育項目ID
   * @param MarketId           市場ID
   * @param sortWay            排序方式 1聯賽 2時間
   * @param startDate          比賽日期過濾 YYYY-MM-DD 格式(只有MarketId = 早盤(1)才有效)
   * @param endDate            比賽日期過濾 YYYY-MM-DD 格式(只有MarketId = 早盤(1)才有效)
   * @param uniqueName         用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEventsPolling(onUpdateCallback, SportId = IMSports.SOCCER, MarketId = VendorMarkets.EARLY, sortWay = SortWays.LeagueName, startDate = null, endDate = null, uniqueName = '') {
    const dataQuery = () => {
      if (MarketId === VendorMarkets.TODAY) { //今日包含滾球
        const runningPromise = this.getEvents(SportId, VendorMarkets.RUNNING, sortWay, startDate, endDate);
        const todayPromise = this.getEvents(SportId, VendorMarkets.TODAY, sortWay, startDate, endDate);

        return Promise.all([runningPromise,todayPromise]).then(values => {
          const prRunning = values[0];
          const prToday = values[1];

          //今日 要把滾球往前放
          const runningEvents = prRunning.NewData ?? [];
          const runningChanges = prRunning.Changes ?? [];
          const todayEvents = prToday.NewData ?? [];
          const todayChanges = prToday.Changes ?? [];
          const eventDatas = runningEvents.concat(todayEvents);
          const eventChanges = runningChanges.concat(todayChanges);

          return new PollingResult(eventDatas,eventChanges);
        });
      } else {
        return this.getEvents(SportId, MarketId, sortWay, startDate, endDate);
      }
    }
    //分頁查詢 加速
    const preCacheQuery = () => {
      if (HostConfig.Config.nodePort) { //API服務器不需要preCache
        return new Promise(resolve => resolve(null));
      }

      if (MarketId === VendorMarkets.FAVOURITE || MarketId === VendorMarkets.OUTRIGHT) {
        //關注比賽 和 猜冠軍 不加速，因為無法直接用分頁查詢
        return new Promise(resolve => resolve(null));
      } else{
        //用緩存API 加速
        return this.getPreCacheEventsFromCacheAPI(SportId,MarketId, sortWay, startDate, endDate);
      }
    }
    return this._registerPolling('getEventsPolling', {SportId, MarketId, sortWay, startDate, endDate}, dataQuery, onUpdateCallback, 10, uniqueName, true, 9*60, preCacheQuery);
  }

  /**
   * 全局 輪詢獲取 歐洲杯2020-21 比賽數據 10秒一次
   *
   * @param subscriberName     訂閱者名稱，用來處理重複訂閱的狀況
   * @param onUpdateCallback   輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData:EventData數組, Changes:EventChangeData數組}
   * @param uniqueName         用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEUROCUP202021EventsPollingGlobal(subscriberName, onUpdateCallback, uniqueName = '') {
    return this._subscribeGlobalPolling('getEUROCUP202021EventsPolling', subscriberName, onUpdateCallback,{}, uniqueName, false);
  }

  /**
   * 輪詢獲取 歐洲杯2020-21 比賽數據 10秒一次
   *
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData:EventData數組, Changes:EventChangeData數組}
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEUROCUP202021EventsPolling(onUpdateCallback, uniqueName = '') {
    const dataQuery = () => this.getEUROCUP202021Events();
    return this._registerPolling('getEUROCUP202021EventsPolling', {}, dataQuery, onUpdateCallback, 10, uniqueName, true);
  }

  /**
   * 輪詢獲取 單個 比賽數據 10秒一次
   *
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData: 單個EventData數據, Changes: EventChangeData 數組}
   * @param SportId           體育項目ID
   * @param EventId           比賽ID
   * @param isOutRightEvent   是否優勝冠軍賽事
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEventDetailPolling(onUpdateCallback, SportId = IMSports.SOCCER, EventId, isOutRightEvent = false, uniqueName = '') {
    const dataQuery = () => this.getEventDetail(SportId, EventId, isOutRightEvent);
    return this._registerPolling('getEventDetailPolling', {SportId, EventId, isOutRightEvent}, dataQuery, onUpdateCallback, 10, uniqueName, true);
  }

  /**
   * 全局 輪詢獲取 多個 比賽數據 10秒一次
   *
   * @param subscriberName    訂閱者名稱，用來處理重複訂閱的狀況
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData: EventData數組, Changes: EventChangeData 數組}
   * @param EventInfos        要輪詢的比賽，EventInfo數組(支持不同體育項目和 一般/優勝冠軍 賽事混查)
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEventsDetailPollingGlobal(subscriberName, onUpdateCallback, EventInfos = [], uniqueName = '') {
    return this._subscribeGlobalPolling('getEventsDetailPolling', subscriberName, onUpdateCallback,{EventInfos}, uniqueName);
  }

  /**
   * 輪詢獲取 多個 比賽數據 10秒一次
   *
   * @param onUpdateCallback  輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData: EventData數組, Changes: EventChangeData 數組}
   * @param EventInfos        要輪詢的比賽，EventInfo數組(支持不同體育項目和 一般/優勝冠軍 賽事混查)
   * @param uniqueName        用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   */
  getEventsDetailPolling(onUpdateCallback, EventInfos = [], uniqueName = '') {
    const dataQuery = () => this.getEventsDetail(EventInfos);
    return this._registerPolling('getEventsDetailPolling', {EventInfos}, dataQuery, onUpdateCallback, 10, uniqueName);
  }

  /**
   *
   * 聯賽搜尋，返回為SearchSportData數組
   *
   * @param keyword 關鍵字
   */
  async search(keyword) {
    if (!keyword || keyword.length <=0) {
      return [];
    }

    //檢查單個特殊符號
    if (keyword.length === 1) {
      const regex = /^[\~\!\@\#\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\|\\\:\;\"\'\<\,\>\.\?\/]$/gm;
      if (regex.exec(keyword) !== null) {
        return [];
      }
    }

    //加速:從緩存中優先獲取數據
    const cachedResultKey = 'search@' + keyword;
    const cachedResult = this._cacheGet(cachedResultKey , null);
    if (cachedResult) {
      return cachedResult;
    }

    let searchResult = await this._APIs.search(keyword);

    //大小寫不敏感
    const keywordUpper = keyword.toUpperCase();
    const keywordLower = keyword.toLowerCase();

    let sportDataMap = {};
    let leagueDataMap = {};
    //由數據生成 體育->聯賽->賽事
    if (searchResult && searchResult.Competitions && searchResult.Competitions.length > 0) {
      //因為查詢結果可能會返回不相關數據(可能時間也當關鍵字搜尋)，只保留名稱符合的
      let leagueDatas = []
      for(let l of searchResult.Competitions){
        const existInLeagueName = (l.CompetitionName.indexOf(keyword) >= 0) || (l.CompetitionName.indexOf(keywordUpper) >= 0) || (l.CompetitionName.indexOf(keywordLower) >= 0);
        let cloneLeagueData = JSON.parse(JSON.stringify(l));
        if (existInLeagueName) {
          leagueDatas.push(cloneLeagueData); //聯賽名稱符合 就直接使用
        } else {
          if (l.Events && l.Events.length > 0) {
            const matchedEvents = l.Events.filter(ev => {
              const names = [ev.HomeTeam, ev.AwayTeam];
              const matchNames = names.filter(n =>
                (n.indexOf(keyword) >= 0) || (n.indexOf(keywordUpper) >= 0) || (n.indexOf(keywordLower) >= 0)
              )
              return (matchNames && matchNames.length > 0);
            });
            cloneLeagueData.Events = matchedEvents;
            leagueDatas.push(cloneLeagueData);
          }
        }
      }

      //獲取體育名和排序，因為search的events沒有返回體育名稱，只能自己拿
      let sportInfoMap = {};
      const sportCountData = await this._APIs.getAllSportCount();
      if (sportCountData && sportCountData.SportCount && sportCountData.SportCount.length > 0){
        sportCountData.SportCount.map(scd => {
          const thisId = parseInt(scd.SportId);
          sportInfoMap[thisId] = { name: scd.SportName, order: scd.OrderNumber};
        })
      }

      for (const l of leagueDatas) {
        const thisSportId = parseInt(l.SportId);
        let thisSportData = sportDataMap[thisSportId];
        if (!thisSportData) {
          const thisSportInfo = sportInfoMap[thisSportId] ?? { name: 'not set', order: 99999 };
          thisSportData = new SearchSportData(thisSportId, thisSportInfo.name, thisSportInfo.order, []);
          sportDataMap[thisSportId] = thisSportData;
        }

        const thisLeagueId = l.CompetitionId;
        let thisLeagueData = leagueDataMap[thisLeagueId];
        if (!thisLeagueData) {
          thisLeagueData = new SearchLeagueData(thisLeagueId, l.CompetitionName, thisSportId, []);
          leagueDataMap[thisLeagueId] = thisLeagueData;
          thisSportData.Leagues.push(thisLeagueData);
        }

        if (l.Events && l.Events.length > 0) {
          const eventDatas = l.Events.map(ev => {
            return new SearchEventData(
              ev.EventId, ev.EventDate,
              0, ev.HomeTeam, 0, ev.AwayTeam,
              thisSportId,thisLeagueId
            )
          })

          if (eventDatas && eventDatas.length > 0) {
            thisLeagueData.Events = eventDatas;
          }
        }
      }
    }

    //排除下面沒有比賽的聯賽，並把object數據轉為數組
    let sportDatas = [];
    for(let prop in sportDataMap) {
      let thisSportData = sportDataMap[prop];
      thisSportData.Leagues = thisSportData.Leagues.filter(l => l.Events && l.Events.length > 0)
      if (thisSportData.Leagues && thisSportData.Leagues.length > 0) {
        sportDatas.push(thisSportData);
      }
    }

    if (sportDatas.length > 0) {
      //排序體育項目
      const compareSports = (a,b) => {
        if (a.DisplayOrder < b.DisplayOrder ) {
          return -1; //小于 0 ，那么 a 会被排列到 b 之前
        }
        if (a.DisplayOrder > b.DisplayOrder) {
          return 1; //大于 0 ， b 会被排列到 a 之前。
        }
        return 0;
      }
      sportDatas = sportDatas.sort(compareSports);
    }

    this._cacheSet(cachedResultKey,sportDatas, 3*60); //加速:緩存3分

    return sportDatas;
  }


  //獲取投注前(檢查)信息，返回為PollingResult格式，支持比對數據變化
  async getBetInfo(wagerType = WagerType.SINGLE, Selections = []) {
    //語法糖支持：單注改為數組
    if (wagerType === WagerType.SINGLE && !Array.isArray(Selections)) {
      Selections = [Selections];
    }
    //檢查單注
    if (wagerType === WagerType.SINGLE && Selections.length !== 1 ) {
      throw new VendorError(VendorErrorType.DATA_Error,null, { info: 'single bet but multi selection?'});
    } else {
      //串關檢查
      //一個賽事(Event)只能選一個 投注選項(Selection)
      let eventTmp = [];
      let multiEvents = [];
      Selections.map(item => {
        if (eventTmp.indexOf(item.EventId) === -1) {
          eventTmp.push(item.EventId);
        } else {
          multiEvents.push(item);
        }
      });

      if (multiEvents.length > 0) {
        throw new VendorError(VendorErrorType.BET_Selection_Parlay_Error, null, {info: multiEvents})
      }
    }

    //IM串關需要全部轉為歐洲盤
    let notFoundSelections= []; //找不到的保留，後面返回
    if(wagerType === WagerType.COMBO) {
      const MemberType = this._getMemberType(); //水位
      const euSelections = Selections.map(sel => SelectionData.clone(sel, IMOddsType.EU, MemberType));
      Selections=euSelections; //換成歐洲盤
    }

    //扣掉不能用的，不足兩個，也不用調接口了，直接模擬返回數據
    let newData = null;
    if(wagerType === WagerType.COMBO && Selections.length<2) {
      Selections = Selections.map(item => {
        const copy = JSON.parse(JSON.stringify(item));
        copy.SelectionStatus = SelectionStatusType.OK; //設置為ok
        return SelectionData.clone(copy) //利用clone重新配置數據
      });
      notFoundSelections = notFoundSelections.map(item =>{
        const copy = JSON.parse(JSON.stringify(item));
        copy.SelectionStatus = SelectionStatusType.NOTAVIILABLE //標記為不可用
        return SelectionData.clone(copy) //利用clone重新配置數據
      })

      newData = BetInfoData.createFromIMSource(
        null,
        Selections.concat(notFoundSelections), //能用的和不能用的合在一起
      )
    } else {

      //轉成IM格式
      const IMSelectionInfos = Selections.map(item => item.toIMBetInfo());
      const betInfoData = await this._APIs.getBetInfo(wagerType, IMSelectionInfos)
        .then(jsonData => {
          let betSettings = jsonData.BetSetting.map(item => {
            return new BetSettingData(
              item.MinStakeAmount,
              item.MaxStakeAmount,
              item.EstimatedPayoutAmount,
              item.ComboSelection,
              item.NoOfCombination,
              'im',
            )
          });

          //過濾掉不認識的玩法(ComboTypeName為undefined)
          if (betSettings && betSettings.length > 0) {
            betSettings = betSettings.filter(bs => bs.ComboTypeName);
          }

          let selections = jsonData.WagerSelectionInfos.map((item,index) => {
            //獲取原始selection數據，用來補缺少的字段
            const sourceSelections = Selections.filter(selection => selection.SelectionId === item.WagerSelectionId);
            let sourceSelectionData = null;
            if (sourceSelections && sourceSelections.length > 0) {
              sourceSelectionData = sourceSelections[0];
            } else {
              //找不到就用index去對
              sourceSelectionData = Selections[index];
            }

            if (parseInt(item.Market) === 0) {
              item.Market = sourceSelectionData.MarketId;
            }

            const MarketName = VendorMarketNames[item.Market];

            const oddsDeciaml = Decimal.clone({ rounding: 3 }) //無條件捨去

            return new SelectionData(
              item.WagerSelectionId,
              sourceSelectionData.IsOutRightEvent ? item.OutrightTeamId : item.BetTypeSelectionId,
              sourceSelectionData.SelectionName,
              sourceSelectionData.SelectionGroup,
              sourceSelectionData.Handicap, //展示用
              item.Handicap, //投注用
              item.Specifiers,
              item.SportId,
              item.Market,
              MarketName,
              sourceSelectionData.LeagueId,
              sourceSelectionData.LeagueName,
              sourceSelectionData.HomeTeamId,
              sourceSelectionData.HomeTeamName,
              item.HomeScore,
              sourceSelectionData.AwayTeamId,
              sourceSelectionData.AwayTeamName,
              item.AwayScore,
              item.EventId,
              sourceSelectionData.IsOpenParlay,
              item.MarketlineId,
              sourceSelectionData.BetTypeId,
              sourceSelectionData.BetTypeName,
              sourceSelectionData.PeriodId,
              sourceSelectionData.PeriodName,
              sourceSelectionData.TargetTeamId,
              sourceSelectionData.TargetTeamName,
              sourceSelectionData.IsOutRightEvent,
              sourceSelectionData.OutRightEventName,
              item.Odds,
              item.OddsType,
              sourceSelectionData.OddsList.map(oddsItem => {
                return new OddsData(
                  oddsItem.OddsType,
                  oddsItem.OddsValues,
                )
              }),
              new oddsDeciaml(item.Odds).toFixed(2),
              item.MarketlineStatusId,
              item.Status === 381 ? 100 : item.Status, //當作賠率沒有變化，反正投注的時候還會檢查
            )
          })

          selections = selections.concat(notFoundSelections); //能用的和不能用的合在一起

          return BetInfoData.createFromIMSource(
            betSettings.length >0 ? betSettings : null, //考慮statusCode = 350 會返回空的betSetting
            selections,
          )
        });

      newData = betInfoData;
    }

    //注意這裡拿到的newData的BetSettings和Selections都是數組型態

    //處理 可用投注方式(betSetting) 為空 的問題
    if(!newData.BetSettings || newData.BetSettings.length <=0) {
      newData.Selections = newData.Selections.map(item => {
        //如果有可用的 投注選項，設置為更新中(總之就是不給投注)
        if (item.SelectionStatus === SelectionStatusType.OK) {
          const copy = JSON.parse(JSON.stringify(item));
          copy.SelectionStatus = SelectionStatusType.UPDATING; //設置為更新中
          return SelectionData.clone(copy) //利用clone重新配置數據
        } else {
          return item;
        }
      });
    }

    //語法糖支持：單注返回單個Object，串關才返回數組
    if (wagerType === WagerType.SINGLE) {
      newData = new BetInfoData(
        (newData.BetSettings && newData.BetSettings.length >0) ? newData.BetSettings[0] : null,
        null,
        (newData.Selections && newData.Selections.length >0) ? newData.Selections[0] : null,
      )
    }

    const SelectionIds = Selections.map(item => item.SelectionId);

    //比對新舊差異
    const deltaKey = this._getDeltaKey('getBetInfo', {wagerType, SelectionIds});
    const oldData = this._APIDeltas[deltaKey];
    let changes = [];
    if (oldData) {
      //語法糖支持：單注返回單個Object，串關才返回數組
      if (wagerType === WagerType.SINGLE) {
        const oldItem = oldData.Selections;
        const newItem = newData.Selections;
        if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {  //有變化才提交change
          changes.push(new SelectionChangeData(oldItem.SelectionId, oldItem, newItem))
        }
      } else {
        oldData.Selections.map(oldItem => {
          const newSelections = newData.Selections.filter(newItem => newItem.SelectionId === oldItem.SelectionId);
          if (newSelections && newSelections.length > 0) {
            const newItem = newSelections[0];
            if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {  //有變化才提交change
              changes.push(new SelectionChangeData(oldItem.SelectionId, oldItem, newItem))
            }
          }
        })
      }
    }

    //保存查詢結果
    this._APIDeltas[deltaKey] = newData;

    return new PollingResult(newData, changes);
  }


  /**
   * 輪詢獲取投注前(檢查)信息 10秒一次
   *
   * 注意
   * 1. 一次只能一個單注/串關，所以 多個單注 需要分開調用這個接口
   * 2. 一個比賽 同時只能選一個投注選項，後面選的要覆蓋之前的
   * 3. EventData.IsOpenParlay === true 才可以加入串關
   *
   * @param onUpdateCallback 輪詢後數據更新回調  (result) => {}  result 為 PollingResult格式 {NewData: 單個BetInfoData數據, Changes: SelectionChangeData 數組}
   * @param wagerType 下注方式，1單注 2串關
   * @param Selections 格式，如果下注方式 選擇1單注，直接傳入SelectionData ，如果是２串關，則傳入SelectionData數組
   * @param uniqueName         用來判斷是否使用同一個輪詢，配置不同名字，可以同時開多個輪詢
   * @returns 輪詢key
   */
  getBetInfoPolling(onUpdateCallback, wagerType = WagerType.SINGLE, Selections = [], uniqueName = '') {
    const dataQuery = () => this.getBetInfo(wagerType, Selections);
    //存在多個同時調用，不可以互相覆蓋，需要用下注參數添加 uniqueName
    let array_selections = Selections;
    if (!Array.isArray(Selections)) {
      array_selections = [Selections];
    }
    const selectionIds = array_selections.map(s => s.SelectionId);
    const selectionIdJoins = selectionIds.join('|');
    const betInfo_and_uniqueName =  wagerType + '_' + selectionIdJoins + '_' + uniqueName;
    return this._registerPolling('BETINFO', {wagerType, Selections}, dataQuery, onUpdateCallback, 10, betInfo_and_uniqueName);
  }

  //輪詢 滾球注單狀態 緩存，目前只拿來記錄重試次數
  _getWagerStatusCache = {}

  //輪詢 滾球注單狀態
  async _getWagerStatusPolling(wagerId, testFuncs = [], maxRetryCount = 30, uniqueName = ''){
    const thisCacheKey = wagerId + uniqueName;
    this._getWagerStatusCache[thisCacheKey] = {retryCount:0};
    return new Promise(resolve => {
      const query = () => {
        this._APIs.getPendingWagerStatus([wagerId])
          .then(async jsonData => {
            if (jsonData.StatusCode === 370) { //接口返回找不到注單
              //改查詢未結算注單
              const betListJsonData = await this._APIs.getBetList([IMWagerStatus.PENDING,IMWagerStatus.CONFIRMED,IMWagerStatus.REJECTED,IMWagerStatus.CANCELLED])
              if (betListJsonData.WagerList && betListJsonData.WagerList.length > 0) {
                const targets = betListJsonData.WagerList.filter(w => w.WagerId === wagerId)
                if (targets && targets.length > 0 ) {
                  const target = targets[0];
                  for(let testf of testFuncs) {
                    if (testf.func(target)) {
                      delete this._getWagerStatusCache[thisCacheKey]
                      console.log('_getWagerStatusPolling', testf.status , jsonData)
                      return resolve({status:testf.status, data: target}); //成功
                    }
                  }
                }
              }
            }
            if (jsonData.PendingWagerStatusList && jsonData.PendingWagerStatusList.length > 0) {
              const targets = jsonData.PendingWagerStatusList.filter(item => item.WagerID === wagerId);
              if (targets && targets.length > 0) {
                const target = targets[0];
                for(let testf of testFuncs) {
                  if (testf.func(target)) {
                    delete this._getWagerStatusCache[thisCacheKey]
                    console.log('_getWagerStatusPolling', testf.status , jsonData)
                    return resolve({status:testf.status, data: target}); //成功
                  }
                }
              }
            }
            if (this._getWagerStatusCache[thisCacheKey].retryCount < maxRetryCount) {
              this._getWagerStatusCache[thisCacheKey].retryCount = this._getWagerStatusCache[thisCacheKey].retryCount +1;
              console.log('_getWagerStatusPolling', 'RETRY', this._getWagerStatusCache[thisCacheKey] , jsonData)
              setTimeout(query, 1000); //建議一秒一次
            } else {
              delete this._getWagerStatusCache[thisCacheKey]
              console.log('_getWagerStatusCache', 'EXPIRE' , jsonData)
              return resolve({status:'EXPIRE',  data: jsonData}); //超時
            }
          })
      };

      query();
    });
  }

  /**
   * 投注，返回為 BetResultData 格式
   *
   * @param wagerType 下注方式，1單注 2串關
   * @param betInfoData BetInfoData 格式，從getBetInfo獲取的,
   * @param betAmount 下注金額
   * @param comboType 串關類型，選填，默認單注填0，串關需要從BetInfoData裡面的BetSettingData數組 選擇一個
   * @param forceAcceptAnyOdds  強制接受所有賠率變更 默認false
   */
  placeBet(wagerType = WagerType.SINGLE, betInfoData, betAmount, comboType = 0,forceAcceptAnyOdds = false) {
    //語法糖支持：單注改為數組
    let selections = betInfoData.Selections;
    if (wagerType === WagerType.SINGLE && !Array.isArray(selections)) {
      selections = [selections];
    }
    //檢查單注
    if (wagerType === WagerType.SINGLE && selections.length !== 1) {
      throw new VendorError(VendorErrorType.DATA_Error,null, { info: 'single bet but multi selection?'});
    }

    //檢查串關類型(ComboType)，必須從BetInfoData裡面的BetSettingData/SystemParlayBetSettings數組 選擇一個
    if(wagerType === WagerType.COMBO) {
      const selectedBetSettings = betInfoData.BetSettings.filter(item => item.ComboType === comboType);
      const selectedSystemBetSettings = betInfoData.SystemParlayBetSettings.filter(item => item.ComboType === comboType);
      if (selectedBetSettings.length <=0 && selectedSystemBetSettings.length <=0) {
        throw new VendorError(VendorErrorType.DATA_Error,null, { info: 'comboType incorrect'});
      }
    }

    //轉成IM格式
    const IMWagerSelections = selections.map(item => item.toIMWager());
    const IMComboSelections = [{ComboSelection: comboType, StakeAmount: betAmount}];

    const alwaysAcceptBetterOdds = this.getMemberSetting().alwaysAcceptBetterOdds;

    //兩種配置 接受全部變化(false) 跟 只接受賠率上升(true)
    let isAcceptAnyOdds = !alwaysAcceptBetterOdds;
    //強制接受賠率變更
    if (forceAcceptAnyOdds) {
      isAcceptAnyOdds = true;
    }

    return this._APIs.placeBet(wagerType, IMWagerSelections, IMComboSelections, isAcceptAnyOdds)
      .then(async jsonData => {
        //不管是不是串關，都只會有一個WagerSelectionInfos返回
        const wagerSelectionInfo = jsonData.WagerSelectionInfos[0];

        // 加速投注：移除pending等待
        // //處理pending,需要等待成單或拒絕
        // if (wagerSelectionInfo && (wagerSelectionInfo.BetConfirmationStatus === 1)) {
        //   const betResult = await this._getWagerStatusPolling(wagerSelectionInfo.WagerId,
        //     [
        //       { status:'OK' ,func: (data) => data.BetConfirmationStatus === 2}, //確認
        //       { status:'REJECT', func: (data) => data.BetConfirmationStatus === 3}, //拒絕
        //       { status:'CANCEL', func: (data) => data.BetConfirmationStatus === 4}, //取消
        //     ],60
        //   );
        //
        //   if (betResult.status === 'OK') {
        //     wagerSelectionInfo.BetConfirmationStatus = 2; //狀態改為確認
        //   } else if (betResult.status === 'EXPIRE') { //特別處理超時
        //     throw new VendorError(VendorErrorType.BET_Place_Expire, null, {info: betResult})
        //   } else {
        //     throw new VendorError(VendorErrorType.BET_Place_Error, null, {info: betResult})
        //   }
        // }

        const isPending = wagerSelectionInfo && (wagerSelectionInfo.BetConfirmationStatus === 1);
        let pendingQueryId = null;
        if (isPending) {
          pendingQueryId = wagerSelectionInfo.WagerId;
        }

        return new BetResultData(
          jsonData.AvailableBalance,
          wagerSelectionInfo.WagerId,
          wagerSelectionInfo.BetConfirmationStatus,
          parseInt(wagerSelectionInfo.BetStatusMessage),
          isPending,
          pendingQueryId,
          wagerSelectionInfo.ComboSelectionId,
          wagerSelectionInfo.EstimatedPayoutFullAmount,
          jsonData.AcceptedWagerSelectionList.map(item => {
            return new BetSelectionResultData(
              item.EventId,
              item.StakeOdds,
              item.BetTypeSelectionId,
            )
          })
        )
      });
  }

  /**
   * 查詢pending bet 的投注結果
   *
   * @param pendingQueryId
   */
  async queryPendingBetStatus(pendingQueryId) {

    const betResult = await this._getWagerStatusPolling(pendingQueryId,
      [
        { status:'OK' ,func: (data) => data.BetConfirmationStatus === 2}, //確認
        { status:'REJECT', func: (data) => data.BetConfirmationStatus === 3}, //拒絕
        { status:'CANCEL', func: (data) => data.BetConfirmationStatus === 4}, //取消
      ],60
    );

    if (betResult.status === 'EXPIRE') { //特別處理超時
      return new BetStatusData(
        betResult.status === 'OK',
        pendingQueryId,
        1, //超時當作待確認
      )
    } else {
      return new BetStatusData(
        betResult.status === 'OK',
        pendingQueryId,
        betResult.data.BetConfirmationStatus,
      )
    }
  }

  /**
   * 查詢未結算注單，返回為WagerData數組
   */
  getUnsettleWagers(){
    return this._APIs.getBetList()
      .then(jsonData => {
        return jsonData.WagerList.map(item => {
          return WagerData.createFromIMSource(item);
        })
      })
  }

  /**
   * 查詢已結算注單，返回為WagerData數組
   *
   * @param StartDate 開始日期 YYYY-MM-DD 格式 默認今天
   * @param EndDate  結束日期 YYYY-MM-DD 格式 默認今天
   * @param WagerSortWay
   */
  getSettledWagers(StartDate = moment().format('YYYY-MM-DD'), EndDate = moment().format('YYYY-MM-DD'), WagerSortWay = IMWagerSortWay.BETDATE){
    return this._APIs.getStatement(StartDate,EndDate,WagerSortWay)
      .then(jsonData => {
        return jsonData.WagerList.map(item => {
          return WagerData.createFromIMSource(item);
        })
      })
  }

  //獲取用戶配置
  getMemberSetting() {
    let result = super.getMemberSetting();

    //把oddsType轉為IM格式
    result.oddsType = IMOddsType[result.oddsType];

    //debug
    // result.oddsType = IMOddsType.EU;

    return result;
  }

  /**
   * 獲取供應商公告
   */
  getAnnouncements() {
    return this._APIs.getAnnouncement()
      .then(jsonData => {
        //考慮沒有數據的情況，返回空數組
        if (!jsonData.Announcement || jsonData.Announcement.length <= 0) {
          return [];
        }

        return jsonData.Announcement.map(item=> {

          const postingDate = moment(item.PostingDate).utcOffset(VendorConfigs.TIMEZONE).format('YYYY/MM/DD HH:mm');

          return new AnnouncementData(
            item.AnnouncementId,
            item.AnnouncementDetail[0].Content,
            postingDate,
            {PostingDate:item.PostingDate, ExpiryDate: item.ExpiryDate, UpdateDate: item.DateUpdated}
          );
        });
      });
  }
}

const vendorIMSingleton = new VendorIM();
if (typeof window !== "undefined") {
  window.VendorIMInstance = vendorIMSingleton;
}

export default vendorIMSingleton;