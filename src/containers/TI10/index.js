import React from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground, Image, ScrollView, Platform, TouchableOpacity, Modal } from 'react-native'
import moment from 'moment'
import { Toast } from "antd-mobile-rn"
import LinearGradient from 'react-native-linear-gradient'
import { Actions } from 'react-native-router-flux'
const { width, height } = Dimensions.get('window')
// import ScaledImage from '../ScaledImage'
const LotteryStepInfor = [
    {
        img: require('./../../images/double11Lottery/lotteryIcon1.png'),
        text1: 'ขั้นตอนที่ 1',
        text2: 'เข้าสู่ระบบ หรือ สมัครตอนนี้'
    },
    {
        img: require('./../../images/double11Lottery/lotteryIcon2.png'),
        text1: 'ขั้นตอนที่ 2',
        text2: 'ฝากเงินขั้นต่ำ 300 บาท'
    },
    {
        img: require('./../../images/double11Lottery/lotteryIcon3.png'),
        text1: 'ขั้นตอนที่ 3',
        text2: 'เปิดกล่องขุมทรัพย์เพื่อลุ้นรางวัลแจ็คพอต'
    },
]

const LotteryStepBtnInfor = [
    {
        img: require('./../../images/double11Lottery/lotteryStepBtn1.png'),
        action: 'preferentialPage',
        // 活動詳情
        text: 'รายละเอียดเพิ่มเติม',
        pik: 'TnC_double11'
    },
    {
        img: require('./../../images/double11Lottery/lotteryStepBtn2.png'),
        action: 'TI10LotteryRecord',
        // 獲獎紀錄
        text: 'ประวัติการรับรางวัล',
        pik: 'Myprize_double11'
    }
]
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

LOTTERYNOSTARTTIME1 = '2021/10/4 00:00:00 +0800'
LOTTERYNOSTARTTIME2 = '2021/10/5 23:59:59 +0800'

// LOTTERYSTARTTIM1 = '2021/9/15 00:00:00 +0800'
// LOTTERYSTARTTIM2 = '2021/9/19 23:59:59 +0800'

LOTTERYSTARTTIM1 = '2021/10/06 00:00:00 +0800'
LOTTERYSTARTTIM2 = '2021/10/17 23:59:59 +0800'

// LOTTERYNOSTARTTIME1 = '2020/11/9 00:00:00 +0800'
// LOTTERYNOSTARTTIME2 = '2020/11/9 11:13:59 +0800'


// LOTTERYSTARTTIM1 = '2020/11/9 10:14:00 +0800'
// LOTTERYSTARTTIM2 = '2020/11/9 11:15:00 +0800'

export default class TI10Event extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            isDoubleLotteryGameStatus: this.props.isDoubleLotteryGameStatus || 2, // 1 pendding   2 on   3 // end
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            totalDeposit: 0,
            message: '',
            message1: '',
            isShowModalTip1: false,
            isShowModalTip2: false,
            isSuccessGrab: false,
            errorCode: '',
            remainingTries: '', // 点亮个数
            remainingTriesForTheDay: '', // 
            totalRedeemed: '', // 已经旋转的次数
            totalPrizes: 10, // 奖品数量,
            redeemeedPrizeList: [], // 已经开启的
            lotteryNotOpenIcon: [
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 1,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 2,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 3,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 4,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 5,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 6,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 7,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 8,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 9,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryNotOpenIcon.png'),
                    status: false,
                    index: 10,
                    width: (width - 20 - 50) / 3
                }
            ],
            lotteryEndOpenIcon: [
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 1,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 2,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 3,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 4,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 5,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 6,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 7,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 8,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 9,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryEndOpenIcon.png'),
                    status: false,
                    index: 10,
                    width: (width - 20 - 50) / 3
                }
            ],
            lotteryCanOpenIcon: [
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 1,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 2,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 3,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 4,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 5,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 6,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 7,
                    width: (width - 20 - 50) / 4
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 8,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 9,
                    width: (width - 20 - 50) / 3
                },
                {
                    img: require('./../../images/TI10/lotteryCanOpenIcon.png'),
                    status: false,
                    index: 10,
                    width: (width - 20 - 50) / 3
                }
            ],
            prizeList: [],
            prizeIndex: '',
            prizeImage: '',
            prizeImageSize: {width: 0, height: 0},
            prizeType: 0,
            prizeValue: 0,
            prizeName: '',
            enabled: true, //父滚动条
            isGetLotteryProgress: false,
            isShowDepositBtn: true
        }
    }

    componentDidMount() {
        // global.storage.clearMap()
        this.getTimeDownStatus()
        
        setTimeout(() => {
            this.getLotteryProgress(true)
            this.getLotteryRecords()
        }, 0);
        
        Toast.loading('กำลังโหลด...', 2000)
        fetchRequest(ApiPort.GetLotteryStatus + 'eventTypeId=9&', 'GET').then(res => {
            Toast.hide()
            if (res.isActive) {
                this.setState({
                    isOpen: true
                })
            } else {
                this.setState({
                    isOpen: false
                })
            }

        }).catch(err => {
            Toast.hide()
            Toast.fail("", 2);
        })

    }

    componentWillUnmount() {
        this.TimeDown && clearInterval(this.TimeDown)
    }
    
    changeLotteryStatus(isDoubleLotteryGameStatus) {
        this.setState({
            isDoubleLotteryGameStatus
        })
    }

    getTimeDownStatus() {
        const { isDoubleLotteryGameStatus } = this.state
        // if (isDoubleLotteryGameStatus == 1) {
        //     this.TimeDown = setInterval(() => {
        //         this.diffTime(LOTTERYNOSTARTTIME2, true)
        //     }, 1000)
        // } else if (isDoubleLotteryGameStatus == 2) {
        //     this.TimeDown = setInterval(() => {
        //         this.diffTime(LOTTERYSTARTTIM2, false)
        //     }, 1000)
        // }
        // return



        console.log(moment(new Date()).diff(moment(new Date(LOTTERYSTARTTIM1)), 'seconds'), moment(new Date()).diff(moment(new Date(LOTTERYSTARTTIM2)), 'seconds'))



        let nowTime = (new Date()).getTime()
        if (moment(new Date()).diff(moment(new Date(LOTTERYNOSTARTTIME1)), 'seconds') > 0 && moment(new Date()).diff(moment(new Date(LOTTERYNOSTARTTIME2)), 'seconds') < 0) {
            this.setState({
                isDoubleLotteryGameStatus: 1
            }, () => {
                this.TimeDown = setInterval(() => {
                    this.diffTime(LOTTERYNOSTARTTIME2, true)
                }, 1000)
            })
            return
        }
        if (moment(new Date()).diff(moment(new Date(LOTTERYSTARTTIM1)), 'seconds') > 0 && moment(new Date()).diff(moment(new Date(LOTTERYSTARTTIM2)), 'seconds') < 0) {
            this.setState({
                isDoubleLotteryGameStatus: 2
            }, () => {
                this.TimeDown = setInterval(() => {
                    this.diffTime(LOTTERYSTARTTIM2, false)
                }, 1000)
            })
            return
        }

        if (moment(new Date()).diff(moment(new Date(LOTTERYSTARTTIM2)), 'seconds') > 0) {
            this.setState({
                isDoubleLotteryGameStatus: 3
            })
            return
        }

    }

    getLotteryRecords() {
        if (!ApiPort.UserLogin) return
        if (this.state.isDoubleLotteryGameStatus != 3) return

        Toast.loading('กำลังโหลด...', 2000)
        fetchRequest(ApiPort.GetLotteryRecords + 'eventTypeId=9' + '&', 'GET').then(res => {
            console.log(res)
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

    getLotteryProgress(flag) {
        if (this.state.isDoubleLotteryGameStatus != 2) return
        if (!ApiPort.UserLogin) return
        flag && Toast.loading('กำลังโหลด...', 2000)
        this.setState({
            isGetLotteryProgress: false
        })
        fetchRequest(ApiPort.GetLotteryProgress + 'eventTypeId=9&', 'GET').then(res => {
            Toast.hide()
            this.setState({
                isGetLotteryProgress: true
            })
            let redeemeedPrizeList = res.redeemeedPrizeList
            if (Array.isArray(redeemeedPrizeList) && redeemeedPrizeList.length) {
                redeemeedPrizeList.forEach(v => {
                    this.state.lotteryNotOpenIcon[v - 1].status = true
                    this.setState({})
                })
            }
            this.setState({
                totalDeposit: res.totalDeposit,
                remainingTries: res.remainingTries,
                remainingTriesForTheDay: res.remainingTriesForTheDay,
                // remainingTries: 0,
                // remainingTriesForTheDay: 0,
                totalPrizes: res.totalPrizes || 10,
                redeemeedPrizeList
            })


        }).catch(err => {
            Toast.hide()
        })
    }


    postLotteryStart(uiPrizeIdentity, status) {
        console.log('postLotteryStart')
        if (!ApiPort.UserLogin) {
            Toast.fail("ล็อคอิน", 2)
            Actions.logins({
                fromPage: 'TI10'
            })
            return
        }

        const { isDoubleLotteryGameStatus, remainingTries, redeemeedPrizeList } = this.state

        if (isDoubleLotteryGameStatus == 1 || !this.state.isOpen) {
            this.setState({
                isShowModalTip1: true
            })
            return
        }
        this.setState({
            isShowDepositBtn: true,
            message1: ''
        })

        // if (redeemeedPrizeList.length > 0) {
        //     if (redeemeedPrizeList.length == this.state.totalPrizes) {
        //         this.setState({
        //             message: '您今天抽开宝箱的次数已用完， 请明天再试。',
        //             isSuccessGrab: false,
        //             isShowModalTip2: true
        //         })
        //         return
        //     }
        //     let redeemeedPrizeListNum = redeemeedPrizeList.map(Number)
        //     let redeemeedPrizeListNumMin = Math.max.apply(Array, redeemeedPrizeListNum)
        //     if (uiPrizeIdentity != redeemeedPrizeListNumMin + 1) {
        //         alert(1)
        //         return
        //     }
        // } else {
        //     console.log(uiPrizeIdentity)
        //     alert(2)
        //     if (uiPrizeIdentity != 1) {
        //         return
        //     }
        // }


        // if (remainingTries + redeemeedPrizeList <= uiPrizeIdentity) {
        //     return
        // }

        if (status && redeemeedPrizeList.length != 10) {
            if (remainingTries > 0) {
                this.setState({
                    isShowModalTip2: true,
                    message: 'กรุณาคลิกกล่องขุมทรัพย์เรืองแสง เพื่อลุ้นรางวัลใหญ่',
                    isShowDepositBtn: false
                })
                return
            } else {
                this.setState({
                    isShowModalTip2: true,
                    message1: <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 15 }}>
                        คุณยังมีสิทธิ์รับ <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 20, fontWeight: 'bold' }}>{this.state.remainingTriesForTheDay}</Text> ครั้งในวันนี้ กรุณาลองอีกครั้งหลังจากฝากเงิน
                    </Text>,
                    isShowDepositBtn: true
                })
                return
            }
        }



        this.setState({
            message: '',
            isSuccessGrab: false,
            isShowModalTip2: false,
            errorCode: '',
            prizeIndex: ''
        })
       
        Toast.loading('', 2000)
        fetchRequest(ApiPort.PostLotteryStart + 'uiPrizeIdentity=' + uiPrizeIdentity + '&', 'POST').then(res => {
            Toast.hide()



            this.setState({
                message: res.message,
                isSuccessGrab: res.isSuccessGrab,
                isShowModalTip2: true,
                errorCode: res.errorCode * 1,
                remainingTries: res.remainingTries,
                prizeImage: res.prizeImage,
                prizeType: res.prizeType,
                prizeValue: res.prizeValue,
                prizeName: res.prizeName,
            })

            if(res.prizeImage){
                Image.getSize(res.prizeImage, (width, height) => {
                    this.setState({ prizeImageSize: {  width: width, height: height } });
                });
            }

            if (res.isSuccessGrab) {
                UMonEvent('Engagement Event', 'Click', 'Claim_TI10')
                this.setState({
                    prizeIndex: res.prizeIndex
                })
            } else {
                const errorCode = res.errorCode * 1
                if ([994, 995, 996, 997, 998].some(v => v == errorCode)) {
                    this.setState({
                        message: res.errorMessage,
                    })
                }
            }
            this.getLotteryProgress()

        }).catch(err => {
            Toast.hide()
        })

        
    }

    diffTime(Time, flag) {
        // 当前时间
        const nowTime = new Date().getTime()

        //计算出相差毫秒数
        const diff = (new Date(Time)).getTime() - nowTime

        //计算出相差天数
        const days = Math.floor(diff / (24 * 3600 * 1000))

        //计算出小时数
        const leave1 = diff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000))

        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000))

        //计算相差秒数
        const leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave3 / 1000)
        if (diff > 0) {
            this.setState({
                days: days > 9 ? days : `0${days}`,
                hours: hours > 9 ? hours : `0${hours}`,
                minutes: minutes > 9 ? minutes : `0${minutes}`,
                seconds: seconds > 9 ? seconds : `0${seconds}`
            })
        } else {
            if (flag) {
                this.setState({
                    isDoubleLotteryGameStatus: 2,
                    isShowModalTip1: false,
                    isShowModalTip2: false,
                })
                this.TimeDown && clearInterval(this.TimeDown)
                this.TimeDown = setInterval(() => {
                    this.diffTime(LOTTERYSTARTTIM2, false)
                }, 1000)
            } else {
                this.setState({
                    days: '00',
                    hours: '00',
                    minutes: '00',
                    seconds: '00',
                    isDoubleLotteryGameStatus: 3,
                    isShowModalTip1: false,
                    isShowModalTip2: false,
                })
                this.getLotteryRecords()
                this.TimeDown && clearInterval(this.TimeDown)
            }
        }
    }

    lotteryAction(action, pik) {
        pik && UMonEvent && UMonEvent(pik)
        const { isDoubleLotteryGameStatus } = this.state
        if (action === 'TI10LotteryRecord' && !ApiPort.UserLogin) {
            Toast.fail("ล็อคอิน", 2)
            Actions.logins({
                fromPage: 'TI10'
            })
            return
        }
        if (action == 'preferentialPage') {
            Toast.loading();
            fetchRequest(ApiPort.GetPromotionsDetail + 1738 + '?', 'GET').then(res => {
                Toast.hide()
                if (res) {
                    if(res.promotion){
                        Actions.preferentialPage({
                            preferential: res.promotion
                        });
                    }
                    return
                }
            }).catch(err => {
                Toast.hide()
            })
            return
        }

        Actions[action]({
            isDoubleLotteryGameStatus
        })
    }

    remainingTriesOverUI = () => {
        const { messageFlag, messageText2, errorCode, prizeName, prizeType } = this.state;
        return (
            <>
                <Text style={[styles.lotterModalText1, {paddingHorizontal: 10, marginTop: 15}]}>
                    {
                        messageFlag
                            ?
                            `${messageText2}`
                            :
                            (
                                (errorCode == 0 || errorCode == 403) ?
                                    `วันนี้คุณใช้สิทธิ์ครบแล้ว${'\n'}กรุณาลองอีกครั้งในวันพรุ่งนี้`
                                    :
                                    'ขออภัย ขณะนี้กล่องขุมทรัพย์ถูกรับไปหมดแล้ว กรุณาลองใหม่ในวันพรุ่งนี้!'
                            )
                    }
                </Text>
            </>
        )
    }

    lotteryModalTitle = () => {
        const {isSuccessGrab, errorCode} = this.state

        if (isSuccessGrab && errorCode == 0) {
            return 'ขอแสดงความยินดี'
        }

        if (([401, 402, 403, 994, 995, 996, 997, 998].find(v => v == errorCode))) {
            return 'ลองอีกครั้ง'
        }

        return 'แจ้งเตือน'

    }

    render() {
        {console.log(this.state)}
        const { message1, isShowDepositBtn, lotteryEndOpenIcon, lotteryCanOpenIcon, isGetLotteryProgress, redeemeedPrizeList, totalPrizes, remainingTriesForTheDay, prizeList, lotteryNotOpenIcon, remainingTries, errorCode, message, isShowModalTip1, isShowModalTip2, isDoubleLotteryGameStatus, days, hours, minutes, seconds, totalDeposit, prizeImage,prizeName,prizeValue,prizeType } = this.state
        window.changeLotteryStatus = (isDoubleLotteryGameStatus) => {
            this.changeLotteryStatus(isDoubleLotteryGameStatus)
        }
        let messageText1 = ''
        let messageText2 = ''
        let messageFlag = message.includes('！') || message.includes('!')
        if (message.length > 0) {
            if (message.includes('！')) {
                messageText1 = message.split('！')[0]
                messageText2 = message.split('！')[1]
            } else {
                messageText1 = message
                messageText2 = message
            }
            if (message.includes('!')) {
                messageText1 = message.split('!')[0]
                messageText2 = message.split('!')[1]
            } else {
                messageText1 = message
                messageText2 = message
            }
        }

        const { prizeIndex, isSuccessGrab } = this.state
        // const prizeIndex = 8
        // const isSuccessGrab = true
        return <View style={[styles.viewContainer]}>
            <Modal
                animationType='fade'
                transparent={true}
                visible={isShowModalTip1}
            >
                <View style={styles.vipModal}>
                    <View style={[styles.vipSuccessContainer]}>
                        <View style={styles.successCircle}>
                            <Text style={styles.successCircleText}>{'!'}</Text>
                        </View>
                        <Text style={styles.vipModalText1}>โปรโมชั่นยังไม่เริ่ม ณ ตอนนี้{'\n'}อดใจรอสักครู่้</Text>
                        <TouchableOpacity style={styles.vipModalSuccessBtn} onPress={() => {
                            this.setState({
                                isShowModalTip1: false
                            })
                        }}>
                            <Text style={styles.vipModalSuccessBtnText}>ย้อนกลับ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={isShowModalTip2}
            >
                <View style={styles.vipModal}>
                    <ImageBackground
                        resizeMode='stretch'
                        style={styles.lotteryModalBg}
                        source={require('./../../images/TI10/lotteryModalBg2.png')}
                    >
                        <View style={styles.lotteryModalHead}>

                            <LinearGradient start={{ x: 1, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                            colors={['#6F3003D8', '#E6B276']}
                                            style={{height: 2, width: '15%'}}
                            />
                            
                            <Text style={styles.lotteryModalHeadText}>{this.lotteryModalTitle()}</Text>
                            <LinearGradient start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#6F3003D8', '#E6B276']}
                                            style={{height: 2,width: '15%'}}
                            />
                        </View>
                     
                        <View style={{flex: 1, width: width * .8, alignItems: 'center', justifyContent: 'center',marginTop: -40}}>
                            {
                                isSuccessGrab ? <View style={{ alignItems: 'center' }}>

                                        {/*物品獎勵*/}
                                        {prizeType == 2&&(
                                            <>
                                                <Image
                                                    style={[this.state.prizeImageSize]}
                                                    source={{uri: prizeImage}}
                                                    resizeMode='stretch'
                                                />
                                                {!remainingTriesForTheDay > 0 && (
                                                    this.remainingTriesOverUI()
                                                )}
                                                {remainingTriesForTheDay !== 0 && <Text style={{color: '#FF0000', fontSize: 14, fontWeight: 'bold'}}>คุณได้รับ {prizeName}!</Text>}
                                            </>
                                        )}

                                        {/*獎金獎勵*/}
                                        {prizeType == 1 &&(
                                            <View style={{ paddingTop: 20, alignItems: 'center' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 30, marginRight: 5 }}>
                                                        <Text style={{ color: '#FF0000', fontSize: 32 }}>฿</Text>
                                                    </View>
                                                    <Text style={{ fontSize: 60, color: '#FF0000', fontWeight: 'bold' }}>{prizeValue}</Text>
                                                </View>
                                                {!remainingTriesForTheDay > 0 && (
                                                    this.remainingTriesOverUI()
                                                )}
                                                {remainingTriesForTheDay !== 0 && <Text style={{ color: '#FF0000', fontSize: 14, marginTop: 10, fontWeight: 'bold' }}>คุณได้รับ เงินเดิมพันฟรี!</Text>}
                                            </View>
                                        )}


                                        {
                                            prizeType == 0 && (
                                                <View style={{ paddingTop: 20,width: width*0.6 }}>
                                                    <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 15 }}>{message}</Text>
                                                    {remainingTriesForTheDay == 0 && (
                                                        <Text style={{ color: '#000000', fontSize: 11, marginTop: 30, fontWeight: 'bold' }}>วันนี้คุณใช้สิทธิ์หมดแล้ว ลองใหม่ในวันพรุ่งนี้!</Text>
                                                    )}
                                                </View>
                                            )
                                        }

                                    </View>
                                    :
                                    <View style={{  marginHorizontal: 70,width: width*0.6,  }}>
                                        {
                                            (errorCode == 202 && remainingTriesForTheDay > 0 && remainingTries == 0) ?
                                                <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 15 }}>
                                                    คุณยังมีสิทธิ์รับ  <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 20, fontWeight: 'bold' }}>{remainingTriesForTheDay}</Text> ครั้งในวันนี้ กรุณาลองอีกครั้งหลังจากฝากเงิน
                                                </Text>
                                                :
                                                (
                                                    message1 ? message1 : <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 15 }}>{message}</Text>
                                                )
                                        }
                                    </View>
                            }



                            {
                                ((([101, 102, 202].find(v => v == errorCode) || (remainingTriesForTheDay > 0 && remainingTries == 0 && redeemeedPrizeList.length > 0 && errorCode != 103))) && isShowDepositBtn) && <TouchableOpacity
                                    style={styles.lotteryBodyBtnBox}
                                    onPress={() => {
                                        this.setState({
                                            isShowModalTip2: false
                                        })
                                        Actions.depositTx()
                                        UMonEvent && UMonEvent('Deposit Nav', 'Click', 'Deposit_TI10');

                                    }}>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        style={{width:210,height: 33,alignItems: 'center', justifyContent: 'center', marginTop: 10}}
                                        source={require('./../../images/TI10/buttonRed.png')}
                                    >
                                        {/*立即充值*/}
                                        <Text style={{fontWeight: 'bold', fontSize: 14, color: "#fff"}}>ฝากเลย!</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            }

                            {
                                isSuccessGrab && isGetLotteryProgress && remainingTriesForTheDay > 0 && remainingTries > 0 && <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            message: '',
                                            isSuccessGrab: false,
                                            isShowModalTip2: false,
                                            errorCode: '',
                                            //remainingTries: '',
                                            prizeIndex: ''
                                        }, () => {
                                            // let redeemeedPrizeListNum = redeemeedPrizeList.map(Number)
                                            // let redeemeedPrizeListNumMin = Math.max.apply(Array, redeemeedPrizeListNum)

                                            // const totalPrizesArr = Array.from({ length: totalPrizes }, (v, i) => i + 1)
                                            // const redeemeedPrizeListArr = redeemeedPrizeList.map(v => v * 1)
                                            // const tempArr = totalPrizesArr.filter(v => !redeemeedPrizeListArr.includes(v))
                                            // let num = Math.min.apply(Array, tempArr)
                                            // this.postLotteryStart(num)
                                        })


                                        UMonEvent && UMonEvent('Continue_double11')
                                    }}
                                    style={styles.lotteryBodyBtnBox}
                                >
                                    {/*继续开宝箱*/}
                                    <Image
                                        resizeMode='stretch'
                                        style={{width:210,height: 33}}
                                        source={require('./../../images/TI10/continueOpen.png')}
                                    />
                                </TouchableOpacity>
                            }

                            {
                                isSuccessGrab && (
                                    remainingTriesForTheDay > 0 &&
                                    <Text style={styles.lotterModalText1}>
                                        {
                                            remainingTries == 0 ?
                                                // 获奖 > 抽獎機會已用完 > 尚可充值获得抽獎
                                                <Text style={styles.lotterModalText1}>
                                                    คุณยังมีเวลาเหลือ
                                                    <Text style={styles.lotterModalText2}>{remainingTriesForTheDay}</Text>ครั้งในการรับสิทธิ์ วันนี้{'\n'}กรุณาลองอีกครั้งหลังจากฝากเงิน
                                                </Text>
                                                :
                                                // 获奖 > 尚有抽獎機會 > 继续抽獎
                                                <Text style={styles.lotterModalText1}>คุณยังมีโอกาส <Text style={styles.lotterModalText2}>{remainingTriesForTheDay}</Text> ครั้ง เพื่อรับรางวัล</Text>
                                        }
                                    </Text>
                                )
                            }
                            
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    message: '',
                                    isSuccessGrab: false,
                                    isShowModalTip2: false,
                                    errorCode:  '',
                                    //remainingTries: '',
                                    prizeIndex: ''
                                })


                                UMonEvent && UMonEvent('Back_double11')
                            }}
                            hitSlop={{ top: 10, right: 10, bottom: 0, left: 10 }}
                            style={styles.lotteryModalCloseBtn}
                        >
                            <Text style={styles.lotteryModalCloseBtnText}>X</Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </Modal>

            <ScrollView
                ref={scrollView => {
                    this.rootScrollView = scrollView;
                }}
                nestedScrollEnabled={true}
                scrollEnabled={this.state.enabled}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <ImageBackground
                    resizeMode='stretch'
                    style={[styles.lotteryTopContainer]}
                    imageStyle={{
                        height: 160,    
                    }}
                    source={require('./../../images/TI10/headerImg.png')}
                >

                    <LinearGradient start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#0A358800', '#8D671076', '#051B4400']} style={styles.lotteryTimeBox}>
                        <View style={styles.lotteryBorder}>

                            {/*邊框*/}
                            <LinearGradient start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 0 }} 
                                            colors={['#FFFFFF00', '#EE870F', '#FFFFFF00']}
                                            style={{position: 'absolute', top: 0, height: 1, width: '100%'}} />
                            <LinearGradient start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FFFFFF00', '#EE870F', '#FFFFFF00']}
                                            style={{position: 'absolute', bottom: 0, height: 1, width: '100%'}} />

                            <View
                                style={[styles.lotteryTimeTop]}
                            />
                            <View
                                style={[styles.lotteryTimeBottom]}
                            />
                            <Text style={[styles.lotteryTimeBoxText1]}>
                                {
                                    isDoubleLotteryGameStatus == 1 ?
                                        `โปรโมชั่นเริ่ม 6 ตุลาคม 2564 เวลา 00:00น. (GMT +8)`
                                        : `ระยะเวลาโปรโมชั่น 6 - 17 ต.ค. 2564`
                                }
                            </Text>

                        </View>
                    </LinearGradient>

                    {
                        (isDoubleLotteryGameStatus != 3)
                            ?
                            <View style={styles.lotteryResetTimeContainer}>
                                {
                                    isDoubleLotteryGameStatus == 1 && <Text style={[styles.lotteryTimeBoxText2]}>อดใจรออีกนิดกับความสนุกที่กำลังจะเกิดขึ้น!</Text>
                                }

                                {
                                    isDoubleLotteryGameStatus == 2 && <Text style={[styles.lotteryTimeBoxText2]}>กล่องขุมทรัพย์ เริ่มแล้ว!{"\n"}ขอให้คุณเฮงๆ โชคดีคว้ารางวัลใหญ่!!</Text>
                                }

                                <View style={styles.lotteryResetTimeBox}>
                                    <View style={styles.lotteryResetListTimeBox}>
                                        <View style={styles.lotteryResetListTimeBox1}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{days}</Text>
                                        </View>
                                        <Text style={styles.lotteryResetListTimeBoxText2}>วัน</Text>
                                    </View>

                                    <View style={styles.lotteryResetListTimeBox}>
                                        <View style={styles.lotteryResetListTimeBox1}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{hours}</Text>
                                        </View>
                                        <Text style={styles.lotteryResetListTimeBoxText2}>ชั่วโมง</Text>
                                    </View>

                                    <View style={styles.lotteryResetListTimeBox}>
                                        <View style={styles.lotteryResetListTimeBox1}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{minutes}</Text>
                                        </View>
                                        <Text style={styles.lotteryResetListTimeBoxText2}>นาที</Text>
                                    </View>

                                    <View style={styles.lotteryResetListTimeBox}>
                                        <View style={styles.lotteryResetListTimeBox1}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{seconds}</Text>
                                        </View>
                                        <Text style={styles.lotteryResetListTimeBoxText2}>วินาที</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <Text style={{color: '#FFFFFF', marginTop: 40, marginBottom: 30, lineHeight: 20}}>
                                ขอบคุณสำหรับการร่วมสนุก
                                โปรโมชั่นได้สิ้นสุดลงแล้ว {"\n"}
                                เราหวังว่าจะได้ร่วมสนุกกันในครั้งต่อไป
                            </Text>
                    }
                </ImageBackground>

                <View style={styles.lotteryGiftContainer}>

                    {
                        isDoubleLotteryGameStatus != 3
                            ?
                            <Image
                                resizeMode='stretch'
                                style={styles.lotteryHeadIcon1}
                                source={require('./../../images/TI10/lotteryHeadIcon1.png')}
                            />
                            :
                            <Image
                                resizeMode='stretch'
                                style={styles.lotteryHeadIcon1}
                                source={require('./../../images/TI10/lotteryHeadIcon3.png')}
                            />
                    }

                    {
                        isDoubleLotteryGameStatus == 2 && ApiPort.UserLogin && <View style={styles.userMoneyBox}>
                            <Text style={styles.userMoneyLeftBoxText}>ยอดฝากของคุณ{"\n"}ที่สามารถร่วมสนุกได้วันนี้</Text>

                            <View style={styles.userMoneyRightBox}>
                                <Text style={styles.userMoneyRightBoxText1}>฿ </Text>
                                <Text style={styles.userMoneyRightBoxText2}>{totalDeposit}</Text>
                                <TouchableOpacity
                                    onPress={this.getLotteryProgress.bind(this, true)}
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                    <Image
                                        resizeMode='stretch'
                                        style={styles.moneyReload}
                                        source={require('./../../images/double11Lottery/moneyReload.png')}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }


                    {
                        isDoubleLotteryGameStatus != 3
                            ?
                            <ImageBackground
                                resizeMode='stretch'
                                style={styles.lotteryGiftBox}
                                source={require('./../../images/TI10/lotteryGiftBox.png')}
                            >
                                {/* <View style={styles.lotteryNotOpenIconBox}> */}
                                {
                                    lotteryNotOpenIcon.map((v, i) => {
                                        return <TouchableOpacity
                                            onPress={this.postLotteryStart.bind(this, v.index, v.status)}
                                            style={[styles.lotteryNotOpenIconWrap, {
                                                width: v.width,
                                                marginBottom: 23
                                            }]}
                                            key={i}>
                                            <Image
                                                resizeMode='stretch'
                                                // source={require('./../../images/double11Lottery/lotteryEndOpenIcon.png')}
                                                // style={styles.lotteryEndOpenIcon}
                                                source={
                                                    (!ApiPort.UserLogin || isDoubleLotteryGameStatus == 1)
                                                        ?
                                                        v.img
                                                        :
                                                        (
                                                            v.status
                                                                ?
                                                                lotteryEndOpenIcon[i].img
                                                                :
                                                                (
                                                                    (remainingTries + redeemeedPrizeList.length < v.index)
                                                                        ?
                                                                        v.img
                                                                        :
                                                                        lotteryCanOpenIcon[i].img
                                                                )
                                                        )

                                                }
                                                style={[
                                                    (!ApiPort.UserLogin || isDoubleLotteryGameStatus == 1)
                                                        ?
                                                        styles.lotteryNotOpenIcon
                                                        :
                                                        (
                                                            v.status
                                                                ?
                                                                styles.lotteryEndOpenIcon
                                                                :
                                                                (
                                                                    (remainingTries + redeemeedPrizeList.length < v.index)
                                                                        ?
                                                                        styles.lotteryNotOpenIcon
                                                                        :
                                                                        styles.lotteryCanOpenIcon
                                                                )
                                                        )
                                                ]}
                                            />
                                        </TouchableOpacity>
                                    })
                                }
                                {/* </View> */}
                            </ImageBackground>
                            :
                            <View>
                                {
                                    (ApiPort.UserLogin && prizeList.length > 0)
                                        ?
                                        <ImageBackground
                                            resizeMode='stretch'
                                            style={[styles.doubleRecordsBgContainer]}
                                            source={require('./../../images/TI10/doubleRecordsBg.png')}
                                        >
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
                                                <ScrollView
                                                    onContentSizeChange={(w, h) =>
                                                        (this.historyContentHeight = h)
                                                    }
                                                    ref={scrollView => {
                                                        this.historyScrollView = scrollView;
                                                    }}
                                                    onTouchStart={e => {
                                                        this.setState({ enabled: false, allowDraw: false });
                                                    }}
                                                    // onScrollBeginDrag={e => {
                                                    //   this.setState({ enabled: false, allowDraw: false });
                                                    // }}
                                                    onMomentumScrollBegin={e => {
                                                        this.setState({ enabled: false, allowDraw: false });
                                                    }}
                                                    onTouchEnd={e => {
                                                        this.setState({ enabled: true, allowDraw: true });
                                                    }}
                                                    onMomentumScrollEnd={e => {
                                                        this.setState({ enabled: true, allowDraw: true });
                                                    }}
                                                    onScrollEndDrag={e => {
                                                        this.setState({ enabled: true, allowDraw: true });
                                                    }}
                                                    nestedScrollEnabled={true}
                                                    scrollEnabled={true}
                                                    automaticallyAdjustContentInsets={false}
                                                    showsHorizontalScrollIndicator={false}
                                                    showsVerticalScrollIndicator={false}>

                                                    {
                                                        prizeList.map((v, i) => {
                                                            return <View style={[styles.lotteryRecordThead]} key={i}>
                                                                <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                                                    <Text style={styles.lotteryRecordTheadTd1}>{moment(v.applyDate).format('YYYY-MM-DD[\n]HH:mm')}</Text>
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
                                                </ScrollView>
                                            </View>
                                        </ImageBackground>
                                        :
                                        <ImageBackground
                                            resizeMode='stretch'
                                            style={styles.lotteryBottomContainer}
                                            source={require('./../../images/TI10/bottomBg.png')}
                                        >
                                            <View style={styles.doublenoNoRecordbox}>
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.doublenoRecord1}
                                                    source={require('./../../images/TI10/doublenoRecord2.png')}
                                                ></Image>
                                                <Text style={styles.doublenoNoRecordText}>ไม่มีข้อมูล</Text>
                                            </View>
                                        </ImageBackground>
                                }
                            </View>
                    }
                </View>
                <View>
                    <Image
                        resizeMode='stretch'
                        style={styles.lotteryHeadIcon1}
                        source={require('./../../images/TI10/lotteryHeadIcon2.png')}
                    ></Image>
                    <ImageBackground
                        resizeMode='stretch'
                        style={styles.lotteryBottomContainer}
                        source={require('./../../images/TI10/bottomBg.png')}
                    >
                        <View style={styles.lotterySteopContainer}>
                            {
                                LotteryStepInfor.map((v, i) => {
                                    return <View key={i} style={styles.lotterySteopBox}>
                                        <Image
                                            style={styles.lotterySteopImg}
                                            resizeMode='stretch'
                                            source={v.img}
                                        ></Image>
                                        <Text style={styles.lotterySteopText1}>{v.text1}</Text>
                                        <Text style={styles.lotterySteopText2}>{v.text2}</Text>
                                        {
                                            !(i * 1 === LotteryStepInfor.length - 1) && <Image
                                                resizeMode='stretch'
                                                style={styles.lotteryIconArrow}
                                                source={require('./../../images/double11Lottery/lotteryIconArrow.png')}
                                            ></Image>
                                        }
                                    </View>
                                })
                            }
                        </View>

                        <View style={styles.lotteryStepBtnInforBox}>
                            {
                                (isDoubleLotteryGameStatus != 3 ? LotteryStepBtnInfor : LotteryStepBtnInfor.slice(0, 1)).map((v, i) => {
                                    let flag = isDoubleLotteryGameStatus != 3
                                    return <TouchableOpacity
                                        onPress={this.lotteryAction.bind(this, v.action, v.pik)}
                                        key={i}
                                        style={[styles.lotteryStepBtnInforImg, { width: flag ? (width - 20 - 50) / 2.2 : (width - 20 - 50) }]}>
                                        <ImageBackground
                                            style={[styles.lotteryStepBtnInforImg, { width: flag ? (width - 20 - 50) / 2.2 : (width - 20 - 50) }]}
                                            resizeMode='stretch'
                                            source={require('./../../images/double11Lottery/lotteryBodyBtn.png')}
                                        >
                                            <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{v.text}</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#1F1703',
    },
    lotteryTopContainer: {
        width,
        height: .7 * width,
        paddingTop: 80,
        alignItems: 'center',
    },
    lotteryTimeContainer: {

    },
    lotteryTimeBox: {
        marginHorizontal: 20,
        height: 40,
        width: width - 40,
    },
    lotteryBorder: {
        position: 'relative',
        flex: 1,
        // borderTopWidth: 1,
        // borderTopColor: '#EE870F',
        // borderBottomColor: '#EE870F',
        // borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotteryTimeBoxText1: {
        color: '#FFF38F',
        fontSize: 13
    },
    lotteryTimeTop: {
        width: width - 40,
        height: 1,
        top: 0,
        position: 'absolute'
    },
    lotteryTimeBottom: {
        width: width - 40,
        height: 1,
        bottom: 0,
        position: 'absolute'
    },
    lotteryTimeBoxText2: {
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 20
    },
    lotteryResetTimeBox: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lotteryResetListTimeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    lotteryResetListTimeBox1: {
        backgroundColor: '#00061A99',
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 6,
        width: 30,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    lotteryResetListTimeBoxText1: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    lotteryResetListTimeBoxText2: {
        color: '#FFFFFF',
        fontSize: 12
    },
    lotteryResetTimeContainer: {
        marginTop: 25,
    },
    lotteryHeadIcon1: {
        width,
        height: .23 * width,
        marginBottom: 10
    },
    lotteryGiftContainer: {
        marginTop: -25
    },
    lotteryGiftBox: {
        width: width - 20,
        height: 258,
        marginHorizontal: 10,
        // paddingHorizontal: 30,
        paddingLeft: 30,
        paddingRight: 20,
        paddingTop: 15,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    lotteryBottomContainer: {
        width: width - 20,
        height: (width - 20) * .6,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    lotterySteopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lotterySteopBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (width - 20 - 40) / 3
    },
    lotterySteopImg: {
        width: 56,
        height: 56
    },
    lotterySteopText1: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10,
    },
    lotterySteopText2: {
        color: '#FFFFFF',
        fontSize: 10,
        textAlign: 'center',
        height: 40
    },
    lotteryIconArrow: {
        height: 8,
        width: 34,
        position: 'absolute',
        right: -20
    },
    lotteryStepBtnInforBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        paddingHorizontal: 10
    },
    lotteryStepBtnInforImg: {
        width: (width - 20 - 50) / 2.2,
        height: ((width - 20 - 50) / 2.2) * .3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    vipModal: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    vipSuccessContainer: {
        width: width * .8,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: '#00B32480',
        elevation: 4,
        position: 'relative',
        paddingTop: 25,
        paddingBottom: 25,
        alignItems: 'center'
    },
    successCircle: {
        backgroundColor: '#0BACFF',
        width: 70,
        height: 70,
        borderRadius: 10000,
        justifyContent: 'center',
        alignItems: 'center'
    },
    successCircleText: {
        fontWeight: 'bold',
        color: '#222222',
        fontSize: 40
    },
    vipModalText1: {
        color: '#F5F5F5',
        fontSize: 16,
        marginTop: 25,
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 22
    },
    vipModalSuccessBtn: {
        borderWidth: 1,
        borderColor: '#00B324',
        borderRadius: 4,
        width: width * .8 * .7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25
    },
    vipModalSuccessBtnText: {
        color: '#00B324'
    },
    lotteryModalBg: {
        // paddingTop: 20,
        // paddingVertical: 40,
        width: width * .8,
        minHeight: 1.04 * width * .7,
        alignItems: 'center',
    },
    lotteryModalHead: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40
    },
    lotteryModalHeadLine: {
        height: 2,
        width: 60,
        zIndex: 10,
        position: 'absolute'
    },
    lotteryModalHeadLine1: {
        left: -75
    },
    lotteryModalHeadLine2: {
        right: -75
    },
    lotteryModalHeadText: {
        color: '#72410F',
        fontWeight: 'bold',
        fontSize: 18,
        marginHorizontal: 10
    },
    lotteryBodyText: {
        textAlign: 'center',
        color: '#FF0000',
        fontSize: 15,
        paddingHorizontal: 70,
        fontWeight: 'bold',
    },
    lotteryBodyBtnBox: {
        // position: 'absolute',
        // bottom: 10
        marginTop: 10
    },
    lotteryBodyBtn: {
        width: (width * .9 * .75),
        height: (width * .9 * .75) * .15,
        alignItems: 'center',
        justifyContent: 'center',

    },
    lotteryBodyBtnText: {
        color: '#291900',
        fontWeight: 'bold'
    },
    lotteryModalCloseBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 1000,
        position: 'absolute',
        bottom: -50
    },
    lotteryModalCloseBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    lotterModalText1: {
        color: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: '#00050B80',
        elevation: 4,
        marginTop: 3,
        textAlign: 'center'
    },
    lotterModalText2: {
        color: '#FF0000',
        fontSize: 18
    },
    lotteryRecordTable: {
        borderWidth: 1,
        borderColor: '#97A2C8',
        borderBottomWidth: 0,
    },
    lotteryRecordThead: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF14'
    },
    lotteryRecordTheadTr: {
        height: 40,
        backgroundColor: '#FCED73',
        width: (width - 70) / 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#97A2C8'
    },
    lotteryRecordTheadTd: {
        color: '#291900',
        fontWeight: '400'
    },
    lotteryRecordTheadTr1: {
        borderRightWidth: 1,
        borderRightColor: '#97A2C8'
    },
    lotteryRecordTheadTr2: {
        backgroundColor: 'transparent'
    },
    lotteryRecordTheadTd1: {
        color: '#F5F5F5',
        textAlign: 'center',
        fontSize: 12
    },
    doubleRecordsBgContainer: {
        width: width - 20,
        height: (width - 75) * .892,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 40,
        paddingLeft: 30,
        paddingRight: 20,
        paddingTop: 25,
        paddingBottom: 75
    },
    doublenoNoRecordbox: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    doublenoRecord1: {
        width: (width - 20) * .5,
        height: (width - 20) * .5 * .638,
        marginBottom: 10,
    },
    doublenoNoRecordText: {
        color: '#FFFFFF'
    },
    userMoneyBox: {
        backgroundColor: '#4B3305',
        borderWidth: 1,
        borderColor: '#EEC30F',
        borderRadius: 10000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 30
    },
    userMoneyLeftBoxText: {
        color: '#FFF38F'
    },
    userMoneyRightBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userMoneyRightBoxText1: {
        color: '#FFF38F',
        transform: [
            {
                translateY: 5
            }
        ],
        fontSize: 12
    },
    userMoneyRightBoxText2: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#FFF38F',
        marginRight: 5
    },
    moneyReload: {
        width: 20,
        height: 20
    },
    lotteryNotOpenIcon: {
        width: 64,
        height: 64,
    },
    lotteryCanOpenIcon: {
        width: 64,
        height: 64,
        marginLeft: 0,
        transform: [
            {
                translateY: 0
            }
        ]
    },
    lotteryEndOpenIcon: {
        width: 64,
        height: 64,
        marginLeft: 0,
        // marginTop: 10,
    },
    lotteryNotOpenIconWrap: {
        alignItems: 'center',
    },
    lotteryNotOpenIconWrap1: {
        width: (width - 20 - 50) / 3
    },
    lotteryNotOpenIconWrap2: {
        width: (width - 20 - 50) / 4
    }
})
