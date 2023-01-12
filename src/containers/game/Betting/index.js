/* 
	投注页面 导航菜单  所有游戏种类
*/

import React from 'react';
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
	FlatList,
	TextInput,
	KeyboardAvoidingView,
} from "react-native";
import SnapCarousel, {
	ParallaxImage,
	Pagination
} from "react-native-snap-carousel";
import {
	Button,
	Carousel,
	WhiteSpace,
	WingBlank,
	Radio,
	InputItem,
	DatePicker,
	Flex,
	Toast,
	List
} from "antd-mobile-rn";
import Skeleton from '../Skeleton/Skeleton'
import { Actions } from "react-native-router-flux";
import Accordion from '../../containers/Accordion'
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import SelectionData from '../../lib/vendor/data/SelectionData';
import CryptoJS from "crypto-js";
import Collapsible from 'react-native-collapsible';
import OutRightEvent from './Events/OutRightEvent';
import NormalEvent from './Events/NormalEvent';
import Bottombetbox from '../Footer/bottombetbox';
import BetCartPopup from './BetCartPopup'
import {VendorMarkets} from "../../lib/vendor/data/VendorConsts";

import AccordionItem from 'antd-mobile-rn/lib/accordion/style/index.native';
const newStyle = {};
for (const key in AccordionItem) {
	if (Object.prototype.hasOwnProperty.call(AccordionItem, key)) {
		// StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
		newStyle[key] = { ...StyleSheet.flatten(AccordionItem[key]) };
		newStyle[key].borderBottomWidth = 0;
		newStyle[key].borderTopWidth = 0;
	}
}

const SECTIONS = [
	{
		title: 'First',
		content: 'Lorem ipsum...',
	},
	{
		title: 'Second',
		content: 'Lorem ipsum...',
	},
];

const EventPerPageCount = 20; //分頁展示，默認每頁(每次展示)多少筆
class Betting extends React.PureComponent {
	constructor() {
		super();
		this.state = {
			isOpen: false,
			active: 0,
			hasMore: true,
			// action: STATS.init,
			init: EventPerPageCount,
			PlayBetCart: false,
			BetCartdata: [],
			ChampionCancel: true,
			Championactive: -1,
			isCollapsed: false,
			activeSections: [],
			ChampTeameactive: 0,
			ChampionSelects: [],
			closeAccordion: [],
			openLeague: -1,
			openLeagueNum: 0,
			ShowBottomSheetType: '',
			BetCartdataLength: 2 /* 串关最少2个 */,
			expandAll: true, //是否全部展開
			LeagueToggleStatusArray: null //保存聯賽展開/收起狀態
		};

		this.clickOdds = this.clickOdds.bind(this);
	}
	componentDidMount() {
		this.props.BettingRef && this.props.BettingRef(this);
		const { Vendor } = this.props;
		let IMBetCartdata = JSON.parse(localStorage.getItem('IMBetCartdata')) || [];
		let BTIBetCartdata = JSON.parse(localStorage.getItem('BTIBetCartdata')) || [];
		let OWSBetCartdata = JSON.parse(localStorage.getItem('OWSBetCartdata')) || [];
		// let IMBetCartdata = IMBetCartdata || [];
		// let BTIBetCartdata = BTIBetCartdata || [];
		let BetCartdata = Vendor.configs.VendorName == 'IM' ? IMBetCartdata : Vendor.configs.VendorName == 'OWS' ? OWSBetCartdata : BTIBetCartdata;
		/* 需要重新clone */
		const thisSelections = BetCartdata.map((item) => {
			return SelectionData.clone(item);
		});
		this.setState(
			{
				BetCartdata: thisSelections,
				PlayBetCart: BetMore || false
			},
			() => {
				BetMore = false
			}
		);
	}

	hasMoreData = () => {
		return this.props.EventDatas ? this.state.init < this.props.EventDatas.length : false;
	};

	/* 以下 属于方法下拉刷新 上拉加载 */
	handleAction = (action) => {
		this.handLoadMore();
		// if (action === this.state.action) {
		// 	return false;
		// }
		// if (action === STATS.refreshing) {
		// 	return false;
		// } else if (action === STATS.loading) {
		// 	this.handLoadMore();
		// } else {
		// 	this.setState({
		// 		action: action
		// 	});
		// }
	};

	handRefreshing = () => {
		setTimeout(() => {
			this.setState({
				hasMore: true,
			});
		}, 1000);


		// if (STATS.refreshing === this.state.action) {
		// 	return false;
		// }
		// setTimeout(() => {
		// 	this.setState({
		// 		hasMore: true,
		// 		action: STATS.refreshed
		// 	});
		// }, 1000);
		// this.setState({
		// 	action: STATS.refreshing
		// });
	};

	handLoadMore = () => {
		setTimeout(() => {
			if (!this.hasMoreData()) {
				this.setState({
					hasMore: false
				});
			} else {
				this.setState({
					init: this.state.init + EventPerPageCount
				});
			}
		}, 1000);
		// if (STATS.loading === this.state.action) {
		// 	return false;
		// }
		// //无更多内容则不执行后面逻辑
		// if (!this.state.hasMore) {
		// 	return;
		// }
		// setTimeout(() => {
		// 	if (!this.hasMoreData()) {
		// 		this.setState({
		// 			action: STATS.reset,
		// 			hasMore: false
		// 		});
		// 	} else {
		// 		this.setState({
		// 			action: STATS.reset,
		// 			init: this.state.init + EventPerPageCount
		// 		});
		// 	}
		// }, 1000);
		// this.setState({
		// 	action: STATS.loading
		// });
	};

	//數據刷新，需要把hasMore和init復原
	onEventsRefresh = () => {
		this.setState({ hasMore: true, init: EventPerPageCount });
	};

	/* 跳转至详情 */
	ToSportsDetails = (Vendor, EventData) => {
		const { SportId, EventId, LeagueId, IsOutRightEvent } = EventData;
		let dataList = {
			eid: EventId,
			sid: SportId,
			lid: LeagueId,
			OE: IsOutRightEvent,
			BetMore: this.state.PlayBetCart
		}
		console.log('OEOEOEOE',IsOutRightEvent)
		UMonEvent('Odds', 'Submit', 'Odds_mainpage_horizontal')
		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor })
		//加速開啟：列表的數據，存到緩存 拿來展示，等拿到詳情數據 再取代掉
		// const cacheKey = SportId + '|||' + EventId;
		// Vendor._cacheSet(cacheKey, JSON.stringify(EventData), 10);
		// Router.push(
		// 	`${Vendor.configs.VendorPage}/detail?sid=${SportId}&eid=${EventId}&lid=${LeagueId}&OE=${IsOutRightEvent}&BetMore=${this.state
		// 		.PlayBetCart}`
		// );
	};

	ShowBottomSheet = (type) => {
		this.setState({ ShowBottomSheetType: type })
		this.refs.ShowBottom.ShowBottomSheet(type);
	};

	/* 串关开状态 */
	PlayBetCartmore = () => {
		this.setState({
			PlayBetCart: true
		});
	};
	/* 串关关状态 */
	PlayCloseBetCartmore = () => {
		this.setState({
			PlayBetCart: false
		});
	};

	Preservationbet = (BetCartdata) => {

		if (this.props.Vendor.configs.VendorName == 'IM') {
			// IMBetCartdata = BetCartdata
			localStorage.setItem('IMBetCartdata', JSON.stringify(BetCartdata));
			this.props.BetCartdataBack(BetCartdata)
		}
		if (this.props.Vendor.configs.VendorName == 'BTI') {
			// BTIBetCartdata = BetCartdata
			localStorage.setItem('BTIBetCartdata', JSON.stringify(BetCartdata));
			this.props.BetCartdataBack(BetCartdata)
		}
		if (this.props.Vendor.configs.VendorName == 'OWS') {
			// OWSBetCartdata = BetCartdata
			localStorage.setItem('OWSBetCartdata', JSON.stringify(BetCartdata));
			this.props.BetCartdataBack(BetCartdata)
		}
	};

	/* 存储单投和串关数据 */
	PushBetCart = (data, type) => {
		const { PlayBetCart } = this.state;
		/* 是否有同一组的盘口 */
		let indexOf = this.state.BetCartdata.findIndex((v) => {
			return v.EventId == data.EventId;
		});
		let MoreStatus = PlayBetCart && PlayBetCart != 'false';
		/* 如果同一个队伍存在相同盘口的ID，可以选择一个 */
		if (indexOf != '-1') {
			/* 删除旧的盘口 */
			const RemoveBetCartOld = this.state.BetCartdata.filter((item) => item.EventId != data.EventId);
			this.setState(
				{
					BetCartdata: RemoveBetCartOld
				},
				() => {
					/* 把新选择的盘口再放进去 */
					this.setState(
						{
							BetCartdata: [...this.state.BetCartdata, data]
						},
						() => {
							if (!MoreStatus) {
								this.setState({ ShowBottomSheetType: type })
								this.refs.ShowBottom.ShowBottomSheet(type);
							}
							this.Preservationbet(this.state.BetCartdata);
						}
					);
				}
			);
		} else {
			this.setState(
				{
					BetCartdata: [...this.state.BetCartdata, data]
				},
				() => {
					if (type == 1) {
						if (!MoreStatus) {
							this.setState({ ShowBottomSheetType: type })
							this.refs.ShowBottom.ShowBottomSheet(type);
						}
					}
					this.Preservationbet(this.state.BetCartdata);
				}
			);
		}
	};

	/* 删除数据 */
	RemoveBetCart = (data, type, callback) => {
		const BetCart = this.state.BetCartdata.filter((item) => item.EventId != data.EventId);
		/* 清除全部数据 */
		let RemoveAll = () => {
			this.setState({
				BetCartdata: [] /* 清空 */,
				BetCartdataLength: 2 /* 初始化 默认2 */,
				PlayBetCart: false
			});
			this.Preservationbet([]);
		};
		if (data == '') {
			RemoveAll();
		} else {
			this.setState(
				{
					BetCartdata: BetCart,
					BetCartdataLength: BetCart.length
				},
				() => {
					if (type == 2 || type == 3 || this.state.PlayBetCart == true) {
						this.refs.ShowBottom.CheckBetting(BetCart);
						this.Preservationbet(BetCart);
					} else {
						BetCart.forEach((item) => {
							this.refs.ShowBottom.CheckBetting(item);
						});
						this.Preservationbet(BetCart);
					}
				}
			);

			/* 盘口少于两个 关闭串关模式 */
			// if (RemoveBetCart.length < 2) {
			// 	this.setState({
			// 		PlayBetCart: false
			// 	});
			// }

			if (BetCart == '') {
				
				// if (!this.refs.ShowBottom.refs.CheckBetting.state.PlayBettingStatus) {
				if (callback == undefined) {
					this.refs.ShowBottom.CloseBottomSheet();
				}
				RemoveAll();
			}
		}
	};

	//點擊賠率=>投注
	clickOdds = (selectionData) => {
		if (!global.localStorage.getItem('loginStatus') == 1) {
			Actions.logins()
			return;
		}
		if (!selectionData) {
			return;
		}
		UMonEvent('EngagementEvent_Click_OddsEUROPage')
		const { Vendor } = this.props;
		const { PlayBetCart, BetCartdata } = this.state;

		let MoreStatus = PlayBetCart && PlayBetCart != 'false';

		let overMaxSelectionCount = (BetCartdata.length >= Vendor.configs.MaxParlay); //是否超過最大限制

		if (!MoreStatus) {
			this.PushBetCart(selectionData, 1);
		} else if (!overMaxSelectionCount) {
			let indexOf = BetCartdata.findIndex((v) => {
				return (
					v.SelectionId == selectionData.SelectionId
				);
			});
			if (indexOf === -1) {
				this.PushBetCart(selectionData, 2);
				Toasts.success('สำเร็จ', 2, '', false);
			} else {
				this.RemoveBetCart(selectionData, 2, true);
			}
		} else if (overMaxSelectionCount) {
			Toasts.fail('เดิมพันพาร์เลย์เท่านั้น' + Vendor.configs.MaxParlay + 'เพิ่มเกมอื่นได้');
		}
	}


	toggleAll = (expandAll) => {
		
		// let newStatus = { expandAll };
		// if (expandAll) {
		// 	newStatus['LeagueToggleStatusArray'] = null;  //清空=全開
		// } else {
		// 	newStatus['LeagueToggleStatusArray'] = []; //空數組=全關
		// }
		this.setState({expandAll, openLeague: expandAll? 2: 0});
	};

	gameList = ({item, index}) => {
		const { ToggleFavourite, EventDatas, OddsUpData, OddsDownData, Loading, Vendor, BetType } = this.props;
		const {
			init,
			PlayBetCart,
			BetCartdata,
			hasMore,
			expandAll,
			openLeague,
			openLeagueNum,
			LeagueToggleStatusArray,
		} = this.state;
		let leagueData = item;
		// let CutEventList = [];
		// CutEventList = CutEventDatas.filter(
		// 	(data) =>
		// 		data.LeagueId == leagueData.LeagueId &&
		// 		leagueData.EventIds.indexOf(data.EventId) !== -1
		// )
		if(index == 0 && openLeagueNum != GameListNum) {
			//总个数发生变化刷新
			console.log('GameListNumGameListNum111',GameListNum)
			this.setState({openLeague: GameListNum, openLeagueNum: GameListNum})
		}
		if (leagueData.LeagueId === 'separator') {
			return <View key={leagueData.LeagueKey} style={styles.gameSeparator}>
				<Image resizeMode='stretch' source={require('../../../images/betting/time.png')} style={{ width: 14, height: 14 }} />
				<Text style={{color: '#666', fontSize: 12,paddingLeft: 8,}}>即将进行的赛事</Text>
			</View>
		}
		return (
			<View key={index}>
				<Accordion
					showsAll={expandAll}
					closeAccordion={(isShow) => {
						
						let open = isShow ? openLeague + 1 : openLeague - 1
						this.setState({openLeague: open})
						console.log('GameListNumGameListNum',open)
						if(open > 0) {
							//一个打开就all就是开
							this.props.onAllLeaguesToggled(true)
						} else if(open < 1) {
							//关闭所以
							this.props.onAllLeaguesToggled(false)
						}
					 }}
					tltleList={leagueData}
					// valueNum={{
					// 	type: CutEventList[0].IsOutRightEvent ? 'OutRightEvent' : 'NormalEvent',//冠军和普通的高度不同
					// 	num: CutEventList.length
					// }}
					// key={expandAll? 1: 0}
				>
					{leagueData.children.map((CutEventitem, CutEventkey) => {
						return CutEventitem.IsOutRightEvent ? (
							<OutRightEvent
								key={CutEventitem.EventId}
								Vendor={Vendor}
								EventData={CutEventitem}
								ToggleFavourite={ToggleFavourite}
								ToSportsDetails={this.ToSportsDetails}
								ClickOdds={this.clickOdds}
								PlayBetCart={PlayBetCart}
								BetCartdata={BetCartdata}
							/>
						) : (
								<NormalEvent
									key={CutEventitem.EventId}
									Vendor={Vendor}
									EventData={CutEventitem}
									ToggleFavourite={ToggleFavourite}
									ToSportsDetails={this.ToSportsDetails}
									OddsUpData={OddsUpData}
									OddsDownData={OddsDownData}
									ClickOdds={this.clickOdds}
									PlayBetCart={PlayBetCart}
									BetCartdata={BetCartdata}
								/>
							);
					})}
				</Accordion>
			</View>
		)
	}


	render() {
		window.betHomeKeyBosrdtdata = (BetCartdata) => {
			//详情页更新home注单
			BetCartdata && this.setState({BetCartdata})
		}

		const { ToggleFavourite, EventDatas, OddsUpData, OddsDownData, Loading, Vendor, BetType } = this.props;
		const {
			init,
			PlayBetCart,
			BetCartdata,
			hasMore,
			expandAll,
			openLeague,
			openLeagueNum,
			LeagueToggleStatusArray,
		} = this.state;
		/* 赛事的列表数据 */
		/* 当前赛事类型的id 比如全场让球 全场大小的id */
		let PeriodIds = [];
		/* 截取的数据  */
		// let CutEventDatas = EventDatas.slice(0, init);
		/* 截取的数据在Event那边截取 */
		let CutEventDatas = EventDatas;
		/* 獲取聯賽分組 */
		let leagueList = [];
		let currentLeague = null;
		let currentMarket = null;
		CutEventDatas.map((ev, index) => {
			let createNewLeague = false;
			//逐筆往下查看賽事的聯賽變化
			if (currentLeague) {
				if (ev.LeagueId === currentLeague.LeagueId && ev.MarketId === currentMarket) {
					//聯賽相同，放一起
					currentLeague.children.push(ev);
				} else {
					//不相同，保留現在的聯賽分組
					leagueList.push(currentLeague);
					//產生一個新的聯賽分組
					createNewLeague = true;
				}
			} else {
				//第一個執行 還沒有currentLeague，
				//產生一個新的聯賽分組
				createNewLeague = true;
			}
			if (createNewLeague) {
				currentLeague = {
					LeagueId: ev.LeagueId, //聯賽id
					LeagueName: ev.LeagueName, //聯賽名
					children: [] //該聯賽分組下的賽事
				};
				currentLeague.children.push(ev);
				// currentLeague.LeagueKey = ev.LeagueId + '_' + ev.EventId; //因為時間排序 可能會有同一個聯賽 出現多次的情況，所以用  聯賽id + 第一個賽事id 作為key
			}

			//處理今日和滾球的分界點
			if (currentMarket !== null && currentMarket === VendorMarkets.RUNNING && ev.MarketId === VendorMarkets.TODAY) {
				leagueList.push({
					LeagueId: 'separator', //聯賽id
					LeagueName: 'separator', //聯賽名
					LeagueKey: 'separator',
					children: [] //該聯賽分組下的賽事
				});
			}

			currentMarket = ev.MarketId;
			//最後一筆 保留現在的聯賽分組
			if (index === CutEventDatas.length - 1) {
				leagueList.push(currentLeague);
			}
		});

		if(GameListNum == 0 || GameListNum != leagueList.length) {
			GameListNum = leagueList.length
		}



		/* console.log('%c赛事列表的数据', 'font-size:36px;color:red;', EventDatas); */
		return (
			<View style={{ flex: 1 }}>
				{Loading ? (
					<Skeleton />
				) : EventDatas == '' ? (
					BetType.MarketId == 4 ?
						<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 35 }}>
							<Image
								onLoadStart={() => { this.props.isMore() }}
								resizeMode='stretch'
								source={require('../../../images/shoucnag.png')}
								style={{ width: 100, height: 100 }}
							/>
							<Text style={{ color: '#2f4f4f', paddingTop: 10 }}>暂无关注赛事，马上关注赛事吧</Text>
						</View>
						:
						<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 35 }}>
							<Image 
								onLoadStart={() => { this.props.isMore() }}
								resizeMode='stretch' 
								source={require('../../../images/logo.png')} 
								style={{ width: 65, height: 29 }} 
							/>
							<Text style={{ color: '#2f4f4f', paddingTop: 10 }}>哎呀！暂无相关赛事，换个游戏试试吧！</Text>
						</View>
				) : (
							<View>
								{
									leagueList.length > 0 &&
									<FlatList
										// key={leagueList.length}
										showsVerticalScrollIndicator={false} //是否显示垂直滚动条
										showsHorizontalScrollIndicator={false} //是否显示水平滚动条
										automaticallyAdjustContentInsets={false}
										numColumns={1} //每行显示1个
										ref={flatList => (this._flatList = flatList)}
										renderItem={this.gameList}
										enableEmptySections={true} //数据可以为空
										// onEndReachedThreshold={0.1} //执行上啦的时候10%执行
										// ListFooterComponent={this.renderFooter}//尾巴
										keyExtractor={(item, index) => (item.key = index)}
										// onRefresh={this.onRefresh}
										data={leagueList}
										extraData={leagueList}

										windowSize={6}
										removeClippedSubviews={Platform.OS === 'android'}
										maxToRenderPerBatch={10}
										updateCellsBatchingPeriod={50}
									/>
								}

							</View>
						)}
				{/* 投注板块 */}
				<Bottombetbox
					ref="ShowBottom"
					Vendor={this.props.Vendor}
					PlayBetCartmore={() => this.PlayBetCartmore()}
					RemoveBetCart={(e, type, c) => {
						this.RemoveBetCart(e, type, c);
					}}
					BetCartdata={BetCartdata}
					PlayCloseBetCartmore={() => {
						this.PlayCloseBetCartmore();
					}}
				/>
				{/* 购物车浮窗 */}
				{/* {BetCartdata.length != 0 &&
				global.localStorage.getItem('loginStatus') == 1 && (
					<View style={{position: 'absolute', top: height * 0.3}}>
							<BetCartPopup
							ShowBottomSheet={(t) => this.ShowBottomSheet(t)}
							PlayBetCart={PlayBetCart}
							BetCartdata={BetCartdata}
						/>
					</View>
				)} */}
			</View>
		);
	}
}

export default Betting;

/* 预防 大数据*/
export function GameDataCut(data, callback, pageSize = 10) {
	let totalCount = data.length;
	let GamePageNumber = 1;
	let totalPageNumer = Math.ceil(totalCount / pageSize);

	let handler = () => {
		let start = (GamePageNumber - 1) * pageSize;
		let end = GamePageNumber * pageSize;
		let currentData = data.slice(start, end);
		if (typeof callback === 'function') {
			callback(currentData, {
				totalCount,
				totalPageNumer,
				GamePageNumber,
				pageSize
			});
		}
		if (GamePageNumber < totalPageNumer) {
			window.requestAnimationFrame(handler);
		}
		GamePageNumber++;
	};
	handler();
}

const styles = StyleSheet.create({
	gameSeparator: {
		backgroundColor: '#e6e6eb',
		width: width,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		height: 32,
	},
	listBox: {
		backgroundColor: '#fff',
		borderRadius: 15,
		marginBottom: 15,
	},
	listData: {
		paddingBottom: 15,
		borderBottomLeftRadius: 15,
		borderBottomRightRadius: 15,
	},
});
