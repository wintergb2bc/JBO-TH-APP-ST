import React from 'react';
import { StyleSheet,WebView ,ScrollView, Text, View, ImageBackground,Platform,TouchableOpacity ,Dimensions,Modal,Linking,Image} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Checkbox, Radio,Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List} from 'antd-mobile-rn';
import HTMLView from 'react-native-htmlview';
import WebViewIOS from 'react-native-webview'

import Touch from 'react-native-touch-once';
import styles from './bankStyle';
import Depopage from './depositPage';
import Head from './Head';
import Orientation from 'react-native-orientation-locker';

import DepositSpage from './DepositSpage';
import Withdrawals from './withdrawals';
import Transfer from './transfer';
import Records from './records';
import BankStatus from './bankStatus';

const RadioItem = Radio.RadioItem;
const {
  width ,height
} = Dimensions.get('window')
 
const TypeName = ["bankStatusTT", "depositT", "recordsT", "transferT", "withdrawalsT", "depositBx"]

const CustomChildren = (props: any) => (
  <TouchableOpacity onPress={props.onPress}>
    <View
      style={{ height: 36, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}
    >
      <Text style={{ flex: 1 }}>{props.children}</Text>
      <Text style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</Text>
    </View>
  </TouchableOpacity>
);



const bankImage = {
	  
	"JDP" : require('../../images/bank/kong.png'),
	"AP" : require('../../images/bank/AP.png'),
	"BC" : require('../../images/bank/BC.png'),
	"CC" : require('../../images/bank/CC.png'),
	"LB" : require('../../images/bank/LB.png'),
	"OA" : require('../../images/bank/OA.png'),
	"UP" : require('../../images/bank/UP.png'),
	"QQ" : require('../../images/bank/CC.png'), //沒圖
	"WC" : require('../../images/bank/CC.png'),//沒圖
	"QR" : require('../../images/bank/CC.png'), //沒圖
	"Hover": require('../../images/bank/bankIcon1.png'), //選中圖 
	  
}

const piwikType = {
	deposit:'DepositPage',
	withdrawals:'WithdrawalPage',
	records:'TransactionRecord',
}


class Deposit extends React.Component {
	 
	constructor(props) {
	    super(props); 
			this.btnClick = this.btnClick.bind(this)
			this.AllMomeysx = this.AllMomeysx.bind(this)
			this.AllMomeysxBB =this.AllMomeysxBB.bind(this)
			this.closeLiveChatModal=this.closeLiveChatModal.bind(this)

	    this.state = {
				AppData:this.props,
				type:'deposit',
				AllmoneyB:false,
				popUpid:0,
				popUpNot:false,
				popMsg:'',
				popTitle:'',
				initProps:{},

				popUpNot1:false,
				popTitle1: '',
				popMsg1: '',
				isShowLiveChatModal:false,
      			liveChatUrl:null,
	    } 
		this.setTimeoutLiveChat = null
	  }
		
	componentWillMount(props) {     
		Orientation.lockToPortrait(); 
		this.EmergencyAnnouncement();  //特殊公告 
	 }

	componentDidMount() {
		if (this.props.from == "HongBaoRain") {
			// Toast.success("充值",3)
			this.props.navigation.setParams({
				title: "ฝากเงิน"
			  });
		}	

		this.listenBlur()
		//彈客服窗
		if(ApiPort.UserLogin){
			this.setTimeoutLiveChat = setTimeout(()=>{
				this.getLiveChat()
			}, 	180000) 
		  }
	}	
		 
    componentWillUnmount(){  //離開註銷監聽 
				Orientation.removeOrientationListener(this._onOrientationChange);
				
				if(TypeName.indexOf(this.props.name) != -1){
					  Orientation.unlockAllOrientations();   //解鎖橫豎屏  如果是在遊戲頁面開啟 重新解鎖
				}
				if (this.props.from == "HongBaoRain") {
					console.log("showRainTrigger ");
					window.showRainTrigger(true);
				}

				if(NowGameName == 'JBP'){
					OpenJBPReSize();
				}
				
	}

	_onOrientationChange(curOrt){
		  Orientation.lockToPortrait();
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
				console.log('deposit LiveChat data',data)
	
		})
		.catch(() => {});
	}

	listenBlur(){
        this.willFocusSubscription = this.props.navigation.addListener(
			'willBlur',() => {
                console.log('willBlur')
				this.setTimeoutLiveChat && clearTimeout(this.setTimeoutLiveChat)
			 }
		  );
    }

	EmergencyAnnouncement(){ 
		//EmergencyAnnouncement 
		//isMobile   判斷是不是 手機版 ,不是要寫false
		fetchRequest(ApiPort.EmergencyAnnouncement + '?optionType=Deposit&', 'GET')
			.then(data => {
				 
				 console.log(this.state.AppData)

				 if(data.emergencyAnnouncements){

					let msgx= data.emergencyAnnouncements[0].content
  
    
					global.storage.load({
						key:'popID'+memberCode+data.emergencyAnnouncements[0].id,
						id:'popID'+memberCode+data.emergencyAnnouncements[0].id,
					}).then(ret => { 

					
  
					   
					 }).catch(err => {


						let TypeAx = ['Deposit','Withdrawal','Transfer']
						let tpyeW = data.emergencyAnnouncements[0].announcementType
						let tpyeX = tpyeW.split(',')
							for (var j=0;j< tpyeX.length;j++){ 
	 
								 if(TypeAx.indexOf(tpyeX[j]) != -1 ){ 
									 
									global.storage.save({
										key: 'popID'+memberCode+data.emergencyAnnouncements[0].id, // 注意:请不要在key中使用_下划线符号!
										id: "popID"+memberCode+data.emergencyAnnouncements[0].id, // 注意:请不要在id中使用_下划线符号!
										data: data.emergencyAnnouncements[0].id,
										expires: null
									}); 
			
									this.setState({
										popUpNot:true,
										 popTitle:data.emergencyAnnouncements[0].topic,
										 popMsg:msgx.replace('\\r\\n', '') 
									}) 

	   
								 }
							} 

					
					})  
				 }
				

			}).catch(error => {
				//Toast.hide();
				
			})     

			fetchRequest(ApiPort.EmergencyAnnouncement + '?optionType=Withdrawal&', 'GET').then(data => {
				 
				console.log(this.state.AppData)

				if(data.emergencyAnnouncements){

				   let msgx= data.emergencyAnnouncements[0].content
 
   
				   global.storage.load({
					   key:'popID1'+memberCode+data.emergencyAnnouncements[0].id,
					   id:'popID1'+memberCode+data.emergencyAnnouncements[0].id,
				   }).then(ret => { 

				   
 
					  
					}).catch(err => {


					   let TypeAx = ['Deposit','Withdrawal','Transfer']
					   let tpyeW = data.emergencyAnnouncements[0].announcementType
					   let tpyeX = tpyeW.split(',')
						   for (var j=0;j< tpyeX.length;j++){ 
	
								if(TypeAx.indexOf(tpyeX[j]) != -1 ){ 
									
								   global.storage.save({
									   key: 'popID1'+memberCode+data.emergencyAnnouncements[0].id, // 注意:请不要在key中使用_下划线符号!
									   id: "popID1"+memberCode+data.emergencyAnnouncements[0].id, // 注意:请不要在id中使用_下划线符号!
									   data: data.emergencyAnnouncements[0].id,
									   expires: null
								   }); 
		   
								   this.setState({
									   popUpNot1:true,
									   popTitle1:data.emergencyAnnouncements[0].topic,
										popMsg1:msgx.replace('\\r\\n', '') 
								   }) 

	  
								}
						   } 

				   
				   })  
				}
			   

		   }).catch(error => {
			   //Toast.hide();
			   
		   }) 
	}

	handleLiveChat(){
		if(this.setTimeoutLiveChat){
			clearTimeout(this.setTimeoutLiveChat)
		}
		//彈客服窗
		if(ApiPort.UserLogin){
			this.setTimeoutLiveChat = setTimeout(()=>{
				this.getLiveChat()
			}, 180000) 
		  }
	}
	
	btnClick(key,initProps={}){ 
		//彈客服窗
		this.handleLiveChat()

		  this.setState({
			type:key,
			initProps
		}) 
	}  

	AllMomeysx(){
		this.setState({
			AllmoneyB:true
		}) 
	 
	}

	AllMomeysxBB(){
	console.log('222222')
		this.setState({
			AllmoneyB:false
		})
			CloseAllMomey();

	
	}

	AllMomeysxClose(){
		console.log('333')
			this.setState({
				AllmoneyB:false
			}) 
	 
	}

	popClose(){
		this.setState({
			popUpNot:false
		})
	}

	closeLiveChatModal(){
		this.setState({
			isShowLiveChatModal:false
		})
	}
	
  render () {
		 
	
	 console.log("this.props.name=====",TypeName.indexOf(this.props.name),"this.props",this.props)

		const { liveChatUrl,isShowLiveChatModal,type, AppData,AllmoneyB,popMsg,popUpNot,popTitle,initProps} = this.state;
		const { popTitle1, popUpNot1, popMsg1 } = this.state
		 console.log('AppData',AppData)
		window.reloadPage =(key,initProps)=>{   //給側滑選單跳轉用
			this.btnClick(key,initProps)
			//console.log('111111')
		//	Actions.drawerClose()
		}
	 
		
		window.OpenMoney = () => {
			this.AllMomeysx() 
    	 }

		window.CloseMoney = () => {
       this.AllMomeysxClose()

		}

    return (
		  <View style={{flex:1,backgroundColor:'#1a1a1a'}}>

			<Modal
				animationType='none'
				transparent={true}
				visible={popUpNot && type == 'deposit'}
				onRequestClose={() => { }}
			>
				<View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
					<View style={{ marginLeft: 50, marginRight: 50, width: width - 100, }}>
						<View style={styles.popTtitleBg}>
							<Text style={{ textAlign: 'center', fontSize: 16, color: "#fff", fontWeight: '900', paddingTop: 10, paddingBottom: 10 }}>{popTitle}</Text>
						</View>

						<View style={{ alignItems: 'center', backgroundColor: '#fff', height: 250, width: width - 100, overflow: 'hidden' }}>
							{
								Platform.OS === 'ios'
									?
									<WebViewIOS source={{
										html: `
                            <html lang="zh-cn">
                        <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
                        </head>
                        <body style="padding:0;margin: 0; background: #fff;">
                        <div style="width: 100%;color: #000">${popMsg}</div>
                        </body>
                        </html>
				` }}
										style={{
											marginHorizontal: 10,
											width: width - 120,
											backgroundColor: '#fff',
										}} 
										mediaPlaybackRequiresUserAction={false}
										/>
									:
									<WebView source={{
										html: `
								<html lang="zh-cn">
							<head>
							<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
							</head>
							<body style="padding:0;margin: 0; background: #fff;">
							<div style="width: 100%;color: #000">${popMsg}</div>
							</body>
							</html>
					` }}
										style={{
											marginHorizontal: 10,
											width: width - 120,
											backgroundColor: '#fff',
										}} 
										mediaPlaybackRequiresUserAction={false}
										/>
							}

						</View>

						<View style={{ alignItems: 'center', backgroundColor: 'white', height: 50, width: width - 100, zIndex: 99, paddingTop: 10 }}>
							<TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.popClose()}>
								<View style={{ width: width - 100, paddingLeft: 20, paddingRight: 20 }}>
									<View style={{ backgroundColor: '#00b324', borderRadius: 5, height: 30 }}>
										<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>ปิด</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
				animationType='none'
				transparent={true}
				visible={popUpNot1 && type == 'withdrawals'}
				onRequestClose={() => { }}
			>
				<View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
					<View style={{ marginLeft: 50, marginRight: 50, width: width - 100, }}>
						<View style={styles.popTtitleBg}>
							<Text style={{ textAlign: 'center', fontSize: 16, color: "#fff", fontWeight: '900', paddingTop: 10, paddingBottom: 10 }}>{popTitle1}</Text>
						</View>

						<View style={{ alignItems: 'center', backgroundColor: '#fff', height: 250, width: width - 100, overflow: 'hidden' }}>
							{
								Platform.OS === 'ios'
									?
									<WebViewIOS source={{
										html: `
								<html lang="zh-cn">
							<head>
							<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
							</head>
							<body style="padding:0;margin: 0; background: #fff;">
							<div style="width: 100%;color: #000">${popMsg1}</div>
							</body>
							</html>
					` }}
										style={{
											marginHorizontal: 10,
											width: width - 120,
											backgroundColor: '#fff',
										}} 
										mediaPlaybackRequiresUserAction={false}
										/>
									:
									<WebView source={{
										html: `
									<html lang="zh-cn">
								<head>
								<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
								</head>
								<body style="padding:0;margin: 0; background: #fff;">
								<div style="width: 100%;color: #000">${popMsg1}</div>
								</body>
								</html>
						` }}
										style={{
											marginHorizontal: 10,
											width: width - 120,
											backgroundColor: '#fff',
										}} 
										mediaPlaybackRequiresUserAction={false}
										/>
							}

						</View>

						<View style={{ alignItems: 'center', backgroundColor: 'white', height: 50, width: width - 100, zIndex: 99, paddingTop: 10 }}>
							<TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => {
								this.setState({
									popUpNot1: false
								})
							}}>
								<View style={{ width: width - 100, paddingLeft: 20, paddingRight: 20 }}>
									<View style={{ backgroundColor: '#00b324', borderRadius: 5, height: 30 }}>
										<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>ปิด</Text>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal
			animationType="fade"
			transparent={true}
			visible={ApiPort.UserLogin && isShowLiveChatModal && (type == 'deposit' || type=='records')}
			style={{ backgroundColor: "transparent",width,height }}
			>
				<View style={stylesModal.liveChatModal}>
					<View style={stylesModal.liveChatModalContainer}>
						<TouchableOpacity style={stylesModal.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
							this.setState({
								isShowLiveChatModal:false
							})
						}}>
							<Text style={stylesModal.closeBtnText}>X</Text>
						</TouchableOpacity>
						<View style={stylesModal.modalBottomContainer}>
							<Image source={require('../../images/liveChat_img.png')}  resizeMode='stretch' style={stylesModal.liveChatIconImg}></Image>
							<Text style={stylesModal.liveChatTextInfor}>{type=='deposit'?'หากต้องการความช่วยเหลือด้านการฝาก คลิก “แชทสด” เราพร้อมให้บริการ 24 ชม!'
							:'หากต้องการความช่วยเหลือ ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง'}</Text>
							<TouchableOpacity style={stylesModal.liveChatBottomBtn} onPress={() => {
								UMonEvent("CS", "Click", `CS_Invitation_${piwikType[type]}`);
								Linking.openURL(liveChatUrl);
								this.setState({
									isShowLiveChatModal:false
								})
							}}>
								<Text style={stylesModal.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<ImageBackground
				style={{ width: width, height: height, flex: 1 }}
				resizeMode="repeat"
				source={require("../../images/home/pattern.png")}
			>


				{ TypeName.indexOf(this.props.name) == -1 &&  
					<Head data={type} key={type} checkcallback={this.btnClick} /> 
				}
				
				{console.log(type)}
				{type == 'bankStatus' &&
					<BankStatus data={AppData} navigateToScene={this.btnClick}/>
				}

				{type == 'deposit' &&
					<DepositSpage data={AppData} navigateToScene={this.btnClick} initProps={initProps} checkcallback={this.btnClick}/>
				}
		
				{type == 'withdrawals' &&
					<Withdrawals data={AppData} checkcallback={this.btnClick} isShowLiveChatModal={isShowLiveChatModal} liveChatUrl={liveChatUrl} closeLiveChatModal={this.closeLiveChatModal}/>
				}
				
				{type == 'transfer' &&
					<Transfer data={AppData}/>
				}
				
				{type == 'records' &&
					<Records data={AppData} BackgroundImage={1} />
				}

				{AllmoneyB == true &&   
					<TouchableOpacity activeOpacity={0} style={styles.MoneyBg} onPress={this.AllMomeysxBB.bind(this)}>  
							<View></View>	
					</TouchableOpacity>
				}
											
					 
			</ImageBackground>			
					</View>
			
			
    )
  }
}

const styleHtmlMsg = StyleSheet.create({
	div: {
		// textAlign: 'center',
	},
	p: {
		// textAlign: 'center',
	},
	span: {
		// textAlign: 'center',
	},
	i: {
		// textAlign: 'center',
	},
	h1: {
		// textAlign: 'center',
	},
	h2: {
		// textAlign: 'center',
	},
})


const stylesModal = StyleSheet.create({
	liveChatModal:{
		  width:'100%',
		  height,
		  backgroundColor: 'rgba(0, 0, 0, .5)',
		  alignItems: 'center',
		  justifyContent: 'center',
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

export default(Deposit);

 
