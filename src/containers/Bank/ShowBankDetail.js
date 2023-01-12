
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView, 
    View,
    Platform
} from "react-native";
import { Actions } from "react-native-router-flux";
import {  Toast, ActivityIndicator } from 'antd-mobile-rn';

const { width } = Dimensions.get("window");

const fake = [
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 23645,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 398493,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 39283,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 392833,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
    {
        AccountHolderName: "test1bank",
        AccountNumber: "15422635",
        BankAccountID: 64576,
        BankAddress: "",
        BankCode: "TTB",
        BankName: "ธนาคารทหารไทยธนชาต",
        BankNameEn: "TMBThanachart Bank",
        BankNameLocal: "ธนาคารทหารไทยธนชาต",
        BankTelNo: "",
        Branch: "test",
        City: "test",
        Code: "64576",
        CurrencyCode: "THB",
        IIDD: "40039085-d762-4b3b-aa91-1b15a2c422ff",
        IsActive: true,
        IsChineseBank: false,
        IsDefault: true
    },
]

class ShowBankDetail extends React.Component {
    constructor(props) {
        super(props);
        this.addBankCard = this.addBankCard.bind(this);
        this.state = {
            lbRechargeMethod:0,
            BankTypeKey: "D",
            showDone:false,
            hasBind:false,
            hasUse:false,
            showSave:false,
            isLoading:false,
            failPop:false,
        }
    }

    paymentchannelDWButton =(key)=>{
         console.log(key)
         this.setState({
             lbRechargeMethod:key
         })
    }

    /**
   * 用戶帳戶綁定
   */
    addBankCard() {
        const { lbRechargeMethod } = this.state;
        const { BankNum } = this.props;
        //let actualNum = fake[lbRechargeMethod].BankAccountID
        let actualNum = BankNum[lbRechargeMethod].BankAccountID
        console.log('actualNum=============',actualNum, BankNum,lbRechargeMethod)
        this.setState({ isLoading: true });
        //Toast.loading('โปรดรอสักครู่...', 1000)
        fetchRequest(ApiPort.PUTMemberBankReverse + actualNum + "/Reverse/Default?", 'PUT').then(res => {
            //Toast.hide()
            this.setState({ isLoading: false });
            UMonEvent('Deposit Nav','Click','SaveBank_LBExpress')
            console.log('res=========',res)
            if (res.isSuccess) {
                this.setState({
                    showSave:true,
                  },()=>{
                        setTimeout(() => {
                        this.setState({
                            showSave:false,
                            lbRechargeMethod:0
                        })
                            this.props.CloseBankModal()
                            window.reloadAgain && window.reloadAgain()
                    }, 3000)
                  })     
                                
             } else {
                
                if(res.errorCode == "P112001" || res.errorCode == "P112004" || res.errorCode == "P112005"){
                    this.setState({
                        failPop:true
                    })
                } else if(res.errorCode == "P112003"){//已经绑定该账户
                    console.log('已经绑定该账户')
                    this.setState({
                        hasBind:true
                    },()=>{
                        setTimeout(() => {
                            this.setState({
                                hasBind:false,
                            })
                            this.props.CloseBankModal()
                        }, 3000)
                   })
                   return
                } else if(res.errorCode == "P112002"){//其他会员已经使用该银行账户
                    console.log('其他会员已经使用该银行账户')
                    this.setState({
                        hasUse:true
                    })
                    setTimeout(() => {
                        this.setState({
                            hasUse:false,
                        })
                        this.props.CloseBankModal()
                    }, 3000)
                    return
                } else {
                    this.setState({
                        failPop:true//errorCode == 400 & errorCode == 500
                    })
                }
            
            }
        }).catch(err => {
            Toast.hide()
        })
    }
    /**
   * 用戶帳戶添加
   */
    goNewAccount() {
        const { ST } = this.props;
        this.props.CloseBankModal()
        console.log('NewBank==========',ST,)

        Actions.newAccount({ 
              BankTypeKey: "D",
              data: ST,
        });
    }  

    CloseBankModal(){
        console.log('CloseBankModal==========',)
        this.props.CloseBankModal()
        this.setState({
            failPop:false
        })
    }

    GoCSModal(){
        this.props.CloseBankModal()
        this.setState({ 
            failPop:false, 
        })
        Actions.LiveChatST()
    }

    formatBankNo(bankNo) {
        let bankNumber = "";
        if (bankNo.length > 16) {
          bankNumber = "****" + bankNo.slice(bankNo.length - 4);
          //   bankNumber = bankNo.slice(0,4)+ ' ' + bankNo.slice(4,8)+ ' ' + bankNo.slice(8,12)+ ' ' +bankNo.slice(12,16) + ' ' +bankNo.slice(16)
        } else {
          bankNumber = "****" + bankNo.slice(bankNo.length - 4);
          //   bankNumber = bankNo.slice(0,4)+ ' ' + bankNo.slice(4,8)+ ' ' + bankNo.slice(8,12)+ ' ' +bankNo.slice(12)
        }
    
        return bankNumber;
    }

    render() {
        const {   BankNum, isNew3, ST, ShowBank } = this.props;
        console.log('BankNum',BankNum,isNew3, ST,ShowBank)
        const { hasBind,hasUse, showSave, pageTop, isLoading, failPop } = this.state;
        console.log('pageTop',pageTop)
        console.log('ShowBank this.props',this.props)
        let actionSheets = BankNum && BankNum.map((item,index)=>{      
            return (<View key={index}>

                <View style={styles.bettingRecordsRow}>
                    <Image
                        source={require("../../images/icon_exCard.png")}
                        resizeMode="stretch"
                        style={{ width: 20, height:13,marginTop:5,marginLeft:10,marginRight:10}}
                    />
                    <Text style={{ color:'#CCCCCD' }}>
                        {/* {item.BankNameLocal}  */}
                        {item.BankNameLocal
                        ? item.BankNameLocal.length > 20
                            ? item.BankNameLocal.substr(0, 20) + ".."
                            : item.BankNameLocal
                        : ""}
                        {" "}
                        {this.formatBankNo(item.AccountNumber)}
                    </Text>
                    
                    <RadioButton
                        //disabled={this.state.LBcurrentStep !== 1}
                        onClick={() => {
                            console.log('click paymentchannel')
                            console.log(index)
                            this.paymentchannelDWButton(index)
                            this.setState({lbRechargeMethod: index});
                        }}
                        text={item.BankNameLocal}
                        selected={this.state.lbRechargeMethod === index}
                    >
                        
                    </RadioButton>  
                </View>   
                                                
        </View>)
         });

        return (
             <View> 
                 <Modal 
                     animationType="slide"
                     visible={ShowBank}
                     transparent={true}
                     //onRequestClose={()=>this.setState({modalVisible:false})}
                 >
                     <View style={styles.modalStyle}>
                         <View style={styles.subView}>
                             <View style={styles.itemContainer}>                            
                                 <View style={{
                                     width:width, backgroundColor: '#1F1F1F', borderTopRightRadius: 20,
                                 borderTopLeftRadius: 20, alignItems: 'center', flexDirection: 'row', 
                                     marginTop:15
                                 }}>
                                     <Text style={{color: '#fff', fontSize: 18, marginLeft: (width-330)/2}}>เลือกธนาคาร</Text>
                                     <View                                
                                         style={{                                            
                                             height: 25,
                                             width: 26,
                                             borderRadius: 12,
                                             borderWidth: 1,
                                             borderColor: '#363636',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             backgroundColor:'#363636',
                                             marginLeft:(width-5)/2,
                                             marginTop:-3
                                     }}>
                                         <TouchableOpacity  
                                             onPress={this.props.CloseBankModal}
                                         >
                                             <Text style={{color:'#919191',fontSize:15,}} 
                                             >X</Text>
                                         </TouchableOpacity>
                                        
                                     </View>
                                    
                                 </View>                           
                                 <ScrollView                       
                                     automaticallyAdjustContentInsets={false}
                                     showsHorizontalScrollIndicator={false}
                                     showsVerticalScrollIndicator={false}                          
                                 > 
                                     {actionSheets}
                                    
                                 </ScrollView>
                                 {!isNew3 &&
                                 <View style={{
                                     width: width-90,
                                     //height: 73,
                                     backgroundColor: "#1F1F1F",                            
                                     display: "flex",
                                     flexDirection: 'row',
                                     height: 48,
                                     marginBottom:20,
                                     alignItems:'center',                                     
                                     paddingRight:20,
                                     position:'relative',
                                 }}>
                                     <Image
                                         source={require("../../images/icon_moreCard.png")}
                                         resizeMode="stretch"
                                         style={{ width: 22, height:20,marginTop:5,marginLeft:10,marginRight:10}}
                                     />
                                     <Text style={{ color:'#CCCCCD', marginTop:5 }}>เพิ่มบัญชี</Text>
                                     <View style={{  position:'absolute',right:5 }}>
                                         <TouchableOpacity  
                                             style={{ flex:1, alignItems:'flex-end',marginTop:5 }}
                                             onPress={()=> this.goNewAccount()}
                                         >
                                             <Text style={{color:'#00B324',fontSize:40,fontWeight: "bold", lineHeight:48}} 
                                             >+</Text>
                                         </TouchableOpacity>
                                     </View>
                                 </View>}
                                 <View style={{ backgroundColor:'#00B324', borderRadius:5, width: 340, height:48, marginBottom:10 }}>
                                 {/* Save */}
                                     <TouchableOpacity onPress={()=>this.addBankCard()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} >
                                         <Text style={{ color: "#fff", fontSize: 16, lineHeight: 48, textAlign: 'center', paddingTop: 3 }}>บันทึก</Text>
                                     </TouchableOpacity>
                                 </View>
                             </View>
                            
                         </View>
                         {isLoading && (
                            <View
                            style={{
                                backgroundColor: "rgba(0, 0, 0, .6)",
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            >
                            <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                        {/* 您添加的銀行賬戶 已在系統中鏈接。 */}       
                        <Modal
                            animationType='none'
                            transparent={true}
                            visible={hasUse} 
                            //visible
                            onRequestClose={() => { }}                
                        >
                            <View style={{ zIndex: 10000, width:220, heigt:54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?300:400, left:Platform.OS === "android"?90:100, borderRadius:5}}>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/icon-fail-g.png")}
                                    style={{ width: 20, height: 20 }}
                                />
                                <View style={{ width:160,}}>
                                    <Text style={{ color: '#333333', paddingLeft: 10, }}>บัญชีธนาคารที่คุณเพิ่ม</Text>
                                    <Text style={{ color: '#333333', paddingLeft: 10, }}>มีการผูกบัญชีในระบบแล้ว</Text>
                                </View>
                                
                            </View>
                        </Modal>  
                        {/* 您添加的銀行帳戶已處於活動狀態。 */}
                        <Modal
                            animationType='none'
                            transparent={true}
                            visible={hasBind}
                            onRequestClose={() => { }}                
                        >
                            <View style={{ zIndex: 10000, width:260, heigt:54, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 5, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?300:400, left:Platform.OS === "android"?80:100, borderRadius:5}}>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/icon-fail-g.png")}
                                    style={{ width: 20, height: 20 }}
                                />
                                <View style={{ width:220,}}>
                                    <Text style={{ color: '#333333', paddingLeft: 10 }}>บัญชีธนาคารที่คุณเพิ่ม</Text>
                                    <Text style={{ color: '#333333', paddingLeft: 10 }}>มีการใช้งาน แล้วกับยูสเซอร์เนมอื่น</Text>
                                </View>
                            </View>
                        </Modal> 
                        {/* 綁定帳號 保存成功 */}
                        <Modal
                            animationType='none'
                            transparent={true}
                            visible={showSave} 
                            //visible
                            onRequestClose={() => { }}                
                        >
                            <View style={{ zIndex: 10000, width:130, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:400, left:140}}>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/icon-check-g.png")}
                                    style={{ width: 25, height: 25 }}
                                />
                                {/* 保存成功 */}
                                <Text style={{ color: '#333333', paddingLeft: 10 }}>บันทึกสำเร็จ</Text>
                            </View>
                        </Modal>
                        
                        
                     </View>
                     {/* 帳戶綁定失敗。 請聯繫支持以獲得幫助。 */}
                     {failPop &&<View style={{ 
                                backgroundColor: "rgba(0, 0, 0, .6)",
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                justifyContent: "center",
                                alignItems: "center", }}>
                            <View style={{ backgroundColor:'#000000',width:width-90,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
                                <Image
                                source={require("../../images/icon_failed.png")}
                                resizeMode="stretch"
                                style={{ width: 60, height:60,alignSelf:'center',marginBottom:10, marginTop:5}}
                                />
                                <View>
                                    <Text style={{color:'#F5F5F5',textAlign:'center'}}>การผูกบัญชีล้มเหลว</Text>
                                    <Text style={{color:'#959595',textAlign:'center'}}>การผูกบัญชีล้มเหลว กรุณาติดต่อฝ่ายบริการ</Text>
                                    <Text style={{color:'#959595',textAlign:'center',marginBottom:10}}>เพื่อให้ความช่วยเหลือ</Text>
                                
                                    <TouchableOpacity 
                                        onPress={()=> this.GoCSModal()}
                                    >
                                        <View style={{backgroundColor:'#00B324',width:250,padding:10,borderRadius:4,alignSelf:'center',marginTop:15, marginBottom:10}}><Text style={{color:'#fff',textAlign:'center'}}>ติดต่อฝ่ายบริการ</Text></View>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={()=> this.CloseBankModal()}
                                    >
                                        <View style={{backgroundColor:'#000000',borderColor:'#00B324',borderWidth:1,width:250,padding:10,borderRadius:4,alignSelf:'center',marginBottom:10}}><Text style={{fontSize:14,color:'#00B324',textAlign:'center'}}>ปิด</Text></View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>}
                 </Modal>
             </View>    
   
        );

       
    }
}

ShowBankDetail.propTypes = {};

export default ShowBankDetail;



function RadioButton (props){
    return (
        <View style={{
            position:'absolute',right:5
        }}>
            <TouchableOpacity style={{flexDirection: "row"}} onPress={props.onClick} disabled={props.disabled}>
                <View
                style={[{
                        height: 21,
                        width: 21,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: props.selected?'#CCCCCD':'#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }, props.style]}>
                    {
                        props.selected ?
                            <View style={{
                                height: 14,
                                width: 14,
                                borderRadius: 6,
                                backgroundColor: '#00E62E',
                            }}/>
                            : null
                    }
                </View>
                {props.children}

            </TouchableOpacity>
         </View>
     );
}

const styles = StyleSheet.create({
    
    bettingRecordsRow: {
        width: width-90,
        height: 73,
        backgroundColor: '#1F1F1F',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor:'#999999',
        borderBottomWidth:.3,
        position:'relative',
        
    },

    modalStyle:{
        backgroundColor:'#000000BF',
        opacity:1,
        justifyContent:'flex-end',
        alignItems:'center',
        flex:1,
    },
    subView:{
        justifyContent:'flex-end',
        alignItems:'center',
        alignSelf:'stretch',
        width:width,
    },
    itemContainer:{
        height:320,
        marginLeft:15,
        marginRight:15,
        marginBottom:Platform.OS === "android"?0:20,
        borderRadius:6,
        backgroundColor: '#1F1F1F',
        justifyContent:'center',
        alignItems:'center',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
    },
    actionItem:{
        width:width-30,
        height:45,
        alignItems:'center',
        justifyContent:'center',
        borderTopColor:'#cccccc',
        borderTopWidth:0.5,
    },
    actionTitle:{
        fontSize:13,
        color:'#808080',
        textAlign:'center',
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15,
    },
    actionItemTitle:{
        fontSize:16,
        color:'#444444',
        textAlign:'center',
    },
    
});
