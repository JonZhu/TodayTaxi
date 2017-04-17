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
import NaviModule, { addNaviArriveWayPointListener } from '../../native/NaviModule';
import MapNaviView from '../../native/MapNaviView';
import rest from '../api/rest';

class Motorman extends Component {

    constructor() {
        super();

        this.state = {showMap:true, showAccept:false};

        this._startPushFreeLoc = this._startPushFreeLoc.bind(this);
        this._stopPushFreeLoc = this._stopPushFreeLoc.bind(this);
        this._startPushRouteLoc = this._startPushRouteLoc.bind(this);
        this._stopPushRouteLoc = this._stopPushRouteLoc.bind(this);
        this._acceptRoute = this._acceptRoute.bind(this);
        this._rejectRoute = this._rejectRoute.bind(this);
        this._arriveRouteFrom = this._arriveRouteFrom.bind(this);
        this._passengerGetOn = this._passengerGetOn.bind(this);
        this._completeRoute = this._completeRoute.bind(this);
        this._cancelRoute = this._cancelRoute.bind(this);
    }

    componentDidMount() {
        this._startPushFreeLoc();
    }

    componentWillUnmount() {
        this._stopPushFreeLoc();
        this._stopPushRouteLoc();
        if (this._naviArriveWayPointListener) {
            this._naviArriveWayPointListener.stop();
            this._naviArriveWayPointListener = null;
        }
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

        var pushFun = ()=>{
            // 定位
            MapModule.location().then((result)=>{
                // 定位返回
                this._currentLoc = {lat:result.lat, lng:result.lng, 
                    address:result.address, direction:result.direction, speed:result.speed}; // 存储当前位置

                // 上传位置到服务器
                return rest('/taxi/pushFreeLoc.do', this._currentLoc);
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

        this._pushFreeLocTimer = setInterval(pushFun, 1000);
    }

    // 接受预分配的行程
    _acceptRoute() {
        var route = this.state.preAllocateRoute;
        rest('/taxi/acceptRoute.do', {passengerId: route.passengerId}).then((result)=>{
            if (result.code === 0) {
                this.setState({routeId:result.payload, showAccept:false}); // 存储routeId, 关闭接单窗口
                this._startNavi(); // 开始导航
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
    _startNavi() {
        var route = this.state.preAllocateRoute;
        var cLoc = this._currentLoc;
        var pointList = [{lng:cLoc.lng, lat:cLoc.lat}, {lng:route.from.lng, lat:route.from.lat}, 
            {lng:route.to.lng, lat:route.to.lat}]; // 从当前位置导航，途经点为行程开始位置
        NaviModule.startNavi(pointList).then(()=>{
            // 导航成功
            this.setState({showMap:false, showNaviView: true}); // 要关闭地图, 导航view才能正确显示
            this._startPushRouteLoc(); // 开始上报行程位置
            this._naviArriveWayPointListener = addNaviArriveWayPointListener(()=>{
                // 到达行程起点, 用于自动设置 到达指定位置
                // TODO
            });
        }).catch((reason)=>{
            // 失败
            ToastAndroid.show('导航失败:' + reason, ToastAndroid.LONG);
            // 
        });
    }

    // 到达行程开始位置
    _arriveRouteFrom() {
        rest('/taxi/arriveRouteFrom.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                ToastAndroid.show('操作成功', ToastAndroid.LONG);
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }


    
    // 乘客上车
    _passengerGetOn() {
        rest('/taxi/passengerGetOn.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                ToastAndroid.show('操作成功', ToastAndroid.LONG);
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 完成行程
    _completeRoute() {
        rest('/taxi/completeRoute.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                ToastAndroid.show('操作成功', ToastAndroid.LONG);
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 取消行程
    _cancelRoute() {
        rest('/taxi/cancelRoute.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                ToastAndroid.show('操作成功', ToastAndroid.LONG);
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }


    render() {
        var preAllocateRoute = this.state.preAllocateRoute;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar title='Today Taxi 司机'/>

                <View style={{flex: 1, justifyContent:'center'}}>
                    {this.state.showMap &&
                    <Map mapStatusChange={this.props.mapStatusChange} />
                    }

                    {this.state.showAccept &&
                    <View style={{backgroundColor:'rgb(224,224,224)', padding:10}}>
                        <Text>新的行程单</Text>
                        <View style={style.container}>
                            <View style={[style.row, style.fromRow]}>
                                <Icon name='circle' style={style.fromIcon}/>
                                <Text style={style.text}>{preAllocateRoute.from.address}</Text>
                            </View>
                        
                            <View style={[style.row, style.goRow]}>
                                <Icon name='circle' style={style.goIcon}/>
                                <Text style={style.text}>{preAllocateRoute.to.address}</Text>
                            </View>
                    
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                            <Button title='　拒　绝　' onPress={this._rejectRoute}/>
                            <Button title='　接　受　' onPress={this._acceptRoute}/>
                        </View>
                    </View>
                    }

                    {this.state.showNaviView &&
                    <View style={{position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <MapNaviView style={{position:'absolute', top:0, bottom:0, left:0, right:0}}/>
                        <View style={{position:'absolute', bottom:0, left:0, right:0}}>
                            <Button title='到达指定位置' onPress={this._arriveRouteFrom}/>
                            <Button title='乘客上车' onPress={this._passengerGetOn}/>
                            <Button title='完成' onPress={this._completeRoute}/>
                            <Button title='取消' onPress={this._cancelRoute}/>
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