import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
  WebView,
  Platform
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
  Tabs,
  Grid
} from "antd-mobile-rn";
import Orientation from "react-native-orientation-locker";
import Touch from "react-native-touch-once";
import Rain from "./Rain";
import WebViewAndroid from 'react-native-webview-android' 
const { width, height } = Dimensions.get("window");
let START_TIME = new Date("2020/06/25 00:00:00 +0800"); // 活动开始时间
let END_TIME = new Date("2020/06/28 23:59:00 +0800"); // 活动结束时间(活动入口关闭的时间)

if (window.common_url == "https://gatewaystaging09.jbo88.biz/") {
  START_TIME = new Date("2020/06/22 00:00:00 +0800");
  END_TIME = new Date("2020/06/28 23:59:00 +0800");
}

// 奖金列表

class HongBaoRainAndroid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beforeRange: true, //活动开始前
      inRange: false, //当前时间是否在活动时间区间内
      outRange: false, //活动结束后
      tipText: "请您稍等片刻，活动即将开始",
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      histories: null, //战绩
      showRain: false,
      allowDraw: false, //允许抽红包
      enabled: true, //父滚动条
      PromoMSGPOP:false,
      WinDataShow:false
    };
  }

  componentWillMount(props) {}

  componentDidMount() {
    this.timeDown();

    if (window.HongBaoRain_Start) {
      this.getSpinStatus();
    }

    if (ApiPort.UserLogin) {
      // 获取抽奖记录
      this.getHistories();
    }
  }

  componentWillUnmount() {
    window.showRainTrigger && window.showRainTrigger(false);
    this.TimeDown && clearInterval(this.TimeDown);
  }

  // 获取活动的开关
  getSpinStatus() {
    fetchRequest('/api/Event?eventTypeId=7&', "GET")
      .then(data => {
        if (data && data.isActive) {
          window.showRainTrigger && window.showRainTrigger(true);
          this.setState({ showRain: true, allowDraw: true });
        } else {
          window.showRainTrigger && window.showRainTrigger(false);
          this.setState({ showRain: false, allowDraw: false });
        }
      })
      .catch(err => {
        window.showRainTrigger && window.showRainTrigger(false);
        this.setState({ showRain: false, allowDraw: false });
      });
  }

 // 获取记录
 getHistories() {
  fetchRequest(
    "/api/Event/Applications?eventTypeId=7&",
    "GET"
  )
    .then(data => {
     console.log(data)
      if (data && data.length > 0) {
        this.setState({ histories: data });
      } else {
        this.setState({ histories: [] });
      }
    })
    .catch(err => {
      this.setState({ histories: [] });
    });
}

  // 活动倒计时
  timeDown() {
    this.TimeDown = setInterval(() => {
      this.timeRange();
    }, 1000);
  }

  /**
   * 判断当前时间是否在某一时间区间内
   */
  timeRange() {
    // console.log("倒计时",new Date());
    const begin = START_TIME.getTime();
    const end = END_TIME.getTime();
    const now = new Date().getTime();

    const beforeRange = now < begin; //开始前
    const inRange = now > begin && now < end; //活动时间
    const outRange = now >= end; //结束后
    this.setState({
      beforeRange,
      inRange,
      outRange
    });

    if (beforeRange) {
      console.log("请您稍等片刻，活动即将开始");
      // 活动未开始
      this.setState({
        tipText: "请您稍等片刻，活动即将开始",
        showRain: false,
        allowDraw: false
      });
      window.showRainTrigger && window.showRainTrigger(false);
      // 计算距离活动开始的倒计时
      this.diffTime(START_TIME);
    }
    if (inRange) {
      console.log("活动倒数计时");
      // 活动进行中:1.展示红包雨 2.计算距离活动结束的倒计时
      if (this.state.tipText != "活动倒数计时") {
        this.setState({
          tipText: "活动倒数计时"
        });
      }

      if (!this.state.showRain) {
        //1. 只有在未展示红包雨时才展示红包雨,避免不断展示
        // console.log("展示红包雨");
        window.showRainTrigger && window.showRainTrigger(true);
        this.setState({ showRain: true, allowDraw: true });
      }
      // 2.活动进行中,计算距离活动结束的倒计时
      this.diffTime(END_TIME);
    }
    if (outRange) {
      // 活动结束后:1,停止倒计时. 2.关掉红包雨
      // console.log(" 活动结束后");
      this.setState({
        showRain: false,
        allowDraw: false,
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
        tipText: "感谢您参加粽情端午活动，期待明年再与您相遇"
      });
      // 1,停止倒计时
      this.TimeDown && clearInterval(this.TimeDown);

      // 2.关掉红包雨
      window.showRainTrigger && window.showRainTrigger(false);
    }
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
        diff,
        days: days > 9 ? days : `0${days}`,
        hours: hours > 9 ? hours : `0${hours}`,
        minutes: minutes > 9 ? minutes : `0${minutes}`,
        seconds: seconds > 9 ? seconds : `0${seconds}`
      });
    } else {
      this.setState({
        diff,
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
      });
    }
  }

  goDrawPrize() {
    if (this.state.allowDraw) {
      if (window.DrawPrize) {
        window.DrawPrize();
      }
      this.setState({ allowDraw: false });
    }
  }

  globalSetAllowDraw(value) {
    this.setState({ allowDraw: value });
  }

  ClosePromo(){
    this.setState({
      PromoMSGPOP:this.state.PromoMSGPOP == false ? true:false
    })
  }

  WinDataShow(){
    if(this.state.WinDataShow == false){
      this.getHistories();
    } 
    this.setState({
      WinDataShow:this.state.WinDataShow == false? true:false
    })
  }


  render() {
    const {
      beforeRange,
      WinDataShow,
      PromoMSGPOP,
      tipText,
      days,
      hours,
      minutes,
      seconds,

      histories
    } = this.state;
    window.GetHistories = () => {
      this.getHistories();
    };

    window.GlobalSetAllowDraw = value => {
      this.globalSetAllowDraw(value);
    };
    return (
      <ScrollView
        style={styles.root}
        // onContentSizeChange={(w, h) => (this.rootContentHeight = h)}
        ref={scrollView => {
          this.rootScrollView = scrollView;
        }}
        nestedScrollEnabled={true}
        scrollEnabled={this.state.enabled}
      >

          <Modal
                animationType="none"
                transparent={true}
                visible={PromoMSGPOP}
                onRequestClose={() => {}}
              >
                <View>

                   <View style={{ width:width,height:height,backgroundColor:'rgba(0, 0, 0, 0.5)',position:'absolute'}}>
                   </View> 

                  <View style={{width:width-20,height:height-150,  justifyContent: "center",  alignItems: "center"}}>
                    <View style={{left:0.03 *width,top:90,borderColor:'#00B324',borderWidth:2 }}>
                      <Flex style={{backgroundColor:'#171717',paddingTop:10,paddingBottom:5}}>
                      <Flex.Item > 
                        </Flex.Item>
                        <Flex.Item >
                          <Text style={{color:'#fff',fontSize:16,textAlign:'center'}}>活动详情</Text>
                        </Flex.Item>

                        <Flex.Item>
                          <Touch onPress={() => {this.ClosePromo()}}>
                          <View>
                          <Text style={{color:'#fff',fontSize:22,textAlign:'right',top:-3,paddingRight:20}}>X</Text>
                          </View>
                          </Touch>
                        </Flex.Item>

                      </Flex>
                      <View style={{width:width-20,height:height-180 ,overflow:'hidden'}}>
                          <WebViewAndroid  
                            mediaPlaybackRequiresUserAction={false}
                            renderLoading={(e) =>  console.log('load1')}
                            source={{uri:'https://www.jbo69.com/cms/images/June2020/dragonboatfes/dragonboat1.htm?v=79'}} 
                            scalesPageToFit={Platform.OS === 'ios'? false : true} 
                            style={{width:width-20,height:height-180}}
                          />
                          </View>
                    </View>

                      {/* <View style={{borderColor:'#00B324',borderWidth:1,backgroundColor:'#000',borderRadius:6}}>
                        <Text style={{color:'#fff',paddingLeft:40,paddingRight:40,paddingTop:10,paddingBottom:10}}>返回</Text>
                      </View> */}

                   </View>

                  

                </View>


        </Modal>



        <Modal
                animationType="none"
                transparent={true}
                visible={WinDataShow}
                onRequestClose={() => {}}
              >
                    <View style={{ width:width,height:height,backgroundColor:'rgba(0, 0, 0, 0.5)',position:'absolute'}}>
                   </View>

                <View style={{width:width-20,height:height-150,justifyContent: "center",  alignItems: "center",}}>
 

                  <View>
                    <View style={{left:0.03 *width,top:90,borderColor:'#00B324',borderWidth:2,backgroundColor:'#171717',paddingBottom:20 }}>
                      <Flex style={{paddingTop:10,paddingBottom:5}}>
                      <Flex.Item > 
                        </Flex.Item>
                        <Flex.Item >
                          <Text style={{color:'#fff',fontSize:16,textAlign:'center'}}>获奖记录</Text>
                        </Flex.Item>

                        <Flex.Item>
                          <Touch onPress={() => {this.WinDataShow()}}>
                          <View>
                          <Text style={{color:'#fff',fontSize:22,textAlign:'right',top:-3,paddingRight:20}}>X</Text>
                          </View>
                          </Touch>
                        </Flex.Item>

                      </Flex>
                       


              <View style={{backgroundColor:'#171717',width:width-60, height: 0.55 * width}}>
             

              <View style={styles.historyContainer}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyTitle}>日期和时间</Text>
                  <Text style={styles.historyTitle}>奖金</Text>
                  <Text style={styles.historyTitle}>获奖状态</Text>
                </View>

                {!histories ? (
                  <View style={styles.noHistoryView}>
                    <Text style={styles.hisText}>加载中...</Text>
                  </View>
                ) : null}

                {histories && histories.length == 0 ? (
                  <View style={styles.noHistoryView}>
                    <Text style={styles.hisText}>没有记录</Text>
                  </View>
                ) : null}

                {histories && histories.length > 0 ? (
                  <View style={styles.historyParentView}>
                        <ScrollView
                        style={styles.historyScrollView}
                        onContentSizeChange={(w, h) =>
                          (this.historyContentHeight = h)
                        }
                        ref={scrollView => {
                          this.historyScrollView = scrollView;
                        }}
                        onTouchStart={e => {
                          this.setState({ enabled: false, allowDraw: false });
                        }}
                        // onScrollBeginDrag={e => {
                        //   this.setState({ enabled: false, allowDraw: false });
                        // }}
                        onMomentumScrollBegin={e => {
                          this.setState({ enabled: false, allowDraw: false });
                        }}
                        onTouchEnd={e => {
                          this.setState({ enabled: true, allowDraw: true });
                        }}
                        onMomentumScrollEnd={e => {
                          this.setState({ enabled: true, allowDraw: true });
                        }}
                        onScrollEndDrag={e => {
                          this.setState({ enabled: true, allowDraw: true });
                        }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                      >
                      {histories.map((item, index) => {
                        return (
                          <View style={styles.historyItem} key={index}>
                            <Text style={[styles.historyTitle,{textAlign:'left',paddingLeft:10}]}>
                              {/* {item.applyDate.split("T")[0]}{'\n'} */}
                              {item.applyDate.split("T").join("  ").split(".")[0]}
                            </Text>
                            <Text style={styles.historyTitle}>
                              {item.prizeName}
                            </Text>
                            <Text style={[styles.historyTitle,{borderRightColor:'#000'}]}>
                              {item.prizeStatus == 1 ? "处理中" : "到账成功"}
                            </Text>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                ) : null}
              </View> 
              </View>
                         
                    </View>

                      {/* <View style={{borderColor:'#00B324',borderWidth:1,backgroundColor:'#000',borderRadius:6}}>
                        <Text style={{color:'#fff',paddingLeft:40,paddingRight:40,paddingTop:10,paddingBottom:10}}>返回</Text>
                      </View> */}

                   </View>

                  

                </View>


        </Modal>
        
        <TouchableWithoutFeedback
          onPress={() => {
            this.goDrawPrize();
          }}
          hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        >
          <View style={{ alignItems: "center" }}>
            <Image
              source={require("../../images/hongbao/bg.png")}
              style={styles.bg}
            />
            <Image
              source={require("../../images/hongbao/slogan.png")}
              style={styles.slogan}
            />

            <Text style={styles.tipText}>{tipText}</Text>
            <View style={styles.timeBox}>
              <View style={styles.timeItem}>
                <ImageBackground
                  source={require("../../images/hongbao/cal.png")}
                  style={styles.cal}
                >
                  <View style={styles.timeTextBox}>
                    <Text style={styles.timeText}>{days}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.timeLabelBox}>
                  <Text style={styles.timeLabel}>天</Text>
                </View>
              </View>
              <View style={styles.timeItem}>
                <ImageBackground
                  source={require("../../images/hongbao/cal.png")}
                  style={styles.cal}
                >
                  <View style={styles.timeTextBox}>
                    <Text style={styles.timeText}>{hours}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.timeLabelBox}>
                  <Text style={styles.timeLabel}>时</Text>
                </View>
              </View>
              <View style={styles.timeItem}>
                <ImageBackground
                  source={require("../../images/hongbao/cal.png")}
                  style={styles.cal}
                >
                  <View style={styles.timeTextBox}>
                    <Text style={styles.timeText}>{minutes}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.timeLabelBox}>
                  <Text style={styles.timeLabel}>分</Text>
                </View>
              </View>
              <View style={styles.timeItem}>
                <ImageBackground
                  source={require("../../images/hongbao/cal.png")}
                  style={styles.cal}
                >
                  <View style={styles.timeTextBox}>
                    <Text style={styles.timeText}>{seconds}</Text>
                  </View>
                </ImageBackground>
                <View style={styles.timeLabelBox}>
                  <Text style={styles.timeLabel}>秒</Text>
                </View>
              </View>
            </View>
            <ImageBackground
              source={require("../../images/hongbao/activityTime.png")}
              style={styles.activityTime}
            >
              <Text style={styles.activityTimeText}>
              活动时间：2020/6/25 00:00 - 6/28 23:59（北京时间）
              </Text>
            </ImageBackground>

            {/* 活动步骤 */}
            {/* {ApiPort.UserLogin ? null : (
              <ImageBackground
                source={require("../../images/hongbao/box-1.png")}
                style={styles.box1}
              >
                <View style={styles.labelBox}>
                  <Text style={styles.labelText}>如何参与</Text>
                </View>
                <View style={styles.stepBox}>
                  <Text style={styles.detailTitle}>
                    简单三步骤，赢取免费彩金！
                  </Text>
                  <View style={styles.stepItems}>
                    <View style={styles.stepItem}>
                      <Image
                        source={require("../../images/hongbao/step-1.png")}
                        style={styles.stepIcon1}
                      />
                      <Text style={styles.stepLabel}>步骤一</Text>
                    </View>

                    <View style={styles.stepItem}>
                      <Image
                        source={require("../../images/hongbao/stepLine.png")}
                        style={styles.stepLine}
                      />
                    </View>

                    <View style={styles.stepItem}>
                      <Image
                        source={require("../../images/hongbao/step-2.png")}
                        style={styles.stepIcon2}
                      />
                      <Text style={styles.stepLabel}>步骤二</Text>
                    </View>

                    <View style={styles.stepItem}>
                      <Image
                        source={require("../../images/hongbao/stepLine.png")}
                        style={styles.stepLine}
                      />
                    </View>

                    <View style={styles.stepItem}>
                      <Image
                        source={require("../../images/hongbao/step-3.png")}
                        style={styles.stepIcon3}
                      />
                      <Text style={styles.stepLabel}>步骤三</Text>
                    </View>
                  </View>

                  <View style={styles.stepDetails}>
                    <Text style={styles.stepDetailText}>
                      注册或登入您的账户
                    </Text>
                    <Text style={styles.stepDetailText}>存款至您的账户</Text>
                    <Text style={styles.stepDetailText}>
                      红包任性抢，抢完即止
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            )} */}

            {/* 抽奖记录 */}
            {/* {ApiPort.UserLogin ? (
              <ImageBackground
                source={require("../../images/hongbao/box-0.png")}
                style={styles.box0}
              >
                <View style={styles.labelBox}>
                  <Text style={styles.labelText}>我的战绩</Text>
                </View>

                <View style={styles.historyContainer}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>日期</Text>
                    <Text style={styles.historyTitle}>奖品</Text>
                    <Text style={styles.historyTitle}>状态</Text>
                  </View>

                  {!histories ? (
                    <View style={styles.noHistoryView}>
                      <Text style={styles.hisText}>加载中...</Text>
                    </View>
                  ) : null}

                  {histories && histories.length == 0 ? (
                    <View style={styles.noHistoryView}>
                      <Text style={styles.hisText}>没有记录</Text>
                    </View>
                  ) : null}

                  {histories && histories.length > 0 ? (
                    <View style={styles.historyParentView}>
                      <ScrollView
                        style={styles.historyScrollView}
                        onContentSizeChange={(w, h) =>
                          (this.historyContentHeight = h)
                        }
                        ref={scrollView => {
                          this.historyScrollView = scrollView;
                        }}
                        onTouchStart={e => {
                          this.setState({ enabled: false, allowDraw: false });
                        }}
                        // onScrollBeginDrag={e => {
                        //   this.setState({ enabled: false, allowDraw: false });
                        // }}
                        onMomentumScrollBegin={e => {
                          this.setState({ enabled: false, allowDraw: false });
                        }}
                        onTouchEnd={e => {
                          this.setState({ enabled: true, allowDraw: true });
                        }}
                        onMomentumScrollEnd={e => {
                          this.setState({ enabled: true, allowDraw: true });
                        }}
                        onScrollEndDrag={e => {
                          this.setState({ enabled: true, allowDraw: true });
                        }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                      >
                        {histories.map((item, index) => {
                          return (
                            <View style={styles.historyItem} key={index}>
                              <Text style={styles.historyTitle}>
                                {item.applyDate.split("T")[0]}
                              </Text>
                              <Text style={styles.historyTitle}>
                                {item.prizeName}
                              </Text>
                              <Text style={styles.historyTitle}>
                                {item.prizeStatus == 1 ? "处理中" : "到账成功"}
                              </Text>
                            </View>
                          );
                        })}
                      </ScrollView>
                    </View>
                  ) : null}
                </View>
              </ImageBackground>
            ) : null} */}

          {/* 活动奖品 */}
          <ImageBackground
            source={require("../../images/hongbao/box-0.png")}
            style={styles.box0}
          >
            <View style={styles.labelBox}>
              <Text style={styles.labelText}>如何参与</Text>
            </View>
            <View style={styles.moneyBox}>
              <Image
                source={require("../../images/hongbao/text1.png")}
                style={styles.textA}
              />
              
            </View>
            
            <Flex style={{paddingBottom:9}}>
             <View>
              <Touch onPress={() => {this.ClosePromo()}}>
                <View style={styles.ButtonG}>
                <Text style={{color:'#fff',textAlign:'center',fontSize:13}}>活动详情</Text>
                </View>
              </Touch>
            </View>
            {ApiPort.UserLogin  && 
            <View style={{paddingLeft:20}}>
              <Touch onPress={() => {this.WinDataShow()}}>
                <View style={styles.ButtonG}>
                <Text style={{color:'#fff',textAlign:'center',fontSize:13}}>获奖记录</Text>
                </View>
              </Touch>
            </View>
            }
            </Flex>
          

          </ImageBackground>


          {/* 活动奖品 */}
          <ImageBackground
            source={require("../../images/hongbao/box-3.png")}
            style={styles.box3}
          >
            <View style={styles.labelBox}>
              <Text style={styles.labelText}>活动奖品</Text>
            </View>
            <View style={styles.moneyBox}>
              <Image
                source={require("../../images/hongbao/moneys.png")}
                style={styles.moneys}
              />
              
            </View>
          </ImageBackground>

          {/* 注意事项 */}
          <ImageBackground
            source={require("../../images/hongbao/box-4.png")}
            style={styles.box4}
          >
            <View style={styles.labelBox}>
              <Text style={styles.labelText}>注意事项</Text>
            </View>

            <View style={styles.boxMain}>
              <View style={styles.detailTitleItem}>
                <Text style={styles.detailLabelTitle}>1.</Text>
                <Text style={styles.box4Text}>
                 免费彩金派发至主账户，有效期限为30天，需要一倍流水方能提款。
                </Text>
              </View>
              <View style={styles.detailTitleItem}>
                <Text style={styles.detailLabelTitle}>2.</Text>
                <Text style={styles.box4Text}>
                每位会员每天最多有10次抢粽子次数，抢粽子次数不可累积必须当日用完。
                </Text>
              </View>
              <View style={styles.detailTitleItem}>
                <Text style={styles.detailLabelTitle}>3.</Text>
                <Text style={styles.box4Text}>会员需点击“粽子”赢取奖品。</Text>
              </View>
              <View style={styles.detailTitleItem}>
                <Text style={styles.detailLabelTitle}>4.</Text>
                <Text style={styles.box4Text}>抢粽子次数将根据实际存款金额为主，使用支付宝或微信转账，建议会员充值301元或以上。</Text>
              </View>
            </View>
 
          </ImageBackground>
        </View>
        </TouchableWithoutFeedback>

        {/* 红包雨组件放在APP.js, 因为这个页面的状态刷新会影响到红包雨的展示*/}
        {/* {showRain ? <Rain /> : null} */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    minHeight: height,
    backgroundColor: "#04390D"
  },
  bg: {
    width: width,
    height: 3.25 * width,
    position: "absolute",
    top: 0,
    left: 0
  },
  bg1: {
    width,
    height: 1.07 * width,
    alignItems: "center"
  },
  slogan: {
    width: width,
    height: 0.5 * width
  },
  tipText: {
    color: "#FFFD50"
    // marginTop:5,
  },
  timeBox: {
    width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20
    // marginTop: 30
  },
  timeItem: {
    // width: 0.22 * width,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cal: {
    width: 0.15 * width,
    height: 0.15 * width,
    justifyContent: "center",
    alignItems: "center"
  },
  timeTextBox: {
    width: 0.15 * width,
    height: 0.15 * width,
    justifyContent: "center",
    alignItems: "center"
  },
  timeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff"
  },
  timeLabelBox: {
    width: 0.1 * width - 5,
    justifyContent: "center",
    alignItems: "center"
  },
  timeLabel: {
    fontSize: 15,
    color: "#fff"
  },
  activityTime: {
    width: 0.92 * width,
    height: 0.0864 * width,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10
  },
  activityTimeText: {
    fontSize: 13,
    color: "#fff",
    textAlign: "center"
  },
  bg2: {
    width,
    height: 1.067 * width,
    alignItems: "center",
    justifyContent: "space-around"
  },
  bgFinish: {
    width,
    height: 1.6 * width,
    alignItems: "center",
    justifyContent: "space-around"
    // paddingBottom:10,
  },
  box0: {
    width: 0.94 * width,
    height: 0.45 * width,
    // justifyContent: "center",
    alignItems: "center",
    padding: 5
    // marginVertical:10,
  },
  ButtonG:{
    width:width/2 - 50,
    paddingTop:6,
    paddingBottom:6,
    borderWidth: 1,
    borderColor: "#43EE5F",
    backgroundColor:'#04390D',
    borderRadius: 5,
  },
  historyContainer: {
    // flex: 1,
    width: 0.75 * width,
    height: 0.55 * width, 
    left:15,
    borderWidth:1,
    borderColor:'#fff'
  },
  historyHeader: {
    backgroundColor: "#00B324",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10
  },
  noHistoryView: {
    minHeight: 0.4 * width,
    justifyContent: "center",
    alignItems: "center"
  },
  historyParentView: {
    height: 0.4 * width,
    zIndex: 9999
  },
  historyScrollView: {
    minHeight: 0.4 * width,
    zIndex: 9999
  },
  hisText: {
    color: "#fff",
    fontSize: 14
  },
  historyTitle: {
    color: "#fff",
    width: "33%",
    fontSize: 12,
    textAlign: "center",
    borderRightWidth:1,
    borderRightColor:'#fff',
    //borderRightWidth:1,
   
  },
  historyItem: {
    // backgroundColor:"#04004B4D",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF80"
  },
  box1: {
    width: 0.94 * width,
    height: 0.45 * width,
    // justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 20
  },
  stepBox: {
    alignItems: "center",
    paddingVertical: 10
    // justifyContent:"flex-end"
  },
  stepItems: {
    flexDirection: "row",
    alignItems: "center",
    // padding:20,
    justifyContent: "center",
    marginVertical: 10
  },
  stepItem: {
    // width:0.15*width,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10
  },
  stepIcon1: {
    width: 0.1 * width,
    height: 0.1 * width
  },
  stepIcon2: {
    width: 0.1 * width,
    height: 0.1 * width
  },
  stepIcon3: {
    width: 0.1428 * width,
    height: 0.1 * width
  },
  stepLine: {
    width: 0.1 * width,
    height: 5,
    top: -10
  },
  stepLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 5
  },
  stepDetails: {
    flexDirection: "row",
    justifyContent: "center"
  },
  stepDetailText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
    marginHorizontal: 10
  },
  box2: {
    width: 0.94 * width,
    height: 0.423 * width,
    // justifyContent: "center",
    alignItems: "center",
    padding: 5,
    marginVertical: 20
  },
  boxLabel: {
    color: "#42007F"
  },
  detailBox: {
    flex: 1,
    justifyContent: "center"
    // alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    marginVertical: 10
  },
  titleBg: {
    width: 0.25 * width,
    height: 0.07 * width,
    justifyContent: "center",
    alignItems: "center"
  },
  detailTitle: {
    color: "#fff",
    fontSize: 12
  },
  titleGold: {
    color: "#FFFC00",
    fontSize: 16,
    fontWeight: "bold"
  },
  detailTitle2: {
    color: "#fff",
    fontSize: 12
  },

  bg3: {
    width,
    height: 1.067 * width,
    // height: 0.82 * width,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  box3: {
    width: 0.94 * width,
    height: 0.56 * width,
    // justifyContent: "center",
    alignItems: "center",
    padding: 5,
    padding: 5,
    top:10
  },
  moneyBox: {
    // width: "100%",
    flex: 1,
    // flexDirection: "row",
    // flexWrap: "wrap",
    // justifyContent: "space-between",
    alignItems: "center"
    // padding: 10
  },
  textA:{
    width: width - 55,
    height: 0.18 * width,
    alignSelf: "center",
    top: 10
  },
  moneys: {
    width: width - 40,
    height: 0.43 * (width),
    alignSelf: "center",
    top: 10
  },
  // moneyItem: {
  //   width: 0.15 * width,
  //   height: 0.13 * width
  // },
  moneyItemBg: {
    // width:"20%",
    width: width - 50,
    height: 0.43 * (width),
    justifyContent: "space-around",
    alignItems: "center",
    // marginHorizontal:5,
    marginVertical: 5
  },
  moneyLabel: {
    color: "#42007F",
    textAlign: "center",
    fontSize: 10
  },
  moneyText: {
    color: "#42007F",
    textAlign: "center"
  },
  moneyTextS: {
    color: "#42007F",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold"
  },
  box4: {
    width: 0.94 * width,
    height: 0.42 * width,
    // justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    padding: 5,
    marginBottom: 100
  },
  labelBox: {
    // width,
    height: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  labelText: {
    color: "#42007F",
    textAlign: "center"
  },
  boxMain: {
    flex: 1,
    justifyContent: "space-around"
    // alignItems: "center",
  },
  detailTitleItem: {
    flexDirection: "row",
    width: 0.85 * width,
    alignItems: "flex-start",
    alignContent: "flex-start"
  },
  detailLabelTitle: {
    color: "#fff",
    fontSize: 12,
    top: -1
  },
  box4Text: {
    color: "#fff",
    fontSize: 12
  }
});

export default HongBaoRainAndroid;
