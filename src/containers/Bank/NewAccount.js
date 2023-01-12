import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image, TouchableHighlight,Modal,Platform
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";
import * as Animatable from 'react-native-animatable' 

import { Flex, Toast, InputItem } from "antd-mobile-rn";
import ModalDropdown from "react-native-modal-dropdown";

import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";
import { bankIcons } from "./bankIcons";

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      newStyle[key].color = "#9a9a9a";
	  newStyle[key].textAlign = "left";
    }
	newStyle[key].borderBottomColor = '#3d3d3d';
  }
}
const { width, height } = Dimensions.get("window");
const dropdownWitdh = (width - 28) * 0.75;
const dropdownHeight = height * 0.5;
const BaseWidth0 = width - 32
const banks = [
  {
    BankCode: "TTB",
  Charges: 0,
  CurrencyCode: "THB",
  EnglishName: "TMBThanachart Bank",
  Id: 9084,
  IsUnderMaintenance: false,
  Name: "ธนาคารทหารไทยธนชาต",

  },
  {
    BankCode: "TTB",
  Charges: 0,
  CurrencyCode: "THB",
  EnglishName: "TMBThanachart Bank",
  Id: 9084,
  IsUnderMaintenance: false,
  Name: "ธนาคารทหารไทยธนชาต",

  },
  {
    BankCode: "TTB",
  Charges: 0,
  CurrencyCode: "THB",
  EnglishName: "TMBThanachart Bank",
  Id: 9084,
  IsUnderMaintenance: false,
  Name: "ธนาคารทหารไทยธนชาต",

  },
  {
    BankCode: "TTB",
  Charges: 0,
  CurrencyCode: "THB",
  EnglishName: "TMBThanachart Bank",
  Id: 9084,
  IsUnderMaintenance: false,
  Name: "ธนาคารทหารไทยธนชาต",

  },
  {
    BankCode: "TTB",
  Charges: 0,
  CurrencyCode: "THB",
  EnglishName: "TMBThanachart Bank",
  Id: 9084,
  IsUnderMaintenance: false,
  Name: "ธนาคารทหารไทยธนชาต",

  },
  {
    BankCode: "TTB",
  Charges: 0,
  CurrencyCode: "THB",
  EnglishName: "TMBThanachart Bank",
  Id: 9084,
  IsUnderMaintenance: false,
  Name: "ธนาคารทหารไทยธนชาต",

  },
]
/**
 *添加银行卡页面
 * @class NewAccount
 * @extends {React.Component}
 */
export default class NewAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fastTextShow: false,
      BankDataT: "", //..可绑定的银行列表
      bankName: "",
      BankData: "", //單一銀行規則
      accountHolderName: "", //持卡人姓名
      accountNumber: "", //卡号
      branch: "", //分行
      city: "", //城市
      province: "",//省份
      canAdd:false,
      nameMsg: "",
      nameMsgST: false,
      numberMsg: "",
      numberMsgST: false,


      isMenuShow:false,
      showSave:false,
    };
    this.getAllBanks = this.getAllBanks.bind(this);
    this.resetState = this.resetState.bind(this);
    this.selectBank = this.selectBank.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.addBankCard = this.addBankCard.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    console.log("NewAccount this.props",this.props)
    this.getAllBanks();
  }
  // 重置状态
  resetState() {
      const BankDataT = this.state.BankDataT;
      setTimeout(() => {
          this.setState({BankDataT})
      }, 200);
    this.setState({
      BankDataT:'',
      bankName: "",
      BankData: "",
      accountHolderName: "",
      accountNumber: "",
      branch: "",
      city: "",
      province: "",
      canAdd:false,
    });
  }

  /**
   * 获取银行列表
   */
  async getAllBanks() {
    try {
      const res = await fetchRequest(
        ApiPort.PaymentDetails +
        "?transactionType=deposit&method=RD&isMobile=true&",
        "GET"
      );
      const BankDataT = res.banks.map(item => {
        return { value: item.Name, label: item.Name, enName: item.EnglishName };
      });
      console.log(BankDataT)
      this.setState({BankDataT, BankData: res},()=>this.selectBank(-1));
    } catch (error) {}
  }
  
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    console.log('rowdata',rowData)
    let evenRow = rowID % 2;
    let isHaveBankImg = bankIcons.find(
      (v) => v.bankChineseName === rowData.value
    );
    return (
        <TouchableHighlight underlayColor='cornflowerblue'>
          <View 
            style={
              { 
                flex:1,
                backgroundColor: '#1A1A1A',   
                display: "flex",                                                   
                flexDirection: 'row',
                alignItems:'center',
                //borderRadius:5,
                //marginTop:3, 
               }}>
            {Boolean(isHaveBankImg) ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 100,
                  width: 24,
                  height: 24,
                  marginLeft:13,
                  marginRight:13,
                  //marginTop: 15,
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={isHaveBankImg.imgUrl}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </View>
            ) : null}
            <Text 
              style={[styles.dropdown_2_row_text, highlighted && { color: '#CCCCCC' }]}
            >
              {`${rowData.label}`}
            </Text>
          </View>
        </TouchableHighlight>
    );
  }

  // 展开下拉框
  dropdownShow() {
    this._dropdown_3 && this._dropdown_3.show();
  }
  /**
   * 选择银行
   * @param {number} key
   */
  selectBank(key) {
    console.log('key',key)
    if(this.state.BankDataT.length > 0){
      if(key == -1){
        this.setState({
          bankName: 'เลือกธนาคาร',
  
        });
      }else {
        this.setState({
          bankName: this.state.BankDataT[key].value,
      
        });
      }
      // this.setState({
      //   bankName: this.state.BankDataT[key].value
      // });
    }
  }

  /**
   *校验数据有效性
   * @returns {Boolean} 是否有效
   * @memberof NewAccount
   */
  checkValid(type) {
    const {
      bankName,
      accountHolderName,
      accountNumber,
      branch,
      city,
      province,
    } = this.state;
    // TODO:输入数据校验
    const nameReg = /^[a-zA-Z\u0E00-\u0E7F ]{2,50}$/;
    const numberReg = /^[0-9]{10,20}$/;
    const provinceReg = /^[a-zA-Z\u0E00-\u0E7F ]{2,30}$/;

    console.log('checking')

    switch (type) {
      
      case 'accountNumber':
        // 卡號檢查
        if (accountNumber == "") {
          this.setState({
            numberMsgST: false,
            numberMsg: "กรุณากรอกหมายเลขบัตรธนาคาร"
          },()=>this.btnStutsCheck())
        }else if (!numberReg.test(accountNumber)) {
          this.setState({
            numberMsgST: false,
            numberMsg: "โปรดกรอกหมายเลขบัญชีให้ถูกต้อง"
          },()=>this.btnStutsCheck())
        } else{
          this.setState({
            numberMsgST: true,
            numberMsg: ""
          },()=>this.btnStutsCheck())
        }
        break
    }
    
    
  }

  // 处理输入框变化
  handleInputChange(value, name) {
    this.setState({
      [name]: value
    },()=>{
      // 更新输入状态后，实时校验
      this.checkValid(name);
    });
  }
  
  btnStutsCheck = () => {
    const { numberMsgST } = this.state;
    if(numberMsgST ){
      this.setState({
        canAdd:true
      })
    }else{
      this.setState({
        canAdd:false
      })
    }
  }

  /**
   * 用戶添加和綁定銀行
   */
  addBankCard() {
    if(!this.state.canAdd) return;
    UMonEvent('Deposit Nav','Click','AddBank_LBExpress')

    const {
      bankName,
      accountNumber,
    } = this.state;
    const data = {
      accountNumber,
      accountHolderName:this.props.data,
      bankName,
      type: this.props.BankTypeKey,//為Deposit
      isDefault: true
    };
    
    Toast.loading("", 200);
    fetchRequest(ApiPort.MemberBanks, "POST", data)
      .then(data => {
        
        Toast.hide();
        console.log('data',data)
        if (data.isSuccess == true) {
          // TODO: 添加成功,返回上一页
          this.setState({
            showSave:true
          },()=>{
            setTimeout(() => {
              this.setState({
                showSave:false,
              })
              window.reloadAccounts && window.reloadAccounts(this.props.BankTypeKey)//刷新充值页面
              this.resetState();
              Actions.pop();
          }, 3000)
          })     

        } else {

          Toast.fail(data.message, 2);
        
        }
      })
      .catch(error => {
        Toast.fail("เพิ่มไม่สำเร็จ", 1.5);
      });
  }

  _dropdown_2_renderButtonText(rowData) {
    console.log('after select!!!!')
    return(
      <Text>{rowData.label}</Text>     
    )
    //return `${rowData.label}`;
  }
  _dropdown_3_adjustFrame(style) {
    style.width = dropdownWitdh;
    style.left -= 2;
    style.top += 12;
    style.height = dropdownHeight;

    return style;
  }
  _dropdown_3_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <Flex
        style={{
          flex: 1,
          // width: dropdownWitdh || 300,
          color: "#fff",
        //   backgroundColor: "#2c2c2c"
        }}
      >
        <Flex.Item
          style={[
            styles.dropdown_2_row,
            {
              // width: 200,
              paddingLeft: 14,
              paddingTop: 3,
              backgroundColor: evenRow ? "#000000" : "#2c2c2c"
            }
          ]}
        >
          <Text
            style={[
              styles.dropdown_2_row_text,
              highlighted && { color: "#fff" }
            ]}
          >
            {`${rowData.label}`}
          </Text>
        </Flex.Item>
      </Flex>
    );
  }
  /**
 * 银行账户名称和号码验证修改\u0E00-\u0E7F]/g,.replace(/[a-zA-Z \u0E00-\u0E7F]+$/,"")
 */
  filterName(value = ''){
    return value.replace(/[^a-zA-Z \u0E00-\u0E7F\ ]/g,'')
    //return value.replace(/[a-zA-Z \u0E00-\u0E7F]+$/,"")
  }

  filterNumber(value = ''){
    return value.trim().replace(/[^\d]/g,'')
  }

  openLiveChat() {
    Actions.LiveChatST()
   // LiveChatOpenGlobe();
  }


  render() {
    const {
      BankDataT,
      bankName,
      accountHolderName,
      accountNumber,
      canAdd,
      fastTextShow,
      isMenuShow,
      showSave
    } = this.state;
    return (
      <View style={styles.rootView}>
        {/* <Flex
          style={{
            paddingLeft: 14,
            paddingTop: 14
          }}
        >
          <Flex.Item>
            <Text style={{ color: "#fff", fontSize: 18 }}>银行卡资讯</Text>
          </Flex.Item>
        </Flex> */}
        {/* 綁定帳號 保存成功 */}
        <Modal
            animationType='none'
            transparent={true}
            visible={showSave} 
            //visible
            onRequestClose={() => { }}                
        >
            <View style={{ width:130, heigt:54,  borderRadius:5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 3, backgroundColor: "#FFFFFF", position:'absolute', top:Platform.OS === "android"?350:450, left:Platform.OS === "android"?90:140}}>
                <Image
                    resizeMode="stretch"
                    source={require("../../images/icon-check-g.png")}
                    style={{ width: 25, height: 25 }}
                />
                {/* 保存成功 */}
                <Text style={{ color: '#333333', paddingLeft: 10 }}>บันทึกสำเร็จ</Text>
            </View>
        </Modal>  
        <View style={styles.inputBoxView}>

          <KeyboardAwareScrollView
              resetScrollToCoords={{x: 0, y: 0}}
          >
            <View style={styles.HeadBackground}>                        			
              <View style={{width: 30}}>
                  <TouchableOpacity 
                      hitSlop={{ 
                          top: 10, 
                          right: 10, 
                          bottom: 10, 
                          left: 10 }} 
                          onPress={() => { Actions.pop() }} 
                  >
                          <Image
                              resizeMode="stretch"
                              source={require("../../images/icon-back.png")}
                              style={{ width: 20, height: 20, marginRight: 20 }}
                          />
                  </TouchableOpacity>
              </View>
              <View>
                  <Text style={{color: '#fff',fontSize: 18}}>
                    เพิ่มบัญชี
                  </Text>
              </View>
              <View style={{ right: 15 }}>
                  <TouchableOpacity 
                      hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}
                      onPressIn={() => this.openLiveChat()}
                      style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 0
                      }}
                  >
                      <Image
                      resizeMode="stretch"
                      source={require("../../images/home/icon-csb.png")}
                      style={{ width: 28, height: 28 }}
                      />
                  </TouchableOpacity>
              </View>
          </View> 
            <View style={{ marginBottom:Platform.OS === "android"? 65 :180}}>
            {/* 請在快速存款前添加銀行賬戶。 
                如果添加，則無法編輯數據。 
                請確保信息正確。 
                防止交易被取消或餘額丟失。 */}
              <View
                style={{
                  backgroundColor: "#FFFCCA",
                  paddingVertical: 13,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                  marginTop: 18,
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "flex-start",
                  flex: 1
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={require("../../images/icon_warning.png")}
                  style={{ width: 20, height: 20, marginRight: 8 }}
                />
                <Text
                  style={{ flex: 1, fontSize: 14, lineHeight: 18, color: '#222222'}}
                >
                  กรุณาเพิ่มบัญชีธนาคารก่อนการฝากเงินแบบฝากด่วน หากเพิ่มแล้วจะไม่สามารถแก้ไขข้อมูลได้ กรุณาตรวจสอบให้แน่ใจว่าข้อมูลถูกต้อง เพื่อป้องกันธุรกรรมถูกยกเลิกหรือยอดเงินสูญหาย
                </Text>
              </View>
      
              
              {/*用戶名*/}
              <View style={{marginTop: 15}}>
              {fastTextShow == true ?
                <View style={{zIndex: 99999, alignItems:'flex-end',position:'absolute',top:40}} >
                  <TouchableOpacity
                    hitSlop={{
                        top: 10,
                        bottom: 10,
                        left: 10,
                        right: 10
                    }}
                    style={{
                      zIndex: 99999,
                      backgroundColor: "#FFFCCA", 
                      borderRadius: 5, 
                      width: width - 30,
                      paddingHorizontal: 10, 
                      paddingVertical: 14,
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "flex-start",
                      flex: 1,                      
                    }}
                    >
                    <Text style={{width:width-70,fontSize: 13,color: "#222222",marginLeft:5}}>
                      {/* 銀行賬戶名稱必須與註冊名稱一致。 
                          編輯 請聯繫實時聊天 */}
                      ชื่อบัญชีธนาคารต้องตรงกับชื่อที่ลงทะเบียน หากต้องการแก้ไข กรุณาติดต่อแชทสด
                    </Text>
                    <View style={styles.triangle2}></View>
                    <Text 
                      style={{color:'#222222',fontSize:18,marginTop:-15, marginLeft:3}} 
                      onPress={
                        ()=>this.setState({
                          fastTextShow: false,
                      })}
                      >X</Text>
                  </TouchableOpacity>
                </View>:null}

                <View 
                  style={{
                    backgroundColor: "#000000",
                  }}
                >
                  <View style={styles.moneyTitle}>
                    <Text style={{fontSize:14,color: '#fff', lineHeight: 35, marginRight:8}}>
                      <Text style={{color: "red"}}>* </Text>
                      ชื่อ-นามสกุล
                    </Text>
                    <TouchableOpacity 
                      onPress={
                        ()=>this.setState({
                          fastTextShow: true,
                      })}
                    >
                      <Image 
                        resizeMode="stretch"
                        source={require("../../images/icon_help.png")}
                        style={{ width: 22, height: 22 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Flex style={styles.copyWrap}>
                      <Flex.Item>
                          <Text style={styles.copyText}>
                              {this.props.data}
                          </Text>
                      </Flex.Item>
                  </Flex>
                </View>
              </View>
  

              {/*銀行*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>ชื่อธนาคาร</Text>
              </View>
              {BankDataT == "" ? (<Text style={{color: "#fff", paddingLeft: 10, paddingTop: 10, height: 44}}>
                กำลังโหลด..
              </Text>) : (
                  <View style={[styles.DsBorder, { flexDirection: "row",  borderColor:isMenuShow == false ? '#3d3d3d':'#00E62E'}]}>
                    <View style={{ marginLeft: 40 }}>
                        {bankIcons.map((row) => {
                          if (row.bankChineseName == bankName) {
                            return (
                              <View
                                style={{
                                  backgroundColor: "#fff",
                                  borderRadius: 100,
                                  width: 24,
                                  height: 24,
                                  // alignItems: "center",
                                  // justifyContent: "center"
                                }}
                              >
                                <Image
                                  resizeMode="stretch"
                                  source={row.imgUrl}
                                  style={{
                                    width: 24,
                                    height: 24,
                                  }}
                                />
                              </View>
                            );
                          } 
                        })}
                        {bankName =='เลือกธนาคาร' &&  isMenuShow == false &&<Image
                            source={require("../../images/icon_exCard.png")}
                            resizeMode="stretch"
                            style={{ width: 23, height:15,marginLeft:10}}
                        />}
                        {bankName =='เลือกธนาคาร' &&  isMenuShow == true && <Image
                            source={require("../../images/icon_exCard_click.png")}
                            resizeMode="stretch"
                            style={{ width: 23, height:15,marginLeft:10}}
                        />}
                    </View>

                    <ModalDropdown ref={el => this._dropdown_3 = el}
                                  defaultValue={`เลือกธนาคาร`} 
                                  textStyle={styles.DSdropdown_D_text}
                                  dropdownStyle={[styles.limitDropdownStyle,{ marginLeft: bankName !='เลือกธนาคาร' ?-30:-40, marginTop: 25, borderColor:isMenuShow == true?'#000000':'' }]}
                                  options={BankDataT}
                                  renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                  renderRow={this._dropdown_2_renderRow.bind(this)}
                                  onSelect={this.selectBank}
                                  style={{zIndex: 10, width: width - 30}}
                                  //renderSeparator={()=>(<View style={{borderColor:'#757575'}} />)}
                                  renderSeparator={()=>(<View style={{width: '95%', alignSelf: 'center', borderWidth:0,borderColor:'#000000'}} />)}
                                  onDropdownWillShow={() =>
                                    this.setState({ isMenuShow: true })
                                  }
                                  onDropdownWillHide={() =>
                                    this.setState({ isMenuShow: false })
                                  }
                    />
                    <View
                        style={{
                          position: "absolute",
                          right: 10,
                          paddingTop: 6,
                        }}
                      >
                        <View
                          style={{
                            marginBottom: isMenuShow ? 15 : 0,
                            width: 0,
                            height: 0,
                            zIndex: 9,
                            borderStyle: "solid",
                            borderWidth: 7,
                            borderTopColor: isMenuShow ? "transparent" : "#fff", //下箭头颜色
                            borderLeftColor: "transparent", //右箭头颜色
                            borderBottomColor: isMenuShow
                              ? "#00E62E"
                              : "transparent", //上箭头颜色
                            borderRightColor: "transparent", //左箭头颜色
                          }}
                        ></View>
                    </View>
                </View>
              )}

              {/*银行号码*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}><Text style={{ color: "red" }}>* </Text>หมายเลขบัญชี</Text>
              </View>
              <View style={styles.DsBorder}>
                <InputItem styles={StyleSheet.create(newStyle)}
                           placeholderTextColor="#fff"
                           labelNumber={6}
                           type="text"
                           name="accountNumber"
                           value={accountNumber}
                           onChange={value => {
                             this.handleInputChange(this.filterNumber(value).trim(), "accountNumber");
                           }}
                           placeholder=""
                           placeholderTextColor={'#98989a'}
                >
                </InputItem>
              </View>
              {
                this.state.numberMsg != '' &&
                <Text style={{color: 'red', fontSize: 12}}>{this.state.numberMsg}</Text>
              }

              
            </View>
     
            <Flex>
              <Flex.Item alignItems="center">
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 30
                  }}
                >
            
                  <TouchableOpacity
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      onPress={()=>Actions.pop()}
                    >
                      {/* 取消 */}
                      <View style={styles.cancelAdd}>              
                        <Text
                          style={{
                            color: "#00b324",
                            fontSize: 16,
                            textAlign: "center"
                          }}
                        >
                          ยกเลิก
                        </Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={this.addBankCard}
                  >
                    {/* 存檔 */}
                    <View style={canAdd?styles.canAdd:styles.addBankBtn}>
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          textAlign: "center"
                        }}
                      >
                        บันทึก
                      </Text>
                    </View>
                  
                  </TouchableOpacity>
                </View>
              </Flex.Item>
            </Flex>
            
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootView: { flex: 1, backgroundColor: "#0a0a0a" },
  inputBoxView: { 
    flex: 1,
    padding: 14
  },

  newBankFlex: {
    justifyContent: "flex-start",
    alignItems: "center",
    // paddingLeft: 14,
    paddingTop: 5,
	paddingBottom: 5,
	// paddingRight: 8
  },
  bankSelect: {
	  borderBottomWidth: 1,
	  borderBottomColor: '#3d3d3d',
	  marginLeft: 12
  },

  newBankFlexLabel: {
    flex: 1
  },
  newBankFlexText: {
    fontSize: 14,
    color: "#fff"
  },
  inputItem: {
    // flex: 3,
    // borderRadius: 3,
    // borderWidth: 1,
    // borderColor: "#363636",
    // color: "#fff"
  },
  bankItem: {
    flex: 3,
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: "#363636",
    color: "#fff",
    // backgroundColor: "#2c2c2c"
  },
  arrow: {
    zIndex: 9,
  },

  addBankBtn: {
    bottom:0,
    //width: "80%",
    width:(width-50)/2,
    marginTop: 45,
    borderRadius: 5,
    backgroundColor: "#2D2D2D",
    paddingVertical: 10,
    marginHorizontal: 13
  },
  canAdd: {
    bottom:0,
    //width: "80%",
    width:(width-50)/2,
	  marginTop: 45,
    borderRadius: 5,
    backgroundColor: "#00b324",
    paddingVertical: 10,
    marginHorizontal: 13
  },
  cancelAdd: {
    bottom:0,
    //width: "80%",
    width:(width-50)/2,
	  marginTop: 45,
    borderRadius: 5,
    borderColor:"#00b324",
    borderWidth:1,
    paddingVertical: 10,
    marginHorizontal: 13
  },
  dropdown_2: {
    alignSelf: "flex-start",
    width: 150,
    marginTop: 32,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "#fff"
  },

  dropdown_D_text: {
	top: 1,
	width: width /1.5,
    paddingBottom: 5,
    // paddingLeft: 10,
    fontSize: 15,
    color: "#828282",
	textAlign: 'right',
	paddingRight: 15,
  },

  dropdown_Day_text: {
    color: "#fff",
    fontSize: 15
  },

  dropdown_Bonus_text: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 14,
    fontSize: 12,
    color: "#e0e0e0"
  },

  dropdown_Bonus_dropdown: {
    flex: 1,
    marginRight: -15,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    elevation: 4
  },

  dropdown_D2_dropdown: {
    width: 80,
    height: 244,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },

  dropdown_DX_dropdown: {
	  textAlign: 'right',
    marginRight: -15,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
    top: 125
  },
  dropdown_Day_dropdown: {
    width: 80,
    height: 244,
    marginRight: -15,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },
  dropdown_DZ_dropdown: {
    width: 130,
    height: 80,
    marginRight: 0,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },

  dropdown_DZ2_dropdown: {
    width: 200,
    height: 200,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },

  dropdown_D_dropdown: {
    width: 130,
    height: 150,
    flex: 1,
    marginRight: 0,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },

  dropdown_2_text: {
    marginVertical: 7,
    marginHorizontal: 6,
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_dropdown: {
    borderRadius: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },
  dropdown_3_dropdown: {
    marginRight: -35,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: "#000000",
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4
  },

  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30
  },

  dropdown_2_row: {
    flex: 1
  },

  dropdown_2_row_text: {
    fontSize: 14,
    paddingLeft: 5,
    paddingRight:20,
    paddingTop: 15,
    paddingBottom: 13,
    color: "#fff"
  },

  dropdown_Bonus_row: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10
  },

  dropdown_Bonus_row_text: {
    marginHorizontal: 4,
    fontSize: 12,
    color: "#fff",
    textAlignVertical: "center"
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: "#cbcbcb"
  },
  DsBorder: {
    borderWidth: 1,
    borderColor: '#3d3d3d',
    borderRadius:5,
    height:48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:3,
  },
  DSdropdown_D_text: {
    width: width-30,
    paddingLeft: 15,
    fontSize: 13,
    color: '#fff',
    paddingRight:60,
  },
  DSdropdown_D_dropdown: {
    width: width-30,
    height: 250,
    flex: 1,
    marginRight: 0,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    shadowColor: "#666",
    backgroundColor: '#000000',
    //注意：这一句是可以让安卓拥有灰色阴影
    elevation: 4,
    
  },
  DSarrow: {
    marginTop: 0,
    width: 0,
    height: 0,
    zIndex: 9,
    borderStyle: 'solid',
    borderWidth: 7,
    borderTopColor: '#CCCCCC',//下箭头颜色
    borderLeftColor: 'transparent',//右箭头颜色
    borderBottomColor: 'transparent',//上箭头颜色
    borderRightColor: 'transparent'//左箭头颜色
  },
  copyWrap: {
    borderRadius:5,
    backgroundColor: '#2A2A2A',
    paddingVertical: 15,
    paddingLeft: 16,
    paddingRight: 11,
    justifyContent: 'space-between'
  },
  copyText: {
    color: '#656565',
    fontSize: 14
  },
  moneyTitle: {
    display: 'flex',
    //justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height:35,
  },
  triangle:{
    width: 0,
    height: 0,
    backgroundColor: "#FFFCCA",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "#FFFCCA",
    borderRightColor: "#FFFCCA",
    borderBottomColor: "#00B324",
    
    position: 'absolute',
    bottom: -13,
    left: 0
  },
  triangle2:{
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#FFFCCA",

    position: 'absolute',
    top: -18,
    alignSelf: 'center',
    left: 92
  },
  limitModalDropdownArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 6,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F5F5F5'
  },
  limitModalDropdownTextWrap: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  limitModalDropdownText: {
    color: '#F5F5F5'
  },
  limitDropdownStyle: {
    marginTop: 8,
    width: BaseWidth0,
    height: 230,
    backgroundColor: '#141414',
    borderColor: 'transparent',
    borderRadius: 4,
    marginLeft: -1
  },
  limitModalDropdown: {
    width: BaseWidth0,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 4,
},
limitModalDropdownList: {
  height: 40,
  justifyContent: 'center',
  paddingHorizontal: 16
},
limitModalDropdownListText: {
  color: '#fff'
},
HeadBackground: {
  width: width,
  height: 50,
  marginTop: Platform.OS === "android" ? 0:50,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  padding: 13,
},
});
