import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Toast, 
} from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";

class LoginOptVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Phone: "",
      Email: "",
      moreShow: false,
      verificationType: "",
      noMoreverifcation: true,
      verifyTimes: "", //剩余提交驗證次数
      verifyLimitReached: false,
      loadingFinished: false,
      emailVerifyTimes: "",
      smsVerifyTimes: "",
      emialSendTime: "",
      SmsSendTime: "",
      isPhoneWithinTD: false,
      isEmailWithinTD: false,
      username:this.props.username
    };
    console.log('username',this.props.username)
  }

  componentDidMount() {
    // Toast.loading("加载中,请稍候...", 2000);
    Toast.loading("đang tải...", 2000);
    let processed = [this.GetMemberInformation(), this.getRemainingAttempts()];
    Promise.all(processed).then((res) => {
      if (res) {
        this.setState({
          loadingFinished: true,
        });
        Toast.hide();
      }
    });
    global.storage
      .load({
        key: "VerifyPhone",
        id: "VerifyPhone",
      })
      .then((res) => {
        console.log('VerifyPhone res=====',res)
        if (new Date().getTime() < res) {
          this.setState({ isPhoneWithinTD: true });
          // this.TimeDownPhone();
        }
      });
    global.storage
      .load({
        key: "VerifyEmail",
        id: "VerifyEmail",
      })
      .then((res) => {
        //   this.setState({ storageTime: res });
        if (new Date().getTime() < res) {
          this.setState({ isEmailWithinTD: true });
          // this.TimeDownEmail();
        }
      });
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  getRemainingAttempts = () => {
    return fetchRequest(
      ApiPort.VerifyOtpRemainingAttempts + "verificationType=RevalidatePassword&",
      "GET"
    )
      .then((res) => {
        console.log("done", res);
        if (res) {
          if (res.isSuccess) {
            let EmailTimes, SmsTimes, EmailSendTs;
            res.otpAttemptDetails.forEach((item) => {
              if (item.channel && item.channel == "Email") {
                EmailTimes = item.remainingVerifyAttempts;
                EmailSendTs = item.remainingSendAttempts;
              }
              if (item.channel && item.channel == "SmsText") {
                SmsTimes = item.remainingVerifyAttempts;
                SmsSendTs = item.remainingSendAttempts;
              }
            });
            console.log(
              "EmailTimes",
              EmailTimes,
              "SmsTimes",
              SmsTimes,
              "EmailSendTs",
              EmailSendTs,
              "SmsSendTs",
              SmsSendTs
            );
            this.setState({
              emailVerifyTimes: EmailTimes,
              smsVerifyTimes: SmsTimes,
              emialSendTime: EmailSendTs,
              SmsSendTime: SmsSendTs,
            });
          } else {
            Toasts.fail("验证服务异常，请稍后再试", 2);
          }
        } else {
          Toasts.fail("验证服务异常，请稍后再试", 2);
        }
      })
      .catch((err) => {
        Toasts.fail("验证服务异常，请稍后再试", 2);
      });
  };

  setMemberInformation = (res) => {
    let Phone = res.result.memberInfo.Contacts.find(
      (v) => v.ContactType === "Phone"
    );
    let Email = res.result.memberInfo.Contacts.find(
      (v) => v.ContactType === "Email"
    );
    this.setState({
      memberInfo: res.result.memberInfo,
      Phone: Phone ? Phone.Contact : "",
      Email: Email ? Email.Contact : "",
    });
  };

  GetMemberInformation = () => {
    return fetchRequest(ApiPort.Member, "GET")
      .then((res) => {
        console.log("done");
        if (res.isSuccess && res.result.memberInfo) {
          let Phone = res.result.memberInfo.Contacts.find(
            (v) => v.ContactType === "Phone"
          );
          let Email = res.result.memberInfo.Contacts.find(
            (v) => v.ContactType === "Email"
          );
          global.storage.save({
            key: "VerifyMemberInfo",
            id: "VerifyMemberInfo",
            data: res,
            expires: null,
          });
          this.setState({
            memberInfo: res.result.memberInfo,
            Phone: Phone ? Phone.Contact : "",
            Email: Email ? Email.Contact : "",
          });
        }
      })
      .catch((error) => {
        console.log("GetMemberInformation:", error);
      });
  };

  clickMore = () => {
    this.setState({ moreShow: !this.state.moreShow });
  };

  clickVerifyType = (type) => {
    const { verificationType, Email, smsVerifyTimes, emailVerifyTimes } =
      this.state;
    console.log(type);
    if (type == "phone") {
      UMonEvent("Navigation", "Click", "Phone_ResetPW");
    } else {
      UMonEvent("Navigation", "Click", "Email_ResetPW");
    }
    console.log('username====',this.props.username)
    
    this.setState({ verificationType: type }, () => {
      Actions.RevVerification({
        dataPhone: this.state.Phone,
        dataEmail: this.state.Email,
        verificaType: type,
        memberInfo: this.state.memberInfo,
        username:this.props.username,
        noMoreverifcation: this.noMoreverifcation,
        //title: type === "phone" ? "手机验证" : "邮箱验证",
        title: type === "phone" ? "ยืนยันข้อมูลเบอร์โทรศัพท์" : "ยืนยันข้อมูลอีเมล",
        verifyTimes: type === "phone" ? smsVerifyTimes : emailVerifyTimes,
        updateVerifyTimes: (val) => this.updateVerifyTimes(type, val),
        updateVerifyLimitReached: (val) => this.updateVerifyLimitReached(val),
        verFail: () => this.verFail(),
        updateSendTimes: (val) => this.updateSendTimes(type, val),
        emialSendTime: this.state.emialSendTime,
        SmsSendTime: this.state.SmsSendTime,
      });
    });
  };

  noMoreverifcation = () => {
    this.setState({ noMoreverifcation: false });
  };

  goLiveChat = () => {
    UMonEvent("CS", "Click", "CS_ResetPW");
    navigateToSceneGlobe();
    setTimeout(() => {
      Actions.LiveChatST();
    }, 200);
  };

  updateSendTimes = (type, num) => {
    console.log("updateSendTimes", type, num);
    if (type === "phone") {
      this.setState({ SmsSendTime: num });
      Actions.refresh({ SmsSendTime: num });
    } else {
      this.setState({ emialSendTime: num });
      Actions.refresh({ emialSendTime: num });
    }
  };
  updateVerifyTimes = (type, num) => {
    console.log("updateVerifyTimes", type, num);
    if (type === "phone") {
      this.setState({ smsVerifyTimes: num });
      //   Actions.refresh({ smsVerifyTimes: num });
    } else {
      this.setState({ emailVerifyTimes: num });
      //   Actions.refresh({ emailVerifyTimes: num });
    }
    Actions.refresh({ verifyTimes: num });
  };

  verFail = () => {
    this.noMoreverifcation();
    this.setState({
      verifyLimitReached: true,
    });
  };

  updateVerifyLimitReached = (val) => {
    this.setState({
      verifyLimitReached: val,
    });
    Actions.refresh({ verifyLimitReached: val });
  };

  goFail(){
    Actions.RevVerifyFail()
  }

  render() {
    const {
      SmsSendTime,
      emialSendTime,
      smsVerifyTimes,
      emailVerifyTimes,
      moreShow,
      Phone,
      Email,
      loadingFinished,
      verifyLimitReached,
      isEmailWithinTD,
      isPhoneWithinTD,
    } = this.state;
    return (
      <View style={[styles.viewContainer]}>
        {/* {verifyLimitReached && <RevVerifyFail />} */}
        {verifyLimitReached && this.goFail()}
        {!verifyLimitReached && (
          <View>
            {moreShow ? (
              <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
                <View>
                  <Text
                    style={{
                      color: "#F5F5F5",
                      fontSize: 14,
                      lineHeight: 20,
                      marginBottom: 15,
                    }}
                  >
                    เรียนสมาชิก
                  </Text>
                  <Text
                    style={{
                      color: "#F5F5F5",
                      fontSize: 14,
                      lineHeight: 20,
                      marginBottom: 15,
                    }}
                  >
                    เพื่อการรักษามาตรฐานการบริการ เรากำลังอัพเกรด และปรับปรุงระบบของเราอย่างต่อเนื่อง 
                    โดยขณะนี้เรากำลังอัพเกรดระบบความปลอดภัยบัญชีข้อมูลสมาชิก 
                    เรามีความจำเป็นในการขอความร่วมมือในการยืนยันหมายเลขโทรศัพท์ หรืออีเมลเพื่อให้แน่ใจว่าคุณเข้าสู่ระบบแล้ว  
                  </Text>
                  <Text
                    style={{
                      color: "#F5F5F5",
                      fontSize: 14,
                      lineHeight: 20,
                      marginBottom: 15,
                    }}
                  >
                    เพื่อเป็นการปกป้องข้อมูลของคุณ ด้วยการการตรวจสอบรหัสผ่านช่องทาง SMS หรืออีเมลของคุณ
                    เพื่อที่เราจะสามารถช่วยยืนยันการเข้าสู่ระบบของคุณได้ทันที โดยเราจะส่งรหัสตัวเลข 6 หลัก ไปยังโทรศัพท์มือถือ หรืออีเมลของคุณ โดยคุณสามารถยืนยัน โดยการระบุรหัสตัวเลขทั้ง 6 หลัก ลงบนหน้าเว็บไซต์ 
                    หากคุณยังไม่ได้ยืนยันเบอร์โทรศัพท์มือถือ หรืออีเมลของคุณ กรุณาติดต่อฝ่ายบริการลูกค้าของเรา เพื่อการดำเนินการช่วยเหลือขั้นตอนต่อไป 
                  </Text>
                  <Text
                    style={{
                      color: "#F5F5F5",
                      fontSize: 14,
                      lineHeight: 20,
                      marginBottom: 15,
                    }}
                  >
                    เราได้ปรับปรุง และพัฒนาอย่างเต็มที่ เพื่อการปกป้องข้อมูลส่วนบุคคลของสมาชิก
                    และเราหวังว่าจะได้รับความร่วมมือจากทุกท่านด้วยดี
                  </Text>
                  <Text
                    style={{
                      color: "#F5F5F5",
                      fontSize: 14,
                      lineHeight: 23,
                      marginBottom: 15,
                    }}
                  >
                    ขอบคุณ{'\n'}JBO               
                  </Text>
                 
                </View>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => {
                    UMonEvent("Back_loginOTP");
                    this.clickMore();
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#00B324",
                      borderRadius: 4,
                      padding: 13,
                      marginTop: 16,
                    }}
                  >
                    <Text
                      style={{
                        color: "#F5F5F5",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      {/* 立即验证 */}
                      ดำเนินการตรวจสอบ
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ paddingVertical: 20, paddingHorizontal: 15 }}>
                <Text
                  style={{
                    color: "#F5F5F5",
                    fontSize: 14,
                    lineHeight: 24,
                  }}
                >
                  โปรดตรวจสอบข้อมูลของคุณเพื่อให้แน่ใจว่าบัญชีของคุณปลอดภัยจากการป้องกันทางไซเบอร์, การป้องกันการโจรกรรม และลดความเสี่ยงในการทำธุรกรรม
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 40,
                    justifyContent: "center",
                  }}
                >
                  {console.log(1212, Email, emailVerifyTimes, smsVerifyTimes)}
                  {loadingFinished &&
                  Email &&
                  ((emailVerifyTimes > 0 && emialSendTime > 0) ||
                    (emialSendTime == 0 && isEmailWithinTD)) ? (
                    <TouchableOpacity
                      onPress={() => this.clickVerifyType("email")}
                    >
                      <View style={styles.otpImgWrap}>
                        <Image
                          resizeMode="stretch"
                          source={require("../../images/login/email.png")}
                          style={{ width: 36, height: 36 }}
                        />
                      </View>
                      <Text style={{ color: "#CCCCCC", fontSize: 12, textAlign:"center" }}>
                        {/* 通过邮箱验证 */}
                        ยืนยันข้อมูล{'\n'}อีเมล
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {loadingFinished &&
                  Phone &&
                  ((smsVerifyTimes > 0 && SmsSendTime > 0) ||
                    (SmsSendTime == 0 && isPhoneWithinTD)) ? (
                    <TouchableOpacity
                      style={{ 
                        marginLeft: 
                        Email && ((emailVerifyTimes > 0 && emialSendTime > 0) || (emialSendTime == 0 && isEmailWithinTD))  
                        ? 32 : 0 }}
                      onPress={() => this.clickVerifyType("phone")}
                    >
                      <View style={styles.otpImgWrap}>
                        <Image
                          resizeMode="stretch"
                          source={require("../../images/login/phone.png")}
                          style={{ width: 36, height: 36 }}
                        />
                      </View>
                      <Text style={{ color: "#CCCCCC", fontSize: 12, textAlign:"center" }}>
                        {/* 通过手机验证 */}
                        ยืนยันข้อมูล{'\n'}เบอร์โทรศัพท์
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={{
                      marginLeft:
                        (Email &&
                          ((emailVerifyTimes > 0 && emialSendTime > 0) ||
                            (emialSendTime == 0 && isEmailWithinTD))) ||
                        (Phone &&
                          ((smsVerifyTimes > 0 && SmsSendTime > 0) ||
                            (SmsSendTime == 0 && isPhoneWithinTD)))
                          ? 32
                          : 0,
                    }}
                    onPress={() => {
                      this.goLiveChat();
                    }}
                  >
                    <View style={styles.otpImgWrap}>
                      <Image
                        resizeMode="stretch"
                        source={require("../../images/login/cs.png")}
                        style={{ width: 36, height: 36 }}
                      />
                    </View>
                    <Text style={{ color: "#CCCCCC", fontSize: 12, textAlign:"center" }}>
                      {/* 通过客服验证 */}
                      ติดต่อเจ้าหน้าที่{'\n'}ฝ่ายบริการ
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => {
                    UMonEvent("Details_loginOTP");
                    this.clickMore();
                  }}
                >
                  <View
                    style={{
                      borderColor: "#00B324",
                      borderWidth: 1,
                      borderRadius: 4,
                      padding: 13,
                      marginTop: 50,
                    }}
                  >
                    <Text
                      style={{
                        color: "#00B324",
                        textAlign: "center",
                        fontSize: 16,
                      }}
                    >
                      {/* 了解更多 */}
                      ข้อมูลเพิ่มเติม
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

export default LoginOptVerify;

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  otpImgWrap: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
  },
});
