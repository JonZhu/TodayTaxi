/**
 * 司机主页
 * @author zhujun
 * @date 2017-3-13
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ToastAndroid, Button, Linking, BackHandler } from 'react-native';
import ToolBar from '../passenger/ToolBar';
import MapView from '../../native/MapView';
import SideBar from './SideBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapModule from '../../native/MapModule';
import NaviModule, { addNaviArriveWayPointListener } from '../../native/NaviModule';
import MapNaviView from '../../native/MapNaviView';
import rest from '../api/rest';
import RouteStatus from '../const/RouteStatus';

class Motorman extends Component {

    constructor() {
        super();

        this.state = {showMap:true, showAccept:false};
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onHardwareBackPress);

        this._getRouteStatus();
    }

    componentWillUnmount() {
        this._stopPushFreeLoc();
        this._stopPushRouteLoc();
        if (this._naviArriveWayPointListener) {
            this._naviArriveWayPointListener.stop();
            this._naviArriveWayPointListener = null;
        }
        BackHandler.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    /**
     * 从服务器获取行程状态且转到对应操作，用于程序重新进入时返回上次未完成操作
     */
    _getRouteStatus = ()=>{
        rest('/motorman/getCurrentRouteStatus.do').then((result)=>{
            var status = result.payload;
            if (status) {
                this.setState({routeId: status.routeId}); // 设置行程id
                if (status.routeStatus == RouteStatus.ALLOCATED) {
                    // 已接受叫车, 显示乘客信息, 导航
                    MapModule.location().then((loc)=>{ // 定位当前位置
                        var pointList = [{lng:loc.lng, lat:loc.lat}, {lng:status.routeFrom.lng, lat:status.routeFrom.lat}, 
                            {lng:status.routeTo.lng, lat:status.routeTo.lat}];
                        this._startNavi(pointList, ()=>{
                            this.setState({showArriveFromBtn:true, showGetOnBtn:false, showCompleteBtn:false});
                        });
                    })
                } else if (status.routeStatus == RouteStatus.TAXI_ARRIVED) {
                    // 乘客已上车, 显示乘客信息, 导航
                    var pointList = [{lng:status.routeFrom.lng, lat:status.routeFrom.lat}, {lng:status.routeTo.lng, lat:status.routeTo.lat}];
                    this._startNavi(pointList, ()=>{
                        this.setState({showArriveFromBtn:false, showGetOnBtn:true, showCompleteBtn:false});
                    });
                } else if (status.routeStatus == RouteStatus.PASSENGER_GETON) {
                    // 乘客已上车, 显示乘客信息, 导航
                    var pointList = [{lng:status.routeFrom.lng, lat:status.routeFrom.lat}, {lng:status.routeTo.lng, lat:status.routeTo.lat}];
                    this._startNavi(pointList, ()=>{
                        this.setState({showArriveFromBtn:false, showGetOnBtn:false, showCompleteBtn:true});
                    });
                } else {
                    this._startPushFreeLoc();
                }
            } else {
                this._startPushFreeLoc();
            }
        });
    }

    _pushFreeLocTimer;

    // 停止上传空车位置
    _stopPushFreeLoc = ()=>{
        if (this._pushFreeLocTimer) {
            clearInterval(this._pushFreeLocTimer);
            this._pushFreeLocTimer = null;
        }
    }

    // 上传空车位置
    _startPushFreeLoc = ()=>{
        this._stopPushFreeLoc();

        var pushFun = ()=>{
            // 定位
            MapModule.location().then((result)=>{
                // 定位返回
                this._currentLoc = {lat:result.lat, lng:result.lng, 
                    address:result.address, direction:result.direction, speed:result.speed}; // 存储当前位置

                // 上传位置到服务器
                return rest('/motorman/pushFreeLoc.do', this._currentLoc);
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
    _acceptRoute = ()=>{
        var route = this.state.preAllocateRoute;
        rest('/motorman/acceptRoute.do', {passengerId: route.passengerId}).then((result)=>{
            if (result.code === 0) {
                var resp = result.payload;
                var passenger = {phone: resp.passengerPhone, nickname: resp.passengerNickname};
                this.setState({routeId:resp.routeId, passenger:passenger, showAccept:false}); // 存储routeId, 关闭接单窗口

                // 计算导航点列表
                var route = this.state.preAllocateRoute;
                var cLoc = this._currentLoc;
                var pointList = [{lng:cLoc.lng, lat:cLoc.lat}, {lng:route.from.lng, lat:route.from.lat}, 
                    {lng:route.to.lng, lat:route.to.lat}]; // 从当前位置导航，途经点为行程开始位置
                this._startNavi(pointList); // 开始导航
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 拒绝预分配的行程
    _rejectRoute = ()=>{
        // TODO
    }

    // 上报行程位置定时器
    _pushRouteLocTimer;

    // 停止上报行程
    _stopPushRouteLoc = ()=>{
        if (this._pushRouteLocTimer) {
            clearInterval(this._pushRouteLocTimer);
            this._pushRouteLocTimer = null;
        }
    }

    // 开始上报行程位置
    _startPushRouteLoc = ()=>{
        this._stopPushFreeLoc();
        this._stopPushRouteLoc();

        var routeId = this.state.routeId;
        var pushFun = ()=>{
            MapModule.location().then((result)=>{
                // 定位返回
                var loc = {lat:result.lat, lng:result.lng, speed:result.speed, direction:result.direction};
                // 上传位置到服务器
                return rest('/motorman/pushRouteLoc.do', {routeId:routeId, loc:loc});
            }).then((result)=>{
                // 上报位置返回
                // TODO 处理异常
            });
        }
        this._pushRouteLocTimer = setInterval(pushFun, 1000);
    }

    /**
     * 开始导航
     * @param pointList 点列表, [{lng, lat}]
     * @param successCallback 成功导航后的回调
     */
    _startNavi = (pointList, successCallback)=>{
        NaviModule.startNavi(pointList).then(()=>{
            // 导航成功
            this.setState({showMap:false, showNaviView: true, showArriveFromBtn:true}); // 要关闭地图, 导航view才能正确显示
            this._startPushRouteLoc(); // 开始上报行程位置
            // this._naviArriveWayPointListener = addNaviArriveWayPointListener(()=>{
            //     // 到达行程起点, 用于自动设置 到达指定位置
            //     // TODO
            // });
            if (successCallback) {
                successCallback();
            }
        }).catch((reason)=>{
            // 失败
            ToastAndroid.show('导航失败:' + reason, ToastAndroid.LONG);
            // 
        });
    }

    // 到达行程开始位置
    _arriveRouteFrom = ()=>{
        rest('/motorman/arriveRouteFrom.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                ToastAndroid.show('操作成功', ToastAndroid.LONG);
                this.setState({showArriveFromBtn:false, showGetOnBtn:true}); // 显示乘客上车按钮
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 乘客上车
    _passengerGetOn = ()=>{
        rest('/motorman/passengerGetOn.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                ToastAndroid.show('操作成功', ToastAndroid.LONG);
                this.setState({showGetOnBtn:false, showCompleteBtn:true}); // 显示完成按钮

                // 重新从当前位置导航到目的地
                var route = this.state.preAllocateRoute;
                var cLoc = this._currentLoc;
                var pointList = [{lng:cLoc.lng, lat:cLoc.lat}, {lng:route.to.lng, lat:route.to.lat}];
                this._startNavi(pointList); // 重新导航
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 完成行程
    _completeRoute = ()=>{
        rest('/motorman/completeRoute.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
            if (result.code === 0) {
                // 成功
                NaviModule.stopNavi(); // 停止导航
                this._stopPushRouteLoc(); // 停止上传行程位置
                this._startPushFreeLoc(); // 开始上传空车位置
                var realPrice = result.payload;
                ToastAndroid.show('操作成功:' + JSON.stringify(realPrice), ToastAndroid.LONG);
                this.setState({showCompleteBtn:false, showNaviView:false, showMap:true, 
                    realPrice:realPrice}); // 显示地图、实际价格
            } else {
                ToastAndroid.show('操作失败:' + result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    // 取消行程
    _cancelRoute = ()=>{
        rest('/motorman/cancelRoute.do', {routeId: this.state.preAllocateRoute.routeId}).then((result)=>{
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

    // 显示或关闭SideBar
    _toggleSideBar = ()=>{
        this.setState({showSideBar:this.state.showSideBar ? false : true});
    }

    _onHardwareBackPress = ()=>{
        // 处理back键, 关闭sider bar
        if (this.state.showSideBar) {
            this._toggleSideBar();
            return true;
        } else {
            return false;
        }
    }

    render() {
        var preAllocateRoute = this.state.preAllocateRoute;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar title='Today Taxi 司机' iconOnPress={this._toggleSideBar}/>

                <View style={{flex: 1, justifyContent:'center'}}>
                    {this.state.showMap &&
                    <MapView style={{position: 'absolute',top: 0,left: 0,right: 0,bottom: 0}} />
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
                        
                        <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', padding:5, 
                            borderTopWidth:1, borderTopColor:'#E0EEEE', flexDirection:'row', justifyContent:'space-between'}}>
                            <TouchableWithoutFeedback onPress={()=>{Linking.openURL('tel:' + this.state.passenger.phone)}}>
                                <View>
                                    <Text>乘客：{this.state.passenger.nickname}</Text>
                                    <Text>电话：{this.state.passenger.phone}</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            {this.state.showArriveFromBtn &&
                            <Button title='到达上车点' onPress={this._arriveRouteFrom}/>
                            }

                            {this.state.showGetOnBtn &&
                            <Button title='乘客上车' onPress={this._passengerGetOn}/>
                            }

                            {this.state.showCompleteBtn && // 完成按钮
                            <View style={{flexDirection:'row'}}>
                                <Button title='完成' onPress={this._completeRoute}/>
                                <View style={{width:10}}/>
                                <Button title='取消' onPress={this._cancelRoute}/>
                            </View>
                            }
                        </View>

                    </View>
                    }

                </View>

                {this.state.showSideBar && 
                <SideBar toggleSideBar={this._toggleSideBar} navigation={this.props.navigation}/>
                }

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