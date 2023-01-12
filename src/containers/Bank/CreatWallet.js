import React from "react";
import {
  StyleSheet,
  WebView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  PermissionsAndroid,
  Alert,
  Linking,
  CameraRoll,
  Image,
  Platform,
  TextInput,
  ScrollView,
  Modal,
  Switch,
  ToastAndroid,
  AlertIOS
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Carousel,
  WhiteSpace,
  WingBlank,
  Flex,
  Toast,
  InputItem,
  ActivityIndicator
} from "antd-mobile-rn";
import ToastNew from "react-native-root-toast";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";
const { width, height } = Dimensions.get("window");
const newStyle = {};
const WalletAddressRegex = /^0x[a-zA-Z0-9]{40}$/;
const WalletNameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9 ]{0,20}$/;
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      newStyle[key].color = "#fff";
      newStyle[key].fontSize = 13;
      newStyle[key].textAlign = "left";
    }
    newStyle[key].borderBottomColor = "#1a1a1a";
  }
}
class CreatWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ctcWalletAddress: "",
      ctcWalletName: "",
      isDefault: false,
      walletNameError: false,
      walletAddressError: false,
      toastMsg: "",
      toastSuccessFlag: false,
      toastErrorFlag: false,
      optPage: true,
      sendedOpt: false,
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      code6: "",
      errCode: false,
      password: "",
      issubmitBtn: false,
      number: "",
      Reload: false,
      TimeLoad: '03 : 00',
      upLimit: this.props.isUplimit?true:false,
      reminModal: false,
      phoneNumber:'',
      resendedOpt:false,
      attempts:'',
      storageTime:0
    };
    this.props.GetCryptoWallet = this.props.GetCryptoWallet.bind(this);
  }
  componentDidMount(){
    global.storage.load({
      key: 'optTimeEnd',
      id: 'optTimeEnd'}).then(res => {
        this.setState({storageTime:res})
        if(new Date().getTime()<res){
          this.TimeDown();
          this.setState({sendedOpt:true})
        }  
      })
   
    this.CheckIsAbleSmsOTP();
    this.getUser();
    
  }
  
  //新增加密貨幣錢包
  addCryptoWallet() {
    Toast.loading("提交中,请稍候...", 200);
    const { ctcWalletAddress, ctcWalletName, isDefault, password } = this.state;
    const requestData = {
      WalletName: ctcWalletName,
      WalletAddress: ctcWalletAddress,
      PassCode: password,
      cryptocurrencyCode: "USDT",
      isDefault: isDefault
    };
    fetchRequest(ApiPort.CryptoWallet + "?", "POST", requestData).then(data => {
      Toast.hide();
      if (data.isSuccess) {
        this.setState({
          toastSuccessFlag: true,
          toastMsg: "成功添加 USDT-ERC20 钱包地址"
        });
        setTimeout(() => {
          this.props.GetCryptoWallet();
        }, 500);
        setTimeout(() => {
          this.setState({ toastSuccessFlag: false });
          Actions.pop();
        }, 1000);
      } else {
        if (data.walletNameErrorList.length > 0) {
          this.setState({
            toastErrorFlag: true,
            toastMsg: data.walletNameErrorList[0].Description
          });
          setTimeout(() => {
            this.setState({ toastErrorFlag: false });
          }, 1500);
          // Toast.fail(data.walletNameErrorList[0].Description);
        } else if (data.walletAddressErrorList.length > 0) {
          this.setState({
            toastErrorFlag: true,
            toastMsg: data.walletAddressErrorList[0].Description
          });
          setTimeout(() => {
            this.setState({ toastErrorFlag: false });
          }, 1500);
          // Toast.fail(data.walletAddressErrorList[0].Description);
        } else {
          Toast.fail(data.message);
        }
      }
    });
  }
  //檢查輸入格式
  checkformat(value, type) {
    if (type == 1) {
      const checkSpace = /\s+/g;
      const flagName = WalletNameRegex.test(value) && !checkSpace.test(value);
      this.setState({ walletNameError: !flagName });
    } else {
      const flagAddress = WalletAddressRegex.test(value);
      this.setState({ walletAddressError: !flagAddress });
    }
  }
  checked() {
    const { code1, code2, code3, code4, code5, code6 } = this.state;
    let code =
      code1.toString() +
      code2.toString() +
      code3.toString() +
      code4.toString() +
      code5.toString() +
      code6.toString();
    this.setState({ password: code });
    if (code.length == 6) {
      this.setState({ issubmitBtn: true });
    } else {
      this.setState({ issubmitBtn: false });
    }
  }

//用戶資料
  getUser() {
    fetchRequest(ApiPort.Member, "GET")
      .then(data => {
        let number = "";
        if (data.result.memberInfo.Contacts.length == 1) {
          number = data.result.memberInfo.Contacts[0].Contact;
        } else if (data.result.memberInfo.Contacts.length != 1) {
          if (data.result.memberInfo.Contacts[0].ContactType == "Phone") {
            number = data.result.memberInfo.Contacts[0].Contact;
          } else {
            number = data.result.memberInfo.Contacts[1].Contact;
          }
         
          // this.sendOptVerify(number);
        }
        this.setState({phoneNumber:number})
      })
      .catch(error => {
        //Toast.hide();
      });
  }
  //OPT檢查次數
  CheckIsAbleSmsOTP() {
    fetchRequest(ApiPort.CheckIsAbleSmsOTP, "GET").then(data => {
      if (data.isAbleSmsOTP && data.attempts > 0) {
        this.setState({attempts:data.attempts})
        // this.sendOptVerify(this.state.phoneNumber);
      } else {
        this.setState({
          upLimit:true
        });
        setTimeout(() => {
          this.setState({ toastErrorFlag: false });
        }, 1500);
      }
    });
  }
   //验证码发送
  sendOptVerify(number) {
    Toast.loading("验证码发送中,请稍候...", 200);
    fetchRequest(ApiPort.SendSmsOTP+'phoneNumber='+number+'&', "POST").then(data => {
      Toast.hide();
      if (data.isSuccess) {
          var threeMinutesLater = new Date();
     threeMinutesLater.setMinutes(threeMinutesLater.getMinutes() + 3);  
    global.storage.save({
      key: 'optTimeEnd',
      id: 'optTimeEnd',
      data: threeMinutesLater.getTime(),
      expires: null
    })
        this.setState({ attempts:data.attempts,resendedOpt:false },()=> this.TimeDown());
        setTimeout(() => {
          this.setState({ sendedOpt: true });
        }, 1500);
      } else {
        this.setState({
          toastErrorFlag: true,
          toastMsg: "验证码发送失敗",
          attempts:data.attempts
        });
        setTimeout(() => {
          this.setState({ toastErrorFlag: false });
        }, 1500);
      }
    });
  }
  //OPT驗證
  VerifySmsOTP() {
    Toast.loading("验证中,请稍候...", 200);
    fetchRequest(ApiPort.VerifySmsOTP+'passCode='+this.state.password+'&', "POST").then(data => {
      Toast.hide();
      if (data.isSuccess) {
        this.setState({
          toastSuccessFlag: true,
          toastMsg: "电话验证已完成"
        });
        setTimeout(() => {
          this.setState({ toastSuccessFlag: false, optPage: false });
        }, 1500);
      } else if (data.attempts == 0) {
        this.setState({ upLimit: true,attempts:data.attempts });
      } else {
        this.setState({
          toastErrorFlag: true,
          toastMsg: data.message,
          attempts:data.attempts,
          code1: "",
          code2: "",
          code3: "",
          code4: "",
          code5: "",
          code6: "",password:'',issubmitBtn:false
        });
        setTimeout(() => {
          this.setState({ toastErrorFlag: false });
        }, 1500);
      }
    });
  }
  
  
  TimeDown() {
     var m = 3; //分
     var s = 0; //秒
     if(new Date().getTime()<this.state.storageTime){
      let t=(this.state.storageTime-new Date().getTime())/1000
      let s1= t/60
      let s2= t%60
       m=Math.floor(s1)
       s=Math.floor(s2)
     }

     this.loadInterval = setInterval(() => {
      let Sdb = s < 10 ? "0" + s : s;
      let Mdb = m < 10 ? "0" + m : m;
      this.setState({
        TimeLoad: Mdb + ":" + Sdb
      });
      
      if (m == 0 && s == 0) {
        clearInterval(this.loadInterval);
        this.CheckIsAbleSmsOTP();
        this.setState({resendedOpt:true,
                   code1: "",
        code2: "",
        code3: "",
        code4: "",
        code5: "",
        code6: "",password:'',issubmitBtn:false
        })

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
  render() {
    const {
      ctcWalletAddress,
      ctcWalletName,
      walletNameError,
      walletAddressError,
      toastMsg,
      toastSuccessFlag,
      toastErrorFlag,
      optPage,
      sendedOpt,
      code1,
      code2,
      code3,
      code4,
      code5,
      code6,
      TimeLoad,
      issubmitBtn,
      upLimit,
      reminModal,
      phoneNumber,
      resendedOpt,
      attempts
    } = this.state;
    return (
      <View
        style={{
          backgroundColor: "#000000",
          height: "100%"
          // paddingVertical: 20,
          // paddingHorizontal: 20
        }}
      >
        <ToastNew
          visible={toastErrorFlag}
          position={0}
          shadow={false}
          animation={false}
          hideOnPress={true}
          backgroundColor="#fff"
          opacity={1}
        >
          <Image
            resizeMode="contain"
            source={require("../../images/error_icon.png")}
            style={{ width: 16, height: 16 }}
          />
          <Text
            style={{
              color: "#333333",
              fontSize: 14
            }}
          >
            {" "}
            {toastMsg}
          </Text>
        </ToastNew>
        <ToastNew
          visible={toastSuccessFlag}
          position={0}
          shadow={false}
          animation={false}
          hideOnPress={true}
          backgroundColor="#fff"
          opacity={1}
        >
          <Image
            resizeMode="contain"
            source={require("../../images/icon_success.png")}
            style={{ width: 16, height: 16, marginRight: 10 }}
          ></Image>
          <Text
            style={{
              color: "#333333",
              fontSize: 14
            }}
          >
            {toastMsg}
          </Text>
        </ToastNew>
        {/* 提醒彈窗 */}
        <Modal
          animationType="none"
          transparent={true}
          visible={reminModal}
          onRequestClose={() => {}}
        >
          <View
            style={{
              justifyContent: "center",
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)"
            }}
          >
            <View
              style={{
                backgroundColor: "#000000",
                width: width - 50,
                alignSelf: "center",
                borderColor: "#00B324",
                borderWidth: 1,
                padding: 20
              }}
            >
          <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} onPress={()=>this.setState({reminModal:false})}>X</Text>
              <Image
                source={require("../../images/icon_warning.png")}
                resizeMode="stretch"
                style={{
                  width: 60,
                  height: 60,
                  alignSelf: "center",
                  marginBottom: 20
                }}
              />
              <View>
                <Text
                  style={{ color: "#fff", textAlign: "center", lineHeight: 30 }}
                >
                  {"您需要再次验证电话号码\n才能添加钱包地址"}
                </Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignSelf: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ reminModal: false });
                      Actions.pop();
                    }}
                  >
                    <View
                      style={{
                        borderColor: "#00B324",
                        borderWidth: 1,
                        width: 100,
                        padding: 10,
                        borderRadius: 4,
                        alignSelf: "center",
                        marginTop: 15,
                        marginRight: 20
                      }}
                    >
                      <Text style={{ color: "#00B324", textAlign: "center" }}>
                        离开
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ reminModal: false })}
                  >
                    <View
                      style={{
                        backgroundColor: "#00B324",
                        width: 100,
                        padding: 10,
                        borderRadius: 4,
                        alignSelf: "center",
                        marginTop: 15
                      }}
                    >
                      <Text style={{ color: "#fff", textAlign: "center" }}>
                        添加
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={{ padding: 20 }}>
          <Flex>
            <Flex.Item style={{ flex: 0.3 }}>
             {!optPage&& <TouchableOpacity
                onPress={() => this.setState({ reminModal: true })}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon-back.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>}
            </Flex.Item>

            <Flex.Item style={{ flex: 1.5, alignItems: "center" }}>
              <Text style={{ color: "#fff",fontSize:16 }}>添加 USDT-ERC20 钱包地址</Text>
            </Flex.Item>
            <Flex.Item style={{ flex: 0.3 }}>
            {optPage?<Text style={{color:'#fff',fontSize:20,textAlign:'right'}}onPress={()=> Actions.pop()} >X</Text>
             :<Image
                resizeMode="stretch"
                source={require("../../images/home/icon-csb.png")}
                onPress={() => {
                  Actions.LiveChatST();
                }}
                style={{ width: 21, height: 21 }}
            /> }
            </Flex.Item>
          </Flex>
        </View>
        {upLimit && (
          <View>
            <Image
              source={require("../../images/icon_warning.png")}
              resizeMode="stretch"
              style={{
                width: 60,
                height: 60,
                alignSelf: "center",
                marginVertical: 20
              }}
            />
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 18,
                lineHeight: 35
              }}
            >
              很抱歉，验证失败
            </Text>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              验证失败已达 5 次，请 24 小时后再次尝试
            </Text>
            <TouchableOpacity onPress={() => Actions.LiveChatST()}>
              <View
                style={{
                  backgroundColor: "#00B324",
                  marginTop: 30,
                  paddingVertical: 10,
                  borderRadius: 4,
                  width: width - 50,
                  alignSelf: "center"
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    lineHeight: 20,
                    borderRadius: 4
                  }}
                >
                  联系在线客服
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        {!upLimit &&
          (optPage ? (
            <View>
              <View style={{ backgroundColor: "#222222", padding: 10 }}>
                <Flex style={{ paddingVertical: 15 }}>
                  <Flex.Item>
                    <Text
                      style={{ color: "#F5F5F5", lineHeight: 30, fontSize: 16 }}
                    >
                     <Text style={{color:'red'}}> *</Text> 手机号：{phoneNumber}
                    </Text>
                  </Flex.Item>
                  <Flex.Item style={{ flex: 0.5 }}>
                    <TouchableOpacity
                      onPress={() => (!sendedOpt||resendedOpt) && this.sendOptVerify(this.state.phoneNumber)}
                    >
                      <View
                        style={{
                          backgroundColor: (!sendedOpt||resendedOpt) ?  "#00B324":"#666666" ,
                          padding: 10,
                          alignSelf: "flex-end",
                          borderRadius: 4
                        }}
                      >

                        {console.log("TimeLoad",TimeLoad)}
                        <Text style={{ color: "#fff", textAlign: "center" }}>
                          {resendedOpt?'重发验证码':sendedOpt ? TimeLoad : "发送验证码"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Flex.Item>
                </Flex>
                {sendedOpt && (
                  <View style={{ backgroundColor: "#222222", padding: 10 }}>
                    <Text style={{ color: "#F5F5F5", textAlign: "center" }}>
                      您手机收到的验证码
                    </Text>
                    <Text style={{color:'#999999',textAlign: "center",marginTop:10}}>您还有 <Text style={{color:'red'}}>{attempts}</Text> 次尝试机会</Text>
                    <View style={styles.codeNmu}>
                      <TextInput
                        ref="focus1"
                        maxLength={1}
                        keyboardType={"number-pad"}
                        value={code1}
                        style={styles.codeNmuList}
                        onChangeText={val => {
                          let value = val.replace(/[^0-9]/g, "");
                          this.setState({ code1: value }, () => {
                            this.checked();
                          });
                          if (value !== "") {
                            this.refs.focus1.blur(); //失去焦点
                            this.refs.focus2.focus(); //获取焦点
                          }
                        }}
                      />
                      <TextInput
                        ref="focus2"
                        maxLength={1}
                        keyboardType={"number-pad"}
                        value={code2}
                        style={styles.codeNmuList}
                        onChangeText={val => {
                          let value = val.replace(/[^0-9]/g, "");
                          this.setState({ code2: value }, () => {
                            this.checked();
                          });
                          if (value !== "") {
                            this.refs.focus2.blur(); //失去焦点
                            this.refs.focus3.focus(); //获取焦点
                          }
                        }}
                      />
                      <TextInput
                        ref="focus3"
                        maxLength={1}
                        keyboardType={"number-pad"}
                        value={code3}
                        style={styles.codeNmuList}
                        onChangeText={val => {
                          let value = val.replace(/[^0-9]/g, "");
                          this.setState({ code3: value }, () => {
                            this.checked();
                          });
                          if (value !== "") {
                            this.refs.focus3.blur(); //失去焦点
                            this.refs.focus4.focus(); //获取焦点
                          }
                        }}
                      />
                      <TextInput
                        ref="focus4"
                        maxLength={1}
                        keyboardType={"number-pad"}
                        value={code4}
                        style={styles.codeNmuList}
                        onChangeText={val => {
                          let value = val.replace(/[^0-9]/g, "");
                          this.setState({ code4: value }, () => {
                            this.checked();
                          });
                          if (value !== "") {
                            this.refs.focus4.blur(); //失去焦点
                            this.refs.focus5.focus(); //获取焦点
                          }
                        }}
                      />
                      <TextInput
                        ref="focus5"
                        maxLength={1}
                        keyboardType={"number-pad"}
                        value={code5}
                        style={styles.codeNmuList}
                        onChangeText={val => {
                          let value = val.replace(/[^0-9]/g, "");
                          this.setState({ code5: value }, () => {
                            this.checked();
                          });
                          if (value !== "") {
                            this.refs.focus5.blur(); //失去焦点
                            this.refs.focus6.focus(); //获取焦点
                          }
                        }}
                      />
                      <TextInput
                        ref="focus6"
                        maxLength={1}
                        keyboardType={"number-pad"}
                        value={code6}
                        style={styles.codeNmuList}
                        onChangeText={val => {
                          let value = val.replace(/[^0-9]/g, "");
                          this.setState({ code6: value }, () => {
                            this.checked();
                          });
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        color: "#CCCCCC",
                        textAlign: "center",
                        lineHeight: 20,
                        padding: 10
                      }}
                    >
                      如果您 3
                      分钟内没有收到验证码，请点击“重发验证码”以获取新的验证码
                    </Text>
                  </View>
                )}
                <Text>
                  <Image
                    resizeMode="stretch"
                    source={require("../../images/icon_warning.png")}
                    style={{ width: 15, height: 15 }}
                  />{" "}
                  <Text style={{ color: "#CCCCCC" }}>
                    发送验证码后，如需修改手机号，请联系
                    <Text style={{ color: "#00E62E" }} onPress={()=> Actions.LiveChatST()}>在线客服</Text>
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => issubmitBtn && this.VerifySmsOTP()}
              >
                <View
                  style={{
                    backgroundColor: issubmitBtn ? "#00B324" : "#666666",
                    margin: 15,
                    padding: 10
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      lineHeight: 20,
                      borderRadius: 4
                    }}
                  >
                    提交
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: "#000000",
                height: "100%",
                paddingVertical: 20,
                paddingHorizontal: 20
              }}
            >
              <View style={{ paddingVertical: 20 }}>
                <Text style={{ color: "#fff", lineHeight: 30, fontSize: 16 }}>
                  <Text style={{ color: "red" }}>* </Text>钱包名称
                </Text>
                <View style={styles.DsBorder}>
                  <InputItem
                    styles={StyleSheet.create(newStyle)}
                    placeholderTextColor="#969696"
                    value={this.state.ctcWalletName}
                    onChange={(value: any) => {
                      this.setState(
                        {
                          ctcWalletName: value
                        },
                        () => {
                          this.checkformat(value, 1);
                        }
                      );
                    }}
                    placeholder="请给钱包取名，以区分多个 USDT-ERC20 钱包"
                  />
                </View>
                {ctcWalletName != "" && walletNameError && (
                  <Text style={{ color: "red", marginLeft: 5, lineHeight: 30 }}>
                    该钱包名称无效
                  </Text>
                )}
                <View style={styles.tipbox}>
                  <View style={styles.tipcircle}></View>
                  <Text style={{ color: "#999999", lineHeight: 25 }}>
                    不允许使用空格和特殊字符
                  </Text>
                </View>

                <View style={styles.tipbox}>
                  <View style={styles.tipcircle}></View>
                  <Text style={{ color: "#999999" }}>最多20个字符</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 10
                  }}
                >
                  <Text style={{ color: "#fff", lineHeight: 30, fontSize: 16 }}>
                    <Text style={{ color: "red" }}>* </Text>钱包地址
                  </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      position: "absolute",
                      right: 0
                    }}
                  >
                    <Text style={{ color: "#CCCCCC" }}>默认钱包</Text>
                    <Switch
                      style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                      trackColor={{ false: "#999999", true: "#00B324" }}
                      thumbColor={this.state.isDefault ? "#fff" : "#fff"}
                      ios_backgroundColor="#999999"
                      onValueChange={() => {
                        this.setState({
                          isDefault: !this.state.isDefault
                        });
                      }}
                      value={this.state.isDefault}
                    />
                  </View>
                </View>
                <View style={styles.DsBorder}>
                  <InputItem
                    styles={StyleSheet.create(newStyle)}
                    placeholderTextColor="#969696"
                    value={this.state.ctcWalletAddress}
                    onChange={(value: any) => {
                      this.setState(
                        {
                          ctcWalletAddress: value
                        },
                        () => {
                          this.checkformat(value, 2);
                        }
                      );
                    }}
                    placeholder="请长按粘贴钱包地址，避免输入错误"
                  />
                </View>
                {ctcWalletAddress != "" && walletAddressError && (
                  <Text style={{ color: "red", marginLeft: 5, lineHeight: 30 }}>
                    该钱包地址无效
                  </Text>
                )}
                <View style={styles.tipbox}>
                  <View style={styles.tipcircle}></View>
                  <Text style={{ color: "#999999", lineHeight: 25 }}>
                    不允许使用空格和特殊字符
                  </Text>
                </View>
                <View style={styles.tipbox}>
                  <View style={styles.tipcircle}></View>
                  <Text style={{ color: "#999999", lineHeight: 25 }}>
                    以“0x”开头且必须为42个字母和数字组成
                  </Text>
                </View>
              </View>
              <View style={{ padding: 15 }}>
                {ctcWalletName &&
                ctcWalletAddress &&
                !walletAddressError &&
                !walletNameError ? (
                  <View style={{ backgroundColor: "#00b324", borderRadius: 5 }}>
                    <TouchableOpacity onPress={() => this.addCryptoWallet()}>
                      <Text
                        style={{
                          color: "#fff",
                          textAlign: "center",
                          lineHeight: 40
                        }}
                      >
                        确认并提交
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ backgroundColor: "#2d2d2d", borderRadius: 5 }}>
                    <Text
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        lineHeight: 40
                      }}
                    >
                      确认并提交
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
      </View>
    );
  }
}

export default CreatWallet;

const styles = StyleSheet.create({
  DsBorder: {
    borderWidth: 1,
    borderColor: "#3d3d3d",
    borderRadius: 5,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3
  },
  tipbox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10
  },
  tipcircle: {
    width: 6,
    height: 6,
    backgroundColor: "#00B324",
    borderRadius: 10,
    marginRight: 10
  },
  codeNmu: {
    borderRadius: 5,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15
  },
  codeNmuList: {
    height: 50,
    width: width / 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#717171",
    textAlign: "center",
    backgroundColor: "#171717",
    fontSize: 20,
    color: "#fff"
  }
});
