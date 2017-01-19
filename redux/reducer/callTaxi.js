/**
 * 叫车状态
 * @author zhujun
 * @date 2016-12-29
 */

export default function callTaxi(preStatus = {
    from: {
        locationed: false,
        address: '正在定位...',
        lng: 0,
        lat: 0
    },
    go: {
        locationed: false,
        address: '点击选择',
        lng: 0,
        lat: 0
    },
    locationWho: 'from',
    goAddrSearchResult: []
}, action) {
    switch (action.type) {
        case 'startReverseGeoCode':
            if (preStatus.locationWho === 'from') {
                var status = {...preStatus, from:{...preStatus.from, address: '正在定位...', locationed: false}};
                return status;
            }
            break;
        case 'reverseGeoCodeResult':
            if (preStatus.locationWho === 'from') {
                var status = {...preStatus, from:{...preStatus.from, address: action.address, locationed: true}};
                return status;
            }
            break;
        case 'goAddrSearchChanged':
            return {...preStatus, goAddrSearchResult:action.searchResult};
        default:
            return preStatus;
    }
        
}