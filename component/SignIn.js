/**
 * 注册页面
 * @author zhujun
 * @date 2017-2-8
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid } from 'react-native';
import Header from './Header';
import { validatePhone, validatePass } from './util/validator';
import rest from './api/rest';
import { pageBack } from './util/back';

class SignIn extends Component {

    constructor() {
        super();

        this._signIn = this._signIn.bind(this);
    }

    _signIn() {
        var phone = this._phone;
        var pass = this._pass;

        if (!validatePhone(phone)) {
            ToastAndroid.show('电话输入不正确', ToastAndroid.SHORT);
            return;
        }

        if (!validatePass(pass)) {
            ToastAndroid.show('密码输入不正确，应为6到20位数字、下划线、字母', ToastAndroid.SHORT);
            return;
        }

        var navigator = this.props.navigator;
        rest("/user/regist.do", {phone:phone, password:pass}).then((result)=>{
            if (result.code === 0) {
                // 注册成功
                ToastAndroid.show('注册成功', ToastAndroid.LONG);
                navigator.pop(); // 返回页面
            } else {
                ToastAndroid.show('注册失败:' + result.message, ToastAndroid.SHORT);
            }
        }).catch((reason)=>{
            ToastAndroid.show('注册失败:' + reason, ToastAndroid.SHORT);
        });
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='注册' icon='back' iconOnPress={pageBack.bind(this)}/>
                <View style={{flex:1, padding:10}}>
                    <View style={{borderWidth:1, borderRadius:3, borderColor:'rgb(205,205,211)', marginBottom:10}}>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>帐户：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入帐户' underlineColorAndroid='transparent'
                                keyboardType='phone-pad' maxLength={11} onChangeText={(text)=>{this._phone = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>密码：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                maxLength={20} onChangeText={(text)=>{this._pass = text}}/>
                        </View>
                    </View>

                    <Button title='注册' onPress={this._signIn}></Button>
                </View>
            </View>
        );
    }
}

export default SignIn;