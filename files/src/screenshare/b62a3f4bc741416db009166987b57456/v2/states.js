
class State {
    /**
     * @param ctx {Context}
     */
    constructor(ctx) {
        this.ctx = ctx
    }

    /**
     * @param packet {ReceivingPacket}
     * @return {[SendingPacket|null, State|null]}
     * @abstract
     */
    onMessage(packet) {}
}

class WaitingServerHello extends State {
    /**
     * @param ctx {Context}
     */
    constructor(ctx) {
        super(ctx);
    }

    onMessage(packet) {
        if (!(packet instanceof ServerHello)) throw new ServerError(UnexpectedPacket, "ServerHello expected")
        if (packet.major !== 0) throw new ServerError(ProtocolVersionMismatch, "major version 0 is supported")
        if (packet.minor > 0) throw new ServerError(ProtocolVersionMismatch, "minor version 0 or younger is supported")
        /** @type SendingPacket[] */
        if ((packet.flags & AuthRequired) !== 0) {
            return [new UserAndPass("", ""), new WaitingAuthSuccessful(this.ctx)]
        } else {
            return [null, new NormalConnecting(this.ctx)]
        }
    }
}

class WaitingAuthSuccessful extends State {
    /**
     * @param ctx {Context}
     */
    constructor(ctx) {
        super(ctx);
    }

    onMessage(packet) {
        if (!(packet instanceof AuthSuccessful)) throw new ServerError(UnexpectedPacket, "AuthSuccessful expected")
        return [null, new NormalConnecting(this.ctx)]
    }
}

class NormalConnecting extends State {
    /**
     * @param ctx {Context}
     */
    constructor(ctx) {
        super(ctx);
    }

    onMessage(packet) {
        if (packet instanceof UpdateReacts) {
            this.ctx.processUpdateImage(packet)
            return [null, null]
        } else if (packet instanceof Pong) {
            if (onPong) onPong()
        } else if (packet instanceof ResponseGetClipboard) {
            if (packet.kind === 0)
                addLog("get clipboard failed")
            else
            if (onClipboard) onClipboard(packet.data)
        } else if (packet instanceof ResponseSetClipboard) {
            if (packet.success === 0)
                addLog("set clipboard failed")
            else
                addLog("set clipboard succeed")
        } else if (packet instanceof MouseIsNow) {
            setMouse(packet.x, packet.y)
        }
        else {
            throw new ServerError(UnexpectedPacket, "UpdateReacts expected")
        }
    }
}
