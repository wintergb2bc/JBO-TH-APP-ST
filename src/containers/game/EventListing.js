
import { EventChangeType, SortWays, SpecialUpdateType, VendorMarkets } from '../lib/vendor/data/VendorConsts';
import reactUpdate from 'immutability-helper';
import Header from './Header';
import Nav from './Header/nav';
import Betting from './Betting'
import moment from 'moment';
import {PushLayout} from '../containers/Layout'
import React, { Component, PropTypes } from 'react'
import Guide from '../containers/Guide'
import BetCartPopup from './Betting/BetCartPopup'
import {
	StyleSheet,
	WebView,
	Text,
	NativeModules,
	FlatList,
	View,
	Animated,
	TouchableOpacity,
	Dimensions,
	Image,
	ScrollView,
	Platform,
	TextInput,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
import MiniEvent from './Betting/MiniEvent'
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");


const EventPerPageCount = 10; //分頁展示，默認每頁(每次展示)多少筆
export default class EventListing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			SportDatas: [],
			EventDatas: [],
			EventDetail: null,
			OddsUpData: { Events: {}, Lines: {}, Selections: {} } /* 上升赔率 */,
			OddsDownData: { Events: {}, Lines: {}, Selections: {} } /* 下降赔率 */,
			EventDataslength: 0,
			Loading: false,
			layoutHeaderHeight: 0,
			firstloade: true,
			init: EventPerPageCount,
			//從詳情頁過來的 縮小的比分框
			showMiniEvent: false,
			miniEventId: null,
			miniSportId: 1,
			miniLeagueId: null,
			miniShowType: 0,
			showPush: false,
			BetType: '',
			navTop: false,
			isMores: true,
			hasMore: true,
			BetCartdataBack: [],
			GuideTop: 0,
			GuideLeft: 0,
		};
	}

	//默認查詢
	getDefaultQueryParams() {
		const theDayAfterTenDays = moment().add(10, 'days').format('YYYY-MM-DD');
		const theDaytoday = moment().format('YYYY-MM-DD');
		const type = {
			SportId: 1 /* 体育类型 不分Vendor 1 都是默認足球 */,
			MarketId: VendorMarkets.TODAY /* 市场类型 */, //默認今天
			SortWay: SortWays.LeagueName /* 排序 */, //默認聯賽排序
			StartDate: theDaytoday /* 开始时间 */,
			EndDate: theDayAfterTenDays /* 结束时间 */
		};
		this.setState({
			BetType: type
		});
		return type;
	}

	componentDidMount() {
		const { Vendor } = this.props;
		//輪詢 體育計數
		this.sportsPollingKey = Vendor.getSportsPollingGlobal('eventListing', (PollingResult) => {
			//console.log('===update Sports', PollingResult);

			let newState = { SportDatas: PollingResult.NewData };

			if (this.state.firstloade === true) {  //避免整頁刷新
				newState.firstloade = false;
			}
			this.setState(newState);
		});

		//強制更新 體育計數 for 關注比賽移除 使用
		const updateSportsCount = (thisVendorName) => {
			if (Vendor.configs.VendorName === thisVendorName) { //同vendor才適用
				Vendor.getSports().then((PollingResult) => {
					//console.log('===eventListing_updateSportsCount');
					this.setState({ SportDatas: PollingResult.NewData });
				});
			}
		}
		if (typeof window !== "undefined") { //綁定到window上 全局可用
			window.eventListing_updateSportsCount = updateSportsCount.bind(this);
		}
		//沒有查詢參數，就傳默認的
		const defaultQuery = this.getDefaultQueryParams();
		this.GetEvents(defaultQuery, false); //默認參數不用更新網址鏈接

		// const { query } = this.props.router; //從鏈接獲取要加載的參數
		// console.log('queryqueryqueryquery',query)
		// //沒有查詢參數，就傳默認的
		// const defaultQuery = this.getDefaultQueryParams();
		// if (JSON.stringify(query) === '{}' || !query) {
		// 	//console.log('===DidMount load default',JSON.parse(JSON.stringify(query)))
		// 	this.GetEvents(defaultQuery, false); //默認參數不用更新網址鏈接
		// } else {
		// 	//有傳入參數
		// 	const thisQuery = Object.assign({}, defaultQuery, query);
		// 	//處理一下數據格式，要用int型態
		// 	if (thisQuery.SportId) {
		// 		thisQuery.SportId = parseInt(thisQuery.SportId);
		// 	}
		// 	if (thisQuery.MarketId) {
		// 		thisQuery.MarketId = parseInt(thisQuery.MarketId);
		// 	}
		// 	if (thisQuery.SortWay) {
		// 		thisQuery.SortWay = parseInt(thisQuery.SortWay);
		// 	}

		// 	//console.log('===DidMount load from query',JSON.parse(JSON.stringify(query)))

		// 	this.GetEvents(thisQuery);

		// 	if (thisQuery.miniEventId) {
		// 		this.setState({
		// 			showMiniEvent: true,
		// 			miniEventId: thisQuery.miniEventId,
		// 			miniSportId: thisQuery.miniSportId,
		// 			miniLeagueId: thisQuery.miniLeagueId,
		// 			miniShowType: thisQuery.miniShowType,
		// 		});
		// 	}
		// }
	}

	componentWillUnmount() {
		const { Vendor } = this.props;
		Vendor.deletePolling(this.sportsPollingKey);
		Vendor.deletePolling(this.eventPollingKey);

		//強制更新 體育計數 for 關注比賽移除 使用
		if (typeof window !== "undefined") {
			window.eventListing_updateSportsCount = null;
		}
	}

	/* 获取游戏列表数据 */
	GetEvents = (type, updateUrl = true) => {
		const { Vendor } = this.props;
		//輪詢 比賽數據
		this.setState({
			Loading: true,
			BetType: type,
			hasMore: true,
			isMores: true,
			init: EventPerPageCount,
		});
		this._flatList && this._flatList.scrollToOffset({ animated: false, offset: 0 });
		this.eventPollingKey = Vendor.getEventsPollingGlobal('eventListing',
			(PollingResult) => {
				//console.log('===update Events', PollingResult);

				//處理 數據變化
				let OddsUpData = { Events: {}, Lines: {}, Selections: {} };
				let OddsDownData = { Events: {}, Lines: {}, Selections: {} };
				PollingResult.Changes.map((changeData) => {
					//類型：更新
					if (changeData.ChangeType === EventChangeType.Update) {
						changeData.SpecialUpdates.map((sUpdateData) => {
							const thisEventId = changeData.EventId; //比賽ID
							// 處理賠率上升動畫
							if (sUpdateData.UpdateType === SpecialUpdateType.OddsUp) {
								const thisLineId = sUpdateData.LineId; //投注線ID
								const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
								const lineKey = thisEventId + '|||' + thisLineId;
								const selectionKey = thisEventId + '|||' + thisLineId + '|||' + thisSelectionId;
								OddsUpData.Events[thisEventId] = true;
								OddsUpData.Lines[lineKey] = true;
								OddsUpData.Selections[selectionKey] = true;
							}
							// 處理賠率下降動畫
							if (sUpdateData.UpdateType === SpecialUpdateType.OddsDown) {
								const thisLineId = sUpdateData.LineId; //投注線ID
								const thisSelectionId = sUpdateData.SelectionId; //投注選項ID
								const lineKey = thisEventId + '|||' + thisLineId;
								const selectionKey = thisEventId + '|||' + thisLineId + '|||' + thisSelectionId;
								OddsDownData.Events[thisEventId] = true;
								OddsDownData.Lines[lineKey] = true;
								OddsDownData.Selections[selectionKey] = true;
							}
						});
					}
				});

				//整理一次setState 避免多次刷新
				let newState = {
					Loading: false,
					EventDatas: PollingResult.NewData,
					OddsUpData,
					OddsDownData,
				};

				if (this.state.firstloade === true) { //避免整頁刷新
					newState.firstloade = false;
				}

				this.setState(newState);
			},
			type.SportId,
			type.MarketId,
			type.SortWay,
			type.StartDate,
			type.EndDate
		); // <==查詢參數


		//通知數據更新
		if (this.BettingRef) {
			this.BettingRef.onEventsRefresh();
		}
	};

	//切換關注比賽
	toggleFavourite = (event) => {
		const { Vendor } = this.props;
		if (!event.IsFavourite) {
			Vendor.addFavouriteEvent(event.EventId, event.SportId, event.IsOutRightEvent);
		} else {
			Vendor.removeFavouriteEvent(event.EventId);
		}
		setTimeout(() => {
			//更新count
			Vendor.getSports().then((PollingResult) => {
				this.setState({ SportDatas: PollingResult.NewData });
			});
		},200)

		//更新賽事列表
		let targetIndex = -1;
		this.state.EventDatas.map((item, index) => {
			if (item.EventId === event.EventId) {
				targetIndex = index;
			}
		});
		if (targetIndex > -1) {
			let updates = {};
			updates[targetIndex] = { IsFavourite: { $set: !event.IsFavourite } };
			this.setState({ EventDatas: reactUpdate(this.state.EventDatas, updates) });
		}
	};

	_renderFooter = () => {
		const { hasMore, isMores } = this.state;
		return(
			<View style={{flex: 1}}>
				{
					isMores && hasMore &&
					<View style={styles.moreLodin}>
						<ActivityIndicator color="#00A6FF" />
						<Text style={{color: '#999', fontSize: 12}}>加载更多...</Text>
					</View>
				}
				{
					isMores && !hasMore &&
					<View>
						<Text style={{color: '#999', fontSize: 12, lineHeight: 50, textAlign: 'center'}}>没有更多了</Text>
					</View>
				}
			</View>
		)
	}
	_onEndReached =() => {
		setTimeout(() => {
			if (!this.hasMoreData() && this.state.EventDatas.length > 0) {
				this.setState({
					hasMore: false
				});
			} else {
				this.setState({
					init: this.state.init + EventPerPageCount,
				});
			}
		}, 1500);
	}
	hasMoreData = () => {
		return this.state.EventDatas ? this.state.init < this.state.EventDatas.length : false;
	};
	isMore = () => {
		this.setState({isMores: false})
	}
	BetCartdataBack = (data) => {
		let BetCartdataBack = data ? data: []
		this.setState({BetCartdataBack})
	}


	getGuide = (e) => {
		NativeModules.UIManager.measure(e.target, (x, y, width, height, px, py) => {
			this.setState({
				GuideTop: py,
				GuideLeft: px + 30,
			});
		});
	}
	//引导下一步
	GuideChange = (key) => {
		if(key == 1) {
			this.setState({
				GuideLeft: width - 200,
			});
		} else if(key == 2) {
			if(this.NavRef) {
				this.setState({
					GuideTop: this.NavRef.state.GuideTop + 48,
					GuideLeft: this.NavRef.state.GuideLeft,
				});
			}
		} else if(key == 3) {
			this.setState({
				GuideLeft: width - 200,
			});
		}
	}

	_onLayoutHeader = (event) => {
		let { width, height } = event.nativeEvent.layout;
		this.setState({layoutHeaderHeight: height})
	}


	asasa = () => {
		const { 
			SportDatas, 
			EventDatas, 
			OddsUpData, 
			OddsDownData, 
			Loading, 
			firstloade, 
			BetType,
			init,
			GuideTop,
			GuideLeft,
			navTop,
		} = this.state;
		const { Vendor } = this.props;
		return (
			<View>
				<View onLayout={this._onLayoutHeader}>
					<Header
						Vendor={Vendor}
						HeaderRef={(ref) => { this.HeaderRef = ref; }}
					/>
				</View>
				{
					!navTop &&
					<View>
						<Nav
							NavRef={(ref) => { this.NavRef = ref; }}
							MenuChange={(ID) => {
								//菜單 體育項目變化=>刷新banner數據
								if (this.HeaderRef) {
									this.HeaderRef.getBannerData(ID);
								}
							}}
							onToggleButtonClicked={expandAll => {
								//菜單 點擊全展開/全收起按鈕=>賽事列表展開/收起
								if (this.BettingRef) {
									this.BettingRef.toggleAll(expandAll);
								}
							}}
							Vendor={Vendor}
							SportDatas={SportDatas}
							GetEvents={(e) => this.GetEvents(e)}
							Loading={Loading}
							BetType={BetType}
						/>
					</View>
				}
				<Betting
					BettingRef={(ref) => { this.BettingRef = ref; }}
					onAllLeaguesToggled={isExpandAll => {
						//賽事列表 全展開 或 全收起=> 菜單的 全展開/全收起按鈕 要一起變化
						if (this.NavRef) {
							this.NavRef.changeToggleButtonStatus(isExpandAll);
						}
					}}
					URL={Vendor.configs.VendorPage}
					Vendor={Vendor}
					ToggleFavourite={this.toggleFavourite}
					OddsUpData={OddsUpData} /* 上升赔率 */
					OddsDownData={OddsDownData} /* 下降赔率 */
					SportDatas={SportDatas} /* 游戏类型 和游戏数据计数 */
					EventDatas={EventDatas.slice(0, init)} /* 当前进行的所有赛事 */
					GetEvents={(e) => this.GetEvents(e)}
					Loading={Loading}
					BetType={BetType}
					isMore={this.isMore}
					BetCartdataBack={this.BetCartdataBack}
				/>
			</View>
		)
	}

	render() {
		window.betHomeBetCartdata = (data) => {
			//更新home注单icon
			let BetCartdataBack = data ? data: []
			this.setState({BetCartdataBack})
		}

		window.MiniEventShow = (showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType) => {
			this.setState({
				showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType
			})
		}
		const { 
			SportDatas, 
			EventDatas, 
			OddsUpData, 
			OddsDownData, 
			Loading, 
			firstloade, 
			BetType,
			init,
			GuideTop,
			GuideLeft,
			navTop,
			layoutHeaderHeight,
		} = this.state;
		const { Vendor } = this.props;
		window.showPushHome = (showPush) => {
			this.setState({showPush})
		}
		console.log('this.BettingRef',this.BettingRef && this.BettingRef.state.BetCartdata || '')
		return (
			<View style={{ flex: 1 }} onLayout={(e) => this.getGuide(e)}>
				{/* 推送提示 */}
				<PushLayout showPush={this.state.showPush} />
				{
					navTop &&
					<View>
						<Nav
							NavRef={(ref) => { this.NavRef = ref; }}
							MenuChange={(ID) => {
								//菜單 體育項目變化=>刷新banner數據
								if (this.HeaderRef) {
									this.HeaderRef.getBannerData(ID);
								}
							}}
							onToggleButtonClicked={expandAll => {
								//菜單 點擊全展開/全收起按鈕=>賽事列表展開/收起
								if (this.BettingRef) {
									this.BettingRef.toggleAll(expandAll);
									this._flatList && this._flatList.scrollToOffset({ animated: false, offset: 0 });
								}
							}}
							Vendor={Vendor}
							SportDatas={SportDatas}
							GetEvents={(e) => this.GetEvents(e)}
							Loading={Loading}
							BetType={BetType}
						/>
					</View>
				}
				<FlatList
					onScroll={(e) => {
						let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
						let offsetH = layoutHeaderHeight
						if(offsetY > offsetH - 15 && !navTop) {
							this.setState({navTop: true})
						}
						if(offsetY < offsetH + 15 && navTop) {
							this.setState({navTop: false})
						}
					}}
					showsVerticalScrollIndicator={false} //是否显示垂直滚动条
					showsHorizontalScrollIndicator={false} //是否显示水平滚动条
					automaticallyAdjustContentInsets={false}
					numColumns={1} //每行显示2个
					ref={flatList => (this._flatList = flatList)}
					renderItem={this.asasa}
					enableEmptySections={true} //数据可以为空
					onEndReachedThreshold={0.05} //执行上啦的时候1%执行
					onEndReached={this._onEndReached}
					ListFooterComponent={this._renderFooter}//尾巴
					keyExtractor={(item, index) => (item.key = index)}
					onRefresh={this.onRefresh}
					data={[1]}
					extraData={[1]}

					windowSize={3}
					removeClippedSubviews={Platform.OS === 'android'}
					maxToRenderPerBatch={10}
					updateCellsBatchingPeriod={50}
				/>
				{
				this.BettingRef &&
				this.BettingRef.state &&
				this.BettingRef.state.BetCartdata &&
				this.BettingRef.state.BetCartdata.length != 0 &&
				global.localStorage.getItem('loginStatus') == 1 && (
					<View style={{position: 'absolute', bottom: 30}}>
							<BetCartPopup
							ShowBottomSheet={(t) => {this.BettingRef.ShowBottomSheet(t); UMonEvent('Betcart', 'Launch', 'MainPage_Betcart')}}
							PlayBetCart={this.BettingRef.state.PlayBetCart}
							BetCartdata={this.state.BetCartdataBack}
						/>
					</View>
				)}
				{
				// <ScrollView 
				// 	showsHorizontalScrollIndicator={false}
				// 	showsVerticalScrollIndicator={false}
				// 	style={{ flex: 1 }}
				// >
				// 	<Header
				// 		Vendor={Vendor}
				// 		HeaderRef={(ref) => { this.HeaderRef = ref; }}
				// 	/>
				// 	{/* 推送提示 */}
				// 	<PushLayout showPush={this.state.showPush} />
				// 	<Nav
				// 		NavRef={(ref) => { this.NavRef = ref; }}
				// 		MenuChange={(ID) => {
				// 			//菜單 體育項目變化=>刷新banner數據
				// 			if (this.HeaderRef) {
				// 				this.HeaderRef.getBannerData(ID);
				// 			}
				// 		}}
				// 		onToggleButtonClicked={expandAll => {
				// 			//菜單 點擊全展開/全收起按鈕=>賽事列表展開/收起
				// 			if (this.BettingRef) {
				// 				this.BettingRef.toggleAll(expandAll);
				// 			}
				// 		}}
				// 		Vendor={Vendor}
				// 		SportDatas={SportDatas}
				// 		GetEvents={(e) => this.GetEvents(e)}
				// 		Loading={Loading}
				// 	/>
				// 	<Betting
				// 		BettingRef={(ref) => { this.BettingRef = ref; }}
				// 		onAllLeaguesToggled={isExpandAll => {
				// 			//賽事列表 全展開 或 全收起=> 菜單的 全展開/全收起按鈕 要一起變化
				// 			if (this.NavRef) {
				// 				this.NavRef.changeToggleButtonStatus(isExpandAll);
				// 			}
				// 		}}
				// 		URL={Vendor.configs.VendorPage}
				// 		Vendor={Vendor}
				// 		ToggleFavourite={this.toggleFavourite}
				// 		OddsUpData={OddsUpData} /* 上升赔率 */
				// 		OddsDownData={OddsDownData} /* 下降赔率 */
				// 		SportDatas={SportDatas} /* 游戏类型 和游戏数据计数 */
				// 		EventDatas={EventDatas} /* 当前进行的所有赛事 */
				// 		GetEvents={(e) => this.GetEvents(e)}
				// 		Loading={Loading}
				// 		BetType={BetType}
				// 	/>
				// 	{/* 不可删除 */}
				// </ScrollView>
				}
				{this.state.showMiniEvent ? (
					<MiniEvent
						Vendor={Vendor}
						EventId={this.state.miniEventId}
						SportId={this.state.miniSportId}
						LeagueId={this.state.miniLeagueId}
						ShowType={this.state.miniShowType}
						CloseMini={() => {
							this.setState({ showMiniEvent: false, miniEventId: null, miniSportId: 1, miniLeagueId: null, miniShowType: 0 });

							//更新網址鏈接
							// const { pathname, query } = this.props.router;
							// let cloneQuery = Object.assign({}, query);
							// //刪除mini配置
							// delete cloneQuery['miniEventId'];
							// delete cloneQuery['miniSportId'];
							// delete cloneQuery['miniLeagueId'];
							// delete cloneQuery['miniShowType'];
							// const params = new URLSearchParams(cloneQuery);
							// //用replace，避免用戶可以點擊back返回
							// Router.replace(pathname + '?' + params.toString(), undefined, { shallow: true });
						}}
					/>
				) : null}
				{
					this.NavRef &&
					this.NavRef.state.GuideTop != 0 &&
					<Guide
						GuideTop = {GuideTop}
						GuideLeft = {GuideLeft}
						GuideChange={this.GuideChange}
					/>
				}
			</View>
		);
	}
}
const styles = StyleSheet.create({
	moreLodin: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: width,
		height: 50,
	},
});
