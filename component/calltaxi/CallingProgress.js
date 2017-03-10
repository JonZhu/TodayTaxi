/**
 * 正在叫车进度条
 * @author zhujun
 * @date 2017-3-10
 */

import React, { Component } from 'react';
import { View, Animated, Dimensions } from 'react-native';

class CallingProgress extends Component {

    constructor() {
        super();
        this.state = {width:new Animated.Value(10)};
        this._startAnimate = this._startAnimate.bind(this);
    }

    componentDidMount() {
        this._startAnimate();
    }

    componentWillUnmount() {
        if (_animated) {
            _animated.stop();
        }
        _animated = null;
    }

    _animated;

    _startAnimate() {
        this.state.width.setValue(10);
        var windowWidth = Dimensions.get('window').width;
        _animated = Animated.timing(this.state.width, {toValue: windowWidth, duration:3000});
        _animated.start(()=>{this._startAnimate()});
    }



    render() {
        return (
            <Animated.View style={{height:5, width:this.state.width, backgroundColor:'rgb(0,122,204)'}}></Animated.View>
        );
    }
}

export default CallingProgress;