import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native'
import { PromotionVipDetailsTables, VipRules } from './VipData'

const { width } = Dimensions.get('window')
const baseWidth1 = 193
const baseWidth2 = baseWidth1 * .4
const baseWidth3 = 115
const baseWidth4 = 80
const baseHeight1 = 40
const baseHeight2 = 3 * baseHeight1


export default class PromotionVipDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { vipIndex } = this.props
        return <View style={styles.viewContainer}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: 'row' }}>
                    <View style={[styles.vipContainerTop, { backgroundColor: '#222222' }]}>
                        <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth1, height: baseHeight1, backgroundColor: '#2C2C2C' }]}>
                            <Text style={styles.vipInforText}>ระดับ VIP</Text>
                        </View>
                        <View style={styles.vipContainerRow}>
                            <View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerBottom, styles.vipContainerRight, { width: baseWidth2, height: baseHeight2 }]}>
                                    <Text style={styles.vipInforText}>ข้อกำหนดโปรโมชั่น</Text>
                                </View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerBottom, styles.vipContainerRight, { width: baseWidth2, height: baseHeight2 }]}>
                                    <Text style={styles.vipInforText}>การรักษาระดับ</Text>
                                </View>
                            </View>
                            <View style={[{ height: baseHeight1 }]}>
                                <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth3, height: baseHeight1 }]}>
                                    <Text style={styles.vipInforText}>จำนวนเงินฝากสะสม{'\n'}ภายใน 30 วัน</Text>
                                </View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth3, height: baseHeight1 }]}>
                                    <Text style={styles.vipInforText}>ยอดหมุนเวียนสะสม{'\n'}ภายใน 30 วัน</Text>
                                </View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth3, height: baseHeight1 }]}>
                                    <Text style={styles.vipInforText}>โบนัสเลื่อนระดับ</Text>
                                </View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth3, height: baseHeight1 }]}>
                                    <Text style={styles.vipInforText}>การฝากภายใน 30 วัน</Text>
                                </View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth3, height: baseHeight1 }]}>
                                    <Text style={styles.vipInforText}>ยอดหมุนเวียน{'\n'}ภายใน 30 วัน</Text>
                                </View>
                                <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth3, height: baseHeight1 }]}>
                                    <Text style={styles.vipInforText}>รักษาระดับโบนัส</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ flexDirection: 'row' }}
                        horizontal={true}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            PromotionVipDetailsTables.map((v1, i1) => {
                                return <View
                                    key={i1}
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#333333'
                                    }}>
                                    {
                                        v1.map((v2, i2) => {
                                            let flag = vipIndex * 1 === i1 - 1
                                            //let flag = false
                                            return <View key={i2} style={[
                                                {
                                                    width: baseWidth4,
                                                    height: baseHeight1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderColor: '#333333',
                                                    // backgroundColor: i2 === 0 ? (flag ? '#EFB440' : '#2C2C2C') : (flag ? (i2 % 2 ? '#EFB440' : '#FFC758') : (i1 % 2 ? '#222222' : '#222222')),
                                                    backgroundColor: i2 === 0 ? (flag ? '#2C2C2C' : '#2C2C2C') : (flag ? (i1 % 2 ? '#222222' : '#222222') : (i1 % 2 ? '#222222' : '#222222')),
                                                    //borderBottomWidth: i2 === v1.length - 1 ? 1 : 0,
                                                    borderTopWidth: 1,
                                                    borderRightWidth: 1,
                                                    borderRightColor: flag ? (i2 % 2 ? '#333333' : '#333333') : '#333333',
                                                    borderTopColor: flag ? (i2 % 2 ? '#333333' : '#333333') : '#333333',
                                                }
                                            ]}>
                                                <Text style={[styles.vipInforText, { color: flag ? '#CCCCCC' : '#CCCCCC', fontWeight: flag ? 'normal' : 'normal'}]}>{v2}</Text>
                                            </View>
                                        })
                                    }
                                </View>
                            })
                        }
                    </ScrollView>
                </View>
                <View style={styles.vipTextBox}>
                    <View style={styles.questionTitleBox}>
                                                        {/* 条款与规则 */}
                        <Text style={styles.questionTitle}>เงื่อนไขโปรโมชั่น</Text>
                    </View>
                    {
                        VipRules.map((v, i) => v)
                    }
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    vipInforText: {
        textAlign: 'center',
        color: '#CCCCCC',
        fontSize: 12,
    },
    vipContainerHeight: {
        height: baseHeight1
    },
    vipContainerRow: {
        flexDirection: 'row',
        overflow: 'hidden'
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
    vipContainerRowView: {
        alignItems: 'center',
        justifyContent: 'center', 
    },
    viewContainer: {
        backgroundColor: '#0A0A0A',
        flex: 1
    },
    vipTextBox: {
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    questionTitle: {
        color: '#CCCCCC',
        //textAlign: 'center',
        fontSize: 14
    },
    ruleText: {
        // color: '#ccc',
        // lineHeight: 22,
        marginBottom: 4,
        paddingLeft: 20
    },
    questionTitleBox: {
        height: 60,
        marginTop: 10,
       // alignItems: 'center',
        justifyContent: 'center'
    },
})