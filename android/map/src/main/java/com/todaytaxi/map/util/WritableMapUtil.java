package com.todaytaxi.map.util;

import com.baidu.location.BDLocation;
import com.baidu.location.Poi;
import com.baidu.mapapi.model.LatLng;
import com.baidu.mapapi.model.LatLngBounds;
import com.baidu.mapapi.search.core.PoiInfo;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.util.List;

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

    public static void put(WritableMap map, BDLocation bdLocation) {
        map.putDouble("lat", bdLocation.getLatitude());
        map.putDouble("lng", bdLocation.getLongitude());
        map.putString("city", bdLocation.getCity());
        map.putString("cityCode", bdLocation.getCityCode());
        map.putString("country", bdLocation.getCountry());
        map.putString("countryCode", bdLocation.getCountryCode());
        map.putString("address", bdLocation.getAddress().address);
        map.putString("district", bdLocation.getDistrict());
        map.putString("describe", bdLocation.getLocationDescribe());
        map.putString("floor", bdLocation.getFloor());
        List<Poi> poiList = bdLocation.getPoiList();
        if (poiList != null && !poiList.isEmpty()) {
            WritableArray poiArr = Arguments.createArray();
            for(Poi poi : poiList) {
                poiArr.pushString(poi.getName());
            }
            map.putArray("poiList", poiArr);
        }
    }
}
