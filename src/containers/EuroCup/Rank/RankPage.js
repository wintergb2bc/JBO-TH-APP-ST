import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  Image,
  View,
  ViewStyle,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  CameraRoll,
  RefreshControl,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast, Flex, Picker, List, Tabs, WhiteSpace } from "antd-mobile-rn";
import Carousel, { Pagination } from "react-native-snap-carousel";
import HTMLView from "react-native-htmlview";
import WebViewIOS from "react-native-webview";

const { width, height } = Dimensions.get("window");
const imgdata = [
  { img: require("../../../images/EuroCup/rank/rank1.png") },
  { img: require("../../../images/EuroCup/rank/rank2.png") },
  { img: require("../../../images/EuroCup/rank/rank3.png") },
  { img: require("../../../images/EuroCup/rank/rank4.png") },
  { img: require("../../../images/EuroCup/rank/rank5.png") },
  { img: require("../../../images/EuroCup/rank/rank6.png") },
  { img: require("../../../images/EuroCup/rank/rank7.png") },
  { img: require("../../../images/EuroCup/rank/rank8.png") },
  { img: require("../../../images/EuroCup/rank/rank9.png") },
  { img: require("../../../images/EuroCup/rank/rank10.png") },
  { img: require("../../../images/EuroCup/rank/rank11.png") },
  { img: require("../../../images/EuroCup/rank/rank12.png") },
  { img: require("../../../images/EuroCup/rank/rank13.png") },
  { img: require("../../../images/EuroCup/rank/rank14.png") },
  { img: require("../../../images/EuroCup/rank/rank15.png") },
  { img: require("../../../images/EuroCup/rank/rank16.png") },
  { img: require("../../../images/EuroCup/rank/rank17.png") },
  { img: require("../../../images/EuroCup/rank/rank18.png") },
  { img: require("../../../images/EuroCup/rank/rank19.png") },
  { img: require("../../../images/EuroCup/rank/rank20.png") },
  { img: require("../../../images/EuroCup/rank/rank21.png") },
  { img: require("../../../images/EuroCup/rank/rank22.png") },
  { img: require("../../../images/EuroCup/rank/rank23.png") },
  { img: require("../../../images/EuroCup/rank/rank24.png") },
];
class RankPage extends React.Component {
  constructor(props) {
    super(props);
  }
 
  render() {
    return (
      <View style={{ backgroundColor: "#0A0A0A", flex: 1, padding: 10 }}>
        <ScrollView style={{ flex: 1 }}>
          <View>
            {imgdata.map((row) => {
              return (
                <Image
                  style={{
                    width: width - 40,
                    height: (width - 40) * 0.33,
                    marginBottom: 10,
                    alignSelf: "center",
                  }}
                  resizeMode="stretch"
                  source={row.img}
                ></Image>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default RankPage;

const styles = StyleSheet.create({
  wrapper: {
    height: 0.4385 * width,
  },
});
