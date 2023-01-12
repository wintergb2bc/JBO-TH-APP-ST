import React, { Component } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import Touch from 'react-native-touch-once';
const { width, height } = Dimensions.get("window");
/**
 * 优惠教学
 */
class PreferentialTutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };
  }

  onIndicatorClick() {
    if (this.state.step == 6) {
      this.props.closeTutorail();
    } else {
      this.setState({ step: this.state.step + 1 });
    }
  }

  render() {
    const { step } = this.state;

    return (
      <View style={styles.tutorialRoot}>
        <View style={styles.tutorialBox}>
          <View style={styles.indicatorBox}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                alignItems: "center"
              }}
              onPress={() => {
                this.onIndicatorClick();
              }}
            >
              {step !== 6 ? (
                <Text style={styles.indicatorText}>下一步</Text>
              ) : null}
              {step == 6 ? (
                <Text style={styles.indicatorText}>ยืนยัน</Text>
              ) : null}
            </TouchableOpacity>
          </View>

          <View style={styles.box}>
            <View style={styles.cap}>
              {step == 1 && <Text style={styles.capTitle}>全体会员优惠</Text>}
              {(step == 2 || step == 3 || step == 4) && (
                <Text style={styles.capTitle}>活动优惠申请</Text>
              )}
              {(step == 5 || step == 6) && (
                <Text style={styles.capTitle}>充值优惠申请</Text>
              )}
            </View>
            {step == 1 && (
              <Image
                resizeMethod="auto"
                resizeMode="stretch"
                style={styles.image}
                source={require("../images/tutorial/1.png")}
              />
            )}
            {step == 2 && (
              <Image
                resizeMethod="auto"
                resizeMode="stretch"
                style={styles.image}
                source={require("../images/tutorial/2.png")}
              />
            )}
            {step == 3 && (
              <Image
                resizeMethod="auto"
                resizeMode="stretch"
                style={styles.image}
                source={require("../images/tutorial/3.png")}
              />
            )}
            {step == 4 && (
              <Image
                resizeMethod="auto"
                resizeMode="stretch"
                style={styles.image}
                source={require("../images/tutorial/4.png")}
              />
            )}
            {step == 5 && (
              <Image
                resizeMethod="auto"
                resizeMode="stretch"
                style={styles.image}
                source={require("../images/tutorial/5.png")}
              />
            )}
            {step == 6 && (
              <Image
                resizeMethod="auto"
                resizeMode="stretch"
                style={styles.image}
                source={require("../images/tutorial/6.png")}
              />
            )}
          </View>

          <Touch
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              alignItems: "center"
            }}
            style={styles.closeBox}
            onPress={() => {
              this.props.closeTutorail();
            }}
          >
            <Text style={styles.closeText}>รับทราบ</Text>
          </Touch>
        </View>
      </View>
    );
  }
}

export default PreferentialTutorial;

const styles = StyleSheet.create({
  tutorialRoot: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    // color:"#000",
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center"
  },
  tutorialBox: {
    // flex: 1,
    // display:'flex',
    // justifyContent:'flex-start',
    // alignItems:'center',
    // alignContent:'flex-start',
    width: width - 40,
    height: 0.8 * height,
    justifyContent: "center",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    // position: 'absolute',
    top: -85,
    // left: 0,
    // borderRadius: 12,
    // backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#000",
    // paddingBottom: 20,
    zIndex: 1000,
    elevation: 2
    // alignSelf: "center"
  },
  indicatorBox: {
    alignItems: "flex-end",
    width: "100%",
    zIndex: 1000
    // backgroundColor: "#006733",
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12
  },
  indicatorText: {
    // width:"100%",
    color: "#fff",
    padding: 15,
    fontSize: 16
    // paddingLeft: 20,
    // textAlign: "right"
  },

  box: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    paddingTop: 10
  },
  cap: {
    width: width - 40,
    backgroundColor: "#272727",
    borderRadius: 5,
    padding: 5
  },
  capTitle: {
    fontWeight: "bold",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    color: "#fff",
    textAlign: "center"
  },

  image: { width: width - 40, height: 0.88 * (width - 40) },
  closeBox: {
    width: "100%",
    backgroundColor: "#225926",
    zIndex: 1000
  },
  closeText: {
    // width: 0.6 * width,
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 16,
    // backgroundColor: "#006733",
    // borderRadius: 18,
    color: "#fff"
    // paddingTop:20
  }
  //   text: {
  //     color: "#000",
  //     // paddingTop:2,
  //     // paddingBottom:5,
  //     padding: 5,
  //     textAlign: "center"
  //   }
});
