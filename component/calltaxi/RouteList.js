/**
 * 行程列表
 * @author zhujun
 * @date 2017-4-25
 */

import React, { Component } from 'react';
import { View, ToastAndroid, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import Header from '../Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import rest from '../api/rest';

class RouteList extends Component {
    constructor() {
        super();

        // 添加测试数据
        var routeList = [];
        for (var i=0; i < 20; i++) {
            routeList.push({key:i, time:1493102919000, from:'天府广场', to:'双流', status:1});
        }
        this.state = {routeList: routeList};
    }

    componentDidMount() {
        this._queryNextPageRoute();
    }

    // 查询下一页行程数据
    _queryNextPageRoute = ()=>{
        rest('/route/getPassengerRouteList.do', {}).then();
    }

    _toTimeStr = (time)=>{
        try {
            var date = new Date(time);
            // date.setMilliseconds(time);
            return date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日 ' 
                + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        } catch (error) {
            return '';
        }
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='我的行程' icon='back'/>
                <View style={{flex:1}}>
                    <FlatList data={this.state.routeList}
                        renderItem={(row)=>{
                            var item = row.item;
                            // row.index
                            return (
                                <View style={{padding: 5, margin:10, marginTop:5, marginBottom:5, borderWidth:1, 
                                    borderColor:'rgb(219,219,219)', borderRadius:3}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={{fontWeight:'bold'}}>{this._toTimeStr(item.time)}</Text>
                                        <Text>已完成</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Icon name='circle' style={{color:'rgb(47,168,32)'}}/>
                                        <Text style={{padding:3, paddingLeft:10}}>{item.from}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Icon name='circle' style={{color:'rgb(243,47,0)'}}/>
                                        <Text style={{padding:3, paddingLeft:10}}>{item.to}</Text>
                                    </View>
                                </View>
                            )
                        }}
                    />

                </View>
            </View>
        );
    }
}

export default RouteList;