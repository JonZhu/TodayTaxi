package com.todaytaxi.map;

import com.baidu.mapapi.map.MapView;

import java.util.HashMap;
import java.util.Map;

/**
 * 管理MapView扩展数据
 *
 * <p>因为baidu的MapView为final类，不能继承，使用该工具存储扩展数据</p>
 *
 * Created by zhujun on 2016/12/28.
 */

public class MapViewExtendData {

    private final static Map<MapView, Map> EXTEND_DATA = new HashMap<>();

    private MapViewExtendData() {}

    public static void setData(MapView mapView, Map data) {
        EXTEND_DATA.put(mapView, data);
    }

    public static void setData(MapView mapView, String key, Object value) {
        Map data = EXTEND_DATA.get(mapView);
        if (data == null) {
            data = new HashMap();
            EXTEND_DATA.put(mapView, data);
        }
        data.put(key, value);
    }

    public static Map getData(MapView mapView) {
        return EXTEND_DATA.get(mapView);
    }

    public static Object getData(MapView mapView, String key) {
        Map data = EXTEND_DATA.get(mapView);
        return data == null ? null : data.get(key);
    }

    public static Map remove(MapView mapView) {
        return EXTEND_DATA.remove(mapView);
    }

    public static Object remove(MapView mapView, String key) {
        Map data = getData(mapView);
        return data == null ? null : data.remove(key);
    }

}
