/**
 * CallTaxi redux容器
 * @date 2016-11-28
 */

import { connect } from 'react-redux';
import CallTaxi from '../../component/calltaxi/CallTaxi';

function mapStateToProps(state) {
    return {
        sideBar: state.sideBar
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toggleSideBar: () => {
            dispatch({type: 'toggleSideBar'});
        }
    }
}

const CallTaxiContainer = connect(mapStateToProps, mapDispatchToProps)(CallTaxi);

export default CallTaxiContainer;