import Toast from 'react-native-tiny-toast'
import React from "react";

export const Toasts = {
    success: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
            containerStyle: { backgroundColor: '#daffe3', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
            textStyle: { color: '#34c759',  paddingLeft: 5, fontSize: 13 },
            imgSource: require('../images/icon-done.png'),
            imgStyle: { height: 18, width: 18 },
        })
    },
    successV2: (msg) => {
        Toast.show(msg || '', {
            position: 0,
            containerStyle: { backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 40, paddingVertical: 15 },
            textStyle: { color: '#333333',  paddingLeft: 10, fontSize: 16 },
            imgSource: require('../images/icon-done.png'),
            imgStyle: { height: 20, width: 20 },
        })
    },
    fail: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
            containerStyle: { backgroundColor: '#ffdada', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
            textStyle: { color: '#eb2121', paddingLeft: 5, fontSize: 13 },
            imgSource: require('../images/Error.png'),
            imgStyle: { height: 18, width: 18 },
        })
    },
    error: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
            containerStyle: { backgroundColor: '#ffdada', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
            textStyle: { color: '#eb2121',  paddingLeft: 5, fontSize: 13 },
            imgSource: require('../images/Error.png'),
            imgStyle: { height: 18, width: 18 },
        })
    },

    info: (msg) => {
        Toast.show(msg || '', {
            position: DeviceInfoIos? 45: 20,
        })
    },

}
