package com.todaytaxi.map.util;

import com.amap.api.location.AMapLocation;
import com.amap.api.navi.model.AMapNaviLocation;
import com.amap.api.navi.model.NaviLatLng;
import com.amap.api.services.core.PoiItem;
import com.amap.api.services.geocoder.GeocodeAddress;
import com.amap.api.services.route.DrivePath;
import com.amap.api.services.route.DriveStep;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.List;

/**
 * WritableMap 工具
 *
 * Created by zhujun on 2016/12/29.
 */

public class WritableMapUtil {

    public static void put(WritableMap map, AMapLocation aMapLocation) {
        map.putDouble("lat", aMapLocation.getLatitude()); // 纬度
        map.putDouble("lng", aMapLocation.getLongitude()); // 经度
        map.putDouble("direction", aMapLocation.getBearing()); // 行进的方向，单位度
        map.putDouble("speed", aMapLocation.getSpeed()); // 单位：米/秒
        map.putString("city", aMapLocation.getCity());
        map.putString("cityCode", aMapLocation.getCityCode());
        map.putString("country", aMapLocation.getCountry());
        map.putString("address", aMapLocation.getAddress());
        map.putString("district", aMapLocation.getDistrict());
        map.putString("describe", aMapLocation.getPoiName());
    }

    public static void put(WritableMap map, DrivePath drivePath) {
        map.putString("title", drivePath.getStrategy());
        map.putInt("lightNum", drivePath.getTotalTrafficlights());
        int duration = 0;
        int distance = 0;
        if (drivePath.getSteps() != null && !drivePath.getSteps().isEmpty()) {
            for (DriveStep step : drivePath.getSteps()) {
                duration += step.getDuration();
                distance += step.getDistance();
            }
        }
        map.putInt("duration", duration);
        map.putInt("distance", distance);
    }

    public static NaviLatLng toLatLng(ReadableMap map) {
        return new NaviLatLng(map.getDouble("lat"), map.getDouble("lng"));
    }

    public static void put(WritableMap map, AMapNaviLocation aMapNaviLocation) {
        map.putDouble("lng", aMapNaviLocation.getCoord().getLongitude());
        map.putDouble("lat", aMapNaviLocation.getCoord().getLatitude());
        map.putInt("time", aMapNaviLocation.getTime().intValue());
        map.putDouble("speed", aMapNaviLocation.getSpeed()); // 单位公里每小时。如果此位置不具有速度，则返回0.0
        map.putDouble("direction", aMapNaviLocation.getBearing()); // 定位方向，指的是相对正北方向的角度
    }

    public static void put(WritableMap map, GeocodeAddress address) {
        map.putDouble("lng", address.getLatLonPoint().getLongitude());
        map.putDouble("lat", address.getLatLonPoint().getLatitude());
    }

    public static void put(WritableMap map, PoiItem poiItem) {
        if (poiItem.getLatLonPoint() != null) {
            map.putDouble("lng", poiItem.getLatLonPoint().getLongitude());
            map.putDouble("lat", poiItem.getLatLonPoint().getLatitude());
        }
        map.putString("city", poiItem.getCityName());
        map.putString("address", poiItem.getSnippet());
        map.putString("name", poiItem.getTitle());
    }
}
