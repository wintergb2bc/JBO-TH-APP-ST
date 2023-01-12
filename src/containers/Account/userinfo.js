import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle ,Image,Dimensions,ScrollView,TouchableOpacity} from 'react-native';
import { Button, Carousel,WhiteSpace, WingBlank,InputItem,Toast,Flex,Switch,List,Radio} from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown';
import Touch from 'react-native-touch-once';
  
const RadioItem = Radio.RadioItem; 

const {
  width
} = Dimensions.get('window')

 
  
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
      checked:false,
      branch:'',
      Bankkey:'',//key 
      nameT:"JBO_",
      ptName:false,
      ptDB:false,
      setVendor:'',
      part2Value:'',
    }

  } 
  componentWillMount(props) { 
   

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
 
  fetchRequest(ApiPort.GETCheckVendor, 'POST',data)
  .then((res) => {
      
      if(res.isSuccess == false){
        Toast.fail(res.message);
      }else{ 
          Toast.success(res.message); 
      }
      
  }).catch(error => {
      
  });
}


SetSelfExclusions(){
  const {checked,password, Statusset,part2Value,NumberSet} = this.state; 
  console.log(checked)
  if(Statusset == false){
    Toast.fail('请选择限制状态！');
      return
  }
  if(password === ''){
    Toast.fail('请输入限制的金额');
      return;
  }
 
  let daex;
  let daeta;
  if(part2Value == 0){
    daex ='NotAvailable'
    daeta = '0'
  }else if(part2Value == 1){
    daex ='SevenDays'
    daeta = '7'
  }else if(part2Value == 2){
    daex ='NinetyDays'
    daeta = '90'
  }

  const MemberData =  {
    "setting":daex, // 'NotAvailable', //是否限制登录 SevenDays  NinetyDays
    "isEnabled": checked,  //是否自用自我限制
    "limitAmount": Number(password), //限制转账金额
    "betLimitDayRange": daeta //限制登录的天数  文档说投注金额限制的日期范围。只有一个选项：7。但是线上还是可以限制 90。。。什么逻辑。。。
  }
   
  fetchRequest(ApiPort.PUTSelfExclusions, 'PUT',MemberData).then((res) => {
          
          this.setState({
              loading: false
          });
          if (res.isSuccess == true ) {
            Toast.success("个人限制设置成功！");
          }else{
            Toast.fail('设置失败！');
          }
      })
      .catch(error => {
          
      });
}

onSwitchChange = (value: any) => {
 
  this.setState({
    checked: value,
  });

  console.log(this.state.checked)
  
}
 
 
  render() { 
     const {BankUserBank,toWalletA,toWallet,Banksfirst, BanksDefault}  = this.state;   //註冊訊息 
     const {checked,nameT,ptName,setVendor,BankAccountID,accountHolderName,accountNumber,Provincesx,city,branch} = this.state; //銀行
    return (  
      
       <View  style={{ flex: 1 }} >  

         <WhiteSpace size="sm" />  
 
         
        <List.Item
          extra={
            <Switch
              checked={this.state.checked}
              onChange={this.onSwitchChange}
            />
          }
        >
          状态
        </List.Item>
          
     
        <View  style={{ flex: 1 }}> 

          <Flex style={styles.gameBg1}>  
							<Flex.Item>
							<InputItem
							clear
							type="numnber"
              value={this.state.password}
              labelNumber={5}
              editable={checked}
							onChange={(value: any) => {
								this.setState({
									password: value,
								});
							}}
							placeholder=""
						>
							<Text style={{fontSize:14,fontWeight:'bold'}}>转账限制:</Text>
						</InputItem>
						</Flex.Item>
					</Flex> 


           <Flex style={styles.gameBg1}>  
							<Flex.Item style={{padding:14,}}>
					 
							<Text style={{fontSize:14,color:"#666"}}>注： 此限定将在7日内，将全部金额转至产品账户内</Text>
						 
						</Flex.Item>
					</Flex> 
          <WhiteSpace size="sm" />  
          <Flex style={styles.gameBg1}>
          <Flex.Item style={{padding:14,}}>
          <Text style={{fontWeight:'bold'}}>行为限定设置</Text>
          </Flex.Item>
          </Flex> 

          <List style={{ marginTop: 0.5}}>

          <RadioItem
         disabled={checked == false ? true :false} 
            checked={this.state.part2Value === 0}
            onChange={(event: any) => {
              if (event.target.checked) {
                this.setState({ part2Value: 0});
              }
            }}
          >不限制登录 </RadioItem>

         
          <RadioItem
         disabled={checked == false ? true :false} 
            checked={this.state.part2Value === 1}
            onChange={(event: any) => {
              if (event.target.checked) {
                this.setState({ part2Value: 1 });
              }
            }}
          >请勿让我在未来7天内登录 </RadioItem>
          <RadioItem
             disabled={checked == false ? true :false} 
            checked={this.state.part2Value === 2}
            onChange={(event: any) => {
              if (event.target.checked) {
                this.setState({ part2Value: 2 });
              }
            }}
          >请勿让我在未来90天内登录</RadioItem>
         
        </List>




       <View style={{backgroundColor:'#fff',padding:14}}>
        <Text style={{color:"#666"}}>注： 如果您无法控制个人的投注行为， 我们可以协助您在未来的 7 日或是 3个 月时间内启用登入限制。</Text> 
        <Text style={{color:"#666"}}>此外，您也可以联系我们的客服专员寻求建议与帮助。</Text>

        </View>
         


         
 
        {/*提交表單*/}

        <Flex>
        <Flex.Item style={{flex:0.3}}></Flex.Item>
        <Flex.Item style={{flex:0.5}}>
        <Touch onPress={this.SetSelfExclusions.bind(this)} style={styles.touchableStyles} >
          
          <Text style={styles.loginButton}>提交</Text>
        
         </Touch>
         </Flex.Item>

         <Flex.Item style={{flex:0.3}}></Flex.Item>
         </Flex> 
         </View>
         
      
         
            

            




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
    fontSize: 16
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
    width: 150,
    paddingHorizontal: 30,
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

