import React from 'react';
import { StyleSheet, WebView, Text, View, Animated, TouchableOpacity, Dimensions, Image, Platform, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Carousel, WhiteSpace, WingBlank, Flex, Toast, InputItem, ActivityIndicator, List, Picker } from 'antd-mobile-rn';
import PickerStyle from "antd-mobile-rn/lib/picker/style/index.native";
import PickerList from "antd-mobile-rn/lib/list/style/index.native";
const nameTest = /^[a-zA-Z0-9'\u4e00-\u9fa5\u0E00-\u0E7F ]{2,50}$/;

// const nameTest = /^[a-zA-Z0-9'\u4e00-\u9fa5\u0E00-\u0E7F ]{2,50}$/
const phoneTest = /^[1-9][0-9]{8}$/;//手机号
const phoneCodeTest = /[0-9]{4}/;//手机验证码
const EmailTEST = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;//邮箱
const locatData = require('./locatData.json');
const {
    width, height
} = Dimensions.get('window')

locatData.forEach(item => {
    item.value = item.label;
    item.children.forEach((val) => {
        val.value = val.label;
        val.children.forEach((v) => {
            v.value = v.label;
        })
    })
});

const newStyle = {};
for (const key in PickerList) {
    if (Object.prototype.hasOwnProperty.call(PickerList, key)) {
        // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
        newStyle[key] = { ...StyleSheet.flatten(PickerList[key]) };
        newStyle[key].opacity = 0;
        newStyle[key].backgroundColor = 'transparent';
    }
}

class UserVerifie extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isFocusedA: '',
            isFocusedB: '',
            stepOne: false,
            stepTwo: false,
            stepTree: false,
            stepFour: false,
            step1: true,
            step2: true,
            step3: false,
            step4: false,
            username: '',
            isDisabled: false,
            phoneNumber: '',
            phoneCode: '',
            getCode: false,
            getCodeAgain: 0,
            language: '',
            cityData: '',
            detailAdress: '',
            EmailNumber: '',
            profileMasterData: []
        }
    }

    componentDidMount() {
        console.log(this.props)
        let Verifie = this.props.UserVerifie;
        this.setState({ phoneNumber: Verifie.phoneNumber, getCode: Verifie.phoneNumber, EmailNumber: Verifie.emailNumber})
        if (Verifie.OneName) {
            this.setState({ stepOne: true })
        // } else if (Verifie.TwoPhone) {
        //     this.setState({ stepTwo: true, step2: true })
        } else if (Verifie.TreeAddress) {
            this.setState({ stepTree: true, step2: true, step3: true })
        } else if (Verifie.FourEmail) {
            this.setState({ stepFour: true, step2: true, step3: true, step4: true, isDisabled: Verifie.emailNumber })
        }

        this.getProfileMasterData()
    }

    componentWillUnmount() {
        clearInterval(this.phoneCodeInterval)
    }


    InputFocus = (key) => {
        if (this.state.isFocusedA != 'error' && key == 0) {
            this.setState({
                isFocusedA: 'Focus',
            })
        }
        if (this.state.isFocusedB != 'error' && key == 1) {
            this.setState({
                isFocusedB: 'Focus',
            })
        }
    }
    InputBlur = (key) => {
        if (this.state.isFocusedA != 'error' && key == 0) {
            this.setState({ isFocusedA: 'ok' })
        }

        if (this.state.isFocusedB != 'error' && key == 1) {
            this.setState({ isFocusedB: 'ok' })
        }
    }

    //用户名验证
    UserName(val) {
        this.setState({
            isFocusedA: nameTest.test(val) ? 'Focus' : 'error',
            username: val,
            isDisabled: nameTest.test(val),
        })
    }

    //手机验证
    PhoneChange(val, key) {
        if (key == 0) {
            this.setState({
                isFocusedA: phoneTest.test(val) ? 'Focus' : 'error',
                getCode: phoneTest.test(val),
                phoneNumber: val,
                isDisabled: phoneTest.test(val) && phoneCodeTest.test(this.state.phoneCode),
            })
        } else {
            this.setState({
                isFocusedB: phoneCodeTest.test(val) ? 'Focus' : 'error',
                phoneCode: val,
                isDisabled: phoneCodeTest.test(val) && phoneTest.test(this.state.phoneNumber),
            })
        }
    }

    //地址验证
    onPickerChange(val) {
        this.setState({
            cityData: val.join(' '),
            isDisabled: this.state.detailAdress,
        })
    };
    onVisibleChange() {
        if (!this.state.isFocusedA || this.state.isFocusedA == 'ok') {
            this.setState({ isFocusedA: 'Focus' })
        } else {
            this.setState({ isFocusedA: 'ok' })
        }
    }
    DetailAdress(val) {
        const TS = /[^\u4e00-\u9fa5\w\，\,\(\)]/ig;
        this.setState({
            detailAdress: val.replace(TS,''),
            isDisabled: this.state.cityData && val.replace(TS,''),
        })
    }

    //邮箱验证
    EmailChange(val) {
        this.setState({
            EmailNumber: val,
            isFocusedA: EmailTEST.test(val) ? 'Focus' : 'error',
            isDisabled: EmailTEST.test(val),
        })
    }
    NextBtn(key) {
        if (!this.state.isDisabled) {return}
        this.setState({
            isFocusedA: '',
            isFocusedB: '',
            isDisabled: false,
        })
        if (key == 1) { this.NameVerifie() }
        if (key == 2) { this.PhoneVerifie() }
        if (key == 3) { this.AdressVerifie() }
        if (key == 4) { this.EmailVerifie() }
    }

    //验证顺序,忽略已验证
    Verifie() {
        let Verifie = this.props.UserVerifie;
        if (Verifie.TwoPhone && !this.state.step2) {
            this.setState({
                step2: true,
                stepOne: false,
                stepTwo: true,
            })
        } else if (Verifie.TreeAddress && !this.state.step3) {
            this.setState({
                step2: true,
                step3: true,
                stepOne: false,
                stepTwo: false,
                stepTree: true,
            })
        } else if (Verifie.FourEmail && !this.state.step4) {
            this.setState({
                step2: true,
                step3: true,
                step4: true,
                stepOne: false,
                stepTwo: false,
                stepTree: false,
                stepFour: true,
            })
        } else {
            this.goBack()
        }
    }

    GetCode() {
        if (!this.state.getCode) { return };
        const PhoneData = {
            MsIsdn: this.state.phoneNumber,
            IsRegistration: false, //是不是注册
            IsOneTimeService: false, //只有注册时候才为true
            memberCode: this.props.memberInfo.MemberCode,
            currencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 3 : 4, //1的话是JBO PC   2 == mobile
            IsMandatoryStep: false,
            serviceAction: "ContactVerification"
        };
        this.setState({ getCode: false })
        this.setState({ getCodeAgain: 180 })
        let s = 180;
        this.phoneCodeInterval = setInterval(() => {
            s -= 1;
            this.setState({ getCodeAgain: s })
            if (s == 0) {
                this.setState({
                    getCode: true,
                })
                clearInterval(this.phoneCodeInterval)
            }
        }, 1000);
        Toast.loading('กรุณารอขณะที่กำลังส่งรหัสยืนยัน...', 200);
        fetchRequest(ApiPort.POSTPhoneVerifyAPI, "POST", PhoneData)
            .then(data => {
                Toast.hide();
                if (data.result.message == "SMSLimitTries") {
                    Toast.success('ส่งหลายครั้งเกินไปโปรดลองอีกครั้งใน 24 ชั่วโมง', 2);
                }
                if (data.isSuccess == true) {
                    Toast.success('ส่งรหัสยืนยันทางโทรศัพท์แล้ว กรุณาตรวจสอบ SMS เพื่อทำการยืนยันให้สมบูรณ์', 2);
                } else if (data.isSuccess == false) {
                    Toast.fail(data.result.message, 2);
                }
            })
            .catch(data => {
                Toast.fail(data.errorMessage, 1);
            })
    }

    NameVerifie() {
        const MemberData = {
            "key": "FirstName",
            "value1": this.state.username,
        }
        this.setState({username: ''})
        Toast.loading('กำลังยืนยัน โปรดรอสักครู่...', 200);
        fetchRequest(ApiPort.Register, 'PATCH', MemberData)
            .then((data) => {
                // console.log(data)
                Toast.hide();
                if (data.isSuccess == true) {
                    Toast.success('อัปเดตสำเร็จ!');
                    this.Verifie()
                } else if (data.isSuccess == false) {
                    Toast.fail(data.message);
                }
            })
            .catch((error) => { Toast.fail(error.errorMessage, 1); })
    }

    PhoneVerifie() {
        let PhoneData;
        let num = this.state.phoneNumber.replace(/ /g, '');
        let numberS = '';
        if (num[0] != '6') {
            numberS = '66-' + num;
        } else {
            numberS = num;
        }

       
            PhoneData = {
                VerificationCode: this.state.phoneCode,
                MsIsdn: numberS,
                IsRegistration: false, //是不是注册
                ServiceAction: "ContactVerification",
                SiteId: Platform.OS === "android" ? 3 : 4, //1的话是JBO PC   2 == mobile
                MemberCode: this.props.memberInfo.MemberCode, //name
                IsMandatoryStep: false
            };
        
        this.setState({phoneCode: ''})
        Toast.loading('กำลังยืนยัน โปรดรอสักครู่...', 200);
        fetchRequest(ApiPort.PhoneTAC + "?", "POST", PhoneData)
            .then(data => {
                Toast.hide();
                // console.log(data)
                if (data.isSuccess == false) {
                    Toast.fail(data.result.message, 2);
                } else {
                    if (
                        data.result.exception == "UE_SMS000" ||
                        data.result.exception == "SMS002" ||
                        data.result.exception == "SMS001"
                    ) {
                        Toast.fail(data.result.message, 2);
                    } else {
                        // 将验证成功结果写入缓存
                        Toast.success("การยืนยันรหัสเสร็จสมบูรณ์", 2);
                        const key = userNameDB + "phoneVerify"; //userNameDB是用户名，在Login.js里赋值的
                        global.storage.save({
                            key,
                            id: key,
                            data: "success",
                            expires: null
                        });
                        this.Verifie()
                    }
                }
            })
            .catch(error => {
                Toast.fail(error.errorMessage, 1);
            });

    }

    AdressVerifie() {
        const MemberData = {
            "wallet": "MAIN",
            "addresses": {
                "address": this.state.detailAdress,
                "city": this.state.cityData,
                "country": "THB",
                "nationId": 1
            }
        }
        this.setState({cityData: '', detailAdress: ''})
        Toast.loading('กำลังยืนยัน โปรดรอสักครู่...', 200);
        fetchRequest(ApiPort.Register, 'PUT', MemberData)
        .then((data) => {
            Toast.hide();
            console.log(data)
            if (data.isSuccess == true) {
                Toast.success('อัปเดตสำเร็จ!');
                this.Verifie()
            } else if (data.isSuccess == false) {
                if (data.message == 'MEM00050') {
                    Toast.fail('คุณไม่ได้แก้ไขข้อมูล。');
                } else {
                    Toast.fail(data.result.Message);
                }
            }
        }).catch(error => {
            Toast.fail(error.errorMessage, 1);
        });

    }

    EmailVerifie() {
        const MemberData = {
            addresses: { nationId: 1 },
            language: "th-th",
            email: this.state.EmailNumber,
            wallet: this.props.memberInfo.PreferWallet,
            blackBoxValue: Iovation,
            e2BlackBoxValue: E2Backbox,
        }

        Toast.loading('กำลังยืนยัน โปรดรอสักครู่...', 200);
        fetchRequest(ApiPort.PUTMemberlistAPI + '?', 'PUT', MemberData)
            .then((res) => { 
                Toast.hide();
                if(res.isSuccess == false ){
                    if(res.result.Message){
                      Toast.fail(res.result.Message);
                      return;
                    }else{
                      Toast.fail('โปรดลองอีกครั้งในภายหลัง');
                      return;
                    }
                   }
                  if (res.isSuccess == true) {
                      Toast.success('อัปเดตสำเร็จ!');
                    //   this.setState({
                    //       NoHaveEmail:false
                    //   }) 
      
                    //   this.getUser();
                    
                      if(window.memberData){
                        memberData(); //觸發 帳戶管理刷新
                      }
      
                  } else if (res.isSuccess == false) {
                      Toast.fail(res.result.Message);
                  }

                  if(window.CallBackWith){
                     
                       	setTimeout( ()=> {
                            CallBackWith(); 
                    	}, 1500);   
                  }
                this.goBack()
                // this.Verifie()//提交邮箱即可
            })
            .catch(error => { 
         
                this.setState({isDisabled: true}) 
                if(error.message == "MEM00050"){
                    Toast.fail('การตั้งค่าไม่มีการเปลี่ยนแปลง');
                    return;
                  }  
                  if (error) {
                      let errors = JSON.parse(error.content); 
                      if (errors.error_details) {
                        Toast.fail(errors.error_details.Message);
                      } else {
                        Toast.fail('โปรดลองอีกครั้งในภายหลัง');
                      }
                  } else {
                    Toast.fail('โปรดลองอีกครั้งในภายหลัง');
                  }
                    this.goBack()

            });

    }
    goBack = () => {
        this.props.beforeBack ? this.props.beforeBack() : null;
        Actions.pop()
    }
    getProfileMasterData = () => {
        fetchRequest(`${ApiPort.GETProfileMasterData}category=City&`, "GET")
            .then(res=>{
                const data = res.result.map(elem => (
                    {
                        label: elem.localizedName,
                        value: elem.localizedName,
                        children: []
                    }
                ));
                this.setState({
                    profileMasterData: data
                })
            })
    }
    render() {

        const {
            stepOne,
            stepTwo,
            stepTree,
            stepFour,
            isFocusedA,
            isFocusedB,
            username,
            isDisabled,
            phoneNumber,
            phoneCode,
            getCode,
            getCodeAgain,
            cityData,
            detailAdress,
            EmailNumber,
            step1,
            step2,
            step3,
            step4,
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: "#111111", zIndex: 200, }}>
                <View style={[{ height: Platform.OS === 'ios' ? 95 : 65, zIndex: 200, }, styles.headerTop]}>
                    <TouchableOpacity style={{ width: 40, paddingLeft: 10 }} onPress={() => { this.goBack() }} >
                        <Image resizeMode='stretch' source={require('../images/back_chevron.png')} style={{ width: 14, height: 24 }} />
                    </TouchableOpacity>
                    <Text style={{ color: '#fff', fontSize: 15 }}>กรอกข้อมูลส่วนตัว</Text>
                    {/* <Text style={{color: '#fff', fontSize: 15}}>完善个人资料</Text> */}
                    <Text style={{ width: 5 }}> </Text>
                </View>
                <View style={styles.stepList}>
                    <View style={[styles.steps, step1 ? styles.stepActive : '']}>
                        <Text style={styles.stepsText}>1</Text>
                    </View>
                    {/* <Text style={[styles.stepsRow, step2 ? styles.stepActive : '']}></Text>
                    <View style={[styles.steps, step2 ? styles.stepActive : '']}>
                        <Text style={styles.stepsText}>2</Text>
                    </View> */}
                    <Text style={[styles.stepsRow, step3 ? styles.stepActive : '']}></Text>
                    <View style={[styles.steps, step3 ? styles.stepActive : '']}>
                        <Text style={styles.stepsText}>2</Text>
                    </View>
                    <Text style={[styles.stepsRow, step4 ? styles.stepActive : '']}></Text>
                    <View style={[styles.steps, step4 ? styles.stepActive : '']}>
                        <Text style={styles.stepsText}>3</Text>
                    </View>
                </View>

                {   //用户名验证
                    stepOne &&
                    <View style={styles.inputBox}>
                        <Text style={styles.descrip}>{(username || isFocusedA == 'Focus' || isFocusedA == 'error') && 'ชื่อจริง'}</Text>
                        <TextInput
                            style={[{
                                borderColor: isFocusedA == 'error' ? 'red' : isFocusedA == 'ok' ? 'white' : isFocusedA == 'Focus' ? 'green' : 'white'
                            }, styles.input]}
                            value={username}
                            underlineColorAndroid='transparent'
                            placeholder='ชื่อจริง'
                            placeholderTextColor='#d4d4d4'
                            type='text'
                            returnKeyType='done'
                            onChangeText={value => { this.UserName(value) }}
                            onFocus={() => this.InputFocus(0)}
                        />
                        <Text style={isFocusedA == 'Focus' ? styles.okDescrip : isFocusedA == 'error' ? styles.errDescrip : ''}>
                            {
                                isFocusedA == 'Focus' ? 'กรุณาตรวจสอบว่าชื่อตรงกับชื่อบัญชีธนาคาร' :
                                    isFocusedA == 'error' ? 'ยูสเซอร์เนมต้องประกอบด้วยตัวอักษรและตัวเลข 6-14 ตัว' : ''
                            }
                        </Text>
                        <TouchableOpacity onPress={() => { this.NextBtn(1) }}>
                            <View style={isDisabled ? styles.nextBtn : styles.nextBtnErr}>
                                <Text style={styles.nextText}>ส่ง</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                {   //手机号验证
                    stepTwo &&
                    <View style={styles.inputBox}>
                        <Text style={styles.descrip}>{(phoneNumber || isFocusedA == 'Focus' || isFocusedA == 'error') && 'เบอร์โทรศัพท์'}</Text>
                        <TextInput
                            style={[{
                                borderColor: isFocusedA == 'error' ? 'red' : isFocusedA == 'ok' ? 'white' : isFocusedA == 'Focus' ? 'green' : 'white'
                            }, styles.input]}
                            value={phoneNumber}
                            underlineColorAndroid='transparent'
                            placeholder='เบอร์โทรศัพท์'
                            placeholderTextColor='#d4d4d4'
                            type='text'
                            returnKeyType='done'
                            editable={this.props.UserVerifie.phoneNumber ? false : true}
                            onChangeText={value => { this.PhoneChange(value, 0) }}
                            onFocus={() => this.InputFocus(0)}
                            onBlur={() => this.InputBlur(0)}
                        />
                        <Text style={styles.errDescrip}>
                            {isFocusedA == 'error' && 'รูปแบบเบอร์โทรไม่ถูกต้อง'}
                        </Text>
                        <Text style={styles.descrip}>{(phoneCode || isFocusedB == 'Focus' || isFocusedB == 'error') && 'รหัส OTP'}</Text>
                        <View style={styles.codeBox}>
                            <TextInput
                                style={[{
                                    borderColor: isFocusedB == 'error' ? 'red' : isFocusedB == 'ok' ? 'white' : isFocusedB == 'Focus' ? 'green' : 'white'
                                }, styles.inputCode]}
                                value={phoneCode}
                                underlineColorAndroid='transparent'
                                placeholder='รหัส OTP'
                                placeholderTextColor='#d4d4d4'
                                keyboardType='numeric'
                                maxLength={4}
                                returnKeyType='done'
                                onChangeText={value => { this.PhoneChange(value, 1) }}
                                onFocus={() => this.InputFocus(1)}
                                onBlur={() => this.InputBlur(1)}
                            />
                            <TouchableOpacity onPress={() => { this.GetCode() }} style={{ width: '35%' }}>
                                <View style={getCode ? styles.getCodeActive : styles.getCode}>
                                    <Text style={styles.codeText}>
                                        {getCodeAgain == 0 ? 'รับรหัสยืนยันเรียบร้อยแล้ว' : `ส่งอีกครั้ง(${getCodeAgain})`}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.errDescrip}>
                            {isFocusedB == 'error' && 'รูปแบบรหัสยืนยันขัดข้อง'}
                        </Text>
                        <TouchableOpacity onPress={() => { this.NextBtn(2) }}>
                            <View style={isDisabled ? styles.nextBtn : styles.nextBtnErr}>
                                <Text style={styles.nextText}>ส่ง</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                {
                    stepTree &&
                    <View style={styles.inputBox}>
                        <View>
                            <Text style={[styles.descrip, { height: 30 }]}>{(cityData || isFocusedA == 'Focus' || isFocusedA == 'error') && 'เมือง'}</Text>
                            <TextInput
                                style={[{
                                    position: 'absolute', top: 20, borderColor: isFocusedA == 'error' ? 'red' : isFocusedA == 'ok' ? 'white' : isFocusedA == 'Focus' ? 'green' : 'white'
                                }, styles.input]}
                                value={cityData}
                                underlineColorAndroid='transparent'
                                placeholder='เมือง'
                                // placeholder='城市/城镇'
                                placeholderTextColor='#d4d4d4'
                                type='text'
                                returnKeyType='done'
                                editable={false}
                            />
                            <Picker
                                data={this.state.profileMasterData}
                                cols={1}
                                onChange={(e) => { this.onPickerChange(e) }}
                                onVisibleChange={() => { this.onVisibleChange() }}
                                locale={{
                                    okText: "ตกลง",
                                    dismissText: "ยกเลิก"
                                }}
                            >
                                <List.Item arrow="horizontal" styles={StyleSheet.create(newStyle)}></List.Item>
                            </Picker>
                        </View>
                        <Text style={[styles.descrip, { marginTop: 10 }]}>{(detailAdress || isFocusedB == 'Focus' || isFocusedB == 'error') && 'ที่อยู่'}</Text>
                        <TextInput
                            style={[{
                                borderColor: isFocusedB == 'error' ? 'red' : isFocusedB == 'ok' ? 'white' : isFocusedB == 'Focus' ? 'green' : 'white'
                            }, styles.input]}
                            value={detailAdress}
                            underlineColorAndroid='transparent'
                            placeholder='ที่อยู่'
                            // placeholder='详细地址'
                            placeholderTextColor='#d4d4d4'
                            returnKeyType='done'
                            onChangeText={value => { this.DetailAdress(value) }}
                            onFocus={() => this.InputFocus(1)}
                            onBlur={() => this.InputBlur(1)}
                        />
                        <TouchableOpacity onPress={() => { this.NextBtn(3) }}>
                            <View style={isDisabled ? styles.nextBtn : styles.nextBtnErr}>
                                <Text style={styles.nextText}>ส่ง</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                {
                    stepFour &&
                    <View style={styles.inputBox}>
                        <Text style={styles.descrip}>{(EmailNumber || isFocusedA == 'Focus' || isFocusedA == 'error') && 'อีเมล'}</Text>
                        <TextInput
                            style={[{
                                borderColor: isFocusedA == 'error' ? 'red' : isFocusedA == 'ok' ? 'white' : isFocusedA == 'Focus' ? 'green' : 'white'
                            }, styles.input]}
                            value={EmailNumber}
                            underlineColorAndroid='transparent'
                            placeholder='อีเมล'
                            //placeholder='邮箱地址'
                            placeholderTextColor='#d4d4d4'
                            type='text'
                            returnKeyType='done'
                            onChangeText={value => { this.EmailChange(value, 0) }}
                            onFocus={() => this.InputFocus(0)}
                            onBlur={() => this.InputBlur(0)}
                        />
                        <Text style={(isDisabled || isFocusedA == 'Focus') ? styles.okDescrip : isFocusedA == 'error' ? styles.errDescrip : ''}>
                            {
                                (isDisabled || isFocusedA == 'Focus') ? '*กรุณากดยืนยันเพื่อการยืนยันอีเมลที่สมบูรณ์' :
                                    isFocusedA == 'error' ? 'รูปแบบอีเมลไม่ถูกต้อง' : ''
                            }
                        </Text>
                        <TouchableOpacity onPress={() => { this.NextBtn(4) }}>
                            <View style={isDisabled ? styles.nextBtn : styles.nextBtnErr}>
                                <Text style={styles.nextText}>ส่ง</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </View>

        )
    }
}


export default (UserVerifie);



const styles = StyleSheet.create({
    headerTop: {
        top: 0,
        backgroundColor: '#111111',
        width: width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 20,
        padding: 6,
    },
    stepList: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center",
        flexDirection: 'row',
        marginTop: 20,
    },
    steps: {
        width: 35,
        backgroundColor: '#2a2a2a',
        borderRadius: 100,
    },
    stepsText: {
        textAlign: 'center',
        color: '#fff',
        lineHeight: 35,
    },
    stepsRow: {
        width: 40,
        height: 2,
        backgroundColor: '#2a2a2a',
    },
    stepActive: {
        backgroundColor: '#0d7f00',
    },
    inputBox: {
        position: 'relative',
        padding: 15,
    },
    input: {
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        color: 'white',
        width: '100%',
    },
    codeBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        flexDirection: 'row',
    },
    inputCode: {
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5,
        marginBottom: 10,
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        color: 'white',
        width: '60%',
    },
    getCode: {
        backgroundColor: '#2d2d2d',
        borderRadius: 5,
    },
    getCodeActive: {
        backgroundColor: '#0d7f00',
        borderRadius: 5,
    },
    codeText: {
        color: '#fff',
        paddingTop: 15,
        paddingBottom: 15,
        textAlign: 'center',
    },
    descrip: {
        color: '#fff',
        paddingLeft: 10,
    },
    okDescrip: {
        color: 'green',
        paddingLeft: 10,
    },
    errDescrip: {
        color: 'red',
        paddingLeft: 10,
    },
    nextBtn: {
        backgroundColor: '#0d7f00',
        borderRadius: 5,
        marginTop: 10,
    },
    nextText: {
        textAlign: 'center',
        lineHeight: 35,
        color: '#fff',
        fontSize: 18,
    },
    nextBtnErr: {
        backgroundColor: '#2d2d2d',
        borderRadius: 5,
        marginTop: 10,
    },
});
