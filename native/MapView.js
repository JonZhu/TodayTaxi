/**
 * Map组件
 * 
 * @author zhujun
 * @date 2016-12-17
 * 
 */

import React, { Component, PropTypes } from 'react';
import { requireNativeComponent, View, UIManager, findNodeHandle } from 'react-native';


class MapView extends Component {

  constructor() {
    super();
    this._onChange = this._onChange.bind(this);
    this.setMapBound = this.setMapBound.bind(this);
    this._dispatchNativeUICmd = this._dispatchNativeUICmd.bind(this);
    this.move = this.move.bind(this);
  }

  /**
   * 事件
   * 
   * onStatusChange: 地图状态改变
   * 数据：{eventType:'statusChange', target:{lng, lat}, level}
   * 
   * onMyLocChange：我的定位改变
   * 数据：{eventType:'myLocChange', lng, lat, speed, direction, time}
   * 
   */
  _onChange(event) {
    if (event && event.nativeEvent) {
      var eventData = event.nativeEvent;
      var eventType = eventData.eventType;
      if ("statusChange" === eventType) {
        if (this.props.onStatusChange) {
          this.props.onStatusChange(eventData);
        }
      } else if ("myLocChange" === eventType) {
        if (this.props.onMyLocChange) {
          this.props.onMyLocChange(eventData);
        }
      }
    }
  }

  // 触发本地ui命令
  _dispatchNativeUICmd(name, args) {
    // (int reactTag, int commandId, ReadableArray commandArgs)
    UIManager.dispatchViewManagerCommand(findNodeHandle(this._nativeMapView), 
      UIManager.AMapView.Commands[name], args);
  }

  // 设置地图显示范围为包括指定的所有点, [{lng, lat}]
  setMapBound(points) {
    this._dispatchNativeUICmd('setMapBound', points);
  }

  // 移动地图中心
  move(lng, lat) {
    this._dispatchNativeUICmd('move', [{lng:lng, lat:lat}]);
  }

  render() {
    return (
      <NativeMapView ref={(ref)=>{this._nativeMapView=ref}} {...this.props} onChange={this._onChange} />
    );
  }
}

MapView.propTypes = {
  ...View.propTypes,
  taxies: React.PropTypes.array, // taxi列表 [{id, lat, lng}]
  onStatusChange: React.PropTypes.func, // 地图状态改变事件, 如中心点改变
  onMyLocChange: React.PropTypes.func // 我的定位改变事件
};


const NativeMapView = requireNativeComponent('AMapView', MapView, {nativeOnly:{onChange:true}});

export default MapView;