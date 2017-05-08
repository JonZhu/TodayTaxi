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

  // 设置范围并适当扩大
  setMapBoundEnlarge = (points)=>{
    if (!points || points.length == 0) {
      return;
    }

    // 扩大显示范围
    var minLng, maxLng, minLat, maxLat;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      if (i == 0) {
        minLng = maxLng = point.lng;
        minLat = maxLat = point.lat;
      } else {
        minLng = Math.min(minLng, point.lng);
        maxLng = Math.max(maxLng, point.lng);
        minLat = Math.min(minLat, point.lat);
        maxLat = Math.max(maxLat, point.lat);
      }
    }

    var hEnlarge = 0.01; // 范围水平扩大约1000米
    var vEnlarge = 0.015; // 范围垂直扩大约1500米
    this.setMapBound([{lng:minLng - hEnlarge, lat:Math.max(minLat - vEnlarge, -90)}, 
        {lng:maxLng + hEnlarge, lat:Math.min(maxLat + vEnlarge, 90)}]);

}

  // 移动地图中心
  move(lng, lat) {
    this._dispatchNativeUICmd('move', [{lng:lng, lat:lat}]);
  }

  /**
   * 显示行程
   * @param points 行程点数据, 如果为空, 则清除行程 [{lng, lat}]
   */
  showRoute = (points)=>{
    this._dispatchNativeUICmd('showRoute', points);
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
  onMyLocChange: React.PropTypes.func, // 我的定位改变事件
  showMyLoc: React.PropTypes.bool, // 是否显示我的位置
  showMyLocBtn: React.PropTypes.bool // 是否显示返回我的位置按钮
};


const NativeMapView = requireNativeComponent('AMapView', MapView, {nativeOnly:{onChange:true}});

export default MapView;