/**
 * 单项选择视图控制器
 * 
 * @export
 * @class IBizPickupViewController
 * @extends {IBizMainViewController}
 */
class IBizPickupViewController extends IBizMainViewController {

    /**
     * 按钮文本--确定
     *
     * @type {string}
     * @memberof IBizPickupViewController IBizMianViewController
     */
    public okBtnText: string = '确定';

    /**
     * 按钮文本--取消
     *
     * @type {string}
     * @memberof IBizPickupViewController
     */
    public cancelBtnText: string = '取消';

    /**
     * 是否选中
     *
     * @type {boolean}
     * @memberof IBizPickupViewController
     */
    public isSelect: boolean = false;

    /**
     * Creates an instance of IBizPickupViewController.
     * 创建 IBizPickupViewController 实例
     * 
     * @param {*} [opts={}] 
     * @memberof IBizPickupViewController
     */
    constructor(opts: any = {}) {
        super(opts);
    }

    public init(opts: any = {}): void {
        super.init(opts);
        let _this = this;
        const pickupViewPanel = _this.getPickupViewPanel();
        if (pickupViewPanel) {
            // 选择视图面板数据选中
            pickupViewPanel.on(IBizPickupViewPanel.SELECTIONCHANGE).subscribe((args) => {
                _this.onSelectionChange(args);
            });
            // 选择视图面板数据激活
            pickupViewPanel.on(IBizPickupViewPanel.DATAACTIVATED).subscribe((args) => {
                _this.onDataActivated(args);
            });
        }
    }

    // /**
    //  * 视图部件初始化
    //  *
    //  * @memberof IBizPickupViewController
    //  */
    // public onInitComponents(): void {
    //     // super.onInitComponents();
    //     const pickupViewPanel = this.getPickupViewPanel();
    //     if (pickupViewPanel) {
    //         // 选择视图面板数据选中
    //         pickupViewPanel.on(IBizPickupViewPanel.SELECTIONCHANGE).subscribe((args) => {
    //             this.onSelectionChange(args);
    //         });
    //         // 选择视图面板数据激活
    //         pickupViewPanel.on(IBizPickupViewPanel.DATAACTIVATED).subscribe((args) => {
    //             this.onDataActivated(args);
    //         });
    //     }
    // }

    /**
     * 数据选择，确定功能
     * 
     * @memberof IBizPickupViewController
     */
    public onClickOkButton(): void {
        const pickupViewPanel = this.getPickupViewPanel();
        if (!pickupViewPanel) {
            return;
        }
        if (pickupViewPanel.getSelections().length !== 1) {
            return;
        }
        // this.modalViewDataChange({ ret: 'DATACHANGE', data: pickupViewPanel.getSelections() });
        // this.closeWindow();
        let _this = this;
        _this.closeModal({ ret: 'OK', selections: pickupViewPanel.getSelections() });
    }

    /**
     * 取消显示选择视图
     * 
     * @param {string} type 
     * @memberof IBizPickupViewController
     */
    public onClickCancelButton(type: string): void {
        // this.closeModal();
        let _this = this;
        _this.closeModal();
    }

    /**
     * 接收选择视图数据传递
     *
     * @param {Array<any>} args
     * @memberof IBizPickupViewController
     */
    public onSelectionChange(args: Array<any>): void {
        this.isSelect = args.length > 0 ? true : false;
    }

    /**
     * 数据选中激活
     *
     * @param {Array<any>} args
     * @memberof IBizPickupViewController
     */
    public onDataActivated(args: Array<any>): void {
        this.onSelectionChange(args);
        this.onClickOkButton();
    }

    /**
     * 获取选择视图面板
     * 
     * @returns {*} 
     * @memberof IBizPickupViewController
     */
    public getPickupViewPanel(): any {
        return this.controls.get('pickupviewpanel');
    }

}

