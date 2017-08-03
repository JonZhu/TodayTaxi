/**
 * 乘客端 导航器
 * 
 * @author zhujun
 * @date 2017-08-03
 */

import { StackNavigator } from 'react-navigation';
import CallTaxi from '../../redux/container/CallTaxiContainer';
import RouteList from './RouteList';
import RouteInfo from './RouteInfo';
import RegistMotorman from './RegistMotorman';
import ChoiceGo from '../../redux/container/ChoiceGoContainer';

const Navigator = new StackNavigator({
    CallTaxi: {screen: CallTaxi},
    RouteList: {screen: RouteList},
    RouteInfo: {screen: RouteInfo},
    RegistMotorman: {screen: RegistMotorman},
    ChoiceGo: {screen: ChoiceGo},
}, {
    initialRouteName: 'CallTaxi',
    headerMode: 'none'
});

export default Navigator;