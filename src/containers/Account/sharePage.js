import React from 'react';
import { StyleSheet, WebView, Text, View, Animated, TouchableOpacity, Dimensions,Clipboard,PermissionsAndroid,Alert,Linking,CameraRoll, Image, Platform, TextInput,ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, ActivityIndicator, List, Picker } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import QRCodeS from 'react-native-qrcode'; 
import QRCodeA from 'react-native-qrcode-svg';
import ViewShot from "react-native-view-shot"; 
const {
    width, height
} = Dimensions.get('window')


class SharePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Url: '',
        }
    }
    componentDidMount() {
        this.GetDownloadLink()
    }
    GetDownloadLink() {
        Toast.loading('กำลังโหลด',200)
        // Toast.loading('二维码加载中,请稍候...', 200);
        fetchRequest(ApiPort.GetDownloadLink + 'affiliateCode=' + (affCodeKex && affCodeKex || '') + '&domain=' + SBTDomain + '&', 'GET')
        .then((data) => {
            if (data.downloadLinks[0]) {
                let url = data.downloadLinks[0].downloadUrl;
                if (url) { Toast.hide() }
                this.setState({
                    Url: url
                })
            }
        })
        .catch((err) => {})
    }
    async copy(){
        Clipboard.setString(this.state.Url);
        Toast.success("คัดลอกแล้ว", 2);
    }
    
    async getPermissions() {
    
        try {
          const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE; 
          await PermissionsAndroid.request(permission);
          Promise.resolve();

          setTimeout(()=>{ 
            this.refs.viewShot.capture().then(
                uri => this.SaveQrCode(uri),
                error => Toast.fail(error)
            );  
           },1000)  
        } catch (error) {
          Promise.reject(error);
         
        }
      }

    saveImg(img) { 
        if(this.state.Url == '') {return}
        if(Platform.OS == "android"){
            this.getPermissions();
         }else{
            this.refs.viewShot.capture().then(
                uri => this.SaveQrCode(uri),
                error => Toast.fail(error)
            ); 
         }
          
	}



	SaveQrCode(uri){
        let promise = CameraRoll.saveToCameraRoll(uri) 
        
		promise.then((result)=> { 
                Toast.success('บันทัก QR สำเร็จ',2); 
			}).catch((error)=> { 
                let errorMsg = Platform.OS == "ios" ?'กรุณาเปิดการตั้งค่าการใช้งานรูปที่ iPhone ของคุณ' : 'กรุณาเปิดตั้งค่าอนุญาติใช้งาน APP JBO ที่โทรศัพท์ของคุณ'
                    Alert.alert('บันทัก QR ไม่สำเร็จ',errorMsg)  

             });
              
    }

    render() {

        return (
            <View style={{felx:1,height:height,backgroundColor:'#0a0a0a',padding: 25}}>
                <View style={{display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
                    {
                        this.state.Url != '' &&
                         <ViewShot ref="viewShot" options={{ format: "jpg", quality: 0.9 }}> 
                               <QRCodeA  ref="viewShot"
                               value={this.state.Url}
                               size={160}
                               bgColor='#000'
                               />   
                        </ViewShot>
                    }
                </View>
                <Touch style={{width:width,height:20}} onPress={()=> this.copy()} style={{width: '100%'}}>
                    <View style={styles.copyBtn}> 
					    <Image resizeMode='stretch' source={require('../../images/user/icon-share.png')} style={{ width: 24, height: 24}} />
						<Text style={{fontSize:14,color:'#fff'}}>คัดลอกลิงค์</Text>
                        {/* <Text style={{fontSize:14,color:'#fff'}}>复制下载链接</Text> */}
					</View> 
                </Touch>
                <Touch style={{width:width,height:20}} onPress={()=> this.saveImg()} style={{width: '100%'}}>
                    <View style={styles.copyBtn}> 
					    <Image resizeMode='stretch' source={require('../../images/icon-withdraw.png')} style={{ width: 24, height: 24}} />
						<Text style={{fontSize:14,color:'#fff'}}>บันทึกคิวอาร์โคดไปที่อัลบัม</Text>
                        {/* <Text style={{fontSize:14,color:'#fff'}}>保存二维码到相册</Text> */}
					</View> 
                </Touch>

 

            </View>		

        )
    }
}


export default (SharePage);



const styles = StyleSheet.create({
    copyBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#00e62c',
        marginTop: 30,
        borderRadius: 5,
        height: 40,
    },
});