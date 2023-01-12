import React, { Component } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Carousel, WhiteSpace, WingBlank, InputItem, Toast, Flex, Switch, List, Radio } from 'antd-mobile-rn';
import ModalDropdown from 'react-native-modal-dropdown';
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';

const RadioItem = Radio.RadioItem;

const {
    width,
    height
} = Dimensions.get('window')



class userContact extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            checkBox1: false,
            checkBox2: false,
            checkBox3: false,
            okBtn: false,
            emailCheck: false,
            memberInfo: this.props.memberInfo || ''
        }

    }
    componentWillMount(props) {
        let OfferContacts = this.state.memberInfo.OfferContacts
        if (OfferContacts) {
            this.setState({
                checkBox1: OfferContacts.IsCall,
                checkBox2: OfferContacts.IsSMS,
                checkBox3: OfferContacts.IsEmail,
            }, () => { this.leastTwo() })
        }
    }

    check1() {
        this.setState({ checkBox1: !this.state.checkBox1 }, () => {
            this.leastTwo()
        })
    }

    check2() {
        this.setState({ checkBox2: !this.state.checkBox2 }, () => {
            this.leastTwo()
        })
    }

    check3() {
        this.setState({ checkBox3: !this.state.checkBox3 }, () => {
            this.leastTwo()
            if (!this.state.checkBox3) {
                this.setState({ emailCheck: true })
            }
        })
    }

    //最少两个
    leastTwo() {
        const st = this.state;
        const arrlist = [st.checkBox1, st.checkBox2, st.checkBox3];
        let checkBoxNum = 0;
        arrlist.forEach((item) => {
            if (item) {
                checkBoxNum += 1;
            }
        })
        this.setState({ okBtn: checkBoxNum > 1 ? true : false })
    }

    okBtn() {
        const st = this.state;
        if (!st.okBtn) { return }
        let contact = {
            IsCall: st.checkBox1,
            IsSMS: st.checkBox2,
            IsEmail: st.checkBox3,
        }
        let MemberData = {
            "key": "OfferContacts",
            "value1": JSON.stringify(contact),
        }
        Toast.loading('กำลังยืนยัน โปรดรอสักครู่', 200);
        fetchRequest(ApiPort.PUTMemberlistAPI + '?', 'PATCH', MemberData)
            .then((res) => {
                Toast.hide();
                if (res.isSuccess == true) {
                    window.getAccounrUser && window.getAccounrUser()
                    //成功
                    Toast.success('อัปเดตสำเร็จ', 2, () => {
                        Actions.pop()
                    });
                } else {
                    Toast.fail(res.message, 2);
                }
            })
            .catch(error => {
                Toast.fail('fail try agn', 2);
            });
    }

    render() {

        const {
            checkBox1,
            checkBox2,
            checkBox3,
            okBtn,
            emailCheck,

        } = this.state;

        return (

            <View style={{ flex: 1, backgroundColor: '#0A0A0A' }} >
                <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 30 }}>
                    <TouchableOpacity onPress={() => { this.check1() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                        <Image
                            resizeMode="stretch"
                            source={checkBox1 ? require("../../images/icon-check-g.png") : require("../../images/icon-check.png")}
                            style={{ width: 25, height: 25 }}
                        />
                         <Text style={{ color: '#F5F5F5', paddingLeft: 10 }}>เบอร์โทรศัพท์</Text>
                        {/* <Text style={{ color: '#F5F5F5', paddingLeft: 10 }}>电话</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.check2() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                        <Image
                            resizeMode="stretch"
                            source={checkBox2 ? require("../../images/icon-check-g.png") : require("../../images/icon-check.png")}
                            style={{ width: 25, height: 25 }}
                        />
                        <Text style={{ color: '#F5F5F5', paddingLeft: 10 }}>SMS</Text>
                        {/* <Text style={{ color: '#F5F5F5', paddingLeft: 10 }}>短信</Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.check3() }} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                        <Image
                            resizeMode="stretch"
                            source={checkBox3 ? require("../../images/icon-check-g.png") : require("../../images/icon-check.png")}
                            style={{ width: 25, height: 25 }}
                        />
                        <Text style={{ color: '#F5F5F5', paddingLeft: 10 }}>อีเมล</Text>
                        {/* <Text style={{ color: '#F5F5F5', paddingLeft: 10 }}>邮件</Text> */}
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 15 }}>
                                                                {/* 请选择至少两个联系方式。 */}
                    <Text style={{ color: '#CC2900', fontSize: 13 }}>{!okBtn && 'โปรดเลือกวิธีการติดต่ออย่างน้อยสองวิธ'}</Text>
                    <Text style={{ color: '#999999', paddingTop: 15 }}>คุณสามารถเลือกรสองช่องทางขึ้นไป เพื่อให้เราสามารถติดต่อคุณ สำหรับการแจกของรางวัล การจัดส่งของขวัญ และกิจกรรมใหม่!</Text>
                    {/* <Text style={{ color: '#999999', paddingTop: 15 }}>您可以选择两种或以上方式，以便奖励派发、 礼品寄送、新的活动时，我们及时联系到您！</Text> */}
                    <Touch onPress={() => { this.okBtn() }} style={{ backgroundColor: okBtn ? '#00B324' : '#666666', borderRadius: 10, marginTop: 20 }}>
                        <Text style={{ color: '#fff', lineHeight: 45, textAlign: 'center' }}>ส่ง</Text>
                    </Touch>
                </View>
                {
                    emailCheck &&
                    <Touch onPress={() => { this.setState({ emailCheck: false }) }} style={{ position: 'absolute', top: 0, left: 0, width: width, height: height, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 9 }}>
                        <View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row', padding: 30, }}>
                            <View style={{ borderRadius: 3, backgroundColor: '#333333', padding: 3, alignItems: 'center', flexDirection: 'row' }}>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/icon-check-g.png")}
                                    style={{ width: 25, height: 25 }}
                                />
                                <Text style={{ color: '#fff', paddingLeft: 10 }}>อีเมล</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#333333', marginLeft: 15, width: width - 30, borderRadius: 5, padding: 10 }}>
                            <Text style={{ color: '#D8D8D8', lineHeight: 25, fontSize: 13 }}>ในกรณีที่คุณยกเลิกการรับอีเมล คุณจะไม่ได้รับข่าวล่าสุดหรือโปรโมชั่นพิเศษต่างๆ ถ้ายืนยันกรุณากดที่ปุ่ม "ตกลง</Text>
                        </View>
                    </Touch>
                }
            </View>

        );
    }
}

export default userContact;


const styles = StyleSheet.create({

});

