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
  ImageBackground,
  RefreshControl,
  Animated,
  Linking,
  Modal
} from "react-native";
import Video from "./Video";
import { Actions } from "react-native-router-flux";
import { Toast, Flex, Tabs } from "antd-mobile-rn";
import ModalDropdown from "react-native-modal-dropdown";
import Carousel, { Pagination } from "react-native-snap-carousel"; 
const { width, height } = Dimensions.get("window");

const SLIDER_1_FIRST_ITEM =2; 
class SponsorshipNew extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SponsorshipList: "",
      showVideo: false,
      videoUrl: "",
      fullScreen: false,
      activeSlide: SLIDER_1_FIRST_ITEM,
    };
  }

  componentWillMount(props) {
    this.GetList();
  }

  //跳轉
  openDomain(id, url) {
    if (this.state.SponsorshipList[id].Video) {
      // 西甲联赛
      this.openVideo();
    } else {
      if(url){
        Linking.openURL(url);
      }
    }
  }

  openVideo() {
    this.setState({ showVideo: true });
  }
  closeVideo() {
    this.setState({ showVideo: false });
  }

  fullScreen() {
    this.setState({
      fullScreen: this.state.fullScreen == false ? true : false
    });
  }

  //获取list
  GetList() {
    fetch(
      "https://www.jbo74.com/cms/Sponsorship/json_new/JBOTH/sponsorship_List_Mobile_New.json?v=" +
        Math.random(),
      {
        method: "GET"
      }
    )
      .then(response => (headerData = response.json()))
      .then(responseData => {
        // 获取到的数据处理
        if (responseData.length) {
          this.setState({
            // SponsorshipList: responseData,
            SponsorshipList:[...responseData,...responseData,...responseData,],
            videoUrl:  (responseData.length>=3 && responseData[3].Video)? responseData[3].Video:""
          });
        }
      })
      .catch(() => {
        // 错误处理
      });
  }
  renderIndicator = ({ item, index }) => {
    const showLight = this.state.activeSlide %6 == item.id
    return (
      <View key={index} style={{height:60,width:"100%",justifyContent:"center",alignItems:"center"}}>
        <TouchableOpacity onPress={()=>{this.onIndicatorClick(item, index)}} style={{height:60,width:"100%",}}>
        <Image
          source={{ uri: item.navImgUrl }}
          resizeMode="contain"
          style={{ height:50,width:"100%",justifyContent:"center",alignItems:"center" }}
        ></Image>
        {showLight ? (
              <Image
                source={require("../../images/light-point.png")}
                style={styles.lightPointStyle}
              />
            ) : null}
        </TouchableOpacity>

      </View>
    );
  };
  renderPage = ({ item, index }) => {
    return (
      <ScrollView key={index} style={styles.tabContentImgStyle}>
        <ImageBackground
          style={styles.tabContentImgStyle}
          source={{ uri: item.iconImageUrl+"?v=1" }}
        >
          <View style={{width: width, height: "100%"}}>
            {!!item.buttonImgUrl && (
                <TouchableOpacity
                onPress={() => this.openDomain(item.id, item.url)}
                style={{
                  zIndex: 100,
                  position: "absolute",
                  bottom: -15,
                  left: 0.1 * width,
                  width: 0.8 * width,
                  height: 0.24 * width
                }}
            >
              <Image
                  resizeMode="stretch"
                  style={{width: "100%", height: "100%"}}
                  source={{uri: item.buttonImgUrl}}
              />
            </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </ScrollView>
    );
  };

  onBeforeSnapToItem(index) {
    
    this.setState({ activeSlide: index });
    this._carousel.snapToItem(index)
    this._carousel2.snapToItem(index)
  }


  // 上一页或下一页
  snapItem(direction){
    if (direction=="prev") {
    this._carousel.snapToPrev()
    this._carousel2.snapToPrev()
    }else{
      this._carousel.snapToNext()
      this._carousel2.snapToNext()
    }
  }

  onIndicatorClick(item,index){

    this.setState({ activeSlide: item.id });
    this._carousel.snapToItem(item.id)
  }
  render() {
    const { SponsorshipList, showVideo, videoUrl, fullScreen } = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1a1a1a",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {SponsorshipList.length > 0 ? (
          <View>
            <View style={{flexDirection:"row",alignItems:"center"}}>
            <View style={{ width: 30 }}>
              <TouchableOpacity onPress={() => {this.snapItem("prev")}}>
                <Image
                  source={require("../../images/back_arrow.png")}
                  style={styles.arrowImgStyle}
                />
              </TouchableOpacity>
            </View>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={SponsorshipList}
              renderItem={this.renderIndicator}
              sliderWidth={width - 60}
              itemWidth={0.2 * (width - 60)}
              firstItem={SLIDER_1_FIRST_ITEM}
              loop={true}
              loopClonesPerSide={2}
              hasParallaxImages={true}
              inactiveSlideScale={0.5}
              inactiveSlideOpacity={0.7}
              onBeforeSnapToItem={index => this.onBeforeSnapToItem(index)}
            />
            <View style={{width: 30 }}>
              <TouchableOpacity onPress={() => {this.snapItem("next")}}>
                <Image
                  source={require("../../images/next_arrow.png")}
                  style={styles.arrowImgStyle}
                />
              </TouchableOpacity>
            </View>
            </View>

            <Carousel
              ref={c => {
                this._carousel2 = c;
              }}
              data={SponsorshipList}
              renderItem={this.renderPage}
              sliderWidth={width}
              itemWidth={width}
              firstItem={2}
              loop={true}
              loopClonesPerSide={2}
              hasParallaxImages={true}
              inactiveSlideScale={0.7}
              inactiveSlideOpacity={0.7}
              onBeforeSnapToItem={index => this.onBeforeSnapToItem(index)}
            />
          </View>
        ) : null}

        <Modal
          animationType="none"
          transparent={true}
          visible={showVideo}
          // visible={true}
          onRequestClose={() => {}}
        >
          <View style={styles.regPromoModal}>
            <View style={styles.closeRegPromo}>
              <TouchableOpacity
                hitSlop={{ top: 100, bottom: 30, left: 30, right: 30 }}
                onPress={() => {
                  this.closeVideo();
                }}
              >
                <View style={styles.closeRegPromo}>
                  <Text style={styles.closeRegPromoText}>X</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={
                fullScreen ? styles.fullScreenTrue : styles.fullScreenfalse
              }
            >
              <Video
                fullScreenbutton={this.fullScreen.bind(this)}
                Videodb={videoUrl}
              />
            </View>
          </View>
        </Modal>

    


      </View>
    );
  }
}

export default SponsorshipNew;

const styles = StyleSheet.create({
  arrow: {
    marginLeft: 5,
    marginTop: 5,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: 9,
    borderTopColor: "#1aff00", //下箭头颜色
    borderLeftColor: "#2a2a2a", //右箭头颜色
    borderBottomColor: "#2a2a2a", //上箭头颜色
    borderRightColor: "#2a2a2a" //左箭头颜色
  },
  wrapper: {
    paddingTop: 10,
    paddingBottom: 10
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

  bonusBoxs: {
    alignItems: "center",
    justifyContent: "center"
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
    height: 45,
    width: width,
    backgroundColor: "#171717",
    borderBottomWidth: 1,
    borderBottomColor: "#373737"
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
    backgroundColor: "#171717",
    width: width,
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  GameImg: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20
  },

  SponsorshipList: {
    width: width,
    height: height / 3.8
  },
  openPreferential: {
    borderRadius: 18,
    marginTop: 10,
    width: width / 4,
    padding: 5,
    backgroundColor: "#00633c"
  },

  dropdown_D_text: {
    top: 7,
    paddingBottom: 13,
    fontSize: 15,
    color: "#fff"
  },
  dropdown_DX_dropdown: {
    width: width / 2.7,
    height: 280,
    marginRight: -15
  },

  dropdown_2_row: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    backgroundColor: "#012c1f"
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 14,
    color: "#fff",
    textAlignVertical: "center"
  },

  im_Green: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#30EA3C"
  },
  im_Red: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#FF3D5D"
  },
  im_Yellow: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#FFF500"
  },
  im_Orange: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#FFA700"
  },
  im_Cyan: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#32E2AD"
  },
  im_Blue: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#5084FF"
  },
  im_Purple: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#A3239F"
  },
  im_Brightred: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderLeftColor: "#FF0000"
  },

  Aim_Green: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#30EA3C"
  },
  Aim_Red: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#FF3D5D"
  },
  Aim_Yellow: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#FFF500"
  },
  Aim_Orange: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#FFA700"
  },
  Aim_Cyan: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#32E2AD"
  },
  Aim_Blue: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#5084FF"
  },
  Aim_Purple: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#A3239F"
  },
  Aim_Brightred: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderLeftColor: "#FF0000"
  },

  tabBarStyle: {
    height: 60,
    paddingHorizontal: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  tabItemStyle: {
    width: 0.2 * width,
    height: "100%",
    padding: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  tabItemInactiveStyle: {
    width: 0.1 * width,
    height: "100%",
    padding: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  navImgStyle: {
    width: 0.12 * width,
    height: 50
  },
  navInactiveImgStyle: {
    width: 0.06 * width,
    height: 20,
    opacity: 0.3
  },
  lightPointStyle: {
    width: 0.15 * width,
    height: 10,
    alignSelf: "auto"
  },
  arrowImgStyle: {
    width: 30,
    height: 20
  },
  tabContentImgStyle: {
    width: width,
    height: 1.65 * width
  },
  tabContentStyle: {
    zIndex: 100,
    position: "absolute",
    bottom: 0,
    left: 0.2 * width,
    width: 0.6 * width,
    height: 0.18 * width
  },
  btnStyle: {
    width: "100%",
    height: "100%"
    // zIndex: 100,
    // position: "absolute",
    // bottom: 0,
    // left: 0.2 * width,
    // width: 0.6 * width,
    // height: 0.18 * width
  },
  btnImgStyle: {
    width: 0.6 * width,
    height: 0.18 * width
  },

  regPromoModal: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)"
    // backgroundColor: "red"
  },
  regPromoPopup: {
    alignItems: "center",
    backgroundColor: "transparent"
  },
  closeRegPromo: {
    width: width,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingRight: 15
  },
  closeRegPromoText: {
    width: 20,
    height: 20,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#d3d3d3",
    color: "#fff",
    textAlign: "center",
    alignItems: "center",
    alignSelf: "flex-end"
  },
  fullScreenTrue: {
    top: -90,
    position: "absolute"
  },
  fullScreenfalse: {
    alignItems: "center",
    justifyContent: "center"
  }
});
