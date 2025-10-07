import sys
import os
import threading
import time
import webview

# Ensure src/ is in path
THIS_DIR = os.path.dirname(os.path.dirname(__file__))  # src/
sys.path.insert(0, THIS_DIR)

from api import live_app  # Flask-SocketIO server

# Frontend config
FRONTEND_PORT = 5173
FRONTEND_URL = f"http://localhost:{FRONTEND_PORT}"

# ----------------------------
# Start Flask-SocketIO server
# ----------------------------
def start_flask():
    print("Starting Flask-SocketIO server on http://0.0.0.0:8000")
    live_app.socketio.run(
        live_app.app,
        host="0.0.0.0",
        port=8000,
        debug=False,       # must be False in a thread on Windows
        use_reloader=False
    )

# ----------------------------
# Main launcher
# ----------------------------
if __name__ == "__main__":
    # Start Flask server in a daemon thread
    flask_thread = threading.Thread(target=start_flask, daemon=True)
    flask_thread.start()

    # Give server a moment to start
    time.sleep(2)

    # Launch WebView window (must be in main thread)
    webview.create_window("Space Station — Live Detection", FRONTEND_URL)
    webview.start()
