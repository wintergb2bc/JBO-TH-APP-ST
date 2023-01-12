import React, { Component } from 'react';
import {
  AppRegistry, 
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  ImageBackground,
  Linking,
  WebView,
} from 'react-native';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import {Provider } from 'react-redux';
import CodePush from "react-native-code-push";
import AppReducer from './reducers/AppReducer';
import Rain from "./containers/HongBaoRain/Rain"; 
import Service from './actions/Service'; //請求
import Domain from './Domain'; //域名
import Api from './actions/Api'; //api
import storage from './actions/Storage';
import AnalyticsUtil from './actions/AnalyticsUtil'; //友盟
import localStorage from "./actions/localStorage";
// import GameLoadIPES from './containers/GameLoadIPES';  // 第三方遊戲預加載 永遠都在層級  
import Main from './containers/Main';
import { Toast,Modal,Progress} from 'antd-mobile-rn';
import SplashScreen from 'react-native-splash-screen';
import Orientation from 'react-native-orientation-locker';
import Touch from 'react-native-touch-once';
const store = createStore(AppReducer, applyMiddleware(thunk));
import {timeout_fetch} from "./containers/lib/SportRequest";
import HostConfig from "./containers/lib/Host.config";
//codepush key線上
const IosLive =''
const AndroidLive =''
import {Toasts} from './containers/Toast'

const {
  width ,height
} = Dimensions.get('window')

//字體不跟者 手機設置改變
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false})

//设置字体Kanit
const oldRender = Text.render;
Text.render = function(...args) {
	const origin = oldRender.call(this, ...args);
	return React.cloneElement(origin, {
		style: [{ fontFamily: 'Kanit' }, origin.props.style]
	});
};

class App extends Component<{}> {
	
	
	constructor() {
	super();
	this.state = { 
		progress:'',
		restartAllowed: true ,
		updataTexe:'',
		updataGo:false,
		codePushProgress:'อัปเดตความคืบหน้า: 0%',//更新進度
    CodeKey:Platform.OS === "android"? CodePushKeyAndroid:CodePushKeyIOS,
    isMandatory:false, //是否強制更新
	percent:0,
	CloseVersionMsg: '',
    CloseVersion:false,
    canUpdata:false,
    updataMsg:'',
    update:'',
	CheckUptate: false,
    showRain:false,//红包雨
		};
	} 
	
	 //添加此代码
    delayed(){
        SplashScreen.hide(); 
    }
		 
		 
	componentWillMount() {
        global.Toasts = Toasts;
	   Orientation.lockToPortrait(); //禁止橫屏
     setTimeout(()=>{this.delayed()}, 1000) //啟動圖消失   
     CodePush.disallowRestart();//禁止重启   
	   CodePush.checkForUpdate(this.state.CodeKey)
          .then((update) => {
            this.apk_package = update;  // 更新状态等信息
            console.log(update)
            if (update) {
              this.state.isMandatory = update.isMandatory;
              this.state.update = update;
                 if(update.isMandatory == true){

                  this.syncImmediate()
                  return;
                 } 
				         this.syncImmediate()
			          //	console.log(update)
              // 有可用的更新，这时进行一些控制更新提示弹出层的的操作
            }else{ 
              // 没有可用的更新
			  this.setState({CheckUptate: true})
            }
          });
   
          
          if(window.common_url != 'https://gatewaystaging04.jbo88.biz') {
            this.CloseVersion();

            setInterval(() => { 
                this.CloseVersion();
            },60000); 
          }

         

	  
	  }
	
	  componentDidMount() {
  
	     CodePush.allowRestart();//在加载完了，允许重启
          // timeout_fetch(
          //     fetch(HostConfig.Config.CacheApi + '/ec2021leagues')
          //     ,3000 //最多查3秒，超過放棄
          // )
          //     .then(response => response.json())
          //     .then(jsonData => {
          //         window.EuroCup2021LeagueIds = jsonData.data;
          //     })
          //     .catch(() => null)
    }
    componentWillUnmount() {
      this.setState({showRain:false})
    }
    

    

    CloseVersion(){   //關閉版本 
      // if(window.common_url !='https://gateway.jbo507.com') return
			fetch('https://www.zdhrb64.com/CMSFiles/J1APP/JBOTHUpdate.json?v='+Math.random(), {
			method: "GET" 
			})
			.then((response) => headerData = response.json())
			.then((responseData) => {       // 获取到的数据处理

				if(UpdateV != responseData.version){


          if(Platform.OS === "ios"){

              if(responseData.ios == true){
                    this.setState({
					  CloseVersion:true,
            CloseVersionMsg: responseData.msg || 'เพิ่มประสิทธิภาพการเข้าใช้งาน',
            
                    })
              }

          }

            if(Platform.OS === "android"){
              if(responseData.android == true){
                this.setState({
				  CloseVersion:true,
          CloseVersionMsg: responseData.msg || 'เพิ่มประสิทธิภาพการเข้าใช้งาน',
          
                })
            }

          
            }
           
          
				} 
				 
			})
			.catch((error) => { // 错误处理
				
			}) 
 
    }
	    

  codePushStatusDidChange(syncStatus) {
    switch(syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "ตรวจสอบการอัปเดต" });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE: 
        this.setState({ syncMessage: "ดาวน์โหลดแอป" });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "Awaiting user action." });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "กำลังติดตั้งการอัปเดต" });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "App up to date.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "การอัปเดตถูกยกเลิกโดยผู้ใช้", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false,updataGo:false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "เกิดข้อผิดพลาด", progress: false,updataGo:false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) { 
	  
      let percent = parseInt(progress.receivedBytes / progress.totalBytes * 100);
      this.setState({
        percent: percent,    // 为了显示进度百分比
      });

      if(this.state.isMandatory == false){
        if(percent === 100){  
            setTimeout(()=>{ 
            this.onButtonClick2();
            }, 3000)   
         }
      }

     this.setState({ progress });
	
  }

  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({ restartAllowed: !this.state.restartAllowed });
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
      .then((metadata: LocalPackage) => {
        this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : "Running binary version", progress: false });
      }, (error: any) => {
        this.setState({ syncMessage: "Error: " + error, progress: false });
      });
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync(
      {},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }
   
   
   syncImmediate() {
     this.setState({
      canUpdata:false
     })

    if(this.state.isMandatory == true){
      CodePush.sync(
        { installMode: CodePush.InstallMode.ON_NEXT_RESUME },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this)
      );
      // this.setState({
      //   updataGo:true
      // })	 
    }

  if(this.state.isMandatory == false){
    CodePush.sync(
      { installMode: CodePush.InstallMode.ON_NEXT_RESUME},
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    ); 
  } 
}

  /** Update pops a confirmation dialog, and then immediately reboots the app */
//   syncImmediate() {
//     CodePush.sync(
//     		{deploymentKey: this.state.CodeKey, updateDialog: {}, installMode: CodePush.InstallMode.IMMEDIATE},
//       this.codePushStatusDidChange.bind(this),
//       this.codePushDownloadDidProgress.bind(this)
//     );
//   }
  
   
  onButtonClick2(msg){
    // if(this.state.CloseVersion == true){
    //   return;
    // }
    const  {update} =this.state;
	 let msgt = update.description
   let msg2= msgt.split(',').join('\n')
   this.setState({
    canUpdata:true,
    updataMsg:msgt,
  })
   
    //  Modal.alert('更新提示',msg2, [
    //   { text: '立即更新', onPress: () => this.syncImmediate() }
    // ]);
  };



   //手動檢測版本更新
   CheckUptate(loding){
	if(!loding && !this.state.CheckUptate) { return }
	this.setState({CheckUptate: false})
    // CodePush.disallowRestart();//禁止重启
    //this.syncImmediate(); //开始检查更新 
    //检测版本中,请稍候
    loding && Toast.loading('กำลังโหลด...',200);
  
    CodePush.checkForUpdate(this.state.CodeKey)
         .then((update) => {
          Toast.hide();
           this.apk_package = update;  // 更新状态等信息
           //console.log(update)
        //    this.state.isMandatory = update.isMandatory;
           this.state.update = update;
           if (update) {
            this.syncImmediate()
            this.state.isMandatory = update.isMandatory; 
            // this.onButtonClickLogin(update) 
               //	console.log(update)
             // 有可用的更新，这时进行一些控制更新提示弹出层的的操作
           }else{
			// alert('无版本更新')
			this.setState({CheckUptate: true})
            loding && Toast.success('เป็นเวอร์ชันล่าสุดแล้ว',2)
             // 没有可用的更新
           }
         });  
  }


  onButtonClickLogin(msg){
    if(this.state.CloseVersion == true){
      return;
    }
	 let msgt = msg.description
	 let msg2= msgt.split(',').join('\n') 
     Modal.alert('อัปเดตการแจ้งเตือน:',msg2, [
      { text: 'อัปเดตตอนนี้', onPress: () => this.syncImmediateLogin() }
    ]);
  };


  syncImmediateLogin() {

    if(this.state.isMandatory == true){
      CodePush.sync(
        { installMode: CodePush.InstallMode.IMMEDIATE },
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgressLogin.bind(this)
      );
      this.setState({
        updataGo:true
      })	 
    }

    if(this.state.isMandatory == false){
      CodePush.sync(
        { installMode: CodePush.InstallMode.ON_NEXT_RESUME},
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgressLogin.bind(this)
      ); 
    } 
  }

  codePushDownloadDidProgressLogin(progress) { 
    

	  let percent = parseInt(progress.receivedBytes / progress.totalBytes * 100);
	  this.setState({
	  	percent: percent,    // 为了显示进度百分比
    });

   // console.log(percent)
    
   if(percent === 100){   
    CodePush.allowRestart(); 
    setTimeout(()=>{  
      CodePush.restartApp();
     }, 5000)   
    }
   
	this.setState({ progress });
	
  }

  UpdataApp(){   //更新版本 
		// Linking.openURL('https://www.jbo03.com/Appinstall.html') 
		Linking.openURL(SBTDomain + '/th/mobile/Appinstall.html') 
	}
   
   
   
  render() {
    
    const {updataGo,canUpdata,updataMsg,percent,CloseVersion} =this.state

    window.CheckUptateGlobe = (fromVal) =>{
        if(fromVal){
            if(fromVal === 'ProfileCenter'){
                UMonEvent('Navigation', 'Click', 'AppVersion_ProfileCenter')
            }
        }
      this.CheckUptate(fromVal);
    } 

    window.showRainTrigger  = (val)=>{
      this.setState({showRain:val})
    }
    //版本号处理没错更新+1
    let versions = JBOVersion && (Number(JBOVersion.replace(/\./g, '')) + 1).toString().split('').join('.') || '1.0.0.0'
    
    return (
	
	  
	  <Provider store={store}>
    
	    <View style={{flex:1}}> 

      
    

      {/* <GameLoadIPES/>   */}
       {/*game懸浮層*/}
	    <Main/>  
      

      <StatusBar barStyle="light-content"/>
        
      {canUpdata == true&&
		 	<View style={styles.updataBg3}></View>
     }
  

	  {canUpdata == true &&   
	  	<View style={{height: height, width: width, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0}}>
			<ImageBackground
			style={{ width: width * 0.92, height: width * 0.86 * 1.6, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: width* 0.1 }}
			resizeMode="stretch"
			source={require('./images/jbodownload1.png')}
			>
				<Text style={{color: '#412601', fontSize: 15, paddingBottom: 15, fontWeight: 'bold'}}>เพิ่มประสิทธิภาพแอปเวอร์ชันใหม่ v{versions}</Text>
				<View style={{width: width * 0.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
					<Text style={{color: '#412601', paddingBottom: 10}}>อัปเดตเนื้อหา：</Text>
					{
						updataMsg != '' && updataMsg.split('-').map((item,index) => {
							return(
								<Text style={{color: '#412601', paddingBottom: 8, fontSize: 12}} key={index}>- {item != '' && item}</Text>
							)
						})
					}
				</View>
				<Touch style={{position: 'absolute', bottom: width * 0.16}} onPress={() => { CodePush.restartApp() }}>
					<Image style={{height: width * 0.38 * 0.33, width: width * 0.38}} resizeMode='stretch' source={require('./images/updata.png')} />
				</Touch>
			</ImageBackground>
		  </View>
    //    <View style={styles.popBoxUpdata}>
 
    //    <View style={{backgroundColor:'#0e0e0e',borderTopLeftRadius:12,borderTopRightRadius:12}}> 
      
    //     <Text style={{ textAlign: 'center',color:'#fff',fontSize:16,fontWeight:'bold',paddingTop:10 ,paddingBottom:10}}>更新提示</Text>  
    //     </View>

    //     <View style={{  alignItems: "center",}}>
    //     <Image style={styles.jbodownload} resizeMode='stretch' source={require('./images/jbodownload1.png')} />
                                   
    //     </View>
       
    //        <View> 
    //        <Text style={{textAlign: 'center',paddingTop:5,paddingBottom:10,color:'#fff'}}>{updataMsg}</Text>
    //        </View> 
       
    //    <View style={{backgroundColor:'#337434',borderBottomLeftRadius:12,borderBottomRightRadius:12,width:width-40}}>
    //        <TouchableOpacity onPress={()=>CodePush.restartApp()}>
    //        <TouchableOpacity onPress={()=>{this.setState({canUpdata: false})}}>
    //         <Text style={{ textAlign: 'center',paddingTop:15,paddingBottom:15,color:'#fff',fontWeight:'bold',fontSize:14}}>立即更新123</Text>
    //        </TouchableOpacity>
    //    </View>  
    //    </View> 
      }

		 {updataGo == true&&
		 	<View style={styles.updataBg3}></View>
     }
     

    {updataGo == true&&  
      

    <View style={styles.popBoxUpdata}>
    
          <View style={{backgroundColor:'#0e0e0e',borderTopLeftRadius:12,borderTopRightRadius:12}}> 
          
            <Text style={{ textAlign: 'center',color:'#fff',fontSize:16,fontWeight:'bold',paddingTop:10 ,paddingBottom:10}}>อัปเดตการแจ้งเตือน</Text>  
            </View>

            <View style={{  alignItems: "center",}}>
            <Image style={styles.jbodownload} resizeMode='stretch' source={require('./images/jbodownload.png')} />
                                      
            </View>
          
            <View style={styles.popBox}>
            <Text style={{ textAlign: 'center',paddingTop:15 ,color:'#fff',paddingBottom:10}}>ระหว่างการอัปเดต กรุณาอย่าปิดแอป</Text> 
        
              <View style={{ height: 4,width:width-80}}>
                <Progress barStyle={{backgroundColor:'#005a36',borderColor: '#005a36'}} percent={percent} />
              </View> 
            <Text style={{ textAlign: 'center',paddingTop:15 ,color:'#fff',paddingBottom:10}}>พัฒนาระบบ:{percent}%</Text> 
          
        </View>  
        
       </View> 
    }
   


{CloseVersion == true &&
  <View style={styles.updataBg2}></View>
}

{CloseVersion == true && 
	  	<View style={{height: height, width: width, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0}}>
		  <ImageBackground
		  style={{ width: width * 0.85, height: width * 0.8 * 1.6, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: width* 0.15 }}
		  resizeMode="stretch"
		  source={require('./images/jbodownload1.png')}
		  >
              <View  style={{width: width * 0.6, display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
                  <Text style={{color: '#412601', fontSize: 16, fontWeight: 'bold'}}>เวอร์ชันนี้ถูกยกเลิกแล้ว，</Text>
                  <Text style={{color: '#412601', fontSize: 16, paddingBottom: 15, fontWeight: 'bold'}}>
                      กรุณาคลิก เพื่อดาวน์โหลดเวอร์ชันล่าสุด v{versions}
                  </Text>
              </View>
			  <View style={{width: width * 0.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'center'}}>
				  <Text style={{color: '#412601', paddingBottom: 10}}>อัปเดตเนื้อหา：</Text>
				  {
					  this.state.CloseVersionMsg != '' && this.state.CloseVersionMsg.split('-').map((item,index) => {
						  return(
							  <Text style={{color: '#412601', paddingBottom:  8, fontSize: 13}} key={index}>- {item != '' && item}</Text>
						  )
					  })
				  }
			  </View>
			  <Touch style={{position: 'absolute', bottom: width * 0.16}} onPress={() => { this.UpdataApp() }}>
				  <Image style={{height: width * 0.38 * 0.33, width: width * 0.38}} resizeMode='stretch' source={require('./images/down.png')} />
			  </Touch>
		  </ImageBackground>
		</View>
//      <View style={styles.popBoxS}>
     
//      <View style={{backgroundColor:'#337434',borderTopLeftRadius:12,borderTopRightRadius:12}}> 
//        <Text style={{ textAlign: 'center',color:'#fff',fontSize:16,fontWeight:'bold',paddingTop:10 ,paddingBottom:10}}>版本升级提示</Text>  
//        </View>
   
//      <Text style={{ textAlign: 'center',paddingTop:15 ,paddingBottom:5}}>亲爱的竞博玩家，此版本已停止使用。</Text>  
//      <Text style={{ textAlign: 'center',paddingTop:5 ,paddingBottom:10}}>请下载最新竞博APP以继续游戏。</Text>

//      <View style={{backgroundColor:'#337434',borderRadius:12,width:100,left:width/3.3,marginTop:5}}>
//       <TouchableOpacity onPress={()=>this.UpdataApp()}>
//         <Text style={{ textAlign: 'center',paddingTop:10,paddingBottom:10,color:'#fff',fontWeight:'bold',fontSize:14}}>立即下载</Text>
//       </TouchableOpacity>
//      </View>
//    </View>  

}

{/* 红包雨 */}
{this.state.showRain ? <Rain /> : null} 
		
	   </View>
      </Provider>

	  
    );
  }
}

const styles = StyleSheet.create({
  jbodownload:{ 
    width:width/2,
    height:height/3,
  },
  container: { 
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: 50
  },
  messages: {
    marginTop: 15,
	color:"#fff",
    textAlign: "center",
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  },
  popBox:{
	  alignItems: 'center',
	  justifyContent: 'center', 
  },
	updataBg:{
		width:width,
		height:height,
		opacity:0,
		backgroundColor: '#000',
		position: 'absolute', 
  },
  popBoxUpdata:{
    width:width-40,
    position: 'absolute',  
    top: height/4, 
    left:20,
    borderRadius:12,
	  backgroundColor: '#191919',
  },

  popBoxS:{
    width:width-40,
    position: 'absolute',  
    top: height/2.5, 
    left:20,
	  borderRadius:12,
	  backgroundColor: '#fff',
    height:160,
  },
  updataBg2:{
    width:width,
		height:height,
		opacity:0.5,
		backgroundColor: '#000',
		position: 'absolute', 
  },
  updataBg3:{
    width:width,
		height:height,
		opacity:0.5,
		backgroundColor: '#000',
		position: 'absolute', 
  },

});

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

App = CodePush(codePushOptions)(App);

export default App;
