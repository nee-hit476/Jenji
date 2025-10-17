import base64
import io
import cv2
import numpy as np
from PIL import Image
from flask import Flask
from flask_socketio import SocketIO
from config import Config
from model_loader import ModelLoader
import os
import logging

logger = logging.getLogger(__name__)

# -------------------------------
# Flask and SocketIO Initialization
# -------------------------------
app: Flask = Flask(__name__)
socketio: SocketIO = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="eventlet",
    max_http_buffer_size=100_000_000  # 100MB max buffer
)

cfg = Config()
# Try to load model, but don't crash the server if the model file is not yet present.
model: ModelLoader | None = None
try:
    if not os.path.exists(cfg.MODEL_PATH):
        logger.warning(f"Model not found at {cfg.MODEL_PATH}. Server will start and wait for model to be provided.")
    else:
        model = ModelLoader(cfg.MODEL_PATH)
        logger.info("Model loaded successfully")
except Exception as e:
    logger.exception(f"Failed to load model: {e}")


@app.route("/")
def home() -> str:
    """
    Home endpoint to verify server is running.

    @return {str} Simple status message.
    """
    return "YOLO Live Detection Server Running"


# -------------------------------
# SocketIO Event: Handle incoming frames
# -------------------------------
@socketio.on("image")
def video_handler(data: str) -> None:
    """
    Handles incoming video frames from the client,
    runs YOLO detection, draws bounding boxes, and
    emits the processed frame back to the client.

    @param {str} data - Base64-encoded image data from the client.
    @emits "response_back" - JSON object containing processed frame and detection results.
    @example
    {
        "frame": "data:image/jpeg;base64,...",
        "detections": [
            {
                "class_id": 0,
                "confidence": 0.87,
                "bbox": [x1, y1, x2, y2]
            }
        ]
    }
    """
    try:
        # -------------------------------
        # Decode base64 frame
        # -------------------------------
        img_bytes: bytes = base64.b64decode(data.split(",")[1])
        image: Image.Image = Image.open(io.BytesIO(img_bytes))
        frame: np.ndarray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

        # -------------------------------
        # Run YOLO detection
        # -------------------------------
        result: dict = model.predict_ndarray(frame)
        detections: list[dict] = result.get("detections", [])

        # -------------------------------
        # Draw bounding boxes
        # -------------------------------
        for det in detections:
            x1, y1, x2, y2 = map(int, det["bbox"])
            conf: float = det["confidence"]
            class_id: int = det["class_Id"]
            label: str = f"ID:{class_id} ({conf:.2f})"

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame,
                label,
                (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 0),
                1,
                cv2.LINE_AA
            )

        # -------------------------------
        # Encode frame back to base64
        # -------------------------------
        _, buffer = cv2.imencode(".jpg", frame)
        frame_base64: str = base64.b64encode(buffer).decode("utf-8")
        data_uri: str = "data:image/jpeg;base64," + frame_base64

        # -------------------------------
        # Emit processed frame and detections
        # -------------------------------
        socketio.emit("response_back", {
            "frame": data_uri,
            "detections": detections
        })

    except Exception as e:
        # Log error and notify client
        print("Error:", e)
        socketio.emit("response_back", {"error": str(e)})


# -------------------------------
# Run server
# -------------------------------
if __name__ == "__main__":
    """
    Starts the Flask-SocketIO server.
    Listens on all interfaces, port 8080.
    """
    socketio.run(app, host="0.0.0.0", port=8080)
    
