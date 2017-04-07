package com.todaytaxi.map.amap;

import android.os.Environment;
import android.widget.Toast;

import com.amap.api.maps.AMap;
import com.amap.api.maps.CameraUpdate;
import com.amap.api.maps.CameraUpdateFactory;
import com.amap.api.maps.MapView;
import com.amap.api.maps.UiSettings;
import com.amap.api.maps.model.CameraPosition;
import com.amap.api.maps.model.LatLng;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.todaytaxi.map.util.JSModuleUtil;

import java.io.File;
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
//        map.setMyLocationEnabled(true);
        map.setMaxZoomLevel(21);
        map.setMinZoomLevel(3);

        UiSettings uiSettings = map.getUiSettings();
        uiSettings.setRotateGesturesEnabled(false); // 关闭旋转手势
        uiSettings.setTiltGesturesEnabled(false); // 关闭倾斜手势
        uiSettings.setCompassEnabled(false); // 设置是否允许指南针

        // 设置中心点(成都天府五街)和级别 104.056701,30.537908
        CameraUpdate mCameraUpdate = CameraUpdateFactory.newLatLngZoom(new LatLng(30.537908,104.056701),17);
        map.moveCamera(mCameraUpdate);

        return mapView;
    }

    /**
     * 移动地图到某点
     * @param map
     * @param lat
     * @param lng
     */
//    private void move(BaiduMap map, double lat, double lng) {
//        MapStatus mapStatus = new MapStatus.Builder().target(new LatLng(lat, lng)).build();
//        map.setMapStatus(MapStatusUpdateFactory.newMapStatus(mapStatus));
//    }


    /**
     * 定位当前位置
     *
     * @param context
     */
    private void location(ThemedReactContext context, final AMap map) {
//        LocationClientOption option = new LocationClientOption();
//        option.setLocationMode(LocationClientOption.LocationMode.Hight_Accuracy);
//        option.setCoorType("bd09ll");
//        option.setScanSpan(1000);
//        option.setIsNeedAddress(true);
//        option.setIsNeedLocationDescribe(true);
//        option.setOpenGps(true);
//        option.setIgnoreKillProcess(false);
//        option.setEnableSimulateGps(false);
//
//        final LocationClient locationClient = new LocationClient(context);
//        locationClient.setLocOption(option);
//
//        locationClient.registerLocationListener(new BDLocationListener() {
//            @Override
//            public void onReceiveLocation(BDLocation bdLocation) {
//                int locType = bdLocation.getLocType();
//                if (locType == BDLocation.TypeGpsLocation || locType == BDLocation.TypeNetWorkLocation
//                    || locType == BDLocation.TypeOffLineLocation) {
//                    // 定位成功
//                    // locationClient.stop();
//
//                    Log.d(REACT_CLASS, "location success, Latitude:"+ bdLocation.getLatitude()
//                            +", Longitude:" + bdLocation.getLongitude() + ", AddrStr:" + bdLocation.getAddrStr());
//
//
//                    MyLocationData myLocationData = new MyLocationData.Builder()
//                            .latitude(bdLocation.getLatitude())
//                            .longitude(bdLocation.getLongitude()).build();
//                    map.setMyLocationData(myLocationData);
//
//                    // 移动到定位点
//                    move(map, bdLocation.getLatitude(), bdLocation.getLongitude());
//
//                } else {
//                    Log.d(REACT_CLASS, "location fail, locType:" + locType);
//                }
//
//            }
//        });
//
//        locationClient.start();
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
//        Map<String, Marker> oldTaxiMap = (Map)MapViewExtendData.getData(view, "taxiMarkerMap");
//        Map<String, Marker> newTaxiMap = new HashMap<>();
//
//        if (taxies != null && taxies.size() > 0) {
//            for (int i = 0; i < taxies.size(); i++) {
//                ReadableMap map = taxies.getMap(i);
//                String taxiId = map.getString("id");
//                //定义Maker坐标点
//                LatLng point = new LatLng(map.getDouble("lat"), map.getDouble("lng"));
//                Dynamic direction = map.getDynamic("direction");
//                float rotate = (float)(direction.isNull() ? -90 : direction.asDouble() - 180); // icon本来车头向左, 如果无方向信息，默认车头向上
//                Marker marker = null;
//                if (oldTaxiMap != null && oldTaxiMap.containsKey(taxiId)) {
//                    // marker已经存在
//                    marker = oldTaxiMap.get(taxiId);
//                    marker.setPosition(point);
//                    marker.setRotate(rotate);
//                    oldTaxiMap.remove(taxiId);
//                } else {
//                    //构建Marker图标
//                    BitmapDescriptor bitmap = BitmapDescriptorFactory.fromResource(R.drawable.taxi_top_yellow);
//                    //构建MarkerOption，用于在地图上添加Marker
//                    OverlayOptions option = new MarkerOptions()
//                            .position(point)
//                            .rotate(rotate)
//                            .animateType(MarkerOptions.MarkerAnimateType.grow)
//                            .icon(bitmap);
//                    //在地图上添加Marker，并显示
//                    marker = (Marker)view.getMap().addOverlay(option);
//                }
//
//                newTaxiMap.put(taxiId, marker);
//            }
//        }
//
//        // 清除marker
//        if (oldTaxiMap != null && !oldTaxiMap.isEmpty()) {
//            for (Marker marker : oldTaxiMap.values()) {
//                marker.remove();
//            }
//        }
//
//        MapViewExtendData.setData(view, "taxiMarkerMap", newTaxiMap);
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
//        if (points == null || points.size() == 0) {
//            return;
//        }
//        LatLngBounds.Builder builder = new LatLngBounds.Builder();
//        for (int i = 0; i < points.size(); i++) {
//            ReadableMap point = points.getMap(i);
//            builder.include(new LatLng(point.getDouble("lat"), point.getDouble("lng")));
//        }
//        view.getMap().setMapStatusLimits(builder.build());
    }

    /**
     * 命令常量
     */
    private static interface Command {
        int SET_MAP_BOUND = 1;
        int LAUNCH_NAVI = 2;
        int STOP_NAVI = 3;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("setMapBound", Command.SET_MAP_BOUND,
                "launchNavi", Command.LAUNCH_NAVI,
                "stopNavi", Command.STOP_NAVI);
    }

    @Override
    public void receiveCommand(AMapView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case Command.SET_MAP_BOUND:
                setMapBound(root, args);
                break;
            case Command.LAUNCH_NAVI:
                launchNavi(root, args);
                break;
            case Command.STOP_NAVI:
                stopNavi(root);
                break;
        }
    }

    /**
     * 启动导航
     * @param view
     * @param points 经过点 [{lng, lat, name}]
     */
    private void launchNavi(MapView view, ReadableArray points) {
//        LaunchNaviRun launchRun = new LaunchNaviRun(points, view);
//
//        if (!BaiduNaviManager.isNaviInited()) {
//            String naviDir = initNaviDirs();
//            if (naviDir == null) {
//                toast("目录初始化失败");
//                return;
//            }
//            initNavi(naviDir, launchRun);
//        }
//
//        launchRun.run();
    }


    private class LaunchNaviRun implements Runnable {
        private ReadableArray points;
        private MapView mapView;

        public LaunchNaviRun(ReadableArray points, MapView mapView) {
            this.points = points;
            this.mapView = mapView;
        }

        @Override
        public void run() {
//            BNRoutePlanNode.CoordinateType coType = BNRoutePlanNode.CoordinateType.BD09LL;
//            List<BNRoutePlanNode> list = new ArrayList<BNRoutePlanNode>();
//            for (int i = 0; i < points.size(); i++) {
//                ReadableMap point = points.getMap(i);
//                // new BNRoutePlanNode(116.30784537597782, 40.057009624099436, "百度大厦", null, coType);
//                list.add(new BNRoutePlanNode(point.getDouble("lng"), point.getDouble("lat"), point.getString("name"), null, coType));
//            }
//
//            BaiduNaviManager.getInstance().launchNavigator(context.getCurrentActivity(), list, 1, true, new BaiduNaviManager.RoutePlanListener() {
//
//                @Override
//                public void onJumpToNavigator() {
//            /*
//             * 设置途径点以及resetEndNode会回调该接口
//             */
////            Intent intent = new Intent(context.getCurrentActivity(), BNDemoGuideActivity.class);
////            Bundle bundle = new Bundle();
////            bundle.putSerializable(ROUTE_PLAN_NODE, (BNRoutePlanNode) mBNRoutePlanNode);
////            intent.putExtras(bundle);
////            startActivity(intent);
//                    showNaviView(mapView);
//                }
//
//                @Override
//                public void onRoutePlanFailed() {
//                    toast("算路失败");
//                }
//            });
        }
    }


    /**
     * 显示导航view
     */
    private void showNaviView(final MapView mapView) {
//        View view = BNRouteGuideManager.getInstance().onCreate(context.getCurrentActivity(), new BNRouteGuideManager.OnNavigationListener() {
//
//            @Override
//            public void onNaviGuideEnd() {
//                stopNavi(mapView);
//            }
//
//            @Override
//            public void notifyOtherAction(int actionType, int arg1, int arg2, Object obj) {
//
//                if (actionType == 0) {
//                    //导航到达目的地 自动退出
//                    //Log.i(TAG, "notifyOtherAction actionType = " + actionType + ",导航到达目的地！");
//                    stopNavi(mapView);
//                }
//
//                //Log.i(TAG, "actionType:" + actionType + "arg1:" + arg1 + "arg2:" + arg2 + "obj:" + obj.toString());
//            }
//
//        });
//        MapViewExtendData.setData(mapView, "naviView", view);
//
//        ViewGroup.LayoutParams layoutParams = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
//        context.getCurrentActivity().addContentView(view, layoutParams);

    }

//    private void toast(String message) {
//        Toast.makeText(context.getCurrentActivity(), message, Toast.LENGTH_SHORT).show();
//    }


    /**
     * 初始化导航
     * @param dir
     * @param launchRun 在初始化成功后调用
     */
    private void initNavi(String dir, final LaunchNaviRun launchRun) {

//        BaiduNaviManager.getInstance().init(context.getCurrentActivity(), dir, "todaytaxi", new BaiduNaviManager.NaviInitListener() {
//            @Override
//            public void onAuthResult(int status, String msg) {
//                if (0 != status) {
//                    toast("key校验失败, " + msg);
//                }
//
//            }
//
//            public void initSuccess() {
//                toast("百度导航引擎初始化成功");
//                initSetting();
//                launchRun.run();
//            }
//
//            public void initStart() {
//                //Toast.makeText(context.getCurrentActivity(), "百度导航引擎初始化开始", Toast.LENGTH_SHORT).show();
//            }
//
//            public void initFailed() {
//                //Toast.makeText(context.getCurrentActivity(), "百度导航引擎初始化失败", Toast.LENGTH_SHORT).show();
//            }
//
//        }, null, null, null);
    }

    private void initSetting() {
//        // BNaviSettingManager.setDayNightMode(BNaviSettingManager.DayNightMode.DAY_NIGHT_MODE_DAY);
//        BNaviSettingManager
//                .setShowTotalRoadConditionBar(BNaviSettingManager.PreViewRoadCondition.ROAD_CONDITION_BAR_SHOW_ON);
//        BNaviSettingManager.setVoiceMode(BNaviSettingManager.VoiceMode.Veteran);
//        // BNaviSettingManager.setPowerSaveMode(BNaviSettingManager.PowerSaveMode.DISABLE_MODE);
//        BNaviSettingManager.setRealRoadCondition(BNaviSettingManager.RealRoadCondition.NAVI_ITS_ON);
////        Bundle bundle = new Bundle();
////        // 必须设置APPID，否则会静音
////        bundle.putString(BNCommonSettingParam.TTS_APP_ID, "9354030");
////        BNaviSettingManager.setNaviSdkParam(bundle);

    }


    private String initNaviDirs() {
        String mSDCardPath = getSdcardDir();
        if (mSDCardPath == null) {
            return null;
        }
        File f = new File(mSDCardPath, "todaytaxi");
        if (!f.exists()) {
            try {
                f.mkdir();
            } catch (Exception e) {
                return null;
            }
        }
        return mSDCardPath;
    }

    private String getSdcardDir() {
        if (Environment.getExternalStorageState().equalsIgnoreCase(Environment.MEDIA_MOUNTED)) {
            return Environment.getExternalStorageDirectory().toString();
        }
        return null;
    }

    /**
     * 停止导航
     */
    private void stopNavi(MapView mapView) {
//        View naviView = (View)MapViewExtendData.remove(mapView, "naviView");
//        if (naviView != null) {
//            ViewGroup parent = (ViewGroup)naviView.getParent();
//            if (parent != null) {
//                parent.removeView(naviView);
//            }
//            BNRouteGuideManager.getInstance().forceQuitNaviWithoutDialog();
//        }
    }

//    public void onMapStatusChangeFinish(MapStatus mapStatus) {
//        RCTEventEmitter emitter = context.getJSModule(RCTEventEmitter.class);
//        WritableMap event = Arguments.createMap();
//        event.putString("eventType", "statusChange");
//
//        // 中点
//        WritableMap target = Arguments.createMap();
//        WritableMapUtil.put(target, mapStatus.target);
//        event.putMap("target", target);
//
//        // 范围
//        WritableMap bound = Arguments.createMap();
//        WritableMapUtil.put(bound, mapStatus.bound);
//        event.putMap("bound", bound);
//
//        // 级别
//        event.putInt("level", mapView.getMapLevel());
//
//        // 发送事件
//        emitter.receiveEvent(mapView.getId(), "topChange", event);
//    }

}