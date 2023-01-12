import React from "react";
import {
  StyleSheet,
  WebView,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  ImageBackground
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
  List
} from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import AnalyticsUtil from "../actions/AnalyticsUtil"; //友盟
const { width, height } = Dimensions.get("window");
let ENTRANCE_TIME=new Date("2020/01/21 00:00:00 +0800");// 活动入口显示的时间
let START_TIME=new Date("2020/06/22 00:00:00 +0800");// 活动开始时间
let END_TIME=new Date("2020/06/28 23:59:00 +0800");// 活动结束时间(活动入口关闭的时间)

if (window.common_url == 'https://gatewaystaging01.jbo88.biz') {
  ENTRANCE_TIME=new Date("2019/12/21 00:00:00 +0800");
  START_TIME=new Date("2019/12/21 00:00:00 +0800");
  END_TIME=new Date("2020/06/28 23:59:00 +0800");
}

// 活动入口
export default class ActivityEntrance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false, //是否显示活动入口
      inRange: false, //当前时间是否在某一时间区间内
      beforeRange: true, //开始前
      outRange: false //结束后
    };
  }

  componentWillMount(props) {}
  componentDidMount() {
    this.timeDown();
  }
  componentWillUnmount() {
    this.TimeDown && clearInterval(this.TimeDown);
  }

  // 计时器
  timeDown() {
    this.TimeDown = setInterval(() => {
      if (this.state.outRange) {
        this.TimeDown && clearInterval(this.TimeDown);
        this.setState({ inRange: false, isShow: false });
        return;
      }

      this.timeRange();
    }, 1000);
  }

  /**
   * 判断当前时间是否在某一时间区间内
   * @param {date} beginTime 入口显示时间
   * @param {date} endTime 入口结束时间
   */
  timeRange() {
    // console.log("倒计时",new Date());
    const begin = ENTRANCE_TIME.getTime();
    const end = END_TIME.getTime();
    const now = new Date().getTime();

    const beforeRange = now < begin;
    const inRange = now > begin && now < end;
    const outRange = now > end;
    this.setState({
      beforeRange,
      inRange,
      outRange,
      isShow: inRange
    });

    // 活动是否已开启
    const start = START_TIME.getTime();
    const isStart = now > start && now < end;
    window.HongBaoRain_Start = isStart;
  }

  goHongBaoRain() {
    // Toast.fail("goHongBaoRain",2)
    if (Platform.OS === "android" ) {
			Actions.HongBaoRainAndroid()
		}else{
			Actions.HongBaoRain()
		}
  }

  	// 是否弹出老虎机抽奖
  //   goHongBaoRain(){ 
  //     //fetchRequest('/api/Event/LaborDay?', "GET")
  //     fetchRequest('/api/Event?eventTypeId=7&', "GET")
	// 		.then(data => {
  //       console.log(data,'活動')
	// 		     if(data.isActive){
  //             if (Platform.OS === "android" ) {
  //               Actions.HongBaoRainAndroid()
  //             }else{
  //               Actions.HongBaoRain()
  //             }
  //          }else{
  //           Toast.fail("游戏还没开始, 请耐心等待", 2);
  //          }
	// 		})
  //     .catch((error) => {
  //       console.log(error,'活動')
  //      });
      
  //  }
   
  render() {
    if (!this.state.isShow) return null;
    return (
      <View style={{left:10,top:5}}>
        <Touch
          onPress={() => {
            this.goHongBaoRain();
          }}
          style={{ width: width, height: 0.308 * width }}
        >
          <Image
            resizeMode="stretch"
            source={require("../images/hongbao/entrance.png")}
            style={{ width: width-30, height: 0.29 * width }}
          />
          {/* <Image
            source={require("../images/hongbao/entrance-btn.png")}
            style={{
              position: "absolute",
              top: 0.07 * width,
              right: 0.07 * width,
              width: 0.15 * width,
              height: 0.15 * width
            }}
          /> */}
        </Touch>
      </View>
    );
  }
}
