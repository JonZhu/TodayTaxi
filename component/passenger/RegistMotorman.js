/**
 * 注册成为车主
 */

import React, { Component } from 'react';
import { View, Text, Button, TextInput, TouchableWithoutFeedback, ToastAndroid, ScrollView } from 'react-native';
import Header from '../Header';
import rest from '../api/rest';
import { pageBack } from '../util/back';

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
            ownerName: this._ownerName,
            brand: this._brand,
            model: this._model,
            color: this._color
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

        rest('/motorman/regist.do', param).then((result)=>{
            if (result.code === 0) {
                ToastAndroid.show('注册成功,请重新登录', ToastAndroid.LONG);
                this.props.navigation.goBack(); // 返回之前页面
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
                <Header title='注册成为车主' icon='back' iconOnPress={pageBack.bind(this)}/>
                <ScrollView style={{flex:1, padding:10}}>
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
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>发动机号：</Text>
                            <TextInput style={{flex:1}} placeholder='请输入发动机号' underlineColorAndroid='transparent' 
                                onChangeText={(text)=>{this._engineNo = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>品牌：</Text>
                            <TextInput style={{flex:1}} placeholder='如：大众' underlineColorAndroid='transparent'
                                onChangeText={(text)=>{this._brand = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', borderBottomWidth:1, 
                            borderBottomColor:'rgb(205,205,211)', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>型号：</Text>
                            <TextInput style={{flex:1}} placeholder='如：2015款手动风尚' underlineColorAndroid='transparent'
                                onChangeText={(text)=>{this._model = text}}/>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, height:50}}>
                            <Text style={{fontSize:18}}>颜色：</Text>
                            <TextInput style={{flex:1}} placeholder='如：白色' underlineColorAndroid='transparent'
                                onChangeText={(text)=>{this._color = text}}/>
                        </View>
                    </View>

                    <Button title='注册' onPress={this._regist}></Button>

                </ScrollView>
            </View>
        );
    }

}

export default RegistMotorman;