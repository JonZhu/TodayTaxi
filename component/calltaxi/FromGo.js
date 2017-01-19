/**
 * 从哪里到哪里
 * 
 * @date 2016-11-28
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class FromGo extends Component {


    render() {
        return (
            <View style={style.container}>
                <TouchableHighlight style={{flex: 1}} underlayColor='#f0f8ff' onPress={()=>{}}>
                    <View style={[style.row, style.fromRow]}>
                        <Icon name='circle' style={style.fromIcon}/>
                        <Text style={style.text}>{this.props.from.address}</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={{flex: 1}} underlayColor='#f0f8ff' onPress={this.props.goOnPress}>
                    <View style={[style.row, style.goRow]}>
                        <Icon name='circle' style={style.goIcon}/>
                        <Text style={style.text}>{this.props.go.address}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    };
}


const style = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgb(224,224,224)',
        borderRadius: 3,
        margin: 15
    },


    fromRow: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(224,224,224)'
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },

    fromIcon: {
        color: 'rgb(47,168,32)'
    },

    goIcon: {
        color: 'rgb(243,47,0)'
    },

    text: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
});


export default FromGo;