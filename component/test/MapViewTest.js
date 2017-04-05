/**
 * 地图组件测试
 * 
 * @author zhujun
 * @date 2017-4-5
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import MapView from '../../native/MapView';

class MapViewTest extends Component {


    rander() {
        return (
            <MapView style={{flex:1}}/>
        );
    }
}

export default MapViewTest;