import React from 'react';
import { StyleSheet, Text,TextStyle,Image, View ,ViewStyle,ScrollView,TouchableOpacity,Dimensions,Platform,ImageBackground,RefreshControl,Animated,Linking,Modal} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Toast,Flex} from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown'; 

import PreferentialTutorial from "./preferentialTutorial"
const {
  width ,height
} = Dimensions.get('window')



const mDB = { 
	'Jan':'01',
	'Feb':'02',
	'Mar':'03',
	'Apr':'04',
	'May':'05',
	'Jun':'06',
	'Jul':'07',
	'Aug':'08',
	'Sep':'09',
	'Oct':'10',
	'Nov':'11',
	'Dec':'12', 
  }
 


const YPImage = {
	"迎新礼": require('../images/prmo/Icon1.png'),
	"专属": require('../images/prmo/Icon2.png'),
	"电竞": require('../images/prmo/Icon3.png'),
	"体育": require('../images/prmo/Icon4.png'),
	"真人娱乐": require('../images/prmo/Icon5.png'),
	"电玩": require('../images/prmo/Icon6.png'),
	"棋牌": require('../images/prmo/Icon7.png'),
	"彩票": require('../images/prmo/CP.png'),
 
}



let PUrl;

if(SBTDomain == 'http://www.staging.jbo88.biz'){
	PUrl = 'https://www.jbo69.com/cms/CNST/';
}else{
	PUrl = 'https://www.jbo69.com/cms/Json/';
}



class preferential extends React.Component {
	 
	constructor(props) {
	    super(props);  
	    this.state = {
	            Button1:'', 
				DataNumber:10,
				dEnumber:0,
				//type:this.props.data,//遊戲類型
				Gametitle:'',
				Gameimage:'',
				Promotions: [],
				PromotionCategorie:'', 
				PromotionCategories: [], //優惠分類
				refreshing: false,
				PromoKEY: 'all',
				isLoreMoreing: 'LoreMoreing',
				dataSource: [],
				reload:false,
				BannerDB:'',
				Cy:1,
				showTutorial:false,
				isShowLiveChatModal:false,
            	liveChatUrl:null,
	    } 
			this.responseData = [];  
			this.setTimeoutLiveChat = null
		this.willFocusSubscription =null;
	  }

	  componentDidMount(props) {
		  //彈客服窗
		this.listenFocus()
		this.listenBlur()

	  }
		
	componentWillMount(props) {
	     //this.showTutorial();   //新手教程 TH版mockup沒有 先刪除
		  this.GetGameList();
		  this.PromotionCat();  
  
	  }

	  listenFocus(){
        this.willFocusSubscription = this.props.navigation.addListener(
			'willFocus',() => {
                console.log('willFocus')
				this.setTimeoutLiveChat && clearTimeout(this.setTimeoutLiveChat)
			   //彈客服窗
			   if(!ApiPort.UserLogin){
				this.setTimeoutLiveChat = setTimeout(()=>{
					  this.getLiveChat()
				  }, 300000) 
			  }
			 }
		  );
    }

	listenBlur(){
        this.willFocusSubscription = this.props.navigation.addListener(
			'willBlur',() => {
                console.log('willBlur')
				this.setTimeoutLiveChat && clearTimeout(this.setTimeoutLiveChat)
			 }
		  );
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
            console.log('pre LiveChat data',data)
        })
        .catch(() => {});
    }


	//跳轉
	navigateToScene(key,GameOpenUrl){
		console.log(key)
		if(key == 'Promoguide_promopage'){
			UMonEvent('Promoguide_promopage')
		}
		console.log(GameOpenUrl)
	
	   Actions[key]({GameOpenUrl:GameOpenUrl});
 
	
		
	}

	GetBanner(){

		fetchRequest(ApiPort.Banner+'pageType=Promo&isLogin='+ApiPort.UserLogin+'&', 'GET')   
		.then(data => {  

			   if(data.length){
				   
				   this.setState({
                      BannerDB:data
				   })

			   }  
					
			}).catch(error => { 
				 
		})   
	} 
		
		//獲取優惠分類
		 
	PromotionCat() {
		global.storage.load({
			key: 'PromotionCategories' ,
			id: 'PromotionCategories'
		}).then(data => {
			this.setState({
				PromotionCategories: data,
				PromotionCategorie: data[0].label
			})
		}).catch(() => { })
		fetchRequest(ApiPort.GetPromotionCategories, 'GET').then(res => {
			let promotionContentCategoryDetails = res.promotionContentCategoryDetails
			if (promotionContentCategoryDetails.length) {
				let dataList = promotionContentCategoryDetails.map(function (item, key) {
					return { value: item.categoryId, label: item.resourcesName }
				});
				dataList.unshift({
					value: 'all',
					label: "ทั้งหมด", //"全部优惠",
				})
				this.setState({
					PromotionCategories: dataList,
					PromotionCategorie: dataList[0].label
				})
				global.storage.save({
					key: 'PromotionCategories',
					id: 'PromotionCategories',
					data: dataList,
					expires: null
				})
			}
		})
			 
	 		    }
	
		//獲取優惠數據
	GetGameList(key) {
		global.storage.load({
			key: 'Promotions',
			id: 'Promotions'
		}).then(promotionListing => {
			let tempPromotions = promotionListing
			let Promotions = []
			let double11List = tempPromotions.find(v => v.postId == 306)
			if (double11List) {
				Promotions = tempPromotions.filter(v => v.postId != 306)
				Promotions.unshift(double11List)
			} else {
				Promotions = tempPromotions
			}
		}).catch(() => {
			Toast.loading('กำลังโหลด...',200);
		})
		key && this.setState({
			refreshing: true
		})
		fetchRequest(ApiPort.GetPromotions, 'GET').then(res => {
			console.log('GetPromotions res',res)
			Toast.hide()
			let tempPromotions = res.promotionListing
			let Promotions = []
			let double11List = tempPromotions.find(v => v.postId == 306)
			if (double11List) {
				Promotions = tempPromotions.filter(v => v.postId != 306)
				Promotions.unshift(double11List)
			} else {
				Promotions = tempPromotions
			}
			if(Promotions.length) {
				//promotionDetailPromotionType == 5 的先顯示
				const JVENTPromotionsArray  = Promotions.filter(v=>v.promotionDetail.promotionDetailPromotionType == 5)
				const notJVENTPromotionsArray  = Promotions.filter(v=>v.promotionDetail.promotionDetailPromotionType !== 5)
				const newPromotionsArray = JVENTPromotionsArray.concat(notJVENTPromotionsArray)

				this.setState({
					Promotions: newPromotionsArray,
					refreshing: false
					// .sort((m, n) => m['seq'] - n['seq']),
				}, () => {}) 
				console.log(Promotions, 23132)
				global.storage.save({
					key: 'Promotions',
					id: 'Promotions',
					data: Promotions,
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}
			
		 
		//優惠打開
		openPref(item) {
		//promotionDetailPromotionType==5 跳轉活動頁面
		if(item.promotionDetail&&item.promotionDetail.promotionDetailPromotionType==5){
				if(item.promotionDetail.promotionDetailEventContent){
					let eventName=item.promotionDetail.promotionDetailEventContent.eventTitle
					let eventTemplate=item.promotionDetail.promotionDetailEventContent.eventTemplate
					isEventPreview=false
					getLotteryStatus(eventName,eventTemplate)
					return
				}
				
			}
		//  if(item.postId == 306) {
		// 	window.getLotteryStatus &&  window.getLotteryStatus('Promobanner_double11')
		// 	return
		//  }
		
	// 	if(ApiPort.UserLogin == false){
	// 		Toast.fail("ล็อคอิน" , 2);
	// 	   return;
	//    }
			if(item.promotionDetail.promotionDetailPromotionType == 5){
				UMonEvent('Engagement Event', 'Click', 'Enter_TI10_Promo');
				Actions.TI10Event();
				return
			}else {
				UMonEvent('Promo Nav', 'View', 'PromoTnC_ PromoPage');
			}

			///Toast.loading('优惠加载中,请稍候...',200); 
				// {uri:uri,img:img,contentId:key,promotionMasterCategory:promotionMasterCategory,bonusId:bonusId,titlename:title,PromoDB:this.state.Promotions[i]}
				Actions.preferentialPage({
					preferential: item
				}); 
	}
					
			 

	BannerOpenPromo() {
		let promotionListing = this.state.promotionListing
		//尋找對應id 開啟優惠
		let tempList = promotionListing.find(v => v.promotionDetail && v.promotionDetail.promotionDetailPromotionId * 1 === PromoID * 1)
		if(tempList) {
			setTimeout(() => {
				this.openPref(tempList)
				PromoID = '';
			}, 700)
		}
	}
			
	Refresh = (data)=> { 
            //默认选中第二个
            this.responseData = data.slice(this.state.dEnumber,this.state.DataNumber)
            this.setState({ 
                dataSource: this.responseData,
		        dEnumber:this.state.dEnumber+10,
				DataNumber:this.state.DataNumber+10
            });
            this.isLoreMore = false;
             
    }
 
    isLoreMore = false;
			
    LoreMore = ()=> {
        
			
		 let Datalength= this.state.Promotions.length;
        if (this.isLoreMore == false) {
            this.setState({
                isLoreMoreing: 'LoreMoreing',
            });
					  if(this.responseData.length >= Datalength){
							this.responseData = this.responseData.concat(this.state.Promotions.slice(Datalength,Datalength));

						}else{
							this.responseData = this.responseData.concat(this.state.Promotions.slice(this.state.dEnumber,this.state.DataNumber));
						}
            
            this.setState({
                    dataSource: this.responseData,
					isLoreMoreing:this.responseData.length >= Datalength ?'LoreMoreEmpty' :'LoreMoreing' ,
					dEnumber:this.state.dEnumber >= Datalength ? Datalength :this.state.dEnumber+10,
					DataNumber:this.state.DataNumber >= Datalength ? Datalength : this.state.DataNumber+10
             })
        }
    }
		 
			PromotionCatego = (key) => { 
				let piwkMsg;
					this.setState({ 
						PromotionCategorie:this.state.PromotionCategories[key].label,
						PromoKEY: this.state.PromotionCategories[key].value,
						Cy: this.state.PromotionCategories[key].value,
					}); 

					if(key == 0){
						piwkMsg = 'All'
					}
					if(key == 1){
						piwkMsg = 'Newmember'
					}
					if(key == 2){
						piwkMsg = 'Exclusive'
					}
					if(key == 3){
						piwkMsg = 'Esports'
					}
					if(key == 4){
						piwkMsg = 'Sports'
					} 
					if(key == 5){
						piwkMsg = 'P2P'
					}
					if(key == 6){
						piwkMsg = 'LiveCasion'
					}
					if(key == 7){
						piwkMsg = 'Slot'
					}
					if(key == 8){
						piwkMsg = 'Lottery'
					}
					if(key == 9){
						piwkMsg = 'Promoguide'
					}
					if(key == 10){
						piwkMsg = 'Mypromoguide'
					}
					if(key == 11){
						piwkMsg = 'Viewhistory_mypromo'
					}
					if(key == 12){
						piwkMsg = 'Rebateguide'
					} 
					UMonEvent(piwkMsg+'_promopage')
			}; 


			_dropdown_2_renderButtonText(rowData) {
				return `${rowData.label}`;
			}
			
		 
			
			_dropdown_3_renderRow(rowData, rowID, highlighted) {
			 
				//let icon = highlighted ? require('../../images/github.png') : require('../../images/bow.png');
				let evenRow = rowID % 2;
				let Cy = rowData.value
 
				return ( 
					   
				// <Flex style={{ width:width-20, backgroundColor: "#434343", paddingTop:6,paddingBottom:6}}>

				//  	<Flex style={[Cy == 1 ? styles.Aim_Orange:Cy == 2 ? styles.Aim_Yellow:Cy == 3 ? styles.Aim_Blue:Cy == 4 ? styles.Aim_Cyan:Cy == 5 ? styles.Aim_Brightred:Cy == 6 ? styles.Aim_Green:Cy == 7 ? styles.Aim_Purple :Cy == 8 && styles.Aim_Red  ,{backgroundColor: "#171717",width:120,left:7,paddingTop:6,paddingBottom:6,borderTopRightRadius: 3,  borderBottomRightRadius: 3,}]}>
									        	
			    //      <Flex.Item style={{paddingLeft:10,flex:0.1}}>
				// 	   <Image resizeMode='stretch' source={YPImage[rowData.label]} style={{width:16,height:16}}/>  
				// 	 </Flex.Item>


				// 	 <Flex.Item  style={{paddingLeft:5,flex:1}}>
				// 			<Text style={{color:'#fff'}}>  {`${rowData.label}`}</Text>
				// 		</Flex.Item>

				// 		</Flex>
		    
				//  </Flex>
				<View style={{ width:width/3.2, backgroundColor: "#141414",display:'flex',justifyContent: 'center',alignItems:'center',height:40}}>
					<Text style={{color:'#fff'}}>{`${rowData.label}`}</Text>
				</View>
 
					 
					 
				);
			}

			renderPage(image, index) {
				return (
					<View key={index}>
						<Image style={{ width: width/2, height: 195 }} source={require('../images/promobanner.jpg')} />
					</View>
				);
			}
			// 展示优惠教学
			showTutorial(){
				// 用户如果观看过不再提示
				global.storage.load({
					key:userNameDB + "preferentialTutorial",
					id:userNameDB + "preferentialTutorial",
				}).then(data=>{
					this.setState({
						showTutorial:false
					})
				}).catch(err=>{
					this.setState({
						showTutorial:true
					})
				})
			}
			// 关闭优惠教学
			closeTutorail(){
				this.setState({
					showTutorial:false
				})
				// 每个用户只提示一次
				global.storage.save({
					key:userNameDB + "preferentialTutorial",
					id:userNameDB + "preferentialTutorial",
					data:"showed",
					expires: null
				})
			}
      render () {
		
		  const {isShowLiveChatModal,liveChatUrl, refreshing, BannerDB,PromoKEY,Cy,PromotionCategories,PromotionCategorie,dataSource,Promotions} =this.state;
		  console.log('Promotions=',Promotions)
		 window.BannerOpenPR = ()=>{
			//  if(Promotions !=""){
			// 	this.BannerOpenPromo();
			//  }  
		 }
		 window.fromErurcup = () => { 
			this.PromotionCatego(4);
		}


		 window.GetGameListReload = () => {
			this.GetGameList();
		}
       return (
		
	        <View style={{flex:1,backgroundColor:"#1a1a1a"}}>

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
								<Image source={require('../images/liveChat_img.png')}  resizeMode='stretch' style={styles.liveChatIconImg}></Image>
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

				{this.state.showTutorial && <PreferentialTutorial closeTutorail={()=>{this.closeTutorail()}}/> }
			     
			    {/* <View style={styles.wrapper}>
             
				<Image resizeMode='stretch' style={{ width: width, height: height/5.5 }} source={require('../images/promobanner.jpg')} />
            </View> */}
								
								 
	  {/* <Flex style={styles.warning}>
			
	  	
				<Flex.Item style={{flex:0.6,left:10}} >
				<View style={[Cy == 1 ? styles.Aim_Orange:Cy == 2 ? styles.Aim_Yellow:Cy == 3 ? styles.Aim_Blue:Cy == 4 ? styles.Aim_Cyan:Cy == 5 ? styles.Aim_Brightred:Cy == 6 ? styles.Aim_Green:Cy == 7 ? styles.Aim_Purple :Cy == 8 && styles.Aim_Red,{backgroundColor: "#2a2a2a",width:150,paddingTop:6,paddingBottom:3,borderTopRightRadius: 3,  borderBottomRightRadius: 3,}]}>
					
				{ PromotionCategories == "" ?
										<Text style={{ fontSize: 14,color:'#fff' }}>数据加载中..</Text>
						: PromotionCategories != "" &&
										<ModalDropdown ref={el => this._dropdown_3 = el}  
											textStyle={styles.dropdown_D_text}
											dropdownStyle={styles.dropdown_DX_dropdown}
											options={PromotionCategories}
											renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
											renderRow={this._dropdown_3_renderRow.bind(this)}
											onSelect={this.PromotionCatego} 
										 >   
										<View style={{ flexDirection: 'row',paddingLeft:10}}> 
										<Image resizeMode='stretch' source={YPImage[PromotionCategorie]} style={{width:18,height:18}}/>
									
										 <Text style={{  fontSize: 14,color:'#fff' }}> {PromotionCategorie}</Text>  
										 <View style={styles.arrow}></View>
										</View>
                                     </ModalDropdown>
							      
								}
  
				</View>
			</Flex.Item>	
				
		{ApiPort.UserLogin == true &&
				<Flex.Item alignItems='flex-end' style={{flex:0.4,right:14}}>
				<TouchableOpacity onPress={()=> this.navigateToScene('Bonushistory')}>  
					<Text style={{color:'#fff',textAlign:'center',top:8,fontWeight:'bold'}}>申请记录</Text>  
			    </TouchableOpacity>
				</Flex.Item>   
			} 
		</Flex>    */}
		<View style={styles.titleTop}>
			<View style={{alignItems: 'center'}}>
				{
					!PromotionCategories ?
					<View>
						<Text style={{ fontSize: 14,color:'#fff' }}>กำลังโหลด..</Text>
					</View>
					: <View>
						<ModalDropdown ref={el => this._dropdown_3 = el}  
							textStyle={styles.dropdown_D_text}
							dropdownStyle={[styles.dropdown_DX_dropdown,{height: (PromotionCategories.length*40 + 3)}]}
							options={PromotionCategories}
							renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
							renderRow={this._dropdown_3_renderRow.bind(this)}
							onSelect={this.PromotionCatego} 
						>   
							<View style={{ flexDirection: 'row',paddingLeft:20}}> 
								<Text style={{  fontSize: 14,color:'#fff' }}> {PromotionCategorie}</Text>  
								<View style={styles.arrow}></View>
							</View>
                    </ModalDropdown>
					</View>
				}
			</View>
			<View style={{alignItems: 'center',paddingRight: 10}}>
				{
					ApiPort.UserLogin == true &&
					<TouchableOpacity onPress={()=> {
						UMonEvent('Promo History', 'View', 'Promo_ PromoPage');
						this.navigateToScene('Bonushistory')
					}}> 
						<Text style={{color:'#02bd24',textAlign:'center'}}>บันทึกการสมัครโปรโมชั่น</Text>   
						{/* <Text style={{color:'#02bd24',textAlign:'center',fontWeight:'bold'}}>申请记录</Text>   */}
					</TouchableOpacity>
				}
			</View>
		</View>
		<ImageBackground
            style={{ width: width, height: height, flex: 1 }}
            resizeMode="repeat"
            source={require("../images/home/pattern.png")}
          >
					        <ScrollView 
								 			automaticallyAdjustContentInsets={false}
								 			showsHorizontalScrollIndicator={false}
											 showsVerticalScrollIndicator={false}
											 refreshControl={
												<RefreshControl
													refreshing={refreshing}
													tintColor={'#fff'}
													onRefresh={() => {
														this.GetGameList(true)
													}}
												/>
											}
								 		> 
										<View style={styles.GameBox}> 
						   {
							   Promotions.length > 0 && (PromoKEY === 'all' ? Promotions : Promotions.filter(v => v.promotionCategoryIdList.map(v => v * 1).includes(PromoKEY * 1))).map((item, i) => {
								   return <View style={styles.GameImg} key={i}>
									   {
										   item.promotionBannerJFY && <ImageBackground
										   resizeMode='stretch'
											style={{width: 48, height: 20,
											justifyContent: 'center',
											alignItems: 'center',
											position: 'absolute',
											zIndex: 100,
											left: 0,
											top: 0
										}}
										   source={require('../images/prmo/prmoiCOn.png')}>
											    <Text style={{color: '#fff'}}>พิเศษ</Text>
											   {/* <Text style={{color: '#fff'}}>专属</Text> */}
										   </ImageBackground>
									   }
									   <TouchableOpacity style={styles.bonusBoxs} key={item.contentId} onPress={() => this.openPref(item)}>
									   <Image resizeMode='stretch' source={{ uri: (item.promotionBannerThumbnail) }} style={styles.preferentImg} />
									   </TouchableOpacity>
								   </View>
							   })
						   }
								 </View>

								 </ScrollView> 
							</ImageBackground>
        </View>
						
    )
  }
}


export default (preferential);



const styles = StyleSheet.create({
	arrow:{
		marginLeft:5,
		marginTop:5,
		width:0,
		height:0,
		borderStyle:'solid',
		borderWidth:6,
		borderTopColor:'#fff',//下箭头颜色
		borderLeftColor:'transparent',//右箭头颜色
		borderBottomColor:'transparent',//上箭头颜色
		borderRightColor:'transparent'//左箭头颜色 
	},
	titleTop: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#0a0a0a',
		paddingTop: 20,
		paddingBottom: 20,
	},
  wrapper: {
	height:height/5.5,
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

  bonusBoxs:{
	alignItems: 'center',
    justifyContent: 'center',
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
		height:45,
		width:width,
		backgroundColor: '#171717',
		borderBottomWidth: 1, 
		borderBottomColor: '#373737', 

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
	   	//  backgroundColor:"#171717",
    	  width: width,
	 		flexWrap: 'wrap',
	 		display:'flex',
	 		flexDirection: 'row', 
			alignItems: 'center',
			justifyContent: 'flex-start', 
			marginLeft:0,
			paddingTop:10,
	 		paddingBottom:10, 
	 }, 
	 GameImg:{
			width:'100%',
			flexWrap: 'wrap',
			flexDirection: 'column',
			alignItems: 'center',
			marginBottom:10,
			width: width, height: height/6,
	 }, 
 

	 preferentImg:{
		 width: width, height: height/6,
		
	 },
	 openPreferential:{
		borderRadius:18,
		marginTop:10,
		width:width/4,
		padding:5,
		backgroundColor: '#00633c',
	 },

	 dropdown_D_text: { 
		top:7,
		paddingBottom:13,
		fontSize: 15,
		color: '#fff',
	},
	dropdown_DX_dropdown:{ 
		width:width/3.2,
		height:320,
		marginRight:-15,
		borderWidth: 0,
		backgroundColor: '#141414'
	},

	dropdown_2_row: {
		flexDirection: 'row',
		height: 40,  
		alignItems: 'center',
		backgroundColor: '#012c1f',
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
	  
	  im_Green:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#30EA3C',
	 },
	 im_Red:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#FF3D5D',
	 },
	 im_Yellow:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#FFF500',
	 },
	 im_Orange:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#FFA700',
	 },
	 im_Cyan:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#32E2AD',
	 },
	 im_Blue:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#5084FF',
	 },
	 im_Purple:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#A3239F',
	 },
	 im_Brightred:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderLeftColor: '#FF0000',
	 },


 

	 Aim_Green:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#30EA3C',
	 },
	 Aim_Red:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#FF3D5D',
	 },
	 Aim_Yellow:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#FFF500',
	 },
	 Aim_Orange:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#FFA700',
	 },
	 Aim_Cyan:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#32E2AD',
	 },
	 Aim_Blue:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#5084FF',
	 },
	 Aim_Purple:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#A3239F',
	 },
	 Aim_Brightred:{   
		borderLeftWidth: 5,
		borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#FF0000',
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
class FadeInView extends React.Component{
	constructor(props) {
	  super(props);
	  this.state= {
		fadeAnim: new Animated.Value(0),//动画透明度
	  }
	}
	componentDidMount() {
	  Animated.timing(      
		  this.state.fadeAnim,          
		  {
			toValue: 1,                  
			duration: 1500,
			delay: this.props.delayTime,           
		  }
	  ).start();
	}
	render () {
	  let {fadeAnim} = this.state;
	  return(
		<Animated.View
		style={{
		  ...this.props.style,
		  opacity: fadeAnim,
		}}
		>
		  {this.props.children}
		</Animated.View>
	  ) 
	}
  }
