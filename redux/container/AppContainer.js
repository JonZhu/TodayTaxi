import { connect } from 'react-redux';
import App from '../../component/App';


function mapStateToProps(state) {
    return {selectedTab: state.maintab};
}

function mapDispatchToProps(dispatch) {
    return {
        changeTab: (newTab) => {
            dispatch({
                type: 'changeMainTab',
                newTab
            });
        }
    };
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;