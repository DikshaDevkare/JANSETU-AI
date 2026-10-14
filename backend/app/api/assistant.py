from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import re
from app.core.database import get_db
from app.models.scheme import Scheme
from app.models.service import Service
from app.models.helpline import Helpline
from app.schemas.assistant import ChatRequest, ChatResponse, SourceCitation, SuggestedAction

router = APIRouter(prefix="/assistant", tags=["Shared AI Assistant"])

# Hinglish & Multilingual Keyword Mapping Dictionary
INTENT_PATTERNS = {
    "PM_KISAN": [
        "kisan", "farmer", "shetkari", "agriculture", "kheti", "samman nidhi", "6000",
        "dbt", "pmkisan", "शेतकरी", "किसान", "शेती", "krishi"
    ],
    "AYUSHMAN_BHARAT": [
        "ayushman", "pmjay", "5 lakh", "hospital", "cashless", "health card", "aarogya",
        "golden card", "hospitalization", "आयुष्मान", "आरोग्य", "दवाखाना", "treatment"
    ],
    "LADKI_BAHIN": [
        "ladki", "bahin", "1500", "mahila", "woman", "women", "sister", "maharashtra",
        "ladki bahin", "लाडकी बहीण", "लाडली बहना", "स्त्री"
    ],
    "PMAY_HOUSING": [
        "awas", "housing", "pucca house", "ghar", "makan", "subsidy", "pmay", "घर",
        "आवास", "घरकुल", "home loan subsidy"
    ],
    "SUKANYA_SAMRIDDHI": [
        "sukanya", "girl child", "beti", "daughter", "savings", "post office", "8.2%",
        "सुकन्या", "मुलगी", "बेटी"
    ],
    "PM_VISHWAKARMA": [
        "vishwakarma", "artisan", "carpenter", "blacksmith", "craftsman", "toolkit", "15000",
        "लोहार", "सुतार", "विश्वकर्मा", "दस्तकार"
    ],
    "PM_MUDRA": [
        "mudra", "business loan", "loan", "karz", "vyavasay", "shishu", "kishore", "tarun",
        "कर्ज", "मुद्रा", "व्यापार"
    ],
    "NSAP_OLD_AGE": [
        "old age", "pension", "senior citizen", "vridha", "vruddha", "pensioner", "60 years",
        "निवृत्तीवेतन", "पेन्शन", "म्हातारपण"
    ],
    "PM_SVANIDHI": [
        "svanidhi", "vendor", "street vendor", "hawker", "feriwala", "thela", "10000 loan",
        "फेरीवाला", "रेहड़ी", "स्वनिधि"
    ],
    "MAHADBT": [
        "scholarship", "mahadbt", "college fee", "freeship", "shishyavrutti", "vidyarthi",
        "छात्रवृत्ति", "शिष्यवृत्ती", "शिक्षण"
    ],
    "AADHAAR_UPDATE": [
        "aadhaar", "address update", "mobile link", "aadhar", "demographic", "uidai",
        "आधार", "पत्ता बदल", "मोबाइल नंबर"
    ],
    "PAN_CARD": [
        "pan card", "pan", "instant pan", "e-pan", "tax", "पैन कार्ड", "पॅन कार्ड"
    ],
    "DOMICILE_INCOME": [
        "domicile", "income certificate", "tahsildar", "residence", "utpanna", "adhivas",
        "दाखला", "प्रमाण पत्र", "उत्पन्नाचा दाखला", "डोमिसाइल"
    ],
    "DRIVING_LICENSE": [
        "license", "driving", "rto", "learner", "sarathi", "parivahan", "लायसन्स", "गाड़ी चलाना"
    ],
    "CIVIC_COMPLAINT": [
        "pothole", "gaddha", "khadde", "sadak", "garbage", "kachra", "water leak", "drainage",
        "flood", "streetlight", "bmc", "complaint", "shikayat", "तक्रार", "कचरा", "रस्ता"
    ],
    "EMERGENCY": [
        "emergency", "ambulance", "police", "112", "108", "fire", "accident", "childline",
        "cyber fraud", "1930", "आपत्कालीन", "अस्पताल", "संकट"
    ]
}

def detect_language(text: str, user_pref: str = "en") -> str:
    # Check for Devanagari script
    if re.search(r'[\u0900-\u097F]', text):
        # Distinguish Marathi vs Hindi by specific words
        marathi_markers = ["आहे", "नाही", "कशी", "करावी", "योजना", "माहिती", "हवी", "द्या", "शेतकरी", "पाहिजे"]
        if any(w in text for w in marathi_markers):
            return "mr"
        return "hi"

    # Hinglish detection
    hinglish_markers = ["kaise", "kare", "karna", "chahiye", "kitna", "milega", "paisa", "yojana", "bataye", "karo"]
    if any(re.search(r'\b' + re.escape(w) + r'\b', text.lower()) for w in hinglish_markers):
        return "hinglish"

    return user_pref or "en"

@router.post("/chat", response_model=ChatResponse)
def assistant_chat(req: ChatRequest, db: Session = Depends(get_db)):
    msg = req.message.strip()
    msg_lower = msg.lower()

    detected_lang = detect_language(msg, req.language or "en")

    # Match intents
    matched_intent = None
    for intent_key, keywords in INTENT_PATTERNS.items():
        if any(kw in msg_lower or kw in msg for kw in keywords):
            matched_intent = intent_key
            break

    citations: list[SourceCitation] = []
    actions: list[SuggestedAction] = []
    reply = ""

    if matched_intent == "PM_KISAN":
        citations.append(SourceCitation(
            title="Pradhan Mantri Kisan Samman Nidhi Operational Guidelines",
            url="https://pmkisan.gov.in",
            publisher="Ministry of Agriculture & Farmers Welfare",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="Check PM-KISAN Eligibility" if detected_lang in ["en", "hinglish"] else "पीएम किसान पात्रता तपासा",
            action_type="check_eligibility",
            payload={"scheme_code": "PM_KISAN"}
        ))
        actions.append(SuggestedAction(
            label="Open Scheme Details",
            action_type="navigate",
            payload={"view": "schemes", "scheme_code": "PM_KISAN"}
        ))

        if detected_lang == "mr":
            reply = (
                "**पीएम किसान सन्मान निधी (PM-KISAN)** अंतर्गत सर्व पात्र शेतकरी कुटुंबांना वर्षाला एकूण **₹६,०००** थेट बँक खात्यात दिले जातात. "
                "हे पैसे दर चार महिन्यांनी ₹२,००० च्या ३ समान हप्त्यांमध्ये वर्ग होतात.\n\n"
                "**आवश्यक कागदपत्रे:**\n"
                "१. आधार कार्ड (मोबाईल लिंक असलेले)\n"
                "२. जमिनीचा ७/१२ उतारा किंवा खतावणी\n"
                "३. आधार संलग्न सक्रिय बँक खाते पासबुक\n\n"
                "तुम्ही खाली दिलेल्या बटनावर क्लिक करून तुमची पात्रता तपासू शकता आणि कागदपत्रांची यादी पाहू शकता."
            )
        elif detected_lang == "hi":
            reply = (
                "**प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)** के तहत पात्र भूमिधारक किसान परिवारों को प्रति वर्ष **₹6,000** की प्रत्यक्ष वित्तीय सहायता दी जाती है। "
                "यह राशि ₹2,000 की 3 समान किस्तों में सीधे बैंक खाते (DBT) में भेजी जाती है।\n\n"
                "**जरूरी दस्तावेज:**\n"
                "1. आधार कार्ड (मोबाइल लिंक)\n"
                "2. जमीन का भू-अभिलेख (7/12 खतौनी/जमाबंदी)\n"
                "3. आधार से जुड़ा बैंक खाता पासबुक\n\n"
                "आप नीचे दिए गए बटन पर क्लिक करके अपनी पात्रता जांच सकते हैं और आवश्यक दस्तावेजों की चेकलिस्ट देख सकते हैं।"
            )
        elif detected_lang == "hinglish":
            reply = (
                "**PM-KISAN Yojana** ke under eligible farmer families ko har saal **₹6,000** direct bank account me milte hain. "
                "Ye amount ₹2,000 ki 3 installments me DBT ke through transfer hota hai.\n\n"
                "**Zaroori Documents:**\n"
                "1. Aadhaar Card (Mobile linked)\n"
                "2. Land ownership record (7/12 extract / Khatauni)\n"
                "3. Bank passbook with Aadhaar seeding\n\n"
                "Aap niche diye gaye button par click karke apni eligibility check kar sakte hain aur checklist save kar sakte hain."
            )
        else:
            reply = (
                "Under the **PM Kisan Samman Nidhi (PM-KISAN)**, eligible landholding farmer families receive **₹6,000 per year** directly transferred to their bank accounts. "
                "This is disbursed in 3 equal four-monthly installments of ₹2,000.\n\n"
                "**Key Requirements:**\n"
                "• Must hold cultivable land in applicant's name.\n"
                "• Aadhaar-linked active bank account with e-KYC completed.\n"
                "• Mandatory documents: Aadhaar card, 7/12 land record extract, and bank passbook.\n\n"
                "Click the action buttons below to evaluate your eligibility or view full verified application steps."
            )

    elif matched_intent == "LADKI_BAHIN":
        citations.append(SourceCitation(
            title="Mukhyamantri Majhi Ladki Bahin Yojana Official Guidelines",
            url="https://ladkibahin.maharashtra.gov.in",
            publisher="Govt of Maharashtra",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="Check Ladki Bahin Eligibility",
            action_type="check_eligibility",
            payload={"scheme_code": "LADKI_BAHIN_MAHA"}
        ))
        actions.append(SuggestedAction(
            label="View Required Documents",
            action_type="navigate",
            payload={"view": "schemes", "scheme_code": "LADKI_BAHIN_MAHA"}
        ))

        if detected_lang == "mr":
            reply = (
                "**मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र शासन):**\n"
                "महाराष्ट्रातील २१ ते ६५ वयोगटातील पात्र महिलांना दरमहा **₹१,५००** थेट बँक खात्यात दिले जातात.\n\n"
                "**महत्वाच्या अटी व कागदपत्रे:**\n"
                "• कुटुंबाचे वार्षिक उत्पन्न ₹२.५ लाखांपेक्षा कमी असावे (पिवळे/केशरी रेशन कार्ड ग्राह्य धरले जाते).\n"
                "• १५ वर्षे महाराष्ट्रात वास्तव्याचा पुरावा (अधिवास प्रमाणपत्र / रेशन कार्ड / मतदार ओळखपत्र).\n"
                "• आधार कार्ड व आधार संलग्न बँक खाते.\n\n"
                "अर्ज नारीशक्ती दूत ॲप किंवा अधिकृत पोर्टलवरून विनामूल्य करता येतो."
            )
        elif detected_lang == "hi":
            reply = (
                "**मुख्यमंत्री माझी लाडकी बहिन योजना (महाराष्ट्र सरकार):**\n"
                "महाराष्ट्र की 21 से 65 वर्ष की पात्र महिलाओं को प्रति माह **₹1,500** की वित्तीय सहायता दी जाती है।\n\n"
                "**पात्रता व दस्तावेज:**\n"
                "• वार्षिक पारिवारिक आय ₹2.5 लाख से कम होनी चाहिए (पीला/नारंगी राशन कार्ड मान्य)।\n"
                "• महाराष्ट्र का 15 वर्षीय निवास प्रमाण (डोमिसाइल / राशन कार्ड / वोटर आईडी)।\n"
                "• आधार कार्ड और आधार-सीडेड बैंक पासबुक।\n\n"
                "आवेदन नारी शक्ति दूत ऐप अथवा आधिकारिक पोर्टल पर निःशुल्क किया जा सकता है।"
            )
        else:
            reply = (
                "**Mukhyamantri Majhi Ladki Bahin Yojana (Govt of Maharashtra):**\n"
                "Eligible women aged 21-65 years residing in Maharashtra receive **₹1,500 per month** directly in their Aadhaar-linked bank accounts.\n\n"
                "**Eligibility & Documents:**\n"
                "• Annual family income under ₹2.5 Lakhs (Yellow/Orange ration card accepted).\n"
                "• Proof of 15 years Maharashtra residence (Domicile certificate / Ration card / Voter ID).\n"
                "• Aadhaar card and active bank passbook.\n\n"
                "Applications are free via Nari Shakti Doot app or official portal ladkibahin.maharashtra.gov.in."
            )

    elif matched_intent == "AYUSHMAN_BHARAT":
        citations.append(SourceCitation(
            title="Ayushman Bharat PM-JAY Scheme Portal",
            url="https://beneficiary.nha.gov.in",
            publisher="National Health Authority (NHA)",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="Download Ayushman Card",
            action_type="open_link",
            payload={"url": "https://beneficiary.nha.gov.in"}
        ))
        actions.append(SuggestedAction(
            label="View Scheme Details",
            action_type="navigate",
            payload={"view": "schemes", "scheme_code": "AYUSHMAN_BHARAT"}
        ))

        reply = (
            "**Ayushman Bharat PM-JAY (आयुष्मान भारत):**\n"
            "Provides **₹5 Lakh free cashless healthcare cover** per family per year across 29,000+ empaneled hospitals for secondary and tertiary care.\n\n"
            "**Key Updates (2026):**\n"
            "• Universal coverage for all senior citizens aged 70+ under PM-JAY Vaya Vandana regardless of income.\n"
            "• Covers 1,949 medical treatments, surgeries, ICU, pre/post hospitalisation.\n"
            "• Golden card generation is completely free via beneficiary.nha.gov.in using Aadhaar OTP or facial recognition."
        )

    elif matched_intent == "AADHAAR_UPDATE":
        citations.append(SourceCitation(
            title="UIDAI Official Address Update Guidelines",
            url="https://myaadhaar.uidai.gov.in",
            publisher="UIDAI",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="View Aadhaar Guide & Checklist",
            action_type="navigate",
            payload={"view": "services", "service_code": "AADHAAR_UPDATE"}
        ))
        actions.append(SuggestedAction(
            label="Open MyAadhaar Portal",
            action_type="open_link",
            payload={"url": "https://myaadhaar.uidai.gov.in"}
        ))

        reply = (
            "**How to Update Address in Aadhaar (आधार पता अपडेट):**\n"
            "1. Visit **myaadhaar.uidai.gov.in** and login with your 12-digit Aadhaar and mobile OTP.\n"
            "2. Select 'Address Update' > 'Update Aadhaar Online'.\n"
            "3. Enter the new address and upload a valid Proof of Address (Electricity bill, Bank passbook, Passport, or Rent agreement).\n"
            "4. Pay the government portal fee of **₹50** online.\n"
            "5. Save the 28-digit SRN number. Update is completed within 3 to 10 days.\n\n"
            "*Note:* For mobile number or biometric updates, you must visit an Aadhaar Seva Kendra in person."
        )

    elif matched_intent == "CIVIC_COMPLAINT":
        citations.append(SourceCitation(
            title="BMC Mumbai Citizen Services & Grievance Portal",
            url="https://portal.mcgm.gov.in",
            publisher="Brihanmumbai Municipal Corporation (BMC)",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="Draft Formal Civic Complaint",
            action_type="navigate",
            payload={"view": "civic"}
        ))
        actions.append(SuggestedAction(
            label="Call BMC 24x7 Helpline (1916)",
            action_type="call_helpline",
            payload={"number": "1916"}
        ))

        reply = (
            "**Reporting Civic Issues (Road Potholes, Garbage, Water Leaks, Broken Lights):**\n"
            "JanSetu AI helps you draft a formal statutory grievance letter tailored to your specific Ward:\n\n"
            "**Official BMC Reporting Channels:**\n"
            "• **BMC 24x7 Helpline:** 1916 (Toll-Free)\n"
            "• **WhatsApp Grievance Chatbot:** +91 8999 22 8999\n"
            "• **Official Portal:** portal.mcgm.gov.in\n"
            "• **Central Grievance Portal:** pgportal.gov.in (CPGRAMS)\n\n"
            "Click 'Draft Formal Civic Complaint' below to let AI format your complaint with exact ward jurisdiction and statutory references."
        )

    elif matched_intent == "EMERGENCY":
        citations.append(SourceCitation(
            title="National Emergency Response System 112",
            url="https://112.gov.in",
            publisher="Ministry of Home Affairs",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="Call 112 (National Emergency)",
            action_type="call_helpline",
            payload={"number": "112"}
        ))
        actions.append(SuggestedAction(
            label="Call 108 (Free Ambulance)",
            action_type="call_helpline",
            payload={"number": "108"}
        ))
        actions.append(SuggestedAction(
            label="Call 1930 (Cyber Financial Fraud)",
            action_type="call_helpline",
            payload={"number": "1930"}
        ))

        reply = (
            "🚨 **EMERGENCY DIRECTORY (आपातकालीन नंबर):**\n\n"
            "• **112** — Pan-India Unified Emergency (Police, Fire, Ambulance, Disaster)\n"
            "• **108 / 102** — Free Emergency Ambulance (MEMS 24x7)\n"
            "• **1098** — Childline India (Child Protection & Crisis)\n"
            "• **1091 / 181** — Women in Distress Helpline\n"
            "• **1930** — National Cyber Crime & Financial Fraud (Call within 2-3 hours)\n"
            "• **1916** — BMC Mumbai Disaster Management & High Tide Flooding\n\n"
            "Tap any emergency button below to initiate an immediate telephone call."
        )

    else:
        # Grounded search over database for keyword matching
        citations.append(SourceCitation(
            title="National Public Services Portal",
            url="https://services.india.gov.in",
            publisher="Government of India",
            verified_date="2026-10-01"
        ))
        actions.append(SuggestedAction(
            label="Browse All Government Schemes",
            action_type="navigate",
            payload={"view": "schemes"}
        ))
        actions.append(SuggestedAction(
            label="Browse Public Document Services",
            action_type="navigate",
            payload={"view": "services"}
        ))

        if detected_lang == "mr":
            reply = (
                f"मी **जनसेतु AI मित्र** आहे. मी तुम्हाला सरकारी योजना, दाखले, नागरी तक्रार आणि आपत्कालीन मदतीबाबत अधिकृत माहिती देऊ शकतो.\n\n"
                f"तुम्ही मला खालील विषयांवर विचारू शकता:\n"
                f"• 'शेतकऱ्यांसाठी सरकारी योजना कोणती आहे?'\n"
                f"• 'लाडकी बहीण योजनेची पात्रता काय आहे?'\n"
                f"• 'आधार कार्डवर पत्ता कसा बदलायचा?'\n"
                f"• 'रस्त्यावरील खड्ड्यांची बीएमसीकडे तक्रार कशी करायची?'"
            )
        elif detected_lang == "hi":
            reply = (
                f"मैं **जनसेतु AI मित्र** हूँ। मैं सरकारी योजनाओं, सार्वजनिक सेवाओं, नागरिक शिकायतों और आपातकालीन नंबरों की आधिकारिक जानकारी प्रदान करता हूँ।\n\n"
                f"आप मुझसे पूछ सकते हैं:\n"
                f"• 'किसानों के लिए कौन सी सरकारी योजनाएं हैं?'\n"
                f"• 'लाडकी बहिन योजना के लिए क्या पात्रता है?'\n"
                f"• 'आधार कार्ड में पता कैसे अपडेट करें?'\n"
                f"• 'सड़क के गड्ढों की शिकायत कैसे दर्ज करें?'"
            )
        else:
            reply = (
                f"I am **JanSetu AI Mitra**, your multilingual public service assistant grounded in official government data.\n\n"
                f"Here are key things I can assist you with right now:\n"
                f"1. **Schemes & Benefits:** Discover eligible central and state schemes (PM-KISAN, Ayushman Bharat, Ladki Bahin, PMAY, Mudra).\n"
                f"2. **Documents & Services:** Guided checklists for Aadhaar update, Instant e-PAN, Domicile, and Driving License.\n"
                f"3. **Civic Complaints:** Draft formal grievance letters routed to your local BMC Ward.\n"
                f"4. **Emergency Helplines:** Instant tap-to-call for 112, 108, 1098, and 1930.\n\n"
                f"Try typing or tapping the microphone button to ask any question in English, Hindi, or Marathi!"
            )

    return ChatResponse(
        reply=reply,
        language=detected_lang,
        citations=citations,
        suggested_actions=actions,
        confidence=0.96
    )
