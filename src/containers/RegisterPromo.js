import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Linking,
  Alert,
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { Flex, WhiteSpace, Toast } from "antd-mobile-rn";
import CheckBox from "react-native-check-box";

const { width, height } = Dimensions.get("window");
/**
 * 注册成功弹窗
 * (在首页弹出)
 */
class RegisterProno extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
      promotions: null,
    };
  }

  componentDidMount() {}

  //获取优惠数据
  getPromoList(key) {
    fetch(
      "https://www.jbo69.com/cms/Json/JBO_promo_mobile.json?v=" + Math.random(),
      {
        method: "GET",
      }
    )
      .then((response) => (headerData = response.json()))
      .then((data) => {
        this.setState({
          promotions: data,
        });
      })
      .catch((error) => {
        // 错误处理
      });
    return;
  }
  /**
   * 选择何种优惠
   * @param {number} id
   */
  onSelect(id) {
    this.setState({ active: id });
  }

  goDeposit() {
    this.closeRegPromo();

    const { active } = this.state;
    const options = active == 3 ? { initBonusId: 100369 } : {};
    UMonEvent("Deposit Nav", "Click", "Deposit_RegisterSuccess");
    Actions.jump("deposit");
    setTimeout(() => {
      reloadPage && reloadPage("deposit", options);
    }, 100);
  }

  // 关闭
  closeRegPromo() {
    window.toggleRegPromo(false);
  }
  //提交ＣＡ
  PostCACall() {
    // console.log(123)
    const { checkBox } = this.state;
    if (checkBox) {
      console.log(123);
      Toast.loading();
      fetchRequest(ApiPort.POSTCACall + "?", "POST")
        .then((data) => {
          console.log("PostCACall", data);
          Toast.hide();
          if (data.isSuccess) {
            this.closeRegPromo();
            this.goDeposit();
          }
        })
        .catch((error) => {
          //Toast.hide();
        });
    } else {
      this.closeRegPromo();
      this.goDeposit();
    }
  }

  render() {
    const { active, checkBox } = this.state;
    return (
      <Modal
        animationType="fade"
        visible={true}
        transparent={true}
        style={{
          padding: 0,
          width: width * 0.98,
          backgroundColor: "transparent",
        }}
      >
        <View style={styles.modalOverly}>
          <ImageBackground
            resizeMode="stretch"
            // imageStyle={{resizeMode: 'cover'}}
            source={require("../images/regPromo.png")}
            style={{
              width: width * 0.9,
              // height: 551,
              alignItems: "center",
              // justifyContent: 'center',
              position: "relative",
              padding:20
            }}
          >
            <Image
              style={{ width: 60, height: 60, marginBottom: 20, marginTop: 30 }}
              resizeMode="stretch"
              source={require("../images/fill.png")}
            />
            <Text
              style={{
                color: "#fff",
                //fontWeight: "bold",
                fontSize: 16,
                lineHeight: 24,
                marginBottom: 10,
                textAlign: "center"
              }}
            >
              ขอแสดงความยินดี {'\n'} คุณสมัครสมาชิกสำเร็จ
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                lineHeight: 20,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
            โปรโมชั่นพิเศษจัดเต็ม สำหรับสมาชิกใหม่ {'\n'}รับโบนัสแรกเข้าสูงถึง 100%
            </Text>
            <View style={{ width: "90%", marginHorizontal: 16 }}>
              <View
                style={{
                  backgroundColor: "#222222",
                  marginBottom: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14, lineHeight: 20 }}>
                ฝากเงินครั้งแรก รับโบนัสเพิ่มสูงถึง 5,000 บาท
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#222222",
                  marginBottom: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14, lineHeight: 20 }}>
                เดิมพันอีสปอร์ต คืนเงินเดิมพันครั้งแรกสูงถึง 800 บาท
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#222222",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14, lineHeight: 20 }}>
                เดิมพันกีฬาจัดเต็มรับโบนัสแรกเข้า 200%
                </Text>
              </View>
              <View
                style={{
                  alignSelf: "flex-start",
                  marginTop: 20,
                  paddingRight: 15,
                  marginBottom: 10,
                }}
              >
                <CheckBox
                  unCheckedImage={
                    <Image
                      source={require("../images/home/check_default.png")}
                      style={{ width: 13, height: 13 }}
                    />
                  }
                  checkedImage={
                    <Image
                      source={require("../images/home/check_selected.png")}
                      style={{ width: 13, height: 13 }}
                    />
                  }
                  style={{
                    height: 35,
                  }}
                  onClick={() => {
                    this.setState({
                      checkBox: !this.state.checkBox,
                    });
                  }}
                  isChecked={this.state.checkBox}
                  rightTextView={
                    <Text
                      style={{ color: "#CCCCCC", fontSize: 12, marginLeft: 5 }}
                    >
                     ต้องการรับการติดต่อจาก JBO
                    </Text>
                  }
                />
                {checkBox && (
                  <Text
                    style={{
                      color: "#00CAFF",
                      fontSize: 12,
                      marginLeft: 20,
                      position: "absolute",
                      top: 30,
                    }}
                  >
                  ห้ามพลาดการติดต่อจาก JBO {'\n'}เพื่อรับข้อเสนอสุดพิเศษ เฉพาะคุณเท่านั้น
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.PostCACall();
                }}
                style={[
                  styles.recommendStatusBox,
                  {
                    backgroundColor: "#00B324",
                    marginVertical: 40,
                  },
                ]}
              >
                <Text style={[styles.recommendStatusBoxText1]}>
                ฝากตอนนี้
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </Modal>
     
    );
  }
}

export default RegisterProno;

const styles = StyleSheet.create({
  skynetModal: {
    justifyContent: "center",
    flex: 1,
    zIndex: 9999,

    backgroundColor: "rgba(0, 0, 0,0.5)",
  },
  skynetPopup: {
    marginLeft: 10,
    marginRight: 10,
    alignItems: "center",
    width: width - 20,
    height: 1.364 * (width - 20),
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0, 0, 0,0.8)",
    // borderWidth: 1,
    // borderRadius: 5,
    // borderColor: "#00b324",
    zIndex: 9999,
    paddingVertical: 25,
  },

  icon: {
    width: 0.15 * width,
    height: 0.15 * width,
    alignSelf: "center",
  },
  skynetContainer: {
    width: width - 40,
    height: "100%",
    // height: 0.8 * (width - 40),
    // borderBottomLeftRadius: 5,
    // borderBottomRightRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10
  },

  title1: {
    fontSize: 16,
    color: "#fff",
    marginVertical: 10,
    textAlign: "center",
  },
  title2: {
    fontSize: 13,
    color: "#CCCCCC",
    marginVertical: 10,
    textAlign: "center",
  },
  btns: {
    width: "100%",
    // flexDirection: "row",
    justifyContent: "center",
  },
  btnTouch: {
    // width: 190,
    // height: 190
    zIndex: 99999,
    marginHorizontal: 15,
  },
  btnView: {
    // width: "100%",
    flexDirection: "row",
    // height:  "100%",
    // borderBottomWidth: 1,
    // borderBottomColor: "#D8D8D8",
    // alignItems: "center",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#222222",
    marginHorizontal: 30,
    marginBottom: 10,
  },
  btnTextActive: {
    textAlign: "left",
    color: "#F5F5F5",
    marginLeft: 10,
    fontSize: 13,
  },
  btnText2: {
    textAlign: "left",
    color: "#F5F5F5",
    marginLeft: 12,
  },
  selectAcitve: {
    width: 15,
    height: 15,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "#33FF00",
  },
  select: {
    width: 13,
    height: 13,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#999999",
  },

  depoBtn: {
    width: width - 100,
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#00B324",
  },
  depoBtnView: {
    backgroundColor: "#00B324",
  },
  depoBtnText: {
    color: "#fff",
    textAlign: "center",
  },
  closeRegPromo: {
    width: width,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingRight: 15,
  },
  closeRegPromoText: {
    width: 20,
    height: 20,
    fontSize: 15,
    // borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  modalOverly: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	closeModalBtn: {
		position: 'absolute',
		right: 40,
		top: 40
	},
	closeModalBtnText: {
		color: '#fff',
		fontSize: 16
	},
  recommendStatusBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		paddingHorizontal: 20,
		borderRadius: 4
	},
  recommendStatusBoxText1: {
		color: '#fff',
		//fontWeight: 'bold'
	},
});
