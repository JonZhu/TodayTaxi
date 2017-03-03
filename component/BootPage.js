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
        // 初始化session
        applySession().then(()=>{
            // 已经成功申请到session, 跳转到登录页面
            this.props.navigator.resetTo({comp:Login}); // 并清除所有page stack
        }).catch(()=>{
            ToastAndroid.show("无法连接服务器", ToastAndroid.SHORT);
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