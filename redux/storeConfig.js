import { createStore, combineReducers } from 'redux';
import userinfo from './reducer/userinfo';
import sideBar from './reducer/sideBar';
import callTaxi from './reducer/callTaxi';

function storeConfig() {
    return createStore(combineReducers({
        userinfo,
        sideBar,
        callTaxi
    }));
}

const store = storeConfig();
export default store;