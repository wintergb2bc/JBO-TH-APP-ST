


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
const { width, height } = Dimensions.get("window");
import React from "react";

class SportImage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() { }

    componentWillUnmount() { }

    render() {
        // https://simg.leyouxi211.com/bti-icon/CompetitionImageFile/41090.png
        // https://simg.leyouxi211.com/im-icon/CompetitionImageFile/230.png


        let lowerImg = lowerV == 'BTI' ? '/bti-icon' : '/im-icon'
        let LeagueTeam = this.props.LeagueIcon ? '/CompetitionImageFile/': '/TeamImageFile/'
        let urls = SportImageUrl + lowerImg + LeagueTeam + this.props.imgsID + '.png'
        let defaultImg = lowerV == 'BTI' ? require('../../images/betting/fun88.png') : require('../../images/betting/IM.png')
        return (
            <Image defaultSource={defaultImg} resizeMode='stretch' source={{ uri: urls }} style={{ width: 23, height: 23 }} />
            // <View style={{width: 23, height: 23, borderRadius: 23/2, backgroundColor: '#CCCCCC'}} />
        )
    }
}

export default SportImage

const styles = StyleSheet.create({
})
