/**
 * 日期工具
 * 
 * @author zhujun
 * @date 2017-4-28
 */

/**
 * 毫秒转时间字符串
 */
export function toTimeStr(ms) {
    try {
        var date = new Date(ms);
        return date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日 ' 
            + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    } catch (error) {
        return '';
    }
}