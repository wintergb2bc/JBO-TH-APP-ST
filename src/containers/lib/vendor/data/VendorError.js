//錯誤處理
import {VendorErrorMsg, VendorErrorType} from "./VendorConsts";

export default class VendorError {
  /**
   * @param ErrorType 錯誤類型
   * @param ErrorMsg 錯誤信息
   * @param ErrorInfo 額外提供的錯誤數據
   */
  constructor(
    ErrorType = VendorErrorType.Unknown_Error,
    ErrorMsg = null,
    ErrorInfo = null,
  )
  {
    if (ErrorMsg === null) { //獲取默認的錯誤信息
      ErrorMsg = VendorErrorMsg[ErrorType]
    }
    Object.assign(this, {ErrorType, ErrorMsg, ErrorInfo});
  }

  toString() {
    return '[' + this.ErrorType + ']' + this.ErrorMsg;
  }

  //原本用error.constructor.name === 'VendorError'
  //在export之後，這個判斷會失效，所以改成加屬性
  isVendorError = true;

  static fromIMError(statusCode, statusDesc='') {
    let errorType = VendorErrorType.Unknown_Error;
    switch(statusCode) {
      case 101: //无效时间戳
      case 102: //无效令牌
      case 103: //无效用户名
      case 202: //无效用户名 商户令牌验证 API 没返回任何 用户名
      case 210: //无效商户
        errorType = VendorErrorType.VENDOR_Auth_Error;
        break;
      case 107: //无效开始时间
      case 108: //无效结束时间
      case 305: //无效语言编码
      case 313: //无效体育 ID
        errorType = VendorErrorType.DATA_Error;
        break;
      case 330: //无效赛事类型 ID
      case 331: //无效比赛 ID
      case 332: //无效盘口
      case 333: //无效操作会话
      case 334: //无效赛事 ID
      case 380:  //无可选盘口
        errorType = VendorErrorType.BET_Event_Error;
        break;
      case 335: //无效投注类型
      case 336: //无效投注类型 ID
      case 337: //无效投注类型 ID
      case 338: //无效 Marketline ID
      case 339: //无效定位类型
      case 340: //无效连串过关选项
      case 341: //无效投注金额
      case 342: //无效投注类型选项 ID
      case 343: //无效优胜冠军队伍 ID
      case 344: //无效赔率类型
      case 345: //无效让球盘
      case 346: //无效赔率
      case 347: //无效主队得分
      case 348: //无效客队得分
      case 349: //无效投注状态
        errorType = VendorErrorType.BET_Info_Error;
        break;
      case 350: //检索投注信息错误(一个或以上的投注350 选项状态是 350 或 380)
        errorType = VendorErrorType.BET_Selection_Error;
        break;
      case 355: //Selection(串關)數量超過上限
        errorType = VendorErrorType.BET_Selection_Parlay_Limit;
        break;
      case 400: //系统错误
        errorType = VendorErrorType.VENDOR_Error;
        break;
      case 700: //维护
        errorType = VendorErrorType.VENDOR_Maintenance;
        break;
      case 710: //访问地区限制
      case 395: //在地区限制投注??
        errorType = VendorErrorType.VENDOR_Area_Limit;
        break;
      case 1000: //投注错误(没有成功投注)
      case 1135: //比赛日期验证失效
      case 1136: //赛季 ID 验证失效
      case 1141: //此项体育不存在
      case 1554: //無效注單
        errorType = VendorErrorType.BET_Place_Error;
        break;
      case 1001: //赔率更新中
        errorType = VendorErrorType.BET_Place_Updating;
        break;
      case 1103: //余额不足
        errorType = VendorErrorType.BET_Place_Balance;
        break;
      case 1105: //投注金額超過上限
        errorType = VendorErrorType.BET_Place_LimitMax;
        break;
      case 1106: //投注金額低於下限
        errorType = VendorErrorType.BET_Place_LimitMin;
        break;
      case 1107: //賠率已變更
        errorType = VendorErrorType.BET_Place_OddChanged;
        break;
      case 1108: //已達賽事總投注金額上限
        errorType = VendorErrorType.BET_Place_LimitTotal;
        break;
      case 1126: //賽事不支持串關
        errorType = VendorErrorType.BET_Place_NOPARLAY;
        break;
      case 1132: //投注金額無效
        errorType = VendorErrorType.BET_Place_MONEY;
        break;
      case 1556: //虚拟足球未启用
      case 1557: //虚拟篮球未启用
        errorType = VendorErrorType.BET_Virtual_Disabled;
        break;
    }

    return new VendorError(errorType,null, {statusCode,statusDesc});
  }

  static fromBTIError(statusCode, statusDesc='', errorJSON = {}) {
    let errorType = VendorErrorType.Unknown_Error;
    switch(statusCode) {
      case 401: //Unauthorized
        errorType = VendorErrorType.VENDOR_Auth_Error;
        break;
      case 'undefine1':
        errorType = VendorErrorType.DATA_Error;
        break;
      case 'ValidationError':
        errorType = VendorErrorType.BET_Event_Error;
        break;
      case 'OddsNotMatch':
      case 'PointsNotMatch':
      case 'InvalidComboBonus':
      case 'InvalidComboBonusPercentage':
      case 'BetSelectionMappingIsNotValid':
      case 'RepeatedSelections':
      case 'InvalidBetType':
      case 'IncorrectLinesforBetType':
      case 'IncorectBetType':
      case 'InvalidPotentialReturns':
      case 'SelectionNotFound':
      case 'ComboNotAllowed':
      case 'NotSupportedSelectionType':
        errorType = VendorErrorType.BET_Info_Error;
        break;
      case 'SelectionClosed':
      case 'SelectionSuspended':
        errorType = VendorErrorType.BET_Selection_Error;
        break;
      case 'MaxSelectionsExceeded': //Selection(串關)數量超過上限
        errorType = VendorErrorType.BET_Selection_Parlay_Limit;
        break;
      case 'ServiceNotAvailableException': //系统错误
        errorType = VendorErrorType.VENDOR_Error;
        break;
      case 700: //维护
        errorType = VendorErrorType.VENDOR_Maintenance;
        break;
      case 710: //访问地区限制
      case 395: //在地区限制投注??
        errorType = VendorErrorType.VENDOR_Area_Limit;
        break;
      case 'PurchaseNotAccepted':
        errorType = VendorErrorType.BET_Place_Error;
        break;
      case 'WaitLive': //赔率更新中
        errorType = VendorErrorType.BET_Place_Updating;
        break;
      case 'NotEnoughMoney': //余额不足
        errorType = VendorErrorType.BET_Place_Balance;
        break;
      case 1105: //投注金額超過上限
        errorType = VendorErrorType.BET_Place_LimitMax;
        break;
      case 1106: //投注金額低於下限
        errorType = VendorErrorType.BET_Place_LimitMin;
        break;
      case 1107: //賠率已變更
        errorType = VendorErrorType.BET_Place_OddChanged;
        break;
      case 1108: //已達賽事總投注金額上限
        errorType = VendorErrorType.BET_Place_LimitTotal;
        break;
      case 1126: //賽事不支持串關
        errorType = VendorErrorType.BET_Place_NOPARLAY;
        break;
      case 1132: //投注金額無效
        errorType = VendorErrorType.BET_Place_MONEY;
        break;
      case 1556: //虚拟足球未启用
      case 1557: //虚拟篮球未启用
        errorType = VendorErrorType.BET_Virtual_Disabled;
        break;
    }
    return new VendorError(errorType,null, {statusCode,statusDesc,errorJSON});
  }
}