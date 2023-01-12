import React from "react";
import {
    StyleSheet,
    WebView,
    Text,
    View,
    CameraRoll,
    TouchableOpacity,
    Dimensions,
    Platform,
    Image,
    Modal,
    ScrollView,
    BackHandler
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Carousel,
  WhiteSpace,
  WingBlank,
  Flex,
  Toast,
  ActivityIndicator,
  Picker,
  List
} from "antd-mobile-rn";
import Orientation from "react-native-orientation-locker";
import WebViewAndroid from 'react-native-webview-android'
import WebViewIOS from 'react-native-webview';
import { captureScreen } from "react-native-view-shot";
import CountdownPage from "./CountdownPage";
const { width, height } = Dimensions.get("window");

class DepositPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadD: false,
      loadone: 1,
      payHtml: this.props.data ? this.props.data : "",
      isdepositPageT: this.props.isdepositPageT
        ? this.props.isdepositPageT
        : "",
      showReadyModal: false,
      TimeLoad: "10:00"
    };
  }

  componentWillMount(props) {
    Orientation.lockToPortrait();
    console.log(this.props);

      this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.backAction
      );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    if (this.props.statedata && this.props.statedata.NowBankType && this.props.statedata.NowBankType == "TMW") {
      Actions.CountdownPageTx({time: '10:00'});
      return true;
    }
  };
  
  TimeDown() {
    var m = 10; //分
    var s = 0; //秒

    TimeV1 = setInterval(() => {
      let Sdb = s < 10 ? "0" + s : s;
      this.setState({
        TimeLoad: m + ":" + Sdb
      });
      if (m == 0 && s == 0) {
        clearInterval(TimeV1);
        this.closeModal();
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

  closeModal() {
    Actions.pop();
    setTimeout(() => {
      Actions.recordsTx({});
    }, 1000);
  }

  saveImg(img) {
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      uri => this.SaveQrCode(uri),
      error => Toast.fail(error)
    );
  }

  SaveQrCode(uri) {
    let promise = CameraRoll.saveToCameraRoll(uri);
    promise
      .then(function(result) {
        Toast.success("บันทึกสำเร็จ");
      })
      .catch(function(error) {
        Toast.fail("บันทึกไม่สำเร็จ");
      });
  }
  CloseReadyModal(type) {
    TimeV1 && clearInterval(TimeV1);
    setTimeout(() => {
      Toast.hide();
      this.setState({ showReadyModal: false });
      Actions.pop();
    }, 500);
    if (type == 1) {
      setTimeout(() => {
        Actions.recordsTx({});
      }, 1000);
    }
    if (type == 2) {
      setTimeout(() => {
        Actions.refresh({key: Math.random()})
      }, 1000);
    }
  }
  
  closeBtnUI = () => {
      return (
          <TouchableOpacity
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }}
              onPress={()=>Actions.pop()}
          >
              <Text style={styles.closeButton}>Ｘ</Text>
          </TouchableOpacity>
      )
  }

  closeFunc() {
    console.log('closeFunc',this.props.statedata, this.props.statedata.NowBankType)
      if(this.props.statedata && this.props.statedata.NowBankType){
          if(this.props.statedata.NowBankType == "THBQR"){
              Actions.pop();
              return
          }
          if(this.props.statedata.NowBankType == "TMW" || this.props.statedata.NowBankType == "EZP" || this.props.statedata.NowBankType == "BC"){
              Actions.CountdownPageTx({time: '10:00'});
              return
          }
      } else {
        this.closeModal();
      }
      
  }

  render() {
    window.closeX = () => {
      this.closeModal();
    };

    const js = `$('#btnClose').remove()`;
    const { payHtml, loadD, loadone, showReadyModal, TimeLoad } = this.state;
    let testUrl = payHtml.split(":");
    console.log("asdasdasdad", testUrl);
    console.log("statedata", this.props);
    console.log('this.props.statedata',this.props.statedata)

    let urlHtml = false;
    if (testUrl[0] != "https" && testUrl[0] != "http") {
      urlHtml = false;
    } else {
      urlHtml = true;
    }

    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.isdepositPageT} //isdepositPageT
          onRequestClose={() => {}}
          onShow={this.startShow}
        >
          <View
            style={{
              justifyContent: "center",
              flex: 1,
              padding: 30,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
          >
            <View
              style={{
                backgroundColor: "#171717",
                borderRadius: 5,
                padding: 20
              }}
            >
              <View>
                <Text style={{ color: "#fff", fontSize: 13, padding: 3 }}>
                  温馨提醒：
                </Text>
                <Text style={{ color: "#fff", fontSize: 13, padding: 3 }}>
                  1. 请在充值时，输入系统生成的特殊金额(附小数点)，
                  再进行支付，否则将延迟到账。
                </Text>
                <Text style={{ color: "#fff", fontSize: 13, padding: 3 }}>
                  2.{"<"}二维码{">"}{" "}
                  则需在5分钟内完成扫描，仅限一次使用，重复扫码将导致无法到账或掉单。
                </Text>
              </View>
              <View style={{ alignItems: "center", paddingTop: 20 }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ isdepositPageT: false });
                  }}
                >
                  {/* <Image resizeMode='stretch' source={require('../../images/okBtn.png')} style={{ width: 130, height: 41}} /> */}
                  <View
                    style={{
                      width: width / 2,
                      backgroundColor: "#00b324",
                      borderRadius: 5
                    }}
                  >
                    <Text
                      style={{
                        lineHeight: 35,
                        fontSize: 20,
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: "bold"
                      }}
                    >
                      รับทราบ
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal animationType="none" transparent={true} visible={showReadyModal}>
          <View
            style={{
              width: width,
              height: height,
              top: Platform.OS === "android" ? 0 : 35,
              backgroundColor: "#1a1a1a"
            }}
          >
            <View
              style={{
                backgroundColor: "#000000",
                height: "100%",
                paddingVertical: 0,
                paddingHorizontal: 20
              }}
            >
              <Flex style={{ paddingVertical: 20, width: "100%" }}>
                <Flex.Item style={{ flex: 0.5 }}>
                  <TouchableOpacity
                    onPress={() => {
                      Actions.pop();
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/icon-back.png")}
                      style={{ width: 28, height: 28 }}
                    />
                  </TouchableOpacity>
                </Flex.Item>
                <Flex.Item style={{ alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontSize: 18 }}>处理结果</Text>
                </Flex.Item>
                <Flex.Item style={{ flex: 0.5, alignItems: "flex-end" }}>
                  <TouchableOpacity
                    onPress={() => {
                      Actions.LiveChatST();
                    }}
                  >
                    <Image
                      resizeMode="stretch"
                      source={require("../../images/home/icon-csb.png")}
                      style={{ width: 28, height: 28 }}
                    />
                  </TouchableOpacity>
                </Flex.Item>
              </Flex>
              <ScrollView style={{ padding: 20 }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon-check-g.png")}
                  style={{
                    width: 80,
                    height: 80,
                    alignSelf: "center",
                    paddingVertical: 20
                  }}
                ></Image>
                <Text
                  style={{
                    fontSize: 20,
                    color: "#fff",
                    textAlign: "center",
                    paddingVertical: 20
                  }}
                >
                  订单成立
                </Text>
                <Text
                  style={{
                    fontSize: 25,
                    color: "#00B324",
                    textAlign: "center",
                    paddingVertical: 20
                  }}
                >
                  {TimeLoad}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#00CAFF",
                    textAlign: "center",
                    paddingBottom: 20
                  }}
                >
                  交易编码 : {this.props.resdata&&this.props.resdata.transactionId}
                </Text>
                  <Text  style={{
                    color: "#fff",
                    textAlign: "center",
                    lineHeight: 20
                  }}>请注意，交易将以实时汇率进行</Text>

                <TouchableOpacity onPress={() => this.CloseReadyModal(1)}>
                  <View
                    style={{
                      backgroundColor: "#00B324",
                      width: "100%",
                      paddingVertical: 10,
                      borderRadius: 4,
                      marginVertical: 20
                    }}
                  >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                      查看交易记录
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.CloseReadyModal(2)}>
                  <View
                    style={{
                      width: "100%",
                      borderColor: "#00B324",
                      borderWidth: 1,
                      paddingVertical: 10,
                      borderRadius: 4
                    }}
                  >
                    <Text style={{ color: "#00B324", textAlign: "center" }}>
                      返回充值中心
                    </Text>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <View
          style={{
            top: 0,
            backgroundColor: "#111111",
            width: width,
            height: Platform.OS === "ios" ? 95 : 65,
            zIndex: 20
          }}
        >
          <View style={{ alignItems: "flex-start" }}>
            {this.props.statedata &&
            this.props.statedata.NowBankType == "CTC" ? (
              <TouchableOpacity
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }}
                onPress={() => {
                  this.setState({ showReadyModal: true });
                  this.TimeDown();
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon-back.png")}
                  style={{
                    width: 28,
                    height: 28,
                    left: 20,
                    top: Platform.OS === "ios" ? 45 : 15,
                    paddingTop: Platform.OS === "ios" ? 8 : 5,
                    textAlign: "center"
                  }}
                />
              </TouchableOpacity>
            ) : (
                    <TouchableOpacity
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }}
                        onPress={()=>this.closeFunc()}
                    >
                        <Text style={styles.closeButton}>Ｘ</Text>
                    </TouchableOpacity>
                )}
          </View>
            {(this.props.statedata && this.props.statedata.NowBankType === "THBQR") ? null : (
                <View
                    style={{
                        alignItems: "flex-end",
                        position: "absolute",
                        top: 5,
                        right: 15
                    }}
                >
                    <TouchableOpacity
                        hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }}
                        onPress={this.saveImg.bind(this)}
                    >
                        <Text style={styles.SaveButton}>บันทึกลงในอัลบั้ม</Text>
                    </TouchableOpacity>
                </View>
            )}
            

        </View>

        <View
          style={{
            flex: 1,
            height: loadone == 1 && loadD == true ? 0 : height
          }}
        >
         {Platform.OS === "ios"?
          <WebViewIOS
            // onNavigationStateChange={(event)=>{console.log(event)}}
            // onMessage={(event)=>{console.log(event.nativeEvent)}}
            mediaPlaybackRequiresUserAction={false}
            onLoadStart={e => this.setState({ loadD: true })}
            onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
            renderLoading={e => console.log("load1")}
            source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={Platform.OS === "ios" ? false : true}
            style={{
              width: width,
              height: Platform.OS === "ios" ? height - 175 : height - 115
            }}
          /> :this.props.statedata &&
          this.props.statedata.NowBankType == "CTC" ?
          <WebViewAndroid
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={(e) => this.setState({loadD:true})}
          onLoadEnd={(e) => this.setState({loadD:false,loadone:2})}
          source={urlHtml == false ? {html:payHtml} : {uri:payHtml}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={Platform.OS === 'ios'? false : true}
          style={{width:width,height:height- 115}}
         /> :
         <WebView
         // onNavigationStateChange={(event)=>{console.log(event)}}
         // onMessage={(event)=>{console.log(event.nativeEvent)}}
         mediaPlaybackRequiresUserAction={false}
         onLoadStart={e => this.setState({ loadD: true })}
         onLoadEnd={e => this.setState({ loadD: false, loadone: 2 })}
         renderLoading={e => console.log("load1")}
         source={urlHtml == false ? { html: payHtml } : { uri: payHtml }}
         javaScriptEnabled={true}
         domStorageEnabled={true}
         scalesPageToFit={Platform.OS === "ios" ? false : true}
         style={{
           width: width,
           height: Platform.OS === "ios" ? height - 175 : height - 115
         }}
       />
          }
        </View>

        {loadone == 1 && loadD == true && (
          <Flex
            style={{ height: height, width: width, backgroundColor: "#202020" }}
          >
            <Flex.Item>
              <ActivityIndicator size="large" color="#fff" />
            </Flex.Item>
          </Flex>
        )}
      </View>
    );
  }
}

export default DepositPage;

const styles = StyleSheet.create({
  closeButton: {
    top: Platform.OS === "ios" ? 45 : 15,
    left: 20,
    fontSize: 24,
    fontWeight: "900",
    color: "#0e7e00",
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingTop: Platform.OS === "ios" ? 8 : 5,
    borderColor: "#0e7e00",
    textAlign: "center"
  },
  SaveButton: {
    top: Platform.OS === "ios" ? 45 : 15,
    left: 0,
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    borderRadius: 6,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: "#0e7e00",
    textAlign: "center"
  }
});
