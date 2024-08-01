
import argparse
from flask import Flask
from flask_cors import CORS
from waitress import serve
from .routes import app as blueprints
from .logger import Logger
from .__init__ import __version__

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Run the Chessort server.')
    parser.add_argument('--debug', action='store_true', help='Run the server in debug mode.')
    args = parser.parse_args()

    # Register Flask App
    app = Flask(__name__)
    app.register_blueprint(blueprints)

    # Log startup
    logger = Logger('chessortserver')
    logger.getLogger().info(f"Starting Chessort Server v{__version__}")

    # Disable CORS during local development
    if args.debug:
        CORS(app)

    port = 64355

    if args.debug:
        app.run(host='0.0.0.0', port=port, debug=True)
    else:
        serve(app, host='0.0.0.0', port=port)

if __name__ == '__main__':
    main()
