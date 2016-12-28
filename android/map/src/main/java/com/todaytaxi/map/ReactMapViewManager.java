package com.todaytaxi.map;

import android.util.Log;

import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;
import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.MapStatus;
import com.baidu.mapapi.map.MapStatusUpdateFactory;
import com.baidu.mapapi.map.MapView;
import com.baidu.mapapi.map.MyLocationData;
import com.baidu.mapapi.map.UiSettings;
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

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
        map.setMaxAndMinZoomLevel(21, 5);
        mapView.showZoomControls(false);

        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setRotateGesturesEnabled(false); // 关闭旋转手势
        uiSettings.setOverlookingGesturesEnabled(false); // 关闭俯瞰手势
        uiSettings.setCompassEnabled(false);

        // 设置中心点(成都)和级别
        MapStatus mapStatus = new MapStatus.Builder().zoom(15).target(new LatLng(30.66667, 104.06667)).build();
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
     * 设置当前空闲的Taxi
     *
     * @param view
     * @param taxies
     */
    @ReactProp(name = "freeTaxies")
    public void setFreeTaxies(MapView view, ReadableArray taxies) {

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
}
