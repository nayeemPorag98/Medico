from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import answer_query
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Check if it's a medical question (optional, reusing existing logic if easily available or just passing through)
        # For now, we pass directly to answer_query which handles the flow
        response_text = answer_query(user_message)
        
        return jsonify({
            'response': response_text,
            'success': True
        })
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
