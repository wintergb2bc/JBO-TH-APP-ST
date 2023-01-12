import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, ImageBackground, RefreshControl, Platform, ActivityIndicator, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Toast } from 'antd-mobile-rn'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import { connect } from 'react-redux'
const { width, height } = Dimensions.get('window')
import * as Animatable from 'react-native-animatable'
const AnimatableView = Animatable.View
import DeviceInfo from 'react-native-device-info'
let iphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE']
const getModel = DeviceInfo.getModel()
let isIphoneX = Platform.OS === 'ios' && !iphoneXMax.some(v => v == getModel)
import HTMLView from 'react-native-htmlview'
const NewsTabDatas = [
	{
		title:'กล่องจดหมาย',
		//title: '我的消息',
	},
	{
		title:'ข่าวประกาศ',
		//title: '平台公告',
	}
]

const InboxMessagesTabDatas = [
	{
		title:'ข้อความ',
		//title: '交易记录',
		inboxMessagesIndex: 0,
		category: 'transaction'
	},
	{
		title:'ส่วนบุคคล',
		//title: '个人',
		inboxMessagesIndex: 1,
		category: 'personalMessage'
	}
]

const InboxMessageType2 = [
	{
		title: 'ข้อความทั้งหมด',//'全部',
		type: 0,
		icon: ''
	},
	{
		title: 'ฝาก', // 充值
		type: 1,
		icon: '#00B324'
	},
	{
		title: 'ถอน', // 提款
		type: 2,
		icon: '#0077FF'
	},
	{
		title: 'ปรับยอด', // 转账
		type: 3,
		icon: '#EB9800'
	},
	{
		title: 'โบนัส', // 优惠
		type: 4,
		icon: '#FC2727'
	}
]

const AnnouncementMessageType = [
	{
		title:'แจ้งเตือนทั้งหมด',// '全部',
		type: 0,
		icon: '#0077FF'
	},
	{
		title: 'ธนาคาร',//'银行信息', //Banking
		type: 1,
		icon: '#00B324'
	},
	{
		title: 'การเดิมพัน',//'产品',// Product
		type: 2,
		icon: '#0077FF'
	},
	{
		title: 'โปรโมชั่น',//'优惠', // Promotions
		type: 3,
		icon: '#FC2727'
	},
	{
		title: 'อื่นๆ',//'其他',// General
		type: 4,
		icon: '#EB9800'
	}
]

const pageSize = 25

export default class Message extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			messageIndex: 0,
			messageModalDropdownIndex: 0, // 下拉

			pageSize,
			pageIndex: 1,

			inboxMessagesIndex: 0,
			messageLists: [],

			refreshing: false,

			unreadAnnouncementCount: this.props.unreadAnnouncementCount || 0,
			unreadPersonalMessageCount: this.props.unreadPersonalMessageCount || 0,
			unreadTransactionMessageCount: this.props.unreadTransactionMessageCount || 0,
			isHaveMoreMessage: true,
			isShowMoreMessageLoading: false,
			isShowNoMoreMessageTip: false,
			isShowPreferentialFlag: false,
			totalPage: 0,
			isMenuShow: false
		}
	}

	componentDidMount(props) {
		this.getAccount()
		this.getMessageList(1) // 0
	}


	getAccount() {
		fetchRequest(ApiPort.GetNewsUnreadNews, 'GET').then(res => {
			this.setState({
				unreadAnnouncementCount: res.unreadAnnouncementCount,
				unreadPersonalMessageCount: res.unreadPersonalMessageCount,
				unreadTransactionMessageCount: res.unreadTransactionMessageCount,
			})
		})
	}

	changeMessageIndex(index) {// 最顶部
		
		if (this.state.messageIndex === index) {
			return
		}

		this.setState({
			messageIndex: index,
			messageModalDropdownIndex: 0,
			inboxMessagesIndex: 0,
			pageSize,
			isHaveMoreMessage: true,
			isShowMoreMessageLoading: false,
			isShowNoMoreMessageTip: false
		}, () => {
			this.getMessageList(1)
		})
	}

	changeInboxMessagesIndex(index) {
		if (this.state.inboxMessagesIndex === index) {
			return
		}
		this.setState({
			messageModalDropdownIndex: 0,
			inboxMessagesIndex: index,
			pageSize,
			isHaveMoreMessage: true,
			isShowMoreMessageLoading: false,
			isShowNoMoreMessageTip: false
		}, () => {
			this.getMessageList(1)
		})
	}

	changeMessageModalDropdownIndex(index) { // 下拉
		if (this.state.messageModalDropdownIndex == index) return
		this.setState({
			messageModalDropdownIndex: index,
			pageSize,
			isHaveMoreMessage: true,
			isShowMoreMessageLoading: false,
			isShowNoMoreMessageTip: false
		}, () => {
			this.getMessageList(1)
		})
	}

	getMessageList(flag) {
		flag == 1 && this.setState({
			messageLists: []
		})
		flag == 1 && Toast.loading('กำลังโหลด',200)// Toast.loading('加载中...', 2000)
		const { messageIndex, pageSize, pageIndex, messageModalDropdownIndex, inboxMessagesIndex } = this.state
		const category = messageIndex == 0 ? InboxMessagesTabDatas[inboxMessagesIndex].category : 'announcement'
		const type = messageIndex == 0 ? (inboxMessagesIndex == 0 ? InboxMessageType2[messageModalDropdownIndex].type : 0) : AnnouncementMessageType[messageModalDropdownIndex].type
		fetchRequest(ApiPort.GetMessages + `${category}?type=${type}&row=${pageSize}&page=${pageIndex}&`, 'GET').then(data => {
			Toast.hide()
			if (data.newsInboxList.length <= 0) return
			this.setState({
				refreshing: false,
				messageLists: data.newsInboxList,
				//isShowNoMoreMessageTip: data.total <= 25,
				isHaveMoreMessage: data.total > 25,
				totalPage: data.total
			})
			if (messageIndex == 0) {
				if (inboxMessagesIndex == 0) {
					if (messageModalDropdownIndex == 0) {
						this.setState({
							unreadTransactionMessageCount: data.unread
						})
					}
				} else {
					this.setState({
						unreadPersonalMessageCount: data.unread
					})
				}
			} else {
				this.setState({
					unreadAnnouncementCount: data.unread
				})
			}
			if (flag == 2) {
				this.props.GetNewsUnreadNews()
				if (messageIndex == 0 && inboxMessagesIndex == 0) {

				}
			}
			if (flag == 3) {
				if (data.newsInboxList.length >= data.total) {
					this.setState({
						isHaveMoreMessage: false,
						isShowMoreMessageLoading: false,
						isShowNoMoreMessageTip: true
					})
				} else {
					// Toast.fail('没有更多消息了!', 2)
					this.setState({
						//isShowNoMoreMessageTip: true
					})
				}
			}
			this.getAccount()
		}).catch(error => {
			Toast.hide()
		})
	}

	putTransactionMarkAsRead(v) {
		// Toast.loading('加载中...', 2000)
		const { inboxMessagesIndex, messageIndex } = this.state
		const category = messageIndex == 0 ? InboxMessagesTabDatas[inboxMessagesIndex].category : 'announcement'
		fetchRequest(ApiPort.POSTActionOnInboxMessage + category + '/MarkAsRead/' + v.id + '?', 'PUT').then(res => {
			Toast.hide()
			if (res) {
				v.isRead = true
				this.setState({})
				this.getMessageList(2)
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	getMessageDetail(v) {
		const { messageIndex, inboxMessagesIndex } = this.state
		if (!(messageIndex == 0 && inboxMessagesIndex == 0)) {
			Actions.MessageDetail({ news: v, messageIndex })
		}
		
		if (!v.isRead) {
			v.isRead = true
			this.setState({})
			this.putTransactionMarkAsRead(v)
		}
		// Toast.loading('加载中...', 2000)
		// const category = messageIndex == 0 ? InboxMessagesTabDatas[inboxMessagesIndex].category : 'announcement'
		// fetchRequest(ApiPort.GetMessagesDetail + `${category}/${v.id}?`, 'GET').then(res => {
		// 	Toast.hide()
		// 	Actions.MessageDetail({ news: res, messageIndex })
		// 	if (!v.isRead) {
		// 		this.getMessageList(2)
		// 		v.isRead = true
		// 		this.setState({})
		// 	}
		// }).catch(err => {
		// 	Toast.hide()
		// })
	}

	createMessageList(item, i) {
		const { messageModalDropdownIndex } = this.state
		let flag = messageModalDropdownIndex * 1 === i * 1
		return <TouchableHighlight style={[styles.toreturnModalDropdownList]} key={i} underlayColor='#333333'>
			<Text style={[styles.toreturnModalDropdownListText, { color: flag ? '#00E62E' : '#F5F5F5' }]}>{item.title}</Text>
		</TouchableHighlight>
	}

	patchActionMessage() {
		const { messageLists, messageIndex, inboxMessagesIndex, messageModalDropdownIndex } = this.state
		if (messageLists.length <= 0) return
		Toast.loading('กำลังโหลด',200)
		//Toast.loading('加载中...', 2000)
		const category = messageIndex == 0 ? InboxMessagesTabDatas[inboxMessagesIndex].category : 'announcement'
		const type = messageIndex == 0 ? (inboxMessagesIndex == 0 ? InboxMessageType2[messageModalDropdownIndex].type : 0) : AnnouncementMessageType[messageModalDropdownIndex].type
		fetchRequest(ApiPort.POSTActionOnInboxMessage + `${category}/MarkAllAsRead?type=${type}&`, 'POST').then(res => {
			Toast.hide()
			messageLists.forEach(v => {
				v.isRead = true
			})
			this.setState({})
			this.getMessageList(2)
		}).catch(err => {
			Toast.hide()
		})
	}

	refreshingMessage() {
		this.setState({
			refreshing: true
		})
		this.getMessageList()
	}


	onMomentumScrollEnd(event) {
		const { isHaveMoreMessage } = this.state
		const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent

		const offsetY = contentOffset.y
		const screenH = layoutMeasurement.height
		const bottomY = offsetY + screenH

		const contentSizeHeight = contentSize.height

		if (Math.abs(bottomY - contentSizeHeight) <= 40) {
			if (isHaveMoreMessage) {
				this.setState({
					pageSize: this.state.pageSize + pageSize,
					isShowMoreMessageLoading: true
				}, () => {
					this.getMessageList(3)
				})
			} else {
				// Toast.fail('没有更多消息了!', 2)
				this.setState({
					//isShowNoMoreMessageTip: true
				})
			}
		}
	}

	onScrollPreferential(event) {
		let contentOffsetY = event.nativeEvent.contentOffset.y
		this.setState({
			isShowPreferentialFlag: Boolean(contentOffsetY >= 120),
		})
	}

	render() {
		const { totalPage, isShowPreferentialFlag, isShowNoMoreMessageTip, isShowMoreMessageLoading, unreadAnnouncementCount, unreadPersonalMessageCount, unreadTransactionMessageCount, refreshing, inboxMessagesIndex, messageLists, messageModalDropdownIndex, messageIndex, isMenuShow } = this.state
		const messageTypeFlag = messageIndex === 0
		const messageType = messageTypeFlag ? (InboxMessageType2) : AnnouncementMessageType
		return <View style={[styles.viewContainer]}>
			<ImageBackground
				style={styles.messageHead}
				source={Platform.OS == 'android' ? require('./../../../images/home/noimg.png') : require('./../../../images/home/pattern.png')}
				resizeMode='repeat'>
				<TouchableOpacity hitSlop={{ left: 10, right: 10, bottom: 0, top: 0 }}
					onPress={() => {
						Actions.pop()
					}}
				>
					<Image style={{ width: 28, height: 22 }}
						resizeMode='stretch'
						source={require('./../../../images/icon-back.png')}
					></Image>
				</TouchableOpacity>
				<View style={[styles.newsWraps]}>
					{
						NewsTabDatas.map((v, i) => {
							let flag = messageIndex * 1 === i
							let style = [styles.newsWrapsListText, { color: flag ? '#00E62E' : '#CCCCCC', fontWeight: 'normal' }]
							return <TouchableOpacity key={i} style={[styles.newsWrapsList, {
								borderBottomColor: flag ? '#00E62E' : 'transparent'
							}]} onPress={this.changeMessageIndex.bind(this, i)}>
								<Text style={style}>{v.title}</Text>
								{/*{*/}
								{/*	i === 0 && (unreadTransactionMessageCount + unreadPersonalMessageCount) > 0 && <View style={styles.unreadDot}></View>*/}
								{/*}*/}
								{
									i === 1 && unreadAnnouncementCount > 0 && <View style={styles.unreadDot}></View>
								}
							</TouchableOpacity>
						})
					}
				</View>

				<TouchableOpacity hitSlop={{ left: 10, right: 10, bottom: 0, top: 0 }} onPress={() => { Actions.LiveChatST() }}>
					<Image resizeMode='stretch' source={require('./../../../images/home/icon-csb.png')} style={{ width: 28, height: 28 }} />
				</TouchableOpacity>
			</ImageBackground>

			{
				messageIndex === 0 && <View style={[styles.rebateWraps]}>
					{
						InboxMessagesTabDatas.map((v, i) => {
							let flag = inboxMessagesIndex === v.inboxMessagesIndex
							return <TouchableOpacity
								key={i}
								onPress={this.changeInboxMessagesIndex.bind(this, v.inboxMessagesIndex)}
								style={[styles.rebateBox, {
									borderBottomColor: flag ? '#00E62E' : 'transparent'
								}]}
							>
								<Text style={{ color: flag ? '#00E62E' : '#CCCCCC', fontWeight: 'normal', fontSize: 14 }}>{v.title}</Text>

								{
									i == 0 && unreadTransactionMessageCount > 0 && <View style={unreadTransactionMessageCount > 99 ? styles.unreadBox1 : styles.unreadBox2}>
										<Text style={styles.unreadBoxText}>{unreadTransactionMessageCount > 99 ? '99+' : unreadTransactionMessageCount}</Text>
									</View>
								}
								{
									i == 1 && unreadPersonalMessageCount > 0 && <View style={unreadPersonalMessageCount > 99 ? styles.unreadBox1 : styles.unreadBox2}>
										<Text style={styles.unreadBoxText}>{unreadPersonalMessageCount > 99 ? '99+' : unreadPersonalMessageCount}</Text>
									</View>
								}
							</TouchableOpacity>
						})
					}
				</View>
			}

			<View style={styles.filterBox}>
				{
					(!(messageIndex === 0 && inboxMessagesIndex === 1)) ? <ModalDropdown
						animated={true}
						options={messageType}
						renderRow={this.createMessageList.bind(this)}
						onSelect={this.changeMessageModalDropdownIndex.bind(this)}
						style={[styles.toreturnModalDropdown, {borderColor: isMenuShow?'#00B324':'#757575'}]}
						onDropdownWillShow={() =>
							this.setState({ isMenuShow: true })
						}
						onDropdownWillHide={() =>
							this.setState({ isMenuShow: false })
						}
						dropdownStyle={[styles.toreturnDropdownStyle, { height: messageType.length * 48 }]}
					>
						<View style={styles.toreturnModalDropdownTextWrap}>
							<Text style={[styles.toreturnModalDropdownText]}>{messageType[messageModalDropdownIndex].title}</Text>
							<View style={[isMenuShow?styles.toreturnModalDropdownArrow2:styles.toreturnModalDropdownArrow]}></View>
						</View>
					</ModalDropdown>
						:
						<View style={[styles.toreturnModalDropdown, { borderWidth: 0 }]}></View>
				}

				<TouchableOpacity style={styles.informationModalDropdownBottom} onPress={this.patchActionMessage.bind(this)}>
					<Text style={[styles.informationModalDropdownBottomText]}>ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว</Text>
					{/* 标记全部已读 */}
				</TouchableOpacity>
			</View>

			{
				totalPage > 25 && isShowPreferentialFlag && <AnimatableView style={{
					position: 'absolute',
					right: 10,
					bottom: 40,
					zIndex: 1000,
					overflow: 'hidden'
				}}
					animation={isShowPreferentialFlag ? 'fadeInLeft' : 'fadeOutRight'}>
					<TouchableOpacity
						onPress={() => {
							this.scrollView.scrollTo({ x: 0, y: 0, animated: true }, 1)
						}}
					>
						<Image
							resizeMode='stretch'
							style={{
								width: 45,
								height: 45
							}}
							source={require('./../../../images/messageTop.png')}
						></Image>
					</TouchableOpacity>
				</AnimatableView>
			}
			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				style={styles.informationScrollView}
				removeClippedSubviews
				scrollEventThrottle={16}
				onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						tintColor={'#00E62E'}
						onRefresh={this.refreshingMessage.bind(this)}
					/>
				}
				onScroll={this.onScrollPreferential.bind(this)}
				ref={view => { this.scrollView = view }}
			>
				{
					messageLists.length > 0
						?
						messageLists.map((v, i) => {
							let flag = !v.isRead
							let tempMessageInfor = (messageIndex == 0 ? InboxMessageType2 : AnnouncementMessageType).find(v1 => v1.type * 1 === v.type)
							return <TouchableOpacity
								key={i}
								style={[styles.newsWrap]}
								onPress={this.getMessageDetail.bind(this, v)}
							>
								<View style={styles.messageListHead}>
									{
										flag && <View style={styles.readCircle}></View>
									}
									{
										tempMessageInfor && (!(messageIndex === 0 && inboxMessagesIndex === 1)) && <View
											style={[styles.messageListHeadName, {backgroundColor: tempMessageInfor.icon}]}>
											<Text style={styles.messageListHeadNameText}>{tempMessageInfor.title}</Text>
										</View>
									}
									<Text style={{
										color: '#F5F5F5',
										//fontWeight: 'bold',
										// width: width - 120,
										flexWrap: 'wrap',
										flex: 1,
										marginLeft: (messageIndex === 0 && inboxMessagesIndex === 1) ? 0 : 6
									}}>{v.title}</Text>
								</View>
								<View style={styles.messageListBody}>
									<HTMLView stylesheet={styleHtmlMsg} value={
										`<div style="
											color: #cccccc;
											font-size: 13px;"
										>${(messageIndex == 0 && inboxMessagesIndex == 0) ? v.content : v.contentSummary}</div>`
									}
											  style={{color: '#CCCCCC', fontSize: 13}}/>
									{/* <Text style={{ color: '#CCCCCC', fontSize: 13 }}>{v.content}</Text> */}
								</View>
								<View style={styles.messageListFooter}>
									<Text style={{
										color: '#999999',
										fontSize: 12
									}}>{moment((v.sendDate + '').replace(/[a-zA-Z]/g, ' ')).format('YYYY/MM/DD hh:mm')}</Text>
									{
										(!(messageIndex === 0 && inboxMessagesIndex === 0)) &&
										<Text style={{color: '#999999', fontSize: 12}}>รายละเอียด ></Text>
									}
								</View>
							</TouchableOpacity>
						})
						:
						<View style={{
							alignItems: 'center',
							marginTop: 100
						}}>
							<Image
								resizeMode='stretch'
								source={require('./../../../images/icon_queshengtu.png')}
								style={{
									width: .4 * width,
									height: .4 * width * .638,
									marginBottom: 40
								}}
							></Image>
							<Text style={{ color: '#999999' }}>ไม่มีประกาศ</Text>
						</View>
				}
				{
					isShowMoreMessageLoading && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
						<ActivityIndicator color='#00E62E'></ActivityIndicator>
						<Text style={{ color: '#999999', marginLeft: 10 }}>กำลังโหลด....</Text>
					</View>
				}

				{
					totalPage > 25 && isShowNoMoreMessageTip && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
						<Text style={{ color: '#999999', marginLeft: 10 }}>— end —</Text>
					</View>
				}


			</ScrollView>
		</View>
	}
}

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#000000'
	},
	messageListHead: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	readCircle: {
		width: 6,
		height: 6,
		backgroundColor: '#D20F26',
		borderRadius: 1000,
		position: 'absolute',
		left: -12,
		zIndex: 10000
	},
	messageListHeadName: {
		borderRadius: 4,
		paddingVertical: 2,
		paddingHorizontal: 4,
	},
	messageListHeadNameText: {
		color: '#F5F5F5',
		fontSize: 12
	},
	messageListBody: {
		marginTop: 13,
		marginBottom: 23
	},
	messageListFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	messageHead: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: isIphoneX ? 40 : 20,
		paddingHorizontal: 10
	},
	noMessageText: {
		textAlign: 'center',
		marginTop: 160
	},
	Notification: {
		width: 14,
		height: 14,
		position: 'absolute',
		right: -6,
		top: -6
	},
	inboxMessagesListItemImg: {
		width: 30,
		height: 26,
		marginRight: 10,
		position: 'absolute',
		marginLeft: 10
	},
	newsWrapsListText: {
		fontSize: 14
	},
	newsWraps: {
		flexDirection: 'row',
		marginHorizontal: -10,
		height: 34,
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	newsWrapsList: {
		marginRight: 12,
		position: 'relative',
		height: 34,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 2,
		paddingHorizontal: 15
	},
	unreadDot: {
		width: 6,
		height: 6,
		borderRadius: 1000,
		position: 'absolute',
		top: 4,
		right: 0,
		zIndex: 1000,
		backgroundColor: '#D20F26'
	},
	rebateWraps: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 15,
	},
	unreadBox1: {
		backgroundColor: '#D20F26',
		paddingVertical: 2,
		paddingHorizontal: 3,
		borderRadius: 1000,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 6,
		marginBottom: 15
	},
	unreadBox2: {
		backgroundColor: '#D20F26',
		width: 22,
		height: 22,
		borderRadius: 1000,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 6,
		marginBottom: 15
	},
	unreadBoxText: {
		color: '#CCCCCC',
		fontSize: 13
	},
	rebateBox: {
		height: 34,
		justifyContent: 'center',
		flexDirection: 'row',
		width: width / 2,
		alignItems: 'center',
		borderBottomWidth: 2,
		marginBottom: 8
	},
	informationModalDropdown: {
		marginTop: 8
	},
	toreturnModalDropdown: {
		height: 40,
		borderRadius: 4,
		borderWidth: 1,
		justifyContent: 'center',
		borderColor: '#757575',
		width: width * .4
	},
	toreturnDropdownStyle: {
		width: width * .4,
		backgroundColor: '#1A1A1A',
		marginTop: 10,
		borderWidth: 0,
		borderRadius: 4
	},
	filterBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 10,
		marginTop: 7,
		marginBottom: 12
	},
	toreturnModalDropdownTextWrap: {
		paddingLeft: 10,
		paddingRight: 10,
		paddingVertical: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	toreturnModalDropdownList: {
		height: 48,
		justifyContent: 'center',
		paddingLeft: 16,
		paddingRight: 16
	},
	toreturnModalDropdownListText: {},
	toreturnModalDropdownText: {
		fontSize: 14,
		color: '#F5F5F5'
	},
	toreturnModalDropdownArrow: {
		width: 0,
		height: 0,
		marginTop: 5,
		borderStyle: 'solid',
		borderWidth: 5,
		borderLeftColor: 'transparent',
		borderBottomColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#CCCCCC'
	},
	toreturnModalDropdownArrow2: {
		width: 0,
		height: 0,
		marginBottom: 5,
		borderStyle: 'solid',
		borderWidth: 5,
		borderLeftColor: 'transparent',
		borderTopColor: 'transparent',
		borderRightColor: 'transparent',
		borderBottomColor: '#CCCCCC'
	},
	informationModalDropdownBottom: {
		flexDirection: 'row',
		height: 34,
		alignItems: 'center'
	},
	informationModalDropdownBottomText: {
		fontSize: 12,
		//fontWeight: 'bold',
		textDecorationLine: 'underline',
		color: '#00B324'
	},
	informationScrollView: {
		marginHorizontal: 10,
		marginBottom: 20
	},
	newsWrap: {
		marginBottom: 10,
		paddingHorizontal: 10,
		paddingVertical: 10,
		paddingLeft: 20,
		position: 'relative',
		backgroundColor: '#222222',
		borderRadius: 6
	},
	informationRight: {
		position: 'relative',
		width: width - 50,
		paddingRight: 10
	},
	informationRightText1: {
		fontSize: 13
	},
	informationRightText2Box: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginTop: 2
	},
	informationRightText2: {
		fontSize: 12,
	},
	paginationBox: {
		zIndex: 10,
		position: 'absolute',
		bottom: 0,
		width,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
	},
	paginationBox1: {
		width: width - 20 - 80,
		height: 40,
		justifyContent: 'center'
	},
	paginationBox2: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
	},
	paginationText: {
		color: '#25AAE1'
	},
	paginationWrap: {
		borderWidth: 1,
		borderRadius: 4,
		width: 30,
		height: 30,
		marginHorizontal: 4,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#CCCCCC'
	},
	paginationComWrap: {
		position: 'absolute'
	}
})


const styleHtmlMsg = StyleSheet.create({
	div: {
		color: '#CCCCCC',
		fontSize: 13
	},
	p: {
		color: '#CCCCCC',
	},
	span: {
		color: '#CCCCCC',
	},
	i: {
		color: '#CCCCCC',
	},
	h1: {
		color: '#CCCCCC',
	},
	h2: {
		color: '#CCCCCC',
	},
})
