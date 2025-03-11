import firebase_admin
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
from firebase_admin import firestore,credentials
from resume_parser.ai_model import extract_text_from_pdf, extract_details  # Import the AI model functions

if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_credentials.json")
    firebase_admin.initialize_app(cred)
    
db = firestore.client()


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
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        file.save(file_path)

        extracted_text = extract_text_from_pdf(file_path)
        if not extracted_text.strip():
            return jsonify({"error": "Could not extract text from the file"}), 500

        parsed_details = extract_details(extracted_text)
        parsed_details["id"] = unique_filename
        parsed_details["filename"] = filename

        # Store the parsed resume details in Firebase Firestore
        db.collection("resumes").document(unique_filename).set(parsed_details)

        return jsonify(parsed_details), 200


    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/resumes/<resume_id>", methods=["GET"])
def get_resume(resume_id):
    """Fetch a single resume by ID."""
    try:
        doc = db.collection("resumes").document(resume_id).get()
        if not doc.exists:
            return jsonify({"error": "Resume not found"}), 404
        return jsonify(doc.to_dict()), 200
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/resumes", methods=["GET"])
def get_all_resumes():
    """Fetch all uploaded resumes and remove duplicates by name."""
    try:
        docs = db.collection("resumes").stream()
        resumes_list = [doc.to_dict() for doc in docs]

        # Remove duplicate resumes based on "name"
        unique_resumes = {}
        for resume in resumes_list:
            phone = resume.get("phone")
            if phone and phone not in unique_resumes:
                unique_resumes[phone] = resume  # Store only the first occurrence

        return jsonify(list(unique_resumes.values())), 200  # Return unique values only

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
    
@app.route("/api/resumes/<resume_id>", methods=["DELETE"])
def delete_resume(resume_id):
    """Delete a resume by ID and remove the uploaded file."""
    try:
        doc_ref = db.collection("resumes").document(resume_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"error": "Resume not found"}), 404

        # Retrieve file path from document data
        resume_data = doc.to_dict()
        filename = resume_data.get("id")  # This should match the saved filename

        # Delete document from Firestore
        doc_ref.delete()

        # Remove file from uploads folder
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({"message": "Resume deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500



if __name__ == "__main__":
    app.run(debug=True)