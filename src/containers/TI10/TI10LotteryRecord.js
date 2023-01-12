import React from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment'
import { Toast } from "antd-mobile-rn"
// import LinearGradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get('window')

const stausPending = {
    text: 'อยู่ระหว่างการปรับรางวัล',
    color: '#00E62E'
}
const statusSlove = {
    text: 'รับรางวัลเรียบร้อย',
    color: '#F5F5F5'
}

const PrizeStatus = {
    status1: stausPending,
    status3: stausPending,
    status4: stausPending,
    status5: stausPending,
    status6: stausPending,
    status2: statusSlove,
    status7: statusSlove,
    status8: {
        text: 'ไม่ได้รับรางวัล',
        color: '#F5F5F5'
    }
}


export default class TI10LotteryRecord extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            prizeList: []
        }
    }

    componentDidMount() {
        (this.props.isDoubleLotteryGameStatus == 2) && this.getLotteryRecords()
    }

    getLotteryRecords() {
        Toast.loading('กำลังโหลด...', 2000)
        fetchRequest(ApiPort.GetLotteryRecords + 'eventTypeId=9' + '&', 'GET').then(res => {
            Toast.hide()
            if (Array.isArray(res) && res.length) {
                this.setState({
                    prizeList: res
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    render() {
        const { prizeList } = this.state
        return <View style={[styles.viewContainer]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                {
                    prizeList.length > 0
                        ?
                        <View style={styles.lotteryRecordTable}>
                            <View style={styles.lotteryRecordThead}>
                                <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1]}>
                                    <Text style={styles.lotteryRecordTheadTd}>วัน และ เวลา</Text>
                                </View>
                                <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1]}>
                                    <Text style={styles.lotteryRecordTheadTd}>รางวัล</Text>
                                </View>
                                <View style={styles.lotteryRecordTheadTr}>
                                    <Text style={styles.lotteryRecordTheadTd}>สถานะ</Text>
                                </View>
                            </View>

                            {
                                prizeList.map((v, i) => {
                                    return <View style={[styles.lotteryRecordThead]}>
                                        <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                            <Text style={styles.lotteryRecordTheadTd1}>{moment(v.applyDate).format('YYYY-MM-DD HH:mm')}</Text>
                                        </View>
                                        <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                            <Text style={styles.lotteryRecordTheadTd1}>{v.prizeName}</Text>
                                        </View>
                                        <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                            <Text style={[styles.lotteryRecordTheadTd1, { color: PrizeStatus[`status${v.prizeStatus}`].color }]}>{PrizeStatus[`status${v.prizeStatus}`].text}</Text>
                                        </View>
                                    </View>
                                })
                            }
                        </View>
                        :
                        <View style={styles.doublenoNoRecordbox}>
                            <Image
                                resizeMode='stretch'
                                style={styles.doublenoRecord1}
                                source={require('./../../images/double11Lottery/doublenoRecord1.png')}
                            ></Image>
                            <Text style={styles.doublenoNoRecordText}>ไม่มีข้อมูล</Text>
                        </View>
                }
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000000',
        paddingTop: 15,
        paddingHorizontal: 10
    },
    lotteryRecordTable: {
        borderWidth: 1,
        borderColor: '#616161',
        borderBottomWidth: 0,
        marginBottom: 60,
    },
    lotteryRecordThead: {
        flexDirection: 'row',
    },
    lotteryRecordTheadTr: {
        height: 40,
        backgroundColor: '#00B324',
        width: (width - 20) / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#616161'
    },
    lotteryRecordTheadTd: {
        color: '#fff'
    },
    lotteryRecordTheadTr1: {
        borderRightWidth: 1,
        borderRightColor: '#616161'
    },
    lotteryRecordTheadTr2: {
        backgroundColor: '#141414'
    },
    lotteryRecordTheadTd1: {
        color: '#F5F5F5',
        fontSize: 12,
        textAlign: 'center'
    },
    doublenoNoRecordbox: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    doublenoRecord1: {
        width: (width - 20) * .55,
        height: (width - 20) * .55 * .638,
        marginBottom: 25,
        marginTop: 40
    },
    doublenoNoRecordText: {
        color: '#999999'
    }
})
