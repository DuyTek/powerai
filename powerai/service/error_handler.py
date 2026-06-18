# error_handlers.py
from flask import jsonify


class APIError(Exception):

    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        error_dict = dict(self.payload or ())
        error_dict['message'] = self.message
        error_dict['status'] = 'error'
        return error_dict


class BadRequestError(APIError):
    def __init__(self, message="Bad request", payload=None):
        super().__init__(message, 400, payload)


class UnauthorizedError(APIError):

    def __init__(self, message="Unauthorized", payload=None):
        super().__init__(message, 401, payload)


class NotFoundError(APIError):
    """404 Not Found Error"""

    def __init__(self, message="Resource not found", payload=None):
        super().__init__(message, 404, payload)


class InternalServerError(APIError):
    """500 Internal Server Error"""

    def __init__(self, message="Internal server error", payload=None):
        super().__init__(message, 500, payload)


def register_error_handlers(app):
    """Register error handlers to a Flask app instance"""

    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"status": "error", "message": "Resource not found"}), 404

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"status": "error", "message": "Bad request"}), 400

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({"status": "error", "message": "Internal server error"}), 500
