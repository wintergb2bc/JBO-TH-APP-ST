import React from 'react';
import { StyleSheet,Clipboard ,Text, View,Animated,TouchableOpacity,ScrollView ,Dimensions,Platform,ImageBackground} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {  Carousel,WhiteSpace,Modal, WingBlank ,Flex,Toast,InputItem,Picker,List,Button} from 'antd-mobile-rn';
import Orientation from 'react-native-orientation-locker';
import styles from './bankStyle';
import Touch from 'react-native-touch-once';
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index';
const {
  width ,height
} = Dimensions.get('window')


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
 
 
const TextStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        TextStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
        if (key === 'input') {
            TextStyle[key].fontSize = 13;
            // TextStyle[key].fontWeight = 'bold';
            TextStyle[key].color = '#fff'; 
		}  
		TextStyle[key].borderBottomColor = '#1a1a1a';
    }
}

let TimeV1;
class DepositPage extends React.Component {
	 
	constructor(props){
	    super(props);
			this.state ={
				loadD:false,
				data:this.props.data,
				BaDB:this.props.data.BankData.bankAccounts[this.props.data.userBankD],
				Bapay:this.props.data.NowBankType != 'WCLB' ? this.props.NowData.transferType.Code :'',
				LBdata:this.props.data.LBdata,
				NowData:this.props.data.NowData,
				NowBankType:this.props.data.NowBankType,
				carNumber:'',
				userButton:false,
				visible:false,
				TimeLoad:'30:00',
			} 
	  }
		
	componentWillMount(props) {
       Orientation.lockToPortrait();
			 console.log('AAA',this.props)
			 let ST =this.state.data; 
		   
			 if(this.props.data.NowBankType != "WCLB"){
				 if(this.props.NowData.transferType.Code == "Alipay"){ 
				 		this.setState({
				 			visible:true
				 		}) 
				 }
			 }
        
			 if(this.props.data.NowBankType == "WCLB"){ 
				 	this.setState({
				 		visible:true
				 	}) 
			 } 

			 if(this.props.data.NowBankType =='ALB'){
				 this.TimeDown();
			 }
	  } 
	
	  componentWillUnmount() {
		//離開註銷監聽 
		    TimeV1 &&clearInterval(TimeV1) 
	  }

	closeModal() {
		Actions.pop();
	}


	TimeDown(){   ///支付寶倒計時
		var m = 29;  //分
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


		ALBREadyClose(){
			TimeV1 &&clearInterval(TimeV1) 
									  setTimeout(() => {
											 Toast.hide();
											 Actions.pop();
										 }, 500); 	 		
										 setTimeout(()=>{
											Actions.recordsTx({});
											}, 1000) 
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
				if(this.props.QRCODE){ 
					data ={
						//"HasQR": true,
						"depositingBankAcctNum": this.state.carNumber
					}  
				}else{
					data ={
						"depositingBankAcctNum": this.state.carNumber
					} 
				} 
			}  
		}else{

			if(this.props.QRCODE){ 
				data ={
					//"HasQR": true,
					"depositingBankAcctNum": ST.BaDB.AccountNo.substr(ST.BaDB.AccountNo.length-6)
				}  
			}else{
				data ={
					"depositingBankAcctNum": ST.BaDB.AccountNo.substr(ST.BaDB.AccountNo.length-6)
				} 
			} 
			   
		}
 

		fetchRequest(ApiPort.GopayLB+LBdata.transactionId+'/ConfirmStep?', 'POST',data)
				.then(data => {
									 
					  
						if(data.isSuccess == true){

							if(ST.NowBankType == 'ALB' ){ 
								Actions.pop();  
								setTimeout(() => {
									this.AlipayDone();
								}, 1000); 	 	

							}else{
								TimeV1 &&clearInterval(TimeV1) 
								Toast.success('订单成立', 3); 
							 
								setTimeout(() => {
									 Toast.hide();
							         Actions.pop();
								 }, 3000); 	 		
								 
								 setTimeout(()=>{
									Actions.recordsTx({});
									}, 4000) 
							}
						

						}else if(data.errorMessage == "ConfirmStep_Failed"){
							Toast.fail('账号错误,请重新输入', 2); 
						}else{
							Toast.fail(data.errorMessage, 2); 
						}
						 
						//Actions.pop();
					}).catch(error => {
								//Toast.hide();
						 
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


	AlipayDone(){
		const {loadD,BaDB,Bapay,data,LBdata,NowData,NowBankType} = this.state;
		Actions.AlbQrcode({ data: this.state, LBdata: LBdata, NowData: NowData,ALBPlay:true}); 
	}


	
  render () {
		 
		
		const {loadD,BaDB,Bapay,data,LBdata,userButton,NowBankType,TimeLoad} = this.state;
	    const footerButtons = [ 
           { text: '我明白了', onPress: () => console.log('ok') },
         ];
    return (
		    <View style={{backgroundColor: '#1a1a1a',width:width,height:height,paddingTop:Platform.OS === "android" ? 0 :35}}>
				<ImageBackground
					style={{ width: width, height: height, flex: 1 }}
					resizeMode="repeat"
					source={require("../../images/home/pattern.png")}
				>
				   {NowBankType != 'ALB'   &&  
		      	   <ScrollView
									style={{ flex:1}}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
								>
								
						
						<Flex style={styles.LBList}>
						  
						 <Flex.Item style={{paddingBottom:10}}>
						 	<Text style={styles.colorWhite}>交易生成时间：</Text> 
						 </Flex.Item>
						 
						 <Flex.Item alignItems='flex-end' style={{paddingBottom:10,right:27}}>
						 
						 	<Text style={styles.colorWhite}>{LBdata ? LBdata.submittedAt.split("T").join("  ").split('.')[0] : 'กำลังโหลด'}</Text> 
						 </Flex.Item>
						  
							
						</Flex>
						
						<Flex style={styles.LBList}>
						  
						 <Flex.Item style={{paddingBottom:14}}>
						 	<Text style={{fontSize:14,color:'#00b324'}}>请在 30 分钟内完成支付，或者系统自动延迟交易</Text> 
						 </Flex.Item>
						 
					 
							
						</Flex>						
								 
							<Flex style={styles.LBList2}>
								
								<Flex.Item>
								<Text style={styles.colorWhite}>温馨提醒：</Text> 
								</Flex.Item>
								  
							</Flex>	
              

              <Flex style={styles.LBList2}>
								
								<Flex.Item style={{top:-3}}>
								<Text style={styles.colorWhite}>1.请务必按照系统提示的银行进行存款，否则您的存款将无法及时到账。</Text> 
								</Flex.Item>
								 
							</Flex>	

               <Flex style={styles.LBList}>

            	 <Flex.Item style={{top:-3,paddingBottom:14}}>
							 <Text style={styles.colorWhite}>2.存款后，点击[完成]耐心等待到账，为了保证及时到账，请勿重复提交存款信息。</Text> 
							 </Flex.Item>

            </Flex>
 
						<Flex style={{paddingLeft:14,paddingTop:14,backgroundColor:"#00b324",borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
						
														<Flex.Item style={{paddingBottom:14}}>
															<Text style={styles.colorWhite}>我们的收款账户：</Text> 
														</Flex.Item> 
						</Flex>	 
						
				 
				          <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
				          
				          								<Flex.Item style={{paddingBottom:14}}>
				          									<Text style={styles.colorWhite}>银行名称：</Text> 
				          								</Flex.Item>
				          								
				          								<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
				          								 
				          									<Text style={styles.colorWhite} selectable={true}>{BaDB.BankName}</Text> 
				          								</Flex.Item> 
				           </Flex>		 
								 
								 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
								 
								 								<Flex.Item style={{paddingBottom:14}}>
								 									<Text style={styles.colorWhite}>账户姓名:</Text> 
								 								</Flex.Item>
								 								
								 								<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
								 								
								 									<Text style={styles.colorWhite} selectable={true}>{BaDB.AccountHolderName}</Text> 
								 								</Flex.Item> 
								 </Flex>
								 
								 
								
								 
								 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
								 
								 							<Flex.Item style={{paddingBottom:14}}>
								 								<Text style={styles.colorWhite}>银行帐号：</Text> 
								 							</Flex.Item>
								 							
								 							<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
								 							
								 								<Text   selectable={true} style={{fontSize:14.5,fontWeight:'bold',color:'#00b324'}}>{BaDB.AccountNo}</Text>
								 							</Flex.Item>
								 								
								 </Flex>
								 
								 
								 {NowBankType == 'WCLB' && 

								 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
								 
								 						<Flex.Item style={{paddingBottom:14}}>
								 							<Text style={styles.colorWhite} >省 / 自治区：</Text> 
								 						</Flex.Item>
								 						
								 						<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
								 						
								 							<Text style={styles.colorWhite} selectable={true}>{BaDB.Province}</Text>
								 						</Flex.Item>
								 							
								 </Flex>
								 }
								 {NowBankType == 'WCLB' &&

								 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
								 
								 						<Flex.Item style={{paddingBottom:14}}>
								 							<Text style={styles.colorWhite}>城市 / 城镇：</Text> 
								 						</Flex.Item>
								 						
								 						<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
								 						
								 							<Text  style={styles.colorWhite} selectable={true}>{BaDB.City}</Text>
								 						</Flex.Item>
								 							
								 </Flex>
								 }

								 {NowBankType == 'WCLB' &&
 
								 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
								 
								 						<Flex.Item style={{paddingBottom:14}}>
								 							<Text style={styles.colorWhite} >分行：</Text> 
								 						</Flex.Item>
								 						
								 						<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
								 						
								 							<Text style={styles.colorWhite} selectable={true}>{BaDB.Branch}</Text>
								 						</Flex.Item>
								 							
								 </Flex>
								 } 
								  
								  <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
								             
								 								<Flex.Item alignItems='center' style={{paddingBottom:14}}>
																<TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  onPress={()=>this.uClick()}> 

								 									<Text style={{fontSize:14,color:'#00b324'}}>您存错账号了吗？</Text> 
																	</TouchableOpacity>
																	
								 								</Flex.Item> 
								 </Flex>
								 
								 
								 {userButton == true &&
									 
									 <Flex style={{paddingLeft:14,paddingTop:3,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}>  
									 					<Flex.Item style={{flex:0.2}}>
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
								 
							 
							 	<Flex style={{paddingLeft:14,paddingTop:14,backgroundColor:"#00b324",borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
							 	
							 									<Flex.Item style={{paddingBottom:14}}>
							 										<Text style={styles.colorWhite}>您的存款信息：</Text> 
							 									</Flex.Item>
							 								
							 										
							 	</Flex>	
							 	
							 	
							     {NowBankType != 'WCLB' && 
							 				<Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
							 				
							 												<Flex.Item style={{paddingBottom:14}}>
							 													<Text style={styles.colorWhite}>支付类型:</Text> 
							 												</Flex.Item>
							 												
							 												<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
							 													
							 													<Text style={styles.colorWhite} selectable={true} selectable={true}>{LBname[Bapay]}</Text> 
							 												</Flex.Item>
							 													
							 					</Flex>		
							 			}	
							 				{NowBankType != 'WCLB' && 
							 				<Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
							 				
							 											<Flex.Item style={{paddingBottom:14}}>
							 												<Text style={styles.colorWhite}>存款人姓名:</Text> 
							 											</Flex.Item>
							 											
							 											<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
							 											
							 												<Text style={styles.colorWhite} selectable={true}>{data.userName}</Text> 
							 											</Flex.Item>
							 												
							 				</Flex>
							 				}	

							 				
							 				<Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
							 				
							 											<Flex.Item style={{paddingBottom:14}}>
							 												<Text style={styles.colorWhite}>存款金额：</Text> 
							 											</Flex.Item>
							 											
							 											<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
							 											
							 												<Text selectable={true} style={{color:'#00b324',fontSize:18,fontWeight:'bold'}}>{LBdata ?LBdata.uniqueAmount: 'กำลังโหลด'}</Text> 
							 											</Flex.Item>
							 												
							 				</Flex>
							     
									 
									 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
									 
									 							<Flex.Item style={{paddingBottom:14}}>
									 								<Text style={styles.colorWhite}>目标账户：</Text> 
									 							</Flex.Item>
									 							
									 							<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
									 							
									 								<Text style={styles.colorWhite} selectable={true}>{Bankname[data.depositingWallet]}</Text> 
									 							</Flex.Item>
									 								
									 </Flex>
									 
									 <Flex style={{paddingLeft:14,paddingTop:14,borderBottomWidth: 0.2,  borderColor: '#d2d2d2'}}> 
									 
									 							<Flex.Item style={{paddingBottom:14}}>
									 								<Text style={styles.colorWhite}>所参与红利优惠：</Text> 
									 							</Flex.Item>
									 							
									 							<Flex.Item alignItems='flex-end' style={{paddingBottom:14,right:27}}>
									 							
									 								<Text style={styles.colorWhite} selectable={true}>{data.ID == 0 ? '没有参与优惠':LBdata.bonusApplicationMessage}</Text> 
									 							</Flex.Item>
									 								
									 </Flex>
							 
					
								<WhiteSpace size="lg" />
								
								<WhiteSpace size="lg" />
								<WhiteSpace size="lg" />

 
						 
						 </ScrollView>  
						}



						 	{/** 支付寶轉帳 */}
			{NowBankType == 'ALB'   &&  
				
			
				<ScrollView
							   style={{ flex:1,marginTop:20}}
							   automaticallyAdjustContentInsets={false}
							   showsHorizontalScrollIndicator={false}
							   showsVerticalScrollIndicator={false}
						   >
						   
				   
				   
				   
				   <Flex style={styles.ALBList}align="center">
					 
					<Flex.Item style={{paddingBottom:14}}>
						<Text style={{fontSize:14,color:'#ff0000',textAlign:'center'}}>请在 {TimeLoad} 分钟内完成支付，或者系统自动延迟交易</Text> 
					</Flex.Item>
					
				
					   
				   </Flex>						
							 

				   <Flex style={styles.alipaySTY}align="center"> 
																	<Flex.Item>
																		<Text style={{color:'#fff'}}>存款金额：</Text> 
																	</Flex.Item>
																	
																	<Flex.Item style={{left:-20}}> 
																		<Text selectable={true} style={{color:'#1AFF00',fontSize:18,fontWeight:'bold',textAlign:'left'}}>{LBdata ?LBdata.uniqueAmount: '加載中'}</Text> 
																	</Flex.Item>

																	<Flex.Item alignItems='flex-end' style={{paddingRight:10}}> 
																	   <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  onPress={()=> Clipboard.setString(LBdata.uniqueAmount+'')}> 

																		<View style={{backgroundColor:'#0D7F00',padding:5,borderRadius:12,paddingLeft:15,paddingRight:15}}>
																		<Text selectable={true} style={{color:'#fff',fontSize:14,fontWeight:'bold',textAlign:'left'}}>复制</Text> 
																		</View>

																     	</TouchableOpacity>
																	</Flex.Item>
																		
										</Flex>
							

					 <Flex style={styles.alipaySTY}align="center"> 
					 
													 <Flex.Item>
													 <Text style={{color:'#fff'}}>银行名称：     {BaDB.BankName}</Text> 
														 
													 </Flex.Item>
													  

					  </Flex>		 
							
					  <Flex style={styles.alipaySTY}align="center"> 
															<Flex.Item>
															  <Text style={{color:'#fff'}}>账户姓名:</Text> 
															</Flex.Item>
															
															<Flex.Item style={{left:-20}}> 
															
																<Text style={{color:'#fff'}} selectable={true}>{LBdata.returnedBankDetails.accountHolderName}</Text> 
															</Flex.Item> 

															<Flex.Item alignItems='flex-end' style={{paddingRight:10}}> 
																	   <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  onPress={()=> Clipboard.setString(LBdata.returnedBankDetails.accountHolderName+'')}> 

																		<View style={{backgroundColor:'#0D7F00',padding:5,borderRadius:12,paddingLeft:15,paddingRight:15}}>
																		<Text selectable={true} style={{color:'#fff',fontSize:14,fontWeight:'bold',textAlign:'left'}}>复制</Text> 
																		</View>

																     	</TouchableOpacity>
																	</Flex.Item>
							</Flex>
							
							
						   
							
							<Flex style={styles.alipaySTY}align="center"> 
														<Flex.Item style={{flex:0.45}}>
														   <Text style={{color:'#fff'}}>银行帐号：</Text> 
														</Flex.Item>
														
														<Flex.Item style={{flex:1}}> 
															
															<Text selectable={true} style={{fontSize:14,fontWeight:'bold',color:'#fff'}}>{LBdata.returnedBankDetails.accountNumber}</Text>
														</Flex.Item>

														<Flex.Item alignItems='flex-end' style={{flex:0.5,paddingRight:10}}> 
																	   <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  onPress={()=> Clipboard.setString(LBdata.returnedBankDetails.accountNumber+'')}> 

																		<View style={{backgroundColor:'#0D7F00',padding:5,borderRadius:12,paddingLeft:15,paddingRight:15}}>
																	    	<Text selectable={true} style={{color:'#fff',fontSize:14,fontWeight:'bold',textAlign:'left'}}>复制</Text> 
																		</View>

																     	</TouchableOpacity>
																	</Flex.Item>
															
							</Flex>
							
						 
							 
							 
							 <Flex style={styles.alipaySTY}align="center"> 
															<Flex.Item alignItems='center'>
														   <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}  onPress={()=>this.uClick()}> 

																<Text style={{fontSize:14,color:'#00b324'}}>您存错账号了吗？</Text> 
															   </TouchableOpacity>
															   
															</Flex.Item>
															
							</Flex>
							
							
							{userButton == true &&
							 <Flex style={styles.alipaySTY}align="center"> 
							 				<Flex.Item style={{flex:0.2}}>
														 <Text style={{color:'#fff'}}>旧账号:</Text> 
													</Flex.Item>
													
													<Flex.Item style={{flex:0.8}}>
													<InputItem
													clear
													type="number"
													value={this.state.carNumber}
													styles={StyleSheet.create(TextStyle)}
													onChange={(value: any) => {
														this.setState({
															carNumber: value,
														});
													}}
													placeholderTextColor="#969696"
													placeholder="请输入存入旧账号的最后6位号码"
												>
												
												</InputItem>
												</Flex.Item> 	
								</Flex>
								
							}
						   
							 
						   <WhiteSpace size="lg" />
 
					</ScrollView>  

				   }  

			 
					    <Flex style={{top:Platform.OS === "android" ? 0:-35,paddingBottom:25}}>
						 		<Flex.Item alignItems='center' style={{backgroundColor: '#00b324',width:width}}>	
						 		<Touch onPress={()=>this.gopay()} style={{width:width}}>
								 	<Text style={{ color: "#fff", fontSize: 16, fontWeight: 'bold', textAlign: 'center',lineHeight:45}}>ยืนยัน</Text>
						 		</Touch>
						 		</Flex.Item>
						 </Flex> 
			 


						</ImageBackground>
				    	<Modal 
				    	transparent
				    	onClose={this.onClose}
				    	maskClosable
						visible={this.state.visible} 
						style={{width:300,margin:0}}
				    >    
						<View style={{top:-21,left:-50,width:width,height:40,backgroundColor:'#00b324',alignItems: 'center',justifyContent: 'center' }}> 
				    	  <Text style={{ textAlign: 'center' ,fontSize:16,color:"#fff",fontWeight:'bold'}}>{NowBankType != 'WCLB' ? "支付宝转账" : "微信转账"} </Text> 
				    	</View>
 
				    	<View style={{ borderBottomWidth: 0.4, paddingBottom:20, borderColor: '#d2d2d2' }}> 
				    	 <Text style={{ textAlign: 'center' ,fontSize:14,}}>必须转入系统生成金额才能极速到账。 </Text>
                         <Text style={{ paddingTop:5,textAlign: 'center',fontSize:14, }}>请按显示金额转账,否则延迟该笔存款。</Text>	 
				    	</View>
				     
						 <View style={{paddingTop:10}}>
						 <Text style={{ textAlign: 'center' ,fontSize:18,color:'#00b324'}}>请转入:{LBdata ?LBdata.uniqueAmount: 'กำลังโหลด'} 元</Text>
						 </View>
                          
						 <View style={{paddingTop:10,alignItems: 'center', 	justifyContent: 'center'}}>
						 <Touch hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={{width:220, padding: 8,paddingLeft:14,paddingRight:14,backgroundColor: '#00b324',borderRadius:5 }} onPress={()=>this.onClose()}> 
						 	<Text style={{ textAlign: 'center' ,fontSize:16,color:'#fff'}}>我明白了</Text>
						 </Touch>
						 </View>

				    </Modal>
					</View>		
			
    )
  }
}


export default(DepositPage);



