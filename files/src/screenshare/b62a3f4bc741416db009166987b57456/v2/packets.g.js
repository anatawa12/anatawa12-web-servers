// Code generated; DO NOT EDIT.

const ServerErrorId = 0x00
const ClientErrorId = 0x00
const PingId = 0xf1
const PongId = 0xf1
const ClientHelloId = 0x01
const ServerHelloId = 0x01
const UserAndPassId = 0x02
const AuthSuccessfulId = 0x02
const MoveMouseId = 0x10
const MouseGoToId = 0x11
const KeyToggleId = 0x12
const MouseScrollId = 0x13
const UpdateReactsId = 0x10
const MouseIsNowId = 0x11
const RequestGetClipboardId = 0x20
const ResponseGetClipboardId = 0x20
const RequestSetClipboardId = 0x21
const ResponseSetClipboardId = 0x21

// packet to client
class ServerError extends ReceivingPacket {
	/**
	 * @param {ErrorId} id
	 * @param {string} msg
	 */
	constructor(
		id,
		msg,
	) {
		super();
		/** @type {ErrorId} */
		this.id = id;
		/** @type {string} */
		this.msg = msg;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ServerError}
	 */
	static readBody(r) {
		return new ServerError(
			ErrorId.readBody(r),
			r.readString8(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		this.id.writeBody(w);
		w.writeString8(this.msg);
	}

	get id() {
		return ServerErrorId
	}
}

// packet to server
class ClientError extends SendingPacket {
	/**
	 * @param {ErrorId} id
	 * @param {string} msg
	 */
	constructor(
		id,
		msg,
	) {
		super();
		/** @type {ErrorId} */
		this.id = id;
		/** @type {string} */
		this.msg = msg;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ClientError}
	 */
	static readBody(r) {
		return new ClientError(
			ErrorId.readBody(r),
			r.readString8(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		this.id.writeBody(w);
		w.writeString8(this.msg);
	}

	get id() {
		return ClientErrorId
	}
}

// enum
class ErrorId {
	/**
	 * @param {number} data
	 */
	constructor(data) {
		/** @type {number} */
		this.data = data;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ErrorId}
	 */
	static readBody(r) {
		const base = r.readU16();
		return new ErrorId(base);
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU16(this.data);
	}

	toString() {
		switch (this.data) {
			case ProtocolVersionMismatch.data:
				return "protocol_version_mismatch"
			case AuthFailed.data:
				return "auth_failed"
			case UnexpectedPacket.data:
				return "unexpected_packet"
			default:
				return `unknown(${("00"+this.data.toString(16)).substring(-2)})`;
		}
	}
}

const ProtocolVersionMismatch = new ErrorId(0x0001)
const AuthFailed = new ErrorId(0x0002)
const UnexpectedPacket = new ErrorId(0x0003)
// packet to server
class Ping extends SendingPacket {
	/**
	 */
	constructor(
	) {
		super();
	}

	/**
	 * @param r {PacketReader}
	 * @return {Ping}
	 */
	static readBody(r) {
		return new Ping(
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
	}

	get id() {
		return PingId
	}
}

// packet to client
class Pong extends ReceivingPacket {
	/**
	 */
	constructor(
	) {
		super();
	}

	/**
	 * @param r {PacketReader}
	 * @return {Pong}
	 */
	static readBody(r) {
		return new Pong(
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
	}

	get id() {
		return PongId
	}
}

// packet to server
class ClientHello extends SendingPacket {
	/**
	 * @param {number} major
	 * @param {number} minor
	 * @param {string} userAgent
	 */
	constructor(
		major,
		minor,
		userAgent,
	) {
		super();
		/** @type {number} */
		this.major = major;
		/** @type {number} */
		this.minor = minor;
		/** @type {string} */
		this.userAgent = userAgent;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ClientHello}
	 */
	static readBody(r) {
		return new ClientHello(
			r.readU16(),
			r.readU16(),
			r.readString8(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU16(this.major);
		w.writeU16(this.minor);
		w.writeString8(this.userAgent);
	}

	get id() {
		return ClientHelloId
	}
}

// packet to client
class ServerHello extends ReceivingPacket {
	/**
	 * @param {number} major
	 * @param {number} minor
	 * @param {string} userAgent
	 * @param {ServerHelloFlags} flags
	 */
	constructor(
		major,
		minor,
		userAgent,
		flags,
	) {
		super();
		/** @type {number} */
		this.major = major;
		/** @type {number} */
		this.minor = minor;
		/** @type {string} */
		this.userAgent = userAgent;
		/** @type {ServerHelloFlags} */
		this.flags = flags;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ServerHello}
	 */
	static readBody(r) {
		return new ServerHello(
			r.readU16(),
			r.readU16(),
			r.readString8(),
			ServerHelloFlags.readBody(r),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU16(this.major);
		w.writeU16(this.minor);
		w.writeString8(this.userAgent);
		this.flags.writeBody(w);
	}

	get id() {
		return ServerHelloId
	}
}

// flags
class ServerHelloFlags {
	/**
	 * @param {number} data
	 */
	constructor(data) {
		/** @type {number} */
		this.data = data;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ServerHelloFlags}
	 */
	static readBody(r) {
		const base = r.readU8();
		return new ServerHelloFlags(base);
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU8(this.data);
	}

	/**
	 * @param b {boolean}
	 * @return {ServerHelloFlags}
	 */
	withAuthRequired(b) {
		if (b) {
			return new ServerHelloFlags(this.data | AuthRequired.data);
		} else {
			return new ServerHelloFlags(this.data & ~AuthRequired.data);
		}
	}

	/**
	 * @return {boolean}
	 */
	isAuthRequired() {
		return (this.data & AuthRequired.data) !== 0;
	}
}
ServerHelloFlags.empty = new ServerHelloFlags(0);

const AuthRequired = new ServerHelloFlags(0x01)
// packet to server
class UserAndPass extends SendingPacket {
	/**
	 * @param {string} user
	 * @param {string} pass
	 */
	constructor(
		user,
		pass,
	) {
		super();
		/** @type {string} */
		this.user = user;
		/** @type {string} */
		this.pass = pass;
	}

	/**
	 * @param r {PacketReader}
	 * @return {UserAndPass}
	 */
	static readBody(r) {
		return new UserAndPass(
			r.readString8(),
			r.readString8(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeString8(this.user);
		w.writeString8(this.pass);
	}

	get id() {
		return UserAndPassId
	}
}

// packet to client
class AuthSuccessful extends ReceivingPacket {
	/**
	 */
	constructor(
	) {
		super();
	}

	/**
	 * @param r {PacketReader}
	 * @return {AuthSuccessful}
	 */
	static readBody(r) {
		return new AuthSuccessful(
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
	}

	get id() {
		return AuthSuccessfulId
	}
}

// packet to server
class MoveMouse extends SendingPacket {
	/**
	 * @param {number} mouseOffsetX
	 * @param {number} mouseOffsetY
	 */
	constructor(
		mouseOffsetX,
		mouseOffsetY,
	) {
		super();
		/** @type {number} */
		this.mouseOffsetX = mouseOffsetX;
		/** @type {number} */
		this.mouseOffsetY = mouseOffsetY;
	}

	/**
	 * @param r {PacketReader}
	 * @return {MoveMouse}
	 */
	static readBody(r) {
		return new MoveMouse(
			r.readS16(),
			r.readS16(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeS16(this.mouseOffsetX);
		w.writeS16(this.mouseOffsetY);
	}

	get id() {
		return MoveMouseId
	}
}

// packet to server
class MouseGoTo extends SendingPacket {
	/**
	 * @param {number} mouseAtX
	 * @param {number} mouseAtY
	 */
	constructor(
		mouseAtX,
		mouseAtY,
	) {
		super();
		/** @type {number} */
		this.mouseAtX = mouseAtX;
		/** @type {number} */
		this.mouseAtY = mouseAtY;
	}

	/**
	 * @param r {PacketReader}
	 * @return {MouseGoTo}
	 */
	static readBody(r) {
		return new MouseGoTo(
			r.readS16(),
			r.readS16(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeS16(this.mouseAtX);
		w.writeS16(this.mouseAtY);
	}

	get id() {
		return MouseGoToId
	}
}

// packet to server
class KeyToggle extends SendingPacket {
	/**
	 * @param {number} key
	 * @param {KeyToggleFlags} flags
	 */
	constructor(
		key,
		flags,
	) {
		super();
		/** @type {number} */
		this.key = key;
		/** @type {KeyToggleFlags} */
		this.flags = flags;
	}

	/**
	 * @param r {PacketReader}
	 * @return {KeyToggle}
	 */
	static readBody(r) {
		return new KeyToggle(
			r.readU8(),
			KeyToggleFlags.readBody(r),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU8(this.key);
		this.flags.writeBody(w);
	}

	get id() {
		return KeyToggleId
	}
}

// flags
class KeyToggleFlags {
	/**
	 * @param {number} data
	 */
	constructor(data) {
		/** @type {number} */
		this.data = data;
	}

	/**
	 * @param r {PacketReader}
	 * @return {KeyToggleFlags}
	 */
	static readBody(r) {
		const base = r.readU16();
		return new KeyToggleFlags(base);
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU16(this.data);
	}

	/**
	 * @param b {boolean}
	 * @return {KeyToggleFlags}
	 */
	withIsDown(b) {
		if (b) {
			return new KeyToggleFlags(this.data | IsDown.data);
		} else {
			return new KeyToggleFlags(this.data & ~IsDown.data);
		}
	}

	/**
	 * @return {boolean}
	 */
	isIsDown() {
		return (this.data & IsDown.data) !== 0;
	}
}
KeyToggleFlags.empty = new KeyToggleFlags(0);

const IsDown = new KeyToggleFlags(0x0001)
// packet to server
class MouseScroll extends SendingPacket {
	/**
	 * @param {number} offsetX
	 * @param {number} offsetY
	 */
	constructor(
		offsetX,
		offsetY,
	) {
		super();
		/** @type {number} */
		this.offsetX = offsetX;
		/** @type {number} */
		this.offsetY = offsetY;
	}

	/**
	 * @param r {PacketReader}
	 * @return {MouseScroll}
	 */
	static readBody(r) {
		return new MouseScroll(
			r.readS16(),
			r.readS16(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeS16(this.offsetX);
		w.writeS16(this.offsetY);
	}

	get id() {
		return MouseScrollId
	}
}

// packet to client
class UpdateReacts extends ReceivingPacket {
	/**
	 * @param {number} width
	 * @param {number} height
	 * @param {UpdateImage[]} images
	 */
	constructor(
		width,
		height,
		images,
	) {
		super();
		/** @type {number} */
		this.width = width;
		/** @type {number} */
		this.height = height;
		/** @type {UpdateImage[]} */
		this.images = images;
	}

	/**
	 * @param r {PacketReader}
	 * @return {UpdateReacts}
	 */
	static readBody(r) {
		return new UpdateReacts(
			r.readU16(),
			r.readU16(),
			listReadingHelper(
				r.readU16(),
				() => UpdateImage.readBody(r),
			),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU16(this.width);
		w.writeU16(this.height);
		w.writeU16(this.images.length);
		for (const d of this.images) {
			d.writeBody(w);
		}
	}

	get id() {
		return UpdateReactsId
	}
}

// struct
class UpdateImage extends Object {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {Uint8Array} image
	 */
	constructor(
		x,
		y,
		image,
	) {
		super();
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
		/** @type {Uint8Array} */
		this.image = image;
	}

	/**
	 * @param r {PacketReader}
	 * @return {UpdateImage}
	 */
	static readBody(r) {
		return new UpdateImage(
			r.readU8(),
			r.readU8(),
			r.readBlob(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU8(this.x);
		w.writeU8(this.y);
		w.writeBlob(this.image);
	}
}

// packet to client
class MouseIsNow extends ReceivingPacket {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(
		x,
		y,
	) {
		super();
		/** @type {number} */
		this.x = x;
		/** @type {number} */
		this.y = y;
	}

	/**
	 * @param r {PacketReader}
	 * @return {MouseIsNow}
	 */
	static readBody(r) {
		return new MouseIsNow(
			r.readU16(),
			r.readU16(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU16(this.x);
		w.writeU16(this.y);
	}

	get id() {
		return MouseIsNowId
	}
}

// packet to server
class RequestGetClipboard extends SendingPacket {
	/**
	 */
	constructor(
	) {
		super();
	}

	/**
	 * @param r {PacketReader}
	 * @return {RequestGetClipboard}
	 */
	static readBody(r) {
		return new RequestGetClipboard(
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
	}

	get id() {
		return RequestGetClipboardId
	}
}

// packet to client
class ResponseGetClipboard extends ReceivingPacket {
	/**
	 * @param {string} data
	 * @param {number} kind
	 */
	constructor(
		data,
		kind,
	) {
		super();
		/** @type {string} */
		this.data = data;
		/** @type {number} */
		this.kind = kind;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ResponseGetClipboard}
	 */
	static readBody(r) {
		return new ResponseGetClipboard(
			r.readString32(),
			r.readU8(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeString32(this.data);
		w.writeU8(this.kind);
	}

	get id() {
		return ResponseGetClipboardId
	}
}

// packet to server
class RequestSetClipboard extends SendingPacket {
	/**
	 * @param {string} data
	 */
	constructor(
		data,
	) {
		super();
		/** @type {string} */
		this.data = data;
	}

	/**
	 * @param r {PacketReader}
	 * @return {RequestSetClipboard}
	 */
	static readBody(r) {
		return new RequestSetClipboard(
			r.readString32(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeString32(this.data);
	}

	get id() {
		return RequestSetClipboardId
	}
}

// packet to client
class ResponseSetClipboard extends ReceivingPacket {
	/**
	 * @param {number} success
	 */
	constructor(
		success,
	) {
		super();
		/** @type {number} */
		this.success = success;
	}

	/**
	 * @param r {PacketReader}
	 * @return {ResponseSetClipboard}
	 */
	static readBody(r) {
		return new ResponseSetClipboard(
			r.readU8(),
		)
	}

	/**
	 * @param w {PacketWriter}
	 */
	writeBody(w) {
		w.writeU8(this.success);
	}

	get id() {
		return ResponseSetClipboardId
	}
}

/**
 * @param bytes {ArrayBuffer}
 * @return {ReceivingPacket}
 */
const readPacket = (bytes) => {
	const reader = new PacketReader(bytes)
	const id = reader.readU8()
	switch (id) {
		case ServerErrorId:
			return ServerError.readBody(reader)
		case PongId:
			return Pong.readBody(reader)
		case ServerHelloId:
			return ServerHello.readBody(reader)
		case AuthSuccessfulId:
			return AuthSuccessful.readBody(reader)
		case UpdateReactsId:
			return UpdateReacts.readBody(reader)
		case MouseIsNowId:
			return MouseIsNow.readBody(reader)
		case ResponseGetClipboardId:
			return ResponseGetClipboard.readBody(reader)
		case ResponseSetClipboardId:
			return ResponseSetClipboard.readBody(reader)
		default:
			throw new ClientError(UnexpectedPacket, `unknown id: ${id}`)
	}
}

/**
 * @template T
 * @param count {number}
 * @param param2 {function():T}
 * @return {T[]}
 */
const listReadingHelper = (count, param2) => {
	const ary = new Array(count);
	for (let i = 0; i < count; i++) {
		ary[i] = param2()
	}
	return ary
}

