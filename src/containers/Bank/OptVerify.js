import React from "react";
import {
  StyleSheet,
  WebView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  TextInput,
  Modal
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Carousel,
  WhiteSpace,
  WingBlank,
  Flex,
  Toast,
  InputItem,
  ActivityIndicator,
  List,
  Picker,
  DatePicker
} from "antd-mobile-rn";
import PickerStyle from "antd-mobile-rn/lib/picker/style/index.native";
import PickerList from "antd-mobile-rn/lib/list/style/index.native";
import moment from "moment";
import ToastNew from "react-native-root-toast";
// const nameTest = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
const nameTest = /^[a-zA-Z0-9'\u4e00-\u9fa5\u0E00-\u0E7F ]{2,50}$/;
const phoneTest = /^[1-9][0-9]{8}$/; //手机号
const phoneCodeTest = /[0-9]{4}/; //手机验证码
const EmailTEST = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; //邮箱
const locatData = require("../locatData.json");
const { width, height } = Dimensions.get("window");
moment.locale();
locatData.forEach(item => {
  item.value = item.label;
});

import ListItems from "antd-mobile-rn/lib/list/style/index.native";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";
import Touch from "react-native-touch-once";
import {Toasts} from "../Toast";

const newStyle9 = {};
for (const key in ListItems) {
  console.log(key)
  console.log(ListItems)
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    newStyle9[key] = { ...StyleSheet.flatten(ListItems[key]) };
    if (key == "Item") {
      newStyle9[key].paddingHorizontal = 12;
      newStyle9[key].marginBottom = 32;
      newStyle9[key].height = 40;
      newStyle9[key].width = width - 30;
      newStyle9[key].overflow = "hidden";
      newStyle9[key].borderWidth = 1;
      newStyle9[key].borderColor = "#18DB02";
      newStyle9[key].borderRadius = 4;
    }
    newStyle9[key].color = "transparent";
    newStyle9[key].fontSize = -999;
    newStyle9[key].backgroundColor = "transparent";
    // newStyle9[key].flexDirection = "row";
  }
}


const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    console.log(InputItemStyle)
    if (key === "input") {
      newStyle[key].color = "#fff";
      newStyle[key].textAlign = "left";
      // newStyle[key].height = 40;
      // newStyle[key].justifyContent = 'center';
      // newStyle[key].alignItems = 'center';
    }
    newStyle[key].fontSize = 13;
    newStyle[key].borderBottomColor = "#1a1a1a";
  }
}
class OptVerify extends React.Component {
  constructor(props) {
    super(props);
    console.log("props", props);
    this.state = {
      isFocusedA: "",
      isFocusedB: "",
      stepOne: false,
      stepTwo: false,
      stepTree: false,
      stepFour: false,
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      username: "",
      isDisabled: false,
      phoneNumber: "",
      phoneCode: "",
      getCode: false,
      getCodeAgain: 0,
      language: "",
      cityData: "",
      detailAdress: "",
      emailNumber: "",
      birthdayDate: "",
      resendedOpt: false,
      sendedOpt: false,
      issubmitBtn: false,
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      code5: "",
      code6: "",
      TimeLoad: "03 : 00",
      password: "",
      toastErrorFlag: false,
      toastSuccessFlag: false,
      toastTitle: "",
      toastMsg: "",
      memberInfo: "",
      isWithdrawal: props.isWithdrawal ? true : false,
      attempts: 0,
      isPhoneEdit: false,
      isEditName: true,
      isEditEmail: true,
      isEditCity: true,
      isEditBrithday: true,
      birthdatValue: "",
      phoneError: false,
      cityOldData: "",
      addressOldData:'',
      cityInput: '',
      profileMasterData: [],

      //手機驗證用
      activeVoice: false,//是否有电话接收验证码
      activeText: true,//是否有短信接受验证码
      UserVerifie: 0,//验证步骤，0进入选择验证方式，1短信验证，2手机验证，3验证完成,
      verifyError: false,
      Countdown: '00:00',//倒计时
    };
  }

  componentWillMount(props) {
    console.log('1')
    if (ApiPort.UserLogin == true) {
      this.GetRemainingAttempts()
      //倒计时还有效，
      global.storage.load({
        key: 'withdrawalVerifyPhone',
        id: 'withdrawalVerifyPhone'
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
  
  componentDidMount() {
    global.storage
      .load({
        key: "depositOptTimeEnd",
        id: "depositOptTimeEnd"
      })
      .then(res => {
        this.setState({ storageTime: res });
        if (new Date().getTime() < res) {
          this.TimeDown();
          this.setState({ sendedOpt: true });
        }
      });
    this.getUser();
    this.getProfileMasterData();
    this.GetRemainingAttempts();
  }

  componentWillUnmount() {
    clearInterval(this.phoneCodeInterval);
  }
  
  GetRemainingAttempts() {
    fetchRequest(ApiPort.GetRemainingAttempts, "GET").then(data => {
      this.setState({ attempts: data.remainingVerifyAttempts });
      if (data.remainingVerifyAttempts == 0) {
        this.setState({ upLimit: true, remainingVerifyAttempts });
      }
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
  
  getProfileMasterData = () => {
    fetchRequest(`${ApiPort.GETProfileMasterData}category=City&`, "GET")
        .then(res=>{
          const data = res.result.map(elem => (
              {
                label: elem.localizedName,
                value: elem.localizedName,
                children: []
              }
          ));
          this.setState({
            profileMasterData: data
          })
        })
  }
  getUser() {
    fetchRequest(ApiPort.Member, "GET").then(data => {
      let memberInfo = data.result.memberInfo;
      this.setState({
        username: memberInfo.FirstName,
        isEditName: memberInfo.FirstName ? false : true,
        birthdayDate: memberInfo.DOB
          ? memberInfo.DOB
          : this.state.birthdayDate,
        isEditBrithday: memberInfo.IsAllowUpdateDOB
      });

      if (memberInfo.Contacts[0]) {
        memberInfo.Contacts.forEach(item => {
          console.log("phon1e", item);
          if (item.ContactType == "Phone") {
            this.setState({ phoneNumber: item.Contact });
          }
          if (item.ContactType == "Email") {
            console.log("emial", item.Contact);
            this.setState({
              emailNumber: item.Contact,
              isEditEmail: item.Contact ? false : true
            });
          }
        });
      }
      let Address = memberInfo.Address;
      this.setState({
        isPhoneEdit: memberInfo.IsMobileAllowChange,
        cityData: Address.City,
        cityOldData: Address.City,
        addressOldData:Address.Address,
        isEditCity: Address.City ? false : true,
        detailAdress: Address.Address,
        memberInfo
      });
      if (this.state.isWithdrawal) {
        // if(memberInfo.IsAddressExisted&&memberInfo.IsDOBExisted&&memberInfo.IsEmailExisted&&memberInfo.IsPhoneVerified){

        // }
        this.setState({ stepOne: true, step1: true });

        // if (!memberInfo.IsAddressExisted || !memberInfo.IsDOBExisted) {
        //   this.setState({ stepOne: true, step1: true });
        // } else if (!memberInfo.IsEmailExisted) {
        //   this.setState({ stepTwo: true, step1: true, step2: true });
        // } else {
        //   this.setState({
        //     stepTree: true,
        //     step1: true,
        //     step2: true,
        //     step3: true,
        //     isDisabled: !this.state.emailNumber
        //   });
        // }
      } else {
        console.log("memberInfo.FirstName", memberInfo.FirstName);
        this.setState({ stepOne: true, step1: true });
        // if (!memberInfo.FirstName) {
        //   this.setState({ stepOne: true, step1: true });
        // } else if (!memberInfo.IsAddressExisted || !memberInfo.IsDOBExisted) {
        //   this.setState({ stepTwo: true, step1: true, step2: true });
        // } else if (!memberInfo.IsEmailExisted) {
        //   this.setState({
        //     stepTree: true,
        //     step1: true,
        //     step2: true,
        //     step3: true,
        //     isDisabled: !this.state.emailNumber
        //   });
        // } else {
        //   this.setState({
        //     stepFour: true,
        //     step1: true,
        //     step2: true,
        //     step3: true,
        //     step4: true
        //   });
        // }
      }
    });
  }
  InputFocus = key => {
    if (this.state.isFocusedA != "error" && key == 0) {
      this.setState({
        isFocusedA: "Focus"
      });
    }
    if (this.state.isFocusedB != "error" && key == 1) {
      this.setState({
        isFocusedB: "Focus"
      });
    }
  };
  InputBlur = key => {
    if (this.state.isFocusedA != "error" && key == 0) {
      this.setState({ isFocusedA: "ok" });
    }

    if (this.state.isFocusedB != "error" && key == 1) {
      this.setState({ isFocusedB: "ok" });
    }
  };

  //用户名验证
  UserName(val) {
    this.setState({
      isFocusedA: nameTest.test(val) ? "Focus" : "error",
      username: val,
      isDisabled: nameTest.test(val)
    });
  }

  //手机验证
  PhoneChange(val, key) {
    if (key == 0) {
      this.setState({
        isFocusedA: phoneTest.test(val) ? "Focus" : "error",
        getCode: phoneTest.test(val),
        phoneNumber: val,
        isDisabled:
          phoneTest.test(val) && phoneCodeTest.test(this.state.phoneCode)
      });
    } else {
      this.setState({
        isFocusedB: phoneCodeTest.test(val) ? "Focus" : "error",
        phoneCode: val,
        isDisabled:
          phoneCodeTest.test(val) && phoneTest.test(this.state.phoneNumber)
      });
    }
  }

  //地址验证
  cityInput(val) {
    // const TS = /[^\u4e00-\u9fa5\w\，\,\(\)]/gi;
    this.setState({
      cityInput: val
      // isDisabled: this.state.cityData && val.replace(TS, "")
    });
  }
  onPickerChange(val) {
    console.log(val)
    this.setState({
      cityData: val.join(" "),
      isDisabled: this.state.detailAdress
    });
  }
  onVisibleChange() {
    if (!this.state.isFocusedA || this.state.isFocusedA == "ok") {
      this.setState({ isFocusedA: "Focus" });
    } else {
      this.setState({ isFocusedA: "ok" });
    }
  }
  DetailAdress(val) {
    // const TS = /[^\u4e00-\u9fa5\w\，\,\(\)]/gi;
    this.setState({
      detailAdress: val
      // isDisabled: this.state.cityData && val.replace(TS, "")
    });
  }

  //邮箱验证
  EmailChange(val) {
    this.setState({
      emailNumber: val,
      isFocusedA: EmailTEST.test(val) ? "Focus" : "error",
      isDisabled: EmailTEST.test(val)
    });
  }
  NextBtn(key) {
    // if (!this.state.isDisabled) {
    //   return;
    // }
    this.setState({
      isFocusedA: "",
      isFocusedB: "",
      isDisabled: false
    });

    if (key == 1) {
      if (this.state.isEditName) {
        this.NameVerifie();
      } else {
        this.setState({ stepOne: false, stepTwo: true, step2: true });
      }
    }
    if (key == 2) {
      if (this.state.isEditBrithday) {
        this.patchSexDob();
      } else {
        console.log(898989, this.state.cityData, this.state.cityOldData,this.state.addressOldData,this.state.detailAdress);
        if (this.state.cityData != this.state.cityOldData||this.state.addressOldData!=this.state.detailAdress) {
          this.AdressVerifie();
        } else {
          if (this.state.isWithdrawal) {
            this.setState({
              stepTwo: true,
              stepOne: false,
              step1: true,
              step2: true
            });
          } else {
            this.setState({
              stepTwo: false,
              stepTree: true,
              step1: true,
              step2: true,
              step3: true
            });
          }
        }
      }
    }
    if (key == 3) {
      if (this.state.isEditEmail) {
        this.EmailVerifie();
      } else {
        if (this.state.isWithdrawal) {
          this.setState({
            stepTree: true,
            stepTwo: false,
            step1: true,
            step2: true,
            step3: true
          });
        } else {
          this.setState({
            stepTree: false,
            stepFour: true,
            step1: true,
            step2: true,
            step3: true,
            step4: true
          });
        }
      }
    }
    if (key == 4) {
      this.PhoneVerifie();
    }
  }

  //验证顺序,忽略已验证
  Verifie() {
    // let Verifie = this.props.UserVerifie;
    // if (Verifie.TwoPhone && !this.state.step2) {
    //     this.setState({
    //         step2: true,
    //         stepOne: false,
    //         stepTwo: true,
    //     })
    // } else if (Verifie.TreeAddress && !this.state.step3) {
    //     this.setState({
    //         step2: true,
    //         step3: true,
    //         stepOne: false,
    //         stepTwo: false,
    //         stepTree: true,
    //     })
    // } else if (Verifie.FourEmail && !this.state.step4) {
    //     this.setState({
    //         step2: true,
    //         step3: true,
    //         step4: true,
    //         stepOne: false,
    //         stepTwo: false,
    //         stepTree: false,
    //         stepFour: true,
    //     })
    // } else {
    //     Actions.pop()
    // }
  }

  GetCode() {
    if (!this.state.getCode) {
      return;
    }
    const PhoneData = {
      MsIsdn: this.state.phoneNumber,
      IsRegistration: false, //是不是注册
      IsOneTimeService: false, //只有注册时候才为true
      memberCode: this.state.memberInfo.MemberCode,
      currencyCode: "CNY",
      SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
      IsMandatoryStep: false,
      serviceAction: "ContactVerification"
    };
    this.setState({ getCode: false });
    this.setState({ getCodeAgain: 180 });
    let s = 180;
    this.phoneCodeInterval = setInterval(() => {
      s -= 1;
      this.setState({ getCodeAgain: s });
      if (s == 0) {
        this.setState({
          getCode: true
        });
        clearInterval(this.phoneCodeInterval);
      }
    }, 1000);
    Toast.loading("", 200);
    fetchRequest(ApiPort.POSTPhoneVerifyAPI, "POST", PhoneData)
      .then(data => {
        Toast.hide();
        if (data.result.message == "SMSLimitTries") {
          Toast.success("ส่งหลายครั้งเกินไปโปรดลองอีกครั้งใน 24 ชั่วโมง\n", 2);
        }
        if (data.isSuccess == true) {
          Toast.success("ส่งรหัสยืนยันทางโทรศัพท์แล้ว กรุณาตรวจสอบ SMS เพื่อทำการยืนยันให้สมบูรณ์", 2);
        } else if (data.isSuccess == false) {
          Toast.fail(data.result.message, 2);
        }
      })
      .catch(data => {
        Toast.fail(data.errorMessage, 1);
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
        key: 'withdrawalVerifyPhone',
        id: 'withdrawalVerifyPhone',
        data: VerifyPhone,
        expires: 180 * 1000
      });
      if (m == 0 && s == 0) {
        clearInterval(this.Countdowns);

      }
    }, 1000);

  }

  NameVerifie() {
    const MemberData = {
      key: "FirstName",
      value1: this.state.username
    };
    this.setState({ username: "" });
    Toast.loading("กำลังยืนยัน โปรดรอสักครู่...", 200);
    fetchRequest(ApiPort.Register, "PATCH", MemberData)
      .then(data => {
        // console.log(data)
        Toast.hide();
        if (data.isSuccess == true) {
          Toast.success("อัปเดตสำเร็จ!");
          this.setState({ stepOne: false, stepTwo: true, step2: true });
          // this.Verifie();
        } else if (data.isSuccess == false) {
          Toast.fail(data.message);
        }
      })
      .catch(error => {
        Toast.fail(error.errorMessage, 1);
      });
  }

  //   PhoneVerifie() {
  //     let PhoneData;
  //     let num = this.state.phoneNumber.replace(/ /g, "");
  //     let numberS = "";
  //     if (num[0] != "8") {
  //       numberS = "86-" + num;
  //     } else {
  //       numberS = num;
  //     }

  //     PhoneData = {
  //       VerificationCode: this.state.phoneCode,
  //       MsIsdn: numberS,
  //       IsRegistration: false, //是不是注册
  //       ServiceAction: "ContactVerification",
  //       SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
  //       MemberCode: this.props.memberInfo.MemberCode, //name
  //       IsMandatoryStep: false
  //     };

  //     this.setState({ phoneCode: "" });
  //     Toast.loading("กำลังยืนยัน โปรดรอสักครู่...", 200);
  //     fetchRequest(ApiPort.PhoneTAC + "?", "POST", PhoneData)
  //       .then(data => {
  //         Toast.hide();
  //         // console.log(data)
  //         if (data.isSuccess == false) {
  //           Toast.fail(data.result.message, 2);
  //         } else {
  //           if (
  //             data.result.exception == "UE_SMS000" ||
  //             data.result.exception == "SMS002" ||
  //             data.result.exception == "SMS001"
  //           ) {
  //             Toast.fail(data.result.message, 2);
  //           } else {
  //             // 将验证成功结果写入缓存
  //             Toast.success("恭喜您，验证成功", 2);
  //             const key = userNameDB + "phoneVerify"; //userNameDB是用户名，在Login.js里赋值的
  //             global.storage.save({
  //               key,
  //               id: key,
  //               data: "success",
  //               expires: null
  //             });
  //             this.Verifie();
  //           }
  //         }
  //       })
  //       .catch(error => {
  //         Toast.fail(error.errorMessage, 1);
  //       });
  //   }
  /*手机号码验证*/
  PhoneTAC() {
    let ST = this.state;
    let PhoneData;
    if (ST.password == "") {
      Toast.fail("กรุณากรอกรหัสยืนยัน", 2);
      return;
    }
    let str = ST.phoneNumber;
    let strX = str.replace(/ /g, "");

    let xxx = strX.split("");
    let numberS = "";
    if (xxx[0] != "6") {
      numberS = "84-" + strX;
    } else {
      numberS = strX;
    }

    PhoneData = {
      VerificationCode: ST.password,
      MsIsdn: numberS,
      IsRegistration: false, //是不是注册
      //"IsOneTimeService": false, //只有注册时候才为true
      ServiceAction: "ContactVerification",
      //"memberCode": ST.memberInfo.MemberCode,
      // "currencyCode":'CNY',
      SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
      MemberCode: this.state.memberInfo.MemberCode, //name
      IsMandatoryStep: false
    };

    Toast.loading("", 200);
    fetchRequest(ApiPort.PhoneTAC + "?", "POST", PhoneData)
      .then(data => {
        Toast.hide();
        console.log(7878, data);
        if (data.result.remainingVerifyAttempts == 0) {
          this.setState({ upLimit: true });
        }
        if (data.isSuccess == false) {
          this.setState({
            toastErrorFlag: true,
            toastTitle: "",
            toastMsg: data.result.message,
            attempts: data.result.remainingVerifyAttempts,
            remainingVerifyAttempts: data.result.remainingVerifyAttempts,
            code1: "",
            code2: "",
            code3: "",
            code4: "",
            code5: "",
            code6: "",
            password: "",
            issubmitBtn: false
          });
          setTimeout(() => {
            this.setState({ toastErrorFlag: false });
          }, 1500);
        } else {
          if (
            data.result.exception == "UE_SMS000" ||
            data.result.exception == "SMS002" ||
            data.result.exception == "SMS001"
          ) {
            this.setState({
              toastErrorFlag: true,
              toastTitle: "",
              toastMsg: data.result.message,
              attempts: data.result.remainingVerifyAttempts,
              code1: "",
              code2: "",
              code3: "",
              code4: "",
              code5: "",
              code6: "",
              issubmitBtn: false,
              verifyError: true,
              password: ""
            });
            setTimeout(() => {
              this.setState({ toastErrorFlag: false });
            }, 1500);
          } else {
            Toasts.successV2("ยืนยันเบอร์โทรสำเร็จ", 1);
            setTimeout(() => {
              this.setState({
                toastSuccessFlag: true,
                toastTitle: "ยืนยันข้อมูลเรียบร้อย",
                toastMsg: "คุณสามารถทำรายการถอนได้ทันที",
              },()=>{
                setTimeout(()=>{
                  this.setState({ toastSuccessFlag: false, optPage: false },()=>{
                    if (this.state.isWithdrawal) {
                      Actions.jump("deposit");
                      setTimeout(() => {
                        reloadPage("withdrawals");
                      }, 100);
                    } else {
                      Actions.jump("deposit");
                      setTimeout(() => {
                        reloadPage("deposit");
                      }, 100);
                    }
                  });
                }, 2000)
              });
            }, 1000);
          }
        }
      })
      .catch(error => {
        Toast.fail(error.errorMessage, 1);
      });
  }

  AdressVerifie() {
    const MemberData = {
      wallet: "MAIN",
      addresses: {
        address: this.state.detailAdress,
        city: this.state.cityData,
        country: "Thailand",
        nationId: 150
      }
    };
    Toast.loading("กำลังยืนยัน โปรดรอสักครู่...", 200);
    fetchRequest(ApiPort.Register, "PUT", MemberData)
      .then(data => {
        console.log(123, data);
        Toast.hide();
        if (data.isSuccess == true) {
          Toast.success("อัปเดตสำเร็จ!");
          // if (this.state.isEditBrithday) {
          //   this.patchSexDob();
          // } else {
          if (this.state.isWithdrawal) {
            this.setState({
              stepTwo: true,
              stepOne: false,
              step1: true,
              step2: true
            });
          } else {
            this.setState({
              stepTwo: false,
              stepTree: true,
              step1: true,
              step2: true,
              step3: true
            });
            // }
          }
        } else if (data.isSuccess == false) {
          if (data.message == "MEM00050") {
            Toast.fail("การตั้งค่าไม่มีการเปลี่ยนแปลง。");
          } else {
            Toast.fail(data.result.Message);
          }
        }
      })
      .catch(error => {
        Toast.fail(error.errorMessage, 1);
      });
  }
  patchSexDob() {
    const { birthdatValue } = this.state;
    console.log(8989, moment(birthdatValue).format("MM-DD-YYYY"));
    let dob = {
      key: "DOB",
      value1: moment(birthdatValue).format("MM-DD-YYYY")
    };
    fetchRequest(ApiPort.Member, "PATCH", dob).then(res => {
      console.log("patchSexDob", res);
      if (res.isSuccess == true) {
        console.log(898989, this.state.cityData, this.state.cityOldData);
        if (this.state.cityData != this.state.cityOldData) {
          this.AdressVerifie();
        } else {
          if (this.state.isWithdrawal) {
            this.setState({
              stepTwo: true,
              stepOne: false,
              step1: true,
              step2: true
            });
          } else {
            this.setState({
              stepTwo: false,
              stepTree: true,
              step1: true,
              step2: true,
              step3: true
            });
          }
        }
      } else {
        if (data.message == "MEM00050") {
          Toast.fail("การตั้งค่าไม่มีการเปลี่ยนแปลง。");
        } else {
          Toast.fail(data.result.Message);
        }
      }
    });
  }
  async successFlow(x) {
    const a = await resolveAfter2Seconds(20);
    const b = await resolveAfter2Seconds(30);
    return x + a + b;
  }
  EmailVerifie() {
    const MemberData = {
      addresses: { nationId: 1 },
      language: "th-th",
      email: this.state.emailNumber,
      wallet: this.state.memberInfo.PreferWallet,
      blackBoxValue: Iovation,
      e2BlackBoxValue: E2Backbox
    };
    Toast.loading("กำลังยืนยัน โปรดรอสักครู่...", 200);
    fetchRequest(ApiPort.PUTMemberlistAPI + "?", "PUT", MemberData)
      .then(res => {
        Toast.hide();
        if (res.isSuccess == false) {
          if (res.result.Message) {
            Toast.fail(res.result.Message);
            return;
          } else {
            Toast.fail("");
            return;
          }
        }
        if (res.isSuccess == true) {
          Toast.success("อัปเดตสำเร็จ!");
          if (this.state.isWithdrawal) {
            this.setState({
              stepTree: true,
              stepTwo: false,
              step1: true,
              step2: true,
              step3: true
            });
          } else {
            this.setState({
              stepTree: false,
              stepFour: true,
              step1: true,
              step2: true,
              step3: true,
              step4: true
            });
          }
        } else if (res.isSuccess == false) {
          Toast.fail(res.result.Message);
        }
      })
      .catch(error => {
        this.setState({ isDisabled: true });
        if (error.message == "MEM00050") {
          Toast.fail("การตั้งค่าไม่มีการเปลี่ยนแปลง");
          return;
        }
        if (error) {
          let errors = JSON.parse(error.content);
          if (errors.error_details) {
            Toast.fail(errors.error_details.Message);
          } else {
            Toast.fail("");
          }
        } else {
          Toast.fail("");
        }
        Actions.pop();
      });
  }

  changeRebateDatePicker(value) {
    console.log(value);
    this.setState({
      birthdayDate: moment(value).format("YYYY-MM-DD"),
      birthdatValue: value
    });
  }
  TimeDown() {
    var m = 3; //分
    var s = 0; //秒
    if (new Date().getTime() < this.state.storageTime) {
      let t = (this.state.storageTime - new Date().getTime()) / 1000;
      let s1 = t / 60;
      let s2 = t % 60;
      m = Math.floor(s1);
      s = Math.floor(s2);
    }

    this.loadInterval = setInterval(() => {
      let Sdb = s < 10 ? "0" + s : s;
      let Mdb = m < 10 ? "0" + m : m;
      this.setState({
        TimeLoad: Mdb + ":" + Sdb
      });

      if (m == 0 && s == 0) {
        clearInterval(this.loadInterval);
        //    this.CheckIsAbleSmsOTP();
        this.setState({
          resendedOpt: true,
          code1: "",
          code2: "",
          code3: "",
          code4: "",
          code5: "",
          code6: "",
          password: "",
          issubmitBtn: false
        });
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
  /*验证码发送*/
  PhoneVerify(number) {
    // this.TimeLoad();
    let ST = this.state;
    const PhoneData = {
      MsIsdn: number,
      IsRegistration: false, //是不是注册
      IsOneTimeService: false, //只有注册时候才为true
      memberCode: this.state.memberInfo.MemberCode,
      currencyCode: "THB",
      SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
      IsMandatoryStep: false,
      serviceAction: "ContactVerification"
    };
    this.setState({ isPhoneEdit:false });
    console.log("PhoneData", PhoneData);
    Toast.loading("", 200);
    fetchRequest(
      ApiPort.POSTPhoneVerifyAPI + "&is4Digit=false&",
      "POST",
      PhoneData
    )
      .then(data => {
        Toast.hide();
        if (data.isSuccess) {
          var threeMinutesLater = new Date();
          threeMinutesLater.setMinutes(threeMinutesLater.getMinutes() + 3);
          global.storage.save({
            key: "depositOptTimeEnd",
            id: "depositOptTimeEnd",
            data: threeMinutesLater.getTime(),
            expires: null
          });
          console.log("發送驗證碼", data);
          this.setState(
            {
              attempts: data.result.remainingVerifyAttempts,
              resendedOpt: false
            },
            () => this.TimeDown()
          );
          setTimeout(() => {
            this.setState({ sendedOpt: true });
          }, 1500);
        } else {
          this.setState({
            toastErrorFlag: true,
            toastMsg: "ส่งรหัสยืนยันไม่สำเร็จ",
            attempts: data.result.remainingVerifyAttempts
          });
          setTimeout(() => {
            this.setState({ toastErrorFlag: false });
          }, 1500);
        }
        // if (data.result.message == "SMSLimitTries") {
        //   Toast.success("发送次数过多,请在24小时后重试", 2);
        //   return;
        // }
        // if (data.isSuccess == true) {
        //   Toast.success("已发送手机验证码，请查看手机短信完成验证!", 2);
        // } else if (data.isSuccess == false) {
        //   Toast.fail(data.result.message, 2);
        // }
      })
      .catch(data => {
        Toast.fail(data.errorMessage, 1);
      });
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
  onback() {
    // Actions.pop();
    if (this.state.isWithdrawal) {
      Actions.deposit();
      setTimeout(() => {
        reloadPage("withdrawals");
      }, 100);
    } else {
      Actions.jump("deposit");
      setTimeout(() => {
        reloadPage("deposit");
      }, 100);
    }
  }

  toGetCode(key) {
    console.log(key)
    if(this.state.Countdown != '00:00') { return }

    this.setState({UserVerifie: key})
    this.PhoneVerifyNew(key)
  }

  /*手机号码验证 v2 目前提款驗證用 */
  PhoneVerifyNew(key) {
    let ST = this.state;
    const PhoneData = {
      MsIsdn: ST.phoneNumber,
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
  
  render() {

    const {
      stepOne,
      stepTwo,
      stepTree,
      stepFour,
      isFocusedA,
      isFocusedB,
      username,
      isDisabled,
      phoneNumber,
      phoneCode,
      getCode,
      getCodeAgain,
      cityData,
      detailAdress,
      emailNumber,
      step1,
      step2,
      step3,
      step4,
      birthdayDate,
      resendedOpt,
      sendedOpt,
      issubmitBtn,
      code1,
      code2,
      code3,
      code4,
      code5,
      code6,
      TimeLoad,
      toastErrorFlag,
      toastMsg,
      toastSuccessFlag,
      upLimit,
      memberInfo,
      isWithdrawal,
      attempts,
      isPhoneEdit,
      isEditName,
      isEditEmail,
      isEditBrithday,
      isEditCity,
      phoneError,
      UserVerifie,
      activeText,
      activeVoice,
      remainingVerifyAttempts,
      verifyError,
      Countdown
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#111111", zIndex: 200 }}>
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
        {/*<ToastNew*/}
        {/*  visible={toastSuccessFlag}*/}
        {/*  position={0}*/}
        {/*  shadow={false}*/}
        {/*  animation={false}*/}
        {/*  hideOnPress={true}*/}
        {/*  backgroundColor="#fff"*/}
        {/*  opacity={1}*/}
        {/*>*/}
        {/*  <Image*/}
        {/*    resizeMode="contain"*/}
        {/*    source={require("../../images/icon_success.png")}*/}
        {/*    style={{ width: 16, height: 16, marginRight: 10 }}*/}
        {/*  />*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      color: "#333333",*/}
        {/*      fontSize: 14*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {toastMsg}*/}
        {/*  </Text>*/}
        {/*</ToastNew>*/}

        <Modal
            animationType='none'
            transparent={true}
            visible={toastSuccessFlag}
            onRequestClose={() => { }}
        >
          <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,paddingHorizontal:20, paddingVertical: 80}}>
              <Image
                  source={require("../../images/icon_success.png")}
                  resizeMode="stretch"
                  style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
              />
              <View>
                {this.state.toastTitle !== "" && <Text style={{color:'#fff',fontSize: 20, fontWeight: 'bold', textAlign:'center',lineHeight:30}}>{this.state.toastTitle}</Text>}
                <Text style={{color:'#CCCCCC',fontSize: 14,textAlign:'center',lineHeight:30}}>{toastMsg}</Text>
              </View>
            </View>
          </View>
        </Modal>
        
        <Flex>
          {/* <Flex.Item style={{ flex: 0.3 }}>
            <TouchableOpacity onPress={() => this.onback()}>
              <Image
                resizeMode="stretch"
                source={require("../../images/icon-back.png")}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </Flex.Item> */}

          <Flex.Item
            style={{ flex: 1.5, alignItems: "center", marginVertical: 10 }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>ยืนยันข้อมูลการถอน</Text>
          </Flex.Item>
          <Flex.Item style={{ flex: 0.2, alignItem: "flex-end" }}>
            <TouchableOpacity onPress={() => this.onback()}>
              <Text style={{ color: "#fff", fontSize: 18 }}>X</Text>
            </TouchableOpacity>
          </Flex.Item>
          {/* {optPage?<Text style={{color:'#fff',fontSize:20,textAlign:'right'}}onPress={()=> Actions.pop()} >X</Text>
             :<Image
                resizeMode="stretch"
                source={require("../../images/home/icon-csb.png")}
                onPress={() => {
                  Actions.LiveChatST();
                }}
                style={{ width: 21, height: 21 }}
            /> } */}
        </Flex>
        {/* <View style={[{height:Platform.OS === 'ios' ? 95 :65, zIndex: 200,},styles.headerTop]}>
                    <TouchableOpacity style={{width: 40, paddingLeft: 10}} onPress={() => {Actions.pop();if(this.props.preferentialPage) {Actions.pop()}}} >
                        <Image resizeMode='stretch' source={require('../images/back_chevron.png')} style={{ width: 14, height: 24}} />
                    </TouchableOpacity>
                    <Text style={{color: '#fff', fontSize: 15}}>完善个人资料</Text>
                    <Text style={{width: 5}}> </Text>
                </View> */}
        <View style={styles.stepList}>
          {step1 && step2 ? (
            <Image
              resizeMode="stretch"
              source={require("../../images/fill.png")}
              style={{ width: 35, height: 35 }}
            />
          ) : (
            <View style={[step1 ? styles.stepActive : styles.steps]}>
              <Text
                style={[styles.stepsText, step1 ? styles.stepTextActive : ""]}
              >
                1
              </Text>
            </View>
          )}

          <Text
            // style={[styles.stepsRow, step2 ? styles.stepActive : ""]}
            style={[
              step2 ? styles.stepsRowActive : styles.stepsRow,
              step2 ? styles.stepActive : ""
            ]}
            // style={step2 ? styles.stepActive : styles.stepsRow}
          />
          {step1 && step2 && step3 ? (
            <Image
              resizeMode="stretch"
              source={require("../../images/fill.png")}
              style={{ width: 35, height: 35 }}
            />
          ) : (
            <View style={[step2 ? styles.stepActive : styles.steps]}>
              <Text
                style={[styles.stepsText, step2 ? styles.stepTextActive : ""]}
              >
                2
              </Text>
            </View>
          )}
          <Text
            // style={step3 ? styles.stepActive : styles.stepsRow}
            style={[
              step3 ? styles.stepsRowActive : styles.stepsRow,
              step3 ? styles.stepActive : ""
            ]}
          />
          {step1 && step2 && step3 && step4 ? (
            <Image
              resizeMode="stretch"
              source={require("../../images/fill.png")}
              style={{ width: 35, height: 35 }}
            />
          ) : (
            <View style={[step3 ? styles.stepActive : styles.steps]}>
              <Text
                style={[styles.stepsText, step3 ? styles.stepTextActive : ""]}
              >
                3
              </Text>
            </View>
          )}
          {!isWithdrawal && (
            <Text
              style={[
                step4 ? styles.stepsRowActive : styles.stepsRow,
                step4 ? styles.stepActive : ""
              ]}
            />
          )}
          {!isWithdrawal && (
            <View style={[step4 ? styles.stepActive : styles.steps]}>
              <Text
                style={[styles.stepsText, step4 ? styles.stepTextActive : ""]}
              >
                4
              </Text>
            </View>
          )}
        </View>

        {upLimit && (
          <View>
            <Image
              source={require("../../images/icon_warning.png")}
              resizeMode="stretch"
              style={{
                width: 80,
                height: 80,
                alignSelf: "center",
                marginTop: 35,
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
          </View>
        )}
        {!upLimit &&
          //提款OPT
        (isWithdrawal ? (
            <View>
              {/* 生日＆地址 */}
              {stepOne && (
                <View>
                  <View style={styles.inputBox}>

                    {/*生日*/}
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#f5f5f5" }}>
                        <Text style={{ color: "red" }}>*</Text> วันเดือนปีเกิด
                      </Text>
                    </View>
                    <View>
                      <DatePicker
                          disabled={!isEditBrithday}
                          title="เลือกวันที่"
                          // value={
                          //   new Date(
                          //     moment(new Date())
                          //       .subtract(18, "year")
                          //       .format("YYYY[年]MM[月]DD[日]")
                          //   )
                          // }
                          minDate={new Date(1930, 1, 1)}
                          maxDate={
                            new Date(moment(new Date()).subtract(18, "year"))
                          }
                          mode="date"
                          //    disabled={!IsAllowUpdateDOB}
                          onChange={this.changeRebateDatePicker.bind(this)}
                          locale={{
                            DatePickerLocale: {
                              year: "",
                              month: "",
                              day: "",
                              hour: "",
                              minute: ""
                            },
                            okText: "ตกลง",
                            dismissText: "ยกเลิก"
                          }}
                      >
                        <List.Item
                            styles={StyleSheet.create(newStyle9)}
                            arrow="empty"
                        >

                          {birthdayDate?(<Text
                              style={{
                                color: "#F5F5F5",
                                width: 230
                              }}
                          >
                            {birthdayDate}
                          </Text>):<Text
                              style={{
                                color: "#CCCCCC",
                                width: 230
                              }}
                          >
                            กรุณาเลือกวันเกิด
                          </Text>}
                          <Image
                              source={require("../../images/datePick.png")}
                              resizeMode="stretch"
                              style={{ width: 17, height:19,position: 'absolute',top: 0, right: -185}}
                          />
                        </List.Item>

                      </DatePicker>
                    </View>

                    {/*城市 鄉鎮*/}
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#f5f5f5" }}>
                        <Text style={{ color: "red" }}>*</Text> จังหวัด
                      </Text>
                    </View>
                    <Flex>
                      <Flex.Item>
                        <TextInput
                            style={[
                              {
                                position: "absolute",
                                textAlign: "left"
                              },
                              styles.input
                            ]}
                            value={cityData}
                            underlineColorAndroid="transparent"
                            placeholder="กรุณาเลือกจังหวัด"
                            placeholderTextColor="#d4d4d4"
                            type="text"
                            returnKeyType="done"
                            editable={false}
                        />
                        <Picker
                            data={this.state.profileMasterData}
                            cols={1}
                            onChange={e => {
                              this.onPickerChange(e);
                            }}
                            onVisibleChange={() => {
                              this.onVisibleChange();
                            }}
                            locale={{
                              okText: "ตกลง",
                              dismissText: "ยกเลิก"
                            }}
                        >
                          <List.Item
                              arrow="down"
                              styles={StyleSheet.create(newStyle9)}
                          />
                        </Picker>
                      </Flex.Item>
                    </Flex>

                    {/*詳細地址*/}
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#f5f5f5" }}>
                        <Text style={{ color: "red" }}>*</Text> ที่อยู่
                      </Text>
                    </View>
                    <View style={styles.DsBorder}>
                      <InputItem styles={StyleSheet.create(newStyle)} 
                                 type="text"
                                 value={detailAdress}
                                 placeholder="กรุณากรอกที่อยู่"
                                 placeholderTextColor={'#fff'}
                                 returnKeyType="done"
                                 onChangeText={value => {
                                   this.DetailAdress(value);
                                 }}
                                 onFocus={() => this.InputFocus(1)}
                                 onBlur={() => this.InputBlur(1)}
                      >
                      </InputItem>
                    </View>
                  </View>
                  <TouchableOpacity
                      onPress={() => {
                        UMonEvent('Verification', 'Submit', 'DOB_Address_ WithdrawalPage');
                        detailAdress &&
                        cityData &&
                        birthdayDate &&
                        this.NextBtn(2);
                      }}
                  >
                    <View
                      style={
                        detailAdress && cityData && birthdayDate
                          ? styles.nextBtn
                          : styles.nextBtnErr
                      }
                    >
                      <Text style={styles.nextText}>ถัดไป</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {stepTwo && (
                <View>
                  <View style={styles.inputBox}>
                    <View style={styles.moneyTitle}>
                      <Text style={{ color: "#f5f5f5" }}>
                        <Text style={{ color: "red" }}>*</Text> อีเมล
                      </Text>
                    </View>
                    <View style={styles.DsBorder}>
                      <InputItem styles={StyleSheet.create(newStyle)}
                                 type="text"
                                 value={emailNumber}
                                 placeholder="กรุณากรอกอีเมล"
                                 placeholderTextColor={'#fff'}
                                 returnKeyType="done"
                                 onChangeText={value => {
                                   this.EmailChange(value, 0);
                                 }}
                                 editable={isEditEmail}
                                 onFocus={() => this.InputFocus(0)}
                                 onBlur={() => this.InputBlur(0)}
                      >
                      </InputItem>
                    </View>
                    <Text
                      style={
                        isDisabled || isFocusedA == "Focus"
                          ? styles.okDescrip
                          : isFocusedA == "error"
                          ? styles.errDescrip
                          : ""
                      }
                    >
                      {/* {isDisabled || isFocusedA == "Focus"
                      ? "*点击提交后，请前往您的邮箱完成验证" */}
                      {isFocusedA == "error" &&
                        "รูปแบบอีเมลไม่ถูกต้อง，รูปแบบอีเมลไม่ถูกต้อง"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      UMonEvent('Verification','Submit','UpdateEmail_Withdrawal_Verification');
                      emailNumber && isFocusedA != "error" && this.NextBtn(3);
                    }}
                  >
                    <View
                      style={
                        emailNumber && isFocusedA != "error"
                          ? styles.nextBtn
                          : styles.nextBtnErr
                      }
                    >
                      <Text style={styles.nextText}>ถัดไป</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {//手机号验证
              stepTree && (
                <View>
                  <View
                    style={{
                      marginTop: 30,
                      padding: 20
                    }}
                  >
                    { UserVerifie == 0 ?(
                        <>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#f5f5f5" }}>
                              <Text style={{ color: "red" }}>*</Text> เบอร์โทรศัพท์
                            </Text>
                          </View>
                          <Text style={{color: '#848484', marginBottom: 31}}>
                            ยืนยันเบอร์โทรศัพท์ของคุณและเลือกรับ OTP ผ่าน SMS หรือการโทร คุณสามารถเปลี่ยนหมายเลขโทรศัพท์ได้เพียง 1 ครั้ง กรุณาติดต่อ <Text style={{color: '#00E62E'}} onPress={() => Actions.LiveChatST()}>ฝ่ายบริการลูกค้า</Text> หากต้องการเปลี่ยนแปลงเบอร์โทรศัพท์
                          </Text>
                        </>
                    ):(
                        <>
                          <View style={styles.moneyTitle}>
                            <Text style={{ color: "#f5f5f5" }}>
                              ยืนยันเบอร์โทรศัพท์
                            </Text>
                          </View>
                          <Text style={{color: '#848484', marginTop: 6, marginBottom: 31}}>
                            โปรดติดต่อ <Text style={{color: '#00E62E'}} onPress={() => Actions.LiveChatST()}>ฝ่ายบริการลูกค้า</Text> หากต้องการเปลี่ยนเบอร์โทรศัพท์
                          </Text>
                        </>
                      )}
                    
                    <View style={styles.DsBorder}>
                      <InputItem styles={StyleSheet.create(newStyle)}
                                 type="text"
                                 value={phoneNumber}
                                 placeholder=""
                                 placeholderTextColor={'#fff'}
                                 returnKeyType="done"
                                 onChangeText={val => {
                                   this.setState({ phoneNumber: val }, () => {
                                     // this.checked();
                                     const numberTest = /^[1-9][0-9]{8}$/;
                                     if (numberTest.test(val) != true) {
                                       this.setState({ phoneError: true });
                                     } else {
                                       this.setState({ phoneError: false });
                                     }
                                   });
                                 }}
                                 editable={isPhoneEdit}
                                 onFocus={() => this.InputFocus(0)}
                                 onBlur={() => this.InputBlur(0)}
                      >
                      </InputItem>
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
                        <View style={{backgroundColor: '#222222',borderRadius: 10,marginTop: 20, padding: 10}}>
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
                                <Text style={{color: '#CCCCCC', textAlign: 'center', marginBottom: 22}}>คุณสามารถยืนยันข้อมูลได้อีก {attempts}/5 ครั้ง</Text>
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
                    {/*{sendedOpt && (*/}
                    {/*  */}
                    {/*)}*/}
                    {phoneError && (
                        <Text style={[styles.errDescrip]}>
                          รูปแบบเบอร์โทรไม่ถูกต้อง
                        </Text>
                    )}
                 
                  </View>
                  
                </View>
              )}
            </View>
          ) : (
            //充值OPT
            <View>
              {//用户名验证
              stepOne && (
                <View>
                  <View style={styles.inputBox}>
                    <Flex
                      style={{
                        marginVertical: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#666666",
                        paddingBottom: 15
                      }}
                    >
                      <Flex.Item
                        style={{ flex: 0.3, justifyContent: "center" }}
                      >
                        <Text style={{ color: "#CCCCCC", fontSize: 15 }}>
                          <Text style={{ color: "red"}}>*</Text>真实姓名
                        </Text>
                      </Flex.Item>
                      <Flex.Item>
                        <TextInput
                          style={[
                            {
                              borderColor:
                                isFocusedA == "error"
                                  ? "red"
                                  : isFocusedA == "ok"
                                  ? "white"
                                  : isFocusedA == "Focus"
                                  ? "green"
                                  : "white"
                            },
                            styles.input
                          ]}
                          value={username}
                          underlineColorAndroid="transparent"
                          placeholder="请输入您的真实姓名"
                          placeholderTextColor="#999999"
                          type="text"
                          returnKeyType="done"
                          onChangeText={value => {
                            this.UserName(value);
                          }}
                          editable={isEditName}
                          onFocus={() => this.InputFocus(0)}
                        />
                      </Flex.Item>
                    </Flex>

                    <View
                      style={{
                        paddingTop: 10,
                        borderRadius: 4,
                        paddingLeft: 10,
                        display: "flex",
                        flexDirection: "row",
                        alignContent: "flex-start",
                        width: "100%",
                        marginRight: 30
                      }}
                    >
                      <Image
                        resizeMode="stretch"
                        source={require("../../images/icon_warning.png")}
                        style={{ width: 15, height: 15, marginRight: 5 }}
                      />
                      <Text
                        style={{
                          lineHeight: 15,
                          paddingRight: 25,
                          color: "#CCCCCC"
                        }}
                      >
                        请确保您的真实姓名和您的银行卡账户姓名一致
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={
                      isFocusedA == "error"
                        ? styles.errDescrip
                        : styles.okDescrip
                    }
                  >
                    {isFocusedA == "error" && "姓名只能输入中文"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      username && isFocusedA != "error" && this.NextBtn(1);
                    }}
                  >
                    <View
                      style={
                        username && isFocusedA != "error"
                          ? styles.nextBtn
                          : styles.nextBtnErr
                      }
                    >
                      <Text style={styles.nextText}>ถัดไป</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {/* 生日＆地址 */}
              {stepTwo && (
                <View>
                  <View style={styles.inputBox}>
                    <Flex>
                      <View
                        style={{ borderBottomWidth: 1, borderColor: "#666666" }}
                      >
                        <DatePicker
                          disabled={!isEditBrithday}
                          title="เลือกวันที่"
                          // value={
                          //   new Date(
                          //     moment(new Date())
                          //       .subtract(18, "year")
                          //       .format("YYYY[年]MM[月]DD[日]")
                          //   )
                          // }
                          minDate={new Date(1930, 1, 1)}
                          maxDate={
                            new Date(moment(new Date()).subtract(18, "year"))
                          }
                          mode="date"
                          //    disabled={!IsAllowUpdateDOB}
                          onChange={this.changeRebateDatePicker.bind(this)}
                          // format="YYYY[年]MM[月]DD[日]"
                        >
                          <List.Item
                            styles={StyleSheet.create(newStyle9)}
                            arrow="horizontal"
                          >
                            <Text style={{ color: "#CCCCCC", marginRight: 20 }}>
                              <Text style={{ color: "red" }}>*</Text>出生日期：
                            </Text>
                            <Text
                              style={{
                                color: "#F5F5F5",
                                textAlign: "right",
                                width: 230
                              }}
                            >
                              {birthdayDate}
                              {/* {birthdayDate
                        ? birthdayDate
                        : moment(new Date())
                            .subtract(18, "year")
                            .format("YYYY/MM/DD")} */}
                            </Text>
                          </List.Item>
                        </DatePicker>
                      </View>
                    </Flex>

                    <Flex
                      style={{
                        borderBottomWidth: 1,
                        borderColor: "#666666",
                        paddingVertical: 5
                      }}
                    >
                      {/* <Text style={[styles.descrip, { height: 30 }]}>{(cityData || isFocusedA == 'Focus' || isFocusedA == 'error') && '城市/城镇'}</Text> */}
                      <Flex.Item style={{ flex: 0.3 }}>
                        <Text style={{ color: "#CCCCCC" }}>
                          <Text style={{ color: "red" }}>*</Text>所在地区：
                        </Text>
                      </Flex.Item>

                      <Flex.Item>
                        <TextInput
                          style={[
                            {
                              position: "absolute",
                              textAlign: "right"
                            },
                            styles.input
                          ]}
                          value={cityData}
                          underlineColorAndroid="transparent"
                          placeholder="城市/城镇"
                          placeholderTextColor="#d4d4d4"
                          type="text"
                          returnKeyType="done"
                          editable={false}
                        />
                        <Picker
                          // disabled={!isEditCity}
                          data={locatData}
                          cols={3}
                          onChange={e => {
                            this.onPickerChange(e);
                          }}
                          onVisibleChange={() => {
                            this.onVisibleChange();
                          }}
                        >
                          <List.Item
                            arrow="horizontal"
                            styles={StyleSheet.create(newStyle)}
                          />
                        </Picker>
                      </Flex.Item>
                    </Flex>
                    {/* <Text style={[styles.descrip, { marginTop: 10 }]}>{(detailAdress || isFocusedB == 'Focus' || isFocusedB == 'error') && '详细地址'}</Text> */}
                    <Flex style={{ paddingVertical: 5, paddingBottom: 30 }}>
                      <TextInput
                        style={[styles.input]}
                        value={detailAdress}
                        underlineColorAndroid="transparent"
                        placeholder="请填写详细地址"
                        placeholderTextColor="#CCCCCC"
                        returnKeyType="done"
                        multiline={true}
                        onChangeText={value => {
                          this.DetailAdress(value);
                        }}
                        onFocus={() => this.InputFocus(1)}
                        onBlur={() => this.InputBlur(1)}
                      />
                    </Flex>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      detailAdress &&
                        cityData &&
                        birthdayDate &&
                        this.NextBtn(2);
                    }}
                  >
                    <View
                      style={
                        detailAdress && cityData && birthdayDate
                          ? styles.nextBtn
                          : styles.nextBtnErr
                      }
                    >
                      <Text style={styles.nextText}>ถัดไป</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {stepTree && (
                <View>
                  <View style={styles.inputBox}>
                    {/* <Text style={styles.descrip}>
              {(EmailNumber ||
                isFocusedA == "Focus" ||
                isFocusedA == "error") &&
                "邮箱地址"}
            </Text> */}
                    <Flex>
                      <Flex.Item style={{ flex: 0.4 }}>
                        <Text style={{ color: "#fff", textAlign: "center" }}>
                          <Text style={{ color: "red" }}>* </Text>อีเมล：
                        </Text>
                      </Flex.Item>
                      <Flex.Item>
                        <TextInput
                          style={[styles.input]}
                          value={emailNumber}
                          underlineColorAndroid="transparent"
                          placeholder="请输入您的邮箱地址"
                          placeholderTextColor="#d4d4d4"
                          type="text"
                          returnKeyType="done"
                          onChangeText={value => {
                            this.EmailChange(value, 0);
                          }}
                          editable={isEditEmail}
                          onFocus={() => this.InputFocus(0)}
                          onBlur={() => this.InputBlur(0)}
                        ></TextInput>
                      </Flex.Item>
                    </Flex>

                    <Text
                      style={
                        isDisabled || isFocusedA == "Focus"
                          ? styles.okDescrip
                          : isFocusedA == "error"
                          ? styles.errDescrip
                          : ""
                      }
                    >
                      {isFocusedA == "error" &&
                        "รูปแบบอีเมลไม่ถูกต้อง，กรุณากรอกที่อยู่อีเมลที่ถูกต้อง"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      emailNumber && isFocusedA != "error" && this.NextBtn(3);
                    }}
                  >
                    <View
                      style={
                        emailNumber && isFocusedA != "error"
                          ? styles.nextBtn
                          : styles.nextBtnErr
                      }
                    >
                      <Text style={styles.nextText}>ถัดไป</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {//手机号验证
              stepFour && (
                <View>
                  <View
                    style={{
                      backgroundColor: "#222222",
                      marginVertical: 20,
                      padding: 20
                    }}
                  >
                    <Flex style={{ paddingVertical: 10 }}>
                      <Flex.Item style={{ flex: 0.6 }}>
                        <Text style={{ color: "#fff", textAlign: "left" }}>
                          <Text style={{ color: "red" }}>* </Text>手机号：
                        </Text>
                      </Flex.Item>
                      <Flex.Item>
                        <TextInput
                          style={[styles.input]}
                          value={phoneNumber}
                          underlineColorAndroid="transparent"
                          placeholder="手机号"
                          placeholderTextColor="#d4d4d4"
                          onChangeText={val => {
                            this.setState({ phoneNumber: val }, () => {
                              // this.checked();
                              const numberTest =/^[1-9][0-9]{8}$/;
                              if (numberTest.test(val) != true) {
                                this.setState({ phoneError: true });
                              } else {
                                this.setState({ phoneError: false });
                              }
                            });
                          }}
                          editable={isPhoneEdit}
                          onFocus={() => this.InputFocus(0)}
                          onBlur={() => this.InputBlur(0)}
                        ></TextInput>
                      </Flex.Item>
                      <Flex.Item style={{ flex: 0.7 }}>
                        <TouchableOpacity
                          onPress={() =>
                            ((!sendedOpt && !phoneError) || resendedOpt) &&
                            this.PhoneVerify(this.state.phoneNumber)
                          }
                        >
                          <View
                            style={{
                              backgroundColor:
                                (!sendedOpt && !phoneError) || resendedOpt
                                  ? "#00B324"
                                  : "#666666",
                              padding: 10,
                              alignSelf: "flex-end",
                              borderRadius: 4
                            }}
                          >
                            {/* {console.log("TimeLoad",TimeLoad)} */}
                            <Text
                              style={{ color: "#fff", textAlign: "center" }}
                            >
                              {resendedOpt
                                ? "ส่งรหัสยืนยันอีกครั้ง"
                                : sendedOpt
                                ? TimeLoad
                                : "ส่งรหัสยืนยัน"}
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
                        <Text
                          style={{
                            color: "#999999",
                            textAlign: "center",
                            marginTop: 10
                          }}
                        >
                          您还有{" "}
                          <Text style={{ color: "red" }}>{attempts}</Text>{" "}
                          次尝试机会
                        </Text>
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
                              if (value !== "") {
                                this.refs.focus6.blur(); //失去焦点
                              }
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
                        <Text
                          style={{ color: "#00E62E" }}
                          onPress={() => Actions.LiveChatST()}
                        >
                          在线客服
                        </Text>
                      </Text>
                    </Text>
                  </View>
                  {phoneError && (
                    <Text style={[styles.errDescrip]}>
                      รูปแบบเบอร์โทรไม่ถูกต้อง
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() => issubmitBtn && this.PhoneTAC()}
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
              )}
            </View>
          ))}
      </View>
    );
  }
}

export default OptVerify;

const styles = StyleSheet.create({
  headerTop: {
    top: 0,
    backgroundColor: "#111111",
    width: width,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
    padding: 6
  },
  stepList: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20
  },
  steps: {
    width: 35,
    borderColor: "#fff",
    borderWidth: 1,
    // backgroundColor: "#2a2a2a",
    borderRadius: 100,
    marginHorizontal: 10
  },
  stepsText: {
    textAlign: "center",
    color: "#fff",
    lineHeight: 32
  },
  stepTextActive: {
    color: "#00B324"
  },
  stepsRow: {
    width: 40,
    height: 2,
    backgroundColor: "#2a2a2a"
  },
  stepsRowActive: {
    width: 40,
    height: 2,
    backgroundColor: "#00B324"
  },
  stepActive: {
    width: 35,
    borderColor: "#0d7f00",
    borderWidth: 1,
    borderRadius: 100,
    marginHorizontal: 10
  },
  inputBox: {
    position: "relative",
    padding: 15,
    backgroundColor: "#222222",
    marginTop: 20,
    marginBottom: 20
  },
  input: {
    // textAlign: "left",
    paddingTop: 10,
    paddingBottom: 10,
    // marginTop: 5,
    // marginBottom: 10,
    fontSize: 15,
    // borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: "white",
    width: "100%"
  },
  codeBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  inputCode: {
    textAlign: "left",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: "white",
    width: "60%"
  },
  getCode: {
    backgroundColor: "#2d2d2d",
    borderRadius: 5
  },
  getCodeActive: {
    backgroundColor: "#0d7f00",
    borderRadius: 5
  },
  codeText: {
    color: "#fff",
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "center"
  },
  descrip: {
    color: "#fff",
    paddingLeft: 10
  },
  okDescrip: {
    color: "#CCCCCC",
    paddingLeft: 10
  },
  errDescrip: {
    color: "red",
    paddingLeft: 10
  },
  submitBtn: {
    backgroundColor: "#18DB02",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 10
  },
  submitBtn2: {
    backgroundColor: "#666666",
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 10
  },
  nextBtn: {
    backgroundColor: "#18DB02",
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal:20
  },
  nextText: {
    textAlign: "center",
    lineHeight: 35,
    color: "#fff",
    fontSize: 18
  },
  nextBtnErr: {
    backgroundColor: "#666666",
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal:20
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
  },
  moneyTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height:35,
  },
  DsBorder: {
    borderWidth: 1,
    borderColor: '#18DB02',
    borderRadius:5,
    height:40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:3,
  },
  OPTDsBorder: {
    borderWidth: 1,
    borderColor: '#18DB02',
    borderRadius:5,
    height:40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:32,
    paddingVertical: 10
  },
});
