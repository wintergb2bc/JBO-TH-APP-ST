import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import {
    Toast,
} from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import { WhiteSpace } from "antd-mobile-rn";
import PushUtil from "../actions/PushUtil"; //友盟 push 推送
import DeviceInfo from 'react-native-device-info'  //獲取設備信息 
import AnalyticsUtil from '../actions/AnalyticsUtil'; //友盟  
const { width, height } = Dimensions.get("window");
/**
 * 限制页面和维护页面
 */
class RestrictPage extends Component {
  constructor(props) {
	super(props);
	this.state={
		RestrictType:this.props.RestrictType,//判断ip限制还是页面维护
		newTime: '00-00-00',
	}
  }

  componentWillMount() {
    // 关掉PersonalAccount里的获取公告的轮询方法
    // if (window.CloseReLoAccount) {
    //   CloseReLoAccount()
    // }
    ApiPort.UserLogin = false

  }
  
  componentDidMount() {
	  if(this.props.RestrictType == 'Maintenance') {
		this.timeOut()
	  }
    this.logout();
    setTimeout(() => {  
      Actions.replace("RestrictPage",{})
    }, 1000);

  }
  componentWillUnmount(){
    // 离开时取消限制状态
    global.Restrict= false
    global.storage.remove({
      key: "username",
      id: "nameJBO"
    });

    global.storage.remove({
      key: "password",
      id: "passwordJBO"
	}); 
	this.timeInterval && this.timeInterval.remove();
  }
  goBack() {
    navigateToSceneGlobe()
    setTimeout(() => {
      Actions.logins()
    }, 80);

  }

// 前往在线客服
goToChat() {
    if(this.props.RestrictType == 'Maintenance') {
        const findTH = this.props.LiveChats.find((item) => {return (item.Culture == 'TH-TH')})
        if(findTH){
            LiveChatX = findTH.Domain || '';
            setTimeout(() => {
                Actions.LiveChatST();
            }, 100);
        }else{
            this.getLiveChatX()
        }

    } else {
        navigateToSceneGlobe()
    }
  }
getLiveChatX = () =>{
    Toast.loading("", 200);
    fetchRequest(ApiPort.LiveChat, "GET")
        .then(data => {
            Toast.hide()
            LiveChatX = data.url;
            setTimeout(() => {
                Actions.LiveChatST();
            }, 100);
        })
        .catch(() => {});
}
  async getMemberData() {
    try {
      const memberData = await global.storage.load({
        key: "memberInfo",
        id: "memberInfos"
      });

      return memberData;
    } catch (error) {
      return {};
    }
  }
  async getDeviceToken() {
    try {
      deviceToken = await PushUtil.getDeviceToken();

      return deviceToken;
    } catch (error) {
      return "";
    }
  }

  async getMacAddress() {
    try {
      const macAddress = await DeviceInfo.getMACAddress();

      return macAddress;
    } catch (error) {
      return "";
    }
  }
  // 清掉登录状态
  async logout() {
    try {


      const deviceToken = await this.getDeviceToken();
      const memberData = await this.getMemberData();
      const macAddress = await this.getMacAddress();

      const data = {
        "clientId": "JBO.Native.App",
        "clientSecret": "JBOmuitten",
        "refreshToken": memberData.accessToken.refresh_token,
        "accessToken": memberData.accessToken.access_token,
        "memberCode": memberData.memberInfo.memberCode,
        "deviceToken":deviceToken,
        "packageName": "net.GB2BC.JBO",
        "imei": "",
        "macAddress":macAddress,
        "serialNumber": "",
        "pushNotificationPlatform": "umeng+",
        "os": Platform.OS
      };

      fetchRequest(ApiPort.logout, "POST", data)
        .then(data => {})
        .catch(error => {
          Toast.hide();
        });
    } catch (error) {
      console.log(error);
    }
  }
  timeOut() {
	  let RetryAfter = this.props.RetryAfter.split('T')[0] + ' ' + this.props.RetryAfter.split('T')[1].split('.')[0];
	  RetryAfter = RetryAfter.replace(/\-/g,'/');
	  let nowDate = new Date();
	  let endDate = new Date(RetryAfter);
	  let totalSeconds = parseInt((endDate - nowDate) / 1000);
	  if (totalSeconds < 0) { return } 
	  let modulo = 0;
	  let h = 0;
	  let m = 0;
	  let s = 0;
	  let newTime = ''
	  this.timeInterval = setInterval(() => {
		  totalSeconds -= 1;
		  modulo = totalSeconds % (60 * 60 * 24);
		  h = Math.floor(modulo / (60 * 60));
		  modulo = modulo % (60 * 60);
		  m = Math.floor(modulo / 60);
		  s = modulo % 60;
		  if(h < 10) h = '0' + h.toString();
		  if(m < 10) m = '0' + m.toString();
		  if(s < 10) s = '0' + s.toString();
		  newTime = `${h}-${m}-${s}`
		  this.setState({newTime})
	  }, 1000);
  }

  render() {
	  const { RestrictType,newTime } = this.state;
	  console.log('newTimenewTimenewTime',newTime)
    return (
		<View style={{flex:1,backgroundColor:'#0a0a0a',height:height}}>
			<View style={{backgroundColor:'#1a1a1a'}}>
			<ImageBackground
				style={{ width: width, height: Platform.OS === "ios"? 90: 55}}
				resizeMode="repeat"
				source={require("../images/home/pattern.png")}
			>
				<View style={{ width: width, height: Platform.OS === "ios"? 90: 55, display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'row',marginTop:Platform.OS === "ios"? 20: 0}}>
					<Image
						resizeMode="stretch"
						source={require("../images/github-logo.png")}
						style={{ width: 125, height: 41 }}
					/>
					<View style={{position:'absolute',right: 20}}>
						{/* <TouchableOpacity onPress={() => {this.goToChat()}}>
							<Image
							resizeMode="stretch"
							source={require("../images/home/icon-csb.png")}
							style={{ width: 28, height: 28 }}
							/>
						</TouchableOpacity> */}
					</View>
				</View>
			</ImageBackground>
			</View>
			<View style={{width:width,display:'flex',alignItems:'center',paddingTop:15,marginBottom:5,}}>
				<Image
					resizeMode="stretch"
					source={RestrictType == 'IP'? require("../images/IPlimit.png"): require("../images/maintenance.png")}
					style={{ width: width/1.2, height: width/1.78 }}
				/>
			</View>
			{
			//IP限制 限制页面
			RestrictType == 'IP' &&
			<View style={{width:width,display:'flex',alignItems:'center'}}>
				<Text style={{fontSize:30,color:'#fff',lineHeight:30}}>จำกัด IP</Text>
				<Text style={{color:'#fff',lineHeight:30}}>ขออภัย! พื้นที่ของคุณ</Text>
				<Text style={{color:'#fff',lineHeight:30}}>ไม่อยู่ในเขตบริการของเรา หากคุณไม่สามารถเปิดได้ โปรดลอง</Text>
				<Text style={{color:'#fff',lineHeight:30}}>โหลดหน้าอีกครั้ง หรือ ติดต่อฝ่ายบริการลูกค้า</Text>
			</View>
			}
			{
			//维护页面
			RestrictType == 'Maintenance' &&
			<View style={{width:width,display:'flex',alignItems:'center'}}>
				<Text style={{fontSize:30,color:'#fff',lineHeight:30,marginBottom:10}}>กำลังปรับปรุง...</Text>
				<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:40,paddingRight:40,width:width}}>
					<View style={{width:50}}>
						<Text style={{color: '#fff',textAlign:'center',fontSize:35}}>{newTime !='' && newTime.split('-')[0]}</Text>
						<Text style={{color: '#fff',textAlign:'center',fontSize:18}}>ชั่วโมง</Text>
					</View>
					<View style={{width:50}}>
						<Text style={{color: '#fff',textAlign:'center',fontSize:35}}>{newTime !='' && newTime.split('-')[1]}</Text>
						<Text style={{color: '#fff',textAlign:'center',fontSize:18}}>นาที</Text>
					</View>
					<View style={{width:50}}>
						<Text style={{color: '#fff',textAlign:'center',fontSize:35}}>{newTime !='' && newTime.split('-')[2]}</Text>
						<Text style={{color: '#fff',textAlign:'center',fontSize:18}}>วินาที</Text>
					</View>
				</View>
				<Text style={{color:'#fff',lineHeight:30,marginTop:10}}>อยู่ในช่วงอัพเกรดระบบ โปรดลองอีกครั้งภายหลัง!ขออภัยในความไม่สะดวก หากคุณมีคำถานอื่นๆ โปรดติดต่อสายด่วนบริการลูกค้า หรืออีเมล cs.jbo@vpo.my</Text>
				{/* <Text style={{color:'#fff',lineHeight:30}}>由此带来的不便我们深表歉意，如有其它疑问</Text>
				<Text style={{color:'#fff',lineHeight:30}}>请联系在线客服。</Text> */}
			</View>
			}
			<View>
				{
				RestrictType == 'IP' &&
				<View style={{justifyContent:'center',alignContent:'center',alignItems:'center',width:width,top:20}}>
					<View style={{backgroundColor:'#00b324',borderRadius:5,width:width/2.5,}}>
					<TouchableOpacity onPress={() => {this.goBack()}}>
						<Text style={{color:'#fff',textAlign:'center',lineHeight:40}}>รีเฟรช</Text>
					</TouchableOpacity>
					</View>
				</View>
				}
				<View style={{justifyContent:'center',alignContent:'center',alignItems:'center',marginTop:30}}>
				<View style={{borderWidth:1,borderColor:'#00b324',borderRadius:5,width:width/2.5,}}>
					<TouchableOpacity onPress={() => {this.goToChat()}}>
						<Text style={{color:'#fff',textAlign:'center',lineHeight:40}}>แชทสด</Text>
					</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
    );
  }
}

export default RestrictPage;

const styles = StyleSheet.create({

});
