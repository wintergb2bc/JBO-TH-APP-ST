import { combineReducers } from 'redux';

import UserInfoReducer from './UserInfoReducer';
import UserBetReducer from './BetReducer';
import MaintainStatus from './MaintainStatusReducer';
import RouterLogReducer from "./RouterLogReducer";
import UserSettingReducer from "./UserSettingReducer";

const RootReducer = combineReducers({
	userInfo: UserInfoReducer,
	userSetting: UserSettingReducer,
	BetInfo: UserBetReducer,
	maintainStatus: MaintainStatus,
	routerLog: RouterLogReducer,
});

export default RootReducer;
