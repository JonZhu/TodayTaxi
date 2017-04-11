/**
 * 地图组件测试
 * 
 * @author zhujun
 * @date 2017-4-5
 */

import React, { Component } from 'react';
import { View, Button, ToastAndroid } from 'react-native';
import MapNaviView from '../../native/MapNaviView';
import MapView from '../../native/MapView';
import NaviModule from '../../native/NaviModule';

class MapViewTest extends Component {

    constructor() {
        super();
        this.state = {showNaviView:false};
        this._testNavi = this._testNavi.bind(this);
        this._testStopNavi = this._testStopNavi.bind(this);
    }

    componentDidMount() {
        
    }


    _testNavi() {
        // 104.063244,30.544046 天府五街
        // 104.077239,30.555243 软件园A区
        NaviModule.startNavi([{lng:104.063244, lat:30.544046, name:'天府五街'}, {lng:104.077239, lat:30.555243, name:'软件园A区'}]).then((value)=>{
            ToastAndroid.show('导航成功', ToastAndroid.LONG);
            this.setState({showNaviView:true});
        }).catch((reason)=>{
            ToastAndroid.show(reason, ToastAndroid.LONG);
        });
    }

    _testStopNavi() {
        NaviModule.stopNavi();
        this.setState({showNaviView:false});
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flexDirection:'row'}}>
                    <Button title='开始导航' onPress={this._testNavi}/>
                    <Button title='停止导航' onPress={this._testStopNavi}/>
                </View>

                <View style={{flex:1}}>
                    {!this.state.showNaviView &&
                    <MapView style={{flex:1, width:'100%'}}/>
                    }
                    {this.state.showNaviView &&
                    <MapNaviView style={{flex:1, width:'100%'}}/>
                    }
                </View>
                
            </View>
        );
    }
}

export default MapViewTest;