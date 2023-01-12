import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native'
import { VipDetailsTitleInfor1, VipDetailsTitleInfor2, VipDetailsInfor, VipDetailsTextInfor, VipReturnWaterData2 } from './VipData'
const BaseWidth = .5
const BaseHeight = 38
const { width } = Dimensions.get('window')

export default class VipDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vipIndex: this.props.vipIndex,
            scrollToX: 0
        }
    }

    componentDidMount() {
        this.getScrollToX()
    }

    getScrollToX() {
        const { vipIndex } = this.state
        let scrollWidth = width * BaseWidth * .4 * (Math.abs(vipIndex))
        let scrollViewWidth = width * BaseWidth * 4 - (width - width * BaseWidth)
        let scrollToX = scrollWidth >= scrollViewWidth ? scrollViewWidth : scrollWidth
        this.myScrollView.scrollTo({ x: scrollToX, y: 0, animated: true, duration: 800 })
    }

    render() {
        const { vipIndex } = this.state
        return <View style={styles.viewContainer}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.vipContainerRow]}>
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
                                    width: width * BaseWidth,
                                    backgroundColor: '#333333'
                                },
                            ]}
                        >
                            <Text style={styles.vipInforText}>ระดับ VIP</Text>
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
                                                height: BaseHeight * VipDetailsTitleInfor1.length,
                                                width: width * BaseWidth * .5
                                            }
                                        ]}
                                    >
                                        <Text style={styles.vipInforText}>{v}</Text>
                                    </View>)
                                }
                            </View>
                            <View>
                                {
                                    VipDetailsTitleInfor2.map((v, i) => <View
                                        key={i}
                                        style={[
                                            styles.vipContainerRowView,
                                            styles.vipContainerBottom,
                                            styles.vipContainerRight,
                                            styles[`vipContainerBg${(i % 2)}`],
                                            {
                                                height: BaseHeight,
                                                width: width * BaseWidth * .5
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.vipInforText, { fontSize: 11 }]}>{v}</Text>
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
                                VipDetailsInfor.map((v1, i1) => <View key={i1} >
                                    {
                                        v1.map((v2, i2) => {
                                            let flag1 = vipIndex === (i1)
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
                                                        width: width * BaseWidth * .4,
                                                        backgroundColor: i2 === 0 ? (flag1 ? '#FFC758' : '#333333') : (flag1 ? (flag2 ? '#FFC758' : '#EFB440') : (flag2 ? '#222222' : '#222222')),
                                                        borderBottomColor: flag1 ? '#EFB440' : '#333333',
                                                        borderTopWidth: i2 === 0 ? 1 : 0,
                                                        borderTopColor: '#444'
                                                    }
                                                ]}
                                            >
                                                <Text style={[styles.vipInforText, { color: flag1 ? '#332811' : '#CCCCCC', fontWeight: flag1 ? 'bold' : 'normal' }]}>{v2}</Text>
                                            </View>
                                        })
                                    }
                                </View>)
                            }
                        </View>
                    </ScrollView>
                </View>
                {/* <View style={styles.vipDetailsTextInforContainer}>
                    {
                        VipDetailsTextInfor.map((v, i) => {
                            return <Text key={i} style={[i == 2 ? styles.vipDetailsTitleInfor : styles.vipDetailsTextInfor]}>{v}</Text>
                        })
                    }
                </View> */}
                <View style={styles.vipTextBox}>
                    <View style={styles.questionTitleBox, { marginTop: 30, marginBottom: 10 }}>
                        {/* <Text style={styles.questionTitle}>注：当日有效流水500元或以上，即可获得返水彩金。</Text> */}
                    </View>
                    <View style={[styles.questionTitleBox, { marginBottom: 15 }]}>
                    <Text style={styles.questionTitle}>แนะนำ: เมื่อเดิมพัน โบนัสเท่านั้นที่จะถูกล็อคไว้ เงินต้นที่เดิมพันจะไม่มีผลต่อการถอนเงิน การคำนวณยอดหมุนเวียน: (เงินต้น 100 บาท + โบนัส 10 บาท) * 10 = 1,100
                    </Text>
                    </View>
                    {
                        VipReturnWaterData2.map((v, i) => v)
                    }
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    questionTitle: {
        color: '#FFFFFF',
        //textAlign: 'center',
        fontSize: 14
    },
    vipTextBox: {
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    questionTitleBox: {
        marginTop: 10,
        // alignItems: 'center',
        justifyContent: 'center'
    },
    viewContainer: {
        backgroundColor: '#0A0A0A',
        flex: 1
    },
    vipContainerRow: {
        flexDirection: 'row',
        overflow: 'hidden'
    },
    vipInforText: {
        textAlign: 'center',
        color: '#CCCCCC',
        fontSize: 13
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
        borderBottomColor: '#333'
    },
    vipContainerRight: {
        borderRightWidth: 1,
        borderRightColor: '#444'
    },
    vipContainerBg1: {
        backgroundColor: '#222222'
    },
    vipContainerBg0: {
        backgroundColor: '#222222'
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
