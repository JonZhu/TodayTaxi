/**
 * App 根组件
 * @author zhujun
 * 
 */

import React, { Component } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import { TAB_MAIN, TAB_SETTING, TAB_USER } from '../redux/reducer/maintab';
import UserInfoContainer from '../redux/container/UserInfoContainer';

class App extends Component {

    constructor() {
        super();
        this.state = {selectedTab: '主页'};
    }

    render() {
        return (
            <TabNavigator>
                <TabNavigator.Item
                    selected={this.props.selectedTab === TAB_MAIN}
                    title="主页"
                    titleStyle={style.tabTitle}
                    onPress={() => this.props.changeTab(TAB_MAIN)}>
                    <View>
                        <Text>主页</Text>
                    </View>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.props.selectedTab === TAB_SETTING}
                    title="设置"
                    titleStyle={style.tabTitle}
                    onPress={() => this.props.changeTab(TAB_SETTING)}>
                    <View>
                        <Text>设置</Text>
                    </View>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.props.selectedTab === TAB_USER}
                    title="用户"
                    titleStyle={style.tabTitle}
                    onPress={() => this.props.changeTab(TAB_USER)}>
                    <View>
                        <UserInfoContainer/>
                    </View>
                </TabNavigator.Item>
            </TabNavigator>
        );
    }
}


const style = StyleSheet.create({
    tabTitle: {
        fontSize: 24
    }
});


export default App;