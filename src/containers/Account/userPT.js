import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle ,Image,Dimensions,ScrollView,TouchableOpacity} from 'react-native';
import { Button, Carousel,WhiteSpace, WingBlank,InputItem,Toast,Flex } from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown';
import Touch from 'react-native-touch-once';
 
 
const {
  width
} = Dimensions.get('window')

  
const PreferName = {
  "MAIN":"主账户 (MAIN)",
  "CMD":"CMD体育平台(CMD)",
  "IPSB":"IM体育平台 (IPSB)",
  "LD":"真人娱乐 (CASINO)",
  "SLOT":"老虎机 (SLOT)",
  "SB":"IM电竞牛(IPES)", 
}

class user extends React.Component{
 
  constructor(props) {
    super(props);
    this.state = {
      memberInfo:this.props.memberInfo,
      email:this.props.email,
			phoneNumber:this.props.phoneNumber,
      user:'', //帳戶
      name:this.props.memberInfo.MemberCode, //用戶名
      password:'', //密碼
      repassword:'', // 密碼確認
      number:'', //電話 
      qq:'', //qq 
      wechat:'', //微信
      Scode:'',// 推薦代碼
      toWalletA:'',
      depositingWallet:'',
      toWallet: PreferName[this.props.memberInfo.PreferWallet],
      Banksfirst:'',
      BanksDefault:'',
      UserBank:'',
      BankUserBank:false,
      BankName:'',
      accountHolderName:'',
      accountNumber:'',
      Provincesx:'',
      city:'',
      branch:'',
      Bankkey:'',//key 
      nameT:"JBO_",
      ptName:false,
      ptDB:false,
      setVendor:'',
    }

  } 
  componentWillMount(props) { 
    this.CheckVendor(); 

  }  
   
  UpdateMember(){
    let nj = 'JBO_'+this.state.name
    fetchRequest(ApiPort.PTUSERNAME+nj+'&', 'GET')
    .then((res) => {
       if (res.isUserExists == true) {
           this.setState({
             name:"",
             ptName:true, 
           })
       }else{
        this.setState({
          ptName:false
        })
       }
    
   }).catch(error => {
      
   });

  }

  CheckVendor(){ 
    
    fetchRequest(ApiPort.GETCheckVendor, 'GET')
    .then((res) => {
       if (res.success == true) {
           this.setState({
               OKVendor:res,
               setVendor: true,
           });
       }
       if(res.code == '9001'){
           Toast.fail('温馨提示，您未注册PT账户。');
           this.UpdateMember(); 
           this.setState({
               OKVendor:'',
               setVendor: false,
           });
       }
   }).catch(error => {
      
   });
 }


 RegistrationPT(){ 

    let data =  {
        "username": this.state.nameT+this.state.name,
        "password": this.state.password,
    }


    let namereg = /^[a-zA-Z0-9]{5,16}$/;

        
    if(namereg.test(this.state.name) == false){
      Toast.fail('用户名必须拥有 5-16个数字或字母构成')
        return;
      }



    if(this.state.name == ""){
      Toast.fail('请填写用户名'); 
      return;
      
  }

  if(this.state.password == ""){
    Toast.fail('请填写密码'); 
      return;

  }

    Toast.loading('注册中,请稍候...',200);
  fetchRequest(ApiPort.GETCheckVendor, 'POST',data)
  .then((res) => {
      
      Toast.hide(); 
      if(res.isSuccess == false){
        Toast.fail(res.message); 
      }else if(res.code == "GEN0006"){ 
          Toast.fail('注册失败,请稍后尝试');  
      }else{
        Toast.success(res.description); 
        this.CheckVendor(); 
      }
      
  }).catch(error => {
    Toast.hide(); 
      
  });
}


PTChangePWD(){
   const { password,repassword,setVendor} = this.state;
  
   if((password || repassword) == ''){
    Toast.fail('密码不可为空！');
       return;
   }
   if(password != repassword){
    Toast.fail('密码输入不一致');
       return;
   }
   this.setState({
       loading: true
   });
   
   const MemberData =  {
       "newPassword": password
   }
   Toast.loading('修改中,请稍候...',200);
   fetchRequest(ApiPort.PUTPTChangePWD, 'PUT', MemberData).then((res) => {
           
           Toast.hide(); 
           if (res.isSuccess == true && res.isPasswordChanged == true) {
            Toast.success("修改PT账户密码成功！");
           }else{
            Toast.fail(res.message);
           }
       })
       .catch(error => {
        Toast.hide(); 
           
       });
}

 //更新的数据
MemberChange(type, e) {
   if(type == 'CHECKNEWPWD'){
       this.setState({ CHECKNEWPWD: e.target.value });
   }else{
       this.setState({ NewPWD: e.target.value });
   }

}
 
 
  render() { 
     const {BankUserBank,toWalletA,toWallet,Banksfirst, BanksDefault}  = this.state;   //註冊訊息 
     const {nameT,ptName,setVendor,BankAccountID,accountHolderName,accountNumber,Provincesx,city,branch} = this.state; //銀行
    return (  
      
       <View  style={{ flex: 1 }} >  

         <WhiteSpace size="sm" />  

        
        {setVendor == false  &&  
        
        <View  style={{ flex: 1 }} > 
         
         
          <Flex style={styles.gameBg1}>  
							<Flex.Item>
							<InputItem
							clear
							type="number"
              value={this.state.name}
              labelNumber={8}
              editable={ptName}
							onChange={(value: any) => {
								this.setState({
									name: value,
								});
							}}
							placeholder=""
						>
							<Text style={{fontSize:14}}>PT账户名:     {nameT}</Text>
						</InputItem>
						</Flex.Item>
					</Flex>
 
          <Flex style={styles.gameBg1}>  
							<Flex.Item>
							<InputItem
							clear
							type="password"
              value={this.state.password}
              labelNumber={5}
							onChange={(value: any) => {
								this.setState({
									password: value,
								});
							}}
							placeholder=""
						>
							<Text style={{fontSize:14}}>密码:</Text>
						</InputItem>
						</Flex.Item>
					</Flex> 

          <Flex style={styles.gameBg1}>  
							<Flex.Item>
							<InputItem
							clear
              type="password"
              labelNumber={5}
							value={this.state.repassword}
							onChange={(value: any) => {
								this.setState({
									repassword: value,
								});
							}}
							placeholder=""
						>
							<Text style={{fontSize:14}}>确认密码:</Text>
						</InputItem>
						</Flex.Item>
					</Flex>
  
        {/*提交表單*/}

        <Flex>
        <Flex.Item style={{flex:0.14}}></Flex.Item>
        <Flex.Item>
        <Touch onPress={this.RegistrationPT.bind(this)} style={styles.touchableStyles} >
          
          <Text style={styles.loginButton}>提交</Text>
        
         </Touch>
         </Flex.Item>

         <Flex.Item style={{flex:0.2}}></Flex.Item>
         </Flex> 
 
         </View>
            }
            

            {setVendor == true  &&  

              <View  style={{ flex: 1 }} > 
                       
              <Flex style={styles.gameBg1}>  
                  <Flex.Item>
                  <InputItem
                  clear
                  type="number"
                  value={this.state.name}
                  labelNumber={8}
                  onChange={(value: any) => {
                    this.setState({
                      name: value,
                    });
                  }}
                  placeholder=""
                >
                  <Text style={{fontSize:14}}>PT账户名:     {nameT}</Text>
                </InputItem>
                </Flex.Item>
              </Flex>

              <Flex style={styles.gameBg1}>  
                  <Flex.Item>
                  <InputItem
                  clear
                  type="password"
                  value={this.state.password}
                  labelNumber={5}
                  onChange={(value: any) => {
                    this.setState({
                      password: value,
                    });
                  }}
                  placeholder=""
                >
                  <Text style={{fontSize:14}}>密码:</Text>
                </InputItem>
                </Flex.Item>
              </Flex> 

              <Flex style={styles.gameBg1}>  
                  <Flex.Item>
                  <InputItem
                  clear
                  type="password"
                  labelNumber={5}
                  value={this.state.repassword}
                  onChange={(value: any) => {
                    this.setState({
                      repassword: value,
                    });
                  }}
                  placeholder=""
                >
                  <Text style={{fontSize:14}}>确认密码:</Text>
                </InputItem>
                </Flex.Item>
              </Flex>

              {/*提交表單*/} 
              
              <Flex>
              <Flex.Item style={{flex:0.14}}></Flex.Item>
              <Flex.Item>
              <Touch onPress={this.PTChangePWD.bind(this)} style={styles.touchableStyles} >

              <Text style={styles.loginButton}>提交</Text>

              </Touch>
              </Flex.Item>

              <Flex.Item style={{flex:0.2}}></Flex.Item>
              </Flex> 


              </View>
 

            }




       </View>
     
    );
  }
}
 
export default user;
 

const styles = StyleSheet.create({
  visible: {
    backgroundColor: "#000",
  },
  input: {
    width: width,
    color: '#fff',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#9e9e9e'

  },
  loginButton: {
    fontWeight: 'bold',
    borderRadius: 10,
    color: '#fff',
    textAlign: 'center',
    fontSize: 22
  },
  rootContainer: {
    flex: 1, 
    backgroundColor: "#fff",
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
    width: 300,
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 25
  },
  dropdown_D_text: { 
		top:1,
		paddingBottom:13,
		paddingLeft:10,
		fontSize: 15,
		color: '#828282',
		textAlign: 'center',
		textAlignVertical: 'center',
  },
  dropdown_DX_dropdown:{ 
		height:244,
		marginRight:-15,
		borderRadius: 1,
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4,
		
		
  },
  PayButtonB:{ 
    paddingBottom:12,
    backgroundColor:"#fff", 
   
  },
  buttonPay:{
    borderRadius:18,
    padding:5,
    marginTop:13,
		backgroundColor: '#00633c', 
		
  },

  buttonPay2:{
    borderRadius:18,
    width:110,
    padding:5,
    marginTop:13,
		backgroundColor: '#00633c', 
		
  },

  buttonPay3:{
    borderRadius:18,
    width:110,
    padding:5,
    marginTop:13, 
    marginLeft:5,
		backgroundColor: '#747474', 
		
  },

  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,  
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 14,
    color: '#000',
    textAlignVertical: 'center',
  },
  withdrawals:{
	 	
    borderBottomWidth: 1, 
    borderColor: '#f1f1f1',
    backgroundColor:"#fff",
    
  },
 
  gameBg1:{
    paddingTop:5,
    backgroundColor:"#fff",
  },
  
});

