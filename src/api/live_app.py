from flask import Flask
from flask_socketio import SocketIO
from config import Config 
from detection_service import DetectionService 
from socket_handlers import SocketIOHandlers
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

def create_app(config: Config) -> tuple[Flask, SocketIO]:
    """
    Application factory for creating flask app and SocketIO instance.

    @param {Config} config - Application configuration
    @return {tuple} - Flack app and SocketIO instance
    """

    # Initialize Flask
    app = Flask(__name__)

    # Initialize SocketIO
    socketio = SocketIO(
        app, 
        cors_allowed_origins=config.CORS_ALLOWED_ORIGINS,
        async_mode=config.ASYNC_MODE,
        max_http_buffer_size=config.MAX_HTTP_BUFFER_SIZE
    )

    detection_service = DetectionService(config.MODEL_PATH)
    handlers = SocketIOHandlers(detection_service)

    @app.route("/")
    def home() -> str:
        """Health check endpoint."""
        return "YOLO Live Detection Server is running"
    
    @app.route("/health")
    def health() -> dict:
        """route for server health"""
        return {
            "status": "healthy",
            "model_loaded": detection_service.model is not None,
            "version": "1.0.0"
        }
    
    # register socket io handlers.
    socketio.on_event("image", handlers.handle_image)
    socketio.on_event("connect", handlers.handle_connect)
    socketio.on_event("disconnect", handlers.handle_disconnect)

    logger.info("Application initialized successfully")

    return app, socketio


def main():
    """Main entry point of the server"""
    config = Config()
    app, socketio = create_app(config)

    logger.info(f"Starting server on {config.HOST}: {config.PORT}")

    socketio.run(
        app,
        host=config.HOST,
        port=config.PORT,
        debug=False
    )

if __name__ == "__main__":
    main()