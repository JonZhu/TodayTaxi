package com.todaytaxi.map;

import com.baidu.trace.LBSTraceClient;
import com.baidu.trace.OnEntityListener;
import com.baidu.trace.OnStartTraceListener;
import com.baidu.trace.OnStopTraceListener;
import com.baidu.trace.Trace;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * 轨迹服务
 *
 * Created by zhujun on 2017/3/28.
 */

public class ReactTraceModule extends ReactContextBaseJavaModule {

    /**
     * 墨迹ClientMap, 键为entityName
     */
    private final static Map<String, LBSTraceClient> TRACE_CLIENT_MAP = new HashMap<>();

    public ReactTraceModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ReactTraceModule";
    }

    /**
     * 启动一个轨迹
     * @param entityName 实体名称
     */
    @ReactMethod
    public void traceStart(String entityName, final Promise promise) {
        LBSTraceClient client = new LBSTraceClient(getReactApplicationContext());
        int serviceId = R.integer.bd_trace_service_id;
        //轨迹服务类型（0 : 不上传位置数据，也不接收报警信息； 1 : 不上传位置数据，但接收报警信息；2 : 上传位置数据，且接收报警信息）
        int traceType = 2;
        Trace trace = new Trace(getReactApplicationContext(), serviceId, entityName, traceType);
        //实例化开启轨迹服务回调接口
        OnStartTraceListener startTraceListener = new OnStartTraceListener() {
            /**
             *
             * @param errorNo
             *             0：success，
            10000：开启服务请求发送失败，
            10001：开启服务失败，
            10002：参数错误，
            10003：网络连接失败，
            10004：网络未开启，
            10005：服务正在开启，
            10006：服务已开启，
            10007：服务正在停止，
            10008：开启缓存，
            10009：已开启缓存
             *
             * @param message
             */
            @Override
            public void onTraceCallback(int errorNo, String message) {
                if (errorNo == 0) {
                    promise.resolve(0);
                } else {
                    promise.reject(String.valueOf(errorNo), message);
                }
            }
            //轨迹服务推送接口（用于接收服务端推送消息，arg0 : 消息类型，arg1 : 消息内容，详情查看类参考）
            @Override
            public void onTracePushCallback(byte arg0, String arg1) {
            }
        };

        //开启轨迹服务
        client.startTrace(trace, startTraceListener);

        TRACE_CLIENT_MAP.put(entityName, client);
    }

    /**
     * 停止轨迹服务
     *
     * @param entityName
     * @param promise
     */
    @ReactMethod
    public void traceStop(String entityName, final Promise promise) {
        LBSTraceClient client = TRACE_CLIENT_MAP.remove(entityName);
        if (client != null) {
            //实例化停止轨迹服务回调接口
            OnStopTraceListener stopTraceListener = new OnStopTraceListener(){
                // 轨迹服务停止成功
                @Override
                public void onStopTraceSuccess() {
                    promise.resolve(0);
                }

                /**
                 *
                 * @param errorNo
                11000：停止服务请求发送失败，
                11001：停止服务失败，
                11002：服务未开启，
                11003：服务正在停止
                 *
                 * @param message
                 */
                @Override
                public void onStopTraceFailed(int errorNo, String message) {
                    promise.reject(String.valueOf(errorNo), message);
                }
            };
            int serviceId = R.integer.bd_trace_service_id;
            Trace trace = new Trace(getReactApplicationContext(), serviceId, entityName, 2);
            //停止轨迹服务
            client.stopTrace(trace,stopTraceListener);
            client.onDestroy();
        } else {
            // 无client
            promise.resolve(1);
        }
    }

    /**
     * 查询entity最新位置
     *
     * @param entityName
     * @param promise
     *
     * @return {lng, lat, direction, speed}
     */
    @ReactMethod
    public void queryLastLoc(String entityName, final Promise promise) {
        final LBSTraceClient client = new LBSTraceClient(getReactApplicationContext());
        int serviceId = R.integer.bd_trace_service_id;
        /**
         serviceId - 轨迹服务标识
         entityNames - entity标识列表（多个entityName，以英文逗号"," 分隔）
         columnKey - 属性名称（格式为 : "key1=value1,key2=value2,....."）
         returnType - 返回结果的类型

         0 : 返回全部结果
         1 : 只返回entityName的列表


         activeTime - 活跃时间（指定该字段时，返回从该时间点之后仍有位置变动的entity的实时点集合）
         pageSize - 分页大小
         pageIndex - 分页索引
         listener - Entity监听器，对应回调接口为: OnEntityListener.onQueryEntityListCallback(String)
         */
        client.queryEntityList(serviceId, entityName, null, 0, 0, 1, 1, new OnEntityListener() {
            @Override
            public void onRequestFailedCallback(String s) {
                client.onDestroy();
                promise.reject("1", s);
            }

            @Override
            public void onQueryEntityListCallback(String s) {
                // 返回数据结构 http://lbsyun.baidu.com/index.php?title=yingyan/api/entity#list.E2.80.94.E2.80.94.E6.9F.A5.E8.AF.A2entity
                WritableMap result = null;
                try {
                    JSONObject json = new JSONObject(s);
                    JSONArray entities = json.getJSONArray("entities");
                    if (entities != null && entities.length() > 0) {
                        JSONObject point = entities.getJSONObject(0).getJSONObject("realtime_point");
                        if (point != null) {
                            result = Arguments.createMap();
                            JSONArray loc = point.getJSONArray("location"); // 百度加密坐标 [116.1556024,40.0820658]
                            result.putDouble("lng", loc.getDouble(0));
                            result.putDouble("lat", loc.getDouble(1));
                            result.putInt("direction", point.getInt("direction")); // 范围为[0,359]，0度为正北方向，顺时针
                            result.putDouble("speed", point.getDouble("speed")); // 单位：km/h
                        }
                    }
                } catch (JSONException e) {
                    promise.reject("2", e);
                    return;
                } finally {
                    client.onDestroy();
                }

                promise.resolve(result);
            }
        });
    }

}
