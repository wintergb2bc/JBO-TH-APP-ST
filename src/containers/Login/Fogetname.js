import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import { InputItem, Toast } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import { I18n, getLanguages } from '../../language/i18n'
declare var jest: any;

const { width, height } = Dimensions.get('window')

class ForgetUsername extends React.Component<any, any> {
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
            isFocus: false,
            isFocused: '',
            Errorname: '',

        }
    }

    postRegist() {
        let { email } = this.state;   //註冊訊息
        // email去掉空白字符
        email = email.replace(/\s+/g, "")
        let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (reg.test(email) == false) {
           Toast.info('รูปแบบอีเมลไม่ถูกต้องโปรดป้อนอีเมลที่ถูกต้อง')
            // Toast.info('邮箱格式错误')
             this.setState({
                isFocused: 'error',
                Errorname: 'รูปแบบอีเมลไม่ถูกต้องโปรดป้อนอีเมลที่ถูกต้อง',//'邮箱格式错误',
            })
            return;
        }


        Toast.loading('กำลังโหลด',200)
  //      Toast.loading('加载中...');
        fetchRequest(ApiPort.ForgetUsername + '?email=' + email + '&', 'POST')
            .then(data => {
                UMonEvent('ForgotUN','Launch','ForgotUN');
                Toast.hide(); 
                if (data.isSuccess == false) {
                    Toast.info(data.message, 2);
                } else {
                   Toast.success('ส่งเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลเพื่อการยืนยันที่สมบูรณ์',2)
                    // Toast.success('已发送至邮箱', 2)
                }
            }).catch(err => {
                
            })
    }
    handleUseremail = (email) => {
        let namereg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (namereg.test(email) == false) {
            this.setState({
                isFocused: 'error',
                Errorname: 'รูปแบบอีเมลไม่ถูกต้องโปรดป้อนอีเมลที่ถูกต้อง'//'邮箱格式错误',
            })
        } else {
            this.setState({
                isFocused: 'Focus'
            })
        }
        this.setState({
            email,
        });
    }

    NameFocus = () => {
        if (this.state.isFocused != 'error') {
            this.setState({
                isFocused: 'Focus'
            })
        }
    }

    NameBlur = () => {
        console.log('离开焦点')
        if (this.state.isFocused != 'error') {
            this.setState({
                isFocused: 'ok'
            })
        }
    }

    render() {
        const {isFocused,Errorname} = this.state;
        return (

            <View style={styles.rootContainer}>
                <View style={{borderBottomColor: '#3d3d3d',borderBottomWidth:1,paddingBottom:5}}>
                    <TextInput
                    
                    value={this.state.email}
                    onChangeText={this.handleUseremail}
                    labelNumber={4}
                    placeholder={"อีเมล" /*電子郵件*/}
                    placeholderTextColor="#fff"
                    onFocus={this.NameFocus}
                    onBlur={this.NameBlur}
                    // style={[{
                    //     borderColor: this.state.isFocused == 'error' ? 'red' : this.state.isFocused == 'ok' ? 'white' : this.state.isFocused == 'Focus' ? 'green' : 'white'
                    // }, styles.input]}
                    style={{width: width-50,color: '#fff',paddingLeft:10,paddingRight:10}}
                />
                </View>
                {
                    this.state.isFocused == 'error' &&
                    <Text style={[{ marginTop: 0 }, styles.ErrorText]}>{Errorname}</Text>
                }

                {/*提交表單*/}
                {
                    isFocused != 'error' &&
                    <Touch onPress={this.postRegist.bind(this)} style={{ marginTop: 20, width: '100%' }} >
                        <View style={styles.success}><Text style={{ color: 'white', fontSize: 17 }}>ยืนยัน</Text></View>
                    </Touch>
                }
                {
                    (isFocused == 'error') &&
                    <Touch style={{ marginTop: 20, width: '100%' }} >
                        <View style={styles.nosuccess}><Text style={{ color: 'white', fontSize: 17 }}>ยืนยัน</Text></View>
                    </Touch>
                }

            </View>

        );
    }
}

export default ForgetUsername;
const styles = StyleSheet.create({
    visible: {
        backgroundColor: "#000",
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
    ErrorText: {
        color: 'red',
        width: '100%',
        textAlign: 'left',
        paddingLeft: 10,
        paddingTop:8
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
        marginLeft: 0,
        width: '100%'
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
    }
});

