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
  FlatList,
  RefreshControl
} from "react-native";
import { Actions } from "react-native-router-flux";
import Accordion from "react-native-collapsible/Accordion";
import {
  Toast,
  Carousel,
  Flex,
  Picker,
  List,
  Tabs,
  WhiteSpace
} from "antd-mobile-rn";
import AutoWebView from "react-native-webview-autoheight"; 
import HTMLView from "react-native-htmlview";  

const { width, height } = Dimensions.get("window");

class News extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Button1: "",
      DataNumber: 10,
      dEnumber: 0,
      Gametitle: "",
      Gameimage: "",
      Promotions: "",
      PromotionCategorie: "",
      PromotionCategories: "", //優惠分類
      refreshing: false,
      isLoreMoreing: "LoreMoreing",
      dataSource: [],

      reload: false,
      activeSections: "",
      activeSections2: "",
      activeSections3: "",
      activeSections4: "",
      activeSections5: "",
      activeSections6: "",
      emergencyAnnouncements: "",
      newsAnnouncements: "",
      memberNotifications: "",
      promotionAnnouncements: "",
      walletNotifications: "",
      AllNewsData: "" //全公告
    };
    this.responseData = [];
  }

  componentWillMount(props) {
    let ST = this.state;

    this.GetNews();
  }

  //跳轉
  navigateToScene(key, GameOpenUrl) {
    Actions[key]({ GameOpenUrl: GameOpenUrl });
  }

  //獲取新聞
  GetNews() {
    //Toast.loading('加载中,请稍候...',200);

    let ST = this.state;

    fetchRequest(ApiPort.News, "GET")
      .then(data => {

        let newsAnnouncements = new Array;  //存款
        let emergencyAnnouncements= new Array;   //提款
        let promotionAnnouncements= new Array;  //優惠 

                    if(data && data.newsAnnouncements && data.newsAnnouncements.length ){
                       
                      data.newsAnnouncements.forEach(function(element,index) {
                      
                          if(element.announcementType=='1'){
                              // 普通公告
                              newsAnnouncements.push(element)
                          }else if(element.announcementType=='2'){
                              // 特别公告 
                               emergencyAnnouncements.push(element) 
                          }else if(element.announcementType=='3'){
                              // 优惠公告 
                              promotionAnnouncements.push(element)
                          }
                      })
                  } 

                  this.setState({
                    newsAnnouncements:newsAnnouncements,
                    emergencyAnnouncements:emergencyAnnouncements,
                    promotionAnnouncements:promotionAnnouncements

                  })
 
      })
      .catch(error => {
        //	Toast.hide();
      });
  }

  onTabClick = key => {
    //tabs切換
    let msg;
    let item = key.title;
    let ST = this.state;

    if (item == "全部") {
      // this.Refresh(ST.AllNewsData)
    } else if (item == "普通公告") {
      this.Refresh(ST.newsAnnouncements);
      ///	console.log(ST.newsAnnouncements.length)
    } else if (item == "特別公告") {
      this.Refresh(ST.emergencyAnnouncements);
      //	console.log(ST.emergencyAnnouncements.length)
    } else if (item == "优惠公告") {
      this.Refresh(ST.promotionAnnouncements);
    } else if (item == "存款消息") {
    } else if (item == "提款消息") {
    } else if (item == "红利消息") {
      //暫時沒有
    }
  };

  Refresh = data => {
    if (data.length == this.state.dataSource.length) {
      return;
    }

    //
    this.setState({
      refreshing: true
    });

    //默认选中第二个
    this.responseData = data.slice(this.state.dEnumber, this.state.DataNumber);
    this.setState({
      refreshing: false,
      dataSource: this.responseData,
      dEnumber: this.state.dEnumber + 10,
      DataNumber: this.state.DataNumber + 10
    });
    this.isLoreMore = false;
  };

  isLoreMore = false;

  LoreMore = () => {
    let Datalength = this.state.newsAnnouncements.length;

    this.setState({
      isLoreMoreing: "LoreMoreing"
    });
    if (this.responseData.length >= Datalength) {
      this.responseData = this.responseData.concat(
        this.state.newsAnnouncements.slice(Datalength, Datalength)
      );
    } else {
      this.responseData = this.responseData.concat(
        this.state.newsAnnouncements.slice(
          this.state.dEnumber,
          this.state.DataNumber
        )
      );
    }

    this.setState({
      dataSource: this.responseData,
      isLoreMoreing:
        this.responseData.length >= Datalength
          ? "LoreMoreEmpty"
          : "LoreMoreing",
      dEnumber:
        this.state.dEnumber >= Datalength
          ? Datalength
          : this.state.dEnumber + 10,
      DataNumber:
        this.state.DataNumber >= Datalength
          ? Datalength
          : this.state.DataNumber + 10
    });
  };

  render() {
    const {
      emergencyAnnouncements,
      newsAnnouncements,
      memberNotifications,
      promotionAnnouncements,
      walletNotifications
    } = this.state;

    const tabs = [
      //	{ title: '全部' },
      { title: "普通公告" },
      { title: "特別公告" },
      { title: "优惠公告" }
      // { title: '存款消息' },
      // { title: '提款消息' },
      // { title: '红利消息' },
    ];

    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
        <Tabs
          onChange={this.onTabClick}
          tabs={tabs}
          tabBarInactiveTextColor={{ color: "#959595" }}
          tabBarTextStyle={{ color: "#fff" }}
          tabBarActiveTextColor={{ color: "#fff" }}
          tabBarBackgroundColor={{ backgroundColor: "#0a0a0a" }}
          tabBarUnderlineStyle={{ backgroundColor: "#17fe00",height:1 }}
        >
          <View style={{ flex: 1 }}>
            {/*2*/}

            {this.state.newsAnnouncements === "" ? (
              <View style={styles.header2}>
                <View>
                  <Text style={styles.headerTextA2} />
                </View>
                <View style={{ paddingTop: 5 }}>
                  <Text style={{ color: "#626262", textAlign: "center" }}>
                  กำลังโหลด..
                  </Text>
                </View>
                <View style={styles.content}>
                  <Text style={styles.headerTextB2} />
                </View>
              </View>
            ) : (
              this.state.newsAnnouncements.length == 0 && (
                <View style={styles.header2}>
                  {/* <View>
                    <Text style={styles.headerTextA2} />
                  </View> */}
                  <View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
                    <Text style={{ color: "#cdcdcd", textAlign: "center" }}>
                      暂无普通公告{" "}
                    </Text>
                  </View>
                  {/* <View style={styles.content}>
                    <Text style={styles.headerTextB2} />
                  </View> */}
                </View>
              )
            )}

            {this.state.newsAnnouncements != "" && (
              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                numColumns={1} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                ListFooterComponent={this.renderFooter} //尾巴
                keyExtractor={(item, index) => item.key}
                onEndReached={this.LoreMore}
                data={this.state.newsAnnouncements}
                extraData={this.state.newsAnnouncements}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            {/*3*/}

            {this.state.emergencyAnnouncements === "" ? (
              <View style={styles.header2}>
                <View>
                  <Text style={styles.headerTextA2} />
                </View>
                <View style={{ paddingTop: 5 }}>
                  <Text style={{ color: "#626262", textAlign: "center" }}>
                  กำลังโหลด..
                  </Text>
                </View>
                <View style={styles.content}>
                  <Text style={styles.headerTextB2} />
                </View>
              </View>
            ) : (
              this.state.emergencyAnnouncements.length == 0 && (
                <View style={styles.header2}>
                  <View>
                    <Text style={styles.headerTextA2} />
                  </View>
				  <View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
                    <Text style={{ color: "#cdcdcd", textAlign: "center" }}>
					暂无特別公告{" "}
                    </Text>
                  </View>
                  <View style={styles.content}>
                    <Text style={styles.headerTextB2} />
                  </View>
                </View>
              )
            )}

            {this.state.emergencyAnnouncements != "" && (
              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                numColumns={1} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                ListFooterComponent={this.renderFooter} //尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.emergencyAnnouncements}
                extraData={this.state.emergencyAnnouncements}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
            {/*4*/}

            {this.state.promotionAnnouncements.length != 0 &&
              this.state.promotionAnnouncements == "" && (
                <View style={styles.header2}>
                  <View>
                    <Text style={styles.headerTextA2} />
                  </View>
                  <View style={{ paddingTop: 5 }}>
                    <Text style={{ color: "#626262", textAlign: "center" }}>
                    กำลังโหลด..{" "}
                    </Text>
                  </View>

                  <View style={styles.content} />
                </View>
              )}

            {this.state.promotionAnnouncements.length == 0 && (
              <View style={styles.header2}>
                <View>
                  <Text style={styles.headerTextA2} />
                </View>
				<View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
                    <Text style={{ color: "#cdcdcd", textAlign: "center" }}>
					暂无优惠公告{" "}
                    </Text>
                  </View>
                <View style={styles.content}>
                  <Text style={styles.headerTextB2} />
                </View>
              </View>
            )}

            {this.state.promotionAnnouncements != "" && (
              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                numColumns={1} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                ListFooterComponent={this.renderFooter} //尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.promotionAnnouncements}
                extraData={this.state.promotionAnnouncements}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>{/*5*/}</View>

          <View style={{ flex: 1 }}>{/*6*/}</View>

          <View style={{ flex: 1 }}>
            {/*7*/}
            <ScrollView style={{ flex: 1 }}>
              <Flex>
                <View style={{ width: width, padding: 20, color: "#fff" }}>
                  <Text style={{ textAlign: "center" }}>暂无数据..</Text>
                </View>
              </Flex>
            </ScrollView>
          </View>
        </Tabs>
 
      </View>
    );
  }

  renderRow = data => {
    let item = data.item;

    let DBmsg = '<div style="color:#272727;">' + item.content + "</div>";
    return (
      <View key={data.index} style={styles.headerTop}>
        <View style={{display:'flex',justifyContent:'space-between',flexDirection:'row',paddingBottom:15}}>
          <Text style={{color:'#fff',width:width/2}}>{item.topic}</Text>
		  <Text style={styles.headerTextB2}>{item.updatedAt && item.updatedAt.split("T").join("  ").split('.')[0]}</Text>
        </View>

        <View style={styles.content}>
          <HTMLView value={DBmsg} stylesheet={styleXX} />
        </View>
      </View>
    );
  };

  renderFooter = () => {
    if (
      this.state.dataSource.length != 0 &&
      this.state.isLoreMoreing == "LoreMoreing"
    ) {
      return (
        <View>
          {/* <Text>{"正在加载...."}</Text> */}
        </View>
      );
    } else if (this.state.isLoreMoreing == "LoreMoreEmpty") {
      return (
        <View
          style={{
            height: 0,
            backgroundColor: "rgb(200,200,200)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>{""}</Text>
        </View>
      );
    } else {
      return null;
    }
  };
}

export default News;

const styleXX = StyleSheet.create({
  a: {
    fontWeight: "300",
	color: "#e1e1e1",
	lineHeight:21,
  },
  p: {
	color: "#e1e1e1",
	lineHeight:21,
  },
  div: {
    fontWeight: "300",
	color: "#e1e1e1",
	lineHeight:21,
  },
  span: {
    fontWeight: "300",
	color: "#e1e1e1",
	lineHeight:21,
  },
  h1: {
    color: "#fff"
  },
  h2: {
    color: "#fff"
  },
  h3: {
    color: "#fff"
  },
  h4: {
    color: "#fff"
  },
  h5: {
    color: "#fff"
  },
  h6: {
    color: "#fff"
  }
});

const styles = StyleSheet.create({
  header: {
    width: width,
    paddingLeft: 10,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#acacac",
    opacity: 0.4
  },
  header2: {
    width: width,
    paddingLeft: 10,
    paddingTop: 48,
    paddingBottom: 18,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTop: {
	width: width,
    paddingLeft: 10,
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight:10,
    backgroundColor: "#0a0a0a",
    borderBottomWidth: 1,
    borderColor: "#505050",
  },

  content: {},

  header3: {
    width: width,
    paddingLeft: 10,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#00805a"
  },

  headerTextA: {
    color: "#000"
  },
  headerTextB: {
    color: "#626262"
  },
  headerTextA2: {
    color: "#fff"
  },
  headerTextB2: {
    color: "#fff"
  },

  headerTextA3: {
    color: "#00805a"
  },
  headerTextB3: {
    color: "#626262"
  },

  autoWebView: {
    width: width,
    height: 100,
    backgroundColor: "#fff"
  },

  wrapper: {
    height: 120,
    backgroundColor: "#000"
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150
  },
  containerVertical: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150
  },
  text: {
    color: "#fff",
    fontSize: 36
  },
  image: {
    width,
    height: 200
  },
  warning: {
    height: 35,
    width: width,
    backgroundColor: "#013626"
  },
  warningT: {
    height: 30,
    marginTop: 10
  },
  warningText: {
    color: "#fff"
  },
  gameBg1: {
    backgroundColor: "#fff",
    padding: 12
  },
  gameBg2: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#fff"
  },
  GameBox: {
    backgroundColor: "#fff",
    width: width,
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "row",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  GameImg: {
    width: 175,
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 6,
    marginBottom: 6,
    borderWidth: 5,
    borderColor: "#d3d3d3"
  },
  preferentImg: {
    marginTop: -15,
    width: 168,
    height: 100,
    backgroundColor: "#d3d3d3"
  },
  openPreferential: {
    borderRadius: 18,
    marginTop: 10,
    width: 110,
    padding: 5,
    backgroundColor: "#00633c"
  }
});
