/**
 * 司机主页
 * @author zhujun
 * @date 2017-3-13
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ToastAndroid, Button } from 'react-native';
import ToolBar from '../calltaxi/ToolBar';
import Map from '../calltaxi/Map';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapModule from '../../native/MapModule';
import rest from '../api/rest';

class Motorman extends Component {

    constructor() {
        super();

        this._startPushFreeLoc = this._startPushFreeLoc.bind(this);
        this._stopPushRouteLoc = this._stopPushRouteLoc.bind(this);
        this._acceptRoute = this._acceptRoute.bind(this);
        this._rejectRoute = this._rejectRoute.bind(this);
    }

    componentDidMount() {
        // this._startPushFreeLoc();
    }

    componentWillUnmount() {
        this._stopPushRouteLoc();
    }

    // 上传空车位置
    _startPushFreeLoc() {
        function pushFun() {
            // 定位
            MapModule.location().then((result)=>{
                // 定位返回

                // 上传位置到服务器
                return rest('/taxi/pushFreeLoc.do', {lat:result.lat, lng:result.lng, address:result.address});
            }).then((result)=>{
                // 上传空车位置返回
                if (result.code === 0) {
                    // 成功
                    if (result.payload) {
                        // 收到服务器预分配的单
                        this.setState({preAllocateRoute:result.payload});
                    } else {
                        // 等待1秒再上报位置
                        setTimeout(pushFun, 1000);
                    }
                } else {
                    // 上传位置失败
                    ToastAndroid.show(result.message, ToastAndroid.SHORT);
                    // setTimeout(pushFun, 1000);
                }
            }).catch((reason)=>{
                // 出错
                ToastAndroid.show(JSON.stringify(reason), ToastAndroid.LONG);
                // setTimeout(pushFun, 1000);
            });
        };

        pushFun();
    }

    // 接受预分配的行程
    _acceptRoute() {
        var route = this.state.preAllocateRoute;
        rest('/taxi/acceptRoute.do', {passengerId: route.passengerId}).then((result)=>{
            if (result.code === 0) {
                // 关闭接单窗口
                this.setState({routeId:result.payload}); // 存储routeId
                this._startPushRouteLoc(); // 开始上报行程位置
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 拒绝预分配的行程
    _rejectRoute() {
        // TODO
    }

    // 上报行程位置定时器
    _pushRouteLocTimer;

    // 停止上报行程
    _stopPushRouteLoc() {
        if (_pushRouteLocTimer) {
            clearInterval(_pushRouteLocTimer);
            _pushRouteLocTimer = null;
        }
    }

    // 开始上报行程位置
    _startPushRouteLoc() {
        this._stopPushRouteLoc();

        var routeId = this.state.routeId;
        function pushFun() {
            MapModule.location().then((result)=>{
                // 定位返回
                var loc = {lat:result.lat, lng:result.lng, address:result.address};
                // 上传位置到服务器
                return rest('/taxi/pushRouteLoc.do', {routeId:routeId, loc:loc});
            }).then((result)=>{
                // 上报位置返回
                // TODO 处理异常
            });
        }
        _pushRouteLocTimer = setInterval(pushFun, 1000);
    }


    render() {
        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar title='Today Taxi 司机'/>

                <View style={{flex: 1, justifyContent:'center'}}>
                    <Map mapStatusChange={this.props.mapStatusChange} />

                    <View style={{backgroundColor:'rgb(224,224,224)', padding:10}}>
                        <Text>新的行程单</Text>
                        <View style={style.container}>
                            <View style={[style.row, style.fromRow]}>
                                <Icon name='circle' style={style.fromIcon}/>
                                <Text style={style.text}>天府五街</Text>
                            </View>
                        
                            <View style={[style.row, style.goRow]}>
                                <Icon name='circle' style={style.goIcon}/>
                                <Text style={style.text}>天府广场</Text>
                            </View>
                    
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                            <Button title='　拒　绝　' onPress={this._rejectRoute}/>
                            <Button title='　接　受　' onPress={this._acceptRoute}/>
                        </View>
                    </View>

                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgb(224,224,224)',
        borderRadius: 3,
        margin: 15
    },


    fromRow: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(224,224,224)'
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },

    fromIcon: {
        color: 'rgb(47,168,32)'
    },

    goIcon: {
        color: 'rgb(243,47,0)'
    },

    text: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default Motorman;