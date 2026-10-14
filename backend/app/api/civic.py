from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import random
import re
from app.core.database import get_db
from app.models.civic_complaint import CivicComplaint
from app.schemas.civic import (
    CivicClassifyRequest, CivicClassifyResponse,
    CivicDraftRequest, CivicDraftResponse,
    CivicComplaintSave, CivicComplaintOut
)

router = APIRouter(prefix="/civic", tags=["Civic Complaints"])

BMC_WARDS = [
    {"ward_id": "A", "name": "Ward A (Colaba, Fort, Nariman Point)", "office": "134 E, SBS Road, Fort, Mumbai - 400001", "phone": "022-22661234", "officer": "Assistant Commissioner (Ward A)"},
    {"ward_id": "C", "name": "Ward C (Marine Lines, Bhuleshwar)", "office": "76, Shrikant Palekar Marg, Chandanwadi, Mumbai - 400002", "phone": "022-22014022", "officer": "Assistant Commissioner (Ward C)"},
    {"ward_id": "D", "name": "Ward D (Malabar Hill, Grant Road, Tardeo)", "office": "Jobanputra Compound, Nana Chowk, Mumbai - 400007", "phone": "022-23861426", "officer": "Assistant Commissioner (Ward D)"},
    {"ward_id": "F/North", "name": "Ward F/North (Matunga, Sion, Wadala)", "office": "Plot 96, Bhau Daji Marg, Matunga, Mumbai - 400019", "phone": "022-24024353", "officer": "Assistant Commissioner (Ward F/N)"},
    {"ward_id": "G/South", "name": "Ward G/South (Worli, Prabhadevi, Lower Parel)", "office": "Dhanmill Naka, N.M. Joshi Marg, Mumbai - 400013", "phone": "022-24305031", "officer": "Assistant Commissioner (Ward G/S)"},
    {"ward_id": "H/West", "name": "Ward H/West (Bandra West, Khar, Santacruz West)", "office": "Saint Martin Road, Behind Bandra Police Station, Mumbai - 400050", "phone": "022-26422311", "officer": "Assistant Commissioner (Ward H/W)"},
    {"ward_id": "K/East", "name": "Ward K/East (Andheri East, Jogeshwari East)", "office": "Gundavali, Azad Road, Andheri East, Mumbai - 400069", "phone": "022-26840103", "officer": "Assistant Commissioner (Ward K/E)"},
    {"ward_id": "K/West", "name": "Ward K/West (Andheri West, Versova, Juhu)", "office": "Paliram Path, Near S.V. Road, Andheri West, Mumbai - 400058", "phone": "022-26201460", "officer": "Assistant Commissioner (Ward K/W)"},
    {"ward_id": "P/North", "name": "Ward P/North (Malad West, Malad East)", "office": "Liberty Garden, Mamlatdarwadi, Malad West, Mumbai - 400064", "phone": "022-28823266", "officer": "Assistant Commissioner (Ward P/N)"},
    {"ward_id": "R/Central", "name": "Ward R/Central (Borivali West/East)", "office": "Chandavarkar Road, Borivali West, Mumbai - 400092", "phone": "022-28946000", "officer": "Assistant Commissioner (Ward R/C)"}
]

CATEGORY_KEYWORDS = {
    "Potholes & Damaged Roads": ["pothole", "potholes", "road", "gaddha", "khadde", "sadak", "tarmac", "asphalt", "crater", "rasta"],
    "Garbage & Sanitation": ["garbage", "kachra", "trash", "waste", "dustbin", "dump", "smell", "rotting", "stinking", "cleaning", "safai"],
    "Water Disruption & Leakage": ["water", "pani", "pipe", "pipeline", "leak", "leakage", "pressure", "tap", "drinking water", "supply", "jal"],
    "Drainage & Flooding": ["drain", "drainage", "gutter", "waterlogging", "flood", "sewage", "manhole", "overflow", "nalah", "nalla"],
    "Broken Streetlights": ["streetlight", "light", "batti", "dark", "lamp", "pole", "wire", "lighting", "bulb", "illumination"],
    "Fallen Trees & Hazardous Branches": ["tree", "branch", "zhudup", "per", "fallen tree", "blocking", "wood", "horticulture", "hazard"],
    "Public Sanitation & Toilets": ["toilet", "shauchalay", "urinal", "public toilet", "sanitation", "hygiene", "clogged"]
}

@router.get("/authorities")
def get_authorities():
    return {
        "bmc_helpline": "1916 (24x7)",
        "bmc_whatsapp_grievance": "+91 8999 22 8999",
        "official_bmc_portal": "https://portal.mcgm.gov.in",
        "official_central_portal": "https://pgportal.gov.in (CPGRAMS)",
        "official_maharashtra_portal": "https://grievances.maharashtra.gov.in (Aaple Sarkar)",
        "wards": BMC_WARDS
    }

@router.post("/classify", response_model=CivicClassifyResponse)
def classify_complaint(req: CivicClassifyRequest):
    desc_lower = req.description.lower()
    matched_cat = "Other Civic Issue"
    highest_matches = 0
    detected_words: list[str] = []

    for cat, keywords in CATEGORY_KEYWORDS.items():
        matches = [kw for kw in keywords if re.search(r'\b' + re.escape(kw) + r'\b', desc_lower)]
        if len(matches) > highest_matches:
            highest_matches = len(matches)
            matched_cat = cat
            detected_words = matches

    # Determine urgency
    urgency = "Medium"
    critical_keywords = ["manhole", "flood", "spark", "wire", "accident", "emergency", "danger", "hazard", "severe", "khula", "currant"]
    if any(cw in desc_lower for cw in critical_keywords):
        urgency = "High / Urgent"

    # Match ward from text if mentioned
    matched_ward = None
    for w in BMC_WARDS:
        w_short = w["ward_id"].lower()
        if w_short in desc_lower or any(part.lower() in desc_lower for part in w["name"].split()):
            matched_ward = w["name"]
            break

    return CivicClassifyResponse(
        category=matched_cat,
        urgency_level=urgency,
        identified_keywords=detected_words,
        recommended_ward=matched_ward,
        confidence_score=0.94 if highest_matches > 0 else 0.70
    )

@router.post("/draft", response_model=CivicDraftResponse)
def generate_draft(req: CivicDraftRequest):
    now = datetime.now(timezone.utc)
    random_num = random.randint(1000, 9999)
    tracking_code = f"JS-MUM-{now.year}-{random_num}"

    # Determine ward
    selected_ward = next((w for w in BMC_WARDS if w["ward_id"] == req.ward_id or w["name"] == req.ward_id), None)
    if not selected_ward:
        selected_ward = BMC_WARDS[7]  # Default to K/West if unspecified

    # Urgency analysis
    urgency = "High" if any(w in req.description.lower() for w in ["accident", "danger", "manhole", "burst", "flood", "urgent", "hazard"]) else "Medium"

    # Draft Subject
    location_str = f"{req.location_address or ''} {f'(Landmark: {req.landmark})' if req.landmark else ''}".strip()
    if not location_str:
        location_str = f"{selected_ward['name']}, Mumbai"

    subject = f"URGENT GRIEVANCE: Rectification of {req.category} at {location_str}"

    # Draft Body
    letter_body = (
        f"To,\n"
        f"The Executive Engineer / Assistant Commissioner,\n"
        f"{selected_ward['officer']},\n"
        f"Brihanmumbai Municipal Corporation (BMC),\n"
        f"{selected_ward['office']}\n\n"
        f"Date: {now.strftime('%d-%m-%Y')}\n\n"
        f"Subject: {subject}\n\n"
        f"Respected Sir/Madam,\n\n"
        f"I am writing as a responsible citizen residing in / passing through {location_str} to formally bring to your urgent attention a serious public civic hazard regarding '{req.category}'.\n\n"
        f"Incident Details & Ground Conditions:\n"
        f"• Precise Location: {location_str}\n"
        f"• Ward Jurisdiction: {selected_ward['name']}\n"
        f"• Reported Civic Issue: {req.description.strip()}\n"
        f"• Assessed Civic Hazard Level: {urgency}\n\n"
        f"Impact on Citizens:\n"
        f"The aforementioned issue is causing significant hardship to pedestrians, senior citizens, and vehicular traffic, and presents an escalating safety hazard if not attended to promptly by the concerned maintenance squad.\n\n"
        f"Requested Statutory Action:\n"
        f"In accordance with the citizen charter of the Municipal Corporation of Greater Mumbai (MCGM), I respectfully request your office to inspect the site and issue immediate work orders for permanent rectification at the earliest.\n\n"
        f"Thanking you,\n\n"
        f"Yours faithfully,\n"
        f"{req.citizen_name or 'Concerned Citizen'}\n"
        f"Contact: {req.contact_phone or 'Provided via Official Portal'}\n"
        f"Generated via JanSetu AI Citizen Assistance Draft (Ref: {tracking_code})"
    )

    instructions = [
        "1. Click 'Copy Draft' below to copy the complete formatted grievance letter.",
        f"2. Open the official BMC Portal (portal.mcgm.gov.in) or send a WhatsApp message to +91 8999 22 8999.",
        f"3. Paste this letter into the complaint description box and attach photos if available.",
        f"4. If this is an immediate public safety hazard, you may also call the 24x7 BMC Control Room at 1916 quoting your location."
    ]

    return CivicDraftResponse(
        tracking_code=tracking_code,
        category=req.category,
        urgency_level=urgency,
        subject=subject,
        letter_body=letter_body,
        routed_authority=f"BMC {selected_ward['name']} (Maintenance / Ward Control)",
        official_portal_link="https://portal.mcgm.gov.in",
        contact_helpline=f"BMC 1916 / Ward Office: {selected_ward['phone']}",
        instructions=instructions
    )

@router.post("/drafts", response_model=CivicComplaintOut)
def save_complaint_draft(req: CivicComplaintSave, db: Session = Depends(get_db)):
    complaint = CivicComplaint(
        tracking_code=req.tracking_code,
        category=req.category,
        description=req.description,
        ward_id=req.ward_id,
        location_address=req.location_address,
        landmark=req.landmark,
        urgency_level=req.urgency_level,
        ai_draft_subject=req.ai_draft_subject,
        ai_draft_body=req.ai_draft_body,
        routed_authority=req.routed_authority,
        official_portal_link=req.official_portal_link,
        contact_helpline=req.contact_helpline,
        status="Draft"
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return complaint

@router.get("/drafts", response_model=list[CivicComplaintOut])
def get_complaint_drafts(db: Session = Depends(get_db)):
    return db.query(CivicComplaint).order_by(CivicComplaint.created_at.desc()).all()
