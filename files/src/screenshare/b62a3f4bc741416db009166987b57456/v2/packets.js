
class PacketReader {
    /**
     * @param {ArrayBuffer} data
     */
    constructor(data) {
        this.data = new DataView(data)
        this.offset = 0
    }

    /**
     * @return {number}
     */
    readU8() {
        return this.data.getUint8(this.newOffset(1))
    }

    /**
     * @return {number}
     */
    readU16() {
        return this.data.getUint16(this.newOffset(2))
    }

    /**
     * @return {number}
     */
    readU32() {
        return this.data.getUint32(this.newOffset(4))
    }

    /**
     * @return {number}
     */
    readS8() {
        return this.data.getInt8(this.newOffset(1))
    }

    /**
     * @return {number}
     */
    readS16() {
        return this.data.getInt16(this.newOffset(2))
    }

    /**
     * @return {number}
     */
    readS32() {
        return this.data.getInt32(this.newOffset(4))
    }

    /**
     * @return {string}
     */
    readString8() {
        const blobSize = this.readU8()
        const decoder = new TextDecoder()
        return decoder.decode(this.data.buffer.slice(this.offset, this.newOffset(blobSize)))
    }

    /**
     * @return {string}
     */
    readString32() {
        return new TextDecoder().decode(this.readBlob())
    }

    /**
     * @return {Uint8Array}
     */
    readBlob() {
        const blobSize = this.readU32()
        return new Uint8Array(this.data.buffer, this.newOffset(blobSize), blobSize)
    }

    newOffset(add) {
        const result = this.offset
        this.offset += add
        return result
    }
}

class PacketWriter {
    constructor() {
        this.data = new DataView(new ArrayBuffer(0x100))
        this.offset = 0
    }

    /**
     * @param d {number}
     */
    writeU8(d) {
        this.data.setUint8(this.newOffset(1), d)
    }

    /**
     * @param d {number}
     */
    writeU16(d) {
        this.data.setUint16(this.newOffset(2), d)
    }

    /**
     * @param d {number}
     */
    writeS32(d) {
        this.data.setInt32(this.newOffset(4), d)
    }

    /**
     * @param d {number}
     */
    writeS8(d) {
        this.data.setInt8(this.newOffset(1), d)
    }

    /**
     * @param d {number}
     */
    writeS16(d) {
        this.data.setInt16(this.newOffset(2), d)
    }

    /**
     * @param d {number}
     */
    writeS32(d) {
        this.data.setInt32(this.newOffset(4), d)
    }

    /**
     * @param d {string}
     */
    writeString8(d) {
        const encoder = new TextEncoder()
        const data = encoder.encode(d)
        this.writeU8(data.length)
        const offset = this.newOffset(data.length)
        new Uint8Array(this.data.buffer, offset).set(data)
    }

    /**
     * @param d {string}
     */
    writeString32(d) {
        this.writeBlob(new TextEncoder().encode(d))
    }

    /**
     * @param d {Uint8Array}
     */
    writeBlob(d) {
        this.writeU32(d.byteLength)
        const offset = this.newOffset(data.length)
        new Uint8Array(this.data.buffer, offset).set(d)
    }

    /**
     * @return {ArrayBuffer}
     */
    toArrayBuffer() {
        return this.data.buffer.slice(0, this.offset)
    }

    newOffset(add) {
        const result = this.offset
        this.offset += add
        while (this.data.buffer.byteLength < this.offset) {
            const oldBuffer = this.data.buffer
            const newBuffer = new ArrayBuffer(oldBuffer.byteLength * 2)
            new Uint8Array(newBuffer).set(new Uint8Array(oldBuffer))
            this.data = new DataView(newBuffer)
        }
        return result
    }
}

class Packet {
    /**
     * @type {number}
     * @abstract
     */
    get id() {}
}

/** @abstract */
class SendingPacket extends Packet {
    /**
     * @param writer {PacketWriter}
     * @abstract
     */
    writeBody(writer) {}
}

/** @abstract */
class ReceivingPacket extends Packet {
    /**
     * @param reader {PacketReader}
     * @return {ReceivingPacket}
     * @abstract
     */
    static readBody (reader) {}
}
