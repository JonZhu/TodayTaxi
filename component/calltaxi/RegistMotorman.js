/**
 * 注册成为车主
 */

import React, { Component } from 'react';
import { View, Text, Button, TextInput, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import Header from '../Header';
import rest from '../api/rest';

class RegistMotorman extends Component {

    constructor() {
        super();

        this._regist = this._regist.bind(this);
    }

    _regist() {
        var param = {
            taxiNumber: this._taxiNumber,
            chassisNumber: this._chassisNumber,
            engineNo: this._engineNo,
            ownerName: this._ownerName
        };

        if (!param.ownerName) {
            ToastAndroid.show('车主姓名不能为空', ToastAndroid.SHORT);
            return;
        }

        if (!param.taxiNumber) {
            ToastAndroid.show('车牌号不能为空', ToastAndroid.SHORT);
            return;
        }

        if (!param.chassisNumber) {
            ToastAndroid.show('车架号不能为空', ToastAndroid.SHORT);
            return;
        }

        if (!param.engineNo) {
            ToastAndroid.show('发动机号不能为空', ToastAndroid.SHORT);
            return;
        }

        rest('/taxi/regist.do', param).then((result)=>{
            if (result.code === 0) {
                ToastAndroid.show('注册成功,请重新登录', ToastAndroid.LONG);
                this.props.navigator.pop(); // 返回之前页面
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='注册成为车主'/>
                <View style={{flex:1, padding:10}}>
                    <View style={{borderWidth:1, borderRadius:3, borderColor:'rgb(205,205,211)', marginBottom:10}}>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>车主名：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入车主名' underlineColorAndroid='transparent'
                                onChangeText={(text)=>{this._ownerName = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50,
                            borderBottomWidth:1, borderBottomColor:'rgb(205,205,211)'}}>
                            <Text style={{fontSize:18}}>车牌号：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入车牌号' underlineColorAndroid='transparent' 
                                onChangeText={(text)=>{this._taxiNumber = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50,
                            borderBottomWidth:1, borderBottomColor:'rgb(205,205,211)'}}>
                            <Text style={{fontSize:18}}>车架号：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入车架号' underlineColorAndroid='transparent' 
                                onChangeText={(text)=>{this._chassisNumber = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>发动机号：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入发动机号' underlineColorAndroid='transparent' 
                                onChangeText={(text)=>{this._engineNo = text}}/>
                        </View>
                    </View>

                    <Button title='注册' onPress={this._regist}></Button>

                </View>
            </View>
        );
    }

}

export default RegistMotorman;