import React from 'react';
import { StyleSheet,StatusBar ,Text,WebView, View,TouchableOpacity ,Dimensions,Image,Platform,ImageBackground,Modal} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {  Flex,Toast,ActivityIndicator} from 'antd-mobile-rn';
import Orientation from 'react-native-orientation-locker';
import Touch from 'react-native-touch-once';
import WebViewIOS from 'react-native-webview';
import DeviceInfo from 'react-native-device-info'
const DeviceID = DeviceInfo.getDeviceId();
console.log(DeviceID)

const {
  width ,height
} = Dimensions.get('window')


var _previousLeft=150;
var _previousTop=80;

var lastLeft=150;
var lastTop=80;

const CIRCLE_SIZE=80; 


class GamePage extends React.Component {
	 
	constructor(props) {
	    super(props);
		this.navigateToScene = this.navigateToScene.bind(this);
	    this._onOrientationChange = this._onOrientationChange.bind(this);
		this.reloadSXY = this.reloadSXY.bind(this);
	    this.state = {
			loadD:false,
			widthS:width,
			heightS: Platform.OS === "android" ? height - 69 : height - 63,
			heightJBP:height>width ? width:height,
			menuOpen:false, 
			menuOpenJBP:false,
			gametype:this.props.gametype,
			payHtml:this.props.GameOpenUrl, 
			style: {tintColor: 'blue'},
			userName:'',
			userMoney:false,
			loadone:1, 
			pageTop:0,
			gameKey:Math.random(),
			moneyBox:'',
			jbpNewMenber:0,
			isLANDSCAPE: false,
			isShowSPRTourist:false,
			gameid:this.props?.gameid,
			//menuOpenSGP:false,
			//pageTop:Platform.OS === "android" ? 0 :31, 
	    }
			 
		this.onStartShouldSetPanResponder=this.onStartShouldSetPanResponder.bind(this);
		this.onMoveShouldSetPanResponder=this.onMoveShouldSetPanResponder.bind(this);
		this.onPanResponderGrant=this.onPanResponderGrant.bind(this);
		this.onPanResponderMove=this.onPanResponderMove.bind(this);
		this.onPanResponderEnd=this.onPanResponderEnd.bind(this);
		this.resetMoner=this.resetMoner.bind(this);
		this.jbpNewMenberButton = this.jbpNewMenberButton.bind(this);
		this._onLayout = this._onLayout.bind(this);
	  }

	componentWillMount(props) {

			GameType = true;
			console.log(this.props.gametype)
         if(this.props.gametype != 'IPES'){
			if(
				this.props.gametype == 'BLE'
				||	this.props.gametype == 'TFG'
				||	this.props.gametype == 'IPSB'
				||	this.props.gametype == 'SBT'
				||	this.props.gametype == 'OWS'
				||	this.props.gametype == 'JIF' 
			) {
				GameDBType = false;
				reloadOrientation(); //重新鎖頻
			} else {
				GameDBType = true
				RmoveOrien(); //刪掉全局監聽 橫屏 

				Orientation.unlockAllOrientations();   //解鎖橫豎屏
			}
		 }else{
			 GameDBType = false;
		 }


		 if(this.props.gametype == "SPR"){
			global.storage
			.load({
			  key: "showSPRTourist",
			  id: "showSPRTourist",
			})
			.then((res) => {
			  if(res){
				this.setState({
				  isShowSPRTourist: false,
				});
			  }
			})
			.catch(() => {
			  this.setState({
				isShowSPRTourist:true
			  })
			});
		  }

		NowGameName = this.props.gametype

		  
		if(ApiPort.UserLogin == true){
							  
			global.storage.load({
				key: 'memberInfo',
				id:'memberInfos'
			}).then(ret => {
				this.setState({
					userName:ret.memberInfo.FirstName,
					memberInfo:ret.memberInfo
							})
				this.TotalBal();	
				//this.login(name,ret);
			}).catch(() => {
				console.log('沒有1緩存')
				// 如果没有找到数据且没有sync方法，
				// 或者有其他异常，则在catch中返回
				//console.warn(err.message);
			})
		} 
		this.loadInterval = setInterval(() => {
			this.widthHeight();
		},50)
		 
			 
	}

	  
	//離開註銷監聽	
	componentWillUnmount(){      
		GameType =false;
		this.loadInterval && clearInterval(this.loadInterval);
		reloadOrientation();
		Orientation.removeOrientationListener(this._onOrientationChange); 
		GameDBType = false; 

		setTimeout(()=>{   //出遊戲 延遲刷新餘額
			ReloadMoneyHome();
		},1500)
	}
		
		
	_onOrientationChange(){ 
		if(Platform.OS === "ios"){ 
			Orientation.lockToLandscapeRight(); 
		}else{
			Orientation.lockToLandscapeLeft(); 
		}
	}

	androidWidthHeight() {
		const { width, height } = Dimensions.get("window");
		this.setState({
			widthS:width,
			heightS:this.props.gametype == 'IMO' && Platform.OS === "android" ? height-53:height,
		})
		 
	}

	//重新計算寬高
	widthHeight(){  
		const {
			width ,height
		} = Dimensions.get('window') 
		if(this.state.widthS != width){
			 
			if(width > height){

				this.setState({
					widthS: width,
					heightS: Platform.OS === "android" ? height - 69 : height - 45,
				})
			  
				_previousLeft=width/2 +50;
				_previousTop=30; 
				lastLeft=width/2 +50;
				lastTop=30;
				//this.changePosition(); 
				this.setState({
					pageTop:0
				}) 
				
			}else{
			
				if(Platform.OS === "ios"){
					console.log(height)
					this.setState({
						widthS: width,
						heightS: Platform.OS === "android" ? height - 69 : height - 63,
					})
	
			  }else{
					this.setState({
						widthS: width,
						heightS: Platform.OS === "android" ? height - 69 : height - 63,
					})
			  }
			  
				_previousLeft=150;
				_previousTop=80;
				
				lastLeft=150;
				lastTop=80;
				this.setState({
					pageTop:0
				})
				//this.changePosition();
			}
			
		}
	
		
	}

	//關閉頁面
	closeModal() {  
		Actions.pop();
	}	
	
	//用户开始触摸屏幕的时候，是否愿意成为响应者；
	onStartShouldSetPanResponder(){
	return true;
	}

	//在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互；
	onMoveShouldSetPanResponder(gestureState){
		//	console.log(gestureState)
			if (
			(gestureState.dx < 2 && gestureState.dx > -2)
			&& (gestureState.dy < 2 && gestureState.dy > -2)
			) {
			return false;
			}
					
					
				
			return true;
	}

	// 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
	onPanResponderGrant(gestureState){

	this.setState({
		style:{
			left:_previousLeft,
			top:_previousTop,
		}
	});
	}

	// 最近一次的移动距离为gestureState.move{X,Y}
	onPanResponderMove(gestureState){
			
			let widthS = this.state.widthS;
			let heightS = this.state.heightS;
		_previousLeft=lastLeft+gestureState.dx;
		_previousTop=lastTop+gestureState.dy;

		if(_previousLeft<=0){
		_previousLeft=0;
		}
		if(_previousTop<=0){
		_previousTop=0;
		}
		if(_previousLeft>=widthS-CIRCLE_SIZE){
		_previousLeft=widthS-CIRCLE_SIZE;
		}
		if(_previousTop>=heightS-CIRCLE_SIZE){
		_previousTop=heightS-CIRCLE_SIZE;
		}

		//实时更新
		this.setState({
		style:{
			left:_previousLeft,
			top:_previousTop,
		}
		});
	}

	// 用户放开了所有的触摸点，且此时视图已经成为了响应者。
	// 一般来说这意味着一个手势操作已经成功完成。
	onPanResponderEnd(){

		lastLeft=_previousLeft;
		lastTop=_previousTop;

		this.changePosition();
	}

	/**
	 根据位置做出相应处理
	**/
  	changePosition(){
		
		let widthS = this.state.widthS;
		

		if(_previousLeft+CIRCLE_SIZE/2<=widthS/2){
			//left
			_previousLeft=lastLeft=0;

			this.setState({
					style:{
						left:_previousLeft,
						top:_previousTop,
					}
				});
		}else{
			_previousLeft=lastLeft=widthS-CIRCLE_SIZE;

			this.setState({
				style:{
					left:_previousLeft,
					top:_previousTop,
				}
        	});
  		}
	
	}
 
	OpenMenu(){
		this.setState({
			menuOpen:this.state.menuOpen ? false :true, 
		})
	}

	OpenMenuJBP(){
		this.setState({
			menuOpenJBP:this.state.menuOpenJBP ? false :true,
			jbpNewMenber:this.state.jbpNewMenber == 1 ?  2:0
		})
	}
	 
	navigateToScene(key,item) {
		if (key === 'logout') {
			// not using mapDispatchToProps
			ApiPort.Token = "";
			
			global.storage.remove({
					key: 'username',
					id: 'namerb88'
			});
			
			global.storage.remove({
					key: 'password',
					id: 'passwordrb88'
			});
			
			global.storage.remove({
					key: 'memberInfo',
					id: 'memberInfos'
			});
			
			global.storage.remove({
				key: 'Bank', // 注意:请不要在key中使用_下划线符号!
				id: 'BankData', 
			})
			
			this.props.logout();
			key = 'login';
		}
	
		Actions[key]({});
		
		if(item == 'transfer'){ 
			setTimeout(()=>{reloadPage(item) }, 100) 
			
		} 
		
	}
		
	//餘額
	TotalBal(){ 
				   //  let uri = '/api/App/RewardURLs?api-version=1.0&brand=fun88'
				     //Toast.loading('登录中,请稍候...',200);
				    fetchRequest(ApiPort.Balance, 'GET')
				      .then(data => {
                  
                      Toast.hide();
								
								data.map(function(item) {
															
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
				      
				      }).catch(() => {
								 Toast.hide();
								 
				      })
						
		
	}
		
	//餘額
	TotalBalNopop(){ 
		//  let uri = '/api/App/RewardURLs?api-version=1.0&brand=fun88'
		//Toast.loading('登录中,请稍候...',200); 
		fetchRequest(ApiPort.Balance, 'GET')
		.then(data => {
		
					
					data.map(function(item) {
												
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
		
		}).catch(() => {
					Toast.hide();
					
		})
			

	}

	//一鍵轉
	Transfer(title){  
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
					Toast.loading('กำลังโหลด...',200);
				//Toast.loading('转账中,请稍候...',200);
				fetchRequest(ApiPort.Transfer, 'POST',data)
						.then(data => { 	
									Toast.hide(); 
									this.TotalBalNopop(); 
									if(data.status ==0){
										Toast.fail(data.messages , 2);
									}else{
										Toast.success(data.messages , 2);
									} 
							}).catch(() => {
								Toast.hide();
								Toast.fail(data.messages , 2); 	
						})
						
	}

	//餘額刷新 
	resetMoner(){
		
		Toast.loading('กำลังโหลด...',200);
		//  Toast.loading('余额刷新中,请稍候...',200);
		 this.TotalBal(); 
		 this.setState({
			jbpNewMenber:0
		   })
	} 
	
	//展示全
	userAllmoney =() =>{ 
		 let key = this.state.userMoney;
		 this.setState({ 
			 userMoney:key == false ?  true : false 
		 }) 
	}    

	loading(){
		Toast.loading('กำลังโหลด...', 200);
	} 

	loadend(){
		Toast.hide();
	}

	goHome(){
		Actions.pop();
		NowGameName = ''
	}

	jbpNewMenberButton(type){   //新會員首次進入 jbp 引導
		console.log(type,'1111')
		if(type == 1){
			console.log(type,'222')
			this.setState({
				menuOpenJBP:true, 
			})
		}

		this.setState({
		jbpNewMenber:this.state.jbpNewMenber == 1 ?  2:0
		})
	}

	veiwHeightCalc = () => {

		// 檢查是否是iPhone XS, 11 (iPhone10,3/iPhone10,6--->InternalName)
		let checkDeviceID =  Platform.OS === "ios" && DeviceID && (DeviceID.split(",")[0] === "iPhone11" || DeviceID.split(",")[0] === "iPhone12")
		console.log(checkDeviceID)
		
		const {gametype,heightS,isLandscape} = this.state;
		console.log('game page gametype',gametype)
		if (gametype == 'EVO' && Platform.OS === "android") {
			return heightS * 0.83
		} else if (gametype == 'SXY' && Platform.OS === "android") {
			return heightS - 12
		} else if( gametype == 'SPG' ){
			
			if(isLandscape){
				console.log('SPG 判斷螢幕是橫屏=========',heightS)
				if((checkDeviceID || isIphone12Upper || DeviceID === "iPhone10,3" || DeviceID === "iPhone10,6")){
					return heightS
				} else {
					console.log('SPG android是豎屏=========',height)
					return heightS
				}	
				//return heightS
			} else {
				console.log('SPG 判斷螢幕是豎屏=========',heightS)//614,683 
				return heightS
			}
			 
		} else if( gametype == 'JIF'){
			console.log('判斷螢幕是豎屏=========',heightS)//actual height-->833 unlock--->369
			if((checkDeviceID || isIphone12Upper || DeviceID === "iPhone10,3" || DeviceID === "iPhone10,6")){
				console.log('JIF 主要ios機型是豎屏=========',heightS)
				return heightS * 0.9
			} else if ( Platform.OS === "ios" ) {
				console.log('JIF 其他ios機型是豎屏=========',heightS)//height--->604
				return heightS
			} else {
				console.log('JIF android是豎屏=========',heightS)
				return heightS
			}			
		} else if (gametype == 'EVO' && Platform.OS === "ios") {
			return heightS * 0.9
		} else if((gametype === 'YDSPNG' || gametype === 'YDSRLX' || gametype == 'MGP') && (checkDeviceID || DeviceID === "iPhone10,3" || DeviceID === "iPhone10,6")){
			return heightS - 44
		} else if((gametype === 'YDSPNG' || gametype === 'YDSRLX' || gametype == 'MGP') && isIphone12Upper){
			return heightS - 44
		} else if (gametype == 'SBT' && Platform.OS === "ios") {
			return heightS * 0.95
		} else {
			return heightS
		}
	}

	//判斷螢幕橫豎屏
	_onLayout(event) {
		let { width, height } = event.nativeEvent.layout;
		if (height > width) {
			//竖屏
			this.setState({
				isLandscape: false,
			});
		} else if (height < width) {
			//横屏
			this.setState({
				isLandscape: true,
			});
		}
	}

	reloadSXY(gameid, gametype){
		this.TotalBal();

		let data;
			data = {
			hostName: SBTDomain,
			productCode: gametype,
			platform: "mobile",
			mobileLobbyUrl: SBTDomain,
			//"sportsMenu":common_url,
			bankingUrl: SBTDomain,
			logoutUrl: SBTDomain,
			supportUrl: SBTDomain,
		};
		fetchRequest(ApiPort.Game + gameid + "?isDemo=false&", "POST", data)
			.then( res => {
				Toast.hide();
				if(res.success){
					this.setState({
						gameKey:Math.random(),
						payHtml:res.gameUrl,
						jbpNewMenber:this.state.jbpNewMenber == 1 ?  2:0
					})
				}else{
					Toast.error(res.message);
				}
			})

	}


	getGameUrl(gameId){
		let data = {
			hostName: common_url,
			productCode: this.props.gametype,
			platform: "mobile",
			mobileLobbyUrl:
			this.props.gametype != "PGS"
				? common_url
				: "https://public.pgcool.com/pages/close.html",
			sportsMenu: common_url,
			bankingUrl: common_url,
			logoutUrl: common_url+ "/accessdenied",
			supportUrl: common_url
		  };
		  console.log('gameId==',gameId)

		fetchRequest(ApiPort.Game + gameId + "?isDemo=false&", "POST", data)
		.then(data => {
		  if (data.errorCode == 0) {
			this.setState({
				gameKey:Math.random(),
				payHtml:data.gameUrl
			})
		  }
		})
		.catch(() => {
		});
	}

	handleSPRTourist(){
		this.setState({
		  isShowSPRTourist:false
		})
		global.storage.save({
		  key: "showSPRTourist", // 注意:请不要在key中使用_下划线符号!
		  id: "showSPRTourist", // 注意:请不要在id中使用_下划线符号!
		  data: false,
		  expires: null
		});
	  }
	 
	render () { 
		
	const {payHtml,menuOpenJBP,heightJBP,gameKey,gametype,pageTop,loadD,widthS,heightS,menuOpen,loadone,isShowSPRTourist} = this.state;

		//console.log('判斷螢幕橫豎屏=================================================================isLANDSCAPE')
		window.reloadGame = () => {
			if(gametype == 'JIF' || gametype=='MGP'){
				this.getGameUrl(this.props.playItem?.gameId)
				setTimeout(() => {
						this.setState({ 
							gameKey:Math.random(), 
							jbpNewMenber:this.state.jbpNewMenber == 1 ?  2:0})
					}, 3000) 
				return;
				
			}else if(gametype == "SPR"){
				this.getGameUrl(this.state?.gameid);
			  }else{
				this.setState({
					gameKey:Math.random(),
					payHtml:this.state.payHtml,
					jbpNewMenber:this.state.jbpNewMenber == 1 ?  2:0
				})
			}
			

		}

		window.openmenuX = ()=>{
			this.OpenMenu()
		}

		window.OpenJBPReSize =()=>{

			if(Platform.OS === "ios"){ 
				Orientation.lockToLandscapeRight(); 
				}else{
					Orientation.lockToLandscapeLeft(); 
				}

			Orientation.addOrientationListener(this._onOrientationChange);
		}
	//const js = `memberSportsbookBalance = ${JSON.stringify(IPSB)}`; 
	const urlk = (gametype != "SBT") ? payHtml :payHtml.split('&langid=')[0]+ '&ReferURL='+ SBTDomain +'&oddsstyleid=3&APIUrl='+ common_url +'&bal='+MAIN+'&langid='+payHtml.split('&langid=')[1]	
	//const urlk =  '&ReferURL='+ window.location.origin + '&oddsstyleid=3&APIUrl='+ URL 
		return (
			
		<View 
			onLayout={this._onLayout} //判斷螢幕橫豎屏
			style={{
				width:widthS,
				height:heightS,
				backgroundColor:"#000"
			}}
		>   
		 <Modal
          //supportedOrientations={["portrait", "landscape"]} // 衡平需要加這段
          animationType="none"
          transparent={true}
          visible={isShowSPRTourist} 
          onRequestClose={() => {}}
        >
          <View>
		  <ImageBackground
					source={Platform.OS=='ios'?require("../images/tutorial/sp-tutorial.png"):require("../images/tutorial/sp-tutorial-a.png")}
					resizeMode="stretch"
					style={{
						width: width ,
						height: height,
					}}
					>
              <View style={{position:'absolute',left:width/3,bottom:height/4}}>
                <TouchableOpacity onPress={()=> this.handleSPRTourist()} style={{backgroundColor:'#F5F5F5',borderRadius:8,paddingVertical:11,paddingHorizontal:52}}>
                  <Text style={{color:'#222222',fontSize:14}}>เล่นเลย</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>

        </Modal>

			<View 
				style={{
					width:widthS,
					height: this.veiwHeightCalc(),
					paddingTop:pageTop,
				}}
			>  

				{/*屏蔽adnroid 狀態欄*/}
				{/*{Platform.OS === "android" &&  */}
				{/*<StatusBar backgroundColor="#ff0000"*/}
				{/*             translucent={true}*/}
				{/*             hidden={true}*/}
					{/*		   animated={true}/> */}
					{/*		}*/}
				{/*屏蔽adnroid 狀態欄*/}

				{urlk !="" && Platform.OS === "ios" && gametype != "TFG" ?
					<WebViewIOS
						mediaPlaybackRequiresUserAction={false}
						onLoadStart={() => this.setState({loadD:true})}
						onLoadEnd={() => this.setState({loadD:false,loadone:2}) }
						renderLoading={(e) => console.log(e)}
						source={{ uri:urlk }}
						mixedContentMode='always'
						key={gameKey} 
						allowsInlineMediaPlayback//使用原生的全屏播放器播放 默认值为false
						allowFileAccess
						javaScriptEnabled={true}
						domStorageEnabled={true}
						scalesPageToFit={false}//是否要把网页缩放到适应视图的大小，以及是否允许用户改变缩放比例
						style={{
							width:widthS,
							height:heightS,
						}}
					/> 

					:gametype == "TFG" && Platform.OS == "ios" &&

					<WebViewIOS
						mediaPlaybackRequiresUserAction={false}
						onLoadStart={() => this.setState({loadD:true})}
						onLoadEnd={() => this.setState({loadD:false,loadone:2}) }
						renderLoading={(e) => console.log(e)}
						source={{ uri:urlk, method: 'GET', headers: { 'Cache-Control':'no-cache'} }}
						mixedContentMode='always'
						key={gameKey}  
						javaScriptEnabled={true}
						domStorageEnabled={true}
						scalesPageToFit={false}
						style={{
							width:widthS,
							height:heightS,
						}}
					/> 
				}

				{urlk !="" && Platform.OS === "android" &&  gametype != "TFG" ?
					<WebView
						mediaPlaybackRequiresUserAction={false}
						onLoadStart={() => this.setState({loadD:true})}
						onLoadEnd={() => this.setState({loadD:false,loadone:2}) }
						renderLoading={(e) => console.log(e)}
						source={{ uri:urlk }}
						mixedContentMode='always'
						key={gameKey}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						scalesPageToFit={(gametype === 'YDS' || gametype === 'YDSPNG') ? true :false}
						style={{
							width:widthS,
							height:heightS,
						}}
					/>

					:gametype == "TFG" && Platform.OS == "android" &&

					<WebView
						mediaPlaybackRequiresUserAction={false}
						onLoadStart={() => this.setState({loadD:true})}
						onLoadEnd={() => this.setState({loadD:false,loadone:2}) }
						renderLoading={(e) => console.log(e)}
						source={{ uri:urlk, method: 'GET', headers: { 'Cache-Control':'no-cache'} }}
						mixedContentMode='always'
						key={gameKey}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						scalesPageToFit={gametype === 'YDS' ? true :false}
						style={{
							width:widthS,
							height:heightS,
						}}
					/>
				}



				{loadone == 1 && loadD == true &&
					<Flex 
						style={{
							position: "absolute", 
							zIndex: 9999, 
							height:heightS,
							width:widthS,
							backgroundColor: '#202020',
						}}
					>
						<Flex.Item> 
							<ActivityIndicator size="large" color="#fff" /> 
						</Flex.Item>
					</Flex>
				}

				{menuOpen == true && 
					<TouchableOpacity 
						activeOpacity={0} 
						style={{
							width:widthS,
							height:heightS,
							opacity:0, 
							backgroundColor: '#fff', 
							position: 'absolute',
						}} 
						onPress={() => {this.OpenMenu()}}
					>  
						<View></View>	
					</TouchableOpacity>
				} 
				{menuOpen == true && 
					<View style={styles.menu}> 
						<Flex style={styles.navHeader} >    
							<Flex.Item style={{flex:0.45}}> 
								<Text 
									style={{
										textAlign: 'left',
										color:"#fff",
									}}
								>
									{userNameDB? userNameDB:''}, 
								</Text> 
							</Flex.Item>	
															
							<Flex.Item alignItems='flex-end' style={styles.userMoneybox2}>
								<View style={styles.button}>   		
									<Text 
										style={{
											textAlign: 'left',
											color:"#feeaab",
										}}
									>
										{TotalBal} ฿
									</Text> 
								</View>
							</Flex.Item>
																	
							<Flex.Item 
								alignItems='flex-end' 
								style={{
									flex:0.1,
									paddingRight:10,
									top:6,
								}}
							>									
							</Flex.Item>
																				
							<Flex.Item alignItems='flex-end' style={styles.userReload}>
								<Touch style={styles.button} onPress={this.resetMoner}>
									<View 
										style={{
											paddingLeft:20,
											paddingTop:6,
										}} 
									>
										<Image 
											resizeMode='stretch' 
											source={require('../images/icon_lib_refresh1.png')} 
											style={{ 
												width: 15, 
												height: 15,
											}} 
										/>
									</View>
								</Touch>
							</Flex.Item>														
						</Flex>
															
						<Flex>      	 
							<Flex.Item style={styles.buttonB}>
								<TouchableOpacity  
									hitSlop={{
										top: 10, 
										bottom: 10, 
										left: 5, 
										right: 5,
									}} 
									onPress={() => {this.navigateToScene('depositTx','deposit')}}
								>							
									<Text 
										style={{
											textAlign: 'center',
											color:"#fff",
										}}
									>
										ฝาก
									</Text> 
								</TouchableOpacity>
							</Flex.Item>																				   
						</Flex>
														
						{gametype != "SGW" &&  gametype != "SXY" && gametype != "AGL" && gametype != 'JIF' && gametype != 'OWS' &&
							<TouchableOpacity style={{height:50}} onPress={()=>reloadGame()}>   		
								<Flex style={styles.dowButton2}>   
									<Flex.Item> 
										<Text style={styles.fontText3}>รีเฟรชเกม</Text>  
									</Flex.Item> 
								</Flex>
							</TouchableOpacity>
											
						} 

						{(gametype == "SXY" || gametype == "OWS" || gametype == "AGL") &&
							<TouchableOpacity style={{height:50}} onPress={
								gametype == "SXY" ? ()=>this.reloadSXY(0, "SXY", "SEXY คาสิโน", "NoSave") : gametype == "OWS" ? ()=>this.reloadSXY(0, "OWS", "SABA กีฬา", "NoSave") : ()=>this.reloadSXY(0, "AGL", "AG คาสิโน", "NoSave")
								}>   		
								<Flex style={styles.dowButton2}>   
									<Flex.Item> 
										<Text style={styles.fontText3}>รีเฟรชเกม</Text>  
									</Flex.Item> 
								</Flex>
							</TouchableOpacity>
											
						} 
					
					</View>
				}		

				{menuOpenJBP == true &&   //棋牌遊戲專屬 側滑欄
					<TouchableOpacity   
						style={[
							styles.ButtonMenu2,
							{
								top: heightJBP,
							}
						]} 
						hitSlop={{
							top: 15, 
							bottom: 15, 
							left: 15, 
							right: 15,
						}} 
						onPress={() => {this.OpenMenuJBP()}}
					>  
						<View>	 
							<Image 
								resizeMode='stretch' 
								source={require('../images/Gamemenu/icon_right.png')}											
								style={{ 
									width: 10, 
									height: 20,
									top:28,
								}} 
							/>													
						</View>  
					</TouchableOpacity> 
				}
				{menuOpenJBP == true &&   //棋牌遊戲專屬 側滑欄
					<View style={[styles.menuJBP,{ height:heightS}]}> 
						<View 
							style={{
								textAlign: 'center',  
								alignItems:'center',
								height:45,
							}}
						>
							<View 
								style={{
									display: 'flex',
									flexDirection: 'row',
									top:10,
								}}
							>
								<Image 
									resizeMode='stretch' 
									source={require('../images/JBO_logo.png')} 
									style={{ 
										width: 30, 
										height: 30,
									}} 
								/>
								<Text 
									style={{
										color:'#fff',
										fontSize:14,
										top:8,
									}}
								>
									{this.props.gametype == 'JBP' ? '竞博棋牌' :'BOLE棋牌'}
								</Text>
							</View>
						</View>


						<ImageBackground
							style={{  
								height: 140,
							}}
							resizeMode="stretch"
							source={require("../images/user/upper-background.png")}
						>
										
							<Flex style={styles.gameBg0}> 
								<Flex.Item alignItems='center'>
									<Image 
										resizeMode='stretch' 
										source={require('../images/user/avator.png')} 
										style={{ 
											width: 60, 
											height: 60,
											marginTop: 20,
											borderRadius: 30,
										}} 
									/>
								</Flex.Item>  

							</Flex> 

							<Flex style={styles.gameBg0}> 
								<Flex.Item alignItems='center'>
									<Text 
										style={{
											color:"#fff",
											fontSize:14,
										}}
									>
										{userNameDB}
									</Text>
								</Flex.Item>  

							</Flex> 

							<Flex style={styles.gameBg0}> 
								<Flex.Item
									alignItems='center' 
									style={{
										paddingLeft:20,
									}}
								>
									<View 
										style={{
											flexWrap: 'wrap', 
											display:'flex', 
											flexDirection: 'row',
										}}
									>
										<Text 
											style={{
												textAlign: 'center',
												color:"#fff4a6",
												fontSize:18,
												fontWeight:'bold',
											}}
										>
											{TotalBal} ฿
										</Text>
										<Touch onPress={()=> this.resetMoner()}>
											<Image 
												resizeMode='stretch' 
												source={require('../images/user/refresh.png')} 
												style={{ 
													width: 23, 
													height: 23,
													marginLeft:8,
												}} 
											/>
										</Touch>
									</View>
								</Flex.Item>   

							</Flex> 
							
							<Flex> 
								<Flex.Item 
									style={{
										justifyContent: 'center',
										flexDirection: 'row',
										marginTop: 15,
									}}
								> 
								<Touch onPress={()=> this.jumpDep()}>
									<View 
										style={[
											styles.dpowithd,
											{
												borderColor: '#00e62c',
												marginRight: 12,
											}
										]}
									>
										<Image 
											resizeMode='stretch' 
											source={require('../images/user/Dpo.png')} 
											style={{ 
												width: 23, 
												height: 23,
											}} 
										/>
										<Text 
											style={{
												color:"#00e62c",
												fontSize:18,
											}}
										>
											ฝาก
										</Text>
									</View> 
								</Touch>
								<Touch onPress={()=> this.jumpDepWith()}>
									<View 
										style={[
											styles.dpowithd,
											{
												borderColor: '#02c9ff',
											}
										]}
									>
										<Image 
											resizeMode='stretch' 
											source={require('../images/user/withd.png')} 
											style={{ 
												width: 23, 
												height: 23,
											}} 
										/>
										<Text 
											style={{
												color:"#02c9ff",
												fontSize:18,
											}}
										>
											提现
										</Text>
									</View> 
								</Touch>		
								</Flex.Item>
							</Flex>
						</ImageBackground>

										
						<Flex>      	 
							<Flex.Item style={styles.buttonB}>
								<TouchableOpacity  
									hitSlop={{
										top: 10, 
										bottom: 10, 
										left: 5, 
										right: 5,
									}} 
									onPress={() => {this.navigateToScene('depositTx','deposit')}}
								>							
									<Text 
										style={{
											textAlign: 'center',
											color:"#fff",
										}}>
											ฝาก
									</Text> 
								</TouchableOpacity>
							</Flex.Item>																				   
						</Flex>
														
												
						<TouchableOpacity 
							style={{
								height:50
							}} 
							onPress={()=>reloadGame()}
						>   		
							<Flex style={styles.dowButton2}>   
								<Flex.Item> 
									<Text style={styles.fontText3}>
										รีเฟรชเกม
									</Text>  
								</Flex.Item> 
							</Flex>
						</TouchableOpacity>

						<Flex style={{flex:0.7}}></Flex>
						<TouchableOpacity 
							style={{
								height:50,
							}} 
							onPress={()=>this.goHome()}
						>   		
								<Flex  style={styles.dowButton3}>   
									<Flex.Item 
										alignItems='flex-start'
										style={{
											flex:0.2,
											left:10,
										}}
									> 
										<Image 
											resizeMode='stretch' 
											source={require('../images/Gamemenu/icon_home.png')} 
											style={{ 
												width: 17, 
												height: 17,
											}} 
										/> 
									</Flex.Item>
									<Flex.Item 
										alignItems='flex-start'
										style={{
											flex:1,
											left:15,
										}}
									> 
										<Text 
											style={{
												textAlign: 'left', 
												color:"#fff", 
												fontSize: 14,
											}}
										>
											返回主页
										</Text>  
									</Flex.Item> 
									<Flex.Item 
										alignItems='flex-start' 
										style={{
											flex:0.8,
										}}
									> 
									</Flex.Item>																
								</Flex>
						</TouchableOpacity>												 
					
					</View>
				}	
				


					
						
					
			</View>	
							
		</View>		
			
	)
	}
}

const styles = StyleSheet.create({
	JBPbutton:{
		width:90,
		height: 35,
		right:105, 
		marginTop:60,
		position: 'absolute',
		textAlign: 'center', 
		alignItems:'center',
		borderColor: '#00E62E',
		borderWidth: 1, 
		borderRadius: 8,
	},
	lineStyle:{
		width:50,
		height: 110,
		right:-10, 
		marginTop:-15,
		position: 'absolute',
		textAlign: 'center', 
		alignItems:'center',
		borderColor: '#00E62E',
		borderWidth: 1,
		borderStyle: 'dashed'
	  },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
       // borderRadius: CIRCLE_SIZE / 2,
        //backgroundColor: 'green',
        position: 'absolute',
	},
	ButtonMenu:{
		
		width:32,
		height:80, 
		backgroundColor:'rgba(0,0,0,0.6)',
		position: 'absolute',
		textAlign: 'center', 
		alignItems:'center'
	},

	ButtonMenu2:{
		right:230, 
		width:32,
		height:80, 
		position: 'absolute',
		backgroundColor:'rgba(0,0,0,0.6)', 
		textAlign: 'center', 
		alignItems:'center'
	},

		menu:{
			left:0,
			top:0,
			width:width-60,
			height:height,
			backgroundColor: '#171717',
			position: 'absolute',
			zIndex:9999,
		},

		menuJBP:{
			right:0,
			top:0,
			width:230,
			backgroundColor: '#171717',
			position: 'absolute',

		},
		container: {
		    flex: 1,
		    padding: 0
				
		  },
		
		  button: {
				height:30,
		  },
			
			buttonB:{
				paddingTop:15,
				paddingBottom:15,
				borderBottomWidth: 1,
				backgroundColor: '#171717',
				borderColor: '#404040'
			},
			widthSome:{
		        width:width - (13+42+5+45+11+18+10),
		    },
			fontText:{
				textAlign: 'center',
				color:"#fff",
		    fontSize: 16,
			},
			
			fontText2:{
				textAlign: 'left',
				paddingLeft:13,
				color:"#fff",
				fontSize: 14,
			},
			fontText3:{
				textAlign: 'center',
				color:"#fff",
				fontSize: 14,
			},
			
			MoneyBg:{
				opacity:0,
				backgroundColor: '#000',
				position: 'absolute', 
			},
			MenuXbox:{
			
				borderBottomWidth: 1,
				borderColor: '#404040',
				backgroundColor: '#013626',
				
			},
			MenuXd:{
				flex:0.9,
		    paddingTop:10,
		    paddingBottom:10,
			},
			MenuXdIcon:{
				flex:0.1,
			
			},
			MenuXc:{
			
				borderBottomWidth: 1,
				borderColor: '#013626'
				
			},
			MenuXb:{   //下拉選單樣式
				paddingTop:10,
				paddingBottom:10,
				paddingLeft:15,
				borderColor: '#485d57',
				borderBottomWidth: 1,
				backgroundColor: '#001f16'
				
			},
			
			iconMenu:{
				width:10,
				height:10,
				borderRadius:80,
				marginTop:4,
				backgroundColor: '#f6e4a6'
			},
			navHeader: {
				backgroundColor: '#171717',
				paddingLeft:8,
				paddingRight:15,
				paddingTop:5,
				paddingBottom:5,
				borderBottomWidth: 1,
				borderColor: '#404040'
		  },
		
		  navMenu: {
		    backgroundColor:'#404040',
			},
			
			
			dowButton: {
				backgroundColor: '#00633c',
			
				borderBottomWidth: 1,
				borderColor: '#00633c'
			},
			
			dowButton2: {
				backgroundColor: '#171717',
				paddingTop:15,
				paddingBottom:15,
				paddingLeft:5,
				paddingRight:15,
				borderBottomWidth: 1,
				borderColor: '#404040'
			},
			
			dowButton3:{
				backgroundColor: '#171717',
				paddingTop:15,
				paddingBottom:15,
				paddingLeft:5,
				paddingRight:15,
			},
			
			NoticeText:{
		
			},
			userMoney:{  //menu 菜單
				width:width-50,
				position: 'absolute', 
				top: Platform.OS === "android" ? 25 :35, 
				left: 19, 
				borderRadius:12,
				backgroundColor: '#001f16',  
			},


			userMoneyBox:{
				 padding:7,
				 borderBottomWidth: 1,
				 borderColor: '#444444',
				 
			}, 
		  userMoneyText:{
			  fontSize:13,
				color:"#fff"
			},
			
		
		
			userMoneybox1:{
				flex:0.4,
			},
			userMoneybox2:{
				flex:0.4,
				top:6,
			},
			userReload:{
				flex:0.1,
				top:1,
				borderLeftWidth: 1,
				borderColor: '#404040'
			},
			oneT:{ //一鍵轉帳
			flex:0.4,
			paddingTop:2,
			paddingLeft:4,
			paddingRight:4,
			paddingBottom:2,
			borderRadius:12,
			marginLeft:5,
			backgroundColor: '#00633c',
			},
			oneT2:{
		    flex:0.4,
		     paddingTop:2,
			paddingLeft:4,
			paddingRight:4,
			paddingBottom:2,
			borderRadius:12,
			marginLeft:5,
			}
			
}); 

export default(GamePage);



