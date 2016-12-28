package com.todaytaxi.map;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * 处理地图状态改变逻辑
 *
 * Created by zhujun on 2016/12/28.
 */

public class MapStatusChangeListener implements BaiduMap.OnMapStatusChangeListener {
    private ThemedReactContext context;
    private MapView mapView;

    public MapStatusChangeListener(ThemedReactContext context, MapView mapView) {
        this.context = context;
        this.mapView = mapView;
    }

    @Override
    public void onMapStatusChangeStart(MapStatus mapStatus) {

    }

    @Override
    public void onMapStatusChange(MapStatus mapStatus) {

    }

    @Override
    public void onMapStatusChangeFinish(MapStatus mapStatus) {
        RCTEventEmitter emitter = context.getJSModule(RCTEventEmitter.class);
        WritableMap event = Arguments.createMap();
        event.putString("eventType", "statusChange");

        // 中点
        WritableMap target = Arguments.createMap();
        target.putDouble("latitude", mapStatus.target.latitude);
        target.putDouble("longitude", mapStatus.target.longitude);
        event.putMap("target", target);

        // 范围
        WritableMap bound = Arguments.createMap();
        bound.putDouble("northeastLatitude", mapStatus.bound.northeast.latitude);
        bound.putDouble("northeastLongitude", mapStatus.bound.northeast.longitude);
        bound.putDouble("southwestLatitude", mapStatus.bound.southwest.latitude);
        bound.putDouble("southwestLongitude", mapStatus.bound.southwest.longitude);
        event.putMap("bound", bound);

        // 级别
        event.putInt("level", mapView.getMapLevel());

        // 发送事件
        emitter.receiveEvent(mapView.getId(), "topChange", event);
    }
}
