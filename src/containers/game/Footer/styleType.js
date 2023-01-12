import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    giftDetail: {
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingTop: 6,
        paddingBottom: 6,
    },
    giftViewList: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems:'center',
        flexDirection: 'row',
    },
    giftView: {
        width: width -40,
        padding: 15,
        backgroundColor: '#363636',
        borderRadius: 10,
    },
    arrow: {
        position: 'absolute',
        top: -12,
        left: 30,
        width: 0,
        height: 0,
        zIndex: 9,
        borderWidth: 6,
        borderTopColor: "transparent",
        borderLeftColor: "transparent",
        borderBottomColor: "#363636",
        borderRightColor: "transparent",
    },
    gift_alert: {
        marginTop: 15,
    },
    headerTop: {
        backgroundColor: '#00B324',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
        flexDirection: 'row',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
    },
    numIcon: {
        backgroundColor: '#D20F26',
        width: 26,
        height: 26,
        borderRadius: 26,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ShowbalanceTxt: {
        position: 'absolute',
        top: 50,
        left: 0,
        backgroundColor: '#ffeda6',
        zIndex: 999,
    },
    BetTabs: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    Bet_digit_keyboard: {

    },
    CantPlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    CantPlayErr: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 108,
        width: width - 20,
        backgroundColor: '#FFFCCA',
        opacity: .9,
        borderRadius: 4,
    },
    ActiveMenu: {
        
        height: 40,
        backgroundColor: '#2E2E2E',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noActiveMenu: {
        
        height: 40,
        backgroundColor: '#444444',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Betinputlist: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        
        padding: 10,
    },
    input_area: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        
        backgroundColor: '#333333',
        borderRadius: 10,
    },
    closeLeft: {
        backgroundColor: '#333333',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        width: 35,
        height: '100%',
    },
    itemRight: {
        
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: '#222222',
    },
    iteamName: {
        
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
    },
    OddsTxt: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        color: '#F5F5F5'
    },
    iteamTime: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        
        paddingLeft: 10,
        paddingRight: 10,
    },
    iteamInput: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        
        paddingLeft: 10,
        paddingRight: 10,
    },
    InputBox: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#00E62E'
        
    },
    ActualBetAmount: {
        color: '#CCCCCC',
        textAlign: 'right',
        fontSize: 12,
        width: width - 80
    },
    maxMinErr: {
        
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingRight: 15,
    },
    maxMinErrView: {
        // backgroundColor: '#fee0e0',
        
    },
    maxMinErr1: {
        width: width - 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 15,
    },
    maxMinErrView2: {
        // backgroundColor: '#fee0e0',
        
    },
    maxMinErr2: {
        
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    maxMinErrTxt: {
        color: '#eb2121',
        textAlign: 'right',
        paddingRight: 5,
        marginBottom: 10,
        fontSize: 12
    },
    maxMiinErrTxt2: {
        color: '#eb2121',
        paddingLeft: 5,
        marginBottom: 10,
        fontSize: 12
    },
    lightGray: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 15,
    },
    ShowKeyboardBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        
        marginLeft: 10,
    },
    Bet_digit_keyboard_area: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#222222',
        borderRadius: 10,
    },
    number_area: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        
        padding: 15,
        backgroundColor: '#222222',
        borderRadius: 10,
    },
    numItemBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#444444',
        
        borderRadius: 50,
        marginBottom: 10,
    },
    bettotalamount: {
        backgroundColor: '#000000',
        height: 120,
        
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    total_amount: {
        
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15,
    },
    BetingBtn: {
        display: 'flex',
        justifyContent: 'center',
        
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    Btn_left: {
        backgroundColor: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 42,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#00B324'
    },
    Btn_right: {
        marginLeft: 15,
        backgroundColor: '#00B324',
        borderRadius: 8,
        height: 42,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    Settingsinput: {
        backgroundColor: '#222222',
        borderRadius: 10,
        padding: 15,
        
        marginLeft: 10,
        marginBottom: 15,
    },
    list_Inputdata: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    SystemParlayBet: {
        backgroundColor: '#222222',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        paddingBottom: 10,
        paddingTop: 16,
        
        marginLeft: 10,
    },
    capItem: {
        paddingTop: 15,
        paddingBottom: 15,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    activeCapList: {
        height: 7,
        width: 7,
        borderRadius: 6,
        backgroundColor: '#00E62E',
    },
    capList: {
        width: 15,
        height: 15,
        backgroundColor: '#222222',
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#999999',
    },
    capInput: {

        backgroundColor: '#1A1A1A',
        borderRadius: 4,
        borderColor: '#00E62E',
        borderWidth: 1
    },
    Header: {
        backgroundColor: '#00B324',
        
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
    },
    B_Loading: {
        // backgroundColor: '#fcaa1f',
        width: 28,
        height: 28,
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTxt: { lineHeight: 18, color: '#fff', paddingLeft: 15, fontWeight: 'bold', marginRight: 14 },
    Beting_Box_Status: {
        flex: 1,
        backgroundColor: '#000000'
    },
    BottomBtnLoding: {
        padding: 15,
        opacity: 0.7,
    },
    BottomBtnLoding4: {
        padding: 15,
    },
    BottomBtn: {
        padding: 15,
    },
    cantEnter: {
        
        backgroundColor: '#00B324',
        borderRadius: 10,
        marginBottom: 15
    },
    cantEnterTxt: {
        lineHeight: 42,
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
    },
    cantEnterWhitebtn: {
        
        borderColor: '#00B324',
        borderWidth: 1,
        borderRadius: 10,
    },
    cantEnterWhitebtnTxt: {
        color: '#00B324',
        lineHeight: 42,
        textAlign: 'center',
        fontSize: 18,
    },
    headerIcon: {
        backgroundColor: '#fff',
        borderRadius: 60,
        width: 28,
        height: 28,
    },
    betstatus: {
        padding: 10,
    },
    Betlistitem: {
        padding: 15,
        
        backgroundColor: '#222222',
        borderRadius: 10,
        marginBottom: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    betitem: {
        paddingTop: 5,
        paddingBottom: 5,
        
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    teamName: { color: '#F5F5F5', fontWeight: 'bold', fontSize: 17,  },
    BetAmount: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#99999933',
        paddingTop: 15,
        paddingBottom: 35
    },
    BetAmountHun: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8
    },
    gift: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: 75,
        height: 35,
    },
    giftBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 75,
        height: 35,
    },
    freedSelect: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        height: 38,
        paddingLeft: 10,
        paddingRight: 10,
    },
    depModal: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	depModalMin: {
		flex: 1,
	},
    LandscapeClose: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 1,
	},
    modalCenterLandscape: {
		position: 'absolute',
		bottom: 0,
		zIndex: 9,
		backgroundColor: '#fff',
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
	},
	modalCenter: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: width,
		height: height * 0.5,
		backgroundColor: '#fff',
		borderTopRightRadius: 16,
		borderTopLeftRadius: 16,
	},
    freedBtn: {
        backgroundColor: '#efeff4',
    },
    marks: {
        width: width,
        height: height,
        position: 'absolute',
        zIndex: -1,
    },
})
