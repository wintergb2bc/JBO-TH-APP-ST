import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Linking,
    Dimensions,
} from "react-native";
import {Actions} from "react-native-router-flux";
const {width, height} = Dimensions.get("window");

class ContactBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showContact: false
        }
    }

    render() {
        const {showContact} = this.state
        return (
            <View style={[styles.box]}>
                <TouchableOpacity onPress={this.props.close} style={styles.closeBtn}>
                    <Image
                        resizeMode="stretch"
                        style={{width: 8, height: 8}}
                        source={require('../images/contactIcon/close.png')}
                    />
                </TouchableOpacity>
                {!showContact && (
                    <TouchableOpacity onPress={() => {
                        this.setState({
                            showContact: true
                        })
                    }} style={{
                        marginTop: 15,
                        marginBottom: 7,
                        paddingHorizontal: 6,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            resizeMode="stretch"
                            style={{width: 18, height: 18, marginBottom: 3}}
                            source={require('../images/contactIcon/chat.png')}
                        />
                        <Image
                            resizeMode="stretch"
                            style={{width: 18, height: 81, marginBottom: 3}}
                            source={require('../images/contactIcon/text.png')}
                        />
                        <Image
                            resizeMode="stretch"
                            style={{width: 23, height: 16, marginBottom: 3}}
                            style={{width: 23, height: 16, marginBottom: 3}}
                            source={require('../images/contactIcon/arrow.png')}
                        />
                    </TouchableOpacity>
                )}
                {showContact && (
                    <>
                        <TouchableOpacity onPress={() => Actions.LiveChatST()} 
                                          style={[styles.contactIconWrap, {
                                              borderBottomColor: '#222222', 
                                              borderBottomWidth: 1
                        }]}>
                            <Image
                                resizeMode="stretch"
                                style={{width: 15, height: 15, marginBottom: 1}}
                                source={require('../images/contactIcon/liveChat.png')}
                            />
                            <Text style={styles.contactIconText}>แชทสด</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:cs@jbothailand.com')}
                                          style={[styles.contactIconWrap, {
                                              borderBottomColor: '#222222',
                                              borderBottomWidth: 1
                                          }]}>
                            <Image
                                resizeMode="stretch"
                                style={{width: 17, height: 15, marginBottom: 2}}
                                source={require('../images/contactIcon/mail.png')}
                            />
                            <Text style={styles.contactIconText}>อีเมล์</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://lin.ee/TZf5ya8')}
                                          style={[styles.contactIconWrap]}>
                            <Image
                                resizeMode="stretch"
                                style={{width: 15, height: 15, marginBottom: 3}}
                                source={require('../images/contactIcon/Line.png')}
                            />
                            <Text style={styles.contactIconText}>@jbothcs</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

        );
    }
}

ContactBox.propTypes = {};

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#000000',
        right: 0,
        top: width*1.15,
        position: 'absolute',
        zIndex: 99999999,
        borderBottomLeftRadius: 20,
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.9,
        shadowRadius: 10,
        shadowColor: "#00B3247F",
        elevation: 4,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeBtn: {
        backgroundColor: '#000',
        width: 18,
        height: 18,
        position: 'absolute',
        top: -2,
        left: -7,
        zIndex: 999999,
        borderRadius: 18 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    contactIconWrap: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    contactIconText: {
        color: '#999999',
        fontSize: 13,
    }
})

export default ContactBox;
