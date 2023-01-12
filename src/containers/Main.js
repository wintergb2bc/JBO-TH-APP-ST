import React from "react";
import {
  TouchableOpacity,
  Platform,
  StatusBar,
  BackHandler,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  NativeModules,
  NativeEventEmitter,
  Clipboard,
  Linking,
} from "react-native";
import Touch from 'react-native-touch-once';
import { Flex, Toast,DatePicker,List } from "antd-mobile-rn";
import { connect } from "react-redux";
import {
  Drawer,
  Stack,
  Scene,
  Router,
  Actions,
  ActionConst,
  Lightbox,
  Modal
} from "react-native-router-flux";
import { logout } from "../actions/AuthAction";
 
import Login from "./Login/Login";
import UserTerms from './Login/UserTerms'
import Registered from "./Login/Registered";
import Fogetname from "./Login/Fogetname";
import Fogetpassword from "./Login/Fogetpassword";
import Phone from "./Login/Phone";
import RestrictPage from "./RestrictPage"; //限制页面
import SecurityCode from './Account/SecurityCode'
import Home from "./Home";
import GameList from "./GameList";
import SlotGameList from "./SlotGameList";
import FishGameList from "./FishGameList";
import P2PGameList from "./P2PGameList";
import preferential from "./preferential";
import PersonalAccount from "./PersonalAccount";
import preferentialPage from "./preferentialPage";
import newUserHelp from "./newUserHelp";
import deposit from "./Bank/Deposit";
import records from "./Bank/records";
import transfer from "./Bank/transfer";
import withdrawals from "./Bank/withdrawals";
import depositPageLB from "./Bank/depositPageLB";
import AlbQrcode from "./Bank/AlbQrcode";
import CryptpQRcode from "./Bank/CryptpQRcode";
import HongBaoRain from './HongBaoRain/HongBaoRain'
import HongBaoRainAndroid from './HongBaoRain/HongBaoRainAndroid'
import NewsAnnoun from './NewsAnnoun'
import UserInformation from './Account/userInformation'
import LiveChatIcon from './LiveChatIcon'
import Message from './Account/Message'
import MessageDetail from './Account/Message/MessageDetail'
import Recommend from './Account/Recommend'
import depositPage from "./Bank/depositPage";
import CountdownPage from "./Bank/CountdownPage";
import GamePage from "./GamePage";
import LiveChat from "./LiveChat";
import BettingHistory from './Account/BettingHistory'

import AccountUser from "./Account/user";
import Password from "./Account/password";
import userBankcar from "./Account/userBankcar";
import BankCenter from "./Bank/BankCenter";
import NewBank from "./Bank/NewBank";
import NewAccount from './Bank/NewAccount';
import NewName from "./Bank/NewName";
import userPT from "./Account/userPT";
import userinfo from "./Account/userinfo";
import Vip from './Account/Vip/Vip'
import VipDetails from './Account/Vip/VipDetails'
import VipOverview from './Account/Vip/VipOverview'
import VipMain from './Account/Vip/VipMain'
import VipReturnWater from './Account/Vip/VipReturnWater'
import PromotionVipDetails from './Account/Vip/PromotionVipDetails'
import UserContact from './Account/userContact'
import ContactDetails from './Account/ContactDetails'
import UserAddress from './Account/userAddress'
import TransactionDetails from "./Bank/TransactionDetails";

import Bettingrecord from "./Bettingrecord";

import Bonushistory from "./Bonushistory";

import Announcements from "./Announcements";
import News from "./News";
import Fogetindex from "./Login/Fogetindex";
import LoginOptVerify from "./Login/LoginOptVerify";
import OtpVerification from "./Login/OtpVerification";
import LoginRevalidateVerify from "./Login/LoginRevalidateVerify";
import RevVerification from "./Login/RevVerification";
import RevVerifyFail from "./Login/RevVerifyFail";
import VerifyFail from "./Login/VerifyFail";
import Renewpassword from "./Login/Renewpassword";

import UserVerifie from './UserVerifie'
import OptVerify from './Bank/OptVerify';
import { I18n } from "../language/i18n";

import TabIcon from "./tabIcon"; //下面導航配置

import MenuIcon from "../images/menu_burger.png";

import Manualpromotion from "./Manualpromotion";
import Orientation from "react-native-orientation-locker";

import PushUtil from "../actions/PushUtil"; //友盟 push 推送
import DeviceInfo from "react-native-device-info"; //獲取設備信息
import Sponsorship from "./Sponsorship/index"; // 贊助頁面
import SponsorshipPage from "./Sponsorship/Page"; // 贊助內頁
import SponsorshipNew from "./SponsorshipNew/index"; // 贊助頁面
import UserAccount from './Account/userAccount'
import SharePage from './Account/sharePage'
import AppDowload from './Account/AppDowload'
import HelpCenter from './Account/Help/HelpCenter'
import HelpDetail from './Account/Help/HelpDetail'

import LoginTouch from './LoginPage/LoginTouch'
import LoginPattern from './LoginPage/LoginPattern'
import LoginFace from './LoginPage/LoginFace'
import LoginPage from './LoginPage/LoginPage'
import FastLogin from './LoginPage/FastLogin'

import CreatWallet from "./Bank/CreatWallet";
import Double11Lottery from './Double11Lottery'
import Double11LotteryRecord from './Double11Lottery/Double11LotteryRecord'
import Double11PreferentialPage from './Double11Lottery/Double11PreferentialPage'
import TI10LotteryRecord from './TI10/TI10LotteryRecord'
import TI10Event from './TI10'


import Equipment from "./Equipment/";
import EurocupPage from "./EuroCup/EurocupPage";
import NewsPage from "./EuroCup/News/NewsPage";
import NewsDetail from "./EuroCup/News/NewsDetail";
import AnalyticsUtil from '../actions/AnalyticsUtil'; //友盟
import RankPage from "./EuroCup/Rank/RankPage";
import BQRTransAct from "./Bank/BQRTransAct";

const RouterWithRedux = connect()(Router);
const AffCodeAndroid = NativeModules.opeinstall; //android 獲取code 參數
const AffCodeIos = NativeModules.CoomaanTools; //ios 獲取code 參數
import Betting_detail from './game/Betting-detail/index'
import {
    ACTION_MaintainStatus_NoTokenBTI, ACTION_MaintainStatus_NoTokenIM, ACTION_MaintainStatus_NoTokenOW,
    ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM, ACTION_MaintainStatus_SetOW
} from './lib/redux/actions/MaintainStatusAction';
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from './lib/redux/actions/UserInfoAction';
import { ACTION_UserSetting_Update } from './lib/redux/actions/UserSettingAction'

import ListItems from 'antd-mobile-rn/lib/list/style/index.native';

 const newStyleHistore = {};
 for (const key in ListItems) {
   if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
	 // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
	 newStyleHistore[key] = { ...StyleSheet.flatten(ListItems[key]) }; 
	 newStyleHistore[key].color = '#000';
	 newStyleHistore[key].fontSize = 12
	 newStyleHistore[key].opacity =0;
	 newStyleHistore[key].top =1;
	 newStyleHistore[key].width = width;
	 newStyleHistore[key].height = 40;
	 newStyleHistore[key].backgroundColor = "#0a0a0a"
	 
	 
   }
 }

 //檢查ios手機型號高於12
checkUPerI12 =() => {
  let iphoneNewDeviceUI = ['iPhone13', 'iPhone14']; //獲取deviceid iphone型號會加1  
  let iphone1112DeviceUI = ['iPhone11', 'iPhone12'];     
  const device=DeviceInfo.getDeviceId()
  let deviceString= device.split(',')[0] 
  window.isIphone12Upper=iphoneNewDeviceUI.indexOf(deviceString) > -1  //存window
  window.isIphone1011Device=iphone1112DeviceUI.indexOf(deviceString) > -1 
  return iphoneNewDeviceUI.indexOf(deviceString) > -1
}



//  监听原生 UM push  监听外部通知 benji 9/14
const { CheckInvoice } = NativeModules;
const checkInvoiceEmitter = CheckInvoice ?new NativeEventEmitter(CheckInvoice):''


 let PushNative = NativeModules.PushNative ?  NativeModules.PushNative:'';    //push跳转到原生ios里面


 //友盟無參數類型追蹤 piwik benji      
window.UMonEvent = (track = "", action = "", name = "") => {
    console.log(track, action, name, 'Piwki追蹤')
    //這是給piwik sdk 追蹤 
    if (Platform.OS === "android") {
        NativeModules.opeinstall.PiwikTackEvent('Tarck', track, action, name);
    }
    if (Platform.OS === "ios") {
        PushNative.PiwikTackEvent('data', {track, action, name});
    }
}

window.PiwikMenberCode =(data) =>{
  console.log(data,'會員登錄')
	if(Platform.OS === "android"){
    if(NativeModules.opeinstall.PiwikTackEvent){
      NativeModules.opeinstall.PiwikTackEvent('menberCode',data, 'menberCode', 'menberCode');
    }
	}
	if(Platform.OS === "ios"){
    if(PushNative.PiwikTackMemberCode){
      PushNative.PiwikTackMemberCode('data',{track:data});
    }
	}
}
 
window.PiwikVersion = (data) => {
	if (Platform.OS === "android") {
		NativeModules.opeinstall.PiwikTackEvent('APPVER', data, ' ', ' ');
	}
	if (Platform.OS === "ios") {
		PushNative.PiwikTackVersion('data', { track: data });
	}
}
const { width, height } = Dimensions.get("window");

const AppLogo = () => {
  return (
    <Flex>
      {Platform.OS === "android" ? (
        <Flex.Item style={{ marginLeft: 10, marginTop: -5 }}>
          <Image
            resizeMode="stretch"
            source={require("../images/github-logo.png")}
            style={{ width: 65, height: 21 }}
          />
        </Flex.Item>
      ) : (
        Platform.OS === "ios" && (
          <Flex.Item style={{ marginLeft: 10, marginTop: -5 }}>
            <Image
              resizeMode="stretch"
              source={require("../images/github-logo.png")}
              style={{ width: 65, height: 21 }}
            />
          </Flex.Item>
        )
      )}
    </Flex>
  );
};

const HeadLeft = () => {
  return (
    <View style={{alignItems:'flex-start',justifyContent:'flex-start',paddingLeft:14}}> 
    
    <TouchableOpacity onPress={()=>{Actions.pop()}} style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',alignContent:'center',top:-5}}>
    <Image resizeMode='stretch' source={require('../images/back_chevron.png')} style={{ width: 14, height: 24,paddingLeft:5,paddingRight:5}} /> 
       <Image resizeMode='stretch' source={require('../images/JBO_logo.png')} style={{ width: 30, height: 30}} />
     <Text style={{color:'#fff',fontSize:16}}>{NowGameTitle}</Text>  
      
    </TouchableOpacity> 
    
    </View>

  );
};
 
const GameHeadLeft = () => {
  return (
    <View style={{alignItems:'flex-start',justifyContent:'flex-start',paddingLeft:14,paddingTop:checkUPerI12()?12:0 }}>  
    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',alignContent:'center',top:Platform.OS === "android" ?0:-5}}>
         <Image resizeMode='stretch' source={require('../images/JBO_logo.png')} style={{ width: 30, height: 30}} />
        <Text style={{color:'#fff',fontSize:16}}>{NowGameTitle}</Text>  
     </View>
    
    
    </View>

  );
};

const BackBtn = (props) => {
    console.log(props)
    return (
        <TouchableOpacity onPress={() => { props.backFunc() }} style={{paddingLeft: 10}}>
            <Image resizeMode='stretch' source={require('../images/icon-back.png')} style={{ width: 24, height: 24}} />
        </TouchableOpacity>
    );
};

let backTime = 0;

const GoBackBtn = (props) => {
  console.log(props)
  return(
      <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => { props.backFunc() }} >
        <Image
            resizeMode="stretch"
            source={require("../images/bank/icon_close.png")}
            style={{ width: 20, height: 20, marginRight: 20 }}
        />
      </TouchableOpacity>
  )
}

const ReturnBtn = (props) => {
  console.log(props)
  return(
      <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => { props.backFunc() }} >
        <Image
            resizeMode="stretch"
            source={require('../images/icon-back.png')}
            style={{ width: 20, height: 20, marginRight: 20 }}
        />
      </TouchableOpacity>
  )
}

 
const onBackPress = () => {
  if (Actions.state.index == 0) { 
    if (Platform.OS === "android") {
      // closeButtonfoAndroid();
        // 防止android按了物理返回，OWS,SBT和IPSB直接退出APP
        if (window.NowGameType === 'OWS' || window.NowGameType === 'SBT' || window.NowGameType === 'IPSB') {
            if (window.CloseGameIPES) {
                CloseGameIPES();
            }
            return true;
        }
        
      Toast.info("กดอีกครั้งเพื่อออกจากแอป", 3);
      if (backTime == 1) {
        BackHandler.exitApp();
      }
      backTime++;
      //BackHandler.exitApp();
      setTimeout(() => {
        backTime = 0;
      }, 3000);

      return true;
    }
  }
  // Actions.pop()
  return true;
};


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.navigateToScene = this.navigateToScene.bind(this);

    this.state = {
      // activeSections: [],
      // collapsed: true,
      // multipleSelect: false,
      userMoney: false,
      userName: "", //用戶名
      memberInfo: "",
      TotalBal: TotalBal, // 總餘額
      IPSB: IPSB,
      MAIN: MAIN,
      LD: LD,
      SLOT: SLOT,
      SB: SB,
      CMD: CMD,
      DomainX: "", //合作夥伴
      Devicetoken: "",
      memberData: "",
      userMAC: "",
      //statistics: 0,
      moneyBox: "",
      isLogin: false,
      password: "",
      LoginisOk: false,
      DatePickers: new Date(),
    //loginTouchTitle:"指纹辨识认证",
    //isIphone12Upper:false,
    //isIphone12Lower:false,
      isShowPopularGame:false,//是否顯示飛行遊戲
    };

    this.userAllmoney = this.userAllmoney.bind(this);
    this.resetMoner = this.resetMoner.bind(this);
    this.TotalBal = this.TotalBal.bind(this);
  }

  componentDidMount(props) {
    this.GetDomain(); //合作夥伴

    this.reloadOrientation();
	  this.getAffCode()//获取affcode

    this.UpushJump();  // UM推送 點擊跳指定頁面

    this.handleIsShowPopularGame()


    if (ApiPort.UserLogin == true) {
        global.storage
            .load({
                key: "memberInfo",
                id: "memberInfos"
            })
            .then(ret => {
                console.log(ret);
                this.setState({
                    userName: ret.memberInfo.userName ?
                        ret.memberInfo.userName.substr(0, 12) :
                        "竞博",
                    memberInfo: ret.memberInfo,
                    memberData: ret,
                    MemberCode: ret.memberInfo.MemberCode
                });
                this.TotalBal();
            })
            .catch(err => {
                console.log("沒有用戶緩存   ");
            });
    }

    if (Platform.OS === "android") {
        DeviceInfo.getMACAddress().then(mac => {
            //拿mac地址
            this.setState({
                userMAC: mac
            });
        });
    } else {
        try {
            //ios手机型号是有指纹的
            let iphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7',
                'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE'];
            const getModel = DeviceInfo.getModel();
            if (iphoneXMax.indexOf(getModel) > -1) {
                window.DeviceInfoIos = false
            } 
        } catch (error) {
            console.log(error);
        }
    }
    this.GetGameList("mobilep2p");

    setTimeout(() => {
        this.GetGameList("mobileslot")
    }, 2500);

    setTimeout(() => {
      this.GetGameList("mobilefishing")
    }, 2500);

    setTimeout(() => {
      this.GetGameList("mobilekenolottery")
    }, 3500);


    if (ApiPort.UserLogin == true) {
        this.ReloadToken59 = setInterval(() => { //55分鐘 循環刷新token

            this.ReloadTokenB();

        }, 21300000)
    }

    PushUtil.getDeviceToken()
    .then(token => {
      ///獲取用戶唯一參數 devicetoken
      this.setState({
        Devicetoken: token
      },()=>{
        //第一次開啟app 註冊友盟個推
        this.NotificationOne();
      });

    })
    .catch(err => {
      //第一次開啟app 註冊友盟個推
      this.NotificationOne(); 
    });




    setTimeout(() => {
        //首次啟動APP 寫入友盟
        global.storage
            .load({
                key: "OpenAPPready",
                id: "123"
            })
            .then(ret => {

            })
            .catch(err => {
                setTimeout(() => {
                    AnalyticsUtil.onEventWithMap("StartAPP", {
                        affCode: affCodeKex
                    });
                }, 1000);
                global.storage.save({
                    key: "OpenAPPready", // 注意:请不要在key中使用_下划线符号!
                    id: "123", // 注意:请不要在id中使用_下划线符号!
                    data: '',
                    expires: null
                });
            });
    }, 3500);
    // 先拿到用户名,然后查看有没有快速登录方式
    setTimeout(() => {
      this.getStorageName()
    }, 1000);

    //this.CallApp(); //喚醒app 接收參數

}


  componentWillMount() {
   
  }
  	// 获取代理码
	getAffCode() {
		//Registered.js/Main.js，两次获取，防止sdk api慢没拿到
		let GetNative = NativeModules.opeinstall || false
		if(Platform.OS == "ios") {
			GetNative = NativeModules.CoomaanTools || false
		}
		//获取原生绑定，没有再去拿url带的
		if (GetNative && GetNative.getAffCode) {
			GetNative.getAffCode(CODE => {
				if (CODE && CODE != 'err') {
					affCodeKex = CODE;
                    this.setState({
                        affCode: CODE,
                    })
				} else {
					this.getAff()
				}
			});
		} else {
			this.getAff()
		}
	};

	getAff() {
		//缓存检查affcode，没有去检查copy，不会被copy覆盖
		global.storage
		.load({
			key: "affCodeSGs",
			id: "affCodeSGs"
		})
		.then(ret => {
            affCodeKex = ret
            this.setState({
                affCode: ret,
            })
		})
		.catch(err => {
			Clipboard.getString().then( (content)=>{
				if(content.indexOf('affcode&') == 0 ){
					let Acode =content.split('affcode&')[1]
					if(Acode) {
                        affCodeKex = Acode
                        this.setState({
                            affCode: Acode,
                        })
                        global.storage.save({
                            key: "affCodeSGs", // 注意:请不要在key中使用_下划线符号!
                            id: "affCodeSGs", // 注意:请不要在id中使用_下划线符号!
                            data: Acode,
                            expires: null
                        });
                    }
				}
			}, (error)=>{ })
		})
	}

  //CallApp(){
    // Linking.getInitialURL().then((url)=>{
    //   if(url){

    //      let urlData = url.split("//")[1]//split產出陣列array
    //      let list = {}
    //      console.log('urlData',urlData)
    //      urlData && urlData.split("&").forEach((item,i) => {//foreach 執行split產出的array裡的每個元素
    //        list[item.split("=")[0]] = item.split("=")[1] || ""//array包住物件object[{}]
    //      })
    //     //  console.log('list==》',list,'list token==》',list?.token)
    //      if(list?.token) {
    //        Actions.logins()
    //      } else {
    //         //先拿到用户名,然后查看有没有快速登录方式
    //        setTimeout(() => {
    //          this.getStorageName()
    //        }, 1000);
    //       }
    //   }
    // }).catch(()=>{
    //     setTimeout(() => {
    //        this.getStorageName()
    //     }, 1000);
    // })
  //}
  


  

  componentWillUnmount() {
    //離開註銷監聽
    this.ReloadToken59 && clearInterval(this.ReloadToken59)
    this.loadInterval && clearInterval(this.loadInterval);
    Orientation.removeOrientationListener(this._onOrientationChange);
  }
  
  openOrientation() {
      //锁定竖屏
      // GameDBType =false;
      // Orientation.lockToPortrait();
  }
  
  removeOrientation() {
      //移除锁定竖屏
      // GameDBType = true;
      // RmoveOrien(); //刪掉全局監聽 橫屏
      // Orientation.unlockAllOrientations();
  }
    
  _onOrientationChange(props) {
    if (GameDBType == false) {
      Orientation.lockToPortrait();
    }
  }

  reloadOrientation() {
    //全局事件 從新監聽橫屏 豎屏

    Orientation.lockToPortrait();

    Orientation.addOrientationListener(this._onOrientationChange);
  }

  RmoveOrien() {
    //全局事件刪掉監聽
    Orientation.removeOrientationListener(this._onOrientationChange);
  }

    

  UpushJump(){
    //友盟推送接收
    
    setTimeout(()=>{
        if( Platform.OS == "android" ){
          //原生事件不存在 終止事件
          if(!AffCodeAndroid.getUMMSG){
            return
         }
        
          AffCodeAndroid.getUMMSG(info => {
            console.log(info,'umMSGAAA')
              if(info.CODE){
                let msgD = JSON.parse(info.CODE);
                console.log(msgD,'umMSG')
                if(msgD.url){
                  if(msgD.url == "promotion"){
                    setTimeout(()=>{
                      Actions.jump('preferential')
                    },3000) 
                  }
    
                  if(msgD.url == "sponsorship"){
                    setTimeout(()=>{
                      Actions.SponsorshipNewScene()
                    },3000) 
                  }
    
                  if(msgD.url == "login"){
                    setTimeout(()=>{
                      Actions.logins()
                    },3000) 
                  }
                  
                  if(msgD.url == "registered"){
                    setTimeout(()=>{
                      Actions.Registered()
                    },3000) 
                  }

                  if(msgD.url == "inbox"){
                    UmPma = true//全局參數 在home.js執行跳收件箱
                    if (ApiPort.UserLogin == true) {  //已登陸狀態
                      Actions.Message();
                      UmPma = false; 
                    }else{
                      Actions.logins();
                    }
                  }

                }
    
              }
    
            
          });
        
    
        }
   
        if( Platform.OS == "ios" ){ 
          //獲取原生事件失敗 停止
          if(checkInvoiceEmitter ==''){
            return;
          }
         //  监听iOS原生 UM push  监听外部通知 benji 9/14
              checkInvoiceEmitter.addListener(
                'didReceiveNotification', (info) => {
                    //Clipboard.setString(info.aps.alert.jump1) 
                      
                      if(info.url){
                        if(info.url == "promotion"){
                          setTimeout(()=>{
                            Actions.jump('preferential')
                          },3000) 
                        }
          
                        if(info.url == "sponsorship"){
                          setTimeout(()=>{
                            Actions.SponsorshipNewScene()
                          },3000) 
                        }
          
                        if(info.url == "login"){
                          setTimeout(()=>{
                            Actions.logins()
                          },3000) 
                        }
                        
                        if(info.url == "registered"){
                          setTimeout(()=>{
                            Actions.Registered()
                          },3000) 
                        }
                        
                        if(info.url == "inbox"){
                          UmPma = true//全局參數 在home.js執行跳收件箱
                          if (ApiPort.UserLogin == true) {  //已登陸狀態
                            Actions.Message();
                            UmPma = false; 
                          }else{
                            Actions.logins();
                          }
                       } 

                      } 
                  }
              )
         }
  
        },10000) 
      //////////////////////
  }
  GetDomain() {
    //合作夥伴

    fetchRequest(ApiPort.Domain + "?", "GET")
      .then(data => {
        this.setState({
           DomainX: data.affiliateUrlLM
        });
      })
      .catch(error => {});
  }



  //餘額
  TotalBal() {
    fetchRequest(ApiPort.Balance, "GET")
      .then(data => {
        Toast.hide();
        data.map(function(item, index) {
          if (item.name == "TotalBal") {
            TotalBal = item.balance;
          } else if (item.name == "IPSB") {
            IPSB = item.balance;
          } else if (item.name == "MAIN") {
            MAIN = item.balance;
          } else if (item.name == "LD") {
            // LD ＝ 娛樂場 casino
            LD = item.balance;
          } else if (item.name == "SLOT") {
            SLOT = item.balance;
          } else if (item.name == "SB") {
            SB = item.balance;
          } else if (item.name == "CMD") {
            CMD = item.balance;
          } else if (item.name == "PT") {
            PT = item.balance;
          } else if (item.name == "AG") {
            AG = item.balance;
          }
        });

        this.setState({
          moneyBox: data,
          TotalBal: TotalBal,
          IPSB: IPSB,
          MAIN: MAIN,
          LD: LD,
          SLOT: SLOT,
          SB: SB,
          CMD: CMD
        });
      })
      .catch(error => {
        Toast.hide();
      });
  }

  //餘額刷新
  resetMoner() {//余额刷新中,请稍候
    Toast.loading("กำลังโหลด...", 200);
    this.TotalBal();
  }

  //展示全餘額
  userAllmoney() {
    let key = this.state.userMoney;
    this.setState({
      userMoney: key == false ? true : false
    });
  }

  navigateToScene(key, item, logoutx) {
    if (key == "news") {
      this.NewsOpen();
    } 
    // console.log(key,item,logoutx)
    //console.log(key,item)
    //console.log(this.props)

    if (key == "Registered") {
      this.props.logout();
      setTimeout(() => {
        Actions.Registered();
      }, 200);
      setTimeout(() => {
        Gologin = true;
      }, 2000);
      key = "login";
      return;
    }

    if (key === "logout") {
      if (window.CloseGameIPES) {
        //關掉im sbt 在開啟的遊戲如果他存在
        CloseGameIPES();
      }

      if (window.CloseGameIPSB) {
        //關掉im sbt 在開啟的遊戲如果他存在
        CloseGameIPSB();
      }
      if (window.CloseGameSBT) {
        //關掉im sbt 在開啟的遊戲如果他存在
        CloseGameSBT();
      }
      if (window.CloseGameOWS) {
        //關掉im sbt 在開啟的遊戲如果他存在
        CloseGameOWS();
      }

      if (ApiPort.UserLogin == true) {
        this.logout();
      }

      TotalBal = 0;
      ApiPort.Token = "";
      ApiPort.UserLogin = false;
      NoGoHome = true;
    
      if(Gologin ==true){  
        // global.storage.remove({
        //   key: "username",
        //   id: "nameJBO"
        // });
  
        global.storage.remove({
          key: "password",
          id: "passwordJBO"
        }); 
      }
  
      global.storage.remove({
        key: "memberInfo",
        id: "memberInfos"
      });

      global.storage.remove({
        key: "Bank", // 注意:请不要在key中使用_下划线符号!
        id: "BankData"
      });
    
      Actions.logins();
      this.props.logout();
      LivechatDragType = false // 關閉客服懸浮球 benji
      setTimeout(() => {
        Gologin = true;
       // ReloadgetLiveChatX();//客服重新加載
      }, 2000);
      key = "login";
      this.setState({
        LoginisOk: !this.state.LoginisOk ? true : false
      });


      return;
    }

    Actions[key]({});

    if (key == "deposit") {
      setTimeout(() => {
        reloadPage(item);
      }, 50);
    }
  }

    /**
   * 拿到存储的用户名
   */
  getStorageName(){
    global.storage
      .load({
        key: "username",
        id: "nameJBO"
      })
      .then(ret => {
        // console.log("拿到用户名后查看用户是否有设置快速登录",ret);
        this.setState({
          userName: ret
        });
        // 拿到用户名后查看用户是否有设置快速登录
        this.fastLogins(ret.toLocaleLowerCase());
      })
      .catch(err => {
        // console.log("没有拿到用户名");
        console.warn(err.message);
      });
  }

  /**
   * 拿到存储的用户密码
   */
  getStoragePassword(username){
    global.storage
      .load({
        key: "password",
        id: "passwordJBO"
      })
      .then(ret => {
        this.setState({
          password: ret
        },()=>{
          if (ret) {
            this.login(username,ret,"commonlogin",false);
          }

        });
      })
      .catch(err => {
        console.log("没有拿到用户密码");
      });
  }


  /**
   * 快速登录
   * @param {string} username 用户名
   */
  fastLogins(username) {
    let storageKey = 'fastLogin' + username;
    let storageId = 'fastLogin' + username;
    console.log(storageKey,storageId)
    storage.load({
        key: storageKey,
        id: storageId
    })
    .then(data => {
      // console.log("用户有快速登录方式,前往快速登录页面",data);
        console.log('noFastLogin'+noFastLogin)
      if (!noFastLogin) {
        setTimeout(() => {
          Actions.LoginPage({
            username,
            stateType: data
          });
        }, 1000);
      }

    })
    .catch(err => {
      // console.log("用户没有快速登录方式,选择一般登录,去拿到存储的密码",noFastLogin,Actions.LoginPage);
      this.getStoragePassword(username)

    })
  }

  NotificationOne() {    //第一次用app 友盟個推註冊

    let date = {
        "os": Platform.OS == "ios" ? 'iOS' : 'Android',
        "osVersionCode": DeviceInfo.getVersion(),
        "osVersionNumber": DeviceInfo.getSystemVersion(),
        "deviceModel": Platform.OS === "android" ? DeviceInfo.getModel() : "",
        "serialNumber": Platform.OS === "android" ? DeviceInfo.getSerialNumber() : 'IOS',
        "deviceManufacturer": DeviceInfo.getManufacturer(),
        "pushNotificationPlatform": "umeng+",
        "deviceToken": this.state.Devicetoken,
        "imei": "",
        "macAddress": this.state.userMAC,
        "memberCode": "",
        "packageName": window.imJBOkey ? "net.gb2bc.JBOIM" : "net.gb2bc.JBO",
    }

    fetchRequest(ApiPort.NotificationOne, 'POST', date)
        .then(data => {
            
            global.storage.save({
                key: 'NotificationOne', // 注意:请不要在key中使用_下划线符号!
                id: 'NotificationOne', // 注意:请不要在id中使用_下划线符号!
                data: data,
                expires: null
            });
        }).catch(() => {
            
        })
  }

  NotificationLogin(user) {   //登錄註冊友盟推送

    let date = {
        "topics": "",
        "pushNotificationPlatform": "umeng+",
        "deviceToken": this.state.Devicetoken,
        "packageName": window.imJBOkey ? "net.gb2bc.JBOIM" : "net.gb2bc.JBO",
        "imei": "",
        "macAddress": this.state.userMAC,
        "memberCode": user,
        "serialNumber": Platform.OS === "android" ? DeviceInfo.getSerialNumber() : '',
        "os": Platform.OS == "ios" ? 'iOS' : 'Android',
    }

    fetchRequest(ApiPort.NotificationOne, 'PATCH', date)
        .then(() => {
            
        }).catch(() => {
            
        })
  }

  /**
   * 登录
   * @param {string} name 用户名
   * @param {string} password 密码
   * @param {string} key 登录类型: 一般登录/快速登录(脸部/指纹/图形)
   * @param {boolean} flag 是否注册
   */
  login(name, password,key="commonlogin",flag=false) {
    let date = {
      hostName: common_url,
      grantType: "password",
      clientId: "JBO.gb2bc",
      clientSecret: "JBOmuitten",
      username: name,
      password: password,
      scope: "Mobile.Service offline_access",
      appId: "net.gb2bc.jbo",
      siteId: Platform.OS === "android" ? 3 : 4,
      e2: E2Backbox || '',
    };
    //  let uri = '/api/App/RewardURLs?api-version=1.0&brand=fun88'
    Toast.loading("กำลังโหลด...", 200);
    //登录中,请稍候
    console.log('login...... 3')
    fetchRequest(ApiPort.login, "POST", date)
      .then(data => {
        
        Toast.hide();

        if (data.accessToken) {
          this.NotificationLogin(data.memberInfo.memberCode);  //註冊友盟個推
          userNameDB = data.memberInfo.userName;
          global.storage.save({
            key: "username", // 注意:请不要在key中使用_下划线符号!
            id: "nameJBO", // 注意:请不要在id中使用_下划线符号!
            data: data.memberInfo.userName,
            expires: null
          });

          global.storage.save({
            key: "password", // 注意:请不要在key中使用_下划线符号!
            id: "passwordJBO", // 注意:请不要在id中使用_下划线符号!
            data: this.state.password,
            expires: null
          });

          //  //console.log('aaaaaa')
          ApiPort.Token = data.accessToken.token_type + " " + data.accessToken.access_token; // 寫入用戶token  token要帶Bearer
          ApiPort.ReToken = data.accessToken.refresh_token // 寫入用戶token  token要帶Bearer
							 
          ApiPort.LogoutTokey = data.accessToken.refresh_token;

          ApiPort.access_token = data.accessToken.access_token;

          isGameLock = data.memberInfo.isGameLock; //用戶能不能玩遊戲
          // //console.log(ApiPort.Token)
          memberCode = data.memberInfo.memberCode; //寫入用戶 memberCode
          userName = data.memberInfo.userName;
        //  ReloadgetLiveChatX();//客服重新加載
          global.storage.save({
            key: "memberInfo", // 注意:请不要在key中使用_下划线符号!
            id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
            data: data,
            expires: null
          }); 
          //if(NoGoHome == true){   //註冊黨者 等手機驗證狀態
            ApiPort.UserLogin = true;
            this.props.userInfo_login(data.memberInfo.userName); //redux 紀錄登入態
            this.props.userInfo_getBalanceSB(true); //redux 獲取SB餘額
            localStorage.setItem('memberInfo', JSON.stringify(data.memberInfo));
            localStorage.setItem('memberCode', JSON.stringify(memberCode));
            global.localStorage.setItem('loginStatus','1')

          setTimeout(()=>{
            //追蹤membercode piwik
            PiwikMenberCode(data.memberInfo.memberCode)
            PiwikVersion(JBOVersion)
            },1000)

                    //友盟紀錄 用戶信息
                    AnalyticsUtil.onEventWithMap("UseToken", {
                      UseToken:
                        data.memberInfo.memberCode +
                        " / Devicetoken:" +
                        this.state.Devicetoken
                    }); 
 
          let isSkynetFirstLogin = global.localStorage.getItem('isSkynetFirstLogin');   
          // 更新LoginisOk能够使页面切换回Home页面
          this.setState({
            LoginisOk: !this.state.LoginisOk ? true : false
          },()=>{
            if(flag || isSkynetFirstLogin == true){
              // 如果是注册用户,需要在首页显示注册成功弹窗
              window.toggleRegPromo(true)
            }

          });


        } else {
          //console.log(data.content)
          let errors = JSON.parse(data.content);
          if (errors.error_details) {
            Toast.fail(errors.error_details.Message, 2);
          } else {//登录失败,请稍候重试
            Toast.fail("คำขอล้มเหลวโปรดลองอีกครั้ง", 2);
          }
        }
      })
      .catch(error => { 
 
        Toast.hide();
      });
  }



  logout() {
    const { Devicetoken } = this.state;

    //   console.log(ApiPort.LogoutTokey)
    //   console.log(ApiPort.access_token)
    //   console.log(memberCode)
    //   console.log(Devicetoken)
    let data = {
      clientId: "JBO.gb2bc",
      clientSecret: "JBOmuitten",
      refreshToken: ApiPort.LogoutTokey,
      accessToken: ApiPort.access_token,
      memberCode: memberCode,
      //"deviceToken":Devicetoken,
      packageName: "net.gb2bc.jbo",
      //"imei": "",
      macAddress: this.state.userMAC,
      //"serialNumber": "",
      //"pushNotificationPlatform": "umeng+",
      os: Platform.OS
    };

    fetchRequest(ApiPort.logout, "POST", data)
      .then(data => {})
      .catch(error => {
        Toast.hide();
      });
  }
  ReloadGame() {
    this.GetGameList("mobilep2p");
 
    setTimeout(() => {  
      this.GetGameList("mobileslot")
     }, 2500); 
     setTimeout(() => {
      this.GetGameList("mobilefishing")
    }, 2500);
     setTimeout(() => {  
      this.GetGameList("mobilekenolottery")
     }, 3500); 
     
  }

  //请求第三方的游戏接口，返回第三方的游戏大厅的URL地址   CompareObj(jsonObjA, jsonObjB)
  GetGameList(gametype) {
    fetchRequest(
      ApiPort.Game + "?gametype=" + gametype + "&vendorPlatform=mobile&",
      "GET"
    )
      .then(data => { 

        global.storage.save({
          key: "GameDatd" + gametype, // 注意:请不要在key中使用_下划线符号!
          id: gametype, // 注意:请不要在id中使用_下划线符号!
          data: data,
          expires: 3600000
        });
      })
      .catch(error => {
        Toast.hide();
      });
  }

  ActionJump(key){   //底部跳轉修改 追蹤需求
    console.log('key============',key)
    let piwkMsg = key; 
    console.log(key)
    let piwkCategory = 'Navigation';
    let piwkAction = 'Click';
    
    if(key=='affCooperate'){
      Linking.openURL(this.state.DomainX)
      return
    }

    if(key == 'preferential'){
      piwkCategory = 'Promo Nav'
      piwkMsg = ' PromoPage'
    }
    if(key == 'deposit'){
      console.log('點擊wallet============')
      piwkMsg = 'BankPage'
      Actions.jump("deposit");
      setTimeout(() => {
        reloadPage("deposit")
      }, 100);
      return
    }

    if(key == 'PersonalAccount'){
      piwkMsg = 'Profile'
    }
    
    if(key == 'Vip'){
      piwkCategory = 'VIP Page'
      piwkMsg = 'VIPPage'
    }

    if(key == 'home'){
      piwkMsg = 'Home'
    }

    if(key == 'logins'){
      piwkMsg = 'Login'
    }

	  window.CheckUptateGlobe && window.CheckUptateGlobe(false)
    UMonEvent(piwkCategory, piwkAction, piwkMsg + '_BottomNav')

    Actions[key]({});
  }

  handleIsShowPopularGame(){
    return fetchRequest(ApiPort.popularGame +"gametype=mobilep2p&gameCategory=Popular&gameProvider=SPR&vendorPlatform=mobile&", "GET", )
    .then(res => {
      if(Array.isArray(res) && res.length>0){
        isShowPopularGame=true 
        this.setState({
          isShowPopularGame:true
        })
      }else{
        isShowPopularGame=false 
        this.setState({
          isShowPopularGame:false
        })
      }
    })
    .catch(() => {
    });
  }

   //飛行員遊戲
   handleSprInstant(){
    let gametype = "SPR"
    if (isGameLock == true) {
      Toast.fail("游戏访问限制", 2);
      return;
    }
    //console.log(gametype)
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }
    let data = {
      hostName: common_url,
      productCode: gametype,
      platform: "mobile",
      mobileLobbyUrl:common_url,
      sportsMenu: common_url,
      bankingUrl: common_url,
      logoutUrl: common_url,
      supportUrl: common_url
    };

    UMonEvent("Game", "Launch", `Aviator_SPRInstantGames_BottomNav`);
    
     //1.取popular game gameid
    //2.取遊戲url
   
    Toast.loading("เริ่มล็อบบี้เกม...", 200); //Toast.loading("正在启动游戏,请稍候...", 200);
    fetchRequest(ApiPort.popularGame +"gametype=mobilep2p&gameCategory=Popular&gameProvider=SPR&vendorPlatform=mobile&", "GET", )
      .then(res => {
        console.log('res===',res)
        if(Array.isArray(res) && res.length>0){
          return res[0].gameId
        }
      })
      .then(gameid =>{
          let data = {
          hostName: common_url,
          productCode: gametype,
          platform: "mobile",
          mobileLobbyUrl:common_url,
          sportsMenu: common_url,
          bankingUrl: common_url,
          logoutUrl: common_url,
          supportUrl: common_url
        };
         fetchRequest(ApiPort.Game +gameid+"?isDemo=false&", "POST", data)
         .then(data => {
           Toast.hide();
           var Type = true;
           if (Type == true) {
            let playData = {
              type: "Slot",
              gameid: gameid,
              gametype: gametype,
              img: data.imageUrl,
            };
            Gameplay.unshift(playData);
            if (Gameplay.length > 3) {
              Gameplay.length = 3;
            }
            storage.save({
              key: "GameplayHome", // 注意:请不要在key中使用_下划线符号!
              id: "GameplayHome", //  注意:请不要在id中使用_下划线符号!
              data: Gameplay,
              expires: 1000 * 1600 * 24 * 30
            });
          }

          if (data.errorCode == 2001) {
            Toast.fail(
              "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
              2
            );
            // Toast.fail(
            //   "尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服",
            //   2
            // );
            return;
          }
   
          
           if (data.errorCode == 0) {
             if (data.isMaintenance == true) {
              Toast.fail(
                "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
                //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
                2
              );
               return;
             }
             Actions.GamePage({ GameOpenUrl: data.gameUrl, gametype,noneHead:false,gameid });
           } else {
            Toast.fail(
              "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
              //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
              2
            );
           }
         })
         .catch((err) => {
          console.log('err',err)
           Toast.hide();
         });

      })
      .catch(() => {
        Toast.hide();
      });

  }

  openLiveChat() {
    Actions.LiveChatST()
   // LiveChatOpenGlobe();
  }

  CloseGame() {
    OpenGameXA(NowGameType);
    Actions.pop();
  }

  reloadLiveChatAndroid() {
    if (window.reloadLiveChat) {
      if (Platform.OS === "android") {
        reloadLiveChat();
      }
    }
    Actions.livechat();
  }


  moneyBack(){ 
    // if(NowGameName == 'SGW'){
    //   Actions.pop();
    //   fetchRequest(
    //     ApiPort.lotteryLogout,
    //     "GET"
    //   )
    //     .then(data => { 
    //       console.log('MoneyBack')
    //       ReloadMoneyHome();
          
    //     })
    //     .catch(error => {
    //       console.log('money cant')
    //     }); 
      
    //   NowGameName=''
    // }else{
      Actions.pop();
      NowGameName = ''
    //}

  } 


  ReloadTokenB(){   //重新獲取token 
		let data = {
			 "grantType": "refresh_token",
			 "clientId": "JBO.gb2bc",
			 "clientSecret": "JBOmuitten",
			 "refreshToken": ApiPort.ReToken
      }
      
     // console.log(data,"XXXXXXXaa")
						   
				fetchRequest(ApiPort.Refresh, 'POST',data)
					.then(data => { 		  
						 ApiPort.Token = data.token_type + ' '+data.access_token // 寫入用戶token  token要帶Bearer
             ApiPort.ReToken = data.refresh_token // 寫入用戶token  token要帶Bearer
             
             

					 }).catch(error => {
						    	Gologin = false;
                  //请重新登录,访问过期
					       Toast.fail('คำขอล้มเหลวโปรดลองอีกครั้ง Token',3)
                 navigateToSceneGlobe()   			
					 }) 
	}

	rightBtn(key) {
		if(key == 'preferentialPage') {
			ApiPort.UserTerms = 'เงื่อนไขและข้อตกลงของโปรโมชั่น'
			Actions.UserTerms({TermsType:''})
		}
	}
	onClickBack(key){
       Actions.pop();
  }
	onChangeDate =  (d) =>  {
		window.bonusDate && window.bonusDate(d)
	}

  render() {
    const { isLogin } = this.state;

      window.openOrientation = () => {
          this.openOrientation()
      }
      window.removeOrientation = () => {
          this.removeOrientation()
      }

    window.ReloadGameBox = () => {  //重新加仔遊戲
      this.ReloadGame();
    };

    window.reloadOrientation = () => {
      this.reloadOrientation();
    };

    window.RmoveOrien = () => {
      this.RmoveOrien();
    };

    window.navigateToSceneGlobe = () => {
      this.navigateToScene("logout", "", true);
    };

    window.navigateToSceneGlobeX = () => { 
      this.navigateToScene("logout", "", true);
    };

    window.NewsGetAgen = () => {
      this.NewsGet();
    };

    window.TotalBalGlobe = () => {
      // 全局餘額刷新
      this.TotalBal();
    };

    window.Globlogin = (name,password,key="commonlogin",flag=false) => {
      this.login(name,password,key,flag);
    };



    const NowTitle = key => {
      return (
        <View style={{ right: 15 }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            {key.title}
          </Text>
        </View>
      );
    };
    
    const RenderTitle = key => {
      return (
        <View style={{backgroundColor: '#1a1a1a'}}>
			{
			Platform.OS == "android" &&	
			// android的ImageBackground不能正常使用
			<View>
				<Image resizeMode='repeat' source={require('../images/home/pattern1.png')} style={{ width: width, height: 55}} />
			</View>
			}
          <ImageBackground
				style={{ width: width, height: '100%', flex: 1,display: 'flex',justifyContent: 'space-between',alignItems: 'center',flexDirection: 'row',position:Platform.OS == "android"? 'absolute': 'relative'}}
				resizeMode="repeat"
				source={Platform.OS == "android"? require("../images//home/noimg.png"): require("../images//home/pattern.png")}
			>
				<View style={{width: '20%'}}>
					{
						key.LKey &&
						<TouchableOpacity onPress={() => {Actions.pop()}}style={{paddingLeft: 10}}>
							<Image resizeMode='stretch' source={require('../images/icon-back.png')} style={{ width: 24, height: 24}} />
						</TouchableOpacity>
					}
				</View>
				<View style={{flex:1,alignSelf:"center"}}>
					<Text style={{ color: "#fff", fontSize: 16, textAlign: 'center' }}>
						{key.title}
					</Text>
				</View>
				<View style={{width: '20%'}}>
					{
						key.RKey &&
						<TouchableOpacity onPress={() => {Actions.LiveChatST()}} style={{width: '100%',alignItems: 'flex-end'}}>
							<LiveChatIcon/>
						</TouchableOpacity>
					}
				</View>
		  </ImageBackground>
        </View>
      );
	};
	const RenderBackButton = (key )=> {
		return (
		  <View style={{backgroundColor: '#1a1a1a', marginTop:checkUPerI12()?18:0}}>
			{
			Platform.OS == "android" &&	
			// android的ImageBackground不能正常使用
			<View style={{justifyContent:'center'}}>
				<Image resizeMode='repeat' source={require('../images/home/pattern1.png')} style={{ width: width, height: 55}} />
			</View>
			}
			<ImageBackground
				  style={{ width: width, height: '100%', flex: 1,display: 'flex',justifyContent: 'space-between',alignItems: 'center',flexDirection: 'row',position:Platform.OS == "android"? 'absolute': 'relative'}}
				  resizeMode="repeat"
				  source={Platform.OS == "android"? require("../images//home/noimg.png"): require("../images//home/pattern.png")}
			  >
				  <View style={{width: '20%'}}>
					  {
						  !key.LKey &&
						  <TouchableOpacity onPress={() => { this.onClickBack(key) }} style={{paddingLeft: 10}}>
							  <Image resizeMode='stretch' source={require('../images/icon-back.png')} style={{ width: 24, height: 24}} />
						  </TouchableOpacity>
					  }
				  </View>
				  <View style={{width: '60%'}}>
					  <Text style={{ color: "#fff", fontSize: 16, textAlign: 'center' }}>
						  {key.title}
					  </Text>
				  </View>
				  <View style={{width: '20%'}}>
					  {
						  key.RKey && key.RKey != 'date' &&
						  <TouchableOpacity onPress={() => {
						      if(key.RKey === 'preferentialPage'){
                                  UMonEvent('Promo Nav', 'View', 'GeneralTnC_Promopage');
                              }
                              this.rightBtn(key.RKey)
						  }} style={{width: '100%',alignItems: 'flex-end'}}>
							  <Image resizeMode='stretch' source={require('../images/icon-question.png')} style={{ width: 25, height: 25,marginRight: 10}} />
						  </TouchableOpacity>
					  }
					  {
						  //优惠历史记录里面的右上角时间选择
						  key.RKey && key.RKey == 'date' &&
						  <View style={{alignItems: 'flex-end',paddingRight:8}}>
							  <Image resizeMode='stretch' source={require('../images/calendar.png')} style={{ width: 27, height: 27,marginRight: 10}} />
							  <View style={{position:'absolute',zIndex:30,width:40}}>
												<DatePicker
												value={this.state.DatePickers}
												mode="month"
												defaultDate={new Date(new Date())}
												minDate={new Date(2018, 1, 1)}
												maxDate={new Date(new Date())}
												onChange={this.onChangeDate}
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
												<List.Item arrow="horizontal"styles={StyleSheet.create(newStyleHistore)}>Select Date</List.Item>
												</DatePicker>
								</View>
						  </View>
					  }
				  </View>
			</ImageBackground>
		  </View>
		);
	  };

    const LiveChack = () => {
      return (
        <View style={{ right: 15 }}>
          <TouchableOpacity
            onPressIn={() => this.openLiveChat()}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/icon_lib_live-chat.png")}
              style={{ width: 21, height: 21 }}
            />
            <Text style={{ color: "#fff", left: 5 }}>แชทสด</Text>
          </TouchableOpacity>
        </View>
      );
    };
    const LiveIcon = () => {
      return (
        <View style={{ right: 15 }}>
          <TouchableOpacity
            onPressIn={() => this.openLiveChat()}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/home/icon-csb.png")}
              style={{ width: 28, height: 28 }}
            />
          </TouchableOpacity>
        </View>
      );
    };
    
    const LiveIconM = () => {
      return (
        <View style={{ right: 15 }}>
          <TouchableOpacity 
            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
            onPressIn={() => this.openLiveChat()}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/home/icon-csb.png")}
              style={{ width: 28, height: 28 }}
            />
          </TouchableOpacity>
        </View>
      );
    };

    const LgonUserx = () => {
      return (
        <View style={{ right: 15 }}>
          <TouchableOpacity
            onPressIn={() => Actions.logins()}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0
            }}
          >
            <Text style={{ color: "#fff", left: 5 }}>登录/开户</Text>
          </TouchableOpacity>
        </View>
      );
    };
    const Reload = () => {
      return (
        <Flex style={{paddingTop:checkUPerI12()?12:0}}>
          <Flex.Item style={{marginRight:20}} >
            <TouchableOpacity  onPress={() =>this.moneyBack()} >
              <Image
                resizeMode="stretch"
                source={require("../images/goHome.png")}
                style={{ width: 22, height: 22 }}
              />
            </TouchableOpacity>
          </Flex.Item>
          
          <Flex.Item alignItems="flex-end" style={{marginRight:10}}>
            <TouchableOpacity 
              onPress={() => openmenuX()} 
            >
              <Image
                resizeMode="stretch"
                source={require("../images/menu_burger.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </Flex.Item>

        </Flex>
      );
    };


    const ReloadVLiveChatNews = () => {
      return (
        <View style={{width: width,  flex: 1,display: 'flex',flexDirection: "row", }}>

          <View style={{width: '20%'}}>
          
                <TouchableOpacity onPress={() => {Actions.pop()}}style={{paddingLeft: 10}}>
                  <Image resizeMode='stretch' source={require('../images/icon-back.png')} style={{ width: 24, height: 24}} />
                </TouchableOpacity>
            
            </View>

            <View style={{width: '60%',top:5}}>
          
                <Touch
                  onPressIn={() => this.openLiveChat()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                > 
                  <Text style={{ color: "#fff", left: 5 }}>แชทสด</Text>
                  <Image
                    resizeMode="stretch"
                    source={require("../images/csreload.png")}
                    style={{ width: 16, height: 16,left:10 }}
                  />
                </Touch> 

            </View>

            <View style={{width: '30%',top:5,right:20}}>
          
              <TouchableOpacity onPress={() => {Actions.Equipment()}}>
                  <Text style={{ color: "#21FF00", left: 5 }}>ข้อมูลอุปกรณ์</Text>
              </TouchableOpacity>
          
          </View>


        </View>
      );
    };

    const ScreenPage = () => {
      return (
        <View style={{ right: 15, top: -3 }}>
          <Touch
            hitSlop={{ top: 20, bottom: 20, left: 40, right: 20 }}
            onPress={() => csScreenPage()}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0
            }}
          >
             <Text style={{ color: "#21FF00", left: 5 }}>สกรีนช็อต</Text>
          </Touch>
        </View>
      );
    };

    const ReloadVLiveChat = () => {
      return (
        <View style={{ right: 15, top: -3 }}>
          <Touch
            hitSlop={{ top: 20, bottom: 20, left: 40, right: 20 }}
            onPress={() => reloadLiveChat()}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/icon_lib_refresh1.png")}
              style={{ width: 22, height: 22 }}
            />
          </Touch>
        </View>
      );
    };

    const BackGame = () => {
      return (
        <View style={{ paddingLeft: 15, paddingTop: 5 }}>
          <TouchableOpacity
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => this.CloseGame()}
          >
            <Image
              resizeMode="stretch"
              source={require("../images/back_chevron.png")}
              style={{ width: 20, height: 30 }}
            />
          </TouchableOpacity>
        </View>
      );
    };


    const SPname =() => {

      return(
          <View style={{ paddingLeft: 15, paddingTop: 5 }}>
        
             <Text style={{color:'#fff',textAlign:'center'}}>{SponsorshipPageName}</Text>
         
            </View>
      )

    }

    return (
      <RouterWithRedux
        navigationBarStyle={styles.navBar}
        titleStyle={styles.navTitle}
        sceneStyle={styles.routerScene}
        backAndroidHandler={onBackPress}
      >
        <Modal key="modal" hideNavBar>
          <Lightbox key="lightbox">
            <Stack 
              key="root" 
              headerLayoutPreset={'center'} 
              navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
            >
              <Stack
                key="drawer"
                hideNavBar
                initial={this.props.scene === "login"}
              >
                {ApiPort.UserLogin == true ? (
                <Scene
                  tabs={true}
                  tabBarPosition="bottom"
                  showLabel={false}
                  tabBarStyle={checkUPerI12()?styles.deviceI12TabBarStyle:styles.tabBarStyle}
                  tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                  titleStyle={styles.titleStyle}
                >
                  <Scene
                    key="home"
                    navigationBarStyle={styles.navBarBX}
                    component={Home}
                    icon={TabIcon}
                    titleStyle={styles.titleStyle}
                    tabBarOnPress={() => this.ActionJump('home')}
                  />
                  <Scene
                    key="preferential"
                    // renderLeftButton={() => {  
                    //   return <AppLogo />;
                    // }}
                    renderTitle={() => {//優惠
                      return <RenderTitle title="โปรโมชั่น" RKey={true}/>;
                    }}
                    component={preferential}
                    icon={TabIcon}
                    titleStyle={styles.titleStyle}
                    tabBarOnPress={() => this.ActionJump('preferential')}
                  />

                  <Scene
                    key="deposit"
                    navigationBarStyle={styles.navBarBX}
                    component={deposit}
                    icon={TabIcon}
                    titleStyle={styles.titleStyle}
                    tabBarOnPress={() => this.ActionJump('deposit')}
                  />

            

                  <Scene
                    key="Vip"
                    renderTitle={() => {
                      return <RenderTitle title="VIP" RKey={true} />;
                    }}
                    component={Vip} 
                    icon={TabIcon}
                    titleStyle={styles.titleStyle}
                    tabBarOnPress={() => {
                      this.ActionJump('Vip')
                      window.GetVIPNotification && window.GetVIPNotification()
                    }}
                  />
  
                {this.state.isShowPopularGame &&<Scene
                  key="sprInstant"
                  component={GamePage}    
                  navigationBarStyle={[styles.navBar, {height: 45}]}
                  icon={TabIcon}
                  renderBackButton={() => {
                    return <GameHeadLeft  />;
                  }}
                  titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
        
                  renderRightButton={() => {
                    return <Reload />;
                  }} 
                  tabBarOnPress={() => {
                    this.handleSprInstant()
                  }}
                />}
                    
					        <Scene
                      key="PersonalAccount"
                      navigationBarStyle={styles.navBarBXUser}
                      component={PersonalAccount}
                      icon={TabIcon}
                      titleStyle={styles.titleStyle}
                      tabBarOnPress={() => {
                        this.ActionJump('PersonalAccount')
                        window.GetNewsUnreadNews && window.GetNewsUnreadNews()
                        window.GetVIPNotification && window.GetVIPNotification()
                      }}
                    />
                  </Scene>
                ) : (
                  ApiPort.UserLogin == false && (
                    <Scene
                      key="tabbar"
                      hideNavBar
                      tabs={true}
                      tabBarPosition="bottom"
                      showLabel={false}
                      tabBarStyle={
                        isLogin == false
                          ?checkUPerI12()?styles.deviceI12TabBarStyle:styles.tabBarStyle
                          : styles.NonetabBarStyle
                      }
                      tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
                      titleStyle={styles.titleStyle}
                    >
                      <Scene
                        key="home"
                        navigationBarStyle={styles.navBarBX}
                        component={Home}
                        icon={TabIcon}
                        titleStyle={styles.titleStyle}
                        tabBarOnPress={() => this.ActionJump('home')}
                      />
                      <Scene
                      key="preferential"
                      renderTitle={() => {//優惠
                        return <RenderTitle title="โปรโมชั่น" RKey={true} />;
                      }}
                      component={preferential}
                      icon={TabIcon}
                      titleStyle={styles.titleStyle}
                      tabBarOnPress={() => this.ActionJump('preferential')}
                    />
                      <Scene
                      key="affCooperate"
                      navigationBarStyle={styles.navBarBX}
                      component={deposit}
                      icon={TabIcon} 
                      titleStyle={styles.titleStyle}
                      tabBarOnPress={() => this.ActionJump('affCooperate')}
                    />
                      

                  <Scene
                      key="Vip"
					            renderTitle={() => {
                        return <RenderTitle title="VIP" RKey={true} />;
                      }}
                      component={Vip} 
                      tabBarOnPress={() => this.ActionJump('Vip')} 
                      icon={TabIcon}
                      titleStyle={styles.titleStyle}
                    />
                   
                   {this.state.isShowPopularGame && <Scene
                      key="sprInstant"
                      component={GamePage}    
                      navigationBarStyle={[styles.navBar, {height: 45}]}
                      icon={TabIcon}
                      renderBackButton={() => {
                        return <GameHeadLeft  />;
                      }}
                      titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
            
                      renderRightButton={() => {
                        return <Reload />;
                      }} 
                      tabBarOnPress={() => {
                        this.handleSprInstant()
                      }}
                    />}

                      <Scene
                        key="login"
                        title="登录"
                        component={Login}
                        icon={TabIcon}
                        back
                        tabBarOnPress={() => this.ActionJump('logins')}
                        titleStyle={styles.titleStyle}
                      />
                    </Scene>
                  )
                )}

                <Scene
                  key="home"
                  component={Home}
                  renderLeftButton={() => {
                    return <AppLogo />;
                  }}
                />
                <Scene
                  key="EurocupPage"
                  component={EurocupPage}
                  title=""
                  renderLeftButton={() => {
                    return <AppLogo />;
                  }}
                />
                <Scene
                  key="deposit"
                  component={deposit}
                  title="ประวัติ"
                  onRight={() => this.openLiveChat()}
                  back
                  backButtonTintColor="#4ee42b"
                />
              

                {/* <Scene key="PersonalAccount" title="账户管理" component={PersonalAccount} titleStyle={styles.titleStyle} back  backButtonTintColor="#4ee42b"/> */}
              </Stack>

              {/* </Drawer>   */}
              <Scene
                  key="TI10Event"
                  component={TI10Event}
                  renderLeftButton={() => {
                      return <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                          <Image
                              resizeMode="stretch"
                              source={require("../images/double11Lottery/logo.png")}
                              style={{ width: 22, height: 28, marginRight: 5 }}
                          />
                          <Text style={{ color: '#FFFFFF' }}>กิจกรรมกล่องขุมทรัพย์ TI10</Text>
                      </View>
                  }}

                  renderRightButton={() => {
                      return <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, }}>
                          <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => {
                              Actions.pop()
                          }}>
                              <Image
                                  resizeMode="stretch"
                                  source={require("../images/double11Lottery/home.png")}
                                  style={{ width: 20, height: 20, marginRight: 20 }}
                              />
                          </TouchableOpacity>

                          <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => {
                              Actions.LiveChatST()
                          }}>
                              <Image
                                  resizeMode="stretch"
                                  source={require("./../images/home/icon-csb.png")}
                                  style={{ width: 24, height: 24 }}
                              />
                          </TouchableOpacity>

                      </View>
                  }}
              />
              
              <Scene
                key="Double11Lottery"
                component={Double11Lottery}
								hideNavBar={true}
                renderLeftButton={() => {
                  return <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                    <Image
                      resizeMode="stretch"
                      source={require("../images/double11Lottery/logo.png")}
                      style={{ width: 22, height: 28, marginRight: 5 }}
                    />
                    <View style={{height:'100%',flexWrap:'wrap'}}>
											<Text  style={{ color: '#FFFFFF',flexWrap:'wrap'}}>{Eventtitle}</Text>
										</View>
                  </View>
                }}

                renderRightButton={() => {
                  return <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, }}>
                    <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => {
                      Actions.pop()
                    }}>
                      <Image
                        resizeMode="stretch"
                        source={require("../images/double11Lottery/home.png")}
                        style={{ width: 20, height: 20, marginRight: 20 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => {
                      Actions.LiveChatST()
                    }}>
                      <Image
                        resizeMode="stretch"
                        source={require("./../images/home/icon-csb.png")}
                        style={{ width: 24, height: 24 }}
                      />
                    </TouchableOpacity>

                  </View>
                }}
              />

              <Scene
                back
                backButtonTintColor="#fff"
                key="Double11LotteryRecord"
                component={Double11LotteryRecord}
                //title='Lịch Sử Nhận Thưởng'
								renderBackButton={() => {
									return <RenderBackButton title="ประวัติการรับรางวัล" />;
								}}
              />
              
              <Scene
                back
                backButtonTintColor="#fff"
                key="Double11PreferentialPage"
                component={Double11PreferentialPage}
                //title='Lịch Sử Nhận Thưởng'
									renderBackButton={() => {
									return <RenderBackButton title="รายละเอียดโปรโมชั่น​" RKey={'preferentialPage'} />;
								}}
              />

              <Scene
                  back
                  backButtonTintColor="#fff"
                  key="TI10LotteryRecord"
                  component={TI10LotteryRecord}
                  title='ประวัติการรับรางวัล'
              />
              
              
              <Scene
                key="fogetname"
                title={I18n.t("login.fogetname")}
                component={Fogetname}
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="fogetpassword"
                title={I18n.t("login.fogetpassword")}
                component={Fogetpassword}
                back
                backButtonTintColor="#4ee42b"
              />

              <Scene
                key="fogetindex"
                title={""}
                component={Fogetindex}
                back
                backButtonTintColor="#4ee42b"
              />

              <Scene
                key="GameList"
                component={GameList}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => {
                  return <RenderBackButton title={NowGameTitle} />;
                  }} 
                titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
              />
 
              <Scene
                key="Announcements"
                title=""
                component={Announcements}
                back
                backButtonTintColor="#fff"
                titleStyle={styles.titleStyle}
                renderBackButton={() => {
                  return <RenderBackButton title="平台公告" />;
                  }}
              />
               <Scene
                key="BettingHistory"
                component={BettingHistory}
                renderBackButton={() => {
                  return <RenderBackButton title="ประวัติการเดิมพัน" />;
                  }}
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="VipScene"
                component={Vip}
                renderBackButton={() => {
                  return <RenderBackButton title="VIP" />;
                  }} 
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="VipDetails"
                component={VipDetails}
                renderBackButton={() => { //VIP 專屬在存
                  return <RenderBackButton title="โบนัสเติมเงินพิเศษ VIP" />;
                  }}
                back
                backButtonTintColor="#4ee42b"
              />
               <Scene
                key="VipOverview"
                component={VipOverview}
                renderBackButton={() => {
                  return <RenderBackButton title="VIP总览" />;
                  }}
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="VipReturnWater"
                component={VipReturnWater}
                renderBackButton={() => {  //專屬返水比例
                  return <RenderBackButton title="โบนัสเงินคืนพิเศษสำหรับ VIP" />;
                  }}
                back
                backButtonTintColor="#4ee42b"
              />


              <Scene
                key="Recommend"
                component={Recommend}
                back
                title=""
                backButtonTintColor="#fff"
                renderRightButton={() => {
                  return <LiveIcon />;
                }}
                renderTitle={() => {//推荐好友
                  return <RenderTitle title="แนะนำเพื่อน" />;
                }}
              />

              <Scene
                key="Message"
                //title="投注记录"
                hideNavBar
                component={Message}
                back
                backButtonTintColor="#4ee42b"
                titleStyle={styles.titleStyle}
              />
              <Scene
                key="MessageDetail"
                title="消息详情"
                component={MessageDetail}
                back
                backButtonTintColor="#4ee42b"
                titleStyle={styles.titleStyle}
              />
              <Scene
                key="VipMain"
                component={VipMain}
                renderBackButton={() => {
                  return <RenderBackButton title="VIP" />;
                  }}
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="PromotionVipDetails"
                component={PromotionVipDetails}
                renderBackButton={() => {//晋级VIP等级详情
                  return <RenderBackButton title="รายละเอียดโปรโมชั่นระดับ VIP" />;
                  }}
                back
                backButtonTintColor="#4ee42b"
              />

              <Scene
                key="Bettingrecord"
                title="投注记录"
                component={Bettingrecord}
                back
                backButtonTintColor="#4ee42b"
                titleStyle={styles.titleStyle}
              />
              <Scene
                key="news"
                title=""
                component={News}
                back
                backButtonTintColor="#fff"
                titleStyle={styles.titleStyle}
                renderBackButton={() => {
                  return <RenderBackButton title="消息" />;
                  }}
              />
              <Scene
              key="UserAccount"
              component={UserAccount}
              back
              title=""
              backButtonTintColor="#fff"
              renderBackButton={() => {//个人资料
                return <RenderBackButton title="ข้อมูลส่วนตัว" />;
                }}/>
				  
              <Scene
                key="preferential"
                title="โปรโมชั่น"//"优惠活动"
                component={preferential}
                titleStyle={styles.titleStyle}
                back
                backButtonTintColor="#4ee42b"
              />

              <Scene
                key="Bonushistory"
                title=""
                component={Bonushistory}
                back
                backButtonTintColor="#fff"
                titleStyle={styles.titleStyle}
                renderBackButton={() => { //優惠申請紀錄
                  return <RenderBackButton title="บันทึกการสมัครโปรโมชั่น" RKey={'date'} />;
                }}
              />
              <Scene
                key="preferentialPage"
                component={preferentialPage}
								//title="Điều Kiện Điều Khoản​" 
								back
								backButtonTintColor="#fff"
								titleStyle={styles.titleStyle}
								//優惠內容
								renderBackButton={() => {
									return <RenderBackButton title="รายละเอียดโปรโมชั่น​" RKey={'preferentialPage'} />;
								}}
              />
              <Scene
                key="newUserHelp"
                component={newUserHelp}
                title="新手教程"
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="Help"
                component={newUserHelp}
                title="帮助中心"
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="AccountUser"
                component={AccountUser}
                title=""
                back
                backButtonTintColor="#fff"
                titleStyle={styles.titleStyle}
                renderBackButton={() => {//基本信息
                  return <RenderBackButton title="ข้อมูลพื้นฐาน" />;
                }}
              />
              <Scene
                key="UserAccount"
                component={UserAccount}
                back
                title=""
                backButtonTintColor="#fff"
                renderRightButton={() => {
                  return <LiveIcon />;
                }}
                renderBackButton={() => {//個人資料
                  return <RenderBackButton title="ข้อมูลส่วนตัว" />;
                }}
              />
              {/* <Scene
              key="SharePage"
              title="个人资料"
              component={SharePage}
              back
              backButtonTintColor="#4ee42b"
              /> */}
              <Scene
                key="Password"
                component={Password}
                title=""
                back
                backButtonTintColor="#fff"
                titleStyle={styles.titleStyle}
                renderBackButton={() => { //密碼管理
                  return <RenderBackButton title="จัดการรหัสผ่าน" />;
                }}
              />
              <Scene
                key="userBankcar"
                component={userBankcar}
                title="银行卡管理"
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="bankCenter"
                component={BankCenter}
                title=""
                back
                backButtonTintColor="#fff"
                renderRightButton={() => {
                  return <LiveIcon />;
                }}
                renderBackButton={() => { //提现账户
                  return <RenderBackButton title="จัดการบัญชี" />;
                }}
              />
              <Scene
                key="newBank"
                component={NewBank}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => { //添加銀行卡
                  return <RenderBackButton title="เพิ่มธนาคาร" />;
                }}
              />
              <Scene
                key="newName"
                component={NewName}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => { //新增姓名
                  return <RenderBackButton title="กรุณากรอกชื่อ - นามสกุล" />;
                }}
              />

              <Scene
                key="SponsorshipNewScene"
                renderRightButton={() => {
                  return <LiveIconM />;
                }}
                renderTitle={() => {
                  return <RenderTitle title="สปอนเซอร์ และผู้สนับสนุนหลัก" />;
                }}
                component={SponsorshipNew}
                titleStyle={styles.titleStyle}
                title=""
                back
                backButtonTintColor="#00E62E"
              />
              
              <Scene
                key="HelpCenter"
                component={HelpCenter}
                back
                title=""
                backButtonTintColor="#fff"
                renderRightButton={() => {
                  return <LiveIcon />;
                }}
                renderBackButton={() => {//FAQ
                  return <RenderBackButton title="ช่วยเหลือ" />;
                }}
              />

              <Scene
                key="HelpDetail"
                component={HelpDetail}
                back
                title=""
                backButtonTintColor="#fff"
                renderRightButton={() => {
                  return <LiveIcon />;
                }}
                renderBackButton={() => {//FAQ
                  return <RenderBackButton title="ช่วยเหลือ" />;
                }}
              />
              
              <Scene
                key="userPT"
                component={userPT}
                title="PT老虎机帐户"
                back
                backButtonTintColor="#4ee42b"
              />
              <Scene
                key="userinfo"
                component={userinfo}
                title="自我限制"
                back
                backButtonTintColor="#4ee42b"
              />
              {/* <Scene
                key="LiveChatST"
                component={LiveChat}
                title="แชทสด"
                renderRightButton={() => {
                  return <ReloadVLiveChat />;
                }}
                back
                backButtonTintColor="#4ee42b"
              /> */}
              <Scene
                key="GamePage"
                component={GamePage}   
                navigationBarStyle={[styles.navBar, {height: 45}]}
                // backButtonImage={require('../images/back.png')}
                // backButtonTextStyle={{ width: 35, height: 24}}
                renderBackButton={() => {
                  return <GameHeadLeft  />;
                }}
                titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
      
                renderRightButton={() => {
                  return <Reload />;
                }}
              />
              {/*//   給棋牌遊戲單獨遊戲頁面///*/}
              <Scene
                hideNavBar
                key="JBPGamePage"
                component={GamePage}    
                titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}} 
              />
                {/*//   給棋牌遊戲單獨遊戲頁面///*/}
              <Scene
                key="SponsorshipPage"
                component={SponsorshipPage}
                // renderTitle={() => {
                //   return <SPname />;
                // }}
                title={SponsorshipPageName}
                back
                //title=""
                backButtonTintColor="#4ee42b"
                renderBackButton={() => {
                  return <RenderBackButton title={SponsorshipPageName} />;
                }}
              />
              <Scene
                key="Phone"
                title=""
                component={Phone}
                back
                backButtonTintColor="#fff"
                renderBackButton={() => {//驗證手機
                  return <RenderBackButton title="ยืนยันหมายเลขโทรศัพท์" />;
                }}
              />
              <Scene
                key="ContactDetails"
                component={ContactDetails}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => {
                  return <RenderBackButton title="บัญชีติดต่อ" />;
                }}
              />
              <Scene
                key="UserAddress"
                component={UserAddress}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => {
                  return <RenderBackButton title="ที่อยู่ผู้รับ" />;
                }}
              />
              <Scene
                key="Manualpromotion"
                title=""
                component={Manualpromotion}
                back
                backButtonTintColor="#fff"
                renderBackButton={() => {
                  return <RenderBackButton title="เงื่อนไขและข้อตกลงของโปรโมชั่น" />;
                }}
              />
              <Scene
                key="UserVerifie"
                component={UserVerifie}
                hideNavBar
              />
              <Scene
                key="SharePage"
                component={SharePage}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => { //APP分享
                  return <RenderBackButton title="แชร์ แอป" />;
                }}
              />
              <Scene
                key="AppDowload"
                component={AppDowload}
                title=""
                back
                backButtonTintColor="#fff"
                renderBackButton={() => {
                  return <RenderBackButton title="APP下载" />;
                }}
              />

            </Stack>

          </Lightbox>

          {/* <Scene key="Phone" title="手机验证" component={Phone} /> */}

          <Scene key="RestrictPage"component={RestrictPage} />
          
          <Stack
            key="HongBaoRain"
            headerLayoutPreset="center"
            backButtonTintColor="#4ee42b"
          >
            <Scene
            key="HongBaoRain"
            component={HongBaoRain}            
            renderTitle={() => {
              return <RenderTitle title="粽情端午,抢粽赢彩金" LKey={true} width="50%"/>;
              }}
            />
          </Stack>

          <Stack
            key="HongBaoRainAndroid"
            headerLayoutPreset="center"
            backButtonTintColor="#4ee42b"
          >
            <Scene
              key="HongBaoRainAndroid"
              component={HongBaoRainAndroid}              
              renderTitle={() => {
                return <RenderTitle title="粽情端午,抢粽赢彩金" LKey={true} width="50%"/>;
              }}
            />
          </Stack>

          <Stack
            key="Betting_detail"
            headerLayoutPreset="center"
            navigationBarStyle={styles.navigationBarStyleHeightsmall}
          >
            <Scene key="Betting_detail" component={Betting_detail} />
          </Stack>

          <Stack
            key="Betting_detail"
            headerLayoutPreset="center"
            navigationBarStyle={styles.navigationBarStyleHeightsmall}
          >
            <Scene key="Betting_detail" component={Betting_detail} />
          </Stack>

          <Stack
            key="depositTx"
            // renderLeftButton={() => {
            //   return <BackBtn backFunc={()=>{this.navigateToScene("deposit", "", false);}} />;
            // }}
            // renderRightButton={() => {
            //   return <LiveIcon />;
            // }}
            headerLayoutPreset="center"
            // back
            backButtonTintColor="#4ee42b"
          >
            <Scene key="depositT" component={deposit} title="ฝากเงิน"
            renderTitle={() => {
              return <RenderTitle title="ฝากเงิน" LKey={true} />;
              }}
            />
          </Stack>

          <Scene
            key="newAccount"
            component={NewAccount}
            title=""
            back
            backButtonTintColor="#fff"
            renderRightButton={() => {
              return <LiveIcon />;
            }}
            renderBackButton={() => { //添加NewAccount
              return <RenderBackButton title="เพิ่มบัญชี" />;
            }}
          />
          
          <Scene                           
              key="BqrTrans"              
              component={BQRTransAct}
              renderRightButton={() => {
                return <LiveIconM />;
              }}
              renderLeftButton={() => {
                return <GoBackBtn backFunc={()=>{Actions.deposit()}} />;
              }}
              renderTitle={() => {
                return <RenderTitle title="QR ฝากเงินทศนิยม"/>;
              }}            
              titleStyle={styles.titleStyle}
            />

          <Stack
            key="depositHongBao"
            headerLayoutPreset="center"
            // back
            backButtonTintColor="#4ee42b"
          >
            <Scene 
              key="depositT" 
              component={deposit} 
              renderTitle={() => {
                return <RenderTitle title="ฝากเงิน" LKey={true} />;
              }}
            />
          </Stack>

          <Stack
            key="depositTxMAX"
            headerLayoutPreset="center"
            // renderLeftButton={() => {
            //   return <BackGame />;
            // }}
            backButtonTintColor="#4ee42b"
          >
            <Scene 
              key="depositT" 
              component={deposit} 
              title="ประวัติ"
              renderTitle={() => {
                return <RenderTitle title="ประวัติ" LKey={true} />;
              }}
            />
          </Stack>

          <Stack
            key="recordsTx"
            headerLayoutPreset="center"
            // back
            backButtonTintColor="#4ee42b"
            renderLeftButton={() => {
              return <BackBtn backFunc={()=> this.ActionJump("deposit")} />;
            }}
          >
            <Scene 
              key="recordsT" 
              component={records} 
              renderTitle={() => {
                return <RenderTitle title="ประวัติ" LKey={true}/>;
              }}/>
          </Stack>

          <Scene key="depositPageT" component={depositPage} />

          <Stack
            key="recordsNx"
            headerLayoutPreset="center"
            // back
            backButtonTintColor="#4ee42b"
            renderLeftButton={() => {
              return <BackBtn backFunc={()=> this.ActionJump("deposit")} />;
            }}
          >
            <Scene 
              key="recordsNx"
              component={records} 
              renderTitle={() => {
                return <RenderTitle title="ประวัติ" LKey={true} />;
              }}/>
          </Stack>
          
          <Scene key="depositPageT" component={depositPage} />

          <Stack
            key="CountdownPageTx"
            headerLayoutPreset="center"
            backButtonTintColor="#4ee42b"
            renderTitle={() => {
              return <RenderTitle title="การเงิน" />;
            }}
            renderLeftButton={() => {
              return <BackBtn backFunc={()=> this.ActionJump("deposit")} />;
            }}
          >
            <Scene 
              key="CountdownPageT" 
              component={CountdownPage}
              renderRightButton={() => {
                return <LiveIcon />;
              }}
            />
          </Stack>

          <Stack
            key="transferTx"
            headerLayoutPreset="center"
            back
            backButtonTintColor="#4ee42b"
          >
            <Scene
              key="transferT"
              component={transfer}
              title="ประวัติ"
              renderRightButton={() => {
                return <LiveChack />;
              }}
            />
          </Stack>

          <Stack
            key="withdrawalsTx"
            headerLayoutPreset="center"
            // back
            backButtonTintColor="#4ee42b"
          >
            <Scene
              key="withdrawalsT"
              component={withdrawals}
              title="ประวัติ"
              renderTitle={() => {
              return <RenderTitle title="ประวัติ" LKey={true} />;
              }}
            />
          </Stack>

          <Stack
            key="recordsD"
            headerLayoutPreset="center"
          >
          <Scene key="TransactionDetails" component={TransactionDetails} 
          navigationBarStyle={{ backgroundColor: '#171717', borderBottomWidth: 0 }} 
          renderTitle={() => {
            return <RenderTitle title="ส่งรายการฝากเงินอีกครั้ง"  />;
            }}/>
          </Stack>

          <Scene key="depositPageLB" component={depositPageLB} />
          <Scene key="AlbQrcode"  component={AlbQrcode} /> 
          <Scene key="CryptpQRcode"  component={CryptpQRcode} />
        
          {/* <Scene key="Manualpromotion" component={Manualpromotion} /> */}

          <Stack
            key="PersonalAccountX"
            headerLayoutPreset="center"
            back
            backButtonTintColor="#4ee42b"
          >
            <Scene
              key="PersonalAccountXs"
              component={PersonalAccount}
              title="账户管理"
              back
              backButtonTintColor="#4ee42b"
            />
          </Stack>

          <Stack
            key="AccountUserX"
            headerLayoutPreset="center"
            back
            backButtonTintColor="#4ee42b"
          >
            <Scene
              key="AccountUserXs"
              component={AccountUser}
              title="ข้อมูลส่วนตัว"
              //title="个人资料"
              back
              backButtonTintColor="#4ee42b"
            />
          </Stack>
		      
          <Stack
            key="SecurityCode"
            headerLayoutPreset="center"
            back
            backButtonTintColor="#4ee42b"
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene
              key="SecurityCode"
              component={SecurityCode}
              //title="รหัสความปลอดภัย"//"创建安全码"
              renderTitle={() => {
                return <RenderTitle title="รหัสความปลอดภัย" />;
              }}
              back
              backButtonTintColor="#4ee42b"
            />
          </Stack>
		  
          <Stack
            key="UserContact"
            headerLayoutPreset="center"
            back
            backButtonTintColor="#4ee42b"
          >
            <Scene
              key="UserContact"
              component={UserContact}
             title="ข้อมูลติดต่อ"
              // title="联系方式"
              back
              backButtonTintColor="#4ee42b"
            />
          </Stack>

          <Stack
						key="LoginOptVerify"
						headerLayoutPreset="center"
						backButtonTintColor="#4ee42b"
					>
						<Scene
							key="LoginOptVerify"
							component={LoginOptVerify}
							title="การตรวจสอบความปลอดภัย"
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
						/>
					</Stack>

					<Stack
						key="LoginRevalidateVerify"
						headerLayoutPreset="center"
						backButtonTintColor="#4ee42b"
					>
						<Scene
							key="LoginRevalidateVerify"
							component={LoginRevalidateVerify}
							//title="安全系统升级"
							title="การตรวจสอบความปลอดภัย"
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
						/>
					</Stack>
					

					<Stack
						key="OtpVerification"
						headerLayoutPreset="center"
						backButtonTintColor="#4ee42b"
					>
						<Scene
							key="OtpVerification"
							component={OtpVerification}
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
						/>
					</Stack>

					<Stack
						key="RevVerifyFail"
						headerLayoutPreset="center"
						//backButtonTintColor="#4ee42b"
					>
						<Scene
							key="RevVerifyFail"
							component={RevVerifyFail}
							// title="验证失败"
							title="ยืนยันข้อมูลเกินที่กำหนด"
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
							renderRightButton={() => {
								return <View style={{alignItems: 'center', marginRight: 15,}}>
									<TouchableOpacity hitSlop={{top: 10, right: 10, bottom: 10, left: 10}} onPress={() => {
										Actions.LoginRevalidateVerify()
									}}>
									  <Image
											resizeMode="stretch"
											source={require("../images/close.png")}
											style={{ width:24, height:24 }}
										/>
									</TouchableOpacity>

								</View>
							}}
						/>
					</Stack>


					<Stack
						key="VerifyFail"
						headerLayoutPreset="center"
						//backButtonTintColor="#4ee42b"
					>
						<Scene
							key="VerifyFail"
							component={VerifyFail}
							// title="验证失败"
							title="ยืนยันข้อมูลเกินที่กำหนด"
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
							renderRightButton={() => {
								return <View style={{alignItems: 'center', marginRight: 15,}}>
									<TouchableOpacity hitSlop={{top: 10, right: 10, bottom: 10, left: 10}} onPress={() => {
										Actions.LoginOptVerify()
									}}>
									  <Image
											resizeMode="stretch"
											source={require("../images/close.png")}
											style={{ width:24, height:24 }}
										/>
									</TouchableOpacity>

								</View>
							}}
						/>
					</Stack>

					<Stack
						key="RevVerification"
						headerLayoutPreset="center"
						backButtonTintColor="#4ee42b"
					>
						<Scene
							key="RevVerification"
							component={RevVerification}
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
						/>
					</Stack>

					<Stack
						key="Renewpassword"
						headerLayoutPreset="center"
						backButtonTintColor="#4ee42b"
					>
						<Scene
							key="Renewpassword"
							component={Renewpassword}
							//title="更新密码"
							title="อัปเดตรหัสผ่านใหม่"
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:14}} 
							navigationBarStyle={[styles.navBar, {borderBottomWidth: 0,marginTop:isIphone12Upper?18:0}]}
							panHandlers={null}
						/>
					</Stack>

		      
          <Stack
            key="logins"
          >
			      <Scene
              key="logins"
              component={Login}
              backButtonTintColor="#4ee42b"
              navigationBarStyle={{ backgroundColor: '#000',height: 0 }}
            />
			    </Stack>

			    <Stack
            key="Registered"
          >
			      <Scene
              key="Registered"
              // title={I18n.t("login.registe")}
              component={Registered}
              backButtonTintColor="#4ee42b"
              navigationBarStyle={{ backgroundColor: '#000',height: 0 }}
            />
			    </Stack>        

          <Stack
            key="Equipment"
          >
            <Scene
              key="Equipment"
              component={Equipment}
              title=""
              renderRightButton={() => {
                return <ScreenPage />;
              }}
              renderTitle={() => {
                return <RenderTitle title="ข้อมูลอุปกรณ์" LKey={true} />;
              }}
              backButtonTintColor="#4ee42b"
            />
          </Stack>

          <Stack
            key="LiveChatST"
          >
            <Scene
              key="LiveChatST"
              component={LiveChat}
              title=""
              // renderRightButton={() => {
              // return <ReloadVLiveChat />;
              // }}
              renderTitle={() => {
                return <ReloadVLiveChatNews />;
              }}
              backButtonTintColor="#4ee42b"
            />
          </Stack>

			    <Stack 
            key="fogetindex" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene
              key="fogetindex"
              title={''}
              component={Fogetindex}
              backButtonTintColor="#4ee42b"
              renderTitle={() => { //忘記密碼
                return <RenderTitle title="ลืมยูสเซอร์เนม" LKey={true} />;
              }}
            />
          </Stack>

          <Stack 
            key="LoginFace" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene 
              key="LoginFace"
              renderTitle={() => {//脸部辨识认证
                return <RenderTitle title="จดจำใบหน้า" LKey={true} />;
              }}  
              component={LoginFace}  backButtonTintColor="#FFF" 
            />
          </Stack>

          <Stack 
            key="LoginPattern" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene 
              key="LoginPattern"
              renderTitle={() => {  //设定图形密码
                return <RenderTitle title="ตั้งค่าสมาร์ทล็อค" LKey={true} />;
              }} 
              component={LoginPattern} backButtonTintColor="#FFF" 
            />
          </Stack>

          <Stack 
            key="LoginTouch" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene 
              key="LoginTouch"
              title="จดจำลายนิ้วมือ"
              //title="指纹辨识认证"
              back
              // renderTitle={(props) => {                    
              //   return <RenderTitle title={this.state.loginTouchTitle} LKey={true} />;
              // }}
              component={LoginTouch}  backButtonTintColor="#FFF" 
            />
          </Stack>

          <Stack
            key="SlotGamePage"
          >
            <Scene
              key="SlotGamePage"
              component={GamePage} 
              renderLeftButton={() => {
                return <GameHeadLeft  />;
              }}
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}} 
              renderRightButton={() => {
                return <Reload />;
              }}
            />
          </Stack>
          <Stack 
            key="SlotGameList" 
            navigationBarStyle={{backgroundColor: '#1A1A1A' }}
          >
            <Scene
              key="SlotGameList"
              component={SlotGameList}
              title=""
              back
              backButtonTintColor="#fff"
              renderBackButton={() => {
                  return <RenderBackButton title="สล็อต" />;
              }}
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
            />
          </Stack>

          <Stack 
            key="FishGameList"
            navigationBarStyle={{backgroundColor: '#1A1A1A' }}
          >
            <Scene
              key="FishGameList"
              component={FishGameList}
              title=""
              back
              backButtonTintColor="#fff"
              renderBackButton={() => {
                  return <RenderBackButton title="ยิงปลา" />;
              }}
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
            />
          </Stack>

          <Stack 
            key="P2PGameList" 
            navigationBarStyle={{backgroundColor: '#1A1A1A' }}
          >
            <Scene
              key="P2PGameList"
              component={P2PGameList}
              title=""
              back
              backButtonTintColor="#fff"
              renderBackButton={() => {
                  return <RenderBackButton title="เกม 3 มิติ" />;
              }}
              titleStyle={{color:'#fff',marginHorizontal:0,fontSize:16}}
            />
          </Stack>
        
          <Stack 
            key="FastLogin" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene 
              key="FastLogin"
              renderTitle={() => {  //快速登录
                return <RenderTitle title="ล็อคอินด่วน" LKey={true} />;
              }} 
              component={FastLogin}  backButtonTintColor="#FFF" 
            />
          </Stack>

          <Stack 
            key="LoginPage" 
            headerLayoutPreset="center"  
            renderBackButton={()=>(null)}
          >
					  <Scene 
              key="LoginPage" 
              title={''} 
              hideNavBar 
              component={LoginPage} 
              renderBackButton={()=>(null)}
            />
					</Stack>

          <Stack 
            key="UserTerms" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene
              key="UserTerms"
              title={''}
              component={UserTerms}
              backButtonTintColor="#4ee42b"
              renderTitle={() => {
                return <RenderTitle title={ApiPort.UserTerms} LKey={true} />;
              }}
            />
          </Stack>

          <Stack 
            key="CreatWallet" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0,height:0}}
          >
            <Scene
              key="CreatWallet"
              component={CreatWallet}
              title=""
            />
          </Stack>
        
          <Stack 
            key="OptVerify" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0,height:0}}
          >
            <Scene
              key="OptVerify"
              component={OptVerify}
              title=""
            />
			    </Stack>
       
          <Stack 
            key="NewsPage" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene
              key="NewsPage"
              component={NewsPage}
              title="ศูนย์ข่าว"
              backButtonTintColor="#fff"
              back
            />
			    </Stack>
        
          <Stack 
            key="NewsDetail" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0,height:0}}
          >
            <Scene
              key="NewsDetail"
              component={NewsDetail}
              title=""
            />
			    </Stack>

          <Stack 
            key="RankPage" 
            navigationBarStyle={{ backgroundColor: '#0a0a0a', borderBottomWidth: 0 }}
          >
            <Scene
              key="RankPage"
              component={RankPage}
              title="อันดับ"
              backButtonTintColor="#fff"
              back
            />
			    </Stack>
        </Modal>
      </RouterWithRedux>
    );
  }
}

const mapStateToProps = state => {
  return {
    scene: state.scene.scene
  };
};

const mapDispatchToProps = dispatch => ({
  logout: loginDetails => {
    logout(dispatch, loginDetails);
  },
    userInfo_login: username => ACTION_UserInfo_login(username),
    userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
    maintainStatus_setBTI: (isMaintenance) => ACTION_MaintainStatus_SetBTI(isMaintenance),
    maintainStatus_setIM: (isMaintenance) => ACTION_MaintainStatus_SetIM(isMaintenance),
    maintainStatus_setOW: (isMaintenance) => ACTION_MaintainStatus_SetOW(isMaintenance),
    maintainStatus_noTokenBTI: (isNoToken) => ACTION_MaintainStatus_NoTokenBTI(isNoToken),
    maintainStatus_noTokenIM: (isNoToken) => ACTION_MaintainStatus_NoTokenIM(isNoToken),
    maintainStatus_noTokenOW: (isNoToken) => ACTION_MaintainStatus_NoTokenOW(isNoToken),
    userSetting_updateListDisplayType: (currentType) =>	ACTION_UserSetting_Update(currentType),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

const styles = StyleSheet.create({
  navBar: {
    height: 45,
    color: "#fff",
    backgroundColor: "#111111"
  },

  navBarBX: {
    height: 0,
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
    borderBottomWidth: 0
  },
  navBarBXUser: {
	height: 0,
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
    borderBottomWidth: 0
  },
  routerScene: {
    padding: 0
  },

  navTitle: {
    color: "white"
  },
  NonetabBarStyle: {
    display: "none"
  },
  tabBarStyle: {
    backgroundColor:"#131313",
    height:57,
  },
  tabBarSelectedItemStyle: {
    backgroundColor: "#fff"
  },
  titleStyle: {
    color: "#fff"
  },
    navigationBarStyleHeightsmall: {
        backgroundColor: '#0A0A0A',
        height:0,
        borderBottomWidth: 0,
    },
    deviceI12TabBarStyle:{
      backgroundColor:"#131313",
      height: 75,
      paddingBottom:20
      },
});
