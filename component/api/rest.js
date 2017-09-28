/**
 * rest接口
 * @author zhujun
 * @date 2017-2-16
 * 
 * url不加服务地址前缀,
 * param为请求json参数，可选
 * 
 */

import md5 from 'md5';
import { getSessionId, applySession, exchangeSession} from './session';
import CommonExceptionCode from './CommonExceptionCode';

// const serverPrefix = 'http://10.10.10.90:8080';
const serverPrefix = 'http://www.todaytaxi.com:11986';

// 发送rest请求
async function rest(url, param) {
    var absUrl;
    if (url.startsWith('/')) {
        absUrl = serverPrefix + url;
    } else if (url.startsWith('http')) {
        absUrl = url;
    } else {
        absUrl = serverPrefix + '/' + url;
    }

    var queryStr = await getQueryStrForSign();
    var signInput = queryStr;

    var option = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    };

    if (param) {
        // 需要传参数，使用post，否则使用get
        option.method = 'POST';
        if (param instanceof String) {
            option.headers['Content-Type'] = 'text/plain';
            option.body = param; // string参数不用再处理, 直接传给body
        } else {
            option.headers['Content-Type'] = 'application/json'; // 使用json方式提交数据
            option.body = JSON.stringify(param);
        }

        signInput += "||" + option.body;
    }

    var sign = md5(signInput); // 签名
    absUrl += "?" + queryStr + "&sign=" + sign; // 增加queryStr和签名参数

    var response = await fetch(absUrl, option);

    // 从服务端判断session是否将要过期
    var sessionWillTimeout = response.headers.get('Session-Will-Timeout');
    if (sessionWillTimeout) {
        exchangeSession(); // 交换session
    }

    return response.json();
}

// 组织除sign外的公共参数，做为签名的一部分
async function getQueryStrForSign() {
    var queryStr = "";
    var sessionId = await getSessionId();
    if (sessionId) {
        queryStr += "sessionId=" + sessionId;
    }

    if (queryStr.length > 0) {
        queryStr += "&";
    }
    queryStr += "t=" + new Date().getTime();

    return queryStr;
}

export default rest;

export async function rest2(url, param) {
    var response = await rest(url, param);
    if (response) {
        var code = response.code;
        if (code === CommonExceptionCode.SESSION_NO_PARAM || code === CommonExceptionCode.SESSION_TIMEOUT) {
            await applySession(); // 重新申请session
            response = await rest(url, param); // 重新调用rest
        }
    }
    return response;
}