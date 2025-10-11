import yaml, os, argparse, json
from ultralytics import YOLO
import numpy as np
# from src.utils.metrics import compute_confusion_matrix, get_gd_pred_pairs
from src.training.viz import save_metrics


parser = argparse.ArgumentParser()
parser.add_argument("--weights", required=True, help="Path to trained weights")
parser.add_argument("--dataset", default="../../dataset/data.yaml")
parser.add_argument("--out", default="runs/metrics.json")
args = parser.parse_args()

model = YOLO(args.weights);

# run predictions on test set and save results
res = model.val(data=args.dataset, verbose=True, save_json=True) # it returns metrics

pred_json = os.path.join(os.getcwd(), "predictions.json")

metrics = {
    "results": str(pred_json)
}

save_metrics(metrics, args.out)

print(f"Evaluation saved to {args.out}")