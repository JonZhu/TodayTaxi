package com.todaytaxi.map.util;

import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.baidu.mapapi.search.core.PoiInfo;
import com.facebook.react.bridge.WritableMap;

/**
 * WritableMap 工具
 *
 * Created by zhujun on 2016/12/29.
 */

public class WritableMapUtil {

    /**
     * put 经纬度
     * @param map
     * @param latLng
     */
    public static void put(WritableMap map, LatLng latLng) {
        map.putDouble("lat", latLng.latitude);
        map.putDouble("lng", latLng.longitude);
    }

    /**
     * put 经纬范围
     * @param map
     * @param bounds
     */
    public static void put(WritableMap map, LatLngBounds bounds) {
        map.putDouble("northEastLat", bounds.northeast.latitude);
        map.putDouble("northEastLng", bounds.northeast.longitude);
        map.putDouble("southWestLat", bounds.southwest.latitude);
        map.putDouble("southWestLng", bounds.southwest.longitude);
    }

    public static void put(WritableMap map, PoiInfo poiInfo) {
        if (poiInfo.location != null) {
            put(map, poiInfo.location);
        }
        map.putString("city", poiInfo.city);
        map.putString("address", poiInfo.address);
        map.putString("name", poiInfo.name);
    }

}
