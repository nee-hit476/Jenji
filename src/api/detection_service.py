import numpy as np
import cv2
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

    def process_frame_bytes(self, image_bytes: bytes) -> Dict:
        """
        Process a raw image bytes payload (JPEG/PNG bytes): decode, detect, annotate, encode.

        @param {bytes} image_bytes - raw image bytes (as sent from browser Blob)
        @return {Dict} - Processed result with frame and detections
        """
        
        try:
            # decode bytes into cv2 image
            npimg = np.frombuffer(image_bytes, dtype=np.uint8)
            frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

            if frame is None or frame.size == 0:
                raise ValueError("Decoded frame is empty")

            print(f"Frame decoded successfully: shape={frame.shape}, dtype={frame.dtype}")

            # Run detection
            result = self.model.predict_ndarray(frame)
            detections = result.get("detections", [])

            print(f"Detections found: {len(detections)}")

            # Annotate frame
            annotated_frame = self.visualizer.draw_detections(frame, detections)

            if annotated_frame is None or annotated_frame.size == 0:
                raise ValueError("Annotated frame is empty")

            encoded_frame = self.image_processor.encode_image_to_base64(annotated_frame)

            print(f"Frame encoded successfully")

            return {
                "frame": encoded_frame,
                "detections": detections,
                "count": len(detections)
            }

        except Exception as e:
            raise Exception(f"Frame processing failed: {str(e)}")

    def process_frame_bytes_live(self, image_bytes: bytes, target_size: int = 320) -> Dict:
        """
        Fast-path processing for live streams: decode, resize to target_size, detect, annotate, encode.

        This path sacrifices output resolution for speed and lower latency.
        """
        try:
            npimg = np.frombuffer(image_bytes, dtype=np.uint8)
            frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

            if frame is None or frame.size == 0:
                raise ValueError("Decoded frame is empty")

            # Resize to smaller target to speed up inference while preserving aspect ratio
            h, w = frame.shape[:2]
            if max(h, w) > target_size:
                scale = target_size / max(h, w)
                new_w = int(w * scale)
                new_h = int(h * scale)
                small = cv2.resize(frame, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
            else:
                small = frame

            print(f"Live frame decoded and resized: shape={small.shape}, dtype={small.dtype}")

            # Run detection on the small image (model_loader will convert to RGB and adjust imgsz)
            result = self.model.predict_ndarray(small, imagesz=target_size)
            detections = result.get("detections", [])

            print(f"Live detections found: {len(detections)}")

            # Annotate the small image
            annotated = self.visualizer.draw_detections(small, detections)
            if annotated is None or annotated.size == 0:
                raise ValueError("Annotated frame is empty")

            encoded_frame = self.image_processor.encode_image_to_base64(annotated)

            return {"frame": encoded_frame, "detections": detections, "count": len(detections)}

        except Exception as e:
            raise Exception(f"Live frame processing failed: {str(e)}")