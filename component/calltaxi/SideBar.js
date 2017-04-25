/**
 * 侧边栏
 * 
 * @date 2016-11-28
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RegistMotorman from './RegistMotorman';
import RouteList from './RouteList';

class SideBar extends Component {

    constructor() {
        super();
        this._registMotorman = this._registMotorman.bind(this);
    }


    _registMotorman() {
        this.props.toggleSideBar(); // 关闭siderBar;
        this.props.navigator.push({comp:RegistMotorman}); // 跳转到注册车主页
    }

    _toMyRouteList = ()=>{
        this.props.toggleSideBar(); // 关闭siderBar;
        this.props.navigator.push({comp:RouteList}); // 我的行程页面
    }

    render() {
        return (
            
            <View style={style.container}>
                <TouchableWithoutFeedback onPress={()=>this.props.toggleSideBar()}>
                    <View style={style.background}></View>
                </TouchableWithoutFeedback>

                <View style={style.barContainer}>
                    <TouchableWithoutFeedback onPress={()=>this.props.userHeadOnPress()}>
                        <View style={style.headContainer}>
                            <Icon name='user-circle' style={style.userIcon}/>
                            <Text style={style.userName}>ZHU JUN</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={style.barItemContainer}>
                        <Icon name='credit-card' style={style.itemIcon}/>
                        <Text style={style.itemText}>付款方式</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this._toMyRouteList}>
                        <View style={style.barItemContainer}>
                            <Icon name='history' style={style.itemIcon}/>
                            <Text style={style.itemText}>我的行程</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={style.barItemContainer}>
                        <Icon name='life-ring' style={style.itemIcon}/>
                        <Text style={style.itemText}>帮助</Text>
                    </View>
                    <View style={style.barItemContainer}>
                        <Icon name='heart' style={style.itemIcon}/>
                        <Text style={style.itemText}>邀请奖励</Text>
                    </View>
                    <View style={style.barItemContainer}>
                        <Icon name='certificate' style={style.itemIcon}/>
                        <Text style={style.itemText}>优惠</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={this._registMotorman}>
                        <View style={style.barItemContainer}>
                            <Icon name='tachometer' style={style.itemIcon}/>
                            <Text style={style.itemText}>成为车主</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={style.barItemContainer}>
                        <Icon name='cog' style={style.itemIcon}/>
                        <Text style={style.itemText}>设置</Text>
                    </View>
                </View>
            </View>
        );
    };

}

const style = StyleSheet.create({
    container: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        top: 0,
    },

    // background
    background: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.9)'
    },

    barContainer: {
        flex: 1,
        width: 200,
        backgroundColor: 'rgb(9,9,26)'
    },

    // header
    headContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        backgroundColor: 'rgb(34,34,49)'
    },

    userIcon: {
        color: '#fff',
        fontSize: 40,
        marginLeft: 15
    },

    userName: {
        color: '#fff',
        fontSize: 20,
        marginLeft: 15
    },

    // bar item
    barItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
        
    },

    itemText: {
        position: 'absolute',
        color: '#fff',
        fontSize: 18,
        left: 55,
        top: 14
    },

    itemIcon: {
        fontSize: 22,
        color: 'rgb(157,157,163)'
    }

});


export default SideBar;