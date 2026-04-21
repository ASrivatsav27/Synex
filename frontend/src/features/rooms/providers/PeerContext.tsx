import { createContext, useMemo, type ReactNode, useCallback } from "react";

type PeerContextProps = {
    children: ReactNode;
};

type PeerContextType = {
    peer: RTCPeerConnection;
    createOffer: () => Promise<RTCSessionDescriptionInit>;
    createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
    setRemoteDescription: (answer: RTCSessionDescriptionInit) => Promise<void>;
    addIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
};

export const PeerContext = createContext<PeerContextType | null>(null);

export const PeerProvider = ({ children }: PeerContextProps) => {
    const peer = useMemo(
        () =>
            new RTCPeerConnection({
                iceServers: [
                    {
                        urls: [
                            "stun:stun.l.google.com:19302",
                            "stun:global.stun.twilio.com:3478",
                        ],
                    },
                ],
            }),
        []
    );

    const createOffer = useCallback(async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }, [peer]);

    const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }, [peer]);

    const setRemoteDescription = useCallback(async (answer: RTCSessionDescriptionInit) => {
        await peer.setRemoteDescription(answer);
    }, [peer]);

    const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        await peer.addIceCandidate(candidate);
    }, [peer]);

    return (
        <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteDescription, addIceCandidate }}>
            {children}
        </PeerContext.Provider>
    );
};