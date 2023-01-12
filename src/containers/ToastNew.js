import React, { Component } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import ToastNew from "react-native-root-toast";
let { width, height } = Dimensions.get("window");
export default class ToastNew1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { toastErrorFlag, toastSuccessFlag, toastMsg } = this.props;
    return (
      <View>
        <ToastNew
          visible={toastErrorFlag}
          position={0}
          shadow={false}
          animation={false}
          hideOnPress={true}
          backgroundColor="#fff"
          opacity={1}
        >
          <Image
            resizeMode="contain"
            source={require("../images/error_icon.png")}
            style={{ width: 16, height: 16 }}
          />
          <Text
            style={{
              color: "#333333",
              fontSize: 14,
            }}
          >
            {" "}
            {toastMsg}
          </Text>
        </ToastNew>
        <ToastNew
          visible={toastSuccessFlag}
          position={0}
          shadow={false}
          animation={false}
          hideOnPress={true}
          backgroundColor="#fff"
          opacity={1}
        >
          <Image
            resizeMode="contain"
            source={require("../images/icon_success.png")}
            style={{ width: 16, height: 16, marginRight: 10 }}
          ></Image>
          <Text
            style={{
              color: "#333333",
              fontSize: 14,
            }}
          >
            {toastMsg}
          </Text>
        </ToastNew>
      </View>
    );
  }
}
