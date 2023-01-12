import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  pageView: {
    backgroundColor: "#0A0A0A",
    flex: 1
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: height
  },
  validation: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  titleTxt: {
    color: "#fff",
    lineHeight: 25,
    padding: 20,
    textAlign: "center"
  },
  username: {
    color: "#fff",
    lineHeight: 35,
    textAlign: "center"
  },
  passInput: {
    borderColor: "#a8a8a8",
    borderWidth: 1,
    marginTop: 15
    // paddingLeft: 35,
  },
  onBtn: {
    backgroundColor: "#00B324",
    // borderRadius:30,
    width: width - 30,
    marginTop: 35
  },
  okBtnTxt: {
    color: "#fff",
    lineHeight: 40,
    textAlign: "center"
  },
  patternTxt: {
    display: "flex",
    position: "absolute",
    width: width,
    alignItems: "center",
    zIndex: 11
  },
  passIconIos: {
    width: 26,
    height: 26,
    position: "absolute",
    left: 5,
    top: DeviceInfoIos?5:3
  },
  passIconAndroid: {
    width: 26,
    height: 26,
    position: "absolute",
    left: 5,
    top: 10
  },
  passTextInput: {
    width: width - 30,
    padding: 8,
    paddingLeft: 35,
    color: "#fff"
  }
});
