/**
 * 返回工具
 */

/**
 * 页面返回
 * 
 * 处理按钮点击返回, 需要用该bind(页面对象)
 */
export function pageBack() {
    var navigation = this.props.navigation;
    if (navigation) { // 通过Navigator加载的页面都会带navigation
        navigation.goBack();
    }
}