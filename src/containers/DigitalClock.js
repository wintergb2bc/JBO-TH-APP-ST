import React, {Component} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import moment from "moment-timezone";
import {VendorConfigs} from "./lib/vendor/data/VendorConsts";

export default class DigitalClock extends Component {

    constructor() {
        super();

        this.state = {
            currentTime: "",
            currentDay: null
        }
        this.daysArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    }

    componentWillMount() {
        this.getCurrentTime();
    }
    
    getCurrentTime = () => {
        switch (this.props.type) {
            case 1:
                // 05/04/2021 12:46 PM
                this.setState({
                    currentTime: `${moment.tz("Asia/Taipei").format('YYYY/MM/DD hh:mm:ss A')} (GMT +8)`
                });
                break
            case 2:
                // 2021/10/01 14:14:14
                this.setState({
                    currentTime: `อัปเดตล่าสุด: ${moment.tz("Asia/Taipei").format('YYYY/MM/DD HH:mm:ss')}`
                });
                break
            default:
                this.setState({
                    currentTime: moment.tz("Asia/Taipei").format('YYYY/MM/DD HH:mm:ss')
                });
        }
        // 週
        // this.daysArray.map((item, key) => {
        //     if (key == new Date().getDay()) {
        //         this.setState({currentDay: item.toUpperCase()});
        //     }
        // })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.getCurrentTime();
        }, 1000);
    }

    render() {
        return (
            <View>
                <Text style={this.props.style? this.props.style:styles.timeText}>
                    {this.state.currentTime}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create(
    {
        timeText: {
            fontSize: 14,
            color: '#CCCCCC'
        }
    });
