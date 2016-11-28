/**
 * 叫车页
 * @date 2016-11-28
 * 
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import ToolBar from './ToolBar';
import SideBar from './SideBar';

class CallTaxi extends Component {

    render() {
        return (
            <View style={{flex:1}}>
                <ToolBar/>
                <SideBar/>
            </View>

        );
    }

}

export default CallTaxi;
