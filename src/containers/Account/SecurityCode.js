import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, TextInput, Image, Dimensions, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import { Flex, Carousel, WhiteSpace, WingBlank, InputItem, Toast, Modal } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import { NavigationActions } from 'react-navigation';
import { I18n, getLanguages } from '../../language/i18n'
import { passwordReg } from "../../actions/Reg"
import { Actions } from 'react-native-router-flux'; 
const {
    width,
    height,
} = Dimensions.get('window')


class SecurityCode extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            securityCode: '',
            countdown: '00:00',
            countdownActive: true,
            errModal: false,
            getAgain: false,
            codeActive: 1,//1默认，2提示已复制，3提示已过期
        }

    }
    componentWillMount(props) {
        //先拿缓存，判断是否过期
        global.storage
            .load({
                key: "securityCode",
                id: "securityCode"
            })
            .then((data) => {
                let dateTime = data.expiredDateTime.split('.')[0].replace('T', ' ').replace(/\-/g, '/');
                dateTime = new Date(dateTime).getTime();
                let now = new Date().getTime();
                if (dateTime > now) {
                    this.setState({ securityCode: data })
                    this.countdownTime(dateTime)
                }
            })
            .catch(err => {

            });
    }
    componentWillUnmount() {
        this.Countdowns && clearInterval(this.Countdowns);
    }

    countdownTime(value) {
        this.Countdowns && clearInterval(this.Countdowns);

        let time = parseInt((new Date(value).getTime() - new Date().getTime()) / 1000);
        let m, s, ms;

        if(time < 1) {
            return
        }

        this.Countdowns = setInterval(() => {
            time -= 1;
            m = parseInt(time / 60).toString();
            s = time - m * 60;
            if (s < 10) {
                s = "0" + s.toString();
            }
            ms = m + ":" + s;
            if (m < 10) { ms = '0' + m.toString() + ":" + s; }
            this.setState({ countdown: ms });

            if (m == 0 && s == 0) {
                this.setState({ countdownActive: true, codeActive: 3, getAgain: false })
                clearInterval(this.Countdowns);
            }
        }, 1000);
    }

    getCode() {
        if (!this.state.countdownActive) {
            return
        }
        Toast.loading('กำลังโหลด',200)
       // Toast.loading("生成中，请稍等...", 20);

        fetchRequest(ApiPort.Generate, 'POST')
            .then(data => {
                Toast.hide();
                if (data && data.isSuccess == true) {
                    //如果code相同，显示红色提示语，不同就替换旧的code
                    if (this.state.securityCode && this.state.securityCode.passcode == data.passcode) {
                        this.setState({ getAgain: true, countdownActive: false })
                    } else {
                        this.setState({ securityCode: data, codeActive: 1, countdownActive: false })
                        let dateTime = data.expiredDateTime.split('.')[0].replace('T', ' ').replace(/\-/g, '/');
                        this.countdownTime(dateTime)
                        storage.save({
                            key: 'securityCode',
                            id: 'securityCode',
                            data: data,
                            expires: null
                        });
                    }
                } else {
                    this.setState({ errModal: true })
                }
            }).catch(error => {
                Toast.hide();
                this.setState({ errModal: true })
            })
    }
    //复制
    copy(txt) {
        UMonEvent('Verification','Click','Passcode_copy_ProfilePage');

        if (this.state.codeActive == 3) { return }
        try {
            const value = String(txt)
            Clipboard.setString(value);
            this.setState({ codeActive: 2 })
            //3秒后关闭
            setTimeout(() => {
                this.setState({ codeActive: 1 })
            }, 3000);
        } catch (error) {
            console.log(error);

        }

    }
    goLiveChat() {
        UMonEvent('Verification','Click','Passcode_Livechat_ProfilePage');
        Actions.LiveChatST()
        this.setState({ countdownActive: true, getAgain: false })
    }

    render() {

        const {
            securityCode,
            countdown,
            countdownActive,
            getAgain,
            codeActive,
            errModal,
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: '#0A0A0A', padding: 15 }}>
                <Modal
                    animationType='none'
                    transparent={true}
                    visible={errModal}
                    onRequestClose={() => { }}
                    style={{ padding: 0, width: width * 0.95, backgroundColor: 'transparent' }}
                >
                    <View style={{ backgroundColor: '#111111', borderColor: '#00B324', borderWidth: 1, paddingBottom: 15 }}>
                        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 80}}>
                            <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', paddingHorizontal: 40, marginTop: 20 }}>ไม่สามารถสร้างรหัสเพื่อความปลอดภัยได้</Text>
                            {/* 无法生成安全码 */}
                            <Touch onPress={() => { this.setState({ errModal: false }) }} style={{position: 'absolute', right: 15}}>
                                <Image
                                    resizeMode="contain"
                                    source={require("../../images/close.png")}
                                    style={{ width: 25, height: 25 }}
                                />
                            </Touch>
                        </View>
                        <View style={{ padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 22 }}>ขออภัยเราไม่สามารถสร้างรหัสความปลอดภัยได้ในขณะนี้เนื่องจากมีเหตุขัดข้อง กรุณาลองอีกครั้งในภายหลัง หรือติดต่อเจ้าหน้าที่ฝ่ายบริการเพื่อขอความช่วยเหลือ</Text>
                            {/* <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 22 }}>建议召唤师可以联系我们的在线客服咨询协助,</Text>
                            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 22 }}>很抱歉~</Text> */}
                            <Touch onPress={() => { this.setState({ errModal: false }, () => { this.goLiveChat() }) }} style={{ backgroundColor: '#00B324', borderRadius: 5, margin: 15 }}>
                                <Text style={{ color: '#fff', textAlign: 'center', width: width * 0.6, lineHeight: 40 }}>แชทสด</Text>
                            </Touch>
                        </View>
                    </View>
                </Modal>

                <View style={{ borderRadius: 10 }}>
                    <Text style={{ fontSize: 20,  color: '#00E62E', paddingTop: 15, paddingBottom: 10 }}>รหัสความปลอดภัย</Text> 
                    {/* 创建安全码 */}
                    <View>
                    <Text style={{ color: '#fff', lineHeight: 20, fontSize: 12 }}>ต้องการยกเลิกโบนัส ตรวจสอบยอดหมุนเวียน ตรวจสอบยอดได้เสีย และตั้งค่าความเป็นส่วนตัวต่างๆ สามารถรับรหัสความปลอดภัยในการขอทำรายการต่างๆได้ที่นี่ จากนั้นติดต่อฝ่ายบริการของเราที่ <Text onPress={() => { this.goLiveChat() }} style={{ color: '#00E62E', textDecorationLine: 'underline', fontSize: 12 }}> แชทสด</Text></Text>
                        {/* <Text style={{ color: '#fff', lineHeight: 20, fontSize: 12 }}>如果您需要取消紅利、查询游戏流水 / 输赢，请点击 “创建安全码” ，并发送给<Text onPress={() => { this.goLiveChat() }} style={{ color: '#00E62E', textDecorationLine: 'underline', fontSize: 12 }}>在线客服</Text></Text> */}
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 25 }}>
                        {
                            //未创建
                            securityCode == '' &&
                            <Touch onPress={() => { 
                                this.getCode();
                                UMonEvent('Verification','Click','GeneratePasscode_ ProfilePage');

                            }} style={{ backgroundColor: '#00E62E', borderRadius: 5, width: width * 0.65 }}>
                                <Text style={{ color: '#000', textAlign: 'center', lineHeight: 45, fontSize: 20 }}>รหัสความปลอดภัย</Text>
                                {/* 产生安全码 */}
                            </Touch>
                        }
                        {
                            //已创建
                            securityCode != '' &&
                            <View style={{ padding: 25, borderWidth: 1, borderColor: '#464646', width: width * 0.9, paddingBottom: 38 }}>
                                <Text style={{ textAlign: 'center', fontSize: 20, color: '#fff', padding: 5 }}>รหัสความปลอดภัย</Text>
                                {/* 已创建安全码 */}
                                <Touch onPress={() => { this.copy(securityCode.passcode) }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                                    {
                                        securityCode.passcode.split('').map((num, index) => {
                                            return (
                                                <Text key={index} style={{ textAlign: 'center', fontSize: 40, color: '#00E62E', padding: 5 }}>{num}</Text>
                                            )
                                        })
                                    }
                                    <Image
                                        resizeMode="contain"
                                        source={require("../../images/Groups.png")}
                                        style={{ width: 38, height: 38 }}
                                    />
                                    {
                                        codeActive != 1 &&
                                        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60, backgroundColor: 'rgba(0, 0, 0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: codeActive == 2 ? '#00E62E' : '#FF0000', fontSize: 22 }}>{codeActive == 2 ? 'คัดลอกแล้ว' : 'รหัสหมดอายุแล้ว'}</Text>
                                        </View>
                                    }
                                </Touch>
                                {
                                    codeActive == 3 ?
                                        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>รหัสหมดอายุแล้ว</Text>
                                        // 您的安全码已失效
                                        :
                                        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>รหัสความปลอดภัยจะหมดอายุภายใน {countdown} นาที</Text>
                                        // <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>您的安全码将在 {countdown} 内有效</Text>
                                }
                                <View style={{ alignItems: 'center' }}>
                                    <Touch onPress={() => { 
                                        this.getCode();
                                        UMonEvent('Verification','Click','GeneratePasscode_ ProfilePage');
                                    }} style={{ backgroundColor: countdownActive ? '#00E62E' : '#646464', borderRadius: 5, width: width * 0.65, marginTop: 25 }}>
                                        <Text style={{ color: '#0A0A0A', textAlign: 'center', lineHeight: 40, fontSize: 16 }}>รับรหัสความปลอดภัยใหม่</Text>
                                        {/* 创建新的安全码 */}
                                    </Touch>
                                </View>
                            </View>
                        }
                    </View>
                    {getAgain &&
                        <View>
                            <Text style={{ color: '#FF0000', textAlign: 'center', padding: 15, paddingTop: 25, lineHeight: 20, fontSize: 12 }}>รหัสปัจจุบันยังคงมีอายุ โปรดใช้รหัสผ่านเดิมหรือรอจนกว่าจะหมดอายุ</Text>
                            {/* 此安全码仍可使用。请使用此安全码或等待限期结束创建新的安全码。 */}
                        </View>
                    }
                </View>
      


            </View>

        );
    }
}






export default SecurityCode;




const styles = StyleSheet.create({

});



