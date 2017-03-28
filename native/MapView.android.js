/**
 * Map组件
 * 
 * @author zhujun
 * @date 2016-12-17
 * 
 */

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View } from 'react-native';

class BaiduMapView extends Component {

  _onChange(event) {
    if (event && event.nativeEvent) {
      var eventData = event.nativeEvent;
      var eventType = eventData.eventType;
      if ("statusChange" === eventType && this.props.onStatusChange) {
        this.props.onStatusChange(eventData);
      }
    }
  }

  render() {
    return (
      <RCTBaiduMapView {...this.props} onChange={this._onChange.bind(this)} />
    );
  }
}

BaiduMapView.propTypes = {
  ...View.propTypes,
  taxies: React.PropTypes.array, // taxi列表 [{id, lat, lng}]
  mapBound: React.PropTypes.array, // 地图演示范围, 应该包括所有指定的点 [{lng, lat}]
  onStatusChange: React.PropTypes.func, // 地图状态改变事件, 如位置改变
};


const RCTBaiduMapView = requireNativeComponent('RCTBaiduMapView', BaiduMapView, {nativeOnly:{onChange:true, bizType:true}});

export default BaiduMapView;