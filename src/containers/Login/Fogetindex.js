import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { Toast, Tabs } from 'antd-mobile-rn';
import TabsItemStyle from 'antd-mobile-rn/lib/tabs/style/index.native';
import Fogetname from './Fogetname';
import Fogetpassword from './Fogetpassword';
const {
    width
} = Dimensions.get('window')
const tabs = [
    { title: 'ลืมรหัสผ่าน' },
    { title: 'ลืมยูสเซอร์เนม' },
];

declare var jest: any;

const TabsnewStyle = {};
for (const key in TabsItemStyle) {
    if (Object.prototype.hasOwnProperty.call(TabsItemStyle, key)) {
        TabsnewStyle[key] = { ...StyleSheet.flatten(TabsItemStyle[key]) };
        if (TabsnewStyle[key].topTabBarSplitLine) {
            TabsnewStyle[key].topTabBarSplitLine.borderBottomColor = '#3d3d3d'
        }
    }
}
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
            Scode: ''// 推薦代碼 
        }

    }

    postRegist() {
        const { email } = this.state;   //註冊訊息
        let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if (reg.test(email) == false) {
            Toast.fail('รูปแบบอีเมลไม่ถูกต้องโปรดป้อนอีเมลที่ถูกต้อง')
            //Toast.fail('邮箱格式错误')
            return;
        }
        Toast.loading('กำลังโหลด',200)
        //  Toast.loading('加载中...');
        fetchRequest(ApiPort.ForgetUsername + '?email=' + email + '&', 'POST')
            .then(data => {
                
                Toast.hide();
                if (data.isSuccess == false) {
                    Toast.fail(data.message, 2);
                } else {
                    Toast.success(data.message, 2)
                }
            }).catch(err => {
                
            })

    }
    render() {
        return (
            <ScrollView
                style={{ flex: 1, backgroundColor: '#0a0a0a', padding: 20 }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {/* <Fogetpassword /> */}
                <Tabs style={styles.rootContainer} tabs={tabs}
                    initialPage={0}
                    animated={false}
                    useOnPan={false}
                    tabBarInactiveTextColor='white'
                    tabBarActiveTextColor='#19ff00'
                    tabBarBackgroundColor='#171717'
                    tabBarUnderlineStyle={{ backgroundColor: '#17fe00' }}>
                    <View style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', height:230 , backgroundColor: '#fff' }}>
                    <Fogetpassword />   
                    </View>
                    <View style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', height: 170, backgroundColor: '#fff' }}>
                    <Fogetname />
                    </View>

                </Tabs>

            </ScrollView>

        );
    }
}
export default ForgetUsername;
const styles = StyleSheet.create({
    visible: {
        backgroundColor: "#000",
    },
    input: {
        width: 320,
        color: '#fff',
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#9e9e9e'
    },
    loginButton: {
        fontWeight: 'bold',
        borderRadius: 10,
        color: '#fff',
        textAlign: 'center',
        fontSize: 22
    },
    rootContainer: {
        width: '100%',
        marginBottom: 10,
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
 

});

