import React from 'react';
import { StyleSheet, WebView, Text, View, Animated, TouchableOpacity, Dimensions, Image, Platform, TextInput,ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, ActivityIndicator, List, Picker } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';

const {
    width, height
} = Dimensions.get('window')

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

class UserAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFocusedA: '',
        }
    }
    navigateToScene(key){
      Actions[key]({memberInfo:this.props.memberInfo,phoneNumber:this.props.phoneNumber,email:this.props.email});  
    }

    render() {

        return (
            <View style={{felx:1,height:height,backgroundColor:'#0a0a0a'}}>
					<ScrollView
						style={{ Flex:1}}
						automaticallyAdjustContentInsets={false}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						> 
											<Flex style={styles.gameBg2}>	
											 <Flex.Item style={{paddingTop:5}}>
											  <List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
												 <Touch style={{width:width,height:20}} onPress={()=> this.navigateToScene('AccountUser')}>
											        <Text style={{fontSize:14,color:'#fff'}}>ข้อมูลส่วนตัว</Text> 
													{/* <Text style={{fontSize:14,color:'#fff'}}>基本信息</Text>  */}
											     </Touch> 
											  </List.Item> 
											 </Flex.Item>
											</Flex>

                                            <Flex style={styles.gameBg2}>	
											 <Flex.Item style={{paddingTop:5}}>
											  <List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
												 <Touch style={{width:width,height:20}} onPress={()=> this.navigateToScene('Password')}>
											        <Text style={{fontSize:14,color:'#fff'}}>จัดการรหัสผ่าน</Text> 
													{/* <Text style={{fontSize:14,color:'#fff'}}>密码管理</Text>  */}
											     </Touch> 
											  </List.Item> 
											 </Flex.Item>
											</Flex>

                                            <Flex style={styles.gameBg2}>	
											 <Flex.Item style={{paddingTop:5}}>
											  <List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
												 <Touch style={{width:width,height:20}} onPress={()=> this.navigateToScene('bankCenter')}>
											        <Text style={{fontSize:14,color:'#fff'}}>บัญชีการถอน</Text> 
													{/* <Text style={{fontSize:14,color:'#fff'}}>提现帐户</Text>  */}
											     </Touch> 
											  </List.Item> 
											 </Flex.Item>
											</Flex>

											<Flex style={styles.gameBg2}>	
											 <Flex.Item style={{paddingTop:5}}>
											  <List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)} style={{backgroundColor:'transparent'}}> 
												 <Touch style={{width:width,height:20}} onPress={() => {Actions.FastLogin({username: userNameDB.toLowerCase()})}}>
											        <Text style={{fontSize:14,color:'#fff'}}>ล็อคอินด่วน</Text> 
													{/* <Text style={{fontSize:14,color:'#fff'}}>快速登录</Text>  */}
											     </Touch> 
											  </List.Item> 
											 </Flex.Item>
											</Flex>
  
									</ScrollView>

 
	  
						    </View>		

        )
    }
}


export default (UserAccount);



const styles = StyleSheet.create({
    gameBg2:{
		paddingLeft: 10,
	 }, 
});