import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
} from "react-native";
import Touch from "react-native-touch-once";
import {Actions} from "react-native-router-flux";
import {login, logout} from "../../actions/AuthAction";
import {connect} from "react-redux";
const {width, height} = Dimensions.get('window')

class VerifyFail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    logout = () => {
        UMonEvent('Logout_exceeded_loginOTP');
        global.storage.remove({
            key: 'VerifyEmail',
            id: 'VerifyEmail'
        });
        global.storage.remove({
            key: 'VerifyPhone',
            id: 'VerifyPhone'
        });
        this.props.logout();
        setTimeout(()=>{
            Actions.logins();
        }, 200)
        setTimeout(()=>{Gologin = true }, 2000)
        key = 'login';
        return;
    }

    render() {
        return (
                <View style={{
                    paddingHorizontal: 20,
                    paddingTop: 50,
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: "#000000"
                }}>
                    <Image resizeMode='stretch' source={require('../../images/warnBlue.png')}
                           style={{width: 80, height: 80}}/>
                    <Text style={{color: '#F5F5F5', fontSize: 16, marginTop: 20, marginBottom: 16}}>
                        {/* 很抱歉，验证失败 */}
                        ยืนยันข้อมูลเกินกำหนด
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: '#CCCCCC',
                        //marginBottom: 10,
                        textAlign:"center"
                    }}>
                        {/* 验证失败已达 5 次，请联系在线客服以验证 */}
                        คุณทำการยืนยันข้อมูลเกิน 5 ครั้ง 
                    </Text>  
                    <Text style={{
                        fontSize: 14,
                        color: '#CCCCCC',
                        //marginBottom: 10,
                        textAlign:"center"
                    }}>
                        {/* 验证失败已达 5 次，请联系在线客服以验证 */}
                        กรุณาติดต่อฝ่ายบริการลูกค้าเพื่อรับการช่วยเหลือ 
                    </Text>  
                    <Text style={{
                        fontSize: 14,
                        color: '#CCCCCC',
                        //marginBottom: 10,
                        textAlign:"center"
                    }}>
                        {/* 验证失败已达 5 次，请联系在线客服以验证 */}
                        หรือยืนยันอีกครั้งหลัง 24 ชั่วโมง
                    </Text>                  
                    <Touch style={[styles.addBtn, {width: '100%'}]}
                           onPress={() => {
                                UMonEvent("CS", "Click", "CS_Exceeded_ResetPW");
                               Actions.LiveChatST()
                           }}>

                        <View style={{
                            flexDirection: 'row', justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Image resizeMode='stretch' source={require('../../images/cs_white.png')}
                                   style={{width: 24, height: 24, marginRight: 10}}/>
                            <Text style={{
                                color: '#F5F5F5',
                                textAlign: 'center',
                                paddingVertical: 13,
                                fontSize: 16
                            }}>
                                {/* 联系在线客服 */}
                                ติดต่อฝ่ายบริการลูกค้า
                            </Text>
                        </View>
                    </Touch>
                    {/* <Touch style={{
                        width: '100%',
                        borderColor: '#00B324',
                        borderWidth: 1,
                        marginHorizontal: 16,
                        marginTop: 20,
                        borderRadius: 4
                    }} onPress={() => {
                        this.logout()
                    }}>
                        <Text style={{
                            color: '#00B324',
                            textAlign: 'center',
                            paddingVertical: 13,
                            fontSize: 16
                        }}>退出验证</Text>
                    </Touch> */}
                </View>
        )
    }
}

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = (dispatch) => ({
    login: (loginDetails) => {
        login(dispatch, loginDetails);
    },
    logout: (loginDetails) => {
        logout(dispatch, loginDetails);
    }
});
/**
 * deliberately not using mapDispatchToProps
 * notice how `logout` is being used
 */
export default connect(mapStateToProps,mapDispatchToProps)(VerifyFail);

const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: '#00B324',
        marginHorizontal: 16,
        borderRadius: 4,
        marginTop: 40
    }
})
