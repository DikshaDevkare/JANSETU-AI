import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "JanSetu AI" in data["service"]

def test_get_schemes_and_seeding():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 10
    # Check that PM-KISAN exists
    pm_kisan = next((s for s in schemes if s["code"] == "PM_KISAN"), None)
    assert pm_kisan is not None
    assert "6,000" in pm_kisan["description"]
    assert pm_kisan["official_url"] == "https://pmkisan.gov.in"
    assert "myscheme.gov.in" in pm_kisan["source_citation"]

def test_scheme_filters():
    # Filter by category Agriculture
    res = client.get("/api/schemes?category=Agriculture")
    assert res.status_code == 200
    agri_schemes = res.json()
    assert len(agri_schemes) >= 1
    assert any(s["code"] == "PM_KISAN" for s in agri_schemes)

    # Filter by State Maharashtra
    res_state = client.get("/api/schemes?state=Maharashtra")
    assert res_state.status_code == 200
    maha_schemes = res_state.json()
    assert any(s["code"] == "LADKI_BAHIN_MAHA" for s in maha_schemes)

def test_eligibility_check():
    payload = {
        "scheme_code": "PM_KISAN",
        "occupation": "Farmer",
        "age": 42,
        "state": "Maharashtra",
        "annual_income": 120000
    }
    res = client.post("/api/schemes/eligibility-check", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["scheme_code"] == "PM_KISAN"
    assert data["overall_status"] in ["Likely Eligible", "Needs Verification"]
    assert len(data["satisfied_requirements"]) >= 1

def test_services_api():
    res = client.get("/api/services")
    assert res.status_code == 200
    services = res.json()
    assert len(services) >= 5
    aadhaar = next((s for s in services if s["code"] == "AADHAAR_UPDATE"), None)
    assert aadhaar is not None
    assert "myaadhaar.uidai.gov.in" in aadhaar["official_portal_url"]
    assert len(aadhaar["required_documents"]) >= 1

def test_civic_complaints_flow():
    # 1. Classify
    classify_req = {
        "description": "Big hazardous pothole on Link Road near Andheri station causing traffic accidents",
        "location": "Andheri West"
    }
    class_res = client.post("/api/civic/classify", json=classify_req)
    assert class_res.status_code == 200
    class_data = class_res.json()
    assert "Pothole" in class_data["category"] or "Road" in class_data["category"]
    assert class_data["urgency_level"] in ["High / Urgent", "Medium"]

    # 2. Draft
    draft_req = {
        "category": "Potholes & Damaged Roads",
        "description": "Deep dangerous pothole near Infinity Mall, Link Road",
        "ward_id": "K/West",
        "location_address": "Link Road, Andheri West",
        "landmark": "Near Infinity Mall",
        "citizen_name": "Rohan Sharma"
    }
    draft_res = client.post("/api/civic/draft", json=draft_req)
    assert draft_res.status_code == 200
    draft_data = draft_res.json()
    assert "JS-MUM-" in draft_data["tracking_code"]
    assert "URGENT GRIEVANCE" in draft_data["subject"]
    assert "K/West" in draft_data["routed_authority"]
    assert "portal.mcgm.gov.in" in draft_data["official_portal_link"]
    assert "1916" in draft_data["contact_helpline"]

def test_emergency_helplines():
    res = client.get("/api/helplines")
    assert res.status_code == 200
    helplines = res.json()
    assert len(helplines) >= 6
    # 112 must be present
    h112 = next((h for h in helplines if h["number"] == "112"), None)
    assert h112 is not None
    assert "National Emergency" in h112["name"]

    # 1930 must be present
    h1930 = next((h for h in helplines if h["number"] == "1930"), None)
    assert h1930 is not None
    assert "Cyber" in h1930["category"]

def test_voice_endpoints():
    res_lang = client.get("/api/voice/languages")
    assert res_lang.status_code == 200
    assert len(res_lang.json()["languages"]) >= 4

    res_cap = client.get("/api/voice/capabilities")
    assert res_cap.status_code == 200
    assert res_cap.json()["browser_speech_api_supported"] is True

def test_grounded_assistant_chat():
    # Test Farmer query
    chat_req = {
        "message": "kisan yojana me kitna paisa milta hai aur documents kya lagenge?",
        "language": "hinglish"
    }
    res = client.post("/api/assistant/chat", json=chat_req)
    assert res.status_code == 200
    data = res.json()
    assert "6,000" in data["reply"] or "PM-KISAN" in data["reply"]
    assert len(data["citations"]) >= 1
    assert "pmkisan.gov.in" in data["citations"][0]["url"]

    # Test Marathi query
    mr_req = {
        "message": "मला लाडकी बहीण योजनेची माहिती हवी आहे",
        "language": "mr"
    }
    res_mr = client.post("/api/assistant/chat", json=mr_req)
    assert res_mr.status_code == 200
    data_mr = res_mr.json()
    assert "१,५००" in data_mr["reply"] or "लाडकी बहीण" in data_mr["reply"]
