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
import storeConfig from './redux/storeConfig';
import AppNavigator from './component/AppNavigator';

export default class TodayTaxi extends Component {
  constructor(){
    super();
    this.store = storeConfig();
  }

  render() {
    return (
      <Provider store={this.store}>
        <AppNavigator/>
      </Provider>
    );
  }
}


AppRegistry.registerComponent('TodayTaxi', () => TodayTaxi);
