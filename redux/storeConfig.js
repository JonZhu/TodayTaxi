import { createStore, combineReducers } from 'redux';
import userinfo from './reducer/userinfo';
import maintab from './reducer/maintab';
import sideBar from './reducer/sideBar';

function storeConfig() {
    return createStore(combineReducers({
        userinfo,
        maintab,
        sideBar
    }));
}

export default storeConfig;