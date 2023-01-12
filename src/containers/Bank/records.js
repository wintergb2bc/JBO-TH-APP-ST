import React from "react";
import {
  Platform,
  TouchableHighlight,
  FlatList,
  Animated,
  StyleSheet,
  WebView,
  ScrollView,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  BackHandler
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ToastNew from "react-native-root-toast";
import {
  DatePicker,
  Tabs,
  Checkbox,
  Radio,
  Carousel,
  WhiteSpace,
  WingBlank,
  Flex,
  Toast,
  InputItem,
  Picker,
  List,
  Modal
} from "antd-mobile-rn";
import PickerStyle from "antd-mobile-rn/lib/picker/style/index";
import Touch from "react-native-touch-once";
import styles from "./bankStyle";
import Depopage from "./depositPage";
import Head from "./Head";
import Orientation from "react-native-orientation-locker";

import ModalDropdown from "react-native-modal-dropdown";

import StickyHeader from "react-native-stickyheader";

import BonusHistory from "../Bonushistory";
import Bettingrecord from "../Bettingrecord";

import ListItems from "antd-mobile-rn/lib/list/style/index.native";

const newStyle = {};
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(ListItems[key]) };
    newStyle[key].opacity = 0;
    newStyle[key].color = "transparent";
    newStyle[key].backgroundColor = "transparent";
  }
}

const { width, height } = Dimensions.get("window");
const TypeName = ["bankStatusT", "depositT", "recordsT", "transferT", "withdrawalsT"];

let nowD = new Date();
let ny = nowD.getFullYear();
let nm = nowD.getMonth() + 1;
nm = nm < 10 ? "0" + nm : nm;
let nd = nowD.getDate();
nd = nd < 10 ? "0" + nd : nd;
let nowdates = ny + "-" + nm + "-" + nd;
let filterYears = ny;
let filterMonths = nm;

/**
 *获取当前日期前后N天的日期
 *
 * @export
 * @param {int 正负整数} AddDayCount   10,-10等
 * @returns
 */
export function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "-" + m + "-" + d;
}
//30天前
// let beforD = new Date(nowD.getTime() - 30 * 24 * 60 * 60 * 1000);
// let by = beforD.getFullYear();
// let bm = beforD.getMonth() + 1;
// bm = bm < 10 ? "0" + bm : bm;
// let bd = beforD.getDate();
// bd = bd < 10 ? "0" + bd : bd;
// let befordates = by + "-" + bm + "-" + bd;
const befordates = GetDateStr(0);
const beforedatePrefer = GetDateStr(0);

const TITLEX = {
	MAIN: "บัญชีหลัก", // 主账户
	CMD: "CMD กีฬา",
	SB: "IM อีสปอร์ต",
	IPSB: "IM กีฬา",
	LD: "คาสิโน",
	SLOT: "สล็อต",
	PT: "PT สล็อต",
  SLC: "หวย",
  KENO: "GPI ล็อตโต้",
	WITHDRAWING: "การถอนตัว",
	REBATE: "เงินคืน",
	ADJUSTMENT: 'การปรับ',
	CASH: 'เงินสด',
	BONUS: 'เงินปันผล',
	P2P: 'เกม 3 มิติ',
	PLAYER_BONUS: 'โบนัส',
	BONUS_ADJUSTMENT: 'การปรับโบนัส'
}

const BankText = {
  WCLB: "บัตรคะแนน", // TODO:CN-DONE 微转账
  WC: "โอนไมโคร", // TODO:CN-DONE 微支付
  UP: "UnionPay", // TODO:CN-DONE 银联支付
  QR: "จ่ายโดยQR", // TODO:CN-DONE 扫描支付
  LB: "บัญชีภายในประเทศ", // TODO:CN-DONE 支付宝转账
  IB: "ช่องทางพิเศษ", // TODO:CN-DONE 特殊处理
  CC: "บัตรเงินสด", // TODO:CN-DONE 地皇卡
  BTC: "บิทคอยน์", // TODO:CN-DONE 比特币
  BC: "Fast baht", // TODO:CN-DONE 在线存款
  AP: "AstroPay",
  APW: "AstroPay",
  SW: "แบบพิเศษ", // TODO:CN-DONE 高额快速提款
  EZP: 'EeziePay',
  PS: 'Paysec',
  EZW: 'EeziePay',
  MD: 'MD',
  THBQR: 'QR ฝากเงิน',
  AFT: 'การโอนพันธมิตร',
  TMW: 'ทรูมันนี่ วอลเล็ท',
  BQR:'QR ฝากเงินทศนิยม',
  RD:'ฝากเงินด่วน',
};

const CanDepositCancel = ['LB']
const CanReSubmit = ['EZP','BC','TMW', 'THBQR']


class Records extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Button1: "",
      Bank: "",
      NowBankType: props&&props.gotoWithdrwal?"Withdrawal":"deposit", // 用戶選擇充值銀行
      records: "", //交易紀錄data
      befosDate: befordates,
      mindatey: "",
      nowDate: nowdates,
      UserCheackBank: "",
      recordList: [
        { label: "ฝากเงิน" }, //充值
        { label: "ถอนเงิน" }, //提款
        { label: "โปรโมชั่น" }, //優惠
        { label: "ปรับโบนัส" }, //轉帳

      ],
      dateKey: 0,
      dateList: [
        { label: "วันนี้", day: 0 },
        { label: "30 วัน", day: -30 },
        { label: "60 วัน", day: -60 },
        { label: "90 วัน", day: -90 },
      ],
      recordActive: "ฝากเงิน",
      BonusList: "",
      filterYear: filterYears,
      filterMonth: filterMonths,
      OneName: "", //验证名字
      TwoPhone: "", //验证手机
      TreeAddress: "", //验证地址
      FourEmail: "", //验证邮箱
      GotoVerifie: false,
      userInfoData: "",
      phoneNumber: "",
      emailNumber: "",
      isShowLiveChatModal:false,
      liveChatUrl:null,
      isShowReSubmitModal:false,
      isShowCancleModal:false,
      confirmTransationId:'',
      toastSuccessFlag:false,
      toastMsg:'',
      toastErrorFlag:false,
      transationAmount:'',
    };
    this.Getrecords =this.Getrecords.bind(this);
    this.BankT = this.BankT.bind(this);
    this.nowDateChange = this.nowDateChange.bind(this);
    this.befosDateChange = this.befosDateChange.bind(this);
    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount(props) {
    Orientation.lockToPortrait(); //鎖定屏幕
    this.GetPaymentFirst("deposit");
    this.Getrecords();
    // this.backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   this.backAction
    // );
  }

  componentWillUnmount() {
    //離開註銷監聽
    Orientation.removeOrientationListener(this._onOrientationChange);
    if (TypeName.indexOf(this.props.name) != -1) {
      Orientation.unlockAllOrientations(); //解鎖橫豎屏  如果是在遊戲頁面開啟 重新解鎖
    }
    //this.backHandler.remove();
  }
  _onOrientationChange(curOrt) {
    Orientation.lockToPortrait();
  }

  // backAction = () => {
  //   let takeBqr = global.localStorage.getItem("BQR");
  //   if (takeBqr == true) {
  //     console.log('按了android物理返回鍵')
  //     Actions.deposit();
  //     setTimeout(() => {
  //       reloadPage("deposit");
  //     }, 100)
  //     return true;
  //   }
  // };

  getNows() {
    let nowD = new Date();
    let ny = nowD.getFullYear();
    let nm = nowD.getMonth() + 1;
    nm = nm < 10 ? "0" + nm : nm;
    let nd = nowD.getDate();
    nd = nd < 10 ? "0" + nd : nd;
    let nowdates = ny + "-" + nm + "-" + nd;
    return nowdates
  }
  //獲取數據
  GetPaymentFirst(key) {
    this.setState({ Bank: [] });
    fetchRequest(ApiPort.Payment + "?transactionType=" + key + "&", "GET")
      .then(data => {
        let noneD = ["MD", "WLMD", "PS"];
        let datdBox = [];
        datdBox.push({ value: "", label: "บัญชีทั้งหมด" });
        data.result.map(function(item, key) {
          if (noneD.indexOf(item.code) == -1) {
            datdBox.push({ value: item.code, label: item.name });
          }
        });
        this.setState({
          Bank: datdBox
        });
      })
      .catch(error => {});
  }

  _dropdown_2_renderButtonText(rowData) {
    return `${BankText[rowData.value]?BankText[rowData.value]:rowData.label}`;
  }

  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    console.log(rowData)
    return (
      <View style={{ backgroundColor: "#141414" }}>
        <Text style={{ color: "#fff", textAlign: "center", lineHeight: 35 }}>
          {`${BankText[rowData.value]?BankText[rowData.value]:rowData.label}`}
        </Text>
      </View>
    );
  }

  //存款 提款
  Getrecords(key) {
    const { UserCheackBank, nowDate, befosDate, NowBankType } = this.state;
    let getNows = this.getNows()
    var d1 = new Date(befosDate.replace(/\-/g, "/"));
    var d2 = new Date(nowDate.replace(/\-/g, "/"));

    if (d1 > d2) {
      Toast.fail("วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด！", 2);
      return;
    }

    if (d2 < d1) {
      Toast.fail("วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น！", 2);
      return;
    }
    key != "ยกเลิก" && Toast.loading("กำลังสอบถาม กรุณารอสักครู่...", 200);
    fetchRequest(
      ApiPort.PaymentApplications +
        "transactionType=" +
        NowBankType +
        "&paymentMethod=" +
        UserCheackBank +
        "&dateFrom=" +
        befosDate +
        "&dateTo=" +
        getNows +
        "&",
      "GET"
    )
      .then(data => {
        console.log('data',data)
        key != "ยกเลิก" && Toast.hide();

        if (data.errorMessage == "") {
          this.setState({
            records: data
          });
        }
        // else {
        //   Toast.fail(data.errorMessage, 2);
        // }
      })
      .catch(error => {
        Toast.hide();
      });
  }
  //查詢 转账 紀錄
  GetTransf() {
    const { nowDate, befosDate } = this.state;
    let getNows = this.getNows()
    var d1 = new Date(befosDate.replace(/\-/g, "/"));
    var d2 = new Date(nowDate.replace(/\-/g, "/"));

    if (d1 > d2) {
      Toast.fail("วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด！", 2);
      return;
    }

    if (d2 < d1) {
      Toast.fail("วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น！", 2);
      return;
    }

    Toast.loading("กำลังสอบถาม กรุณารอสักครู่...", 200);
    fetchRequest(
      ApiPort.TransferApplicationsByDate +
        "?fromWallet=" +
        "rebate,adjustment,referral,avatar" +
        "&toWallet=" +
        "" +
        "&dateFrom=" +
        befosDate +
        " 00:00:00.000&dateTo=" +
        getNows +
        " 23:59:59.000&",
      "GET"
    )
      .then(data => {
        Toast.hide();
        this.setState({
          records: data
        });
      })
      .catch(error => {
        Toast.hide();
      });
  }

  GetBonus() {
    const { filterYear, filterMonth } = this.state;
    Toast.loading("กำลังสอบถาม กรุณารอสักครู่...", 200);
    fetchRequest(
      ApiPort.BonusApplications +
        "?wallet=0" +
        "&bonusStatus=0&filterYear=" +
        filterYear +
        "&filterMonth=" +
        filterMonth +
        "&",
      "GET"
    )
      .then(data => {
        Toast.hide();
        if (data.length > 0) {
          this.setState({
            BonusList: data
          });
        } else {
          this.setState({ BonusList: [] });
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  //搜尋
  submitSearch = key => {

    const { NowBankType } = this.state;

    console.log(this.state)

    if (NowBankType == "Transfer") {
      // 转账
      this.GetTransf();
    } else {
      //  充值,提款
      this.Getrecords();
    }
  }

  BankT = key => {
    //交易平台
    // let item = this.state.recordList[key].label;
    this.setState({ UserCheackBank: this.state.Bank[key].value });
  };

  //选择记录
  onTabClick = key => {
    let msg;
    let item = this.state.recordList[key].label;
    this.setState({
      nowDate: nowdates,
      filterYear: filterYears,
      filterMonth: filterMonths,
      records: [],
      dateKey: 0
    });
    this._dropdown_4 && this._dropdown_4.select(-1);
    this.state.befosDate = item != "โปรโมชั่น" ? befordates:beforedatePrefer   //默認日期初始

    if (item == "ฝากเงิน") {
      UMonEvent('Transaction History', 'Click', 'Deposit_History');
      msg = "deposit";
    } else if (item == "ถอนเงิน") {
      UMonEvent('Withdrawal Nav', 'View', 'Withdrawal_History');
      msg = "Withdrawal";
    } else if (item == "ปรับโบนัส") {
      UMonEvent('Withdrawal', 'Click', 'Adjustment_History');
      this.setState({ NowBankType: "Transfer" });
      return;
    } else if (item == "โปรโมชั่น") {
      UMonEvent('Withdrawal', 'Submit', 'Rebate_History');
      this.setState({
        NowBankType: "preferential"
      });
      // this.GetBonus()
      return;
    }

    this.setState(
      {
        NowBankType: msg,
        nowDate: nowdates,
        UserCheackBank: ""
      },
      () => {
        this.GetPaymentFirst(msg);
      }
    );
  };

  //选择天数
  onDateClick = key => {
    const { NowBankType, dateList } = this.state;
    const day = dateList[key].day;
    const befosDate = GetDateStr(day);
    this.setState({ dateKey: parseInt(key) });

    if (NowBankType == "preferential") {
      // 优惠
      const data = null;
      // window.bonusDate && window.bonusDate(befordates);
    } else {
      this.setState({ befosDate }, () => {
        if (this.state.NowBankType == "Transfer") {
          // 转账
          // this.GetTransf();
        } else {
          //  充值,提款
          // this.Getrecords();
        }
      });
    }
  };

  NoCancellation(id, Amount) {
    const POSTDATA = {
      TransactionType: "Withdrawal",
      Remark: "test",
      Amount: Amount
    };
    // TODO:CN-DONE 处理中,请稍候
    Toast.loading("กรุณารอสักครู่ กำลังดำเนินการ...", 200);
    fetchRequest(
      ApiPort.POSTNoCancellation + id + "/Cancellation?",
      "POST",
      POSTDATA
    )
      .then(data => {
        Toast.hide();

        if (data.isSuccess == true) {
          Toast.success("ยกเลิกสำเร็จ！");
          ReloadMoneyHome();
          ReloadMoney(); //刷新餘額
          // TotalBalGlobe(); //刷新餘額
          this.Getrecords("ยกเลิก");
        } else {
          Toast.fail("ยกเลิกไม่สำเร็จ！");
        }
      })
      .catch(error => {
        Toast.hide();
      });
  }
  _dropdown_bank_renderButtonText(rowData) {
    return `${rowData.label}`;
  }

  _dropdown_bank_renderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ backgroundColor: "#141414" }}>
        <Text
          style={{
            color: "#fff",
            textAlign: "left",
            lineHeight: 35,
            paddingLeft: 15
          }}
        >
          {`${rowData.label}`}
        </Text>
      </View>
    );
  }
  
  statusldType(StatusId) {
    let statusld = "";
    let color='#CCCCCC';
    if (this.state.NowBankType == "deposit") {
      color="#00b324"
      //充值
      if (StatusId == 1 || StatusId == 4) {
        statusld = "กำลังดำเนินการ"; // TODO:CN-DONE 待处理
        color = "#00CAFF"
      } else if (StatusId == 5) {
        statusld = "หมดเวลา"; // TODO:CN-DONE 充值过期
        color = "#FF1717"
      } else if (StatusId == 2) {
        statusld = "สำเร็จ"; // TODO:CN-DONE 成功
        color = "#00E62E"
      } else if (StatusId == 6) {
        statusld  = "ล้มเหลว"; // TODO:CN-DONE 失败
        color='#FF1717'
      }
      if (StatusId == 3) {
        statusld = "ล้มเหลว"; // TODO:CN-DONE 拒绝存款
        color = "#FF1717"
       }
      return <Text style={{color:color}}>{statusld}</Text>
    }
    if (this.state.NowBankType == "Withdrawal") {
      //提款
      if (StatusId == 1) {
        statusld = "กำลังดำเนินการ"; // TODO:CN-DONE 待处理
        color='#F0A800'
      } else if (StatusId == 2) {
        statusld = "การประมวลผล"; // TODO:CN-DONE 处理中
        color='#21DB00'
      } else if (StatusId == 3) {
        statusld = "กำลังประมวลผลการเข้าใช้งาน"; // TODO:CN-DONE 网关处理中
        color='#21DB00'
      } else if (StatusId == 4) {
        statusld = "สำเร็จ"; // TODO:CN-DONE 成功
        color='#CCCCCC'
      } else if (StatusId == 5) {
        statusld = "ความล้มเหลว"; // TODO:CN-DONE 失败
        color='#FF1717'
      } else if (StatusId == 6) {
        statusld = "ยกเลิกแล้ว"; // TODO:CN-DONE 已取消
      } else if (StatusId == 7) {
        statusld = "การประมวลผล"; // TODO:CN-DONE 处理中
      } else if (StatusId == 8) {
        statusld = "การประมวลผล"; // TODO:CN-DONE 处理中
      } else if (StatusId == 9) {
        statusld = "การประมวลผล"; // TODO:CN-DONE 处理中
      } else if (StatusId == 10) {
        statusld  = "รายการถอนอนุมัติบางรายการ"; // TODO:CN-DONE 部分成功
      }
      return <Text style={{color:color}}>{statusld}</Text>
    }

    return statusld;
  }
  nowDateChange(data) {
    let dates = new Date(data);
    let y = dates.getFullYear();
    let m = dates.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = dates.getDate();
    d = d < 10 ? "0" + d : d;
    let nowDate = y + "-" + m + "-" + d;
    this.setState({ nowDate }, () => {
      if (this.state.NowBankType == "Transfer") {
        // this.GetTransf();
      } else {
        // this.Getrecords();
      }
    });
  }

  befosDateChange(data) {
    let dates = new Date(data);
    let y = dates.getFullYear();
    let m = dates.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d = dates.getDate();
    d = d < 10 ? "0" + d : d;
    let befosDate = y + "-" + m + "-" + d;
    if (this.state.NowBankType == "preferential") {
      this.setState(
        {
          filterYear: y,
          filterMonth: m
        },
        () => {
          window.bonusDate && window.bonusDate(data);
        }
      );
    } else {
      this.setState({ befosDate }, () => {
        if (this.state.NowBankType == "Transfer") {
          // this.GetTransf();
        } else {
          // this.Getrecords();
        }
      });
    }
  }

  //领取前先验证用户信息完整
  getUser(key) {
    fetchRequest(ApiPort.Member, "GET")
      .then(data => {
        /* 四步状态 */
        let memberInfo = data && data.result.memberInfo;
        if (!memberInfo) {
          return;
        }
        let OneName = true,
          TwoPhone = true,
          TreeAddress = true,
          FourEmail = true;

        if (memberInfo.FirstName) {
          OneName = false;
        }
        if (memberInfo.Address.Address) {
          TreeAddress = false;
        }
        if (memberInfo.Contacts) {
          memberInfo.Contacts.forEach(item => {
            if (item.ContactType == "Phone") {
              this.setState({ phoneNumber: item.Contact });
              if (item.Status != "Unverified") {
                TwoPhone = false;
              }
            } else if (item.ContactType == "Email") {
              this.setState({ emailNumber: item.Contact });
              FourEmail = false;
              // if(item.Status != 'Unverified') {FourEmail = false};
            }
          });
        }
        if (OneName || /*TwoPhone ||*/ TreeAddress || FourEmail) {
          this.setState({
            OneName,
            //TwoPhone,
            TreeAddress,
            FourEmail,
            userInfoData: memberInfo,
            GotoVerifie: true
          });
        } else {
          this.bonusClaim(key);
        }
      })
      .catch(error => {
        Toast.hide();
        //Toast.fail("", 2);
      });
  }
  bonusClaim(key) {
    // TODO:CN-DONE 领取中,请稍候
    Toast.loading("กรุณารอขณะรับ", 200);
    fetchRequest(ApiPort.Claim + "?", "POST", key)
      .then(data => {
        Toast.hide();
        Toast.success(data.message, 2);
        this.GetBonus();
      })
      .catch(error => {
        Toast.hide();
      });
  }
  GotoVerifie() {
    let ST = this.state;
    let UserVerifie = {
      OneName: ST.OneName,
      TwoPhone: ST.TwoPhone,
      TreeAddress: ST.TreeAddress,
      FourEmail: ST.FourEmail,
      phoneNumber: ST.phoneNumber,
      emailNumber: ST.emailNumber
    };
    this.setState({ GotoVerifie: false });
    Actions.UserVerifie({ memberInfo: ST.userInfoData, UserVerifie });
  }
  CTCtext(data){
    let text=''
    if(data.CryptocurrencyInfo=="INVOICE"){
        text='极速虚拟币支付'
    }else{
      text='虚拟币支付'
    }
    return '( '+text+' )'
  }

  //取消存款
  MemberRequestDepositReject(){
    UMonEvent('Transaction Record','Click','Cancel_DepositTransaction')
    const {confirmTransationId}=this.state
    Toast.loading("กรุณารอขณะรับ", 200);
    
    fetchRequest(ApiPort.MemberRequestDepositReject + "?TransactionId="+ confirmTransationId+'&', "POST")
    .then(data => {
      Toast.hide();
      console.log('取消存款 data',data)
      if(data.IsSuccess){
        this.setState(
          {
            isShowCancleModal:false,
            toastSuccessFlag:true,
            toastMsg:data.Message
          },
          () => {
            setTimeout(()=>{
             this.setState({toastSuccessFlag:false})
            }, 1000)
          }
        );
      }else{
        this.setState(
          {
            isShowCancleModal:false,
            toastErrorFlag:true,
            toastMsg:data.Message
          },
          () => {
            setTimeout(()=>{
             this.setState({toastErrorFlag:false})
            }, 1000)
          }
        );
      }
      this.Getrecords("ยกเลิก");//刷新list

    })
    .catch(error => {
      Toast.hide();
    });
  }

  //金額加千位分隔格點
	payMoneyFormat(value) {
		return value == ""
		  ? value
		  : parseInt(value) > 0 &&
			  value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
	}

  render() {
    const {
      nowDate,
      befosDate,
      records,
      Bank,
      recordList,
      dateKey,
      dateList,
      NowBankType,
      BonusList,
      filterYear,
      filterMonth,
      isShowCancleModal,
      toastSuccessFlag,
      toastMsg,
      toastErrorFlag,
      transationAmount,
      isShowReSubmitModal,
    } = this.state;

    console.log('records',records)

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.BackgroundImage
            ? "#000"
            : "#1a1a1a"
        }}
      >
        {(toastSuccessFlag || toastErrorFlag) && <View style={{top:height/3,left:toastMsg.length>20?width/7:width/4,position:'absolute',backgroundColor:'#fff',flexDirection:'row',paddingVertical:15,zIndex:9999,paddingRight:25,paddingLeft:23,borderRadius:6}}>
            {toastSuccessFlag? <Image
              resizeMode="contain"
              source={require("../../images/icon_success.png")}
              style={{ width: 16, height: 16,marginRight:10,alignSelf:'center' }}
            />:
            <Image
            resizeMode="contain"
            source={require("../../images/error_icon.png")}
            style={{ width: 16, height: 16,marginRight:10,alignSelf:'center' }}
          />}
            <Text
              style={{
                color: "#333333",
                fontSize: 14,
              }}
            >
              {toastMsg}
            </Text>
        </View>}

        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.GotoVerifie}
          onRequestClose={() => {}}
          style={{ backgroundColor: "#2a2a2a" }}
        >
          <View style={styles.modals}>
            <Text style={styles.modalstitle}>ยืนยันขอรับโปรโมชั่น</Text>
            <Text style={styles.modalsbody}>เรียนสมาชิก คุณไม่ได้ทำการยืนยันข้อมูลส่วนตัวที่สมบูรณ์</Text>
            <Text style={styles.modalsbody}>กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน ก่อนทำการรับโปรโมชั่น</Text>
            <TouchableOpacity onPressIn={() => { this.GotoVerifie() }}>
              <View style={styles.modalsfoot}>
                <View style={styles.footTextBg}>
                <Text style={styles.footText}>ยืนยันตอนนี้</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
            {/* <Text style={styles.modalstitle}>优惠验证</Text>
            <Text style={styles.modalsbody}>
              尊敬的会员，您未绑定完善个人资料
            </Text>
            <Text style={styles.modalsbody}>领取优惠前请您先完善资料</Text>
            <TouchableOpacity
              onPressIn={() => {
                this.GotoVerifie();
              }}
            >
              <View style={styles.modalsfoot}>
                <View style={styles.footTextBg}>
                  <Text style={styles.footText}>前往验证</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View> */}
        </Modal>

        {/*取消交易*/}  
        <Modal
          animationType="none"
          transparent={true}
          visible={isShowCancleModal}
          onRequestClose={() => {}}
          style={styles.noMoneyModal1}
        >
          <View>
            <View
              style={{
                backgroundColor: '#000000',
                alignSelf: 'center',
                borderColor: '#00B324',
                borderWidth: 1,
                padding: 20,
              }}
            >
               <View style={{alignSelf:'center'}}>
               <Image
                source={require('../../images/icon_warning.png')}
                resizeMode="stretch"
                style={{
                  width: 60,
                  height: 60,
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
                />
                <Text style={{color:'#F5F5F5',fontSize:13,lineHeight:22}}>
                คุณยืนยันที่จะยกเลิกรายการฝากเงิน  {transationAmount} บาท หรือไม่?</Text>
                <View style={{display:'flex',flexDirection:'row',alignSelf:'center',marginTop:25,marginBottom:10}}>
                  
                  <TouchableOpacity onPress={()=>this.setState({isShowCancleModal:false})}> 
                    <View style={{borderColor:'#00B324',borderWidth:1,width:100,padding:10,borderRadius:4,marginRight:10}}>
                      <Text style={{color:'#00B324',textAlign:'center'}}>ไม่ยกเลิก</Text>
                    </View>
                  </TouchableOpacity>
                 
                  <Touch onPress={()=>  this.MemberRequestDepositReject()}>
                     <View style={{backgroundColor:'#00B324',width:100,padding:10,borderRadius:4}}>
                        <Text style={{color:'#fff',textAlign:'center'}}>ยืนยัน</Text>
                     </View>
                  </Touch>
                </View>
                </View>
            </View>
          </View>
        </Modal>

        {/*重新提交*/}  
        <Modal
          animationType="none"
          transparent={true}
          visible={isShowReSubmitModal}
          onRequestClose={() => {}}
          style={styles.noMoneyModal1}
        >
          <View>
            <View
              style={{
                backgroundColor: '#000000',
                alignSelf: 'center',
                borderColor: '#00B324',
                borderWidth: 1,
                padding: 30,
              }}
            >
              <TouchableOpacity   onPress={() => {
                  this.setState({
                    isShowReSubmitModal: false,
                  })
                }}>
                <View>
                 <Text style={{ color: '#fff', fontSize: 20, textAlign: 'right' }}>
                  X
                 </Text>
                </View>
              </TouchableOpacity>
              <Image
                source={require('../../images/icon_warning.png')}
                resizeMode="stretch"
                style={{
                  width: 60,
                  height: 60,
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
                />
              <Text style={{fontSize:16,color:'#F5F5F5',fontWeight:'600',textAlign:'center',marginBottom:20}}>ในการส่งรายการแจ้งฝากอีกครั้ง {'\n'}กรุณาปฏิบัติตามขั้นตอนนี้</Text>
              <Text style={{fontSize:14,color:'#F5F5F5',marginBottom:20}}>1. คลิก “เข้าใจแล้ว ดำเนินการต่อ”</Text>
              <Text style={{fontSize:14,color:'#F5F5F5',marginBottom:20}}>2. ในขั้นตอนถัดไปคลิกปุ่ม “ดำเนินการต่อ”</Text>
              <Text style={{fontSize:14,color:'#F5F5F5',marginBottom:20,lineHeight:24}}>3. คุณไม่จำเป็นต้องโอนเงินอีกครั้งโปรดรอ จนกว่าหน้าธุรกรรมจะปรากฎขึ้น จากนั้นจึง กดปิดหน้าดังกล่าว</Text>
              <View style={{flexDirection:'row',alignSelf:'center'}}>
                  <TouchableOpacity 
                  onPress={()=>{
                    UMonEvent('CS','Click','CantactCS_TransactionRecord')
                    this.setState({isShowReSubmitModal:false})
                    Actions.LiveChatST();}} 
                  style={{width:(width-120)/2,borderColor:'#00B324',borderWidth:1,paddingVertical:13,borderRadius:8,justifyContent:'center'}}>
                    <Text style={{color:'#00B324',fontSize:16,textAlign:'center'}}>ติดต่อฝ่ายบริการ</Text>
                  </TouchableOpacity>
                  <View style={{width:10}}></View>
                  <Touch onPress={()=>{
                    UMonEvent('Deposit Nav','Click','Resubmit_TransactionRecord')
                    this.setState({isShowReSubmitModal:false})
                    Actions.recordsD({confirmTransationId:this.state.confirmTransationId,reload:this.Getrecords});
                    }} style={{width:(width-120)/2,backgroundColor:'#00B324',borderColor:'#00B324',borderWidth:1,paddingVertical:13,borderRadius:8}}>
                    <Text style={{color:'white',fontSize:16,textAlign:'center'}}>เข้าใจแล้ว {'\n'}ดำเนินการต่อ</Text>
                  </Touch>
              </View>
             

              
            </View>
          </View>
        </Modal>


        <ImageBackground
          style={{ width: width, height: height, flex: 1 }}
          resizeMode="repeat"
          source={
            this.props.BackgroundImage
              ? require("../../images/home/noimg.png")
              : require("../../images/home/pattern.png")
          }
        >

          {//平台选择
            NowBankType != "preferential" && NowBankType != "Transfer" && (
                <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                  <View style={styles.recordeTitle}>
                    {Bank != "" && (
                        <View style={styles.DsBorder2}>
                          <ModalDropdown
                              ref={el => (this._dropdown_3 = el)}
                              defaultValue="ประเภทธุรกรรม"
                              textStyle={styles.dropdown_2_text}
                              dropdownStyle={styles.DSdropdown_D_dropdown}
                              options={Bank}
                              renderButtonText={rowData =>
                                  this._dropdown_2_renderButtonText(rowData)
                              }
                              renderRow={this._dropdown_2_renderRow.bind(this)}
                              onSelect={this.BankT}
                              style={{ zIndex: 10, width: width - 30 }}
                          />
                          <View
                              style={{ position: "absolute", right: 10, paddingTop: 6 }}
                          >
                            <View style={styles.DSarrow} />
                          </View>
                        </View>
                    )}
                  </View>
                </View>
            )}
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <View style={styles.recordeTitle}>
              <View style={[ styles.recordeList, { marginRight: 10} ]}>
                <ModalDropdown
                  ref={el => (this._dropdown_3 = el)}
                  defaultValue={recordList[this.props&&this.props.gotoWithdrwal?1:0].label}
                  textStyle={{ paddingLeft: 15, color: "#fff", fontSize: 15 }}
                  dropdownStyle={{
                    width: width / 3.5,
                    borderWidth: 0,
                    top: 10,
                    height: 140,
                    backgroundColor: "#141414",
                  }}
                  options={recordList}
                  renderButtonText={rowData =>
                    this._dropdown_bank_renderButtonText(rowData)
                  }
                  renderRow={this._dropdown_bank_renderRow.bind(this)}
                  onSelect={this.onTabClick}
                  style={{ zIndex: 10, width: width / 3.5 }}
                />
                <View
                  style={{ position: "absolute", right: 10, paddingTop: 6 }}
                >
                  <View style={styles.DSarrow} />
                </View>
              </View>

              {NowBankType == "preferential" ? (
                //优惠选择时间
                <View style={[ styles.recordeDate, { marginRight: 10} ]}>
                  <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/calendar.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <View>
                      <Text style={{ color: "#fff", textAlign: "center" }}>
                        {filterYear + " - " + filterMonth}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        zIndex: 30,
                        width: width / 3.4
                      }}
                    >
                      <DatePicker
                        title=""
                        value={new Date(befosDate)}
                        mode="month"
                        minDate={new Date(2018, 1, 1)}
                        maxDate={new Date(new Date())}
                        onChange={this.befosDateChange}
                        format="YYYY-MM-DD"
                        locale={{
                          DatePickerLocale: {
                            year: "",
                            month: "",
                            day: "",
                            hour: "",
                            minute: ""
                          },
                          okText: "ตกลง",
                          dismissText: "ยกเลิก"
                        }}
                      >
                        <List.Item styles={StyleSheet.create(newStyle)}>
                          {/* <Text style={{fontSize:14,color:'#fff'}}>开始日</Text> */}
                        </List.Item>
                      </DatePicker>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={[ styles.dateList, { marginRight: 10} ]}>
                  {/* <Text style={{ color: "#fff", marginRight: 5 }}>
                    交易时间:
                  </Text> */}
                  <ModalDropdown
                    ref={el => (this._dropdown_4 = el)}
                    defaultValue={dateList[0].label}
                    value={dateList[dateKey].label}
                    textStyle={{ paddingLeft: 15, color: "#fff", fontSize: 15 }}
                    dropdownStyle={{
                      width: width / 3,
                      borderWidth: 0,
                      height: 100,
                      backgroundColor: "#141414",
                    }}
                    options={dateList}
                    renderButtonText={rowData =>
                      this._dropdown_bank_renderButtonText(rowData)
                    }
                    renderRow={this._dropdown_bank_renderRow.bind(this)}
                    onSelect={this.onDateClick}
                    style={styles.dateModalDrop}
                  />
                  <View
                    style={{
                      position: "absolute",
                      right: 10,
                      paddingTop: 6,
                      zIndex: 9999
                    }}
                  >
                    <View style={styles.DSarrow}></View>
                  </View>
                </View>
              )}

              <View style={styles.recordeBtn}>
                <Touch onPress={()=>this.submitSearch()}>
                  <Text style={{color: '#fff'}}>ค้นหา</Text>
                </Touch>
              </View>
            </View>
          </View>

          <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10 }}>
            <ScrollView
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {(NowBankType == "deposit" || NowBankType == "Withdrawal") && (
                //提款，充值列表
                <View style={{ paddingBottom: height / 3 }}>
                  {records != "" && records.historyList == "" && (
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#676767",
                          paddingTop: 50
                        }}
                      >
                        ยังไม่มีข้อมูล
                      </Text>
                    </View>
                  )}
                  {records != "" &&
                    records.historyList.map((item, index) => {
                      let msgA =
                        (item.SubmittedAt &&
                          item.SubmittedAt.split("T")
                            .join("  ")
                            .split(".")[0]) ||
                        "กำลังโหลด...";
                      let statusld = this.statusldType(item.StatusId);

                      //console.log('##### RECORDS #######',statusld,item,);

                      return (
                        <View key={item.TransactionId}
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: "#3d3d3d",
                            padding: 5,
                            paddingTop: 15,
                            paddingBottom: 15
                          }}
                        >
                          <View style={styles.recordHistoryList}>
                            
                            <View>
                              <Text style={{ color: "#ccccce" }}>
                                {item.TransactionId}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: "#ccccce",
                                  width: width / 2.5,
                                  textAlign: "right"
                                }}
                              >
                                {msgA}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.recordHistoryList}>
                            <View>
                              <Text style={{ color: "#ccccce" }}>
                                {/* {BankText[item.PaymentMethodId]}{item.PaymentMethodId=='CTC'&&'( '+item.MethodType+' )'} {item.Amount}{" "}
                                บาท */}
                                {BankText[item.PaymentMethodId]}{item.PaymentMethodId=='CTC'&&'( '+item.MethodType+' )'}                               
                              </Text>
                            </View>
                            <View>
                              <Text style={{ color: "#ccccce" }}>{this.payMoneyFormat(item.Amount)} ฿</Text>
                            </View>
                            <View>
                              {this.statusldType(item.StatusId)}
                            </View>
                          </View>
                          {
                            <View style={{flexDirection:'row',justifyContent: "flex-end" }}>
                              {/*LB'取消充值 */}
                              {NowBankType == "deposit" &&item.IsAbleRequestRejectDeposit&&CanDepositCancel.includes(item.PaymentMethodId)&&(
                                <View
                                  style={[
                                    styles.recordHistoryList,
                                    { justifyContent: "flex-end" }
                                  ]}
                                >
                                  <View
                                    style={{
                                      backgroundColor: "#00b324",
                                      borderRadius: 5
                                    }}
                                  >
                                    <Touch
                                        onPress={()=>this.setState({isShowCancleModal:true,confirmModType:'depositCancel',transationAmount:item.Amount,confirmTransationId: item.TransactionId})}
                                    >
                                      <Text
                                        style={{
                                          color: "#fff",
                                          padding: 3,
                                          paddingLeft: 8,
                                          paddingRight: 8,
                                          fontSize:12,
                                        }}
                                      >
                                        ยกเลิกการฝาก
                                      </Text>
                                    </Touch>
                                  </View>
                                </View>
                              )}
                              {/*重新提交 */
                              NowBankType == "deposit" && item.ResubmitFlag && CanReSubmit.includes(item.PaymentMethodId) &&
                                <View
                                style={[
                                  styles.recordHistoryList,
                                  { justifyContent: "flex-end" }
                                ]}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#00b324",
                                    borderRadius: 5
                                  }}
                                >
                                  <Touch
                                      onPress={()=>{this.setState({isShowReSubmitModal:true,transationAmount:item.Amount,confirmTransationId: item.TransactionId})}}
                                  >
                                    <Text
                                      style={{
                                        color: "#fff",
                                        padding: 3,
                                        paddingLeft: 8,
                                        paddingRight: 8,
                                        fontSize:12,
                                      }}
                                    >
                                      ส่งการฝากเงินอีกครั้ง
                                    </Text>
                                  </Touch>
                                </View>
                              </View>
                              }
                              {/*联系客服 */
                              NowBankType == "deposit" && (item.ReasonMsg.includes("กรุณาส่งรายการฝากอีกครั้ง") ||  item.ReasonMsg.includes("คำขอของคุณล้มเหลว") ||  item.ReasonMsg.includes("สถานะของธุรกรรมนี้จะอัปเดตภายใน 24 ชม. หากต้องการความช่วยเหลือโปรดติดต่อฝ่ายบริการลูกค้า")) &&
                              <View
                              style={[
                                styles.recordHistoryList,
                                { justifyContent: "flex-end" }
                              ]}
                            >
                              <View
                                style={{
                                  backgroundColor: item.ResubmitFlag?"transparent":(item.StatusId != '' && item.StatusId == 5)?"transparent":'#00B324',
                                  borderRadius: 5,
                                  borderColor:'#00B324',
                                  borderWidth:1,
                                }}
                              >
                                <Touch
                                    onPress={()=>{Actions.LiveChatST();}}
                                >
                                  <Text
                                    style={{
                                      color: item.ResubmitFlag?"#00B324":(item.StatusId != '' && item.StatusId == 5)?"#00B324":"#FFF",
                                      padding: 3,
                                      paddingLeft: 8,
                                      paddingRight: 8,
                                      fontSize:12,
                                    }}
                                  >
                                    ติดต่อฝ่ายบริการ
                                  </Text>
                                </Touch>
                              </View>
                            </View>
                            }
                            </View>
                          }
                          
                           {/*LB 取消充值備註欄 */}
                           {NowBankType == "deposit" &&CanDepositCancel.includes(item.PaymentMethodId)&&item.ReasonMsg!==''&&<View style={{backgroundColor:'#333333',padding:5,borderRadius:4,marginTop:5}}>
                             <Text style={{color:'#CCCCCC',fontSize:12}}>
                               {item.ReasonMsg}
                             </Text>
                           </View>}
                            {/*重新提交備註欄 */}
                            {NowBankType == "deposit" &&CanReSubmit.includes(item.PaymentMethodId)&&item.ReasonMsg!==''&&<View style={{backgroundColor:'#333333',padding:5,borderRadius:4,marginTop:5}}>
                             <Text style={{color:'#CCCCCC',fontSize:12}}>
                               {item.ReasonMsg}
                             </Text>
                           </View>}
                          
                       
                          {(item.PaymentMethodId=='CTC'||item.PaymentMethodId=='CCW')&&item.CryptoExchangeRate!=0&&<View style={styles.recordHistoryList}>
                          <View>
                              <Text style={{ color: "#CCCCCC" }}>
                              参考汇率
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color:'#CCCCCC'
                                }}
                              >
                               1 {item.ConvertedCurrencyCode} = {item.CryptoExchangeRate} RMB
                              </Text>
                            </View>
                          </View>}
                          {NowBankType == "Withdrawal" && item.StatusId == 1 && (
                            <View
                              style={[
                                styles.recordHistoryList,
                                { justifyContent: "flex-end" }
                              ]}
                            >
                              <View
                                style={{
                                  backgroundColor: "#00b324",
                                  borderRadius: 5
                                }}
                              >
                                <Touch
                                  onPress={() => {
                                    this.NoCancellation(
                                      item.TransactionId,
                                      item.Amount
                                    );
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: "#fff",
                                      padding: 3,
                                      paddingLeft: 8,
                                      paddingRight: 8
                                    }}
                                  >
                                    ยกเลิก
                                  </Text>
                                </Touch>
                              </View>
                            </View>
                          )}
                        </View>
                      );
                    })}
                </View>
              )}
              {/* 转账记录 */}
              {NowBankType == "Transfer" && (
                <View style={{ paddingBottom: height / 2.5 }}>
                  {records !== "" && records.length == 0 && (
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#676767",
                          paddingTop: 50
                        }}
                      >
                        ยังไม่มีข้อมูล
                      </Text>
                    </View>
                  )}
                  {records.length > 0 &&
                    records.map((item, index) => {
                      let msgA =
                        (item.transactionDate &&
                          item.transactionDate
                            .split("T")
                            .join("  ")
                            .split(".")[0]) ||
                        "กำลังโหลด...";
                      return (
                        <View
                          key={index}
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: "#3d3d3d",
                            padding: 5,
                            paddingTop: 15,
                            paddingBottom: 15
                          }}
                        >
                          <View style={styles.recordHistoryList}>
                            <View>
                              <Text
                                style={{
                                  color: "#ccccce",
                                  width: width / 2.5,
                                  textAlign: "left"
                                }}
                              >
                                T00{item.id}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: "#ccccce",
                                  width: width / 2.5,
                                  textAlign: "right"
                                }}
                              >
                                {msgA}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.recordHistoryList}>
                            <View>
                              {item.creditAccount != "BONUS" ? (
                                <Text
                                  selectable={true}
                                  style={{ color: "#ccccce", fontSize: 12 }}
                                >
                                  {item.creditAccount === "REFERRAL" ? "แนะนำเพื่อน":`${TITLEX[item.creditAccount]} - ${TITLEX[item.debitAccount]}`}
                                </Text>
                              ) : (
                                item.creditAccount == "BONUS" && (
                                  <Text
                                    selectable={true}
                                    style={{ color: "#ccccce", fontSize: 12 }}
                                  >
                                    โปรโมชั่น
                                  </Text>
                                )
                              )}
                              <Text style={{ color: "#ccccce" }}>
                                {item.amount}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: "#ccccce",
                                  width: width / 2.2,
                                  textAlign: "right"
                                }}
                              >
                                {item.remark}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                </View>
              )}
              {/* 优惠记录 */}
              {NowBankType == "preferential" && (
                <View style={{ paddingBottom: height / 2.5 }}>
                  <View style={{ flex: 1 }}>
                    <BonusHistory backColor={true} />
                  </View>
                  {/* {
							BonusList !== '' && BonusList.length == 0 &&
							<View><Text style={{textAlign: 'center',color:'#676767',paddingTop:50}}>暂无数据</Text></View>
						} */}
                  {/* {
							BonusList.length> 0 && BonusList.map((item,index) => {
								return(
									<View key={index} style={{borderBottomWidth:1, borderBottomColor:'#3d3d3d',padding:5,paddingTop:15,paddingBottom:15}}>
										<View style={styles.recordHistoryList}>
											<View><Text style={{color:'#ccccce',width:width/2.1,textAlign:'left'}}>{item.bonusTitle}</Text></View>
											<View><Text style={{color:'#ccccce',width:width/2.5,textAlign:'right'}}>{item.appliedDate}</Text></View>
										</View>
										<View style={styles.recordHistoryList}>
											<View>
												<Text style={{color:'#ccccce'}}>
													{item.bonusGiven} 元
												</Text>
											</View>
											{
											item.isClaimable == false &&
											<View>
												<Text style={{color:item.bonusStatus== '进行中'? '#00b324': '#ccccce'}}>{item.bonusStatus}</Text>
											</View>
											}
											{
											item.isClaimable == true &&
											<View style={{backgroundColor:'#00b324',borderRadius:5}}>
												<Touch onPress={() => {this.getUser(item.playerBonusId)}}>
													<Text style={{color:'#fff',padding:3,paddingLeft:8,paddingRight:8}}>领取</Text>
												</Touch>
											</View>
											}
										</View>
									</View>
								)
							})
						} */}
                </View>
              )}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default Records;
