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

// 老虎机奖品弹窗
class SMPrizes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
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
 
              <View style={styles.headContiner}>
                
                <TouchableOpacity
                  onPress={() => {
                    this.props.togglePrizesPopup();
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                >
                  <Text style={styles.closeBtnText}>X</Text>
                </TouchableOpacity>
              </View> 

            <View style={styles.prizeItemList}>


           
            <Image resizeMode="stretch"
                    source={require("../../images/slotmachine/cnmobileprize.png")}
                    style={styles.prizeLeftImg}
                  />

              <TouchableOpacity
                  onPress={() => {
                    this.props.togglePrizesPopup();
                  }}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                 
                >
                 <View style={{backgroundColor:'#41751f',marginTop:10,left:0.15*width,justifyContent:'center',alignContent:'center',width:120,height:30}}>
                    <Text style={{color:'#fff',textAlign:'center',fontSize:14}}>ปิด</Text>
                </View>

                </TouchableOpacity>

              {/* <Flex style={styles.prizeItem}>
                <View style={styles.prizeItemLeft}>
                  <Text style={styles.prizeItemText}>头奖</Text>
                  <Image
                    source={require("../../images/slotmachine/prizes/1.png")}
                    style={styles.prizeLeftImg}
                  />
                </View>
                <View style={styles.prizeItemRight}>
                  <Image
                    source={require("../../images/slotmachine/prizes/Ticket.png")}
                    style={styles.prizeRightImg1}
                  />
                    <Text>双人豪华西甲之旅</Text>
                </View>
              </Flex>
              <Flex style={styles.prizeItem}>
                <View style={styles.prizeItemLeft}>
                  <Text style={styles.prizeItemText}>二奖</Text>
                  <Image
                    source={require("../../images/slotmachine/prizes/2.png")}
                    style={styles.prizeLeftImg}
                  />
                </View>
                <View style={styles.prizeItemRight}>
                  <Image
                    source={require("../../images/slotmachine/prizes/Betispng.png")}
                    style={styles.prizeRightImg2}
                  />
                    <Text>西甲皇家贝蒂斯球衣</Text>
                </View>
              </Flex>
              <Flex style={styles.prizeItem}>
                <View style={styles.prizeItemLeft}>
                  <Text style={styles.prizeItemText}>三奖</Text>
                  <Image
                    source={require("../../images/slotmachine/prizes/3.png")}
                    style={styles.prizeLeftImg}
                  />
                </View>
                <View style={styles.prizeItemRight}>
                  <Image
                    source={require("../../images/slotmachine/prizes/sz.png")}
                    style={styles.prizeRightImg3}
                  />
                    <Text>中超深圳球迷球衣</Text>
                </View>
              </Flex> */}
            </View>

          
              
              </ImageBackground>
          </View>
 
        </View>
      </Modal>
    );
  }
}

export default SMPrizes;

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
    width: width -110,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
  },
  headContiner: {
    width: width -55, 
    paddingTop:25, 
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  headTitle: {
    width: "90%",
    textAlign: "left",
    paddingTop: 15,
    paddingBottom: 10,
    fontSize: 18,
    color: "#fff",
    left: 0.04 * width
  },
  closeBtn: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    right:-25,
    top:35
    // right:10
  },
  closeBtnText: {
    width: 24,
    height: 24,
    fontSize: 22,
    color: "#fff",
    textAlign: "center",
  },
  prizeItemList:{
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
  },
  prizeItem: {
    flexDirection: "row",
    marginVertical:10,
  },
  prizeItemLeft: {
    flexDirection: "column",
    width: 0.5 * width,
    justifyContent:"center",
    alignItems:"center",
  },
  prizeItemText:{
      fontSize:18,
      fontWeight:"bold"
  },

  prizeLeftImg: {
    width: width -150,
    height:  width-150, 
  },
  prizeItemRight:{
    flexDirection: "column",
    width: 0.5 * width,
    justifyContent:"center",
    alignItems:"center",
  },
  prizeRightImg1: {
    width: 0.4 * width,
    height: 0.29 * width
  },
  prizeRightImg2: {
    width: 0.2 * width,
    height: 0.255 * width
  },
  prizeRightImg3: {
    width: 0.22 * width,
    height: 0.255 * width
  },
});
