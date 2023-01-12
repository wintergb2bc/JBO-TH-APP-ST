import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl } from 'react-native'
import { VipReturnWaterData, VipReturnWaterData2, VipReturnWaterData4 } from './VipData'

const { width } = Dimensions.get('window')
const baseWidth1 = 80
const baseWidth2 = baseWidth1 * .4
const baseWidth3 = baseWidth1 * .8
const baseHeight1 = 40
const baseHeight2 = 3 * baseHeight1


export default class VipReturnWater extends React.Component {
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
                            {/* VIP 等级 */}
                        </View>
                        <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth1, height: baseHeight1, backgroundColor: '#222' }]}>
                            <Text style={styles.vipInforText}>อีสปอร์ต / กีฬา{'\n'}(รายวัน)</Text>
                        </View>
                        <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth1, height: baseHeight1, backgroundColor: '#222' }]}>
                            <Text style={styles.vipInforText}>คาสิโนสด{'\n'}(รายวน)</Text>
                        </View>
                        <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth1, height: baseHeight1, backgroundColor: '#222' }]}>
                            <Text style={styles.vipInforText}>เกม 3 มิติ{'\n'}(รายวน)</Text>
                        </View>
                        <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth1, height: baseHeight1, backgroundColor: '#222' }]}>
                            <Text style={styles.vipInforText}>สล็อต{'\n'}(รายวัน)</Text>
                        </View>
                        {/* <View style={[styles.vipContainerRowView, styles.vipContainerRight, styles.vipContainerBottom, { width: baseWidth1, height: baseHeight1, backgroundColor: '#222' }]}>
                            <Text style={styles.vipInforText}>彩票{'\n'}（每日）</Text>
                        </View> */}
                    </View>

               
                    <ScrollView
                        contentContainerStyle={{ flexDirection: 'row' }}
                        horizontal={true}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            VipReturnWaterData.map((v1, i1) => {
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
                                                    width: baseWidth3,
                                                    height: baseHeight1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderColor: '#333333',
                                                    backgroundColor: i2 === 0 ? (flag ? '#FFC758' : '#2C2C2C') : (flag ? (i2 % 2 ? '#EFB440' : '#FFC758') : (i1 % 2 ? '#222222' : '#222222')),
                                                    borderBottomColor: flag ? 'red' : 'green',
                                                    borderTopWidth: 1,
                                                    borderRightWidth: 1,
                                                    borderRightColor: flag ? (i2 % 2 ? '#333333' : '#333333') : '#333333',
                                                    borderTopColor: flag ? (i2 % 2 ? '#FFC758' : '#EFB440') : '#333333',
                                                }
                                            ]}>
                                                <Text style={[styles.vipInforText, { color: flag ? '#332811' : '#CCCCCC', fontWeight: flag ? 'normal' : 'normal' }]}>{v2}</Text>
                                            </View>
                                        })
                                    }
                                </View>
                            })
                        }
                    </ScrollView>
                </View>

                <View style={styles.vipTextBox}>
                    <View style={styles.questionTitleBox, { marginTop: 10, marginBottom: 10 }}>
                         <Text style={styles.questionTitleRed}>สมาชิกต้องมียอดหมุนเวียน 1,000 บาทขึ้นไปจึงจะเข้าร่วมโปรโมชั่นเงินคืน</Text> 
                    </View>
                    <View style={[styles.questionTitleBox, { marginBottom: 15 }]}>
                        <Text style={styles.questionTitle}>เงื่อนไขโปรโมชั่น</Text>
                    </View>
                    {
                        VipReturnWaterData4.map((v, i) => v)
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
        fontSize: 12
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
        justifyContent: 'center'
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
        color: '#FFFFFF',
        //textAlign: 'center',
        fontSize: 14
    },
    questionTitleRed: {
        color: '#ff0000',
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
        marginTop: 10,
        // alignItems: 'center',
        justifyContent: 'center'
    },
})
