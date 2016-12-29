/**
 * 叫车状态
 * @author zhujun
 * @date 2016-12-29
 */

export default function callTaxi(preStatus = {
    from: {
        locationed: false,
        address: '正在定位',
        lng: 0,
        lat: 0
    },
    go: {
        locationed: false,
        address: '点击选择',
        lng: 0,
        lat: 0
    },
}, action) {
    switch (action.type) {
        case '' :
            return preStatus;
        default :
            return preStatus;
    }
        
}