import React from 'react';
import { StyleSheet,WebView ,Text, View,Platform,TouchableOpacity ,Dimensions,Image} from 'react-native';
import { Actions } from 'react-native-router-flux';
import {  Carousel,WhiteSpace, WingBlank ,Flex,Toast,InputItem,Picker,List, Modal} from 'antd-mobile-rn';
import Orientation from 'react-native-orientation-locker';
import Touch from 'react-native-touch-once';
const {
  width ,height
} = Dimensions.get('window')

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




class Manualpromotion extends React.Component {
	
	
	constructor(props) {
	    super(props); 
			this.state = {
				loadD:false,
				payHtml:this.props.uri ? this.props.uri :'', 
				img:this.props.img,
				contentId:this.props.contentId,
				promotionMasterCategory:this.props.promotionMasterCategory,
				memberInfo:'',
				email:'',
				user:'', //帳戶
				name:'', //用戶名
				titlename:this.props.titlename,
				conterText:'',
				OneName: '',//验证名字
				TwoPhone: '',//验证手机
				TreeAddress:'',//验证地址
				FourEmail:'',//验证邮箱
				GotoVerifie: false,
				userInfoData: '',
				phoneNumber: '',
			}
			 
	  }
		
	componentWillMount(props) {
       Orientation.lockToPortrait();
			 console.log(Platform.OS) 
			 this.getUser();
			
	  }

		refresh = () => {
			this.getUser();
		}
	
		getUser(){
			Toast.loading("กำลังโหลด...", 200);
			fetchRequest(ApiPort.Member, 'GET')
					.then(data => {
						console.log(data)
						Toast.hide()
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
									this.setState({ email: item.Contact })
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
						}
						this.setState({
							memberInfo:data.result.memberInfo,
							name: memberInfo.FirstName,
						})
							
							// if(data.result.memberInfo.Contacts.length == 1){
							// 	if(data.result.memberInfo.Contacts[0].Status != "Verified"){
				 
							// 	}
							 
							//  this.setState({ 
							// 	 phoneNumber:data.result.memberInfo.Contacts[0].Contact,
							// 	 phoneStatus:data.result.memberInfo.Contacts[0].Status,
							// 	 email:'',
							// 	 emailStatus:'',
							// 	 name:data.result.memberInfo.FirstName ?data.result.memberInfo.FirstName :'',
							//  }) 
							// }else if(data.result.memberInfo.Contacts.length != 1){
								
							// 	if(data.result.memberInfo.Contacts[0].Status != "Verified"){
							// 		//alert('邮箱未验证')
								 
							// 	} 
							// 	if(data.result.memberInfo.Contacts[0].ContactType == "Phone"){
							// 		this.setState({ 
							// 			email:data.result.memberInfo.Contacts[1].Contact,
							// 			emailStatus:data.result.memberInfo.Contacts[1].Status,
							// 			phoneNumber:data.result.memberInfo.Contacts[0].Contact,
							// 			phoneStatus:data.result.memberInfo.Contacts[0].Status,
							// 			name:data.result.memberInfo.FirstName ?data.result.memberInfo.FirstName :'',
							// 		})
							// 	}else{
							// 		this.setState({ 
							// 			email:data.result.memberInfo.Contacts[0].Contact,
							// 			emailStatus:data.result.memberInfo.Contacts[0].Status,
							// 			phoneNumber:data.result.memberInfo.Contacts[1].Contact,
							// 			phoneStatus:data.result.memberInfo.Contacts[1].Status,
							// 			name:data.result.memberInfo.FirstName ?data.result.memberInfo.FirstName :'',
							// 		})
							// 	} 
							// }
								
						}).catch(error => {
							Toast.hide()
							Toast.fail('', 2);
							Actions.pop()
									//Toast.hide();
					}) 
		}

	
	closeModal() {
		Actions.pop();
	}
	
	PromotionsPost(){
		    
		Actions.transferTx() 
		
	}

	manualpromotion(){
		Actions.transferTx() 
	}

	UpdateMember(){

		const {email,phoneNumber,name,conterText} = this.state;

		Toast.loading()

		let Data ={
			"firstName":name,
			"promoId": this.props.bonusId, 
			"remark": conterText,
			"Mobile":phoneNumber,
			"Email":email,
			"platform": Platform.OS
  	}

		fetchRequest(ApiPort.PromotionsPost+'?', 'POST',Data)
		.then(data => { 
			if (data.isSuccess) {
				if (data.isPromoApplied) {
					Toast.success(data.message,2)
				} else {
					Toast.fail(data.message,2)
				}
			} else {
				Toast.fail(data.message,2)
			}
					  
				   
						
			}).catch(error => { 
				Toast.fail(data.errorMessage , 1); 
				 
		})
	 
	}
	
	closeButton(){
		Actions.pop();
	}
	GotoVerifie() {
		let ST = this.state;
		let UserVerifie = {
			OneName: ST.OneName,
			TwoPhone: ST.TwoPhone,
			TreeAddress: ST.TreeAddress,
			FourEmail: ST.FourEmail,
			phoneNumber: ST.phoneNumber,
			emailNumber: ST.email,
		}
		this.setState({ GotoVerifie: false })
		Actions.UserVerifie({ memberInfo: ST.userInfoData, UserVerifie, preferentialPage: 'preferentialPage',beforeBack: () => { this.refresh() }});
	}
	 
  render () {
		 
		
		const {payHtml,memberInfo,phoneNumber,email,name,titlename,conterText} = this.state;
		let testUrl = payHtml.split(":")
		let urlHtml = false
		if(testUrl[0] != "https" && testUrl[0] != "http"){
			 urlHtml = false
		}else{
			urlHtml = true
		}
		
		
    return (
		    <View style={{flex:1,backgroundColor: '#0a0a0a'}}> 
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
				<Text style={styles.modalsbody}>申请优惠前请您先完善资料</Text>
				<TouchableOpacity onPressIn={() => { this.GotoVerifie() }}>
					<View style={styles.modalsfoot}>
						<View style={styles.footTextBg}>
						<Text style={styles.footText}>前往验证</Text>
						</View>
					</View>
				</TouchableOpacity>
				</View> */}
			</Modal>
				  

							{/* <View style={{ top:0,backgroundColor:"#111111",width:width, height:Platform.OS === 'ios' ? 95 :65,zIndex:20}}>  
							<TouchableOpacity hitSlop={{top:15,bottom:15,left:15,right:10 }} onPress={this.closeButton.bind(this)} >
							  <Text style={styles.closeButton}>Ｘ</Text>
							</TouchableOpacity>
					 </View>   */}

				       
						  <View style={styles.rootContainer}>
		  <View style={styles.rootContainer}> 
        <InputItem 
            value={titlename}
            editable={false}
            labelNumber={5}
            placeholder=""
			style={styles.input}
			styles={StyleSheet.create(newStyle)}
          >
					<Text style={{color:'#ccc'}}>ชื่อโปรโมชั่น: </Text>
					{/* <Text style={{color:'#ccc'}}>优惠名: </Text> */}
         </InputItem>
 
         <InputItem
						 clear
            value={name}
			editable={false}
            labelNumber={5}
            placeholder=""
			style={styles.input}
			styles={StyleSheet.create(newStyle)}
             onChange={(name: any) => {
              this.setState({
                name,
              });
            }}
          >
						<Text style={{color:'#ccc'}}>ชื่อจริง: </Text>
					{/* <Text style={{color:'#ccc'}}>真实名字: </Text> */}
         </InputItem>



        <InputItem
            clear
            value={phoneNumber}
			editable={false}
            onChange={(phoneNumber: any) => {
              this.setState({
                phoneNumber,
              });
            }}
            labelNumber={5}
            placeholder="手机号"
			style={styles.input}
			styles={StyleSheet.create(newStyle)}
          >
			  		<Text style={{color:'#ccc'}}>เบอร์โทรศัพท์: </Text>
					{/* <Text style={{color:'#ccc'}}>有效手机号: </Text> */}
         </InputItem>
 
         <InputItem
            clear
			editable={false}
            value={email}
            onChange={(email: any) => {
              this.setState({
                email,
              });
            }}
            labelNumber={5}
            placeholder=""
			style={styles.input}
			styles={StyleSheet.create(newStyle)}
          >
					<Text style={{color:'#ccc'}}>อีเมล: </Text>
         </InputItem>


				 <InputItem
            clear
            value={conterText}
            onChange={(conterText: any) => {
              this.setState({
                conterText,
              });
            }}
            labelNumber={5}
            placeholder=""
			style={styles.input}
			styles={StyleSheet.create(newStyle)}
          >
					<Text style={{color:'#ccc'}}>PS: </Text>
         </InputItem>


						{/*提交表單*/}
						

            <Touch onPress={this.UpdateMember.bind(this)} style={styles.touchableStyles} >
          
            <View style={{backgroundColor: '#00b324',borderRadius: 5}}>
				<Text style={styles.loginButton}>ยืนยันและส่ง</Text>
			</View>
          
           </Touch>

					 </View>

        </View>
					 
					</View>		
			
    )
  }
}


export default(Manualpromotion);



const styles = StyleSheet.create({

	rootContainer: {
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center"
	},
	
  wrapper: {
	height:120,
    backgroundColor: '#000',
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  containerVertical: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  text: {
    color: '#fff',
    fontSize: 36,
  },
	image: {
		width,
		height: 200
	},
	 warning:{
		height:35,
		width:width,
		backgroundColor: '#013626',

	 },
	 warningT:{
		 height:30,
		 marginTop:10
	 },
	 warningText:{
	 color: '#fff',

	 },
	 gameBg1:{
		 backgroundColor:"#fff",
		 padding:12
	 },
	 gameBg2:{
		 backgroundColor:"#fff",
		 padding:12,
		 borderTopWidth: 1,
		 borderColor: '#fff'
	 },
	 
	 GameBox:{
		height:height-230,
	   	backgroundColor:"#fff",
    	width: width,
	 		flexWrap: 'wrap',
	 		display:'flex',
	 		flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			paddingTop:10,
	 		paddingRight:10,
	 		paddingBottom:10,
	 			
	 	
	 }, 
	 GameImg:{
	    width:175,
	    flexWrap: 'wrap',
	 		flexDirection: 'column',
	 		alignItems: 'center',
	 		justifyContent: 'center',
			paddingTop:15,
			paddingBottom:15,
			marginLeft:6,
			marginBottom:6,
			borderWidth: 5,
	    borderColor: '#d3d3d3'
	 },
	 
	 preferentImg:{
		 marginTop:-15,width: width, height: 150,backgroundColor: '#d3d3d3'
	 },
	 openPreferential:{
		borderRadius:18,
		marginTop:10,
		width:110,
		padding:5,
		backgroundColor: '#00633c',
	 },
	 closeButton:{
		top:Platform.OS === 'ios' ?45:15,
		left:20,
		fontSize:24,fontWeight:'900',color:'#0e7e00',
		width:40,
		height:40,
		borderWidth: 1,
		borderRadius:20,
		paddingTop:Platform.OS === 'ios' ?8:5,
		borderColor: '#0e7e00',
		textAlign:'center'
	 },
	 loginButton: {
	fontWeight: 'bold',
	lineHeight: 40,
    color: '#fff',
    textAlign: 'center',
    fontSize: 22
	},
	touchableStyles: {
		width: width,
		padding: 10,
		marginTop: 30
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
	input: {
		textAlign: 'right'
	},
});
