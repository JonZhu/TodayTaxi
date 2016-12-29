import { createStore, combineReducers } from 'redux';
import userinfo from './reducer/userinfo';
import maintab from './reducer/maintab';
import sideBar from './reducer/sideBar';
import callTaxi from './reducer/callTaxi';

function storeConfig() {
    return createStore(combineReducers({
        userinfo,
        maintab,
        sideBar,
        callTaxi
    }));
}

export default storeConfig;