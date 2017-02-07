/**
 * 登录页面
 * @author zhujun
 * @date 2017-2-7
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Header from './Header';

class Login extends Component {

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='登录'/>
                <View style={{flex:1, padding:10}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:18}}>帐户：</Text>
                        <TextInput style={{flex:1}} placeholder='请输入帐户' underlineColorAndroid='transparent'/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={{fontSize:18}}>密码：</Text>
                        <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' secureTextEntry={true}/>
                    </View>

                    <Button title='登录' onPress={()=>{}}></Button>
                </View>
            </View>
        );
    }

}

const style = StyleSheet.create({
    
});

export default Login;