/**
 * 选择目标地址 页面
 * 
 * @author zhujun
 * @date 2017-1-19
 */

import React, { Component } from 'react';
import { View, TextInput, Text, TouchableHighlight, FlatList } from 'react-native';

class ChoiceGo extends Component {

    constructor() {
        super();

        this._addressOnPress = this._addressOnPress.bind(this);
    }

    _addressOnPress(goAddr) {
        this.props.navigation.goBack(); // 关闭当前页
        this.props.searchAddrOnPress(goAddr);
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <View style={{backgroundColor:'rgb(249,249,249)', height:50, 
                    borderBottomWidth:1, borderBottomColor:'rgb(229,229,229)',
                    flexDirection:'row', alignItems:'center', paddingLeft:10, paddingRight:10}}>
                    {this.props.city &&
                    <Text>{this.props.city}：</Text>
                    }
                    <TextInput style={{flex:1, marginRight:10, fontSize:16}} underlineColorAndroid='transparent' 
                        placeholder='请输入目的地' onChangeText={(keyword)=>{this.props.searchKeywordInCity(this.props.city, keyword)}}/>
                    <TouchableHighlight onPress={()=>this.props.navigation.goBack()}>
                        <Text style={{color:'rgb(31,186,214)'}}>取消</Text>
                    </TouchableHighlight>
                </View>

                <FlatList style={{flex:1}} data={this.props.searchResult} keyExtractor={(item, index)=>{return index+''}} renderItem={(row)=>{
                    var item = row.item;
                    return (
                        <TouchableHighlight onPress={()=>this._addressOnPress(item)}>
                            <View style={{padding:10, borderBottomWidth:1, borderBottomColor:'rgb(229,229,229)', marginLeft:10, marginRight:10}}>
                                <Text style={{fontSize:18}}>{row.index+1}. {item.name}</Text>
                                <Text style={{color:'rgb(175,175,175)'}}>{item.address}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                }/>

            </View>
        );

    }

}

export default ChoiceGo;