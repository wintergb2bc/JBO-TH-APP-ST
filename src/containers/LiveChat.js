import React from 'react';
import { StyleSheet,WebView ,Platform,ImageBackground,Text,Linking, View,Animated,TouchableOpacity ,Keyboard,Dimensions,Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {  Carousel,WhiteSpace, ActivityIndicator ,Flex,Toast,InputItem,Picker,List} from 'antd-mobile-rn';
import Orientation from 'react-native-orientation-locker';
import WebViewAndroid from 'react-native-webview-android' 
import WebViewIOS from 'react-native-webview';
const {
  width ,height
} = Dimensions.get('window')

 
const WEBVIEW_REF = 'webview';
let fireLoad = false


const patchPostMessageFunction = function() {
	var originalPostMessage = window.postMessage;
  
	var patchedPostMessage = function(message, targetOrigin, transfer) { 
	  originalPostMessage(message, targetOrigin, transfer);
	};
  
	patchedPostMessage.toString = function() { 
	  return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
	};
  
	window.postMessage = patchedPostMessage;
       setTimeout(()=>{   //防止亂彈瀏覽器
		var a = document.getElementsByTagName('a');
		
		for(var i = 0; i < a.length; i++){ 
		a[i].onclick = function (event) {
			window.postMessage(this.href);
			event.preventDefault();
		}
		}
			  },5000) 
  };
  const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';


class LiveChat extends React.Component {
	
	
	constructor(props) {
		super(props);
		this._onNavigationStateChange = this._onNavigationStateChange.bind(this)
		this._onMessage = this._onMessage.bind(this)
		  //console.log(this.props)  
				this.state = {
					LiveChatKey:0,
					initialHeight:
					this.props.name == "LiveChatST" ? height - 66 : height - 126,
					heightXJ: this.props.name  == 'LiveChatST' ? height-66 :height-126,
					keyboardOpen:0,
					loadD:false,
					loadone:1, 
					gameKey:0,
					UrlNes:LiveChatX, 
				}
			 
	  }
		
	componentWillMount(props) {
		if(this.props.Piwik){
			UMonEvent('CS','Launch',this.props.Piwik);
		}
		
		Orientation.lockToPortrait();
			 console.log(this.props) 
			//  监听键盘打开事件
			if(Platform.OS === "android" ){
				this.keyboardDidShowListener = Keyboard.addListener(
					"keyboardDidShow",
					this._keyboardDidShow.bind(this)
				  );
				  //  监听键盘关闭事件
				  this.keyboardDidHideListener = Keyboard.addListener(
					"keyboardDidHide",
					this._keyboardDidHide.bind(this)
				  );
	
			}
	  }
	  componentWillUnmount() {
		if(Platform.OS === "android" ){
			this.keyboardDidShowListener.remove();
			this.keyboardDidHideListener.remove();
		}
	  }
	
	  _keyboardDidShow(e) {
		this.setState({
		  heightXJ: this.state.initialHeight - e.endCoordinates.height
		});
	  }
	
	  _keyboardDidHide(e) {
		// console.log(e.endCoordinates.height);
		this.setState({ heightXJ: this.state.initialHeight });
	  }	  
	 
 
	  _onNavigationStateChange(e) { 
		// if(fireLoad == false){
		// 		return;
		// }
		// if(LiveChatX == ""){  
		// 	return;
		// }

		// if (e.url.split("?")[0]!= LiveChatX.split("?")[0]) {
		//   this.refs[WEBVIEW_REF].stopLoading();
		//   setTimeout(()=>{
		// 	 Linking.openURL(e.url);
		// 	 reloadLiveChat();
		//   },1000)
		  
	
		//   return false
		// } 
		if(LiveChatX && e.url) {

            let oldDomain = LiveChatX.split('://')[1] && LiveChatX.split('://')[1].split('/')[0] || false

            let newDomain = e.url.split('://')[1] && e.url.split('://')[1].split('/')[0] || false

            

            if (oldDomain && newDomain && oldDomain != newDomain) {

                Linking.openURL(e.url);

              setTimeout(()=>{

                 reloadLiveChat();

              },500)

              

            }

        }
		return true
	  }
 

	  	 
	  _onMessage = (e) => {
		console.log(e.nativeEvent.data)  
		//alert('2222')
        Linking.openURL(e.nativeEvent.data).catch(err => console.error('An error occurred', err))
	}
	


	 
  render () { 
		
		const {heightXJ,LiveChatKey,loadD, gameKey,loadone,} = this.state;

		window.reloadLiveChat = () => {
			this.setState({
			  loadD:true,loadone:1,  
			  LiveChatKey:Math.random(), 
			})
		}  
 
    return (
		    <View style={{flex:1,backgroundColor:'#fff'}}> 
				
						
 			
							{Platform.OS === "android"  ? 
							
							<WebViewAndroid
								key={LiveChatKey} 
								ref={WEBVIEW_REF}   
								injectedJavaScript={patchPostMessageJsCode}
								source={{uri:LiveChatX}}
								javaScriptEnabled={true}
								domStorageEnabled={true}
								scalesPageToFit={false}  
								onNavigationStateChange={this._onNavigationStateChange}
								style={{width:width,height:heightXJ,marginTop:0}}
								thirdPartyCookiesEnabled={true}
							 />
						
						
							:Platform.OS === "ios" &&
							<WebViewIOS
								key={LiveChatKey}
								ref={WEBVIEW_REF}
								//onMessage={this._onMessage}  
								onNavigationStateChange={this._onNavigationStateChange}
								injectedJavaScript={patchPostMessageJsCode}
								source={{uri:LiveChatX}}  
								javaScriptEnabled={true}
								domStorageEnabled={true}
								scalesPageToFit={Platform.OS === 'ios'? true : false} 
								style={{width:width,height:height,marginTop:0,}}
								thirdPartyCookiesEnabled={true}
								scrollEnabled={false}
							 /> 
							}
								

				 

			

						 
					</View>		
			
    )
  }
}


export default(LiveChat);



const styles = StyleSheet.create({
	headerTop: {
		top: 0,
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 20,
		padding: 10,
	},
  wrapper: {
	height:120,
    backgroundColor: '#000',
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  containerVertical: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  text: {
    color: '#fff',
    fontSize: 36,
  },
	image: {
		width,
		height: 200
	},
	 warning:{
		height:35,
		width:width,
		backgroundColor: '#013626',

	 },
	 warningT:{
		 height:30,
		 marginTop:10
	 },
	 warningText:{
	 color: '#fff',

	 },
	 gameBg1:{
		 backgroundColor:"#fff",
		 padding:12
	 },
	 gameBg2:{
		 backgroundColor:"#fff",
		 padding:12,
		 borderTopWidth: 1,
		 borderColor: '#fff'
	 },
	 
	 GameBox:{
		height:height-230,
	   	backgroundColor:"#fff",
    	width: width,
	 		flexWrap: 'wrap',
	 		display:'flex',
	 		flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			paddingTop:10,
	 		paddingRight:10,
	 		paddingBottom:10,
	 			
	 	
	 }, 
	 GameImg:{
		    width:175,
	        flexWrap: 'wrap',
	 		flexDirection: 'column',
	 		alignItems: 'center',
	 		justifyContent: 'center',
			paddingTop:15,
			paddingBottom:15,
			marginLeft:6,
			marginBottom:6,
			borderWidth: 5,
		    borderColor: '#d3d3d3'
	 },
	 
	 preferentImg:{
		 marginTop:-15,width: width, height: 150,backgroundColor: '#d3d3d3'
	 },
	 openPreferential:{
		borderRadius:18,
		marginTop:10,
		width:110,
		padding:5,
		backgroundColor: '#00633c',
	 }
  
});
