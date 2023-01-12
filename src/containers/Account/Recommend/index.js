import React from 'react'
import { RefreshControl, StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity, Dimensions, Image, PermissionsAndroid, CameraRoll, Platform, Alert, Clipboard, TouchableHighlight } from 'react-native'
import { Actions, Reducer } from 'react-native-router-flux'
import { Toast, Tabs, Progress } from 'antd-mobile-rn'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import { connect } from 'react-redux'
import QRCode from 'react-native-qrcode'
import QRCodeA from 'react-native-qrcode-svg'
const { width, height } = Dimensions.get('window')
import * as Animatable from 'react-native-animatable'
const AnimatableView = Animatable.View
import Share from 'react-native-share'
import ViewShot from 'react-native-view-shot'
import Carousel, { Pagination } from "react-native-snap-carousel"
const TabData = [
    {
       title:'ตรวจสอบสถานะ',
        //title: '推荐进度',
        pik: 'Progress_RAF'
    },
    {
        // title: '推荐详情',
        title: 'รายละเอียด',
        pik: 'Details_RAF'
    }
]
const RecommendDataStyle = {
    RecommendDataStyle1: {
        color: '#F5F5F5',
        lineHeight: 18,
        flexWrap: 'wrap',
        fontSize: 13,
    },
    RecommendDataStyle2: {
        color: '#00B324',
        lineHeight: 18,
        flexWrap: 'wrap',
        fontSize: 13
    }
}
 
const RecommendData = {
    RecommendRule: {
        title: 'เงื่อนไขและข้อบังคับ',
        img: require('./../../../images/user/recommend/recommend1.png'),
        recommendModalFlag: 'RecommendRule',
        pik: 'TnC_RAF',
        textArr: [
            <Text style={RecommendDataStyle.RecommendDataStyle1}>1ู้ที่ถูกแนะนำ จะต้องสมัคร และเล่นเป็นครั้งแรกบนเว็บไซต์นี้</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>ผู้ถูกแนะนำ จะต้องสมัครด้วย IP และที่อยู่อาศัยอื่น ซึ่งไม่ตรงกับผู้แนะนำ</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>ผู้ถูกแนะนำ จะต้องสมัครเป็นสมาชิกภายใต้ลิงก์การแนะนำของคุณเท่านั้น</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>ผู้ถูกแนะนำ จะต้องตรวจสอบเบอร์มือถือ และอีเมลให้ถูกต้อง</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>เฉพาะสมาชิกที่กรอกเบอร์มือถือที่ถูกต้องเท่านั้น จึงจะมีสิทธิ์ได้รับรางวัล สมาชิกสามารถอัปเดต และยืนยันข้อมูลได้ใน "โปรไฟล์ส่วนตัว"</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>การเดิมพันที่ผิดปกติ หรือพฤติกรรมการเก็งกำไร จะถูกตัดสิทธิ์การเข้าร่วมโปรโมชั่นนี้ทันทีที่ตรวจพบ</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>โปรโมชั่นนี้จำกัดเฉพาะกับผู้เล่นที่มี 1 บัญชีเท่านั้น ที่อยู่อาศัย อีเมล เบอร์มือถือ การชำระเงิน (บัตรเดบิต / บัตรเครดิต/หมายเลขบัญชีธนาคารเดียวกัน) ที่อยู่ IP ในเครือข่ายเดียวกัน ฯลฯ จะถูกใช้เป็นเงื่อนไขในการพิจารณาว่าเป็นผู้เล่นที่เกี่ยวข้องกันหรือไม่</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>ระยะเวลากำหนดของกิจกรรมนี้จะได้รับแจ้งจากเจ้าหน้าที่</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>JBO ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อมูลโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle1}>กิจกรรมนี้ต้องเป็นไปตามเงื่อนไขมาตรฐานของ JBO</Text>
        ]
    },
    RecommendQuestion: {
        title: 'คำถามที่พบบ่อย',
        img: require('./../../../images/user/recommend/recommend2.png'),
        recommendModalFlag: 'RecommendQuestion',
        pik: 'FAQ_RAF',
        textArr: [
            <Text style={RecommendDataStyle.RecommendDataStyle2}>สามารถรับโบนัสอื่นได้หรือไม่？{'\n'}<Text style={RecommendDataStyle.RecommendDataStyle1}>รางวัลที่แจกโดยโปรโมชั่นนี้ สามารถนำไปใช้กับโปรโมชั่นอื่นบนเว็บไซต์ได้</Text></Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle2}>ต้องทำยอดหมุนเวียนเท่าไรจึงจะสามารถถอนเงินที่ชนะได้？{'\n'}<Text style={RecommendDataStyle.RecommendDataStyle1}>เงินรางวัลจากโปรโมชั่นนี้ ต้องทำยอดหมุนเวียน 1 เท่าก่อน จึงจะสามารถถอนได้</Text></Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle2}>ไม่สามารถยืนยันเบอร์มือถือ และอีเมล?？{'\n'}<Text style={RecommendDataStyle.RecommendDataStyle1}>ติดต่อฝ่ายบริการลูกค้าตลอด 24 ชั่วโมง เพื่อทำการยืนยัน</Text></Text>,
            <Text style={RecommendDataStyle.RecommendDataStyle2}>จะรับโบนัสได้อย่างไร？{'\n'}<Text style={RecommendDataStyle.RecommendDataStyle1}>A แนะนำ B {'\n'}B ทำการสมัครเสร็จสมบูรณ์ มีการฝากเงินเข้ามาขั้นต่ำ 5,000 บาท และมียอดหมุนเวียนถึง 15,000 บาท A จึงจะได้รับ 350 บาท แต่หาก B ฝากเงินเข้ามามากกว่า 500 บาท แต่น้อยกว่า 5,000 บาท มียอดหมุนเวียนถึง 1,500 บาท สมาชิก A จะได้รับ 150 บาทเท่านั้น</Text></Text>,
            <Text style={[RecommendDataStyle.RecommendDataStyle1, { color: '#CCCCCC' }]}>ข้อกำหนด</Text>,
            <Text style={[RecommendDataStyle.RecommendDataStyle1, { color: '#CCCCCC' }]}>ผู้ถูกแนะนำ ต้องทำการฝากเงิน และทำยอดหมุนเวียนก่อน ผู้แนะนำจึงจะได้รับโบนัส</Text>,
            <Text style={[RecommendDataStyle.RecommendDataStyle1, { color: '#CCCCCC' }]}>ผู้แนะนำ ต้องมีการเข้าใช้งานใน JBO มากกว่าหนึ่งเดือน และต้องมียอดฝากรวม 500 บาท พร้อมทั้งมียอดหมุนเวียน 1,500 บาท  ขึ้นไป ภายใน 30 วันนับจากวันที่สมัครสมาชิก</Text>,
            <Text style={[RecommendDataStyle.RecommendDataStyle1, { color: '#CCCCCC' }]}>จำนวนสูงสุดในการแนะนำสมาชิกใหม่ 10 คน (หากต้องการแนะนำมากกว่า 10 คน โปรดติดต่อแชทสด)</Text>
        ]
    }
}

const RecommendDetail1 = [
    `แนะนำเพื่อนสมัครโดยการแชร์ลิงก์หรือ QR โค้ด`,
    `เพื่อนสมัครและทำครบเงื่อนไข`,
    `รับโบนัสและตรวจสอบสถานะที่หน้าโปรไฟล์`
]

export default class Recommend extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            registerDate: '',
            totalDeposits: 0,
            totalBets: 0,
            phoneVerified: false,
            emailVerified: false,

            BannerDB: [],
            activeSlide: 0,
            recommendModalFlag: '',
            isShowRecommendLink: false,
            referrerEligible: {
                isRegisteredMet: false,
                isDepositMet: false,
                isBetAmountMet: false,
                isVerificationMet: false,
            },
            campaignSignUpPreCondition: {
                registeredMonths: 1,
                totalBetAmountRequired: 1000,
                totalDepositRequired: 1000,
                verificationCondition: 3,
            },
            campaignRewardDetails: [],
            queleaUrl: '',
            isShowCopyTip: false,




            referrerPayoutAmount: 0,
            linkClicked: 0,
            memberRegistered: 0,
            memberDeposited: 0,



            firstTierMetCount: 0,
            firstTierRewardAmount: 0,
            firstTierRewardAmountSetting: 0,
            firstTierMsg: '',
            isShowFirstTierMsg: false,

            secondTierMetCount: 0,
            secondTierRewardAmount: 0,
            secondTierRewardAmountSetting: 0,
            secondTierMsg: '',
            isShowSecondTierMsg: false,
            refreshing: false,
            Promotions:[]
        }
    }

    componentDidMount(props) {
        // Toast.success(<View style={{backgroundColor: 'rgba(255, 255, 255, .9)', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 4}}>
        //     <Text style={{color: '#222222'}}>二维码已保存至您的相册</Text>
        // </View>, 2)

        //this.getQueleaReferrerInfo()
        // this.getReferreeTaskStatus()



        this.getQueleaActiveCampaign()
        this.getReferrerEligible()
        this.getReferrerRewardStatus()
        this.getReferrerActivity()
        this.getBanner()
        this.postReferrerSignUp()
        global.storage
            .load({
                key: "Promotions",
                id: "Promotions",
            })
            .then((promotionListing) => {
                this.setState({ Promotions: promotionListing });
            })
            .catch(() => {
                //   Toast.loading("优惠加载中,请稍候...", 200);
            });
    }

    refreshPage(flag) {
        flag && this.setState({
            refreshing: true
        })
        this.getQueleaActiveCampaign()
        this.getReferrerEligible()
        this.getReferrerRewardStatus(flag)
        this.getReferrerActivity()
        this.getBanner()
        this.postReferrerSignUp()
    }

    getBanner() {
        global.storage.load({
            key: 'BannerDBCampaign',
            id: 'BannerDBCampaign'
        }).then(BannerDB => {
            this.setState({
                BannerDB
            })
        }).catch(() => {
            //+ 'contentType=Campaign&'
        })
        fetchRequest(ApiPort.GetBanners + 'contentType=Campaign&', 'GET').then(res => {
            if (res.bannerListing) {
                this.setState({
                    BannerDB: res.bannerListing
                });

                global.storage.save({
                    key: 'BannerDBCampaign',
                    id: 'BannerDBCampaign',
                    data: res.bannerListing,
                    expires: null
                })
            }
        })
    }

    postReferrerSignUp(flag) {
        flag && Toast.loading('กำลังโหลด', 2000)
        global.storage.load({
            key: 'PostReferrerSignUp' + memberCode,
            id: 'PostReferrerSignUp' + memberCode
        }).then(res => {
            if (res.success) {
                this.setState({
                    isShowRecommendLink: true,
                    queleaUrl: res.queleaUrl
                })
            } else {
                this.setState({
                    isShowRecommendLink: false
                })
                flag && Toast.fail(res.message, 1.5)
            }
        }).catch(() => {
            Toast.loading('กำลังโหลด', 2000)
        })
        fetchRequest(ApiPort.PostReferrerSignUp + '?', 'POST').then(res => {
            Toast.hide()
            if (res.success) {
                this.setState({
                    isShowRecommendLink: true,
                    queleaUrl: res.queleaUrl
                })
            } else {
                this.setState({
                    isShowRecommendLink: false
                })
                flag && Toast.fail(res.message, 1.5)
            }

            global.storage.save({
                key: 'PostReferrerSignUp' + memberCode,
                id: 'PostReferrerSignUp' + memberCode,
                data: res,
                expires: null
            })
        }).catch(err => {
            Toast.hide()
        })
        flag && UMonEvent && UMonEvent('RAF','Click','GenerateLink_RAF')
    }

    getReferrerEligible() {
        global.storage.load({
            key: 'ReferrerEligible' + memberCode,
            id: 'ReferrerEligible' + memberCode
        }).then(res => {
            this.setState({
                referrerEligible: res
            })
        }).catch(() => {
            Toast.loading('กำลังโหลด', 2000)
        })
        fetchRequest(ApiPort.GetReferrerEligible + '?', 'GET').then(res => {
            Toast.hide()
            this.setState({
                referrerEligible: res
            })
            global.storage.save({
                key: 'ReferrerEligible' + memberCode,
                id: 'ReferrerEligible' + memberCode,
                data: res,
                expires: null
            })
        }).catch(err => {
            Toast.hide()
        })
    }

    getQueleaReferrerInfo() {
        fetchRequest(ApiPort.GetQueleaReferrerInfo + '?', 'GET').then(res => {
            Toast.hide()
        }).catch(err => {
            Toast.hide()
        })
    }

    getReferreeTaskStatus() {
        fetchRequest(ApiPort.GetReferreeTaskStatus + '?', 'GET').then(res => {
            Toast.hide()
        }).catch(err => {
            Toast.hide()
        })
    }

    getReferrerRewardStatus(flag) {
        global.storage.load({
            key: 'ReferrerRewardStatus' + memberCode,
            id: 'ReferrerRewardStatus' + memberCode
        }).then(res => {
            this.setState({
                firstTierMetCount: res.firstTierMetCount,
                secondTierMetCount: res.secondTierMetCount,
                referrerPayoutAmount: res.referrerPayoutAmount,
                linkClicked: res.linkClicked,
                memberRegistered: res.memberRegistered,
                memberDeposited: res.memberDeposited,
                firstTierRewardAmount: res.firstTierRewardAmount,
                secondTierRewardAmount: res.secondTierRewardAmount,
                firstTierRewardAmountSetting: res.firstTierRewardAmountSetting,
                secondTierRewardAmountSetting: res.secondTierRewardAmountSetting,
                firstTierMsg: res.firstTierMsg,
                secondTierMsg: res.secondTierMsg
            })
        }).catch(() => {
            Toast.loading('กำลังโหลด', 2000)
        })
        fetchRequest(ApiPort.GetReferrerRewardStatus + '?', 'GET').then(res => {
            Toast.hide()
            flag && this.setState({
                refreshing: false
            })
            this.setState({
                firstTierMetCount: res.firstTierMetCount,
                secondTierMetCount: res.secondTierMetCount,
                referrerPayoutAmount: res.referrerPayoutAmount,
                linkClicked: res.linkClicked,
                memberRegistered: res.memberRegistered,
                memberDeposited: res.memberDeposited,
                firstTierRewardAmount: res.firstTierRewardAmount,
                secondTierRewardAmount: res.secondTierRewardAmount,
                firstTierRewardAmountSetting: res.firstTierRewardAmountSetting,
                secondTierRewardAmountSetting: res.secondTierRewardAmountSetting,
                firstTierMsg: res.firstTierMsg,
                secondTierMsg: res.secondTierMsg
            })
            global.storage.save({
                key: 'ReferrerRewardStatus' + memberCode,
                id: 'ReferrerRewardStatus' + memberCode,
                data: res,
                expires: null
            })
        }).catch(err => {
            Toast.hide()
        })
    }

    getReferrerActivity() {
        global.storage.load({
            key: 'ReferrerActivity' + memberCode,
            id: 'ReferrerActivity' + memberCode
        }).then(res => {
            let referrerActivity = res
            this.setState({
                registerDate: referrerActivity.dateRegister,
                totalDeposits: referrerActivity.totalDeposits,
                totalBets: referrerActivity.totalBets,
                phoneVerified: referrerActivity.phoneVerified,
                emailVerified: referrerActivity.emailVerified,
            })
        }).catch(() => {
            Toast.loading('กำลังโหลด', 2000)
        })
        fetchRequest(ApiPort.GetReferrerActivity + '?', 'GET').then(res => {
            Toast.hide()
            if (res.length) {
                let referrerActivity = res[0]
                this.setState({
                    registerDate: referrerActivity.dateRegister,
                    totalDeposits: referrerActivity.totalDeposits,
                    totalBets: referrerActivity.totalBets,
                    phoneVerified: referrerActivity.phoneVerified,
                    emailVerified: referrerActivity.emailVerified,
                })
                global.storage.save({
                    key: 'ReferrerActivity' + memberCode,
                    id: 'ReferrerActivity' + memberCode,
                    data: referrerActivity,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getQueleaActiveCampaign() {
        global.storage.load({
            key: 'QueleaActiveCampaign' + memberCode,
            id: 'QueleaActiveCampaign' + memberCode
        }).then(res => {
            this.setState({
                campaignRewardDetails: res.campaignRewardDetails,
                campaignSignUpPreCondition: res.campaignSignUpPreCondition
            })
        }).catch(() => {
            Toast.loading('กำลังโหลด', 2000)
        })
        fetchRequest(ApiPort.GetQueleaActiveCampaign + '?', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    campaignRewardDetails: res.result.campaignRewardDetails,
                    campaignSignUpPreCondition: res.result.campaignSignUpPreCondition
                })
                global.storage.save({
                    key: 'QueleaActiveCampaign' + memberCode,
                    id: 'QueleaActiveCampaign' + memberCode,
                    data: res.result,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    async copyTXT(txt) {
        Clipboard.setString(txt)
        this.setState({
            isShowCopyTip: true
        })
        setTimeout(() => {
            this.setState({
                isShowCopyTip: false
            })
        }, 2500)

        UMonEvent && UMonEvent('RAF','Click','CopyLink_RAF')
    }

    saveImg() {
        if (Platform.OS == 'android') {
            this.getPermissions()
        } else {
            this.refs.viewShot.capture().then(
                uri => this.SaveQrCode(uri),
                error => Toast.fail(error)
            )
        }
        UMonEvent && UMonEvent('SaveQR_RAF')
    }

    async getPermissions() {
        try {
            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            await PermissionsAndroid.request(permission)
            Promise.resolve()

            setTimeout(() => {
                this.refs.viewShot.capture().then(
                    uri => this.SaveQrCode(uri),
                    error => Toast.fail(error)
                )
            }, 1000)
        } catch (error) {
            Promise.reject(error)
        }
    }

    SaveQrCode(uri) {
        let promise = CameraRoll.saveToCameraRoll(uri)
        promise.then((result) => {
            Toast.success('บันทึก QR โค้ด ลงในอัลบั้มแล้ว', 2)
        }).catch((error) => {
            let errorMsg = Platform.OS == 'ios' ? 'กรุณาเปิดการตั้งค่าการใช้งานรูปที่ iPhone ของคุณ' : 'กรุณาเปิดตั้งค่าอนุญาติใช้งาน APP JBO ที่โทรศัพท์ของคุณ'
            Alert.alert('บันทัก QR ไม่สำเร็จ', errorMsg)
        })
    }

    ShareUrl() {
        if (!Share) {
            Toast.fail('แชร์ลิงก์ไม่สำเร็จ กรุณาลองอีกครั้ง');
            return
        }
        const shareOptions = {
            title: 'แชร์ลิงก์สำเร็จ',
            url: this.state.queleaUrl,
            failOnCancel: false,
        };
        UMonEvent && UMonEvent('RAF','Click','Share_RAF')
        return Share.open(shareOptions);
    }


    toThousands(num, flag) { //每隔3位，用逗号隔开
        let str = num + ''
        if (num) {
            if (str.includes('.')) {
                let numStr = flag ? str.substring(0, str.indexOf(".") + 3) : str
                let numArr = numStr.split('.')
                return numArr[0].replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,') + '.' + numArr[1]
            } else {
                return str.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
            }
        } else {
            return '0'
        }
    }
    JumtProm(item, index) {
        UMonEvent && UMonEvent("Banner" + (index - 2) + "_homepage");   //piwiki 追蹤
        const { bannerRedirectAction, bannerRedirectPath } = item
        if (bannerRedirectPath.toLocaleLowerCase().includes('promotions')) {
            if (bannerRedirectPath.toLocaleLowerCase().includes('id=')) {
                if (ApiPort.UserLogin == false) {
                    Toast.fail("ล็อคอิน", 2);
                    Actions.logins();
                    return;
                }
                let PromotionsId = bannerRedirectPath.split('=')[1]
                let promotionData =this.state.Promotions.filter(item=>item.postId==PromotionsId)
                if(promotionData[0]){
                    Actions.PromotionDetailPage({
                        GameOpenUrl: promotionData[0],
                    });
                }
                return
            } else {
                Actions.preferential()
                return
            }
        }
        if (bannerRedirectAction.toLocaleLowerCase().includes('external')) {
            Linking.openURL(bannerRedirectPath.toLocaleLowerCase().includes('http') ? bannerRedirectPath : 'http://' + bannerRedirectPath)
            return
        }
    }

    renderPage({ item, index }) {
        return <TouchableOpacity key={index} onPress={this.JumtProm.bind(this, item, index)} style={{ width: width, height: 0.4385 * width }}>
            <Image
                resizeMode="stretch"
                style={{ width: width, height: 0.4385 * width }}
                source={{ uri: item.bannerImagePath }}
            />
        </TouchableOpacity>
    }

    render() {
        const { refreshing, isShowCopyTip, queleaUrl, campaignSignUpPreCondition, referrerEligible, recommendModalFlag, isShowRecommendLink, campaignRewardDetails } = this.state

        const {
            registerDate,
            totalDeposits,
            totalBets,
            phoneVerified,
            emailVerified,
        } = this.state

        const {
            referrerPayoutAmount,
            linkClicked,
            memberRegistered,
            memberDeposited,
            firstTierRewardAmount,
            secondTierRewardAmount,
            firstTierRewardAmountSetting,
            secondTierRewardAmountSetting,
            firstTierMsg,
            secondTierMsg,
            isShowFirstTierMsg,
            isShowSecondTierMsg,
            firstTierMetCount,
            secondTierMetCount,
            BannerDB,
            activeSlide
        } = this.state
        return <View style={[styles.viewContainer]}>
            <Modal
                visible={Boolean(recommendModalFlag)}
                transparent={true}
                animationType='fade'
            >
                {
                    Boolean(recommendModalFlag) && <View style={styles.modalContainer}>
                        <View style={styles.modalContainerBox}>
                            <View style={styles.modalHead}>
                                <Text style={styles.modalHeadText}>{RecommendData[recommendModalFlag].title}</Text>
                                <TouchableOpacity
                                    style={styles.closeModalBtn}
                                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                                    onPress={() => {
                                        this.setState({
                                            recommendModalFlag: false
                                        })
                                    }}
                                >
                                    <Text style={styles.closeModalBtnText}>X</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBodyTextWrap}>
                                {
                                    RecommendData[recommendModalFlag].textArr.map((v, i) => {
                                        return <View key={i} style={styles.modalBodyTextBox}>
                                            {
                                                recommendModalFlag === 'RecommendRule' && <Text style={RecommendDataStyle.RecommendDataStyle1}>{i + 1}. </Text>
                                            }
                                            {
                                                recommendModalFlag === 'RecommendQuestion' && (
                                                    i + 1 < 5
                                                        ?
                                                        <Text style={RecommendDataStyle.RecommendDataStyle1}>{i + 1}. </Text>
                                                        :
                                                        (
                                                            i + 1 == 5
                                                                ?
                                                                <Text style={RecommendDataStyle.RecommendDataStyle1}> </Text>
                                                                :
                                                                <Text style={RecommendDataStyle.RecommendDataStyle1}>{i + 1 - 5}. </Text>
                                                        )
                                                )
                                            }

                                            {v}
                                        </View>
                                    })
                                }
                            </View>
                        </View>
                    </View>
                }
            </Modal>

            <Tabs
                onChange={(v) => {
                    UMonEvent && UMonEvent(v.pik)
                }}
                tabs={TabData}
                tabBarBackgroundColor='#0A0A0A'
                tabBarInactiveTextColor='#CCCCCC'
                tabBarActiveTextColor='#1AFF00'
                tabBarUnderlineStyle={{
                    backgroundColor: '#00E62E'
                }}
                swipeable={Platform.OS === 'ios'}
            >
                <View style={styles.tabContainer}>
                    <ScrollView
                        contentContainerStyle={{}}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 120 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                tintColor={'#fff'}
                                onRefresh={() => {
                                    this.refreshPage(true)
                                }}
                            />
                        }
                    >
                        {
                            !isShowRecommendLink
                                ?
                                <View>
                                    <View style={styles.progressHead}>
                                        <Text style={styles.progressHeadText}>เงื่อนไขในการแนะนำเพื่อน</Text>
                                    </View>
                                    <View>
                                        <View style={styles.progressBox}>
                                            <View style={styles.progressWrap}>
                                                <View style={styles.progressCircle}></View>
                                                <Text style={styles.progressBoxText1}>สมัครภายใน {campaignSignUpPreCondition.registeredMonths} เดือน</Text>
                                            </View>
                                            {
                                                registerDate.length > 0 && <Text style={styles.progressBoxText2}>สมัครที่ {moment(registerDate).format('YYYY-MM-DD')}</Text>
                                            }
                                            <View style={[styles.progressPos, styles.progressPos1, { borderColor: referrerEligible.isRegisteredMet ? '#00B324' : '#888' }]}>
                                                <Text style={{ color: referrerEligible.isRegisteredMet ? '#00B324' : '#888' }}>✓</Text>
                                            </View>
                                        </View>


                                        <View style={[styles.progressBox,{flexDirection: 'row',}]}>
                                            <View style={{flex: 1}}>
                                                <View style={styles.progressWrap}>
                                                    <View style={styles.progressCircle}></View>
                                                    <Text style={styles.progressBoxText1}>ยอดฝากรวม {this.toThousands(campaignSignUpPreCondition.totalDepositRequired)} บาท หมุนเวียน {this.toThousands(campaignSignUpPreCondition.totalBetAmountRequired)} บาท</Text>
                                                </View>
                                                <Text style={styles.progressBoxText2}>คุณมียอดฝากรวม {this.toThousands(totalDeposits)} บาท / หมุนเวียน {this.toThousands(totalBets)} บาท</Text>
                                            </View>
                                            <View style={{flex: .4, justifyContent: 'center', alignItems: 'center'}}>
                                                {
                                                    (referrerEligible.isRegisteredMet && referrerEligible.isDepositMet && referrerEligible.isBetAmountMet)
                                                        ?
                                                        <View style={[styles.progressPos, styles.progressPos1, { borderColor: '#00B324' }]}>
                                                            <Text style={{ color: '#00B324' }}>✓</Text>
                                                        </View>
                                                        :
                                                        (
                                                            !referrerEligible.isRegisteredMet
                                                                ?
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        referrerEligible.isRegisteredMet && Actions.depositTx({
                                                                            fromPage: 'Recommend',
                                                                            refreshPage: () => {
                                                                                this.refreshPage(false)
                                                                            }
                                                                        })
                                                                    }}
                                                                    style={[styles.progressPos2, { backgroundColor: referrerEligible.isRegisteredMet ? '#00B324' : '#666666' }]}>
                                                                    <Text style={{ color: referrerEligible.isRegisteredMet ? '#F5F5F5' : '#CCCCCC' }}>ฝากเงินตอนนี้</Text>
                                                                </TouchableOpacity>
                                                                :
                                                                (
                                                                    !referrerEligible.isDepositMet
                                                                        ?
                                                                        <TouchableOpacity
                                                                            onPress={() => {
                                                                                referrerEligible.isRegisteredMet && Actions.depositTx()
                                                                                UMonEvent && UMonEvent('Deposit Nav','Click','Depositnow_RAF')
                                                                            }}
                                                                            style={[styles.progressPos2, { backgroundColor: referrerEligible.isRegisteredMet ? '#00B324' : '#666666' }]}>
                                                                            <Text style={{ textAlign: 'center',color: referrerEligible.isRegisteredMet ? '#F5F5F5' : '#CCCCCC' }}>ฝากเงินตอนนี้</Text>
                                                                        </TouchableOpacity>
                                                                        :
                                                                        null
                                                                )
                                                        )
                                                }
                                            </View>
                                        </View>

                                        <View style={[styles.progressBox,{flexDirection: 'row',}]}>
                                            <View style={{flex: 1}}>
                                                <View style={styles.progressWrap}>
                                                    <View style={styles.progressCircle}></View>
                                                    <Text style={styles.progressBoxText1}>ยืนยันเบอร์โทรศัพท์และอีเมล</Text>
                                                </View>
                                                {
                                                    (referrerEligible.isRegisteredMet && referrerEligible.isVerificationMet)
                                                        ?
                                                        <Text style={styles.progressBoxText2}>เบอร์โทรศัพท์และอีเมลยืนยันสำเร็จ</Text>
                                                        :
                                                        (
                                                            !referrerEligible.isVerificationMet &&
                                                            (!phoneVerified && !emailVerified) ?
                                                                <Text style={styles.progressBoxText2}>ยังไม่ได้ยืนยันเบอร์โทรศัพท์และอีเมล</Text>
                                                                // <Text style={styles.progressBoxText2}>手机和邮箱尚未验证</Text>
                                                                :
                                                                <View>
                                                                    {
                                                                        !phoneVerified && <Text style={styles.progressBoxText2}>ยังไม่ได้ยืนยันเบอร์โทร</Text>
                                                                    }

                                                                    {
                                                                        !emailVerified && <Text style={styles.progressBoxText2}>ยังไม่ได้ยืนยันอีเมล</Text>
                                                                    }
                                                                </View>
                                                        )
                                                }
                                            </View>
                                            <View style={{flex: .4, justifyContent: 'center', alignItems: 'center'}}>
                                                {
                                                    (referrerEligible.isRegisteredMet && referrerEligible.isVerificationMet)
                                                        ?
                                                        <View style={[styles.progressPos, styles.progressPos1, { borderColor: '#00B324' }]}>
                                                            <Text style={{ color: '#00B324' }}>✓</Text>
                                                        </View>
                                                        :
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                referrerEligible.isRegisteredMet && Actions.AccountUser({
                                                                    fromPage: 'Recommend',
                                                                    refreshPage: () => {
                                                                        this.refreshPage(false)
                                                                    }
                                                                })
                                                                UMonEvent && UMonEvent('Verification','Click','Verifynow_RAF')
                                                            }}
                                                            style={[styles.progressPos2, { backgroundColor: referrerEligible.isRegisteredMet ? '#00B324' : '#666666' }]}>
                                                            <Text style={{ textAlign: 'center',color: referrerEligible.isRegisteredMet ? '#F5F5F5' : '#CCCCCC' }}>ยืนยันตอนนี้</Text>
                                                        </TouchableOpacity>
                                                }
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => {
                                                (referrerEligible.isBetAmountMet && referrerEligible.isDepositMet && referrerEligible.isRegisteredMet && referrerEligible.isVerificationMet) && this.postReferrerSignUp(true)
                                            }}
                                            style={[styles.createLinkBtn,
                                                { backgroundColor: (referrerEligible.isBetAmountMet && referrerEligible.isDepositMet && referrerEligible.isRegisteredMet && referrerEligible.isVerificationMet) ? '#00B324' : '#666666' }]}>
                                            <Text style={{ color: (referrerEligible.isBetAmountMet && referrerEligible.isDepositMet && referrerEligible.isRegisteredMet && referrerEligible.isVerificationMet) ? '#FFFFFF' : '#F5F5F5' }}>
                                                {/* 生成专属推荐链接 */}
                                                สร้างลิงค์แนะนำพิเศษ
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                :
                                <View>
                                    <View style={styles.progressHead}>
                                        <Text style={styles.progressHeadText}>ลิงก์แนะนำเพื่อน</Text>
                                    </View>
                                    <View style={styles.recommendLinkBox}>
                                        <ScrollView
                                            horizontal={true}
                                            automaticallyAdjustContentInsets={false}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            <Text style={styles.recommendLinkText}>{queleaUrl}</Text>
                                        </ScrollView>
                                        <TouchableOpacity
                                            onPress={() => { this.copyTXT(queleaUrl) }}
                                            hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                                            <Image
                                                resizeMode='stretch'
                                                style={styles.recommendLinkBoxImg}
                                                source={require('./../../../images/user/recommend/recommendLinkBoxImg.png')}
                                            ></Image>
                                        </TouchableOpacity>
                                        {
                                            isShowCopyTip && <View style={styles.copyStatus}>
                                                <Text style={styles.copyText}>คัดลอกลิงก์</Text>
                                                <View style={styles.copyArrow}></View>
                                            </View>
                                        }
                                    </View>
                                    <View>
                                        <Text style={styles.progressHeadText}>QR Code ลิงก์แนะนำเพื่อน</Text>
                                        {
                                            queleaUrl.length > 0 && <View style={[styles.qrcodeWrap]}>
                                                <ViewShot
                                                    style={[styles.qrcodeBox]}
                                                    ref='viewShot'
                                                    options={{ format: 'jpg', quality: 0.9 }}>
                                                    <QRCodeA
                                                        ref='viewShot'
                                                        value={queleaUrl}
                                                        size={(width - 20) * .45}
                                                        bgColor='#000'
                                                        fgColor='white'
                                                    ></QRCodeA>
                                                </ViewShot>
                                            </View>
                                        }

                                        <View style={styles.linkShareBox}>
                                            <TouchableOpacity onPress={this.ShareUrl.bind(this)} style={[styles.linkShareBox1, styles.linkShareBox3]}>
                                                <Text style={styles.linkShareBoxTetx1}>แชร์</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={this.saveImg.bind(this)} style={[styles.linkShareBox2, styles.linkShareBox3]}>
                                                <Text style={styles.linkShareBoxTetx2}>บันทึก QR โค้ด</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                        }

                        <View style={{ marginVertical: 20 }}>
                            <View style={styles.progressHead}>
                                <Text style={styles.progressHeadText}>สถานะการแนะนำ</Text>
                                <View style={styles.rewardMoneyBox}>
                                    <Text style={styles.rewardMoneyText1}>รับโบนัสแล้ว：</Text>
                                    <Text style={styles.rewardMoneyText2}>{this.toThousands(referrerPayoutAmount)} บาท</Text>
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <View style={styles.rewardProgressWrap}>
                                    <View style={styles.rewardProgressBox}>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText1]}>ลิงก์</Text>
                                        </View>
                                        <View style={[styles.rewardCircle, { backgroundColor: linkClicked > 0 ? '#00B324' : '#666666' }]}></View>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText2]}>{this.toThousands(linkClicked)} คลิก</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.rewardCircleLine, { backgroundColor: linkClicked > 0 ? '#00B324' : '#666666' }]}></View>
                                </View>
                                <View style={styles.rewardProgressWrap}>
                                    <View style={styles.rewardProgressBox}>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText1]}>สมัครสมาชิก</Text>
                                        </View>
                                        <View style={[styles.rewardCircle, { backgroundColor: memberRegistered > 0 ? '#00B324' : '#666666' }]}></View>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText2]}>{this.toThousands(memberRegistered)} คน</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.rewardCircleLine, { backgroundColor: memberRegistered > 0 ? '#00B324' : '#666666' }]}></View>
                                </View>
                                <View style={styles.rewardProgressWrap}>
                                    <View style={styles.rewardProgressBox}>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText1]}>ฝากเงิน</Text>
                                        </View>
                                        <View style={[styles.rewardCircle, { backgroundColor: memberDeposited > 0 ? '#00B324' : '#666666' }]}></View>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText2]}>{this.toThousands(memberDeposited)} คน</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.rewardCircleLine, { backgroundColor: memberDeposited > 0 ? '#00B324' : '#666666' }]}></View>
                                </View>
                                <View style={styles.rewardProgressWrap}>
                                    {
                                        firstTierMsg != "" && isShowFirstTierMsg && <View style={styles.secondTierMsgTextBox}>
                                            <View style={styles.secondTierMsgTextBoxArrow}></View>
                                            <View style={styles.secondTierMsgText1Box}>
                                                <Text style={styles.secondTierMsgText}>{firstTierMsg.depositMsg}</Text>
                                                <Text style={styles.secondTierMsgText}>{firstTierMsg.turnoverMsg}</Text>
                                                <Text style={styles.secondTierMsgText}>{firstTierMsg.rulesMsg}</Text>
                                            </View>
                                        </View>
                                    }
                                    <View style={styles.rewardProgressBox}>
                                        <TouchableOpacity
                                            style={styles.rewardCircleBoxText}
                                            onPress={() => {
                                                firstTierMsg != "" && this.setState({
                                                    isShowFirstTierMsg: true
                                                })
                                            }}
                                        >
                                            <View style={styles.questionBox}>
                                                <Text style={styles.questionBoxText}>?</Text>
                                            </View>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText1]}>โบนัส {this.toThousands(firstTierRewardAmountSetting)} บาท</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.rewardCircle, { backgroundColor: firstTierMetCount > 0 ? '#00B324' : '#666666' }]}></View>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText2]}>{this.toThousands(firstTierMetCount)} คน</Text>

                                            {
                                                firstTierMetCount > 0 && <View style={styles.totalMoneyBox}>
                                                    <Text style={styles.totalMoneyBoxText}>โบนัสสะสม ：{this.toThousands(firstTierRewardAmount)} ฿</Text>
                                                </View>
                                            }

                                        </View>
                                    </View>
                                    <View style={[styles.rewardCircleLine, { backgroundColor: firstTierMetCount > 0 ? '#00B324' : '#666666' }]}></View>
                                </View>
                                <View style={styles.rewardProgressWrap}>
                                    {
                                        secondTierMsg != '' && isShowSecondTierMsg && <View style={styles.secondTierMsgTextBox}>
                                            <View style={styles.secondTierMsgTextBoxArrow}></View>
                                            <View style={styles.secondTierMsgText1Box}>
                                                <Text style={styles.secondTierMsgText}>{secondTierMsg.depositMsg}</Text>
                                                <Text style={styles.secondTierMsgText}>{secondTierMsg.turnoverMsg}</Text>
                                                <Text style={styles.secondTierMsgText}>{secondTierMsg.rulesMsg}</Text>
                                            </View>
                                        </View>
                                    }

                                    <View style={styles.rewardProgressBox}>
                                        <TouchableOpacity
                                            style={styles.rewardCircleBoxText}
                                            onPress={() => {
                                                secondTierMsg != '' && this.setState({
                                                    isShowSecondTierMsg: true
                                                })
                                            }}>
                                            <View style={styles.questionBox}>
                                                <Text style={styles.questionBoxText}>?</Text>
                                            </View>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText1]}>โบนัส {this.toThousands(secondTierRewardAmountSetting)} บาท</Text>
                                        </TouchableOpacity>
                                        <View style={[styles.rewardCircle, { backgroundColor: secondTierMetCount > 0 ? '#00B324' : '#666666' }]}></View>
                                        <View style={styles.rewardCircleBoxText}>
                                            <Text style={[styles.rewardCircleText, styles.rewardCircleText2]}>{this.toThousands(secondTierMetCount)} คน</Text>

                                            {
                                                secondTierMetCount > 0 && <View style={styles.totalMoneyBox}>
                                                    <Text style={styles.totalMoneyBoxText}>โบนัสสะสม ：{this.toThousands(secondTierRewardAmount)} ฿</Text>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={styles.recommendRulesBox}>
                        {
                            Object.values(RecommendData).map((v, i) => {
                                return <TouchableOpacity
                                    key={i}
                                    style={[styles.recommendRulesWrap, styles[`recommendRulesWrap${i}`]]}
                                    onPress={() => {
                                        this.setState({
                                            recommendModalFlag: v.recommendModalFlag
                                        })

                                        UMonEvent && UMonEvent(v.pik)
                                    }}
                                >
                                    <Image
                                        resizeMode='stretch'
                                        source={v.img}
                                        style={[styles.recommendRulesWrapImg]}
                                    ></Image>
                                    <Text style={styles.recommendRulesWrapText}>{v.title}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </View>

                <View style={styles.tabContainer}>
                    <ScrollView
                        contentContainerStyle={{}}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                tintColor={'#fff'}
                                onRefresh={() => {
                                    this.refreshPage(true)
                                }}
                            />
                        }
                    >
                        <View style={{ marginBottom: 15 }}>
                            {/*  */}
                            {
                                BannerDB.length > 0 &&
                                    <Carousel
                                        data={BannerDB}
                                        renderItem={this.renderPage.bind(this)}
                                        sliderWidth={width}
                                        itemWidth={width}
                                        autoplay={true}
                                        loop={true}
                                        autoplayDelay={700}
                                        autoplayInterval={6000}
                                        onSnapToItem={index => this.setState({ activeSlide: index })}
                                    />
                            }

                            <Pagination
                                dotsLength={BannerDB.length}
                                activeDotIndex={activeSlide}
                                containerStyle={{
                                    paddingVertical: 2,
                                }}
                                dotStyle={{
                                    backgroundColor: "#1bfe00",
                                    position: 'relative',
                                    top: 5,
                                }}
                                inactiveDotStyle={{
                                    width: 10,
                                    backgroundColor: "#fff"
                                }}
                                inactiveDotOpacity={1}
                                inactiveDotScale={0.6}
                            />
                        </View>
                        <View style={[styles.guideContainer, { paddingBottom: 10 }]}>
                            {
                                RecommendDetail1.map((v, i) => {
                                    return <View key={i} style={styles.rencommendDetailBox1}>
                                        <Text style={styles.rencommendDetailtext1}>{i + 1}</Text>
                                        <Text style={styles.rencommendDetailtext2}>{v}</Text>
                                        {
                                            i !== RecommendDetail1.length - 1 && <View style={styles.bottomArrow}></View>
                                        }
                                    </View>
                                })
                            }
                        </View>
                        <View style={[styles.guideContainer, { backgroundColor: '#1A1A1A' }]}>
                            <View style={styles.guideHead}>
                                <Image
                                    source={require('./../../../images/user/recommend/leftGuide.png')}
                                    resizeMode='stretch'
                                    style={styles.leftGuide}
                                ></Image>
                                <Text style={styles.guideHeadText}>กิจกรรมโบนัส</Text>
                                <Image
                                    source={require('./../../../images/user/recommend/rightGudie.png')}
                                    resizeMode='stretch'
                                    style={styles.rightGuide}
                                ></Image>
                            </View>
                            <View style={styles.rewardTable}>
                                <View style={[styles.rewardTableTr, styles.rewardTableTr1]}>
                                    <View style={[styles.rewardTableTd, styles.rewardTableTd1]}>
                                        <Text style={styles.rewardTableText1}>ผู้ถูกแนะนำ</Text>
                                    </View>
                                    <View style={[styles.rewardTableTd]}>
                                        <Text style={styles.rewardTableText1}>ผู้แนะนำ</Text>
                                    </View>
                                </View>
                                <View style={[styles.rewardTableTr, styles.rewardTableTr2]}>
                                    <View style={[styles.rewardTableTd]}>
                                        <Text style={styles.rewardTableText2}>จำนวนเงินฝาก</Text>
                                    </View>
                                    <View style={[styles.rewardTableTd]}>
                                        <Text style={styles.rewardTableText2}>ยอดหมุนเวียน</Text>
                                    </View>
                                    <View style={[styles.rewardTableTd]}>
                                        <Text style={styles.rewardTableText2}>โบนัส</Text>
                                    </View>
                                </View>
                                {
                                    Array.isArray(campaignRewardDetails) && campaignRewardDetails.length > 0 && campaignRewardDetails.map((v, i) => {
                                        return <View key={i} style={[styles.rewardTableTr, styles.rewardTableTr3]}>
                                            <View style={[styles.rewardTableTd]}>
                                                <Text style={styles.rewardTableText3}>{this.toThousands(v.depositAmount)}</Text>
                                            </View>
                                            <View style={[styles.rewardTableTd]}>
                                                <Text style={styles.rewardTableText2}>{this.toThousands(v.turnoverAmount)}</Text>
                                            </View>
                                            <View style={[styles.rewardTableTd]}>
                                                <Text style={styles.rewardTableText2}>{this.toThousands(v.referralRewardAmount)}</Text>
                                            </View>
                                        </View>
                                    })
                                }
                            </View>
                            <View>
                                <View style={{ marginVertical: 20 }}>
                                    <Text style={styles.guideTextColor3}>ตัวอย่าง:：</Text>
                                    <Text style={styles.guideTextColor2}>A แนะนำ B</Text>
                                    <Text style={styles.guideTextColor2}>B ทำการลงทะเบียนเสร็จสมบูรณ์ มีการฝากเงินเข้ามาขั้นต่ำ 500 บาท และมียอดหมุนเวียนครบ 1,500 บาท A จึงจะได้รับโบนัสฟรี 150 บาท </Text>
                                    {/*<Text style={styles.guideTextColor2}>如果 B 存款 100 元以上 1,000 元以下并达到 300 流水，那会员 A 只能获得 38 元。</Text>*/}
                                </View>
                                <View>
                                    <Text style={styles.guideTextColor3}>ข้อกำหนด ：</Text>
                                    <View style={styles.guideTextBox}>
                                        <Text style={styles.guideTextColor2}>1. </Text>
                                        <Text style={styles.guideTextColor2}>ผู้ถูกแนะนำ ต้องทำการฝากเงิน และทำยอดหมุนเวียนก่อน ผู้แนะนำจึงจะได้รับโบนัส</Text>
                                    </View>
                                    <View style={styles.guideTextBox}>
                                        <Text style={styles.guideTextColor2}>2. </Text>
                                        <Text style={styles.guideTextColor2}>ผู้แนะนำ ต้องมีการเข้าใช้งานใน JBO มากกว่าหนึ่งเดือน และต้องมียอดฝากรวม 500 บาท พร้อมทั้งมียอดหมุนเวียน 1,500 บาท  ขึ้นไป ภายใน 30 วันนับจากวันที่สมัครสมาชิก</Text>
                                    </View>
                                    <View style={styles.guideTextBox}>
                                        <Text style={styles.guideTextColor2}>3. </Text>
                                        <Text style={styles.guideTextColor2}>ผู้แนะนำจะได้รับโบนัสในทุกๆ การแนะนำที่ผ่านเงื่อนไข โดยแนะนำสูงสุดที่ 10 คน
                                            ในกรณีที่ต้องการแนะนำมากกว่า 10 คน กรุณาติดต่อเจ้าหน้าที่เพื่อรับคำแนะนำเพิ่มเติม</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.guideContainer, { backgroundColor: '#000000' }]}>
                            <View style={styles.guideHead}>
                                <Image
                                    source={require('./../../../images/user/recommend/leftGuide.png')}
                                    resizeMode='stretch'
                                    style={styles.leftGuide}
                                ></Image>
                                <Text style={styles.guideHeadText}>เงื่อนไขและข้อบังคับ</Text>
                                <Image
                                    source={require('./../../../images/user/recommend/rightGudie.png')}
                                    resizeMode='stretch'
                                    style={styles.rightGuide}
                                ></Image>
                            </View>
                            <View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>1. </Text>
                                    <Text style={styles.guideTextColor1}>ผู้ที่ถูกแนะนำ จะต้องสมัคร และเล่นเป็นครั้งแรกบนเว็บไซต์นี้</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>2. </Text>
                                    <Text style={styles.guideTextColor1}>ผู้ถูกแนะนำ จะต้องสมัครด้วย IP และที่อยู่อาศัยอื่น ซึ่งไม่ตรงกับผู้แนะนำ</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>3. </Text>
                                    <Text style={styles.guideTextColor1}>ผู้ถูกแนะนำจะต้องสมัครเป็นสมาชิกภายใต้ลิงก์การแนะนำของคุณเท่านั้น</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>4. </Text>
                                    <Text style={styles.guideTextColor1}>ผู้ถูกแนะนำ จะต้องตรวจสอบเบอร์มือถือ และอีเมลให้ถูกต้อง。</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>5. </Text>
                                    <Text style={styles.guideTextColor1}>เฉพาะสมาชิกที่กรอกเบอร์มือถือที่ถูกต้องเท่านั้น จึงจะมีสิทธิ์ได้รับรางวัล สมาชิกสามารถอัปเดต และยืนยันข้อมูลได้ใน "โปรไฟล์ส่วนตัว"</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>6. </Text>
                                    <Text style={styles.guideTextColor1}>การเดิมพันที่ผิดปกติ หรือพฤติกรรมการเก็งกำไร จะถูกตัดสิทธิ์การเข้าร่วมโปรโมชั่นนี้ทันทีที่ตรวจพบ</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>7. </Text>
                                    <Text style={styles.guideTextColor1}>โปรโมชั่นนี้จำกัดเฉพาะกับผู้เล่นที่มี 1 บัญชีเท่านั้น ที่อยู่อาศัย อีเมล เบอร์มือถือ การชำระเงิน (บัตรเดบิต / บัตรเครดิต/หมายเลขบัญชีธนาคารเดียวกัน) ที่อยู่ IP ในเครือข่ายเดียวกัน ฯลฯ จะถูกใช้เป็นเงื่อนไขในการพิจารณาว่าเป็นผู้เล่นที่เกี่ยวข้องกันหรือไม่</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>8. </Text>
                                    <Text style={styles.guideTextColor1}>ระยะเวลากำหนดของกิจกรรมนี้จะได้รับแจ้งจากเจ้าหน้าที่</Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>9. </Text>
                                    <Text style={styles.guideTextColor1}>JBO ขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อมูลโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</Text>
                                    <Text style={styles.guideTextColor1}>กิจกรรมนี้ต้องเป็นไปตามเงื่อนไขมาตรฐานของ JBO</Text>
                                </View>
                            </View>
                        </View>
                        <View style={[styles.guideContainer, { backgroundColor: '#1A1A1A' }]}>
                            <View style={styles.guideHead}>
                                <Image
                                    source={require('./../../../images/user/recommend/leftGuide.png')}
                                    resizeMode='stretch'
                                    style={styles.leftGuide}
                                ></Image>
                                <Text style={styles.guideHeadText}>คำถามที่พบบ่อย</Text>
                                <Image
                                    source={require('./../../../images/user/recommend/rightGudie.png')}
                                    resizeMode='stretch'
                                    style={styles.rightGuide}
                                ></Image>
                            </View>
                            <View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>1. </Text>
                                    <Text style={styles.guideTextColor1}>สามารถรับโบนัสอื่นได้หรือไม่？{'\n'}<Text style={styles.guideTextColor2}>รางวัลที่แจกโดยโปรโมชั่นนี้ สามารถนำไปใช้กับโปรโมชั่นอื่นบนเว็บไซต์ได้</Text></Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>2. </Text>
                                    <Text style={styles.guideTextColor1}>ต้องทำยอดหมุนเวียนเท่าไรจึงจะสามารถถอนเงินที่ชนะได้？{'\n'}<Text style={styles.guideTextColor2}>เงินรางวัลจากโปรโมชั่นนี้ ต้องทำยอดหมุนเวียน 1 เท่าก่อน จึงจะสามารถถอนได้</Text></Text>
                                </View>
                                <View style={styles.guideTextBox}>
                                    <Text style={styles.guideTextColor1}>3. </Text>
                                    <Text style={styles.guideTextColor1}>ไม่สามารถยืนยันเบอร์มือถือ และอีเมล?？{'\n'}<Text style={styles.guideTextColor2}>ติดต่อฝ่ายบริการลูกค้าตลอด 24 ชั่วโมง เพื่อทำการยืนยัน</Text></Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Tabs>
            {
                (isShowSecondTierMsg || isShowFirstTierMsg) && <TouchableHighlight
                    style={styles.overly}
                    onPress={() => {
                        this.setState({
                            isShowSecondTierMsg: false,
                            isShowFirstTierMsg: false
                        })
                    }}
                >
                    <Text style={{ color: 'transparent' }}>123</Text>
                </TouchableHighlight>
            }
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#0A0A0A'
    },
    overly: {
        width,
        height,
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
    },
    guideTextBox: {
        flexDirection: 'row',
    },
    guideTextColor1: {
        color: '#F5F5F5',
        fontSize: 14,
        lineHeight: 24
    },
    guideTextColor2: {
        color: '#CCCCCC',
        fontSize: 14,
        lineHeight: 24
    },
    guideTextColor3: {
        fontSize: 15,
        //fontWeight: 'bold',
        color: '#F5F5F5',
        marginBottom: 5
    },
    guideContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
        paddingTop: 10
    },
    guideHeadText: {
        color: '#00E62E',
        //fontWeight: 'bold',
        marginHorizontal: 6,
        fontSize: 16
    },
    guideHead: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftGuide: {
        width: 9 * 14.75,
        height: 9
    },
    rewardTable: {
        borderWidth: 1,
        borderColor: '#444444',
        borderBottomWidth: 0,
        borderRightWidth: 0
    },
    rewardTableTr: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#444444'
    },
    rewardTableTr1: {
        backgroundColor: '#2491FF',
    },
    rewardTableTr2: {
        backgroundColor: '#3C3C3C'
    },
    rewardTableTr3: {
        backgroundColor: '#1A1A1A',
    },
    rewardTableTd: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#444444',
        borderRightWidth: 1,
        width: (width - 20) / 3
    },
    rewardTableTd1: {
        width: (width - 20) * 2 / 3,
    },
    rewardTableText1: {
        color: '#F5F5F5',
        textAlign: 'center'
    },
    rewardTableText2: {
        color: '#CCCCCC',
        textAlign: 'center'
    },
    rewardTableText3: {
        color: '#F5F5F5'
    },
    rightGuide: {
        width: 9 * 14.75,
        height: 9
    },
    bottomArrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 8,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#00E62E',
        position: 'absolute',
        bottom: -16,
        left: ((width - 20) / 2) - 4
    },
    recommendBanner: {
        width,
        height: width * .48,
    },
    rencommendDetailBox1: {
        backgroundColor: '#061806',
        borderWidth: 1,
        borderColor: '#2cd43a',
        marginBottom: 15,
        alignItems: 'center',
        paddingVertical: 10,
        flexDirection: 'row'
    },
    rencommendDetailtext1: {
        fontSize: 28,
        color: '#f5f5f5',
        fontWeight: 'bold',
        width: (width - 20) * .25,
        textAlign: 'center'
    },
    rencommendDetailtext2: {
        color: '#F5F5F5',
        flex: 1,
        paddingRight: 5
    },
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainerBox: {
        width: width * .9,
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowColor: '#00B324',
        elevation: 4,
        backgroundColor: '#000000'
    },
    modalHead: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalHeadText: {
        color: '#F5F5F5',
        fontSize: 16,
        //fontWeight: 'bold'
    },
    closeModalBtn: {
        position: 'absolute',
        right: 10
    },
    closeModalBtnText: {
        color: '#fff',
        fontSize: 16
    },
    modalBodyTextBox: {
        marginVertical: 4,
        flexDirection: 'row',
        marginRight: 15,
        width: .9 * width - 45
    },
    modalBodyTextWrap: {
        marginHorizontal: 10,
        paddingBottom: 30
    },
    tabContainer: {
        flex: 1
    },
    recommendLinkBox: {
        height: 40,
        backgroundColor: '#2C2C2C',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 20
    },
    recommendLinkText: {
        color: '#F5F5F5'
    },
    recommendLinkBoxImg: {
        width: 20,
        height: 20,
        marginLeft: 10
    },
    copyStatus: {
        backgroundColor: '#00B324',
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 4,
        position: 'absolute',
        right: 0,
        top: 40
    },
    copyText: {
        color: '#F5F5F5'
    },
    copyArrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 8,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#00B324',
        position: 'absolute',
        top: -15,
        right: 12
    },
    qrcodeBox: {
        borderWidth: 1,
        borderColor: '#00B324',
        backgroundColor: '#F5F5F5',
        padding: 10,
        overflow: 'hidden',

    },
    linkShareBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 25
    },
    linkShareBox1: {
        backgroundColor: '#00B324'
    },
    linkShareBox2: {
        borderWidth: 1,
        borderColor: '#00B324'
    },
    linkShareBox3: {
        width: (width - 20) / 2.1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    linkShareBoxTetx1: {
        color: '#FFFFFF'
    },
    linkShareBoxTetx2: {
        color: '#00B324'
    },
    qrcodeWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        overflow: 'hidden'
    },
    progressHead: {
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#00B324',
        paddingLeft: 8,
        paddingVertical: 2,
        marginVertical: 10
    },
    progressHeadText: {
        color: '#F5F5F5'
    },
    rewardMoneyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 0
    },
    rewardMoneyText1: {
        color: '#F5F5F5'
    },
    rewardMoneyText2: {
        color: '#00E62E'
    },
    rewardCircle: {
        width: 20,
        height: 20,
        backgroundColor: '#666666',
        borderRadius: 1000,
        marginHorizontal: 15
    },
    rewardCircleBoxText: {
        width: (width - 70) / 2,
    },
    questionBox: {
        width: 16,
        height: 16,
        backgroundColor: '#666666',
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 95
    },
    questionBoxText: {
        color: '#0A0A0A'
    },
    secondTierMsgTextBoxArrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 8,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#00B324',
        position: 'absolute',
        bottom: -15
    },
    secondTierMsgTextBox: {
        backgroundColor: '#00B324',
        borderRadius: 4,
        paddingVertical: 6,
        width: 190,
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: -95,
        zIndex: 1000
    },
    secondTierMsgText1Box: {},
    secondTierMsgText: {
        color: '#F5F5F5',
        lineHeight: 22,
        textAlign: 'left',
        fontSize: 13
    },
    totalMoneyBox: {
        backgroundColor: '#00B324',
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        position: 'absolute',
        marginTop: 40
    },
    totalMoneyBoxText: {
        color: '#F5F5F5'
    },
    rewardCircleText: {
        color: '#CCCCCC',
    },
    rewardCircleText1: {
        textAlign: 'right'
    },
    rewardCircleText2: {
        textAlign: 'left'
    },
    rewardCircleLine: {
        width: 1,
        height: 80,
    },
    rewardProgressWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rewardProgressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBox: {
        backgroundColor: '#2C2C2C',
        borderRadius: 4,
        overflow: 'hidden',
        padding: 15,
        paddingLeft: 20,
        justifyContent: 'center',
        marginBottom: 15
    },
    progressWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    progressCircle: {
        width: 6,
        height: 6,
        borderRadius: 1000,
        backgroundColor: '#00B324',
        position: 'absolute',
        left: -12
    },
    progressBoxText1: {
        color: '#F5F5F5',
        fontSize: 14
    },
    progressBoxText2: {
        color: '#CCCCCC',
        fontSize: 12
    },
    progressPos: {
        position: 'absolute',
        right: 15
    },
    progressPos1: {
        width: 22,
        height: 22,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000
    },
    progressPos2: {
        padding: 5,
        borderRadius: 4
    },
    createLinkBtn: {
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recommendRulesBox: {
        position: 'absolute',
        marginHorizontal: 10,
        bottom: 20,
        left: 15,
        right: 15,
        backgroundColor: '#2c2c2c',
        borderRadius: 10000,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recommendRulesWrap: {
        width: (width - 34) / 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6
    },
    recommendRulesWrapImg: {
        width: 30,
        height: 30,
        marginRight: 0
    },
    recommendRulesWrap0: {
        borderRightWidth: 1,
        borderRightColor: '#0A0A0A'
    },
    recommendRulesWrap1: {
        borderLeftWidth: 1,
        borderLeftColor: '#0A0A0A'
    },
    recommendRulesWrapText: {
        color: '#00B324',
        fontSize: 13
    },
})
