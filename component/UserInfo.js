/**
 * 用户信息
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class UserInfo extends Component {
    
    render() {
        const user = this.props.user;

        return (
            <View>
                <View style={style.row}>
                    <Text style={style.fieldName}>姓名</Text>
                    <Text style={style.fieldValue}>{user.name}</Text>
                </View>
                <View style={style.row}>
                    <Text style={style.fieldName}>ID</Text>
                    <Text style={style.fieldValue}>{user.id}</Text>
                </View>
                <View style={style.row}>
                    <Text style={style.fieldName}>姓别</Text>
                    <Text style={style.fieldValue}>{user.sex}</Text>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        padding: 5,
    },

    fieldName: {
        color: '#778899'
    },

    fieldValue: {
        position: 'absolute',
        left: 80
    }

});

export default UserInfo;