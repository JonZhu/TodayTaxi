/**
 * 返回工具
 */

/**
 * 页面返回
 * 
 * 处理按钮点击返回, 需要用该bind(页面对象)
 */
export function pageBack() {
    var navigator = this.props.navigator;
    if (navigator) { // 通过AppNavigator加载的页面都会带navigator
        navigator.pop();
    }
}