/**
 * 地图
 * @date 2016-11-29
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, MapView } from 'react-native';

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
    height: 150,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000000'
  }
});

export default Map;