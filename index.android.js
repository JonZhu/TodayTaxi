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

  // _onNavigationStateChange = (prevState, newState, action)=>{
  //   var router = AppNavigator.router;
  //   var preComp = router.getComponentForState(prevState);
  //   var newComp = router.getComponentForState(newState);
  //   console.info([preComp, newComp]);
  // };

  render() {
    return (
      <Provider store={store}>
        <AppNavigator ref={(navigator)=>{this._navigator=navigator}} />
      </Provider>
    );
  }
}


AppRegistry.registerComponent('TodayTaxi', () => TodayTaxi);
