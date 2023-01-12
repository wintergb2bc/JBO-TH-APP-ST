//比賽數據
import moment from "moment";
import {SortWays, VendorConfigs, VendorMarketNames, VendorMarkets} from "./VendorConsts";
import LineData from "./LineData";
import SelectionData from "./SelectionData";
import OddsData from "./OddsData";
import VendorIM from "../im/VendorIM";
//import VendorBTI from "../bti/VendorBTI";
import {
  BTIBetTypeNames,
  BTIComboTypeNames, BTIForceDecimalBetTypeIds,
  BTIMarketGroupTypeNames,
  BTIOddsType,
  BTIOddsTypeToNumber, BTIPeriodMapping, BTIRBPeriodNames
} from "../bti/BTIConsts";
import LineGroupData from "./LineGroupData";
import {IMEventGroupTypeNames, IMLineGroupNames, IMRBPeriodNames} from "../im/IMConsts";
import natureCompare from 'natural-compare';
import {Decimal} from "decimal.js";
import i18n from '../vendori18n';

export default class EventData {
  /**
   * @param EventId 比賽id
   * @param EventDate 比赛時間
   * @param EventStatusId 開盤狀態 1開2關
   * @param EventGroupId 比賽分組，用途不明
   * @param EventGroupTypeId 比賽分組類型，用途不明
   * @param HomeTeamId 主場球隊id
   * @param HomeTeamName 主場球隊名
   * @param HomeScore 主場得分
   * @param HomeRedCard 主場紅牌數
   * @param HomeCorner 主場角球數
   * @param AwayTeamId 客場球隊id
   * @param AwayTeamName 客場球隊名
   * @param AwayScore 客場得分
   * @param AwayRedCard 客場紅牌數
   * @param AwayCorner 客場角球數
   * @param HasCornerData 是否提供角球數據(im:false,  bti:true)
   * @param SortOrder 排序
   * @param RBTime 滾球時間,平台原始的滾球數據
   * @param RBMinute 滾球分鐘(開始到現在比賽進行了幾分鐘)
   * @param RBPeriodName 滾球時間段(中文)
   * @param RelatedScores 相關比分清單，用途不明
   * @param GroundTypeId 主場狀態 0在中立場比賽 1在主場比賽，用途不明
   * @param IsOpenParlay 是否支持串關
   * @param HasStatistic 是否有分析數據(BR)
   * @param HasVisualization 是否有可視化(動畫)(BR)
   * @param BREventId (BR)比賽Id
   * @param IsRB 是否比賽進行(滾球)中
   * @param HasLiveStreaming 是否有直播數據
   * @param LiveStreamingUrl 直播源列表 格式待確認
   * @param Season 賽日指標，用於虛擬體育
   * @param MatchDay 賽事指標，用於虛擬體育
   * @param ExtraInfo 額外信息
   * @param SportId 體育ID
   * @param MarketId 市場ID
   * @param LeagueId 聯賽id
   * @param LeagueName 聯賽名
   * @param TotalLineCount 玩法總數(查詢時可以過濾，這裡列出來的是過濾前的總數)
   * @param IsFavourite 是否收藏遊戲
   * @param IsOutRightEvent 是否為優勝冠軍賽事
   * @param OutRightEventName 優勝冠軍賽事名
   * @param LineGroups 玩法分組列表，LineGroupData數組
   * @param Lines 玩法列表，LineData數組
   */
  constructor(
              EventId,
              EventDate,
              EventStatusId,
              EventGroupId,
              EventGroupTypeId,
              HomeTeamId,
              HomeTeamName,
              HomeScore,
              HomeRedCard,
              HomeCorner,
              AwayTeamId,
              AwayTeamName,
              AwayScore,
              AwayRedCard,
              AwayCorner,
              HasCornerData,
              SortOrder,
              RBTime,
              RBMinute,
              RBPeriodName,
              RelatedScores,
              GroundTypeId,
              IsOpenParlay,
              HasStatistic,
              HasVisualization,
              BREventId,
              IsRB,
              HasLiveStreaming,
              LiveStreamingUrl,
              MatchDay,
              Season,
              ExtraInfo,
              SportId,
              MarketId,
              LeagueId,
              LeagueName,
              TotalLineCount,
              IsFavourite,
              IsOutRightEvent,
              OutRightEventName,
              LineGroups,
              Lines = [],
              )
  {
    Object.assign(this, {
      EventId,
      EventDate,
      EventStatusId,
      EventGroupId,
      EventGroupTypeId,
      HomeTeamId,
      HomeTeamName,
      HomeScore,
      HomeRedCard,
      HomeCorner,
      AwayTeamId,
      AwayTeamName,
      AwayScore,
      AwayRedCard,
      AwayCorner,
      HasCornerData,
      SortOrder,
      RBTime,
      RBMinute,
      RBPeriodName,
      RelatedScores,
      GroundTypeId,
      IsOpenParlay,
      HasStatistic,
      HasVisualization,
      BREventId,
      IsRB,
      HasLiveStreaming,
      LiveStreamingUrl,
      MatchDay,
      Season,
      ExtraInfo,
      SportId,
      MarketId,
      LeagueId,
      LeagueName,
      TotalLineCount,
      IsFavourite,
      IsOutRightEvent,
      OutRightEventName,
      LineGroups,
      Lines,
    });

    //處理日期
    this.EventDateLocal = this.getEventDateMoment().format('YYYY-MM-DD'); //日期過濾用 for 早盤
  }

  //獲取時區調整後的Moment類
  getEventDateMoment() {
    return moment(this.EventDate).utcOffset(VendorConfigs.TIMEZONE);
  }

  //由selectionId, lineId找內含的Selection數據
  getChildSelection(selectionId, lineId, eventId = null){
    if (eventId === this.EventId || eventId === null) {
      const thisLines = this.Lines.filter(l => l.LineId === lineId);
      if (thisLines.length > 0) {
        const thisLine = thisLines[0];
        const thisSelections = thisLine.Selections.filter(s => s.SelectionId === selectionId);
        if (thisSelections.length > 0) {
          return thisSelections[0];
        }
      }
    }
    return null
  }

  //更新投注分組計數(只有bti用到，因為bti會單獨修改Lines)
  updateLineGroupCount(){
    this.LineGroups.map(lg => {
      const linesInGroup = this.Lines.filter(l => {
        return (l.LineGroupIds && l.LineGroupIds.length > 0 && l.LineGroupIds.indexOf(lg.LineGroupId) !== -1)
      })
      lg.LineCount = linesInGroup.length;
    })
  }

  //排序投注線 按 讓球->大小  全場-上半場-下半場的順序(列表使用)
  sortLines() {
    const compareFunc = (left,right) => {
      const a = left.PeriodId + '_' + left.BetTypeId;
      const b = right.PeriodId + '_' + right.BetTypeId;
      return natureCompare(a,b); //自然排序
    }
    if (this.Lines && this.Lines.length > 1) {
      this.Lines = this.Lines.sort(compareFunc);
    }
  }

  //IM專用 排序投注線 EventGroupTypeId優先, 然後betType，再排全場上半下半，然後按linelevel順序小到大(詳情頁使用)
  IMSortLinesAndSelections() {
    const lineCompareFunc = (left, right) => {
      const a = left.EventGroupTypeId + '_' + left.BetTypeId + '_' + left.PeriodId + '_' + left.LineLevel;
      const b = right.EventGroupTypeId + '_' + right.BetTypeId + '_' + right.PeriodId + '_' + right.LineLevel;
      return natureCompare(a, b); //自然排序
    }

    //投注選項特別排序
    const selectionSpecialCompareFunc = (specialWords) => {
        return (left, right) => {
          let a1 = specialWords.indexOf(left.SelectionName);
          let b1 = specialWords.indexOf(right.SelectionName);

          if (a1 !== -1 && b1 !== -1) {
            if (a1 < b1) {
              return -1; //小于 0 ，那么 a 会被排列到 b 之前
            }

            if (a1 > b1) {
              return 1; //大于 0 ， b 会被排列到 a 之前。
            }
          }
          return 0; //沒找到不動
        }
      }

    const selectionCompareFunc = (left,right) => {
      //其他沒特別註明的直接用SelectionId排序
      const ax = left.SelectionId;
      const bx = right.SelectionId ;
      return natureCompare(ax,bx); //自然排序
    }

    if (this.Lines && this.Lines.length > 1) {
      this.Lines = this.Lines.sort(lineCompareFunc);
      this.Lines.map(l => {
        if (l.Selections && l.Selections.length > 1) {
          //按照name去分類
          const selectionNames = l.Selections.map(s => s.SelectionName);
          //去重複
          const uniqueSelectionNames = selectionNames.filter((item, index) => selectionNames.indexOf(item) === index);

          let specialSorted = false;
          //特殊排序的配置
          const specialSortConditions = [
            {
              uniqueSelectionCount: 2,
              sortWords: [
                [i18n.HOME,i18n.AWAY],
                [i18n.BIG,i18n.SMALL],
                [i18n.ODD,i18n.EVEN],
                [i18n.YES,i18n.NO],
                [i18n.HOME_YES,i18n.HOME_NO],
                [i18n.HOME_YES2,i18n.HOME_NO2],
                [i18n.AWAY_YES,i18n.AWAY_NO],
                [i18n.AWAY_YES2,i18n.AWAY_NO2],
                [i18n.HOME_ODD,i18n.HOME_EVEN],
                [i18n.AWAY_ODD,i18n.AWAY_EVEN],
                [i18n.HOME_WIN_YES,i18n.HOME_WIN_NO],
                [i18n.AWAY_WIN_YES,i18n.AWAY_WIN_NO],
                [i18n.TIE,i18n.HOME_WIN],
                [i18n.TIE,i18n.AWAY_WIN],
                [i18n.ANY_WIN_YES,i18n.ANY_WIN_NO],
                [i18n.HOME_PERFECT_WIN_YES,i18n.HOME_PERFECT_WIN_NO],
                [i18n.AWAY_PERFECT_WIN_YES,i18n.AWAY_PERFECT_WIN_NO],
              ]
            },
            {
              uniqueSelectionCount: 3,
              sortWords: [
                [i18n.HOME,i18n.TIE,i18n.AWAY],
                [i18n.HOME,i18n.NOT_HAVE,i18n.AWAY],
              ]
            }
          ]

          //wholeloop: //不能用label break在rn裡面會有問題
          for(let condition of specialSortConditions) {
            if (specialSorted) { //不能用label break的替代方案
              break;
            }
            //判斷不重複的seleciton數量
            if (uniqueSelectionNames.length === condition.uniqueSelectionCount) {
              for(let words of condition.sortWords) {
                //檢查selectionName要完全符合要求的字
                if (words.filter(w => uniqueSelectionNames.indexOf(w) !== -1).length === condition.uniqueSelectionCount) {
                  //使用特別排序
                  const specialSortFunc = selectionSpecialCompareFunc(words);
                  l.Selections = l.Selections.sort(specialSortFunc);
                  specialSorted = true; //標記已經特別排序過
                  //break wholeloop;  //不能用label break在rn裡面會有問題
                  break;
                }
              }
            }
          }

          //感覺不需要  先不排
          // if (!specialSorted) { //沒特別排序就用默認的
          //   l.Selections = l.Selections.sort(selectionCompareFunc);
          // }
        }
      })
    }
  }

  //IM專用，處理IM特殊結構 eventGroup，把特殊投注合併到 主Event 數據內
  IMMergeSideEvents(jsonEvents, FavoriteEvents, memberOddsType = null, memberType = null) {
    //處理sideEvents
    const sideEvents = jsonEvents.filter(ev => ev.EventGroupTypeId !== 1 && ev.EventGroupId === this.EventGroupId);
    let sideEventDatas = (sideEvents && sideEvents.length > 0) ?
      sideEvents.map(se => EventData.createFromIMSource(se, this.SportId, FavoriteEvents, memberOddsType, memberType))
      : []

    if (sideEventDatas && sideEventDatas.length > 0) {
      //先按 EventGroupTypeId 順序排序
      const natureCompFunc = (left,right) => {
        const a = left.EventGroupTypeId;
        const b = right.EventGroupTypeId;
        return natureCompare(a,b); //自然排序
      }
      sideEventDatas = sideEventDatas.sort(natureCompFunc);

      //把sideEvents合併到主比賽
      sideEventDatas.map(se => {
        if (se.Lines && se.Lines.length > 0) {
          if (!this.LineGroups && !Array.isArray(this.LineGroups)) {
            this.LineGroups = [];
          }

          const thisLineGroupId = 'SPECIAL_' + se.EventGroupTypeId;

          //有可能同一個EventGroupTypeId開了好幾個side event，需要判斷
          const existLineGroups = this.LineGroups.filter(lg => lg.LineGroupId === thisLineGroupId);

          if (!existLineGroups || existLineGroups.length <=0) {
            //新增一個分類
            this.LineGroups.push(
              new LineGroupData(
                thisLineGroupId, //群組id自己組一個
                IMEventGroupTypeNames[se.EventGroupTypeId], //名字用IM給的固定名稱
                se.Lines.length,
                99, //先放最後，後面再看怎麼調比較好
              )
            )
          } else {
            //分類已存在，把投注線 數量加上去
            existLineGroups[0].LineCount = existLineGroups[0].LineCount + se.Lines.length;
          }

          //合併投注線
          se.Lines.map(sel => {
            sel.LineGroupIds = [thisLineGroupId]; //修改投注線分組
            //修改玩法名
            const newBetTypeName = IMEventGroupTypeNames[se.EventGroupTypeId] + ' ' + sel.BetTypeName;
            sel.BetTypeName = newBetTypeName
            if (sel.Selections && sel.Selections.length > 0) {
              sel.Selections.map(sels => {
                sels.BetTypeName = newBetTypeName //selection裡面的玩法名也要一起改
              })
            }
            this.Lines.push(sel);
          });
        }
      })
    }
  }

  //BTI專用，把多線Selection過濾，剩下主線Selection
  BTIFilterMainLineOnly() {
    if (this.Lines && this.Lines.length > 0) {
      if (this.IsOutRightEvent) {
        //猜冠軍 只留下前４個
        this.Lines.map(l => {
          if (l.Selections && l.Selections.length > 4) {
            l.Selections = l.Selections.filter((s,index) => index < 4);
          }
        });
      } else {
        //一般比賽
        this.Lines.map(l => {
          if (l.Selections && l.Selections.length > 2) { //2個以上才要篩選
            const newSelections = l.Selections.filter(s => {
              return s.Specifiers && s.Specifiers.length > 0 && s.Specifiers[0] && s.Specifiers[0] === 'MainPointLine';
            });
            //確認有MainPointLine才替換，找不到就不換了
            if (newSelections && newSelections.length > 0) {
              l.Selections = newSelections;
              l.updateSelectionAnalysis();
            }
          }

          //排序主->客 大->小
          const compareFunc = (left, right) => {
            //特別處理主客大小，因為SelectionId排出來有時候不對
            const a = left.SelectionType;
            const b = right.SelectionType;

            if (a === 'Home' || a === 'Over') {
              return -1; //小于 0 ，那么 a 会被排列到 b 之前
            }

            if (b === 'Home' || b === 'Over') {
              return 1; //大于 0 ， b 会被排列到 a 之前。
            }

            //其他沒特別註明的直接用SelectionId排序
            const a2 = left.SelectionId;
            const b2 = right.SelectionId;
            return natureCompare(a2, b2); //自然排序
          }

          if (l.Selections && l.Selections.length > 1) {
            l.Selections = l.Selections.sort(compareFunc);
          }
        })
      }
    }
  }

  //BTI專用, line利用betTypeId排序, selection用group去排序，詳情頁專用
  BTISortLinesAndSelections() {
    const lineCompareFunc = (left,right) => {
      //有下滑線的優先
      const a = left.BetTypeId.indexOf('_') !== -1;
      const b = right.BetTypeId.indexOf('_') !== -1;

      if (a === true && b === false) {
        return -1; //小于 0 ，那么 a 会被排列到 b 之前
      }

      if (b === true && a === false) {
        return 1; //大于 0 ， b 会被排列到 a 之前。
      }

      //2表示讓球盤 3表示大小盤  後面的012表示全 上半 下半 場 39為滾球投注

      //把 1_0 轉為 0_1  這樣把全/上半/下半場優先排序
      const reverse = (s) => {
        return s.split("_").reverse().join("");
      }

      const a2 = reverse(left.BetTypeId);
      const b2 = reverse(right.BetTypeId);
      return natureCompare(a2,b2); //自然排序
    }

    const selectionCompareFunc = (left,right) => {
      const a = left.SelectionGroup;
      const b = right.SelectionGroup;
      if (a < b) {
        return -1; //小于 0 ，那么 a 会被排列到 b 之前
      }

      if (a > b) {
        return 1; //大于 0 ， b 会被排列到 a 之前。
      }

      //特別處理主客大小，因為SelectionId排出來有時候不對
      const a1 = left.SelectionType;
      const b1 = right.SelectionType;

      if (a1 === 'Home' || a1 === 'Over') {
        return -1; //小于 0 ，那么 a 会被排列到 b 之前
      }

      if (b1 === 'Home' || b1 === 'Over') {
        return 1; //大于 0 ， b 会被排列到 a 之前。
      }

      //其他沒特別註明的直接用SelectionId排序
      const a2 = left.SelectionId;
      const b2 = right.SelectionId ;
      return natureCompare(a2,b2); //自然排序
    }
    if (this.Lines && this.Lines.length > 1) {

      //bti需要排除以下這四個投注線
      //Cash Out Soccer FT Asians 亚洲让分盘
      //Cash Out Soccer FT Asians 大小盘
      //Cash Out Basketball FT 让分盘
      //Cash Out Basketball FT 比赛进球

      const needFilterBetTypeNames = [
        'Cash Out Soccer FT Asians 亚洲让分盘',
        'Cash Out Soccer FT Asians 大小盘',
        'Cash Out Basketball FT 让分盘',
        'Cash Out Basketball FT 比赛进球',
      ]

      this.Lines = this.Lines.filter(l => needFilterBetTypeNames.indexOf(l.BetTypeName) === -1).sort(lineCompareFunc);
      this.Lines.map(l => {
        if (l.Selections && l.Selections.length > 1) {
          l.Selections = l.Selections.sort(selectionCompareFunc);
        }
      })
    }
  }

  //從IM數據生成EventData數據
  static createFromIMSource(item, SportId, FavoriteEvents, memberOddsType = null, memberType = null) {
    item.EventId = parseInt(item.EventId); //IM固定轉為int

    if( memberOddsType === null) {
      memberOddsType = VendorIM.getMemberSetting().oddsType;
    }

    if (memberType === null) {
      memberType = VendorIM._getMemberType(); //水位;
    }

    const isFavourite = FavoriteEvents.filter(favItem=>item.EventId === favItem.EventId).length > 0;

    //處理玩法分組
    let lineGroupDatas = [];
    for (let typeid in IMLineGroupNames) {

      const intTypeId = parseInt(typeid);
      //計算組內數量
      const linesInGroup = item.MarketLines.filter(l => {
        const groupid = (l.BetTypeId == 2 ? 1 : l.BetTypeId) //只有 2大/小 會併入 1讓分 ，需要特別處理
        return parseInt(groupid) === intTypeId;
      })

      lineGroupDatas.push(new LineGroupData(
        intTypeId,
        IMLineGroupNames[typeid],
        linesInGroup.length,
        intTypeId,
      ));
    }

    //市場名
    const MarketName = VendorMarketNames[item.Market];

    //是否滾球中
    const isRB = (item.Market === VendorMarkets.RUNNING) || (item.RBTime !== null);

    //處理滾球時間
    let rbMinute = '';
    let rbPeriod = '';
    if (isRB && item.RBTime) {
      //有空白 表示為 1H 12:34 這種格式
      const blankIndex = item.RBTime.indexOf(' ');
      if (blankIndex !== -1) {
        const toIndex = item.RBTime.indexOf(':');
        if (toIndex !== -1) {
          const minuteLength = toIndex - blankIndex - 1;
          if (blankIndex >= 0 && minuteLength > 0) {
            rbMinute = item.RBTime.substr(blankIndex + 1, minuteLength);
          }
        } else { //沒有帶秒數的，直接切分鐘
          if (blankIndex >= 0) {
            rbMinute = item.RBTime.substr(blankIndex + 1);
          }
        }
        if (blankIndex >= 0) {
          rbPeriod = item.RBTime.substr(0, blankIndex);
        }
      } else if(item.RBTime.length === 2) {
        rbPeriod = item.RBTime;
      }

      if (rbPeriod && rbPeriod.length > 0) {
        const rbname = IMRBPeriodNames[rbPeriod];  //中文名
        if (rbname) {
          rbPeriod = rbname;  //有對到才用中文名，沒對到 就直接用原本的字
        }
      }
    }

    //處理中立場
    if (item.GroundTypeId === 0 && item.HomeTeam) {
      item.HomeTeam = item.HomeTeam + '(' + i18n.NEUTRAL_GROUND + ')'
    }

    //處理角球
    let homeCorner = null;
    let awayCorner = null;
    if (isRB && item.RelatedScores && item.RelatedScores.length > 0) {
        const cornerData = item.RelatedScores.find(s => parseInt(s.EventGroupTypeId) === 2);
        if (cornerData) {
          homeCorner = cornerData.HomeScore ? cornerData.HomeScore : 0;
          awayCorner = cornerData.AwayScore ? cornerData.AwayScore : 0;
        }
    }

    return new EventData(
      item.EventId,
      item.EventDate,
      item.EventStatusId,
      item.EventGroupId,
      item.EventGroupTypeId,
      item.HomeTeamId,
      item.HomeTeam,
      item.HomeScore,
      item.HomeRedCard,
      homeCorner,
      item.AwayTeamId,
      item.AwayTeam,
      item.AwayScore,
      item.AwayRedCard,
      awayCorner,
      true,
      (isRB ? item.Competition.RBOrderNumber : item.Competition.PMOrderNumber) + '_' + item.OrderNumber,
      item.RBTime,
      rbMinute,
      rbPeriod,
      item.RelatedScores,
      item.GroundTypeId,
      item.OpenParlay,
      item.HasStatistic,
      item.HasVisualization,
      item.BREventId,
      isRB, //注意IM原始數據的isLive代表是否支持滾球投注，不是比賽進行中。不過BTI的isLive就是比賽進行中，所以乾脆統一改成isRB字段 比較不會混淆
      item.LiveStreaming === 1,
      item.LiveStreamingUrl,
      item.MatchDay,
      item.Season,
      item.ExtraInfo,
      SportId,
      item.Market,
      item.Competition.CompetitionId,
      item.Competition.CompetitionName,
      item.TotalMarketLineCount,
      isFavourite,
      false, //優勝冠軍有專用的create函數
      '', //優勝冠軍有專用的create函數
      lineGroupDatas,
      item.MarketLines.map(lineItem => {

        //IM的大/小 改成 大小 和mockup一致
        if (lineItem.BetTypeName === i18n.BIG_OR_SMALL) {
          lineItem.BetTypeName = i18n.BIG_SMALL
        }

        //處理IM的特殊玩法線名 - 第{goalnr}粒入球球队
        let thisBetTypeName = lineItem.BetTypeName;
        if (thisBetTypeName.indexOf('{') !== -1 && thisBetTypeName.indexOf('}') !== -1 ) {
          //從下面的selection找能用的替代文字(這到底是什麼神奇結構。。。)
          let childSelectionSpecifiers = []
          lineItem.WagerSelections.map(s => {
            if (s.Specifiers && (s.Specifiers.indexOf('=') !== -1)) {
              if (childSelectionSpecifiers.indexOf(s.Specifiers) === -1) {
                childSelectionSpecifiers.push(s.Specifiers);
              }
            }
          });
          if (childSelectionSpecifiers && childSelectionSpecifiers.length >0) {
            for (let chiildSpecifier of childSelectionSpecifiers) {
              const spec_arr = chiildSpecifier.split('='); //用=切開
              if (spec_arr && spec_arr.length === 2) {
                const replaceTarget = '{' + spec_arr[0] + '}';
                if (thisBetTypeName.indexOf(replaceTarget) !== -1) {
                  thisBetTypeName = thisBetTypeName.replace(replaceTarget,spec_arr[1]);
                  //console.log('===== LineBetTypeName replace!',lineItem.BetTypeName,thisBetTypeName,chiildSpecifier,lineItem.MarketlineId, item.EventId);
                  break;
                }
              }
            }
          }
        }

        return new LineData(
          //IM的BetTypeId就是玩法分組，只有 2大/小 會併入 1讓分 ，需要特別處理
          //BTI的１個玩法 可能同時屬於多個分類，所以這裡也一起改成數組格式
          lineItem.BetTypeId == 2 ? [1] : [lineItem.BetTypeId],
          lineItem.BetTypeId,
          thisBetTypeName,
          lineItem.IsLocked,
          lineItem.MarketlineId,
          lineItem.MarketLineLevel,
          lineItem.MarketlineStatusId,
          lineItem.PeriodId,
          lineItem.PeriodName,
          item.EventId,
          item.EventGroupTypeId,
          item.HomeTeam,
          item.AwayTeam,
          lineItem.WagerSelections.map(selectionItem => {

            let thisSelectionName = selectionItem.SelectionName;

            //處理IM的特殊投注選項名
            if (selectionItem.Specifiers && (selectionItem.Specifiers.indexOf('=') !== -1)) {
              const spec_arr = selectionItem.Specifiers.split('='); //用=切開
              if (spec_arr && spec_arr.length === 2) {
                if (spec_arr[0] === 'hcp') { //三項讓球，特別處理
                  //hcp=0:2
                  if (spec_arr[1].indexOf(':') !== -1) {
                    const xy_arr =  spec_arr[1].split(':'); //後面的數字用:切開
                    if (xy_arr && xy_arr.length === 2) {
                      const thisx = parseInt(xy_arr[0]);
                      const thisy = parseInt(xy_arr[1]);
                      //分別取代 x-y 或者 y-x 讓分盤
                      if (thisSelectionName.indexOf('{x-y}') !== -1) {
                        thisSelectionName = thisSelectionName.replace('{x-y}', thisx - thisy);
                        //console.log('===== selectionName replace(x-y)!',selectionItem.SelectionName,thisSelectionName,selectionItem.Specifiers);
                      } else if (thisSelectionName.indexOf('{y-x}') !== -1) {
                        thisSelectionName = thisSelectionName.replace('{y-x}', thisy - thisx);
                        //console.log('===== selectionName replace!(y-x)',selectionItem.SelectionName,thisSelectionName,selectionItem.Specifiers);
                      } else {
                        //console.log('===== selectionName NOT replace??????',selectionItem.SelectionName,thisSelectionName,selectionItem.Specifiers);
                      }
                    }
                  }
                } else {
                  //total=1.5 這種，直接取代
                  const replaceTarget ='{' + spec_arr[0] + '}';
                  if (thisSelectionName.indexOf(replaceTarget) !== -1) {
                    thisSelectionName = thisSelectionName.replace(replaceTarget, spec_arr[1]);
                    //console.log('===== selectionName replace!', selectionItem.SelectionName, thisSelectionName, selectionItem.Specifiers);
                  } else {
                    //console.log('===== selectionName NOT replace??????',selectionItem.SelectionName,thisSelectionName,selectionItem.Specifiers);
                  }
                }
              }
            }

            //處理讓球和大小的特殊展示方式

            let thisHandiCap = selectionItem.Handicap;

            //處理讓球
            if (lineItem.BetTypeId === 1 && thisHandiCap !== null) {
              let thisHandicapDecimal = new Decimal(thisHandiCap);
              if (selectionItem.SelectionId === 1) { //主場
                thisHandicapDecimal = thisHandicapDecimal.mul(-1);  //主場先乘-1
              }
              //如果是0.25或0.75，
              if (thisHandicapDecimal.abs().mod(1).eq(0.25) || thisHandicapDecimal.abs().mod(1).eq(0.75)) {
                // 0.75 改成 +0.5/1
                if (thisHandicapDecimal.greaterThan(0)) {
                  thisHandiCap = '+' + thisHandicapDecimal.sub(0.25).toNumber() + '/' + thisHandicapDecimal.add(0.25).toNumber();
                }
                // -0.75 改成 -0.5/1  前面統一加負號 記得負數最後用abs消掉負號
                if (thisHandicapDecimal.lessThan(0)) {
                  thisHandiCap = '-' + thisHandicapDecimal.add(0.25).abs().toNumber() + '/' + thisHandicapDecimal.sub(0.25).abs().toNumber();
                }
              } else {
                //直接加正負號
                if (thisHandicapDecimal.greaterThan(0)) {
                  thisHandiCap = '+' +  thisHandicapDecimal.toNumber();
                }
                if (thisHandicapDecimal.lessThan(0)) {
                  thisHandiCap = '-' +  thisHandicapDecimal.abs().toNumber();
                }
              }
            }

            //處理大小
            if (lineItem.BetTypeId === 2 && thisHandiCap !== null) {
              let thisHandicapDecimal = new Decimal(thisHandiCap);
              //如果是0.25或0.75，
              if (thisHandicapDecimal.abs().mod(1).eq(0.25) || thisHandicapDecimal.abs().mod(1).eq(0.75)) {
                // 0.75 改成 0.5/1
                if (thisHandicapDecimal.greaterThan(0)) {
                  thisHandiCap = thisHandicapDecimal.sub(0.25).toNumber() + '/' + thisHandicapDecimal.add(0.25).toNumber();
                }
              }
            }

            const oddsDeciaml = Decimal.clone({ rounding: 3 }) //無條件捨去

            //判斷投注目標球隊，IM利用selectionName判斷
            let targetTeamId = null;
            let targetTeamName = '';
            if ((item.HomeTeam && thisSelectionName.indexOf(item.HomeTeam) !== -1) //玩法名包含隊名
            || thisSelectionName === i18n.HOME) //或者玩法名就是一個「主」字
            {
              targetTeamId = item.HomeTeamId;
              targetTeamName = item.HomeTeam;
            } else if ((item.AwayTeam && thisSelectionName.indexOf(item.AwayTeam) !== -1) //玩法名包含隊名
            || thisSelectionName === i18n.AWAY)//或者玩法名就是一個「客」字
            {
              targetTeamId = item.AwayTeamId;
              targetTeamName = item.AwayTeam;
            }

            //從OddsList獲取賠率
            let thisOddsType = null;
            let thisOddsValue = null;
            if (selectionItem.OddsList && selectionItem.OddsList.length > 0) {
              let targetOddsInfo = selectionItem.OddsList[0]; //默認選第一個賠率
              const matchOddsInfos = selectionItem.OddsList.filter(oInfo => parseInt(oInfo.OddsType) === memberOddsType);
              if (matchOddsInfos && matchOddsInfos.length > 0) { //如果有找到跟會員設置的盤口一樣的，就使用這個
                targetOddsInfo = matchOddsInfos[0];
              }
              thisOddsType = targetOddsInfo.OddsType;
              thisOddsValue = targetOddsInfo.OddsValues[memberType]; //根據水位選擇賠率
            }
            //如果沒獲取到就用默認值
            thisOddsValue = thisOddsValue ?? selectionItem.Odds;
            thisOddsType = thisOddsType ?? selectionItem.OddsType;

            return new SelectionData(
              selectionItem.WagerSelectionId,
              selectionItem.SelectionId,
              thisSelectionName,
              0, //IM沒有selection group
              thisHandiCap,
              selectionItem.Handicap,
              selectionItem.Specifiers,
              SportId,
              item.Market,
              MarketName,
              item.Competition.CompetitionId,
              item.Competition.CompetitionName,
              item.HomeTeamId,
              item.HomeTeam,
              item.HomeScore,
              item.AwayTeamId,
              item.AwayTeam,
              item.AwayScore,
              item.EventId,
              item.OpenParlay,
              lineItem.MarketlineId,
              lineItem.BetTypeId,
              thisBetTypeName,
              lineItem.PeriodId,
              lineItem.PeriodName,
              targetTeamId,
              targetTeamName,
              false,
              '',
              thisOddsValue,
              thisOddsType,
              selectionItem.OddsList ? selectionItem.OddsList.map(oddsItem => {
                return new OddsData(
                  oddsItem.OddsType,
                  oddsItem.OddsValues,
                )
              }) : [],
              new oddsDeciaml(thisOddsValue).toFixed(2),
            )
          })
        )
      })
    )
  }

  //從IM優勝冠軍數據 生成EventData數據
  static createFromIMOutRightSource(item, SportId, FavoriteEvents, memberOddsType = null, memberType = null) {
    item.EventId = parseInt(item.EventId); //IM固定轉為int

    if( memberOddsType === null) {
      memberOddsType = VendorIM.getMemberSetting().oddsType;
    }

    if (memberType === null) {
      memberType = VendorIM._getMemberType(); //水位;
    }

    const isFavourite = FavoriteEvents.filter(favItem=>item.EventId === favItem.EventId).length > 0;

    //市場名
    const MarketName = VendorMarketNames[VendorMarkets.OUTRIGHT];

    const oddsDeciaml = Decimal.clone({ rounding: 3 }) //無條件捨去

    return new EventData(
      item.EventId,
      item.EventDate,
      item.EventStatusId,
      null, //比賽分組 優勝冠軍沒有
      null, //比賽分組類型 優勝冠軍沒有
      null,  //主隊數據 優勝冠軍沒有
      null,
      null,
      null,
      null,
      null, //客隊數據 優勝冠軍沒有
      null,
      null,
      null,
      null,
      false,
      item.Competition.PMOrderNumber + '_' + item.OrderNumber,
      null, //滾球時間,平台原始的滾球數據 優勝冠軍沒有
      '',
      '',
      null, //相關比分清單  優勝冠軍沒有
      null, //主場狀態  優勝冠軍沒有
      false, //只能單注，不能串
      false,  //是否有分析數據(BR) 優勝冠軍沒有
      false, //是否有可視化 優勝冠軍沒有
      null, //BREventId 可視化(BR)比賽Id 優勝冠軍沒有
      false, //是否滾球中  優勝冠軍沒有
      false, //是否有直播數據 優勝冠軍沒有
      null, //直播源列表
      null, //賽日指標，用於虛擬體育
      null, //賽事指標，用於虛擬體育
      null, //額外信息
      SportId,
      VendorMarkets.OUTRIGHT,
      item.Competition.CompetitionId,
      item.Competition.CompetitionName,
      1, //玩法總數 都只有一種  就是 優勝冠軍
      isFavourite,
      true, //是 優勝冠軍賽事
      item.OutrightEventName,
      [], //玩法分組列表 優勝冠軍沒有
      item.MarketLines.map(lineItem => {
        return new LineData(
          [], //玩法分組 優勝冠軍沒有
          lineItem.BetTypeId,
          lineItem.BetTypeName,
          lineItem.IsLocked,
          lineItem.MarketlineId,
          lineItem.MarketLineLevel,
          lineItem.MarketlineStatusId,
          lineItem.PeriodId,
          lineItem.PeriodName,
          item.EventId,
          null,
          null,
          null,
          lineItem.WagerSelections.map(selectionItem => {

            //從OddsList獲取賠率
            let thisOddsType = null;
            let thisOddsValue = null;
            if (selectionItem.OddsList && selectionItem.OddsList.length > 0) {
              let targetOddsInfo = selectionItem.OddsList[0]; //默認選第一個賠率
              const matchOddsInfos = selectionItem.OddsList.filter(oInfo => parseInt(oInfo.OddsType) === memberOddsType);
              if (matchOddsInfos && matchOddsInfos.length > 0) { //如果有找到跟會員設置的盤口一樣的，就使用這個
                targetOddsInfo = matchOddsInfos[0];
              }
              thisOddsType = targetOddsInfo.OddsType;
              thisOddsValue = targetOddsInfo.OddsValues[memberType]; //根據水位選擇賠率
            }

            //如果沒獲取到就用默認值
            thisOddsValue = thisOddsValue ?? selectionItem.Odds;
            thisOddsType = thisOddsType ?? selectionItem.OddsType;

            return new SelectionData(
              selectionItem.WagerSelectionId,
              selectionItem.SelectionId,
              selectionItem.SelectionName,
              0, //IM沒有selection group
              selectionItem.Handicap,
              selectionItem.Handicap,
              selectionItem.Specifiers,
              SportId,
              VendorMarkets.OUTRIGHT,
              MarketName,
              item.Competition.CompetitionId,
              item.Competition.CompetitionName,
              null,
              null,
              null,
              null,
              null,
              null,
              item.EventId,
              false,
              lineItem.MarketlineId,
              lineItem.BetTypeId,
              lineItem.BetTypeName,
              lineItem.PeriodId,
              lineItem.PeriodName,
              selectionItem.SelectionId, //優勝冠軍的目標隊就是selectionItem
              selectionItem.SelectionName,
              true,
              item.OutrightEventName,
              thisOddsValue,
              thisOddsType,
              selectionItem.OddsList ? selectionItem.OddsList.map(oddsItem => {
                return new OddsData(
                  oddsItem.OddsType,
                  oddsItem.OddsValues,
                )
              }) : [],
              new oddsDeciaml(thisOddsValue).toFixed(2),
            )
          })
        )
      })
    )
  }

  //從BTI數據生成EventData數據
  static createFromBTISource(item, lines, marketId = null, FavoriteEvents, memberOddsType = null) {
    item.id = item.id + ''; //BTI固定轉為string

    if( memberOddsType === null) {
      memberOddsType = VendorBTI.getMemberSetting().oddsType;
    }

    //判斷市場
    if (marketId === null) {
      if (item.type === 'Outright') {
        //優勝冠軍
        marketId = VendorMarkets.OUTRIGHT;
      } else if(item.isLive == true) {
        //滾球
        marketId = VendorMarkets.RUNNING;
      } else {
        //今日早盤 由日期判斷
        const oneDayAfter = moment().add(1,'day').utcOffset(VendorConfigs.TIMEZONE);
        const eventDate = moment(item.startEventDate).utcOffset(VendorConfigs.TIMEZONE);
        if (eventDate > oneDayAfter) {
          marketId = VendorMarkets.EARLY;
        } else {
          marketId = VendorMarkets.TODAY;
        }
      }
    }

    const marketName = VendorMarketNames[marketId];

    const isFavourite = FavoriteEvents.filter(favItem=>item.id === favItem.EventId).length > 0;

    const homeTeams = item.participants.filter(item => item.venueRole === 'Home');
    let homeTeam = {
      id: 0,
      name: 'not set',
      score: (item.score ? item.score.homeScore : null),
      redCard : ((item.score && item.score.additionalScores) ? item.score.additionalScores.redCardsTeam1 : null),
      corner : ((item.score && item.score.additionalScores) ? item.score.additionalScores.cornersTeam1 : null),
    };
    if (homeTeams && homeTeams.length > 0) {
      const homeTeamData = homeTeams[0];
      homeTeam.id = homeTeamData.id;
      homeTeam.name = homeTeamData.name;
    }

    const awayTeams = item.participants.filter(item => item.venueRole === 'Away');
    let awayTeam = {
      id: 0,
      name: 'not set',
      score: (item.score ? item.score.awayScore : null),
      redCard : ((item.score && item.score.additionalScores) ? item.score.additionalScores.redCardsTeam2 : null),
      corner : ((item.score && item.score.additionalScores) ? item.score.additionalScores.cornersTeam2 : null),
    };
    if (awayTeams && awayTeams.length > 0) {
      const awayTeamData = awayTeams[0];
      awayTeam.id = awayTeamData.id;
      awayTeam.name = awayTeamData.name;
    }

    const thisLines = lines.filter(line => {
      return line.eventId == item.id;
    });

    let oddsTypePropList = [];
    for (let oddsPropName in BTIOddsTypeToNumber) {
      oddsTypePropList.push({name: oddsPropName, number: BTIOddsTypeToNumber[oddsPropName]});
    }

    //排序玩法分組
    let compareLineGroupFunc = (left,right) => {
      const a = left.SortNumber;
      const b = right.SortNumber;
      if (a < b ) {// 按某种排序标准进行比较, a 小于 b
        return -1;
      }
      if (a > b ) {
        return 1;
      }
      // a must be equal to b
      return 0;
    }

    //處理滾球時間
    let rbMinute = '';
    let rbPeriod = '';
    if (item.isLive && item.liveGameState) {
      rbPeriod = item.liveGameState.gamePart;
      if (rbPeriod && rbPeriod.length > 0) {
        const rbname = BTIRBPeriodNames[rbPeriod];  //中文名
        if (rbname) {
          rbPeriod = rbname;  //有對到才用中文名，沒對到 就直接用原本的字
        }
      }
      if (item.liveGameState.gameTime) {
        rbMinute = new Decimal(item.liveGameState.gameTime).dividedToIntegerBy(60).toString();
      }
      if(rbPeriod === undefined || rbPeriod === null) {
        rbPeriod = '';//空字符串 避免報錯
      }
    }

    //處理優勝冠軍
    let isOutRightEvent = false;
    let outRightEventName = '';
    if (item.type === 'Outright') {
      isOutRightEvent = true;
      outRightEventName = item.eventName;
    }

    //判斷強制歐洲盤的玩法
    const forceDecimalBetTypeIds = BTIForceDecimalBetTypeIds[parseInt(item.sportId)];

    return new EventData(
      item.id,
      item.startEventDate,
      1, //開盤狀態？ BTI沒有
      0, //分組? BTI沒有
      0, //分組類型? BTI沒有
      homeTeam.id,
      homeTeam.name,
      homeTeam.score,
      homeTeam.redCard,
      homeTeam.corner,
      awayTeam.id,
      awayTeam.name,
      awayTeam.score,
      awayTeam.redCard,
      awayTeam.corner,
      true,
      item.leagueOrder ? item.leagueOrder : item.sportOrder,
      item.liveGameState, //原始滾球數據
      rbMinute,
      rbPeriod,
      item.score ? item.score.additionalScores: null,
      1, //主場狀態 BTI沒有
      true, //是否支持串關 BTI沒有
      false, //是否有分析數據(BR) BTI沒有
      false, //是否有可視化 BTI沒有
      null, //可視化(BR)比賽Id BTI沒有
      item.isLive,
      false, //是否有直播數據 //TODO:待確認
      null, //直播源列表 //TODO:待確認
      null, //賽日指標，用於虛擬體育 BTI沒有? //TODO:待確認
      null,   //賽事指標，用於虛擬體育 BTI沒有? //TODO:待確認
      { tags: item.tags, metadata: item.metadata },
      parseInt(item.sportId),
      marketId,
      item.leagueId,
      item.leagueName,
      item.totalActiveMarketsCount,
      isFavourite,
      isOutRightEvent,
      outRightEventName,
      item.marketGroups.map(mgitem => {
        //計算組內數量
        const linesInGroup = thisLines.filter(l => {
          return l.groups.indexOf(mgitem.id) !== -1;
        })

        //注意這個marketGroup.id不是固定，要獲取中文名，只能用英文名去對照中文
        let thisMarketGroupTypeName = BTIMarketGroupTypeNames[mgitem.name];
        if (!thisMarketGroupTypeName) { //對應不到就先放英文名
          thisMarketGroupTypeName = mgitem.name;
        }

        return new LineGroupData(
          mgitem.id,
          thisMarketGroupTypeName,
          linesInGroup.length,
          mgitem.order,
        )
      }).sort(compareLineGroupFunc),
      thisLines.map(lineItem => {

        //處理特殊玩法 名稱統一(讓分 大小)
        let thisBetTypeName = lineItem.name; //直接用name比用marketType.name完整
        let periodData = {PeriodId: 0, PeriodName : ''}
        const specialBetTypeName = BTIBetTypeNames[lineItem.marketType.id];
        if (specialBetTypeName) {
          thisBetTypeName = specialBetTypeName;
          periodData = BTIPeriodMapping[lineItem.marketType.id];
        }

        return new LineData(
          lineItem.groups ? lineItem.groups : [], //玩法分組
          lineItem.marketType.id,
          thisBetTypeName,
          lineItem.isSuspended, //盘口是否封盘
          lineItem.id,
          1, //盘口级别 BTI沒有
          1, //盘口狀態 1開 2關 BTI沒有
          periodData.PeriodId, //比赛时段 ID  1全場 2上半 3下半 BTI沒有
          periodData.PeriodName, //比赛时段名  BTI沒有
          item.id,
          0, //分組類型? BTI沒有
          homeTeam.name,
          awayTeam.name,
          lineItem.selections.map(selectionItem => {

            //特別處理讓分大小的selectionName
            if (specialBetTypeName) {
              if (selectionItem.outcomeType == 'Home') {
                selectionItem.name = i18n.HOME
              }
              if (selectionItem.outcomeType == 'Away') {
                selectionItem.name = i18n.AWAY
              }
              if (selectionItem.outcomeType == 'Over') {
                selectionItem.name = i18n.BIG
              }
              if (selectionItem.outcomeType == 'Under') {
                selectionItem.name = i18n.SMALL
              }
            }

            //判斷投注目標球隊，BTI利用participantMapping判斷
            let targetTeamId = null;
            let targetTeamName = '';
            if (selectionItem.participantMapping) {
              const filtedTeams = item.participants.filter(item => item.id === selectionItem.participantMapping);
              if (filtedTeams.length > 0) {
                targetTeamId = filtedTeams[0].id;
                targetTeamName = filtedTeams[0].name;
              }
            }

            //如果用participantMapping沒有對到，改用selectionName判斷
            if (targetTeamId === null) {
              if ((homeTeam.name && selectionItem.name.indexOf(homeTeam.name) !== -1) //玩法名包含隊名
                || selectionItem.name === i18n.HOME) //或者玩法名就是一個「主」字
              {
                targetTeamId = homeTeam.id;
                targetTeamName = homeTeam.name;
              } else if ((awayTeam.name && selectionItem.name.indexOf(awayTeam.name) !== -1) //玩法名包含隊名
                || selectionItem.name === i18n.AWAY)//或者玩法名就是一個「客」字
              {
                targetTeamId = awayTeam.id;
                targetTeamName = awayTeam.name;
              }
            }

            let thisOddsType = memberOddsType;
            if(forceDecimalBetTypeIds && forceDecimalBetTypeIds.indexOf(lineItem.marketType.id) !== -1) {
              //console.log('===force decimal',lineItem.marketType.id,JSON.parse(JSON.stringify(selectionItem)))
              thisOddsType = 'decimal';
            }

            return new SelectionData(
              selectionItem.id,
              selectionItem.outcomeType,
              selectionItem.name,
              selectionItem.group,
              selectionItem.points,
              selectionItem.points,
              selectionItem.tags,
              item.sportId,
              marketId,
              marketName,
              item.leagueId,
              item.leagueName,
              homeTeam.id,
              homeTeam.name,
              homeTeam.score,
              awayTeam.id,
              awayTeam.name,
              awayTeam.score,
              item.id,
              true, //是否支持串關 BTI沒有
              lineItem.id,
              lineItem.marketType.id,
              thisBetTypeName,
              periodData.PeriodId, //比赛时段 ID  1全場 2上半 3下半 BTI沒有 只有特殊玩法(讓分,大小)有提供，其他帶0
              periodData.PeriodName,
              targetTeamId,
              targetTeamName,
              isOutRightEvent,
              outRightEventName,
              selectionItem.displayOdds[thisOddsType],
              BTIOddsTypeToNumber[thisOddsType],
              oddsTypePropList.map(oddsTypeData => {
                return new OddsData(
                  oddsTypeData.number,
                  selectionItem.displayOdds[oddsTypeData.name],
                )
              }),
              selectionItem.displayOdds[thisOddsType],
            )
          })
        )
      })
    )
  }

  static createFromBTIChange(item, oldData, FavoriteEvents) {
    item.id = item.id + ''; //BTI固定轉為string

    const isFavourite = FavoriteEvents.filter(favItem=>item.id === favItem.EventId).length > 0;

    let homeScore = oldData.HomeScore;
    let homeRedCard = oldData.HomeRedCard;
    let homeCorner = oldData.HomeCorner;
    let awayScore = oldData.AwayScore;
    let awayRedCard = oldData.AwayRedCard;
    let awayCorner = oldData.AwayCorner;
    if (item.score) {
      if (item.score.homeScore) {
        homeScore = item.score.homeScore;
      }
      if(item.score.additionalScores && item.score.additionalScores.redCardsTeam1) {
        homeRedCard = item.score.additionalScores.redCardsTeam1;
      }
      if(item.score.additionalScores && item.score.additionalScores.cornersTeam1) {
        homeCorner = item.score.additionalScores.cornersTeam1;
      }

      if (item.score.awayScore) {
        awayScore = item.score.awayScore;
      }
      if(item.score.additionalScores && item.score.additionalScores.redCardsTeam2) {
        awayRedCard = item.score.additionalScores.redCardsTeam2;
      }
      if(item.score.additionalScores && item.score.additionalScores.cornersTeam2) {
        awayCorner = item.score.additionalScores.cornersTeam2;
      }
    }

    //處理滾球時間
    let rbMinute = oldData.RBMinute;
    let rbPeriod = oldData.RBPeriodName;
    if(!item.liveGameState) {
      item.liveGameState = oldData.RBTime;
    }
    if (item.isLive && item.liveGameState) {
      rbPeriod = item.liveGameState.gamePart;
      if (rbPeriod && rbPeriod.length > 0) {
        const rbname = BTIRBPeriodNames[rbPeriod];  //中文名
        if (rbname) {
          rbPeriod = rbname;  //有對到才用中文名，沒對到 就直接用原本的字
        }
      }
      if (item.liveGameState.gameTime) {
        rbMinute = new Decimal(item.liveGameState.gameTime).dividedToIntegerBy(60).toString();
      }
      if(rbPeriod === undefined || rbPeriod === null) {
        rbPeriod = '';//空字符串 避免報錯
      }
    }

    //注意這個BTI的change只有更新Event本身，下屬的數組(投注線Lines,投注分組LineGroups等) 是另外處理，這裡只要拿舊數據複製就可以
    return new EventData(
      oldData.EventId,
      item.startEventDate ?? oldData.EventDate,
      1, //開盤狀態？ BTI沒有
      0, //分組? BTI沒有
      0, //分組類型? BTI沒有
      oldData.HomeTeamId,
      oldData.HomeTeamName,
      homeScore,
      homeRedCard,
      homeCorner,
      oldData.AwayTeamId,
      oldData.AwayTeamName,
      awayScore,
      awayRedCard,
      awayCorner,
      true,
      oldData.SortOrder,
      item.liveGameState, //滾球時間
      rbMinute,
      rbPeriod,
      item.score ? item.score.additionalScores : oldData.RelatedScores,
      1, //主場狀態 BTI沒有
      true, //是否支持串關 BTI沒有
      false, //是否有分析數據(BR) BTI沒有
      false, //是否有可視化 BTI沒有
      null, //可視化(BR)比賽Id BTI沒有
      item.isLive,
      false, //是否有直播數據 //TODO:待確認
      null, //直播源列表 //TODO:待確認
      null, //賽日指標，用於虛擬體育 BTI沒有? //TODO:待確認
      null,   //賽事指標，用於虛擬體育 BTI沒有? //TODO:待確認
      { tags: item.tags ?? oldData.ExtraInfo.tags,  metadata: item.metadata ?? oldData.ExtraInfo.metadata },
      oldData.SportId,
      oldData.MarketId,
      oldData.LeagueId,
      oldData.LeagueName,
      item.totalActiveMarketsCount ?? oldData.TotalLineCount,
      isFavourite,
      oldData.IsOutRightEvent,
      oldData.OutRightEventName,
      oldData.LineGroups.map(lgItem => {
        return new LineGroupData(
          lgItem.LineGroupId,
          lgItem.LineGroupName,
          lgItem.LineCount,
          lgItem.SortNumber,
        )
      }),
      oldData.Lines.map(lineItem => {
        return LineData.clone(lineItem)
      })
    )
  }

  static sortEvents(events = [], sortWay = SortWays.LeagueName) {
    //排序id + 聯賽id 自然排序
    const natureCompFunc = (left,right) => {
      const a = left.SortOrder + '_' + left.LeagueId;
      const b = right.SortOrder + '_' + right.LeagueId;
      return natureCompare(a,b); //自然排序
    }

    //時間排序
    const timeCompareFunc = (left,right) => {
      //時間 按開賽時間 小的(早開賽的)在前
      const a = left.EventDate;
      const b = right.EventDate;
      if (a < b ) {// 按某种排序标准进行比较, a 小于 b
        return -1;
      }
      if (a > b ) {
        return 1;
      }
      // a must be equal to b
      return 0;
    }

    let result = events;

    //聯賽排序 = 先按時間排，然後聯賽排
    if (sortWay === SortWays.LeagueName) {
      result = (result !== null && result.length > 0) ? result.sort(timeCompareFunc):[];
      result = (result !== null && result.length > 0) ? result.sort(natureCompFunc):[];
    }

    //時間排序 = 先按聯賽排，然後時間排
    if (sortWay === SortWays.EventTime) {
      result = (result !== null && result.length > 0) ? result.sort(natureCompFunc):[];
      result = (result !== null && result.length > 0) ? result.sort(timeCompareFunc):[];
    }

    return  result;
  }

  static clone(srcEventData, memberOddsType = null, memberType = null) {
    return new EventData(
      srcEventData.EventId,
      srcEventData.EventDate,
      srcEventData.EventStatusId,
      srcEventData.EventGroupId,
      srcEventData.EventGroupTypeId,
      srcEventData.HomeTeamId,
      srcEventData.HomeTeamName,
      srcEventData.HomeScore,
      srcEventData.HomeRedCard,
      srcEventData.HomeCorner,
      srcEventData.AwayTeamId,
      srcEventData.AwayTeamName,
      srcEventData.AwayScore,
      srcEventData.AwayRedCard,
      srcEventData.AwayCorner,
      srcEventData.HasCornerData,
      srcEventData.SortOrder,
      srcEventData.RBTime,
      srcEventData.RBMinute,
      srcEventData.RBPeriodName,
      srcEventData.RelatedScores,
      srcEventData.GroundTypeId,
      srcEventData.IsOpenParlay,
      srcEventData.HasStatistic,
      srcEventData.HasVisualization,
      srcEventData.BREventId,
      srcEventData.IsRB,
      srcEventData.HasLiveStreaming,
      srcEventData.LiveStreamingUrl,
      srcEventData.MatchDay,
      srcEventData.Season,
      srcEventData.ExtraInfo,
      srcEventData.SportId,
      srcEventData.MarketId,
      srcEventData.LeagueId,
      srcEventData.LeagueName,
      srcEventData.TotalLineCount,
      srcEventData.IsFavourite,
      srcEventData.IsOutRightEvent,
      srcEventData.OutRightEventName,
      srcEventData.LineGroups ? srcEventData.LineGroups.map(lgItem => {
        return new LineGroupData(
          lgItem.LineGroupId,
          lgItem.LineGroupName,
          lgItem.LineCount,
          lgItem.SortNumber,
        )
      }) : [],
      srcEventData.Lines ? srcEventData.Lines.map(lineItem => LineData.clone(lineItem, memberOddsType, memberType)) : []
    )
  }
}