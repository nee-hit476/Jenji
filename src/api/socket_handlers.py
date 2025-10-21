from flask_socketio import emit
from typing import Dict, Callable
import logging
import threading

logger = logging.getLogger(__name__)


class SocketIOHandlers:
    """Handles SocketIO events for real-time detection."""
    
    def __init__(self, detection_service_getter: Callable, service_ready: threading.Event, socketio):
        """
        Initialize handlers with detection service getter.
        
        @param {Callable} detection_service_getter - Function that returns detection service
        @param {threading.Event} service_ready - Event indicating service is ready
        """
        self.get_detection_service = detection_service_getter
        self.service_ready = service_ready
        self.socketio = socketio
        # client tracking and live-buffer structures
        self.active_clients: Dict[str, dict] = {}
        self.latest_frame = {}
        self.processing = {}
        self.client_lock = {}
    
    def handle_image(self, data: str) -> None:
        """
        Handle incoming image frames from clients.
        
        @param {str} data - Base64-encoded image data
        @emits "response_back" - Processed frame and detection results
        """
        try:
            # Check if service is ready
            if not self.service_ready.is_set():
                emit("response_back", {
                    "error": "Model is still loading, please wait...",
                    "loading": True
                })
                return
            
            detection_service = self.get_detection_service()
            if detection_service is None:
                emit("response_back", {
                    "error": "Detection service not available",
                    "loading": True
                })
                return
            
            # Process frame
            result = detection_service.process_frame(data)
            
            # Emit success response only to the sender
            emit("response_back", result)
            
            logger.info(f"Processed frame with {result['count']} detections")
        
        except Exception as e:
            # Log and emit error only to the sender
            logger.error(f"Error processing frame: {str(e)}")
            emit("response_back", {"error": str(e)})

    def handle_image_binary(self, data: bytes) -> None:
        """
        Handle incoming binary image frames (sent as Blob/ArrayBuffer from browser).
        """
        try:
            if not self.service_ready.is_set():
                emit("response_back", {"error": "Model is still loading, please wait...", "loading": True})
                return

            detection_service = self.get_detection_service()
            if detection_service is None:
                emit("response_back", {"error": "Detection service not available", "loading": True})
                return

            # Fast live path: store the latest binary frame per client and process in a background worker
            from flask import request
            sid = request.sid

            # ensure lock exists
            if sid not in self.client_lock:
                self.client_lock[sid] = threading.Lock()

            with self.client_lock[sid]:
                # store/overwrite latest frame
                self.latest_frame[sid] = data
                if not self.processing.get(sid, False):
                    self.processing[sid] = True

                    def live_worker(sid):
                        detection_service = self.get_detection_service()
                        target_size = 320
                        while True:
                            frame = None
                            with self.client_lock[sid]:
                                frame = self.latest_frame.pop(sid, None)
                                if frame is None:
                                    self.processing[sid] = False
                                    break
                            try:
                                res = detection_service.process_frame_bytes_live(frame, target_size=target_size)
                                # emit back to originating session
                                self.socketio.emit("response_back", res, to=sid)
                                logger.info(f"Live processed frame for {sid} with {res.get('count',0)} detections")
                            except Exception as e:
                                logger.error(f"Error in live worker for {sid}: {e}")
                                self.socketio.emit("response_back", {"error": str(e)}, to=sid)

                    try:
                        self.socketio.start_background_task(live_worker, sid)
                    except Exception as e:
                        logger.error(f"Failed to start live worker: {e}")

        except Exception as e:
            logger.error(f"Error processing binary frame: {str(e)}")
            emit("response_back", {"error": str(e)})
    
    def handle_connect(self) -> None:
        """Handle client connection."""
        from flask import request
        
        # Get unique session ID for this client
        session_id = request.sid
        
        # Track this client
        self.active_clients[session_id] = {
            "connected_at": None,
            "frame_count": 0
        }
        
        # Check if model is ready
        model_ready = self.service_ready.is_set()
        
        logger.info(f"Client connected: {session_id} (Total clients: {len(self.active_clients)}, Model ready: {model_ready})")
        
        # Emit only to this client
        emit("connection_status", {
            "status": "connected",
            "session_id": session_id,
            "model_ready": model_ready
        })
    
    def handle_disconnect(self) -> None:
        """Handle client disconnection."""
        from flask import request
        
        session_id = request.sid
        
        # Remove client from tracking
        if session_id in self.active_clients:
            del self.active_clients[session_id]
        
        logger.info(f"Client disconnected: {session_id} (Remaining clients: {len(self.active_clients)})")
    
    def get_active_client_count(self) -> int:
        """Get number of active clients."""
        return len(self.active_clients)