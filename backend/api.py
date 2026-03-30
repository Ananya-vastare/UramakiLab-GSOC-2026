from flask import Flask, request, jsonify
from flask_cors import CORS 
from framework import run_evaluation # Import the framework
import uuid

app = Flask(__name__)
CORS(app) 

@app.route("/generate-prompt", methods=['POST'])#to send the data to the user
def generate_prompt_endpoint():
    data = request.json
    user_input = data.get("input")
    methodology = data.get("methodology", "General")

    if not user_input:#if the user does not enter any input
        return jsonify({"error": "No input provided"}), 400

    try:
        # Trigger framework
        generated_content = run_evaluation(user_input)
        
        # Return the structure your React hook expects
        return jsonify({
            "id": str(uuid.uuid4()),
            "content": generated_content,
            "methodology": methodology
        })

    except Exception as e:#throws an exception when the server does not respond
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":#runs on port 5000
    app.run(port=5000, debug=True)