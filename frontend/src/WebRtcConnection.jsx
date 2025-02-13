import { useEffect, useRef, useState } from "react";
import DemoVideo from './assets/Netlab1.mp4'
import { useVideo } from "./providers/VideoProvider";

const WebRtcConnection = ({isDemo, shouldStartStream, setVideo}) => {

    const videoRef = useVideo()
    const [pc, setPc] = useState();

    useEffect(() => {
        if(shouldStartStream === true) start()
        else stop()
    }, [shouldStartStream])

    useEffect(() => {
        if (pc === undefined) return

        // register some listeners to help debugging
        pc.addEventListener('icegatheringstatechange', () => {
            console.log("iceGatheringLog", pc.iceGatheringState);
        }, false);

        pc.addEventListener('iceconnectionstatechange', () => {
            console.log("iceConnectionLog", pc.iceConnectionState);
        }, false);
        
        pc.addEventListener('signalingstatechange', () => {
            console.log("signalingLog", pc.iceGatheringState);
        }, false);

        // connect video
        pc.addEventListener('track', (evt) => {
            console.log("TRACK RECEIVED");

            if(videoRef.current) {
                console.log("Filling Video Stream");
                videoRef.current.srcObject = evt.streams[0];
                videoRef.current.crossOrigin = "anonymous";
                videoRef.current.loop = true;
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;

                videoRef.current.play()
            }
        });

        negotiate();
    }, [pc])

    const createPeerConnection = () => {
        // const config = {
        //     sdpSemantics: 'unified-plan',
        //     iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
        // };

        const config = {
            iceServers: [
            //   { urls: "stun:stun.l.google.com:19302" },
            //   { urls: "turn:your-turn-server.com", username: "user", credential: "password" }
            ],
            iceCandidatePoolSize: 10,
            iceTransportPolicy: "all"
        };

        let localPc = new RTCPeerConnection(config);

        return localPc;
    }

    const negotiate = () => {
        console.log("Negotiate: PC", pc);
        
        return pc.createOffer({offerToReceiveVideo: true}).then((offer) => {
            // remove potential problematic UDP candidates
            offer.sdp = offer.sdp.replace(/a=candidate:(.*) UDP 9\d{4} .*/g, "");
            return pc.setLocalDescription(offer);
        }).then(() => {
            // wait for ICE gathering to complete
            return new Promise((resolve) => {
                if (pc.iceGatheringState === 'complete') {
                    resolve();
                } else {
                    function checkState() {
                        console.log("CHECK STATE", pc.iceGatheringState);
                        
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

            // const hostUrl = 'http://192.168.185.46:8080/offer'
            // const hostUrl = 'http://127.0.0.1:8080/offer'
            const hostUrl = 'http://192.168.3.204:8080/offer'
            console.log('HostUrl:', hostUrl);
            
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
            return pc.setRemoteDescription(answer);
        }).catch((e) => {
            alert(e);
        });
    }

    const start = () => {
        console.log("Start pressed");

        if(isDemo) {
            console.log("Showing demo video");
            if(videoRef.current) {
                videoRef.current.src = DemoVideo;
                videoRef.current.crossOrigin = "anonymous";
                videoRef.current.loop = true;
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;

                videoRef.current.play()
            }
        } else {
            let pc = createPeerConnection();
            setPc(pc)
        }
    }

    const stop = () => {
        // replace stream with empty video
        if(videoRef.current) {
            const vid = document.createElement("video");
            videoRef.current = vid;
        }

        // fallback for failed startup or demo mode
        if(pc === undefined) return

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
}

export default WebRtcConnection
