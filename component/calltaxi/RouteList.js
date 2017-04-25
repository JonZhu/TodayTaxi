/**
 * 行程列表
 * @author zhujun
 * @date 2017-4-25
 */

import React, { Component } from 'react';
import { View, ToastAndroid, Text, TouchableWithoutFeedback } from 'react-native';
import Header from '../Header';

class RouteList extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='行程' icon='back'/>
                
            </View>
        );
    }
}

export default RouteList;