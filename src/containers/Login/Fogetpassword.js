import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import { InputItem, Toast } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import { I18n, getLanguages } from '../../language/i18n'
declare var jest: any;
const { width, height } = Dimensions.get('window')
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      //newStyle[key].width = width;
      newStyle[key].color = "#9a9a9a";
      newStyle[key].textAlign = "right";
      newStyle[key].fontSize= 15
      //newStyle[key].paddingRight = 16
      //newStyle[key].height = 60;
    }
	newStyle[key].borderBottomColor = '#3d3d3d';
  }
}
class Registered extends React.Component<any, any> {
    inputRef: any;
    constructor(props) {
        super(props);
        this.state = {
            Button1: '',
            currency: '',//貨幣
            wallet: '',//錢包
            referer: 'referer',
            blackBoxValue: Iovation,
            gender: 'string',
            secretQID: 0,
            nationID: 1,
            msgerType: 0,
            dob: 'string',
            placeOfBirth: 'string',
            hostName: 'string',
            regWebsite: 0,
            user: '', //帳戶
            name: '', //用戶名
            password: '', //密碼
            repassword: '', // 密碼確認
            number: '', //電話
            email: '', //郵箱
            qq: '', //qq 
            wechat: '', //微信
            Scode: '',// 推薦代碼
            EmailFocused: '',
            Erroremail:'',
            isFocused: '',
            Errorname: '',
            Errorpwd: '',
        }

    }
    postRegist() {
        let { email, name } = this.state;   //註冊訊息
        // email去掉空白字符
        email = email.replace(/\s+/g, "")
        let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        let namereg = /^[a-zA-Z0-9]{6,14}$/;
        if(name ==''){
          // TODO:CN-DONE 用户名不可为空
             Toast.fail("ยูสเซอร์เนมไม่สามารถเว้นให้ว่าง");
            this.setState({
                isFocused: 'error',
                Errorname: 'ยูสเซอร์เนมไม่สามารถเว้นให้ว่าง',
            })
            return
        }

        if (namereg.test(name) == false) { 
            Toast.info('ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว',2)
            // Toast.info('用户名必须拥有 6-14个数字或字母构成',2)
            this.setState({
                isFocused: 'error',
                Errorname: 'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว'//'用户名必须拥有 6-14个数字或字母构成',
            })
            return
            //Toast.info('用户名必须拥有 6-14个数字或字母构成')
        }

        if(email ==''){
            Toast.info('กรุณากรอกอีเมล',2)
            this.setState({
                isFocused: 'error',
                Errorname: 'กรุณากรอกอีเมล'//'请输入邮箱号码',
            })
            return
        }

        if (reg.test(email) == false) {
            // TODO:CN-DONE 电子邮箱格式无效。
             Toast.fail("รูปแบบไม่ถูกต้อง กรุณาระบุอีกครั้ง");
            this.setState({
                EmailFocused: 'error',
                Erroremail: 'รูปแบบไม่ถูกต้อง กรุณาระบุอีกครั้ง'
            })
            return;
        }
        // TODO:CN-DONE 提交中,请稍候 
       Toast.loading("กำลังดาวน์โหลด...");
        fetchRequest(ApiPort.ForgetPassword + '?MemberEmail=' + email + '&UserName=' + name + '&', 'POST')
            .then(data => {
                UMonEvent('ForgotPW','Submit','ForgotPW');

                Toast.hide();
                
                if (data.message == "Username is not tally with email.") {
                    Toast.info('ยูสเซอร์เนมไม่ตรงกับอีเมล',2)
                    //Toast.info('用户名与邮箱不匹配', 2);
                    this.setState({
                        EmailFocused: 'error',
                        Erroremail: 'ยูสเซอร์เนมไม่ตรงกับอีเมล',//'用户名与邮箱不匹配',
                        isFocused: 'error',
                        Errorname: 'ยูสเซอร์เนมไม่ตรงกับอีเมล',//'用户名与邮箱不匹配',
                    })
                    return;
                }
                if (data.isSuccess == true) {
                    Toast.success('ลิงก์รีเซตรหัสผ่านส่งไปที่อีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล',2)//'重置密码链接已成功发送到您的邮箱，请检查', 2)
                    return;
                } else {
                    if (data.message == 'อีเมลไม่่ถูกต้อง' ){ // '邮箱错误') {
                        //Toast.info('邮箱错误', 2);
                        this.setState({
                            EmailFocused: 'error',
                            Erroremail: 'อีเมลไม่ถูกต้อง', //'邮箱错误',
                        })
                        Toast.info('อีเมลไม่ถูกต้อง',2) //'邮箱错误',2)
                    } else {
                        Toast.fail(data.message, 2);
                    }

                }
                
            }).catch(err => {
                Toast.info('ส่งไม่สำเร็จ',2)
            })

    }

    handleUseremail = (email) => {
        let namereg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (namereg.test(email) == false) {
            this.setState({
                EmailFocused: 'error',
                Erroremail: 'อีเมลไม่ถูกต้อง'//'邮箱格式错误',
            })
        } else {
            this.setState({
                EmailFocused: 'Focus'
            })
        }
        this.setState({
            email,
        });
    }

    handleUsername = (name) => {
        let namereg = /^[a-zA-Z0-9]{6,14}$/;
        console.log(name)
        if (namereg.test(name) == false) {
            console.log(11111)
            this.setState({
                isFocused: 'error',
                Errorname: 'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว'//'用户名必须拥有 6-14个数字或字母构成',
            })
            //Toast.info('用户名必须拥有 6-14个数字或字母构成')
        } else {

            this.setState({
                isFocused: 'Focus'
            })
        }
        this.setState({ name });

    }
    UsernameFocus = () => {
        console.log('焦点')
        if (this.state.isFocused != 'error') {
            this.setState({
                isFocused: 'Focus'
            })
        }
    }

    UsernameBlur = () => {
        console.log('离开焦点')
        if (this.state.isFocused != 'error') {
            this.setState({
                isFocused: 'ok'
            })
        }
    }

    EmailFocus = () => {
        if (this.state.EmailFocused != 'error') {
            this.setState({
                EmailFocused: 'Focus'
            })
        }
    }

    EmailBlur = () => {
        console.log('离开焦点')
        if (this.state.EmailFocused != 'error') {
            this.setState({
                EmailFocused: 'ok'
            })
        }
    }

    render() {
      
        const { EmailFocused, isFocused,Errorname,Erroremail } = this.state;
        console.log(EmailFocused)
        return (

            <View style={styles.rootContainer}>
                {/* <TextInput
                
                    value={this.state.name}
                    onChangeText={this.handleUsername}
                    labelNumber={4}
                    placeholderTextColor="#fff"
                    placeholder={I18n.t('Registered.1')}
                    style={[{
                        borderColor: this.state.isFocused == 'error' ? 'red' : this.state.isFocused == 'ok' ? 'white' : this.state.isFocused == 'Focus' ? 'green' : 'white'
                    }, styles.input]}
                    onFocus={() => this.UsernameFocus()}
                    onBlur={() => this.UsernameBlur()}

                />
                {
                    this.state.isFocused == 'error' &&
                    <Text style={[{ marginTop: -5 }, styles.ErrorText]}>{Errorname}</Text>
                }
                <TextInput
                  
                    value={this.state.email}
                    onChangeText={this.handleUseremail}
                    labelNumber={4}
                    placeholder={I18n.t('Registered.5')}
                    placeholderTextColor="#fff"
                    style={[{
                        borderColor: this.state.EmailFocused == 'error' ? 'red' : this.state.EmailFocused == 'ok' ? 'white' : this.state.EmailFocused == 'Focus' ? 'green' : 'white'
                    }, styles.input]}
                    onFocus={() => this.EmailFocus()}
                    onBlur={() => this.EmailBlur()}
                />
                {
                    this.state.EmailFocused == 'error' &&
                    <Text style={[{ marginTop: -5 }, styles.ErrorText]}>{Erroremail}</Text>
                } */}

                {/*提交表單*/}
                <View style={styles.DsBorder}>
                    <InputItem
                    styles={StyleSheet.create(newStyle)}
                    clear
                    // type="number"
                    labelNumber={6}
                    name="name"
                    value={this.state.name}
                    onChange={value => {
                        this.handleUsername(value);
                    }}
                    placeholderTextColor='#9a9a9a'
                    placeholder="ยูสเซอร์เนม"//"请输入用户名"
                    >
                        <Text style={{color:'#fff',paddingLeft:8}}>ยูสเซอร์เนม: </Text>
                    </InputItem>
                </View>
                <View style={styles.DsBorder}>
                    <InputItem
                    styles={StyleSheet.create(newStyle)}
                    clear
                    // type="number"
                    labelNumber={6}
                    name="email"
                    value={this.state.email}
                    onChange={value => {
                        this.handleUseremail(value);
                    }}
                    placeholderTextColor='#9a9a9a'
                    placeholder="อีเมล"//"请输入邮箱号码"
                    >
                        <Text style={{color:'#fff',paddingLeft:8}}>อีเมล: </Text>
                    </InputItem>
                </View>

                {
                    isFocused != 'error' && EmailFocused != 'error' &&
                    <Touch onPress={this.postRegist.bind(this)} style={{ marginTop: 30, width: '100%' }} >
                        <View style={styles.success}><Text style={{ color: 'white', fontSize: 17 }}>ยืนยัน</Text></View>
                    </Touch>
                }
                {
                    (isFocused == 'error' || EmailFocused == 'error') &&
                    <Touch style={{ marginTop: 30, width: '100%' }} >
                        <View style={styles.nosuccess}><Text style={{ color: 'white', fontSize: 17 }}>ยืนยัน</Text></View>
                    </Touch>
                }
            </View>


        );
    }
}
export default Registered;
const styles = StyleSheet.create({
    visible: {
        backgroundColor: "#000",
    },
    nosuccess: {
        width: '100%',
        backgroundColor: '#242424',
        borderColor: '#242424',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    success: {
        width: '100%',
        backgroundColor: '#00b324',
        borderColor: '#00b324',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    input: {
        width: width - 45,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        color: 'white'
    },

    loginButton: {
        fontWeight: 'bold',
        borderRadius: 10,
        color: '#fff',
        textAlign: 'center',
        fontSize: 22
    },
    rootContainer: {
        flex: 1,
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
    textStyles: {
        textAlign: "center",
        color: "rgba(0,0,0,0.8)",
        fontSize: 16
    },
    touchableStyles: {
        marginTop: 15,
        marginBottom: 15,
        backgroundColor: '#012c1f',
        width: 300,
        paddingHorizontal: 50,
        paddingVertical: 10,
        borderRadius: 25
    },
    ErrorText: {
        color: 'red',
        width: '100%',
        textAlign: 'left',
        paddingLeft: 10
    },
    DsBorder: {
        // borderWidth: 1,
        // borderColor: '#3d3d3d',
        // borderRadius:5,
        height:48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:3,
      },
});

