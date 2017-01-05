/**
 * 页头
 * @author zhujun
 * @date 2017-1-4
 * 
 */

import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function Header(props) {
    return (
        <View style={{padding:20, 
            paddingTop: 10,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgb(242,242,242)',
            backgroundColor: '#fff',
            alignItems: 'center'
        }}>
            {props.icon && 
            <TouchableWithoutFeedback onPress={props.iconOnPress}>
                <View style={style.buttonContainer}>
                    <Icon name='angle-left' style={style.button}/>
                </View>
            </TouchableWithoutFeedback>
            }

            <Text style={style.text}>{props.title}</Text>
        </View>
    );
}

Header.propTypes = {
    title: React.PropTypes.string,
    icon: React.PropTypes.oneOf(['back']),
    iconOnPress: React.PropTypes.func
};

const style = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: 'bold'
    },

    buttonContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingLeft: 10, // 点击焦点
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 20,
        justifyContent: 'center',
        // backgroundColor: '#f00'
    },

    button: {
        fontSize: 24
    }
});

export default Header;