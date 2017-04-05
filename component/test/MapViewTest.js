/**
 * 地图组件测试
 * 
 * @author zhujun
 * @date 2017-4-5
 */

import React, { Component } from 'react';
import { View, Button } from 'react-native';
import MapView from '../../native/MapView';

class MapViewTest extends Component {

    constructor() {
        super();

        this._testNavi = this._testNavi.bind(this);
    }

    componentDidMount() {
        
    }


    _testNavi() {
        // 104.063244,30.544046 天府五街
        // 104.077239,30.555243 软件园A区
        this._mapView.launchNavi([{lng:104.063244, lat:30.544046, name:'天府五街'}, {lng:104.077239, lat:30.555243, name:'软件园A区'}]);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Button title='导航' onPress={this._testNavi}/>
                <MapView ref={(value)=>{this._mapView=value}} style={{flex:1}}/>
            </View>
        );
    }
}

export default MapViewTest;