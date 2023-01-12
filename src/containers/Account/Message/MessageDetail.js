import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  WebView,
  ScrollView,
  Platform
} from "react-native";
import moment from "moment";
const { width, height } = Dimensions.get("window");
import WebViewIOS from "react-native-webview";
import HTMLView from "react-native-htmlview";
export default class MessageDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.navigation.setParams({
     // title: this.props.messageIndex == 0 ? "消息详情" : "公告详情"
     title: this.props.messageIndex == 0 ? "รายละเอียดข้อความ" : "แจ้งรายละเอียด"
    });
  }
  render() {
    const { news } = this.props;
    return (
      <View style={[styles.viewContainer]}>
        {Platform.OS === "ios" && (
          <View style={styles.newsTopWrap}>
            <Text style={[styles.newstTopic]}>{news.title}</Text>
          </View>
        )}
        {console.log('news.content',news.content)}
        {Platform.OS === "ios" ? (
          <WebViewIOS
            mediaPlaybackRequiresUserAction={false}
            source={{
              html: `
                            <html lang="zh-cn">
                        <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
                        </head>
                        <body style="padding:0;margin: 0; background: #000;">
                        <div style="width: 100%;color: #fff">${
                          news.content
                        }</div>
                        <div style="margin-top: 100px;">
        <p style="color: #ccc; text-align: right; margin-right: 30px;font-size: .9rem; margin: 0;margin-bottom: 12;"> ทีมงาน JBO</p>
        <p style="color: #ccc; text-align: right; margin-right: 30px;font-size: .9rem;margin: 0 0 50px 0; ">${moment(
          (news.sendDate + "").replace(/[a-zA-Z]/g, " ")
        ).format("YYYY/MM/DD hh:mm")}</p>
    </div>
    <style>
    a {
        color: #00B324!important;
        text-decoration: underline!important;
    }
    td {
          color:#fff;
        }
</style>
                        </body>
                        </html>
                `
            }}
            style={{
              flex: 1,
              width: width - 30,
              marginHorizontal: 15,
              height,
              backgroundColor: "#000000"
            }}
          />
        ) : (
          <View style={{ height: 600 }}>
            <WebView
              mediaPlaybackRequiresUserAction={false}
              source={{
                html: `
                                <html lang="zh-cn">
                            <head>
                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,minimum-scale=1.0,user-scalable=0" />
                            </head>
                            <body style="padding:0;margin: 0; background: #000;">
                            <div style="width:100%;padding:15;text-align: center;">
                            <p style="color:#FFFFFF;">${news.title}</p>
                          </div>
                            <div style="width: 100%;color: #fff">${
                              news.content
                            }</div>
                            <div style="margin-top: 100px;">
            <p style="color: #ccc; text-align: right; margin-right: 30px;font-size: .9rem; margin: 0;">ทีมงาน JBO</p>
            <p style="color: #ccc; text-align: right; margin-right: 30px;font-size: .9rem;margin: 0 0 50px 0; ">${moment(
              (news.sendDate + "").replace(/[a-zA-Z]/g, " ")
            ).format("YYYY/MM/DD hh:mm")}</p>
        </div>
        <style>
        a {
            color: #00B324!important;
            text-decoration: underline!important;
        }
        td {
          color:#fff;
        }
    </style>
                            </body>
                            </html>
                    `
              }}
              style={{
                flex: 1,
                width: width - 30,
                marginHorizontal: 15,
                height: 500,
                backgroundColor: "#000000"
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: "#000000"
  },
  newsTopWrap: {
    paddingVertical: 15,
    alignItems: "center",
    height: 80
  },
  newstTopic: {
    //fontWeight: "bold",
    flexWrap: "wrap",
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 15
  },
  webViewSource: {
    width: width - 30,
    marginHorizontal: 15
  }
});

const styleHtmlMsg = StyleSheet.create({
  div: {
    color: "#fff"
  },
  p: {
    color: "#fff"
  },
  span: {
    color: "#fff"
  },
  i: {
    color: "#fff"
  },
  h1: {
    color: "#fff"
  },
  h2: {
    color: "#fff"
  },
  html: {
    color: "#fff"
  },
  body: {
    color: "#fff"
  }
});
