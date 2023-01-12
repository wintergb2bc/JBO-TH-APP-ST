import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Image, Platform, StyleSheet, Text, View} from "react-native";
import Touch from "react-native-touch-once";
import {Actions} from "react-native-router-flux";
import styles from './bankStyle';

const {width} = Dimensions.get('window')
let TimeV1;
class CountdownPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TimeLoad: this.TimeFormatVerification(this.props.time) ? this.props.time : "10:00"
        }
    }

    componentDidMount() {
        this.TimeDown()
    }

    componentWillUnmount() {
        TimeV1 && clearInterval(TimeV1);
        clearInterval(this.TimeDown);
    }

    TimeFormatVerification(time) {
        if (time.indexOf(":") === -1) {
            console.log("格式不正確 缺少分號，請輸入正確時間格式，如：10:00")
            return false;
        }

        let timeArray = time.split(":").filter(n => n);

        if (timeArray.length !== 2) {
            console.log("格式不正確，請輸入正確時間格式，如：10:00")
            return false;
        }

        let m = Number(timeArray[0]);
        let s = Number(timeArray[1]);

        if (isNaN(m) || isNaN(s)) {
            console.log("格式不正確，請輸入正確時間格式，如：10:00")
            return false;
        }

        return true
    }


    TimeDown = () => {
        const {TimeLoad} = this.state
        let m = parseInt(TimeLoad.split(":")[0]); //分
        let s = parseInt(TimeLoad.split(":")[1]); //秒   
        TimeV1 = setInterval(() => {
            let Sdb = (s < 10) ? "0" + s : s;
            this.setState({
                TimeLoad: m + ":" + Sdb
            });
            if (m == 0 && s == 0) {                
                clearInterval(TimeV1);
                Actions.deposit();
            } else if (m >= 0) {
                if (s > 0) {
                    s--;
                } else if (s == 0) {
                    m--;
                    s = 59;
                }
            }
        }, 1000);
    }

    goRecords = () => {

        // Actions.deposit();
        // setTimeout(() => {
        //     reloadPage("records");
        // }, 100);

        //判斷進入倒計時畫面的跳轉紀錄頁面,為新會員或舊會員
        let newRegist = global.localStorage.getItem("newRegist");       
        if(newRegist==true){
            console.log('register====')
            clearInterval(TimeV1);
            Actions.jump("recordsNx");
            setTimeout(() => {
                reloadPage("records");
            }, 100);
        } else {
             console.log('old member====')
             clearInterval(TimeV1);
             Actions.jump("deposit");
             setTimeout(() => {
                 reloadPage("records");
            }, 100);
        }
       
        // clearInterval(TimeV1)       
        // Actions.deposit();    
        // setTimeout(() => {
        //     reloadPage("records");
        // }, 100);
    }

    render() {
        const {TimeLoad} = this.state
        console.log(TimeLoad)
        return (
            <View style={{
                flex: 1,
                backgroundColor: "#1A1A1A",
                borderBottomColor: '#3D3D3D',
                borderBottomWidth: 1,
                paddingBottom: 12,
                paddingLeft: 15,
                paddingRight: 15
            }}>
                <View style={{paddingTop: 45, justifyContent: 'center', alignItems: 'center'}}>
                    <Image resizeMode='stretch'
                           style={{width: 80, height: 80}}
                           source={require("../../images/timeLoad.png")}/>

                    <Text style={{
                        color: '#F5F5F5',
                        fontSize: 18,
                        marginTop: 30
                    }}>ส่งรายการฝากสำเร็จ</Text>
                    <Text style={{
                        color: '#00B324',
                        fontSize: 30,
                        marginVertical: 14
                    }}>{TimeLoad}</Text>
                    <Text style={{color: '#CCCCCC', fontSize: 14, marginBottom: 40, textAlign:"center"}}>
                        เนื่องด้วยขณะนี้มีผู้เข้าใช้บริการจำนวนมาก {'\n'} จึงอาจทำให้รายการฝากของท่านล่าช้า
                    </Text>
                    <View style={{padding: 15, paddingBottom: 25}}>
                        <View style={styles.DSPayButtonBHoves}>
                            <Touch onPress={this.goRecords} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                                   style={{width: width - 30}}>
                                <Text style={{
                                    color: "#fff",
                                    fontSize: 16,
                                    lineHeight: 48,
                                    //fontWeight: 'bold',
                                    textAlign: 'center',
                                    paddingTop: 3
                                }}>ประวัติ</Text>
                            </Touch>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default CountdownPage;
