//單個投注數據
import moment from "moment";
import {VendorConfigs} from "./VendorConsts";

export default class WagerItemData {
  /**
   * @param WagerStatus 注單狀態 IM 1待定 2確認 3拒絕 4取消 bti是英文
   * @param WagerStatusName 注單狀態中文
   * @param ConfirmStatus 確認狀態 IM 0未確認 1普通確認 2危險球確認 bti無
   * @param ConfirmStatusName 確認狀態中文
   * @param CancelStatus 取消狀態 IM 1未取消 2注單取消 3比賽取消 bti 1未取消 2已取消
   * @param CancelStatusName 取消狀態中文
   * @param CancelReason 取消原因 IM 0無原因 1危險紅牌 2危險進球 101賽事終止 bti無
   * @param CancelReasonName 取消原因中文
   * @param MarketId 市場ID
   * @param MarketName 市場中文
   * @param EventId 比賽id
   * @param EventDate 比赛時間
   * @param SportId 體育ID
   * @param LeagueId 聯賽id
   * @param LeagueName 聯賽名
   * @param SourceId 比赛外部參考ID?
   * @param Season 賽日指標，用於虛擬體育
   * @param MatchDay 賽事指標，用於虛擬體育
   * @param EventGroupTypeId 比賽分組類型，用途不明
   * @param HomeTeamId 主場球隊id
   * @param HomeTeamName 主場球隊名
   * @param AwayTeamId 客場球隊id
   * @param AwayTeamName 客場球隊名
   * @param BetTypeId 投注類型ID
   * @param BetTypeName 投注類型名
   * @param PeriodId 比赛时段 ID  1全場 2上半 3下半
   * @param PeriodName 比赛时段中文
   * @param SelectionType 投注選項類型
   * @param SelectionName 投注選項類型名
   * @param IsOutRightEvent 是否為優勝冠軍賽事
   * @param OutRightEventName 優勝冠軍賽事名
   * @param OutrightTeamId 优胜冠军类型 ID. (只适用于优胜冠军，如果定时赛事会是0)
   * @param OutrightTeamName 优胜冠军名称 (只适用于优胜冠军赛事，如果定时赛事会 是0)
   * @param Odds 賠率
   * @param Handicap 讓球和大小盤數據
   * @param HomeTeamHTScore 主隊上半場得分, bti無
   * @param AwayTeamHTScore 客隊上半場得分, bti無
   * @param HomeTeamFTScore 主隊全場得分, bti無
   * @param AwayTeamFTScore 客隊全場得分, bti無
   * @param HomeTeamScoreWhenBet 投注時主隊得分, bti無
   * @param AwayTeamScoreWhenBet 投注時客隊得分, bti無
   * @param HomeTeamResult 主隊賽果 IM 由PeriodId 比赛时段決定, bti無
   * @param AwayTeamResult 客隊賽果 IM 由PeriodId 比赛时段決定, bti無
   * @param GameResult 賽果 字符串型態 IM 由PeriodId 比赛时段決定,  bti返回內容不定
   * @param GroundTypeId 主場狀態 0在中立場比賽 1在主場比賽
   * @param TargetTeamId 投注目標球隊id, 用於判斷展示格式
   * @param TargetTeamName 投注目標球隊名, 用於判斷展示格式
   * 額外提供 LineDesc 投注線描述，用於投注購物車展示
   * 額外提供 SelectionDesc 投注選項描述，用於投注購物車展示
   */
  constructor(
              WagerStatus,
              WagerStatusName,
              ConfirmStatus,
              ConfirmStatusName,
              CancelStatus,
              CancelStatusName,
              CancelReason,
              CancelReasonName,
              MarketId,
              MarketName,
              EventId,
              EventDate,
              SportId,
              LeagueId,
              LeagueName,
              SourceId,
              Season,
              MatchDay,
              EventGroupTypeId,
              HomeTeamId,
              HomeTeamName,
              AwayTeamId,
              AwayTeamName,
              BetTypeId,
              BetTypeName,
              PeriodId,
              PeriodName,
              SelectionType,
              SelectionName,
              IsOutRightEvent,
              OutRightEventName,
              OutrightTeamId,
              OutrightTeamName,
              Odds,
              Handicap,
              HomeTeamHTScore,
              AwayTeamHTScore,
              HomeTeamFTScore,
              AwayTeamFTScore,
              HomeTeamScoreWhenBet,
              AwayTeamScoreWhenBet,
              HomeTeamResult,
              AwayTeamResult,
              GameResult,
              GroundTypeId,
              TargetTeamId,
              TargetTeamName,
              )
  {
    Object.assign(this, {
      WagerStatus,
      WagerStatusName,
      ConfirmStatus,
      ConfirmStatusName,
      CancelStatus,
      CancelStatusName,
      CancelReason,
      CancelReasonName,
      MarketId,
      MarketName,
      EventId,
      EventDate,
      SportId,
      LeagueId,
      LeagueName,
      SourceId,
      Season,
      MatchDay,
      EventGroupTypeId,
      HomeTeamId,
      HomeTeamName,
      AwayTeamId,
      AwayTeamName,
      BetTypeId,
      BetTypeName,
      PeriodId,
      PeriodName,
      SelectionType,
      SelectionName,
      IsOutRightEvent,
      OutRightEventName,
      OutrightTeamId,
      OutrightTeamName,
      Odds,
      Handicap,
      HomeTeamHTScore,
      AwayTeamHTScore,
      HomeTeamFTScore,
      AwayTeamFTScore,
      HomeTeamScoreWhenBet,
      AwayTeamScoreWhenBet,
      HomeTeamResult,
      AwayTeamResult,
      GameResult,
      GroundTypeId,
      TargetTeamId,
      TargetTeamName,
    });

    //投注購物車展示 投注線
    this.LineDesc = this.MarketName + ' ' + (!this.IsOutRightEvent ? (' ' + this.PeriodName) : '') + ' ' + this.BetTypeName;

    //投注購物車展示 投注選項 默認 玩法名 + 目標數字
    let handicapTail = (this.Handicap !== null && this.Handicap !== undefined && !this.IsOutRightEvent) ? (' ' + this.Handicap) : '';
    let selectionDesc = this.SelectionName + handicapTail;
    if (this.TargetTeamName !== ''  //有目標隊伍數據
      && this.SelectionName.indexOf(this.TargetTeamName) === -1) {  //且玩法名沒有包含 目標隊伍
      selectionDesc = this.TargetTeamName + ' ' + this.SelectionName + handicapTail;
    }
    this.SelectionDesc = selectionDesc;
  }

  getEventDateMoment() {
    return moment(this.EventDate).utcOffset(VendorConfigs.TIMEZONE);
  }
}