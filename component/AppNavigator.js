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
import { Navigator } from 'react-native';
import CallTaxiContainer from '../redux/container/CallTaxiContainer';

class AppNavigator extends Component {

    _renderScene(route, navigator) {
        var Comp = route.comp;
        return <Comp navigator={navigator} {...route.props}/>
    }

    render() {
        return (
            <Navigator style={{flex:1}} initialRoute={{comp: CallTaxiContainer}} renderScene={this._renderScene} />
        );
    }

}

export default AppNavigator;