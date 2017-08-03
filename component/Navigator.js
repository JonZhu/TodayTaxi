/**
 * 全局 导航器
 * 
 * @author zhujun
 * @date 2017-08-03
 */

import { StackNavigator } from 'react-navigation';
import MotomanNavigator from './motorman/Navigator';
import PassengerNavigator from './passenger/Navigator';
import BootPage from './BootPage';
import Login from './Login';
import SignIn from './SignIn';
import Help from './Help';

const Navigator = new StackNavigator({
    BootPage: {screen: BootPage},
    Motoman: {screen: MotomanNavigator},
    Passenger: {screen: PassengerNavigator},
    Login: {screen: Login},
    SignIn: {screen: SignIn},
    Help: {screen: Help}
}, {
    initialRouteName: 'BootPage',
    headerMode: 'none'
});

export default Navigator;