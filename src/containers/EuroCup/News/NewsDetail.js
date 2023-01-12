import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  WebView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast, Flex, Picker, List, Tabs, WhiteSpace } from "antd-mobile-rn";
import Carousel, { Pagination } from "react-native-snap-carousel";
import HTMLView from "react-native-htmlview";
import WebViewIOS from "react-native-webview";
import Share from "react-native-share";
import moment from "moment";

const { width, height } = Dimensions.get("window");

class NewsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NewsDetail: {},
      recommendList: [],
    };
  }

  componentDidMount() {
    this.getArticleDetail();
    // !this.props.isHeadNews && this.GetArticlesRecommendation();
  }
  getArticleDetail() {
    fetchRequest(
      ApiPort.GetArticleDetail + "postId=" + this.props.postId + "&",
      "GET"
    ).then((res) => {
      console.log("NewsDetailList:", res);
      this.setState({
        NewsDetail: res,
      });
    });
  }
  // GetArticlesRecommendation() {
  //   fetchRequest(
  //     ApiPort.GetArticlesRecommendation + "postId=" + this.props.postId + "&",
  //     "GET"
  //   ).then((res) => {
  //     console.log("recommendList:", res);
  //     this.setState({
  //       recommendList: res,
  //     });
  //   });
  // }

  ShareUrl() {
    if (!Share) {
      // Toast.fail("分享失败，请重试");
      return;
    }
    let link = `${SBTDomain}/th/mobile/euro2020/news/content/?postId=${this.props.postId}`;
    const shareOptions = {
      title: "",
      url: link,
      failOnCancel: false,
    };
    return Share.open(shareOptions);
  }
  render() {
    const { NewsDetail, recommendList } = this.state;
    const {recArticle}=this.props
    return (
      <View style={{ backgroundColor: "#0A0A0A", flex: 1, padding: 10 }}>
        <Flex style={{ marginBottom: 20 }}>
          <Flex.Item>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
              onPress={() => Actions.pop()}
            >
              <Image
                resizeMode="stretch"
                source={require("../../../images/icon-back.png")}
                style={{ width: 28, height: 28 }}
              />
            </TouchableOpacity>
          </Flex.Item>
          <Flex.Item>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              รายละเอียดข่าว
            </Text>
          </Flex.Item>
          <Flex.Item>
            <TouchableOpacity
              onPress={this.ShareUrl.bind(this)}
              style={{ alignSelf: "flex-end" }}
            >
              <Image
                resizeMode="stretch"
                source={require("../../../images/EuroCup/share.png")}
                style={{ width: 21, height: 21 }}
              />
            </TouchableOpacity>
          </Flex.Item>
        </Flex>
        {NewsDetail && (
          <View>
            <View style={styles.newIconStyle}>
              {NewsDetail.postLabel && NewsDetail.postLabel[0] == "New" && (
                <View
                  style={{
                    backgroundColor: "red",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    marginRight: 5,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    ใหม่
                  </Text>
                </View>
              )}
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                {NewsDetail.postTitle}
              </Text>
            </View>
            <Text
              style={{ color: "#CCCCCC", fontSize: 14, paddingVertical: 10 }}
            >
              {moment(NewsDetail.postedDate).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
            {/* detail content */}
            <View
              style={{
                width: width - 30,
                height: height - 370,
                backgroundColor: "#000000",
              }}
            >
              {Platform.OS === "ios" ? (
                <WebViewIOS
                  mediaPlaybackRequiresUserAction={false}
                  style={{ backgroundColor: "transparent" }}
                  source={{ uri: NewsDetail.articleContent }}
                  scrollEnabled={true}
                />
              ) : (
                <WebView
                  mediaPlaybackRequiresUserAction={false}
                  source={{ uri: NewsDetail.articleContent }}
                  style={{
                    flex: 1,
                    marginHorizontal: 15,
                    backgroundColor: "#000000",
                  }}
                />
              )}
            </View>
          </View>
        )}

        {/* 推薦新聞 */}
        {!this.props.isHeadNews && (
          <View style={{ padding: 10 }}>
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                paddingVertical: 10,
                fontSize: 16,
              }}
            >
              ข่าวล่าสุด
            </Text>
            {recArticle && (
              <TouchableOpacity
                onPress={() =>
                  Actions.NewsDetail({ postId: recArticle.postId ,isHeadNews:true})
                }
              >
                <Flex style={{ paddingVertical: 5 }}>
                  <Flex.Item style={{ flex: 0.5 }}>
                    <Image
                      resizeMode="stretch"
                      style={styles.newCardImgstyle}
                      source={{ uri: recArticle.articleThumbnail }}
                    />
                  </Flex.Item>
                  <Flex.Item>
                    <View
                      style={{ height: 0.8 * width * 0.3, paddingLeft: 10 }}
                    >
                      <Text style={{ fontSize: 14, color: "#fff" }}>
                        {recArticle.postTitle}
                      </Text>

                      <Text style={styles.recomendnewsTxt}>
                        {moment(recArticle.postedDate).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </Text>
                    </View>
                  </Flex.Item>
                </Flex>
              </TouchableOpacity>
            )}
          </View>
        )}
        <Text
          style={{
            position: "absolute",
            bottom: 20,
            color: "#999999",
            fontSize: 12,
            alignSelf: "center",
          }}
        >
          Copyright © 2011-2021 JBO All Rights Reserved.
        </Text>
      </View>
    );
  }
}

export default NewsDetail;

const styles = StyleSheet.create({
  wrapper: {
    height: 0.4385 * width,
  },
  newCardImgstyle: {
    width: width * 0.3,
    height: 0.8 * width * 0.3,
    marginBottom: 10,
    borderRadius: 8,
  },
  recomendnewsTxt: {
    fontSize: 12,
    color: "#CCCCCC",
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  newIconStyle: {
    // position: "absolute",
    // left: 15,
    // top: 20,
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
