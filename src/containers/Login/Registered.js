/*
 * @Author: Hayden 
 * @Date: 2019-12-10 10:53:16 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: 2019-12-10 10:53:16 
 */
import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Platform,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  NativeModules,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
  Clipboard,
} from "react-native";
import CheckBox from "react-native-check-box";
import {
  Toast} from "antd-mobile-rn";
import AnalyticsUtil from "../../actions/AnalyticsUtil"; //友盟
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";


import { I18n } from "../../language/i18n";
import { KeyboardAccessoryNavigation } from "react-native-keyboard-accessory";
import { namereg,passwordReg,phoneReg} from "../../actions/Reg";
const AffCodeAndroid = NativeModules.opeinstall; //android 獲取code 參數
const AffCodeIos = NativeModules.CoomaanTools; //ios 獲取code 參數

const { width, height } = Dimensions.get("window");
import { ACTION_PhoneSetting_Update } from '../lib/redux/actions/UserSettingAction'
import { connect } from 'react-redux';

class Registered extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      Button1: "",
      currency: "", //貨幣
      wallet: "", //錢包
      referer: "referer",
      blackBoxValue: Iovation,
      gender: "string",
      secretQID: 0,
      nationID: 1,
      msgerType: 0,
      dob: "string",
      placeOfBirth: "string",
      hostName: "string",
      regWebsite: 0,
      user: "", //帳戶
      name: "", //用戶名
      password: "", //密碼
      repassword: "", // 密碼確認
      phone: "", //電話
      email: "", //郵箱
      qq: "", //qq
      wechat: "", //微信
      Scode: "", // 推薦代碼
      isFocused: "",
      PWDFocused: "",
      PWDFocused1: "",
      Errorname: "",
      Errorpwd: "",
      Errorpwd1: "",
      ISAndroidNone: false,
      phoneFocused: "",
      ErrorPhone: "",
      isChecked: false,
      affCode:affCodeKex ?affCodeKex:'',
      Prefixes: [],
      MaxLength: 11,
      MinLength: 11,
      isShowLiveChatModal:false,
      liveChatUrl:null,
      SeePassword: false,
    };
  }

  componentDidMount(props) {
    this.GetPhonePrefix()

    //彈客服窗
    if(!ApiPort.UserLogin){
      setTimeout(()=>{
          this.getLiveChat()
      }, 300000) 
  }
	this.getAffCode()//获取affcode
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

  getLiveChat(){
    fetchRequest(ApiPort.LiveChat+'Type=2&', "GET")
    .then((data) => {
        if(data?.isMatched){
            this.setState({
                isShowLiveChatModal:true,
                liveChatUrl:data.url
            })
        }
        console.log('re LiveChat data',data)
    })
    .catch(() => {});
}


  GetPhonePrefix = () => {
    const reduxPhone = this.props.userSetting.phonePrefix
    console.log(this.props.userSetting)
    if(Object.keys(this.props.userSetting.phonePrefix).length !== 0){
      this.setState({
        Prefixes: reduxPhone.Prefixes,
        MaxLength: reduxPhone.MaxLength,
        MinLength: reduxPhone.MinLength
      })
    }else{
      fetchRequest(ApiPort.PhonePrefix, "GET")
          .then(res => {
            this.props.phone_setting(res)
            this.setState({
              Prefixes: res.Prefixes,
              MaxLength: res.MaxLength,
              MinLength: res.MinLength
            })
          })
    }
  }

  postRegist() {
    const {
      name,
      password,
      phone,
      password1,
      isChecked,
    } = this.state; //註冊訊息


    if (phone.replace(/\s+/g, "") == false) {
      //去掉空白字符后为空
      Toast.info("กรุณากรอกเบอร์โทรศัพท์");
      return;
    }
    if (name.replace(/\s+/g, "") == false) {
      Toast.info(I18n.t("login.nouser"));
      return;
    }

    // if (password != password1) {
    //   //Toast.fail("密码未填写", 3)
    //   this.setState({
    //     PWDFocused: "error",
    //     PWDFocused1: "error",
    //     Errorpwd: "两次填写密码不相同",
    //     Errorpwd1: "两次填写密码不相同"
    //   });
    //   return;
    // }

    if (password.replace(/\s+/g, "") == false) {
      //Toast.fail("密码未填写", 3)
      this.setState({
        PWDFocused: "error",
        Errorpwd: "รหัสผ่านไม่สามารถเว้นว่างได้"
      });
      return;
    }

    if (namereg.test(name) == false) {
      //Toast.fail('用户名必须拥有 6-14个数字或字母构成', 3)
      this.setState({
        isFocused: "error",
        Errorname:'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว'
        //Errorname: "用户名必须拥有 6-14个数字或字母构成"
      });
      return;
    }

    if (name.split("").length < 6) {
     // Toast.info("用户名最少6个字符，并区分大小写", 3);
      Toast.info('ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว',3)
      this.setState({
        isFocused: "error",
        Errorname:'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว'
       // Errorname: "用户名最少6个字符，并区分大小写"
      });
      return;
    }

    if (passwordReg.test(password) == false) {
      //Toast.fail('密码格式错误，请您重新输入。（密码必须由至少6位、最多20位长度的字母和数字组成，中间不可含有符号、空格或下划线。）', 3)
      this.setState({
        PWDFocused: "error",
        Errorpwd:'รหัสผ่านควรประกอบด้วยตัวอักษรและตัวเลข 6-20 ตัว'
       // Errorpwd: "密码格式错误，请您重新输入。（密码必须由至少6位、最多20位长度的字母和数字组成，中间不可含有符号、空格或下划线。）"
      });
      return;
    }
    // if (passwordReg.test(password1) == false) {
    //   //Toast.fail('密码格式错误，请您重新输入。（密码必须由至少6位、最多20位长度的字母和数字组成，中间不可含有符号、空格或下划线。）', 3)
    //   this.setState({
    //     PWDFocused1: "error",
    //     Errorpwd1:
    //       "密码格式错误，请您重新输入。（密码必须由至少6位、最多20位长度的字母和数字组成，中间不可含有符号、空格或下划线。）"
    //   });
    //   return;
    // }

    //電話號碼格式檢測
    let reg = /^[1-9]{1}[0-9]{8}$/;
    let nuj = phone.replace(/\s+/g, "");
    if (nuj == "") {      
      Toast.info("กรุณากรอกเบอร์โทรศัพท์");
      // Toast.info("电话号码未填写");
      return;
    }else if(reg.test(nuj)){
      Toast.info('คุณกรอกหมายเลขโทรศัพท์ไม่ถูกต้อง หมายเลขโทรศัพท์ต้องทำการตัด {0} ตัวหน้าออก เช่น xx-xxx-xxxx')
    }

    if (!isChecked) { 
      Toast.info("กรุณาอ่านและยอมรับในกฎและเงื่อนไขของ JBO");
      // Toast.info("请阅读并同意竞博平台用户规则条款");
      return;
    }
    let str = nuj;
    let strX = str.replace(/ /g, ""); 
    let affc = affCodeKex.replace(/[^\w\.\/]/ig,'')
 
    let date = {
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox,
      hostName: common_url,
      regWebsite: Platform.OS === "android" ? 3 : 4,
      language: "th-th",
      mobile: "66-" + strX,
      brandCode: "jbo",
      currency: 'THB', 
      userName: name,
      mediaCode: "",
      affiliateCode: affc,
      password: password
    };

    //let uri = '/api/App/RewardURLs?api-version=1.0&brand=fun88'
    Toast.loading("กำลังสมัคร...", 1000000); 
    fetchRequest(ApiPort.Register, "POST", date)
      .then(data => {
        Toast.hide();

        if (data.isSuccess == false) {
          // if (data.result.errorCode == "MEM00026") {
          //   Toast.info("该用户名称已被他人使用，请重新填写", 2);
          //   return;
          // }
          const errMsg = data.result.Message || data.result.message;
          Toast.info(errMsg, 2);
        } else if (data.isSuccess == true) {
          
          //判斷進入倒計時畫面的跳轉紀錄頁面,為新會員或舊會員
          global.localStorage.setItem('newRegist',true)

          Toast.success("ขอแสดงความยินดี การสมัครสำเร็จ ", 2);
          // Toast.success("注册成功", 2);
          UMonEvent('Register','Submit','Register_RegisterPage');

          RegisteredMG = false;

          NoGoHome = false;
          userLogin = name; //
          userPassword = password; //
          isRegist = true; // 是註冊
          Globlogin(name, password, "commonlogin", true);
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  handelPhoneNo = phone => {
    const {
      Prefixes,
      MaxLength,
      MinLength
    } = this.state;

    console.log(phone)
    console.log(Prefixes)
    let prefixCheck = Prefixes.some(a => phone.startsWith(a))
    let lengthCheck = phone.length <= MaxLength && phone.length >= MinLength
    
    if (prefixCheck && lengthCheck) {
      this.setState({
        phoneRegtrue: true,
        phoneFocused: "Focus"
      });
    } else {
      this.setState({
        phoneRegtrue: false,
        phoneFocused: "error",
        ErrorPhone: "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง"
        // ErrorPhone: "请输入正确的手机号"
      });
    }
    this.setState({ phone });
  };

  onPhoneFocus = () => {
    if (this.state.phoneFocused != "error") {
      this.setState({
        ISAndroidNone: true,
        phoneFocused: "Focus"
      });
    }
  };

  onPhoneBlur = () => {
    if (this.state.phoneFocused != "error") {
      this.setState({
        ISAndroidNone: false,
        phoneFocused: "ok"
      });
    }
  };

  UsernameFocus = () => {
    if (this.state.isFocused != "error") {
      this.setState({
        ISAndroidNone: true,
        isFocused: "Focus"
      });
    }
  };

  UsernameBlur = () => {
    if (this.state.isFocused != "error") {
      this.setState({
        ISAndroidNone: false,
        isFocused: "ok"
      });
    }
  };

  PWDFocus = () => {
    if (this.state.PWDFocused != "error") {
      this.setState({
        ISAndroidNone: true,
        PWDFocused: "Focus"
      });
    }
  };

  PWDBlur = () => {
    if (this.state.PWDFocused != "error") {
      this.setState({
        ISAndroidNone: false,
        PWDFocused: "ok"
      });
    }
  };

  //二次确认密码
  PWDFocus1 = () => {
    if (this.state.PWDFocused1 != "error") {
      this.setState({
        ISAndroidNone: true,
        PWDFocused1: "Focus"
      });
    }
  };
  //二次确认密码
  PWDBlur1 = () => {
    if (this.state.PWDFocused1 != "error") {
      this.setState({
        ISAndroidNone: false,
        PWDFocused1: "ok"
      });
    }
  };

  handleUsername = name => {
    let namereg = /^[a-zA-Z0-9]{6,14}$/;
    if (namereg.test(name) == false) {
      this.setState({
        isFocused: "error",
        Errorname:'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว',
       // Errorname: "用户名必须拥有 6-14个数字或字母构成"
      });
      //Toast.fail('用户名必须拥有 6-14个数字或字母构成')
    } else {
      this.setState({
        isFocused: "Focus"
      });
    }
    this.setState({ name });
  };

  handlePassword = password => {
    let passwordReg = /^(?=.{6,20}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])+$/;
    if (passwordReg.test(password) == false) {
      this.setState({
        PWDFocused: "error",
        Errorpwd:"รหัสผ่านควรประกอบด้วยตัวอักษรและตัวเลข 6-20 ตัว",
       // Errorpwd:"密码格式错误，请您重新输入。（密码必须由至少6位、最多16位长度的字母和数字组成，中间不可含有符号、空格或下划线。）"
      });
    } else {
      this.setState({
        PWDFocused: "Focus"
      });
    }
    this.setState({ password });
  };

  //二次确认密码
  handlePassword1 = password1 => {
    let passwordReg = /^(?=.{6,20}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])+$/;
    if (passwordReg.test(password1) == false) {
      this.setState({
        PWDFocused1: "error",
        Errorpwd:"รหัสผ่านควรประกอบด้วยตัวอักษรและตัวเลข 6-20 ตัว",
       // Errorpwd1:"密码格式错误，请您重新输入。（密码必须由至少6位、最多16位长度的字母和数字组成，中间不可含有符号、空格或下划线。）"
      });
    } else {
      this.setState({
        PWDFocused1: "Focus"
      });
    }
    this.setState({ password1 });
  };

  checkSubmitStatus = () => {
    const {
      isFocused,
      PWDFocused,
      phoneFocused,
      name, phone, password, isChecked
    } = this.state;
    if (name === "" || phone === "" || password === "" || isChecked === false) return false;
    return phoneFocused != "error" && isFocused != "error" && PWDFocused != "error"
  }

  eyes() {  //顯示密碼 
    this.setState({
        SeePassword: this.state.SeePassword == false ? true : false
    })
  }
  
  render() {
    const {
      SeePassword,
      isShowLiveChatModal,
      liveChatUrl,
      isFocused,
      PWDFocused,
      Errorname,
      Errorpwd,
      Errorpwd1,
      ErrorPhone,
      PWDFocused1,
      affCode,
      phoneFocused
    } = this.state; //註冊訊息
    
    return (
      <View style={styles.rootContainer}>
          <Modal
					animationType="fade"
					transparent={true}
					visible={!ApiPort.UserLogin && isShowLiveChatModal}
				>
					<View style={[styles.liveChatModal]}>
						<View style={styles.liveChatModalContainer}>
							<TouchableOpacity style={styles.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
								this.setState({
									isShowLiveChatModal:false
								})
							}}>
								<Text style={styles.closeBtnText}>X</Text>
							</TouchableOpacity>
							<View style={styles.modalBottomContainer}>
								<Image source={require('../../images/liveChat_img.png')}  resizeMode='stretch' style={styles.liveChatIconImg}></Image>
								<Text style={styles.liveChatTextInfor}>หากต้องการความช่วยเหลือ 
ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง</Text>
								<TouchableOpacity style={styles.liveChatBottomBtn} onPress={() => {
									UMonEvent("CS", "Click", "CS_Invitation_RegisterPage");
									Linking.openURL(liveChatUrl);
                  this.setState({
                    isShowLiveChatModal:false
                  })
								}}>
									<Text style={styles.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={-30}
        >
          <ImageBackground
            style={{ width: width, height: height, flex: 1 }}
            resizeMode="cover"
            source={require("../../images/login/N-registerBG.jpg")}
          >
            <View
              style={[
                { height: Platform.OS === "ios" ? 75 : 45, zIndex: 200 },
                styles.headerTop
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  Actions.pop();
                }}
                style={{ width: 30 }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon-back.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <Text style={{ color: "#fff", fontSize: 18 }}>
              ลงทะเบียน
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Actions.LiveChatST()
                }}
                style={{ width: 30 }}
              >
               	{LivechatDragType == false ?  
								<Image
								resizeMode="stretch"
                source={require("../../images/home/icon_cs_new.png")}
								//source={require("../../images/home/icon-cs.gif")}
								style={{ width: 28, height: 28 }}
							/>
								:LivechatDragType == true &&
								<Image
								resizeMode="stretch"
								source={require("../../images/home/icon-cshover.png")}
								style={{ width: 28, height: 28 }}
							/>
								
								}
              </TouchableOpacity>
            </View>

            {/* {ISAndroidNone != true &&
            <View
              style={[
                styles.logo,
                {
                  paddingTop: ISAndroidNone != true ? 70 : 0,
                  top:
                    ISAndroidNone != true
                      ? 0
                      : Platform.OS === "android"
                      ? -100
                      : -30
                }
              ]}
            >
              <Image
                resizeMode="stretch"
                source={require("../../images/login/logo.png")}
                style={{
                  width: Platform.OS == "android" ? width / 4.3 : width / 4,
                  height: height / 4.5
                }}
              />
            </View>
             } */}

            <View style={{ flex: 0.2 }} />

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30
              }}
            >
            

              {/* 用户名输入框 */}
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/icon-account.png")}
                  style={{
                    width: 26,
                    height: 26,
                    position: "absolute",
                    left: 2
                  }}
                />
                <TextInput
                  type="text"
                  value={this.state.name}
                  onChangeText={this.handleUsername}
                  labelNumber={4}
                  placeholder="กรุณาตั้งยูสเซอร์เนม"//"用户名"
                  placeholderTextColor="#868686"
                  style={[
                    {
                      borderColor:
                        this.state.isFocused == "error"
                          ? "red"
                          : this.state.isFocused == "ok"
                          ? "#868686"
                          : this.state.isFocused == "Focus"
                          ? "green"
                          : "#868686"
                    },
                    styles.input
                  ]}
                  onFocus={() => this.UsernameFocus()}
                  onBlur={() => this.UsernameBlur()}
                />
              </View>
              {/* 用户名错误提示 */}
              {this.state.isFocused == "error" && (
                <Text style={[{ marginTop: -5 }, styles.ErrorText]}>
                  {Errorname}
                </Text>
              )}

              {/* 密码输入框 */}
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/icon-password.png")}
                  style={{
                    width: 26,
                    height: 26,
                    position: "absolute",
                    left: 2
                  }}
                />
            
            {SeePassword == true ?
                <TextInput style={[{
                    borderColor: this.state.PWDFocused == 'error' ? 'red' : this.state.PWDFocused == 'ok' ? '#868686' : this.state.PWDFocused == 'Focus' ? 'green' : '#868686'
                }, styles.input]}
                  labelNumber={4}
                  underlineColorAndroid="transparent"
                  value={this.state.password} 
                  placeholder='กรุณาตั้งรหัสผ่าน'//'密码'
                  placeholderTextColor="#868686"
                  type="password"
                  secureTextEntry={false}
                  onChangeText={this.handlePassword}
                  onFocus={() => this.PWDFocus()}
                  onBlur={() => this.PWDBlur()}
              />
              : SeePassword == false &&
              <TextInput
              style={[
                {
                  borderColor:
                    this.state.PWDFocused == "error"
                      ? "red"
                      : this.state.PWDFocused == "ok"
                      ? "#868686"
                      : this.state.PWDFocused == "Focus"
                      ? "green"
                      : "#868686"
                },
                styles.input
              ]}
                labelNumber={4}
                underlineColorAndroid="transparent"
                  value={this.state.password} 
                  secureTextEntry={true}
                  placeholder='กรุณาตั้งรหัสผ่าน'//'密码'
                  placeholderTextColor="#868686"
                  textContentType='password'
                  onChangeText={this.handlePassword}
                  onFocus={() => this.PWDFocus()}
                  onBlur={() => this.PWDBlur()}
              />}

              <View  style={{ flex: 0.2, paddingLeft: 4, paddingRight: 4,position: 'absolute',right: 10 }}>
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
                </View>
              </View>
              {/* 密码错误提示 */}
              {this.state.PWDFocused == "error" && (
                <Text style={[{ marginTop: -5 }, styles.ErrorText]}>
                  {Errorpwd}
                </Text>
              )}


            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/icon-phone.png")}
                  style={{
                    width: 26,
                    height: 26,
                    position: "absolute",
                    left: 2
                  }}
                />
                {/* 手机号码 */}
                <TextInput
                  type="number"
                  value={this.state.phone}
                  maxLength={9}
                  onChangeText={this.handelPhoneNo}
                  placeholder="เบอร์โทรศัพท์"
                  placeholderTextColor="#868686"
                  labelNumber={4}
                  style={[
                    {
                      borderColor:
                        this.state.phoneFocused == "error"
                          ? "red"
                          : this.state.phoneFocused == "ok"
                          ? "#868686"
                          : this.state.phoneFocused == "Focus"
                          ? "green"
                          : "#868686"
                    },
                    styles.input
                  ]}
                  onFocus={() => this.onPhoneFocus()}
                  onBlur={() => this.onPhoneBlur()}
                />
              </View>
              {/* 手机号码错误提示 */}
              {this.state.phoneFocused == "error" && (
                <Text style={[{ marginTop: -5 }, styles.ErrorText]}>
                  {ErrorPhone}
                </Text>
              )}
              {/*代理碼*/}
              {affCode !== '' && (
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image
                        resizeMode="stretch"
                        source={require("../../images/login/hand.png")}
                        style={{
                          width: 16,
                          height: 12,
                          position: "absolute",
                          left: 7
                        }}
                    />
                    <TextInput
                        // secureTextEntry={true}
                        placeholder={affCode}
                        // value={affCode}
                        editable={false}
                        // onChangeText={this.affcodeCheck}
                        // labelNumber={7}
                        placeholderTextColor="#fff"
                        style={[{borderColor: "#868686", color: '#fff'},styles.input]}
                    />
                  </View>
              )}
              
              {/* 密码错误提示 */}
              {/* {this.state.PWDFocused1 == "error" && (
                <Text style={[{ marginTop: -5 }, styles.ErrorText]}>
                  {Errorpwd1}
                </Text>
              )} */}

              <View style={{ flexDirection: "row",justifyContent:"flex-start",alignItems:"center",width:width-30, marginTop:10,}}>
                <CheckBox
                  // checkBoxColor={"#c3c3c3"}
                  // checkedCheckBoxColor={"#4ee42b"}
                  style={{}}
                  onClick={() => {
                    this.setState({
                      isChecked: !this.state.isChecked
                    });
                  }}
                  isChecked={this.state.isChecked}
                  rightTextView={
                    <Text style={{color: "#fff", paddingLeft: 3}}>คลิกปุ่ม [ลงทะเบียน] เพื่อยืนยันว่าคุณมีอายุมากกว่า 18
                      ปี{"\n"}ได้อ่านและยอมรับใน<Text style={{color: '#00b324'}} onPress={() => {
                        ApiPort.UserTerms = "เงื่อนไขและข้อตกลง";
                        Actions.UserTerms({ TermsType: "user" });
                      }}> ข้อกำหนดและเงื่อนไข </Text>ทั้งหมด
                    </Text>
                  }
                  unCheckedImage={
                    <View
                      
                      style={{ width: 15, height: 15,borderRadius:20,borderWidth:1,borderColor:"#c3c3c3" }}
                    />
                  }
                  checkedImage={
                    <Image
                      source={require("../../images/fill.png")}
                      style={{ width: 15, height: 15 }}
                    />
                  }
                />
              </View>
              {/*提交表單*/}
              {this.checkSubmitStatus()? (
                  <Touch
                    onPress={this.postRegist.bind(this)}
                    style={{ marginTop: 20, width: "93%" }}
                  >
                    {/* <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingTop: 10 }}>{I18n.t('Registered.10')}</Text> */}
                    <View style={styles.Zhucesuccess}>
                      <Text style={{ color: "white", fontSize: 17 }}>
                         ลงทะเบียน{/*提交*/}
                      </Text>
                    </View>
                  </Touch>
                ):(
                  <Touch style={{ marginTop: 20, width: "93%" }}>
                    {/* <Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center', paddingTop: 10 }}>{I18n.t('Registered.10')}</Text> */}
                    <View style={styles.ToZhuce}>
                      <Text style={{ color: "white", fontSize: 17 }}>
                        ลงทะเบียน
                      </Text>
                    </View>
                  </Touch>
              )}
            </View>
            {/* <View style={{padding: 10,paddingTop: 25}}>
				<Touch onPress={() => {Actions.logins()}}>
					<View style={{borderColor: 'green', borderWidth: 1,borderRadius: 5}}>
						<Text style={{color: '#fff',textAlign: 'center',lineHeight: 45}}>已有账号，马上登录</Text>
					</View>
				</Touch>
			</View> */}
            <View style={{ padding: 10, paddingTop: 25 }}>
              <Text
                style={{ color: "#fff", textAlign: "center", lineHeight: 45 }}
              >
                เวอร์ชั่น {JBOVersion}
              </Text>
            </View>
          </ImageBackground>
          <KeyboardAccessoryNavigation
            style={{
              top: Platform.OS === "android" ? height / -11 : height / -11
            }}
            doneButtonTitle="ยืนยัน"
            nextHidden={true}
            previousHidden={true}
            bumperHeight={15}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userSetting: state.userSetting,
});
const mapDispatchToProps = (dispatch) => ({
  phone_setting: phonePrefix => ACTION_PhoneSetting_Update(phonePrefix),
});
export default connect(mapStateToProps, mapDispatchToProps)(Registered);

const styles = StyleSheet.create({
  logo: {
    justifyContent: "center",
    alignItems: "center"
  },
  visible: {
    backgroundColor: "#000"
  },
  ErrorText: {
    color: "red",
    width: "100%",
    textAlign: "left",
    paddingLeft: 20
  },
  input: {
    width: width - 20,
    textAlign: "left",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 30,
    color: "white"
  },
  loginButton: {
    fontWeight: "bold",
    borderRadius: 10,
    color: "#fff",
    textAlign: "center",
    fontSize: 18
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center"
  },
  textStyles: {
    textAlign: "center",
    color: "rgba(0,0,0,0.8)",
    fontSize: 16
  },
  touchableStyles: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#012c1f",
    width: 300,
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 25
  },
  success: {
    width: "100%",
    backgroundColor: "green",
    borderColor: "green",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17
  },
  ToZhuce: {
    width: width - 20,
    backgroundColor: "#242424",
    borderColor: "#242424",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17
  },

  Zhucesuccess: {
    width: width - 20,
    backgroundColor: "#00b324",
    borderColor: "#00b324",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17
  },
  headerTop: {
    top: 0,
    width: width,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
    padding: 15,
    paddingTop: 30
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
liveChatModal:{
width,
    height,
    backgroundColor: 'rgba(0, 0, 0, .5)',
    alignItems: 'center',
    justifyContent: 'center'
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
});
