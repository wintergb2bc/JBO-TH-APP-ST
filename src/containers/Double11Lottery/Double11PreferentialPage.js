import React from 'react';
import { StyleSheet, WebView, Text, View, Animated, TouchableOpacity, Dimensions, Image, Platform, Modal, ScrollView,Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, ActivityIndicator, List } from 'antd-mobile-rn';
import Orientation from 'react-native-orientation-locker'; 
import WebViewIOS from 'react-native-webview';
const {
	width, height
} = Dimensions.get('window')


class Double11PreferentialPage extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			loadD: false,
			payHtml: this.props.uri ? this.props.uri : '',
			img: this.props.img,
			contentId: this.props.contentId,
			bonusId: this.props.bonusId,
			promotionMasterCategory: this.props.promotionMasterCategory,
			titlename: this.props.titlename,
			PromoDB: this.props.PromoDB,
			loadone: 1,
			isFlag: false,
			WebViewHeight: 22839,
			isShowLiveChatModal:false,
            	liveChatUrl:null,
		}

	}

	componentDidMount(props) {
		//彈客服窗
		if(!ApiPort.UserLogin){
		  setTimeout(()=>{
			  this.getLiveChat()
		  }, 300000) 
	  }
	  }

	componentWillMount(props) {
		Orientation.lockToPortrait(); 
		// if (this.props.PromoDB.bonusProductList) {
		// 	bonusProduct = this.props.PromoDB.bonusProductList[0].bonusProduct;
		// }
	}

	getLiveChat(){
        fetchRequest(ApiPort.LiveChat+'Type=2&', "GET")
        .then((data) => {
            if(data?.isMatched){
                this.setState({
                    isShowLiveChatModal:true,
                    liveChatUrl:data.url
                })
            }
            console.log('preD LiveChat data',data)
        })
        .catch(() => {});
    }

	closeModal() {
		Actions.pop();
	}

	PromotionsPost() {
		Actions.transferTx();
	}

	PromotionsDeposit(promotionDetailPromotionId) {
		if (!ApiPort.UserLogin) {
			Actions.logins();
			return;
		}
		UMonEvent(promotionDetailPromotionId + '_apply_promotion')
		Actions.depositTx({
			promotionDetailPromotionId
		});

	}

	manualpromotion(item, postTitle) {
		if (!ApiPort.UserLogin) {
			Actions.logins();
			return;
		}
		
		const bonusId = item.promotionDetailPromotionId
		const titlename = item.promotionDetailPromotionTitle
		UMonEvent('Promo Application', 'Submit', 'Apply_'+bonusId);
		Actions.Manualpromotion({ bonusId, titlename })
	}


	navigateToScene(key, GameOpenUrl) {
		Actions[key]({ GameOpenUrl: GameOpenUrl });

	}

	loading() { //数据加载中,请稍候
		Toast.loading('กำลังโหลด...', 200);
	}


	loadend() {
		Toast.hide();
	}

	_onMessage = (e) => {
 	}
	

	createPreferentialBtn(item, postTitle) {
		const { promotionDetailAction, promotionDetailPromotionType, promotionDetailPromotionId } = item
		console.log(promotionDetailPromotionType, promotionDetailAction.toLocaleUpperCase())
		if (promotionDetailPromotionType == 1) {// Bonus 就有按钮点击直接申请优惠,
			return <Flex style={styles.button}>
				<TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => { this.PromotionsDeposit(promotionDetailPromotionId) }}>
					<Flex.Item style={{ width: width, height: 50 }}><Text style={{ paddingTop: 15, color: "#fff", fontSize: 18, textAlign: 'center' }}>{/* 存款 */}ฝากเงิน</Text></Flex.Item>
				</TouchableOpacity>
			</Flex>
		} else if (promotionDetailPromotionType == 2) { // Other Promotion 
			// 如果是 deposit 就点击按钮后带入存款页面, 如果是promotion就点击按钮后带入优惠. 目前的场景暂时还不会使用“promotion”.
			let promotionDetailActionUpperCase = promotionDetailAction.toLocaleUpperCase()
			if (promotionDetailActionUpperCase === 'DEPOSIT') {
				return <Flex style={styles.button}>
					<TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.PromotionsDeposit(promotionDetailPromotionId)}>
						<Flex.Item style={{ width: width, height: 50 }}><Text style={{ paddingTop: 15, color: "#fff", fontSize: 18, textAlign: 'center' }}>{/* 存款 */}ฝากเงิน</Text></Flex.Item>
					</TouchableOpacity>
				</Flex>
			} else {
				return null
			}
		} else if (promotionDetailPromotionType == 3) {// Rebate  只显示优惠详情
			return null
		} else if (promotionDetailPromotionType == 4) {// Manual Promotion 点击按钮后需要填表格来申请
			return <Flex style={styles.button}>
				<TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => this.manualpromotion(item)}>
					<Flex.Item style={{ width: width, height: 50 }}><Text style={{ paddingTop: 15, color: "#fff", fontSize: 18, textAlign: 'center' }}>
						{/* 立即申请 */}
						สมัครตอนนี้
						</Text></Flex.Item>
				</TouchableOpacity>
			</Flex>
		} else {
			return null
		}
	}


	render() {
		const {isShowLiveChatModal,liveChatUrl, WebViewHeight, isFlag, payHtml, loadone, loadD, promotionMasterCategory, img, PromoDB } = this.state;
		//const { preferential } = this.props
		const { promotionDetail } = this.props
		// let isHaveBtn = false
		// if(promotionDetail) {
		// 	if([1, 2, 4].some(v => v === promotionDetail.promotionDetailPromotionType * 1)) {
		// 		if(promotionDetail.promotionDetailPromotionType * 1 === 2) {
		// 			if(promotionDetail.promotionDetailAction.toLocaleUpperCase() === 'DEPOSIT') {
		// 				isHaveBtn = true
		// 			} else {
		// 				isHaveBtn = false
		// 			}
		// 		} else {
		// 			isHaveBtn = true
		// 		}
		// 	} else {
		// 		isHaveBtn = false
		// 	}
		// } else {
		// 	isHaveBtn = false
		// }
		return <View style={{ backgroundColor: '#171717', flex: 1 }}>
		    {
				Platform.OS === 'ios' && <View
				style={[{ backgroundColor: '#171717', height }]}
			>
				<WebViewIOS
					mediaPlaybackRequiresUserAction={false}
					style={{ width, position: 'relative', zIndex: 1000, flex: 1, marginBottom:110 }}//, marginBottom: isHaveBtn ? 140 : 110
					files={[{
						href: 'cssfileaddress',
						type: 'text/css',
						rel: 'stylesheet'
					}]}
					onMessage={this._onMessage}    // 用webios 一定要有個空直 不然js注入會失效
					injectedJavaScript={`document.body.style.background = '#171717';document.head.innerHTML='<meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">'`}
					scrollEnabled={true}
					source={{ html: `<html style="height: 100%;">
				<body>
				<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">
				</head>
				<div>
				<iframe width="100%"
				style=" display: block;height: 80%;border: 0!important;margin: 0!important;padding: 0!important;"
				src="${promotionDetail.promotionDetailContent}"></iframe>
				<div id='divBox' style='margin-top: 0px;margin-bottom: 40px;background-color: #777;height: 46px;width: 100%;display: flex;align-items: center;justify-content: space-between;'>
					<div style="color: #fff;font-weight: bold;margin-left: 15px;">ข้อกำหนดและเงื่อนไขของ JBO</div>
					<div id='divFlag' style="color: #fff;font-weight: bold;margin-right: 15px;">+</div>
					</div>
					<iframe width="100%" id='divToggle'
								style="display: none;height: 180%;border: 0!important;margin: 0!important;padding: 0!important;"
								src="${promotionDetail.promotionDetailTnc}"></iframe>
					<script>
					let divBox = document.getElementById('divBox')
					let divToggle = document.getElementById('divToggle')
					let divFlag = document.getElementById('divFlag')
					divBox.onclick = function () {
						let divToggleStyle = divToggle.style.display
						if(divToggleStyle === 'block') {
							divToggle.style.display = 'none'
							divFlag.innerHTML = '+'
						} else {
							divToggle.style.display = 'block'
							divFlag.innerHTML = '-'
						}
					}
					</script>
				
				</div></body>
				</html>`}}
					scalesPageToFit={false}
					scrollEnabledWithZoomedin={false}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					viewportContent={'width=device-width, user-scalable=no'}
				/>
			</View>
			} 

			{Platform.OS === 'android'&&
				<View
					style={[{ backgroundColor: '#171717', height }]}
				>
					<WebView
						mediaPlaybackRequiresUserAction={false}
						style={{ width, position: 'relative', zIndex: 1000, flex: 1,marginBottom:60 }}//, marginBottom: isHaveBtn ? 140 : 60
						files={[{
							href: 'cssfileaddress',
							type: 'text/css',
							rel: 'stylesheet'
						}]} 
						injectedJavaScript={`document.body.style.background = '#171717';document.head.innerHTML='<meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">'`}
						scrollEnabled={true}
						source={{ html: `<html style="height: 100%;">
					<body>
					<head>
					<meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">
					</head>
					<div>
					<iframe width="100%"
					style="display: block;height: 80%;border: 0!important;margin: 0!important;padding: 0!important;"
					src="${promotionDetail.promotionDetailContent}"></iframe>
<div id='divBox' style='margin-top: 0px;margin-bottom: 40px;background-color: #777;height: 46px;width: 100%;display: flex;align-items: center;justify-content: space-between;'>
		<div style="color: #fff;font-weight: bold;margin-left: 15px;">ข้อกำหนดและเงื่อนไขของ JBO</div>
		<div id='divFlag' style="color: #fff;font-weight: bold;margin-right: 15px;">+</div>
		</div>
		<iframe width="100%" id='divToggle'
					style="display: none;height: 210%;border: 0!important;margin: 0!important;padding: 0!important;"
					src="${promotionDetail.promotionDetailTnc}"></iframe>
		<script>
		let divBox = document.getElementById('divBox')
		let divToggle = document.getElementById('divToggle')
		let divFlag = document.getElementById('divFlag')
		divBox.onclick = function () {
			let divToggleStyle = divToggle.style.display
			if(divToggleStyle === 'block') {
				divToggle.style.display = 'none'
				divFlag.innerHTML = '+'
			} else {
				divToggle.style.display = 'block'
				divFlag.innerHTML = '-'
			}
		}
		</script>
					
					</div></body>
					</html>`}}
						scalesPageToFit={false}
						scrollEnabledWithZoomedin={false}
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						viewportContent={'width=device-width, user-scalable=no'}
					/>
				</View>
			}
			{
				//this.createPreferentialBtn(promotionDetail, postTitle)
			}

				<Modal
					animationType="fade"
					transparent={true}
					visible={!ApiPort.UserLogin && isShowLiveChatModal}
				>
					<View style={[styles.liveChatModal]}>
						<View style={styles.liveChatModalContainer}>
							<TouchableOpacity style={styles.closeBtn} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
								this.setState({
									isShowLiveChatModal:false
								})
							}}>
								<Text style={styles.closeBtnText}>X</Text>
							</TouchableOpacity>
							<View style={styles.modalBottomContainer}>
								<Image source={require('./../../images/liveChat_img.png')}  resizeMode='stretch' style={styles.liveChatIconImg}></Image>
								<Text style={styles.liveChatTextInfor}>หากต้องการความช่วยเหลือ 
								ติดต่อห้องแชทสดได้ตลอด 24 ชั่วโมง</Text>
								<TouchableOpacity style={styles.liveChatBottomBtn} onPress={() => {
									UMonEvent("CS", "Click", "CS_Invitation_PromoPage");
									Linking.openURL(liveChatUrl);
									this.setState({
										isShowLiveChatModal:false
									})
								}}>
									<Text style={styles.liveChatBottomBtnText}>เริ่มแชทเลย</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>	
 
		</View>
	}
}


export default (Double11PreferentialPage);



const styles = StyleSheet.create({
	viewios: {},
	viewStyle0: {
		height
	},
	viewStyle1: {
		height: 5 * height
	},
	viewandroid: {
		height: height
	},
	wrapper: {
		height: 120,
		backgroundColor: '#000',
	},
	button: {
		height: 50, backgroundColor: '#00b324', position: 'absolute', width, left: 0, right: 0, bottom: 0
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
	warning: {
		height: 35,
		width: width,
		backgroundColor: '#013626',

	},
	warningT: {
		height: 30,
		marginTop: 10
	},
	warningText: {
		color: '#fff',

	},
	gameBg1: {
		backgroundColor: "#fff",
		padding: 12
	},
	gameBg2: {
		backgroundColor: "#fff",
		padding: 12,
		borderTopWidth: 1,
		borderColor: '#fff'
	},

	GameBox: {
		height: height - 230,
		backgroundColor: "#fff",
		width: width,
		flexWrap: 'wrap',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,


	},
	GameImg: {
		width: 175,
		flexWrap: 'wrap',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 15,
		paddingBottom: 15,
		marginLeft: 6,
		marginBottom: 6,
		borderWidth: 5,
		borderColor: '#d3d3d3'
	},

	preferentImg: {
		marginTop: -15, width: width, height: 200, backgroundColor: '#d3d3d3'
	},
	openPreferential: {
		borderRadius: 18,
		marginTop: 10,
		width: 110,
		padding: 5,
		backgroundColor: '#00633c',
	},
	modalContainer: {
		backgroundColor: 'rgba(0, 0, 0, .6)',
		width,
		height,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalContainerBox: {
		width: .9 * width,
		borderWidth: 1,
		borderColor: '#00B324',
		backgroundColor: '#000000',
		paddingVertical: 20,
		position: 'relative',
		alignItems: 'center'
	},
	closeBtn: {
		position: 'absolute',
		top: 10,
		right: 10
	},
	closeBtnText: {
		color: '#fff',
		fontSize: 20
	},
	circleBox: {
		width: 70,
		height: 70,
		backgroundColor: '#0BACFF',
		borderRadius: 1000,
		alignItems: 'center',
		justifyContent: 'center'
	},
	circleBoxText: {
		fontSize: 40,
		fontWeight: 'bold',
		color: '#000000'
	},
	modalText: {
		color: '#fff',
		paddingTop: 20,
		paddingBottom: 30
	},
	cancleBtn: {
		height: 36,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#00B324',
		width: width * .45,
		borderRadius: 6
	},
	cancleBtnText: {
		color: '#fff'
	},
	liveChatModalContainer: {
        width: width * .8,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: "#00B32480",
        elevation: 4,
        position: 'relative',
        paddingTop: 25,
        paddingBottom: 40
    },
    liveChatIconImg: {
        width: 56,
        height: 60
    },
    liveChatTextInfor: {
        color: '#fff',
        marginTop: 24,
        marginBottom: 40,
        marginHorizontal:32,
        lineHeight:24,
        textAlign:'center'
    },
    liveChatBottomBtn: {
        backgroundColor: '#00B324',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#00B324',
        width: width * .5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    liveChatBottomBtnText: {
        color: '#F5F5F5'
    },
	liveChatModal:{
		width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        alignItems: 'center',
        justifyContent: 'center'
	},
	closeBtn: {
        position: 'absolute',
        right: 12,
        top: 10,
        zIndex: 100
    },
    closeBtnText: {
        color: '#fff',
        fontSize: 18
    },
	modalBottomContainer: {
        alignItems: 'center'
    },
});
