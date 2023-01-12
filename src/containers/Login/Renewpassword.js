import React from 'react';
import { StyleSheet, Text, View,TextInput,Image,Dimensions,TouchableOpacity,Modal,ScrollView,Platform} from 'react-native';
import { Flex,Toast } from 'antd-mobile-rn';
import { Actions } from "react-native-router-flux";
import {login, logout} from "../../actions/AuthAction";
import {connect} from "react-redux";

import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index.native'; 

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newStyle[key].color = '#fff';
	}
	newStyle[key].borderBottomColor = '#646464';
  }
}


const {
  width,
  height
} = Dimensions.get('window')

class Password extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          ISAndroidNone: false,
          password:'', //密碼
          repassword:'', // 密碼確認
          PWDFocused: "",
          PWDFocused1: "",
          Errorpwd: "",
          Errorpwd1: "",
          
          SeePassword:false,
          SeePasswordS2:false,
          CountdownEmail_minutes: "10:00",

          timeOut:false,
          username:this.props.username,
          toastSuccessFlag: false,
        }
        console.log('Password=====',this.props.username)
        this.postForm = this.postForm.bind(this);
    }

    componentDidMount(){
        //進入頁面開始倒數
        this.TimeDownPwd()
    }

    eyes(){  //顯示密碼 
        this.setState({
          SeePassword:this.state.SeePassword == false ? true :false
        })  
    }
    
    eyesS2(){  //顯示密碼 
        this.setState({
            SeePasswordS2:this.state.SeePasswordS2 == false ? true :false
        })  
    }

    PWDFocus = () => {
        if (this.state.PWDFocused != "error") {
          this.setState({
            ISAndroidNone: true,
            PWDFocused: "Focus"
          });
        }
    };
    
    PWDBlur = () => {
        if (this.state.PWDFocused != "error") {
            this.setState({
            ISAndroidNone: false,
            PWDFocused: "ok"
            });
        }
    };

    //二次确认密码
    PWDFocus1 = () => {
        if (this.state.PWDFocused1 != "error") {
            this.setState({
            ISAndroidNone: true,
            PWDFocused1: "Focus"
            });
        }
    };
    //二次确认密码
    PWDBlur1 = () => {
        if (this.state.PWDFocused1 != "error") {
            this.setState({
            ISAndroidNone: false,
            PWDFocused1: "ok"
            });
        }
    };

    handlePassword = repassword => {
        let passwordReg = /^(?=.{6,16}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])+$/;
        if (passwordReg.test(repassword) == false) {
          this.setState({
            PWDFocused: "error",
            Errorpwd:"รูปแบบไม่ถูกต้อง กรุณากรอกอีกครั้ง"
            // Errorpwd:
            //   "密码格式错误，请您重新输入"
          });
        } else {
          this.setState({
            PWDFocused: "Focus"
          });
        }
        this.setState({ repassword });
    };

    //二次确认密码
    handlePassword1 = password => {
        let passwordReg = /^(?=.{6,16}$)(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9])+$/;
        if (passwordReg.test(password) == false) {
            this.setState({
                PWDFocused1: "error",
                Errorpwd1:
                "รูปแบบไม่ถูกต้อง กรุณากรอกอีกครั้ง"
                // Errorpwd1:
                // "密码格式错误，请您重新输入"
            });
        } else if (this.state.repassword != password) {
            this.setState({
              //PWDFocused: "error",
              PWDFocused1: "error",
              //Errorpwd: "两次填写密码不相同",
              //Errorpwd1: "确认密码和新密码不一致"
              Errorpwd1:"รหัสผ่านไม่ตรงกัน"
            });
        } else {
        this.setState({
            PWDFocused1: "Focus"
        });
        }
        this.setState({ password });
    };

    goLiveChat() {
        UMonEvent('Passcode_Livechat');
        Actions.LiveChatST()
        //this.setState({ countdownActive: true, getAgain: false })
    }

    TimeDownPwd() {

        var m = 10; //分
        var s = 0; //秒
       
    
        this.CountdownEmails = setInterval(() => {
          let Sdb = s < 10 ? "0" + s : s;
          let Mdb = m < 10 ? "0" + m : m;
          this.setState({ CountdownEmail_minutes: Mdb + ":" + Sdb });
          if (m == 0 && s == 0) {
            //登录超时彈窗出現,重新登入
            this.showTimeout();
            clearInterval(this.CountdownEmails);
            
          } else if (m >= 0) {
            if (s > 0) {
              s--;
            } else if (s == 0) {
              m--;
              s = 59;
            }
          }
        }, 1000);
    }

    showTimeout(){
        this.setState({
            timeOut:true
        })
    }

    checkSubmitStatus = () => {
        const {        
            PWDFocused,
            PWDFocused1,
            repassword,
            password,
        } = this.state;
    
        if (password === "" || repassword === "" ) return false;
        return  PWDFocused != "error" && PWDFocused1 != "error"
    }

    postForm(){
        console.log('this.props.username',this.props.username,)
        const { repassword, password } = this.state

        if (repassword != password) {
            Toast.fail("รหัสผ่านไม่ตรงกัน")
            return;
        }

        let data = {            
            "newPassword": repassword,
            "confirmPassword": password,          
        };

        UMonEvent("Navigation", "Click", "Submit_ResetPW");
        Toast.loading("โปรดรอสักครู่.."); 

        fetchRequest(ApiPort.PostRevalidatePassword, "POST", data)
        .then(data => {
            Toast.hide();
    
            if (data.isSuccess == false) {
              if (data.result.Code == "MEM00145") {//新密碼和舊新密碼相同
                Toast.info(data.result.message, 2);
                return;
              }
              const errMsg = data.result || data.result.message;
              Toast.info(errMsg, 2);
            } else if (data.isSuccess == true) {
               console.log('revalidate password=====密码更新成功========')
               this.setState({ 
                    toastSuccessFlag: true, 
                },()=>{
                    setTimeout(() => {
                    this.setState({ toastSuccessFlag: false });
                    let username = this.props.username;
                    let password = this.state.password;
                    this.props.login({ username, password });
                    }, 3000);
                });  
                
              
            }
        })
        .catch(() => {
            Toast.hide();
        });
    }

    
    //退出,重新登入！
    logout = () => {

        this.setState({
            timeOut:false
        })
        
        navigateToSceneGlobeX();

        global.storage.remove({
            key: 'VerifyEmail',
            id: 'VerifyEmail'
        });
        global.storage.remove({
            key: 'VerifyPhone',
            id: 'VerifyPhone'
        });
        
        setTimeout(()=>{
            Actions.logins();
        }, 200)
        setTimeout(()=>{Gologin = true }, 2000)
        key = 'login';
        return;
    }

    render(){
        const {SeePassword,SeePasswordS2,password,repassword,CountdownEmail_minutes,timeOut,Errorpwd,Errorpwd1,toastSuccessFlag}  = this.state;   //註冊訊息 
        return(
            <View  style={{ flex: 1 ,backgroundColor: "#000000"}} >
                {/* 登录超时彈窗 */}
                <Modal
					animationType='fade'
					transparent={true}
					visible={timeOut}
				>
					<View style={styles.formalModal}>
						<View style={[styles.warringContainer,{height:height/2.5,justifyContent:'center'}]}>
							<Image
								resizeMode="stretch"
								style={{ width: 60, height: 60, marginBottom: 20 }}
								source={require("../../images/icon_warning.png")}
							/>
							<Text style={{color:'#F5F5F5',fontSize:16,marginBottom: 10}}>
                                {/* 登录超时 */}
                                หมดอายุ
                            </Text>
                            <Text style={{color:'#CCCCCC',fontSize:14,textAlign:'center',lineHeight:25}}>
                                {/* 很抱歉，您该次登录已超时，请退出重新登录以验证并更新密码 */}
                                ระยะเวลาดำเนินของคุณหมดอายุแล้ว
                            </Text>
                            <Text style={{color:'#CCCCCC',fontSize:14,textAlign:'center',lineHeight:25}}>
                                {/* 很抱歉，您该次登录已超时，请退出重新登录以验证并更新密码 */}
                                กรุณาเข้าสู่ระบบอีกครั้งเพื่อยืนยันและอัปเดตรหัสผ่าน
                            </Text>
							<TouchableOpacity 
                                style={styles.warringModalBtn} 
                                onPress={() => {
                                    this.logout()
                                }}
                            >
								<Text style={{color:'#FFFFFF',fontSize:16,fontWeight:"bold"}}>
                                    {/* 重新登陆 */}
                                    เข้าสู่ระบบ
                                </Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

                <Modal
                    animationType='none'
                    transparent={true}
                    visible={toastSuccessFlag} 
                    //visible
                    onRequestClose={() => { }}                
                >
                    <View style={{ zIndex: 10000, width:174, heigt:54, borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:400, left:100}}>
                        {/* 驗證成功 */}
                        <Image
                            resizeMode="stretch"
                            source={require("../../images/icon-check-g.png")}
                            style={{ width: 25, height: 25 }}
                        />
                        <Text style={{ color: '#333333', paddingLeft: 5 }}>อัปเดตรหัสสำเร็จ</Text>
                    </View>
                </Modal>

                <ScrollView 
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.rootContainer}>
                        <View style={{marginHorizontal: 20,marginTop:15,width: width - 20}}>
                            <View style={{ backgroundColor: '#FFFCCA', paddingVertical: 10, borderRadius: 4, marginBottom: 20,  flexDirection: 'row', paddingBottom:0}}>
                                <Image resizeMode='contain' source={require('../../images/icon_warning.png')} style={{ width: 20, height: 20, marginRight: 10 ,marginLeft:10}} />
                                <View style={{paddingBottom:10,paddingRight:24,}}>
                                    {/* <Text style={{ color:"#222222",fontSize: 12,alignSelf:'center' ,lineHeight:18}}>请在 {CountdownEmail_minutes} 前完成密码更新</Text> */}
                                    <Text style={{ color:"#222222",fontSize: 12,alignSelf:'center' ,lineHeight:18}}>คุณมีเวลา {CountdownEmail_minutes} นาทีในการอัปเดตรหัสผ่านใหม่</Text>
                                </View>
                            </View>
                        </View>

                        <Flex>
                            <Flex.Item 
                                style={{ 
                                    flex:1, 
                                    paddingLeft: 10, 
                                    paddingRight: 4, 
                                }}
                            > 
                                {SeePassword == true  ? 
                                <TextInput
                                    secureTextEntry={false}
                                    //placeholder="请输入您的新密码"
                                    placeholder="กรุณาใส่รหัสผ่านใหม่"
                                    value={repassword}
                                    onChangeText={this.handlePassword}
                                    labelNumber={4}
                                    placeholderTextColor="#868686"
                                    style={[
                                    {
                                        borderColor:
                                        this.state.PWDFocused == "error"
                                            ? "red"
                                            : this.state.PWDFocused == "ok"
                                            ? "#868686"
                                            : this.state.PWDFocused == "Focus"
                                            ? "green"
                                            : "#868686"
                                    },
                                    styles.input
                                    ]}
                                    onFocus={() => this.PWDFocus()}
                                    onBlur={() => this.PWDBlur()}
                                />                               
                                :SeePassword == false && 
                                <TextInput
                                    secureTextEntry={true}
                                    //placeholder="请输入您的新密码"
                                    placeholder="กรุณาใส่รหัสผ่านใหม่"
                                    value={repassword}
                                    onChangeText={this.handlePassword}
                                    labelNumber={4}
                                    placeholderTextColor="#868686"
                                    style={[
                                    {
                                        borderColor:
                                        this.state.PWDFocused == "error"
                                            ? "red"
                                            : this.state.PWDFocused == "ok"
                                            ? "#868686"
                                            : this.state.PWDFocused == "Focus"
                                            ? "green"
                                            : "#868686"
                                    },
                                    styles.input
                                    ]}
                                    onFocus={() => this.PWDFocus()}
                                    onBlur={() => this.PWDBlur()}
                                />
                                }
                                {/* 密码错误提示 */}
                                {this.state.PWDFocused == "error" && (
                                    <Text style={[{ marginTop: -5 }, styles.ErrorText]}>
                                    {Errorpwd}
                                    </Text>
                                )}
                            </Flex.Item> 

                            <Flex.Item 
                                style={{
                                    flex:.13, 
                                    paddingLeft: 4, 
                                    position: 'absolute',  
                                    paddingRight: 4, 
                                    right: 16, 
                                }}
                            > 
                                <TouchableOpacity onPress={()=>this.eyes()}>
                                    {SeePassword == true ?  
                                    <Image 
                                        resizeMode='stretch'  
                                        source={ require('../../images/neweyes.png') } 
                                        style={{
                                            width:16,
                                            height:16,
                                            top:this.state.PWDFocused == "error" ? -9 :-1, 
                                        }}
                                    />
                                    :SeePassword == false &&
                                    <Image  
                                        resizeMode='stretch' 
                                        source={
                                            require('../../images/neweyesopen.png')
                                        }
                                        style={{
                                            width:16,
                                            height:16,
                                            top:this.state.PWDFocused == "error" ? -9 :-1,
                                        }}
                                    /> 
                                    } 
                                </TouchableOpacity> 
                            </Flex.Item> 
                        </Flex>
                        <Flex>
                            <Flex.Item 
                                style={{ 
                                    flex:1, 
                                    paddingLeft: 10, 
                                    paddingRight: 4, 
                                }}
                            > 
                                {SeePasswordS2 == true  ?
                                <TextInput
                                    secureTextEntry={false}
                                    //placeholder="确认密码"
                                    placeholder="กรุณายืนยันรหัสผ่านใหม่"
                                    value={password}
                                    onChangeText={this.handlePassword1}
                                    labelNumber={4}
                                    placeholderTextColor="#868686"
                                    style={[
                                    {
                                        borderColor:
                                        this.state.PWDFocused1 == "error"
                                            ? "red"
                                            : this.state.PWDFocused1 == "ok"
                                            ? "#868686"
                                            : this.state.PWDFocused1 == "Focus"
                                            ? "green"
                                            : "#868686"
                                    },
                                    styles.input
                                    ]}
                                    onFocus={() => this.PWDFocus1()}
                                    onBlur={() => this.PWDBlur1()}
                                />                               
                                :SeePasswordS2 == false && 
                                <TextInput
                                    secureTextEntry={true}
                                    //placeholder="确认密码"
                                    placeholder="กรุณายืนยันรหัสผ่านใหม่"
                                    value={password}
                                    onChangeText={this.handlePassword1}
                                    labelNumber={4}
                                    placeholderTextColor="#868686"
                                    style={[
                                    {
                                        borderColor:
                                        this.state.PWDFocused1 == "error"
                                            ? "red"
                                            : this.state.PWDFocused1 == "ok"
                                            ? "#868686"
                                            : this.state.PWDFocused1 == "Focus"
                                            ? "green"
                                            : "#868686"
                                    },
                                    styles.input
                                    ]}
                                    onFocus={() => this.PWDFocus1()}
                                    onBlur={() => this.PWDBlur1()}
                                />
                                }
                                {/* 密码错误提示 */}
                                {this.state.PWDFocused1 == "error" && (
                                    <Text style={[{ marginTop: -5 }, styles.ErrorText]}>
                                    {Errorpwd1}
                                    </Text>
                                )}
                            </Flex.Item> 

                            <Flex.Item 
                                style={{
                                    flex:.13, 
                                    paddingLeft: 4, 
                                    position: 'absolute', 
                                    paddingRight: 4, 
                                    right: 16, 
                                }}
                            > 
                                <TouchableOpacity onPress={()=>this.eyesS2()}>
                                    {SeePasswordS2 == false ?  
                                    <Image 
                                        resizeMode='stretch'  
                                        source={ require('../../images/neweyesopen.png') } 
                                        style={{
                                            width:16,
                                            height:16,
                                            top:this.state.PWDFocused1 == "error" ? -9 :-1, 
                                        }}
                                    />
                                    :SeePasswordS2 == true &&
                                    <Image  
                                        resizeMode='stretch' 
                                        source={
                                            require('../../images/neweyes.png')
                                        }
                                        style={{
                                            width:16,
                                            height:16,
                                            top:this.state.PWDFocused1 == "error" ? -9 :-1,
                                        }}
                                    /> 
                                    } 
                                </TouchableOpacity> 
				            </Flex.Item> 
                        </Flex>
                        {/* <View style={{ width: width - 20,marginTop:10 }}> */}
                        

                        <View style={{  width: '100%', marginTop:10, justifyContent: 'center' }}>
                            <Text style={{ color: '#999999', fontSize: 12 }}>
                                {/* 为了您的账号安全，请更新您的密码，如有任何疑问，请联系 */}
                                เพื่อความปลอดภัยบัญชีกรุณาอัปเดตรหัสผ่าน หากขัดข้องกรุณาติดต่อ{' '}
                            </Text>
                            <TouchableOpacity onPress={() => { this.goLiveChat() }} >
                                <Text style={{ color: '#00B324', fontSize: 12, textDecorationLine:"underline" }}>ห้องช่วยเหลือสด</Text>
                            </TouchableOpacity>
                        </View>
                        {/*提交表單*/}
                        {this.checkSubmitStatus() ? (
                            <TouchableOpacity onPress={() => this.postForm()} style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, width: '100%' }} >
                                <View style={styles.success}><Text style={{ color: '#FFFFFF', fontSize: 17 }}>ตกลง</Text></View>
                            </TouchableOpacity>) :(
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, width: '100%' }} >
                                <View style={styles.nosuccess}><Text style={{ color: '#CCCCCC', fontSize: 17 }}>ตกลง</Text></View>
                            </TouchableOpacity>
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }


}
const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => ({
    login: (loginDetails) => {
        login(dispatch, loginDetails);
    },
    logout: (loginDetails) => {
        logout(dispatch, loginDetails);
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Password);

const styles = StyleSheet.create({
    ErrorText: {
        color: "#FF2D12",
        width: "100%",
        textAlign: "left",
        //paddingLeft: 20,
        fontSize:14
    },
    input: {
        width: width - 20,
        textAlign: "left",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 20,
        color: "white"
    },   
    rootContainer: {
        flex: 1,
        backgroundColor: "#000000",
        justifyContent: "center",
        alignItems: "center"
    },
    success: {
        width: '95%',
        backgroundColor: '#00b324',
        borderColor: '#00b324',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    nosuccess: {
        width: '95%',
        backgroundColor: '#666666',
        borderColor: '#666666',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    formalModal: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    warringContainer: {
        width: 327,
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#00B324',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: '#00B32480',
        elevation: 4,
        position: 'relative',
        //paddingTop: 25,
        //paddingBottom: 25,
        alignItems: 'center',
        padding:15
    },
    warringModalBtn: {
        borderWidth: 1,
        borderColor: '#00B324',
        backgroundColor:'#00B324',
        borderRadius: 4,
        width: width * .8 * .7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
    },
  });