/**
 * 安全
 * 
 * @author zhujun
 * @date 2017-3-3
 */

import rest from './rest';
import { setSessionId } from './session';

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
                    setSessionId(result.payload); // 保存session
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