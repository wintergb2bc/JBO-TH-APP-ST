import React from 'react'
import { ScrollView, View, StyleSheet, Image, Text, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import { Carousel } from 'antd-mobile-rn'
import { VipOverviewBanner, VipOverviewDetails, VipOverviewSteps } from './VipData'
import { Actions } from 'react-native-router-flux'
const { width } = Dimensions.get('window')

export default class VipOverview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSlide: 0,
            contentOffsetY: 0
        }
    }

    renderBannerPage(item) {
        return <Image source={item.item.img} key={item.index} resizeMode='stretch' style={styles.vipBannerImg}></Image>
    }

    changeScrollViewContentOffsetY(event) {
        this.setState({
            contentOffsetY: event.nativeEvent.contentOffset.y
        })
    }

    render() {
        const { activeSlide } = this.state
        return <View style={styles.viewContainer}>
            <ScrollView
                scrollEventThrottle={100}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                // onScroll={this.changeScrollViewContentOffsetY.bind(this)}
            >
                <View style={styles.vipBanners}>
                    <Carousel
                        dots={VipOverviewBanner.length > 1}
                        autoplay
                        infinite={VipOverviewBanner.length > 1}
                        selectedIndex={0}
                        vertical={false}
                        dotStyle={styles.vipDotStyle}
                        dotActiveStyle={styles.vipInactiveDotStyle}
                        afterChange={index => { this.setState({ activeSlide: index }) }}
                    >
                        {
                            VipOverviewBanner.map((v, i) => <Image source={v.img} key={i} resizeMode='stretch' style={styles.vipBannerImg}></Image>)
                        }
                    </Carousel>
                </View>

                <View style={styles.vipOverviewDetailsIconContainer}>
                    <Text style={styles.vipOverviewTextInfor}>晋级 4 步骤</Text>
                    <View style={styles.vipOverviewDetailsIconBox}>
                        {
                            VipOverviewSteps.map((v, i) => {
                                return <ImageBackground key={i} style={styles.vipOverviewDetailsIconList} source={require('./../../../images/user/vip/vipOverviewStepsBgImgs.png')}>
                                    <Image source={v.img} resizeMode='stretch' style={styles[`vipOverviewStepsImgs${i}`]}></Image>
                                    <Text style={styles.vipOverviewTextInfor1}>{v.text}</Text>
                                    {
                                        i !== VipOverviewSteps.length - 1 && <Text style={styles.vipOverviewDetailsArrow}>></Text>
                                    }
                                </ImageBackground>
                            })
                        }
                    </View>
                </View>
                <View>
                    {
                        VipOverviewDetails.map((v, i) => {
                            return <View key={i}>
                                {
                                    Array.isArray(v.img)
                                        ?
                                        <View style={styles.vipImgIconBox}>
                                            {
                                                v.img.map((v1, i1) => {
                                                    return <View key={i1} style={styles.vipImgIconWrap}>
                                                        <Image source={v1} resizeMode='stretch' style={styles.vipImgIcon}></Image>
                                                    </View>
                                                })
                                            }
                                        </View>
                                        :
                                        <Image source={v.img} resizeMode='stretch' style={[styles.vipOverviewDetailsImg]} />
                                }
                                <View style={[styles.vipOverviewTextBox, { borderBottomWidth: i + 1 === VipOverviewDetails.length ? 0 : 1 }]}>
                                    <Text style={styles.vipOverviewText1}>{v.title}</Text>
                                    <Text style={styles.vipOverviewText2}>{v.text}</Text>
                                </View>
                            </View>
                        })
                    }
                </View>
                <TouchableOpacity style={styles.vipOverviewBtn} onPress={() => { Actions.Vip() }}>
                    <Text style={styles.vipOverviewBtnText}>ดูรายละเอียด</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#0A0A0A',
        flex: 1,
    },
    vipImgIconBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 50,
        marginBottom: 30
    },
    vipImgIconWrap: {
        width: (width - 20) / 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    vipImgIcon: {
        width: (width - 20) * .2 * .8,
        height: (width - 20) * .2 * .8
    },
    vipBannerImg: {
        width,
        height: .427 * width
    },
    vipBanners: {
        width,
    },
    vipDotStyle: {
        backgroundColor: "#fff",
        top: 5
    },
    vipInactiveDotStyle: {
        backgroundColor: "#1bfe00",
    },
    vipOverviewTextBox: {
        marginLeft: 10,
        marginRight: 10,
        borderBottomColor: '#444444',
        alignItems: 'center',
        paddingBottom: 30
    },
    vipOverviewText1: {
        color: '#CCCCCC',
        fontWeight: 'bold',
        fontSize: 22,
        marginTop: 10,
        marginBottom: 10
    },
    vipOverviewText2: {
        color: '#CCCCCC',
        fontSize: 16
    },
    vipOverviewBtn: {
        backgroundColor: '#00B324',
        borderWidth: 1,
        borderColor: '#00B324',
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10
    },
    vipOverviewBtnText: {
        color: '#fff'
    },
    vipOverviewDetailsImg: {
        marginTop: 30,
        marginBottom: 20,
        width,
        height: .667 * width
    },
    vipOverviewDetailsIconBox: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    vipOverviewDetailsIconContainer: {
        marginRight: 10,
        marginLeft: 10,
        borderBottomColor: '#444444',
        borderBottomWidth: 1,
        paddingBottom: 40
    },
    vipOverviewTextInfor: {
        color: '#CCCCCC',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 30,
        marginTop: 30
    },
    vipOverviewTextInfor1: {
        color: '#ccc',
        marginTop: 6
    },
    vipOverviewDetailsIconList: {
        width: (width - 20) / 5,
        height: (width - 20) / 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vipOverviewStepsImgs0: {
        width: 16,
        height: 20
    },
    vipOverviewStepsImgs1: {
        width: 30,
        height: 18,
        marginBottom: 2
    },
    vipOverviewStepsImgs2: {
        width: 24,
        height: 20
    },
    vipOverviewStepsImgs3: {
        width: 22,
        height: 20
    },
    vipOverviewDetailsArrow: {
        position: 'absolute',
        color: '#CCCCCC',
        right: -17
    }
})