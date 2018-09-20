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
        return _super.call(this, opts) || this;
    }
    IBizAppMenu.prototype.load = function () {
        var params = { srfctrlid: this.getName(), srfaction: 'FETCH' };
        // this.post(params, this.getBackendUrl()).subscribe(success => {
        //     if (success.ret === 0) {
        //         this.$items = success.items;
        //         const data = this.doMenus(success.items);
        //         this.fire(IBizEvent.IBizAppMenu_LOADED, data);
        //     }
        // }, error => {
        //     console.log(error);
        // });
    };
    IBizAppMenu.prototype.onSelectChange = function (select) {
    };
    /*****************事件声明************************/
    IBizAppMenu.BEFORELOAD = 'BEFORELOAD';
    IBizAppMenu.LOAD = 'LOAD';
    IBizAppMenu.SELECTION = 'SELECTION';
    return IBizAppMenu;
}(IBizControl));
