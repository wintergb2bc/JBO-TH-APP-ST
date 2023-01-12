//投注線(玩法) 數據
import {
  BTIBetTypeNames,
  BTIForceDecimalBetTypeIds,
  BTIOddsType,
  BTIOddsTypeToNumber,
  BTIPeriodMapping
} from "../bti/BTIConsts";
import SelectionData from "./SelectionData";
import OddsData from "./OddsData";
import {VendorMarketNames} from "./VendorConsts";
import {Decimal} from "decimal.js";
import i18n from '../vendori18n';

export default class LineData {
  /**
   * @param LineGroupIds 玩法分組ID 數組型態
   * @param BetTypeId 投注類型ID
   * @param BetTypeName 投注類型名
   * @param IsLocked 盘口是否封盘
   * @param LineId 玩法ID
   * @param LineLevel 盘口级别
   * @param LineStatusId 盘口狀態 1開 2關
   * @param PeriodId 比赛时段 ID  1全場 2上半 3下半
   * @param PeriodName 比赛时段
   * @param EventId 比賽Id
   * @param EventGroupTypeId 特別投注分類, im專用
   * @param HomeTeamName 主場球隊名，特別投注用, im專用
   * @param AwayTeamName 客場球隊名，特別投注用, im專用
   * 額外提供 SelectionCountInLine 建議一行放幾個Selection, 1/2/3個
   * 額外提供 IsDisplayByTeam 是否按主客隊 分列展示 true/false
   * @param Selections 投注選項 列表，SelectionData數組
   */
  constructor(
              LineGroupIds,
              BetTypeId,
              BetTypeName,
              IsLocked,
              LineId,
              LineLevel,
              LineStatusId,
              PeriodId,
              PeriodName,
              EventId,
              EventGroupTypeId,
              HomeTeamName,
              AwayTeamName,
              Selections = [],
              )
  {
    Object.assign(this, {
      LineGroupIds,
      BetTypeId,
      BetTypeName,
      IsLocked,
      LineId,
      LineLevel,
      LineStatusId,
      PeriodId,
      PeriodName,
      EventId,
      EventGroupTypeId,
      HomeTeamName,
      AwayTeamName,
      Selections,
    });

    this.updateSelectionAnalysis();
  }

  //比對投注線是不是同一種投注(im專用，im同一種投注會出多個，用EventGroupTypeId去分開)
  getKeyForCompare() {
    return [this.BetTypeId,this.BetTypeName,this.EventGroupTypeId,this.PeriodId].join('|');
  }

  isSimilarTo(otherLine) {
    return this.getKeyForCompare() === otherLine.getKeyForCompare()
  }

  updateSelectionAnalysis() {

    //是否按主客隊 分列展示
    this.IsDisplayByTeam = false;

    //按照name去分類
    const selectionNames = this.Selections.map(s => s.SelectionName);
    //去重複
    const uniqueSelectionNames = selectionNames.filter((item, index) => selectionNames.indexOf(item) === index);

    //先支持 主客  和 主客和 這兩種
    if (uniqueSelectionNames.length === 2
      && uniqueSelectionNames.indexOf(i18n.HOME) !== -1
      && uniqueSelectionNames.indexOf(i18n.AWAY) !== -1
    ) {
      this.IsDisplayByTeam = true;
    } if (uniqueSelectionNames.length === 3
      && uniqueSelectionNames.indexOf(i18n.HOME) !== -1
      && uniqueSelectionNames.indexOf(i18n.AWAY) !== -1
      && uniqueSelectionNames.indexOf(i18n.TIE) !== -1
    ){
      this.IsDisplayByTeam = true;
    }

    //按照targetTeam去分類
    if(this.IsDisplayByTeam !== true) {
      const targetTeamNames = this.Selections.map(s => s.TargetTeamName);
      //去重複
      const uniqueTargetTeamNames = targetTeamNames.filter((item, index) => targetTeamNames.indexOf(item) === index);

      //剛好targetTeam就是兩隊
      if (uniqueTargetTeamNames && uniqueTargetTeamNames.length === 2) {
        const selectionNameHasTeamNames = uniqueSelectionNames.filter(n => n.indexOf(uniqueTargetTeamNames[0]) !== -1 || n.indexOf(uniqueTargetTeamNames[1]) !== -1);
        //且玩法名都沒有包含隊名
        if (!selectionNameHasTeamNames || selectionNameHasTeamNames.length <=0) {
          this.IsDisplayByTeam = true;
        }
      }
    }

    //計算一行要放幾個Selection
    this.SelectionCountInLine = this._getSelectionCountInLine();
  }

  _getSelectionCountInLine() {
    if (this.Selections) {
      if (this.Selections.length === 1) {
        return 1;
      }

      if (this.Selections.length > 1) {
        //按照name去分類
        const selectionNames = this.Selections.map(s => s.SelectionName);
        const haveHandicap = this.Selections.filter(s => s.Handicap !== null).length > 0
        //去重複
        const uniqueSelectionNames = selectionNames.filter((item, index) => selectionNames.indexOf(item) === index);
        //console.log('=====uniqueSelectionNames',this.BetTypeName,uniqueSelectionNames.length,uniqueSelectionNames,selectionNames);
        //有幾種Selection
        const selectionCategoryCount = uniqueSelectionNames.length;
        //平均的selectionName長度
        let cc = 0;
        uniqueSelectionNames.map(usn => cc = cc + usn.length);
        let maxWordLength = 14;
        if (i18n.WORDWIDTH > 1) {
          maxWordLength = maxWordLength/i18n.WORDWIDTH; //中文算2個字寬
        }
        if (haveHandicap) {
          maxWordLength = maxWordLength - 2; //有多展示handicap多算兩個字
        }
        if (new Decimal(cc).dividedToIntegerBy(selectionCategoryCount).greaterThanOrEqualTo(maxWordLength)) {
          return 1;  //平均名稱超過，就直接展示一行一行的，要不放不下
        }

        if (selectionCategoryCount === 3) {
          return 3;
        }
      }
    }
    return 2; //默認2
  }

  static createFromBTIChange(lineItem,oldEventData,memberOddsType = BTIOddsType.HK) {

    let oddsTypePropList = [];
    for (let oddsPropName in BTIOddsTypeToNumber) {
      oddsTypePropList.push({name: oddsPropName, number: BTIOddsTypeToNumber[oddsPropName]});
    }

    const marketName = VendorMarketNames[oldEventData.MarketId];

    //處理特殊玩法 名稱統一(讓分 大小)
    let thisBetTypeName = lineItem.name; //直接用name比用marketType.name完整
    let periodData = {PeriodId: 0, PeriodName : ''}
    const specialBetTypeName = BTIBetTypeNames[lineItem.marketType.id];
    if (specialBetTypeName) {
      thisBetTypeName = specialBetTypeName;
      periodData = BTIPeriodMapping[lineItem.marketType.id];
    }

    let oldLine = null;
    if (oldEventData.Lines && oldEventData.Lines.length > 0) {
      const oldLines = oldEventData.Lines.filter(l => l.LineId === lineItem.id);
      if (oldLines && oldLines.length >0) {
        oldLine = oldLines[0];
      }
    }

    //判斷強制歐洲盤的玩法
    const forceDecimalBetTypeIds = BTIForceDecimalBetTypeIds[parseInt(oldEventData.SportId)];

    return new LineData(
      lineItem.groups ? lineItem.groups : (oldLine ? oldLine.LineGroupIds : []),
      lineItem.marketType.id,
      thisBetTypeName,
      lineItem.isSuspended, //盘口是否封盘
      lineItem.id,
      1, //盘口级别 BTI沒有
      1, //盘口狀態 1開 2關 BTI沒有
      periodData.PeriodId, //比赛时段 ID  1全場 2上半 3下半 BTI沒有
      periodData.PeriodName, //比赛时段名  BTI沒有
      oldEventData.EventId,
      0, //分組類型? BTI沒有
      oldEventData.HomeTeamName,
      oldEventData.AwayTeamName,
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
          if (oldEventData.HomeTeamId === selectionItem.participantMapping) {
            targetTeamId = oldEventData.HomeTeamId;
            targetTeamName = oldEventData.HomeTeamName;
          } else if (oldEventData.AwayTeamId === selectionItem.participantMapping) {
            targetTeamId = oldEventData.AwayTeamId;
            targetTeamName = oldEventData.AwayTeamName;
          }
        }

        //如果用participantMapping沒有對到，改用selectionName判斷
        if (targetTeamId === null) {
          if ((oldEventData.HomeTeamName && selectionItem.name.indexOf(oldEventData.HomeTeamName) !== -1) //玩法名包含隊名
            || selectionItem.name === i18n.HOME) //或者玩法名就是一個「主」字
          {
            targetTeamId = oldEventData.HomeTeamId;
            targetTeamName = oldEventData.HomeTeamName;
          } else if ((oldEventData.AwayTeamName && selectionItem.name.indexOf(oldEventData.AwayTeamName) !== -1) //玩法名包含隊名
            || selectionItem.name === i18n.AWAY)//或者玩法名就是一個「客」字
          {
            targetTeamId = oldEventData.AwayTeamId;
            targetTeamName = oldEventData.AwayTeamName;
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
          oldEventData.SportId,
          oldEventData.MarketId,
          marketName,
          oldEventData.LeagueId,
          oldEventData.LeagueName,
          oldEventData.HomeTeamId,
          oldEventData.HomeTeamName,
          oldEventData.HomeScore,
          oldEventData.AwayTeamId,
          oldEventData.AwayTeamName,
          oldEventData.AwayScore,
          oldEventData.EventId,
          oldEventData.IsOpenParlay,
          lineItem.id,
          lineItem.marketType.id,
          thisBetTypeName,
          periodData.PeriodId, //比赛时段 ID  1全場 2上半 3下半 BTI沒有 只有特殊玩法(讓分,大小)有提供，其他帶0
          periodData.PeriodName,
          targetTeamId,
          targetTeamName,
          oldEventData.IsOutRightEvent,
          oldEventData.OutRightEventName,
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
  }

  static clone(srcLineData, memberOddsType = null, memberType = null) {
    return new LineData(
      srcLineData.LineGroupIds,
      srcLineData.BetTypeId,
      srcLineData.BetTypeName,
      srcLineData.IsLocked,
      srcLineData.LineId,
      srcLineData.LineLevel,
      srcLineData.LineStatusId,
      srcLineData.PeriodId,
      srcLineData.PeriodName,
      srcLineData.EventId,
      srcLineData.EventGroupTypeId,
      srcLineData.HomeTeamName,
      srcLineData.AwayTeamName,
      srcLineData.Selections.map(selectionItem => SelectionData.clone(selectionItem, memberOddsType, memberType))
    )
  }
}