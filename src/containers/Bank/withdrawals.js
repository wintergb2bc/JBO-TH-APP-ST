import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableHighlight,
  ScrollView
} from "react-native";
import Carousel from "react-native-banner-carousel";
// import { connect } from 'react-redux';
import { Actions } from "react-native-router-flux";
import {
  WhiteSpace,
  Flex,
  Toast,
  InputItem,
  Switch,
  Modal,
} from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import styles from "./bankStyle";
// import Carousel, { Pagination } from 'react-native-snap-carousel'
import Orientation from "react-native-orientation-locker";
import { NoBankComp } from "./BankCenter";
import ModalDropdown from "react-native-modal-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Popover, {PopoverMode, PopoverPlacement} from 'react-native-popover-view';


import CreatWallet from "./CreatWallet";
const { width, height } = Dimensions.get("window");
const dropdownWitdh = width - 20;
const dropdownHeight = height * 0.5;
const TypeName = ["depositT", "recordsT", "transferT", "withdrawalsT"];

import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      newStyle[key].color = "#fff";
      newStyle[key].textAlign = "left";
    }
    if (key === "container") {
      newStyle[key].paddingRight = 0;
    }
    newStyle[key].fontSize = 13;
    newStyle[key].borderBottomColor = "#1a1a1a";
  }
}
const copyLinkData = [
  {
    id:1,
    url: "https://www.hbgapp.com/",
    img: require("../../images/tutorial/asset1.png"),
    name:'火币'
  },
  {
    id:2,
    url: "https://c2c.binance.com/cn",
    img: require("../../images/tutorial/asset2.png"),
    name:'币安'
  },
  {
    id:3,
    url: "https://www.okex.com/buy-crypto/cny",
    img: require("../../images/tutorial/okex.png"),
    name:'OKEx'
  }
];
const copyLinkData1 = [
  {
    id:1,
    img: require("../../images/tutorial/58coin.png"),
    name:'58coin'
  },
  {
    id:2,
    img: require("../../images/tutorial/asset3.png"),
    name:'中币'
  },
  {
    id:3,
    img: require("../../images/tutorial/coincola.png"),
    name:'可盈可乐'
  }
];
const copyLinkData2 = [
  {
    id:1,
    img: require("../../images/tutorial/atoken.png"),
    name:'Atoken'
  },
  {
    id:2,
    img: require("../../images/tutorial/hyperpay.png"),
    name:'Hyperpay'
  },
  {
    id:3,
    img: require("../../images/tutorial/imtoken.png"),
    name:'Imtoken'
  },
  {
    id:4,
    img: require("../../images/tutorial/tokenpocket.png"),
    name:'Tokenpocket'
  }
];
const bankImage = {
  JDP: require("../../images/bank/kong.png"),
  APW: require("../../images/bank/icon_lib_astropay.png"),
  BC: require("../../images/bank/icon_lib_onlinepayment.png"),
  RPN: require("../../images/bank/icon_lib_cashcard.png"),
  SW: require("../../images/bank/icon_lib_cashcard.png"),
  LB: require("../../images/bank/local-pay.png"),
  LS: require("../../images/bank/icon_lib_bank.png"),
  OA: require("../../images/bank/icon_lib_alipay.png"),
  UP: require("../../images/bank/icon_lib_unionpay.png"),
  QQ: require("../../images/bank/icon_lib_qq.png"), //沒圖
  WC: require("../../images/bank/icon_lib_wechatpay.png"), //沒圖
  QR: require("../../images/bank/icon_lib_basketballcopy.png"), //沒圖
  Hover: require("../../images/bank/bankIcon1.png"), //選中圖
  CCW: require("../../images/bank/USDT.png")
};

const bankImageHover = {
  JDP: require("../../images/bank/kong.png"),
  APW: require("../../images/bank/icon_lib_astropay2.png"),
  BC: require("../../images/bank/icon_lib_onlinepayment2.png"),
  RPN: require("../../images/bank/icon_lib_cashcard2.png"),
  SW: require("../../images/bank/icon_lib_cashcard2.png"),
  LB: require("../../images/bank/icon_lib_bank2.png"),
  LS: require("../../images/bank/icon_lib_bank2.png"),
  OA: require("../../images/bank/icon_lib_alipay2.png"),
  UP: require("../../images/bank/icon_lib_unionpay2.png"),
  QQ: require("../../images/bank/icon_lib_qq2.png"), //沒圖
  WC: require("../../images/bank/icon_lib_wechatpay2.png"), //沒圖
  QR: require("../../images/bank/icon_lib_basketballcopy2.png"), //沒圖
  Hover: require("../../images/bank/bankIcon1.png") //選中圖
};
const crypyoCarousel1=[
  require('../../images/tutorial/CCW1.png'),
  require('../../images/tutorial/CCW2.png'),
  require('../../images/tutorial/CCW3.png'),
  require('../../images/tutorial/CCW4.png'),
  require('../../images/tutorial/CCW5.png'),
]
const crypyoCarousel2=[
  require('../../images/tutorial/CCW6.png'),
  require('../../images/tutorial/CCW7.png'),
  require('../../images/tutorial/CCW8.png'),
  require('../../images/tutorial/CCW9.png'),
  require('../../images/tutorial/CCW10.png'),
  require('../../images/tutorial/CCW11.png'),
  require('../../images/tutorial/CCW12.png')
]

class Withdrawals extends React.Component {
  constructor(props) {
    super(props);
    this.navigateToScene = this.navigateToScene.bind(this);
    this.BankClick = this.BankClick.bind(this);
    this.withdraw = this.withdraw.bind(this);

    this.state = {
      Button1: "",
      Bank: "",
      TotalBal: "",
      IPSB: "",
      MAIN: "",
      LD: "",
      SLOT: "",
      SB: "",
      toWallet: "",
      toWalletName: "",
      toWalletNameCode: "",
      payMoney: "",
      isDepositLock: false,
      isWithdrawalLock: false,
      bankBox: "", //銀行帳戶
      BankName: "กรุณาเลือกธนาคาร",
      BankData: "", //單一銀行規則
      NowBankType: "LB", // 用戶選擇充值銀行
      AppData: this.props,
      payOK: false,
      payHtml: "",
      toWalletA: "", //目標帳戶總數據
      depositingWallet: "", // 目標帳戶
      isPreferredWalletSet: false, // 是不是首選帳戶
      bonusCouponID: 0, //優惠id
      ID: 0, //優惠id
      Bonus: "", //優惠data
      part2Value: 1,
      BankAccountList: "",
      memberInfo: "",
      phoneNumber: null,
      emailNumber: "",
      noCard: false, //false:已绑定银行卡 true:未绑定银行卡
      ThisVisible: false,
      Uemail: "", //email
      toWalletKey: "",
      isPhone: true,
      minBal: 0,
      maxBal: 0,
      canWithdraw: false,
      OneName: "", //验证名字
      TwoPhone: "", //验证手机
      TreeAddress: "", //验证地址
      FourEmail: "", //验证邮箱
      GotoVerifie: false,
      userInfoData: "",
      WDSelectList: "", //提款方式
      payMoneySTMsg: "",
      isHaveMoneyFlag: false,
      ctcWalletList: [],
      currentCTCWalletKey: null,
      currentCTCWalletName: "",
      ctcExchangeRate: null,
      ctcSucceceModal: false,
      transactionId: "",
      currentCTCWalletAdd: "",
      isMenuShow: false,
      showCCWTutorailModal:false,
      currentCTCguid:0,
      ActiveSlide1:0,
      ActiveSlide2:0,
      verifyModal:false,
      optModal:false,
      BankAccountID: 0,


      accountHolderName: '',
      province: '',
      city: '',
      banch: '',
      accountNumber: '',
      BankDataT: '',
      toolTipVisible: true,
      buttonRect: {},
      isReachThreshold: false,
      submitIsReachThresholdModal: false,
      isSingleDeposit:true,
    };
    // this._dropdown_3 = null
    this.goNewBank = this.goNewBank.bind(this);
    this.onMoneyChange = this.onMoneyChange.bind(this);
    this.selectBank = this.selectBank.bind(this);
    this.selectCTCWallet = this.selectCTCWallet.bind(this);
    this.WDSelect = this.WDSelect.bind(this);
    this.GetCryptoWallet = this.GetCryptoWallet.bind(this);
    this.renderPage=this.renderPage.bind(this);
  }

  componentDidMount(props) {
    Orientation.lockToPortrait();
    storage
        .load({
          key: "Withdrawal",
          id: "Withdrawal"
        })
        .then(data => {
          //

          if (data.PreferWallet != "") {
            //console.log('提款緩存有')
            // this.state.account[0] = data.memberInfo.PreferWallet;
            this.setState({
              Bank: data
            });
            this.state.WDSelectList = data.result.map(function(item, key) {
              return { value: item.code, label: item.name };
            });
          }

          this.GetPaymentFirst(); //獲取銀行數據
          //this.login(name,ret);
        })
        .catch(() => {
          this.GetPaymentFirst();
          //console.log('沒有提款緩存')
          // 如果没有找到数据且没有sync方法，
          // 或者有其他异常，则在catch中返回
          //console.warn(err.message);
        });

    // this.getPhone(); //拿會員信息
    this.getUser(); //拿會員信息
    this.BankClick(this.state.NowBankType); //提款規則

  }

  componentWillUnmount() {
    //離開註銷監聽
    Orientation.removeOrientationListener(this._onOrientationChange);
    if (TypeName.indexOf(this.props.name) != -1) {
      Orientation.unlockAllOrientations(); //解鎖橫豎屏  如果是在遊戲頁面開啟 重新解鎖
    }
  }

  _onOrientationChange() {
    Orientation.lockToPortrait();
  }

  /**
   * 获取用户添加过的银行卡数据
   */
  BankAccountGet() {
    fetchRequest(`${ApiPort.MemberBanks}AccountType=Withdrawal&`, "GET")
        .then(res => {
          if (res.length == 0) {
            // 没有添加过银行卡
            this.setState({ noCard: true });
            return;
          }
          const banks = this.adjustBanks(res);
          console.log(res)
          console.log(banks)
          this.setState({
            bankBox: res,
            toWalletA: banks,
            toWalletName: banks.length != 0 ? banks[0].BankName : "",
            toWalletNameCode:
                banks.length != 0
                    ? banks[0].BankName + "-" + banks[0].AccountNumber
                    : "",
            toWalletKey: 0,
            BankName: banks[0].BankName,
            accountHolderName: banks[0].AccountHolderName,
            city: banks[0].City,
            province: banks[0].Province,
            branch: banks[0].Branch,
            accountNumber: banks[0].AccountNumber,
            noCard: false,
            isReachThreshold: banks[0].IsReachThreshold,
            BankAccountID: banks[0].BankAccountID
          });

          /////
        })
        .catch(error => {
          //Toast.hide();
          console.log("MemberBanks", error);
        });
  }
  /**
   * 调整银行卡列表，默认账户排第一
   * @param {array} banks 银行卡列表
   * @returns {array} result 调整过后的银行卡列表
   */
  adjustBanks(banks) {
    // 只有一张银行卡
    if (banks.length == 1) {
      return banks;
    }
    let result = banks;
    // 对数组每一项的isDefault进行比较 ：Ture > Flase
    result.sort((a, b) => {
      return b.IsDefault - a.IsDefault;
    });
    return result;
  }
  //獲取銀行數據
  GetPaymentFirst() {
    fetchRequest(ApiPort.Payment + "?transactionType=Withdrawal&", "GET")
        .then(data => {
          storage.save({
            key: "Withdrawal", // 注意:请不要在key中使用_下划线符号!
            id: "Withdrawal", // 注意:请不要在id中使用_下划线符号!
            data: data,
            expires: 1000 * 1200 * 24
          });

          this.setState({
            Bank: data
          });
          if (data.result.length > 0) {
            this.state.WDSelectList = data.result.map(function(item, key) {
              return { value: item.code, label: item.name };
            });
          }

          if (data.result.length == 0) {
            Toast.fail("บัญชีของคุณผิดปกติโปรดติดต่อฝ่ายบริการลูกค้า", 3);
            Actions.pop();

            reloadPage("deposit");
          }
        })
        .catch(() => {
          //Toast.hide();
        });
  }

  //跳轉
  navigateToScene(key) {
    Actions[key]({});
  }
  //拿優惠
  Bonus(key) {
    console.log(key);
    Toast.loading("", 200);
    fetchRequest(
        ApiPort.Bonus + "?transactionType=Deposit&wallet=" + key + "&",
        "GET"
    )
        .then(data => {
          Toast.hide();

          this.setState({
            Bonus: data,
            ID: 0
          });
        })
        .catch(() => {
          Toast.hide();
        });
  }

  //銀行規則
  BankClick(key) {
    if (this.state.NowBankType == key) {
      if (this.state.BankData != "") {
        return; //如果以選中禁止重複請求
      }
    }
    let method = key;

    this.setState({
      NowBankType: key
    });
    if (key == "LB") {
      UMonEvent('Withdrawal Nav','View','LocalBank_WithdrawalPage')
    } else if (key == "CCW") {
      UMonEvent("TTH_Crypto_withdrawal");
    }else if(key == "EZP") {
      UMonEvent('Withdrawal Nav','View','EeziePay_WithdrawalPage')
    }
    //isMobile   判斷是不是 手機版 ,不是要寫false
    fetchRequest(
        ApiPort.PaymentDetails +
        "?transactionType=Withdrawal&method=" +
        method +
        "&isMobile=true",
        "GET"
    )
        .then(data => {
          this.setState({
            BankData: data,
            minBal: data.setting.MinBal,
            maxBal: data.setting.MaxBal
          });

          if (key == "LB") {
            this.BankAccountGet();
            this.state.BankDataT = data.banks.map(function (item, key) {
              return { value: item.Name, label: item.Name }
            });
            this.setState({
              BankDataT: this.state.BankDataT
            })
          }
          if (key == "CCW") {
            this.GetCryptoWallet();
            this.CryptoExchangeRate();
          }
        })
        .catch(() => {
          //Toast.hide();
        });
  }
  BankData= (rowData, rowID, highlighted) => {
    this.setState({
      BankName: this.state.BankDataT[rowData].value,
      BankData: rowData,
    });
  };
  //獲取加密貨幣匯率
  CryptoExchangeRate() {
    fetchRequest(ApiPort.CryptoExchangeRate, "GET")
        .then(data => {
          if (data.IsSuccess) {
            this.setState({ ctcExchangeRate: data.ExchangeRate });
          }
        })
        .catch(() => {
          Toast.hide();
        });
  }
  //獲取加密貨幣錢包
  GetCryptoWallet() {
    fetchRequest(ApiPort.CryptoWallet + "?CryptoCurrencyCode=USDT&", "GET")
        .then(data => {
          data.forEach((row, index) => {
            if (row.IsDefault) {
              this.setState({
                currentCTCWalletKey: index.toString(),
                currentCTCWalletName: row.WalletName,
                currentCTCWalletAdd: row.WalletAddress
              });
            }
          });
          if (data.length == 1) {
            this.setState({
              currentCTCWalletKey: "0",
              currentCTCWalletName: data[0].WalletName,
              currentCTCWalletAdd: data[0].WalletAddress
            });
          }
          if (data.length > 0 && data.length < 3) {
            data.push({ isButton: true });
          }
          this.setState({ ctcWalletList: data });
        })
        .catch(() => {
          Toast.hide();
        });
  }
  getPhone() {
    // 先从缓存里看是否有该会员的手机号验证结果
    global.storage
        .load({
          key: userNameDB + "phoneVerify",
          id: userNameDB + "phoneVerify"
        })
        .then(ret => {
          // 手机号已经验证成功了
          if (ret == "success") {
            this.setState({
              isPhone: true
            });
          }
        })
        .catch(err => {
          fetchRequest(ApiPort.Member, "GET").then(data => {
            var filtered = data
                ? data.result.memberInfo.Contacts.filter(
                    item => item.ContactType == "Phone"
                )
                : "";

            this.setState({
              memberInfo: data.result.memberInfo,
              phoneNumber: filtered ? filtered[0].Contact : ""
            });
            return;
          });
        });
  }

  getUser() {
    Toast.loading("กำลังโหลด...", 200);
    fetchRequest(ApiPort.Member, "GET")
        .then(data => {
          Toast.hide();
          /* 四步状态 */
          let memberInfo = data && data.result.memberInfo;
          if(memberInfo.FirstName&&memberInfo.IsAddressExisted&&memberInfo.IsDOBExisted&&memberInfo.IsEmailExisted&&memberInfo.IsPhoneVerified){
            this.setState({optModal:false})
          }else{
            setTimeout(() => {
              this.setState({optModal:true})
            }, 50);
          }
          if (memberInfo) {
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
            if (memberInfo.Contacts[0]) {
              memberInfo.Contacts.forEach(item => {
                if (item.ContactType == "Phone") {
                  this.setState({ phoneNumber: item.Contact });
                  if (item.Status != "Unverified") {
                    TwoPhone = false;
                  }
                }
                if (item.ContactType == "Email") {
                  this.setState({ emailNumber: item.Contact });
                  FourEmail = false; //有邮箱可直接提款
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
            }

            if (memberInfo.IsDeposited == 0) {
              this.setState({
                isHaveMoneyFlag: true
              });
            }

            this.setState({
              isSingleDeposit:memberInfo?.IsSingleDeposit
            })
          }
        })
        .catch(error => {
          Toast.hide();
          Toast.fail("", 2);
          //   this.props.checkcallback('deposit')//返回充值页
        });
  }

  withdrawBtn = () => {
    if(this.state.isReachThreshold){
      this.setState({
        submitIsReachThresholdModal: true
      })
      return
    }

    this.withdraw();
  }
  
  //提款
  withdraw() {
    // this.getPhone();
    let st = this.state;
    let data;
    if (!st.payMoney) {
      Toast.fail("กรุณากรอกจำนวนเงินที่ต้องการถอน!");
      return;
    }

    console.log(st)

    if(st.noCard){
      data = {
        accountNumber: st.accountNumber,
        accountHolderName: st.accountHolderName,
        bankName: st.BankName,
        bankAccountId: st.BankAccountID,
        city: st.city,
        province: st.province,
        branch: st.branch,
        language: "th-th",
        swiftCode: "JBOMobileApps",
        paymentMethod: st.NowBankType,
        charges: 0,
        amount: st.payMoney,
        transactionType: "Withdrawal",
        domainName: "JBOnative://",
        isConvenience: true
      };
    }else{
      data = {
        accountNumber: st.bankBox[st.toWalletKey].AccountNumber,
        accountHolderName: st.bankBox[st.toWalletKey].AccountHolderName,
        bankName: st.bankBox[st.toWalletKey].BankName,
        city: st.bankBox[st.toWalletKey].City,
        province: st.bankBox[st.toWalletKey].Province,
        branch: st.bankBox[st.toWalletKey].Branch,
        bankAccountId: st.bankBox[st.toWalletKey].BankAccountID,
        language: "th-th",
        swiftCode: "JBOMobileApps",
        paymentMethod: st.NowBankType,
        charges: 0,
        amount: st.payMoney,
        transactionType: "Withdrawal",
        domainName: "JBOnative://",
        isConvenience: true
      };
    }
    UMonEvent('Withdrawal','Submit','SubmitWithdraw_WithdrawalPage')
    Toast.loading("กรุณารอสักครู่ กำลังถอนเงิน...", 200);
    fetchRequest(ApiPort.PaymentApplications, "POST", data)
        .then(data => {
          Toast.hide();
          if (data.isSuccess == true) {
            Toast.success("ทำรายการถอนเงินสำเร็จ", 2);
            ReloadMoneyHome(); //刷新餘額 首頁
            ReloadMoney();
            if (st.NowBankType == "CCW") {
              this.setState({
                ctcSucceceModal: true,
                transactionId: data.transactionId
              });
            }
            if(st.isReachThreshold){
              // Actions.recordsTx({ gotoWithdrwal: true });
            }
          } else {
            let msg = data.errorMessage;
            if (data.errorMessage == "WalletAmountNotSufficient") {
              msg = "ยอดเงินคงเหลือไม่เพียงพอ";
            }
            Toast.fail(msg, 2);
          }
        })
        .catch(() => {
          Toast.hide();
        });
  }

  /**
   * 提款金额
   */
  onMoneyChange(value) {
    if (!value) {
      this.setState({
        payMoney: value,
        canWithdraw: false
      });
    } else {
      this.setState({
        payMoney: value,
        canWithdraw: true
      });
    }
  }

  // 展开下拉框
  dropdownShow() {
    this._dropdown_3 && this._dropdown_3.show();
  }
  // 选择提款银行
  selectBank(key) {
    this.setState({
      toWalletName: this.state.bankBox[key].BankName,
      toWalletNameCode:
          this.state.bankBox[key].BankName +
          "-" +
          this.state.bankBox[key].AccountNumber,
      toWalletKey: key,
      BankName: this.state.bankBox[key].BankName,
      accountHolderName: this.state.bankBox[key].AccountHolderName,
      city: this.state.bankBox[key].City,
      province: this.state.bankBox[key].Province,
      branch: this.state.bankBox[key].Branch,
      accountNumber: this.state.bankBox[key].AccountNumber,
      isReachThreshold: this.state.bankBox[key].IsReachThreshold,
      BankAccountID: this.state.bankBox[key].BankAccountID
    });
  }
  selectCTCWallet(key) {
    if (
        this.state.ctcWalletList.length < 3 &&
        key == this.state.ctcWalletList.length - 1
    ) {
      this.setState({
        currentCTCWalletKey: null,
        currentCTCWalletName: "",
        currentCTCWalletAdd: ""
      });
    } else {
      this.setState({
        currentCTCWalletKey: key,
        currentCTCWalletName: this.state.ctcWalletList[key].WalletName,
        currentCTCWalletAdd: this.state.ctcWalletList[key].WalletAddress
      });
    }
    // if (key != this.state.ctcWalletList.length - 1) {
    //   this.setState({
    //     currentCTCWalletKey: key,
    //     currentCTCWalletName: this.state.ctcWalletList[key].WalletName,
    //     currentCTCWalletAdd: this.state.ctcWalletList[key].WalletAddress
    //   });
    // } else {
    //   this.setState({
    //     currentCTCWalletKey: null,
    //     currentCTCWalletName: "",
    //     currentCTCWalletAdd: ""
    //   });
    // }
  }
  _dropdown_bank_renderButtonText(rowData) {
    return `${rowData.label}`;
  }

  _dropdown_bank_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
        <TouchableHighlight underlayColor="cornflowerblue">
          <View
              style={[
                styles.dropdown_2_row,
                { backgroundColor: evenRow ? "#000000" : "#2c2c2c" }
              ]}
          >
            <Text style={[styles.dropdown_2_row_text]}>{`${rowData.label}`}</Text>
          </View>
        </TouchableHighlight>
    );
  }

  _dropdown_3_renderRow(rowData, rowID, highlighted) {
    //let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
    let evenRow = rowID % 2;
    return (
        <Flex style={{ width: 200, backgroundColor: "#fff" }}>
          <Flex.Item
              style={[
                styles.dropdown_2_row,
                {
                  width: 200,
                  paddingLeft: 14,
                  paddingTop: 3,
                  backgroundColor: evenRow ? "#000000" : "#2c2c2c"
                }
              ]}
          >
            <Text
                style={[
                  styles.dropdown_2_row_text,
                  highlighted && { color: "#fff" }
                ]}
            >
              {`${rowData.label}`}
            </Text>
          </Flex.Item>
        </Flex>
    );
  }

  _dropdown_userAccount_renderButtonText(rowData) {
    let bankItem = rowData.BankName + rowData.AccountNumber;
    // return `${rowData.BankName}`;
    return bankItem;
  }

  _dropdown_noCarduserAccount_renderButtonText(rowData) {
    let bankItem = rowData.label;
    // return `${rowData.BankName}`;
    return bankItem;
  }

  _dropdown_crypto_renderButtonText(rowData) {
    // return rowData.WalletName;
    if (rowData.isButton) {
      Actions.CreatWallet({
        GetCryptoWallet: () => {
          this.GetCryptoWallet();
        }
      });
      UMonEvent("Addwallet_TTH_Crypto_withdrawal");
      return " ";
    }
    return `${rowData.WalletName}`;
  }
  _dropdown_crypto_renderRow(rowData, rowID, highlighted) {
    if (rowData.isButton) {
      return (
          <View
              style={
                (styles.DsBorder,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 15,
                      backgroundColor: "#2c2c2c",
                      width: "100%",
                      paddingLeft: 12
                    })
              }
          >
            <Image
                resizeMode="stretch"
                source={require("../../images/bank/addBtn.png")}
                style={{ width: 30, height: 30, marginRight: 10 }}
            />
            <Text style={{ color: "#CCCCCC" }}>添加 USDT-ERC20 钱包地址</Text>
          </View>
      );
    }
    if (rowID == this.state.currentCTCWalletKey) {
      return (
          <Flex
              style={{
                width: "100%",
                backgroundColor: "#2c2c2c",
                paddingHorizontal: 10
              }}
          >
            <Flex.Item style={{ flex: 0.12 }}>
              <Image
                  resizeMode="contain"
                  source={require("../../images/bank/USDT.png")}
                  style={{ width: 30, height: 30 }}
              />
            </Flex.Item>
            <Flex.Item
                style={[
                  styles.dropdown_2_row,
                  {
                    width: "100%",
                    paddingLeft: 14,
                    paddingTop: 3,
                    backgroundColor: "#2c2c2c",
                    marginVertical: 10
                  }
                ]}
            >
              <Text style={{ color: "#00B324", fontSize: 15 }}>
                {rowData.WalletName}
              </Text>
              <Text numberOfLines={1} style={{ color: "#00B324", fontSize: 12 }}>
                {rowData.WalletAddress}
              </Text>
            </Flex.Item>
          </Flex>
      );
    }
    return (
        <Flex
            style={{
              width: "100%",
              backgroundColor: "#2c2c2c",
              paddingHorizontal: 10
            }}
        >
          <Flex.Item style={{ flex: 0.12 }}>
            <Image
                resizeMode="contain"
                source={require("../../images/bank/USDT.png")}
                style={{ width: 30, height: 30 }}
            />
          </Flex.Item>
          <Flex.Item
              style={[
                styles.dropdown_2_row,
                {
                  width: "100%",
                  paddingLeft: 14,
                  paddingTop: 3,
                  backgroundColor: "#2c2c2c",
                  marginVertical: 10
                }
              ]}
          >
            <Text style={{ color: "#F5F5F5", fontSize: 15 }}>
              {rowData.WalletName}
            </Text>
            <Text numberOfLines={1} style={{ color: "#CCCCCC", fontSize: 12 }}>
              {rowData.WalletAddress}
            </Text>
          </Flex.Item>
        </Flex>
    );
  }
  _dropdown_3_adjustFrame(style) {
    style.width = dropdownWitdh;
    // style.left -= 2;
    style.top += 10;
    style.height = 150;
    return style;
  }
  _dropdown_noCarduserAccount_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    let bankItem = rowData.label;
    return (
        <Flex style={{ backgroundColor: "#fff" }}>
          <Flex.Item
              style={[
                styles.dropdown_2_row,
                {
                  // width: dropdownWitdh,
                  paddingLeft: 14,
                  paddingTop: 3,
                  backgroundColor: evenRow ? "#000000" : "#2c2c2c"
                }
              ]}
          >
            <Text
                style={[
                  styles.dropdown_2_row_text,
                  highlighted && { color: "#fff" }
                ]}
            >
              {/* {`${rowData.BankName}`} */}
              {bankItem}
            </Text>
          </Flex.Item>
        </Flex>
    );
  }
  _dropdown_userAccount_renderRow(rowData, rowID, highlighted) {
    console.log(rowData)
    let evenRow = rowID % 2;
    let bankItem = rowData.BankName + "-" + rowData.AccountNumber;
    return (
        <Flex style={{ backgroundColor: "#fff" }}>
          <Flex.Item
              style={[
                styles.dropdown_2_row,
                {
                  // width: dropdownWitdh,
                  paddingLeft: 14,
                  paddingTop: 3,
                  backgroundColor: evenRow ? "#000000" : "#2c2c2c"
                }
              ]}
          >
            <Text
                style={[
                  styles.dropdown_2_row_text,
                  highlighted && { color: "#fff" }
                ]}
            >
              {/* {`${rowData.BankName}`} */}
              {bankItem}
            </Text>
          </Flex.Item>
        </Flex>
    );
  }

  /**
   * 跳转到添加银行卡页面
   */
  goNewBank() {
    UMonEvent('Withdrawal','Click','AddBank_WithdrawalPage')
    Actions.newBank({BankType: 'Withdrawal', BankTypeKey: "W"});
  }

  openDomain() {
    Linking.openURL("https://web.astropaycard.com/");
  }

  userName() {
    const { Uemail } = this.state;
    const EmailTEST = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    if (EmailTEST.test(Uemail) != true) {
      Toast.fail("กรุณากรอกอีเมลที่ถูกต้อง!");
      return;
    }

    const MemberData = {
      key: "email",
      value1: Uemail
    };

    Toast.loading("กำลังยืนยัน โปรดรอสักครู่...", 200);

    fetchRequest(ApiPort.Register, "PATCH", MemberData)
        .then(res => {
          Toast.hide();
          if (res.isSuccess == true) {
            Toast.success("อัปเดตสำเร็จ!");
            //this.Memberlist();
            this.setState({
              ThisVisible: false
            });
          } else if (res.isSuccess == false) {
            Toast.fail(res.result.Message);

            this.setState({
              ThisVisible: false
            });
          }
        })
        .catch(() => {});
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
    this.props.checkcallback("records");
    Actions.UserVerifie({ memberInfo: ST.userInfoData, UserVerifie });
  }
  WDSelect(key) {
    let code = this.state.WDSelectList[key].value;
    this.BankClick(code);
  }
  //金额格式验证
  payMoneyST() {
    //所以钱包金额验证
    const { maxBal, minBal, payMoney, NowBankType } = this.state;
    let MoneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (payMoney) {
      if (!MoneyReg.test(payMoney)) {
        this.setState({
          canWithdraw: false,
          payMoneySTMsg:
              NowBankType == "CCW"
                  ? `ขั้นต่ำการถอน ${minBal}, ทศนิยมสูงสุด 2 ตำแหน่ง`
                  : "รูปแบบของจำนวนเงินไม่ถูกต้องอนุญาตให้ใช้ทศนิยมได้ไม่เกิน 1 ถึง 2!\n"
        });
      } else if (Number(payMoney) < Number(minBal)) {
        this.setState({
          canWithdraw: false,
          payMoneySTMsg:
              NowBankType == "CCW"
                  ? `ขั้นต่ำการถอน ${minBal}, ทศนิยมสูงสุด 2 ตำแหน่ง`
                  : "จำนวนฝากขั้นต่ำเท่ากับ " + minBal
        });
      } else if (Number(payMoney) > Number(maxBal)) {
        this.setState({
          canWithdraw: false,
          payMoneySTMsg:
              NowBankType == "CCW"
                  ? `ถอนได้สูงสุด ${maxBal}, ทศนิยมสูงสุด 2 ตำแหน่ง`
                  : "จำนวนเงินสูงสุด" + maxBal
        });
      } else {
        this.setState({
          canWithdraw: true,
          payMoneySTMsg: ""
        });
      }
    } else {
      this.setState({
        canWithdraw: false,
        payMoneySTMsg: NowBankType != "CCW" && "กรุณาใส่จำนวนเงิน"
      });
    }
  }
  renderPage(v, i) {
    return (
        <View key={i} style={{
          width: width,
          height:1.391*width}}>
          <Image
              source={v}
              resizeMode="stretch"
              style={{
                width: 0.7*width,height:1.3*width
              }}
          />
        </View>
    );
  }
  
  //添加錢包
  onAddWallet(){
    this.setState({verifyModal:false})
    Actions.CreatWallet({
      GetCryptoWallet: () => {
        this.GetCryptoWallet();
      }
    });
    UMonEvent("Addwallet_TTH_Crypto_withdrawal");
  }
  //opt check
  CheckIsAbleSmsOTP() {
    Toast.loading("กำลังโหลด", 200);
    fetchRequest(ApiPort.CheckIsAbleSmsOTP, "GET").then(data => {
      Toast.hide();
      if (data.isAbleSmsOTP && data.attempts > 0) {
        this.setState({verifyModal:true})
        // this.sendOptVerify(this.state.phoneNumber);
      } else {
        Actions.CreatWallet({
          GetCryptoWallet: () => {
            this.GetCryptoWallet();
          },isUplimit:true
        });
        // this.setState({
        //   toastErrorFlag: true,
        //   toastMsg: "超过尝试次数"
        // });
        setTimeout(() => {
          this.setState({ toastErrorFlag: false });
        }, 1500);
      }
    });
  }
  OptGotoVerifie() {
    this.setState({optModal:false})
    UMonEvent('Verification','Click','Withdrawal_Verification')
    Actions.OptVerify({isWithdrawal:true});
    this.props.checkcallback("records");
    // setTimeout(() => {
    //   reloadPage("OptVerify");
    // }, 100);
  }
  closeReachThresholdModal = () => {
    this.setState({ submitIsReachThresholdModal: false });
  }

  /**
   * 银行账户名称和号码验证修改\u0E00-\u0E7F]/g,.replace(/[a-zA-Z \u0E00-\u0E7F]+$/,"")
   */
  filterName(value = ''){
    return value.replace(/[^a-zA-Z \u0E00-\u0E7F\ ]/g,'')
    //return value.replace(/[a-zA-Z \u0E00-\u0E7F]+$/,"")
  }

  filterNumber(value = ''){
    return value.trim().replace(/[^\d]/g,'')
  }

  render() {
    const {
      isPhone,
      phoneNumber,
      ThisVisible,
      toWalletA,
      toWalletName,
      toWalletNameCode,
      payMoney,
      Bank,
      NowBankType,
      noCard,
      minBal,
      maxBal,
      canWithdraw,
      GotoVerifie,
      WDSelectList,
      payMoneySTMsg,
      ctcWalletList,
      currentCTCWalletKey,
      currentCTCWalletName,
      ctcExchangeRate,
      ctcSucceceModal,
      transactionId,
      currentCTCWalletAdd,
      isMenuShow,
      showCCWTutorailModal,
      currentCTCguid,
      ActiveSlide1,
      ActiveSlide2,
      verifyModal,
      optModal,
      isHaveMoneyFlag,
      BankDataT
    } = this.state;

    window.CallBackWith = () => {
      this.props.checkcallback("withdrawals");
    };

    window.reloadBanks = () => {
      this.BankAccountGet();
    };
    return (
        <View style={{ flex: 1 }} onStartShouldSetResponder={evt => {
          console.log('hi')
          this.setState({toolTipVisible: false})
        }}>

          <Modal
              animationType='none'
              transparent={true}
              visible={this.state.submitIsReachThresholdModal}
              onRequestClose={() => { }}
              style={styles.noMoneyModal1}
          >
            <View >
              <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} 
                      onPress={()=> this.closeReachThresholdModal()}>X
                </Text>
                <Image
                    source={require("../../images/icon_warning.png")}
                    resizeMode="stretch"
                    style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                />
                <View>
                  <Text style={{color:'#fff',textAlign:'center',marginBottom:5}}>คุณทำรายการใกล้ถึงลิมิตแล้ว</Text>

                  <TouchableOpacity onPress={()=> {
                    this.closeReachThresholdModal();
                    Actions.bankCenter({ BankType: 'W' });
                  }}>
                    <Text style={{color:'#00E62E',textAlign:'center', textDecorationLine: 'underline'}}>ตรวจสอบได้ที่นี่</Text>
                  </TouchableOpacity>
                  
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:32}}>
                    
                    <TouchableOpacity style={{flex:1, marginRight: 10, borderColor: '#00B324', backgroundColor:'#000000', borderWidth: 1, color:'#00B324', width:100,padding:10,borderRadius:4,alignSelf:'center'}}
                                      onPress={()=> this.closeReachThresholdModal()}
                    >
                        <Text style={{color:'#fff',textAlign:'center'}}>เปลี่ยนธนาคาร</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={{flex:1, marginLeftL:10,borderColor: '#00B324',backgroundColor:'#00B324', borderWidth: 1,width:100,padding:10,borderRadius:4,alignSelf:'center'}}
                                      onPress={() => {
                                        this.closeReachThresholdModal();
                                        this.withdraw();}}
                    >
                        <Text style={{color:'#fff',textAlign:'center'}}>ดำเนินการต่อ</Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </View>
            </View>
          </Modal>
          
          <Modal
              animationType="none"
              transparent={true}
              visible={this.state.isHaveMoneyFlag}
              style={styles.noMoneyModal1}
          >
            <View style={[styles.noMoneyModal, styles.noMoneyModalContainer]}>
              <Text style={styles.noMoneyText1}>การแจ้งเตือน</Text>
              <Text style={styles.noMoneyText2}>
                คุณยังไม่ได้ทำการฝากเงิน กรุณาฝากเงินและเล่นก่อนทำรายการถอน
              </Text>
              <TouchableOpacity
                  style={styles.noMoneryTextWrap}
                  onPress={() => {
                    this.setState(
                        {
                          isHaveMoneyFlag: false
                        },
                        () => {
                          UMonEvent('Deposit Nav','Click','NonDepositor_WithdrawalPage')
                          Actions.jump("deposit");
                          setTimeout(() => {
                            reloadPage("deposit");
                          }, 100);
                        }
                    );
                  }}
              >
                <Text style={styles.noMoneyText3}>ฝากเงินตอนนี้</Text>
              </TouchableOpacity>
            </View>

            {/* 線上客服彈窗 */}
            <Modal
			    animationType='none'
			    transparent={true}
			    visible={ApiPort.UserLogin && this.props.isShowLiveChatModal}
          style={{backgroundColor:'transparent',width}}
			    >
			  	<View style={[stylesModal.liveChatModal]}>
					 <View style={stylesModal.liveChatModalContainer}>
						<TouchableOpacity style={stylesModal.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
							this.props.closeLiveChatModal()
						}}>
							<Text style={stylesModal.closeBtnText}>X</Text>
						</TouchableOpacity>
						<View style={stylesModal.modalBottomContainer}>
							<Image source={require('../../images/liveChat_img.png')}  resizeMode='stretch' style={stylesModal.liveChatIconImg}></Image>
							<Text style={stylesModal.liveChatTextInfor}>{'หากต้องการความช่วยเหลือ ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง'}</Text>
							<TouchableOpacity style={stylesModal.liveChatBottomBtn} onPress={() => {
								UMonEvent("CS", "Click", `CS_Invitation_WithdrawalPage`);
								Linking.openURL(this.props.liveChatUrl);
								this.props.closeLiveChatModal()
							}}>
								<Text style={stylesModal.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			      </Modal>
          </Modal>


          {/* 驗證提醒彈窗 */}
          <Modal
              animationType='none'
              transparent={true}
              visible={optModal&&!isHaveMoneyFlag}
              // TODO
              //    visible={true}
              onRequestClose={() => { }}
              style={styles.noMoneyModal1}
          >
            <View >
              <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} onPress={()=>{
                  this.setState({optModal:false})
                  this.props.checkcallback("records");
                  Actions.home();
                }}>X</Text>
                <Image
                    source={require("../../images/icon_warning.png")}
                    resizeMode="stretch"
                    style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                />
                <View>
                  <Text style={{color:'#fff',textAlign:'center',lineHeight:30}}>เพื่อความปลอดภัยในบัญชีของคุณ โปรดยืนยันข้อมูลให้ครบถ้วนก่อนการถอน</Text>
                  <TouchableOpacity onPress={()=> this.OptGotoVerifie()}>
                    <View style={{backgroundColor:'#00B324',width:100,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ยืนยัน</Text></View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>


            {/* 線上客服彈窗 */}
            <Modal
              animationType='none'
              transparent={true}
              visible={ApiPort.UserLogin && this.props.isShowLiveChatModal}
              style={{backgroundColor:'transparent',width}}
              >
              <View style={[stylesModal.liveChatModal]}>
                <View style={stylesModal.liveChatModalContainer}>
                  <TouchableOpacity style={stylesModal.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
                    console.log('this.props',this.props)
                    this.props.closeLiveChatModal()
                  }}>
                    <Text style={stylesModal.closeBtnText}>X</Text>
                  </TouchableOpacity>
                  <View style={stylesModal.modalBottomContainer}>
                    <Image source={require('../../images/liveChat_img.png')}  resizeMode='stretch' style={stylesModal.liveChatIconImg}></Image>
                    <Text style={stylesModal.liveChatTextInfor}>{'หากต้องการความช่วยเหลือ ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง'}</Text>
                    <TouchableOpacity style={stylesModal.liveChatBottomBtn} onPress={() => {
                      UMonEvent("CS", "Click", `CS_Invitation_WithdrawalPage`);
                      Linking.openURL(this.props.liveChatUrl);
                      this.props.closeLiveChatModal()
                    }}>
                      <Text style={stylesModal.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

          </Modal>


              {/* 線上客服彈窗 */}
              <Modal
                  animationType='none'
                  transparent={true}
                  visible={ApiPort.UserLogin && this.props.isShowLiveChatModal}
                  style={{backgroundColor:'transparent',width}}
                  >
                  <View style={[stylesModal.liveChatModal]}>
                  <View style={stylesModal.liveChatModalContainer}>
                    <TouchableOpacity style={stylesModal.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
                      console.log('this.props',this.props)
                      this.props.closeLiveChatModal()
                    }}>
                      <Text style={stylesModal.closeBtnText}>X</Text>
                    </TouchableOpacity>
                    <View style={stylesModal.modalBottomContainer}>
                      <Image source={require('../../images/liveChat_img.png')}  resizeMode='stretch' style={stylesModal.liveChatIconImg}></Image>
                      <Text style={stylesModal.liveChatTextInfor}>{'หากต้องการความช่วยเหลือ ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง'}</Text>
                      <TouchableOpacity style={stylesModal.liveChatBottomBtn} onPress={() => {
                        UMonEvent("CS", "Click", `CS_Invitation_WithdrawalPage`);
                        Linking.openURL(this.props.liveChatUrl);
                        this.props.closeLiveChatModal()
                      }}>
                        <Text style={stylesModal.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

          {/* <Modal
				animationType='none'
				transparent={true}
				visible={optVerify}
				onRequestClose={() => { }}
			>
				<View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
					<View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
            <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} onPress={()=>this.setState({verifyModal:false})}>X</Text>
          <Image
        source={require("../../images/icon_warning.png")}
        resizeMode="stretch"
        style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
          />
            <View>
            <Text style={{color:'#fff',textAlign:'center',lineHeight:30}}>为了您的账户安全，请在充值前先完成资料验证</Text>
            <TouchableOpacity onPress={()=> this.GotoVerifie()}>
              <View style={{backgroundColor:'#00B324',width:100,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ยืนยัน</Text></View>
            </TouchableOpacity>
					</View>
          </View>
				</View>
			</Modal> */}
          {/* <Modal
          animationType="none"
          transparent={true}
          visible={GotoVerifie}
          onRequestClose={() => {}}
          style={{ backgroundColor: "#2a2a2a" }}
        >
          <View style={styles.modals}>
            <Text style={styles.modalstitle}>提款验证</Text>
            <Text style={styles.modalsbody}>
              尊敬的会员，您未绑定完善个人资料
            </Text>
            <Text style={styles.modalsbody}>提款前请您先完善资料</Text>
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
          </View>
        </Modal> */}
          {/* 驗證提醒彈窗 */}
          <Modal
              animationType='none'
              transparent={true}
              visible={verifyModal}
              onRequestClose={() => { }}
              style={styles.noMoneyModal1}
          >
            <View >
              <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} onPress={()=>this.setState({verifyModal:false})}>X</Text>

                <Image
                    source={require("../../images/icon_warning.png")}
                    resizeMode="stretch"
                    style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                />
                <View>
                  <Text style={{color:'#fff',textAlign:'center',lineHeight:30}}>เพื่อความปลอดภัยของบัญชีของคุณโปรดทำการยืนยันทางโทรศัพท์ให้เสร็จสิ้นก่อนที่จะเพิ่มบัญชีธนาคาร</Text>
                  <TouchableOpacity onPress={()=> this.onAddWallet()}>
                    <View style={{backgroundColor:'#00B324',width:100,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ยืนยัน</Text></View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <Modal
              animationType={this.state.animationType}
              transparent={this.state.transparent}
              visible={ThisVisible}
              onRequestClose={() => {}}
              onShow={this.startShow}
          >
            <View
                style={{
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}
            >
              <View
                  style={{
                    marginLeft: 50,
                    marginRight: 50,
                    alignItems: "center",
                    backgroundColor: "white",
                    borderRadius: 5
                  }}
              >
                <Text
                    style={{
                      paddingTop: 15,
                      paddingBottom: 10,
                      fontSize: 16,
                      color: "#535353"
                    }}
                >
                  การแจ้งเตือน
                </Text>
                <Text style={{ fontSize: 14, color: "#535353" }}>
                  ไม่ได้กรอกอีเมลกรุณากรอกข้อมูลก่อน
                </Text>

                <InputItem
                    styles={StyleSheet.create(newStyle)}
                    clear
                    type="text"
                    value={ThisVisible}
                    labelNumber={5}
                    onChange={(value: any) => {
                      this.setState({
                        Uemail: value
                      });
                    }}
                    placeholder="กรุณากรอกอีเมล"
                />

                <Flex style={styles.PayButtonB}>
                  <Flex.Item style={{ flex: 0.2 }} />
                  <Flex.Item alignItems="center">
                    <Touch
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        style={styles.buttonPay}
                        onPress={() => this.userName()}
                    >
                      <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center"
                          }}
                      >
                        ยืนยัน
                      </Text>
                    </Touch>
                  </Flex.Item>
                  <Flex.Item style={{ flex: 0.2 }} />
                </Flex>
              </View>
            </View>
          </Modal>
          {/* ctc提款成功彈窗 */}
          <Modal visible={ctcSucceceModal}>
            <View
                style={{
                  backgroundColor: "#000000",
                  height: "100%",
                  paddingVertical: 20,
                  paddingHorizontal: 20
                }}
            >
              {/* header */}
              <Flex style={{ paddingVertical: 20, width: "100%" }}>
                <Flex.Item style={{ flex: 0.5 }}>
                  <TouchableOpacity
                      onPress={() => {
                        this.setState({ ctcSucceceModal: false });
                      }}
                  >
                    <Image
                        resizeMode="stretch"
                        source={require("../../images/icon-back.png")}
                        style={{ width: 28, height: 28 }}
                    />
                  </TouchableOpacity>
                </Flex.Item>
                <Flex.Item style={{ alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 18 }}>
                    加密货币充值
                  </Text>
                </Flex.Item>
                <Flex.Item style={{ flex: 0.5, alignItems: "flex-end" }}>
                  <TouchableOpacity
                      onPress={() => {
                        Actions.LiveChatST();
                      }}
                  >
                    <Image
                        resizeMode="stretch"
                        source={require("../../images/home/icon-csb.png")}
                        style={{ width: 28, height: 28 }}
                    />
                  </TouchableOpacity>
                </Flex.Item>
              </Flex>
              <View style={{ paddingVertical: 20 }}>
                <Image
                    resizeMode="stretch"
                    source={require("../../images/bank/time.png")}
                    style={{ width: 80, height: 80, alignSelf: "center" }}
                />
                <Text
                    style={{
                      color: "#F5F5F5",
                      fontSize: 18,
                      marginVertical: 20,
                      alignSelf: "center"
                    }}
                >
                  提交成功，等待系统处理
                </Text>
                <Text
                    style={{
                      color: "#00CAFF",
                      alignSelf: "center",
                      paddingVertical: 15
                    }}
                >
                  交易编码：{transactionId}
                </Text>
                <Text style={{ color: "#CCCCCC", alignSelf: "center" }}>
                  请注意， 交易将以实时汇率进行
                </Text>
              </View>
              <View style={{ padding: 15 }}>
                <View style={{ backgroundColor: "#00b324", borderRadius: 5 }}>
                  <TouchableOpacity
                      onPress={() => {
                        this.setState({ ctcSucceceModal: false });
                        Actions.recordsTx({ gotoWithdrwal: true });
                      }}
                  >
                    <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          lineHeight: 40
                        }}
                    >
                      查看交易记录
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* CCW提現教程 */}
          <Modal
              transparent={false}
              visible={showCCWTutorailModal}
              animationType="none"
          >
            <View
                style={{
                  backgroundColor: "#000000",
                  height: "100%",
                  paddingVertical: 25,
                  paddingHorizontal: 20
                }}
            >
              {/* header */}
              <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    alignItems: "center",
                    marginBottom: 20,
                    paddingVertical: 20
                  }}
              >
                <Text style={{ color: "#fff", fontSize: 18, paddingLeft: "40%" }}>
                  提现教程
                </Text>
                <TouchableOpacity
                    style={{ position: "absolute", right: 0 }}
                    onPress={() => {
                      this.setState({ showCCWTutorailModal: false });
                    }}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>X</Text>
                </TouchableOpacity>
              </View>
              {/* tab buttom */}
              <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center",
                    marginBottom: 10
                  }}
              >
                {currentCTCguid == 0 ? (
                    <Image
                        resizeMode="stretch"
                        source={require("../../images/tutorial/CCW_btn1_selected.png")}
                        style={{
                          width: (width - 80) * 0.5,
                          height: (width - 80) * 0.138,
                          marginRight: 8
                        }}
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            currentCTCguid: 0,
                            ActiveSlide1: 0
                          });
                        }}
                    >
                      <Image
                          resizeMode="stretch"
                          source={require("../../images/tutorial/CCW_btn1_default.png")}
                          style={{
                            width: (width - 80) * 0.5,
                            height: (width - 80) * 0.138,
                            marginRight: 8
                          }}
                      />
                    </TouchableOpacity>
                )}
                {currentCTCguid == 0 ? (
                    <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            currentCTCguid: 1,
                            ActiveSlide2: 0
                          });
                        }}
                    >
                      <Image
                          resizeMode="stretch"
                          source={require("../../images/tutorial/CCW_btn2_default.png")}
                          style={{
                            width: (width - 80) * 0.5,
                            height: (width - 80) * 0.138
                          }}
                      />
                    </TouchableOpacity>
                ) : (
                    <Image
                        resizeMode="stretch"
                        source={require("../../images/tutorial/CCW_btn2_selected.png")}
                        style={{
                          width: (width - 80) * 0.5,
                          height: (width - 80) * 0.138
                        }}
                    />
                )}
              </View>
              <ScrollView style={{alignSelf:'center',flex:1}}>
                <Carousel
                    key={currentCTCguid}
                    autoplay={false}
                    ref={c => {
                      if(currentCTCguid==0){
                        this._carousel1 = c;
                      }else{
                        this._carousel2 = c;
                      }
                    }}
                    // autoplayTimeout={5000}
                    loop
                    pageSize={280}
                    removeClippedSubviews={false}
                    pageIndicatorStyle={{
                      backgroundColor: "rgba(0, 149, 76, .3)"
                    }}
                    activePageIndicatorStyle={{
                      backgroundColor: "#10906D"
                    }}
                >
                  {currentCTCguid==0&&crypyoCarousel1.map((v, i) => this.renderPage(v, i))}
                  {currentCTCguid==1&&crypyoCarousel2.map((v, i) => this.renderPage(v, i))}
                  <View style={{height:1.391*width}}>
                    <ScrollView>
                      <Text style={{marginTop:10,marginBottom:45,lineHeight:20,color:'#fff'}}>
                        您可以于以下几个交易平台购买虚拟货币
                      </Text>
                      <Flex>
                        {copyLinkData.map((v,i)=>{
                          return  <Flex.Item >
                            <TouchableOpacity onPress={()=> Linking.openURL(v.url)}>
                              <Image
                                  resizeMode="stretch"
                                  source={v.img}
                                  style={{ width: 60, height: 60,alignSelf:'center'}}
                              />
                            </TouchableOpacity>
                            <Text style={{color:'#fff',textAlign:'center',marginTop:5}}>{v.name}</Text>
                          </Flex.Item>
                        })}
                      </Flex>
                      <Flex style={{alignSelf:'center',marginVertical:10}}>
                        {copyLinkData1.map((v,i)=>{
                          return <Flex.Item>
                            <Image
                                resizeMode="stretch"
                                source={v.img}
                                style={{ width: 75, height: 25,alignSelf:'center'}}
                            />
                            <Text style={{color:'#fff',textAlign:'center',marginTop:5}}>{v.name}</Text>
                          </Flex.Item>
                        })}
                      </Flex>
                      <Flex>

                        <Flex.Item>
                          <Image
                              resizeMode="stretch"
                              source={require("../../images/tutorial/mx.png")}
                              style={{ width: 60, height: 60,alignSelf:'center'}}
                          />
                          <Text style={{color:'#fff',textAlign:'center',marginTop:5}}>抹茶</Text>
                        </Flex.Item>
                        <Flex.Item>
                          <Image
                              resizeMode="stretch"
                              source={require("../../images/tutorial/asset4.png")}
                              style={{ width: 60, height: 60,alignSelf:'center'}}
                          />
                          <Text style={{color:'#fff',textAlign:'center',marginTop:5}}>币赢</Text>
                        </Flex.Item>
                      </Flex>
                      <Text style={{color:'#fff',textAlign:'center',paddingVertical:20}}>
                        以下多链钱包可用于储存虚拟币和进行转账</Text>
                      <View style={{width:width-140,display:'flex',flexDirection:'row' ,flexWrap:'wrap',alignSelf:'center',justifyContent:'space-between'}}>
                        {copyLinkData2.map((v,i)=>{
                          return <View style={{marginVertical:10}}>
                            <View style={{width: (width-100)/2.5, height: ((width-100)/2.5)*0.32,marginBottom:10 }}>
                              <Image
                                  resizeMode="stretch"
                                  source={v.img}
                                  style={{ width: (width-100)/2.5, height: ((width-100)/2.5)*0.32 ,alignSelf:'center'}}
                              />
                              <Text style={{color:'#fff',textAlign:'center',marginTop:5}}>{v.name}</Text>
                            </View>
                          </View>
                        })}
                      </View>
                    </ScrollView>
                  </View>

                </Carousel>
              </ScrollView>
            </View>
          </Modal>

          <KeyboardAwareScrollView
              style={{backgroundColor: "#000"}}
              contentContainerStyle={{ flexGrow: 1 }}
              resetScrollToCoords={{ x: 0, y: 0 }}
              onKeyboardWillShow={() => {
                this.setState({
                  keyboardOpen: true
                });
              }}
              onKeyboardWillHide={() => {
                this.setState({
                  keyboardOpen: false
                });
              }}
          >
            <WhiteSpace size="sm" />
            {/* 提款方式 */}
            {/* <View style={{padding:15}}>
			  <View style={{display:'flex',justifyContent: 'space-between',alignItems:'center',flexDirection:'row'}}>
				<View><Text style={{color: '#fff'}}>提款方式</Text></View>
				{
					WDSelectList == "" &&
					<View><Text style={{color: '#fff'}}>数据加载中...</Text></View>
				}
				{
					WDSelectList != '' && WDSelectList.length == 1 &&
					<View><Text style={{color: '#00b324'}}>{WDSelectList[0].label}</Text></View>
				}
				{
					WDSelectList != '' && WDSelectList.length > 1 &&
					<View style={{display: 'flex',justifyContent: 'center',alignItems: 'center',flexDirection: 'row'}}>
						<ModalDropdown ref={el => this._dropdown_3 = el}
							defaultValue={WDSelectList[0].label}
							textStyle={styles.WDdropdown_D_text}
							dropdownStyle={styles.WDdropdown_D_dropdown}
							options={WDSelectList}
							renderButtonText={(rowData) => this._dropdown_bank_renderButtonText(rowData)}
							renderRow={this._dropdown_bank_renderRow.bind(this)}
							onSelect={this.WDSelect}
							style={{zIndex:10,width:width/2.2}}
						/>
						<View style={{position: 'absolute',right: 10,paddingTop:6}}>
							<View style={styles.DSarrow}></View>
						</View>
					</View>
				}

			  </View>
      </View> */}
            <View style={styles.bankBox2NewWithdrawal}>
              {WDSelectList == "" ? (
                  <View style={{ width: width, height: 50 }}>
                    <Text style={{ textAlign: "center", color: "#fff" }}>
                      กำลังโหลด..
                    </Text>
                  </View>
              ) : (
                  WDSelectList != "" &&
                  WDSelectList.map((item, i) => {
                    return (
                        <TouchableOpacity
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => this.BankClick(item.value, item.label)}
                            key={item.value}
                            style={{ marginRight: 5 }}
                        >
                          <View
                              style={
                                item.value == NowBankType
                                    ? styles.bankImgHoverX1New
                                    : styles.bankImgX1New
                              }
                          >
                            <Image
                                resizeMode="contain"
                                source={bankImage[item.value]}
                                style={{ width: 20, height: 20 }}
                            />
                            <Text
                                style={{
                                  color: item.value == NowBankType ? "#00e62c" : "#fff",
                                  fontSize: 12,
                                  marginLeft: 3
                                }}
                            >
                              {item.label === "jbo_withdrawal_lb"?"ภายในประเทศ":item.label}
                            </Text>
                            {item.value === "CCW" && (
                                <View
                                    style={{ position: "absolute", top: -5, right: -5 }}
                                >
                                  <Image
                                      resizeMode="stretch"
                                      source={require("../../images/bank/label_new.png")}
                                      style={{ width: 18, height: 18 }}
                                  />
                                </View>
                            )}
                          </View>
                        </TouchableOpacity>
                    );
                  })
              )}
            </View>

            <WhiteSpace size="sm" />
            {/* 提款金额 */}
            {/* 加密貨幣 */}
            {NowBankType == "CCW" && (
                <View style={{ paddingHorizontal: 10 }}>
                  <View
                      style={{
                        backgroundColor: "#FFFCCA",
                        paddingVertical: 10,
                        borderRadius: 4,
                        marginBottom: 20,
                        paddingLeft: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "flex-start",
                        width: "100%",
                        marginRight: 30
                      }}
                  >
                    <Image
                        resizeMode="stretch"
                        source={require("../../images/icon_warning.png")}
                        style={{ width: 15, height: 15, marginRight: 5 }}
                    />
                    <Text
                        style={{ fontSize: 12, lineHeight: 15, paddingRight: 25 }}
                    >
                      หากทำการถอนเงินครั้งแรก โปรดกรอกข้อมูลส่วนตัวของคุณให้ครบเพื่อให้แน่ใจว่าการถอนจะสำเร็จอนุมัติ
                    </Text>
                  </View>
                  <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#fff" }}>
                        <Text style={{ color: "red" }}>*</Text>จำนวนเงินการถอน

                      </Text>
                      {/* <Text style={{color: '#00b324'}}>{payMoney && payMoney + '元'}</Text> */}
                    </View>
                    <Flex
                        style={{
                          borderWidth: 1,
                          borderColor: "#3d3d3d",
                          borderRadius: 5,
                          height: 40,
                          marginBottom: 3
                        }}
                    >
                      <View style={{ position: "absolute", left: 10 }}>
                        <Text style={{ color: "#fff", alignSelf: "flex-end" }}>
                          ¥
                        </Text>
                      </View>
                      <Flex.Item
                          style={{ alignItems: "flex-start", paddingLeft: 10 }}
                      >
                        <InputItem
                            styles={StyleSheet.create(newStyle)}
                            placeholderTextColor="#969696"
                            value={this.state.payMoney}
                            onChange={(value: any) => {
                              this.setState(
                                  {
                                    payMoney: value
                                  },
                                  () => {
                                    this.payMoneyST();
                                  }
                              );
                            }}
                            placeholder={`提款最低${minBal}，最高${maxBal}，最多输入两位小数`}
                        />
                      </Flex.Item>
                    </Flex>
                    {payMoneySTMsg != "" && (
                        <Text style={{ color: "#ff0000", fontSize: 12 }}>
                          {payMoneySTMsg}
                        </Text>
                    )}
                  </View>
                  <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#fff" }}>虚拟币等值数量</Text>
                    </View>
                    <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#3d3d3d",
                          borderRadius: 5,
                          height: 40,
                          justifyContent: "center",
                          paddingLeft: 10,
                          backgroundColor: "#333333",
                          marginBottom: 5
                        }}
                    >
                      <View styles={StyleSheet.create(newStyle)}>
                        <Text
                            style={{
                              fontSize: 12,
                              color: "#fff",
                              width: "100%",
                              lineHeight: 20
                            }}
                        >
                          {`${
                              ctcExchangeRate != "" && payMoney != ""
                                  ? " USDT-ERC20 " +
                                  (ctcExchangeRate * payMoney).toFixed(4)
                                  : ""
                          }
                        `}{" "}
                        </Text>
                      </View>
                    </View>
                    <Text style={{ color: "#CCCCCC" }}>
                      1 RMB = {ctcExchangeRate} USDT-ERC20
                    </Text>
                    <Text
                        style={{ color: "#999999", fontSize: 12, lineHeight: 20 }}
                    >
                      此汇率仅供参考，交易将以实时汇率进行
                    </Text>
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#fff" }}>
                        <Text style={{ color: "red" }}>*</Text>{" "}
                        {ctcWalletList.length > 0 ? "钱包名称" : "钱包地址"}
                      </Text>
                    </View>
                    {ctcWalletList.length > 0 ? (
                        <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#3d3d3d",
                              borderRadius: 5,
                              height: 50,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                              // marginBottom: 3
                            }}
                        >
                          {currentCTCWalletKey && currentCTCWalletKey != "" && (
                              <Image
                                  resizeMode="stretch"
                                  source={require("../../images/bank/USDT.png")}
                                  style={{
                                    position: "absolute",
                                    left: 10,
                                    paddingTop: 6,
                                    width: 24,
                                    height: 24,
                                    paddingRight: 10
                                  }}
                              />
                          )}

                          <ModalDropdown
                              ref={el => (this._dropdown_crypto = el)}
                              defaultValue={currentCTCWalletName}
                              onDropdownWillShow={() =>
                                  this.setState({ isMenuShow: true })
                              }
                              onDropdownWillHide={() =>
                                  this.setState({ isMenuShow: false })
                              }
                              textStyle={
                                // (styles.DSdropdown_D_text,
                                {
                                  paddingLeft: 55,
                                  paddingTop: 0,
                                  color: "#fff",
                                  fontSize: 14,
                                  lineHeight: 15,
                                  paddingBottom: 3
                                }
                              }
                              dropdownStyle={{
                                width: width - 30,
                                flex: 1,
                                marginRight: 0,
                                borderRadius: 1,
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.6,
                                shadowRadius: 5,
                                shadowColor: "#666",
                                backgroundColor: "#000000",
                                //注意：这一句是可以让安卓拥有灰色阴影
                                elevation: 4
                              }}
                              // adjustFrame={style => this._dropdown_3_adjustFrame(style)}
                              options={ctcWalletList}
                              renderButtonText={rowData =>
                                  this._dropdown_crypto_renderButtonText(rowData)
                              }
                              renderRow={this._dropdown_crypto_renderRow.bind(this)}
                              onSelect={this.selectCTCWallet}
                              style={{ zIndex: 10, width: width - 30 }}
                          />
                          <View
                              style={{ position: "absolute", right: 10, paddingTop: 0 }}
                          >
                            <View
                                style={{
                                  marginTop: isMenuShow ? 0 : 15,
                                  width: 0,
                                  height: 0,
                                  zIndex: 9,
                                  borderStyle: "solid",
                                  borderWidth: 7,
                                  borderTopColor: isMenuShow ? "transparent" : "#fff", //下箭头颜色
                                  borderLeftColor: "transparent", //右箭头颜色
                                  borderBottomColor: isMenuShow
                                      ? "#fff"
                                      : "transparent", //上箭头颜色
                                  borderRightColor: "transparent" //左箭头颜色
                                }}
                            ></View>
                          </View>
                          <View style={{ zIndex: 9 }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                  color: "#fff",
                                  fontSize: 10,
                                  paddingLeft: 15,
                                  width: width * 0.7,
                                  lineHeight: 11
                                }}
                            >
                              {currentCTCWalletAdd}
                            </Text>
                          </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={{ backgroundColor: "#333333", padding: 10 }}
                            onPress={() => {
                              this.CheckIsAbleSmsOTP();
                              // this.setState({verifyModal:true})
                            }}
                        >
                          <View
                              style={
                                (styles.DsBorder,
                                    {
                                      flexDirection: "row",
                                      alignSelf: "center",
                                      alignItems: "center"
                                    })
                              }
                          >
                            <Image
                                resizeMode="stretch"
                                source={require("../../images/bank/addBtn.png")}
                                style={{ width: 30, height: 30, marginRight: 10 }}
                            />
                            <Text style={{ color: "#fff" }}>
                              添加 USDT-ERC20 钱包地址
                            </Text>
                          </View>
                        </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
                    {currentCTCWalletKey && canWithdraw ? (
                        <View style={{ backgroundColor: "#00b324", borderRadius: 5 }}>
                          <TouchableOpacity
                              onPress={() => {
                                this.withdraw();
                              }}
                          >
                            <Text
                                style={{
                                  color: "#fff",
                                  textAlign: "center",
                                  lineHeight: 40,
                                  width: width - 30
                                }}
                            >
                              立即提现
                            </Text>
                          </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ backgroundColor: "#666666", borderRadius: 5 }}>
                          <Text
                              style={{
                                color: "#fff",
                                textAlign: "center",
                                lineHeight: 40
                              }}
                          >
                            立即提现
                          </Text>
                        </View>
                    )}
                  </View>
                </View>
            )}
            {NowBankType == "APW" &&
            noCard == false && ( //astropaly Hover
                <View>
                  <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#fff" }}>提现金额</Text>
                      <Text style={{ color: "#00b324" }}>
                        {payMoney && payMoney}
                      </Text>
                    </View>
                    <View style={styles.DsBorder}>
                      <InputItem
                          styles={StyleSheet.create(newStyle)}
                          placeholderTextColor="#969696"
                          type="number"
                          value={this.state.payMoney}
                          onChange={(value: any) => {
                            this.setState(
                                {
                                  payMoney: value
                                },
                                () => {
                                  this.payMoneyST();
                                }
                            );
                          }}
                          placeholder={`提款最低${minBal}，最高${maxBal}`}
                      />
                    </View>
                    {payMoneySTMsg != "" && (
                        <Text style={{ color: "#ff0000", fontSize: 12 }}>
                          {payMoneySTMsg}
                        </Text>
                    )}
                  </View>
                  <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ color: "#fff", lineHeight: 35 }}>
                      手机号码
                    </Text>
                    <View style={styles.DsBorder}>
                      <Text
                          style={{
                            color: "#fff",
                            paddingLeft: 15,
                            width: width - 30
                          }}
                      >
                        {phoneNumber}
                      </Text>
                    </View>
                  </View>
                </View>
            )}
           
            {NowBankType != "APW" && NowBankType != "CCW" && (
                <View style={{backgroundColor: "#1A1A1A", marginBottom: 28, marginTop: 10}}>
                  {(
                      <View>
                        
                        <View style={{position:'relative', flexDirection: 'row', justifyContent: 'flex-end'}}>
                          <TouchableOpacity
                              style={{width: 120,position: 'relative'}}
                              onPress={() => Actions.bankCenter({ BankType: 'W' })}>
                            <View style={{flexDirection: 'row',}}>
                              <Text style={{color: '#00E62E', marginRight: 8}}>ประวัติการถอน</Text>
                              <Image
                                  resizeMode="contain"
                                  source={require("../../images/bank/file.png")}
                                  style={{ width: 20, height: 25 }}
                              />
                            </View>
                          </TouchableOpacity>

                          {this.state.toolTipVisible && (
                              <TouchableOpacity onPress={() => this.setState({toolTipVisible: false})}
                                                style={{backgroundColor:"#00AA21",position: "absolute",
                                top: -50, borderRadius: 5}}>
                                <Text style={{paddingHorizontal:10, paddingVertical: 8, color: '#fff', }}>คุณสามารถกดดูประวัติการถอนเงินได้ที่หน้าถอน</Text>
                                <View style={{width: 0,
                                  height: 0,
                                  backgroundColor: "transparent",
                                  borderStyle: "solid",
                                  borderLeftWidth: 10,
                                  borderRightWidth: 10,
                                  borderTopWidth: 20,
                                  borderLeftColor: "transparent",
                                  borderRightColor: "transparent",
                                  borderTopColor: "#00B324",

                                  position: 'absolute',
                                  bottom: -20,
                                  right: 30}}></View>
                              </TouchableOpacity>
                          )}
                          
                        </View>
                    
                        
                        
                       
                        
          

                          

                        {/*金額*/}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#fff" }}>ยอดถอน</Text>
                            <Text style={{ color: "#00b324" }}>
                              {payMoney && payMoney}
                            </Text>
                          </View>
                          <View style={styles.DsBorder}>
                            <InputItem
                                styles={StyleSheet.create(newStyle)}
                                placeholderTextColor="#969696"
                                type="number"
                                value={this.state.payMoney}
                                onChange={(value) => {
                                  this.setState(
                                      {
                                        payMoney: value
                                      },
                                      () => {
                                        this.payMoneyST();
                                      }
                                  );
                                }}
                                placeholder={`${minBal}-${maxBal}`}
                            />
                          </View>
                          {payMoneySTMsg != "" && (
                              <Text style={{ color: "#ff0000", fontSize: 12 }}>
                                {payMoneySTMsg}
                              </Text>
                          )}
                          <Text style={{color:'#999999', marginTop: 10, fontSize: 14}}>
                            ขั้นต่ำ : {minBal} บาท, สูงสุด : {maxBal} บาทต่อครั้ง
                          </Text>
                        </View>

                        {/*銀行*/}
                        {toWalletA.length > 0?
                            (<View style={{ paddingLeft: 15, paddingRight: 15 }}>
                              <Text style={{ color: "#fff", lineHeight: 35 }}>
                                ธนาคาร
                              </Text>
                              <View style={styles.DsBorder}>
                                <ModalDropdown
                                    ref={el => (this._dropdown_3 = el)}
                                    defaultValue={toWalletNameCode}
                                    textStyle={styles.DSdropdown_D_text}
                                    dropdownStyle={styles.DSdropdown_D_dropdown}
                                    // adjustFrame={style => this._dropdown_3_adjustFrame(style)}
                                    options={toWalletA}
                                    renderButtonText={rowData =>
                                        this._dropdown_userAccount_renderButtonText(rowData)
                                    }
                                    renderRow={this._dropdown_userAccount_renderRow.bind(
                                        this
                                    )}
                                    onSelect={this.selectBank}
                                    style={{ zIndex: 10, width: width - 30 }}
                                />
                                <View
                                    style={{
                                      position: "absolute",
                                      right: 10,
                                      paddingTop: 6
                                    }}
                                >
                                  <View style={styles.DSarrow}></View>
                                </View>
                              </View>
                              {this.state.isReachThreshold && (
                                  <View style={{flexDirection: 'row', borderRadius: 4 ,marginTop: 10,backgroundColor: '#FFFCCA', paddingHorizontal: 13, paddingVertical: 10}}>
                                    <Image
                                        source={require("../../images/icon_warning.png")}
                                        resizeMode="stretch"
                                        style={{
                                          width: 23,
                                          height: 22,
                                          marginRight: 8,
                                          alignSelf: "center",
                                        }}
                                    />
                                    <Text style={{color: '#222222', fontSize: 11, flex: 1}}>
                                      แจ้งเตือน : การทำรายการถอนของคุณใกล้ถึงลิมิตที่กรมสรรพากรกำหนดแล้ว เพื่อความปลอดภัย กรุณาทำการเปลี่ยนธนาคาร
                                    </Text>
                                  </View>
                              )}
                            </View>):
                            (<View style={{ paddingLeft: 15, paddingRight: 15 }}>
                              <Text style={{ color: "#fff", lineHeight: 35 }}>
                                ธนาคาร
                              </Text>
                              <View style={styles.DsBorder}>
                                <ModalDropdown
                                    ref={el => (this._dropdown_3 = el)}
                                    defaultValue={`กรุณาเลือกธนาคาร`}
                                    textStyle={styles.DSdropdown_D_text}
                                    dropdownStyle={styles.DSdropdown_D_dropdown}
                                    // adjustFrame={style => this._dropdown_3_adjustFrame(style)}
                                    options={BankDataT}
                                    renderButtonText={rowData =>
                                        this._dropdown_noCarduserAccount_renderButtonText(rowData)
                                    }
                                    renderRow={this._dropdown_noCarduserAccount_renderRow.bind(
                                        this
                                    )}
                                    onSelect={this.BankData}
                                    style={{ zIndex: 10, width: width - 30 }}
                                />
                                <View
                                    style={{
                                      position: "absolute",
                                      right: 10,
                                      paddingTop: 6
                                    }}
                                >
                                  <View style={styles.DSarrow}></View>
                                </View>
                              </View>
                            </View>)}
                            
                        

                        {/* 账户姓名 */}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#fff" }}>ชื่อบัญชี</Text>
                          </View>
                          <View style={styles.DsBorder}>
                            <InputItem
                                styles={StyleSheet.create(newStyle)}
                                placeholderTextColor="#969696"
                                type="text"
                                value={this.state.accountHolderName}
                                onChange={(value) => {
                                  let newText = this.filterName(value)
                                  this.setState(
                                      {
                                        accountHolderName: newText
                                      });
                                }}
                                placeholder={``}
                                editable={noCard}
                            />
                          </View>
                        </View>

                        {/*銀行帳號*/}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#fff" }}>เลขที่บัญชี</Text>
                          </View>
                          <View style={styles.DsBorder}>
                            <InputItem
                                styles={StyleSheet.create(newStyle)}
                                placeholderTextColor="#969696"
                                type="text"
                                value={this.state.accountNumber}
                                onChange={(value) => {
                                  let newText = this.filterNumber(value)
                                  this.setState(
                                      {
                                        accountNumber: newText
                                      });
                                }}
                                placeholder={``}
                                editable={noCard}
                            />
                          </View>
                        </View>


                        {/* 省 */}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#fff" }}>จังหวัด</Text>
                          </View>
                          <View style={styles.DsBorder}>
                            <InputItem
                                styles={StyleSheet.create(newStyle)}
                                placeholderTextColor="#969696"
                                type="text"
                                value={this.state.province}
                                onChange={(value) => {
                                  this.setState(
                                      {
                                        province: value
                                      });
                                }}
                                placeholder={``}
                                editable={noCard}
                            />
                          </View>
                        </View>

                        {/*城市*/}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#fff" }}>เมือง</Text>
                          </View>
                          <View style={styles.DsBorder}>
                            <InputItem
                                styles={StyleSheet.create(newStyle)}
                                placeholderTextColor="#969696"
                                type="text"
                                value={this.state.city}
                                onChange={(value) => {
                                  this.setState(
                                      {
                                        city: value
                                      });
                                }}
                                placeholder={``}
                                editable={noCard}
                            />
                          </View>
                        </View>

                        {/*分支*/}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#fff" }}>เมือง</Text>
                          </View>
                          <View style={styles.DsBorder}>
                            <InputItem
                                styles={StyleSheet.create(newStyle)}
                                placeholderTextColor="#969696"
                                type="text"
                                value={this.state.branch}
                                onChange={(value) => {
                                  this.setState(
                                      {
                                        branch: value
                                      });
                                }}
                                placeholder={``}
                                editable={noCard}
                            />
                          </View>
                        </View>

                      </View>
                  )}

                </View>
            )}
            {/*无银行卡  */}
            {/*{NowBankType != "CCW" && noCard && (*/}
            {/*  <View*/}
            {/*    style={{*/}
            {/*      flex: 1,*/}
            {/*      flexDirection: "column",*/}
            {/*      justifyContent: "center"*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <NoBankComp />*/}
            {/*    <View*/}
            {/*      style={{*/}
            {/*        paddingLeft: 15,*/}
            {/*        paddingRight: 15,*/}
            {/*        paddingBottom: height / 3.5*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      <TouchableOpacity onPress={this.goNewBank}>*/}
            {/*        <View*/}
            {/*          style={[*/}
            {/*            styles.DsBorder,*/}
            {/*            {*/}
            {/*              borderColor: "#00b324",*/}
            {/*              flexDirection: "row",*/}
            {/*              height: 45,*/}
            {/*              width: width - 30*/}
            {/*            }*/}
            {/*          ]}*/}
            {/*        >*/}
            {/*          <Text style={{ color: "#00b324", marginRight: 5 }}>+</Text>*/}
            {/*          <Text style={{ color: "#fff", fontSize: 16 }}>*/}
            {/*            เพิ่มบัญชี*/}
            {/*          </Text>*/}
            {/*        </View>*/}
            {/*      </TouchableOpacity>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*)}*/}

            {NowBankType != "CCW" && noCard == false && (
                <View>
                  {NowBankType != "APW" ? null : (
                      <View
                          style={{
                            paddingLeft: 14,
                            paddingBottom: 10,
                            paddingTop: 15
                          }}
                      >
                        <Flex style={{ paddingBottom: 10 }}>
                          <Text style={{ color: "#fff" }}>温馨提醒:</Text>
                        </Flex>

                        <Flex>
                          <Flex.Item>
                            <Text style={{ color: "#fff" }}>
                              1. 会员必须以验证过的手机号码进行提款交易。{" "}
                            </Text>
                            <Text style={{ paddingTop: 5, color: "#fff" }}>
                              2. 输入提款金额, 转入属于您的AstroPay
                              Card账户并点击"提交"。{" "}
                            </Text>
                            <Text
                                style={{ paddingTop: 5, color: "#fff" }}
                                onPress={this.openDomain.bind(this)}
                                style={{ color: "#0e7e00" }}
                            >
                              3. 如还未设有Astropay账户, 点击这里下载AstroPay Card
                              App, 或点击查询注册账号。
                            </Text>
                            <Text style={{ paddingTop: 5, color: "#fff" }}>
                              注意: Astropay属于第三方支付平台, 一旦同意提款转账后,
                              资金将转入以会员的手机账号注册的Astropay账号。
                            </Text>
                          </Flex.Item>
                        </Flex>
                      </View>
                  )}
                </View>
            )}

            <View style={{padding: 15}}>
              <View style={{ backgroundColor:this.state.isSingleDeposit?"#2d2d2d":"#00b324", borderRadius: 5 }}>
                <TouchableOpacity disabled={this.state.isSingleDeposit} onPress={() => this.goNewBank()}>
                  <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        lineHeight: 40,
                        width: width - 30
                      }}
                  >
                    เพิ่มบัญชีธนาคาร
                  </Text>
                </TouchableOpacity>
              </View>
            </View>


            {NowBankType != "CCW" && isPhone == true && (
                <View style={{ padding: 15 }}>
                  {!canWithdraw && (
                      <View style={{ backgroundColor: "#2d2d2d", borderRadius: 5 }}>
                        <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 40
                            }}
                        >
                          ถอนเงิน
                        </Text>
                      </View>
                  )}
                  {canWithdraw && (
                      <View style={{ backgroundColor: "#00b324", borderRadius: 5 }}>
                        <TouchableOpacity onPress={() => this.withdrawBtn()}>
                          <Text
                              style={{
                                color: "#fff",
                                textAlign: "center",
                                lineHeight: 40,
                                width: width - 30
                              }}
                          >
                            ถอนเงิน
                          </Text>
                        </TouchableOpacity>
                      </View>
                  )}
                </View>
            )}

          </KeyboardAwareScrollView>

          {/* {noCard == false && isPhone == true && (
          <Flex style={canWithdraw?styles.PayButtonBHoves:styles.PayButtonB}>
            <Flex.Item alignItems="center">
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.buttonbankCar}
                onPress={() => this.withdraw()}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  提交申请
                </Text>
              </TouchableOpacity>
            </Flex.Item>
          </Flex>
        )} */}
        </View>
    );
  }
}


const stylesModal = StyleSheet.create({
  liveChatModal:{
		height,
		alignItems: 'center',
		justifyContent: 'center'
	},
  liveChatModalContainer: {
		width: width * .8,
		backgroundColor: '#000000',
		borderWidth: 1,
		borderColor: '#00B324',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.9,
		shadowRadius: 10,
		shadowColor: "#00B32480",
		elevation: 4,
		position: 'relative',
		paddingTop: 25,
		paddingBottom: 40
	},
	liveChatIconImg: {
		width: 56,
		height: 60
	},
	liveChatTextInfor: {
		color: '#fff',
		marginTop: 24,
		marginBottom: 40,
		marginHorizontal:32,
		lineHeight:24,
		textAlign:'center'
	},
	liveChatBottomBtn: {
		backgroundColor: '#00B324',
		borderWidth: 1,
		borderRadius: 4,
		borderColor: '#00B324',
		width: width * .5,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	liveChatBottomBtnText: {
		color: '#F5F5F5'
	},
	closeBtn: {
		position: 'absolute',
		right: 12,
		top: 10,
		zIndex: 100
	},
	closeBtnText: {
		color: '#fff',
		fontSize: 18
	},
	modalBottomContainer: {
		alignItems: 'center'
	},
})


export default Withdrawals;
