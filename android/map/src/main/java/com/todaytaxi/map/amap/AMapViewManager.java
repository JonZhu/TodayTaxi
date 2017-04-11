package com.todaytaxi.map.amap;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdate;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.UiSettings;
import com.amap.api.maps.model.LatLng;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.todaytaxi.map.domain.Taxi;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;


/**
 * React地图ui组件
 *
 * Created by zhujun on 2016/12/17 0017.
 */

public class AMapViewManager extends SimpleViewManager<AMapView> {

    public static final String REACT_CLASS = "AMapView";

    public String getName() {
        return REACT_CLASS;
    }

    public AMapView createViewInstance(final ThemedReactContext context) {

        final AMapView mapView = new AMapView(context);
        mapView.onCreate(context.getCurrentActivity().getIntent().getExtras());
        AMap map = mapView.getMap();
        map.setMapType(AMap.MAP_TYPE_NORMAL);
        map.setMyLocationEnabled(true); // 打开定位图层
        map.setMaxZoomLevel(21);
        map.setMinZoomLevel(3);

        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setRotateGesturesEnabled(false); // 关闭旋转手势
        uiSettings.setTiltGesturesEnabled(false); // 关闭倾斜手势
        uiSettings.setCompassEnabled(false); // 设置是否允许指南针
        uiSettings.setZoomControlsEnabled(false); // 关闭缩放按钮
        uiSettings.setZoomInByScreenCenter(true); // 在中心点缩放
        uiSettings.setMyLocationButtonEnabled(true); // 显示定位按钮

        // 设置中心点(成都天府五街)和级别 104.056701,30.537908
        CameraUpdate mCameraUpdate = CameraUpdateFactory.newLatLngZoom(new LatLng(30.537908,104.056701),17);
        map.moveCamera(mCameraUpdate);

        return mapView;
    }

    /**
     * 设置Taxi
     *
     * <p>id相同的taxi marker会被复用，只更新位置信息</p>
     *
     * @param view
     * @param taxies [{id, lat, lng, direction}]
     */
    @ReactProp(name = "taxies")
    public void setTaxies(AMapView view, ReadableArray taxies) {
        List<Taxi> taxiList = null;
        if (taxies != null && taxies.size() > 0) {
            taxiList = new ArrayList<>();
            for (int i = 0; i < taxies.size(); i++) {
                Taxi taxi = new Taxi();
                ReadableMap map = taxies.getMap(i);
                taxi.setId(map.getString("id"));
                taxi.setLat(map.getDouble("lat"));
                taxi.setLng(map.getDouble("lng"));
                Dynamic dynamic = map.getDynamic("direction");
                taxi.setDirection(dynamic.isNull() ? null : dynamic.asInt());
                taxiList.add(taxi);
            }
        }

        view.setTaxies(taxiList);
    }

    @Override
    public void onDropViewInstance(AMapView view) {
        super.onDropViewInstance(view);
        view.onDestroy();
    }

    /**
     * 地图显示范围
     *
     * @param points 坐标列表 [{lng, lat}]
     */
    private void setMapBound(AMapView view, ReadableArray points) {
        if (points == null || points.size() <2 ) {
            return;
        }

        ReadableMap p1Map = points.getMap(0);
        ReadableMap p2Map = points.getMap(1);
        LatLng point1 = new LatLng(p1Map.getDouble("lat"), p1Map.getDouble("lng"));
        LatLng point2 = new LatLng(p2Map.getDouble("lat"), p2Map.getDouble("lng"));
        view.setMapBound(point1, point2);
    }

    /**
     * 命令常量
     */
    private static interface Command {
        int SET_MAP_BOUND = 1;
        int MOVE = 2;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("setMapBound", Command.SET_MAP_BOUND,
                "move", Command.MOVE);
    }

    @Override
    public void receiveCommand(AMapView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case Command.SET_MAP_BOUND:
                setMapBound(root, args);
                break;
            case Command.MOVE:
                ReadableMap point = args.getMap(0);
                root.moveMap(point.getDouble("lng"), point.getDouble("lat"));
                break;
        }
    }

}
