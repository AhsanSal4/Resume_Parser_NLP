import spacy
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load NLP Model
nlp = spacy.load("en_core_web_sm")

# Predefined Job Roles with Required Skills
job_roles = {
    # Software Development & Engineering
    "Software Engineer": ["Python", "Java", "C++", "SQL", "Git", "Data Structures", "Algorithms"],
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "HTML", "CSS"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "UI/UX", "Bootstrap"],
    "Backend Developer": ["Node.js", "Django", "Flask", "Databases", "MongoDB", "REST APIs"],
    "Mobile App Developer": ["Flutter", "React Native", "Swift", "Kotlin", "Dart", "Android", "iOS"],
    "Game Developer": ["Unity", "C#", "Unreal Engine", "Blender", "3D Modeling", "Game AI"],
    "Embedded Systems Engineer": ["C", "C++", "Microcontrollers", "RTOS", "IoT", "Assembly"],
    "Software Architect": ["Microservices", "Cloud Computing", "System Design", "Kubernetes", "CI/CD"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform", "CI/CD"],
    "Cloud Engineer": ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "DevOps"],

    # Data Science & AI
    "Data Scientist": ["Python", "Machine Learning", "Deep Learning", "Pandas", "TensorFlow", "SQL"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "NLP", "Data Preprocessing"],
    "AI Research Scientist": ["Deep Learning", "Generative AI", "Computer Vision", "NLP", "Reinforcement Learning"],
    "Deep Learning Engineer": ["Neural Networks", "TensorFlow", "PyTorch", "GPU Computing"],
    "Computer Vision Engineer": ["OpenCV", "YOLO", "TensorFlow", "Image Processing", "CNN"],
    "NLP Engineer": ["Spacy", "Hugging Face", "BERT", "Transformer Models", "Text Processing"],
    "Data Engineer": ["Big Data", "Spark", "Hadoop", "Kafka", "ETL", "SQL"],
    "Big Data Engineer": ["Hadoop", "Spark", "Hive", "Kafka", "NoSQL"],
    "AI Ethics Researcher": ["Bias Mitigation", "Explainable AI", "Fair AI", "AI Regulations"],
    "Predictive Analytics Specialist": ["Statistics", "Forecasting", "Regression Models", "Data Mining"],

    # Cybersecurity & Networking
    "Cybersecurity Analyst": ["Penetration Testing", "SIEM", "Firewall", "Network Security"],
    "Ethical Hacker": ["Metasploit", "Burp Suite", "Nmap", "Wireshark", "Kali Linux"],
    "Security Engineer": ["Network Security", "Firewalls", "SIEM", "Threat Detection"],
    "Cloud Security Engineer": ["AWS Security", "IAM", "Cloud Penetration Testing"],
    "SOC Analyst": ["Incident Response", "Threat Intelligence", "SIEM", "Forensics"],
    "Cryptographer": ["Encryption", "Blockchain Security", "RSA", "Elliptic Curve Cryptography"],
    "Malware Analyst": ["Reverse Engineering", "Assembly", "Virus Detection", "YARA"],
    "Incident Response Specialist": ["Digital Forensics", "SIEM", "Log Analysis", "Threat Intelligence"],
    "Security Architect": ["Zero Trust Architecture", "Firewalls", "IAM", "Encryption"],
    "Blockchain Security Engineer": ["Smart Contracts", "Ethereum", "Solidity", "Blockchain Forensics"],

    # Web Development
    "Web Developer": ["HTML", "CSS", "JavaScript", "React", "Angular", "Vue.js"],
    "WordPress Developer": ["PHP", "CSS", "HTML", "WordPress Plugins", "SEO"],
    "Shopify Developer": ["Liquid", "Shopify APIs", "eCommerce Development"],
    "Web3 Developer": ["Solidity", "Ethereum", "Smart Contracts", "DApp"],
    "UI/UX Designer": ["Adobe XD", "Figma", "Sketch", "Wireframing", "Prototyping"],
    "Web Performance Engineer": ["WebAssembly", "Caching", "Lighthouse"],
    "CMS Developer": ["Drupal", "Joomla", "WordPress", "Content Management Systems"],
    "eCommerce Developer": ["Magento", "WooCommerce", "BigCommerce", "Shopify"],
    "Next.js Developer": ["React", "Server-side Rendering", "SEO Optimization"],
    "Web Accessibility Engineer": ["WCAG", "ARIA", "Screen Readers", "Semantic HTML"],

    # Cloud & IT Infrastructure
    "Cloud Architect": ["AWS", "GCP", "Azure", "Hybrid Cloud", "Kubernetes"],
    "AWS Engineer": ["EC2", "Lambda", "S3", "IAM", "AWS SDK"],
    "Azure Engineer": ["Azure Functions", "Azure AD", "Azure DevOps", "VMs"],
    "GCP Engineer": ["Google Kubernetes Engine", "Firebase", "BigQuery"],
    "Kubernetes Engineer": ["Containers", "Helm Charts", "Cluster Management"],
    "System Administrator": ["Linux", "Windows Server", "Active Directory"],
    "Network Engineer": ["Cisco", "Juniper", "Firewalls", "BGP", "Routing"],
    "IT Support Specialist": ["Help Desk", "ITIL", "Troubleshooting"],
    "Database Administrator": ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    "Storage Engineer": ["SAN", "NAS", "Cloud Storage", "Backup Solutions"],

    # Business & Management Roles
    "Product Manager": ["Agile", "Scrum", "User Research", "Roadmaps"],
    "Technical Program Manager": ["Project Planning", "Stakeholder Management"],
    "Scrum Master": ["Agile Framework", "Kanban", "Team Facilitation"],
    "Business Intelligence Analyst": ["Power BI", "Tableau", "Data Analysis"],
    "IT Consultant": ["Business Strategy", "Digital Transformation", "Cloud Migration"],
    "Digital Marketing Manager": ["SEO", "PPC", "Google Ads", "Email Marketing"],
    "Tech Recruiter": ["Talent Acquisition", "HRTech", "Interviewing"],
    "Customer Success Engineer": ["CRM", "Customer Engagement", "Technical Support"],
    "Sales Engineer": ["Pre-Sales", "B2B Sales", "Solution Architecture"],
    "ERP Consultant": ["SAP", "Oracle ERP", "Business Process Modeling"],

    # Other Technical Roles
    "IoT Engineer": ["Arduino", "Raspberry Pi", "IoT Protocols"],
    "Quantum Computing Engineer": ["Qiskit", "IBM Quantum Experience"],
    "Autonomous Vehicle Engineer": ["Self-Driving Cars", "LiDAR", "Sensor Fusion"],
    "Wearable Tech Developer": ["Smartwatches", "Fitness Trackers"],
    "Aerospace Software Engineer": ["Flight Control", "Embedded Systems"],
    "Bioinformatics Developer": ["Genomics", "R Programming", "Biostatistics"],
    "FPGA Engineer": ["VHDL", "Verilog", "Digital Logic Design"],
    "VR Developer": ["Unity", "Oculus SDK", "HTC Vive"],
    "AR Developer": ["ARKit", "ARCore", "Marker-Based Tracking"],
    "Computer Hardware Engineer": ["PCB Design", "Microprocessors", "Embedded Systems"],"Software Engineer": ["Python", "Java", "C++", "SQL", "Git", "Data Structures", "Algorithms"],
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "HTML", "CSS"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "UI/UX", "Bootstrap"],
    "Backend Developer": ["Node.js", "Django", "Flask", "Databases", "MongoDB", "REST APIs"],
    "Embedded Systems Engineer": ["C", "C++", "Microcontrollers", "RTOS", "IoT", "Assembly"],
    "Game Developer": ["Unity", "C#", "Unreal Engine", "Blender", "3D Modeling", "Game AI"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform", "CI/CD"],
    "Mobile App Developer": ["Flutter", "React Native", "Swift", "Kotlin", "Dart", "Android", "iOS"],
    "Blockchain Developer": ["Solidity", "Ethereum", "Smart Contracts", "DApp", "Web3.js"],
    "Cloud Engineer": ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "DevOps"],

    # DATA SCIENCE & AI
    "Data Scientist": ["Python", "Machine Learning", "Deep Learning", "Pandas", "TensorFlow", "SQL"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "NLP", "Data Preprocessing"],
    "AI Research Scientist": ["Deep Learning", "Generative AI", "Computer Vision", "NLP", "Reinforcement Learning"],
    "Data Engineer": ["Big Data", "Spark", "Hadoop", "Kafka", "ETL", "SQL"],
    "Predictive Analytics Specialist": ["Statistics", "Forecasting", "Regression Models", "Data Mining"],

    # CYBERSECURITY & NETWORKING
    "Cybersecurity Analyst": ["Penetration Testing", "SIEM", "Firewall", "Network Security"],
    "Ethical Hacker": ["Metasploit", "Burp Suite", "Nmap", "Wireshark", "Kali Linux"],
    "Security Engineer": ["Network Security", "Firewalls", "SIEM", "Threat Detection"],
    "Blockchain Security Engineer": ["Smart Contracts", "Ethereum", "Solidity", "Blockchain Forensics"],

    # MECHANICAL & AUTOMOTIVE ENGINEERING
    "Mechanical Engineer": ["SolidWorks", "AutoCAD", "ANSYS", "Thermodynamics", "CAD/CAM"],
    "Automobile Engineer": ["Vehicle Dynamics", "Combustion Engines", "Chassis Design"],
    "Aerospace Engineer": ["Aerodynamics", "CFD", "Aircraft Structures", "Propulsion"],
    "Manufacturing Engineer": ["Lean Manufacturing", "Six Sigma", "CNC Machining"],
    "Mechatronics Engineer": ["Robotics", "Embedded Systems", "Actuators", "Sensors"],

    # CIVIL & CONSTRUCTION ENGINEERING
    "Civil Engineer": ["AutoCAD", "Structural Analysis", "Concrete Technology"],
    "Structural Engineer": ["Finite Element Analysis", "Load Calculations"],
    "Geotechnical Engineer": ["Soil Mechanics", "Slope Stability", "Foundation Design"],
    "Construction Manager": ["Project Scheduling", "Budgeting", "Safety Regulations"],
    "Urban Planner": ["GIS Mapping", "Zoning Laws", "Traffic Analysis"],

    # ELECTRICAL & ELECTRONICS ENGINEERING
    "Electrical Engineer": ["Power Systems", "Circuit Design", "MATLAB"],
    "Electronics Engineer": ["VLSI", "Embedded Systems", "Signal Processing"],
    "Control Systems Engineer": ["PLC", "SCADA", "PID Controllers"],
    "Telecommunications Engineer": ["Wireless Communication", "RF Engineering"],
    "Renewable Energy Engineer": ["Solar Panels", "Wind Energy", "Grid Integration"],

    # BUSINESS & MANAGEMENT
    "Product Manager": ["Agile", "Scrum", "User Research", "Roadmaps"],
    "Business Analyst": ["Market Research", "Data Analysis", "Financial Modeling"],
    "Operations Manager": ["Supply Chain", "Logistics", "Process Optimization"],
    "Human Resources Manager": ["Talent Acquisition", "Employee Relations", "HR Analytics"],
    "Marketing Manager": ["SEO", "PPC", "Google Ads", "Email Marketing"],
    "Digital Marketing Specialist": ["Content Marketing", "Social Media", "Influencer Marketing"],
    "Sales Manager": ["CRM", "B2B Sales", "Lead Generation"],
    "Supply Chain Manager": ["Procurement", "Inventory Management", "Logistics"],
    "Corporate Lawyer": ["Contracts", "Intellectual Property", "Business Law"],

    # HEALTHCARE & MEDICAL
    "Doctor": ["General Medicine", "Diagnosis", "Patient Care"],
    "Surgeon": ["Surgery Techniques", "Anatomy", "Emergency Procedures"],
    "Pharmacist": ["Pharmaceuticals", "Drug Interactions", "Prescription Management"],
    "Medical Researcher": ["Clinical Trials", "Biotechnology", "Epidemiology"],
    "Biomedical Engineer": ["Medical Devices", "Bioinformatics", "MRI"],
    "Nurse": ["Patient Care", "Emergency Response", "Medical Procedures"],
    "Veterinarian": ["Animal Care", "Veterinary Medicine", "Surgery"],
    "Dentist": ["Oral Surgery", "Orthodontics", "Dental Hygiene"],
    
    # FINANCE & ACCOUNTING
    "Financial Analyst": ["Stock Market", "Investment Strategies", "Risk Assessment"],
    "Investment Banker": ["Mergers and Acquisitions", "Capital Markets", "Valuation"],
    "Chartered Accountant": ["Taxation", "Auditing", "Financial Reporting"],
    "Actuary": ["Risk Modeling", "Probability", "Insurance"],
    "Economist": ["Market Trends", "Economic Forecasting", "GDP Analysis"],
    
    # EDUCATION & RESEARCH
    "Professor": ["Teaching", "Curriculum Development", "Research"],
    "Educational Consultant": ["Training Programs", "Instructional Design"],
    "Psychologist": ["Behavioral Analysis", "Therapy", "Counseling"],
    
    # ART, DESIGN & ENTERTAINMENT
    "Graphic Designer": ["Adobe Photoshop", "Illustrator", "Branding"],
    "Fashion Designer": ["Textile Design", "Trend Forecasting"],
    "Music Producer": ["Mixing", "Sound Engineering"],
    "Film Director": ["Cinematography", "Screenwriting"],
    
    # LAW & PUBLIC SERVICE
    "Judge": ["Legal Analysis", "Courtroom Procedures"],
    "Police Officer": ["Criminal Law", "Investigation Techniques"],
    "Social Worker": ["Community Service", "Counseling"],
    
    # AGRICULTURE & ENVIRONMENT
    "Agricultural Engineer": ["Soil Science", "Crop Production"],
    "Environmental Scientist": ["Climate Change", "Pollution Control"],
    
    # AVIATION & MARINE
    "Pilot": ["Flight Operations", "Navigation"],
    "Marine Engineer": ["Ship Design", "Ocean Engineering"],

    # SPORTS & FITNESS
    "Athletic Trainer": ["Sports Medicine", "Rehabilitation"],
    "Yoga Instructor": ["Meditation", "Body Flexibility"],

    # MEDIA & JOURNALISM
    "Journalist": ["News Reporting", "Editing"],
    "Photographer": ["Image Editing", "Composition"],
    
    # OTHER EMERGING JOBS
    "Space Scientist": ["Astrophysics", "Satellite Technology"],
    "Crypto Analyst": ["Blockchain", "Trading"],
    "AI Ethics Researcher": ["Fair AI", "Bias Mitigation"],
}


def preprocess_text(text):
    """Basic text preprocessing."""
    if not text:  # Ensure text is not empty
        return ""
    doc = nlp(text.lower())
    return " ".join([token.lemma_ for token in doc if not token.is_stop and not token.is_punct])

def suggest_job_role(resume_text, extracted_skills):
    """Suggests a job role based on extracted resume text and skills."""
    if not resume_text and not extracted_skills:
        return "Unknown"

    job_roles_texts = [" ".join(skills) for skills in job_roles.values()]
    all_texts = [preprocess_text(resume_text)] + job_roles_texts

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    best_match_index = np.argmax(similarity_scores)

    suggested_role = list(job_roles.keys())[best_match_index]
    
    print(f"📌 Suggested Job Role: {suggested_role}")  # ✅ Debugging

    return suggested_role