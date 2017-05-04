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
                    <View style={{borderLeftWidth:1, marginLeft:20, paddingLeft:-3}}>
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

                    <View></View>
                </View>
            </View>
        )
    }

}

export default RouteInfo;