package com.todaytaxi.map.amap;

import android.location.Location;
import android.util.Log;
import android.view.ViewGroup;

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
import com.amap.api.maps.model.MyLocationStyle;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.todaytaxi.map.R;
import com.todaytaxi.map.domain.Taxi;
import com.todaytaxi.map.util.JSModuleUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by zhujun on 2017/4/6 0006.
 */

public class AMapView extends MapView {

    private ThemedReactContext context;

    private Map<String, Marker> taxiMarkerMap;

    private final List<Marker> routeMarkerList = new ArrayList<>(2);

    public AMapView(ThemedReactContext context) {
        super(context);
        this.context = context;

        ViewGroup.LayoutParams layout = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        setLayoutParams(layout);

        AMap map = getMap();

        // 注册状态改变事件监听
        map.setOnCameraChangeListener(new AMap.OnCameraChangeListener() {
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

        // 定位改变监听
        map.setOnMyLocationChangeListener(new AMap.OnMyLocationChangeListener() {
            @Override
            public void onMyLocationChange(Location location) {
                WritableMap event = Arguments.createMap();
                event.putString("eventType", "myLocChange");

                // 位置
                event.putDouble("lng", location.getLongitude());
                event.putDouble("lat", location.getLatitude());
                event.putDouble("speed", location.getSpeed());
                event.putInt("direction", (int)location.getBearing());
                event.putInt("time", (int)location.getTime());

                // 发送事件
                JSModuleUtil.sendUIEvent(AMapView.this.context, getId(), event);
            }
        });

        MyLocationStyle locationStyle = new MyLocationStyle();
//        locationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_SHOW);//只定位一次。
        locationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATE);//定位一次，且将视角移动到地图中心点。
//        locationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_FOLLOW);//连续定位、且将视角移动到地图中心点，定位蓝点跟随设备移动。（1秒1次定位）
//        locationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_MAP_ROTATE);//连续定位、且将视角移动到地图中心点，地图依照设备方向旋转，定位点会跟随设备移动。（1秒1次定位）
//        locationStyle.myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE);//连续定位、且将视角移动到地图中心点，定位点依照设备方向旋转，并且会跟随设备移动。（1秒1次定位）默认执行此种模式。
        map.setMyLocationStyle(locationStyle);
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
            //构建Marker图标
            BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(R.drawable.taxi_top_yellow);
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
                    //构建MarkerOption，用于在地图上添加Marker
                    MarkerOptions option = new MarkerOptions()
                            .position(point)
                            .rotateAngle(rotate)
                            .icon(bitmap);
                    //在地图上添加Marker，并显示
                    marker = getMap().addMarker(option);
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

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        getMap().setPointToCenter(w/2, h/2); // 在大小改变之后设置中心点, 解决中心点不自动居中问题。
    }

    /**
     * 显示行程
     * @param locList 如果为空, 清除行程
     */
    public void showRoute(List<Location> locList) {
        if (!routeMarkerList.isEmpty()) {
            // 消除route
            Iterator<Marker> iterator = routeMarkerList.iterator();
            while (iterator.hasNext()) {
                Marker marker = iterator.next();
                marker.remove();
                marker.destroy();
                iterator.remove();
            }
        }

        if (locList != null && locList.size() > 1) {
            // 目前只显示起始点，不显示路径

            // 起点
            Location fromLoc = locList.get(0);
            LatLng fromPoint = new LatLng(fromLoc.getLatitude(), fromLoc.getLongitude());
            MarkerOptions option = new MarkerOptions()
                    .position(fromPoint)
                    .icon(BitmapDescriptorFactory.fromResource(R.drawable.from_location));
            Marker marker = getMap().addMarker(option);
            routeMarkerList.add(marker);


            // 终点
            Location toLoc = locList.get(locList.size() - 1);
            LatLng toPoint = new LatLng(toLoc.getLatitude(), toLoc.getLongitude());
            option = new MarkerOptions()
                    .position(toPoint)
                    .icon(BitmapDescriptorFactory.fromResource(R.drawable.to_location));
            marker = getMap().addMarker(option);
            routeMarkerList.add(marker);
        }
    }
}
