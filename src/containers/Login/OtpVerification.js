import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import { Toast } from "antd-mobile-rn";
import { maskEmail, maskPhone} from "../../actions/Reg";
import VerificationCodeInput from "../VerificationCodeInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { login, logout } from "../../actions/AuthAction";
import { connect } from "react-redux";
//import LoginOptVerify from "./LoginOptVerify";
//import VerifyFail from "./VerifyFail";
//import Taost1 from "../ToastNew";
const { width, height } = Dimensions.get("window");

let verificationType = {
  phone: {
    title: "手机验证",
    //txt1: "手机",
    txt1: "ข้อมูลเบอร์โทรศัพท์ที่ลงทะเบียน",
    txt1en: "phone",
    txt2: "手机号码",
    txt3: "如果您想更新手机号码，请联系我们的",
    txt4: "请输入您手机收到的验证码",
    txt5: "số điện thoại",
    txt6: "OTP ที่ส่งไปยังเบอร์โทรศัพท์ของคุณ"
  },
  email: {
    title: "邮箱验证",
    //txt1: "邮箱",
    txt1: "ข้อมูลอีเมลที่ลงทะเบียน",
    txt1en: "email",
    txt2: "电子邮箱",
    txt3: "如果您想更新电子邮箱，请联系我们的 ",
    txt4: "请输入您邮箱收到的验证码",
    txt5: "email.Mã Xác Thực OTP Email sẽ có hiệu lực trong 1 giờ",
    txt6: "OTP ที่ส่งไปยังอีเมลคุณ",
  },
};

let otpType = {
  sms:{//通過電話發送代碼
    txt1:"ส่งรหัส OTP ทางการโทร",

  },
  voice:{//通過簡訊發送代碼
    txt1:"ส่งรหัส OTP ทาง SMS",
  }
}

class OtpVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aaa: "",
      errCode: 0,
      exceed: false,
      codeAgainVoice: false,
      codeAgainPhone: false,
      codeAgainEmail: false,
      getCodeVoice: true,
      getCodePhone: true,
      getCodeEmail: true,
      getCodeVoice:true,
      verificationCode: "",
      CountdownPhone: "180",
      CountdownEmail: "600",
      // CountdownVoice_minutes: "3:00",
      // CountdownPhone_minutes: "3:00",
      // CountdownEmail_minutes: "10:00",
      issubmitBtn: false,
      verificaType: this.props.verificaType,
      phone: "",
      email: "",
      phoneOrEmail: "",
      memberCode: "",
      toastMsg: "",
      toastErrorFlag: false,
      toastSuccessFlag: false,
      toastSendFlag:false,
      showCanChage:false,
      sms:otpType.sms,
      voice:otpType.voice,
      isTxt:true,
      isVoice:false,
      consequence:'',
      storagePHTime:'',
      storagePHVTime:'',

      username:this.props.loginName,
      password:this.props.password,
    };
    console.log('this.props.username',this.props.loginName,'this.props.password',this.props.password,)
  }

  componentWillMount() {
    this.setData();
    this.getDownTime();
    console.log('componentWillMount=======',this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    // You don't have to do this check first, but it can help prevent an unneeded render
    // if (nextProps.startTime !== this.state.startTime) {
    //     this.setState({ startTime: nextProps.startTime });
    // }
  }

  getDownTime() {
    //重新进行倒计时
    if (this.state.verificaType == "phone") {
      global.storage
      .load({
        key: "VerifyPhone",
        id: "VerifyPhone",
      })
      .then((res) => {
        console.log('sms res=====',res)
        this.setState({ storagePHTime: res, isTxt:true, isVoice:false, consequence:0 });
        if (new Date().getTime() < res) {
          this.TimeDownPhone();
          this.setState({
            isTxt:true, 
            isVoice:false, 
            consequence:0
          })
        }          
      });
      global.storage
      .load({
        key: "VerifyVoice",
        id: "VerifyVoice",
      })
      .then((res) => {
        console.log('voice res=====',res)
        this.setState({  storagePHVTime: res });
        if (new Date().getTime() < res) {
          this.TimeDownVoice();
          this.setState({
            isVoice:true, 
            isTxt:false, 
            consequence:1
          })
        }
        
      });
    } else if (this.state.verificaType == "email") {
      global.storage
        .load({
          key: "VerifyEmail",
          id: "VerifyEmail",
        })
        .then((res) => {
          this.setState({ storageTime: res });
          if (new Date().getTime() < res) {
            this.TimeDownEmail();
          }
        });
    }
  }

  setData() {
    let phone = this.props.dataPhone;
    let email = this.props.dataEmail;
    // if (this.state.verificaType == "phone" && phone.indexOf("-") > -1) {
    //   phone = phone.split("-")[1];
    // }

    let memberCode = this.props.memberCode;
    this.setState({ phone, email, memberCode }, () => {
      this, this.setVerifyData();
    });
  }

  // 隐藏需验证的手机或邮箱
  setVerifyData() {
    let datas;
    const { verificaType, phone, email } = this.state;
    if (verificaType == "email") {
      // datas = maskEmail(email);
      datas = email;
    } else {
      //datas = maskPhone(phone);
      datas = phone;
    }
    this.setState({ phoneOrEmail: datas });
  }

  changType() {
    // 更換验证方式 - 导回原本”安全系统升级“页面，用户可以重新选择验证方式
    // Actions.LoginOptVerify();
    Actions.pop();
    // this.setState({
    //     verificationCode: '',
    //     verificaType: this.state.verificaType == 'email' ? 'phone' : 'email',
    // }, () => {
    //     this.setVerifyData()
    //     this.props.navigation.setParams({
    //         title: verificationType[this.state.verificaType].title
    //     });
    // })
  }

  // 清空验证码
  clearCode() {
    let errCode = this.state.errCode;
    errCode += 1;
    this.setState({
      issubmitBtn: false,
      verificationCode: "",
      errCode,
    });
  }

  checked(code) {
    if (code.length == 6) {
      this.setState({ issubmitBtn: true, verificationCode: code });
    } else {
      this.setState({ issubmitBtn: false });
    }
  }

  //手机验证码倒计时处理
  TimeDownPhone() {
    this.setState({ codeAgainPhone: true, getCodePhone: false });
    var m = 3; //分
    var s = 0; //秒
    if (new Date().getTime() < this.state.storagePHTime) {
      let t = (this.state.storagePHTime - new Date().getTime()) / 1000;
      let s1 = t / 60;
      let s2 = t % 60;
      m = Math.floor(s1);
      s = Math.floor(s2);
    }

    this.CountdownPhones = setInterval(() => {
      let Sdb = s < 10 ? "0" + s : s;
      let Mdb = m < 10 ? "0" + m : m;
      this.setState({ CountdownPhone_minutes: Mdb + ":" + Sdb });
      if (m == 0 && s == 0) {
        this.setState({ getCodePhone: true });
        clearInterval(this.CountdownPhones);
        if (this.props.SmsSendTime == 0) {
          console.log(1234444);
          this.props.updateVerifyLimitReached(true);
        }
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

  TimeDownVoice() {
    this.setState({ codeAgainVoice: true, getCodeVoice: false });
    var m = 3; //分
    var s = 0; //秒
    if (new Date().getTime() < this.state.storagePHVTime) {
      let t = (this.state.storagePHVTime - new Date().getTime()) / 1000;
      let s1 = t / 60;
      let s2 = t % 60;
      m = Math.floor(s1);
      s = Math.floor(s2);
    }

    this.CountdownVoice = setInterval(() => {
      let Sdb = s < 10 ? "0" + s : s;
      let Mdb = m < 10 ? "0" + m : m;
      this.setState({ CountdownVoice_minutes: Mdb + ":" + Sdb });
      if (m == 0 && s == 0) {
        this.setState({ getCodeVoice: true });
        clearInterval(this.CountdownVoice);
        if (this.props.SmsSendTime == 0) {
          console.log(1234444);
          this.props.updateVerifyLimitReached(true);
        }
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
  //邮箱验证码倒计时处理
  TimeDownEmail() {
    this.setState({ codeAgainEmail: true, getCodeEmail: false });
    var m = 10; //分
    var s = 0; //秒
    if (new Date().getTime() < this.state.storageTime) {
      let t = (this.state.storageTime - new Date().getTime()) / 1000;
      let s1 = t / 60;
      let s2 = t % 60;
      m = Math.floor(s1);
      s = Math.floor(s2);
    }

    this.CountdownEmails = setInterval(() => {
      let Sdb = s < 10 ? "0" + s : s;
      let Mdb = m < 10 ? "0" + m : m;
      this.setState({ CountdownEmail_minutes: Mdb + ":" + Sdb });
      if (m == 0 && s == 0) {
        this.setState({ getCodeEmail: true });
        clearInterval(this.CountdownEmails);
        if (this.props.emialSendTime == 0) {
          this.props.updateVerifyLimitReached(true);
        }
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
  //提交验证
  submitBtn() {
    if (this.canSubmit()) {
      this.verifyTAC();
    }
  }

  canSubmit = () => {
    const {
      issubmitBtn, // 有沒有輸入六碼
      verificaType,
      getCodePhone, // false = 在倒數狀態
      getCodeEmail,
      codeAgainEmail, // true = 可重發驗證碼
      codeAgainPhone,
    } = this.state;

    if (!issubmitBtn) {
      return false;
    }

    // 不在倒數狀態 不可提交 除非重發驗證碼是true
    // if (verificaType === "phone") {
    //   if (getCodePhone || !codeAgainPhone) {
    //     return false;
    //   }
    // }

    // 不在倒數狀態 或
    // if (verificaType === 'phone' && (getCodePhone || !codeAgainPhone)) {
    //     return false;
    // }
    //
    // if (verificaType === 'email' && (getCodeEmail || !codeAgainEmail)) {
    //     return false;
    // }
    return true;
  };

  canSwitch = () => {
    console.log('canSwitch=====')
    const { getCodeVoice , isVoice, getCodePhone , isTxt   } = this.state;

    if((!getCodeVoice && isVoice || !getCodePhone && isTxt )){
      return false
    }

    return true;

  }

  //TODO: 校验验证码
  verifyTAC() {
    const { verificaType,getCodePhone,getCodeEmail,getCodeVoice, consequence } = this.state;
    console.log('校验验证码',consequence)
    const data = {
      verificationChannel: verificaType == "phone" ? (consequence == 0 ? "SmsText" :"SmsVoice") : "Email",
      verificationType: "LoginAuthorize",
      otp: this.state.verificationCode,
    };

    if (verificaType == "phone") {
      // if(consequence == 0){
      //   UMonEvent("Verification", "Submit", "Sendcode_SMS_phone_loginOTP");
      // }else{
      //   UMonEvent("Verification", "Submit", "Sendcode_Voice_phone_loginOTP");
      // }
      UMonEvent("Verification", "Submit", "Verify_phone_loginOTP");
    } else {
      UMonEvent("Verification", "Submit", "Verify_email_loginOTP");
    }

    Toast.loading("โปรดรอสักครู่..", 100);
    fetchRequest(ApiPort.VerifyOtpVerificationCode, "POST", data)
      .then((res) => {
        Toast.hide();
        if (res) {
          console.log(1616, res);
          if (!res.isSuccess) {
            if (res.remainingAttempts == 0) {
              this.props.updateVerifyLimitReached(true);
              return;
            }
            console.log(res.remainingAttempts);
            const re = /[0-9]/g;
            const temp =
              ((res.remainingAttempts === 0 || res.remainingAttempts) &&
                re.exec(res.remainingAttempts)[0]) ||
              5;
            console.log(temp,'getCodePhone',getCodePhone);
            // this.props.updateVerifyTimes(5);
            if (res.remainingAttempts !== -1) {
              this.props.updateVerifyTimes(temp);
            }

            this.setState({ 
              toastErrorFlag: true, 
              toastMsg: res.message,
            },()=>{
              setTimeout(() => {
                this.setState({ toastErrorFlag: false });
                this.clearCode();
              }, 3000);
            });            
            // Toasts.failV3(res.message, 2);
            // this.clearCode();
          } else {
            this.setState({ 
              toastSuccessFlag: true, 
            },()=>{
              setTimeout(() => {
                this.setState({ toastSuccessFlag: false });
              }, 3000);
            });            
            // Toasts.successV3("验证成功", 2);

            clearInterval(this.CountdownEmails);
            clearInterval(this.CountdownVoice);
            clearInterval(this.CountdownPhones);

            //验证成功跳转
            setTimeout(() => {
              let username = this.props.loginName;
              let password = this.props.password;
              this.props.login({ username, password });
            }, 2000);
          }
        } else {
          Toasts.failV3("验证服务异常，请稍后再试", 2);
        }
      })
      .catch((err) => {
        Toasts.failV3("验证服务异常，请稍后再试", 2);
      });
  }

  //发送验证码
  sendVerfication(type) {
    console.log('发送login验证码===========',type)
    const { verificaType,codeAgainPhone,codeAgainEmail, sms, voice, consequence  } = this.state;
    
    this.setState({
      consequence:type
    })

    const data = {
      verificationType: "LoginAuthorize",
      verificationChannel: verificaType == "phone" ? (type == 0 ? "SmsText" :"SmsVoice") : "Email",
    };

    if (verificaType == "phone") {
      if(type == 0){
        UMonEvent("Verification", "Click", "Sendcode_SMS_phone_loginOTP");
      }else{
        UMonEvent("Verification", "Click", "Sendcode_Voice_phone_loginOTP");
      }
      // if(codeAgainPhone){
      //   if(type == 0){
      //     UMonEvent("Verification", "Click", "Resendcode_SMS_phone_loginOTP");
      //   }else{
      //     UMonEvent("Verification", "Click", "Resendcode_Voice_phone_loginOTP");
      //   }
      // }else{
      //   if(type == 0){
      //     UMonEvent("Verification", "Click", "Sendcode_SMS_phone_loginOTP");
      //   }else{
      //     UMonEvent("Verification", "Click", "Sendcode_Voice_phone_loginOTP");
      //   }
      // }      
    } else {
      UMonEvent("Verification", "Click", "Sendcode_email_loginOTP");
      // if(codeAgainEmail){
      //   UMonEvent("Verification", "Click", "Resendcode_email_loginOTP");
      // }else{
      //   UMonEvent("Verification", "Click", "Sendcode_email_loginOTP");
      // }
    }

    Toast.loading("โปรดรอสักครู่..", 100);
    fetchRequest(ApiPort.GetOtpVerificationCode, "POST", data)
      .then((res) => {
        console.log(666, res);
        console.log('发送中 type=======',type)
        Toast.hide();
        this.clearCode();
        if (!res.isSuccess) {
          // 发送异常
          this.setState({ 
            toastErrorFlag: true, 
            toastMsg: res.message,
          },()=>{
            setTimeout(() => {
              this.setState({ toastErrorFlag: false });
              this.clearCode();
            }, 3000);
          }); 
          // this.setState({ toastErrorFlag: true, toastMsg: res.message });
          // setTimeout(() => {
          //   this.setState({ toastErrorFlag: false });
          // }, 3000);
          // Toasts.failV3(res.message, 2);
        } else {
          this.props.updateSendTimes(res.remainingAttempts);
          if (verificaType == "phone") {
            this.setState({ 
              showCanChage:true,
            },()=>{
              if(type == 0) {
                this.setState({ voice, isTxt:true , isVoice:false })
                var threeMinutesLater = new Date();
                threeMinutesLater.setMinutes(threeMinutesLater.getMinutes() + 3);
                global.storage.save({
                  key: "VerifyPhone",
                  id: "VerifyPhone",
                  data: threeMinutesLater.getTime(),
                  expires: null,
                });
                this.TimeDownPhone();
              } else {
                this.setState({ sms, isVoice:true , isTxt:false })
                var threeMinutesLater = new Date();
                threeMinutesLater.setMinutes(threeMinutesLater.getMinutes() + 3);
                global.storage.save({
                  key: "VerifyVoice",
                  id: "VerifyVoice",
                  data: threeMinutesLater.getTime(),
                  expires: null,
                });
                this.TimeDownVoice();                
              }
            })

            
          } else {
            this.setState({ 
              showCanChage:true,
            },()=>{
              var threeMinutesLater = new Date();
              threeMinutesLater.setMinutes(threeMinutesLater.getMinutes() + 10);
              global.storage.save({
                key: "VerifyEmail",
                id: "VerifyEmail",
                data: threeMinutesLater.getTime(),
                expires: null,
              });
              this.TimeDownEmail();
            })
            
          }
          this.setState({ 
            toastSendFlag: true, 
            toastMsg: res.message, 
          });
          setTimeout(() => {
            this.setState({ toastSendFlag: false });
          }, 3000);
          
          // Toasts.successV3("发送成功", 2);
          Toasts.successV3(res.message, 2);
        }
      })
      .catch((err) => {
        Toasts.failV3("服务异常，请稍后再试", 2);
      });
  }

  // 取得另一個驗證方式的文字
  getAnotherText = (type, attr) => {
    if (type && attr) {
      let anotherType = type === "phone" ? "email" : "phone";
      return `${verificationType[anotherType][attr]}`;
    } else {
      console.log("缺少參數");
    }
  };

  goFail(){
    Actions.VerifyFail()
  }

  goLiveChat = () => {
    UMonEvent("CS", "Click", "CS_loginOTP");
    //navigateToSceneGlobe();
    setTimeout(() => {
      Actions.LiveChatST();
    }, 200);
  };

  render() {
    console.log("SmsSendTime", this.props.SmsSendTime);
    const {
      errCode,
      codeAgainPhone,
      codeAgainEmail,
      getCodePhone,
      getCodeEmail,
      verificaType,
      CountdownPhone_minutes,
      CountdownEmail_minutes,
      CountdownVoice_minutes,
      toastMsg,
      toastErrorFlag,
      toastSuccessFlag,
      toastSendFlag,
      getCodeVoice,
      codeAgainVoice,
      sms,
      voice,
      isTxt,
      isVoice,
      
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#000000" }}>
        {this.props.verifyLimitReached && this.goFail()}
        {!this.props.verifyLimitReached && (
          <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          {/* <Taost1
            toastMsg={toastMsg}
            toastErrorFlag={toastErrorFlag}
            toastSuccessFlag={toastSuccessFlag}
          ></Taost1> */}
          <Modal
              animationType='none'
              transparent={true}
              visible={toastErrorFlag} 
              //visible
              onRequestClose={() => { }}                
          >
              {/* <View style={{ zIndex: 10000, width:300, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:400, left:Platform.OS === "android"?63>50:50}}> */}
              <View style={{ zIndex: 10000, width:300, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:400, left:Platform.OS === "android"?38:50}}>   
                  {/* OTP 有誤 || OTP 過期 */}
                  <Image
                      resizeMode="stretch"
                      source={require("../../images/icon-check-f.png")}
                      style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: '#333333', paddingLeft: 10 }}>{toastMsg}</Text>
              </View>
          </Modal>
          <Modal
              animationType='none'
              transparent={true}
              visible={toastSuccessFlag} 
              //visible
              onRequestClose={() => { }}                
          >
              <View style={{ zIndex: 10000, width:174, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:400, left:Platform.OS === "android"?120:100}}>
                  {/* 驗證成功 */}
                  <Image
                      resizeMode="stretch"
                      source={require("../../images/icon-check-g.png")}
                      style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: '#333333', paddingLeft: 5 }}>ยืนยันสำเร็จ</Text>
              </View>
          </Modal>
          <Modal
              animationType='none'
              transparent={true}
              visible={toastSendFlag} 
              //visible
              onRequestClose={() => { }}                
          >
              <View style={{ zIndex: 10000, width:174, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:400, left:Platform.OS === "android"?120:100}}>
                  {/* 發送成功 */}
                  <Image
                      resizeMode="stretch"
                      source={require("../../images/icon-check-g.png")}
                      style={{ width: 25, height: 25 }}
                  />
                  <Text style={{ color: '#333333', paddingLeft: 5 }}>{toastMsg}</Text>
              </View>
          </Modal>
          <View
              style={{
                backgroundColor:"#222222",
                paddingVertical: 20,
                paddingHorizontal: 16,
                marginTop: 20,
              }}
            >
              <View style={{ flexDirection:"row" }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#333333",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    borderRadius: 4,
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                  }}
                >
                  <Text style={{ color: "#CCCCCC", fontSize: 14 }}>
                    {this.state.phoneOrEmail}
                  </Text>
                </View>

                {verificaType == "email" && (
                  <View
                    style={{
                      marginLeft: 10,
                      width: 112,
                      height: 40,
                      backgroundColor: getCodeEmail ? "#00B324" : "#666666",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      // marginTop:20
                    }}
                  >
                    {getCodeEmail && (
                      <Touch
                        style={{
                          width: 112,
                          height: 40,
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          console.log(12121244444);
                          this.sendVerfication();
                        }}
                      >
                        <Text
                          style={{
                            color: "#F5F5F5",
                            fontSize: 14,
                            //fontWeight:"bold",
                            textAlign: "center",
                          }}
                        >
                          {/* {codeAgainEmail ? "重发验证码" : "发送验证码"} */}
                          {codeAgainEmail ? "ส่งรหัสอีกครั้ง" : "ส่งรหัส"}
                        </Text>
                      </Touch>
                    )}
                    {!getCodeEmail && (
                      <Text
                        style={{
                          color: "#F5F5F5",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        ส่งรหัสอีกครั้ง{'\n'}{CountdownEmail_minutes} นาที
                      </Text>
                    )}
                  </View>
                )}
                {verificaType == "phone" && isTxt &&(
                  <View
                    style={{
                      marginLeft: 10,
                      width: 112,
                      height: 40,
                      backgroundColor:getCodePhone && isTxt ? "#00B324": getCodePhone? "#00B324":"#666666",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                      //marginTop:20
                    }}
                  >
                    {getCodePhone && (
                      <Touch
                        style={{
                          width: 112,
                          height: 40,
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.sendVerfication(0);
                        }}
                      >
                        <Text
                          style={{
                            color: "#F5F5F5",
                            fontSize: 14,
                            //fontWeight:"bold",
                            textAlign: "center",
                          }}
                        >
                          {/* {codeAgainPhone ? "重发验证码" : "通過短信發送代碼"} */}
                          {codeAgainPhone ? "ส่งรหัสอีกครั้ง" : "ส่งรหัส"}
                        </Text>
                      </Touch>
                    )}
                    {!getCodePhone && (
                      <Text
                        style={{
                          color: "#F5F5F5",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        ส่งรหัสอีกครั้ง{'\n'}{CountdownPhone_minutes} นาที
                      </Text>
                    )}
                  </View>
                )}
                {verificaType == "phone" && isVoice &&(
                  <View
                    style={{
                      marginLeft: 10,
                      // marginTop: 20,
                      width: 112,
                      height: 40,
                      backgroundColor: getCodeVoice && isVoice ?"#00B324":getCodeVoice?"#00B324":"#666666",
                      borderColor: getCodeVoice && isVoice ?"#00B324":getCodeVoice?"#00B324":"#666666",
                      borderWidth:1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 4,
                    }}
                  >
                 
                    {getCodeVoice && (
                      <Touch
                        style={{
                          width: 112,
                          height: 40,
                          justifyContent: "center",
                        }}
                        onPress={() => {
                          this.sendVerfication(1);
                        }}
                      >
                        <Text
                          style={{
                            color: getCodeVoice && isVoice ?"#F5F5F5":getCodeVoice?"#00B324":"#666666",
                            fontSize: 14,
                            //fontWeight:"bold",
                            textAlign: "center",
                          }}
                        >
                          {/* {codeAgainPhone ? "重发验证码" : "通過電話發送代碼"} */}
                          {codeAgainVoice ? "โทรอีกครั้ง​" : "โทรขอรหัส"}
                        </Text>
                      </Touch>
                    )}
                    {!getCodeVoice && (
                      <Text
                        style={{
                          color: "#F5F5F5",
                          fontSize: 12,
                          textAlign: "center",
                        }}
                      >
                        โทรอีกครั้ง{'\n'}{CountdownVoice_minutes} นาที
                      </Text>
                    )}
                  </View>
                )}
                
              </View>

              <View
                style={{
                  width:width-50,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  //marginTop: 15,
                }}
              >
                <Image
                    resizeMode="stretch"
                    source={require("../../images/warnS.png")}
                    style={{ width: 16, height: 16, marginRight: 10 }}
                  />
                <Text
                  style={{
                    color: "#CCCCCC",
                    fontSize:12,
                    //textAlign: "center",
                    marginTop: Platform.OS === "android"?10:16,
                    lineHeight: 16,
                  }}
                >
                  กรุณาติดต่อ <Text style={{ color:"#00B324" }} onPress={() => {this.goLiveChat();}}>เจ้าหน้าที่ฝ่ายบริการ</Text> หากคุณต้องการเปลี่ยนแปลง {verificationType[this.props.verificaType].txt1}
                  {/* 如果您想更新您的{verificationType[this.props.verificaType].txt1}，請聯繫客戶服務*/}

                </Text>
              </View>


            </View>

            <View
              style={{
                backgroundColor: "#222222",
                paddingVertical: 20,
                paddingHorizontal: 16,
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 13,
                  //fontWeight:"bold",
                  //marginBottom: 20,
                }}
              >
                {/* 您{verificationType[verificaType].txt1}收到的验证码 */}
                กรุณากรอกรหัส {verificationType[verificaType].txt6}
              </Text>

              <Text
                style={{
                  color: "#999999",
                  textAlign: "center",
                  fontSize: 12,
                  marginTop:10,
                  marginBottom: 15,
                }}
              >
                {/* 您还有 */}
                คุณยังสามารถยืนยันข้อมูลได้อีก <Text style={{ color: "#FF2D12" }}>({this.props.verifyTimes})</Text>{/* 次尝试机会 */} ครั้ง
              </Text>

              <VerificationCodeInput
                key={errCode}
                inputSize={6} //默认value是 6
                TextInputChange={(value) => {
                  this.checked(value);
                }}
              />

              <Text
                style={{
                  marginLeft:10,
                  width:width-50,
                  color: "#CCCCCC",
                  textAlign: "center",
                  fontSize: 12,
                  marginBottom: 15,
                  marginTop: 30,
                  lineHeight: 18,
                }}
              >
                {verificaType == "email"
                  //? "หมายเหตุ: กรุณาตรวจสอบอีเมลขยะก่อนทำการส่งใหม่ หากคุณไม่ได้รับรหัสภายใน 10 นาทีโปรดคลิกที่ “ส่งรหัส” เพื่อรับรหัสใหม่"
                  ? "หมายเหตุ: กรุณาตรวจสอบอีเมลขยะก่อนทำการส่งใหม่ หากคุณไม่ได้รับรหัสภายใน 10 นาทีโปรดคลิกที่ “ส่งรหัสอีกครั้ง” เพื่อรับรหัสใหม่"
                  : <Text>หมายเหตุ: หากคุณไม่ได้รับรหัส OTP ภายใน 3 นาที{'\n'}กรุณาคลิกที่{!isVoice ? <Text> “ส่งรหัสอีกครั้ง”</Text>:<Text>“โทรอีกครั้ง”</Text>}เพื่อรับรหัส OTP ใหม่</Text>}
                {/* 如果您 {verificaType == "email" ? "10" : "3"}{" "}
                分钟内没有收到验证码，请点击“重发验证码”以获取新的验证码 */}
              </Text>

              {verificaType == "phone" && <View
                style={{ width: "100%", height: 1, backgroundColor: "#3D3D3D" }}
              />}

              {verificaType == "phone" &&<Touch
                style={this.canSubmit() ? styles.addBtn : styles.addBtnAgain}
                onPress={() => {
                  this.submitBtn();
                }}
              >
                <Text
                  style={{
                    color: !this.canSubmit() ? "#CCCCCC":"#F5F5F5",
                    textAlign: "center",
                    paddingVertical: 10,
                    fontSize: 16,
                    //fontWeight:"bold",
                  }}
                >
                  {/* 立即驗證 */}
                  ทำการยืนยันตอนนี้
                </Text>
              </Touch>}

              {verificaType == "phone" && <View>
              {this.canSwitch()?
              (isTxt?
                <Touch
                  style={(!getCodeVoice && isVoice || !getCodePhone && isTxt )? styles.addBtnNotChange : styles.addBtnCanChange }
                  onPress={ ()=>{
                    this.sendVerfication(1)
                  }}
                >
                <Text
                  style={{
                    color: (!getCodeVoice && isVoice || !getCodePhone && isTxt ) ? "#757575" : "#00B324",
                    textAlign: "center",
                    paddingVertical: 13,
                    fontSize: 16,
                  }}
                >
                  {/* 改>>通過電話發送代碼 */}
                  { sms.txt1 }
                
                </Text>
                </Touch>:
                <Touch
                  style={(!getCodeVoice && isVoice || !getCodePhone && isTxt )? styles.addBtnNotChange : styles.addBtnCanChange }
                  onPress={ ()=>{
                    this.sendVerfication(0)
                  }}
                >
                <Text
                  style={{
                    color: (!getCodeVoice && isVoice || !getCodePhone && isTxt ) ? "#757575" : "#00B324",
                    textAlign: "center",
                    paddingVertical: 13,
                    fontSize: 16,
                  }}
                >
                  {/* 改>>通過電話發送代碼 */}
                
                  { voice.txt1}
                </Text>
                </Touch>)
              :(isTxt?
                <Touch
                  style={(!getCodeVoice && isVoice || !getCodePhone && isTxt )? styles.addBtnNotChange : styles.addBtnCanChange }
                >
                <Text
                  style={{
                    color: (!getCodeVoice && isVoice || !getCodePhone && isTxt ) ? "#757575" : "#00B324",
                    textAlign: "center",
                    paddingVertical: 13,
                    fontSize: 16,
                  }}
                >
                  {/* 改>>通過電話發送代碼 */}
                  { sms.txt1 }
                </Text>
                </Touch>:
                <Touch
                  style={(!getCodeVoice && isVoice || !getCodePhone && isTxt )? styles.addBtnNotChange : styles.addBtnCanChange }
                >
                <Text
                  style={{
                    color: (!getCodeVoice && isVoice || !getCodePhone && isTxt ) ? "#757575" : "#00B324",
                    textAlign: "center",
                    paddingVertical: 13,
                    fontSize: 16,
                  }}
                >
                  {/* 改>>通過簡訊發送代碼 */}
                  { voice.txt1}
                </Text>
                </Touch>)}
              </View>}

              {verificaType == "email" &&<Touch
                style={this.canSubmit() ? styles.addBtn : styles.addBtnAgain}
                onPress={() => {
                  this.submitBtn();
                }}
              >
                <Text
                  style={{
                    color: !this.canSubmit() ? "#CCCCCC":"#F5F5F5",
                    textAlign: "center",
                    paddingVertical: 15,
                    fontSize: 16,
                    //fontWeight:"bold",
                  }}
                >
                  {/* 立即驗證 */}
                  ทำการยืนยันตอนนี้
                </Text>
              </Touch>}

              <Touch
                style={{
                  marginTop: 20,
                }}
                onPress={() => {
                  UMonEvent(
                    `Change_${this.getAnotherText(
                      verificaType,
                      "txt1en"
                    )}_loginOTP`
                  );
                  this.changType();
                }}
              >
                <Text
                  style={{
                    color: "#00B324",
                    textAlign: "center",
                    paddingVertical: 13,
                    fontSize: 16,
                  }}
                >
                  {/* 更换验证方式 */}
                  เปลี่ยนวิธีการยืนยันข้อมูล
                </Text>
              </Touch>
        
            </View>
        </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  login: (loginDetails) => {
    login(dispatch, loginDetails);
  },
  logout: (loginDetails) => {
    logout(dispatch, loginDetails);
  },
});
/**
 * deliberately not using mapDispatchToProps
 * notice how `logout` is being used
 */
export default connect(mapStateToProps, mapDispatchToProps)(OtpVerification);

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: "#00B324",
    marginHorizontal: 0,
    borderRadius: 4,
    marginTop: 20,
  },
  addBtnAgain: {
    backgroundColor: "#666666",
    marginHorizontal: 0,
    borderRadius: 4,
    marginTop: 20,
  },
  addBtnCanChange: {
    //backgroundColor: "#222222",
    color: "#00B324",
    borderWidth:1,
    borderColor:"#00B324",
    marginHorizontal: 0,
    borderRadius: 4,
    marginTop: 20,
    marginBottom:5,
  },
  addBtnNotChange: {
    //backgroundColor: "#222222",
    borderWidth:1,
    borderColor:"#757575",
    marginHorizontal: 0,
    borderRadius: 4,
    marginTop: 20,
    marginBottom:5,
  },
});
