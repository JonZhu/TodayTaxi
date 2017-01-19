/**
 * 选择目标地址 页面
 * 
 * @author zhujun
 * @date 2017-1-19
 */

import React, { Component } from 'react';
import { View, TextInput, Text, TouchableHighlight, ListView } from 'react-native';

class ChoiceGo extends Component {

    render() {
        var searchResult = this.props.searchResult;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        ds = ds.cloneWithRows(searchResult);

        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <View style={{backgroundColor:'rgb(249,249,249)', height:50, 
                    borderBottomWidth:1, borderBottomColor:'rgb(229,229,229)',
                    flexDirection:'row', alignItems:'center', paddingLeft:10, paddingRight:10}}>
                    <TextInput style={{flex:1, marginRight:10, fontSize:16}} underlineColorAndroid='transparent' 
                        placeholder='请输入目的地' onChangeText={this.props.keywordOnChange}/>
                    <TouchableHighlight onPress={()=>this.props.navigator.pop()}>
                        <Text style={{color:'rgb(31,186,214)'}}>取消</Text>
                    </TouchableHighlight>
                </View>

                <ListView style={{flex:1}} dataSource={ds} enableEmptySections={true} renderRow={(rowData)=>
                    <View style={{padding:10, borderBottomWidth:1, borderBottomColor:'rgb(229,229,229)', marginLeft:10, marginRight:10}}>
                        <Text style={{fontSize:18}}>{rowData.name}</Text>
                        <Text style={{color:'rgb(175,175,175)'}}>{rowData.address}</Text>
                    </View>
                }/>

            </View>
        );

    }

}

export default ChoiceGo;