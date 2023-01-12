/* 展示 角球 總數  */

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
const { width, height } = Dimensions.get("window");
import { dataIsEqual } from '../../../../lib/js/util';
import React from "react";

class CornerCount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['HasCornerData', 'HomeCorner', 'AwayCorner'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
	    return !dataIsEqual(this.props.EventData, nextProps.EventData, this.MonitorProps);
	}

	render() {
		const { EventData } = this.props;

		return EventData && EventData.HasCornerData ? (
			<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingLeft: 13 }}>
				<Image resizeMode='stretch' source={require('../../../../../images/jiao.png')} style={{ width: 13, height: 13 }} />
				<Text style={{ fontSize: 12, color: '#bcbec3' }}>
					{EventData.HomeCorner}-{EventData.AwayCorner}
				</Text>
			</View>
		) : null
	}
}

export default CornerCount
