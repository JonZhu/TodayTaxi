/**
 * 司机行程详情
 * @author zhujun
 * @date 2017-5-4
 */

import React, { Component, PropTypes } from 'react';
import { View, ToastAndroid, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../Header';
import MapView from '../../native/MapView';
import { pageBack } from '../util/back';
import rest from '../api/rest';

class RouteInfo extends Component {

    state = {};

    componentDidMount() {
        var routeId = this.props.routeId;
        rest('/route/getMotormanRouteInfo.do', {routeId: routeId}).then((result)=>{
            var route = result.payload;
            if (route) {
                this.setState({route:route});
                this._showRoute(route);
            } else {
                ToastAndroid.show('无行程数据', ToastAndroid.LONG);
            }
        }).catch((reason)=>{
            ToastAndroid.show('获取行程数据出错:' + reason, ToastAndroid.LONG);
        });
    }

    _showRoute = (route)=>{
        this._mapView.showRoute([{lng:route.fromLng, lat:route.fromLat}, {lng:route.toLng, lat:route.toLat}]); // 显示行程
        // 扩大显示范围
        this._mapView.setMapBoundEnlarge([{lng:route.fromLng, lat:route.fromLat}, {lng:route.toLng, lat:route.toLat}]);
    }


    render() {
        var route = this.state.route ? this.state.route : {};
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='行程' icon='back' iconOnPress={pageBack.bind(this)}/>
                <View style={{flex:1}}>
                    <View style={{paddingLeft:20, borderBottomWidth:1, borderBottomColor:'#f5f5f5'}}>
                        <View style={{position:'absolute', borderLeftWidth:1, borderLeftColor:'#f5f5f5', top:10, bottom:10, left:25}}/>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name='circle' style={{color:'rgb(47,168,32)'}}/>
                            <Text style={{padding:3, paddingLeft:10}}>{route.fromAddress}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name='circle' style={{color:'rgb(243,47,0)'}}/>
                            <Text style={{padding:3, paddingLeft:10}}>{route.toAddress}</Text>
                        </View>
                    </View>

                    <MapView ref={(mapView)=>{this._mapView = mapView}} style={{flex:1}} showMyLoc={false} showMyLocBtn={false} />

                    <View style={{paddingLeft:20, paddingRight:20, borderTopWidth:1, borderTopColor:'#f5f5f5'}}>
                        <Text>乘客：{route.passengerNickname}</Text>
                        <Text>行程总记：￥{route.realPrice}元</Text>
                    </View>
                </View>
            </View>
        )
    }

}

RouteInfo.protoTypes = {
    routeId: PropTypes.string.isRequired
}

export default RouteInfo;