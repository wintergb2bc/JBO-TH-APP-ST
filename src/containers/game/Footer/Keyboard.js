import React from 'react';
import NP from '../../lib/js/numberPrecision';
// import { ReactSVG } from '@/ReactSVG';
import {
	SelectionChangeType,
	SelectionStatusType,
	VendorErrorType,
	SpecialUpdateType
} from '../../lib/vendor/data/VendorConsts';
import KeyboardLoding from '../Skeleton/KeyboardLoding'
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
	Alert,
	Modal,
	ImageBackground,
	Platform,
	TextInput,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import { Flex, Toast, WingBlank, WhiteSpace, Tabs, Drawer,PickerView } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
// import Modal from 'react-native-modal';
import styles from './styleType'

// import Skeletonbottomsheet from '@/Skeleton/bottomsheet';
import ComboBonusModal from '../ComboBonusModal';
// import Router from 'next/router';
// import dynamic from 'next/dynamic';
// const Drawer = dynamic(import('ac-drawer'), { ssr: false });
// import Picker from 'rmc-picker/lib/Picker';
// import { ChangeSvg } from '$LIB/js/util';
import { connect } from 'react-redux';
import { ACTION_UserInfo_getBalanceSB } from '../../lib/redux/actions/UserInfoAction';
import * as ACTION_BETINFO from '../../lib/redux/actions/BetAction'; /* 转换为redux管理 将陆续进行*/
// import VendorBTI from '../../lib/vendor/bti/VendorBTI';
import VendorIM from '../../lib/vendor/im/VendorIM';


class _key extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Betdata: '' /* 当前用户选择的盘口数据 */,
			BetAmountval: '' /* 键盘金额 */,
			BetInfoData: [] /* 下注的条件详情 */,
			Cannotplay: false /* 是否可以下注 */,
			EstimatedPayoutRate: 0 /* 注单可赢金额计算分比 */,
			MinAmount: 0 /* 最低金额 */,
			MaxAmount: 0 /* 最大金额 */,
			BetActiveType: 1,
			loading: false,
			StartBettingloading: 0,
			BetSettings: [],
			Selections: [],
			ShowKeyboard: false,
			Activeinput: 0,
			BetAmount0: '',
			ErrorMsg: '',
			OddsDown: [],
			OddsUpData: [],
			BettingcomboType: [],
			CantPlayList: [] /* 过期的盘口 */,
			BettingbetInfo: [] /* 确认中的下注数据 */,
			BettingSuccess: [] /* 下注成功的数据 */,
			BettingError: [] /* 下注失败的数据 */,
			Removedata: [] /* 删除的数据 */,
			WinBetAmount: 0 /* จ่าย */,
			ComboCount: 0 /* 总投注金额 */,
			pollingKey: [] /* 轮询的key 用于删除 */,
			MorepollingKey: '' /* 混投轮询的key 用于删除 */,
			showBalanceError: true,
			Refresh: false,
			PlayBettingStatus: false,
			ToDown: true,
			ToUp: false,
			StillHaveBeting: false /* 注单超时 下注的状态 */,
			BetTime: 0
		};
		this._onScrollEvent = this._onScrollEvent.bind(this);
	}

	componentDidMount() {
		const { BetType, Vendor } = this.props;
		let MaxParlay = Vendor.configs.MaxParlay;
		this.setState(
			{
				BetActiveType: BetType
			},
			() => {
				/* *********注单类型 1 单投 2，3 串关 ************/
				if (this.state.BetActiveType == 1) {
					this.props.Betdata.forEach((element) => {
						this.CheckBetting(element);
					});
				}
				if (this.state.BetActiveType == 2 || this.state.BetActiveType == 3) {
					this.CheckBetting(this.props.Betdata.slice(0, MaxParlay));
				}
			}
		);
		if (global.localStorage.getItem('loginStatus') == 1) {
			this.props.userInfo_getBalanceSB();
		}
	}

	componentWillUnmount() {
		/* 删除单投盘口的轮询 */
		this.props.Vendor.deletePolling(this.pollingKeyOne);
		/* 删除混投盘口的轮询 */
		this.props.Vendor.deletePolling(this.pollingKeyMore);
	}

	/* 用于 Piwki统计 记录用户点击投注到成功或失败的过程 */
	PiwkiBetLog = (sendDate, receiveDate) => {
		let newDate = receiveDate - sendDate;
		let t = ((newDate % 86400) % 3600) % 60;
		let second = t.toFixed(2); //Math.floor(((newDate % 86400) % 3600) % 60);
		/* 返回时间差 */
		return second;
	};
	NotifyBettingInfo = (ID, note = null, retry = 0) => {
		let VendorName;
		if (this.props.Vendor.configs.VendorName == 'IM') {
			VendorName = 'IPSB';
		}
		if (this.props.Vendor.configs.VendorName == 'BTI') {
			VendorName = 'SBT';
		}
		if (this.props.Vendor.configs.VendorName == 'OWS') {
			VendorName = 'OWS';
		}
		const postData = {
			provider: VendorName,
			betId: ID,
			platformId: Platform.OS == "ios" ? 26 : 25
		};
		let piwikHead = `NotifyBettingInfo_${this.props.Vendor.configs.VendorName}_${postData.betId}_${postData.platformId}`;
		if (note !== null) {
			piwikHead = piwikHead + '_' + note;
		}
		if (retry > 0 ) {
			piwikHead = piwikHead + '_retry' + retry;
		}
		UMonEvent(`${piwikHead}_START`,'touch',' ');
		const that = this;
		const startT = new Date().getTime();
		fetchRequest(ApiPort.NotifyBettingInfo, 'POST', postData, 30000) //30秒超時
			.then((data) => {
				const diffSeconds = ((new Date().getTime() - startT) / 1000).toFixed(2);
				if (!data) {
					UMonEvent(`${piwikHead}_END_${diffSeconds}_EMPTY`,'touch',' ');
				} else {
					let cleanData = {};
					cleanData['errorCode'] = data.errorCode;
					cleanData['referenceId'] = data.referenceId;
					cleanData['errorDescription'] = data.errorDescription;
					const jsonData = JSON.stringify(cleanData);
					UMonEvent(`${piwikHead}_END_${diffSeconds}_${jsonData}`,'touch',' ');
				}
			})
			.catch(err => {
				const diffSeconds = ((new Date().getTime() - startT) / 1000).toFixed(2);
				UMonEvent(`${piwikHead}_ERROR_${diffSeconds}_${err}`,'touch',' ');
				if (retry < 10) { //最多重試10次
					const thisRetry = retry +1;
					setTimeout(() => {
						that.NotifyBettingInfo(ID, note, thisRetry)
					}, 5000); //5秒後重試
				} else {
					UMonEvent(`${piwikHead}_STOP`,'touch',' '); //超過次數限制 不再重試
				}
			})
	};

	/* ****************** 提交购物车注单 开始下注 ******************** */
	StartBetting = (
		/* 盘口 */
		betInfo,
		/* 金额 */
		BetAmountval,
		/* 盘口类型 */
		comboType,
		/* 可盈利金额 */
		WinBetAmount,
		/* 总投注额 */
		ComboCount,
		/* 是否接受赔率变化 */
		AcceptChangeOfOdds,
		/* 免费投注id */
		FreeBetToken,
		/* 盘口金额队列 */
		BetAmountvallist,
		/* 点击投注到成功或失败的时间 单位 秒/s */
		BetTime
	) => {
		const { BetActiveType } = this.state;
		if (BetAmountval == 0 || BetAmountval == '') {
			// Toasts.fail('请输入金额！');
			window.KeyBoardToast('fail', 'กรุณากรอกจำนวนเงิน！')
			return;
		}
		let sendDate = new Date().getTime() / 1000;
		this.setState(
			{
				StartBettingloading: 1,
				WinBetAmount: WinBetAmount,
				ComboCount: ComboCount
			},
			() => {
				/* 待确认的数据 */
				if (!AcceptChangeOfOdds && this.state.StartBettingloading == 1) {
					this.setState((state) => {
						let ComboObj = { comboType: comboType, betAmount: BetAmountval };
						return {
							BettingbetInfo: [...state.BettingbetInfo, betInfo],
							BettingcomboType: [...state.BettingcomboType, ComboObj]
						};
					});
				}
			}
		);
		let Modalnum = 0;
		const userClickBet = (betAmount) => {
			if (betInfo) {
				//執行下注，返回是BetResultData格式
				let betResultdata = null;
				this.props.Vendor
					.placeBet(
						BetActiveType != 1 ? 2 : 1,
						betInfo,
						betAmount,
						comboType,
						AcceptChangeOfOdds,
						FreeBetToken
					)
					.then((betResult) => {
						if (betResult) {
							if (betResult.IsPending) {
								//TODO: 展示投注 尚未完成 相關 UI
								//額外在背景查詢投注結果
								VendorIM.queryPendingBetStatus(betResult.PendingQueryId).then((queryBetStatusData) => {
									//確認投注成功
									if (queryBetStatusData.IsSuccess) {
										//TODO: 上傳投注成功 相關信息給 fun後端
										let wagerId = queryBetStatusData.WagerId; //<==投注成功的 注單id
										/* 获取投注开始到成功的时间差 秒/s*/
										const second = this.PiwkiBetLog(sendDate, new Date().getTime() / 1000);
										UMonEvent(`BetSpeed_${this.props.Vendor.configs.VendorName}_${BetActiveType}_${second}_${'Success'}_${wagerId}`, 'touch', ' ')
									}
								});
								this.setState({
									StartBettingloading: 4
								});
								this.NotifyBettingInfo(betResult.WagerId,'PENDING');
								return;
							}
							/* 投注成功处理 */
							betResultdata = betResult;
							BettingSuccess();
							console.log('------- 投注成功 -----');
						}
					})
					.catch((error) => {
						console.log(error);
						//這裡處理下注可能返回的錯誤
						if (typeof error === 'object' && error.constructor.name === 'VendorError') {
							//定義好的VendorError錯誤類
							//處理這些錯誤
							switch (error.ErrorType) {
								/* 投注超时 是为投注成功 */
								case VendorErrorType.BET_Place_Expire:
								case VendorErrorType.BET_Place_OddChanged: //赔率已变更  <--這個按mockup，有特殊流程要處理
								//下面這些應該直接展示錯誤信息
								case VendorErrorType.VENDOR_Error: //Vendor系統錯誤
								case VendorErrorType.VENDOR_Maintenance: //Vendor維護
								case VendorErrorType.BET_Place_Error: //下注失敗
								case VendorErrorType.BET_Place_Updating: //赔率更新中
								case VendorErrorType.BET_Place_Balance: //余额不足
								case VendorErrorType.BET_Place_LimitMax: //投注金额超于限额
								case VendorErrorType.BET_Place_LimitMin: //投注金额低于最小投注额
								case VendorErrorType.BET_Place_LimitTotal: //这赛事总投注金额超于限额
								case VendorErrorType.BET_Place_NOPARLAY: //所选赛事不支持连串过关，请选其他赛事
								case VendorErrorType.BET_Place_MONEY: // 無效投注金額
							}
							//這可以拿到中文錯誤信息，可以直接拿來展示
							const msg = error.ErrorMsg;
							if (error.ErrorType == VendorErrorType.BET_Place_Expire) {
								console.log('-------- 超时处理 ------');
								/* 视为投注成功 */
								BettingSuccess();
								return;
							}
							if (error.ErrorType == VendorErrorType.BET_Place_OddChanged) {
								console.log('-------- 赔率发生变化 让用户选择是否接受赔率变化 ------');
								Modalnum++;
								if (Modalnum == 1) {
									Alert.alert('', 'ค่าน้ำมีการเปลี่ยนแปลง คุณต้องการยืนยันการเดิมพันนี้', [
										{
											text: 'ยกเลิก',
											onPress: () => {
												if (BetAmountvallist.length == 1) {
													this.setState({
														StartBettingloading: 0
													});
												}
												Modalnum = 0;
											},
											style: "cancel"
										},
										{
											text: 'ยอมรับ', onPress: () => {
												this.StartBetting(
													betInfo,
													BetAmountval,
													comboType,
													WinBetAmount,
													ComboCount,
													true,
													FreeBetToken
												);
												Modalnum = 0;
											}
										},
									]);

									// Modal.info({
									// 	className: 'Betconfirm',
									// 	icon: null,
									// 	centered: true,
									// 	type: 'confirm',
									// 	title: '赔率降低了，您要接受吗？',
									// 	okText: '接受',
									// 	cancelText: '不接受',
									// 	onOk: () => {
									// 		this.StartBetting(
									// 			betInfo,
									// 			BetAmountval,
									// 			comboType,
									// 			WinBetAmount,
									// 			ComboCount,
									// 			true,
									// 			FreeBetToken
									// 		);
									// 		Modalnum = 0;
									// 	},
									// 	onCancel: () => {
									// 		if (BetAmountvallist.length == 1) {
									// 			this.setState({
									// 				StartBettingloading: 0
									// 			});
									// 		}
									// 		Modalnum = 0;
									// 	}
									// });
								}
								return;
							}
							this.setState((state) => {
								let ComboObj = { comboType: comboType, betAmount: betAmount };
								return {
									ErrorMsg: msg,
									StartBettingloading: 3,
									BettingError: [...state.BettingError, betInfo] /* 下注失败的数据 */,
									BettingcomboType: [...state.BettingcomboType, ComboObj]
								};
							});
							/* 获取投注开始到失败的时间差 秒/s*/
							const second = this.PiwkiBetLog(sendDate, new Date().getTime() / 1000);
							UMonEvent(`BetSpeed_${this.props.Vendor.configs.VendorName}_${BetActiveType}_${second}_${'failure'}`, 'touch', ' ')
							this.props.userInfo_getBalanceSB(true); //強制刷新
						}
					});
				/* 投注成功处理流  */
				let BettingSuccess = () => {
					let Checkdata = this.state.BettingSuccess.findIndex((v) => {
						return v.EventId == betInfo.Selections.EventId;
					});
					/* 下注成功的数据 */
					if (Checkdata == '-1') {
						this.setState((state) => {
							let ComboObj = { comboType: comboType, betAmount: betAmount };
							return {
								BettingSuccess: [...state.BettingSuccess, betInfo],
								BettingcomboType: [...state.BettingcomboType, ComboObj]
							};
						});
					}
					this.props.PlayCloseBetCartmore();
					//下注成功才關閉輪詢
					this.state.pollingKey.forEach((i) => {
						if (i.id == betInfo.Selections.EventId) {
							this.props.Vendor.deletePolling(i.key);
						}
					});
					this.props.Vendor.deletePolling(this.state.MorepollingKey);
					/* 刷新余额 */
					this.props.userInfo_getBalanceSB(true); //強制刷新
					/* 清空购物车 */
					this.setState(
						{
							PlayBettingStatus: true,
							StartBettingloading: 2
						},
						() => {
							if (BetActiveType == 1) {
								this.RemoveBetCart(betInfo.Selections, BetActiveType, false);
							} else {
								betInfo.Selections.forEach((item) => {
									this.RemoveBetCart(item, BetActiveType, true);
								});
							}
						}
					);
					// let memberCode = JSON.parse(global.localStorage.getItem('memberCode'));
					// if (typeof _paq === 'object') {
					// 	_paq.push(['setUserId', memberCode]);
					// }
					if (betResultdata) {
						this.NotifyBettingInfo(betResultdata.WagerId);
						/* 获取投注开始到成功的时间差 秒/s*/
						const second = this.PiwkiBetLog(sendDate, new Date().getTime() / 1000);
						UMonEvent(`BetSpeed_${this.props.Vendor.configs.VendorName}_${BetActiveType}_${second}_${'Success'}_${betResultdata.WagerId}`, 'touch', ' ')
					}
				};
			}
		};
		userClickBet(BetAmountval);
	};

	/* ***********投注之前进行盘口的检查 添加购物车 删除购物车 下注都会执行此方法 *************/
	CheckBetting = (SelectionData) => {
		/* 1 单投 2 串关 3 混合投注 */
		const { BetActiveType } = this.state;
		this.setState({
			loading: true
		});
		let num = 0;
		//檢查狀態，OK(100)才是可以投注
		//輪詢 投注檢查 數據更新回調
		this.onUpdateHandler = (pollingResultOfBetInfo) => {
			//這裏返回數據 是PollingResult 格式 包含偵測賠率變化的changes
			//這裏數據 是BetInfoData 格式，單注的 Selections 和 BetSettings 字段 都只有一個實例，不是數組
			const betInfo = pollingResultOfBetInfo.NewData;
			const changes = pollingResultOfBetInfo.Changes;
			console.log('%c投注检查详情', 'font-size:25px;color:violet;', betInfo);

			/* 已经删除盘口 禁止走进这里 */
			if (BetActiveType == 1 && !Array.isArray(betInfo.Selections)) {
				this.setState({
					CantPlayList: []
				});
				console.log('进入单投');
				/* 判断是否已经存在 */
				let indexof = this.state.Selections.findIndex((v) => {
					return v.EventId == betInfo.Selections.EventId;
				});
				let Removedataindexof = this.state.Removedata.findIndex((v) => {
					return v.EventId == betInfo.Selections.EventId;
				});
				if (indexof == '-1' && Removedataindexof == '-1') {
					this.setState(
						(state) => {
							return {
								BetSettings: [...state.BetSettings, betInfo.BetSettings],
								Selections: [...state.Selections, betInfo.Selections],
								BetInfoData: {
									BetSettings: [...state.BetSettings, betInfo.BetSettings],
									Selections: [...state.Selections, betInfo.Selections]
								}
							};
						},
						() => {
							this.state.Selections.forEach((item, key) => {
								let Activetype = 'BetAmount_' + BetActiveType + '_' + key;
								this.setState({
									[Activetype]: ''
								});
							});
						}
					);
				} else {
					this.setState({
						BetInfoData: { BetSettings: this.state.BetSettings, Selections: this.state.Selections }
					});
				}
				if (betInfo.Selections.SelectionStatus !== SelectionStatusType.OK) {
					//處理不能投注的原因，展示在畫面上  betInfo.Selections.SelectionStatusName
					this.setState({
						CantPlayList: [...this.state.CantPlayList, betInfo.Selections]
					});
				}
			} else if (BetActiveType == 2 || BetActiveType == 3) {
				this.setState({
					CantPlayList: []
				});
				console.log('进入混合投注');
				num++;
				if (Array.isArray(betInfo.Selections)) {
					this.setState({
						BetInfoData: betInfo
					});
				}
				if (BetActiveType == 2) {
					betInfo.BetSettings &&
						betInfo.BetSettings.map((item, index) => {
							if (num == 1) {
								let Activetype = 'BetAmount_' + BetActiveType + '_' + index;
								/* 初始化金额 */
								this.setState({
									[Activetype]: ''
								});
							}
						});
				} else {
					if (num == 1) {
						let Activetype = 'BetAmount_' + BetActiveType + '_' + 0;
						/* 初始化金额 */
						this.setState({
							[Activetype]: ''
						});
					}
				}

				betInfo.Selections.map((item, index) => {
					if (item.SelectionStatus !== SelectionStatusType.OK) {
						//處理不能投注的原因，展示在畫面上
						const errorDesc = betInfo.Selections.SelectionStatusName;
						this.setState({
							CantPlayList: [...this.state.CantPlayList, betInfo.Selections]
						});
					}
				});
			}

			//處理變更，和 查詢比賽 的輪詢處理方式一樣
			const down = [];
			const up = [];
			changes.map((changeData) => {
				//類型：更新
				if (changeData.ChangeType === SelectionChangeType.Update) {
					changeData.SpecialUpdates.map((sUpdateData) => {
						const thisSelectionId = changeData.SelectionId;
						// 處理賠率上升動畫
						if (sUpdateData.UpdateType === SpecialUpdateType.OddsUp) {
							up.push({
								SelectionId: thisSelectionId,
								OldValue: sUpdateData.OldValue,
								NewValue: sUpdateData.NewValue
							});
							this.setState({
								OddsUpData: up
							});
						}
						// 處理賠率下降動畫
						if (sUpdateData.UpdateType === SpecialUpdateType.OddsDown) {
							down.push({
								SelectionId: thisSelectionId,
								OldValue: sUpdateData.OldValue,
								NewValue: sUpdateData.NewValue
							});
							this.setState({
								OddsDown: down
							});
						}
					});
				}
			});
			this.setState({
				loading: false
			});
		};

		//輪詢 (檢查)投注選項並獲取投注上下限 等信息
		/* 分别轮询 单投和串投 */
		if (BetActiveType == 1) {
			this.pollingKeyOne = this.props.Vendor.getBetInfoPolling(this.onUpdateHandler, 1, SelectionData, 1);
			this.props.Vendor.deletePolling(this.pollingKeyMore);
			let pollingKeyOne = this.pollingKeyOne;
			/* 保存轮询标识 */
			this.setState((state) => {
				let polling = { key: pollingKeyOne, id: SelectionData.EventId };
				return {
					pollingKey: [...state.pollingKey, polling]
				};
			});
		} else if (BetActiveType == 2 || BetActiveType == 3) {
			/* 删除单投轮询 */
			this.state.pollingKey.forEach((item) => {
				this.props.Vendor.deletePolling(item.key);
			});
			this.pollingKeyMore = this.props.Vendor.getBetInfoPolling(this.onUpdateHandler, 2, SelectionData, 2);
			let pollingKeyMore = this.pollingKeyMore;
			/* 保存混投轮询标识 */
			this.setState({
				MorepollingKey: pollingKeyMore
			});
		}
	};

	/* ***************** 更新购物车数据 本地存储 ********************* */
	Preservationbet = (BetCartdata) => {
		if (this.props.Vendor.configs.VendorName == 'IM') {
			global.localStorage.setItem('IMBetCartdata', JSON.stringify(BetCartdata));
		}
		if (this.props.Vendor.configs.VendorName == 'BTI') {
			global.localStorage.setItem('BTIBetCartdata', JSON.stringify(BetCartdata));
		}
		if (this.props.Vendor.configs.VendorName == 'OWS') {
			global.localStorage.setItem('OWSBetCartdata', JSON.stringify(BetCartdata));
		}
	};

	/* ******************** 数字键盘金额计算 *********************** */
	modifyNum = (sign, index, type) => {
		console.log(sign, index, type)
		let Activetype = 'BetAmount_' + this.state.BetActiveType + '_' + type;
		let BetAmountval = this.state[`BetAmount_${this.state.BetActiveType + '_' + type}`];
		//8位数
		if(index != 15 && sign != 'clear' && BetAmountval && BetAmountval.length > 7) {return}

		let Setting;
		if (this.props.Vendor.configs.VendorName == 'IM') {
			Setting = VendorIM.getMemberSetting();
		}
		if (this.props.Vendor.configs.VendorName == 'BTI') {
			// Setting = VendorBTI.getMemberSetting();
		}
		//let memberCode = JSON.parse(localStorage.getItem('memberCode'));
		//const Setting = JSON.parse(localStorage.getItem('NotificationSetting-' + memberCode));
		/* 删除 */
		console.log(Setting)
		if (sign == 'del') {
			if (BetAmountval.length > 0) {
				let valNew = BetAmountval.slice(0, -1);
				if (valNew.length == 0) {
					this.setState({
						[Activetype]: ''
					});
				} else {
					this.setState({
						[Activetype]: valNew
					});
				}
			}
		} else if (sign == 'add' && index == 11) {
			/* 快捷金额 add */
			this.setState({
				[Activetype]: NP.plus(Number(BetAmountval), Setting.amount1) + ''
			});
		} else if (sign == 'add' && index == 7) {
			this.setState({
				[Activetype]: NP.plus(Number(BetAmountval), Setting.amount2) + ''
			});
		} else if (sign == 'add' && index == 3) {
			this.setState({
				[Activetype]: NP.plus(Number(BetAmountval), Setting.amount3) + ''
			});
		} else if (sign == 'clear') {
			/* 清空 */
			this.setState({
				[Activetype]: ''
			});
		} else if (index == 15) {
			this.setState({
				// [Activetype]: sign
				[Activetype]: sign
			});
		} else {
			let val = Number(BetAmountval);
			if (val == 0 && sign == 0) {
				// (val == '-0' && sign == '0') ||
				// (val == '0' && sign != '.') ||
				// (val == '-0' && sign != '.')
				//Toast.fail('金额不可以小于0！');
				return;
			}
			this.setState({
				[Activetype]: BetAmountval + sign
			});
		}
	};

	/* ***********************购物车删除 ***************************/
	RemoveBetCart = (item, BetType, callback) => {
		/* 删除轮询 */
		let deletePolling = (BetType, item) => {
			if (BetType == 1) {
				this.state.pollingKey.forEach((i) => {
					if (i.id == item.EventId) {
						this.props.Vendor.deletePolling(i.key);
					}
				});
			} else {
				this.props.Vendor.deletePolling(this.pollingKeyMore);
			}
		};
		if (item != '' && !callback) {
			this.setState(
				{
					BetSettings: [],
					Selections: [],
					BetInfoData: [],
					Removedata: [...this.state.Removedata, item]
				},
				() => {
					this.props.RemoveBetCart(item, BetType, callback);
					deletePolling(BetType, item);
				}
			);
		} else {
			this.props.RemoveBetCart([], BetType, callback);
			if (!this.state.PlayBettingStatus) {
				this.props.CloseBottomSheet();
			}
			this.props.PlayCloseBetCartmore();
			deletePolling(BetType, item);
		}
	};

	/* ********** 注单玩法切换 单投 混合过关 系统混合过关 *********/
	ClickTabmenu = (type) => {
		if(type == 1) {
			UMonEvent('BetCart', 'Click', 'Singlebet')
		} else if(type == 1) {
			UMonEvent('BetCart', 'Click', 'Combobet')
		} else {
			UMonEvent('BetCart', 'Click', 'SystemCombo')
		}
		this.setState(
			{
				BetActiveType: type,
				BetInfoData: [] /* 初始化详情数据 */
			},
			() => {
				if (type == 1) {
					/* 单投 */
					this.props.Betdata.forEach((element) => {
						this.CheckBetting(element);
					});
				} else if (this.props.Betdata != '' && (type == 2 || type == 3)) {
					/* 混合过关  */
					let MaxParlay = this.props.Vendor.configs.MaxParlay;
					this.CheckBetting(this.props.Betdata.slice(0, MaxParlay));
				}
			}
		);
		if ((type == 2 || type == 3) && this.props.Betdata.length < 2) {
			if (this.props.DetailPage) return;
			this.props.BetCartmore();
			this.props.CloseBottomSheet();
		} else {
			this.props.PlayCloseBetCartmore();
		}
		global.localStorage.setItem('freeval', null);
	};

	/* ***************** 监听查看更多滚动事件 *******************/
	_onScrollEvent(key) {
		// if (key) {
		// 	this._container.scrollTop = key * 185;
		// } else if (this._container.scrollTop + this._container.clientHeight === this._container.scrollHeight) {
		// 	this.setState({
		// 		ToDown: false,
		// 		ToUp: true
		// 	});
		// } else {
		// 	this.setState({
		// 		ToDown: true,
		// 		ToUp: false
		// 	});
		// }
	}

	/* *************************重置注单金额****************************/
	Resetamount = (Amountstate) => {
		if (this.state[Amountstate] != '') {
			this.setState({
				[Amountstate]: ''
			});
		}
	};

	render() {
		window.CheckBettings = (data) => {
			this.CheckBetting(data)
		}
		/* **********会员添加购物车投注选择的盘口数据********** */
		const { Betdata, isLandscape, detailHeight, detailWidth } = this.props;
		/* console.log('%c购物车数据', 'font-size:20px;color:orange;', Betdata); */
		const {
			/* 投注金额 */
			BetAmountval,
			/* 盘口详情 */
			BetInfoData,
			/* 注单类型 例 单投 混合 系统混合 */
			BetActiveType,
			/* 是否加载 */
			loading,
			/* 投注状态 0 未投注 1 投注中 2 投注成功 3 投注失败 */
			StartBettingloading,
			/* 投注状态 等待的盘口队列 */
			BettingbetInfo,
			/* 投注状态 失败的队列 */
			BettingError,
			/* 投注状态 成功的队列 */
			BettingSuccess,
			/* 可盈利金额 */
			WinBetAmount,
			/* 总投注额 */
			ComboCount,
			/* 上升赔率 */
			OddsUpData,
			/* 下降赔率 */
			OddsDown,
			/* 盘口检测 无法投注的队列 */
			CantPlayList,
			/* 串关队列 */
			BettingcomboType,
			/* 是否展示余额不足提示 */
			showBalanceError,
			/* 查看更多 回底部 */
			ToDown,
			/* 查看更多 回顶部 */
			ToUp,
			/*注单超时 下注的状态 */
			StillHaveBeting
		} = this.state;
		/* 已投注的队列数据 用于投注后的 状态 */
		const {
			/* 投注失败 */
			BettingisErrors,
			/* 投注成功 */
			BettingisSuccess,
			/* 投注等待 */
			BettingisbetInfo,
			/* 投注失败setting详情 */
			BettingisErrorsAmount,
			/* 投注成功setting详情 */
			BettingisSuccessAmount,
			/* 投注等待setting详情 */
			BettingisbetInfoAmount
		} = BetingOddCheck(BettingError, BetActiveType, BettingSuccess, BettingbetInfo);
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			// <View className={this.props.Minishow ? 'MiniShow' : 'Minihide'}>
			<View style={this.props.Minishow ? styles.MiniShow : styles.Minihide}>
				{StartBettingloading == 0 ? (
					<View style={{backgroundColor:'#000000'}}>
						{/* {loading && <Skeletonbottomsheet />} */}
						<View style={[styles.headerTop,{width: width,}]}>
							<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
								<Text style={{ color: '#fff', fontSize: 18, marginRight: 10 }}>รายการเดิมพัน</Text>
								<View style={styles.numIcon}>
									<Text style={{ color: '#fff' }}>{BetInfoData != '' ? BetInfoData.Selections.length : 0}</Text>
								</View>
							</View>
							<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} >
								{this.props.userInfo.isGettingBalance ? (
									<Text style={{ color: '#fff', paddingRight: 10 }}>ยอดเงินกำลังอัปเดต</Text>
								) : (
										<Text style={{ color: '#fff', paddingRight: 10 }}>฿{numberWithCommas(this.props.userInfo.balanceSB)}</Text>
									)}
								{this.props.userInfo.isGettingBalance ? (
									<View />
								) : (
										// <ReactSVG
										// 	src={'/svg/refresh.svg'}
										// 	onClick={() => {
										// 		this.props
										// 			.userInfo_getBalanceSB(true) //強制刷新
										// 			.then((result) => {
										// 				console.log('===refresh balance', result);
										// 				Toast.success('余额刷新成功');
										// 			});
										// 	}}
										// />
										<Touch
											onPress={() => {
												this.props
													.userInfo_getBalanceSB(true) //強制刷新
													.then((result) => {
														// Toasts.success('余额刷新成功');
														window.KeyBoardToast('success', 'ยอดเงินกำลังอัปเดต')
													});
											}}
										>
											<Image resizeMode='stretch' source={require('../../../images/refresh.png')} style={{ width: 20, height: 20 }} />
										</Touch>
									)}
							</View>
						</View>
						{this.props.userInfo.balanceSB < 20 &&
							showBalanceError && (
								<View style={[styles.ShowbalanceTxt,{width: width}]}>
									<Touch
										style={{height: 50,width: width}}
										onPress={() => {
											this.setState({
												showBalanceError: false
											});
											// this.props.CloseBottomSheet()
											// Actions.DepositCenter({ from: 'GamePage' })
										}}
									></Touch>
									<Touch 
										onPress={() => {
											this.props.CloseBottomSheet()
											Actions.deposit({ from: 'GamePage' })
										}}
										style={{position: 'absolute'}}
									>
										<Text style={{ fontSize: 16, lineHeight: 50 }}>ยอดเงินของคุณไม่เพียงพอ  <Text style={{ color: '#00B324', fontSize: 16, lineHeight: 50 }}>กรุณาเติมเงินก่อน.</Text></Text>
									</Touch>
								</View>
							)}
						<View
							style={styles.Bet_digit_keyboard}
						// ref={(e) => (this._container = e)}
						// onScroll={(event) => this._onScrollEvent(event)}
						// style={loading ? { overflow: 'hide' } : {}}
						>
							<View style={styles.BetTabs}>
								{[
									{ name: 'บิลเดี่ยว', type: 1 },
									{ name: 'พาร์เล่ย์', type: 2 },
									{ name: 'คอมโบพาร์เล่ย์', type: 3 }
								].map((item, index) => {
									return (
										<Touch
											key={index}
											style={BetActiveType == item.type ? [styles.ActiveMenu,{width: width / 3,}] : [styles.noActiveMenu,{width: width / 3,}]}
											onPress={() => {
												if (loading) return;
												/* 如果混合过关 没有数据 则让用户去添加 */
												this.ClickTabmenu(item.type);
											}}
										>
											<Text style={{color: '#F5F5F5'}}>{item.name}</Text>
										</Touch>
									);
								})}
							</View>
							{ loading && <View style={{position: 'absolute',zIndex: 999}}><KeyboardLoding /></View> }
							{Betdata.length > 1000000002 && (
								<View style={ToDown ? styles.CheckMore : styles.CheckMore_bottom}>
									{ToDown && (
										<View
											onPress={() => {
												this._container.scrollTop = this._container.scrollHeight;
												this.setState({
													ToDown: false,
													ToUp: true
												});
											}}
										>
											<Image resizeMode='stretch' source={require('../../../images/betting/down.png')} style={{ width: 20, height: 20 }} />
											<Text style={{color: '#F5F5F5'}}>查看更多</Text>
										</View>
									)}
									{ToUp && (
										<View
											onPress={() => {
												this._container.scrollTop = 0;
												this.setState({
													ToDown: true,
													ToUp: false
												});
											}}
										>
											<Image resizeMode='stretch' source={require('../../../images/betting/down.png')} style={{ width: 20, height: 20 }} />
											<Text style={{color: '#F5F5F5'}}>查看更多</Text>
										</View>
									)}
								</View>
							)}

							<View style={styles.Betlist}>
								{/* 盘口列表 */}
								{BetInfoData != '' && BetActiveType == 1 && (
									<BetOdds
										isLandscape={isLandscape}
										detailWidth={detailWidth}
										detailHeight={detailHeight}
										/* 上升赔率 */
										OddsUpData={OddsUpData}
										/* 下降赔率 */
										OddsDown={OddsDown}
										/* 盘口列表  */
										Betdata={Betdata}
										/* 充值金额 */
										BetAmountval={BetAmountval}
										/* 注单类型  单投 - 混合 - 系统混合 */
										BetType={BetActiveType}
										/* 盘口检查数据 */
										BetInfoData={BetInfoData}
										/* 传统数据 用于金额的state list */
										propsdata={this.state}
										/* 不能投注的盘口 */
										CantPlayList={CantPlayList}
										/* 切换注单Tab */
										ClickTabmenu={(t) => {
											this.ClickTabmenu(t);
										}}
										/* 盘口检查API */
										CheckBetting={(e) => {
											this.CheckBetting(e);
										}}
										/* 键盘金额计算 */
										modifyNum={(d, k, t) => {
											this.modifyNum(d, k, t);
										}}
										/* 重置金额为空 */
										Resetamount={(Amountstate) => {
											this.Resetamount(Amountstate);
										}}
										/* 监听滚动事件 */
										_onScrollEvent={(type) => {
											this._onScrollEvent(type);
										}}
										/* 投注API */
										StartBetting={(
											InfoData,
											amount,
											comboType,
											WinBetAmount,
											ComboCount,
											AcceptChangeOfOdds,
											FreeBetToken,
											BetAmountvallist,
											index
										) => {
											this.StartBetting(
												InfoData,
												amount,
												comboType,
												WinBetAmount,
												ComboCount,
												AcceptChangeOfOdds,
												FreeBetToken,
												BetAmountvallist,
												index
											);
										}}
										/* 切换到串关模式 */
										BetCartmore={() => {
											this.props.BetCartmore();
										}}
										/* 关闭注单模态框 */
										CloseBottomSheet={() => {
											this.props.CloseBottomSheet();
										}}
										/* 删除购物车盘口 */
										RemoveBetCart={(e, type) => {
											this.RemoveBetCart(e, type);
										}}
										/* 会员余额 */
										Balance={this.props.userInfo.balanceSB}
										/* 是否处于详情页 */
										DetailPage={this.props.DetailPage}
										/* 传递不同厂商的数据处理回调模块 */
										Vendor={this.props.Vendor}
										/* Redux管理 会陆续转换 */
										BetActions={this.props.BetActions}
									/>
								)}
								{/* 串关 例如 2串1 3串1 数据 */}
								{BetActiveType == 2 &&
									BetInfoData != '' && (
										<BetSettingsdata
											isLandscape={isLandscape}
											detailWidth={detailWidth}
											detailHeight={detailHeight}
											BetInfoData={BetInfoData}
											BetAmountval={BetAmountval}
											OddsUpData={OddsUpData}
											OddsDown={OddsDown}
											modifyNum={(d, k, t) => {
												this.modifyNum(d, k, t);
											}}
											propsdata={this.state}
											BetActiveType={BetActiveType}
											CantPlayList={CantPlayList}
											BetType={BetActiveType}
											StartBetting={(
												InfoData,
												amount,
												comboType,
												WinBetAmount,
												ComboCount,
												AcceptChangeOfOdds,
												FreeBetToken,
												BetAmountvallist,
												index
											) => {
												this.StartBetting(
													InfoData,
													amount,
													comboType,
													WinBetAmount,
													ComboCount,
													AcceptChangeOfOdds,
													FreeBetToken,
													BetAmountvallist,
													index
												);
											}}
											RemoveBetCart={(e, type) => {
												this.RemoveBetCart(e, type);
											}}
											/* 重置金额为空 */
											Resetamount={(Amountstate) => {
												this.Resetamount(Amountstate);
											}}
											/* 切换注单Tab */
											ClickTabmenu={(t) => {
												this.ClickTabmenu(t);
											}}
											BetCartmore={() => {
												this.props.BetCartmore();
											}}
											/* 监听滚动事件 */
											_onScrollEvent={(type) => {
												this._onScrollEvent(type);
											}}
											CloseBottomSheet={() => {
												this.props.CloseBottomSheet();
											}}
											Balance={this.props.userInfo.balanceSB}
											Vendor={this.props.Vendor}
										/>
									)}
								{/*系统混合过关 */}
								{BetActiveType == 3 &&
									BetInfoData != '' && (
										<SystemParlayBet
											isLandscape={isLandscape}
											detailWidth={detailWidth}
											detailHeight={detailHeight}
											BetInfoData={BetInfoData}
											modifyNum={(d, k, t) => {
												this.modifyNum(d, k, t);
											}}
											propsdata={this.state}
											Balance={this.props.userInfo.balanceSB}
											BetActiveType={BetActiveType}
											CantPlayList={CantPlayList}
											BetType={BetActiveType}
											StartBetting={(
												InfoData,
												amount,
												comboType,
												WinBetAmount,
												ComboCount,
												AcceptChangeOfOdds,
												FreeBetToken,
												BetAmountvallist,
												index
											) => {
												this.StartBetting(
													InfoData,
													amount,
													comboType,
													WinBetAmount,
													ComboCount,
													AcceptChangeOfOdds,
													FreeBetToken,
													BetAmountvallist,
													index
												);
											}}
											RemoveBetCart={(e, type) => {
												this.RemoveBetCart(e, type);
											}}
											Resetamount={(Amountstate) => {
												this.Resetamount(Amountstate);
											}}
											BetCartmore={() => {
												this.props.BetCartmore();
											}}
											ClickTabmenu={(t) => {
												this.ClickTabmenu(t);
											}}
											_onScrollEvent={(type) => {
												this._onScrollEvent(type);
											}}
											CloseBottomSheet={() => {
												this.props.CloseBottomSheet();
											}}
											BetAmountval={BetAmountval}
											OddsUpData={OddsUpData}
											OddsDown={OddsDown}
											Vendor={this.props.Vendor}
										/>
										// <View />
									)}
							</View>
						</View>
					</View>
				) : /* 投注中 */
					(StartBettingloading == 1 || StartBettingloading == 4) ? (
						<View style={styles.Beting_Box_Status}>
							<View style={[styles.Header,{width: width,}]}>
								<View style={styles.B_Loading}>
								<ActivityIndicator color="#F5F5F5" />
									{/* <ReactSVG src={'/svg/Loading.svg'} /> */}
								</View>
								<Text style={styles.headerTxt}>{StartBettingloading == 4 ? 'การเดิมพันอยู่ระหว่างรอการยืนยัน คุณสามารถตรวจสอบสถานะได้ที่ประวัติการเดิมพัน' : 'กรุณารอสักครู่ บิลของคุณอยู่ระหว่างดำเนินการ'}</Text>
							</View>
							<ScrollView>
								<View onStartShouldSetResponder={() => true}>
									<Betstatus
										detailWidth={detailWidth}
										detailHeight={detailHeight}
										BetInfoData={BettingisbetInfo}
										WinBetAmount={WinBetAmount}
										ComboCount={ComboCount}
										BetActiveType={BetActiveType}
										BettingisAmountstatus={BettingisbetInfoAmount}
										BettingcomboType={BettingcomboType}
									/>
									<View style={StartBettingloading == 4 ?styles.BottomBtnLoding4: styles.BottomBtnLoding}>
										<Touch
											style={[styles.cantEnter,{width: width - 30,}]}
											onPress={() => {
												this.props.CloseBottomSheet();
												UMonEvent('EngagementEvent_Click_BetcartContinue')
											}}
										>
											<Text style={styles.cantEnterTxt}>เดิมพันต่อ</Text>
										</Touch>
										<Touch
											style={[styles.cantEnterWhitebtn,{width: width - 30,}]}
											onPress={() => {
												UMonEvent('BetCart', 'Close', 'Back_Mainpage')
												this.props.CloseBottomSheet(this.props.EuroCupBetDetail);
												if(this.props.EuroCupBet || this.props.EuroCupBetDetail) {
													window.ChangeTabs && window.ChangeTabs(2)
												} else {
													Actions.Betting()
												}
											}}
										>
											<Text style={styles.cantEnterWhitebtnTxt}>ดูประวัติเดิมพัน</Text>
										</Touch>
										{/* <button
										className="CantEnter confirm whitebtn"
										onClick={() => {
											Router.push(
												'/bet-records?v=' +
												this.props.Vendor.configs.VendorName.toUpperCase() +
												'&=unsettle'
											);
										}}
									>
										查看投注单
									</button> */}
									</View>
									<Text style={{backgroundColor: '#000000' ,color: '#999999', fontSize: 10, textAlign: 'center', paddingVertical: 33}}>Copyright © 2011-2021 JBO All Rights Reserved.</Text>
								</View>
							</ScrollView>
						</View>
					) : /* 投注成功 */
						StartBettingloading == 2 ? (
							<View style={styles.Beting_Box_Status}>

								<View style={[styles.Header,{width: width,}]}>
									<View style={styles.headerIcon}>
										<Image resizeMode='stretch' source={require('../../../images/icon-done.png')} style={{ width: 28, height: 28 }} />
									</View>

									{/* <img src="/img/success.png" className="B_Success" /> */}
									<Text style={styles.headerTxt}>วางเดิมพันสำเร็จ</Text>
								</View>
								<ScrollView style={styles.Betlist}>
									<View onStartShouldSetResponder={() => true}>
										<Betstatus
											detailWidth={detailWidth}
											detailHeight={detailHeight}
											BetInfoData={BettingisSuccess}
											WinBetAmount={WinBetAmount}
											ComboCount={ComboCount}
											BetActiveType={BetActiveType}
											BettingisAmountstatus={BettingisSuccessAmount}
											BettingcomboType={BettingcomboType}
										/>

										<View style={styles.BottomBtn}>
											<Touch
												style={[styles.cantEnter,{width: width - 30,}]}
												onPress={() => {
													this.props.CloseBottomSheet();
													UMonEvent('BetCart', 'Click', 'Betcart_Continue')
												}}
											>
												<Text style={styles.cantEnterTxt}>เดิมพันต่อ</Text>
											</Touch>
											<Touch
												style={[styles.cantEnterWhitebtn,{width: width - 30,}]}
												onPress={() => {
													UMonEvent('BetCart', 'Close', 'Back_Mainpage')
													this.props.CloseBottomSheet(this.props.EuroCupBetDetail);
													if(this.props.EuroCupBet || this.props.EuroCupBetDetail) {
														window.ChangeTabs && window.ChangeTabs(2)
													} else {
														Actions.Betting()
													}
												}}
											>
												<Text style={styles.cantEnterWhitebtnTxt}>ดูประวัติเดิมพัน</Text>
											</Touch>

											{/* <button
											className={'confirm whitebtn'}
											onClick={() => {
												Router.push(
													'/bet-records?v=' +
													this.props.Vendor.configs.VendorName.toUpperCase() +
													'&=unsettle'
												);
												document.getElementsByTagName('html')[0].style.position = 'unset';
											}}
										>
											查看投注单
								</button> */}
										</View>
										<Text style={{backgroundColor: '#000000' ,color: '#999999', fontSize: 10, textAlign: 'center', paddingVertical: 33}}>Copyright © 2011-2021 JBO All Rights Reserved.</Text>
									</View>
									</ScrollView>
							</View>
						) : (
								/* 投注失败 */
								<View style={styles.Beting_Box_Status}>
									<View style={[styles.Header,{width: width,}]}>
										<View style={styles.headerIcon}>
											<Image resizeMode='stretch' source={require('../../../images/Error.png')} style={{ width: 28, height: 28 }} />
										</View>
										{/* <img src="/img/success.png" className="B_Success" /> */}
										<Text style={styles.headerTxt}>เดิมพันไม่สำเร็จ</Text>
									</View>
									<View style={styles.Betlist}>
										<Betstatus
											detailWidth={detailWidth}
											detailHeight={detailHeight}
											BetInfoData={BettingisErrors}
											WinBetAmount={WinBetAmount}
											ComboCount={ComboCount}
											BetActiveType={BetActiveType}
											BettingisAmountstatus={BettingisErrorsAmount}
											BettingcomboType={BettingcomboType}
										/>
										<View style={styles.BottomBtn}>
											<Touch
												style={[styles.cantEnter,{width: width - 30,}]}
												onPress={() => {
													if (this.props.Minishow) {
														this.props.onClose();
														return;
													}
													this.props.CloseBottomSheet();
												}}
											>
												<Text style={styles.cantEnterTxt}>ฉันเข้าใจแล้ว</Text>
											</Touch>
										</View>
									</View>
									<Text style={{backgroundColor: '#000000' ,color: '#999999', fontSize: 10, textAlign: 'center', paddingVertical: 33}}>Copyright © 2011-2021 JBO All Rights Reserved.</Text>
								</View>
							)}
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	userInfo: state.userInfo,
	BetInfo: state.BetInfo
});

const mapDispatchToProps = {
	userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
	BetActions: (e) => ACTION_BETINFO(e)
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(_key);

/* ************* 投注状态 投注中 - 投注成功 - 投注失败************** */
export class Betstatus extends React.Component {
	state = {
		showgift: false
	};
	render() {
		let {
			BetInfoData,
			WinBetAmount,
			ComboCount,
			BetActiveType,
			BettingisAmountstatus,
			BettingcomboType,
			detailWidth,
			detailHeight,
		} = this.props;
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View style={styles.betstatus}>
				<View>
					{BetInfoData != '' &&
						BetInfoData.map((item, keys) => {
							let Selections = BetActiveType == 1 ? item.Selections : item;
							return (
								<View key={keys} style={[styles.Betlistitem,{width: width - 20,}]}>
									<View style={[styles.betitem,{width: width - 50,}]}>
										{Selections.IsOutRightEvent ? (
											<Text style={[styles.teamName,{width: width * 0.7}]}>{`${Selections.OutRightEventName}`}</Text>
										) : (
												<Text style={[styles.teamName,{width: width * 0.7}]}>{`${Selections.HomeTeamName +
													' vs ' +
													Selections.AwayTeamName}`}</Text>
											)}
										<View>
											<Text style={{ color: '#00CAFF', fontSize: 17 }}>
												@{Selections.DisplayOdds}
												{/* @<span
													dangerouslySetInnerHTML={{
														__html: ChangeSvg(Selections.DisplayOdds)
													}}
													className="NumberBet"
												/> */}
											</Text>
										</View>
									</View>
									<View style={[styles.betitem,{width: width - 50,}]}>
										<Text style={{ color: '#CCCCCC', width: width * 0.4 }}>{Selections.LeagueName}</Text>
										<Text style={{ color: '#CCCCCC', fontWeight: 'bold', width: width * 0.4, textAlign: 'right' }}>{Selections.SelectionDesc}</Text>
									</View>
									<View style={[styles.betitem,{width: width - 50,}]}>
										<Text style={{ color: '#CCCCCC' }}>{Selections.LineDesc}</Text>
										<Text style={{ color: 'transparent' }}>1111</Text>
									</View>
								</View>
							);
						})}
				</View>
				<View className="Bottom-btn">
					{BetActiveType == 2 && <Text style={{color: '#F5F5F5', fontWeight: 'bold'}}>พาร์เล่ย์</Text>}
					{BetActiveType == 3 && <Text style={{color: '#F5F5F5', fontWeight: 'bold'}}>คอมโบพาร์เล่ย์</Text>}
					{(BetActiveType == 2 || BetActiveType == 3) &&
						BettingisAmountstatus != '' &&
						BettingcomboType != '' &&
						BettingisAmountstatus.map((item, index) => {
							let indexkey = BetActiveType == 3 ? 0 : index;
							let Typestatus = BettingcomboType[indexkey]
								? BettingcomboType[indexkey].comboType == item.ComboType
								: false;
							return (
								Typestatus && (
									<View style={{paddingBottom: 15}}key={index}>
										<View>
											<Text className="set-gray" style={{color: '#CCCCCC'}}>
												{item.ComboTypeName} x {item.ComboCount}@{item.EstimatedPayoutRate}
											</Text>
											{item.HasComboBonus && (
												<Touch 
													onPress={() => {
														this.setState({
															showgift: !this.state.showgift
														});
													}} className="gift" style={styles.gift}>
													<View style={styles.giftBg}>
														<Image resizeMode='stretch' source={require('../../../images/betting/orange.png')} style={{ width: 75, height: 35 }} />
													</View>
													<Text style={{ color: '#fff', paddingRight: 8 }}>{item.ComboBonusPercentage}%</Text>
													<Image resizeMode='stretch' source={require('../../../images/betting/gift.png')} style={{ width: 22, height: 22 }} />

													{/* <ReactSVG
														src={'/svg/betting/gift.svg'}
														onClick={() => {
															this.setState({
																showgift: !this.state.showgift
															});
														}}
														style={{ marginLeft: 0 }}
													/> */}
												</Touch>
											)}
											{
												this.state.showgift &&
												<ComboBonusModal
													visible={this.state.showgift}
													onClose={() => {
														this.setState({
															showgift: false
														});
													}}
												/>
											}
										</View>
										<View style={styles.BetAmountHun}>
											<Text className="light-gray" style={{color: '#CCCCCC'}}>
												ยอดเดิมพัน：<Text style={{ color: '#CCCCCC', fontWeight: 'bold' }}>฿{Number(BettingcomboType[indexkey].betAmount).toFixed(2)}</Text>
											</Text>
											<Text className="light-gray" style={{color: '#999999'}}>
												จ่าย：<Text style={{ color: '#CCCCCC', fontWeight: 'bold' }}> ฿{(Number(BettingcomboType[indexkey].betAmount) * Number(item.EstimatedPayoutRate)).toFixed(2)} </Text>
											</Text>
										</View>
									</View>
								)
							);
						})}
					<View style={styles.BetAmount}>
						<Text className="gray" style={{color: '#999999'}}>
							ยอดเดิมพันทั้งหมด：฿<Text style={{ color: '#CCCCCC', fontWeight: 'bold' }}>{Number(ComboCount).toFixed(2)}</Text>
						</Text>
						<Text className="gray" style={{color: '#999999'}}>
							จ่าย：฿<Text style={{ color: '#CCCCCC', fontWeight: 'bold' }}>{WinBetAmount}</Text>
						</Text>
					</View>
				</View>
			</View>
		);
	}
}

/* ******************** 购物车投注盘口列表 ********************** */
export class BetOdds extends React.Component {
	state = {
		ShowKeyboard: false,
		Activeinput: 0,
		BetAmountvaldata: [],
		Errorlist: []
	};

	render() {
		const { ShowKeyboard, Activeinput } = this.state;
		let { BetType, BetInfoData, OddsUpData, OddsDown, CantPlayList, Vendor, Balance, detailWidth, detailHeight } = this.props;
		const { Selections, BetSettings } = BetInfoData;
		let Errorlist = [];
		let Selectionsdata = Selections;
		let ComboCountlist = [];
		let EstimatedPayoutRatelist = [];
		let BetAmountvallist = [];
		let MaxParlay = Vendor.configs.MaxParlay;
		let Selectionsdatalist = BetType == 1 ? Selectionsdata : Selectionsdata.slice(0, MaxParlay);
		/* 免费投注检测 */
		const { Propdactiveindex, ShowFreeBets, FreeBetslist, SelectedFreeValue } = FreeBetCheck(
			this.refs.BetKeyboard,
			BetSettings,
			Activeinput
		);
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View style={{ height: (height * 0.9) - 90 }} key={BetType}>
				{Selections != '' ? (
					<View style={{ height: (height * 0.9) - 90 }}>
						<ScrollView
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}
						
						>
							<View style={{ paddingBottom: 160 }} onStartShouldSetResponder={() => true}>
								{Selectionsdatalist.map((item, index) => {
									let Activetype = 'BetAmount_' + BetType + '_' + index;
									let Amount = this.props.propsdata[`${Activetype}`];
									//只適用單投
									const targetBetSetting =
										BetSettings !== null
											? BetSettings[index] != null ? BetSettings[index] : false
											: false;
									/* 金额统一乘 负数盘比例（RealBetAmountRate），如果不是负数盘 比例返回的是 （1）  所以统一都乘 RealBetAmountRate */
									let AmountSet = targetBetSetting
										? Number(Number(Amount) * Number(targetBetSetting.RealBetAmountRate)).toFixed(2)
										: 0;
									BetAmountvallist[index] = Amount;
									ComboCountlist[index] = AmountSet;
									if (BetSettings && BetType == 1) {
										EstimatedPayoutRatelist[index] = targetBetSetting
											? (Number(BetAmountvallist[index]) *
												Number(targetBetSetting.EstimatedPayoutRate)).toFixed(2)
											: 0;
									}
									/* 检测盘口是否关闭 */
									let CantPlay = CantPlayList.findIndex((v) => {
										return v.EventId == item.EventId;
									});

									/* 如果盘口关闭 则把已经输入的注单金额 重置为空 */
									if (CantPlay != '-1' || !targetBetSetting) {
										this.props.Resetamount(Activetype);
									}

									/* 上升盘口 */
									let result =
										OddsUpData != ''
											? OddsUpData.some(function (items) {
												if (item.SelectionId == items.SelectionId) {
													return true;
												}
											})
											: false;
									/* 下降盘口 */
									let resultd =
										OddsDown != ''
											? OddsDown.some(function (items) {
												if (item.SelectionId == items.SelectionId) {
													return true;
												}
											})
											: false;
									/* 实际投注金额判断 */
									let ActualBetAmount = targetBetSetting ? targetBetSetting.IsMinusOdds : false;
									/* 错误的投注金额 */
									let Amounterror =
										AmountSet != '0.00' && targetBetSetting
											? AmountSet < targetBetSetting.MinAmount || AmountSet > targetBetSetting.MaxAmount
											: false;

									/* 错误对象 */
									let AmountCheck = {
										Amounterror: Amounterror,
										Amount: AmountSet
									};
									Errorlist.push(AmountCheck);
									let AmountFixed = Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';
									console.log(BetSettings," CantPlay != '-1' ? BetType == 1 && !targetBetSetting", CantPlay != '-1' , BetType == 1,targetBetSetting)
									return item ? (
										<View>
											<View style={[styles.Betinputlist,{width: width,}]} key={index}>
												<View style={[styles.input_area,{width: width - 20,}]}>
													{!item.IsOpenParlay && (BetType == 2 || BetType == 3) ? (
														<Touch
														style={[styles.CantPlay,{width: width - 20,}]}
															onPress={() => {
																this.props.RemoveBetCart(item, BetType);
															}}
														>
															<View style={styles.CantPlayErr}>
																<Text style={{ color: '#222222' }}>ไม่รองรับรูปแบบพาร์เลย์</Text>
															</View>
														</Touch>
													) : CantPlay != '-1' ? BetType == 1 && !targetBetSetting ? (
														<Touch
														style={[styles.CantPlay,{width: width - 20,}]}
															onPress={() => {
																this.props.RemoveBetCart(item, BetType);
															}}
														>
															<View style={styles.CantPlayErr}>
																<Text style={{ color: '#222222' }}>ปิดการเดิมพัน</Text>
															</View>
														</Touch>
													) : (
															<Touch
															style={[styles.CantPlay,{width: width - 20,}]}
																onPress={() => {
																	this.props.RemoveBetCart(item, BetType);
																}}
															>
																<View style={styles.CantPlayErr}>
																	<Text style={{ color: '#222222' }}>ปิดการเดิมพัน</Text>
																</View>
															</Touch>
														) : targetBetSetting &&
															targetBetSetting.MinAmount == 0 &&
															targetBetSetting.MinAmount == 0 ? (
																	<Touch
																	style={[styles.CantPlay,{width: width - 20,}]}
																		onPress={() => {
																			this.props.RemoveBetCart(item, BetType);
																		}}
																	>
																		<View style={styles.CantPlayErr}>
																			<Text style={{ color: '#222222' }}>赔率更新中</Text>
																		</View>
																	</Touch>
																) : (
																	<Text></Text>
																)}

													<View style={styles.closeLeft}>
														<Touch
															// style={styles.closeLeft}
															onPress={() => {
																this.props.RemoveBetCart(item, BetType);
															}}
															style={{ paddingLeft: 5, }}
														>
															<Image resizeMode='stretch' source={require('../../../images/close.png')} style={{ width: 18, height: 18 }} />
															{/* <ReactSVG className="Betting-closem -svg" src={'/svg/betting/close.svg'} /> */}
														</Touch>
													</View>
													<View style={[styles.itemRight,{width: width - 35 - 20,}]}>
														<View style={[styles.iteamName,{width: width - 55,}]}>
															{item.IsOutRightEvent ? (
																<Text style={{ color: '#F5F5F5', width: (width - 80) * 0.6, fontWeight: 'bold' }}>{`${item.OutRightEventName}`}</Text>
															) : (
																	<Text style={{ color: '#F5F5F5', width: (width - 80) * 0.6, fontWeight: 'bold' }}>
																		{item.HomeTeamName} vs {item.AwayTeamName}
																	</Text>
																)}
															<View>
																{result ? (
																	<View style={styles.OddsTxt}>
																		{/* @<span
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(item.DisplayOdds)
																}}
																className="NumberBet"
															/>
															<img src="/svg/betting/round-up.svg" /> */}
																		<Text style={{ color: '#00E62E', fontSize: 18, paddingRight: 5 }}>
																			@ {item.DisplayOdds}
																		</Text>
																		<Image resizeMode='stretch' source={require('../../../images/betting/round-up.png')} style={{ width: 12, height: 12 }} />
																	</View>
																) : resultd ? (
																	<View style={styles.OddsTxt}>
																		{/* @<span
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(item.DisplayOdds)
																}}
																className="NumberBet"
															/>
															<img src="/svg/betting/round-down.svg" /> */}
																		<Text style={{ color: '#FF2D12', fontSize: 18, paddingRight: 5 }}>
																			@ {item.DisplayOdds}
																		</Text>
																		<Image resizeMode='stretch' source={require('../../../images/betting/round-down.png')} style={{ width: 12, height: 12 }} />
																	</View>
																) : (
																			<View style={styles.OddsTxt}>
																				<Text style={{ color: '#00a6ff', fontSize: 18, paddingRight: 5 }}>
																					@ {item.DisplayOdds}
																				</Text>
																			</View>
																		)}
															</View>
														</View>
														<View style={[styles.iteamTime,{width: width - 55,}]}>
															<Text style={{ color: '#F5F5F5', width: (width - 80) * 0.4 }}>{item.LeagueName}</Text>
															<Text style={{ color: '#F5F5F5', fontWeight: 'bold', textAlign: 'right', width: (width - 80) * 0.4 }}>{item.SelectionDesc}</Text>
														</View>
														<View style={[styles.iteamInput,{width: width - 55,}]}>
															<Text className="gray Nameset" style={{width: width * 0.45, color: '#CCCCCC'}}>
																{item.LineDesc != 'undefined' ? item.LineDesc : ''}
															</Text>
															{BetType === 1 && (
																<Touch
																	style={[styles.InputBox,{width: width * 0.3,}]}
																	onPress={() => {
																		if (CantPlay != '-1') return;
																		this.setState({
																			ShowKeyboard: true,
																			Activeinput: index
																		});
																		this.props._onScrollEvent(index);
																	}}
																>
																	<Text style={{ color: '#F5F5F5', fontWeight: 'bold', lineHeight: 35, paddingLeft: 4, }}>
																		฿ <Text style={{ color: '#F5F5F5', fontWeight: '100', lineHeight: 35 }}>{AmountFixed}</Text>
																	</Text>
																	{/* <TextInput
														defaultValue={AmountFixed}
														style={{ width: '100%' }}
														disabled
														className={
															ShowKeyboard && Activeinput == index ? (
																'Inputactive input'
															) : (
																	'input'
																)
														}
														key={Amount}
														/> */}
																	{/* 兼容火狐 input disabled 无法触发click事件问题 放一个覆盖层 */}
																	{/* <Touch
															className="Falseinput"
															onPress={() => {
																if (CantPlay != '-1') return;
																this.setState({
																	ShowKeyboard: true,
																	Activeinput: index
																});
																this.props._onScrollEvent(index);
															}}
														/> */}
																</Touch>
															)}
														</View>
														{/* 负数盘 实际投注金额 */}
														{ActualBetAmount && (
															<View>
																<Text style={styles.ActualBetAmount}>实际投注฿ {numberWithCommas(AmountSet)}</Text>
															</View>
														)}
														{
															Errorlist[index].Amounterror &&
															<View style={[styles.maxMinErr,{width: width - 55,}]}>
																<View style={[styles.maxMinErrView,{width: width - 85,}]}>
																	{BetType === 1 &&
																		targetBetSetting &&
																		ShowKeyboard && (
																			<Text
																				style={styles.maxMinErrTxt}
																			// style={{
																			// 	display: Errorlist[index].Amounterror ? 'flex' : 'none'
																			// }}
																			>
																				{Errorlist[index].Amount < targetBetSetting.MinAmount &&
																					`จำนวนต้องมากกว่า หรือเท่ากับ ${numberWithCommas(targetBetSetting.MinAmount)} บาท`}
																				{Errorlist[index].Amount != '' &&
																					Errorlist[index].Amount > targetBetSetting.MaxAmount &&
																					`จำนวนต้องไม่เกิน หรือเท่ากับ ${numberWithCommas(targetBetSetting.MaxAmount)} บาท`}
																			</Text>
																		)}
																</View>
															</View>
														}

														{BetType === 1 &&
															BetSettings != null && (
																<View style={[styles.lightGray,{width: width - 55}]}>
																	<Text style={{ fontSize: 12, maxWidth: width * 0.36,color: '#CCCCCC' }}>
																		จ่าย:฿{BetAmountvallist[index] == '' || !targetBetSetting ? (
																			0
																		) : (
																				(Number(BetAmountvallist[index]) *
																					Number(targetBetSetting.EstimatedPayoutRate)).toFixed(2)
																			)}
																	</Text>
																	<Text style={{ fontSize: 12,color: '#CCCCCC' }}>
																		ต่ำสุด - สูงสุด:฿{targetBetSetting ? (
																			numberWithCommas(targetBetSetting.MinAmount)
																		) : (
																				0
																			)}-฿{targetBetSetting ? (
																				numberWithCommas(targetBetSetting.MaxAmount)
																			) : (
																					0
																				)}
																	</Text>
																</View>
															)}
													</View>
												</View>

											</View>
											{/* 投注键盘 */}
											<View style={[styles.ShowKeyboardBox,{width: width - 20,}]}>
												{ShowKeyboard &&
													Activeinput == index &&
													CantPlay == '-1' &&
													targetBetSetting && (
														<BetKeyboard
															isLandscape={this.props.isLandscape}
															detailWidth={detailWidth}
															detailHeight={detailHeight}
															modifyNum={(d, k, t) => {
																this.props.modifyNum(d, k, t);
															}}
															activeKeyboard={index}
															Max={targetBetSetting ? targetBetSetting.MaxAmount : 0}
															Balance={this.props.Balance}
															BetSettings={BetSettings == 'null' ? null : BetSettings}
															ref="BetKeyboard"
															BetActions={this.props.BetActions}
															Vendor={Vendor}
														/>
													)}
											</View>
										</View>
									) : (
											<View className="errortxt">此盘口关闭，或刷新试试！</View>
										);
								})}

							</View>
						</ScrollView>
					</View>
				) : (
						<View className="errortxt">此盘口关闭，或刷新试试！</View>
					)}
				{
					<View style={{ position: 'absolute', bottom: 0, left: 0 }}>
						{/* 适用于单投 */}
						{BetType === 1 && (
							<Bettotalamount
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								/* 选择的盘口下注金额数据  */
								BetAmountvallist={BetAmountvallist}
								/* 注单数量 */
								ComboCount={ComboCountlist}
								/* 注单类型 */
								BetActiveType={BetType}
								/* 盘口的金额赔率 用于计算可盈利的金额*/
								EstimatedPayoutRatelist={EstimatedPayoutRatelist}
								/* 盘口的详情数据 */
								BetInfoData={BetInfoData}
								/* 开始下注 */
								StartBetting={(
									InfoData,
									amount,
									comboType,
									WinBetAmount,
									ComboCount,
									AcceptChangeOfOdds,
									FreeBetToken,
									BetAmountvallist,
									index
								) => {
									this.props.StartBetting(
										InfoData,
										amount,
										comboType,
										WinBetAmount,
										ComboCount,
										AcceptChangeOfOdds,
										FreeBetToken,
										BetAmountvallist,
										index
									);
								}}
								/* 删除购物车 */
								RemoveBetCart={(e, type) => {
									this.props.RemoveBetCart(e, type);
								}}
								/* 混合投注模式 */
								BetCartmore={() => {
									this.props.BetCartmore();
								}}
								/* 关闭投注框 */
								CloseBottomSheet={() => {
									this.props.CloseBottomSheet();
								}}
								/* 当前选择的盘口key */
								ActiveInput={Activeinput}
								/* 选择的免费投注盘口的key */
								FreeBetSelect={Propdactiveindex}
								/* 免费投注的数据 */
								FreeBetslist={FreeBetslist}
								/* 选择的免费投注数据的key */
								SelectedFreeValue={SelectedFreeValue}
								Amounterror={
									Errorlist.filter((item) => item && item.Amounterror == true) != ''
								}
								Balance={Balance}
							/>
						)}
						<Text style={{backgroundColor: '#000000' ,color: '#999999', fontSize: 10, textAlign: 'center', paddingBottom: 33}}>Copyright © 2011-2021 JBO All Rights Reserved.</Text>
					</View>
				}
			</View>
		);
	}
}

export class BetOddList extends React.Component {
	state = {
		ShowKeyboard: false,
		Activeinput: 0,
		BetAmountvaldata: [],
		Errorlist: []
	};
	render() {
		const { ShowKeyboard, Activeinput } = this.state;
		let { BetType, BetInfoData, OddsUpData, OddsDown, CantPlayList, Vendor, Balance, detailWidth, detailHeight } = this.props;
		const { Selections, BetSettings } = BetInfoData;
		let Errorlist = [];
		let Selectionsdata = Selections;
		let ComboCountlist = [];
		let EstimatedPayoutRatelist = [];
		let BetAmountvallist = [];
		let MaxParlay = Vendor.configs.MaxParlay;
		let Selectionsdatalist = BetType == 1 ? Selectionsdata : Selectionsdata.slice(0, MaxParlay);
		/* 免费投注检测 */
		const { Propdactiveindex, ShowFreeBets, FreeBetslist, SelectedFreeValue } = FreeBetCheck(
			this.refs.BetKeyboard,
			BetSettings,
			Activeinput
		);
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View>
				{Selectionsdatalist.map((item, index) => {
					let Activetype = 'BetAmount_' + BetType + '_' + index;
					let Amount = this.props.propsdata[`${Activetype}`];
					//只適用單投
					const targetBetSetting =
						BetSettings !== null
							? BetSettings[index] != null ? BetSettings[index] : false
							: false;
					/* 金额统一乘 负数盘比例（RealBetAmountRate），如果不是负数盘 比例返回的是 （1）  所以统一都乘 RealBetAmountRate */
					let AmountSet = targetBetSetting
						? Number(Number(Amount) * Number(targetBetSetting.RealBetAmountRate)).toFixed(2)
						: 0;
					BetAmountvallist[index] = Amount;
					ComboCountlist[index] = AmountSet;
					if (BetSettings && BetType == 1) {
						EstimatedPayoutRatelist[index] = targetBetSetting
							? (Number(BetAmountvallist[index]) *
								Number(targetBetSetting.EstimatedPayoutRate)).toFixed(2)
							: 0;
					}
					/* 检测盘口是否关闭 */
					let CantPlay = CantPlayList.findIndex((v) => {
						return v.EventId == item.EventId;
					});

					/* 如果盘口关闭 则把已经输入的注单金额 重置为空 */
					if (CantPlay != '-1' || !targetBetSetting) {
						this.props.Resetamount(Activetype);
					}

					/* 上升盘口 */
					let result =
						OddsUpData != ''
							? OddsUpData.some(function (items) {
								if (item.SelectionId == items.SelectionId) {
									return true;
								}
							})
							: false;
					/* 下降盘口 */
					let resultd =
						OddsDown != ''
							? OddsDown.some(function (items) {
								if (item.SelectionId == items.SelectionId) {
									return true;
								}
							})
							: false;
					/* 实际投注金额判断 */
					let ActualBetAmount = targetBetSetting ? targetBetSetting.IsMinusOdds : false;
					/* 错误的投注金额 */
					let Amounterror =
						AmountSet != '0.00' && targetBetSetting
							? AmountSet < targetBetSetting.MinAmount || AmountSet > targetBetSetting.MaxAmount
							: false;

					/* 错误对象 */
					let AmountCheck = {
						Amounterror: Amounterror,
						Amount: AmountSet
					};
					Errorlist.push(AmountCheck);
					let AmountFixed = Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';
					return item ? (
						<View>
							<View style={[styles.Betinputlist,{width: width,}]} key={index}>
								<View style={[styles.input_area,{width: width - 20,}]}>
									{!item.IsOpenParlay && (BetType == 2 || BetType == 3) ? (
										<Touch
											style={[styles.CantPlay,{width: width - 20,}]}
											onPress={() => {
												this.props.RemoveBetCart(item, BetType);
											}}
										>
											<View style={styles.CantPlayErr}>
												<Text style={{ color: '#222222' }}>ไม่รองรับรูปแบบพาร์เลย์</Text>
											</View>
										</Touch>
									) : CantPlay != '-1' ? BetType == 1 && !targetBetSetting ? (
										<Touch
											style={[styles.CantPlay,{width: width - 20,}]}
											onPress={() => {
												this.props.RemoveBetCart(item, BetType);
											}}
										>
											<View style={styles.CantPlayErr}>
												<Text style={{ color: '#222222' }}>ปิดการเดิมพัน</Text>
											</View>
										</Touch>
									) : (
											<Touch
												style={[styles.CantPlay,{width: width - 20,}]}
												onPress={() => {
													this.props.RemoveBetCart(item, BetType);
												}}
											>
												<View style={styles.CantPlayErr}>
													<Text style={{ color: '#222222' }}>ปิดการเดิมพัน</Text>
												</View>
											</Touch>
										) : targetBetSetting &&
											targetBetSetting.MinAmount == 0 &&
											targetBetSetting.MinAmount == 0 ? (
													<Touch
														style={[styles.CantPlay,{width: width - 20,}]}
														onPress={() => {
															this.props.RemoveBetCart(item, BetType);
														}}
													>
														<View style={styles.CantPlayErr}>
															<Text style={{ color: '#222222' }}>赔率更新中</Text>
														</View>
													</Touch>
												) : (
													<Text></Text>
												)}

									<View style={styles.closeLeft}>
										<Touch
											// style={styles.closeLeft}
											onPress={() => {
												this.props.RemoveBetCart(item, BetType);
											}}
											style={{ paddingLeft: 5, }}
										>
											<Image resizeMode='stretch' source={require('../../../images/close.png')} style={{ width: 18, height: 18 }} />
											{/* <ReactSVG className="Betting-closem -svg" src={'/svg/betting/close.svg'} /> */}
										</Touch>
									</View>
									<View style={[styles.itemRight,{width: width - 35 - 20,}]}>
										<View style={[styles.iteamName,{width: width - 55,}]}>
											{item.IsOutRightEvent ? (
												<Text style={{ color: '#F5F5F5', width: (width - 80) * 0.6, fontWeight: 'bold' }}>{`${item.OutRightEventName}`}</Text>
											) : (
													<Text style={{ color: '#F5F5F5', width: (width - 80) * 0.6, fontWeight: 'bold' }}>
														{item.HomeTeamName} vs {item.AwayTeamName}
													</Text>
												)}
											<View>
												{result ? (
													<View style={styles.OddsTxt}>
														{/* @<span
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(item.DisplayOdds)
																}}
																className="NumberBet"
															/>
															<img src="/svg/betting/round-up.svg" /> */}
														<Text style={{ color: '#00E62E', fontSize: 18, paddingRight: 5 }}>
															@ {item.DisplayOdds}
														</Text>
														<Image resizeMode='stretch' source={require('../../../images/betting/round-up.png')} style={{ width: 12, height: 12 }} />
													</View>
												) : resultd ? (
													<View style={styles.OddsTxt}>
														{/* @<span
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(item.DisplayOdds)
																}}
																className="NumberBet"
															/>
															<img src="/svg/betting/round-down.svg" /> */}
														<Text style={{ color: '#FF2D12', fontSize: 18, paddingRight: 5 }}>
															@ {item.DisplayOdds}
														</Text>
														<Image resizeMode='stretch' source={require('../../../images/betting/round-down.png')} style={{ width: 12, height: 12 }} />
													</View>
												) : (
															<View style={styles.OddsTxt}>
																<Text style={{ color: '#00a6ff', fontSize: 18, paddingRight: 5 }}>
																	@ {item.DisplayOdds}
																</Text>
															</View>
														)}
											</View>
										</View>
										<View style={[styles.iteamTime,{width: width - 55,}]}>
											<Text style={{ color: '#F5F5F5', width: (width - 80) * 0.4 }}>{item.LeagueName}</Text>
											<Text style={{ color: '#F5F5F5', fontWeight: 'bold', textAlign: 'right', width: (width - 80) * 0.4 }}>{item.SelectionDesc}</Text>
										</View>
										<View style={[styles.iteamInput,{width: width - 55, color: '#CCCCCC'}]}>
											<Text className="gray Nameset" style={{ color: '#CCCCCC' }}>
												{item.LineDesc != 'undefined' ? item.LineDesc : ''}
											</Text>
											{BetType === 1 && (
												<Touch
													style={[styles.InputBox,{width: width * 0.3,}]}
													onPress={() => {
														if (CantPlay != '-1') return;
														this.setState({
															ShowKeyboard: true,
															Activeinput: index
														});
														this.props._onScrollEvent(index);
													}}
												>
													<Text style={{ color: '#F5F5F5', fontWeight: 'bold', lineHeight: 35, paddingLeft: 4, }}>
														฿ <Text style={{ color: '#F5F5F5', fontWeight: '100', lineHeight: 35 }}>{AmountFixed}</Text>
													</Text>
													{/* <TextInput
														defaultValue={AmountFixed}
														style={{ width: '100%' }}
														disabled
														className={
															ShowKeyboard && Activeinput == index ? (
																'Inputactive input'
															) : (
																	'input'
																)
														}
														key={Amount}
														/> */}
													{/* 兼容火狐 input disabled 无法触发click事件问题 放一个覆盖层 */}
													{/* <Touch
															className="Falseinput"
															onPress={() => {
																if (CantPlay != '-1') return;
																this.setState({
																	ShowKeyboard: true,
																	Activeinput: index
																});
																this.props._onScrollEvent(index);
															}}
														/> */}
												</Touch>
											)}
										</View>
										{/* 负数盘 实际投注金额 */}
										{ActualBetAmount && (
											<View>
												<Text style={styles.ActualBetAmount}>实际投注฿ {numberWithCommas(AmountSet)}</Text>
											</View>
										)}
										{
											Errorlist[index].Amounterror &&
											<View style={[styles.maxMinErr,{width: width - 55,}]}>
												<View style={[styles.maxMinErrView,{width: width - 85,}]}>
													{BetType === 1 &&
														targetBetSetting &&
														ShowKeyboard && (
															<Text
																style={styles.maxMinErrTxt}
															// style={{
															// 	display: Errorlist[index].Amounterror ? 'flex' : 'none'
															// }}
															>
																{Errorlist[index].Amount < targetBetSetting.MinAmount &&
																	`จำนวนต้องมากกว่า หรือเท่ากับ ${numberWithCommas(targetBetSetting.MinAmount)} บาท`}
																{Errorlist[index].Amount != '' &&
																	Errorlist[index].Amount > targetBetSetting.MaxAmount &&
																	`จำนวนต้องไม่เกิน หรือเท่ากับ ${numberWithCommas(targetBetSetting.MaxAmount)} บาท`}
															</Text>
														)}
												</View>
											</View>
										}

										{BetType === 1 &&
											BetSettings != null && (
												<View style={[styles.lightGray,{width: width - 55}]}>
													<Text style={{ fontSize: 12, }}>
														จ่าย：฿{BetAmountvallist[index] == '' || !targetBetSetting ? (
															0
														) : (
																(Number(BetAmountvallist[index]) *
																	Number(targetBetSetting.EstimatedPayoutRate)).toFixed(2)
															)}
													</Text>
													<Text style={{ fontSize: 12, }}>
														ต่ำสุด - สูงสุด：฿{targetBetSetting ? (
															numberWithCommas(targetBetSetting.MinAmount)
														) : (
																0
															)}-฿{targetBetSetting ? (
																numberWithCommas(targetBetSetting.MaxAmount)
															) : (
																	0
																)}
													</Text>
												</View>
											)}
									</View>
								</View>

							</View>
						</View>
					) : (
							<View className="errortxt">此盘口关闭，或刷新试试！</View>
						);
				})}
			</View>
		)
	}
}

/* ************* 串关 投注设置详情  例如 2串1 3串1 **************** */
export class BetSettingsdata extends React.Component {
	state = {
		ShowKeyboard: false,
		Activeinput: 0,
		BetAmountvallist: [],
		showgift: false,
		showgiftModal: false,
		BetAmountvaldata: [],
		Errorlist: [],
	};
	render() {
		const { ShowKeyboard, Activeinput } = this.state;
		const { BetType, BetInfoData, BetActiveType, OddsUpData, OddsDown, Balance, Vendor, CantPlayList,detailWidth,detailHeight } = this.props;
		const { BetSettings, Selections } = BetInfoData;
		let Errorlist = [];
		let BetAmountvallist = [];
		let ComboCountlist = [];
		let EstimatedPayoutRatelist = [];
		/* 删除不支持串关的数据 用于投注 */
		let IsOpenParlaySelections = Selections.filter((item) => item.IsOpenParlay == true);
		let ComboBonusdata = '';
		let ComboBonuskey = 0;
		/* 免费投注检测 */
		const { Propdactiveindex, ShowFreeBets, FreeBetslist, SelectedFreeValue } = FreeBetCheck(
			this.refs.BetKeyboard,
			BetSettings,
			Activeinput
		);

		let Selectionsdata = Selections;
		let MaxParlay = Vendor.configs.MaxParlay;
		let Selectionsdatalist = BetType == 1 ? Selectionsdata : Selectionsdata.slice(0, MaxParlay);

		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height

		return (
			<View>
				{Selections != '' ? (
					<View style={{ height: (height * 0.9) - 90 }}>
						<ScrollView
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
						>
							<View style={{ paddingBottom: 160 }} onStartShouldSetResponder={() => true}>
								<BetOddList
									detailWidth={detailWidth}
									detailHeight={detailHeight}
									BetInfoData={this.props.BetInfoData}
									BetAmountval={this.props.BetAmountval}
									OddsUpData={this.props.OddsUpData}
									OddsDown={this.props.OddsDown}
									modifyNum={(d, k, t) => {
										this.props.modifyNum(d, k, t);
									}}
									propsdata={this.props.propsdata}
									BetActiveType={this.props.BetActiveType}
									CantPlayList={this.props.CantPlayList}
									BetType={this.props.BetActiveType}
									StartBetting={(
										InfoData,
										amount,
										comboType,
										WinBetAmount,
										ComboCount,
										AcceptChangeOfOdds,
										FreeBetToken,
										BetAmountvallist,
										index
									) => {
										this.props.StartBetting(
											InfoData,
											amount,
											comboType,
											WinBetAmount,
											ComboCount,
											AcceptChangeOfOdds,
											FreeBetToken,
											BetAmountvallist,
											index
										);
									}}
									RemoveBetCart={(e, type) => {
										this.props.RemoveBetCart(e, type);
									}}
									/* 重置金额为空 */
									Resetamount={(Amountstate) => {
										this.props.Resetamount(Amountstate);
									}}
									/* 切换注单Tab */
									ClickTabmenu={(t) => {
										this.props.ClickTabmenu(t);
									}}
									BetCartmore={() => {
										this.props.BetCartmore();
									}}
									/* 监听滚动事件 */
									_onScrollEvent={(type) => {
										this.props._onScrollEvent(type);
									}}
									CloseBottomSheet={() => {
										this.props.CloseBottomSheet();
									}}
									Balance={this.props.Balance}
									Vendor={this.props.Vendor}
								/>

								{BetSettings && BetSettings != null ? (
									<View>
										<View>
											{BetSettings.map((item, index) => {
												let Activetype = 'BetAmount_' + BetActiveType + '_' + index;
												let Amount = this.props.propsdata[`${Activetype}`];
												BetAmountvallist[index] = Amount == '' ? 0 : Amount;
												ComboCountlist[index] = item.ComboCount * Amount;
												EstimatedPayoutRatelist[index] = (Number(BetAmountvallist[index]) *
													Number(item.EstimatedPayoutRate)).toFixed(2);
												let result =
													OddsUpData != ''
														? OddsUpData.some(function (items) {
															if (item.SelectionId == items.SelectionId) {
																return true;
															}
														})
														: false;
												let resultd =
													OddsDown != ''
														? OddsDown.some(function (items) {
															if (item.SelectionId == items.SelectionId) {
																return true;
															}
														})
														: false;

												if (item.HasComboBonus) {
													ComboBonusdata = item;
													ComboBonuskey = index;
												}
												let Amounterror =
													Amount != '' ? Amount < item.MinAmount || Amount > item.MaxAmount : false;
												let AmountCheck = {
													Amounterror: Amounterror,
													Amount: Amount
												};
												Errorlist.push(AmountCheck);
												let AmountFixed =
													Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';
												return (
													<View>
														<View style={[styles.Settingsinput,{width: width - 20,}]} key={index}>
															<View style={styles.list_Inputdata}>
																{result ? (
																	<View style={styles.OddsTxt}>
																		<Text style={{color: '#F5F5F5'}}>
																			{item.ComboTypeName}x{item.ComboCount}
																		</Text>
																		<View style={styles.OddsTxt}>
																			<Text style={{ color: '#00E62E', paddingRight: 5 }}>
																				@ {Number(item.EstimatedPayoutRate.toFixed(2))}
																			</Text>
																			<Image resizeMode='stretch' source={require('../../../images/betting/round-up.png')} style={{ width: 12, height: 12 }} />
																			{/* @<span
															dangerouslySetInnerHTML={{
																__html: ChangeSvg(
																	Number(item.EstimatedPayoutRate.toFixed(2))
																)
															}}
															className="NumberBet"
														/>
														<img src="/svg/betting/round-up.svg" /> */}
																		</View>
																	</View>
																) : resultd ? (
																	<View style={styles.OddsTxt}>
																		<Text style={{color: '#F5F5F5'}}>
																			{item.ComboTypeName}x{item.ComboCount}
																		</Text>
																		<View style={styles.OddsTxt}>
																			<Text style={{ color: '#FF2D12', paddingRight: 5 }}>
																				@ {Number(item.EstimatedPayoutRate.toFixed(2))}
																			</Text>
																			<Image resizeMode='stretch' source={require('../../../images/betting/round-down.png')} style={{ width: 12, height: 12 }} />
																			{/* @<span
															dangerouslySetInnerHTML={{
																__html: ChangeSvg(
																	Number(item.EstimatedPayoutRate.toFixed(2))
																)
															}}
															className="NumberBet"
														/>
														<img src="/svg/betting/round-down.svg" /> */}
																		</View>
																	</View>
																) : (
																			<View style={styles.OddsTxt}>
																				<Text style={{color: '#F5F5F5'}}>
																					{item.ComboTypeName}x{item.ComboCount}
																				</Text>
																				<View style={styles.OddsTxt}>
																					<Text style={{ color: '#00CAFF', paddingRight: 5 }}>
																						@ {Number(item.EstimatedPayoutRate.toFixed(2))}
																					</Text>
																					{/* @<span
															dangerouslySetInnerHTML={{
																__html: ChangeSvg(
																	Number(item.EstimatedPayoutRate.toFixed(2))
																)
															}}
															className="NumberBet"
														/>
														<img src="/svg/betting/round-down.svg" /> */}
																				</View>

																			</View>
																		)}

																<Touch
																	style={[styles.InputBox,{width: width * 0.3, color: '#CCCCCC'}]}
																	onPress={() => {
																		this.setState({
																			ShowKeyboard: true,
																			Activeinput: index
																		});
																	}}
																>
																	<Text style={{ color: '#CCCCCC', fontWeight: 'bold', lineHeight: 35, paddingLeft: 4, }}>
																		฿ <Text style={{ color: '#CCCCCC', fontWeight: '100', lineHeight: 35 }}>{AmountFixed}</Text>
																	</Text>
																</Touch>
																{
																	// 	<div className="InputBox">
																	// 	<span className="icon">฿</span>
																	// 	<input
																	// 		defaultValue={AmountFixed}
																	// 		style={{ width: '100%' }}
																	// 		disabled
																	// 		className={
																	// 			ShowKeyboard && Activeinput == index ? (
																	// 				'Inputactive input'
																	// 			) : (
																	// 					'input'
																	// 				)
																	// 		}
																	// 		key={Amount}
																	// 	/>
																	// 	<div
																	// 		className="Falseinput"
																	// 		onClick={() => {
																	// 			this.setState({
																	// 				ShowKeyboard: true,
																	// 				Activeinput: index
																	// 			});
																	// 		}}
																	// 	/>
																	// </div>
																}
															</View>

															{
																Errorlist[index].Amounterror &&
																<View style={[styles.maxMinErr,{width: width - 55,}]}>
																	{
																		ShowKeyboard && (
																			<Text
																				style={styles.maxMiinErrTxt2}
																			>
																				{Errorlist[index].Amount < item.MinAmount &&
																					`จำนวนต้องมากกว่า หรือเท่ากับ ${numberWithCommas(item.MinAmount)} บาท`}
																				{Errorlist[index].Amount != '' &&
																					Errorlist[index].Amount > item.MaxAmount &&
																					`จำนวนต้องไม่เกิน หรือเท่ากับ ${numberWithCommas(item.MaxAmount)} บาท`}
																			</Text>
																		)}
																</View>
															}
															{/* {ShowKeyboard &&
											Errorlist != '' && (

												// <p
												// 	className="Error"
												// 	style={{
												// 		display: Errorlist[index].Amounterror ? 'flex' : 'none'
												// 	}}
												// >
												// 	{Errorlist[index].Amount < item.MinAmount &&
												// 		`金额必须为฿ ${numberWithCommas(item.MinAmount)} 或以上的金额`}
												// 	{Errorlist[index].Amount > item.MaxAmount &&
												// 		`金额必须为฿ ${numberWithCommas(item.MaxAmount)} 或以下的金额`}
												// </p>
											)} */}

															{item.HasComboBonus && (
																<View className="gift">
																	<Touch style={styles.gift} onPress={() => {this.setState({showgift: !this.state.showgift})}}>
																		<View style={styles.giftBg}>
																			<Image resizeMode='stretch' source={require('../../../images/betting/orange.png')} style={{ width: 75, height: 35 }} />
																		</View>
																		<Text style={{color: '#fff'}}>{item.ComboBonusPercentage}%</Text>
																		<Image resizeMode='stretch' source={require('../../../images/betting/gift.png')} style={{ width: 22, height: 22 }} />
																	</Touch>
																	{this.state.showgift && (
																		<View style={styles.gift_alert}>
																			<View style={styles.arrow} />
																			<View style={styles.giftView}>
																				<View style={styles.giftViewList}>
																					<Text style={{color: '#fff', lineHeight: 35}}>串关奖励</Text>
																					<Touch onPress={() => { this.setState({ showgift: false }) }}>
																						<Image resizeMode='stretch' source={require('../../../images/closeWhite.png')} style={{ width: 20, height: 20 }} />
																					</Touch>
																				</View>
																				<View style={styles.giftViewList}>
																					<View>
																						<Text style={{color: '#fff', fontSize: 12}}>
																							串关奖励 系统将依据您投注的串关数给予
																						</Text>
																						<Text style={{color: '#fff', fontSize: 12}}>
																							您高{item.ComboBonusPercentage}%的额外赔率奖励
																						</Text>
																					</View>
																					<Touch 
																						onPress={() => {
																							this.setState({ showgiftModal: true });
																						}}
																						style={styles.giftDetail}
																					>
																						<Text style={{color: '#000', fontSize: 12}}>查看详情</Text>
																					</Touch>
																				</View>
																			</View>
																		</View>
																	)}
																	{
																		this.state.showgiftModal &&
																		<ComboBonusModal
																			visible={this.state.showgiftModal}
																			onClose={() => {
																				this.setState({
																					showgiftModal: false
																				});
																			}}
																		/>
																	}
																	
																</View>
															)}
															
															{/* <View className="list Amountdata">
											<small className="light-gray">
												จ่าย：฿{BetAmountvallist[index] == '' ? (
													0
												) : (
														(Number(BetAmountvallist[index]) *
															Number(item.EstimatedPayoutRate)).toFixed(2)
													)}
											</small>
											<small className="light-gray">
												最低-最高:฿{numberWithCommas(item.MinAmount)}-฿{numberWithCommas(item.MaxAmount)}
											</small>
										</View> */}
															<View style={[styles.lightGray,{width: width - 55}]}>
																<Text style={{ fontSize: 12, color: '#CCCCCC' }}>
																	จ่าย：฿{BetAmountvallist[index] == '' ? (
																		0
																	) : (
																			(Number(BetAmountvallist[index]) *
																				Number(item.EstimatedPayoutRate)).toFixed(2)
																		)}
																</Text>
																<Text style={{ fontSize: 12, color: '#CCCCCC' }}>
																	ต่ำสุด - สูงสุด:฿{numberWithCommas(item.MinAmount)}-฿{numberWithCommas(item.MaxAmount)}
																</Text>
															</View>

														</View>
														{/* 投注键盘 */}
														<View style={[styles.ShowKeyboardBox,{width: width - 20,}]}>
															{ShowKeyboard &&
																Activeinput == index && (
																	<BetKeyboard
																		isLandscape={this.props.isLandscape}
																		detailWidth={detailWidth}
																		detailHeight={detailHeight}
																		modifyNum={(d, k, t) => {
																			this.props.modifyNum(d, k, t);
																		}}
																		Max={item.MaxAmount}
																		Balance={this.props.Balance}
																		activeKeyboard={index}
																		BetSettings={BetSettings}
																		ref="BetKeyboard"
																		Vendor={Vendor}
																	/>
																)}
														</View>
													</View>
												);
											})}
										</View>
									</View>
								) : (
										/* 无法投注 */
										// <CannotBet
										// 	RemoveBetCart={(e, type) => {
										// 		this.props.RemoveBetCart(e, type);
										// 	}}
										// 	type={1}
										// 	Selections={Selections}
										// />
										<View />
									)}
							</View>
						</ScrollView>
					</View>
				) : (
						<View className="errortxt">此盘口关闭，或刷新试试！</View>
					)}
				{/* 混合过关确认 */}
				<View style={{ position: 'absolute', bottom: 0, left: 0 }}>
					{
						BetSettings && BetSettings != null ?

							<Bettotalamount
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								BetAmountvallist={BetAmountvallist}
								ComboCount={ComboCountlist}
								BetActiveType={BetActiveType}
								EstimatedPayoutRatelist={EstimatedPayoutRatelist}
								BetInfoData={BetInfoData}
								IsOpenParlaySelections={IsOpenParlaySelections}
								StartBetting={(
									InfoData,
									amount,
									comboType,
									WinBetAmount,
									ComboCount,
									AcceptChangeOfOdds,
									FreeBetToken,
									BetAmountvallist,
									index
								) => {
									this.props.StartBetting(
										InfoData,
										amount,
										comboType,
										WinBetAmount,
										ComboCount,
										AcceptChangeOfOdds,
										FreeBetToken,
										BetAmountvallist,
										index
									);
								}}
								RemoveBetCart={(e, type) => {
									this.props.RemoveBetCart(e, type);
								}}
								BetCartmore={() => {
									this.props.BetCartmore();
								}}
								CloseBottomSheet={() => {
									this.props.CloseBottomSheet();
								}}
								ActiveInput={Activeinput}
								HasComboBonus={ComboBonusdata != '' ? ComboBonusdata.HasComboBonus : false}
								ComboBonuskey={ComboBonuskey}
								OriginEstimatedPayoutRate={
									ComboBonusdata != '' ? ComboBonusdata.OriginEstimatedPayoutRate : 0
								}
								EstimatedPayoutRate={ComboBonusdata != '' ? ComboBonusdata.EstimatedPayoutRate : 0}
								/* 选择的免费投注key */
								FreeBetSelect={Propdactiveindex}
								/* 免费投注的数据 */
								FreeBetslist={FreeBetslist}
								SelectedFreeValue={SelectedFreeValue}
								Amounterror={
									Errorlist.filter((item) => item && item.Amounterror == true) != ''
								}
								Balance={Balance}
							/>
							:
							<CannotBet
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								RemoveBetCart={(e, type) => {
									this.props.RemoveBetCart(e, type);
								}}
								type={1}
								Selections={Selections}
							/>
					}
				</View>
			</View>
		);
	}
}

/* **********系统混合过关  例如 系统混合过关2/3 3串4 **************/
export class SystemParlayBet extends React.Component {
	state = {
		ShowKeyboard: false,
		MaxAmount: 0,
		MinAmount: 0,
		currentChecked: 0
	};
	componentDidMount() {
		const { BetInfoData } = this.props;
		this.setState({
			MaxAmount:
				BetInfoData.SystemParlayBetSettings && BetInfoData.SystemParlayBetSettings.length != 0
					? BetInfoData.SystemParlayBetSettings[0].MaxAmount
					: 0,
			MinAmount:
				BetInfoData.SystemParlayBetSettings && BetInfoData.SystemParlayBetSettings.length != 0
					? BetInfoData.SystemParlayBetSettings[0].MinAmount
					: 0
		});
	}
	render() {
		const { BetInfoData, Balance, Vendor, detailWidth, detailHeight } = this.props;
		const { MinAmount, MaxAmount, currentChecked } = this.state;
		let Activetype = 'BetAmount_3_0';
		let Amount = this.props.propsdata[`${Activetype}`];
		let BetAmountvallist = [Amount];
		let EstimatedPayoutRatelist =
			BetInfoData.SystemParlayBetSettings && BetInfoData.SystemParlayBetSettings.length != 0
				? [
					(Number(BetAmountvallist[0]) *
						Number(BetInfoData.SystemParlayBetSettings[currentChecked].EstimatedPayoutRate)).toFixed(2)
				]
				: [0];
		let ComboCountlist =
			BetInfoData.SystemParlayBetSettings && BetInfoData.SystemParlayBetSettings.length != 0
				? [BetInfoData.SystemParlayBetSettings[currentChecked].ComboCount * Amount]
				: [0];
		/* 删除不支持串关的数据 用于投注 */
		let IsOpenParlaySelections = BetInfoData.Selections.filter((item) => item.IsOpenParlay == true);
		/* 免费投注检测 */
		const { Propdactiveindex, FreeBetslist, SelectedFreeValue } = FreeBetCheck(
			this.refs.BetKeyboard,
			BetInfoData.SystemParlayBetSettings,
			currentChecked
		);
		let AmountFixed = Amount != '' && Amount != 'undefined' ? Number(Amount).toFixed(2) : '';
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View>
				<View style={{ height: (height * 0.9) - 90 }}>
					<ScrollView
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}>
						<View style={{ paddingBottom: 160 }} onStartShouldSetResponder={() => true}>
							<BetOddList
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								BetInfoData={this.props.BetInfoData}
								BetAmountval={this.props.BetAmountval}
								OddsUpData={this.props.OddsUpData}
								OddsDown={this.props.OddsDown}
								modifyNum={(d, k, t) => {
									this.props.modifyNum(d, k, t);
								}}
								propsdata={this.props.propsdata}
								BetActiveType={this.props.BetActiveType}
								CantPlayList={this.props.CantPlayList}
								BetType={this.props.BetActiveType}
								StartBetting={(
									InfoData,
									amount,
									comboType,
									WinBetAmount,
									ComboCount,
									AcceptChangeOfOdds,
									FreeBetToken,
									BetAmountvallist,
									index
								) => {
									this.props.StartBetting(
										InfoData,
										amount,
										comboType,
										WinBetAmount,
										ComboCount,
										AcceptChangeOfOdds,
										FreeBetToken,
										BetAmountvallist,
										index
									);
								}}
								RemoveBetCart={(e, type) => {
									this.props.RemoveBetCart(e, type);
								}}
								/* 重置金额为空 */
								Resetamount={(Amountstate) => {
									this.props.Resetamount(Amountstate);
								}}
								/* 切换注单Tab */
								ClickTabmenu={(t) => {
									this.props.ClickTabmenu(t);
								}}
								BetCartmore={() => {
									this.props.BetCartmore();
								}}
								/* 监听滚动事件 */
								_onScrollEvent={(type) => {
									this.props._onScrollEvent(type);
								}}
								CloseBottomSheet={() => {
									this.props.CloseBottomSheet();
								}}
								Balance={this.props.Balance}
								Vendor={this.props.Vendor}
							/>
							{BetInfoData.SystemParlayBetSettings != '' ? (
								<View style={[styles.SystemParlayBet,{width: width - 20,}]}>
									<View style={{ paddingHorizontal: 10}}>
										{BetInfoData.SystemParlayBetSettings && (
											<View className="cap-list">
												{BetInfoData.SystemParlayBetSettings.map((val, index) => {
													return (
														<Touch
															style={styles.capItem}
															key={index}
															onPress={() => {
																this.setState({
																	currentChecked: index,
																	MaxAmount: val.MaxAmount,
																	MinAmount: val.MinAmount
																});
															}}
														>
															<View style={{
																height: 14,
																width: 14,
																borderRadius: 12,
																borderWidth: 1,
																borderColor: '#00E62E',
																alignItems: 'center',
																justifyContent: 'center',
															}}>
																<View
																	style={[index === this.state.currentChecked ? styles.activeCapList : styles.capList]}
																	// className={`cap-item-circle${index === this.state.currentChecked
																	// 	? ' curr'
																	// 	: ''}`}
																/>
															</View>
															<Text style={{ paddingLeft: 10, color: '#F5F5F5' }}>{val.ComboTypeName}</Text>
														</Touch>
													);
												})}
											</View>
										)}
										<Touch style={[styles.capInput,{width: width - 50,}]} onPress={() => { this.setState({ ShowKeyboard: true }) }}>
											<Text style={{ paddingLeft: 10, lineHeight: 38, color: '#F5F5F5' }}>฿ {AmountFixed}</Text>
										</Touch>
										<View className="Inputdata InputBox">

											{/* <span className="icon">฿</span>
							<input
								defaultValue={AmountFixed}
								style={{ width: '100%' }}
								disabled
								className={this.state.ShowKeyboard ? 'Inputactive input' : 'input'}
								key={Amount}
							/> */}
											{/* 兼容火狐 input disabled 无法触发click事件问题 放一个覆盖层 */}
											{/* <div
								className="Falseinput"
								onClick={() => {
									this.setState({
										ShowKeyboard: true
									});
								}}
							/> */}
										</View>
										{
											Amount != '' &&
											<View style={[styles.maxMinErr2,{width: width - 50,}]}>
												<View style={[styles.maxMinErrView2,{width: width - 50,}]}>
													{Amount != '' &&
													Amount < MinAmount && <Text style={styles.maxMinErrTxt}>จำนวนต้องมากกว่า หรือเท่ากับ {numberWithCommas(MinAmount)} บาท</Text>}
													{Amount != '' &&
													Amount > MaxAmount && <Text style={styles.maxMinErrTxt}>จำนวนต้องไม่เกิน หรือเท่ากับ {numberWithCommas(MaxAmount)} บาท</Text>}
												</View>
											</View>
										}
										<View className="ShowKeyboardBox ">
											<Text style={{ fontSize: 12, lineHeight: 28, textAlign: 'right', color: '#999999' }}>
												ต่ำสุด - สูงสุด：฿{numberWithCommas(MinAmount)}-฿{numberWithCommas(MaxAmount)}
											</Text>
										</View>
									</View>
									

									{this.state.ShowKeyboard && (
										<BetKeyboard
											isLandscape={this.props.isLandscape}
											detailWidth={detailWidth}
											detailHeight={detailHeight}
											modifyNum={(d, k, t) => {
												this.props.modifyNum(d, k, t);
											}}
											Max={MaxAmount}
											Balance={this.props.Balance}
											activeKeyboard={0}
											BetSettings={BetInfoData.SystemParlayBetSettings}
											ref="BetKeyboard"
											Vendor={Vendor}
										/>
									)}
								</View>
							) : (
									/* 无法投注 */
									// <CannotBet
									// 	RemoveBetCart={(e, type) => {
									// 		this.props.RemoveBetCart(e, type);
									// 	}}
									// 	type={2}
									// 	Selections={BetInfoData.Selections}
									// />
									<View />
								)}
						</View>
					</ScrollView>
				</View>
				<View style={{ position: 'absolute', bottom: 0, left: 0 }}>
					{/* 系统混合过关确认 */}
					{
						BetInfoData.SystemParlayBetSettings != '' ?
							<Bettotalamount
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								BetAmountvallist={BetAmountvallist}
								ComboCount={ComboCountlist}
								BetActiveType={3}
								EstimatedPayoutRatelist={EstimatedPayoutRatelist}
								BetInfoData={BetInfoData}
								IsOpenParlaySelections={IsOpenParlaySelections}
								StartBetting={(
									InfoData,
									amount,
									comboType,
									WinBetAmount,
									ComboCount,
									AcceptChangeOfOdds,
									FreeBetToken,
									BetAmountvallist,
									index
								) => {
									this.props.StartBetting(
										InfoData,
										amount,
										comboType,
										WinBetAmount,
										ComboCount,
										AcceptChangeOfOdds,
										FreeBetToken,
										BetAmountvallist,
										index
									);
								}}
								RemoveBetCart={(e, type) => {
									this.props.RemoveBetCart(e, type);
								}}
								BetCartmore={() => {
									this.props.BetCartmore();
								}}
								CloseBottomSheet={() => {
									this.props.CloseBottomSheet();
								}}
								ActiveInput={this.state.currentChecked}
								/* 选择的免费投注key */
								FreeBetSelect={Propdactiveindex}
								/* 免费投注的数据 */
								FreeBetslist={FreeBetslist}
								SelectedFreeValue={SelectedFreeValue}
								Amounterror={Amount != '' ? Amount < MinAmount || Amount > MaxAmount : true}
								Balance={Balance}
							/>
							:
							/* 无法投注 */
							<CannotBet
								detailWidth={detailWidth}
								detailHeight={detailHeight}
								RemoveBetCart={(e, type) => {
									this.props.RemoveBetCart(e, type);
								}}
								type={2}
								Selections={BetInfoData.Selections}
							/>
					}
				</View>
			</View>
		);
	}
}

/* ---------------- 免费投注 ------------------ */
class FreeBet extends React.Component {
	constructor(props) {
		super();
		this.state = {
			showmenu: false,
			optionGroups: [
				{
					label: '选择免费投注',
					value: 0,
					FreeBetAmount: 0
				}
			],
			selectedValue: 0,
			FreeBetslist: '',
			FreeBetAmount: 0,
			FreeBetToken: 0,
			Propdactiveindex: 0
		};
	}

	componentDidMount() {
		let FreeBetslist =
			this.props.FreeBetsdata[this.props.activeindex] != null
				? this.props.FreeBetsdata[this.props.activeindex].FreeBets
				: [];
		if (FreeBetslist != '') {
			this.setState({
				FreeBetslist: FreeBetslist
			});
			
			FreeBetslist.forEach((item, key) => {
				let OBJ = { label: item.FreeBetName, value: key + 1, values: item.FreeBetToken, FreeBetAmount: item.FreeBetAmount };
				this.setState((state) => {
					return {
						optionGroups: [ ...state.optionGroups, OBJ ]
					};
				});
			});
		}
		let freeval = localStorage.getItem('freeval') || null;
		if (freeval != null) {
			this.handleChange(null, freeval);
		}
	}

	handleChange = (val, freeval) => {
		console.log('valvalvalvalvalval',val)
		let value = val != null ? val[0] : null;
		if (value == null) {
			/* 会员选择带有免费投注金额的盘口key */
			if (freeval != 'undefined' && freeval != 'null') {
				let local = freeval.split('_');
				this.setState(
					{
						selectedValue: local[0],
						Propdactiveindex: local[1]
					},
					() => {
						lcalset(local[0], local[1]);
					}
				);
			} else {
				this.setState(
					{
						selectedValue: value,
						Propdactiveindex: this.props.activeindex
					},
					() => {
						lcalset(value, this.props.activeindex);
					}
				);
			}
		} else {
			/* 当前选择的免费投注金额与当前选择的盘口，选择后只有当前选择的盘口才可操作，反之 disabled */
			this.setState(
				{
					selectedValue: value,
					Propdactiveindex: this.props.activeindex,
					FreeBetToken: this.state.optionGroups[value].values
				},
				() => {
					lcalset(value, this.props.activeindex);
				}
			);
		}

		/* 如果不是 请选择免费投注，就存入 localStorage*/
		function lcalset(value, activeindex) {
			if (value != 0 && value != null) {
				let active = value + '_' + activeindex;
				localStorage.setItem('freeval', active);
			} else {
				localStorage.setItem('freeval', null);
			}
		}
	};

	render() {
		const { activeindex,isLandscape,detailWidth,detailHeight  } = this.props;
		const { optionGroups, showmenu, FreeBetslist, selectedValue, Propdactiveindex } = this.state;
		let selectstatus = selectedValue == null || selectedValue == 0;
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View className="FreeBetlist">
				{FreeBetslist != '' &&
				/*如果 Propdactiveindex ==0 则还没有选择免费投注的金额 只要有免费投注数据的每个盘口都会显示此菜单，如果不等于0 则只显示在选择了免费投注的盘口 */
				(selectstatus || Propdactiveindex == activeindex) && (
					<View>
						<View style={{padding:10}}>
							<Touch
								onPress={(e) => {
									this.setState({
										showmenu: true
									});
								}}
								style={[styles.freedSelect,{width: width - 40}]}
							>
								<Text style={{color: '#000'}}>{selectstatus ? '选择免费投注' : this.state.optionGroups[selectedValue].label}</Text>
								<Image resizeMode='stretch' source={require('../../../images/down.png')} style={{ width: 20, height: 20 }} />
							</Touch>
						</View>
						{!selectstatus && (
							<Text style={{fontSize: 12,color: '#fcab23',paddingLeft: 10,paddingRight: 10}}>
								温馨提示：您已选择{this.state.optionGroups[selectedValue].label}，投注金额请大于或等于{this.state.optionGroups[selectedValue].FreeBetAmount}元
							</Text>
						)}
						<Modal
							animationType="none"
							transparent={true}
							visible={showmenu}
							animationType={'slide'}
							supportedOrientations={['portrait', 'landscape']} 
						>
							<View style={isLandscape? styles.depModalMin: styles.depModal}>
								<Touch style={styles.marks} onPress={() => { this.setState({showmenu:false})}} />
								{
									isLandscape &&
									<Touch  onPress={() => { this.setState({ isBottomSheetVisible: false }) }} style={[styles.LandscapeClose,{width: width, height: detailHeight,right: DeviceInfoIos? 35:0}]}></Touch>
								}
								<View 
									style={isLandscape? [styles.modalCenterLandscape,{width: width, height: detailHeight * 0.5,right: DeviceInfoIos? 35:0}]: styles.modalCenter}
								>
									<Touch style={styles.freedBtn} onPress={() => { this.setState({showmenu:false})}}>
										<Text style={{color: '#00a6ff', textAlign: 'right', lineHeight: 35,paddingRight: 15}}>完成</Text>
									</Touch>
									<PickerView
										onChange={this.handleChange}
										value={[this.state.selectedValue]}
										data={[optionGroups]}
										cascade={false}
									/>
								</View>
							</View>
						</Modal>
						{
						// <Drawer
						// 	onClose={() => {
						// 		this.setState({
						// 			showmenu: false
						// 		});
						// 	}}
						// 	hasHeader={false}
						// 	maskClosable
						// 	show={showmenu}
						// 	placement={'bottom'}
						// 	height={250}
						// 	className={'FreeBetbox'}
						// >
						// 	<div
						// 		className="Header"
						// 		onClick={() => {
						// 			this.setState({
						// 				showmenu: false
						// 			});
						// 		}}
						// 	>
						// 		<span>完成</span>
						// 	</div>
						// 	<Picker
						// 		selectedValue={Number(this.state.selectedValue)}
						// 		onValueChange={this.handleChange}
						// 		/* 如果已经选择了免费投注的盘口，则其他盘口要禁用不可再选 */
						// 		disabled={Propdactiveindex != activeindex ? true : false}
						// 	>
						// 		{optionGroups.map((item, key) => {
						// 			return (
						// 				<Picker.Item value={key} key={key}>
						// 					{item.title}
						// 				</Picker.Item>
						// 			);
						// 		})}
						// 	</Picker>
						// </Drawer>
							}
					</View>
				)}
			</View>
		);
	}
}

/* ------------------- 投注数字键盘 ------------------*/
export class BetKeyboard extends React.Component {
	state = {
		amount1: 0,
		amount2: 0,
		amount3: 0
	};
	componentDidMount() {
		let Setting;
		if (this.props.Vendor.configs.VendorName == 'IM') {
			Setting = VendorIM.getMemberSetting();
		}
		if (this.props.Vendor.configs.VendorName == 'BTI') {
			// Setting = VendorBTI.getMemberSetting();
		}
		this.setState({
			amount1: Setting.amount1,
			amount2: Setting.amount2,
			amount3: Setting.amount3
		});
	}
	render() {
		const { amount1, amount2, amount3 } = this.state;
		const { BetSettings, activeKeyboard, detailWidth, detailHeight } = this.props;
		let NumberList = [
			{
				name: '1',
				key: 1
			},
			{
				name: '2',
				key: 2
			},
			{
				name: '3',
				key: 3
			},
			{
				name: amount3,
				key: 'add'
			},
			{
				name: '4',
				key: 4
			},
			{
				name: '5',
				key: 5
			},
			{
				name: '6',
				key: 6
			},
			{
				name: amount2,
				key: 'add'
			},
			{
				name: '7',
				key: 7
			},
			{
				name: '8',
				key: 8
			},
			{
				name: '9',
				key: 9
			},
			{
				name: amount1,
				key: 'add'
			},
			{
				name: '00',
				key: '00'
			},
			{
				name: '0',
				key: 0
			},
			{
				name: '清除',
				key: 'clear'
			},
			{
				name: 'MAX',
				key: this.props.Balance > this.props.Max ? this.props.Max : this.props.Balance
			}
			
		];
		/* 是否有免费投注 */
		let ShowFreeBets = BetSettings != null ? BetSettings[activeKeyboard].FreeBets != '' : false;
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View style={[styles.Bet_digit_keyboard_area,{width: width - 20,}]}>
				{/* 免费投注 */}
				{ShowFreeBets && (
					<FreeBet
						detailHeight={detailHeight}
						detailWidth={detailWidth}
						isLandscape={this.props.isLandscape}
						FreeBetsdata={BetSettings}
						activeindex={activeKeyboard}
						ref="FreeBetState"
						BetActions={this.props.BetActions}
					/>
				)}
				<View style={[styles.number_area,{width: width - 20,}]}>
					{/* 键盘列表 */}
					{NumberList.map((item, index) => {
						return (
							<TouchableOpacity
								style={[styles.numItemBtn,{width: width * 0.2, height: (width * 0.2) * 0.58,
									backgroundColor: index == 3 || index == 7 || index == 11 ? '#45A2E6':
														index == 15?'#E64545':'#444444'}]}
								// className={
								// 	index == 3 ? (
								// 		'item btn'
								// 	) : index == 7 || index == 11 || index == 15 ? (
								// 		'item orgColor '
								// 	) : (
								// 				'item'
								// 			)
								// }
								key={index}
								onPress={() => {
									this.props.modifyNum(item.key, index, this.props.activeKeyboard);
								}}
							>
								{index == 14 ? (
									/* 删除 */
									// <ReactSVG className="Betting-dlt -svg" src={'/svg/betting/dlt.svg'} />
									<Image resizeMode='stretch' source={require('../../../images/betting/dlt.png')} style={{ width: 32, height: 32 }} />
								) : index == 15 ? (
										<Text style={{ color: '#F5F5F5' }}>
											MAX
										</Text>
									// <Image resizeMode='stretch' source={require('../../images/betting/max.png')} style={{ width: width * 0.2, height: (width * 0.2) * 0.58 }} />
								)
										: (
											<Text style={{ color: index == 3 || index == 7 || index == 11 || index == 15 ? '#F5F5F5' : '#CCCCCC' }}>
												{item.name}
											</Text>
										)
								}
							</TouchableOpacity>
						);
					})}
				</View>
			</View>
		);
	}
}

/* -----------确认投注 总金额 可赢 开始下注-------------*/
export class Bettotalamount extends React.Component {
	sum(arr) {
		return eval(arr.join('+'));
	}
	render() {
		const {
			/* 盘口计算盈利金额利率 类型array */
			EstimatedPayoutRatelist,
			/* 用于计算 总投注额 */
			ComboCount,
			/* 注单的类型 */
			BetActiveType,
			/* 投注的金额列表 */
			BetAmountvallist,
			/* 返回的盘口详情 */
			BetInfoData,
			/* 是否支持串关类型 */
			IsOpenParlaySelections,
			/* 选择的盘口key */
			ActiveInput,
			/* 串关奖励 状态*/
			HasComboBonus,
			/* 串关奖励的计算利率 */
			OriginEstimatedPayoutRate,
			/* 串关奖励的计算利率 */
			EstimatedPayoutRate,
			/* 串关奖励的key  */
			ComboBonuskey,
			/* 选择的免费投注盘口的key */
			FreeBetSelect,
			/* 免费投注的列表 */
			FreeBetslist,
			/*选则的免费投注的key  */
			SelectedFreeValue,
			/* 金额含有错误 */
			Amounterror,
			/* 用户余额 */
			Balance,
			detailWidth,
			detailHeight,
		} = this.props;
		/* 最大金额 */
		let Max = MaxAmountCheck(BetActiveType, BetInfoData, ActiveInput);
		/* 最小金额 */
		let Min = MinAmountCheck(BetActiveType, BetInfoData, ActiveInput);
		/* 总投注金额 */
		let ComboCountdata = ComboCount != '' ? this.sum(ComboCount) : 0;
		/* 判断单投的金额是否符合规定 混投是否满足至少两个支持混投的盘口并且金额符合规则 */
		const { Disabledstatus, FreeBetToken } = BetSubmitCheck(
			SelectedFreeValue,
			BetAmountvallist,
			FreeBetslist,
			Max,
			Min,
			BetActiveType,
			IsOpenParlaySelections,
			ComboCountdata,
			Amounterror,
			FreeBetSelect,
			ActiveInput
		);
		/* 可盈利金额 */
		let WinBetAmountdata = this.sum(EstimatedPayoutRatelist).toFixed(2);
		/* 余额不足 */
		let Balancenull = Balance == 0 || Balance < ComboCountdata;
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (
			<View style={[styles.bettotalamount,{width: width,}]}>
				<View style={[styles.total_amount,{width: width,}]}>
					<Text style={{ color: '#CCCCCC' }}>ยอดเดิมพันทั้งหมด</Text>
					<Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>฿{ComboCount != '' ? Number(this.sum(ComboCount)).toFixed(2) : 0}</Text>
				</View>
				{HasComboBonus && (
					<View style={[styles.total_amount,{width: width,}]}>
						<Text style={{ color: '#CCCCCC' }}>额外赢利</Text>
						<Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
							฿{ComboCount != '' ? (
								Number(
									ComboCount[ComboBonuskey] * (EstimatedPayoutRate - OriginEstimatedPayoutRate)
								).toFixed(2)
							) : (
									0
								)}
						</Text>
					</View>
				)}
				<View style={[styles.total_amount,{width: width,}]}>
					<Text style={{ color: '#CCCCCC' }}>จ่าย</Text>
					<Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>฿{this.sum(EstimatedPayoutRatelist).toFixed(2)}</Text>
				</View>
				<View style={[styles.BetingBtn,{width: width,}]}>
					{BetActiveType == 1 ? (
						<Touch
							style={styles.Btn_left}
							onPress={() => {
								this.props.BetCartmore();
								this.props.CloseBottomSheet();
							}}
						>

							<Text style={{ color: '#00B324', fontWeight: 'bold' }}>+พาร์เลย์</Text>
						</Touch>
					) : (
							<Touch
								style={styles.Btn_left}
								onPress={() => {
									this.props.RemoveBetCart([], 2);
									UMonEvent('BetCart', 'Back', 'ClearBetcart')
								}}
							>
								<Text style={{ color: '#00B324', fontWeight: 'bold' }}>ยกเลิกเดิมพัน</Text>
							</Touch>
						)}

					<Touch
						style={[styles.Btn_right,{width: width * 0.6}]}
						onPress={() => {
							UMonEvent('EngagementEvent_Submit_PlacebetEUROPage')
							if (this.sum(ComboCount) == 0) {
								// Toasts.fail('请输入金额后再进行投注吧');
								window.KeyBoardToast('fail', 'กรุณาวางเดิมพันหลังจากกรอกจำนวนเงิน')
								return;
							}
							if (Balancenull) {
								// Toasts.fail('您的余额不足，请充值后再进行投注吧');
								window.KeyBoardToast('fail', 'ยอดเงินของคุณไม่เพียงพอ กรุณาเติมเงินก่อน. ')
								return;
							}
							if (Disabledstatus) {
								if (Amounterror) {
									// Toasts.fail('请输入正确的投注金额噢');
									window.KeyBoardToast('fail', 'กรุณากรอกจำนวนเงินที่ถูกต้อง')
								} else {
									// Toasts.fail('暂时无法投注');
									window.KeyBoardToast('fail', 'ไม่สามารถเดิมพันได้ชั่วคราว')
								}
								return;
							}
							if (BetActiveType != 1) {
								/* 只需要支持串关的数据 */
								BetInfoData.Selections = IsOpenParlaySelections;
							}
							const { Selections, BetSettings, SystemParlayBetSettings } = BetInfoData;
							BetAmountvallist.forEach((amount, index) => {
								/* 单投数据 */
								let PostData = {
									BetSettings: BetSettings[index],
									Selections: Selections[index]
								};
								/* 是否接受赔率变化 */
								let AcceptChangeOfOdds = false;
								/* 盘口类型 */
								let ComboType =
									BetActiveType == 2
										? BetSettings[index].ComboType
										: BetActiveType == 3 ? SystemParlayBetSettings[ActiveInput].ComboType : 0;
								if (amount > 0) {
									this.props.StartBetting(
										BetActiveType != 1 ? BetInfoData : PostData,
										/* 金额 */
										amount,
										/* 單注填0 */
										ComboType,
										/* จ่าย */
										WinBetAmountdata,
										/* 总投注额 */
										ComboCountdata,
										/* 是否接受赔率变化 */
										AcceptChangeOfOdds,
										/* 免费投注id */
										FreeBetToken != '' ? FreeBetToken : '',
										/* 提交的金额队列 */
										BetAmountvallist,
										/* 放当队列的 key */
										index
									);
								}
							});
						}}
					>
						<Text style={{ color: Balancenull || Disabledstatus ? '#FFFFFF' : '#FFFFFF', }}>ยืนยันการเดิมพัน</Text>
					</Touch>
				</View>
			</View>
		);
	}
}

/*----------- 当投注条件不成立时 无法投注时 显示 ---------- */
export class CannotBet extends React.Component {
	render() {
		const { type, Selections, detailWidth, detailHeight } = this.props;
		// let message = () => {
		// 	if (type == 1 && Selections.length < 2) {
		// 		return 'เดิมพันแบบพาร์เลย์ขั้นต่ำ 2 คู่';
		// 	}
		// 	if (type == 2 && Selections.length < 3) {
		// 		return '系统混合过关最少需要三场赛事呦';
		// 	}
		// 	return '暂时无法投注';
		// };
		let width = detailWidth? detailWidth: width
		let height = detailHeight? detailHeight : height
		return (

			<View style={[styles.bettotalamount,{width: width,}]}>
				<View style={[styles.total_amount,{width: width,}]}>
					<Text style={{ color: '#CCCCCC' }}>ยอดเดิมพันทั้งหมด</Text>
					<Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>฿ 0</Text>
				</View>
				<View style={[styles.total_amount,{width: width,}]}>
					<Text style={{ color: '#CCCCCC' }}>จ่าย</Text>
					<Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>฿ 0</Text>
				</View>
				<View  style={[styles.BetingBtn,{width: width,}]}>
					<Touch
						style={styles.Btn_left}
						onPress={() => {
							this.props.RemoveBetCart([], 2);
							UMonEvent('BetCart', 'Back', 'ClearBetcart')
						}}
					>
						<Text style={{ color: '#00B324', fontWeight: 'bold' }}>ยกเลิกเดิมพัน</Text>
					</Touch>
					<Touch
						style={[styles.Btn_right,{width: width * 0.6}]}
						onPress={() => {
							if (type == 1 && Selections.length < 2) {

								// Toasts.fail('เดิมพันแบบพาร์เลย์ขั้นต่ำ 2 คู่');
								window.KeyBoardToast('fail', 'เดิมพันแบบพาร์เลย์ขั้นต่ำ 2 คู่')
							} else if (type == 2 && Selections.length < 3) {

								// Toasts.fail('系统混合过关最少需要三场赛事呦');
								window.KeyBoardToast('fail', 'วางเดิมพันพาร์เลย์ขั้นต่ำ 3 คู่')
							} else {
								// Toasts.fail('暂时无法投注');
								window.KeyBoardToast('fail', 'ไม่สามารถเดิมพันได้ชั่วคราว')
							}
						}}>
						<Text style={{ color: '#FFFFFF' }}>ยืนยันการเดิมพัน</Text>
					</Touch>
				</View>
			</View>
			// <div className="Bottom-flex">
			// 	<div className="total-amount">
			// 		<label className="gray">ยอดเดิมพันทั้งหมด</label>
			// 		<b>฿ 0</b>
			// 	</div>
			// 	<div className="total-amount">
			// 		<label className="gray">จ่าย</label>
			// 		<b>฿ 0</b>
			// 	</div>
			// 	<div className="BetingBtn">
			// 		<button
			// 			className="Btn-left"
			// 			onClick={() => {
			// 				this.props.RemoveBetCart([], 2);
			// 			}}
			// 		>
			// 			全部清除
			// 		</button>

			// 		<button
			// 			className="Btn-right"
			// 			style={{
			// 				color: '#ccc'
			// 			}}
			// 			onClick={() => {
			// 				Toast.fail(message());
			// 			}}
			// 		>
			// 			<big>投注</big>
			// 		</button>
			// 	</div>
			// </div>
		);
	}
}

/* -------------------------- 检测相关 -------------------- */
/* 最大金额检测  */
export const MaxAmountCheck = (BetActiveType, BetInfoData, ActiveInput) => {
	let Max = 0;
	if (
		BetActiveType == 3 &&
		BetInfoData.SystemParlayBetSettings != null &&
		BetInfoData.SystemParlayBetSettings.length != 0
	) {
		Max = BetInfoData.SystemParlayBetSettings[ActiveInput].MaxAmount;
	} else if (BetInfoData.BetSettings != null) {
		if (BetInfoData.BetSettings[ActiveInput]) {
			Max = BetInfoData.BetSettings[ActiveInput].MaxAmount;
		}
	}
	return Max;
};

/* 最小金额检测 */
export const MinAmountCheck = (BetActiveType, BetInfoData, ActiveInput) => {
	let Min = 0;
	if (
		BetActiveType == 3 &&
		BetInfoData.SystemParlayBetSettings != null &&
		BetInfoData.SystemParlayBetSettings.length != 0
	) {
		Min = BetInfoData.SystemParlayBetSettings[ActiveInput].MinAmount;
	} else if (BetInfoData.BetSettings != null) {
		if (BetInfoData.BetSettings[ActiveInput]) {
			Min = BetInfoData.BetSettings[ActiveInput].MinAmount;
		}
	}
	return Min;
};
/* 提交投注检测 */
export const BetSubmitCheck = (
	SelectedFreeValue,
	BetAmountvallist,
	FreeBetslist,
	Max,
	Min,
	BetActiveType,
	IsOpenParlaySelections,
	ComboCountdata,
	Amounterror,
	FreeBetSelect,
	ActiveInput
) => {
	/* 充值按钮状态 */
	let Disabledstatus;
	/* 免费投注id */
	let FreeBetToken = '';
	/* 如果免费投注 */
	if (SelectedFreeValue != 0 && FreeBetSelect == ActiveInput && FreeBetslist != '') {
		/*  有免费投注的话 进入免费投注的金额逻辑 反之 进入常规金额逻辑 */
		let status =
			BetAmountvallist[FreeBetSelect] > Max ||
			BetAmountvallist[FreeBetSelect] < FreeBetslist[SelectedFreeValue - 1].FreeBetAmount;
		Disabledstatus = status;
		if (!Disabledstatus) {
			FreeBetToken = FreeBetslist[SelectedFreeValue - 1].FreeBetToken;
		}
		/* 如果是单投 */
	} else if (BetActiveType == 1) {
		Disabledstatus = Amounterror;
	} else {
		/* 检测混投金额 如果串关的盘口数量小于2 */
		if (IsOpenParlaySelections.length < 2) {
			Disabledstatus = true;
		} else {
			Disabledstatus = Amounterror;
		}
	}
	return {
		Disabledstatus: ComboCountdata == 0 ? true : Disabledstatus,
		FreeBetToken: FreeBetToken
	};
	function add(arr) {
		return eval(arr.join('+'));
	}
};

/* 免费投注检测 */
export const FreeBetCheck = (BetKeyboard, BetSettings, Activeinput) => {
	let Propdactiveindex =
		BetKeyboard && BetKeyboard.refs.FreeBetState && BetKeyboard.refs.FreeBetState.state.Propdactiveindex;
	let ShowFreeBets =
		BetSettings != null ? (BetSettings[Activeinput] ? BetSettings[Activeinput].FreeBets != '' : false) : false;
	let FreeBetslist = BetSettings != null ? (BetSettings[Activeinput] ? BetSettings[Activeinput].FreeBets : '') : '';
	let SelectedFreeValue =
		(BetKeyboard && BetKeyboard.refs.FreeBetState && BetKeyboard.refs.FreeBetState.state.selectedValue) || 0;
	return {
		Propdactiveindex,
		ShowFreeBets,
		FreeBetslist,
		SelectedFreeValue
	};
};

/* 投注状态检测 */
export const BetingOddCheck = (BettingError, BetActiveType, BettingSuccess, BettingbetInfo) => {
	/* 已投住的盘口Selections详情 */
	let BettingisErrors = BettingError != '' ? (BetActiveType == 1 ? BettingError : BettingError[0].Selections) : [];
	let BettingisSuccess =
		BettingSuccess != '' ? (BetActiveType == 1 ? BettingSuccess : BettingSuccess[0].Selections) : [];
	let BettingisbetInfo =
		BettingbetInfo != '' ? (BetActiveType == 1 ? BettingbetInfo : BettingbetInfo[0].Selections) : [];
	/* 已投注的盘口Setting详情 */
	let BettingisErrorsAmount =
		BettingError != ''
			? BetActiveType == 1
				? BettingError
				: BetActiveType == 2 ? BettingError[0].BetSettings : BettingError[0].SystemParlayBetSettings
			: [];
	let BettingisSuccessAmount =
		BettingSuccess != ''
			? BetActiveType == 1
				? BettingSuccess
				: BetActiveType == 2 ? BettingSuccess[0].BetSettings : BettingSuccess[0].SystemParlayBetSettings
			: [];
	let BettingisbetInfoAmount =
		BettingbetInfo != ''
			? BetActiveType == 1
				? BettingbetInfo
				: BetActiveType == 2 ? BettingbetInfo[0].BetSettings : BettingbetInfo[0].SystemParlayBetSettings
			: [];
	return {
		BettingisErrors,
		BettingisSuccess,
		BettingisbetInfo,
		BettingisErrorsAmount,
		BettingisSuccessAmount,
		BettingisbetInfoAmount
	};
};

/* 金额分割 */
function numberWithCommas(num) {
	return num !== '' ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
}
