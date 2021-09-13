let logger = (()=> {
    let element = document.getElementById('log');
    return (text) => {
        console.log(text);
        element.textContent = element.textContent +  "\n" + text;
    }
})();


{
    let element = document.getElementById('touch');

    let currentTouchId = null;

    element.addEventListener("touchstart", (e) => {
        const current = e.changedTouches[0];

        if (!currentTouchId) {
            currentTouchId = current.identifier;
        }
    });

    element.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const current = e.changedTouches[0];

        if (current.identifier === currentTouchId) {
            const x = current.pageX - element.offsetLeft;
            const y = current.pageY - element.offsetTop;
            logger(`moved: ${x}, ${y}`);
        }
    });

    element.addEventListener("touchend", (e) => {
        const current = e.changedTouches[0];

        if (current.identifier === currentTouchId) {
            const x = current.pageX - element.offsetLeft;
            const y = current.pageY - element.offsetTop;
            currentTouchId = null;
            logger(`removed: ${x}, ${y}`);
        }
    });
}

{
    document.addEventListener("keydown", (e) => {
        logger(`keydown: ${e.which} ${e.code}`);
    });
    document.addEventListener("keyup", (e) => {
        logger(`keyup: ${e.which} ${e.code}`);
    });
}
