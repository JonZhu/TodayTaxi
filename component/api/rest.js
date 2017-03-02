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

const serverPrefix = 'http://10.10.10.90:8080';

var sessionId;

async function rest(url, param) {
    var absUrl;
    if (url.startsWith('/')) {
        absUrl = serverPrefix + url;
    } else if (url.startsWith('http')) {
        absUrl = url;
    } else {
        absUrl = serverPrefix + '/' + url;
    }

    var queryStr = getQueryStrForSign();
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
        option.headers['Content-Type'] = 'application/json'; // 使用json方式提交数据
        option.body = JSON.stringify(param);

        signInput += "||" + option.body;
    }

    var sign = md5(signInput); // 签名
    absUrl += "?" + queryStr + "&sign=" + sign; // 增加queryStr和签名参数

    return fetch(absUrl, option).then((response)=>response.json());
}

function getQueryStrForSign() {
    var queryStr = "";
    if (sessionId) {
        queryStr += "sessionId=" + sessionId;
    }

    if (queryStr.length > 0) {
        queryStr += "&";
    }
    queryStr += "t=" + new Date().getMilliseconds();

    return queryStr;
}

export default rest;