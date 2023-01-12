window.fromWalletBox = '';//來源
window.toWalletBox = '';  //目標帳戶
//餘額
window.TotalBal = 0;
window.IPSB = 0;
window.MAIN = 0;
window.LD = 0;
window.SLOT = 0;
window.SB = 0;
window.CMD = 0;
window.PT = 0;
window.AG = 0;
window.LiveChatX = ''; //克服
window.GameplaySlot = []  //最近遊戲∂ç
window.Gameplay = []  //最近遊戲
window.GameType = false // 遊戲開啟狀態
window.allowEmail = 'N' // 
window.allowPhone = 'Y' //
window.userNameDB = ''//
window.lookBox = false; // 先去瞧瞧
window.userLogin = "";//
window.userPassword = ''//
window.bonusProduct = '' //優惠目標賬戶
window.NoGoHome = true;  //註冊 黨者 等手機驗證
window.memberCode = '' //用戶memberCode  
window.userName = '' //用戶名  
window.UpdateV = 6500;   // 強制關閉版本
window.JBOVersion = '1.1.5.5' //版本號
window.SBTDomain;
window.NowGameType = '' // im sbt 默認開啟參數
window.NowGameTitle = ''//
window.IPSBClose = false// 預加仔遊戲 維護狀態
window.SBTClose = false// 預加仔遊戲 維護狀態
window.OWSClose = false// 預加仔遊戲 維護狀態
window.NowGameName = ''
global.Restrict = false
window.LiveChatOpen = false//客服
window.LivechatDragType = false// 客服懸浮球 
window.BankJump;
window.isGameLock = false;
window.E2Backbox = 'No dataBase '// 黑盒子
window.Iovation = 'No dataBase '// 黑盒子
window.RegisteredMG = false;  //註冊狀態
window.affCodeKex = ''; //代理號
window.isRegist = false;
window.GameDBType = false;   //遊戲狀態
window.SBDetailsPage = false; //sb
window.SponsorshipPageName = ""; //贊助標題
window.UserInformationTXT = ''//页面标题
window.LoginEntryTXT = ''//特殊登录认证名称
//window.VPNCheck = false//vpn状态
window.noFastLogin = false//点击退出不能快速登录
window.DeviceInfoIos = true//ios手机型号是没有指纹的
window.vipInfor = {
	imageUrl: "",
	isDefaultLevel: false,
	isDisplay: false,
	message: "",
}
window.isshowVIPModal = false
window.PromoID = ''; // 打開指定優惠
window.isHaveVipQQWeChat = false
window.AvatarPicture = ''
window.UmPma = false /// 給友盟推送近PMA 如未登錄 先登錄後跳進PMA by benji
//euro cup
window.IM_Token = ''
window.IM_MemberCode = ''
window.loginStatus = ''
window.IMBetCartdata = []//投注主单
window.BTIBetCartdata = []//投注主单
window.OWSBetCartdata = []//投注主单
window.BetMore = false
window.VendorData = ''//当前的Vendor，
window.lowerV = 'IM'//当前游戏
window.notificationInfo = ''//游戏推送
window.notificationRecommend = ''//消息推送
global.Toasts = ''
window.GameListNum = 0//游戏个数
window.EuroViewHeight = 0
window.isIphone12Upper=false;
window.Eventtitle=''
window.EventFloatIconList=[],
window.isEventPreview=false,
window.isShowPopularGame=false
window.Bankname = {
	"CMD": "NAN",
	"IPSB": "IM 体育",
	"LD": "真人娱乐",
	"SLOT": "老虎机 / GN 捕鱼",
	"SB": "BTi 体育 / IM 电竞",
	"MAIN": "主账户",
	"PT": "PT 老虎机 / PT 捕鱼",
	"AG": "AG 捕鱼",
}
window.HongBaoRain_Start = false // 是否红包雨活动开始时间
window.optVerify=false
window.ApiPort = ({
	'UserTerms': '',//用户条款标题
	'Token': null, // 用戶token
	'ReToken': null,//用戶retoken
	'LogoutTokey': '',
	'access_token': '',
	'UserLogin': false,//用戶登錄狀態
	'login': '/api/Login?', //獲取登入地址  POST
	'logout': '/api/logout?', //登出    POST 
	'Register': '/api/Member?',//註冊   POST 
	'News': '/api/News?',  //新聞
	'EmergencyAnnouncement': '/api/News/EmergencyAnnouncement', //緊急公告
	'Banner': '/api/CMS/Banners?',   //banner 數據 Get 
	'Promotions': '/api/CMS/Promotions', // 活動  GET
	'PromotionCategories': '/api/CMS/PromotionCategories',// 活動類別
	'PromotionsPost': '/api/CMS/Promotions/Applications',  // 申請活動
	'Promotion': '/api/CMS/Promotion', // 活動內容 GET
	'Balance': '/api/Balance?', //獲取錢包餘額  Get
	'Payment': '/api/Payment/Methods',//充值
	'PaymentDetails': '/api/Payment/Methods/Details', //充值細節
	'PaymentSettings': '/api/Payment/Methods/Settings',//個別充值渠道規則
	'CryptocurrencyInfo': '/api/Payment/Methods/GetCryptocurrencyInfo?',//加密貨幣資訊
	'CryptoExchangeRate': '/api/Payment/Cryptocurrency/ExchangeRate?CurrencyFrom=CNY&CurrencyTo=USDT&ExchangeAmount=1&',//加密貨幣匯率
	'CryptoWallet': '/api/Payment/MemberCryptocurrencyWalletAddress',//加密貨幣錢包
	'Transfer': '/api/Transfer/Applications?',//轉帳
	'TransferApplicationsByDate': '/api/Transfer/ApplicationsByDate',//轉賬紀錄
	'PaymentApplications': '/api/Payment/Applications?', //付款
	'GopayLB': '/api/Payment/Applications/',  //本銀 在線支付 完成請求
	'Member': '/api/Member?',  // 會員數據 Get 
	'MemberBanks': '/api/Payment/MemberBanks?',//用戶銀行卡
	'BrandValidation': '/api/BrandValidation', //用戶提款卡
	'Wallets': '/api/Transfer/Wallets?', //獲取目標帳戶 
	'Game': '/api/Games/',//遊戲
	'Bonus': '/api/Bonus',// 存款主賬優惠
	'BonusCalculate': '/api/Bonus/Calculate?',//存款轉帳優惠 檢測 
	'ForgetUsername': '/api/Member/ForgetUsername',  //忘記用戶名
	'REForgetPassword': '/api/Member/ForgetPassword',  //忘記密碼回調更改
	'ForgetPassword': '/api/Verification/Email/ForgetPassword', //忘記密碼
	'LiveChat': '/api/LiveChat/URL/MobileApp?', //克服
	'Generate': '/api/Member/Passcode/Generate?',//获取安全码
	'lotteryTransfer': '/api/Vendor/SGW/Transfer?',
	'lotteryLogout': '/api/Vendor/SGW/Logout?',
	'TransactionHistory': '/api/Payment/MemberBanks/TransactionHistory?',

	'IpAddress': '/api/IP/IpAddress?',//IpAddress

	'POSTNoCancellation': '/api/Payment/Applications/', //提款記錄取消


	'Statistics': '/api/Member/Statistics', //消息點擊

	'WSetting': '/api/Setting?key=withdrawalverification&currency=CNY&',//提款 驗證狀態

	'NotificationOne': '/api/Notification?',  //POST 第一次開app 註冊友盟個推
	'NotificationLogin': '/api/Notification?',  //PATCH 第一次開app 註冊友盟個推

	'Claim': '/api/Bonus/Claim',//優惠申請

	'BonusApplications': '/api/Bonus/Applications', //優惠歷史

	'UserBetHistory': '/api/BI/UserBetHistory',//投注記錄
	//更新会员中心资料
	'POSTMemberlistAPI': '/api/Member',

	//PATCH更新单个秘密答案的时候使用
	'PATCHMemberlistAPI': '/api/Member',

	//PUT更新会员的个人资料
	'PUTMemberlistAPI': '/api/Member',

	//验证邮箱
	'POSTEmailVerifyAPI': '/api/Verification/Email/Verify',

	// 检测目前密码方式或者录音方式存在与否
	'CheckSMSVendor': '/api/Verification/Phone/CheckSMSVendor?ServiceAction=ContactVerification&',

	'POSTPhoneVerifyAPI': '/api/Verification/Phone/Verify',
	
	
	//密碼修改
	"Password": "/api/Member/Password",

	//验证手机号码发送验证码
	'POSTPhoneVerifyAPI': '/api/Verification/Phone/Verify?isFirstRequest=false',

	"GETMemberBanksfirst": "/api/Payment/MemberBanks",

	"PATCHMemberBanksDefault": "/api/Payment/MemberBanks/",
	"DELETEMemberBanksDefault": "/api/Payment/MemberBanks/",

	//检查PT金币皇账户是否存在
	'GETCheckVendor': '/api/Vendor/PT?',

	//修改PT金币皇账户密码
	'PUTPTChangePWD': '/api/Vendor/PT/Password?redirectUrl=' + common_url,

	//pt username
	'PTUSERNAME': '/api/Vendor/PT/Username?username=',

	//自我限制详情
	'GETSelfExclusions': '/api/Member/SelfExclusions?',

	//设置限制
	'PUTSelfExclusions': '/api/Member/SelfExclusions?',

	//合作夥伴
	'Domain': '/api/App/Domain',

	'NewsNotifications': '/api/Member/Notifications', // 存提款 紅利消息存款消息类别 1,2  提款 类别 3,4  红利 5 , 6, 7, 8
	'PhoneTAC': '/api/Verification/Phone/TAC', // 手機驗證碼

	'ALBStatus': '/api/Payment/UpdateIsQRLocalAliPay?', ///支付宝转账是否成功充值 回馈 

	'PhonePrefix':'/api/Setting/Phone/Prefix?',
	
	//下载链接
	"GetDownloadLink": '/api/Download?',
	'Refresh': '/api/Refresh?', //刷新緩存
	'SuggestedAmount': '/api/Payment/SuggestedAmount?',
	'Vip': '/api/VIP?',
	'VipLevel': '/api/Member/VIPLevel?',
	'BonusApplications': '/api/Bonus/Applications?',
	'VipBonus': '/api/Bonus?',
	'UserBetHistory': "/api/BI/UserBetHistory",
	'MemberDailyTurnover': '/api/BI/MemberDailyTurnover',
	'GetVIPNotification': '/api/VIP/Notification?',

	// 11
	'GetLotteryStatus': '/api/Event?',
	'GetLotteryRecords': '/api/Event/Applications?',
	'PostLotteryStart': '/api/Event/Applications?',
	'GetLotteryProgress': '/api/Event/DailyProgress?',




	// cms
	'GetBanners': '/api/CMS/Banners?',
	'GetPromotions': '/api/CMS/Promotions?',
	'GetPromotionCategories': '/api/CMS/PromotionCategories?',
	'GetPromotionsDetail': '/api/CMS/Promotions/',

	// PersonalMessage
	'GetMessages': '/api/News/',
	'GetMessagesDetail': '/api/News/',
	'GetNewsUnreadNews': '/api/News/UnreadNews?',
	'POSTActionOnInboxMessage': '/api/News/',
	'GetCountryList': '/api/ProfileMasterData?category=Nations&',


	// Quelea
	'GetQueleaActiveCampaign': '/api/Quelea/QueleaActiveCampaign',
	'GetQueleaReferrerInfo': '/api/Quelea/QueleaReferrerInfo',
	'GetReferrerEligible': '/api/Quelea/ReferrerEligible',
	'PostReferrerSignUp': '/api/Quelea/ReferrerSignUp',
	'GetReferreeTaskStatus': '/api/Quelea/RefereeTaskStatus',
	'GetReferrerRewardStatus': '/api/Quelea/ReferrerRewardStatus',
	'GetReferrerActivity': '/api/Quelea/ReferrerActivity',

	//獲取當前IP
	'IpAdderess': '/api/IP/IpAddress?',
	//opt
	'CheckIsAbleSmsOTP': '/api/Payment/CheckIsAbleSmsOTP?',
	'SendSmsOTP': '/api/Payment/SendSmsOTP?',
	'VerifySmsOTP': '/api/Payment/VerifySmsOTP?',
	'MemberCryptocurrencyWalletAddress': '/api/Payment/MemberCryptocurrencyWalletAddress?',
	'GetRemainingAttempts':'/api/Verification/GetRemainingAttempts?',

	'getMaintenanceInfo': '/api/Payment/Banks/MaintenanceInfo?',
	'GetProcessingLB':'/api/Payment/Applications/ProcessingLBTransaction?',
	'POSTRememberBanks': '/api/Payment/MemberBanks?',
	'LBUniqueAmtDepositBack': '/api/Payment/Applications/', //付款
	'GETProfileMasterData': '/api/ProfileMasterData?',
	'SkynetUpdate': '/api/Member/SkynetUpdatePasswordAndDOB?',
	
	//歐洲杯新聞資訊
	'GetArticle':'/api/CMS/Articles?',
	'GetArticleDetail':'/api/CMS/ArticlesDetail?',
	'GetArticlesRecommendation':'/api/CMS/ArticlesRecommendation?',

	'NotifyBettingInfo': '/api/Vendor/NotifyBettingInfo?',

	//CA
	'POSTCACall':'/api/Member/AcceptCACall',

	//fund in bank
	'GetDAByAmount':'/api/Payment/DepositAccountByAmount',//LB步驟二需要呼叫此接口,獲得銀行信息
	// event
	'GetFloatIcon':'/api/Event/FloatingImages?',
	//RD 用戶帳戶綁定
	"PUTMemberBankReverse": "/api/Payment/MemberBanks/",

	//popular Game 飛行員遊戲
	'popularGame': '/api/Games?',
	//取消充值
	'MemberRequestDepositReject': '/api/Payment/Applications/MemberRequestDepositReject',
	
	//重新提交交易详情
	'GetResubmitDetail':'/api/Payment/Transactions/GetResubmitDepositDetails?',
	'ResubmitDetail':'/api/Payment/Transactions/CreateResubmitOnlineDeposit?',

	//发送登入验证码
	"GetOtpVerificationCode": "/api/Verification/Otp/Send?",
	//审核登入验证码
	"VerifyOtpVerificationCode": "/api/Verification/Otp/Verify?",
	// 获取发送/审核验证码剩余次数
	"VerifyOtpRemainingAttempts": "/api/Verification/Otp/RemainingAttempts?",
	//重新驗證密碼
	"PostRevalidatePassword":"/api/member/RevalidatePassword?",
});





