import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, Image, ImageBackground } from 'react-native'
import { VipReturnWaterData3 } from './VipData'
const BaseWidth = .2
const BaseHeight = 36
const { width } = Dimensions.get('window')
const VipDetailsInforLogoutImg = [
    require('./../../../images/user/vip/vipdetaillogout1.png'),
    require('./../../../images/user/vip/vipdetaillogout2.png'),
    require('./../../../images/user/vip/vipdetaillogout3.png'),
    require('./../../../images/user/vip/vipdetaillogout4.png'),
    require('./../../../images/user/vip/vipdetaillogout5.png'),
    require('./../../../images/user/vip/vipdetaillogout6.png'),
]
export default class VipLogoutDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { vipIndex } = this.props
        return <View style={styles.viewContainer}>
           <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
              <Text style={styles.questionTitle}>โบนัสเงินคืนพิเศษสำหรับ VIP</Text>
                {/* <Text style={styles.questionTitle}>VIP 专属返水比例</Text> */} 
            </ImageBackground>
            <View>
            {
                    VipReturnWaterData3.map((v1, i1) => {
                        return <View 
                            key={i1}
                            style={[
                                {
                                    height: i1 === 0 ? 80 : BaseHeight,
                                    flexDirection: 'row'
                                }
                            ]}>
                            {
                                v1.map((v2, i2) => {
                                    let flag = vipIndex * 1 === i1 - 1
                                    return <View key={i2} style={[
                                        {
                                            width: (width) / v1.length,
                                            //flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: flag ? '#A8A8A8' : (i1 % 2 ? '#222222' : '#222222'),
                                            borderBottomWidth: i1 === VipReturnWaterData3.length - 1 ? 1 : 0,
                                            borderTopWidth: 1,
                                            borderColor: '#444444',
                                            borderRightWidth: v1.length - 1 === i2 ? 0 : 1,
                                            borderRightColor: flag ? '#A8A8A8' : '#444444',
                                            borderBottomColor: flag ? '#444444' : '#444444',
                                           
                                        }
                                    ]}>
                                        {
                                            i1 === 0 && <View style={styles.imgCircle}>
                                                <Image source={VipDetailsInforLogoutImg[i2]} style={[styles.detailImg, styles[`detailImg${i2}`]]} resizeMode='stretch' ></Image>
                                            </View>
                                        }
                                        <Text style={[styles.vipInforText, { color: flag ? '#332811' : (i1 === 0 ? '#FFC758' : '#CCCCCC')}]}>{v2}</Text>
                                    </View>
                                })
                            }
                        </View>
                    })
                }
                <Text style={{color: 'red', fontSize: 10, marginTop: 10, marginRight: 19}}>สมาชิกต้องมียอดหมุนเวียน 1,000 บาทขึ้นไปจึงจะเข้าร่วมโปรโมชั่นเงินคืน</Text>
            </View>
            {/* <View style={[styles.vipContainerRow]}>
                <View>
                    <View
                        style={[
                            styles.vipContainerRowView,
                            styles.vipContainerBottom,
                            styles.vipContainerRight,
                            styles.vipContainerBg1,
                            styles.vipContainerTop,
                            {
                                height: BaseHeight,
                                width: width * BaseWidth
                            }
                        ]}
                    >
                        <Text style={styles.vipInforText}>VIP 等级</Text>
                    </View>
                    <View style={styles.vipContainerRow}>
                        <View>
                            {
                                VipDetailsTitleInfor1.map((v, i) => <View
                                    key={i}
                                    style={[
                                        styles.vipContainerRowView,
                                        styles.vipContainerBottom,
                                        styles.vipContainerRight,
                                        styles[`vipContainerBg${(i % 2)}`],
                                        {
                                            height: BaseHeight,
                                            width: width * BaseWidth
                                        }
                                    ]}
                                >
                                    <Text style={styles.vipInforText}>{v}</Text>
                                </View>)
                            }
                        </View>
                    </View>
                </View>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    horizontal={true}
                    scrollEventThrottle={100}
                    ref={view => { this.myScrollView = view }}
                >
                    <View style={[styles.vipContainerRow]} >
                        {
                            VipReturnWaterData3.map((v1, i1) => <View key={i1} >
                                {
                                    v1.map((v2, i2) => {
                                        let flag1 = vipRank === (i1 + 1)
                                        let flag2 = (i2 + 1) % 2
                                        return <View
                                            key={i2}
                                            style={[
                                                styles.vipContainerRowView,
                                                styles.vipContainerBottom,
                                                styles.vipContainerRight,
                                                styles[`vipContainerBg${((i2 + 1) % 2)}`],
                                                {
                                                    height: BaseHeight,
                                                    width: width * BaseWidth * .8,
                                                    backgroundColor: flag1 ? (flag2 ? '#00B324' : '#05A225') : (flag2 ? '#333333' : '#2C2C2C'),
                                                    borderBottomColor: flag1 ? '#00B324' : '#444444',
                                                    borderTopWidth: i2 === 0 ? 1 : 0,
                                                    borderTopColor: '#444'
                                                }
                                            ]}
                                        >
                                            <Text style={styles.vipInforText}>{v2}</Text>
                                        </View>
                                    })
                                }
                            </View>)
                        }
                    </View>
                </ScrollView>
            </View> */}
        </View>
    }
}

const styles = StyleSheet.create({
    imgCircle: {
        width: 36,
        height: 36,
        borderRadius: 100,
        backgroundColor: '#F6DEAC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    detailImg: {
        width: 24,
        height: 24
    },
    detailImg4: {
        height: 16
    },
    viewContainer: {
        backgroundColor: '#0A0A0A',
        //flex: 1,
        marginLeft: -10,
        marginRight: -10,
        width
    },
    questionTitleBox: {
        width,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    questionTitle: {
        color: '#E2C795',
        textAlign: 'center',
        //fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 10
    },
    vipContainerRow: {
        flexDirection: 'row',
        overflow: 'hidden'
    },
    vipInforText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 11
    },
    vipContainerRowView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    vipContainerTop: {
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    vipContainerBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#444'
    },
    vipContainerRight: {
        borderRightWidth: 1,
        borderRightColor: '#444'
    },
    vipContainerBg1: {
        backgroundColor: '#333333'
    },
    vipContainerBg0: {
        backgroundColor: '#2C2C2C'
    },
    vipDetailsTextInforContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 30,
        marginBottom: 80
    },
    vipDetailsTitleInfor: {
        color: '#fff',
        fontSize: 15,
        marginTop: 20,
        marginBottom: 4
    },
    vipDetailsTextInfor: {
        color: '#fff',
        lineHeight: 26
    }
})
