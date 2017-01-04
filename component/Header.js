/**
 * 页头
 * @author zhujun
 * @date 2017-1-4
 * 
 */

import React, { Component } from 'react';
import { View, Text } from 'react-native';

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

            <Text style={{fontSize:24, fontWeight:'bold'}}>{props.title}</Text>
        </View>
    );
}

export default Header;