import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, ImageBackground ,TextInput,Image,Dimensions,ScrollView,TouchableOpacity} from 'react-native';
import { Flex, Carousel,WhiteSpace, WingBlank,InputItem,Toast } from 'antd-mobile-rn';

import Touch from 'react-native-touch-once';


import { NavigationActions } from 'react-navigation';


import {I18n, getLanguages} from '../../language/i18n'

import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index.native'; 

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newStyle[key].color = '#fff';
	}
	newStyle[key].borderBottomColor = '#646464';
  }
}


const {
  width
} = Dimensions.get('window')


declare var jest: any;
 

class Password extends React.Component<any, any> {

 inputRef: any; 

  constructor(props) {
    super(props);
    this.state = {
      memberInfo:this.props.memberInfo,
      email:this.props.email,
			phoneNumber:this.props.phoneNumber,
      user:'', //帳戶
      name:this.props.memberInfo.FirstName, //用戶名
	  password:'', //密碼
	  password2:'', //密碼
      repassword:'', // 密碼確認
      number:'', //電話 
      qq:'', //qq 
      wechat:'', //微信
      Scode:'',// 推薦代碼
      SeePassword:true,
	  SeePasswordS2:true,
	  SeePasswordS3: true,

    }

  } 
  componentWillMount(props) {
		// console.log(this.props) 
    memberData();
  }  


  UpdateMember(){ 

    const {password,password2,repassword} = this.state;
   
    const MemberData = 
    {
      "oldPassword": repassword,
      "newPassword": password
	  }
	
	if(!repassword){
    Toast.fail('โปรดกรอกรหัสผ่านเดิม')
		//Toast.fail('请输入旧密码')  
		return;
	}
	if(!password){
    Toast.fail('โปรดกรอกรหัสผ่านใหม่')
	//	Toast.fail('请输入新密码')  
		return;
	}
	if(!password2){
    Toast.fail('ยืนยันรหัสผ่านใหม่')
    //	Toast.fail('请再次输入新密码')  
		return;
	}
	 
    if(repassword == password){
      Toast.fail('รหัสผ่านเดิมและรหัสผ่านใหม่เหมือนกัน')
     // Toast.fail('旧密码与新密码相同')  
      return;
	 }
	if(password != password2) { 
    Toast.fail('โปรดยืนยันว่ารหัสผ่านตรงกัน!')  
		//Toast.fail('两次输入的新密码不相同')  
		return;
	}
	let passwordReg = /^(?=.{6,16}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])+$/;
    if (passwordReg.test(password) == false) {
      //密码必须由至少6位、最多16位长度的字母和数字组成
		Toast.fail('6-14 ตัวเลขและตัวอักษร')  
		return;
    }


    // console.log(MemberData)
    Toast.loading('โปรดรอสักครู่..',200);
    fetchRequest(ApiPort.Password+'?', 'PUT',MemberData) 
        .then((res) => {
          Toast.hide();
            

            if (res.isSuccess == true) {
                // console.log("关闭快捷登录方式");
                let fastLoginKey = "fastLogin" + userNameDB.toLowerCase();
                let sfastLoginId = "fastLogin" + userNameDB.toLowerCase();
                global.storage.remove({
                  key: fastLoginKey,
                  id: sfastLoginId
                });
                //更改成功
                Toast.success('เปลี่ยนสำเร็จ!',2,() => {
                  //修改成功后退出
                  navigateToSceneGlobeX();
                });
            } else if (res.isSuccess == false) {
                Toast.fail(res.message);
            }
        })
        .catch(error => {
          Toast.hide();
             
            if(error.message == "MEM00050"){
              Toast.fail('No fields have been changed');
              return;
            } 
           
            if (error) {
                let errors = JSON.parse(error.content); 
                if (errors.error_details) {
                  Toast.fail(errors.error_details.Message);
                } else {
                  Toast.fail('error occurred, please try again later');
                }
            } else {
              Toast.fail('error occurred, please try again later');
            }

            //message.error(errors.error_details.Message);
        });
}


    eyes(){  //顯示密碼 
      this.setState({
        SeePassword:this.state.SeePassword == false ? true :false
      })  
    }
   
    eyesS2(){  //顯示密碼 
      this.setState({
        SeePasswordS2:this.state.SeePasswordS2 == false ? true :false
      })  
	}
	eyesS3(){  //顯示密碼 
		this.setState({
		  SeePasswordS3:this.state.SeePasswordS3 == false ? true :false
		})  
	  }



  render() { 
     const {SeePassword,SeePasswordS2,SeePasswordS3,email,name,password,password2,repassword,number,Scode}  = this.state;   //註冊訊息 
    return (

      <View  style={{ flex: 1 ,backgroundColor:'#0a0a0a'}} >
       <ScrollView 
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
      
     <View style={styles.rootContainer}>
 
        {/* <InputItem 
            value={repassword}
            onChange={(repassword: any) => {
              this.setState({
                repassword,
              });
            }}
            labelNumber={4}
            placeholder="旧密码"
            type="password"
            styles={StyleSheet.create(newStyle)} 
          >
					<Text style={{color:'#666'}}>旧密码: </Text>
         </InputItem> */}

    
     <Flex>	
	 	<Flex.Item style={{position: 'absolute',left:30}}>
			<Text style={{color: '#fff'}}>รหัสผ่านเก่า</Text>
      {/* <Text style={{color:'#666'}}>旧密码: </Text> */}
		</Flex.Item>
     <Flex.Item style={{ flex:1, paddingLeft: 15, paddingRight: 4 }}> 
     {SeePassword == true  ? 
      <TextInput  
      style={styles.input}
      underlineColorAndroid="transparent"
      value={repassword}
      secureTextEntry={true}
      placeholder="โปรดกรอกรหัสผ่านเดิม"
      // placeholder='请输入原始密码'
      placeholderTextColor="#c8c8c8"
      textContentType='password' 
      onChangeText={(repassword: any) => {
        this.setState({
          repassword,
        });
      }}
      />  
       
      :SeePassword == false && 
 
      <TextInput  
      style={styles.input}
      underlineColorAndroid="transparent"
      value={repassword}
      secureTextEntry={false}
      placeholder="โปรดกรอกรหัสผ่านเดิม"
      //placeholder='请输入原始密码'
      placeholderTextColor="#c8c8c8"
      textContentType='password' 
      onChangeText={(repassword: any) => {
        this.setState({
          repassword,
        });
      }}
      />  
 
       }

       </Flex.Item> 

         <Flex.Item style={{flex:0.1, paddingLeft: 4 }}> 

					<TouchableOpacity onPress={()=>this.eyes()}>

					{SeePassword == true ?  
					<Image resizeMode='stretch'  source={ require('../../images/eyes.png') } style={{width:25,height:16,top:2,	opacity:0.4 }}/>

					:SeePassword == false &&

					<Image  
					resizeMode='stretch' 
					source={
						require('../../images/eyeopen.png')
					}
						style={{width:25,height:16,top:2}}
					/> 
			     	} 
					</TouchableOpacity> 
				</Flex.Item> 
      </Flex>


 


    <Flex>	
		<Flex.Item style={{position: 'absolute',left:30}}>
      <Text style={{color: '#fff'}}>รหัสผ่านใหม่</Text>
      {/* <Text style={{color: '#fff'}}>新密码</Text> */}
		</Flex.Item>
     <Flex.Item style={{ flex:1, paddingLeft: 15, paddingRight: 4 }}> 
      {SeePasswordS2 == true  ?
      
      <TextInput  
      style={styles.input}
      underlineColorAndroid="transparent"
      value={password}
      secureTextEntry={true}
      placeholder="6-20 ตัวเลขและตัวอักษร"
      //placeholder='6~16位数字和字母'
	  placeholderTextColor="#c8c8c8"
	  maxLength={20}
      textContentType='password' 
      onChangeText={(password: any) => {
        this.setState({
          password: password.replace(/[^\w]/,''),
        });
      }}
      />  
       
      :SeePasswordS2 == false && 
 
      <TextInput  
      style={styles.input}
      underlineColorAndroid="transparent"
      value={password}
      secureTextEntry={false}
      placeholder="6-20 ตัวเลขและตัวอักษร"
     // placeholder='6~16位数字和字母'
	  placeholderTextColor="#c8c8c8"
	  maxLength={20}
      textContentType='password' 
      onChangeText={(password: any) => {
        this.setState({
          password: password.replace(/[^\w]/,''),
        });
      }}
      />  
 
       }

       </Flex.Item> 

         <Flex.Item style={{flex:0.1, paddingLeft: 4 }}> 

					<TouchableOpacity onPress={()=>this.eyesS2()}>

					{SeePasswordS2 == true ?  
					<Image resizeMode='stretch'  source={ require('../../images/eyes.png') } style={{width:25,height:16,top:2 ,	opacity:0.4}}/>

					:SeePasswordS2 == false &&

					<Image  
					resizeMode='stretch' 
					source={
						require('../../images/eyeopen.png')
					}
						style={{width:25,height:16,top:2}}
					/> 
			     	} 
					</TouchableOpacity> 
				</Flex.Item> 
      </Flex>
	  {/* 二次确认 */}
	  <Flex>
		<Flex.Item style={{position: 'absolute',left:30}}> 
    <Text style={{color: '#fff'}}>ยืนยันรหัสผ่านใหม่</Text>
			{/* <Text style={{color: '#fff'}}>确认新密码</Text> */}
		</Flex.Item>
     <Flex.Item style={{ flex:1, paddingLeft: 15, paddingRight: 4 }}> 
      {SeePasswordS3 == true  ?
      
      <TextInput  
      style={styles.input}
      underlineColorAndroid="transparent"
      value={password2}
      secureTextEntry={true}
      placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
	//  placeholder='再次输入新密码'
	  maxLength={16}
      placeholderTextColor="#c8c8c8"
      textContentType='password' 
      onChangeText={(password2: any) => {
        this.setState({
          password2:password2.replace(/[^\w]/,''),
        });
      }}
      />  
       
      :SeePasswordS3 == false && 
 
      <TextInput  
      style={styles.input}
      underlineColorAndroid="transparent"
      value={password2}
      secureTextEntry={false}
      placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
	  //placeholder='再次输入新密码'
	  maxLength={16}
      placeholderTextColor="#c8c8c8"
      textContentType='password' 
      onChangeText={(password2: any) => {
        this.setState({
          password2:password2.replace(/[^\w]/,''),
        });
      }}
      />  
 
       }

       </Flex.Item> 

         <Flex.Item style={{flex:0.1, paddingLeft: 4}}> 

					<TouchableOpacity onPress={()=>this.eyesS3()}>

					{SeePasswordS3 == true ?  
					<Image resizeMode='stretch'  source={ require('../../images/eyes.png') } style={{width:25,height:16,top:2 ,	opacity:0.4}}/>

					:SeePasswordS3 == false &&

					<Image  
					resizeMode='stretch' 
					source={
						require('../../images/eyeopen.png')
					}
						style={{width:25,height:16,top:2}}
					/> 
			     	} 
					</TouchableOpacity> 
				</Flex.Item> 
      </Flex>
	  {/* 二次确认 */} 
 
            {/*提交表單*/}
            <Touch onPress={this.UpdateMember.bind(this)} style={{marginTop:20,padding:15,width: width}} > 
           {/* <ImageBackground resizeMode='stretch' source={require('../../images/button.png')} style={{width:220,height:40}}>
								<Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center',paddingTop:10 }}>{I18n.t('Registered.10')}</Text>
								</ImageBackground> */}
				<View style={{backgroundColor: '#00b324',borderRadius: 5}}> 
        <Text style={{textAlign: 'center',color: '#fff',lineHeight: 40}}>บันทึก</Text>
					{/* <Text style={{textAlign: 'center',color: '#fff',lineHeight: 40}}>保存</Text> */}
				</View>
          </Touch>
		  <View>
			  
		  </View>



        </View>
 
       </ScrollView>
     

 

     </View>
    
     );
  }
}






export default Password;




const styles = StyleSheet.create({
  visible: {
    backgroundColor: "#000",
  },
  input: {
    width: width - 20,
    // fontSize:16,
    color: '#fff',
    textAlign: 'right',
    paddingTop:15,
	paddingBottom:15,
	paddingRight: 45,
    borderBottomWidth: 1,
    borderColor: '#3d3d3d',
    fontFamily:"Kanit",
  },
  loginButton: {
    fontWeight: 'bold',
    borderRadius: 10,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  rootContainer: {
    flex: 1, 
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center"
  },
  textStyles: {
    textAlign: "center",
    color: "rgba(0,0,0,0.8)",
    fontSize: 16
  },
  touchableStyles: {
    marginTop: 15,
    marginBottom:15,
    backgroundColor: '#012c1f',
    width: 150,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25
  }
});

