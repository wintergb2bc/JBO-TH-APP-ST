import React from 'react';
import {Platform,Linking,TouchableHighlight,FlatList,Animated,StyleSheet,WebView ,ScrollView, Text, View, Image,ImageBackground,TouchableOpacity ,Dimensions} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { DatePicker,Tabs,Checkbox, Radio,Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List, Modal} from 'antd-mobile-rn'; 
 
import Orientation from 'react-native-orientation';

import ModalDropdown from 'react-native-modal-dropdown';
 
import ListItems from 'antd-mobile-rn/lib/list/style/index.native';
 const newStyleHistore = {};
 for (const key in ListItems) {
   if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
	 // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
	 newStyleHistore[key] = { ...StyleSheet.flatten(ListItems[key]) }; 
	 newStyleHistore[key].color = '#000';
	 newStyleHistore[key].fontSize = 12
	 newStyleHistore[key].opacity =0;
	 newStyleHistore[key].top =1;
	 newStyleHistore[key].width = width;
	 newStyleHistore[key].height = 40;
	 newStyleHistore[key].backgroundColor = "#0a0a0a"
	 
	 
   }
 }

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
 
  
 const TITLEX = {
	   MAIN:"主账户 (MAIN)",
		 SLOT:"老虎机 (SLOT)",
	   IPSB:"IM体育平台",
		 CMD:"CMD体育平台",
		 SB:"IM电竞牛",
		 LD:"真人娱乐 (CASINO)",
		 WITHDRAWING:"提款",
 }

 
 let KL = '/'

 
class Records extends React.Component {
	
	
	constructor(props) {
	    super(props);
			this.navigateToScene = this.navigateToScene.bind(this); 
	  this.Getrecords = this.Getrecords.bind(this);
			
	    this.state = {
	      Button1:'', 
				Bank:'',
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
				NowData:[
					{ value: y, label: y },
					{ value: y-1, label: y-1 },
					{ value: y-2, label: y-2 },
				], 
				Transdata:'',
				befosDate:'', 
				filterYear:y,
				filterMonth:m,
				OneName: '',//验证名字
				TwoPhone: '',//验证手机
				TreeAddress:'',//验证地址
				FourEmail:'',//验证邮箱
				GotoVerifie: false,
				userInfoData: '',
				phoneNumber: '',
				emailNumber: '',

				toWalletA:{
					0:{label:"全部账户",value:0},
					1:{label:"主账户 (MAIN)",value:999},
					2:{label:"IM体育平台",value:111},
					3:{label:"CMD体育平台",value:151},
					4:{label:"体育 (BTi, IPES)",value:146},
					5:{label:"真人娱乐 (CASINO)",value:150}, 
					6:{label:"老虎机 (SLOT)",value:124}, 
				},//目標帳戶總數據 
				DatePickers: new Date(),
				
	    } 
			this.data = []
			for (let index = 0; index < 100; index++) {
			this.data.push(index)
			}
		 
	  }
		
	componentWillMount(props) { 
  
		 Orientation.lockToPortrait(); //鎖定屏幕
		  
		 let moneyS= ['1','2','3','4','5','6','7','8','9','10','11','12']
 
		   
			 this.state.befosDate = moneyS.map(function (item, key) {
				 return { value: item, label: item }
			 });
 
       
		 this.setState({
			befosDate:this.state.befosDate
		 })
		 
         this.GetPaymentFirst();
		// this.GetWallets();
 
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
 
		
	//獲取數據	
	GetPaymentFirst(key){

		if(!key){
			key =0
		}

		const {filterYear ,filterMonth } = this.state;
		
			fetchRequest(ApiPort.BonusApplications+'?wallet='+key+'&bonusStatus=0&filterYear='+filterYear+'&filterMonth='+filterMonth+'&', 'GET')
					.then(data => { 
								//	Toast.hide();
					  	
						  
						  this.setState({
							Transdata:data?.historyList
						  })

			    	}).catch(error => {
									//Toast.hide();
					   	 	
					}) 
	}	
	
	
 //獲取目標帳戶 
 
 GetWallets(){
 	
 	fetchRequest(ApiPort.Wallets, 'GET')
 			.then(data => {
 								
 						//	Toast.hide();
 					
 					fromWalletBox = data.fromWallet; 
 					toWalletBox = data.toWallet;
 					
 					this.state.fromWalletA = data.fromWallet.map(function (item, key) {
 						return { value: item.key, label: item.name }
 					});
 					
 					
 					this.state.toWalletA = data.toWallet.map(function (item, key) {
 						return { value: item.key, label: item.name }
 					});
 					
					this.setState({ 
						toWalletA:this.state.toWalletA,
					}) 
					
 					
 				
 				}).catch(error => {
 							//Toast.hide();
 					
 							
 							
 			})
 			
 			
 }
	 
	//跳轉
	navigateToScene(key){
		console.log(key) 
			Actions[key]({}); 
		
	}
	 
 
	_dropdown_1_renderButtonText(rowData) { 
		return `${rowData.label}`;
}
	
	 _dropdown_2_renderButtonText(rowData) { 
				 return `${rowData.label+'月'}`;
		 }

		 _dropdown_yea_renderButtonText(rowData) { 
			return `${rowData.label+'年'}`;
	}

	
		_dropdown_2_renderRow(rowData, rowID, highlighted) {
			
			//console.log(rowData, rowID, highlighted)
			//let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
			let evenRow = rowID % 2;
			return (
				<TouchableHighlight underlayColor='cornflowerblue'>
					<View style={[styles.dropdown_2_row, {backgroundColor: evenRow ? '#171717' : '#0e7e00'}]}> 
						<Text style={[styles.dropdown_2_row_text, highlighted && {color: '#fff'}]}>
							{`${rowData.label}`} 
						</Text>
					</View>
				</TouchableHighlight>
			);
		}
	
	 
		_dropdown_3_renderRow(rowData, rowID, highlighted) {

			console.log(rowData, rowID, highlighted)
	
			let moneyDB = ''
	
			if (rowData.value == "MAIN") {
				moneyDB = MAIN + '元'
			} else if (rowData.value == "IPSB") {
				moneyDB = IPSB + '元'
			} else if (rowData.value == "SLOT") {
				moneyDB = SLOT + '元'
			} else if (rowData.value == "CMD") {
				moneyDB = CMD + '元'
			} else if (rowData.value == "SB") {
				moneyDB = SB + '元'
			} else if (rowData.value == "LD") {
				moneyDB = LD + '元'
			}
	
			//let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
			let evenRow = rowID % 2;
			return (
	
				<Flex style={{ width: 350, backgroundColor: "#fff", }}>
	
					<Flex.Item style={[styles.dropdown_2_row, { flex: 1, paddingLeft: 14, paddingTop: 3, backgroundColor: evenRow ? '#171717' : '#0e7e00' }]}>
						<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
							{`${rowData.label}`}
						</Text>
	
					</Flex.Item>
	
					<Flex.Item alignItems='flex-end' style={[styles.dropdown_2_row, { flex: 0.5, paddingBottom: 10, backgroundColor: evenRow ? '#171717' : '#0e7e00' }]}>
						<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
							{`${moneyDB}`}
						</Text>
					</Flex.Item>
	
	
	
	
				</Flex>
	
	
	
			);
		} 
		
		_dropdown_2_onpress(key){
			 console.log(key) 
			this.Getrecords('Bank','','',key)  
		}
		
		
		
	 //查詢 存款 提款 紀錄
	Getrecords(title,item,beitem,bankname){
		  
		if(bankname == undefined){
			bankname =""
		}
		
	let nowDate =this.state.nowDate;
	let befoDate = this.state.befosDate;
	  
		if(title == 'nowDate'){
			nowDate = item	  
		}else if(title == "befosDate"){
			befoDate = item
		}else if(title == "oneTime"){
			nowDate =  item;
			befoDate = beitem;	
		}  
		
		if(nowDate.split(', ')[1] != undefined){
			nowDate = nowDate.split(', ').join('-')
		}

		var d1 = new Date(befoDate.replace(/\-/g, "\/"));  
		var d2 = new Date(nowDate.replace(/\-/g, "\/"));  
		console.log(d1,d2) 
		
		if(d1 > d2){  
			
			Toast.fail('วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด!' , 2); 
		  //Toast.fail('开始日期不能大于结束日期!' , 2); 
		return;  
		}
		
		if(d2 < d1){  
			Toast.fail('วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น' , 2); 
		// Toast.fail('结束日期不能小于開始日期！' , 2); 
		return;  
		}
	
		Toast.loading('กำลังสอบถาม กรุณารอสักครู่.',200);
		fetchRequest(ApiPort.BonusApplications+"?wallet="+this.state.NowBankType+"&paymentMethod="+bankname+"&dateFrom="+befoDate+"&dateTo="+nowDate+"&", 'GET')
				.then(data => { 
						  Toast.hide();
							 
							if(data.errorMessage == ""){ 
								// console.log(this.state.NowBankType)
								 if(this.state.NowBankType == "deposit"){
									 this.setState({ 
									 records:data,
									 }) 
								 }else if(this.state.NowBankType == "Withdrawal"){
									 this.setState({ 
									 WithdrawalData:data,
									 }) 
								 }
						     
								 
							}else{
								Toast.fail(data.errorMessage , 2); 
							} 
					}).catch(error => {
						Toast.hide();
						 
				}) 
	} 
	//领取前先验证用户信息完整
	getUser(key){
		fetchRequest(ApiPort.Member, 'GET')
		.then(data => {
		/* 四步状态 */
		let memberInfo = data && data.result.memberInfo;
		if(!memberInfo) { return }
		let OneName = true, TwoPhone = true, TreeAddress = true, FourEmail = true;

		if(memberInfo.FirstName){ OneName = false }
		if(memberInfo.Address.Address){ TreeAddress = false }
		if (memberInfo.Contacts) {
			memberInfo.Contacts.forEach((item) => {
				if (item.ContactType == 'Phone') {
					this.setState({ phoneNumber: item.Contact })
					if(item.Status != 'Unverified') {TwoPhone = false};
				} else if (item.ContactType == 'Email') {
					this.setState({ emailNumber: item.Contact })
					FourEmail = false
					// if(item.Status != 'Unverified') {FourEmail = false};
				}
			})
		}
		if (OneName || /*TwoPhone ||*/ TreeAddress || FourEmail) {
			this.setState({
			  OneName,
			  //TwoPhone,
			TreeAddress,
			FourEmail,
			userInfoData: memberInfo,
			GotoVerifie: true,
			})
		} else {
			this.bonusClaim(key)
		}
	  }).catch(error => {
		Toast.hide()
		Toast.fail('网络不佳，请重试', 2);
	  })
	}

	bonusClaim(key){

		Toast.loading('กำลังโหลด...',200);
	 

		fetchRequest(ApiPort.Claim+"?", 'POST',key)
				.then(data => { 
						  Toast.hide();
							  
							Toast.success(data.message,2) 
							this.GetPaymentFirst();

					}).catch(error => {
						Toast.hide();
						 
				}) 
	}
		
	TransferA = (key) => {   //交易平台 
		
		console.log(this.state.toWalletA[key].value)
 
		   this.state.TransferA = this.state.toWalletA[key].value;
		   this.GetPaymentFirst(this.state.toWalletA[key].value);
		//  this.GetTransf() 
	  }; 
  
  befosDate = (key, title) => {
 
	console.log(key)
	this.state.filterMonth = this.state.befosDate[key].value
	this.setState({
		befosDateText:this.state.befosDate[key]
	})

	this.GetPaymentFirst();
	//	this.DateMsg('befosDate',key)

}

NowData = (key) =>{
  this.state.filterYear = this.state.NowData[key].value
  this.setState({
	NowDataText:this.state.NowData[key]
 })

   this.GetPaymentFirst();

}
GotoVerifie() {
	let ST = this.state;
	let UserVerifie = {
		OneName: ST.OneName,
		TwoPhone: ST.TwoPhone,
		TreeAddress: ST.TreeAddress,
		FourEmail: ST.FourEmail,
		phoneNumber: ST.phoneNumber,
		emailNumber: ST.emailNumber,
	}
	this.setState({ GotoVerifie: false })
	Actions.UserVerifie({ memberInfo: ST.userInfoData, UserVerifie });
}
onChangeDate =  (d) =>  {
	let m = d.getMonth() + 1;
	if (m < 10) { m = '0' + m.toString()}
	this.setState({
		filterYear: d.getFullYear(),
		filterMonth: m,
		DatePickers: d,
	},() => {
		this.GetPaymentFirst();
	})
	
}
 
  render () {
	window.bonusDate = (d) => {
		this.onChangeDate(d)
	}
		  
		const {nowDate,Transdata,NowData,befosDate, AppData ,ID,toWalletA,fromWalletA,filterYear,filterMonth} = this.state;
	   let dates = new Date();
		 
    return (
		
		<View style={{flex:1,backgroundColor:this.props.backColor? 'transparent' :'#0a0a0a'}}>{/*轉賬記錄*/}
		<Modal
		animationType='none'
		transparent={true}
		visible={this.state.GotoVerifie}
		onRequestClose={() => {}}
		style={{ backgroundColor: '#2a2a2a' }}
		>
			<View style={styles.modals}>
			<Text style={styles.modalstitle}>ยืนยันขอรับโปรโมชั่น</Text>
			<Text style={styles.modalsbody}>เรียนสมาชิก คุณไม่ได้ทำการยืนยันข้อมูลส่วนตัวที่สมบูรณ์</Text>
			<Text style={styles.modalsbody}>กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน ก่อนทำการรับโปรโมชั่น</Text>
			<TouchableOpacity onPressIn={() => { this.GotoVerifie() }}>
				<View style={styles.modalsfoot}>
					<View style={styles.footTextBg}>
					<Text style={styles.footText}>ยืนยันตอนนี้</Text>
					</View>
				</View>
			</TouchableOpacity>
			</View>

			{/* <Text style={styles.modalstitle}>优惠验证</Text>
			<Text style={styles.modalsbody}>尊敬的会员，您未绑定完善个人资料</Text>
			<Text style={styles.modalsbody}>领取优惠前请您先完善资料</Text>
			<TouchableOpacity onPressIn={() => { this.GotoVerifie() }}>
				<View style={styles.modalsfoot}>
					<View style={styles.footTextBg}>
					<Text style={styles.footText}>前往验证</Text>
					</View>
				</View>
			</TouchableOpacity>
			</View> */}
		</Modal>
					 
				 <Flex style={{ paddingLeft: 14,  }}>

				         {/* <Flex.Item  alignItems='flex-start' style={{flex:0.15,marginRight: 10,backgroundColor: '#222'}}> 
								 <Text style={{color:'#fff',lineHeight: 40}}>全账户</Text>
							</Flex.Item>
 

									<Flex.Item alignItems='flex-end' style={{flex:0.45,paddingTop:15,paddingBottom:15}}> */}
                                    
									{/* <ModalDropdown ref={el => this._dropdown_3 = el} 
									defaultValue={m+'月'}
									textStyle={styles.dropdown_Day_text}
									dropdownStyle={styles.dropdown_Day_dropdown}
									options={befosDate}
									renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
									renderRow={this._dropdown_3_renderRow.bind(this)}
									onSelect={this.befosDate}
									/>  
									</Flex.Item>

									<Flex.Item alignItems='center' style={{flex:0.05}}> 
										<Text style={{color:'#fff'}}>/</Text>
									</Flex.Item>
 
									<Flex.Item alignItems='flex-end' style={{flex:0.25, right:20}}>
                                    
									<ModalDropdown ref={el => this._dropdown_3 = el} 
									defaultValue={y+'年'}
									textStyle={styles.dropdown_Day_text}
									dropdownStyle={styles.dropdown_yal_dropdown}
									options={NowData}
									renderButtonText={(rowData) => this._dropdown_yea_renderButtonText(rowData)}
									renderRow={this._dropdown_3_renderRow.bind(this)}
									onSelect={this.NowData} 
									/>  */}
									{/* {
									<View style={{display: 'flex',alignItems:'center',justifyContent: 'space-between',flexDirection:'row'}}>
										<View style={{backgroundColor: '#222',borderRadius:5,paddingLeft: 10,paddingRight:10}}>
											<Text style={{color:'#fff',lineHeight: 40,textAlign: 'center'}}>全账户</Text>
										</View>
										<View style={{backgroundColor: '#222222',display: 'flex',alignItems: 'center',justifyContent: 'flex-start',flexDirection: 'row',width: width/1.6,marginLeft: 10,padding: 5,borderRadius:5}}>
											<View style={{paddingRight: 35,paddingLeft:10}}>
											<Image resizeMode='stretch' source={require('../images/calendar.png')} style={{ width: 20, height: 20}} />
																							
											</View> 
											<View>
													<Text style={{textAlign:'center',left:4,color: '#fff',lineHeight: 30}}>
														{filterYear  + '-' + filterMonth}
													</Text>
											</View> 
											<View style={{position:'absolute',zIndex:30,width:width/1.6}}>
												<DatePicker
												value={this.state.DatePickers}
												mode="month"
												defaultDate={new Date(dates)}
												minDate={new Date(2018, 1, 1)}
												maxDate={new Date(new Date())}
												onChange={this.onChangeDate}
												format="YYYY-MM-DD"
												>
												<List.Item arrow="horizontal"styles={StyleSheet.create(newStyleHistore)}>Select Date</List.Item>
												</DatePicker>
											</View>
										</View>
									</View>
									} */}
									{/* </Flex.Item>   */}
								</Flex> 
   
									  <ScrollView
											style={{flex:1}}
											automaticallyAdjustContentInsets={false}
											showsHorizontalScrollIndicator={false}
											showsVerticalScrollIndicator={false}
										>   
									 {Transdata =="" && Transdata.length !=0 ?
											<View style={{width:width,padding:20}}><Text style={{textAlign: 'center',color:'#fff'}}>กำลังโหลด..</Text></View> 
								   	  :Transdata.length ==0 ?

										<View style={{width:width,display: 'flex',alignItems:'center',paddingTop:60}}>
											<View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
												<Text style={{ color: "#cdcdcd", textAlign: "center" }}>
												{/* 暂无记录! */}
												ไม่มีบันทึก

												</Text>
											</View>
										</View>

									   : Array.isArray(Transdata) && Transdata.length>0  && Transdata.map((item,i) => {
													   
															 return (
															
											   <View style={{paddingTop:8,borderBottomWidth:1,borderBottomColor:Transdata.length == 1 ? '' : '#46ea27'}}>
														 
														 <Flex>  
														 <Flex.Item style={{padding:1}}>
														 </Flex.Item>
														 
														 </Flex>

														<Flex style={styles.records}> 
													   
															<Flex.Item style={styles.recordTextL}>
																<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>ชื่อโปรโมชั่น</Text>
															</Flex.Item>
															
														   <Flex.Item style={styles.recordTextR}>
																<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.bonusTitle}</Text>
															</Flex.Item>
															
														</Flex>
															
															
															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>ประเภทโปรโมชั่น</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.bonusType}</Text>
																</Flex.Item>
																
															</Flex>
															
															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>บัญชี</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.creditAccount}</Text>
																</Flex.Item>
																
															</Flex>
															
															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>วันที่รับ</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.appliedDate}</Text>
																</Flex.Item>
																
															</Flex>
															
															 
															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>วันที่หมดอายุ</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.expriyDate}</Text>
																</Flex.Item> 
															</Flex>


															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>ได้รับโบนัส</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.bonusGiven}</Text>
																</Flex.Item> 
															</Flex>
 
															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>สถานะโปรโมชั่น</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{'('+item.bonusStatus + ')  ' +item.bonusReleaseTypeValue } </Text>
																</Flex.Item>
																
															</Flex>

															<Flex style={styles.records}> 
																<Flex.Item style={styles.recordTextL}>
																	<Text style={{textAlign: 'left',color:"#fff",fontSize:12}}>ได้รับ</Text>
																</Flex.Item>
																
																<Flex.Item style={styles.recordTextR}>
																	{item.isClaimable == false ? 
																	<Text selectable={true} style={{textAlign: 'left',color:"#fff",fontSize:12}}>{item.bonusStatus}</Text>
																	:item.isClaimable== true &&
																	<TouchableOpacity onPress={()=> this.getUser(item.playerBonusId)}>
																	<View style={styles.buttonC}>
																	<Text selectable={true} style={{textAlign: 'center',color:"#fff",fontSize:14}}>ได้รับ</Text>
																	</View>
																	</TouchableOpacity>

																    }
																	
																</Flex.Item> 

															</Flex>
 
													 </View>
 
														     )
									         })
									  }
								 
									  </ScrollView> 
							</View>
			 
    )
		
  }
	
	 
		
}




export default(Records);
const styles = StyleSheet.create({ 
	dropdown_Day_text:{
		fontSize: 15, 
		paddingLeft:13,
		paddingRight:13,
		color:'#fff'
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
	dropdown_Day_dropdown:{
		width:80,
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

	dropdown_yal_dropdown:{
		width:80,
		height:120,
		marginRight:-15,
		borderRadius: 1,
		shadowOffset: {width: 0, height: 0},
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4,
	},

	dropdown_DZ_dropdown:{
		width:130,
	  height:80,
		marginRight:0,
		borderRadius: 1,
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4,
	},
	dropdown_D_dropdown: {
		width:130,
		flex:1,
		marginRight:0,
		borderRadius: 1,
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.6,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4,
	},
	
	
  dropdown_2_text: {
    marginVertical: 7,
    marginHorizontal: 6,  
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    borderRadius: 1,
		shadowOffset: {width: 0, height: 4},
		shadowOpacity: 1,
		shadowRadius: 5,
		shadowColor: "#666",
		//注意：这一句是可以让安卓拥有灰色阴影
		elevation: 4,
  },


  dropdown_slot_dropdown:{
	  height:280,
	borderRadius: 1,
	shadowOffset: {width: 0, height: 4},
	shadowOpacity: 1,
	shadowRadius: 5,
	shadowColor: "#666",
	//注意：这一句是可以让安卓拥有灰色阴影
	elevation: 4,
  },

	dropdown_3_dropdown:{
		marginRight:-35,
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
    fontSize: 14,
    color: '#fff',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: '#cbcbcb',
  },
  records:{
		 
	paddingLeft:14,
	borderBottomWidth: 1,
	borderColor: '#919191',
	// backgroundColor:"#171717",
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
buttonC:{
	backgroundColor:'#00805a', 
	borderRadius:12,
	width:100,
	paddingLeft:25,
	paddingRight:25,
	paddingBottom:10,
	paddingTop:10,
},
  //验证用户信息弹出 //
  modals: {
    padding: 10,
    color: '#fff',
  },
  modalstitle:{
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
    color: '#fff',
  },
  modalsbody: {
    fontSize: 13,
    textAlign: "center",
    color: '#fff',
  },
  modalsfoot: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
    color: '#fff',
  },
  footTextBg: {
    backgroundColor: '#0d7f00',
    borderRadius: 5,
  },
  footText: {
	  color: '#fff',
	  fontSize: 15,
	  lineHeight: 35,
	  textAlign: "center"
  },

 })

 