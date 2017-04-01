/**
 * Map组件
 * 
 * @author zhujun
 * @date 2016-12-17
 * 
 */

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View, UIManager } from 'react-native';

class BaiduMapView extends Component {

  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
    this.setMapBound = this.setMapBound.bind(this);
  }

  _onChange(event) {
    if (event && event.nativeEvent) {
      var eventData = event.nativeEvent;
      var eventType = eventData.eventType;
      if ("statusChange" === eventType && this.props.onStatusChange) {
        this.props.onStatusChange(eventData);
      }
    }
  }

  // 设置地图显示范围为包括指定的所有点, [{lng, lat}]
  setMapBound(points) {
    UIManager.dispatchViewManagerCommand(React.findNodeHandle(this._baiduMapView), "setMapBound", points);
  }

  // 启动导航 [{lng, lat, name}]
  launchNavi(points) {
    UIManager.dispatchViewManagerCommand(React.findNodeHandle(this._baiduMapView), "launchNavi", points);
  }

  // 停止导航 
  stopNavi() {
    UIManager.dispatchViewManagerCommand(React.findNodeHandle(this._baiduMapView), "stopNavi", null);
  }

  render() {
    return (
      <RCTBaiduMapView ref={(ref)=>{this._baiduMapView=ref}} {...this.props} onChange={this._onChange} />
    );
  }
}

BaiduMapView.propTypes = {
  ...View.propTypes,
  taxies: React.PropTypes.array, // taxi列表 [{id, lat, lng}]
  onStatusChange: React.PropTypes.func, // 地图状态改变事件, 如位置改变
};


const RCTBaiduMapView = requireNativeComponent('RCTBaiduMapView', BaiduMapView, {nativeOnly:{onChange:true}});

export default BaiduMapView;