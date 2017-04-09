package com.todaytaxi.map.amap;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.MapView;
import com.amap.api.maps.model.BitmapDescriptor;
import com.amap.api.maps.model.BitmapDescriptorFactory;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.maps.model.LatLng;
import com.amap.api.maps.model.LatLngBounds;
import com.amap.api.maps.model.Marker;
import com.amap.api.maps.model.MarkerOptions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.todaytaxi.map.R;
import com.todaytaxi.map.domain.Taxi;
import com.todaytaxi.map.util.JSModuleUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zhujun on 2017/4/6 0006.
 */

public class AMapView extends MapView {

    private ThemedReactContext context;

    private Map<String, Marker> taxiMarkerMap;

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

    /**
     * 移动地图中心
     * @param lng
     * @param lat
     */
    public void moveMap(double lng, double lat) {
        getMap().moveCamera(CameraUpdateFactory.newLatLng(new LatLng(lat, lng)));
    }

    public void setMapBound(LatLng p1, LatLng p2) {
        LatLngBounds bounds = LatLngBounds.builder().include(p1).include(p2).build();
        getMap().moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 10));
    }

    /**
     * 设置出租车
     * @param taxiList
     */
    synchronized public void setTaxies(List<Taxi> taxiList) {
        Map<String, Marker> oldTaxiMap = this.taxiMarkerMap;
        Map<String, Marker> newTaxiMap = new HashMap<>();

        if (taxiList != null && taxiList.size() > 0) {
            for (int i = 0; i < taxiList.size(); i++) {
                Taxi taxi = taxiList.get(i);
                String taxiId = taxi.getId();
                //定义Maker坐标点
                LatLng point = new LatLng(taxi.getLat(), taxi.getLng());
                float rotate = (float)(taxi.getDirection() == null ? -90 : taxi.getDirection() - 90); // icon本来车头向左, 如果无方向信息，默认车头向上
                Marker marker = null;
                if (oldTaxiMap != null && oldTaxiMap.containsKey(taxiId)) {
                    // marker已经存在
                    marker = oldTaxiMap.get(taxiId);
                    marker.setPosition(point);
                    marker.setRotateAngle(rotate);
                    oldTaxiMap.remove(taxiId);
                } else {
                    //构建Marker图标
                    BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(R.drawable.taxi_top_yellow);
                    //构建MarkerOption，用于在地图上添加Marker
                    MarkerOptions option = new MarkerOptions()
                            .position(point)
                            .rotateAngle(rotate)
                            .icon(bitmap);
                    //在地图上添加Marker，并显示
                    marker = (Marker)getMap().addMarker(option);
                }

                newTaxiMap.put(taxiId, marker);
            }
        }

        // 清除marker
        if (oldTaxiMap != null && !oldTaxiMap.isEmpty()) {
            for (Marker marker : oldTaxiMap.values()) {
                marker.remove();
                marker.destroy();
            }
        }

        this.taxiMarkerMap = newTaxiMap;
    }

}
