(() => {
    const regionSize = 128

    class Context {
        /**
         * @param canvas {HTMLCanvasElement}
         */
        constructor(canvas) {
            this.readIndex = 0

            /**
             * @type {number[][]}
             */
            this.elements = []

            /**
             * @type {RTCPeerConnection}
             */
            this.connection = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: ["stun:stun.l.google.com:19302"],
                    },
                ]
            })

            /** @type {Promise<LargeDataChannel>} */
            this.channelPromise
            /** @type {LargeDataChannel} */
            this.channel

            /** @type {State} */
            this.state

            /** @type {(function():void)[]} */
            this.disconnectPromises = []

            this.canvas = canvas
            this.ctx = canvas.getContext("2d")
        }

        /**
         * @param sdp {string}
         * @return {Promise<string>}
         */
        async startConnecting(sdp) {
            await this.connection.setRemoteDescription({type: "offer", sdp: sdp})
            this.channelPromise = new Promise((resolve) => {
                this.connection.ondatachannel = (e) => {
                    const onopen = () => {
                        const c = new LargeDataChannel(e.channel)
                        this.prepareDataChannel(c)
                        resolve(c)
                    }
                    if (e.channel.readyState !== "open")
                        e.channel.onopen = onopen
                    else
                        onopen()
                }
            });

            this.connection.oniceconnectionstatechange = (_) => {
                console.log(`ICE Connection State has changed: ${this.connection.iceConnectionState}`)
                switch (this.connection.iceConnectionState) {
                    case "failed":
                    case "closed":
                    case "disconnected":
                        this.disconnectPromises.forEach(it => it())
                        this.connection.close()
                        break;
                    case "checking":
                        break;
                    case "completed":
                        break;
                    case "connected":
                        break;
                    case "new":
                        break;
                }
            }

            const answerPromise = new Promise((resolve) => {
                // ICE Candidateを収集したときのイベント
                this.connection.onicecandidate = evt => {
                    if (evt.candidate) {
                        console.log(evt.candidate);
                    } else {
                        console.log('empty ice event');
                        resolve(this.connection.localDescription.sdp);
                    }
                };
            })
            const answerCreated = await this.connection.createAnswer();

            // noinspection ES6MissingAwait
            this.connection.setLocalDescription(answerCreated);

            return await answerPromise;
        }

        async start() {
            this.channel = await this.channelPromise
            this.sendMessage(new ClientHello(0, 0, window.navigator.userAgent))
            this.state = new WaitingServerHello(this)
        }

        async waitUntilDisconnect() {
            await new Promise(resolve => this.disconnectPromises.push(resolve))
        }

        /**
         * @param packet {UpdateReacts}
         */
        processUpdateImage(packet) {
            if (packet.width !== 0 && packet.height !== 0) {
                this.resize(packet.width, packet.height)
            }
            for (const image of packet.images) {
                const x = image.x
                const y = image.y
                const blobData = image.image

                const url = URL.createObjectURL(new Blob([blobData], { type: "image/png" }))
                const img = new Image()
                const readIndex = this.readIndex++
                img.addEventListener("load", () => {
                    if (this.elements[x][y] < readIndex) {
                        this.ctx.drawImage(img, x * regionSize, y * regionSize)
                        this.elements[x][y] = readIndex
                    }
                    URL.revokeObjectURL(url)
                })
                img.src = url
            }
        }

        /**
         * @param width {number}
         * @param height {number}
         */
        resize(width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
            const elementsX = Math.ceil(width / regionSize)
            const elementsY = Math.ceil(height / regionSize)
            while (this.elements.length < elementsX)
                this.elements.push([])
            while (this.elements.length > elementsX)
                this.elements.pop()
            for (let i = 0; i < this.elements.length; i++) {
                const line = this.elements[i];
                while (line.length < elementsY) {
                    line.push(Number.NEGATIVE_INFINITY);
                }
                while (line.length > elementsY)
                    line.pop().remove();
            }
        }

        /**
         * @param channel {LargeDataChannel}
         */
        prepareDataChannel(channel) {
            /** @param e {LargeDataMessageEvent} */
            channel.onmessage = (e) => {
                const pkt = readPacket(e.data)
                const [send, newState] = this.state.onMessage(pkt)
                if (newState != null) {
                    this.state = newState
                }
                if (send != null) {
                    this.sendMessage(send)
                }
            }
        }

        /**
         * @param packet {SendingPacket}
         */
        sendMessage(packet) {
            const writer = new PacketWriter()
            writer.writeU8(packet.id)
            packet.writeBody(writer)
            this.channel.send(writer.toArrayBuffer())
        }
    }

    window.Context = Context
})()