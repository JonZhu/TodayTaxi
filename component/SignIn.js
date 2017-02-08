/**
 * 注册页面
 * @author zhujun
 * @date 2017-2-8
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Header from './Header';

class SignIn extends Component {
    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='注册'/>
                <View style={{flex:1, padding:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:18}}>手机：</Text>
                        <TextInput style={{flex:1}} placeholder='请输入手机号码' underlineColorAndroid='transparent'/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:18}}>密码：</Text>
                        <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent'/>
                    </View>

                    <Button title='注册' onPress={()=>{}}></Button>
                </View>
            </View>
        );
    }
}

export default SignIn;