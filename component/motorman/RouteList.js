/**
 * 司机行程列表
 * @author zhujun
 * @date 2017-4-25
 */

import React, { Component } from 'react';
import { View, ToastAndroid, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import Header from '../Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import rest from '../api/rest';
import { pageBack } from '../util/back';
import { toTimeStr } from '../util/date';

class RouteList extends Component {
    constructor() {
        super();
        this.state = {routeList: [], refreshing:false};
    }

    componentDidMount() {
        this._queryNextPageRoute();
    }

    // 下位刷新列表
    _refreshRouteList = ()=>{
        this.state.routeList = []; // 清空原来数据
        this._queryNextPageRoute();
    }

    // 上拉, 查询下一页行程数据
    _queryNextPageRoute = ()=>{
        var param = {pageSize: 20};
        var routeList = this.state.routeList;
        if (routeList != null && routeList.length > 0) {
            param.timeBefore = routeList[routeList.length - 1].startTime; // 取上一页最后一条数据的时间
        }

        rest('/route/getMotormanRouteList.do', param).then((result)=>{
            if (result.code === 0) {
                routeList = this._concatRouteList(routeList, result.payload);
                this.setState({routeList: routeList, refreshing:false});
                // this.setState({refreshing:false});
            } else {
                this.setState({refreshing:false});
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            this.setState({refreshing:false});
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
        this.setState({refreshing:true});
    }

    // 合并行程数据
    _concatRouteList = (oldList, newList)=>{
        if (oldList == null) {
            oldList = [];
        }

        if (newList != null && newList.length > 0) {
            for (var i = 0; i < newList.length; i++) {
                var route = newList[i];
                route.key = route.id; // 根据flatlist，设置key字段
                oldList.push(route);
            }
        }

        return oldList;

    }

    // 状态映射
    _statusMap = {
        11: '分配司机',
        20: '司机取消',
        21: '乘客取消',
        30: '司机已到达',
        31: '已上车',
        40: '完成'
    }

    // 转换状态
    _toConvertStatus = (status)=>{
        var s = this._statusMap[status];
        return s ? s : "--";
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='我的行程' icon='back' iconOnPress={pageBack.bind(this)}/>
                <View style={{flex:1}}>
                    <FlatList data={this.state.routeList} onEndReached={this._queryNextPageRoute} refreshing={this.state.refreshing} onRefresh={this._refreshRouteList}
                        renderItem={(row)=>{
                            var item = row.item;
                            // row.index
                            return (
                                <View style={{padding: 5, margin:10, marginTop:5, marginBottom:5, borderWidth:1, 
                                    borderColor:'rgb(219,219,219)', borderRadius:3}}>
                                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                        <Text style={{fontWeight:'bold'}}>{toTimeStr(item.startTime)}</Text>
                                        <Text>{this._toConvertStatus(item.status)}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Icon name='circle' style={{color:'rgb(47,168,32)'}}/>
                                        <Text style={{padding:3, paddingLeft:10}}>{item.fromAddress}</Text>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Icon name='circle' style={{color:'rgb(243,47,0)'}}/>
                                        <Text style={{padding:3, paddingLeft:10}}>{item.toAddress}</Text>
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