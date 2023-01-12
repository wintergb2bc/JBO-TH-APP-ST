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
import { connect } from "react-redux";
import { login } from "../../actions/AuthAction";
import { Toast } from "antd-mobile-rn";

import Touch from "react-native-touch-once";
import { passwordRegLogin } from "../../actions/Reg";
import styles from "./style";
import { Actions } from "react-native-router-flux";

const FaceCheckHelper = NativeModules.PushFaceViewControllerModule;

const { width, height } = Dimensions.get("window");
class LoginFace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      passwordValue: "",
      validation: ""
    };
  }
  componentDidMount() {
    if (Platform.OS === "ios") {
      const FaceCheckModules = Platform.select({
        android: () => FaceCheckHelper,
        ios: () => NativeModules.RNIOSExportJsToReact
      })();
      const NativeModule = new NativeEventEmitter(FaceCheckModules);
      this.ficeIDListen = NativeModule.addListener("FaceCheckHelper", data =>
        this.faceCheckCallback(data)
      );
    }
    // let storageKey = 'faceKey' + this.props.username;
    // let storageId = 'faceId' + this.props.username
    // global.storage.remove({
    //     key: storageKey,
    //     id: storageId,
    // });
  }
  componentWillUnmount() {
    this.ficeIDListen && this.ficeIDListen.remove();
  }

  handleTextInput(passwordValue) {
    this.setState({ passwordValue });
  }

  okBtn() {
    if (passwordRegLogin.test(this.state.passwordValue) == false) {
      Toast.info("密码格式错误，请您重新输入", 2);
      return;
    }
    Toast.loading("密码验证中,请稍候...", 200);

    //登录验证密码是否正确
    if (this.props.fastChange) {
      //快捷登录切换
      window.fastChangeLogin &&
        window.fastChangeLogin(
          this.props.username,
          this.state.passwordValue,
          "LoginFace"
        );
    } else {
      //调用登录页面的快速登录验证方法
      window.fastLogin &&
        window.fastLogin(
          this.props.username,
          this.state.passwordValue,
          "LoginFace"
        );
    }
  }

  //人脸检查监听
  faceCheckCallback(data) {
    if (data.remindCode == 0) {
      let imgeList = [];
      let imagesName = Object.keys(data.images); // bestImage liveEye liveYaw liveMouth yawRight yawLeft pitchUp pitchDown
      imagesName.map((info, index) => {
        let image = data.images[info];
        if (
          Platform.OS === "ios" &&
          info === "bestImage" &&
          typeof image !== "string"
        ) {
          image = data.images.bestImage[0];
        }
        imgeList.unshift(image);
      });
      //储存用户脸部图
      let facedata = { img: imgeList[0] };
      let storageKey = "faceKey" + this.props.username;
      let storageId = "faceId" + this.props.username;
      global.storage.save({
        key: storageKey,
        id: storageId,
        data: facedata,
        expires: null
      });
      //快捷登录方式
      let fastLoginKey = "fastLogin" + this.props.username;
      let sfastLoginId = "fastLogin" + this.props.username;
      global.storage.save({
        key: fastLoginKey,
        id: sfastLoginId,
        data: "LoginFace",
        expires: null
      });
      this.props.navigation.setParams({
        title:'การจดจำใบหน้าเสร็จสมบูรณ์'
        //title: "完成脸部辨识认证"
      });
      this.setState({ validation: "ok" });
      //验证成功跳转
      setTimeout(() => {
        if (!this.props.fastChange) {
          let username = "loginok";
          let password = "loginok";
          this.props.login({ username, password });
        } else {
          window.checkActiveType && window.checkActiveType("LoginFace");
          Actions.pop();
        }
      }, 2000);
    } else if (data.remindCode == 36) {
      Toast.info("Time Out ,Try Agn", 2);
    }
  }
  //活体验证录入图片
  getImg() {
    let obj = {
      //质量校验设置
      quality: {
        minFaceSize: 200, // 设置最小检测人脸阈值 默认是200
        cropFaceSizeWidth: 400, // 设置截取人脸图片大小 默认是 400
        occluThreshold: 0.5, // 设置人脸遮挡阀值 默认是 0.5
        illumThreshold: 40, // 设置亮度阀值 默认是 40
        blurThreshold: 0.7, // 设置图像模糊阀值 默认是 0.7
        EulurAngleThrPitch: 10, // 设置头部姿态角度 默认是 10
        EulurAngleThrYaw: 10, // 设置头部姿态角度 默认是 10
        EulurAngleThrRoll: 10, // 设置头部姿态角度 默认是 10
        isCheckQuality: true, // 设置是否进行人脸图片质量检测 默认是 true
        conditionTimeout: 10, // 设置超时时间 默认是 10
        notFaceThreshold: 0.6, // 设置人脸检测精度阀值 默认是0.6
        maxCropImageNum: 1 // 设置照片采集张数 默认是 1
      },
      liveActionArray: [
        0, //眨眨眼
        1, //张张嘴
        2, //向右摇头
        3, //向左摇头
        4, //抬头
        5, //低头
        6 //摇头
      ], //活体动作列表
      order: true, //是否按顺序进行活体动作
      sound: true // 提示音，默认不开启
    };
    FaceCheckHelper.openPushFaceViewController(obj);
    // 如果都不设置，需要传 {} 空对象， 建议设置 liveActionArray
    // FaceCheckHelper.openPushFaceViewController( {} );
  }

  render() {
    window.faceCheck = key => {
      this.getImg();
    };
    const { validation, passwordValue } = this.state;
    return (
      <View style={styles.pageView}>
        <View>
          {validation == "" && (
            <View style={styles.validation}> 
              <Text style={styles.titleTxt}>โปรดใส่รหัสเพื่อเปิดใช้</Text>
              {/* <Text style={styles.titleTxt}>请输入您的密码确认启用</Text> */}
              <Image
                resizeMode="stretch"
                source={require("../../images/login/faceRecogition.png")}
                style={{ width: 60, height: 80 }}
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
                  placeholder="密码"
                  textContentType="password"
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
                    <Text style={styles.okBtnTxt}>确认</Text>
                  </View>
                </Touch>
              </View>
            </View>
          )}
          {validation == "ok" && (
            <View style={styles.validation}>
              <Text style={styles.titleTxt}>设定成功</Text>
              <View style={{ marginLeft: 25 }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/facegrop.png")}
                  style={{ width: 80, height: 76 }}
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginFace);
