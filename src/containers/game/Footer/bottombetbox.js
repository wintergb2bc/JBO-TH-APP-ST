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
import Modal from 'react-native-modal';
const { width, height } = Dimensions.get("window");
import React from "react";
import Keyboard from './Keyboard';
import { Actions } from "react-native-router-flux";
export default class _Bottombetbox extends React.Component {
	state = {
		winHeight: height,
		winWidth: width,
		isBottomSheetVisible: false,
		active: 0,
		Toasts: '',
		ToastsMsg: '1',
		Betdata: '',
		BetType: 1 /* 1 默认 2 串关 3 系统串关 */
	};

	/* 打开投注窗 */
	ShowBottomSheet = (type) => {
		console.log(type);
		this.setState({ isBottomSheetVisible: true, BetType: type });
		// setTimeout(() => {
		// 	/* 防止ipone失效 */
		// 	document.getElementsByTagName('html')[0].style.position = 'fixed';
		// 	document.body.style.overflowY = 'hidden';
		// }, 50);
	};

	/* 关闭投注窗  */
	CloseBottomSheet = (EuroCupBet) => {
		this.setState({ isBottomSheetVisible: false });
		// setTimeout(() => {
		// 	document.getElementsByTagName('html')[0].style.position = 'unset';
		// 	document.body.style.overflowY = 'auto';
		// }, 50);
		if (EuroCupBet) {
			Actions.pop()
		}
	};

	/* 打开串关模式 */
	BetCartmore = () => {
		UMonEvent('EngagementEvent_View_AddBetCartEUROPage')
		this.props.PlayBetCartmore();
	};

	/* 删除购物车 */
	RemoveBetCart = (data, type) => {
		this.props.RemoveBetCart(data, type);
	};

	/* 数据检查 */
	CheckBetting = (data) => {
		if (this.state.isBottomSheetVisible) {
			// this.refs.CheckBetting.CheckBetting(data);
			window.CheckBettings && window.CheckBettings(data)
		}
	};

	/* 点击注单类型 */
	ClickTabmenu = (type) => {
		// this.refs.CheckBetting.ClickTabmenu(type);
		window.CheckBettings && window.CheckBettings(type)
	};



	render() {
		window.KeyBoardToast = (Toasts, ToastsMsg) => {
			//组件Toast在modal下面处理
			this.setState({ Toasts, ToastsMsg })
			setTimeout(() => {
				this.setState({
					Toasts: '',
					ToastsMsg: '',
				})
			}, 3000);
		}
		/* 会员投注选择的盘口数据 */
		const { isBottomSheetVisible, BetType, winWidth, winHeight, Toasts, ToastsMsg } = this.state;
		const { isLandscape, detailWidth, detailHeight } = this.props;
		const { BetCartdata } = this.props;
		// let width = detailWidth? detailWidth: winWidth
		let height = detailHeight ? detailHeight : winHeight
		console.log('ToastsToasts', Toasts)
		return (
			<View>
				{
					isBottomSheetVisible &&
					<Modal
						isVisible={isBottomSheetVisible}
						swipeDirection={'down'}
						onSwipeComplete={() => this.CloseBottomSheet()}
						propagateSwipe={true}
						animationIn={'bounceInUp'}
						backdropColor={'#000'}
						backdropOpacity={0.4}
						style={{ justifyContent: 'flex-end', margin: 0, }}
						onBackdropPress={() => this.CloseBottomSheet()}
					>
						<View style={isLandscape ? [styles.boxViewisLandscape, { width: width, height: height, right: 0 }] : styles.boxView}>
							<View style={[styles.toastView, { width: width, top: isLandscape ? 15 : -25 }]}>
								{
									Toasts == 'fail' &&
									<View style={styles.toastErr}>
										<Image resizeMode='stretch' source={require('../../../images/Error.png')} style={{ width: 18, height: 18 }} />
										<Text style={{ color: '#eb2121', textAlign: 'center', paddingLeft: 8 }}>{ToastsMsg}</Text>
									</View>
								}
								{
									Toasts == 'success' &&
									<View style={styles.toastSuccess}>
										<Image resizeMode='stretch' source={require('../../../images/icon-done.png')} style={{ width: 18, height: 18 }} />
										<Text style={{ color: '#34c759', textAlign: 'center', paddingLeft: 8 }}>{ToastsMsg}</Text>
									</View>
								}
							</View>
							<Keyboard
								EuroCupBetDetail={this.props.EuroCupBetDetail || false}
								EuroCupBet={this.props.EuroCupBet || false}
								/* 传递 */
								ref="CheckBetting"
								/* 厂商数据回调模块 */
								Vendor={this.props.Vendor}
								/* 购物车数据 */
								Betdata={BetCartdata}
								/* 投注类型 */
								BetType={BetType}
								/* 详情页 布尔 */
								DetailPage={this.props.DetailPage}
								URL={this.props.Vendor.configs.VendorPage}
								/* 关闭弹窗 */
								CloseBottomSheet={(type) => {
									this.CloseBottomSheet(type);
								}}
								/* 打开串关模式 */
								BetCartmore={() => this.BetCartmore()}
								/* 删除购物车 */
								RemoveBetCart={(e, t, c) => {
									this.props.RemoveBetCart(e, t, c);
								}}
								/* 关闭串关 */
								PlayCloseBetCartmore={() => {
									this.props.PlayCloseBetCartmore();
								}}
								isLandscape={isLandscape}
								detailWidth={width}
								detailHeight={height}
							/>
						</View>
					</Modal>
				}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	boxViewisLandscape: {
		backgroundColor: '#fff',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		zIndex: 9,
	},
	boxView: {
		height: height * 0.9,
		backgroundColor: '#fff',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: width,
	},
	toastView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		zIndex: 99,
		left: 0,
	},
	toastErr: {
		backgroundColor: '#ffdada',
		padding: 8,
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	toastSuccess: {
		backgroundColor: '#daffe3',
		padding: 8,
		borderRadius: 5,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
});
