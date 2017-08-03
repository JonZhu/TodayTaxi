/**
 * 全局 导航器
 * 
 * @author zhujun
 * @date 2017-08-03
 */

import { StackNavigator } from 'react-navigation';
import MotormanNavigator from './motorman/Navigator';
import PassengerNavigator from './passenger/Navigator';
import BootPage from './BootPage';
import Login from './Login';
import SignIn from './SignIn';
import Help from './Help';
import UserInfo from '../redux/container/UserInfoContainer';
import RecoverPassword from './RecoverPassword';

const Navigator = new StackNavigator({
    BootPage: {screen: BootPage},
    MotormanNavigator: {screen: MotormanNavigator},
    PassengerNavigator: {screen: PassengerNavigator},
    Login: {screen: Login},
    SignIn: {screen: SignIn},
    Help: {screen: Help},
    UserInfo: {screen: UserInfo},
    RecoverPassword: {screen: RecoverPassword},
}, {
    initialRouteName: 'BootPage',
    headerMode: 'none'
});

export default Navigator;