from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
from resume_parser.ai_model import extract_text_from_pdf, extract_details  # Import the AI model functions

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"pdf", "docx"}  # Allow both PDF and DOCX files

# In-memory storage for resumes (replace with a database in production)
resumes = {}

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/resumes/", methods=["POST"])
def upload_resume():
    """Handle file upload and resume parsing."""
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Only PDF and DOCX are allowed."}), 400

    try:
        # Generate a unique filename to avoid conflicts
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        file.save(file_path)

        print(f"✅ File uploaded successfully: {file_path}")

        # Extract text from the resume using the AI model
        extracted_text = extract_text_from_pdf(file_path)
        if not extracted_text.strip():
            print("❌ Could not extract text from the file.")
            return jsonify({"error": "Could not extract text from the file"}), 500

        # Extract structured details from the text using the AI model
        parsed_details = extract_details(extracted_text)

        # Add the unique filename as the ID for the resume
        parsed_details["id"] = unique_filename
        parsed_details["filename"] = filename

        # Store the parsed details in memory
        resumes[unique_filename] = parsed_details

        print("✅ Successfully extracted resume details.")
        return jsonify(parsed_details), 200

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/resumes/<resume_id>", methods=["GET"])
def get_resume(resume_id):
    """Fetch a single resume by ID."""
    try:
        if resume_id not in resumes:
            return jsonify({"error": "Resume not found"}), 404

        return jsonify(resumes[resume_id]), 200
    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/resumes", methods=["GET"])
def get_all_resumes():
    """Fetch all uploaded resumes."""
    try:
        return jsonify(list(resumes.values())), 200
    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(debug=True)