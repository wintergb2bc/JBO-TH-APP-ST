import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    Dimensions, 
    TouchableOpacity, 
    CameraRoll, 
    PermissionsAndroid, 
    Platform, 
    Modal
} from 'react-native';
import { Toast } from 'antd-mobile-rn';
import QRCodeA from 'react-native-qrcode-svg';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ViewShot from "react-native-view-shot";
const { width } = Dimensions.get('window');
{/* BQR第二步驟*/}
class BQRTransAct extends React.Component {
    constructor(props){
        super(props)
        this.okPayMoney = this.okPayMoney.bind(this);
        this.state = {
            MoneyNoticeShow: true,
            okCanSubmit: false,
            showSuccess:false,
        }
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
        if(this.props.qrcode == '') {return}
         if(Platform.OS == "android"){
            this.getPermissions();
          } else{
            this.refs.viewShot.capture().then(
                uri => this.SaveQrCode(uri),
                error => Toast.fail(error)
            ); 
        }
          
	}

    SaveQrCode(uri){
        let promise = CameraRoll.saveToCameraRoll(uri) 
        
		promise.then((result)=> { 
            this.haveSuccess();
                //Toast.success('บันทึกสำเร็จ',2); 
			}).catch((error)=> { 
                let errorMsg = Platform.OS == "ios" ?'กรุณาเปิดการตั้งค่าการใช้งานรูปที่ iPhone ของคุณ' : 'กรุณาเปิดตั้งค่าอนุญาติใช้งาน APP JBO ที่โทรศัพท์ของคุณ'
                    Alert.alert('บันทัก QR ไม่สำเร็จ',errorMsg)  

             });
              
    }

    haveSuccess() {
        this.setState({
            showSuccess:true
        },()=>{
            setTimeout(() => {
                this.setState({
                    showSuccess:false,
                })
            }, 1000)
       })
    }

    okPayMoney = () => {
        UMonEvent("Deposit", "Submit", "Submit_BankQR_Deposit")

        data = {
            "id": this.props.transactionId,
            "CurrencyCode":'THB',
            //"depositingBankAcctNum": this.props.depositingBankAcctNum,
            "hasQR":false,
            "offlineDepositDate": new Date(),
        }

        fetchRequest(ApiPort.GopayLB + this.props.transactionId + "/ConfirmStep?", "POST", data)
            .then((data) => {
            if(data.isSuccess == true){
                    Actions.CountdownPageTx({time: "30:00"});
                    return
                } else if (data.errorMessage == "ConfirmStep_Failed"){
                    Toast.fail('账号错误,请重新输入', 2);
                } else {
                    Toast.fail(data.errorMessage, 2);
                }
            }).catch(error => {

        })
    }

    openLiveChat() {
        Actions.LiveChatST()
       // LiveChatOpenGlobe();
      }

  
    render(){
        const { okCanSubmit, showSuccess } = this.state;
        const qrlink = this.props.qrcode;
        return <KeyboardAwareScrollView
                style={{backgroundColor: "#000000"}}
                resetScrollToCoords={{ x: 0, y: 0 }}
                >
                    <View 
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View>
                            <View style={{ paddingLeft: 15, paddingRight: 15 }}>   
                                <View style={styles.HeadBackground}>                        			
                                    <View style={{width: 30}}>
                                        <TouchableOpacity 
                                            hitSlop={{ 
                                                top: 10, 
                                                right: 10, 
                                                bottom: 10, 
                                                left: 10 }} 
                                                onPress={() => { Actions.deposit() }} 
                                        >
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("../../images/bank/icon_close.png")}
                                                    style={{ width: 20, height: 20, marginRight: 20 }}
                                                />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={{color: '#fff',fontSize: 18}}>
                                            QR ฝากเงินทศนิยม
                                        </Text>
                                    </View>
                                    <View style={{ right: 15 }}>
                                        <TouchableOpacity 
                                            hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                                            onPressIn={() => this.openLiveChat()}
                                            style={{
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: 0
                                            }}
                                        >
                                            <Image
                                            resizeMode="stretch"
                                            source={require("../../images/home/icon-csb.png")}
                                            style={{ width: 28, height: 28 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View> 
                                <View
                                    style={{                                        
                                        width: width,
                                        backgroundColor: "#FFFCCA",
                                        paddingVertical: 13,
                                        paddingHorizontal: 10,
                                        borderRadius: 4,
                                        marginTop: 5,
                                        marginBottom: 22,
                                        display: "flex",
                                        flexDirection: "row",
                                        alignContent: "flex-start",
                                        flex: 1,
                                    }}
                                >
                                    <Image
                                        resizeMode="stretch"
                                        source={ require("../../images/icon_warning.png") }
                                        style={{ 
                                            width: 20, 
                                            height: 20, 
                                            marginRight: 8, 
                                        }}
                                    />
                                    <Text 
                                        style={{ 
                                            flex: 1, 
                                            fontSize: 13,
                                            lineHeight: 18, 
                                            //lineHeight: 11,
                                            //lineHeight: 13, 
                                            color: "#222222",
                                        }}
                                    >
                                        กรุณาเปิดแบงก์กิ้งแอปเพื่อสแกน QR และโอนเงินตามจำนวนที่ระบบกำหนดภายใน 5 นาทีเท่านั้น โปรดตรวจสอบให้แน่ใจว่าคุณใช้ธนาคารชื่อเดียวกับที่ลงทะเบียนในการฝากมิฉะนั้นการปรับเงินอาจล่าช้า
                                    </Text>
                                </View>
                                <View 
                                    style={{ 
                                        paddingHorizontal: 16, 
                                    }}
                                >
                                    {/* uniqueAmt */}
                                    <View style={styles.moneyTitle}>
                                        <Text style={{ color: "#fff" }}>
                                            <Text style={{ color: "red" }}>*</Text>
                                            ยอดเงินฝาก
                                        </Text>
                                    </View>
                                    <View 
                                        style={{ 
                                            backgroundColor: "#666666", 
                                            height:40, 
                                            paddingVertical: 7, 
                                            borderRadius:5, 
                                        }}
                                    >
                                        <Text 
                                            style={{ 
                                                color: "#fff",
                                                textAlign:"center", 
                                                fontSize:22, 
                                                fontWeight:"bold", 
                                            }}
                                        >
                                            {this.props.statedata}
                                        </Text>
                                    </View>
                                    {/*金額提示訊息*/}
                                    {this.state.MoneyNoticeShow && (
                                        <View 
                                            style={{
                                                width: width,
                                                paddingHorizontal: 16,
                                                zIndex: 9999, 
                                                alignItems: "flex-end",
                                                position:'absolute',
                                                top:Platform.OS === "android" ? 100:90,
                                                right:Platform.OS === "android" ? 0:5,
                                            }} 
                                        >
                                            <TouchableOpacity
                                                hitSlop={{
                                                    top: 10, 
                                                    bottom: 10, 
                                                    left: 5, 
                                                    right: 5,
                                                }}
                                                style={{
                                                    backgroundColor: "#00B324", 
                                                    borderRadius: 5, 
                                                    position:"relative",
                                                    //width: width - 30
                                                }}
                                            >
                                                <Text 
                                                    style={{
                                                        color: "#fff", 
                                                        paddingHorizontal: 10, 
                                                        paddingVertical: 30, 
                                                        lineHeight: 18, 
                                                        marginBottom: 20, 
                                                        marginTop: -20,
                                                        fontSize:13,
                                                    }}
                                                >
                                                    กรุณาโอนยอดเงินเป็นจำนวนที่มีเศษทศนิยมตามที่ระบบกำหนด เท่านั้นเพื่อความรวดเร็วในการตรวจสอบและอนุมัติยอดเงิน
                                                </Text>
                                                
                                                <View 
                                                    style={{
                                                        position: "absolute", 
                                                        bottom: 15, 
                                                        right: 16, 
                                                        backgroundColor: "#333333", 
                                                        width: 71, 
                                                        height: 25, 
                                                        borderRadius: 5, 
                                                    }}
                                                >
                                                    <Text 
                                                        style={{  
                                                            fontSize: 11, 
                                                            lineHeight: 20, 
                                                            textAlign: "center", 
                                                            color: "#00E62E", 
                                                        }} 
                                                        onPress={()=>
                                                            this.setState({ 
                                                                MoneyNoticeShow: false, 
                                                                okCanSubmit:true, 
                                                            })
                                                        }
                                                    >
                                                        ตกลง
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles.triangle2}></View>
                                        </View>
                                    )}
                                    {/* bankName */}
                                    <View style={styles.moneyTitle}>
                                        <Text style={{ color: "#fff" }}>
                                            <Text style={{ color: "red" }}>*</Text>
                                            ธนาคาร
                                        </Text>
                                    </View>
                                    <View 
                                        style={{ 
                                            backgroundColor: "#666666", 
                                            height:40, 
                                            paddingVertical: 7, 
                                            borderRadius:5, 
                                        }}
                                    >
                                        <Text 
                                            style={{ 
                                                color: "#999999", 
                                                paddingLeft:12, 
                                                paddingTop:4, 
                                                fontSize: 12, 
                                            }}
                                        >
                                            {this.props.bankName}
                                        </Text>
                                    </View>
                                </View>

                                
                                
                                <View style={{ paddingHorizontal: 16, marginVertical: 15, zIndex:-1 }}>
                                    <View 
                                        style={{
                                            backgroundColor: "#222222",
                                            paddingHorizontal: 12,
                                            paddingVertical: 11,
                                            borderRadius: 8,
                                        }}
                                    >
                                        <Text style={{ color:"#F5F5F5" }}>คิวอาร์โค้ด</Text>
                                        <View
                                            style={{
                                                alignItems: "flex-end",
                                                position: "absolute",
                                                top: 5,
                                                right: 15
                                            }}
                                        >
                                            <TouchableOpacity
                                                hitSlop={{ top: 15, bottom: 15, left: 15, right: 10 }}
                                                onPress={this.saveImg.bind(this)}
                                            >
                                                <Text style={styles.SaveButton}>บันทึก</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.qrcodeWrap}>
                                        {this.props.qrcode != '' &&
                                            <ViewShot 
                                                ref="viewShot" 
                                                options={{ format: "jpg", quality: 0.9 }} 
                                                style={styles.qrcodeBox}
                                            >
                                                <Image
                                                    source={{uri:qrlink }}
                                                    style={styles.qrImg}                                                  
                                                />
                                            </ViewShot>}
                                        </View>
                                    </View>
                                </View>
                                <Text 
                                    style={{
                                        color: "#FF0000", 
                                        fontSize: 11, 
                                        paddingLeft: 15, 
                                        marginBottom: 20,
                                    }}
                                > 
                                    คำเตือน : QR Code สามารถใช้ได้เพียง 1 ครั้งเท่านั้น ไม่สามารถใช้ซ้ำได้
                                </Text>
                                <View style={{ padding: 15, paddingBottom: 25 }}>
                                    {
                                        okCanSubmit == false ?
                                        <View style={styles.DSPayButtonB}>
                                            <Touch 
                                                hitSlop={{ 
                                                    top: 10, 
                                                    bottom: 10, 
                                                    left: 10, 
                                                    right: 10, 
                                                }} 
                                                style={{ width: width - 30 }}
                                            >
                                                <Text 
                                                    style={{ 
                                                        color: "#fff", 
                                                        fontSize: 16, 
                                                        lineHeight: 38, 
                                                        fontWeight: "bold", 
                                                        textAlign: "center", 
                                                        paddingTop: 3, 
                                                    }}>
                                                        โอนเงินมาเรียบร้อยแล้ว
                                                </Text>
                                            </Touch>
                                        </View>
                                        :okCanSubmit == true &&
                                        <View style={styles.DSPayButtonBHoves}>
                                            <Touch 
                                                hitSlop={{ 
                                                    top: 10, 
                                                    bottom: 10, 
                                                    left: 10, 
                                                    right: 10, 
                                                }} 
                                                onPress={this.okPayMoney} 
                                                style={{ width: width - 30 }}
                                            >
                                                <Text 
                                                    style={{ 
                                                        color: "#fff", 
                                                        fontSize: 16,
                                                        lineHeight:38, 
                                                        fontWeight: "bold", 
                                                        textAlign: "center", 
                                                        paddingTop: 3, 
                                                    }}>
                                                        {'โอนเงินมาเรียบร้อยแล้ว'}
                                                </Text>
                                            </Touch>
                                        </View>
                                    }
                                </View>
                            </View>
                        </View>
                        <Modal
                            animationType='none'
                            transparent={true}
                            visible={showSuccess} 
                            onRequestClose={() => { }}                
                        >
                            <View style={{ width:130, heigt:54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?400:450, left:120}}>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/icon-check-g.png")}
                                    style={{ width: 25, height: 25 }}
                                />
                                <Text style={{ color: '#333333', paddingLeft: 10 }}>บันทึกสำเร็จ</Text>
                            </View>
                        </Modal>  
                    </View>
            </KeyboardAwareScrollView>
    }
}

export default (BQRTransAct)

const styles = StyleSheet.create({
    triangle2:{
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#00B324",
        position: "absolute",
        top: -18,
        alignSelf: "center",
    },
    moneyTitle: {
        marginTop: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        height: 35,
    },
    qrcodeWrap: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        overflow: "hidden",
        marginBottom: 5,
    },
    qrcodeBox: {
        borderWidth: 1,
        borderColor: "#F5F5F5",
        backgroundColor: "#F5F5F5",
        //padding: 3,
        overflow: "hidden",
        //flexDirection: "row",
    },
    SaveButton: {
        marginTop:5,
        color:"#00E62E",
        fontSize: 14,
    },
    DSPayButtonB: {
        backgroundColor: "#2d2d2d",
        borderRadius: 5,
    },
    DSPayButtonBHoves: {
        backgroundColor: "#00b324",
        borderRadius: 5,
    },
    HeadBackground: {
        width: width,
        height: 50,
        marginTop: Platform.OS === "android" ? 0:50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
    },
    qrImg: {
        width: 150, 
        height: 150, 
    }
})