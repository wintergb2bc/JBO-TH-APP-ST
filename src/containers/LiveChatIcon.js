import React from 'react';
import {Image, Text} from 'react-native';
import { View } from 'react-native-animatable';
 
  //用於全局刷新 Main 客服圖標  benji 7/27 /2020


class LiveChatIcon extends React.Component {
	
	
	constructor(props) {
	    super(props); 
	    this.state = {
			liveKey:Math.random()
	    } 
	  }
	 
 
  render () { 
	 const {liveKey} =this.state;
     window.LiveChatIconGlobe = () =>{
	 	this.setState({
			liveKey:Math.random()
		 })  
 
	 } 
	
	 return (
			 <View key={liveKey}> 
	   			   <Image resizeMode='stretch' source={LivechatDragType == false ?  require('../images/home/icon_cs_new.png') :require('../images/home/icon-cshover.png')} style={{ width: 28, height: 28,marginRight: 10}} />
			</View>			
    )
  }
}

 

export default(LiveChatIcon);



