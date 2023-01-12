import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native'
import {List, Flex, Tabs, WingBlank} from "antd-mobile-rn";
import {connect} from 'react-redux'
import DeviceInfo from 'react-native-device-info'

let iphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE']
const getModel = DeviceInfo.getModel()
let isIphoneX = Platform.OS === 'ios' && !iphoneXMax.some(v => v == getModel)
const {width, height} = Dimensions.get("window");

class HelpDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {data} = this.props.data;
        const title = this.props.detailTitle;
        return (
            <View style={[styles.viewContainer]}>
                <View style={{marginTop: 24, paddingLeft: 26}}>
                    <Flex styles={styles.subTitleBox}>
                        <View style={styles.sectionTitleBorder}/>
                        <Text style={{color: '#00E62E', marginLeft: 10}}>{title}</Text>
                    </Flex>
                </View>
                {data.map(data => {
                    return (
                        <View>
                            <ScrollView>
                                <WingBlank>
                                    <View style={styles.sectionBox}>
                                        {data.subData &&
                                        data.subData.map((section, index) => {
                                            return <Section data={section} index={index} key={section.sectionTitle}/>;
                                        })}
                                    </View>
                                </WingBlank>
                            </ScrollView>
                        </View>
                    );
                })}
            </View>


        )
    }
}

const Section = ({data, index}) => {
    console.log(index)
    return (
        <View style={index == 0 ? styles.section : styles.sectionSec}>

            {data.sectionTitle ? (<Flex styles={styles.sectionTitleBox}>
                <View style={styles.sectionTitleBorder}/>
                <View>
                    <Text style={styles.sectionTitle}>{data.sectionTitle}</Text>
                </View>
            </Flex>) : null}
            {data.desc ? <Text style={styles.desc}>{data.desc}</Text> : null}
        </View>
    );
};

export default HelpDetail = connect(
    (state) => {
        return {
            // vipInforData: state.vipInforData
        }
    }, (dispatch) => {
        return {
            // getVipInforAction: () => dispatch(getVipInforAction())
        }
    }
)(HelpDetail)


const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000000'
    },

    sectionBox: {
        paddingTop: 10,
        paddingBottom: 10
    },
    section: {
        flex: 1,
        // paddingBottom: 20
    },
    sectionSec: {
        flex: 1,
        marginTop: 20
        // paddingBottom: 20
    },
    desc: {
        paddingHorizontal: 18,
        fontSize: 14,
        lineHeight: 24,
        color: '#fff'
    },
    subTitleBox: {
        marginTop: 100,
        width: width,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
    },
    subTitle: {
        flex: 4,
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        paddingLeft: 10,
        marginTop: 50
    },
    sectionTitleBox: {
        // display: "flex",
        marginTop: 20,
        width: width,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'left'
    },
    sectionTitleBorder: {
        width: 10,
        height: 10,
        backgroundColor: "#00E62E",
        borderRadius: 10 / 2,
    },
    sectionTitle: {
        flex: 4,
        color: "#fff",
        //fontWeight: "bold",
        fontSize: 16,
        paddingLeft: 10,
        // borderLeftWidth: 10,
        // borderColor: "#013625",
        // paddingLeft: 15
        // borderRadius: 5
    },
})

