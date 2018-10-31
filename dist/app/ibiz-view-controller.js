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
     *Creates an instance of IBizViewController.
     * 创建 IBizViewController 实例
     *
     * @param {*} [opts={}]
     * @memberof IBizViewController
     */
    function IBizViewController(opts) {
        if (opts === void 0) { opts = {}; }
        var _this_1 = _super.call(this, opts) || this;
        /**
         * 模态框打开视图注入参数
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.modalViewParam = {};
        /**
         * 模态框打开视图注入视图层级参数
         *
         * @memberof IBizViewController
         */
        _this_1.modalZIndex = 300;
        /**
         * 关系数据
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.srfReferData = {};
        /**
         * 视图控制器父对象数据
         *
         * @type {*}implements OnInit, OnDestroy, OnChanges
         * @memberof IBizViewController
         */
        _this_1.srfParentData = {};
        /**
         * 视图控制器父对象模型
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.srfParentMode = {};
        /**
         * 视图控制器是否初始化
         *
         * @type {boolean}
         * @memberof IBizViewController
         */
        _this_1.bInited = false;
        /**
         * 暂时废弃
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.itemMap = {};
        /**
         * 视图控制器代码表
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.codelists = {};
        /**
         * 部件控制器
         *
         * @type {Map<string, any>}
         * @memberof IBizViewController
         */
        _this_1.controls = new Map();
        /**
         * 实体界面行为
         *
         * @type {Map<string, any>}
         * @memberof IBizViewController
         */
        _this_1.uiactions = new Map();
        /**
         * 计数器
         *
         * @type {Map<string, any>}
         * @memberof IBizViewController
         */
        _this_1.uicounters = new Map();
        /**
         * 视图控制器url
         *
         * @private
         * @type {string}
         * @memberof IBizViewController
         */
        _this_1.url = '';
        /**
         * 视图控制器参数
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.viewParam = {};
        /**
         * vue 路由对象
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.$router = null;
        /**
         * vue 实例对象
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.$vue = null;
        /**
         * vue 当前路由对象
         *
         * @type {*}
         * @memberof IBizViewController
         */
        _this_1.$route = null;
        /**
         * 路由所在位置下标
         *
         * @type {number}
         * @memberof IBizViewController
         */
        _this_1.route_index = -1;
        /**
         * 视图使用模式
         *
         * @private
         * @type {number}
         * @memberof IBizViewController
         */
        _this_1.viewUsage = 0;
        _this_1.url = opts.url;
        return _this_1;
    }
    ;
    /**
     * 初始化
     * 模拟vue生命周期
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.VueOnInit = function (vue) {
        this.$route = vue.$route;
        this.$router = vue.$router;
        this.$vue = vue;
        this.setViewUsage(this.$vue.viewUsage);
        this.parseViewParams();
        this.onInit();
        this.onInited();
    };
    /**
     * 销毁
     * 模拟Vue生命周期
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.VueOnDestroy = function () {
        this.onDestroy();
    };
    /**
     * 视图组件销毁时调用
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onDestroy = function () {
        this.unRegUICounters();
        var win = window;
        var iBizApp = win.getIBizApp();
        if (iBizApp) {
            iBizApp.unRegSRFController(this);
        }
    };
    /**
     * Angular生命周期
     * @input 值变化时调用
     *
     * @param {*} change
     * @memberof IBizViewController
     */
    IBizViewController.prototype.ngOnChanges = function (change) {
    };
    /**
     * 视图参数变化，嵌入表单，手动刷新数据
     *
     * @param {*} change
     * @memberof IBizViewController
     */
    IBizViewController.prototype.viewParamChange = function (change) {
        if (change && change.srfparentkey && !Object.is(change.srfparentkey, '')) {
            this.addViewParam(change);
            this.refresh();
        }
    };
    /**
     * 视图初始化
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onInit = function () {
        this.regUIActions();
        this.regUICounters();
        this.regCodeLists();
        this.onInitComponents();
        this.onLoad();
        this.fire(IBizViewController.INITED, this);
    };
    /**
     * 部件初始化
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onInitComponents = function () {
    };
    /**
     *
     * 数据加载
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onLoad = function () {
    };
    /**
     * 视图控制器初始化完成
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onInited = function () {
        var _this_1 = this;
        this.bInited = true;
        var win = window;
        var iBizApp = win.getIBizApp();
        if (iBizApp) {
            iBizApp.regSRFController(this);
        }
        if (this.getViewUsage() === IBizViewController.VIEWUSAGE_DEFAULT) {
            var views = iBizApp.viewControllers;
            var index = views.findIndex(function (view) { return Object.is(view.getId(), _this_1.getId()) && Object.is(view.getViewUsage(), _this_1.getViewUsage()); });
            this.route_index = index;
        }
    };
    /**
     * 开始触发界面行为
     *
     * @param {*} id
     * @memberof IBizViewController
     */
    IBizViewController.prototype.clickButton = function (id) {
        this.onClickTBItem({ tag: id });
    };
    /**
     *
     *
     * @param {any} params
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onClickTBItem = function (params) {
    };
    /**
     * 设置部件
     *
     * @param {string} name
     * @param {*} control
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regControl = function (name, control) {
        this.controls.set(name, control);
    };
    /**
     * 获取部件
     *
     * @param {string} name
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getControl = function (name) {
        return this.controls.get(name);
    };
    /**
     * 关闭
     *
     * @returns {boolean}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.isClosed = function () {
        return true;
    };
    /**
     *
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.quit = function () {
    };
    /**
     *
     *
     * @param {string} itemId
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getItem = function (itemId) {
        if (this.itemMap[itemId]) {
            return this.itemMap[itemId];
        }
        return undefined;
    };
    /**
     *
     *
     * @param {string} itemId
     * @param {*} item
     * @memberof IBizViewController
     */
    IBizViewController.prototype.registerItem = function (itemId, item) {
        this.itemMap[itemId] = item;
    };
    /**
     *
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.unloaded = function () {
        return null;
    };
    /**
     * 是否初始化完毕
     *
     * @returns {boolean}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.isInited = function () {
        return this.bInited;
    };
    /**
     *
     *
     * @returns {string}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getAppCtx = function () {
        return '';
    };
    /**
     * 注册子控制器对象
     *
     * @param {*} ctrler
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regController = function (ctrler) {
    };
    /**
     * 获取子控制器对象
     *
     * @param {string} id
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getController = function (id) {
        return undefined;
    };
    /**
     * 获取父控件
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getPController = function () {
        var win = window;
        var iBizApp = win.getIBizApp();
        var PController = null;
        ;
        if (iBizApp) {
            PController = iBizApp.getParentController(this.getId(), this.getViewUsage());
        }
        return PController;
    };
    /**
     * 注销子控制器对象
     *
     * @param {*} ctrler
     * @memberof IBizViewController
     */
    IBizViewController.prototype.unRegController = function (ctrler) {
    };
    /**
     * 注册代码表
     *
     * @param {*} codelist
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regCodeList = function (codelist) {
        if (!this.codelists) {
            this.codelists = {};
        }
        this.codelists[codelist.getId()] = codelist;
    };
    /**
     * 获取代码表
     *
     * @param {string} codelistId
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getCodeList = function (codelistId) {
        if (!this.codelists) {
            return undefined;
        }
        if (this.codelists[codelistId]) {
            return this.codelists[codelistId];
        }
        return undefined;
    };
    /**
     * 注册界面行为
     *
     * @param {*} [uiaction={}]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regUIAction = function (uiaction) {
        if (uiaction === void 0) { uiaction = {}; }
        if (uiaction) {
            this.uiactions.set(uiaction.tag, uiaction);
        }
    };
    /**
     * 获取界面行为
     *
     * @param {string} uiactionId
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getUIAction = function (uiactionId) {
        return this.uiactions.get(uiactionId);
    };
    /**
     * 注册界面计数器
     *
     * @param {string} name
     * @param {*} uicounter
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regUICounter = function (name, uicounter) {
        this.uicounters.set(name, uicounter);
    };
    /**
     * 获取界面计数器
     *
     * @param {string} name
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getUICounter = function (name) {
        return this.uicounters.get(name);
    };
    /**
     * 刷新全部界面计数器
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.reloadUICounters = function () {
        this.uicounters.forEach(function (uicounter) {
            uicounter.reload();
        });
        var pController = this.getPController();
        if (pController) {
            pController.reloadUICounters();
        }
    };
    /**
     * 获取窗口对象
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getWindow = function () {
        return window;
    };
    /**
     * 是否支持视图模型
     *
     * @returns {boolean}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.isEnableViewModel = function () {
        return false;
    };
    /**
     * 获取后台地址
     *
     * @returns {string}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getBackendUrl = function () {
        if (this.url) {
            return this.url;
        }
        return undefined;
    };
    /**
     * 获取动态视图参数
     *
     * @returns {(any | undefined)}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getDynamicParams = function () {
        return {};
    };
    /**
     * 刷新
     *
     * @private
     * @memberof IBizViewController
     */
    IBizViewController.prototype.refresh = function () {
        this.onRefresh();
    };
    /**
     * 视图刷新方法，继承视图控制器重写
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onRefresh = function () {
    };
    /**
     * 刷新子项
     *
     * @param {string} name
     * @memberof IBizViewController
     */
    IBizViewController.prototype.refreshItem = function (name) {
    };
    /**
     * 设置父数据
     *
     * @param {*} [data={}]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.setParentData = function (data) {
        if (data === void 0) { data = {}; }
        this.srfParentData = {};
        Object.assign(this.srfParentData, data);
        this.onSetParentData();
        this.reloadUpdatePanels();
    };
    /**
     * 设置父数据
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onSetParentData = function () {
    };
    /**
     * 获取父数据
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getParentData = function () {
        return this.srfParentData;
    };
    /**
     * 获取父模式
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getParentMode = function () {
        return this.srfParentMode;
    };
    /**
     * 获取引用数据
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getViewParam = function () {
        return this.viewParam;
    };
    /**
     * 设置关系数据
     *
     * @param {*} [data={}]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.setReferData = function (data) {
        if (data === void 0) { data = {}; }
        Object.assign(this.srfReferData, data);
    };
    /**
     * 获取关系数据
     *
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getReferData = function () {
        return this.srfReferData;
    };
    /**
     * 正常代码表模式
     *
     * @param {string} codeListId 代码表ID
     * @param {string} value 数据值
     * @param {string} emtpytext 空值显示数据
     * @returns {string}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.renderCodeList_Normal = function (codeListId, value, emtpytext) {
        if (!value) {
            return emtpytext;
        }
        var codelist = this.getCodeList(codeListId);
        if (codelist) {
            var result_1 = '';
            var values = value.split(';');
            values.forEach(function (value) {
                var item = codelist.getItemByValue(value);
                if (item) {
                    result_1 += '、' + codelist.getCodeItemText(item);
                }
            });
            if (result_1.length > 1) {
                result_1 = result_1.substring(1);
            }
            return result_1;
        }
        return '';
    };
    /**
     * 代码表数字或处理
     *
     * @param {string} codeListId 代码表ID
     * @param {string} value 数据值
     * @param {string} emtpytext 空值显示信息
     * @param {string} textSeparator 文本拼接方式
     * @returns {string}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.renderCodeList_NumOr = function (codeListId, value, emtpytext, textSeparator) {
        if (!textSeparator || Object.is(textSeparator, '')) {
            textSeparator = '、';
        }
        var strTextOr = '';
        if (!value) {
            return emtpytext;
        }
        var nValue = parseInt(value, 10);
        var codelist = this.getCodeList(codeListId);
        if (codelist) {
            codelist.data.forEach(function (ele) {
                var codevalue = ele.value;
                if ((parseInt(codevalue, 10) & nValue) > 0) {
                    if (strTextOr.length > 0) {
                        strTextOr += (textSeparator);
                    }
                    strTextOr += codelist.getCodeItemText(ele);
                }
            });
        }
        return strTextOr;
    };
    /**
     * 代码表文本或处理
     *
     * @param {string} codeListId 代码表ID
     * @param {*} value 数据值
     * @param {*} emtpytext 空值显示信息
     * @param {*} textSeparator 文本凭借方式
     * @param {*} valueSeparator 数据值分割方式
     * @returns {string}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.renderCodeList_StrOr = function (codeListId, value, emtpytext, textSeparator, valueSeparator) {
        var _this_1 = this;
        if (!textSeparator || Object.is(textSeparator, '')) {
            textSeparator = '、';
        }
        if (!value) {
            return emtpytext;
        }
        var strTextOr = '';
        var codelist = this.getCodeList(codeListId);
        var arrayValue = value.split(valueSeparator);
        arrayValue.forEach(function (value) {
            var strText = '';
            strText = _this_1.renderCodeList_Normal(codeListId, value, emtpytext);
            if (strTextOr.length > 0) {
                strTextOr += (textSeparator);
            }
            strTextOr += strText;
        });
        return strTextOr;
    };
    /**
     *
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.initViewLogic = function () {
    };
    /**
     *
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onPrepareViewLogics = function () {
    };
    /**
     *
     *
     * @param {*} logic
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regViewLogic = function (logic) {
    };
    /**
     *
     *
     * @param {*} tag
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getViewLogic = function (tag) {
        return undefined;
    };
    /**
     *
     *
     * @param {any} ctrlid
     * @param {any} command
     * @param {any} arg
     * @memberof IBizViewController
     */
    IBizViewController.prototype.invokeCtrl = function (ctrlid, command, arg) {
    };
    /**
     * 注册界面更新面板
     *
     * @param {*} updatepanel
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regUpdatePanel = function (updatepanel) {
    };
    /**
     * 获取界面更新面板
     *
     * @param {string} updatepanelId
     * @returns {*}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getUpdatePanel = function (updatepanelId) {
        return undefined;
    };
    /**
     * 刷新全部界面更新面板
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.reloadUpdatePanels = function () {
    };
    /**
     * 填充更新面板调用参数
     *
     * @param {*} [params={}]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.onFillUpdatePanelParam = function (params) {
        if (params === void 0) { params = {}; }
    };
    // 附加方法
    /**
     * 初始化注册界面行为
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regUIActions = function () {
    };
    /**
     * 初始化注册计数器
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regUICounters = function () {
    };
    /**
     * 销毁计数器
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.unRegUICounters = function () {
        var _this_1 = this;
        if (Object.keys(this.uicounters).length == 0) {
            return;
        }
        var _nameArr = Object.keys(this.uicounters);
        _nameArr.forEach(function (name) {
            var _counter = _this_1.getUICounter(name);
            if (_counter) {
                _counter.close();
            }
        });
    };
    /**
     * 初始化代码表
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.regCodeLists = function () {
    };
    /**
     * 解析视图参数，初始化调用
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.parseViewParams = function () {
        var parsms = {};
        if (this.getViewUsage() === IBizViewController.VIEWUSAGE_DEFAULT) {
            Object.assign(parsms, this.$route.params);
        }
        else if (this.getViewUsage() === IBizViewController.VIEWUSAGE_MODAL) {
            Object.assign(parsms, this.$vue.params);
        }
        else if (this.getViewUsage() === IBizViewController.VIEWUSAGE_EMBEDED) {
            Object.assign(parsms, this.$vue.params);
        }
        this.addViewParam(parsms);
    };
    /**
     * 添加视图参数, 处理视图刷新操作
     *
     * @param {*} [param={}]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.addViewParam = function (param) {
        if (param === void 0) { param = {}; }
        Object.assign(this.viewParam, param);
        if (this.isInited()) {
            if (this.viewParam.refreshView) {
                this.viewParam = {};
                delete this.viewParam.refreshView;
                Object.assign(this.viewParam, param);
                this.onLoad();
            }
        }
    };
    /**
     * 打开数据视图,模态框打开
     *
     * @param {*} [view={}]
     * @returns {Subject<any>}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.openModal = function (view) {
        if (view === void 0) { view = {}; }
        var subject = new rxjs.Subject();
        Object.assign(view, { subject: subject });
        this.$vue.$root.addModal(view);
        return subject;
    };
    /**
     * 关闭模态框
     *
     * @param {*} [result]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.closeModal = function (result) {
        var _this = this;
        _this.$vue.$emit('close', result);
    };
    /**
     * 打开视图;打开方式,路由打开
     *
     * @param {string} routeString 相对路由地址
     * @param {*} [routeParam={}] 激活路由参数
     * @param {*} [queryParams] 路由全局查询参数
     * @memberof IBizViewController
     */
    IBizViewController.prototype.openView = function (routeString, routeParam, queryParams) {
        if (routeParam === void 0) { routeParam = {}; }
        var matched = this.$route.matched;
        var route_arr = this.$route.fullPath.split('/');
        var index = -2;
        if (matched[this.route_index]) {
            var name_1 = matched[this.route_index].name;
            var _index = route_arr.findIndex(function (_name) { return Object.is(_name, name_1); });
            index = _index + 1;
            if (route_arr[_index]) {
                index = index + 1;
            }
        }
        if (matched[this.route_index + 1]) {
            var nextName_1 = matched[this.route_index + 1].name;
            var _index1 = route_arr.findIndex(function (_name) { return Object.is(_name, nextName_1); });
            if (_index1 !== -1) {
                index = _index1;
            }
        }
        if (index > 0) {
            var path_arr = route_arr.slice(0, index);
            var path = path_arr.join('/') + "/" + routeString + "/" + JSON.stringify(routeParam);
            console.log(path_arr);
            this.$router.push({ path: path, query: queryParams });
        }
        // this.$router.push({ name: routeString, query: routeParam });
    };
    /**
     * 打开新窗口
     *
     * @param {string} viewurl
     * @param {*} [parsms={}]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.openWindow = function (viewurl, parsms) {
        if (parsms === void 0) { parsms = {}; }
        // let url_datas: Array<string> = [];
        // const params_names = Object.keys(parsms);
        // params_names.forEach(name => {
        //     if (name && parsms[name] && !Object.is(parsms[name], '')) {
        //         url_datas.push(`${name}=${parsms[name]}`)
        //     }
        // })
        var url = "/" + IBizEnvironment.SysName + "/" + IBizEnvironment.BaseUrl.toLowerCase() + viewurl + "/" + JSON.stringify(parsms);
        // if (url_datas.length > 0) {
        //     url = `${url}?${url_datas.join('&')}`;
        // }
        var win = window;
        win.open(url, '_blank');
    };
    /**
    * 视图是否是模态框对象
    *
    * @returns {boolean}
    * @memberof IBizViewController
    */
    IBizViewController.prototype.isModal = function () {
        if (this.modalViewParam) {
            return true;
        }
        return false;
    };
    /**
     * 获取实体名称
     *
     * @returns {string}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getDEName = function () {
        return '';
    };
    /**
     * 返回历史记录
     *
     * @memberof IBizViewController
     */
    IBizViewController.prototype.goBack = function () {
    };
    /**
     * 数据变化
     *
     * @param {*} [data]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.dataChange = function (data) {
        var _this = this;
        _this.$vue.$emit('dataChange', data);
    };
    /**
     * 设置视图的使用模式
     *
     * @private
     * @param {number} [viewUsage=0]
     * @memberof IBizViewController
     */
    IBizViewController.prototype.setViewUsage = function (viewUsage) {
        if (viewUsage === void 0) { viewUsage = 0; }
        this.viewUsage = viewUsage;
    };
    /**
     * 获取视图的使用模式
     *
     * @returns {number}
     * @memberof IBizViewController
     */
    IBizViewController.prototype.getViewUsage = function () {
        return this.viewUsage;
    };
    /**
     * 视图初始化完成
     *
     * @static
     * @memberof IBizViewController
     */
    IBizViewController.INITED = 'INITED';
    /**
     * 视图使用模式，默认
     *
     * @static
     * @memberof IBizViewController
     */
    IBizViewController.VIEWUSAGE_DEFAULT = 1;
    /**
     * 视图使用模式，模式弹出
     *
     * @static
     * @memberof IBizViewController
     */
    IBizViewController.VIEWUSAGE_MODAL = 2;
    /**
     * 视图使用模式，嵌入
     *
     * @static
     * @memberof IBizViewController
     */
    IBizViewController.VIEWUSAGE_EMBEDED = 4;
    return IBizViewController;
}(IBizObject));
