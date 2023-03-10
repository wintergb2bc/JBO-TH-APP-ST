import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import { Button,List, Accordion ,Flex,Tabs,ActivityIndicator} from 'antd-mobile-rn';

import { updateProfile } from '../actions/ProfileAction';

class Profile extends React.Component {
  constructor(props) {
    super(props); 
    
    this.state = {
      profileDetails: props.profile
    };
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onMobileChanged = this.onMobileChanged.bind(this);
    this.onGenderChanged = this.onGenderChanged.bind(this);
    this.onUpdateProfileClicked = this.onUpdateProfileClicked.bind(this);
  }

  onNameChanged(name) {
    const profileDetails = Object.assign({}, this.state.profileDetails);
    profileDetails.name = name;
    this.setState({ profileDetails })
  }

  onMobileChanged(mobile) {
    const profileDetails = Object.assign({}, this.state.profileDetails);
    profileDetails.mobile = mobile;
    this.setState({ profileDetails })
  }

  onGenderChanged(gender) {
    const profileDetails = Object.assign({}, this.state.profileDetails);
    profileDetails.gender = gender;
    this.setState({ profileDetails })
  }

  onUpdateProfileClicked() {
    this.props.updateProfile(this.state.profileDetails);
  }

  render () {


    const tabs = [ 
				{ title: '老虎机投注规则' },
				{ title: '体育投注规则' }, 
        
        //充值  提款 转帐
      ]; 
      
    return (
      <View style={{ flex: 1 }}> 
        
           <Flex> 
              <Flex.Item alignItems='center' style={styles.submitButton}>
                   <Image resizeMode='stretch' source={ require('../images/icon_lib_-.png')}  style={{width:30,height:30}}  />
                   <Text style={styles.TextButton}>线上博彩规则与条件</Text>
              </Flex.Item>
          
              <Flex.Item alignItems='center' style={styles.submitButton2}>
                <Image resizeMode='stretch' source={ require('../images/github-logo.png')}  style={{width:85,height:28}}  />
                <Text style={styles.TextButton}>公司简介</Text>
             </Flex.Item>

          </Flex>

          <Tabs onChange={this.onTabClick}  tabs={tabs} renderTabBar={props => <Tabs.DefaultTabBar {...props} page={2} />} tabBarInactiveTextColor={'#b3b3b3'} tabBarActiveTextColor={'#00805a'} tabBarUnderlineStyle={{backgroundColor: '#00805a'}}>
			      

          

            <View style={{ flex: 1 }}>  
                <ScrollView> 

                 <Accordion
                    onChange={this.onChange}
                    style={styles.titleBox}
                    activeSections={this.state.activeSections}
                  >
                    <Accordion.Panel style={styles.buttonTitle} header="1. 大奖老虎机">
                       
                       <View style={styles.conterBg}> 
                         <Text lineHeight={40} style={styles.SconterText}>  
                         每把赌注的一小部分钱（视游戏而定）将会贡献去大奖奖池。 奖池里的奖金将会随机派发给玩家。 一旦奖池里的累积奖金被赢取，奖池里的奖金将回归于奖池种子金。  
                         </Text> 
                       </View>

                    </Accordion.Panel>

                    <Accordion.Panel style={styles.buttonTitle} header="2. 奖池种子金">
 
                       <View style={styles.conterBg}> 
                         <Text lineHeight={40} style={styles.SconterText}>  
                         奖池种子金为奖池里的基本奖金。 奖池种子金一般是贡献于游戏供应商， 除了 PT 老虎机某一些游戏是需要累积奖金赢家去贡献。 需要累积奖金赢家去贡献奖池种子金的游戏名单如下 ： 一夜奇遇， 海滨嘉年华， 船长的宝藏， 沙漠宝藏， 情圣博士， 翡翠公主， 终极足球， 惊异之林， 水果狂， 艺伎故事， 艺伎故事彩池游戏， 金色召集， 高速公路之王， 六福獸， 疯狂乐透， 魔幻吃角子老虎， 年年有余， 热紫， 金字塔女王， 沉默的武士彩池游戏， 银弹， 好运连胜， 泰寺， 爱之船和舞龙彩池游戏。
                         </Text> 
                       </View>

                    </Accordion.Panel>

                    <Accordion.Panel style={styles.buttonTitle} header="3. 优惠与返水">
 
                      <View style={styles.conterBg}> 
                         <Text lineHeight={40} style={styles.SconterText}>  
                         AG 真人娱乐里的老虎机所累计的流水并不符合申请任何的优惠。  
                         </Text> 
                       </View>

                    </Accordion.Panel>


                    <Accordion.Panel style={styles.buttonTitle} header="4. 体验金/免费旋转">
 
                    <View style={styles.conterBg}> 
                        <Text lineHeight={40} style={styles.SconterText}>  
                        新会员体验金或免费旋转领取后，在无存款的前提下，赢取500元以下（不包括500元），会员有不少于提款额的流水可以直接提款；赢取500元或以上，在满足最低提款金额前提下，会员需要至少一次与提款额相等的有效存款，且完成存款额两倍流水方可提款，最高可提款10,000元，超出金额竞博将会以该玩家的名义将相关奖金捐赠给慈善机构，玩家可向竞博索取捐款凭证。
                        </Text> 
                      </View>

                    </Accordion.Panel>
                    

                  </Accordion>
 
               </ScrollView>
            </View>
 
            <View style={{ flex: 1 }}>
                

            <ScrollView> 

                <Accordion
                  onChange={this.onChange}
                  style={styles.titleBox}
                  activeSections={this.state.activeSections}
                >
                  <Accordion.Panel style={styles.buttonTitle} header="一般投注规则与规定">
                      
                      <View style={styles.conterBg}> 
                        <Text lineHeight style={styles.SconterText}>  
                        1.总则{'\n'}{'\n'}
                          1.1.本公司的所有投注信息都是出于诚意提供的。 不过，本公司不对有关日期、时间、地点、竞争对手、赔率、结果、统计数据、团队制服（显示在实时视频中）或其它投注信息的任何错误或遗漏负责。 本公司保留纠正任何明显错误的权利，并且应当采取所有合理行动确保以诚信透明的方式管理赌盘，赌盘定义为针对某一体育赛事所提供的不同的投注类型。 公司保留做出最终性决定的权利。
                          {'\n'}{'\n'}
                          1.2.如果一项赛事在预定时间之前开始，则只有该项赛事开始之前所做投注（除指定的现场投注以外）会被视为有效投注，赛事的定义是两个团队或个人间有组织的体育比赛或活动。 如果一个赌盘未在正确时间关闭或中止，则本公司有权取消在实际开始时间之后进行的所有投注（除指定的现场投注以外）。
                          {'\n'}{'\n'}
                          1.3.如果网站对赛事所用的英语和非英语名称之间有任何差异，以英语版本为准。
                          {'\n'}{'\n'}
                          1.4.在任何时候，客户有责任了解比赛分数和所有相关的比赛信息，并且建议客户在下注之前确认比赛状况。
                          {'\n'}{'\n'}
                          1.5.本公司有权在任何时候出于任何原因修改这些规则。 一旦在网站上发布，任何此类修改都是具有约束性和立即生效的。
                          {'\n'}{'\n'}
                          1.6.客户承认网站上提供的当前分数、所用时间及其它数据虽然是由第三方以“直播”形式提供，但仍会有时间延迟以及/或者可能不准确的情况，并且根据这些数据做任何投注时，客户应自行承担所有风险。 本公司提供这些数据时，不保证其准确性、完整性或及时性，并且不对客户因依赖这些数据而遭受的任何损失（直接或间接损失）负责。
                          {'\n'}{'\n'}
                          1.7.在出现以下任何情形时，本公司可全权在不提前通知的前提下决定取消或宣布投注无效或暂停用户帐号：
                          {'\n'}{'\n'}
                          • 投注细节不完整或错误；
                          {'\n'}
                          • 投注超出公司所规定的限额；
                          {'\n'}
                          • 以违反公司规则方式投注；
                          {'\n'}
                          • 人为的打字及传输错误导致不正确的游戏数据或概率；
                          {'\n'}
                          • 当出现异常或不规范使用游戏平台的情况，或出现过高的损失或收益。
                          {'\n'}{'\n'}

                          1.8.本公司保留暂停比赛游戏或特定产品的权利，以纠正任何明显错误，维持该游戏的诚信和公平性。
                          {'\n'}{'\n'}
                          1.9.一旦公司确认赌注，则客户不能修改或取消该赌注。
                          {'\n'}{'\n'}
                          1.10.如果客户存有任何疑问或怀疑系统错误，则建议客户停止游戏，并与本公司的客户支持部门相协调。如果客户继续游戏，该客户应对其赌注的结果负责，且公司有权决定是否解决这一问题。
                          {'\n'}{'\n'}
                          1.11.当开始现场比赛或游戏，且客户在其活动进行时予以投注，如果由于任何原因导致赌注断开的，不管断开的原因如何，或出现赌注冻结或崩溃，都将停止所有赌注，直到该活动完成并已知结果时才能进行结算。该一般规则不适用于某一游戏或产品拥有发生断开意外时具体规则的情形，适用该具体规则时的结果应以该规则对客户的约束力为基础。
                          {'\n'}{'\n'}
                          1.12.本公司保留暂停和/或随时关闭客户账户的权利，如果公司认为客户违反任何适用的规则和规章，或欺骗、黑客入侵、攻击、操纵或破坏了正常的投注程序，或如果该客户从事洗钱或其他非法活动，或者该客户低于其所在管辖区或实际区域参与赌博的法定年龄。一旦由于上述原因关闭客户帐户，包括客户账户余额在内的所有奖金和/或支出都将没收。
                          {'\n'}{'\n'}
                          1.13.本公司保留为其现有产品和即将提供的产品设置最大奖金额的权利。
                          {'\n'}{'\n'}
                          1.14.如果公司有证据表明价格或联营的操纵，或比赛、活动或竞赛中的作弊行为，则公司保留拒绝付款的权利。上述证据以所有投注渠道的投注大小、容量或模式为基础。如上述规则解释存有任何争议，以公司解释为准。
                          {'\n'}{'\n'}
                          1.15.本公司保留作废并取消涉及非法赌博活动的所有投注的权利。
                          {'\n'}{'\n'}
                          1.16.本公司保留拒绝客户进入游戏或将客户踢出游戏的权利。
                          {'\n'}{'\n'}
                          1.17.该软件不存在任何明示或暗示、法定或公司其他方面规定的保证、条件、承诺或声明。本公司不出于任何目的保证该软件适销性、质量及适合性，且不保证该软件能够满足客户的要求，不保证软件不会构成侵权。
                          {'\n'}{'\n'}
                          1.18.虽然公司承诺会合理且谨慎行事，公司并不保证该软件不会出现任何错误或中断，不保证会修正软件内的任何错误，也不保证软件或服务器无病毒。
                          {'\n'}{'\n'}
                          1.19.本公司对因账户结算相关的通信或系统错误造成的所有成本、费用、损失或索赔概不负责。本公司保留采取任何适当的措施，包括删除所有相关游戏软件以纠正此类错误的权利。
                          {'\n'}{'\n'}
                          1.20.当下注或使用该软件时，客户承认公司无法控制客户如何使用该软件。此外，客户应承担其下注及使用软件的所有风险，且公司对任何直接、间接、附加、偶然的或特殊的任何形式的伤害或损失概不负责。
                          {'\n'}{'\n'}
                          1.21.禁止客户披露软件内属于公司或软件供应商的任何机密信息。
                          {'\n'}{'\n'}
                          1.22.为进行游戏或投注，授予客户个人的、非排他的、不可转让的使用该软件的权利。
                          {'\n'}{'\n'}
                          1.23.禁止客户：
                          {'\n'}{'\n'}
                          1.23.1.将软件安装或加载至另一个设备的服务器上，或采取措施使其他人可在网络上获取该软件。
                          {'\n'}{'\n'}
                          1.23.2.再许可、转让、出租、出借、转移、复制或分发本软件的副本；
                          {'\n'}{'\n'}
                          1.23.3.以该软件、该软件或复制品的任何部分为基础，解码、还原工程、反汇编、修改或创造衍生软件，或适应性转录或合并软件的任何部分，转换软件或软件的任何部分或企图破解本软件的源代码；
                          {'\n'}{'\n'}
                          1.23.4.删除软件供应商的任何版权、专利或类似通知；和
                          {'\n'}{'\n'}
                          1.23.5.进入、访问，或试图进入、访问或以其他方式进入公司安全系统或以任何方式干扰软件、游戏和网站。
                          {'\n'}{'\n'}
                          1.24.使用该软件并不授予客户该软件任何知识产权的所有权。
                          {'\n'}{'\n'}
                          1.25.以上一般规则应仅使用于特殊游戏或产品缺乏特殊规则的情况。
                          {'\n'}{'\n'}
                          2.中止和延期
                          {'\n'}{'\n'}
                          2.1.如果一项赛事未在预定开始日期开始，并且未按特定体育规则的规定，在原先预定的完成日期完成，则所有的投注都将无效，除了对已获得无条件确定的赌盘所做的投注以外。
                          {'\n'}{'\n'}
                          2.2.如果一项赛事已经开始，但之后又中止，并且未按特定体育规则的规定，在原先预定的完成日期完成，则所有的投注都将无效，除了对无条件决定结果的赌盘所做的投注以外。
                          {'\n'}{'\n'}
                          2.3.如果一项赛事未按特定体育规则的规定，在原告预定的完成日期完成，而正式的比赛结果得以宣布，或者特定赛事的相关主管机构宣布了一个结果，则本公司有权认定这一比赛是正式有效的。 在此方面，本公司的决定是最终和具有结束性的。
                          {'\n'}{'\n'}
                          3.场地变更
                          {'\n'}{'\n'}
                          3.1.除非另有说明，如果一项比赛预计在一个中立性场地上展开，但却在非中立的场地上展开，所有的投注仍将被视为有效，反之亦然。如果主场团队打客场团队的场地变更，反之亦然，对该场比赛的所有投注都将被视为无效。如果主场和客场团队的名称被错误地颠倒，投注也会被视为无效。
                          {'\n'}{'\n'}
                          3.2.对于所有非团队赛事，如果预定的场地在赌盘开放后变更，则所有的投注仍将被视为有效。
                          {'\n'}{'\n'}
                          4.赛事期间
                          {'\n'}{'\n'}
                          4.1.所显示的赛事进行时间仅供于参考。尽管赛事进行时间和所显示的有所差异，投注仍有可能被视为有效。
                          {'\n'}{'\n'}
                          4.2.在比赛伤停时间发生的任何情况都被视为在常规时间末时发生，例如一场足球比赛上半场伤停补时阶段的一个进球会被视为是在第45分钟时踢进的。
                          {'\n'}{'\n'}
                          5.赛果
                          {'\n'}{'\n'}
                          5.1.必要时，颁奖仪式的位次将被视为是正式赛果，不论之后是否出现取消或更改赛果的情况。 如果没有颁奖仪式，赛果将会依据相关主管机构在赌盘结算时提供的官方结果而定，不论之后是否出现取消或更改赛果的情况。 如果没有提供适用的官方结果，则将依据到赌盘结算时适用且已知的证据来确定赛果。
                          {'\n'}{'\n'}
                          5.2.赌盘通常会在一项赛事结束后不久进行结算。 完全出于服务客户的目的，一些赌盘可能会在正式结果公布之前结算。 如果一个赌盘结算错误，本公司有权撤销结算。
                          {'\n'}{'\n'}
                          5.3.如果无法确定赛事结果，公司保留暂停任何赌盘结算的权利。
                          {'\n'}{'\n'}
                          5.4.除了不存在的赛事以外，公司将不会因任何赛事结果，球队名称或该赛事任何细节上的修改而对已结算72小时的投注项目作出更改。
                          {'\n'}{'\n'}
                          5.5.当官方赛果与本公司网站赛果版块公布的赛果之间有冲突时，应当通过参考本公司的有关赛事视频记录来确定正确的结果，以便解决冲突。 然而，如果没有此类适用的视频记录，应当根据特定赛事的相关主管机构在其官方网站上公布的赛果确定正确的结果。 如果该官方网站无法提供这一结果或者官方网站公布的赛果明显有错，则本公司有权做出决定/修正，以便确定最终的结果。 在此方面，本公司的决定是最终和具有结束性的。
                          {'\n'}{'\n'}
                          5.6无论任何的项目在结束后出现后续的决定更改、抗议或上诉而引致的成绩变动，项目的获胜者将就根据项目结束时的成绩来确定投注的胜负。
                          {'\n'}{'\n'}
                          6.自动计时器接受功能
                          {'\n'}{'\n'}
                          6.1.对于某些可由本公司确定的赛事，客户可以利用计时器接受功能进行投注，选择菜单上的“计时器接受”按钮即可。 利用计时器接受功能所做的每次投注将有自己的倒计时，其持续时间将由本公司独家决定。 在计时器倒数完毕时，若没有下文1.6.2节所述任何妨害的情况出现，投注将会被接受。
                          {'\n'}{'\n'}
                          6.2.如果在计时器倒数结束前发生任何本节所述的妨害情况，所有使用计时器接受功能所做投注都将立即被取消；
                          {'\n'}{'\n'}
                          6.2.1.如果很可能或确实领得一张红牌；
                          {'\n'}{'\n'}
                          6.2.2.如果可能或确实被判罚一个点球；
                          {'\n'}{'\n'}
                          6.2.3.如果任何球队可能入球或取得入球；
                          {'\n'}{'\n'}
                          6.2.4.偶发事件包括但不限于，影响正确地下注、接受投注、记录或通告投注的任何设备或通讯中断，操作或传输延误或中断，通讯线路故障等。
                          {'\n'}{'\n'}
                          6.3.在使用计时器接受功能时，客户承认本网站上提供的当前分数、所用时间及其它数据虽然是由第三方以直播形式提供，但仍会有时间延迟以及/或者可能不准确的情况，并且根据这些数据做任何投注时，客户应自行承担所有风险。 本公司提供这些数据，并且不对客户因依赖这些数据而遭受的任何损失（直接或间接损失）负责。
                          {'\n'}{'\n'}
                          7.即时兑现
                          {'\n'}{'\n'}
                          7.1.即时兑现在选定赛事或赛程的结果确定之前让客户可以选择出售其全部或部分注单。
                          {'\n'}{'\n'}
                          7.2.即时兑现仅适用于在线（「直播」）投注赛事、赛程或具有即时兑现图标的赌盘。即时兑现不适用于混合过关、其他多投注选项以及使用免费投注的注单。
                          {'\n'}{'\n'}
                          7.3.只要注单的剩余金额不等于或低于原始投注金额的 20％，便可以出售一部分注单。最低的部分即时兑现金额至少为注单原始投注金额的 20％。
                          {'\n'}{'\n'}
                          7.4.实时赔率决定了即时兑现的金额。如果兑现时, 即时兑现金额改变或是赌盘被暂停，客户可能无法即时兑现成功。客户可以重试直到系统成功接受即时兑现。
                          {'\n'}{'\n'}
                          7.5.如果系统成功接受了该注单的即时兑现，客户则无法取消兑现交易。已即时兑现的注单金额将计入客户余额中，并且不会受到投注赛事、赛程或赌盘的官方结果影响。
                          {'\n'}{'\n'}
                          7.6.如果赛事赌盘结算错误或公司认为撤销结算合理必要，公司保留撤销已即时兑现注单的权利。如撤销结算，客户已收到该注单的即时兑现金额将从其账户余额中扣除，且注单将保持原始投注金额或是当时进行部分即时兑现的剩余价值。
                          {'\n'}{'\n'}
                          7.7.如果选定赛事或赛程被取消而注单已即时兑现，除了无条件决定投注结果的注单外，注单的即时兑现将被撤回。注单即时兑现的金额将从客户的帐户中扣除，且原始投注金额将退还给客户。
                          {'\n'}{'\n'}
                          7.8.注单即时兑现的金额将在合理的时间内计入客户的帐户。
                          {'\n'}{'\n'}
                          7.9.公司保留权利并有绝对决定权以接受或拒绝使用即时兑现、在某些赛事、赛程或赌盘上提供即时兑现的功能，以及在其认为必要时修改、暂停或删除即时兑现的功能。
                          {'\n'}{'\n'}
                          7.10.客户明白公司对于由于技术错误而引致无法使用即时兑现的功能概不负责。
                          {'\n'}{'\n'}
                          7.11.客户明白即时兑现是第三方提供的产品。对于透过即时兑现出售的注单的结算和客户因使用即时兑现而产生的所有其他索赔，第三方须承担最终责任。公司对客户使用即时兑现而遭受的直接或间接损失不承担任何责任。
                          {'\n'}{'\n'}
                          7.12.即时兑现功能不适用于已利用或使用公司提供红利的客户，除非客户已符合及满足针对该红利的条款和条件。选择使用即时兑现功能的客户可要求客户服务部收回红利，以使用即时兑现功能。公司拥有最终决定是否允许收回红利并使用即时兑现的功能。
                          {'\n'} {'\n'}
                          8.混合过关最高派彩 {'\n'}
                          8.1.串彩（Mix Parlay）下注的最高彩金限额如下： {'\n'}
                          足球：80,000美元 {'\n'}
                          NBA篮球：53,000美元 {'\n'}
                          网球：27,000美元 {'\n'}
                          其他赛事：13,000美元 {'\n'}{'\n'}

                          如下注的串彩中赛事的最高彩金限额存在差异，则以最高限额中最低一个的为准。
                          {'\n'}{'\n'}
                          8.2.所有最高派彩限额也针对任何群组客户，或一个组织团体/集团投注予相同的混合过关组合，包括通过不同的帐号下注予相同系列组合，以及同一范围里的价位。
                          {'\n'}{'\n'}
                          8.3.若本公司有任何理由认为该投注已抵触以上条列，所有有关该组合的总派彩金将会被限制为单一最高派彩。而这单一派彩金将会计算予优先投注该组合的客户。
                          {'\n'}{'\n'}
                          8.4.最高派彩限额将以美元作标准。如果以其他货币进行投注，派彩额将使用当天适当的货币兑换率来进行转换。
                        </Text> 
                      </View>

                  </Accordion.Panel>

                  <Accordion.Panel style={styles.buttonTitle} header="赌盘（投注类型）规则之一般规则">

                       <View style={styles.conterBg}> 
                        <Text lineHeight={40} style={styles.SconterText}>    
                        球队组积分 {'\n'}{'\n'}
                        表示投注在一轮小组赛结束时一支球队的积分所属的准确类别，“小盘”、“中间盘”和“大盘”。 {'\n'}{'\n'}

                        示例: {'\n'}{'\n'}
                        球队X的总积分为5分 {'\n'}{'\n'}

                        如果投注为： {'\n'} 
                        小盘低于3分 – 输: {'\n'} 
                        中间盘3-4分 – 输: {'\n'} 
                        大盘4分以上 – 赢 {'\n'} 
                        {'\n'}  {'\n'} 
                        小组顺序科卡士
                        表示投注预测在小组赛阶段结束时，在各自的小组排名中以特定顺序排列，位于第一和第二的球队。
                        受伤补时大/小盘
                        上半场结束时的受伤补时大/小盘：
                        上半场受伤补时大/小盘表示对上半场结束时受伤补时的大/小盘投注。
                        如果总补时数超过大/小盘的基线补时数，则投注大盘者为赢家；如果总补时数少于大/小盘的基线补时数，则投注小盘者为赢家。
                        投注以由第四裁判员在完整45分钟比赛以后或上半场末时所判给的受伤补时为准进行结算。
                        下半场结束时的受伤补时大/小盘：
                        下半场受伤补时大/小盘表示对下半场结束时受伤补时的大/小盘投注。
                        如果总补时数超过大/小盘的基线补时数，则投注大盘者为赢家；如果总补时数少于大/小盘的基线补时数，则投注小盘者为赢家。
                        投注以由第四裁判员在完整90分钟比赛以后或下半场末时所判给的受伤补时为准进行结算。
                        第一个进球方式
                        表示预测一场比赛中任一球队第一个进球的方式。
                        任意球 - 进球必须是直接通过任意球实现的进球。 如果任意球的开出者被判进球，则应算做弹射进门。 同时包括由一个角球直接获得的进球。
                        点球 - 进球必须是直接由点球获得的进球，并在点球开出者被称为得分球员时。
                        乌龙球 – 如果进球被视为乌龙球而宣布。
                        头球 – 进球队员最后接触球的部分必须为头部。
                        射门 – 上述未含的所有其它进球类型。
                        无进球
                        本公司将根据由负责组织此次比赛的足球主办单位提供的官方结果结算投注。
                        除投注已清算外，如发生弃赛的情况，则该投注为无效。
                        点球大战 – 点球是否会得分？
                        表示投注预测在点球大战中一名指定的开球员是否会得分或错失良机。
                        如果未进行点球大战，则所有投注将被视作无效。
                        双重科卡士
                        双重科卡士表示投注预测在比赛结束时，不论以何种顺序，哪两（2）支球队会位居前两名。
                        顺序科卡士
                        顺序科卡士表示投注预测在比赛结束时，以准确的顺序，哪两（2）支球队会位居前两名。
                        最佳新队
                        最佳新人表示预测哪支球队会是一场赛事或比赛的最佳新队。 一支“新队”指一支新近加入一场赛事或比赛的球队。
                        地区赢家
                        地区赢家表示预测一个地区赛事或比赛的获胜方。

                        所有结果依据比赛结束时由主办单位宣布的官方结果而定。

                        主队不赌
                        预测一场比赛是平局还是客队赢。如果常规比赛时间后或预定时间末时，最终结果为主队赢，则所有投注都会被退款。
                        客队不赌
                        预测一场比赛是平局还是主队赢。如果常规比赛时间后或预定时间末时，最终结果为客队赢，则所有投注都会被退款。
                        平局/非平局
                        预测常规比赛时间后或预定时间末时的最终结果是否为平局还是非平局。
                        上半场波胆和下半场波胆
                        上半场波胆是指投注预测在上半场比赛时间结束后的最后比分。
                        下半场波胆是指投注预测该赛事在下半场的比分。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        赛果 / 总进球(总入球)
                        赛果 / 总进球(总入球)是指准确地投注预测全场赛果是主队赢，客队赢或和局；以及总进球数(总入球数)在特定的球数是大或小。
                        六种投注选项为：
                        • 主队&大 ： 主队赢以及总进球(总入球)大过特定球数
                        • 主队&小 ： 主队赢以及总进球(总入球)小过特定球数
                        • 和局&大 ： 和局以及总进球(总入球)大过特定球数
                        • 和局&小 ： 和局以及总进球(总入球)小过特定球数
                        • 客队&大 ： 客队赢以及总进球(总入球)大过特定球数
                        • 客队&小 ： 客队赢以及总进球(总入球)小过特定球数
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        球队反败为胜
                        球队反败为胜表示预测一支在比赛中任何时候输球的球队最终反败为胜，并在90分钟结束时赢得比赛。
                        第一射脚
                        “第一射脚”是指投注预测在赛事中第一个进球的球员。
                        对未参赛球员或仅在第一个进球后才作为替补上场的球员的投注将视为无效并退还。
                        乌龙球将不计算为第一个进球。在这种情况下，下个进球的球员将视为“第一射脚”。
                        如果赛事中没有球员进球，则投注"无进球"者将赢。如果乌龙球是赛事中唯一的进球，则投注"无进球"者将赢。
                        投注于第一个进球前被替补或离场的球员将输。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        最先进球的球队和最后进球的球队
                        最先进球的球队是指投注预测哪个球队会在赛事中最先进球。
                        最后进球的球队是指投注预测哪个球队会在赛事中最后进球。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        最先进两个球的球队和最先进三个球的球队
                        最先进两个球的球队是指投注预测哪个球队会在赛事中率先攻进两个球。
                        最先进三个球的球队是指投注预测哪个球队会在赛事中率先攻进三个球。
                        投注选项包括：
                        • 主队
                        • 客队
                        • 两队皆不
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        预测第一个进球时段
                        是指投注预测第一个进球在哪个时段发生。
                        第一个进球时段（10分钟）是指投注预测第一个进球在哪个10分钟时段发生。
                        第一个进球时段（15分钟）是指投注预测第一个进球在哪个15分钟时段发生。
                        乌龙球将计算为特定时间的第一个进球。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        会产生第一个进球的半场
                        表示投注预测哪个半场会产生第一个进球。
                        下列投注选项可供选择：
                        • 上半场
                        • 下半场
                        • 无进球
                        如果一场比赛在上半场第一个进球产生之后中止，则所有投注都将有效。
                        如果一场比赛在第一个进球产生之前的任何时间中止，则所有投注都将无效。
                        两队皆进球/赛果和上半场两队皆进球/赛果
                        两队得分/结果表示投注预测：
                        一场比赛是否会导致两队皆得分，以及
                        一场比赛是主队赢、客队赢还是平局。
                        下列投注选项可供选择：
                        • 是的以及主队赢 – 如果两队皆进球且主队赢，则此投注赢。
                        • 是的以及客队赢 – 如果两队皆进球且客队赢，则此投注赢。
                        • 是的以及平局 – 如果两队皆进球且比赛结果为平局，则此投注赢。
                        上半场两队皆进球/赛果是指投注预测赛事的上半场赛果以及两队是否都在上半场皆有进球。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        比赛半场/全场单双盘(O/E)
                        比赛半场/全场单双盘(O/E)是指投注预测半场结果和全场结果中的赛事是单单盘，单双盘，双单盘或双双盘。
                        共四种投注选项:
                        • 单/单
                        • 单/双
                        • 双/单
                        • 双/双
                        比赛中的任何额外加时赛将不被计算在此投注类型的全场比分结果中。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        赛果/最先进球的球队
                        赛果/最先进球的球队是指投注预测哪个球队会在赛事中最先进球和预测三种可能的胜利结果中的任何一种。
                        如果赛事中止，除非投注结算已可被确认，否则投注将视为无效。
                        主队进第一个球的半场
                        表示投注预测主队在哪个半场会产生第一个进球。
                        下列选项可供选择：
                        *上半场
                        *下半场
                        *无进球
                        除投注已清算外，如发生弃赛的情况，则该投注为无效。
                        客队进第一个球的半场
                        表示投注预测客队在哪个半场会产生第一个进球。
                        下列选项可供选择：
                        *上半场
                        *下半场
                        *无进球
                        除投注已清算外，如发生弃赛的情况，则该投注为无效。
                        特定15分钟让分盘（HDP）
                        特定15分钟让分盘表示投注预测参赛者或队伍什么时候会获得假定的预先让分。获胜者为一场比赛内每15分钟（间隔时间）末时的赛果加上假定的让分后成绩较高的参赛者或队伍。
                        例如：
                        15分钟HDP
                        00:00 – 15:00 HDP：胜方为.00:00到15:00时成绩较高的参赛者或队伍。
                        所有投注必须在此15分钟之前或末尾时做出。

                        30分钟HDP
                        15:01 – 30:00 HDP：胜方为. 15:01到30:00时成绩较高的参赛者或队伍。
                        所有投注必须在此30分钟之前或末尾时做出。

                        45分钟HDP
                        30:01- 45:00 HDP：胜方为30:01到45:00时成绩较高的参赛者或队伍。
                        所有投注必须在此45分钟之前或末尾时做出。

                        60分钟HDP
                        45:01 – 60:00 HDP：胜方为45:01到60:00时成绩较高的参赛者或队伍。
                        所有投注必须在此60分钟之前或末尾时做出。

                        75分钟HDP
                        60:01 – 75:00HDP：胜方为60:01到75:00时成绩较高的参赛者或队伍。
                        所有投注必须在此75分钟之前或末尾时做出。

                        90分钟HDP
                        75:01 – 90:00 HDP：胜方为75:01到90:00时成绩较高的参赛者或队伍。
                        所有投注必须在此90分钟之前或末尾时做出。
                        对于特定15分钟让分盘来说，投注以现场直播公布的时间显示为准，将根据准确的进球时间（球越过龙门线）、角球数（开出角球）以及总罚牌数（裁判员发出的罚牌）进行结算。
                        如果一场比赛暂停或中止，对于投注于未完成的特定15分钟让分盘将被视为无效。 如果指定的特定15分钟让分盘已经完成，则投注有效。
                        对于任何特定15分钟让分盘现场投注的最后两（2）分钟，除本条下述操作以外，任何行为都将被视为安全比赛，因此任何待定的投注都会被接受：进球、罚点球和领红牌。
                        对于30:01-45:00和75:01 - 90:00来说，投注以现场直播公布的时间显示为准，将根据准确的进球时间（球越过龙门线）、角球数（开出角球）以及总罚牌数（裁判员发出的罚牌）进行结算，除了任何额外的时间或伤停补时以外。
                                              
                        </Text> 
                      </View>

                  </Accordion.Panel>

                  <Accordion.Panel style={styles.buttonTitle} header="特定赛事投注规则">

                    <View style={styles.conterBg}> 
                        <Text lineHeight={40} style={styles.SconterText}>  
                        AG 真人娱乐里的老虎机所累计的流水并不符合申请任何的优惠。  
                        </Text> 
                      </View>

                  </Accordion.Panel>


                  <Accordion.Panel style={styles.buttonTitle} header="虚拟运动规则">

                  <View style={styles.conterBg}> 
                      <Text lineHeight={40} style={styles.SconterText}>  
                      新会员体验金或免费旋转领取后，在无存款的前提下，赢取500元以下（不包括500元），会员有不少于提款额的流水可以直接提款；赢取500元或以上，在满足最低提款金额前提下，会员需要至少一次与提款额相等的有效存款，且完成存款额两倍流水方可提款，最高可提款10,000元，超出金额竞博将会以该玩家的名义将相关奖金捐赠给慈善机构，玩家可向竞博索取捐款凭证。
                      </Text> 
                    </View>

                  </Accordion.Panel>
                  

                </Accordion>

                </ScrollView>

              
            </View>
            

          </Tabs>
 
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile.profile
  }
};

const mapDispatchToProps = (dispatch) => ({
  updateProfile: (profileDetails) => {
    dispatch(updateProfile(profileDetails))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles=StyleSheet.create({
   
  input: {
    margin: 15,
    height: 50,
    borderColor: '#7a42f4',
    borderWidth: 1
  },

  TextButton:{
    textAlign:'center',color:'#fff',fontWeight:'900',paddingTop:5
  },
  titleBox:{
     padding:10,
  },
  
  SconterText:{
    color:'#525252',
    fontSize:14,
    paddingRight:5,
  },
  conterBg:{
    backgroundColor: '#fff',
    paddingTop:10,
    paddingBottom:10, 
    paddingLeft:15, 
    borderColor: '#ececec',
    borderBottomWidth: 1
  },

  buttonTitle:{ 
    backgroundColor: '#fff',
    paddingTop:5,
    paddingBottom:5, 
    marginTop:5,
  },
  conterText:{
     color:'#000'
  },

  submitButton: {
    backgroundColor: '#2d6b48',
    flex:0.5,
    paddingTop:5,
    paddingBottom:5,
  },

  submitButton2: {
    backgroundColor: '#2d6b48',
    flex:0.5,
    paddingTop:5,
    paddingBottom:5,
    borderLeftWidth: 1,
    borderColor: '#f0f0f0'
  },


 
});