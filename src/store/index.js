import { createStore } from 'vuex';
import mutations from './mutations';
import storage from '../utils/storage';

const state = {
	noticeCount: 0,
	userInfo: storage.getItem('userInfo') || '',
	actionList: storage.getItem('actionList') || []
};

export default createStore({
	state,
	mutations
});
