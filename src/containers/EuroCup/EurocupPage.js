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
  ImageBackground,
  RefreshControl,
  NativeModules
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Toast, Flex, Picker, List, Tabs, WhiteSpace } from "antd-mobile-rn";
import Carousel from "react-native-banner-carousel";
import moment from "moment";
import BannerCountDown from "./BannerCountDown";
import GameTab from "./Tabs/GameTab";
import VendorIM from "$LIB/vendor/im/VendorIM";
import MiniEvent from "@/game/Betting/MiniEvent";
import BetRecordTab from "./Tabs/BetRecordTab";
const { width, height } = Dimensions.get("window");
import { ACTION_MaintainStatus_SetIM } from "../lib/redux/actions/MaintainStatusAction";
import { ACTION_UserInfo_getBalanceAll } from "../lib/redux/actions/UserInfoAction";
import { connect } from "react-redux";
import Promotion from "./Promotion";

const tabs = [
  { id: 0, title: "ข้อมูล" },
  { id: 1, title: "การแข่งขัน" },
  { id: 2, title: "ประวัติการเดิมพัน" },
];
class EurocupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BannerDB: [],
      activeSlide: 0,
      articleList: [],
      totalArticle: 0,
      tabKey: 0,
      scrollTop: 0,
      //從詳情頁過來的 縮小的比分框
      showMiniEvent: false,
      miniEventId: null,
      miniSportId: 1,
      miniLeagueId: null,
      miniShowType: 0,
      balance: "",
      showBanner: true,
      promotionListing:[]
    };
  }

  componentDidMount() {
    this.GetBanner();
    this.getArticles();
    if (ApiPort.UserLogin) {
      const IMloginPromise = VendorIM.getTokenFromGateway().catch((e) => {
        // this.props.maintainStatus_noTokenIM(true);
        console.log("im login failed", e);
      });
    }
    // const IMloginPromise = VendorIM.getTokenFromGateway().catch((e) => {
    //     console.log('im login failed', e);
    // });

    // this.getMaintenanceStatus()
    // this.getIMGameisMaintenance()
    this.props.userInfo_getBalanceAll(true);
    global.storage
    .load({
      key: "Promotions",
      id: "Promotions",
    })
    .then((promotionListing) => {
      this.setState({ promotionListing: promotionListing });
    })
    .catch(() => {
      // Toast.loading("优惠加载中,请稍候...", 200);
    });
  }

  // componentDidMount() {
  //   if (ApiPort.UserLogin) {
  //     const IMloginPromise = VendorIM.getTokenFromGateway().catch((e) => {
  //       // this.props.maintainStatus_noTokenIM(true);
  //       console.log("im login failed", e);
  //     });
  //   }
  // }

  // 獲取維護資訊
  getMaintenanceStatus = () => {
    const providers = ["IPSB"]; // 樂天堂體育、IM體育
    let processed = [];

    providers.forEach(function (provider) {
      processed.push(
        fetchRequest(
          `${ApiPort.GetProvidersMaintenanceStatus}provider=${provider}&`
        )
      );
    });

    Promise.all(processed).then((res) => {
      let IMSportStatus;

      if (res) {
        IMSportStatus =
          res[0].ErrorCode == 0 &&
          res[0].Result &&
          res[0].Result.find((v) => v.PlatformGroup === "App")[
            "IsMaintenance"
          ];

        this.props.maintainStatus_setIM(IMSportStatus === true);

        //和token獲取狀態一起判斷
        // IMSportStatus = this.checkMaintenanceStatus('im');
      }
    });
  };

  //獲取新聞資訊
  getArticles() {
    fetchRequest(ApiPort.GetArticle + "&pageSize=4&pageNumber=1&", "GET").then(
      (res) => {
        console.log("getArticles", res);
        if (res.articleListing.length) {
          this.setState({
            articleList: res.articleListing,
            totalArticle: res.totalArticle,
          });
        }
      }
    );
  }

  //tabs切換
  onTabClick = (key) => {
    let item = key.id;
    if (this.checkLoginStatus(item)) {
      this.setState({ tabKey: item });
      this.tabsPiwik(item)
    }
  };

  tabChange = (key) => {
    if (this.checkLoginStatus(key)) {
      this.tabsPiwik(key)
      this.setState({ tabKey: key });
    }
  };

  tabsPiwik = (key) => {
    if(key == 0){
      UMonEvent('EngagementEvent_Click_TeamStatsEUROPage')
    }else if(key == 1){
      UMonEvent('EngagementEvent_View_EuroPage')
    }else if(key == 2){
      UMonEvent('EngagementEvent_View_BetRecordEuroPage')
    }
  }

  checkLoginStatus = (id) => {
    // 看賽事注單要先登入
    if ((id == 1 || id == 2) && ApiPort.UserLogin == false) {
      Actions.logins();
      return false;
    } else {
      return true;
    }
  };

  //獲取banner
  GetBanner() {
    fetchRequest(ApiPort.GetBanners + "contentType=Eurocup&", "GET").then(
      (res) => {
        console.log("GetBanner", res);
        this.setState({
          BannerDB: res.bannerListing,
        });
      }
    );
  }

  //banner 跳轉優惠
  JumtProm(item, index) {
    const { bannerAccess, bannerRedirectAction, bannerRedirectPath } = item;
    if (bannerRedirectPath.toLocaleLowerCase().includes("promotions")) {
      if (bannerRedirectPath.toLocaleLowerCase().includes("id=")) {
        if (ApiPort.UserLogin == false) {
          Toast.fail("请先登录", 2);
          Actions.logins();
          return;
        }
        let PromotionsId = bannerRedirectPath.split("=")[1];
        let promotionData =this.state.promotionListing.filter(item=>item.postId==PromotionsId)
        if(promotionData[0]){
               Actions.preferentialPage({
                preferential: promotionData[0],
            });
          }
        // Toast.loading("กำลังโหลด", 200);
        // fetchRequest(ApiPort.GetPromotionsDetail + PromotionsId + "?", "GET")
        //   .then((res) => {
        //     Toast.hide();
        //     if (res) {
        //       Actions.preferentialPage({
        //         preferential: res.promotion,
        //       });
        //     }
        //   })
        //   .catch((err) => {
        //     Toast.hide();
        //   });
        return;
      } else {
        Actions.preferential();
        return;
      }
    }
  }
  //金額分隔符
  numberWithCommas(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
  }
  renderRank() {
    const imgdata = [
      { img: require("../../images/EuroCup/rank/rank1.png") },
      { img: require("../../images/EuroCup/rank/rank2.png") },
      { img: require("../../images/EuroCup/rank/rank3.png") },
    ];
    return imgdata.map((row) => (
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
    ));
  }
  //处理底部
  getBtnPos = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, heightView, px, py) => {
      if(heightView < EuroViewHeight - 60 ) {
        let top = EuroViewHeight - heightView - 130 - (DeviceInfoIos? 15: 0)
        this.setState({footerMarginTop: top > 0 && top || 15})
      } else {
        this.setState({footerMarginTop: 15})
      }
    });
  }
  //获取当前高度
  getBtnPosa = (e) => {
    NativeModules.UIManager.measure(e.target, (x, y, width, heightView, px, py) => {
      window.EuroViewHeight = heightView
    });
  }
  render() {
    const {
      BannerDB,
      activeSlide,
      articleList,
      totalArticle,
      tabKey,
      scrollTop,
      showBanner,
    } = this.state;
    window.MiniEventShowEuroCup = (
      showMiniEvent,
      miniEventId,
      miniSportId,
      miniLeagueId,
      miniShowType
    ) => {
      console.log(showMiniEvent, "showMiniEventshowMiniEventshowMiniEvent");
      this.setState({
        showMiniEvent,
        miniEventId,
        miniSportId,
        miniLeagueId,
        miniShowType,
      });
    };
    window.ChangeTabs = (key) => {
      this.tabChange(key);
    };
    return (
      <View style={{ backgroundColor: "#0A0A0A", flex: 1 }} onLayout={(e) => this.getBtnPosa(e)}>
        <View style={{ padding: 20, marginTop: Platform.OS === "ios"  ? 35: 0 }}>
          <Flex>
            <Flex.Item style={{ flex: 0.3 }}>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                onPress={() => Actions.home()}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/goHome3.png")}
                  style={{ width: 22, height: 22 }}
                />
              </TouchableOpacity>
            </Flex.Item>
            {/* logo */}
            <Flex.Item style={{ flex: 1.4 }}>
              <Image
                resizeMode="stretch"
                source={require("../../images/EuroCup/logo.png")}
                style={{ width: 99, height: 30 }}
              />
            </Flex.Item>
            {ApiPort.UserLogin == false ? (
              <Flex.Item style={{ alignItems: "flex-end", flex: 1.5 }}>
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                  onPress={() => Actions.logins()}
                >
                  <View
                    style={{
                      padding: 5,
                      borderWidth: 1,
                      borderRadius: 4,
                      borderColor: "#00E62E",
                      width: ApiPort.UserLogin ? 80 : 150,
                    }}
                  >
                    <Text style={{ color: "#00E62E", textAlign: "center" }}>
                      เข้าสู่ระบบ / สมัคร
                    </Text>
                  </View>
                </TouchableOpacity>
              </Flex.Item>
            ) : (
              <Flex.Item style={{ alignItems: "flex-end", flex: 1.5 }}>
                <View
                  style={{
                    backgroundColor: "#2E2E2E",
                    borderRadius: 16,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      color: "#FFF280",
                      paddingLeft: 12,
                      paddingRight: 6,
                      paddingVertical: 9,
                    }}
                  >
                    ฿ {this.numberWithCommas(this.props.userInfo.balanceTotal)}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderRadius: 16,
                      backgroundColor: "#00A521",
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      alignSelf: "center",
                    }}
                    hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                    onPress={() => Actions.deposit({ from: "EuroCup" })}
                  >
                    <Text style={{ color: "#F5F5F5", textAlign: "center" }}>
                      ฝากเงิน
                    </Text>
                  </TouchableOpacity>
                </View>
              </Flex.Item>
            )}
            <Flex.Item style={{ alignItems: "flex-end", flex: 0.25 }}>
              <TouchableOpacity
                onPress={() => {
                  Actions.LiveChatST();
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/home/icon-csb.png")}
                  style={{ width: 21, height: 21 }}
                />
              </TouchableOpacity>
            </Flex.Item>
          </Flex>
        </View>

        {/* 回到上方 */}
        {tabKey !== 2 && (
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
              source={require("../../images/EuroCup/Backtotop.png")}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        )}
        <ScrollView
          onScroll={(e) => {
            let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
            let scrollTop = offsetY;
            this.setState({ scrollTop });
          }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={(view) => {
            this.scrollView = view;
          }}
          style={{ flex: 1 }}
        >
          <View style={{flex: 1}} onLayout={(e) => this.getBtnPos(e)} ref={(c) => {this.ViewRefs = c}}>
            {/* Banner */}
            {showBanner && (
                <View style={styles.wrapper}>
                  {BannerDB && BannerDB.length > 0 && (
                      <Carousel
                          autoplay={false}
                          ref={(c) => {
                            this._carousel1 = c;
                          }}
                          loop
                          pageIndicatorStyle={{
                            backgroundColor: "rgba(0, 149, 76, .3)",
                          }}
                          activePageIndicatorStyle={{
                            backgroundColor: "#10906D",
                          }}
                      >
                        {BannerDB.map((row, id) => {
                          if (row.bannerCountdownEnabled) {
                            return (
                                <BannerCountDown
                                    bannerCountdownEnabled={true}
                                    data={row}
                                    closebtn={() => this.setState({ showBanner: false })}
                                />
                            );
                          } else {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.JumtProm(row, id)}
                                    style={{ width: width, height: 0.4385 * width }}
                                >
                                  <TouchableOpacity
                                      onPress={() => this.setState({ showBanner: false })}
                                      style={{
                                        position: "absolute",
                                        top: 10,
                                        right: 20,
                                        zIndex: 1000,
                                      }}
                                  >
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        source={require("../../images/EuroCup/bannerClose.png")}
                                    ></Image>
                                  </TouchableOpacity>
                                  <Image
                                      resizeMode="stretch"
                                      style={{ width: width, height: 0.4385 * width }}
                                      source={{ uri: row.bannerImagePath }}
                                  />
                                </TouchableOpacity>
                            );
                          }
                        })}
                      </Carousel>
                  )}
                </View>
            )}

            {/* Tab */}
            <View style={styles.tabStyle}>
              {tabs.map((row) => {
                return (
                    <TouchableOpacity onPress={() => this.onTabClick(row)}>
                      <View
                          style={
                            tabKey == row.id
                                ? styles.tabbarDefault
                                : showBanner
                                ? styles.tabbarActiive
                                : styles.tabbarBannerHide
                          }
                      >
                        <Text
                            style={{
                              textAlign: "center",
                              fontWeight: "bold",
                              color: tabKey == row.id ? "#00E62E" : "#fff",
                            }}
                        >
                          {row.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                );
              })}
            </View>

            {tabKey == 0 && (
                <View style={{ padding: 15 }}>
                  {/* 實時排名 */}
                  <View style={styles.sectionHead}>
                    <View style={styles.sectionTitle}>
                      <View style={styles.sectionLabel}></View>
                      <Text style={{ color: "#fff" }}>อันดับ</Text>
                    </View>
                    <TouchableOpacity onPress={() => Actions.RankPage()}>
                      <View>
                        <Text style={{ color: "#fff" }}>ดูเพิ่มเติม ></Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>{this.renderRank()}</View>

                  {/* 专属优惠 */}
                  <View style={styles.sectionHead}>
                    <View style={styles.sectionTitle}>
                      <View style={styles.sectionLabel}></View>
                      <Text style={{ color: "#fff" }}>โปรโมชั่นพิเศษ</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      Actions.preferential();
                      setTimeout(() => {
                        window.fromErurcup&&window.fromErurcup();
                      },1500)
                    }}>
                      <View>
                        <Text style={{ color: "#fff" }}>ดูเพิ่มเติม ></Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Promotion />

                  {/* 新聞資訊 */}
                  <View style={styles.sectionHead}>
                    <View style={styles.sectionTitle}>
                      <View style={styles.sectionLabel}></View>
                      <Text style={{ color: "#fff" }}>ข่าวยูโร</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() =>
                            Actions.NewsPage({
                              articleList: articleList,
                              totalArticle: totalArticle,
                            })
                        }
                    >
                      <View>
                        <Text style={{ color: "#fff" }}>ดูเพิ่มเติม ></Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  {/* 新聞列表 */}
                  {articleList &&
                  articleList.map((row, id) => {
                    return id == 0 ? (
                        <TouchableOpacity
                            onPress={() =>
                                Actions.NewsDetail({
                                  postId: articleList[0].postId,
                                  isHeadNews: true,
                                })
                            }
                        >
                          <View style={{ paddingVertical: 10 }}>
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
                                      source={require("../../images/EuroCup/new.png")}
                                  />
                                  <Text style={{ color: "#fff" }}>ใหม่</Text>
                                </View>
                            )}
                            <Image
                                resizeMode="stretch"
                                style={styles.newsHeadCardImgstyle}
                                source={{ uri: articleList[0].articleThumbnail }}
                            />
                            <View
                                style={{ position: "absolute", bottom: 25, left: 15 }}
                            >
                              <Text style={{ fontSize: 18, color: "#fff" }}>
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
                    ) : (
                        <TouchableOpacity
                            onPress={() => Actions.NewsDetail({ postId: row.postId ,recArticle:articleList[0]})}
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
                                <Text style={{ fontSize: 16, color: "#fff" }}>
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
                    );
                  })}
                </View>
            )}

            {/* 賽事 */}
            {tabKey == 1 && (
                <GameTab
                    scrollTop={scrollTop}
                    Vendor={VendorIM}
                    noCountDown={this.state.noCountDown}
                    showBetRecord={this.showBetRecord}
                />
            )}
            {/* 資訊 */}
            {tabKey == 2 && <BetRecordTab />}
          </View>
          
          <View style={{width: 150,height: this.state.footerMarginTop}} ></View>
          <View>
            <Text style={{ fontSize: 11, color: "#999999", textAlign: 'center' }}>Copyright © 2011-2021 JBO All Rights Reserved.</Text>
          </View>
        </ScrollView>

        {/* 缩小详情页面 */}
        {/*{this.state.showMiniEvent ? (*/}
        {/*    <MiniEvent*/}
        {/*        Vendor={VendorIM}*/}
        {/*        EventId={this.state.miniEventId}*/}
        {/*        SportId={this.state.miniSportId}*/}
        {/*        LeagueId={this.state.miniLeagueId}*/}
        {/*        ShowType={this.state.miniShowType}*/}
        {/*        CloseMini={() => {*/}
        {/*          this.setState({ showMiniEvent: false, miniEventId: null, miniSportId: 1, miniLeagueId: null, miniShowType: 0 });*/}

        {/*          //更新網址鏈接*/}
        {/*          // const { pathname, query } = this.props.router;*/}
        {/*          // let cloneQuery = Object.assign({}, query);*/}
        {/*          // //刪除mini配置*/}
        {/*          // delete cloneQuery['miniEventId'];*/}
        {/*          // delete cloneQuery['miniSportId'];*/}
        {/*          // delete cloneQuery['miniLeagueId'];*/}
        {/*          // delete cloneQuery['miniShowType'];*/}
        {/*          // const params = new URLSearchParams(cloneQuery);*/}
        {/*          // //用replace，避免用戶可以點擊back返回*/}
        {/*          // Router.replace(pathname + '?' + params.toString(), undefined, { shallow: true });*/}
        {/*        }}*/}
        {/*    />*/}
        {/*) : null}*/}
      </View>
    );
  }
}
const mapStateToProps = (state) => ({
  userInfo: state.userInfo,
  // maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = {
  userInfo_getBalanceAll: (forceUpdate = false) =>
    ACTION_UserInfo_getBalanceAll(forceUpdate),
  maintainStatus_setIM: (isMaintenance) =>
    ACTION_MaintainStatus_SetIM(isMaintenance),
};
export default connect(mapStateToProps, mapDispatchToProps)(EurocupPage);

const styles = StyleSheet.create({
  wrapper: {
    width: width,
    height: 0.4385 * width,
  },
  sectionHead: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  sectionTitle: {
    display: "flex",
    flexDirection: "row",
  },
  sectionLabel: {
    width: 4,
    height: 16,
    backgroundColor: "#00B324",
    marginRight: 5,
  },
  tabStyle: {
    display: "flex",
    flexDirection: "row",
    width: width,
    marginBottom: 10,
    height: 30,
  },
  tabbarDefault: {
    width: width / 3,
    height: 30,
    justifyContent: "center",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    backgroundColor: "#0A0A0A",
  },
  tabbarActiive: {
    width: width / 3,
    height: 30,
    justifyContent: "center",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    backgroundColor: "#00CAFF",
  },
  tabbarBannerHide: {
    width: width / 3,
    height: 30,
    justifyContent: "center",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    backgroundColor: "#444444",
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
