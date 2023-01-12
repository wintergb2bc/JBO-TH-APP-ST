import React from 'react'
import { ScrollView, View, Text, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import { Toast, DatePicker, List } from 'antd-mobile-rn'
import * as Animatable from 'react-native-animatable' 
import moment from 'moment'

const { height, width } = Dimensions.get('window')
const BaseWidth0 = width - 32
const BaseWidth1 = BaseWidth0 / 3.2
const BaseWidth3 = BaseWidth0 / 2.1
const BaseWidth2 = BaseWidth0 * (21 / 32)

import ListItems from 'antd-mobile-rn/lib/list/style/index.native'
const newStyleHistore = {}
for (const key in ListItems) {
    if (Object.prototype.hasOwnProperty.call(ListItems, key)) {
        newStyleHistore[key] = { ...StyleSheet.flatten(ListItems[key]) }
        if (key === 'Item') {
            newStyleHistore[key].width = BaseWidth3;
            newStyleHistore[key].fontSize = 0
            newStyleHistore[key].opacity = 0
        }
        newStyleHistore[key].opacity = 0;
        newStyleHistore[key].fontSize = 0;
        newStyleHistore[key].backgroundColor = "transparent";
        newStyleHistore[key].borderWidth = 0
        newStyleHistore[key].borderBottomColor = "transparent";
    }
}
const GameDatas = [
    {
        title: 'ทั้งหมด',
        id: ''
    },
    {
        title: 'IM อีสปอร์ต',
        id: 'IPES'
    }, 
    {
        title: 'TF อีสปอร์ต',
        id: 'TFG'
    },
    {
        title: 'SABA กีฬา',
        id: 'OWS_SPORTSBOOK'
    },
    {
        title: 'IM กีฬา',
        id: 'IPSB'
    },
    {
        title: 'Bti กีฬา',
        id: 'SBT'
    },
    {
        title: 'SPRIBE',
        id: 'SPR'
    },
    {
        title: 'SEXY คาสิโน',
        id: 'SXY'
    },
    {
        title: 'EVO คาสิโน',
        id: 'EVO'
    },
    {
        title: 'GPI คาสิโน ',
        id: 'GPI'
    },
    {
        title: 'AG คาสิโน',
        id: 'AGL'
    },
    {
        title: 'WM คาสิโน',
        id: 'WMC'
    },
    {
        title: 'PG สล็อต',
        id: 'PGS'
    },
    {
        title: 'MGS สล็อต',
        id: 'MGP'
    },
    {
        title: 'PP สล็อต',
        id: 'TG'
    },
    {
        title: 'SG สล็อต',
        id: 'SPG_RNG'
    },
    {
        title: 'PNG สล็อต',
        id: 'YDSPNG'
    },
    {
        title: 'RLX สล็อต',
        id: 'YDSRLX'
    },
    {
        title: 'YD สล็อต',
        id: 'YDS'
    },
    {
        title: 'JL ยิงปลา​',
        id: 'JIF'
    },
    {
        title: 'SG ยิงปลา​',
        id: 'SPG_FISHING'
    },
    {
        title: 'SABA เกม 3 มิติ​',
        id: 'OWS_P2P'
    },
    {
        title: 'คิงโป๊กเกอร์',
        id: 'KPK'
    },
    {
        title: 'คิงเมคเกอร์',
        id: 'TGP'
    },
    {
        title: 'หวย',
        id: 'GPK'
    },
    {
        title: 'SABA คีโน',
        id: 'OWS_KENO'
    },
]

export default class BettingHistory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bettingIndex: 0,
            dateData: [
                {
                    label: 0,
                    value: 'วันนี้'
                },
                {
                    label: 6,
                    value: '7 วัน'
                },
                {
                    label: 29,
                    value: '30 วัน'
                }
            ],
            currentDateLabel: 0,
            dateFrom: moment().subtract(0, 'days').format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            minDate: moment().subtract(89, 'days').format('YYYY-MM-DD'),
            bettingRecordsSortArr: [],
            bettingRecordsSortTotalArr: [],
            modalDropdownFlag: false,
            GameSortArr: GameDatas.filter(v => v.id).reduce((obj, v) => { obj[v.id] = v.title; return obj }, {}),
            totalTurnover: 0,
            lastUpdatedDate: '',
            totalPage: 0,
            rowCount: 10,
            pageNumber: 1,
            bettingRecordsArr: []
        }
    }

    componentDidMount() {
        this.getBettingRecords()
    }

    createBettingRow(item, index) {
        const rowColor = { color: index * 1 === this.state.bettingIndex * 1 ? '#00B324' : '#CCCCCC' }
        return <View style={styles.limitModalDropdownList}>
            <Text style={[styles.limitModalDropdownListText,rowColor]}>{item.title}</Text>
        </View>
    }

    changeBettingIndex(index) {
        this.setState({
            bettingIndex: index
        })
    }

    changeDateIndex(label) {
        this.setState({
            currentDateLabel: label * 1,
            dateFrom: moment().subtract(label, 'days').format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
        })
    }
    changeDatePicker(type, date) {
        if (type === 'dateFrom') {
            if ((new Date(moment(date).format('YYYY-MM-DD'))).getTime() > (new Date(this.state.dateTo)).getTime()) {
                Toast.fail('วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น', 2)
                return
            } else {
                this.setState({
                    currentDateLabel: moment().diff(moment(date), 'days')
                })
            }
        }
        if (type === 'dateTo') {
            if ((new Date(moment(date).format('YYYY-MM-DD'))).getTime() < (new Date(this.state.dateFrom)).getTime()) {
                Toast.fail('วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น', 2)
                return
            }
        }
        this.setState({
            [type]: moment(date).format('YYYY-MM-DD')
        })
    }

    changeModalDropdownFlag(flag) {
        this.setState({
            modalDropdownFlag: flag
        })
    }

    getBettingRecords() {
        this.setState({
            bettingRecordsArr: [],
            bettingRecordsSortTotalArr: []
        })
        const { dateFrom, dateTo, bettingIndex, rowCount, pageNumber } = this.state
        Toast.loading('กรุณารอดำเนินการ...')
        fetchRequest(`${ApiPort.MemberDailyTurnover}?dateFrom=${dateFrom}&dateTo=${dateTo}&providerCode=${GameDatas[bettingIndex].id}&rowCount=${rowCount}&pageNumber=${pageNumber}&`, 'GET').then(res => {
            Toast.hide()
          console.log('MemberDailyTurnover res',res)
            if (res.isSucess) {
                let providerCodeArr = [...new Set(res.dailyTurnoverListing.map(v => v.ProviderCode))]
                let dailyTurnoverListing = res.dailyTurnoverListing
                let bettingRecordsSortArr = providerCodeArr.reduce((arr, v) => {
                    let tempArr = dailyTurnoverListing.filter(v1 => v1.ProviderCode === v)
                    arr.push(tempArr)
                    return arr
                }, [])
                let bettingRecordsSortTotalArr = bettingRecordsSortArr.map((v, i) => {
                    return {
                        DateLabel: `${dateFrom} - ${dateTo}`,
                        Turnover: v.reduce((num, v1) => num += v1.Turnover * 10000000, 0) / 10000000,
                        ProviderCode: providerCodeArr[i],
                        WinLoss: v.reduce((num, v1) => num += v1.WinLoss * 10000000, 0) / 10000000
                    }
                })
                this.setState({
                    totalTurnover: res.totalTurnover,
                    lastUpdatedDate: res.lastUpdatedDate,
                    totalPage: res.totalRowCount % rowCount === 0 ? res.totalRowCount / rowCount : Math.floor(res.totalRowCount / rowCount) + 1,
                    bettingRecordsSortArr,
                    bettingRecordsArr: res.dailyTurnoverListing,
                    bettingRecordsSortTotalArr
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    initNumber(str1) {
        let str = str1 + ''
        let reg = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g
        if (str.includes('.')) {
            let strArr = str.split('.')
            return strArr[0].replace(reg, '$1,') + '.' + strArr[1]
        } else {
            return str.replace(reg, '$1,')
        }
    }

    render() {
        console.log('BaseWidth0',BaseWidth0,totalPage,pageNumber)//100+(20*totalPage)  +(32*totalPage)
        const { bettingRecordsArr, bettingIndex, dateData, currentDateLabel, dateFrom, dateTo, modalDropdownFlag, minDate, totalTurnover, totalPage, pageNumber, lastUpdatedDate } = this.state
        let dateDataIndex = dateData.findIndex(v => v.label * 1 === currentDateLabel * 1)
        return <View style={styles.viewContainer}>
            <View style={{marginBottom: 21}}>
                <Text style={styles.bettingTopText}>เวลาในการคำนวณยอดหมุนเวียนคือ GMT+8</Text>
                <Animatable.Text
                    animation={lastUpdatedDate.length > 0 ? 'fadeInRight' : 'fadeOutLeft'}
                    easing="ease-out"
                    style={[styles.bettingTopText, { height: lastUpdatedDate.length > 0 ? 'auto' : 0 }]}
                    duration={800}
                >อัปเดตล่าสุด: {moment(lastUpdatedDate).tz("Asia/Taipei").format('YYYY/MM/DD hh:mm:ss')}</Animatable.Text>
            </View>
            <ModalDropdown
                animated={true}
                defaultValue={GameDatas[0].title}
                options={GameDatas}
                renderRow={this.createBettingRow.bind(this)}
                onSelect={this.changeBettingIndex.bind(this)}
                style={[styles.limitModalDropdown, { borderColor: modalDropdownFlag ? '#00B324' : '#757575' }]}
                dropdownStyle={[styles.limitDropdownStyle]}
                renderSeparator={()=>(<View style={{borderWidth: 0}} />)}
                onDropdownWillShow={this.changeModalDropdownFlag.bind(this, true)}
                onDropdownWillHide={this.changeModalDropdownFlag.bind(this, false)}
            >
                <View style={styles.limitModalDropdownTextWrap}>
                    <Text style={styles.limitModalDropdownText}>{GameDatas[bettingIndex].title}</Text>
                    <Animatable.View
                        transition={['borderTopColor', 'rotate', 'marginTop', 'marginBottom']}
                        style={[
                            styles.limitModalDropdownArrow,
                            {
                                borderTopColor: modalDropdownFlag ? '#00B324' : '#F5F5F5',
                                transform: [{ rotate: `${modalDropdownFlag ? 180 : 0}deg` }],
                                marginTop: modalDropdownFlag ? 0 : 6,
                                marginBottom: modalDropdownFlag ? 6 : 0
                            }]}
                    ></Animatable.View>
                </View>
            </ModalDropdown>

            <View style={styles.dateWrap}>
                {
                    dateData.map((v, i) => {
                        return <TouchableOpacity key={i} style={[styles.dateLists, { borderColor: currentDateLabel === v.label ? '#666666' : '#666666' }]} onPress={this.changeDateIndex.bind(this, v.label)}>
                            <Text style={{ color: currentDateLabel === v.label ? '#00B324' : '#CCCCCC', fontSize: 13 }}>{v.value}</Text>
                        </TouchableOpacity>
                    })
                }
                <Animatable.View
                    style={[styles.dateLists, { position: 'absolute', borderColor: '#00B324', zIndex: 10, left: dateDataIndex * (BaseWidth0 * 11 / 32) }]}
                    transition={['left']}
                ></Animatable.View>
            </View>

            <View style={styles.dateWrap}>
                <View style={[styles.DsBorder, {marginRight: 6}]}>
                    <DatePicker
                        value={new Date(dateFrom)}
                        mode='date'
                        minDate={new Date(minDate)}
                        maxDate={new Date()}
                        title={'วันที่เริ่มต้น'}
                        onChange={this.changeDatePicker.bind(this, 'dateFrom')}
                        format='YYYY-MM-DD'
                        locale={{
                            DatePickerLocale: {
                                year: "",
                                month: "",
                                day: "",
                                hour: "",
                                minute: ""
                            },
                            okText: "ตกลง",
                            dismissText: "ยกเลิก"
                        }}
                    >
                        <List.Item styles={StyleSheet.create(newStyleHistore)}></List.Item>
                    </DatePicker>
                    <Text style={styles.datePickerText}>{dateFrom}</Text>
                    <View style={{ height: 20, width: 20, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 11 }}>
                        <Image source={require('./../../images/bettingtimeicon.png')} resizeMode='stretch' style={{width: 14, height: 16}}></Image>
                    </View>
                </View>
                <View style={[styles.DsBorder, {marginLeft: 6}]}>
                    <DatePicker
                        value={new Date(dateTo)}
                        mode='date'
                        minDate={new Date(minDate)}
                        maxDate={new Date()}
                        title={'วันที่สิ้นสุด'}
                        onChange={this.changeDatePicker.bind(this, 'dateTo')}
                        format='YYYY-MM-DD'
                        locale={{
                            DatePickerLocale: {
                                year: "",
                                month: "",
                                day: "",
                                hour: "",
                                minute: ""
                            },
                            okText: "ตกลง",
                            dismissText: "ยกเลิก"
                        }}
                    >
                        <List.Item arrow="down" styles={StyleSheet.create(newStyleHistore)}></List.Item>
                        {/*<List.Item style={styles.baseListCom} styles={StyleSheet.create(newStyleHistore)}></List.Item>*/}
                    </DatePicker>
                    <Text style={styles.datePickerText}>{dateTo}</Text>
                    <View style={{ height: 20, width: 20, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 11 }}>
                        <Image source={require('./../../images/bettingtimeicon.png')} resizeMode='stretch' style={{width: 14, height: 16}}></Image>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.searchBtn} onPress={() => {
                this.setState({
                    pageNumber: 1
                }, () => {
                    this.getBettingRecords()
                })
            }}>
                <Text style={styles.searchBtnText}>ค้นหา</Text>
            </TouchableOpacity>
  

            <View style={{ flex: 1 }}>
                <View style={styles.bettingRecordsTotal}>
                    <Text style={styles.bettingRecordsTotalText}>ยอดเดิมพันทั้งหมด ：{this.initNumber(totalTurnover)} ฿</Text>
                </View>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        bettingRecordsArr.length > 0 ? bettingRecordsArr.map((v, i) => {
                            return <View key={i} style={[styles.bettingRecordsList, { marginBottom: i * 1 === bettingRecordsArr.length - 1 ? 100 : 10 }]}>
                                <View style={styles.bettingRecordsRow}>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox1]}>
                                        <Text style={styles.bettingRecordsBoxText1}>วันที่</Text>
                                    </View>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox2]}>
                                        <Text style={styles.bettingRecordsBoxText2}>{moment(v.DateLabel).format('YYYY/MM/DD')}</Text>
                                    </View>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox1]}>
                                        <Text style={styles.bettingRecordsBoxText1}>ยอดเดิมพัน</Text>
                                    </View>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox2]}>
                                        <Text style={styles.bettingRecordsBoxText2}>{this.initNumber(v.Turnover)}</Text>
                                    </View>
                                </View>
                                <View style={styles.bettingRecordsRow}>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox1]}>
                                        <Text style={styles.bettingRecordsBoxText1}>เกม</Text>
                                    </View>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox2]}>
                                        <Text style={styles.bettingRecordsBoxText2}>{v.ProviderCode}</Text>
                                    </View>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox1]}>
                                        <Text style={styles.bettingRecordsBoxText1}>ชนะ/แพ้</Text>
                                    </View>
                                    <View style={[styles.bettingRecordsBoxBase, styles.bettingRecordsBox2]}>
                                        <Text style={[styles.bettingRecordsBoxText2, { color: (v.WinLoss > 0 || v.WinLoss === 0) ? '#00B324' : '#FF242F' }]}>
                                            {(v.WinLoss > 0 ? '+' : '') + this.initNumber(v.WinLoss)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        }) : <Text style={styles.bettingRecordText}>ไม่พบข้อมูล</Text>
                    }
                </ScrollView>
            </View>

            {
                bettingRecordsArr.length > 0 && <View style={styles.paginationBox}>
                    <View style={styles.paginationBox1}>
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                        >
                            <View style={styles.paginationBox2}>
                                {
                                    Array.from({ length: totalPage }, (v, i) => i + 1).map((v, i) => <TouchableOpacity
                                        key={i}
                                        style={[styles.paginationWrap, { borderColor: pageNumber * 1 === v * 1 ? '#00E62E' : '#CCCCCC' }]}
                                        onPress={() => {
                                            this.setState({
                                                pageNumber: v
                                            }, () => {
                                                this.getBettingRecords()
                                            })
                                        }}
                                    >
                                        <Text style={[styles.paginationText, { color: pageNumber * 1 === v * 1 ? '#00E62E' : '#CCCCCC' }]}>{v}</Text>
                                    </TouchableOpacity>)
                                }
                            </View>
                        </ScrollView>
                    </View>

                    <TouchableOpacity style={[styles.paginationWrap, styles.paginationComWrap, { left: 10, borderColor: pageNumber > 1 ? '#00E62E' : '#CCCCCC' }]} onPress={() => {
                        if (pageNumber > 1) {
                            this.setState({
                                pageNumber: pageNumber - 1
                            }, () => {
                                this.getBettingRecords()
                            })
                        }
                    }}>
                        <Text style={styles.paginationText}>&lt;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.paginationWrap, styles.paginationComWrap, { left:totalPage == 1 ? 100: 55+(40*totalPage), borderColor: pageNumber < totalPage ? '#00E62E' : '#CCCCCC' }]} onPress={() => {
                        if (pageNumber < totalPage) {
                            this.setState({
                                pageNumber: pageNumber + 1
                            }, () => {
                                this.getBettingRecords()
                            })
                        }
                    }}>
                        {
                            console.log(pageNumber)
                        }
                        <Text style={styles.paginationText}>&gt;</Text>
                    </TouchableOpacity>
                </View>
            }
 

        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        paddingHorizontal: 16,
        paddingVertical: 20
    },
    bettingTopText: {
        color: '#CCCCCC',
        marginBottom: 4,
        fontSize: 12
    },
    limitModalDropdown: {
        width: BaseWidth0,
        height: 48,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
        marginBottom: 4,
    },
    limitDropdownStyle: {
        marginTop: 8,
        width: BaseWidth0,
        height: height - 230,
        backgroundColor: '#141414',
        borderColor: 'transparent',
        borderRadius: 4,
        marginLeft: -1
    },
    limitModalDropdownList: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    limitModalDropdownListText: {
        color: '#fff'
    },
    limitModalDropdownTextWrap: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
    },
    limitModalDropdownText: {
        color: '#F5F5F5'
    },
    limitModalDropdownArrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 6,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#F5F5F5'
    },
    dateWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        marginBottom: 4,
        position: 'relative',
        overflow: 'hidden'
    },
    dateLists: {
        width: BaseWidth1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchBtn: {
        backgroundColor: '#00B324',
        height: 40,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: BaseWidth0,
        fontSize: 13,
        marginTop: 15
    },
    searchBtnText: {
        color: '#fff'
    },
    datePickerText: {
        color: '#CCCCCC',
        position: 'absolute',
        zIndex: -10,
        marginLeft: 16,
        fontSize: 12
    },
    bettingRecordText: {
        textAlign: 'center',
        color: '#F5F5F5',
        marginTop: 100
    },
    bettingRecordsTotal: {
        backgroundColor: '#333333',
        borderWidth: 1,
        borderColor: '#444444',
        height: 48,
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 20
    },
    bettingRecordsTotalText: {
        color: '#F5F5F5',
        fontSize: 13
    },
    bettingRecordsList: {
        borderWidth: 1,
        borderColor: '#444444',
        borderBottomWidth: 0,
        marginBottom: 8
    },
    bettingRecordsRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bettingRecordsBoxText1: {
        color: '#FFFFFF',
        fontSize: 10
    },
    bettingRecordsBoxText2: {
        color: '#F5F5F5',
        fontSize: 10
    },
    bettingRecordsBoxBase: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#444444',
    },
    bettingRecordsBox1: {
        width: BaseWidth0 * .2,
        backgroundColor: '#333333',
    },
    bettingRecordsBox2: {
        width: BaseWidth0 * .3,
    },
    paginationBox: {
        backgroundColor: '#0A0A0A',
        zIndex: 10,
        position: 'absolute',
        bottom: 0,
        width,
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
    },
    paginationBox1: {//數字的部分
        //backgroundColor:"red",
        marginHorizontal: 40,
        width: BaseWidth0 - 80,
        height: 70,
        justifyContent: 'center'
    },
    paginationBox2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    paginationText: {
        color: '#CCCCCC'
    },
    paginationWrap: {
        borderWidth: 1,
        borderRadius: 2,
        width: 28,
        height: 30,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#CCCCCC'
    },
    paginationComWrap: {
        position: 'absolute'
    },
    DsBorder: {
        // flex: 1,
        width: BaseWidth3,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#666666',
        borderRadius: 4,
        height:40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})
