import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  Image,
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  CameraRoll,
  RefreshControl,
  ImageBackground,
} from "react-native";
import moment from "moment";
//左補0
const padLeft = (str, length) => {
  if (str.length >= length) return str;
  else return padLeft("0" + str, length);
};

const { width, height } = Dimensions.get("window");

class BannerCountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      bannerCountdownEndDate: props.data && props.data.bannerCountdownEndDate,
      showTime:false
    };
  }
  componentDidMount() {
    if (this.props.bannerCountdownEnabled) {
      this.TimeLoad();
    }
  }
  componentWillUnmount() {
    clearInterval(this.loadInterval);
  }
  //計時
  TimeLoad() {
    let data = new Date(this.state.bannerCountdownEndDate);
    this.loadInterval = setInterval(() => {
      this.diffTime(data);
    }, 1000);
  }
  // 计算时间差
  diffTime(Time) {
    // 当前时间
    const nowTime = new Date().getTime();

    //计算出相差毫秒数
    const diff = Time.getTime() - nowTime;

    //计算出相差天数
    const days = Math.floor(diff / (24 * 3600 * 1000));

    //计算出小时数
    const leave1 = diff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));

    //计算相差分钟数
    const leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));

    //计算相差秒数
    const leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    const seconds = Math.round(leave3 / 1000);
    if (diff > 0) {
      this.setState({
        showTime: true,
        day: days > 9 ? days : `0${days}`,
        hour: hours > 9 ? hours : `0${hours}`,
        minute: minutes > 9 ? minutes : `0${minutes}`,
        second: seconds > 9 ? seconds : `0${seconds}`,
      });
    } else {
      this.setState({
        showTime: false,
        day: "00",
        hour: "00",
        minute: "00",
        second: "00",
      });
      clearInterval(this.loadInterval);
    }
  }
  render() {
    const { day, hour, minute, second, showTime } = this.state;
    return (
      <TouchableOpacity
        // onPress={() => JumtPromWindow(item, index)}
        style={{ width: width, height: 0.4385 * width }}
      >
        <ImageBackground
          // source={require("../../images/EuroCup.png")}
          source={{ uri: this.props.data && this.props.data.bannerImagePath }}
          style={{
            width: width,
            height: width * 0.4385,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 20, zIndex: 1000 }}
            onPress={() => {
              this.props.closebtn();
            }}
          >
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../../images/EuroCup/bannerClose.png")}
            ></Image>
          </TouchableOpacity>
          {showTime && (
            <View
              style={{
                display: "flex",
                // justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: width * 0.13,
                flexDirection: "row",
              }}
            >
              <View style={styles.dateList}>
                <Text style={styles.dateText}>{day}</Text>
              </View>
              <Text style={styles.dateTxt}>วัน</Text>
              <View style={styles.dateList}>
                <Text style={styles.dateText}>{hour}</Text>
              </View>
              <Text style={styles.dateTxt}>ชั่วโมง</Text>
              <View style={styles.dateList}>
                <Text style={styles.dateText}>{minute}</Text>
              </View>
              <Text style={styles.dateTxt}>นาที</Text>
              <View style={styles.dateList}>
                <Text style={styles.dateText}>{second}</Text>
              </View>
              <Text style={styles.dateTxt}>วินาที</Text>
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

export default BannerCountDown;

const styles = StyleSheet.create({
  wrapper: {
    height: 0.4385 * width,
  },
  dateList: {
    backgroundColor: "#00061A",
    opacity: 0.6,
    borderRadius: 4,
    width: 30,
    paddingVertical: 5,
    marginRight: 5,
  },
  dateText: {
    color: "#fff",
    fontSize: 13,
    justifyContent: "center",
    textAlign: "center",
  },
  dateTxt: {
    color: "#fff",
    marginRight: 5,
  },
});
