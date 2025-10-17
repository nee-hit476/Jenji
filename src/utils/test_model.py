import json
from ultralytics import YOLO

model = YOLO(r"path to your model .pt")

results = model(r"image path")

# print(str(results))


for result in results:
    class_ids = result.boxes.cls  # tensor of class IDs
    confidences = result.boxes.conf  # tensor of confidence scores

    # Combine object names with confidence
    detections = [
        (result.names[int(cls_id)], float(conf))
        for cls_id, conf in zip(class_ids, confidences)
    ]

    for obj_name, conf in detections:
        print(f"Detected {obj_name} with confidence {conf:.2f}")