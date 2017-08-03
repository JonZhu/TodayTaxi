/**
 * 找回密码页面
 * @author zhujun
 * @date 2017-6-7
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ToastAndroid, Platform, BackHandler } from 'react-native';
import Header from './Header';
import { validatePhone, validatePass } from './util/validator';
import rest from './api/rest';
import UserExceptionCode from './api/UserExceptionCode';
import { pageBack } from './util/back';
import MobModule from '../native/MobModule';
import md5 from 'md5';

class RecoverPassword extends Component {

    state = {step:1}

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onBack);
    }

    /**
     * 找回密码
     */
    _recoverPass = ()=>{
        var phone = this._phone;
        var pass = this._pass;
        var pass2 = this._pass2;
        var verifyCode = this._verifyCode;

        if (!validatePhone(phone)) {
            ToastAndroid.show('手机号输入不正确', ToastAndroid.SHORT);
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

        if (this._salt == null) {
            ToastAndroid.show('请先获取salt值', ToastAndroid.SHORT);
            return;
        }

        var newPassword = md5(pass + this._salt); // 加密

        rest("/user/recoverPass.do", {phone:phone, newPass:newPassword, verifyCode:verifyCode, os:Platform.OS}).then((result)=>{
            if (result.code === 0) {
                // 找回密码成功
                ToastAndroid.show('找回密码成功', ToastAndroid.LONG);
                this.props.navigation.goBack(); // 返回页面
            } else {
                ToastAndroid.show('找回密码失败:' + result.message, ToastAndroid.SHORT);
            }
        }).catch((reason)=>{
            ToastAndroid.show('找回密码失败:' + reason, ToastAndroid.SHORT);
        });
    }

    /**
     * 跳转到输入新密码 步骤
     */
    _toNewPassStep = ()=>{
        var phone = this._phone;
        if (!validatePhone(phone)) {
            ToastAndroid.show('手机号输入不正确', ToastAndroid.SHORT);
            return;
        }

        // RecoverPass 调用prepare
        rest('/user/prepareRecoverPass.do', {phone: phone}).then((result)=>{
            if (result.code == 0) {
                var salt = result.payload; // 密码加密值
                this._salt = salt; // 存储salt

                // 发送验证码
                var now = new Date().getTime();
                if (this._sendVerificationCodeTime != null && now - this._sendVerificationCodeTime < 60000) {
                    ToastAndroid.show('还需要秒'+ (now - this._sendVerificationCodeTime)/1000 +'才能再次发送', ToastAndroid.SHORT);
                    return;
                }

                // 获取验证码
                MobModule.sendVerificationCode(this._phone).then(()=>{
                    ToastAndroid.show('发送验证码成功', ToastAndroid.SHORT);
                    this.setState({step:2}); // 转到第二步
                }).catch((reason)=>{
                    ToastAndroid.show('发送验证码失败', ToastAndroid.SHORT);
                });

                this._sendVerificationCodeTime = new Date().getTime(); // 保存发送时间

            } else if (result.code == UserExceptionCode.USER_NOT_EXIST) {
                ToastAndroid.show('用户不存在', ToastAndroid.LONG);
            }
        });

    }

    /**
     * 返回, 因为有页内跳转，需求自定义逻辑
     */
    _onBack = ()=>{
        if (this.state.step > 1) {
            this.setState({step:this.state.step - 1});
        } else {
            pageBack.bind(this)();
        }
        return true; // 兼容BackHandler, 不跳出当前页
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='找回密码' icon='back' iconOnPress={this._onBack}/>

                <View style={{flex:1, padding:10}}>
                    {this.state.step == 1 && 
                    <View>
                        <Text>第一步, 输入帐号</Text>
                        <View style={{borderWidth:1, borderRadius:3, borderColor:'rgb(205,205,211)', marginBottom:10, marginTop:10}}>
                            <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                                <Text style={{fontSize:18}}>帐户：</Text>
                                <TextInput style={{flex:1}} placeholder='请输入手机号' underlineColorAndroid='transparent'
                                    keyboardType='phone-pad' maxLength={11} onChangeText={(text)=>{this._phone = text}}/>
                            </View>
                        </View>
                        <Button title='下一步' onPress={this._toNewPassStep}></Button>
                    </View>}

                    {this.state.step == 2 && 
                    <View>
                        <Text>第二步, 输入验证码、新密码</Text>
                        <View style={{borderWidth:1, borderRadius:3, borderColor:'rgb(205,205,211)', marginBottom:10, marginTop:10}}>
                            <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                                borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                                <Text style={{fontSize:18}}>验证码：</Text>
                                <TextInput style={{flex:1}} placeholder='请输入验证码' underlineColorAndroid='transparent' 
                                    keyboardType='numeric' maxLength={6} onChangeText={(text)=>{this._verifyCode = text}}/>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                                borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                                <Text style={{fontSize:18}}>新密码：</Text>
                                <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                    maxLength={20} secureTextEntry={true} onChangeText={(text)=>{this._pass = text}}/>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                                <Text style={{fontSize:18}}>确认密码：</Text>
                                <TextInput style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                    maxLength={20} secureTextEntry={true} onChangeText={(text)=>{this._pass2 = text}}/>
                            </View>
                        </View>
                        <Button title='找回密码' onPress={this._recoverPass}></Button>
                    </View>}

                </View>
            </View>
        );
    }
}

export default RecoverPassword;