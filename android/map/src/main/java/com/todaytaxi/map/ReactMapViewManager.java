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
import com.baidu.mapapi.model.LatLng;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

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

        // 设置中心点和级别
        MapStatus mapStatus = new MapStatus.Builder().zoom(18).target(new LatLng(30.66667, 104.06667)).build();
        map.setMapStatus(MapStatusUpdateFactory.newMapStatus(mapStatus));

        location(context, map);

        return mapView;
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

                } else {
                    Log.d(REACT_CLASS, "location fail, locType:" + locType);
                }

            }
        });

        locationClient.start();
    }

}
