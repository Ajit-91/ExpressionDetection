// src/components/Camera.jsx
import React, { useRef, useEffect, useContext } from "react";
import * as faceapi from "face-api.js";
import  AppContext from "../context/AppContext";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { settings } = useContext(AppContext);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; // make sure you have models in public/models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      startVideo();
    };

    loadModels();
  }, []);

  // Start webcam
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error("Error accessing webcam: ", err));
  };

  // Detect faces and expressions
  useEffect(() => {
    const interval = setInterval(async () => {
      if (
        videoRef.current &&
        settings.faceDetectionEnabled
      ) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
          const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          };
          faceapi.matchDimensions(canvas, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          resizedDetections.forEach(detection => {
            const { expressions, detection: box } = detection;
            const { x, y, width, height } = box.box;
            const ctx = canvas.getContext('2d');

            // Draw box
            ctx.strokeStyle = "#0500ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            // Draw expression if enabled
            if (settings.expressionDetectionEnabled) {
              const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
              const topExpression = sorted[0];
              ctx.font = "16px Arial";
              ctx.fillStyle = "#0500ff";
              ctx.fillText(`${topExpression[0]} (${(topExpression[1]*100).toFixed(1)}%)`, x, y - 10);
            }
          });
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [settings.faceDetectionEnabled, settings.expressionDetectionEnabled]);

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="720"
        height="560"
        style={{ position: "absolute" }}
      />
      <canvas
        ref={canvasRef}
        width="720"
        height="560"
        style={{ position: "absolute" }}
      />
    </div>
  );
};

export default Camera;
