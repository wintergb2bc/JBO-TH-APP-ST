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
import moment from "moment";

const { width, height } = Dimensions.get("window");

class NewsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BannerDB: [],
      activeSlide: 0,
      articleList: props.articleList,
      showBackTop: false,
    };
  }

  componentDidMount() {
    this.getArticles();
  }

  getArticles() {
    fetchRequest(
      ApiPort.GetArticle +
        "&pageSize=" +
        this.props.totalArticle +
        "&pageNumber=1&",
      "GET"
    ).then((res) => {
      console.log("getArticles", res);
      this.setState({
        articleList: res.articleListing,
      });
    });
  }
  newHeader() {
    const { articleList } = this.state;
    if (articleList && articleList.length > 1) {
      return (
        <TouchableOpacity
          onPress={() =>
            Actions.NewsDetail({
              postId: articleList[0].postId,
              isHeadNews: true,
            })
          }
        >
          <View style={{ paddingVertical: 20 }}>
            {articleList[0].postLabel[0] &&
              articleList[0].postLabel[0] == "New" && (
                <View style={styles.newIconStyle}>
                  <Image
                    resizeMode="stretch"
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 5,
                    }}
                    source={require("../../../images/EuroCup/new.png")}
                  />
                  <Text style={{ color: "#fff" }}>ใหม่</Text>
                </View>
              )}
            <Image
              resizeMode="stretch"
              style={styles.newsHeadCardImgstyle}
              source={{ uri: articleList[0].articleThumbnail }}
            />
            <View style={{ position: "absolute", bottom: 25, left: 15 }}>
              <Text style={{ fontSize: 14, color: "#fff" }}>
                {articleList[0].postTitle}
              </Text>
              <Text style={{ fontSize: 12, color: "#CCCCCC" }}>
                {moment(articleList[0].postedDate).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
  handleScroll(e) {
    console.log("handleScroll", e.nativeEvent.contentOffset.y);
    if (e.nativeEvent.contentOffset.y > 250) {
      this.setState({ showBackTop: true });
    } else {
      this.setState({ showBackTop: false });
    }
  }
  render() {
    const { articleList, showBackTop } = this.state;
    return (
      <View style={{ backgroundColor: "#0A0A0A", flex: 1 }}>
        {/* 回到上方 */}
        {showBackTop && (
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10,
              bottom: 100,
              zIndex: 1000,
            }}
            onPress={() => {
              this.scrollView.scrollTo({ x: 0, y: 0, animated: true }, 1);
            }}
          >
            <Image
              resizeMode="stretch"
              source={require("../../../images/EuroCup/Backtotop.png")}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        )}
        <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={(view) => {
            this.scrollView = view;
          }}
          style={{ flex: 1 }}
          onScroll={this.handleScroll.bind(this)}
        >
          <View style={{ paddingHorizontal: 10 }}>
            {this.newHeader()}
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                marginVertical: 10,
              }}
            >
              แนะนำสำหรับคุณ
            </Text>
            {articleList &&
              articleList.length > 1 &&
              articleList.map((row, id) => {
                return (
                  id > 0 && (
                    <TouchableOpacity
                      onPress={() => Actions.NewsDetail({ postId: row.postId,recArticle:articleList[0] })}
                    >
                      <Flex style={styles.articleListStyle}>
                        <Flex.Item style={{ flex: 0.5 }}>
                          <Image
                            resizeMode="stretch"
                            style={styles.newCardImgstyle}
                            source={{ uri: row.articleThumbnail }}
                          />
                        </Flex.Item>
                        <Flex.Item>
                          <View
                            style={{
                              height: 0.8 * width * 0.3,
                              paddingLeft: 10,
                            }}
                          >
                            <Text style={{ fontSize: 14, color: "#fff" }}>
                              {row.postTitle}
                            </Text>

                            <Text style={styles.postdateStyle}>
                              {moment(row.postedDate).format(
                                "YYYY-MM-DD HH:mm:ss"
                              )}
                            </Text>
                          </View>
                        </Flex.Item>
                      </Flex>
                    </TouchableOpacity>
                  )
                );
              })}
          </View>
          <Text
            style={{
              color: "#999999",
              textAlign: "center",
              marginVertical: 30,
              fontSize: 12,
            }}
          >
            Copyright © 2011-2021 JBO All Rights Reserved.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

export default NewsPage;

const styles = StyleSheet.create({
  wrapper: {
    height: 0.4385 * width,
  },
  newIconStyle: {
    position: "absolute",
    left: 15,
    top: 20,
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  postdateStyle: {
    fontSize: 12,
    color: "#CCCCCC",
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  newsHeadCardImgstyle: {
    width: width * 0.9,
    height: 0.62 * width * 0.9,
    marginBottom: 10,
    borderRadius: 8,
    alignSelf: "center",
  },
  newCardImgstyle: {
    width: width * 0.3,
    height: 0.8 * width * 0.3,
    marginBottom: 10,
    borderRadius: 8,
  },
  articleListStyle: {
    paddingVertical: 5,
    borderBottomColor: "#222222",
    borderBottomWidth: 1,
    marginBottom: 5,
    alignSelf: "center",
  },
});
