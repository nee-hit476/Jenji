import base64
import io
import cv2
import numpy as np
from PIL import Image
from typing import Tuple


class ImageProcessor:
    """Handles image encoding, decoding, and processing operations."""
    
    @staticmethod
    def decode_base64_image(data: str) -> np.ndarray:
        """
        Decode base64-encoded image data to numpy array.
        
        @param {str} data - Base64-encoded image data with data URI prefix
        @return {np.ndarray} - OpenCV image array (BGR format)
        @raises {ValueError} - If image decoding fails
        """
        try:
            # Remove data URI prefix and decode
            imageBytes: bytes = base64.b64decode(data.split(",")[1])
            image: Image.Image = Image.open(io.BytesIO(imageBytes))  # Fixed: BytesIO (capital I)
            frame: np.ndarray = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            return frame
        except Exception as e:
            raise ValueError(f"Failed to decode image: {str(e)}")  # Fixed: removed comma, added {str(e)}
    
    @staticmethod
    def encode_image_to_base64(frame: np.ndarray, encoding: str = ".jpg", quality: int = 90) -> str:
        """
        Encode numpy array image to base64 data URI.
        
        @param {np.ndarray} frame - OpenCV image array (BGR format)
        @param {str} encoding - Image encoding format (default: .jpg)
        @param {int} quality - JPEG quality (1-100, default: 90)
        @return {str} - Base64-encoded data URI
        @raises {ValueError} - If image encoding fails
        """
        try:
            # Encode with quality parameter for JPEG
            encode_params = [cv2.IMWRITE_JPEG_QUALITY, quality] if encoding == ".jpg" else []
            success, buffer = cv2.imencode(encoding, frame, encode_params)
            
            if not success:
                raise ValueError("Image encoding failed")
            
            frame_base64: str = base64.b64encode(buffer).decode("utf-8")
            return f"data:image/jpeg;base64,{frame_base64}"
        except Exception as e:
            raise ValueError(f"Failed to encode image: {str(e)}")