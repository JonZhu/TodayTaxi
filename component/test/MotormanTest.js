/**
 * 司机主页
 * @author zhujun
 * @date 2017-3-13
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ToastAndroid, Button, Linking } from 'react-native';
import ToolBar from '../passenger/ToolBar';
import Map from '../passenger/Map';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapModule from '../../native/MapModule';
import NaviModule, { addNaviArriveWayPointListener } from '../../native/NaviModule';
import MapNaviView from '../../native/MapNaviView';
import rest from '../api/rest';

class MotormanTest extends Component {

    constructor() {
        super();
        this.state = {
            preAllocateRoute: {}
        };
    }

    render() {
        var preAllocateRoute = this.state.preAllocateRoute;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar title='Today Taxi 司机'/>

                <View style={{flex: 1, justifyContent:'center'}}>
                    {/*<Map />*/}

                    
                    {/*<View style={{backgroundColor:'rgb(224,224,224)', padding:10}}>
                        <Text>新的行程单</Text>
                        <View style={style.container}>
                            <View style={[style.row, style.fromRow]}>
                                <Icon name='circle' style={style.fromIcon}/>
                                <Text style={style.text}>华府大道</Text>
                            </View>
                        
                            <View style={[style.row, style.goRow]}>
                                <Icon name='circle' style={style.goIcon}/>
                                <Text style={style.text}>天府广场</Text>
                            </View>
                    
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                            <Button title='　拒　绝　' onPress={this._rejectRoute}/>
                            <Button title='　接　受　' onPress={this._acceptRoute}/>
                        </View>
                    </View>*/}
                    

                    
                    <View style={{position:'absolute', top:0, bottom:0, left:0, right:0}}>
                        <MapNaviView style={{position:'absolute', top:0, bottom:0, left:0, right:0}}/>
                        <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', padding:5, 
                            borderTopWidth:1, borderTopColor:'#E0EEEE', flexDirection:'row', justifyContent:'space-between'}}>
                            <TouchableWithoutFeedback onPress={()=>{Linking.openURL('tel:15912345678')}}>
                                <View>
                                    <Text>乘客：张先生</Text>
                                    <Text>电话：15912345678</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            <Button title='到达上车点' onPress={this._arriveRouteFrom}/>

                            {/*<Button title='乘客上车' onPress={this._passengerGetOn}/>

                            <View style={{flexDirection:'row'}}>
                                <Button title='完成' onPress={this._completeRoute}/>
                                <View style={{width:10}}/>
                                <Button title='取消' onPress={this._cancelRoute}/>
                            </View>*/}
                        </View>
                    </View>
                    
                </View>
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

export default MotormanTest;