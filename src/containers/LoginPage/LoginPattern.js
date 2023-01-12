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

import PasswordGesture from "../../gesturePassword/index";

import Touch from "react-native-touch-once";
import { passwordRegLogin } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { login } from "../../actions/AuthAction";

const { width, height } = Dimensions.get("window");
class LoginPattern extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      passwordValue: "",
      validation: "",
      message: "การตั้งค่ารหัสแพทเทิร์นนี้สำหรับเข้าสู่ระบบแบบรวดเร็ว \n กรุณาลากรหัสตั้งแต่ 4-9 หลัก",//"此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点",
      status: "normal",
      timeOut: 300,
      beforPassword: "" //首次图形密码
    };
  }

  handleTextInput(passwordValue) {
    this.setState({ passwordValue });
  }

  okBtn() {
    if (passwordRegLogin.test(this.state.passwordValue) == false) {
        //密码必须包含6-20个字符,字符只限于使用字母和数字(可以包含 ^＃$@ 中的特殊字符)
        Toast.fail( "รหัสผ่านจะต้องประกอบด้วยตัวอักษรภาษาอังกฤษและตัวเลขอย่างน้อย 6 ถึง 20 ตัวอักษรเท่านั้น (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)",2);
           
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
          "LoginPattern"
        );
    } else {
      //首页快捷登录
      window.fastLogin &&
        window.fastLogin(
          this.props.username,
          this.state.passwordValue,
          "LoginPattern"
        );
    }
  }

  onEnd(password) {
    const { timeOut, beforPassword } = this.state;
    if (beforPassword === "") {
      if (password.length < 4) {
        this.setState({
          status: "wrong"
        });
       //请连续画出四至九个点
       Toast.fail( "กรุณาลากรหัสตั้งแต่ 4-9 หลัก",2);
        return;
      }
      this.setState({ beforPassword: password });
      if (timeOut) {
        this.time = setTimeout(() => {
          this.setState({
            status: "normal",
            message: "กรุณายืนยันรหัสแพทเทิร์นอีกครั้ง"//"请再确认一次图形密码锁"
          });
        }, timeOut);
      }
    } else {
      if (password === beforPassword) {
        this.setState({
          status: "right"
        });
        setTimeout(() => {
          this.setState({ validation: "ok" });
          this.goHome();
        }, 350);
      } else {
        this.setState({
          status: "wrong",
          message: 'รหัสไม่ตรงกัน กรุณาใส่รหัสใหม่อีกครั้ง',
          //message: "密码与第一次输入密码图形不同，请重新输入"
        });
      }
    }
  }

  onStart() {
    this.setState({ status: "normal" });
    if (this.state.beforPassword != "") {
      this.setState({
        message: "กรุณายืนยันรหัสแพทเทิร์นอีกครั้ง"//"请再确认一次图形密码锁"
      });
    }
    if (this.state.timeOut) {
      clearTimeout(this.time);
    }
  }

  //重新输入
  errorBack() {
    this.setState({
      status: "normal",
      beforPassword: "",
      message: "การตั้งค่ารหัสแพทเทิร์นนี้สำหรับเข้าสู่ระบบแบบรวดเร็ว \n กรุณาลากรหัสตั้งแต่ 4-9 หลัก",//"此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点"
    });
  }

  goHome() {
    //保存图形密码
    let storageKey = "patternKey" + this.props.username;
    let storageId = "patternId" + this.props.username;
    global.storage.save({
      key: storageKey,
      id: storageId,
      data: this.state.beforPassword,
      expires: null
    });
    //快捷登录方式
    let fastLoginKey = "fastLogin" + this.props.username;
    let sfastLoginId = "fastLogin" + this.props.username;
    global.storage.save({
      key: fastLoginKey,
      id: sfastLoginId,
      data: "LoginPattern",
      expires: null
    });
    //验证成功跳转
    setTimeout(() => {
      if (!this.props.fastChange) {
        let username = "loginok";
        let password = "loginok";
        this.props.login({ username, password });
      } else {
        window.checkActiveType && window.checkActiveType("LoginPattern");
        Actions.pop();
      }
    }, 2000);
  }

  render() {
    window.patternCheck = key => {
      this.setState({ validation: "active" });
    };
    const { validation, passwordValue, beforPassword } = this.state;
    return validation != "active" ? (
      <View style={styles.pageView}>
        <View>
          {validation === "" && (
            <View style={styles.validation}> 
                {/*请输入您的密码确认启用*/}
                <Text style={styles.titleTxt}>กรุณาใส่รหัสผ่านเพื่อยืนยันการเปิดใช้งาน</Text> 
              <Image
                resizeMode="stretch"
                source={require("../../images/login/unlock.png")}
                style={{ width: 60, height: 68 }}
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
                  placeholderTextColor="#fff"
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
                    <Text style={styles.okBtnTxt}>ยืนยัน</Text>
                  </View>
                </Touch>
              </View>
            </View>
          )}
          {validation === "ok" && (
            <View style={styles.validation}>
              {/* <Text
                style={styles.titleTxt}
              >{`图形密码设定完成\n下次登录即可使用图形密码`}</Text> */}
                  {/* 图形密码设定完成\n下次登录即可使用图形密码 */}
                  <Text style={styles.titleTxt}>{`รหัสแพทเทิร์นของคุณได้ถูกบันทึกเรียบร้อยแล้ว\nคุณสามารถทำการเข้าระบบได้ทันที`}</Text>
                      
              <View style={{ marginLeft: 15 }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/unlockOK.png")}
                  style={{ width: 80, height: 72 }}
                />
              </View>
              <Text style={styles.username}>{this.props.username}</Text>
            </View>
          )}
        </View>
      </View>
    ) : (
      <PasswordGesture
        ref="pg"
        status={this.state.status}
        message={this.state.message}
        onStart={() => this.onStart()}
        onEnd={password => this.onEnd(password)}
        innerCircle={true}
        outerCircle={true}
        allowCross={true}
        interval={this.state.timeOut}
        normalColor={"#fff"}
        rightColor={"#00B324"}
        wrongColor={"red"}
        textStyle={{ textAlign: "center", lineHeight: 22, color: "#fff" }}
        style={{ backgroundColor: "#0A0A0A" }}
      >
        {beforPassword != "" && (
          <View style={[styles.patternTxt, { top: height / 1.4 }]}>
            <Touch
              onPress={() => {
                this.errorBack();
              }}
            >
              <View style={styles.onBtn}> 
                   {/*重新输入图形密码*/}
                   <Text style={styles.okBtnTxt}>กรุณาใส่รหัสแพทเทิร์นอีกครั้ง</Text>
              </View>
            </Touch>
          </View>
        )}
      </PasswordGesture>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  login: loginDetails => {
    login(dispatch, loginDetails);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPattern);
