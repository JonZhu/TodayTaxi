/**
 * 用户信息
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from './Header';
import { pageBack } from './util/back';

class UserInfo extends Component {
    constructor() {
        super();
    }


    render() {
        const user = this.props.user;

        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <Header title='用户信息' icon='back' iconOnPress={pageBack.bind(this)}/>
                <View style={style.row}>
                    <Text style={style.fieldName}>ID</Text>
                    <Text style={style.fieldValue}>{user.userId}</Text>
                </View>
                <View style={style.row}>
                    <Text style={style.fieldName}>昵称</Text>
                    <Text style={style.fieldValue}>{user.nickname}</Text>
                </View>
                <View style={style.row}>
                    <Text style={style.fieldName}>电话</Text>
                    <Text style={style.fieldValue}>{user.phone}</Text>
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
        borderBottomColor: '#cccccc',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        padding: 5,
        paddingTop: 8,
    },

    fieldName: {
        color: '#778899'
    },

    fieldValue: {
        position: 'absolute',
        left: 50
    }

});

export default UserInfo;