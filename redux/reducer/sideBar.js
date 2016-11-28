/**
 * SideBar状态
 * @date 2016-11-28
 */

export default function sideBar(preState = {isShow: false}, action) {
    switch(action.type) {
        case 'toggleSideBar':
            return {
                preState,
                isShow: !preState.isShow
            };
        default :
            return preState;
    }

}