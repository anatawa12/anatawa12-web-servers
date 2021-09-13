const startWebrtc = async (/** string */apiEntryUrl) => {
    const startStatus = $("#start-status").text("getting entry")

    startStatus.text("getting entry")
    const entryReq = await fetch(apiEntryUrl);
    if (entryReq.status !== 200) return alert("entry can't get. status: " + entryReq.status);
    /** @type APIEntry */
    const apiEntry = await entryReq.json();

    startStatus.text("getting offer")

    const offerReq = await fetch(apiEntry.offer);
    if (offerReq.status !== 200) return alert("offer not can't get. status: " + offerReq.status);
    const remoteOffer = await offerReq.text();

    startStatus.text("got offer")

    /**
     * @type {RTCConfiguration}
     */
    const pcConfig = {
        iceServers: apiEntry.iceServers,
    };
    const conn = new RTCPeerConnection(pcConfig);

    // noinspection ES6MissingAwait
    await conn.setRemoteDescription({sdp: remoteOffer, type: "offer"});

    const dataChannelPromise = new Promise((resolve) => {conn.ondatachannel = (e) => { resolve(e.channel) } });

    {
        startStatus.text("making answer")

        const answerPromise = new Promise((resolve, reject) => {
            // ICE Candidateを収集したときのイベント
            conn.onicecandidate = evt => {
                if (evt.candidate) {
                    console.log(evt.candidate);
                } else {
                    console.log('empty ice event');
                    resolve(conn.localDescription);
                }
            };
        })
        const answerCreated = await conn.createAnswer();

        // noinspection ES6MissingAwait
        conn.setLocalDescription(answerCreated);

        startStatus.text("waiting make answer")

        const answer = await answerPromise;

        startStatus.text("sending answer")

        const answerReq = await fetch(apiEntry.answer, {
            method: "POST",
            body: answer.sdp
        });

        if (answerReq.status !== 201) return alert("answer not can't post. status: " + answerReq.status);
    }

    startStatus.text("connecting data")

    /** @type RTCDataChannel */
    const dataChannel = await dataChannelPromise;

    startStatus.text("connected data")

    sendMsg = (msg) => {
        dataChannel.send(JSON.stringify(msg));
    };

    dataChannel.onmessage = async (e) => {
        /** @type ToJsMessage */
        const data = JSON.parse(e.data);
        switch (data.type) {
            case "offer":
                await conn.setRemoteDescription({type: "offer", sdp: data.sdp});
                const answer = await conn.createAnswer();
                await conn.setLocalDescription(answer);
                sendMsg(({type: "answer", sdp: answer.sdp}));
                break;
            case "mouse-pos":
                mouseX = data.x;
                mouseY = data.y;
                break;
            case "clipboard":
                if (onClipboard != null) {
                    onClipboard(data.data)
                } else {
                    addLog("got clipboard but no handler found");
                }
                break;
            case "log":
                addLog("(remote)" + data.data);
                break;
            case "pong":
                onPong();
                break;
        }
    };

    const mediaStream = await new Promise((resolve) => {conn.ontrack = (e) => { resolve(new MediaStream([e.track])) } });

    startStatus.text("connected media")

    remoteWindowImage[0].srcObject = mediaStream;

    startStatus.text("finish preparing")

    prepared();
};

const openWindow = () => {
    remoteWindowImage[0].play();

    main();
};

////////////

const prepared = () => {
    $("#start-open-button").show()
};

$("#start-button").on("click", async () => {
    const url = new URL($("#start-entry-url").val());
    url.searchParams.set("user", $("#start-entry-user").val())
    url.searchParams.set("pass", $("#start-entry-pass").val())
    $("#open-setting").remove();
    await startWebrtc(url.toString());
});

$("#start-open-button").on("click", () => {
    $("#start-view").remove();
    openWindow();
});
