
/** @type { function(string):number } */
const keyNumberMap = (key) => {
    return __keyNumberMap[key]
}
/** @type { function("left"|"right"|"center"):number } */
const mouseNumberMap = (key) => {
    switch (key) {
        case "left":
            return 0xF0;
        case "right":
            return 0xF1;
        case "center":
            return 0xF2;
    }
}

const __keyNumberMap = {}
__keyNumberMap["KeyA"] = 0x01
__keyNumberMap["KeyB"] = 0x02
__keyNumberMap["KeyC"] = 0x03
__keyNumberMap["KeyD"] = 0x04
__keyNumberMap["KeyE"] = 0x05
__keyNumberMap["KeyF"] = 0x06
__keyNumberMap["KeyG"] = 0x07
__keyNumberMap["KeyH"] = 0x08
__keyNumberMap["KeyI"] = 0x09
__keyNumberMap["KeyJ"] = 0x0A
__keyNumberMap["KeyK"] = 0x0B
__keyNumberMap["KeyL"] = 0x0C
__keyNumberMap["KeyM"] = 0x0D
__keyNumberMap["KeyN"] = 0x0E
__keyNumberMap["KeyO"] = 0x0F
__keyNumberMap["KeyP"] = 0x10
__keyNumberMap["KeyQ"] = 0x11
__keyNumberMap["KeyR"] = 0x12
__keyNumberMap["KeyS"] = 0x13
__keyNumberMap["KeyT"] = 0x14
__keyNumberMap["KeyU"] = 0x15
__keyNumberMap["KeyV"] = 0x16
__keyNumberMap["KeyW"] = 0x17
__keyNumberMap["KeyX"] = 0x18
__keyNumberMap["KeyY"] = 0x19
__keyNumberMap["KeyZ"] = 0x1A
__keyNumberMap["Digit1"] = 0x1B
__keyNumberMap["Digit2"] = 0x1C
__keyNumberMap["Digit3"] = 0x1D
__keyNumberMap["Digit4"] = 0x1E
__keyNumberMap["Digit5"] = 0x1F
__keyNumberMap["Digit6"] = 0x20
__keyNumberMap["Digit7"] = 0x21
__keyNumberMap["Digit8"] = 0x22
__keyNumberMap["Digit9"] = 0x23
__keyNumberMap["Digit0"] = 0x24
__keyNumberMap["Backspace"] = 0x25
__keyNumberMap["Delete"] = 0x26
__keyNumberMap["Enter"] = 0x27
__keyNumberMap["Tab"] = 0x28
__keyNumberMap["Escape"] = 0x29
__keyNumberMap["Escape"] = 0x2A
__keyNumberMap["ArrowUp"] = 0x2B
__keyNumberMap["ArrowDown"] = 0x2C
__keyNumberMap["ArrowRight"] = 0x2D
__keyNumberMap["ArrowLeft"] = 0x2E
__keyNumberMap["Home"] = 0x2F
__keyNumberMap["End"] = 0x30
__keyNumberMap["PageUp"] = 0x31
__keyNumberMap["PageDown"] = 0x32
__keyNumberMap["F1"] = 0x33
__keyNumberMap["F2"] = 0x34
__keyNumberMap["F3"] = 0x35
__keyNumberMap["F4"] = 0x36
__keyNumberMap["F5"] = 0x37
__keyNumberMap["F6"] = 0x38
__keyNumberMap["F7"] = 0x39
__keyNumberMap["F8"] = 0x3A
__keyNumberMap["F9"] = 0x3B
__keyNumberMap["F10"] = 0x3C
__keyNumberMap["F11"] = 0x3D
__keyNumberMap["F12"] = 0x3E
__keyNumberMap["F13"] = 0x3F
__keyNumberMap["F14"] = 0x40
__keyNumberMap["F15"] = 0x41
__keyNumberMap["F16"] = 0x42
__keyNumberMap["F17"] = 0x43
__keyNumberMap["F18"] = 0x44
__keyNumberMap["F19"] = 0x45
__keyNumberMap["F20"] = 0x46
__keyNumberMap["F21"] = 0x47
__keyNumberMap["F22"] = 0x48
__keyNumberMap["F23"] = 0x49
__keyNumberMap["F24"] = 0x4A
__keyNumberMap["MetaLeft"] = 0x4C
__keyNumberMap["MetaRight"] = 0x4D
__keyNumberMap["OSLeft"] = 0x4C
__keyNumberMap["OSRight"] = 0x4D
__keyNumberMap["AltLeft"] = 0x50
__keyNumberMap["AltRight"] = 0x51
__keyNumberMap["ControlLeft"] = 0x53
__keyNumberMap["ControlRight"] = 0x54
__keyNumberMap["ShiftLeft"] = 0x57
__keyNumberMap["ShiftRight"] = 0x58
__keyNumberMap["CapsLock"] = 0x5A
__keyNumberMap["Space"] = 0x5B
__keyNumberMap["PrintScreen"] = 0x5D
__keyNumberMap["Insert"] = 0x5E
__keyNumberMap["Help"] = 0x5E
__keyNumberMap["ContextMenu"] = 0x5F
__keyNumberMap["AudioVolumeMute"] = 0x60
__keyNumberMap["AudioVolumeDown"] = 0x61
__keyNumberMap["AudioVolumeUp"] = 0x62
__keyNumberMap["MediaTrackPrevious"] = 0x66
__keyNumberMap["MediaTrackNext"] = 0x67
__keyNumberMap["Numpad0"] = 0x6C
__keyNumberMap["Numpad1"] = 0x6D
__keyNumberMap["Numpad2"] = 0x6E
__keyNumberMap["Numpad3"] = 0x6F
__keyNumberMap["Numpad4"] = 0x70
__keyNumberMap["Numpad5"] = 0x71
__keyNumberMap["Numpad6"] = 0x72
__keyNumberMap["Numpad7"] = 0x73
__keyNumberMap["Numpad8"] = 0x74
__keyNumberMap["Numpad9"] = 0x75
__keyNumberMap["NumLock"] = 0x76
__keyNumberMap["NumpadDecimal"] = 0x77
__keyNumberMap["NumpadAdd"] = 0x78
__keyNumberMap["NumpadSubtract"] = 0x79
__keyNumberMap["NumpadMultiply"] = 0x7A
__keyNumberMap["NumpadDivide"] = 0x7B
__keyNumberMap["NumpadEnter"] = 0x7D
__keyNumberMap["NumpadEqual"] = 0x7E
