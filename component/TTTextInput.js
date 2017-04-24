/**
 * 文件输入
 * 
 * @author zhujun
 * @date 2017-4-24
 */

import React, { Component } from 'react';
import { TextInput } from 'react-native';

class TTTextInput extends Component {

    constructor() {
        super();
        this._onChangeText = this._onChangeText.bind(this);
        this._filterText = this._filterText.bind(this);
    }

    _onChangeText(text) {
        if (this.props.onChangeText) { // 存在外层函数
            var textResult = text;
            if (this.props.regexp) {
                // 处理text
                var result = this._filterText(text, this.props.regexp);
                textResult = result.length > 0 ? result[0] : null;
            }

            // 调用外层事件函数
            this.props.onChangeText(textResult);
        }
    }


    _filterText(text, regexp) {
        var reg = new RegExp(regexp);
        return reg.exec(text);
    }

    render() {
        return <TextInput {...this.props} onChangeText={this._onChangeText} />
    }
}

TTTextInput.propTypes = {
    ...TextInput.propTypes,
    regexp: React.PropTypes.string
};

export default TTTextInput;