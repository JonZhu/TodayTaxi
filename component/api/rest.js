/**
 * rest接口
 * @author zhujun
 * @date 2017-2-16
 * 
 * url不加服务地址前缀,
 * param为请求json参数，可选
 * 
 */

const serverPrefix = 'http://10.10.10.90:8080';

async function rest(url, param) {
    var absUrl;
    if (url.startsWith('/')) {
        absUrl = serverPrefix + url;
    } else {
        absUrl = serverPrefix + '/' + url;
    }

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
    }

    return fetch(absUrl, option).then((response)=>response.json());
}

export default rest;