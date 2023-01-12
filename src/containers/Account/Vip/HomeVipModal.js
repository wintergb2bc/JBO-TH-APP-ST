import React from 'react'
import { View, Modal, Image, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import DeviceInfo from 'react-native-device-info'
const { width, height } = Dimensions.get('window')

export default class HomeVipModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isIphoneX: false
        }
    }
    componentDidMount() {
        let iphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE']
        this.setState({
            isIphoneX: iphoneXMax.includes(DeviceInfo.getModel())
        })
    }
    hideHomeModal() {
        this.props.changeHomeVipModal(false)
    }
    render() {
        const { isIphoneX } = this.state
        return <Modal
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={() => { }}
        >
            <TouchableOpacity style={styles.vipModalContainer} onPress={this.hideHomeModal.bind(this)}>
                <View style={styles.homeModalTop}>
                    <View style={styles.homeModalTopPos}>
                        <Text style={styles.homeModalVipText}>您的VIP专属优惠{'\n'}晋级奖励, 红利等{'\n'}点击这里查看</Text>
                        <View style={styles.homeVipModalBtn}>
                            <Text style={styles.homeVipModalBtText}>รับทราบ</Text>
                        </View>
                    </View>
                    <Image resizeMode="stretch" source={require('./../../../images/user/vip/dotted_down_arrow.png')} style={styles.homeVipModalImg}></Image>
                </View>
                <View style={[styles.homeModalVipBottom, { bottom: isIphoneX ? 0 : 35 }]}>
                    <Image resizeMode="stretch" source={require('./../../../images/menu07Hove.png')} style={[styles.homeModalVipBottomImg]}></Image>
                    <Text style={styles.homeModalVipBottomText}>VIP中心</Text>
                </View>
                <View style={[styles.homeModalVipBottomCircle, { bottom: isIphoneX ? 0 : 30 }]}></View>
            </TouchableOpacity>
        </Modal>
    }
}

const styles = StyleSheet.create({
    vipModalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .8)'
    },
    homeModalVipText: {
        color: '#00E62E',
        fontSize: 15,
        lineHeight: 20
    },
    homeModalTopPos: {
        marginLeft: -width * .3
    },
    homeModalTop: {
        position: 'absolute',
        bottom: 110,
        left: width * .56,
    },
    homeVipModalBtn: {
        backgroundColor: 'transparent',
        borderColor: '#00E62E',
        borderWidth: 1,
        borderRadius: 4,
        width: 120,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 25,
        marginBottom: 10
    },
    homeVipModalBtText: {
        color: '#00E62E',
        fontSize: 14,
        textAlign: 'center'
    },
    homeVipModalImg: {
        width: 70,
        height: 80,
    },
    homeModalVipBottom: {
        flex: 1,
        height: 57,
        position: 'absolute',
        left: width * .64,
        alignItems: 'center',
        justifyContent: 'center'
    },
    homeModalVipBottomCircle: {
        borderWidth: 2,
        borderRadius: 1000,
        borderColor: '#47eb2c',
        borderStyle: 'dashed',
        width: 60,
        height: 60,
        position: 'absolute',
        left: width * .621,
    },
    homeModalVipBottomImg: {
        width: 22,
        height: 22
    },
    homeModalVipBottomText: {
        marginTop: 5,
        textAlign: "center",
        color: '#47eb2c',
        fontSize: 15,
        fontWeight: '900',
        fontSize: 12,
    }
})
