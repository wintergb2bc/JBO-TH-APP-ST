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
import moment from "moment";
const { width, height } = Dimensions.get("window");

class Promotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promotionListing: [],
    };
  }
  componentDidMount() {
    global.storage
      .load({
        key: "Promotions",
        id: "Promotions",
      })
      .then((promotionListing) => {
        let data = promotionListing.filter(
          (v) =>
            v.promotionCategoryIdList.map((v) => v * 1).includes(111)
        );
        this.setState({ promotionListing: data });
      })
      .catch(() => {
        // Toast.loading("优惠加载中,请稍候...", 200);
      });
  }
  //優惠打開
  openPref(item) {
    Actions.preferentialPage({
      preferential: item,
    });
    // Actions.preferential();
  }
  render() {
    const { promotionListing } = this.state;
    return (
      <View style={{ backgroundColor: "#0A0A0A", flex: 1, padding: 10 }}>
        {promotionListing.map((row, id) => {
          return (
            id < 3 && (
              <TouchableOpacity onPress={() => this.openPref(row)}>
                <View style={{ paddingVertical: 10 }}>
                  <View>
                    {row.promotionBannerExpiresSoon && (
                      <View style={[styles.labelStyle]}>
                        <Text style={{ color: "#fff", fontSize: 12 }}>
                          สิ้นสุดเร็วๆนี้
                        </Text>
                      </View>
                    )}
                    {row.promotionBannerHot && (
                      <View
                        style={[
                          styles.labelStyle,
                          { backgroundColor: "#F44336" },
                        ]}
                      >
                        <Text style={{ color: "#fff" }}>ฮอต</Text>
                      </View>
                    )}
                    {row.promotionBannerNew && (
                      <View
                        style={[
                          styles.labelStyle,
                          { backgroundColor: "#2196F3" },
                        ]}
                      >
                        <Text style={{ color: "#fff" }}>ใหม่</Text>
                      </View>
                    )}
                    {row.promotionBannerHot && (
                      <View
                        style={[
                          styles.labelStyle,
                          { backgroundColor: "#B57D3B" },
                        ]}
                      >
                        <Text style={{ color: "#fff" }}>พิเศษสำหรับสมาชิก</Text>
                      </View>
                    )}
                    <Image
                      resizeMode="stretch"
                      style={styles.newsHeadCardImgstyle}
                      source={{ uri: row.promotionBannerThumbnail }}
                    ></Image>
                    {/* <View
                      style={{ position: "absolute", bottom: 10, left: 10 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 12 }}>
                        Expired on{" "}
                        {moment(row.promotionEffectiveEndDate).format(
                          "YYYY/MM/DD HH:mm:ss"
                        )}
                      </Text>
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        {row.postTitle}
                      </Text>
                    </View> */}
                  </View>
                  {/* {row.promotionRuleDetail.promotionRuleSummary && (
                    <Flex
                      style={{
                        backgroundColor: "#222222",
                        paddingVertical: 10,
                        width: width * 0.9,
                      }}
                    >
                      {row.promotionRuleDetail.promotionRuleSummary.map(
                        (data) => {
                          return (
                            <Flex.Item>
                              <Text
                                style={{
                                  color: "#9E9E9E",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                              >
                                {data.summaryOptionDisplayTitle}
                              </Text>
                              <Text
                                style={{
                                  color: "#fff",
                                  textAlign: "center",
                                  fontSize: 12,
                                }}
                              >
                                {data.summaryOptionDisplayValue}
                              </Text>
                            </Flex.Item>
                          );
                        }
                      )}
                    </Flex>
                  )} */}
                </View>
              </TouchableOpacity>
            )
          );
        })}
      </View>
    );
  }
}

export default Promotion;

const styles = StyleSheet.create({
  wrapper: {
    height: 0.4385 * width,
  },
  newsHeadCardImgstyle: {
    width: width * 0.9,
    height: height/6* 0.9,
    borderRadius: 8,
  },
  labelStyle: {
    position: "absolute",
    right: 0,
    top: 10,
    zIndex: 1000,
    backgroundColor: "#9a4edd",
    borderRadius: 4,
    padding: 5,
  },
});
