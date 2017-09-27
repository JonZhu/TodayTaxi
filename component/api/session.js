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
        var sessionJsonStr = await AsyncStorage.getItem("sessionId");
        if (sessionJsonStr) {
            var session = JSON.parse(sessionJsonStr);
            sessionId = session.id;
        }
    }
    return sessionId;
}

/**
 * 保存session
 * @param {id, expire} value 
 */
export function saveSession(session) {
    if (session) {
        sessionId = session.id;
        session.localTime = new Date().getMilliseconds(); // 记录app当前本地时间
        AsyncStorage.setItem("sessionId", JSON.stringify(session));
    } else {
        sessionId = null;
        AsyncStorage.removeItem('sessionId');
    }
    
}
