import os
import argparse
import json
from ultralytics import YOLO
import numpy as np
import matplotlib.pyplot as plt
from viz import save_metrics  # your existing helper

# Optional: only import if you’ve created them
# from src.utils.metrics import compute_confusion_matrix, get_gt_pred_pairs

def plot_pr_curve(metrics_dict, out_path):
    """Plots precision-recall curve if available."""
    precisions = metrics_dict.get("precision", [])
    recalls = metrics_dict.get("recall", [])
    if precisions and recalls:
        plt.figure(figsize=(6, 6))
        plt.plot(recalls, precisions, label="PR Curve", color="blue")
        plt.xlabel("Recall")
        plt.ylabel("Precision")
        plt.title("Precision-Recall Curve")
        plt.grid(True)
        plt.legend()
        plt.tight_layout()
        plt.savefig(out_path)
        plt.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate YOLO model on dataset")
    parser.add_argument("--weights", required=True, help="Path to trained weights (.pt)")
    parser.add_argument("--dataset", default="../../dataset/data.yaml", help="Dataset YAML path")
    parser.add_argument("--out_dir", default="../../runs/eval", help="Where to save results")
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)

    print(f"🔍 Evaluating model: {args.weights}")
    print(f"📂 Using dataset: {args.dataset}")

    model = YOLO(args.weights)

    # Run validation
    res = model.val(data=args.dataset, verbose=True, save_json=True)

    # Extract metrics
    metrics_dict = {
        "mAP50": getattr(res, "maps", [None])[0] if hasattr(res, "maps") else None,
        "mAP50-95": getattr(res, "results_dict", {}).get("metrics/mAP50-95", None),
        "precision": getattr(res, "results_dict", {}).get("metrics/precision", None),
        "recall": getattr(res, "results_dict", {}).get("metrics/recall", None),
        "num_images": getattr(res, "num_images", None),
        "speed(ms/img)": getattr(res, "speed", None),
    }

    # Save as JSON
    out_json = os.path.join(args.out_dir, "metrics.json")
    save_metrics(metrics_dict, out_json)
    print(f"✅ Metrics saved to: {out_json}")

    # Plot Precision-Recall curve
    plot_pr_curve(metrics_dict, os.path.join(args.out_dir, "pr_curve.png"))

    # Optional: print summary
    print("\n📊 Summary:")
    for k, v in metrics_dict.items():
        print(f" - {k}: {v}")

    print("\n✅ Evaluation complete.")
