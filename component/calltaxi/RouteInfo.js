/**
 * 行程详情
 * @author zhujun
 * @date 2017-5-4
 */

import React, { Component } from 'react';
import { View, ToastAndroid, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Header from '../Header';
import MapView from '../../native/MapView';
import { pageBack } from '../util/back';

class RouteInfo extends Component {

    render() {
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='行程' icon='back' iconOnPress={pageBack.bind(this)}/>
                <View style={{flex:1}}>
                    <View style={{paddingLeft:20, borderBottomWidth:1, borderBottomColor:'#f5f5f5'}}>
                        <View style={{position:'absolute', borderLeftWidth:1, borderLeftColor:'#f5f5f5', top:10, bottom:10, left:25}}/>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name='circle' style={{color:'rgb(47,168,32)'}}/>
                            <Text style={{padding:3, paddingLeft:10}}>双流机场</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name='circle' style={{color:'rgb(243,47,0)'}}/>
                            <Text style={{padding:3, paddingLeft:10}}>天府广场</Text>
                        </View>
                    </View>

                    <MapView style={{flex:1}}/>

                    <View style={{paddingLeft:20, paddingRight:20, borderTopWidth:1, borderTopColor:'#f5f5f5'}}>
                        <Text>车牌：川A888888</Text>
                        <Text>司机：张三</Text>
                        <Text>行程总记：￥37.8元</Text>
                    </View>
                </View>
            </View>
        )
    }

}

export default RouteInfo;