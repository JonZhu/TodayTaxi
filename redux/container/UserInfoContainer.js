import { connect } from 'react-redux';
import UserInfo from '../../component/UserInfo';

function mapStateToProps(state) {
    return {
        user: state.userinfo
    }
}

const UserInfoContainer = connect(mapStateToProps)(UserInfo);

export default UserInfoContainer;