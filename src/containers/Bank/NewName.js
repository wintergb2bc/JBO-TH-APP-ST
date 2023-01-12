import React, {Component} from 'react';
import {
    ScrollView,
    ActivityIndicator,
    Platform,
    TouchableHighlight,
    StyleSheet,
    PermissionsAndroid,
    Modal,
    CameraRoll,
    Alert,
    Linking,
    Text,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    Clipboard
} from 'react-native';
import { Toast, InputItem} from "antd-mobile-rn";
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";
import {Actions} from 'react-native-router-flux';
import Touch from "react-native-touch-once";

const {width, height} = Dimensions.get("window");

const newStyle = {};
for (const key in InputItemStyle) {
    if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
        newStyle[key] = {...StyleSheet.flatten(InputItemStyle[key])};
        if (key === 'input') {
            newStyle[key].color = '#fff';
            newStyle[key].fontSize = 13
            // newStyle[key].textAlign = 'right';
            // newStyle[key].marginRight = 10;
        }
        newStyle[key].borderBottomColor = '#1a1a1a';
    }
}


class NewName extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lastName: '',
            firstName: ''
        }
    }

    userName = () => {
        let {lastName, firstName} = this.state;
        firstName = firstName.replace(/ /g, "");
        lastName = lastName.replace(/ /g, "");
        const nameTest = /^[a-zA-Z\u0E00-\u0E7F ]{2,20}$/; //真实名正则
        const lastNameTest = /^[a-zA-Z\u0E00-\u0E7F\u200b ]{2,50}$/; //真实姓氏正则


        if (firstName == '') {
            // TODO:CN-DONE 请填写真实名字
            Toast.fail("กรุณากรอกชื่อจริง");
            return;
        }
        if (nameTest.test(firstName) != true) {
            // TODO:CN-DONE 真实名字格式错误。
            Toast.fail("ชื่อที่ใช้สมัครควรมีความยาวไม่เกิน20ตัวอักษร และเป็นภาษาไทยเท่านั้น");
            return;
        }

        if (lastName == '') {
            // TODO:CN-DONE 姓氏不可为空
            Toast.fail("กรุณาระบุนามสกุลของคุณ");
            return;
        }
        if (lastNameTest.test(lastName) != true) {
            // TODO:CN-DONE 真实名字格式错误。
            Toast.fail("รูปแบบไม่ถูกต้อง(นามสกุลจะต้องมีอักษรระหว่าง2-50ตัวอักษร และเป็นภาษาไทยเท่านั้นด");
            return;
        }

        const MemberData = {
            "key": "FirstName",
            "value1": `${firstName} ${lastName}`,
        }

        // TODO:CN-DONE 提交中,请稍候
        Toast.loading('กำลังยืนยัน โปรดรอสักครู่...', 200);
        fetchRequest(ApiPort.Register, 'PATCH', MemberData).then((res) => {
            if(this.props.fromPage == 'DepositPage'){
                UMonEvent('Deposit Nav','Submit','RealName_DepositPage')
            }
            Toast.hide();
            if (res.isSuccess == true) {
                Toast.success('อัปเดตสำเร็จ!');
                if(this.props.fromPage == 'DepositPage'){
                    Actions.pop();
                }else{
                    Actions.depositTx();
                }

            } else if (res.isSuccess == false) {
                Toast.fail(res.result.Message);
            }
        })
            .catch(error => {

            });


    }

    render() {
        const {lastName, firstName} = this.state
        return (
            <View style={styles.rootView}>
                <View style={{paddingLeft: 15, paddingRight: 15, marginTop: 40}}>

                    <View style={styles.DsBorder}>
                        <InputItem styles={StyleSheet.create(newStyle)} placeholderTextColor="#fff"
                                   value={firstName}
                                   labelNumber={5}
                                   onChange={(value) => {
                                       this.setState({
                                           firstName: value,
                                       });
                                   }}
                                   placeholder="ชื่อ"
                        >
                        </InputItem>
                    </View>

                    <View style={styles.DsBorder}>
                        <InputItem styles={StyleSheet.create(newStyle)} placeholderTextColor="#fff"
                                   value={lastName}
                                   labelNumber={5}
                                   onChange={(value) => {
                                       this.setState({
                                           lastName: value,
                                       });
                                   }}
                                   placeholder="นามสกุล"
                        >
                        </InputItem>
                    </View>


                </View>

                <View style={{paddingHorizontal: 15, paddingVertical: 40}}>
                    <View style={styles.DSPayButtonBHoves}>
                        <Touch onPress={this.userName} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                               style={{width: width - 30}}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 16,
                                lineHeight: 38,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                paddingTop: 3
                            }}>ยืนยัน</Text>
                        </Touch>
                    </View>
                </View>
            </View>
        );
    }
}

export default NewName;

const styles = StyleSheet.create({
    rootView: {flex: 1, backgroundColor: "#0a0a0a"},
    inputBoxView: {flex: 1},

    DsBorder: {
        borderWidth: 1,
        borderColor: '#9E9E9E',
        borderRadius: 4,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    DSPayButtonBHoves: {
        backgroundColor: "#00B324",
        borderRadius: 4,
    },

});
