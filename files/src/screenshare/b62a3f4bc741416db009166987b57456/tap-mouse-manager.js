/// <reference path="interfaces.d.ts" />

(() => {
    /** @type Status */
    let status = "no_tap";

    const run = (/** Action */action) => {
        switch (status) {
            case "no_tap":
                switch (action.type) {
                    case "add":
                        status = "one_tap";
                        timer();
                        break;
                }
                break;
            case "one_tap":
                resetTimer();
                switch (action.type) {
                    case "timer":
                        mouseDown("left");
                        status = "long_tap";
                        break;
                    case "add":
                        status = "two_tap";
                        break;
                    case "move":
                        mouseMove(action.x, action.y);
                        status = "mouse_move";
                        break;
                    case "remove":
                        mouseClick("left");
                        status = "no_tap";
                        break;
                }
                break;
            case "mouse_move":
                switch (action.type) {
                    case "move":
                        mouseMove(action.x, action.y);
                        break;
                    case "remove":
                        if (action.touches.length === 0) {
                            status = "no_tap";
                        }
                        break;
                }
                break;
            case "long_tap":
                switch (action.type) {
                    case "move":
                        mouseDrag(action.x, action.y);
                        break;
                    case "remove":
                        if (action.touches.length === 0) {
                            mouseUp("left");
                            status = "no_tap";
                        }
                        break;
                }
                break;
            case "two_tap":
                switch (action.type) {
                    case "move":
                        mouseScroll(action.x, action.y);
                        status = "scroll";
                        break;
                    case "pinch":
                        desktopSize *= action.scale;
                        status = "pinch";
                        break;
                    case "add":
                        status = "pinch";
                        break;
                    case "remove":
                        status = "pinch_one";
                        break;
                }
                break;
            case "pinch":
                switch (action.type) {
                    case "pinch":
                        desktopSize *= action.scale;
                        break;
                    case "remove":
                        if (action.touches.length <= 1) {
                            status = "pinch_one";
                        }
                        break;
                }
                break;
            case "pinch_one":
                switch (action.type) {
                    case "add":
                        status = "pinch";
                        break;
                    case "remove":
                        status = "no_tap";
                        break;
                }
                break;
            case "scroll":
                switch (action.type) {
                    case "move":
                        mouseScroll(action.x, action.y);
                        status = "scroll";
                        break;
                    case "remove":
                        if (action.touches.length === 0) {
                            status = "no_tap";
                        }
                        break;
                }
                break;
        }
    };

    let timerId;
    function timer() {
        timerId = setTimeout(() => {
            run({ type: "timer" })
        }, 500);
    }

    function resetTimer() {
        clearTimeout(timerId)
    }

    const display = $("#display");

    display.on("touchstart", (event) => {
        event.preventDefault();
        for (let i = 0; i < event.changedTouches.length; i++) {
            run({ type: "add", touches: event.targetTouches})
        }
    });

    const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

    /**
     * @type { Object<number, {x: number, y: number}> }
     */
    let lastTouches = Object.create(null);
    /** @type "start" | "move" | "pinch" */
    let touchMoveMode = "start";
    /** @type { {x: number, y: number} | number | null } */
    let lastData;
    display.on("touchmove", (event) => {
        event.preventDefault();

        const touches = Array.prototype.map.call(event.targetTouches, (touch) => ({x: touch.screenX, y: touch.screenY}));
        if (touchMoveMode === "start") {
            for (let i = 0; i < event.targetTouches.length; i++) {
                const touch = event.targetTouches[i];
                if (!lastTouches[touch.identifier]) {
                    lastTouches[touch.identifier] = {x: touch.screenX, y: touch.screenY}
                }
            }
            if (touches.length === 1) {
                const token = event.targetTouches[0];
                if (distance(lastTouches[token.identifier], touches[0]) > 10) {
                    touchMoveMode = "move"
                }
            } else {
                if (touches.filter((v, i) => distance(lastTouches[event.targetTouches[i].identifier], v) > 10).length !== 0) {
                    const oToken0 = lastTouches[event.targetTouches[0].identifier];
                    const oToken1 = lastTouches[event.targetTouches[1].identifier];
                    const nToken0 = touches[0];
                    const nToken1 = touches[1];

                    const oLength = distance(oToken0, oToken1);
                    const nLength = distance(nToken0, nToken1);

                    if (Math.abs(oLength - nLength) < 10) {
                        touchMoveMode = "move"
                    } else {
                        touchMoveMode = "pinch"
                    }
                }
            }

            if (touchMoveMode !== "start") {
                lastTouches = Object.create(null)
            }
        }

        switch (touchMoveMode) {
            case "move": {
                const sum = touches.reduce((prev, cur) => ({x: prev.x + cur.x, y: prev.y + cur.y}));
                const curCenter = {x: sum.x / touches.length, y: sum.y / touches.length};
                if (lastData) {
                    run({
                        type: "move",
                        touches: event.targetTouches,
                        x: lastData.x - curCenter.x,
                        y: lastData.y - curCenter.y,
                    })
                }
                lastData = {
                    x: curCenter.x,
                    y: curCenter.y,
                };
                break;
            }
            case "pinch": {
                const sum = touches.reduce((prev, cur) => ({x: prev.x + cur.x, y: prev.y + cur.y}));
                const curCenter = {x: sum.x / touches.length, y: sum.y / touches.length};
                const cur = touches.reduce((prev, cur) => (prev || 0) + distance(cur, curCenter), 0) / touches.length;
                if (lastData) {
                    run({
                        type: "pinch",
                        touches: event.targetTouches,
                        scale: cur / lastData,
                    })
                }
                lastData = cur;
                break;
            }
        }
    });

    display.on("touchend", (event) => {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
            run({ type: "remove", touches: event.targetTouches})
        }

        if (event.targetTouches.length === 0) {
            touchMoveMode = "start";
            lastData = null;
        }
    });

})();

function mouseDown(/** "left"|"middle"|"right" */mouse) {
    addLog("mouseDown: " + mouse);
    sendMsg({type: "mouse-down", button: mouse});
}

function mouseUp(/** "left"|"middle"|"right" */mouse) {
    addLog("mouseUp: " + mouse);
    sendMsg({type: "mouse-up", button: mouse});
}

function mouseClick(/** "left"|"middle"|"right" */mouse) {
    addLog("mouseClick: " + mouse);
    sendMsg({type: "mouse-click", button: mouse});
}

function mouseMove(/** number */moveX, /** number */moveZ) {
    setMouse(mouseX - moveX / desktopSize, mouseY - moveZ / desktopSize);
    sendMsg({type: "mouse-move", toX: Math.floor(mouseX), toY: Math.floor(mouseY)});
}

function mouseDrag(/** number */moveX, /** number */moveZ) {
    setMouse(mouseX - moveX / desktopSize, mouseY - moveZ / desktopSize);
    sendMsg({type: "mouse-drag", toX: Math.floor(mouseX), toY: Math.floor(mouseY)});
}

function mouseScroll(/** number */moveX, /** number */moveZ) {
    //addLog("mouseScroll: " + moveX + ", " + moveZ);
    sendMsg({type: "mouse-scroll", x: moveX, y: moveZ});
}
