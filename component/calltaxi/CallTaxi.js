/**
 * 叫车页
 * @date 2016-11-28
 * 
 */

import React, { Component } from 'react';
import { View, BackAndroid, ToastAndroid, Text, TouchableWithoutFeedback } from 'react-native';
import ToolBar from './ToolBar';
import SideBar from './SideBar';
import FromGo from './FromGo';
import Map from './Map';
import ClickToUse from './ClickToUse';

import UserInfoContainer from '../../redux/container/UserInfoContainer';
import ChoiceGoContainer from '../../redux/container/ChoiceGoContainer';
import MapModule from '../../native/MapModule';
import rest from '../api/rest';

class CallTaxi extends Component {

    constructor() {
        super();

        this.state = {showConfirm: false};

        this._siderBarUserHeadOnPress = this._siderBarUserHeadOnPress.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
        this._gotoChoiceGoAddressPage = this._gotoChoiceGoAddressPage.bind(this);
        this._location = this._location.bind(this);
        this._clickToUse = this._clickToUse.bind(this);
        this._driveRoute = this._driveRoute.bind(this);
        this._confirmCallTaxi = this._confirmCallTaxi.bind(this);
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
        var result = await rest('/calltaxi/priceBudget', routes);
        
        if (result && result.code === 0) {
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
        //TODO
        ToastAndroid.show('TODO确认乘车逻辑', ToastAndroid.SHORT);
    }

    render() {
        var callTaxi = this.props.callTaxi;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar iconOnPress={this.props.toggleSideBar}/>

                <View style={{flex: 1}}>
                    <Map mapStatusChange={this.props.mapStatusChange} />
                    <FromGo from={callTaxi.from} go={callTaxi.go} goOnPress={this._gotoChoiceGoAddressPage}/>

                    <View style={{position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <View style={{flex:1, alignItems:'center', justifyContent:'flex-end'}}>
                            <ClickToUse onClick={this._clickToUse}/>
                        </View>
                        <View style={{flex:1}}/>
                    </View>
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

                {this.props.sideBar.isShow && <SideBar backgroundOnPress={this.props.toggleSideBar} 
                    userHeadOnPress={this._siderBarUserHeadOnPress}/>}
            </View>

        );
    }

}

CallTaxi.propTypes = {
    toggleSideBar: React.PropTypes.func,
    sideBar: React.PropTypes.object
};

export default CallTaxi;
