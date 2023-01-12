import React from 'react';
import { StyleSheet, ScrollView, Text, View, Image,ImageBackground,TouchableOpacity ,Dimensions} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Radio,Button, Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List} from 'antd-mobile-rn';
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index';
import Touch from 'react-native-touch-once';
import styles from './bankStyle';
import Head from './Head';

import ModalDropdown from 'react-native-modal-dropdown';

const RadioItem = Radio.RadioItem;
const {
  width ,height
} = Dimensions.get('window')
const TypeName = ["depositT", "recordsT", "transferT", "withdrawalsT"]

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newStyle[key].fontSize = 14;
    }
  }
}


const CustomChildren = (props: any) => (
  <TouchableOpacity onPress={props.onPress}>
    <View
      style={{ height: 36, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}
    >
      <Text style={{ flex: 1 }}>{props.children}</Text>
      <Text style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</Text>
    </View>
  </TouchableOpacity>
);



const Account = [
 {
 	name:'主账户',
	key:'MAIN'
 },
 {
  name:'IM体育',
  key:'IPSB'
  },
	{
	name:'AG捕鱼',
	key:'AG'
	},
	{
	name:'老虎机',
	key:'SLOT'
	},
	{
	name:'PT老虎机',
	key:'PT'
	},
	{
	name:'IM电竞',
	key:'SB'
	},
	{
	name:'真人娱乐',
	key:'LD'
	},
];


	const BUTTONS = [];


class transfer extends React.Component {


	constructor(props) {
	    super(props);
			this.navigateToScene = this.navigateToScene.bind(this);

      this.okPayMoney = this.okPayMoney.bind(this);
			this.showActionSheet = this.showActionSheet.bind(this)

	    this.state = {
	      Button1:'',
				Bank:'',
				TotalBal:'' ,
				IPSB:'' ,
				MAIN:'',
				LD:'',
				SLOT:'',
				SB:'',
				account:{0: "MAIN"},
				payMoney:0,
				isDepositLock: false,
                isWithdrawalLock: false,
				BankData:'',  //單一銀行規則
				NowBankType:"JDP",// 用戶選擇充值銀行
				AppData:this.props,
				fromWallet:"主账户",
				fromWalletA:'',//來源總
				fromWalletText:'',
				fromWalletKey:'',
				toWallet: "请选择账户",  // 目標選擇
				toWalletKey:'',
				toWalletA:[],  //目標總數據
				depositingWallet:'',
				Reload:false,
				clicked: 'none',
				Bonus:'',
				BonusData:'',
				ID:0, //確認單一選中
				bonusCouponID:0, //傳送申請優惠
				BonusDB:'',
				bonusCouponKEY:0,// 優惠券
				bonusCoupon:'',
				BonusMSG:'', //優惠提示訊息

	    }


	  }

	componentWillMount() {

	    console.log(this.props.name)

		if(this.props.name == "transferT"){
		   if(bonusProduct){
			this.setState({
				toWallet: Bankname[bonusProduct],
				depositingWallet: bonusProduct
			});

			this.Bonus(bonusProduct)

		   }else{
			storage.load({
				key: 'memberInfo',
				id: 'memberInfos'
			}).then(data => {

				console.log(Bankname)
				console.log(Bankname[data.memberInfo.PreferWallet])

					this.setState({
						toWallet: data.memberInfo.preferWallet == undefined ? Bankname[data.memberInfo.PreferWallet] : Bankname[data.memberInfo.preferWallet],
						depositingWallet: data.memberInfo.preferWallet == undefined ? data.memberInfo.PreferWallet : data.memberInfo.preferWallet
					});

				this.Bonus(data.memberInfo.PreferWallet)

			}).catch(err => {
				console.log('沒有1緩存')
			})
		   }

		}else{


			storage.load({
				key: 'memberInfo',
				id: 'memberInfos'
			}).then(data => {

				console.log(Bankname)
				console.log(Bankname[data.memberInfo.PreferWallet])

					this.setState({
						toWallet: data.memberInfo.preferWallet == undefined ? Bankname[data.memberInfo.PreferWallet] : Bankname[data.memberInfo.preferWallet],
						depositingWallet: data.memberInfo.preferWallet == undefined ? data.memberInfo.PreferWallet : data.memberInfo.preferWallet
					});

				this.Bonus(data.memberInfo.PreferWallet)

			}).catch(err => {
				console.log('沒有1緩存')
			})

		}


		// storage.load({   //用戶自訂目標帳戶
		// 	key: 'memberInfo',
		// 	id: 'memberInfos'
		// }).then(data => {
		//

		// 	this.setState({
		// 		toWallet: '请选择账户',//Bankname[data.memberInfo.preferWallet],
		// 		depositingWallet: data.memberInfo.preferWallet
		// 	});

	    //  	this.Bonus(data.memberInfo.preferWallet)
		// 	//this.login(name,ret);

		// }).catch(err => {
		// 	console.log('沒有1緩存')
		// 	// 如果没有找到数据且没有sync方法，
		// 	// 或者有其他异常，则在catch中返回
		// 	//console.warn(err.message);
		// })


			//拿目標帳戶

				 if(toWalletBox !=''){
					 console.log('有目標帳戶')
					 this.state.fromWalletA = fromWalletBox.map(function (item, key) {
					 		return { value: item.key, label: item.name }
					 });


					 this.state.toWalletA = toWalletBox.map(function (item, key) {
					 		return { value: item.key, label: item.name }
					 });

					 this.setState({
						fromWalletText:toWalletBox[0].key,
						 fromWalletA:this.state.fromWalletA,
					 })

				 }else{
					 this.GettoWalletA();
					 console.log('沒有目標帳戶')
					 this.GetWallets();
				 }
	  }


	  //瘋狂拿目標帳戶 this.loadInterval && clearInterval(this.loadInterval);
	GettoWalletA() {
		this.loadInterval = setInterval(() => {
			if (toWalletBox != "") {

				this.state.toWalletA = toWalletBox.map(function (item, key) {
					return { value: item.key, label: item.name }
				});

				this.setState({
					toWalletA: this.state.toWalletA,
					fromWalletText:toWalletBox[0].key
				})
				this.Bonus(toWalletBox[1].key)
				clearInterval(this.loadInterval);
			}

		}, 5000)
	}



	showActionSheet(){


		ActionSheet.showActionSheetWithOptions(
			{
				title: 'Title',
				options: BUTTONS,
				cancelButtonIndex: 4,
				destructiveButtonIndex: 3,
			},
			(buttonIndex: any) => {
				console.log(buttonIndex)
				this.setState({ clicked: BUTTONS[buttonIndex] });
			},
		);
	}



	//跳轉
	navigateToScene(key){
		Actions[key]({});
	}

	 //拿優惠
	Bonus(key){
		 console.log(key)
	// Toast.loading('加載優惠中,请稍候...',200);
		fetchRequest(ApiPort.Bonus+'?transactionType=Transfer&wallet='+key+'&', 'GET')
				.then(data => {

		//			 Toast.hide();
		this.state.Bonus = data.map(function (item, key) {
			return { value: item.id, label: item.title }
		});

		this.setState({
			Bonus: this.state.Bonus ,
			BonusData:data,
		})
					}).catch(error => {
			//			 Toast.hide();

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

					}).catch(error => {

				})


	}
	 //轉帳
	okPayMoney(){
		let ST = this.state;
		let fromAccount = this.state.fromWalletText;
		let toAccount = this.state.toWallet;
		let payMoney = this.state.payMoney;
		let depositingWallet =this.state.depositingWallet

		console.log(fromAccount)
		console.log(toAccount)

		if(toAccount == "请选择账户" ){
			Toast.fail('请选择账户', 2);
			return;
		}

		if(this.state.payMoney == 0){
			Toast.fail('กรุณากรอกที่อยู่อีเมลที่ถูกต้อง', 2);
			return;
		}else if(fromAccount == depositingWallet){
			Toast.fail('请选择不同账户', 2);
			return;
		}

		let data =  {
			"fromAccount": fromAccount,
			"toAccount": depositingWallet,
			"amount": payMoney,
			"bonusId": this.state.ID,
			"blackBoxValue": Iovation,
			"e2BlackBoxValue": E2Backbox,
			"bonusCoupon": ""
			}

			if(ST.bonusCouponKEY != 0){
				data.bonusCoupon = ST.bonusCoupon;
			}



		Toast.loading('转账中,请稍候...',200);
		fetchRequest(ApiPort.Transfer, 'POST',data)
				.then(data => {

						  Toast.hide();

							ReloadMoney();
							TotalBalGlobe();
						  if(data.status == 0){
								 Toast.fail(data.messages , 2);
							}else{
								Toast.success(data.messages , 2);
							}

							if(this.props.name == "transferT"){
								GetGameListReload();
								}

					}).catch(error => {
						Toast.hide();
						Toast.fail(data.messages , 2);

				})

	}


	fromWallet = (key) => {
			this.setState({
				fromWalletKey:key,
				fromWallet: this.state.toWalletA[key].label,
				fromWalletText:this.state.toWalletA[key].value,
			});
			//this.Bonus(this.state.toWalletA[key].value);
	};

	toWallet = (key) => {  //目標帳戶

        //console.log(this.state.fromWalletA)
		//console.log(this.state.toWalletA)

		this.setState({
			toWalletKey:key,
			depositingWallet: this.state.toWalletA[key].value,
			toWallet: this.state.toWalletA[key].label,
		});

		this.Bonus(this.state.toWalletA[key].value);

	};


	BonusButton = (key) =>{

		let d = this.state.BonusData[key];
		// console.log(this.state.BonusData)
		// console.log(key)
		// console.log(this.state.toWalletA)
		this.setState({
			bonusCouponKEY:this.state.BonusData[key].bonusCouponID
		})

		this.onChange(d.id,d.bonusCouponID,d.title)
	  }


	onChange = (i,key,title,money) => {

		if(i){
			this.setState({
				bonusCouponID:key?key:this.state.bonusCouponID,
				ID:i,
			 });
		 }

        let payMoney;

		 if(money){
			payMoney = money;
		}else{
			payMoney= this.state.payMoney;
		}

		 if(this.state.ID == 0){
			return;
		 }

	// if(i){
	// 	this.setState({
	// 		bonusCouponID:key,
	// 		ID:i,
    //  	});
	//  }
	//  let payMoney = this.state.payMoney;

	 if(this.state.ID == 0){
		return;
	 }

		if(title == "下回再参与！"){
			return;
		}

		let data =  {
			  "transactionType": "Transfer",
			  "bonusId": !i ? this.state.ID : i,
			  "amount": payMoney,
			  "wallet": this.state.depositingWallet,
			  "couponText": "string"
          }
				//Toast.loading('检测优惠中,请稍候...',200);
				fetchRequest(ApiPort.BonusCalculate, 'POST',data)
						.then(data => {

									if(data.previewMessage != ""){
										//Toast.success(data.previewMessage, 3);
										this.setState({
											BonusMSG:data.previewMessage,
										})
									}else if(data.errorMessage != ""){
										//Toast.fail(data.errorMessage, 3);
										this.setState({
											BonusMSG:data.errorMessage,
										})
									}

							}).catch(error => {
						//		Toast.hide();
								Toast.fail(data.errorMessage , 2);

						})
  };




  _dropdown_2_renderButtonText(rowData) {
	return `${rowData.label}`;
}

_dropdown_2_renderRow(rowData, rowID, highlighted) {



	let evenRow = rowID % 2;
	return (
		<TouchableHighlight underlayColor='cornflowerblue'>
			<View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#ececec' : 'white' }]}>
				<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
					{`${rowData.label}`}
				</Text>
			</View>
		</TouchableHighlight>
	);
}


_dropdown_2_renderRow(rowData, rowID, highlighted) {



	let evenRow = rowID % 2;
	return (

		<Flex style={{width:width-20, backgroundColor: evenRow ? '#ececec' : 'white'}}>
				<Flex.Item style={styles.dropdown_2_row}>
					<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
						{`${rowData.label}`}
					</Text>
				</Flex.Item>

			</Flex>



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
	}else if(rowData.value == "PT"){
		moneyDB = PT+'元'
	}else if(rowData.value == "AG"){
		moneyDB = AG+'元'
	}
	//let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
	let evenRow = rowID % 2;
	return (


		this.state.toWalletKey != Number(rowID)  ?
			<Flex style={{ width:width-20,backgroundColor: evenRow ? '#ececec' : 'white'}}>
		<Flex.Item style={styles.dropdown_2_row}>
			<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
				{`${rowData.label}`}
			</Text>
		</Flex.Item>
		<Flex.Item alignItems='flex-end' style={[styles.dropdown_2_row, {paddingRight:10}]}>
			<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
				{`${moneyDB}`}
			</Text>
		</Flex.Item>
	</Flex>

		:this.state.toWalletKey == Number(rowID) &&
		<View></View>



	);
}




_dropdown_4_renderRow(rowData, rowID, highlighted) {

	console.log(rowData, rowID, highlighted)


	let moneyDB = ''

	if (rowData.value == "MAIN") {
		moneyDB = MAIN
	} else if (rowData.value == "IPSB") {
		moneyDB = IPSB
	} else if (rowData.value == "SLOT") {
		moneyDB = SLOT
	} else if (rowData.value == "CMD") {
		moneyDB = CMD
	} else if (rowData.value == "SB") {
		moneyDB = SB
	} else if (rowData.value == "LD") {
		moneyDB = LD
	}else if(rowData.value == "PT"){
		moneyDB = PT
	}else if(rowData.value == "AG"){
		moneyDB = AG
	}
	//let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
	let evenRow = rowID % 2;


	return (



		this.state.fromWalletKey != Number(rowID)  ?
		<Flex style={{ width:width-20,backgroundColor: evenRow ? '#ececec' : 'white'}}>
		<Flex.Item style={styles.dropdown_2_row}>
			<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
				{`${rowData.label}`}
			</Text>
		</Flex.Item>
		<Flex.Item alignItems='flex-end' style={[styles.dropdown_2_row, {paddingRight:10}]}>
			<Text style={[styles.dropdown_2_row_text, highlighted && { color: '#000' }]}>
				{`${moneyDB}`}
			</Text>
		</Flex.Item>
	</Flex>

		:this.state.fromWalletKey == Number(rowID) &&
		<View></View>



	);
}


  render () {


		const { bonusCouponKEY,BonusMSG,Bonus,depositingWallet ,fromWalletText,fromWalletA,fromWallet,toWalletA,toWallet,Bank,isDepositLock,isWithdrawalLock,BankData,NowBankType} = this.state;



    return (
		<View style={{flex:1}}>



       <ScrollView
              style={{ flex: 1 }}
              automaticallyAdjustContentInsets={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >

					     <WhiteSpace size="sm" />

				  <View>


				  <Flex style={{ paddingLeft: 14, paddingTop: 14, backgroundColor: "#fff",borderBottomWidth: 0.2, borderColor: '#d2d2d2'  }}>

					<Flex.Item style={{ paddingBottom: 14 }}>
						<Text>来源账户</Text>
					</Flex.Item>

					<Flex.Item alignItems='flex-end' style={{ right: 27 }}>

						{ fromWalletA == "" ?
							<Text style={{ fontSize: 14 }}>กำลังโหลด..</Text>
							: toWalletA != "" &&
							<ModalDropdown ref={el => this._dropdown_3 = el}

								defaultValue={fromWallet}
								textStyle={styles.dropdown_D_text}
								dropdownStyle={styles.dropdown_DX_dropdown}
								options={fromWalletA}
								renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
								renderRow={this._dropdown_3_renderRow.bind(this)}
								onSelect={this.fromWallet}
							/>

					}

					</Flex.Item>
					</Flex>



				<Flex style={{ paddingLeft: 14, paddingTop: 14, backgroundColor: "#fff", borderBottomWidth: 0.2, borderColor: '#d2d2d2' }}>

					<Flex.Item style={{ paddingBottom: 14 }}>
						<Text>บัญชีเป้าหมาย</Text>
					</Flex.Item>

					<Flex.Item alignItems='flex-end' style={{ right: 27 }}>

						{ toWalletA == "" ?
							<Text style={{ fontSize: 14 }}>กำลังโหลด..</Text>
							: toWalletA != "" &&
							<ModalDropdown ref={el => this._dropdown_3 = el}

								defaultValue={toWallet}
								textStyle={styles.dropdown_D_text}
								dropdownStyle={styles.dropdown_DX_dropdown}
								options={toWalletA}
								renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
								renderRow={this._dropdown_4_renderRow.bind(this)}
								onSelect={this.toWallet}
							/>

					   }

					</Flex.Item>
					</Flex>

					<Flex style={styles.gameBg1}>
							<Flex.Item>
							<InputItem
							type="number"
							value={this.state.payMoney}
							onChange={(value: any) => {
								let newText = value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');

								//console.log(newText)
								 if(fromWalletText == 'IPSB' || depositingWallet == 'IPSB'){
									 if(newText < 1){
										newText = ''
									 }
								 }
								 if(newText > 1000000){
									newText = '1000000'
								 }
								this.setState({
									payMoney: newText,
								});
								this.onChange('','','',newText);
							}}
							placeholder="0.00"
						>
							<Text style={{fontSize:14}}>จำนวนเงินโอน</Text>
						</InputItem>
						</Flex.Item>
					</Flex>

					<WhiteSpace size="sm" />

					{Bonus != "" && Bonus.length != 0 &&

						<View>

						<Flex style={{ paddingTop: 5, backgroundColor: "#fff", }}>
							<Flex.Item style={{paddingBottom:5,paddingTop:10,paddingBottom:10}}>
									<Text style={{color:"#000", fontSize:14, paddingLeft:14,}}>注意,发现优惠,可供您选择申请:</Text>
							</Flex.Item>

						</Flex>

						<Flex style={{ backgroundColor: "#fff", }}>
								<Flex.Item style={{flex:1,paddingTop: 5, backgroundColor: "#eed087",marginLeft:10,marginRight:10,marginBottom:10}}>

							<ModalDropdown ref={el => this._dropdown_3 = el}
											defaultValue='เข้าร่วมครั้งต่อไป！'
											textStyle={styles.dropdown_Bonus_text}
											dropdownStyle={styles.dropdown_Bonus_dropdown}
											options={Bonus}
											renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
											renderRow={this._dropdown_2_renderRow.bind(this)}
											onSelect={this.BonusButton}
										/>

							</Flex.Item>

							</Flex>




							{bonusCouponKEY != 0 &&

							<Flex style={{	 paddingTop:5, backgroundColor:"#fff",top:1,}}>
							<Flex.Item>

								<InputItem
									type="text"
									labelNumber={5}
									value={this.state.bonusCoupon}
									onChange={(value: any) => {
										this.setState({
											bonusCoupon: value,
										});
									}}
									placeholder="请填写优惠券号码"
								>
									<Text style={{ fontSize: 14 }}>优惠券号码:</Text>
								</InputItem>

							</Flex.Item>

							</Flex>

							}


							{BonusMSG != "" &&

						<Flex style={{paddingTop:5, backgroundColor:"#fff",top:1,}}>
						<Flex.Item>

							 <Text style={{color:'#ff0000',padding:13}}>{BonusMSG}</Text>

						</Flex.Item>

						</Flex>


						     }




							</View>

						}
					 {/*Bonus != "" && Bonus.length != 0 &&

							<View>
								{Bonus&& Bonus.map((item,i) => {
									return(
									<Flex style={{paddingTop:5,  backgroundColor:"#fff",}}>

									<Flex.Item>
									<RadioItem key={item.id} checked={ID === item.id} onChange={() => this.onChange(item.id,item.bonusCouponID,item.title)}>
										<Text >{item.title}</Text>
									</RadioItem>
									</Flex.Item>
									</Flex>
									)
                           })
				       }
							 </View>
					*/}

					<View style={{ paddingLeft: 14, paddingBottom: 10, paddingTop: 15, }}>
							<Flex style={{paddingBottom:10}}><Text>温馨提醒:</Text></Flex>

							<Flex>
								<Flex.Item><Text>* 请您即时通过官方途径-24小时在线客服解决您的问题。</Text></Flex.Item>
							</Flex>

					 </View>



				</View>


         </ScrollView>

				<Flex style={styles.PayButtonB}>
					<Flex.Item style={{flex:0.2}}></Flex.Item>
					<Flex.Item alignItems='center'>
					<Touch hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} style={styles.buttonPay} onPress={()=>this.okPayMoney()}>
						<Text style={{color:"#fff",fontSize:16,fontWeight:'bold',	textAlign: 'center'}}>立即转账 </Text>
					</Touch>
					</Flex.Item>
					<Flex.Item style={{flex:0.2}}></Flex.Item>
			    </Flex>
			</View>


    )
  }
}


export default(transfer);



