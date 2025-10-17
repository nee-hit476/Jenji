import numpy as np
import os
import cv2
import yaml
from ultralytics import YOLO

class ModelLoader:
    """
    A utility class for loading and running inference using YOLO models.

    This class abstracts model initialization, input preprocessing,
    and output postprocessing for both NumPy arrays and raw image bytes.
    """
    def __init__(self, model_path):
        """
        Initialize the YOLO model loader

        @param {str} model_path - Absolute or relative path to the best trained YOLO model file __.pt. 
        @raises FileNotFoundError - if the model file not exist in the path given.
        """
        model_path = os.path.abspath(model_path)
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model Path not found.. ${model_path}")
        print(f"Loading Model Path from ${model_path} ... ")
        self.model = YOLO(model_path)
        # Attempt to load class names mapping from environment or dataset yaml
        self.class_names = self._load_class_names()
        # print(self.model)

    def predict_ndarray(self, img: np.ndarray, imagesz: int = 320, conf: float = 0.25):
        """
        Perform Object Detection on NumPy array image.

        @param {np.ndarray} img - Input image in RGB format (as read by OpenCV)
        @param {int} imagesz - image size which should be resized after the input before inference
        @param {float} conf - confidence threshold for the model predictions.

        @return {dict} Object containing detection results
        Example: 
            {
                "detections": [
                    {
                        "class_id": int,
                        "confidence": float,
                        "bbox": [x1, x2, y1, y2]
                    }
                ]
            }  
        """

        results  = self.model.predict(source=img, imgsz=imagesz, conf=conf, verbose=False)
        seggregated_result = results[0]
        boxes = getattr(seggregated_result, "boxes", None)
        detections = []

        if boxes is None:
            return {
                "detections": [] 
            }
        
        for box in boxes.data.tolist():
            x1, x2, y1, y2, conf_score, cls = box
            class_id = int(cls)
            detections.append({
                "class_Id": class_id,
                "class_name": self.class_names.get(class_id, str(class_id)),
                "confidence": float(conf_score),
                "bbox": [float(x1), float(x2), float(y1), float(y2)]
            })

        return {"detections": detections}

    def _load_class_names(self) -> dict:
        """Try to load a class id -> name mapping.

        Order:
        - If env var CLASS_NAMES_PATH is set and file exists, load it (YAML expected)
        - Else look for dataset/data.yaml in repo root
        - Else return an empty dict so we fall back to numeric ids
        """
        # 1) env override
        class_path = os.getenv("CLASS_NAMES_PATH", "/app/model/classes.yaml")
        if class_path and os.path.exists(class_path):
            try:
                with open(class_path, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                    # data may be a mapping under key `names` or a flat mapping
                    if isinstance(data, dict) and "names" in data:
                        return {int(k): v for k, v in data["names"].items()}
                    elif isinstance(data, dict):
                        return {int(k): v for k, v in data.items()}
            except Exception:
                pass

        # 2) fallback to repo dataset/data.yaml
        repo_data_yaml = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "dataset", "data.yaml")
        repo_data_yaml = os.path.abspath(repo_data_yaml)
        if os.path.exists(repo_data_yaml):
            try:
                with open(repo_data_yaml, "r", encoding="utf-8") as f:
                    data = yaml.safe_load(f)
                    names = data.get("names", {}) if isinstance(data, dict) else {}
                    return {int(k): v for k, v in names.items()}
            except Exception:
                pass

        return {}
    
    def predict_bytes(self, image_bytes: bytes, imagesz: int = 640, conf: float = 0.25):
        """
        Perform object detection directly on raw image bytes

        This method automatically decodes bytes into and openCv image.

        @param {bytes} image_bytes - Image data in bytes form.
        @param {int} [imagesz=640] - image size which should be resized after the input before YOLO inference.
        @param {float} [conf=0.25] - prediction confidence threshold.

        @returns {dict} object - containing detection results or an error message.
        Example:
            {
                "detections": [...],
                "error": "could not decode image"  # optional
   
            }
        """
        npimg = np.frombuffer(image_bytes, dtype=np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return {"error": "could not decode image"}

        return self.predict_ndarray(img, imgsz=imagesz, conf=conf)