/**
 * Map导航View
 * 
 * @author zhujun
 * @date 2017-4-7
 * 
 */

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View, UIManager, findNodeHandle } from 'react-native';

class MapNaviView extends Component {

  constructor() {
    super();
  }

 

  render() {
    return (
      <NativeMapNaviView ref={(ref)=>{this._nativeView=ref}} {...this.props} onChange={this._onChange} />
    );
  }
}

MapNaviView.propTypes = {
  ...View.propTypes
};


const NativeMapNaviView = requireNativeComponent('AMapNaviView', MapNaviView, {nativeOnly:{onChange:true}});

export default MapNaviView;