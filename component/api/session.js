/**
 * 会话数据
 * 
 * @author zhujun
 * @date 2017-3-3
 */
import { AsyncStorage } from 'react-native';
import rest from './rest';

/**
 * session信息 {id, expire, localTime}
 */
var currentSession;

/**
 * 获取session
 */
export async function getSessionId() {
    if (!currentSession) {
        var sessionJsonStr = await AsyncStorage.getItem("session");
        if (sessionJsonStr) {
            currentSession = JSON.parse(sessionJsonStr);
        }
    }

    if (currentSession) {
        // 本地判断session是否将过期
        var sessionLife = (new Date().getMilliseconds() - currentSession.localTime) / 1000; // session生命
        if (currentSession.expire - sessionLife < 30) {
            // 还有30秒到期，交换session
            exchangeSession();
        }
    }

    return currentSession ? currentSession.id : null;
}

/**
 * 保存session
 * @param {id, expire} value 
 */
function saveSession(session) {
    if (session) {
        session.localTime = new Date().getMilliseconds(); // 记录app当前本地时间
        currentSession = session;
        AsyncStorage.setItem("session", JSON.stringify(session));
    } else {
        currentSession = null;
        AsyncStorage.removeItem('session');
    }
    
}


/**
 * 申请session
 */
export async function applySession() {
    return new Promise(function(resolve, reject){
        var count = 0;
        var applyFun = function() {
            count++;
            rest("/security/applySession.do").then((result)=>{
                if (result.code === 0) {
                    saveSession(result.payload); // 保存session
                    resolve();
                }
            }).catch((reason)=>{
                if (count > 5) {
                    reject("timeout:" + reason);
                } else {
                    setTimeout(applyFun, 3000) // 3秒再重试
                }
            });
        }
        
        applyFun();
    });
}

/**
 * 交换session
 */
export function exchangeSession() {
    // rest方法会自动传递当前sessionId参数
    rest('/security/exchangeSession.do').then((result)=>{
        if (result.code === 0) {
            saveSession(result.payload);
        }
    })
}
