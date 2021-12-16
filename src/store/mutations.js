import storage from '../utils/storage';

export default {
	saveUserInfo(state, userInfo) {
		state.userInfo = userInfo;
		storage.setItem('userInfo', userInfo);
	},
	saveActionList(state, list) {
		state.actionList = list;
		storage.setItem('actionList', list);
	},
	saveNoticeCount(state, count) {
		state.noticeCount = count;
	}
};
