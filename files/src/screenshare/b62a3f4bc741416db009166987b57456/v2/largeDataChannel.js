
(() => {
    const packetIdMask   = 0b00001111
    const firstPacketBit = 0b10000000
    const endPacketBit   = 0b01000000

    const packetKindMask = firstPacketBit | endPacketBit
    const singlePacket   = firstPacketBit | endPacketBit
    const firstPacket    = firstPacketBit
    const centerPacket   = 0
    const endPacket      = endPacketBit

    const largeDataHeaderSize = 1
    const maxMessageSize = 16*1024 - largeDataHeaderSize

    const flagsBitsMask = 0b1111
    const isStringBit   = 0b0001

    /**
     * @typedef {{flags:number, data:Uint8Array[]}} ReceivedData
     */

    /**
     *
     */
    class LargeDataMessageEvent extends Event {
        constructor(type, eventInitDict) {
            super(type, eventInitDict);
            this.data = eventInitDict.data
        }
    }

    /**
     * @param joinedData {ArrayBuffer}
     * @return {string}
     */
    function toText(joinedData) {
        return new TextDecoder().decode(joinedData);
    }

    class LargeDataChannel {
        /**
         * @param channel {RTCDataChannel}
         */
        constructor(channel) {
            this.dataChannel = channel
            channel.binaryType = "arraybuffer"
            /** @type {ReceivedData[]|null} */
            this.receivedData = new Array(16)
            this.packetId = 0
            /** @type {function(LargeDataMessageEvent):void} */
            this.onmessage = null
            channel.addEventListener("message", (e) => { this.onReceiveMessage(e) })
        }

        /**
         * @param data {ArrayBuffer}
         */
        send(data) {
            if (data.byteLength < maxMessageSize) {
                const pkt = new ArrayBuffer(data.byteLength + 1)
                const pktSetter = new Uint8Array(pkt)
                pktSetter[0] = singlePacket
                pktSetter.set(new Uint8Array(data), 1)
                return this.dataChannel.send(pkt);
            }

            const id = this.packetId++ & packetIdMask
            for (let i = 0; i < data.byteLength; i += maxMessageSize) {
                let header = id
                let sendDataLength = maxMessageSize
                if (data.byteLength < i + sendDataLength) {
                    sendDataLength = data.byteLength - i
                }
                if (i === 0) {
                    header |= firstPacketBit
                }
                if (i + maxMessageSize >= data.byteLength) {
                    header |= endPacket
                }

                const pkt = new ArrayBuffer(sendDataLength + 1)
                const pktSetter = new Uint8Array(pkt)
                pktSetter[0] = header
                pktSetter.set(new Uint8Array(data, i, sendDataLength), 1)
                this.dataChannel.send(pkt);
            }
        }

        /**
         * @param e {MessageEvent}
         */
        onReceiveMessage(e) {
            /** @type {ArrayBuffer} */
            const data = e.data
            /** @type {Uint8Array} */
            const body = new Uint8Array(data, 1)
            const header = new Uint8Array(data, 0, 1)[0]
            switch (header & packetKindMask) {
                case singlePacket: {
                    this.callOnMessage({
                        flags: header >> 2 & flagsBitsMask,
                        data: [body],
                    })
                    break
                }
                case firstPacket: {
                    const id = header & packetIdMask
                    if (this.receivedData[id] != null) {
                        throw new Error("invalid packet: packet id duplicated")
                    }
                    this.receivedData[id] = {}
                    this.receivedData[id].flags = header >> 2 & 0b1100
                    this.receivedData[id].data = [body]
                    break
                }
                case centerPacket: {
                    const id = header & packetIdMask
                    if (this.receivedData[id] == null) {
                        throw new Error("invalid packet: packet id is not allocated")
                    }
                    this.receivedData[id].data.push(body)
                     break
                }
                case endPacket: {
                    const id = header & packetIdMask
                    if (this.receivedData[id] == null) {
                        throw new Error("invalid packet: packet id is not allocated")
                    }
                    this.receivedData[id].flags |= header >> 4 & 0b0011
                    this.receivedData[id].data.push(body)
                    this.callOnMessage(this.receivedData[id])
                    this.receivedData[id] = null
                }
            }
        }

        /**
         * @param data {ReceivedData}
         */
        callOnMessage(data) {
            /** @type {ArrayBuffer} */
            let joinedData
            if (data.data.length === 1) {
                joinedData = new ArrayBuffer(data.data[0].length)
                new Uint8Array(joinedData).set(data.data[0])
            } else {
                let dataLength = 0
                for (let datum of data.data) {
                    dataLength += datum.length
                }
                const buf = new ArrayBuffer(dataLength)
                const bufSetter = new Uint8Array(buf)
                let offset = 0
                for (let datum of data.data) {
                    bufSetter.set(datum, offset)
                    offset += datum.length
                }
                joinedData = buf
            }

            const writeData = (data.flags&isStringBit) === isStringBit ? toText(joinedData) : joinedData
            const newEvent = new LargeDataMessageEvent(
                "message",
                {
                    data: writeData
                }
            )
            if (this.onmessage != null) {
                this.onmessage(newEvent)
            }
        }
    }

    window.LargeDataChannel = LargeDataChannel
    window.LargeDataMessageEvent = LargeDataMessageEvent
})()
