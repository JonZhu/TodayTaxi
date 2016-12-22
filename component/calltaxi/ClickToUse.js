/**
 * 点击用车
 * 
 * @author zhujun
 * @date 2016-12-21
 * 
 */

import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

class ClickToUse extends Component {

    constructor() {
        super();

        this.state = {rotate:new Animated.Value(0)};
    }

    componentDidMount() {
        var animated = Animated.timing(this.state.rotate, {toValue: 360, duration:5000});
        animated.start();
    }

    render() {
        return (
            <View style={{alignItems:'center'}}>
                
                <View style={{backgroundColor:'#000', flexDirection:'row', 
                    height:40, borderRadius:20, alignItems:'center', position:'relative',
                    padding: 5}}>
                    
                    <View style={{width:circleDiameter, height:circleDiameter, justifyContent:'center', alignItems:'center'}}>
                        <Animated.View style={[style.circle, {transform:[{rotate:this.state.rotate.interpolate({inputRange:[0,360], outputRange:['0deg', '360deg']})}],
                            position:'absolute', top:0, left:0}]}>
                            <View style={{position:'absolute', top:11, left:-1, width:2, height:6, backgroundColor:'#000', 
                                justifyContent:'center', alignItems:'center'}}>
                                <View style={{width:2, height:2, backgroundColor:'#fff', borderRadius:1}}/>
                            </View>
                        </Animated.View>
                        <Text style={{color:'#fff', fontSize:10}}>8</Text>
                        <Text style={{color:'#fff', fontSize:10, position:'relative', top:-3}}>分钟</Text>
                    </View>

                    <Text style={{color:'#fff', fontSize:18, fontWeight:'bold', margin: 7}}>点击用车</Text>

                    <View style={style.circle}>
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


const circleDiameter = 32; // 圆直径

const style = StyleSheet.create({
    circle: {
        width: circleDiameter, 
        height: circleDiameter, 
        borderWidth: 1, 
        borderRadius: circleDiameter/2, 
        borderColor: '#fff', 
        justifyContent: 'center', 
        alignItems: 'center'
    }



    
});


export default ClickToUse;