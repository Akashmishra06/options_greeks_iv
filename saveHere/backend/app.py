from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))

@app.route('/data/<filename>')
def get_csv(filename):
    file_path = os.path.join(DATA_DIR, filename)
    if os.path.isfile(file_path):
        return send_from_directory(DATA_DIR, filename)
    return jsonify({"error": "File not found"}), 404

@app.route('/')
def root():
    return send_from_directory(os.path.join(os.path.dirname(__file__), '..', 'static'), 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
