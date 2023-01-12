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
  Dimensions
} from "react-native";
import { Toast } from "antd-mobile-rn";

import FingerprintScanner from "react-native-fingerprint-scanner";
import Touch from "react-native-touch-once";
import { passwordReg } from "../../actions/Reg";
import { Actions } from "react-native-router-flux"; 
const { width, height } = Dimensions.get("window");

export default class FastLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkActive: "",
      loginOut: false
    };
  }
  componentDidMount() {
    let fastLoginKey = "fastLogin" + this.props.username;
    let sfastLoginId = "fastLogin" + this.props.username;
    storage
      .load({
        key: fastLoginKey,
        id: sfastLoginId
      })
      .then(data => {
        this.setState({ checkActive: data });
      })
      .catch(err => {});
  }
  checkout(key) {
    if (key == this.state.checkActive) {
      return;
    }
    if (key) {
      Actions[key]({
        username: this.props.username.toLocaleLowerCase(),
        fastChange: true
      });
    } else {
      //关闭快捷登录方式
      let fastLoginKey = "fastLogin" + this.props.username;
      let sfastLoginId = "fastLogin" + this.props.username;
      global.storage.remove({
        key: fastLoginKey,
        id: sfastLoginId
      });
      this.setState({ checkActive: "" });
    }
  }
  //切换登录方式密码验证
  login(username, password, key) {
    // console.log(username, password, key);
    let date = {
      hostName: common_url,
      grantType: "password",
      clientId: "JBO.gb2bc",
      clientSecret: "JBOmuitten",
      username,
      password,
      scope: "Mobile.Service offline_access",
      appId: "net.gb2bc.jbo",
      siteId: Platform.OS === "android" ? 3 : 4,
      e2: E2Backbox || '',
    };
       //密码验证中,请稍候...
       Toast.loading("ตรวจสอบรหัสผ่าน กรุณารอสักครู่ ...", 200);
    fetchRequest(ApiPort.login, "POST", date)
      .then(data => {
        Toast.hide();
        this.setState({ loginOut: true });
        if (data.accessToken) {
          ApiPort.Token =
            data.accessToken.token_type + " " + data.accessToken.access_token; // 寫入用戶token  token要帶Bearer
          ApiPort.ReToken = data.accessToken.refresh_token; // 寫入用戶token  token要帶Bearer
          isGameLock = data.memberInfo.isGameLock; //用戶能不能玩遊戲
          // //console.log(ApiPort.Token)
          memberCode = data.memberInfo.memberCode; //寫入用戶 memberCode
          userName = data.memberInfo.userName;
         // ReloadgetLiveChatX();//客服重新加載
          setTimeout(()=>{
            //追蹤membercode piwik
            PiwikMenberCode(data.memberInfo.memberCode)
            PiwikVersion(JBOVersion)
            },1000)
            
          noFastLogin = false; //用户可以使用快捷登录
          //脸部验证
          key == "LoginFace" && window.faceCheck && window.faceCheck();
          //指纹识别
          key == "LoginTouch" && window.touchCheck && window.touchCheck();
          //九宫格
          key == "LoginPattern" && window.patternCheck && window.patternCheck();
        }
      })
      .catch(() => {
        //密码错误,请重新输入
        Toast.fail("รหัสผ่านไม่ถูกต้อง กรุณาใส่รหัสผ่านอีกครั้ง", 2);
      });
  }

  render() {
    window.fastChangeLogin = (username, password, key) => {
      this.login(username, password, key);
    };
    window.checkActiveType = checkActive => {
      this.setState({ checkActive });
    };
    const { checkActive } = this.state;
    const checkType = (DeviceInfoIos && "LoginTouch") || "LoginFace";
    return (
      <View style={styles.pageView}>
        {/* {Platform.OS == "ios" && (
          <Touch
            onPress={() => {
              this.checkout(checkType);
            }}
          >
            <View style={styles.selectList}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/faceRecogition.png")}
                  style={{ width: 18, height: 24 }}
                />
                <Text style={styles.selectItemText}>使用脸部辨识登录</Text>
              </View>
              {!DeviceInfoIos && (
                <View
                  style={
                    checkActive == "LoginFace"
                      ? styles.checkBoxAcitve
                      : styles.checkBox
                  }
                >
                  {checkActive == "LoginFace" ? (
                    <View style={styles.checkBoxInnerAcitve} />
                  ) : null}
                </View>
              )}
              {DeviceInfoIos && (
                <View
                  style={
                    checkActive == "LoginTouch"
                      ? styles.checkBoxAcitve
                      : styles.checkBox
                  }
                >
                  {checkActive == "LoginTouch" ? (
                    <View style={styles.checkBoxInnerAcitve} />
                  ) : null}
                </View>
              )}
            </View>
          </Touch>
        )} */}
        {/* {((Platform.OS == "ios" && !DeviceInfoIos ) || Platform.OS == "android") ? ( */}
          <Touch
            onPress={() => {
              this.checkout("LoginTouch");
            }}
          >
            <View style={styles.selectList}>
              <View style={{ flexDirection: "row" }}>
                {/* <Image
                  resizeMode="stretch"
                  source={require("../../images/login/fingerprintScanNo.png")}
                  style={{ width: 20, height: 20 }}'ปลดล็อคด้วยการสแกนใบหน้า': 'เปิดการสแกนลายนิ้วมือ
                /> */}
                <Text style={styles.selectItemText}>{DeviceInfoIos? 'ปลดล็อคด้วยการสแกนใบหน้า': 'เปิดการสแกนลายนิ้วมือ'}</Text>
                {/* <Text style={styles.selectItemText}>{DeviceInfoIos? '使用脸部辨识登录': '使用指纹辨识登录'}</Text> */}
              </View>
              <View
                style={
                  checkActive == "LoginTouch"
                    ? styles.checkBoxAcitve
                    : styles.checkBox
                }
              >
                  {checkActive == "LoginTouch" ? (
                    <View style={styles.checkBoxInnerAcitve} />
                  ) : null}
              </View>
            </View>
          </Touch>
        {/* ):null} */}
        {Platform.OS == "android" && (
          <Touch
            onPress={() => {
              this.checkout("LoginPattern");
            }}
          >
            <View style={styles.selectList}>
              <View style={{ flexDirection: "row" }}>
                {/* <Image
                  resizeMode="stretch"
                  source={require("../../images/login/unlock.png")}
                  style={{ width: 20, height: 20 }}
                /> */}
                <Text style={styles.selectItemText}>เปิดการรหัสแพทเทิร์น</Text>
                {/* <Text style={styles.selectItemText}>使用图形密码登录</Text> */}
              </View>
              <View
                style={
                  checkActive == "LoginPattern"
                    ? styles.checkBoxAcitve
                    : styles.checkBox
                }
              >
                  {checkActive == "LoginPattern" ? (
                    <View style={styles.checkBoxInnerAcitve} />
                  ) : null}
              </View>
            </View>
          </Touch>
        )}
        <Touch
          onPress={() => {
            this.checkout("");
          }}
        >
          <View style={styles.selectList}>
            <View style={{ flexDirection: "row" }}>
            <Text style={styles.selectItemText}>ปิดฟังก์ชั่นเข้าสู่ระบบแบบรวดเร็วทั้งหมด</Text>
              {/* <Text style={styles.selectItemText}>关闭所有快速登录功能</Text> */}
            </View>
            <View
              style={
                checkActive == "" ? styles.checkBoxAcitve : styles.checkBox
              }
            >
                  {checkActive == "" ? (
                    <View style={styles.checkBoxInnerAcitve} />
                  ) : null}
            </View>
          </View>
        </Touch>
 

      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageView: {
    backgroundColor: "#0A0A0A",
    flex: 1
  },
  selectList: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingLeft: 25,
    paddingRight: 15,
    flexDirection: "row",
    borderBottomColor: "#757575",
    borderBottomWidth: 1,
    height: 45,
    marginLeft:15,
    width: width-15
  },
  selectItemText: {
    color: "#fff",
    paddingLeft: 15,
    lineHeight: 20
  },
  checkBox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#fff"
  },
  checkBoxAcitve: {
    alignItems: "center",
    justifyContent: "center",
    width: 11,
    height: 11,
    backgroundColor: "#0A0A0A",
    color: "#00E62E",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#00E62E"
  },
  checkBoxInner: {
    width: 3,
    height: 3,
    // borderWidth: 1,
    borderRadius: 3,
    backgroundColor: "#00E62E",
    color: "#00E62E"
  },
  checkBoxInnerAcitve: {
    width: 3,
    height: 3,
    backgroundColor: "#00E62E",
    color: "#00E62E",
    // borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center"
    // borderColor: "#00E62E"
  }
});
