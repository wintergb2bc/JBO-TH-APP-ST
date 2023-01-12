import React from "react";
import {
  StyleSheet,
  Linking,
  Clipboard,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import {
  Carousel,
  WhiteSpace,
  Modal,
  WingBlank,
  Flex,
  Toast,
  InputItem,
  Picker,
  List,
  Button
} from "antd-mobile-rn";
import styles from "./bankStyle";
import Touch from "react-native-touch-once";
import QRCodeS from "react-native-qrcode";
import QRCodeA from "react-native-qrcode-svg";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index";
const { width, height } = Dimensions.get("window");

const TextStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    TextStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };

    TextStyle[key].fontSize = 14;
    TextStyle[key].fontWeight = "bold";

    TextStyle[key].color = "#fff";
    TextStyle[key].borderBottomColor = "#1a1a1a";
  }
}

const LBname = {
  Alipay: "支付宝",
  LocalBank: "银行卡",
  ATM: "自动柜员机",
  Mobile: "手机",
  "Cash-ATM": "无卡",
  IB: "跨行",
  MB: "手机",
  OTC: "柜台",
  IBT: "同行"
};

let TimeV1;
let TimeV2;

class DepositPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  CopyText(Text) {
    UMonEvent('Copy_Crypto_deposit');
    Clipboard.setString(Text + "");
    Toast.info("คัดลอกแล้ว", 1);
  }
  CTCimage(type) {
    let image;
    let text;
    let widthSize;
    let heightSize;
    switch (type) {
      case 'USDT-TRC20':
        image = require(`../../images/bank/Tether_trc.png`)
        text = '泰达币-TRC20 (USDT-TRC20)'
        widthSize = 0.259;
        heightSize = 0.06;
        break;
    case 'USDT-ERC20':
        image = require(`../../images/bank/Tether_erc.png`)
        text = '泰达币-ERC20 (USDT-ERC20)'
        widthSize = 0.259;
        heightSize = 0.06;
        break;
      // case "BTC":
      //   image = require(`../../images/bank/bitcoin_label.png`);
      //   text = "比特币(BTC)";
      //   widthSize = 0.248;
      //   heightSize = 0.06;
      //   break;
      // case "ETH":
      //   image = require(`../../images/bank/ethereum_label.png`);
      //   text = "以太坊(ETH)";
      //   widthSize = 0.19;
      //   heightSize = 0.06;
      //   break;
      // case "USDT-ERC20":
      //   image = require(`../../images/bank/tether_label.png`);
      //   text = "泰达币 (USDT-ERC20)";
      //   widthSize=0.06*4.25;
      //   heightSize = 0.06;
      //   break;
    }
    return (
        <Image
          resizeMode='stretch'
          style={{ width: width * widthSize, height: width * heightSize }}
          source={image}
        />
    );
  }
  render() {
    const { CTCData } = this.props;
    return (
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
              <Text style={{ color: "#fff", fontSize: 18 }}>加密货币充值</Text>
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
          <ScrollView style={{height:'100%'}}>
            <Flex
              style={{
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#222222",
                marginBottom: 10,
                width: "100%"
              }}
            >
              <Flex.Item>{this.CTCimage(CTCData.BaseCurrency)}</Flex.Item>
              <Flex.Item>
                <Text style={{ color: "#CCCCCC", textAlign: "right" }}>
                  极速虚拟币支付
                </Text>
              </Flex.Item>
            </Flex>
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#222222",
                marginBottom: 10,
                width: "100%",
                paddingHorizontal: 10
              }}
            >
              <Text
                style={{ paddingVertical: 10, fontSize: 16, color: "#F5F5F5" }}
              >
                参考汇率
              </Text>
              <View
                style={{
                  borderRadius: 4,
                  padding: 8,
                  backgroundColor: "#333333"
                }}
              >
                <Text style={{ color: "#F5F5F5" }}>
                  1 {CTCData.BaseCurrency} = {CTCData.ExchangeRate} RMB
                </Text>
              </View>

              <Text
                style={{
                  paddingVertical: 10,
                  color: "#999999",
                  fontSize: 12,
                  alignSelf: "flex-end"
                }}
              >
                此汇率仅供参考，交易将以实时汇率进行
              </Text>
            </View>
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "#222222",
                marginBottom: 10,
                width: "100%",
                padding: 10
              }}
            >
              <Text style={{ fontSize: 16, color: "#F5F5F5" }}>充值方式</Text>
              <View style={{ alignSelf: "center", paddingVertical: 20 }}>
                {Platform.OS == "ios" && (
                  <QRCodeS
                    ref="viewShot"
                    value={CTCData.DeepLink}
                    size={150}
                    bgColor="#000"
                  />
                )}
              </View>
              <View style={{ alignSelf: "center" ,paddingVertical: 20}}>
                {Platform.OS == "android" && (
                  <QRCodeA
                    ref="viewShot"
                    value={CTCData.DeepLink}
                    size={150}
                    bgColor="#000"
                  />
                )}
              </View>

              <View
                style={{
                  paddingVertical: 10,
                  paddingLeft: 5,
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#333333"
                }}
              >
                <Flex.Item>
                <Text style={{ color: "#F5F5F5", fontSize: 12 }}>
                  {CTCData.WalletAddress}
                </Text>
                </Flex.Item>
                <Flex.Item style={{flex:0.2}}>
                <Text
                  onPress={() => this.CopyText(CTCData.WalletAddress)}
                  style={{
                    color: "#00E62E",
                    textAlign: "center",
                    // paddingLeft: 5
                  }}
                >
                  复制
                </Text>
                </Flex.Item>
              </View>
              {/* <Text style={{color:'#F5F5F5',paddingVertical:10}}>最低存款数量：{CTCData.minAmt} BTC. 该收款地址是您的专属地址，可以多次使用。</Text> */}
              <Text style={{ color: "#F5F5F5", lineHeight: 30, marginTop: 10 }}>
                温馨提示
              </Text>
              <Text style={{ color: "#F5F5F5", lineHeight: 30, fontSize: 12 }}>
               - 扫描二维码充值或者网页打开收款地址的链接充值.
              </Text>
              <Text style={{ color: "#F5F5F5", lineHeight: 30, fontSize: 12 }}>
               - 最低存款数量：1 {CTCData.BaseCurrency}.
              </Text>
              <Text style={{ color: "#F5F5F5", lineHeight: 20, fontSize: 12 }}>
               - 极速虚拟币页面显示的二维码和收款地址是您的专属收款地址。请务必使用您的专属二维码或地址来进行交易，且可重复使用。
              </Text>
            </View>

            <Flex style={{marginBottom:20}}>
              <Flex.Item alignItems="center" style={{ left: 10 }}>
                <Touch
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    backgroundColor: "#00B324",
                    color: "#F5F5F5",
                    paddingVertical: 14,
                    width: "100%",
                    borderRadius: 4
                  }}
                  onPress={() => {
                    UMonEvent('Close_Crypto_deposit');
                    setTimeout(() => {
                      Actions.pop();
                    }, 500);

                    setTimeout(() => {
                      Actions.refresh({ key: Math.random() });
                    }, 1000);
                  }}
                >
                  <Text
                    style={{
                      width: "100%",
                      marginLeft: 0,
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                      ปิด
                  </Text>
                </Touch>
              </Flex.Item>
              <Flex.Item style={{ flex: 0.2 }}></Flex.Item>
              <Flex.Item alignItems="center">
                <Touch
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    paddingTop: 14,
                    paddingBottom: 14,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: "#00B324",
                    borderRadius: 4
                  }}
                  onPress={() => {
                    UMonEvent('Back_Crypto_deposit');
                    Actions.pop()}}
                >
                  <Text
                    style={{
                      color: "#00B324",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                    返回
                  </Text>
                </Touch>
              </Flex.Item>
            </Flex>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default DepositPage;
