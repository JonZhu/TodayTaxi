/**
 * 登录页面
 * @author zhujun
 * @date 2017-2-7
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableHighlight, ToastAndroid } from 'react-native';
import Header from './Header';
import SignIn from './SignIn';
import CallTaxi from '../redux/container/CallTaxiContainer';
import rest from './api/rest';

class Login extends Component {

    constructor() {
        super();
        this._toSignIn = this._toSignIn.bind(this);
        this._login = this._login.bind(this);
    }

    _toSignIn() {
        this.props.navigator.push({comp:SignIn});
    }

    _login() {
        var phone = this._phone;
        var pass = this._pass;

        // 先获取加密用的盐值
        rest("/user/getSalts.do", phone).then((result)=>{
            if (result.code === 0) {
                // 登录
                return rest('/user/login.do', {phone: phone, password:''});
            } else {
                throw new Error('获取值值失败');
            }
        }).then((loginResult)=>{
            // 登录返回
            if (loginResult.code === 0) {
                // 登录成功
                this.props.navigator.resetTo({comp:CallTaxi}); // 跳转到叫车页，并清除所有page stack
            } else {
                ToastAndroid.show('登录失败:' + loginResult.message, ToastAndroid.SHORT);
            }
        }).catch((reason)=>{
            ToastAndroid.show('登录失败:' + reason, ToastAndroid.SHORT);
        });
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='登录'/>
                <View style={{flex:1, padding:10}}>
                    <View style={{borderWidth:1, borderRadius:3, borderColor:'rgb(205,205,211)', marginBottom:10}}>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>帐户：</Text>
                            <TextInput ref='phoneInput' style={{flex:1}} placeholder='请输入帐户' underlineColorAndroid='transparent'
                                keyboardType='phone-pad' onChangeText={(text)=>{this._phone = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>密码：</Text>
                            <TextInput ref='passInput' style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                secureTextEntry={true} onChangeText={(text)=>{this._pass = text}}/>
                        </View>
                    </View>

                    <Button title='登录' onPress={this._login}></Button>
                    
                    <TouchableHighlight style={{marginTop:20}} onPress={this._toSignIn}>
                        <Text style={{textDecorationLine:'underline'}}>还没有帐号，请注册</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

}

const style = StyleSheet.create({
    
});

export default Login;