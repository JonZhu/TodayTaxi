package com.todaytaxi.map;

import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.BitmapDescriptor;
import com.baidu.mapapi.map.BitmapDescriptorFactory;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.Marker;
import com.baidu.mapapi.map.MarkerOptions;
import com.baidu.mapapi.map.MyLocationData;
import com.baidu.mapapi.map.OverlayOptions;
import com.baidu.mapapi.map.UiSettings;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.HashMap;
import java.util.Map;


/**
 * React地图ui组件
 *
 * Created by zhujun on 2016/12/17 0017.
 */

public class ReactMapViewManager extends SimpleViewManager<MapView> {

    public static final String REACT_CLASS = "RCTBaiduMapView";

    public String getName() {
        return REACT_CLASS;
    }

    public MapView createViewInstance(ThemedReactContext context) {
        MapView mapView = new MapView(context);
        BaiduMap map = mapView.getMap();
        map.setMapType(BaiduMap.MAP_TYPE_NORMAL);
        map.setMyLocationEnabled(true);
        map.setMaxAndMinZoomLevel(21, 3);
        mapView.showZoomControls(false);

        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setRotateGesturesEnabled(false); // 关闭旋转手势
        uiSettings.setOverlookingGesturesEnabled(false); // 关闭俯瞰手势
        uiSettings.setCompassEnabled(false); // 设置是否允许指南针

        // 设置中心点(成都)和级别
        MapStatus mapStatus = new MapStatus.Builder().zoom(17).target(new LatLng(30.66667, 104.06667)).build();
        map.setMapStatus(MapStatusUpdateFactory.newMapStatus(mapStatus));

        // 增加状态改变事件监听器
        map.setOnMapStatusChangeListener(new MapStatusChangeListener(context, mapView));

        // 定位
        location(context, map);

        return mapView;
    }

    /**
     * 移动地图到某点
     * @param map
     * @param lat
     * @param lng
     */
    private void move(BaiduMap map, double lat, double lng) {
        MapStatus mapStatus = new MapStatus.Builder().target(new LatLng(lat, lng)).build();
        map.setMapStatus(MapStatusUpdateFactory.newMapStatus(mapStatus));
    }


    /**
     * 定位当前位置
     *
     * @param context
     */
    private void location(ThemedReactContext context, final BaiduMap map) {
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
        option.setCoorType("bd09ll");
        option.setScanSpan(1000);
        option.setIsNeedAddress(true);
        option.setIsNeedLocationDescribe(true);
        option.setOpenGps(true);
        option.setIgnoreKillProcess(false);
        option.setEnableSimulateGps(false);

        final LocationClient locationClient = new LocationClient(context);
        locationClient.setLocOption(option);

        locationClient.registerLocationListener(new BDLocationListener() {
            @Override
            public void onReceiveLocation(BDLocation bdLocation) {
                int locType = bdLocation.getLocType();
                if (locType == BDLocation.TypeGpsLocation || locType == BDLocation.TypeNetWorkLocation
                    || locType == BDLocation.TypeOffLineLocation) {
                    // 定位成功
                    // locationClient.stop();

                    Log.d(REACT_CLASS, "location success, Latitude:"+ bdLocation.getLatitude()
                            +", Longitude:" + bdLocation.getLongitude() + ", AddrStr:" + bdLocation.getAddrStr());


                    MyLocationData myLocationData = new MyLocationData.Builder()
                            .latitude(bdLocation.getLatitude())
                            .longitude(bdLocation.getLongitude()).build();
                    map.setMyLocationData(myLocationData);

                    // 移动到定位点
                    move(map, bdLocation.getLatitude(), bdLocation.getLongitude());

                } else {
                    Log.d(REACT_CLASS, "location fail, locType:" + locType);
                }

            }
        });

        locationClient.start();
    }

    /**
     * 设置Taxi
     *
     * <p>id相同的taxi marker会被复用，只更新位置信息</p>
     *
     * @param view
     * @param taxies [{id, lat, lng}]
     */
    @ReactProp(name = "taxies")
    public void setTaxies(MapView view, ReadableArray taxies) {
        Map<String, Marker> oldTaxiMap = (Map)MapViewExtendData.getData(view, "taxiMarkerMap");
        Map<String, Marker> newTaxiMap = new HashMap<>();

        if (taxies != null && taxies.size() > 0) {
            for (int i = 0; i < taxies.size(); i++) {
                ReadableMap map = taxies.getMap(i);
                String taxiId = map.getString("id");
                //定义Maker坐标点
                LatLng point = new LatLng(map.getDouble("lat"), map.getDouble("lng"));
                Marker marker = null;
                if (oldTaxiMap != null && oldTaxiMap.containsKey(taxiId)) {
                    // marker已经存在
                    marker = oldTaxiMap.get(taxiId);
                    marker.setPosition(point);
                    oldTaxiMap.remove(taxiId);
                } else {
                    //构建Marker图标
                    BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(R.drawable.taxi_top_yellow);
                    //构建MarkerOption，用于在地图上添加Marker
                    OverlayOptions option = new MarkerOptions()
                            .position(point)
                            .animateType(MarkerOptions.MarkerAnimateType.grow)
                            .icon(bitmap);
                    //在地图上添加Marker，并显示
                    marker = (Marker)view.getMap().addOverlay(option);
                }

                newTaxiMap.put(taxiId, marker);
            }
        }

        // 清除marker
        if (oldTaxiMap != null && !oldTaxiMap.isEmpty()) {
            for (Marker marker : oldTaxiMap.values()) {
                marker.remove();
            }
        }

        MapViewExtendData.setData(view, "taxiMarkerMap", newTaxiMap);
    }

    /**
     * 业务类型
     *
     * @param view
     * @param bizType
     */
    @ReactProp(name = "bizType", defaultInt = 0)
    public void setBizType(MapView view, int bizType) {
        MapViewExtendData.setData(view, "bizType", bizType);
    }


    @Override
    public void onDropViewInstance(MapView view) {
        super.onDropViewInstance(view);
        MapViewExtendData.remove(view); // 清理扩展数据
    }

    /**
     * 地图显示范围
     *
     * @param point1 坐标 {lng, lat}
     * @param point2 坐标 {lng, lat}
     */
    @ReactProp(name = "mapBound")
    public void setMapBound(MapView view, ReadableMap point1, ReadableMap point2) {
        if (point1 == null || point2 == null) {
            return;
        }

        view.getMap().setMapStatusLimits(new LatLngBounds.Builder()
                .include(new LatLng(point1.getDouble("lat"), point1.getDouble("lng")))
                .include(new LatLng(point2.getDouble("lat"), point2.getDouble("lng"))).build());
    }

}
