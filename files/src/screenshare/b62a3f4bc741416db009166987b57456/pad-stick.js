(() => {
// jCanvasの座標の基準を左上に設定
    $.jCanvas.defaults.fromCenter = false;

    /** スティックの閾値 */
    const STICK_THRESHOLD = 80;
    /** スティックの半径 */
    const STICK_RADIUS = 20;

    /** 初期X座標 */
    let defaultX = -1;
    /** 初期Y座標 */
    let defaultY = -1;

    /**
     * タッチデバイス判定
     * return {boolean} 判定結果
     */
    let isTouchDevice = () => window.ontouchstart === null;

    /**
     * 閾値に丸める
     * param {number} value 丸める前の値
     * param {number} threshold 閾値
     * return {number} 丸めた後の値
     */
    let roundToThreshold = (value, threshold) => {
        let result;

        if (value > threshold) {
            result = threshold;
        } else if (value < threshold * -1) {
            result = threshold * -1;
        } else {
            result = value
        }

        return result;
    };

    const VirtualPad = $("#VirtualPad");

    /**
     * バーチャルパッドベース作画
     * param {number} x X座標
     * param {number} y Y座標
     */
    let drawVirtualPadBase = (x, y) => {

        VirtualPad
            .drawRect({
                layer: true,
                name: 'FrameRect',
                groups: ['VirtualPadBase'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                fillStyle: 'rgba(255, 255, 255, 0.5)',
                strokeWidth: 1,
                cornerRadius: STICK_RADIUS,
                x: x - VirtualPad.offset().left - STICK_THRESHOLD - STICK_RADIUS,
                y: y - VirtualPad.offset().top - STICK_THRESHOLD - STICK_RADIUS,
                width: STICK_THRESHOLD * 2 + STICK_RADIUS * 2,
                height: STICK_THRESHOLD * 2 + STICK_RADIUS * 2
            })
            .drawArc({
                layer: true,
                name: 'CenterCircle',
                groups: ['VirtualPadBase'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                radius: STICK_RADIUS,
                x: x - VirtualPad.offset().left - STICK_RADIUS,
                y: y - VirtualPad.offset().top - STICK_RADIUS
            })// 枠の四角
            .drawLine({
                layer: true,
                name: 'TopLine',
                groups: ['VirtualPadBase'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                rounded: true,
                x1: x - VirtualPad.offset().left,
                y1: y - VirtualPad.offset().top - STICK_THRESHOLD,
                x2: x - VirtualPad.offset().left,
                y2: y - VirtualPad.offset().top - STICK_THRESHOLD - STICK_RADIUS
            }) // 上線
            .drawLine({
                layer: true,
                name: 'BottomLine',
                groups: ['VirtualPadBase'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                rounded: true,
                x1: x - VirtualPad.offset().left,
                y1: y - VirtualPad.offset().top + STICK_THRESHOLD,
                x2: x - VirtualPad.offset().left,
                y2: y - VirtualPad.offset().top + STICK_THRESHOLD + STICK_RADIUS,
            }) // 下線
            .drawLine({
                layer: true,
                name: 'LeftLine',
                groups: ['VirtualPadBase'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                rounded: true,
                x1: x - VirtualPad.offset().left - STICK_THRESHOLD,
                y1: y - VirtualPad.offset().top,
                x2: x - VirtualPad.offset().left - STICK_THRESHOLD - STICK_RADIUS,
                y2: y - VirtualPad.offset().top
            })  // 左線
            .drawLine({
                layer: true,
                name: 'RightLine',
                groups: ['VirtualPadBase'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                rounded: true,
                x1: x - VirtualPad.offset().left + STICK_THRESHOLD,
                y1: y - VirtualPad.offset().top,
                x2: x - VirtualPad.offset().left + STICK_THRESHOLD + STICK_RADIUS,
                y2: y - VirtualPad.offset().top
            }); // 右線

        // バーチャルパッドスティック作画
        drawVirtualPadStick(x, y);
    };

    /**
     * バーチャルパッドスティック作画
     * param {number} x X座標
     * param {number} y Y座標
     */
    let drawVirtualPadStick = (x, y) => {
        VirtualPad
            .removeLayerGroup("VirtualPadStick")
            .drawLayers()
            .drawArc({
                layer: true,
                name: 'StickCircle',
                groups: ['VirtualPadStick'],
                strokeStyle: 'rgba(0, 0, 0, 0.5)',
                fillStyle: 'rgba(0, 0, 0, 0.5)',
                strokeWidth: 1,
                radius: STICK_RADIUS,
                x: x - VirtualPad.offset().left - STICK_RADIUS,
                y: y - VirtualPad.offset().top - STICK_RADIUS
            }); // スティックの円
    };

    /**
     * バーチャルパットクリア
     */
    let clearVirtualPad = () => {
        VirtualPad
            .removeLayerGroup("VirtualPadBase")
            .removeLayerGroup("VirtualPadStick")
            .drawLayers();
    };

    /**
     * ロード、画面回転、サイズ変更
     */
    $(window).on("load orientationchange resize", () => {
        // バーチャルパッド用キャンバスを画面サイズに合わせる
        VirtualPad.get(0).width = VirtualPad.width();
        VirtualPad.get(0).height = VirtualPad.height();

        // バーチャルパッドクリア
        clearVirtualPad();
    });

    /**
     * "touchmove mousemove"のイベント
     */
    let move;

    /**
     * 現在のパッドスティックの位置
     */
    window.padStickCurrent = {x: 0, y: 0};

    /**
     * バーチャルパッド用キャンバス上でタッチ開始、マウスダウン
     */
    VirtualPad.on("touchstart mousedown", (event) => {
        event.preventDefault();
        if (move != null || (event.touches && event.touches.length !== 1)) {
            VirtualPad.off("touchmove mousemove", move);
            move = null;

            // バーチャルパッドクリア
            clearVirtualPad();
            return
        }

        // 初期座標取得
        defaultX = isTouchDevice() ? event.changedTouches[0].pageX : event.pageX;
        defaultY = isTouchDevice() ? event.changedTouches[0].pageY : event.pageY;

        // バーチャルパッドベース作画
        drawVirtualPadBase(defaultX, defaultY);

        /**
         * バーチャルパッド用キャンバス上でタッチ移動、マウス移動
         */
        move = (event) => {
            event.preventDefault();

            // 移動後の座標取得
            let tempX = roundToThreshold(defaultX - (isTouchDevice() ? event.changedTouches[0].pageX : event.pageX), STICK_THRESHOLD);
            let tempY = roundToThreshold(defaultY - (isTouchDevice() ? event.changedTouches[0].pageY : event.pageY), STICK_THRESHOLD);

            // バーチャルパッドスティック作画
            drawVirtualPadStick(defaultX - tempX, defaultY - tempY);
            padStickCurrent.x = tempX;
            padStickCurrent.y = tempY;
        };
        VirtualPad.on("touchmove mousemove", move);

        /**
         * バーチャルパッド用キャンバス上でタッチ終了、マウスアップ、マウスが離れた
         */
        VirtualPad.on("touchend mouseup mouseleave", (event) => {
            event.preventDefault();

            VirtualPad.off("touchmove mousemove", move);
            move = null;

            padStickCurrent.x = 0;
            padStickCurrent.y = 0;

            // バーチャルパッドクリア
            clearVirtualPad();
        });
    });
})();
