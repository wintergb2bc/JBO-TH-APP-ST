import React from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { VipMainData } from './VipData'
const { width } = Dimensions.get('window')
const AnimatedImage = Animated.Image

export default class VipMain extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imgOpacity0: new Animated.Value(0),
            imgTranslateX0: new Animated.Value(width * .5),
            imgScale0: new Animated.Value(0),
            imgOpacity1: new Animated.Value(0),
            imgTranslateX1: new Animated.Value(width * .5),
            imgScale1: new Animated.Value(0),
        }
        this.setTimeoutRunAnimate = null
    }

    componentDidMount() {
        this.runAnimate(0)
        this.setTimeoutRunAnimate = setTimeout(() => {
            this.runAnimate(1)
        }, 900);
    }

    componentWillUnmount() {
        this.setTimeoutRunAnimate && clearTimeout(this.setTimeoutRunAnimate)
    }

    runAnimate(index) {
        Animated.timing(this.state[`imgOpacity${index}`], {
            toValue: 1,
            duration: 1000
        }).start()

        Animated.timing(this.state[`imgScale${index}`], {
            toValue: 1,
            duration: 1000
        }).start()

        Animated.timing(this.state[`imgTranslateX${index}`], {
            toValue: 0,
            duration: 800
        }).start()
    }

    goVipPage(router) {
        Actions[router]()
    }

    render() {
        return <View style={styles.viewContainer}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    VipMainData.map((v, i) => {
                        return <TouchableOpacity key={i} style={styles.vipMainBox} onPress={this.goVipPage.bind(this, v.router)}>
                            <View>
                                <Text style={styles.vipMainBoxTitle}>{v.title}</Text>
                                <Text style={styles.vipMainBoxText}>{v.text}</Text>
                            </View>
                            <AnimatedImage
                                source={v.img}
                                resizeMode='contain'
                                style={[
                                    styles[`vipMainImg${i}`],
                                    styles.vipMainImg,
                                    {
                                        opacity: this.state[`imgOpacity${i}`],
                                        transform: [
                                            { translateX: this.state[`imgTranslateX${i}`] },
                                            { scale: this.state[`imgScale${i}`] }
                                        ]
                                    }
                                ]} />
                        </TouchableOpacity>
                    })
                }
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#0A0A0A',
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    vipMainBox: {
        backgroundColor: '#1f1f1f',
        marginBottom: 10,
        height: 80,
        paddingLeft: 20,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
    },
    vipMainBoxTitle: {
        color: '#CCCCCC',
        fontWeight: 'bold',
        fontSize: 16
    },
    vipMainBoxText: {
        color: '#CCCCCC',
        marginTop: 5,
        fontSize: 13
    },
    vipMainImg0: {
        width: width * .5
    },
    vipMainImg1: {
        width: width * .45
    },
    vipMainImg: {
        position: 'absolute',
        right: 0,
        height: 80
    }
})