/* 展示 賠率框前面的 玩法選項說明  */

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
import { dataIsEqual } from '../../../../../lib/js/util';
const { width, height } = Dimensions.get("window");
import React from "react";

class SelectionDesc extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}

		//指定要監控變化的prop
		this.MonitorProps = ['SelectionName', 'Handicap'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
		return !dataIsEqual(this.props.SelectionData, nextProps.SelectionData, this.MonitorProps);
	}

	render() {
		const { SelectionData } = this.props;

		return SelectionData ? (
			<View style={{display: 'flex', flexDirection: 'row'}}>
				<View>
					{/*<Text style={{color: '#999999', fontSize: 12}}>{SelectionData.SelectionName}</Text>*/}
					<Text style={{color: '#999999', fontSize: 9, textAlign: 'center',marginRight: 2}}>
						{SelectionData.SelectionName.split(' ')[0]}
					</Text>
					{
						SelectionData.SelectionName.split(' ')[1] && SelectionData.SelectionName.split(' ')[1] != '' &&
						<Text style={{color: '#999999', fontSize: 9, textAlign: 'center',marginRight: 2}}>
							{SelectionData.SelectionName.split(' ')[1]}
						</Text>
					}
				</View>
				<Text style={{color: '#999999', fontSize: 12}}>{SelectionData.Handicap}</Text>
			</View>
		) : (
				<View>
					<Text />
					<Text />
				</View>
			)
	}
}

export default SelectionDesc
