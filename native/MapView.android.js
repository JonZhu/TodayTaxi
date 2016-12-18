/**
 * Map组件
 * 
 * @author zhujun
 * @date 2016-12-17
 * 
 */

import { PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

var iface = {
  name: 'MapView',
  propTypes: {
    ...View.propTypes // 包含默认的View的属性
  },
};

module.exports = requireNativeComponent('RCTBaiduMapView', iface);