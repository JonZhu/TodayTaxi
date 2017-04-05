/**
 * Map组件
 * 
 * @author zhujun
 * @date 2016-12-17
 * 
 */

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View, UIManager, findNodeHandle } from 'react-native';

class BaiduMapView extends Component {

  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
    this.setMapBound = this.setMapBound.bind(this);
    this.launchNavi = this.launchNavi.bind(this);
    this.stopNavi = this.stopNavi.bind(this);
    this._dispatchNativeUICmd = this._dispatchNativeUICmd.bind(this);
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

  // 触发本地ui命令
  _dispatchNativeUICmd(name, args) {
    // (int reactTag, int commandId, ReadableArray commandArgs)
    UIManager.dispatchViewManagerCommand(findNodeHandle(this._baiduMapView), 
      UIManager.RCTBaiduMapView.Commands[name], args);
  }

  // 设置地图显示范围为包括指定的所有点, [{lng, lat}]
  setMapBound(points) {
    this._dispatchNativeUICmd('setMapBound', points);
  }

  // 启动导航 [{lng, lat, name}]
  launchNavi(points) {
    this._dispatchNativeUICmd('launchNavi', points);
  }

  // 停止导航 
  stopNavi() {
    this._dispatchNativeUICmd('stopNavi', null);
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