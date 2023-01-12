import React from 'react';
import { StyleSheet, Text,TextStyle,Image, View ,ViewStyle,ScrollView,TouchableOpacity,Dimensions,Platform,FlatList,RefreshControl} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Accordion from 'react-native-collapsible/Accordion';
import { Toast,Carousel,Flex,Picker,List,Tabs,WhiteSpace} from 'antd-mobile-rn';
import AutoWebView from 'react-native-webview-autoheight';

import HTMLView from 'react-native-htmlview'; 

const {
  width ,height
} = Dimensions.get('window')



class News extends React.Component {
	 
	
	constructor(props) {
	    super(props);  
	    this.state = {
	      		Button1:'', 
				DataNumber:10,
				dEnumber:0, 
				Gametitle:'',
				Gameimage:'',
				Promotions:'',
				PromotionCategorie:'', 
				PromotionCategories:'', //優惠分類
				refreshing: false,
                isLoreMoreing: 'LoreMoreing',
		        dataSource: [],  
				reload:false, 
				activeSections:'',
				activeSections2:'',
				activeSections3:'',
				activeSections4:'',
				activeSections5:'',
				activeSections6:'',
				emergencyAnnouncements:'',
				newsAnnouncements:'',
				memberNotifications:'',
				promotionAnnouncements:'',
				walletNotifications:'',
				AllNewsData:'', //全公告
				deposit:'',  //存款
				withdrawals:'', //提款
				preferential:'',   //紅利

			
				
	    } 
			this.responseData = [];  
	  }
		
	componentWillMount(props) { 
		let ST =this.state;
				
		 
 											
		this.GetNews();
			 
				
				
	  }
	
	 
	//跳轉
	navigateToScene(key,GameOpenUrl){
		console.log(key)
		
		console.log(GameOpenUrl)
	
	   Actions[key]({GameOpenUrl:GameOpenUrl});
	
		
	}
	
 
	    //獲取新聞
		    GetNews() { 
				    		//Toast.loading('加载中,请稍候...',200);
						   
								let ST = this.state;

								let deposit = new Array;  //存款
								let withdrawals= new Array;   //提款
								let preferential= new Array;  //優惠 
								
								fetchRequest(ApiPort.News, 'GET')
										.then(data => {
												 data.memberNotifications.map(function (item, key) {
														 if(item.category ==1|| item.category == 2){
															deposit.push(item)
														 }else if(item.category == 3 || item.category == 4){
															withdrawals.push(item)
														 }else{
															preferential.push(item)
														 } 
													});

													this.setState({
														deposit:deposit,
														withdrawals:withdrawals,
														preferential:preferential
													})

													console.log(withdrawals)


													//ST.walletNotifications = data.walletNotifications
															//console.log(ST.AllNewsData)



											     	this.Refresh(deposit)  
												
													
											}).catch(error => {
											//	Toast.hide();
												 
										}) 
		    }
				
				
		 

 
 
				
	onChange = (key) => {
    console.log(key);
  }
	
	
	onTabClick = (key) =>{    //tabs切換
		let msg;
		let item = key.title
		let ST = this.state;
		
		 if(item == '存款消息'){
			 
			
		 }else if(item == '提款消息'){
			 
			
		}else if(item == '紅利消息'){  //暫時沒有
			 
			
		} 
		
		  	
	 }
		
	 Refresh = (data)=> {
		console.log(data.length )
		console.log(this.state.dataSource.length)
		if( data.length == this.state.dataSource.length){
			return;
		} 
 
		  this.setState({
			  refreshing: true,
		  });
  
			  //默认选中第二个
			  this.responseData = data.slice(this.state.dEnumber,this.state.DataNumber)
			  this.setState({
				  refreshing: false,
				  dataSource: this.responseData,
				  dEnumber:this.state.dEnumber+10,
				  DataNumber:this.state.DataNumber+10
			  });
			  this.isLoreMore = false;
		  
	  }
   
	  isLoreMore = false;
			  
	  LoreMore = ()=> {
		  
			  
		   let Datalength= this.state.walletNotifications.length;
		  
			  this.setState({
				  isLoreMoreing: 'LoreMoreing',
			  });
						if(this.responseData.length >= Datalength){
							  this.responseData = this.responseData.concat(this.state.walletNotifications.slice(Datalength,Datalength));
  
						  }else{
							  this.responseData = this.responseData.concat(this.state.walletNotifications.slice(this.state.dEnumber,this.state.DataNumber));
						  }
			  
			  this.setState({
					  dataSource: this.responseData,
					  isLoreMoreing:this.responseData.length >= Datalength ?'LoreMoreEmpty' :'LoreMoreing' ,
					  dEnumber:this.state.dEnumber >= Datalength ? Datalength :this.state.dEnumber+10,
					  DataNumber:this.state.DataNumber >= Datalength ? Datalength : this.state.DataNumber+10
			   })
		  
	  }
	 
			
  render () {
		
		  const {deposit,withdrawals,preferential,promotionAnnouncements,walletNotifications} =this.state;
		  
		  const tabs = [
		  //	{ title: '全部' },
		  	// { title: '普通公告' },
			// 	{ title: '特別公告' },
			// 	{ title: '优惠公告' },
				{ title: '存款消息' },
				{ title: '提款消息' },
				{ title: '优惠红利' },
		  ]; 
			 
			
    return (
		
	      <View style={{flex:1,backgroundColor:'#0a0a0a'}}>
  

  
			   <Tabs onChange={this.onTabClick}  tabs={tabs} tabBarInactiveTextColor={{color:'#959595'}} tabBarTextStyle={{color:'#fff'}} tabBarActiveTextColor={{color: '#fff'}}tabBarBackgroundColor={{backgroundColor: '#171717'}} tabBarUnderlineStyle={{backgroundColor: '#17fe00',height:1}}>
				        
              
							
			  <View style={{ flex: 1 }}>{/*2*/}
		 

				{this.state.deposit == "" && this.state.deposit.length != 0 ? 
					<View style={styles.header2}>
					<View> 
					<Text style={styles.headerTextA2}></Text>
					</View> 
						<View style={{paddingTop:5}}>   
						   <Text style={{color:"#626262",textAlign:'center'}}>กำลังโหลด..</Text>
							{/* <Text style={{color:"#626262",textAlign:'center'}}>数据加载中..</Text> */}
						</View> 
						<View style={styles.content}>
						<Text style={styles.headerTextB2}></Text>  
						</View> 
					</View>  
				   :this.state.deposit.length == 0 && 
				   <View style={styles.header2}>
				   <View> 
				   <Text style={styles.headerTextA2}></Text>
				   </View> 
				   		<View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
							<Text style={{ color: "#cdcdcd", textAlign: "center" }}>
							暂无消息
							</Text>
                  		</View>
					   <View style={styles.content}>
					   <Text style={styles.headerTextB2}></Text>  
					   </View> 
				   </View> 
				  }



				   {this.state.deposit != "" &&  
					<FlatList
                    showsVerticalScrollIndicator={false}//是否显示垂直滚动条
                    showsHorizontalScrollIndicator={false}//是否显示水平滚动条
                    numColumns={1}//每行显示1个
                    ref={(flatList)=>this._flatList = flatList}
                    renderItem={this.renderRow} 
                    enableEmptySections={true}//数据可以为空
				    onEndReachedThreshold={0.1}//执行上啦的时候10%执行
				    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={(item, index)=>item.key = index}
                    onEndReached={this.LoreMore}
					data={this.state.deposit}
					extraData={this.state.deposit}
                   
                        />
					}


			     
							
			 </View>
							
              <View style={{ flex: 1 }}>{/*3*/} 
			     
              

			  {this.state.withdrawals == ""  && this.state.withdrawals.length != 0? 
					<View style={styles.header2}>
					<View> 
					<Text style={styles.headerTextA2}></Text>
					</View> 
						<View style={{paddingTop:5}}>    
						<Text style={{color:"#626262",textAlign:'center'}}>กำลังโหลด..</Text>
							{/* <Text style={{color:"#626262",textAlign:'center'}}>数据加载中..</Text> */}
						</View> 
						<View style={styles.content}>
						<Text style={styles.headerTextB2}></Text>  
						</View> 
					</View>  
				   :this.state.withdrawals.length == 0 && 
				   <View style={styles.header2}>
				   <View> 
				   <Text style={styles.headerTextA2}></Text>
				   </View> 
				   		<View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
							<Text style={{ color: "#cdcdcd", textAlign: "center" }}>
							暂无消息
							</Text>
                  		</View>
					   <View style={styles.content}>
					   <Text style={styles.headerTextB2}></Text>  
					   </View> 
				   </View> 
				  } 


				  {this.state.withdrawals != "" &&  
				   <FlatList
				   showsVerticalScrollIndicator={false}//是否显示垂直滚动条
				   showsHorizontalScrollIndicator={false}//是否显示水平滚动条
				   numColumns={1}//每行显示1个
				   ref={(flatList)=>this._flatList = flatList}
				   renderItem={this.renderRow} 
				   enableEmptySections={true}//数据可以为空
				  onEndReachedThreshold={0.1}//执行上啦的时候10%执行
				   ListFooterComponent={this.renderFooter}//尾巴
				   keyExtractor={(item, index)=>item.key = index}
				   onEndReached={this.LoreMore}
				   data={this.state.withdrawals}
				   extraData={this.state.withdrawals}
				  
					   />
				   }

					 
							
              </View>
								 
			   <View style={{ flex: 1 }}>{/*4*/} 
							
			   { this.state.preferential.length != 0 && this.state.preferential == "" &&
                   
				   <View style={styles.header2}>
				   <View> 
				   <Text style={styles.headerTextA2}></Text>
				   </View> 
					   <View style={{paddingTop:5}}>   
					   <Text style={{color:"#626262",textAlign:'center'}}>กำลังโหลด.. </Text> 
						   {/* <Text style={{color:"#626262",textAlign:'center'}}>数据加载中.. </Text> */}
					   </View>

					   <View style={styles.content}>
					   
						   
					   </View>

				   </View> 
				  }


                 { this.state.preferential.length == 0 &&
                   
				   <View style={styles.header2}>
				   <View> 
				   <Text style={styles.headerTextA2}></Text>
				   </View> 
					   <View style={{borderRadius: 120,width: 120,height: 120,backgroundColor: '#4d4d4d', justifyContent: 'center' }}>
							<Text style={{ color: "#cdcdcd", textAlign: "center" }}>
							暂无消息
							</Text>
                  		</View>
					   <View style={styles.content}>
					   <Text style={styles.headerTextB2}></Text> 
						   
					   </View>

				   </View> 
				  }


				  {this.state.preferential != "" &&  
				   <FlatList
				   showsVerticalScrollIndicator={false}//是否显示垂直滚动条
				   showsHorizontalScrollIndicator={false}//是否显示水平滚动条
				   numColumns={1}//每行显示1个
				   ref={(flatList)=>this._flatList = flatList}
				   renderItem={this.renderRow} 
				   enableEmptySections={true}//数据可以为空
				  onEndReachedThreshold={0.1}//执行上啦的时候10%执行
				   ListFooterComponent={this.renderFooter}//尾巴
				   keyExtractor={(item, index)=>item.key = index}
				   onEndReached={this.LoreMore}
				   data={this.state.preferential}
				   extraData={this.state.preferential}
				  
					   />
				   }
												
				 </View>	 
							
							<View style={{ flex: 1 }}>{/*5*/} 
							
							   

							</View>
							
							<View style={{ flex: 1 }}>{/*6*/} 
							
						 
												
												
							</View>
								
						 
							
							<View style={{ flex: 1 }}>{/*7*/} 
							<ScrollView style={{flex:1}}>
							
							 	
														
													 <Flex>
													 <View style={{width:width,padding:20}}>
													 <Text style={{textAlign: 'center'}}>暂无数据..</Text>
													 </View>
													 
													 </Flex>
														  
												</ScrollView>
							</View>
							
							
							
							
			    </Tabs>

  

        </View>
						
    )
  }

  renderRow = (data) => {
	let item = data.item; 
//	console.log(item)
	return ( 
	<View key={data.index} style={styles.headerTop}>
      <View> 
        <Text style={[styles.headerTextA2,{lineHeight:30}]}>{item.message}</Text>
      </View> 
			<View style={{paddingTop:5}}>   
				<Text style={[styles.headerTextB2,{textAlign:'right',lineHeight:30}]}>{item.createdDate !='' &&item.createdDate.split("T").join("  ").split('.')[0]}</Text>
			</View>
   
	 </View>

 
	 
	)
}

 
 renderFooter = ()=> {

	if (this.state.dataSource.length != 0 && this.state.isLoreMoreing == 'LoreMoreing') {
		return (
			<View></View>
		)
	} else if (this.state.isLoreMoreing == 'LoreMoreEmpty') {
		return (
			<View style={{
				height: 0,
				backgroundColor: 'rgb(200,200,200)',
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<Text>{''}</Text>
			</View>
		)
	} else {
		return null
	}

}


}


export default (News);



const styles = StyleSheet.create({
	header:{
		width:width,
    paddingLeft:10,
		paddingTop:18,
		paddingBottom:18,
		backgroundColor: '#f9f9f9',
		borderBottomWidth: 1,
		borderColor: '#acacac',
		opacity:0.4
	},
	header2: {
		width: width,
		paddingLeft: 10,
		paddingTop: 48,
		paddingBottom: 18,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	  },
	  headerTop: {
		width: width,
		paddingLeft: 10,
		paddingTop: 18,
		paddingBottom: 18,
		paddingRight:10,
		backgroundColor: "#0a0a0a",
		borderBottomWidth: 1,
		borderColor: "#505050",
	  },
	
	content:{
	},
	
	header3:{
		width:width,
		paddingLeft:10,
		paddingTop:18,
		paddingBottom:18,
		backgroundColor: '#f9f9f9',
		borderBottomWidth: 1,
		borderColor: '#00805a',
	},
	
	headerTextA:{
		color:"#000",
	},
	headerTextB:{
		color:"#626262",
	},
	headerTextA2:{
		color:"#fff",
	},
	headerTextB2:{
		color:"#fff",
	},
	
	
	
	headerTextA3:{
		color:"#00805a",
	},
	headerTextB3:{
		color:"#626262",
	},
	
	autoWebView: { 
		width:width,
		height:100,
		backgroundColor: '#fff'
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
	   	backgroundColor:"#fff",
    	width: width,
	 		flexWrap: 'wrap',
	 		display:'flex',
	 		flexDirection: 'row',
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
		 marginTop:-15,width: 168, height: 100,backgroundColor: '#d3d3d3'
	 },
	 openPreferential:{
		borderRadius:18,
		marginTop:10,
		width:110,
		padding:5,
		backgroundColor: '#00633c',
	 }
  
});