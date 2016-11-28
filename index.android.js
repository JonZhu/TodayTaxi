/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import App from './component/App';
import AppContainer from './redux/container/AppContainer';
import { Provider } from 'react-redux';
import storeConfig from './redux/storeConfig';
import CallTaxi from './component/calltaxi/CallTaxi';

export default class RNClient extends Component {

  constructor(){
    super();
    this.store = storeConfig();
  }

  render() {
    return (
      <Provider store={this.store}>
        <CallTaxi/>

      </Provider>
    );
  }
}


AppRegistry.registerComponent('RNClient', () => RNClient);
