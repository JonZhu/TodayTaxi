package com.todaytaxi.map;

import com.baidu.mapapi.map.BaiduMap;
import com.baidu.mapapi.map.MapView;
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
        mapView.getMap().setMapType(BaiduMap.MAP_TYPE_NORMAL);
        return mapView;
    }

}
