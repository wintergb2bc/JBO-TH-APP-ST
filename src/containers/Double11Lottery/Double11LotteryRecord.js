import React from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Image, ScrollView, Platform, TouchableOpacity } from 'react-native';
import moment from 'moment'
import { Toast } from "antd-mobile-rn"
// import LinearGradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get('window')

const stausPending = {
    text: 'อยู่ระหว่างการปรับรางวัล', //处理中
    color: '#00E62E'
}
const statusSlove = {
    text: 'รับรางวัลเรียบร้อย', //已领取
    color: '#F5F5F5'
}

const PrizeStatus = {
    status1: stausPending,
    status2: stausPending,
    status3: statusSlove,//已领取
    status4: statusSlove,//已领取
    status5:  {
        text: 'การรับรางวัลล้มเหลว',//'领取失败',
        color: '#F5F5F5'
    },
}


export default class Double11LotteryRecord extends React.Component {
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
        const {EventDetail} = this.props
        Toast.loading('กำลังโหลด...', 2000)
        fetchRequest(ApiPort.GetLotteryRecords + 'id=' + EventDetail.id + '&isPreview='+isEventPreview+'&', 'GET','' , 35000 ,2).then(res => {
            console.log('GetLotteryRecords',res)
            Toast.hide()
            console.log(res)
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
                    Array.isArray(prizeList) && prizeList.length > 0
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
                                            <Text style={styles.lotteryRecordTheadTd1}>{moment(v.applicationDate).format('YYYY-MM-DD HH:mm')}</Text>
                                        </View>
                                        <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                            <Text style={styles.lotteryRecordTheadTd1}>{v.prizeName}</Text>
                                        </View>
                                        <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                            <Text style={[styles.lotteryRecordTheadTd1, { color: PrizeStatus[`status${v.status}`].color }]}>{PrizeStatus[`status${v.status}`].text}</Text>
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
        backgroundColor: 'transparent'
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