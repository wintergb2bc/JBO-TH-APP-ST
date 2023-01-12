{
    /* 點擊菜單的「更多」出現的下浮窗 列表頁 和 詳情頁 都有使用  */
}
import {
    StyleSheet,
    WebView,
    Text,
    View,
    Animated,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    ImageBackground,
    Platform,
    Modal,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
    ParallaxImage,
    Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";

export default class Skeleton extends React.Component {
    state = {
        isBottomSheetVisible: false
    };
    render() {
        let lists = [1, 2, 3, 4, 5, 6, 7, 8]
        return (
            <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
                {
                    !this.props.euroCup &&
                    <View style={styles.topList}>
                        <View style={{ width: 28, height: 28, borderRadius: 50, backgroundColor: '#3E3E3E', marginRight: 20 }} />
                        <View style={{ width: 130, height: 12, borderRadius: 50, backgroundColor: '#3E3E3E' }} />
                    </View>
                }

                {
                    lists.map((item) => {
                        return (
                            <View style={styles.listView} key={item}>
                                <View>
                                    <View style={styles.listLeft}>
                                        <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#3E3E3E', marginRight: 20 }} />
                                        <View style={{ width: 130, height: 12, borderRadius: 50, backgroundColor: '#3E3E3E' }} />
                                    </View>
                                    <View style={styles.listLeft}>
                                        <View style={{ width: 20, height: 20, borderRadius: 50, backgroundColor: '#3E3E3E', marginRight: 20 }} />
                                        <View style={{ width: 130, height: 12, borderRadius: 50, backgroundColor: '#3E3E3E' }} />
                                    </View>
                                </View>
                                <View style={styles.listRight}>
                                    <View style={styles.rightList} />
                                    <View style={styles.rightList} />
                                    <View style={styles.rightList} />
                                    <View style={styles.rightList} />
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }
}



const styles = StyleSheet.create({
    topList: {
        paddingLeft: 15,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: width,
        height: 50,
        backgroundColor: '#3E3E3E',
    },
    listView: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomColor: '#3E3E3E',
        borderBottomWidth: 1,
        width: width,
        paddingTop: 15,
        paddingBottom: 15,
    },
    listLeft: {
        paddingLeft: 15,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        width: width * 0.4,
        marginBottom: 15
    },
    listRight: {
        width: width * 0.5,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    rightList: {
        width: width * 0.2,
        height: 32,
        backgroundColor: '#3E3E3E',
        borderRadius: 5,
        marginBottom: 10
    }
})
