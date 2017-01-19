/**
 * 选择目标地址页面 redux容器
 * @author zhujun
 * @date 2017-1-19
 */

import { connect } from 'react-redux';
import ChoiceGo from '../../component/calltaxi/ChoiceGo';
import MapModule from '../../native/MapModule';

function mapStateToProps(state) {
    return {searchResult: state.callTaxi.goAddrSearchResult};
}

function mapDispatchToProps(dispatch) {
    return {
        keywordOnChange: function(keyword) {
            searchKeywordInCity(dispatch, keyword);
        }
    };
}

async function searchKeywordInCity(dispatch, keyword) {
    var resultArray = await MapModule.searchInCity('成都', keyword, 20);
    dispatch({type:'goAddrSearchChanged', searchResult: resultArray});
}

const ChoiceGoContainer = connect(mapStateToProps, mapDispatchToProps)(ChoiceGo);
export default ChoiceGoContainer;