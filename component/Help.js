/**
 * 帮助
 * @author zhujun
 * @date 2017-5-27
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from './Header';
import { pageBack } from './util/back';

class Help extends Component {

    render() {

        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='帮助' icon='back' iconOnPress={pageBack.bind(this)}/>
                <View style={{flex:1, padding:10, justifyContent:'center', alignItems:'center'}}>
                    <Text>客服QQ：3479766355</Text>
                    <Text>邮箱：todaytaxi@qq.com</Text>
                </View>
            </View>
        );
    }
}

export default Help;