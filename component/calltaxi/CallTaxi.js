/**
 * 叫车页
 * @date 2016-11-28
 * 
 */

import React, { Component } from 'react';
import { View, BackAndroid, ToastAndroid, Text, TouchableWithoutFeedback, Linking } from 'react-native';
import ToolBar from './ToolBar';
import SideBar from './SideBar';
import FromGo from './FromGo';
import Map from './Map';
import ClickToUse from './ClickToUse';

import UserInfoContainer from '../../redux/container/UserInfoContainer';
import ChoiceGoContainer from '../../redux/container/ChoiceGoContainer';
import MapModule from '../../native/MapModule';
import rest from '../api/rest';
import CallingProgress from './CallingProgress';

class CallTaxi extends Component {

    constructor() {
        super();

        this.state = {showConfirm: false, showClickToUse:true, showFromGo:true};
        // this.state = {showConfirm:false, showClickToUse:false, showCalling:true}; // test

        this._siderBarUserHeadOnPress = this._siderBarUserHeadOnPress.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
        this._gotoChoiceGoAddressPage = this._gotoChoiceGoAddressPage.bind(this);
        this._location = this._location.bind(this);
        this._clickToUse = this._clickToUse.bind(this);
        this._driveRoute = this._driveRoute.bind(this);
        this._confirmCallTaxi = this._confirmCallTaxi.bind(this);
        this._cancelCallTaxi = this._cancelCallTaxi.bind(this);
        this._startSearchNearbyFreeTaxi = this._startSearchNearbyFreeTaxi.bind(this);
        this._stopSearchNearbyFreeTaxi = this._stopSearchNearbyFreeTaxi.bind(this);
        this._showAllocatedTaxi = this._showAllocatedTaxi.bind(this);
        this._mapStatusChange = this._mapStatusChange.bind(this);
    }


    _siderBarUserHeadOnPress() {
        var navigator = this.props.navigator;
        // 跳转到用户信息页
        navigator.push({
            comp: UserInfoContainer
        });

        this.props.toggleSideBar(); // 隐藏side bar
    }

    _onHardwareBackPress() {
        // 处理back键, 关闭sider bar
        if (this.props.sideBar.isShow) {
            this.props.toggleSideBar();
            return true;
        } else {
            return false;
        }
    }

    // 跳转到选择目标地址页
    _gotoChoiceGoAddressPage() {
        var navigator = this.props.navigator;
        // 跳转到选择目标地址页
        navigator.push({
            comp: ChoiceGoContainer
        });
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
        this._location();

        this._startSearchNearbyFreeTaxi();
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    // 定位当前位置
    async _location() {
        try {
            var loc = await MapModule.location();
            console.info('定位结果：');
            console.info(loc);

            this.props.initlocationResult(loc);
        } catch (error) {
            console.error(error);
        }
    }

    // 点击叫车
    _clickToUse() {
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

    // 路线规则、价格预算
    async _driveRoute(from, go) {
        var routes = await MapModule.drivingRoute(from, go);
        var result;
        try {
            result = await rest('/calltaxi/priceBudget', routes);
        } catch (error) {
            ToastAndroid.show('无法连接服务器', ToastAndroid.SHORT);
        }
        
        if (result.code === 0) {
            // 服务端响应成功
            this.setState({
                showConfirm: true,
                priceBudget: result.payload
            });
        } else {
            ToastAndroid.show('价格预算失败', ToastAndroid.SHORT);
        }
    }

    // 用户点击确认乘车
    _confirmCallTaxi() {
        var callTaxi = this.props.callTaxi;
        var from = {...callTaxi.from};
        var to = {...callTaxi.go};
        rest('/calltaxi/callTaxi.do', {from:from, to:to}).then((result)=>{

            if (result.code === 0) {
                // 成功叫车
                ToastAndroid.show('正在叫车:' + JSON.stringify(result), ToastAndroid.LONG);
                this.setState({showConfirm:false, showClickToUse:false, showCalling:true});
                this._startPushWaitTaxiLoc();
            } else {
                ToastAndroid.show(result.message, ToastAndroid.LONG);
            }
        });

    }

    // 开始轮询上报位置, 直到有司机接单或超时
    _startPushWaitTaxiLoc() {
        this._stopPushWaitTaxiLoc();
        var fun = ()=>{
            rest('/calltaxi/pushWaitTaxiLoc.do').then((result)=>{
                if (result.code === 0) {
                    if (result.payload) {
                        // 分配到司机
                        ToastAndroid.show('司机已接单:' + JSON.stringify(result.payload), ToastAndroid.LONG);
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

    _stopPushWaitTaxiLoc() {
        if (this._pushWaitTaxiLocTimer) {
            clearInterval(this._pushWaitTaxiLocTimer);
            this._pushWaitTaxiLocTimer = null;
        }
    }

    // 取消叫车
    _cancelCallTaxi() {
        rest('/calltaxi/cancelRoute.do').then((result)=>{
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
    _startSearchNearbyFreeTaxi() {
        this._stopSearchNearbyFreeTaxi();

        var fun = ()=>{            
            var currentLoc = this.props.callTaxi.from; // 当前位置为开始位置
            if (!currentLoc) {
                return;
            }

            return rest('/calltaxi/searchNearbyFreeTaxi.do', {lat:currentLoc.lat, lng:currentLoc.lng}).then((result)=>{
                var taxiList = null;
                if (result.payload && result.payload.length > 0) {
                    taxiList = [];
                    for (var i = 0; i < result.payload.length; i++) {
                        var resultTaxi = result.payload[i];
                        taxiList.push({
                            id: resultTaxi.id,
                            lng: resultTaxi.loc.lng,
                            lat: resultTaxi.loc.lat,
                            direction:resultTaxi.loc.direction
                        });
                    }
                }
                this.setState({taxiList: taxiList});
            }).catch((reason)=>{
                // 出错
                // 处理异常
                ToastAndroid.show(reason, ToastAndroid.LONG);
            });
        }

        _searchNearbyFreeTaxiTimer = setInterval(fun, 3000);
    }

    _stopSearchNearbyFreeTaxi() {
        if (this._searchNearbyFreeTaxiTimer) {
            clearInterval(this._searchNearbyFreeTaxiTimer);
            this._searchNearbyFreeTaxiTimer = null;
        }
    }


    // 显示被分配的车
    _showAllocatedTaxi(allocatedTaxi) {
        this.setState({allocatedTaxi:allocatedTaxi, showAllocatedTaxi:true, showCalling:false, showFromGo:false});
    }

    // 开始轮询获取被分配车的位置
    _startGetAllocatedTaxiLoc() {
        var taxiId = this.state.allocatedTaxi.taxiId;
        var fun = ()=>{
            rest("/calltaxi/getTaxiLoc.do").then((result)=>{
                if (result.code === 0) {
                    // TODO 显示轨迹
                } else {
                    // 处理异常
                }
            }).catch((reason)=>{
                ToastAndroid.show(reason, ToastAndroid.LONG);
            });
        };

        this._getAllocatedTaxiLocTimer = setInterval(fun, 2000);
    }

    _stopGetAllocatedTaxiLoc() {
        if (this._getAllocatedTaxiLocTimer) {
            clearInterval(this._getAllocatedTaxiLocTimer);
            this._getAllocatedTaxiLocTimer = null;
        }
    }

    // 地图中心点改变事件
    _mapStatusChange(event) {
        this.setState({showConfirm: false}); // 隐藏确认叫车
        this.props.mapStatusChange(event);
    }

    render() {
        var callTaxi = this.props.callTaxi;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar iconOnPress={this.props.toggleSideBar}/>

                <View style={{flex: 1}}>
                    <Map taxies={this.state.taxiList} mapStatusChange={this._mapStatusChange} />

                    {this.state.showFromGo &&
                    <FromGo from={callTaxi.from} go={callTaxi.go} goOnPress={this._gotoChoiceGoAddressPage}/>
                    }

                    {this.state.showClickToUse &&
                    <View style={{position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <View style={{flex:1, alignItems:'center', justifyContent:'flex-end'}}>
                            <ClickToUse onClick={this._clickToUse}/>
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
                <SideBar toggleSideBar={this.props.toggleSideBar} userHeadOnPress={this._siderBarUserHeadOnPress}
                    navigator={this.props.navigator}/>
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
                        padding:5, borderTopWidth:1, borderTopColor:'#E0EEEE', flexDirection:'row', justifyContent:'space-between'}}>
                        <View>
                            <Text>车牌号：{this.state.allocatedTaxi.taxiNumber}</Text>
                            <Text>电　话：{this.state.allocatedTaxi.motormanPhone}</Text>
                        </View>
                        <View>
                            <Text>车型：{this.state.allocatedTaxi.brand} {this.state.allocatedTaxi.model}</Text>
                            <Text>颜色：{this.state.allocatedTaxi.color}</Text>
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
