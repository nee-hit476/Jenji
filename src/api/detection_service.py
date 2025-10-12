import numpy as np
from typing import Dict, List
from model_loader import ModelLoader
from detection_visuallizer import DetectionVisualizer
from image_processor import ImageProcessor


class DetectionService:
    """Service layer for object detection operations."""
    
    def __init__(self, model_path: str):
        """
        Initialize detection service with YOLO model.
        
        @param {str} model_path - Path to YOLO model weights
        """
        self.model = ModelLoader(model_path)
        self.visualizer = DetectionVisualizer()
        self.image_processor = ImageProcessor()
    
    def process_frame(self, base64_data: str) -> Dict:
        """
        Process a single frame: decode, detect, annotate, encode.
        
        @param {str} base64_data - Base64-encoded image data
        @return {Dict} - Processed result with frame and detections
        @raises {Exception} - If processing fails
        """
        try:
            #  Decode image
            frame = self.image_processor.decode_base64_image(base64_data)
            
            # Validate decoded frame
            if frame is None or frame.size == 0:
                raise ValueError("Decoded frame is empty")
            
            print(f"Frame decoded successfully: shape={frame.shape}, dtype={frame.dtype}")
            
            #  Run detection
            result = self.model.predict_ndarray(frame)
            detections = result.get("detections", [])
            
            print(f"Detections found: {len(detections)}")
            
            #  Annotate frame
            annotated_frame = self.visualizer.draw_detections(frame, detections)
            
            # Validate annotated frame
            if annotated_frame is None or annotated_frame.size == 0:
                raise ValueError("Annotated frame is empty")
            
            print(f"Frame annotated successfully:{annotated_frame.shape}")
            
            #  Encode result
            encoded_frame = self.image_processor.encode_image_to_base64(annotated_frame)
            
            print(f"Frame encoded successfully")
            
            return {
                "frame": encoded_frame,
                "detections": detections,
                "count": len(detections)
            }
        
        except ValueError as e:
            # Re-raise ValueError with context
            raise Exception(f"Frame processing failed: {str(e)}")
        except Exception as e:
            # Catch all other exceptions
            raise Exception(f"Frame processing failed: {str(e)}")