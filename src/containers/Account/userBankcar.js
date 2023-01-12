import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, ImageBackground ,Image,Dimensions,ScrollView,TouchableOpacity} from 'react-native';
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



class user extends React.Component{

 

  constructor(props) {
    super(props);
    this.state = {
      memberInfo:this.props.memberInfo,
      email:this.props.email,
			phoneNumber:this.props.phoneNumber,
      user:'', //帳戶
      name:this.props.memberInfo.FirstName, //用戶名
      password:'', //密碼
      repassword:'', // 密碼確認
      number:'', //電話 
      qq:'', //qq 
      wechat:'', //微信
      Scode:'',// 推薦代碼
      toWalletA:'请选择',
      depositingWallet:'',
      toWallet: Bankname[this.props.memberInfo.PreferWallet],
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


    }

  } 
  componentWillMount(props) {
		console.log(this.props) 
    memberData();  
    // if (toWalletBox != "") { 
		// 	this.state.toWalletA = toWalletBox.map(function (item, key) {
		// 		return { value: item.key, label: item.name }
		// 	});

		// 	this.setState({
		// 		toWalletA: this.state.toWalletA
		// 	}) 
		// } else {
		// 	this.GettoWalletA();
    // }
    
    this.GETMemberBanksfirst();

  }  


  UpdateMember(){ 

    const {password,repassword} = this.state;
   
    const MemberData = 
    {
      "oldPassword": repassword,
      "newPassword": password
    }

    console.log(MemberData)
    Toast.loading('更改中,请稍候...',200);
    fetchRequest(ApiPort.Password+'?', 'PUT',MemberData) 
        .then((res) => {
          Toast.hide();
            

            if (res.isSuccess == true) {
                Toast.success('更改成功!');
                
            } else if (res.isSuccess == false) {
                Toast.fail(res.message);
            }
        })
        .catch(error => {
          Toast.hide();
             
            if(error.message == "MEM00050"){
              Toast.fail('การตั้งค่าไม่มีการเปลี่ยนแปลง');
              return;
            }  
            if (error) {
                let errors = JSON.parse(error.content); 
                if (errors.error_details) {
                  Toast.fail(errors.error_details.Message);
                } else {
                  Toast.fail('โปรดลองอีกครั้งในภายหลัง');
                }
            } else {
              Toast.fail('โปรดลองอีกครั้งในภายหลัง');
            } 
        });
    }


    _dropdown_2_renderButtonText(rowData) {
      return `${rowData.BankName}`;
    }
  
    _dropdown_2_renderRow(rowData, rowID, highlighted) { 
      let evenRow = rowID % 2;
      return ( 
        <Flex style={{ width: 350, backgroundColor: "#fff", }}> 
          <Flex.Item style={[styles.dropdown_2_row, { flex: 1, paddingLeft: 14, paddingTop: 3, backgroundColor: evenRow ? '#ececec' : 'white' }]}>
            <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
              {`${rowData.label}`}
            </Text> 
          </Flex.Item> 
        </Flex> 
      );
    } 
    _dropdown_3_renderRow(rowData, rowID, highlighted) { 
      let evenRow = rowID % 2;
      return ( 
        <Flex style={{ width: 350, backgroundColor: "#fff", }}> 
          <Flex.Item style={[styles.dropdown_2_row, { flex: 1, paddingLeft: 14, paddingTop: 3, backgroundColor: evenRow ? '#ececec' : 'white' }]}>
            <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
              {`${rowData.BankName}`}
            </Text> 
          </Flex.Item> 
        </Flex> 
      );
    }


    	//瘋狂拿目標帳戶 this.loadInterval && clearInterval(this.loadInterval);
	GettoWalletA() {
		this.loadInterval = setInterval(() => {
			if (toWalletBox != "") {
				console.log('11111111GettoWalletAGettoWalletA')
				this.state.toWalletA = toWalletBox.map(function (item, key) {
					return { value: item.key, label: item.name }
				}); 
				this.setState({
					toWalletA: this.state.toWalletA
				})  
				clearInterval(this.loadInterval); 
			} 
		}, 5000)
	} 

 
  //獲取目標帳戶  
	GetWallets() {

		fetchRequest(ApiPort.Wallets, 'GET')
			.then(data => { 
				
				fromWalletBox = data.fromWallet;
				toWalletBox = data.toWallet; 
				this.state.toWalletA = toWalletBox.map(function (item, key) {
					return { value: item.key, label: item.name }
				}); 
				this.setState({
					toWalletA: this.state.toWalletA
				})  
			}).catch(error => { 
				 
			})
 
  }
  

    toWallet = (key) => {  //目標帳戶 
      this.setState({
        depositingWallet: this.state.toWalletA[key].value,
        toWallet: this.state.toWalletA[key].label,
      });  
      
    };


    MemberAcctountDefault(){
      this.setState({
          loading: true
      });
      const { AccountData } = this.props;
      const { depositingWallet} = this.state;
      const MemberData =  {
          "addresses":{
             "nationId": 1
          },
          "nationality": 1,
          "language": "th-th",
          "wallet": depositingWallet
      }
     

      console.log(MemberData)
      Toast.loading('设为默认账户中,请稍候...',200);
      
      fetchRequest(ApiPort.PUTMemberlistAPI+'?', 'PUT',MemberData).then((res) => {
              Toast.hide();
               
              if (res.isSuccess == true) {
                Toast.success("设置成功！");
                 
                  
                memberData();
                   
                
              }else if(res.message ==  "MEM00050"){
                Toast.fail("不能重复设置！");
              }else{
                Toast.fail("设置失败！");
              }
          })
          .catch(error => {
              Toast.hide();
              
          });
  }


   ////////////bank  /////////

   GETMemberBanksfirst() {

    fetchRequest(ApiPort.GETMemberBanksfirst+'?', 'GET').then((res) => { 
      if (res) {
         let DB = res;
         let bankBox=[]
          
         if(res.length > 1){
          res.map(function(item, key) {
            //console.log(item.IsDefault)
            if (item.IsDefault === true) {
              //console.log('eeeeeeww',item)
              bankBox.unshift(item);
              delete DB[key];
              return;
            }
          });
          DB.unshift(bankBox[0]);
        }else{
          bankBox = res
        }
          this.setState({
            UserBank:res,
            Banksfirst:DB,
            BanksDefault: DB.length != 0 ? DB[0].BankName :'',
            Bankkey:0,
          })   
          
      }
  }).catch(error => {
     
  });
}

MemberBanksDefault(id){
   
  Toast.loading('设置中,请稍候...',200);
    fetchRequest(ApiPort.PATCHMemberBanksDefault+id+'/Default?', 'PATCH').then((res) => { 
      Toast.hide(); 
         if (res.isSuccess == true) {
            Toast.success("设置成功！");
            this.GETMemberBanksfirst();
            ;
        }else{
            this.setState({
                loading:false
            })
            Toast.fail("设置失败！");
        }
    }).catch(error => {
      Toast.hide();
        
    });
}

DELETEMemberBanksDefault(id){

    Toast.loading('删除中,请稍候...',200);
    console.log(id)
    fetchRequest(ApiPort.DELETEMemberBanksDefault+id+'?', 'DELETE').then((res) => {  
        Toast.hide();  
        if (res.isSuccess == true) {
            Toast.success("删除成功！"); 
            this.GETMemberBanksfirst();
            this.setState({
              BankUserBank:false
            })
            ;
        }else{ 
            Toast.fail("删除失败！"); 
        }
    }).catch(error => {
        Toast.hide(); 
        
    });
}

 
BanksDefault = (key) => { 
  const {UserBank,BanksDefault} =this.state;

  this.setState({
    BanksDefault: UserBank[key].BankName,
    Bankkey:key, 
    BankName:UserBank[key].BankName,
    accountHolderName:UserBank[key].AccountHolderName,
    accountNumber:UserBank[key].AccountNumber,
    Provincesx:UserBank[key].Province,
    city:UserBank[key].City,
    branch:UserBank[key].Branch,
    BankAccountID:UserBank[key].BankAccountID,
  })

};


OpenBank(){   //查看銀行

  const {UserBank,BanksDefault,Bankkey} =this.state;

  this.setState({
    BankUserBank:this.state.BankUserBank == false ?  true : false, 
    BankName:UserBank[Bankkey].BankName,
    accountHolderName:UserBank[Bankkey].AccountHolderName,
    accountNumber:UserBank[Bankkey].AccountNumber,
    Provincesx:UserBank[Bankkey].Province,
    city:UserBank[Bankkey].City,
    branch:UserBank[Bankkey].Branch,
    BankAccountID:UserBank[Bankkey].BankAccountID,
  })
 

}
/////bank//////
 
  render() { 
     const {BankUserBank,toWalletA,toWallet,Banksfirst, BanksDefault}  = this.state;   //註冊訊息 
     const {BankAccountID,accountHolderName,accountNumber,Provincesx,city,branch} = this.state; //銀行
    return ( 

       <ScrollView
        style={{ flex: 1 ,backgroundColor:'#171717'}}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >  

      <WhiteSpace size="lg" />
  

          {Banksfirst == "" &&  
            <Flex style={{ paddingLeft: 14, paddingTop: 14, backgroundColor: "#171717",  borderBottomWidth: 1, borderColor: '#757575'}}> 
            <Flex.Item alignItems='center' style={{ paddingBottom: 14 }}>
              <Text style={{color:'#fff'}}>无银行卡数据,请先至提款添加银行卡</Text>
            </Flex.Item> 
            </Flex>  
           }

   
          {Banksfirst != "" &&
          <Flex style={{ paddingLeft: 14, paddingTop: 14, backgroundColor: "#171717",  borderBottomWidth: 1, borderColor: '#757575'}} key={BanksDefault}>

									<Flex.Item style={{ paddingBottom: 14 }}>
										<Text style={{color:'#fff'}}>本银提款账户</Text>
									</Flex.Item>

									<Flex.Item alignItems='flex-end' style={{ right: 27 }}>  
                      <ModalDropdown ref={el => this._dropdown_3 = el} 
                        key={Math.random()}
												defaultValue={BanksDefault}
												textStyle={styles.dropdown_D_text}
												dropdownStyle={styles.dropdown_DX_dropdown}
												options={Banksfirst}
												renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
												renderRow={this._dropdown_3_renderRow.bind(this)}
												onSelect={this.BanksDefault}
											/> 
									 
						   	</Flex.Item>
          </Flex> 
          }

         {Banksfirst != "" &&
       
          <Flex style={styles.PayButtonB}>	   
          <Flex.Item style={{flex:0.2}}></Flex.Item>
           <Flex.Item alignItems='center'>	
            <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{marginTop:20}} onPress={()=>this.OpenBank()}> 
          
              <ImageBackground resizeMode='stretch' source={require('../../images/button.png')} style={{width:220,height:40}}>
								<Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center',paddingTop:10 }}>查看账户</Text>
								</ImageBackground>
            
            </TouchableOpacity>
            </Flex.Item>
            <Flex.Item style={{flex:0.2}}></Flex.Item>
 
			    </Flex>

        } 


          <WhiteSpace size="sm" />
  

          {BankUserBank == true &&
 
            <View>

          <Flex style={styles.withdrawals}>  
            <Flex.Item style={{ flex: 0.3, paddingLeft: 14, paddingBottom: 14, paddingTop: 13, }}>
              <Text style={{ fontSize: 14,color:'#fff' }}>银行:</Text>
            </Flex.Item> 
            <Flex.Item>
              <InputItem 
              styles={StyleSheet.create(newStyle)} 
                editable={false}
                type="text"
                value={this.state.BankName} 
                placeholder=""
              > 
              </InputItem>
            </Flex.Item> 
            </Flex>
              
            <Flex style={styles.withdrawals}>  
            <Flex.Item style={{ flex: 0.3, paddingLeft: 14, paddingBottom: 14, paddingTop: 13, }}>
              <Text style={{ fontSize: 14 ,color:'#fff'}}>账户姓名:</Text>
            </Flex.Item>


            <Flex.Item>
              <InputItem 
              styles={StyleSheet.create(newStyle)} 
              editable={false}
                type="text"
                value={this.state.accountHolderName} 
                placeholder=""
              >

              </InputItem>
            </Flex.Item> 
            </Flex>


            <Flex style={styles.withdrawals}>

            <Flex.Item style={{ flex: 0.3, paddingLeft: 14, paddingBottom: 14, paddingTop: 13, }}>
              <Text style={{ fontSize: 14 ,color:'#fff'}}>银行号码:</Text>
            </Flex.Item>

            <Flex.Item>
              <InputItem 
              styles={StyleSheet.create(newStyle)} 
              editable={false}
                type="text"
                value={this.state.accountNumber} 
                placeholder=""
              >

              </InputItem>
            </Flex.Item>
            </Flex>



            <Flex style={styles.withdrawals}>


            <Flex.Item style={{ flex: 0.3, paddingLeft: 14, paddingBottom: 14, paddingTop: 13 }}>
              <Text style={{ fontSize: 14,color:'#fff' }}>省／自治区:</Text>
            </Flex.Item>


            <Flex.Item>
              <InputItem 
              styles={StyleSheet.create(newStyle)} 
              editable={false}
                type="text"
                value={this.state.Provincesx} 
                placeholder=""
              >

              </InputItem>
            </Flex.Item>
            </Flex>
 
            <Flex style={styles.withdrawals}> 
            <Flex.Item style={{ flex: 0.3, paddingLeft: 14, paddingBottom: 14, paddingTop: 13, }}>
              <Text style={{ fontSize: 14,color:'#fff' }}>城市／城镇:</Text>
            </Flex.Item>

            <Flex.Item>
              <InputItem 
              styles={StyleSheet.create(newStyle)} 
              editable={false}
                type="text"
                value={this.state.city} 
                placeholder=""
              > 
              </InputItem>
            </Flex.Item>
            </Flex>

            <Flex style={styles.withdrawals}>

            <Flex.Item style={{ flex: 0.3, paddingLeft: 14, paddingBottom: 14, paddingTop: 13, }}>
              <Text style={{ fontSize: 14,color:'#fff' }}>分行:</Text>
            </Flex.Item> 

            <Flex.Item>
              <InputItem 
              styles={StyleSheet.create(newStyle)} 
              editable={false}
                type="text"
                value={this.state.branch} 
                placeholder=""
              > 
              </InputItem>
            </Flex.Item>
            </Flex>

             <Flex style={{ paddingBottom:10, backgroundColor: "#171717"}}>
              <Flex.Item alignItems='flex-end' style={{marginRight:10}}>	
              <Touch hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.buttonPay3} onPress={()=>this.DELETEMemberBanksDefault(BankAccountID)}> 
                <Text style={{color:"#fff",fontSize:16,fontWeight:'bold',	textAlign: 'center'}}>移除账户</Text>
              
              </Touch>
              </Flex.Item>

              <Flex.Item alignItems='flex-start'>	
              <Touch hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.buttonPay2} onPress={()=>this.MemberBanksDefault(BankAccountID)}> 
                <Text style={{color:"#fff",fontSize:16,fontWeight:'bold',	textAlign: 'center'}}>设为默认账户</Text>
              </Touch>
              </Flex.Item>

               </Flex>

          </View>

          }
 
 
       </ScrollView>
     
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
    backgroundColor:"#171717", 
   
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
		backgroundColor: '#337434', 
		
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
    borderColor: '#414141',
    backgroundColor:"#171717",
    
  },

});

