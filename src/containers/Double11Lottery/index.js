import React from 'react'
import { StyleSheet, NativeModules,Text, View, Dimensions, ImageBackground, Image, ScrollView, Platform, TouchableOpacity, Modal } from 'react-native'
import moment from 'moment'
import { Toast } from "antd-mobile-rn"
import LinearGradient from 'react-native-linear-gradient'
import { Actions } from 'react-native-router-flux'
import Touch from 'react-native-touch-once';
const { width, height } = Dimensions.get('window')
const LotteryStepInfor = [
    {
        img: require('./../../images/double11Lottery/lotteryIcon1.png'),
        text1: 'ขั้นตอนที่ 1:',
        text2: 'เข้าสู่ระบบ หรือ สมัครตอนนี้',
        width: 56,
        height: 56,
        marginBottom: 0
    },
    {
        img: require('./../../images/double11Lottery/lotteryIcon2.png'),
        text1: 'ขั้นตอนที่ 2:',
        text2: 'ทำการฝากเงิน',
        width: 56,
        height: 56,
        marginBottom: 0
    },
    {
        img: require('./../../images/double11Lottery/lotteryIcon3.png'),
        text1: 'ขั้นตอนที่ 3:',
        text2: 'เปิด เพื่อลุ้นรางวัลแจ็กพอต',
        width: 56,
        height: 56,
        marginBottom: 0
    },
]

const LotteryStepBtnInfor = [
    {
        img: require('./../../images/double11Lottery/lotteryStepBtn1.png'),
        action: 'preferentialPage',
        text: 'รายละเอียดเพิ่มเติม',
        pik: 'TnC_Treasurebox'
    },
    {
        img: require('./../../images/double11Lottery/lotteryStepBtn2.png'),
        action: 'Double11LotteryRecord',
        text: 'ประวัติการรับรางวัล',
        pik: 'MyPrize_Treasurebox'
    }
]
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

const LotteryRewardIcon = {
    'lotteryRewardIcon1': {
        img: require('./../../images/double11Lottery/lotteryReward10.png'), // 扑克
        width: width * .4 * .973,
        height: width * .4,
        marginTop: -20,
        marginTop1: -10
    },
    'lotteryRewardIcon3': {
        img: require('./../../images/double11Lottery/lotteryReward4.png'), // 鼠标电子
        width: width * .4 * 1.845,
        height: width * .4,
        marginTop: 0,
        marginTop1: -30
    },
    'lotteryRewardIcon5': {
        img: require('./../../images/double11Lottery/lotteryReward13.png'), // 风衣
        width: width * .3 * 1.586,
        height: width * .35,
        marginTop: -5,
        marginTop1: 0
    },
    'lotteryRewardIcon7': {
        img: require('./../../images/double11Lottery/lotteryReward17.png'), // E ka
        width: width * .35 * 1.467,
        height: width * .35,
        marginTop: 0,
        marginTop1: -15
    },
    'lotteryRewardIcon2': {
        img: require('./../../images/double11Lottery/lotteryReward4.png'), // 鼠标电子
        width: width * .35 * 1.845,
        height: width * .35,
        marginTop: 0,
        marginTop1: -15
    },
    'lotteryRewardIcon8': {
        img: require('./../../images/double11Lottery/lotteryReward13.png'), // 风衣
        width: width * .54 ,
        height: width * .52*0.52,//width * .54*0.54,
        marginTop: -10,
        marginTop1: -5
    },
}

const PrizeName = {
    prizeIndex0: {
        text1: '11',
    },
    prizeIndex1: {
        text1: '竞博酷炫扑克牌'
    },
    prizeIndex2: {
        text1: '21',
    },
    prizeIndex3: {
        text1: '竞博电竞滑鼠垫'
    },
    prizeIndex4: {
        text1: '51',
    },
    prizeIndex5: {
        text1: '竞博运动风衣'
    },
    prizeIndex6: {
        text1: '81',
    },
    prizeIndex7: {
        text1: '京东 E 卡 100 元'
    },
    prizeIndex8: {
        text1: '111',
    },
}

LOTTERYNOSTARTTIME1 = '2020/11/9 00:00:00 +0800'
LOTTERYNOSTARTTIME2 = '2020/11/10 23:59:59 +0800'


LOTTERYSTARTTIM1 = '2020/11/11 00:00:00 +0800'
LOTTERYSTARTTIM2 = '2020/11/15 23:59:59 +0800'



// LOTTERYNOSTARTTIME1 = '2020/11/9 00:00:00 +0800'
// LOTTERYNOSTARTTIME2 = '2020/11/9 11:13:59 +0800'


// LOTTERYSTARTTIM1 = '2020/11/9 10:14:00 +0800'
// LOTTERYSTARTTIM2 = '2020/11/9 11:15:00 +0800'
const { StatusBarManager } = NativeModules;
export default class Double11Lottery extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            //isDoubleLotteryGameStatus: this.props.isDoubleLotteryGameStatus || 2, // 1 pendding   2 on   3 // end
            isDoubleLotteryGameStatus:'',
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
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 1,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 2,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 3,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 4,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 5,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 6,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 7,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 8,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 9,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventCanNotOpenImg,
                    status: false,
                    index: 10,
                    width: (width - 10 - 90) / 3
                }
            ],
            lotteryEndOpenIcon: [
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 1,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 2,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 3,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 4,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 5,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 6,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 7,
                    width: (width - 10 - 90) / 4
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 8,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 9,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventOpenedImg,
                    status: false,
                    index: 10,
                    width: (width - 10 - 90) / 3
                }
            ],
            lotteryCanOpenIcon: [
                {
                    img: this.props.EventCanOpenImg,
                    status: false,
                    index: 1,
                    width: (width - 10 - 90) / 3
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 2,
                    width: (width - 10 - 90) / 3
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 3,
                    width: (width - 10 - 90) / 3
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 4,
                    width: (width - 10 - 90) / 4
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 5,
                    width: (width - 10 - 90) / 4
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 6,
                    width: (width - 10 - 90) / 4
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 7,
                    width: (width - 10 - 90) / 4
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 8,
                    width: (width - 10 - 90) / 3
                },
                {
                    img:  this.props.EventCanOpenImg,
                    status: false,
                    index: 9,
                    width: (width - 10 - 90) / 3
                },
                {
                    img: this.props.EventCanOpenImg,
                    status: false,
                    index: 10,
                    width: (width - 10 - 90) / 3
                }
            ],
            prizeList: [],
            prizeIndex: '',
            enabled: true, //父滚动条
            isGetLotteryProgress: false,
            isShowDepositBtn: true,
            prizeName: '',
            prizeImage:'',
            prizeType:'',
            messageTitle:'',
            popUpMesssageFrameUrl:'',
            isShowModalError:false,
            isShowModalEmptyPromotions:false,
            statusBarHeight: Platform.OS=='ios'? 45:8,
            secMess1:'',
            secMess2:'',
            secMess3:'',
        }
    }

    componentDidMount() {
        Platform.OS=='ios' && StatusBarManager.getHeight((res)=>{
            if(res?.height!==undefined && res?.height!==null){
                this.setState({
                    statusBarHeight:res?.height
                }) 
            }
           
        })

        // global.storage.clearMap()
        this.getTimeDownStatus()

        this.getLotteryRecords()

        this.listenFocus()

        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetLotteryStatus + 'eventTypeId=6&', 'GET').then(res => {
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
            Toast.fail("活动尚未开放", 2);
          })

    }

    componentWillUnmount() {
        this.TimeDown && clearInterval(this.TimeDown)
    }

    listenFocus(){
        this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',() => {
          console.log('willFocus')
          this.getLotteryProgress(true)
       }
      );
      }

    changeLotteryStatus(isDoubleLotteryGameStatus) {
        this.setState({
            isDoubleLotteryGameStatus
        })
    }

     //如果沒帶Z或時區(+08:00)結尾，自動轉為UTC8
     _getMomentWithTZ = (dString) => {
        if (dString && (Object.prototype.toString.call(dString) === "[object String]") && dString.length > 0
            && (dString.indexOf('T') !== -1)
            && (!(dString.endsWith('Z') || dString.match(/(\+\d{2}\:\d{2})$/gmi)))
        ) {
            return moment(dString + '+08:00');
        }
        return moment(dString);
    }

    getTimeDownStatus() {
        const {EventDetail}=this.props
       
        let nowTime = moment();
        const eventStartDateMoment = this._getMomentWithTZ(EventDetail.eventStartDate);
        const eventEndDateMoment = this._getMomentWithTZ(EventDetail.eventEndDate);

        if (nowTime.isBefore(eventStartDateMoment)){
            console.log('活動未開始')
            this.setState({
                isDoubleLotteryGameStatus: 1    //活動未開始
            }, () => {
                this.TimeDown = setInterval(() => {
                    this.diffTime(EventDetail.eventStartDate, true)
                }, 1000)
            })
            return
        }else if (nowTime.isAfter(eventEndDateMoment)){ 
            console.log('活動結束')
            this.setState({
                isDoubleLotteryGameStatus: 3    //活動結束
            })
            return
     
        }else{
            console.log('活動進行中')
            this.setState({
                isDoubleLotteryGameStatus: 2    //活動進行中
            }, () => {
                this.TimeDown = setInterval(() => {
                    this.diffTime(EventDetail.eventEndDate, false)
                }, 1000)
            })
            return
        }
    }

    getLotteryRecords() {
        const {EventDetail}=this.props

        if (!ApiPort.UserLogin) return
        if (this.state.isDoubleLotteryGameStatus == 1) return
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetLotteryRecords + 'id=' + EventDetail.id + '&isPreview='+isEventPreview+'&', 'GET','' , 35000 ,2).then(res => {
            Toast.hide()
            console.log('prizeList',res)
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
      
        const {EventDetail}=this.props

        if (!ApiPort.UserLogin) return

        flag && Toast.loading('กำลังโหลดข้อมูล...', 2000)
        this.setState({
            isGetLotteryProgress: false
        })

        //用來獲取玩家的進度
        fetchRequest(ApiPort.GetLotteryProgress + 'id=' + EventDetail.id + '&isPreview='+isEventPreview+'&', 'GET', '' , 35000 ,2).then(res => {
            Toast.hide()
            this.setState({
                isGetLotteryProgress: true
            })
            console.log('GetLotteryProgress res',res)
            let redeemeedPrizeList = res.redeemeedPrizeList
            this.setState({
                totalDeposit: res.totalDeposit,//存款金额
                remainingTries: res.remainingTries,//剩餘抽獎次數
                totalPrizes: 10 || res.totalPrizes,
                redeemeedPrizeList
            })

            if (Array.isArray(redeemeedPrizeList) && redeemeedPrizeList.length) {
                let New_lotteryNotOpenIcon=this.state.lotteryNotOpenIcon
                redeemeedPrizeList.forEach(v => {
                    New_lotteryNotOpenIcon[v - 1].status = true//this.state.lotteryNotOpenIcon[v - 1].status = true
                    //this.setState({})
                })
                this.setState({lotteryNotOpenIcon:New_lotteryNotOpenIcon})
            }
            
        }).catch(err => {
            Toast.hide()
        })

        refreshTotalBal();
    }


    postLotteryStart(uiPrizeIdentity, status) {
        const { EventDetail,EventBannerImg,EventBGColor,
            EventCanNotOpenImg,
            EventCanOpenImg,
            EventOpenedImg}=this.props
        
        UMonEvent('Engagement_Event','Claim','GrabLuckyGift_ Treasurebox')

       
        if (!ApiPort.UserLogin) {
            Toast.fail("ล็อคอิน", 2)
            Actions.logins({
                fromPage: 'Double11Lottery',
                eventTitle: EventDetail?.eventTitle,
                    templateName: EventDetail.templateName,
                    EventDetail,
                    EventBannerImg,
                    EventBGColor,
                    EventCanNotOpenImg,
                    EventCanOpenImg,
                    EventOpenedImg
            })
            return
        }

        const { isDoubleLotteryGameStatus, remainingTries, redeemeedPrizeList } = this.state

        if (isDoubleLotteryGameStatus == 1 ) {
            this.setState({ 
                isShowModalTip1: true
            })
            return
        }

        this.setState({
            isShowDepositBtn: false,
            message1: ''
        })
  
        console.log('status',status,redeemeedPrizeList) //status is true 已開過 redeemeedPrizeList 已兌換獎品清單

       
        this.setState({
            message: '',
            isSuccessGrab: false,
            isShowModalTip2: false,
            errorCode: '',
            prizeIndex: ''
        })

        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        console.log('id=',EventDetail)
        console.log('prizeIndex=',uiPrizeIdentity)
        //用來獲取寶箱的獎品
        fetchRequest(ApiPort.PostLotteryStart + 'id=' + EventDetail.id+ '&uiPrizeIndex=' + uiPrizeIdentity + '&isPreview='+isEventPreview+'&', 'POST' ,'' , 35000 ,2).then(res => {
            Toast.hide()
            console.log('PostLotteryStart',res)

            if(res?.title == 'Internal Server Error'){
                this.setState({isShowModalError:true})
                return
            }

            //可開寶箱都已開啟，未開寶箱還沒激活，只能去充值
            if(remainingTries==0 && redeemeedPrizeList?.length<10 && redeemeedPrizeList?.length>0 && this.state.totalDeposit>0){
                //去充值更多
                this.setState({
                    isShowDepositBtn: true,
                })
            }
 

            let mainMess=res.message
            let secMess1=''
            let secMess2=''
            let secMess3=''
            if(res.isSuccess==true && (res.prizeType==1 || res.prizeType==2)  && res.remainingTriesForTheDay>0){ //抽獎成功，有中獎  還有次數
                console.log('抽獎成功，有中獎')
                secMess2 =  parseInt(mainMess.match(/\d/g).join(' '),10)
                secMess1 = mainMess.split(secMess2)[0]
                secMess3 = mainMess.split(secMess2)[1]
            }else if(res.isSuccess==true && res.prizeType==0 && res.remainingTriesForTheDay>0){  //抽獎成功，沒中獎 還有次數
                console.log('抽獎成功，沒中獎 還有次數')
                mainMess= mainMess.split('\n')[0]
                secAllMess= res.message.split('\n')[1]
                secMess2 =  parseInt(secAllMess.match(/\d/g).join(' '),10)
                secMess1 = secAllMess.split(secMess2)[0]
                secMess3 = secAllMess.split(secMess2)[1]
            } else if(res.isSuccess==true && res.prizeType==0 && res.remainingTriesForTheDay==0){  //抽獎成功，沒中獎 沒有次數
                console.log('抽獎成功，沒中獎 沒有次數')
                mainMess= res.message.split('\n')[0]
                secMess1 = res.message.split('\n')[1]

            }

            console.log('mainMess',mainMess)
           
            this.setState({
                message: mainMess,
                secMess1,
                secMess2,
                secMess3,
                isSuccessGrab: res.isSuccess,
                isShowModalTip2: true,
                errorCode: res.errorCode * 1,
                popUpMesssageFrameUrl: res.popUpMesssageFrameUrl,
                messageTitle:res.messageTitle
            })


            if (res.isSuccess==true) {
                // if(res.prizeType==1 && res?.prizeName!==''){
                //     let prizeSplit= res?.prizeName.split("บาท")
                //      console.log('prizeSplit',prizeSplit)
                // }

                if(res.remainingTries==0 && res.remainingTriesForTheDay>0){
                    //顯示充值按鈕
                    this.setState({isShowDepositBtn: true,})
                }
                let prizeName=res.prizeName
                if(res.prizeType==1){
                    prizeName= res.prizeName.split('บาท')[0]
                }
               
               
                this.setState({
                    prizeIndex: uiPrizeIdentity,
                    prizeName: prizeName,
                    prizeType: res.prizeType,
                    prizeImage:res.prizeImageUrl,
                    //remainingTries: res.remainingTries,
                    remainingTriesForTheDay:res.remainingTriesForTheDay,
                })
            } else if(res.isSuccess==false){
                if(res.message=='ขออภัย คุณไม่สามารถขอรับได้ในขณะนี้ กรุณารอการอนุมัติยอดฝากของคุณ'){
                    //存款審核中不用充值按鈕，未充值過要充值按鈕
                    this.setState({
                        isShowDepositBtn: false,
                    })
                }else{
                    this.setState({
                        isShowDepositBtn: true,
                    })
                }
               
               
            }else{
                this.setState({
                    isShowModalError: true,
                    isShowModalTip2: false,
                })
            }
            this.getLotteryProgress()



           

        }).catch(err => {
            console.log('err===',err)
            this.setState({isShowModalError:true})
            Toast.hide()
        })
    }

    diffTime(Time, flag) {
        const {EventDetail}=this.props
        // 当前时间
        const nowTime = moment();//new Date(moment().format()).getTime()
        //计算出相差毫秒数
        const formatEndTime =  this._getMomentWithTZ(Time)//new Date(moment(Time).format()).getTime()
        
        const diff = this._getMomentWithTZ(Time) - nowTime //(new Date(Time)).getTime() - nowTime
        const diff_1 = parseFloat(formatEndTime - nowTime)
        
        //计算出相差天数
        const days =Math.floor(diff / (24 * 3600 * 1000))//Platform.OS=='android'? Math.floor(diff_1 / (24 * 3600 * 1000)) : Math.floor(diff / (24 * 3600 * 1000))

        //计算出小时数
        const leave1 = diff % (24 * 3600 * 1000)//Platform.OS=='android'? diff_1 % (24 * 3600 * 1000):diff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000))
       
        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000))

        //计算相差秒数
        const leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave3 / 1000)
        
       
        if ((diff > 0)) { 
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
                    this.diffTime(EventDetail.eventEndDate, false)//this.diffTime(LOTTERYSTARTTIM2, false)
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
        pik && UMonEvent && UMonEvent('Engagement_Event', 'View', pik)
        const { isDoubleLotteryGameStatus } = this.state
        const { EventDetail,EventBannerImg,EventBGColor,
            EventCanNotOpenImg,
            EventCanOpenImg,
            EventOpenedImg}=this.props
        if (action === 'Double11LotteryRecord' && !ApiPort.UserLogin) {
            Toast.fail("ล็อคอิน", 2)
            Actions.logins({
                fromPage: 'Double11Lottery',
                eventTitle: EventDetail?.eventTitle,
                templateName: EventDetail.templateName,
                EventDetail,
                EventBannerImg,
                EventBGColor,
                EventCanNotOpenImg,
                EventCanOpenImg,
                EventOpenedImg

            })
            return
        }
        if (action == 'preferentialPage') {
            if(EventDetail?.promotionContent!=='' || EventDetail?.eventTnCContent!==''){
                Actions.Double11PreferentialPage({
                    promotionDetail:{
                        promotionDetailContent:EventDetail?.promotionContent,
                        promotionDetailTnc:EventDetail?.eventTnCContent
                    }
                });
            }else{
                this.setState({isShowModalEmptyPromotions:true})
            }
            
            // Toast.loading('กำลังโหลดข้อมูล...', 200);
            // fetchRequest(ApiPort.GetPromotionsDetail + EventDetail.promotionId + '?', 'GET','' , 35000 ,2).then(res => {
            //     Toast.hide()
            //     if (res) {
            //         console.log('GetPromotionsDetail',res)
            //         if (res?.promotion && Object.keys(res?.promotion).length) {
            //             Actions.preferentialPage({
            //                 preferential: res.promotion
            //             });
            //         }
                    
            //         if(Object.keys(res).length === 0){
            //             this.setState({isShowModalEmptyPromotions:true})
            //         }

            //         return
            //     }
            // }).catch(err => {
            //     Toast.hide()
            // })
            return
        }
        Actions[action]({
            isDoubleLotteryGameStatus,
            EventDetail
        })
    }

    render() {
        const { secMess1,secMess2,secMess3,statusBarHeight,isShowModalEmptyPromotions,isShowModalError,prizeImage,prizeType, isDoubleLotteryGameStatus, message1, remainingTriesForTheDay,isShowDepositBtn, lotteryEndOpenIcon, lotteryCanOpenIcon, isGetLotteryProgress, redeemeedPrizeList, totalPrizes, prizeList, lotteryNotOpenIcon, remainingTries, errorCode, message, isShowModalTip1, isShowModalTip2, days, hours, minutes, seconds, totalDeposit } = this.state
        const { messageTitle,popUpMesssageFrameUrl,prizeName, prizeIndex, isSuccessGrab } = this.state
        const { EventDetail ,EventBGColor}=this.props
        window.changeLotteryStatus = (isDoubleLotteryGameStatus) => {
            this.changeLotteryStatus(isDoubleLotteryGameStatus)
        }
        let messageText1 = ''
        let messageText2 = ''
        let messageFlag = message?.includes('！') || message?.includes('!')
        if (message.length > 0) {
            if (message?.includes('！')) {
                messageText1 = message.split('！')[0]
                messageText2 = message.split('！')[1]
            } else {
                messageText1 = message
                messageText2 = message
            }
            if (message?.includes('!')) {
                messageText1 = message.split('!')[0]
                messageText2 = message.split('!')[1]
            } else {
                messageText1 = message
                messageText2 = message
            }
        }
          return <View style={[styles.viewContainer,{backgroundColor:EventBGColor}]}>
            <View style={{flexDirection:'row',backgroundColor:EventBGColor,marginTop:statusBarHeight,height:Eventtitle.length>30? 45 :34,justifyContent:'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 15 }}>
                    <Image
                        resizeMode="stretch"
                        source={require("./../../images/double11Lottery/logo.png")}
                        style={{ width: 22, height: 28, marginRight: 5 }}
                    />
                    <View style={{height:'100%',flexWrap:'wrap',width:'70%',marginLeft:8,justifyContent:'center'}}>
                        <Text  style={{ color: '#FFFFFF',flexWrap:'wrap'}}>{Eventtitle}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, }}>
                    <TouchableOpacity
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        onPress={() => {
                            Actions.pop()
                        }}
                    >
                        <Image
                            resizeMode="stretch"
                            source={require("./../../images/double11Lottery/home.png")}
                            style={{ width: 20, height: 20, marginRight: 20 }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        onPress={() => {
                            Actions.LiveChatST()
                        }}
                    >
                        <Image
                            resizeMode="stretch"
                            source={require("./../../images/home/icon-csb.png")}
                            style={{ width: 24, height: 24 }}
                        />
                    </TouchableOpacity>

                </View>
            </View>

            {/* 活動還未開始*/}
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
                        <Text style={styles.vipModalText1}>โปรโมชั่นยังไม่เริ่ม ณ ตอนนี้ อดใจรอสักครู่</Text>
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

            {/* api error 彈窗 */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={isShowModalError}
            >
                <View style={styles.vipModal}>
                    <View style={[styles.vipSuccessContainer]}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({isShowModalError:false})
                        }} style={{width:'100%',alignItems:'flex-end',marginRight:32}}>
                            <Text style={{color:'#fff',fontSize:20}}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.successCircle}>
                            <Text style={styles.successCircleText}>{'!'}</Text>
                        </View>
                        <Text style={styles.vipModalText1}>Lỗi! Liên hệ ngay Live Chat để được hỗ trợ</Text>
                        <TouchableOpacity style={styles.vipModalSuccessBtn} onPress={() => {
                           Actions.LiveChatST();
                           this.setState({
                                isShowModalError: false
                            })
                        }}>
                            <Text style={styles.vipModalSuccessBtnText}>Live Chat</Text>
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
                        source={{ uri: popUpMesssageFrameUrl }}
                    >
                        <View style={[styles.lotteryModalHead,{marginTop: (1.03 * width * .9)*0.12,}]}>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#E6B276', '#6F3003D8']} style={{height:2,width:messageTitle.length>=10?40:50,marginHorizontal:10}}></LinearGradient>
                            <Text style={styles.lotteryModalHeadText}>
                                {messageTitle}
                            </Text>
                        <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#6F3003D8','#E6B276']} style={{height:2,width:messageTitle.length>=10?40:50,marginHorizontal:10}}></LinearGradient>
                        </View>
                        {
                            isSuccessGrab ? 
                            <View style={{ alignItems: 'center' }}>
                                {
                                prizeType==2&&
                                <Image
                                source={{uri: prizeImage}}
                                resizeMode='contain'
                                style={{
                                    marginBottom:-2,
                                    width: LotteryRewardIcon[`lotteryRewardIcon${8}`].width,
                                    height: LotteryRewardIcon[`lotteryRewardIcon${8}`].height,
                                }}></Image>
                                }

                                {//prizeType 獎品種類 1-獎金 2-實體獎勵
                                 prizeType==2 &&
                                    <Text style={[styles.lotteryBodyText,{ marginTop:8}]}>{prizeName}</Text>
                                }
                                {prizeType==1 &&  <View style={{ paddingVertical: '2%', alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', height: 70 }}>
                                            <View style={{ flexDirection: 'row',  height:'100%' ,alignItems:'flex-end'}}>
                                                <Text style={{ fontSize: 48, color: '#FF0000', fontWeight: 'bold' }}><Text style={{ color: '#FF0000', fontSize: 25 }}>฿</Text> {prizeName}</Text>
                                            </View>
                                        </View>
                                        <Text style={{ color: '#FF0000', fontSize: 14, marginTop: 20,fontWeight:'bold',fontFamily:"Kanit",}}>เงินเดิมพันฟรี</Text>
                                    </View>}
                                    
                            </View>
                            :
                            //1.寶箱都開完，要去充值 2.還有寶箱可開，點擊已開過寶箱 3.全部寶箱都抽完 4.還沒充值
                            <View style={{ paddingVertical: (1.03 * width * .9)*0.08, marginHorizontal: 60 }}> 
                                <Text style={{ textAlign: 'center', color: '#FF0000', fontSize: 13,fontWeight: 'bold',lineHeight:22 }}>{message}</Text>
                            </View>
                        }


                         {//沒中獎
                            isSuccessGrab && prizeType==0 && message &&
                            <Text style={[styles.lotteryBodyText,{ marginHorizontal:8,marginTop:40}]}>{message}</Text>
                        }

                        {//顯示充值按鈕 
                           ( (remainingTries == 0 && redeemeedPrizeList?.length<10 && isShowDepositBtn)
                            ||
                            ( (remainingTriesForTheDay > 0 && remainingTries == 0 && redeemeedPrizeList.length > 0 && errorCode != 103) && isShowDepositBtn) 
                            ||
                            (remainingTries==0 && remainingTriesForTheDay==10 && prizeType==0)) //充值金額不夠
                            && 
                            <TouchableOpacity
                                style={{marginTop:12}}
                                onPress={() => {
                                    this.setState({
                                        isShowModalTip2: false
                                    })
                                    Actions.depositTx()
                                    UMonEvent && UMonEvent('Deposit Nav','Click','Deposit_ Treasurebox​')
                                }}>
                                <ImageBackground
                                    resizeMode='stretch'
                                    style={styles.lotteryBodyBtn}
                                    source={require('./../../images/double11Lottery/lotteryModalBodyBtn.png')}
                                >
                                </ImageBackground>
                            </TouchableOpacity>
                        }



                        {
                            isSuccessGrab &&  remainingTriesForTheDay > 0 && remainingTries > 0 && <TouchableOpacity //isGetLotteryProgress &&
                                onPress={() => {
                                    UMonEvent && UMonEvent('Engagement Event​​','Click','GrabMore_ Treasurebox​')
                                    this.setState({
                                        message: '',
                                        isSuccessGrab: false,
                                        isShowModalTip2: false,
                                        errorCode: '',
                                        //remainingTries: '',
                                        prizeIndex: '',
                                    }, () => {
                                       
                                    })
                                }}
                                style={{marginTop:12,marginBottom:12}}
                            >
                                <ImageBackground
                                    resizeMode='stretch'
                                    style={styles.lotteryBodyBtn}
                                    source={require('./../../images/double11Lottery/lotteryModalBodyBtn1.png')}
                                >
                                </ImageBackground>
                            </TouchableOpacity>
                        }

                        {
                            <View style={{paddingHorizontal:50}}>
                                {
                                    isSuccessGrab ?(
                                        remainingTriesForTheDay > 0 ? (
                                             <Text style={[styles.lotterModalText1,{top:Platform.OS === 'ios'? 5 : 0}]}>
                                                <Text style={[styles.lotterModalText1,{fontSize:12}]}>{secMess1} <Text style={styles.lotterModalText2}>{secMess2}</Text> {secMess3}</Text>
                                            </Text> 
                                        ):
                                      ( (prizeType==1 || prizeType==2 ) ? <Text style={[styles.lotterModalText1,{fontSize:12,marginTop:16}]}>{message}</Text>:<Text style={[styles.lotterModalText1,{fontSize:12,marginTop:16}]}>{secMess1}</Text>)
                                    ): 
                                    <View style={{}}>
                                    </View>
                                }
                            </View>
                        }
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    message: '',
                                    isSuccessGrab: false,
                                    isShowModalTip2: false,
                                    errorCode: '',
                                    //remainingTries: '',
                                    prizeIndex: '',
                                })


                                // UMonEvent && UMonEvent('Back_double11')
                            }}
                            hitSlop={{ top: 10, right: 10, bottom: 0, left: 10 }}
                            style={styles.lotteryModalCloseBtn}
                        >
                            <Image source={require('./../../images/double11Lottery/closeBtn.png')}></Image>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </Modal>
            {/* <View style={{ backgroundColor: '#171717', flex: 1 }}> */}
            <Modal
                animationType='fade'
                transparent={true}
                visible={isShowModalEmptyPromotions}
            >
                <View style={styles.vipModal}>
                    <View style={[styles.vipSuccessContainer,{height:height/3}]}>
                    <TouchableOpacity onPress={()=>{
                            this.setState({isShowModalEmptyPromotions:false})
                        }} style={{width:'100%',alignItems:'flex-end',marginRight:32}}>
                            <Text style={{color:'#fff',fontSize:16}}>X</Text>
                        </TouchableOpacity>
                       
                    </View>
                </View>
            </Modal>
            

            <ScrollView
                ref={scrollView => {
                    this.rootScrollView = scrollView;
                }}
                nestedScrollEnabled={true}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <ImageBackground
                    resizeMode='stretch'
                    style={styles.lotteryTopContainer}
                    source={{ uri: this.props.EventBannerImg }}
                    // source={require('./../../images/double11Lottery/topBg.png')}
                >

                    <ImageBackground
                    resizeMode='stretch'
                    style={[styles.lotteryTimeBox]}
                    source={require('./../../images/double11Lottery/titleBack.png')}
                    >
                        <Text style={[styles.lotteryTimeBoxText1, { color: '#FFF38F' }]}>ระยะเวลาโปรโมชั่น: {moment(EventDetail.eventStartDate).format("DD/MM/YYYY HH:mm")} - {moment(EventDetail.eventEndDate).format("DD/MM/YYYY HH:mm")} (GMT +8)</Text>
                    </ImageBackground>

                </ImageBackground>
                {
                    (isDoubleLotteryGameStatus != 3)
                        ?
                        <View style={styles.lotteryResetTimeContainer}>
                           <Text style={[styles.lotteryTimeBoxText2]}>{EventDetail.eventMessage}</Text> 
                            {/* 请您稍等片刻，活动即将开始 */}
                            {/* {
                                isDoubleLotteryGameStatus == 1 && <Text style={[styles.lotteryTimeBoxText2]}>Khuyến Mãi Chưa Bắt Đầu!</Text>
                            } */}
                            {/* 大宝箱时代开始了，祝您狂开大奖！活动剩余时间： */}
                            {/* {
                                isDoubleLotteryGameStatus == 2 && <Text style={[styles.lotteryTimeBoxText2, { paddingHorizontal: 20, marginBottom: 10 }]}>Sự Kiện Kho Báu TI10 bắt đầu. Chúc Bạn may mắn và thắng giải thưởng khủng. Thời gian còn lại:</Text>
                            } */}

                            <View style={styles.lotteryResetTimeBox}>
                                {/* <View style={styles.lotteryResetListTimeBox}>
                                    <View style={styles.lotteryResetListTimeBox1}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{days}</Text>
                                    </View>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>Ngày</Text>
                                </View> */}

                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                    resizeMode='stretch'
                                    style={[styles.lotteryResetListTimeBox,{ width: width* 0.1,height: (width) * 0.1}]}
                                    source={require('./../../images/double11Lottery/timeFrame.png')}
                                    >
                                        <View style={styles.lotteryResetListTimeFrame}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{days}</Text>
                                        </View>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>วัน</Text>
                                </View>

                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                    resizeMode='stretch'
                                    style={[styles.lotteryResetListTimeBox,{ width: width* 0.1,height: (width) * 0.1}]}
                                    source={require('./../../images/double11Lottery/timeFrame.png')}
                                    >
                                        <View style={styles.lotteryResetListTimeFrame}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{hours}</Text>
                                        </View>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>ชั่วโมง</Text>
                                </View>

                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                    resizeMode='stretch'
                                    style={[styles.lotteryResetListTimeBox,{ width: width* 0.1,height: (width) * 0.1}]}
                                    source={require('./../../images/double11Lottery/timeFrame.png')}
                                    >
                                        <View style={styles.lotteryResetListTimeFrame}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{minutes}</Text>
                                        </View>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>นาที</Text>

                                </View>
                               

                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                    resizeMode='stretch'
                                    style={[styles.lotteryResetListTimeBox,{ width: width* 0.1,height: (width) * 0.1}]}
                                    source={require('./../../images/double11Lottery/timeFrame.png')}
                                    >
                                        <View style={styles.lotteryResetListTimeFrame}>
                                            <Text style={styles.lotteryResetListTimeBoxText1}>{seconds}</Text>
                                        </View>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>วินาที</Text>

                                </View>
                                

                            </View>
                        </View>
                        :
                        <Text style={{ color: '#FFFFFF', marginBottom: 30, textAlign: 'center' }}>{EventDetail.eventMessage}</Text>
                }

                <View>
                    
                    {
                        isDoubleLotteryGameStatus == 2 && //ApiPort.UserLogin && 
                        <ImageBackground
                        resizeMode='stretch'
                        style={{ width: width,
                            height: (width) * .14,
                            flexDirection:'row',
                            justifyContent:'space-between',
                            paddingHorizontal:30,
                            alignItems:'center',
                            marginBottom:20
                           }}
                        source={require('./../../images/double11Lottery/moneyBox.png')}
                    >
                            <Text style={styles.userMoneyLeftBoxText}>ยอดฝากของคุณที่สามารถ {'\n'}ร่วมสนุกได้วันนี้</Text>

                            <View style={styles.userMoneyRightBox}>
                                <Text style={styles.userMoneyRightBoxText1}>฿  </Text>
                                <Text style={styles.userMoneyRightBoxText2}>{totalDeposit}</Text>
                                <TouchableOpacity
                                    onPress={()=>{
                                        if (!ApiPort.UserLogin) {
                                            Toast.fail("ล็อคอิน", 2)
                                            Actions.logins({
                                                fromPage: 'Double11Lottery',
                                                eventTitle: EventDetail?.eventTitle,
                                                    templateName: EventDetail.templateName,
                                                    EventDetail,
                                                    EventBannerImg:this.props.EventBannerImg,
                                                    EventBGColor:this.props.EventBGColor,
                                                    EventCanNotOpenImg:this.props.EventCanNotOpenImg,
                                                    EventCanOpenImg:this.props.EventCanOpenImg,
                                                    EventOpenedImg:this.props.EventOpenedImg
                                            })
                                            return
                                        }
                                        this.getLotteryProgress(this, true)
                                    }}
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                    <Image
                                        resizeMode='stretch'
                                        style={styles.moneyReload}
                                        source={require('./../../images/double11Lottery/moneyReload.png')}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                            </ImageBackground>
                    }
                    
                    <View style={{ alignItems: 'center' }}>
                        {
                            isDoubleLotteryGameStatus != 3
                                ?
                                //点击下方进行抽奖
                                <ImageBackground
                                resizeMode='stretch'
                                style={{ width: (width*1.35),
                                    height: (width*1.35) * .09,
                                    alignItems: 'center',
                                    justifyContent: 'center'}}
                                source={require('./../../images/double11Lottery/panel.png')}
                            >
                                <Text style={{color:'#FFF38F',fontSize:13}}>กดตรงนี้เพื่อเริ่มรับรางวัล​</Text>
                            </ImageBackground>
                                :
                                //获奖记录
                                <ImageBackground
                                resizeMode='stretch'
                                style={{ width: (width*1.35),
                                    height: (width*1.35) * .09,
                                    alignItems: 'center',
                                    justifyContent: 'center'}}
                                source={require('./../../images/double11Lottery/panel.png')}
                            >
                                <Text style={{color:'#FFF38F',fontSize:13}}>กดตรงนี้เพื่อเริ่มรับรางวัล</Text>
                            </ImageBackground>
                        }
                    </View>



               
                    { 
                    //活動內容or获奖记录內容
                        isDoubleLotteryGameStatus != 3
                            ?
                            <ImageBackground
                                resizeMode='stretch'
                                style={[styles.lotteryGiftBox, { marginTop: 15 }]}
                                source={require('./../../images/double11Lottery/lotteryBox.png')}
                            >
                                {  
                                    lotteryNotOpenIcon.map((v, i) => {
                                        return <Touch
                                            onPress={this.postLotteryStart.bind(this, v.index, v.status)}
                                            style={[styles.lotteryNotOpenIconWrap, {
                                                width: v.width,height: i==0 ||i==1 ||i==2 ?((width - 10) * .73)/3.2:((width - 10) * .73)/3.2-6,
                                                justifyContent:'flex-end',
                                                //backgroundColor:i==4?'pink':i==6?'blue':'white'
                                            }]}
                                            key={i}>
                                            <Image
                                                resizeMode='stretch'
                                                source={{uri:
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
                                                                        v.img   //沒開
                                                                        :
                                                                        lotteryCanOpenIcon[i].img
                                                                )
                                                        )

                                                }}
                                                style={[
                                                    (!ApiPort.UserLogin || isDoubleLotteryGameStatus == 1)
                                                        ?
                                                        [styles.lotteryNotOpenIcon,,{alignSelf:'center'}] //[styles.lotteryNotOpenIcon, styles[`lotteryNotOpenIcon${i}`]]
                                                        :
                                                        (
                                                            v.status
                                                                ?
                                                                [styles.lotteryNotOpenIcon,{alignSelf:'center'}]
                                                                :
                                                                (
                                                                    (remainingTries + redeemeedPrizeList.length < v.index)
                                                                        ?
                                                                        [styles.lotteryNotOpenIcon,{alignSelf:'center'}]
                                                                        :
                                                                        [styles.lotteryNotOpenIcon,{alignSelf:'center'}]
                                                                )
                                                        )
                                                ]}
                                            ></Image>
                                        </Touch>
                                    })
                                }
                            </ImageBackground>
                            :
                            <View>
                                {
                                    (ApiPort.UserLogin && prizeList.length > 0)
                                        ?
                                        <ImageBackground
                                            resizeMode='stretch'
                                            style={[styles.doubleRecordsBgContainer]}
                                            source={require('./../../images/double11Lottery/recordPanel.png')}
                                        >
                                            <View style={styles.lotteryRecordTable}>
                                                <View style={styles.lotteryRecordThead}>
                                                    <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1]}>
                                                        {/* 日期时间 */}
                                                        <Text style={styles.lotteryRecordTheadTd}>วัน และ เวลา</Text> 
                                                    </View>
                                                    <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1]}>
                                                        {/* 活动奖品 */}
                                                        <Text style={styles.lotteryRecordTheadTd}>รางวัล</Text>
                                                    </View>
                                                    <View style={styles.lotteryRecordTheadTr}>
                                                        {/* 获奖状态 */}
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
                                                        Array.isArray(prizeList) && prizeList.length>0 && prizeList.map((v, i) => {
                                                            return <View style={[styles.lotteryRecordThead]} key={i}>
                                                                <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                                                    <Text style={styles.lotteryRecordTheadTd1}>{moment(v.applicationDate).format('YYYY-MM-DD HH:mm')}</Text> 
                                                                </View>
                                                                <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                                                    <Text style={styles.lotteryRecordTheadTd1}>{v.prizeName}</Text>
                                                                </View>
                                                                <View style={[styles.lotteryRecordTheadTr, styles.lotteryRecordTheadTr1, styles.lotteryRecordTheadTr2]}>
                                                                    <Text style={[styles.lotteryRecordTheadTd1, { color: PrizeStatus[`status${v.status}`]?.color }]}>{PrizeStatus[`status${v.status}`]?.text}</Text>
                                                                </View>
                                                            </View>
                                                        })
                                                    }
                                                </ScrollView>
                                            </View>
                                        </ImageBackground>
                                        :
                                        //暂无数据
                                        <ImageBackground
                                            resizeMode='stretch'
                                            style={styles.lotteryBottomContainer}
                                            source={require('./../../images/double11Lottery/bottomBg.png')}
                                        >
                                            <View style={styles.doublenoNoRecordbox}>
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.doublenoRecord1}
                                                    source={require('./../../images/double11Lottery/doublenoRecord2.png')}
                                                ></Image>
                                                <Text style={styles.doublenoNoRecordText}>ไม่มีข้อมูล</Text>
                                            </View>
                                        </ImageBackground>
                                }
                            </View>
                    }
                </View>
                
                <View>
                    <View style={{ alignItems: 'center', marginTop: 25 }}>
                    <ImageBackground
                                resizeMode='stretch'
                                style={{ width: (width*1.35),
                                    height: (width*1.35) * .09,
                                    alignItems: 'center',
                                    justifyContent: 'center'}}
                                source={require('./../../images/double11Lottery/panel.png')}
                            >
                                <Text style={{color:'#FFF38F',fontSize:14}}>วิธีการร่วมสนุก</Text>
                            </ImageBackground>
                        {/* <Image
                            resizeMode='stretch'
                            style={styles.lotteryHeadIcon1}
                            source={require('./../../images/double11Lottery/lotteryHeadIcon.png')}
                        ></Image> */}
                    </View>
                    <ImageBackground
                        resizeMode='stretch'
                        style={[styles.lotteryBottomContainer, { height: (width - 10) * .7 }]}
                        source={require('./../../images/double11Lottery/bottomBg.png')}
                    >
                        <View style={styles.lotterySteopContainer}>
                            {
                                LotteryStepInfor.map((v, i) => {
                                    return <View key={i} style={[styles.lotterySteopBox,{height:'100%'}]}>
                                            <Image
                                                style={[styles.lotterySteopImg, { width: v.width, height: v.height, marginBottom: v.marginBottom }]}
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
                                        style={[styles.lotteryStepBtnInforImg, { width: flag ? (width - 20 - 50) / 2.2 : (width - 20 - 70) }]}>
                                        <ImageBackground
                                            style={[styles.lotteryStepBtnInforImg, { width: flag ? (width - 20 - 50) / 2.2 : (width - 20 - 70) }]}
                                            resizeMode='stretch'
                                            source={require('./../../images/double11Lottery/lotteryBodyBtn.png')}
                                        >
                                            <Text style={{  textAlign: 'center', fontSize: 12 }}>{v.text}</Text>
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
        height: .36 * width,
        flexDirection: 'row',
        alignItems: 'flex-end',
        // marginBottom: 15
    },
    lotteryTimeContainer: {

    },
    lotteryTimeBox: {
        height: 40,
        width: width,
        paddingHorizontal:12,
        alignItems: 'center',
        justifyContent: 'center',
        // borderTopWidth: 1,
        // borderTopColor: '#EE980F',
        // borderBottomColor: '#EE980F',
        // borderBottomWidth: 1,
        marginBottom:20
    },
    lotteryTimeBoxText1: {
        color: '#FFF38F',
        textAlign: 'center',
        fontSize: 11
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
        textAlign: 'center'
    },
    lotteryResetTimeBox: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25
    },
    lotteryResetListTimeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 6
    },
    lotteryResetListTimeBox1: {
        //backgroundColor: '#00061A99',
        // borderWidth: 1,
        // borderColor: '#FFF',
        borderRadius: 6,
        width: 30,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 4
    },
    lotteryResetListTimeFrame:{
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
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
        marginTop: 0,
    },
    lotteryHeadIcon1: {
        width: width,
        height: .08 * width,
    },
    lotteryGiftContainer: {
        marginTop: 10
    },
    lotteryGiftBox: {
        width: width - 10,
        height: (width - 10) * .73,
        // marginHorizontal: 35,
        alignSelf:'center',
        // paddingHorizontal: 30,
        paddingLeft: 45,
        paddingRight: 45,
        paddingTop: 12,
        flexDirection: 'row',
        flexWrap: 'wrap',
        //backgroundColor: '#fff'
    },
    lotteryBottomContainer: {
        width: width - 10,
        height: (width - 10) * .62,
        marginHorizontal: 5,
        paddingHorizontal: 12,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    lotterySteopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lotterySteopBox: {
        alignItems: 'center',
        //justifyContent: 'center',
        width: (width - 20 - 40) / 3
    },
    lotterySteopImg: {
        width: 56,
        height: 56
    },
    lotterySteopText1: {
        color: '#FFFFFF',
        //fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10
    },
    lotterySteopText2: {
        color: '#FFFFFF',
        fontSize: 10,
        textAlign: 'center',
        width: (width - 120) / 3,
        flexWrap: 'wrap'
    },
    lotteryIconArrow: {
        height: 6,
        width: 26,
        position: 'absolute',
        right: -20,
        top:28,
    },
    lotteryStepBtnInforBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingHorizontal: 20
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
        fontSize: 14,
        marginTop: 25,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 60
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
        paddingTop: 25,
        width: width * .9,
        height: 1.03 * width * .9,
        alignItems: 'center',
    },
    lotteryModalHead: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:50
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
        fontSize: 18,
        fontWeight:'bold'
    },
    lotteryBodyText: {
        textAlign: 'center',
        color: '#FF0000',
        fontSize: 14,
        paddingHorizontal: 50,
        fontWeight: '500'
    },
    lotteryBodyBtnBox: {
        position: 'absolute',
        bottom: 100
    },
    lotteryBodyBtn: {
        width: (width * .7 * .75),
        height: (width * .7 * .75) * .15,
        alignItems: 'center',
        justifyContent: 'center',

    },
    lotteryBodyBtnText: {
        color: '#291900'
    },
    lotteryModalCloseBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 2,
        // borderColor: '#fff',
        // borderRadius: 1000,
        position: 'absolute',
        bottom: -20
    },
    lotteryModalCloseBtnText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    lotterModalText1Box: {
        position: 'absolute',
        bottom: '18%',
        paddingHorizontal: 60
    },
    lotterModalText1: {
        color: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: '#00050B80',
        elevation: 4,
        // fontSize:14,
        textAlign: 'center'
    },
    lotterModalText2: {
        color: '#FF0000',
        fontSize: 14,
        fontWeight:'bold'
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
        width: (width - 90) / 3,
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
        width: width - 10,
        height: (width - 10) * .92,
        marginHorizontal: 5,
        paddingHorizontal: 30,
        marginTop: 20,
        marginBottom: 40,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 40,
        paddingBottom: 85,
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
        width: width - 40,
        height: (width - 40) * .13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 25,
        paddingHorizontal: 20,
        backgroundColor:'#8D671076',
        borderWidth:1,
        borderRadius:25,
        borderColor:'#DE8C09'
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
    // lotteryNotOpenIconBox: {
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     backgroundColor: 'blue'
    // },
    lotteryNotOpenIcon: {
        width: 60,
        height: 60 * 1.15,
    },
    lotteryNotOpenIcon0: {
        marginLeft: 10,
        marginBottom:12* 0.5
        //marginTop: -width*0.05,
    },
    lotteryNotOpenIcon1: {
        marginLeft: 20,
        marginBottom:12* 0.5
        //marginTop: -width*0.05,
    },
    lotteryNotOpenIcon2: {
        marginLeft: 30,
        marginBottom:12* 0.5
        //marginTop: -width*0.05,
    },
    lotteryNotOpenIcon3: {
        marginLeft: -5,
        marginBottom:12* 0.3
        //marginTop: width*0.08
    },
    lotteryNotOpenIcon4: {
        marginLeft: 0,
        marginBottom:12* 0.3
        //marginTop: width*0.08
    },
    lotteryNotOpenIcon5: {
        marginLeft: 5,
        marginBottom:12* 0.3
        //marginTop: width*0.08
    },
    lotteryNotOpenIcon6: {
        marginLeft: 16,
        marginBottom:12* 0.3
        //marginTop: width*0.08
    },
    lotteryNotOpenIcon7: {
        marginLeft: 10,
        //marginTop: Platform.OS ? width*0.07: width*0.02
    },
    lotteryNotOpenIcon8: {
        marginLeft: 20,
        //marginTop: Platform.OS ? width*0.07: width*0.02
    },
    lotteryNotOpenIcon9: {
        marginLeft: 30,
        //marginTop: Platform.OS ? width*0.07: width*0.02
    },
    lotteryCanOpenIcon: {
        width: 75,
        height: 75,
        marginLeft: 15,
        transform: [
            {
                translateY: 12
            }
        ]
    },
    lotteryEndOpenIcon: {
        width: 70,
        height: 70,
        marginLeft: 0,
        marginTop: 10,
    },
    lotteryNotOpenIconWrap: {
        // alignItems: 'center',
    },
    lotteryNotOpenIconWrap1: {
        width: (width - 10 - 90) / 3
    },
    lotteryNotOpenIconWrap2: {
        width: (width - 10 - 90) / 4
    }
})