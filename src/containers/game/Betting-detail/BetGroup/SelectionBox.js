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
	Modal,
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import Touch from "react-native-touch-once";
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
const { width, height } = Dimensions.get("window");
import React from "react";
// import { ChangeSvg } from '$LIB/js/util';
// import Router from 'next/router';


export default class _SelectionBox extends React.Component {
	render() {
		const { IndexInArray, LineData, OddsUpData, OddsDownData, BetMore, BetCartdata } = this.props;
		const { SelectionCountInLine, Selections } = LineData;
		//從LineData.SelectionCountInLine直接指定樣式
		const ulClassMapping = {
			1: 'Group-3', //這個class名字叫3  實際上是給 單一個投注選項 放一整行用的
			2: 'Group-2' //一行放2個
		};
		const ulClass = ulClassMapping[SelectionCountInLine] ? ulClassMapping[SelectionCountInLine] : ''; //默認  沒class的 支持一行放3個
		let width = this.props.detailWidth
		return (
			<View style={styles.listData}>
				{//這裡針對 主客隊 相關玩法(讓球,角球總數等) 展示隊伍名
					IndexInArray === 0 &&
					LineData.IsDisplayByTeam && (
						<View style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center',width: width, flexDirection: 'row',flexWrap: 'wrap',}}>
							<View>
								<Text style={{
									width: SelectionCountInLine == 3 ? width * 0.25 : width * 0.35,
									textAlign: 'center',
									color: '#F5F5F5'
								}}>{LineData.HomeTeamName}</Text>
							</View>
							{SelectionCountInLine == 3 ? (
								<View>
									<Text style={{ color: 'transparent' }}>11</Text>
								</View>
							) : null //湊三個符合排版
							}
							<View>
								<Text style={{
									width: SelectionCountInLine == 3 ? width * 0.25 : width * 0.35,
									textAlign: 'center',
									color: '#F5F5F5'
								}}>{LineData.AwayTeamName}</Text>
							</View>
						</View>
					)}
				<View style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center',width: width, flexDirection: 'row',flexWrap: 'wrap',}}>
					{Selections.map((item, index) => {
						let Upstatus =
							OddsUpData != ''
								? OddsUpData.some(function (items) {
									if (
										/* 	item.EventId === items.EventId && */
										LineData.LineId == items.LineId &&
										item.SelectionId == items.SelectionId
									) {
										return true;
									}
								})
								: false;
						let Downstatus =
							OddsDownData != ''
								? OddsDownData.some(function (items) {
									if (
										/* i.EventId === items.EventId && */
										LineData.LineId == items.LineId &&
										item.SelectionId == items.SelectionId
									) {
										return true;
									}
								})
								: false;
						let CheckSelect = BetMore ? BetCartdata.filter((i) => i.SelectionId == item.SelectionId) : [];
						return (
							<Touch
								key={index}
								onPress={() => {
									if (!global.localStorage.getItem('loginStatus') == 1) {
										// Router.push('/login');
										window.openOrientation && window.openOrientation()
										Actions.logins({from: 'Betting-detail'})
										return;
									}
									if (!item.DisplayOdds || item.DisplayOdds == 0) return;
									this.props.PushBetCart(item, 1);
								}}
								style={[
									SelectionCountInLine == 3 ? [styles.SelectionHeader3,{width: width * 0.3,}] :
										SelectionCountInLine == 2 ? [styles.SelectionHeader2,{width: width * 0.4,}] :
											[styles.SelectionHeader1,{width: width * 0.8}]
								]}
								// className={CheckSelect != '' ? 'active' : ''}
							>
								<Text style={[
									SelectionCountInLine == 1 ? {fontSize: 13,width: width * 0.4, color: '#999999'} :
									SelectionCountInLine == 3 ? {fontSize: 13,width: width * 0.15, color: '#999999'} : 
									{fontSize: 13, color: '#999999'}]}>{item.SelectionName}</Text>
								{item.Handicap !== null ? <Text style={{color: '#999999'}}>{item.Handicap}</Text> : null}
								<View style={[
									SelectionCountInLine == 1 ?
									{color: '#999999', display: 'flex',justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: width * 0.2}
									: 
									{color: '#999999', display: 'flex',justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}
								]}>
									{!item.DisplayOdds || item.DisplayOdds == 0 ? (
										<Text>—</Text>
									) : (
											// <span
											// 	dangerouslySetInnerHTML={{
											// 		__html: ChangeSvg(item.DisplayOdds)
											// 	}}
											// 	className="NumberBet"
											// />
											<Text
												style={{
													fontSize: 13,
													color: Downstatus? '#FF2D12': Upstatus? '#00E62E': '#F5F5F5'
												}}
											>
												{item.DisplayOdds}
											</Text>
										)}

									{Downstatus ? (
										<Image resizeMode='stretch' source={require('../../../../images/betting/round-down.png')} style={{ width: 10, height: 10 }} />
										// <img src="/svg/betting/round-down.svg" />
									) : Upstatus ? (
										<Image resizeMode='stretch' source={require('../../../../images/betting/round-up.png')} style={{ width: 10, height: 10 }} />
										// <img src="/svg/betting/round-up.svg" />
									) : (
												null
											)}
								</View>
							</Touch>
						);
					})}
				</View>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	listData: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	SelectionHeader1: {
		backgroundColor: '#3E3E3E',
		height: 38,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 10,
		borderRadius: 77,
		paddingLeft: 8,
		paddingRight: 8,
	},
	SelectionHeader2: {
		backgroundColor: '#3E3E3E',
		height: 38,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
		borderRadius: 77,
	},
	SelectionHeader3: {
		
		backgroundColor: '#3E3E3E',
		height: 38,
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		marginTop: 10,
		borderRadius: 77,
	}
})
