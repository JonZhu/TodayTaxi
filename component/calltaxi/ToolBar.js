/**
 * 工具栏
 * 
 * @date 2016-11-28
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class ToolBar extends Component {


    render() {
        return (
            <View style={style.container}>
                <Text style={style.text}>Today Taxi</Text>
                <View style={style.buttonContainer}>
                    <Icon name='bars' style={style.button}/>
                </View>
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
        left: 30,
        height: toolBarHeight,
        justifyContent: 'center'
    },

    button: {
        fontSize: 24
    }
});


export default ToolBar;