/**
 * 登录页面
 * @author zhujun
 * @date 2017-2-7
 */

import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableHighlight, ToastAndroid } from 'react-native';
import Header from './Header';
import SignIn from './SignIn';
import RecoverPassword from './RecoverPassword';
import CallTaxi from '../redux/container/CallTaxiContainer';
import Motorman from './motorman/Motorman';
import rest from './api/rest';
import UserExceptionCode from './api/UserExceptionCode';
import md5 from 'md5';
import TTTextInput from './TTTextInput';
import TencentModule from '../native/TencentModule';
import store from '../redux/storeConfig';

class Login extends Component {

    constructor() {
        super();

        this.state = {phone:''}
    }

    _toSignIn = ()=>{
        this.props.navigator.push({comp:SignIn});
    }

    _login = ()=>{
        var phone = this.state.phone;
        var pass = this._pass;

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
        var navigator = this.props.navigator;
        if (loginResp.motorman) {
            // 司机
            navigator.resetTo({comp:Motorman});
        } else {
            navigator.resetTo({comp:CallTaxi}); // 跳转到叫车页，并清除所有page stack
        }
    }

    /**
     * 转到忘记密码页
     */
    _toRecoverPassword = ()=>{
        this.props.navigator.push({comp:RecoverPassword});
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
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='登录'/>
                <View style={{flex:1, padding:10}}>
                    <View style={{borderWidth:1, borderRadius:3, borderColor:'rgb(205,205,211)', marginBottom:10}}>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>帐户：</Text>
                            <TTTextInput ref='phoneInput' style={{flex:1}} placeholder='请输入帐户' underlineColorAndroid='transparent'
                                keyboardType='phone-pad' onChangeText={(text)=>{this.setState({phone:text})}} value={this.state.phone} regexp='\d*' maxLength={11}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>密码：</Text>
                            <TextInput ref='passInput' style={{flex:1}} placeholder='请输入密码' underlineColorAndroid='transparent' 
                                secureTextEntry={true} onChangeText={(text)=>{this._pass = text}}/>
                        </View>
                    </View>

                    <Button title='登录' onPress={this._login}></Button>
                    
                    <View style={{alignItems:'center'}}>
                        <TouchableHighlight style={{marginTop:20}} onPress={this._toSignIn}>
                            <Text style={{textDecorationLine:'underline'}}>还没有帐号，请注册 >></Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{marginTop:20}} onPress={this._toRecoverPassword}>
                            <Text style={{textDecorationLine:'underline'}}>忘记密码？</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{marginTop:20}} onPress={this._toQQLogin}>
                            <Text style={{textDecorationLine:'underline'}}>QQ帐号登录 >></Text>
                        </TouchableHighlight>
                       
                    </View>
                </View>
            </View>
        );
    }

}


export default Login;