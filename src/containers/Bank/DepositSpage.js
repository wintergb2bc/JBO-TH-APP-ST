

import React from 'react';
import {
    ScrollView,
    ActivityIndicator,
    Platform,
    TouchableHighlight,
    StyleSheet,
    PermissionsAndroid,
    Modal,
    CameraRoll,
    Alert,
    Linking,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Clipboard
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Radio, WhiteSpace, Flex, Toast, InputItem, List, DatePicker, Picker } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import styles from './bankStyle';
import Orientation from 'react-native-orientation-locker';
import ModalDropdown from 'react-native-modal-dropdown';
import { KeyboardAwareScrollView, ScrollableComponent } from 'react-native-keyboard-aware-scroll-view'
import Carousel from "react-native-banner-carousel";
import { bankIcons } from "./bankIcons";
// import Carousel, { Pagination } from 'react-native-snap-carousel'

import QRCodeS from 'react-native-qrcode';
import QRCodeA from 'react-native-qrcode-svg';

import ViewShot from "react-native-view-shot";
const RadioItem = Radio.RadioItem;
const {
    width
} = Dimensions.get('window')
const TypeName = ["depositT", "recordsT", "transferT", "withdrawalsT", "BqrT"]
import CheckBox from 'react-native-check-box'
import PickerList from "antd-mobile-rn/lib/list/style/index.native";
import moment from 'moment'

import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index.native';
import ListItems from 'antd-mobile-rn/lib/list/style/index.native';
import { AsyncStorage } from "react-native";
import ImagePicker from "react-native-image-picker";
import DepositRDTutorial from './DepositRDTutorial';
import ShowBankDetail from './ShowBankDetail';

const newStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyle[key].color = '#fff';
            newStyle[key].fontSize = 13
            // newStyle[key].textAlign = 'right';
            // newStyle[key].marginRight = 10;
        }
        newStyle[key].borderBottomColor = '#1a1a1a';
    }
}
const newStylePicker = {};
for (const key in PickerList) {
    // console.log(key)
    // console.log(PickerList)
    if (Object.prototype.hasOwnProperty.call(PickerList, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStylePicker[key] = { ...StyleSheet.flatten(PickerList[key]) };
        newStylePicker[key].backgroundColor = "transparent";
        newStylePicker[key].borderColor = "transparent";
        if(key === 'Line'){
            newStylePicker[key].borderWidth = 0;
        }
        if(key === 'Item'){
            newStylePicker[key].width = width - 230;
        }
        newStylePicker[key].borderBottomColor = "transparent";
    }
}

const newStyle9 = {};
for (const key in ListItems) {
    console.log(key)
    console.log(ListItems)
    if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
        newStyle9[key] = { ...StyleSheet.flatten(ListItems[key]) };
        if (key == "Item") {
            newStyle9[key].width = width - 30;
            // newStyle9[key].textAlign = "left"
        }
        newStyle9[key].color = "#fff";
        newStyle9[key].fontSize = -999;
        newStyle9[key].backgroundColor = "transparent";
        newStyle9[key].borderWidth = 0
        newStyle9[key].borderBottomColor = "transparent";
    }
}
const newStyleFS = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        newStyleFS[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyleFS[key].color = '#fff';
            newStyleFS[key].textAlign = 'right';
            newStyleFS[key].marginRight = 10;
            newStyleFS[key].fontSize = 12;
        }
        newStyleFS[key].borderBottomColor = '#1a1a1a';
    }
}




const TextStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        TextStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            TextStyle[key].fontSize = 24;
            TextStyle[key].fontWeight = 'bold';
            TextStyle[key].color = '#fff';
            TextStyle[key].textAlign = 'right';
            TextStyle[key].marginRight = 10;
        }
        TextStyle[key].borderBottomColor = '#1a1a1a';

    }
}

const RadioStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        TextStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };

    }
}

const TextStyleB2 = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        TextStyleB2[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            TextStyleB2[key].fontSize = 12;
            TextStyleB2[key].fontWeight = 'bold';
            TextStyleB2[key].color = '#969696';
            TextStyleB2[key].textAlign = 'left';
            TextStyleB2[key].marginRight = 10;
        }
        TextStyleB2[key].borderBottomColor = '#1a1a1a';
    }
}


const TextStyleBName2 = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        TextStyleBName2[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            TextStyleBName2[key].fontSize = 12;
            TextStyleBName2[key].fontWeight = 'bold';
            TextStyleBName2[key].color = '#fff';
            TextStyleBName2[key].textAlign = 'left';
            TextStyleBName2[key].marginRight = 10;
        }
        TextStyleBName2[key].borderBottomColor = '#1a1a1a';
    }
}

const newStyleS2 = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        newStyleS2[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            newStyleS2[key].color = '#fff';
            newStyleS2[key].textAlign = 'center';
            newStyleS2[key].marginRight = 10;
        }
        newStyleS2[key].borderBottomColor = '#1a1a1a';
    }
}



const CustomChildren = (props: any) => (
    <TouchableOpacity onPress={props.onPress}>
        <View
            style={{ height: 36, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}
        >
            <Text style={{ flex: 1 }}>{props.children}</Text>
            <Text style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</Text>
        </View>
    </TouchableOpacity>
);

let TimeV1;

// 支援的付款方式
const availablePaymentMethods = ['THBQR', 'EZP', 'BC', 'LB', 'CC', 'TMW', 'BQR', 'RD']

// 付款方式顯示名稱
const PaymentName = {
    'THBQR': "QR ฝากเงิน",
    'BC': "Fast Baht",
    'EZP': "EeziePay",
    'CC': "บัตรเงินสด",
    // 'TMW': `ทรูมันนี่ วอลเล็ท`,
    'TMW': `ทรูมันนี่${"\n"}วอลเล็ท`,
    'BQR':`QR ฝากเงินทศนิยม`,
    'RD':`ฝากเงินด่วน`,//快速存款
}

const bankImage = {
    "LB": require('../../images/bank/pay_LB.png'),
    "BC": require('../../images/bank/BCpay.png'),
    "EZP": require('../../images/bank/EZP.png'),
    "CC": require('../../images/bank/pay_CC.png'),
    'THBQR': require('../../images/bank/THBQR.png'),
    'TMW': require('../../images/bank/TMW.png'),
    'BQR':require('../../images/bank/BQR.png'),
    'RD':require('../../images/bank/RD.png'),
}

// 存款排序定義
const BankList = {
    "TMW": {order: 1}
}

const LBname = {
    "IB": "ต่างธนาคาร",
    "ATM": "ATM",
    "Cash-ATM": "ตู้โอนเงินสด",
    "LocalBank": "LocalBank",
}


const paymentImgs = {
    "FASTPAY": require('../../images/bank/FASTPAY.png'),
    "WEALTHPAY": require('../../images/bank/WEALTHPAY.png'),
    "EEZIEPAY": require('../../images/bank/Eeziepay.png'),
    "TPAY": require('../../images/bank/TPAY.png'),
    "YOUFU": require('../../images/bank/YOUFU.png'),
    "OOPAY": require('../../images/bank/OOPAY.png'),
    "SPEEDPAY": require('../../images/bank/SPEEDPAY.png'),
    "OPTIMUSPAY": require('../../images/bank/Optimus.jpeg'),
}


const bankNameList = [
    {
        img: require("../../images/bank/banklogo/banklogo1.png"),
        title: 'ธ. ออมสิน'
    },
    {
        img: require("../../images/bank/banklogo/banklogo2.png"),
        title: 'ธ. กรุงเทพ'
    },
    {
        img: require("../../images/bank/banklogo/banklogo3.png"),
        title: 'ธ. กรุงไทย'
    },
    {
        img: require("../../images/bank/banklogo/banklogo4.png"),
        title: 'ธ. กรุงศรีอยุธยา'
    },
    {
        img: require("../../images/bank/banklogo/banklogo5.png"),
        title: 'ธ. กสิกรไทย'
    },
    {
        img: require("../../images/bank/banklogo/banklogo6.png"),
        title: 'ธ. ไทยพาณิชย์'
    },
    {
        img: require("../../images/bank/banklogo/banklogo7.png"),
        title: 'ธ. ทหารไทย'
    },
    {
        img: require("../../images/bank/banklogo/banklogo8.png"),
        title: 'ธ. เกียรตินาคิน'
    },
    {
        img: require("../../images/bank/banklogo/banklogo9.png"),
        title: 'ธ. ทิสโก้'
    },
    {
        img: require("../../images/bank/banklogo/banklogo10.png"),
        title: 'ธ. ธนชาต'
    },
    {
        img: require("../../images/bank/banklogo/banklogo11.png"),
        title: 'ธ. ซีไอเอ็มบี ไทย'
    },
    {
        img: require("../../images/bank/banklogo/banklogo12.png"),
        title: 'ธ. นครหลวงไทย'
    },
    {
        img: require("../../images/bank/banklogo/banklogo13.png"),
        title: 'ธ. ยูโอบี'
    },
    {
        img: require("../../images/bank/banklogo/banklogo14.png"),
        title: 'ธ. ไอซีบีซี'
    },
    {
        img: require("../../images/bank/banklogo/banklogo15.png"),
        title: 'ธ. สแตนดาร์ด ชาร์เตอร์ด'
    },
    {
        img: require("../../images/bank/banklogo/banklogo16.png"),
        title: 'ธ. LH'
    }, {
        img: require("../../images/bank/banklogo/banklogo17.png"),
        title: 'ธ.ก.ส'
    }

]

let date = new Date();
let y = date.getFullYear();
let m = date.getMonth() + 1;
m = m < 10 ? ('0' + m) : m;
let d = date.getDate();
d = d < 10 ? ('0' + d) : d;
var h = date.getHours();
h = h < 10 ? ('0' + h) : h;
let minute = date.getMinutes();
let second = date.getSeconds();
minute = minute < 10 ? ('0' + minute) : minute;
second = second < 10 ? ('0' + second) : second;

const thNow = moment().locale('th');
const maxDate = thNow;
console.log(thNow)

class DepositSpage extends React.Component {
    constructor(props) {
        super(props);
        this.navigateToScene = this.navigateToScene.bind(this);
        this.BankClick = this.BankClick.bind(this);
        this.okPayMoney = this.okPayMoney.bind(this);
        //this.goNewAccount = this.goNewAccount.bind(this);
        //this.getBankList = this.getBankList.bind(this);
        this.adjustBanks = this.adjustBanks.bind(this);
        this.okPutMemberBank = this.okPutMemberBank.bind(this);
        this.state = {
            Button1: '',
            Bank: '',
            TotalBal: '',
            IPSB: '',
            MAIN: '',
            LD: '',
            SLOT: '',
            SB: '',
            carNj: '',
            Inttype: false,  /* 默认为 false 整数金额 反之 非整数金额 */
            keyboardOpen: false,
            toWallet: "主账户",
            payMoney: '0',
            isDepositLock: false,
            isWithdrawalLock: false,
            BankData: '',  //單一銀行規則
            NowBankType: "",// 用戶選擇充值銀行
            AppData: this.props,
            payOK: false,
            payHtml: '',
            toWalletA: '',//目標帳戶總數據
            depositingWallet: 'MAIN', // 目標帳戶
            isPreferredWalletSet: false, // 是不是首選帳戶
            ID: 0,//優惠id
            Bonus: '',//優惠data
            BonusData: '',
            cardNumber: '',// 卡號
            cardPIN: '',// 卡密碼
            payMoneyBn: '',
            payMoney2: '',
            transferType: '', //付款方式 本銀
            LBdata: '',
            AllBankopen: false,
            NowData: '',
            befosDateText: '',
            NowDataText: '',
            Xmoney: 0,
            bankNameNow: '',
            enabled: true, //滾動條 控制
            enabled2: true,
            Charges: '',
            cardName: '',
            ErrorUserName: '',
            BCType: false,  //高額支付 // 银联快捷
            bonusCouponID: '',
            bonusCouponKEY: 0,// 優惠券
            bonusCoupon: '',
            BonusMSG: '',//優惠訊息
            BCBankName: '',//高額 充值銀行
            BCDB: '',
            BCTypeXS: false,
            userBankD: '',
            UserCheackBank: '',//  默認選中 第一
            userNohavename: false,
            OpenDPmenu: true,
            placeholderMoney: "0",
            BankMaxBal: '',
            BankMinBal: '',
            okCanPay: false,
            MoneyErrorMSG: '',
            UserName: '',
            UserNameError: '',
            UserNameCheck: '',
            ALBPOP: false,
            uniqueAmount: 0,
            CardErrorpwd: '',
            CardErrorMSG: '',
            QRCODE: '',
            PayAready: false,
            transactionId: '',
            isdepositPageT: false,
            DatePickers: new Date(),
            pay_APnum_6: false,//判断a卡充值第4位是否为6则为美金
            cardNumberST: '',// 卡號验证
            cardPINST: '',// 卡密碼验证
            payMoneyST: '',//金额验证
            userNameST: '',//用户名验证
            cardNumberSTMsg: '',// 卡號验证错误提示语
            cardPINSTMsg: '',// 卡密碼验证错误提示语
            payMoneySTMsg: '',//金额验证错误提示语
            defaultLabel: "เข้าร่วมครั้งต่อไป!",
            LBAGtransferTypes: [],
            paymentchannel: '', //充值渠道選擇
            paymentchannelEND: '',//充值渠道當前選擇
            CTCMethodTypes: [],//加密貨幣支付方式
            curentCTCMethod: '',
            cryptoType: null,
            showCTCModal: false,
            // CTCpayStepOne:true,
            CTCData:{},
            CTCchannelMsg:'',
            spinFlag:false,
            channelActiveSlide:0,
            invokeActiveSlide:0,
            currentCTCguid:'channel',
            showCTCTutorailModal:false,
            depositPopUpNot:false,
            verifyModal:true,
            optModal:false,

            accountNumber: "",
            THBQR_step_2: false,
            QRBanks_info: false,
            LBcurrentStep: 0,
            lbRechargeMethod: 0,  // 0 normal, 1 fast

            //用戶添加過的銀行
            LBmemberBanksKey: '',
            LBmemberBanks: '',
            LBMemberBankName: '',
            userName: '',

            //系統銀行
            LBBanks: "",
            LBBanksKey: 0,

            // 付款
            LBpay: '', //本銀付款方式
            LBpayD: '',
            userBank: '',// 本銀 銀行卡

            c: false, //本银 -- 是否新增银行卡的模式

            setDefaultBank: true,
            changeWord: false,
            fileBytes: '',
            fileName: '',
            fileSize: '',
            uploadSizeFlag: false,
            LBStep3: false,
            TimeLoad: "30:00",
            isFast:false,//pre record是否為快速處理
            isRecord:false,//pre record是否為正常處理,
            isSaveBankChecked: false,
            offlineDepositHour: ["00"],
            offlineDepositMinute: ["00"],
            isOtherAcc: false,//本银 -- 是否新增银行卡的模式
            lastSixNumber: '',
            SixNumber: '',
            fastTextShow: true,
            fastMoneyNoticeShow: true,
            historyFast: false, // 有無padding中fast訂單
            lastIsFast: false, // 上一次是不是用fast
            offlineDepositDate: new Date(),
            isNew3: true, //True 只能添加一张银行
            avatarSource: null, //上传的文件
            avatarName: "", //上传的文件名
            avatarSize: "", //上传的文件大小
            isFistEntryFlag:true,
            IsAutoAssign:false,
            IsDummy:false,
            passAcc:'',
            passDepNum:'',

            banks: [],
            showEXPTutorailModal:false,
            ShowDetail:false,
            ShowBank:false,
            ShowInfo:false,
            bindAlready:false,
            nobank:false,
            returnEmpty:false,
            BankTypeKey: props.BankType ? props.BankType : 'D',
            AppearBank:false,
            BankNum:'',
            showDone:false,
            showSave:false,
            AccountErr:false,
            failPop:false,
            hasBind:false,
            hasUse:false,
            isHaveBankImg:'',
            rdRechargeMethod:0,
            RDBankName:'',
            RDBankAcc:'',
            RDBank:'',
            RDCode:''
        }
    }
    componentWillMount(props) {

        // TODO 測試添加銀行卡頁
        // Actions.newBank();
        console.log('this.props.data.',this.props.data)
        Orientation.lockToPortrait();
        if (this.props.data.name == "depositT") {
            if (bonusProduct) {
                this.setState({
                    toWallet: Bankname[bonusProduct],
                    depositingWallet: "MAIN"
                });
            } else {
                storage.load({
                    key: 'memberInfo',
                    id: 'memberInfos'
                }).then(data => {
                    this.setState({
                        toWallet: data.memberInfo.preferWallet == undefined ? Bankname[data.memberInfo.PreferWallet] : Bankname[data.memberInfo.preferWallet],
                        depositingWallet: data.memberInfo.preferWallet == undefined ? data.memberInfo.PreferWallet : data.memberInfo.preferWallet,                        
                    });

                }).catch(err => {
                })
            }

            //this.Bonus(bonusProduct)

        } else {
            storage.load({
                key: 'memberInfo',
                id: 'memberInfos'
            }).then(data => {
                this.setState({
                    toWallet: data.memberInfo.preferWallet == undefined ? Bankname[data.memberInfo.PreferWallet] : Bankname[data.memberInfo.preferWallet],
                    depositingWallet: data.memberInfo.preferWallet == undefined ? data.memberInfo.PreferWallet : data.memberInfo.preferWallet
                });

            }).catch(err => {
            })

        }

        storage.load({
            key: 'Bank',
            id: 'BankData'
        }).then(data => {

            let bankList = data;
            bankList.result = bankList.result.filter(v => availablePaymentMethods.includes(v.code))
            console.log(bankList.result)

            if (bankList.result.length % 3 == 2) {
                bankList.result.push({ code: 'no' })
            }
            this.setState({
                isDepositLock: data.isDepositLock,
                isWithdrawalLock: data.isWithdrawalLock,
                // Bank: bankList,
                Inttype: data.result[0].uniqueAmountStatus /* 默认第一个充值方式的充值金额整数判断 */
            })
            //this.GetPaymentFirst();
            let GETBank = data.result
            //	this.GetPaymentFirst();
            let BCBOx;
            let BCTypeS;

            let GETBank_Copy = GETBank.slice();
            this.setState({
                BCTypeXS: BCTypeS,
                BCDB: BCBOx,
                Bank: GETBank_Copy
            })
            this.BankClick(GETBank[0].code, GETBank[0].name) //222銀行規則
        }).catch(err => {
            this.GetPaymentFirst();
        })

        this.checkMember()//有沒有真實性名

        let dataHour = Array.from({ length: 24 }, (v, i) => ({
            label: (i + '').length === 1 ? '0' + i : i + '',
            value: (i + '').length === 1 ? '0' + i : i + '',
        }))
        let dataSecond = Array.from({ length: 60 }, (v, i) => ({
            label: (i + '').length === 1 ? '0' + i : i + '',
            value: (i + '').length === 1 ? '0' + i : i + '',
        }))
        this.setState({
            dataHour,
            dataSecond
        })
        // this.WCandOASelectDefault(); //获取支付宝和微信支付的快速充值金额
    }

    componentWillUnmount() {  //離開註銷監聽
        Orientation.removeOrientationListener(this._onOrientationChange);
        if (TypeName.indexOf(this.props.name) != -1) {
            Orientation.unlockAllOrientations();   //解鎖橫豎屏  如果是在遊戲頁面開啟 重新解鎖
        }
        if (this.props.data.fromPage == 'home') {
            if (this.props.data.getUser) {
                this.props.data.getUser()
            }
        }

        if (this.props.data.fromPage == 'Recommend') {
            if (this.props.data.refreshPage) {
                this.props.data.refreshPage()
            }
        }

        TimeV1 && clearInterval(TimeV1);
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

    reverBank(banks){
        let result = banks;
        // let isHaveBankNum = data.find(
        //     (v) => v.BankAccountID === getNum
        // );
        result.sort((a, b) => {
            return b.IsReverseDeposit - a.IsReverseDeposit;
            });
            return result;
    }

    uploadFile(e) {

    }
    
    bonusSelectCheck = () => {
        const { NowBankType, LBcurrentStep, THBQR_step_2 } =this.state

        // THBQR第二步驟 LB第二和三步驟 不顯示
        if(NowBankType === "THBQR" || NowBankType === "LB" || NowBankType === "BQR" ){
            if(NowBankType === "THBQR" && !THBQR_step_2){
                return this.bounsSelectUI()
            }
            if(NowBankType === "LB" && LBcurrentStep === 1){
                return this.bounsSelectUI()
            }
            if(NowBankType === "BQR"){
                return this.bounsSelectUI()
            }
        }else{
            return this.bounsSelectUI()
        }

    }

    bounsSelectUI = () => {
        const { Bonus,bonusCouponKEY,BonusMSG } =this.state
        return (
            <View style={{ backgroundColor: "#1a1a1a", paddingBottom: 14 }} key={Bonus}>
                <Flex style={{ paddingTop: 5 }}>
                    <Flex.Item style={{ paddingTop: 10, paddingBottom: 10 }}>
                        <Text style={{ color: "#fff", fontSize: 14, paddingLeft: 14 }}><Text style={{ color: "red" }}>* </Text>โปรโมชั่น</Text>
                    </Flex.Item>
                </Flex>

                <Flex>
                    <Flex.Item alignItems='flex-end' style={{ marginRight: 30, position: 'absolute', zIndex: 1, right: 0, top: 12 }}>
                        <View style={styles.arrow2}></View>
                    </Flex.Item>

                    <Flex.Item style={{ flex: 1, paddingTop: 8, paddingBottom: 3, backgroundColor: "#2a2a2a", borderRadius: 5, marginLeft: 15, marginRight: 15 }}>
                        <ModalDropdown ref={el => this._dropdown_3 = el}
                                       defaultValue={this.state.defaultLabel}
                                       textStyle={styles.dropdown_Bonus_text}
                                       dropdownStyle={styles.dropdown_Bonus_dropdown}
                                       options={Bonus}
                                       renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                       renderRow={this._dropdown_Bouns_renderRow.bind(this)}
                                       onSelect={this.BonusButton}
                        />
                    </Flex.Item>
                </Flex>

                {bonusCouponKEY != 0 &&
                <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                    <Text style={{ color: '#fff', lineHeight: 35 }}>优惠券号码</Text>
                    <View style={styles.DsBorder}>
                        <InputItem styles={StyleSheet.create(newStyle)}
                                   placeholderTextColor="#969696"
                                   type="text"
                                   labelNumber={5}
                                   value={this.state.bonusCoupon}
                                   onChange={(value: any) => {
                                       this.setState({
                                           bonusCoupon: value,
                                       });
                                   }}
                                   placeholder="请填写优惠券号码"
                        >
                            {/* <Text style={{ fontSize: 14, color: "#fff" }}>优惠券号码:</Text> */}
                        </InputItem>
                    </View>
                </View>
                }


                {BonusMSG != "" &&
                <Flex style={{ paddingTop: 5 }}>
                    <Flex.Item>

                        <Text style={{ color: '#46ea27', padding: 13 }}>{BonusMSG}</Text>

                    </Flex.Item>

                </Flex>
                }
            </View>
        )
    }

    addNewBankText = () => {
        const { NowBankType } =this.state
        return (
            <TouchableOpacity onPress={()=>Actions.LiveChatST()}>
                <Text style={{color: "#00E62E", textDecorationLine:NowBankType === 'BQR'?'underline':''}}>เพิ่มธนาคารของคุณ</Text>
            </TouchableOpacity>
        )
    }

    goNewBank() {
        Actions.newBank();
    }

    goNewAccount(){
        let ST = this.state;
        let BaDB = ST.BankData.bankAccounts[ST.userBankD]
        console.log('NewBank==========',ST,'BaDB',BaDB)
        Actions.newAccount({ 
            BankTypeKey: "D",
            data: ST.userName,
        });
    }


    _onOrientationChange(curOrt) {
        Orientation.lockToPortrait();
    }

    checkMember() {
        this.setState({
            userNohavename: false,
        })
        fetchRequest(ApiPort.Member, 'GET')
            .then(data => {
                console.log('checkMember',data)
                this.BankAccountGet()
                if (data.result) {
                    global.storage.save({
                        key: 'memberInfo', // 注意:请不要在key中使用_下划线符号!
                        id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
                        data: data.result,
                        expires: null
                    });
                }

                this.setState({
                    memberInfo:data.result.memberInfo,
                    isNew3: data.result.memberInfo.IsSingleDeposit||false
                })
                let memberInfo = data && data.result.memberInfo;
                console.log('12126',memberInfo.FirstName,memberInfo.IsAddressExisted,memberInfo.IsDOBExisted,memberInfo.IsEmailExisted,memberInfo.IsPhoneVerified)                
                if(memberInfo.FirstName&&memberInfo.IsAddressExisted&&memberInfo.IsDOBExisted&&memberInfo.IsEmailExisted&&memberInfo.IsPhoneVerified){
                    // this.setState({optModal:false})
                }else{
                    setTimeout(() => {
                        // this.setState({optModal:true})
                    }, 3000);

                }
                if (!data.result.memberInfo.FirstName) {
                    //alert('手机号未验证 ,邮箱未填')
                    //Toast.fail('真实姓名未填写,请先完善资料', 2);
                    this.setState({
                        userNohavename: true,
                    })
                    Actions.newName({fromPage: 'DepositPage'})

                    // Actions.newName();
                    // if(GameType == false){
                    // 	// setTimeout(function () {
                    // 	// 	Actions.AccountUserX({});
                    // 	// }, 3000);

                    // }else{
                    // 	setTimeout(function () {
                    // 		Actions.AccountUserX({});
                    // 	}, 3000);
                    // }
                } else {
                    global.localStorage.setItem('newName',memberInfo.FirstName)
                    this.setState({
                        userNohavename: false,
                        userName: memberInfo.FirstName,
                    }
                    //, () => {
                    //     if (this.state.NowBankType == "LB") {
                    //         this.userNameST()
                    //     }
                    //     if(this.state.NowBankType == "BQR"){
                    //         this.setState({
                    //             userName: data.result.memberInfo.FirstName
                    //         })
                    //     }
                    // }
                    )
                }


            })
    }

    //進入頁面獲取上一筆data是快速或一般
    // GetAmtrecords() {
    // 	fetchRequest(ApiPort.PaymentApplications + "?transactionType=deposit&" , 'GET')
    // 		.then(data => {
    //             if(data) {
    //                 if(data.historyList[0].ConvertedAmount === 0) {
    //                     //如果成员上次提交的是本地银行-“正常处理”，那么默认情况下将是“正常处理”选项
    //                     this.setState({
    //                         isRecord:true,
    //                     },()=>this.methodChange('NormalAmt', "ฝากธรรมดา", 0))                                               
    //                 } 
    //
    //                 if(data.historyList[0].ConvertedAmount !== 0) { 
    //                     //如果成员上次提交的是本地银行-“快速处理”，那么默认情况下将是“快速处理”选项 && 不需要再次显示提示
    //                     this.setState({
    //                         isFast:true,
    //                     },()=>this.methodUniqueChange("UniqueAmt","ฝากมีทศนิยม",1))            
    //                 }
    //
    //                 if(data.historyList[0].PaymentMethodId != "LB") {
    //                     //默认情况下将是“正常处理”选项
    //                     this.setState({
    //                         isRecord:true,
    //                     },()=>this.methodChange('NormalAmt', "ฝากธรรมดา", 0)) 
    //                 }                   
    //             }
    // 		}).catch(error => {
    // 			Toast.hide();
    // 			console.log(error)
    // 		})
    // }
    //
    // 查Fast歷史訂單
    checkFP = () => {
        fetchRequest(ApiPort.GetProcessingLB + "methodCode=UniqueAmt&", 'GET')
            .then(data => {
                console.log('historyLB======', data)
                if (data.length && data[0].Amount && data[0].DepositingBankAcctNum && data[0].TransactionId) {
                    this.setState({
                        transactionId: data[0].TransactionId,
                        payMoney: data[0].ConvertedAmount,
                        lbRechargeMethod: 1,
                        LBcurrentStep: 2,
                        historyFast: true,
                        uniqueAmount: data[0].Amount
                    })
                } else {
                    this.defaultLBMethod() //LB預設處理
                }

            }).catch(error => {
            console.log(error)
        })

        this.setState({isFistEntryFlag:false})
    }

    TimeDown = () => {
        if(TimeV1){
            clearInterval(TimeV1);
        }

        var m = 30; //分
        var s = 0; //秒
        TimeV1 = setInterval(() => {
            let Sdb = s < 10 ? "0" + s : s;
            this.setState({
                TimeLoad: m + ":" + Sdb
            });
            if (m == 0 && s == 0) {
                clearInterval(TimeV1);
                this.props.navigateToScene('records')
            } else if (m >= 0) {
                if (s > 0) {
                    s--;
                } else if (s == 0) {
                    m--;
                    s = 59;
                }
            }
        }, 1000);
    }
    

    //瘋狂拿目標帳戶 this.loadInterval && clearInterval(this.loadInterval);
    GettoWalletA() {
        this.loadInterval = setInterval(() => {
            if (toWalletBox != "") {
                this.state.toWalletA = toWalletBox.map(function (item, key) {
                    return { value: item.key, label: item.name }
                });
                this.setState({
                    toWalletA: this.state.toWalletA
                })
                this.Bonus(toWalletBox[1].key)
                clearInterval(this.loadInterval);
            }
        }, 5000)
    }

    //獲取目標帳戶

    GetWallets() {

        fetchRequest(ApiPort.Wallets, 'GET')
            .then(data => {


                fromWalletBox = data.fromWallet;
                toWalletBox = data.toWallet;
                this.state.toWalletA = toWalletBox.map(function (item, key) {
                    return { value: item.key, label: item.name }
                });
                this.setState({
                    toWalletA: this.state.toWalletA
                })

            }).catch(error => {
            //Toast.hide();


        })
    }

    //獲取銀行數據
    GetPaymentReload() {
        fetchRequest(ApiPort.Payment + '?transactionType=deposit&', 'GET')
            .then(data => {
                //	Toast.hide();
                storage.save({
                    key: 'Bank', // 注意:请不要在key中使用_下划线符号!
                    id: 'BankData', // 注意:请不要在id中使用_下划线符号!
                    data: data,
                    expires: 1000 * 1200 * 24,
                });
                let bankList = data;
                if (bankList.result.length % 3 == 2) {
                    bankList.result.push({ code: 'no' })
                }
                this.setState({
                    isDepositLock: data.isDepositLock,
                    isWithdrawalLock: data.isWithdrawalLock,
                    // Bank: bankList,
                })
            }).catch(error => {
            //Toast.hide();

        })
    }

    //獲取銀行數據
    GetPaymentFirst(type) {
        fetchRequest(ApiPort.Payment + '?transactionType=deposit&', 'GET')
            .then(data => {
                storage.save({
                    key: 'Bank', // 注意:请不要在key中使用_下划线符号!
                    id: 'BankData', // 注意:请不要在id中使用_下划线符号!
                    data: data,
                    expires: 1000 * 1200 * 24,
                });

                let bankList = data;
                bankList.result = bankList.result.filter(v => availablePaymentMethods.includes(v.code))

                console.log(bankList.result)
                if (bankList.result.length % 3 == 2) {
                    bankList.result.push({ code: 'no' })
                }
                console.log(bankList)
                this.setState({
                    isDepositLock: data.isDepositLock,
                    isWithdrawalLock: data.isWithdrawalLock,
                    // Bank: bankList,
                })

                let GETBank = data.result
                let BCBOx;
                let BCTypeS;

                let GETBank_Copy = GETBank.slice();
                
                this.setState({
                    BCTypeXS: BCTypeS,
                    BCType: BCTypeS,
                    BCDB: BCBOx,
                    Bank: GETBank_Copy
                })

                console.log(data, 'AAAA11111')
                this.BankClick(GETBank[0].code, GETBank[0].name) //222銀行規則
                // if (type == 'CTC') {
                //     this.BankClick('CTC', '加密货币')
                // } else {
                //     this.BankClick(GETBank[0].code, GETBank[0].name) //222銀行規則
                // }

            }).catch(error => {
            //Toast.hide();

        })
    }
    
    //跳轉
    navigateToScene(key) {
        Actions[key]({});
    }
    //拿優惠
    Bonus(key) {
        //Toast.loading('加载優惠中,请稍候...',200);
        if (this.state.BonusData) { return -1 }
        fetchRequest(ApiPort.Bonus + '?transactionType=Deposit&wallet=' + key + '&', 'GET')
            .then(data => {
                // console.log(data,'AWV')
                //	Toast.hide();

                const Bonus = data.map(function (item, key) {
                    return { value: item.id, label: item.title, bonusCouponID: item.bonusCouponID }
                });

                this.setState({
                    Bonus,
                    BonusData: data,
                }, () => {
                    this.initBonus()
                })

            }).catch(error => {
            //	Toast.hide();

        })
    }

    // 拿到优惠数据后,初始化优惠
    initBonus() {
        const { initProps } = this.props
        const { BonusData } = this.state
        if (initProps && initProps.initBonusId) {
            // 有默认的优惠ID
            // 拿到该优惠在优惠列表中的顺序
            const pos = BonusData.map(item => item.id).indexOf(initProps.initBonusId);

            if (parseInt(pos) > 0) {
                this.setState({
                    defaultLabel: BonusData[pos].title
                })
                this.BonusButton(pos)
            }

        }
        this.getpromotionDetailPromotionId()
    }

    getpromotionDetailPromotionId() {
        const { Bonus } = this.state
        let promotionDetailPromotionId = this.props.data.promotionDetailPromotionId * 1
        if (promotionDetailPromotionId) {
            let BonusItemIndex = Bonus.findIndex(v => v.value * 1 === promotionDetailPromotionId)
            console.log(promotionDetailPromotionId, BonusItemIndex)
            if (BonusItemIndex > -1) {
                this.BonusButton(BonusItemIndex)
                const defaultLabel = Bonus[BonusItemIndex].label
                this.setState({
                    defaultLabel
                })
            }
        }
    }

    //優惠檢測
    onChange = (i, key, money) => {
        if (i) {
            this.setState({
                ID: i,
                bonusCouponID: key != undefined ? key : this.state.bonusCouponID,
            });
        }
        let isd = i && i || this.state.ID;
        if (isd == 0) { return }
        // this.CheckDP(money);


        let data = {
            "transactionType": "deposit",
            "bonusId": i ? i : this.state.ID,
            "amount": money ? money : this.state.payMoney,
            "wallet": this.state.depositingWallet,
            "couponText": "string"
        }



        //Toast.loading('检测优惠中,请稍候...',200);
        fetchRequest(ApiPort.BonusCalculate, 'POST', data)
            .then(data => {
                if (data.previewMessage != "") {
                    //Toast.success(data.previewMessage, 3);
                    this.setState({
                        BonusMSG: data.previewMessage,
                    })
                } else if (data.errorMessage != "") {
                    //Toast.fail(data.errorMessage, 3);
                    this.setState({
                        BonusMSG: data.errorMessage,
                    })
                }


                this.CheckDP();

            }).catch(error => {
            //		Toast.hide();
            //Toast.fail(data.errorMessage, 2);
        })
    };




    //檢測支付渠道 最小最大金額
    checkAgn(key, Nowname) {
        // 设置快速充值的金额列表
        //  console.log(key,Nowname,'QQQQQQQ')

        const { NowBankType, paymentchannelEND } = this.state;
        console.log('checkAgn-----------------------------------------------------------')
        console.log('NowBankType '+NowBankType)
        console.log('paymentchannelEND '+paymentchannelEND)
        let typeS = key ? key : paymentchannelEND
        let isMobile = true
        if (key == "BC") {
            isMobile = false
            // if (this.state.BCTypeXS == false) {
            //     this.BCBankClick(false);
            //     return;
            // }
        }


        this.Bonus(this.state.depositingWallet)


        this.setState({
            BCType: false,
            okCanPay: false,
        })

        //isMobile   判斷是不是 手機版 ,不是要寫false
        Toast.loading('กำลังโหลด...', 6);
        console.log('details 1')
        console.log('key'+key)
        fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=' + NowBankType + '&MethodCode=' + typeS + '&isMobile=' + isMobile + '&', 'GET')
            .then(data => {
                console.log(data, '支付渠道A')
                Toast.hide();
                let MaxBax;
                let MinBax;
                // if (key === 'OA'|| key ==='QQ'|| key == 'JDP'|| key == 'BC'|| key == 'BCM'|| key == 'WC') {
                //    this.checkAmount(); //檢測金額  benji
                // }
                this.setState({
                    BankData: data,
                    BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                    BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                    IsAutoAssign: data.setting && data.setting.IsAutoAssign,
                })


                if (this.state.NowBankType === 'LB') {
                    if (data.bankAccounts.length > 0) {
                        console.log('data.bankAccounts.length > 0')
                        //略過相同名的bank
                        const deleteSamebank = data.bankAccounts.filter((item, index, arr) => {
                            return arr.findIndex(s => item.BankName === s.BankName) === index;
                        });          
                        console.log('LB getPaymentMethodDetails的bank ======',deleteSamebank);
                        let userB = deleteSamebank.map(function (item, key) {
                            return {
                                value: item.BankName, // 银行
                                label: item.BankName,
                                AccountNo: item.AccountNo, // 帐号
                                AccountHolderName: item.AccountHolderName, // 帐户名称
                                Province: item.Province,
                                City: item.City,
                                Branch: item.Branch,
                                BankCode: item.BankCode,
                                EnBankName:item.EnBankName,
                            }
                        });

                        this.setState({
                            userBank: userB,
                            userBankD: 0,
                        })
                    } else {
                        this.setState({
                            LBpay: [],
                            userBank: [],
                            userBankD: 0,
                            UserCheackBank: 'ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม',
                        })
                    }
                }


            })
    }

    onVisibleChange() {
        if (!this.state.isFocusedA || this.state.isFocusedA == 'ok') {
            this.setState({ isFocusedA: 'Focus' })
        } else {
            this.setState({ isFocusedA: 'ok' })
        }
    }

    //銀行規則
    BankClick(key, Nowname) {
        // 设置快速充值的金额列表
        console.log(key, Nowname, 'QQQQQQQ')
        const { Bank, paymentchannelEND, BQRcurrentStep } = this.state;
        const Filtercode = Bank.filter(type => type.code == key)

        if (key == 'no') { return }
        const { payMoney2, BankMaxBal, BankMinBal, userNohavename, userName } = this.state;

        /* 用于先取出当前充值方式的  uniqueAmountStatus 类型  用于判断 金额时候为整数 */


        console.log('Filtercode', Filtercode)
        // console.log(Filtercode[0].uniqueAmountStatus,'选择充值后 返回的 整数状态')
        if (Filtercode[0].uniqueAmountStatus) {
            /* 如果为true 所有整数金额的快捷按钮-1 为非整数 */
            this.setState({
                Inttype: true
            })
        } else {
            this.setState({
                Inttype: false
            })
        }
        let isMobile = true
        if (key == "BC") {
            isMobile = false
            // if (this.state.BCTypeXS == false) {
            //     this.BCBankClick(false);
            //     return;
            // }
        }
        if (userNohavename == true) {
            //姓名未验证
            this.checkMember();
        }

        this.Bonus(this.state.depositingWallet)
        // this.GetPaymentReload();

        if (this.state.NowBankType == key) {
            if (this.state.BankData != "") {
                return;   //如果以選中禁止重複請求
            }
        }

        console.log(key, 'piwik check2')
        
        let piwikMsg = key

        switch (key) {
            case 'BC':
                piwikMsg = 'FastBaht'
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_DepositPage')
                break;
            case 'LB':
                piwikMsg = 'Localbank'
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_DepositPage')                
                break;
            case 'CC':
                piwikMsg = 'CashCard'
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_DepositPage')
                break;
            case 'EZP':
                piwikMsg = 'EeziePay'
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_DepositPage')
                break;
            case 'THBQR':
                piwikMsg = 'QRPay'
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_DepositPage')
                break;
            case 'TMW':
                piwikMsg = 'TrueWallet'
                UMonEvent('Deposit Nav', 'Click', piwikMsg + '_Deposit')
                break;
            case 'BQR':
                piwikMsg = 'BankQR'
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_Deposit')
                break;
            case 'RD':
                piwikMsg = 'LBExpress'
                UMonEvent('Deposit Nav', 'Click', piwikMsg + '_DepositPage')
                break;
            default:
                UMonEvent('Deposit Nav', 'View', piwikMsg + '_DepositPage')
                break;
        }


        //支付渠道
        let BoxM = [];
        // BoxM = Filtercode[0].availableMethods.length > 0 && Filtercode[0].availableMethods.map(function (item, key) {
        //          console.log(item.MethodType ,'wwwwww')
        //         if(item.MethodType != 'Default'){
        //             return { value: item.MethodCode, label: item.MethodType }
        //         }

        // });
        
        if (Filtercode[0].availableMethods.length > 0) {
            Filtercode[0].availableMethods.map(function (item, index) {
                if (item && item.MethodType.toUpperCase() != 'DEFAULT') {//針對lb & ezp
                    console.log('不是default 支付渠道 item',item)
                    if(key == 'EZP'){
                        BoxM.push({value: item.MethodType, label: item.MethodType,enLabel:item.MethodCode})
                    }else {
                        BoxM.push({ value: item.MethodCode, label: item.MethodType })
                    }
                    
                }
                else {
                    console.log('支付渠道 item',item)
                }
            });
        }
        // Filtercode[0].availableMethods.length > 0 && Filtercode[0].availableMethods.map(function (item, index) {
        //     if (item && item.MethodType.toUpperCase() != 'DEFAULT') {
        //         BoxM.push({ value: item.MethodCode, label: item.MethodType })
        //     }
        // });
        //支付渠道
        console.log('支付渠道',BoxM)
                
        let method = key

        let BoxMs
        if(key === "LB"){
            BoxMs = BoxM.length > 0 ? BoxM[0].value : 'NormalAmt';
        }else{
            BoxMs = BoxM.length > 0 ? BoxM[0].enLabel : 'DEFAULT';
        }
        // if(this.state.NowBankType=='CTC'&&methodFlag){
        //     BoxMs=methodFlag
        // }
        let pEND
        if(key === "LB"){
            pEND = BoxM.length > 0 ? BoxM[0].value : 'NormalAmt';
        }else{
            pEND = BoxM.length > 0 ? BoxM[0].enLabel : 'DEFAULT';
        }

        this.setState({
            BCType: false,
            okCanPay: false,
            bankNameNow: Nowname,
            AllBankopen: false,
            payMoney: '',  //歸0  金額
            payMoney2: '',  //歸0  金額
            payMoneyBn: '',  //歸0 金額
            userBank: '', //充值銀行
            BonusMSG: '',
            LBpayD: '',
            NowBankType: key,
            UserCheackBank: '',
            MoneyErrorMSG: '',
            NowDataText: '',
            befosDateText: '',
            cardNumber: '',
            cardPIN: '',
            UserNameError: '',
            cardPINSTMsg: '',
            cardNumberSTMsg: '',
            payMoneySTMsg: "",
            paymentchannel: BoxM,//支付渠道選擇  benji
            paymentchannelEND: pEND,
            LBcurrentStep: this.state.historyFast? 2:1,
            THBQR_step_2: false,
            userName:userName,
            //accountNumber:'',
            isSaveBankChecked: false,
            
            // offlineDepositDate: ''
            // curentCTCMethod:methodFlag?methodFlag:BoxM.length > 0&&BoxM[0].value
        })
        //isMobile   判斷是不是 手機版 ,不是要寫false
        Toast.loading('กำลังโหลด...', 6);
        console.log('details 2')        
        fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=' + method + '&MethodCode=' + BoxMs + '&isMobile=' + isMobile + '&', 'GET')
            .then(data => {
                console.log('data--------------',data)
                Toast.hide();
                let MaxBax;
                let MinBax;
                if (key == 'BC') {
                    setTimeout(() => {
                        this.checkAgn(); //檢查渠道 限額
                    }, 600)
                }
                if (key != 'LB' && key != 'BC' && key != 'EZP') {           
                    this.setState({
                        BankData: data,
                        BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                        BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                        IsAutoAssign: data.setting && data.setting.IsAutoAssign,
                    })
                    if(key === 'TMW'){
                        this.setState({
                            Charges: data.setting.Charges,
                        })
                    }
                    if(key === "BQR"){
                        global.localStorage.setItem('userName',userName)
                        
                        if (data.bankAccounts.length > 0) {
                            let userB = data.bankAccounts.map(function (item, key) {
                                return {
                                    value: item.BankName, // 银行
                                    label: item.BankName,
                                    AccountNo: item.AccountNo, // 帐号
                                    AccountHolderName: item.AccountHolderName, // 帐户名称
                                    Province: item.Province,
                                    City: item.City,
                                    Branch: item.Branch,
                                    BankCode: item.BankCode,
                                    EnBankName:item.EnBankName,
                                }
                            });

                            this.setState({
                                userBank: userB
                            })
                            this.setState({
                                userBankD: 0,
                                UserPayAccount: key == 'ALB' ? this.state.userBank[0].BankLogID : 0,
                                LBpayD: data.transferTypes != '' ? 0 : '',
                                // BCBankName:this.state.userBank[0].value,
                                UserCheackBank: this.state.userBank[0].value,
                                SixNumber: this.state.userBank[0].AccountNo.slice(-6),
                                BankData: data,
                                LBBanks: data.banks,
                                BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                                BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                            })
                            console.log('BQR',this.state.userBank[0].value)
                        } else {
                            this.setState({
                                LBpay: [],
                                userBank: [],
                                userBankD: 0,
                                UserCheackBank: 'ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม',
                                BankData: data,
                                LBBanks:data.banks,
                                BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                                BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                            })
                        }
                    }
                    if(key === 'RD'){
                        console.log('RD--------------',data)
                        if(data.bankAccounts.length > 0){
                            console.log('RD有職--------------',data)
                            let userB = data.bankAccounts.map(function (item, key) {
                                return {
                                    value: item.BankName, // 银行
                                    label: item.BankName,
                                    AccountNo: item.AccountNo, // 帐号
                                    AccountHolderName: item.AccountHolderName, // 帐户名称
                                    BankName:item.BankName, // 银行
                                    BankCode:item.BankCode, // 银行code
                                }
                            });
                            this.setState({
                                userBank: userB,
                                returnEmpty:false
                            })
                            this.setState({
                                userBankD: 0,
                                UserPayAccount: key == 'ALB' ? this.state.userBank[0].BankLogID : 0,
                                LBpayD: data.transferTypes != '' ? 0 : '',
                                RDBankName:this.state.userBank[0].AccountHolderName,
                                RDBankAcc:this.state.userBank[0].AccountNo,
                                RDBank:this.state.userBank[0].BankName,
                                RDCode:this.state.userBank[0].BankCode,
                                UserCheackBank: this.state.userBank[0].value,
                                SixNumber: this.state.userBank[0].AccountNo.slice(-6),
                                BankData: data,
                                LBBanks: data.banks,
                                BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                                BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                            })              
                            this.BankAccountGet()
                        }else{
                            console.log('RD沒職--------------',data)
                            this.setState({
                                returnEmpty:true,
                                LBpay: [],
                                userBank: [],
                                userBankD: 0,
                                UserCheackBank: 'ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม',
                                BankData: data,
                                LBBanks:data.banks,
                                BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                                BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                            })
                        }
                        
                        
                    }
                } else if (key == 'BC' || key == 'EZP') {
                    console.log('bc!!!')
                    let dataBox;
                    let MaxBax;
                    let MinBax;
                    dataBox = data.banks.map(function (item, key) {
                        return { value: item.Code, label: item.Name }
                    });
                    this.setState({
                        userBankD: 0,
                        userBank: dataBox != '' ? dataBox : '',
                        BCBankName: dataBox != '' ? dataBox[0].value : '',
                        BankData: data,
                        UserCheackBank: dataBox != '' && dataBox[0].value || '',
                        BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                        BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                        cryptoType: data.banks.length == 1 ? data.banks[0].value : null
                        //BCType: data.banks != '' ?false:'',
                    }, () => {
                        // dataBox != '' && this.randomBank();
                    })

                    MaxBax = data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString()
                    MinBax = data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString()
                    this.setState({
                        payMoney2: '自定义金额, 范围:' + MinBax + ' ~ ' + MaxBax ,
                    })
                } else {
                    if (data.bankAccounts.length > 0) {
                        if(key === 'LB'){
                            console.log(' LB data.bankAccounts.length>0 =========')
                            //略過相同名的bank
                            const deleteSamebank = data.bankAccounts.filter((item, index, arr) => {
                                return arr.findIndex(s => item.BankName === s.BankName) === index;
                            });          
                            console.log('LB getPaymentMethodDetails的bank ======',deleteSamebank);
              
                            let userB = deleteSamebank.map(function (item, key) {
                                return {
                                    value: item.BankName, // 银行
                                    label: item.BankName,
                                    AccountNo: item.AccountNo, // 帐号
                                    AccountHolderName: item.AccountHolderName, // 帐户名称
                                    Province: item.Province,
                                    City: item.City,
                                    Branch: item.Branch,
                                    BankCode: item.BankCode,
                                    EnBankName:item.EnBankName,
                                }
                            });

                            this.setState({
                                userBank: userB
                            })
                        } else {
                            let userB = data.bankAccounts.map(function (item, key) {
                                return { value: item.BankName, label: item.BankName }
                            });

                            this.setState({
                                userBank: userB,
                                userBankD: 0,
                                LBBanks: data.banks,
                            })
                        }
                        let asdarr = [];
                        data.transferTypes.forEach((item, key) => {
                            if (item.IsActive == true) {
                                asdarr.push({ value: item.Name, label: item.Name })
                            }
                        })
                        this.setState({
                            LBpay: asdarr
                        })
                        console.log(data)
                        this.setState({
                            userBankD: 0,
                            UserPayAccount: key == 'ALB' ? this.state.userBank[0].BankLogID : 0,
                            LBpayD: data.transferTypes != '' ? 0 : '',
                            // BCBankName:this.state.userBank[0].value,
                            UserCheackBank: this.state.userBank[0].value,
                            SixNumber: this.state.userBank[0].AccountNo.slice(-6),
                            BankData: data,
                            LBBanks: data.banks,
                            BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                            BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                            IsAutoAssign: data.setting && data.setting.IsAutoAssign,
                        }, () => {
                            //随机设置银行，
                            // this.randomBank()
                        })

                        if (data.transferTypes.length > 3) {
                            this.setState({
                                LBpayD: ''
                            })
                        }

                    } else {
                        console.log('LB data.bankAccounts.length<0 ===========')
                        this.setState({
                            LBpay: [],
                            userBank: [],
                            userBankD: 0,
                            UserCheackBank: 'ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม',
                            BankData: data,
                            LBBanks:(key === "LB" && data.banks)?data.banks:[],
                            BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                            BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                        })
                    }
                    if(key === "LB" && this.state.isFistEntryFlag){
                        this.checkFP();
                    }
                }


                MaxBax = data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString()
                MinBax = data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString()
                this.setState({
                    payMoney2: '自定义金额, 范围:' + MinBax + ' ~ ' + MaxBax ,
                })


                //this.CheckDP();

            }).catch(error => {
            //Toast.fail('', 2);
        })
    }

    clickLBMB = key => {
        this.setState({LBmemberBanksKey: key})
    }

    //BC銀行規則
    BCBankClick(method) {
        this.Bonus(this.state.depositingWallet)
        this.GetPaymentReload();
        this.setState({
            // bankNameNow: '在线充值',
            AllBankopen: false,
            okCanPay: false,
            payMoney: '',  //歸0  金額
            payMoney2: '',  //歸0  金額
            payMoneyBn: '',  //歸0 金額
            userBank: '', //充值銀行
            NowBankType: method,
            befosDateText: '',
            NowDataText: '',
            cardNumber: '',
            cardPIN: '',
            UserCheackBank: '',
            UserNameError: '',
            cardPINSTMsg: '',
            cardNumberSTMsg: ''
        })
        Toast.loading('กำลังโหลด...', 6);
        //isMobile   判斷是不是 手機版 ,不是要寫false
        console.log('details 3')
        fetchRequest(ApiPort.PaymentDetails + '?transactionType=Deposit&method=' + method + '&isMobile=' + ismobile + '&', 'GET')
            .then(data => {
                Toast.hide();
                let dataBox;
                let MaxBax;
                let MinBax;
                dataBox = data.banks.map(function (item, key) {
                    return { value: item.Code, label: item.Name }
                });
                this.setState({
                    userBankD: 0,
                    userBank: dataBox != '' ? dataBox : '',
                    //    BCBankName: dataBox != '' ? dataBox[0].value : '',
                    BankData: data,
                    BankMaxBal: data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString(),
                    BankMinBal: data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString(),
                    //BCType: data.banks != '' ?false:'',
                }, () => {
                    this.randomBank();
                })

                MaxBax = data.setting ? data.setting.MaxBal.toLocaleString() : data.setting.MaxBal.toLocaleString()
                MinBax = data.setting ? data.setting.MinBal.toLocaleString() : data.setting.MinBal.toLocaleString()
                this.setState({
                    payMoney2: MinBax + ' ~ ' + MaxBax ,
                })
            }).catch(error => {
            //Toast.fail('', 2);
        })
    }



    //付款
    okPayMoney() {
        let ST = this.state;
        let data
        if (ST.BankData.setting) {
            if (ST.payMoney < ST.BankData.setting.MinBal) {
                // 单笔最低存款金额为¥
                Toast.fail('จำนวนเงินขั้นต่ำ฿ ' + ST.BankData.setting.MinBal, 2);
                return;
            } else if (ST.payMoney > ST.BankData.setting.MaxBal) {
                // 单笔最高存款金额为¥
                Toast.fail('จำนวนเงินสูงสุด฿ ' + ST.BankData.setting.MaxBal, 2);
                return;
            }
        } else {
            if (ST.payMoney < ST.BankData.setting.MinBal) {
                //单笔最低存款金额为¥
                Toast.fail('จำนวนเงินขั้นต่ำ฿ ' + ST.BankData.setting.MinBal, 2);
                return;
            } else if (ST.payMoney > ST.BankData.setting.MaxBal) {
                //单笔最高存款金额为¥
                Toast.fail('จำนวนเงินสูงสุด฿ ' + ST.BankData.setting.MaxBal, 2);
                return;
            }
        }
        console.log('okPayMoney ST.lbRechargeMethod',ST.lbRechargeMethod,ST.LBcurrentStep)
        // LB normal方法到第二頁
        if(ST.NowBankType === "LB" && ST.LBcurrentStep === 1 && ST.lbRechargeMethod === 0){
            UMonEvent('Deposit', 'Click', 'Step1Confirm_LocalBank')
            console.log('LB normal方法到第二頁 ========')     
            this.GetDAByAmount()//獲取銀行信息       
            return           
        }

        if (ST.userNohavename == true) {
            this.checkMember();
            return;
        }



        data = {
            "language": "th-th",
            "paymentMethod": ST.NowBankType,
            "charges": 0,
            "amount": ST.payMoney,
            "transactionType": "Deposit",
            "domainName": "JBOnative://",
            "isMobile": true,
            "isSmallSet": false,
            "bonusId": ST.ID,
            "mgmtRefNo": "JBOMobileApps",
            "successUrl": "JBOnative://",
            "depositingWallet": ST.depositingWallet,  //目標帳戶
            'isPreferredWalletSet': ST.isPreferredWalletSet, // 是不是首選帳戶
            "blackBoxValue": Iovation,
            "e2BlackBoxValue": E2Backbox,
        }

        if (ST.NowBankType == "BC" ||
            ST.NowBankType == "EZP" ||
            ST.NowBankType == "PS") {
            data = {
                "bankName": ST.BCBankName,   //充值銀行
                "language": "th-th",
                "paymentMethod": ST.NowBankType,//BC (桌面CDC 高额支付)
                "charges": 0,
                "amount": ST.payMoney,
                "transactionType": "Deposit",
                "domainName": "JBOnative://",
                "isMobile": false,
                "isSmallSet": false,
                "bonusId": ST.ID,
                "mgmtRefNo": "JBOMobileApps",
                "successUrl": "JBOnative://",
                "depositingWallet": ST.depositingWallet,  //目標帳戶
                'isPreferredWalletSet': ST.isPreferredWalletSet, // 是不是首選帳戶
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }
        }

        if (ST.NowBankType == "CC") {

            if (ST.cardNumber == '') {
                Toast.fail('请填写卡号', 2);
                return;
            }

            if (ST.cardPIN == '') {
                Toast.fail('请填写密码', 2);
                return;
            }

            data = {
                "cardNumber": ST.cardNumber,
                "cardPIN": ST.cardPIN,
                "language": "th-th",
                "paymentMethod": "CC",
                "charges": 0,
                "amount": ST.payMoney,
                "transactionType": "Deposit",
                "domainName": "JBOnative://",
                "isMobile": true,
                "isSmallSet": false,
                "bonusId": ST.ID,
                "mgmtRefNo": "JBOMobileApps",
                "successUrl": "JBOnative://",
                "depositingWallet": ST.depositingWallet,  //目標帳戶
                'isPreferredWalletSet': ST.isPreferredWalletSet, // 是不是首選帳戶
                "refNo": ST.cardNumber,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
            }

        }

        if (ST.NowBankType == "LB") {   //本銀/支付寶轉帳 
            if (ST.userBank.length == 0) {
                console.log('LB最終提交失敗,因為沒有bankaccount!!========================================================')
                Toast.fail('');
                return;
            }

            if (ST.lbRechargeMethod === 0 && ST.LBpayD === '') {
                Toast.fail('เลือกช่องทางการโอน', 2);
                return;
            }

            let BaDB = ST.BankData.bankAccounts[ST.userBankD]  //獲取BankAccounts 數據
            console.log('BaDB',BaDB,ST.passAcc)

            let Bapay = {
                "ID": 27,
                "Sorting": 2,
                "Name": "LocalBank",
                "CurrencyCode": "THB",
                "Code": "LocalBank",
                "IsActive": true
            }
            console.log(ST.paymentchannelEND)
            data = {
                "depositingBankAcctNum": 
                    ST.SixNumber ? 
                    (ST.lastSixNumber != "" ? 
                        ST.lastSixNumber : 
                            ST.BankData.setting.MethodCode == "UniqueAmt" ?
                                "":
                                    ST.passAcc.substr(ST.passAcc.length - 6) 
                    ): 
                    ST.BankData.setting.MethodCode == "UniqueAmt" ?
                                "":
                                    ST.passAcc.substr(ST.passAcc.length - 6),
                "accountNumber": ST.accountNumber,//BaDB.AccountNo, //付款帳號
                "accountHolderName": ST.userName, //BaDB.AccountHolderName,  // 收款帳戶姓名
                "bankName":  
                    ST.SixNumber ? 
                    (ST.lastSixNumber != '' ? 
                        'ช่องทางพิเศษ' :  //ช่องทางพิเศษ --> 特殊頻道
                            ST.LBBanks[ST.LBBanksKey].Name
                    ) : 
                    ST.LBmemberBanks[ST.LBmemberBanksKey].BankName,
                "bonusId": ST.ID,
                "language": "th-th",
                "city":  ST.SixNumber ? '' : BaDB.City,
                "province":  ST.SixNumber ? '' : BaDB.Province,
                "branch":  ST.SixNumber ? '' : BaDB.Branch,
                "paymentMethod": "LB",
                "charges": 0,
                "amount": ST.payMoney*1,   //錢
                "transactionType": "Deposit",
                "isMobile": true,    //高捷 false   //快捷 true
                "isSmallSet": false,
                "refNo": "0",
                "offlineDepositDate": 
                    ST.BankData.setting.MethodCode == "UniqueAmt" ? 
                    '': 
                    moment(ST.offlineDepositDate).format('YYYY-MM-DD') +
                    ' ' + 
                    ST.offlineDepositHour.toString() + 
                    ':' + 
                    ST.offlineDepositMinute.toString(),
                "mgmtRefNo": "JBOMobileApps",
                "transferType": ST.BankData.transferTypes[ST.LBpayD],
                "offlineRefNo": "0",
                'isPreferredWalletSet': ST.isPreferredWalletSet, // 是不是首選帳戶
                "depositingWallet": ST.depositingWallet,  //目標帳戶
                "fileBytes": ST.avatarSource ? ST.avatarSource.uri : "",
                "fileName": ST.avatarName,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
                //"depositingBankName": BaDB.EnBankName != '' ? BaDB.EnBankName : '',
                "depositingBankName": 
                    ST.SixNumber ? 
                    (ST.lastSixNumber != '' ? 
                        "" : 
                        ST.BankData.setting.MethodCode == "UniqueAmt" ?
                            BaDB.EnBankName:
                                ST.passDepNum
                    ) : 
                    ST.BankData.setting.MethodCode == "UniqueAmt" ?
                        BaDB.EnBankName:
                            ST.passDepNum,// DepositAccountByAmount裡的EnBankName
            }

        }

        if(ST.NowBankType == "BQR") {
            let BaDB = ST.BankData.bankAccounts[ST.userBankD]  //獲取BankAccounts 數據
            console.log('BaDB',BaDB,'ST',ST,ST.LBmemberBanks)
            console.log(ST.paymentchannelEND)
            data = {
                //"depositingBankAcctNum": ST.LBmemberBanks.length == 0 ? BaDB.AccountNo.substr(BaDB.AccountNo.length - 6): BaDB.AccountNo.substr(BaDB.AccountNo.length - 6),
                "depositingBankAcctNum": "",
                "accountNumber": ST.accountNumber,//BaDB.AccountNo, //付款帳號
                "accountHolderName": ST.userName, //BaDB.AccountHolderName,  // 收款帳戶姓名
                "bankName":   ST.LBmemberBanks.length == 0 ? ST.LBBanks[ST.LBBanksKey].Name : ST.LBmemberBanks[ST.LBmemberBanksKey].BankName,
                "bonusId": ST.ID,
                "language": "th-th",
                "paymentMethod": "BQR",
                "charges": 0,
                "amount": ST.payMoney*1,   //錢
                "transactionType": "Deposit",
                "isMobile": true, 
                "isSmallSet": false,
                "refNo": "0",
                "offlineDepositDate": ST.BankData.setting.MethodCode == "UniqueAmt" ? '': moment(ST.offlineDepositDate._d).format('YYYY-MM-DD') + ' ' + ST.offlineDepositHour.toString() + ':' + ST.offlineDepositMinute.toString(),
                "mgmtRefNo": "JBOMobileApps",
                "transferType": ST.BankData.transferTypes[ST.LBpayD],
                "offlineRefNo": "0",
                'isPreferredWalletSet': ST.isPreferredWalletSet, // 是不是首選帳戶
                "depositingWallet": ST.depositingWallet,  //目標帳戶
                "fileBytes": ST.avatarSource ? ST.avatarSource.uri : "",
                "fileName": ST.avatarName,
                "blackBoxValue": Iovation,
                "e2BlackBoxValue": E2Backbox,
                "depositingBankName": BaDB.EnBankName != '' ? BaDB.EnBankName : '' ,
            }
        }


        if (ST.bonusCouponKEY != 0) {
            data.bonusCoupon = ST.bonusCoupon;
        }

        if (ST.paymentchannelEND != "") {
            data.methodcode = ST.paymentchannelEND            
        }

        // if(ST.paymentchannel!= ""){ //查看api,渠道只有LB & EZP有值
        //     if(ST.NowBankType == "EZP"){
        //         data.methodcode = ST.paymentchannel.enLabel
        //     } else {
        //         data.methodcode = ST.paymentchannelEND
        //     }
        // } else {
        //     data.methodcode = ST.paymentchannelEND
        // }

        let piwikMsg = ST.NowBankType
        
        if(ST.NowBankType !== "LB"){
            switch (ST.NowBankType) {
                case 'BC':
                    piwikMsg = 'FastBaht'
                    UMonEvent('Deposit', 'Submit', 'SubmitDeposit_'+piwikMsg)
                    break;
                case 'CC':
                    piwikMsg = 'CashCard'
                    UMonEvent('Deposit', 'Submit', 'SubmitDeposit_'+piwikMsg)
                    break;
                case 'EZP':
                    piwikMsg = 'EeziePay'
                    UMonEvent('Deposit', 'Submit', 'SubmitDeposit_'+piwikMsg)
                    break;
                case 'THBQR':
                    piwikMsg = 'QRPay'
                    UMonEvent('Deposit', 'Submit', 'SubmitDeposit_'+piwikMsg)
                    break;
                case 'TMW':
                    piwikMsg = 'TrueWallet'
                    UMonEvent('Deposit', 'Submit', 'Submit_'+piwikMsg+'_Deposit')
                    break;
                case 'BQR':
                    piwikMsg = 'BankQR'
                    UMonEvent('Deposit', 'Click', 'Step1Confirm_'+piwikMsg)
                    break;
                default:
                    UMonEvent('Deposit', 'Submit', 'SubmitDeposit_'+piwikMsg)
                    break;
            }
        }else{
        }
       

        Toast.loading('กำลังยืนยัน โปรดรอสักครู่', 200);
        fetchRequest(ApiPort.PaymentApplications, 'POST', data)
            .then(res => {
                console.log(res)
                Toast.hide();
                if (res.errorMessage == "很抱歉目前系统正忙碌中。我们建议您更换存款方式或联系在线客服寻求协助") {
                    this.setState({
                        depositPopUpNot: true,
                    })
                    return
                }
                
                if (res.isSuccess == true) {
                    if (ST.NowBankType != "CC" || ST.NowBankType != 'BQR' || ST.NowBankType != "LB") {
                        this.setState({
                            payOK: true,
                            payHtml: res.redirectUrl,
                            LBdata: res,
                        })
                    }
                    if (ST.NowBankType == "CC") {
                        this.setState({
                            payOK: true,
                        })
                        Toast.success('ฝากเงินสำเร็จ', 2);
                        return;
                    }
                    if (ST.NowBankType == 'THBQR') {
                        Actions.depositPageT({
                            data: this.state.payHtml,
                            statedata: this.state
                        });
                        this.setState({
                            THBQR_step_2: true,
                        })
                        return
                    }

                    if (ST.NowBankType == 'BQR') {
                        //虚设銀行指標
                        //True = 是虚设銀行 顯示錯誤彈窗
                        //False = 不是虚设銀行 顯示申請成功
                        if(res.isDummyBank == false){
                            let BaDB = ST.BankData.bankAccounts[ST.userBankD]
                            Actions.BqrTrans({
                                data: res,
                                statedata: res.uniqueAmount,
                                qrcode:res.qrDeepLink,
                                bankName:res.returnedBankDetails.bankName,
                                transactionId:res.transactionId,
                                depositingBankAcctNum: BaDB.AccountNo.substr(BaDB.AccountNo.length - 6)
                            })
                            //global.localStorage.setItem('BQR',true)
                            // 如果有勾选记住我的银行卡
                            if (this.state.isSaveBankChecked == true) {
                                console.log("记住我的银行卡");
                                this.saveBank();
                            }
                            return
                        }else{
                            console.log('”BQR 沒銀行彈窗“popup')
                            this.setState({
                              IsDummy:true//”沒銀行彈窗“popup
                            })
                            return
                        }
                        
                    }

                    if (ST.NowBankType == 'TMW') {
                        Actions.depositPageT({
                            data: this.state.payHtml,
                            statedata: this.state
                        });
                        return
                    }

                    if (this.state.ID != 0) {
                        if (res.bonusApplicationMessage != '') {
                            Toast.success(res.bonusApplicationMessage, 3);
                        }
                    }
                    setTimeout(() => {
                        {
                            console.log(ST)
                        }
                        if (ST.NowBankType == "LB") {
                            this.setLBMethodStorage(this.state.lbRechargeMethod)
                            {
                                console.log(ST.lbRechargeMethod, ST.LBcurrentStep)
                            }
                            if (ST.lbRechargeMethod == 1 && ST.LBcurrentStep == 1) {
                                console.log('fast pay===== step2')
                                UMonEvent('Deposit', 'Click', 'Step1Confirm_LocalBank')
                                //虚设銀行指標
                                //True = 是虚设銀行 顯示錯誤彈窗
                                //False = 不是虚设銀行 顯示申請成功
                                if(res.isDummyBank== false){
                                    this.setState({
                                        LBcurrentStep: 2,
                                        uniqueAmount: res.uniqueAmount,
                                        NowData: data,
                                        transactionId: res.transactionId,
                                    })
                                }else{
                                    console.log('”沒銀行彈窗“popup')
                                    this.setState({
                                        IsDummy:true//”沒銀行彈窗“popup
                                    })
                                }
                                

                            } else {
                                {
                                    console.log('456')
                                }
                                UMonEvent('Deposit', 'Submit', 'SubmitDeposit_LocalBank')
                                this.setState({
                                    LBcurrentStep: 3,
                                    NowData: data,
                                }, () => this.TimeDown())
                                // 如果有勾选记住我的银行卡
                                if (this.state.isSaveBankChecked == true) {
                                    console.log("记住我的银行卡");
                                    this.saveBank();
                                }
                            }
                        } else {
                            Actions.depositPageT({
                                data: this.state.payHtml,
                                statedata: this.state
                            });
                            return
                        }

                        this.setState({
                            payMoney: '',
                            payMoney2: '自定义金额, 范围:' + ST.BankMinBal + ' ~ ' + ST.BankMaxBal,
                            LBpayD: ST.BankData.transferTypes != '' ? 0 : '',
                            okCanPay: false,
                            cardNumber: '',
                            cardPIN: '',
                            avatarSource: null,
                            avatarName: "",
                        })

                    }, 1000);

                    if (this.props.data.name == "depositT") {
                        GetGameListReload();
                    }
                    ReloadMoneyHome(); //刷新餘額 首頁
                    ReloadMoney();  //刷新餘額
                    //TotalBalGlobe(); //刷新餘額
                } else {
                    let erros = res.errorMessage;
                    //  本充值通道暫時關閉，會員可使用其他充值方式或聯繫客服，不便之處敬請諒解。
                    if (erros.replace(/\s+/g, "") == "ช่องทางฝากนี้งดให้บริการชั่วคราวสมาชิกสามารถใช้ช่องทางการฝากอื่นๆหรือติดต่อฝ่ายบริการลูกค้าขออภัยในความไม่สะดวก") {
                        this.setState({
                            depositPopUpNot: true,
                        })
                        return
                    }
                    if (erros.split("<br/>")[0] == "ยอดฝากซ้ำ") {
                        // 金额重复，请输入其他金额
                        Toast.fail("ยอดซ้ำกัน กรุณากรอกยอดอื่น", 3);
                        return;
                    }
                    console.log(res.errorMessage, 'res.errorMessage')
                    Toast.fail(res.errorMessage);
                }
            }).catch(error => {
            console.log(error)
            Toast.hide();

        })
    }

    lbFastStepOne = () => {
        // lb fast方式第一步驟
        return (this.state.lbRechargeMethod == 0 || this.state.lbRechargeMethod == 1 && this.state.LBcurrentStep != 2)
    }

    // 记住我的银行卡
    saveBank() {
        let st = this.state;
        let data = {
            accountNumber: st.accountNumber,
            accountHolderName: st.userName,
            bankName: st.LBBanks[st.LBBanksKey].Name,
            city: "",
            province: "",
            branch: "",
            type: "D",
            isDefault: true
        };
        fetchRequest(ApiPort.MemberBanks + "?", "POST", data)
            .then(data => {
                if (data.isSuccess == true) {
                    this.BankAccountGet();
                } else {
                    Toast.fail(data.message, 2);
                }
            })
            .catch(() => {
                Toast.hide();
            })
            .finally(() => {
                this.setState({
                    userName: "",
                    accountNumber: "",
                    isSaveBankChecked: false
                });
            });
    }



    okPayFPMoney = () => {
        let ST = this.state;
        console.log(ST)

        if(ST.fastMoneyNoticeShow) return

        if (ST.NowBankType == "LB") {

            let BaDB = ST.BankData.bankAccounts[ST.userBankD]  //獲取bankAccounts 數據
            let Bapay = ST.BankData.transferTypes[ST.LBpayD]
            let sixNumStr = this.state.lastSixNumber.toString();
            let bankN = ST.userBank[ST.userBankD].EnBankName
            //ช่องทางพิเศษ-->special channel
            data = {
                "id": ST.transactionId,
                "CurrencyCode":'THB',
                "depositingBankAcctNum": sixNumStr.length === 6 ? (ST.lastSixNumber != '' ? ST.lastSixNumber : "") : "",
                "fileBytes": ST.avatarSource ? ST.avatarSource.uri : "",
                "fileName": ST.avatarName,
                "hasQR":false,
                "offlineDepositDate": new Date(),
                "depositingBankName": !ST.IsAutoAssign? bankN:'',
            }

            if (ST.bonusCouponKEY != 0) {
                data.bonusCoupon = ST.bonusCoupon;
            }
            UMonEvent('Deposit', 'Submit', 'SubmitDeposit_LocalBank')
            fetchRequest(ApiPort.GopayLB+ST.transactionId+'/ConfirmStep?', 'POST',data)
                .then(data => {
                    if(data.isSuccess == true){
                        this.setState({
                            LBcurrentStep: 3
                        },()=>this.TimeDown())
                        this.setLBMethodStorage(this.state.lbRechargeMethod)
                    }else if(data.errorMessage == "ConfirmStep_Failed"){
                        Toast.fail('账号错误,请重新输入', 2);
                    }else{
                        Toast.fail(data.errorMessage, 2);
                    }

                    //Actions.pop();
                }).catch(error => {
                //Toast.hide();

            })

        }
    }
    _dropdown_2_renderButtonText(rowData) {
        return `${rowData.label}`;
    }

    _dropdown_2_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {`${rowData.label}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _dropdown_3_renderRow(rowData, rowID, highlighted) {
        let moneyDB = ''
        if (rowData.value == "MAIN") {
            moneyDB = MAIN
        } else if (rowData.value == "IPSB") {
            moneyDB = IPSB
        } else if (rowData.value == "SLOT") {
            moneyDB = SLOT
        } else if (rowData.value == "CMD") {
            moneyDB = CMD
        } else if (rowData.value == "SB") {
            moneyDB = SB
        } else if (rowData.value == "LD") {
            moneyDB = LD
        } else if (rowData.value == "PT") {
            moneyDB = PT
        } else if (rowData.value == "AG") {
            moneyDB = AG
        }

        let evenRow = rowID % 2;
        return (
            <Flex style={{ width: width - 20, backgroundColor: evenRow ? '#000000' : '#2c2c2c' }}>
                <Flex.Item style={styles.dropdown_2_row}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {`${rowData.label}`}
                    </Text>
                </Flex.Item>
                <Flex.Item alignItems='flex-end' style={[styles.dropdown_2_row, { paddingRight: 10 }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {`${moneyDB}`}
                    </Text>
                </Flex.Item>
            </Flex>
        );
    }


    _dropdown_4_renderRow(rowData, rowID, highlighted) {
        //YPImage
        let imgID = rowData.value
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Image resizeMode='stretch' style={{ width: 90, height: 30 }}></Image>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {`${rowData.label}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _dropdown_5_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {`${rowData.Name}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _dropdown_6_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {rowData.label == 'ฝากเข้าบัญชีธนาคารอื่นๆ' ?
                            rowData.label
                            :`${rowData.label}-${rowData.AccountNo.slice(-6)}`
                        }
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }


    _dropdown_7_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        console.log(rowData)
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {rowData.BankName}-{rowData.AccountNumber.slice(-6)}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _dropdown_8_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        console.log(rowData)
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {rowData.BankName}&nbsp;{rowData.AccountNumber.slice(-6)}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }



    _dropdown_Bouns_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <Flex style={{ width: width - 30, }}>
                <Flex.Item style={[styles.dropdown_Bonus_row, { flex: 1, paddingLeft: 14, paddingTop: 10, backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_Bonus_row_text, highlighted && { color: '#fff' }]}>
                        {`${rowData.label}`}
                    </Text>
                </Flex.Item>
            </Flex>
        );
    }

    _dropdown_9_renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        console.log(rowData)
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
                    <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
                        {rowData.label == 'ฝากเข้าบัญชีธนาคารอื่นๆ' ?
                            rowData.label
                            :`${rowData.label}}`
                        }
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    toWallet = (key) => {  //目標帳戶
        this.setState({
            depositingWallet: this.state.toWalletA[key].value,
            toWallet: this.state.toWalletA[key].label,
        });
        this.Bonus(this.state.toWalletA[key].value);
    };


    LBpayD = key => {
        console.log(key)
        this.setState({
            LBpayD: key,
        });

        this.state.LBpayD = key
        this.CheckDP();
    };

    LBBanksClick = (key) => {
        this.setState({
            LBBanksKey: key,
        });
    };

    NowData = (key) => {
        this.setState({
            NowDataText: this.state.NowData[key]
        }, () => { this.CheckDP() })
    }

    BonusButton = (key) => {
        // console.log('asdasdasda',key)
        let d = this.state.BonusData[key];
        this.setState({
            bonusCouponKEY: this.state.BonusData[key].bonusCouponID
        })
        if (d.id == 0) {
            this.setState({
                BonusMSG: '',
                ID: 0,
            })
        } else {
            this.onChange(d.id, d.bonusCouponID)
        }
    }


    BCBankTG = (key) => {     //只給bc 高額用
        console.log(this.state.userBank[key].value)
        this.setState({
            BCBankName: this.state.userBank[key].value
        })

    }

    openLiveChat() {
        Actions.LiveChatST();
        this.setState({ depositPopUpNot: false })
    }

    OpenDPmenu() {
        this.setState({
            OpenDPmenu: this.state.OpenDPmenu == false ? true : false
        })
    }
    //随机选择银行
    randomBank() {
        const { NowBankType, userBank, BCType } = this.state;
        const le = userBank.length;
        const num = Math.floor(Math.random() * le);
        if (NowBankType == 'BC') {
            this.setState({
                BCBankName: userBank[num].value
            })
        }
    }

    //金额格式验证
    payMoneyST(type) {
        const { BankMaxBal, BankMinBal, NowBankType, payMoney, Bank } = this.state;


        let MoneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
        let MoneyRegEnd = /[1-9]$/;//结尾不能为0
        console.log(payMoney)
        if (payMoney) {
            const Filtercode = Bank.filter(type => type.code == NowBankType);

            if(this.state.NowBankType === "EZP"){

            }

            if(this.state.NowBankType === "BQR") {
                if (!MoneyReg.test(payMoney)) {
                    console.log(1)
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: 'รูปแบบของจำนวนเงินไม่ถูกต้องอนุญาตให้ใช้ทศนิยมได้ไม่เกิน 1 ถึง 2!',
                    })
                } else if (Filtercode[0].uniqueAmountStatus && !MoneyRegEnd.test(payMoney)) {
                    console.log(2)
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: 'จำนวนเงินต้องลงท้ายด้วย "1-9"',
                    })
                } else if(Number(payMoney) < Number(BankMinBal.replace(/,/g, ""))){
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: `จำนวนเงินขั้นต่ำ ฿ ${BankMinBal}`,
                    })
                } else if(Number(payMoney) > Number(BankMaxBal.replace(/,/g, ""))){
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: `จำนวนเงินขั้นต่ำ ฿ ${BankMaxBal}`,
                    })
                } else {
                    this.setState({
                        okCanPay: false,
                        payMoneyST: true,
                        payMoneySTMsg: "",
                    })
                }
            } else {
                if (!MoneyReg.test(payMoney)) {
                    console.log(1)
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: 'รูปแบบของจำนวนเงินไม่ถูกต้องอนุญาตให้ใช้ทศนิยมได้ไม่เกิน 1 ถึง 2!',
                    })
                } else if (Filtercode[0].uniqueAmountStatus && !MoneyRegEnd.test(payMoney)) {
                    console.log(2)
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: 'จำนวนเงินต้องลงท้ายด้วย "1-9"',
                    })
                } else if (Number(payMoney) < Number(BankMinBal.replace(/,/g, ""))) {
                    console.log(3)
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: 'จำนวนเงินขั้นต่ำ：' + BankMinBal ,
                    })
                } else if (Number(payMoney) > Number(BankMaxBal.replace(/,/g, ""))) {
                    console.log(4)
                    this.setState({
                        payMoneyST: false,
                        payMoneySTMsg: 'จำนวนเงินสูงสุด：' + BankMaxBal ,
                    })
                } else {
                    console.log(5)
                    this.setState({
                        okCanPay: false,
                        payMoneyST: true,
                        payMoneySTMsg: '',
                    })
                }
            }

            
        } else {
            console.log(6)
            this.setState({
                payMoneyST: false,
                payMoneySTMsg: 'กรุณาใส่จำนวนเงิน'
            })
        }
        setTimeout(() => {
            this.CheckDP()
        }, 500);
    }


    // 點擊其他支付方式的按鈕
    onPaymentMethodChange = key => {
        console.log(key)
        console.log(this.state)
        this.setState({
            // paymentchannelEND: 'NormalAmt',
            okCanPay: false,
            // payMoney: '',  //歸0  金額
            // payMoney2: '',  //歸0  金額
            // payMoneyBn: '',  //歸0 金額
            // userBank: '', //充值銀行
            lbRechargeMethod: 0,
            LBcurrentStep: 2,
            changeWord: true,
            isOtherAcc: true
        })

        setTimeout(() => {
            this.CheckDP()
            this.checkAgn('NormalAmt');
        }, 600)
    }

    paymentchannelDWButton = (key) => {     //只給支付渠道用

        console.log(key)
        console.log(this.state)
        if(this.state.NowBankType == 'LB'){
            this.setState({
                paymentchannelEND: this.state.paymentchannel[key].value,
                okCanPay: false,
                payMoney: '',  //歸0  金額
                payMoney2: '',  //歸0  金額
                payMoneyBn: '',  //歸0 金額
                userBank: 0, //充值銀行
    
    
            })
    
            setTimeout(() => {
                this.CheckDP()
                this.checkAgn(this.state.paymentchannel[key].value);
            }, 600)
        } else{
            this.setState({
                paymentchannelEND: this.state.paymentchannel[key].enLabel,
                okCanPay: false,
                payMoney: '',  //歸0  金額
                payMoney2: '',  //歸0  金額
                payMoneyBn: '',  //歸0 金額
                // userBank: '', //充值銀行
    
    
            })
    
            setTimeout(() => {
                this.CheckDP()
                this.checkAgn(this.state.paymentchannel[key].enLabel);
            }, 600)
        }



        console.log(this.state.paymentchannel[key].value, 'R1111')

    }

    //卡号验证
    cardNumST() {
        const cardNumberReg = /^[0-9]{16}$/;
        //卡号
        if (!this.state.cardNumber) {
            this.setState({
                cardNumberST: false,
                cardNumberSTMsg: 'กรุณากรอก S/N',
            })
        } else if (!cardNumberReg.test(this.state.cardNumber)) {
            this.setState({
                cardNumberST: false,
                cardNumberSTMsg: 'รูปแบบไม่ถูกต้อง',
            })
        } else {
            this.setState({
                cardNumberST: true,
                cardNumberSTMsg: '',
            })
        }
        setTimeout(() => {
            this.CheckDP()
        }, 500);
    }
    //安全码验证
    cardPINST() {
        const passwordTReg = /^[0-9]{4,16}$/;
        //卡号
        if (!this.state.cardPIN) {
            //安全码
            this.setState({
                cardPINST: false,
                cardPINSTMsg: 'กรุณากรอก PIN',
            })
        } else if (!passwordTReg.test(this.state.cardPIN)) {
            this.setState({
                cardPINST: false,
                cardPINSTMsg: 'รูปแบบไม่ถูกต้อง',
            })
        } else {
            this.setState({
                cardPINST: true,
                cardPINSTMsg: '',
            })
        }
        setTimeout(() => {
            this.CheckDP()
        }, 500);
    }
    //用户名验证
    userNameST() {
        //return value.replace(/[^a-zA-Z \u0E00-\u0E7F\ ]/g,'')
        const nameTest = /^[a-zA-Z\u0E00-\u0E7F ]{2,50}$/;
        if (!nameTest.test(this.state.userName)) {
            this.setState({
                userNameST: false,
                UserNameError: 'รรูปแบบไม่ถูกต้อง(นามสกุลจะต้องมีอักษรระหว่าง2-50ตัวอักษร และเป็นภาษาไทยเท่านั้นด！',
            })
        } else {
            this.setState({
                userNameST: true,
                UserNameError: ''
            })
        }
        setTimeout(() => {
            this.CheckDP();
        }, 500);
    }

    CheckDP() {
        let newQr = global.localStorage.getItem('newName')
        const { payMoneyST, cardNumberST, cardPINST, NowDataText, userNameST, NowBankType, userName } = this.state;
        let ST = this.state;
        console.log('ST====================',ST,newQr)
        //本银，支付宝转账，微转账没有收款银行不能充值
        if ((ST.NowBankType == "LB") && ST.userBank.length == 0) {
            console.log('本银没有收款银行======')
        //     console.log(8)
        //     Toast.fail('กรุณาติดต่อฝ่ายบริการลูกค้าเพื่อเพิ่มวิธีการฝากเงิน', 3);
             this.setState({ okCanPay: false })
            return;
        }
        // if(ST.NowBankType == "BC" && ST.userBank.length == 0) {
        //     Toast.fail('该充值方式请联系联系客服添加', 3);
        //     this.setState({ okCanPay:false })
        //     return;
        // }

        if (ST.NowBankType == "CC") {
            if (payMoneyST && cardNumberST && cardPINST) {
                this.setState({okCanPay: true})
            } else {
                this.setState({okCanPay: false})
            }
        } else if((ST.NowBankType == "BQR")&& ST.userBank.length == 0){
            console.log('BQR没有收款银行======')
            this.setState({ okCanPay: false })
            return;
        } else if (ST.NowBankType == "LB") {
            console.log('lb payMoneyST',payMoneyST)
            console.log(ST.LBpayD)
            console.log(userNameST)
            console.log(userName)
            if(ST.LBmemberBanks.length > 0){
                if (payMoneyST && (userNameST || userName || newQr)) {
                    this.setState({okCanPay: true})
                } else {
                    console.log(10)
                    this.setState({okCanPay: false})
                }
            }else {
                if (payMoneyST && (userNameST || userName || newQr)) {
                    this.setState({okCanPay: true})
                } else {
                    console.log(10)
                    this.setState({okCanPay: false})
                }
            }
        } else if (payMoneyST) {
            this.setState({okCanPay: true})
        } else {
            this.setState({okCanPay: false})
        }
    }

    async getPermissions() {

        try {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
            await PermissionsAndroid.request(permission);
            Promise.resolve();

            setTimeout(() => {
                this.refs.viewShot.capture().then(
                    uri => this.SaveQrCode(uri),
                    error => Toast.fail(error)
                );
            }, 1000)
        } catch (error) {
            Promise.reject(error);

        }
    }



    saveImg(img) {

        if (Platform.OS == "android") {
            this.getPermissions();
        } else {
            this.refs.viewShot.capture().then(
                uri => this.SaveQrCode(uri),
                error => Toast.fail(error)
            );
        }

    }



    SaveQrCode(uri) {
        let promise = CameraRoll.saveToCameraRoll(uri)


        promise.then((result) => {
            this.setState({
                QRCODE: '',
                ALBPOP: false,
            })
            Toast.success('二维码已下载', 4);

            setTimeout(() => {

                if (Platform.OS === "android") {
                    Linking.canOpenURL('alipays://').then(supported => { // weixin://  alipay://

                        if (supported) {
                            Linking.openURL('alipays://platformapi/startapp?saId=10000007');
                            //Linking.openURL('alipay://platformapi/startapp?saId=10000007');
                        }
                    });

                } else {
                    Linking.canOpenURL('alipay://').then(supported => { // weixin://  alipay://
                        if (supported) {
                            Linking.openURL('alipay://platformapi/startapp?saId=10000007');
                            //Linking.openURL('alipay://platformapi/startapp?saId=10000007');
                        }
                    });

                }

            }, 1000)
            setTimeout(() => {

                this.setState({
                    PayAready: true,
                })

            }, 3000)

        }).catch((error) => {
            this.setState({
                QRCODE: '',
                ALBPOP: false
            })

            setTimeout(() => {
                let errorMsg = Platform.OS == "ios" ? '请在iPhone的“设置-隐私-照片” 中允许访问照片' : '请在Android的“设置 - 应用管理 - 竞博JBO - 应用权限”中允许 访问相机'
                Alert.alert('二维码保存失败', errorMsg,
                    [{ text: "显示银行账户", onPress: this.OpenLB.bind(this) }]
                );
            }, 500)

        });

    }



    OpenLB(type) {
        const { LBdata, NowData } = this.state;
        if (type) {
            Actions.depositPageLB({ data: this.state, LBdata: LBdata, NowData: NowData, QRCODE: true });
        } else {
            Actions.depositPageLB({ data: this.state, LBdata: LBdata, NowData: NowData, QRCODE: false });
        }

        this.setState({
            QRCODE: '',
            ALBPOP: false
        })
    }

    CopyText(Text){
        const { NowBankType } = this.state;
        if(NowBankType == 'RD'){
            Clipboard.setString(Text+'')
            this.setState({
                showDone:true
            },()=>{
                setTimeout(() => {
                    this.setState({
                        showDone:false,
                    })
                }, 3000)
           })
        }else {
            Clipboard.setString(Text+'')
            Toast.success('คัดลอกแล้ว',0.2)
        }
        

    }

    GotoVerifie() {
        this.setState({optModal:false})
        this.props.checkcallback("records");
        // window.optVerify=false
        Actions.OptVerify();
    }
    /**
     * 获取用户添加过的银行卡数据
     */
    BankAccountGet() {
      
        fetchRequest(`${ApiPort.MemberBanks}AccountType=Deposit&`, "GET")
            .then(data => {
                console.log('MemberBank data',data)
              
                // data = [{"IIDD":"18901832-b680-4490-9757-ef1a3b6170d1","Code":"324958","Name":"ธนาคารกรุงไทย-1111111111111","BankAccountID":324958,"MemberCode":"rbth6TYVLW34P","AccountHolderName":"Lucky Strike","AccountNumber":"1111111111111","BankName":"ธนาคารกรุงไทย","BankNameEn":"ธนาคารกรุงไทย","BankNameLocal":"ธนาคารกรุงไทย","Province":"","City":"","Branch":"","SWIFTCode":"","BankAddress":"","BankTelNo":"","CurrencyCode":"","UpdateBy":"rbth6TYVLW34P","UpdateAt":"2020-01-13T16:27:11.39","NationID":0,"IsChineseBank":false,"IsDefault":true,"Type":"D","IsActive":true,"IsVerify":false,"IsReachThreshold":false,"IsPopup":true}]
                // ;

                //TODO
                // data=[]

                if(this.state.NowBankType == 'RD'){
                    if (data.length > 0) {
                        console.log('MemberBank data> 0',data)
                        const banks = this.reverBank(data);
                        let IsDefault = data.find(v => v.IsReverseDeposit)
                        
                        let defaultBank = IsDefault ? IsDefault : data[0]
                        let index = data.findIndex(v => v.IsReverseDeposit)
                        let LBmemberBanksKey = index >= 0 ? index : 0
                        console.log('defaultBank',defaultBank)
                        this.setState({
                            userName: defaultBank.AccountHolderName,
                            LBmemberBanksKey,
                            accountNumber: defaultBank.AccountNumber,
                            LBmemberBanks: data,
                            LBMemberBankName: defaultBank.BankNameLocal,
                            NewsCard: false,
                            bindAlready: defaultBank.IsReverseDeposit == true ? true : false, //綁沒綁定充值銀行
                            nobank:false,
                            banks,
                        })
                        
                    } else {
                        console.log('MemberBank data< 0',data)
                        this.setState({
                            // bankAccountType: true,
                            // setDefaultBank: true,
                            LBmemberBanks: [],
                        })
                    }
                }else {
                    if (data.length) {
                        let IsDefault = data.find(v => v.IsDefault)
                        let defaultBank = IsDefault ? IsDefault : data[0]
                        let index = data.findIndex(v => v.IsDefault)
                        let LBmemberBanksKey = index >= 0 ? index : 0
                        this.setState({
                            userName: defaultBank.AccountHolderName,
                            LBmemberBanksKey,
                            accountNumber: defaultBank.AccountNumber,
                            LBmemberBanks: data,
                            LBMemberBankName: defaultBank.BankName,
                            NewsCard: false,
                        })
                    } else {
                        this.setState({
                            // bankAccountType: true,
                            // setDefaultBank: true,
                            LBmemberBanks: []
                        })
                    }
                }
                
                

                /////
            })
            .catch(error => {
                //Toast.hide();
                console.log("MemberBanks", error);
            });
    }

/**
   * 確認添加後,跳轉頁面回到充值頁,
   * 請求bankaccoundID,並呼叫MemberBanks 綁定添加的帳戶！！
   */     
    getBankList() {
       
        fetchRequest(`${ApiPort.MemberBanks}AccountType=Deposit&`, "GET")
        .then(data => {
            if (data.length) {
            
                const banks = this.reverBank(data);
                //const banks = this.adjustBanks(data);
                console.log('refresh after bank account added!!!',data,banks)
                let IsDefault = data.find(v => v.IsDefault)
                let defaultBank = IsDefault ? IsDefault : data[0]
                let index = data.findIndex(v => v.IsDefault)
                let LBmemberBanksKey = index >= 0 ? index : 0
                // let isHaveBankImg = bankIcons.find(
                //      v => v.bankChineseName === this.state.RDCode//背景顏色與銀行icon 需等於公司收款帳號的銀行名
                // );
                // console.log('isHaveBankImg',isHaveBankImg)//#368EE8
                this.setState({
                    userName: defaultBank.AccountHolderName,
                    LBmemberBanksKey,
                    accountNumber: defaultBank.AccountNumber,
                    LBmemberBanks: data,
                    LBMemberBankName: defaultBank.BankName,
                    NewsCard: false,
                    banks,
                    //beenReverse:defaultBank,
                    //isHaveBankImg:isHaveBankImg,
                },()=>this.MemberBankReverse(defaultBank.BankAccountID))
            
              
            } else {
                this.setState({
                    // bankAccountType: true,
                    // setDefaultBank: true,
                    LBmemberBanks: [],
                    nobank:true,//no bank data
                })
            }
        })
        .catch(error => {
            //Toast.hide();
            console.log("MemberBanks", error);
        })
        
    }

    MemberBankReverse(data) {
        console.log('data',data)
        let specID = data//獲取被綁定銀行的BankAccountID
       
        Toast.loading('', 200)
        fetchRequest(ApiPort.PUTMemberBankReverse + specID + "/Reverse/Default?", 'PUT').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                //顯示公司銀行Details 裡的bankAccount的公司資料
                this.setState({
                    showSave:true
                  },()=>{
                        setTimeout(() => {
                        this.setState({
                            showSave:false,
                        })          
                        window.reloadAgain && window.reloadAgain()
                    }, 3000)
                  }) 
            } else {
                this.setState({
                    AccountErr:true//添加好银行后 但绑定失败
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    okPutMemberBank (){
        let ST = this.state;
        let specID = ST.banks[0].BankAccountID
        UMonEvent('Deposit Nav', 'Click', 'ViewAccount_LBExpress')
        console.log('okPutMemberBank specID',specID)
        Toast.loading('', 2000)
        fetchRequest(ApiPort.PUTMemberBankReverse + specID + "/Reverse/Default?", 'PUT').then(res => {
            Toast.hide()
            console.log('okPutMemberBank=========',res)
            if (res.isSuccess) {  
                //顯示公司銀行Details 裡的bankAccount的公司資料
                this.setState({
                    showSave:true
                  },()=>{
                        setTimeout(() => {
                        this.setState({
                            showSave:false,
                        })          
                        window.reloadAgain && window.reloadAgain()
                    }, 3000)
                  })  
            } else {
                if(res.errorCode == "P112001" || res.errorCode == "P112004" || res.errorCode == "P112005"){
                    this.setState({
                        failPop:true
                    })
                } else if(res.errorCode == "P112003"){//已经绑定该账户
                    console.log('window.reloadAgain')
                    this.setState({
                        hasBind:true
                    },()=>{
                        setTimeout(() => {
                            this.setState({
                                hasBind:false,
                            })
                            this.props.CloseBankModal()
                        }, 3000)
                   })
                   return
                } else if(res.errorCode == "P112002"){//其他会员已经使用该银行账户
                    this.setState({
                        hasUse:true
                    },()=>{
                        setTimeout(() => {
                            this.setState({
                                hasUse:false,
                            })
                            this.props.CloseBankModal()
                        }, 3000)
                   })
                   return
                } else {
                    this.setState({
                        failPop:true//errorCode == 400 & errorCode == 500
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    //FP step2 取消訂單,返回step1
    cancelPayFPMoney = () => {
        let ST = this.state;
        let transactionId = ST.transactionId
        Toast.loading('กำลังยกเลิกรายการ', 200);
        fetchRequest(ApiPort.LBUniqueAmtDepositBack + "MemberCancelDeposit?transactionId=" + transactionId +'&', 'POST')
            .then(res => {
                Toast.hide();
                if (res.isSuccess == true) {
                    this.setState({
                        LBcurrentStep: 1,
                        changeWord:false,
                        // payMoney: ''
                    }, ()=>this.checkAgn('UniqueAmt'))

                } else {
                    Toast.fail(res.errorMessage, 2);

                }
            }).catch(error => {
            Toast.hide();
            console.log(error)
        })
    }

    closeLBStep3 = () => {
        // clearInterval(this.state.timer)
        //this.props.navigateToScene('records')
        let newRegist = global.localStorage.getItem("newRegist");   
        if(newRegist==true){
            console.log('register====')
            this.setState({
                LBcurrentStep:1
            })
            clearInterval(TimeV1);
            Actions.jump("recordsNx");
            setTimeout(() => {
                reloadPage("records");
            }, 100);
        } else {
             console.log('old member====')
             clearInterval(TimeV1);
             Actions.jump("deposit");
             setTimeout(() => {
                 reloadPage("records");
            }, 100);
        }
        
    }

    defaultLBMethod = async () => {
        const {paymentchannel} = this.state

        if (paymentchannel != 0) {
            let hasNormalAmt = paymentchannel.some(e => e.value === 'NormalAmt')
            let hasUniqueAmt = paymentchannel.some(e => e.value === 'UniqueAmt')
            if (hasNormalAmt && !hasUniqueAmt) {
                this.setState({lbRechargeMethod: 0})
            } else if (hasUniqueAmt && !hasNormalAmt) {
                this.setState({lbRechargeMethod: 1})
                this.checkAgn('UniqueAmt');
            } else if (hasNormalAmt && hasUniqueAmt) {
                storage.load({
                    key: 'lbDeposit',
                    id: 'lbDepositMethod'
                }).then(data => {
                    console.log(data)
                    // 0 normal, 1 fast，如果用戶上次是用快速存款，幫選好
                    if (data === 1) {
                        this.setState({
                            lastIsFast: true,
                            lbRechargeMethod: 1
                        })
                        this.checkAgn('UniqueAmt');
                    } else {
                        this.setState({
                            lastIsFast: false,
                            lbRechargeMethod: 0
                        })
                    }
                })
            } else {
                this.setState({lbRechargeMethod: 0})
            }
        } else {
            this.setState({lbRechargeMethod: 0})
        }
    }


    setLBMethodStorage = async (v) => {
        console.log('setLBMethodStorage')
        global.storage.save({
            key: 'lbDeposit', // 注意:请不要在key中使用_下划线符号!
            id: "lbDepositMethod", // 注意:请不要在id中使用_下划线符号!
            data: v,
        });
    }

    rememberBanks = () => {

        const data = {
            accountHolderName: this.state.userName,
            accountNumber: this.state.accountNumber,
            bankName: this.state.LBmemberBanks[LBmemberBanksKey].BankName,
            branch: '',
            city: '',
            province: '',
            type: 'D',
            isDefault: true
        };

        console.log('rememberBanks',data)
        if(data.userName === '' || data.accountNumber === '' || data.bankName ===''){
            Toast.fail('');
            return
        }
        Toast.loading('กำลังยืนยัน โปรดรอสักครู่...', 200);
        fetchRequest(ApiPort.POSTRememberBanks, 'POST', data).then((res) => {
            Toast.hide();
            if (res.isSuccess == true) {
                Toast.success('อัปเดตสำเร็จ!');
                this.setState({
                    userNohavename: false,
                })
            } else if (res.isSuccess == false) {
                Toast.fail(res.result.Message);
            }
        })
            .catch(error => {

            });
    }

    // 选择用户添加过的银行账户 （LB)
    onMemberBankSelect = key => {
        const { LBmemberBanks } = this.state;
        this.setState({
            LBmemberBanksKey: key,
            userName: LBmemberBanks[key].AccountHolderName,
            accountNumber: LBmemberBanks[key].AccountNumber,
        });
        console.log('选择用户添加过的银行账户',this.state.LBmemberBanksKey)
    };
    // 选择收款银行 (LB)
    onAccountSelect = key => {
        //Alert.alert('选择收款银行')
        const { userBank } =  this.state;
        console.log('选择收款银行')
        console.log('userBankD=======',key)
        console.log(this.state)
        this.setState({
            userBankD: key,
            UserCheackBank: userBank[key].value,
            SixNumber: userBank[key].AccountNo.slice(-6)
        });
       
    };

    userBankD = (rowData, key) => {
        console.log('选择收款银行')
        console.log('userBankD=======',key)
        console.log(rowData)
        console.log(key)
        this.setState({
            UserCheackBank: this.state.userBank[key].value,
            userBankD: key,
            SixNumber: this.state.userBank[key].AccountNo.slice(-6)
        });
    };

    // 上传图片文件(LB)
    // size< 1M
    // Base64
    // 后端支持的文件类型=".jpg,.jpeg,.gif,.bmp,.png,.doc,.docx,.pdf"
    selectPhotoTapped() {
        console.log('selectPhotoTapped')
        const options = {
            title: "เลือกรูปภาพ", //TODO:CN-DONE 选择图片
            cancelButtonTitle: "ยกเลิก", //TODO:CN-DONE 取消
            chooseFromLibraryButtonTitle: "เลือกรูปภาพ", //TODO:CN-DONE 选择图片
            cameraType: "back",
            mediaType: "photo",
            videoQuality: "high",
            durationLimit: 10,
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 1,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true
            }
        };
        //
        ImagePicker.launchImageLibrary(options, response => {
            // let source = { uri: "data:image/jpeg;base64," + response.data };
            console.log(response);
            if (response.didCancel) return;

            if (response && response.data) {
                let source = {uri: response.data};
                this.setState({
                    avatarName: response.fileName.toLocaleLowerCase(),
                    avatarSize: response.fileSize,
                    avatarSource: source
                });
            }

        });
    }

    paymentDisplayName = (item) => {
        return PaymentName[item.code] ? PaymentName[item.code] : item.name
    }

    paymentLogoHeight = (code) => {
        if(code == "TMW"){
            return 27
        } else {
            return 20
        }
    }
    
    newLabel = () => {
        return (
            <View style={{position: 'absolute', right: 0, top: 0, backgroundColor: '#FF2B2B', borderBottomLeftRadius: 4, borderTopRightRadius: 4}}>
                <Text style={{color: '#fff', fontSize: 10, paddingVertical: 0, paddingHorizontal:4 }}>NEW</Text>
            </View>
        )
    }

    newRdLabel = () => {
        return (
            <View style={{width:29, height:10, position: 'absolute', right: 4, top: -3, backgroundColor: '#FF2B2B', borderBottomLeftRadius: 6, borderTopRightRadius: 6, borderBottomRightRadius:6, borderTopLeftRadius:6}}>
                <Text style={{lineHeight:10, color: '#fff', fontSize: 8, paddingTop: 1, paddingHorizontal:2, textAlign:'center' }}>NEW</Text>
            </View>
        )
    }

    calcCharges = () => {
        const {Charges, payMoney} = this.state;
        return Number(payMoney) + (Number(payMoney) * Number(Charges))
    }
    
    EZPIconStyle = (v) => {
        // width: item.value == 'FASTPAY' ? 25 : item.value == 'TPAY' ? 60 : item.value == 'EEZIEPAY' ? 40 : 30,
        //     height: item.value == 'TPAY' ? 30 : item.value == 'EEZIEPAY' ? 15 : 20
        switch (v) {
            case 'FASTPAY':
                return { width: 25, height: 20}
            case 'TPAY':
                return { width: 60, height: 30}
            case 'EEZIEPAY':
                return { width: 40, height: 15}
            case 'OOPAY':
                return { width: 50, height: 24}
            case 'YOUFU':
                return { width: 30, height: 30}
            case 'SPEEDPAY':
                return { width: 60, height: 15}
            case 'OPTIMUSPAY':
                return { width: 55, height: 30}
            default:
                return { width: 30, height: 20}
        }
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

    GetDAByAmount(){

        let ST = this.state;
   
        let payMethod = ST.NowBankType
        let amt = ST.payMoney
        let bankN = ST.userBank[ST.userBankD].EnBankName
        console.log('GetDAByAmount ST')
        
        fetchRequest(
          ApiPort.GetDAByAmount +
          "?paymentMethod=" + 
          payMethod +
          "&amount=" +
          amt +
          "&depositingBankName=" +
          bankN +
          "&methodCode=DEFAULT&",
          "GET")
          .then(res => {
            console.log('GetDAByAmount: ', res)
            Toast.hide();
            
            if (res.IsDummyBank == true) {
                console.log('res.IsDummyBank == true')
              //虚设銀行指標
              //True = 是虚设銀行 顯示錯誤彈窗
              //False = 不是虚设銀行 顯示申請成功
                this.setState({
                  IsDummy:true
                })
                console.log('是虚设銀行!======== ')
            } else {
                
                this.setState({
                  LBcurrentStep: 2,
                  payMoney: ST.payMoney,
                  IsDummy:false,
                  passAcc:res.AccountNo,
                  passDepNum:res.EnBankName,
                })
                //Toast.fail(res.errorMessage, 2);
            }
          })
          .catch(() => {
            Toast.hide();
            Toast.fail("Kết nối không ổn định, vui lòng thử lại sau ", 2);
          })
    
    
    }

    closeDetailBox = ()=>{
        this.setState({ShowBank:false})
    }

    formatBankNo(bankNo) {
        let bankNumber = "";
        if (bankNo.length > 16) {
          bankNumber = "****" + bankNo.slice(bankNo.length - 4);
          //   bankNumber = bankNo.slice(0,4)+ ' ' + bankNo.slice(4,8)+ ' ' + bankNo.slice(8,12)+ ' ' +bankNo.slice(12,16) + ' ' +bankNo.slice(16)
        } else {
          bankNumber = "****" + bankNo.slice(bankNo.length - 4);
          //   bankNumber = bankNo.slice(0,4)+ ' ' + bankNo.slice(4,8)+ ' ' + bankNo.slice(8,12)+ ' ' +bankNo.slice(12)
        }
    
        return bankNumber;
    }
        
   
    render() {

        const { optModal, payMoney, depositPopUpNot, CTCData, QRCODE, uniqueAmount, UserNameError, okCanPay, BCBankName, payMoney2, BankMaxBal, BankMinBal, BonusMSG, bonusCouponKEY, keyboardOpen, LBpay, userBank, Bonus, Bank, BankData, NowBankType, isdepositPageT, transactionId, Inttype, payMoneySTMsg, cardNumberSTMsg, cardPINSTMsg, LBBanks, Charges, nobank, bindAlready, ShowInfo, ShowDetail, showEXPTutorailModal, currentCTCguid, returnEmpty,banks, ShowBank, showDone, showSave, AccountErr, failPop, hasBind, hasUse, isHaveBankImg,rdRechargeMethod,IsAutoAssign, IsDummy } = this.state;
        const { dataSecond, offlineDepositHour, dataHour, offlineDepositMinute, paymentchannel, paymentchannelEND, LBcurrentStep, LBmemberBanks, LBmemberBanksKey, } = this.state;  //支付渠道

        const TwoOnl = ["JDP", "QQ", "OA", "WC", "QR", "UP"]  //只有兩格輸入
        console.log(this.state,"this.state.accountNumber",this.state.accountNumber)
        console.log('this.state.LBMemberBankName',this.state.LBMemberBankName)
        window.BCBankCk = () => {
            this.BCBankClick("BC")
        }
        window.reloadAccounts = (type) => {//newaccount.js
             this.getBankList(type)
        }
        window.reloadAgain =()=>{//showbankdetail.js
            this.BankAccountGet()
            this.BankClick("RD","ฝากเงินด่วน")
        }
        // window.BankJump = () => {
        //     setTimeout(() => {
        //         this.GetPaymentFirst('CTC')
        //     }, 1000)
        // }
        window.ReloadAccount = () => {
            fetchRequest(ApiPort.Member, 'GET')
                .then(data => {
                    global.storage.save({
                        key: 'memberInfo', // 注意:请不要在key中使用_下划线符号!
                        id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
                        data: data.result,
                        expires: null
                    });
                    this.setState({
                        toWallet: Bankname[data.result.memberInfo.PreferWallet],
                        depositingWallet: data.result.memberInfo.PreferWallet
                    });
                })
        }
        window.GetPaymentFirst = () => {
            //this.getPaymentMethodDetails()
            this.BankClick(NowBankType)
        }
        let newQr = global.localStorage.getItem('newName')
        console.log('newName',newQr,'LBcurrentStep',LBcurrentStep,'this.state.isOtherAcc',this.state.isOtherAcc)
        console.log('newName',newQr,isHaveBankImg,this.state.LBMemberBankName.length)
        console.log('this.state.RDBankName',this.state.RDBankName,this.state.RDCode,this.state.RDBankAcc,this.state.RDCode)
        
        return (

            <View style={{ flex: 1 }}>
                {/* 驗證提醒彈窗 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={optModal}
                    onRequestClose={() => { }}
                >
                    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                            <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} onPress={()=>{
                                this.setState({optModal:false})
                                this.props.checkcallback("records");
                                Actions.home()
                            }}>X</Text>
                            <Image
                                source={require("../../images/icon_warning.png")}
                                resizeMode="stretch"
                                style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                            />
                            <View>
                                <Text style={{color:'#fff',textAlign:'center',lineHeight:30}}>เพื่อความปลอดภัยของบัญชีของคุณโปรดตรวจสอบข้อมูลให้เสร็จสิ้นก่อนฝากเงิน</Text>
                                <TouchableOpacity onPress={()=> this.GotoVerifie()}>
                                    <View style={{backgroundColor:'#00B324',width:100,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>去验证</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
               
              
                {/* 充值通道暫時關閉彈窗 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={depositPopUpNot}
                    onRequestClose={() => { }}
                >
                    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ marginLeft: 50, marginRight: 50, width: width - 100, }}>
                            <View style={styles.popTtitleBg}>
                                <Text style={{ textAlign: 'center', fontSize: 16, color: "#fff", fontWeight: '900', paddingTop: 10, paddingBottom: 10 }}>การแจ้งเตือน</Text>
                            </View>
                            <View style={{ alignItems: 'center', backgroundColor: '#fff', height: 140, width: width - 100, overflow: 'hidden' }}>
                                <Text style={{ textAlign: 'center', paddingTop: 20 }}>ช่องทางฝากนี้ งดให้บริการชั่วคราว​</Text>
                                <Text style={{ textAlign: 'center', padding: 10 }}>สมาชิกสามารถใช้ช่องทางการฝากอื่น ๆ</Text>
                                <TouchableOpacity onPress={() => this.openLiveChat()}>
                                    <Text style={{ color: '#00b324' }}>หรือติดต่อฝ่ายบริการลูกค้า</Text>
                                </TouchableOpacity>
                                <Text style={{ textAlign: 'center', padding: 10 }}>ขออภัยในความไม่สะดวก</Text>
                            </View>

                            <View style={{ alignItems: 'center', backgroundColor: 'white', height: 50, width: width - 100, zIndex: 99, paddingTop: 10 }}>
                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.setState({ depositPopUpNot: false })}>
                                    <View style={{ width: width - 100, paddingLeft: 20, paddingRight: 20 }}>
                                        <View style={{ backgroundColor: '#00b324', borderRadius: 5, height: 30 }}>
                                            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>ปิด</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType='none'
                    transparent={true}
                    visible={isdepositPageT} //isdepositPageT
                    onRequestClose={() => { }}
                    // onShow={this.startShow}
                >
                    <View style={{ justifyContent: 'center', flex: 1, padding: 30, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor: '#171717', borderRadius: 5, padding: 20 }}>
                            <View>
                                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 20, lineHeight: 40, fontWeight: 'bold' }}>ฝากเงิน</Text>
                            </View>
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>ยืนยันคำสั่ง:{transactionId}1 确认后，将开启第三方支付</Text>
                            </View>
                            <View>
                                <Text style={{ color: '#fff', fontSize: 13, padding: 3 }}>温馨提醒：</Text>
                                <Text style={{ color: '#fff', fontSize: 13, padding: 3 }}>1. โปรดกรอกจำนวนเงินพิเศษ (หรือจุดทศนิยม) ที่ระบุโดยระบบเมื่อฝากเงิน และทำการชำระเงินมิ ฉะนั้นบัญชีจะเกิดการล่าช้า</Text>
                                <Text style={{ color: '#fff', fontSize: 13, padding: 3 }}>2.[QR code] คุณต้องทำการสแกนภายใน 5 นาทีและคิวอาร์โค้ดใช้ได้สามารถเพียงครั้งเดียว การสแกนรหัสซ้ำจะทำให้การฝากล้มเหลว</Text>
                            </View>
                            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ isdepositPageT: false })
                                    Actions.depositPageT({ data: this.state.payHtml, isdepositPageT: true })
                                }}>
                                    {/* <Image resizeMode='stretch' source={require('../../images/okBtn.png')} style={{ width: 130, height: 41}} /> */}
                                    <View style={{ width: width / 2, backgroundColor: '#00b324', borderRadius: 5 }}>
                                        <Text style={{ lineHeight: 35, fontSize: 20, color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>รับทราบ</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType='none'
                    transparent={true}
                    visible={this.state.QRBanks_info}
                >
                    <View style={{justifyContent: 'center', flex: 1}}>
                        <View style={{
                            width: width - 50,
                            alignSelf: 'center',
                            justifyContent: 'center',
                            padding: 17,
                            borderWidth: 1,
                            borderColor: "#00B324",
                            backgroundColor: "#000"
                        }}>

                            <Text style={{
                                color: "#F5F5F5",
                                fontSize: 18,
                                alignSelf: 'center',
                                marginBottom: 21
                            }}>รายชื่อธนาคาร</Text>

                            <View style={{position: 'absolute', top: 15, right: 15}}>
                                <TouchableOpacity onPress={() => this.setState({QRBanks_info: false})} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                    <Image source={require('../../images/close.png')}
                                           style={{width: 30, height: 30}}/>
                                </TouchableOpacity>
                            </View>


                            <View style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignSelf: 'center',
                                justifyContent: 'center'
                            }}>
                                {
                                    bankNameList.map((item, index) => {
                                        return (
                                            <View style={styles.bankImgHoverX1New3}>
                                                <Image source={item.img} style={{width: 47, height: 47}}/>
                                                <Text style={{color: '#fff', textAlign: 'center'}}>{item.title}</Text>
                                            </View>
                                        )
                                    })
                                }
                            </View>

                        </View>

                    </View>

                </Modal>

                {IsDummy === true &&
                    <Modal
                        animationType='none'
                        transparent={true}
                        //visible={IsDummy}
                        onRequestClose={() => { }}                
                    >
                        <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor:'#000000',width:.95 * width,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:30}}>
                            <Image
                            source={require('../../images/icon_fail_pop.png')} 
                            resizeMode="stretch"
                            style={{ width: 48, height:48,alignSelf:'center',marginBottom:20}}
                            />
                            <View> 
                            <Text style={{fontSize:16,color:'#FFFFFF',textAlign:'center',marginBottom:15}}>การฝากเงินล้มเหลว</Text>
                            <Text style={{fontSize:14,color:'#CCCCCC',textAlign:'center',marginBottom:5}}>ขออภัย ไม่มีธนาคารให้บริการในขณะนี้</Text>
                            <Text style={{fontSize:14,color:'#CCCCCC',textAlign:'center',marginBottom:5}}>รายการนี้จะถูกยกเลิก กรุณาทำรายการฝาก</Text>
                            <Text style={{fontSize:14,color:'#CCCCCC',textAlign:'center',marginBottom:10}}>ด้วยช่องทางอื่น</Text>

                            {NowBankType == 'LB' ? (
                                this.state.lbRechargeMethod == 1 && this.state.LBcurrentStep == 1 ?
                                <TouchableOpacity 
                                    onPress={()=>{
                                        this.setState({
                                            IsDummy:false,
                                            LBcurrentStep: 1,                                          
                                            payMoney: "",
                                                                           
                                        },()=>{
                                            this.checkAgn('UniqueAmt')
                                        })  
                                    }}
                                >
                                    <View style={{fontSize:14,color:'#FFFFFF',backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ทำรายการฝากใหม่</Text></View>
                                </TouchableOpacity> :
                                <TouchableOpacity 
                                    onPress={()=>{
                                        this.setState({
                                            IsDummy:false,
                                            LBcurrentStep: 1,
                                            changeWord:false,
                                            payMoney: "",
                                            okCanPay: true,
                                            isOtherAcc: false,
                                            lastSixNumber: ''                                
                                        },()=>{
                                            //this.checkAgn('UniqueAmt')
                                            this.checkAgn()
                                        })  
                                    }}
                                >
                                    <View style={{fontSize:14,color:'#FFFFFF',backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ทำรายการฝากใหม่</Text></View>
                                </TouchableOpacity>) :  (
                            <TouchableOpacity 
                                onPress={()=>{
                                    this.setState({
                                        IsDummy:false, 
                                        payMoney: "",
                                        okCanPay: true,
                                        isOtherAcc: false,
                                        lastSixNumber: ''                                 
                                    },()=>{
                                        //window.GetPaymentFirst && window.GetPaymentFirst()
                                        this.checkAgn()
                                    })  
                                }}
                            >
                                <View style={{fontSize:14,color:'#FFFFFF',backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ทำรายการฝากใหม่</Text></View>
                            </TouchableOpacity> )} 
                            </View>
                        </View>
                        </View>
                    </Modal> 
                    
                }
                {/* 提醒更改銀行的注意事項 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={ShowInfo}
                    onRequestClose={() => { }}
                >
                    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                            <Image
                                source={require("../../images/icon_warning.png")}
                                resizeMode="stretch"
                                style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                            />
                            <View>
                                <Text style={{color:'#fff',textAlign:'center'}}>ยืนยันการเปลี่ยนบัญชีธนาคาร</Text>
                                <Text style={{color:'#959595',textAlign:'center'}}>การเปลี่ยนบัญชีจะมีผลต่อบัญชีที่ใช้ในการฝาก</Text>
                                <Text style={{color:'#959595',textAlign:'center'}}>คุณต้องใช้ธนาคารที่เปลี่ยนในการฝากเงินเท่านั้น</Text>
                                <TouchableOpacity onPress={()=>{this.setState({ ShowInfo:false, ShowBank:true })}}>
                                    <View style={{backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:20}}><Text style={{fontSize:14,color:'#fff',textAlign:'center'}}>ยืนยันเปลี่ยนบัญชี</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{this.setState({ ShowInfo:false })}}>
                                    <View style={{backgroundColor:'#000000',borderColor:'#00B324',borderWidth:1,width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15, marginBottom:15}}><Text style={{fontSize:14,color:'#00B324',textAlign:'center'}}>ยกเลิก</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>  

                {/* 更改銀行的相關事項 */} 
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={ShowDetail}
                    onRequestClose={() => { }}
                >
                    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:25}}>
                            <Image
                                source={require("../../images/icon_warning.png")}
                                resizeMode="stretch"
                                style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                            />
                            <View>
                                <Text style={{color:'#fff',textAlign:'center', marginBottom:5, fontSize:18}}>เปลี่ยนบัญชีธนาคาร</Text>
                                <Text style={{color:'#959595',textAlign:'left', fontSize:15}}>เรียนสมาชิก หากต้องการเปลี่ยนข้อมูลบัญชี</Text>
                                <Text style={{color:'#959595',textAlign:'left', fontSize:15}}>ธนาคารในการโอนเงิน กรุณาติดต่อฝ่ายบริการลู</Text>
                                <Text style={{color:'#959595',textAlign:'left', fontSize:15}}>กค้าและส่งเอกสารดังนี้</Text>
                                <View style={{ marginTop:10, marginBottom:10 }}> 
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: 'row',
                                            //textAlign:'left',
                                            height: 25,
                                            marginBottom: 10,
                                            alignItems:'center',
                                            borderRadius:5,
                                        }}
                                    >
                                        <Image 
                                            style={{ width: 20, height: 20, marginRight: 15 }}
                                            source={require("../../images/icon_one.png")}
                                            resizeMode="stretch" />
                                        <Text style={{color:'#959595', fontSize:15}}>บัตรประชาชน </Text>
                                    </View>
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: 'row',
                                            //textAlign:'left',
                                            height: 25,
                                            marginBottom: 10,
                                            alignItems:'center',
                                            borderRadius:5,
                                        }}
                                    >
                                        <Image 
                                            style={{ width: 20, height: 20, marginRight: 15 }}
                                            source={require("../../images/icon_two.png")}
                                            resizeMode="stretch" />
                                        <Text style={{color:'#959595', fontSize:15}}>หน้าสมุดบัญชีธนาคารปัจจุบัน</Text>
                                    </View>
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: 'row',
                                            //textAlign:'left',
                                            height: 25,
                                            marginBottom: 10,
                                            alignItems:'center',
                                            borderRadius:5,
                                        }}
                                    >
                                        <Image 
                                            style={{ width: 20, height: 20, marginRight: 15 }}
                                            source={require("../../images/icon_three.png")}
                                            resizeMode="stretch" />
                                        <Text style={{color:'#959595', fontSize:15}}>หน้าสมุดบัญชีธนาคารที่ต้องการเปลี่ยน</Text>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={{
                                        backgroundColor: "#00B324",
                                        display: "flex",
                                        flexDirection: 'row',
                                        height: 48,
                                        marginBottom: 20,
                                        justifyContent:'center',
                                        alignItems:'center',
                                        borderRadius:5,
                                    }}
                                    onPress={()=>{
                                        UMonEvent('CS', 'Click', 'CS_ChangeBank_LBExpress'),
                                        Actions.LiveChatST(),
                                        this.setState({ ShowDetail:false })}
                                    }            
                                >
                                    <Text style={{color:'#fff', fontSize:18}}>ติดต่อฝ่ายบริการ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={{
                                        backgroundColor: "#000000",
                                        borderColor:'#00B324',
                                        borderWidth:1,
                                        display: "flex",
                                        flexDirection: 'row',
                                        height: 48,
                                        marginBottom: 10,
                                        justifyContent:'center',
                                        alignItems:'center',
                                        borderRadius:5,
                                    }}
                                    onPress={()=>{this.setState({ ShowDetail:false })}}
                                >
                                    <Text style={{color:'#00B324', fontSize:18}}>ปิด</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>  

                {/* 帳戶綁定失敗。 請聯繫支持以獲得幫助。 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={failPop}
                    onRequestClose={() => { }}
                >
                    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor:'#000000',width:width-90,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                            <Image
                            source={require("../../images/icon_failed.png")}
                            resizeMode="stretch"
                            style={{ width: 60, height:60,alignSelf:'center',marginBottom:10, marginTop:5}}
                            />
                            <View>
                                <Text style={{color:'#F5F5F5',textAlign:'center'}}>การผูกบัญชีล้มเหลว</Text>
                                <Text style={{color:'#959595',textAlign:'center'}}>การผูกบัญชีล้มเหลว กรุณาติดต่อฝ่ายบริการ</Text>
                                <Text style={{color:'#959595',textAlign:'center',marginBottom:10}}>เพื่อให้ความช่วยเหลือ</Text>
                            
                                <TouchableOpacity 
                                    onPress={()=>{
                                        Actions.LiveChatST(),
                                        this.setState({ failPop:false })}
                                    }
                                >
                                    <View style={{backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15, marginBottom:10}}><Text style={{color:'#fff',textAlign:'center'}}>ติดต่อฝ่ายบริการ</Text></View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{this.setState({ failPop:false })}}>
                                    <View style={{backgroundColor:'#000000',borderColor:'#00B324',borderWidth:1,width:250,padding:10,borderRadius:4,alignSelf:'center',marginBottom:10}}><Text style={{fontSize:14,color:'#00B324',textAlign:'center'}}>ปิด</Text></View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
          
                {/* 帳戶問題--> 關聯帳號失敗 */}
                <Modal
                animationType='none'
                transparent={true}
                visible={AccountErr}
                onRequestClose={() => { }}
                >
                    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                        <Image
                            source={require("../../images/icon_failed.png")}
                            resizeMode="stretch"
                            style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
                        />
                        <View> 
                            <Text style={{color:'#fff',textAlign:'center',marginBottom:5}}>การผูกบัญชีล้มเหลว</Text>
                            <Text style={{color:'#959595',textAlign:'center',marginBottom:5}}>บันทึกข้อมูลสำเร็จ แต่การผูกบัญชีล้มเหลว</Text>
                            <Text style={{color:'#959595',textAlign:'center',marginBottom:10}}>กรุณาติดต่อฝ่ายบริการเพื่อให้ความช่วยเหลือ</Text>

                            <TouchableOpacity 
                                onPress={()=>{
                                Actions.LiveChatST(),
                                this.setState({ AccountErr:false })}
                            }>
                                <View style={{backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15}}><Text style={{color:'#fff',textAlign:'center'}}>ติดต่อฝ่ายบริการ</Text></View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{this.setState({ AccountErr:false })}}>
                                <View style={{backgroundColor:'#000000',borderColor:'#00B324', borderWidth:1,width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15,marginBottom:20}}><Text style={{color:'#00B324',textAlign:'center'}}>ปิด</Text></View>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
                </Modal>   

                {/* 複製公司存款帳號 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={showDone} 
                    onRequestClose={() => { }}                
                >
                    <View style={{ width:130, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?400:450, left:Platform.OS === "android"?160:140}}>
                        <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-check-g.png")}
                            style={{ width: 25, height: 25 }}
                        />
                        {/* 複製成功 */}
                        <Text style={{ color: '#333333', paddingLeft: 10 }}>คัดลอกสำเร็จ</Text>
                    </View>
                </Modal>  

                {/* 您添加的銀行帳戶已處於活動狀態。 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={hasBind}
                    onRequestClose={() => { }}                
                >
                    <View style={{ width:220, heigt:54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?400:450, left:100, borderRadius:5}}>
                        <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-fail-g.png")}
                            style={{ width: 20, height: 20, marginLeft:18 }}
                        />
                        {/* 您添加的銀行帳戶已處於活動狀態。 */}
                        <Text style={{ color: '#333333', paddingLeft: 10, paddingRight:10 }}>บัญชีธนาคารที่คุณเพิ่ม</Text>
                        <Text style={{ color: '#333333', paddingLeft: 10, paddingRight:10 }}>มีการใช้งาน แล้วกับยูสเซอร์เนมอื่น</Text>
                    </View>
                </Modal> 

                {/* 您添加的銀行賬戶 已在系統中鏈接。 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={hasUse} 
                    onRequestClose={() => { }}                
                >
                    <View style={{ width:220, heigt:54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?400:450, left:100, borderRadius:5}}>
                        <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-fail-g.png")}
                            style={{ width: 20, height: 20 }}
                        />
                        {/* 您添加的銀行賬戶 已在系統中鏈接。 */}
                        <View style={{ width:160,}}>
                            <Text style={{ color: '#333333', paddingLeft: 10, }}>บัญชีธนาคารที่คุณเพิ่ม</Text>
                            <Text style={{ color: '#333333', paddingLeft: 10, }}>มีการผูกบัญชีในระบบแล้ว</Text>
                        </View>
                        
                    </View>
                </Modal>      

                {/* 綁定帳號 保存成功 */}
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={showSave} 
                    onRequestClose={() => { }}                
                >
                    <View style={{ width:130, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?400:430, left:Platform.OS === "android"?140:135}}>
                        <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-check-g.png")}
                            style={{ width: 25, height: 25 }}
                        />
                        {/* 保存成功 */}
                        <Text style={{ color: '#333333', paddingLeft: 10 }}>บันทึกสำเร็จ</Text>
                    </View>
                </Modal>   

                {/* express deposit 教程 */}
                {<DepositRDTutorial showEXPTutorailModal={showEXPTutorailModal} currentCTCguid={currentCTCguid} CloseCTCTutorailModal={()=>this.setState({showEXPTutorailModal:false})} />}
                {/* 會員綁定銀行的清單列表 */}
                {/* {ShowBank && <ShowBankDetail BankNum={banks} ST={this.state} isNew3={this.state.isNew3} CloseBankTutorailModal={()=>this.closeBankBox()}/>} */}
                {<ShowBankDetail ShowBank={ShowBank} BankNum={banks} ST={this.state.userName} isNew3={this.state.isNew3}  CloseBankModal={()=>this.setState({ ShowBank:false })}/>}

                <WhiteSpace size="sm" />



                <KeyboardAwareScrollView
                    style={{backgroundColor: "#000"}}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    onKeyboardWillShow={(frames: Object) => {
                        if (Platform.OS === "android") {
                            this.setState({
                                keyboardOpen: true
                            })
                        }
                    }}
                    onKeyboardWillHide={(frames: Object) => {
                        if (Platform.OS === "android") {
                            this.setState({
                                keyboardOpen: false
                            })
                        }
                    }}
                >
                    {Bank == "" ?
                        <View style={{backgroundColor:"#1A1A1A", marginTop: 14}}>
                            <View style={styles.bankBox2New}>
                                <View style={{ width: width, top: 21 }}>
                                    <Text style={{ textAlign: 'center', color: "#fff" }}>กำลังโหลด..</Text>
                                </View>
                            </View>
                        </View>:
                        <View style={{backgroundColor:"#1A1A1A", marginTop: 14}}>
                            <View style={styles.bankBox2New}>
                                {Bank != "" && Bank.map((item, i) => {
                                    return (
                                        <TouchableOpacity style={{position: 'relative'}} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.BankClick(item.code, item.name)} key={item.code}>
                                            {(item.code != "LB" && item.code != "no") ?
                                                <View style={item.code == NowBankType ? styles.bankImgHoverX1New : styles.bankImgX1New} >
                                                    <Image resizeMode='contain' source={bankImage[item.code]} style={{ width: item.code == "JDP" ? 30 : item.code == "TMW"? 27: 20, height: item.code == "TMW"? 27:20, fontSize:  item.code == "TMW" ? 9:12}} />
                                                    <Text style={{ color: item.code == NowBankType ? "#00e62c" : "#fff", fontSize:item.code == "BQR"?9:12, marginLeft: 3 }}>
                                                        {this.paymentDisplayName(item)}
                                                    </Text>
                                                </View>

                                                : item.code == "LB" ?

                                                    <View style={item.code == NowBankType ? styles.bankImgHoverX1New : styles.bankImgX1New} >

                                                        <Image resizeMode='stretch' source={bankImage[item.code]} style={{ width: 20, height: 20 }} />

                                                        <Text style={{ color: item.code == NowBankType ? "#00e62c" : "#fff", fontSize: 12, marginLeft: 3 }}>
                                                            {item.code == 'LB' ? 'ภายในประเทศ' : item.name}
                                                        </Text>

                                                    </View>
                                                    : item.code == "no" && <View style={{ width: width / 3.5, height: 10 }}>
                                                    <Text> </Text>
                                                </View>

                                            }
                                            {item.code == "TMW" && this.newLabel()}
                                            {item.code == "BQR" && this.newLabel()}
                                            {item.code == "RD" && this.newRdLabel()}
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    }


                    {NowBankType != 'LB' && paymentchannel != '' && paymentchannel.length > 0 &&
                    <View>
                        <View
                            style={{
                                backgroundColor: "#1A1A1A",
                                borderBottomColor: '#3D3D3D',
                                borderBottomWidth: 1,
                                paddingBottom: 12,
                                paddingLeft: 15,
                                paddingRight: 15,
                                // paddingTop:10
                            }}
                        />
                        <View style={{backgroundColor: "#1A1A1A", paddingLeft: 15, paddingRight: 15, marginBottom: 14}}>
                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>เลือกช่องทาง</Text>
                            <View style={styles.bankBox2New2}>
                                {paymentchannel == "" ?
                                    <View style={{width: width, top: 21}}>
                                        <Text style={{textAlign: 'center', color: "#fff"}}>กำลังโหลด..</Text>
                                    </View>

                                    : paymentchannel != "" && paymentchannel.map((item, i) => {

                                    return (
                                        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                          onPress={() => this.paymentchannelDWButton(i)}
                                                          key={item.value}>
                                            <View
                                                style={(item.enLabel == paymentchannelEND || item.value == paymentchannelEND) ? styles.bankImgHoverX1New2 : styles.bankImgX1New2}>
                                                
                                                <Text style={{
                                                    color: item.code == NowBankType ? "#00e62c" : "#fff",
                                                    fontSize: 12,
                                                    textAlign:'center'
                                                    //marginLeft: 13
                                                }}>
                                                    {item.value}
                                                </Text>


                                            </View>

                                        </TouchableOpacity>

                                    )
                                })
                                }
                            </View>
                        </View>
                    </View>
                    }

                    {NowBankType == 'TMW' && (
                        <View style={{backgroundColor: "#1A1A1A", marginTop: 14}}>
                            <View style={{paddingLeft: 15, paddingRight: 15}}>
                                <View
                                    style={{
                                        backgroundColor: "#FFFCCA",
                                        paddingVertical: 6,
                                        paddingHorizontal: 10,
                                        borderRadius: 4,
                                        marginTop: 23,
                                        marginBottom: 22,
                                        display: "flex",
                                        flexDirection: "row",
                                        alignContent: "flex-start",
                                        flex: 1
                                    }}
                                >
                                    <Image
                                        resizeMode="stretch"
                                        source={require("../../images/icon_warning.png")}
                                        style={{ width: 20, height: 20, marginRight: 8 }}
                                    />
                                    <Text
                                        style={{ flex: 1, fontSize: 12, lineHeight: 16, color: '#000'}}
                                    >
                                        ประกาศสำคัญ: กรุณาใช้แอปทรูมันนี่ วอลเล็ท ในการโอนเท่านั้น แอปธนาคารหรือแอปอื่นๆ ไม่รองรับการฝากเงินนี้ QR Code สามารถใช้ได้เพียงครั้งเดียวเท่านั้น
                                    </Text>
                                </View>

                                <View style={styles.moneyTitle}>
                                    <Text style={{color: '#fff'}}><Text style={{color: "red"}}>* </Text>ยอดเงินฝาก</Text>
                                    <Text style={{color: '#00b324'}}>{payMoney && payMoney}</Text>
                                </View>
                                <View style={styles.DsBorder}>
                                    <InputItem styles={StyleSheet.create(newStyle)}
                                               placeholderTextColor="#969696"
                                               type="number"
                                               value={this.state.payMoney}
                                               onChange={(values) => {
                                                   if(values.match(/[^\d]/g)) {return} // 擋非數字
                                                   let newText = values.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
                                                   this.setState({
                                                       payMoney: newText,
                                                   }, () => {
                                                       this.payMoneyST()
                                                   });
                                               }}
                                               onBlur={() => {
                                                   this.onChange('', '', this.state.payMoney);
                                               }}
                                               onFocus={() => {
                                               }}
                                               placeholder={payMoney && payMoney.toString() || 'ช่องจำนวนเงินฝาก : ' + BankMinBal + ' ~ ' + BankMaxBal}
                                    >
                                    </InputItem>
                                </View>
                                {
                                    payMoneySTMsg != '' &&
                                    <Text style={{color: '#ff0000', fontSize: 12}}>{payMoneySTMsg}</Text>
                                }
                                {Charges != 0 && (
                                    <>
                                        <View style={styles.moneyTitle}>
                                            <Text style={{color: '#fff'}}><Text style={{color: "red"}}>* </Text>จำนวนรับหลังหักค่าธรรมเนียม:</Text>
                                        </View>
                                        <View style={styles.DsBorder}>
                                            <Text style={{
                                                width: '100%',
                                                color: '#fff',
                                                fontSize: 13,
                                                marginLeft: 30
                                            }}>{this.calcCharges()}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        </View>
                    )}

                    {NowBankType == 'BQR' ? ( 
                        (<View>
                            {/* BQR第一步驟 */}                            
                            {<View style={{ backgroundColor: "#1A1A1A" }}>
                                <View
                                    style={{
                                        backgroundColor: "#FFFCCA",
                                        paddingVertical: 13,
                                        paddingHorizontal: 10,
                                        borderRadius: 4,
                                        marginTop: 5,
                                        marginBottom: 22,
                                        display: "flex",
                                        flexDirection: "row",
                                        alignContent: "flex-start",
                                        flex: 1
                                    }}
                                >
                                    <Image
                                        resizeMode="stretch"
                                        source={require("../../images/icon_warning.png")}
                                        style={{ width: 20, height: 20, marginRight: 8 }}
                                    />
                                    <Text
                                        style={{ flex: 1, fontSize: 14, lineHeight: 18, color: '#222222'}}
                                    >
                                        QR ฝากเงินทศนิยมแบบใหม่! สแกนได้ทั้งแอปธนาคาร และทรูวอลเล็ท
                                    </Text>
                                </View>
                                {this.state.isNew3 && LBmemberBanks.length > 0 ? null : this.addNewBankText()}
                                {/* 新增银行卡的 模式*/}
                                {LBmemberBanks.length == 0 && (
                                    <View style={{backgroundColor: '#1A1A1A'}}>
                                        {/* 存款人姓名 */}
                                        <View style={{paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>ชื่อ-นามสกุล</Text>
                                            <View style={styles.DsBorder}>
                                                
                                                <InputItem 
                                                    editable={false}
                                                    styles={StyleSheet.create(newStyle)}
                                                    type="text"
                                                    value={this.state.userName || newQr}
                                                >
                                                </InputItem>
                                            </View>
                                            {
                                                UserNameError != '' &&
                                                <Text style={{color: '#ff0000', fontSize: 12}}>{UserNameError}</Text>
                                            }
                                        </View>

                                        {/* 存款银行名称 */}
                                        <View style={{paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>บัญชีของคุณ</Text>
                                            {console.log("this.state",this.state)}
                                            {
                                                LBBanks === '' ?
                                                    <View style={styles.DsBorder}>
                                                        <Text style={{fontSize: 13, color: "#fff"}}>กำลังโหลด..</Text>
                                                    </View>
                                                    : LBBanks.length == 0 ?
                                                    <View style={styles.DsBorder}>
                                                        <View style={[styles.DSarrow, {
                                                            position: 'absolute',
                                                            right: 10
                                                        }]} />
                                                        <View>
                                                            <TouchableOpacity
                                                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                                onPress={() => this.openLiveChat()}>
                                                                <Text style={{
                                                                    fontSize: 13,
                                                                    color: '#00b324',
                                                                    textAlign: 'left',
                                                                    width: width - 60
                                                                }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View> : LBBanks.length > 0 ? (
                                                        <View style={styles.DsBorder}>
                                                            <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                            defaultValue='กรุณาเลือก'
                                                                            textStyle={styles.DSdropdown_D_text}
                                                                            dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                            options={LBBanks}
                                                                            renderButtonText={(rowData) => `${rowData.Name}`}
                                                                            renderRow={this._dropdown_5_renderRow.bind(this)}
                                                                            onSelect={this.LBBanksClick}
                                                                            style={{zIndex: 10, width: width - 30}}
                                                            />
                                                            <View style={{
                                                                position: 'absolute',
                                                                right: 10,
                                                                paddingTop: 6
                                                            }}>
                                                                <View style={styles.DSarrow}></View>
                                                            </View>
                                                        </View>
                                                    ) : null
                                            }
                                        </View>

                                        {/* 存款卡号 accountNumber */}
                                        <View style={{paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>เลขบัญชีธนาคาร</Text>
                                            <View style={styles.DsBorder}>
                                                <InputItem styles={StyleSheet.create(newStyle)}
                                                            placeholderTextColor="#969696"
                                                            type="number"
                                                            value={this.state.accountNumber}
                                                            maxLength={50}
                                                            onChange={(value) => {
                                                                let newText = this.filterNumber(value)
                                                                //let newText = value.replace(/[^0-9]/ig,"")
                                                                this.setState({
                                                                    accountNumber: newText
                                                                })
                                                            }}
                                                            onBlur={() => {
                                                            }}
                                                            onFocus={() => {
                                                            }}
                                                >
                                                </InputItem>
                                            </View>
                                            {this.state.isNew3 && LBmemberBanks.length > 0? null : (
                                                <CheckBox
                                                    checkBoxColor={'#00E62E'}
                                                    checkedCheckBoxColor={'#00E62E'}
                                                    style={{ width: 200 }}
                                                    onClick={() => {
                                                        this.setState({
                                                            isSaveBankChecked: !this.state.isSaveBankChecked
                                                        });
                                                    }}
                                                    isChecked={this.state.isSaveBankChecked}
                                                    rightTextView={
                                                        <Text style={{color: "#fff" }}>จำข้อมูลธนาคารของฉัน</Text>
                                                    }
                                                />
                                            )}

                                        </View>
                                    </View>
                                )}
                                {console.log(this.state)}
                                {/* 用户添加过的存款银行卡 */}
                                {LBmemberBanks.length > 0 && (
                                    <View>
                                        <View style={{
                                            backgroundColor: "#1A1A1A",
                                            paddingLeft: 15,
                                            paddingRight: 15,
                                        }}>

                                            <View>
                                                <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>บัญชีของคุณ</Text>
                                                {console.log(this.state)}
                                                {
                                                    LBmemberBanks == '' ?
                                                        <View style={styles.DsBorder}>
                                                            <Text style={{fontSize: 13, color: "#fff"}}>กำลังโหลด..</Text>
                                                        </View>
                                                        : LBmemberBanks!=='' ? (
                                                            <View style={styles.DsBorder}>
                                                                <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                    defaultValue={
                                                                        `${this.state.LBMemberBankName}-${LBmemberBanks[LBmemberBanksKey].AccountNumber.slice(-6)}` || "กรุณาเลือกธนาคาร"
                                                                    }
                                                                    textStyle={styles.DSdropdown_D_text}
                                                                    dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                    options={LBmemberBanks}
                                                                    renderButtonText={(rowData) => `${rowData.BankName}-${rowData.AccountNumber.slice(-6)}`}
                                                                    renderRow={this._dropdown_7_renderRow.bind(this)}
                                                                    onSelect={this.onMemberBankSelect}
                                                                    style={{zIndex: 10, width: width - 30}}
                                                                />
                                                                <View style={{
                                                                    position: 'absolute',
                                                                    right: 10,
                                                                    paddingTop: 6
                                                                }}>
                                                                    <View style={styles.DSarrow}></View>
                                                                </View>
                                                            </View>
                                                        ):null
                                                }
                                            </View>
                                        </View>

                                        <View style={{ paddingHorizontal: 16, marginVertical: 15}}>
                                            <View style={{
                                                backgroundColor: "#222222",
                                                paddingHorizontal: 20,
                                                paddingVertical: 11,
                                                borderRadius: 8
                                            }}>
                                                <Flex>
                                                    <Flex.Item>
                                                        <Text
                                                            style={{color: "#ccc", fontSize:12 }}>ชื่อ-นามสกุล:&nbsp; {LBmemberBanks[LBmemberBanksKey].AccountHolderName}</Text>
                                                    </Flex.Item>
                                                </Flex>
                                                <Flex style={{marginTop: 11}}>                                               
                                                    <Flex.Item>
                                                        <Text
                                                            style={{color: "#ccc", fontSize:12}}>ธนาคาร: &nbsp;{LBmemberBanks[LBmemberBanksKey].BankName}</Text>
                                                    </Flex.Item>
                                                </Flex>
                                                <Flex style={{marginTop: 11}}>
                                                    <Flex.Item>
                                                        <Text style={{color: "#ccc", fontSize:12}}>เลขที่บัญชี: &nbsp;{LBmemberBanks[LBmemberBanksKey].AccountNumber}</Text>
                                                    </Flex.Item>
                                                </Flex>
                                                <Text style={{
                                                    color: "#00E62E",
                                                    textAlign: 'center',
                                                    marginTop: 11
                                                }}>ในกรณีที่คุณต้องการเพิ่มบัญชีใหม่</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{color: "#00E62E"}}>กรุณาติดต่อฝ่ายบริการลูกค้าที่{' '}</Text>
                                                    <TouchableOpacity onPress={()=>Actions.LiveChatST()}>
                                                        <Text style={{color: "#00E62E", textDecorationLine: 'underline'}}>ห้องช่วยเหลือสด</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                                <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                                    <View style={styles.moneyTitle}>
                                        <Text style={{ color: '#fff' }}><Text style={{ color: "red" }}>* </Text>ยอดเงินฝาก</Text>
                                    </View>
                                    <View style={styles.DsBorder}>
                                        <InputItem styles={StyleSheet.create(newStyle)}
                                                placeholderTextColor="#969696"
                                                type="number"
                                                value={this.state.payMoney}
                                                onChange={(values) => {
                                                    let newText = values.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
                                                    this.setState({
                                                        payMoney: newText,
                                                    }, () => { this.payMoneyST() });
                                                }}
                                                onBlur={() => {
                                                    this.onChange('', '', this.state.payMoney);
                                                }}
                                                onFocus={() => { }}
                                                placeholder={payMoney && payMoney.toString() || 'ช่องจำนวนเงินฝาก : ' + BankMinBal + ' ~ ' + BankMaxBal}
                                        >
                                        </InputItem>
                                    </View>
                                    {
                                        payMoneySTMsg != '' &&
                                        <Text style={{ color: '#ff0000', fontSize: 12 }}>{payMoneySTMsg}</Text>
                                    }
                                </View>
                            </View>}
                            
                        </View>)                      
                    ):null}

                    {NowBankType == 'RD' ? (
                        <View>
                            
                            {LBmemberBanks.length == 0 && returnEmpty == false &&// MemberBank 是空
                                // 添加銀行賬戶
                                <View style={{ paddingLeft:15,paddingRight:15 }}>
                                    <Image
                                        source={require("../../images/icon_addBank.png")}
                                        resizeMode="stretch"
                                        style={{ width: 90, height:70,alignSelf:'center',marginBottom:10,  marginTop:50}}/>
                                    <Text style={{color:'#fff',textAlign:'center', fontSize:18, marginBottom:5}}>เพิ่มบัญชีธนาคาร</Text>
                                    <Text style={{color:'#959595',textAlign:'center'}}>กรุณาเพิ่มบัญชีธนาคารก่อนการฝากเงินแบบฝากด่วน</Text>
                                    <Text style={{color:'#959595',textAlign:'center'}}>หากเพิ่มหรือผูกบัญชีแล้วจะไม่สามารถแก้ไขข้อมูลได้ </Text>
                                    <Text style={{color:'#959595',textAlign:'center'}}>กรุณาใช้บัญชีที่ผูกในการโอนเงินเท่านั้นป้องกันยอดเงินสูญหาย</Text>
                                    <View>
                                    {/* 新增帳戶 */}
                                        <Touch 
                                            //onPress={this.goNewAccount} 
                                            onPress={()=> this.goNewAccount()}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                                            style={{
                                                backgroundColor: "#00B324",
                                                display: "flex",
                                                flexDirection: 'row',
                                                height: 48,
                                                justifyContent:'center',
                                                alignItems:'center',
                                                borderRadius:5,
                                                marginTop:50,
                                        }}
                                            //style={{ width: width - 30 }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: 18, textAlign: 'center', paddingTop: 3 }}>เพิ่มบัญชี</Text>
                                        </Touch>
                                    </View>
                                </View> 
                            }     

                            {LBmemberBanks.length > 0 && returnEmpty == false && (
                                bindAlready == false ? //false --> 沒綁定帳戶                                
                                    //選擇要存款的賬戶
                                    LBmemberBanks.length < 2 ?//銀行數大於1個
                                            <View style={{ paddingLeft:15,paddingRight:15 }}>  
                                                <Image
                                                    source={require("../../images/icon_chooseBank.png")}
                                                    resizeMode="stretch"
                                                    style={{ width: 80, height:60,alignSelf:'center',marginBottom:20, marginTop:10}}/>
                                                <Text style={{color:'#fff',textAlign:'center', fontSize:18}}>เลือกบัญชีสำหรับฝากเงิน</Text>
                                                <Text style={{color:'#959595',textAlign:'center', fontSize:Platform.OS == "android" ? 11:12}}>กรุณายืนยันบัญชีธนาคารของคุณสำหรับการฝากเงินแบบฝากด่วน</Text>
                                                <Text style={{color:'#959595',textAlign:'center', fontSize:Platform.OS == "android" ? 11:12}}>หากผูกบัญชีแล้วจะไม่สามารถแก้ไขข้อมูลได้ กรุณาใช้บัญชีที่ผูกในการ</Text>
                                                <Text style={{color:'#959595',textAlign:'center', fontSize:Platform.OS == "android" ? 11:12}}>โอนเงินเท่านั้นป้องกันยอดเงินสูญหาย</Text>
                                                {/* 會員帳號 */}
                                                <View>
                                                    <Text style={{color: '#fff', lineHeight: 35}}>
                                                        <Text style={{color: "red"}}>* </Text>
                                                        เลขที่บัญชีสมาชิก
                                                    </Text>                         
                                                    <View style={styles.RDBorder}>
                                                        <Image
                                                            source={require("../../images/icon_exCard.png")}
                                                            resizeMode="stretch"
                                                            style={{ width: 20, height:10,marginLeft:10,marginRight:10}}
                                                        />
                                                        <Text style={{color: "#ccc", lineHeight:48}}>
                                                            {this.state.LBMemberBankName
                                                            ? this.state.LBMemberBankName.length > 20
                                                                ? this.state.LBMemberBankName.substr(0, 20) + ".."
                                                                : this.state.LBMemberBankName
                                                            : ""}
                                                            {" "}
                                                            {this.formatBankNo(LBmemberBanks[LBmemberBanksKey].AccountNumber)}
                                                        </Text>
                                                    </View>

                                                    <Text style={{color: '#999999', fontSize:13}}>กรณีที่คุณต้องการเพิ่มบัญชีใหม่ กรุณาติดต่อ ฝ่ายบริการลูกค้า</Text>
                                                    <TouchableOpacity onPress={()=>{Actions.LiveChatST()}}>
                                                        <Text style={{color: "#00E62E", fontSize:13}}>ที่ห้องช่วยเหลือสด</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                
                                                
                                                <View style={{ backgroundColor:'#00B324', borderRadius:5,  height:48, marginTop:20 }}>
                                                {/* 下一個 */}
                                                    <Touch onPress={()=>this.okPutMemberBank()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} >
                                                        <Text style={{ color: "#fff", fontSize: 16, lineHeight: 48, textAlign: 'center', paddingTop: 3 }}>ถัดไป</Text>
                                                    </Touch>
                                                </View>
                                            </View>
                                        :
                                            <View style={{ paddingLeft:15,paddingRight:15 }}>   
                                                <Image
                                                    source={require("../../images/icon_chooseBank.png")}
                                                    resizeMode="stretch"
                                                    style={{ width: 80, height:60,alignSelf:'center',marginBottom:20, marginTop:10}}/>
                                                <Text style={{color:'#fff',textAlign:'center',fontSize:18}}>เลือกบัญชีสำหรับฝากเงิน</Text>
                                                <Text style={{color:'#959595',textAlign:'center'}}>กรุณายืนยันบัญชีธนาคารของคุณสำหรับการฝากเงินแบบฝากด่วน</Text>
                                                <Text style={{color:'#959595',textAlign:'center'}}>และใช้บัญชีที่ผูกในการโอนเงินเท่านั้นป้องกันยอดเงินสูญหาย</Text>
                                            
                                                {/* 會員帳號 */}
                                                <View style={{ marginTop:20 }}>
                                                    <Text style={{color: '#fff', lineHeight: 35}}>
                                                        <Text style={{color: "red"}}>* </Text>
                                                        เลขที่บัญชีสมาชิก
                                                    </Text>
                                                    <View 
                                                        style={{
                                                            backgroundColor: "#000000",
                                                            borderColor:'#757575',
                                                            borderWidth:1,
                                                            display: "flex",
                                                            flexDirection: 'row',
                                                            //textAlign:'left',
                                                            height: 48,
                                                            marginBottom: 10,
                                                            alignItems:'center',
                                                            borderRadius:5,
                                                            marginTop:3,
                                                    }}>
                                                        <Image
                                                            source={require("../../images/icon_exCard.png")}
                                                            resizeMode="stretch"
                                                            style={{ width: 20, height:10,marginLeft:10,marginRight:10}}
                                                        />
                                                        <Text style={{color: "#ccc", lineHeight:48}}>
                                                            {this.state.LBMemberBankName
                                                            ? this.state.LBMemberBankName.length > 20
                                                                ? this.state.LBMemberBankName.substr(0, 20) + ".."
                                                                : this.state.LBMemberBankName
                                                            : ""}
                                                            {" "}
                                                            {this.formatBankNo(LBmemberBanks[LBmemberBanksKey].AccountNumber)}
                                                        </Text>
                                                        {/* 改變 */}                            
                                                        <TouchableOpacity 
                                                            style={{ flex:1, alignItems:'flex-end' }}
                                                            onPress={
                                                                ()=>{
                                                                    this.setState({
                                                                        ShowBank:true
                                                                    })
                                                                }
                                                            }
                                                        >
                                                            <Text style={{color: "#00E62E", marginRight:30}}>เปลี่ยน</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <Text style={{color: '#999999', fontSize:13}}>กรณีที่คุณต้องการเพิ่มบัญชีใหม่ กรุณาติดต่อ ฝ่ายบริการลูกค้า</Text>
                                                    <TouchableOpacity onPress={()=>{Actions.LiveChatST()}}>
                                                        <Text style={{color: "#00E62E", fontSize:13}}>ที่ห้องช่วยเหลือสด</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                
                                                
                                                <View style={{ backgroundColor:'#00B324', borderRadius:5, height:48, marginTop:20 }}>
                                                {/* 下一個 */}
                                                    <Touch onPress={()=>this.okPutMemberBank()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} >
                                                        <Text style={{ color: "#fff", fontSize: 16, lineHeight: 48, textAlign: 'center', paddingTop: 3 }}>ถัดไป</Text>
                                                    </Touch>
                                                </View>
                                            </View>                                       
                                :
                                <View style={{ paddingLeft:15,paddingRight:15 }}>
                                    {/* 因為銀行賬戶可能會改變。 轉賬前請務必檢查您的銀行賬戶。 */}
                                        <View
                                            style={{
                                                backgroundColor: "#FFFCCA",
                                                paddingVertical: 13,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                marginTop: 5,
                                                marginBottom: 22,
                                                display: "flex",
                                                flexDirection: "row",
                                                alignContent: "flex-start",
                                                flex: 1
                                            }}
                                        >
                                            <Image
                                                resizeMode="stretch"
                                                source={require("../../images/icon_warning.png")}
                                                style={{ width: 20, height: 20, marginRight: 8 }}
                                            />
                                            <Text
                                                style={{ flex: 1, fontSize: 14, lineHeight: 18, color: '#222222'}}
                                            >
                                                เนื่องจากบัญชีธนาคารอาจมีการเปลี่ยนแปลง โปรดตรวจสอบบัญชีธนาคารก่อนการโอนเงินทุกครั้ง
                                            </Text>
                                        </View>
                                    {/* 會員帳號 */}
                                        <View>
                                            <Text style={{color: '#fff', lineHeight: 35}}>
                                                <Text style={{color: "red"}}>* </Text>
                                                เลขที่บัญชีสมาชิก
                                            </Text>
                                            
                                            <View 
                                                style={{
                                                    backgroundColor: LBmemberBanks.length < 2 ? "#2A2A2A" :"#000000",
                                                    borderColor:LBmemberBanks.length < 2 ? "#2A2A2A" :'#757575',
                                                    borderWidth:1,
                                                    display: "flex",
                                                    flexDirection: 'row',
                                                    //textAlign:'left',
                                                    height: 48,
                                                    marginBottom: 10,
                                                    alignItems:'center',
                                                    borderRadius:5,
                                                    marginTop:3,
                                            }}>
                                                <Image
                                                    source={require("../../images/icon_exCard.png")}
                                                    resizeMode="stretch"
                                                    style={{ width: 23, height:15,marginLeft:18,marginRight:10}}
                                                />
                                                <Text style={{color: LBmemberBanks.length < 2 ? "#656565" : "#ccc", lineHeight:48}}>
                                                    {this.state.LBMemberBankName
                                                    ? this.state.LBMemberBankName.length > 20
                                                        ? this.state.LBMemberBankName.substr(0, 20) + ".."
                                                        : this.state.LBMemberBankName
                                                    : ""}
                                                    {" "}
                                                    {this.formatBankNo(LBmemberBanks[LBmemberBanksKey].AccountNumber)}
                                                </Text>
                                                {/* 改變 */}
                                                {LBmemberBanks.length < 2 ? null : //銀行數大於1個                                                    
                                                <TouchableOpacity 
                                                    style={{ flex:1, alignItems:'flex-end' }}
                                                    onPress={
                                                        ()=>{
                                                            this.setState({
                                                                ShowInfo:true
                                                            })
                                                        }
                                                    }
                                                >
                                                    <Text style={{color: "#00E62E", marginRight:30}}>เปลี่ยน</Text>
                                                </TouchableOpacity>}                                               
                                            </View>
                                            
                                            {LBmemberBanks.length < 2 ?//銀行數大於1個
                                            <View
                                                style={{                                              
                                                    display: "flex",
                                                    flexDirection: 'row',
                                                    height: 48,
                                                    marginBottom: 10,
                                                    alignItems:'center',
                                                    borderRadius:5,
                                                    marginTop:3,
                                                    paddingVertical: 13,
                                                    paddingHorizontal: 5,
                                                    alignContent: "flex-start",
                                                    // flex: 1
                                                }}
                                            >
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("../../images/icon_showmore.png")}
                                                    style={{ width: 15, height: 15, marginBottom:25, marginLeft:-2, marginRight:5 }}
                                                />   
                                                
                                                <View>      
                                                    <Text
                                                        style={{ fontSize: Platform.OS == "android" ? 11:12, color: '#C38900'}}
                                                    >
                                                        ตรวจสอบให้แน่ใจว่าคุณฝากเงินจากบัญชีธนาคารนี้เท่านั้นป้องกัน 
                                                    </Text>  
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <Text
                                                            style={{ fontSize: Platform.OS == "android" ? 11:12, color: '#C38900'}}
                                                        >
                                                            ยอดเงินสูญหาย หากต้องการเปลี่ยนธนาคาร
                                                        </Text>                                                                                    
                                                        <TouchableOpacity 
                                                            onPress={
                                                                ()=>{
                                                                    this.setState({
                                                                        ShowDetail:true
                                                                    })
                                                                }
                                                            }
                                                        >
                                                            <Text style={{fontSize: 12, color: "#C38900", textDecorationLine:'underline'}}> ตรวจสอบข้อมูลที่นี่</Text>
                                                        </TouchableOpacity>  
                                                    </View> 
                                                </View>                                             
                                            </View>:
                                            <View
                                                style={{
                                                    display: "flex",
                                                    flexDirection: 'row',
                                                    height: 48,
                                                    marginBottom: 10,
                                                    alignItems:'center',
                                                    marginTop:3,
                                                    paddingVertical: 13,
                                                    paddingHorizontal: 5,
                                                    alignContent: "flex-start",
                                                }}
                                            >
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("../../images/icon_showmore.png")}
                                                    style={{ width: 15, height: 15, marginBottom:25, marginLeft:-2, marginRight:2 }}
                                                />
                                                <View style={{ marginTop:-5 }}>
                                                    <Text
                                                        style={{  fontSize: Platform.OS == "android" ? 11:12, color: '#C38900'}}
                                                    >
                                                        เพื่อป้องกันยอดเงินสูญหาย โปรดยืนยันบัญชีที่จะใช้ก่อนการโอนเงิน
                                                    </Text>
                                                    <Text
                                                        style={{  fontSize: Platform.OS == "android" ? 11:12, color: '#C38900'}}
                                                    >
                                                        ระบบจะตรวจสอบเฉพาะบัญชีที่เลือกและมีการยืนยันก่อนการโอนทุกครั้ง
                                                    </Text>
                                                </View>
                                            </View>
                                            }
                                        </View>
                                    {/* min & max deposit limit for this method */}  
                                        <View>
                                            <Text style={{color: '#fff', lineHeight: 35}}>
                                                <Text style={{color: "red"}}>* </Text>
                                                เลขที่บัญชีธนาคาร
                                            </Text>
                                            <View 
                                                style={{
                                                    backgroundColor: "#1A1A1A",
                                                    borderWidth:1,
                                                    display: "flex",
                                                    flexDirection: 'row',
                                                    height: 48,
                                                    marginBottom: 10,
                                                    alignItems:'center',
                                                    borderRadius:5,
                                                    marginTop:3,
                                                    paddingVertical: 13,
                                                    paddingHorizontal: 5,
                                                }}  
                                            >
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("../../images/icon_exMoney.png")}
                                                    style={{ width: 30, height: 20, marginLeft: 10, marginRight:8 }}
                                                />
                                                
                                                <Text style={{color: "#E8E8E8", fontSize:12}}>ฝากเงิน</Text>
                                                <Text style={{color: "#00E62E", fontSize:12}}>&nbsp;ขั้นต่ำ {BankMinBal} บาท, สูงสุด {BankMaxBal} บาท&nbsp;</Text>
                                                <Text style={{color: "#E8E8E8", fontSize:12}}>ต่อ 1 รายการ</Text>
                                            </View>
                                            
                                        </View>  
                                    {/* 銀行帳號 */}   
                                    <View        //需等於公司收款帳號                               
                                        style={[
                                            this.state.RDCode == "KAS" || 
                                            this.state.RDCode == "BKK" ||
                                            this.state.RDCode == "KTB" ||
                                            this.state.RDCode == "BOAPCL" ||
                                            this.state.RDCode == "SCB"? 
                                            [styles.bankBoxView, styles.defaultBoxView] : 
                                            styles.bankBoxView,
                                            {
                                                borderRadius: 10,
                                                position: "relative",
                                                overflow: "hidden"
                                            }
                                        ]}
                                    >
                                        <View style={{ zIndex: 10 }}>
                                            <View
                                                style={{                                            
                                                    display: "flex",
                                                    flexDirection: 'row',                                          
                                                    height: 48,
                                                    alignItems:'center',
                                                    borderRadius:5,
                                                    marginTop:3,
                                                }}
                                            >
                                                {Boolean(
                                                    this.state.RDCode == "KAS" || 
                                                    this.state.RDCode == "BKK" ||
                                                    this.state.RDCode == "KTB" ||
                                                    this.state.RDCode == "BOAPCL" ||
                                                    this.state.RDCode == "SCB"
                                                ) ? (
                                                    <View
                                                        style={{
                                                        backgroundColor: "#fff",
                                                        borderRadius: 100,
                                                        width: 40,
                                                        height: 40,
                                                        alignItems: "flex-start",
                                                        justifyContent: "center",
                                                        marginRight:15
                                                        }}
                                                    >
                                                        <Image
                                                            style={{ height: 40, width: 40 }}
                                                            source={this.state.RDCode == "KAS" ? 
                                                                require("../../images/banksIcon/KAS.png"):
                                                                this.state.RDCode == "BKK" ?
                                                                require("../../images/banksIcon/BKK.png"):
                                                                this.state.RDCode == "KTB" ?
                                                                require("../../images/banksIcon/KTB.png"):
                                                                this.state.RDCode == "BOAPCL" ?
                                                                require("../../images/banksIcon/BOAPCL.png"):
                                                                this.state.RDCode == "SCB" &&
                                                                require("../../images/banksIcon/SCB.png") 
                                                            }
                                                        />
                                                    </View>
                                                    ) : (
                                                    <Image
                                                        style={{width: 40, height: 40, marginRight:10}}
                                                        source={require("../../images/bank/Default-Card.png")}
                                                    />
                                                )}                                                     
                                                <Text style={{ color:'#FFFFFF', fontSize:18 }}>{this.state.RDBank}</Text>
                                            </View>
                                        
                                            <View>
                                                <Text style={{ color:'#FFFFFF80', fontSize:16, }}>{this.state.RDBankName}</Text>
                                            </View>
                                            <View>                                    
                                                <Text style={{ color:'#FFFFFF', fontSize:16, }}>{this.state.RDBankAcc}</Text>
                                            </View>
                                        </View>
                                        {Boolean(
                                            this.state.RDCode == "KAS" || 
                                            this.state.RDCode == "BKK" ||
                                            this.state.RDCode == "KTB" ||
                                            this.state.RDCode == "BOAPCL" ||
                                            this.state.RDCode == "SCB"
                                        ) ? (
                                            <View
                                                style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                top: 0,
                                                bottom: 0,
                                                flexDirection: "row",
                                                justifyContent: "flex-end",
                                                alignItems: "center",
                                                backgroundColor: this.state.RDCode == "KAS" ? '#009B1E' :this.state.RDCode == "BKK" ? '#3A5CC6' : this.state.RDCode == "KTB" ? '#09A5E2' :this.state.RDCode == "BOAPCL" ? '#FFBD08' :this.state.RDCode == "SCB" ? '#5C2D91' :null
                                                }}
                                            >
                                                <Image
                                                style={{
                                                    height: 60,
                                                    width: 60,
                                                    transform: [{ scale: 3 }],
                                                    opacity: 0.1,
                                                    marginRight: 70
                                                }}
                                                source={this.state.RDCode == "KAS" ? 
                                                        require("../../images/banksIcon/KAS.png"):
                                                        this.state.RDCode == "BKK" ?
                                                        require("../../images/banksIcon/BKK.png"):
                                                        this.state.RDCode == "KTB" ?
                                                        require("../../images/banksIcon/KTB.png"):
                                                        this.state.RDCode == "BOAPCL" ?
                                                        require("../../images/banksIcon/BOAPCL.png"):
                                                        this.state.RDCode == "SCB" &&
                                                        require("../../images/banksIcon/SCB.png") 
                                                    }
                                                />
                                            </View>
                                            ):
                                            (
                                                <View
                                                    style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    flexDirection: "row",
                                                    justifyContent: "flex-end",
                                                    alignItems: "center",
                                                    backgroundColor: "#04AD90"
                                                    }}
                                                >
                                                    <Image
                                                    style={{
                                                        height: 60,
                                                        width: 60,
                                                        transform: [{ scale: 3 }],
                                                        opacity: 1,
                                                        marginRight: 70
                                                    }}
                                                    source={require("../../images/bank/Default-Back-Card.png")}
                                                    />
                                                </View>
                                            )
                                        }

                                        <View style={{ marginBottom:10, marginTop:10 }}>
                                            <TouchableOpacity style={styles.copyRdWrap}>
                                                <Image
                                                    style={{ width:20, height:20, marginLeft:15, marginRight:10 }}
                                                    source={require("../../images/bank/copycopy.png")}/>
                                                <Text
                                                    onPress={() => {this.CopyText(this.state.RDBankAcc)}}
                                                    style={styles.copyRdBtn}
                                                >
                                                    คัดลอกหมายเลขบัญชี
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* 存款程序教程 */}
                            {returnEmpty == false &&
                            <View>
                                <Touch 
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                                    style={{
                                        display: "flex",
                                        flexDirection: 'row',
                                        textAlign:'left',
                                        height:55, 
                                        alignSelf:'center',
                                        alignItems:'center',
                                        marginBottom:20,
                                        marginTop:10,
                                    }} 
                                    onPress={() => { this.setState({ showEXPTutorailModal: true, currentCTCguid:paymentchannelEND, onPageChangedINdex: 0  }), UMonEvent('Deposit Nav', 'Click', 'Tutorial_LBExpress')}}
                                    //onPress={()=>this.setState({showEXPTutorailModal:true})}
                                >
                                    <Image 
                                        resizeMode='stretch' 
                                        source={require('../../images/tutorial/exp_tutorial_btn.png')} 
                                        style={{ width:25, height: 25, marginRight:5}} 
                                    />
                                     <Text style={{ color: '#00E62E', fontSize: 18, textDecorationLine:'underline' }}>ขั้นตอนการฝาก</Text>
                                </Touch>
                            </View>}
                        </View>
                    ):null}

                    {NowBankType == 'RD' && returnEmpty == true &&
                        (
                            <View> 
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/No_Bank.png")}
                                    style={{ width: 100, height:100,alignSelf:'center',marginBottom:10,  marginTop:100}}
                                />
                                <Text style={{ textAlign: 'center', color: "#BCBCBC" }}>
                                    ขณะนี้ธนาคารไม่สามารถให้บริการได้ กรุณาฝากช่องทางอื่น
                                </Text>
                                <View style={{ flexDirection: 'row', display: "flex", justifyContent:'center' }}>
                                    <Text
                                        style={{ fontSize: 14, color: '#BCBCBC'}}
                                    >
                                        หรือติดต่อ
                                    </Text>                                                                                    
                                    <TouchableOpacity 
                                        onPress={
                                            ()=>{
                                                Actions.LiveChatST(), 
                                                UMonEvent('CS', 'Click', 'CS_NoBank_LBExpress')
                                            }
                                        }
                                    >
                                        <Text style={{color: "#00E62E", textDecorationLine:'underline'}}> ฝ่ายบริการลูกค้า </Text>
                                    </TouchableOpacity>  
                                    <Text style={{ color: "#BCBCBC" }}>
                                        เพื่อให้ความช่วยเหลือ​
                                    </Text>
                                </View> 
                            </View>
                        )
                    }
                    

                    {NowBankType == "THBQR" && !this.state.THBQR_step_2 &&
                    <View style={{backgroundColor: "#1A1A1A", marginTop: 14}}>

                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <View style={styles.moneyTitle}>
                                <Text style={{ color: '#fff' }}><Text style={{ color: "red" }}>* </Text>ยอดเงินฝาก</Text>
                                <Text style={{ color: '#00b324' }}>{payMoney && payMoney}</Text>
                            </View>
                            <View style={styles.DsBorder}>
                                <InputItem styles={StyleSheet.create(newStyle)}
                                           placeholderTextColor="#969696"
                                           type="number"
                                           value={this.state.payMoney}
                                           onChange={(values) => {
                                               let newText = values.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
                                               this.setState({
                                                   payMoney: newText,
                                               }, () => { this.payMoneyST() });
                                           }}
                                           onBlur={() => {
                                               this.onChange('', '', this.state.payMoney);
                                           }}
                                           onFocus={() => { }}
                                           placeholder={payMoney && payMoney.toString() || 'ช่องจำนวนเงินฝาก : ' + BankMinBal + ' ~ ' + BankMaxBal}
                                >
                                </InputItem>
                            </View>
                            {
                                payMoneySTMsg != '' &&
                                <Text style={{ color: '#ff0000', fontSize: 12 }}>{payMoneySTMsg}</Text>
                            }
                        </View>
                    </View>

                    }

                    {NowBankType == "EZP" &&    //微轉帳
                    <View style={{backgroundColor: "#1A1A1A"}}>
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <View style={styles.moneyTitle}>
                                <Text style={{ color: '#fff' }}><Text style={{ color: "red" }}>* </Text>จำนวนเงินฝาก</Text>
                                <Text style={{ color: '#00b324' }}>{payMoney && payMoney}</Text>
                            </View>
                            <View style={styles.DsBorder}>
                                <InputItem styles={StyleSheet.create(newStyle)}
                                           placeholderTextColor="#969696"
                                           type="number"
                                           value={this.state.payMoney}
                                           onChange={(values) => {
                                               let newText = values.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\.*)(\d+)(\.?)(\d{0,2}).*$/g, '$2$3$4');
                                               this.setState({
                                                   payMoney: newText,
                                               }, () => { this.payMoneyST() });
                                           }}
                                           onBlur={() => {
                                               this.onChange('', '', this.state.payMoney);
                                           }}
                                           onFocus={() => { }}
                                           placeholder={payMoney && payMoney.toString() || 'ช่องจำนวนเงินฝาก :  ' + BankMinBal + ' ~ ' + BankMaxBal}
                                >
                                </InputItem>
                            </View>
                            {
                                payMoneySTMsg != '' &&
                                <Text style={{ color: '#ff0000', fontSize: 12 }}>{payMoneySTMsg}</Text>
                            }
                        </View>

                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>ธนาคาร</Text>
                            {
                                userBank.length == 0 &&
                                <View style={styles.DsBorder}>
                                    <View style={[styles.DSarrow, { position: 'absolute', right: 10 }]}></View>
                                    <View>
                                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.openLiveChat()}>
                                            <Text style={{ fontSize: 13, color: '#00b324', textAlign: 'left', width: width - 60 }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            {
                                userBank.length > 0 &&
                                <View style={styles.DsBorder}>
                                    <ModalDropdown ref={el => this._dropdown_3 = el}
                                                   defaultValue={userBank[0].label}
                                                   textStyle={styles.DSdropdown_D_text}
                                                   dropdownStyle={styles.DSdropdown_D_dropdown}
                                                   options={userBank}
                                                   renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                                   renderRow={this._dropdown_2_renderRow.bind(this)}
                                                   onSelect={this.BCBankTG}
                                                   style={{ zIndex: 10, width: width - 30 }}
                                    />
                                    <View style={{ position: 'absolute', right: 10, paddingTop: 6 }}>
                                        <View style={styles.DSarrow}></View>
                                    </View>
                                </View>
                            }
                        </View>




                    </View>
                    }


                    {NowBankType === 'LB' ? (
                        <View>
                            {/*LB步驟條*/}
                            {LBcurrentStep !== 3? (
                                <View style={styles.stepList}>
                                    {LBcurrentStep !== 1 ? (
                                        <Image
                                            resizeMode="stretch"
                                            source={require("../../images/fill.png")}
                                            style={{ width: 42, height: 42 }}
                                        />
                                    ) : (
                                        <View style={[LBcurrentStep == 1 ? styles.stepActive : styles.steps]}>
                                            <Text
                                                style={[styles.stepsText, LBcurrentStep == 1 ? styles.stepTextActive : ""]}
                                            >
                                                1
                                            </Text>
                                        </View>
                                    )}

                                    <Text
                                        // style={[styles.stepsRow, step2 ? styles.stepActive : ""]}
                                        style={[
                                            LBcurrentStep == 2 ? styles.stepsRowActive : styles.stepsRow
                                        ]}
                                        // style={step2 ? styles.stepActive : styles.stepsRow}
                                    />
                                    {LBcurrentStep == 3 ? (
                                        <Image
                                            resizeMode="stretch"
                                            source={require("../../images/fill.png")}
                                            style={{ width: 42, height: 42 }}
                                        />
                                    ) : (
                                        <View style={[LBcurrentStep == 2 ? styles.stepActive : styles.steps]}>
                                            <Text
                                                style={[styles.stepsText, LBcurrentStep == 2 ? styles.stepTextActive : ""]}
                                            >
                                                2
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            ):null}

                            {/*LB支付方法*/}
                            {LBcurrentStep != 3 && paymentchannel != '' && paymentchannel.length > 0 && (
                                <View style={{ paddingLeft: 35, paddingRight: 35, paddingBottom: 10}}>
                                    {/*<Text style={{ color: '#fff', lineHeight: 35 }}>支付渠道</Text>*/}
                                    <View style={[ styles.bankBox2New2, { zIndex: 99999 } ]}>
                                        {paymentchannel == "" ?
                                            <View style={{width: width, top: 21}}>
                                                <Text style={{textAlign: 'center', color: "#fff"}}>กำลังโหลด..</Text>
                                            </View>

                                            : paymentchannel != "" && paymentchannel.map((item, i) => {
                                            return (
                                                <RadioButton
                                                    disabled={this.state.LBcurrentStep !== 1}
                                                    onClick={() => {
                                                        console.log('click paymentchannel')
                                                        console.log(i)
                                                        this.paymentchannelDWButton(i)
                                                        this.setState({lbRechargeMethod: i});
                                                    }}
                                                    text={item.label}
                                                    selected={this.state.lbRechargeMethod === i}
                                                >

                                                    <Text style={{
                                                        color: '#fff',
                                                        marginLeft: 3,
                                                        fontSize: 15
                                                    }}>{item.label}</Text>
                                                    {item.value === 'UniqueAmt' ? <Text style={{
                                                        color: '#FF0000',
                                                        fontSize: 13,
                                                        top: -10,
                                                    }}>ปรับไว!</Text> : null}
                                                    {(LBcurrentStep == 1 || LBcurrentStep == 2) && item.value === 'UniqueAmt' && 
                                                    this.state.lbRechargeMethod === 1 && !this.state.lastIsFast && this.state.fastTextShow && !this.state.historyFast  && 
                                                    <View style={styles.triangle}></View>}
                                                    
                                                </RadioButton>
                                            )
                                        })
                                        }

                                        {
                                            // 快速付款第二步驟文字
                                            this.state.lbRechargeMethod === 1 && this.state.LBcurrentStep === 2 && (
                                                <Text style={{color: "#FF420A", paddingHorizontal: 10, lineHeight: 19, marginBottom: 20}}>
                                                    การทำรายการฝากเริ่มต้น: {moment().format('YYYY-MM-DD HH:mm:ss')}
                                                    {'\n'}
                                                    โปรดทำรายการฝากของคุณให้เสร็จสิ้นภายใน 30 นาที มิฉะนั้นระบบจะทำการยกเลิกโดยอัตโนมัติ
                                                </Text>
                                            )
                                        }
                                    </View>
                                </View>
                            )}

                            {/*LB第一步*/}
                            {(LBcurrentStep == 1 || LBcurrentStep == 2) && (<View>

                                <View style={{backgroundColor: "#1A1A1A", paddingLeft: 15, paddingRight: 15, paddingTop: 15}}>
                                    {/* fast提示訊息 */}
                                    {this.state.lbRechargeMethod === 1 && !this.state.lastIsFast && this.state.fastTextShow && !this.state.historyFast && (
                                        <View style={{zIndex: 99999, alignItems:'flex-end',position:'absolute',top:0,left:15}} >
                                            <TouchableOpacity
                                                hitSlop={{
                                                    top: 10,
                                                    bottom: 10,
                                                    left: 10,
                                                    right: 10
                                                }}
                                                style={{zIndex: 99999,backgroundColor: "#00B324", borderRadius: 5, width: width - 30,paddingHorizontal: 10, paddingVertical: 14}}
                                                onPress={()=>this.setState({
                                                    fastTextShow: false
                                                })}>
                                                <Text style={{fontSize: 12,color: "#fff", lineHeight: 20}}>
                                                    เพื่อการปรับยอดที่รวดเร็วยิ่งขึ้น เราแนะนำให้ทำการฝากตามยอด ที่ระบบระบุเท่านั้นช่วยให้การฝากและปรับยอดของคุณรวดเร็วยิ่งขึ้น
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    {(this.state.lbRechargeMethod == 0 || LBcurrentStep == 1 || this.state.isOtherAcc) ? (
                                        <View >
                                            {/* 充值金额输入框 Deposite amount*/}
                                            <View style={styles.moneyTitle}>
                                                <Text style={{color: '#fff'}}><Text style={{color: "red"}}>* </Text>จำนวนเงินฝาก</Text>
                                                <Text style={{color: '#00b324'}}>{payMoney && payMoney}</Text>
                                            </View>
                                            <View style={styles.DsBorder}>
                                                <InputItem styles={StyleSheet.create(newStyle)}
                                                           placeholderTextColor="#969696"
                                                           type="number"
                                                           value={this.state.payMoney}
                                                           onChange={(values) => {
                                                               let newText = values.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\.*)(\d+)(\.?)(\d{0,2}).*$/g, '$2$3$4');
                                                               this.setState({
                                                                   payMoney: newText,
                                                               }, () => {
                                                                   this.payMoneyST()
                                                               });
                                                           }}
                                                           editable={LBcurrentStep == 1 || (LBcurrentStep == 2 && this.state.lbRechargeMethod == 0 && this.state.changeWord)}
                                                           onBlur={() => {
                                                               this.onChange('', '', this.state.payMoney);
                                                           }}
                                                           onFocus={() => {
                                                           }}
                                                           placeholder={payMoney && payMoney.toString() || 'ช่วงจำนวนเงิน: ' + BankMinBal + ' ~ ' + BankMaxBal}
                                                >
                                                </InputItem>
                                            </View>
                                            {
                                                payMoneySTMsg != '' &&
                                                <Text style={{color: '#ff0000', fontSize: 12}}>{payMoneySTMsg}</Text>
                                            }
                                            {this.state.isNew3 && LBmemberBanks.length > 0 ? null : this.addNewBankText()}
                                        </View>
                                    ) : (
                                        <View>
                                            <View style={styles.moneyTitle}>
                                                <Text style={{color: '#fff'}}><Text style={{color: "red"}}>* </Text>จำนวนเงินฝาก</Text>
                                            </View>
                                            <Flex style={styles.copyWrap}>
                                                <Flex.Item>
                                                    <Text style={styles.copyText}>
                                                        {this.state.uniqueAmount}
                                                    </Text>
                                                </Flex.Item>
                                                <Flex.Item style={{alignItems: 'flex-end'}}>
                                                    <TouchableOpacity style={styles.copyBtnWrap}>
                                                        <Text
                                                            onPress={() => this.CopyText(this.state.uniqueAmount)}
                                                            style={styles.copyBtn}>
                                                            คัดลอก
                                                        </Text>
                                                    </TouchableOpacity>
                                                </Flex.Item>
                                            </Flex>
                                        </View>
                                    )}
                                </View>
                                {/* 銀行帳號 */}

                                {/* 新增银行卡的 模式*/}
                                {this.lbFastStepOne() && LBmemberBanks.length == 0 && (
                                    <View style={{backgroundColor: '#1A1A1A'}}>
                                        {/* 存款人姓名 */}
                                        <View style={{paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>ชื่อ-นามสกุล</Text>
                                            <View style={styles.DsBorder}>
                                                <InputItem styles={StyleSheet.create(newStyle)}
                                                           placeholderTextColor="#969696"
                                                           type="text"
                                                           value={this.state.userName || newQr}
                                                           onChange={(value) => {
                                                               let newText = this.filterName(value)
                                                               this.setState({userName: newText}, () => {
                                                                   this.userNameST()
                                                               });
                                                           }}
                                                           onBlur={() => {
                                                           }}
                                                           onFocus={() => {
                                                           }}
                                                           placeholder={'กรุณากรอกชื่อจริงของคุณ'}
                                                >
                                                </InputItem>
                                            </View>
                                            {
                                                UserNameError != '' &&
                                                <Text style={{color: '#ff0000', fontSize: 12}}>{UserNameError}</Text>
                                            }
                                        </View>

                                        {/* 存款银行名称 */}
                                        <View style={{paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>บัญชีของคุณ</Text>
                                            {console.log(this.state)}
                                            {
                                                LBBanks === '' ?
                                                    <View style={styles.DsBorder}>
                                                        <Text style={{fontSize: 13, color: "#fff"}}>กำลังโหลด..</Text>
                                                    </View>
                                                    : LBBanks.length == 0 ?
                                                    <View style={styles.DsBorder}>
                                                        <View style={[styles.DSarrow, {
                                                            position: 'absolute',
                                                            right: 10
                                                        }]} />
                                                        <View>
                                                            <TouchableOpacity
                                                                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                                onPress={() => this.openLiveChat()}>
                                                                <Text style={{
                                                                    fontSize: 13,
                                                                    color: '#00b324',
                                                                    textAlign: 'left',
                                                                    width: width - 60
                                                                }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View> : LBBanks.length > 0 ? (
                                                        <View style={styles.DsBorder}>
                                                            <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                           defaultValue='กรุณาเลือก'
                                                                           textStyle={styles.DSdropdown_D_text}
                                                                           dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                           options={LBBanks}
                                                                           renderButtonText={(rowData) => `${rowData.Name}`}
                                                                           renderRow={this._dropdown_5_renderRow.bind(this)}
                                                                           onSelect={this.LBBanksClick}
                                                                           style={{zIndex: 10, width: width - 30}}
                                                            />
                                                            <View style={{
                                                                position: 'absolute',
                                                                right: 10,
                                                                paddingTop: 6
                                                            }}>
                                                                <View style={styles.DSarrow}></View>
                                                            </View>
                                                        </View>
                                                    ) : null
                                            }
                                        </View>

                                        {/* 存款卡号 accountNumber */}
                                        <View style={{paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>เลขบัญชีธนาคาร</Text>
                                            <View style={styles.DsBorder}>
                                                <InputItem styles={StyleSheet.create(newStyle)}
                                                           placeholderTextColor="#969696"
                                                           type="number"
                                                           value={this.state.accountNumber}
                                                           maxLength={50}
                                                           onChange={(value) => {
                                                               let newText = this.filterNumber(value)
                                                               //let newText = value.replace(/[^0-9]/ig,"")
                                                               this.setState({
                                                                   accountNumber: newText
                                                               })
                                                           }}
                                                           onBlur={() => {
                                                           }}
                                                           onFocus={() => {
                                                           }}
                                                >
                                                </InputItem>
                                            </View>
                                            {this.state.isNew3 && LBmemberBanks.length > 0? null : (
                                                <CheckBox
                                                    checkBoxColor={'#00E62E'}
                                                    checkedCheckBoxColor={'#00E62E'}
                                                    style={{ width: 200 }}
                                                    onClick={() => {
                                                        this.setState({
                                                            isSaveBankChecked: !this.state.isSaveBankChecked
                                                        });
                                                    }}
                                                    isChecked={this.state.isSaveBankChecked}
                                                    rightTextView={
                                                        <Text style={{color: "#fff" }}>จำข้อมูลธนาคารของฉัน</Text>
                                                    }
                                                />
                                            )}

                                        </View>
                                    </View>
                                )}
                                {console.log(this.state)}
                                {/* 用户添加过的存款银行卡 */}
                                {this.lbFastStepOne() && LBmemberBanks.length > 0 && (
                                    <View>
                                        <View style={{
                                            backgroundColor: "#1A1A1A",
                                            paddingLeft: 15,
                                            paddingRight: 15,
                                        }}>

                                            <View>
                                                <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>บัญชีของคุณ</Text>
                                                {console.log(this.state)}
                                                {
                                                    LBmemberBanks == '' ?
                                                        <View style={styles.DsBorder}>
                                                            <Text style={{fontSize: 13, color: "#fff"}}>กำลังโหลด..</Text>
                                                        </View>
                                                        : LBmemberBanks!=='' ? (
                                                            <View style={styles.DsBorder}>
                                                                <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                               defaultValue={
                                                                                   `${LBmemberBanks[LBmemberBanksKey].BankName}-${this.state.accountNumber.slice(-6)}` || "กรุณาเลือกธนาคาร"
                                                                               }
                                                                               textStyle={styles.DSdropdown_D_text}
                                                                               dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                               options={LBmemberBanks}
                                                                               renderButtonText={(rowData) => `${rowData.BankName}-${rowData.AccountNumber.slice(-6)}`}
                                                                               renderRow={this._dropdown_7_renderRow.bind(this)}
                                                                               onSelect={this.onMemberBankSelect}
                                                                               style={{zIndex: 10, width: width - 30}}
                                                                />
                                                                <View style={{
                                                                    position: 'absolute',
                                                                    right: 10,
                                                                    paddingTop: 6
                                                                }}>
                                                                    <View style={styles.DSarrow}></View>
                                                                </View>
                                                            </View>
                                                        ):null
                                                }
                                            </View>
                                        </View>

                                        <View style={{backgroundColor: "#000", paddingHorizontal: 16, marginVertical: 15}}>
                                            <View style={{
                                                backgroundColor: "#1A1A1A",
                                                paddingHorizontal: 20,
                                                paddingVertical: 11,
                                                borderRadius: 8
                                            }}>
                                                <Flex>
                                                    <Flex.Item>
                                                        <Text
                                                            style={{color: "#ccc"}}>ชื่อ-นามสกุล: {LBmemberBanks[LBmemberBanksKey].AccountHolderName}</Text>
                                                    </Flex.Item>                                                    
                                                </Flex>
                                                <Flex style={{marginTop: 11}}>                                                   
                                                    <Flex.Item>
                                                        <Text
                                                            style={{color: "#ccc"}}>ธนาคาร: {LBmemberBanks[LBmemberBanksKey].BankName}</Text>
                                                    </Flex.Item>
                                                </Flex>
                                                <Flex style={{marginTop: 11}}>
                                                    <Flex.Item>
                                                        <Text 
                                                            style={{color: "#ccc"}}>เลขที่บัญชี: {LBmemberBanks[LBmemberBanksKey].AccountNumber}</Text>
                                                    </Flex.Item>
                                                </Flex>
                                                <Text style={{
                                                    color: "#00E62E",
                                                    textAlign: 'center',
                                                    marginTop: 11
                                                }}>ในกรณีที่คุณต้องการเพิ่มบัญชีใหม่</Text>
                                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{color: "#00E62E"}}>กรุณาติดต่อฝ่ายบริการลูกค้าที่{' '}</Text>
                                                    <TouchableOpacity onPress={()=>Actions.LiveChatST()}>
                                                        <Text style={{color: "#00E62E", textDecorationLine: 'underline'}}>ห้องช่วยเหลือสด</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {
                                    LBcurrentStep != 2?(
                                        <View
                                                style={{backgroundColor: "#1A1A1A", paddingLeft: 15, paddingRight: 15}}>
                                                <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>กรุณาเลือกธนาคาร</Text>
                                                {
                                                    userBank === '' ?
                                                        <View style={styles.DsBorder}>
                                                            <Text style={{fontSize: 13, color: "#fff"}}>กำลังโหลด..</Text>
                                                        </View>
                                                        : userBank.length == 0 &&
                                                        <View style={styles.DsBorder}>
                                                            <View style={[styles.DSarrow, {position: 'absolute', right: 10}]}></View>
                                                            <View>
                                                                <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                                                onPress={() => this.openLiveChat()}>
                                                                    <Text style={{
                                                                        fontSize: 13,
                                                                        color: '#00b324',
                                                                        textAlign: 'left',
                                                                        width: width - 60
                                                                    }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                }
                                                {
                                                    userBank.length > 0 &&
                                                    <View style={styles.DsBorder}>
                                                        <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                    //defaultValue={`${this.state.UserCheackBank}-${this.state.userBank[0].AccountNo.slice(-6)}`}
                                                                    defaultValue={`${userBank[0].label}-${userBank[0].AccountNo.slice(-6)}`}
                                                                    textStyle={styles.DSdropdown_D_text}
                                                                    dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                    options={userBank}
                                                                    renderButtonText={(rowData) => `${rowData.label}-${rowData.AccountNo.slice(-6)}`}
                                                                    renderRow={this._dropdown_6_renderRow.bind(this)}
                                                                    onSelect={this.onAccountSelect}
                                                                    //onSelect={() => this.userBankD}
                                                                    style={{zIndex: 10, width: width - 30}}
                                                        />
                                                        <View style={{position: 'absolute', right: 10, paddingTop: 6}}>
                                                            <View style={styles.DSarrow}></View>
                                                        </View>
                                                    </View>
                                                }

                                                {!this.state.isOtherAcc&&LBcurrentStep == 1 && (
                                                    <View>
                                                        <TouchableOpacity onPress={() => {
                                                            this.onPaymentMethodChange(0)
                                                        }
                                                        }>
                                                            <Text style={{color: '#00E62E'}}>ฝากเข้าบัญชีธนาคารอื่นๆ <Text style={{textDecorationLine: 'underline', textDecorationColor: "#00E62E"}}>คลิกที่นี่</Text></Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}

                                            </View>
                                        ):
                                        this.lbFastStepOne() &&
                                        <View style={{backgroundColor: "#1A1A1A", paddingLeft: 15, paddingRight: 15}}>
                                            <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>กรุณาเลือกธนาคาร</Text>


                                            {
                                                userBank.length == 0 &&
                                                <View style={styles.DsBorder}>
                                                    <View style={[styles.DSarrow, {position: 'absolute', right: 10}]}></View>
                                                    <View>
                                                        <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                                                        onPress={() => this.openLiveChat()}>
                                                            <Text style={{
                                                                fontSize: 13,
                                                                color: '#00b324',
                                                                textAlign: 'left',
                                                                width: width - 60
                                                            }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                            {
                                                userBank.length > 0 && this.state.isOtherAcc &&
                                                <View style={styles.DsBorder3}>
                                                    <View>
                                                        <Text style={{
                                                            fontSize: 13,
                                                            color: '#999999',
                                                            textAlign: 'left',
                                                            width: width - 60
                                                        }}>ฝากเข้าบัญชีธนาคารอื่นๆ</Text>
                                                    </View>
                                                </View>
                                            }
                                            {
                                                userBank.length > 0 && !this.state.isOtherAcc &&
                                                <View style={styles.DsBorder}>
                                                    <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                //defaultValue={`${this.state.UserCheackBank}-${this.state.userBank[0].AccountNo.slice(-6)}`}
                                                                defaultValue={`${userBank[this.state.userBankD].label}-${userBank[this.state.userBankD].AccountNo.slice(-6)}`}
                                                                textStyle={styles.DSdropdown_D_text}
                                                                dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                options={userBank}
                                                                renderButtonText={(rowData) => `${rowData.label}-${rowData.AccountNo.slice(-6)}`}
                                                                renderRow={this._dropdown_6_renderRow.bind(this)}
                                                                //onSelect={() => this.userBankD}
                                                                onSelect={this.onAccountSelect}
                                                                style={{zIndex: 10, width: width - 30}}
                                                                disabled={true}
                                                    />
                                                    <View style={{position: 'absolute', right: 10, paddingTop: 6}}>
                                                        <View style={styles.DSarrow}></View>
                                                    </View>
                                                </View>
                                            }
                                        </View>
                                }



                            </View>)}

                            {/*LB第二步*/}
                            {console.log(this.state)}
                            {LBcurrentStep == 2 && (
                                <View style={{zIndex: 9999}}>
                                    <View style={{
                                        backgroundColor: "#1A1A1A",
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                    }}>
                                    </View>

                                    {/*正常方式*/}
                                    {
                                        this.state.lbRechargeMethod == 0 && (
                                            <View style={{
                                                backgroundColor: "#1A1A1A",
                                                paddingLeft: 15,
                                                paddingRight: 15,
                                            }}>

                                                {/* 卡号最后6位 */}
                                                {this.state.isOtherAcc && <View>
                                                    <View style={styles.moneyTitle}>
                                                        <Text style={{color: '#fff'}}><Text
                                                            style={{color: "red"}}>* </Text>เลข 6 หลักท้ายบัญชี</Text>
                                                    </View>
                                                    <View style={styles.DsBorder}>
                                                        <InputItem styles={StyleSheet.create(newStyle)}
                                                                   type="number"
                                                                   value={this.state.lastSixNumber}
                                                                   editable={true}
                                                                   maxLength={6}
                                                                   onChange={(value) => {
                                                                       let newText = value.replace(/[^0-9]/ig, "")
                                                                       this.setState({
                                                                           lastSixNumber: newText
                                                                       })
                                                                   }}
                                                        >
                                                        </InputItem>
                                                    </View>
                                                </View>
                                                }
                                                {/*holdername*/}
                                                {!this.state.isOtherAcc && Array.isArray(userBank) && userBank.length > 0 && userBank != "" && BankData.bankAccounts.length > 0 && (
                                                    <View>
                                                        {/* 账户姓名 */}
                                                        <View style={{
                                                            backgroundColor: "#1A1A1A",
                                                        }}>
                                                            <View style={styles.moneyTitle}>
                                                                <Text style={{color: '#fff'}}><Text
                                                                    style={{color: "red"}}>* </Text>ชื่อบัญชี</Text>
                                                            </View>
                                                            <Flex justify="between" style={styles.copyWrap}>
                                                                <Flex.Item>
                                                                    <Text style={styles.copyText}>
                                                                        {BankData.bankAccounts[this.state.userBankD].AccountHolderName}
                                                                    </Text>
                                                                </Flex.Item>
                                                                <Flex.Item style={{alignItems: 'flex-end'}}>
                                                                    <TouchableOpacity style={styles.copyBtnWrap}>
                                                                        <Text
                                                                            onPress={() => this.CopyText(BankData.bankAccounts[this.state.userBankD].AccountHolderName)}
                                                                            style={styles.copyBtn}>
                                                                            คัดลอก
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </Flex.Item>
                                                            </Flex>
                                                        </View>

                                                        {/* 银行帐号 */}
                                                        <View style={{
                                                            backgroundColor: "#222",
                                                        }}>
                                                            <View style={styles.moneyTitle}>
                                                                <Text style={{color: '#fff'}}><Text
                                                                    style={{color: "red"}}>* </Text>เลขที่บัญชี</Text>
                                                            </View>
                                                            <Flex justify="between" style={styles.copyWrap}>
                                                                <Flex.Item>
                                                                    <Text style={styles.copyText}>
                                                                        {BankData.bankAccounts[this.state.userBankD].AccountNo}
                                                                    </Text>
                                                                </Flex.Item>
                                                                <Flex.Item style={{alignItems: 'flex-end'}}>
                                                                    <TouchableOpacity style={styles.copyBtnWrap}>
                                                                        <Text
                                                                            onPress={() => this.CopyText(BankData.bankAccounts[this.state.userBankD].AccountNo)}
                                                                            style={styles.copyBtn}>
                                                                            คัดลอก
                                                                        </Text>
                                                                    </TouchableOpacity>
                                                                </Flex.Item>
                                                            </Flex>
                                                        </View>
                                                    </View>
                                                )}
                                                {/* 存款方式 Deposite Channels*/}
                                                {
                                                    LBpay === '' ?
                                                        <View style={styles.DsBorder}>
                                                            <Text
                                                                style={{fontSize: 13, color: "#fff"}}>กำลังโหลด..</Text>
                                                        </View>
                                                        : LBpay.length == 0 ?
                                                        (<View>
                                                            <View style={styles.moneyTitle}>
                                                                <Text style={{color: '#fff'}}><Text
                                                                    style={{color: "red"}}>* </Text>ช่องทางการฝากเงิน</Text>
                                                            </View>
                                                            <View style={styles.DsBorder}>
                                                                <View style={[styles.DSarrow, {
                                                                    position: 'absolute',
                                                                    right: 10
                                                                }]} />
                                                                <View>
                                                                    <TouchableOpacity hitSlop={{
                                                                        top: 10,
                                                                        bottom: 10,
                                                                        left: 10,
                                                                        right: 10
                                                                    }}
                                                                                      onPress={() => this.openLiveChat()}>
                                                                        <Text style={{
                                                                            fontSize: 13,
                                                                            color: '#00b324',
                                                                            textAlign: 'left',
                                                                            width: width - 60
                                                                        }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>
                                                        </View>) : LBpay.length > 0 ? ((<View>
                                                                <View style={styles.moneyTitle}>
                                                                    <Text style={{color: '#fff'}}><Text
                                                                        style={{color: "red"}}>* </Text>ช่องทางการฝากเงิน</Text>
                                                                </View>
                                                                <View style={styles.DsBorder}>
                                                                    <ModalDropdown ref={el => this._dropdown_3 = el}
                                                                                   defaultValue={this.state.LBpayD !== ''?`${LBpay[0].label}`:'โปรดเลือก'}

                                                                                   textStyle={styles.DSdropdown_D_text}
                                                                                   dropdownStyle={styles.DSdropdown_D_dropdown}
                                                                                   options={LBpay}
                                                                                   renderButtonText={(rowData) => `${rowData.label}`}
                                                                                   renderRow={this._dropdown_4_renderRow.bind(this)}
                                                                                   onSelect={this.LBpayD}
                                                                                   style={{
                                                                                       zIndex: 10,
                                                                                       width: width - 30
                                                                                   }}
                                                                    />
                                                                    <View style={{
                                                                        position: 'absolute',
                                                                        right: 10,
                                                                        paddingTop: 6
                                                                    }}>
                                                                        <View style={styles.DSarrow}></View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )) : null
                                                }

                                                {/* 充值时间 Deposite time */}
                                                <View style={styles.moneyTitle}>
                                                    <Text style={{color: '#fff'}}><Text style={{color: "red"}}>* </Text>วันที่ฝาก</Text>
                                                </View>
                                                <View style={styles.DsBorder}>
                                                    <DatePicker
                                                        value={this.state.offlineDepositDate}
                                                        dafiltValue
                                                        mode="date"
                                                        extra="เลือกวันที่"
                                                        minDate={new Date(`2019/07/01`)}
                                                        maxDate={new Date()}
                                                        onChange={offlineDepositDate => {
                                                            this.setState({
                                                                offlineDepositDate
                                                            })
                                                        }}
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
                                                        <List.Item arrow="down" styles={StyleSheet.create(newStyle9)}/>
                                                    </DatePicker>
                                                  
                                                </View>

                                                <View style={styles.moneyTitle}>
                                                    <Text style={{color: '#fff'}}><Text style={{color: "red"}}>* </Text>เวลา</Text>
                                                </View>
                                                <Flex>
                                                    <Flex.Item style={styles.DsBorder}>
                                                        <Picker
                                                            data={dataHour}
                                                            cols={1}
                                                            value={offlineDepositHour}
                                                            onChange={offlineDepositHour => {
                                                                console.log(offlineDepositHour)
                                                                this.setState({offlineDepositHour})
                                                            }}
                                                            extra="เลือกวันที่"
                                                            locale={{
                                                                okText: "ตกลง",
                                                                dismissText: "ยกเลิก"
                                                            }}
                                                            // onVisibleChange={() => { this.onVisibleChange() }}
                                                        >
                                                            <List.Item arrow="down"
                                                                       styles={StyleSheet.create(newStylePicker)}/>
                                                        </Picker>
                                                    </Flex.Item>
                                                    <Text style={{marginHorizontal: 17, color: '#CCCCCC'}}>-</Text>
                                                    <Flex.Item style={styles.DsBorder}>
                                                        <Picker
                                                            data={dataSecond}
                                                            cols={1}
                                                            value={offlineDepositMinute}
                                                            onChange={offlineDepositMinute => {
                                                                console.log(offlineDepositMinute)
                                                                this.setState({offlineDepositMinute})
                                                            }}
                                                            extra="เลือกวันที่"
                                                            locale={{
                                                                okText: "ตกลง",
                                                                dismissText: "ยกเลิก"
                                                            }}
                                                            // onVisibleChange={() => { this.onVisibleChange() }}
                                                        >
                                                            <List.Item arrow="down"
                                                                       styles={StyleSheet.create(newStylePicker)}/>
                                                        </Picker>
                                                    </Flex.Item>
                                                </Flex>

                                                {/* normal 上傳圖片 */}
                                                <View style={styles.moneyTitle}>
                                                    <Text style={{color: '#fff'}}>สลิปโอนเงิน</Text>
                                                </View>
                                                <Flex justify="between" style={styles.copyWrap}>
                                                    <Flex.Item>
                                                        <Text style={styles.copyText}>
                                                            {this.state.avatarName}
                                                        </Text>
                                                    </Flex.Item>
                                                    <Flex.Item style={{alignItems: 'flex-end'}}>
                                                        <TouchableOpacity style={styles.copyBtnWrap}
                                                                          onPress={this.selectPhotoTapped.bind(this)}>
                                                            <Text
                                                                style={styles.copyBtn}>
                                                                อัพโหลดไฟล์
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </Flex.Item>
                                                </Flex>
                                            </View>
                                        )
                                    }

                                    {/* fast方式 */}
                                    {
                                        this.state.lbRechargeMethod == 1 &&
                                        Array.isArray(userBank) && userBank.length > 0 && userBank != "" && BankData.bankAccounts.length > 0 &&
                                        <View>
                                            
                                            {/*fast 金額提示訊息*/}
                                            {this.state.fastMoneyNoticeShow && (
                                                <View style={{zIndex: 9999, alignItems:'flex-end',position:'absolute',top:12,left:15}} >
                                                    <TouchableOpacity
                                                        hitSlop={{top: 10, bottom: 10, left: 5, right: 5}}
                                                        style={{backgroundColor: "#00B324", borderRadius: 5, width: width - 30}}
                                                        onPress={()=>this.setState({fastMoneyNoticeShow: false})}>
                                                        <Text style={{color: "#fff", paddingHorizontal: 10, paddingVertical: 14, lineHeight: 20}}>
                                                            กรุณาโอนยอดเงินเป็นจำนวนที่มีเศษทศนิยมตามที่ระบบกำหนด เท่านั้นเพื่อความรวดเร็วในการตรวจสอบและอนุมัติยอดเงิน
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <View style={styles.triangle2}></View>
                                                </View>
                                            )}

                                            {/* 收款公司详情 */}

                                            {/* 銀行帳號 */}
                                            <View style={{
                                                backgroundColor: "#1A1A1A",
                                                paddingLeft: 15,
                                                paddingRight: 15,
                                            }}>
                                                <View style={styles.moneyTitle}>
                                                    <Text style={{color: '#fff'}}><Text style={{ color: "red" }}>* </Text>ชื่อบัญชี</Text>
                                                </View>
                                                <Flex style={styles.copyWrap}>
                                                    <Flex.Item>
                                                        <Text style={styles.copyText}>
                                                            {BankData.bankAccounts[this.state.userBankD].AccountHolderName}
                                                        </Text>
                                                    </Flex.Item>
                                                    <Flex.Item style={{alignItems: 'flex-end'}}>
                                                        <TouchableOpacity style={styles.copyBtnWrap}>
                                                            <Text
                                                                onPress={() => this.CopyText(BankData.bankAccounts[this.state.userBankD].AccountHolderName)}
                                                                style={styles.copyBtn}>
                                                                คัดลอก
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </Flex.Item>
                                                </Flex>
                                            </View>

                                            {/* 银行帐号 */}
                                            <View style={{
                                                backgroundColor: "#1A1A1A",
                                                paddingLeft: 15,
                                                paddingRight: 15,
                                            }}>
                                                <View style={styles.moneyTitle}>
                                                    <Text style={{color: '#fff'}}><Text style={{ color: "red" }}>* </Text>เลขที่บัญชี</Text>
                                                </View>
                                                <Flex justify="between" style={styles.copyWrap}>
                                                    <Flex.Item>
                                                        <Text style={styles.copyText}>
                                                            {BankData.bankAccounts[this.state.userBankD].AccountNo}
                                                        </Text>
                                                    </Flex.Item>
                                                    <Flex.Item style={{alignItems: 'flex-end'}}>
                                                        <TouchableOpacity style={styles.copyBtnWrap}>
                                                            <Text
                                                                onPress={() => this.CopyText(BankData.bankAccounts[this.state.userBankD].AccountNo)}
                                                                style={styles.copyBtn}>
                                                                คัดลอก
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </Flex.Item>
                                                </Flex>
                                            </View>

                                            {/* fast 上傳圖片 */}
                                            <View style={{
                                                backgroundColor: "#1A1A1A",
                                                paddingLeft: 15,
                                                paddingRight: 15,
                                            }}>
                                                <View style={styles.moneyTitle}>
                                                    <Text style={{color: '#fff'}}><Text style={{ color: "red" }}>* </Text>สลิปโอนเงิน</Text>
                                                </View>
                                                <Flex justify="between" style={styles.copyWrap}>
                                                    <Flex.Item>
                                                        <Text style={styles.copyText}>
                                                            {this.state.avatarName}
                                                        </Text>
                                                    </Flex.Item>
                                                    <Flex.Item style={{alignItems: 'flex-end'}}>
                                                        <TouchableOpacity style={styles.copyBtnWrap}
                                                                          onPress={this.selectPhotoTapped.bind(this)}>
                                                            <Text
                                                                style={styles.copyBtn}>
                                                                อัพโหลดไฟล์
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </Flex.Item>
                                                </Flex>
                                            </View>
                                        </View>
                                    }

                                </View>
                            )}

                            {/*LB第三步 完成*/}
                            {LBcurrentStep == 3 &&(
                                <View style={{paddingTop: 45,justifyContent: 'center', alignItems: 'center'}}>
                                    <Image resizeMode='stretch' style={[ styles.el_center, { width: 80, height: 80 } ]} source={require("../../images/timeLoad.png")}></Image>
                                    <Text style={[ styles.el_center, { color: '#fff', fontSize: 18, marginTop: 21} ]}>ส่งรายการฝากสำเร็จ</Text>
                                    <Text style={[ styles.el_center, { color: '#00B324', fontSize: 30, marginVertical: 14 } ]}>{this.state.TimeLoad}</Text>
                                    <Text style={[ styles.el_center, { color: '#fff', fontSize: 14, marginBottom: 30 } ]}>
                                        เนื่องด้วยขณะนี้มีผู้เข้าใช้บริการจำนวนมาก {'\n'} จึงอาจทำให้รายการฝากของท่านล่าช้า
                                    </Text>
                                    <View style={{ padding: 15, paddingBottom: 25 }}>
                                        <View style={styles.DSPayButtonBHoves}>
                                            <Touch onPress={this.closeLBStep3} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: width - 30 }}>
                                                <Text style={{ color: "#fff", fontSize: 16, lineHeight: 38, textAlign: 'center', paddingTop: 3 }}>ประวัติ</Text>
                                            </Touch>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    ) : null

                    }







                    {(NowBankType == "BC") &&    //高额存款
                    <View style={{backgroundColor: "#1A1A1A", marginTop: 14}}>
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <View style={styles.moneyTitle}>
                                <Text style={{ color: '#fff' }}><Text style={{ color: "red" }}>* </Text>จำนวนเงินฝาก</Text>
                                <Text style={{ color: '#00b324' }}>{payMoney && payMoney }</Text>
                            </View>
                            <View style={styles.DsBorder}>
                                <InputItem styles={StyleSheet.create(newStyle)}
                                           placeholderTextColor="#969696"
                                           type="number"
                                           value={this.state.payMoney}
                                           onChange={(values) => {
                                               let newText = values.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
                                               this.setState({
                                                   payMoney: newText,
                                               }, () => { this.payMoneyST() });
                                           }}
                                           onBlur={() => {
                                               this.onChange('', '', this.state.payMoney);
                                           }}
                                           onFocus={() => { }}
                                           placeholder={payMoney && payMoney.toString() || 'ช่องจำนวนเงินฝาก : ' + BankMinBal + ' ~ ' + BankMaxBal}
                                >
                                </InputItem>
                            </View>
                            {
                                payMoneySTMsg != '' &&
                                <Text style={{ color: '#ff0000', fontSize: 12 }}>{payMoneySTMsg}</Text>
                            }

                            {console.log(userBank)}
                            <View>
                                <Text style={{ color: '#fff', lineHeight: 35 }}><Text style={{ color: "red" }}>* </Text>ธนาคาร</Text>
                                {
                                    userBank.length == 0 &&
                                    <View style={styles.DsBorder}>
                                        <View style={[styles.DSarrow, { position: 'absolute', right: 10 }]}></View>
                                        <View>
                                            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.openLiveChat()}>
                                                <Text style={{ fontSize: 13, color: '#00b324', textAlign: 'left', width: width - 60 }}>ติดต่อเจ้าหน้าที่สนทนาสดเพื่อเพิ่ม</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                                {console.log(this.state)}
                                {
                                    userBank.length > 0 &&
                                    <View style={styles.DsBorder}>
                                        <ModalDropdown ref={el => this._dropdown_3 = el}
                                                       defaultValue={userBank[0].label}
                                                       textStyle={styles.DSdropdown_D_text}
                                                       dropdownStyle={styles.DSdropdown_D_dropdown}
                                                       options={userBank}
                                                       renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                                       renderRow={this._dropdown_2_renderRow.bind(this)}
                                                       onSelect={this.BCBankTG}
                                                       style={{ zIndex: 10, width: width - 30 }}
                                        />
                                        <View style={{ position: 'absolute', right: 10, paddingTop: 6 }}>
                                            <View style={styles.DSarrow}></View>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>

                    }


                    {NowBankType == "CC" &&    //熱博卡
                    <View style={{backgroundColor: "#1A1A1A", marginTop: 14}}>
                        {/* 充值金额输入框 Deposite amount*/}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <View style={styles.moneyTitle}>
                                <Text style={{ color: '#fff' }}><Text style={{ color: "red" }}>* </Text>ยอดเงินฝาก</Text>
                                <Text style={{ color: '#00b324' }}>{payMoney && payMoney }</Text>
                            </View>
                            <View style={styles.DsBorder}>
                                <InputItem styles={StyleSheet.create(newStyle)}
                                           placeholderTextColor="#969696"
                                           type="number"
                                           value={this.state.payMoney}
                                           onChange={(values) => {
                                               let newText = values.replace(/^(\-)*(\d+)\.().*$/, '$1$2');
                                               this.setState({
                                                   payMoney: newText,
                                               }, () => { this.payMoneyST() });
                                           }}
                                           onBlur={() => {
                                               this.onChange('', '', this.state.payMoney);
                                           }}
                                           onFocus={() => { }}
                                           placeholder={payMoney && payMoney.toString() || 'ช่องจำนวนเงินฝาก : ' + BankMinBal + ' ~ ' + BankMaxBal}
                                >
                                </InputItem>
                            </View>
                            {
                                payMoneySTMsg != '' &&
                                <Text style={{ color: '#ff0000', fontSize: 12 }}>{payMoneySTMsg}</Text>
                            }

                            {/* S/N */}
                            <View>
                                <Text style={{ color: '#fff', lineHeight: 35 }}><Text style={{ color: "red" }}>* </Text>S/N</Text>
                            </View>
                            <View style={styles.DsBorder}>
                                <InputItem styles={StyleSheet.create(newStyle)} placeholderTextColor="#fff"
                                           type="number"
                                           value={this.state.cardNumber}
                                    // labelNumber={7}
                                           onChange={(value: any) => {
                                               this.setState({
                                                   cardNumber: value,
                                               }, () => {
                                                   this.cardNumST()
                                               });
                                           }}
                                           placeholder="S/N"
                                           placeholderTextColor={'#98989a'}
                                >
                                </InputItem>
                            </View>
                            {
                                cardNumberSTMsg != '' &&
                                <Text style={{ color: 'red', fontSize: 12 }}>{cardNumberSTMsg}</Text>
                            }
                        </View>
                        {/* //输入安全码 */}
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <View>
                                <Text style={{ color: '#fff', lineHeight: 35 }}><Text style={{ color: "red" }}>* </Text>รหัสบัตรเงินสด</Text>
                            </View>
                            <View style={styles.DsBorder}>
                                <InputItem styles={StyleSheet.create(newStyle)} placeholderTextColor="#fff"
                                           type="text"
                                           value={this.state.cardPIN}
                                    // labelNumber={10}
                                           onChange={(value: any) => {
                                               this.setState({
                                                   cardPIN: value,
                                               }, () => { this.cardPINST() });
                                           }}
                                           placeholder="รหัสบัตรเงินสด"
                                           placeholderTextColor={'#98989a'}
                                >
                                </InputItem>
                            </View>
                            {
                                cardPINSTMsg != '' &&
                                <Text style={{ color: 'red', fontSize: 12 }}>{cardPINSTMsg}</Text>
                            }
                        </View>
                    </View>

                    }

                    {/* THBQR第二步驟 */}
                    {NowBankType == "THBQR" && this.state.THBQR_step_2 && <View style={{ marginTop: 21,paddingLeft: 15, paddingRight: 15 }}>
                        <View style={{ backgroundColor: "#1A1A1A", marginBottom: 45}}>
                            <Image
                                source={require("../../images/bank/qr-code_2.png")}
                                resizeMode="stretch"
                                style={{ width: 60, height:60,alignSelf:'center',marginTop: 44, marginBottom:12}}
                            />
                            <Text style={{color: "#999999", textAlign: 'center'}}>
                                QR ฝากเงินของท่านจะถูกเปิดอีกหน้าต่างหนึ่ง {'\n'}
                                กรุณาตรวจสอบให้แน่ใจ {'\n'}
                                ว่ามีการสแกนและทำการฝากมาแล้ว{'\n'}
                            </Text>
                        </View>

                        <View style={styles.DSPayButtonBHoves}>
                            <Touch hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.setState({THBQR_step_2: false})} style={{width:width-30}}>
                                <Text style={{ color: "#fff", fontSize: 16,lineHeight:38, fontWeight: 'bold', textAlign: 'center', paddingTop: 3 }}>ส่งอีกครั้ง</Text>
                            </Touch>
                        </View>

                        <View style={styles.DSPayButtonBHoves2}>
                            <Touch hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.props.checkcallback("records")} style={{width:width-30}}>
                                <Text style={{ color: "#00B324", fontSize: 16,lineHeight:38, fontWeight: 'bold', textAlign: 'center', paddingTop: 3 }}>ฝากเรียบร้อยแล้ว</Text>
                            </Touch>
                        </View>
                    </View>}

                    {console.log("Bonus", Bonus)}
                    {NowBankType=="RD" ? null : Bonus != "" && Bonus.length != 0 && this.bonusSelectCheck()}


                    {NowBankType=="THBQR"&& !this.state.THBQR_step_2 && <View style={{ marginTop: 21,paddingLeft: 15, paddingRight: 15 }}>
                        <TouchableOpacity onPress={()=>this.setState({QRBanks_info: true})}>
                            <Text style={{color: "#00B324", textDecorationLine: 'underline', marginBottom: 20}}>รายชื่อธนาคารที่สามารถฝากเงินQR Codeได้</Text>
                        </TouchableOpacity>
                        <Text style={{color: "#FF420A"}}> QR ฝากเงินนี้ใช้สแกนได้เพียงครั้งเดียวเท่านั้น {"\n"} ยอดจะปรับภายใน 10 นาที
                        </Text>
                    </View>}
                    
                    {NowBankType=="TMW"&& <View style={{ marginTop: 21,paddingLeft: 15, paddingRight: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require("../../images/bell.png")} style={{ width: 11, height: 13, marginRight: 6 }} />
                        <Text style={{color: "#FF420A"}}> รายการจะปรับภายใน 10 นาทีหลังจากโอนสำเร็จ
                        </Text>
                    </View>}

                    {NowBankType=="RD" ? null : 
                    !this.state.THBQR_step_2 && LBcurrentStep === 1 && <View style={{ padding: 15, paddingBottom: 25 }}>
                        {keyboardOpen == false &&

                        okCanPay == false ?

                            <View style={styles.DSPayButtonB}>
                                <Touch hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: width - 30 }}>
                                    <Text style={{ color: "#fff", fontSize: 16, lineHeight: 38, textAlign: 'center', paddingTop: 3 }}>ฝากเงิน</Text>
                                </Touch>
                            </View>

                            :okCanPay== true &&
                            <View style={styles.DSPayButtonBHoves}>
                                <Touch hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.okPayMoney()} style={{width:width-30}}>
                                    <Text style={{ color: "#fff", fontSize: 16,lineHeight:38, textAlign: 'center', paddingTop: 3 }}>{'ฝากเงิน'}</Text>
                                </Touch>
                            </View>
                        }





                        {/* 充值教程 */}
                        {NowBankType=='CTC'&&<View >
                            <Touch hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{width:147,alignSelf:'center',marginTop:15}} onPress={()=>this.setState({showCTCTutorailModal:true})}>
                                <Image resizeMode='stretch' source={require('../../images/tutorial/ctc_tutorial_btn.png')} style={{ width:147, height: 35}} />
                            </Touch>
                        </View>}
                    </View>}


                    {/*LB第二步驟按鈕*/}
                    {LBcurrentStep == 2 && (

                        <View style={{backgroundColor: '#1A1A1A'}}>


                            {this.state.lbRechargeMethod === 0? (<View style={{ paddingHorizontal: 15,paddingTop: 36, paddingBottom: 25 }}>
                                <View style={styles.DSPayButtonBHoves}>
                                    <Touch onPress={this.okPayMoney} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: width - 30 }}>
                                        <Text style={{ color: "#fff", fontSize: 16, lineHeight: 38, fontWeight: 'bold', textAlign: 'center', paddingTop: 3 }}>โอนเงินมาเรียบร้อยแล้ว</Text>
                                    </Touch>
                                </View>
                            </View>):(
                                <View style={{ paddingHorizontal: 15,paddingTop: 36, paddingBottom: 25 }}>
                                    <View style={this.state.fastMoneyNoticeShow?styles.DSPayButtonBHovesDisabled:styles.DSPayButtonBHoves}>
                                        <Touch onPress={this.okPayFPMoney} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: width - 30 }}>
                                            <Text style={{ color: "#fff", fontSize: 16, lineHeight: 38, fontWeight: 'bold', textAlign: 'center', paddingTop: 3 }}>โอนเงินมาเรียบร้อยแล้ว</Text>
                                        </Touch>
                                    </View>
                                </View>
                            )}

                            {this.state.lbRechargeMethod === 0?(
                                <View style={{ paddingHorizontal: 15, paddingBottom: 25 }}>
                                    <View style={styles.LBPayButtonB}>
                                        <Touch onPress={() => {
                                            this.setState({
                                                LBcurrentStep: 1,
                                                changeWord:false,
                                                payMoney: "",
                                                okCanPay: true,
                                                isOtherAcc: false,
                                                lastSixNumber: ''
                                            },()=>this.checkAgn())
                                        }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: width - 30 }}>
                                            <Text style={{ color: "#fff", fontSize: 16, lineHeight: 38, fontWeight: 'bold', textAlign: 'center', paddingTop: 3 }}>กลับ</Text>
                                        </Touch>
                                    </View>
                                </View>
                            ):(
                                <View style={{ paddingHorizontal: 15, paddingBottom: 25 }}>
                                    <View style={styles.LBPayButtonB}>
                                        <Touch onPress={() => {
                                            this.cancelPayFPMoney()
                                        }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: width - 30 }}>
                                            <Text style={{ color: "#fff", fontSize: 16, lineHeight: 38, fontWeight: 'bold', textAlign: 'center', paddingTop: 3 }}>กลับ</Text>
                                        </Touch>
                                    </View>
                                </View>
                            )
                            }




                        </View>
                    )}


                </KeyboardAwareScrollView>



                {QRCODE != '' &&   //二維碼下載
                <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }} style={{ position: 'absolute', marginLeft: -1000, alignItems: "center", justifyContent: "center", }}>

                    <QRCodeA ref="viewShot"
                             value={QRCODE}
                             size={180}
                             bgColor='#000'
                    />

                </ViewShot>
                }


            </View>

        )
    }
}



export default (DepositSpage);

function RadioButton(props) {
    return (
        <TouchableOpacity style={{flexDirection: "row"}} onPress={props.onClick} disabled={props.disabled}>
            <View
                style={[{
                    height: 21,
                    width: 21,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: props.selected?'#00E62E':'#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                }, props.style]}>
                {
                    props.selected ?
                        <View style={{
                            height: 11,
                            width: 11,
                            borderRadius: 6,
                            backgroundColor: '#00E62E',
                        }}/>
                        : null
                }
            </View>
            {props.children}

        </TouchableOpacity>
    );
}
