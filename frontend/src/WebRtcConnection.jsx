import { useEffect, useState } from "react";

const WebRtcConnection = ({video, setVideo}) => {
    // get DOM elements
    // let dataChannelLog = document.getElementById('data-channel'),
    // let iceConnectionLog = document.getElementById('ice-connection-state')
    // let iceGatheringLog = document.getElementById('ice-gathering-state')
    // let signalingLog = document.getElementById('signaling-state')

    const [pc, setPc] = useState();

    // peer connection
    // let pc = null;

    // data channel
    // let dc = null
    // let dcInterval = null;

    function createPeerConnection() {
        const config = {
            sdpSemantics: 'unified-plan',
            iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
        };

        // if (document.getElementById('use-stun').checked) {
            // config.iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];
        // }

        let localPc = new RTCPeerConnection(config);

        // // register some listeners to help debugging
        // localPc.addEventListener('icegatheringstatechange', () => {
        //     // iceGatheringLog.textContent += ' -> ' + localPc.iceGatheringState;
        //     console.log("iceGatheringLog", localPc.iceGatheringState);
        // }, false);
        // // iceGatheringLog.textContent = localPc.iceGatheringState;

        // localPc.addEventListener('iceconnectionstatechange', () => {
        //     // iceConnectionLog.textContent += ' -> ' + localPc.iceConnectionState;
        //     console.log("iceConnectionLog", localPc.iceConnectionState);
        // }, false);
        // // iceConnectionLog.textContent = localPc.iceConnectionState;
        

        // localPc.addEventListener('signalingstatechange', () => {
        //     // signalingLog.textContent += ' -> ' + localPc.signalingState;
        //     console.log("signalingLog", localPc.iceGatheringState);
        // }, false);
        // // signalingLog.textContent = localPc.signalingState;

        // // connect audio / video
        // localPc.addEventListener('track', (evt) => {
        //     // document.getElementById('video').srcObject = evt.streams[0];
        //     video.srcObject = evt.streams[0];
        // });

        return localPc;
    }

    function negotiate() {
        console.log("PC", pc);
        
        return pc.createOffer({offerToReceiveVideo: true}).then((offer) => {
            return pc.setLocalDescription(offer);
        }).then(() => {
            // wait for ICE gathering to complete
            return new Promise((resolve) => {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        if (pc.iceGatheringState === 'complete') {
                            pc.removeEventListener('icegatheringstatechange', checkState);
                            resolve();
                        }
                    }
                    pc.addEventListener('icegatheringstatechange', checkState);
                }
            });
        }).then(() => {
            let offer = pc.localDescription;
            // console.log(offer.sdp);
            
            // let codec = document.getElementById('video-codec').value;
            // let codec = 'default'
            // // let codec = 'VP8/90000'
            // if (codec !== 'default') {
            //     offer.sdp = sdpFilterCodec('video', codec, offer.sdp);
            //     console.log("TEST");
                
            // }

            // console.log("offer.sdp", offer.sdp)
            // document.getElementById('offer-sdp').textContent = offer.sdp;
            // const hostUrl = 'http://192.168.98.46:8080/offer'
            const hostUrl = 'http://127.0.0.1:8080/offer'
            return fetch(hostUrl, {
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
        }).then((response) => {
            const myResponse = response.json()
            console.log("RES", myResponse);
            
            return myResponse;
        }).then((answer) => {
            // document.getElementById('answer-sdp').textContent = answer.sdp;
            // console.log("answer.sdp", answer.sdp)

            return pc.setRemoteDescription(answer);
        }).catch((e) => {
            alert(e);
        });
    }

    const start = () => {
        console.log("Start pressed");
        
        let pc = createPeerConnection();
        setPc(pc)

        // build media constraints.
        // const constraints = {
        //     audio: false,
        //     video: true
        // };

        // acquire media and start negociation.
        // navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        //     stream.getTracks().forEach((track) => {
        //         pc.addTrack(track, stream);
        //     });
        //     return negotiate();
        // }, (err) => {
        //     alert('Could not acquire media: ' + err);
        // });
        // negotiate();

        // document.getElementById('stop').style.display = 'inline-block';
    }

    useEffect(() => {
        if (pc === undefined) return

        // register some listeners to help debugging
        pc.addEventListener('icegatheringstatechange', () => {
            
            // iceGatheringLog.textContent += ' -> ' + pc.iceGatheringState;
            console.log("iceGatheringLog", pc.iceGatheringState);
        }, false);
        // iceGatheringLog.textContent = pc.iceGatheringState;

        pc.addEventListener('iceconnectionstatechange', () => {
            // iceConnectionLog.textContent += ' -> ' + pc.iceConnectionState;
            console.log("iceConnectionLog", pc.iceConnectionState);
        }, false);
        // iceConnectionLog.textContent = pc.iceConnectionState;
        
        pc.addEventListener('signalingstatechange', () => {
            // signalingLog.textContent += ' -> ' + pc.signalingState;
            console.log("signalingLog", pc.iceGatheringState);
        }, false);
        // signalingLog.textContent = pc.signalingState;

        // connect audio / video
        pc.addEventListener('track', (evt) => {
            // document.getElementById('video').srcObject = evt.streams[0];
            console.log("TRACK RECEIVED");
            
            // video.srcObject = evt.streams[0];

            const vid = document.createElement("video");
            vid.srcObject = evt.streams[0];
            vid.crossOrigin = "anonymous";
            vid.loop = true;
            vid.muted = true;
            vid.playsInline = true;

            setVideo(vid)
        });

        console.log("NEGOTIATE");
        
        negotiate();
    }, [pc])

    const stop = () => {
        // document.getElementById('stop').style.display = 'none';

        // close data channel
        // if (dc) dc.close();

        // close transceivers
        if (pc.getTransceivers) {
            pc.getTransceivers().forEach((transceiver) => {
                if (transceiver.stop) {
                    transceiver.stop();
                }
            });
        }

        // close local audio / video
        pc.getSenders().forEach((sender) => {
            if(sender.track !== null) sender.track.stop();
        });

        // close peer connection
        setTimeout(() => {
            pc.close();
        }, 500);

        // remove video frame (hide big black box)
        setVideo(undefined)
        setPc(undefined)
    }

    function sdpFilterCodec(kind, codec, realSdp) {
        const allowed = []
        const rtxRegex = new RegExp('a=fmtp:(\\d+) apt=(\\d+)\r$');
        const codecRegex = new RegExp('a=rtpmap:([0-9]+) ' + escapeRegExp(codec))
        const videoRegex = new RegExp('(m=' + kind + ' .*?)( ([0-9]+))*\\s*$')

        const lines = realSdp.split('\n');

        let isKind = false;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ')) {
                isKind = true;
            } else if (lines[i].startsWith('m=')) {
                isKind = false;
            }

            if (isKind) {
                let match = lines[i].match(codecRegex);
                if (match) {
                    allowed.push(parseInt(match[1]));
                }

                match = lines[i].match(rtxRegex);
                if (match && allowed.includes(parseInt(match[2]))) {
                    allowed.push(parseInt(match[1]));
                }
            }
        }

        const skipRegex = 'a=(fmtp|rtcp-fb|rtpmap):([0-9]+)';
        let sdp = '';

        isKind = false;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('m=' + kind + ' ')) {
                isKind = true;
            } else if (lines[i].startsWith('m=')) {
                isKind = false;
            }

            if (isKind) {
                const skipMatch = lines[i].match(skipRegex);
                if (skipMatch && !allowed.includes(parseInt(skipMatch[2]))) {
                    continue;
                } else if (lines[i].match(videoRegex)) {
                    sdp += lines[i].replace(videoRegex, '$1 ' + allowed.join(' ')) + '\n';
                } else {
                    sdp += lines[i] + '\n';
                }
            } else {
                sdp += lines[i] + '\n';
            }
        }

        return sdp;
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    return (
        <div>
            {pc === undefined && <button id="start" onClick={() => start()}>Connect to 360° Camera</button>}
            {pc !== undefined && (<button id="stop" onClick={() => stop()}>Stop</button>)}
        </div>
    )
}

export default WebRtcConnection