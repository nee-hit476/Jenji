# src/utils/metrics.py
import numpy as np
from sklearn.metrics import confusion_matrix

def compute_confusion_matrix(gt_classes, pred_classes, num_classes):
    """
    gt_classes: list-like ground truth labels
    pred_classes: list-like predicted labels (same length)
    """
    cm = confusion_matrix(gt_classes, pred_classes, labels=list(range(num_classes)))
    return cm

def get_gt_pred_pairs(results_list):
    """
    Placeholder: convert ultralytics results into flat lists of gt and pred classes.
    You'll need to parse prediction JSON or Results objects.
    """
    # implement depending on the output format you saved
    return [], []
