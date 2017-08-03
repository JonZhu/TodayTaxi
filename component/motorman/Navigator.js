/**
 * 司机端 导航器
 * 
 * @author zhujun
 * @date 2017-08-03
 */

import { StackNavigator } from 'react-navigation';
import Motoman from './Motorman';
import RouteList from './RouteList';
import RouteInfo from './RouteInfo';

const Navigator = new StackNavigator({
    Motoman: {screen: Motoman},
    RouteList: {screen: RouteList},
    RouteInfo: {screen: RouteInfo}
}, {
    initialRouteName: 'Motoman',
    headerMode: 'none'
});

export default Navigator;