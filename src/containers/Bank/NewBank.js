import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image, TouchableHighlight,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Actions } from "react-native-router-flux";

import { Flex, Toast, InputItem } from "antd-mobile-rn";
import ModalDropdown from "react-native-modal-dropdown";

import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";

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

/**
 *添加银行卡页面
 * @class NewBank
 * @extends {React.Component}
 */
export default class NewBank extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
    this.getAllBanks = this.getAllBanks.bind(this);
    this.resetState = this.resetState.bind(this);
    this.selectBank = this.selectBank.bind(this);
    this.checkValid = this.checkValid.bind(this);
    this.addBankCard = this.addBankCard.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    console.log(this.props)
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
          "?transactionType=Withdrawal&method=LB&isMobile=true&",
        "GET"
      );
      const BankDataT = res.banks.map(item => {
        return { value: item.Name, label: item.Name };
      });
      console.log(BankDataT)
      this.setState({BankDataT, BankData: res},()=>this.selectBank(0));
    } catch (error) {}
  }
  
  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
        <TouchableHighlight underlayColor='cornflowerblue'>
          <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? '#000000' : '#2c2c2c' }]}>
            <Text style={[styles.dropdown_2_row_text, highlighted && { color: '#fff' }]}>
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
    if(this.state.BankDataT.length > 0){
      this.setState({
        bankName: this.state.BankDataT[key].value
      });
    }
  }

  /**
   *校验数据有效性
   * @returns {Boolean} 是否有效
   * @memberof NewBank
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
    const numberReg = /^[0-9]{1,50}$/;
    const provinceReg = /^[a-zA-Z\u0E00-\u0E7F ]{2,30}$/;

    console.log('checking')

    switch (type) {
      case 'accountHolderName':
        // 姓名檢查
        if (accountHolderName.replace(/\s*/g,"").length == 0) {
          this.setState({
            nameMsgST: false,
            nameMsg: "กรุณากรอกชื่อ"
          },()=>this.btnStutsCheck())
        }else if (!nameReg.test(accountHolderName)) {
          this.setState({
            nameMsgST: false,
            nameMsg: "รูปแบบไม่ถูกต้อง(นามสกุลจะต้องมีอักษรระหว่าง2-50ตัวอักษร และเป็นภาษาไทยเท่านั้นด)"
          },()=>this.btnStutsCheck())
        } else{
          this.setState({
            nameMsgST: true,
            nameMsg: ""
          },()=>this.btnStutsCheck())
        }
        break
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
            numberMsg: "กรอกรูปแบบไม่ถูกต้อง"
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
    const { numberMsgST, nameMsgST } = this.state;
    if(numberMsgST && nameMsgST ){
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
   * 添加银行卡
   */
  addBankCard() {
    if(!this.state.canAdd) return;
    
    const {
      bankName,
      accountHolderName,
      accountNumber,
      branch,
      city,
      province
    } = this.state;
    const data = {
      accountNumber,
      accountHolderName,
      branch,
      city,
      bankName,
      province,
      type: this.props.BankTypeKey,
      isDefault: true
    };
    Toast.loading("", 200);
    fetchRequest(ApiPort.MemberBanks + "?", "POST", data)
      .then(data => {
        UMonEvent('Account','Submit','AddBankAccount_ ProfilePage')
        Toast.hide();
        if (data.isSuccess == true) {
          // TODO: 添加成功,返回上一页
          Toast.success("เพิ่มบัตรธนาคารเรียบร้อยแล้ว", 2, () => {
            this.resetState();
            window.reloadBanksOnCenter && window.reloadBanksOnCenter(this.props.BankTypeKey);//刷新银行卡管理页面的银行卡列表
            window.reloadBanks && window.reloadBanks()//刷新提款页面的银行卡列表
            Actions.pop();
          });
        } else {
          Toast.fail(data.message, 2);
        }
      })
      .catch(error => {
        Toast.fail("เพิ่มไม่สำเร็จ", 1.5);
      });
  }

  _dropdown_2_renderButtonText(rowData) {
    return `${rowData.label}`;
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

  render() {
    const {
      BankDataT,
      bankName,
      accountHolderName,
      accountNumber,
      branch,
      city,
      province,
      canAdd
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
        <View style={styles.inputBoxView}>
          <KeyboardAwareScrollView
              resetScrollToCoords={{x: 0, y: 0}}
          >
            <View style={{paddingLeft: 15, paddingRight: 15}}>

              {/*銀行*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}>ธนาคาร</Text>
              </View>
              {BankDataT == "" ? (<Text style={{color: "#fff", paddingLeft: 10, paddingTop: 10, height: 44}}>
                กำลังโหลด..
              </Text>) : (
                  <View style={styles.DsBorder}>
                    <ModalDropdown ref={el => this._dropdown_3 = el}
                                   defaultValue={bankName}
                                   textStyle={styles.DSdropdown_D_text}
                                   dropdownStyle={styles.DSdropdown_D_dropdown}
                                   options={BankDataT}
                                   renderButtonText={(rowData) => this._dropdown_2_renderButtonText(rowData)}
                                   renderRow={this._dropdown_2_renderRow.bind(this)}
                                   onSelect={this.selectBank}
                                   style={{zIndex: 10, width: width - 30}}
                    />
                    <View style={{position: 'absolute', right: 10, paddingTop: 6}}>
                      <View style={styles.DSarrow}></View>
                    </View>
                  </View>
              )}
              
              {/*用戶名*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}>ชื่อบัญชี</Text>
              </View>
              <View style={styles.DsBorder}>
                <InputItem styles={StyleSheet.create(newStyle)}
                           placeholderTextColor="#fff"
                           type="text"
                           name="accountHolderName"
                           value={accountHolderName}
                           onChange={value => {
                             this.handleInputChange(this.filterName(value), "accountHolderName");
                           }}
                           placeholder=""
                           placeholderTextColor={'#98989a'}
                >
                </InputItem>
              </View>
              {
                this.state.nameMsg != '' &&
                <Text style={{color: 'red', fontSize: 12}}>{this.state.nameMsg}</Text>
              }

              {/*银行号码*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}>เลขที่บัญชี</Text>
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

              {/*省／自治区*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}>จังหวัด</Text>
              </View>
              <View style={styles.DsBorder}>
                <InputItem styles={StyleSheet.create(newStyle)}
                           placeholderTextColor="#fff"
                           type="text"
                           name="province"
                           value={province}
                            onChange={value => {
                             this.handleInputChange(this.filterName(value), "province");
                            }}
                           placeholder=""
                           placeholderTextColor={'#98989a'}
                >
                </InputItem>
              </View>

              {/*城市／城镇:*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}>เมือง</Text>
              </View>
              <View style={styles.DsBorder}>
                <InputItem styles={StyleSheet.create(newStyle)}
                           placeholderTextColor="#fff"
                           type="text"
                           name="city"
                           value={city}
                          onChange={value => {
                            this.handleInputChange(this.filterName(value), "city");
                          }}
                           placeholder=""
                           placeholderTextColor={'#98989a'}
                >
                </InputItem>
              </View>

              {/*分行:*/}
              <View style={{marginTop: 15}}>
                <Text style={{color: '#fff', lineHeight: 35}}>สาขาที่เปิดบัญชี</Text>
              </View>
              <View style={styles.DsBorder}>
                <InputItem styles={StyleSheet.create(newStyle)}
                           placeholderTextColor="#fff"
                           type="text"
                           name="branch"
                           value={branch}
                          onChange={value => {
                             this.handleInputChange(this.filterName(value), "branch");
                          }}
                           placeholder=""
                           placeholderTextColor={'#98989a'}
                >
                </InputItem>
              </View>
              
            </View>

            <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={this.addBankCard}
            >
              <View style={canAdd?styles.canAdd:styles.addBankBtn}>
                <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                >
                  บันทึก
                </Text>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rootView: { flex: 1, backgroundColor: "#0a0a0a" },
  inputBoxView: { flex: 1 },

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
    marginTop: 45,
    borderRadius: 5,
    backgroundColor: "#2D2D2D",
    paddingVertical: 10,
    marginHorizontal: 15
  },
  canAdd: {
	marginTop: 45,
    borderRadius: 5,
    backgroundColor: "#00b324",
    paddingVertical: 10,
    marginHorizontal: 15
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
    paddingTop: 12,
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
    paddingLeft: 15,
    fontSize: 13,
    color: '#fff',

  },
  DSdropdown_D_dropdown: {
    width: width-30,
    height: 150,
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
    borderTopColor: '#00b324',//下箭头颜色
    borderLeftColor: 'transparent',//右箭头颜色
    borderBottomColor: 'transparent',//上箭头颜色
    borderRightColor: 'transparent'//左箭头颜色
  },
});
