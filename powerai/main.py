from service.error_handler import register_error_handlers
from service.routes import register_routes
from flask import Flask, jsonify
from flask_cors import CORS
import asyncio


async def create_app():
    app = Flask(__name__)
    CORS(app, origins=["*"])
    register_routes(app)
    register_error_handlers(app)
    return app


async def main():
    app = await create_app()
    app.run(debug=True, host='127.0.0.1', port=9092)
    input("Press Enter to close the browser")


if __name__ == '__main__':
    asyncio.run(main())
