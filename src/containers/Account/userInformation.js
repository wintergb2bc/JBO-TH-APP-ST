import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import { InputItem, Toast } from 'antd-mobile-rn';
import Touch from 'react-native-touch-once';
import { I18n, getLanguages } from '../../language/i18n'
const { width, height } = Dimensions.get('window')
import InputItemStyle from "antd-mobile-rn/lib/input-item/style/index.native";

const newStyle = {};
for (const key in InputItemStyle) {
  if (Object.prototype.hasOwnProperty.call(InputItemStyle, key)) {
    // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
    newStyle[key] = { ...StyleSheet.flatten(InputItemStyle[key]) };
    if (key === "input") {
      newStyle[key].color = "#9a9a9a";
      newStyle[key].textAlign = "right";
      newStyle[key].fontSize= 15
    }
	newStyle[key].borderBottomColor = '#3d3d3d';
  }
}
class UserInformation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }

    }

    render() {
      const {} = this.state;
        return (

            <View style={styles.rootContainer}>
                <View style={{paddingLeft:15}}>
                    <View style={styles.inputList}>
                        <Text style={{color:'#fff',width:90}}>真实姓名：</Text>
                        <TextInput
                            type="text" 
                            value={this.state.username}
                            placeholder='请输入'
                            placeholderTextColor="#868686"
                            onChangeText={this.handleUsername}
                            style={styles.inputStyle}
                        />
                    </View>
                    <View style={[styles.addBtn,{backgroundColor:''}]}>
                        <Touch onPress={() => {}}>
                            <Text style={{color:'#fff',}}>保存</Text>
                        </Touch>
                    </View>
                </View>
                <View style={{paddingLeft:15}}>
                    <View style={styles.inputList}>
                        <Text style={{color:'#fff',width:90}}>真实姓名：</Text>
                        <TextInput
                            type="text" 
                            value={this.state.username}
                            placeholder='请输入'
                            placeholderTextColor="#868686"
                            onChangeText={this.handleUsername}
                            style={styles.inputStyle}
                        />
                    </View>
                    <View style={styles.inputList}>
                        <Text style={{color:'#fff',width:90}}>真实姓名：</Text>
                        <TextInput
                            type="text" 
                            value={this.state.username}
                            placeholder='请输入'
                            placeholderTextColor="#868686"
                            onChangeText={this.handleUsername}
                            style={styles.inputStyle}
                        />
                    </View>
                </View>
            </View>


        );
    }
}
export default UserInformation;
const styles = StyleSheet.create({
    rootContainer: {
        flex:1,
        backgroundColor: "#0a0a0a",
    },
    inputList: {
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        height: 50,
        width:width -15,
        borderBottomColor:'#3e3e3e',
        flexDirection:'row',
        borderBottomWidth:1,
    },
    inputStyle: {
        width:width -120,
        borderWidth:0,
        color:'#fff',
        textAlign:'right',
        paddingRight:10,
    },
    addBtn:{

    },
});

