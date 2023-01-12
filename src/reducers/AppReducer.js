import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import ProfileReducer from './ProfileReducer';
import SceneReducer from './SceneReducer';
import vipInforData from './VipInforReducer'
import GameReducer from './GameReducer';
import UserInfoReducer from '$LIB/redux/reducers/UserInfoReducer';
import UserBetReducer from '$LIB/redux/reducers/BetReducer';
import MaintainStatus from '$LIB/redux/reducers/MaintainStatusReducer';
import RouterLogReducer from "$LIB/redux/reducers/RouterLogReducer";
import UserSettingReducer from "$LIB/redux/reducers/UserSettingReducer";

const AppReducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
  scene: SceneReducer,
  vipInforData: vipInforData,
  GameReducer,
  userInfo: UserInfoReducer,
  BetInfo: UserBetReducer,
  maintainStatus: MaintainStatus,
  routerLog: RouterLogReducer,
  userSetting: UserSettingReducer,
});

export default AppReducer;
