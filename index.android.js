/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/storeConfig';
import AppNavigator from './component/Navigator';

export default class TodayTaxi extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
}


AppRegistry.registerComponent('TodayTaxi', () => TodayTaxi);
