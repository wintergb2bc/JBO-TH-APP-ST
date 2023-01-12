import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Platform, ScrollView,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import {
    List,
} from "antd-mobile-rn";
import {connect} from 'react-redux'

import DeviceInfo from 'react-native-device-info'

let iphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE']
const getModel = DeviceInfo.getModel()
let isIphoneX = Platform.OS === 'ios' && !iphoneXMax.some(v => v == getModel)

const Item = List.Item;
import HelpData from "./HelpData";

class HelpCenter extends React.Component {
    constructor(props) {
        super(props);
    }

    onListClick = (item, title) => {
        Actions.HelpDetail({data: item, detailTitle: title})
    }

    render() {
        return (
            <ScrollView style={[styles.viewContainer]}>
                <List styles={{borderWidth: 0}}>
                    {
                        HelpData.map(item => (
                            <Item style={{backgroundColor: '#000'}} arrow="horizontal"
                                  key={item.title} onClick={() => {
                                this.onListClick(item, item.title);
                            }}>
                                <Text style={{color: '#F5F5F5', paddingVertical: 9}}>{item.title}</Text>
                            </Item>
                        ))
                    }
                </List>
            </ScrollView>


        )
    }
}

export default HelpCenter = connect(
    (state) => {
        return {
            // vipInforData: state.vipInforData
        }
    }, (dispatch) => {
        return {
            // getVipInforAction: () => dispatch(getVipInforAction())
        }
    }
)(HelpCenter)


const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000000'
    }
})
