import React, { Component } from 'react';
import { View, Image, Text, StyleSheet,Dimensions } from 'react-native'; 
let {width, height} = Dimensions.get("window");
class TabIcon extends Component {
    constructor(props){
        super(props);  
    }

    render(){
 
        let selected = this.props.focused;
        let data = {
 
            home:{ 
                ids: 1,
                title:"หน้าแรก",
                icon:!selected
                ? require("../images/home/tabIcon/icon_home_unselected.png")
                : require("../images/home/tabIcon/icon_home_selected.png"),
            },
            // livechat:{
            //     ids: 1,
            //     title:"客服",
            //     icon:!selected?require("../images/menu03.png"):require("../images/menu03Hove.png")
            // },
            preferential:{
                ids: 2,
                title:"โปรโมชั่น",
                icon:!selected
                ? require("../images/home/tabIcon/icon_promo_unselected.png")
                : require("../images/home/tabIcon/icon_promo_selected.png"),
            }, 
            deposit:{
                ids: 3,
                title:"การเงิน",
                icon:!selected
                ? require("../images/home/tabIcon/icon_wallet_unselected.png")
                : require("../images/home/tabIcon/icon_wallet_selected.png"),
            },
            news:{
                ids: 4,
                title:"消息",
                icon:!selected
                ?require("../images/menu02.png")
                :require("../images/menu02Hove.png"),
            },
            // Sponsorship:{
            //      ids: 5,
			// 	 title:"赞助",
			// 	 icon:!selected?require("../images/menu06.png"):require("../images/menu06Hover.png")
            //  },
            SponsorshipNew:{
                ids: 5,
                title:'สปอนเซอร์',
                //title:"赞助",
                icon:!selected
                ?require("../images/menu06.png")
                :require("../images/menu06Hover.png"),
            },						
            PersonalAccount:{
                ids: 6,
                //title:"ข้อมูลส่วนตัว"
                title:"บัญชี",
                icon:!selected
                ? require("../images/home/tabIcon/icon_me_unselected.png")
                : require("../images/home/tabIcon/icon_me_selected.png"),
            }, 	
			login:{
                ids: 7,
		     	title:"เข้าสู่ระบบ",
                 icon:!selected
                 ? require("../images/home/tabIcon/icon_me_unselected.png")
                 : require("../images/home/tabIcon/icon_me_selected.png"),
            }, 
            GamePageIM:{
                ids: 8,
                title:"",
			    icon:''
            },
            Vip: {
                ids: 9,
                title: "VIP",
                icon: !selected
                ? require("../images/home/tabIcon/icon_sponsor_unselected.png")
                : require("../images/home/tabIcon/icon_sponsor_selected.png"),
            },
            //合作加盟
            affCooperate: {
                ids: 10,
                title: "พันธมิตร",
                icon: !selected
                ? require("../images/home/tabIcon/icon_cooperate_unselected.png")
                : require("../images/home/tabIcon/icon_cooperate_selected.png"),
            },
            sprInstant: {
                ids: 11,
                title: "Aviator",
                icon: !selected
                  ? require("../images/home/tabIcon/icon_spr_unselected.png")
                  : require("../images/home/tabIcon/icon_spr_selected.png"),
              },
        }
      let param = data[this.props.navigation.state.key]; 
      return param.title != "" && selected == true ? (
        <View style={styles.tabbarContainerA}>
             {
                param.title!=="Aviator" ?
                <Image
                    style={{ width: 24, height: 24, resizeMode: "contain" }}
                    source={param.icon}
                />
                :
                <View style={{flexDirection:'row'}}>
                    <Image
                            style={{ width: 24, height: 24, resizeMode: "contain" }}
                            source={param.icon}
                    />
                    <Image resizeMode='contain' style={{width:20,height:19}} source={require("../images/home/tabIcon/new_label.png")}></Image>
                </View>    
                } 
                <Text style={[styles.tabbarItem2]}>{param.title}</Text>
        </View>
        ) :param.title != "" && selected == false ? (
           <View style={styles.tabbarContainer}>
                {
                    param.title!=="Aviator" ?
                    <Image
                        style={{ width: 24, height: 24, resizeMode: "contain" }}
                        source={param.icon}
                    />
                    :
                    <View style={{flexDirection:'row'}}>
                        <Image
                                style={{ width: 30, height: 24, resizeMode: "contain",marginTop:4 }}
                                source={param.icon}
                        />
                        <Image resizeMode='contain' style={{width:14,height:10,position:'absolute',right:-14,top:4,}} source={require("../images/home/tabIcon/new_label.png")}></Image>
                    </View>    
                    }
                 <Text style={[styles.tabbarItem]}>{param.title}</Text>
                {/* <Text style={{ 
                    marginTop:5,    
                    textAlign:"center",
                    color:'#8e8e8e',
                    //fontWeight:"bold",
                    fontSize: 12,
                 }}>{param.title}</Text> */}
            </View>)
        :   (
            param.title == '' && (
                <View style={{width:0,height:0}}> 
                    <Text style={[styles.tabbarItem]}>22</Text>
                </View>
            )
      );             
    }
}

const styles = StyleSheet.create({
    tabbarContainer:{
        flex:1,
        alignItems:"center",
        justifyContent:"center", 
        width:Dimensions.get("window").width/4, 
    },
    tabbarContainerA:{ 
        flex:1,
        alignItems:"center",
        justifyContent:"center", 
        width:Dimensions.get("window").width/4, 
        // borderBottomWidth: 3,
        // borderColor: '#47eb2c',   
    },
    tabbarItem:{  
        marginTop:5,    
        textAlign:"center",
        color:'#8e8e8e',
        //fontWeight:"bold",
        fontSize: 12,
    },
    tabbarItem2:{  
        marginTop:5,    
        textAlign:"center",
        color:'#47eb2c',
        fontSize:15,
        //fontWeight:"900",
        fontSize: 12,
      },
   
});

module.exports = TabIcon;