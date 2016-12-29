package com.todaytaxi.map;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.todaytaxi.map.util.WritableMapUtil;

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
        WritableMapUtil.put(target, mapStatus.target);
        event.putMap("target", target);

        // 范围
        WritableMap bound = Arguments.createMap();
        WritableMapUtil.put(bound, mapStatus.bound);
        event.putMap("bound", bound);

        // 级别
        event.putInt("level", mapView.getMapLevel());

        // 发送事件
        emitter.receiveEvent(mapView.getId(), "topChange", event);
    }
}
