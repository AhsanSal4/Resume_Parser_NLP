import firebase_admin
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid
from firebase_admin import firestore, credentials
import gspread
from google.oauth2.service_account import Credentials
from resume_parser.ai_model import extract_text_from_pdf, extract_details  # Import AI model functions
from job_role_model import suggest_job_role  # Import job role suggestion function

# Initialize Firebase
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

# Google Sheets Setup
SERVICE_ACCOUNT_FILE = "res.json"  # Path to credentials JSON file
SPREADSHEET_ID = "1inE9BqLytz8r_t8dAnsSBHp9KPEUeDLaojkvqQgDSE4"  # Replace with actual Google Sheet ID

# Authenticate with Google Sheets
creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=["https://www.googleapis.com/auth/spreadsheets"])
client = gspread.authorize(creds)
sheet = client.open_by_key(SPREADSHEET_ID).sheet1  # Open first sheet

# Define expected headers
EXPECTED_HEADERS = ["ID", "Filename", "Name", "Email", "Phone", "LinkedIn", "GitHub", "Skills", "Job Role"]

# In-memory storage for resumes
resumes = {}

def ensure_headers():
    """Ensure headers exist in Google Sheets."""
    existing_headers = sheet.row_values(1)
    if not existing_headers:
        sheet.append_row(EXPECTED_HEADERS)  # Add headers if missing

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def append_to_google_sheet(data):
    """Append extracted resume data to Google Sheets in the correct order."""
    try:
        ensure_headers()
        row = [
            data.get("id", ""),
            data.get("filename", ""),
            data.get("name", ""),
            data.get("email", ""),
            data.get("phone", ""),
            data.get("linkedin", ""),
            data.get("github", ""),
            ", ".join(data.get("skills", [])),  # Convert skills list to a comma-separated string
            data.get("job_role", "Not Assigned")  # Store job role
        ]
        sheet.append_row(row)
        print("✅ Successfully added to Google Sheets.")
    except Exception as e:
        print(f"❌ Error adding to Google Sheets: {str(e)}")

def fetch_resumes_from_sheets():
    """Fetch all resume data from Google Sheets and update in-memory storage."""
    try:
        ensure_headers()
        all_records = sheet.get_all_records()
        resumes.clear()

        for record in all_records:
            resume_id = record.get("ID", "")
            if resume_id:
                resumes[resume_id] = {
                    "id": resume_id,
                    "filename": record.get("Filename", ""),
                    "name": record.get("Name", ""),
                    "email": record.get("Email", ""),
                    "phone": record.get("Phone", ""),
                    "linkedin": record.get("LinkedIn", ""),
                    "github": record.get("GitHub", ""),
                    "skills": record.get("Skills", "").split(", "),
                    "job_role": record.get("Job Role", "Not Assigned")
                }

        print("✅ Successfully fetched resumes from Google Sheets.")
    except Exception as e:
        print(f"❌ Error fetching resumes: {str(e)}")

@app.route("/api/resumes/", methods=["POST"])
def upload_resume():
    """Handle file upload and resume parsing while preventing duplicate uploads based on email."""
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
            return jsonify({"error": "Could not extract text from file"}), 500

        parsed_details = extract_details(extracted_text)

        if "email" not in parsed_details or not parsed_details["email"].strip():
            return jsonify({"error": "No email found in resume. Cannot check for duplicates."}), 400

        fetch_resumes_from_sheets()

        for resume in resumes.values():
            if resume.get("email") == parsed_details["email"]:
                return jsonify({"error": "Duplicate resume detected. A resume with this email already exists."}), 409

        # ✅ Generate Job Role Suggestion based on skills & extracted text
        parsed_details["job_role"] = suggest_job_role(extracted_text, parsed_details["skills"])

        parsed_details["id"] = unique_filename
        parsed_details["filename"] = filename

        # ✅ Store parsed details in Firebase Firestore
        db.collection("resumes").document(unique_filename).set(parsed_details)

        # ✅ Store in-memory for quick access
        resumes[unique_filename] = parsed_details

        # ✅ Append to Google Sheets
        append_to_google_sheet(parsed_details)

        print("✅ Successfully extracted resume details with job role suggestion.")
        return jsonify(parsed_details), 200

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/resumes", methods=["GET"])
def get_all_resumes():
    """Fetch all uploaded resumes from Google Sheets and memory."""
    try:
        fetch_resumes_from_sheets()
        return jsonify(list(resumes.values())), 200
    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/resumes/<resume_id>", methods=["GET"])
def get_resume(resume_id):
    """Fetch a single resume by ID and ensure job role is assigned if missing."""
    try:
        doc = db.collection("resumes").document(resume_id).get()
        if not doc.exists:
            return jsonify({"error": "Resume not found"}), 404

        resume_data = doc.to_dict()

        # ✅ Ensure job role is assigned if missing
        if "job_role" not in resume_data or not resume_data["job_role"]:
            resume_data["job_role"] = suggest_job_role(resume_data.get("extracted_text", ""), resume_data.get("skills", []))
            db.collection("resumes").document(resume_id).update({"job_role": resume_data["job_role"]})

        return jsonify(resume_data), 200
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
@app.route("/api/resumes/<resume_id>", methods=["DELETE"])
def delete_resume(resume_id):
    """Delete a resume by ID from Google Sheets and remove the uploaded file."""
    try:
        print(f"Trying to delete resume: {resume_id}")

        # Fetch latest resumes from Google Sheets
        fetch_resumes_from_sheets()

        if resume_id not in resumes:
            return jsonify({"error": "Resume not found"}), 404
        
        # Remove resume from in-memory storage
        del resumes[resume_id]

        # Remove the uploaded file from local storage
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], resume_id)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Delete from Google Sheets
        sheet_data = sheet.get_all_values()
        for idx, row in enumerate(sheet_data):
            if row and row[0] == resume_id:  # Ensure ID matches
                sheet.delete_rows(idx + 1)
                print(f"✅ Deleted resume {resume_id} from Google Sheets.")
                return jsonify({"message": "Resume deleted successfully"}), 200

        print("⚠️ Resume not found in Google Sheets.")
        return jsonify({"error": "Resume not found in Google Sheets"}), 404

    except Exception as e:
        print(f"❌ Server Error: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)