/**
 * 人脸样本采集封装（百度AI-SDK）
 */
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  NativeModules,
  NativeEventEmitter,
  ScrollView,
  Platform,
  TextInput,
  Dimensions,
  Modal
} from "react-native";
import { Toast } from "antd-mobile-rn";
import { connect } from "react-redux";
import { login } from "../../actions/AuthAction";

import FingerprintScanner from "react-native-fingerprint-scanner";
import Touch from "react-native-touch-once";
import { passwordRegLogin } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";

const { width, height } = Dimensions.get("window");
class LoginTouch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      passwordValue: "",
      validation: "",
      errorMessage: "",
      validationActive: ""
    };
  }

  componentDidMount() {
    // console.log("faceRecogition");
    FingerprintScanner.isSensorAvailable()
      .then(() => {
        // this.setState({popupShowed: true})
      })
      .catch(error => {
        if (Platform.OS == "ios") {
          this.errorMessageIos(error.name);
        } else {
          this.errorMessage(error.name);
        }
      });
      if (DeviceInfoIos) {
        this.props.navigation.setParams({
          title:'จดจำใบหน้า'
          //title: "脸部辨识认证"
        });
      }
  }
  componentWillUnmount() {
    Platform.OS == "android" && FingerprintScanner.release();
  }
  //ios使用，锁屏后重启app；
  errorMessageIos(err) {
    
    let message = "";
    const iphoneX = DeviceInfoIos;
    switch (err) {
      case "PasscodeNotSet":
        //手机没有设置密码
        message = "คุณยังไม่ได้ตั้งรหัสผ่าน";
        break;
      case "FingerprintScannerNotAvailable":
        //无法使用指纹功能
        message =
        (iphoneX && "เข้าสู่ระบบด้วยการจดจำใบหน้าไม่สามารถใช้งานได้ โทรศัพท์ของคุณไม่มีฟังก์ชั่นนี้") ||
          "เข้าสู่ระบบด้วยการจดจำลายนิ้วมือไม่สามารถใช้งานได้ โทรศัพท์ของคุณไม่มีฟังก์ชั่นนี้";
          // (iphoneX && "脸部登入无法启动，此手机没有脸部识别功能") ||
          // "指纹登入无法启动，此手机没有指纹识别功能";
        break;
      case "FingerprintScannerNotEnrolled":
        //手机没有预先设置指纹
        message = 
        (iphoneX && "ไม่สามารถเข้าสู่ระบบโดยการจดจำใบหน้าได้ เนื่องจากยังไม่ได้ตั้งค่าบนโทรศัพท์ของคุณ") ||
          "ไม่สามารถเข้าสู่ระบบโดยการจดจำลายนิ้วได้ เนื่องจากไม่ได้ตั้งค่าบนโทรศัพท์ของคุณ";
          // (iphoneX && "脸部登入无法启动，您手机内还未设置脸部识别") ||
          // "指纹登入无法启动，您手机内还未设置指纹识别";
        break;
      case "FingerprintScannerUnknownError": 
        message = "มีข้อผิดพลาดในการยืนยันหลายครั้งโปรดเข้าสู่ระบบด้วยรหัสผ่าน";
      //message = "验证错误次数过多，请使用密码登录";
        break;

      default:
        message = "มีข้อผิดพลาดในการยืนยันหลายครั้งโปรดเข้าสู่ระบบด้วยรหัสผ่าน";
      //message = "验证错误次数过多，请使用密码登录";
        break;
    }
    Toast.info(message, 2);
    Actions.pop()
  }
  //指纹验证错误提示
  errorMessage(err, key) {
    let message = "";
    const iphoneX = DeviceInfoIos;
    //iphonex没有指纹识别，提示语不同
    switch (err) {
      case "AuthenticationNotMatch":
        //不匹配
        message = (iphoneX && "ล็อคอินเข้าสู่ระบบโดยการจดจำใบหน้าล้มเหลว") || "การตรวจจับลายนิ้วล้มเหลว";
       // message = (iphoneX && "脸部识别匹配失败") || "指纹匹配失败";
        break;
      case "AuthenticationFailed":
        //指纹不匹配
        message = (iphoneX && "ล็อคอินเข้าสู่ระบบโดยการจดจำใบหน้าล้มเหลว") || "การตรวจจับลายนิ้วล้มเหลว";
       // message = (iphoneX && "脸部识别匹配失败") || "指纹匹配失败";
        break;
      case "UserCancel":
        //点击取消 
        message = "คุณได้ยกเลิกการยืนยัน";
      //  message = "您已取消验证";
        break;
      case "UserFallback":
        //点击输入密码
        message = "คุณได้ยกเลิกการยืนยัน ";
        // message = "您已取消验证 ";
        break;
      case "SystemCancel":
        //进入后台
        message = "ระบบยกเลิกการยืนยันแล้ว";
        // message = "系统已取消验证";
        break;
      case "PasscodeNotSet":
        //手机没有设置密码
        message = "คุณยังไม่ได้ตั้งรหัสผ่าน";
        // message = "您还未设置密码";
        break;
      case "FingerprintScannerNotAvailable":
        //无法使用指纹功能
        message =
        (iphoneX && "เข้าสู่ระบบด้วยการจดจำใบหน้าไม่สามารถใช้งานได้ โทรศัพท์ของคุณไม่มีฟังก์ชั่นนี้") ||
        "เข้าสู่ระบบด้วยการจดจำลายนิ้วมือไม่สามารถใช้งานได้ โทรศัพท์ของคุณไม่มีฟังก์ชั่นนี้";
        // (iphoneX && "脸部登入无法启动，此手机没有脸部识别功能") ||
          // "指纹登入无法启动，此手机没有指纹识别功能";
        break;
      case "FingerprintScannerNotEnrolled":
        //手机没有预先设置指纹
        message = 
        (iphoneX && "ไม่สามารถเข้าสู่ระบบโดยการจดจำใบหน้าได้ เนื่องจากยังไม่ได้ตั้งค่าบนโทรศัพท์ของคุณ") ||
        "ไม่สามารถเข้าสู่ระบบโดยการจดจำลายนิ้วได้ เนื่องจากไม่ได้ตั้งค่าบนโทรศัพท์ของคุณ";
          // (iphoneX && "脸部登入无法启动，您手机内还未设置脸部识别") ||
          // "指纹登入无法启动，您手机内还未设置指纹识别";
        break;
      case "FingerprintScannerUnknownError":
        if (Platform.OS === "ios") {
          //ios错误四次提示,锁屏后重启app；
          message = "มีข้อผิดพลาดในการยืนยันหลายครั้งโปรดเข้าสู่ระบบด้วยรหัสผ่าน";
          //message = "验证错误次数过多，请使用密码登录";
          setTimeout(() => {
            Actions.pop();
          }, 2000);
          return;
        }
        break;
      case "FingerprintScannerNotSupported":
        //设备不支持
        message =
        (iphoneX && "ไม่สามารถเข้าสู่ระบบโดยการจดจำใบหน้าได้ เนื่องจากยังไม่ได้ตั้งค่าบนโทรศัพท์ของคุณ") ||
        "โทรศัพท์ของคุณไม่รองรับการจดจำลายนิ้วมือ";
          // (iphoneX && "脸部登入无法启动，您手机内还未设置脸部识别") ||
          // "此手机不支持指纹识别";
        break;
      case "DeviceLocked":
        //认证不成功，锁定30秒
        message = iphoneX && 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน' || 'การสแกนลายนิ้วมือถูกปิดใช้งาน กรุณาลองอีกครั้งใน 30 วินาที';
          // (iphoneX && "验证错误次数过多，请使用密码登录") ||
          // "指纹已禁用，请30秒后重试";
        break;

      default:
      //message = iphoneX && '未知原因导致无法使用脸部功能' || '未知原因导致无法使用指纹功能'
      message = iphoneX && 'ไม่สามารถใช้งาน Face ID ได้โดยไม่ทราบสาเหตุ' || 'ไม่สามารถใช้งานการสแกนลายนิ้วมือได้โดยไม่ทราบสาเหตุ' 
        break;
    }
    Toast.info(message, 2);
    Actions.pop();
  }

  handleTextInput(passwordValue) {
    this.setState({ passwordValue });
  }

  okBtn() {
    if (passwordRegLogin.test(this.state.passwordValue) == false) {
    //密码必须包含6-20个字符,字符只限于使用字母和数字(可以包含 ^＃$@ 中的特殊字符)
    Toast.fail("รหัสผ่านจะต้องประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลขอย่างน้อย 6 ถึง 20 ตัวอักษรเท่านั้น (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)", 2);
     
      return;
    }
     //密码验证中,请稍候...
     Toast.loading("ตรวจสอบรหัสผ่าน กรุณารอสักครู่ ...", 200);
    //登录验证密码是否正确
    if (this.props.fastChange) {
      //快捷登录切换
      window.fastChangeLogin &&
        window.fastChangeLogin(
          this.props.username,
          this.state.passwordValue,
          "LoginTouch"
        );
    } else {
      //调用登录页面的快速登录验证方法
      window.fastLogin &&
        window.fastLogin(
          this.props.username,
          this.state.passwordValue,
          "LoginTouch"
        );
    }
  }
  successActive() {
    //快捷登录方式
    let fastLoginKey = "fastLogin" + this.props.username;
    let sfastLoginId = "fastLogin" + this.props.username;
    global.storage.save({
      key: fastLoginKey,
      id: sfastLoginId,
      data: "LoginTouch",
      expires: null
    });
    if (DeviceInfoIos) {
      this.props.navigation.setParams({
        title:'การจดจำใบหน้าเสร็จสมบูรณ์'
        //title: "完成脸部辨识认证"
      });
    }
    this.setState({ validation: "ok" });
    //验证成功跳转
    setTimeout(() => {
      if (!this.props.fastChange) {
        let username = "loginok";
        let password = "loginok";
        this.props.login({ username, password });
      } else {
        window.checkActiveType && window.checkActiveType("LoginTouch");
        Actions.pop();
      }
    }, 2000);
  }

  render() {
    const { validation, passwordValue, validationActive } = this.state;
    const faceRecogition =  (Platform.OS == "ios" && DeviceInfoIos)?true:false
    
    window.touchCheck = key => {
      this.setState({ validationActive: "active" });
    };
    return (
      <View style={styles.pageView}>
        <View>
          {validation == "" && (
            <View style={styles.validation}>
              <Text style={styles.titleTxt}>โปรดใส่รหัสเพื่อเปิดใช้</Text>
              {/* <Text style={styles.titleTxt}>请输入您的密码确认启用</Text> */}
              <Image
                resizeMode="stretch"
                source={
                  faceRecogition
                    ? require("../../images/login/faceRecogition.png")
                    : require("../../images/login/fingerprintScanNo.png")
                }
                style={{ width: 75, height: faceRecogition ? 100 : 59 }}
              />
              <Text style={styles.username}>{this.props.username}</Text>
              <View style={styles.passInput}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/icon-password.png")}
                  style={Platform.OS=="ios"? styles.passIconIos:styles.passIconAndroid}
                />
                <TextInput
                  style={styles.passTextInput}
                  value={passwordValue}
                  placeholderTextColor="#999999"
                  placeholder="รหัสผ่าน"//"密码"
                  secureTextEntry={true}
                  onChangeText={value => this.handleTextInput(value)}
                />
              </View>
              <View>
                <Touch
                  onPress={() => {
                    this.okBtn();
                  }}
                >
                  <View style={styles.onBtn}>
                       {/*确认*/}
                       <Text style={styles.okBtnTxt}>ยืนยัน</Text>
                  </View>
                </Touch>
              </View>
              {validationActive === "active" && Platform.OS == "ios" && (
                <FingerprintPopupIOS
                  errCallback={err => {
                    this.errorMessage(err);
                  }}
                  successCallback={() => {
                    this.successActive();
                  }}
                />
              )}
              {validationActive === "active" && Platform.OS == "android" && (
                <FingerprintPopupAndroid
                  errCallback={err => {
                    this.errorMessage(err);
                  }}
                  successCallback={() => {
                    this.successActive();
                  }}
                />
              )}
            </View>
          )}
          {validation == "ok" && (
            <View style={styles.validation}> 
                {/* '设定成功' || '系统已记忆您的指纹，让你每次可快速登录' */}
                <Text style={styles.titleTxt}>{DeviceInfoIos && 'การตั้งค่าสำเร็จ' || 'คุณมีการยืนยันลายนิ้วมือแล้ว สามารถเข้าสู่ระบบด้วยลายนิ้วมือ'}</Text>
             
              <View style={{ marginLeft: 22 }}>
                <Image
                  resizeMode="stretch"
                  source={
                    DeviceInfoIos
                      ? require("../../images/login/facegrop.png")
                      : require("../../images/login/fingerprintScanOK.png")
                  }
                  style={{ width: 80, height: 63 }}
                />
              </View>
              <Text style={styles.username}>{this.props.username}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  login: loginDetails => {
    login(dispatch, loginDetails);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginTouch);

export class FingerprintPopupIOS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    FingerprintScanner.authenticate({
      description: "แจ้งเตือน กรุณาใช้การสแกนลายนิ้ว",//"温馨提示，使用指纹识别",
      fallbackEnabled: false
    })
      .then(() => {
        this.props.successCallback();
      })
      .catch(error => {
        this.props.errCallback(error.name);
      });
  }

  render() {
    return false;
  }
}
export class FingerprintPopupAndroid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
      errorMessage: ""
    };
  }

  componentDidMount() {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttempted
    })
      .then(() => {
        this.props.successCallback();
      })
      .catch(error => {
        // this.props.errCallback(error.name);
        this.errorMessage(error.name);
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  //验证失败
  handleAuthenticationAttempted = error => {
    this.errorMessage(error.name);
  };
 //指纹验证错误提示
 errorMessage(err) {
  let message = '';
  switch (err) {
    case 'AuthenticationNotMatch':
      //不匹配
      //message = '指纹匹配失败';
      message = 'การสแกนลายนิ้วมือไม่ตรงกัน';
      break;
    case 'AuthenticationFailed':
      //指纹不匹配
      //message = '指纹匹配失败';
      message = 'การสแกนลายนิ้วมือไม่สำเร็จ';
      break;
    case 'UserCancel':
      //点击取消
      //message = '您已取消验证';
      message = 'คุณได้ยกเลิกการยืนยัน';
      break;
    case 'UserFallback':
      //点击输入密码
      //message = '您已取消验证 ';
      message = 'คุณได้ยกเลิกการยืนยัน ';
      break;
    case 'SystemCancel':
      //进入后台
      //message = '系统已取消验证';
      message = 'ยกเลิกการยืนยัน';
      break;
    case 'PasscodeNotSet':
      //手机没有设置密码
      //message = '您还未设置密码';
      message = 'โทรศัพท์ของคุณยังไม่มีการตั้งรหัสผ่าน';
      break;
    case 'FingerprintScannerNotAvailable':
      //无法使用指纹功能
      //message = '指纹登入无法启动，此手机没有指纹识别功能';
      message = 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
      break;
    case 'FingerprintScannerNotEnrolled':
      //手机没有预先设置指纹
      //message = '指纹登入无法启动，您手机内还未设置指纹';
      message = 'ไม่สามารถเปิดใช้งานการเข้าสู่ระบบด้วยการสแกนลายนิ้วมือได้ และยังไม่มีการตั้งค่าการสแกนลายนิ้วมือในโทรศัพท์ของคุณ';
      break;
    case 'FingerprintScannerUnknownError':
      if (Platform.OS === 'ios') {
        //ios错误四次提示,锁屏后重启app；
        //message = '验证错误次数过多，请使用密码登录';
        message = 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน';
        setTimeout(() => {
          Actions.pop()
        }, 2000);
        return;
      }
      break;
    case 'FingerprintScannerNotSupported':
      //设备不支持
      //message = '此手机不支持指纹识别';
      message = 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
      break;
    case 'DeviceLocked':
      //认证不成功，锁定30秒
      //message = '指纹已禁用，请30秒后重试';
      message = 'การสแกนลายนิ้วมือถูกปิดใช้งาน กรุณาลองอีกครั้งใน 30 วินาที';
      setTimeout(() => {
        Actions.pop()
      }, 2000);
      break;

    default:
      //message = '未知原因导致无法使用指纹功能'
      message = 'ไม่สามารถใช้งานการสแกนลายนิ้วมือได้โดยไม่ทราบสาเหตุ'
      break;
  }
  this.setState({errorMessage: ''})
  setTimeout(() => {
    this.setState({errorMessage: message})
  }, 1000);
}

  render() {
    return (
      <View>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.active}
          onRequestClose={() => {}}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: width,
              height: height,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
          >
            <View
              style={{
                width: width / 1.1,
                height: height / 3.2,
                backgroundColor: "#fff",
                padding: 15
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontSize: 21,
                  fontWeight: "bold",
                  lineHeight: 40
                }}
              >
                แจ้งเตือย
              </Text>
              <Text style={{ color: "#000", fontSize: 16 }}>ใช้การจดจำลายนิ้วมือ</Text>
              <View
                style={{
                  width: width / 1.2,
                  alignItems: "center",
                  marginBottom: 10
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/GroupRed.png")}
                  style={{ width: 70, height: 70 }}
                />
              </View>
              <Text style={{ color: "red", fontSize: 15, textAlign: "center" }}>
                {this.state.errorMessage || ""}
              </Text>
              <Text
                style={{
                  color: "#007AFF",
                  fontSize: 20,
                  textAlign: "right",
                  marginTop: 10
                }}
                onPress={() => {
                  this.setState({ active: false });
                }}
              >
                ยกเลิก
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
