import React from 'react';
import { StyleSheet, Text,TextStyle,Image, View ,ViewStyle,ScrollView,TouchableOpacity,Dimensions,Platform,ImageBackground,RefreshControl} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Toast,Flex} from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown';  
import Video from './Video';
import HTMLView from 'react-native-htmlview';
import Carousel, { Pagination } from "react-native-snap-carousel"; 

const {
  width ,height
} = Dimensions.get('window')



  

class Sponsorship extends React.Component {
	 
	constructor(props) {
	    super(props);  
	    this.state = {
		     	TypeId:this.props.TypeId, 
				DataNumber:10,
				dEnumber:0,
				//type:this.props.data,//遊戲類型
				Gametitle:'',
				Gameimage:'',
				Promotions:'',
				SponsorshipList:'', 
				SponsorshipDB:'',
				rate: 1,
				volume: 1,
				muted: false,
				resizeMode: 'contain',
				duration: 0.0,
				currentTime: 0.0,
				paused: true,
				fullScreen:false,
				BannerDB:'',
				activeSlide:'',
	    } 
			this.responseData = [];  
	  }
		
	componentWillMount(props) { 
		 this.GetMsg();
	 }
	
	 
	//跳轉
	navigateToScene(key,GameOpenUrl){ 
	   Actions[key]({GameOpenUrl:GameOpenUrl});
  
		
	}
  
			
				 //獲取優惠數據
	      GetMsg(key) {
			
			fetch(
				"https://www.jbo74.com/cms/Sponsorship/sponsorship_Page_Mobile.json?v=" +
				  Math.random(),
				{
				  method: "GET"
				}
			  )
				.then(response => (headerData = response.json()))
				.then(responseData => {
				  // 获取到的数据处理
				  if (responseData.length) {

					let DB 
					responseData.map((item)=> {
						if(item.id == this.state.TypeId){
								 DB =item 
						}   
					})
					

					  this.setState({
						BannerDB:DB.Banner ? DB.Banner :'',
						SponsorshipDB:DB
					  })
 
				  }
				})
				.catch(() => {
				  // 错误处理
				});

		   }
				
			 	 
		   fullScreen(){ 
				this.setState({
			     	fullScreen:this.state.fullScreen == false ?true:false
				 })
				 
		   }

		   CheckBanner(key){ 
			   this.setState({
				activeSlide:key
			   })
		   }

		   renderPage({ item, index }) { 
			return (
			  <View key={index}> 
				  <Image
					resizeMode="stretch"
					style={{ width: width, height: height / 4.6 }}
					source={{ uri: item.Image }}
				  /> 
				  <Text style={{color:'#fff',fontSize:12,textAlign:'center',left:20,paddingTop:5,width:width-110}}>{item.Text}</Text>
				  
			  </View>
			);
		  }
			
      render () {
		
		  const {SponsorshipDB,fullScreen,BannerDB,activeSlide,PromotionCategorie,dataSource,Promotions} =this.state;
		  let htmlContent = "<div>"+SponsorshipDB.Text+"</div>";
		  window.GetGameListReload = () => {
			  this.GetGameListReload();
		  }
		 
		 
       return (
		
	        <View style={{flex:1, backgroundColor:"#000",  alignItems: 'center', justifyContent: 'center',}}> 
			     
				 
						{SponsorshipDB != ""  &&  

						<ScrollView 
						automaticallyAdjustContentInsets={false}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}  
						> 

						<View style={styles.wrapper}>
          					   <Image resizeMode='stretch' source={{uri:SponsorshipDB.Header_Banner}} style={styles.SponsorshipList} /> 
                         </View>
 
						 <View style={{padding:10,paddingBottom:20,paddingTop:20,}}>   
							 
								 <HTMLView value={htmlContent} stylesheet={styles}/>
							 
						 </View>
						 {SponsorshipDB.Video &&  
				    	<View style={fullScreen == true ? styles.fullScreenTrue : styles.fullScreenfalse }>
					    
						<Video fullScreenbutton={this.fullScreen.bind(this)} Videodb={SponsorshipDB.Video} />
					      
				     </View>
						}

			{BannerDB != ""  &&  
					 <View style={{padding:10,paddingBottom:20,paddingTop:20,}}>  
							 <Text style={{color:'#fff',fontSize:16,fontWeight:'bold',textAlign:'center'}}>News</Text>
						 </View>

					}


		  <ImageBackground style={{ flex: 1 }}  source={require('../../images/Sponsorship/BG.png')}>

						 {BannerDB != ""  &&  
					 <View style={styles.wrapper}>
						<Carousel
						 ref={ ref => this.carouselRef = ref }
						data={BannerDB}
						renderItem={this.renderPage}
						sliderWidth={width}
						itemWidth={width}
						onSnapToItem={index => this.setState({ activeSlide: index })}
						inactiveSlideOpacity={ 1 }
						inactiveSlideScale={ 1 }
						/>


						<Pagination
							containerStyle={{
							flexDirection : 'row',
							height : 50,
							paddingTop : 40,
							paddingBottom : 0
							}}
							renderDots={ activeIndex => (
								BannerDB.map((ioniconName, i) => { 
									return( 
											<View
									style={{ flex : 1, alignItems : 'center' }}
									key={ i }
									> 
								    	<Image resizeMode='stretch' source={{uri:ioniconName.Image}} style={{width:80,height:40}} />  
										{i == activeSlide ?  
										
										<View style={{backgroundColor:'#4ee42b',width:50,height:10,borderRadius:5,top:10,left:-10}}></View>
										:  
										<View style={{backgroundColor:'#737373',width:50,height:10,borderRadius:5,top:10,left:-10}}></View>
										}
								 
									</View>
									)
								
									})
							)}
							activeDotIndex={ this.state.activeTab }
							dotsLength={ BannerDB.length }
							tappableDots={ !!this.carouselRef }
							carouselRef={ this.carouselRef }
							activeDotIndex={activeSlide} 
						/>
 
					</View>
						 }



     			 </ImageBackground>
				  {BannerDB != ""  &&  
					   <View style={{position:'relative'}}>
					   <Image
                      style={{width:90,height:60,position:'absolute',top:-270,left:50}}
                      resizeMode="stretch"
                      source={require("../../images/Sponsorship/greenbar.png")}
                    />
                         </View>
				  }
				   {BannerDB != ""  &&  

						 <View style={{position:'relative'}}>
					   <Image
                      style={{width:65,height:100,position:'absolute',top:-180,right:24}}
                      resizeMode="stretch"
                      source={require("../../images/Sponsorship/GREENBAR02.png")}
                    />
                         </View>
				  }
						 
					<View style={{marginBottom:100}}></View>

				 </ScrollView>
				 }
								
								 
	 
        </View>
						
    )
  }
}


export default (Sponsorship);



const styles = StyleSheet.create({

	  a:{
		fontWeight: '300',
		color: '#fff', // make links coloured pink
	  },
	  div:{
		  textAlign:'center',
		color:'#fff'
	  },

	fullScreenTrue:{
	   top:-90,
	   position:'absolute',
	},
	fullScreenfalse:{   
		alignItems: 'center', justifyContent: 'center',
	 },
	fullScreen:{
		width:width-20,
		height:400,
	},
	arrow:{
		marginLeft:5,
		marginTop:5,
		width:0,
		height:0,
		borderStyle:'solid',
		borderWidth:9,
		borderTopColor:'#1aff00',//下箭头颜色
		borderLeftColor:'#2a2a2a',//右箭头颜色
		borderBottomColor:'#2a2a2a',//上箭头颜色
		borderRightColor:'#2a2a2a'//左箭头颜色 
	},
  wrapper: { 
	  paddingBottom:10,
	  alignItems: 'center', justifyContent: 'center',
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
	   	 backgroundColor:"#171717",
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
			marginBottom:20,
	 }, 
 

	 SponsorshipList:{
		 width: width, height: height/4,
		
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
		width:width/2.7,
		height:280,
		marginRight:-15,
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


});