/**
 * CallTaxi redux容器
 * @date 2016-11-28
 */

import { connect } from 'react-redux';
import CallTaxi from '../../component/calltaxi/CallTaxi';
import MapModule from '../../native/MapModule';

function mapStateToProps(state) {
    return {
        sideBar: state.sideBar,
        callTaxi: state.callTaxi
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleSideBar: () => {
            dispatch({type: 'toggleSideBar'});
        },
        mapStatusChange: (event) => {
            // 反向geo解析当前坐标
            var target = event.target;
            reverseGeoCode(dispatch, target.lng, target.lat);
        }
    }
}

async function reverseGeoCode(dispatch, lng, lat) {
    try {
        var address = await MapModule.reverseGeoCode(lng, lat);
        console.info(address);
        dispatch({type:'reverseGeoCodeResult', address:address});
    } catch (e) {
        // 出错
        console.error(e);
    }
}

const CallTaxiContainer = connect(mapStateToProps, mapDispatchToProps)(CallTaxi);

export default CallTaxiContainer;