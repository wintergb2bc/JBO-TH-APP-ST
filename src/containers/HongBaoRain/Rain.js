import React, { Component } from "react";
import {
  View,
  Modal,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import * as Animatable from "react-native-animatable";
import Touch from "react-native-touch-once";
import { Toast } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
const imgs = [require("../../images/hongbao/angpao.png")];
const range = count => {
  const array = [];
  for (let i = 0; i < count; i++) {
    array.push(i);
  }
  return array;
};

// 奖金列表
const moneys = [8, 18, 28, 68, 88, 108, 128, 188, 288, 388];
export default class Rain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parentWidth: 0,
      parentHeight: 0,
      HongBaoMsg:'',
      showDeposit: false, //提示存款弹窗
      showRain: true, //展示红包雨
      showPrizePopup: false, //抽奖结果弹窗
      showPending: false, //存款审核弹窗
      showWinPrize: false, //中奖
      showNoWin: false, //未中奖
      errorCode:'',
      prizeID: 0,
      prizeName: "0", //获得的奖品(彩金金额)
      remainingTries: 0, //剩余次数(抽红包)
      remainingTriesForTheDay: 0 //剩余次数(继续充值)
    };
  }

  _onLayout = event => {
    this.setState({
      //   parentWidth: event.nativeEvent.layout.width,
      //   parentHeight: event.nativeEvent.layout.height
      parentWidth: width,
      parentHeight: height
    });
  };

  _FailAnimation = ({ style, duration, delay, startY, speed, children }) => {
    return (
      <Animatable.View //下落动画
        style={style}
        duration={duration}
        delay={delay}
        animation={{
          from: { translateY: startY },
          to: { translateY: this.state.parentHeight + speed }
        }}
        easing={t => Math.pow(t, 1.2)}
        iterationCount="infinite"
        useNativeDriver
      >
        {children}
      </Animatable.View>
    );
  };

  _SwingAnimation = ({ delay, duration, children }) => {
    const translateX = Math.random() * -100;
    return (
      <Animatable.View //左右摇摆动画
        animation={{
          0: {
            translateX: translateX,
            rotate: "0deg"
          },
          0.5: {
            translateX: 0,
            rotate: "-100deg"
          },
          1: {
            translateX: -1 * translateX,
            rotate: "100deg"
          }
        }}
        delay={delay}
        duration={duration}
        direction="alternate"
        easing="ease-in-out"
        iterationCount="infinite"
        useNativeDriver
      >
        {children}
      </Animatable.View>
    );
  };

  _imgRandom = imgs => {
    // let r = Math.ceil(Math.random() * imgs.length);
    return (
      <TouchableOpacity
        onPressIn={() => {
          this.drawPrize();
        }}
        style={{ width: 50, height: 68 }}
        hitSlop={{ top: 8, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          resizeMode="contain"
          resizeMethod="auto"
          source={imgs[0]}
          style={{ width: 50, height: 68 }}
        />
      </TouchableOpacity>
    );
  };

  // 去登录
  goLogin(key = null) {
    if (key) {
      this.setState({ [key]: false });
    }
    // Toast.fail("请先登录",2)
    window.showRainTrigger && window.showRainTrigger(false);
    Actions.logins();
    // navigateToSceneGlobeX()
  }

  // 去存款
  goDeposit() {
    // this.setState({ showDeposit: false });
    this.togglePopup("showDeposit", false);
    window.showRainTrigger(false);
    Actions.depositHongBao({ from: "HongBaoRain" });
  }

  // 按钮
  prizePopBtn() {
    const { remainingTries, remainingTriesForTheDay } = this.state;
    if (remainingTries == 0 && remainingTriesForTheDay > 0) {
      // 继续充值获取抽红包机会
      this.goDeposit();
    } else {
      this.togglePopup("showPrizePopup", false);
    }
  }

  // 显示/关闭弹窗
  togglePopup(key, value = false) {
    this.setState({ [key]: value });
    if (!value) {
      // ANDROID 当关闭弹窗后,允许再次抽红包
      window.GlobalSetAllowDraw && window.GlobalSetAllowDraw(true);
    }
  }

  //   抢红包
  drawPrize() {
    //  情况一 未登录
    if (ApiPort.UserLogin == false) {
      Toast.fail("请先登录", 3, () => {
        this.goLogin();
      });
      return;
    }

    Toast.loading("抢粽子中...", 20);
    fetchRequest("/api/Event/Applications?", "POST")
      .then(res => {
        Toast.hide();
       console.log(res)
        if (res.isSuccessGrab) {
          if (res.errorCode == 0) {
            // 情况二 抽中奖
            this.setState({
              HongBaoMsg:res.message,
              remainingTries: res.remainingTries || 0,
              remainingTriesForTheDay: res.remainingTriesForTheDay || 0,
              showWinPrize: true,
              showNoWin: false,
              prizeName: parseInt(res.promoEventContent) //中奖金额
            });

            this.togglePopup("showPrizePopup", true);
            window.GetHistories && window.GetHistories();
          }else if (res.errorCode == 401 || res.errorCode == 402|| res.errorCode == 403) {
            // 情况三 很遗憾这个红包是空的  所有奖品已经被领取, 会员用完了最后一次的旋转次数的回调
            this.setState({
              HongBaoMsg:res.message,
              remainingTries: res.remainingTries || 0,
              remainingTriesForTheDay: res.remainingTriesForTheDay || 0,
              showNoWin: true,
              showWinPrize: false
            });

            this.togglePopup("showPrizePopup", true);
          }else{
            this.setState({
              HongBaoMsg:res.message,
              remainingTries: res.remainingTries || 0,
              remainingTriesForTheDay: res.remainingTriesForTheDay || 0,
              showWinPrize: true,
              showNoWin: false,
              prizeName: parseInt(res.promoEventContent) //中奖金额
            });
            this.togglePopup("showPrizePopup", true);

          }

          
          
        } else {
          // TODO: 不能抽奖分三种情况:1.今天存款额度不足 2.抽奖次数已用完 3.存款等待审核
          // if (res.errorCode == 5) {
          //   // 1.今天存款额度不足
          //   this.togglePopup("showDeposit", true);
          //   return;
          // }

          // if (res.errorCode == 3) {
          //   // 2.抽奖次数已用完
          //   this.setState({
          //     showNoWin: true,
          //     showWinPrize: false,
          //     remainingTries: res.remainingTries || 0,
          //     remainingTriesForTheDay: res.remainingTriesForTheDay || 0
          //   });
          //   this.togglePopup("showPrizePopup", true);
          //   return;
          // }

          // if (res.errorCode == 4) {
          //   //3.存款等待审核
          //   this.togglePopup("showPending", true);
          //   return;
          // }
          console.log(res.errorCode,'TTTTQ')
          if (res.message) {
           // Toast.fail(res.message, 2);
            this.setState({
              errorCode:res.errorCode,
              HongBaoMsg:res.message
            })
            this.togglePopup("showPending", true);
          } else {
            Toast.fail("网络故障,请稍候再试", 2, () => {
              window.GlobalSetAllowDraw && window.GlobalSetAllowDraw(true);
            });
          }
        }
      })
      .catch(err => {
        Toast.fail("网络故障,请稍候再试", 2, () => {
          window.GlobalSetAllowDraw && window.GlobalSetAllowDraw(true);
        });
      });
  }

  render() {
    let FailAnimation = this._FailAnimation;
    let SwingAnimation = this._SwingAnimation;
    const {
      showDeposit,
      showPrizePopup,
      showPending,
      showNoWin,
      showWinPrize,
      remainingTries,
      remainingTriesForTheDay,
      prizeName,
      HongBaoMsg,
      errorCode
    } = this.state;
    window.DrawPrize = () => {
      this.drawPrize();
    };
    const {
      // imgs=imgs,
      count = 10, //一次下落的数量
      duration = 10000, //时长
      startY = -150, //起始下落距顶部位置
      speed = 150
    } = this.props;

    // 提示存款弹窗
    const DepositPopup = props => (
      
      <Modal
        animationType="none"
        transparent={true}
        visible={showDeposit}
        onRequestClose={() => {}}
      >
        <View style={styles.noDepositModal}>
          <View style={styles.popupView}>
            {/* <View style={styles.closeBtnBox}>
              <Touch
                hitSlop={{ top: 100, bottom: 30, left: 30, right: 30 }}
                onPress={() => {
                  this.togglePopup("showDeposit", false);
                }}
              >
                <Image
                  source={require("../../images/hongbao/cross.png")}
                  style={styles.closeBtn}
                />
              </Touch>
            </View> */}
            <Image
              source={require("../../images/hongbao/icon_warning.png")}
              style={styles.iconWarning}
            />
            <Text style={styles.popupText1}>抱歉，您目前尚不能参加游戏</Text>
            <Text style={styles.popupText1}>请您先存款至您的账户</Text>
            <Text style={styles.popupText1}>（存款满300元获取一次抽红包机会）</Text>

            <View style={styles.popupBtns}>
              <Touch
                style={styles.popupBtn1}
                onPress={() => this.goDeposit("showDeposit")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.popupBtnText1}>立即存款</Text>
              </Touch>
              <Touch
                style={styles.popupBtn2}
                onPress={() => this.togglePopup("showDeposit", false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.popupBtnText2}>返回</Text>
              </Touch>
            </View>
          </View>
        </View>
      </Modal>
    );

    // 提示存款审核弹窗
    const PendingPopup = props => (
      <Modal
        animationType="none"
        transparent={true}
        visible={showPending}
        onRequestClose={() => {}}
      >
        <View style={styles.noDepositModal}> 
          <View style={styles.popupView}>
            <View style={styles.closeBtnBox}>
              <Touch
                hitSlop={{ top: 100, bottom: 30, left: 30, right: 30 }}
                onPress={() => {
                  this.togglePopup("showPending", false);
                }}
              >
                <Image
                  source={require("../../images/hongbao/cross.png")}
                  style={styles.closeBtn}
                />
              </Touch>
            </View>
            <Image
              source={require("../../images/hongbao/icon_warning.png")}
              style={styles.iconWarning}
            />
            <Text style={styles.popupText1}>{HongBaoMsg}</Text> 

            <View style={styles.popupBtns}>
              {errorCode == 101 || errorCode == 102 ||errorCode == 202 ? 
              <Touch
              style={styles.popupBtn1}
              onPress={() => this.goDeposit("showDeposit")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.popupBtnText1}>立即充值</Text>
            </Touch>  
            :null
              }
              
              <Touch
                style={errorCode != 101 || errorCode != 102 || errorCode != 202 ?styles.popupBtn3:styles.popupBtn2}
                onPress={() => this.togglePopup("showPending", false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.popupBtnText2}>返回</Text>
              </Touch>
            </View>
          </View>
        </View>
      </Modal>
    );

    // 抽奖结果弹窗
    const PrizePopup = () => (
      <Modal
        animationType="none"
        transparent={true}
        //visible={true}
      visible={showPrizePopup}
        onRequestClose={() => {}}
      >
        <View style={styles.winPrizeModal}>
          <ImageBackground
          
            source={require("../../images/hongbao/winBg.png")}
            style={styles.winBg}
          >
            <View style={styles.prizeBody}>

          

              {showWinPrize ? (
                <View style={styles.prizeBodyTop}>
                  <Text style={[styles.winPrizeText1,{top:-20}]}>恭喜您获得</Text>
                  <View style={[styles.winPrizeMoney,{top:-40}]}>
                    <Text style={styles.winPrizeMoneyIcon}>¥</Text>
                    <Text style={styles.winPrizeText2}>{prizeName}</Text>
                  </View>
                  <Text style={[styles.winPrizeText3,{top:-60}]}>免费彩金</Text>
                </View>
              ) : null}

              {showNoWin && remainingTriesForTheDay != 0  ? (
                <View style={styles.prizeBodyTop}>
                  <View style={[styles.prizeBodyTop, { height: "60%" }]}>
                  <Text style={styles.nowinPrizeText1}>抽奖落空</Text>
                    <Text style={[styles.nowinPrizeText2,{top:-30}]}>{remainingTriesForTheDay != 0?'请再接再厉':'明天再接再厉'}</Text>
                 
                  </View> 
                </View>
              ) : null}

              {/* {remainingTries > 0 ? (
                <Text style={styles.winPrizeText4}>
                  今天剩余抢红包次数:
                  <Text style={styles.winPrizeRestTimes}>
                    {remainingTries}
                  </Text>
                  次
                </Text>
              ) : null} */}

              {remainingTriesForTheDay > 0 ? (
                <View style={{top:-110}}>
                <Text style={[styles.winPrizeText4,{fontSize:12}]}>
                  今天剩余
                  <Text style={[styles.winPrizeRestTimes,{fontSize:18}]}>
                    {remainingTriesForTheDay}
                  </Text>
                  次抢粽子机会
                </Text>
                </View>
              ) : null}

              {remainingTriesForTheDay == 0 ? (
                <View>
                  <Text style={[styles.winPrizeText4,{fontSize:18,color:'#FF3300'}]}>
                      抽奖落空
                  </Text>
                  <Text style={[styles.winPrizeText4,{fontSize:18,color:'#FF3300'}]}>
                  明天再接再厉
                  </Text> 
                  <Text style={[styles.winPrizeText4,{fontSize:13,paddingTop:20}]}>今天抢粽子的次数已用完</Text>
                </View>
              ) : null}
              <View style={{top:-130,flexDirection: "row",}}>
              <Touch
                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                onPress={() => {
                  this.prizePopBtn();
                }}
                style={remainingTries == 0 && remainingTriesForTheDay > 0 ?styles.prizePopupBtnTR :styles.prizePopupBtn}
              >
                <Text style={styles.prizePopupBtnText}>
                  {remainingTries > 0
                    ? "继续抢粽子"
                    : remainingTries == 0 && remainingTriesForTheDay > 0
                    ? "立即充值"
                    : "返回"}
                </Text>
              </Touch>
              {remainingTries == 0 && remainingTriesForTheDay > 0 &&
                <Touch
                style={[styles.popupBtn2,{left:10,width:80}]}
                onPress={() => this.togglePopup("showPrizePopup", false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.popupBtnText2}>返回</Text>
              </Touch>
              }
              </View>
            </View>
          </ImageBackground>
          <View style={{top:-100}}>
          <Image
            source={require("../../images/hongbao/line.png")}
            style={styles.winLineImg}
          />
          <Touch
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            onPress={() => {
              this.togglePopup("showPrizePopup", false);
            }}
          >
            <Image
              source={require("../../images/hongbao/icon_close.png")}
              style={styles.winCloseIcon}
            />
          </Touch>
          </View>
        </View>
      </Modal>
    );

    return (
      <View
        style={{
          position: "absolute",
          width,
          height: 0,
          // bottom: 0,
          // left: 0,
          // right: 0,
          // top: 0
          zIndex: 1
        }}
        onLayout={this._onLayout}
        clickable={true}
      >
        {range(count).map(i => (
          <FailAnimation
            key={i}
            startY={startY}
            speed={speed}
            style={{
              position: "absolute",
              left: Math.random() * this.state.parentWidth,
              zIndex: 1
            }}
            duration={duration}
            delay={i * 1000}
          >
            {/* <SwingAnimation
              delay={Math.random() * duration}
              duration={duration}
            > */}
            {this._imgRandom(imgs)}
            {/* </SwingAnimation> */}
          </FailAnimation>
        ))}

        {/* 提示存款弹窗 */}
        <DepositPopup />

        {/* 存款审核弹窗 */}
        <PendingPopup />

        {/* 中奖弹窗 */}
        <PrizePopup />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noDepositModal: {
    justifyContent: "center",
    flex: 1,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0,0.5)"
  },
  noDepositPopup: {
    marginLeft: 30,
    marginRight: 30,
    width: width - 60,
    // height:1.364*(width-20),
    // alignItems: "center",
    // alignSelf:"center",
    // justifyContent: "center",

    zIndex: 9999,
    paddingVertical: 30
  },

  popupView: {
    // marginLeft: 50,
    // marginRight: 50,
    width: width - 60,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#000",
    borderRadius: 5,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: "#00B324"
  },

  iconWarning: {
    width: 0.15 * width,
    height: 0.15 * width,
    marginBottom: 20
  },

  popupText1: {
    fontSize: 15,
    color: "#fff",
    paddingVertical: 5,
    paddingLeft:3,
    textAlign: "center"
  },

  popupBtns: {
    width: "100%",
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20
  },
  popupBtn1: {
    width: 0.3 * width,
    backgroundColor: "#00B324",
    borderRadius: 4,
    // paddingHorizontal:20,
    paddingVertical: 10,
    marginHorizontal: 10
  },
  popupBtnText1: {
    // marginLeft: 20,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  popupBtn2: {
    width: 0.3 * width,
    // backgroundColor:"#000",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#00B324",
    // paddingHorizontal:20,
    paddingVertical: 10
    // marginTop: 10
  },
  popupBtn3:{
    width: 0.4 * width,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#00B324",
    // paddingHorizontal:20,
    paddingVertical: 10 
  },
  popupBtnText2: {
    color: "#00B324",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
  closeBtnBox: {
    alignSelf: "flex-end",
    marginRight: 20,
    top: -10
  },
  closeBtn: {
    width: 15,
    height: 15,
    alignSelf: "flex-end"
    // justifyContent: "flex-end",
  },

  winPrizeModal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    zIndex: 9999,
    paddingTop:100,
    backgroundColor: "rgba(0, 0, 0,0.5)"
  },
  winBg: {
    width,
    height: 1.18 * width,
    paddingTop: 0.28 * width,
    paddingHorizontal: 0.15 * width,
    paddingBottom: 20
    // backgroundColor:"blue"
  },
  prizeBody: {
    // flex:1
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between"
    // backgroundColor:"green"
  },
  prizeBodyTop: {
    height: "50%",
    alignItems: "center",
    justifyContent: "space-between"
  },
  winPrizeText1: {
    color: "#FF5300",
    textAlign: "center",
    fontSize: 18
  },
  winPrizeText2: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold"
  },
  winPrizeMoney: {
    flexDirection: "row",
    alignItems: "center"
  },
  winPrizeMoneyIcon: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 25
    // bottom: -10
  },
  winPrizeText3: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 18
  },
  winPrizeText4: {
    color: "#386317",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 5,
    top: 10
  },

  nowinPrizeText1: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold"
  },
  nowinPrizeText2: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    top: -20
  },
  nowinPrizeText3: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 16
    // fontWeight: "bold"
  },
  winPrizeRestTimes: {
    color: "#FF5300",
    fontSize: 24
  },
  winPrizeText5: {
    color: "#FF3300",
    textAlign: "center",
    fontSize: 16
  },
  prizePopupBtnTR:{
    alignItems: "center",
    width: 0.26 * width,
    backgroundColor: "#FF5300",
    borderRadius: 6,
    paddingVertical: 10
  },
  prizePopupBtn: {
    alignItems: "center",
    width: 0.4 * width,
    backgroundColor: "#FF5300",
    borderRadius: 6,
    paddingVertical: 10
  },
  prizePopupBtnText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16
  },

  winLineImg: {
    width: 3,
    height: 60
  },
  winCloseIcon: {
    width: 20,
    height: 20,
    left:-8,
  }
});
