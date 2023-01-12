
import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Linking,
  WebView,
  PermissionsAndroid,
  CameraRoll,
  Modal,
  NativeModules,
  ImageBackground,
  Animated,
  FlatList,
} from "react-native";
import { Tabs } from 'antd-mobile-rn'
import {Modal as ANTDModal} from "antd-mobile-rn";
// import { connect } from 'react-redux';
import { Flex, Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Carousel, { Pagination } from "react-native-snap-carousel";

import Touch from 'react-native-touch-once';
import RegisterPromo from "./RegisterPromo.js"
import HomeVipModal from './../containers/Account/Vip/HomeVipModal.js'
import ActivityEntrance from "./ActivityEntrance"
import IovationX from './../actions/IovationNativeModule';   //android 拿黑盒子 
import LiveChatIcon from './LiveChatIcon'
import  SlotMachinePopUp from "./SlotMachine/SlotMachinePopUp";
import IconDrag from './Double11Lottery/IconGrag'
import moment from 'moment'

const AffCodeIos = NativeModules.CoomaanTools;  //ios 獲取code 參數  
import ContactBox from './ContactBox'
const { width, height } = Dimensions.get("window");

navigationOptions: ({ screenProps }) => {};

const childrenWidth = width / 2.5;
const childrenHeight = height / 6.5;
const itemWidth = 72;
const itemHeight = 36;

// 友盟事件列表
const GameNavView = ['KPK','P2P','GPK','PGS','YDS','SPG',"TG","YDSPNG","YDSRLX"];
const AnalyMaps = {
  IPSB: "BTi",
  SBT: "IMSports",
  OWS: "OW_Sports",
  IPES: "IMESports_Home",
  TFG: "TFESports_Home",
  SXY: 'SEXYCasino_Home',
  EVO: 'EVOCasino_Home',
  GPI: "GPICasino_Home",
  AGL: "AGCasino_Home",
  WMC: 'WMCasino_Home',   
  //P2P: '3DGame_Home',
  GPK: '3DGames_Home',
  PGS: "PGSlot_Home",
  TG: "PPSlot_Home",
  SPG: 'SGSlot_Home',
  YDSPNG: 'PNGSlot_Home',
  YDSRLX: 'RLXSlot_Home',
  YDS: 'YDSlot_Home',
  MGP:'MGSSlot_Home',
  KPK:'KingPoker_3DGame_Home',
  P2P:'KingMaker_3DGame_Home',
};

const VIPListIcon = {
  0: require("../images/home/VIP/VIP0.png"),
  1: require("../images/home/VIP/VIP1.png"),
  2: require("../images/home/VIP/VIP2.png"),
  3: require("../images/home/VIP/VIP3.png"),
  4: require("../images/home/VIP/VIP4.png"),
  5: require("../images/home/VIP/VIP5.png"),
  6: require("../images/home/VIP/VIP6.png"),
  7: require("../images/home/VIP/VIP7.png"),
  8: require("../images/home/VIP/VIP8.png"),
  9: require("../images/home/VIP/VIP9.png"),
  10: require("../images/home/VIP/VIP10.png"),
};

const items = [
  { title: "0", Image: "esport1", NowType: 1, key: 1, isSelect: false },
  { title: "1", Image: "esport2", NowType: 1, key: 2, isSelect: false },
  { title: "2", Image: "esport3", NowType: 1, key: 3, isSelect: false },
  { title: "3", Image: "esport4", NowType: 1, key: 3, isSelect: false }
];
 
const gameTabList = [
  {
    id: "esport",
    title: "อีสปอร์ต",
    imgSelected: require("../images/home/gameTabIcon/icon_esport_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_esport_2.png"),
  },
  {
    id: "sport",
    title: "กีฬา",
    imgSelected: require("../images/home/gameTabIcon/icon_sport_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_sport_2.png"),
  },
  {
    id: "spribe",
    title: "มินิเกม",
    imgSelected: require("../images/home/gameTabIcon/icon_play_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_play_2.png"),
  },
  {
    id: "p2p",
    title: "คาสิโน",
    imgSelected: require("../images/home/gameTabIcon/icon_p2p_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_p2p_2.png"),
  },
  {
    id: "slot",
    title: "สล็อต",
    imgSelected: require("../images/home/gameTabIcon/icon_slot_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_slot_2.png"),
  },
  {
    id: "fishing",
    title: "ยิงปลา",
    imgSelected: require("../images/home/gameTabIcon/update_icon_fishing_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/update_icon_fishing_2.png"),
  },
  {
    id: "casino",
    title: "เกม 3 มิติ",
    imgSelected: require("../images/home/gameTabIcon/icon_casino_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_casino_2.png"),
  },
  {
    id: "lottery",
    title: "หวย",
    imgSelected: require("../images/home/gameTabIcon/icon_lottery_1.png"),
    imgUnselected: require("../images/home/gameTabIcon/icon_lottery_2.png"),
  },
];

export function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  var mia = dd.getHours();
  var minus = dd.getMinutes() < 10 ? "0" + (dd.getMinutes()) : dd.getMinutes() ; //获取当前月份的日期，不足10补0 
  return y + "/" + m + "/" + d+" "+mia+':'+minus;
} 

 
const befordates = GetDateStr(-30);
const nowData = GetDateStr(0);

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Button1: "",
      BannerDB: [],
      newsAnnouncements: [],
      NowType: 1,
      enabled: true,
      scrollEnabled: true,
      isEditState: false,
      Gameplay: "",
      // ReLoadGameK: "",
      activeSlide: 0,
      modal2: true,
      TotalBalSB: 0,
      selectedItems: items.slice(0, 3).filter(item => item.isSelect),
      unselectedItems: items.filter((item) => !item.isSelect),
      HomePromoDB: null,
      HomePromoDB1: null,
      HomePromoDB2: null,
      showPromoActive: 0,
      HomePromoDBData: [],//所以的弹窗数据
      showPromo: false,
      popUpNot:false,
      isRegistData:false,
      AnimatedP2P: false,//棋牌
      AnimatedCASINO: false,//真人
      AnimatedLOTTERY: false,//彩票
      AnimatedSLOT: false,//老虎机
      fadeAnimBC: new Animated.Value(0),//动画透明度
      username:"",
      showRegPromo:false,
      isShowVipModal:false,
      popUpShowTime:'',
      popUpEndTime:'',
      showSlotMachinePopup:false,
      promotionListing: [],
      Promotions: [],
      DisplayReferee: false,
      isActiveCampaign: false,
      isContactVerificationRequired:false,
      isContactVerified:false,
      isDeposited:false,
      isTurnover:false,
      isShowDouble11Icon: true,
      isShowEurCupIcon:true, 
      isShowTI10Icon: true,
      DomainX:'',
      OpenGamemodal: false,
      GameUrl: "",
      ShowContactBox: true,
      isSkynetLogin:false,
      remindUpdateSoftV: false,
      gameTabName: "esport",
      memberLevel: 0,
      activeGames: 0,
      EventFloatIconList:[],
			isShowModalJVENTError:false,
      showGame:false,
      //isShowPopularGame:false,
      isShowPNGGame:false,
    };
    this.navigateToSceneGame = this.navigateToSceneGame.bind(this);
    this.PlayGame = this.PlayGame.bind(this);
    this.onLoadEnd = this.onLoadEnd.bind(this);
    this.JumtProm = this.JumtProm.bind(this);
    this.GetBanner = this.GetBanner.bind(this);
    this.closePromo = this.closePromo.bind(this);
    this.onPromoBtnClick = this.onPromoBtnClick.bind(this);
    this.toggleSlotMachinePopup = this.toggleSlotMachinePopup.bind(this)
    this.goSMdetail = this.goSMdetail.bind(this)
  }

  static onEnter() {
    if(Actions.refs){
      Actions.refs.home.openContactBox()
    }
  };
  
  openContactBox = () => {
    if(!this.state.ShowContactBox){
      console.log('open ContactBox')
      this.setState({
        ShowContactBox: true
      }) 
    }
   }
  
  componentDidMount() {
    this.getUser()
    this.GetFloatIcon()
   // this.getisShowDouble11Icon()
    //Platform.OS === "android" && NativeModules.opeinstall.closeVPN('closeVPN')//默认关闭vpn
    // console.log("Home---DidMount");
    // console.log("Actions.LoginPage",Actions.LoginPage);
    // console.log("ApiPort.UserLogin",ApiPort.UserLogin);
    Toast.hide();
    this.GetDomain(); //合作夥伴
    //this.toggleSlotMachinePopup(); //檢查抽獎活動 開啟否
 
    this.GetHomePromo();   //熱門賽事

    setTimeout(() => {
      reloadOrientation();
    }, 100);

    if (ApiPort.UserLogin == true) {
      this.GetPaymentFirst(); //獲取銀行數據
      this.getVipLevel(); //獲取VIP
      this.GetNews();
      //this.GetWallets();  //獲取目標帳戶
      //this.TotalBal();

      // setTimeout(() => {
      //   LoadGameIPES();
      // }, 2000);
      setTimeout(() => {
	    	this.TotalBal();
      }, 2000);
      
      // LoadGameIPSB();
      // LoadGameOWS();
       
      // setTimeout(() => {
      //   LoadGameSBT();
      // }, 7000); 

      //@友盟推送PMA 並登錄成功 帶入pma頁面  
      //@benji
      if(UmPma == true){  //@UmPma 全局參數  
        setTimeout(() => {
          Actions.Message();
          UmPma = false; 
        }, 1000); 
      }


    }
    //拿客服链接
    this.getLiveChatX()
    //最近遊戲
    this.geGamePlayHome()


    this.GetBanner();
    this.GetGameList()
    
    this.GetNews();
    
    if(Platform.OS == "android"){
      this.getPermissions();
    }
    this.GetBlockBox()   //拿黑盒參數

    //JVENT
    this.listenFocus()

    //是註冊彈窗送彩金 ,只有J102053 代理號顯示
    if(isRegist == true){  
      if(affCodeKex !=""){
        var number = affCodeKex.replace(/ /g,'')
        if(number == 'J102053'){
          this.setState({
            isRegistData:true
          }) 
        }     
      }
      isRegist=false;
	  }
    Animated.timing(      
        this.state.fadeAnimBC,          
        {
          toValue: 1,                  
		      duration: 800,         
        }
    ).start();

  }

  componentWillUnmount() { 
    this.setState({showRegPromo:false,isSkynetLogin:false})
  }

  listenFocus(){
    this.willFocusSubscription = this.props.navigation.addListener(
    'willFocus',() => {
      console.log('willFocus')
      this.showDouble11Icon()
   }
  );
  }

  showDouble11Icon(){
    console.log('showDouble11Icon EventFloatIconList',this.state.EventFloatIconList)
  if(this.state.EventFloatIconList&&this.state.EventFloatIconList.length>0) this.setState({isShowDouble11Icon:true})
  }

  GetVIPNotification() {
    if(!ApiPort.UserLogin) return
    fetchRequest(ApiPort.GetVIPNotification, 'GET').then((data) => {
      if(data.isDisplay) {
        window.vipInfor = data
        window.reloadgapge1 && window.reloadgapge1()
        window.reloadgapge2 && window.reloadgapge2()
        this.setState({
          qwe: "",
        })
      }
    })
  }

  getVipLevel() {
    fetchRequest(ApiPort.VipLevel, "GET")
      .then((res) => {
        console.log("getVipLevel", res);
        this.setState({ memberLevel: res.currentLevelInfo.rank });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getUser() {
    if(!ApiPort.UserLogin) return;
    this.getReferreeTaskStatus();
    fetchRequest(ApiPort.Member, 'GET')
      .then((data) => {
        console.log("getUser", data);
        window.AvatarPicture = data.result.memberInfo.AvatarPicture;
       

        let memberInfo = data.result.memberInfo;
        let DisplayReferee = memberInfo.DisplayReferee;
        this.setState({
          DisplayReferee,
        })

        


        global.storage.save({
          key: "memberInfo", // 注意:请不要在key中使用_下划线符号!
          id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
          data: data.result,
          expires: null,
        });
      })
      .catch(error => {
        //Toast.hide();

      })
  }
  

  getReferreeTaskStatus() {
    if (!ApiPort.UserLogin) return;
    fetchRequest(ApiPort.GetReferreeTaskStatus + '?', 'GET')
      .then((res) => {
        Toast.hide();
        this.setState({
          isActiveCampaign: res.isActiveCampaign,
          isContactVerificationRequired: res.isContactVerificationRequired,
          isContactVerified: res.isContactVerified,
          isDeposited: res.isDeposited,
          isTurnover: res.isTurnover,
        });
      })
      .catch((err) => {
        Toast.hide();
      });
  }

  getVipModalStorge() {
    global.storage
      .load({
        key: "HomeVipHomeModal",
        id: "HomeVipHomeModal",
      })
      .then((res) => {
        let vipList = res.find((v) => v.name === window.userNameDB);
        if (vipList) {
          this.setState({
            isShowVipModal: false,
          });
        } else {
          this.setState({
            isShowVipModal: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          isShowVipModal: true,
        });
      });
  }

  changeHomeVipModal(flag) {
    this.setState(
      {
        isShowVipModal: flag,
      }, 
      () => {
        global.storage
          .load({
            key: "HomeVipHomeModal",
            id: "HomeVipHomeModal",
          })
          .then((res) => {
            res.push({ name: window.userNameDB });
          })
          .catch(() => {
            global.storage.save({
              key: "HomeVipHomeModal",
              id: "HomeVipHomeModal",
              data: [
                {
                  name: window.userNameDB,
                },
              ],
              expires: 1000 * 3600 * 6,
            });
          });
      }
    );
  }
  

  //拿客服链接
  getLiveChatX() {
    fetchRequest(ApiPort.LiveChat, "GET") 
      .then((data) => {
        LiveChatX = data.url;
      })
      .catch(() => {});
  }

  //最近遊戲
  geGamePlayHome() {
    global.storage
    .load({
      key: "GameplayHome",
      id: "GameplayHome",
    })
    .then((ret) => {
      Gameplay = ret.map(function(item) {
        return {
          type: item.type,
          gameid: item.gameid,
          gametype: item.gametype,
          img: item.img,
        };
      });
      this.setState({
        Gameplay: Gameplay,
      });
    })
    .catch(() => {});
  }




  async getPermissions() {
    
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE; 
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
  }

  /** 獲取黑盒子參數*/
  GetBlockBox() {
    if (Platform.OS === "android") {

      IovationX.getE2BlackBox(
          (blackbox) => {
              //	console.log(blackbox) 
              E2Backbox = blackbox;
              // console.log('androidE2Backbox',E2Backbox)
          },
          () => {
              //console.log("Iovation blackbox value failed : " + errorCallback);
          }
        );

        IovationX.getIovationBlackBox(
          (blackbox) => {
              //console.log(blackbox)
              Iovation = blackbox;
          },
          () => {
              //	console.log("Iovation blackbox value failed : " + errorCallback);
          }
        );
      } else {

        AffCodeIos.getVersion((error, event) => {

            if (error) {
              //
            } else { 
              Iovation = event;
            }
        });

        if (!AffCodeIos.getE2BlackBox) {
          return;
        }

        AffCodeIos.getE2BlackBox((error, event) => {
          if (error) {
            //
          } else {
            E2Backbox = event;
            // console.log('iosE2Backbox',E2Backbox)
          }
        });
      }

  }

  GetNews() {
    fetchRequest(
      ApiPort.GetMessages + 
      "announcement?type=0&isRunningText=true&page=1&row=25&", 
      "GET"
    )
      .then((data) => {
        if(
          Array.isArray(data.newsInboxList) && 
          data.newsInboxList.length > 0
        ) {
          this.setState({
            newsAnnouncements: data.newsInboxList,
          });
        }
      })
      .catch(() => {});
  }

  /**
   * 获取优惠数据
   */
  GetHomePromo() {

     
    fetch(
      "https://www.jbo69.com/cms/JBOTH/json/JBO_home_show_sport.json?v=" + 
        Math.random(),
      {
        method: "GET",
      }
    )
      .then((response) => (headerData = response.json()))
      .then((responseData) => {
        console.log('responseData',responseData)
        let NowTime = new Date(nowData).getTime();
        if(responseData.ShowTime){
          let T1 = responseData.ShowTime.split('-').join('/');
          let T2  = responseData.EndTime.split('-').join('/');
            this.setState({
              HomePromoDB: responseData,  
              popUpShowTime:new Date(T1).getTime(),
              popUpEndTime:new Date(T2).getTime(),
            }); 

            if (
              responseData && 
              NowTime >= new Date(T1).getTime()  && 
              NowTime < new Date(T2).getTime() 
            ) { 
              this.setState({
                showGame:true
              })
              //this.OpenSportNews(); //每天一次自動開啟熱門賽事
            }else if( responseData && NowTime > new Date(T2).getTime() ){
              console.log('熱門賽事')
              this.setState({
                showGame:false
              })
            }   

            if (ApiPort.UserLogin == true) {
              setTimeout(() => {              
                global.storage
                  .load({
                    key: "OpenSportNewsABT",
                    id: "OpenSportNewsABT",
                  })
                  .then((res) => {})
                  .catch(() => {
                    global.storage.save({
                      key: "OpenSportNewsABT",
                      id: "OpenSportNewsABT",
                      data:[],
                      expires: 86400000,
                    });          
                  });
          
              }, 6000); 
          }            
        }        
      })
      .catch(error => {
        // 错误处理
        console.log(error);
      });
 
  }

  OpenSportNews() { //熱門賽事推薦
    this.setState({
      showPromo: this.state.showPromo == false ? true : false,
    });
  }

  GetBanner() {
    global.storage
      .load({
        key: "BannerDB",
        id: "BannerDB",
      })
      .then((BannerDB) => {
        this.setState({
          BannerDB,
        });
      })
      .catch(() => {
        //Toast.loading('优惠加载中,请稍候...',200);
      });
      fetchRequest(ApiPort.GetBanners, "GET").then((res) => {
        if (res.bannerListing.length) {
          this.setState({
            BannerDB: res.bannerListing,
          });

          global.storage.save({
            key: "BannerDB",
            id: "BannerDB",
            data: res.bannerListing,
            expires: null,
          });
        }
      });
  }

  /**
   * 关闭优惠弹窗
   */
  closePromo() {
    this.setState({
      showPromo: false,
    });
  }

  // 点击优惠弹窗按钮
  onPromoBtnClick(type) {
    const { HomePromoDB } = this.state;
    this.closePromo(); 
    if (type == 0) {
      this.PlayGame(0, "IPES","อีสปอร์ต", "NoSave");
    } 
    if (type == 1) {
      //  竞博体育
      // this.OPenGameXV("IPSB", "กีฬา IM");
      this.PlayGame(0, "IPSB","กีฬา IM", "NoSave");
    }
  }

  // 餘額刷新
  refreshTotalBal() {
    Toast.loading("กำลังโหลด...", 3000);//Toast.loading("加载...", 3000);
    fetchRequest(ApiPort.Balance, "GET")
      .then((data) => {
        Toast.hide();
        console.log("TotalBal", data);
        TotalBal = data[0].balance;
        MAIN = data[0].balance;
        this.setState({
          TotalBalSB: data[0].balance,
        });
      })
      .catch(() => {
        Toast.hide();
      });
  }

  //餘額
  TotalBal() {
    fetchRequest(ApiPort.Balance, "GET")
      .then((data) => {
        TotalBal = data[0].balance;
        MAIN = data[0].balance;
        this.setState({
          TotalBalSB: data[0].balance
        });
      })
      .catch(() => {
        Toast.hide();
      });
  }

  //獲取目標帳戶
  GetWallets() {
    fetchRequest(ApiPort.Wallets, "GET")
      .then((data) => {
        fromWalletBox = data.fromWallet;
        toWalletBox = data.toWallet;
      })
      .catch(() => {});
  }

  //獲取銀行數據
  GetPaymentFirst() {
    fetchRequest(ApiPort.Payment + "?transactionType=deposit&", "GET")
      .then((data)=> {
        storage.save({
          key: "Bank", // 注意:请不要在key中使用_下划线符号!
          id: "BankData", // 注意:请不要在id中使用_下划线符号!
          data: data,
          expires: 1000 * 1200 * 24,
        });

        this.setState({
          isDepositLock: data.isDepositLock,
          isWithdrawalLock: data.isWithdrawalLock,
          Bank: data,
        });
      })
      .catch(() => {
        //Toast.hide();
      });
  }

  handlePopularSPR(){
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }

    UMonEvent("Game", "Launch", "Aviator_SPRInstantGames_HotGame");   //Piwki 追蹤 加薪遊戲 記得添加
    
    Toast.loading("เริ่มล็อบบี้เกม...", 200);
    fetchRequest(ApiPort.popularGame +"gametype=mobilep2p&gameCategory=Popular&gameProvider=SPR&vendorPlatform=mobile&", "GET", )
    .then(res => {
      if(Array.isArray(res) && res.length>0){
        this.PlayGame(res[0].gameId, "SPR", "SPRIBE", "NoSave")
        return
      }
    
    Toast.hide()
    })
    .catch(() => {
      Toast.hide();
    });

  }

  /**
   * 体育
   * 竞博体育：IPSB、欧洲体育：SBT、SABA体育：OWS
   * @param {string} name 游戏类型
   */
  OPenGameXV(name, title, isFromSportRecom) { 
    console.log('OPenGameXV========',name,title,isFromSportRecom);
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }
    if (AnalyMaps[name]) {
      if (isFromSportRecom) {
        UMonEvent("Game", "Click", "Recommend_IM_Home");
      } else {
        UMonEvent("Game", "Launch", `${AnalyMaps[name]}_Home`); //Piwki 追蹤 加新遊戲 記得添加
      }
    }
    if(name == "OWS" ){
      LoadGameOWS();

      if(OWSClose == "xianzhi" ) {
        Toast.fail(
          "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
          2
        );
        return;
      }
      if(OWSClose == "weihu" ){      
        Toast.fail(
          "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
          //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
          2
        );
      
        //  setTimeout(() => { 
        //   LoadGameOWS(); 
        // }, 2000);

        return;
      }
    }

    if(name == "IPSB" ){
      //UMonEvent("Game","Launch"," IMSports_Home");
      if(IPSBClose == "xianzhi" ) {
        Toast.fail(
          "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
          2
        );
        return;
      }
       if(IPSBClose == "weihu" ){      
        Toast.fail(
          "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
          //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
          2
        );
        
        setTimeout(() => { 
          LoadGameIPSB(); 
        }, 2000);
         return;
       }
    }

    if(name == "SBT" ){
      //UMonEvent("Game","Launch"," BTi_Home");
      if(SBTClose == "xianzhi" ) {
        Toast.fail(
          "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
          2
        );
        return;
      }
      if(SBTClose == "weihu" ){      
        Toast.fail(
          "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
          //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
          2
        );
      
         setTimeout(() => { 
          LoadGameSBT(); 
        }, 2000);

        return;
      }
    }
   
    NowGameType = name;
    OpenGameXA(name, title);
  }
  /** 
   * 电竞、真人、彩票
   * อีสปอร์ต:IPES、AG真人:AGL、ebet真人：IMO、双赢彩票：SGW
   * 请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
   * @param {number} gameid 游戏ID
   * @param {string} gametype 游戏类型
   * @param {*} userGameDB 
   * isMaintenanceJump 是否維護時跳轉另一遊戲
   */
  PlayGame(gameid, gametype, title, userGameDB,isMaintenanceJump=false) {
    console.log("AnalyMaps", gametype);
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }

    if (Platform.OS == "ios" && gametype == "DGT") {
      //偵測是否ios12以上
      console.log("systemVersion", systemVersion);
      let systemVersion = DeviceInfo.getSystemVersion();
      if (systemVersion < 12) {
        this.setState({ remindUpdateSoftV: true });
        return;
      }
    }

 
    let data;
    data = {
      hostName: SBTDomain,
      productCode: gametype,
      platform: "mobile",
      mobileLobbyUrl: SBTDomain,
      //"sportsMenu":common_url,
      bankingUrl: SBTDomain,
      logoutUrl: SBTDomain,
      supportUrl: SBTDomain,
    };
    
    if(AnalyMaps[gametype]){
      if(GameNavView.some((v)=> v=== gametype)){
        UMonEvent("Game Nav", "View", AnalyMaps[gametype]);   //Piwki 追蹤 加薪遊戲 記得添加
      }else{
        UMonEvent("Game", "Launch", AnalyMaps[gametype]);   //Piwki 追蹤 加薪遊戲 記得添加
      }
    }

    Toast.loading("เริ่มล็อบบี้เกม...", 200);
     // Toast.loading('正在启动游戏,请稍候...',200);
    fetchRequest(ApiPort.Game + gameid + "?isDemo=false&", "POST", data)
      .then((data) => {
        Toast.hide();
        console.log(data,'qqqq')
        if (userGameDB != "NoSave") {
          let playData = {
            type: "Game",
            gameid: gameid,
            gametype: gametype,
            img: userGameDB,
          };
          Gameplay.unshift(playData);
          if (Gameplay.length > 3) {
            Gameplay.length = 3;
          }
          storage.save({
            key: "GameplayHome", // 注意:请不要在key中使用_下划线符号!
            id: "GameplayHome", //  注意:请不要在id中使用_下划线符号!
            data: Gameplay,
            expires: 1000 * 1600 * 24 * 30,
          });

          this.setState({
            Gameplay: Gameplay,
            // ReLoadGameK: !this.state.ReLoadGameK
          });
        }

        if (data.errorCode == 2001) {
          Toast.fail(
            "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
            2
          ); 
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
          if (gametype == "DGT") {
            NowGameTitle = title;
            let newurl = `${SBTDomain}/static/cn/GameData/DigitainApp.html?lobbyUrl=${
              data.lobbyUrl
            }&bal=${this.state.TotalBalSB.toLocaleString()}&host=${common_url}&server=${
              data.lobby
            }&platform=${Platform.OS}&token=${data.token}&APIToken=${
              ApiPort.Token
            }`;
            console.log("newurl", newurl);
            Actions.GamePage({
              GameOpenUrl: newurl,
              gametype,
              DGTUrl: data.lobbyUrl,
            });
            // this.openDomin(newurl);
            return;
          }

          if (Platform.OS == "android" && gametype == "GEN") {
            this.openDomin(data.gameUrl);
            storage.save({
              key: "userPlayGame", // 注意:请不要在key中使用_下划线符号!
              id: "userPlayGame", // 注意:请不要在id中使用_下划线符号!
              data: data,
              expires: 1000 * 1200 * 24,
            });

            return;
          }

          // if (Platform.OS == "ios") {
          //   if(gametype == "GPI" || gametype == "AGL"){
          //     this.setState({
          //       GameUrl: data.gameUrl,
          //       OpenGamemodal: true,
          //     })
          //     return;
          //   }
          // }
          
          // if(gametype == 'EVO'){
          //   this.setState({
          //     GameUrl: data.gameUrl,
          //     OpenGamemodal: true,
          //   })
          //   return;
          // }
          
          NowGameTitle = title;
          Actions.GamePage({ GameOpenUrl: data.gameUrl, gametype,gameid });
        } else {
          Toast.fail(
            "เรียนผู้เล่น,เกมปัจจุบันอยู่ระหว่างการปรับปรุง JBO จะนำคุณไปยังเกมยอดนิยมเกมอื่น หากต้องการสอบถามข้อมูลเพิ่มเติมสามารถติดต่อห้องช่วยเหลือสด ได้ตลอด 24 ชั่วโมง",
            //"เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
              //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
            2
          );
          if(isMaintenanceJump){
            setTimeout(()=>{
                if(gametype == "OWS"){
                  this.PlayGame(0, "IPSB","IM กีฬา", "NoSave")
                }else if(gametype == "IPSB" ){
                  this.PlayGame(0, "OWS","SABA กีฬา", "NoSave")
                }else if(gametype == "SBT" ){
                  this.PlayGame(0, "IPSB","IM กีฬา", "NoSave")
                }
            }, 3000)
          }
          return;
        }
      })
      .catch(() => {
        Toast.hide();
        Toast.fail('',1);
      });
  }

  /**
   * 棋牌、电玩、釣魚
   * 竞博棋牌:JBP、竞博电玩:JBR、MGS电玩:IMO、釣魚:JIF,SPG
   * 跳转到游戏大厅：
   * @param {string} key GameList  游戏大厅页面
   * @param {string} item 游戏类型（gametype) 
   */
  navigateToSceneGame(key, item, title) {
    console.log("navigateToSceneGame====",key,item,title)
    RmoveOrien(); //刪掉監聽
    NowGameTitle = title;
    Actions[key]({ data: item });
    if(key == 'FishGameList'){
			if(item === 'JIF'){
				UMonEvent("Game Nav", "View", "JiLi_Fishing_Home"); 
			}else {
				UMonEvent("Game Nav", "View", "SG_Fishing_Home"); 
			}			
		}
    if(AnalyMaps[item]){
      if(item === "MGP"){
        UMonEvent("Game Nav", "Click", AnalyMaps[item]);
      }
      if(GameNavView.some((v)=> v=== item)){
        UMonEvent("Game Nav", "Click", AnalyMaps[item]);   //Piwki 追蹤 加薪遊戲 記得添加
      } 
      // if(item==="YDSPNG" || item==="YDSRLX"){
      //   UMonEvent("Game Nav", "Click", AnalyMaps[item]);   //Piwki 追蹤 加薪遊戲 記得添加
      // } else if(GameNavView.some((v)=> v=== item)){
      //   UMonEvent("Game Nav", "View", AnalyMaps[item]);   //Piwki 追蹤 加薪遊戲 記得添加
      // }else{
      //   UMonEvent("Game", "Launch", AnalyMaps[item]);   //Piwki 追蹤 加薪遊戲 記得添加
      // }
    }
    if(item == "SPR" ){
      UMonEvent("Game Nav", "Click", `SPRInstantGames_Home`);
    }

  }

  ActionJump(key, item, title) {
    console.log("ActionJump", item);
    UMonEvent("Login", "Submit", `${item}_LoginPage`);
    Actions[key]({});
  }


  renderPageBX({ item }) {
    return (
      <View style={styles.warningT}>
        <TouchableOpacity 
          onPress={() => {
            if (ApiPort.UserLogin) {
              Actions.Message();
            } else {
              Toast.fail('ล็อคอิน', 2);
              Actions.logins();
            }
          }}
        >
          <Text numberOfLines={1} style={styles.warningText}>
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderPage({ item, index }) {
    return (
      <View key={index}>
        <TouchableOpacity 
          onPress={() => JumtPromWindow(item, index)} 
          style={{width: width - 40, height: 0.4385 * (width - 40) }}
        >
          <Image
            resizeMode="stretch"
            style={{ 
              width: width - 40, 
              height: 0.4385 * (width - 40),
              borderRadius: 8,
            }}
            source={{ uri: item.bannerImagePath }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  
  GetGameList(key) {
    global.storage
      .load({
        key: "Promotions",
        id: "Promotions",
      })
      .then((Promotions) => {
        this.setState({
          Promotions,
        })
      })
      .catch(() => {
      //Toast.loading('优惠加载中,请稍候...',200);
      });
    
    fetchRequest(ApiPort.GetPromotions, 'GET')
      .then((res) => {
        Toast.hide();
        let Promotions = res.promotionListing;
        if (Promotions.length) {
          this.setState({
            Promotions,
          }) 
          global.storage.save({
            key: "Promotions",
            id: "Promotions",
            data: Promotions,
            expires: null,
          });
        }
      })
      .catch((err) => {
        Toast.hide();
      });
  }

   //優惠打開
   openPref(item) {
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      return;
    }

    ///Toast.loading('优惠加载中,请稍候...',200); 
    // {uri:uri,img:img,contentId:key,promotionMasterCategory:promotionMasterCategory,bonusId:bonusId,titlename:title,PromoDB:this.state.Promotions[i]}
    Actions.preferentialPage({
      preferential: item,
    });
  }

  JumtProm(item, index) {
    console.log('item',item)
    UMonEvent("Banner" + (index - 2) + "_homepage");   //piwiki 追蹤
    const { bannerAccess, bannerRedirectAction, bannerRedirectPath } = item;
    console.log('bannerRedirectPath',bannerRedirectPath,'bannerRedirectAction',bannerRedirectAction)
    if (bannerRedirectPath.toUpperCase().includes('TI10')){
      this.getTI10LotteryStatus();
      UMonEvent('Engagement Event', 'Click', 'Enter_TI10_Banner')
      return;
    }
    if (bannerRedirectPath.toLocaleLowerCase().includes("promotions")) {
      if (bannerRedirectPath.toLocaleLowerCase().includes("id=")) {
        // const { Promotions } = this.state
        // console.log(Promotions)
        // let PromotionsId = bannerRedirectPath.split('=')[1]
        // if (PromotionsId * 1 > 0) {
        //   let PromotionsAllList = Promotions.find(v => v.postId * 1 === PromotionsId * 1)
        //   if (PromotionsAllList) {
        //     this.openPref(PromotionsAllList)
        //   }
        // }
        
        // if (ApiPort.UserLogin == false) {
        //   Toast.fail("ล็อคอิน", 2);
        //   Actions.logins();
        //   return;
        // }
        let PromotionsId = bannerRedirectPath.split("=")[1];
        // Toast.loading('กำลังโหลด',200)
        let promotionData = this.state.Promotions.filter(
          (item) => item.postId == PromotionsId
        );
        if (promotionData[0]) {
            Actions.preferentialPage({
              preferential: promotionData[0],
            });
         }   
        // Toast.loading('加载中...', 200)
        // fetchRequest(ApiPort.GetPromotions, 'GET').then(res => {
        //   Toast.hide()
        //   if (res) {
        //     const findPromotion = res.promotionListing.filter(v => v.postId == PromotionsId)[0]
        //     if(findPromotion){
        //       Actions.preferentialPage({
        //         preferential: findPromotion
        //       });
        //     }
        //   }
        // }).catch(err => {
        //   Toast.hide()
        // })
        return;
      } else {
        Actions.preferential();
        return
      }
    }

    // if(bannerRedirectPath.toLocaleLowerCase().includes('doubleeleven')) {
    //  this.getLotteryStatus('Homebanner_double11')
    //   return
    // }
    if (bannerRedirectAction.toLocaleLowerCase().includes("external")) {
      Linking.openURL(
        bannerRedirectPath.toLocaleLowerCase().includes("http") 
        ? bannerRedirectPath 
        : "http://" + bannerRedirectPath)
      return;
    }
    if (bannerRedirectPath.toLocaleLowerCase().includes('event/')) {
			const eventName = bannerRedirectPath.split('=')[1]
			const templateName = bannerRedirectPath.split('/')[1]
      this.goToDouble11({eventTitle:eventName,templateName:templateName})
			//this.getLotteryStatus(eventName,templateName)
			return
		}
    // if(bannerRedirectAction == "RedRain"){
    //   // 红包雨专属banner
    //   if (Platform.OS === "android" ) {
    //     Actions.HongBaoRainAndroid()
    //   }else{
    //     Actions.HongBaoRain()
    //   }
    //   return
    // }
    // if(bannerRedirectPath) {
    // 	Linking.openURL(bannerRedirectPath);
    // } else {
    // 	Actions.preferential();
    // }
  }
  
  onLoadEnd = () => {
    //testg();
    alert(test);
  };

  chengTitle(type) {
    // console.log(type)
    this.setState({
      NowType: type,
    });
  }

  openDomin(url) {
    Linking.openURL(url);
  }

 

  onSelectedDragEnd = () => this.setState({ scrollEnabled: true });

  onSelectedDragStart = () => {
    if (!this.state.isEditState) {
      this.setState({
        isEditState: true,
        scrollEnabled: false,
      });
    } else {
      this.setState({
        scrollEnabled: false,
      });
    }
  };

  onSelectedClickItem = (data, item, index) => {
    // delete, data 是最新的数据
    if (this.state.isEditState) {
      this.setState({
        selectedItems: [...data].filter((wItem, windex) => windex !== index),
        unselectedItems: [item, ...this.state.unselectedItems],
      });
    }
  };

  onUnSelectedClickItem = (data, item, index) => {
    var Type = true;
    if (this.state.selectedItems.length > 2) {
      if (Type == true) {
        let DB = this.state.selectedItems;
        DB[0] = item;

        this.setState({
          selectedItems: DB,
          unselectedItems: [...data].filter(
            (wItem, windex) => windex !== index
          ),
        });
      }

      return;
    }

    if (Type == true) {
      this.setState({
        selectedItems: [...this.state.selectedItems, item],
        unselectedItems: [...data].filter((wItem, windex) => windex !== index),
      });
    }
  };

  onEditClick = () => {
    this.setState({ isEditState: !this.state.isEditState });
    if (this.state.isEditState == true) {
      CloseHomeButton();
    } else {
      OpenHomeButton();
    }
  };

  onEditClick2 = () => {
    this.setState({ isEditState: false });
  };

  get pagination() {
    const { BannerDB, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={BannerDB.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: "transparent" }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "#1bfe00",
        }}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  jumpDep() {
    UMonEvent("Deposit Nav", "Click", "Deposit_Home");

    Actions.jump("deposit");
    setTimeout(() => {
      reloadPage("deposit");
    }, 100);
  }

  jumpDepWith() {
    UMonEvent("Withdrawal Nav", "Click", "Withdrawal_Home");
    Actions.jump("deposit");
    setTimeout(() => {
      reloadPage("withdrawals");
    }, 100);
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  };


  OpenLottery() {
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }

    this.setState({
      popUpNot:true,
    })
  }
   //轉帳
  lotteryTransfer() {
    return; //彩票遊戲轉帳 關閉

    this.setState({
      popUpNot:false,
    });

    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }
    
   let data = {
    amount: this.state.TotalBalSB, 
    };
    Toast.loading("เริ่มล็อบบี้เกม...", 200);
    fetchRequest(ApiPort.lotteryTransfer, "POST", data)
      .then((data) => { 
        console.log(data);
        this.PlayGame(0, "SGW","双赢彩票","NoSave");
        this.TotalBal();
      })
      .catch(() => {
        //Toast.hide();
      });
  }

  Goback() {
    this.setState({
      isRegistData:false,
      popUpNot:false,
    })
  }
  //去充值
  goBankD() {
    Actions.jump("deposit");
    this.setState({
      isRegistData: false, 
    })
  }
  PromoActive(key) {
	  let dataList = this.state.HomePromoDBData;
	  this.setState({
		showPromoActive: key,
	  })
  }

  // 显示/关闭注册成功弹窗
  toggleRegPromo(flag = false) {
    this.setState({ showRegPromo: flag, isSkynetLogin: flag });
  }


  dateToMs (date) {
    let result = new Date(date).getTime();
    return result; 
}


	// 是否弹出老虎机抽奖
	toggleSlotMachinePopup() {
    const {showSlotMachinePopup} = this.state;
 
      //fetchRequest('/api/Event/LaborDay?', "GET")
      fetchRequest("/api/Event?eventTypeId=7&", "GET")
			.then((data) => {
        console.log(data,'活動');
        if (data.isActive){
        this.setState({
          showSlotMachinePopup: showSlotMachinePopup == false ? true : false,
        });
        } else {
        Toast.fail("活动尚未开放", 2);
        }
			})
      .catch((error) => {
        console.log(error,'活動')
      });
      
	 }
  

  	// 前往老虎机抽奖的优惠详情
	goSMdetail() {
		if (!this.slotMachineData) return;
		const {
      modalHtml,
      thumbnail,
      contentId,
      promotionMasterCategory,
      bonusId,
      title
    } = this.slotMachineData;

		this.setState(
      { showSlotMachinePopup:!this.state.showSlotMachinePopup },
      () => {
        Actions.preferentialPage({
          uri:modalHtml,
          img:thumbnail,
          contentId,
          promotionMasterCategory,
          bonusId,
          titlename:title,
          PromoDB:this.slotMachineData,
          showSlotMachinePopup:true,
        });
			}
    );
  }
  //加密貨幣banner 
  onCTCBanner() {
     if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      return;
    }
      Actions.deposit();
      setTimeout(()=>{
      // this.GetPaymentFirst(1)   
      BankJump();
      },1000)
  }
  OpenLiveChat() {
		UMonEvent("CS_topnavbar") 
    //LiveChatOpenGlobe();
    Actions.LiveChatST();   
   }

  //TI10活動
  getTI10LotteryStatus = () => {
    Actions.TI10Event({
      isDoubleLotteryGameStatus:2
    })
  }

  // getLotteryStatus(pik, isDoubleLotteryGameStatuss) {
  //   Actions.Double11Lottery({
  //     isDoubleLotteryGameStatus: 2,
  //   })
  //   // UMonEvent && pik && UMonEvent(pik)
  //   // return
  //   // Toast.loading('加载中...', 200)
  //   // fetchRequest(ApiPort.GetLotteryStatus + 'eventTypeId=6&', 'GET').then(res => {
  //   //   Toast.hide()
  //   //   if (res.isActive) {
  //   //     // let isDoubleLotteryGameStatus = (!pik && isDoubleLotteryGameStatuss) ? isDoubleLotteryGameStatuss : 2
  //   //     Actions.Double11Lottery({
  //   //       isDoubleLotteryGameStatus: 2
  //   //     })
  //   //   } else {
  //   //     Toast.fail("活动尚未开放", 2);
  //   //   }

  //   // }).catch(err => {
  //   //   Toast.hide()
  //   //   Toast.fail("活动尚未开放", 2);
  //   // })
  //   // UMonEvent && UMonEvent('Floatingicon_double11')
  //   // UMonEvent && UMonEvent('Homebanner_double11')
  //   // UMonEvent && UMonEvent('Promobanner_double11')
  //   UMonEvent && pik && UMonEvent("Engagement Event", "Click", pik);
  // }

  //獲取活動數據
	getLotteryStatus(eventName,templateName) {
		console.log('eventName',eventName)
		console.log('templateName',templateName)

		UMonEvent('Engagement_Event', 'Click', 'Enter_Treasurebox​')
		Toast.loading('กำลังโหลด...', 200)
		fetchRequest(ApiPort.GetLotteryStatus + 'eventName='+eventName+'&templateName='+templateName+'&isPreview='+isEventPreview+'&', 'GET', '' , 35000 ,2).then(res => {
		  Toast.hide()
		  console.log('獲取活動數據 getLotteryStatus res',res)
		  if(res?.displayTitle){
			Eventtitle=res?.displayTitle

			let EventId2= res.eventResources.findIndex(row=>row.objectTypeId==2)
			let EventBannerImg= EventId2!=-1?res.eventResources[EventId2].objectValue:null
			let EventId1= res.eventResources.findIndex(row=>row.objectTypeId==1)
			let EventBGColor= EventId1!=-1?res.eventResources[EventId1].objectValue:null
			let EventId5= res.eventResources.findIndex(row=>row.objectTypeId==5)
			let EventCanNotOpenImg= EventId5!=-1?res.eventResources[EventId5].objectValue:null
			let EventId6= res.eventResources.findIndex(row=>row.objectTypeId==6)
			let EventCanOpenImg= EventId6!=-1?res.eventResources[EventId6].objectValue:null
			let EventId7= res.eventResources.findIndex(row=>row.objectTypeId==7)
			let EventOpenedImg= EventId7!=-1?res.eventResources[EventId7].objectValue:null
  
				Actions.Double11Lottery({
				EventDetail: res,
				EventBannerImg,
				EventBGColor,
				EventCanNotOpenImg,
				EventCanOpenImg,
				EventOpenedImg
		  })
		  }else{
			if(res?.title=='Event not found'){
				this.setState({isShowModalJVENTError:true})
			}else{
				this.GetFloatIcon()
				//this.getLotteryStatus()
			}
		  }
		  
		
		//   if (res.isActive) {
		// 	// let isDoubleLotteryGameStatus = (!pik && isDoubleLotteryGameStatuss) ? isDoubleLotteryGameStatuss : 2
		// 	Actions.Double11Lottery({
		// 	  isDoubleLotteryGameStatus: 2
		// 	})
		//   } else {
		// 	Toast.fail("SẮP BẮT ĐẦU", 2);
		//   }

		}).catch(err => {
		  Toast.hide()
		})
		// UMonEvent && UMonEvent('Floatingicon_double11')
		// UMonEvent && UMonEvent('Homebanner_double11')
		// UMonEvent && UMonEvent('Promobanner_double11')
		// UMonEvent && pik && UMonEvent(pik)
	}


  // getisShowDouble11Icon() {
  //   global.storage.load({
  //     key: "getisShowDouble11Icon",
  //     id: "getisShowDouble11Icon",
  //   })
  //   .then((time) => {
  //     if(time) {
  //       let nowTime = moment(new Date(time)).diff(moment(new Date()), 'seconds') <= 0;
  //       if (nowTime) {
  //         this.setState({
  //         isShowDouble11Icon: true,
  //         });
  //       } else {
  //         this.setState({
  //         isShowDouble11Icon: false,
  //         });
  //       }
  //     }
  //   })
  //   .catch(() => {
  //     this.setState({
  //       isShowDouble11Icon: true,
  //     })
  //   })
  // }

  gotoEuroCup() {
    Actions.EurocupPage();
  }

  gotoTI10() {
    Actions.TI10();
  }

  GetDomain() {  //合作夥伴 

    fetchRequest(ApiPort.Domain + "?", "GET")
      .then((data) => {
        this.setState({
          DomainX: data.affiliateUrlLM,
        });
      })
      .catch(error => {});
  }
  Affiliate(){   //開啟代理頁
    UMonEvent("Affiliate_Home");
    Linking.openURL(this.state.DomainX)
  }

  newLabelImg = () => {
    return (
        <Image 
          resizeMode='cover' 
          source={require('../images/home/new_Label.png')} 
          style={{width: 58, height: 25}}
        />
    )
  }

  hotLabelImg = () => {
    return (
        <Image 
          resizeMode='cover' 
          source={require('../images/home/hot_Label.png')} 
          style={{width: 58, height: 25}}
        />
    )
  }

  closeOpenGamemodal = () => {
    this.setState({
      OpenGamemodal: false,
    })
  }

  openGame = () => {
    this.setState({
      OpenGamemodal: false,
    })
    this.openDomin( this.state.GameUrl );
  }

  closeContactBox = () => {
    this.setState({
      ShowContactBox: false,
    })
  }

  //金額加千位分隔格點
  payMoneyFormat(value) {
    return value == ""
      ? value
      : parseInt(value) > 0 &&
          value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
  }


  

  //遊戲菜單點擊 Btn
  swipeTabs(key, index) {
    console.log('key====',key)
    //scrollview會吃到最長的tab頁 所以到那頁在顯示就好
    if(key?.id=='slot'){
      this.setState({
        isShowPNGGame:true
      })
    }else{
      this.setState({
        isShowPNGGame:false
      })
    }
    this.gameSliding(index)
  }
  
  gameSliding(index) {
   
    this.setState({
      activeGames: index,
    })
    console.log('點擊時的activeGames========',this.state.activeGames)
    //下面游戏內容左右移动，每次移动多少width
    this._GameScrollView.scrollTo({x: (width-20) * index, y: 0, animated: true})

    if(index == 4) {
      //tabs去到最右边
      this._TabsScrollView.scrollToEnd()
    } else if(index == 3) {
      //tabs去到最左边
      this._TabsScrollView.scrollTo({x: 0, y: 0, animated: true})
    }
  }

  goToDouble11(data) {
		isEventPreview=false
		this.getLotteryStatus(data.eventTitle,data.templateName)
	}

  //獲取活動懸浮鈕
	GetFloatIcon(){
		console.log("獲取活動懸浮鈕");
		fetchRequest(ApiPort.GetFloatIcon, "GET", '' , 35000 ,2)
		.then((data) => {
		  console.log("GetFloatIcon", data);
		  if(data){
			this.setState({EventFloatIconList: data})
			EventFloatIconList=data
		  }
		})
		.catch((err) => {
			console.log('GetFloatIcon err',err)
		  Toast.hide();
		});
	}
   
  render() {
    const {
      isShowPNGGame,
      //isShowPopularGame,
      isShowDouble11Icon,
      BannerDB,
      HomePromoDB,
      activeSlide,
      activeGames,
      TotalBalSB,
      newsAnnouncements,
      showRegPromo,
      isShowVipModal,
      popUpShowTime,
      popUpEndTime,
      isActiveCampaign,
      isContactVerified,
      isDeposited,
      OpenGamemodal,
      isSkynetLogin,
      memberLevel,
      EventFloatIconList,
			isShowModalJVENTError,
      showGame
  } = this.state;

    let NowTime = new Date(nowData).getTime();
    window.CloseButton = () => {
      //關閉
      this.onEditClick2();
    };
    // window.ReLoadGame = () => {
    //   //遊戲
    //   this.setState({
    //     ReLoadGameK: !this.state.ReLoadGameK
    //   });
    // };
    window.JumtPromWindow = (imgClickUrl,index) => {
      this.JumtProm(imgClickUrl,index);
    };
    window.ReloadMoneyHome = () => {
      this.TotalBal();
    };
    
    window.toggleRegPromo = (flag)=>{
      this.toggleRegPromo(flag);
    };

    window.showSMPopup =  ()=>{   //老虎機抽獎開關 
			this.toggleSlotMachinePopup();
    };

    // window.getLotteryStatus = (pik) => {
    //   return
    //   this.getLotteryStatus(pik)
    // };

    window.getLotteryStatus = (eventName,templateName) => {
			this.getLotteryStatus(eventName,templateName)
		}

    window.refreshTotalBal = () => {
      this.refreshTotalBal();
		}

    window.GetVIPNotification = () => {
      this.GetVIPNotification();
    };
   
    /* IPES => 电竞 ，SBT => bti, IPSB => IM体育，OWS => SABA体育， AGL => AG真人，IMO => ebet真人 , JBP => 竟博棋牌，JBR => 竟博电玩 */
    return (
      <View style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
        {EventFloatIconList&&EventFloatIconList.length>0&&
				     isShowDouble11Icon && <IconDrag imgUrl={EventFloatIconList[0].imageUrl} chickButton={this.goToDouble11.bind(this,EventFloatIconList[0])} OpenMenu={() => {
						storage.save({
						  key: "getisShowDouble11Icon", // 注意:请不要在key中使用_下划线符号!
						  id: "getisShowDouble11Icon", // 注意:请不要在id中使用_下划线符号!
						data: new Date(moment(new Date()).add(1, 'day').startOf('day')),
						  expires: null
						});

						this.setState({
						  isShowDouble11Icon: false
						})
					  }} />
				// })
				}
         {this.state.ShowContactBox && (
        <ContactBox 
          close={()=>this.closeContactBox()} />
        )}
        <ANTDModal
            animationType='none'
            transparent={true}
            visible={OpenGamemodal}
            onRequestClose={() => { }}
            style={{ padding: 0, width: 275, backgroundColor: '#000' }}
        >

          <Text style={{color: '#fff', textAlign: 'center', marginBottom: 40}}>เรากำลังเปิดหน้าใหม่ให้คุณได้สนุก</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <View style={{flex: 1, marginRight: 20, borderWidth: 1, borderColor: '#fff', borderRadius:5,padding:10}}>
              <TouchableOpacity onPress={()=>this.closeOpenGamemodal()}>
                <Text style={{color: '#fff', textAlign: 'center'}}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, borderWidth: 1, borderColor: '#fff',borderRadius:5, padding:10}}>
              <TouchableOpacity onPress={()=>this.openGame()}>
                <Text style={{color: '#fff', textAlign: 'center'}}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ANTDModal>
        <Modal
          animationType='fade'
          // visible={true}
          visible={Boolean(ApiPort.UserLogin && isActiveCampaign)}
          transparent={true}
        >
          <View style={styles.modalOverly}>
            <View style={[styles.modalContainer, { width: width * .9 }]}>
              <Text style={styles.vipModalText3}>สมัครเพื่อรับโปรโมชั่นล่าสุด</Text>

              <View>
                <View 
                  style={[
                    styles.recommendStatusBox, 
                    { 
                      backgroundColor: true ? "#00B324" : "#2C2C2C", 
                      marginTop: 20, 
                    },
                  ]}
                  >
                  <Image
                    source={require("./../images/user/recommend/recommendStatusImg1.png")}
                    resizeMode='stretch'
                    style={[styles.recommendStatusBoxImg]}
                  ></Image>
                  <Text style={[styles.recommendStatusBoxText]}>สมัครเป็นสมาชิก JBO</Text>
                </View>
                <View style={[styles.recommendBoxArrow]}>
                  {/* <Image
                    source={true ? require('./../images/user/recommend/recommendArrow.png') : require('./../images/user/recommend/recommendArrow1.png')}
                    resizeMode='stretch'
                    style={[styles.recommendArrow]}
                  ></Image> */}
                </View>
                <View 
                  style={[
                    styles.recommendStatusBox, 
                      { 
                        backgroundColor: isDeposited ? "#00B324" : "#2C2C2C" 
                      },
                    ]}
                >
                  <Image
                    source={require("./../images/moneyIcon.png")}
                    resizeMode='stretch'
                    style={[styles.recommendStatusBoxImg]}
                  ></Image>
                  <Text style={[styles.recommendStatusBoxText]}>ฝากเงินและทำยอดหมุนเวียนที่กำหนด</Text>
                </View>
                <View style={[styles.recommendBoxArrow]}>
                  {/* <Image
                    source={(isDeposited) ? require('./../images/user/recommend/recommendArrow.png') : require('./../images/user/recommend/recommendArrow1.png')}
                    resizeMode='stretch'
                    style={[styles.recommendArrow]}
                  ></Image> */}
                </View>
                <View 
                  style={[
                    styles.recommendStatusBox, 
                      { 
                        backgroundColor: isContactVerified ? "#00B324" : "#2C2C2C" 
                      },
                    ]}
                >
                  <Image
                    source={require("./../images/user/recommend/recommendStatusImg3.png")}
                    resizeMode='stretch'
                    style={[styles.recommendStatusBoxImg]}
                  ></Image>
                  <Text style={[styles.recommendStatusBoxText]}>ยืนยันเบอร์โทรและอีเมล</Text>
                </View>
                {
                  !isDeposited ?
                    <TouchableOpacity 
                      onPress={() => {
                        UMonEvent("Deposit Nav", "Click", "Depositnow_referral")
                        this.setState({
                          DisplayReferee: false,
                          isActiveCampaign: false,
                        });
                        Actions.depositTx({
                          fromPage: "home",
                          getUser: () => {
                            this.getUser();
                          },
                        })
                      }} 
                      style={[
                        styles.recommendStatusBox, 
                        { 
                          backgroundColor: "#00B324", marginTop: 20 
                        },
                        ]}
                    >
                      <Text style={[styles.recommendStatusBoxText1]}>ฝากเงินตอนนี้</Text>
                    </TouchableOpacity>
                    :
                    (
                      !isContactVerified
                        ?
                        <TouchableOpacity 
                          onPress={() => {
                            UMonEvent("Verification", "Click", "Verifynow_referral")
                            this.setState({
                              DisplayReferee: false,
                              isActiveCampaign: false,
                            });
                            Actions.AccountUser({
                              fromPage: "home",
                              getUser: () => {
                                this.getUser();
                              },
                            })
                          }} 
                          style={[
                            styles.recommendStatusBox, 
                            { 
                              backgroundColor: "#00B324", marginTop: 20, 
                            }
                          ]}
                        >
                          <Text style={[styles.recommendStatusBoxText1]}>ยืนยันตอนนี้</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity 
                          onPress={() => {
                            this.setState({
                              DisplayReferee: false,
                              isActiveCampaign: false,
                            });
                          }} 
                          style={[
                            styles.recommendStatusBox, 
                            { 
                              backgroundColor: "#00B324", marginTop: 20, 
                            },
                            ]}
                        >
                          <Text style={[styles.recommendStatusBoxText1]}>ปิด</Text>
                        </TouchableOpacity>
                    )
                }

              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  DisplayReferee: false,
                  isActiveCampaign: false,
                });
              }}
              style={[styles.recommendCloseBox]}
            >
              <Image
                source={require("./../images/user/recommend/recommendClose.png")}
                resizeMode='stretch'
                style={[styles.recommendClose]}
              ></Image>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 活動不存在彈窗 */}
			  <Modal
                animationType='fade'
                transparent={true}
                visible={isShowModalJVENTError}
            >
                <View style={styles.formalModal}>
                  <View style={[styles.warringContainer,{height:height/3}]}>
                        {/* <TouchableOpacity onPress={()=>{
                            this.setState({isShowModalJVENTError:false})
                        }} style={{width:'100%',alignItems:'flex-end',marginRight:32}}>
                            <Text style={{color:'#fff',fontSize:20}}>X</Text>
                        </TouchableOpacity> */}
                        <Image
                          resizeMode="stretch"
                          style={{ width: 50, height: 50, marginBottom: 30 }}
                          source={require("../images/icon_warning.png")}
                        />
                        <Text style={{color:'#fff',fontSize:16}}>ขออภัย ยังไม่มีกิจกรรม</Text>
                        <TouchableOpacity style={styles.warringModalBtn} onPress={() => {
                           this.setState({
							isShowModalJVENTError: false
                            })
                        }}>
                            <Text style={{color:'#00B324'}}>ย้อนกลับ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        {/*<IconDrag chickButton={this.getLotteryStatus.bind(this, 'Floatingicon_double11')} OpenMenu={() => {*/}
        {/*  this.setState({*/}
        {/*    isShowDouble11Icon: false*/}
        {/*  })*/}
        {/*}} />*/}

        {/*{*/}
        {/*  isShowTI10Icon&&<IconDrag OpenMenu={() => { this.setState({*/}
        {/*    isShowTI10Icon: false*/}
        {/*  })}} chickButton={()=> {*/}
        {/*    UMonEvent('Engagement Event', 'Click', 'Enter_TI10_FloatingIcon')*/}
        {/*    this.getTI10LotteryStatus()*/}
        {/*  }}*/}
        
        
        {/*  />*/}
        {/*}*/}
        
        {/* {*/}
        {/*  isShowDouble11Icon && <IconDrag chickButton={this.getLotteryStatus.bind(this, 'Floatingicon_double11')} OpenMenu={() => {*/}
        {/*    storage.save({*/}
        {/*      key: "getisShowDouble11Icon", // 注意:请不要在key中使用_下划线符号!*/}
        {/*      id: "getisShowDouble11Icon", // 注意:请不要在id中使用_下划线符号!*/}
        {/*      data: new Date(moment(new Date()).add(1, 'day').startOf('day')),*/}
        {/*      expires: null*/}
        {/*    });*/}
        
        {/*    this.setState({*/}
        {/*      isShowDouble11Icon: false*/}
        {/*    })*/}
        {/*  }} />*/}
        {/*} */}

        {/*抽獎老虎機*/}
        {/* {showSlotMachinePopup &&
        <SlotMachinePopUp  toggleSM={()=>{this.toggleSlotMachinePopup()}} goSMdetail={()=>{this.goSMdetail()}}/>
          } */}
 
        {/* 注册成功弹窗 */}
        {showRegPromo && <RegisterPromo />}
        {isSkynetLogin && <RegisterPromo />}

        {ApiPort.UserLogin && isShowVipModal && (
          <HomeVipModal 
            changeHomeVipModal={this.changeHomeVipModal.bind(this)} />
        )}

        {/** 如果是註冊 代理號是J102053 則彈出該訊息 isRegistData*/}

        {this.state.ShowContactBox && (
        <ContactBox 
          close={()=>this.closeContactBox()} />
        )}
        
        <ImageBackground
          style={{ width: width, height: 50, marginTop:isIphone12Upper?5:0 }}
          resizeMode="repeat"
          source={require("../images/home/pattern.png")}
        >
          <View style={styles.HeadBackground}>
            <View>
              <Image
                resizeMode="contain"
                source={require("../images/J1M2-CNY-logo.png")}
                style={{ width: 153, height: 40 }}
              />
            </View>
            <View style={{position:"absolute",right: 5}}>
              <TouchableOpacity 
                onPress={() => 
                  Actions.LiveChatST({
                    Piwik: "LiveChat_Header",
                  })
                }
              >
                <LiveChatIcon/> 
              </TouchableOpacity>
            </View>          
          </View>
        </ImageBackground>

       

        <ScrollView
          style={{
            flex: 1,
            // marginLeft: 8,
            // marginRight: 8,
            marginTop: ApiPort.UserLogin ? 0 : 8
          }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll = {(event)=>{{
            if (this.state.AnimatedSLOT) { return }
            let scrollY = event.nativeEvent.contentOffset.y;
            if (scrollY > 130) {
              this.setState({ AnimatedP2P: true })
            }
            if (scrollY > 260) {
              this.setState({ AnimatedCASINO: true })
            }
            if (scrollY > 410) {
              this.setState({ AnimatedLOTTERY: true })  //關閉彩票
            //  this.setState({ AnimatedSLOT: true })
            }
            if (scrollY > 540) {
              this.setState({ AnimatedSLOT: true })
            }      
          }}}
          scrollEventThrottle = {100}
        >
          {/* 公告 */}
          {newsAnnouncements?.length > 0 && (
          <Flex style={styles.warning}>
            <Flex.Item style={{ flex: 0.1 }}>
              <Image
                style={{ width: 14, height: 14, alignSelf: "flex-end" }}
                resizeMode="stretch"
                source={require("../images/home/icon_notify.png")}
              />
            </Flex.Item>
            <Flex.Item
              style={{
                marginTop: Platform.OS == "android" ? -2 : 0,
              }}
            >
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={newsAnnouncements}
                renderItem={this.renderPageBX}
                sliderWidth={
                  HomePromoDB &&
                  NowTime >= popUpShowTime &&
                  NowTime < popUpEndTime
                    ? width - 60
                    : width
                }
                itemWidth={
                  HomePromoDB &&
                  NowTime >= popUpShowTime &&
                  NowTime < popUpEndTime
                    ? width - 60
                    : width
                }
                autoplay={true}
                loop={true}
                autoplayDelay={500}
                autoplayInterval={4000}
                style={{ marginTop: -10 }}
              />
            </Flex.Item>
          </Flex>
          )}
          
          {/* Banner */}
          <View style={styles.wrapper}>
            {BannerDB.length > 0 &&  (
              <Carousel
                ref={(c) => {
                  this._carousel = c;
                }}
                data={BannerDB}
                renderItem={this.renderPage}
                sliderWidth={width}
                itemWidth={width - 40}
                autoplay={true}
                loop={true}
                autoplayDelay={700}
                autoplayInterval={6000}
                onSnapToItem={(index) => this.setState({ activeSlide: index })}
              />
            )}
            <Pagination
              dotsLength={BannerDB.length}
              activeDotIndex={activeSlide}
              containerStyle={{
                paddingVertical: 2, 
              }}
              dotStyle={{ 
                backgroundColor: "#1bfe00",
                position:"relative",
                top:5,
              }}
              inactiveDotStyle={{
                width: 10,
                backgroundColor: "#fff",
              }}
              inactiveDotOpacity={1}
              inactiveDotScale={0.6}
            />
          </View>
          
             {/* 老虎機抽獎 */}
            {/* <Flex>
              <Flex.Item>
              <TouchableOpacity onPress={() => this.toggleSlotMachinePopup()}>
              <Image
                          style={{width:width ,height:0.414*(width - 95)}}
                          resizeMode="stretch"
                          source={require("../images/slotmachine/slotbanner.png")}
                        />
                        </TouchableOpacity>
              </Flex.Item>
              </Flex> */}
          {/* 红包雨入口 */}
          {/* {showSlotMachinePopup && <ActivityEntrance /> }  */}
          <ActivityEntrance />
          {/* <Flex>
              <Flex.Item>
              <TouchableOpacity onPress={() => this.onCTCBanner()
               }>
              <Image
                          style={{width:width ,height:0.3075*width}}
                          resizeMode="stretch"
                          source={require("../images/crypto-feature-icon.png")}
                        />
                        </TouchableOpacity>
              </Flex.Item>
              </Flex> */}
          <View
            style={{ marginVertical: 15, marginHorizontal: 10 }}
          >
            {!ApiPort.UserLogin && (
              <Flex>
                <Flex.Item alignItems="flex-start" style={{ flex: 0.8 }}>
                  <Text style={{ color: "#CCCCCC", fontSize: 12 }}>
                    ยินดีต้อนรับ {"\n"}
                    เข้าสู่ JBO
                  </Text>
                </Flex.Item>
                <Flex.Item alignItems="flex-end">
                  <Flex direction="row">
                    <Flex.Item>		  
                      <TouchableOpacity onPressIn={() =>this.ActionJump('logins','login')}>
                        <View style={[styles.Loginzhucebtn, styles.Loginbtn]}>
                          <Image
                            style={styles.Headeleftright}
                            resizeMode="stretch"
                            source={require("../images/home/icon-new-login.png")}
                          />
                          <Text
                            style={{
                              color: "#00E62E",
                              fontSize: 15,
                            }}
                          >
                            เข้าสู่ระบบ
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Flex.Item>
                    <Flex.Item alignItems="flex-end">
                      <TouchableOpacity 
                        onPress={()=> 
                        this.ActionJump('Registered','Register')
                        }
                      >
                        <View style={[styles.Loginzhucebtn, styles.Zhucebtn]}>
                          <Image
                            style={styles.Headeleftright}
                            resizeMode="stretch"
                            source={require("../images/home/icon-new-signup.png")}
                          />
                            <Text
                              style={{
                                color: "#00CAFF",
                                fontSize: 15,
                              }}
                            >
                              สมัคร
                            </Text>
                        </View>
                      </TouchableOpacity>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </Flex>
            )
            }

            {ApiPort.UserLogin && (
              <Flex>
                <Flex.Item alignItems="flex-start" style={{flex: 1.6 }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Image
                      style={styles.IconAvatar}
                      resizeMode="stretch"
                      source={require("../images/home/icon_avata.png")}
                    />
                    <View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                      <Text style={{ color: "#CCCCCC", fontSize: 12 }}>
                        {userNameDB}{" "}{" "}
                      </Text>
                      <View>
                      {memberLevel==1 ? null :
                        <Image
                          resizeMode="stretch"
                          style={{ width: 31, height: 14, marginLeft: 5 }}
                          source={VIPListIcon[memberLevel - 1]}
                        ></Image>}
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#fedd3a", fontSize: 18, fontWeight:'bold' }}>
                        ฿{" "}{this.payMoneyFormat(TotalBalSB)}{" "}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.refreshTotalBal()}
                      >
                        <Image
                          style={styles.IconRefresh}
                          resizeMode="stretch"
                          source={require("../images/home/icon_refresh.png")}
                        />
                      </TouchableOpacity>
                    </View>
                    </View>
                  </View>
                </Flex.Item>
                <Flex.Item alignItems="flex-end">
                  <Flex direction="row">
                    <Flex.Item>
                      <TouchableOpacity onPress={() => this.jumpDep()}>
                        <View 
                          style={[styles.BepositWithdrawal, styles.Bepositbtn]}
                        >
                          <Text
                            style={{
                              color: "#00E62E",
                              fontSize:14,
                            }}
                          >
                            ฝาก
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Flex.Item>
                    <Flex.Item alignItems="flex-end">
                      <TouchableOpacity onPress={() => this.jumpDepWith()}>
                        <View 
                          style={[styles.BepositWithdrawal, styles.Withdrawalbtn]}
                        >
                          <Text
                            style={{
                              color: "#00CAFF",
                              fontSize:14,
                            }}
                          >
                            ถอน
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Flex.Item>
                  </Flex>
                </Flex.Item>
              </Flex>
            )}
          </View>

         

          {/* 遊戲TAB Btn*/}
          <View style={{ paddingHorizontal: 10 }}>
            <ScrollView
              ref={(ref) => { this._TabsScrollView = ref }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {
                gameTabList.map((item, index) => {
                  return(
                    <Touch onPress={() => {this.swipeTabs(item, index)}} style={index} style={{padding: 1.5,paddingTop:10}}>
                      <View
                        style={{
                          borderColor: "#00E62E",
                          borderRadius: 4,
                          borderWidth: activeGames == index ? 1 : 0,
                          width: (width - 23) /6,
                          height: 60,
                          marginRight: 2.5,
                          backgroundColor:
                          activeGames == index ? "#111111" : "#222222",
                          justifyContent: "center",
                        }}
                      >
                        {activeGames == index ? (
                        <Image
                            style={styles.IconGameTab}
                            resizeMode="stretch"
                            source={item.imgSelected}
                        />
                        )
                        :(
                        <Image
                            style={styles.IconGameTab}
                            resizeMode="stretch"
                            source={item.imgUnselected}
                        />
                        )}
                        <Text
                        style={{
                            color: activeGames == index ? "#00E62E" : "#fff",
                            textAlign: "center",
                            fontSize: 12,
                            lineHeight: 20,
                        }}
                        >
                        {item.title}
                        </Text>
                      </View>
                      {/* <Text style={{color: activeGames == index? 'red': '#fff'}}>{item.id}</Text> */}
                    </Touch>
                  )
                })
              }
            </ScrollView>

            <ScrollView
              ref={(ref) => { this._GameScrollView = ref }}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd = {(e) => {
                let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
                let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度
                let activeGames = 0
                if(offsetY != 0) {
                  //滑动块数
                  //activeGames = parseInt(offsetY / oriageScrollWidth)
                  activeGames = (offsetY / oriageScrollWidth).toFixed(0)
                }

                if(activeGames > 3) {
                  //tabs去到最右边
                  this._TabsScrollView.scrollToEnd()
                } else if(activeGames < 3) {
                  //tabs去到最左边
                  this._TabsScrollView.scrollTo({x: 0, y: 0, animated: true})
                }
                //每次滑动几个width
                this.setState({activeGames})
              }}
            >
              {/* 电竞 */}
              {
                <View style={{width: width-20,paddingTop:10}}>
                  <TouchableOpacity
                    onPress={() => this.PlayGame(0, "IPES", 'IM อีสปอร์ต', "NoSave")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require("../images/home/TH-new-esports-jbo.jpg")}
                      style={styles.gameImgStyle2}
                    >
                      <Text style={styles.gameTitleStyle}>
                        IM อีสปอร์ต
                      </Text>
                      <View style={styles.GoToGameBtn}>
                        <Text style={styles.GoToGameTextStyle}>
                          เดิมพันเลย >
                        </Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.PlayGame(0, "TFG", 'TF อีสปอร์ต', "NoSave")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require("../images/home/TH-new-esports-tf.jpg")}
                      style={styles.gameImgStyle2}
                    >
                      <Text style={styles.gameTitleStyle}>
                        TF อีสปอร์ต
                      </Text>
                      <View style={styles.GoToGameBtn}>
                        <Text style={styles.GoToGameTextStyle}>
                          เดิมพันเลย >
                        </Text>
                      </View>                  
                    </ImageBackground>
                  </TouchableOpacity>
                  {/* 热门赛事 รายการแข่งขัน */}
                  {showGame&&<Text
                    style={{ color: "#fff", marginVertical: 15, lineHeight: 22 }}
                  >
                    รายการแข่งขัน{" "}{" "}
                    <Image
                      source={require("../images/home/tag_hot.png")}
                      style={{
                        width: 32,
                        height: 22,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 6,
                      }}
                    ></Image>
                  </Text>}
                  {showGame&&
                    HomePromoDB && activeGames == 0 &&
                      HomePromoDB.ESportdata.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={()=>
                            this.PlayGame(0, "IPES", 'อีสปอร์ต', "NoSave")
                          }
                        >
                          <View
                            style={{
                              marginVertical: 6,
                              backgroundColor: "#222222",
                            }}
                          >
                            <Flex style={{ padding: 10 }}>
                              <Flex.Item
                                alignItems="flex-start"
                                style={{ paddingLeft: 10 }}
                              >
                                <Text
                                  style={{
                                    color: "#CCCCCC",
                                    textAlign: "center",
                                    fontSize: 12,
                                    paddingBottom: 5,
                                  }}
                                >
                                  {item.title}
                                </Text>
                              </Flex.Item>
                              <Flex.Item
                                alignItems="flex-end"
                                style={{ paddingRight: 10 }}
                              >
                                <Text
                                  style={{
                                    color: "#CCCCCC",
                                    textAlign: "center",
                                    fontSize: 12,
                                  }}
                                >
                                  {item.time}
                                </Text>
                              </Flex.Item>
                            </Flex>
                            <Flex
                              alignItems="center"
                              style={{
                                justifyContent: "space-around",
                                padding: 10,
                              }}
                            >
                              <Flex.Item
                                alignItems="center"
                                style={{ paddingLeft: 10 }}
                              >
                                <Image
                                  resizeMode="stretch"
                                  style={{ width: 40, height: 40 }}
                                  source={{ uri: item.icon1 }}
                                />
                                <Text
                                  style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    textAlign: "center",
                                    fontSize: 12,
                                    lineHeight: 30,
                                  }}
                                >
                                  {item.name1}
                                </Text>
                              </Flex.Item>
                              <Flex.Item
                                style={{
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Image
                                    source={require("../images/home/icon_vs.png")}
                                    style={{ width: 40, height: 40 }}
                                  />
                                </View>
                              </Flex.Item>
                              <Flex.Item
                                alignItems="center"
                                style={{ paddingRight: 10 }}
                              >
                                <Image
                                  resizeMode="stretch"
                                  style={{ width: 40, height: 40 }}
                                  source={{ uri: item.icon2 }}
                                />
                                <Text
                                  style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    textAlign: "center",
                                    fontSize: 12,
                                    lineHeight: 30,
                                  }}
                                >
                                  {item.name2}
                                </Text>
                              </Flex.Item>
                            </Flex>

                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              }

              {/* 体育 */}
              {      
                <View style={{width:width-20,paddingTop:10}}>
                  <View>
                    <TouchableOpacity
                      // onPress={() => this.OPenGameXV("OWS","SABA กีฬา")}
                      onPress={() => this.PlayGame(0, "OWS","SABA กีฬา", "NoSave",true)}
                      
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require("../images/home/TH-new-SABA.jpg")}
                        style={{
                          marginVertical: 5,
                          width: width - 20,
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text style={styles.gameTitleStyle}>
                          SABA กีฬา
                        </Text>
                        <View style={styles.GoToGameBtn}>
                          <Text style={styles.GoToGameTextStyle}>
                            เดิมพันเลย >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      // onPress={() => this.OPenGameXV("IPSB","IM กีฬา")}
                      onPress={() => this.PlayGame(0, "IPSB","IM กีฬา", "NoSave",true)}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/W_IPSB.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 223,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle5}
                        >
                          IM กีฬา
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "30%",
                            left: "7%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>  
                    <TouchableOpacity
                      // onPress={() => this.OPenGameXV("SBT","BTi กีฬา")}
                      onPress={() => this.PlayGame(0, "SBT","BTi กีฬา", "NoSave",true)}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-BTi.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 223,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle5}
                        >
                          BTi กีฬา​
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "30%",
                            left: "7%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>                 
                      </ImageBackground>
                    </TouchableOpacity>         
                  </View>
                  {/* 热门赛事 รายการแข่งขัน */}
                  {showGame&&<Text
                    style={{ color: "#fff", marginVertical: 15, lineHeight: 22 }}
                  >
                    รายการแข่งขัน{" "}
                    <Image
                      source={require("../images/home/tag_hot.png")}
                      style={{
                        width: 22,
                        height: 14,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></Image>
                  </Text>}
                  {showGame&&
                    HomePromoDB && activeGames == 1 &&
                      HomePromoDB.Sportdata.map((item, index) => {
                      return (
                        <TouchableOpacity
                          onPress={()=>
                            // this.OPenGameXV("IPSB","กีฬา IM", true)
                            this.PlayGame(0, "IPSB","กีฬา IM", "NoSave")
                          }
                        >
                          <View
                            style={{
                              marginVertical: 6,
                              backgroundColor: "#222222",
                            }}
                          >
                            <Flex style={{ padding: 10 }}>
                              <Flex.Item
                                alignItems="flex-start"
                                style={{ paddingLeft: 10 }}
                              >
                                <Text
                                  style={{
                                    color: "#CCCCCC",
                                    textAlign: "center",
                                    fontSize: 12,
                                    paddingBottom: 5,
                                  }}
                                >
                                  {item.title}
                                </Text>
                              </Flex.Item>
                              <Flex.Item
                                alignItems="flex-end"
                                style={{ paddingRight: 10 }}
                              >
                                <Text
                                  style={{
                                    color: "#CCCCCC",
                                    textAlign: "center",
                                    fontSize: 12,
                                  }}
                                >
                                  {item.time}
                                </Text>
                              </Flex.Item>
                            </Flex>
                            <Flex
                              alignItems="center"
                              style={{
                                justifyContent: "space-around",
                                padding: 10,
                              }}
                            >
                              <Flex.Item
                                alignItems="center"
                                style={{ paddingLeft: 10 }}
                              >
                                <Image
                                  resizeMode="stretch"
                                  style={{ width: 40, height: 40 }}
                                  source={{ uri: item.icon1 }}
                                />
                                <Text
                                  style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    textAlign: "center",
                                    fontSize: 12,
                                    lineHeight: 30,
                                  }}
                                >
                                  {item.name1}
                                </Text>
                              </Flex.Item>
                              <Flex.Item
                                style={{
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    flexDirection: "row",
                                  }}
                                >
                                  <Image
                                    source={require("../images/home/icon_vs.png")}
                                    style={{ width: 40, height: 40 }}
                                  />
                                </View>
                              </Flex.Item>
                              <Flex.Item
                                alignItems="center"
                                style={{ paddingRight: 10 }}
                              >
                                <Image
                                  resizeMode="stretch"
                                  style={{ width: 40, height: 40 }}
                                  source={{ uri: item.icon2 }}
                                />
                                <Text
                                  style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    textAlign: "center",
                                    fontSize: 12,
                                    lineHeight: 30,
                                  }}
                                >
                                  {item.name2}
                                </Text>
                              </Flex.Item>
                            </Flex>

                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>             
              }

               {/* 小游戏 */}
            {
              <View style={{width:width-20,paddingTop:10}}>
                <TouchableOpacity
                onPress={() => this.navigateToSceneGame("GameList", "SPR", "SPRIBE")}
                >
                  <ImageBackground
                    resizeMode="stretch"
                    source={require("../images/home/Spribe.png")}
                    style={styles.gameImgStyle2}
                  >
                    <View style={{flexDirection:'row',top:16,left:17}}>
                      <View style={{top:5}}>
                        <Text style={{ color: "#FFFFFF",fontSize: 16,marginRight:10}}>SPRIBE</Text>
                      </View>
                      <Image
                        resizeMode="stretch"
                        source={require("../images/home/label_new.png")}
                        style={{
                          width: 41,
                          height: 28,
                        }}
                      ></Image>
                    </View>
                    <View style={[styles.GoToGameBtn,{
                      backgroundColor:Platform.OS=='android'? '#FFFFFF70': '#FFFFFF80',
                      shadowOffset: { width: 2, height: 4 },
                      shadowOpacity: 0.9,
                      shadowRadius: 6,
                      shadowColor: '#020202',
                      elevation: 20,
                      position: 'relative',
                      alignItems: 'center'}]}>
                      <Text style={[styles.GoToGameTextStyle,{color:Platform.OS=='android'? '#FFFFFF70':'#FFF'}]}>เดิมพันเลย ></Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>

               {isShowPopularGame && <View style={{flexDirection:'row',marginTop:24,marginBottom:10}}>
                  <Text style={{color:'#F5F5F5',fontSize:16,alignSelf:'center',marginRight:4}}>เกมยอดนิยม</Text>
                  <Image
                        resizeMode="stretch"
                        source={require("../images/home/tag_hot.png")}
                        style={{
                          width: 38,
                          height: 22,
                        }}
                  ></Image>
                </View>}


               {isShowPopularGame && 
                <TouchableOpacity
                onPress={() => this.handlePopularSPR(true)}
                >
                  <ImageBackground
                    resizeMode="stretch"
                    source={require("../images/home/sp_hot_game.png")}
                    style={{ marginVertical: 5,
                      width: width - 20,
                      height: 0.265 * (width - 20),
                      alignSelf: "center",}}
                  >
                  </ImageBackground>
                
               </TouchableOpacity>
               }
              </View>
            }

              {/* 真人 */}
              {
                <View style={{width:width-20,paddingTop:10}}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.PlayGame(0, "SXY", "SEXY คาสิโน", "NoSave")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-icon-sexy.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 223,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle2}
                        >
                          SEXY{"\n"}คาสิโน​
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "30%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>  
                    <TouchableOpacity
                      onPress={() => this.PlayGame(0, "EVO", "EVO คาสิโน", "NoSave")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-icon-EVO.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 223,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle2}
                        >
                          EVO คาสิโน​
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "40%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                        {/* <Image
                          resizeMode="stretch"
                          source={require("../images/home/icon-newLabel.png")}
                          style={{
                            width: 38,
                            height: 20,
                            position: "absolute",
                            top: "35%",
                            left: 10,
                          }}
                        ></Image>*/}
                      </ImageBackground>
                    </TouchableOpacity>         
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >    
                    <TouchableOpacity
                      onPress={() => this.PlayGame(0, "GPI", "GPI คาสิโน", "NoSave")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-icon-GPI.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:(width - 30) / 3,
                          //width:0.5 * (width-155),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle3}
                        >
                          GPI คาสิโน
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "53%",
                            left: "8%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>      
                    <TouchableOpacity
                      onPress={() => this.PlayGame(0, "AGL", "AG คาสิโน", "NoSave")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-icon-AG.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:(width - 30) / 3,
                          //width:0.5 * (width-155),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle3}
                        >
                          AG คาสิโน
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "53%",
                            left: "8%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      onPress={() => this.PlayGame(0, "WMC", "WM คาสิโน", "NoSave")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-icon-WM.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:(width - 30) / 3,
                          //width:0.5 * (width-155),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle3}
                        >
                          WM คาสิโน
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "53%",
                            left: "8%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity> 
                  </View>
                </View>
              }

              {/* 电玩 */}
              {
                <View style={{width:width-20,paddingTop:10}}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "PGS", "PG สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-update-PGgame.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          PG สล็อต
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "35%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "MGP", "MGS สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-new-MGSgame.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          MGS สล็อต
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "35%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text> 
                        </View>
                        {/* <Image
                            resizeMode="stretch"
                            source={require("../images/home/new-icon-Label.png")}
                            style={{
                              width: 40,
                              height: 27,
                              position: "absolute",
                              top: "26%",
                              left: 10,
                            }}
                        ></Image> */}
                      </ImageBackground>
                    </TouchableOpacity> 
                          
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "TG", "PP สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-update-PPgame.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          PP สล็อต
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "35%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                        <Image
                          resizeMode="stretch"
                          source={require("../images/home/update-hot-icon-Label.png")}
                          style={{
                            width: 45,
                            height: 20,
                            position: "absolute",
                            top: "28%",
                            left: 10,
                          }}
                        ></Image> 
                      </ImageBackground>
                    </TouchableOpacity>   
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "SPG", "SG สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-update-JBOgame.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:0.5 * (width-25),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          SG สล็อต
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "35%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity> 
                  </View>
                  {isShowPNGGame && <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "YDSPNG", "PNG สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-update-PNG.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:(width - 30) / 3,
                          //width:Platform.OS === "android" ? 0.5 * (width-162):!(mobileDevice === "iPhone10,3" || mobileDevice === "iPhone10,6" || mobileDevice === "iPhone11,2")? 0.5 * (width-162):0.5 * (width-153),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          PNG สล็อต
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "60%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>   
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "YDSRLX", "RLX สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-update-RLX.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:(width - 30) / 3,
                          //width:Platform.OS === "android" ? 0.5 * (width-162):!( mobileDevice === "iPhone10,3" || mobileDevice === "iPhone10,6" || mobileDevice === "iPhone11,2")? 0.5 * (width-162):0.5 * (width-153),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          RLX สล็อต​
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "60%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity> 
                    <TouchableOpacity
                      onPress={() => this.navigateToSceneGame("SlotGameList", "YDS", "YD สล็อต")}
                    >
                      <ImageBackground 
                        resizeMode='stretch' 
                        source={require('../images/home/TH-update-MGSgame.jpg')}
                        style={{
                          marginVertical: 5,
                          //width: width - 290,
                          width:(width - 30) / 3,
                          //width:Platform.OS === "android" ? 0.5 * (width-162):!( mobileDevice === "iPhone10,3" || mobileDevice === "iPhone10,6" || mobileDevice === "iPhone11,2")? 0.5 * (width-162):0.5 * (width-153),
                          height: 0.348 * (width - 20),
                          alignSelf: "center",
                        }}
                      >
                        <Text 
                          style={styles.gameTitleStyle4}
                        >
                          YD สล็อต
                        </Text>
                        <View
                          style={{
                            backgroundColor: "#FFFFFF80",
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            marginTop: "60%",
                            left: "5%",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              textAlign: "center",
                              lineHeight: 24,
                              fontSize: 12,
                            }}
                          >
                            {" "}
                            >
                          </Text>
                        </View>
                      </ImageBackground>
                    </TouchableOpacity>                   
                  </View>}
                </View>
              }

              {/* 釣魚 */}
              {      
                <View style={{width:width-20,paddingTop:10}}>
                  <TouchableOpacity
                    onPress={() => this.navigateToSceneGame("FishGameList", "JIF", "JL ยิงปลา")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require("../images/home/TH-new-jili.jpg")}
                      style={styles.gameImgStyle2}
                    >
                      <Text style={styles.gameTitleStyle}>
                        JL ยิงปลา​
                      </Text>
                      <View style={styles.GoToGameBtn}>
                        <Text style={styles.GoToGameTextStyle}>
                          เดิมพันเลย >
                        </Text>
                      </View>
                    </ImageBackground>
                    {/* <Image
                      resizeMode="stretch"
                      source={require("../images/home/new-icon-Label.png")}
                      style={{
                        width: 40,
                        height: 27,
                        position: "absolute",
                        top: "15%",
                        left: 105,
                      }}
                    ></Image> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.navigateToSceneGame("FishGameList", "SPG", "SG ยิงปลา​")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require("../images/home/TH-new-sg.jpg")}
                      style={styles.gameImgStyle2}
                    >
                      <Text style={styles.gameTitleStyle}>
                        SG ยิงปลา​
                      </Text>
                      <View style={styles.GoToGameBtn}>
                        <Text style={styles.GoToGameTextStyle}>
                          เดิมพันเลย >
                        </Text>
                      </View>                  
                    </ImageBackground>
                  </TouchableOpacity>
                </View>              
              }

              {/* 棋牌 */}
              {
                <View style={{width:width-20,paddingTop:10}}>
                  <TouchableOpacity
                    onPress={() => this.navigateToSceneGame("P2PGameList", "TGP","เกม 3 มิติ")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require('../images/home/TH-new-3DCasino.png')}
                      style={{
                        marginVertical: 5,
                        width: width - 20,
                        height: 0.348 * (width - 20),
                        alignSelf: "center",
                      }}
                    >
                      <Text 
                        style={styles.gameTitleStyle}
                      >
                        คิงเมคเกอร์
                      </Text>
                      <View style={styles.GoToGameBtn}>
                          <Text style={styles.GoToGameTextStyle}>
                            เดิมพันเลย >
                          </Text>
                        </View>
                    </ImageBackground>
                  </TouchableOpacity>   
                  <TouchableOpacity
                    onPress={() => this.navigateToSceneGame("P2PGameList", "KPK","คิงโป๊กเกอร์")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require('../images/home/TH-new-KPKCasino.jpg')}
                      style={{
                        marginVertical: 5,
                        width: width - 20,
                        height: 0.348 * (width - 20),
                        alignSelf: "center",
                      }}
                    >
                      <Text 
                        style={styles.gameTitleStyle}
                      >
                        คิงโป๊กเกอร์
                      </Text>
                      <View style={styles.GoToGameBtn}>
                          <Text style={styles.GoToGameTextStyle}>
                            เดิมพันเลย >
                          </Text>
                        </View>
                    </ImageBackground>
                    {/* <Image
                      resizeMode="stretch"
                      source={require("../images/home/new-icon-Label.png")}
                      style={{
                        width: 40,
                        height: 27,
                        position: "absolute",
                        top: "15%",
                        left: 120,
                      }}
                    ></Image> */}
                  </TouchableOpacity>        
                </View>
              }
              {/* {
                <View style={{width:width-20,paddingTop:10}}>
                  <TouchableOpacity
                    onPress={() => this.navigateToSceneGame("GameList", "P2P","เกม 3 มิติ")}
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require('../images/home/TH-new-3DCasino.png')}
                      style={{
                        marginVertical: 5,
                        width: width - 20,
                        height: 0.348 * (width - 20),
                        alignSelf: "center",
                      }}
                    >
                      <Text 
                        style={styles.gameTitleStyle}
                      >
                        เกม 3 มิติ
                      </Text>
                      <View style={styles.GoToGameBtn}>
                          <Text style={styles.GoToGameTextStyle}>
                            เดิมพันเลย >
                          </Text>
                        </View>
                    </ImageBackground>
                  </TouchableOpacity>          
                </View>
              } */}


              {/* 彩票 */} 
              {
                <View style={{width:width-20,paddingTop:10}}>
                  <TouchableOpacity
                    onPress={() => this.navigateToSceneGame("GameList", "GPK", "หวย") }
                  >
                    <ImageBackground 
                      resizeMode='stretch' 
                      source={require('../images/home/TH-new-P2Pline.jpg')}
                      style={{
                        marginVertical: 5,
                        width: width - 20,
                        height: 0.348 * (width - 20),
                        alignSelf: "center",
                      }}
                    >
                      <Text 
                        style={styles.gameTitleStyle}
                      >
                        หวย LOTTO
                      </Text>
                      <View style={styles.GoToGameBtn}>
                        <Text style={styles.GoToGameTextStyle}>
                          เดิมพันเลย >
                        </Text>
                      </View>                    
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
              }

                         
            </ScrollView>            
          </View>
        

          {/* <View style={styles.updataBg} /> */}
          {/* 优惠信息弹窗 */}

        </ScrollView>
      </View>
      
    );
  }
}

 

const styles = StyleSheet.create({
  formalModal: {
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    alignItems: 'center',
    justifyContent: 'center'
},
warringContainer: {
    width: width * .8,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#00B324',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowColor: '#00B32480',
    elevation: 4,
    position: 'relative',
    paddingTop: 25,
    paddingBottom: 25,
    alignItems: 'center'
},
warringModalBtn: {
    borderWidth: 1,
    borderColor: '#00B324',
    borderRadius: 4,
    width: width * .8 * .7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25
},
  modalOverly: {
		width,
		height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .6)",
	},
	modalContainer: {
		width: width * 0.8,
    borderWidth: 1,
    borderColor: "#00B324",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowColor: "#00B324",
    elevation: 4,
		backgroundColor: "#000000",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 30,
		paddingHorizontal: 20,
	},
	successCircle: {
    backgroundColor: "#0BACFF",
    width: 60,
    height: 60,
    borderRadius: 10000,
    justifyContent: "center",
    alignItems: "center",
	},
	contactDetailsModalXText: {
    color: "#fff",
    fontSize: 20,
  },
	contactDetailsModalX: {
    position: "absolute",
    right: 15,
    top: 15,
  },
	successCircleText: {
    fontWeight: "bold",
    color: "#222222",
    fontSize: 46,
	},
	vipModalText1: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 25,
    marginBottom: 20,
	},
	vipModalText2: {
    color: "#CCCCCC",
    textAlign: "center",
	},
	vipModalText3: {
    color: "#00E62E",
    //fontWeight: "bold",
    fontSize: 16,
  },
  recommendStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
	recommendStatusBoxImg: {
		marginRight: 5,
		width: 28,
		height: 28,
	},
	recommendBoxArrow: {
		alignItems: "center",
		marginVertical: 8,
	},
	recommendArrow: {
		width: 32,
		height: 16,
	},
	recommendStatusBoxText: {
		color: "#F5F5F5",
		fontSize: 13,
	},
	recommendStatusBoxText1: {
		color: "#fff",
		fontWeight: "bold",
	},
	recommendClose: {
		width: 30,
		height: 30 * 2.625,
	},
  updataBg: {
    width: width,
    height: height,
    opacity: 0.8,
    backgroundColor: "#000",
    position: "absolute",
  },
  jbodownload: {
    width: width - 42,
    height: height / 5,
  },
  popBoxUpdata: {
    width: width - 40,
    position: "absolute",
    top: height / 9,
    left: 20, 
  },
  Headeleft: {
    width: 15,
    height: 15,
    position: "absolute",
    left: 18,
    top: 8,
  },
  Headeleftright: {
    width: 16,
    height: 14,
    marginRight: 5,
  },
  lineIcon: {
    position: "absolute",
    right: -5,
    top: -1,
  },
  lineIconAferLogin: {
    position: "absolute",
    right: -10,
    bottom: 15,
  },
  Topimgbaner: {
    width: 17,
    height: 17,
    position: "absolute",
    left: 13,
    top: 7,
  },
  HeadBackground: {
    display:"flex",
    //justifyContent: 'center',
    alignItems: "center",
    flexDirection: "row",
    height: 60,
    paddingLeft: 10,
  },
  Gametxt: {
    color: "white",
    fontWeight: "600",
    fontSize:10,
  },
  Opentxt: {
    color: "#4ee42b",
    opacity: 1,
    fontSize: 10,
    top: -8,
    width: 65,
    height: 20,
    fontWeight: "bold",
  },
  Loginbtn: {
    borderColor: "#00B324",
  },
  Zhucebtn: {
	  borderColor: "#00CAFF",
  },
  Loginzhucebtn: {
    height: 35,
    backgroundColor: "#292929",
    borderWidth: 1,
    width: width / 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
  },
  Bepositbtn: {
	  borderColor: "#00e62c",
  },
  Withdrawalbtn: {
    borderColor: "#02c9ff",
  },
  BepositWithdrawal: {
    height: 35,
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
      borderRadius: 5,
    width: width/6,
    //marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  Publicoutbtm: {
    color: "white",
    paddingTop: 4,
    marginTop: -26,
    backgroundColor: "#00000059",
    height: 27,
    paddingLeft: 15,
  },
  Publicoutbtmtxt: {
    color: "white",
    height: 20,
    fontSize: 10,
    lineHeight: 20,
  },
  Publicicon: {
    position: "absolute",
    top: 8,
    right: 10,
    left: 10,
  },
  Publicout: {
    borderLeftWidth: 5,
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  Dianjing: {
    borderLeftColor: "#5084ff",
    backgroundColor: "#2a2a2a",
  },
  Zhenren: {
    borderLeftColor: "#ff3d5d",
    backgroundColor: "#2a2a2a",
  },
  Dianwan: {
    borderLeftColor: "#30ea3c",
    backgroundColor: "#2a2a2a",
  },
  Qipan: {
    borderLeftColor: "#A3239F",
    backgroundColor: "#2a2a2a",
  },
  CP:{
    borderLeftColor:'#870B0B',
    backgroundColor: "#2a2a2a",
  },
  Tiyu: {
    borderLeftColor: "#32e2ad",
    backgroundColor: "#2a2a2a",
  },
  Public: {
    color: "white",
    paddingLeft: 35,
    padding: 9,
  },
  GameBox: {
    flex: 1,
    justifyContent: "flex-start",
    // 设置侧轴对齐方式
    alignItems: "flex-start",
    textAlign: "center",
  },
  GameBox2: {
    borderRadius: 12,
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "row",
    height: height / 2.13,
  },

  homeText: {
    color: "#464646",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
  },
  homeTextHover: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 10,
  },

  gameStyleL: {
    width: 30,
    height: 40,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#464646",
  },

  gameHover2: {
    width: 30,
    height: 40,
    marginLeft: 5,
    borderWidth: 2,
    borderColor: "#46ea27",
  },
  gameHover3: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    paddingTop: 15,
  },

  gameBg0: {
    //體育
    width: width,
    height: 60,
    backgroundColor: "#1a1a1a",
  },
  gameBg1: {
    //體育
    paddingRight: 10
  },

  gameBgX1: {
    paddingRight: 10,
    marginTop: 0,
  },

  wrapper: {
    marginTop:10,
    height: 0.4385 * width,
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  containerVertical: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
  },
  text: {
    color: "#fff",
    fontSize: 36,
  },
  image: {
    width,
    height: 200,
  },
  warning: {
    height: 35,
    width: width,
    marginTop: 0,
    // marginLeft: 5,
    // marginRight: 10,
    // borderRadius: 8,
	  // backgroundColor: "#2a2a2a"
	  // borderBottomWidth:1,
	  // borderBottomColor: '#323232'
  },
  warningT: {
    height: 30,
    marginTop: 10,
    paddingLeft:10,
  },
  warningText: {
	  //textAlign:'center',
    color: "#fff",
    fontSize: 12,
  },
  casionT: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  casinoBg1: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 30,
  },
  casinoBg1casinoBg2: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },

  gameBg0_1: {
    //體育優惠
    flex: 1,
    height: 40,
    backgroundColor: "#338063",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },

  gameBg0_2: {
    //體育優惠 線
    flex: 0.1,
    height: 40,
    borderLeftWidth: 1,
    borderColor: "#f0f0f0",
  },
  gameBg0_3: {
    //體育優惠 線
    flex: 0.1,
    height: 40,
    borderLeftWidth: 1,
    borderColor: "#d1d1d1",
  },
  Gtext: {
    // 设置主轴对齐方式
    justifyContent: "center",
    // 设置侧轴对齐方式
    alignItems: "center",
    flex: 0.5,
    height: 50,
    padding: 10,
  },
  gameBgSlotTitle: {
    flex: 1,
    backgroundColor: "#202020",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 12,
    paddingBottom: 10,
  },
  gameBgSlot: {
    flex: 1,
    backgroundColor: "#202020",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
  },
  gameBgSlotBottom: {
    flex: 1,
    backgroundColor: "#202020",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
  gameBgSlot_1: {
    flex: 1,
    height: 40,
    backgroundColor: "#202020",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#f0f0f0",
  },
  gameBg2: {
    backgroundColor: "#fff",
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderColor: "#d1d1d1",
  },

  gameStyleX: {
    paddingLeft: 4,
    paddingBottom: 10,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: "#000",

    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
  },

  gameStyleXs: {
    flex: 1,
    paddingTop: 7,
    paddingBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: "#2b2b2b",
    borderColor: "#00925b"
  },

  gameStyleXB: {
    paddingTop: 20,
    backgroundColor: "#2b2b2b",
    width: width / 3.2,
    height: height / 7.2,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 3,
    marginRight: 3,
    borderColor: "#6d6d6d",
  },

  gameStyleXSS: {
    paddingLeft: 5,
    padding: 10,
  },

  //  gameStyleL:{
  // 	flex:0.8,
  // 	height:80,
  // 	borderRadius:8,
  // 	borderWidth: 1,
  // 	padding:10,
  //   // 设置主轴对齐方式
  // justifyContent:'center',
  // // 设置侧轴对齐方式
  // alignItems:'center',
  // 	borderColor: '#f4f4f4'
  // },

  gameStyleR: {
    flex: 0.8,
    height: 200,
    marginLeft: 9,
    borderRadius: 8,
    // 设置主轴对齐方式
    justifyContent: "center",
    // 设置侧轴对齐方式
    alignItems: "center",
    padding: 10,
  },

  closeButton: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    width: 25,
    height: 25,
    // borderWidth: 1,
    borderRadius: 13,
    // borderColor: "#fff",
    textAlign: "center",
    paddingTop: 2,
    right: 5,
  },

  container: {
    backgroundColor: "#fff",
  },
  hurdle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  hurdle_title: {
    color: "#333",
    fontSize: 18,
    marginLeft: 15,
  },
  hurdle_edit: {
    height: 24,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ff6548",
    marginRight: 15,
    borderRadius: 12,
  },
  hurdle_edit_text: {
    color: "#ff6548",
    fontSize: 16,
  },
  selected_container: {
    position: "absolute",
    width: childrenWidth,
    height: childrenHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  selected_item: {
    width: width / 3.2,
    height: height / 7.2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  selected_item_text: {
    fontSize: 16,
    color: "#444",
  },
  selected_item_icon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
    position: "absolute",
    top: (childrenHeight - itemHeight - 110) / 2 + 16 * 0.25, //下移点
    left: (childrenWidth + itemWidth - 60) / 2 - 16 * 0.25, //右移点，也可以换个布局
  },
  unselected_item: {
    width: 72,
    height: 36,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  unselected_item_icon: {
    width: 14,
    height: 14,
    resizeMode: "contain",
    marginLeft: 6,
  },
  gamesConter: {
	  display: "flex",
	  alignItems: "flex-start",
	  flexDirection: "row",
    height: 0.51 * (width - 50),
    // marginVertical:10
  },
  gamesTitle: {
	  paddingLeft: 10,
    paddingRight: 10,
  },
  gamesTitleImg:{
    width:width - 50,
    height:0.117 * (width - 50),
  },
  ganmesImg: {
	  position: "absolute",
    top: 35,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
  IconAvatar: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  IconRefresh: {
    width: 14,
    height: 14,
  },
  IconGameTab: {
    width: 24,
    height: 24,
    alignSelf: "center",
  },
  IGameTab: {
    position: "absolute",
    width: 42,
    height: 40,
    top: -4,
    left: "20%",
    justifyContent: "center",
    elevation:9,
    zIndex:99999,
  },
  GoToGameBtn: {
    backgroundColor: "#FFFFFF90",//"#FFFFFF90",
    width: 80,
    height: 24,
    borderRadius: 4,
    marginTop: "15%",
    left: "5%",
  },
  GoToGameBtn2: {
    backgroundColor: "#FFFFFF80",
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: "40%",
    left: "5%",
  },
  GoToGameTextStyle: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
    fontSize: 12,
  },
  gameTitleStyle: {
    color: "#FFFFFF",
    //fontWeight: "bold",
    fontSize: 20,
    top: "15%",
    left: "5%",
  },
  gameTitleStyle2: {
    color: "#FFFFFF",
    textAlign:'left',
    //fontWeight: "bold",
    fontSize: 15,
    top: "12%",
    left: "5%",
  },
  gameTitleStyle3: {
    color: "#FFFFFF",
    textAlign:'center',
    //fontWeight: "bold",
    fontSize: 15,
    top: "6%",
    left: "2%",
  },
  gameTitleStyle4: {
    color: "#FFFFFF",
    textAlign:'left',
    //fontWeight: "bold",
    fontSize: 18,
    top: "10%",
    left: "5%",
  },
  gameTitleStyle5: {
    color: "#FFFFFF",
    textAlign:'left',
    //fontWeight: "bold",
    fontSize: 20,
    top: "12%",
    left: "7%",
  },
  gameImgStyle: {
    marginVertical: 5,
    width: (width - 30) / 2,
    height: (0.722 * (width - 30)) / 2,
    alignSelf: "center",
  },
  gameImgStyle2: {
    marginVertical: 5,
    width: width - 20,
    height: 0.348 * (width - 20),
    alignSelf: "center",
  },
});
// class FadeInView extends React.Component{
//   constructor(props) {
//     super(props);
//     this.state= {
//       fadeAnim: new Animated.Value(0),//动画透明度
//     }
//   }
//   componentDidMount() {
//     Animated.timing(      
//           this.state.fadeAnim,          
//           {
//             toValue: 1,                  
//         duration: 800,
//         delay: this.props.delayTime,           
//           }
//       ).start();
//   }

//   render () {
//     let {fadeAnim} = this.state;
//     const verticalY = this.state.fadeAnim.interpolate({
//       inputRange: [0,1],
//       outputRange: [15,-11]
//     });
//     return(
//       <Animated.View
//       style={{
//         ...this.props.style,
//         opacity: fadeAnim,
//         transform:[{translateY: verticalY}]
//       }}
//       >
//         {this.props.children}
//       </Animated.View>
//     ) 
//   }
// }
