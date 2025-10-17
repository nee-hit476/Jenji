import json
from ultralytics import YOLO

model = YOLO(r"C:\Users\itz_n\OneDrive\Desktop\Microsoft-Hackathon\Jenji\runs\yolov11_experiment_01\weights\best.pt")

results = model(r"C:\Users\itz_n\OneDrive\Desktop\Microsoft-Hackathon\Jenji\dataset\images\train\images\000001882_dark_clutter.png")

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