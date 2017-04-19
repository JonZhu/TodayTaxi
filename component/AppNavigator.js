/**
 * 应该全局导航
 * 
 * <p>
 * 通过导航render的组件，通过navigator属性获取导航器，导航器的route有两个属性｛comp, props｝,
 * comp为class类型, props为comp render时的属性数据。
 * </p>
 * 
 * @author zhujun
 * @date 2017-1-3
 */

import React, { Component } from 'react';
import { Navigator, BackAndroid } from 'react-native';
import BootPage from './BootPage';
// import BootPage from '../redux/container/CallTaxiContainer'; // test
// import BootPage from './test/MapViewTest'; // test
// import BootPage from './test/MotormanTest'; // test
// import BootPage from './calltaxi/CallTaxiTest'; // test

class AppNavigator extends Component {
    constructor() {
        super();
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
    }

    _renderScene(route, navigator) {
        var Comp = route.comp;
        return <Comp navigator={navigator} {...route.props}/>
    }

    // 处理android back键
    _onHardwareBackPress() {
        var navigator = this.refs.navigator;
        var routes = navigator.getCurrentRoutes();
        if (routes.length > 1) {
            navigator.pop();
            return true; // 接管默认行为
        } else {
            return false; // 默认行为
        }
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    render() {
        return (
            <Navigator ref='navigator' style={{flex:1}} initialRoute={{comp: BootPage}} renderScene={this._renderScene} />
        );
    }

}

export default AppNavigator;