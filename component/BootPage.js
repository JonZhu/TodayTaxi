/**
 * 启动页
 * 
 * @author zhujun
 * @date 2017-3-2
 */

import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';

class BootPage extends Component {


    render() {
        return (
            <View style={{flex:1, backgroundColor:'#rgb(125,204,247)', justifyContent:'center', alignItems:'center'}}>
                <Text style={{fontSize:50}}>Today</Text>
                <Text style={{fontSize:14}}>Taxi</Text>
            </View>
        );
    }

}

export default BootPage;