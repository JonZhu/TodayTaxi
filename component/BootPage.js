/**
 * 启动页
 * 
 * @author zhujun
 * @date 2017-3-2
 */

import React, { Component } from 'react';
import { View, Text, ToastAndroid, StyleSheet } from 'react-native';
import { applySession } from './api/security';
import Login from './Login';

class BootPage extends Component {

    componentDidMount() {
        var startTime = new Date().getTime();
        var navigator = this.props.navigator;
        // var minTime = 3000; // Boot页面最少显示时间
        var minTime = 0; // 测试时不用等待
        // 初始化session
        applySession().then(()=>{
            // 已经成功申请到session, 跳转到登录页面
            var useTime = new Date().getTime() - startTime;
            if (useTime >= minTime) {
                navigator.resetTo({comp:Login}); // 并清除所有page stack
            } else {
                // 时间不足, 等待时间足够才跳出boot页面
                setTimeout(function() {
                   navigator.resetTo({comp:Login});
                }, minTime - useTime);
            }
        }).catch((reason)=>{
            ToastAndroid.show("无法连接服务器:" + reason, ToastAndroid.LONG);
        });

    }

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