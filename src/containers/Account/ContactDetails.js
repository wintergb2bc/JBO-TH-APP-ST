import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, TouchableOpacity, TextInput, Modal, RefreshControl, ImageBackground, Platform } from 'react-native'
import { Toast, Tabs, Progress } from 'antd-mobile-rn'

const { width } = Dimensions.get('window')
const ContactDetailType = [
    {
        name: 'Line',
        id: ''
    }
]

const QQRegex = /^$|^[0-9]{4,15}$/;
const WCRegex = /^[a-zA-Z0-9@._-]*$/;

export default class ContactDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            contactDetails0: '',
            contactDetails1: '',
            ishave0: false,
            ishave1: false
        }
    }

    componentDidMount() {
        let memberInfo = this.props.memberInfo
        let Contacts = memberInfo.Contacts
        if (Contacts.length <= 0) return
        let isHaveQQ = Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'QQ')
        let isHaveWeChat = Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'WECHAT')
        this.setState({
            contactDetails0: isHaveQQ ? isHaveQQ.Contact : '',
            contactDetails1: isHaveWeChat ? isHaveWeChat.Contact : '',
            ishave0: Boolean(isHaveQQ),
            ishave1: Boolean(isHaveWeChat)
        })
    }

    changeInput(i, text) {
        this.setState({
            [`contactDetails${i}`]: text.trim()
        })
    }

    submitMember() {
        const { contactDetails0, contactDetails1 } = this.state
        const lineIDTest = /^([A-Za-z0-9._\-]{1,30})$/;
        
        if(lineIDTest.test(contactDetails0) != true){
            Toast.fail("กรุณากรอกLine ID ให้ถูกต้อง : ความยาวไม่เกิน 18 และไม่มีช่องว่าง");
            return;
        }
        let messengerDetails = [{
            "Contact": contactDetails0,
            "ContactTypeId": "9",
        }]
        
        const params = {
            "addresses": {
                "nationId": 1
            },
            "nationality": 1,
            "language": "th-th",
            "messengerDetails": messengerDetails,
            "wallet": 'MAIN'
        }
        Toast.loading('โปรดรอสักครู่...', 2000)
        fetchRequest(ApiPort.PUTMemberlistAPI + '?', 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success(res.result.Message, 2)
                window.isHaveVipQQWeChat = false
                this.props.getUser()
                messengerDetails.forEach((v, i) => {
                    this.setState({
                        [`ishave${i}`]: true
                    })
                })
            } else {
                Toast.fail('คำขอล้มเหลวโปรดลองอีกครั้ง！', 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    render() {
        const { contactDetails0, contactDetails1 } = this.state
        let btnFlag = contactDetails0.length > 0 || contactDetails1.length > 0
        return <View style={styles.viewContainer}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    ContactDetailType.map((v, i) => {
                        return <View key={i} style={styles.ContactDetailsBox}>
                            <Text style={styles.ContactDetailsBoxText}>{v.name}：</Text>
                            <TextInput
                                //editable={!this.state[`ishave${i}`]}
                                style={styles.ContactDetailsBoxInput}
                                placeholder={`กรุณากรอกหมายเลขโทรศัพท์ของคุณ ${v.name}`}
                                placeholderTextColor={'#999999'}
                                value={this.state[`contactDetails${i}`]}
                                keyboardType={i ? 'default' : 'numeric'}
                                onChangeText={this.changeInput.bind(this, i)}
                            />
                        </View>
                    })
                }
                <TouchableOpacity style={[styles.ContactDetailsBoxBtn, { backgroundColor: btnFlag ? '#00B324' : '#757575' }]} onPress={() => {
                    btnFlag && this.submitMember()
                }}>
                    <Text style={[styles.ContactDetailsBoxBtnText, { color: btnFlag ? '#fff' : '#CCCCCC' }]}>บันทึก</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#000',
        flex: 1,
        paddingTop: 20
    },
    ContactDetailsBox: {
        flexDirection: 'row',
        height: 44,
        borderBottomWidth: 1,
        borderBottomColor: '#3D3D3D',
        alignItems: 'center',
        marginLeft: 15,
        width: width - 15,
        marginBottom: 10,

    },
    ContactDetailsBoxInput: {
        color: '#999999',
        height: 44,
        width: width - 80
    },
    ContactDetailsBoxText: {
        color: '#CCCCCC',
        width: 50
    },
    ContactDetailsBoxBtn: {
        width: width - 15,
        marginHorizontal: 15,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginTop: 40,
        backgroundColor: '#757575'
    },
    ContactDetailsBoxBtnText: {
        color: '#CCCCCC',
        //fontWeight: 'bold'
    }
}) 
