import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View } from "react-native";
import PropTypes from 'prop-types';


//验证码输入框插件
export default class VerificationCodeInput extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isFocused: true,
            isFocusedIndex: 0,
            textString: ''
        }
    }

    /**
     * 默认value
     */
    static defaultProps = {
        inputSize: 6
    };


    static propTypes = {
        inputSize: PropTypes.number
    };

    /**
     *   初始化 text
     * @param callback
     * @returns {Array}
     */
    renderText(callback) {
        console.log(this.state)

        let inputs = [];
        for (let i = 0; i < this.props.inputSize; i++) {
            inputs.push(
                <Text style={[styles.text,
                this.state.textString.length === i ? styles.focusText : null]}>
                    {this.state.textString[i]}
                </Text>
            )
        }

        return inputs
    }

    render() {
        return (
            <View style={[styles.viewBox]}>

                <View>

                    {/**text*/}
                    <View style={[styles.textBox, { flexDirection: 'row', justifyContent: 'center', }]}>
                        {this.renderText()}
                    </View>


                    {/**input*/}
                    <TextInput
                        value={this.state.textString}
                        style={styles.intextInputStyle}
                        onChangeText={(text) => {
                            let value = text.replace(/[^0-9]/g, "");
                            this.setState({
                                textString: value,
                            });
                            this.props.TextInputChange(value)
                        }}
                        underlineColorAndroid="transparent"
                        maxLength={this.props.inputSize}
                        autoFocus={false}
                        caretHidden={true}
                        keyboardType="numeric"
                        selectionColor="transparent"
                    />
                </View>
            </View>
        )
    }


}

const styles = StyleSheet.create({

    viewBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBox: {
        position: 'absolute',
        left: 20,
        right: 36,
    },
    text: {
        height: 50,
        width: 50,
        lineHeight: 50,
        borderWidth: 1,
        borderColor: '#717171',
        color: '#F5F5F5',
        fontSize: 24,
        marginLeft: 9,
        borderRadius: 3,
        textAlign: 'center'
    },
    focusText: {
        borderColor: '#a8a8a8',
    },
    inputItem: {
        lineHeight: 20,
        width: 80,
        textAlign: 'center',
        height: 40,
    },
    intextInputStyle: {
        width: 400,
        height: 40,
        fontSize: 25,
        color: 'transparent',
    },
});
