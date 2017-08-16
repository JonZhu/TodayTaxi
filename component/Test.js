import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableHighlight, ToastAndroid } from 'react-native';
import MapView from '../native/MapView';
import { StackNavigator } from 'react-navigation';


class MapPage1 extends Component {

    render() {
        return (
            <View style={{flex:1}}>
                <Button onPress={()=>{this.props.navigation.navigate('MapPage2')}} title='goto page2'></Button>
                <MapView style={{flex:1}}/>
            </View>
        );
    }

    onNavigationStateChange = ()=>{
        ToastAndroid.show('MapPage1', ToastAndroid.LONG);
    }

}

class MapPage2 extends Component {
    componentDidMount() {
        // 104.047882,30.543032
        // 104.010803,30.675409
        
        this._mapView2.showRoute([{lat:30.543032, lng:104.047882}, {lat:30.675409, lng:104.010803}]); // 显示行程
        // 扩大显示范围
        this._mapView2.setMapBoundEnlarge([{lat:30.543032, lng:104.047882}, {lat:30.675409, lng:104.010803}]);
    }

    onNavigationStateChange = ()=>{
        ToastAndroid.show('MapPage2', ToastAndroid.LONG);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <MapView ref={(mapView2)=>{this._mapView2=mapView2}} style={{flex:1}} showMyLoc={false}/>
            </View>
        );
    }
}

const Test = new StackNavigator({
    MapPage1: {screen: MapPage1},
    MapPage2: {screen: MapPage2}
}, {
    initialRouteName: 'MapPage1'
});

export default Test;