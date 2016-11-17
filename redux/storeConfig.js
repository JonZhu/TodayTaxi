import { createStore, combineReducers } from 'redux';
import userinfo from './reducer/userinfo';
import maintab from './reducer/maintab';

function storeConfig() {
    return createStore(combineReducers({
        userinfo,
        maintab
    }));
}

export default storeConfig;