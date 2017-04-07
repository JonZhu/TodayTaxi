package com.todaytaxi.map.amap;

import android.content.Context;

import com.amap.api.maps.AMap;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.CameraPosition;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.todaytaxi.map.util.JSModuleUtil;

/**
 * Created by zhujun on 2017/4/6 0006.
 */

public class AMapView extends MapView {

    private ThemedReactContext context;

    public AMapView(ThemedReactContext context) {
        super(context);
        this.context = context;

        // 注册状态改变事件
        getMap().setOnCameraChangeListener(new AMap.OnCameraChangeListener() {
            @Override
            public void onCameraChange(CameraPosition cameraPosition) {

            }

            @Override
            public void onCameraChangeFinish(CameraPosition cameraPosition) {

                WritableMap event = Arguments.createMap();
                event.putString("eventType", "statusChange");

                // 中点
                WritableMap target = Arguments.createMap();
                target.putDouble("lng", cameraPosition.target.longitude);
                target.putDouble("lat", cameraPosition.target.latitude);
                event.putMap("target", target);

                // 级别
                event.putInt("level", (int)cameraPosition.zoom);

                // 发送事件
                JSModuleUtil.sendUIEvent(AMapView.this.context, getId(), event);
            }
        });
    }
}
