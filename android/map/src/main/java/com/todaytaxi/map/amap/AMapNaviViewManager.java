package com.todaytaxi.map.amap;

import android.view.ViewGroup;

import com.amap.api.navi.AMapNaviView;
import com.amap.api.navi.AMapNaviViewOptions;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * 导航View
 *
 * Created by zhujun on 2017/4/7.
 */

public class AMapNaviViewManager extends SimpleViewManager<AMapNaviView> {
    @Override
    public String getName() {
        return "AMapNaviView";
    }

    @Override
    protected AMapNaviView createViewInstance(ThemedReactContext reactContext) {
        AMapNaviView view = new AMapNaviView(reactContext.getCurrentActivity());
        view.onCreate(reactContext.getCurrentActivity().getIntent().getExtras());
        view.setNaviMode(AMapNaviView.CAR_UP_MODE); // 车头向上
        view.recoverLockMode(); // 锁车
        //view.setAMapNaviViewListener();
//        AMapNaviViewOptions options = new AMapNaviViewOptions();
//        options.setLayoutVisible(true);
//        options.setAutoDrawRoute(true);
//        view.setViewOptions(options);
        ViewGroup.LayoutParams layout = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        view.setLayoutParams(layout);
        return view;
    }

}
