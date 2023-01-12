import React, {Component, PropTypes} from 'react'
import { Modal, Text, StyleSheet,View, Image,ImageBackground,ScrollView,TouchableOpacity ,Dimensions,Linking,DeviceEventEmitter,NativeModules,Platform,TextInput} from 'react-native';
import { Button, Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List,Switch} from 'antd-mobile-rn';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux'
import ModalDropdown from "react-native-modal-dropdown";
import { getVipInforAction } from './../actions/VipInforAction'
import Touch from 'react-native-touch-once';
let {width, height} = Dimensions.get('window');
import moment from 'moment'

import ItemList from "antd-mobile-rn/lib/list/style/index.native";

const newStyle = {};
for (const key in ItemList) {
    if (Object.prototype.hasOwnProperty.call(ItemList, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
		newStyle[key] = { ...StyleSheet.flatten(ItemList[key]) };
		if(key == 'Line') {
			newStyle[key].borderBottomColor = '#3d3d3d';
		}
		
    }
}

class PersonalAccount extends Component {

    //构造函数
    constructor(props) {
        super(props)
        this.PhoneVerify = this.PhoneVerify.bind(this)
	    this.EmailVerify = this.EmailVerify.bind(this)
		this.navigateToScene = this.navigateToScene.bind(this)
		this.openDomin = this.openDomin.bind(this)
		this.openCS = this.openCS.bind(this);

        this.state = {
            refreshing: false,
            isLoreMoreing: 'LoreMoreing',
			dataSource: [],
			// VPNchecked: VPNCheck,
			//VPNchecked: false,
			memberInfo:'',
			phoneNumber:'',
			email:'',
			MemberCode:'',  
			statistics:0,
			refresh:false,
			TotalBalA:0,
			totalUnreadCount: 0,
			unreadAnnouncementCount: 0,
			unreadPersonalMessageCount: 0,
			unreadTransactionMessageCount: 0,
			isOpenRecommend: false,
			recommendCircleStatus: true,
			recommendCircleStatus: true,
			EventTitleName:null,
			EventTemplateName:null,
			tName:'', //JVENT templateName
			eName:'',//JVENT eventName
        } 
    } 

    componentDidMount() { 
		this.getRecommendCircleStatus()
		this.GetNewsUnreadNews()
		// Platform.OS == 'android' && this.addListenANDROID()
			this.getUser(); 
			this.GetDomain();
			this.GetCS();
 
			// this.NewsGet();
 
			this.props.getVipInforAction && this.props.getVipInforAction()
			
			this.loadInterval = setInterval(() => {
				if (ApiPort.UserLogin == false) {
					clearInterval(this.loadInterval)
					return;
				}
		   }, 30000)

		   this.loadInterval2 = setInterval(() => {   //檢查餘額
			   this.reloadMoney();
			//    this.NewsGet();
			 }, 60000)

	} 
	componentWillUnmount() {
        // this.ANDROIDtoRN && this.ANDROIDtoRN.remove();
        // this.ANDROIDtoRN = null;
	}
	
	GetNewsUnreadNews() {
		fetchRequest(ApiPort.GetNewsUnreadNews, 'GET').then(res => {
			this.setState({
				totalUnreadCount: res.totalUnreadCount,
				unreadAnnouncementCount: res.unreadAnnouncementCount,
				unreadPersonalMessageCount: res.unreadPersonalMessageCount,
				unreadTransactionMessageCount: res.unreadTransactionMessageCount,
			})
		})
	}
	 
	 getUser(){
	 	
	 
	 	fetchRequest(ApiPort.Member, 'GET')
	 			.then(data => {  
	 					
	 					this.setState({
	 						memberInfo:data.result.memberInfo,
						 }) 
						  
						 window.AvatarPicture = data.result.memberInfo.AvatarPicture
						 global.storage.save({
							key: 'memberInfo', // 注意:请不要在key中使用_下划线符号!
							id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
							data: data.result,
							expires: null
						});
						let memberInfo = data.result.memberInfo
						let Contacts = memberInfo.Contacts
						let isHaveQQ = Boolean(Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'QQ'))
						let isHaveWeChat = Boolean(Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'WECHAT'))
						window.isHaveVipQQWeChat = (!isHaveQQ && !isHaveWeChat) ? true : false
					  
	 					if(data.result.memberInfo.Contacts.length == 1){
	 						if(data.result.memberInfo.Contacts[0].Status != "Verified"){
	 								//alert('手机号未验证 ,邮箱未填')
									
	 						}
							
							this.setState({ 
								phoneNumber:data.result.memberInfo.Contacts[0].Contact,
								phoneStatus:data.result.memberInfo.Contacts[0].Status,
								email:'',
								emailStatus:'ยังไม่ได้กรอกข้อมูล'//'未填写',
							})
							
							
	 					}else if(data.result.memberInfo.Contacts.length != 1){
	 						
	 						if(data.result.memberInfo.Contacts[0].Status != "Verified"){
	 							//alert('邮箱未验证')
								
	 						}
	 						
							
							 if(data.result.memberInfo.Contacts[0].ContactType == "Phone"){
								 this.setState({ 
								 	email:data.result.memberInfo.Contacts[1].Contact,
								 	emailStatus:data.result.memberInfo.Contacts[1].Status,
								 	phoneNumber:data.result.memberInfo.Contacts[0].Contact,
								 	phoneStatus:data.result.memberInfo.Contacts[0].Status,
								 })
							 }else{
								 this.setState({ 
								 	email:data.result.memberInfo.Contacts[0].Contact,
								 	emailStatus:data.result.memberInfo.Contacts[0].Status,
								 	phoneNumber:data.result.memberInfo.Contacts[1].Contact,
								 	phoneStatus:data.result.memberInfo.Contacts[1].Status,
								 })
							 }
							  
						 }
						 

						 if(window.ReloadAccount){
 
 
								ReloadAccount();
 
							
						  }

	 					  
	 				}).catch(error => {
	 							//Toast.hide();
	 					 	
	 			}) 
	 }
	 
	 
	 
	 /*手机号码验证*/
	     PhoneVerify() {
	         let ST = this.state;
			 Actions.Phone({memberInfo:this.state.memberInfo,phoneNumber:this.state.phoneNumber,email:this.state.email});
	 							
	     }
	 
	     /*邮箱验证*/
	     EmailVerify() {
	         let ST = this.state;
					 
	         const EmailData = {
	             "emailVerificationServiceType": "VerifyandUpdate",
	             "memberCode": userNameDB,//ST.memberInfo.MemberCode,
	             "email": ST.email,
	             "ipAddress": "",
	             "domainUrl": '',
	         }
	           
				      Toast.loading('发送中,请稍候...',200);
					 fetchRequest(ApiPort.POSTEmailVerifyAPI+'?', 'POST',EmailData)
					 		.then(data => {  
								Toast.hide();
					 					  
					 					if (data.isSuccess == true) {
					 						Toast.success('已发送，请登入注册邮箱完成验证!' , 2); 
					 					}else if(data.isSuccess == false){ 
					 							Toast.fail(data.result.message , 2);
					 					}
					 						
					 			}).catch(error => { 
					 				Toast.fail(data.errorMessage , 1); 
					 				 
					 		}) 
	     }
			 
	  //跳轉
	  navigateToScene(key){
		  console.log(key) 

		  let piwikMsg = key
		  let piwkCategory = 'Navigation';
		  let piwkAction = 'View';

		  switch (key) {
			  case 'UserAccount':
				  piwkCategory = 'Account';
				  piwikMsg = 'Profile'
				  break;
			  case 'Message':
				  piwkCategory = 'Notification';
				  piwikMsg = 'Notification'
				  break;
			  case 'SecurityCode':
				  piwkCategory = 'Verification';
				  piwkAction = 'Click'
				  piwikMsg = 'Passcode'
				  break;
			  case 'Partnership':
				  piwkCategory = 'Navigation';
				  piwkAction = 'View'
				  piwikMsg = 'AFFPage_ProfileCenter'
				  break;
			  case 'SharePage':
				  piwkAction = 'Click'
				  piwikMsg = 'ShareAPP'
				  break;
			  case 'VipScene':
				  piwkCategory = 'VIP Page'
				  piwikMsg = 'VIPPage'
				  UMonEvent(piwkCategory, piwkAction, piwikMsg + '_ProfileCenter')
				  Actions.jump('Vip')
				  return
			  case 'HelpCenterScene':
				  piwkCategory = 'CS'
				  piwikMsg = 'HelpPage'
				  UMonEvent(piwkCategory, piwkAction, piwikMsg + '_ProfileCenter')
				  Actions.HelpCenter({})
				  return;
			  default:
				  break;
		  }
		  
		  if(key == 'news'){
			  piwikMsg = 'Inbox_profile'
		  }

		  if(key == 'Announcements'){
			piwikMsg = 'Announcement'
		}
		

		if(key == 'SponsorshipNewScene'){
			piwikMsg = 'Sponsorship_profile'
		}
 
		if(key == 'BettingHistory'){
			piwikMsg = 'Betrecord_profile'
		}
		
		

		  UMonEvent(piwkCategory, piwkAction, piwikMsg + '_ProfileCenter')

		  if(key == 'news'){ 
			 this.NewsOpen(); 
			   }
			   
			   if(key === 'Message') {
				Actions.Message({
				 totalUnreadCount: this.state.totalUnreadCount,
				 unreadAnnouncementCount: this.state.unreadAnnouncementCount,
				 unreadPersonalMessageCount: this.state.unreadPersonalMessageCount,
				 unreadTransactionMessageCount: this.state.unreadTransactionMessageCount,
				 GetNewsUnreadNews: () => {
					 this.GetNewsUnreadNews()
				 }
				})
				return
			}

	    Actions[key]({memberInfo:this.state.memberInfo,phoneNumber:this.state.phoneNumber,email:this.state.email});  
	  }
    
	  DomainC(key){

		 //測試
		 navigateToSceneGlobe();

			if (key == 1) {
				window.common_url = 'https://gatewaystaging.jbo88.biz'
				SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key == 2) {
				window.common_url = 'https://gateway.jbo08.com'
				SBTDomain = 'https://www.jbo08.com/'
			} else if (key == 10) {
				window.common_url = 'https://gatewaystaging10.jbo88.biz'
				SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key === '03') {
					window.common_url = 'https://gatewaystaging03.jbo88.biz'
					SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key === '04') {
				window.common_url = 'https://gatewaystaging04.jbo88.biz'
				SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key === '05') {
				window.common_url = 'https://gatewaystaging05.jbo88.biz'
				SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key === '06') {
				window.common_url = 'https://gatewaystaging06.jbo88.biz'
				SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key === '07') {
				window.common_url = 'https://gatewaystaging07.jbo88.biz/'
				SBTDomain = 'http://www.staging.jbo88.biz'
			} else if (key === '08') {
				window.common_url = 'https://gatewaystaging08.jbo88.biz/'
				SBTDomain = 'http://www.staging.jbo88.biz'
			}


		 global.storage.remove({
			key: 'GameDatdPT',
			id: 'PT'
		 });
		 
		 global.storage.remove({
			key: 'GameDatdSPG',
			id: 'SPG'
		 });
		 

		 global.storage.remove({
			key: 'GameDatdPGS',
			id: 'PGS'
		 });
		 

		 global.storage.remove({
			key: 'GameDatdTGP',
			id: 'TGP'
		 });
		 

		 global.storage.remove({
			key: 'GameDatdMGSQF',
			id: 'MGSQF'
		 });

		 global.storage.remove({
			key: 'GameDatdBSG',
			id: 'BSG'
		 });
		 ReloadGameBox(); 
	  }


	  logoutUJ(key,item,logoutx){ 
			    this.logout();  
				//not using mapDispatchToProps
				ApiPort.Token = "";
				ApiPort.UserLogin = false;
				  
				global.storage.remove({
						key: 'memberInfo',
						id: 'memberInfos'
				});
				
				global.storage.remove({
					key: 'Bank', // 注意:请不要在key中使用_下划线符号!
					id: 'BankData', 
				})
				//Toast.hide(); 
				  this.props.logout();
				  setTimeout(()=>{Gologin = true }, 2000)  
				  key = 'login';
				
				return; 
		 
	  } 
	
	  reloadMoney(){ //刷新餘額 
		this.setState({
			TotalBalA:this.state.TotalBalA != TotalBal ? TotalBal :this.state.TotalBalA
		})

	  }

	  NewsGet(){  //獲取消息 


	

		fetchRequest(ApiPort.Statistics+'?key=unreadNewsCount&', 'GET')
		.then(data => {   
		  this.setState({
			statistics:data.statistics,
			// statistics:1
		  })
  
		 }).catch(error => {
   
			 
		})  
 
	}
	

	NewsOpen(){  //獲取消息
		

		fetchRequest(ApiPort.Statistics+'?key=unreadNewsCount&', 'PUT')
		.then(data => {    
 
	   
		 }).catch(error => {
   
			 
		})  
 
	}




	  GetDomain(){  //合作夥伴 
		
		fetchRequest(ApiPort.Domain+'?', 'GET')
				      .then(data => {  
						
							this.setState({
								DomainX:data.affiliateUrlLM,
							}) 
		               }).catch(error => { 
						   
	  				  })  
	 }

	 GetCS() {
		//CS Live Chat App Download
	
		fetchRequest(ApiPort.GetDownloadLink + "domain=" + SBTDomain + '&', "GET")
		.then((data) => {
		  console.log('data',data)
		  if (data.downloadLinks[0]) {
			let url = data.downloadLinks[0].downloadUrl;
			if (url) { Toast.hide() }
			this.setState({
			  LiveChatDownloadUrl: url
			})
		  }
	
		})
		.catch((error) => {});
	  }

	openDomin(url){   
		if(url == undefined){ 
			UMonEvent('Navigation','View','AFFPage_ProfileCenter')
			Linking.openURL(this.state.DomainX)
			return;
		} 
		
		Linking.openURL(url)

	}

	openCS(url) {
		if (url == undefined) {
		  Linking.openURL(this.state.LiveChatDownloadUrl);
		  return;
		}
	
		Linking.openURL(url);
	}


	jumpDep(){
		Actions.jump('deposit')
		UMonEvent('Deposit Nav','Click','Deposit_ProfileCenter');
		setTimeout(() => { reloadPage('deposit')   }, 100)
	}

	
	jumpDepWith(){
		Actions.jump('deposit')
		UMonEvent('Withdrawal Nav','Click','Withdrawal_ProfileCenter');
		setTimeout(() => { reloadPage('withdrawals')  }, 100)

		
	}

	Mlogout(){
		this.loadInterval && clearInterval(this.loadInterval);
		this.loadInterval2 && clearInterval(this.loadInterval2);
		global.localStorage.removeItem("newRegist");
		global.localStorage.removeItem("userName");
		UMonEvent('Logout_profile');
		navigateToSceneGlobeX();
		noFastLogin = true;
	} 
	//刷新余额
	getMoney() {
		window.ReloadMoneyHome && ReloadMoneyHome()
	}
	// onSwitchClick() {
	// 	if(!this.state.VPNdisabled) {
	// 		this.onSwitchChange(!this.state.VPNchecked)
	// 	}
	// }

	// onSwitchChange = (value: any) => {
    //     if(value) {
    //         NativeModules.opeinstall.openVPN('openVPN')//测试环境开发不打开vpn
    //     } else {
    //         NativeModules.opeinstall.closeVPN('closeVPN')//测试环境开发不打开vpn
    //     }
    //     this.setState({
    //       VPNchecked: value,
    //       VPNdisabled: true,
    //     });
    //     window.VPNCheck = value;
    //     setTimeout(() => {
    //         this.setState({ VPNdisabled: false })
    //     }, 1500);
    // }
    //创建android监听，是否获取vpn权限
	// addListenANDROID() {
	// 	this.ANDROIDtoRN = DeviceEventEmitter.addListener('sendMsgToRN',(res)=>{
	// 		if(res == 'VPNCheck') {
    //             // this.setState({VPNchecked: true})
    //             window.VPNCheck = true;
	// 		} else if(res == 'isVPNCheck') {
    //             // this.setState({VPNchecked: false})
    //             window.VPNCheck = false;
	// 		}
    //     })
    //     NativeModules.opeinstall.addVPNListen('VPNListen')//通知android创建vpn监听
	// }

	getQueleaActiveCampaign() {
		Toast.loading('กำลังโหลด',200)
		//Toast.loading('加载中...', 2000) 
		fetchRequest(ApiPort.GetQueleaActiveCampaign + '?', 'GET').then(res => {
			Toast.hide()
			if (res.isSuccess) {
				let result = res.result
				Actions.Recommend({})
				this.setState({
					recommendCircleStatus: false
				}, () => {
					global.storage.save({
						key: 'RecommendCircleStatus' + memberCode,
						id: 'RecommendCircleStatus' + memberCode,
						data: true,
						expires: null
					})
				})

				global.storage.save({
					key: 'QueleaActiveCampaign' + memberCode,
					id: 'QueleaActiveCampaign' + memberCode,
					data: result,
					expires: null
				})
			} else {
				this.setState({
					isOpenRecommend: true
				})
			}

		}).catch(err => {
			Toast.hide()
		})
		UMonEvent && UMonEvent('RAF','Click','RAF_profile')
	}
	
	getRecommendCircleStatus() {
		global.storage.load({
            key: 'RecommendCircleStatus' + memberCode,
            id: 'RecommendCircleStatus' + memberCode
        }).then(res => {
            this.setState({
				recommendCircleStatus: false
            })
        }).catch(() => {
			this.setState({
				recommendCircleStatus: true
			})
        })
	}

	//金額加千位分隔格點
	payMoneyFormat(value) {
		return value == ""
		  ? value
		  : parseInt(value) > 0 &&
			  value.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
	}

	_dropdown_2_renderButtonText(rowData) {
		return `${rowData.eventTitle} - ${rowData.templateName}`;

	  }

	  _dropdown_3_renderRow(rowData, rowID, highlighted) {
			
		let evenRow = rowID % 2;
		return (
		  <Flex
			style={{
			  width: width *0.8,
			  backgroundColor: "#000",
			  padding:5
			}}
		  >
			<Flex.Item style={styles.dropdown_2_rowDS}>
			  <Text
				style={[
				  { color:  "#fff" },
				  highlighted && { color: "#fff" }
				]}
			  >
				{`${rowData.eventTitle} - ${rowData.templateName}`}
			  </Text>
			</Flex.Item>
		  </Flex>
		);
	  }

	//選擇活動
	onSelect = key => {
		this.setState({EventTitleName:EventFloatIconList[key].eventTitle,
			EventTemplateName:EventFloatIconList[key].templateName})
		
	  };

	 //前往活動頁
	 gotoEventPage(){
		if(this.state.tName=='' || this.state.eName=='') return
		isEventPreview=true
		getLotteryStatus(this.state.eName,this.state.tName)
	  }


    render() {

		 const {totalUnreadCount, email , phoneNumber ,emailStatus,phoneStatus,memberInfo} = this.state;
		 const {tName,eName,recommendCircleStatus, isOpenRecommend } = this.state
		 window.memberData =() =>{
			 this.getUser();
		 }

		 window.GetMoney =() => { 
			this.setState({ 
			    refresh:!this.state.refresh
			}) 
		 }

		 window.CloseReLoAccount = ()=>{
			// Toast.fail('重复登录,系统检测到您重复登录  ',3)
			this.loadInterval && clearInterval(this.loadInterval);
			this.loadInterval2 && clearInterval(this.loadInterval2);
		 }

		 window.GetNewsUnreadNews = () => {
			this.GetNewsUnreadNews()
		}
		window.reloadgapge2 = () => {
			this.setState({})
		}


		 
        return (
            	<View style={{felx:1,height:height,backgroundColor:'#1a1a1a'}}>

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
										window.reloadgapge1 && window.reloadgapge1()
										window.reloadgapge2 && window.reloadgapge2()
                                        this.setState({})
										Actions.depositTx()
                                    }}>
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
					animationType='fade'
					visible={isOpenRecommend}
					transparent={true}
				>
					<View style={styles.modalOverly}>
						<View style={styles.modalContainer}>
							<TouchableOpacity
								style={styles.contactDetailsModalX}
								hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
								onPress={() => {
									this.setState({
										isOpenRecommend: false
									})
								}}
							>
								<Text style={styles.contactDetailsModalXText}>X</Text>
							</TouchableOpacity>
							<View style={styles.successCircle}>
								<Text style={styles.successCircleText}>{'!'}</Text>
							</View>

							<Text style={styles.vipModalText1}>โปรแกรมแนะนำเพื่อนยังไม่เปิดให้บริการ</Text>
							<Text style={styles.vipModalText2}>โปรดติดตามการแนะนำเพื่อนเพื่อรับเงินเดิมฟรีเร็วๆนี้</Text>

							{/* <Text style={styles.vipModalText1}>推荐好友活动暂未开放</Text>
							<Text style={styles.vipModalText2}>敬请期待竞博推荐好友获取彩金活动</Text> */}
							<TouchableOpacity style={[styles.vipModalSuccessBtn]} onPress={() => {
								this.setState({
									isOpenRecommend: false
								})
							}}>
								<Text style={[styles.vipModalSuccessBtnText]}>รับทราบ</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
					
					{/*2021/08/17, VIP 8,9,10 删除这个Line部分*/}
					{/*{*/}
					{/*	window.isHaveVipQQWeChat && this.props.vipInforData && */}
					{/*	this.props.vipInforData.currentLevelInfo && this.props.vipInforData.currentLevelInfo.rank >= 8 */}
					{/*	&& (*/}
					{/*		<View style={[styles.updateVipBox]}>*/}
					{/*			<View style={{flexDirection: 'row'}}>*/}
					{/*				<View style={styles.updateVipBoxText1Box}>*/}
					{/*					<Text style={styles.updateVipBoxText1}>!</Text>*/}
					{/*				</View>*/}
					
					{/*				<Text style={styles.updateVipBoxText2}>อัปเดตข้อมูลการติดต่อเพื่อเลื่อนระดับสู่ VIP</Text>*/}
					{/*			</View>*/}
					{/*			/!* <Text style={styles.updateVipBoxText2}>更新通讯账号，即可提升VIP 等级</Text> *!/*/}
					{/*			<View>*/}
					{/*				<TouchableOpacity style={styles.updateVipBoxBtn} onPress={() => {*/}
					{/*					Actions.ContactDetails({*/}
					{/*						memberInfo: this.state.memberInfo,*/}
					{/*						getUser: () => {*/}
					{/*							this.getUser()*/}
					{/*						}*/}
					{/*					})*/}
					{/*				}}>*/}
					{/*					<Text style={styles.updateVipBoxBtnText}>อัปเดตเลย</Text>*/}
					{/*				</TouchableOpacity>*/}
					{/*			</View>*/}
					{/*		</View>*/}
					{/*	)*/}
					{/*}*/}
										<ImageBackground
											style={{ width: width, height: 260}}
											resizeMode="stretch"
											source={require("../images/user/upper-background.png")}
										>
											<Flex style={{position: 'absolute',top: 0,right: 10,zIndex: 15}}> 
												<TouchableOpacity onPress={() => { Actions.LiveChatST()}}>
													<Flex.Item alignItems='center'> 
													{LivechatDragType == false ?  
														<Image
														resizeMode="stretch"
														// source={require("../images/home/icon-cs.gif")}
														source={require("../images/home/icon_cs_new.png")}
														style={{ width: 28, height: 28 ,marginTop: 10}}
													/>
														:LivechatDragType == true &&
														<Image
														resizeMode="stretch"
														source={require("../images/home/icon-cshover.png")}
														style={{ width: 28, height: 28,marginTop: 10 }}
													/> 
														} 
												 	</Flex.Item>  
												</TouchableOpacity>
            								</Flex> 
											<Flex style={styles.gameBg0}>
						<Flex.Item alignItems='center'>
							<Image resizeMode='stretch'
								source={window.AvatarPicture ? { uri: window.AvatarPicture } : require('../images/user/avator.png')}
								//source={require('../images/user/avator.png')}
								style={{ width: 100, height: 100, marginTop: 20, borderRadius: 50 }}
							/>
						</Flex.Item>

					</Flex> 
             
					<View style={[styles.gameBg0, { flexDirection: 'row' }]}>
						<Text style={{ color: "#fff", fontSize: 14 }}>{userNameDB}</Text>
						{
							this.props.vipInforData && this.props.vipInforData.currentLevelInfo && <View style={{backgroundColor: '#00E62E', borderRadius: 1000, marginLeft: 8, paddingHorizontal: 6, paddingVertical: 1}}><Text style={{ color: '#222222' }}>{this.props.vipInforData.currentLevelInfo.levelName}</Text></View>
						}
					</View> 

											<Flex style={styles.gameBg0}> 
												<Flex.Item alignItems='center' style={{paddingLeft:20}}>
													<View style={{flexWrap: 'wrap', display:'flex', flexDirection: 'row',}}>
														<Text style={{textAlign: 'center',color:"#fff4a6",fontSize:18,fontWeight:'bold'}}>{this.payMoneyFormat(TotalBal)} ฿</Text>
														<Touch onPress={()=> this.getMoney()}>
															<Image resizeMode='stretch' source={require('../images/user/refresh.png')} style={{ width: 23, height: 23,marginLeft:8}} />
														</Touch>
													</View>
												</Flex.Item>   

											</Flex> 
            								
            							<Flex> 
            									<Flex.Item style={{justifyContent: 'center',flexDirection: 'row',marginTop: 15}}> 
												<Touch onPress={()=> this.jumpDep()}>
													<View style={[styles.dpowithd,{borderColor: '#00e62c',marginRight: 12}]}>
															<Image resizeMode='stretch' source={require('../images/user/Dpo.png')} style={{ width: 23, height: 23}} />
															<Text style={{color:"#00e62c",fontSize:18}}>ฝาก</Text>
													</View> 
												</Touch>
												<Touch onPress={()=> this.jumpDepWith()}>
													<View style={[styles.dpowithd,{borderColor: '#02c9ff'}]}>
															<Image resizeMode='stretch' source={require('../images/user/withd.png')} style={{ width: 23, height: 23}} />
															<Text style={{color:"#02c9ff",fontSize:18}}>ถอน</Text>
													</View> 
												</Touch>		
            									</Flex.Item>
            					 	</Flex>
								</ImageBackground>
            								 
							 {/* <WhiteSpace size="lg" /> */}
				<View style={{position: 'absolute',top: 236,left: 0}}>
					<ImageBackground
						style={{ width: width, height: 35,overflow: 'hidden'}}
						resizeMode="cover"
						source={require("../images//user/background-shadow.png")}
					>
					</ImageBackground>
				</View>
				<View style={styles.UserList}>
				<ImageBackground
					style={{ width: width, height: height, flex: 1,borderRadius: 10,overflow: 'hidden'}}
					resizeMode="repeat"
					source={require("../images//home/pattern.png")}
				>
					<ScrollView
						style={{ Flex:1}}
						automaticallyAdjustContentInsets={false}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						> 

						{/* 個人資料 */}
						<Flex style={styles.gameBg2}>	  
											 
							<Flex.Item style={styles.flexItemStyle}>

								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
									<Touch style={styles.listItemTouch} onPress={()=> this.navigateToScene('UserAccount')}>
									<Image resizeMode='stretch' source={require('../images/user/icon-profile.png')} style={styles.listItemIcon} />
									<Text style={{fontSize:14,color:'#fff'}}>จัดการบัญชี</Text>  
									
									</Touch> 
								</List.Item> 

							</Flex.Item>
											  
						</Flex>

						{/* 消息公告 */}
						<Flex style={styles.gameBg2}>
							<Flex.Item style={styles.flexItemStyle}>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}>
									<Touch style={[styles.listItemTouch]} onPress={() => this.navigateToScene('Message')}>
										<Image resizeMode='stretch' source={require('../images/user/icon-notice.png')} style={styles.listItemIcon} />
										<Text style={{ fontSize: 14, color: '#fff' }}>ประกาศ</Text>
										
										{
											totalUnreadCount > 0 && <View style={{
												backgroundColor: '#D20F26', paddingVertical: 2,
												borderRadius: 1000, width: 30, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 90
											}}>
												<Text style={{ color: '#FFFFFF', fontSize: 12 }}>{this.state.totalUnreadCount > 99 ? '99+' : this.state.totalUnreadCount}</Text>
											</View>
										}
									</Touch>
								</List.Item>
							</Flex.Item>
						</Flex>

						{/* 投注记录 */}
						<Flex style={styles.gameBg1}>
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}>
									<Touch style={{ width: width, height: 20 }} onPress={() => this.navigateToScene('BettingHistory')}>
										<Image resizeMode='stretch' source={require('../images/bettingicon.png')} style={[styles.listItemIcon, { height: 23, width: 23}]} />
										<Text style={{ fontSize: 14, color: '#fff' }}>ประวัติการเดิมพัน</Text>
									</Touch>
								</List.Item>
							</Flex.Item>
						</Flex>

						{/* 推荐好友 */}
						<Flex style={styles.gameBg1}>
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)}
										   style={{backgroundColor: 'transparent'}}>
									<Touch style={{width: width, height: 20, justifyContent: 'center'}}
										   onPress={this.getQueleaActiveCampaign.bind(this)}>
										<Image resizeMode='stretch'
											   source={require('../images/user/icon-announcement1.png')}
											   style={styles.listItemIcon}/>
										<Text style={{fontSize: 14, color: '#fff'}}>แนะนำเพื่อน</Text>

										{
											recommendCircleStatus && <View style={{
												width: 8,
												height: 8,
												borderRadius: 1000,
												backgroundColor: '#00BF26',
												alignItems: 'center',
												justifyContent: 'center',
												position: 'absolute',
												right: 90
											}}>
											</View>
										}
									</Touch>
								</List.Item>
							</Flex.Item>
						</Flex>

						{/* 创建安全码 */}		
						<Flex style={styles.gameBg2}>	  																					 
							<Flex.Item style={styles.flexItemStyle}> 
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
									<Touch style={styles.listItemTouch} onPress={()=> this.navigateToScene('SecurityCode')}>
									<Image resizeMode='stretch' source={require('../images/user/key.png')} style={styles.listItemIcon} />
								<Text style={{fontSize:14,color:'#fff'}}>รหัสรักษาความปลอดภัย</Text> 
								
									</Touch>
									
								</List.Item>					
							</Flex.Item>
											 																					
						</Flex>

						{/* VIP 中心 */}
						<Flex style={styles.gameBg1}>
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}>
									<Touch style={{ width: width, height: 20 }} onPress={() => this.navigateToScene('VipScene')}>
										<Image resizeMode='stretch' source={require('../images/user/icon-vip.png')} style={[styles.listItemIcon, { height: 20, width: 20 }]} />
										<Text style={{ fontSize: 14, color: '#fff' }}>VIP</Text>
										{/* <View style={{ width: 26, height: 18, backgroundColor: '#ff4a2d', borderRadius: 500, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 90 }}>
											<Text style={{ color: '#fff', fontSize: 12 }}>新</Text>
										</View> */}
									</Touch>
								</List.Item>
							</Flex.Item>
						</Flex>

						{/* 贊助 */}
						<Flex style={styles.gameBg1}>
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}>
									<Touch style={{ width: width, height: 20 }} onPress={() => this.navigateToScene('SponsorshipNewScene')}>
										<Image resizeMode='stretch' source={require('../images/user/SponsorshipIcon.png')} style={[styles.listItemIcon, { height: 20, width: 20 }]} />
										<Text style={{ fontSize: 14, color: '#fff' }}>สปอนเซอร์</Text>

									</Touch>
								</List.Item>
							</Flex.Item>
						</Flex>
																			 
						{/* 合作加盟 */}
						<Flex style={styles.gameBg1}>	
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
									<Touch style={styles.listItemTouch} onPress={()=> this.openDomin()}> 
										<Image resizeMode='stretch' source={require('../images/user/alliance.png')} style={styles.listItemIcon} />
										<Text style={{fontSize:14,color:'#fff'}}>พันธมิตร</Text>
										
									</Touch> 
								</List.Item>
							</Flex.Item>
						
						</Flex>

						{/* APP分享 */}					
						<Flex style={styles.gameBg1}>	
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
									<Touch style={{width:width,height:20}} onPress={()=> this.navigateToScene('SharePage')}> 
										<Image resizeMode='stretch' source={require('../images/user/icon-share.png')} style={styles.listItemIcon} />
										<Text style={{fontSize:14,color:'#fff'}}>แชร์แอป</Text>
									
									</Touch> 
								</List.Item>
							</Flex.Item>
						
						</Flex>

						{/* APP下载 */}
						<Flex style={styles.gameBg1}>	
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
									<Touch style={{width:width,height:20}} onPress={()=> this.openCS()}> 
										<Image resizeMode='stretch' source={require('../images/user/icon-dwn.png')} style={[styles.listItemIcon, { height: 20, width: 15, marginLeft:4}]} />
										<Text style={{fontSize:14,color:'#fff'}}>ดาวน์โหลดแอป</Text>
									
									</Touch> 
								</List.Item>
							</Flex.Item>
						
						</Flex>
						

						{/* <Flex style={styles.gameBg1}>
									<Flex.Item>
										<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}>
											<Touch style={{ width: width, height: 20 }} onPress={() => this.navigateToScene('BettingHistory')}>
												<Image resizeMode='stretch' source={require('./../images/bettingicon.png')} style={[styles.listItemIcon, { height: 20, width: 16, marginLeft: 4 }]} />
												<Text style={{ fontSize: 14, color: '#fff' }}>投注记录</Text>
											</Touch>
										</List.Item>
									</Flex.Item>
								</Flex> */}

						{/* 检测版本及更新 */}
						<Flex style={styles.gameBg1}>	
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}} >

									<Touch style={styles.listItemTouch} onPress={()=> CheckUptateGlobe('ProfileCenter')}>
										{
										Platform.OS == 'android'? 
										<Image resizeMode='stretch' source={require('../images/user/icon-update1.png')} style={styles.listItemIcon} />
										:
										<Image resizeMode='stretch' source={require('../images/user/icon-update.png')} style={styles.listItemIcon} />
										} 
										<Text style={{fontSize:14,color:'#fff'}}>ตรวจสอบเวอร์ชั่นและอัปเดต</Text>
										{/* <Text style={{fontSize:14,color:'#fff'}}>检测版本及更新</Text> */}
										<Text style={{textAlign: 'left',paddingLeft:13, color:"#1aff00", fontSize: 14,position: 'absolute',right: 90}}>V{JBOVersion}</Text>
									</Touch> 
								</List.Item>
							</Flex.Item>											
						</Flex>

						<Flex style={styles.gameBg1}>
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}>
									<Touch style={{ width: width, height: 20 }} onPress={() => this.navigateToScene('HelpCenterScene')}>
										<Image resizeMode='stretch' source={require('../images/user/icon-faq.png')} style={[styles.listItemIcon, { height: 20, width: 20 }]} />
										<Text style={{ fontSize: 14, color: '#fff' }}>ช่วยเหลือ</Text>
										{/* <View style={{ width: 26, height: 18, backgroundColor: '#ff4a2d', borderRadius: 500, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 90 }}>
												<Text style={{ color: '#fff', fontSize: 12 }}>新</Text>
											</View> */}
									</Touch>
								</List.Item>
							</Flex.Item>
						</Flex>

						{/* 活動頁面 preview 切換 */}

						{ common_url !=  'https://gateway.jb88app.com' && 
											  <View style={{flexDirection:'row',height:90,alignItems:'center'}}>
											  <View style={{margin:20, width:width*0.6,height:90,justifyContent:'center'}}>
											  <TextInput 
													style={[styles.input,{color:'#fff',borderColor:'#fff',borderWidth:1,padding:8,marginBottom:8}]}
													value={tName}
													underlineColorAndroid='transparent'
													placeholder='請輸入 templateName'
													placeholderTextColor='#d4d4d4'
													type='text'
													returnKeyType='done'
													onChangeText={value => {this.setState({tName:value})}}>
												</TextInput>
												<TextInput 
													style={[styles.input,{color:'#fff',borderColor:'#fff',borderWidth:1,padding:8}]}
													value={eName}
													underlineColorAndroid='transparent'
													placeholder='請輸入 eventName'
													placeholderTextColor='#d4d4d4'
													type='text'
													returnKeyType='done'
													onChangeText={value => {this.setState({eName:value})}}>
												</TextInput>
												{/* <ModalDropdown  
												ref={el => (this._dropdown_3 = el)} 
												textStyle={{ fontSize: 13,paddingLeft:10,
													color: "#fff",}}
												dropdownStyle={{
													borderRadius: 1,
													shadowOffset: { width: 0, height: 0 },
													shadowOpacity: 0.6,
													shadowRadius: 5,
													shadowColor: "#666",
													backgroundColor:'#000',
													color:'#fff',
													//注意：这一句是可以让安卓拥有灰色阴影
													elevation: 4}}
												options={EventFloatIconList}
												renderButtonText={rowData =>
													this._dropdown_2_renderButtonText(rowData)
												  }
												  renderRow={this._dropdown_3_renderRow.bind(this)}
												  onSelect={this.onSelect}
												/> */}
												
											  </View>
											  <TouchableOpacity onPress={()=>this.gotoEventPage()}>
											  <View style={{backgroundColor:'#CCC',width:100,height:30,justifyContent:'center'}}>
											  <Text style={{textAlign:'center'}}>前往活動頁面</Text>
											  </View>   
										     </TouchableOpacity>
										  </View>
											
						}


						{ common_url !=  'https://gateway.jb88app.com' &&  
							<Flex style={styles.gameBg1}>	
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}>

								<Touch style={styles.listItemTouch} onPress={()=> this.DomainC('1')}> 
								<Text style={{fontSize:14,color:'#fff'}}>换Domain ST</Text>
								</Touch> 
								</List.Item>
								</Flex.Item>
							
							</Flex>

						}


						{ common_url !=  'https://gateway.jb88app.com' && 
						
						<Flex style={styles.gameBg1}>	
						<Flex.Item>
							<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}>

							<Touch style={styles.listItemTouch} onPress={()=> this.DomainC('2')}> 
							<Text style={{fontSize:14,color:'#fff'}}>换Domain SL</Text>
							</Touch> 
							</List.Item>
							</Flex.Item>
						
						</Flex>

						}

						{common_url != 'https://gateway.jb88app.com' &&
						<Flex style={styles.gameBg1}>
							<Flex.Item>
								<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)}
													 style={{backgroundColor: 'transparent'}}>
									<Text style={{fontSize: 14, color: '#fff'}}>當前使用 {window.common_url}</Text>
								</List.Item>
							</Flex.Item>
						</Flex>
						}

						{common_url != 'https://gateway.jb88app.com' && ['01', '02', '03','04','05','06','07','08', '09'].map((item, index) => {
							return (
								<Flex style={styles.gameBg1}>
									<Flex.Item>
										<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)}
															 style={{backgroundColor: 'transparent'}}>

											<Touch style={{width: width, height: 20}} onPress={() => this.DomainC(item)}>
												<Text style={{fontSize: 14, color: '#fff'}}>换{item} ST</Text>
											</Touch>
										</List.Item>
									</Flex.Item>

								</Flex>
							);
						})
						}
							{
								// Platform.OS == 'android' &&
								// <Flex style={styles.gameBg1}>
								// 	<Flex.Item>
								// 		<List.Item
								// 			// arrow="horizontal"
								// 			styles={StyleSheet.create(newStyle)} style={{ backgroundColor: 'transparent' }}
								// 			extra={
								// 				<Switch
								// 					style={{ color: '#fff' }}
								// 					checked={this.state.VPNchecked}
								// 					onChange={this.onSwitchChange}
								// 					disabled={this.state.VPNdisabled}
								// 				/>
								// 			}
								// 		>
								// 			<Touch style={{ width: width, height: 20 }} onPress={() => this.onSwitchClick()}>
								// 				<Image resizeMode='stretch' source={require('../images/user/DNSIcon.png')} style={{ width: 24, height: 24, position: 'absolute', left: -40 }} />
								// 				<Text style={{ fontSize: 14, color: '#fff' }}>DNS防劫持</Text>
								// 			</Touch>
								// 		</List.Item>
								// 	</Flex.Item>

								// </Flex>
							}

							{/* 退出 */}
							<Flex style={[styles.gameBg1,{paddingBottom:140, marginBottom: 140}]}>	
								<Flex.Item>
									<List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}} >
										<Touch style={styles.listItemTouch} onPress={()=> this.Mlogout()}> 
											{
											Platform.OS == 'android'? 
											<Image resizeMode='stretch' source={require('../images/user/llogout.png')} style={styles.listItemIcon} />
											:
											<Image resizeMode='stretch' source={require('../images/user/icon-logout.png')} style={styles.listItemIcon} />
											}
											<Text style={{fontSize:14,color:'#fff'}}>ออกจากระบบ</Text>
										</Touch>
									</List.Item>
								</Flex.Item>
											
							</Flex>
  
   
											{/* <Flex style={{paddingBottom:140}}>	 
												<Flex.Item alignItems='center' >	 global.localStorage.removeItem("newRegist")

											 
							           <Touch onPress={()=> this.Mlogout()} style={{marginTop:20}}> 
							     <ImageBackground resizeMode='stretch' source={require('../images/button.png')} style={{width:220,height:40}}>
								<Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center',paddingTop:10 }}>退出 </Text>
								</ImageBackground>
											 	 
								      </Touch>  
									    		 </Flex.Item> 
											</Flex> */}

									</ScrollView>
							</ImageBackground>
							</View>	 
						    </View>					
											
											
											
        );
    }
 

}

  
  export default connect((state) => {
	return {
		vipInforData: state.vipInforData
	}
  }, (dispatch) => {
	return {
		getVipInforAction: () => dispatch(getVipInforAction())
	}
  })(PersonalAccount);



const styles = StyleSheet.create({
	modalOverly: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	modalContainer: {
		width: width * .8,
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        shadowColor: '#00B324',
        elevation: 4,
		backgroundColor: '#000000',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 30,
		paddingHorizontal: 20
	},
	successCircle: {
        backgroundColor: '#0BACFF',
        width: 60,
        height: 60,
        borderRadius: 10000,
        justifyContent: 'center',
        alignItems: 'center'
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
	successCircleText: {
        fontWeight: 'bold',
        color: '#222222',
        fontSize: 46
	},
	vipModalText1: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 25,
        marginBottom: 20
	},
	vipModalText2: {
        color: '#CCCCCC',
        textAlign: 'center'
	},
	vipModalText3: {
		color: '#00E62E',
		fontWeight: 'bold',
		fontSize: 16
	},
	recommendStatusBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		paddingHorizontal: 20,
		borderRadius: 4
	},
	recommendStatusBoxImg: {
		marginRight: 5,
		width: 28,
		height: 28
	},
	recommendBoxArrow: {
		alignItems: 'center',
		marginVertical: 5
	},
	recommendArrow: {
		width: 36,
		height: 18
	},
	recommendStatusBoxText: {
		color: '#F5F5F5',
		fontSize: 13
	},
	recommendStatusBoxText1: {
		color: '#fff',
		fontWeight: 'bold'
	},
	recommendClose: {
		width: 30,
		height: 30 * 2.625
	},
	vipModalSuccessBtn: {
        backgroundColor: '#000000',
        height: 40,
        borderRadius: 4,
        width: width - 200,
        alignItems: 'center',
        justifyContent: 'center',
		marginTop: 20,
		borderWidth: 1,
		borderColor:'#00B324'
	},
	vipModalSuccessBtnText: {
        color: '#00B324'
    },
  
	 imgBackground:{
		 width: width,
     height: 70,
     flex: 1 
	 },
	 gameBg0:{
		 alignItems: 'center',
		 justifyContent: 'center',
	 	paddingTop:5,
	 },
	 dpowithd: {
		 display:'flex',
		 flexDirection: 'row',
		 justifyContent: 'center',
		 alignItems: 'center',
		 borderWidth: 1,
		 borderRadius: 5,
		 width: width / 2.8,
		 height: 38,
	},
	 AllMbutton:{ //全餘額
		 flex:0.2,
		 paddingTop:5,
		 paddingBottom:5,
		 borderRadius:12,
		 backgroundColor: '#013626',
	 },
	 oneT:{ //一鍵轉帳
	 	flex:0.3,
	 	paddingTop:5,
		paddingLeft:4,
		paddingRight:4,
	 	paddingBottom:5,
	 	borderRadius:12,
	 	backgroundColor: '#013626',
	 }, 
	 gameBg1:{
		//  paddingTop:10,
		 paddingLeft: 40,
		//  backgroundColor:"transparent",
	 },
	 gameBg2:{
		paddingLeft: 40,
		//  backgroundColor:"transparent",
	 }, 


	 touchableStyles: {
		marginTop: 15,
		marginBottom:15,
		backgroundColor: '#337434',
		width: 200,
		paddingHorizontal: 50,
		paddingVertical: 10,
		borderRadius: 25,
	  },
	 
	 bankBox:{
		    backgroundColor:"#fff",
        width: width,
        flexWrap: 'wrap',
        display:'flex',
        flexDirection: 'row',
		    paddingLeft:10,
				paddingRight:10,
				paddingBottom:10,
				 
		 
	 }, 
	 bankImg:{
	      flexWrap: 'wrap',
	 			flexDirection: 'column',
	 			alignItems: 'center',
	 			justifyContent: 'center',
	 			borderWidth: 1,
	 			borderColor: '#000',
				height:50,
	 			padding: 7.5,
	 			margin: 3,
	 },
	 
	 bankImgHover:{
	    flexWrap: 'wrap',
	 		flexDirection: 'column',
	 		alignItems: 'flex-start',
	 		justifyContent: 'flex-start',
	 		borderWidth: 1,
	 		borderColor: '#005a36', 
			height:48,
			padding: 15,
			margin: 3,
	 },
	 
	 //header 樣式
	 userMoneyBox:{    
		 backgroundColor:"#fff",
		 padding:12,
		 borderTopWidth: 1,
		 borderColor: '#c7c8c8'
	 },
	 Headnohave:{
			 textAlign: 'center',
			 color:"#fff",
			 
		 },
	Headhave:{
		 		textAlign: 'center',
		 		color:"#feeaab",
		 		
	 },
	 checkBox1:{
	 	width:25,
	 	height:25
	 },
	 PayButtonB:{
		 paddingBottom:12,
		 backgroundColor:"#fff",
		 shadowOffset: {width: 2, height: 5},
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: "#666",
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,

	 },
	 UserList: {
		 width: width,
		 height: height,
		 flex: 1,
		 backgroundColor: '#1a1a1a',
		//  marginTop: 10,
		 borderRadius: 10,
		//  overflow: 'hidden',
		//  shadowOffset: {width: 0, height: -8},
		//  shadowOpacity: 0.5,
		//  shadowColor: "#06791b",
		//  shadowRadius: 5,
		//  //注意：这一句是可以让安卓拥有灰色阴影
		//  elevation: 100,
	},
	flexItemStyle:{
		paddingVertical:3,
	},
	listItemTouch:{
		width:width,
		height:20,
		justifyContent:"center"
	},
	listItemIcon:{
		width: 24, 
		height: 24, 
		position: 'absolute',
		left: -40,
		top:-2,
		alignSelf:"center",
		alignItems:"center",
	},
	// 新消息小圆点
	statisticsDot:{
		position: 'absolute',
		right:90,
		top:5,
		width:10,
		height:10,
		borderRadius:10,
		backgroundColor:"#00BF26",
		justifyContent:"center",
		alignSelf:"center",
	},
	updateVipBox: {
		backgroundColor: '#F5F2BD',
		borderRadius: 4,
		position: 'absolute',
		top: height * .76,
		// left: 0,
		// right: 0,
		// bottom: 20,
		zIndex: 1000,
		height: 100,
		width: width - 20,
		marginHorizontal: 10,
		flexDirection: 'column',
		alignItems: 'center',
		paddingHorizontal: 15,
		paddingVertical: 15
	},
	updateVipBoxText1Box: {
		backgroundColor: '#FF6000',
		width: 20,
		height: 20,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 5
	},
	updateVipBoxText1: {
		color: '#fff',
		fontWeight: 'bold',
		transform: [
			{
				rotate: '180deg'
			}
		]
	},
	updateVipBoxText2: {
		color: '#222222'
	},
	updateVipBoxBtn: {
		borderWidth: 1,
		borderColor: '#FF6000',
		borderRadius: 4,
		height: 30,
		justifyContent: 'center',
		paddingVertical: 3,
		paddingHorizontal: 15,
		marginTop: 5
		// position: 'absolute',
		// right: 15
	},
	updateVipBoxBtnText: {
		color: '#FF6000'
	},
	
	 
	vipModal: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .5)',
		alignItems: 'center',
		justifyContent: 'center'
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
	vipBottomContainer: {
	  alignItems: 'center'
	},
	vipCircle: {
	  backgroundColor: '#0BACFF',
	  width: 60,
	  height: 60,
	  borderRadius: 10000,
	  alignItems: 'center',
	  justifyContent: 'center'
	},
	vipCircleText: {
	  color: '#000',
	  fontSize: 50,
	  fontWeight: 'bold'
	},
	VipIconImg: {
	  width: 66,
	  height: 66
	},
	vipTextInfor: {
	  color: '#fff',
	  marginTop: 20,
	  marginBottom: 35
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
		 
  
});
