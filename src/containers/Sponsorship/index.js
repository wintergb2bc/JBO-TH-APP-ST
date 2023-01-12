import React from 'react';
import { StyleSheet, Text,TextStyle,Image, View ,ViewStyle,ScrollView,TouchableOpacity,Dimensions,Platform,ImageBackground,RefreshControl,Animated} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Toast,Flex} from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown'; 

const {
  width ,height
} = Dimensions.get('window')


 
 
class Sponsorship extends React.Component {
	 
	constructor(props) {
	    super(props);  
	    this.state = { 
				Gametitle:'',
				Gameimage:'',
				Promotions:'',
				SponsorshipList:'', 
				SponsorshipDB:'',
				PromotionCategories:'', //優惠分類
				refreshing: false,
				PromoKEY:1,
                isLoreMoreing: 'LoreMoreing',
                dataSource: [],
				reload:false,
				BannerDB:'',
				Cy:1,
	    } 
			this.responseData = [];  
	  }
		
	componentWillMount(props) { 
		 this.GetList();
	 }
	
	 
	//跳轉
	navigateToScene(key,id,name){  
		SponsorshipPageName = name; 
	   Actions[key]({TypeId:id}); 
	}
 
		//獲取list
		 
		GetList() { 

			fetch(
				"https://www.jbo74.com/cms/Sponsorship/sponsorship_List_Mobile.json?v=" +
				  Math.random(),
				{
				  method: "GET"
				}
			  )
				.then(response => (headerData = response.json()))
				.then(responseData => { 
				  // 获取到的数据处理
				  if (responseData.length) {
					this.setState({
						SponsorshipList: responseData
					});
				  }
				})
				.catch(() => {
				  // 错误处理
				});
			 
	    }
	
		 
			
				 //獲取優惠數據
	      GetMsg(key) {
			
			fetch(
				"https://www.jbo74.com/cms/Sponsorship/sponsorship_Page_Mobile?v=" +
				  Math.random(),
				{
				  method: "GET"
				}
			  )
				.then(response => (headerData = response.json()))
				.then(responseData => {
				  // 获取到的数据处理
				  if (responseData.length) {
					this.setState({
						SponsorshipDB: responseData
					});
				  }
				})
				.catch(() => {
				  // 错误处理
				});

		   }
				
			 	 
 
			
      render () {
		
		  const {SponsorshipList,BannerDB,PromoKEY,Cy,PromotionCategories,PromotionCategorie,dataSource,Promotions} =this.state;
		  
		  window.GetGameListReload = () => {
			  this.GetGameListReload();
		  }
	
		 
       return (
		
	        <View style={{flex:1,backgroundColor:"#1a1a1a",  alignItems: 'center', justifyContent: 'center',}}> 
				<ImageBackground
					style={{ width: width, height: height, flex: 1 }}
					resizeMode="repeat"
					source={require("../../images/home/pattern.png")}
				>

				 <ScrollView 
								 			automaticallyAdjustContentInsets={false}
								 			showsHorizontalScrollIndicator={false}
								 			showsVerticalScrollIndicator={false}
								 		> 
				 {SponsorshipList != "" && SponsorshipList.map((item,i) => { 

					 return(

						<View style={styles.wrapper}>
							<FadeInView delayTime={600*(i + 1)}>
							<TouchableOpacity onPress={()=> this.navigateToScene('SponsorshipPage',item.id,item.title)}>  
								{/* <FadeInView delayTime={100*i}> */}
								 <Image resizeMode='stretch' source={{uri:item.iconImageUrl}} style={styles.SponsorshipList} /> 
								 {/* </FadeInView> */}
								 <Text style={{color:'#fff',position:'absolute',bottom:5,left:10}}>{item.title}</Text>
							 </TouchableOpacity>
							 </FadeInView>
                         </View>

					 )

				 })
				 
				 
				 }


				 </ScrollView>
			
				</ImageBackground>		 
	 
        </View>
						
    )
  }
}


export default (Sponsorship);



const styles = StyleSheet.create({ 
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
	  paddingTop:10,
	  paddingBottom:10,
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
		 width: width, height: height/3.8,
		
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