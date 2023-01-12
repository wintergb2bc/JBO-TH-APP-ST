import React from 'react';
import { StyleSheet, WebView, Text, View, Animated, TouchableOpacity, Dimensions,Clipboard,PermissionsAndroid,Alert,Linking,CameraRoll, Image, Platform, TextInput,ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';


const {
    width, height
} = Dimensions.get('window')


class UserTerms extends React.Component {

    render() {

        return (
            <View style={{felx:1,height:height,backgroundColor:'#0a0a0a',padding: 20}}>
                <ScrollView
					automaticallyAdjustContentInsets={false}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
                {/* {
                    this.props.TermsType == 'user' &&
                    <Text style={{color:'#fff',fontSize:14,lineHeight:23}}>
                            本条款为竞博平台用户规则条款，请会员进入本平台前务必详阅各项规则。若会员进入本平台，将视为已经接受本平台一切规定。
                    </Text>
                } */}
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>1.</Text>
                    <Text style={styles.txts}>
                    หากทำตามเงื่อนไขของโปรโมชั่นครบถ้วน ก็สามารถสมัครโปรโมชั่นอื่น ๆ ได้ เมื่อสมัครโปรโมชั่นอื่นต้องเป็นไปตามข้อกำหนดโปรโมชั่นที่เกี่ยวข้อง
                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>2.</Text>
                    <Text style={styles.txts}>
                    ชื่อที่ลงทะเบียนเป็นสมาชิกของ JBO จะต้องตรงกับชื่อบัญชีของธนาคารที่ถอนเงิน ในกรณีที่มีการละเมิด JBO ขอสงวนสิทธิ์ในการปฏิเสธการสมัครรับโบนัสและยกเลิกโบนัสและผลกำไรที่ได้รับไปแล้ว
                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>3.</Text>
                    <Text style={styles.txts}>
                    ทุกข้อเสนอถูกจำกัดสำหรับ 1 ท่าน , ครอบครัว , ที่อยู่ , อีเมล , เบอร์โทรศัพท์ , บัญชีธนาคารและ IP แอดเดรสเดียวเท่านั้น

                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>4.</Text>
                    <Text style={styles.txts}>
                    ปรโมชั่นนี้มีวัตถุประสงค์เพื่อความบันเทิงของผู้เล่นเท่านั้น ผู้ใช้ที่มีสิทธิ์เข้าร่วมโปรโมชั่นใด ๆ จะต้องปฏิบัติตามกฎและการตัดสินใจของ JBO หากพบว่าสมาชิกเป็นนักพนันมืออาชีพหรือผู้เล่นที่แสวงหาโบนัสเท่านั้น JBO ขอสงวนสิทธิ์ในการยกเลิกโบนัส
                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>5.</Text>
                    <Text style={styles.txts}>
                    JBO ขอสงวนสิทธิ์ในการแก้ไขยกเลิกข้อเสนอ และสิทธิ์ในการเปลี่ยนแปลงกิจกรรมนี้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า หรือแจ้งให้สมาชิกทราบและทำการเปลี่ยนแปลงทางอีเมล
                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>6.</Text>
                    <Text style={styles.txts}>
                    หากโปรโมชั่นนี้เกิดจากความผิดพลาดทางเทคนิคที่อยู่นอกเหนือการควบคุม เว็บไซต์ JBO จะไม่รับผิดชอบใด ๆ
                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>7.</Text>
                    <Text style={styles.txts}>
                    JBO มีสิทธิ์ยกเลิกโบนัสของสมาชิกที่ใช้พฤติกรรมที่น่าสงสัยว่าเป็นการฉ้อโกงในการพนัน
                    </Text>
               </View>
               <View style={styles.txtL}>
                    <Text style={styles.txts1}>8.</Text>
                    <Text style={styles.txts}>
                    การฝากเงินครั้งแรกและโบนัสเติมเงินทั้งหมดจะต้องได้รับการเคลมภายใน 90 วันหลังจากการขอรับสำเร็จแล้ว มิฉะนั้นโบนัสจะหมดอายุและไม่สามาถใช้ได้
                    </Text>
               </View>
               <View style={[styles.txtL]}>
                    <Text style={styles.txts1}>9.</Text>
                    <Text style={styles.txts}>
                    โบนัสจะต้องหมุนเวียน 1 เท่าก่อนจึงจะสามารถถอนได้
                    </Text>
               </View>

               <View style={[styles.txtL,{paddingBottom:100}]}>
                    <Text style={styles.txts1}>10.</Text>
                    <Text style={styles.txts}>
                    รางวัลที่แจกจะถูกหักโดยอัตโนมัติหากไม่ได้ใช้ภายในระยะเวลาที่กำหนดเครดิตฟรี และโบนัสทั้งหมดมีอายุ 30 วัน
                    </Text>
               </View>

               </ScrollView>
            </View>		

        )
    }
}


export default (UserTerms);



const styles = StyleSheet.create({
    txtL:{
        display:'flex',flexDirection:'row'
    },
    txts1:{
        color:'#ededed',
        fontSize:13,
        lineHeight:23,
        flex:0.06
    },
    txts:{
        color:'#ededed',
        fontSize:13,
        lineHeight:23,
        flex:0.94
    }
});