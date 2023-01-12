import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, Image, ImageBackground } from 'react-native'
import { VipDetailsInforLogout,VipDetailsInforLogout2,VipDetailsInforLogout3 } from './VipData'
const BaseWidth = .2
const BaseHeight = 36
const { width } = Dimensions.get('window')
const VipDetailsInforLogoutImg = [
    require('./../../../images/user/vip/vipdetaillogout1.png'),
    require('./../../../images/user/vip/vipdetaillogout2.png'),
    require('./../../../images/user/vip/vipdetaillogout3.png'),
    require('./../../../images/user/vip/vipdetaillogout4.png'),
    require('./../../../images/user/vip/vipdetaillogout5.png'),
]
export default class VipLogoutDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { vipIndex } = this.props
        return <View style={styles.viewContainer}>
           <ImageBackground source={require('./../../../images/user/vip/viptitleBg.png')} resizeMode='stretch' style={styles.questionTitleBox}>
           {/* VIP 专属再存红利比例 */}
                <Text style={styles.questionTitle}>อัตราส่วนโบนัสฝากอีกครั้ง พิเศษสำหรับ VIP</Text>
            </ImageBackground>
            <View>
            {
                    VipDetailsInforLogout.map((v1, i1) => {
                        return <View 
                            key={i1}
                            style={[
                                {
                                    height: i1 === 0 ? 80 : BaseHeight,
                                    flexDirection: 'row'
                                }
                            ]}>
 
                            {
                                v1.map((v2, i2) => {
                                    let flag = vipIndex * 1 === i1 - 1
                                    return <View key={i2} style={[
                                        {
                                            width: (width) / (!flag && v1.length),
                                            //flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: flag ? '#A8A8A8' : (i1 % 2 ? '#222222' : '#222222'),
                                            borderBottomWidth: i1 === VipDetailsInforLogout.length - 1 ? 1 : 0,
                                            borderTopWidth: 1,
                                            borderColor: '#444444',
                                            borderRightWidth: v1.length - 1 === i2 ? 0 : 1,
                                            borderRightColor: flag ? '#A8A8A8' : '#444444',
                                            borderBottomColor: flag ? '#444444' : '#444444',
                                           
                                        }
                                    ]}>
                                        {  i1 === 0 && <View style={styles.imgCircle}>
                                                <Image source={VipDetailsInforLogoutImg[i2]} style={[styles.detailImg, styles[`detailImg${i2}`]]} resizeMode='stretch' ></Image>
                                            </View>
                                        }
                                         
                                        {v2.search(/VIP/i) != 0 && 
                                            <Text style={[styles.vipInforText, { color: flag ? '#332811' : (i1 === 0 ? '#FFC758' : '#CCCCCC')}]}>{v2}</Text>
                                        }
                                        </View>
                                })
                            }
                        </View>
                    })
                }


                         <ImageBackground source={require('./../../../images/user/vip/vipmenubg.png')} style={styles.vipmenubg}>
                                                          <Text style={{paddingLeft:10}}>VIP 1</Text>
                                            </ImageBackground>

              <ImageBackground source={require('./../../../images/user/vip/vipmenubg2.png')} style={styles.vipmenubg2}>
                {
                    VipDetailsInforLogout2.map((v1, i1) => {
                        return <View 
                            key={i1}
                            style={[
                                {
                                    height: BaseHeight,
                                    flexDirection: 'row'
                                }
                            ]}>
 
                            {
                                v1.map((v2, i2) => {
                                    let flag = vipIndex * 1 === i1 - 1
                                    return <View key={i2} style={[
                                        {
                                            width: (width) / (v1.length),
                                            //flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',  
                                            // borderTopWidth: 1,
                                            // borderColor: '#444444',
                                            // borderRightWidth: v1.length - 1 === i2 ? 0 : 1,
                                            // borderRightColor: '#444444',
                                            // borderBottomColor: '#444444',
                                           
                                        }
                                    ]}> 
                                        {v2.search(/VIP/i) != 0 && 
                                            <Text style={[styles.vipInforText, { color: '#332811'}]}>{v2}</Text>
                                        }
                                        </View>
                                })
                            }
                        </View>
                    })
                }
                </ImageBackground>

                {
                    VipDetailsInforLogout3.map((v1, i1) => {
                        return <View 
                            key={i1}
                            style={[
                                {
                                    height: i1 === 0 ? BaseHeight : BaseHeight,
                                    flexDirection: 'row'
                                }
                            ]}>
 
                            {
                                v1.map((v2, i2) => {
                                    let flag = vipIndex * 1 === i1 - 1
                                    return <View key={i2} style={[
                                        {
                                            width: (width) /v1.length,
                                            //flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#222222',
                                            borderBottomWidth: i1 === VipDetailsInforLogout.length - 1 ? 1 : 0,
                                            borderTopWidth: 1,
                                            borderColor: '#444444',
                                            borderRightWidth: v1.length - 1 === i2 ? 0 : 1,
                                            borderRightColor: flag ? '#444444' : '#444444',
                                            borderBottomColor: flag ? '#444444' : '#444444',
                                           
                                        }
                                    ]}>
                                      
                                        
                                        {v2.search(/VIP/i) == 0 && 
                                            <ImageBackground source={require('./../../../images/user/vip/vipmenubg.png')} style={styles.vipmenubg}>
                                                          <Text style={{paddingLeft:10}}>{v2}</Text>
                                            </ImageBackground>
                                        }
  
                                        {v2.search(/VIP/i) != 0 && 
                                            <Text style={[styles.vipInforText, { color:'#CCCCCC'}]}>{v2}</Text>
                                        }
                                        </View>
                                })
                            }
                        </View>
                    })
                }

            </View>
             
        </View>
    }
}

const styles = StyleSheet.create({
    imgCircle: {
        width: 36,
        height: 36,
        borderRadius: 100,
        backgroundColor: '#F6DEAC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4
    },
    detailImg: {
        width: 24,
        height: 24
    },
    detailImg4: {
        height: 16
    },
    viewContainer: {
        backgroundColor: '#0A0A0A',
        //flex: 1,
        marginLeft: -10,
        marginRight: -10,
        width
    },
    questionTitleBox: {
        width,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    vipmenubg:{
        width,
        height: 35,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    vipmenubg2:{
        width,
        height: 140,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    questionTitle: {
        color: '#E2C795',
        textAlign: 'center',
        //fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 10
    },
    vipContainerRow: {
        flexDirection: 'row',
        overflow: 'hidden'
    },
    vipInforText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 11
    },
    vipContainerRowView: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    vipContainerTop: {
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    vipContainerBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#444'
    },
    vipContainerRight: {
        borderRightWidth: 1,
        borderRightColor: '#444'
    },
    vipContainerBg1: {
        backgroundColor: '#333333'
    },
    vipContainerBg0: {
        backgroundColor: '#2C2C2C'
    },
    vipDetailsTextInforContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 30,
        marginBottom: 80
    },
    vipDetailsTitleInfor: {
        color: '#fff',
        fontSize: 15,
        marginTop: 20,
        marginBottom: 4
    },
    vipDetailsTextInfor: {
        color: '#fff',
        lineHeight: 26
    }
})