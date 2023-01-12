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
  Alert
} from "react-native";
import Touch from "react-native-touch-once";
import { Actions } from "react-native-router-flux";
import { Flex, WhiteSpace, Toast } from "antd-mobile-rn";
import SlotMachine from "./SlotMachine";
import SMPrizes from "./Prizes";
import SMLoading from "./SMLoading";
import SMResult from "./Result";
const { width, height } = Dimensions.get("window");
const prizeIcons = [
  {
    icon: require("../../images/slotmachine/spin/0.png")
  },
  {
    icon: require("../../images/slotmachine/spin/1.png")
  },
  {
    icon: require("../../images/slotmachine/spin/2.png")
  },
  {
    icon: require("../../images/slotmachine/spin/3.png")
  },
  {
    icon: require("../../images/slotmachine/spin/4.png")
  },
  {
    icon: require("../../images/slotmachine/spin/5.png")
  },
  // {
  //   icon: require("../../images/slotmachine/spin/6.png")
  // },
  {
    icon: require("../../images/slotmachine/spin/7.png")
  },
  // {
  //   icon: require("../../images/slotmachine/spin/8.png")
  // },
  {
    icon: require("../../images/slotmachine/spin/9.png")
  },
  {
    icon: require("../../images/slotmachine/spin/10.png")
  },
  {
    icon: require("../../images/slotmachine/spin/11.png")
  }
];
// 老虎机抽奖弹窗
class SlotMachinePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinResult: "999",
      showPrizes: false,
      popupType: "",
      prizeId: null,
      prizeName: "",
      userTime:'',
      remaining:'',
      allowSpin: true,
      errorMsg: "",
      headle: "top",//摇杆位置
      showLoading:false
    };
  }

  componentDidMount() {}

  componentWillUnmount() { 
    this.setState({ showPrizes: false, popupType: "" });
  }

  // 显示奖品列表弹窗
  togglePrizesPopup() {
    this.setState({ showPrizes: !this.state.showPrizes });
  }

  // 抽奖结果弹窗
  togglePopUp(type = "") {
    this.setState({ popupType: type, allowSpin: true, headle: "top" ,showLoading:false});
  }


   //去充值
   goBankD(){ 
    this.togglePopUp("");
     setTimeout(()=>{
      showSMPopup();
     },100) 

     Actions.depositTx();

    // setTimeout(()=>{
    //   Actions.depositTx();
    // },1000)
  }


  goSMdetail(){
    showSMPopup();
    PromoID = 200501
    Actions.jump('preferential')

    setTimeout(()=>{
      BannerOpenPR();
    },600)
  }


  // 立即抽奖
  startPrize() {
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      showSMPopup();
      Actions.logins();
      return;
    }

 
    if (!this.state.allowSpin) return false;
    this.setState({ allowSpin: false, showLoading:true,headle: "bottom" });

    console.log(prizeIcons)
    // 模拟 抽奖成功
    // const id = Math.floor((Math.random())*7)
    // if (id == 1 || id ==2 || id ==3) {
    //   console.log(id,'KKK')
    //   const ids = ["000","222","444","666"]
    //   const prizes = ["下次再来","10","16","188"]
    //   const prizeId = ids[id]
    //   const prizeName = prizes[id]
    //   const userTime = 3; // 剩餘次數

    //   setTimeout(() => {
    //     this.setState({ spinResult: prizeId,showLoading:false});
    //     this.slotRef.spinTo(prizeId);
    //     }, 200);

    //   setTimeout(() => {
    //     this.setState({prizeName,userTime},()=>{
    //       this.togglePopUp("win");
    //     })
    //   }, 4500);
    // }else{
    //   this.setState({ spinResult: "846",showLoading:false});
    //   this.slotRef.spinTo("846");
    //   setTimeout(() => {
    //     this.togglePopUp("noPrize");
    //   }, 4500);
    // }

    // 模拟 存款额度不足
    // this.slotRef.spinTo("000");
    // setTimeout(() => {
    //   this.togglePopUp("deposit");
    // }, 4500);

    // 模拟 没有抽中
    // this.slotRef.spinTo("000");
    // setTimeout(() => {
    //   this.togglePopUp("noPrize");
    // }, 4500);

    // 模拟 错误
    // const errorMsg = "网络故障,请稍候再试"
    // this.setState({errorMsg},()=>{
    //   this.togglePopUp("err");
    // })

    // return;
    fetchRequest("/api/Event/LaborDay/Applications?", "POST")
      .then(res => {
        this.setState({showLoading:false})
        console.log(res,"benjiTest1")
        if (res.isSuccessGrab) {
          //  抽奖成功
          let id = res.prizeIndex;
          console.log(id,'11111aaaa',res)
          const prizeName = res.laborDayContent && res.laborDayContent;   //中獎金額
          const userTime = res.remainingTriesForTheDay && res.remainingTriesForTheDay; // 當天剩餘次數
          const remaining = res.remainingTries && res.remainingTries;//當前可抽獎次數
          if (id == 0 ||id == 1 || id == 2 || id == 3 || id == 4 || id == 5 ) {
            const ids = ["000", "111", "222", "333","4444","555"]; 
            const prizeId = ids[id]; 
            console.log(userTime,'---',remaining)
            setTimeout(() => {
              this.setState({ spinResult: prizeId});
              this.slotRef.spinTo(prizeId);
            }, 200);
            setTimeout(() => {
             
              this.setState({ prizeName,userTime,remaining }, () => {
                this.togglePopUp("win");
              });
            }, 4500);
          } else {
            let ernumA = Math.floor(Math.random() * 7)
            let ernumB = Math.floor(Math.random() * 7)
            let ernumC = Math.floor(Math.random() * 7)
            this.setState({ spinResult: ernumA +''+ernumB+''+ernumC});
            this.slotRef.spinTo(ernumA +''+ernumB+''+ernumC);

            if(res.errorCode == 403){   // 所有奖品已经被领取, 会员用完了最后一次的旋转次数的回调
                setTimeout(() => {
                  this.setState({ userTime,remaining }, () => {  
                  this.togglePopUp("noPrizeToady");
                }); 
              }, 4500);
            }else{
              setTimeout(() => { 
                this.setState({ userTime,remaining }, () => {   
                  this.togglePopUp("noPrize");
                }); 
              }, 4500);
            }
            
          }
        } else {  
          const userTime = res.remainingTriesForTheDay; // 剩餘次數
          const errorMsg = res.message || "网络故障,请稍候再试";
          // TODO: 不能抽奖分情况: 
          if (res.errorStatus == 101) {//充值满 300 元可获得一次旋转机会！ 
            this.setState({ errorMsg }, () => {
              this.togglePopUp("deposit");
            });
          }else if (res.errorStatus == 102) {//会员存款成功但不满足最低存款条件的回调
            this.setState({ errorMsg }, () => {
              this.togglePopUp("deposit");
            });
          }else if (res.errorStatus == 103) {//存款通过审核后，才能进行抽奖
            this.setState({ errorMsg }, () => {
              this.togglePopUp("deposit");
            });
          }else if (res.errorStatus == 104) {//会员旋转所有可以的次数但当天还可以旋转的回调
            this.setState({ errorMsg }, () => {
              this.togglePopUp("deposit");
            });
          } else {
            const errorMsg = res.message || "网络故障,请稍候再试";
            this.setState({ errorMsg }, () => {
              this.togglePopUp("err");
            });
          }
        }
      })
      .catch(err => {
        const errorMsg = "网络故障,请稍候再试";
        this.setState({ errorMsg }, () => {
          this.togglePopUp("err");
        });
      })
      .finally(() => {
        this.setState({ headle: "top" ,showLoading:false });
      });
  }



  render() {
    const {
      spinResult,
      showPrizes,
      showDeposit,
      showNoPrize,
      popupType,
      prizeName,
      userTime,
      remaining,
      errorMsg,
      allowSpin,
      headle,
      showLoading,
    } = this.state;
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}
      >
        {/* loading */}
        {showLoading?<SMLoading />:null}
        {/* 奖品列表弹窗 */}
        {showPrizes ? (
          <SMPrizes
            togglePrizesPopup={() => {
              this.togglePrizesPopup();
            }}
          />
        ) : null}

        {/* 抽奖结果弹窗 */}
        {popupType ? (
          <SMResult
            goBankD={this.goBankD.bind(this)}
            togglePopUp={type => {
              this.togglePopUp(type);
            }}
            popupType={popupType}
            prizeName={prizeName}
            userTime={userTime}
            remaining={remaining}
            errorMsg={errorMsg}
          />
        ) : null}

        <View style={styles.slotmachineModal}>
          <View style={styles.slotmachinePopup}>
           
            {/* <Image
              style={styles.logo}
              source={require("../../images/github-logo.png")}
            /> */}
           
            <ImageBackground
              source={require("../../images/slotmachine/bg.png")}
              style={styles.slotmachineImgContainer}
            >
              <Image
                style={styles.titleImg}
                resizeMode="stretch"
                source={require("../../images/slotmachine/title.png")}
              />


             <View>
              <ImageBackground
                style={styles.mainImg}
                source={require("../../images/slotmachine/main.png")}
              >
                {headle == "top" ? (
                  <Image
                    style={styles.headTop}
                    source={require("../../images/slotmachine/Handle-Top.png")}
                  />
                ) : (
                  <Image
                    style={styles.headBottom}
                    source={require("../../images/slotmachine/Handle-Bottom.png")}
                  />
                )}
                <View>
                  <SlotMachine
                    text={spinResult}
                    padding={3}
                    range="9876543210"
                    initialAnimation={false}
                    ref={el => (this.slotRef = el)}
                    width={0.22 * width}
                    height={0.25 * (width - 20)}
                    styles={{
                      container: styles.container,
                      slotWrapper: styles.slotWrapper
                    }}
                    renderContent={i => ( 
                      <View style={styles.iconContainer}>
                        <Image
                          source={prizeIcons[i].icon}
                          style={styles.prizeIcon0}
                        />
                      </View>
                    )}
                  />
                </View>
              </ImageBackground>
              </View>
      
              
            </ImageBackground>

            <View style={styles.missionBar}>
                <Touch
                  hitSlop={{ top: 30, bottom: 30, left: 10, right: 10 }}
                  onPress={() => {
                    this.goSMdetail();
                  }}
                >
                  <Image
                    source={require("../../images/slotmachine/tc.png")}
                    style={styles.tcImg}
                  />
                </Touch>
                <Touch
                  hitSlop={{ top: 30, bottom: 30, left: 10, right: 10 }}
                  onPress={() => {
                    this.startPrize();
                  }}
                >
                  <Image
                    source={require("../../images/slotmachine/spin.png")}
                    style={styles.spinImg}
                  />
                </Touch>
                <Touch 
                 hitSlop={{ top: 30, bottom: 30, left: 10, right: 10 }}
                  onPress={() => {
                    this.togglePrizesPopup();
                  }} 
                >
                  <Image
                    source={require("../../images/slotmachine/prize.png")}
                    style={styles.tcImg}
                  />
                </Touch>
              </View>


              <View style={styles.closeRegPromo}>
           
           <View style={styles.closeRegPromo}>
           <TouchableOpacity 
           onPress={() => {
             this.props.toggleSM();
           }}
         >
             <Text style={styles.closeRegPromoText}>X</Text>
             </TouchableOpacity>
           </View>
      
       </View>

            
          </View>

       

        </View>

          
      </Modal>
    );
  }
}

export default SlotMachinePopup;

const styles = StyleSheet.create({
  slotmachineModal: {
    justifyContent: "center",
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.9)"
  },
  slotmachinePopup: {
    alignItems: "center",
    backgroundColor: "transparent"
  },
  closeRegPromo: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10, 
    paddingTop:20
  },
  closeRegPromoText: {
    width: 30,
    height: 30,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 15, 
    borderColor: "#d3d3d3",
    paddingTop:2,
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "flex-end"
  },
  closeRegPromo2: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  closeRegPromoText2: {
    width: width,
    height: 20,
    // lineHeight:30,
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  slotmachineImgContainer: {
    width: width,
    height: 0.9 * width,
    alignItems: "center",
    marginTop: -90
    // justifyContent: "center"
  },
  logo: {
    width: 0.25 * width,
    height: 0.11 * width
  },
  titleImg: {
    width: 0.9 * width,
    height: 0.273 * width,
    top: 90,
    left:8
  },
  mainImg: {
    width: width - 60,
    height: 0.500 * width,
    top: 69,
    left: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    // width: 200,
    width: 0.75 * width,
    height: 0.25 * (width - 20),
    alignSelf: "center",
    justifyContent: "center",
    left: -5,
    top:15
    // margin:80,
  },
  slotWrapper: {
    // alignSelf: "center",
    // justifyContent: "center",
  },
  slotInner: {},

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 0.22 * width,
    height: 0.25 * (width - 20)
  },
  prizeIcon0: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center"
  },
  prizeIcon1: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center"
  },
  prizeIcon2: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center",
  },

  prizeIcon3: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center"
  },
  prizeIcon4: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center"
  },

  prizeIcon5: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center"
  },
  prizeIcon6: {
    width: 0.15 * width,
    height: 0.16 * width,
    alignSelf: "center",
    // top:-10
  },

  missionBar: {
    left:-5,
    paddingTop:35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  tcImg: {
    width: 46,
    height: 42
  },
  spinImg: {
    width: 160,
    height: 42,
    marginHorizontal: 10
  },
  headTop: {
    width: 40,
    height: 93,
    position: "absolute",
    right: -30,
    top: 0
  },
  headBottom: {
    width: 40,
    height: 93,
    position: "absolute",
    right: -30,
    bottom: -40
  }
});
