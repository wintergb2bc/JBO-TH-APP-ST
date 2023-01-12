/* 展示 一個賠率框=投注選項(Selection) 包含處理投注線鎖定狀態  */


import { dataIsEqual } from '../../../../../lib/js/util';

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
import SelectionDesc from "./SelectionDesc";
import DisplayOdds from "./DisplayOdds";
const { width, height } = Dimensions.get("window");
import React from "react";

class OddsCell extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}

		//指定要監控變化的prop
		this.MonitorProps = ['LineIsLocked', 'PlayBetCart', 'BetCartdata'];
		//有使用的component: SelectionDesc 和 DisplayOdds，裡面有用到的字段，也要監控
		this.MonitorPropsOfSelectionData = ['EventId', 'LineId', 'SelectionId', 'SelectionName', 'Handicap', 'DisplayOdds'];
	}

	componentDidMount() {
	}

	componentWillUnmount() {
	}

	isOddsUpOrDown = (SelectionData, list) => {
		if (SelectionData && list) {
			const thisKey = SelectionData.EventId + '|||' + SelectionData.LineId + '|||' + SelectionData.SelectionId;
			return (list.Selections[thisKey] === true);
		}
		return false;
	}

	//優化效能：只有指定的prop變化時才要重新渲染
	shouldComponentUpdate(nextProps, nextState) {
	  //特別處理 賠率變化，直接判斷
	  return !dataIsEqual(this.props.SelectionData, nextProps.SelectionData, this.MonitorPropsOfSelectionData)
	  || !dataIsEqual(this.props,nextProps,this.MonitorProps)
	  || this.isOddsUpOrDown(this.props.SelectionData, this.props.OddsUpData) !== this.isOddsUpOrDown(nextProps.SelectionData, nextProps.OddsUpData)
	  || this.isOddsUpOrDown(this.props.SelectionData, this.props.OddsDownData) !== this.isOddsUpOrDown(nextProps.SelectionData, nextProps.OddsDownData)
	}

	render() {
		const { SelectionData, LineIsLocked, OddsUpData, OddsDownData, ClickOdds, PlayBetCart, BetCartdata } = this.props;

		//console.log('=====Odds rendered', SelectionData ? SelectionData.EventId + '|||' + SelectionData.LineId + '|||' + SelectionData.SelectionId : 'NULL selection');

		let isOddsUp = this.isOddsUpOrDown(SelectionData, OddsUpData);
		let isOddsDown = this.isOddsUpOrDown(SelectionData, OddsDownData);

		const UpOrDown = (
			(isOddsUp === true)
				? 'UP'
				: ((isOddsDown === true) ? 'DOWN' : '')
		);
		/* 高亮 */
		let MoreStatus = PlayBetCart && PlayBetCart != 'false';
		let CheckSelect =
			MoreStatus && SelectionData
				? BetCartdata.filter((i) => i.SelectionId == SelectionData.SelectionId)
				: [];
		return (
			<View>
				<View>
					{LineIsLocked ? (
						<View style={styles.noactive}>
							<Image resizeMode='stretch' source={require('../../../../../../images/betting/Locked.png')} style={{ width: 20, height: 20 }} />
						</View>
					) : (
							<Touch
								// className={
								// 	CheckSelect != '' ? 'Game-indicators active' : 'Game-indicators'
								// }
								style={CheckSelect != '' ? styles.active : styles.noactive}
								onPress={() => {
									ClickOdds(SelectionData);
								}}
							>
								{/* 玩法選項 說明 */}
								<SelectionDesc SelectionData={SelectionData} />
								{/* 賠率 包含上下變化 */}
								<DisplayOdds SelectionData={SelectionData} UpOrDown={UpOrDown} />
							</Touch>
						)}
				</View>
			</View>
		);
	}
}

export default OddsCell

const styles = StyleSheet.create({
	active: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#00FF331A',	
		borderRadius: 5,
		height: 42,
		marginBottom: 5,
		borderColor: '#00B324',
		borderWidth: 1,
	},
	noactive: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#3E3E3E',
		borderRadius: 5,
		height: 42,
		marginBottom: 5,
	},
});
