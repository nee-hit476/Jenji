"""
YOLOv8 Model Training Script

This script loads configuration parameters from a YAML file,
initializes a YOLO model, and trains it on a specified dataset.

It supports both CPU and GPU devices and can be easily integrated
into automated training pipelines or experiments.
"""

import yaml
import os
import argparse
import torch
from ultralytics import YOLO


# Detect device: use GPU if available, else CPU
device = "cuda" if torch.cuda.is_available() else "cpu"


def main() -> None:
    """
    Main entry point for training a YOLOv8 model.

    @raises FileNotFoundError: If the provided configuration file does not exist.
    """

    # -------------------------------
    # Argument Parser Setup
    # -------------------------------
    parser = argparse.ArgumentParser(
        description="Train a YOLOv8 model with a custom dataset and configuration."
    )
    parser.add_argument(
        "--cfg",
        type=str,
        default="config.yaml",
        help="Path to the YAML configuration file."
    )
    args = parser.parse_args()

    # -------------------------------
    # Load and Validate Config
    # -------------------------------
    cfg_path = os.path.join(os.path.dirname(__file__), args.cfg)
    cfg_path = os.path.abspath(cfg_path)

    if not os.path.exists(cfg_path):
        raise FileNotFoundError(f"Configuration file not found at: {cfg_path}")

    with open(cfg_path, "r") as file:
        cfg: dict = yaml.safe_load(file)

    # -------------------------------
    # Dataset Configuration
    # -------------------------------
    dataset_yaml: str = cfg.get("dataset", r"C:\Users\itz_n\OneDrive\Desktop\Microsoft-Hackathon\Jenji\dataset\data.yaml")
    print(f"[INFO] Using dataset YAML: {dataset_yaml}")

    if not os.path.exists(dataset_yaml):
        raise FileNotFoundError(f"Dataset YAML not found at: {dataset_yaml}")

    # -------------------------------
    # Model Initialization
    # -------------------------------
    base_model: str = cfg.get("base_model")
    if not base_model:
        raise ValueError("Missing 'base_model' in configuration file.")

    print(f"[INFO] Loading YOLO model: {base_model}")
    model = YOLO(base_model)

    # -------------------------------
    # Training Setup
    # -------------------------------
    run_name: str = cfg.get("run_name", "yolov8_experiment_01")
    project_path: str = os.path.join(os.path.dirname(__file__), cfg.get("project", "runs"))
    project_path = os.path.abspath(project_path)

    print(f"[INFO] Run Name: {run_name}")
    print(f"[INFO] Saving results to: {project_path}")

    # -------------------------------
    # Train the YOLO model
    # -------------------------------
    results = model.train(
        data=dataset_yaml,
        epochs=cfg.get("epochs", 50),
        batch=cfg.get("batch_size", 16),
        imgsz=cfg.get("imgsz", 640),
        project=project_path,
        name=run_name,
        device=device,
        workers=cfg.get("workers", 4),
    )

    # -------------------------------
    # Post-training Summary
    # -------------------------------
    print(f"[SUCCESS] Training completed for run: {run_name}")
    print(f"[INFO] Results saved at: {os.path.join(project_path, run_name)}")
    print(f"[INFO] Device used: {device}")
    print(f"[INFO] Training metrics: {results}")


if __name__ == "__main__":
    main()
