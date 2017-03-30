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

        this.state = {showAccept:false};

        this._startPushFreeLoc = this._startPushFreeLoc.bind(this);
        this._stopPushFreeLoc = this._stopPushFreeLoc.bind(this);
        this._startPushRouteLoc = this._startPushRouteLoc.bind(this);
        this._stopPushRouteLoc = this._stopPushRouteLoc.bind(this);
        this._acceptRoute = this._acceptRoute.bind(this);
        this._rejectRoute = this._rejectRoute.bind(this);
    }

    componentDidMount() {
        this._startPushFreeLoc();
    }

    componentWillUnmount() {
        this._stopPushFreeLoc();
        this._stopPushRouteLoc();
    }


    _pushFreeLocTimer;

    // 停止上传空车位置
    _stopPushFreeLoc() {
        if (this._pushFreeLocTimer) {
            clearInterval(this._pushFreeLocTimer);
            this._pushFreeLocTimer = null;
        }
    }

    // 上传空车位置
    _startPushFreeLoc() {
        this._stopPushFreeLoc();

        function pushFun() {
            // 定位
            MapModule.location().then((result)=>{
                // 定位返回

                // 上传位置到服务器
                return rest('/taxi/pushFreeLoc.do', {lat:result.lat, lng:result.lng, 
                    address:result.address, direction:result.direction, speed:result.speed});
            }).then((result)=>{
                // 上传空车位置返回

                // 预分配的单
                let route = result.payload;
                this.setState({preAllocateRoute:route, showAccept:(route != null)});
                if (result.code !== 0) {
                    // 处理异常
                }
            }).catch((reason)=>{
                // 出错
                // 处理异常
            });
        };

        this._pushFreeLocTimer = setInterval(pushFun.bind(this), 1000);
    }

    // 接受预分配的行程
    _acceptRoute() {
        var route = this.state.preAllocateRoute;
        rest('/taxi/acceptRoute.do', {passengerId: route.passengerId}).then((result)=>{
            if (result.code === 0) {
                // 关闭接单窗口
                this.setState({routeId:result.payload}); // 存储routeId
                this._startNavi(route); // 开始导航
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
        if (this._pushRouteLocTimer) {
            clearInterval(this._pushRouteLocTimer);
            this._pushRouteLocTimer = null;
        }
    }

    // 开始上报行程位置
    _startPushRouteLoc() {
        this._stopPushFreeLoc();
        this._stopPushRouteLoc();

        var routeId = this.state.routeId;
        var pushFun = ()=>{
            MapModule.location().then((result)=>{
                // 定位返回
                var loc = {lat:result.lat, lng:result.lng, speed:result.speed, direction:result.direction};
                // 上传位置到服务器
                return rest('/taxi/pushRouteLoc.do', {routeId:routeId, loc:loc});
            }).then((result)=>{
                // 上报位置返回
                // TODO 处理异常
            });
        }
        _pushRouteLocTimer = setInterval(pushFun, 1000);
    }

    // 开始导航
    _startNavi(route) {

    }


    render() {
        var preAllocateRoute = this.state.preAllocateRoute;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar title='Today Taxi 司机'/>

                <View style={{flex: 1, justifyContent:'center'}}>
                    <Map mapStatusChange={this.props.mapStatusChange} />

                    {this.state.showAccept &&
                    <View style={{backgroundColor:'rgb(224,224,224)', padding:10}}>
                        <Text>新的行程单</Text>
                        <View style={style.container}>
                            <View style={[style.row, style.fromRow]}>
                                <Icon name='circle' style={style.fromIcon}/>
                                <Text style={style.text}>{preAllocateRoute.fromAddress}</Text>
                            </View>
                        
                            <View style={[style.row, style.goRow]}>
                                <Icon name='circle' style={style.goIcon}/>
                                <Text style={style.text}>{preAllocateRoute.toAddress}</Text>
                            </View>
                    
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                            <Button title='　拒　绝　' onPress={this._rejectRoute}/>
                            <Button title='　接　受　' onPress={this._acceptRoute}/>
                        </View>
                    </View>
                    }

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