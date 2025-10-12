from flask import Flask
from flask_socketio import SocketIO
from config import Config 
from detection_service import DetectionService 
from socket_handlers import SocketIOHandlers
import logging
import threading

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Global variables for lazy loading
detection_service = None
service_ready = threading.Event()

def load_model_async(config: Config):
    """Load model asynchronously to avoid blocking server startup."""
    global detection_service
    try:
        logger.info("Loading detection model in background...")
        detection_service = DetectionService(config.MODEL_PATH)
        service_ready.set()
        logger.info("✓ Detection model loaded successfully!")
    except Exception as e:
        logger.error(f"✗ Failed to load model: {e}")

def create_app(config: Config) -> tuple[Flask, SocketIO]:
    """
    Application factory for creating flask app and SocketIO instance.

    @param {Config} config - Application configuration
    @return {tuple} - Flask app and SocketIO instance
    """

    # Initialize Flask
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your-secret-key-here'

    # Initialize SocketIO with optimized settings
    socketio = SocketIO(
        app, 
        cors_allowed_origins=config.CORS_ALLOWED_ORIGINS,
        async_mode=config.ASYNC_MODE,
        max_http_buffer_size=config.MAX_HTTP_BUFFER_SIZE,
        ping_timeout=60,
        ping_interval=25,
        logger=False,  # Disable verbose SocketIO logs
        engineio_logger=False
    )

    # Start model loading in background thread
    model_thread = threading.Thread(target=load_model_async, args=(config,), daemon=True)
    model_thread.start()

    # Create handlers (will use global detection_service)
    handlers = SocketIOHandlers(lambda: detection_service, service_ready)

    @app.route("/")
    def home() -> str:
        """Health check endpoint."""
        return "YOLO Live Detection Server is running"
    
    @app.route("/health")
    def health() -> dict:
        """Route for server health"""
        model_status = "ready" if service_ready.is_set() else "loading"
        return {
            "status": "healthy",
            "model_status": model_status,
            "model_loaded": detection_service is not None and detection_service.model is not None,
            "version": "1.0.0"
        }
    
    @app.route("/ready")
    def ready() -> dict:
        """Check if model is ready for inference."""
        is_ready = service_ready.is_set()
        return {
            "ready": is_ready,
            "message": "Model ready" if is_ready else "Model still loading..."
        }, 200 if is_ready else 503
    
    # Register SocketIO event handlers
    socketio.on_event("image", handlers.handle_image)
    socketio.on_event("connect", handlers.handle_connect)
    socketio.on_event("disconnect", handlers.handle_disconnect)
    
    # Add endpoint to check active clients
    @app.route("/clients")
    def active_clients() -> dict:
        """Get number of active connected clients."""
        return {
            "active_clients": handlers.get_active_client_count(),
            "status": "running"
        }

    logger.info("✓ Application initialized successfully (model loading in background)")

    return app, socketio


def main():
    """Main entry point of the server"""
    config = Config()
    
    logger.info(f"Starting server on {config.HOST}:{config.PORT}")
    logger.info("Server will start immediately, model loads in background")
    
    app, socketio = create_app(config)

    socketio.run(
        app,
        host=config.HOST,
        port=config.PORT,
        debug=False,
        allow_unsafe_werkzeug=True  # For development
    )

if __name__ == "__main__":
    main()