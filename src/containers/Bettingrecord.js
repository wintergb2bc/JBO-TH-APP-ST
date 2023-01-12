import React from 'react';
import {Platform,Linking,TouchableHighlight,FlatList,Animated,StyleSheet,WebView ,ScrollView, Text, View, Image,ImageBackground,TouchableOpacity ,Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { DatePicker,Tabs,Checkbox, Radio,Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List} from 'antd-mobile-rn';
import PickerStyle from 'antd-mobile-rn/lib/picker/style/index';
import Touch from 'react-native-touch-once'; 
import Orientation from 'react-native-orientation-locker';

import ModalDropdown from 'react-native-modal-dropdown';

import StickyHeader from 'react-native-stickyheader';


const RadioItem = Radio.RadioItem;
const {
  width ,height
} = Dimensions.get('window')
const TypeName = ["depositT","recordsT","transferT","withdrawalsT"]

 	 
 

 let date = new Date();
 let y = date.getFullYear();
 let m = date.getMonth() + 1;
 m = m < 10 ? ('0' + m) : m;
 let d = date.getDate();
 d = d < 10 ? ('0' + d) : d;
 var h = date.getHours();
 h = h < 10 ? ('0' + h) : h;
 let minute = date.getMinutes();
 let second = date.getSeconds();
 minute = minute < 10 ? ('0' + minute) : minute;
 second = second < 10 ? ('0' + second) : second;
 
  
 
class Records extends React.Component {
	 
	constructor(props) {
	  super(props);
	  this.navigateToScene = this.navigateToScene.bind(this); 
      this.Getrecords = this.Getrecords.bind(this);
			
	    this.state = {
	      Button1:'', 
				Bank:{
					0:{label:"7天",value:7},
					1:{label:"14天",value:14},
					2:{label:"30天",value:30},
					3:{label:"60天",value:60},
					4:{label:"90天",value:90}, 
				},
				TotalBal:'' , 
				IPSB:'' , 
				MAIN:'', 
				LD:'',  
				SLOT:'', 
				SB:'',
				toWallet:{0: "MAIN"},
				payMoney:0,
				isDepositLock: false,
                isWithdrawalLock: false,
				BankData:{0: "" },//單一銀行規則
				NowBankType:"deposit",// 用戶選擇充值銀行
				AppData:this.props,
				payOK:false,
				payHtml:'',
				fromWalletA:'', //主目標帳戶
				toWalletA:'',//目標帳戶總數據
				depositingWallet:'', // 目標帳戶
				isPreferredWalletSet: false, // 是不是首選帳戶
				bonusCouponID:0,  //優惠id
				ID:0,//優惠id
				Bonus:'',//優惠data
				part2Value:1,
				records:'',//交易紀錄data  
				scrollY: new Animated.Value(0),
				push:'',
				WithdrawalData:'',//提款記錄
				TransferB:'',
				TransferA:'',
				Transdata:'',
				days:7,
			 
				
	    } 
			this.data = []
			for (let index = 0; index < 100; index++) {
      this.data.push(index)
    }
		
		
	  }
		
	componentWillMount(props) { 
 
		 
		 Orientation.lockToPortrait(); //鎖定屏幕

		 
		 this.Getrecords(7);
 
  }
		
		 
		 
		componentWillUnmount(){  //離開註銷監聽 
				Orientation.removeOrientationListener(this._onOrientationChange);
				
				if(TypeName.indexOf(this.props.name) != -1){
					  Orientation.unlockAllOrientations();   //解鎖橫豎屏  如果是在遊戲頁面開啟 重新解鎖
				}
				
		}


		_onOrientationChange(curOrt){
	     	Orientation.lockToPortrait();
		}
 
		 
	//跳轉
	navigateToScene(key){
		console.log(key) 
			Actions[key]({}); 
		
	}
	  
	
	 _dropdown_2_renderButtonText(rowData) { 
				 return `${rowData.label}`;
		 }
	
		_dropdown_2_renderRow(rowData, rowID, highlighted) {
			
			//console.log(rowData, rowID, highlighted)
			//let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
			let evenRow = rowID % 2;
			return (
				<TouchableHighlight underlayColor='cornflowerblue'>
					<View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? '#ececec' : 'white'}]}> 
						<Text style={[styles.dropdown_2_row_text, highlighted && {color: '#000'}]}>
							{`${rowData.label}`}
						</Text>
					</View>
				</TouchableHighlight>
			);
		}
	
	 
		
		_dropdown_2_onpress(key){
			 console.log(key) 
			this.Getrecords('Bank','','',key) 
			
		}
		
		
		
	 //查詢 存款 提款 紀錄
	Getrecords(day){
 
		 
		 //查询中,请稍候
		Toast.loading('กำลังโหลด...',200);
		fetchRequest(ApiPort.UserBetHistory+"?days="+day+"&", 'GET')
				.then(data => { 
						  Toast.hide();
							 
							if(data.MemberHistory.length > 0){  
							   
							   this.setState({
								records:data
							   })
								   
							}else{
								this.setState({
									records:''
								   })
								Toast.fail('无投注记录', 0.5); 
							} 
					}).catch(error => {
						Toast.hide();
						 
				}) 
	} 
	
	  
	 
		
		
		dayButton = (key) => {   //查詢天數
			this.setState({
				days:this.state.Bank[key].value
			})

			this.Getrecords(this.state.Bank[key].value);
		  console.log(this.state.Bank[key].value)  
       };
		
 
 
	    
	
	 _renderItem = (info) => {
    return (
      <View
        style={{ height: 50, backgroundColor: '#ffffff' }}>
        <Text>{info.item}</Text>
      </View>
    )
  }
  _keyExtractor = (item, index) => {
    return index
  }
	
	

		
	
	
  render () {
		 
		
		const {days,records,WithdrawalData,Bank,BankData} = this.state;
	  
		
		 
    return (
		
		  <View style={{flex:1,top:2}}>
			  <Flex style={{bottom:1,paddingTop:5,paddingBottom:5, borderBottomWidth: 1,  borderColor: '#363636',}}> 
						        	<Flex.Item style={{flex:0.5}}>
						        	<Text style={{fontSize:14,paddingLeft:16,color:'#fff'}}>查询天数</Text>
						        	</Flex.Item>
						        	
						        	<Flex.Item alignItems='flex-end'  style={{flex:0.5,right:15}}> 
						        	{Bank != "" && 
											
						        	<ModalDropdown ref={el => this._dropdown_3 = el}  
						        			defaultValue={days+'天'}
						        			textStyle={styles.dropdown_2_text}
						        			dropdownStyle={styles.dropdown_2_dropdown}
						        			options={Bank}
						        			renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
						        			renderRow={this._dropdown_2_renderRow.bind(this)} 
						        			onSelect={this.dayButton}
						        		/> 
											 
						        	}
											  
						        </Flex.Item>
										   
									   
									  

						        </Flex>
										 
                    
										 
										  <ScrollView
												style={{ flex: 1 }}
												automaticallyAdjustContentInsets={false}
												showsHorizontalScrollIndicator={false}
												showsVerticalScrollIndicator={false}
											>
										 {records =="" ?
												<View style={{width:width,padding:20}}><Text style={{textAlign: 'center',color:'#fff'}}>无投注记录</Text></View>
											
											:records !="" && records.MemberHistory.map((item,i) => { 

										 						return (
																
										 					 <View style={{paddingTop:8}}>
															 
															 <Flex> 
															 
															 <Flex.Item style={{padding:1,backgroundColor: '#00805a'}}>
															 </Flex.Item>
															 
															 </Flex>

														    {/* <Flex style={styles.records}>  
																
														    	<Flex.Item style={styles.recordTextL}>
														    		<Text style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{i} - 投注日期</Text>
														    	</Flex.Item>
														    	
														    <Flex.Item style={styles.recordTextR}>
														    		<Text selectable={true} style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{item.BetTime}</Text>
														    	</Flex.Item>
														    	
														    </Flex> */}
																
																
																<Flex style={styles.records}> 
																	<Flex.Item style={styles.recordTextL}>
																		<Text style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>游戏</Text>
																	</Flex.Item>
																	
																	<Flex.Item style={styles.recordTextR}>
																		<Text selectable={true} style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{item.ProductName}</Text>
																	</Flex.Item> 
																</Flex>
																
																<Flex style={styles.records}> 
																	<Flex.Item style={styles.recordTextL}>
																		<Text style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>投注金额</Text>
																	</Flex.Item>
																	
																	<Flex.Item style={styles.recordTextR}>
																		<Text selectable={true} style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{item.TurnOverAmount} 元</Text>
																	</Flex.Item>
																	
																</Flex>
																

																{item.Win != 0 &&  
																<Flex style={styles.records}> 
																	<Flex.Item style={styles.recordTextL}>
																		<Text style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>赢/输</Text>
																	</Flex.Item>
																	
																	<Flex.Item style={styles.recordTextR}>
																		<Text selectable={true} style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{item.Win} 元</Text>
																	</Flex.Item>
																	
																</Flex> 
																 }

															{item.Loss != 0 &&   
																<Flex style={styles.records}> 
																	<Flex.Item style={styles.recordTextL}>
																		<Text style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>赢/输</Text>
																	</Flex.Item>
																	
																	<Flex.Item style={styles.recordTextR}>
																		<Text selectable={true} style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{item.Loss} 元</Text>
																	</Flex.Item>
																	
																</Flex>
														  }

										 {item.Win == 0 &&  item.Loss == 0 && 
												<Flex style={styles.records}> 
												<Flex.Item style={styles.recordTextL}>
													<Text style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>赢/输</Text>
												</Flex.Item>
												
												<Flex.Item style={styles.recordTextR}>
													<Text selectable={true} style={{textAlign: 'left',color:"#000",fontSize:12,fontWeight:'bold'}}>{item.Win} 元</Text>
												</Flex.Item>
												
											</Flex> 

													}


 
																
																 
														 </View>

																
										 											)
										 									})
										  }
									 
									      </ScrollView>
				
				
				   
		 </View>
			 
    )
		
  }
	
		_dropdown_3_show() {
		this._dropdown_3 && this._dropdown_3.show();
	}
		befosDate = (key) => {
				
		this.DateMsg('befosDate',key)
	
		}
		_dropdown_4_show() {
			this._dropdown_4 && this._dropdown_4.show();
		}
		
	
		_dropdown_5_show() {
		this._dropdown_5 && this._dropdown_5.show();
	}
		befosDate = (key) => {
				
		this.DateMsg('befosDate',key)
	
		}
		_dropdown_6_show() {
			this._dropdown_6 && this._dropdown_6.show();
		}
		
}




export default(Records);


const styles=StyleSheet.create({  

	dropdown_2_text: {
		marginVertical: 7,
		marginHorizontal: 6,  
		fontSize: 15,
		color: '#fff',
		textAlign: 'center',
		textAlignVertical: 'center',
	  },
	  dropdown_2_dropdown: {
		  width:80,
		  height:203,
		borderRadius: 1,
			shadowOffset: {width: 0, height: 4},
			shadowOpacity: 1,
			shadowRadius: 5,
			shadowColor: "#666",
			//注意：这一句是可以让安卓拥有灰色阴影
			elevation: 4,
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
		paddingLeft:10,
		fontSize: 14,
		color: '#000',
		textAlign:'center', 
	  },
	  dropdown_2_separator: {
		height: 1,
		backgroundColor: '#cbcbcb',
	  },
	  records:{
		 
		paddingLeft:14,
		borderBottomWidth: 1,
		borderColor: '#919191',
		backgroundColor:"#fff",
	},
	
	recordTextL:{
		flex:0.4,
		borderRightWidth: 1, 
		borderColor: '#cfcfcf',
		paddingTop:12,
		paddingLeft:10,
		paddingBottom:12,
	}, 
	
	recordTextR:{
		flex:1,
		paddingTop:12,
	   paddingLeft:14,
		paddingBottom:12,
	}, 
	
	
})