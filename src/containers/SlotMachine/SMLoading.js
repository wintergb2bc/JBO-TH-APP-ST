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

// loading弹窗
class SMLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    Toast.loading("");
  }
  componentWillUnmount() {
    Toast.hide();
  }

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
            <View style={styles.loadingContainer}>
            <Image source={require("../../images/loading.gif")} style={{width:60,height:60}}/>
            </View>

          </View>
        </View>
      </Modal>
    );
  }
}

export default SMLoading;

const styles = StyleSheet.create({
  prizeModal: {
    justifyContent: "center",
    flex: 1,

    // backgroundColor: "rgba(0, 0, 0, 0.9)"
  },
  prizePopup: {
    // width:0.5*width,
    // height:0.5*width,
    // backgroundColor: "rgba(0, 0, 0, 0.9)",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  loadingContainer:{
    // width:0.5*width,
    // height:0.3*width,
    width:width,
    height:height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius:10,
    alignItems: "center",
    justifyContent: "center",
  },
  head: {
    backgroundColor: "#00633c",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  headContiner: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
    width: "10%",
    alignItems: "center",
    justifyContent: "center"
    // right:10
  },
  closeBtnText: {
    width: 24,
    height: 24,
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#d3d3d3"
  },
  prizeItemList: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  prizeItem: {
    flexDirection: "row",
    marginVertical: 10
  },
  prizeItemLeft: {
    flexDirection: "column",
    width: 0.5 * width,
    justifyContent: "center",
    alignItems: "center"
  },
  prizeItemText: {
    fontSize: 18,
    fontWeight: "bold"
  },

  prizeLeftImg: {
    width: 0.4 * width,
    height: 0.12 * width
  },
  prizeItemRight: {
    flexDirection: "column",
    width: 0.5 * width,
    justifyContent: "center",
    alignItems: "center"
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
    width: 0.4 * width,
    height: 0.3 * width
  }
});
