import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from "react-native-touch-once";
import {Flex, Toast,} from "antd-mobile-rn";
import Popover, { PopoverMode, PopoverPlacement } from 'react-native-popover-view';
import Accordion from 'react-native-collapsible/Accordion';

const { width } = Dimensions.get("window");
const bankImage = {
	"dp": require('../../images/bank/dp.png'),
	"wt": require('../../images/bank/wt.png'),
	"rp": require('../../images/bank/rp.png'),
}
const bankImageHover = {
	"dp": require('../../images/bank/dp1.png'),
	"wt": require('../../images/bank/wt1.png'),
	"rp": require('../../images/bank/rp1.png'),
}

import AccordionItem from 'antd-mobile-rn/lib/accordion/style/index.native';
const newStyle = {};
for (const key in AccordionItem) {
  if (Object.prototype.hasOwnProperty.call(AccordionItem, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(AccordionItem[key]) };
    newStyle[key].borderBottomWidth = 0;
    newStyle[key].borderTopWidth = 0;
  }
}

export default class BankCenter extends Component {
  constructor(props) {
    super(props);
      this.state = {
          banks: [],
          loading: true,
          BankTypeKey: props.BankType ? props.BankType : 'D',
          isNew3: true,
          transactionHistory: [],
          toolTipVisible: false,
          activeSections: []
      };
    this.goNewBank = this.goNewBank.bind(this);
    this.getBankList = this.getBankList.bind(this);
    this.adjustBanks = this.adjustBanks.bind(this);
    this.removeAccount = this.removeAccount.bind(this);
    this.setDefaultAccount = this.setDefaultAccount.bind(this);
    // this.formatBankNo = this.formatBankNo.bind(this);

    this.onChange = activeSections => {
      this.setState({ activeSections });
    };
  }

  componentDidMount() {
      this.checkMember();
    this.getBankList('D'); 
    this.getTransactionHistory()
  }

    /**
     * 获取提款歷史記錄
     */
    getTransactionHistory = () => {
        fetchRequest(ApiPort.TransactionHistory, 'GET')
            .then(data => {
                console.log('TransactionHistory',data)
                this.setState({
                    transactionHistory: data
                })
            }).catch((err)=>{
            console.log('get transactionHistory err ',err)
        })
    }
  
  /**
   * 获取用户添加过的银行卡列表
   */
  async getBankList(type) {
	let key = '';
	if (type == 'D') {
		key = 'AccountType=Deposit&';
	} else {
		key = 'AccountType=Withdrawal&';
	}
    this.setState({ loading: true })
    try {
	  Toast.loading("โปรดรอสักครู่...", 200);
	  const res = await fetchRequest(ApiPort.MemberBanks + key, "GET");
	  Toast.hide()
      if (res.length > 0) {
        const banks = this.adjustBanks(res);
        this.setState({ banks },()=>{
          this.setState({ toolTipVisible: true })
        });
      } else {
        this.setState({ banks: [] },()=>{
          this.setState({ toolTipVisible: true })
        });
      }
    } catch (error) {
		Toast.hide()
      // 获取失败
    } finally {
	  Toast.hide()
      this.setState({ loading: false })
      

    }
  }

  maskBankNo(num) {
    if(num.length > 6){
      return `${'*'.repeat(num.length - 6)} ${num.substr(num.length - 6)}`;
    } else{
      return num
    }
  }
  
  formatBankNo(bankNo) {
    let bankNumber = ''
    if (bankNo.length > 16) {
      bankNumber = bankNo.slice(0, 4) + ' ' + bankNo.slice(4, 8) + ' ' + bankNo.slice(8, 12) + ' ' + bankNo.slice(12, 16) + ' ' + bankNo.slice(16)
    } else {
      bankNumber = bankNo.slice(0, 4) + ' ' + bankNo.slice(4, 8) + ' ' + bankNo.slice(8, 12) + ' ' + bankNo.slice(12)
    }

    return bankNumber
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

    checkMember() {
        fetchRequest(ApiPort.Member, 'GET')
            .then(data => {
                console.log('checkMember',data)
                this.setState({
                    isNew3: data.result.memberInfo.IsSingleDeposit||false
                })
            })
    }

  /**
   * 移除账户
   */
  async removeAccount(bank) {
    try {
      Toast.loading("โปรดรอสักครู่..", 200);
      // Toast.loading("删除中,请稍候...", 200);
      const res = await fetchRequest(
        ApiPort.DELETEMemberBanksDefault + bank.BankAccountID + "?",
        "DELETE"
      );
      if (res.isSuccess == true) {
		await this.getBankList(this.state.BankTypeKey);
		window.reloadBanks && window.reloadBanks()//刷新提款页面的银行卡列表
        Toast.hide()
        Toast.success("สำเร็จ");
        // Toast.success("删除成功!");
        window.reloadBanks && window.reloadBanks()//刷新提款页面的银行卡列表
      } else {
        Toast.hide();
        Toast.fail("ล้มเหลว");
        // Toast.fail("删除失败!");
      }
    } catch (error) {
      Toast.hide();
      Toast.fail("ล้มเหลว");
      // Toast.fail("删除失败!");
    }
  }

  /**
   * 设置默认账户
   */
  async setDefaultAccount(bank) {
    try {
      Toast.loading("โปรดรอสักครู่", 200);
      // Toast.loading("设置中,请稍候...", 200);
      const res = await fetchRequest(
        ApiPort.PATCHMemberBanksDefault + bank.BankAccountID + "/Default?",
        "PATCH"
      );
      if (res.isSuccess == true) {
		await this.getBankList(this.state.BankTypeKey);
		window.reloadBanks && window.reloadBanks()//刷新提款页面的银行卡列表
        Toast.hide();
        Toast.success("บันทึกสำเร็จ");
        // Toast.success("设置成功！");
      } else {
        Toast.hide();
        Toast.fail("ล้มเหลว");
        // Toast.fail("设置失败！");
      }
    } catch (error) {
      Toast.hide();
      Toast.fail("ล้มเหลว");
      // Toast.fail("设置失败！");
    }
  }
  /**
   * 跳转到添加银行卡页面
   */
  goNewBank() {
	  if (this.state.BankTypeKey == 'D') {
		Actions.newBank({BankType: 'Bankcneter', BankTypeKey: this.state.BankTypeKey});
	  } else {
		Actions.newBank({BankType: 'Bankcneter', BankTypeKey: this.state.BankTypeKey});
	  }
  }
  bankChangge(type) {
	this.setState({
		BankTypeKey: type,
	})
	this.getBankList(type);
  }

  getBG = (index) => {
    console.log(index)
    if (index % 2 === 0) {
      return '#2A2A2A'
    } else {
      return '#393939'
    }
  }

  renderTooltip = () => {
    return (
        <Popover
            isVisible={this.state.toolTipVisible}
            mode={PopoverMode.TOOLTIP}
            placement={PopoverPlacement.RIGHT}
            popoverStyle={{width: 350,zIndex: 999999,backgroundColor: "#00AA21", paddingHorizontal: 4,
              paddingVertical: 8,}}
            from={(
                <TouchableOpacity
                    style={{width: 105}}
                    onPress={() => this.setState({toolTipVisible: true})}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: '#818181', fontSize: 12}}>ประวัติการถอน</Text>
                    <View style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20 / 2,
                      // backgroundColor: 'red',
                      borderColor: '#818181',
                      borderWidth: 1,
                      marginLeft: 5,
                      marginRight: 5,
                      zIndex: 999999,
                    }}>
                      <Text style={{
                        fontSize: 15,
                        width: 19,
                        color: '#818181',
                        textAlign: 'center',
                        alignItems: 'center'
                      }}>?</Text>
                    </View>
                  </View>
                </TouchableOpacity>
            )}>
          <TouchableOpacity
              onPress={() => this.setState({toolTipVisible: false})}>
            <Text style={{
              color: '#fff',
              fontSize: 10
            }}>
              ดูข้อมูลการถอนจากเรา เพื่อป้องกันการถูกตรวจสอบบัญชีถอนเงิน ตามกฎสรรพากร (เงินเข้า 3,000 ครั้งขึ้นไปเงินเข้า 400 ครั้ง และยอดรวม 2 ล้านบาทขึ้นไปต่อปี)
            </Text>
          </TouchableOpacity>
        </Popover>
    )
  }

  _renderHeader = (section, i, isActive) => {
    return (
        <View
            style={[styles.buttonTitle, {backgroundColor: this.getBG(i)}]}>
          <Text style={{color: '#999999', fontSize: 14}}>
              {section.BankName}{" "}{this.maskBankNo(section.AccountNumber)}
          </Text>
          {isActive? <Image
              style={{width: 14, height: 14}}
              source={require("../../images/up_green_arrow.png")}
          />: <Image
              style={{width: 14, height: 14}}
              source={require("../../images/down_green_arrow.png")}
          />}
        </View>
    );
  };

  _renderContent = (section) => {
    return (
        <View style={styles.conterBg}>
          <View style={{flexDirection: 'row', backgroundColor: '##1A1A1A'}}>
            <Text style={[styles.thWrap, {flex: 1}]}>
              จำนวนรายการ
            </Text>
            <Text style={[styles.thWrap, {flex: 3}]}>
              ยอดรวม (บาท)
            </Text>
          </View>
          <View style={{flexDirection: 'row', backgroundColor: '#2A2A2A'}}>
            <Text style={[styles.thWrap, {flex: 1}]}>
              {section.TotalUpToDateTransaction}
            </Text>
            <Text style={[styles.thWrap, {flex: 3}]}>
              {section.TotalUpToDateAmount}
            </Text>
          </View>
        </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  addCardBtnHide = () => {
    const { banks, loading, BankTypeKey, transactionHistory } = this.state;
    return this.state.isNew3 && banks.length > 0;
  }

  render() {
    const { banks, loading, BankTypeKey, transactionHistory } = this.state;
    console.log(this.state)
    window.reloadBanksOnCenter = (type) => {
        this.checkMember()
      this.getBankList(type)
    }
    return (
      <View style={styles.rootView}  onStartShouldSetResponder={evt => {
        this.setState({toolTipVisible: false})
      }} >
		  <View style={styles.BankTab}>
			<View style={[styles.BankTabItem,{borderBottomColor: BankTypeKey == 'D' ? '#17fe00' : '#171717'}]}>
				<Touch onPress={() => this.bankChangge('D')} style={styles.BankTabItemView}>
					<Image resizeMode='stretch' source={BankTypeKey == 'D' ? bankImageHover['dp'] : bankImage['dp']} style={{ width: 25, height: 25,marginRight:5 }} />
					<Text style={[styles.BankTabTxt,{color: BankTypeKey == 'D' ? '#17fe00' : '#fff'}]}>ธนาคารฝาก</Text>
				</Touch>
			</View>
			<View style={[styles.BankTabItem,{borderBottomColor: BankTypeKey == 'W' ? '#17fe00' : '#171717'}]}>
				<Touch onPress={() => this.bankChangge('W')} style={styles.BankTabItemView}>
					<Image resizeMode='stretch' source={BankTypeKey == 'W' ? bankImageHover['wt'] : bankImage['wt']} style={{ width: 25, height: 22,marginRight: 5 }} />
					<Text style={[styles.BankTabTxt,{color: BankTypeKey == 'W' ? '#17fe00' : '#fff'}]}>ธนาคารถอน</Text>
				</Touch>
			</View>
		  </View>

        {loading ? (
                <View
                    style={{
                      width: width,
                      flex: 1,
                      padding: 20,
                      backgroundColor: "#171717"
                    }}
                >
                  <Text style={{textAlign: "center", color: "#fff"}}>
                    โปรดรอสักครู่...
                    {/* 数据加载中.. */}
                  </Text>
                </View>
            ) :
            (
                <View style={styles.banksBoxView}>
                  
                  <ScrollView style={{marginBottom: this.addCardBtnHide()?0:100}}>
                    {banks.length == 0 && <NoBankComp/>}
                    {banks.length > 0 && banks.map(bank => (
                              <View key={bank.BankAccountID}
                                    style={bank.IsDefault ? [styles.bankBoxView, styles.defaultBoxView] : styles.bankBoxView}>
                                <Flex>
                                  <Text style={styles.bankName}>{bank.BankName}</Text>
                                </Flex>

                                <Flex>
                                  <Image style={{width: 33, height: 26}}
                                         source={require("../../images/bank/card.png")}/>
                                </Flex>

                                <Flex style={styles.numberFlex}>
                                  <Flex.Item style={{flex: 3}}>
                                    <Text style={styles.accountNumber}>
                                      {/* {bank.AccountNumber} */}
                                      {this.formatBankNo(bank.AccountNumber)}
                                    </Text>

                                    <Text style={[styles.accountNumber,{marginTop: 5}]}>{userName}</Text>
                                  </Flex.Item>
                                  {/*<删除银行卡>按钮如果isSingleDeposit= true 的话 要拿掉*/}
                                  {this.state.isNew3 ? null : (
                                      <Flex.Item style={{flex: 1.7}}>
                                        <TouchableOpacity
                                            style={styles.removeBtn}
                                            onPress={() => this.removeAccount(bank)}
                                        >
                                          <Text style={styles.rmbtnText}>ลบ</Text>
                                          {/* 删除 */}
                                        </TouchableOpacity>
                                      </Flex.Item>
                                  )}
                                </Flex>

                                <Flex style={styles.addressFlex}>
                                  <Flex.Item style={styles.address}>
                                    {/* <Text style={styles.holderName}>
                        {bank.AccountHolderName}
                      </Text>
                      <Text style={styles.province}>{bank.Province}</Text>
                      <Text style={styles.city}>{bank.City}</Text>
                      <Text style={styles.branch}>{bank.Branch}</Text> */}
                                  </Flex.Item>
                                  <Flex.Item style={{flex: 1.7}}>
                                    {bank.IsDefault ? (
                                        <TouchableOpacity
                                            style={styles.defAccount}
                                        >
                                          <Text style={styles.defbtnText}>ค่าเริ่มต้น</Text>
                                          {/* <Text style={styles.defbtnText}>默认账户</Text> */}
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.defaultAccount}
                                            onPress={() => this.setDefaultAccount(bank)}
                                        >
                                          <Text style={styles.defbtnText}>ตั้งเป็นค่าเริ่มต้น</Text>
                                          {/* <Text style={styles.defbtnText}>设为默认账户</Text> */}
                                        </TouchableOpacity>
                                    )}
                                  </Flex.Item>
                                </Flex>
                              </View>
                          ))}
                    {/*提款記錄*/}
                    {
                      BankTypeKey === 'W' && transactionHistory.length > 0 && (
                          <>
                            <View style={{flex: 1, height: 1, backgroundColor: '#818181', marginVertical: 20}}/>

                            {this.renderTooltip()}

                            <View style={{marginTop: 25,zIndex: 99}}>
                              <Accordion
                                  activeSections={this.state.activeSections}
                                  sections={transactionHistory}
                                  renderHeader={this._renderHeader}
                                  renderContent={this._renderContent}
                                  onChange={this._updateSections}
                                  containerStyle={{zIndex: 9}}
                              />
                            </View>

                            <View style={{marginTop: 15}}>
                              <Text style={{fontSize: 12, color: '#FF0000', marginBottom: 5}}>แจ้งเตือน: </Text>
                              <Text style={{fontSize: 12, color: '#FF0000', marginBottom: 5}}>1.
                                ยอดรวมการถอนเงินทั้งหมดจะนับตั้งแต่วันที่ 1 มกราคม - 31 ธันวาคม</Text>
                              <Text style={{fontSize: 12, color: '#FF0000'}}>2. เพื่อความปลอดภัย
                                กรุณาเปลี่ยนธนาคารก่อนที่จะถึง 400 รายการ ยอดรวม 2 ล้าน หรือ 3,000 รายการ</Text>
                            </View>

                          </>
                      )
                    }
                  </ScrollView>
                  
                  {/*isSingleDeposit = true 和 会员有已经加了一个银行卡，加银行卡按钮就要隐藏*/}
                  {this.addCardBtnHide() ? null : (
                      <Flex>
                        <Flex.Item alignItems="center">
                          <TouchableOpacity
                              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                              style={styles.addBankBtn}
                              onPress={this.goNewBank}
                          >
                            <Text
                                style={{
                                  color: "#17fe00",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                  textAlign: "center"
                                }}
                            >
                              +{"      "}เพิ่มธนาคาร
                              {/* + 添加银行卡 */}
                            </Text>
                          </TouchableOpacity>
                        </Flex.Item>
                      </Flex>
                  )}
                </View>
            )}
      </View>
    );
  }
}

/**
 * 纯函数组件：无银行卡
 */
export const NoBankComp = () => (
  <Flex
    style={{
      width: width,
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignContent: "flex-start"
    }}
  >
    <Flex.Item style={{alignItems: 'center',justifyContent: 'center'}}>
      <Image
        source={require("../../images/bank/icon.png")}
        resizeMode="stretch"
        style={{width: 180,height:100}}
      />
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center",
          marginTop: 15,
        }}
      >
       ไม่มีข้อมูลบัญชีธนาคาร 
        {/* 无银行卡数据 */}
      </Text>
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          fontWeight: "bold",
          textAlign: "center"
        }}
      >
        กรุณาเพิ่มบัญชีธนาคารก่อน
        {/* 请先添加银行卡 */}
      </Text>
    </Flex.Item>
  </Flex>
);

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    color: "#fff"
  },
  banksBoxView: {
    flex: 1,
    padding: 14
  },

  bankBoxView: {
    backgroundColor: "#06AD90",
    color: "#fff",
    borderRadius: 1,
    marginTop: 20,
    paddingTop: 15,
    paddingLeft: 15,
    paddingBottom: 15,
    borderRadius:8,
  },
  defaultBoxView:{
    // borderColor: "#0E7F00",
  // borderWidth:2
  borderRadius:8,
	backgroundColor: '#D55055',
  },
  bankName: {
    fontSize: 20,
    color: "#fff",
    paddingTop: 5,
	paddingBottom: 10,
  },
  numberFlex: {
    flex: 1,
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10
  },
  accountNumber: {
    color: "#fff",
	fontWeight:'bold',
	fontSize: 17,
  },
  removeBtn: {
    backgroundColor: "#212121",
    color: "#fff",
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    marginRight:5
  },
  rmbtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    padding: 3
  },
  addressFlex: {
    flex: 1,
    justifyContent: "space-between"
  },

  address: {
    flex: 3,
    color: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginRight: 10,
    overflow: "hidden"
  },
  holderName: {
    color: "#fff",
    fontSize: 14,
    paddingRight: 10,
    lineHeight: 18
  },
  province: {
    color: "#fff",
    fontSize: 12
  },
  city: {
    color: "#fff",
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 12
  },
  branch: {
    color: "#fff",
    fontSize: 12
  },
  defAccount:{
    backgroundColor: "#212121",
    color: "#fff",
    borderRadius: 5,
    padding: 5,
    marginRight:5
  },
  defaultAccount: {
    backgroundColor: "#212121",
    color: "#fff",
    borderRadius: 5,
    padding: 5,
    marginRight:5
  },

  defbtnText: {
    color: "#fff",
    textAlign: "center",
	fontSize: 12,
	padding: 3,
  },
  addBankBtn: {
    bottom:50,
    width: "80%",
    padding: 15,
	// backgroundColor: "#2D2D2D"
	borderWidth: 1,
	borderColor: '#01e530',
	borderRadius: 5,
  },
  BankTab: {
	  display: 'flex',
	  justifyContent: 'space-around',
	  alignItems: 'center',
	  flexDirection: 'row',
	  padding: 14,
	},
	BankTabItem: {
		width: '49%',
		borderBottomWidth: 2,
	},
	BankTabItemView: {
		display:'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	BankTabTxt: {
		color: '#fff',
		lineHeight: 40,
		textAlign: 'center',
		fontSize: 14,
	},
    
    titleBox:{
      marginTop: 20
    },
    conterBg:{
    },
    buttonTitle:{
      paddingVertical: 17,
      paddingLeft: 17,
      paddingRight: 14.5,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center'
    },
    thWrap: {
      paddingVertical: 13, 
      color: '#999999', 
      textAlign: 'center',
      borderColor: '#000', 
      borderWidth: 1,
      fontSize: 12
    }
});

 
