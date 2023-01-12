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
import PasswordGesture from "../../gesturePassword/index";
import { Toast } from "antd-mobile-rn";
import Video from "react-native-video";
import styles from "./style";

import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import FingerprintScanner from "react-native-fingerprint-scanner";

const FaceCheckHelper = NativeModules.PushFaceViewControllerModule;

const { width, height } = Dimensions.get("window");

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      stateType: this.props.stateType,
      faceAccessToken: "", //百度token，30天过期
      userFaceData: "", //用户脸部识别资料
      touchActive: false, //指纹解锁
      errorMessage: "",
      message: "此图形密码锁，用于快速登录应用程序，\n请连续画出四至九个点",
      status: "normal",
      timeOut: 300,
      patternPassword: "", //九宫格密码
      touchLogin: 0,
      password: ""
    };
  }
  componentDidMount() {
    //記住密碼尋找
    let passwordKey = "passwordKey" + this.props.username;
    let passwordID = "passwordID" + this.props.username;
    global.storage
      .load({
        key: passwordKey,
        id: passwordID
      })
      .then(ret => {
        this.setState({ passwordValue: ret });
      })
      .catch(err => {
        //密码失效
        // console.log("密码失效");
         //您的验证方式已过期，请重新验证
         Toast.fail( "หมดเวลายืนยัน กรุณายืนยันอีกครั้ง",2);
        this.fastLoginRemove();
      });
    if (this.props.stateType == "LoginFace") {
      //人脸识别
      let storageKey = "faceKey" + this.props.username;
      let storageId = "faceId" + this.props.username;
      storage
        .load({
          key: storageKey,
          id: storageId
        })
        .then(data => {
          if (data.img) {
            this.getFaceAccessToken();
            this.setState({
              userFaceData: data,
              faceAccessToken: data.accessToken
            });
          } else {
            //用户图片数据失效，请重新验证登录
           //您的验证方式已过期，请重新验证
           Toast.fail( "หมดเวลายืนยัน กรุณายืนยันอีกครั้ง",2);
            global.storage.remove({
              key: storageKey,
              id: storageId
            });
            this.fastLoginRemove();
          }
        })
        .catch(err => {
           //您的验证方式已过期，请重新验证
           Toast.fail( "หมดเวลายืนยัน กรุณายืนยันอีกครั้ง",2);
          this.fastLoginRemove();
        });
      const FaceCheckModules = Platform.select({
        android: () => FaceCheckHelper,
        ios: () => NativeModules.RNIOSExportJsToReact
      })();
      const NativeModule = new NativeEventEmitter(FaceCheckModules);
      this.ficeIDListen = NativeModule.addListener("FaceCheckHelper", data =>
        this.faceCheckCallback(data)
      );
    } else if (this.props.stateType == "LoginTouch") {
      //指纹解锁验证
      console.log("指纹解锁验证");
      
      FingerprintScanner.isSensorAvailable()
        .then(() => {
          this.setState({ touchActive: true });
        })
        .catch(error => {
          if (Platform.OS == "ios") {
            this.errorMessageIos();
          } else {
            this.errorMessage(error.name);
          }
        });
    } else {
      //九宫格密码
    //   console.log("九宫格密码");
      let storageKey = "patternKey" + this.props.username;
      let storageId = "patternId" + this.props.username;
      storage
        .load({
          key: storageKey,
          id: storageId
        })
        .then(data => {
          if (data) {
            this.setState({ patternPassword: data });
          } else {
            //九宫格密码失效
           //您的验证方式已过期，请重新验证
           Toast.fail( "หมดเวลายืนยัน กรุณายืนยันอีกครั้ง",2);
            global.storage.remove({
              key: storageKey,
              id: storageId
            });
            this.fastLoginRemove();
          }
        })
        .catch((err) => {
            //您的验证方式已过期，请重新验证
            Toast.fail( "หมดเวลายืนยัน กรุณายืนยันอีกครั้ง",2);
          this.fastLoginRemove();
        });
    }
  }
  componentWillUnmount() {
    Platform.OS == "android" && FingerprintScanner.release();
    this.ficeIDListen && this.ficeIDListen.remove();
  }
  fastLoginRemove() {
    //清除快捷登录方式
    let storageKey = "fastLogin" + this.props.username;
    let storageId = "fastLogin" + this.props.username;
    global.storage.remove({
      key: storageKey,
      id: storageId
    });
    Actions.pop();
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
      this.validationCheck(imgeList[0]);
    } else if (data.remindCode == 36) {
      //识别认证超时，请重试
      Toast.fail( "ช่องทางยืนยันหมดอายุแล้ว กรุณายืนยันอีกครั้ง",2);
    }
  }
  //获取百度脸部识别AccessToken
  getFaceAccessToken() {
    fetch("https://www.rb1005.com/face/", { method: "GET" })
      .then(response => (headerData = response.json()))
      .then(responseData => {
        let data = JSON.parse(responseData);
        if (data) {
          this.setState({ faceAccessToken: data.access_token });
          let facedata = this.state.userFaceData;
          facedata.accessToken = data.access_token;

          //储存用户toekn
          let storageKey = "faceKey" + this.props.username;
          let storageId = "faceId" + this.props.username;
          global.storage.save({
            key: storageKey,
            id: storageId,
            data: facedata,
            expires: null
          });
        }
      })
      .catch(error => {});
  }
  validationCheck(img) {
    let data = {
      token: this.state.faceAccessToken,
      image1: this.state.userFaceData.img,
      image2: img
    };
    fetch("https://www.rb1005.com/face/faceCheck.php", {
      method: "POST",
      // body: JSON.stringify(data),
      body: `token=${data.token}&image1=${data.image1}&image2=${data.image2}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (Number(json.score) > 80) {
          window.Globlogin &&
            window.Globlogin(
              this.props.username,
              this.state.passwordValue,
              "commonlogin"
            );
          this.setState({ errorMessage: "" });
        } else {
           //验证错误，请重试
           this.setState({errorMessage: 'การยืนยันขัดข้อง กรุณาลองอีกครั้ง'})
        }
      })
      .catch(err => {
        //验证失败，请重试
        Toast.fail('การยืนยันไม่สำเร็จ กรุณาลองอีกครั้ง',2)
      });
  }
  //点击验证
  faceChack() {
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
        0 //眨眨眼
      ], //活体动作列表
      order: true, //是否按顺序进行活体动作
      sound: true // 提示音，默认不开启
    };
    FaceCheckHelper.openPushFaceViewController(obj);
    // 如果都不设置，需要传 {} 空对象， 建议设置 liveActionArray
    // FaceCheckHelper.openPushFaceViewController( {} );
  }

  //ios使用，锁屏后重启app；
  errorMessageIos() {
     //验证错误次数过多，请使用密码登录
		Toast.fail('การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน',2)
    Actions.pop();
  }
  //指纹验证错误提示
  errorMessage(err,key) {
    let message = '';
const iphoneX = DeviceInfoIos;
//iphonex没有指纹识别，提示语不同
    switch (err) {
          case 'AuthenticationNotMatch':
              //不匹配
              //message = iphoneX && '脸部识别匹配失败1' || '指纹匹配失败';
              message = iphoneX && 'การสแกน Face ID ไม่ตรงกัน' || 'การสแกนลายนิ้วมือไม่ตรงกัน';
          break;
          case 'AuthenticationFailed':
              //指纹不匹配
              //message = iphoneX && '脸部识别匹配失败' || '指纹匹配失败';
              message = iphoneX && 'ยืนยันการสแกน Face ID ไม่สำเร็จ' || 'การสแกนลายนิ้วมือไม่สำเร็จ';
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
              message = 'ยกเลิกการยืนยัน';
          break;
          case 'PasscodeNotSet':
              //手机没有设置密码
              //message = '您还未设置密码';
              message = 'โทรศัพท์ของคุณยังไม่มีการตั้งรหัสผ่าน';
          break;
          case 'FingerprintScannerNotAvailable':
              //无法使用指纹功能
              //message = iphoneX && '脸部登入无法启动，此手机没有脸部识别功能' || '指纹登入无法启动，此手机没有指纹识别功能';
              message = iphoneX && 'ไม่สามารถเปิดใช้งาน Face ID ได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับ Face ID' || 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
          break;
          case 'FingerprintScannerNotEnrolled':
              //手机没有预先设置指纹
              //message = iphoneX && '脸部登入无法启动，您手机内还未设置脸部识别' || '指纹登入无法启动，您手机内还未设置指纹识别';
              message = iphoneX && 'ไม่สามารถเปิดใช้งานการเข้าสู่ระบบด้วย Face ID ได้ และยังไม่มีการตั้งค่า Face ID ในโทรศัพท์ของคุณ' || 'ไม่สามารถเปิดใช้งานการเข้าสู่ระบบด้วยการสแกนลายนิ้วมือได้ และยังไม่มีการตั้งค่าการสแกนลายนิ้วมือในโทรศัพท์ของคุณ';
          break;
          case 'FingerprintScannerUnknownError':
              if(Platform.OS === 'ios') {
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
              //message = iphoneX && '脸部登入无法启动，您手机内还未设置脸部识别' || '此手机不支持指纹识别';
              message = iphoneX && 'ไม่สามารถเปิดใช้งาน Face ID ได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับ Face ID' || 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
          break;
          case 'DeviceLocked':
              //认证不成功，锁定30秒
              //message = iphoneX && '验证错误次数过多，请使用密码登录' || '指纹已禁用，请30秒后重试';
              message = iphoneX && 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน' || 'การสแกนลายนิ้วมือถูกปิดใช้งาน กรุณาลองอีกครั้งใน 30 วินาที';
          break;
    
        default:
            //message = iphoneX && '未知原因导致无法使用脸部功能' || '未知原因导致无法使用指纹功能'
            message = iphoneX && 'ไม่สามารถใช้งาน Face ID ได้โดยไม่ทราบสาเหตุ' || 'ไม่สามารถใช้งานการสแกนลายนิ้วมือได้โดยไม่ทราบสาเหตุ'
            break;
    }
    this.setState({ errorMessage: '' })
    setTimeout(() => {
        this.setState({ errorMessage: message,touchActive: true })
    }, 1000);
    if(!key) {
        //指纹初始化错误才返回
        setTimeout(() => {
            Actions.pop()
        }, 2000);
    }
}


  //九宫格输入结束
  onEnd(password) {
    const { patternPassword } = this.state;
    if (password === patternPassword) {
      this.setState({ status: "right" });
      setTimeout(() => {
        window.Globlogin &&
          window.Globlogin(
            this.props.username,
            this.state.passwordValue,
            "commonlogin"
          );
      }, 350);
    } else {
      this.setState({ status: "wrong" });
       //密码错误，请重新输入
       Toast.fail( "รหัสผ่านไม่ถูกต้อง กรุณาใส่รหัสผ่านอีกครั้ง",2);
    }
  }
  //九宫格输入开始
  onStart() {
    this.setState({ status: "normal" });
    if (this.state.timeOut) {
      clearTimeout(this.time);
    }
  }

  touchSuccess() {
    this.setState({ touchActive: false });
    window.Globlogin &&
      window.Globlogin(
        this.props.username,
        this.state.passwordValue,
        "commonlogin"
      );
  }
  fastLogins(key) {
    let fastLoginKey = "fastLogin" + this.props.username;
    let sfastLoginId = "fastLogin" + this.props.username;
    global.storage.save({
      key: fastLoginKey,
      id: sfastLoginId,
      data: key,
      expires: null
    });
  }

  render() {
    const { stateType, errorMessage, touchActive } = this.state;
    const faceRecogition =  (Platform.OS == "ios" && DeviceInfoIos)?true:false
    return stateType != "LoginPattern" ? (
      <View>
        {stateType != "LoginPattern" && (
          <View>
            <Video
              source={require("../../images/JBO.mp4")}
              rate={1.0}
              muted={false}
              resizeMode={"cover"}
              repeat
              style={styles.video}
              playWhenInactive={true}
            />

            <View style={[styles.validation, { marginTop: 70 }]}>
              <Image
                resizeMode="stretch"
                source={require("../../images/login/jbologo.png")}
                style={{ width: 180, height: 58 }}
              />
              <Text style={[styles.titleTxt, { fontSize: 20, color: "#fff" }]}>
              ยินดีต้อนรับการกลับมา{/* 欢迎回来 */}
              </Text>
              <Text
                style={{
                  color: "#fff",
                  marginBottom: 30,
                  textAlign: "center",
                  marginTop: 8
                }}
              >
                {this.props.username}
              </Text>
              {//脸部识别
              stateType == "LoginFace" && (
                <View>
                  <Touch
                    onPress={() => {
                      this.faceChack();
                    }}
                    style={styles.validation}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/login/faceRecogition.png")}
                      style={{ width: 66, height: 88 }}
                    />
                  </Touch>
                  <Text style={[styles.username, { color: "#fff" }]}>
                  ล็อคอินโดยใช้การจดจำใบหน้า{/* 脸部辨识登录 */}
                  </Text>
                </View>
              )}
              {//指纹识别
              stateType == "LoginTouch" && (
                <View>
                  <Touch onPress={() => {}} style={styles.validation}>
                    <Image
                      resizeMode="stretch"
                      source={
                        faceRecogition
                          ? require("../../images/login/faceRecogition.png")
                          : require("../../images/login/fingerprintScanNo.png")
                      }
                      style={
                        faceRecogition
                          ? { width: 66, height: 88 }
                          : { width: 88, height: 70 }
                      }
                    />
                  </Touch>
                  <Text style={[styles.username, { color: "#fff" }]}>
                    {faceRecogition ? "ล็อคอินโดยการจดจำใบหน้า" : "ล็อคอินโดยใช้การจดจำลายนิ้วมือ"}
                  </Text>
                  {touchActive && Platform.OS == "ios" && (
                    <FingerprintPopupIOS
                      errCallback={(err, key) => {
                        this.errorMessage(err, key);
                      }}
                      successCallback={() => {
                        this.touchSuccess();
                      }}
                    />
                  )}
                  {touchActive && Platform.OS == "android" && (
                    <FingerprintPopupAndroid
                      errCallback={(err, key) => {
                        this.errorMessage(err, key);
                      }}
                      successCallback={() => {
                        this.touchSuccess();
                      }}
                    />
                  )}
                </View>
              )}
              <Text
                style={[
                  styles.username,
                  {
                    color: "red",
                    marginBottom: height > 600 ? height / 3.5 : 20
                  }
                ]}
              >
                {errorMessage != "" && errorMessage}
              </Text>

              <View>
                <Touch
                  onPress={() => {
                    Actions.pop();
                  }}
                >
                  <View
                    style={{
                      width: width - 50,
                      backgroundColor: "#00B324"
                      //   marginBottom:10,
                      //   borderRadius: 40
                    }}
                  >
                    <Text style={[styles.okBtnTxt, { color: "#fff" }]}>
                    เข้าสู่ระบบแบบปกติ{/* 一般登录 */}
                    </Text>
                  </View>
                </Touch>
              </View>
            </View>
          </View>
        )}
      </View>
    ) : (
      // 九宫格插件布局特殊处理
      <PasswordGesture
        ref="pg"
        status={this.state.status}
        message={""}
        onStart={() => this.onStart()}
        onEnd={password => this.onEnd(password)}
        innerCircle={true}
        outerCircle={true}
        interval={this.state.timeOut}
        normalColor={"#fff"}
        rightColor={"#00B324"}
        wrongColor={"red"}
        style={{ position: "relative", top: 50 }}
      >
        <Video
          source={require("../../images/JBO.mp4")}
          rate={1.0}
          muted={false}
          resizeMode={"cover"}
          repeat
          style={{
            height: height,
            width: width,
            position: "absolute",
            top: -50,
            zIndex: -1
          }}
          playWhenInactive={true}
        />
        <View style={[styles.patternTxt]}>
          <Image
            resizeMode="stretch"
            source={require("../../images/login/jbologo.png")}
            style={{ width: 160, height: 65 }}
          />
          <Text style={{ textAlign: "center", fontSize: 20, color: "#fff" }}>
          ยินดีต้อนรับการกลับมา{/* 欢迎回来 */}
          </Text>
          <Text
            style={{ textAlign: "center", color: "#fff", marginBottom: 10 }}
          >
            {this.props.username}
          </Text>
          <Text style={{ textAlign: "center", color: "#fff" }}>
          กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบ{/* 请输入您的图形密码 */}
          </Text>
        </View>
        <Touch
          onPress={() => {
            Actions.pop();
          }}
          style={[styles.patternTxt, { top: height / 1.3 }]}
        >
          <View
            style={{
              width: width - 50,
              backgroundColor: "#00B324"
              //   borderRadius: 40
            }}
          >
            <Text style={[styles.okBtnTxt, { color: "#fff" }]}>
            เข้าสู่ระบบแบบปกติ{/* 一般登录 */}
              </Text>
          </View>
        </Touch>
      </PasswordGesture>
    );
  }
}

class FingerprintPopupIOS extends React.Component {
  componentDidMount() {
    FingerprintScanner.authenticate({
      description: "温馨提示,使用指纹辨识",
      fallbackEnabled: false
    })
      .then(() => {
        this.props.successCallback();
      })
      .catch(error => {
        this.props.errCallback(error.name, "err");
      });
  }

  render() {
    return false;
  }
}
class FingerprintPopupAndroid extends React.Component {
  componentDidMount() {
    FingerprintScanner.authenticate({
      onAttempt: this.handleAuthenticationAttempted
    })
      .then(() => {
        this.props.successCallback();
      })
      .catch(error => {
        this.props.errCallback(error.name);
      });
  }
  //验证失败
  handleAuthenticationAttempted = error => {
    this.props.errCallback(error.name, "err");
  };

  render() {
    return false;
  }
}
