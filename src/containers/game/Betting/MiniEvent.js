/* 賽事列表頁-從詳情頁來的縮小框 */

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
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import SportImage from '../SportImage'
const { width, height } = Dimensions.get("window");
import DetailHeader from '../Betting-detail/Detail-Header'
import React from "react";

class MiniEvent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			EventData: null,
		}
	}

	componentDidMount() {
		const { Vendor, EventId, SportId } = this.props;
		//console.log('=== mini event mount',EventId);
		if (!EventId) {
			return;
		}

		this.eventPollingKey = Vendor.getEventDetailPolling(pr => {
			//console.log('=== mini event',pr);
			this.setState({ EventData: pr.NewData });
		}, SportId, EventId, false, 'MINI') //指定 unique name = MINI 和詳情頁的polling區隔
	}

	componentWillUnmount() {
		//console.log('=== mini event unmount',this.props.EventId);
		this.props.Vendor.deletePolling(this.eventPollingKey);
	}

	render() {
		const { Vendor, CloseMini, ShowType } = this.props;
		const { EventData } = this.state;

		return EventData ? (
			<View style={styles.minView}>
				<View className="detail-wrap">
					<DetailHeader thumbStatus={true} Vendor={Vendor} EventData={EventData} defaultShowType={ShowType} MiniEvent={true} headerWidth={width} headerHeight={width * 0.555} />
				</View>
				<View style={styles.bettingList}>
					<View>
						<View style={styles.listItem}>
							{/* <LazyImageForTeam Vendor={Vendor} TeamId={EventData.HomeTeamId} /> */}
							<SportImage imgsID={EventData.HomeTeamId} />
							<Text style={{ color: '#000', width: width * 0.35 }} numberOfLines={1}>{EventData.HomeTeamName}</Text>
							{/* <Text className={"pk-number" + ((EventData.HomeScore && parseInt(EventData.HomeScore) > 0) ? ' notZero' : '')}> */}
							<Text style={{
								color: EventData.HomeScore && parseInt(EventData.HomeScore) > 0 ? '#bcbec3' : '#bcbec3'
							}}>
								{EventData.IsRB ? EventData.HomeScore : ''}
							</Text>
						</View>
						<View style={styles.listItem}>
							{/* <LazyImageForTeam Vendor={Vendor} TeamId={EventData.AwayTeamId} /> */}
							<SportImage imgsID={EventData.AwayTeamId} />
							<Text style={{ color: '#000', width: width * 0.35 }} numberOfLines={1}>{EventData.AwayTeamName}</Text>
							{/* <Text className={"pk-number" + ((EventData.AwayScore && parseInt(EventData.AwayScore) > 0) ? ' notZero' : '')}> */}
							<Text style={{
								color: EventData.AwayScore && parseInt(EventData.AwayScore) > 0 ? '#bcbec3' : '#bcbec3'
							}}>
								{EventData.IsRB ? EventData.AwayScore : ''}
							</Text>
						</View>
					</View>
					<Touch onPress={() => { this.props.CloseMini() }} style={{ marginLeft: 25 }}>
						<Image resizeMode='stretch' source={require('../../../images/close.png')} style={{ width: 15, height: 15 }} />
					</Touch>
				</View>
				{/* <ReactSVG
					src="/svg/close.svg"
					className="home-thumb-close-icon"
					onClick={() => {
						CloseMini();
					}}
				/> */}
			</View>
		) : null
	}
}
const styles = StyleSheet.create({
	minView: {
		height: width * 0.2,
		width: width,
		overflow: 'hidden',
		backgroundColor: '#fff',
		borderTopColor: '#efeff4',
		borderTopWidth: 1,
	},
	bettingList: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 99,
		height: width * 0.2,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		paddingRight: 10,
	},
	listItem: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	}
});
export default MiniEvent;
