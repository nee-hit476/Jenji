from flask_socketio import emit
from detection_service import DetectionService
from typing import Callable
import logging

logger = logging.getLogger(__name__)


class SocketIOHandlers:
    """Handles SocketIO events for real-time detection."""
    
    def __init__(self, detection_service: DetectionService):
        """
        Initialize handlers with detection service.
        
        @param {DetectionService} detection_service - Service for processing frames
        """
        self.detection_service = detection_service
    
    def handle_image(self, data: str) -> None:
        """
        Handle incoming image frames from clients.
        
        @param {str} data - Base64-encoded image data
        @emits "response_back" - Processed frame and detection results
        """
        try:
            # Process frame
            result = self.detection_service.process_frame(data)
            
            # Emit success response
            emit("response_back", result)
            
            logger.info(f"Processed frame with {result['count']} detections")
        
        except Exception as e:
            # Log and emit error - FIXED: removed comma, used {str(e)}
            logger.error(f"Error processing frame: {str(e)}")
            emit("response_back", {"error": str(e)})
    
    def handle_connect(self) -> None:
        """Handle client connection."""
        logger.info("Client connected")
        emit("connection_status", {"status": "connected"})
    
    def handle_disconnect(self) -> None:
        """Handle client disconnection."""
        logger.info("Client disconnected")