/**
 * 登录页面
 * @author zhujun
 * @date 2017-2-7
 */

import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableHighlight, ToastAndroid, Image, Dimensions } from 'react-native';
import Header from './Header';
import rest from './api/rest';
import UserExceptionCode from './api/UserExceptionCode';
import md5 from 'md5';
import TTTextInput from './TTTextInput';
import TencentModule from '../native/TencentModule';
import store from '../redux/storeConfig';
import { NavigationActions } from 'react-navigation';
import { validatePhone, validatePass } from './util/validator';

class Login extends Component {

    constructor() {
        super();

        this.state = {phone:''}
    }

    _toSignIn = ()=>{
        this.props.navigation.navigate('SignIn');
    }

    _login = ()=>{
        var phone = this.state.phone;
        var pass = this._pass;

        if (!validatePhone(phone)) {
            ToastAndroid.show('手机号输入不正确', ToastAndroid.SHORT);
            return;
        }

        if (!validatePass(pass)) {
            ToastAndroid.show('密码输入不正确，应为6到20位数字、下划线、字母', ToastAndroid.SHORT);
            return;
        }

        // 先获取加密用的盐值
        rest("/user/getSalts.do", {phone: phone}).then((result)=>{
            if (result.code === 0) {
                // 密码加密
                var staticSalt = result.payload.staticSalt;
                var dynamicSalt = result.payload.dynamicSalt;
                var encryptedPass = md5(md5(pass + staticSalt) + dynamicSalt);
                // 登录
                return rest('/user/login.do', {phone: phone, password:encryptedPass});
            } else if (result.code === UserExceptionCode.USER_NOT_EXIST) {
                return Promise.reject('用户不存在');
            } else {
                return Promise.reject('获取盐值失败');
            }
        }).then((result)=>{
            // 登录返回
            if (result.code === 0) {
                // 登录成功
                var loginResp = result.payload;
                loginResp.phone = phone; // 当前用户手机
                this._loginSuccessResp(loginResp);
            } else {
                return Promise.reject(result.message);
            }
        }).catch((reason)=>{
            ToastAndroid.show('登录失败:' + reason, ToastAndroid.LONG);
        });
    }

    /**
     * 处理登录成功响应
     */
    _loginSuccessResp = (loginResp)=>{
        store.dispatch({type:'userLogin', loginResp}); // 触发userLogin事件

        var clientType = loginResp.motorman ? 'MotormanNavigator' : 'PassengerNavigator';
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: clientType})
            ]
        })
        this.props.navigation.dispatch(resetAction);
    }

    /**
     * 转到忘记密码页
     */
    _toRecoverPassword = ()=>{
        this.props.navigation.navigate('RecoverPassword');
    }

    /**
     * 转到QQ登录页面
     */
    _toQQLogin = ()=>{
        TencentModule.login().then((result)=>{
            if (result.status == 'success') {
                // 登录成功
                var openID = result.openID;
                this._qqLogin(openID);
            }
        }).catch((reason)=>{
            ToastAndroid.show('QQ登录失败', ToastAndroid.LONG);
        });
    }

    /**
     * 执行qq登录
     */
    _qqLogin = (openID)=>{
        rest('/user/thirdLogin.do', {thirdId: openID, type:1}).then((result)=>{
            if (result.code === 0) {
                // 登录成功
                var loginResp = result.payload;
                this._loginSuccessResp(loginResp);
            } else if (result.code == UserExceptionCode.USER_NOT_EXIST) {
                // 第三方qq帐号不存在
                this._createQQAccount(openID);
            }
        });
    }

    /**
     * 创建qq第三方帐号
     */
    _createQQAccount = (openID)=>{
        TencentModule.getInfo().then((qqInfo)=>{
            var gender = qqInfo.gender == '男' ? 0 : (qqInfo.gender == '女' ? 1 : null);
            rest('/user/createThirdAccount.do', {type:1, thirdId:openID, nickname:qqInfo.nickname, 
                figureUrl:qqInfo.figureurl, gender:gender})
            .then((result)=>{
                var code = result.code;
                if (code === 0 || code == UserExceptionCode.THIRD_ACCOUNT_EXIST) {
                    // 创建成功，或帐号已存在
                    this._qqLogin(openID); // 重新登录
                } else {
                    ToastAndroid.show('创建qq第三方帐号失败:' + result.message, ToastAndroid.LONG);
                }
            });
        }).catch((reason)=>{
            ToastAndroid.show('获取qq用户信息失败', ToastAndroid.LONG);
        });
    }

    render() {
        return (
            <ScrollView style={{flex:1, backgroundColor:'rgb(204,204,204)'}}>
            <View style={{height:Dimensions.get('window').height-32, padding:16, paddingLeft:35, paddingRight:35, alignItems:'center'}}>
                <TouchableHighlight style={{position:'absolute', top:16, right:35}} onPress={this._toSignIn}>
                    <Text style={{fontSize:14}}>注册</Text>
                </TouchableHighlight>

                <Image source={require('./img/login_logo.png')} style={{marginTop:44, width:119, resizeMode:'contain'}}/>

                <Text style={{marginTop:25, fontSize:40, color:'rgb(153,153,51)', fontWeight:'bold'}}>TodayTaxi</Text>

                <View style={{width:'100%', height:40, borderWidth:1, borderColor:'rgb(153,153,153)', marginTop:52}}>
                    <TTTextInput ref='phoneInput' style={{flex:1}} placeholder='手机号' underlineColorAndroid='transparent'
                        keyboardType='phone-pad' onChangeText={(text)=>{this.setState({phone:text})}} value={this.state.phone} regexp='\d*' maxLength={11}/>
                </View>

                <View style={{width:'100%', height:40, borderWidth:1, borderColor:'rgb(153,153,153)', marginTop:18}}>
                    <TextInput ref='passInput' style={{flex:1}} placeholder='密码' underlineColorAndroid='transparent' 
                        secureTextEntry={true} onChangeText={(text)=>{this._pass = text}}/>
                </View>

                <TouchableHighlight onPress={this._login} style={{width:'100%', marginTop:18}}>
                <View style={{width:'100%', height:40, borderWidth:1, borderColor:'rgb(153,153,102)', backgroundColor:'#b3d465', alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:27, color:'#999933'}}>登录</Text>
                </View>
                </TouchableHighlight>

                <TouchableHighlight style={{position:'absolute', bottom:16, left:35}} onPress={this._toRecoverPassword}>
                    <Text style={{fontSize:14}}>忘记密码</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{position:'absolute', bottom:16, right:35}} onPress={this._toQQLogin}>
                    <Text style={{fontSize:14}}>QQ登录</Text>
                </TouchableHighlight>

            </View>
            </ScrollView>
        );
    }

}


export default Login;