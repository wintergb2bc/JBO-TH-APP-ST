//投注檢查 數據
import BetSettingData from "./BetSettingData";
import {Decimal} from "decimal.js";
import i18n from '../vendori18n';

export default class BetInfoData {
  /**
   * @param BetSettings 可能投注方式 BetSettingData  單注時只會有一個，串關返回數組(混合過關)
   * @param SystemParlayBetSettings 可能投注方式 BetSettingData  單注返回null，串關返回數組(系統混合過關)
   * @param Selections 投注選項 SelectionData  單注時只會有一個，串關返回數組
   */
  constructor(
              BetSettings = [],
              SystemParlayBetSettings = [],
              Selections = [],
              )
  {
    Object.assign(this, {
      BetSettings,
      SystemParlayBetSettings,
      Selections,
    });
  }

  //需要分 混合過關 和 系統混合過關
  // IM 只有 A串B ，需要自己找 N串1 多注、複製成system X/Y
  static createFromIMSource(betSettings,Selections) {
    if(betSettings && betSettings.length > 1 && Selections && Selections.length >= 3) {
      //只有 串1 系列的 才會留在 一般混合過關
      const normalParlayComboTypes = [
        9,// '2串1',
        10,// '3串1',
        11,// '4串1',
        12,// '5串1',
        13,// '6串1',
        14,// '7串1',
        15,// '8串1',
        16,// '9串1',
        17,// '10串1',
      ]

      //一般串關
      const normalParlaySettings = betSettings.filter(bs => {
        return normalParlayComboTypes.indexOf(bs.ComboType) !== -1
      })

      //系統混合過關
      const systemParlaySettings = betSettings.filter(bs => {
        return normalParlayComboTypes.indexOf(bs.ComboType) === -1 //不是串1
        || ((normalParlayComboTypes.indexOf(bs.ComboType) !== -1) && bs.ComboCount > 1)  //或者是串1但是 注數要大於1
      })

      //處理系統混合過關，要把串1系列改為 系统混合过关 X/Y
      let newSystemParlaySettings = [];
      systemParlaySettings.map(sp => {
        let cloneSetting = BetSettingData.clone(sp); //複製一個，和上面 一般串關 的實例(instance)分開
        if ((normalParlayComboTypes.indexOf(cloneSetting.ComboType) !== -1) && cloneSetting.ComboCount > 1)  //是串1但是 注數要大於1
        {
          const xNumber = cloneSetting.ComboType -7;  //combotype數字，減七就得到實際是 X 串1
          const yNUmber = Selections.length; // y 就是選擇的投注選項數量
          cloneSetting.ComboTypeName = i18n.IM.SYSTEM_PARLAY + ' ' + xNumber + '/' + yNUmber;
        }
        newSystemParlaySettings.push(cloneSetting);
      })
      return new BetInfoData(
        normalParlaySettings,
        newSystemParlaySettings,
        Selections,
      );
    }else {
      //im不處理 負數盤，因為官方自己支持了，也不需要特別展示

      return new BetInfoData(
        betSettings,
        [], //不支持系統混合過關，返回空數組
        Selections,
      );
    }
  }

  //需要分 混合過關 和 系統混合過關
  // BTI剛好跟IM相反 只給 system X/Y 要自己複製成 N串1
  // 也順便處理 負數盤問題
  static createFromBTISource(betSettings,Selections) {
    if(betSettings && betSettings.length > 1 && Selections && Selections.length >= 3) {
      //一般串關

      //單注的那個N串1
      const comboParlaySettings = betSettings.filter(bs => {
        return (bs.ComboType === 'Combo')
      });

      //系統過關
      let systemSingleParlaySettings = [];
      betSettings.map(bs => {
        if (bs.ComboType.lastIndexOf('System', 0) === 0) {
          const fromIndex = bs.ComboType.indexOf('from');
          const xNumber = bs.ComboType.substr(6,fromIndex-6);
          const yNumber = bs.ComboType.substr(fromIndex+4);
          //y剛好等於投注選項數  比如選4個  system2/4 就等於 2串1 x 多注
          if (parseInt(yNumber) === Selections.length) {
            let cloneSetting = BetSettingData.clone(bs); //複製，不要修改原本的實例(instance);
            cloneSetting.ComboTypeName = xNumber + i18n.BTI.PARLAY + '1';
            systemSingleParlaySettings.push(cloneSetting);
          }
        }
      })

      const normalParlaySettings = comboParlaySettings.concat(systemSingleParlaySettings);

      //系統混合過關，不是單注的都是
      const systemParlaySettings = betSettings.filter(bs => {
        return (bs.ComboType !== 'Single')
        && (bs.ComboType !== 'Combo')
        && bs.ComboCount > 1;
      })

      return new BetInfoData(
        normalParlaySettings,
        systemParlaySettings,
        Selections,
      );
    }else {
      //負數盤問題，只有單投需要處理
      if(betSettings && betSettings.length === 1)  {
        let targetBetSetting = betSettings[0];
        if (targetBetSetting) {
          const thisBet = targetBetSetting.ExtraInfo.bet;
          const thisOdds = new Decimal(thisBet.displayOdds);
          if (thisOdds.isNegative()) { //負數盤
            targetBetSetting.IsMinusOdds = true;
            targetBetSetting.RealBetAmountRate = thisOdds.abs().toNumber();  //賠率取絕對值 就是實際投注金額比例

            //bti需要額外調整EstimatedPayoutRate
            targetBetSetting.EstimatedPayoutRate = thisOdds.abs().add(1).toNumber(); //實際投注金額比例 + 預計贏一個本金
          }
        }
      }

      return new BetInfoData(
        betSettings,
        [], //不支持系統混合過關，返回空數組
        Selections,
      );
    }
  }
}