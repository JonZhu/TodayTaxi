/**
 * 地图
 * @date 2016-11-29
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from '../../native/MapView';

class Map extends Component {

    render() {
        return (
            <MapView
                style={styles.map}
                region={{latitude: 0,longitude: 0}}
            />
        );
    }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default Map;