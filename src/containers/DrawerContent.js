import React from 'react';
import { StyleSheet, ScrollView, Text, View, Image,TouchableOpacity ,Dimensions,Platform,Linking,Modal} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { logout, LOGOUT } from '../actions/AuthAction';
import {Button,Carousel,WhiteSpace, WingBlank ,Flex,Toast} from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import Accordion from 'react-native-collapsible/Accordion';
import Orientation from 'react-native-orientation-locker'; 
import PushUtil  from '../actions/PushUtil';  //友盟 push 推送
import DeviceInfo from 'react-native-device-info'  //獲取設備信息

const {
  width ,height
} = Dimensions.get('window')

const Menu1 = [
	{
		title: 'BTi 体育',
		content: 'SBT',
		key:0
	},
  {
    title: 'IM 体育',
    content: 'IPSB',
		key:0
  }
];


const Menu2 = [
 
	{
		title: 'MG 老虎机',
		content: 'GameList',
		key:'MGS'
	},
	  {
		title: 'BS 老虎机',
		content: 'GameList',
		key:'BSG'
	},
	{
		title: 'PG 老虎机',
		content: 'GameList',
		key:'PG'
	},
	{
		title: 'TG 老虎机',
		content: 'GameList',
		key:'TGP'
	},


	{
		title: 'SG 老虎机',
		content: 'GameList',
		key:'SG'
	},


	{
		title: 'GN 老虎机',
		content: 'GameList',
		key:'GNS'
	},
	
	{
		title: 'YD 老虎机',
		content: 'GameList',
		key:'YDS'
	},



	


];


const Menu3 = [
	{
		title: 'AG 真人娱乐',
		content: 'AGL',
			key:76
	  },

	{
		title: 'GD 真人娱乐',
		content: 'GDL',
		key:1050
	},
	{
		title: 'SA 真人娱乐',
		content: 'SAL',
		key:1712
	},

	{
		title: 'AB 真人娱乐',
		content: 'ABT',
		key:114
	},
	{
		title: 'N2 真人娱乐',
		content: 'NLE',
		key:1517
	},
 
	
	
];


const Menu4 = [

	{
		title: 'AG 捕鱼',
		content: 'AG',
		key:640
	},
	{
		title: 'GN 捕鱼',
		content: 'GEN',
		key:1198
	},
//   {
//     title: 'PT 捕鱼',
//     content: 'PT',
// 		key:669
//   }, 
];



const Account = [
	{
		title: '个人资料',
		content: 'PersonalAccount',
		key:'about'
	},
	{
		title: '密码管理',
		content: 'PersonalAccount',
		key:'passsword'
	},
	{
		title: '银行卡管理',
		content: 'PersonalAccount',
		key:'bankcar'
	}, 
	{
		title: '金币皇(PT)账户',
		content: 'PersonalAccount',
		key:'ptaccount'
	}, 
	{
		title: '自我限制',
		content: 'PersonalAccount',
		key:'mycont'
	},
]    


const CONTENT = [
	{
		title: '首頁',
		content: "home",
	},
	{
		title: '消息',
		content: "news",
	},
    {
    title: '体育博彩',
    content: Menu1,
		key:2
     },
	{
		title: 'IM 电竞',
		content: "GamePage",
		key:0
	},
	{
		title: '真人娱乐',
		content: Menu3,
		key:4
	},
	{
		title: '老虎机',
		content: Menu2,
		key:5
	},
	{
		title: '捕鱼游戏',
		content: Menu4,
		key:6
	},
	{
		title: '优惠活动',
	  content: "preferential",
	}, 
	{
		title: '公告',
		content: "Announcements",
	}, 
	{
		title: '投注记录',
		content: "Bettingrecord",
	},
	{
		title: '账户管理',
		content: "PersonalAccount",
		key:8
	}, 
	{
		title: '合作伙伴',
		content: "preferential",
	}
	
];
const NoneMenu = ['首頁','消息','IM 电竞','优惠活动','公告','投注记录','合作伙伴','账户管理']
const GameName = ["BTi 体育","IM 体育","CMD 体育","AG 真人娱乐","N2 真人娱乐","SA 真人娱乐","GD 真人娱乐","AB 真人娱乐",'IM 电竞','AG 捕鱼','GN 捕鱼','PT 捕鱼']

 
class DrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.navigateToScene = this.navigateToScene.bind(this);
		
		this.state = {
			activeSections: [],
			collapsed: true,
			multipleSelect: false,
			userMoney:false,
			userName:'', //用戶名
			memberInfo:'', 
			TotalBal:TotalBal, // 總餘額
			IPSB:IPSB,
			MAIN:MAIN,
			LD:LD,
			SLOT:SLOT,
			SB:SB,
			CMD:CMD,
			DomainX:'',//合作夥伴 
			Devicetoken:'',
			memberData:'',
			userMAC:'',
			statistics:0,
			moneyBox:'',
     };
		 
		 this.userAllmoney = this.userAllmoney.bind(this)
		 this.resetMoner = this.resetMoner.bind(this)
		 this.TotalBal = this.TotalBal.bind(this)
  }
   
	
  componentWillMount(props) {

	   this.GetDomain(); //合作夥伴
		
		this.reloadOrientation();

		

		this.Statistics(); //哪些需要驗證

		PushUtil.getDeviceToken().then(token => {   ///獲取用戶唯一參數 devicetoken
			this.setState({
				  Devicetoken:token
			  })  
		   
		  });

		    
			  if(ApiPort.UserLogin == true){
					   console.log('用戶1111') 
						global.storage.load({
							key: 'memberInfo',
							id:'memberInfos'
						}).then(ret => {
							 console.log(ret)
							this.setState({
								userName:ret.memberInfo.userName ? ret.memberInfo.userName.substr(0,12) : '竞博',
								memberInfo:ret.memberInfo,
								memberData:ret, 
								MemberCode:ret.memberInfo.MemberCode
								}) 
									
							this.TotalBal();	 
							
						}).catch(err => {
							console.log('沒有用戶緩存')
							// 如果没有找到数据且没有sync方法，
							// 或者有其他异常，则在catch中返回
							//console.warn(err.message);
						
						})
				}
 
				if(Platform.OS === "android") { 
					DeviceInfo.getMACAddress().then(mac => {  //拿mac地址
							 this.setState({
								 userMAC:mac
							 }) 
				   });
		 
				 }

				 this.NewsGet();


				 this.loadInterval = setInterval(() => {
					if (ApiPort.UserLogin == false) {
						clearInterval(this.loadInterval)
						return;
					}
				}, 20000)
  
  } 
	
	
	componentWillUnmount(){  //離開註銷監聽  
		   this.loadInterval && clearInterval(this.loadInterval)
			Orientation.removeOrientationListener(this._onOrientationChange);  
	}

	_onOrientationChange(props){ 
		 console.log('來至全局 鎖屏')
		 console.log(GameDBType)
		 if(GameDBType == false){
				Orientation.lockToPortrait();
		 }
		
	} 

	 reloadOrientation(){  //全局事件 從新監聽橫屏 豎屏
		console.log('重新鎖屏')
	
		Orientation.lockToPortrait(); 
		
		Orientation.addOrientationListener(this._onOrientationChange);
	}
	
	RmoveOrien(){//全局事件刪掉監聽
		console.log('remove 鎖屏')
		Orientation.removeOrientationListener(this._onOrientationChange);
	}
	 
	
	getWSetting(){  //需驗證哪些 email or phone 

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
 
	openDomin(url){   
		if(url == undefined){ 
		    Linking.openURL(this.state.DomainX)
			return;
		} 
		
	 Linking.openURL(url)

	}

	 
	NewsGet(){  //獲取消息 

		fetchRequest(ApiPort.Statistics+'?key=unreadNewsCount&', 'GET')
		.then(data => {   
		  this.setState({
			statistics:data.statistics
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
	 
	Statistics(){
		fetchRequest(ApiPort.WSetting, 'GET')
				      .then(data => {  
						
						allowEmail = data.result.allowEmail;
						allowPhone = data.result.allowPhone;
					 
		               }).catch(error => {
				 
						   
				      })  
	}
	
	//餘額
	TotalBal(){ 
				    fetchRequest(ApiPort.Balance, 'GET')
				      .then(data => { 
						Toast.hide(); 
												data.map(function(item, index) {
															
															if(item.name == "TotalBal"){
																TotalBal = item.balance
															}else if(item.name == "IPSB"){
																IPSB  = item.balance
															}else if(item.name == "MAIN"){
																MAIN  = item.balance
															}else if(item.name == "LD"){   // LD ＝ 娛樂場 casino
																LD  = item.balance
															}else if(item.name == "SLOT"){
																SLOT  = item.balance
															}else if(item.name == "SB"){
																SB  = item.balance
															}else if(item.name == "CMD"){
																CMD  = item.balance
															}else if(item.name == "PT"){
																PT = item.balance 
															}else if(item.name == "AG"){
																AG =item.balance

															} 
												});
							
												this.setState({ 
													        moneyBox:data,
															TotalBal:TotalBal , 
															IPSB:IPSB , 
															MAIN:MAIN, 
															LD:LD,  
															SLOT:SLOT, 
															SB:SB,
															CMD:CMD, 
												})	 
												
												
				      }).catch(error => {
								 Toast.hide(); 
				      })
						 
	}
	 
	 
	//餘額刷新 
	resetMoner(){
     Toast.loading('ยอดคงเหลือในการฟื้นฟู',200);
     this.TotalBal();
		
	} 
	
	//展示全餘額
	userAllmoney(){
		
		 let key = this.state.userMoney;
		 this.setState({ 
			 userMoney:key == false ?  true : false 
		 })  
	}

  
  navigateToScene(key,item,logoutx) {
  
	if(key == 'news'){ 
		this.NewsOpen(); 
	}
	//console.log(key,item)
	//console.log(this.props)

	if(key == "Registered"){
		this.props.logout();
		setTimeout(()=>{
			Actions.Registered();
		}, 200)  
		setTimeout(()=>{Gologin = true }, 2000)  
		key = 'login';
		return;
	}

    if (key === 'logout') {  

		  if(!logoutx){
			 if(ApiPort.UserLogin == true){
			   this.logout(); 
			 }
		   }   
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

			  this.props.logout();
			  setTimeout(()=>{Gologin = true }, 2000)  
              key = 'login';
			
			return;
    }
	
    Actions[key]({});
	
	if(key == 'deposit'){ 
		setTimeout(()=>{reloadPage(item) }, 50) 
		
	} 
  } 
 

   logout(){
	 const {memberInfo,Devicetoken,MemberCode,memberData} =this.state;
	  
     let data = {
		"clientId": "JBO.Native.App",
		"clientSecret": "JBOmuitten",
		"refreshToken": memberData.accessToken.refresh_token,
		"accessToken": memberData.accessToken.access_token,
		"memberCode": memberData.memberInfo.memberCode,
		"deviceToken":Devicetoken,
		"packageName": "net.GB2BC.JBO",
		"imei": "",
		"macAddress":this.state.userMAC,
		"serialNumber": "",
		"pushNotificationPlatform": "umeng+",
		"os": Platform.OS
	  }
 
			fetchRequest(ApiPort.logout, 'POST',data)
				.then(data => { 		 
				     
				 }).catch(error => {
					 Toast.hide(); 	     			
				 }) 
   }

	navigateToSceneGame(key,item) {
		 console.log(key,item)
		Orientation.removeOrientationListener(this._onOrientationChange);
		Actions[key]({data:item}); 
	}
	
  toggleExpanded = () => {  
    this.setState({ collapsed: !this.state.collapsed });
  };
	
	//请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
		    PlayGame(gameid, gametype) {
				
				
				if(isGameLock == true){
					Toast.fail("游戏访问限制" , 2);
					return;
				}
			 //	console.log(gameid, gametype)
		         console.log(ApiPort.UserLogin)
					  if(ApiPort.UserLogin == false){
	          			   Toast.fail("请先登录" , 2);
							return;
						}
	
		       //console.log(gameid, gametype)
		        let data;

				if(gametype != "SBT"){	 
					data = {
						"hostName": common_url,
						"productCode": gametype,
						"platform": "mobile",
						"mobileLobbyUrl": common_url,
						//"sportsMenu":common_url,
						"bankingUrl": common_url,
						"logoutUrl": common_url,
						"supportUrl": common_url
					}  
				}else{ 
					data = {
						"hostName": SBTDomain,
						"productCode": gametype,
						"platform": "mobile",
						"mobileLobbyUrl": SBTDomain,
						//"sportsMenu":common_url,
						"bankingUrl": SBTDomain,
						"logoutUrl": SBTDomain,
						"supportUrl": SBTDomain
					}  
				}
 
						
						Toast.loading('正在启动游戏,请稍候...',200);
								fetchRequest(ApiPort.Game+gameid+'?isDemo=false&', 'POST',data)
										.then(data => {
															
											Toast.hide();
 
											if(gametype == "NLE" ){ 
												
												if(data.errorCode == 0){ 
													if(data.isMaintenance == true){
														Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
														return;
													} 
												}else{
													Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
												    return;
												}  
												this.openDomin(data.gameUrl)
											     return;
											   }


											     //安卓跳瀏覽器
												 if(Platform.OS == 'android'){  
													if(gametype == "GEN" ){
														if(data.errorCode == 0){ 
															if(data.isMaintenance == true){
																Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
																return;
															}
															
														}else{
															Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
																return;
														} 
		 
													
														this.openDomin(data.gameUrl)
														 return;
													}
												}

													//
													if(data.errorCode == 0){ 
														if(data.isMaintenance == true){
															Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
															return;
														}
														Actions.GamePage({GameOpenUrl:data.gameUrl,gametype:gametype}); 
													}else{
														Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
															return;
													} 
 
											}).catch(error => {
												Toast.hide();
												// 
										})
										 
		    }
				
	Transfer(title){  //一鍵轉
		  console.log(title)
			
				let data =  {
			    "fromAccount":"All",
			    "toAccount": title,
			    "amount": 0,
			    "bonusId": 0,
				"blackBoxValue": Iovation,
				"e2BlackBoxValue": E2Backbox,
			    "bonusCoupon": ""
			    } 
					Toast.loading('转账中,请稍候...',200);
					fetchRequest(ApiPort.Transfer, 'POST',data)
							.then(data => { 	
									  Toast.hide();
									 
								
									 setTimeout(()=>{
										this.TotalBal();
										}, 2000)  
 
									    
									  if(data.status ==0){
											Toast.fail(data.messages , 2);
										}else{
											Toast.success(data.messages , 3);
										}
								
									
							
								}).catch(error => {
									Toast.hide();
									//Toast.fail(data.messages , 2);
			
									
											
											
							})
							
	}
	
  setSections = sections => {
		    ////console.log(sections[0])
        let key;
				let activeSections = this.state.activeSections;
			  
				if(activeSections[0] == sections[0]){
					 key =[""] 
					// //console.log('bbbbbbb')
				}else{
					 key = sections
				}
				////console.log(activeSections)
				this.setState({
					activeSections: key,
				}); 
  };

  renderHeader = (section, _, isActive) => {   //下拉選單 头樣式 
	
		 let nowlogin = true;
		 if( ApiPort.UserLogin == false ){
			 
		   if(section.title == '投注记录' || section.title ==  '账户管理'||section.title == '消息' || section.title ==  '合作伙伴'){
			   nowlogin = false
		    }
				
		 }else{
			 nowlogin = true
		 } 
		return (
		        nowlogin == true && 
		        <Flex style={styles.MenuXbox}>   
						{NoneMenu.indexOf(section.title) == -1 ?
						 nowlogin == true && 
						 <TouchableOpacity style={{flex:1}} onPress={() => {this.setSections([section.key])}}> 
						 
						  <Flex> 
						    <Flex.Item duration={400} style={styles.MenuXd} transition="backgroundColor">
						    		<Text style={styles.fontText2}>{section.title}</Text> 
						    </Flex.Item>
						     
								<Flex.Item style={styles.MenuXdIcon}>
								   {isActive ? 	<Text style={{color:"#fff"}}>-</Text> :<Text style={{color:"#fff"}}>+</Text>} 
					     	    </Flex.Item>
								 
								</Flex> 
								</TouchableOpacity>
								
						
						: section.title == '合作伙伴' ?

						<TouchableOpacity style={{flex:1}} onPress={() => this.openDomin()}>  
						<Flex.Item duration={400} style={styles.MenuXd} transition="backgroundColor">
						   
								<Text style={styles.fontText2}>{section.title}</Text> 
								
						</Flex.Item>
						</TouchableOpacity> 

						
						
						: nowlogin == true &&  section.title != "首頁" && section.title != "消息" ?
           
						<TouchableOpacity style={{flex:1}} onPress={() => {GameName.indexOf(section.title) !=-1 ? this.PlayGame(0,"IPES"):this.navigateToScene(section.content)}}>  
						<Flex.Item duration={400} style={styles.MenuXd} transition="backgroundColor">
						   
								<Text style={styles.fontText2}>{section.title}</Text> 
								
						</Flex.Item>
						</TouchableOpacity> 

						:nowlogin == true &&  section.title == "消息" &&

						<TouchableOpacity style={{flex:1}} onPress={() => {GameName.indexOf(section.title) !=-1 ? this.PlayGame(0,"IPES"):this.navigateToScene(section.content)}}>  
						<Flex.Item duration={400} style={styles.MenuXd} transition="backgroundColor">
						   
								<Text style={styles.fontText2}>{section.title} <Text style={{textAlign: 'left',paddingLeft:13, color:"#f9e3a1", fontSize: 14,}}>( {this.state.statistics} )</Text> </Text> 
								 
						</Flex.Item> 

						</TouchableOpacity> 

						} 
						</Flex> 
    );
  };

  renderContent = (section, _, isActive)  => {   //下拉選單 展開樣式 
	   
	  return (  
		  
	    NoneMenu.indexOf(section.title) == -1 &&	
							<View>
							{section.content.map((item,i) => { 
							   	return (
										<Flex> 
											<Flex.Item duration={400} style={styles.MenuXb}>
											    <TouchableOpacity style={{flex:1}} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => {GameName.indexOf(item.title) !=-1 ? this.PlayGame(item.key,item.content):this.navigateToSceneGame(item.content,item.key)}}>  
													<View style={{flexDirection: 'row'}}><View style={styles.iconMenu}></View><Text style={styles.fontText2}>{item.title}</Text></View> 
													</TouchableOpacity>
											</Flex.Item>
										</Flex>
								    )	
							    })
							}
							</View>
	  );

   }
		
  render () {
		 
		 window.reloadOrientation = () => {
			 this.reloadOrientation();
		 }
		 
		 window.RmoveOrien = ()=>{
			 this.RmoveOrien();
		 }
		  
		 window.navigateToSceneGlobe = ()=>{
			 this.navigateToScene('logout','',true) 
		 }


		//  window.navigateToSceneGlobeX= ()=>{
		// 	this.navigateToScene('logout','') 
		// }


		window.NewsGetAgen=()=>{
			this.NewsGet();
		}

		window.TotalBalGlobe = () => {  // 全局餘額刷新

			this.TotalBal();
		}

		 
		 const { multipleSelect, activeSections ,userMoney,userName,TotalBal,moneyBox , MAIN , LD ,  SLOT , SB } = this.state;
		 
    return (
      <View></View>
    )
  }
}

const mapStateToProps = (state) => ({
  email: state.auth.email
});
const mapDispatchToProps = (dispatch) => ({
  logout: (loginDetails) => {
    logout(dispatch, loginDetails);
  }
});
/**
 * deliberately not using mapDispatchToProps
 * notice how `logout` is being used
 */ 
export default connect(mapStateToProps,mapDispatchToProps)(DrawerContent);
 
