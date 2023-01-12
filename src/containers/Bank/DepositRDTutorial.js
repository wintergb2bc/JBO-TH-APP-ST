import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Modal,
} from "react-native";

import Carousel, { Pagination }  from "react-native-snap-carousel";

const { width, height } = Dimensions.get("window");

const crypyoCarousel1 = [
    require("../../images/tutorial/rd_channel1.png"),
    require("../../images/tutorial/rd_channel2.png"),
    require("../../images/tutorial/rd_channel3.png"),
    require("../../images/tutorial/rd_channel4.png"),
];

class DepositCTCTutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCTCguid: this.props.currentCTCguid,
      channelActiveSlide: 0,
      onPageChangedINdex: 0,
    };
  }

  renderPage  (item, index)  {
    return <View
        key={index}
        style={{
          width,
          alignItems: "center",
          height: width * 0.76 * 1.5,
        }}
      >
        <Image
          source={item.item}
          resizeMode="stretch"
          style={{
            width: width * 0.76,
            height: width * 0.76 * 1.5,
          }}
        ></Image>
      </View>
    
  }

  //下一頁
  goToNext() {
    this.setState({ 
      onPageChangedINdex: this.state.onPageChangedINdex + 1 
    });
    this._carousel.snapToNext();
  }

  //回第一頁
  goToPrev() {
    this.setState({ 
      onPageChangedINdex: 0 
    });
    this._carousel.snapToItem(0);
  }
  
  render() {
    const { showEXPTutorailModal } = this.props;
    const { onPageChangedINdex,currentCTCguid } = this.state;

    return (
      <Modal
        transparent={false}
        visible={showEXPTutorailModal}
        animationType="none"
      >
        <View
          style={{
            backgroundColor: "#000",
            width,
            height,
            paddingTop: Platform.OS == "ios" ? 80 : 80,
          }}
        >
          <ScrollView>
            <Carousel
              ref={(c) => {
                this._carousel = c;
              }}
              data={crypyoCarousel1}
              renderItem={this.renderPage.bind(this)}
              sliderWidth={width}
              itemWidth={width - 20}
              autoplay={false}
              //useScrollView={true}// use ScrollView instead of FlatList
              onSnapToItem={(index) => this.setState({ onPageChangedINdex: index })}
            />      

            <View
              style={{
                marginTop: 10,
                height: 60,
                width,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
              }}
            >
              {Array.from(
                {
                  length: (currentCTCguid.toLocaleLowerCase() == "channel"
                    ? crypyoCarousel1
                    : currentCTCguid.toLocaleLowerCase() == "otc"
                    ? crypyoCarousel3
                    : currentCTCguid == "INVOICE"
                    ? crypyoCarousel4
                    : currentCTCguid == "INVOICE_AUT" && crypyoCarousel5
                  ).length,
                },
                (v) => v
              ).map((v, i) => {
                return (
                  <View
                    style={{
                      width: onPageChangedINdex == i ? 18 : 10,
                      height: 10,
                      backgroundColor:
                        onPageChangedINdex == i ? "#1DFF00" : "#FFFFFF",
                      borderRadius: 10000,
                      marginHorizontal: 3,
                    }}
                    key={i}
                  ></View>
                );
              })}
            </View>         

            {/* <Pagination
              dotsLength={crypyoCarousel1.length}
              activeDotIndex={onPageChangedINdex}
              dotStyle={{
                width:  30,
                height: 10,
                backgroundColor:
                   "#1DFF00" ,
                borderRadius: 10000,
                marginHorizontal: 1,
              }}
              inactiveDotStyle={{
                width:  20,
                height: 20,
                backgroundColor:
                   "#FFFFFF",
                borderRadius: 10000,
                marginHorizontal: -8,
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            /> */}

            {onPageChangedINdex != 3 ?
            <TouchableOpacity
              onPress={() => {
                this.goToNext();
              }}
            >
              {/* 下一個 */}
              <View 
                style={{
                  backgroundColor:'#00B324',
                  width:200,
                  padding:10,
                  borderRadius:4,
                  alignSelf:'center',
                  marginTop:15,
                }}
              >
                <Text 
                  style={{
                    fontSize:16,
                    color:'#fff',
                    textAlign:'center',
                  }}
                >
                  ถัดไป
                </Text>
              </View>
            </TouchableOpacity>:
            <TouchableOpacity
              onPress={() => {
                this.props.CloseCTCTutorailModal();
                this.setState({
                  onPageChangedINdex: 0,
                });
              }}
            >
              {/* 理解 */}
              <View 
                style={{
                  backgroundColor:'#00B324',
                  width:200,
                  padding:10,
                  borderRadius:4,
                  alignSelf:'center',
                  marginTop:15,
                }}
              >
                <Text 
                  style={{
                    fontSize:16,
                    color:'#fff',
                    textAlign:'center',
                  }}
                >
                  เข้าใจแล้ว
                </Text>
              </View>
            </TouchableOpacity>}
              
            {onPageChangedINdex != 3 ?
            <TouchableOpacity 
              onPress={() => {
                this.props.CloseCTCTutorailModal();
                this.setState({
                  onPageChangedINdex: 0,
                });
              }}
            >
              {/* 關閉存款流程 */}
              <View 
                style={{
                  backgroundColor:'#000000',
                  //borderColor:'#00B324',
                  borderWidth:1,
                  width:200,
                  padding:10,
                  borderRadius:4,
                  alignSelf:'center',
                  marginTop:15,
                }}
              >
                <Text 
                  style={{
                    fontSize:16,
                    color:'#00B324',
                    textAlign:'center',
                  }}
                >
                  ปิดขั้นตอนการฝาก
                </Text>
              </View>
            </TouchableOpacity>:
            <TouchableOpacity 
              onPress={() => {
                this.goToPrev();
              }}                            
            >
              {/* 再看看步驟 */}
              <View 
                style={{
                  backgroundColor:'#000000',
                  borderColor:'#00B324',
                  borderWidth:1,
                  width:200,
                  padding:10,
                  borderRadius:4,
                  alignSelf:'center',
                  marginTop:15,
                }}
              >
                <Text 
                  style={{
                    fontSize:16,
                    color:'#00B324',
                    textAlign:'center',
                  }}
                >
                  ดูขั้นตอนอีกครั้ง
                </Text>
              </View>
            </TouchableOpacity>}
              
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

export default DepositCTCTutorial;

const styles = StyleSheet.create({
  gameBg2: {
    backgroundColor: "#222222",
    paddingLeft: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
