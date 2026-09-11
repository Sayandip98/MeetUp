// src/hooks/useMediaStream.js
import { useState, useEffect, useRef } from "react";

const useMediaStream = () => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const getStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (isMounted) {
          setStream(mediaStream);
          streamRef.current = mediaStream;
        } else {
          mediaStream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        setError(err.message || "Could not access camera/microphone");
      }
    };

    getStream();

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleAudio = () => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
    });
  };

  const toggleVideo = () => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    });
  };

  return {
    stream,
    error,
    toggleAudio,
    toggleVideo,
    audioEnabled,
    videoEnabled,
  };
};

export default useMediaStream;
