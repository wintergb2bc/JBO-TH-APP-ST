/* 
	投注页面 Swiper 区域
*/
import Router from 'next/router';
import Toast from '@/Toast';
import { ChangeSvg } from '$LIB/js/util';
import SwiperCore, { Navigation, Pagination } from 'src/containers/game/Betting/Swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
SwiperCore.use([ Navigation, Pagination ]);
const swiperConfigs = {
	autoplay: false,
	speed: 500,
	spaceBetween: 30,
	effect: 'fade',
	roundLengths: true /* 防止常规分辨率屏幕上的文本模糊 */,
	loop: true /* 循环模式 */,
	pagination: {
		el: '.game-swiper-pagination',
		bulletElement: 'li',
		hideOnClick: true,
		clickable: true
	},
	passiveListeners: true /* 事件侦听器，以提高移动设备上的滚动性能 */
};
class _Swiper extends React.PureComponent {
	/* 开始下注 */
	Placeabet = (data, type) => {
		this.props.ShowBottomSheet(data, type);
	};

	getSwiperConfigs = (item) => {
		let clone = JSON.parse(JSON.stringify(swiperConfigs));
		return Object.assign(clone, { loop: item.Lines && item.Lines.length > 2 });
	};

	render() {
		const {
			Periodlist,
			CutEventitem,
			OddsUpData,
			OddsDownData,
			PlayBetCart,
			BetCartdata,
			BetSelectionCount,
			BetSelectionCountlength
		} = this.props;
		const thisSwiperConfigs = this.getSwiperConfigs(CutEventitem);
		return (
			<div>
				<Swiper {...thisSwiperConfigs} className="Game-swiper-list">
					{CutEventitem.Lines != '' ? (
						/*  Periodlist 是有几种赛场类型 进行Swiper切换*/
						Periodlist.map((x, indexs) => {
							const PeriodLines = CutEventitem.Lines.filter(
								/*  当前一组的赛场类型 */
								(item) => item.PeriodId == x
							);
							return (
								<SwiperSlide className="swiper-slide" key={indexs}>
									<div className="swiper-slide-data">
										<div className="table">
											<div className="table-header-group">
												<ul className="table-row">
													{/* 例如全场和大小 + 拼接 data是分开的 */}
													{PeriodLines.length > 1 ? (
														PeriodLines.map((i, k) => {
															return (
																<li className="table-cell-swiper" key={k}>
																	<span className="white">
																		{i.PeriodName + i.BetTypeName}
																	</span>
																</li>
															);
														})
													) : (
														[ 'เต็มเวลา สูงต่ำ', 'เต็มเวลาแฮนดิแคป' ].map((n, k) => {
															return (
																<li className="table-cell-swiper" key={k}>
																	<span className="white">{n}</span>
																</li>
															);
														})
													)}
												</ul>
											</div>
											<div className="table-row-group">
												{/* 主队cs客队 赔率*/}
												<TeamSwiper
													/* 盘口类别 */
													PeriodLines={PeriodLines}
													/* 盘口类别list */
													CutEventitem={CutEventitem}
													/* 上升赔率 */
													OddsUpData={OddsUpData}
													/* 下降赔率 */
													OddsDownData={OddsDownData}
													/* 串关状态 布尔类型 */
													PlayBetCart={PlayBetCart}
													/* 购物车 */
													BetCartdata={BetCartdata}
													/* 当前串关的数量 */
													BetSelectionCount={BetSelectionCount}
													/* 串关的配置的最大值 */
													BetSelectionCountlength={BetSelectionCountlength}
													/* 打开投注框 */
													Placeabet={(data, type) => {
														this.Placeabet(data, type);
													}}
													/* 添加购物车 */
													PushBetCart={(data, type) => {
														this.props.PushBetCart(data, type);
													}}
													/* 删除购物车 */
													RemoveBetCart={(data, type) => {
														this.props.RemoveBetCart(data, type);
													}}
												/>
											</div>
										</div>
									</div>
								</SwiperSlide>
							);
						})
					) : (
						defaultnull
					)}
					<div
						style={{ display: CutEventitem.Lines.length > 2 ? 'block' : 'none' }}
						className="game-swiper-pagination"
					/>
				</Swiper>
			</div>
		);
	}
}

export default _Swiper;

/* 主队vs客队列表 */
class TeamSwiper extends React.PureComponent {
	state = {
		Active: false
	};
	render() {
		const {
			PeriodLines,
			CutEventitem,
			OddsUpData,
			OddsDownData,
			PlayBetCart,
			BetCartdata,
			BetSelectionCount,
			BetSelectionCountlength
		} = this.props;
		/*  IsLocked == 封盘  */
		return [ 1, 2 ].map((Teamitem, Teamindex) => {
			return (
				<ul className="table-row" key={Teamindex}>
					{PeriodLines.length > 1 ? (
						PeriodLines.map((item, index) => {
							let taregtSelectionExists = item.Selections && item.Selections[Teamindex];

							let result =
								OddsUpData != '' && taregtSelectionExists
									? OddsUpData.some(function(items) {
											if (
												CutEventitem.EventId === items.EventId &&
												item.LineId == items.LineId &&
												item.Selections[Teamindex].SelectionId == items.SelectionId
											) {
												return true;
											}
										})
									: false;
							let resultd =
								OddsDownData != '' && taregtSelectionExists
									? OddsDownData.some(function(items) {
											if (
												CutEventitem.EventId === items.EventId &&
												item.LineId == items.LineId &&
												item.Selections[Teamindex].SelectionId == items.SelectionId
											) {
												return true;
											}
										})
									: false;
							/* 高亮 */
							let MoreStatus = PlayBetCart && PlayBetCart != 'false';
							let CheckSelect =
								MoreStatus && taregtSelectionExists
									? BetCartdata.filter((i) => i.SelectionId == item.Selections[Teamindex].SelectionId)
									: [];
							return (
								<li className="table-cell-swiper" key={index}>
									<div className="list-set">
										{item.IsLocked ? (
											<div className="Game-indicators">
												<img src="/svg/betting/Locked.svg" className="Locked" />
											</div>
										) : (
											<div
												className={
													CheckSelect != '' ? 'Game-indicators active' : 'Game-indicators'
												}
												onClick={() => {
													if (!localStorage.getItem('loginStatus') == 1) {
														Router.push('/login');
														return;
													}
													if (!taregtSelectionExists) {
														return;
													}
													if (!MoreStatus) {
														this.props.PushBetCart(item.Selections[Teamindex], 1);
													} else if (!BetSelectionCount) {
														let indexOf = BetCartdata.findIndex((v) => {
															return (
																v.SelectionId == item.Selections[Teamindex].SelectionId
															);
														});
														if (indexOf == '-1') {
															this.props.PushBetCart(item.Selections[Teamindex], 2);
															Toasts.success('สำเร็จ');
														} else {
															this.props.RemoveBetCart(item.Selections[Teamindex], 2);
														}
													} else {
														if (BetSelectionCount) {
															Toasts.error('เดิมพันพาร์เลย์เท่านั้น' + BetSelectionCountlength + 'เพิ่มเกมอื่นได้');
														}
													}
												}}
											>
												<small>
													<span>
														{taregtSelectionExists ? (
															item.Selections[Teamindex].SelectionName
														) : (
															''
														)}
													</span>
													<span>
														{taregtSelectionExists ? (
															item.Selections[Teamindex].Handicap
														) : (
															''
														)}
													</span>
												</small>
												{result ? (
													<b className="red">
														<span
															dangerouslySetInnerHTML={{
																__html: ChangeSvg(
																	item.Selections[Teamindex].DisplayOdds
																)
															}}
															className="NumberBet"
														/>
														<img
															src="/svg/betting/round-up.svg"
															className="Betting-up-svg"
														/>
													</b>
												) : resultd ? (
													<b className="green">
														<span
															dangerouslySetInnerHTML={{
																__html: ChangeSvg(
																	item.Selections[Teamindex].DisplayOdds
																)
															}}
															className="NumberBet"
														/>
														<img src="/svg/betting/round-down.svg" />
													</b>
												) : (
													<b className="Number-black">
														{taregtSelectionExists ? (
															<div
																dangerouslySetInnerHTML={{
																	__html: ChangeSvg(
																		item.Selections[Teamindex].DisplayOdds
																	)
																}}
																className="NumberBet"
															/>
														) : (
															''
														)}
													</b>
												)}
											</div>
										)}
									</div>
								</li>
							);
						})
					) : (
						[ ...Array(2) ].map((i, k) => {
							return (
								<li className="table-cell-swiper" key={k}>
									<div className="list-set">
										<div className="Game-indicators">
											<b>-</b>
										</div>
									</div>
								</li>
							);
						})
					)}
				</ul>
			);
		});
	}
}

/* 默认初始化 防止空白 */
const defaultnull = (
	<ul className="NullList">
		<li className="bgw">เต็มเวลาแฮนดิแคป</li>
		<li className="bgw">เต็มเวลา สูงต่ำ</li>
		{[ ...Array(4) ].map((item, index) => {
			return <li key={index}>-</li>;
		})}
	</ul>
);
