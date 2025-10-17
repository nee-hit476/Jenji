import matplotlib.pyplot as plt
import numpy as np

class_names = [
    "OxygenTank",
    "NitrogenTank",
    "FirstAidBox",
    "FireAlarm",
    "SafetySwitchPanel",
    "EmergencyPhone",
    "FireExtinguisher",
]

maps = np.array([0.87335, 0.69098, 0.62384, 0.75045, 0.66914, 0.59041, 0.68673])

plt.figure(figsize=(12, 6))
bars = plt.bar(class_names, maps, color=plt.cm.viridis(maps / maps.max()), width=0.6)

# Add value labels above bars
for bar, value in zip(bars, maps):
    plt.text(
        bar.get_x() + bar.get_width() / 2,
        bar.get_height() + 0.02,
        f"{value:.2f}",
        ha="center",
        va="bottom",
        fontsize=10,
        color="#222",
    )

plt.title("mAP50–95 per Class (YOLOv11n)", fontsize=16, pad=20)
plt.xlabel("Class", fontsize=12)
plt.ylabel("mAP50–95 Score", fontsize=12)
plt.xticks(rotation=25, ha="right")  # ✅ rotate labels
plt.ylim(0, 0.8)
plt.grid(axis="y", linestyle="--", alpha=0.4)
plt.tight_layout()
plt.show()
