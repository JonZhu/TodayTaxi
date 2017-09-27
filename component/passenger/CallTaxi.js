/**
 * 叫车页
 * @date 2016-11-28
 * 
 */

import React, { Component } from 'react';
import { View, BackHandler, ToastAndroid, Text, TouchableWithoutFeedback, Linking } from 'react-native';
import ToolBar from './ToolBar';
import SideBar from './SideBar';
import FromGo from './FromGo';
import MapView from '../../native/MapView';
import ClickToUse from './ClickToUse';

import MapModule from '../../native/MapModule';
import rest from '../api/rest';
import CallingProgress from './CallingProgress';
import RouteStatus from '../const/RouteStatus';

class CallTaxi extends Component {

    constructor() {
        super();

        this.state = {showConfirm: false, showClickToUse:true, showFromGo:true, 
            waitTaxiMinites:8, // 等车预计时间
            clickToUseText:'点击用车', // 点击用车text
            clickToUseEnable: true // 点击用车是否可点击
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onHardwareBackPress);
        this._location();

        // 获取当前叫车状态，转到适合的叫车中间流程
        rest('/passenger/getCurrentCallTaxiStatus.do').then((result)=>{
            var status = result.payload;
            if (status == null || status == RouteStatus.UN_START || status == RouteStatus.MOTORMAN_CANCEL || 
                status == RouteStatus.PASSENGER_CANCEL || status == RouteStatus.CALL_TIMEOUT || status == RouteStatus.COMPLETE) {
                // 未叫车或已结束
                this._startSearchNearbyFreeTaxi();
            } else {
                // 已叫车、但还没结束
                this._startPushWaitTaxiLoc();
            }
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
        
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onHardwareBackPress);

        this._stopSearchNearbyFreeTaxi();
        this._stopPushWaitTaxiLoc();
        this._stopGetAllocatedTaxiLoc();
    }

    _onHardwareBackPress = ()=>{
        // 处理back键, 关闭sider bar
        if (this.props.sideBar.isShow) {
            this.props.toggleSideBar();
            return true;
        } else {
            return false;
        }
    }

    // 跳转到选择目标地址页
    _gotoChoiceGoAddressPage = ()=>{
        // 跳转到选择目标地址页
        this.props.navigation.navigate('ChoiceGo');
    }

    // 定位当前位置
    _location = ()=>{
        MapModule.location().then((loc)=>{
            console.info('定位结果：');
            console.info(loc);
            this.props.initlocationResult(loc);
        }).catch((reason)=>{
            console.error(error);
        });
    }

    // 点击叫车
    _clickToUse = ()=>{
        var {from, go} = this.props.callTaxi;
        if (from.locationed !== true) {
            ToastAndroid.show('开始位置未定位,请稍后', ToastAndroid.SHORT);
            return;
        }

        if (go.locationed !== true) {
            // 目标地址未选择
            this._gotoChoiceGoAddressPage();
            return;
        }

        this._driveRoute({lat:from.lat, lng:from.lng}, {lat:go.lat, lng:go.lng});
    }

    // 路线规划、价格预算
    _driveRoute = (from, go)=>{
        MapModule.drivingRoute(from, go).then((routes)=>{
            // 路线规划返回
            return rest('/passenger/priceBudget.do', routes); // 价格预算
        }).then((result)=>{
            // 价格预算返回
            if (result.code === 0) {
                // 服务端响应成功
                this.setState({
                    showConfirm: true,
                    priceBudget: result.payload
                });
            } else {
                ToastAndroid.show('价格预算:' + result.message, ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show('价格预算出错:' + reason, ToastAndroid.LONG);
        });
    }

    // 用户点击确认乘车
    _confirmCallTaxi = ()=>{
        var callTaxi = this.props.callTaxi;
        var from = {...callTaxi.from};
        var to = {...callTaxi.go};
        rest('/passenger/callTaxi.do', {from:from, to:to}).then((result)=>{
            if (result.code === 0) {
                // 成功叫车
                // ToastAndroid.show('正在叫车:' + JSON.stringify(result), ToastAndroid.LONG);
                this._startPushWaitTaxiLoc();
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        });

    }

    // 开始轮询上报位置, 直到有司机接单或超时
    _startPushWaitTaxiLoc = ()=>{
        this._stopPushWaitTaxiLoc();
        this.setState({showConfirm:false, showClickToUse:false, showCalling:true});

        var fun = ()=>{
            rest('/passenger/pushWaitTaxiLoc.do').then((result)=>{
                if (result.code === 0) {
                    if (result.payload) {
                        // 分配到司机
                        ToastAndroid.show('司机已接单', ToastAndroid.LONG);
                        this._stopPushWaitTaxiLoc();
                        var allocatedTaxi = result.payload;
                        this._showAllocatedTaxi(allocatedTaxi);
                        this._startGetAllocatedTaxiLoc();
                    } else {
                        // 还未分配到司机, 继续轮询
                        
                    }
                } else {
                    // 出错
                    this._stopPushWaitTaxiLoc(); // 停止轮询
                    ToastAndroid.show(result.message, ToastAndroid.LONG);
                    this.setState({showConfirm:false, showClickToUse:true, showCalling:false}); // 回到叫车状态
                }
            }).catch((reason)=>{
                ToastAndroid.show(reason, ToastAndroid.LONG);
                // 未知异常, 继续轮询
            });
        };

        this._pushWaitTaxiLocTimer = setInterval(fun, 1000);
    }

    _stopPushWaitTaxiLoc = ()=>{
        if (this._pushWaitTaxiLocTimer) {
            clearInterval(this._pushWaitTaxiLocTimer);
            this._pushWaitTaxiLocTimer = null;
        }
    }

    // 取消叫车
    _cancelCallTaxi = ()=>{
        rest('/passenger/cancelRoute.do').then((result)=>{
            if (result.code === 0) {
                ToastAndroid.show('发送取消请求成功', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('取消失败:' + result.message, ToastAndroid.SHORT);
            }
        }).catch((reason)=>{
            ToastAndroid.show('取消失败:' + reason, ToastAndroid.SHORT);
        });
    }


    _searchNearbyFreeTaxiTimer;

    // 搜索附近空车
    _startSearchNearbyFreeTaxi = ()=>{
        this._stopSearchNearbyFreeTaxi();

        var fun = ()=>{            
            var currentLoc = this.props.callTaxi.from; // 当前位置为开始位置
            if (!currentLoc) {
                return;
            }

            return rest('/passenger/searchNearbyFreeTaxi.do', {lat:currentLoc.lat, lng:currentLoc.lng}).then((result)=>{
                var taxiList = null;
                var waitMinites = this.state.waitTaxiMinites; // 预计等待时长
                if (result.payload && result.payload.length > 0) {
                    taxiList = [];
                    for (var i = 0; i < result.payload.length; i++) {
                        var resultTaxi = result.payload[i];
                        if (i == 0 && resultTaxi.distance) {
                            waitMinites = Math.ceil(resultTaxi.distance / 500); //distance单位为米，按 30km/小时即500m/分钟算
                        }
                        taxiList.push({
                            id: resultTaxi.id,
                            lng: resultTaxi.loc.lng,
                            lat: resultTaxi.loc.lat,
                            direction: resultTaxi.loc.direction
                        });
                    }
                }
                this.setState({taxiList:taxiList, waitTaxiMinites:waitMinites});
            }).catch((reason)=>{
                // 出错
                // 处理异常
                ToastAndroid.show(reason, ToastAndroid.LONG);
            });
        }

        _searchNearbyFreeTaxiTimer = setInterval(fun, 3000);
    }

    _stopSearchNearbyFreeTaxi = ()=>{
        if (this._searchNearbyFreeTaxiTimer) {
            clearInterval(this._searchNearbyFreeTaxiTimer);
            this._searchNearbyFreeTaxiTimer = null;
        }
    }


    // 显示被分配的车
    _showAllocatedTaxi = (allocatedTaxi)=>{
        this.setState({allocatedTaxi:allocatedTaxi, showAllocatedTaxi:true, showCalling:false, showFromGo:false});
    }

    // 开始轮询获取被分配车的位置
    _startGetAllocatedTaxiLoc = ()=>{
        var taxiId = this.state.allocatedTaxi.taxiId;
        var fun = ()=>{
            rest("/passenger/getTaxiLoc.do").then((result)=>{
                if (result.code === 0) {
                    var {status, loc} = result.payload;
                    if (status === RouteStatus.UN_START || status === RouteStatus.COMPLETE || 
                        status === RouteStatus.MOTORMAN_CANCEL) {
                        // 如果状态变为：未开始、完成、司机取消，回到未叫车状态
                        this._stopGetAllocatedTaxiLoc();
                        this.setState({showConfirm: false, showClickToUse:true, showFromGo:true, showAllocatedTaxi:false});
                    } else {
                        var oldStatus = this.state.callTaxiStatus;

                        var statusStr;
                        if (staus == RouteStatus.MOTORMAN_CANCEL) {
                            statusStr = '司机将行程取消';
                        } else if (status == RouteStatus.TAXI_ARRIVED) {
                            statusStr = '司机已到达';
                        } else if (status == RouteStatus.PASSENGER_GETON) {
                            statusStr = '乘客已上车';
                        }

                        // 显示轨迹
                        this.setState({
                            taxiList:[{id:taxiId, lng:loc.lng, lat:loc.lat, direction:loc.direction}], // 显示taxi
                            callTaxiStatus:status, // 状态
                            callTaxiStatusStr:statusStr // 状态转换
                        }); 
                        this._mapView.move({lng:loc.lng, lat:loc.lat}); // 地图中心移动到taxi位置

                        // 状态改变提醒
                        if (status != oldStatus && statusStr) {
                            ToastAndroid.show(statusStr, ToastAndroid.LONG);
                        }
                    }
                } else {
                    // 处理异常
                }
            }).catch((reason)=>{
                ToastAndroid.show(reason, ToastAndroid.LONG);
            });
        };

        this._getAllocatedTaxiLocTimer = setInterval(fun, 2000);
    }

    _stopGetAllocatedTaxiLoc = ()=>{
        if (this._getAllocatedTaxiLocTimer) {
            clearInterval(this._getAllocatedTaxiLocTimer);
            this._getAllocatedTaxiLocTimer = null;
        }
    }

    // 地图中心点改变事件
    _mapStatusChange = (event)=>{
        this.setState({showConfirm: false}); // 隐藏确认叫车
        this.props.mapStatusChange(event);
    }

    render() {
        var callTaxi = this.props.callTaxi;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar iconOnPress={this.props.toggleSideBar}/>

                <View style={{flex: 1}}>
                    <MapView ref={(mapView)=>{this._mapView = mapView}} style={{position: 'absolute',top: 0,left: 0,right: 0,bottom: 0}} 
                        taxies={this.state.taxiList} onStatusChange={this._mapStatusChange} />

                    {this.state.showFromGo &&
                    <FromGo from={callTaxi.from} go={callTaxi.go} goOnPress={this._gotoChoiceGoAddressPage}/>
                    }

                    {this.state.showClickToUse &&
                    <View style={{position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <View style={{flex:1, alignItems:'center', justifyContent:'flex-end'}}>
                            <ClickToUse onClick={this._clickToUse} minites={this.state.waitTaxiMinites} 
                                text={this.state.clickToUseText} clickEnable={this.state.clickToUseEnable}/>
                        </View>
                        <View style={{flex:1}}/>
                    </View>
                    }
                </View>

                {this.state.showConfirm && 
                <View style={{position:'absolute', bottom:15, left:15, right:15, }}>
                    <View style={{borderWidth:1, borderColor: 'rgb(224,224,224)', backgroundColor: '#fff', borderRadius: 3, 
                        padding:15, alignItems:'center'}}>
                        <Text style={{fontSize:20}}>预计{this.state.priceBudget}￥</Text>
                    </View>

                    <TouchableWithoutFeedback onPress={this._confirmCallTaxi}>
                        <View style={{backgroundColor: '#000', borderRadius: 3, 
                            padding:15, marginTop:10, alignItems:'center'}}>
                            <Text style={{color:'#fff', fontSize:18}}>确认乘车</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                }

                {this.props.sideBar.isShow && 
                <SideBar toggleSideBar={this.props.toggleSideBar} navigation={this.props.navigation}/>
                }

                {this.state.showCalling && 
                <View style={{position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:'rgba(255,255,255,0.2)', 
                    justifyContent:'flex-end', alignItems:'center'}}>
                    
                    <TouchableWithoutFeedback onLongPress={this._cancelCallTaxi}>
                        <View style={{borderRadius:20, borderWidth:1, borderColor:'#838B8B', margin:20, padding:10, backgroundColor:'rgb(243,243,243)'}}>
                            <Text>长按取消</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <CallingProgress/>
                </View>
                }

                {this.state.showAllocatedTaxi && 
                <TouchableWithoutFeedback onPress={()=>{Linking.openURL('tel:' + this.state.allocatedTaxi.motormanPhone)}}>
                    <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', 
                        padding:5, borderTopWidth:1, borderTopColor:'#E0EEEE'}}>
                        {this.state.callTaxiStatusStr && 
                        <Text>状态：{this.state.callTaxiStatusStr}</Text>
                        }
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View>
                                <Text>车牌号：{this.state.allocatedTaxi.taxiNumber}</Text>
                                <Text>电　话：{this.state.allocatedTaxi.motormanPhone}</Text>
                            </View>
                            <View>
                                <Text>车型：{this.state.allocatedTaxi.brand} {this.state.allocatedTaxi.model}</Text>
                                <Text>颜色：{this.state.allocatedTaxi.color}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                }
            </View>

        );
    }

}

CallTaxi.propTypes = {
    toggleSideBar: React.PropTypes.func,
    sideBar: React.PropTypes.object
};

export default CallTaxi;
