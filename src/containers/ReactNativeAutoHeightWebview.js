import React, { Component } from 'react';
import {
  View,
  Dimensions,
  WebView,
  Platform,
} from 'react-native';

const injectedScript = function() {
  function waitForBridge() {
    if (window.postMessage.length !== 1){
      setTimeout(waitForBridge, 200);
    }
    else {
      postMessage(
        Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight)
      )
    }
  }
  waitForBridge();
};

export default class ReactNativeAutoHeightWebview extends Component {
  state = {
    webViewHeight: Number
  };

  static defaultProps = {
      autoHeight: true,
  }

  constructor (props: Object) {
    super(props);
    this.state = {
      webViewHeight: this.props.defaultHeight
    }

    this._onMessage = this._onMessage.bind(this);
  }

  _onMessage(e) {
    this.setState({
      webViewHeight: parseInt(e.nativeEvent.data)
    });
  }

  stopLoading() {
    this.webview.stopLoading();
  }

  reload() {
    this.webview.reload();
  }

  render () {
    const _w = this.props.width || Dimensions.get('window').width;
    const _h = this.props.autoHeight ? this.state.webViewHeight : this.props.defaultHeight;
    const androidScript = `document.body.style.background = '#171717';document.head.innerHTML='<meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">';window.postMessage = String(Object.hasOwnProperty).replace(\'hasOwnProperty\', \'postMessage\');` +
    '(' + String(injectedScript) + ')();';
    const iosScript = '(' + String(injectedScript) + ')();' + `window.postMessage = String(Object.hasOwnProperty).replace(\'hasOwnProperty\', \'postMessage\');document.body.style.background = '#171717';document.head.innerHTML='<meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">'`;
    return (
      <WebView
        mediaPlaybackRequiresUserAction={false}
        ref={(ref) => { this.webview = ref; }}
        injectedJavaScript={Platform.OS === 'ios' ? iosScript : androidScript}
        scrollEnabled={this.props.scrollEnabled || false}
        onMessage={this._onMessage}
        javaScriptEnabled={true}
        automaticallyAdjustContentInsets={true}
        {...this.props}
        style={[{width: _w}, this.props.style, {height: _h}]}
      />
    )
  }
}
