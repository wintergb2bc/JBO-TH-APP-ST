import React from "react";
import {
  StyleSheet,
  Text,
  Linking,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  Animated
} from "react-native";
import { Actions } from "react-native-router-flux";
 const { width, height } = Dimensions.get("window");
 import ModalDropdown from "react-native-modal-dropdown";
 import * as Animatable from 'react-native-animatable'

 const slotSort = [
  {
    title: "ทั้งหมด", // 所有游戏
    categoryID: "",
    imgUrl: require("./../images/slot/slotType1.png")
  },
  {
    title: "ล่าสุด", // 近期游戏
    categoryID: "recentGames",
    imgUrl: require("./../images/slot/slotType2.png")
  },
  {
    title: "เกมฮิต", // 热门游戏
    categoryID: 0,
    imgUrl: require("./../images/slot/slotType3.png")
  },
  {
    title: "เกมใหม่", // 新游戏
    categoryID: 53,
    imgUrl: require("./../images/slot/slotType4.png")
  },
];
 const gameData = [
   {
     title: "ทั้งหมด", 
     id: "ALL",
     imageSrc: require('../images/slot/ALL-Gray.png'),
     imageActiveSrc: require('../images/slot/ALL.png'),
   },
   {
     title: "คิงโป๊กเกอร์​​",
     id: "KPK",
     imageSrc: require('../images/slot/KPK-Gray.png'),
     imageActiveSrc: require('../images/slot/KPK-Green.png')
   },
   {
    title: "คิงเมคเกอร์",
    id: "TGP",
    imageSrc: require('../images/slot/P2P-Gray.png'),
    imageActiveSrc: require('../images/slot/P2P-Green.png')
    },
   
 ];
import { Tabs, Toast, Flex, Modal } from "antd-mobile-rn";
 import TabStyle from "antd-mobile-rn/lib/tabs/style/index.native";

 const newStyle = {};
 for (const key in TabStyle) {
   if (Object.prototype.hasOwnProperty.call(TabStyle, key)) {
     // StyleSheet.flatten返回的obj描述中的configurable、writable为false，所以这里要展开赋值
       newStyle[key] = { ...StyleSheet.flatten(TabStyle[key]['topTabBarSplitLine']) };
   }
 }

let GameDB;
class P2PGameList extends React.Component {
  constructor(props) {
    super(props);
    this.PlayGame = this.PlayGame.bind(this);

    this.state = {
      Button1: "",
      DataNumber: 10,
      dEnumber: 0,
      type: this.props.data, //遊戲類型
      Gametitle: "",
      Gameimage: "",
      GameData: "",
      refreshing: false,
      isLoreMoreing: "LoreMoreing",
      dataSource: [],
      dataBox: [],
      GameLest: "All",
      PopularDB: "",
      NewDB: "",
      JackpotDB: "",
      userPlayDB: "",
      APopularDB: "",
      userPlayDBx: "",
      ANewDB: "",
      AJackpotDB: "",
      Nowtype: "All",
      gametype: this.props.data,
      JBRGamdDB: "",
      IMOGamdDB: "",

      currentSlotKey: 0,
      categoryID: "",
      searchInputText: "",
      selectSlotData: [],
      storageSlotData: "",
      fadeAnim: new Animated.Value(0),
      transfromAnim: new Animated.Value(40),
      inputBorderStatus: "Blur",
      searchInputTextLower: "",
      modalDropdownFlag: false,
      gmaeIndex: 0,
      OpenGamemodal: false,
      GameOpenUrl: '',
    };

    this.responseData = [];
  }

  componentWillMount(props) {
    GameDB = [
      { title: "ทั้งหมด", id: "" },
      { title: "ล่าสุด", id: "recentGames" },
      { title: "เกมฮิต", id: 0 },
      { title: "เกมใหม่", id: 53 },
    ];
    reloadOrientation();
    let gametype = this.props.data;

    if (gametype == "KPK" || gametype == 'TGP') {
      gametype = "mobilep2p";
    } 
  

    global.storage
      .load({
        key: "GameDatd" + gametype,
        id: gametype
      })
      .then(data => {
        console.log(data,'GameData')
        this.setState(
          {
            GameData: data
          },
          () => {
            this.getStorageSlotData();
          }
        );

        this.Refresh(data);

        //console.log('1.有存款緩存')

        this.LoadGame();
        this.GetGameList(this.props.data)
      })
      .catch(() => {
        console.log("2.沒有存款緩存");
        this.GetGameList(this.props.data);
      });
  }

  _onOrientationChange() {
    //console.log('111111')
  }

  componentWillUnmount() {
    //離開註銷監聽
  }

  //跳轉
  navigateToScene(key, GameOpenUrl) {
    const {gametype} = this.state;
    NowGameTitle = gameData.filter(v=>gametype===v.id)[0].title || '';
    Actions.SlotGamePage({ GameOpenUrl: GameOpenUrl, gametype: gametype });
    // if(gametype == "SPG"){
    //   Actions.SGPGamePage({ GameOpenUrl: GameOpenUrl, gametype: gametype });
    // } else {
    //   Actions.SlotGamePage({ GameOpenUrl: GameOpenUrl, gametype: gametype });
    // }
  }



  //请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
  GetGameList(gametype) {
    if (isGameLock == true) {
      Toast.fail(
        "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
        2
      );
      // Toast.fail("尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服" , 2);
      return;
    }
    gametype = "mobilep2p";


    Toast.loading("เริ่มล็อบบี้เกม...", 200);
    // Toast.loading('数据加载中,请稍候...',200);
    fetchRequest(
      ApiPort.Game + "?gametype=" + gametype + "&vendorPlatform=mobile&",
      "GET"
    )
      .then(data => {
        Toast.hide();

        this.setState(
          {
            GameData: data
          },
          () => {
            this.getStorageSlotData();
          }
        );

        global.storage.save({
          key: "GameDatd" + gametype, // 注意:请不要在key中使用_下划线符号!
          id: gametype, // 注意:请不要在id中使用_下划线符号!
          data: data,
          expires: null
        });

        this.Refresh(data);

        this.LoadGame();
      })
      .catch(() => {
        Toast.hide();
      });
  }

  //请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
  PlayGame(gameid, gametype, img, item) {
    console.log('gameid '+gameid, 'gametype '+gametype)
    if (isGameLock == true) {
      Toast.fail(
        "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
        2
      );
      // Toast.fail("游戏访问限制" , 2);
      return;
    }
    //console.log(gametype)
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 2);
      Actions.logins();
      // Toast.fail("请先登录" , 1);
      return;
    }

    if (this.state.currentSlotKey * 1 !== 1) {
      this.saveStorageSlotData(gameid, item);
    }

    let data = {
      hostName: common_url,
      productCode: gametype,
      platform: "mobile",
      mobileLobbyUrl:
        gametype != "PGS"
          ? common_url
          : "https://public.pgcool.com/pages/close.html",
      sportsMenu: common_url,
      bankingUrl: common_url,
      logoutUrl: common_url,
      supportUrl: common_url
    };

    if(this.state.gametype == "TGP"){
      UMonEvent("Game", "Launch", `${item.gameName}__KingMaker`);   //Piwki 追蹤 加薪遊戲 記得添加 
    }else{
      UMonEvent("Game", "Launch", `${item.gameName}_KingPoker`);   //Piwki 追蹤 加薪遊戲 記得添加
    } 
    Toast.loading("เริ่มล็อบบี้เกม...", 200);
    // Toast.loading('正在启动游戏,请稍候...',200);
    fetchRequest(ApiPort.Game + gameid + "?isDemo=false&", "POST", data)
      .then(data => {
        Toast.hide();

        // let BlegameReH= false; // 橫屏遊戲刪除頭部 , 特殊側邊菜單 benji
        // if(this.state.BLERemoveHead.indexOf(gameName) != -1 || gametype == 'P2P' || gametype == 'KPK'){
        //   BlegameReH =true;
        // } 
       
        var Type = true;
        if (Type == true) {
          let playData = {
            type: "Slot",
            gameid: gameid,
            gametype: gametype,
            img: img
          };
          Gameplay.unshift(playData);
          if (Gameplay.length > 3) {
            Gameplay.length = 3;
          }
          storage.save({
            key: "GameplayHome", // 注意:请不要在key中使用_下划线符号!
            id: "GameplayHome", //  注意:请不要在id中使用_下划线符号!
            data: Gameplay,
            expires: 1000 * 1600 * 24 * 30
          });
        }

        // ReLoadGame();
        if (data.errorCode == 2001) {
          Toast.fail(
            "เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า",
            2
          );
          //   Toast.fail("尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服", 2);
          return;
        }
        if (data.errorCode == 0) {
          console.log('tgp1111111111')
          if (data.isMaintenance == true) {
            Toast.fail(
              "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
              //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
              2
            );
            // Toast.fail('亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。' , 2);
            return;
          }

          //Actions.GamePage({ GameOpenUrl: data.gameUrl, gametype });
          // if (gametype === "TGP" || gametype === "KPK") {
          //   console.log('tgp!!!')
          //   this.setState({
          //     GameOpenUrl: data.gameUrl,
          //     OpenGamemodal: true
          //   })
          //   return;
          // }
          //  //原本没有传gametype,新增部分棋牌判断高度
          // let gametypes = '';
          // console.log(BlegameReH,'111')
          // if(BlegameReH == true){ //橫屏遊戲刪除頭部 , 特殊側邊菜單 benji
          //   this.navigateToScene("JBPGamePage", data.gameUrl, gametypes,BlegameReH);
          //   return;
          // } 
          this.navigateToScene("GamePage", data.gameUrl);
          
          
        } else {
          Toast.fail(
            "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
            //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
            2
          );
        }
      })
      .catch(() => {
        Toast.hide();
      });
  }

  Refresh = data => {
    //
    this.setState({
      refreshing: true
    });

    //默认选中第二个
    this.responseData = data.slice(this.state.dEnumber, this.state.DataNumber);
    this.setState({
      refreshing: false,
      dataSource: this.responseData,
      dataBox: this.responseData,
      dEnumber: this.state.dEnumber + 10,
      DataNumber: this.state.DataNumber + 10
    });
    this.isLoreMore = false;
  };

  isLoreMore = false;

  LoreMore = () => {
    let Datalength = this.state.GameData.length;
    if (this.isLoreMore == false) {
      this.setState({
        isLoreMoreing: "LoreMoreing"
      });
      if (this.responseData.length >= Datalength) {
        this.responseData = this.responseData.concat(
          this.state.GameData.slice(Datalength, Datalength)
        );
      } else {
        this.responseData = this.responseData.concat(
          this.state.GameData.slice(this.state.dEnumber, this.state.DataNumber)
        );
      }

      this.setState({
        dataSource: this.responseData,
        isLoreMoreing:
          this.responseData.length >= Datalength
            ? "LoreMoreEmpty"
            : "LoreMoreing",
        dEnumber:
          this.state.dEnumber >= Datalength
            ? Datalength
            : this.state.dEnumber + 10,
        DataNumber:
          this.state.DataNumber >= Datalength
            ? Datalength
            : this.state.DataNumber + 10
      });
    }
  };

  PopularDBLoreMore = () => {
    let Datalength = this.state.APopularDB.length;
    if (this.isLoreMore == false) {
      this.setState({
        isLoreMoreing: "LoreMoreing"
      });
      if (this.responseData.length >= Datalength) {
        this.responseData = this.responseData.concat(
          this.state.APopularDB.slice(Datalength, Datalength)
        );
      } else {
        this.responseData = this.responseData.concat(
          this.state.APopularDB.slice(
            this.state.dEnumber,
            this.state.DataNumber
          )
        );
      }

      this.setState({
        PopularDB: this.responseData,
        isLoreMoreing:
          this.responseData.length >= Datalength
            ? "LoreMoreEmpty"
            : "LoreMoreing",
        dEnumber:
          this.state.dEnumber >= Datalength
            ? Datalength
            : this.state.dEnumber + 10,
        DataNumber:
          this.state.DataNumber >= Datalength
            ? Datalength
            : this.state.DataNumber + 10
      });
    }
  };

  //彈
  openDomin(url) {
    Linking.openURL(url);
  }

  onTabClick = key => {
    //tabs切換
    let item = key.title;
    let id;
    this.setState({ categoryID: key.id }, () => this.getStorageSlotData());
    // if (item == "Tất cả") {
    //   id = "";
    // } else if (item == "Vừa chơi") {
    //   id = 0;
    // } else if (item == "最新") {
    // } else if (item == "奖池") {
    // } else if (item == "Vừa chơi") {
    // this.getStorageSlotData();
    //}
  };
  onGameTabClick = i => {
    let gameId = gameData[i].id
    if (gameId == "YDS") {
      UMonEvent("Slot_category_YG");
    } if (gameId == "PGS") {
      UMonEvent("PGSlot");
    }else {
      UMonEvent("Slot_category_SG");
    }
    this.setState({ gametype: gameId }, () => this.getStorageSlotData());
    
    let index = slotSort.findIndex( v => v.categoryID === this.state.categoryID)
    switch (index+1) {
      case 1:
        this._flatList1 && this._flatList1.scrollToOffset({ animated: true, offset: 0 });
        break;
      case 2:
        this._flatList2 && this._flatList2.scrollToOffset({ animated: true, offset: 0 });
        break;
      case 3:
        this._flatList3 && this._flatList3.scrollToOffset({ animated: true, offset: 0 });
        break;
      case 4:
        this._flatList4 && this._flatList4.scrollToOffset({ animated: true, offset: 0 });
        break;
      case 5:
        this._flatList5 && this._flatList5.scrollToOffset({ animated: true, offset: 0 });
        break;
      default:
        this._flatList1 && this._flatList1.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  LoadGame() {
    const { GameData } = this.state;
    let PopularDBx = [];
    let NewDBx = [];
    let JackpotDBx = [];
    let userPlayDBx = [];
    let JBRGamdDB = [];
    let IMOGamdDB = [];
    //console.log(GameData)

    function UnIsLive(item) {
      for (let i = 0; i <= item.categories.length - 1; i++) {
        if (
          item.categories[i].categoryName == "IsLive" ||
          item.categories[i].categoryName == "IsSoftLaunch"
        ) {
          return true;
        }
      }
    }
    // if (this.props.data == "YDS") {
    GameData.filter(UnIsLive).map(function(item, index) {
      for (var j = 0; j < item.categories.length; j++) {
        if (item.categories[j].categoryID == 0) {
          PopularDBx.push(GameData[index]);
        }

        if (item.categories[j].categoryID == 53) {
          NewDBx.push(GameData[index]);
        }

        if (item.categories[j].categoryID == 55) {
          JackpotDBx.push(GameData[index]);
        }

        if (item.categories[j].categoryID == "recentGames") {
          userPlayDBx.push(GameData[index]);
        }
      }
    });

    this.setState({
      APopularDB: PopularDBx,
      JBRGamdDB: JBRGamdDB,
      IMOGamdDB: IMOGamdDB,
      ANewDB: NewDBx,
      AJackpotDB: JackpotDBx,
      PopularDB: PopularDBx,
      NewDB: NewDBx,
      JackpotDB: JackpotDBx,
      userPlayDBx: userPlayDBx
    });
  }

  createSlotSort(item, key) {
    return (
      <View style={[styles.slotSortWrap, styles[`slotSortWrap${key}`]]}>
        <Image
          resizeMode="stretch"
          style={styles.slotImg}
          source={item.imgUrl}
        />
        <Text style={[styles[`slotTextColor${key}`], styles.slotText]}>
          {item.title}
        </Text>
      </View>
    );
  }

  createRenderRow(data) {
    const { selectSlotData } = this.state;
    let item = data.item;
    return (
      <TouchableOpacity
        onPress={() =>
          this.PlayGame(item.gameId, item.provider, item.imageUrl, item)
        }
        key={data.index}
        style={{
          marginBottom: selectSlotData.length - 1 === data.index ? 300 : 0
        }}
        key={data.index}
        style={{
          marginBottom: selectSlotData.length - 1 === data.index ? 300 : 0
        }}
      >
        <View style={styles.GameImg}>
          <Image
            resizeMode="stretch"
            source={{ uri: item.imageUrl }}
            defaultSource={require("../images/lazyload.png")}
            style={{
              borderRadius: 0,
              width: (width==390?375:width) * 0.417, //390會跑版
              height: (width==390?375:width) * 0.57,
              borderBottomLeftRadius: 0
            }}
          />
          <View style={styles.imgTextBox}>
            <View style={styles.nextBox}>
              <Text
                style={{ color: "#fff", fontSize: 13, textAlign: "center" }}
              >
                {item.gameName
                  ? item.gameName.length > 14
                    ? item.gameName.substr(0, 14) + ".."
                    : item.gameName
                  : ""}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  searchGame() {
    this.getSelectslotData();
  }

  changeInputText(searchInputText) {
    this.setState({
      searchInputText: searchInputText.trim(),
      searchInputTextLower: searchInputText.trim().toLowerCase()
    });
  }

  changeSlot(currentSlotKey) {
    if (currentSlotKey * 1 === 1) {
      this.getStorageSlotData();
    } else {
      this.setState(
        {
          storageSlotData: []
        },
        () => {
          this.getSelectslotData();
        }
      );
    }
    this.setState({
      currentSlotKey,
      categoryID: slotSort[currentSlotKey].categoryID
    });
  }

  getSelectslotData() {
    const {
      categoryID,
      GameData,
      storageSlotData,
      searchInputText,
      searchInputTextLower,
      gametype
    } = this.state;
    this.setState({
      fadeAnim: new Animated.Value(0),
      transfromAnim: new Animated.Value(40)
    });
    let YDSGameData;

    if(gametype){
      if(gametype === "ALL"){
        YDSGameData = GameData
      }else if(gametype === "KPK"){
        YDSGameData = GameData.filter(
          v =>
            v.provider.toLocaleUpperCase() === gametype &&
            Boolean(v.categories.find(v2 => v2.categoryName === "IsLive"))
        );
      }else if(gametype === "TGP"){
        YDSGameData = GameData.filter(
          v =>
            v.provider.toLocaleUpperCase() === gametype &&
            Boolean(v.categories.find(v2 => v2.categoryName === "IsLive"))
        );
        console.log('YDSGameData=======',YDSGameData)
      }
    } else {
      console.log('無gametype')
      YDSGameData = []
    }

    console.log(gametype)

    let selectSlotData = [];
    console.log(categoryID)
    console.log(searchInputText)
    if (categoryID === "") {
      if (searchInputText) {
        selectSlotData = YDSGameData.filter(v => {
          let nameLower = v.gameName && v.gameName.toLowerCase();
          let istrue = nameLower && nameLower.includes(searchInputTextLower);
          return istrue;
        });
        // selectSlotData =  YDSGameData.filter(v => v.gameName && v.gameName.includes(searchInputText))
      } else {
        selectSlotData = YDSGameData;
      }
    } else if (categoryID === "recentGames") {
      console.log(storageSlotData)
      if (searchInputText) {
        selectSlotData = storageSlotData.filter(v => {
          let nameLower = v.gameName && v.gameName.toLowerCase();
          let istrue = nameLower.includes(searchInputTextLower);
          return istrue;
        });
        // selectSlotData =  storageSlotData.filter(v => v.gameName && v.gameName.includes(searchInputText))
      } else {
        selectSlotData = storageSlotData.length > 0?storageSlotData.filter(v => v.provider === gametype):[];
      }
    } else {
      if (searchInputText) {
        console.log(YDSGameData)
        selectSlotData = YDSGameData.filter(v1 => {
          let temp = v1.categories.find(v2 => v2.categoryID === categoryID);
          let nameLower = v1.gameName && v1.gameName.toLowerCase();
          let istrue =
            Boolean(temp) && nameLower.includes(searchInputTextLower);
          return istrue;
          // return Boolean(temp) && (v1.gameName && v1.gameName.includes(searchInputText))
        });
      } else {
        selectSlotData = YDSGameData.filter(v1 => {
          let temp = v1.categories.find(v2 => v2.categoryID === categoryID);
          return Boolean(temp);
        });
      }
    }
    
    console.log(selectSlotData)
    this.setState(
      {
        selectSlotData
      },
      () => {
        this.runAnimate();
      }
    );
  }

  runAnimate() {
    Animated.timing(
      // 随时间变化而执行动画
      this.state.fadeAnim, // 动画中的变量值
      {
        toValue: 1, // 透明度最终变为1，即完全不透明
        duration: 1800 // 让动画持续一段时间
      }
    ).start();

    Animated.timing(
      // 随时间变化而执行动画
      this.state.transfromAnim, // 动画中的变量值
      {
        toValue: 0, // 透明度最终变为1，即完全不透明
        duration: 800 // 让动画持续一段时间
      }
    ).start();
  }

  getStorageSlotData() {
    console.log('getStorageSlotData')
    global.storage
      .load({
        key: "YDSDataGames",
        id: "YDSDataGames"
      })
      .then(res => {
        console.log(res)
        this.setState(
          {
            storageSlotData: res
          },
          () => {
            this.getSelectslotData();
          }
        );
      })
      .catch(err => {
        console.log(err)
        this.getSelectslotData();
      });
  }

  saveStorageSlotData(gameid, item) {
    global.storage
      .load({
        key: "YDSDataGames",
        id: "YDSDataGames"
      })
      .then(res => {
        let sameGameIndex = res.findIndex(v => v.gameId === gameid);
        if (sameGameIndex > -1) {
          res.splice(sameGameIndex, 1);
        }
        res.unshift(item);
        global.storage.save({
          key: "YDSDataGames",
          id: "YDSDataGames",
          data: res,
          expires: null
        });
      })
      .catch(err => {
        global.storage.save({
          key: "YDSDataGames",
          id: "YDSDataGames",
          data: [item],
          expires: null
        });
      });
  }

  changeInputBorder(flag) {
    this.setState({
      inputBorderStatus: flag
    });
  }

  getGameIDIndex = () => gameData.map(function(e) { return e.id; }).indexOf(this.state.gametype);

  changeModalDropdownFlag(flag) {
    this.setState({
      modalDropdownFlag: flag
    })
  }
  
  createSlotGameRow(item, index) {
    const isActive = index * 1 === this.getGameIDIndex();
    return <View style={styles.limitModalDropdownList}>
      {gameData[index].imageSrc && gameData[index].imageActiveSrc ? (
          <Image
              resizeMode="stretch"
              source={isActive?gameData[index].imageActiveSrc:gameData[index].imageSrc}
              style={{width: 24, height: 24, marginRight: 18}}
          />
      ) : (
          <View style={{backgroundColor: "#999999", width: 24, height: 24, marginRight: 18}}/>
      )}
      <View style={{position: 'relative'}}>
        <Text style={{color: isActive ? '#00B324' : '#fff'}}>{item.title}</Text>
      </View>
      {/* {item.id === "KPK" && (
          <View style={{
            position: 'absolute',
            top: 6,
            //right: 30,
            left:125
          }}>
            <Image 
              resizeMode="stretch" 
              style={{
                width:30,
                height:20,
              }} 
              source={require("../images/home/new-icon-Label.png")} 
            />
          </View>
        )
      } */}
    </View>
  }

  noDataText = () => {
    return <View style={{alignSelf:'center',marginTop:height/4}}>
            <Text style={{color:'white'}}>ไม่มีเกมที่เล่นล่าสุด!</Text>
           </View>
  }
  
  render() {
    const {
      gametype,
      searchInputText,
      inputBorderStatus,
      OpenGamemodal
    } = this.state;
    const tabs = GameDB;

    console.log(gametype,'gametype')

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000'
        }}
      >
        <Modal
            animationType='none'
            transparent={true}
            visible={OpenGamemodal}
            onRequestClose={() => { }}
            style={{ padding: 0, width: 275, backgroundColor: '#000' }}
        >

          <Text style={{color: '#fff', textAlign: 'center', marginBottom: 40}}>เรากำลังเปิดหน้าใหม่ให้คุณได้สนุก</Text>

          <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
            <View style={{flex: 1, marginRight: 20, borderWidth: 1, borderColor: '#fff', borderRadius:5,padding:10}}>
              <TouchableOpacity onPress={()=>this.closeOpenGamemodal()}>
                <Text style={{color: '#fff', textAlign: 'center'}}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, borderWidth: 1, borderColor: '#fff',borderRadius:5, padding:10}}>
              <TouchableOpacity onPress={()=>this.openGame()}>
                <Text style={{color: '#fff', textAlign: 'center'}}>ยืนยัน</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1,backgroundColor: "#000000", paddingLeft: 5, paddingRight: 5, marginTop: 17}}>
          <View style={{flexDirection: 'row'}}>
            <ModalDropdown
                animated={true}
                defaultIndex={3}
                options={gameData}
                renderRow={this.createSlotGameRow.bind(this)}
                onSelect={this.onGameTabClick}
                style={[styles.limitModalDropdown, { borderColor: '#292929' }]}
                dropdownStyle={[styles.limitDropdownStyle]}
                renderSeparator={()=>(<View style={{width: '95%', alignSelf: 'center', borderWidth:.5,borderColor:'#343637'}} />)}
                onDropdownWillShow={this.changeModalDropdownFlag.bind(this, true)}
                onDropdownWillHide={this.changeModalDropdownFlag.bind(this, false)}
            >
              <View style={styles.limitModalDropdownTextWrap}>
                <Text style={[styles.limitModalDropdownText]}>ผู้ให้บริการ: {gameData[this.getGameIDIndex()].title}</Text>
                <Animatable.View
                    transition={['borderTopColor', 'rotate', 'marginTop', 'marginBottom']}
                    style={{
                      transform: [{ rotate: `${this.state.modalDropdownFlag ? 180 : 0}deg` }],
                    }}
                >
                  <Image style={{height: 5, width: 10}} resizeMode='stretch' source={require('../images/V.png')} />
                </Animatable.View>
              </View>
            </ModalDropdown>

            {this.state.GameData.length > 0 && (
                <View style={styles.inputBox}>
                  <TextInput
                      style={[styles.inputWrap, styles[`input${inputBorderStatus}`]]}
                      placeholder="ค้นหาเกม"
                      placeholderTextColor="#9F9F9F"
                      value={searchInputText}
                      onChangeText={this.changeInputText.bind(this)}
                      onFocus={this.changeInputBorder.bind(this, "Focus")}
                      onBlur={this.changeInputBorder.bind(this, "Blur")}
                  />
                  <TouchableOpacity
                      style={styles.inputImageWrap}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                      onPress={this.searchGame.bind(this)}
                  >
                    <Image
                        resizeMode="stretch"
                        style={styles.inputImage}
                        source={require("./../images/slot/slotSearch2.png")}
                    ></Image>
                  </TouchableOpacity>
                </View>
            )}
          </View>
          {this.state.GameData.length > 0 && (
              // (gametype == "YDS" ? (
              <Tabs
                  onChange={this.onTabClick}
                  tabs={tabs}
                  tabBarInactiveTextColor="#CCCCCC"
                  tabBarActiveTextColor="#00E62E"
                  tabBarBackgroundColor={{ backgroundColor: "#171717" }}
                  tabBarUnderlineStyle={{ backgroundColor: "#17fe00" }}
              >
                <View style={{ height: height - 150 }}>
                  {/*1*/}
                  {this.state.selectSlotData.length > 0?(
                  <FlatList
                      showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                      showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                      automaticallyAdjustContentInsets={false}
                      numColumns={2} //每行显示1个
                      ref={flatList => (this._flatList1 = flatList)}
                      renderItem={this.createRenderRow.bind(this)}
                      enableEmptySections={true} //数据可以为空
                      onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                      //ListFooterComponent={this.renderFooter}//尾巴
                      keyExtractor={(item, index) => (item.key = index)}
                      onEndReached={this.LoreMore}
                      data={this.state.selectSlotData}
                      extraData={this.state.selectSlotData}
                  />
                  ):(
                    this.noDataText()
                  )}
                </View>

                <View>
                  {/*4*/}
                  {this.state.selectSlotData.length > 0?(
                  <FlatList
                      showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                      showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                      automaticallyAdjustContentInsets={false}
                      numColumns={2} //每行显示1个
                      ref={flatList => (this._flatList2 = flatList)}
                      renderItem={this.createRenderRow.bind(this)}
                      enableEmptySections={true} //数据可以为空
                      onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                      //ListFooterComponent={this.renderFooter}//尾巴
                      keyExtractor={(item, index) => (item.key = index)}
                      onEndReached={this.LoreMore}
                      data={this.state.selectSlotData}
                      extraData={this.state.selectSlotData}
                  />
                  ):(
                    this.noDataText()
                  )}
                </View>

                <View>
                  {/*2*/}
                  {this.state.selectSlotData.length > 0?(
                  <FlatList
                      showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                      showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                      automaticallyAdjustContentInsets={false}
                      numColumns={2} //每行显示1个
                      ref={flatList => (this._flatList3 = flatList)}
                      renderItem={this.createRenderRow.bind(this)}
                      enableEmptySections={true} //数据可以为空
                      onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                      //ListFooterComponent={this.renderFooter}//尾巴
                      keyExtractor={(item, index) => (item.key = index)}
                      onEndReached={this.LoreMore}
                      data={this.state.selectSlotData}
                      extraData={this.state.selectSlotData}
                  />
                  ):(
                    this.noDataText()
                  )}
                </View>

                <View>
                  {/*3*/}
                  {this.state.selectSlotData.length > 0?(
                  <FlatList
                      showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                      showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                      automaticallyAdjustContentInsets={false}
                      numColumns={2} //每行显示1个
                      ref={flatList => (this._flatList4 = flatList)}
                      renderItem={this.createRenderRow.bind(this)}
                      enableEmptySections={true} //数据可以为空
                      onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                      //ListFooterComponent={this.renderFooter}//尾巴
                      keyExtractor={(item, index) => (item.key = index)}
                      onEndReached={this.LoreMore}
                      data={this.state.selectSlotData}
                      extraData={this.state.selectSlotData}
                  />
                  ):(
                    this.noDataText()
                  )}
                </View>

                <View>
                  {/*4*/}
                  {this.state.selectSlotData.length > 0?(
                  <FlatList
                      showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                      showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                      automaticallyAdjustContentInsets={false}
                      numColumns={2} //每行显示1个
                      ref={flatList => (this._flatList5 = flatList)}
                      renderItem={this.createRenderRow.bind(this)}
                      enableEmptySections={true} //数据可以为空
                      onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                      //ListFooterComponent={this.renderFooter}//尾巴
                      keyExtractor={(item, index) => (item.key = index)}
                      onEndReached={this.LoreMore}
                      data={this.state.selectSlotData}
                      extraData={this.state.selectSlotData}
                  />
                  ):(
                    this.noDataText()
                  )}
                </View>
              </Tabs>
          )
          }
        </View>

      </View>
    );
  }
  closeOpenGamemodal = () => {
    this.setState({
      OpenGamemodal: false
    })
  }

  openGame = () => {
    this.setState({
      OpenGamemodal: false,
    })
    this.openDomin(this.state.GameOpenUrl);
  }

  renderRow = data => {
    let item = data.item;

    return (
      <TouchableOpacity
        key={item.gameId}
        onPress={() => this.PlayGame(item.gameId, item.provider, item.imageUrl)}
      >
        <View style={styles.GameImg}>
          <View style={styles.imgTextBox}>
            <Flex.Item style={{ flex: 0.7 }}>
              <Text
                style={{
                  color: "#fff",
                  opacity: 1,
                  fontSize: 10,
                  paddingLeft: 10
                }}
              >
                {item.gameName
                  ? item.gameName.length > 9
                    ? item.gameName.substr(0, 9) + ".."
                    : item.gameName
                  : ""}
              </Text>
            </Flex.Item>
            <Flex.Item alignItems="flex-end" style={{ flex: 0.25 }}>
              <Text
                style={{
                  color: "#4ee42b",
                  opacity: 1,
                  fontSize: 12,
                  paddingRight: 5
                }}
              >
                >
              </Text>
            </Flex.Item>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderFooter = () => {
    if (
      this.state.dataSource.length != 0 &&
      this.state.isLoreMoreing == "LoreMoreing"
    ) {
      return (
        <View
          style={{
            height: 44,
            backgroundColor: "rgb(200,200,200)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>{"正在加载...."}</Text>
        </View>
      );
    } else if (this.state.isLoreMoreing == "LoreMoreEmpty") {
      return (
        <View
          style={{
            height: 0,
            backgroundColor: "rgb(200,200,200)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>{""}</Text>
        </View>
      );
    } else {
      return null;
    }
  };
}

export default P2PGameList;

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    backgroundColor: "#171717"
  },
  containerHorizontal: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150
  },
  containerVertical: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 150
  },
  text: {
    color: "#fff",
    fontSize: 36
  },
  image: {
    width,
    height: 200
  },
  warning: {
    height: 35,
    width: width,
    backgroundColor: "#013626"
  },
  warningT: {
    height: 30,
    marginTop: 10
  },
  warningText: {
    color: "#fff"
  },
  gameBg1: {
    backgroundColor: "#fff",
    padding: 12
  },
  gameBg2: {
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#fff"
  },

  GameBox: {
    backgroundColor: "#fff",
    width: width,
    flexWrap: "wrap",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    paddingBottom: 10
  },
  GameImg: {
    flexWrap: "wrap",
    flexDirection: "column",
    marginTop: 15,
    // marginBottom:15,
    marginLeft: 16
    //  borderTopRightRadius:5,
    //  borderTopLeftRadius:5,
    // backgroundColor: '#333933',
  },
  imgTextBox: {
    width: "100%"
    // flexWrap: 'wrap', display: 'flex', flexDirection: 'row',
    // borderBottomLeftRadius: 12,
    // borderBottomRightRadius: 12,
    // backgroundColor: 'rgba(0, 0, 0, .6)',
    // width: width / 2.4,
    // position: 'absolute',
    // bottom: 0,
    // paddingTop: 5,
    // paddingBottom: 5,
  },

  slotWrap: {
    width: width - 10,
    borderColor: "#292929",
    borderRadius: 2,
    borderWidth: 1,
    position: "relative",
    height: 40,
    justifyContent: "center",
    marginTop: 10,
    overflow: "hidden",
    borderRadius: 4,
    marginBottom: 10
  },
  slotImgWrap: {
    width,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderLeftWidth: 4
  },
  slotImg: {
    width: 24,
    height: 24,
    marginLeft: 10,
    marginRight: 10
  },
  slotSortWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    backgroundColor: "#1d1d1d",
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 4,
    borderTopWidth: 0,
    borderLeftWidth: 4,
    marginLeft: 4,
    marginRight: 4,
    overflow: "hidden"
  },
  slotSortWrap0: {
    borderColor: "#46FF00"
  },
  slotSortWrap1: {
    borderColor: "#CAD043"
  },
  slotSortWrap2: {
    borderColor: "#DE9F11"
  },
  slotSortWrap3: {
    borderColor: "#AD2BCC"
  },
  slotSortWrap4: {
    borderColor: "#28C4AC"
  },
  slotTextColor0: {
    color: "#46FF00"
  },
  slotTextColor1: {
    color: "#CAD043"
  },
  slotTextColor2: {
    color: "#DE9F11"
  },
  slotTextColor3: {
    color: "#AD2BCC"
  },
  slotTextColor4: {
    color: "#28C4AC"
  },
  slotText: {},
  arrowWrap: {
    position: "absolute",
    flexDirection: "row",
    top: 0,
    bottom: 0,
    right: 0,
    height: 40,
    alignItems: "center"
  },
  arrow: {
    position: "absolute",
    top: 15,
    bottom: 15,
    right: 10,
    width: 0,
    height: 0,
    borderStyle: "solid",
    borderWidth: 10,
    borderTopColor: "#1aff00", //下箭头颜色
    borderLeftColor: "transparent", //右箭头颜色
    borderBottomColor: "transparent", //上箭头颜色
    borderRightColor: "transparent" //左箭头颜色
  },
  inputWrap: {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    height: 45,
    paddingLeft: 8,
    marginBottom: 6,
    color: "#fff",
    justifyContent: "center",
    backgroundColor: "#101010",
    fontFamily:"Kanit",
  },
  inputFocus: {
    borderColor: "#1aff00"
  },
  inputBlur: {
    borderColor: "#292929"
  },
  inputBox: {
    position: "relative",
    flex: 1,
    marginLeft: 10
  },
  inputImageWrap: {
    position: "absolute",
    top: 14,
    right: 8
  },
  inputImage: {
    width: 20,
    height: 20
  },
  gameImgBox: {
    width: (width - 10) / 2,
    position: "relative",
    marginBottom: 15
  },
  gameImgBox0: {
    marginRight: 10
  },
  gameImgBox1: {
    marginLeft: 10
  },
  imgTextWarp: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    justifyContent: "space-between",
    left: 0,
    right: 0,
    bottom: 0,
    height: 24,
    backgroundColor: "rgba(0, 0, 0, .4)"
  },
  GameImg: {
    flexWrap: "wrap",
    flexDirection: "column",
    marginTop: 15,
    // marginBottom:15,
    marginLeft: 16
    //  borderTopRightRadius:5,
    //  borderTopLeftRadius:5,
    // backgroundColor: '#333933',
  },
  nextBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 28
    //  paddingLeft:8,
    //  paddingRight:2,
  },
  limitModalDropdown: {
    flex: 1,
    height: 45,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 4,
    backgroundColor: '#101010',
    marginRight: 10
  },
  limitDropdownStyle: {
    marginTop: 10,
    width: '45%',
    shadowColor: '#00000080',
    shadowRadius: 5,
    shadowOpacity: .6,
    shadowOffset: { width: 2, height: 2 },
    elevation: 4,
    height: gameData.length * 45.5,
    backgroundColor: '#141414',
    borderColor: 'transparent'
  },
  limitModalDropdownList: {
    height: 45,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomColor: 'transparent'
  },
  limitModalDropdownListText: {
    color: '#fff'
  },
  limitModalDropdownTextWrap: {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
  },
  limitModalDropdownText: {
    color: '#9F9F9F'
  },
  limitModalDropdownArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 6,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#F5F5F5'
  },
});
