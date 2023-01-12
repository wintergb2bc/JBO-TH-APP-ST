//注單數據
import WagerItemData from "./WagerItemData";
import {
  IMComboTypeNames,
  IMOddsTypeName, IMWagerCancelReasonName, IMWagerCancelStatusName,
  IMWagerConfirmStatusName,
  IMWagerStatusName
} from "../im/IMConsts";
import {
  BTIBetTypeNames,
  BTIComboTypeNames,
  BTIPeriodMapping,
  BTIWagerOddsTypeName,
  BTIWagerOddsTypeToNumber,
  BTIWagerStatusName
} from "../bti/BTIConsts";
import {VendorConfigs, VendorMarketNames, VendorMarkets, VendorPeriodName} from "./VendorConsts";
import Deciaml, {Decimal} from "decimal.js";
import moment from "moment";
import i18n from '../vendori18n';

export default class WagerData {
  /**
   * @param WagerId 注單ID
   * @param CreateTime 投注创建的日期和时间
   * @param SettleDateTime 結算日期時間
   * @param MemberCode 用户名
   * @param BetAmount 会员提交的投注金额
   * @param WinLossAmount 輸贏金額
   * @param ComboBonusWinningsAmount 串關獎勵額外盈利金額
   * @param OddsType 賠率類型
   * @param OddsTypeName 賠率類型中文
   * @param WagerType 注單類型 1單注 2串關
   * @param Platform 投注平台
   * @param WagerStatus 注單狀態 IM 1待定 2確認 3拒絕 4取消 bti是英文
   * @param WagerStatusName 注單狀態中文
   * @param SettleStatus 是否已結算 0未結算 1已結算
   * @param ResettleStatus 是否重新結算 0未重新結算 1有重新結算
   * @param TradeStatus 注單回購(售出)狀態 0未售 1已售 2進行中 3取消
   * @param TradePriceId 注單回購(售出)價格ID
   * @param TradePrice 注單回購(售出)價格
   * @param TradeAmount 注單回購(售出)價格? 提前兑现已买投注的金额. 只有已售给提前兑现的投注产生 数值?  暫時不清楚是啥
   * @param ComboCount 串關 注數
   * @param ComboType 串關類型 各平台返回不同
   * @param ComboTypeName 串關類型中文
   * @param Odds 整單賠率，IM只有單注提供，串關不提供整單賠率
   * @param PotentialPayoutAmount 預估可能派彩金額
   * @param CanTrade 是否可注單回購 false/true
   * @param HasComboBonus 有串關額外獎勵
   * @param ComboBonusPercentage 串關獎勵百分比(數字) 已經是百分率 不是小數，加個%一起顯示即可
   * @param OriginPotentialPayoutAmount 未加上串關獎勵的 原始 預估可能派彩金額
   * @param FreeBetAmount 免費投注金額
   * @param WagerItems 投注數據，WagerItemData數組，單筆投注只會有一個，串關會有多個
   */
  constructor(
              WagerId,
              CreateTime,
              SettleDateTime,
              MemberCode,
              BetAmount,
              WinLossAmount,
              ComboBonusWinningsAmount,
              OddsType,
              OddsTypeName,
              WagerType,
              Platform,
              WagerStatus,
              WagerStatusName,
              SettleStatus,
              ResettleStatus,
              TradeStatus,
              TradePriceId,
              TradePrice,
              TradeAmount,
              ComboCount,
              ComboType,
              ComboTypeName,
              Odds,
              PotentialPayoutAmount,
              CanTrade,
              HasComboBonus = false,
              ComboBonusPercentage = 0,
              OriginPotentialPayoutAmount = 0,
              FreeBetAmount = 0,
              WagerItems = [],
              )
  {
    Object.assign(this, {
      WagerId,
      CreateTime,
      SettleDateTime,
      MemberCode,
      BetAmount,
      WinLossAmount,
      ComboBonusWinningsAmount,
      OddsType,
      OddsTypeName,
      WagerType,
      Platform,
      WagerStatus,
      WagerStatusName,
      SettleStatus,
      ResettleStatus,
      TradeStatus,
      TradePriceId,
      TradePrice,
      TradeAmount,
      ComboCount,
      ComboType,
      ComboTypeName,
      Odds,
      PotentialPayoutAmount,
      CanTrade,
      HasComboBonus,
      ComboBonusPercentage,
      OriginPotentialPayoutAmount,
      FreeBetAmount,
      WagerItems,
    });
  }

  getCreateTimeMoment() {
    return moment(this.CreateTime).utcOffset(VendorConfigs.TIMEZONE);
  }

  //從IM數據生成WagerData數據
  static createFromIMSource(item) {

    const oddsDeciaml = Decimal.clone({ rounding: 3 }) //無條件捨去, im強迫症 需要兩位小數

    return new WagerData(
      item.WagerId,
      item.WagerCreationDateTime,
      item.SettlementDateTime,
      item.MemberCode,
      item.InputtedStakeAmount,
      new oddsDeciaml(item.MemberWinLossAmount).toFixed(2),
      0, //im沒有串關獎勵
      item.OddsType,
      IMOddsTypeName[item.OddsType],
      item.WagerType,
      item.BettingPlatform,
      item.BetConfirmationStatus,
      IMWagerStatusName[item.BetConfirmationStatus],
      item.BetSettlementStatus,
      item.BetResettled,
      item.BetTradeStatus,
      item.PricingId,
      item.BuyBackPricing,
      item.BetTradeBuyBackAmount,
      item.NoOfCombination,
      item.ComboSelection,
      IMComboTypeNames[item.ComboSelection],
      item.WagerType === 1 ? (item.WagerItemList && item.WagerItemList[0] ? new oddsDeciaml(item.WagerItemList[0].Odds).toFixed(2) : null) : null,  //IM只有單注有賠率，串關沒有
      new oddsDeciaml(item.PotentialPayout).toFixed(2),
      item.CanSell,
      false,
      0,
      0,
      0,
      item.WagerItemList.map(witem => {

        //獲取賽果 1全場 2上半 3下半
        //默認全部空
        let gameResults = {0: {home:null,away:null,result:''}, 1: {home:null,away:null,result:''},2: {home:null,away:null,result:''},3: {home:null,away:null,result:''}};
        //確認有數據才計算
        if (witem.HomeTeamHTScore !== null && witem.HomeTeamFTScore !== null
          && witem.AwayTeamHTScore !== null && witem.AwayTeamFTScore !== null)
        {
          //全場
          gameResults[1].home = witem.HomeTeamFTScore;
          gameResults[1].away = witem.AwayTeamFTScore;
          gameResults[1].result = gameResults[1].home + ' : ' + gameResults[1].away;
          //上半
          gameResults[2].home = witem.HomeTeamHTScore;
          gameResults[2].away = witem.AwayTeamHTScore;
          gameResults[2].result = gameResults[2].home + ' : ' + gameResults[2].away;
          //下半 = 全場-上半
          gameResults[3].home = witem.HomeTeamFTScore - witem.HomeTeamHTScore;
          gameResults[3].away = witem.AwayTeamFTScore - witem.AwayTeamHTScore;
          gameResults[3].result = gameResults[3].home + ' : ' + gameResults[3].away;
        }

        //從EventDatas那邊複製IM處理代碼(數據結構有點不同，做函數比較麻煩，只好複製)

        //IM的大/小 改成 大小 和mockup一致
        if (witem.BetTypeName === i18n.BIG_OR_SMALL) {
          witem.BetTypeName = i18n.BIG_SMALL
        }

        //處理IM的特殊玩法線名 - 第{goalnr}粒入球球队
        let thisBetTypeName = witem.BetTypeName;
        if (thisBetTypeName.indexOf('{') !== -1 && thisBetTypeName.indexOf('}') !== -1 ) {
          //從下面的selection找能用的替代文字(這到底是什麼神奇結構。。。)
          let childSelectionSpecifiers = []
          //lineItem.WagerSelections.map(s => {
            if (witem.Specifiers && (witem.Specifiers.indexOf('=') !== -1)) {
              if (childSelectionSpecifiers.indexOf(witem.Specifiers) === -1) {
                childSelectionSpecifiers.push(witem.Specifiers);
              }
            }
          //});
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

        let thisSelectionName = witem.SelectionName;

        //處理IM的特殊投注選項名
        if (witem.Specifiers && (witem.Specifiers.indexOf('=') !== -1)) {
          const spec_arr = witem.Specifiers.split('='); //用=切開
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

        let thisHandiCap = witem.Handicap;

        //處理讓球
        if (witem.BetTypeId === 1 && thisHandiCap !== null) {
          let thisHandicapDecimal = new Decimal(thisHandiCap);
          if (witem.SelectionId === 1) { //主場
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
        if (witem.BetTypeId === 2 && thisHandiCap !== null) {
          let thisHandicapDecimal = new Decimal(thisHandiCap);
          //如果是0.25或0.75，
          if (thisHandicapDecimal.abs().mod(1).eq(0.25) || thisHandicapDecimal.abs().mod(1).eq(0.75)) {
            // 0.75 改成 0.5/1
            if (thisHandicapDecimal.greaterThan(0)) {
              thisHandiCap = thisHandicapDecimal.sub(0.25).toNumber() + '/' + thisHandicapDecimal.add(0.25).toNumber();
            }
          }
        }

        //判斷投注目標球隊，IM利用selectionName判斷
        let targetTeamId = null;
        let targetTeamName = '';
        if ((witem.HomeTeamName && thisSelectionName.indexOf(witem.HomeTeamName) !== -1) //玩法名包含隊名
          || thisSelectionName === i18n.HOME) //或者玩法名就是一個「主」字
        {
          targetTeamId = witem.HomeTeamId;
          targetTeamName = witem.HomeTeamName;
        } else if ((witem.AwayTeamName && thisSelectionName.indexOf(witem.AwayTeamName) !== -1) //玩法名包含隊名
          || thisSelectionName === i18n.AWAY)//或者玩法名就是一個「客」字
        {
          targetTeamId = witem.HomeTeamId;
          targetTeamName = witem.AwayTeamName;
        }

        //注單才有，投注目標改成用OutrightTeamName處理
        if (witem.EventTypeId === 2) {
          targetTeamId = witem.OutrightTeamId;
          targetTeamName = witem.OutrightTeamName;
        }

        return new WagerItemData(
          witem.WagerItemConfirmationStatus,
          IMWagerStatusName[witem.WagerItemConfirmationStatus],
          witem.WagerItemConfirmationType,
          IMWagerConfirmStatusName[witem.WagerItemConfirmationType],
          witem.WagerItemCancelType,
          IMWagerCancelStatusName[witem.WagerItemCancelType],
          witem.WagerItemCancelReason,
          IMWagerCancelReasonName[witem.WagerItemCancelReason],
          witem.Market,
          VendorMarketNames[witem.Market],
          witem.EventId,
          witem.EventDateTime,
          witem.SportId,
          witem.CompetitionId,
          witem.CompetitionName,
          witem.SourceId,
          witem.Season,
          witem.MatchDay,
          witem.EventGroupTypeId,
          witem.HomeTeamId,
          witem.HomeTeamName,
          witem.AwayTeamId,
          witem.AwayTeamName,
          witem.BetTypeId,
          thisBetTypeName,
          witem.PeriodId,
          VendorPeriodName[witem.PeriodId],
          witem.BetTypeSelectionId,
          thisSelectionName,
          witem.EventTypeId === 2,
          witem.EventOutrightName,
          witem.OutrightTeamId,
          witem.OutrightTeamName,
          new oddsDeciaml(witem.Odds).toFixed(2),
          thisHandiCap,
          witem.HomeTeamHTScore,
          witem.AwayTeamHTScore,
          witem.HomeTeamFTScore,
          witem.AwayTeamFTScore,
          witem.WagerHomeTeamScore,
          witem.WagerAwayTeamScore,
          gameResults[witem.PeriodId].home,
          gameResults[witem.PeriodId].away,
          gameResults[witem.PeriodId].result,
          witem.GroundTypeId,
          targetTeamId,
          targetTeamName,
        )
      })
    )
  }

  //從BTI數據生成WagerData數據
  static createFromBTISource(item) {

    //串關類型轉中文
    let ComboTypeName = '';
    let ComboType = item.type;
    if (ComboType === 'Combo') {
      const selectionCount = item.numberOfSelections;
      ComboTypeName = (BTIComboTypeNames[ComboType]).replace('N',selectionCount);
    } else if(ComboType.lastIndexOf('System', 0) === 0) {
      const fromIndex = ComboType.indexOf('from');
      const x = ComboType.substr(6,fromIndex-6);
      const y = ComboType.substr(fromIndex+4);
      ComboTypeName = (BTIComboTypeNames['SystemXfromY']).replace('X',x).replace('Y',y);
    } else {
      ComboTypeName = BTIComboTypeNames[ComboType];
    }

    const thisDeciaml = Decimal.clone({ rounding: 3 }) //指定小數點處理方式 無條件捨去

    //BTI展示盤口類型檢查 (文件有這個字段，但是實際沒返回)
    if (!item.displayOddsStyle) {
      item.displayOddsStyle = 'notset'; //沒有返回配置為空

      //嘗試用賠率和金額去判斷盤口
      if (item.displayOdds && (ComboType === 'Single')) { //bti串關不會有displayOdds，下面的selection也不拿來推算盤口
        const thisOdds = new thisDeciaml(item.displayOdds);
        if (thisOdds.isNegative()) {
          if (thisOdds.greaterThanOrEqualTo(-1)) {
            item.displayOddsStyle = 'Malaysian'; //馬來盤，介於0和-1之間 包含-1
          } else if (thisOdds.lessThan(-1)) {
            item.displayOddsStyle = 'Indonesian'; //印尼盤，小於-1
          }
        } else {
          //投注金額*賠率
          const stakeMultifyOdds = new Deciaml(thisOdds.mul(item.totalStake).toFixed(2));
          if (stakeMultifyOdds.equals(item.amountToWin)) { //香港盤 = 盈利
            item.displayOddsStyle = 'HongKong';
          } else if (stakeMultifyOdds.equals(item.potentialReturns)) {// 歐洲盤 = 本金+盈利
            item.displayOddsStyle = 'Decimal';
          }
        }
      }
    }

    //注單數據只有一個 comboBonusPercentage 要自己去反推其他字段(文件有其他字段，但是實際沒返回)
    const hasComboBonus = !!item.comboBonusPercentage;
    //console.log('hasComboBonus',item.comboBonusPercentage,Deciaml.isDecimal(item.comboBonusPercentage));
    const comboBonusMultiplier = hasComboBonus ? new Deciaml(item.comboBonusPercentage).dividedBy(100).add(1) : 1;
    const realDisplayOdds = hasComboBonus ? new thisDeciaml(item.displayOdds).mul(comboBonusMultiplier).toFixed(2) : item.displayOdds;
    const realPotentialReturns = hasComboBonus
      //賠率x串關獎勵(1.xx)x投注金額 = 預期返獎
      ? (
        (item.displayOddsStyle === 'HongKong') //香港盤賠率要加1 本金
          ? new Deciaml(new thisDeciaml(item.displayOdds).add(1).mul(comboBonusMultiplier).mul(item.totalStake).toFixed(2)).toNumber()
          : new Deciaml(new thisDeciaml(item.displayOdds).mul(comboBonusMultiplier).mul(item.totalStake).toFixed(2)).toNumber()
      )
      : item.potentialReturns;
    const comboBonusWinningsAmount = hasComboBonus
      ? (
        (item.status === 'Settled')
        ? item.comboBonusWinningsAmount
        : new thisDeciaml(realPotentialReturns).sub(item.potentialReturns).toFixed(2) //未結算使用 含串關獎勵的預計獎金-不含串關獎勵的預計獎金
      )
      : 0;

    //處理win/lose amount
    let thisWinLoseAmount = 0;
    if (item.returns !== undefined && item.returns !== null) {
      //console.log('======item.returns',item.returns);
      thisWinLoseAmount = new Decimal(new thisDeciaml(item.returns).sub(item.totalStake).toFixed(2)).toNumber(); //輸贏= 返還-本金
    }

      return new WagerData(
        item.betId,
        item.placementDate,
        item.settlementDate,
        null,
        item.totalStake,
        thisWinLoseAmount,
        comboBonusWinningsAmount,
        BTIWagerOddsTypeToNumber[item.displayOddsStyle],
        BTIWagerOddsTypeName[item.displayOddsStyle],
        item.type === 'Single' ? 1 : 2, //注單類型 1單注 2串關
        item.sourceDeviceType,
        item.settlementStatus,
        BTIWagerStatusName[item.settlementStatus],
        item.status === 'Settled' ? 1 : 0, //bti剛好反過來，status實際上是 是否已結算，settlementStatus才是真正的狀態
        0,
        null,
        null,
        null,
        null,
        item.numberOfBets,
        item.type,
        ComboTypeName,
        realDisplayOdds,
        realPotentialReturns,
        false,
        hasComboBonus,
        hasComboBonus ? item.comboBonusPercentage : 0,
        hasComboBonus ? item.potentialReturns : 0,
        item.freeBetAmount ? item.freeBetAmount : 0,
        item.selections.map(witem => {

          const isOutRightEvent = (witem.eventType === 'Outright');

          //處理市場
          let marketId = VendorMarkets.EARLY;
          if (witem.isLive) {
            marketId = VendorMarkets.RUNNING;
          }
          if (isOutRightEvent) {
            marketId = VendorMarkets.OUTRIGHT;
          }

          //處理時間段
          let periodData = {PeriodId: 0, PeriodName : ''}
          const specialBetTypeName = BTIBetTypeNames[witem.marketId];
          if (specialBetTypeName) {
            periodData = BTIPeriodMapping[witem.marketId];
          }

          //判斷投注目標球隊
          let targetTeamId = null;
          let targetTeamName = '';
          //bti注單沒有participantMapping，只能用selectionName判斷
          if ((witem.homeTeamName && witem.selectionDisplayName.indexOf(witem.homeTeamName) !== -1) //玩法名包含隊名
            || witem.selectionDisplayName === i18n.HOME) //或者玩法名就是一個「主」字
          {
            targetTeamId = null;
            targetTeamName = witem.homeTeamName;
          } else if ((witem.awayTeamName && witem.selectionDisplayName.indexOf(witem.awayTeamName) !== -1) //玩法名包含隊名
            || witem.selectionDisplayName === i18n.AWAY)//或者玩法名就是一個「客」字
          {
            targetTeamId = null;
            targetTeamName = witem.awayTeamName;
          }

          return new WagerItemData(
            witem.settlementStatus,
            BTIWagerStatusName[item.settlementStatus],
            null,
            null,
            item.settlementStatus === 'Cancelled' ? 2 : 1,
            item.settlementStatus === 'Cancelled' ? i18n.BTI.CANCELLED : i18n.BTI.NOT_CANCELLED,
            null,
            null,
            marketId,
            VendorMarketNames[marketId],
            witem.eventId,
            witem.startEventDate,
            parseInt(witem.sportId),
            witem.leagueId,
            witem.leagueName,
            null,
            null,
            null,
            null,
            null,
            witem.homeTeamName,
            null,
            witem.awayTeamName,
            witem.marketId,
            witem.marketDisplayName,
            periodData.PeriodId,
            periodData.PeriodName,
            witem.selectionId,
            witem.selectionDisplayName,
            isOutRightEvent,
            isOutRightEvent ? witem.eventDisplayName : null,
            null,
            null,
            witem.displayOdds,
            witem.points,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            witem.gameScore,
            null,
            targetTeamId,
            targetTeamName,
          )
        }),
      )
  }
}