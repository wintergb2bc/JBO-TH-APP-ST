/* 串关购物车浮窗 */
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
import { Toast } from 'antd-mobile-rn';
import Touch from "react-native-touch-once";
const { width, height } = Dimensions.get("window");
import React from "react";

export default class _BetCartPopup extends React.Component {
	state = {
		// BetCartdata: this.props.BetCartdata ||  [],
		// PlayBetCart: this.props.PlayBetCart || false
	};
	render() {

		const { BetCartdata, PlayBetCart } = this.props;
		console.log('this.BettingRef111111',BetCartdata)
		return (
			<View>
				{
					global.localStorage.getItem('loginStatus') == 1 && BetCartdata && BetCartdata.length > 0 &&
					<Touch
						onPress={() => {
							if (PlayBetCart == true && BetCartdata.length < 2) {
								Toasts.fail('โปรดเลือกอย่างน้อย 2');
								return;
							}
							this.props.ShowBottomSheet(PlayBetCart == true ? 2 : 1);
						}}
						style={styles.iconView}
					>
						<Image resizeMode='stretch' source={require('../../../images/Group.png')} style={{ width: 25, height: 25 }} />
						<View style={styles.numIcon}>

							<Text style={{ color: '#fff' }}>{BetCartdata.length}</Text>
						</View>
					</Touch>
				}
			</View>
		);
	}
}


const styles = StyleSheet.create({
	iconView: {
		backgroundColor: '#00B324',
		height: 55,
		width: 55,
		borderRadius: 130,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	numIcon: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: -8,
		right: -2,
		backgroundColor: '#D20F26',
		width: 25,
		height: 25,
		borderRadius: 30
	}
});
