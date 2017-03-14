/**
 * 司机主页
 * @author zhujun
 * @date 2017-3-13
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import ToolBar from '../calltaxi/ToolBar';
import Map from '../calltaxi/Map';
import MapModule from '../../native/MapModule';
import rest from '../api/rest';

class Motorman extends Component {

    constructor() {
        super();

        this._startPushFreeLoc = this._startPushFreeLoc.bind(this);
    }

    componentDidMount() {
        this._startPushFreeLoc();
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
                        // TODO
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


    render() {
        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar title='Today Taxi 司机'/>

                <View style={{flex: 1}}>
                    <Map mapStatusChange={this.props.mapStatusChange} />
                </View>
            </View>
        );
    }
}

export default Motorman;