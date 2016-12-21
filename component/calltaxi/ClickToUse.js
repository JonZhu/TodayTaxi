/**
 * 点击用车
 * 
 * @author zhujun
 * @date 2016-12-21
 * 
 */

import React, { Component } from 'react';
import { View, Text } from 'react-native';

class ClickToUse extends Component {

    render() {
        return (
            <View style={{alignItems:'center'}}>
                
                <View style={{backgroundColor:'#000', flexDirection:'row', 
                    height:50, borderRadius:25, alignItems:'center', position:'relative',
                    padding: 7}}>
                    <View style={{width:40, height:40, borderWidth:2, borderRadius:20, borderColor:'#fff'}}></View>
                    <Text style={{color:'#fff', fontSize:26, fontWeight:'bold', margin: 7}}>点击用车</Text>
                    <View style={{width:40, height:40, borderWidth:2, borderRadius:20, borderColor:'#fff', 
                        justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:12, height:12, borderBottomWidth:2, borderBottomColor:'#fff', 
                            borderRightWidth:2, borderRightColor:'#fff', transform:[{rotate:'-45deg'}]}}></View>
                    </View>
                </View>
            </View>
        );
    }

}

export default ClickToUse;