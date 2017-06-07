/**
 * 注册页面
 * @author zhujun
 * @date 2017-2-8
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid, Platform } from 'react-native';
import Header from './Header';
import { validatePhone, validatePass } from './util/validator';
import rest from './api/rest';
import { pageBack } from './util/back';
import MobModule from '../native/MobModule';

class SignIn extends Component {

    constructor() {
        super();
    }

    _signIn = ()=>{
        var phone = this._phone;
        var pass = this._pass;
        var pass2 = this._pass2;
        var verifyCode = this._verifyCode;

        if (!validatePhone(phone)) {
            ToastAndroid.show('电话输入不正确', ToastAndroid.SHORT);
            return;
        }

        if (verifyCode == null || ! /\d+/.test(verifyCode)) {
            ToastAndroid.show('验证码不正确，应为数字', ToastAndroid.SHORT);
            return;
        }

        if (pass != pass2) {
            ToastAndroid.show('两次输入密码不匹配', ToastAndroid.SHORT);
            return;
        }

        if (!validatePass(pass)) {
            ToastAndroid.show('密码输入不正确，应为6到20位数字、下划线、字母', ToastAndroid.SHORT);
            return;
        }

        var navigator = this.props.navigator;
        rest("/user/regist.do", {phone:phone, password:pass, verifyCode:verifyCode, os:Platform.OS}).then((result)=>{
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

    /**
     * 获取验证码
     */
    _getVerifyCode = ()=>{
        if (!validatePhone(this._phone)) {
            ToastAndroid.show('电话输入不正确', ToastAndroid.SHORT);
            return;
        }

        var now = new Date().getTime();
        if (this._sendVerificationCodeTime != null && now - this._sendVerificationCodeTime < 60000) {
            ToastAndroid.show('还需要秒'+ (now - this._sendVerificationCodeTime)/1000 +'才能再次发送', ToastAndroid.SHORT);
            return;
        }

        MobModule.sendVerificationCode(this._phone).then(()=>{
            ToastAndroid.show('发送验证码成功', ToastAndroid.SHORT);
        }).catch((reason)=>{
            ToastAndroid.show('发送验证码失败', ToastAndroid.SHORT);
        });

        this._sendVerificationCodeTime = new Date().getTime(); // 保存发送时间
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
                            <TextInput style={{flex:1}} placeholder='请输入手机号' underlineColorAndroid='transparent'
                                keyboardType='phone-pad' maxLength={11} onChangeText={(text)=>{this._phone = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>验证码：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入验证码' underlineColorAndroid='transparent' 
                                keyboardType='numeric' maxLength={6} onChangeText={(text)=>{this._verifyCode = text}}/>
                            <Button title='获取验证码' onPress={this._getVerifyCode}></Button>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>密码：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                maxLength={20} secureTextEntry={true} onChangeText={(text)=>{this._pass = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>确认密码：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                maxLength={20} secureTextEntry={true} onChangeText={(text)=>{this._pass2 = text}}/>
                        </View>
                    </View>

                    <Button title='注册' onPress={this._signIn}></Button>
                </View>
            </View>
        );
    }
}

export default SignIn;