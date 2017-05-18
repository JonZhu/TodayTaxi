/**
 * 选择目标地址页面 redux容器
 * @author zhujun
 * @date 2017-1-19
 */

import { connect } from 'react-redux';
import ChoiceGo from '../../component/passenger/ChoiceGo';
import MapModule from '../../native/MapModule';

function mapStateToProps(state) {
    var callTaxi = state.callTaxi;
    var city  = callTaxi.from ? callTaxi.from.city : null;
    return {
        searchResult: callTaxi.goAddrSearchResult,
        city: city
    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchKeywordInCity: function(city, keyword) {
            searchKeywordInCity(dispatch, city, keyword);
        },
        searchAddrOnPress: function(goAddr) {
            dispatch({type:'goAddrChanged', goAddr});
        }
    };
}

async function searchKeywordInCity(dispatch, city, keyword) {
    var resultArray = await MapModule.searchInCity(city, keyword, 20);
    dispatch({type:'goAddrSearchChanged', searchResult: resultArray});
}

const ChoiceGoContainer = connect(mapStateToProps, mapDispatchToProps)(ChoiceGo);
export default ChoiceGoContainer;