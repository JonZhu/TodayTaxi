/**
 * 轨迹API
 * 
 * @author zhujun
 * @date 2017-3-28
 * 
 * <p>
 * 反向地理编码
 * traceStart(String entityName, final Promise promise)
 * 
 * 地理编码
 * traceStop(String entityName, final Promise promise)
 * 
 * 查询entity最新位置
 * queryLastLoc(String entityName, final Promise promise)
 * 返回：{lng, lat, direction, speed}
 * 
 * </p>
 * 
 */

import { NativeModules } from 'react-native';

const TraceModule = NativeModules.ReactTraceModule;

export default TraceModule;