import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
  Platform,
  TextInput, TouchableOpacity
} from "react-native";
import {
  Button,
  Carousel,
  WhiteSpace,
  WingBlank,
  InputItem,
  Toast,
  Flex
} from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import {Toasts} from '../Toast';

import { NavigationActions } from "react-navigation";

import { I18n, getLanguages } from "../../language/i18n";

const { width, height } = Dimensions.get("window");

import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";
const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      newStyle[key].color = "#999999";
    }
    newStyle[key].borderBottomColor = "#232323";
  }
}

declare var jest: any;

class Registered extends React.Component<any, any> {
  inputRef: any;

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
      name: this.props.memberInfo ? this.props.memberInfo.MemberCode : "", //用戶名
      password: "", //密碼
      repassword: "", // 密碼確認
      number: this.props.phoneNumber, //電話
      memberInfo: this.props.memberInfo,
      email: "", //郵箱
      qq: "", //qq
      wechat: "", //微信
      Scode: "", // 推薦代碼
      VerificationCode: false,
      Countdown: '00:00',//倒计时
	  Reload: false,
	  code1: '',
        code2: '',
        code3: '',
        code4: '',
        code5: '',
		code6: '',
		issubmitBtn: false,

        activeVoice: false,//是否有电话接收验证码
        activeText: true,//是否有短信接受验证码
        UserVerifie: 0,//验证步骤，0进入选择验证方式，1短信验证，2手机验证，3验证完成,
        remainingVerifyAttempts: 5, //剩餘次數
        verifyError: false
    };
  }

  componentWillMount(props) {
    console.log('1')
    if (ApiPort.UserLogin == true) {
      this.getGetRemainingAttempts()
      //倒计时还有效，
      global.storage.load({
        key: 'VerifyPhone',
        id: 'VerifyPhone'
      }).then(ret => {
        let news = (new Date()).getTime() / 1000
        if(ret.times - news > 0) {
          this.setState({
            UserVerifie: ret.UserVerifie,
            activeVoice: ret.activeVoice,
          })
          this.TimeLoad(parseInt(ret.times - news))
        } else {
          this.CheckSMSVendor()
        }
      }).catch(() => {
        this.CheckSMSVendor()
      })
      //   this.PhoneVerify(); //發送驗證碼
    }
  }

  componentWillUnmount() {
    //離開註銷監聽
    RegisteredMG = false;
  }

  getGetRemainingAttempts = () => {
    fetchRequest(ApiPort.GetRemainingAttempts, "GET")
        .then(data => {
          Toast.hide();
          if(data) {
            console.log(data)
            this.setState({
              remainingVerifyAttempts
            })
          }
        })
        .catch(error => {
          Toast.hide();
        });
  }

  CheckSMSVendor() {
    Toast.loading("", 20);
    fetchRequest(ApiPort.CheckSMSVendor, "GET")
        .then(data => {
          Toast.hide();
          if(data) {
            this.setState({
              activeText: data.activeTextSMS,
              activeVoice: data.activeVoiceSMS
            })
          }
        })
        .catch(error => {
          Toast.hide();
        });
  }

  TimeLoad(value) {

    let time = value;
    let m, s, ms;
    this.Countdowns = setInterval(() => {
      time -= 1;
      m = parseInt(time / 60).toString();
      s = time - m * 60;
      if (s < 10) {
        s = "0" + s.toString();
      }
      ms = m + ":" + s;
      if (m < 10) { ms = '0' + m.toString() + ":" + s; }
      this.setState({ Countdown: ms });
      let VerifyPhone = {
        UserVerifie: this.state.UserVerifie,
        activeVoice: this.state.activeVoice,
        times: (new Date()).getTime() / 1000 + time
      }
      global.storage.save({
        key: 'VerifyPhone',
        id: 'VerifyPhone',
        data: VerifyPhone,
        expires: 180 * 1000
      });
      if (m == 0 && s == 0) {
        clearInterval(this.Countdowns);

      }
    }, 1000);

  }
  

  getUser() {
    fetchRequest(ApiPort.Member, "GET")
      .then(data => {
        this.setState({
          memberInfo: data.result.memberInfo
        });

        if (data.result.memberInfo.Contacts.length == 1) {
          this.setState({
            number: data.result.memberInfo.Contacts[0].Contact
          });
        } else if (data.result.memberInfo.Contacts.length != 1) {
          if (data.result.memberInfo.Contacts[0].ContactType == "Phone") {
            this.setState({
              number: data.result.memberInfo.Contacts[0].Contact
            });
          } else {
            this.setState({
              number: data.result.memberInfo.Contacts[1].Contact
            });
          }
        }
      })
      .catch(error => {
        //Toast.hide();
      });
  }

  /*手机号码验证*/
  PhoneVerify(key) {
    let ST = this.state;

    const PhoneData = {
      MsIsdn: ST.number,
      IsRegistration: RegisteredMG, //是不是注册
      IsOneTimeService: false, //只有注册时候才为true
      memberCode: JSON.parse(memberCode),
      currencyCode: "THB",
      SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
      IsMandatoryStep: false,
      serviceAction: "ContactVerification",
      isMandatoryStep: false,
      smsType: key, //1 是 Text SMS, 2 是 Voice SMS
    };
    Toast.loading("กำลังโหลด...", 200);
    fetchRequest(ApiPort.POSTPhoneVerifyAPI+ "&is4Digit=false&", "POST", PhoneData)
      .then(data => {
        Toast.hide();
        if (data.result.message == "SMSLimitTries") {
          
          Toast.success("ส่งหลายครั้งเกินไปโปรดลองอีกครั้งใน 24 ชั่วโมง", 2);
          //Toast.success("发送次数过多,请在24小时后重试", 2);
          return;
        }
        if (data.isSuccess == true) {
          this.TimeLoad(180)
          Toast.success("ส่งรหัส OTP แล้ว โปรดตรวจสอบโทรศัพท์ของคุณเพื่อยืนยันให้สำเร็จ", 2);
          //  Toast.success("已发送手机验证码，请查看手机短信完成验证!", 2);
        } else if (data.isSuccess == false) {
          Toast.fail(data.result.message, 2);
        }
      })
      .catch(data => {
        Toast.fail(data.errorMessage, 1);
      });
  }

  /*手机号码验证*/
  PhoneTAC() {
    let ST = this.state;
    let PhoneData;
    if(!ST.issubmitBtn) { return }
    
    if (ST.password == "") {
      Toast.fail("โปรดกรอกรหัส OTP", 2);
      //oast.fail("请输入验证码", 2);
      return;
    }
    let str = ST.number;
    let strX = str.replace(/ /g, "");

    let xxx = strX.split("");
    let numberS = "";
    if (xxx[0] != "6") {
      numberS = "66-" + strX;
    } else {
      numberS = strX;
    }

    if (ApiPort.UserLogin == true) {
      PhoneData = {
        VerificationCode: ST.password,
        MsIsdn: numberS,
        IsRegistration: RegisteredMG, //是不是注册
        //"IsOneTimeService": false, //只有注册时候才为true
        ServiceAction: "ContactVerification",
        //"memberCode": ST.memberInfo.MemberCode,
        // "currencyCode":'CNY',
        SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
        MemberCode: JSON.parse(memberCode), //name
        IsMandatoryStep: false
      };
    } else {
      PhoneData = {
        VerificationCode: ST.password,
        MsIsdn: numberS,
        IsRegistration: RegisteredMG, //是不是注册
        // "IsOneTimeService": true, //只有注册时候才为true
        SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
        UserName: this.props.username,
        ServiceAction: "RegistrationBonus",
        IsMandatoryStep: true
      };
    }

    Toast.loading("กำลังโหลด...", 200);
    fetchRequest(ApiPort.PhoneTAC + "?", "POST", PhoneData)
      .then(data => {
        Toast.hide();

        if(data.result){
          this.setState({
            remainingVerifyAttempts: data.result.remainingVerifyAttempts
          }) 
        }
        
        if (data.isSuccess == false) {
          Toast.fail(data.result.message, 2);
        } else {
          if (
            data.result.exception == "UE_SMS000" ||
            data.result.exception == "SMS002" ||
            data.result.exception == "SMS001"
          ) {
			this.setState({issubmitBtn: false, verifyError: true})
			Toast.fail(data.result.message, 2,() => {
				this.setState({code1: '',code2: '',code3: '',code4: '',code5:'',code6:''})
			});
          } else {
            Toasts.successV2("ยืนยันเบอร์โทรศัพท์สำเร็จ", 2);
            // Toast.success(data.result.message, 2);
            // 将验证成功结果写入缓存
            const key = userNameDB + "phoneVerify"; //userNameDB是用户名，在Login.js里赋值的
            global.storage.save({
              key,
              id: key,
              data: "success",
              expires: null
            });
            if (ApiPort.UserLogin == true) {
              // memberData();
              window.getAccounrUser && window.getAccounrUser()
              Toast.success("อัปเดตสำเร็จ", 2,() => {
                Actions.pop()
              });
            } else {
              Toast.success("อัปเดตสำเร็จ", 2);
              //Actions.popTo("login")
              if (lookBox == true) {
                NoGoHome = true;
                navigateToSceneGlobe();
                setTimeout(() => {
                  GoHome();
                  lookBox = false;
                }, 1000);
              } else {
                GoHome();
              }
            }
          }
        }
      })
      .catch(error => {
        Toast.fail(error.errorMessage, 1);
      });
  }

  skiltphon() {
    if (ApiPort.UserLogin == true) {
      Actions.pop();
      Actions.popTo("PersonalAccount");
    } else if (lookBox == true) {
      NoGoHome = true;
      navigateToSceneGlobe();

      setTimeout(() => {
        GoHome();
        lookBox = false;
      }, 1000);
    } else {
      GoHome();
      //Actions.popTo("login")
    }
  }
  checked() {
	const {code1,code2,code3,code4,code5,code6,} = this.state;
	let code = code1.toString() + code2.toString() + code3.toString() + code4.toString() + code5.toString() + code6.toString();
	console.log('codecodecode',code.length)
	this.setState({password: code})
	if (code.length == 6) {
		this.setState({issubmitBtn: true})
	} else {
		this.setState({issubmitBtn: false})
	}
 }

  toGetCode(key) {
    console.log(key)
    if(this.state.Countdown != '00:00') { return }

    this.setState({UserVerifie: key})
    this.PhoneVerify(key)
  }

  render() {
    console.log(this.state)
    const {
      Countdown,
      name,
      password,
      repassword,
      number,
      email,
      qq,
      wechat,
	  Scode,
	  code1,
        code2,
        code3,
        code4,
        code5,
		code6,
		issubmitBtn,
        UserVerifie,
        activeText,
        activeVoice,
        remainingVerifyAttempts,
        verifyError
    } = this.state; //註冊訊息

    return (
      <View style={styles.rootContainer}>
        {remainingVerifyAttempts !== 0? <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        >
          <View/>
          {/* <Flex>
            <Flex.Item alignItems="flex-end">
              <Touch
                onPress={this.skiltphon.bind(this)}
                style={styles.phoneStyles}
              >
                <Text style={styles.phoneButton}>跳过验证</Text>
              </Touch>
            </Flex.Item>
          </Flex> */}
          {/* <View style={{ height: 160 }} /> */}

          <View style={{ flex: 1, width: width, paddingHorizontal: 15 }}>

            <View style={{flexDirection: 'row', marginTop: 22}}>
              <Text style={{color: '#FF0000'}}>*</Text>
              <Text style={{color: '#F5F5F5'}}>เบอร์โทรศัพท์</Text>
            </View>

            {UserVerifie === 0?(<Text style={{color: '#848484', marginTop: 6, marginBottom: 34}}>
              ยืนยันเบอร์โทรศัพท์และรับรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์ ของคุณโปรดติดต่อ <Text style={{color: '#00E62E'}} onPress={() => Actions.LiveChatST()}>ฝ่ายบริการลูกค้า</Text> หากต้องการเปลี่ยนเบอร์โทรศัพท์
            </Text>):(<Text style={{color: '#848484', marginTop: 6, marginBottom: 34}}>
              โปรดติดต่อ <Text style={{color: '#00E62E'}} onPress={() => Actions.LiveChatST()}>ฝ่ายบริการลูกค้า</Text> หากต้องการเปลี่ยนเบอร์โทรศัพท์
            </Text>)}


            <View style={{backgroundColor: '#232323', borderRadius: 4, paddingHorizontal: 24, paddingVertical: 5}}>
              <InputItem
                  clear
                  value={this.state.number}
                  onChange={(number: any) => {
                    this.setState({
                      number
                    });
                  }}
                  editable={false}
                  labelNumber={4}
                  placeholder={I18n.t("Registered.4")}
                  placeholderTextColor={'#ccc'}
                  styles={StyleSheet.create(newStyle)}
              />
            </View>

            {
              //选择获取方式
              UserVerifie == 0 &&
              <View>
                {
                  activeText &&
                  <Touch onPress={() => { this.toGetCode(1) }} style={{backgroundColor: '#00B324',borderRadius: 5,marginTop: 20 }}>
                    <Text style={{color: '#fff', lineHeight: 45, textAlign: 'center'}}>ส่งรหัสทาง SMS</Text>
                  </Touch>
                }
              </View>
            }

            {
              //输入验证码
              (UserVerifie == 1 || UserVerifie == 2) &&
              <View>
                {
                  UserVerifie == 1 &&
                  <Touch onPress={() => { this.toGetCode(1) }} style={{backgroundColor: Countdown == '00:00' ? '#00B324' :'#666666',borderRadius: 5,marginTop: 20 }}>
                    <Text style={{color: '#fff', lineHeight: 45, textAlign: 'center'}}>
                      {Countdown == '00:00' ? 'ส่งรหัสอีกครั้ง': 'ส่งรหัสอีกครั้งใน ' + Countdown}
                    </Text>
                  </Touch>
                }
                {
                  UserVerifie == 2 &&
                  <Touch onPress={() => { this.toGetCode(2) }} style={{backgroundColor: Countdown == '00:00' ? '#00B324' :'#666666',borderRadius: 5,marginTop: 20 }}>
                    <Text style={{color: '#fff', lineHeight: 45, textAlign: 'center'}}>
                      {Countdown == '00:00' ? 'โทรอีกครั้ง': 'โทรอีกครั้งใน ' + Countdown}
                    </Text>
                  </Touch>
                }
                <View style={{backgroundColor: '#222222',borderRadius: 10,marginTop: 20, padding: 15}}>
                  <Text style={{color: '#fff', textAlign: 'center', marginBottom: 10}}>กรอกรหัสยืนยันที่ส่งไปยังเบอร์โทรศัพท์ของคุณ</Text>
                  <Text style={{color: '#CCCCCC', lineHeight: 22, textAlign: 'center'}}>
                    หมายเหตุ : หากคุณไม่ได้รับรหัสยืนยันภายใน 3 นาทีกรุณากดส่งรหัสอีกครั้ง คุณสามารถทำการยืนยันได้ 5 ครั้ง
                  </Text>
                  <View style={styles.codeNmu}>
                    <TextInput
                        ref='focus1'
                        maxLength={1}
                        keyboardType = {'number-pad'}
                        value={code1}
                        style={[styles.codeNmuList,{borderColor: verifyError? 'red': '#616161'}]}
                        onChangeText={(val) => {
                          let value = val.replace(/[^0-9]/g,'')
                          this.setState({code1: value},() => {this.checked()})
                          if (value !== '') {
                            this.refs.focus1.blur();//失去焦点
                            this.refs.focus2.focus();//获取焦点
                          }
                        }}
                    />
                    <TextInput
                        ref='focus2'
                        maxLength={1}
                        keyboardType = {'number-pad'}
                        value={code2}
                        style={[styles.codeNmuList,{borderColor: verifyError? 'red': '#616161'}]}
                        onChangeText={(val) => {
                          let value = val.replace(/[^0-9]/g,'')
                          this.setState({code2: value},() => {this.checked()})
                          if (value !== '') {
                            this.refs.focus2.blur();//失去焦点
                            this.refs.focus3.focus();//获取焦点
                          }
                        }}
                    />
                    <TextInput
                        ref='focus3'
                        maxLength={1}
                        keyboardType = {'number-pad'}
                        value={code3}
                        style={[styles.codeNmuList,{borderColor: verifyError? 'red': '#616161'}]}
                        onChangeText={(val) => {
                          let value = val.replace(/[^0-9]/g,'')
                          this.setState({code3: value},() => {this.checked()})
                          if (value !== '') {
                            this.refs.focus3.blur();//失去焦点
                            this.refs.focus4.focus();//获取焦点
                          }
                        }}
                    />
                    <TextInput
                        ref='focus4'
                        maxLength={1}
                        keyboardType = {'number-pad'}
                        value={code4}
                        style={[styles.codeNmuList,{borderColor: verifyError? 'red': '#616161'}]}
                        onChangeText={(val) => {
                          let value = val.replace(/[^0-9]/g,'')
                          this.setState({code4: value},() => {this.checked()})
                          if (value !== '') {
                            this.refs.focus4.blur();//失去焦点
                            this.refs.focus5.focus();//获取焦点
                          }
                        }}
                    />
                    <TextInput
                        ref='focus5'
                        maxLength={1}
                        keyboardType = {'number-pad'}
                        value={code5}
                        style={[styles.codeNmuList,{borderColor: verifyError? 'red': '#616161'}]}
                        onChangeText={(val) => {
                          let value = val.replace(/[^0-9]/g,'')
                          this.setState({code5: value},() => {this.checked()})
                          if (value !== '') {
                            this.refs.focus5.blur();//失去焦点
                            this.refs.focus6.focus();//获取焦点
                          }
                        }}
                    />
                    <TextInput
                        ref='focus6'
                        maxLength={1}
                        keyboardType = {'number-pad'}
                        value={code6}
                        style={[styles.codeNmuList,{borderColor: verifyError? 'red': '#616161'}]}
                        onChangeText={(val) => {
                          let value = val.replace(/[^0-9]/g,'')
                          this.setState({code6: value},() => {this.checked()})
                          if (value !== '') {
                            this.refs.focus6.blur();//获取焦点
                          }
                        }}
                    />
                  </View>
                  {verifyError && (
                      <>
                        <Text style={{color: '#FF0000', textAlign: 'center', marginBottom: 6}}>รหัสยืนยันไม่ถูกต้อง</Text>
                        <Text style={{color: '#CCCCCC', textAlign: 'center', marginBottom: 22}}>คุณสามารถยืนยันข้อมูลได้อีก {remainingVerifyAttempts}/5 ครั้ง</Text>
                      </>
                  )}

                  {
                    <Touch onPress={() => { this.PhoneTAC() }} style={{backgroundColor: issubmitBtn ? '#00B324' :'#666666',borderRadius: 5 }}>
                      <Text style={{color: '#fff', lineHeight: 45, textAlign: 'center'}}>ยืนยัน</Text>
                    </Touch>

                  }
                </View>
                {
                  //等倒计时为0，才能切换手机接收
                  activeVoice &&
                  <Touch
                      onPress={() => { this.toGetCode(UserVerifie == 1? 2: 1) }}
                      style={{borderColor: Countdown == '00:00' ?'#00B324' : '#666666',borderRadius: 5,borderWidth: 1,marginTop: 20 }}
                  >
                    <Text style={{color: Countdown == '00:00' ?'#00B324' : '#666666', lineHeight: 45, textAlign: 'center'}}>{UserVerifie == 1 ? 'ส่งรหัสด้วยการโทร' : 'ส่งรหัสทาง SMS'}</Text>
                  </Touch>
                }
              </View>
            }


            {/*<Flex>*/}
            {/*  <Flex.Item alignItems="center">*/}
            {/*	{*/}
            {/*	issubmitBtn &&*/}
            {/*	<Touch onPress={this.PhoneTAC.bind(this)} style={{padding: 13,width: width,paddingTop: 30}}>*/}
            {/*		<View style={{borderRadius: 5,backgroundColor: '#00b324'}}>*/}
            {/*			<Text style={{color: '#fff',textAlign: 'center',lineHeight: 40,fontSize: 18}}>ส่ง</Text>*/}
            {/*		</View>*/}
            {/*	</Touch>*/}
            {/*	}*/}
            {/*	{*/}
            {/*	!issubmitBtn &&*/}
            {/*	<View style={{padding: 13,width: width,paddingTop: 30}}>*/}
            {/*		<View style={{borderRadius: 5,backgroundColor: '#424242'}}>*/}
            {/*			<Text style={{color: '#fff',textAlign: 'center',lineHeight: 40,fontSize: 18}}>ส่ง</Text>*/}
            {/*		</View>*/}
            {/*	</View>*/}
            {/*	}*/}
            {/*  </Flex.Item>*/}
            {/*</Flex>*/}


          </View>
        </ScrollView>:<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -44}}>
          <Image
              source={require("../../images/icon_warning.png")}
              resizeMode="stretch"
              style={{
                width: 80,
                height: 80,
                alignSelf: "center",
                marginBottom: 25
              }}
          />
          <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 20,
                fontWeight: 'bold',
                marginVertical: 25
              }}
          >
            ยืนยันไม่สำเร็จ
          </Text>
          <Text style={{ color: "#848484", textAlign: "center" }}>
            คุณทำการยืนยันเกินจำนวนครั้งที่กำหนด {'\n'} โปรดลองอีกครั้งในวันพรุ่งนี้หรือติดต่อฝ่ายบริการลูกค้า
          </Text>
          <TouchableOpacity onPress={() => Actions.LiveChatST()}>
            <View
                style={{
                  backgroundColor: "#00B324",
                  marginTop: 30,
                  paddingVertical: 14,
                  borderRadius: 4,
                  width: width - 100,
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
            >
              <Text
                  style={{
                    color: "#fff"
                    // textAlign: "center",
                    // lineHeight: 20,
                    // borderRadius: 4,
                    // alignSelf:'center',
                    // alignContent:'center',
                    // alignItems:'center',
                    // justifyContent:'center',
                  }}
              >
                ติดต่อฝ่ายบริการลูกค้า
              </Text>
            </View>
          </TouchableOpacity>
        </View>}
      </View>
    );
  }
}

export default Registered;

const styles = StyleSheet.create({
  visible: {
    backgroundColor: "#000"
  },
  input: {
    width: 320,
    color: "#fff",
    textAlign: "left",
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#9e9e9e"
  },
  loginButton: {
    fontWeight: "bold",
    borderRadius: 10,
    color: "#fff",
    textAlign: "center",
    fontSize: 16
  },

  phoneButton: {
    fontWeight: "bold",
    borderRadius: 10,
    color: "#fff",
    textAlign: "center",
    fontSize: 14
  },

  rootContainer: {
    flex: 1,
    height: height,
    width: width,
    backgroundColor: "#0a0a0a",
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
    paddingLeft: 70,
    paddingRight: 70,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25
  },
  touchableStyles2: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#4a4a4a",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25
  },
  touchableStyles3: {
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25
  },
  phoneStyles: {
    marginBottom: 15,
    marginRight: 15,
    backgroundColor: "#18a70d",
    borderRadius: 25,
    paddingTop: 10,
    paddingBottom: 10,
    width: 100
  },
  codeNmu: {
	borderRadius: 5,
	padding: 10,
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
	alignItems: 'center',
	marginTop: 15,
},
  codeNmuList: {
	height: 50,
	width: width / 9,
	borderWidth: 1,
	borderRadius: 5,
	borderColor: '#3B3B3B',
	textAlign: 'center',
	backgroundColor: '#000',
	fontSize: 20,
	color: '#fff',
},
});
