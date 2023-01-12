import React from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  Radio,
  Button,
  Carousel,
  WhiteSpace,
  WingBlank,
  Flex,
  Toast,
  InputItem,
  Picker,
  List
} from "antd-mobile-rn";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index";
import Touch from "react-native-touch-once";
import styles from "./bankStyle";
import Head from "./Head";
const { width } = Dimensions.get("window");
const images = {
  kasikornbank: require("../../images/bankLogo/kasikornbank.png"),
  scb: require("../../images/bankLogo/scb.png"),
  bbl: require("../../images/bankLogo/bbl.png"),
  krungthaibank: require("../../images/bankLogo/krungthaibank.png"),
  thanachartbank: require("../../images/bankLogo/thanachartbank.png"),
  tmb: require("../../images/bankLogo/tmb.png"),
};

export default class BankStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bankStatusData: "",
      nowType: ""
    };
  }

  componentDidMount() {
    this.getBankStatus();
  }

  getBankStatus = () => {
    fetchRequest(ApiPort.getMaintenanceInfo, "GET")
      .then(res => {
        console.log(res);
        this.setState({
          bankStatusData: res.result,
          nowType: res.result.length !== 0 ? res.result[0].enName : ""
        });
      })
      .catch(error => {
        //			 Toast.hide();
      });
  };

  tabClick = value => {
    this.setState({
      nowType: value
    });
  };
  
  render() {
    const { bankStatusData, nowType } = this.state;
    const nowdata =
      bankStatusData.length > 0 &&
      bankStatusData.filter(v => v.enName === nowType)[0];
    const weekData = [
      "อาทิตย์",
      "จันทร์",
      "อังคาร",
      "พุธ",
      "พฤหัส",
      "ศุกร์",
      "เสาร์"
    ];
    console.log(bankStatusData);
    console.log(nowdata);
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#000",
          marginTop: 1
        }}
      >
        {bankStatusData === ""
          ? <View style={{ width: width, top: 21 }}>
              <Text style={{ textAlign: "center", color: "#fff" }}>
                กำลังโหลด..
              </Text>
            </View>
          : <View style={[styles.row, { backgroundColor: "#1a1a1a" }]}>
              {bankStatusData !== "" &&
                bankStatusData.map(item => {
                  return (
                    <TouchableOpacity
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={() => this.tabClick(item.enName)}
                      // key={item.code}
                      style={[styles.bankStatusButton]}
                    >
                      <View
                        style={[
                          styles.bankStatusTab,
                          item.enName == nowType
                            ? styles.bankStatusTabActive
                            : styles.bankStatusTabNormal
                        ]}
                      >
                        <Text
                          style={[
                            styles.BankStatusTabText,
                            {
                              color: item.enName == nowType ? "#fff" : "#ccc"
                            }
                          ]}
                        >
                          {item.tabBankName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>}

        {nowdata &&
          <View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 22,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {images[nowdata.imageName] &&
              <Image style={[nowdata.imageName.toLocaleUpperCase() === "BBL" 
                              ? styles.bankIonBBL : nowdata.imageName.toLocaleUpperCase() === "TMB"?styles.bankIonTMB : styles.bankIon]}
                     resizeMode="stretch"
                     source={images[nowdata.imageName]}
              />}

              <View>
                <Text style={{ fontSize: 20, color: "#fff" }}>
                  {nowdata.translatedBankName}
                </Text>
                <Text style={{ fontSize: 14, color: "#fff" }}>
                  {nowdata.enName}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#191919",
                paddingVertical: 15,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={[
                  styles.bankStatusCircle,
                  nowdata.isUnderMaintenance
                    ? styles.bankStatusGray
                    : styles.bankStatusGreen
                ]}
              />
              <Text style={{ fontSize: 18, color: "#F5F5F5", marginLeft: 15 }}>
                {nowdata.isUnderMaintenance ? "ออฟไลน์" : "ออนไลน์"}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                textAlign: "center",
                justifyContent: "center",
                marginBottom: 26,
                marginTop: 30
              }}
            >
              ปิดปรับปรุงตามช่วงเวลา
            </Text>
            {nowdata.item
              .filter(value => value.recordType == "R")
              .map((curvValue, curIndex) => {
                return (
                  <Text
                    key={curIndex}
                    style={{
                      fontSize: 16,
                      color: "#fff",
                      marginBottom: 11,
                      textAlign: "center",
                      justifyContent: "center"
                    }}
                  >
                    {weekData[curvValue.dayOfWeek]}:{curvValue.startTime} -{" "}
                    {weekData[curvValue.dayOfWeekEnd]}:{curvValue.endTime}
                  </Text>
                );
              })}
            <Text
              style={{
                color: "#666",
                fontSize: 12,
                textAlign: "center",
                marginTop: 31
              }}
            >
              *ตารางเวลาอ้างอิงจะเร็วกว่าตามเวลาประเทศไทย 1 ชั่วโมง
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 29,
                marginBottom: 50,
                marginHorizontal: 16,
                paddingVertical: 15,
                backgroundColor: nowdata.isUnderMaintenance
                  ? "#666"
                  : "#00B324",
                borderRadius: 4,
                alignItems: "center",
                justifyContent: "center"
              }}
              onPress={() => !nowdata.isUnderMaintenance && this.props.navigateToScene("deposit")}
            >
              <Text style={{ color: "#F5F5F5" }}>ฝากเงินเลย</Text>
            </TouchableOpacity>
          </View>}
      </ScrollView>
    );
  }
}
