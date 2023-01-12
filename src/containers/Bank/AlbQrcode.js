import React from 'react';
import { StyleSheet,Linking,Clipboard ,Text, View,ImageBackground,TouchableOpacity,ScrollView ,Dimensions,Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {  Carousel,WhiteSpace,Modal, WingBlank ,Flex,Toast,InputItem,Picker,List,Button} from 'antd-mobile-rn';
import Orientation from 'react-native-orientation-locker';
import styles from './bankStyle';
import Touch from 'react-native-touch-once';
import QRCode from 'react-native-qrcode';
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index';
const {
  width ,height
} = Dimensions.get('window')



const TextStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        TextStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        
            TextStyle[key].fontSize = 14;
            TextStyle[key].fontWeight = 'bold';
            
		TextStyle[key].color = '#fff'; 
		TextStyle[key].borderBottomColor = '#1a1a1a';
    }
}

const LBname = {
	"Alipay": "支付宝",
	"LocalBank": "银行卡",
	"ATM": "自动柜员机",
	"Mobile": "手机", 
	"Cash-ATM":"无卡",
	"IB":"跨行",
	"MB":"手机",
	"OTC":"柜台",
	"IBT":"同行",
}

let TimeV1;
let TimeV2; 

class DepositPage extends React.Component {
	
	
	constructor(props) {
	    super(props);
			this.state ={
				loadD:false,
				data:this.props.data,
				BaDB:this.props.data.BankData ? this.props.data.BankData.bankAccounts[this.props.data.userBankD]:this.props.data.BaDB,
				Bapay:this.props.data.NowBankType != 'WCLB' ? this.props.NowData.transferType.Name :'',
				LBdata:this.props.data.LBdata,
				NowData:this.props.data.NowData,
				NowBankType:this.props.data.NowBankType,
				carNumber:'',
				userButton:false,
				visible:false,
				ALBREADY:false,
				TimeLoad:'14:59',
				TimeV2Load:'04:59',
			} 
	  }
		
	componentWillMount(props) {
       Orientation.lockToPortrait();
			// console.log('ALB',this.props)
			 let ST =this.state.data;
			// console.log(ST.LBdata)
			console.log('AXXXX',this.props)

			if(this.props.data.NowBankType =='ALB'){ 
				if(this.props.ALBPlay){ 
					this.setState({
						ALBREADY:true
					})
					this.TimeDown();
				}else { 
				this.TimeBXDown();
				}

			}
 
		 
	  }

	  componentWillUnmount() {
		//離開註銷監聽 
		    TimeV1 &&clearInterval(TimeV1)
	        TimeV2 &&clearInterval(TimeV2);
	  }

	
	closeModal() {
		Actions.pop();
	}
	  
	
	gopay(){
		let LBdata =this.state.LBdata
		let ST = this.state;
		 
		let data; 
		
		 
		if(this.state.userButton == true){
			
			if(this.state.carNumber.length < 5){
				Toast.fail('请输入6位数', 2); 
				return;
			}else{
				data ={
					"depositingBankAcctNum": this.state.carNumber
				} 
			}
		  
		}else{
			data = {"depositingBankAcctNum": ST.BaDB.AccountNo.substr(ST.BaDB.AccountNo.length-6) } 
		}
		  
		
		fetchRequest(ApiPort.GopayLB+LBdata.transactionId+'/ConfirmStep?', 'POST',data)
				.then(data => {
									 
					 // console.log(data)
						if(data.isSuccess == true){
							Toast.success('订单成立', 3); 
							 
								setTimeout(() => {
									 Toast.hide();
							         Actions.pop();
								 }, 3000); 	 		
								 setTimeout(()=>{
									Actions.recordsTx({});
									}, 4000) 
										
						}else if(data.errorMessage == "ConfirmStep_Failed"){
							Toast.fail('账号错误,请重新输入', 2); 
						}else{
							Toast.fail(data.errorMessage, 2); 
						}
						
						
						//Actions.pop();
					}).catch(error => {
								//Toast.hide();
						console.log(error) 
				})
				
				
	}
	
	
	uClick(){
		
		this.setState({
			userButton:this.state.userButton == false ?  true :false 
		})
		
	}
	
	
	onClose = () => {
    this.setState({
      visible: false,
    });
  };

  ALBREadyB(){
 
	    let LBdata =this.state.LBdata
		let ST = this.state;
		 
		let data; 
		
		 TimeV2 && clearInterval(TimeV2)
		if(this.state.userButton == true){
			
			if(this.state.carNumber.length < 5){
				Toast.fail('请输入6位数', 2); 
				return;
			}else{
				data ={
					"depositingBankAcctNum": this.state.carNumber
				} 
			}
		  
		}else{
			data = {"depositingBankAcctNum": ST.BaDB.AccountNo.substr(ST.BaDB.AccountNo.length-6) } 
		}
		  
		
		fetchRequest(ApiPort.GopayLB+LBdata.transactionId+'/ConfirmStep?', 'POST',data)
				.then(data => {
									 
					 // console.log(data)
						if(data.isSuccess == true){
							if(this.state.NowBankType == 'ALB'){
							this.setState({
								ALBREADY:true,
							})
						    		
							this.TimeDown();
						}
							//Toast.success('订单成立', 3); 
							 
								// setTimeout(() => {
								// 	 Toast.hide();
							    //      Actions.pop();
								//  }, 3000); 	 		
								//  setTimeout(()=>{
								// 	Actions.recordsTx({});
								// 	}, 4000) 
										
						}else if(data.errorMessage == "ConfirmStep_Failed"){
							Toast.fail('账号错误,请重新输入', 2); 
						}else{
							Toast.fail(data.errorMessage, 2); 
						}
						
						
						//Actions.pop();
					}).catch(error => {
								//Toast.hide();
						console.log(error) 
				})
	
  }

  ALBREadyClose(){
    TimeV1 &&clearInterval(TimeV1)
	TimeV2 &&clearInterval(TimeV2);
	 						 setTimeout(() => {
								 
									//Toast.hide();
									Actions.pop(); 
								
								 }, 500); 	 		
								 setTimeout(()=>{ 
										Actions.recordsTx({});
									  
									}, 1000) 
  }

  CopyText(Text){
	    Clipboard.setString(Text+'') 
		Toast.success('คัดลอกแล้ว',0.2) 

  }


  TimeDown(){
            var m = 14;  //分
            var s = 59;  //秒
            
            TimeV1=setInterval(() =>{  
				let Sdb  = s < 10 ? '0'+s: s 
				this.setState({
					TimeLoad:m+':'+Sdb
				})
				if( m == 0 && s == 0 ){ 
					clearInterval(TimeV1); 
					this.ALBREadyClose();
					
				}else if( m >= 0 ){
					if( s > 0 ){
						s--;
					}else if( s == 0 ){
						m--;
						s = 59;
					}
				} 
			 },1000);
         
  }


  TimeBXDown(){
	var m = 4;  //分
	var s = 59;  //秒
	
	
	 TimeV2 =setInterval(() =>{  
		let Sdb  = s < 10 ? '0'+s: s 
		let MB = "0"+m 
		this.setState({
			TimeV2Load:MB+':'+Sdb
		})
		if( m == 0 && s == 0 ){  
				clearInterval(TimeV2);
				this.ALBREadyClose();  
		}else if( m >= 0 ){
			if( s > 0 ){
				s--;
			}else if( s == 0 ){
				m--;
				s = 59;
			}
		}

	 },1000);
 
}


  OpenAliPay(){ 
	const {LBdata,NowData} =this.state;
	//Actions.AlbQrcode({ data: this.state, LBdata: LBdata, NowData: NowData});
     Linking.openURL(LBdata.redirectUrl);   
	 
	   

		}

 
  render () {
		 
		
		const {ALBREADY,BaDB,TimeV2Load,data,LBdata,userButton,NowBankType,TimeLoad} = this.state;
	 	 const footerButtons = [  
			{ text: '我明白了', onPress: () => console.log('ok') },
		 ];
    return (
		    <View style={{width:width,height:height,top:Platform.OS === "android" ? 0 :35,backgroundColor: '#1a1a1a'}}>
		  
			{/** 支付寶轉帳 */}
			{NowBankType == 'ALB'   &&  ALBREADY ==false &&  
				
			
				<ScrollView
							   style={{ flex:1,marginTop:20}}
							   automaticallyAdjustContentInsets={false}
							   showsHorizontalScrollIndicator={false}
							   showsVerticalScrollIndicator={false}
						   >
						   
				     
				   <Flex style={styles.ALBList}>
					 
					<Flex.Item style={{paddingBottom:14}}>
						<Text style={{fontSize:14,color:'#ff0000',textAlign:'center'}}>二维码有效期 {TimeV2Load} ,请在有效期内完成支付</Text> 
					</Flex.Item> 
				   </Flex>		


				     <Flex style={styles.alipaySTY}> 
																	<Flex.Item style={{paddingBottom:14}}>
																		<Text style={{color:'#fff'}}>存款金额：</Text> 
																	</Flex.Item>
																	
																	<Flex.Item style={{paddingBottom:14,left:-60}}> 
																		<Text selectable={true} style={{color:'#1AFF00',fontSize:24,fontWeight:'bold',textAlign:'left'}}>{LBdata ?LBdata.uniqueAmount: '加載中'}</Text> 
																	</Flex.Item>

																 
																		
										</Flex>
														
							 
				   <Flex style={styles.alipaySTYQR}> 
				   
				      <Flex.Item alignItems='center' style={{  shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 3,  shadowColor: "#666", elevation: 4,}}>
						<QRCode 
								value={LBdata.redirectUrl}
								size={180}
								bgColor='#000'
								fgColor='white'/>
					  </Flex.Item> 

					</Flex>	
					
					 {/* {Platform.OS != 'ios' && 
					  <Flex style={{backgroundColor:"#fff",paddingTop:10}}>	  
					  <Flex.Item style={{flex:0.2}}></Flex.Item>
					  <Flex.Item alignItems='center'>	
					  <Touch hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.buttonPayAX} onPress={()=>this.OpenAliPay()}> 
						  <Text style={{color:"#fff",fontSize:16,fontWeight:'bold',textAlign: 'center'}}>开启支付宝</Text>
					  </Touch>
					  </Flex.Item>
					  <Flex.Item style={{flex:0.2}}></Flex.Item>
			         </Flex> 
					 } */}
				   	
							 
							 
							 <Flex style={styles.alipaySTYAX}> 
															<Flex.Item alignItems='flex-start' style={{paddingBottom:14}}>
														   <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  onPress={()=>this.uClick()}> 

																<Text style={{fontSize:14,color:'#fff'}}>您存错账号了吗？</Text> 
															   </TouchableOpacity>
															   
															</Flex.Item>
															
							</Flex>
							
							
							{userButton == true &&
							 <Flex style={{paddingLeft:14,paddingTop:3,backgroundColor:"#171717",marginLeft:15,marginRight:15}}>  
								<Flex.Item style={{flex:0.3}}>
									<Text style={styles.colorWhite}>银行帐号：</Text> 
								</Flex.Item>
								
								<Flex.Item style={{flex:0.8}}>
								<InputItem
								clear
								type="number"
								value={this.state.carNumber}
								onChange={(value: any) => {
									this.setState({
										carNumber: value,
									});
								}}
								styles={StyleSheet.create(TextStyle)}
								placeholder="请输入存入旧账号的最后6位号码"
							>
							
							</InputItem>
							</Flex.Item> 	
		            </Flex>
								
							}
						   
							 
						   <WhiteSpace size="lg" />
 
					</ScrollView>  

				   }  



				 {ALBREADY == true && 

					<ScrollView
					style={{ flex:1,paddingTop:height/3.6}}
					automaticallyAdjustContentInsets={false}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					>
					
					<Flex> 
						 <Flex.Item alignItems="center" style={{paddingBottom:10}}>
						 <Text style={styles.successBu}>✓</Text>
						 </Flex.Item> 
				    </Flex>



					<Flex> 
						 <Flex.Item style={{paddingBottom:10}}>
						 	<Text style={{fontSize:24,fontWeight:'bold', color:'#1AFF00',textAlign:'center'}}>订单成立</Text> 
						 </Flex.Item> 
				    </Flex>
  
					 <Flex>
						<Flex.Item> 
						<Text style={{fontSize:18,fontWeight:'bold', color:'#1AFF00',textAlign:'center'}}>{TimeLoad}</Text> 
					 </Flex.Item>
					 </Flex>

					 <Flex style={{marginTop:40}}>
						<Flex.Item style={{paddingBottom:10}}> 
						<Text style={{fontSize:14, color:'#fff',textAlign:'center'}}>交易进行中</Text> 
						<Text style={{fontSize:14, color:'#fff',textAlign:'center',paddingTop:10}}>您的存款将在指定的时间内到账</Text> 
						<Text style={{fontSize:14, color:'#fff',textAlign:'center',paddingTop:10}}>感谢您的耐心等待</Text> 
					 </Flex.Item>
					 </Flex>
 

					<WhiteSpace size="lg" />

					</ScrollView>  

				   }
 

				{NowBankType == 'ALB'   &&  ALBREADY == false &&
					 


				<Flex style={{top:Platform.OS === "android" ? 0:-35,paddingBottom:25, backgroundColor:"#1a1a1a",  shadowOffset: {width: 2, height: 10}, shadowOpacity: 1, shadowRadius: 5, shadowColor: "#666",  elevation: 4,}}>	  
				<Flex.Item style={{flex:0.2}}></Flex.Item>
				<Flex.Item alignItems='center'>	
				<Touch hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.buttonPay} onPress={()=>this.ALBREadyB()}> 
				<ImageBackground resizeMode='stretch' source={require('../../images/button.png')} style={{width:220,height:40}}>
				<Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center',paddingTop:10 }}>ยืนยัน</Text>
				</ImageBackground> 
				</Touch>



				</Flex.Item>
				<Flex.Item style={{flex:0.2}}></Flex.Item>
				</Flex> 

				}


			{NowBankType == 'ALB'   &&  ALBREADY == true &&
						 <Flex style={{top:Platform.OS === "android" ? 0:-35,paddingBottom:25, backgroundColor:"#1a1a1a",  shadowOffset: {width: 2, height: 10}, shadowOpacity: 1, shadowRadius: 5, shadowColor: "#666",  elevation: 4,}}>	  
						 		<Flex.Item style={{flex:0.2}}></Flex.Item>
						 		<Flex.Item alignItems='center'style={{width: width,padding:20}}>
									<View style={{backgroundColor: '#00b324',borderRadius:5,}}>
										<Touch style={{width:width-40}} onPress={()=>this.ALBREadyClose()}>
											<Text style={{color:"#fff",fontSize:16,fontWeight:'bold',textAlign: 'center',lineHeight:40}}>查看交易记录</Text>
										</Touch>
									</View>
						 		</Flex.Item>
						 		<Flex.Item style={{flex:0.2}}></Flex.Item>
						 </Flex> 
				}

						 
				    	<Modal 
				    	transparent
				    	onClose={this.onClose}
				    	maskClosable
						visible={this.state.visible} 
						style={{width:300,margin:0,height:205}}
				 	  > 
						<View style={{top:-21,left:-50,width:width,height:40,backgroundColor:'#00623b',alignItems: 'center',justifyContent: 'center' }}> 
				    	  <Text style={{ textAlign: 'center' ,fontSize:16,color:"#fff",fontWeight:'bold'}}>{NowBankType != 'WCLB' ? "支付宝转账" : "微信转账"} </Text> 
				    	</View>
 
				    	<View style={{ borderBottomWidth: 0.4, paddingBottom:20, borderColor: '#d2d2d2' }}> 
				    	 <Text style={{ textAlign: 'center' ,fontSize:14,}}>必须转入系统生成金额才能极速到账。 </Text>
                         <Text style={{ paddingTop:5,textAlign: 'center',fontSize:14, }}>请按显示金额转账,否则延迟该笔存款。</Text>	 
				    	</View>
				     
						 <View style={{paddingTop:10}}>
						  <Text style={{ textAlign: 'center' ,fontSize:18,color:'#012d1f'}}>请转入:{LBdata ?LBdata.uniqueAmount: '加載中'} 元</Text>
						 </View>
                          
						 <View style={{paddingTop:10,alignItems: 'center', 	justifyContent: 'center'}}>
							<Touch style={styles.buttonPayAX} onPress={()=>this.onClose()}> 
							<Text style={{ textAlign: 'center' ,fontSize:16,color:'#fff'}}>我明白了</Text>
							</Touch>
						 </View>

				    </Modal>
					</View>		
			
    )
  }
}


export default(DepositPage);



