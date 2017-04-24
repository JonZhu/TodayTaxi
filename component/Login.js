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
import Motorman from './motorman/Motorman';
import rest from './api/rest';
import md5 from 'md5';
import TTTextInput from './TTTextInput';

class Login extends Component {

    constructor() {
        super();

        this.state = {phone:''}

        this._toSignIn = this._toSignIn.bind(this);
        this._login = this._login.bind(this);
    }

    _toSignIn() {
        this.props.navigator.push({comp:SignIn});
    }

    _login() {
        var phone = this.state.phone;
        var pass = this._pass;

        var navigator = this.props.navigator;

        // 先获取加密用的盐值
        rest("/user/getSalts.do", {phone: phone}).then((result)=>{
            if (result.code === 0) {
                // 密码加密
                var staticSalt = result.payload.staticSalt;
                var dynamicSalt = result.payload.dynamicSalt;
                var encryptedPass = md5(md5(pass + staticSalt) + dynamicSalt);
                // 登录
                return rest('/user/login.do', {phone: phone, password:encryptedPass});
            } else {
                throw new Error('获取盐值失败');
            }
        }).then((result)=>{
            // 登录返回
            if (result.code === 0) {
                // 登录成功
                return rest('/user/getStatus.do');
            } else {
                throw new Error(result.message);
            }
        }).then((result)=>{
            // 获取状态返回
            var status = result.payload;
            if (status.motorman) {
                // 司机
                navigator.resetTo({comp:Motorman});
            } else {
                navigator.resetTo({comp:CallTaxi}); // 跳转到叫车页，并清除所有page stack
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
                    
                    <TouchableHighlight style={{marginTop:20}} onPress={this._toSignIn}>
                        <Text style={{textDecorationLine:'underline'}}>还没有帐号，请注册</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

}


export default Login;