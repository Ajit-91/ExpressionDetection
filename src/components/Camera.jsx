import React, { useEffect, useRef, useContext, useCallback } from "react";
import AppContext from "../context/AppContext";
import * as faceapi from "face-api.js";
import { Box } from "@mui/material";
import expressionEmojis from "../utils/expressions";

const Camera = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const { settings, setFaceCount } = useContext(AppContext);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera", error);
        }
    };

    const clearCanvas = useCallback(() => {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }, [canvasRef, videoRef])

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        clearCanvas();
    }, [clearCanvas]);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "./models";

            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]);
        };

        loadModels();
    }, []);

    useEffect(() => {
        if (settings.cameraEnabled) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [settings.cameraEnabled, stopCamera]);

    useEffect(() => {
        const detectFaces = async () => {
            if (
                videoRef.current &&
                videoRef.current.readyState === 4 &&
                settings.faceDetectionEnabled
            ) {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                ).withFaceExpressions();
        
                const ctx = canvasRef.current.getContext("2d");
                const displaySize = {
                    width: videoRef.current.offsetWidth, 
                    height: videoRef.current.offsetHeight, 
                };
        
                canvasRef.current.width = displaySize.width;
                canvasRef.current.height = displaySize.height;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
                if (resizedDetections.length > 0) {
                    resizedDetections.forEach((detection) => {
                        const box = detection.detection.box;
                        const expressions = detection.expressions;
        
                        const maxExpression = Object.keys(expressions).reduce((a, b) =>
                            expressions[a] > expressions[b] ? a : b
                        );
        
                        // Draw box
                        ctx.strokeStyle = "#0500ff";
                        ctx.lineWidth = 2;
                        ctx.strokeRect(box.x, box.y, box.width, box.height);
        
                        // Draw label (only if expression detection is enabled)
                        if (settings.expressionDetectionEnabled) {
                            ctx.fillStyle = "#0500ff";
                            ctx.font = "16px Arial";
                            ctx.fillText(expressionEmojis[maxExpression], box.x, box.y - 10);
                        }
                    });
                }
        
                setFaceCount(detections.length);
            } else {
                setFaceCount(0); 
            }
        };
        
        let intervalId;
        if (settings.cameraEnabled) {
            intervalId = setInterval(detectFaces, 500);
        }

        if (settings.faceDetectionEnabled === false) {
            clearInterval(intervalId)
            clearCanvas()
        }

        return () => clearInterval(intervalId); // cleanup
    }, [settings.cameraEnabled,
    settings.faceDetectionEnabled,
    settings.expressionDetectionEnabled,
        setFaceCount,
        clearCanvas
    ]);

    return (
        <div >
            <Box position="relative">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ width: "100%", objectFit: 'cover', position: 'relative' }}
                />
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                />
            </Box>
        </div>
    );
};

export default Camera;
