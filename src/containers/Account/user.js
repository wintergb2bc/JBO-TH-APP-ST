import React, { Component } from 'react';
import ReactNative, {
  StyleSheet,
  Text,
  TextStyle,
  View,
  ImageBackground,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
  UIManager,
  Platform,
  TextInput
} from 'react-native';
import {
  Button,
  Carousel,
  WhiteSpace,
  WingBlank,
  InputItem,
  Toast,
  Flex,
  Switch,
  List,
  Radio,
  DatePicker,
  Tabs,
  Picker
} from 'antd-mobile-rn';
import { connect } from 'react-redux'
import Touch from 'react-native-touch-once';
import { Actions } from 'react-native-router-flux';
import { I18n, getLanguages } from '../../language/i18n'
import moment from 'moment'
import InputItemStyle from 'antd-mobile-rn/lib/input-item/style/index.native';
const cityReg = /^([a-zA-Z\u0e00-\u0e7f\s]{1,50})$/;
import { ACTION_PhoneSetting_Update } from '../lib/redux/actions/UserSettingAction'

const TabData = [
  {
    title: 'ข้อมูลพื้นฐาน'  // 基本資訊
  },
  {
    title: `ยืนยันเบอร์/อีเมล` // 驗證郵箱電話
  },
  {
    title: 'ข้อมูลการติดต่อ' // 聯絡資訊
  }
]

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };

    if (key === 'input') {
      newStyle[key].color = '#e2e2e2';
      newStyle[key].fontSize = 14;
    }
    newStyle[key].borderBottomColor = '#646464';
    newStyle[key].height = 60;
  }
}


const newStyle2 = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle2[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === 'input') {
      newStyle2[key].color = '#4ee42b';
    }
    newStyle2[key].borderBottomColor = '#646464';
    newStyle2[key].height = 60;
  }
}


const {
  width, height
} = Dimensions.get('window')

import ListItems from 'antd-mobile-rn/lib/list/style/index.native'
const newStyle9 = {}
for (const key in ListItems) {
  if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
    newStyle9[key] = { ...StyleSheet.flatten(ListItems[key]) }
    if (key == 'Item') {
      newStyle9[key].paddingLeft = 0
      newStyle9[key].paddingRight = 0
      newStyle9[key].height = 60
      newStyle9[key].width = width - 15
      newStyle9[key].overflow = 'hidden'
    }
    newStyle9[key].color = 'transparent'
    newStyle9[key].fontSize = -999
    newStyle9[key].backgroundColor = 'transparent'
    newStyle9[key].borderBottomWidth = 0
    newStyle9[key].flexDirection = 'row'
    newStyle9[key].alignItems = 'center'
  }
}

const newStyle3 = {};
for (const key in PickerList) {
  if (Object.prototype.hasOwnProperty.call(PickerList, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle3[key] = { ...StyleSheet.flatten(PickerList[key]) };
    newStyle3[key].backgroundColor = "transparent";
    newStyle3[key].borderBottomColor = "#707070";
  }
}

const SexData = [
  {
    id: 'Male',
    name: 'ชาย'//'男'
  },
  {
    id: 'Female',
    name: 'หญิง'//'女'
  }
]

const ContactDetailType = [
  {
    name:"จังหวัด：", //"城市/省：",
    id: ""
  },
  {
    name: "ที่อยู่：",//"地址：",
    id: ""
  }
];

const InfoRules1 = [
  {
    text: 'ระดับความปลอดภัยของบัญชีต่ำ โปรดกรอกข้อมูลส่วนตัว'
  },
  {
    text: 'ชื่อนามสกุลที่กรอก จะต้องตรงกับบัญชีธนาคารของคุณ'
  }
]

const InfoRules2 = [
  {
    text: 'เบอร์โทรศัพท์และอีเมลสามารถแก้ไขได้เพียง 1 ครั้ง'
  },
  {
    text: 'หากต้องการเปลี่ยนหมายเลขโทรศัพท์หรืออีเมลโปรดติดต่อ',
    hasCS: true
  }
]

const PickerCustomChildren = props => (
    <TouchableOpacity onPress={props.onClick}>
      <View
          style={styles.ContactDetailsBox}
      >
        <Text style={{  width: 80,color: '#CCC' }}>{props.children}</Text>
        <Text style={{ textAlign: 'left', color: '#999', marginRight: 15 }}>
          {props.extra}
        </Text>
      </View>
    </TouchableOpacity>
);

import { VipIconImg } from './../../containers/Account/Vip/VipData'
import PickerList from "antd-mobile-rn/lib/list/style/index.native";
import {Toasts} from "../Toast";
class user extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      memberInfo: this.props.memberInfo ? this.props.memberInfo : {},
      email: this.props.email,
      phoneNumber: this.props.phoneNumber ? this.props.phoneNumber : '',
      phoneNumberDB: '',
      user: '', //帳戶
      name: this.props.memberInfo ? this.props.memberInfo.FirstName : '', //用戶名
      password: '', //密碼
      repassword: '', // 密碼確認
      number: '', //電話 
      qq: '', //qq 
      wechat: '', //微信
      Scode: '',// 推薦代碼
      phoneStatus: "",
      emailStatus: '',
      AccountType: '',
      EmailType: '',
      PhoneType: '',
      vipBtnPosTop1: 0,
      vipBtnPosLeft1: 0,
      vipBtnPosWidth1: 0,
      vipBtnPosHeight1: 0,
      vipBtnPosLeft2: 0,
      isShowVipModal: false,
      isModalStepFlag: true,
      isShowInputVip: false,
      sexIndex: -1,
      birthdayDate: '',
      IsAllowUpdateDOB: false,
      IsAllowUpdateGender: false,
      isCanClickSex: false,
      lineID: '',
      addressDetails0: "",
      addressDetails1: "",
      countryList: [],
      countryValue: 0,
      inputCheckcity: true,
      inputCheckAddress: true,

      checkBox1: false,
      checkBox2: false,
      checkBox3: false,
      okBtn: false,
      emailCheck: false,
      banks:[],
      submitReminder: false,
      Prefixes: [],
      MaxLength: 11,
      MinLength: 11
    }
    this.mycomponent1 = React.createRef();
    this.mycomponent2 = React.createRef();
  }

  componentWillMount(props) {
    console.log(this.props)
    // this.getUser();
    // this.getCountry();
  }
  
  async componentDidMount() {
    Toast.loading('่',200)
    this.GETMemberBanks();
    this.GetPhonePrefix()
    await this.getUser();
    await this.getCountry();
    Toast.hide();
  }

  componentWillUnmount() {
    if (this.props.fromPage === 'Recommend') {
      if (this.props.refreshPage) {
        this.props.refreshPage()
      }
    }

    if (this.props.fromPage == 'home') {
      if (this.props.getUser) {
        this.props.getUser()
      }
    }
  }

  GetPhonePrefix = () => {
    const reduxPhone = this.props.userSetting.phonePrefix
    console.log(this.props.userSetting)
    if(Object.keys(this.props.userSetting.phonePrefix).length !== 0){
      this.setState({
        Prefixes: reduxPhone.Prefixes,
        MaxLength: reduxPhone.MaxLength,
        MinLength: reduxPhone.MinLength
      })
    }else{
      fetchRequest(ApiPort.PhonePrefix, "GET")
          .then(res => {
            this.props.phone_setting(res)
            this.setState({
              Prefixes: res.Prefixes,
              MaxLength: res.MaxLength,
              MinLength: res.MinLength
            })
          })
    }
  }

  getCountry() {
    fetchRequest(`${ApiPort.GETProfileMasterData}category=Nations&`, "GET").then(res => {
      
      this.state.countryList = res.result.map(function(item, key) {
        return { value: parseInt(item.id), label: item.chineseName };
      });
      
      this.setState({
        countryValue: [this.state.memberInfo.Address.NationId]
      })
    });
  }
  
  getVipModalStorge() {
    global.storage.load({
      key: 'VipModalIsShow',
      id: 'VipModalIsShow'
    }).then(res => {
      let vipList = res.find(v => v.name === window.userNameDB)
      if (vipList) {
        this.setState({
          isShowVipModal: false
        })
      } else {
        this.setState({
          isShowVipModal: true
        }, () => {
          this.getVipBtnPos()
        })
      }
    }).catch(() => {
      this.setState({
        isShowVipModal: true
      }, () => {
        this.getVipBtnPos()
      })
    })
  }
  hideVipModal() {
    this.setState({
      isShowVipModal: false
    }, () => {
      global.storage.load({
        key: 'VipModalIsShow',
        id: 'VipModalIsShow'
      }).then(res => {
        res.push({ name: window.userNameDB })
      }).catch(() => {
        global.storage.save({
          key: 'VipModalIsShow',
          id: 'VipModalIsShow',
          data: [
            {
              name: window.userNameDB
            }
          ],
          expires: 1000 * 3600 * 6
        })
      })
    })
  }

  getVipBtnPos() {
    UIManager.measure(ReactNative.findNodeHandle(this.mycomponent1.current), (x, y, w, h, px, py) => {
      this.setState({
        vipBtnPosTop1: py,
        vipBtnPosLeft1: px,
        vipBtnPosWidth1: w,
        vipBtnPosHeight1: h
      });
    }
    );
    UIManager.measure(ReactNative.findNodeHandle(this.mycomponent2.current), (x, y, w, h, px, py) => {
      this.setState({
        vipBtnPosLeft2: px,
      });
    }
    );
  }

  getUser() {
    console.log('hi')
    return new Promise(resolve => {
      fetchRequest(ApiPort.Member, 'GET')
          .then(data => {

            let memberInfo = data.result.memberInfo
            let sexIndexTemp = SexData.findIndex(v => v.id.toLocaleLowerCase() === (memberInfo.Gender ? memberInfo.Gender.toLocaleLowerCase() : 'MALE'))
            let IsAllowUpdateGender = memberInfo.IsAllowUpdateGender
            let IsAllowUpdateDOB = memberInfo.IsAllowUpdateDOB
            let Contacts = memberInfo.Contacts
            let lineItem = Contacts.filter(v => v.ContactType === 'LINE')

            this.setState({
              memberInfo: data.result.memberInfo,
              IsAllowUpdateDOB,
              IsAllowUpdateGender,
              isCanClickSex: false,
              sexIndex: IsAllowUpdateDOB ? - 1 : (sexIndexTemp >= 0 ? sexIndexTemp : 0),
              birthdayDate: memberInfo.DOB ? memberInfo.DOB : this.state.birthdayDate,
              lineID: lineItem.length ? lineItem[0].Contact : '',
              lineEditable: lineItem.length !== 0 ? false : true,
            },()=>{
              let OfferContacts = this.state.memberInfo.OfferContacts
              if (OfferContacts) {
                this.setState({
                  checkBox1: OfferContacts.IsCall,
                  checkBox2: OfferContacts.IsSMS,
                  checkBox3: OfferContacts.IsEmail,
                }, () => { this.leastTwo() })
              }
            })
            window.AvatarPicture = memberInfo.AvatarPicture
            //this.getVipModalStorge()
            global.storage.save({
              key: 'memberInfo', // 注意:请不要在key中使用_下划线符号!
              id: "memberInfos", // 注意:请不要在id中使用_下划线符号!
              data: data,
              expires: null
            });

            let AccountData = data
            function filterByID(item) {
              if (item.ContactType == 'Phone') {
                return true;
              }
            }

            function filterByEmail(item) {
              if (item.ContactType == "Email") {
                return true;
              }
            }

            var filtered = AccountData ? AccountData.result.memberInfo.Contacts.filter(filterByID) : '';
            var filEmail = AccountData ? AccountData.result.memberInfo.Contacts.filter(filterByEmail) : '';
            let AccountType

            // console.log('xxxxxx',filEmail[0])
            if (filEmail[0]) {


              if (filEmail[0].Status != "Verified" && filtered[0].Status != "Verified") {
                AccountType = 'ต่ำ' //低
              }
              if (filEmail[0].Status != "Verified" && filtered[0].Status == "Verified") {
                AccountType = 'กลาง' //中
              } else if (filtered[0].Status != "Verified" && filEmail[0].Status == "Verified") {
                AccountType = 'กลาง' //中
              }

              if (filEmail[0].Status == "Verified" && filtered[0].Status == "Verified") {
                AccountType = 'สูง' //高
              }

              if (filEmail[0].Status != "Verified") {

                this.setState({
                  EmailType:'ยังไม่มีการยืนยัน' //'未验证'
                })
              } else if (filEmail[0].Status == "Verified") {
                this.setState({
                  EmailType: 'ยืนยันแล้ว' //'已验证'
                })
              }

            } else {
              this.setState({
                EmailType: 'ยังไม่ได้กรอกข้อมูล' //'未填写'
              })
              AccountType = 'ต่ำ' //低
            }



            if (filtered[0].Status != "Verified") {

              this.setState({
                PhoneType: 'ยังไม่มีการยืนยัน' //'未验证'
              })
            } else if (filtered[0].Status == "Verified") {
              this.setState({
                PhoneType:'ยืนยันแล้ว' //'已验证'
              })
              AccountType = 'กลาง' //中
            }

            console.log(filtered[0].Status)
            console.log(this.state.PhoneType)


            let numberPhone = filtered[0].Contact;
            // let h8 = '';
            // if (numberPhone[0] == '66') {
            //   h8 = numberPhone[1];
            // }else{
            //   h8 = numberPhone[0];
            // }

            this.setState({
              email: filEmail[0] ? filEmail[0].Contact : '',
              emailStatus: filEmail[0] ? filEmail[0].Status : '',
              phoneNumber: numberPhone,
              phoneNumberDB: filtered[0].Contact,
              phoneStatus: filtered[0].Status,
              name: data.result.memberInfo.FirstName,
              AccountType: AccountType,
              addressDetails0: data.result.memberInfo.Address.City?data.result.memberInfo.Address.City:"",
              addressDetails1: data.result.memberInfo.Address.Address,
            })

            resolve('ok')
          }).catch(error => {
      })
    });
    
  }

  /**
   * 获取用户添加过的银行卡列表
   */
  async GETMemberBanks(type) {
    let key = 'AccountType=Withdrawal&';key = 'AccountType=Withdrawal&';
    try {
      Toast.loading("โปรดรอสักครู่...", 200);
      const res = await fetchRequest(ApiPort.MemberBanks + key, "GET");
      Toast.hide()
      if (res.length > 0) {
        const banks = this.adjustBanks(res);
        this.setState({ banks });
      } else {
        this.setState({ banks: [] });
      }
    } catch (error) {
      Toast.hide()
      // 获取失败
    } finally {
      Toast.hide()
    }
  }

  /**
   * 调整银行卡列表，默认账户排第一
   * @param {array} banks 银行卡列表
   * @returns {array} result 调整过后的银行卡列表
   */
  adjustBanks(banks) {
    // 只有一张银行卡
    if (banks.length == 1) {
      return banks;
    }
    let result = banks;
    // 对数组每一项的isDefault进行比较 ：Ture > Flase
    result.sort((a, b) => {
      return b.IsDefault - a.IsDefault;
    });
    return result;
  }


  patchSex() {
    const { sexIndex } = this.state
    let gender = {
      "key": "Gender",
      "value1": SexData[sexIndex].id,
    }

    fetchRequest(ApiPort.Member, 'PATCH', gender).then(res => {
      if(!res.isSuccess){
        Toast.fail(res.message)
      }
      this.getUser()
    })
  }
  
  patchDob() {
    const { birthdayDate } = this.state
    
    let dob = {
      "key": "DOB",
      "value1": moment(birthdayDate).format("MM-DD-YYYY")
    }
    
    fetchRequest(ApiPort.Member, 'PATCH', dob).then(res => {
      this.setState({
        IsAllowUpdateDOB: false,
      })
      this.getUser()
    })
  }

  patchSexDob() {
    const { birthdayDate, sexIndex } = this.state
    let dob = {
      "key": "DOB",
      "value1": moment(birthdayDate).format("MM-DD-YYYY")
    }

    fetchRequest(ApiPort.Member, 'PATCH', dob).then(res => {
      this.setState({
        IsAllowUpdateDOB: false,
        IsAllowUpdateGender: false
      })
      let gender = {
        "key": "Gender",
        "value1": SexData[sexIndex].id,
      }
      fetchRequest(ApiPort.Member, 'PATCH', gender).then(res => {
        this.getUser()
      })
    })
  }

  changeRebateDatePicker(value) {
    this.setState({
      birthdayDate: moment(value).format('YYYY/MM/DD')
    })
  }

  userName() {

    const { name, AccountType } = this.state;
    //console.log(depositName)

    if (name == '') {
      Toast.fail('ชื่อจริง')
     // Toast.fail('请填写真实名字。');
      return;
    }

    const nameTest = /^[a-zA-Z0-9'\u4e00-\u9fa5\u0E00-\u0E7F ]{2,50}$/;
    if (nameTest.test(name) != true) { 
      Toast.fail('รูปแบบของชื่อไม่ถูกต้อง (ชื่อต้องประกอบด้วยอักษรจีนอย่างน้อย 2 ตัวและไม่เกิน 20 ตัวอักษร)!');
      // Toast.fail('真实姓名格式错误。（名字必须由至少2位、最多50位长度的字母，可包含汉字!');
      return;
    }

    const MemberData = {
      "key": "FirstName",
      "value1": name,
    }
    Toast.loading('กำลังอัปเดต โปรดรอสักครู่',200)
   // Toast.loading('提交中,请稍候...', 200);

    fetchRequest(ApiPort.Register, 'PATCH', MemberData).then((res) => {
      Toast.hide();



      if (res.isSuccess == true) {

        Toasts.successV2("อัปเดตสำเร็จ!", 2);
        //this.Memberlist();
        this.getUser();
        memberData(); //觸發 帳戶管理刷新
      } else if (res.isSuccess == false) {

        Toast.fail(res.message);

        this.getUser();
        memberData(); //觸發 帳戶管理刷新

      }
    })
      .catch(error => {

      });

  }



  emailPost() {

    const { email, AccountType } = this.state;
    //console.log(depositName)

    const EmailTEST = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (email != '' && EmailTEST.test(email) != true) {
      Toast.fail('请输入正确的邮箱！');
      return;
    }

    const MemberData = {
      "key": "email",
      "value1": email,
    }

    Toast.loading('กำลังอัปเดต โปรดรอสักครู่...', 200);

    fetchRequest(ApiPort.Register, 'PATCH', MemberData).then((res) => {
      Toast.hide();



      if (res.isSuccess == true) {

        Toasts.successV2("อัปเดตสำเร็จ!", 2);
        //this.Memberlist();
        this.getUser();
        memberData(); //觸發 帳戶管理刷新

      } else if (res.isSuccess == false) {

        Toast.fail(res.result.Message);

        this.getUser();
        memberData(); //觸發 帳戶管理刷新

      }
    })
      .catch(error => {

      });

  }


  PhoneNumber() {

    const { userName, phoneNumber } = this.state;
    //console.log(depositName) 

    const {
      Prefixes,
      MaxLength,
      MinLength
    } = this.state;

    console.log(phone)
    console.log(Prefixes)

    let prefixCheck = Prefixes.some(a => phone.startsWith(a))
    let lengthCheck = phone.length <= MaxLength && phone.length >= MinLength

    if (prefixCheck && lengthCheck) {
    } else {
      Toast.fail("เบอร์มือถือจะต้องมีทั้งหมด10หลักค่ะ")
      return
    }


    let numberPhone = phoneNumber.split('-');
    let h8 = '';
    if (numberPhone[0] != '66') {
      h8 = "66-";
    }
    const MemberData = {
      "key": "Contact",
      "value1": h8 + phoneNumber,
    }

    // TODO:CN-DONE 提交中,请稍候
    Toast.loading("กรุณารอขณะส่ง...", 200);


    fetchRequest(ApiPort.Register, 'PATCH', MemberData).then((res) => {
      Toast.hide();



      if (res.isSuccess == true) {

       // TODO:CN-DONE อัปเดตสำเร็จ
       Toast.success("การอัปเดตสำเร็จ!");
        //this.Memberlist();
        this.getUser();
        memberData(); //觸發 帳戶管理刷新
      } else if (res.isSuccess == false) {

        // if (res.message == "MEM00030") {
        //   Toast.fail('邮箱已存在');
        //   return;
        // }

        // if (res.message == "MEM00041") {
        //   Toast.fail('手机号已存在');
        //   return;
        // }

        // if (res.result.Code == "MEM00050") {
        //   Toast.info(res.message);
        //   return;
        // }

        Toast.fail(res.result.Message);
      }



    })
      .catch(error => {

      });

  }

   UpdateMember_1 = () => {
    const {memberInfo, email, name, phoneNumber, lineID} = this.state;
    const nameTest = /^[a-zA-Z\u0E00-\u0E7F ]{2,50}$/;


    const {IsAllowUpdateDOB, IsAllowUpdateGender, sexIndex, birthdayDate} = this.state;
    
    if (memberInfo.FirstName == "") {
      if (name == '') {
        // TODO:CN-DONE 请填写真实名字
        Toast.fail("กรุณากรอกข้อมูลให้ครบถ้วนและไม่มีช่องว่าง");
        return;
      }

      if (nameTest.test(name) != true) {
        // TODO:CN-DONE 请填写真实名字
        Toast.fail("กรุณากรอกข้อมูลให้ครบถ้วนและไม่มีช่องว่าง");
        return;
      }

    }

    if (IsAllowUpdateGender) {
      if (sexIndex <= -1) {
        Toast.fail('โปรดเลือกเพศ', 2)
        //Toast.fail('请选择性别', 2)
        return
      }
      if (!birthdayDate) {
        Toast.fail('โปรดเลือกวันเกิดของคุณ', 2)
        //Toast.fail('请选择生日', 2)
        return
      }
    }

    let MemberData = {
      "language": "th-th",
      "wallet": memberInfo.PreferWallet,
      "blackBoxValue": Iovation,
      "e2BlackBoxValue": E2Backbox
    }

    if(IsAllowUpdateDOB && IsAllowUpdateGender){
      this.patchSexDob()
    } else if(IsAllowUpdateDOB){
      this.patchDob()
    } else if(IsAllowUpdateGender){
      this.patchSex()
    }

    if(this.nameEditable()){
      MemberData.firstName = name;
      this.putMember(MemberData, 1)
    }
  }

  UpdateMember_2 = () => {
    const {
      email, phoneNumber, memberInfo, Prefixes,
      MaxLength,
      MinLength
    } = this.state;
    
    const EmailTEST = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

    function filterByID(item) {
      if (item.ContactType == 'Phone') {
        return true;
      }
    }
    var filtered = memberInfo ? memberInfo.Contacts.filter(filterByID) : '';
    let numberPhone1 = filtered[0].Contact;

    console.log(numberPhone1)
    console.log(phoneNumber)
    
    if(this.phoneEditable() && phoneNumber !== numberPhone1){

      let prefixCheck = Prefixes.some(a => phoneNumber.startsWith(a))
      let lengthCheck = phoneNumber.length <= MaxLength && phoneNumber.length >= MinLength

      console.log(prefixCheck)
      console.log(lengthCheck)
      
      if (prefixCheck && lengthCheck) {
      } else {
        Toast.fail("กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง")
        return
      }
    }

    if(this.emailEditable()){
      if (email == '') {
        Toast.fail("กรุณากรอกอีเมลของคุณ");
        //Toast.fail('请输入邮箱！');
        return;
      }

      if (email != '' && EmailTEST.test(email) != true) {
        Toast.fail("รูปแบบอีเมลไม่ถูกต้อง");
        //Toast.fail('请输入正确的邮箱！');
        return;
      }
    }
    
    let numberPhone = phoneNumber.split('-');
    
    let h8 = '';
    if (numberPhone[0] != '66') {
      h8 = "66-";
    }

    let MemberData = {
      "language": "th-th",
      "wallet": memberInfo.PreferWallet,
      "blackBoxValue": Iovation,
      "e2BlackBoxValue": E2Backbox
    }

    if(this.phoneEditable() && phoneNumber !== numberPhone1){
      MemberData.contact = h8 + phoneNumber;
    }
    if(this.emailEditable() && this.state.EmailType == 'ยังไม่ได้กรอกข้อมูล'){
      MemberData.email = email;
    }
    
    this.putMember(MemberData, 2)
  }

  UpdateMember_3() {
    const {
      lineID, checkBox1, checkBox2, checkBox3, 
      addressDetails0,
      addressDetails1,
      countryValue,
    } = this.state;

    const lineIDTest = /^([A-Za-z0-9._\-]{1,30})$/;

    if(this.state.lineEditable){
      if(lineIDTest.test(lineID) != true){
        Toast.fail("กรุณากรอกLine ID ให้ถูกต้อง : ความยาวไม่เกิน 18 และไม่มีช่องว่าง");
        return;
      }
    }

    let contact = {
      IsCall: checkBox1,
      IsSMS: checkBox2,
      IsEmail: checkBox3,
    }

    let MemberData = {
      "language": "th-th",
      "blackBoxValue": Iovation,
      "e2BlackBoxValue": E2Backbox,
      "key": "OfferContacts",
      "value1": JSON.stringify(contact),
      "addresses": {
        address: addressDetails1,
        city: addressDetails0,
        nationId: countryValue[0]
      }
    }

    if(this.state.lineEditable){
      if(lineID.replace(/\s*/g,"").length !== 0){
        MemberData.MessengerDetails = [{
          "Contact": lineID,
          "ContactTypeId": "9",
        }]
      }
    }

    this.putMember(MemberData, 3)
  }
  
  putMember = (MemberData , tabIdx) => {
    Toast.loading("การแก้ไข...",2000);
    fetchRequest(ApiPort.PUTMemberlistAPI + '?', 'PUT', MemberData)
        .then((res) => {

          Toast.hide();
          if (res.isSuccess == false) {
            if (res.result.Message) {
              Toast.fail(res.result.Message);
            } else {
              Toast.fail('คำขอล้มเหลวโปรดลองอีกครั้ง');
            }
          }
          if (res.isSuccess == true) {
            Toasts.successV2("อัปเดตสำเร็จ!", 2);
            
            if(tabIdx === 1){
              this.setState({
                IsAllowUpdateDOB: false,
                IsAllowUpdateGender: false,
                isCanClickSex: false
              })
            }
            
            if(tabIdx === 2){
              this.setState({
                NoHaveEmail: false,
              })
            }

            this.getUser();
            memberData(); //觸發 帳戶管理刷新

          } else if (res.isSuccess == false) {
            Toast.fail(res.result.Message);
          }
        })
        .catch(error => {

          if (error.message == "MEM00050") {
            // TODO:CN-DONE 没有更改任何栏位
            Toast.fail("ไม่มีการเปลี่ยนแปลงในฟิลด์ใด ๆ");
            return;
          }
          if (error) {
            let errors = JSON.parse(error.content);
            if (errors.error_details) {
              Toast.fail(errors.error_details.Message);
            } else {
              Toast.fail('คำขอล้มเหลวโปรดลองอีกครั้ง');
            }
          } else {
            Toast.fail('คำขอล้มเหลวโปรดลองอีกครั้ง');
          }
        });
  }


  /*手机号码验证*/
  PhoneVerify() {
    let ST = this.state;
    UMonEvent("Verification", "Click", 'Phone_ProfilePage');
    Actions.Phone({ memberInfo: this.state.memberInfo, phoneNumber: this.state.phoneNumberDB, email: this.state.email });

  }

  /*邮箱验证*/
  EmailVerify() {
    let ST = this.state;

    const EmailData = {
      "emailVerificationServiceType": "VerifyandUpdate",
      "memberCode": userNameDB,//ST.memberInfo.MemberCode,
      "email": ST.email,
      "ipAddress": "",
      "domainUrl": '',
    }
    UMonEvent("Withdrawal Nav", "Click", 'Email_ProfilePage');
    Toast.loading('กำลังอัปเดต โปรดรอสักครู่',200)
 //   Toast.loading('发送中,请稍候...', 200);
    fetchRequest(ApiPort.POSTEmailVerifyAPI + '?', 'POST', EmailData)
      .then(data => {
        Toast.hide();

        if (data.isSuccess == true) {
          //Toast.success('已发送，请登入注册邮箱完成验证!', 2);
          Toast.success('ส่งเรียบร้อยแล้ว กรุณาตรวจสอบอีเมลเพื่อการยืนยันที่สมบูรณ์',2)
        } else if (data.isSuccess == false) {
          Toast.fail(data.result.errorMessage, 2);
        }

      }).catch(error => {
        Toast.fail(data.errorMessage, 1);

      })
  }

  UsernameFocus() {
    if (this.state.phoneNumber == '66-15888888888') {
      this.setState({
        phoneNumber: '',
      })
    }
  }

  UsernameBlur() {

  }

  infoTextUI = (ary) => {
    return ary.map((v, idx) =>
        <View key={idx} style={[styles.LabelView, {marginTop: idx !== 0? 13:0}]}>
          <View style={styles.LabelTxt}></View>
          <Text style={{color: '#ccc'}}>
            {v.text} 
            {v.hasCS && v.hasCS && (
                <Text style={{color: '#00E62E'}} onPress={() => Actions.LiveChatST()}> ฝ่ายบริการลูกค้า</Text>
            )}
          </Text>
        </View>
    );
  }

  changeContactDetailInput(i, text) {
    if (i == 1) {
      const addressflag = /^[^;:：；&@#$%&!<>《》\u4e00-\u9fa5]+$/.test(text.trim());
      this.setState({ inputCheckAddress: addressflag });
    } else if (i == 0) {
      let cityflag = cityReg.test(text.trim());
      this.setState({ inputCheckcity: cityflag });
    }

    console.log(this.state)
    this.setState({
      [`addressDetails${i}`]: text.trim()
    });
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

  submitTab1 = () => {
    
    const {IsAllowUpdateDOB,IsAllowUpdateGender} = this.state;

    console.log('nameEditable '+this.nameEditable())
    console.log('IsAllowUpdateDOB '+IsAllowUpdateDOB)
    console.log('IsAllowUpdateGender '+IsAllowUpdateGender)
    
    if(!this.nameEditable() && !IsAllowUpdateDOB && !IsAllowUpdateGender){
      return;
    }
    
    if(this.nameEditable() || IsAllowUpdateDOB || IsAllowUpdateGender){
      return (
          <Touch onPress={()=>this.setState({submitReminder: true})} style={{ marginTop: 30, width: width, padding: 10 }} >
            <View style={{ backgroundColor: '#00b324', borderRadius: 5 }}>
              <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40 }}>บันทึก</Text>
            </View>
          </Touch>
      )
    }

    // <Touch style={{ marginTop: 30, width: width, padding: 10 }} >
    //   <View style={{ backgroundColor: '#404040', borderRadius: 5 }}>
    //     <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40 }}>บันทึก</Text>
    //   </View>
    // </Touch>
  }
  
  submitTab2 = () => {
    if(!this.phoneEditable() && !this.emailEditable()){
      return
    }
    
    return (
        <Touch onPress={()=>this.UpdateMember_2()} style={{ marginTop: 30, width: width, padding: 10 }} >
          <View style={{ backgroundColor: '#00b324', borderRadius: 5 }}>
            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40 }}>บันทึก</Text>
          </View>
        </Touch>
    )
  }
  
  nameEditable = () => this.state.memberInfo.FirstName != "" ? false : true;
  phoneEditable = () => this.state.memberInfo.IsMobileAllowChange;
  emailEditable = () => this.state.EmailType !== '' && this.state.EmailType !== 'ยังไม่ได้กรอกข้อมูล'  ? false : true;

  tab3SubmitDisabled = () => {
    
    const {memberInfo,lineEditable,lineID,countryValue,checkBox1,checkBox2,checkBox3,addressDetails0,addressDetails1} = this.state
    
    if(Object.keys(memberInfo).length === 0) return false;
    
    let obj1 = {
      IsCall: checkBox1,
      IsSMS: checkBox2,
      IsEmail: checkBox3,
    }
    
    let data = {
      Address: memberInfo.Address.Address === addressDetails1,
      NationId: memberInfo.Address.NationId === countryValue[0],
      IsCall: obj1['IsCall'] === this.state.memberInfo.OfferContacts['IsCall'],
      IsEmail: obj1['IsEmail'] === this.state.memberInfo.OfferContacts['IsEmail'],
      IsSMS: obj1['IsSMS'] === this.state.memberInfo.OfferContacts['IsSMS']
    }
    
    if(memberInfo.Address.City){
      let result = memberInfo.Address.City === addressDetails0
      data.City = result
    }else if(addressDetails0 !== ''){
      data.City = false
    }
    console.log(data)
    return Object.values(data).every(v => v === true);
  }
  
  render() {
    window.getAccounrUser = () => {
      this.getUser()
    }
    
    console.log(this.state)
    const { IsAllowUpdateDOB, IsAllowUpdateGender, isCanClickSex, birthdayDate, sexIndex, } = this.state
    const { memberInfo, phoneNumber, email, name, emailStatus, AccountType, EmailType, PhoneType } = this.state;   //註冊訊息 
    const { vipBtnPosTop1, vipBtnPosLeft1, isShowVipModal, vipBtnPosWidth1, vipBtnPosHeight1, isModalStepFlag, vipBtnPosLeft2, isShowInputVip } = this.state
    const {
      countryValue,
      addressDetails0,
      addressDetails1,
      countryList,
      inputCheckAddress,
      inputCheckcity
    } = this.state;
    let btnFlag = addressDetails0 && addressDetails1 && countryValue && inputCheckAddress && inputCheckcity;

    const {
      checkBox1,
      checkBox2,
      checkBox3,
      okBtn,
      emailCheck,
    } = this.state;
    
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={Boolean(isShowVipModal && vipBtnPosLeft1 && vipBtnPosLeft2 && this.props.vipInforData.currentLevelInfo)}
          >
            <View style={styles.vipModalContainer}>
              {
                isModalStepFlag === true && <View>
                  <View style={{ padding: 5, borderWidth: 1, borderRadius: 4, borderStyle: 'dotted', borderColor: '#00E62E', position: 'absolute', left: vipBtnPosLeft2 - 6, top: vipBtnPosTop1 - 6, width: width * .48, height: 42, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: '#2e2e2e', borderRadius: 3, height: 30, width: (width * .48 - 12), alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', padding: 3 }}>VIP 等级：  普通会员</Text>
                    </View>
                  </View>
                  <View style={{ position: 'absolute', top: vipBtnPosTop1 + 60, left: vipBtnPosLeft2 - 6 }}>
                    <Image resizeMode="stretch" source={require('./../../images/user/vip/dottedarrow.png')} style={{ width: 80, height: 95 }}></Image>
                    <Text style={{ color: '#00E62E', fontSize: 16, marginTop: 8, marginBottom: 15 }}>VIP等级看这里</Text>
                    <TouchableOpacity onPress={() => { this.setState({ isModalStepFlag: false }) }} style={{ borderWidth: 1, borderColor: '#00E62E', borderRadius: 4, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10, alignItems: 'center' }}>
                      <Text style={{ color: '#00E62E', fontSize: 14 }}>下一步</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              {
                isModalStepFlag === false && <View>
                  <View style={{ padding: 5, borderWidth: 1, borderRadius: 4, borderStyle: 'dotted', borderColor: '#00E62E', position: 'absolute', left: vipBtnPosLeft1 - 6, top: vipBtnPosTop1 - 6, width: vipBtnPosWidth1 + 12, height: vipBtnPosHeight1 + 12 }}>
                    <View style={{ backgroundColor: '#00b324', borderRadius: 3, paddingLeft: 5, paddingRight: 5 }}>
                      {/* <Text style={{ color: '#fff', padding: 3 }}>查看VIP详情</Text> */}
                      <Text style={{ color: '#fff', padding: 3 }}>ตรวจสอบข้อมูล VIP</Text>
                    </View>
                  </View>
                  <View style={{ position: 'absolute', top: vipBtnPosTop1 + 45, alignItems: 'flex-end', right: width - (vipBtnPosLeft1 + vipBtnPosWidth1 + 6) }}>
                    <Image resizeMode="stretch" source={require('./../../images/user/vip/dottedarrow.png')} style={{ width: 80, height: 95 }}></Image>
                    <Text style={{ color: '#00E62E', fontSize: 16, marginTop: 8, marginBottom: 15 }}>点击该按钮，可以查看VIP详情</Text>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#00E62E', borderRadius: 4, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }} onPress={this.hideVipModal.bind(this)}>
                      <Text style={{ color: '#00E62E', fontSize: 14 }}>รับทราบ</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              }
            </View>
          </Modal>

        <Modal
            animationType='none'
            transparent={true}
            visible={this.state.submitReminder}
            onRequestClose={() => { }}
        >
          <View style={{ justifyContent: 'center', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor:'#000000',width:width-50,alignSelf:'center',borderColor:'#00B324',borderWidth:1,padding:20}}>
              <Text style={{color:'#fff',fontSize:18,textAlign:'right'}} onPress={()=>{
                this.setState({submitReminder:false})
              }}>X</Text>
              <Image
                  source={require("../../images/icon_warning.png")}
                  resizeMode="stretch"
                  style={{ width: 60, height:60,alignSelf:'center',marginBottom:20}}
              />
              <View>
                <Text style={{color:'#fff',textAlign:'center',lineHeight:19}}>เพื่อความปลอดภัยในบัญชีของคุณ โปรดยืนยันข้อมูลให้ครบถ้วนก่อนการถอน</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop:32}}>

                  <TouchableOpacity style={{flex:1, marginRight: 10, borderColor: '#00B324', backgroundColor:'#000000', borderWidth: 1, color:'#00B324', width:100,padding:10,borderRadius:4,alignSelf:'center'}}
                                    onPress={()=> this.setState({submitReminder: false})}
                  >
                    <Text style={{color:'#fff',textAlign:'center'}}>ยกเลิก</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{flex:1, marginLeftL:10,borderColor: '#00B324',backgroundColor:'#00B324', borderWidth: 1,width:100,padding:10,borderRadius:4,alignSelf:'center'}}
                                    onPress={() => {
                                      this.setState({
                                        submitReminder:false
                                      },()=>{
                                        this.UpdateMember_1()
                                      })
                                    }}
                  >
                    <Text style={{color:'#fff',textAlign:'center'}}>บันทึก</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
        </Modal>

          <Tabs
              tabs={TabData}
              tabBarBackgroundColor='#0A0A0A'
              tabBarInactiveTextColor='#CCCCCC'
              tabBarActiveTextColor='#1AFF00'
              tabBarTextStyle={{textAlign: 'center', fontSize: 14}}
              tabBarUnderlineStyle={{
                backgroundColor: '#00E62E'
              }}
              swipeable={Platform.OS === 'ios'}
              initialPage={0}
              onChange={(tab, index) => {
                console.log('hello')
                if (index === 0) {
                  // UMonEvent('VIP Page', 'Click', 'VIPInfo_VIPPage');
                } else if (index === 1) {
                  // UMonEvent('VIP Page', 'Click', 'PromoTnC_VIPPage');
                }
              }}
          >
            
            {/*基本資訊*/}
            <ScrollView style={{ flex: 1 }}>
              
              <View style={{marginBottom: 25}}>
                {/*用戶ID*/}
                <InputItem
                    value={memberInfo.MemberCode}
                    editable={false}
                    labelNumber={4}
                    placeholder='ชื่อบัญชี'
                    //placeholder="账户名称"
                    styles={StyleSheet.create(newStyle)}
                >
                  <Text style={{ color: '#ccc' }}>ชื่อบัญชี：</Text>
                </InputItem>

                {/*真實姓名*/}
                <InputItem
                    value={name}
                    editable={memberInfo.FirstName != "" ? false : true}
                    labelNumber={4}
                    placeholder='กรุณากรอกชื่อ-นามสกุล'
                    placeholderTextColor="#969696"
                    // placeholder="请填写真实名字"
                    styles={StyleSheet.create(newStyle)}
                    onChange={(name: any) => {
                      this.setState({
                        name,
                      });
                    }}
                >
                  <Text style={{ color: '#ccc' }}>ชื่อจริง：</Text>
                </InputItem>

                {/*提款帳號*/}
                <View style={[styles.wdBox]}>
                  <View style={{flexDirection: 'row',width: '50%'}}>
                    <Text style={[styles.sexBox1Text, {alignSelf: "center"} ]}>บัญชีการถอน：</Text>
                    {this.state.banks[0]? <Text style={{color: '#18DB02',textDecorationLine: 'underline', fontSize: 14}} onPress={() => Actions.bankCenter({ BankType: 'W' })}>คลิกเพื่อดูบัญชีถอนของคุณ</Text>: <Text style={{color: '#fff', fontSize: 12, lineHeight: 20}}>คุณยังไม่ได้เพิ่มบัญชี{"\n"}ในการถอน</Text>}
                  </View>
                  {!this.state.banks[0] && (
                      <TouchableOpacity style={{backgroundColor: '#00B324', borderRadius: 4, width: '25%', height: '60%', justifyContent: 'center'}} onPress={() => {
                        Actions.bankCenter({ BankType: 'W' });
                      }}>
                        <Text style={{ color: '#fff', textAlign: 'center' }}>เพิ่ม</Text>
                        {/* <Text style={{ color: '#00E62E' }}>编辑</Text> */}
                      </TouchableOpacity>
                  )}
                </View>
                
                {/*性別*/}
                <View style={styles.sexBox}>
                  <Text style={styles.sexBox1Text}>เพศ：</Text>
                  {/* <Text style={styles.sexBox1Text}>性别：        </Text> */}
                  <View style={styles.sexBox1}>
                    {
                      SexData.map((v, i) => {
                        return <TouchableOpacity key={i} style={styles.sexBoxqq} onPress={() => {
                          if (!IsAllowUpdateGender) return
                          this.setState({
                            sexIndex: i * 1
                          })
                        }}>
                          <View style={styles.sexCircleBox}>
                            {
                              sexIndex === i && <View style={styles.sexCircleBox1}></View>
                            }
                          </View>
                          <Text style={styles.sexBox1Text}>{v.name}</Text>
                        </TouchableOpacity>
                      })
                    }
                  </View>
                </View>

                {/*出生日期*/}
                <View style={styles.sexBox}>
                  <DatePicker
                      title='เลือกวันที่'
                      value={new Date(moment(new Date()).subtract(18, 'year').format('YYYY/MM/DD'))}
                      minDate={new Date(1930, 1, 1)}
                      maxDate={new Date(moment(new Date()).subtract(18, 'year'))}
                      mode='date'
                      disabled={!IsAllowUpdateDOB}
                      onChange={this.changeRebateDatePicker.bind(this)}
                      format='YYYY-MM-DD'
                      locale={{
                        DatePickerLocale: {
                          year: "",
                          month: "",
                          day: "",
                          hour: "",
                          minute: ""
                        },
                        okText: "ตกลง",
                        dismissText: "ยกเลิก"
                      }}
                  >
                    <List.Item styles={StyleSheet.create(newStyle9)}>
                      <View style={{ width: width - 15, flexDirection: 'row', alignItems: 'center', height: 60 }}>
                        <Text style={styles.sexBox1Text}>วันเดือนปีเกิด：</Text>
                        {/* <Text style={styles.sexBox1Text}>生日日期：</Text> */}
                        <Text style={styles.sexBox1Text}>{birthdayDate ? birthdayDate : moment(new Date()).subtract(18, 'year').format('YYYY/MM/DD')}</Text>
                      </View>

                    </List.Item>
                  </DatePicker>
                </View>
              </View>
              
              {this.infoTextUI(InfoRules1)}
              
              {/*提交表單*/}
              {this.submitTab1()}
              
            </ScrollView>
            
            {/*驗證郵箱手機*/}
            <ScrollView style={{ flex: 1 }}>
              <View style={{marginBottom: 25}}>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: width }}>
                  <InputItem
                      value={phoneNumber}
                      editable={this.phoneEditable()}
                      onChange={(phoneNumber: any) => {
                        this.setState({
                          phoneNumber,
                        });
                      }}
                      labelNumber={4}
                      placeholder='เบอร์โทรศัพท์'
                      placeholderTextColor="#969696"
                      // placeholder="手机号"
                      onFocus={() => this.UsernameFocus()}
                      styles={StyleSheet.create(newStyle)}
                      style={{ width: width - 10 }}
                  >
                    <Text style={{ color: '#ccc' }}>เบอร์โทรศัพท์: </Text>
                  </InputItem>
                  <View style={{ position: 'absolute', right: 15 }}>
                    {
                      PhoneType == 'ยังไม่มีการยืนยัน' ?//'未验证'
                          <View style={{ backgroundColor: '#00b324', borderRadius: 3 }}>
                            <TouchableOpacity onPress={() => this.PhoneVerify()}>
                              <Text style={{ color: '#fff', padding: 3 }}>{PhoneType}</Text>
                            </TouchableOpacity>
                          </View>
                          : PhoneType == 'ยืนยันแล้ว' && //'已验证' &&
                          <View style={{ backgroundColor: 'transparent', borderRadius: 3 }}><Text style={{ color: '#a8a8a8', padding: 3 }}>{PhoneType}</Text></View>
                    }
                  </View>
                </View>

                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: width}}>
                  <InputItem
                      editable={this.emailEditable()}//'未填写'
                      value={email ? (email.length > 22 && EmailType !== 'ยังไม่ได้กรอกข้อมูล' ? email.substr(0, 22) + "..." : email) : ""}
                      onChange={(email: any) => {
                        this.setState({
                          email,
                        });
                      }}
                      labelNumber={4}
                      placeholder='กรุณากรอกอีเมล'
                      placeholderTextColor="#969696"
                      //placeholder="请填写邮箱地址"
                      styles={StyleSheet.create(newStyle)}
                      style={{ width: width - 10 }}
                  >
                    <Text style={{ color: '#ccc' }}>อีเมล: </Text>
                    {/* 邮箱地址 */}

                  </InputItem>
                  
                  <View style={{ position: 'absolute', right: 15 }}>
                    {
                      EmailType == 'ยังไม่มีการยืนยัน' ? //'未验证' ?
                          <View style={{ backgroundColor: '#00b324', borderRadius: 3 }}>
                            <TouchableOpacity onPress={() => this.EmailVerify()}>
                              <Text style={{ color: '#fff', padding: 3 }}>{EmailType}</Text>
                            </TouchableOpacity>
                          </View>
                          : EmailType == 'ยืนยันแล้ว' && //'已验证' &&
                              <View style={{ backgroundColor: 'transparent', borderRadius: 3 }}><Text style={{ color: '#a8a8a8', padding: 3 }}>{EmailType}</Text></View>
                    }
                  </View>
                </View>
              </View>

              {this.infoTextUI(InfoRules2)}

              {/*提交表單*/}
              {this.submitTab2()}
              
            </ScrollView>
            
            {/*聯絡資訊*/}
            <ScrollView style={{ flex: 1 }}>
              <View style={{marginBottom: 25}}>
                <Text style={{color:'#CCCCCC', marginHorizontal: 15, marginTop: 20}}>กรอกหมายเลขไอดี</Text>

                {/*line id*/}
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: width }}>
                  <InputItem
                      editable={this.state.lineEditable}
                      value={this.state.lineID}
                      onChange={(lineID: any) => {
                        this.setState({
                          lineID,
                        });
                      }}
                      // labelNumber={4}
                      placeholder='กรุณากรอก Line ID'
                      placeholderTextColor="#969696"
                      styles={StyleSheet.create(newStyle)}
                      style={{ width: width - 10 }}
                  >
                    <Text style={{ color: '#ccc' }}>Line: </Text>
                  </InputItem>
                </View>

                {/*收件地址*/}
                <Text style={{color:'#CCCCCC', marginHorizontal: 15, marginTop: 20}}>ที่อยู่ผู้รับ</Text>

                <Picker
                    cols={1}
                    data={this.state.countryList}
                    value={this.state.countryValue}
                    // itemStyle={{color: 'blue'}}
                    onChange={value => {
                      const data = [];
                      data.push(parseInt(value[0]));
                      this.setState({ countryValue: data });
                    }}
                    extra="กรอกจังหวัด"
                    locale={{
                      okText: "ตกลง",
                      dismissText: "ยกเลิก"
                    }}
                >
                  <PickerCustomChildren>ประเทศ：</PickerCustomChildren>
                </Picker>

                {/*<View style={styles.ContactDetailsBox}></View>*/}
                
                {ContactDetailType.map((v, i) => {
                  return (
                      <View key={i} style={styles.ContactDetailsBox}>
                        <Text style={styles.ContactDetailsBoxText}>{v.name}</Text>
                        <View
                            style={
                              (styles.ContactDetailsBoxInput, { width: width - 120 })
                            }
                        >
                          <TextInput
                              style={{
                                color: "#999999",
                                width: width-120,
                                textAlign: "left",
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center"
                              }}
                              placeholder={i===0?'เลือกจังหวัด':'กรอกที่อยู่'}
                              placeholderTextColor="#969696"
                              value={this.state[`addressDetails${i}`]}
                              onChangeText={this.changeContactDetailInput.bind(this, i)}
                          />
                        </View>
                      </View>
                  );
                })}

                <Text style={{color:'#CCCCCC', marginHorizontal: 15, marginTop: 15, marginBottom: 17}}>ข้อมูลติดต่อ</Text>

                <View style={{ position: 'relative' }}>
                  <View style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row',paddingHorizontal: 30, paddingBottom: 30 }}>
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
                  <Text style={{ color: '#999999', marginVertical: 20, paddingHorizontal: 15, textAlign: 'center' }}>คุณสามารถเลือก 2 ช่องทางขึ้นไป เพื่อให้เราสามารถติดต่อคุณ สำหรับการแจกของรางวัล การจัดส่งของขวัญ และกิจกรรมใหม่!</Text>

                </View>

              </View>

              
              {/*提交表單*/}
              {this.tab3SubmitDisabled()? (
                  <Touch style={{ marginTop: 30, width: width, padding: 10 }} >
                    <View style={{ backgroundColor: '#404040', borderRadius: 5 }}>
                      <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40 }}>บันทึก</Text>
                    </View>
                  </Touch>
              ):(
                  <Touch onPress={()=>this.UpdateMember_3()} style={{ marginTop: 30, width: width, padding: 10 }} >
                    <View style={{ backgroundColor: '#00b324', borderRadius: 5 }}>
                      <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 40 }}>บันทึก</Text>
                    </View>
                  </Touch>
                )}
            </ScrollView>
          
          </Tabs>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userSetting: state.userSetting,
  vipInforData: state.vipInforData
});
const mapDispatchToProps = (dispatch) => ({
  phone_setting: phonePrefix => ACTION_PhoneSetting_Update(phonePrefix),
});
export default connect(mapStateToProps, mapDispatchToProps)(user);

const styles = StyleSheet.create({
  bianjiIMgBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    position: 'absolute',
    right: 15,
    zIndex: 1000
  },
  bianjiIMgBox1: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    height: 60,
    right: 15,
  },
  bianjiIMg: {
    width: 22,
    height: 22,
    marginRight: 6
  },
  wdBox: {
    flexDirection: 'row',
    borderBottomWidth: .4,
    borderBottomColor: '#646464',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 15
  },
  sexBox: {
    flexDirection: 'row',
    borderBottomWidth: .4,
    borderBottomColor: '#646464',
    height: 60,
    alignItems: 'center',
    width: width - 15,
    marginLeft: 15
  },
  sexBox1: {
    flexDirection: 'row'
  },
  sexBox1Text: {
    color: '#ccc'
  },
  sexBoxqq: {
    flexDirection: 'row',
    paddingRight: 40,
    marginRight: 10,
    height: 60,
    alignItems: 'center',
  },
  sexCircleBox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderRadius: 1000,
    borderColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  sexCircleBox1: {
    width: 8,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 1000
  },
  visible: {
    backgroundColor: "#000",
  },
  vipModalContainer: {
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, .8)'
  },
  input: {
    width: width,
    color: '#fff',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#9e9e9e'

  },
  gameBg1: {
    paddingLeft: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  gameBg2: {
    paddingTop: 10,
    height: 1,
    width: width,
    borderBottomWidth: 1,
    borderColor: '#454545'
  },
  loginButton: {
    fontWeight: 'bold',
    borderRadius: 10,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center"
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
    width: width / 2,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25
  },
  LabelView: {
    width: width,
    paddingLeft: 15,
    paddingRight:35,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  LabelTxt: {
    width: 3,
    height: 3,
    borderRadius: 10,
    backgroundColor: '#00b324',
    marginRight: 15,
  },
  viewContainer: {
    backgroundColor: "#000",
    flex: 1
  },
  ContactDetailsBox: {
    flexDirection: "row",
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: "#3D3D3D",
    alignItems: "center",
    marginLeft: 15,
    width: width - 15,
    marginBottom: 10
  },
  ContactDetailsBoxInput: {
    color: "#999999",
    height: 44,
    width: width - 80
  },
  ContactDetailsBoxText: {
    color: "#CCCCCC",
    width: 80
  },
  ContactDetailsBoxBtn: {
    width: width - 15,
    marginHorizontal: 15,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: 40,
    backgroundColor: "#757575"
  },
  ContactDetailsBoxBtnText: {
    color: "#CCCCCC",
    fontWeight: "bold"
  }
});

