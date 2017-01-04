/**
 * 叫车页
 * @date 2016-11-28
 * 
 */

import React, { Component } from 'react';
import { View, BackAndroid } from 'react-native';
import ToolBar from './ToolBar';
import SideBar from './SideBar';
import FromGo from './FromGo';
import Map from './Map';
import ClickToUse from './ClickToUse';

import UserInfoContainer from '../../redux/container/UserInfoContainer';

class CallTaxi extends Component {

    constructor() {
        super();

        this._siderBarUserHeadOnPress = this._siderBarUserHeadOnPress.bind(this);
        this._onHardwareBackPress = this._onHardwareBackPress.bind(this);
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

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this._onHardwareBackPress);
    }

    render() {
        var callTaxi = this.props.callTaxi;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar iconOnPress={this.props.toggleSideBar}/>

                <View style={{flex: 1}}>
                    <Map mapStatusChange={this.props.mapStatusChange} />
                    <FromGo from={callTaxi.from} go={callTaxi.go}/>

                    <View style={{position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <View style={{flex:1, alignItems:'center', justifyContent:'flex-end'}}>
                            <ClickToUse/>
                        </View>
                        <View style={{flex:1}}/>
                    </View>
                </View>

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
