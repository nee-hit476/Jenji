# File: config.py
# => Configurations and settings for the application

import os
from typing import Optional


class Config:
    """ Application configuration """

    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = int(os.environ.get("PORT", 8080))

    # cors settings
    CORS_ALLOWED_ORIGINS: str = "*"

    # socket io settings
    ASYNC_MODE: str = "eventlet"
    MAX_HTTP_BUFFER_SIZE: int = 100_000_000 # 100mb

    # Model Settings
    # In containerized deployments we expect the model to be mounted at /app/model/best.pt
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        r"C:\Users\itz_n\OneDrive\Desktop\Microsoft-Hackathon\Jenji\runs\yolov11_experiment_01\weights\best.pt"
    )

    # Detection Settings
    BBOX_COLOR: tuple = (0, 255, 0) # Green
    BBOX_THICKNES: int = 2
    FONT_SCALE: float = 0.5
    FONT_THICKNESS: int = 1

    # Image Settings
    IMAGE_ENCODING: str = ".jpg"
    IMAGE_QUALITY: int  = 90