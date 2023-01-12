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
const { width, height } = Dimensions.get("window");

// 抽奖结果弹窗
class SMResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headTitle: ""
    };
  }

  componentDidMount() {}

  toggle() {
    if (this.props.deposit) {
      this.props.togglePopUp("deposit");
    }
    if (this.props.noPrize) {
      this.props.togglePopUp("noPrize");
    }
    if (this.props.win) {
      this.props.togglePopUp("win");
    }
  }

  render() {
    const { popupType, prizeName,userTime, errorMsg,remaining } = this.props;

    console.log(userTime,'AAAW1111',remaining)
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}
      >
        <View style={styles.prizeModal}>
          <View style={styles.prizePopup}>
          
          <ImageBackground
              source={require("../../images/slotmachine/popupbackground.png")}
              style={styles.slotmachineImgContainer}
            >

            <Flex style={styles.head}>
              <View style={styles.headContiner}>
                 
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.closeBtn}
                >
                  <Text style={styles.closeBtnText}>X</Text>
                </TouchableOpacity>
              </View>
            </Flex>

            {popupType == "deposit" ? (
              <View style={styles.prizeItemList}>
                <Text style={styles.depostiText}>{errorMsg}</Text> 
              </View>
            ) : null}

            {popupType == "noPrize" ? (
              <View style={styles.prizeItemList}>
                 <View alignItems="center">
                 <Image
                  source={require("../../images/slotmachine/popupoops.png")}
                  style={styles.nowinImg}
                /> 
                </View>
                <View alignItems="center" style={{left:10}}>
                <Text style={[styles.depostiText,{top:-10,fontSize:24}]}>抽奖落空，请再接再厉！ </Text>
              <Text style={[styles.depostiText,{top:-25,fontSize:17,left:-5}]}>今天剩余 <Text style={{color:'#d6c188',fontSize:26}}>{userTime}</Text> 次抽奖机会 </Text>
                 </View>

              <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                top:-20,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                > 
                  <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>返回</Text>
                  </View>
                </TouchableOpacity>


                {remaining != 0  && 
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                  style={{paddingLeft:15}}
                > 
                   <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>继续抽奖</Text>
                  </View>
                </TouchableOpacity>
                }



                {userTime != 0  && remaining == 0&&
                 <TouchableOpacity
                 onPress={() => {
                   // this.toggle()
                   this.props.goBankD();
                 }}
                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                 style={{paddingLeft:15}}
               > 
                  <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                   <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>立即充值</Text>
                 </View>
               </TouchableOpacity>
                
                }
                
 
 
                </View>

              </View>
            ) : null}


            {popupType == "noPrizeToady" ? (
              <View style={styles.prizeItemList}>
                 <View alignItems="center">
                 <Image
                  source={require("../../images/slotmachine/popupoops.png")}
                  style={styles.nowinImg}
                /> 
                </View>
                <View alignItems="center" style={{left:10}}>
                <Text style={[styles.depostiText,{top:-10,fontSize:24}]}>抽奖落空，请再接再厉！ </Text>
              <Text style={[styles.depostiText,{top:-25,fontSize:17,left:-5}]}>今天的抽奖次数已用完</Text>
                 </View>

              <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                top:-20,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                > 
                  <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>返回</Text>
                  </View>
                </TouchableOpacity>
 
                </View>

              </View>
            ) : null}

            {popupType == "win" ? (
              <View style={[styles.prizeItemList]}>
                <Image
                  source={require("../../images/slotmachine/win.png")}
                  style={[styles.winImg,{top:-30}]}
                />
                <Text style={[styles.depostiText,{top:-10,fontSize:24}]}>恭喜你获得彩金 {prizeName}！</Text>
                {userTime != 0 ?
                <Text style={[styles.depostiText,{top:-25,fontSize:17,left:-5}]}>今天剩余 <Text style={{color:'#d6c188',fontSize:26}}>{userTime}</Text> 次抽奖机会 </Text>
               :
               <Text style={[styles.depostiText,{top:-25,fontSize:17,left:-5}]}>今天抽奖次数已用完，明天再接再厉。</Text>
                }
                
                <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                top:-25,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                > 
                  <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>返回</Text>
                  </View>
                </TouchableOpacity>


                {userTime != 0  && remaining == 0 &&
                 <TouchableOpacity
                 onPress={() => {
                   // this.toggle()
                   this.props.goBankD();
                 }}
                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                 style={{paddingLeft:15}}
               > 
                  <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                   <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>立即充值</Text>
                 </View>
               </TouchableOpacity>
                
                }

                {remaining != 0  &&  
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                  style={{paddingLeft:15}}
                > 
                   <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>继续抽奖</Text>
                  </View>
                </TouchableOpacity>
                }
 
                </View>
                
              </View>
            ) : null}

            {popupType == "err" ? (
              <View style={[styles.prizeItemList,{height: 0.9 * width}]}>
                <Text style={[styles.depostiText,{top:-50,fontSize:16,left:5}]}>{errorMsg}</Text>

                <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                bottom:0,  
              }}>
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.togglePopUp("");
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                > 
                  <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>返回</Text>
                  </View>
                </TouchableOpacity>

                {errorMsg != '今天的抽奖次数已用完，明天再接再厉。'  &&
                <TouchableOpacity
                  onPress={() => {
                    // this.toggle()
                    this.props.goBankD();
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                  style={{paddingLeft:15}}
                > 
                   <View style={{backgroundColor:'#41751f',width:93,height:28}}>
                    <Text style={{textAlign:'center',top:5,color:'#fff',fontSize:16}}>立即充值</Text>
                  </View>
                </TouchableOpacity>
                }

                </View>
              </View>
            ) : null}
 
              </ImageBackground>
          </View>
        </View>
      </Modal>
    );
  }
}

export default SMResult;

const styles = StyleSheet.create({
  slotmachineImgContainer: {
    width: width,
    height: 0.9 * width,
    alignItems: "center", 
    // justifyContent: "center"
  },
  prizeModal: {
    justifyContent: "center",
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.9)"
  },
  prizePopup: {
    alignItems: "center",
    backgroundColor: "transparent"
  },
  head: { 
    width: width - 20,
  },
  headContiner: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end", 
  },
  headTitle: {
    width: "90%",
    fontSize: 18,
    color: "#fff", 
  },
  closeBtn: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center", 
    paddingTop:30,
    paddingRight:15
  },
  closeBtnText: {
    width: 24,
    height: 24,
    fontSize: 23,
    color: "#fff",
    textAlign: "center", 
  },
  prizeItemList: {
    width: width - 20,
    paddingVertical: 30, 
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  depostiTextB2:{
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 5,
    color:"#fff"
  },
  depostiText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 10,
    color:"#fff"
  },
  winImg: {
    width: 0.4 * width,
    height: 0.42 * width,
    marginTop:-60,
  },
  nowinImg: {
    width: 0.4 * width,
    height: 0.24 * width,
    top:-30,
    left:-10
  }
});
