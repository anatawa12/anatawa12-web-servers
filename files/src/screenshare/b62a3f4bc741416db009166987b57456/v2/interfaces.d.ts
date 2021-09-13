
/*
 status
 no_tap
     add 1 -> one_tap
 one_tap
     0.5s -> mouseDown(0); long_tap
     add ? -> two_tap
     move -> mouseMove(move_diff); mouse_move
     remove 1 -> mouseClick(0); no_tap
 mouse_move
     move -> mouseMove(move_diff);
     remove all -> no_tap
 long_tap
     move -> mouseMove(move_diff);
     remove all -> mouseUp(0); no_tap
 two_tap
     move -> mouseScroll(move_diff); scroll
     pinch -> desktopSize*=size; pinch
     add 1 -> pinch
     remove 1 -> pinch_one
 pinch
     pinch -> desktopSize*=size
     remove to 1 -> pinch_one
 pinch_one
     add 1 -> pinch
     remove 1 -> no_tap
 scroll
     move -> mouseScroll(move_diff); scroll
     remove all -> no_tap
 */
type Status = "no_tap"|"one_tap"|"mouse_move"|"long_tap"|"two_tap"|"pinch"|"pinch_one"|"scroll"

type Action = Add | Revmove | Timer | Move | Pinch;

interface Add {
    type: "add"
    touches: TouchList
}

interface Revmove {
    type: "remove"
    touches: TouchList
}

interface Timer {
    type: "timer"
}

interface Move {
    type: "move"
    touches: TouchList
    x: number
    y: number
}

interface Pinch {
    type: "pinch"
    touches: TouchList
    scale: number
}

// api

interface APIEntry {
    offer: string;
    answer: string;
    iceServers: RTCIceServer[];
}
