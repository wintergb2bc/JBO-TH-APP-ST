import React from "react";
import {
  StyleSheet,
  Text,
  Linking,
  Image,
  Platform,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,TextInput
} from "react-native";
import { Actions } from "react-native-router-flux";

import {Tabs, Toast, Flex, Modal} from "antd-mobile-rn"; 
const { width, height } = Dimensions.get("window");

let GameDB;
class GameList extends React.Component {
  // static navigationOptions = ({
  //   navigation  }) => ({
  //   headerTitle: navigation.state.params.title ? navigation.state.params.title :"",
  //   headerTintColor: '#fff',
  // });

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
      Nowtype: "全部",
      gametype: this.props.data,
      JBRGamdDB: "",
      IMOGamdDB: "",
      JBR_Popular: [],
      JBR_New: [],
      JBR_Jackpot: [],
      IMO_Popular: [],
      IMO_New: [],
      IMO_Jackpot: [],
      BLE_tournament: [],
      BLE_mahjong: [],
      BLE_poker: [],
      BLERemoveHead:["四川麻将大赛","雀王争霸战","炸金花","大众麻将","二人麻将","血战到底","广东麻将","血流成河","贵阳捉鸡麻将","红黑大战","卡五星麻将","杭州麻将","湖南转转麻将"],
      //博樂棋牌特殊處理 側邊欄橫向版 benji
      searchInputText:'',
      searchInputTextLower:'',
      filterFlag:false,
      OpenGamemodal: false,
      GameOpenUrl: ''
    };

    this.responseData = [];
  }

  componentWillMount(props) {
    if (this.props.data == "JBP") {
      GameDB = [
        { title: "全部" },
        { title: "扑克" },
        { title: "炸金花" },
        { title: "牛牛" },
        { title: "麻将" }
      ];
    } else if (this.props.data == "BLE") {
      GameDB = [
        { title: "全部" },
        { title: "锦标赛" },
        { title: "麻将" },
        { title: "扑克牌" },
      ];
    } else {
      GameDB = [
        { title: "全部" },
        { title: "热门" },
        { title: "最新" },
        { title: "奖池" }
      ];
    }

    reloadOrientation();
    //console.log(this.props.data)
    //頂部名字
    // this.props.navigation.setParams({
    // 	title:this.props.data=="JBP" ? '棋牌':'电玩'
    // })

    let gametype = this.props.data;
    if (gametype == "JBP" || gametype == 'P2P') {
      gametype = "mobilep2p";
    } else if (gametype == "JBR") {
      gametype = "mobileslot";
    } else if (gametype == "IMO") {
      gametype = "mobileslot";
    } else if(gametype === 'BLE') {
      gametype = 'BLE'
    }else if (gametype == "GPK") {
			gametype = "mobilekenolottery"
		}else if(gametype === 'SPR') {
      gametype = 'SPR'
    }else {
      gametype == "mobilefishing"
    }

    global.storage
      .load({
        key: "GameDatd" + gametype,
        id: gametype
      })
      .then(data => {
        //
        console.log(data,'GameData')
        this.setState({
          GameData: data
        });

        this.Refresh(data);

        //console.log('1.有存款緩存')

        this.LoadGame(data);
        this.GetGameList(this.props.data)
      })
      .catch(() => {
        console.log("2.沒有存款緩存");
        this.GetGameList(this.props.data, true);
      });


     
  }

  _onOrientationChange() {
    //console.log('111111')
  }

  componentWillUnmount() {
    //離開註銷監聽
  }

  //跳轉
  navigateToScene(key, GameOpenUrl, gametype,noneHead,gameid) { 
    //console.log(GameOpenUrl)
    Actions[key]({ GameOpenUrl: GameOpenUrl, gametype,noneHead ,gameid});
  }

  //请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
  GetGameList(gametype='mobilefishing', flag) {
    let request = (ApiPort.Game + "?gametype=" + gametype + "&vendorPlatform=mobile&")

    if (gametype == "JBP") {
      gametype = "mobilep2p";
      request = ((ApiPort.Game + "?gametype=" + gametype + "&gameProvider=JBP&vendorPlatform=mobile&"))
    } else if(gametype == 'P2P'){
      gametype = "mobilep2p";
    }else if (gametype == "JBR") {
      gametype = "mobileslot";
    } else if (gametype == "IMO") {
      gametype = "mobileslot";
    }else if (gametype =="SPR"){
      gametype = "mobilep2p";
      request = (ApiPort.Game + "?gametype=" + gametype + "&gameProvider=SPR&vendorPlatform=mobile&")
    }else if (gametype == "GPK"){
      gametype = "mobilekenolottery"
      request = (ApiPort.Game + "?gametype=" + gametype + "&vendorPlatform=mobile&")
    } else if(this.props.data == 'BLE'){
      request = (ApiPort.Game + '?gametype=mobilep2p&gameProvider=BLE&')
    }


    console.log(gametype)

    flag && Toast.loading("กำลังโหลด...", 200);
    // let request = this.props.data == 'BLE' ? (ApiPort.Game + '?gametype=mobilep2p&gameProvider=BLE&')
    // :
    // (this.props.data == 'JBP' ? ((ApiPort.Game + "?gametype=" + gametype + "&gameProvider=JBP&vendorPlatform=mobile&")) : (ApiPort.Game + "?gametype=" + gametype + "&vendorPlatform=mobile&"))
    fetchRequest(
      request ,
      "GET"
    )
      .then(data => {
        console.log('Game data',data)
        Toast.hide();

        this.setState({
          GameData: data
        });

        global.storage.save({
          key: "GameDatd" + gametype, // 注意:请不要在key中使用_下划线符号!
          id: gametype, // 注意:请不要在id中使用_下划线符号!
          data: data,
          expires: null
        });

        this.Refresh(data);

        this.LoadGame(data);
      })
      .catch(() => {
        Toast.hide();
      });
  }

  //请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
  PlayGame(gameid, gametype, img,gameName) {
    console.log('gameid '+gameid, 'gametype '+gametype)
    if (isGameLock == true) {
      Toast.fail("游戏访问限制", 2);
      return;
    }
    //console.log(gametype)
    if (ApiPort.UserLogin == false) {
      Toast.fail("ล็อคอิน", 1); //請先登入
      Actions.logins();
      return;
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

    if(this.state.gametype == 'GPK'){
      UMonEvent("Game", "Launch", "GPKLotteryGames_ProductPage");   //Piwki 追蹤 加薪遊戲 記得添加
    }
    if(this.state.gametype == "P2P"){
      UMonEvent("Game", "Launch", "3DGames_ProductPage");   //Piwki 追蹤 加薪遊戲 記得添加 
    }
    if(gametype == "SPR"){
      UMonEvent("Game", "Launch", `${gameName}_SPRInstantGames_ProductPage`);
    }

    Toast.loading("เริ่มล็อบบี้เกม...", 200);
     // Toast.loading('正在启动游戏,请稍候...',200);
    fetchRequest(ApiPort.Game + gameid + "?isDemo=false&", "POST", data)
      .then(data => {
        console.log('Game data',data)
        Toast.hide();
        let BlegameReH= false; // 橫屏遊戲刪除頭部 , 特殊側邊菜單 benji
        if(this.state.BLERemoveHead.indexOf(
          gameName) != -1 || gametype == "JBP" || gametype == 'P2P'){
          BlegameReH =true;
        } 
        
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
          // Toast.fail(
          //   "尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服",
          //   2
          // );
          return;
        }
        if (data.errorCode == 0) {
          if (data.isMaintenance == true) {
            Toast.fail(
              "เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา",
              //"亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。",
              2
            );
            return;
          }

          if (this.props.data == "JBR") {
            if (Platform.OS == "android") {
              this.openDomin(data.gameUrl);
              return;
            }
          }

          if (gametype === "TGP") {
            this.setState({
              GameOpenUrl: data.gameUrl,
              OpenGamemodal: true
            })
            return;
          }
          
          if (this.props.data == "PT" ) {
            this.openDomin(data.gameUrl);
            return;
          }
          //原本没有传gametype,新增部分棋牌判断高度
          let gametypes = this.props.data;
          if (gametypes != "JBP" && gametypes != "IMO") {
            gametypes = "";
          } 
          if (gametype == "SPR"){
            gametypes="SPR"
          }
          console.log(BlegameReH,'111')
          if(this.props.data == 'BLE') {gametypes = 'BLE'}
          if(BlegameReH == true){ //橫屏遊戲刪除頭部 , 特殊側邊菜單 benji
            this.navigateToScene("JBPGamePage", data.gameUrl, gametypes,BlegameReH,gameid);
            return;
          } 
          this.navigateToScene("GamePage", data.gameUrl, gametypes,BlegameReH,gameid);
         
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

    if (item == "全部") {
    } else if (item == "热门") {
    } else if (item == "最新") {
    } else if (item == "奖池") {
    } else if (item == "最近游戏") {
    }
    this.setState({Nowtype:item,filterFlag:false,searchInputText:''})
  };

  LoadGame(GameData) {
    // const {GameData} = this.state;
    let PopularDBx = [];
    let NewDBx = [];
    let JackpotDBx = [];
    let userPlayDBx = [];
    let JBRGamdDB = [];
    let JBR_Popular = [];
    let JBR_New = [];
    let JBR_Jackpot = [];
    let IMOGamdDB = [];
    let IMO_Popular = [];
    let IMO_New = [];
    let IMO_Jackpot = [];
    let BLE_tournament = [];
    let BLE_mahjong = [];
    let BLE_poker = []
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

    if (this.props.data == "JBP") {
      GameData.filter(UnIsLive).map(function(item, index) {
        for (var j = 0; j < item.categories.length; j++) {
          if (item.categories[j].categoryName == "poker") {
            PopularDBx.push(GameData[index]);
          }

          if (item.categories[j].categoryName == "GoldenFlower") {
            NewDBx.push(GameData[index]);
          }

          if (item.categories[j].categoryName == "NiuNiu") {
            JackpotDBx.push(GameData[index]);
          }

          if (item.categories[j].categoryName == "Mahjong") {
            userPlayDBx.push(GameData[index]);
          }
        }
      });
    } else  if (this.props.data == "BLE") {
      GameData.filter(UnIsLive).map(function(item, index) {
        for (var j = 0; j < item.categories.length; j++) {
          if (item.categories[j].categoryName.toLocaleLowerCase() == "tournament") {
            BLE_tournament.push(GameData[index]);
          }

          if (item.categories[j].categoryName.toLocaleLowerCase() == "mahjong") {
            BLE_mahjong.push(GameData[index]);
          }

          if (item.categories[j].categoryName.toLocaleLowerCase() == "poker") {
            BLE_poker.push(GameData[index]);
          }
        }
      });
    } else {
      GameData.filter(UnIsLive).map(function(item, index) {
        if (item.provider == "JBR") {
          //	console.log(GameData[index])
          JBRGamdDB.push(GameData[index]); //全部
          for (var j = 0; j < item.categories.length; j++) {
            if (item.categories[j].categoryName == "Popular") {
              JBR_Popular.push(GameData[index]); //热门
            }

            if (item.categories[j].categoryName == "New") {
              JBR_New.push(GameData[index]); //最新Ｇ
            }

            if (item.categories[j].categoryName == "Jackpot") {
              JBR_Jackpot.push(GameData[index]); //奖池
            }
          }
        }

        if (item.provider == "MGSQF") {
          IMOGamdDB.push(GameData[index]); //全部
          for (var j = 0; j < item.categories.length; j++) {
            if (item.categories[j].categoryName == "Popular") {
              IMO_Popular.push(GameData[index]); //热门
            }

            if (item.categories[j].categoryName == "New") {
              IMO_New.push(GameData[index]); //最新
            }

            if (item.categories[j].categoryName == "Jackpot") {
              IMO_Jackpot.push(GameData[index]); //奖池
            }
          }
        }
      });
    }

    //console.log(JBRGamdDB)
    // console.log(IMOGamdDB)

    this.setState({
      APopularDB: PopularDBx,
      JBRGamdDB: JBRGamdDB,
      IMOGamdDB: IMOGamdDB,
      ANewDB: NewDBx,
      AJackpotDB: JackpotDBx,
      PopularDB: PopularDBx,
      NewDB: NewDBx,
      JackpotDB: JackpotDBx,
      userPlayDBx: userPlayDBx,
      JBR_Popular,
      JBR_New,
      JBR_Jackpot,
      IMO_Popular,
      IMO_New,
      IMO_Jackpot,
      BLE_tournament,
      BLE_mahjong,
      BLE_poker
    });
  }
  changeInputText (searchInputText) {
		this.setState({
			searchInputText: searchInputText.trim(),
			searchInputTextLower: searchInputText.trim().toLowerCase()
		})
  }
  searchGame () {
		this.getSelectslotData()
	}
  getSelectslotData () {
		const { IMO_Popular, IMOGamdDB, Nowtype,IMO_New,IMO_Jackpot, searchInputText, searchInputTextLower } = this.state
    let selectSlotData = []
    let MGSGameData=[]
    let allGamedata=IMOGamdDB
    let populardata=IMO_Popular
    let newdata=IMO_New
    let jackpotdata=IMO_Jackpot
    // console.log('YDSGameData',YDSGameData)
    // console.log('GameData',GameData)
    // console.log('categoryID',categoryID)
     console.log('Nowtype',Nowtype)
    //  if(Nowtype=='全部'){
    //    YDSGameData = GameData.filter(v => (v.provider.toLocaleUpperCase() === 'MGSQF') && Boolean(v.categories.find(v2 => v2.categoryName === 'IsLive')))

    //  }
    switch(Nowtype){
      case '全部':
          MGSGameData = allGamedata.filter(v => (v.provider.toLocaleUpperCase() === 'MGSQF') && Boolean(v.categories.find(v2 => v2.categoryName === 'IsLive')))
       break;
       case '热门':
          MGSGameData = populardata.filter(v => (v.provider.toLocaleUpperCase() === 'MGSQF') && Boolean(v.categories.find(v2 => v2.categoryName === 'IsLive')))
       break;
       case '最新':
          MGSGameData = newdata.filter(v => (v.provider.toLocaleUpperCase() === 'MGSQF') && Boolean(v.categories.find(v2 => v2.categoryName === 'IsLive')))
       break;
       case '奖池':
          MGSGameData = jackpotdata.filter(v => (v.provider.toLocaleUpperCase() === 'MGSQF') && Boolean(v.categories.find(v2 => v2.categoryName === 'IsLive')))
       break;
    }
    		if (searchInputText!='') {
        
				selectSlotData =  MGSGameData.filter(v => {
          let nameLower = v.gameName && v.gameName.toLowerCase();
          let istrue = nameLower.includes(searchInputTextLower);
					return istrue
        })
        this.setState({filterFlag:true,selectSlotData})
      }else{
        this.setState({filterFlag:false})
      }
      console.log('selectSlotData',selectSlotData)
      // console.log('selectSlotData',	selectSlotData)
     
		// if (categoryID === '') {
    //   console.log(1)
		// 	if (searchInputText) {
    //     console.log(12)
		// 		selectSlotData =  YDSGameData.filter(v => {
		// 			let nameLower = v.gameName && v.gameName.toLowerCase();
		// 			let istrue = nameLower.includes(searchInputTextLower);
		// 			return istrue
		// 		})
		// 		// selectSlotData =  YDSGameData.filter(v => v.gameName && v.gameName.includes(searchInputText))
		// 	} else {
    //     console.log(13)
		// 		selectSlotData = YDSGameData
		// 	}
		// } else if (categoryID === 'recentGames') {
    //   console.log(2)
		// 	if (searchInputText) {
    //     console.log(21)
		// 		selectSlotData =  storageSlotData.filter(v => {
		// 			let nameLower = v.gameName && v.gameName.toLowerCase();
		// 			let istrue = nameLower.includes(searchInputTextLower);
		// 			return istrue
		// 		})
		// 		// selectSlotData =  storageSlotData.filter(v => v.gameName && v.gameName.includes(searchInputText))
		// 	} else {
    //     console.log(22)
		// 		selectSlotData = storageSlotData
		// 	}
		// } else {
    //   console.log(3)
		// 	if (searchInputText) {
    //     console.log(31)
		// 		selectSlotData = YDSGameData.filter(v1 => {
		// 			let temp = v1.categories.find(v2 => v2.categoryID === categoryID)
		// 			let nameLower = v.gameName && v.gameName.toLowerCase();
		// 			let istrue = Boolean(temp) && nameLower.includes(searchInputTextLower);
		// 			return istrue
		// 			// return Boolean(temp) && (v1.gameName && v1.gameName.includes(searchInputText))
		// 		})
		// 	} else {
    //     console.log(4)
		// 		selectSlotData = YDSGameData.filter(v1 => {
		// 			let temp = v1.categories.find(v2 => v2.categoryID === categoryID)
		// 			return Boolean(temp)
		// 		})
		// 	}
    // }
    // console.log('selectSlotData',selectSlotData)
		// this.setState({
		// 	selectSlotData
		// }, () => {
		// 	// this.runAnimate()
		// })
	}
  render() {
    const { gametype,searchInputText,filterFlag,selectSlotData, OpenGamemodal } = this.state;
    const tabs = GameDB;
    console.log(this.state)
    return (
      <View style={{ flex: 1, backgroundColor: "#1A1A1A" }}>
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
       {gametype == "IMO" &&
       <View style={{  width: width - 40,
        paddingHorizontal: 15,
        paddingVertical:Platform.OS == "android"? 0:10,
        borderWidth: 1,
        disply:'flex',
        flexDirection:'row',
        alignSelf:'center',
        borderColor: '#FFFFFF',justifyContent:'space-between',alignItems:'center',alignContent:'center'}}>
           <TextInput  
           placeholder='搜索游戏'
           placeholderTextColor="#c8c8c8" 
            style={{ color: '#fff',width: width-100}}
            value={searchInputText}
            onChangeText={ (e)=>this.changeInputText(e)}
           />
              <TouchableOpacity onPress={()=>this.searchGame()}>
                <Image resizeMode='stretch' style={{width: 24,height: 24}} source={require('../images/search.png')} ></Image>
              </TouchableOpacity>
            </View>
          
      }


         { (gametype == 'GPK' || gametype == 'P2P')  && 
            <View>
            {/* 竞博 棋牌 全部1*/}

            <FlatList
              showsVerticalScrollIndicator={false} //是否显示垂直滚动条
              showsHorizontalScrollIndicator={false} //是否显示水平滚动条
              automaticallyAdjustContentInsets={false}
              numColumns={2} //每行显示1个
              ref={flatList => (this._flatList = flatList)}
              renderItem={this.renderRow}
              enableEmptySections={true} //数据可以为空
              onEndReachedThreshold={0.1} //执行上啦的时候10%执行
              //ListFooterComponent={this.renderFooter}//尾巴
              keyExtractor={(item, index) => (item.key = index)}
              onEndReached={this.LoreMore}
              data={this.state.GameData}
              extraData={this.state.GameData}
            />
          </View>
         }
        {gametype == "JBP" ? (
          <Tabs
            onChange={this.onTabClick}
            tabs={tabs}
            tabBarInactiveTextColor={{ color: "#959595" }}
            tabBarTextStyle={{ color: "#fff" }}
            tabBarActiveTextColor={{ color: "#17fe00" }}
            tabBarBackgroundColor={{ backgroundColor: "#1A1A1A" }}
            tabBarUnderlineStyle={{ backgroundColor: "#17fe00" }}
          >
            <View>
              {/* 竞博 棋牌 全部1*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.GameData}
                extraData={this.state.GameData}
              />
            </View>

            <View>
              {/*2*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.PopularDB}
                extraData={this.state.PopularDB}
              />
            </View>

            <View>
              {/*3*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.NewDB}
                extraData={this.state.NewDB}
              />
            </View>

            <View>
              {/*4*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.JackpotDB}
                extraData={this.state.JackpotDB}
              />
            </View>

            <View>
              {/*4*/}
              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.userPlayDBx}
                extraData={this.state.userPlayDBx}
              />
            </View>
          </Tabs>
        ) : gametype == "JBR" ? (
          <Tabs
            onChange={this.onTabClick}
            tabs={tabs}
            tabBarInactiveTextColor={{ color: "#959595" }}
            tabBarTextStyle={{ color: "#fff" }}
            tabBarActiveTextColor={{ color: "#17fe00" }}
            tabBarBackgroundColor={{ backgroundColor: "#1A1A1A" }}
            tabBarUnderlineStyle={{ backgroundColor: "#17fe00" }}
          >
            <View style={{ height: height - 150 }}>
              {/*竞博 电玩 全部*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.JBRGamdDB}
                extraData={this.state.JBRGamdDB}
              />
            </View>
            <View style={{ height: height - 150 }}>
              {/*热门*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.JBR_Popular}
                extraData={this.state.JBR_Popular}
              />
            </View>
            <View style={{ height: height - 150 }}>
              {/*最新*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.JBR_New}
                extraData={this.state.JBR_New}
              />
            </View>
            <View style={{ height: height - 150 }}>
              {/*奖池*/}

              <FlatList
                showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                automaticallyAdjustContentInsets={false}
                numColumns={2} //每行显示1个
                ref={flatList => (this._flatList = flatList)}
                renderItem={this.renderRow}
                enableEmptySections={true} //数据可以为空
                onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                //ListFooterComponent={this.renderFooter}//尾巴
                keyExtractor={(item, index) => (item.key = index)}
                onEndReached={this.LoreMore}
                data={this.state.JBR_Jackpot}
                extraData={this.state.JBR_Jackpot}
              />
            </View>
          </Tabs>
        ) : (
          gametype == "IMO" ? ( 
            <Tabs
              onChange={this.onTabClick}
              tabs={tabs}
              tabBarInactiveTextColor={{ color: "#959595" }}
              tabBarTextStyle={{ color: "#fff" }}
              tabBarActiveTextColor={{ color: "#17fe00" }}
              tabBarBackgroundColor={{ backgroundColor: "#1A1A1A" }}
              tabBarUnderlineStyle={{ backgroundColor: "#17fe00" }}
            >
              <View style={{ height: height - 150 }}>
                {/*MGS 电玩 全部*/}
                <FlatList
                  showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                  showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                  automaticallyAdjustContentInsets={false}
                  numColumns={2} //每行显示1个
                  ref={flatList => (this._flatList = flatList)}
                  renderItem={this.renderRow}
                  enableEmptySections={true} //数据可以为空
                  onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                  //ListFooterComponent={this.renderFooter}//尾巴
                  keyExtractor={(item, index) => (item.key = index)}
                  onEndReached={this.LoreMore}
                  data={filterFlag?selectSlotData:this.state.IMOGamdDB}
                  extraData={this.state.IMOGamdDB}
                />
              </View>
              <View style={{ height: height - 150 }}>
                {/*热门*/}
                {console.log('filterFlag',filterFlag,selectSlotData,this.state.IMO_Popular)}

                <FlatList
                  showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                  showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                  automaticallyAdjustContentInsets={false}
                  numColumns={2} //每行显示1个
                  ref={flatList => (this._flatList = flatList)}
                  renderItem={this.renderRow}
                  enableEmptySections={true} //数据可以为空
                  onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                  //ListFooterComponent={this.renderFooter}//尾巴
                  keyExtractor={(item, index) => (item.key = index)}
                  onEndReached={this.LoreMore}
                  data={filterFlag?selectSlotData:this.state.IMO_Popular}
                  extraData={this.state.IMO_Popular}
                />
              </View>
              <View style={{ height: height - 150 }}>
                {/*最新*/}

                <FlatList
                  showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                  showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                  automaticallyAdjustContentInsets={false}
                  numColumns={2} //每行显示1个
                  ref={flatList => (this._flatList = flatList)}
                  renderItem={this.renderRow}
                  enableEmptySections={true} //数据可以为空
                  onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                  //ListFooterComponent={this.renderFooter}//尾巴
                  keyExtractor={(item, index) => (item.key = index)}
                  onEndReached={this.LoreMore}
                  data={filterFlag?selectSlotData:this.state.IMO_New}
                  extraData={this.state.IMO_New}
                />
              </View>
              <View style={{ height: height - 150 }}>
                {/*奖池*/}

                <FlatList
                  showsVerticalScrollIndicator={false} //是否显示垂直滚动条
                  showsHorizontalScrollIndicator={false} //是否显示水平滚动条
                  automaticallyAdjustContentInsets={false}
                  numColumns={2} //每行显示1个
                  ref={flatList => (this._flatList = flatList)}
                  renderItem={this.renderRow}
                  enableEmptySections={true} //数据可以为空
                  onEndReachedThreshold={0.1} //执行上啦的时候10%执行
                  //ListFooterComponent={this.renderFooter}//尾巴
                  keyExtractor={(item, index) => (item.key = index)}
                  onEndReached={this.LoreMore}
                  data={filterFlag?selectSlotData:this.state.IMO_Jackpot}
                  extraData={this.state.IMO_Jackpot}
                />
              </View>
            </Tabs>
            // </View>
          ) : gametype == "BLE" && (
        <Tabs
        onChange={this.onTabClick}
        tabs={tabs}
        tabBarInactiveTextColor={'#CCCCCC'}
        tabBarActiveTextColor={'#17fe00'}
        tabBarBackgroundColor={{ backgroundColor: "#1A1A1A" }}
        tabBarUnderlineStyle={{ backgroundColor: "#17fe00" }}
      >
        <View>
          {/*MGS 电玩 全部*/}

          <FlatList
            showsVerticalScrollIndicator={false} //是否显示垂直滚动条
            showsHorizontalScrollIndicator={false} //是否显示水平滚动条
            automaticallyAdjustContentInsets={false}
            numColumns={2} //每行显示1个
            ref={flatList => (this._flatList = flatList)}
            renderItem={this.renderRow}
            enableEmptySections={true} //数据可以为空
            onEndReachedThreshold={0.1} //执行上啦的时候10%执行
            //ListFooterComponent={this.renderFooter}//尾巴
            keyExtractor={(item, index) => (item.key = index)}
            onEndReached={this.LoreMore}
            data={this.state.GameData}
            extraData={this.state.GameData}
          />
        </View>
        <View>
          {/*热门*/}

          <FlatList
            showsVerticalScrollIndicator={false} //是否显示垂直滚动条
            showsHorizontalScrollIndicator={false} //是否显示水平滚动条
            automaticallyAdjustContentInsets={false}
            numColumns={2} //每行显示1个
            ref={flatList => (this._flatList = flatList)}
            renderItem={this.renderRow}
            enableEmptySections={true} //数据可以为空
            onEndReachedThreshold={0.1} //执行上啦的时候10%执行
            //ListFooterComponent={this.renderFooter}//尾巴
            keyExtractor={(item, index) => (item.key = index)}
            onEndReached={this.LoreMore}
            data={this.state.BLE_tournament}
            extraData={this.state.BLE_tournament}
          />
        </View>
        <View>
          {/*最新*/}

          <FlatList
            showsVerticalScrollIndicator={false} //是否显示垂直滚动条
            showsHorizontalScrollIndicator={false} //是否显示水平滚动条
            automaticallyAdjustContentInsets={false}
            numColumns={2} //每行显示1个
            ref={flatList => (this._flatList = flatList)}
            renderItem={this.renderRow}
            enableEmptySections={true} //数据可以为空
            onEndReachedThreshold={0.1} //执行上啦的时候10%执行
            //ListFooterComponent={this.renderFooter}//尾巴
            keyExtractor={(item, index) => (item.key = index)}
            onEndReached={this.LoreMore}
            data={this.state.BLE_mahjong}
            extraData={this.state.BLE_mahjong}
          />
        </View>
        <View>
          {/*奖池*/}

          <FlatList
            showsVerticalScrollIndicator={false} //是否显示垂直滚动条
            showsHorizontalScrollIndicator={false} //是否显示水平滚动条
            automaticallyAdjustContentInsets={false}
            numColumns={2} //每行显示1个
            ref={flatList => (this._flatList = flatList)}
            renderItem={this.renderRow}
            enableEmptySections={true} //数据可以为空
            onEndReachedThreshold={0.1} //执行上啦的时候10%执行
            //ListFooterComponent={this.renderFooter}//尾巴
            keyExtractor={(item, index) => (item.key = index)}
            onEndReached={this.LoreMore}
            data={this.state.BLE_poker}
            extraData={this.state.BLE_poker}
          />
        </View>
      </Tabs>
       )
        )}
 
        {gametype == "SPR" &&
        (
          <View style={{ height: height - 90 }}>
            {/*SPR SP小游戏*/}
            <FlatList
              showsVerticalScrollIndicator={false} //是否显示垂直滚动条
              showsHorizontalScrollIndicator={false} //是否显示水平滚动条
              automaticallyAdjustContentInsets={false}
              numColumns={2} //每行显示1个
              ref={flatList => (this._flatList = flatList)}
              renderItem={this.renderRow}
              enableEmptySections={true} //数据可以为空
              onEndReachedThreshold={0.1} //执行上啦的时候10%执行
              //ListFooterComponent={this.renderFooter}//尾巴
              keyExtractor={(item, index) => (item.key = index)}
              onEndReached={this.LoreMore}
              data={this.state.GameData}
              extraData={this.state.GameData}
            />
          </View>
        )
      }
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
        onPress={() => this.PlayGame(item.gameId, item.provider, item.imageUrl,item.gameName)}
      >
        <View style={styles.GameImg}>
          {item.provider != "JBP" ? (
            <Image
              resizeMode="stretch"
              source={{ uri: item.imageUrl }}
              // source={require("../images/111.png")}
              defaultSource={require("../images/lazyload.png")}
              style={{
                borderRadius: 0,
                width: (width==390?375:width) * 0.417, //防跑版
                height: (width==390?375:width) * 0.57,
                borderBottomLeftRadius: 0
              }}
            />
          ) : (
            item.provider == "JBP" && (
              <Image
                resizeMode="stretch"
                source={{ uri: item.imageUrl }}
                // source={require("../images/111.png")}
                defaultSource={require("../images/lazyload.png")}
                style={{
                  borderRadius: 0,
                  width:(width==390?375:width) * 0.417, //防跑版
                  height: (width==390?375:width) * 0.57,
                }}
              />
            )
          )}

   

          {
            //  item.provider == "JBP" ||item.provider == "JBR" &&
            <View style={styles.imgTextBox}>
              
              <View style={styles.nextBox}>
                <Text
                  style={{ color: "#fff", fontSize: 13, textAlign: "center" }}
                >
                  {item.gameName
                    ? item.gameName.length > 9
                      ? item.gameName.substr(0, 9) + ".."
                      : item.gameName
                    : ""}
                </Text>
                {/* <Image resizeMode='stretch' source={require('../images/icon-next.png')} style={{ width: 22, height: 22}} /> */}
              </View>
           
            </View>
          }
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

export default GameList;

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
    // position: 'absolute',
    // bottom:-26,
  },
  nextBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 28
    //  paddingLeft:8,
    //  paddingRight:2,
  }
});
