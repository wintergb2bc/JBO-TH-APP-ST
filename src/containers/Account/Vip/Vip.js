import React from 'react'
import { StyleSheet, Linking,Text, View, Image, Dimensions, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl, ImageBackground, Platform } from 'react-native'
import { Toast, Tabs, Progress } from 'antd-mobile-rn'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { VipIconImg, VipBanners, VipRules, VipRankInforData, VipDetailQuestion, PromotionVipDetailsRulesVip, VipDetailsInforLogout, VipReturnWaterData, VipDetailsInfor } from './VipData'
import VipLogoutDetail from './VipLogoutDetail'
import VipReturnWater1 from './VipReturnWater1'
import ModalDropdown from 'react-native-modal-dropdown'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')
import { getVipInforAction } from './../../../actions/VipInforAction'
const QQRegex = /^$|^[0-9]{4,15}$/;
const WCRegex = /^[a-zA-Z0-9@._-]*$/
const TabData = [
    {
        title: 'สิทธิพิเศษ VIP'  // title: 'VIP 特权'
    },
    {
        title: 'รายละเอียด' //title: 'VIP 详情'
    }
]

const ContactDetails = [
    {
        name: 'Line',
        id: ''
    }
]
const VipDetailsInforLogoutImg = [
    require('./../../../images/user/vip/vipdetaillogout1.png'),
    require('./../../../images/user/vip/vipdetaillogout2.png'),
    require('./../../../images/user/vip/vipdetaillogout3.png'),
    require('./../../../images/user/vip/vipdetaillogout4.png'),
    require('./../../../images/user/vip/vipdetaillogout5.png'),
    require('./../../../images/user/vip/vipdetaillogout6.png'),
]

const VipBgImg = [
    {
        vipBgImg: require('./../../../images/user/vip/vipbg1.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader1.png'),
        vipTextColor1: '#363636',

        vipBgColor1: '#EEEEEE',
        vipBgColor2: '#333333',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#292929'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg1.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader1.png'),
        vipTextColor1: '#363636',

        vipBgColor1: '#EEEEEE',
        vipBgColor2: '#333333',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#292929'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg1.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader1.png'),
        vipTextColor1: '#363636',

        vipBgColor1: '#EEEEEE',
        vipBgColor2: '#333333',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#292929'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg2.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader2.png'),
        vipTextColor1: '#69481e',

        vipBgColor1: '#E2C795',
        vipBgColor2: '#7C6436',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#69481D'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg2.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader2.png'),
        vipTextColor1: '#69481e',

        vipBgColor1: '#E2C795',
        vipBgColor2: '#7C6436',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#69481D'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg2.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader2.png'),
        vipTextColor1: '#69481e',

        vipBgColor1: '#E2C795',
        vipBgColor2: '#7C6436',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#69481D'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg2.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader2.png'),
        vipTextColor1: '#69481e',

        vipBgColor1: '#E2C795',
        vipBgColor2: '#7C6436',
        vipTextColor2: '#FFFFFF',
        promotionConditionMiddle: '#69481D'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg3.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader3.png'),
        vipTextColor1: '#ffc757',

        vipBgColor1: '#525252',
        vipBgColor2: '#333333',
        vipTextColor2: '#FFC758',
        promotionConditionMiddle: '#292929'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg3.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader3.png'),
        vipTextColor1: '#ffc757',

        vipBgColor1: '#525252',
        vipBgColor2: '#333333',
        vipTextColor2: '#FFC758',
        promotionConditionMiddle: '#292929'
    },
    {
        vipBgImg: require('./../../../images/user/vip/vipbg3.png'),
        vipLeader: require('./../../../images/user/vip/vipLeader3.png'),
        vipTextColor1: '#ffc757',

        vipBgColor1: '#525252',
        vipBgColor2: '#333333',
        vipTextColor2: '#FFC758',
        promotionConditionMiddle: '#292929'
    }
]
class VipContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabDataIndex: 0,
            promotionIndex: 0,
            promotionMoney: '',
            minPromotionMoney: '',
            //maxPromotionMoney: '',
            promotionMoneyErr: true,
            promotionBtnStatus: false,
            arrowStatus: true,
            vipIndex: 0,
            currentVipIndex: 0,
            refreshing: false,
            dropdownFlag: false,
            currentTime: '',
            inputFocusFlag: false,
            preferentialDatas: [],
            vipContent: [],
            vipLevel: null,
            activeSlide: 0,
            vipSuccessModalFlag: false,
            vipModalContentFlag: false,
            errorMessage: '',
            previewMessage: '',
            contactDetailsIndex: 0,
            contactDetails0: '',
            contactDetails1: '',
            isShowContactDetails: false,
            turnoverRequire: '',
            bonusGiven: '',
            isShowBonus: false,
            isShowLiveChatModal:false,
            liveChatUrl:null,
        }
        this.setTimeoutLiveChat = null
		this.willFocusSubscription =null;
    }

    componentDidMount() {
        if (ApiPort.UserLogin) {
            this.props.getVipInforAction()
            this.getPreferential()
        }
        this.getVip()
        this.getUser()

        //彈客服窗
       this.listenFocus()
       this.listenBlur()

    }

    listenFocus(){
        this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',() => {
                console.log('willFocus')
				this.setTimeoutLiveChat && clearTimeout(this.setTimeoutLiveChat)
			   //彈客服窗
			   if(!ApiPort.UserLogin){
				this.setTimeoutLiveChat = setTimeout(()=>{
					  this.getLiveChat()
				  }, 300000) 
			  }
			 }
		  );
    }

    listenBlur(){
        this.willFocusSubscription = this.props.navigation.addListener(
			'willBlur',() => {
                console.log('willBlur')
				this.setTimeoutLiveChat && clearTimeout(this.setTimeoutLiveChat)
			 }
		  );
    }

    getLiveChat(){
        fetchRequest(ApiPort.LiveChat+'Type=2&', "GET")
        .then((data) => {
            if(data?.isMatched){
                this.setState({
                    isShowLiveChatModal:true,
                    liveChatUrl:data.url
                })
            }
            console.log('vip LiveChat data',data)
        })
        .catch(() => {});
    }


    getUser() {
        if (!ApiPort.UserLogin) return
        fetchRequest(ApiPort.Member, 'GET').then(data => {
            let memberInfo = data.result.memberInfo
            let Contacts = memberInfo.Contacts
            let isHaveQQ = Boolean(Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'QQ'))
            let isHaveWeChat = Boolean(Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'WECHAT'))
            window.isHaveVipQQWeChat = (!isHaveQQ && !isHaveWeChat) ? true : false
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.vipInforData) {
            let rank = nextProps.vipInforData.currentLevelInfo.rank - 2
            let lastUpdatedDate = nextProps.vipInforData.currentLevelInfo.lastUpdatedDate
            this.setState({
                vipLevel: nextProps.vipInforData,
                vipIndex: rank < 0 ? 0 : rank,
                currentVipIndex: nextProps.vipInforData.currentLevelInfo.rank - 2,
                currentTime: (lastUpdatedDate.includes('T') && lastUpdatedDate.includes('.')) ? lastUpdatedDate.replace(/T/, ' ').split('.')[0] : lastUpdatedDate
            })
        }
    }

    getVip() {  //数据加载中
        Toast.loading('กำลังโหลด...', 1000)
        fetchRequest(ApiPort.Vip, 'GET').then(res => {
            Toast.hide()
            if (res) {
                const filterVip = res.filter(v => v.rank > 0 && v.rank < 12);
                console.log(filterVip)
                this.setState({
                    vipContent: filterVip
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getPreferential() {
        //Toast.loading('优惠加载中，请稍后...', 1000)
        fetchRequest(ApiPort.VipBonus, 'GET').then(res => {
            Toast.hide()
            if (res) {
                let bonusVip = res.filter(v => v.bonusType && v.bonusType.toLocaleUpperCase().includes('VIP'))
                this.setState({
                    preferentialDatas: bonusVip,
                    minPromotionMoney: bonusVip[0].minAccept,
                    // maxPromotionMoney: bonusVip[0].maxAccept
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    createPromotionList(item, i) {
        const { promotionIndex } = this.state
        return <TouchableOpacity style={styles.PromotionModalDropdownList}>
            <Text style={[styles.PromotionModalDropdownListText, { color: promotionIndex * 1 === i * 1 ? '#FFC758' : '#CCC' }]}>{item.title}</Text>
        </TouchableOpacity>
    }

    createContactDetailsList(item, i) {
        const { contactDetailsIndex } = this.state
        return <TouchableOpacity style={styles.PromotionModalDropdownList}>
            <Text style={[styles.PromotionModalDropdownListText, { color: contactDetailsIndex * 1 === i * 1 ? '#FFC758' : '#CCC' }]}>{item.name}</Text>
        </TouchableOpacity>
    }

    changePromotionIndex(index, v) {
        this.setState({
            promotionIndex: index,
            minPromotionMoney: v.minAccept,
            // maxPromotionMoney: v.maxAccept
        }, () => {
            this.changePromotionBtnStatus()
            this.getBonusCalculate(true)
        })
    }

    changePromotionMoney(value) {
        let promotionMoney = value.replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/^(\.*)(\d+)(\.?)(\d{0,2}).*$/g, '$2$3$4')
        this.setState({
            promotionMoney
        }, () => {
            this.changePromotionBtnStatus()
            this.getBonusCalculate(true)
        })
    }

    getBonusCalculate(flag) {
        this.setState({
            previewMessage: '',
            errorMessage: '',
            isShowBonus: false,
            bonusGiven: '0',
            turnoverRequire: '0'
        })
        const { promotionMoney, preferentialDatas, promotionIndex } = this.state
        if (flag) {
            if (!(promotionMoney >= this.state.minPromotionMoney)) return
        }
        let data = {
            "transactionType": "deposit",
            "bonusId": preferentialDatas[promotionIndex].id,
            "amount": promotionMoney,
            "wallet": preferentialDatas[promotionIndex].account,
            "couponText": "string"
        }
        Toast.loading(flag ? '' : 'กำลังดำเนินการถอน..', 1000)
        fetchRequest(ApiPort.BonusCalculate, 'POST', data).then(data => {
            Toast.hide()
            if (flag) {
                if (!data.inPlan) {
                    this.setState({
                        isShowBonus: true,
                        bonusGiven: data.bonusGiven,
                        turnoverRequire: data.turnoverRequire
                    })
                } else {
                    // Toast.fail(data.errorMessage)
                    this.setState({
                        vipModalContentFlag: true,
                        errorMessage: data.errorMessage
                    })
                }
            } else {
                if (!data.inPlan) {
                    Toast.success(data.previewMessage, 2)
                    this.setState({
                        previewMessage: data.previewMessage
                    })
                    setTimeout(() => {
                        this.submitMoneyPromotion()
                    }, 2000)
                    //
                } else {
                    this.setState({
                        vipModalContentFlag: true,
                        errorMessage: data.errorMessage
                    })
                }
            }
        }).catch(error => {
            Toast.hide()
        })
    }

    submitMoneyPromotion() {
        const { promotionIndex, promotionMoney, preferentialDatas, promotionMoneyErr } = this.state
        let params = {
            "blackBoxValue": Iovation,
            "e2BlackBoxValue": E2Backbox,
            "bonusID": preferentialDatas[promotionIndex].id,
            "amount": promotionMoney,
            "targetWallet": preferentialDatas[promotionIndex].account
        }
        fetchRequest(ApiPort.BonusApplications, 'POST', params).then(res => {
            if (res) {
                if (res.bonusResult.message === 'Success') {
                    Toast.success(res.message, 1.5)
                    this.setState({
                        // promotionMoney: '',
                        vipSuccessModalFlag: true,
                    })
                    return
                }
                if (res.bonusResult.message === 'Fail') {
                    Toast.fail(res.message, 1.5)
                    return
                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    changePromotionBtnStatus() {
        const { promotionIndex, promotionMoney, minPromotionMoney, maxPromotionMoney } = this.state
        let promotionMoneyErr = promotionMoney === '' ? true : ((minPromotionMoney * 1 <= promotionMoney * 1) && promotionMoney <= window.TotalBal)
        this.setState({
            promotionMoneyErr,
            promotionBtnStatus: Boolean((promotionIndex + '') && promotionMoney && (promotionMoney * 1) > 0) && promotionMoneyErr
        })
    }

    submitPromotion() {
        const { promotionBtnStatus, promotionIndex, promotionMoney, promotionMoneyErr, minPromotionMoney } = this.state
        if (!promotionBtnStatus) {
            if (promotionIndex === '') {
                Toast.fail('กรุณาเลือกโปรโมชั่น', 1.8)
                // Toast.fail('请选择优惠!', 1.8)
                return
            }
            if (promotionMoney === '') {
                Toast.fail('กรุณาใส่จำนวนเงิน!', 1.8)
                //Toast.fail('请输入金额!', 1.8)
                return
            }
            if (minPromotionMoney * 1 > promotionMoney * 1) {
                Toast.fail(`优惠最低范围:${minPromotionMoney}บาท`, 1.8)
                // Toast.fail(`优惠最低范围:${minPromotionMoney}元`, 1.8)
                return
            }
            if (window.TotalBal * 1 < promotionMoney * 1) {
                Toast.fail('ยอดเงินไม่เพียงพอ กรุณาฝากเงินก่อนทำการสมัคร', 1.5)
                // Toast.fail('钱包余额不足，请立即存款再做申请。', 1.5)
                return
            }
        }
        UMonEvent('Promo Application', 'Apply', 'Promotion_ VIPPage');
        this.getBonusCalculate()
    }

    changeArrowStatus(flag) {
        this.setState({
            arrowStatus: flag
        })
    }

    changeVipIconIndex(index) {
        this.setState({
            vipIndex: index
        })
    }

    changeDropdownFlag(flag) {
        this.setState({
            dropdownFlag: flag
        })
    }

    changeInputFocusFlag(flag) {
        this.setState({
            inputFocusFlag: flag
        })
    }

    renderBannerPage(item) {
        return <Image source={item.item.img} key={item.index} resizeMode='stretch' style={styles.vipBannerImg}></Image>
    }

    renderVipPage(item) {
        const { currentVipIndex, vipIndex, vipLevel } = this.state
        const levelName = this.state.vipContent[vipIndex].levelName
        const [levelName1, levelName2] = levelName.split(' ')
        let progress = 0
        if (ApiPort.UserLogin && currentVipIndex >= vipIndex && Boolean(vipLevel)) {
            let depositProgress = ((vipLevel.currentLevelInfo.depositProgress >= vipLevel.nextLevelInfo.depositRequirement ? vipLevel.nextLevelInfo.depositRequirement : vipLevel.currentLevelInfo.depositProgress) / vipLevel.nextLevelInfo.depositRequirement)
            let turnoverProgress = ((vipLevel.currentLevelInfo.turnoverProgress >= vipLevel.nextLevelInfo.turnoverRequirement ? vipLevel.nextLevelInfo.turnoverRequirement : vipLevel.currentLevelInfo.turnoverProgress) / vipLevel.nextLevelInfo.turnoverRequirement)
            progress = levelName2 < 10 ? parseInt(((depositProgress + turnoverProgress) / 2) * 100) : '100'
        }



        return <ImageBackground source={VipBgImg[vipIndex].vipBgImg} key={item.index} resizeMode='stretch' style={[styles.vipRankBox]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Image source={VipBgImg[vipIndex].vipLeader} resizeMode='stretch' style={{ width: 30, height: 30 }}></Image>
                <Text style={{ color: VipBgImg[vipIndex].vipTextColor1, marginLeft: 2 }}>ระดับปัจจุบัน</Text>
                {/* <Text style={{ color: VipBgImg[vipIndex].vipTextColor1, marginLeft: 2 }}>当前等级</Text> */}
            </View>

            <Text style={[styles.vipRankText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>{levelName1} <Text style={{ fontSize: 14 }}>{levelName2}</Text></Text>
            <View style={styles.vipRnkIconBox}>
                <Image source={{ uri: item.item }} resizeMode="stretch" style={[styles.vipRnkIcon]}></Image>
            </View>

            {
                ApiPort.UserLogin && currentVipIndex >= vipIndex && Boolean(vipLevel) && <View style={styles.vipProgressBox}> 
                    <Text style={[styles.vipProgressText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>ระดับของฉัน</Text>
                    {/* <Text style={[styles.vipProgressText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>我的等级进度</Text> */}
                    <Text style={[styles.vipProgressText, { position: 'absolute', top: 0, left: 65, color: VipBgImg[vipIndex].vipTextColor1 }]}>{currentVipIndex > vipIndex ? '100%' : (currentVipIndex < vipIndex ? '0%' : `${progress}%`)}</Text>
                    <Progress
                        percent={currentVipIndex > vipIndex ? 100 : (currentVipIndex < vipIndex ? 0 : progress)}
                        position='normal'
                        unfilled={false}
                        style={{ height: 8, backgroundColor: '#4C4C4C', overflow: 'hidden', borderRadius: 40, marginHorizontal: 5 }}
                        barStyle={{ backgroundColor: '#CCCCCC', height: 60 }}
                    />
                    <Text style={[styles.vipProgressText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>{levelName2 < 10 ? (`VIP ${levelName2 * 1 + 1} รางวัล`) : null}</Text>
                </View>
            }
        </ImageBackground>
    }

    toThousands(num) { //每隔3位，用逗号隔开
        let str = num + ''
        if (num) {
            if (str.includes('.')) {
                let numArr = str.split('.')
                return numArr[0].replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,') + '.' + numArr[1]
            } else {
                return str.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
            }
        } else {
            return '0'
        }
    }

    submitContactDetails() {
        const { contactDetails0 } = this.state
        const lineIDTest = /^([A-Za-z0-9._\-]{1,30})$/;
        
        if(lineIDTest.test(contactDetails0) != true){
            Toast.fail("กรุณากรอกLine ID ให้ถูกต้อง : ความยาวไม่เกิน 18 และไม่มีช่องว่าง");
            return;
        }
        // if (contactDetails1 && !WCRegex.test(contactDetails1)) {
        //     Toast.fail('请您填写正确的微信号！', 2)
        //     return
        // }
        let messengerDetails = [{
            "Contact": contactDetails0,
            "ContactTypeId": "9",
        }]
        
        const params = {
            "addresses": {
                "nationId": 1
            },
            "nationality": 1,
            "language": "th-th",
            "messengerDetails": messengerDetails,
            "wallet": 'MAIN'
        }
        Toast.loading('โปรดรอสักครู่...', 2000)
        fetchRequest(ApiPort.PUTMemberlistAPI + '?', 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                window.isHaveVipQQWeChat = false
                Toast.success(res.result.Message, 2)
                this.setState({
                    isShowContactDetails: true,
                    isHaveWeChat: false,
                    contactDetails0: '',
                    contactDetails1: ''
                })
            } else {
                Toast.fail('คำขอล้มเหลวโปรดลองอีกครั้ง', 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    initNum(num) {
        return (num.split('%')[0] * 1000 / 1000) + '%'
    }

    render() {
        const { isShowLiveChatModal,liveChatUrl,isShowVipModal, isShowBonus, bonusGiven, turnoverRequire, isShowContactDetails, contactDetails0, contactDetails1, contactDetailsIndex, previewMessage, errorMessage, vipModalContentFlag, vipSuccessModalFlag, tabDataIndex, promotionMoneyErr, currentVipIndex, vipLevel, vipContent, minPromotionMoney, maxPromotionMoney, activeSlide, preferentialDatas, inputFocusFlag, currentTime, dropdownFlag, refreshing, vipIndex, promotionIndex, promotionMoney, promotionBtnStatus, arrowStatus } = this.state
        window.reloadgapge1 = () => {
            this.setState({})
        }
        return <View style={styles.viewContainer}>

            <Modal
                animationType="fade"
                transparent={true}
                visible={ApiPort.UserLogin && window.vipInfor.isDisplay}
            >
                <View style={[styles.vipModal]}>
                    <View style={styles.vipModalContainer}>
                        <TouchableOpacity style={styles.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
                            window.vipInfor.isDisplay = false
                            window.reloadgapge1 && window.reloadgapge1()
                            window.reloadgapge2 && window.reloadgapge2()
                            this.setState({})
                        }}>
                            <Text style={styles.closeBtnText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.vipBottomContainer}>
                            {
                                window.vipInfor.isDefaultLevel
                                    ?
                                    <View style={[styles.vipCircle, { backgroundColor: '#FFC758' }]}>
                                        <Text style={styles.vipCircleText}>!</Text>
                                    </View>
                                    :
                                    <Image source={{ uri: window.vipInfor.imageUrl }} resizeMode='stretch' style={styles.VipIconImg}></Image>
                            }

                            <Text style={styles.vipTextInfor}>{window.vipInfor.message}</Text>
                            {
                                window.vipInfor.isDefaultLevel
                                    ?
                                    <TouchableOpacity style={[styles.closeBottomBtn, { backgroundColor: '#FFC758' }]} onPress={() => {
                                        window.vipInfor.isDisplay = false
                                        Actions.depositTx()
                                        window.reloadgapge1 && window.reloadgapge1()
                                        window.reloadgapge2 && window.reloadgapge2()
                                        this.setState({})
                                    }}> 
                                                                                                   {/* 立即存款 */}
                                        <Text style={[styles.closeBottomBtnText, { color: '#332811' }]}>ฝากตอนนี้</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.closeBottomBtn} onPress={() => {
                                        window.vipInfor.isDisplay = false
                                        window.reloadgapge1 && window.reloadgapge1()
                                        window.reloadgapge2 && window.reloadgapge2()
                                        this.setState({})
                                    }}>
                                        <Text style={styles.closeBottomBtnText}>รับทราบ</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </Modal>



            <Modal
                animationType="fade"
                transparent={true}
                visible={vipModalContentFlag}
            >
                <View style={styles.vipModal}>
                    <View style={[styles.vipSuccessContainer, { width: width - 20, paddingHorizontal: 25 }]}>
                        <View style={styles.successCircle}>
                            <Text style={styles.successCircleText}>{'!'}</Text>
                        </View>
                        <Text style={styles.vipModalText1}>{'ขออภัยการสมัครล้มเหลว'}</Text>
                        <Text style={styles.vipModalText2}>{errorMessage}</Text>
                        <TouchableOpacity style={styles.vipModalSuccessBtn} onPress={() => {
                            this.setState({
                                vipModalContentFlag: false,
                                promotionMoney: '',
                                errorMessage: '',
                                promotionBtnStatus: false,
                                previewMessage: '',
                            })
                        }}>
                            <Text style={styles.vipModalSuccessBtnText}>รับทราบ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={vipSuccessModalFlag}
            >
                <View style={styles.vipModal}>
                    <View style={[styles.vipSuccessContainer, { width: width - 20, paddingHorizontal: 40 }]}>
                        <View style={styles.successCircle}>
                            <Image source={require('./../../../images/user/vip/viprightmodal.png')} resizeMode='stretch' style={{ width: 40, height: 40 }}></Image>

                            {/* <Text style={styles.successCircleText}>{'✓'}</Text> */}
                        </View>
                        {/* {恭喜您，申请成功} */}
                        <Text style={styles.vipModalText1}>{'ขอแสดงความยินดี การยืนยันสำเร็จ'}</Text>
                        <Text style={styles.vipModalText2}>{previewMessage}</Text>
                        <TouchableOpacity style={styles.vipModalSuccessBtn} onPress={() => {
                            this.setState({
                                vipSuccessModalFlag: false,
                                promotionMoney: '',
                                promotionBtnStatus: false,
                                previewMessage: '',
                                errorMessage: ''
                            })
                        }}>
                            <Text style={styles.vipModalSuccessBtnText}>รับทราบ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isShowContactDetails}
            >
                <View style={styles.vipModal}>
                    <View style={[styles.vipSuccessContainer, styles.contactDetailsModal]}>
                        <TouchableOpacity
                            style={styles.contactDetailsModalX}
                            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
                            nPress={() => {
                                this.setState({
                                    isShowContactDetails: false
                                })
                            }}
                        >
                            <Text style={styles.contactDetailsModalXText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.successCircle}>
                            <Image source={require('./../../../images/user/vip/viprightmodal.png')} resizeMode='stretch' style={{ width: 40, height: 40 }}></Image>
                        </View>
                                                         {/* 恭喜您，提交成功 */}
                        <Text style={styles.vipModalText1}>ขอแสดงความยินดี การสมัครสำเร็จแล้ว</Text>
                        <Text style={styles.vipModalText2}>VIP ฝ่ายบริการลูกค้าระดับพิเศษ จะติดต่อคุณในเร็ว ๆ นี้</Text>
                        <TouchableOpacity style={[styles.vipModalSuccessBtn, styles.contactDetailsModalBtn]} onPress={() => {
                            this.setState({
                                isShowContactDetails: false
                            })
                        }}>
                             {/* รับทราบ */}
                            <Text style={[styles.vipModalSuccessBtnText, styles.contactDetailsModalBtnText]}>รับทราบ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={!ApiPort.UserLogin && isShowLiveChatModal}
            >
                <View style={[styles.vipModal]}>
                    <View style={styles.liveChatModalContainer}>
                        <TouchableOpacity style={styles.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
                            this.setState({
                                isShowLiveChatModal:false
                            })
                        }}>
                            <Text style={styles.closeBtnText}>X</Text>
                        </TouchableOpacity>
                        <View style={styles.vipBottomContainer}>
                            <Image source={require('./../../../images/liveChat_img.png')}  resizeMode='stretch' style={styles.liveChatIconImg}></Image>
                            <Text style={styles.liveChatTextInfor}>หากต้องการความช่วยเหลือ 
ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง</Text>
                            <TouchableOpacity style={styles.liveChatBottomBtn} onPress={() => {
                                 UMonEvent("CS", "Click", "CS_Invitation_VIPPage");
                                 Linking.openURL(liveChatUrl);
                                 this.setState({
                                    isShowLiveChatModal:false
                                })
                            }}>
                                <Text style={styles.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Tabs
                tabs={TabData}
                tabBarBackgroundColor='#0A0A0A'
                tabBarInactiveTextColor='#CCCCCC'
                tabBarActiveTextColor='#1AFF00'
                tabBarUnderlineStyle={{
                    backgroundColor: '#00E62E'
                }}
                swipeable={Platform.OS === 'ios'}
                onChange={(tab, index) => {
                    if (index === 0) {
                        UMonEvent('VIP Page', 'Click', 'VIPInfo_VIPPage');
                    } else if (index === 1) {
                        UMonEvent('VIP Page', 'Click', 'PromoTnC_VIPPage');
                    }
                }}
            >
                <ImageBackground
                    style={{ width }}
                    resizeMode='stretch'
                    source={require('./../../../images/user/vip/vipbg.png')}
                >
                    <ScrollView
                        contentContainerStyle={{}}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            Boolean(vipContent.length > 0) && <View style={styles.viewContainerPadding}>
                                <View>
                                    <Carousel
                                        data={vipContent.map(v => v.imageUrl)}
                                        renderItem={this.renderVipPage.bind(this)}
                                        onBeforeSnapToItem={index => {
                                            this.setState({ vipIndex: index })
                                        }}
                                        sliderWidth={width}
                                        itemWidth={width * .8}
                                        firstItem={currentVipIndex}
                                        initialScrollIndex={currentVipIndex}
                                        getItemLayout={(data, index) => (
                                            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
                                        )}
                                        //loop={true}
                                        //loopClonesPerSide={0}
                                        inactiveSlideScale={.9}
                                        inactiveSlideOpacity={0.8}
                                    />
                                    <Pagination
                                        dotsLength={vipContent.length}
                                        activeDotIndex={vipIndex}
                                        containerStyle={{ paddingVertical: 1 }}
                                        dotStyle={styles.vipDotStyle}
                                        inactiveDotStyle={styles.vipInactiveDotStyle}
                                        inactiveDotOpacity={1}
                                        inactiveDotScale={0.6}
                                    />
                                </View>

                                {
                                    (ApiPort.UserLogin ? (Boolean(vipLevel)) : true) && <View>
                                        <View style={{ paddingHorizontal: 26, marginBottom: 15 }}>
                                            <Text style={[styles.promotionTime, { position: 'absolute', left: 5 }]}>บันทึก:</Text>
                                            <View style={{paddingLeft:25}}>
                                            <Text style={[styles.promotionTime,{paddingBottom:5}]}>1. สมาชิกจะต้องทำเงื่อนไขครบ [ฝาก] และ [เทิร์นโอเวอร์] ที่ระบุ เพื่อเลื่อนขั้นไปยังระดับถัดไป</Text>
                                            <Text style={styles.promotionTime}>2. VIP ระดับ 8,9 และ 10 จะได้รับการพิจารณาและเรียนเชิญจากทาง JBO เท่านั้น ไม่สามารถเลื่อนระดับโดยอัตโนมัติได้ หากได้รับการพิจารณาเลื่อนระดับ เจ้าหน้าที่ฝ่าย VIP จะมีการติดต่อกลับโดยเร็วที่สุด</Text>
                                            </View>
                                            {/* <Text style={styles.promotionTime}>1. 会员只需完成目前所显示的【存】与 【流】的进度即可在隔天晋升下一个等级。</Text>
                                            <Text style={styles.promotionTime}>2. VIP 8，VIP 9 及 VIP 10 的等级为特邀和不会被自动晋升，请耐心等待 。</Text> */}
                                        </View>
                      
                                        <View style={{ backgroundColor: '#222222' }}>
                                            {
                                                (ApiPort.UserLogin && currentVipIndex === vipIndex) && <View style={{ alignItems: 'flex-end', paddingVertical: 8, paddingRight: 10 }}>
                                                    <Text style={{ fontSize: 12, color: '#979797' }}>การอัปเดตข้อมูล: {currentTime}</Text>
                                                </View>
                                            }
                                            <View style={[styles.promotionCondition, { backgroundColor: VipBgImg[vipIndex].vipBgColor2 }]}>
                                                <View style={[styles.promotionConditionLeft, { backgroundColor: VipBgImg[vipIndex].vipBgColor1 }]}> 
                                                   <Text style={[styles.promotionConditionLeftText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>ฝากเงิน</Text>
                                                    {/* <Text style={[styles.promotionConditionLeftText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>存</Text> */}
                                                </View>
                                                {
                                                    ApiPort.UserLogin && currentVipIndex >= 0
                                                        ?
                                                        currentVipIndex === vipIndex ?
                                                            vipLevel.currentLevelInfo.depositProgress >= vipLevel.nextLevelInfo.depositRequirement
                                                                ?
                                                                <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                    <View style={styles.promotionConditionTop}> 
                                                                        <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>เงินฝากสะสม 29 วันที่ผ่านมา</Text>
                                                                        {/* <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>29 天前至今已累积存款</Text> */}
                                                                        {/* <Text style={[styles.promotionConditionText2, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipLevel.nextLevelInfo.depositRequirement}</Text> */}
                                                                    </View>
                                                                    <View style={styles.promotionConditionMiddleWrap}>
                                                                        <View style={styles.promotionConditionMiddle}>
                                                                            <View style={[styles.promotionConditionMiddleInner, { width: (width - 200) * (vipLevel.currentLevelInfo.depositProgress / vipLevel.nextLevelInfo.depositRequirement) }]}></View>
                                                                        </View>
                                                                        <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipLevel.currentLevelInfo.depositProgress}</Text>/{vipLevel.nextLevelInfo.depositRequirement}</Text>
                                                                    </View>
                                                                    <View style={styles.promotionConditionBottom}>
                                                                        <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} บาทก่อน {vipLevel.nextLevelInfo.depositRequirement} สะสมเงินฝาก</Text>
                                                                        {/* <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipLevel.nextLevelInfo.depositRequirement} 存款</Text> */}
                                                                    </View>
                                                                </View>
                                                                :
                                                                <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                    <View style={styles.promotionConditionTop}>
                                                                         <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>เงินฝากสะสม 29 วันที่ผ่านมา</Text>
                                                                        {/* <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>29 天前至今已累积存款</Text> */}
                                                                        {/* <Text style={[styles.promotionConditionText2, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipLevel.nextLevelInfo.depositRequirement}</Text> */}
                                                                    </View>
                                                                    <View style={styles.promotionConditionMiddleWrap}>
                                                                        <View style={styles.promotionConditionMiddle}>
                                                                            <View style={[styles.promotionConditionMiddleInner, { width: (width - 200) * (vipLevel.currentLevelInfo.depositProgress / vipLevel.nextLevelInfo.depositRequirement) }]}></View>
                                                                        </View>
                                                                        <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipLevel.currentLevelInfo.depositProgress}</Text>/{vipLevel.nextLevelInfo.depositRequirement}</Text>
                                                                    </View>
                                                                    <View style={styles.promotionConditionBottom}>
                                                                    <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} บาทก่อน {vipLevel.nextLevelInfo.depositRequirement} สะสมเงินฝาก</Text>
                                                                        {/* <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipLevel.nextLevelInfo.depositRequirement} 存款</Text> */}
                                                                    </View>
                                                                </View>
                                                            :
                                                            currentVipIndex > vipIndex
                                                                ?
                                                                <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                    <View style={styles.promotionConditionTop}>
                                                                        <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>เงินฝากสะสม {vipContent[vipIndex].requalificationPeriod} วันที่ผ่านมา</Text>
                                                                        <Text style={[styles.promotionConditionText2, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                        {/* <Text style={{color: '#FFC758', fontSize: 20}}>✓</Text> */}
                                                                        <Image source={require('./../../../images/user/vip/vipright1.png')} resizeMode='stretch' style={{ width: 24, height: 24 }}></Image>
                                                                    </View>
                                                                    {/* <View style={styles.promotionConditionMiddleWrap}>
                                                                        <View style={[styles.promotionConditionMiddle, { backgroundColor: '#E2C795' }]}></View>
                                                                        <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipContent[vipIndex].depositRequirement}</Text>/{vipContent[vipIndex].depositRequirement}</Text>
                                                                    </View> */}
                                                                    {/* <View style={[styles.promotionConditionBottom]}>
                                                                        <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipContent[vipIndex].depositRequirement} 存款</Text>
                                                                    </View> */}
                                                                </View>
                                                                :
                                                                <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                    <View style={styles.promotionConditionTop}>
                                                                        <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>เงินฝากสะสม {vipContent[vipIndex].requalificationPeriod} วันที่ผ่านมา</Text>
                                                                        <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                    </View>
                                                                </View>
                                                        :
                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                            <View style={styles.promotionConditionTop}>
                                                                <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดเงินฝากสะสมภายใน {vipContent[vipIndex].requalificationPeriod} วัน</Text>
                                                                <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                            </View>
                                                        </View>
                                                }
                                            </View>

                                            <View style={[styles.promotionCondition, { backgroundColor: VipBgImg[vipIndex].vipBgColor2 }]}>
                                                <View style={[styles.promotionConditionLeft, { backgroundColor: VipBgImg[vipIndex].vipBgColor1 }]}>
                                                    {/* 流 */}
                                                    <Text style={[styles.promotionConditionLeftText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>ยอดหมุนเวียน</Text>
                                                </View>
                                                {
                                                    ApiPort.UserLogin
                                                        ?
                                                        <View>
                                                            {
                                                                currentVipIndex === vipIndex && currentVipIndex >= 0
                                                                    ?
                                                                    vipLevel.currentLevelInfo.turnoverProgress >= vipLevel.nextLevelInfo.turnoverRequirement
                                                                        ?
                                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                            <View style={styles.promotionConditionTop}>
                                                                                <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>เงินฝากสะสม 29 วันที่ผ่านมา</Text>
                                                                                {/* <Text style={[styles.promotionConditionText2, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipLevel.nextLevelInfo.turnoverRequirement}</Text> */}
                                                                            </View>
                                                                            <View style={styles.promotionConditionMiddleWrap}>
                                                                                <View style={styles.promotionConditionMiddle}>
                                                                                    <View style={[styles.promotionConditionMiddleInner, { width: (width - 200) * (vipLevel.currentLevelInfo.turnoverProgress / vipLevel.nextLevelInfo.turnoverRequirement) }]}></View>
                                                                                </View>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipLevel.currentLevelInfo.turnoverProgress}</Text>/{vipLevel.nextLevelInfo.turnoverRequirement}</Text>
                                                                            </View>
                                                                            <View style={styles.promotionConditionBottom}>
                                                                            <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} บาทก่อน  {vipLevel.nextLevelInfo.turnoverRequirement} สะสมยอดเดิมพันหมุนเวียน</Text>
                                                                                {/* <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipLevel.nextLevelInfo.turnoverRequirement} 流水</Text> */}
                                                                            </View>
                                                                        </View>
                                                                        :
                                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                            <View style={styles.promotionConditionTop}>
                                                                                <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>เงินฝากสะสม 29 วันที่ผ่านมา</Text>
                                                                                {/* <Text style={[styles.promotionConditionText2, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipLevel.nextLevelInfo.turnoverRequirement}</Text> */}
                                                                            </View>
                                                                            <View style={styles.promotionConditionMiddleWrap}>
                                                                                <View style={styles.promotionConditionMiddle}>
                                                                                    <View style={[styles.promotionConditionMiddleInner, { width: (width - 200) * (vipLevel.currentLevelInfo.turnoverProgress / vipLevel.nextLevelInfo.turnoverRequirement) }]}></View>
                                                                                </View>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipLevel.currentLevelInfo.turnoverProgress}</Text>/{vipLevel.nextLevelInfo.turnoverRequirement}</Text>
                                                                            </View>
                                                                            <View style={styles.promotionConditionBottom}>
                                                                            <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} บาทก่อน {vipLevel.nextLevelInfo.turnoverRequirement} สะสมยอดเดิมพันหมุนเวียน</Text>
                                                                                {/* <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipLevel.nextLevelInfo.turnoverRequirement} 流水</Text> */}
                                                                            </View>
                                                                        </View>
                                                                    :
                                                                    currentVipIndex > vipIndex
                                                                        ?
                                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                            <View style={styles.promotionConditionTop}>
                                                                                <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดหมุนเวียนสะสม {vipContent[vipIndex].requalificationPeriod} วันที่ผ่านมา</Text>
                                                                                {/* <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipContent[vipIndex].requalificationPeriod} 天前至今已累积流水</Text> */}
                                                                                <Text style={[styles.promotionConditionText2, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipContent[vipIndex].turnoverRequirement}</Text>
                                                                                <Image source={require('./../../../images/user/vip/vipright1.png')} resizeMode='stretch' style={{ width: 24, height: 24 }}></Image>
                                                                            </View>
                                                                            {/* <View style={styles.promotionConditionMiddleWrap}>
                                                                                <View style={[styles.promotionConditionMiddle, { backgroundColor: '#E2C795' }]}></View>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipContent[vipIndex].turnoverRequirement}</Text>/{vipContent[vipIndex].turnoverRequirement}</Text>
                                                                            </View> */}
                                                                            {/* <View style={styles.promotionConditionBottom}>
                                                                                <Text style={[styles.promotionConditionBottomText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipContent[vipIndex].turnoverRequirement} 流水</Text>
                                                                            </View> */}
                                                                        </View>
                                                                        :
                                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                            <View style={styles.promotionConditionTop}>
                                                                                <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดหมุนเวียนสะสม {vipContent[vipIndex].requalificationPeriod} วันที่ผ่านมา</Text>
                                                                                <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipContent[vipIndex].turnoverRequirement}</Text>
                                                                            </View>
                                                                        </View>
                                                            }
                                                        </View>
                                                        :
                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                            <View style={styles.promotionConditionTop}>
                                                                <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดหมุนเวียนสะสมภายใน {vipContent[vipIndex].requalificationPeriod} วัน</Text>
                                                                {/* <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipContent[vipIndex].requalificationPeriod} 天内达累积流水</Text> */}
                                                                <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>≥ {vipContent[vipIndex].turnoverRequirement}</Text>
                                                            </View>
                                                        </View>
                                                }
                                            </View>

                                            <View style={[styles.promotionCondition, { backgroundColor: VipBgImg[vipIndex].vipBgColor2, marginBottom: 0 }]}>
                                                <View style={[styles.promotionConditionLeft, { backgroundColor: VipBgImg[vipIndex].vipBgColor1 }]}>
                                                    <Text style={[styles.promotionConditionLeftText, { color: VipBgImg[vipIndex].vipTextColor1 }]}>รักษาระดับ</Text>
                                                    {/* <Text>保</Text> */}
                                                </View>
                                                {
                                                    ApiPort.UserLogin && currentVipIndex >= 0
                                                        ?
                                                        currentVipIndex === vipIndex
                                                            ?
                                                            <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                <View style={styles.promotionConditionTop}>
                                                                    <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}> รักษายอดเงินฝากและยอดหมุนเวียนภายใน {vipContent[vipIndex].requalificationPeriod} วัน</Text>
                                                                </View>
                                                                <View>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 100 }}>
                                                                        <View style={{ width: (width - 100) / 2.1, marginTop: 5 }}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                            {/* 存款 */}
                                                                                <Text style={{ color: VipBgImg[vipIndex].vipTextColor2 }}>ฝากเงิน</Text>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipLevel.currentLevelInfo.requalificationDepositProgress}</Text>/{vipLevel.requalificationInfo.depositRequirement}</Text>
                                                                            </View>
                                                                            <View style={[styles.promotionConditionMiddle, { width: (width - 100) / 2.1, marginVertical: 5 }]}>
                                                                                <View style={[styles.promotionConditionMiddleInner, { width: ((width - 100) / 2.1) * vipLevel.currentLevelInfo.requalificationDepositProgress / vipLevel.requalificationInfo.depositRequirement }]}></View>
                                                                            </View>
                                                                        </View>

                                                                        <View style={{ width: (width - 100) / 2.1, marginTop: 5 }}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                            {/* 流水 */}
                                                                                <Text style={{ color: VipBgImg[vipIndex].vipTextColor2 }}>ยอดหมุนเวียน</Text>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipLevel.currentLevelInfo.requalificationTurnoverProgress}</Text>/{vipLevel.requalificationInfo.turnoverRequirement}</Text>
                                                                            </View>
                                                                            <View style={[styles.promotionConditionMiddle, { width: (width - 100) / 2.1, marginVertical: 5 }]}>
                                                                                <View style={[styles.promotionConditionMiddleInner, { width: ((width - 100) / 2.1) * vipLevel.currentLevelInfo.requalificationTurnoverProgress / vipLevel.requalificationInfo.turnoverRequirement }]}></View>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    <View style={[styles.promotionConditionBottom]}>
                                                                        <Text style={[styles.promotionConditionBottomText, { fontSize: 12, color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipLevel.requalificationInfo.expiredAt.split('T')[0]} บาทก่อน {vipLevel.requalificationInfo.depositRequirement} ฝากเงิน {vipLevel.requalificationInfo.turnoverRequirement} ยอดหมุนเวียน</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            :
                                                            currentVipIndex > vipIndex
                                                                ?
                                                                <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                    <View style={styles.promotionConditionTop}>
                                                                        <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>รักษายอดเงินฝากและยอดหมุนเวียนภายใน {vipContent[vipIndex].requalificationPeriod} วัน</Text>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, paddingRight: 30 }}>
                                                                        <Text style={[styles.depositRequirementText_left, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ฝากเงิน ≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                        <Text style={[styles.depositRequirementText_right, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดหมุนเวียน ≥ {vipContent[vipIndex].turnoverRequirement}</Text>
                                                                    </View>

                                                                    <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, height: 90, justifyContent: 'center' }}>
                                                                        <Image source={require('./../../../images/user/vip/vipright1.png')} resizeMode='stretch' style={{ width: 24, height: 24 }}></Image>
                                                                    </View>

                                                                    {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 100 }}>
                                                                        <View style={[{ width: (width - 100) / 2.1, marginTop: 5 }]}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                                <Text style={{ color: VipBgImg[vipIndex].vipTextColor2 }}>存款</Text>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipContent[vipIndex].depositRequirement}</Text>/{vipContent[vipIndex].depositRequirement}</Text>
                                                                            </View>
                                                                            <View style={[styles.promotionConditionMiddle, { width: (width - 100) / 2.1, marginVertical: 5, backgroundColor: '#E2C795' }]}></View>
                                                                        </View>
                                                                        <View style={{ width: (width - 100) / 2.1, marginTop: 5 }}>
                                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                                <Text style={{ color: VipBgImg[vipIndex].vipTextColor2 }}>流水</Text>
                                                                                <Text style={[styles.promotionConditionMiddleInnerText]}><Text style={[styles.promotionConditionMiddleInnerText1]}>{vipContent[vipIndex].turnoverRequirement}</Text>/{vipContent[vipIndex].turnoverRequirement}</Text>
                                                                            </View>
                                                                            <View style={[styles.promotionConditionMiddle, { width: (width - 100) / 2.1, marginVertical: 5, backgroundColor: '#E2C795' }]}></View>
                                                                        </View>
                                                                    </View> */}

                                                                    {/* <View style={[styles.promotionConditionBottom]}>
                                                                        <Text style={[styles.promotionConditionBottomText,
                                                                        { fontSize: 12, color: VipBgImg[vipIndex].vipTextColor2 }]}>
                                                                            {vipLevel.requalificationInfo.expiredAt.split('T')[0]} 前累计 {vipContent[vipIndex].depositRequirement} 存款 {vipContent[vipIndex].turnoverRequirement} 流水</Text>
                                                                    </View> */}
                                                                </View>
                                                                :
                                                                <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                                    <View style={styles.promotionConditionTop}> 
                                                                    <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>รักษายอดเงินฝากและยอดหมุนเวียนภายใน {vipContent[vipIndex].requalificationPeriod} วัน</Text>
                                                                        {/* <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipContent[vipIndex].requalificationPeriod} 天内达保级存款与流水</Text> */}
                                                                    </View>
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                                        <Text style={[styles.depositRequirementText_left, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ฝากเงิน ≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                        <Text style={[styles.depositRequirementText_right, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดหมุนเวียน ≥ {vipContent[vipIndex].turnoverRequirement}</Text>
                                                                        {/* <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>存款 ≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                        <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>流水 ≥ {vipContent[vipIndex].turnoverRequirement}</Text> */}
                                                                    </View>
                                                                </View>
                                                        :
                                                        <View style={[styles.promotionConditionRight, { justifyContent: 'center' }]}>
                                                            <View style={styles.promotionConditionTop}>
                                                            <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>รักษายอดเงินฝากและยอดหมุนเวียนภายใน {vipContent[vipIndex].requalificationPeriod} วัน</Text>
                                                                {/* <Text style={[styles.promotionConditionText1, { color: VipBgImg[vipIndex].vipTextColor2 }]}>{vipContent[vipIndex].requalificationPeriod} 天内达保级存款与流水</Text> */}
                                                                <Text style={styles.promotionConditionText2}>  </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                               
                                                               <Text style={[styles.depositRequirementText_left, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ฝากเงิน ≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                <Text style={[styles.depositRequirementText_right, { color: VipBgImg[vipIndex].vipTextColor2 }]}>ยอดหมุนเวียน ≥ {vipContent[vipIndex].turnoverRequirement}</Text>
                                                                {/* <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>存款 ≥ {vipContent[vipIndex].depositRequirement}</Text>
                                                                <Text style={[styles.depositRequirementText, { color: VipBgImg[vipIndex].vipTextColor2 }]}>流水 ≥ {vipContent[vipIndex].turnoverRequirement}</Text> */}
                                                            </View>
                                                        </View>
                                                }
                                            </View>
                                            <TouchableOpacity style={{ paddingVertical: 15, alignItems: 'center' }} onPress={() => { Actions.PromotionVipDetails({ vipIndex: vipIndex }) }}>
                                                <Text style={{ color: '#FFC758' }}>ตรวจสอบรายละเอียด</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }

                                <View style={{ marginVertical: 30 }}>
                                    {
                                        ApiPort.UserLogin
                                            ?
                                            (
                                                (preferentialDatas.length > 0 && currentVipIndex * 1 === vipIndex * 1)
                                                    ?
                                                    <View>
                                                        <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
                                                                                {/* 优惠申请 */}
                                                            <Text style={styles.questionTitle}>การเข้าร่วมโปรโมชั่น</Text>
                                                        </ImageBackground>
                                                        <View style={{ backgroundColor: '#222222', paddingVertical: 20, paddingHorizontal: 10 }}>
                                                            <View style={styles.promotionList}>
                                                                <Text style={[styles.promotionListText,{fontSize:11}]}>โปรโมชั่น：</Text>
                                                                <ModalDropdown
                                                                    animated={true}
                                                                    defaultValue={promotionIndex === '' ? '请选择优惠' : preferentialDatas[promotionIndex].title}
                                                                    options={preferentialDatas}
                                                                    renderRow={this.createPromotionList.bind(this)}
                                                                    onSelect={this.changePromotionIndex.bind(this)}
                                                                    style={[styles.PromotionModalDropdown]}
                                                                    onDropdownWillShow={this.changeDropdownFlag.bind(this, true)}
                                                                    onDropdownWillHide={this.changeDropdownFlag.bind(this, false)}
                                                                    dropdownStyle={[styles.PromotionDropdownStyle]}
                                                                >
                                                                    <View style={[styles.PromotionModalDropdownTextWrap]}>
                                                                        <Text style={[styles.PromotionModalDropdownText]}>{promotionIndex === '' ? '请选择优惠' : preferentialDatas[promotionIndex].title}</Text>
                                                                        <View style={[styles.PromotionModalDropdownArrow, { marginTop: dropdownFlag ? -8 : 8, borderBottomColor: dropdownFlag ? '#FFC758' : 'transparent', borderTopColor: dropdownFlag ? 'transparent' : '#FFC758' }]}></View>
                                                                    </View>
                                                                </ModalDropdown>
                                                            </View>
                                                            <View style={styles.promotionList}>
                                                                      {/* 金额 */}
                                                                <Text style={styles.promotionListText}>ยอดเงินฝาก：</Text>
                                                                <TextInput
                                                                    value={promotionMoney}
                                                                    keyboardType={'numeric'}
                                                                    onChangeText={this.changePromotionMoney.bind(this)}
                                                                    placeholder={'กรุณากรอกจำนวนเงิน'}
                                                                    //placeholder={'请输入金额'}
                                                                    placeholderTextColor="#ccc"
                                                                    onFocus={this.changeInputFocusFlag.bind(this, true)}
                                                                    onBlur={this.changeInputFocusFlag.bind(this, false)}
                                                                    style={[styles.PromotionModalDropdown, styles.promotionListInput, { borderColor: inputFocusFlag ? '#FFC758' : '#666' }]} />
                                                            </View>
                                                            {
                                                                !promotionMoneyErr && <View style={[styles.promotionList, { marginBottom: 0 }]}>
                                                                    {/* 金额 */}
                                                                    <Text style={[styles.promotionListText, { color: 'transparent' }]}>จำนวน：</Text>
                                                                    <View>
                                                                        {               //最低申请金额
                                                                            !promotionMoneyErr && (minPromotionMoney * 1 > promotionMoney * 1) && <Text style={{ color: 'red', width: width - 90 }}>ยอดสมัครขั้นต่ำ {minPromotionMoney} บาท</Text>
                                                                        }
                                                                        {   //钱包余额不足，请立即存款再做申请
                                                                            !promotionMoneyErr && (window.TotalBal * 1 < promotionMoney * 1) && <Text style={{ color: 'red', width: width - 90 }}>ยอดเงินไม่เพียงพอ กรุณาฝากเงินก่อนทำการสมัคร。</Text>
                                                                        }
                                                                    </View>
                                                                </View>
                                                            }

                                                            {
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                                    {/* 金额 */}
                                                                    {/*<Text style={[styles.promotionListText, { color: 'transparent' }]}>จำนวน：</Text>*/}
                                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30, flex: 1 }}>
                                                                          {/* 申请金额 */}
                                                                        <Text style={styles.promotionMoneyInforText}>จำนวนการขอรับโบนัส : {this.toThousands(promotionMoney)}</Text>
                                                                        <Text style={styles.promotionMoneyInforText}>โบนัส : {this.toThousands(bonusGiven)}</Text>
                                                                        <Text style={styles.promotionMoneyInforText}>ยอดหมุนเวียนที่ต้องทำ : {this.toThousands(turnoverRequire)}</Text>
                                                                        {/* <Text style={styles.promotionMoneyInforText}>可得彩金 : {this.toThousands(bonusGiven)}</Text>
                                                                        <Text style={styles.promotionMoneyInforText}>所需流水 : {this.toThousands(turnoverRequire)}</Text> */}
                                                                    </View>
                                                                </View>
                                                            }

                                                            <View>
                                                                <View style={[styles.promotionMoneyInfor, { marginBottom: 10, marginTop: 5 }]}>
                                                                        {/* 优惠详情 */}
                                                                    <Text style={[styles.promotionMoneyInforText, { color: '#fff', fontSize: 15 }]}>รายละเอียดโปรโมชั่น</Text>
                                                                    {/* <TouchableOpacity onPress={() => { Actions.VipDetails({ vipIndex: vipIndex }) }}>
                                                                        <Text style={styles.promotionMoneyInforText1}>VIP专属再存红利详情</Text>
                                                                    </TouchableOpacity> */}
                                                                </View>
                                                                <View style={styles.promotionMoneyInfor}>
                                                                    <View style={styles.promotionMoneyInforView1}>
                                                                        <Text style={styles.promotionMoneyInforText}>
                                                                                {/* 最低申请金额 */}
                                                                            <Text style={styles.promotionMoneyRight}>✓</Text>จำนวนขั้นต่ำในการสมัคร: {`${'\n'}`}
                                                                            <Text style={[styles.promotionMoneyRightNone]}>✓</Text> {preferentialDatas[promotionIndex].minAccept}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={styles.promotionMoneyInforView2}>
                                                                        <Text style={styles.promotionMoneyInforText}>
                                                                        {/* 红利比例 */}
                                                                            <Text style={styles.promotionMoneyRight}>✓</Text> อัตราโบนัส: {`${'\n'}`}
                                                                            <Text style={[styles.promotionMoneyRightNone]}>✓</Text> {preferentialDatas[promotionIndex].givingRate}%</Text>
                                                                    </View>
                                                                    <View style={styles.promotionMoneyInforView3}>
                                                                        <Text style={styles.promotionMoneyInforText}>
                                                                        {/* 游戏品台 : */}
                                                                            <Text style={styles.promotionMoneyRight}>✓</Text> รายชื่อเกม: {`${'\n'}`}
                                                                            <Text style={[styles.promotionMoneyRightNone]}>✓</Text> <Text style={{ fontSize: 11 }}>{preferentialDatas[promotionIndex].targetAccountCategory}</Text>
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.promotionMoneyInfor}>
                                                                    <View style={styles.promotionMoneyInforView1}>
                                                                        <Text style={styles.promotionMoneyInforText}>
                                                                        {/* 最高彩金 */}
                                                                            <Text style={styles.promotionMoneyRight}>✓</Text> โบนัสสูงสุด: {`${'\n'}`}
                                                                            <Text style={[styles.promotionMoneyRightNone]}>✓</Text> {preferentialDatas[promotionIndex].maxAccept}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={styles.promotionMoneyInforView2}>
                                                                        <Text style={styles.promotionMoneyInforText}>
                                                                        {/* 申请次数 */}
                                                                            <Text style={styles.promotionMoneyRight}>✓</Text> จำนวนการใช้งาน: {`${'\n'}`}
                                                                            <Text style={[styles.promotionMoneyRightNone]}>✓</Text> {preferentialDatas[promotionIndex].targetApplyTime}
                                                                        </Text>
                                                                    </View>
                                                                    <View style={styles.promotionMoneyInforView3}>
                                                                        <Text style={styles.promotionMoneyInforText}>
                                                                        {/* 流水倍数 */}
                                                                            <Text style={styles.promotionMoneyRight}>✓</Text> ยอดหมุนเวียน: {`${'\n'}`}
                                                                            <Text style={[styles.promotionMoneyRightNone]}>✓</Text> {preferentialDatas[promotionIndex].releaseValue}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <TouchableOpacity style={[styles.promotionBtn, { backgroundColor: promotionBtnStatus ? '#FFC758' : '#333333' }]} onPress={this.submitPromotion.bind(this)}>
                                                                <Text style={[styles.promotionBtnText, { color: promotionBtnStatus ? '#332811' : '#CCCCCC' }]}>เข้าร่วมทันที</Text>
                                                                {/* 立即申请 */}
                                                            </TouchableOpacity>


                                                            <TouchableOpacity style={{ flexDirection: 'row', marginTop:16, height: 40, alignItems: 'center', backgroundColor: '#333333', borderRadius: 4, justifyContent: 'center' }}
                                                                              onPress={() => {
                                                                                  UMonEvent('VIP Page', 'Click', 'ReloadPromoTnC_ VIPPage');
                                                                                  Actions.VipDetails({ vipIndex: vipIndex })
                                                                              }}>
                                                                <Text style={{ color: '#FFC758' }}>โบนัสเงินเพิ่ม</Text>
                                                                {/* <Text style={{ color: '#FFC758' }}>专属再存红利</Text> */}
                                                                <View style={{ width: 16, height: 16, backgroundColor: '#666666', borderRadius: 1000, alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
                                                                    <Text style={{ color: '#0A0A0A' }}>></Text>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity style={{ flexDirection: 'row',marginTop:16, height: 40, alignItems: 'center', backgroundColor: '#333333', borderRadius: 4, justifyContent: 'center' }}
                                                                              onPress={() => {
                                                                                  UMonEvent('VIP Page', 'Click', 'RebatePromoTnC_ VIPPage');
                                                                                  Actions.VipReturnWater({ vipIndex: vipIndex - 1 }) 
                                                                              }}>
                                                                <Text style={{ color: '#FFC758' }}>โบนัสเงินคืน</Text>
                                                                {/* <Text style={{ color: '#FFC758' }}>专属返水比例</Text> */}
                                                                <View style={{ width: 16, height: 16, backgroundColor: '#666666', borderRadius: 1000, alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}>
                                                                    <Text style={{ color: '#0A0A0A' }}>></Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                    :
                                                    null
                                            )
                                            :
                                            <View></View>
                                    }
                                </View>

                                {
                                    ApiPort.UserLogin && <View>
                                        <View style={{ marginBottom: 20 }}>
                                            <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
                                                <Text style={styles.questionTitle}>รางวัลระดับถัดไป</Text>
                                                {/* <Text style={styles.questionTitle}>晋级奖励</Text> */}
                                            </ImageBackground>
                                            <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={require('./../../../images/user/vip/vipreward1.png')}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{VipRankInforData[vipIndex].upgradeGift}</Text>
                                                            <Text style={styles.promotionText1}>อัพเกรดโบนัส</Text>
                                                            {/* <Text style={styles.promotionText1}>升级礼金</Text> */}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={require('./../../../images/user/vip/vipreward2.png')}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{VipRankInforData[vipIndex].relegationGifts}</Text>
                                                            <Text style={styles.promotionText1}>รักษาระดับโบนัส</Text>
                                                            {/* <Text style={styles.promotionText1}>保级礼金</Text> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View>
                                            <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
                                                <Text style={styles.questionTitle}>โบนัสเติมเงินพิเศษ VIP </Text>
                                                {/* <Text style={styles.questionTitle}>VIP 专属返水比例</Text> */}
                                            </ImageBackground>

                                            <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[1]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipDetailsInfor[vipIndex][1])}</Text>
                                                            <Text style={[styles.promotionText1,{fontSize:11}]}>อีสปอร์ต/กีฬา (รายวัน)</Text>
                                                            {/* <Text style={styles.promotionText1}>电竞/体育（每日）</Text> */}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[2]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipDetailsInfor[vipIndex][5])}</Text>
                                                            <Text style={styles.promotionText1}>คาสิโนสด（รายวัน）</Text>
                                                            {/* <Text style={styles.promotionText1}>真人 （每日）</Text> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* ? VipDetailsInforLogoutImg vipIndex */}
                                            <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[3]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipDetailsInfor[vipIndex][9])}</Text>
                                                            <Text style={styles.promotionText1}>P2P（รายวัน）</Text>
                                                            {/* <Text style={styles.promotionText1}>棋牌 （每日）</Text> */}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg, { height: 16 }]} resizeMode='stretch' source={VipDetailsInforLogoutImg[4]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipDetailsInfor[vipIndex][13])}</Text>
                                                            <Text style={styles.promotionText1}>สล็อต（รายวัน）</Text>
                                                            {/* <Text style={styles.promotionText1}>电玩 （每日）</Text> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[5]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipReturnWaterData[vipIndex][5])}</Text>
                                                            
                                                            <Text style={styles.promotionText1}>คีโน （รายวัน）</Text> 
                                                        </View>
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>
                                        

                                        <View>
                                            <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
                                                <Text style={styles.questionTitle}>ระดับส่วนลดพิเศษสำหรับ VIP </Text>
                                                {/* <Text style={styles.questionTitle}>VIP 专属返水比例</Text> */}
                                            </ImageBackground>

                                            <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[1]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipReturnWaterData[vipIndex][1])}</Text>
                                                            <Text style={[styles.promotionText1,{fontSize:11}]}>อีสปอร์ต/กีฬา (รายวัน)</Text>
                                                            {/* <Text style={styles.promotionText1}>电竞/体育（每日）</Text> */}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[2]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipReturnWaterData[vipIndex][2])}</Text>
                                                            <Text style={styles.promotionText1}>คาสิโนสด（รายวัน）</Text>
                                                            {/* <Text style={styles.promotionText1}>真人 （每日）</Text> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* ? VipDetailsInforLogoutImg vipIndex */}
                                            <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[3]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipReturnWaterData[vipIndex][3])}</Text>
                                                            <Text style={styles.promotionText1}>P2P（รายวัน）</Text>
                                                            {/* <Text style={styles.promotionText1}>棋牌 （每日）</Text> */}
                                                        </View>
                                                    </View>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg, { height: 16 }]} resizeMode='stretch' source={VipDetailsInforLogoutImg[4]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipReturnWaterData[vipIndex][4])}</Text>
                                                            <Text style={styles.promotionText1}>สล็อต（รายวัน）</Text>
                                                            {/* <Text style={styles.promotionText1}>电玩 （每日）</Text> */}
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            {/* <View style={[styles.promotionBox, styles.promotionBox1]}>
                                                <View style={styles.promotionBottomBox}>
                                                    <View style={[styles.promotionBottom]}>
                                                        <View style={styles.imgCircle}>
                                                            <Image style={[styles.detailImg]} resizeMode='stretch' source={VipDetailsInforLogoutImg[5]}></Image>
                                                        </View>
                                                        <View>
                                                            <Text style={styles.promotionText2}>{this.initNum(VipReturnWaterData[vipIndex][5])}</Text>
                                                            
                                                            <Text style={styles.promotionText1}>คีโน （รายวัน）</Text> 
                                                        </View>
                                                    </View>
                                                </View>
                                            </View> */}
                                        </View>
                                    </View>
                                }
                            </View>
                        }
                    </ScrollView>
                </ImageBackground>

                <ScrollView
                    contentContainerStyle={{}}
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
                        <View style={{ alignItems: 'flex-end', marginTop: 0, marginBottom: 30 }}>
                            <VipLogoutDetail vipIndex={vipIndex}></VipLogoutDetail>
                        </View>

                        <View style={{ alignItems: 'flex-end', marginTop: 0, marginBottom: 30 }}>
                            <VipReturnWater1 vipIndex={vipIndex}></VipReturnWater1>
                        </View>


                        <View style={[styles.vipTextBox]}>
                            <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={[styles.questionTitleBox, { marginBottom: 30 }]}>
                                <Text style={styles.questionTitle}>คำถามที่พบบ่อย</Text>
                            </ImageBackground>
                            {
                                VipDetailQuestion.map((v, i) => {
                                    return <View style={styles.questionBox} key={i}>
                                        <View style={styles.questionImgBox}>
                                            <Image source={v.img} resizeMode='stretch' style={styles.questionImg}></Image>
                                        </View>
                                        <View style={styles.questionTipBox}>
                                            <Text style={styles.questionTip}>{v.title}</Text>
                                        </View>
                                        <Text style={styles.questionText}>{v.text}</Text>
                                    </View>
                                })
                            }
                        </View>
                        <View style={styles.vipTextBox}>
                            <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
                                <Text style={styles.questionTitle}>ข้อตกลงและเงื่อนไข</Text>
                            </ImageBackground>
                            {
                                PromotionVipDetailsRulesVip.map((v, i) => {
                                    return <View style={styles.vipDetailsRuleBox}>
                                        <View style={styles.ruleCircle}>
                                            <Text style={styles.ruleCircleText}>{i + 1}</Text>
                                        </View>
                                        {
                                            v.title.length > 0 && <Text key={i} style={styles.ruleText1}>{v.title}</Text>
                                        }
                                        {
                                            v.textWrap.map((v1, i1) => {
                                                return <Text key={i1} style={styles.ruleText}>{v1}</Text>
                                            })
                                        }
                                    </View>
                                })
                            }
                        </View>
                    </View>
                </ScrollView>
            </Tabs>
        </View>
    }
}

export default Vip = connect(
    (state) => {
        console.log(state)
        return {
            vipInforData: state.vipInforData
        }
    }, (dispatch) => {
        return {
            getVipInforAction: () => dispatch(getVipInforAction())
        }
    }
)(VipContainer)

const styles = StyleSheet.create({
    contactDetailsBox: {
        alignItems: 'center',
        backgroundColor: '#222222',
        marginBottom: 15,
        paddingBottom: 15
    },
    contactDetailsModal: {
        width: width * .9,
        paddingHorizontal: 40,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#FFC758',
        shadowColor: '#FFC75880',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 4,
    },
    contactDetailsModalXText: {
        color: '#fff',
        fontSize: 20
    },
    contactDetailsModalX: {
        position: 'absolute',
        right: 15,
        top: 15
    },
    contactDetailsModalBtn: {
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#FFC758'
    },
    contactDetailsModalBtnText: {
        color: '#FFC758',
        //fontWeight: 'bold'
    },
    contactDetailsHeadBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
    },
    contactDetailsHeadBoxText: {
        color: '#FFC758',
        fontWeight: 'bold',
        marginHorizontal: 22
    },
    contactDetailsBoxText2: {
        color: '#CCCCCC',
        fontSize: 13,
        marginBottom: 10
    },
    vipProgressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        justifyContent: 'space-between',
        zIndex: 10000,
        position: 'absolute',
        bottom: 0,
        left: 15,
        right: 15
    },
    vipProgressText: {
        color: '#363636',
        fontSize: 10
    },
    tabBar: {
        width,
        flexDirection: 'row'
    },
    imgCircle: {
        width: 36,
        height: 36,
        borderRadius: 100,
        backgroundColor: '#F6DEAC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    detailImg: {
        width: 24,
        height: 24
    },
    tabBarBox: {
        width: width * .5,
        height: 50,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vipRight: {
        width: 32,
        height: 26,
        position: 'absolute',
        right: 10
    },
    depositRequirementText: {
        color: '#CCCCCC',
        fontSize: 15,
        fontWeight: 'bold',
    },
    depositRequirementText_left: {
        color: '#CCCCCC',
        fontSize: 15,
        //fontWeight: 'bold',
        lineHeight: 25,
        flex: 1,
        textAlign: 'left'
    },
    depositRequirementText_right: {
        color: '#CCCCCC',
        fontSize: 15,
        //fontWeight: 'bold',
        lineHeight: 25,
        flex: 1,
        textAlign: 'right'
    },
    vipRankOverly: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: '#0A0A0A',
    },
    vipRnkIconBox: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        width: .8 * width * .6,
        zIndex: 10
    },
    vipRnkIcon: {
        width: width * .25,
        height: width * .25,
        // marginBottom: 5,
        transform: [{ scale: 1.6 }],
        borderRadius: 4,
        shadowOffset: { left: 4, right: 4, top: 4, bottom: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 50,
        shadowColor: "#818181",
        elevation: 4,
        opacity: .5
    },
    vipRankBox: {
        marginBottom: 30,
        marginTop: 25,
        width: .8 * width,
        height: 140,
        borderRadius: 6,
        overflow: 'hidden',
        padding: 15,
        position: 'relative'
    },
    vipRankText: {
        color: '#363636',
        //fontWeight: 'bold',
        fontSize: 24
    },
    vipIconBox: {
        flexDirection: 'row',
        paddingBottom: 25,
        paddingTop: 20
    },
    vipCircleText: {
        color: '#000',
        fontSize: 50,
        fontWeight: 'bold'
    },
    vipCircle: {
        backgroundColor: '#0BACFF',
        width: 60,
        height: 60,
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center'
    },
    okBtnText: {
        color: '#00B324'
    },
    okBtn: {
        borderWidth: 1,
        borderColor: '#00B324',
        backgroundColor: '#000'
    },
    depositBtnText: {
        color: '#fff'
    },
    btnCommon: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        width: width * .28
    },
    depositBtn: {
        backgroundColor: '#00B324',
    },
    bottomBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * .6
    },
    closeBottomBtn: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#FFC758',
        width: width * .5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeBottomBtnText: {
        color: '#FFC758'
    },
    vipTextInfor: {
        color: '#fff',
        marginTop: 20,
        marginBottom: 35
    },
    vipBottomContainer: {
        alignItems: 'center'
    },
    VipIconImg: {
        width: 66,
        height: 66
    },
    vipModal: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    vipSuccessContainer: {
        backgroundColor: '#222222',
        width: width * .9,
        alignItems: 'center',
        paddingTop: 30,
        borderRadius: 4
    },
    successCircleText: {
        fontWeight: 'bold',
        color: '#222222',
        fontSize: 46
    },
    vipModalText1: {
        color: '#fff',
        //fontWeight: 'bold',
        fontSize: 16,
        marginTop: 25,
        marginBottom: 20
    },
    vipModalText2: {
        color: '#CCCCCC',
        textAlign: 'center'
    },
    vipModalSuccessBtn: {
        backgroundColor: '#FFC758',
        height: 40,
        borderRadius: 4,
        width: width - 140,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    vipModalSuccessBtnText: {
        color: '#222222'
    },
    successCircle: {
        backgroundColor: '#FFC758',
        width: 90,
        height: 90,
        borderRadius: 10000,
        justifyContent: 'center',
        alignItems: 'center'
    },
    vipModalContainer: {
        width: width * .8,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#FFC758',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: "#FFC75880",
        elevation: 4,
        position: 'relative',
        paddingTop: 25,
        paddingBottom: 40
    },
    closeBtn: {
        position: 'absolute',
        right: 12,
        top: 10,
        zIndex: 100
    },
    closeBtnText: {
        color: '#fff',
        fontSize: 18
    },
    viewContainer: {
        backgroundColor: '#0A0A0A',
        flex: 1
    },
    viewContainerPadding: {
        paddingLeft: 10,
        paddingRight: 10
    },
    promotionTimeLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#444444',
        paddingBottom: 15,
        marginTop: 15,
        marginBottom: 5
    },
    promotionTime: {
        color: '#fff',
        //fontWeight: 'bold',
        lineHeight: 20,
        fontSize: 13
    },
    promotionConditionBottomText: {
        color: '#CCCCCC'
    },
    promotionConditionMiddleWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 100,
        height: 12,
        alignItems: 'center',
        marginVertical: 8
    },
    promotionConditionMiddle: {
        position: 'relative',
        justifyContent: 'center',
        backgroundColor: '#292929',
        borderRadius: 20,
        height: 12,
        width: width - 200,
        overflow: 'hidden'
    },
    promotionConditionMiddleInner: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: '#E2C795',
        height: 12,
        left: 0,
        top: 0,
        bottom: 0
    },
    promotionConditionMiddleInnerText: {
        color: '#CCCCCC',
        fontSize: 12,
        justifyContent: 'center',
        zIndex: 20
    },
    promotionConditionMiddleInnerText1: {
        color: '#fff',
    },
    promotionConditionText1: {
        color: '#CCCCCC'
    },
    promotionConditionText2: {
        color: '#fff',
        fontSize: 16
    },
    promotionConditionTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    promotionConditionRight: {
        justifyContent: 'space-between',
        height: 80,
        width: width - 100,
        marginHorizontal: 10
    },
    promotionCondition: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        backgroundColor: '#333333'
    },
    promotionConditionLeft: {
        width: 60,
        height: 90,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    promotionConditionLeftText: {
        fontSize: 20,
        //fontWeight: 'bold',
        color: '#363636',
        textAlign:'center',
    },
    promotionBtn: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginTop: 20,
    },
    promotionBtnText: {
        fontSize: 15
    },
    promotionMoneyInfor: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // height: 36,
        alignItems: 'center'
    },
    promotionMoneyInforView1: {
        width: (width - 20) * .333333,
    },
    promotionMoneyInforView2: {
        width: (width - 20) * .333333,
    },
    promotionMoneyInforView3: {
        width: (width - 20) * .333333,
    },
    promotionMoneyRight: {
        color: '#FFC758'
    },
    promotionMoneyRightNone: {
        color: '#222222',
        opacity: 0,
        display: 'none'
    },
    promotionMoneyInforText: {
        color: '#CCCCCC',
        fontSize: 12
    },
    promotionMoneyInforText1: {
        color: '#FFC758',
        textDecorationLine: 'underline'
    },
    promotionList: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40
    },
    promotionListText: {
        color: '#FFC758',
    },
    promotionListInput: {
        paddingLeft: 10,
        paddingRight: 10,
        color: '#CCCCCC'
    },
    PromotionModalDropdown: {
        height: 40,
        borderRadius: 4,
        marginTop: 8,
        borderWidth: 1,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 4,
        fontSize: 14,
        flex: 1,
    },
    PromotionDropdownStyle: {
        marginTop: 10,
        width: width - 90,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
        backgroundColor: '#000'
    },
    PromotionModalDropdownTextWrap: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    PromotionModalDropdownList: {
        //height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexWrap: 'wrap',
        paddingVertical: 4
    },
    PromotionModalDropdownListText: {
        color: '#fff'
    },
    PromotionModalDropdownText: {
        fontSize: 13,
        color: '#CCC'
    },
    PromotionModalDropdownArrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    promotionTop: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    promotionTopText: {
        color: '#fff',
        fontSize: 15
    },
    promotionBox: {
        marginBottom: 15
    },
    promotionBox1: {

    },
    promotionBox2: {
        borderColor: '#333333',
        backgroundColor: '#333333',
    },
    promotionBottomBox: {
        height: 66,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative'
    },
    promotionBottom: {
        // justifyContent: 'center',
        alignItems: 'center',
        width: (width - 20) / 2.1,
        backgroundColor: '#292929',
        flexDirection: 'row',
        paddingLeft: 15
    },
    promotionLine: {
        position: 'absolute',
        width: 1,
        height: 60,
        left: (width - 20) / 2,
        top: 0
    },
    promotionLine1: {
        backgroundColor: '#00B324',
    },
    promotionLine2: {
        backgroundColor: '#333333',
    },

    promotionText1: {
        color: '#CCC',
        fontSize: 13
    },
    promotionText2: {
        color: '#FFC758',
        //fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 17
    },
    questionImgBox: {
        top: -18,
        position: 'absolute',
        zIndex: 10,
        width: 45,
        height: 45,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#D7BB89',
        backgroundColor: '#332811',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questionImg: {
        width: 25,
        height: 25,
    },
    questionBox: {
        marginBottom: 30,
        backgroundColor: '#222222',
        borderBottomWidth: 1,
        borderBottomColor: '#38342C',
        paddingBottom: 20,
        alignItems: 'center',
    },
    vipTextBox: {
        marginBottom: 10,
    },
    questionTitleBox: {
        width,
        height: 60,
        marginHorizontal: -10,
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
    questionTipBox: {
        paddingTop: 25,
        paddingBottom: 10,
        backgroundColor: '#F6DEAC',
        marginBottom: 20,
        width: width - 20
    },
    questionTip: {
        color: '#332811',
        lineHeight: 22,
        fontSize: 16,
        textAlign: 'center',
        //fontWeight: 'bold'
    },
    questionText: {
        paddingHorizontal: 10,
        marginBottom: 6,
        lineHeight: 22,
        color: '#CCCCCC',
        textAlign: 'center'
    },
    ruleText: {
        color: '#ccc',
        lineHeight: 22,
        marginBottom: 10
    },
    vipBannerImg: {
        width,
        height: .334 * width
    },
    vipBanners: {
        width,
    },
    vipDotStyle: {
        backgroundColor: "#E2C795",
        position: 'relative',
        top: -15,
        width: 8,
        height: 8,
        borderRadius: 100,
        marginLeft: 0,
        marginRight: 0
    },
    vipInactiveDotStyle: {
        width: 8,
        height: 8,
        borderRadius: 100,
        marginLeft: 0,
        marginRight: 0,
        backgroundColor: "#292929"
    },
    ruleCircle: {
        width: 26,
        height: 26,
        borderRadius: 5,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#FFC758',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0
    },
    ruleCircleText: {
        color: '#FFC758',
        fontWeight: 'bold',
        fontSize: 16
    },
    vipDetailsRuleBox: {
        paddingLeft: 38,
    },
    ruleText1: {
        color: '#F5F5F5',
        //fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    liveChatModalContainer: {
        width: width * .8,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: "#00B32480",
        elevation: 4,
        position: 'relative',
        paddingTop: 25,
        paddingBottom: 40
    },
    liveChatIconImg: {
        width: 56,
        height: 60
    },
    liveChatTextInfor: {
        color: '#fff',
        marginTop: 24,
        marginBottom: 40,
        marginHorizontal:32,
        lineHeight:24,
        textAlign:'center'
    },
    liveChatBottomBtn: {
        backgroundColor: '#00B324',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#00B324',
        width: width * .5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    liveChatBottomBtnText: {
        color: '#F5F5F5'
    },
	liveChatModal:{
		width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        alignItems: 'center',
        justifyContent: 'center'
	},
	closeBtn: {
        position: 'absolute',
        right: 12,
        top: 10,
        zIndex: 100
    },
    closeBtnText: {
        color: '#fff',
        fontSize: 18
    },
	modalBottomContainer: {
        alignItems: 'center'
    },
})
