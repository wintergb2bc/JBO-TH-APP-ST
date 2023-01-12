import React from 'react';
import { StyleSheet, Text,TextStyle,Image, View ,ViewStyle,ScrollView,TouchableOpacity,Dimensions,Platform,CameraRoll,RefreshControl} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast,Carousel,Flex,Picker,List,Tabs,WhiteSpace} from 'antd-mobile-rn';
import DeviceInfo from 'react-native-device-info'  //獲取設備信息
import moment from 'moment'
import { captureScreen } from "react-native-view-shot";
const {
  width ,height
} = Dimensions.get('window')



class News extends React.Component {
 
	
	constructor(props) {
	    super(props);  
	    this.state = { 
				  userName:memberCode,
				  phoneInfo:DeviceInfo.getModel()?DeviceInfo.getModel():'',
				  appName:DeviceInfo.getApplicationName()? DeviceInfo.getApplicationName() :'',
				  userIp:'',
				  phoneVersion:DeviceInfo.getSystemVersion()?DeviceInfo.getSystemVersion():'',
				  AppVersion:JBOVersion,
				  nowTime:moment().format('YYYY-MM-DD HH:mm'),  
	    }  
	  }
		
	componentWillMount(props) { 
	 
			//	console.log(DeviceInfo.getModel(),'DeviceInfo')
				console.log(moment().format('YYYY-MM-DD HH:mm'))
				this.GetIP(); //獲取當前IP
   }
	

   GetIP(){
	   console.log('123')
		fetchRequest(ApiPort.IpAdderess, 'GET').then(data => {
				 console.log(data)
				 this.setState({
					userIp:data.ipAddress
				 })
   
		}).catch(error => {
			//Toast.hide();
			console.log('321')

		})
   }


  saveImg(img) {
    captureScreen({
      format: "jpg",
      quality: 0.8
    }).then(
      uri => this.SaveQrCode(uri),
      error => Toast.fail(error)
    );
  }
  SaveQrCode(uri) {
    let promise = CameraRoll.saveToCameraRoll(uri);
    promise
      .then(function(result) {
		 Toast.success('บันทึกสำเร็จ')
       // Toast.success("保存成功！");
      })
      .catch(function(error) { 
		Toast.fail("บันทึกไม่สำเร็จ ไม่สามารถเข้าถึงรูปภาพ!");
        // Toast.fail("保存失败,无访问照片权限!");
      });
  }
	//跳轉
	navigateToScene(key,GameOpenUrl){
		console.log(key)
		
		console.log(GameOpenUrl)
	
	   Actions[key]({GameOpenUrl:GameOpenUrl});
	
		
	}
	
  
			
  render () {
		
		  const {
			  appName,
			  userName,
			  userIp,
			  phoneInfo,
			  phoneVersion,
			  AppVersion,
			  nowTime
		} =this.state;
		   
		window.csScreenPage =() =>{
			this.saveImg();
		}
		
    return (
		
	      <View style={{flex:1,alignItems: "center",backgroundColor:'#0a0a0a'}}>
			  
			  <View flexDirection="row" style={{width:width-30,paddingTop:20}}>
				  <View style={{borderWidth:1,borderRadius:12,borderColor:'#666666',width:20,height:20}}>
				 	 <Text style={{color:"#666666",textAlign:'center'}}>!</Text>
				  </View>
				  <View>
				      <Text style={{color:'#666666'}}> คลิก "สกรีนช็อต" เพื่อบันทึกรูปและกลับไปที่หน้าบริการลูกค้า </Text>
					  <Text style={{color:'#666666'}}> กรุณาส่งรูปสกรีนช็อตไปที่ฝ่ายบริการลูกค้า </Text> 
					  {/* <Text style={{color:'#666666'}}> 点击"一键截图" 以保存图檔，回到客服页面后， </Text>
					  <Text style={{color:'#666666'}}> 请把截图发送给客服。 </Text>  */}
			  	  </View>
			  </View>
			{ApiPort.UserLogin == true && 
		  	<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>ชื่อบัญชี:</Text>
				  {/* 账户名称 */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
				<Text style={{color:'#666666'}}>{userName}</Text>
			  </Flex.Item> 
			</Flex>  
  			}
			  	{ApiPort.UserLogin == true && 
			<View style={styles.line}></View>
				  }

			<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>รุ่นโทรศัพท์:</Text>
				  {/* 手机型号 */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
				<Text style={{color:'#666666'}}>{phoneInfo}</Text>
			  </Flex.Item> 
			</Flex>  
			<View style={styles.line}></View>

			<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>แพลตฟอร์มที่เข้าสู่ระบบ:</Text>
				  {/* 登录端口 */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
				  <Text style={{color:'#666666'}}>{appName}</Text>
			  </Flex.Item> 
			</Flex>  
			<View style={styles.line}></View>

			<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>IP ที่เข้าสู่ระบบ:</Text>
				  {/* 登录IP */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
				<Text style={{color:'#666666'}}>{userIp}</Text>
			  </Flex.Item> 
			</Flex>  
			<View style={styles.line}></View>

			<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>เวอร์ชั่นโทรศัพท์:</Text>
				  {/* 手机系统 */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
					<Text style={{color:'#666666'}}>{phoneVersion}</Text>
			  </Flex.Item> 
			</Flex>  
			<View style={styles.line}></View>

			<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>เวอร์ชั่นแอป:</Text>
				  {/* APP版本 */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
					<Text style={{color:'#666666'}}>{AppVersion}</Text>
			  </Flex.Item> 
			</Flex>  
			<View style={styles.line}></View>

			<Flex style={{paddingLeft:15,paddingRight:15,paddingTop:20}}>
			  <Flex.Item>
				  <Text style={{color:'#F5F5F5'}}>เวลาตอนนี้：</Text>
				  {/* 当前时间 */}
			  </Flex.Item>
			  <Flex.Item alignItems="flex-end">
					<Text style={{color:'#666666'}}>{nowTime}</Text>
			  </Flex.Item> 
			</Flex>  
			<View style={styles.line}></View>

			 

			
 
        </View>
						
    )
  }

  

}


export default (News);



const styles = StyleSheet.create({
 
  text: {
    color: '#F5F5F5',
    fontSize: 36,
  },
  line:{
	top:8,backgroundColor:'#3D3D3D',height:0.5,width:width-20
  },
 
	 
});