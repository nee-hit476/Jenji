import cv2
import numpy as np
from typing import List, Dict, Tuple


class DetectionVisualizer:
    """Handles visualization of detection results on images."""
    
    def __init__(
        self,
        bbox_color: Tuple[int, int, int] = (0, 255, 0),
        bbox_thickness: int = 2,
        font_scale: float = 0.5,
        font_thickness: int = 1
    ):
        """
        Initialize visualizer with styling parameters.
        
        @param {Tuple[int, int, int]} bbox_color - BGR color for bounding boxes
        @param {int} bbox_thickness - Thickness of bounding box lines
        @param {float} font_scale - Scale factor for text
        @param {int} font_thickness - Thickness of text
        """
        self.bbox_color = bbox_color
        self.bbox_thickness = bbox_thickness
        self.font_scale = font_scale
        self.font_thickness = font_thickness
    
    def draw_detections(
        self,
        frame: np.ndarray,
        detections: List[Dict]
    ) -> np.ndarray:
        """
        Draw bounding boxes and labels on the frame.
        
        @param {np.ndarray} frame - Input image (BGR format)
        @param {List[Dict]} detections - List of detection dictionaries
        @return {np.ndarray} - Annotated image
        """
        # Validate frame is not empty
        if frame is None or frame.size == 0:
            raise ValueError("Input frame is empty or None")
        
        # Create a copy to avoid modifying original
        annotated_frame = frame.copy()
        
        # If no detections, return the original frame
        if not detections:
            return annotated_frame
        
        for det in detections:
            try:
                # Extract detection info with error checking
                bbox = det.get("bbox", [])
                if len(bbox) != 4:
                    continue
                
                x1, y1, x2, y2 = map(int, bbox)
                conf: float = det.get("confidence", 0.0)
                class_id: int = det.get("class_Id", 0)
                
                # Validating coordinates
                h, w = annotated_frame.shape[:2]
                x1, y1 = max(0, x1), max(0, y1)
                x2, y2 = min(w, x2), min(h, y2)
                
                # Skipping invalid boxes
                if x2 <= x1 or y2 <= y1:
                    continue
                
                # Create label
                label: str = f"ID:{class_id} ({conf:.2f})"
                
                # Draw bounding box
                cv2.rectangle(
                    annotated_frame,
                    (x1, y1),
                    (x2, y2),
                    self.bbox_color,
                    self.bbox_thickness
                )
                
                # Calculate text size for background
                (text_width, text_height), baseline = cv2.getTextSize(
                    label,
                    cv2.FONT_HERSHEY_SIMPLEX,
                    self.font_scale,
                    self.font_thickness
                )
                
                # Draw text background
                bg_y1 = max(0, y1 - text_height - baseline - 5)
                bg_y2 = y1
                cv2.rectangle(
                    annotated_frame,
                    (x1, bg_y1),
                    (min(x1 + text_width, w), bg_y2),
                    self.bbox_color,
                    -1
                )
                
                # Draw text
                text_y = max(text_height + baseline, y1 - 5)
                cv2.putText(
                    annotated_frame,
                    label,
                    (x1, text_y),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    self.font_scale,
                    (0, 0, 0),  # Black text on colored background
                    self.font_thickness,
                    cv2.LINE_AA
                )
            except Exception as e:
                # Skip problematic detections but continue with others
                print(f"Warning: Failed to draw detection: {e}")
                continue
        
        return annotated_frame