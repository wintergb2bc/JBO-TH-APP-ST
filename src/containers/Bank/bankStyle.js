
import { StyleSheet, Dimensions } from 'react-native';

const {
    width, height
} = Dimensions.get('window')


export default StyleSheet.create({
    heightA: {
        flex: 1
    },
    heightB: {
        height: 0
    },
    wrapper: {
        height: 200,
        backgroundColor: '#fff',
    },
    buttonB1: {
        textAlign: 'center',
        paddingTop: 7,
        paddingBottom: 7,
    },
    triangle:{
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#00B324",
        
        position: 'absolute',
        bottom: -13,
        left: 0
    },

    triangle2:{
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#00B324",

        position: 'absolute',
        top: -18,
        alignSelf: 'center',
    },


    buttonB: {
        textAlign: 'center',
        paddingTop: 7,
        paddingBottom: 7,
    },
    buttonB1Hover: {
        textAlign: 'center',
        paddingTop: 7,
        paddingBottom: 12,
        //borderTopColor: '#363636',
        //borderTopWidth: 1,
        backgroundColor: '#171717',
        borderBottomWidth: 2,
        borderBottomColor: '#19fe01',
    },
    buttonBHover: {
        textAlign: 'center',
        paddingTop: 7,
        paddingBottom: 12,
        //borderTopColor: '#363636',
        //borderTopWidth: 1,
        borderBottomWidth: 2,
        backgroundColor: '#171717',
        borderBottomColor: '#19fe01',
    },


    buttonBVHover: {
        textAlign: 'center',
        width:width-290,
        paddingBottom: 10,
        marginBottom:-10,
        //borderTopColor: '#363636',
        //borderTopWidth: 1,
        // backgroundColor: '#171717',
        borderBottomWidth: 3,
        borderBottomColor: '#19fe01',
    },



    buttonPay: {
        //borderRadius:18,
        width: 220,
        paddingTop: 10,
        paddingBottom: 14,
        padding: 10,
        //backgroundColor: '#00633c',
    },

    buttonPayPop: {
        marginTop: -50
    },

    popTtitleBg: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        backgroundColor: '#222222',
    },

    buttonbankCar: {
        // borderRadius: 12,
        marginTop: 10,
        width: '100%',
        padding: 10,
        backgroundColor: '#2D2D2D',
    },

    buttonbankCarS1: {
        borderRadius: 12,
        width: 100,
        padding: 7,
        backgroundColor: '#00633c',
    },
    buttonbankCar2: {
        borderRadius: 12,
        marginTop: 10,
        width: 130,
        padding: 7,
        backgroundColor: '#5e5e5e',
    },
    buttonPay2: {
        borderRadius: 14,
        marginTop: 5,
        marginRight: 10,
        paddingTop: 6,
        paddingBottom: 6,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#8a8a8a',
    },

    containerHorizontal: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    containerVertical: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
    },
    text: {
        color: '#fff',
        fontSize: 36,
    },
    image: {
        width,
        height: 200
    },
    warning: {
        height: 35,
        width: width,
        backgroundColor: '#013626',
    },
    warningT: {
        height: 30,
        marginTop: 10
    },
    warningText: {
        color: '#fff',

    },
    imgBackground: {
        width: width,
        height: 50,
    },
    gameBg0: {
        paddingTop: 15,
        paddingLeft: 15,
    },

    MoneyBg: {
        width: width,
        height: height / 4.3,
        bottom: 0,
        opacity: 0,
        backgroundColor: '#000',
        position: 'absolute',
    },

    AllMbutton: { //全餘額
        flex: 0.2,
        right: -10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 12,
        backgroundColor: '#013626',
    },
    AllMbutton2: { //全餘額
        flex: 0.2,
        right: -10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 12,
        backgroundColor: '#f9e3a1',
    },
    oneT: { //一鍵轉帳
        flex: 0.3,
        paddingTop: 5,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 5,
        borderRadius: 12,
        backgroundColor: '#013626',
    },
    oneT2: { //一鍵轉帳
        flex: 0.3,
        paddingTop: 5,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 5,
        borderRadius: 12,
    },
    records: {
        paddingLeft: 14,
        borderBottomWidth: 1,
        borderColor: '#363636',
        backgroundColor: "#171717",
    },

    recordTextL: {
        flex: 0.4,
        borderRightWidth: 1,
        borderColor: '#363636',
        paddingTop: 12,
        paddingLeft: 10,
        paddingBottom: 12,
    },

    recordTextR: {
        flex: 1,
        paddingTop: 12,
        paddingLeft: 14,
        paddingBottom: 12,
    },

    gameBg1: {
        paddingTop: 5,
        backgroundColor: "#171717",
    },
    gameBgT:{
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        backgroundColor: "#171717",
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius:10,
    },
    gameBgHoveS:{
        marginTop:10,
        marginLeft:10,
        marginRight:10,
        borderWidth: 1,
        borderColor: '#19ff00',
        borderRadius:10,
    },
    gameBgX1: {
        paddingTop: 5,
        backgroundColor:'#2a2a2a',marginLeft:10,marginRight:10,borderRadius:8

    },

    gameBg2: {
        backgroundColor: "#171717",
        padding: 12,
        borderTopWidth: 1,
        borderColor: '#fff'
    },

   bankBox: {
         backgroundColor: "#171717",
         flexWrap: 'wrap',
         display: 'flex',
         flexDirection: 'row',
         paddingLeft: 10,
         paddingRight: 10,
         paddingBottom: 10,
     },
     /* 新版ui 样式 */
    bankBox2: {
        backgroundColor: '#2a2a2a',
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 10,
        marginRight:10,
        marginTop:5,
        borderRadius: 10,
        padding: 10
    },
    bankBox2New: {
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    bankBox2New2: {
        flexWrap: 'wrap',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 0,
    },
    bankBox2NewWithdrawal: {
        flexWrap: 'wrap',
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#1a1a1a",
        marginTop: 20,
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 10
        // marginBottom: 10
    },
    imgHover: {
        position: 'absolute',
        top: 32,
        right: -3,

    },
    bankImg: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#959595',
        height: 45,
        width: 102,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 10,
        paddingBottom: 10,
        margin: 3,
        opacity: 0.4,
        borderRadius: 0,
    },

    bankImg3: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#959595',
        height: 50,
        width: 150,
        padding: 10,
        margin: 3,
        opacity: 0.4

    },
    bankImg2: {
        display: 'none'
    },

    bankImgHover: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#062d01',
        borderColor: '#005a36',
        width: 102,
        height: 45,
        padding: 10,
        margin: 3,
        borderRadius: 0,
    },


    bankImgLB: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#959595',
        height: 45,
        width: 102,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 10,
        paddingBottom: 10,
        margin: 3,
        opacity: 0.4,
        borderRadius: 0,
    },

    bankImgHoverLB: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#062d01',
        borderColor: '#005a36',
        width: 102,
        height: 45,
        padding: 10,
        margin: 3,
        borderRadius: 0,
    },

    bankImgHover2: {
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0E7F00',
        borderWidth: 1,
        borderColor: '#005a36',
        width: 150,
        height: 50,
        padding: 10,
        margin: 3,
    },


    bankImgX1New: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3d3d3d',
        width: width/3.5,
        borderRadius: 5,
        height: 48,
        marginBottom: 10,
    },
    bankImgHoverX1New: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00e62c',
        width: width/3.5,
        borderRadius: 5,
        height: 48,
        marginBottom: 10,
    },
    bankImgHoverX1New3: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width/5.2,
        marginBottom: 30,
    },
    bankImgX1New2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#757575',
        width: width/2.3,
        borderRadius: 5,
        height: 40,
        marginBottom: 10,
    },
    bankImgHoverX1New2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00e62c',
        width: width/2.3,
        borderRadius: 5,
        height: 40,
        marginBottom: 10,
    },




    //header 樣式
    userMoneyBox: {
        backgroundColor: "#fff",
        padding: 7,
        borderTopWidth: 1,
        borderColor: '#c7c8c8'
    },
    Headnohave: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 14,
        //fontWeight: 'bold',
        paddingTop: 6,
        paddingLeft: 6

    },
    HeadnohaveHove: {
        textAlign: 'center',
        color: "#1bff00",
        fontSize: 14,
        //fontWeight: 'bold',
        paddingTop: 6,
        paddingLeft: 6
    },
    Headhave: {
        textAlign: 'center',
        color: "#fff",
        fontSize: 14,
        //fontWeight: 'bold',

    },
    checkBox1: {
        width: 25,
        height: 25
    },
    NewcarButtonB: {
        // paddingBottom: 12,
        // borderColor: '#363636', borderBottomWidth: 1,
    },
    closeButton: {
        paddingBottom: 12,
        borderColor: '#363636', borderBottomWidth: 1,
    },

    PayButtonBX: {
        borderColor: '#666', borderBottomWidth: 1,
    },

    PayButtonB: {
        backgroundColor: "#2d2d2d",
        borderColor: '#666', borderBottomWidth: 1,
    },
    PayButtonBHoves: {
        borderColor: '#19ff00', borderWidth: 2,
        backgroundColor: "#2d2d2d",
    },


    DSPayButtonB: {
        backgroundColor: "#2d2d2d",
        borderRadius:5,
    },
    LBPayButtonB: {
        backgroundColor: "#333333",
        color: "#fff",
        borderRadius:5,
    },
    DSPayButtonBHoves: {
        backgroundColor: "#00b324",
        borderRadius:5,
    },
    DSPayButtonBHovesDisabled: {
        backgroundColor: "#333333",
        color: "#fff",
        borderRadius:5,
    },
    DSPayButtonBHoves2: {
        borderWidth: 1,
        borderColor: "#00b324",
        color: "#00b324",
        borderRadius:5,
        marginTop: 20
    },



    PayButtonBS: {
        backgroundColor: "#277e2d",
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: "#666",

        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,


    },
    withdrawals: {

        borderBottomWidth: 1,
        borderColor: '#363636',

    },

    moneyItem:{
        backgroundColor:'#171717',
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:10
    },
    dropdown_2: {
        alignSelf: 'flex-start',
        width: 150,
        marginTop: 32,
        borderWidth: 0,
        borderRadius: 3,
        backgroundColor: '#fff',
    },


    dropdown_D_text: {
        top: 1,
        paddingBottom: 10,
        paddingLeft: 10,
        fontSize: 15,
        color: '#828282',
        textAlign: 'center',
        textAlignVertical: 'center',

    },

    DSdropdown_D_text: {
        paddingLeft: 15,
        fontSize: 13,
        color: '#fff',

    },
    WDdropdown_D_text: {
        paddingLeft: 15,
        fontSize: 14,
        color: '#00b324',

    },

    dropdown_Day_text: {
        color: '#fff',
        fontSize: 15,
    },


    dropdown_Bonus_text: {

        paddingTop: 5,
        paddingBottom: 10,
        paddingLeft: 14,
        fontSize: 12,
        color: '#e0e0e0',


    },

    dropdown_Bonus_dropdown: {
        flex: 1,
        marginRight: -15,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        elevation: 4,
    },


    dropdown_D2_dropdown: {
        width: 80,
        height: 244,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },

    dropdown_DX_dropdown: {
        marginRight: -15,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,


    },
    dropdown_Day_dropdown: {
        width: 80,
        height: 244,
        marginRight: -15,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },
    dropdown_DZ_dropdown: {
        width: 130,
        height: 80,
        marginRight: 0,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },

    dropdown_DZ2_dropdown: {
        width: 200,
        height: 200,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },

    dropdown_D_dropdown: {
        width: 130,
        height: 150,
        flex: 1,
        marginRight: 0,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },
    DSdropdown_D_dropdown: {
        width: width-30,
        height: 150,
        flex: 1,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },
    RDdropdown_D_dropdown: {
        marginTop:10,
        width: width-30,
        height: 150,
        flex: 1,
        marginLeft:-30,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },
    WDdropdown_D_dropdown: {
        width: width/2.2,
        height: 150,
        flex: 1,
        marginRight: 0,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },


    dropdown_2_text: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
    },
    dropdown_2_dropdown: {
        width:150,
        borderWidth:0,
        backgroundColor:'#141414'
    },
    dropdown_3_dropdown: {
        marginRight: -35,
        borderRadius: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: "#666",
        backgroundColor: '#000000',
        //注意：这一句是可以让安卓拥有灰色阴影
        elevation: 4,
    },

    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },

    dropdown_2_row: {
        flex: 1,

    },

    dropdown_2_row_text: {
        fontSize: 14,
        paddingLeft: 15,
        paddingTop: 12,
        paddingBottom: 13,
        color: '#fff',
    },

    dropdown_Bonus_row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 10,
    },

    dropdown_Bonus_row_text: {
        marginHorizontal: 4,
        fontSize: 12,
        color: '#fff',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: '#cbcbcb',
    },
    LBList: {
        paddingLeft: 14, paddingTop: 14, borderBottomWidth: 0.2, borderColor: '#d2d2d2'
    },
    LBList2: {
        paddingLeft: 14, paddingTop: 14
    },
    userMoneyText: {
        fontWeight: 'bold'
    },
    HeadBackground: {
        width: width,
        height: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15,
    },
    colorWhite: {
        color: '#fff'
    },
    arrow: {
        marginLeft: -10,
        marginTop: 0,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 7,
        borderTopColor: '#0e7e00',//下箭头颜色
        borderLeftColor: '#171717',//右箭头颜色
        borderBottomColor: '#171717',//上箭头颜色
        borderRightColor: '#171717'//左箭头颜色
    },
    DSarrow: {
        marginTop: 0,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 7,
        borderTopColor: '#00b324',//下箭头颜色
        borderLeftColor: 'transparent',//右箭头颜色
        borderBottomColor: 'transparent',//上箭头颜色
        borderRightColor: 'transparent'//左箭头颜色
    },
    RDarrow:{
        marginTop: 0,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 7,
        borderTopColor: '#CCCCCC',//下箭头颜色
        borderLeftColor: 'transparent',//右箭头颜色
        borderBottomColor: 'transparent',//上箭头颜色
        borderRightColor: 'transparent'//左箭头颜色
    },
    withdrawalsArrow:{
        marginLeft: -10,
        marginTop: 0,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 7,
        borderTopColor: '#0e7e00',//下箭头颜色
        borderLeftColor: '#2c2c2c',//右箭头颜色
        borderBottomColor: '#2c2c2c',//上箭头颜色
        borderRightColor: '#2c2c2c'//左箭头颜色
    },
    arrow1:{
        marginLeft: 0,
        marginTop: -6,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 7,
        borderTopColor: '#2a2a2a',//下箭头颜色
        borderLeftColor: '#2a2a2a',//右箭头颜色
        borderBottomColor: '#19ff00',//上箭头颜色
        borderRightColor: '#2a2a2a'//左箭头颜色
    },
    arrow2: {
        marginLeft: 0,
        marginTop: 5,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 7,
        borderTopColor: '#19ff00',//下箭头颜色
        borderLeftColor: '#2a2a2a',//右箭头颜色
        borderBottomColor: '#2a2a2a',//上箭头颜色
        borderRightColor: '#2a2a2a'//左箭头颜色
    },

    MoneyButtonHover:{
        backgroundColor:'#0c7f00',
        width:width/4.8,
        borderRadius:5,
      },
      LBAGtransferTypes: {
        borderRadius:5,
        marginBottom: 8,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center'
      },
      OAMoneyButton: {
          borderWidth: 1,
          borderColor: '#666666',
          backgroundColor: '#333',
        borderRadius:5,
      },
      OAMoneyButtonHover: {
        borderWidth: 1,
          borderColor: '#0c7f00',
          backgroundColor: '#0c7f00',
        borderRadius:5,
      },
      SuggestedAmountArrow: {
        zIndex: 1000,
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: 10,
		borderTopColor: 'transparent',//下箭头颜色
		borderLeftColor: 'transparent',//右箭头颜色
		borderBottomColor: '#333',//上箭头颜色
		borderRightColor: 'transparent'//左箭头颜色
      },
    MoneyButton:{
        backgroundColor:'#2a2a2a',
        width:width/4.8,
        borderRadius:5,
    },
    MoneyButtonHover_AP:{
        backgroundColor:'#0c7f00',
        width:width/7.4,
        borderRadius:5,
      },

    MoneyButton_AP:{
      backgroundColor:'#2a2a2a',
      width:width/7.4,
      borderRadius:5,
    },
    LoadingButton:{
        backgroundColor:'#2a2a2a',
        paddingTop:13,
        paddingBottom:13,
        width:width-20,
        marginLeft:10,
        marginTop:5,
        borderRadius:5,
      },

    CallCsButton:{
        backgroundColor:'#0c7f00',
        paddingTop:13,
        paddingBottom:13,
        width:width-20,
        marginLeft:10,
        marginTop:5,
        borderRadius:5,
      },

    serBankBg:{
        borderRadius:5,
        marginLeft:10,
        marginRight:0,
        marginBottom:10,
        width:width/2.3,
        height:40,

        flexWrap: 'wrap',
	 		flexDirection: 'column',
	 		alignItems: 'center',
             justifyContent: 'center',
             backgroundColor:'#2a2a2a',
    },
    serBankBg2:{
        borderRadius:5,
        marginLeft:10,
        marginRight:0,
        marginBottom:10,
        width:width/2.3,
        height:40,
        flexWrap: 'wrap',
	 		flexDirection: 'column',
	 		alignItems: 'center',
             justifyContent: 'center',
        backgroundColor:'#00b324',

    },
    DSserBankBg:{
        borderRadius:5,
        width:width/2.3,
        height:40,
        backgroundColor:'#2a2a2a',
    },
    DSserBankBg2:{
        borderRadius:5,
        width:width/2.3,
        height:40,
        backgroundColor:'#00b324',

    },
    ALBList: {
        width:width-20,
        marginLeft:10,
        borderRadius: 6,
        paddingLeft: 14,
        paddingTop: 14,
        backgroundColor: "#FFECEC",

      },
      successBu:{
		fontSize:36,fontWeight:'900',color:'#1AFF00',
		width:60,
		height:60,
		borderWidth: 3,
		borderRadius:30,
		paddingTop:6,
		borderColor: '#1AFF00',
		textAlign:'center'
   },
//支付寶轉帳 //
alipaySTY:{
    paddingLeft:14,
    backgroundColor:"#2A2A2A",
    width:width-20,
    marginLeft:10,
    marginTop:8,
    marginBottom:8,
    height: 45,

  },
  PayButtonBALB:{
        paddingTop:10,
        paddingBottom:15,
  },
  buttonALBS: {
    borderRadius: 6,
    width: 110,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: "#0D7F00",
  },
  buttonALBSX:{
    borderRadius: 6,
    width: 110,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: "#fff",
  },
  alipaySTYQR:{
    paddingLeft:14,paddingTop:24,backgroundColor:"#2A2A2A",paddingBottom:24,
    width:width-20,
    marginLeft:10,
    marginTop:5,
    marginBottom:5,
  },
  alipaySTYUJ:{
    paddingLeft:14,backgroundColor:"#2A2A2A",
    width:width-20,
    marginLeft:10,

  },
  //支付寶轉帳 //
  alipaySTYAX:{
    paddingLeft:14,paddingTop:14,
    width:width-20,
    marginLeft:10,
    marginTop:5,
    marginBottom:5,

  },
  //验证用户信息弹出 //
  modals: {
    padding: 10,
    color: '#fff',
  },
  modalstitle:{
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
    color: '#fff',
  },
  modalsbody: {
    fontSize: 13,
    textAlign: "center",
    color: '#fff',
  },
  modalsfoot: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
    color: '#fff',
  },
  footTextBg: {
    backgroundColor: '#0d7f00',
    borderRadius: 5,
  },
  footText: {
	  color: '#fff',
	  fontSize: 15,
	  lineHeight: 35,
	  textAlign: "center"
  },
  DsBorder: {
      borderWidth: 1,
      borderColor: '#3d3d3d',
      borderRadius:5,
      height:40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom:3,
    },
    DsBorder2: {
        borderWidth: 1,
        borderColor: '#757575',
        borderRadius:5,
        height:40,
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:3,
        backgroundColor: '#000'
    },
    DsBorder3: {
        borderWidth: 1,
        borderColor: '#757575',
        borderRadius:5,
        height:40,
        display: 'flex',
        textAlign: 'left',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:3,
        backgroundColor: '#333333'
    },
    RDBorder:{
        backgroundColor: "#000000",
        borderColor:'#757575',
        borderWidth:1,
        display: "flex",
        flexDirection: 'row',
        //textAlign:'left',
        height: 48,
        marginBottom: 10,
        //justifyContent: 'center',
        alignItems:'center',
        borderRadius:5,
        marginTop:3,
    },
    OPTDsBorder: {
        borderWidth: 1,
        borderColor: '#18DB02',
        borderRadius:5,
        height:48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:3,
    },
    pay_APusd:{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center',
        height:40
    },
    moneyTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height:35,
    },
    recordeTitle: {
        marginTop:15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordeList:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width:width/3,
        backgroundColor: '#000',
        height: 38,
        borderRadius:5,
        borderWidth: 1,
        borderColor: "#757575"
    },
    recordeBtn:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width:width/6,
        backgroundColor: '#00B324',
        height: 38,
        borderRadius:5,
        textAlign: 'center'
    },
    recordeDate:{
        flexDirection:'row',
        width:width/1.7,
        backgroundColor: '#000',
        height: 38,
        borderRadius:5,
        alignItems:'center'
    },
    dateList:{
        flexDirection: 'row',
        height: 38,
        lineHeight:38,
        // backgroundColor: '#000',
        alignItems: 'center',

    },
    dateModalDrop:{
        zIndex: 10,
        width: width / 3,
        // alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        lineHeight:38,
        borderRadius:5,
        backgroundColor: '#000',
        borderWidth: 1,
        borderColor: '#757575'
    },
    recordHistoryList:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height:35,
        paddingRight:3,
        paddingTop:8,
    },
      //验证用户信息弹出 //
  modals: {
    padding: 10,
    color: '#fff',
  },
  modalstitle:{
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
    color: '#fff',
  },
  modalsbody: {
    fontSize: 13,
    textAlign: "center",
    color: '#fff',
  },
  modalsfoot: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
    color: '#fff',
  },
  footTextBg: {
    backgroundColor: '#0d7f00',
    borderRadius: 5,
  },
  footText: {
	  color: '#fff',
	  fontSize: 15,
	  lineHeight: 35,
	  textAlign: "center"
  },
  noMoneyModal1: {
    backgroundColor: 'transparent',
    width,
  },
  noMoneyModal: {
      backgroundColor: '#000',
      borderWidth: 1,
      borderColor: '#00B324',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowColor: "#00B324",
      elevation: 4
  },
  noMoneyModalContainer: {
      alignItems: 'center',
  },
  noMoneyText1: {
      color: '#fff',
      fontSize: 16,
      marginTop: 20
  },
  noMoneyText2: {
      color: '#ccc',
      marginTop: 40,
      marginBottom: 30,
      textAlign: 'center',
  },
  noMoneryTextWrap: {
      backgroundColor: '#00B324',
      borderRadius: 4,
      height: 40,
      width: .8 * width,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 35,
  },
  noMoneyText3: {
      color: '#fff',
      fontSize: 15
  },
  test:{
    color: '#ccc',
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 17,
  },
  bankStatusButton: {

  },
  bankStatusTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 10,
    paddingVertical: 9,
    borderRadius: 4,
    // minWidth: "22%",
    textAlign: "center",
    marginHorizontal: 3,
    width: width/4.3,
  },
  bankStatusTabActive: {
    borderColor: '#00E62E',
    backgroundColor: "#18261B",
  },
  bankStatusTabNormal: {
    borderColor: '#757575',
    backgroundColor: "#555555",

},
  BankStatusTabText: {
    fontSize: 12,
    marginLeft: 3
  },
  bankStatusCircle: {
    width: 17,
    height: 17,
    borderRadius: 17/2
  },
  bankStatusGreen: {
      backgroundColor: "#00E62E",
  },
  bankStatusGray: {
    backgroundColor: "#999999",
},
    stepList: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginTop: 20,
        marginBottom: 26
    },
    steps: {
        width: 42,
        borderColor: "#1A1A1A",
        borderWidth: 1,
        color: "#fff",
        backgroundColor: "#1A1A1A",
        borderRadius: 42/2,
        marginHorizontal: 10
    },
    stepsText: {
        textAlign: "center",
        color: "#fff",
        lineHeight: 40
    },
    stepTextActive: {
        color: "#fff"
    },
    stepsRow: {
        width: 200,
        height: 2,
        backgroundColor: "#2a2a2a"
    },
    stepsRowActive: {
        width: 200,
        height: 2,
        backgroundColor: "#00B324"
    },
    stepActive: {
        width: 42,
        borderColor: "#00B324",
        color: "#fff",
        backgroundColor: "#00B324",
        borderWidth: 1,
        borderRadius: 42/2,
        marginHorizontal: 10
    },
    copyWrap: {
        backgroundColor: '#333333',
        paddingVertical: 15,
        paddingLeft: 16,
        paddingRight: 11,
        justifyContent: 'space-between'
    },
    copyText: {
        color: '#999999',
        fontSize: 14
    },
    copyBtnWrap:{
        width: 90,
        height: 32,
        borderWidth: 1,
        borderColor: "#00B324",
        borderRadius: 4,
        lineHeight: 32
    },
    copyRdWrap: {
        display: "flex",
        flexDirection: 'row',                                          
        height: 30,
        alignItems:'center',
        borderRadius:5,
        marginTop:3,
        width: 190,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 4,
    },
    copyBtn: {
        textAlign: 'center',
        color: "#00B324",
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 32
    },
    copyRdBtn: {
        textAlign: 'center',
        color: "#FFFFFF",
        // alignItems: 'center',
        // justifyContent: 'center',
        lineHeight: 30
    },
    el_center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bankIon: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 6,
        justifyContent: 'center'
    },
    bankIonBBL: {
        width: 40,
        height: 50,
        marginRight: 10,
        justifyContent: 'center'
    },
    bankIonTMB: {
        width: 60,
        height: 30,
        marginRight: 10,
        justifyContent: 'center'
    },
    qrcodeWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        overflow: 'hidden',
        marginBottom: 5
    },
    qrcodeBox: {
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#F5F5F5',
        padding: 10,
        overflow: 'hidden',
    },
    boxView: {
        // height: 400,
        backgroundColor: '#1F1F1F',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: width,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        paddingBottom: 20
    },
    bankBoxView: {
        backgroundColor: "#06AD90",
        color: "#fff",
        borderRadius: 1,
        marginTop: 20,
        paddingTop: 15,
        paddingLeft: 15,
        paddingBottom: 15,
        borderRadius:8,
    },
    defaultBoxView:{
        // borderColor: "#0E7F00",
      // borderWidth:2
        borderRadius:8,
        backgroundColor: '#D55055',
    },
    newDefault:{
        backgroundColor:'#04AD90',
        borderRadius:8,
        color: "#fff",
        borderRadius: 1,
        marginTop: 20,
        paddingTop: 15,
        paddingLeft: 15,
        paddingBottom: 15,
    }
});
