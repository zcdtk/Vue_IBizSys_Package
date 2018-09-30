"use strict";
/**
 * IBizSys平台工具类
 *
 * @class IBizUtil
 */
var IBizUtil = /** @class */ (function () {
    function IBizUtil() {
    }
    /**
     * 创建 UUID
     *
     * @static
     * @returns {string}
     * @memberof IBizUtil
     */
    IBizUtil.createUUID = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    /**
     * 判断条件是否成立
     *
     * @static
     * @param {*} value
     * @param {*} op
     * @param {*} value2
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.testCond = function (value, op, value2) {
        // 等于操作
        if (Object.is(op, 'EQ')) {
            return value === value2;
        }
        // 大于操作
        if (Object.is(op, 'GT')) {
            var result = this.compare(value, value2);
            if (result !== undefined && result > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        // 大于等于操作
        if (Object.is(op, 'GTANDEQ')) {
            var result = this.compare(value, value2);
            if (result !== undefined && result >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        // 值包含在给定的范围中
        if (Object.is(op, 'IN')) {
            return this.contains(value, value2);
        }
        // 不为空判断操作
        if (Object.is(op, 'ISNOTNULL')) {
            return (value != null && value !== '');
        }
        // 为空判断操作
        if (Object.is(op, 'ISNULL')) {
            return (value == null || value === '');
        }
        // 文本左包含
        if (Object.is(op, 'LEFTLIKE')) {
            return (value && value2 && (value.toUpperCase().indexOf(value2.toUpperCase()) === 0));
        }
        // 文本包含
        if (Object.is(op, 'LIKE')) {
            return (value && value2 && (value.toUpperCase().indexOf(value2.toUpperCase()) !== -1));
        }
        // 小于操作
        if (Object.is(op, 'LT')) {
            var result = this.compare(value, value2);
            if (result !== undefined && result < 0) {
                return true;
            }
            else {
                return false;
            }
        }
        // 小于等于操作
        if (Object.is(op, 'LTANDEQ')) {
            var result = this.compare(value, value2);
            if (result !== undefined && result <= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        // 不等于操作
        if (Object.is(op, 'NOTEQ')) {
            return value !== value2;
        }
        // 值不包含在给定的范围中
        if (Object.is(op, 'NOTIN')) {
            return !this.contains(value, value2);
        }
        // 文本右包含
        if (Object.is(op, 'RIGHTLIKE')) {
            if (!(value && value2)) {
                return false;
            }
            var nPos = value.toUpperCase().indexOf(value2.toUpperCase());
            if (nPos === -1) {
                return false;
            }
            return nPos + value2.length === value.length;
        }
        // 空判断
        if (Object.is(op, 'TESTNULL')) {
        }
        // 自定义包含
        if (Object.is(op, 'USERLIKE')) {
        }
        return false;
    };
    /**
     * 文本包含
     *
     * @static
     * @param {any} value
     * @param {any} value2
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.contains = function (value, value2) {
        if (value && value2) {
            // 定义一数组
            var arr = new Array();
            arr = value2.split(',');
            // 定义正则表达式的连接符
            var S = String.fromCharCode(2);
            var reg = new RegExp(S + value + S);
            return (reg.test(S + arr.join(S) + S));
        }
        return false;
    };
    /**
     * 值比较
     *
     * @static
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof IBizUtil
     */
    IBizUtil.compare = function (value, value2) {
        var result;
        if (!Object.is(value, '') && !Object.is(value2, '') && !isNaN(value) && !isNaN(value2)) {
            result = this.compareNumber(parseFloat(value), parseFloat(value2));
        }
        else if (this.isParseDate(value) && this.isParseDate(value2)) {
            result = this.compareDate((new Date(value)).getTime(), (new Date(value2)).getTime());
        }
        else if (value && (typeof (value) === 'boolean' || value instanceof Boolean)) {
            result = this.compareBoolean(value, value2);
        }
        else if (value && (typeof (value) === 'string' || value instanceof String)) {
            result = this.compareString(value, value2);
        }
        return result;
    };
    /**
     * 是否是时间
     *
     * @static
     * @param {string} value
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.isParseDate = function (value) {
        var time = new Date(value);
        if (isNaN(time.getTime())) {
            return false;
        }
        return true;
    };
    /**
     * 时间值比较（毫秒数）
     *
     * @static
     * @param {number} value
     * @param {number} value2
     * @returns {number}
     * @memberof IBizUtil
     */
    IBizUtil.compareDate = function (value, value2) {
        if (value > value2) {
            return 1;
        }
        else if (value < value2) {
            return -1;
        }
        else {
            return 0;
        }
    };
    /**
     * 数值比较
     *
     * @static
     * @param {number} value
     * @param {number} value2
     * @returns {number}
     * @memberof IBizUtil
     */
    IBizUtil.compareNumber = function (value, value2) {
        if (value > value2) {
            return 1;
        }
        else if (value < value2) {
            return -1;
        }
        else {
            return 0;
        }
    };
    /**
     * 字符串比较
     *
     * @static
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof IBizUtil
     */
    IBizUtil.compareString = function (value, value2) {
        return value.localeCompare(value2);
    };
    /**
     * boolean 值比较
     *
     * @static
     * @param {*} value
     * @param {*} value2
     * @returns {number}
     * @memberof IBizUtil
     */
    IBizUtil.compareBoolean = function (value, value2) {
        if (value === value2) {
            return 0;
        }
        else {
            return -1;
        }
    };
    /**
    *
    *
    * @param {*} [o={}]
    * @memberof IBizUtil
    */
    IBizUtil.processResult = function (o) {
        if (o === void 0) { o = {}; }
        if (o.url != null && o.url !== '') {
            window.location.href = o.url;
        }
        if (o.code != null && o.code !== '') {
            eval(o.code);
        }
        if (o.downloadurl != null && o.downloadurl !== '') {
            var downloadurl = this.parseURL2('', o.downloadurl, '');
            this.download(downloadurl);
        }
    };
    /**
     * 下载文件
     *
     * @static
     * @param {string} url
     * @memberof IBizUtil
     */
    IBizUtil.download = function (url) {
        window.open(url, '_blank');
    };
    /**
     *
     *
     * @static
     * @param {any} subapp
     * @param {any} url
     * @param {any} params
     * @returns {string}
     * @memberof IBizUtil
     */
    IBizUtil.parseURL2 = function (subapp, url, params) {
        var tmpURL;
        // let root;
        // if (subapp) {
        //     root = WEBROOTURL;
        // } else {
        //     root = BASEURL;
        // }
        // if (url.toLowerCase().indexOf('http') !== -1) {
        //     tmpURL = url;
        // } else {
        //     tmpURL = root + '/jsp' + url;
        // }
        if (url.indexOf('../../') !== -1) {
            tmpURL = url.substring(url.indexOf('../../') + 6, url.length);
        }
        else if (url.indexOf('/') === 0) {
            tmpURL = url.substring(url.indexOf('/') + 1, url.length);
        }
        else {
            tmpURL = url;
        }
        if (params) {
            return tmpURL + (url.indexOf('?') === -1 ? '?' : '&'); // + $.param(params);
        }
        else {
            return tmpURL;
        }
    };
    /**
     * 是否是数字
     *
     * @param {*} num
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.isNumberNaN = function (num) {
        return Number.isNaN(num) || num !== num;
    };
    /**
     * 是否未定义
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.isUndefined = function (value) {
        return typeof value === 'undefined';
    };
    /**
     * 是否为空
     *
     * @static
     * @param {*} value
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.isEmpty = function (value) {
        return this.isUndefined(value) || value === '' || value === null || value !== value;
    };
    /**
     * 检查属性常规条件
     *
     * @static
     * @param {*} value 属性值
     * @param {string} op 检测条件
     * @param {*} value2 预定义值
     * @param {string} errorInfo 错误信息
     * @param {string} paramType 参数类型
     * @param {*} form 表单对象
     * @param {boolean} primaryModel 是否必须条件
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.checkFieldSimpleRule = function (value, op, value2, errorInfo, paramType, form, primaryModel) {
        if (Object.is(paramType, 'CURTIME')) {
            value2 = "" + new Date();
        }
        if (Object.is(paramType, 'ENTITYFIELD')) {
            value2 = value2 ? value2.toLowerCase() : '';
            var _value2Field = form.findField(value2);
            if (!_value2Field) {
                this.errorInfo = "\u8868\u5355\u9879" + value2 + "\u672A\u914D\u7F6E";
                return true;
            }
            value2 = _value2Field.getValue();
        }
        if (this.isEmpty(errorInfo)) {
            errorInfo = '内容必须符合值规则';
        }
        this.errorInfo = errorInfo;
        var reault = this.testCond(value, op, value2);
        if (!reault) {
            if (primaryModel) {
                throw new Error(this.errorInfo);
            }
        }
        return !reault;
    };
    /**
     * 检查属性字符长度规则
     *
     * @static
     * @param {*} viewValue
     * @param {number} minLength
     * @param {boolean} indexOfMin
     * @param {number} maxLength
     * @param {boolean} indexOfMax
     * @param {string} errorInfo
     * @param {boolean} primaryModel
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.checkFieldStringLengthRule = function (viewValue, minLength, indexOfMin, maxLength, indexOfMax, errorInfo, primaryModel) {
        if (this.isEmpty(errorInfo)) {
            this.errorInfo = '内容长度必须符合范围规则';
        }
        else {
            this.errorInfo = errorInfo;
        }
        var isEmpty = IBizUtil.isEmpty(viewValue);
        if (isEmpty) {
            if (primaryModel) {
                throw new Error('值为空');
            }
            this.errorInfo = '值为空';
            return true;
        }
        var viewValueLength = viewValue.length;
        // 小于等于
        if (minLength !== null) {
            if (indexOfMin) {
                if (viewValueLength < minLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
            else {
                if (viewValueLength <= minLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }
        //  大于等于
        if (maxLength !== null) {
            if (indexOfMax) {
                if (viewValueLength > maxLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
            else {
                if (viewValueLength >= maxLength) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }
        this.errorInfo = '';
        return false;
    };
    /**
     * 检查属性值正则式规则
     *
     * @static
     * @param {string} viewValue 属性值
     * @param {*} strReg 验证正则
     * @param {string} errorInfo 错误信息
     * @param {boolean} primaryModel 是否关键条件
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.checkFieldRegExRule = function (viewValue, strReg, errorInfo, primaryModel) {
        if (this.isEmpty(errorInfo)) {
            this.errorInfo = '值必须符合正则规则';
        }
        else {
            this.errorInfo = errorInfo;
        }
        var isEmpty = IBizUtil.isEmpty(viewValue);
        if (isEmpty) {
            if (primaryModel) {
                throw new Error('值为空');
            }
            this.errorInfo = '值为空';
            return true;
        }
        var regExp = new RegExp(strReg);
        if (!regExp.test(viewValue)) {
            if (primaryModel) {
                throw new Error(this.errorInfo);
            }
            return true;
        }
        this.errorInfo = '';
        return false;
    };
    /**
     * 检查属性值范围规则
     *
     * @static
     * @param {string} viewValue 属性值
     * @param {*} minNumber 最小数值
     * @param {boolean} indexOfMin 是否包含最小数值
     * @param {*} maxNumber 最大数值
     * @param {boolean} indexOfMax 是否包含最大数值
     * @param {string} errorInfo 错误信息
     * @param {boolean} primaryModel 是否关键条件
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.checkFieldValueRangeRule = function (viewValue, minNumber, indexOfMin, maxNumber, indexOfMax, errorInfo, primaryModel) {
        if (this.isEmpty(errorInfo)) {
            this.errorInfo = '值必须符合值范围规则';
        }
        else {
            this.errorInfo = errorInfo;
        }
        var isEmpty = IBizUtil.isEmpty(viewValue);
        if (isEmpty) {
            if (primaryModel) {
                throw new Error('值为空');
            }
            this.errorInfo = '值为空';
            return true;
        }
        var valueFormat = this.checkFieldRegExRule(viewValue, /^-?\d*\.?\d+$/, null, primaryModel);
        if (valueFormat) {
            return true;
        }
        else {
            this.errorInfo = errorInfo;
        }
        var data = Number.parseFloat(viewValue);
        // 小于等于
        if (minNumber !== null) {
            if (indexOfMin) {
                if (data < minNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
            else {
                if (data <= minNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }
        // //大于等于
        if (maxNumber != null) {
            if (indexOfMax) {
                if (data > maxNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
            else {
                if (data >= maxNumber) {
                    if (primaryModel) {
                        throw new Error(this.errorInfo);
                    }
                    return true;
                }
            }
        }
        this.errorInfo = '';
        return false;
    };
    /**
     * 检查属性值系统值范围规则  暂时支持正则表达式
     *
     * @static
     * @param {string} viewValue 属性值
     * @param {*} strReg 正则
     * @param {string} errorInfo  错误信息
     * @param {boolean} primaryModel 是否关键条件
     * @returns {boolean}
     * @memberof IBizUtil
     */
    IBizUtil.checkFieldSysValueRule = function (viewValue, strReg, errorInfo, primaryModel) {
        return this.checkFieldRegExRule(viewValue, strReg, errorInfo, primaryModel);
    };
    /**
     * 将文本格式的xml转换为dom模式
     *
     * @static
     * @param {string} strXml
     * @memberof IBizUtil
     */
    IBizUtil.parseXML = function (strXml) {
        if (strXml) {
            return new DOMParser().parseFromString(strXml, 'text/xml');
        }
    };
    /**
     * 将xml转换为object对象
     *
     * @static
     * @param {*} node
     * @param {*} [obj={}]
     * @memberof IBizUtil
     */
    IBizUtil.loadXMLNode = function (node, obj) {
        if (obj === void 0) { obj = {}; }
        if (node && node.attributes) {
            var arr = node.attributes;
            for (var i = 0; i < arr.length; i++) {
                var A = arr.item(i).name;
                var B = arr.item(i).value;
                A = A.toLowerCase();
                obj[A] = B;
            }
        }
    };
    /**
     * 将object转换为xml对象
     *
     * @static
     * @param {any} XML
     * @param {any} obj
     * @memberof IBizUtil
     */
    IBizUtil.saveXMLNode = function (XML, obj) {
        var proName = '';
        for (proName in obj) {
            var value = obj[proName];
            if (!value || value instanceof Object || typeof (value) === 'function') {
                continue;
            }
            var proValue = obj[proName].toString();
            if (proValue !== '') {
                XML.attrib(proName, proValue);
            }
        }
    };
    /**
     * 错误提示信息
     *
     * @static
     * @type {string}
     * @memberof IBizUtil
     */
    IBizUtil.errorInfo = '';
    return IBizUtil;
}());

"use strict";
/**
 * IBizHttp net 对象
 *
 * @class IBizHttp
 */
var IBizHttp = /** @class */ (function () {
    function IBizHttp() {
    }
    /**
     * post请求
     *
     * @param {string} url 请求路径
     * @param {*} [params={}] 请求参数
     * @returns {Observable<any>} 可订阅请求对象
     * @memberof IBizHttp
     */
    IBizHttp.prototype.post = function (url, params) {
        if (params === void 0) { params = {}; }
        var _this = this;
        var subject = new rxjs.Subject();
        var params_keys = Object.keys(params);
        var form_arr = [];
        params_keys.forEach(function (key) {
            form_arr.push(key + "=" + params[key]);
        });
        axios({
            method: 'post',
            url: url,
            data: form_arr.join('&'),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', 'Accept': 'application/json' },
        }).then(function (response) {
            if (response.status === 200) {
                if (response.data.ret === 2 && response.data.notlogin) {
                    _this.httpDefaultInterceptor(response.data);
                }
                subject.next(response.data);
            }
            else {
                subject.error(response);
            }
        }).catch(function (response) {
            subject.error(response);
        });
        return subject.asObservable();
    };
    /**
     * get请求
     *
     * @param {string} url 请求路径
     * @param {*} [params={}] 请求参数
     * @returns {Observable<any>} 可订阅请求对象
     * @memberof IBizHttp
     */
    IBizHttp.prototype.get = function (url, params) {
        if (params === void 0) { params = {}; }
        var subject = new rxjs.Subject();
        if (Object.keys(params).length > 0) {
            var params_keys = Object.keys(params);
            var params_arr_1 = [];
            params_keys.forEach(function (key) {
                if (params[key]) {
                    params_arr_1.push(key + "=" + params[key]);
                }
            });
            url = url.indexOf('?') ? url + "&" + params_arr_1.join('&') : url + "?&" + params_arr_1.join('&');
        }
        axios.get(url).
            then(function (response) {
            // handle success
            console.log(response);
            subject.next(response);
        }).catch(function (error) {
            // handle error
            console.log(error);
            subject.error(error);
        });
        return subject.asObservable();
    };
    /**
     * 模拟http拦截器 重定向登陆处理
     *
     * @param {*} [data={}]
     * @memberof IBizHttp
     */
    IBizHttp.prototype.httpDefaultInterceptor = function (data) {
        if (data === void 0) { data = {}; }
        var curUrl = decodeURIComponent(window.location.href);
        if (window.location.href.indexOf('/ibizutil/login.html') === -1) {
            window.location.href = "/" + IBizEnvironment.SysName + IBizEnvironment.LoginRedirect + "?RU=" + curUrl;
        }
    };
    return IBizHttp;
}());

"use strict";
/**
 * 抽象接口对象
 *
 * @class IBizObject
 */
var IBizObject = /** @class */ (function () {
    /**
     * Creates an instance of IBizObject.
     * 创建 IBizObject 实例对象
     *
     * @param {*} [opts={}]
     * @memberof IBizObject
     */
    function IBizObject(opts) {
        if (opts === void 0) { opts = {}; }
        /**
         * 事件对象集合
         *
         * @private
         * @type {Map<string, Subject<any>>}
         * @memberof IBizObject
         */
        this.events = new Map();
        /**
         * http 服务
         *
         * @memberof IBizObject
         */
        this.iBizHttp = new IBizHttp();
        this.id = opts.id;
        this.name = opts.name;
        this.refname = opts.refname;
    }
    /**
     * 对象初始化
     *
     * @param {*} [params={}]
     * @memberof IBizObject
     */
    IBizObject.prototype.init = function (params) {
        if (params === void 0) { params = {}; }
        this.onInit();
    };
    /**
     * 执行初始化
     *
     * @memberof IBizObject
     */
    IBizObject.prototype.onInit = function () {
    };
    /**
     * 设置对象id
     *
     * @param {string} id
     * @memberof IBizObject
     */
    IBizObject.prototype.setId = function (id) {
        this.id = id;
    };
    /**
     * 获取对象id
     *
     * @returns {string}
     * @memberof IBizObject
     */
    IBizObject.prototype.getId = function () {
        return this.id;
    };
    /**
     * 设置对象名称
     *
     * @param {string} name
     * @memberof IBizObject
     */
    IBizObject.prototype.setName = function (name) {
        this.name = name;
    };
    /**
     * 获取对象名
     *
     * @returns {string}
     * @memberof IBizObject
     */
    IBizObject.prototype.getName = function () {
        return this.name;
    };
    /**
     * 获取对象关联名称
     *
     * @returns {string}
     * @memberof IBizObject
     */
    IBizObject.prototype.getRefName = function () {
        return this.refname;
    };
    /**
     * 注册事件
     *
     * @param {string} name 事件名称
     * @returns {Observable<any>} 事件订阅对象
     * @memberof IBizObject
     */
    IBizObject.prototype.on = function (name) {
        var subject;
        if (this.events.get(name)) {
            subject = this.events.get(name);
        }
        else {
            subject = new rxjs.Subject();
            this.events.set(name, subject);
        }
        return subject.asObservable();
    };
    /**
     * 呼出事件<参数会封装成JSON对象进行传递>
     * @param event 事件名称
     * @param sender 源
     * @param args 参数
     */
    IBizObject.prototype.fire = function (name, data) {
        if (this.events.get(name)) {
            this.events.get(name).next(data);
        }
    };
    return IBizObject;
}());

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 代码表对象
 *
 * @class IBizCodeList
 * @extends {IBizObject}
 */
var IBizCodeList = /** @class */ (function (_super) {
    __extends(IBizCodeList, _super);
    /**
     * Creates an instance of IBizCodeList.
     * 创建 IBizCodeList 实例
     *
     * @param {*} [opts={}]
     * @memberof IBizCodeList
     */
    function IBizCodeList(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, opts) || this;
        /**
         * 静态代码表数据项
         *
         * @private
         * @type {Array<any>}
         * @memberof IBizCodeList
         */
        _this.items = [];
        _this.items = opts.datas.slice();
        return _this;
    }
    /**
     * 获取静态代码表数据项
     *
     * @returns {Array<any>}
     * @memberof IBizCodeList
     */
    IBizCodeList.prototype.getDatas = function () {
        return this.items;
    };
    /**
     * 根据值获文本
     *
     * @param {*} value
     * @param {*} cascade
     * @returns {*}
     * @memberof IBizCodeList
     */
    IBizCodeList.prototype.getItemByValue = function (value, cascade) {
        var result;
        this.items.some(function (item) {
            if (Object.is(item.value, value)) {
                result = item;
                return true;
            }
        });
        return result;
    };
    return IBizCodeList;
}(IBizObject));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 控制器对象基类
 *
 * @class IBizControl
 * @extends {IBizObject}
 */
var IBizControl = /** @class */ (function (_super) {
    __extends(IBizControl, _super);
    /**
     * Creates an instance of IBizControl.
     * 创建 IBizControl 实例对象
     *
     * @param {*} [opts={}]
     * @memberof IBizControl
     */
    function IBizControl(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        _this_1.backendurl = '';
        var _this = _this_1;
        _this.backendurl = opts.backendurl;
        _this.viewController = opts.viewController;
        return _this_1;
    }
    IBizControl.prototype.load = function (params) {
    };
    /**
     * 销毁<暂时无效>
     */
    IBizControl.prototype.destroy = function () {
    };
    IBizControl.prototype.setSize = function (width, height) {
    };
    IBizControl.prototype.setWidth = function (width) {
    };
    IBizControl.prototype.setHeight = function (height) {
    };
    IBizControl.prototype.isVisible = function () {
        return true;
    };
    IBizControl.prototype.invoke = function (command, arg) {
        var me = this;
        me.onInvoke(command, arg);
    };
    IBizControl.prototype.onInvoke = function (command, arg) {
    };
    IBizControl.prototype.getViewController = function () {
        return this.viewController;
    };
    IBizControl.prototype.getBackendUrl = function () {
        var url;
        if (this.backendurl && !Object.is(this.backendurl, '')) {
            url = this.backendurl;
        }
        else if (this.getViewController()) {
            var viewController = this.getViewController();
            url = viewController.getBackendUrl();
        }
        return url;
    };
    return IBizControl;
}(IBizObject));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 计数器部件对象
 *
 * @class IBizCounter
 * @extends {IBizControl}
 */
var IBizCounter = /** @class */ (function (_super) {
    __extends(IBizCounter, _super);
    /**
     * Creates an instance of IBizCounter.
     * 创建 IBizCounter 实例
     *
     * @param {*} [opts={}]
     * @memberof IBizCounter
     */
    function IBizCounter(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        _this_1.counterparam = {};
        _this_1.lastReloadArg = {};
        _this_1.data = {};
        var _this = _this_1;
        _this.counterid = opts.counterId;
        // this.tag = opts.tag;
        _this.counterparam = JSON.stringify(opts.counterParam);
        _this.timer = opts.timer;
        // this.url = me.getController().getBackendUrl();
        if (_this.timer > 1000) {
            _this.tag = setInterval(function () { _this.reload(); }, _this.timer);
        }
        _this.reload();
        return _this_1;
    }
    IBizCounter.prototype.reload = function () {
        var _this = this;
        var params = { srfcounterid: _this.counterid, srfaction: 'FETCH', srfcounterparam: _this.counterparam };
        this.iBizHttp.post(this.getBackendUrl(), params).subscribe(function (data) {
            if (data.ret == 0) {
                _this.setData(data);
            }
            else {
                console.log('加载计数数据异常.' + data.info);
            }
        }, function (error) {
            console.log(error);
        });
    };
    IBizCounter.prototype.setData = function (data) {
        var _this = this;
        _this.result = data;
        _this.data = data.data;
        _this.fire(IBizCounter.COUNTERCHANGED, _this.data);
    };
    IBizCounter.prototype.getResult = function () {
        var _this = this;
        return _this.result;
    };
    IBizCounter.prototype.getData = function () {
        var _this = this;
        return _this.data;
    };
    IBizCounter.prototype.close = function () {
        if (this.tag !== undefined) {
            clearInterval(this.tag);
            delete this.timer;
        }
    };
    /*****************事件声明************************/
    /**
     * 计数发生变化
     */
    IBizCounter.COUNTERCHANGED = "COUNTERCHANGED";
    return IBizCounter;
}(IBizControl));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 应用菜单
 *
 * @class IBizAppMenu
 * @extends {IBizControl}
 */
var IBizAppMenu = /** @class */ (function (_super) {
    __extends(IBizAppMenu, _super);
    /**
     * Creates an instance of IBizAppMenu.
     * 创建 IBizAppMenu 实例
     *
     * @param {*} [opts={}]
     * @memberof IBizAppMenu
     */
    function IBizAppMenu(opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, opts) || this;
        /**
         * 应用菜单数据
         *
         * @type {Array<any>}
         * @memberof IBizAppMenu
         */
        _this.items = [];
        /**
         * 应用功能集合
         *
         * @type {Array<any>}
         * @memberof IBizAppMenu
         */
        _this.appFuncs = [];
        return _this;
    }
    /**
     * 获取菜单数据
     *
     * @returns {Array<any>}
     * @memberof IBizAppMenu
     */
    IBizAppMenu.prototype.getItems = function () {
        return this.items;
    };
    /**
     * 获取应用功能数据
     *
     * @returns {Array<any>}
     * @memberof IBizAppMenu
     */
    IBizAppMenu.prototype.getAppFuncs = function () {
        return this.appFuncs;
    };
    IBizAppMenu.prototype.load = function (opt) {
        var _this = this;
        var params = { srfctrlid: this.getName(), srfaction: 'FETCH' };
        if (opt) {
            Object.assign(params, opt);
        }
        var http = new IBizHttp();
        http.post(this.getBackendUrl(), params).subscribe(function (success) {
            console.log(success);
            if (success.ret === 0) {
                _this.items = success.items;
                // const data = this.doMenus(success.items);
                // this.fire(IBizEvent.IBizAppMenu_LOADED, data);
            }
        }, function (error) {
            console.log(error);
        });
    };
    IBizAppMenu.prototype.onSelectChange = function (select) {
    };
    /*****************事件声明************************/
    /**
     * 部件加载之前
     *
     * @static
     * @memberof IBizAppMenu
     */
    IBizAppMenu.BEFORELOAD = 'BEFORELOAD';
    /**
     * 部件加载完成
     *
     * @static
     * @memberof IBizAppMenu
     */
    IBizAppMenu.LOAD = 'LOAD';
    /**
     * 部件选中
     *
     * @static
     * @memberof IBizAppMenu
     */
    IBizAppMenu.SELECTION = 'SELECTION';
    return IBizAppMenu;
}(IBizControl));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 工具栏控件
 *
 * @class IBizToolbar
 * @extends {IBizControl}
 */
var IBizToolbar = /** @class */ (function (_super) {
    __extends(IBizToolbar, _super);
    /**
     * Creates an instance of IBizToolbar.
     * 创建 IBizToolbar 实例对象
     *
     * @param {*} [opts={}]
     * @memberof IBizToolbar
     */
    function IBizToolbar(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        /**
         * 工具栏项按钮集合
         *
         * @private
         * @type {Map<string, any>}
         * @memberof IBizToolbar
         */
        /**
         * 所有工具栏按钮
         *
         * @private
         * @type {Array<any>}
         * @memberof IBizToolbar
         */
        _this_1.items = [];
        _this_1.regToolBarItems();
        return _this_1;
    }
    /**
     * 注册所有工具栏按钮
     *
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.regToolBarItems = function () {
    };
    /**
     * 注册工具栏按钮
     *
     * @param {*} [item={}]
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.regToolBarItem = function (item) {
        if (item === void 0) { item = {}; }
        this.items.push(item);
    };
    /**
     * 获取所有工具栏按钮
     *
     * @returns {Array<any>}
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.getItems = function () {
        return this.items;
    };
    /**
     * 获取工具栏按钮
     *
     * @param {string} [name] 名称（可选）
     * @param {string} [tag] 标识（可选）
     * @returns {*}
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.getItem = function (name, tag) {
        var _item = {};
        Object.assign(this._getItem(this.items, name, tag));
        return _item;
    };
    /**
     *
     *
     * @private
     * @param {Array<any>} items
     * @param {string} [name]
     * @param {string} [tag]
     * @returns {*}
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype._getItem = function (items, name, tag) {
        var _this_1 = this;
        var _item = {};
        items.some(function (item) {
            if (Object.is(item.name, name)) {
                Object.assign(_item, item);
                return true;
            }
            if (Object.is(item.tag, tag)) {
                Object.assign(_item, item);
                return true;
            }
            if (item.items) {
                var subItem = _this_1._getItem(item.items, name, tag);
                if (Object.keys(subItem).length > 0) {
                    Object.assign(_item, subItem);
                    return true;
                }
            }
        });
        return _item;
    };
    /**
     * 设置工具栏按钮是否启用
     *
     * @param {string} name
     * @param {boolean} disabled
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.setItemDisabled = function (name, disabled) {
        this.items.some(function (item) {
            if (Object.is(item.name, name)) {
                item.disabled = disabled;
                return true;
            }
        });
    };
    /**
     * 更新工具栏按钮状态
     *
     * @param {*} [action={}]
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.updateAccAction = function (action) {
        if (action === void 0) { action = {}; }
        var _this = this;
        _this.items.forEach(function (value) {
            var priv = value.priv;
            if ((priv && !Object.is(priv, '')) && (action && Object.keys(action).length > 0 && action[priv] !== 1)) {
                value.dataaccaction = false;
            }
            else {
                value.dataaccaction = true;
            }
        });
    };
    /**
     * 点击按钮
     *
     * @param {string} name
     * @param {string} type
     * @memberof IBizToolbar
     */
    IBizToolbar.prototype.itemclick = function (name, type) {
        var _this = this;
        _this.fire(IBizToolbar.ITEMCLICK, { tag: type });
    };
    /** ***************事件声明*********************** */
    /**
     * 点击按钮事件
     *
     * @static
     * @memberof IBizToolbar
     */
    IBizToolbar.ITEMCLICK = 'ITEMCLICK';
    return IBizToolbar;
}(IBizControl));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 多数据部件基类
 *
 * @class IBizMDControl
 * @extends {IBizControl}
 */
var IBizMDControl = /** @class */ (function (_super) {
    __extends(IBizMDControl, _super);
    /**
     * Creates an instance of IBizMDControl.
     * 创建 IBizMDControl 实例
     *
     * @param {*} [opts={}]
     * @memberof IBizMDControl
     */
    function IBizMDControl(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        /**
         * 表格列头
         *
         * @type {Array<any>}
         * @memberof IBizMDControl
         */
        _this_1.columns = [];
        /**
         * 多数据数据项
         *
         * @type {Array<any>}
         * @memberof IBizMDControl
         */
        _this_1.items = [];
        /**
         * 加载状态
         *
         * @type {boolean}
         * @memberof IBizMDControl
         */
        _this_1.loading = false;
        /**
         * 选中行数据
         *
         * @type {Array<any>}
         * @memberof IBizMDControl
         */
        _this_1.selections = [];
        var _this = _this_1;
        _this.regColumns();
        return _this_1;
    }
    /**
     * 加载数据
     *
     * @param {*} [arg={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.load = function (arg) {
        if (arg === void 0) { arg = {}; }
    };
    /**
     * 刷新数据
     *
     * @param {*} [arg={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.refresh = function (arg) {
        if (arg === void 0) { arg = {}; }
    };
    /**
     * 设置选中项
     *
     * @param {Array<any>} selection
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.setSelection = function (selection) {
        this.selections = selection;
        this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
    };
    /**
     * 选中行数据
     *
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.clickItem = function (item) {
        if (item === void 0) { item = {}; }
        if (this.loading) {
            return;
        }
        this.setSelection([item]);
    };
    /**
     * 激活行数据
     *
     * @param {*} [item={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.activeItem = function (item) {
        if (item === void 0) { item = {}; }
    };
    /**
     * 是否正在加载
     *
     * @returns {boolean}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.isloading = function () {
        return this.loading;
    };
    /**
     * 获取列表中某条数据
     *
     * @param {string} name 字段
     * @param {string} value 名称
     * @returns {*}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.findItem = function (name, value) {
        var item;
        this.items.forEach(function (element) {
            if (Object.is(element[name], value)) {
                item = element;
                return;
            }
        });
        return item;
    };
    /**
     * 删除数据
     *
     * @param {*} [arg={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.remove = function (arg) {
        if (arg === void 0) { arg = {}; }
    };
    /**
     * 单选
     *
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.onItemSelect = function (value, item) {
    };
    /**
     * 全选
     *
     * @param {boolean} value
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.selectAll = function (value) {
    };
    /**
     * 获取选中行
     *
     * @returns {Array<any>}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.getSelection = function () {
        return this.selections;
    };
    /**
     * 工作流提交
     *
     * @param {*} [params={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.wfsubmit = function (params) {
        var _this_1 = this;
        if (params === void 0) { params = {}; }
        if (!params) {
            params = {};
        }
        Object.assign(params, { srfaction: 'wfsubmit', srfctrlid: this.getName() });
        this.iBizHttp.post(params, this.getBackendUrl()).subscribe(function (data) {
            if (data.ret === 0) {
                _this_1.refresh();
            }
            else {
                // this.showToast(this.$showErrorToast, '', '执行工作流操作失败,' + data.info);
            }
        }, function (error) {
            // this.showToast(this.$showErrorToast, '', '执行工作流操作失败,' + error.info);
        });
    };
    /**
     * 实体界面行为
     *
     * @param {*} [params={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.doUIAction = function (arg) {
        var _this_1 = this;
        if (arg === void 0) { arg = {}; }
        var params = {};
        if (arg) {
            Object.assign(params, arg);
        }
        Object.assign(params, { srfaction: 'uiaction', srfctrlid: this.getName() });
        this.iBizHttp.post(params, this.getBackendUrl()).subscribe(function (data) {
            if (data.ret === 0) {
                if (data.reloadData) {
                    _this_1.refresh();
                }
                if (data.info && !Object.is(data.info, '')) {
                    // this.showToast(this.$showInfoToast, '', data.info);
                }
                IBizUtil.processResult(data);
            }
            else {
                // this.showToast(this.$showErrorToast, '操作失败', '操作失败,执行操作发生错误,' + data.info);
            }
        }, function (error) {
            // this.showToast(this.$showErrorToast, '操作失败', '操作失败,执行操作发生错误,' + error.info);
        });
    };
    /**
     * 批量添加
     *
     * @param {*} [arg={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.addBatch = function (arg) {
        var _this_1 = this;
        if (arg === void 0) { arg = {}; }
        var params = {};
        if (arg) {
            Object.assign(params, arg);
        }
        Object.assign(params, { srfaction: 'addbatch', srfctrlid: this.getName() });
        this.iBizHttp.post(this.getBackendUrl(), params).subscribe(function (data) {
            if (data.ret === 0) {
                _this_1.refresh();
                _this_1.fire(IBizMDControl.ADDBATCHED, data);
            }
            else {
                // this.showToast(this.$showErrorToast, '添加失败', '执行批量添加失败,' + data.info);
            }
        }, function (error) {
            // this.showToast(this.$showErrorToast, '添加失败', '执行批量添加失败,' + error.info);
        });
    };
    /**
     * 获取所有数据项
     *
     * @returns {Array<any>}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.getItems = function () {
        return this.items;
    };
    /**
     * 注册多数据列头
     *
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.regColumns = function () {
    };
    /**
     * 获取多数据列头
     *
     * @returns {*}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.getColumns = function () {
        return this.columns;
    };
    /**
     * 设置多数据列头
     *
     * @param {*} [column={}]
     * @returns {void}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.regColumn = function (column) {
        if (column === void 0) { column = {}; }
        if (Object.keys(column).length === 0) {
            return;
        }
        this.columns.push(column);
    };
    /**
     * 多数据项界面_数据导入栏
     *
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.doImportData = function (name) {
        if (Object.is(name, '')) {
            return;
        }
        // this.nzModalService.open({
        //     content: IBizImportdataViewComponent,
        //     wrapClassName: 'ibiz_wrap_modal',
        //     componentParams: { dename: name },
        //     footer: false,
        //     maskClosable: false,
        //     width: 500,
        // }).subscribe((result) => {
        //     if (result && result.ret) {
        //         this.refresh();
        //     }
        // });
    };
    /**
     * 界面行为
     *
     * @param {string} tag
     * @param {*} [data={}]
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.uiAction = function (tag, data) {
        if (data === void 0) { data = {}; }
    };
    /**
     * 渲染绘制多项数据
     *
     * @param {Array<any>} items
     * @returns {Array<any>}
     * @memberof IBizMDControl
     */
    IBizMDControl.prototype.rendererDatas = function (items) {
        return items;
    };
    /*****************事件声明************************/
    /**
     * 添加数据
     *
     * @static
     * @memberof IBizMDControl
     */
    IBizMDControl.ADDBATCHED = 'ADDBATCHED';
    /**
     * 加载之前
     *
     * @static
     * @memberof IBizMDControl
     */
    IBizMDControl.BEFORELOAD = 'BEFORELOAD';
    /**
     * 加载完成
     *
     * @static
     * @memberof IBizMDControl
     */
    IBizMDControl.LOADED = 'LOADED';
    /**
     * 行数据选中
     *
     * @static
     * @memberof IBizMDControl
     */
    IBizMDControl.SELECTIONCHANGE = 'SELECTIONCHANGE';
    /**
     * 实体界面行为
     *
     * @static
     * @memberof IBizMDControl
     */
    IBizMDControl.UIACTION = 'UIACTION';
    return IBizMDControl;
}(IBizControl));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
/**
 * 表格部件控制器
 *
 * @class IBizDataGrid
 * @extends {IBizMDControl}
 */
var IBizDataGrid = /** @class */ (function (_super) {
    __extends(IBizDataGrid, _super);
    /**
     * Creates an instance of IBizDataGrid.
     * 创建 IBizDataGrid 实例
     *
     * @param {*} [opts={}]
     * @memberof IBizDataGrid
     */
    function IBizDataGrid(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        /**
         * 是否全部选中
         *
         * @type {boolean}
         * @memberof IBizDataGrid
         */
        _this_1.allChecked = false;
        /**
         * 备份数据（行编辑使用）
         *
         * @type {Array<any>}
         * @memberof IBizDataGrid
         */
        _this_1.backupData = [];
        /**
         * 当前显示页码
         *
         * @type {number}
         * @memberof IBizDataGrid
         */
        _this_1.curPage = 1;
        /**
         * 表格编辑项集合
         *
         * @type {*}
         * @memberof IBizDataGrid
         */
        _this_1.editItems = {};
        /**
         * 表格全部排序字段
         *
         * @type {Array<any>}
         * @memberof IBizDataGrid
         */
        _this_1.gridSortField = [];
        /**
         * 表格行选中动画
         *
         * @type {boolean}
         * @memberof IBizDataGrid
         */
        _this_1.indeterminate = false;
        /**
         * 是否启用行编辑
         *
         * @type {boolean}
         * @memberof IBizDataGrid
         */
        _this_1.isEnableRowEdit = false;
        /**
         * 每次加载条数
         *
         * @type {number}
         * @memberof IBizDataGrid
         */
        _this_1.limit = 20;
        /**
         * 是否支持多项
         *
         * @type {boolean}
         * @memberof IBizDataGrid
         */
        _this_1.multiSelect = true;
        /**
         * 最大导出行数
         *
         * @type {number}
         * @memberof IBizDataGrid
         */
        _this_1.maxExportRow = 1000;
        /**
         * 打开行编辑
         *
         * @type {boolean}
         * @memberof IBizDataGrid
         */
        _this_1.openRowEdit = false;
        /**
         * 行多项选中设置，用于阻塞多次触发选中效果
         *
         * @private
         * @type {boolean}
         * @memberof IBizDataGrid
         */
        _this_1.rowsSelection = false;
        /**
         * 查询开始条数
         *
         * @type {number}
         * @memberof IBizDataGrid
         */
        _this_1.start = 0;
        /**
         * 编辑行数据处理
         *
         * @type {*}
         * @memberof IBizDataGrid
         */
        _this_1.state = {};
        /**
         * 总条数
         *
         * @type {number}
         * @memberof IBizDataGrid
         */
        _this_1.totalrow = 0;
        var _this = _this_1;
        _this.regEditItems();
        return _this_1;
    }
    /**
     * 加载数据
     *
     * @param {*} [arg={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.load = function (arg) {
        var _this_1 = this;
        if (arg === void 0) { arg = {}; }
        var opt = {};
        Object.assign(opt, arg);
        if (this.loading) {
            return;
        }
        Object.assign(opt, { srfctrlid: this.getName(), srfaction: 'fetch' });
        if (!opt.start) {
            Object.assign(opt, { start: (this.curPage - 1) * this.limit });
        }
        if (!opt.limit) {
            Object.assign(opt, { limit: this.limit });
        }
        Object.assign(opt, { sort: JSON.stringify(this.gridSortField) });
        // 设置为正在加载，使load方法在加载中时不可用。
        this.loading = true;
        // 发送加载数据前事件
        this.fire(IBizMDControl.BEFORELOAD, opt);
        this.allChecked = false;
        this.indeterminate = false;
        this.selections = [];
        this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
        this.iBizHttp.post(opt).subscribe(function (response) {
            if (!response.items || response.ret !== 0) {
                if (response.errorMessage) {
                    // this.showToast(this.$showErrorToast, '', response.errorMessage);
                }
                _this_1.loading = false;
                return;
            }
            _this_1.items = _this_1.rendererDatas(response.items);
            _this_1.totalrow = response.totalrow;
            _this_1.fire(IBizMDControl.LOADED, response.items);
            _this_1.loading = false;
        }, function (error) {
            _this_1.loading = false;
            console.log(error.info);
        });
    };
    /**
     * 刷新数据
     *
     * @param {*} [arg={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.refresh = function (arg) {
        var _this_1 = this;
        if (arg === void 0) { arg = {}; }
        var opt = {};
        Object.assign(opt, arg);
        if (this.loading) {
            return;
        }
        Object.assign(opt, { srfctrlid: this.getName(), srfaction: 'fetch' });
        if (!opt.start) {
            Object.assign(opt, { start: (this.curPage - 1) * this.limit });
        }
        if (!opt.limit) {
            Object.assign(opt, { limit: this.limit });
        }
        Object.assign(opt, { sort: JSON.stringify(this.gridSortField) });
        // 设置为正在加载，使load方法在加载中时不可用。
        this.loading = true;
        // 发送加载数据前事件
        this.fire(IBizMDControl.BEFORELOAD, opt);
        this.allChecked = false;
        this.indeterminate = false;
        this.selections = [];
        this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
        this.iBizHttp.post(opt).subscribe(function (response) {
            if (!response.items || response.ret !== 0) {
                if (response.errorMessage) {
                    // this.showToast(this.$showErrorToast, '', response.errorMessage);
                }
                _this_1.loading = false;
                return;
            }
            _this_1.fire(IBizMDControl.LOADED, response.items);
            _this_1.items = _this_1.rendererDatas(response.items);
            _this_1.totalrow = response.totalrow;
            _this_1.loading = false;
        }, function (error) {
            _this_1.loading = false;
            console.log(error.info);
        });
    };
    /**
     * 删除数据
     *
     * @param {*} [arg={}]
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.remove = function (arg) {
        var _this_1 = this;
        if (arg === void 0) { arg = {}; }
        var params = {};
        Object.assign(params, arg);
        Object.assign(params, { srfaction: 'remove', srfctrlid: this.getName() });
        this.iBizHttp.post(params).subscribe(function (response) {
            if (response.ret === 0) {
                if (_this_1.allChecked) {
                    var rows = _this_1.curPage * _this_1.limit;
                    if (_this_1.totalrow <= rows) {
                        _this_1.curPage = _this_1.curPage - 1;
                        if (_this_1.curPage === 0) {
                            _this_1.curPage = 1;
                        }
                    }
                }
                _this_1.load({});
                _this_1.fire(IBizDataGrid.REMOVED, {});
                if (response.info && response.info !== '') {
                    // this.showToast(this.$showSuccessToast, '', '删除成功!');
                }
                _this_1.selections = [];
                IBizUtil.processResult(response);
            }
            else {
                // this.showToast(this.$showErrorToast, '', '删除数据失败,' + response.info);
            }
        }, function (error) {
            // this.showToast(this.$showErrorToast, '', '删除数据失败');
        });
    };
    /**
     * 行数据复选框单选
     *
     * @param {boolean} value
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.onItemSelect = function (value, item) {
        if (item === void 0) { item = {}; }
        if (item.disabled) {
            return;
        }
        if (this.isEnableRowEdit && this.openRowEdit) {
            return;
        }
        var index = this.selections.findIndex(function (data) { return Object.is(data.srfkey, item.srfkey); });
        if (index === -1) {
            this.selections.push(item);
        }
        else {
            this.selections.splice(index, 1);
        }
        if (!this.multiSelect) {
            this.selections.forEach(function (data) {
                data.checked = false;
            });
            this.selections = [];
            if (index === -1) {
                this.selections.push(item);
            }
        }
        this.rowsSelection = true;
        this.allChecked = this.selections.length === this.items.length ? true : false;
        this.indeterminate = (!this.allChecked) && (this.selections.length > 0);
        item.checked = value;
        this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
    };
    /**
     * 行数据复选框全选
     *
     * @param {boolean} value
     * @memberof IBizMDService
     */
    IBizDataGrid.prototype.selectAll = function (value) {
        var _this_1 = this;
        if (this.isEnableRowEdit && this.openRowEdit) {
            return;
        }
        if (!this.multiSelect) {
            setTimeout(function () {
                _this_1.allChecked = false;
            });
            return;
        }
        this.items.forEach(function (item) {
            if (!item.disabled) {
                item.checked = value;
            }
        });
        this.selections = [];
        if (value) {
            this.selections = this.items.slice();
        }
        this.indeterminate = (!value) && (this.selections.length > 0);
        this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
    };
    /**
     * 导出数据
     *
     * @param {any} params
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.exportData = function (arg) {
        if (arg === void 0) { arg = {}; }
        var params = {};
        this.fire(IBizMDControl.BEFORELOAD, params);
        if (params.search) {
            Object.assign(params, { query: params.search });
        }
        Object.assign(params, { srfaction: 'exportdata', srfctrlid: this.getName() });
        if (Object.is(arg.itemTag, 'all')) {
            Object.assign(params, { start: 0, limit: this.maxExportRow });
        }
        else if (Object.is(arg.itemTag, 'custom')) {
            var nStart = arg.exportPageStart;
            var nEnd = arg.exportPageEnd;
            if (nStart < 1 || nEnd < 1 || nStart > nEnd) {
                // this.showToast('INFO', '警告', '请输入有效的起始页');
                return;
            }
            Object.assign(params, { start: (nStart - 1) * this.limit, limit: nEnd * this.limit });
        }
        else {
            Object.assign(params, { start: (this.curPage * this.limit) - this.limit, limit: this.curPage * this.limit });
        }
        this.iBizHttp.post(params).subscribe(function (res) {
            if (res.ret === 0) {
                if (res.downloadurl) {
                    var downloadurl = res.downloadurl;
                    if (downloadurl.indexOf('/') === 0) {
                        downloadurl = downloadurl.substring(downloadurl.indexOf('/') + 1, downloadurl.length);
                    }
                    else {
                        downloadurl = downloadurl;
                    }
                    IBizUtil.download(downloadurl);
                }
            }
            else {
                // this.showToast('ERROR', '警告', res.info);
            }
        }, function (error) {
            console.log(error.info);
        });
    };
    /**
     * 重置分页
     *
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.resetStart = function () {
        this.start = 0;
    };
    /**
     * 第几页跳转
     *
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.clickPageIndex = function () {
        this.pageChangeFlag = true;
    };
    /**
     * 分页页数改变
     *
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.changePageIndex = function () {
        this.refresh();
    };
    /**
     * 每页显示条数
     *
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.changePageSize = function () {
        this.curPage = 1;
        this.refresh();
    };
    /**
     * 单击行选中
     *
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.clickRowSelect = function (data) {
        if (data === void 0) { data = {}; }
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizDataGrid.ROWCLICK, this.selections);
    };
    /**
     * 双击行选中
     *
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.dblClickRowSelection = function (data) {
        if (data === void 0) { data = {}; }
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizDataGrid.ROWDBLCLICK, this.selections);
    };
    /**
     * 表格排序
     *
     * @param {string} name 字段明显
     * @param {string} type 排序类型
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.sort = function (name, type) {
        var item = this.gridSortField.find(function (item) { return Object.is(item.property, name); });
        if (item === undefined) {
            if (Object.is('ascend', type)) {
                this.gridSortField.push({ property: name, direction: 'asc' });
            }
            else if (Object.is('descend', type)) {
                this.gridSortField.push({ property: name, direction: 'desc' });
            }
            else {
                return;
            }
        }
        var index = this.gridSortField.findIndex(function (item) {
            return Object.is(item.property, name);
        });
        if (Object.is('ascend', type)) {
            this.gridSortField[index].direction = 'asc';
        }
        else if (Object.is('descend', type)) {
            this.gridSortField[index].direction = 'desc';
        }
        else {
            this.gridSortField.splice(index, 1);
        }
        this.refresh({});
    };
    /**
     * 设置表格数据当前页
     *
     * @param {number} page 分页数量
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.setCurPage = function (page) {
        this.curPage = page;
    };
    /**
     * 设置是否支持多选
     *
     * @param {boolean} state 是否支持多选
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.setMultiSelect = function (state) {
        this.multiSelect = state;
    };
    /**
     * 界面行为
     *
     * @param {string} tag
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.uiAction = function (tag, data) {
        if (data === void 0) { data = {}; }
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizMDControl.UIACTION, { tag: tag, data: data });
    };
    /**
     * 处理非复选框行数据选中,并处理是否激活数据
     *
     * @private
     * @param {*} [data={}]
     * @returns {boolean} 是否激活
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.doRowDataSelect = function (data) {
        if (data === void 0) { data = {}; }
        if (this.isEnableRowEdit && this.openRowEdit) {
            return;
        }
        if (this.rowsSelection) {
            this.rowsSelection = false;
            return true;
        }
        this.selections.forEach(function (data) {
            data.checked = false;
        });
        this.selections = [];
        data.checked = true;
        this.selections.push(data);
        this.indeterminate = (!this.allChecked) && (this.selections.length > 0);
        return false;
    };
    /**
     * 渲染绘制多项数据
     *
     * @param {Array<any>} items
     * @returns {Array<any>}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.rendererDatas = function (items) {
        var _this_1 = this;
        _super.prototype.rendererDatas.call(this, items);
        items.forEach(function (item) {
            var names = Object.keys(item);
            names.forEach(function (name) { item[name] = item[name] ? item[name] : ''; });
        });
        if (this.isEnableRowEdit) {
            items.forEach(function (item) { item.openeditrow = (_this_1.isEnableRowEdit) ? true : false; });
        }
        return items;
    };
    /**
     * 注册表格所有编辑项
     *
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.regEditItems = function () {
    };
    /**
     * 注册表格编辑项
     *
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.regEditItem = function (item) {
        if (item === void 0) { item = {}; }
        if (Object.keys(item).length === 0) {
            return;
        }
        this.editItems[item.name] = item;
    };
    /**
     * 设置编辑项状态
     *
     * @param {string} srfkey
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.setEditItemState = function (srfkey) {
        var _this_1 = this;
        if (!this.state) {
            return;
        }
        if (!srfkey) {
            // this.$notification.warning('警告', '数据异常');
        }
        var editItems = {};
        var itemsName = Object.keys(this.editItems);
        itemsName.forEach(function (name) {
            var item = {};
            var _editor = JSON.stringify(_this_1.editItems[name]);
            Object.assign(item, JSON.parse(_editor));
            editItems[name] = item;
        });
        this.state[srfkey] = editItems;
    };
    /**
     * 删除信息编辑项状态
     *
     * @param {string} srfkey
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.deleteEditItemState = function (srfkey) {
        if (srfkey && this.state.hasOwnProperty(srfkey)) {
            delete this.state.srfkey;
        }
    };
    /**
     * 设置编辑项是否启用
     *
     * @param {string} srfkey
     * @param {number} type
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.setEditItemDisabled = function (srfkey, type) {
        if (this.state && this.state.hasOwnProperty(srfkey)) {
            var item_1 = this.state[srfkey];
            var itemsName = Object.keys(item_1);
            itemsName.forEach(function (name) {
                var disabled = (item_1[name].enabledcond === 3 || item_1[name].enabledcond === type);
                item_1[name].disabled = !disabled;
            });
            Object.assign(this.state[srfkey], item_1);
        }
    };
    /**
     * 获取行编辑状态
     *
     * @returns {boolean}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.getOpenEdit = function () {
        return this.openRowEdit;
    };
    /**
     * 保存表格所有编辑行 <在插件模板中提供重写>
     *
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.saveAllEditRow = function () {
    };
    /**
     * 是否启用行编辑
     *
     * @param {string} tag
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.isOpenEdit = function (tag) {
        var _this_1 = this;
        if (!this.isEnableRowEdit) {
            // this.$notification.info('提示', '未启用行编辑');
            return;
        }
        this.openRowEdit = !this.openRowEdit;
        if (this.openRowEdit) {
            this.items.forEach(function (item) { item.openeditrow = true; });
            this.selections.forEach(function (data) {
                data.checked = false;
            });
            this.selections = [];
            this.indeterminate = false;
            this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
            this.items.forEach(function (item) {
                var data = __rest(item, []);
                _this_1.backupData.push(data);
                _this_1.setEditItemState(item.srfkey);
            });
        }
        else {
            this.items = [];
            this.backupData.forEach(function (data) {
                _this_1.items.push(data);
            });
            this.backupData = [];
            this.state = {};
        }
    };
    /**
     * 编辑行数据
     *
     * @param {*} [data={}]
     * @param {number} rowindex
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.editRow = function (data, rowindex) {
        if (data === void 0) { data = {}; }
        data.openeditrow = !data.openeditrow;
        this.setEditItemState(data.srfkey);
        if (data.openeditrow) {
            var index = this.backupData.findIndex(function (item) { return Object.is(item.srfkey, data.srfkey); });
            if (index !== -1) {
                Object.assign(data, this.backupData[index]);
            }
            if (Object.is(data.srfkey, '')) {
                this.items.splice(rowindex, 1);
            }
        }
        else {
            this.setEditItemDisabled(data.srfkey, 2);
        }
    };
    /**
     * 保存编辑行数据
     *
     * @param {*} [data={}]
     * @param {number} rowindex
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.editRowSave = function (data, rowindex) {
        var _this_1 = this;
        if (data === void 0) { data = {}; }
        var _index = this.backupData.findIndex(function (item) { return Object.is(item.srfkey, data.srfkey); });
        var srfaction = (_index !== -1) ? 'update' : 'create';
        // if (Object.is(srfaction, 'create')) {
        //     delete data.srfkey;
        // }
        var params = { srfaction: srfaction, srfctrlid: 'grid' };
        var viewController = this.getViewController();
        if (viewController && viewController.getViewParam() && Object.keys(viewController.getViewParam()).length > 0) {
            Object.assign(params, viewController.getViewParam());
        }
        var _names = Object.keys(data);
        _names.forEach(function (name) {
            data[name] = data[name] ? data[name] : '';
        });
        Object.assign(params, data);
        this.iBizHttp.post(params).subscribe(function (responce) {
            if (responce.ret === 0) {
                data.openeditrow = !data.openeditrow;
                var index = _this_1.backupData.findIndex(function (item) { return Object.is(data.srfkey, item.srfkey); });
                if (index !== -1) {
                    Object.assign(_this_1.backupData[index], responce.data);
                }
                else {
                    _this_1.deleteEditItemState(data.srfkey);
                    _this_1.setEditItemState(responce.data.srfkey);
                    _this_1.backupData.push(data);
                }
                Object.assign(data, responce.data);
                // this.showToast(this.$showSuccessToast, '提示', '保存成功');
                _this_1.fire(IBizMDControl.LOADED, data);
            }
            else {
                var info_1 = '';
                if (responce.error && (responce.error.items && Array.isArray(responce.error.items))) {
                    var items = responce.error.items;
                    items.forEach(function (item, index) {
                        if (index > 0) {
                            info_1 += '\n';
                        }
                        info_1 += item.info;
                        Object.assign(_this_1.state[data.srfkey][item.id].styleCss, { 'border': '1px solid #f04134', 'border-radius': '4px' });
                    });
                }
                // this.$notification.error('错误', !Object.is(info, '') ? info : '行编辑保存失败');
            }
        }, function (error) {
            var info = '';
            if (error.error && (error.error.items && Array.isArray(error.error.items))) {
                var items = error.error.items;
                items.forEach(function (item, index) {
                    if (index > 0) {
                        info += '\n';
                    }
                    info += item.info;
                    Object.assign(_this_1.state[data.srfkey][item.id].styleCss, { 'border': '1px solid #f04134', 'border-radius': '4px' });
                });
            }
            // this.$notification.error('错误', !Object.is(info, '') ? info : '行编辑保存失败');
        });
    };
    /**
     * 行编辑文本框光标移出事件
     *
     * @param {*} $event
     * @param {string} name
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.onBlur = function ($event, name, data) {
        if (data === void 0) { data = {}; }
        if ((!$event) || Object.keys(data).length === 0) {
            return;
        }
        if (Object.is($event.target.value, data[name])) {
            return;
        }
        this.colValueChange(name, $event.target.value, data);
    };
    /**
     * 行编辑文本框键盘事件
     *
     * @param {*} $event
     * @param {string} name
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.onKeydown = function ($event, name, data) {
        if (data === void 0) { data = {}; }
        if ((!$event) || Object.keys(data).length === 0) {
            return;
        }
        if ($event.keyCode !== 13) {
            return;
        }
        if (Object.is($event.target.value, data[name])) {
            return;
        }
        this.colValueChange(name, $event.target.value, data);
    };
    /**
     * 行编辑单元格值变化
     *
     * @param {string} name
     * @param {*} data
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.colValueChange = function (name, value, data) {
        var srfkey = data.srfkey;
        var _data = this.backupData.find(function (back) { return Object.is(back.srfkey, srfkey); });
        if (_data && !Object.is(_data[name], value)) {
            Object.assign(this.state[srfkey][name].styleCss, { 'border': '1px solid #49a9ee', 'border-radius': '4px' });
        }
        else {
            Object.assign(this.state[srfkey][name].styleCss, { 'border': '0px', 'border-radius': '0px' });
        }
        data[name] = value;
        this.fire(IBizDataGrid.UPDATEGRIDITEMCHANGE, { name: name, data: data });
    };
    /**
     * 更新表格编辑列值
     *
     * @param {string} srfufimode
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.updateGridEditItems = function (srfufimode, data) {
        var _this_1 = this;
        if (data === void 0) { data = {}; }
        var opt = { srfaction: 'updategridedititem', srfufimode: srfufimode, srfctrlid: 'grid' };
        var viewController = this.getViewController();
        if (viewController && viewController.getViewParam() && Object.keys(viewController.getViewParam()).length > 0) {
            Object.assign(opt, viewController.getViewParam());
        }
        var _names = Object.keys(data);
        _names.forEach(function (name) {
            data[name] = data[name] ? data[name] : '';
        });
        Object.assign(opt, { srfactivedata: JSON.stringify(data) });
        this.iBizHttp.post(opt).subscribe(function (success) {
            if (success.ret === 0) {
                var index = _this_1.items.findIndex(function (item) { return Object.is(item.srfkey, data.srfkey); });
                if (index !== -1) {
                    Object.assign(_this_1.items[index], success.data);
                }
            }
            else {
                // this.$notification.error('错误', success.info);
            }
        }, function (error) {
            // this.$notification.error('错误', error.info);
        });
    };
    /**
     * 新建编辑行
     *
     * @param {*} [param={}]
     * @memberof IBizDataGrid
     */
    IBizDataGrid.prototype.newRowAjax = function (param) {
        var _this_1 = this;
        if (param === void 0) { param = {}; }
        var opt = {};
        Object.assign(opt, param);
        var viewController = this.getViewController();
        if (viewController && viewController.getViewParam() && Object.keys(viewController.getViewParam()).length > 0) {
            Object.assign(opt, viewController.getViewParam());
        }
        this.fire(IBizMDControl.BEFORELOAD, opt);
        Object.assign(opt, { srfaction: 'loaddraft', srfctrlid: 'grid' });
        this.iBizHttp.post(opt).subscribe(function (success) {
            if (success.ret === 0) {
                var srfkey = (Object.is(success.data.srfkey, '')) ? IBizUtil.createUUID() : success.data.srfkey;
                success.data.srfkey = srfkey;
                _this_1.setEditItemState(srfkey);
                _this_1.setEditItemDisabled(srfkey, 1);
                _this_1.items.push(Object.assign(success.data, { openeditrow: false }));
            }
            else {
                // this.$notification.error('错误', `获取默认数据失败, ${success.info}`);
            }
        }, function (error) {
            // this.$notification.error('错误', `获取默认数据失败, ${error.info}`);
        });
    };
    /*****************事件声明************************/
    /**
     * 表格行数据变化
     *
     * @static
     * @memberof IBizDataGrid
     */
    IBizDataGrid.UPDATEGRIDITEMCHANGE = 'UPDATEGRIDITEMCHANGE';
    /**
     * 数据删除完成
     *
     * @static
     * @memberof IBizDataGrid
     */
    IBizDataGrid.REMOVED = 'REMOVED';
    /**
     * 行单击选中
     *
     * @static
     * @memberof IBizDataGrid
     */
    IBizDataGrid.ROWCLICK = 'ROWCLICK';
    /**
     * 行数据双击选中
     *
     * @static
     * @memberof IBizDataGrid
     */
    IBizDataGrid.ROWDBLCLICK = 'ROWDBLCLICK';
    return IBizDataGrid;
}(IBizMDControl));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 视图控制器基类
 *
 * @class IBizViewController
 * @extends {IBizObject}
 */
var IBizViewController = /** @class */ (function (_super) {
    __extends(IBizViewController, _super);
    /**
     * Creates an instance of IBizViewController.
     * 创建 IBizViewController 实例对象
     *
     * @param {*} [opts={}]
     * @memberof IBizViewController
     */
    function IBizViewController(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        _this_1.itemMap = new Map();
        _this_1.parentMode = {};
        _this_1.parentData = {};
        _this_1.bInited = false;
        _this_1.ctrlers = new Map();
        _this_1.codelists = new Map();
        _this_1.uiactions = new Map();
        _this_1.uicounters = new Map();
        _this_1.referData = {};
        _this_1.viewparam = {};
        _this_1.updatepanels = new Map();
        _this_1.controls = new Map();
        _this_1.containerid = opts.containerid;
        _this_1.appctx = opts.appctx;
        _this_1.backendurl = opts.backendurl;
        return _this_1;
    }
    IBizViewController.prototype.isClosed = function () {
        var _this = this;
        return true;
    };
    IBizViewController.prototype.quit = function () {
    };
    IBizViewController.prototype.isAutoLayout = function () {
        // var me=this;
        // return me.autoLayout;
    };
    IBizViewController.prototype.doLayout = function () {
    };
    /**
     * 执行初始化
     */
    IBizViewController.prototype.onInit = function () {
    };
    IBizViewController.prototype.setSize = function (width, height) {
    };
    IBizViewController.prototype.getItem = function (itemId) {
        var _this = this;
        return _this.itemMap.get(itemId);
    };
    IBizViewController.prototype.setControl = function (name, control) {
        this.controls.set(name, control);
    };
    IBizViewController.prototype.getControl = function (name) {
        return this.controls.get(name);
    };
    IBizViewController.prototype.regUIActions = function (opts) {
        if (opts === void 0) { opts = {}; }
    };
    IBizViewController.prototype.regCodeLists = function (opts) {
        if (opts === void 0) { opts = {}; }
    };
    IBizViewController.prototype.regUICounters = function (opts) {
        if (opts === void 0) { opts = {}; }
    };
    IBizViewController.prototype.mounted = function (vue) {
    };
    IBizViewController.prototype.registerItem = function (itemId, item) {
        var _this = this;
        _this.itemMap.set(itemId, item);
    };
    IBizViewController.prototype.unloaded = function () {
        return null;
    };
    /**
     * 初始化
     */
    IBizViewController.prototype.init = function (params) {
        if (params === void 0) { params = {}; }
        var _this = this;
        if (params) {
            _this.parentMode = params.parentMode;
            _this.setParentData(params.parentData);
        }
        _this.bInited = true;
        _this.onInit();
        _this.initViewLogic();
        if (!_this.getPController() && _this.isAutoLayout()) {
            _this.doLayout();
        }
        _this.reloadUpdatePanels();
        _this.fire(IBizViewController.INITED, {});
    };
    /**
     * 异步初始化<加载HTML内容动态绘制到界面>
     */
    IBizViewController.prototype.asyncInit = function (params) {
        if (params === void 0) { params = {}; }
    };
    /**
     * 绘制内容布局
     */
    IBizViewController.prototype.renderHTML = function (data) {
    };
    /**
     * 是否初始化完毕
     */
    IBizViewController.prototype.isInited = function () {
        var _this = this;
        return _this.bInited;
    };
    /**
     * 获取当前容器标识
     */
    IBizViewController.prototype.getCId = function () {
        var _this = this;
        return _this.containerid;
    };
    /**
     * 获取当前容器标识2<自动附加_>
     */
    IBizViewController.prototype.getCId2 = function () {
        var _this = this;
        var cid = _this.getCId();
        if (cid != '') {
            return cid + '_';
        }
        return cid;
    };
    IBizViewController.prototype.getAppCtx = function () {
        var _this = this;
        return _this.appctx;
    };
    /**
     * 注册子控制器对象
     */
    IBizViewController.prototype.regController = function (ctrler) {
        var _this = this;
        _this.ctrlers.set(ctrler.getCId(), ctrler);
    };
    /**
     *获取子控制器对象
     */
    IBizViewController.prototype.getController = function (id) {
        var _this = this;
        return _this.ctrlers.get(id);
    };
    /**
     * 获取父控件
     */
    IBizViewController.prototype.getPController = function () {
        return null;
    };
    /**
     * 注销子控制器对象
     */
    IBizViewController.prototype.unRegController = function (ctrler) {
        var _this = this;
        this.ctrlers.delete(ctrler.getCId());
    };
    /**
     * 注册代码表
     */
    IBizViewController.prototype.regCodeList = function (codelist) {
        var _this = this;
        _this.codelists.set(codelist.getId(), codelist);
    };
    /**
     * 获取代码表
     */
    IBizViewController.prototype.getCodeList = function (codelistId) {
        var _this = this;
        if (_this.codelists) {
            return this.codelists.get(codelistId);
        }
        return null;
    };
    /**
     * 注册界面行为
     */
    IBizViewController.prototype.regUIAction = function (uiaction) {
        var _this = this;
        _this.uiactions.set(uiaction.tag, uiaction);
    };
    /**
     * 获取界面行为
     */
    IBizViewController.prototype.getUIAction = function (uiactionId) {
        var _this = this;
        if (_this.uiactions) {
            return _this.uiactions.get(uiactionId);
        }
        return null;
    };
    /**
     * 注册界面计数器
     */
    IBizViewController.prototype.regUICounter = function (uicounter) {
        var _this = this;
        _this.uicounters.set(uicounter.tag, uicounter);
    };
    /**
     * 获取界面计数器
     */
    IBizViewController.prototype.getUICounter = function (uicounterId) {
        var _this = this;
        if (_this.uicounters) {
            return _this.uicounters.get(uicounterId);
        }
        return null;
    };
    /**
     * 刷新全部界面计数器
     */
    IBizViewController.prototype.reloadUICounters = function () {
        var _this = this;
        _this.uicounters.forEach(function (uicounter) {
            if (uicounter) {
                uicounter.reload();
            }
        });
        var pController = _this.getPController();
        if (pController) {
            pController.reloadUICounters();
        }
    };
    IBizViewController.prototype.getWindow = function () {
        var _this = this;
        // return _this.window;
    };
    /**
     * 是否支持视图模型
     */
    IBizViewController.prototype.isEnableViewModel = function () {
        return false;
    };
    /**
     * 获取后台地址
     */
    IBizViewController.prototype.getBackendUrl = function () {
        var _this = this;
        if (_this.backendurl) {
            return _this.backendurl;
        }
        return null;
    };
    /**
     * 销毁
     */
    IBizViewController.prototype.destroy = function () {
        // var _this = this;
        // $.getIBizApp().unRegSRFView(_this);
        // _this.config = null;
        // arguments.callee.$.destroy.call(this);
    };
    /**
     * 刷新
     */
    IBizViewController.prototype.refresh = function () {
        var _this = this;
        _this.onRefresh();
    };
    IBizViewController.prototype.onRefresh = function () {
    };
    /**
     * 刷新子项
     */
    IBizViewController.prototype.refreshItem = function (name) {
        var _this = this;
        var item = _this.getItem(name);
        if (item) {
            if (typeof item.refresh === 'function') {
                item.refresh();
                return;
            }
            if (typeof item.reload === 'function') {
                item.reload();
                return;
            }
        }
    };
    /**
     * 设置父数据
     */
    IBizViewController.prototype.setParentData = function (data) {
        if (data === void 0) { data = {}; }
        var _this = this;
        _this.parentData = data;
        _this.onSetParentData();
        _this.reloadUpdatePanels();
    };
    IBizViewController.prototype.onSetParentData = function () {
    };
    /**
     * 获取父数据
     */
    IBizViewController.prototype.getParentData = function () {
        var _this = this;
        return _this.parentData;
    };
    /**
     * 获取父模式
     */
    IBizViewController.prototype.getParentMode = function () {
        var _this = this;
        return _this.parentMode;
    };
    /**
     * 获取引用数据
     */
    IBizViewController.prototype.getReferData = function () {
        var _this = this;
        return _this.referData;
    };
    /**
     * 获取引用数据
     */
    IBizViewController.prototype.getViewParam = function () {
        var _this = this;
        return _this.viewparam;
    };
    IBizViewController.prototype.renderCodeList_Normal = function (codeListId, value, emtpytext) {
        var codelist = this.getCodeList(codeListId);
        var item = codelist.getItemByValue(value);
        if (item == null) {
            return emtpytext;
        }
        return this.getCodeItemText(item);
    };
    IBizViewController.prototype.renderCodeList_NumOr = function (codeListId, value, emtpytext, textSeparator) {
        if (!textSeparator || textSeparator == '')
            textSeparator = '、';
        var codelist = this.getCodeList(codeListId);
        if (value == null) {
            return emtpytext;
        }
        var nValue = parseInt(value);
        var strTextOr = '';
        for (var i = 0; i < codelist.datas.length; i++) {
            var item = codelist.datas[i];
            var codevalue = item.value;
            if ((parseInt(codevalue) & nValue) > 0) {
                if (strTextOr.length > 0)
                    strTextOr += (textSeparator);
                strTextOr += this.getCodeItemText(item);
            }
        }
        return strTextOr;
    };
    IBizViewController.prototype.renderCodeList_StrOr = function (codeListId, value, emtpytext, textSeparator, valueSeparator) {
        if (!textSeparator || textSeparator == '')
            textSeparator = '、';
        if (value == null) {
            return emtpytext;
        }
        var strTextOr = '';
        var codelist = this.getCodeList(codeListId);
        var arrayValue = new Array();
        arrayValue = value.split(valueSeparator);
        for (var i = 0; i < arrayValue.length; i++) {
            var strText = '';
            strText = this.renderCodeList_Normal(codeListId, arrayValue[i], emtpytext);
            if (strTextOr.length > 0)
                strTextOr += (textSeparator);
            strTextOr += strText;
        }
        return strTextOr;
    };
    IBizViewController.prototype.getCodeItemText = function (item) {
        if (item === void 0) { item = {}; }
        var color = item.color;
        var textCls = item.textcls;
        var iconCls = item.iconcls;
        // var realText = IBiz.encodeString(item.text);
        var realText = item.text;
        var ret = '';
        if (iconCls) {
            ret = ('<i class="' + iconCls + '"></i>');
        }
        if (textCls || color) {
            ret += '<span';
            if (textCls) {
                ret += (' class="' + textCls + '"');
            }
            if (color) {
                ret += (' style="color:' + color + '"');
            }
            ret += '>';
            ret += realText;
            ret += '</span>';
        }
        else {
            ret += realText;
        }
        return ret;
    };
    IBizViewController.prototype.hasHtmlElement = function (id) {
        return false;
    };
    IBizViewController.prototype.initViewLogic = function () {
        var _this = this;
        _this.onPrepareViewLogics();
        // for (var A in _this.viewLogics) {
        //     var logic = _this.viewLogics[A];
        //     logic.init();
        // }
    };
    IBizViewController.prototype.onPrepareViewLogics = function () {
    };
    IBizViewController.prototype.regViewLogic = function (logic) {
    };
    IBizViewController.prototype.getViewLogic = function (tag) {
        var _this = this;
        return null;
    };
    IBizViewController.prototype.invokeCtrl = function (ctrlid, command, arg) {
        var _this = this;
    };
    /**
     * 注册界面更新面板
     */
    IBizViewController.prototype.regUpdatePanel = function (updatepanel) {
        var _this = this;
        this.updatepanels.set(updatepanel.name, updatepanel);
        _this.registerItem(updatepanel.name, updatepanel);
    };
    /**
     * 获取界面更新面板
     */
    IBizViewController.prototype.getUpdatePanel = function (updatepanelId) {
        var _this = this;
        if (_this.updatepanels) {
            return _this.updatepanels.get(updatepanelId);
        }
        return null;
    };
    /**
     * 刷新全部界面更新面板
     */
    IBizViewController.prototype.reloadUpdatePanels = function () {
        var _this = this;
        if (!_this.isInited())
            return;
        if (_this.updatepanels) {
            var params = {};
            _this.onFillUpdatePanelParam(params);
            _this.updatepanels.forEach(function (panel) {
                if (panel) {
                    panel.reload(params);
                }
            });
        }
        var pController = _this.getPController();
        if (pController) {
            pController.reloadUpdatePanels();
        }
    };
    IBizViewController.prototype.createUpdatePanel = function () {
        // return IBiz.createUpdatePanel(config);
    };
    /**
     * 填充更新面板调用参数
     */
    IBizViewController.prototype.onFillUpdatePanelParam = function (params) {
        if (params === void 0) { params = {}; }
        var _this = this;
        if (_this.viewparam) {
            // $.extend(params, _this.viewparam);
            Object.assign(params, _this.viewparam);
        }
        if (_this.getParentMode()) {
            // $.extend(params, _this.getParentMode());
            Object.assign(params, _this.getParentMode());
        }
        if (_this.getParentData()) {
            // $.extend(params, _this.getParentData());
            Object.assign(params, _this.getParentData());
        }
    };
    /*****************事件声明************************/
    /**
     * 控制器初始化完成
     *
     * @static
     * @memberof IBizViewController
     */
    IBizViewController.INITED = 'INITED';
    return IBizViewController;
}(IBizObject));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 视图控制器入口
 *
 * @class IBizMianViewController
 * @extends {IBizViewController}
 */
var IBizMianViewController = /** @class */ (function (_super) {
    __extends(IBizMianViewController, _super);
    /**
     * Creates an instance of IBizMianViewController.
     * 创建 IBizMianViewController 实例对象
     *
     * @param {*} [opts={}]
     * @memberof IBizMianViewController
     */
    function IBizMianViewController(opts) {
        if (opts === void 0) { opts = {}; }
        return _super.call(this, opts) || this;
    }
    IBizMianViewController.prototype.init = function (params) {
        if (params === void 0) { params = {}; }
        _super.prototype.init.call(this, params);
        this.caption = null;
        this.calcToolbarItemState(false);
    };
    IBizMianViewController.prototype.onInit = function () {
        _super.prototype.onInit.call(this);
        var _this = this;
        //初始化工具栏
        var toolbar = _this.getToolbar();
        if (toolbar) {
            toolbar.on(IBizToolbar.ITEMCLICK).subscribe(function (params) {
                _this.onClickTBItem(params);
            });
        }
    };
    IBizMianViewController.prototype.createToolbar = function () {
        // return IBiz.createToolbar(config);
    };
    /**
   * 点击按钮
   * @param tag 事件源
   */
    IBizMianViewController.prototype.onClickTBItem = function (params) {
        if (params === void 0) { params = {}; }
        var _this = this;
        var uiaction = _this.getUIAction(params.tag);
        _this.doUIAction(uiaction, params);
    };
    IBizMianViewController.prototype.doUIAction = function (uiaction, params) {
        if (uiaction === void 0) { uiaction = {}; }
        if (params === void 0) { params = {}; }
        var _this = this;
        if (uiaction && (typeof uiaction == 'string')) {
            uiaction = _this.getUIAction(uiaction);
        }
        if (uiaction) {
            if (uiaction.type == 'DEUIACTION') {
                _this.doDEUIAction(uiaction, params);
                return;
            }
            if (uiaction.type == 'WFUIACTION') {
                _this.doWFUIAction(uiaction, params);
                return;
            }
        }
    };
    /**
     * 获取前台行为参数
     *
     * @param uiaction
     *            行为
     */
    IBizMianViewController.prototype.getFrontUIActionParam = function (uiaction, params) {
        if (uiaction === void 0) { uiaction = {}; }
        if (params === void 0) { params = {}; }
        var _this = this;
        var arg = {};
        if (uiaction.refreshview) {
            arg.callback = function (win) {
                _this.refresh();
            };
        }
        return arg;
    };
    /**
     * 获取后台行为参数
     *
     * @param uiaction
     *            行为
     */
    IBizMianViewController.prototype.getBackendUIActionParam = function (uiaction, params) {
        if (uiaction === void 0) { uiaction = {}; }
        if (params === void 0) { params = {}; }
        return {};
    };
    /**
     * 打开界面行为视图
     * @param uiaction 行为
     */
    IBizMianViewController.prototype.openUIActionView = function (frontview, viewparam) {
        // var _this = this;
        // var callback;
        // if(viewparam && viewparam.callback){
        // 	callback = viewparam.callback;
        // 	delete viewparam.callback;
        // }
        // var win = $.getIBizApp().createWindow({});
        // win.scope = _this;
        // win.title = frontview.title;
        // win.height = frontview.height ? frontview.height: 0;
        // win.width = frontview.width ? frontview.width: 0;
        // win.url = $.getIBizApp().parseURL2(	frontview.subapp,frontview.viewurl, {windowid : win.getId(),openerid : _this.getId()});
        // win.viewparam = viewparam;
        // win.callback = function(win) {
        // 	if(callback && typeof(callback) == 'function'){
        // 		callback({win:win});
        // 	}
        // }
        if (frontview === void 0) { frontview = {}; }
        if (viewparam === void 0) { viewparam = {}; }
        // var modal=false;
        // if(frontview.openMode=='POPUPMODAL')
        // {
        // 	modal = true;
        // }
        // if(modal){
        // 	win.openModal(window);
        // } else {
        // 	win.openInNewWindow(window);
        // }
    };
    /**
     * 执行实体行为
     * @param uiaction 行为
     */
    IBizMianViewController.prototype.doDEUIAction = function (uiaction, params) {
        if (uiaction === void 0) { uiaction = {}; }
        if (params === void 0) { params = {}; }
        var _this = this;
        if (uiaction.actionmode == 'FRONT') {
            if ((uiaction.fronttype == 'WIZARD') || (uiaction.fronttype == 'SHOWPAGE')) {
                var viewparam = _this.getFrontUIActionParam(uiaction, params);
                if (!viewparam) {
                    viewparam = {};
                }
                var frontview = uiaction.frontview;
                if (frontview.redirectview) {
                    var param = {};
                    param['srfviewparam'] = JSON.stringify(viewparam);
                    param['srfaction'] = 'GETRDVIEW';
                    //远程请求
                    // IBiz.ajax({
                    // 	url: _this.getAppCtx()+frontview.backendurl,
                    // 	params: param,
                    // 	method: 'POST',
                    // 	dataType: 'json',
                    // 	success: function(data) {
                    // 		if (data.ret == 0) {
                    // 			if(data.rdview)
                    // 				_this.openUIActionView(data.rdview,viewparam);
                    // 			else
                    // 			{
                    // 				IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN','警告'),$IGM('MAINVIEWCONTROLLER.DODEUIACTION.INFO','无法打开视图,'+data.info,[data.info]),1);
                    // 			}
                    // 		} else {
                    // 			IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN','警告'),$IGM('MAINVIEWCONTROLLER.DODEUIACTION.INFO','无法打开视图,'+data.info,[data.info]),2);
                    // 		}
                    // 	}
                    // 	failure: function(e) {
                    // 		IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.WARN','警告'),$IGM('MAINVIEWCONTROLLER.AJAX.INFO','获取打开视图失败,请求异常'),2);
                    // 	}
                    // });
                    return;
                }
                _this.openUIActionView(frontview, viewparam);
                return;
            }
            if (uiaction.fronttype == 'OPENHTMLPAGE') {
                // var url = $.getIBizApp().parseURL2(null,uiaction.htmlpageurl, _this.getFrontUIActionParam(uiaction,params));
                // window.open(url, '_blank');
                return;
            }
        }
        if (uiaction.actionmode == 'BACKEND') {
            var param_1 = _this.getBackendUIActionParam(uiaction, params);
            if (param_1 == null)
                return;
            param_1.srfuiactionid = uiaction.tag;
            if (uiaction.confirmmsg) {
                // IBiz.confirm(uiaction.confirmmsg, function(result) {
                // 	if (result) {
                // 		_this.doBackendUIAction(param);
                // 	}
                // });
            }
            else {
                _this.doBackendUIAction(param_1);
            }
            return;
        }
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.ERROR','错误'),$IGM('MAINVIEWCONTROLLER.DODEUIACTION.INFO2','未处理的实体行为['+uiaction.tag+']',[uiaction.tag]), 2);
    };
    /**
     * 执行工作流行为
     * @param uiaction 行为
     */
    IBizMianViewController.prototype.doWFUIAction = function (uiaction, params) {
        if (uiaction === void 0) { uiaction = {}; }
        if (params === void 0) { params = {}; }
        var _this = this;
        if (uiaction.actionmode == 'WFFRONT') {
            if ((uiaction.fronttype == 'WIZARD') || (uiaction.fronttype == 'SHOWPAGE')) {
                // var win = $.getIBizApp().createWindow({});
                // var viewparam = _this.getFrontUIActionParam(uiaction,params);
                // if (!viewparam) {
                // 	viewparam = {};
                // }
                // viewparam['windowid'] = win.getId();
                // viewparam['openerid'] = _this.getId();
                // $.extend(viewparam, uiaction.frontview.viewparam);
                // win.scope = _this;
                // win.title = uiaction.frontview.title;
                // win.height = uiaction.frontview.height ? uiaction.frontview.height
                // 		: 0;
                // win.width = uiaction.frontview.width ? uiaction.frontview.width
                // 		: 0;
                // win.url = $.getIBizApp().parseURL2(
                // 		uiaction.frontview.subapp,
                // 		uiaction.frontview.viewurl, {
                // 			windowid : win.getId(),
                // 			openerid : _this.getId()
                // 		});
                // win.viewparam = viewparam;
                // win.callback  = function(win){
                // 	_this.onWFUIFrontWindowClosed(win);
                // };
                // if (true) {// uiaction.frontview.modal){
                // 	win.openModal(window);
                // } else {
                // 	win.openInNewWindow(window);
                // }
                // return;
            }
        }
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.ERROR','错误'),$IGM('MAINVIEWCONTROLLER.DOWFUIACTION.INFO','未处理的实体工作流行为['+uiaction.tag+']',[uiaction.tag]), 2);
    };
    IBizMianViewController.prototype.onWFUIFrontWindowClosed = function (win, data) {
    };
    /**
     * 执行后台行为
     *
     * @param uiaction
     *            行为
     */
    IBizMianViewController.prototype.doBackendUIAction = function (uiaction) {
        if (uiaction === void 0) { uiaction = {}; }
        // IBiz.alert($IGM('IBIZAPP.CONFIRM.TITLE.ERROR','错误'),$IGM('MAINVIEWCONTROLLER.DOBACKENDUIACTION.INFO','未处理的后台界面行为['+uiaction.tag+']',[uiaction.tag]), 2);
    };
    /**
     * 是否-模式框显示
     */
    IBizMianViewController.prototype.isShowModal = function () {
        return false;
    };
    /**
     * 关闭窗口
     */
    IBizMianViewController.prototype.closeWindow = function () {
        var _this = this;
        var win = _this.getWindow();
        if (win) {
            win.close(window);
        }
        else {
            window.close();
        }
    };
    IBizMianViewController.prototype.getWindow = function () {
        var _this = this;
        // try
        // {
        // 	if(_this.window)
        // 	{
        // 		var curwindow = $.getIBizApp().findWindow(_this.window.getId());
        // 		if(curwindow!=_this.window)
        // 		{
        // 			 _this.window = null;
        // 		}
        // 	}
        // }
        // catch(e)
        // {
        // 	 _this.window = null;
        // }
        return window;
    };
    /**
     * 获取标题
     */
    IBizMianViewController.prototype.getCaption = function () {
        return this.caption;
    };
    /**
     * 设置标题
     *
     * @param caption
     *            标题
     */
    IBizMianViewController.prototype.setCaption = function (caption) {
        if (this.caption != caption) {
            this.caption = caption;
            this.fire(IBizMianViewController.CAPTIONCHANGED, this.caption);
        }
    };
    /**
     * 获取工具栏
     */
    IBizMianViewController.prototype.getToolbar = function () {
        return this.getControl('toolbar');
    };
    /**
     * 计算工具栏项状态-<例如 根据是否有选中数据,设置 工具栏按钮是否可点击>
     *
     * @param hasdata
     *            是否有数据
     */
    IBizMianViewController.prototype.calcToolbarItemState = function (hasdata, dataaccaction) {
        if (dataaccaction === void 0) { dataaccaction = {}; }
        var _this = this;
        var toolbar = _this.getToolbar();
        if (toolbar && toolbar.getItems()) {
            toolbar.getItems().forEach(function (item) {
                if (item.target && (Object.is(item.target, 'SINGLEKEY') || Object.is(item.target, 'MULTIKEY'))) {
                    toolbar.setItemDisabled(name, !hasdata);
                }
            });
            toolbar.updateAccAction(dataaccaction);
        }
    };
    /**
     * 获取引用视图
     */
    IBizMianViewController.prototype.getReferView = function () {
        var _this = this;
        // if (_this.pageparams && _this.pageparams.openerid) {
        // 	return $.getIBizApp().getSRFView(_this.pageparams.openerid);
        // }
        return null;
    };
    /**
     * 获取uiactions
     */
    IBizMianViewController.prototype.getMoreActions = function () {
        return this.uiactions;
    };
    /*****************事件声明************************/
    /**
     * 选中值变化
     */
    IBizMianViewController.CAPTIONCHANGED = 'CAPTIONCHANGED';
    return IBizMianViewController;
}(IBizViewController));

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * 首页视图控制器基类
 *
 * @class IBizIndexViewController
 * @extends {IBizMianViewController}
 */
var IBizIndexViewController = /** @class */ (function (_super) {
    __extends(IBizIndexViewController, _super);
    function IBizIndexViewController(opts) {
        if (opts === void 0) { opts = {}; }
        return _super.call(this, opts) || this;
    }
    IBizIndexViewController.prototype.init = function (params) {
        if (params === void 0) { params = {}; }
        _super.prototype.init.call(this, params);
        var appmenu = this.getAppMenu();
        if (appmenu) {
            appmenu.on(IBizAppMenu.BEFORELOAD).subscribe(function (params) {
            });
            appmenu.on(IBizAppMenu.LOAD).subscribe(function (items) {
            });
            appmenu.on(IBizAppMenu.SELECTION).subscribe(function (item) {
            });
            appmenu.load(this.getViewParam());
        }
    };
    IBizIndexViewController.prototype.getAppMenu = function () {
        return this.getControl('appmenu');
    };
    IBizIndexViewController.prototype.appMenuBeforeLoad = function (params) {
        if (params === void 0) { params = {}; }
    };
    IBizIndexViewController.prototype.appMenuLoad = function (items) {
    };
    IBizIndexViewController.prototype.appMenuSelection = function (item) {
        if (item === void 0) { item = {}; }
    };
    return IBizIndexViewController;
}(IBizMianViewController));

"use strict";
Vue.component('ibiz-tool-bar', {
    template: "\n        <div class=\"ibiz-tool-bar\">\n            <template v-for=\"item in ctrl.items\">\n                <template v-if=\"item.items && item.items.length > 0\">\n                    <Dropdown>\n                        <Button type=\"primary\">\n                            <span>{{item.caption}}</span>\n                            <Icon type=\"ios-arrow-down\"></Icon>\n                        </Button>\n                        <DropdownMenu slot=\"list\">\n                            <template v-for=\"(item1, index1) in item.items\">\n                                <DropdownItem :divided=\"index1 > 0 ? true:false\">\n                                    <span>{{item1.caption}}</span>\n                                </DropdownItem>\n                            </template>\n                        </DropdownMenu>\n                    </Dropdown>\n                </template>\n                <template v-else>\n                    <Button type=\"info\">{{item.caption}}</Button>\n                </template>\n            </template>\n        </div>\n    ",
    props: ['ctrl', 'viewController'],
    data: function () {
        var data = {};
        return data;
    },
    mounted: function () {
        console.log(this.ctrl);
    }
});
