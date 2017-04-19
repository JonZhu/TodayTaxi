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

class CallTaxiTest extends Component {

    constructor() {
        super();

        this.state = {showConfirm: false, showClickToUse:true};
        
    }

    render() {
        var callTaxi = this.props.callTaxi;

        return (
            <View style={{flex:1, backgroundColor: 'rgb(240,239,233)'}}>
                <ToolBar iconOnPress={this.props.toggleSideBar}/>

                <View style={{flex: 1}}>
                    <Map taxies={this.state.taxiList} mapStatusChange={this._mapStatusChange} />
                    <FromGo from={{address:'天府五街'}} go={{address:'天府广场'}} goOnPress={this._gotoChoiceGoAddressPage}/>

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

                {false && 
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

                <TouchableWithoutFeedback onPress={()=>{Linking.openURL('tel:15914725836')}}>
                    <View style={{position:'absolute', bottom:0, left:0, right:0, backgroundColor:'#fff', 
                        padding:5, borderTopWidth:1, borderTopColor:'#E0EEEE', flexDirection:'row', justifyContent:'space-between'}}>
                        <View>
                            <Text>车牌号：川A J456HG</Text>
                            <Text>电　话：15914725836</Text>
                        </View>
                        <View>
                            <Text>车型：大众 朗逸</Text>
                            <Text>颜色：白色</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>

        );
    }

}


export default CallTaxiTest;
