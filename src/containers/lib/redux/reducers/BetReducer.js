import { ACTION_BETINFO } from '../actions/BetAction';
console.log(ACTION_BETINFO);
export const initialState = {
	Propdactiveindex: 0
};

const BetReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_BETINFO: //更新數據
			//console.log('===userinfo update to : ', action.payload);
			return { ...state, ...action.text };
		default:
			return state;
	}
};

export default BetReducer;
