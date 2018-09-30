/**
 * 表格部件控制器
 *
 * @class IBizDataGrid
 * @extends {IBizMDControl}
 */
class IBizDataGrid extends IBizMDControl {

    /**
     * 是否全部选中
     *
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    public allChecked: boolean = false;

    /**
     * 备份数据（行编辑使用）
     *
     * @type {Array<any>}
     * @memberof IBizDataGrid
     */
    public backupData: Array<any> = [];

    /**
     * 当前显示页码
     *
     * @type {number}
     * @memberof IBizDataGrid
     */
    public curPage: number = 1;

    /**
     * 表格编辑项集合
     *
     * @type {*}
     * @memberof IBizDataGrid
     */
    public editItems: any = {};

    /**
     * 表格全部排序字段
     *
     * @type {Array<any>}
     * @memberof IBizDataGrid
     */
    public gridSortField: Array<any> = [];

    /**
     * 表格行选中动画
     *
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    public indeterminate: boolean = false;

    /**
     * 是否启用行编辑
     *
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    public isEnableRowEdit: boolean = false;

    /**
     * 每次加载条数
     *
     * @type {number}
     * @memberof IBizDataGrid
     */
    public limit: number = 20;

    /**
     * 是否支持多项
     *
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    public multiSelect: boolean = true;

    /**
     * 最大导出行数
     *
     * @type {number}
     * @memberof IBizDataGrid
     */
    public maxExportRow: number = 1000;

    /**
     * 打开行编辑
     *
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    public openRowEdit: boolean = false;

    /**
     * 是否分页设置
     *
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    public pageChangeFlag: boolean;

    /**
     * 行多项选中设置，用于阻塞多次触发选中效果
     *
     * @private
     * @type {boolean}
     * @memberof IBizDataGrid
     */
    private rowsSelection: boolean = false;

    /**
     * 查询开始条数
     *
     * @type {number}
     * @memberof IBizDataGrid
     */
    public start: number = 0;

    /**
     * 编辑行数据处理
     *
     * @type {*}
     * @memberof IBizDataGrid
     */
    public state: any = {};

    /**
     * 总条数
     *
     * @type {number}
     * @memberof IBizDataGrid
     */
    public totalrow: number = 0;

    /**
     * Creates an instance of IBizDataGrid.
     * 创建 IBizDataGrid 实例
     * 
     * @param {*} [opts={}]
     * @memberof IBizDataGrid
     */
    constructor(opts: any = {}) {
        super(opts);
        let _this = this;
        _this.regEditItems();
    }

    /**
     * 加载数据
     *
     * @param {*} [arg={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    public load(arg: any = {}): void {
        let opt: any = {};
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

        this.iBizHttp.post(opt).subscribe(response => {
            if (!response.items || response.ret !== 0) {
                if (response.errorMessage) {
                    // this.showToast(this.$showErrorToast, '', response.errorMessage);
                }
                this.loading = false;
                return;
            }
            this.items = this.rendererDatas(response.items);
            this.totalrow = response.totalrow;
            this.fire(IBizMDControl.LOADED, response.items);
            this.loading = false;
        }, error => {
            this.loading = false;
            console.log(error.info);
        });
    }

    /**
     * 刷新数据
     * 
     * @param {*} [arg={}] 
     * @returns {void} 
     * @memberof IBizDataGrid
     */
    public refresh(arg: any = {}): void {
        let opt: any = {};
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

        this.iBizHttp.post(opt).subscribe(
            response => {
                if (!response.items || response.ret !== 0) {
                    if (response.errorMessage) {
                        // this.showToast(this.$showErrorToast, '', response.errorMessage);
                    }
                    this.loading = false;
                    return;
                }

                this.fire(IBizMDControl.LOADED, response.items);
                this.items = this.rendererDatas(response.items);
                this.totalrow = response.totalrow;
                this.loading = false;
            },
            error => {
                this.loading = false;
                console.log(error.info);
            }
        );
    }

    /**
     * 删除数据
     * 
     * @param {*} [arg={}] 
     * @memberof IBizDataGrid
     */
    public remove(arg: any = {}): void {
        const params: any = {};
        Object.assign(params, arg);
        Object.assign(params, { srfaction: 'remove', srfctrlid: this.getName() });
        this.iBizHttp.post(params).subscribe(response => {
            if (response.ret === 0) {
                if (this.allChecked) {
                    const rows = this.curPage * this.limit;
                    if (this.totalrow <= rows) {
                        this.curPage = this.curPage - 1;
                        if (this.curPage === 0) {
                            this.curPage = 1;
                        }
                    }
                }
                this.load({});
                this.fire(IBizDataGrid.REMOVED, {});
                if (response.info && response.info !== '') {
                    // this.showToast(this.$showSuccessToast, '', '删除成功!');
                }
                this.selections = [];
                IBizUtil.processResult(response);
            } else {
                // this.showToast(this.$showErrorToast, '', '删除数据失败,' + response.info);
            }
        }, error => {
            // this.showToast(this.$showErrorToast, '', '删除数据失败');
        });
    }

    /**
     * 行数据复选框单选
     * 
     * @param {boolean} value 
     * @param {*} [item={}] 
     * @returns {void} 
     * @memberof IBizDataGrid
     */
    public onItemSelect(value: boolean, item: any = {}): void {
        if (item.disabled) {
            return;
        }
        if (this.isEnableRowEdit && this.openRowEdit) {
            return;
        }

        const index: number = this.selections.findIndex(data => Object.is(data.srfkey, item.srfkey));
        if (index === -1) {
            this.selections.push(item);
        } else {
            this.selections.splice(index, 1);
        }

        if (!this.multiSelect) {
            this.selections.forEach(data => {
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
    }

    /**
     * 行数据复选框全选
     * 
     * @param {boolean} value 
     * @memberof IBizMDService
     */
    public selectAll(value: boolean): void {
        if (this.isEnableRowEdit && this.openRowEdit) {
            return;
        }

        if (!this.multiSelect) {
            setTimeout(() => {
                this.allChecked = false;
            });
            return;
        }
        this.items.forEach(item => {
            if (!item.disabled) {
                item.checked = value;
            }
        });
        this.selections = [];
        if (value) {
            this.selections = [...this.items];
        }
        this.indeterminate = (!value) && (this.selections.length > 0);
        this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
    }

    /**
     * 导出数据
     * 
     * @param {any} params 
     * @memberof IBizDataGrid
     */
    public exportData(arg: any = {}): void {
        let params: any = {};
        this.fire(IBizMDControl.BEFORELOAD, params);
        if (params.search) {
            Object.assign(params, { query: params.search });
        }
        Object.assign(params, { srfaction: 'exportdata', srfctrlid: this.getName() });

        if (Object.is(arg.itemTag, 'all')) {
            Object.assign(params, { start: 0, limit: this.maxExportRow });
        } else if (Object.is(arg.itemTag, 'custom')) {
            const nStart = arg.exportPageStart;
            const nEnd = arg.exportPageEnd;
            if (nStart < 1 || nEnd < 1 || nStart > nEnd) {
                // this.showToast('INFO', '警告', '请输入有效的起始页');
                return;
            }
            Object.assign(params, { start: (nStart - 1) * this.limit, limit: nEnd * this.limit });
        } else {
            Object.assign(params, { start: (this.curPage * this.limit) - this.limit, limit: this.curPage * this.limit });
        }
        this.iBizHttp.post(params).subscribe(res => {
            if (res.ret === 0) {
                if (res.downloadurl) {
                    let downloadurl: string = res.downloadurl;
                    if (downloadurl.indexOf('/') === 0) {
                        downloadurl = downloadurl.substring(downloadurl.indexOf('/') + 1, downloadurl.length);
                    } else {
                        downloadurl = downloadurl;
                    }
                    IBizUtil.download(downloadurl);
                }
            } else {
                // this.showToast('ERROR', '警告', res.info);
            }
        }, error => {
            console.log(error.info);
        });
    }

    /**
     * 重置分页
     *
     * @memberof IBizDataGrid
     */
    public resetStart(): void {
        this.start = 0;
    }

    /**
     * 第几页跳转
     * 
     * @memberof IBizDataGrid
     */
    public clickPageIndex() {
        this.pageChangeFlag = true;
    }

    /**
     * 分页页数改变
     * 
     * @memberof IBizDataGrid
     */
    public changePageIndex() {
        this.refresh();
    }

    /**
     * 每页显示条数
     * 
     * @memberof IBizDataGrid
     */
    public changePageSize(): void {
        this.curPage = 1;
        this.refresh();
    }

    /**
     * 单击行选中
     *
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    public clickRowSelect(data: any = {}): void {
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizDataGrid.ROWCLICK, this.selections);
    }

    /**
     * 双击行选中
     *
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    public dblClickRowSelection(data: any = {}): void {
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizDataGrid.ROWDBLCLICK, this.selections);
    }

    /**
     * 表格排序
     * 
     * @param {string} name 字段明显
     * @param {string} type 排序类型
     * @returns {void} 
     * @memberof IBizDataGrid
     */
    public sort(name: string, type: string): void {
        let item: any = this.gridSortField.find(item => Object.is(item.property, name));
        if (item === undefined) {
            if (Object.is('ascend', type)) {
                this.gridSortField.push({ property: name, direction: 'asc' });
            } else if (Object.is('descend', type)) {
                this.gridSortField.push({ property: name, direction: 'desc' });
            } else {
                return;
            }
        }

        const index = this.gridSortField.findIndex((item) => {
            return Object.is(item.property, name);
        });

        if (Object.is('ascend', type)) {
            this.gridSortField[index].direction = 'asc';
        } else if (Object.is('descend', type)) {
            this.gridSortField[index].direction = 'desc';
        } else {
            this.gridSortField.splice(index, 1);
        }

        this.refresh({});
    }

    /**
     * 设置表格数据当前页
     * 
     * @param {number} page 分页数量
     * @memberof IBizDataGrid
     */
    public setCurPage(page: number): void {
        this.curPage = page;
    }

    /**
     * 设置是否支持多选
     * 
     * @param {boolean} state 是否支持多选
     * @memberof IBizDataGrid
     */
    public setMultiSelect(state: boolean): void {
        this.multiSelect = state;
    }

    /**
     * 界面行为
     *
     * @param {string} tag
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    public uiAction(tag: string, data: any = {}) {
        if (data.disabled) {
            return;
        }
        if (this.doRowDataSelect(data)) {
            return;
        }
        this.fire(IBizMDControl.UIACTION, { tag: tag, data: data });
    }

    /**
     * 处理非复选框行数据选中,并处理是否激活数据
     *
     * @private
     * @param {*} [data={}]
     * @returns {boolean} 是否激活
     * @memberof IBizDataGrid
     */
    private doRowDataSelect(data: any = {}): boolean {
        if (this.isEnableRowEdit && this.openRowEdit) {
            return;
        }
        if (this.rowsSelection) {
            this.rowsSelection = false;
            return true;
        }
        this.selections.forEach((data) => {
            data.checked = false;
        });
        this.selections = [];
        data.checked = true;
        this.selections.push(data);
        this.indeterminate = (!this.allChecked) && (this.selections.length > 0);
        return false;
    }

    /**
     * 渲染绘制多项数据
     *
     * @param {Array<any>} items
     * @returns {Array<any>}
     * @memberof IBizDataGrid
     */
    public rendererDatas(items: Array<any>): Array<any> {
        super.rendererDatas(items);
        items.forEach(item => {
            const names: Array<any> = Object.keys(item);
            names.forEach(name => { item[name] = item[name] ? item[name] : ''; });
        });
        if (this.isEnableRowEdit) {
            items.forEach((item: any) => { item.openeditrow = (this.isEnableRowEdit) ? true : false; });
        }
        return items;
    }

    /**
     * 注册表格所有编辑项
     *
     * @memberof IBizDataGrid
     */
    public regEditItems(): void {
    }

    /**
     * 注册表格编辑项
     *
     * @param {*} [item={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    public regEditItem(item: any = {}): void {
        if (Object.keys(item).length === 0) {
            return;
        }
        this.editItems[item.name] = item;
    }

    /**
     * 设置编辑项状态
     *
     * @param {string} srfkey
     * @returns {void}
     * @memberof IBizDataGrid
     */
    public setEditItemState(srfkey: string): void {
        if (!this.state) {
            return;
        }
        if (!srfkey) {
            // this.$notification.warning('警告', '数据异常');
        }
        let editItems: any = {};
        const itemsName: Array<any> = Object.keys(this.editItems);
        itemsName.forEach(name => {
            let item: any = {};
            let _editor = JSON.stringify(this.editItems[name]);
            Object.assign(item, JSON.parse(_editor));
            editItems[name] = item;
        });
        this.state[srfkey] = editItems;
    }

    /**
     * 删除信息编辑项状态
     *
     * @param {string} srfkey
     * @memberof IBizDataGrid
     */
    public deleteEditItemState(srfkey: string): void {
        if (srfkey && this.state.hasOwnProperty(srfkey)) {
            delete this.state.srfkey;
        }
    }

    /**
     * 设置编辑项是否启用
     *
     * @param {string} srfkey
     * @param {number} type
     * @memberof IBizDataGrid
     */
    public setEditItemDisabled(srfkey: string, type: number): void {
        if (this.state && this.state.hasOwnProperty(srfkey)) {
            let item = this.state[srfkey];
            const itemsName = Object.keys(item);
            itemsName.forEach(name => {
                let disabled: boolean = (item[name].enabledcond === 3 || item[name].enabledcond === type);
                item[name].disabled = !disabled;
            });
            Object.assign(this.state[srfkey], item);
        }
    }

    /**
     * 获取行编辑状态
     *
     * @returns {boolean}
     * @memberof IBizDataGrid
     */
    public getOpenEdit(): boolean {
        return this.openRowEdit;
    }

    /**
     * 保存表格所有编辑行 <在插件模板中提供重写>
     *
     * @memberof IBizDataGrid
     */
    public saveAllEditRow(): void {
    }

    /**
     * 是否启用行编辑
     *
     * @param {string} tag
     * @memberof IBizDataGrid
     */
    public isOpenEdit(tag: string): void {
        if (!this.isEnableRowEdit) {
            // this.$notification.info('提示', '未启用行编辑');
            return;
        }
        this.openRowEdit = !this.openRowEdit;
        if (this.openRowEdit) {
            this.items.forEach((item: any) => { item.openeditrow = true; });

            this.selections.forEach((data) => {
                data.checked = false;
            });
            this.selections = [];
            this.indeterminate = false;
            this.fire(IBizMDControl.SELECTIONCHANGE, this.selections);
            this.items.forEach(item => {
                const { ...data } = item;
                this.backupData.push(data);
                this.setEditItemState(item.srfkey);
            });
        } else {
            this.items = [];
            this.backupData.forEach(data => {
                this.items.push(data);
            });
            this.backupData = [];
            this.state = {};
        }
    }

    /**
     * 编辑行数据
     *
     * @param {*} [data={}]
     * @param {number} rowindex
     * @memberof IBizDataGrid
     */
    public editRow(data: any = {}, rowindex: number): void {
        data.openeditrow = !data.openeditrow;
        this.setEditItemState(data.srfkey);
        if (data.openeditrow) {
            const index: number = this.backupData.findIndex(item => Object.is(item.srfkey, data.srfkey));
            if (index !== -1) {
                Object.assign(data, this.backupData[index]);
            }
            if (Object.is(data.srfkey, '')) {
                this.items.splice(rowindex, 1);
            }
        } else {
            this.setEditItemDisabled(data.srfkey, 2);
        }
    }

    /**
     * 保存编辑行数据
     *
     * @param {*} [data={}]
     * @param {number} rowindex
     * @memberof IBizDataGrid
     */
    public editRowSave(data: any = {}, rowindex: number): void {
        const _index: number = this.backupData.findIndex(item => Object.is(item.srfkey, data.srfkey));
        const srfaction: string = (_index !== -1) ? 'update' : 'create';
        // if (Object.is(srfaction, 'create')) {
        //     delete data.srfkey;
        // }
        let params: any = { srfaction: srfaction, srfctrlid: 'grid' };
        const viewController = this.getViewController();
        if (viewController && viewController.getViewParam() && Object.keys(viewController.getViewParam()).length > 0) {
            Object.assign(params, viewController.getViewParam());
        }
        const _names: Array<any> = Object.keys(data);
        _names.forEach(name => {
            data[name] = data[name] ? data[name] : '';
        });
        Object.assign(params, data);
        this.iBizHttp.post(params).subscribe((responce: any) => {
            if (responce.ret === 0) {
                data.openeditrow = !data.openeditrow;
                const index: number = this.backupData.findIndex(item => Object.is(data.srfkey, item.srfkey));
                if (index !== -1) {
                    Object.assign(this.backupData[index], responce.data);
                } else {
                    this.deleteEditItemState(data.srfkey);
                    this.setEditItemState(responce.data.srfkey);
                    this.backupData.push(data);
                }
                Object.assign(data, responce.data);
                // this.showToast(this.$showSuccessToast, '提示', '保存成功');
                this.fire(IBizMDControl.LOADED, data);
            } else {
                let info = '';
                if (responce.error && (responce.error.items && Array.isArray(responce.error.items))) {
                    const items: Array<any> = responce.error.items;
                    items.forEach((item, index) => {
                        if (index > 0) {
                            info += '\n';
                        }
                        info += item.info;
                        Object.assign(this.state[data.srfkey][item.id].styleCss, { 'border': '1px solid #f04134', 'border-radius': '4px' });
                    });
                }
                // this.$notification.error('错误', !Object.is(info, '') ? info : '行编辑保存失败');
            }
        }, (error: any) => {
            let info = '';
            if (error.error && (error.error.items && Array.isArray(error.error.items))) {
                const items: Array<any> = error.error.items;
                items.forEach((item, index) => {
                    if (index > 0) {
                        info += '\n';
                    }
                    info += item.info;
                    Object.assign(this.state[data.srfkey][item.id].styleCss, { 'border': '1px solid #f04134', 'border-radius': '4px' });
                });
            }
            // this.$notification.error('错误', !Object.is(info, '') ? info : '行编辑保存失败');
        });
    }

    /**
     * 行编辑文本框光标移出事件
     *
     * @param {*} $event
     * @param {string} name
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    public onBlur($event: any, name: string, data: any = {}): void {
        if ((!$event) || Object.keys(data).length === 0) {
            return;
        }
        if (Object.is($event.target.value, data[name])) {
            return;
        }
        this.colValueChange(name, $event.target.value, data);
    }

    /**
     * 行编辑文本框键盘事件
     *
     * @param {*} $event
     * @param {string} name
     * @param {*} [data={}]
     * @returns {void}
     * @memberof IBizDataGrid
     */
    public onKeydown($event: any, name: string, data: any = {}): void {
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
    }

    /**
     * 行编辑单元格值变化
     *
     * @param {string} name
     * @param {*} data
     * @memberof IBizDataGrid
     */
    public colValueChange(name: string, value: string, data: any): void {
        const srfkey = data.srfkey;
        const _data = this.backupData.find(back => Object.is(back.srfkey, srfkey));
        if (_data && !Object.is(_data[name], value)) {
            Object.assign(this.state[srfkey][name].styleCss, { 'border': '1px solid #49a9ee', 'border-radius': '4px' });
        } else {
            Object.assign(this.state[srfkey][name].styleCss, { 'border': '0px', 'border-radius': '0px' });
        }
        data[name] = value;
        this.fire(IBizDataGrid.UPDATEGRIDITEMCHANGE, { name: name, data: data });
    }

    /**
     * 更新表格编辑列值
     *
     * @param {string} srfufimode
     * @param {*} [data={}]
     * @memberof IBizDataGrid
     */
    public updateGridEditItems(srfufimode: string, data: any = {}): void {
        let opt: any = { srfaction: 'updategridedititem', srfufimode: srfufimode, srfctrlid: 'grid' };
        const viewController = this.getViewController();
        if (viewController && viewController.getViewParam() && Object.keys(viewController.getViewParam()).length > 0) {
            Object.assign(opt, viewController.getViewParam());
        }
        const _names: Array<any> = Object.keys(data);
        _names.forEach(name => {
            data[name] = data[name] ? data[name] : '';
        });
        Object.assign(opt, { srfactivedata: JSON.stringify(data) });
        this.iBizHttp.post(opt).subscribe((success) => {
            if (success.ret === 0) {
                const index: number = this.items.findIndex(item => Object.is(item.srfkey, data.srfkey));
                if (index !== -1) {
                    Object.assign(this.items[index], success.data);
                }
            } else {
                // this.$notification.error('错误', success.info);
            }
        }, (error) => {
            // this.$notification.error('错误', error.info);
        });
    }

    /**
     * 新建编辑行
     *
     * @param {*} [param={}]
     * @memberof IBizDataGrid
     */
    public newRowAjax(param: any = {}): void {
        let opt: any = {};
        Object.assign(opt, param);
        const viewController = this.getViewController();
        if (viewController && viewController.getViewParam() && Object.keys(viewController.getViewParam()).length > 0) {
            Object.assign(opt, viewController.getViewParam());
        }
        this.fire(IBizMDControl.BEFORELOAD, opt);
        Object.assign(opt, { srfaction: 'loaddraft', srfctrlid: 'grid' });
        this.iBizHttp.post(opt).subscribe(success => {
            if (success.ret === 0) {
                const srfkey: string = (Object.is(success.data.srfkey, '')) ? IBizUtil.createUUID() : success.data.srfkey;
                success.data.srfkey = srfkey;
                this.setEditItemState(srfkey);
                this.setEditItemDisabled(srfkey, 1);
                this.items.push(Object.assign(success.data, { openeditrow: false }));
            } else {
                // this.$notification.error('错误', `获取默认数据失败, ${success.info}`);
            }
        }, error => {
            // this.$notification.error('错误', `获取默认数据失败, ${error.info}`);
        });
    }

    /*****************事件声明************************/

    /**
     * 表格行数据变化
     *
     * @static
     * @memberof IBizDataGrid
     */
    public static UPDATEGRIDITEMCHANGE = 'UPDATEGRIDITEMCHANGE';

    /**
     * 数据删除完成
     *
     * @static
     * @memberof IBizDataGrid
     */
    public static REMOVED = 'REMOVED';

    /**
     * 行单击选中
     *
     * @static
     * @memberof IBizDataGrid
     */
    public static ROWCLICK = 'ROWCLICK';

    /**
     * 行数据双击选中
     *
     * @static
     * @memberof IBizDataGrid
     */
    public static ROWDBLCLICK = 'ROWDBLCLICK';
}