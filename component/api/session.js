/**
 * 会话数据
 * 
 * @author zhujun
 * @date 2017-3-3
 */
import { AsyncStorage } from 'react-native';

var sessionId;

/**
 * 获取session
 */
export async function getSessionId() {
    if (!sessionId) {
        sessionId = await AsyncStorage.getItem("sessionId");
    }
    return sessionId;
}

/**
 * 保存session
 * @param {*} value 
 */
export function setSessionId(value) {
    sessionId = value;
    AsyncStorage.setItem("sessionId", value);
}
