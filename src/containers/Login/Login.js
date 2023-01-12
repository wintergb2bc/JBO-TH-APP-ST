import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    NativeModules,
    ScrollView,
    Linking, Modal
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { WhiteSpace, WingBlank, Toast, Flex, DatePicker } from 'antd-mobile-rn';
import CheckBox from 'react-native-check-box'
import Video from 'react-native-video';
import { login } from '../../actions/AuthAction';
import { I18n } from '../../language/i18n';
import Orientation from 'react-native-orientation-locker';
import AnalyticsUtil from "../../actions/AnalyticsUtil"; //友盟
import Touch from 'react-native-touch-once';
import PushUtil from "../../actions/PushUtil"; //友盟 push 推送
import DeviceInfo from 'react-native-device-info'  //獲取設備信息
import IovationX from './../../actions/IovationNativeModule';   //android 拿黑盒子 
import { KeyboardAccessoryNavigation } from 'react-native-keyboard-accessory'
import { namereg,passwordReg, nameregLogin, passwordRegLogin} from "../../actions/Reg";
const AffCodeAndroid = NativeModules.opeinstall; //android 獲取code 參數 
const AffCodeIos = NativeModules.CoomaanTools;  //ios 獲取code 參數  
import {
    ACTION_MaintainStatus_NoTokenBTI, ACTION_MaintainStatus_NoTokenIM, ACTION_MaintainStatus_NoTokenOW,
    ACTION_MaintainStatus_SetBTI, ACTION_MaintainStatus_SetIM, ACTION_MaintainStatus_SetOW
} from '../lib/redux/actions/MaintainStatusAction';
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from '../lib/redux/actions/UserInfoAction';
import { ACTION_UserSetting_Update } from '../lib/redux/actions/UserSettingAction'

import SMLoading from "../SlotMachine/SMLoading";
import RegisterPromo from "../RegisterPromo";
const {
    width, height
} = Dimensions.get('window')
let Ndate = new Date();
// Ndate.setDate(Ndate.getDate());
let Ny = Ndate.getFullYear();
let Nm = Ndate.getMonth() + 1;
Nm = Nm < 10 ? "0" + Nm : Nm;
let Nd = Ndate.getDate();
Nd = Nd < 10 ? "0" + Nd : Nd;
var Nh = Ndate.getHours();
Nh = Nh < 10 ? "0" + Nh : Nh;
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            checkBox1: false,
            version: JBOVersion,
            affCode: '',//代理號 
            passwords: '',
            Devicetoken: '', //用戶唯一識別
            userMAC: '', //mac
            percent: 0,
            SeePassword: false,
            TextColor: 'white',
            PWDFocused: '',
            isFocused: '',
            Errorname: '',
            Errorpwd: '',
            None:false,
            Loginerror: '',
            keyboardType:'default',

            skynetUpdate: false, //skynet
            skynetPwd: "", // skynet 密码
            skynetPwd2: "", // skynet 确认密码
            skynetYear: "", //年
            skynetMonth: "", //月
            skynetDate: "", //日
            skynetBirthday: "",
            skynetErrMsg: "",
            skynetLoading: false
        };
        this.handleUsername = this.handleUsername.bind(this);   //帳號
        this.handlePassword = this.handlePassword.bind(this);  //密碼

        this.login = this.login.bind(this);  //登錄
        this.foget = this.foget.bind(this);  //忘記用戶名
        this.resgist = this.resgist.bind(this)//註冊

    }

    componentDidMount() {

        lookBox = false; // 先去瞧瞧
 
        Orientation.lockToPortrait();
        Orientation.addOrientationListener(this._onOrientationChange);

    }



    componentWillMount() {

 
        if (Platform.OS === "android") { 
            window.DeviceInfoIos = false         
            DeviceInfo.getMACAddress().then(mac => {  //拿mac地址
                this.setState({
                    userMAC: mac
                })
            }).catch(err=>{
                console.log(err); 
            });

        }else{
            try {
                //ios手机型号是有指纹的
                let iphoneXMax = ['iPhone 5', 'iPhone 5s','iPhone 6', 'iPhone 6s','iPhone 6s Plus','iPhone 7', 'iPhone 7 Plus','iPhone 8', 'iPhone 8 Plus','iPhone SE'];
                const getModel = DeviceInfo.getModel();                
                if(iphoneXMax.indexOf(getModel) > -1) {
                    window.DeviceInfoIos = false
                }
            } catch (error) {
                console.log(error);
            } 
        }

        PushUtil.getDeviceToken()
        .then(token => {
          ///獲取用戶唯一參數 devicetoken
          this.setState({
            Devicetoken: token
          },()=>{
            //第一次開啟app 註冊友盟個推
            // this.NotificationOne();
          });

        })
        .catch(err => {
          //第一次開啟app 註冊友盟個推 
        //   this.NotificationOne(); 
        });
 
        //記住密碼尋找 
        global.storage.load({
            key: 'username',
            id: 'nameJBO'
        }).then(ret => {
            //console.log(ret)
            this.setState({
                username: ret
            },() => {
				//拿到用户名去查看快捷登录方式
				if(!noFastLogin) {
					this.fastLogins('fastLogin')
				}
			})
        }).catch(err => {
            //console.log('沒有記住密碼緩存')
            // 如果没有找到数据且没有sync方法，
            // 或者有其他异常，则在catch中返回
            console.warn(err.message);

        })
        global.storage.load({
            key: 'password',
            id: 'passwordJBO'
        }).then(ret => {
            this.setState({
                password: ret,
                passwords: '●●●●●●●'
            })

        }).catch(() => {
            //console.log('沒有1緩存')
            // 如果没有找到数据且没有sync方法，
            // 或者有其他异常，则在catch中返回
            //console.warn(err.message);
        })
    }

    stripscript(s) {   //過濾openinstall affcode
        var pattern = new RegExp("[`affCode~!@#$^&*()=|{}':;', \n\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }



 

    componentWillUnmount() {  //離開註銷監聽 
        Orientation.removeOrientationListener(this._onOrientationChange);
        this.setState({
            skynetUpdate: false
        });
    }
    _onOrientationChange() {

        //console.log('變換了')
        Orientation.lockToPortrait();
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



    handleUsername(username) {
        if (nameregLogin.test(username) == false) {
            this.setState({
                isFocused: 'error',
                Errorname: 'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 5-16 ตัว',
            })
            //Toast.fail('用户名必须拥有 6-14个数字或字母构成')
        } else {

            this.setState({
                isFocused: 'Focus'
            })
        }
        this.setState({ username });

    }

    handlePassword(password) {
        if (passwordRegLogin.test(password) == false) {
            this.setState({
                PWDFocused: 'error',
                Errorpwd: 'รูปแบบรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง',
            })
            //Toast.fail('密码格式错误，请您重新输入。（密码必须由至少6位、最多20位长度的字母和数字组成，中间不可含有符号、空格或下划线。）')
        } else {
            this.setState({
                PWDFocused: 'Focus'
            })
        }
        this.setState({ password, passwords: password });
    }

    /**
     * 登录
     * @param {string} key key为"commonlogin"表示一般登录,否则为快速登录中的其中一种登录方式
     */
    login(key) {

        this.setState({
            Loginerror: ''
        })

        // if (name == '') {
        //     name = this.state.username
        //     password = this.state.password
        // }
        const {username,password} = this.state

        if (username == '') {
            this.setState({
                isFocused: 'error',
                Errorname:'กรุณากรอกยูสเซอร์เนม',
                //Errorname: '请输入您的用户名。',
            })
            return;
        }
        if (password == '') {
            this.setState({
                PWDFocused: 'error',
                Errorpwd:'กรุณากรอกรหัสผ่าน',
                //Errorpwd: '请输入您的密码。',
            })
            return;
        }

        if (username.split('').length < 4) {
            this.setState({
                isFocused: 'error',
                Errorname:'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 5-16 ตัว',
                //Errorname: '用户名最少5个字符，并区分大小写',
            })
            return;
        }

        if (nameregLogin.test(username) == false) {
            this.setState({
                isFocused: 'error',
                Errorname:'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 5-16 ตัว',
                //Errorname: '用户名格式错误请勿使用特殊字符',
            })
            return;
        }

        if (!username || !password) {
            this.setState({
                isFocused: 'error',
                PWDFocused: 'error',
                Errorname:'กรุณากรอกยูสเซอร์เนม',
                //Errorname: '用户名不能为空',
                Errorpwd:'กรุณากรอกรหัสผ่าน',
               // Errorpwd: '密码不能为空',
            })
            return;
        }

        
        UMonEvent('Login','Submit','Login_LoginPage');

        let date = {
            "hostName": common_url,
            "grantType": "password",
            "clientId": "JBO.gb2bc",
            "clientSecret": "JBOmuitten",
            "username": username,
            "password": password,
            "scope": "Mobile.Service offline_access",
            "appId": "net.gb2bc.jbo",
            "siteId":Platform.OS === "android" ? 3 : 4,
            "e2": E2Backbox || '',
        }


        key=="commonlogin" && Toast.loading('โปรดรอสักครู่...', 200); 
        fetchRequest(ApiPort.login, 'POST', date)
            .then(data => {   
                console.log('login data================================================',data)
                Toast.hide(); 
                if (data.accessToken) {

                    this.NotificationLogin(data.memberInfo.memberCode);  //註冊友盟個推
                    userNameDB = data.memberInfo.userName;
                    if ((key=="commonlogin" && this.state.checkBox1 == true)||key !="commonlogin") {



                        global.storage.save({
                            key: 'password', // 注意:请不要在key中使用_下划线符号!
                            id: 'passwordJBO', // 注意:请不要在id中使用_下划线符号!
                            data: this.state.password,
                            expires: null
                        });

                    }

                    //  console.log('aaaaaa')
                    ApiPort.Token = data.accessToken.token_type + ' ' + data.accessToken.access_token // 寫入用戶token  token要帶Bearer
                    ApiPort.ReToken = data.accessToken.refresh_token // 寫入用戶token  token要帶Bearer
							 
                    ApiPort.LogoutTokey = data.accessToken.refresh_token;

                    ApiPort.access_token = data.accessToken.access_token;

                    isGameLock = data.memberInfo.isGameLock;  //用戶能不能玩遊戲
                    // console.log(ApiPort.Token)
                    memberCode = data.memberInfo.memberCode;   //寫入用戶 memberCode
                    userName = data.memberInfo.userName;
                    noFastLogin = false//用户可以使用快捷登录
                    global.storage.save({
                        key: 'memberInfo', // 注意:请不要在key中使用_下划线符号!
                        id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
                        data: data,
                        expires: null
                    });


                    ApiPort.UserLogin = true;
                    this.props.userInfo_login(data.memberInfo.userName); //redux 紀錄登入態
                    this.props.userInfo_getBalanceSB(true); //redux 獲取SB餘額
                    localStorage.setItem('memberInfo', JSON.stringify(data.memberInfo));
                    localStorage.setItem('memberCode', JSON.stringify(memberCode));
                    global.localStorage.setItem('loginStatus','1')

                    if(data.isSkynetFirstLogin === true){
                        global.localStorage.setItem('isSkynetFirstLogin', true);
                        this.setState({
                            skynetUpdate: true
                        });
                        return
                    }
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
                      //ReloadgetLiveChatX();//客服重新加載
                    global.storage.save({
                        key: 'username', // 注意:请不要在key中使用_下划线符号!
                        id: 'nameJBO', // 注意:请不要在id中使用_下划线符号!
                        data: this.state.username,
                        expires: null
                    });

                    if(data.memberInfo.revalidateStatus){
                        console.log('userNameDB',userNameDB)
                        Actions.LoginRevalidateVerify({
                            username:userNameDB
                        })
                        return;
                    }else{
                        if(data.isOtpRequired){
                            console.log('go LoginOptVerify',userNameDB,password)
                            Actions.LoginOptVerify({
                                username:userNameDB,
                                password:password
                            })
                            return;
                        }
                    }
                    
                    //快速登录密码
                    let passwordKey = "passwordKey" + username.toLowerCase();
                    let passwordID = "passwordID" + username.toLowerCase();
                    global.storage.save({
                        key: passwordKey, // 注意:请不要在key中使用_下划线符号!
                        id: passwordID, // 注意:请不要在id中使用_下划线符号!
                        data: this.state.password,
                        expires: null
                    });
                    if (key == "commonlogin") {
                        // 一般登录
                        let username = 'loginok'
                        let password = 'loginok'
                        this.props.login({ username, password });

                        if(this.props && this.props.fromPage && this.props.fromPage === 'Double11Lottery') {
                            const { EventDetail,EventBannerImg,EventBGColor,
                                EventCanNotOpenImg,
                                EventCanOpenImg,
                                EventOpenedImg}=this.props
                            setTimeout(() => {
                                Actions.Double11Lottery({
                                    eventTitle: EventDetail?.eventTitle,
                                    templateName: EventDetail?.templateName,
                                    EventDetail,
                                    // title: EventDetail.displayTitle,
                                    EventBannerImg,
                                    EventBGColor,
                                    EventCanNotOpenImg,
                                    EventCanOpenImg,
                                    EventOpenedImg 
                                })
                            }, 400);
                        }
                        if(this.props && this.props.fromPage && this.props.fromPage === 'TI10') {
                            setTimeout(() => {
                                Actions.TI10Event()
                            }, 400);
                        }
                    }else{

                        if (key == "LoginFace") {
                            //脸部验证
                            window.faceCheck && window.faceCheck();
                        } else if (key == "LoginTouch") {
                            //指纹识别
                            window.touchCheck && window.touchCheck();
                        } else if (key == "LoginPattern") {
                            //九宫格
                            window.patternCheck && window.patternCheck();
                        } 
                    }

                } else {
                    Toast.hide();
                    let errors = JSON.parse(data.content)
                    if (errors.error_details) {
                        Toast.info(errors.error_details.Message, 2);
                    } else { 
                        Toast.info('คำขอล้มเหลวโปรดลองอีกครั้ง', 2);
                        // Toast.info('登录失败,请稍候重试', 2);
                    }
                }
            }).catch(() => {
                Toast.hide();
                Toast.info('คำขอล้มเหลวโปรดลองอีกครั้ง', 2);
                // Toast.info('登录失败,请稍候重试', 2);
            })
    }



    UpdataApp() {   //更新版本

        Linking.openURL('https://www.JBO57.com/cn/mobile/Appinstall.html')
    }

    //先去瞧瞧
    look() {
        let user = 'look'
        let password = 'look'
        Toast.loading('โปรดรอสักครู่...', 200);
        lookBox = true;
        setTimeout(() => {
            ApiPort.UserLogin = false
            //Actions.tabbar()
            this.props.login({ user, password });
        }, 200);

    }

    //忘記密碼 名字
    foget(key) {
        //forgetPW_login
        UMonEvent('Navigation','Click','ForgotPW_LoginPage');
        Actions[key]({});
    }

    showAlert(title, message) {
        Alert.alert(title, message, [
            {
                text: 'OK'
            }
        ]);
    }

    eyes() {  //顯示密碼 
        this.setState({
            SeePassword: this.state.SeePassword == false ? true : false
        })
    }

    UsernameFocus = () => {
        if (this.state.isFocused != 'error') {
            this.setState({
                keyboardType: 'default',
                isFocused: 'Focus',
                None:height < 600 ?true:false,
            })
        }
    }

    UsernameBlur = () => {
        if (this.state.isFocused != 'error') {
            this.setState({
                isFocused: 'ok',
                None:false,
            })
        }
    }

    PWDFocus = () => {
        if (this.state.PWDFocused != 'error') {
            this.setState({
                PWDFocused: 'Focus',
                None:height < 600 ?true:false,
            })
        }
    }

    PWDBlur = () => {
        if (this.state.PWDFocused != 'error') {
            this.setState({
                PWDFocused: 'ok',
                None:false,
            })
        }
    }
    UsernameFocusEditing = () => {
         
    }

    fastLogins(key,type) {

        const loginUsername = this.state.username.toLocaleLowerCase()

        if (loginUsername == '') {
            Toast.info('กรุณากรอกยูสเซอร์เนม')
           // Toast.info("请输入用户名");
            return;
          }
        if (nameregLogin.test(loginUsername) == false) {
            Toast.info("ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 5-16 ตัว")
           // Toast.info("用户名格式错误");
            return;
          }

          if(type == 0){
              UMonEvent('Navigation','Click','FaceID_LoginPage');
          }

          if(type == 1){
              UMonEvent('Navigation','Click','Fingerprint_LoginPage');
          }

          if(type == 2){
              UMonEvent('Navigation','Click','Pattern_LoginPage');
          }

        let storageKey = 'fastLogin' + loginUsername;
        let storageId = 'fastLogin' + loginUsername;
        storage.load({
            key: storageKey,
            id: storageId
        })
        .then(data => {
            if(key === 'fastLogin') {
                Actions.LoginPage({username: loginUsername, stateType: data})
            } else if(data == key) {
                //快捷登录
                Actions.LoginPage({username: loginUsername, stateType: key})
            } else {
                Toast.info("คุณยังไม่ได้ตั้งค่าล็อคอินแบบด่วน โปรดใช้วิธีการอื่น",2);
               // Toast.info( "您未设置该项快速登录方式，请使用其他方式登录",2);
            }
        })
        .catch(err => {
            //首次验证
            Actions[key]({username: loginUsername})
            // Actions.LoginPage({username: this.state.loginUsername, stateType: key})
        })
      }

      resgist(){
        UMonEvent("Register_login")
        Actions.Registered()
      }

    // Skynet密码
    onSkynetPwdChange(key, value) {
        this.setState({
            [key]: value
        });
    }

    // Skynet时间选择
    onDateChange = value => {
        const Wdate = new Date(value);

        let skynetYear = Wdate.getFullYear() + '';
        let skynetMonth = Wdate.getMonth() + 1;
        let skynetDate = Wdate.getDate();
        skynetMonth = skynetMonth < 10 ? "0" + skynetMonth : skynetMonth;
        skynetDate = skynetDate < 10 ? "0" + skynetDate : skynetDate;
        skynetMonth = skynetMonth + '';
        skynetDate = skynetDate + '';
        this.setState({
            skynetYear,
            skynetMonth,
            skynetDate,
            skynetBirthday: skynetYear + "-" + skynetMonth + "-" + skynetDate
        });
    };
    // Skynet重置密码
    resetPwd() {
        console.log(999)

        const { username, skynetPwd, skynetPwd2, skynetBirthday } = this.state;
        if (
            skynetPwd.replace(/\s+/g, "") == false ||
            skynetPwd2.replace(/\s+/g, "") == false
        ) {
            // 密码不能为空
            this.setState({ skynetErrMsg: "รหัสผ่านไม่สามารถเว้นว่างได้" });
            setTimeout(() => {
                this.setState({ skynetErrMsg: "" });
            }, 3000);

            return;
        }
        console.log(333)
        if (skynetPwd != skynetPwd2) {
            // 密码不一致
            this.setState({ skynetErrMsg: "รหัสผ่านไม่ตรงกัน" });
            setTimeout(() => {
                this.setState({ skynetErrMsg: "" });
            }, 3000);

            return;
        }
        console.log(4444)
        if (!passwordRegLogin.test(skynetPwd)) {
            // 密码格式不正确
            this.setState({
                skynetErrMsg:
                    "รหัสผ่านจะต้องประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลขอย่างน้อย 6 ถึง 20 ตัวอักษรเท่านั้น (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)"
            });
            setTimeout(() => {
                this.setState({ skynetErrMsg: "" });
            }, 3000);
            return;
        }

        if (!skynetBirthday) {
            // 出生日期必填
            this.setState({ skynetErrMsg: "กรุณาเลือกวันเดือนปีเกิดของคุณ" });
            setTimeout(() => {
                this.setState({ skynetErrMsg: "" });
            }, 3000);
            return;
        }
        console.log('token', ApiPort.Token)
        const data = {
            newPassword: skynetPwd,
            dob: skynetBirthday,
            blackBoxValue: Iovation,
            e2BlackBoxValue: E2Backbox,
        };
        console.log(555, data)
        this.setState({skynetLoading: true})
        fetchRequest(ApiPort.SkynetUpdate, 'PUT', data)
            .then(res => {
                this.setState({skynetLoading: false})
                console.log(555, res)
                if (res.isSuccess) {
                    // 关闭弹窗
                    this.setState({
                        skynetUpdate: false,
                        skynetUpdateSuccess: true
                    });
                    // 跳转到首页
                    Globlogin(username, skynetPwd, "commonlogin", true);
                    //this.props.login({ username, password: skynetPwd, true});
                } else {
                    this.setState({ skynetErrMsg: "เปลี่ยนล้มเหลว" });
                    setTimeout(() => {
                        this.setState({ skynetErrMsg: "" });
                    }, 3000);
                }
            })
            .catch(err => {
                this.setState({ skynetErrMsg: "เปลี่ยนล้มเหลว", skynetLoading: false });
                setTimeout(() => {
                    this.setState({ skynetErrMsg: "" });
                }, 3000);
            });
    }
    
    render() {
        const { version, username, password, None, SeePassword, isFocused, PWDFocused, Errorname, Errorpwd} = this.state;

        window.Logonregist = () => {
            this.setState({
                username: userLogin,
                userPassword: userPassword,
            })
        }

        //快速登录验证
        window.fastLogin = (unsename,password,key) => {
            this.setState({
                unsename,
                password,
            },() => {
                this.login(key)
            })
        }
    
        window.GoHome = () => {   //驗證手機號 成功或 跳過
            ApiPort.UserLogin = true
            let username = 'loginok'
            let password = 'loginok'
            this.props.login({ username, password });
        }
        const CustomChildren = ({extra, onClick, children}) => (
            <TouchableOpacity
                onPress={() => {
                    onClick();
                }}
                style={styles.skynetDatePickerContainer}
            >
                <View style={{width: width - 40, alignItems: 'center', marginBottom: 5}}>
                    <View style={styles.skynetInput}>
                        <Text style={{color: '#999999'}}>
                            {this.state.skynetDate ? this.state.skynetDate : 'วัน:'}
                        </Text>
                    </View>
                </View>
                <Flex style={styles.skynetDatePickerFlex}>
                    <Flex.Item style={styles.skynetDatePickerFlexItem}>
                            <Text style={{color: '#999999'}}>
                                {this.state.skynetMonth ? this.state.skynetMonth : 'เดือน:'}
                            </Text>
                    </Flex.Item>
                    <Flex.Item style={[styles.skynetDatePickerFlexItem, { marginLeft: 25 }]}>
                            <Text style={{color: '#999999'}}>
                                {this.state.skynetYear ? this.state.skynetYear : 'ปี:'}
                            </Text>

                    </Flex.Item>
                </Flex>
            </TouchableOpacity>
        );
        return (

            <View style={styles.container}>

                <Modal
                    animationType='fade'
                    visible={this.state.skynetUpdate}
                    // visible={true}
                    transparent={true}
                >
                    {this.state.skynetLoading?<SMLoading />:null}
                    <View style={styles.modalOverly}>
                        <ScrollView>
                            <View style={[styles.modalContainer2, {width: width * .9}]}>
                                <Image
                                    source={require('../../images/login/jbo-thai-logo.png')}
                                    resizeMode='stretch'
                                    style={{width: 107, height: 35}}
                                />
                                <Image
                                    source={require('../../images/login/skynetBG.png')}
                                    resizeMode='stretch'
                                    style={{width: (width * .9)-2, height: 290}}
                                />
                                <View style={{marginVertical: 14}}>
                                    <Text style={{
                                        color: '#16DB37',
                                        fontSize: 23,
                                        textAlign: 'center'
                                    }}>กรุณาอัปเดทรหัสผ่านและวันเกิด</Text>
                                    <Text style={{
                                        color: '#16DB37',
                                        fontSize: 23,
                                        textAlign: 'center'
                                    }}>ก่อนเข้าสู่ระบบ</Text>
                                </View>
                                <View>
                                    <TextInput
                                        style={styles.input2}
                                        textContentType="password"
                                        secureTextEntry={true}
                                        underlineColorAndroid="transparent"
                                        value={this.state.skynetPwd}
                                        placeholder='รหัสผ่านใหม่:'
                                        placeholderTextColor="#999999"
                                        type="text"
                                        returnKeyType='done'
                                        onChangeText={value => {
                                            this.onSkynetPwdChange("skynetPwd", value);
                                        }}
                                    />

                                    <TextInput
                                        style={styles.input2}
                                        textContentType="password"
                                        secureTextEntry={true}
                                        underlineColorAndroid="transparent"
                                        value={this.state.skynetPwd2}
                                        placeholder='ยืนยันรหัสผ่านใหม่:'
                                        placeholderTextColor="#999999"
                                        type="text"
                                        returnKeyType='done'
                                        onChangeText={value => {
                                            this.onSkynetPwdChange("skynetPwd2", value);
                                        }}
                                    />
                                </View>

                                <DatePicker
                                    title="เลือกวันที่" // TODO:CN-DONE 日期
                                    value={""}
                                    mode="date"
                                    minDate={new Date(1930, 1, 1)}
                                    maxDate={new Date(Ny - 18 + "-" + Nm + "-" + Nd)}
                                    onChange={this.onDateChange}
                                    format="YYYY-MM-DD"
                                    // extra="เลือกวันที่111" // TODO:CN-DONE 请选择
                                    locale={{
                                        DatePickerLocale: {
                                            day: "",
                                            month: "",
                                            year: "",
                                            hour: "",
                                            minute: ""
                                        },
                                        okText: "ตกลง",
                                        dismissText: "ยกเลิก"
                                    }}
                                >
                                    <CustomChildren/>
                                </DatePicker>
                                <WingBlank>
                                    <Text style={{color: "red", fontSize: 12}}>
                                        {this.state.skynetErrMsg}
                                    </Text>
                                </WingBlank>
                                <Touch style={styles.skynetBtn}
                                       onPress={() => {
                                           this.resetPwd();
                                       }}>
                                    <Text style={{color: '#FFFFFF', fontSize: 17}}>อัปเดท</Text>
                                </Touch>
                            </View>
                        </ScrollView>
                    </View>
                </Modal>

                 <Video
                    source={require('../../images/JBO.mp4')}
                    rate={1.0}
                    muted={false}
                    resizeMode={"cover"}
                    repeat
                    style={styles.video}
                    playWhenInactive={true}
                    onLoadStart={() => { }}
                />  

                <View style={[{height:Platform.OS === 'ios' ? 75 :45, zIndex: 200},styles.headerTop]}>
					<TouchableOpacity onPress={() => {Actions.pop()}} style={{width: 30}} >
						<Image resizeMode='stretch' source={require('../../images/icon-back.png')} style={{ width: 24, height: 24}} />
					</TouchableOpacity>
					<Text style={{color: '#fff', fontSize: 18}}>เข้าสู่ระบบ</Text>
					<TouchableOpacity onPress={() => {Actions.LiveChatST({Piwik: 'LiveChat_LoginPage'})}} style={{width: 30}} >
                    {LivechatDragType == false ?  
								<Image
								resizeMode="stretch"
								// source={require("../../images/home/icon-cs.gif")}
                                source={require("../../images/home/icon_cs_new.png")}
								style={{ width: 28, height: 28 }}
							/>
								:LivechatDragType == true &&
								<Image
								resizeMode="stretch"
								source={require("../../images/home/icon_cs_new.png")}
								style={{ width: 28, height: 28 }}
							/>
								
								}
					</TouchableOpacity>
				</View>

                <View style={styles.bg2}></View>
                <View style={{ flex: 0.1 }}></View>
    
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    keyboardVerticalOffset={0}
                >
                    
                
                    <View style={[styles.logo,{ top:None== true? -70:0}]}>
                        <Image resizeMode='stretch' source={require('../../images/login/jbologo.png')} style={{ width:135, height: 68 }} /> 
                    </View>

                    <View style={{ flex: 0.2 }}></View>


   
 

                    <WingBlank>
                      
                            <Flex style={{top:None== true? -70:0}}>
                            <Flex.Item style={{ paddingLeft: 4, paddingRight: 4 }}>
  
                 
                            <View style={{justifyContent: 'center',alignItems: 'center'}}>
			                    <Image resizeMode='stretch' source={require('../../images/login/icon-account.png')} style={{ width: 26, height: 26,position: 'absolute',left: 5,}} />
                                <TextInput
                                    style={[{
                                        borderColor: this.state.isFocused == 'error' ? 'red' : this.state.isFocused == 'ok' ? '#868686' : this.state.isFocused == 'Focus' ? 'green' : '#868686'
                                    }, styles.input]}
                                    underlineColorAndroid="transparent"
                                    value={this.state.username}
                                    placeholder='ยูสเซอร์เนม'//'用户名'
                                    placeholderTextColor="#868686"
                                    type="text" 
                                    returnKeyType='done' 
                                    onChangeText={this.handleUsername}
                                    onFocus={() => this.UsernameFocus()}
                                    onBlur={() => this.UsernameBlur()}
                                    onEndEditing={() => this.UsernameFocusEditing()}
                                />
                                </View>
                            
                                {
                                    this.state.isFocused == 'error' &&
                                    <Text style={[{ marginTop: -5 }, styles.ErrorText]}>{Errorname}</Text>
                                }
  
                            </Flex.Item>
                        </Flex>

                        <Flex style={{top:None== true? -70:0}}>
                            <Flex.Item style={{ flex: 1, paddingLeft: 4, paddingRight: 4 }}>
                            <View style={{justifyContent: 'center',alignItems: 'center'}}>
			                    <Image resizeMode='stretch' source={require('../../images/login/icon-password.png')} style={{ width: 26, height: 26,position: 'absolute',left: 5,}} />
                                {SeePassword == true ?
                                    <TextInput style={[{
                                        borderColor: this.state.PWDFocused == 'error' ? 'red' : this.state.PWDFocused == 'ok' ? '#868686' : this.state.PWDFocused == 'Focus' ? 'green' : '#868686'
                                    }, styles.input]}
                                        underlineColorAndroid="transparent"
                                        value={password} 
                                        placeholder='รหัสผ่าน'//'密码'
                                        placeholderTextColor="#868686"
                                        type="password"
                                        secureTextEntry={false}
                                        onChangeText={this.handlePassword}
                                        onFocus={() => this.PWDFocus()}
                                        onBlur={() => this.PWDBlur()}
                                    />
                                    : SeePassword == false &&
                                    <TextInput
                                        style={[{
                                            borderColor: this.state.PWDFocused == 'error' ? 'red' : this.state.PWDFocused == 'ok' ? '#868686' : this.state.PWDFocused == 'Focus' ? 'green' : '#868686'
                                        }, styles.input]}
                                        underlineColorAndroid="transparent"
                                        value={password} 
                                        secureTextEntry={true}
                                        placeholder='รหัสผ่าน'//'密码'
                                        placeholderTextColor="#868686"
                                        textContentType='password'
                                        onChangeText={this.handlePassword}
                                        onFocus={() => this.PWDFocus()}
                                        onBlur={() => this.PWDBlur()}
                                    />

                                }
                                </View>
                                {
                                    this.state.PWDFocused == 'error' &&
                                    <Text style={[{ marginTop: -5 }, styles.ErrorText]}>{Errorpwd}</Text>
                                }
                            </Flex.Item>

                            <Flex.Item style={{ flex: 0.2, paddingLeft: 4, paddingRight: 4,position: 'absolute',right: 10 }}>

                                <TouchableOpacity onPress={() => this.eyes()}>

                                    {SeePassword == true ?
                                        <Image resizeMode='stretch' source={require('../../images/eyes.png')} style={{ width: 25, height: 16, top: -2 }} />

                                        : SeePassword == false &&

                                        <Image
                                            resizeMode='stretch'
                                            source={
                                                require('../../images/eyes.png')
                                            }
                                            style={{ width: 25, height: 16, top: -2, opacity: 0.4 }}
                                        />

                                    }

                                </TouchableOpacity>


                            </Flex.Item>


                        </Flex>


                        <Flex style={{ height: 50,justifyContent: 'space-between' }}>

                            <CheckBox
                                checkBoxColor={"#c3c3c3"}
                                checkedCheckBoxColor={"#4ee42b"}
                                style={{ flex: 1 ,paddingLeft:1,borderRadius:50,}}
                                onClick={() => {
                                    this.setState({
                                        checkBox1: !this.state.checkBox1
                                    })
                                }}
                                isChecked={this.state.checkBox1}
                                rightTextView={<Text style={{ color: "#fff" }}>จำรหัสผ่าน</Text>}
                                //记住密码
                            />

                            <TouchableOpacity onPress={() => this.foget('fogetindex')}>
                                <Text style={styles.fogetText}>ลืมรหัสผ่าน？</Text>{/* 忘记密码? */}
                            </TouchableOpacity>
                            {/*   <Text style={styles.fogetText}>  |  </Text>

                            <TouchableOpacity onPress={() => this.foget('fogetpassword')}>
                                <Text style={styles.fogetText}>{I18n.t('login.fogetpassword')}</Text>
                            </TouchableOpacity> */}
                        </Flex>
                        {
				// 	Platform.OS == "ios" && !DeviceInfoIos &&
				//   <View style={styles.touchFaceID}>
				// 	  <Touch onPress={() => {this.fastLogins('LoginFace')}}>
				// 		<View style={[styles.touchFaceID,{width: width/2.3,justifyContent:'center'}]}>
				// 			<Image
				// 				resizeMode="stretch"
				// 				source={require("../../images/login/faceID.png")}
				// 				style={{ width: 18, height: 24 }}
				// 			/>
				// 			<Text style={{color: '#fff',paddingLeft:5}}>脸部辨识快速登录</Text>
				// 		</View>
				// 	  </Touch>
				// 	  <View style={{width: 1,backgroundColor: '#fff',height: 26}} />
				// 	  <Touch onPress={() => {this.fastLogins('LoginTouch')}}>
				// 		<View style={[styles.touchFaceID,{width: width/2.3,justifyContent:'center'}]}>
				// 			<Image
				// 				resizeMode="stretch"
				// 				source={require("../../images/login/fingerprint.png")}
				// 				style={{ width: 30, height: 25 }}
				// 			/>
				// 			<Text style={{color: '#fff',paddingLeft:5}}>使用指纹辨识</Text>
				// 		</View>
				// 	  </Touch>
				//   </View>
				  }
				  {
					// Platform.OS == "ios" && DeviceInfoIos &&
					Platform.OS == "ios" &&
				  <View style={[styles.touchFaceID,{justifyContent: 'center'}]}>
					  <Touch onPress={() => {this.fastLogins('LoginTouch',0)}}>
						<View style={[styles.touchFaceID,{width: width/2,justifyContent:'center'}]}>
							<Image
								resizeMode="stretch"
								source={DeviceInfoIos? require("../../images/login/faceID.png") :require("../../images/login/fingerprint.png")}
								style={{ width: 24, height: 32}}
							/>
                            <Text style={{color: '#fff',paddingLeft:5}}>{DeviceInfoIos? 'ล็อคอินโดยการจดจำใบหน้า': 'ล็อคอินโดยการจดจำลายนิ้วมือ'}</Text>
							{/* <Text style={{color: '#fff',paddingLeft:5}}>{DeviceInfoIos? '脸部辨识快速登录': '使用指纹辨识'}</Text> */}
						</View>
					  </Touch>
				  </View>
				  }
				  {
					Platform.OS == "android" &&
				  <View style={styles.touchFaceID}>
					  <Touch onPress={() => {this.fastLogins('LoginTouch',1)}}>
						<View style={[styles.touchFaceID,{width: width/2.3,justifyContent:'center'}]}>
							<Image
								resizeMode="stretch"
								source={require("../../images/login/fingerprint.png")}
								style={{ width: 30, height: 25 }}
							/>
                            <Text style={{color: '#fff',paddingLeft:5}}>ใช้การจดจำลายนิ้วมือ</Text>
							{/* <Text style={{color: '#fff',paddingLeft:5}}>使用指纹辨识</Text> */}
						</View>
					  </Touch>
					  <View style={{width: 1,backgroundColor: '#fff',height: 26}} />
					  <Touch onPress={() => {this.fastLogins('LoginPattern',2)}}>
						<View style={[styles.touchFaceID,{width: width/2.3,justifyContent:'center'}]}>
							<Image
								resizeMode="stretch"
								source={require("../../images/login/unlockScan.png")}
								style={{ width: 25, height: 25 }}
							/>
                            	<Text style={{color: '#fff',paddingLeft:5}}>ใช้สมาร์ทล็อค</Text>
							{/* <Text style={{color: '#fff',paddingLeft:5}}>使用图形密码</Text> */}
						</View>
					  </Touch>
				  </View>
				  }
                        {
                            isFocused != 'error' && PWDFocused != 'error' &&
                            <Touch onPress={() => this.login("commonlogin")}>
                                <View style={styles.Loginsuccess}><Text style={{ color: 'white', fontSize: 17 }}>เข้าสู่ระบบ</Text></View>
                            </Touch>
                        }
                        {
                            (isFocused == 'error' || PWDFocused == 'error') &&
                            <Touch>
                                <View style={styles.Tologin}><Text style={{ color: '#7a7a7a', fontSize: 17 }}>เข้าสู่ระบบ</Text></View>
                            </Touch>
                        }


                        {/* <View style={styles.Opendown}>
                            <TouchableOpacity onPress={Actions.Registered} >
                                <Text style={styles.Tozhuce}>
                                    免费开户
                                </Text>
                                <Image
                                    resizeMode='stretch'
                                    source={
                                        require('../../images/login/RegisterIcon.png')
                                    }
                                    style={{ width: 23, height: 26, top: -6, right: -30, position: 'absolute' }}
                                />
                            </TouchableOpacity>
                        </View> */}
                            <Touch onPress={()=>this.resgist()}>
                                <View style={styles.Registered}><Text style={{ color: 'white', fontSize: 15 }}>ยังไม่มีบัญชี ？คลิกที่นี่เพื่อลงทะเบียน</Text></View>
                            </Touch>


                        <WhiteSpace size="lg" />

                       
                    </WingBlank>
                   
                </KeyboardAvoidingView>

                <View style={{ flex: 0.1 }}>
                    <Text style={styles.NumberAPP}>เวอร์ชั่น {version}</Text>
                </View>

                <KeyboardAccessoryNavigation   
                               style={Platform.OS === "android" ?styles.AndroidTop:styles.IOStop}
                               doneButtonTitle='ยืนยัน' 
                               nextHidden={true} 
                               previousHidden={true}  
                               bumperHeight={15} />
 
            </View >

        )
    }
}

const mapStateToProps = (state) => ({
    authToken: state.auth.authToken,
    email: state.auth.email
});

const mapDispatchToProps = (dispatch) => ({
    login: (loginDetails) => {
        login(dispatch, loginDetails);
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
const styles = StyleSheet.create({
    headerTop: {
        top: 0,
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
		padding: 15,
		paddingTop: 30,
    },
    AndroidTop:{
       //top:height < 600 ?-240 :-280
       bottom:280
    },
    Opendown: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 47,
        paddingLeft: 0,
        paddingRight: 15,
        width: '100%',
        marginTop: 70
    },
    Tozhuce: {
        textAlign: "center",
        color: 'white',
        fontSize: 17
    },
    Tologin: {
        width: '100%',
        backgroundColor: '#242424',
        borderColor: '#242424',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    skynetBtn: {
        width: width * .8,
        backgroundColor: '#00b324',
        borderColor: '#00b324',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17,
        marginTop: 25,
        marginTop: 25,
        marginBottom: 30
    },
    ErrorText: {
        color: 'red',
    },
    Loginsuccess: {
        width: '100%',
        backgroundColor: '#00b324',
        borderColor: '#00b324',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    Registered: {
        width: '100%',
        borderColor: '#00b324',
        borderWidth: 1,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    imgBackground: {
        width: width,
        height: height,
    },
    video: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    bg2: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#000",
        opacity: 0.5
    },
    logo: {
        justifyContent: "center",
        alignItems: "center",
        paddingBottom:10

    },
    container: {
        backgroundColor: "#000",
        flex: 1
    },

    Box: {
        marginTop: 100,
    },

    fogeBox: {
        marginTop: 0,
    },
    fogetText: {
        color: '#00b324',
    },

    buttonBox2: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    button2: {
        borderRadius: 40,
        backgroundColor: 'rgba(52, 52, 52, 0)',
        borderWidth: 0,

    },

    input: {
        width: width - 30,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 35,
        color: 'white'
    },
    input2: {
        width: width * .8,
        borderColor: '#9E9E9E',
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 12,
        color: 'white'
    },
    skynetInput: {
        width: width * .8,
        borderColor: '#9E9E9E',
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 12,
        color: 'white'
    },
    button2Text: {
        fontWeight: 'bold',
        color: '#000'

    },
    NumberAPP: {
        fontSize:12,
        color: '#fff',
        textAlign: 'center',

    },
    Loginerror: {

        color: 'red',
        textAlign: 'center',

    },


    submitButton: {
        borderWidth: 0,
        borderRadius: 40,
        backgroundColor: 'rgba(52, 52, 52, 0)',
    },

    submitButtonText: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    checkBox1: {
        width: 25,
        height: 25
    },


    popBox: {
        width: width - 80,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: height / 2.4,
        left: width / 8.5,
        borderRadius: 12,
        backgroundColor: '#fff',
        height: 150,
    },


    popBox2: {
        width: width,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
        backgroundColor: '#000',
        borderRadius: 12,
        height: height,
    },
    touchFaceID: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop:6,
        marginBottom:10
    },
    modalContainer2: {
        width: width * .8,
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowColor: '#00B324',
        elevation: 4,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        top: 50
    },
    modalOverly: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    skynetDatePickerContainer: {
        width: width * .8,
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
    skynetDatePickerFlex: {
        width: width * .8,
        // justifyContent: "center",
        // alignItems: "center",
    },
    skynetDatePickerFlexItem: {
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        borderColor: '#9E9E9E',
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 14,
        borderWidth: 1,
        borderRadius: 5,
        color: 'white',
        paddingLeft: 12,
    },
});
