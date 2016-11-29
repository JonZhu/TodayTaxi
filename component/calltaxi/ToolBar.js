/**
 * 工具栏
 * 
 * @date 2016-11-28
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class ToolBar extends Component {

    constructor() {
        super();
        
    }

    render() {
        return (
            <View style={style.container}>
                <Text style={style.text}>Today Taxi</Text>

                <TouchableWithoutFeedback onPress={()=>this.props.iconOnPress()}>
                    <View style={style.buttonContainer}>
                        <Icon name='bars' style={style.button}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );

    }
}

const toolBarHeight = 60;

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: toolBarHeight,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(242,242,242)',
        backgroundColor: '#fff'
    },

    text: {
        fontSize: 28,
        fontWeight: 'bold'
    },

    buttonContainer: {
        position: 'absolute',
        left: 0,
        paddingLeft: 30, // 点击焦点
        paddingRight: 30,
        height: toolBarHeight,
        justifyContent: 'center'
    },

    button: {
        fontSize: 24
    }
});


export default ToolBar;