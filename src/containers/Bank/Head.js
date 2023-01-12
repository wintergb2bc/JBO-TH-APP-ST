import React from 'react';
import { Text, View, Image,ImageBackground,TouchableOpacity ,Dimensions,ScrollView} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Button, Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List} from 'antd-mobile-rn';
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index';
import Touch from 'react-native-touch-once';
import styles from './bankStyle';


const {
  width ,height
} = Dimensions.get('window')

const TypeName = ["bankStatusT", "depositT","recordsT","transferT","withdrawalsT","depositBx"]


const bankImage = {
	"dp": require('../../images/bank/deposits.png'),
	"wt": require('../../images/bank/withdrawals.png'),
	"rp": require('../../images/bank/records.png'),
}


const bankImageHover = {
	"dp": require('../../images/bank/depositActive.png'),
	"wt": require('../../images/bank/withralsActive.png'),
	"rp": require('../../images/bank/recordsActive.png'),
}

class Head extends React.Component {
	
	 
		constructor(props) {
		    super(props);
		    this.Allmoney =this.Allmoney.bind(this);   //全餘額
			this.Transfer = this.Transfer.bind(this) //一鍵轉
			this.TotalBal = this.TotalBal.bind(this)
				
		    this.state = {
					Nowtype:this.props.data,//標籤
					Allmoney:false,//全餘額顯示用
					TotalBal:TotalBal, //帳戶餘額   
					IPSB:IPSB,  //IM體育
					MAIN:MAIN,  //主帳戶
					LD:LD,      //真人
					SLOT:SLOT,  //老虎機
					SB:SB,      //im電競牛
					CMD:CMD, // CMD體育  
					moneyBox:'',
		    } 
		  }
			 
		componentWillMount(props) {  
		    this.TotalBal(); 
		  }
			
	
	//餘額
	TotalBal(){ 
				
						fetchRequest(ApiPort.Balance, 'GET')
							.then(data => { 
								//Toast.hide();
								data.map(function(item, index) {  
									if(item.name == "TotalBal"){
										TotalBal = item.balance
									}else if(item.name == "IPSB"){
										IPSB  = item.balance
									}else if(item.name == "MAIN"){
										MAIN  = item.balance
									}else if(item.name == "LD"){   // LD ＝ 娛樂場 casino
										LD  = item.balance
									}else if(item.name == "SLOT"){
										SLOT  = item.balance
									}else if(item.name == "SB"){
										SB  = item.balance
									}else if(item.name == "CMD"){
										CMD  = item.balance
									}else if(item.name == "PT"){
										PT = item.balance 
									}else if(item.name == "AG"){
										AG =item.balance 
									}
								});
			
								this.setState({ 
									TotalBal:TotalBal,
									moneyBox:data, 
								})		
								
								ReloadMoneyHome(); //刷新餘額 首頁
							  
								if(window.GetMoney){   //刷新個人中心 餘額
									GetMoney();
								}	 
							}).catch(error => {
								Toast.hide();
							})
						 
	}
			
	
	//跳轉
	navigateToScene(key){ 
		console.log(key)
		this.setState({
			Nowtype:key
		})
		this.props.checkcallback(key) 

		if (key == "bankStatusT" || key == "bankStatus"){
			UMonEvent('bankStatusT_banking')
		}else if(key == "depositT" || key == "deposit"){ 
            UMonEvent('Deposit_banking')
        }else if(key == "withdrawalsT" || key == "withdrawals"){
            UMonEvent('Withdraw_banking')
        }else if(key == "transferT" || key == "transfer"){
            UMonEvent('transfer_finmanagement')
        }else if(key == "recordsT" || key == "records"){
			UMonEvent('Transaction History', 'Click', 'TransactionHistory_ BankPage');
        }
        if(key=='Bhistor'){
            UMonEvent('Transactionrecord_banking')
		}
		
	}
	
	Transfer(title){  //一鍵轉
		     
			
				let data =  {
			    "fromAccount":"All",
			    "toAccount": title,
			    "amount": 0,
			    "bonusId": 0,
				"blackBoxValue": Iovation,
				"e2BlackBoxValue": E2Backbox,
			    "bonusCoupon": ""
			    } 
					
					Toast.loading('一键转账中,请稍候...',200);
					fetchRequest(ApiPort.Transfer, 'POST',data)
							.then(data => {
									  Toast.hide();
									  this.TotalBal();
									  setTimeout(()=>{
										TotalBalGlobe();
										}, 2000)  
									  if(data.status == 0){
											Toast.fail(data.messages , 2);
										}else{
											Toast.success(data.messages , 2);
										}
								  
								}).catch(error => { 
									Toast.hide();
									Toast.fail(data.messages , 2); 
							}) 
	}
	
	
	Allmoney(){
		 
		 this.TotalBal(); 
		
		this.setState({
			Allmoney:true
			
		})
		OpenMoney();
	
	} 


	AllmoneyBB(){
		 
			 this.TotalBal(); 
			
			this.setState({
				Allmoney:false 
				
			})
			CloseMoney();

	} 
	
	render () {
		const {TotalBal,Allmoney,Nowtype,balance,moneyBox} = this.state;
		console.log(Nowtype)

		window.ReloadMoney =()=>{
			this.TotalBal();
		}

		window.CloseAllMomey = () => {
			this.AllmoneyBB()
		}

		return (
		
		
		  <View> 
		         <View style={ styles.HeadBackground } >				
				 <View style={{width: 30}} />
					<View><Text style={{color: '#fff',fontSize: 18}}>การเงิน</Text></View>
					<View style={{width: 30}}>
						<TouchableOpacity onPress={() => {Actions.LiveChatST()}}>
						{LivechatDragType == false ?  
								<Image
								resizeMode="stretch"
								//source={require("../../images/home/icon-cs.gif")}
								source={require("../../images/home/icon_cs_new.png")}
								style={{ width: 28, height: 28 }}
							/>
								:LivechatDragType == true &&
								<Image
								resizeMode="stretch"
								source={require("../../images/home/icon-cshover.png")}
								style={{ width: 28, height: 28 }}
							/>
								
								}
						</TouchableOpacity>
					</View>
				

					{/* <View style={{marginLeft:25,marginTop:0}}>
						<Image resizeMode='stretch' source={require('../../images/github-logo.png')}  style={{ width: 95, height: 31}} />
					</View>    */}

					{/* <View style={{alignItems:'flex-end',marginTop:-35,marginRight:20,zIndex:160}}>
						<TouchableOpacity onPress={this.TotalBal.bind(this)}>
						<View style={{flexWrap: 'wrap', display:'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
						

						<View>
							<Text style={{textAlign: 'left',color:"#fff",fontSize:16,fontWeight:'bold',paddingTop:5}}>总余额 {this.state.TotalBal} 元</Text>
						</View>

						<View style={{paddingLeft:20,paddingTop:6}} >
								<Image resizeMode='stretch' source={require('../../images/icon_lib_refresh1.png')} style={{ width: 15, height: 15}} />
						</View>
						
						</View>
						</TouchableOpacity>
					</View> */}
										
				</View>
				{/* <View style={[styles.HeadBackground,{backgroundColor: '#000'}]}>
					<View>
						<Text style={{color: '#fff'}}>总余额</Text>
					</View>
					<View style={{flexDirection: 'row',alignItems: 'center'}}>
						<Text style={{color: '#fff698',paddingRight:5}}>{this.state.TotalBal}</Text>
						<Touch onPress={this.TotalBal.bind(this)}>
							<Image resizeMode='stretch' source={require('../../images/user/refresh.png')} style={{ width: 23, height: 23}} />
						</Touch>
					</View>
				</View> */}
				{console.log(Nowtype,'!!!', TypeName.indexOf(Nowtype),this.props)}
				{ (TypeName.indexOf(Nowtype) == -1 || TypeName.indexOf(Nowtype) == 5 )&&					
					<Flex style={{backgroundColor: "#000"}}>
						<Flex.Item alignItems='center' style={styles.buttonB}>
							<TouchableOpacity  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => { TypeName.indexOf(Nowtype) != -1 ?  this.navigateToScene('bankStatusT') :this.navigateToScene('bankStatus')  }}>	
								<View style={{    flexWrap: 'wrap',  display:'flex', flexDirection: 'row',}}>
								<Text style={[Nowtype == '_bankStatus' ||Nowtype == 'bankStatus' ? styles.HeadnohaveHove :styles.Headnohave ]}>สถานะธนาคาร</Text> 
								</View>
							</TouchableOpacity>
							<View style={[Nowtype == '_bankStatus' ||Nowtype == 'bankStatus' ?styles.buttonBVHover:'']}></View>
						</Flex.Item>

						<Flex.Item alignItems='center' style={styles.buttonB1}>
							<TouchableOpacity  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => { TypeName.indexOf(Nowtype) != -1 ?  this.navigateToScene('depositT') :this.navigateToScene('deposit')  }}>	
								<View style={{    flexWrap: 'wrap',  display:'flex', flexDirection: 'row',}}>
								<Text style={[Nowtype == '_deposit' ||Nowtype == 'deposit' ? styles.HeadnohaveHove :styles.Headnohave ]}>ฝากเงิน</Text> 
								</View>
							</TouchableOpacity>
							<View style={[Nowtype == '_deposit' ||Nowtype == 'deposit' ?styles.buttonBVHover:'']}></View>
						</Flex.Item>
						
						<Flex.Item alignItems='center' style={styles.buttonB}>
							<TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => {TypeName.indexOf(Nowtype) != -1 ? this.navigateToScene('withdrawalsT') : this.navigateToScene('withdrawals')}}>   		
							
							<View style={{    flexWrap: 'wrap',  display:'flex', flexDirection: 'row',}}>
							<Text style={[Nowtype == '_withdrawals' ||Nowtype == 'withdrawals' ? styles.HeadnohaveHove :styles.Headnohave ]}>ถอนเงิน</Text> 
							</View>
							</TouchableOpacity>
							<View style={[Nowtype == '_withdrawals' ||Nowtype == 'withdrawals' ?styles.buttonBVHover:'']}></View>
						</Flex.Item>
												
						<Flex.Item alignItems='center' style={styles.buttonB}>
							<TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} onPress={() => {TypeName.indexOf(Nowtype) != -1 ? this.navigateToScene('recordsT'):this.navigateToScene('records')}}>   		
							<View style={{    flexWrap: 'wrap',  display:'flex', flexDirection: 'row',}}>
							<Text style={[Nowtype == '_records' ||Nowtype == 'records' || TypeName.indexOf(Nowtype) == 5 ? styles.HeadnohaveHove :styles.Headnohave ]}>ประวัติ</Text> 
							</View>
							</TouchableOpacity>
							<View style={[Nowtype == '_records' ||Nowtype == 'records' || TypeName.indexOf(Nowtype) == 5 ? styles.buttonBVHover:'']}></View>
						</Flex.Item>
					</Flex>					
				}
							 									
		 	</View>	
										
		)
		
	}
	
}

export default(Head);


