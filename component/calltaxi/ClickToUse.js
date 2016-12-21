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
                    height:40, borderRadius:20, alignItems:'center', position:'relative',
                    padding: 5}}>
                    
                    <View style={{width:32, height:32, borderWidth:1, borderRadius:16, borderColor:'#fff', 
                        justifyContent:'center', alignItems:'center'}}>
                        <Text style={{color:'#fff', fontSize:10}}>8</Text>
                        <Text style={{color:'#fff', fontSize:10, position:'relative', top:-3}}>分钟</Text>
                    </View>

                    <Text style={{color:'#fff', fontSize:18, fontWeight:'bold', margin: 7}}>点击用车</Text>

                    <View style={{width:32, height:32, borderWidth:1, borderRadius:16, borderColor:'#fff', 
                        justifyContent:'center', alignItems:'center'}}>
                        <View style={{width:12, height:12, borderBottomWidth:2, borderBottomColor:'#fff', 
                            borderRightWidth:2, borderRightColor:'#fff', transform:[{rotate:'-45deg'}]}}></View>
                    </View>
                </View>

                <View style={{width:10, height:10, backgroundColor:'#000', transform:[{rotate:'45deg'}],
                    position:'relative', top:-5}}/>
                
                <View style={{width:2, height:12, backgroundColor:'#000', position:'relative', top:-5}}/>

            </View>
        );
    }

}

export default ClickToUse;