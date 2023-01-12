import React from 'react';
import { SafeAreaView,StyleSheet,WebView, Linking,ScrollView, Text, View, Image,ImageBackground,TouchableOpacity ,Dimensions,Platform} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Touch from 'react-native-touch-once';
import {
	Modal,
  } from "antd-mobile-rn";
import WebViewIOS from 'react-native-webview'

  const { width, height } = Dimensions.get("window");

class TransactionDetails extends React.Component {
	
	
	constructor(props) {
		super(props);
		this.state = {
			confirmTransationId:this.props?.confirmTransationId,
			detail:null,
			isShowWeb:false,
			webUrl:'',
			toastSuccessFlag:false,
			toastErrorFlag:false,
			toastMsg:'',
		}
		}
	
	  componentDidMount() {
		this.GetResubmitDetail()
	  }

	componentWillMount() {

	}
	
	GetResubmitDetail(){
		fetchRequest(ApiPort.GetResubmitDetail+'resubmitDepositID='+this.state.confirmTransationId+'&', "GET")
		.then((data) => {
			console.log("GetResubmitDetail", data);
			if(data?.PaymentGatewayName){
			this.setState({detail: data})
			
			}
		})
		.catch((err) => {
			console.log('err',err)
		});
	}

	handleResubmitDetail(){
		UMonEvent('Deposit','Submit','Resubmit_TransactionRecord')

		let postData={
			resubmitDepositID:this.state.confirmTransationId,
			returnUrl:common_url
		}
		console.log('postData',postData)
		fetchRequest(ApiPort.ResubmitDetail+'resubmitDepositID='+this.state.confirmTransationId+'&returnUrl='+common_url+'/&', "POST", postData)
		.then((res) => {
			console.log('ResubmitDetail res', res);
			if (res?.ResubmitStatus) {
			this.setState({
				webUrl:res.ResubmitRedirectUrl,
				isShowWeb:true,
			})
			this.props.reload();
		  }else{
			let msg = 'คำขอของคุณล้มเหลว เนื่องจากอาจมีการปิดหน้าธุรกรรมระหว่าง ดำเนินการ หากคุณต้องการยืนยันส่งคำร้องธุรกรรมนี้อีกครั้ง โปรดติดต่อฝ่ายบริการลูกค้า'
			if(Array.isArray(res?.Error) && res.Error.length>0){
				msg = res.Error[0].Description
			}

			this.setState(
				{
				  toastErrorFlag:true,
				  toastMsg:msg,
				},
				() => {
				  setTimeout(()=>{
				   this.setState({toastErrorFlag:false})
					this.props.reload();
					Actions.pop()
				  }, 2000)
				}
			  );
		  }
		})
		.catch(() => {
		});
	}
	
	
  render () {
	const {detail,isShowWeb,webUrl ,toastSuccessFlag,toastErrorFlag,toastMsg} = this.state;
		
    return (
		<View style={{
			flex: 1,
			backgroundColor:"#111111",
			paddingHorizontal:16,
		  }}>
			
		
		{(toastSuccessFlag || toastErrorFlag) &&  <View style={{top:height/3,left:15,right:15,paddingLeft:16,position:'absolute',backgroundColor:'#fff',zIndex:9999,borderRadius:6}}>
				<View style={{flexDirection:'row',paddingVertical:15}}>
					{toastSuccessFlag? <Image
					resizeMode="contain"
					source={require("../../images/icon_success.png")}
					style={{ width: 16, height: 16,justifyContent:'center' }}
					/>:
					<Image
					resizeMode="contain"
					source={require("../../images/error_icon.png")}
					style={{ width: 16, height: 16,justifyContent:'center' }}
					/>}
					<View style={{paddingLeft:10,paddingRight:40}}>
						<Text
							style={{
								color: "#333333",
								fontSize: 14,
								flexWrap:'wrap',
							}}
							>
							{toastMsg}
						</Text>
					</View>
				</View>
        </View>}

		<Modal
          animationType="none"
          visible={isShowWeb}
          onRequestClose={() => {}}
          style={{width:width,height:height,backgroundColor: "#111111"}}
        >
			<SafeAreaView style={{flex:1}}>
				<View style={{
					width:width,
					height:56,
					}}>
					<View style={{height:56,backgroundColor: '#1a1a1a'}}>
					{
					Platform.OS == "android" &&	
						// android的ImageBackground不能正常使用
						<View>
						<Image resizeMode='repeat' source={require('../../images/home/pattern1.png')} style={{ width: width, height: 55}} />
						</View>
					}
					<ImageBackground
						style={{ width: width, height: '100%', flex: 1,display: 'flex',justifyContent: 'space-between',alignItems: 'center',flexDirection: 'row',position:Platform.OS == "android"? 'absolute': 'relative'}}
						resizeMode="repeat"
						source={Platform.OS == "android"? require("../../images//home/noimg.png"): require("../../images//home/pattern.png")}
					>
						<View style={{width: '20%'}}>
						</View>
						<View style={{flex:1,alignSelf:"center"}}>
						<Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold",textAlign: 'center' }}>
                        ส่งรายการฝากเงินอีกครั้ง
						</Text>
						</View>
						<View style={{width: '20%'}}>
						<TouchableOpacity   onPress={() => {
							Actions.pop()
							this.setState({isShowWeb:false})
							}}>
							<View>
							<Text style={{ color: '#fff', fontSize: 20, textAlign: 'right',marginRight:16 }}>
							X
							</Text>
							</View>
						</TouchableOpacity>
						</View>
						</ImageBackground>
					</View>
					
				</View>
				<View style={{flex:1,backgroundColor:'red'}}>
                {
								Platform.OS === 'ios'?
				<WebViewIOS 
                    source={{ html: webUrl }}
                    style={{
					backgroundColor: '#fff',
				}} />
                :
                <WebView source={{ html: webUrl  }}
                style={{
                    backgroundColor: '#fff',
                }} 
                //mediaPlaybackRequiresUserAction={false}
                />
                }
				</View>
			</SafeAreaView>
        </Modal>



			{/* <TouchableOpacity   onPress={() => {
                  Actions.pop()
                }}>
                <View>
                 <Text style={{ color: '#fff', fontSize: 20, textAlign: 'right' }}>
                  X
                 </Text>
                </View>
              </TouchableOpacity> */}
			
			<View style={{backgroundColor:'#2B2B2B',marginTop:20,paddingVertical:20,paddingHorizontal:16,borderRadius:12}}>
			  <View style={{flexDirection:'row'}}>
				<View style={{flex:1}}>
				   <Text style={{color:'#CCCCCC',fontSize:14}}>ประเภทการเงิน</Text>
				</View>
				<View style={{flex:1}}>
				  {detail && detail?.PaymentGatewayName && <Text style={{color:'#CCCCCC',fontSize:14,alignSelf:'flex-end',fontWeight:'800'}}>{detail.PaymentGatewayName}</Text>}
				</View>
			  </View>
			  <View style={{alignSelf:'center',width:'98%',height:0.5,backgroundColor:'#CCCCCC',marginVertical:20}}></View>

			  {detail && detail?.MethodTypeName &&
			  <>
				<View style={{flexDirection:'row'}}>
				<View style={{flex:1}}>
				   <Text style={{color:'#CCCCCC',fontSize:14}}>ช่องทาง</Text>
				</View>
				<View style={{flex:1}}>
				   <Text style={{color:'#CCCCCC',fontSize:14,alignSelf:'flex-end',fontWeight:'800'}}>{detail.MethodTypeName}</Text>
				</View>
			  </View>
			  <View style={{alignSelf:'center',width:'98%',height:0.5,backgroundColor:'#CCCCCC',marginVertical:20}}></View>
			  </>}

			  <View style={{flexDirection:'row'}}>
				<View style={{flex:1}}>
				   <Text style={{color:'#CCCCCC',fontSize:14}}>ยอดเงิน</Text>
				</View>
				<View style={{flex:1}}>
				   {detail && detail?.ResubmitAmount && <Text style={{color:'#CCCCCC',fontSize:14,alignSelf:'flex-end',fontWeight:'800'}}>฿ {detail.ResubmitAmount}</Text>}
				</View>
			  </View>

			</View>
			<Text style={{color:'#999999',fontSize:12,marginTop:10}}>คุณไม่จำเป็นต้องทำการโอนเงินซ้ำ โปรดคลิกดำเนินการต่อ และอย่าปิดหน้านี้ จนกว่าหน้าธุรกรรมจะแสดงผลขึ้น หากปิดอาจจะทำให้การส่งล้มเหลว <Text onPress={()=>{Actions.LiveChatST()}} style={{color:'#00E62E'}}>ติดต่อฝ่ายบริการ</Text></Text>
			<Touch onPress={()=>{this.handleResubmitDetail()}} style={{backgroundColor:'#00B324',borderRadius:6,paddingVertical:13,marginTop:53}}>
			  <Text style={{color:'#F5F5F5',fontSize:16,textAlign:'center'}}>ดำเนินการต่อ</Text>
			</Touch>
				
		</View>
			
			
    )
  }
}


export default(TransactionDetails);



