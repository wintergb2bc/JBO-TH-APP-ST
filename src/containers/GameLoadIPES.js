import React from 'react';
import { StyleSheet, Text, Image, View, Platform, ScrollView, Dimensions, TouchableOpacity, WebView } from 'react-native';
import { connect } from 'react-redux';
import { Flex, Toast, ActivityIndicator } from 'antd-mobile-rn';
import { Actions } from 'react-native-router-flux';
//import Carousel, { Pagination } from 'react-native-snap-carousel';
import Touch from 'react-native-touch-once';
import Orientation from 'react-native-orientation-locker';
//import Head from './Bank/Head';
import WebViewIOS from 'react-native-webview';
import { ACTION_MaintainStatus_SetIM } from '../containers/lib/redux/actions/MaintainStatusAction'

const {
    width, height
} = Dimensions.get('window')

  
 

class GAMEIPES extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadD:false,
            loadone:1, 
            Button1: '',
            BannerDB: '',
            widthS:width,
		    heightS:Platform.OS === "android" ? height-69 : height,
            newsAnnouncements: '',
            NowType: 1,
            enabled: true,
            scrollEnabled: true,
            isEditState: false,
            Gameplay: '',
            ReLoadGameK: '',
            activeSlide: 0,
            IPESGameOpenUrl:'',
            IPESgametype:'',
            SBTGameOpenUrl:'',
            SBTgametype:'', 
            IPSBGameOpenUrl:'',
            IPSBgametype:'',
            OWSgametype:'',
            OWSGameOpenUrl:'',
            modal2:true, 
            GamezindexIPES:0,
            menuOpen:false,
            gameKey:0, 
            TotalBal:0,
            NoewGameType:'',
            HeadHeight:50,
            GoBackIM:false,
            IPESgameKey:0,
            SBTgameKey:0,
            IPSBgameKey:0,
            OWSgameKey:0,
            IPESErr:false,
            IPSBErr:false,
            SBTErr:false,
            OWSErr:false,
            headTitle:'',//顶部标题
        } 

        

    }

    navigateToScene(key, GameOpenUrl) {
        Actions[key]({ GameOpenUrl: GameOpenUrl });
  
            this.setState({
                menuOpen:false,
                GamezindexIPES:0
            }) 
        
    }

    componentWillMount() {  
            this.AAwidthHeight();  
    }

    AAwidthHeight(){  //重新計算寬高
		const {
			width ,height
		} = Dimensions.get('window')
	//	console.log('被監聽調用')
		if(this.state.widthS != width){
			 
			//console.log(width,height)
			if(width > height){
				this.setState({
					widthS:width,
                    heightS:Platform.OS === "android" ? height-69 : height,
                    HeadHeight:60,
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
				  if(height >= 812){  
					this.setState({
						widthS:width,
						heightS:height,
					})
				  }else{ 
					this.setState({
						widthS:width,
						heightS:Platform.OS === "android" ? height-69 : height,
					})  
				  }
	
			  }else{
				this.setState({
					widthS:width,
					heightS:Platform.OS === "android" ? height-69 : height,
				}) 

			  }
			  
				_previousLeft=150;
				_previousTop=80;
				
				lastLeft=150;
				lastTop=80;
				let topse = Platform.OS === "android" ? 0 :31;
				this.setState({
                    HeadHeight:50,
					pageTop:0
				})
			  
			}
			
		}
	
		
	}

    navigateToSceneGame(key, item) {
        //console.log(key,item) 
        RmoveOrien(); //刪掉監聽
        Actions[key]({ data: item });
       
    } 

    //请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
    GetPlayGameurl(gameid, gametype, userGameDB) {
        if (ApiPort.UserLogin == false) {
            // Toast.fail("请先登录", 2);
             return;
         }

        // if (isGameLock == true) {
        //     Toast.fail("尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服", 2);
        //     return;
        // }
        console.log(gameid, gametype, userGameDB)

        //console.log(gameid, gametype)
        let data;
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


        let GameName;

        if(gametype == 'IPES'){
            GameName = '竟博电竞'
        }

        if(gametype == 'IPSB'){
            GameName = 'IM体育'
        }
        
        if(gametype == 'SBT'){
            GameName = '竟博体育'
        }

        if(gametype == 'OWS'){
            GameName = 'SABA体育'
        }
        

        //Toast.loading('正在启动游戏,请稍候...', 200);
        fetchRequest(ApiPort.Game + gameid + '?isDemo=false&', 'POST', data)
            .then(data => {

                console.log('Game=========',data)
              if (data.errorCode == 2001) {
                if (gametype == "IPES") {
                    this.setState({
                        IPESErr:true
                    })
    
                }
                if (gametype == "IPSB") {
                    IPSBClose = 'xianzhi'
                    this.setState({
                        IPSBErr:true
                    })
                    return
                }
                if (gametype == "SBT") {
                    SBTClose = 'xianzhi'
                    this.setState({
                        SBTErr:true
                    })
                    return
                }
                if (gametype == "OWS") {
                    OWSClose = 'xianzhi'
                    this.setState({
                        OWSErr:true
                    })
                    return
                }
    
            }

                if (data.errorCode == 9998) {
                    if (data.isMaintenance) {
                        if (gametype == 'IPSB') {
                            this.props.maintainStatus_setIM(true);
                        }
                        return
                    }
                }
                
                if (data.errorCode == 0) {
                    if (data.isMaintenance == true) {
                     
                        if(gametype == 'IPSB'){
                            IPSBClose = 'weihu'
                        }

                        if(gametype == 'SBT'){
                            SBTClose = 'weihu'
                        }

                        if(gametype == 'OWS'){
                            OWSClose = 'weihu'
                        }

                        //Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。', 2);
                        return;
                    }  

                    if(gametype == 'IPES'){
                        this.setState({
                            IPESGameOpenUrl:data.gameUrl, 
                            IPESgameKey:Math.random(),
                            loadD:false,
                            loadone:1, 
                            menuOpen:false,
                        }) 
                        return;
                    }

                    if(gametype == 'IPSB'){ 
                        IPSBClose = false;
                        this.setState({
                            IPSBGameOpenUrl:data.gameUrl, 
                            IPSBgameKey:Math.random(), 
                        })
                        return;
                    }

                    if(gametype == 'SBT'){  
                        SBTClose = false;
                        this.setState({
                            SBTGameOpenUrl:data.gameUrl.split('&langid=')[0]+ '&ReferURL='+ SBTDomain +'&oddsstyleid=3&APIUrl='+ common_url +'&bal='+MAIN+'&langid='+data.gameUrl.split('&langid=')[1], 
                            SBTgameKey:Math.random(), 
                        })   

                         return;
                    }

                    if(gametype == 'OWS'){  
                        OWSClose = false;
                        this.setState({
                            OWSGameOpenUrl:data.gameUrl, 
                            //OWSgameKey:Math.random(), 
                        })   

                         return;
                    }
  
                } else {
                    if(gametype == 'IPSB'){
                        IPSBClose = 'weihu'
                    }

                    if(gametype == 'SBT'){
                        SBTClose = 'weihu'
                    }

                    if(gametype == 'OWS'){
                        OWSClose = 'weihu'
                    }
                    // Toast.fail(
                    //   "亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
                    //   2
                    // );
                    return;
                }
  
              
            }).catch(error => {
                Toast.hide();
            })
    }


 
	closeButtonIPES(){
        this.setState({
            GamezindexIPES:0,
            OWSGameOpenUrl:'',
        })
          
        if(this.state.NoewGameType == 'IPES'){
         
            this.GetPlayGameurl(0,'IPES')  
         }

        //  if(this.state.NoewGameType == 'IPSB'){
        //     this.GetPlayGameurl(0,'IPSB')  
        //  }

        //  if(this.state.NoewGameType == 'SBT'){
        //     this.GetPlayGameurl(0,'SBT')  
        //  }


        this.loadInterval && clearInterval(this.loadInterval);
        ReloadMoneyHome();
        reloadOrientation(); 
        Orientation.removeOrientationListener(this._onOrientationChange);  
      
    }

    _onOrientationChange(curOrt){ 
        // Orientation.unlockAllOrientations();
        console.log('在遊戲裡面改變方向1111') 
    }
    
    openmenuX(){
        this.setState({
            menuOpen:this.state.menuOpen == true ? false:true
        })
    }
 
    reloadGame(){ 
      
        this.TotalBal();

        setTimeout(() => {
            if(this.state.NoewGameType == 'OWS'){
                this.GetPlayGameurl(0,'OWS')  
                setTimeout(() => {
                        this.setState({ 
                            loadD:false,
                            loadone:1, 
                            menuOpen:false,
                            //OWSgameKey:Math.random(), 
                        })
                 }, 3000) 
                return;
            }

            if(this.state.NoewGameType == 'SBT'){
                this.GetPlayGameurl(0,'SBT')  
                setTimeout(() => {
                        this.setState({ 
                            loadD:false,
                            loadone:1, 
                            menuOpen:false,
                            SBTgameKey:Math.random(), 
                        })
                 }, 3000) 
                return;
            }


            if(this.state.NoewGameType == 'IPSB'){
                this.GetPlayGameurl(0,'IPSB')  
                setTimeout(() => {
                this.setState({ 
                    loadD:false,
                    loadone:1, 
                    menuOpen:false,
                    IPSBgameKey:Math.random(), 
                })
            }, 3000) 
                return; 
            }


            if(this.state.NoewGameType == 'IPES'){

                this.setState({ 
                    loadD:false,
                    loadone:1, 
                    menuOpen:false,
                    IPESgameKey:Math.random(), 
                })

                return; 
            }

 

        }, 1000) 

    }
 
    
   //餘額
   TotalBal() {
    fetchRequest(ApiPort.Balance, 'GET')
        .then(data => {

           // console.log('BALKM',data[0].balance)
            MAIN = data[0].balance
            this.setState({
                TotalBal:data[0].balance
            })


        }).catch(error => {
            Toast.hide();
        })

        }

        ReloadOver(){

            setTimeout(() => {
                this.setState({loadD:false,loadone:2}) 
            }, 2000)

          
        }


        GoBackIM(){
            this.setState({
                GoBackIM:false
            })
        }
    
        CheckMsg(msg){

            if(msg.url){
                
                if(msg.url.split('/')[2] == "m.huya.com" ){
                        this.setState({
                            GoBackIM:true
                        })
                }

            }

        }

 
    render() {
        const {
            TotalBal,
            NoewGameType, 
            GoBackIM,
            HeadHeight,
            GamezindexIPES, 
            menuOpen, 
            IPESGameOpenUrl,
            IPSBGameOpenUrl ,
            SBTGameOpenUrl,
            OWSGameOpenUrl,
            loadD, 
            IPESgameKey,
            SBTgameKey,
            IPSBgameKey,
            OWSgameKey,
            loadone,
            widthS,
            heightS,
            IPESErr,
            IPSBErr,
            SBTErr,
            OWSErr
        } = this.state
        
     
		 window.OpenGameXA = (Type,title) =>{
            if ((Type == "IPSB" && IPSBErr) || (Type == "SBT" && SBTErr) || (Type == "OWS" && OWSErr)) {
                Toast.fail(
                    "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
                    2
                );
                // Toast.fail(
                //   "尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服",
                //   2
                // );
                return;
            }
            this.TotalBal();
             this.setState({
                 NoewGameType:Type,
                 headTitle:title,
                 GamezindexIPES:999, 
             }) 

             this.loadInterval = setInterval(() => {
                this.AAwidthHeight();
             },50) 
           
        //    if(Type == 'SBT'){
        //       GameDBType = true;
        //      // RmoveOrien(); //刪掉全局監聽 橫屏
        //     //   Orientation.unlockAllOrientations();   //解鎖橫豎屏
        //      return;
        //    }
             GameDBType = false;
            
           //  RmoveOrien(); //刪掉全局監聽 橫屏
            // Orientation.unlockAllOrientations();   //解鎖橫豎屏
         }

         window.CloseGameIPES = () =>{

            if(GamezindexIPES != 0){
                this.setState({
                    GamezindexIPES:0
                }) 
                
               // this.loadInterval && clearInterval(this.loadInterval);
                reloadOrientation(); 
                Orientation.removeOrientationListener(this._onOrientationChange); 
            }
             
        }


        window.LoadGameIPES =()=>{
            this.GetPlayGameurl(0,'IPES')  
        }



        ///////

        window.LoadGameIPSB =()=>{
            this.GetPlayGameurl(0,'IPSB')  
        }
 

        /////


        window.LoadGameSBT =()=>{
            this.GetPlayGameurl(0,'SBT')  
        }

        /////


        window.LoadGameOWS =()=>{
            this.GetPlayGameurl(0,'OWS')
        }
 
	

      return (
 


        <View 
            style={[
                GamezindexIPES== 0 ? styles.NoOpen : styles.canOpen,
                {
                    width:GamezindexIPES== 0 ? 0:widthS,
                    height:GamezindexIPES== 0 ? 0:(Platform.OS === "android" ? height+18:heightS)
                }
            ]}
        >
                
   
            <View 
                style={{
                    top:Platform.OS === "android" ? 0:25,
                    backgroundColor:"#111111",
                    width:widthS, 
                    height:45,
                    zIndex:130,
                }}
            >
            {/* head*/}
                <View 
                    style={{
                        alignItems:'flex-start',
                        justifyContent:'flex-start', 
                        paddingTop:HeadHeight == 60 ? 5 :(Platform.OS === "android" ? 12:15),
                        paddingLeft:15,
                    }}
                >
                    {/* <TouchableOpacity hitSlop={{top: 12, bottom: 12, left: 15, right: 15}}  style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',alignContent:'center',top:-5}} onPress={()=>    GoBackIM != true ? this.closeButtonIPES() : this.reloadGame()   }  >
                    <Image resizeMode='stretch' source={require('../images/back_chevron.png')} style={{ width: 14, height: 24}} />  */}
                    <View 
                        style={{
                            flexDirection:'row',
                            justifyContent:'flex-start',
                            alignItems:'center',
                            alignContent:'center',
                            top:-5
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
                            fontSize:16,
                        }}>
                            {this.state.headTitle}
                        </Text> 
                    </View>
                    {/* </TouchableOpacity> */}
                </View>
            {/* goHome*/}
                <View 
                    style={{
                        alignItems:'flex-end',
                        position:'absolute',
                        top:HeadHeight == 60 ?-30 :(Platform.OS === "android" ? 12:15),
                        right:50,
                    }} 
                >
                    <TouchableOpacity  
                        hitSlop={{
                            top: 10, 
                            bottom: 10, 
                            left: 5, 
                            right: 5,
                        }}    
                        onPress={()=>this.closeButtonIPES()} 
                    >
                    <Image  
                        resizeMode='stretch' 
                        source={require('../images/goHome.png')} 
                        style={{ 
                            width: 22, 
                            height: 22,
                        }} 
                    /> 
                    </TouchableOpacity>
                </View> 
            {/* menu_burger */}
                <View 
                    style={{
                        alignItems:'flex-end',
                        position:'absolute',
                        top:HeadHeight == 60 ?-30 :(Platform.OS === "android" ? 12:15),
                        right:15,
                    }}
                >
                    <TouchableOpacity  
                        hitSlop={{
                            top: 10, 
                            bottom: 10, 
                            left: 5, 
                            right: 5,
                        }}    
                        onPress={()=>this.openmenuX()}
                    >
                    <Image  
                        resizeMode='stretch' 
                        source={require('../images/menu_burger.png')} 
                        style={{ 
                            width: 25, 
                            height: 25,
                        }}
                    /> 
                    </TouchableOpacity>
                </View> 
            </View>

            {menuOpen == true && 
                <TouchableOpacity 
                    activeOpacity={0} 
                    style={{  
                        position: 'absolute',
                        top:45, 
                        zIndex:998,
                        width:widthS,
                        height:heightS,
                        opacity:0, 
                        backgroundColor: '#fff', 
                        position: 'absolute',
                    }} 
                    onPress={() => {this.openmenuX()}}
                >  
                    <View></View>	
                </TouchableOpacity>
             }

            {menuOpen == true && 
                <View 
                    style={[
                        styles.menu,
                        {
                            top:HeadHeight == 60 ?62:(Platform.OS === "android" ? 46:66),
                            width:HeadHeight == 60 ?width/1.9 :width-60,
                        }
                    ]}
                >

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
                                                    
                        <Flex.Item 
                            alignItems='flex-end' 
                            style={styles.userMoneybox2}
                        >
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
                                                            
                        <Flex.Item 
                            alignItems='flex-end' 
                            style={styles.userReload}
                        >
                            <Touch 
                                style={styles.button} 
                                onPress={()=>this.TotalBal()}
                            >
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
                                onPress={() => {this.navigateToScene('depositTxMAX','deposit')}}
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
                                                                                        
                    <TouchableOpacity 
                                    style={{
                                        height:50,
                                    }} 
                                    onPress={()=>this.reloadGame()}
                                >   		
                                    <Flex 
                                        style={styles.dowButton2}
                                    >   
                                        <Flex.Item> 
                                            <Text 
                                                style={styles.fontText3}
                                            >
                                                รีเฟรชเกม
                                            </Text>  
                                        </Flex.Item> 
                                    </Flex>
                                </TouchableOpacity> 
                </View>
            }		
			
            <ScrollView 
                style={[ 
                    NoewGameType =='IPSB' ? styles.CanXOpen :styles.CloseGame,
                    {
                        width:NoewGameType =='IPSB' ? widthS:0,
                        height:NoewGameType =='IPSB' ? (Platform.OS === "android" ? heightS:heightS-65):0, 
                        top:Platform.OS === "android" ? 0:20,
                        //paddingBottom: Platform.OS === "android" && NoewGameType =='IPSB' ? 69:0,
                        //backgroundColor: '#000'
                    } 
                ]}
            >
                
                {IPSBGameOpenUrl != '' && Platform.OS === "ios" &&
                    <WebViewIOS
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={(e) => this.setState({loadD:true})}
                        onLoadEnd={(e) => this.ReloadOver() } 
                        source={{ uri:IPSBGameOpenUrl}}
                        mixedContentMode='always' 
                        key={IPSBgameKey}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        style={{
                            width:widthS,
                            height:Platform.OS === "android" ? heightS-13:heightS-40,
                            backgroundColor:'#1a1a1a',
                        }}
                    /> 
                }   

                {IPSBGameOpenUrl != '' && Platform.OS === "android" &&
                    <WebView
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={(e) => this.setState({loadD:true})}
                        onLoadEnd={(e) => this.ReloadOver() } 
                        source={{ uri:IPSBGameOpenUrl}}
                        mixedContentMode='always' 
                        key={IPSBgameKey}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        style={{
                            width:widthS,
                            //height:Platform.OS === "android" ? heightS-13:heightS-40,
                            height:Platform.OS === "android" ? heightS:heightS-40,
                            backgroundColor:'#1a1a1a',
                        }}
                    /> 
                }
            </ScrollView>                    


            <View 
                style={[ 
                    NoewGameType =='SBT' ? styles.CanXOpen :styles.CloseGame ,
                    {
                        width:NoewGameType =='SBT' ? widthS:0,
                        height:NoewGameType =='SBT' ? (Platform.OS === "android" ? height:heightS-45):0  , 
                        top:Platform.OS === "android" ? 0:20,
                        paddingBottom: Platform.OS === "android" && NoewGameType =='SBT' ? 69:0 ,
                        backgroundColor: '#000',
                    } 
                ]}
            >
                
                {SBTGameOpenUrl != ''  && Platform.OS === "ios" &&
                    <WebViewIOS
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={(e) => this.setState({loadD:true})}
                        onLoadEnd={(e) => this.ReloadOver() } 
                        source={{ uri:SBTGameOpenUrl}}
                        mixedContentMode='always' 
                        key={SBTgameKey}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        style={{
                            width:widthS,
                            height:Platform.OS === "android" ? heightS:heightS-45,
                            backgroundColor:'#1a1a1a',
                        }}
                    /> 
                }       
                
                {SBTGameOpenUrl != ''  && Platform.OS === "android" &&
                    <WebView
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={(e) => this.setState({loadD:true})}
                        onLoadEnd={(e) => this.ReloadOver() } 
                        source={{ uri:SBTGameOpenUrl}}
                        mixedContentMode='always' 
                        key={SBTgameKey}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        style={{
                            width:widthS,
                            height:Platform.OS === "android" ? heightS:heightS-45,
                            backgroundColor:'#1a1a1a',
                        }}
                    /> 
                }       
            </View>     

            <ScrollView 
                style={[ 
                    NoewGameType =='OWS' ? styles.CanXOpen :styles.CloseGame,
                    {
                        width:NoewGameType =='OWS' ? widthS:0,
                        height:NoewGameType =='OWS' ? (Platform.OS === "android" ? heightS:heightS-65):0, 
                        top:Platform.OS === "android" ? 0:20,
                        //paddingBottom: Platform.OS === "android" && NoewGameType =='IPSB' ? 69:0,
                        //backgroundColor: '#000'
                    } 
                ]}
            >
                
                {OWSGameOpenUrl != '' && Platform.OS === "ios" &&
                    <WebViewIOS
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={(e) => this.setState({loadD:true})}
                        onLoadEnd={(e) => this.ReloadOver() } 
                        source={{ uri:OWSGameOpenUrl}}
                        mixedContentMode='always' 
                        key={OWSgameKey}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        style={{
                            width:widthS,
                            height:Platform.OS === "android" ? heightS-13:heightS-40,
                            backgroundColor:'#1a1a1a',
                        }}
                    /> 
                }   

                {OWSGameOpenUrl != '' && Platform.OS === "android" &&
                    <WebView
                        mediaPlaybackRequiresUserAction={false}
                        onLoadStart={(e) => this.setState({loadD:true})}
                        onLoadEnd={(e) => this.ReloadOver() } 
                        source={{ uri:OWSGameOpenUrl}}
                        mixedContentMode='always' 
                        key={OWSgameKey}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        style={{
                            width:widthS,
                            //height:Platform.OS === "android" ? heightS-13:heightS-40,
                            height:Platform.OS === "android" ? heightS:heightS-40,
                            backgroundColor:'#1a1a1a',
                        }}
                    /> 
                }
            </ScrollView>  


            {loadone == 1 && loadD == true &&
                <Flex 
                    style={{
                        height:heightS,
                        width:widthS,
                        backgroundColor: '#202020',
                        zIndex:120,
                        position:"absolute",
                    }}
                >
                    <Flex.Item> 
                        <ActivityIndicator size="large" color="#fff" /> 
                    </Flex.Item>
                </Flex>
            } 
                 
              

        </View>
        )
    }
}

 

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
    maintainStatus_setIM: (isMaintenance) => ACTION_MaintainStatus_SetIM(isMaintenance),
};
export default connect(mapStateToProps, mapDispatchToProps)(GAMEIPES);

const styles = StyleSheet.create({
    CloseGame:{ 
      zIndex:0,
    },
    CanXOpen:{
       zIndex:99,
    },
    NoOpen:{
        zIndex:0,
    },
    canOpen:{   
        backgroundColor: '#1a1a1a'
    },
    closeButton:{
		top:Platform.OS === 'ios' ?15:15,
		left:20,
		fontSize:24,fontWeight:'900',color:'#0e7e00',
		width:40,
		height:40,
		borderWidth: 1,
		borderRadius:20,
		paddingTop:Platform.OS === 'ios' ?8:5,
		borderColor: '#0e7e00',
		textAlign:'center'
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
   
    menu:{
        left:0,  
        height:height,
        backgroundColor: '#171717',
        position: 'absolute',
        zIndex:999

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
