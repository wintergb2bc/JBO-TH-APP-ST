import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl,
  ImageBackground,
  Platform
} from "react-native";
import { Toast, Picker, List } from "antd-mobile-rn";
const cityReg = /^([a-zA-Z\u0e00-\u0e7f\s]{1,50})$/;
import PickerList from "antd-mobile-rn/lib/list/style/index.native";
const { width } = Dimensions.get("window");
const ContactDetailType = [
  {
    name:"เมือง", //"城市/省：",
    id: ""
  },
  {
    name: "ที่อยู่",//"地址：",
    id: ""
  }
];

const QQRegex = /^$|^[0-9]{4,15}$/;
const WCRegex = /^[a-zA-Z0-9@._-]*$/;
const newStyle = {};
for (const key in PickerList) {
  if (Object.prototype.hasOwnProperty.call(PickerList, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(PickerList[key]) };
    newStyle[key].backgroundColor = "transparent";
    newStyle[key].borderBottomColor = "#707070";
  }
}
export default class UserAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressDetails0: "",
      addressDetails1: "",
      countryList: [],
      countryValue: 0,
      inputCheckcity: true,
      inputCheckAddress: true
    };
  }

  componentDidMount() {
    this.getCountry();
  }

  changeInput(i, text) {
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
  getCountry() {
    fetchRequest(ApiPort.GetCountryList, "GET").then(res => {
      const country = [];
      console.log("Address", this.props.memberInfo.Address);
      let Address = this.props.memberInfo.Address;
      country.push(Address.NationId);
      this.state.countryList = res.result.map(function(item, key) {
        return { value: parseInt(item.id), label: item.chineseName };
      });
      this.setState({
        addressDetails0: Address.City,
        addressDetails1: Address.Address,
        countryValue: country
      });
    });
  }
  submitMember() {
    const {
      addressDetails0,
      addressDetails1,
      countryValue,
      countryList
    } = this.state;

    const params = {
      wallet: "MAIN",
      addresses: {
        address: addressDetails1,
        city: addressDetails0,
        nationId: countryValue[0]
      }
    };
    Toast.loading("โปรดรอสักครู่...", 2000);
    fetchRequest(ApiPort.PUTMemberlistAPI + "?", "PUT", params)
      .then(res => {
        Toast.hide();
        if (res.isSuccess) {
          Toast.success(res.result.Message, 2);
          this.props.getUser();
        } else {
          Toast.fail('การอัปเดตล้มเหลว',2)
          //Toast.fail("更新失败！", 2);
        }
      })
      .catch(err => {
        Toast.hide();
      });
  }
  render() {
    const {
      countryValue,
      addressDetails0,
      addressDetails1,
      countryList,
      inputCheckAddress,
      inputCheckcity
    } = this.state;
    let btnFlag = addressDetails0 && addressDetails1 && countryValue && inputCheckAddress && inputCheckcity;
    return (
      <View style={styles.viewContainer}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Picker
            cols={1}
            data={countryList}
            value={countryValue}
            onChange={value => {
              const data = [];
              data.push(parseInt(value[0]));
              this.setState({ countryValue: data });
            }}
            extra=" "
            locale={{
              okText: "ตกลง",
              dismissText: "ยกเลิก"
            }}
          >
            <List.Item styles={StyleSheet.create(newStyle)} arrow="horizontal">
              <Text style={{ color: "#CCCCCC" }}>ประเทศ：</Text>
            </List.Item>
          </Picker>
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
                      textAlign: "right",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center"
                    }}
                    placeholderTextColor={"#999999"}
                    value={this.state[`addressDetails${i}`]}
                    onChangeText={this.changeInput.bind(this, i)}
                  />
                </View>
              </View>
            );
          })}
          {console.log(this.state)}
          {!this.state.inputCheckcity && (
            <Text style={{ color: "red", marginLeft: 15 }}>
              โปรดกรอกจังหวัดที่ถูกต้อง
            </Text>
          )}
          {!this.state.inputCheckAddress && (
            <Text style={{ color: "red", marginLeft: 15 }}>
              โปรดกรอกที่อยู่ติดต่อได้ให้ถูกต้อง
            </Text>
          )}
          <TouchableOpacity
            style={[
              styles.ContactDetailsBoxBtn,
              { backgroundColor: btnFlag ? "#00B324" : "#757575" }
            ]}
            onPress={() => {
              btnFlag && this.submitMember();
            }}
          >
            <Text
              style={[
                styles.ContactDetailsBoxBtnText,
                { color: btnFlag ? "#fff" : "#CCCCCC" }
              ]}
            >
              บันทึก
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    //fontWeight: "bold"
  }
});
