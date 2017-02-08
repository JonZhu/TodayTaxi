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
        var serverResult = {success:true, phone:'15888888888', name:'成龙'};
        if (serverResult.success === true) {
            // 登录成功
            this.props.navigator.resetTo({comp:CallTaxi}); // 跳转到叫车页，并清除所有page stack
        } else {
            ToastAndroid.show('登录失败', ToastAndroid.SHORT);
        }
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
                            <TextInput style={{flex:1}} placeholder='请输入帐户' underlineColorAndroid='transparent'/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>密码：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' secureTextEntry={true}/>
                        </View>
                    </View>

                    <Button title='登录' onPress={this._login}></Button>
                    
                    <TouchableHighlight style={{marginTop:10}} onPress={this._toSignIn}>
                        <Text>还没有帐号，请注册</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

}

const style = StyleSheet.create({
    
});

export default Login;