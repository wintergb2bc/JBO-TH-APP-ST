
import React, { Component, PropTypes } from 'react'
import {
	StyleSheet,
	WebView,
	Text,
	View,
	Animated,
	TouchableOpacity,
	Dimensions,
	Image,
	ScrollView,
	ImageBackground,
	Platform,
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import { Actions } from "react-native-router-flux";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import SportImage from '../SportImage'
const { width, height } = Dimensions.get("window");
/* 
	投注页面 公用头部  赛事比分概况
*/

const swiperConfigs = {
	loop: true,
	speed: 500,
	preloadImages: false,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	pagination: {
		el: '.swiper-pagination',
		bulletElement: 'li',
		hideOnClick: true,
		clickable: true
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
}

export default class Header extends Component {
	constructor() {
		super();
		this.state = {
			isOpen: false,
			eventDatas: '',
			activeSlide: 0,
			eventDatas: [],
		};
	}
	componentDidMount() {
		console.log('this.props.Vendor', this.props.Vendor)
		this.props.HeaderRef && this.props.HeaderRef(this);
		/* 默认足球 */
		this.getBannerData(1);
	}

	componentWillUnmount() {
		this.props.Vendor.deletePolling(this.bannerPollingKey);
	}

	getBannerData(ID) {
		this.bannerPollingKey = this.props.Vendor.getBannerDataPollingGlobal('banner', (eventDatas) => {
			let list = []
			let num = 0;
			let items = []
			eventDatas.forEach((item, index) => {
				num += 1
				items.push(item)
				if (num == 2) {
					list.push(items)
					num = 0
					items = []
				}

			})

			this.setState({
				eventDatas: list
			})
		}, ID);
	}

	goDetaile(EventData) {
		// ${ this.props.Vendor.configs.VendorPage } /detail?sid=${EventData.SportId}&eid=${EventData.EventId}&lid=${EventData.LeagueId}
		let dataList = {
			eid: EventData.EventId,
			sid: EventData.SportId,
			lid: EventData.LeagueId,
			// OE: IsOutRightEvent,
			// BetMore: this.state.PlayBetCart
		}
		UMonEvent('Match', 'Launch', 'Mainpage_banner')
		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor })
		console.log('EventDataEventData', EventData.EventId)
	}

	_renderBannerItem2 = (item, index) => {
		return (
			<View key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', height: 0.333 * (width - 20), width: width - 20 }}>
				{
					item[0] &&
					<Touch onPress={() => { this.goDetaile(item[0]) }} style={styles.BannerList}>
						<View style={styles.temas}>
							{/* <Image resizeMode='stretch' source={require('../../images/betting/fun88.png')} style={{ width: 20, height: 20 }} /> */}
							<SportImage imgsID={item[0].HomeTeamId} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[0].HomeTeamName}</Text>
							{
							item[0].IsRB &&
								item[0].HomeRedCard &&
								parseInt(item[0].HomeRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[0].HomeRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
						{
							item[0].IsRB &&
							<View style={styles.temasVS}>
								<View style={[styles.temasVS, { flexDirection: 'row' }]}>
									<Text style={{ color: item[0].HomeScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[0].HomeScore}</Text>
									<Text style={{ color: '#fff', padding: 8 }}>-</Text>
									<Text style={{ color: item[0].AwayScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[0].AwayScore}</Text>
								</View>
								<View style={styles.gameNumber}>
									<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>{item[0].RBMinute}'</Text>
								</View>
							</View>
						}
						{
							!item[0].IsRB &&
							<View style={styles.temasVS}>
								<View style={{position: 'absolute', top: -10,}}>
									<Text style={{ color: '#fff', fontSize: 12, width: 90, textAlign: 'center' }}>{item[0].getEventDateMoment().format('MM/DD HH:mm')}</Text>
								</View>
								<Text style={{ color: '#fff', padding: 8 }}>VS</Text>
								<Text style={{ color: '#fff', fontSize: 12 }}>ยังไม่เริ่มการแข่งขัน</Text>
							</View>
						}

						<View style={styles.temas}>
							<SportImage imgsID={item[0].AwayTeamId} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[0].AwayTeamName}</Text>
							{
							item[0].IsRB &&
								item[0].AwayRedCard &&
								parseInt(item[0].AwayRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[0].AwayRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
					</Touch>
				}

				<View style={{ width: 1, backgroundColor: '#fff', height: 0.29 * (width - 20) }} />
				{
					item[1] &&
					<Touch onPress={() => { this.goDetaile(item[1]) }} style={styles.BannerList}>
						<View style={styles.temas}>
							<SportImage imgsID={item[1].HomeTeamId} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[1].HomeTeamName}</Text>
							{
							item[1].IsRB &&
								item[1].HomeRedCard &&
								parseInt(item[1].HomeRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[1].HomeRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
						{
							item[1].IsRB &&
							<View style={styles.temasVS}>
								<View style={[styles.temasVS, { flexDirection: 'row' }]}>
									<Text style={{ color: item[1].HomeScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[1].HomeScore}</Text>
									<Text style={{ color: '#fff', padding: 8 }}>-</Text>
									<Text style={{ color: item[1].AwayScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item[1].AwayScore}</Text>
								</View>
								<View style={styles.gameNumber}>
									<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>{item[1].RBMinute}'</Text>
								</View>
							</View>
						}
						{
							!item[1].IsRB &&
							<View style={styles.temasVS}>
								<View style={{position: 'absolute', top: -10,}}>
									<Text style={{ color: '#fff', fontSize: 12, width: 90, textAlign: 'center' }}>{item[1].getEventDateMoment().format('MM/DD HH:mm')}</Text>
								</View>
								<Text style={{ color: '#fff', padding: 8 }}>VS</Text>
								<Text style={{ color: '#fff', fontSize: 12 }}>ยังไม่เริ่มการแข่งขัน</Text>
							</View>
						}

						<View style={styles.temas}>
							<SportImage imgsID={item[1].AwayTeamId} />
							<Text style={styles.temasTxt} numberOfLines={1}>{item[1].AwayTeamName}</Text>
							{
							item[1].IsRB &&
								item[1].AwayRedCard &&
								parseInt(item[1].AwayRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3,paddingRight: 3 }}>
										<Text style={{color: '#fff', fontSize: 12}}>{item[1].AwayRedCard ?? 0}</Text>
									</View>
								)
							:<Text style={{color: 'transparent'}}>0</Text>
							}
						</View>
					</Touch>
				}
			</View>
		);
	}
	get pagination2() {
		const { activeSlide, eventDatas } = this.state;
		return (

			<Pagination
				dotsLength={eventDatas.length}
				activeDotIndex={activeSlide}
				containerStyle={{position: 'absolute',bottom: -26}}
				dotStyle={{
					width: 8,
					height: 8,
					borderRadius: 5,
					backgroundColor: '#00A6FF',
				}}
				inactiveDotStyle={{
					// Define styles for inactive dots here
				}}
				inactiveDotOpacity={0.4}
				inactiveDotScale={0.6}
		  />
		);
	}

	render() {
		const { eventDatas } = this.state;
		//console.log('eventDataseventDatas', eventDatas)
		return (
			<View>
				{
					<View style={{ width: width, padding: 10, display: 'flex',justifyContent: 'center',alignItems: 'center',paddingBottom: 10 }}>
						<ImageBackground
							style={{ width: width - 20, height: 0.333 * (width - 20), display: 'flex',justifyContent: 'center',alignItems: 'center' }}
							resizeMode="stretch"
							source={require("../../../images/betting/header.png")}
						>
							{
								eventDatas.length > 0 &&
								<View>
									{/* <SnapCarousel
										ref={c => {
											this._snapcarousel = c;
										}}
										data={eventDatas}
										renderItem={this._renderBannerItem2}
										onSnapToItem={index => this.setState({ activeSlide: index })}
										sliderWidth={width - 20}
										sliderHeight={0.333 * (width - 20)}
										itemWidth={width - 10}
										hasParallaxImages={true}
										firstItem={0}
										loop={true}
										autoplay={true}
									/> */}
									<ScrollView
										horizontal={true}
										pagingEnabled={true}
										showsHorizontalScrollIndicator={false}
										showsVerticalScrollIndicator={false}
										onMomentumScrollEnd = {(e) => {
											let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
											let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

											let activeSlide = 0
											if(offsetY != 0) {
												//滑动块数
												activeSlide = offsetY / oriageScrollWidth
											}
											this.setState({activeSlide})
										}}
									>
										{
											eventDatas.map((item, index) => {
												return(
													<View key={index}>
														{this._renderBannerItem2(item, index)}
													</View>
												)
											})
										}
									</ScrollView>
								</View>
							}
						</ImageBackground>
						<View style={{display: 'flex', justifyContent: 'center',alignItems: 'center', flexDirection: 'row', paddingTop: 10}}>
							{
								eventDatas.length > 0 && eventDatas.map((item, index) => {
									return(
										<View key={index} style={this.state.activeSlide == index? styles.activeSlide : styles.noactiveSlide} />
									)
								})
							}
						</View>
						{/* {this.pagination2} */}
					</View>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	activeSlide: {
		width: 20,
		height: 5,
		backgroundColor: '#00a6ff',
		borderRadius: 10,
		marginLeft: 5,
	},
	noactiveSlide: {
		width: 5,
		height: 5,
		backgroundColor: '#BCBEC3',
		borderRadius: 10,
		marginLeft: 5,
	},
	BannerList: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: (width - 20) * 0.49,
	},
	temas: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20) * 0.15,
	},
	temasVS: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		// width: (width - 20) * 0.08,
	},
	gameNumber: {
		backgroundColor: '#eb2121',
		borderRadius: 5,
		width: 30,
	},
	temasTxt: {
		fontSize: 12,
		color: '#fff',
		width: (width - 20) * 0.15,
		paddingTop: 10,
		textAlign: 'center'
	},
})
