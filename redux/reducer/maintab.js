/**
 * 主页标签状态
 * 
 */

export const TAB_MAIN = 'mainTab';
export const TAB_SETTING = 'settingTab';
export const TAB_USER = 'userTab';

export default function maintab(preStatus = TAB_MAIN, action) {
    switch (action.type) {
        case 'changeMainTab' :
            return action.newTab;
        default :
            return preStatus;
    }
        
}