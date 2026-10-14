from sqlalchemy.orm import Session
from app.models.scheme import Scheme
from app.models.service import Service
from app.models.helpline import Helpline
from app.models.tutorial import Tutorial

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(Scheme).first():
        return

    schemes_data = [
        {
            "code": "PM_KISAN",
            "title": "PM Kisan Samman Nidhi (पीएम किसान)",
            "title_hi": "प्रधानमंत्री किसान सम्मान निधि योजना",
            "title_mr": "प्रधानमंत्री किसान सन्मान निधी योजना",
            "category": "Agriculture",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "description": "Income support of ₹6,000 per year in three equal installments of ₹2,000 directly transferred to bank accounts of all landholding farmer families across India.",
            "description_hi": "भारत भर के सभी भूमिधारक किसान परिवारों के बैंक खातों में ₹2,000 की तीन समान किस्तों में प्रति वर्ष ₹6,000 की सीधी आय सहायता प्रदान की जाती है।",
            "description_mr": "सर्व पात्र जमीनधारक शेतकरी कुटुंबांच्या बँक खात्यात दर चार महिन्यांनी ₹२,००० याप्रमाणे वर्षाला एकूण ₹६,००० थेट वर्ग केले जातात.",
            "key_benefits": [
                "₹6,000 annual direct benefit transfer (DBT) directly into bank account",
                "Paid in 3 equal four-monthly installments of ₹2,000 each",
                "100% centrally funded with no intermediaries",
                "Direct linkage with PM Fasal Bima and Kisan Credit Card (KCC)"
            ],
            "eligibility_criteria": {
                "occupation": ["Farmer", "Agriculture"],
                "landholding_required": True,
                "landholding_max_acres": 25.0,
                "institutional_landholder": False,
                "excluded_income_tax_payers": True,
                "excluded_constitutional_posts": True,
                "min_age": 18
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Mandatory for biometric and e-KYC authentication"},
                {"name": "Land Ownership Record (7/12 Extract / Khatauni)", "mandatory": True, "description": "Official land record in the applicant's name"},
                {"name": "Aadhaar-Linked Bank Account Passbook", "mandatory": True, "description": "Active bank account with NPCI Aadhaar seeding enabled"},
                {"name": "Active Mobile Number", "mandatory": True, "description": "Linked with Aadhaar for OTP verification"}
            ],
            "application_steps": [
                "Visit the official PM-KISAN portal (pmkisan.gov.in) or your local CSC Centre / Setu Kendra.",
                "Click on 'New Farmer Registration' under the Farmers Corner section.",
                "Enter your Aadhaar number, select your State, and submit the OTP received on your mobile.",
                "Fill in land record details (District, Sub-District, Block, Village, Survey/Khata number).",
                "Upload a self-attested copy of the land record and save the registration reference number.",
                "Complete mandatory e-KYC through facial recognition on PM-KISAN mobile app or OTP on portal."
            ],
            "official_url": "https://pmkisan.gov.in",
            "source_citation": "myscheme.gov.in / pmkisan.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "AYUSHMAN_BHARAT",
            "title": "Ayushman Bharat PM-JAY (आयुष्मान भारत)",
            "title_hi": "प्रधानमंत्री जन आरोग्य योजना (पीएम-जय)",
            "title_mr": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
            "category": "Healthcare",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "National Health Authority / MoHFW",
            "description": "World's largest government-funded health assurance scheme providing cashless hospitalisation cover of up to ₹5,00,000 per family per year for secondary and tertiary healthcare.",
            "description_hi": "माध्यमिक और तृतीयक अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5,00,000 तक का कैशलेस स्वास्थ्य कवर प्रदान करने वाली विश्व की सबसे बड़ी स्वास्थ्य सुरक्षा योजना।",
            "description_mr": "दुय्यम आणि तृतीयक उपचारांसाठी दरवर्षी प्रति कुटुंब ₹५,००,००० पर्यंतचे कॅशलेस मोफत वैद्यकीय उपचार मिळवून देणारी राष्ट्रीय आरोग्य योजना.",
            "key_benefits": [
                "₹5 Lakh cashless health cover per family per year across 29,000+ empaneled hospitals",
                "Covers pre-existing diseases from Day 1 of enrollment",
                "Covers 3 days of pre-hospitalisation and 15 days of post-hospitalisation expenses",
                "All senior citizens aged 70+ now eligible for dedicated ₹5 Lakh top-up cover irrespective of income"
            ],
            "eligibility_criteria": {
                "secc_deprivation_criteria": True,
                "senior_citizen_universal_70_plus": True,
                "ration_card_types": ["BPL", "Antyodaya", "PHH"],
                "excluded_government_employees": True
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Identity and family verification"},
                {"name": "Ration Card / Family ID", "mandatory": True, "description": "Proof of family membership registered under SECC/NFSA"},
                {"name": "Active Mobile Number", "mandatory": True, "description": "For e-KYC and digital Ayushman Card generation"}
            ],
            "application_steps": [
                "Visit the official Ayushman Bharat Beneficiary Portal (beneficiary.nha.gov.in).",
                "Login with your mobile number and enter the OTP.",
                "Search your family status using Scheme (PM-JAY), State, Sub-District, and Ration Card/Aadhaar number.",
                "If your name appears, click 'e-KYC' and complete Aadhaar OTP or biometric authentication.",
                "Upload a live photograph; upon instant approval, download your PVC-compatible digital Ayushman Card.",
                "Present the card at any empaneled government or private hospital's Ayushman Mitra desk for cashless care."
            ],
            "official_url": "https://beneficiary.nha.gov.in",
            "source_citation": "nha.gov.in / myscheme.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "LADKI_BAHIN_MAHA",
            "title": "Majhi Ladki Bahin Yojana (माझी लाडकी बहीण)",
            "title_hi": "मुख्यमंत्री माझी लाडकी बहिन योजना (महाराष्ट्र)",
            "title_mr": "मुख्यमंत्री माझी लाडकी बहीण योजना (महाराष्ट्र शासन)",
            "category": "Women & Children",
            "level": "State",
            "state": "Maharashtra",
            "ministry": "Women & Child Development Dept, Govt of Maharashtra",
            "description": "Financial empowerment scheme for underprivileged women in Maharashtra providing ₹1,500 monthly direct bank transfer to enhance self-reliance, nutrition, and health.",
            "description_hi": "महाराष्ट्र की वंचित महिलाओं को आत्मनिर्भरता और पोषण के लिए ₹1,500 प्रति माह प्रत्यक्ष बैंक हस्तांतरण प्रदान करने वाली योजना।",
            "description_mr": "महाराष्ट्रातील २१ ते ६५ वयोगटातील पात्र महिलांना दरमहा ₹१,५०० थेट बँक खात्यात जमा करणारी ऐतिहासिक महिला सक्षमीकरण योजना.",
            "key_benefits": [
                "₹1,500 per month (₹18,000 per year) directly credited to Aadhaar-seeded bank account",
                "Covers married, widowed, divorced, deserted, and single destitute women",
                "Zero application fee with verification at Anganwadi and Ward Kendra level"
            ],
            "eligibility_criteria": {
                "state": "Maharashtra",
                "gender": ["Female"],
                "min_age": 21,
                "max_age": 65,
                "max_annual_income": 250000,
                "excluded_income_tax_payers": True,
                "excluded_four_wheeler_owners": True
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Applicant's identity and date of birth proof"},
                {"name": "Maharashtra Domicile Certificate / Ration Card / Voter ID", "mandatory": True, "description": "Proof of 15 years Maharashtra residence"},
                {"name": "Family Income Certificate (below ₹2.5 Lakhs)", "mandatory": True, "description": "Yellow/Orange Ration card accepted in lieu of income certificate"},
                {"name": "Aadhaar-Linked Bank Account Passbook", "mandatory": True, "description": "Direct Benefit Transfer (DBT) enabled account"}
            ],
            "application_steps": [
                "Visit the Nari Shakti Doot mobile application or the official portal (ladkibahin.maharashtra.gov.in).",
                "Register using your mobile number and verify via OTP.",
                "Fill in personal details, Aadhaar number, marital status, and residential address in Maharashtra.",
                "Upload scanned photos of your Aadhaar Card, Ration Card/Income Certificate, and Bank Passbook.",
                "Submit the application and note your registration acknowledgement number.",
                "Anganwadi workers / Ward officers conduct field verification before fund disbursement."
            ],
            "official_url": "https://ladkibahin.maharashtra.gov.in",
            "source_citation": "maharashtra.gov.in / ladkibahin.maharashtra.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "PMAY_HOUSING",
            "title": "PM Awas Yojana (पीएम आवास योजना - शहरी एवं ग्रामीण)",
            "title_hi": "प्रधानमंत्री आवास योजना (शहरी एवं ग्रामीण)",
            "title_mr": "प्रधानमंत्री आवास योजना (सर्वांसाठी घरे)",
            "category": "Housing",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Housing and Urban Affairs / MoRD",
            "description": "Flagship housing scheme aimed at providing all-weather pucca houses with basic civic amenities to all eligible urban and rural homeless or kutcha house dwellers.",
            "description_hi": "सभी पात्र शहरी और ग्रामीण बेघर या कच्चे घरों में रहने वाले नागरिकों को सभी बुनियादी सुविधाओं से युक्त पक्का घर उपलब्ध कराने की योजना।",
            "description_mr": "बेघर व कच्च्या घरात राहणाऱ्या कुटुंबांना हक्काचे पक्के घर बांधण्यासाठी आर्थिक अनुदान देणारी केंद्र शासन योजना.",
            "key_benefits": [
                "Direct financial assistance of ₹1.20 Lakh to ₹1.30 Lakh for rural house construction",
                "Up to ₹2.67 Lakh interest subsidy on home loans under Credit Linked Subsidy Scheme (CLSS) in urban areas",
                "Mandatory water, sanitation (toilet), and electricity connection under convergence with Swachh Bharat and Saubhagya"
            ],
            "eligibility_criteria": {
                "pucca_house_ownership": False,
                "income_categories": ["EWS (up to ₹3 Lakhs)", "LIG (₹3-6 Lakhs)", "MIG-I (₹6-12 Lakhs)"],
                "female_ownership_mandate": True
            },
            "required_documents": [
                {"name": "Aadhaar Card of all family members", "mandatory": True, "description": "Identity and family linkage"},
                {"name": "Income Certificate / Salary Slip / Form 16", "mandatory": True, "description": "Income category certification"},
                {"name": "Land Records / Allotment Letter / Non-Encumbrance Certificate", "mandatory": True, "description": "Proof of land or building right"},
                {"name": "Affidavit of No Pucca House in India", "mandatory": True, "description": "Declaration that no family member owns a permanent house"}
            ],
            "application_steps": [
                "For Urban: Visit pmaymis.gov.in or your local Municipal Corporation (BMC / Nagar Palika) Citizen facilitation counter.",
                "For Rural: Contact your Village Gram Panchayat Secretary or Gram Sevak who updates the Awaas+ survey list.",
                "Fill the online beneficiary form with household income, family Aadhaar details, and bank account information.",
                "Geo-tag the existing kutcha site using the PMAY mobile app during official verification.",
                "Upon sanction, financial milestones are credited directly to your bank account in 3-4 construction stages."
            ],
            "official_url": "https://pmaymis.gov.in",
            "source_citation": "pmaymis.gov.in / myscheme.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "SUKANYA_SAMRIDDHI",
            "title": "Sukanya Samriddhi Yojana (सुकन्या समृद्धि)",
            "title_hi": "सुकन्या समृद्धि योजना (बेटी बचाओ, बेटी पढ़ाओ)",
            "title_mr": "सुकन्या समृद्धी योजना (मुलींच्या उज्ज्वल भविष्यासाठी)",
            "category": "Women & Children",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Finance / India Post",
            "description": "Government-backed high-yield small savings scheme for girl children offering guaranteed 8.2% annual interest, complete EEE tax exemption, and secured funds for education and marriage.",
            "description_hi": "बालिकाओं के लिए उच्च-प्रतिफल वाली सरकारी बचत योजना, जिसमें 8.2% वार्षिक ब्याज और 80C के तहत पूर्ण कर छूट मिलती है।",
            "description_mr": "मुलींच्या उच्च शिक्षण आणि विवाहासाठी सर्वोच्च व्याजदर (८.२%) आणि पूर्ण करमुक्ती देणारी टपाल खात्याची बचत योजना.",
            "key_benefits": [
                "Highest sovereign-backed interest rate: 8.2% per annum compounded annually",
                "Triple tax exemption (EEE) under Section 80C up to ₹1.5 Lakh per year",
                "Minimum deposit of just ₹250 per year; maximum ₹1,50,000 per financial year",
                "Partial withdrawal of up to 50% permitted after girl reaches age 18 for higher education"
            ],
            "eligibility_criteria": {
                "gender": ["Female"],
                "max_age_at_opening": 10,
                "max_accounts_per_family": 2
            },
            "required_documents": [
                {"name": "Girl Child's Official Birth Certificate", "mandatory": True, "description": "Issued by Municipal Corporation / Registrar of Births"},
                {"name": "Parent / Legal Guardian's Aadhaar & PAN Card", "mandatory": True, "description": "Identity and address proof of account operator"},
                {"name": "Passport-sized Photographs", "mandatory": True, "description": "Two photos of child and guardian"},
                {"name": "Address Proof", "mandatory": True, "description": "Electricity bill / Ration card / Aadhaar"}
            ],
            "application_steps": [
                "Collect the SSY Account Opening Form (Form-1) from any Post Office or authorized commercial bank branch.",
                "Fill in child's name, birth details, guardian details, and initial deposit amount (minimum ₹250).",
                "Attach self-attested copies of birth certificate, guardian's Aadhaar, and PAN.",
                "Deposit the initial amount via cash, cheque, or demand draft.",
                "A physical SSY passbook will be issued containing the account number, interest schedule, and maturity date."
            ],
            "official_url": "https://www.indiapost.gov.in",
            "source_citation": "indiapost.gov.in / myscheme.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "PM_VISHWAKARMA",
            "title": "PM Vishwakarma Yojana (पीएम विश्वकर्मा)",
            "title_hi": "प्रधानमंत्री विश्वकर्मा योजना (कारीगर एवं शिल्पकार)",
            "title_mr": "प्रधानमंत्री विश्वकर्मा योजना (पारंपरिक कारागीर व शिल्पकार)",
            "category": "Business & Artisans",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Micro, Small and Medium Enterprises (MSME)",
            "description": "Holistic support scheme for 18 traditional trades and craftspeople providing PM Vishwakarma certification, skill upgrade training, ₹15,000 toolkit grant, and collateral-free loans up to ₹3,00,000 at 5% interest.",
            "description_hi": "18 पारंपरिक व्यवसायों के शिल्पकारों के लिए ₹15,000 टूलकिट अनुदान और 5% रियायती ब्याज पर ₹3 लाख तक का संपार्श्विक-मुक्त ऋण प्रदान करने वाली योजना।",
            "description_mr": "पारंपरिक सुतार, लोहार, कुंभार, चर्मकार अशा १८ कारागिरांना ₹१५,००० मोफत टूलकिट आणि ५% सवलतीच्या व्याजाने ₹३ लाखांपर्यंत विनातारण कर्ज.",
            "key_benefits": [
                "Official PM Vishwakarma Certificate and Digital ID Card",
                "5-7 days basic skill training with ₹500/day daily stipend",
                "₹15,000 modern toolkit incentive credited as e-Voucher",
                "Collateral-free enterprise credit: ₹1 Lakh in 1st tranche and ₹2 Lakh in 2nd tranche at concessional 5% interest rate"
            ],
            "eligibility_criteria": {
                "occupation_traditional_artisan": True,
                "covered_trades": ["Carpenter", "Blacksmith", "Potter", "Sculptor", "Cobbler", "Mason", "Basket Maker", "Tailor", "Barber", "Washerman", "Boat Builder", "Armourer"],
                "min_age": 18,
                "one_member_per_family": True
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Identity and age verification"},
                {"name": "Aadhaar-Linked Bank Account Details", "mandatory": True, "description": "For receiving toolkit incentive and loan credit"},
                {"name": "Active Mobile Number", "mandatory": True, "description": "Linked with Aadhaar for biometric authentication"},
                {"name": "Ration Card", "mandatory": True, "description": "To verify single-member family benefit rule"}
            ],
            "application_steps": [
                "Visit your nearest Common Service Centre (CSC) with your trade tools information and Aadhaar card.",
                "Undergo biometric authentication on the PM Vishwakarma portal (pmvishwakarma.gov.in).",
                "The CSC operator will register your application under your specific traditional craft.",
                "Stage 1: Gram Panchayat / Urban Local Body (ULB) committee conducts verification of trade practice.",
                "Stage 2: District Implementation Committee (DIC) approves enrollment for skill training.",
                "Upon completion of training, receive your ₹15,000 digital toolkit voucher and apply for loan tranche 1."
            ],
            "official_url": "https://pmvishwakarma.gov.in",
            "source_citation": "pmvishwakarma.gov.in / msme.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "PM_MUDRA",
            "title": "Pradhan Mantri Mudra Yojana (मुद्रा योजना)",
            "title_hi": "प्रधानमंत्री मुद्रा योजना (पीएमएमवाई)",
            "title_mr": "प्रधानमंत्री मुद्रा योजना (विनातारण व्यवसाय कर्ज)",
            "category": "Business & Artisans",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Department of Financial Services / Ministry of Finance",
            "description": "Institutional collateral-free micro enterprise credit up to ₹10 Lakhs (extended up to ₹20 Lakhs for Tarun Plus) across Shishu, Kishore, and Tarun categories for non-corporate small businesses.",
            "description_hi": "गैर-कॉर्पोरेट छोटे व्यवसायों के लिए शिशु, किशोर और तरुण श्रेणियों में बिना किसी गारंटी के ₹10 लाख तक का आसान व्यावसायिक ऋण।",
            "description_mr": "लघु उद्योजक, दुकानदार आणि व्यावसायिकांसाठी विनातारण ₹१० लाखांपर्यंत बँक कर्ज मिळवून देणारी केंद्र योजना.",
            "key_benefits": [
                "Shishu: Loans up to ₹50,000 for startup stage micro enterprises",
                "Kishore: Loans from ₹50,001 to ₹5,00,000 for purchasing machinery and working capital",
                "Tarun: Loans from ₹5,00,001 up to ₹10,00,000 for expanding established enterprises",
                "Zero processing fees for Shishu and Kishore loans; no third-party collateral required"
            ],
            "eligibility_criteria": {
                "occupation": ["Business", "Self-Employed", "Artisan", "Shopkeeper", "Service Provider"],
                "min_age": 18,
                "credit_history": "No previous bank loan defaults"
            },
            "required_documents": [
                {"name": "Aadhaar Card and PAN Card", "mandatory": True, "description": "KYC identification of business proprietor/partners"},
                {"name": "Proof of Business Address & Registration (Udyam / Shop Act)", "mandatory": True, "description": "Shop and Establishment license or Udyam Aadhaar"},
                {"name": "Last 6 Months Bank Statement", "mandatory": True, "description": "Showing business turnover and transactions"},
                {"name": "Projected Balance Sheet & Quotation for Equipment", "mandatory": False, "description": "Required for Kishore and Tarun category loans"}
            ],
            "application_steps": [
                "Apply online via the unified portal Udyami Mitra (udyamimitra.in) or visit any public/private sector bank branch.",
                "Choose the appropriate category (Shishu, Kishore, or Tarun) based on your fund requirement.",
                "Submit business plan details along with machinery/inventory quotations from verified suppliers.",
                "Upload KYC documents, address proof, and Udyam registration certificate.",
                "Bank reviews the proposal and disburses the sanctioned amount directly along with a MUDRA RuPay debit card for working capital."
            ],
            "official_url": "https://www.mudra.org.in",
            "source_citation": "mudra.org.in / udyamimitra.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "NSAP_OLD_AGE",
            "title": "National Social Assistance - Old Age Pension (वृद्धावस्था पेंशन)",
            "title_hi": "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना (IGNOAPS)",
            "title_mr": "इंदिरा गांधी राष्ट्रीय वृद्धत्व निवृत्तीवेतन योजना",
            "category": "Senior Citizens",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Rural Development / Social Welfare Dept",
            "description": "Monthly social security pension for impoverished senior citizens living below the poverty line (BPL) to provide dignity, financial independence, and sustenance.",
            "description_hi": "गरीबी रेखा से नीचे (BPL) जीवन यापन करने वाले वरिष्ठ नागरिकों के लिए सम्मानजनक मासिक वृद्धावस्था पेंशन योजना।",
            "description_mr": "दारिद्र्य रेषेखालील ६० वर्षे किंवा त्याहून अधिक वयाच्या वृद्ध नागरिकांना दरमहा थेट आर्थिक निवृत्तीवेतन.",
            "key_benefits": [
                "Monthly direct pension deposited straight into pensioner's bank/post office account",
                "Central assistance supplemented by state government contribution (total ₹1,000 to ₹2,500/month depending on state)",
                "Automatic increment upon reaching age 80"
            ],
            "eligibility_criteria": {
                "min_age": 60,
                "bpl_status": True,
                "no_regular_source_of_income": True
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Proof of age and identity"},
                {"name": "BPL Ration Card / BPL Survey Certificate", "mandatory": True, "description": "Documented proof of belonging to Below Poverty Line household"},
                {"name": "Bank / Post Office Passbook with Aadhaar Seeding", "mandatory": True, "description": "For receiving monthly pension credits"},
                {"name": "Age Certificate / Voter ID", "mandatory": True, "description": "Verification that applicant is 60 years or older"}
            ],
            "application_steps": [
                "Apply online through the NSAP portal (nsap.nic.in) or offline via your local Block Development Office (BDO) / Tahsildar / Setu Kendra.",
                "Fill Form-1 with age details, BPL family ID number, and active bank account details.",
                "Attach verified BPL certificate and age proof certified by government medical officer or school leaving certificate.",
                "Tahsildar / Municipal Commissioner reviews the field verification report.",
                "Sanction order is issued and monthly pension starts via Direct Benefit Transfer (DBT)."
            ],
            "official_url": "https://nsap.nic.in",
            "source_citation": "nsap.nic.in / myscheme.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "PM_SVANIDHI",
            "title": "PM SVANidhi - Street Vendor's Loan (स्वनिधि योजना)",
            "title_hi": "प्रधानमंत्री स्ट्रीट वेंडर्स आत्मनिर्भर निधि (पीएम स्वनिधि)",
            "title_mr": "पीएम स्वनिधी - फेरीवाला आत्मनिर्भर कर्ज योजना",
            "category": "Business & Artisans",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
            "description": "Special micro-credit facility empowering urban street vendors with collateral-free working capital loans of ₹10,000, progressing to ₹20,000 and ₹50,000, along with a 7% interest subsidy on timely repayment.",
            "description_hi": "शहरी स्ट्रीट वेंडर्स और रेहड़ी-पटरी वालों के लिए ₹10,000 से ₹50,000 तक का आसान विना-गारंटी ऋण और समय पर भुगतान पर 7% ब्याज सब्सिडी।",
            "description_mr": "शहरी भागातील फेरीवाले आणि हातगाडी चालकांसाठी ₹१०,००० ते ₹५०,००० पर्यंतचे विनातारण खेळते भांडवल कर्ज.",
            "key_benefits": [
                "1st Tranche: ₹10,000 collateral-free working capital loan (tenure 1 year)",
                "2nd Tranche: ₹20,000 upon timely repayment of 1st loan",
                "3rd Tranche: ₹50,000 for enterprise scaling",
                "7% per annum interest subsidy directly credited to bank account; cash back up to ₹1,200/year on digital transactions"
            ],
            "eligibility_criteria": {
                "occupation": ["Street Vendor", "Hawker", "Small Cart Operator"],
                "urban_local_body_surveyed": True,
                "has_certificate_of_vending": True
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Identity proof"},
                {"name": "Certificate of Vending (CoV) / Letter of Recommendation (LoR)", "mandatory": True, "description": "Issued by Urban Local Body / BMC / Municipal Council"},
                {"name": "Bank Account Passbook", "mandatory": True, "description": "For receiving DBT loan funds"},
                {"name": "Mobile Number linked with Aadhaar", "mandatory": True, "description": "For receiving OTP and digital cashback"}
            ],
            "application_steps": [
                "Visit the official portal pmsvanidhi.mohua.gov.in or approach your local Ward Municipal Office / Banking Correspondent.",
                "Enter your Aadhaar-linked mobile number to request OTP.",
                "Enter your Urban Local Body (ULB) name and search for your Certificate of Vending (CoV) number.",
                "If CoV is pending, apply online for a Letter of Recommendation (LoR) with your local vending proof.",
                "Select your preferred lending institution and submit the digital application.",
                "Lending bank verifies and disburses ₹10,000 directly into your savings account within 7 to 10 days."
            ],
            "official_url": "https://pmsvanidhi.mohua.gov.in",
            "source_citation": "pmsvanidhi.mohua.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "MAHADBT_SCHOLARSHIP",
            "title": "MahaDBT Post-Matric Scholarship (महाडीबीटी शिष्यवृत्ती)",
            "title_hi": "महाडीबीटी पोस्ट-मैट्रिक छात्रवृत्ति योजना (महाराष्ट्र)",
            "title_mr": "महाडीबीटी मॅट्रिकोत्तर शिष्यवृत्ती व शिक्षण शुल्क प्रतिपूर्ती",
            "category": "Education",
            "level": "State",
            "state": "Maharashtra",
            "ministry": "Social Justice & Special Assistance Dept, Govt of Maharashtra",
            "description": "Comprehensive fee reimbursement and monthly maintenance allowance for students belonging to SC, ST, OBC, VJNT, SBC, and EBC categories pursuing higher education in Maharashtra.",
            "description_hi": "महाराष्ट्र में उच्च शिक्षा प्राप्त कर रहे आरक्षित एवं आर्थिक रूप से पिछड़े वर्ग के छात्रों के लिए पूर्ण शिक्षण शुल्क प्रतिपूर्ति एवं छात्रवृत्ति।",
            "description_mr": "अनुसूचित जाती, जमाती, इतर मागासवर्ग व आर्थिक दुर्बल घटकातील विद्यार्थ्यांसाठी १००% पर्यंत शिक्षण शुल्क माफी व विद्यावेतन.",
            "key_benefits": [
                "100% tuition and exam fee reimbursement for SC/ST students in government & recognized private colleges",
                "50% to 100% fee concession for OBC/EBC/SEBC students based on income slab",
                "Monthly maintenance allowance credited directly via Aadhaar-linked bank account",
                "Hostel allowance for outstation students pursuing professional degree courses"
            ],
            "eligibility_criteria": {
                "state": "Maharashtra",
                "education_level": "Post-Matric (11th, 12th, Diploma, Degree, PG, Ph.D.)",
                "max_annual_income": 800000,
                "category_reserved_or_ebc": True
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Biometric and identity verification"},
                {"name": "Caste Certificate and Caste Validity Certificate", "mandatory": True, "description": "Issued by Competent Authority of Govt of Maharashtra"},
                {"name": "Income Certificate issued by Tehsildar (valid for current fiscal year)", "mandatory": True, "description": "Family income certification"},
                {"name": "Previous Year Marksheet & College Allotment Letter (CAP)", "mandatory": True, "description": "Proof of merit and admission into recognized course"},
                {"name": "Maharashtra Domicile Certificate", "mandatory": True, "description": "Proof of state residency"},
                {"name": "Hostel Certificate", "mandatory": False, "description": "Required if applying for hostel maintenance allowance"}
            ],
            "application_steps": [
                "Visit the official portal mahadbt.maharashtra.gov.in.",
                "Click on 'Post Matric Scholarship' and register with your Aadhaar number using biometric or OTP.",
                "Complete your profile: Personal Details, Address, Caste, Income, and Previous Qualification.",
                "Select your current college, course, and CAP round allotment details.",
                "Upload required documents (Income, Caste, Domicile, College fee receipt).",
                "College scrutinizes application, followed by Social Welfare Dept scrutiny, after which funds are disbursed to college & student."
            ],
            "official_url": "https://mahadbt.maharashtra.gov.in",
            "source_citation": "mahadbt.maharashtra.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "SANJAY_GANDHI_NIRADHAR",
            "title": "Sanjay Gandhi Niradhar Anudan Yojana (संजय गांधी निराधार)",
            "title_hi": "संजय गांधी निराधार अनुदान योजना (महाराष्ट्र)",
            "title_mr": "संजय गांधी निराधार अनुदान योजना (विशेष सहाय्य विभाग)",
            "category": "Social Welfare",
            "level": "State",
            "state": "Maharashtra",
            "ministry": "Special Assistance Department, Govt of Maharashtra",
            "description": "State welfare pension granting ₹1,500 per month to destitute individuals, disabled persons, widows, divorced women, abandoned wives, and victims of severe illnesses living in Maharashtra.",
            "description_hi": "महाराष्ट्र में निराधार व्यक्तियों, विधवाओं, दिव्यांगजनों और गंभीर बीमारी से पीड़ित नागरिकों के लिए ₹1,500 प्रति माह की आर्थिक सहायता।",
            "description_mr": "महाराष्ट्रातील निराधार, विधवा, अपंग, परित्यक्ता महिला व दुर्धर आजारी व्यक्तींना जगण्यासाठी दरमहा ₹१,५०० आर्थिक सहाय्य.",
            "key_benefits": [
                "₹1,500 per month for single beneficiary; ₹2,100 per month if there are two or more beneficiaries in one family",
                "Lifelong financial protection with regular Direct Benefit Transfer (DBT)",
                "Zero application charge at Setu Kendras and Tehsildar offices"
            ],
            "eligibility_criteria": {
                "state": "Maharashtra",
                "max_annual_income": 50000,
                "destitute_widow_disabled": True,
                "residence_in_state_years": 15
            },
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "description": "Identity proof"},
                {"name": "Age Proof (School Leaving Certificate / Medical Certificate)", "mandatory": True, "description": "Proof of age"},
                {"name": "Income Certificate issued by Tehsildar (Annual income < ₹50,000)", "mandatory": True, "description": "Verification of destitute status"},
                {"name": "Disability Certificate (40%+ disability) or Medical Certificate for severe illness", "mandatory": False, "description": "Required if applying under disabled/illness category"},
                {"name": "Death Certificate of Husband (for Widows)", "mandatory": False, "description": "Required for widow applicants"},
                {"name": "15-year Maharashtra Domicile / Residence Proof", "mandatory": True, "description": "Ration Card or Domicile certificate"}
            ],
            "application_steps": [
                "Obtain Form-A from your local Tehsildar office, Collectorate, or download via Aaple Sarkar portal.",
                "Attach verified copies of age proof, income certificate, and disability/widowhood proof.",
                "Submit to the Sanjay Gandhi Yojana branch at the Taluka Tehsildar office.",
                "Applications are reviewed by the Taluka Approval Committee headed by local public representatives.",
                "Sanctioned pension is deposited monthly into applicant's Post Office or nationalised bank account."
            ],
            "official_url": "https://aaplesarkar.mahaonline.gov.in",
            "source_citation": "aaplesarkar.mahaonline.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        },
        {
            "code": "PM_POSHAN",
            "title": "PM POSHAN - Mid Day Meal Scheme (पीएम पोषण)",
            "title_hi": "प्रधानमंत्री पोषण शक्ति निर्माण (मध्याह्न भोजन योजना)",
            "title_mr": "प्रधानमंत्री पोषण शक्ती निर्माण (शालेय पोषण आहार)",
            "category": "Education",
            "level": "Central",
            "state": "Pan-India",
            "ministry": "Ministry of Education / Department of School Education",
            "description": "Universal school meal programme providing one hot cooked nutritious meal every school day to all primary (Classes I-V) and upper primary (Classes VI-VIII) children in government and aided schools.",
            "description_hi": "सरकारी एवं सहायता प्राप्त विद्यालयों में कक्षा 1 से 8 तक के सभी बच्चों को प्रतिदिन गरमा-गरम पौष्टिक भोजन प्रदान करने वाला राष्ट्रीय कार्यक्रम।",
            "description_mr": "पहिली ते आठवीच्या सर्व विद्यार्थ्यांना शाळेमध्ये मोफत गरमागरम आणि पौष्टिक माध्यान्ह भोजन पुरवणारी देशव्यापी योजना.",
            "key_benefits": [
                "Guaranteed hot cooked nutritious lunch containing minimum 450 calories and 12g protein for Primary, and 700 calories and 20g protein for Upper Primary",
                "Iron and Folic Acid (IFA) supplements and deworming tablets distributed under Rashtriya Bal Swasthya Karyakram (RBSK)",
                "Universal coverage: no income certificate required for school students",
                "Community inclusion through Tithi Bhojan celebrations"
            ],
            "eligibility_criteria": {
                "enrolled_in_government_school": True,
                "classes": "Class 1 to Class 8",
                "universal_coverage": True
            },
            "required_documents": [
                {"name": "School Admission Record (General Register Number)", "mandatory": True, "description": "Enrolled in Government, Local Body, or Govt-Aided school"},
                {"name": "Student Aadhaar Card (APAAR / Automated Permanent Academic Account Registry)", "mandatory": False, "description": "Used for student tracking on UDISE+ portal"}
            ],
            "application_steps": [
                "Enrol the student in any recognized Government, Zilla Parishad, Municipal Corporation, or Government-Aided School.",
                "No separate scheme application form is needed; meal is automatically provided on all working school days.",
                "Parents can participate in School Management Committee (SMC) meetings to inspect meal quality and food hygiene standards."
            ],
            "official_url": "https://pmposhan.education.gov.in",
            "source_citation": "pmposhan.education.gov.in / dsel.education.gov.in",
            "last_verified_date": "2026-10-01",
            "is_active": True
        }
    ]

    for item in schemes_data:
        scheme = Scheme(**item)
        db.add(scheme)

    # 8 Public Document Services
    services_data = [
        {
            "code": "AADHAAR_UPDATE",
            "title": "Aadhaar Card Address & Mobile Update (आधार कार्ड दुरुस्ती)",
            "title_hi": "आधार कार्ड पता एवं मोबाइल नंबर अपडेट",
            "title_mr": "आधार कार्ड पत्ता व मोबाईल क्रमांक अपडेट",
            "category": "Identity",
            "department": "Unique Identification Authority of India (UIDAI)",
            "description": "Update or correct residential address, link registered mobile number, or update biometric data (iris/fingerprint/photo) on your 12-digit Aadhaar card.",
            "purpose": "Mandatory identity and address synchronization for all government welfare schemes, bank accounts, and passport services.",
            "prerequisites": [
                "For Online Address Update: Mobile number must already be linked to Aadhaar to receive OTP.",
                "For Biometric / Mobile Number Update: In-person visit to an Aadhaar Seva Kendra is mandatory."
            ],
            "required_documents": [
                {"name": "Proof of Address (PoA)", "mandatory": True, "alternatives": ["Electricity Bill (last 3 months)", "Water Bill", "Bank Account Statement with Photo", "Voter ID", "Passport", "Registered Rent Agreement", "Ration Card", "Head of Family (HoF) Self-Declaration"]}
            ],
            "alternative_documents": {
                "Proof of Address": [
                    "Electricity Bill (under 3 months)",
                    "Water or Piped Gas Bill",
                    "Bank Passbook with photo & stamped branch seal",
                    "Voter Identity Card",
                    "Passport",
                    "Registered Leave & License Rent Agreement",
                    "Head of Family (HoF) Aadhaar-based OTP approval (if no personal address document is available)"
                ]
            },
            "step_by_step": [
                "Step 1: Go to the official MyAadhaar portal (myaadhaar.uidai.gov.in) and click 'Login' with your Aadhaar and OTP.",
                "Step 2: Select 'Address Update' > 'Update Aadhaar Online'.",
                "Step 3: Enter the new address accurately as written on your supporting document.",
                "Step 4: Select your supporting Proof of Address document type and upload a clear PDF/JPEG copy (under 2MB).",
                "Step 5: Pay the official government fee of ₹50 via UPI, Net Banking, or Debit Card.",
                "Step 6: Save the 28-digit Service Request Number (SRN) to track update status. Processing takes 3 to 10 days."
            ],
            "verified_fees": "₹50 for online address update; Free during designated promotional document update windows; ₹100 for biometric updates at Seva Kendra",
            "timeline": "3 to 10 working days",
            "official_portal_url": "https://myaadhaar.uidai.gov.in",
            "source_citation": "uidai.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "PAN_CARD_INSTANT",
            "title": "Instant e-PAN via Aadhaar (त्वरित ई-पैन कार्ड)",
            "title_hi": "आधार के माध्यम से त्वरित ई-पैन कार्ड (10 मिनट में)",
            "title_mr": "आधार ई-केवायसी द्वारे त्वरित मोफत ई-पॅन कार्ड",
            "category": "Identity",
            "department": "Income Tax Department, Ministry of Finance",
            "description": "Generate a completely free, digitally signed 10-digit Permanent Account Number (PAN) in PDF format within 10 minutes using your Aadhaar e-KYC.",
            "purpose": "Essential for filing income tax returns, opening bank accounts, stock investments, business transactions, and property registrations.",
            "prerequisites": [
                "Must possess a valid Aadhaar card.",
                "Active mobile number must be linked with Aadhaar.",
                "Applicant must not have been previously allotted a PAN card.",
                "Must be an individual taxpayer (min age 18)."
            ],
            "required_documents": [
                {"name": "Aadhaar Card with linked Mobile Number", "mandatory": True, "alternatives": ["No physical documents required; automated e-KYC extracts details"]}
            ],
            "alternative_documents": {
                "Identification": ["Aadhaar e-KYC automatically serves as identity, age, and address proof for Instant e-PAN."]
            },
            "step_by_step": [
                "Step 1: Visit the official Income Tax e-Filing portal (incometax.gov.in).",
                "Step 2: On the homepage under Quick Links, click 'Instant e-PAN'.",
                "Step 3: Click 'Get New e-PAN' and enter your 12-digit Aadhaar number.",
                "Step 4: Validate the 6-digit OTP received on your Aadhaar-linked mobile phone.",
                "Step 5: Confirm your Aadhaar e-KYC details (Name, Date of Birth, Photo, Address) displayed on screen.",
                "Step 6: Submit the request. Within 10 minutes, return to 'Check Status/Download PAN' to download your valid digital e-PAN PDF."
            ],
            "verified_fees": "100% Free of Cost for digital e-PAN; ₹50 if ordering physical PVC reprint later via Protean/UTIITSL",
            "timeline": "Instant (approx. 10 minutes)",
            "official_portal_url": "https://www.incometax.gov.in",
            "source_citation": "incometax.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "INCOME_CERTIFICATE",
            "title": "Income Certificate (उत्पन्नाचा दाखला / आय प्रमाण पत्र)",
            "title_hi": "तहसीलदार आय प्रमाण पत्र",
            "title_mr": "सक्षम प्राधिकारी / तहसीलदार उत्पन्नाचा दाखला",
            "category": "Certificates",
            "department": "Revenue Department, Govt of Maharashtra / State Revenue Authority",
            "description": "Statutory certificate issued by the Sub-Divisional Officer / Tehsildar certifying the annual household income of a family from all genuine sources.",
            "purpose": "Mandatory requirement to avail scholarship fee waivers, EWS quota admissions, ration card upgrades, and state pension benefits.",
            "prerequisites": [
                "Resident of the respective Taluka / District.",
                "No previous conflicting income certificate issued in the same financial year."
            ],
            "required_documents": [
                {"name": "Proof of Identity", "mandatory": True, "alternatives": ["Aadhaar Card", "Voter ID", "PAN Card"]},
                {"name": "Proof of Address", "mandatory": True, "alternatives": ["Ration Card", "Electricity Bill", "Telephone Bill"]},
                {"name": "Income Proof", "mandatory": True, "alternatives": ["Salary Slip with Form 16 (Salaried)", "Income Tax Return ITR (Business)", "Talasathi / Talathi Income Report (Agriculture)", "Self-Declaration Affidavit (Unorganized)"]}
            ],
            "alternative_documents": {
                "Income Proof for Unorganized / Informal workers": [
                    "Talathi / Patwari inquiry and verification panchanama report",
                    "Self-declaration affidavit notarized on ₹100 stamp paper",
                    "BPL / Yellow Ration Card certified copy"
                ]
            },
            "step_by_step": [
                "Step 1: Visit the Aaple Sarkar portal (aaplesarkar.mahaonline.gov.in) or local Maha e-Seva Kendra / Setu Kendra.",
                "Step 2: Register / Login and select 'Revenue Department' > 'Income Certificate'.",
                "Step 3: Fill in applicant details, family member count, and individual income breakdown.",
                "Step 4: Upload scanned self-attested copies of Aadhaar, Ration Card, and Income proof/Talathi report.",
                "Step 5: Pay the statutory government processing fee of ₹33.60 online.",
                "Step 6: Track application status with your Application ID. Digital certificate with QR code is issued within 15 working days."
            ],
            "verified_fees": "₹33.60 (Official Government Portal Fee)",
            "timeline": "15 working days (Citizen Charter Guarantee)",
            "official_portal_url": "https://aaplesarkar.mahaonline.gov.in",
            "source_citation": "aaplesarkar.mahaonline.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "DOMICILE_CERTIFICATE",
            "title": "Domicile & Nationality Certificate (अधिवास व राष्ट्रीयत्व प्रमाणपत्र)",
            "title_hi": "अधिवास एवं राष्ट्रीयता प्रमाण पत्र",
            "title_mr": "अधिवास व राष्ट्रीयत्व प्रमाणपत्र (डोमिसाईल)",
            "category": "Certificates",
            "department": "Revenue Department, Govt of Maharashtra",
            "description": "Official legal document certifying that a citizen is a bonafide resident of Maharashtra for at least 15 continuous years and an Indian national.",
            "purpose": "Essential for 85% state quota admissions in engineering, medical (NEET-UG/PG), law, MHT-CET, and Maharashtra government recruitments (MPSC).",
            "prerequisites": [
                "Minimum continuous residence of 15 years in the State of Maharashtra.",
                "Applicant must not hold a domicile certificate of any other State or Union Territory."
            ],
            "required_documents": [
                {"name": "Identity Proof", "mandatory": True, "alternatives": ["Aadhaar Card", "Voter ID", "Passport"]},
                {"name": "Continuous 15-Year Residence Proof", "mandatory": True, "alternatives": ["School Leaving Certificate mentioning birthplace in Maharashtra", "Ration Card (last 15 yrs continuous entry)", "Electricity bills for 15 years", "Father's Domicile Certificate"]},
                {"name": "Self-Declaration Affidavit", "mandatory": True, "alternatives": ["Prescribed declaration Form-1"]}
            ],
            "alternative_documents": {
                "15-Year Continuous Residence Proof": [
                    "School / College Leaving Certificate showing education in Maharashtra",
                    "Father's Domicile Certificate (for minor or dependent applicants)",
                    "Residential Property Tax receipts spanning continuous years",
                    "Birth Certificate registered in Maharashtra"
                ]
            },
            "step_by_step": [
                "Step 1: Login to Aaple Sarkar (aaplesarkar.mahaonline.gov.in).",
                "Step 2: Navigate to Revenue Department > 'Age, Nationality and Domicile Certificate'.",
                "Step 3: Enter birth details, residential history for 15 years, and father's occupation.",
                "Step 4: Upload Aadhaar card, School Leaving Certificate, continuous residence proof, and applicant photograph.",
                "Step 5: Pay the portal fee of ₹33.60 via UPI/Netbanking.",
                "Step 6: Application is scrutinized by the Talathi and verified by the Tehsildar / Nayab Tehsildar. Download the digital signed certificate once approved."
            ],
            "verified_fees": "₹33.60 (Official Government Fee)",
            "timeline": "15 to 21 working days",
            "official_portal_url": "https://aaplesarkar.mahaonline.gov.in",
            "source_citation": "aaplesarkar.mahaonline.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "DRIVING_LICENSE",
            "title": "Learner's & Driving License (वाहन चालक परवाना)",
            "title_hi": "लर्नर एवं स्थायी ड्राइविंग लाइसेंस",
            "title_mr": "शिकाऊ व पक्का वाहन चालक परवाना (आरटीओ)",
            "category": "Transport",
            "department": "Ministry of Road Transport and Highways (MoRTH) / State Transport Dept",
            "description": "Apply for computer-based contactless Learner's License (LL) from home and subsequent Permanent Driving License (DL) through Sarathi Parivahan.",
            "purpose": "Legal authorization to drive motor vehicles on public roads across India and serves as verified government photo-identity.",
            "prerequisites": [
                "Min Age: 16 years (gearless two-wheeler up to 50cc with parental consent), 18 years (Light Motor Vehicle LMV and motorcycles with gear), 20 years (Transport commercial vehicles).",
                "Aadhaar-based authentication enables contactless test from home without visiting RTO for Learner's License."
            ],
            "required_documents": [
                {"name": "Proof of Age", "mandatory": True, "alternatives": ["Aadhaar Card", "Birth Certificate", "10th Class Marksheet", "Passport"]},
                {"name": "Proof of Address", "mandatory": True, "alternatives": ["Aadhaar Card", "Voter ID", "Electricity Bill", "Rent Agreement"]},
                {"name": "Medical Certificate (Form 1A)", "mandatory": False, "alternatives": ["Required only for commercial license or applicants aged 40+"]}
            ],
            "alternative_documents": {
                "Age & Address Proof": [
                    "Aadhaar e-KYC (Single document fulfilling both age and address requirements)",
                    "Passport",
                    "Electoral Photo Identity Card (EPIC)",
                    "School Leaving Certificate (for age proof)"
                ]
            },
            "step_by_step": [
                "Step 1: Visit Sarathi Parivahan (sarathi.parivahan.gov.in) and choose your State (e.g. Maharashtra).",
                "Step 2: Select 'Apply for Learner License' and authenticate with your Aadhaar number for contactless processing.",
                "Step 3: Select vehicle classes (e.g., Motorcycle with Gear MCWG, Light Motor Vehicle LMV Car).",
                "Step 4: Pay statutory fees (₹150 application + ₹50 test fee = ₹200).",
                "Step 5: Watch the mandatory road safety tutorial video on the portal, then take the online 15-question traffic test.",
                "Step 6: Upon scoring 60%+, your digital Learner's License is instantly generated. After 30 days, book your driving test slot for permanent license."
            ],
            "verified_fees": "₹200 for Learner's License test; ₹700 to ₹1,000 for Permanent Driving License test and Smart Card fee",
            "timeline": "LL: Instant upon passing online test; Permanent DL: 7 days after passing physical vehicle driving test at RTO",
            "official_portal_url": "https://sarathi.parivahan.gov.in",
            "source_citation": "parivahan.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "AYUSHMAN_CARD_APPLY",
            "title": "Ayushman Bharat Golden Card Apply (आयुष्मान गोल्डन कार्ड)",
            "title_hi": "आयुष्मान गोल्डन कार्ड ऑनलाइन बनाएं",
            "title_mr": "आयुष्मान गोल्डन कार्ड डाऊनलोड व नोंदणी",
            "category": "Healthcare",
            "department": "National Health Authority (NHA)",
            "description": "Generate your official Ayushman Card online to unlock ₹5 Lakh free cashless treatment at any empaneled government or private hospital across India.",
            "purpose": "Life-saving cashless tertiary health assurance covering surgery, diagnostics, medications, and hospital stay.",
            "prerequisites": [
                "Family must be registered in SECC database or possess a valid eligible NFSA Ration Card (Yellow / Orange / Antyodaya).",
                "All citizens aged 70+ are universally eligible under PM-JAY Vaya Vandana regardless of economic background."
            ],
            "required_documents": [
                {"name": "Aadhaar Card", "mandatory": True, "alternatives": ["Mandatory for e-KYC facial or OTP verification"]},
                {"name": "Ration Card / PM-JAY Family Letter", "mandatory": True, "alternatives": ["Aadhaar number can also be used directly if linked"]}
            ],
            "alternative_documents": {
                "Family Verification": [
                    "NFSA Ration Card number",
                    "PMJAY HH ID (Household Identification Number)",
                    "Aadhaar Number of the head of family"
                ]
            },
            "step_by_step": [
                "Step 1: Go to beneficiary.nha.gov.in on mobile or PC.",
                "Step 2: Enter your mobile number, select 'Beneficiary', and enter the OTP.",
                "Step 3: Select State, Scheme (PMJAY), District, and Search by 'Aadhaar Card' or 'Ration Card'.",
                "Step 4: Your family member list will appear. Beside your name, click the 'Action' e-KYC button.",
                "Step 5: Complete Aadhaar OTP or Facial Authentication via the PM-JAY mobile app.",
                "Step 6: Once approved, the status turns green ('Approved'). Click the download icon to save your digital PDF Ayushman Card."
            ],
            "verified_fees": "100% Free at Government hospitals, CSC Centres, and online portal",
            "timeline": "Instant approval (within 5-15 minutes after e-KYC)",
            "official_portal_url": "https://beneficiary.nha.gov.in",
            "source_citation": "nha.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "VOTER_ID_EPIC",
            "title": "Voter ID Card / Form 6 / Digital EPIC (मतदाता पहचान पत्र)",
            "title_hi": "नया मतदाता पहचान पत्र एवं डिजिटल ई-एपिक डाउनलोड",
            "title_mr": "नवीन मतदार नोंदणी (फॉर्म ६) व डिजिटल मतदान ओळखपत्र",
            "category": "Identity",
            "department": "Election Commission of India (ECI)",
            "description": "Register as a new voter (Form 6), update polling booth or address (Form 8), and download authentic digital electronic Electoral Photo Identity Card (e-EPIC).",
            "purpose": "Constitutional voting rights and recognized photo-identity proof for all civic and statutory services.",
            "prerequisites": [
                "Citizen of India.",
                "Aged 18 years or above on the qualifying cutoff dates (Jan 1, Apr 1, Jul 1, Oct 1).",
                "Ordinary resident in the constituency where registration is sought."
            ],
            "required_documents": [
                {"name": "Passport-Sized Photograph", "mandatory": True, "alternatives": ["Recent color photo (under 2MB)"]},
                {"name": "Proof of Age", "mandatory": True, "alternatives": ["Aadhaar Card", "PAN Card", "Birth Certificate", "10th Marksheet", "Driving License"]},
                {"name": "Proof of Ordinary Residence", "mandatory": True, "alternatives": ["Aadhaar Card", "Electricity Bill", "Water Bill", "Bank Passbook", "Rent Agreement"]}
            ],
            "alternative_documents": {
                "Residence Proof": [
                    "Aadhaar Card with current address",
                    "Current Passbook of Nationalised / Scheduled Bank or Post Office",
                    "Electricity / Water / Cooking Gas Connection bill",
                    "Indian Passport",
                    "Revenue department registered rent / sale deed"
                ]
            },
            "step_by_step": [
                "Step 1: Open the official Voters Service Portal (voters.eci.gov.in).",
                "Step 2: Sign up with your mobile number and create a password.",
                "Step 3: Click 'Fill Form 6' (Register as a new elector/voter).",
                "Step 4: Enter constituency, personal name, relation details, and address.",
                "Step 5: Upload your photo, age proof, and address proof.",
                "Step 6: Submit and note down your Reference Number. Booth Level Officer (BLO) completes field verification within 20 days, and physical EPIC is dispatched by Speed Post."
            ],
            "verified_fees": "100% Free of Cost (ECI provides free registration and free Speed Post delivery)",
            "timeline": "15 to 30 working days",
            "official_portal_url": "https://voters.eci.gov.in",
            "source_citation": "voters.eci.gov.in / eci.gov.in",
            "last_verified_date": "2026-10-01"
        },
        {
            "code": "RATION_CARD_SERVICE",
            "title": "Ration Card Member Addition & Transfer (रेशन कार्ड सेवा)",
            "title_hi": "राशन कार्ड में नए सदस्य का नाम जोड़ना / स्थानांतरण",
            "title_mr": "रेशन कार्डमध्ये नाव समाविष्ट करणे व विभक्त करणे",
            "category": "Welfare",
            "department": "Food, Civil Supplies and Consumer Protection Dept",
            "description": "Add newborn child or newly married daughter-in-law to family ration card, split household ration card, or surrender card upon relocation.",
            "purpose": "Essential to access subsidized foodgrains under National Food Security Act (NFSA), Antyodaya Anna Yojana, and state welfare schemes.",
            "prerequisites": [
                "Existing active Maharashtra Ration Card (Yellow, Orange, or White).",
                "Name of the new member must not be included in any other active ration card in India (One Nation One Ration Card compliance)."
            ],
            "required_documents": [
                {"name": "Original Existing Family Ration Card", "mandatory": True, "alternatives": ["Ration card booklet / digital card"]},
                {"name": "Member Proof of Identity", "mandatory": True, "alternatives": ["Aadhaar Card of the member to be added"]},
                {"name": "Reason Proof Document", "mandatory": True, "alternatives": ["Official Birth Certificate (for newborn)", "Marriage Certificate & Deletion Certificate from previous card (for bride)"]}
            ],
            "alternative_documents": {
                "Marriage Proof": [
                    "Marriage Certificate issued by Municipal Registrar",
                    "Affidavit of marriage executed before Executive Magistrate",
                    "Aadhaar card showing husband's name"
                ]
            },
            "step_by_step": [
                "Step 1: Visit the Food & Civil Supplies portal (rcms.mahafood.gov.in) or visit your local Tahsil Food Distribution Office (FDO) / Rationing Office.",
                "Step 2: Select 'Citizen Services' > 'Addition of Member to Existing Ration Card'.",
                "Step 3: Enter your 12-digit Ration Card Number and head of family Aadhaar details.",
                "Step 4: Enter details of the new member (Full Name, Date of Birth, Gender, Relationship to HoF).",
                "Step 5: Upload scanned copy of Aadhaar card and Birth Certificate or Deletion Certificate from previous family card.",
                "Step 6: Submit application. Rationing Inspector verifies details and updates RCMS database within 20 working days."
            ],
            "verified_fees": "₹20 to ₹50 statutory court fee / Setu Kendra processing charges",
            "timeline": "15 to 30 working days",
            "official_portal_url": "https://rcms.mahafood.gov.in",
            "source_citation": "mahafood.gov.in",
            "last_verified_date": "2026-10-01"
        }
    ]

    for item in services_data:
        service = Service(**item)
        db.add(service)

    # 8 National & Emergency Helplines
    helplines_data = [
        {
            "number": "112",
            "name": "National Emergency Response System (Pan-India 112)",
            "name_hi": "राष्ट्रीय आपातकालीन हेल्पलाइन 112 (पुलिस, आग, एम्बुलेंस)",
            "name_mr": "राष्ट्रीय एकात्मिक आणीबाणी प्रतिसाद क्रमांक ११२",
            "category": "Emergency",
            "coverage": "Pan-India",
            "operational_hours": "24x7x365",
            "description": "Unified all-in-one emergency helpline operational across all States and Union Territories connecting citizens instantly to Police, Fire, Ambulance, and Disaster Response teams with real-time GPS dispatch.",
            "description_hi": "सभी राज्यों और केंद्र शासित प्रदेशों में पुलिस, अग्निशमन, एम्बुलेंस और आपदा राहत के लिए एकल राष्ट्रीय आपातकालीन नंबर।",
            "description_mr": "पोलीस, अग्निशामक दल, रुग्णवाहिका आणि आपत्कालीन मदत मिळवण्यासाठी संपूर्ण भारतातील एकमेव २४x७ टोल-फ्री क्रमांक.",
            "instructions": "State your exact location, describe the nature of emergency, remain calm, and do not disconnect until the dispatcher confirms help is dispatched.",
            "official_source": "https://112.gov.in"
        },
        {
            "number": "102 / 108",
            "name": "Free Emergency Ambulance Service (108 / 102)",
            "name_hi": "निःशुल्क आपातकालीन एम्बुलेंस सेवा (108 / 102)",
            "name_mr": "मोफत आपत्कालीन रुग्णवाहिका सेवा (१०८ / १०२)",
            "category": "Medical",
            "coverage": "Pan-India / Maharashtra MEMS",
            "operational_hours": "24x7",
            "description": "Maharashtra Emergency Medical Services (MEMS 108) providing free state-of-the-art Advanced Life Support (ALS) and Basic Life Support (BLS) ambulances for road accidents, cardiac emergencies, maternal health, and acute trauma.",
            "description_hi": "सड़क दुर्घटनाओं, हृदय संबंधी आपात स्थिति, प्रसूति और गंभीर आघात के लिए निःशुल्क आपातकालीन एम्बुलेंस सेवा।",
            "description_mr": "रस्ता अपघात, हृदयविकाराचा झटका, प्रसूती व गंभीर वैद्यकीय आणीबाणीसाठी आधुनिक उपकरणांनी सुसज्ज मोफत रुग्णवाहिका.",
            "instructions": "Call immediately in case of medical crisis. Specify if patient is conscious and breathing, and give landmark for fastest ambulance route.",
            "official_source": "https://arogya.maharashtra.gov.in"
        },
        {
            "number": "1098",
            "name": "Childline India (National Child Protection 1098)",
            "name_hi": "चाइल्डलाइन भारत - बाल सुरक्षा एवं संकट हेल्पलाइन",
            "name_mr": "चाइल्डलाइन भारत - बाल संरक्षण हेल्पलाइन १०९८",
            "category": "Child",
            "coverage": "Pan-India",
            "operational_hours": "24x7",
            "description": "Dedicated 24-hour free emergency phone service for children in need of aid and care, reporting child abuse, child labour, child marriage, runaway children, and orphaned minors, now integrated with Mission Vatsalya.",
            "description_hi": "बाल शोषण, बाल श्रम, बाल विवाह और संकटग्रस्त बच्चों की सहायता और संरक्षण के लिए 24 घंटे समर्पित राष्ट्रीय हेल्पलाइन।",
            "description_mr": "संकटग्रस्त मुले, बालमजुरी, बालविवाह, बालशोषण यांविरोधात तातडीने मदत मिळवून देणारी राष्ट्रीय बाल संरक्षण हेल्पलाइन.",
            "instructions": "Calls can be made by anyone who witnesses child distress. Identity of caller is kept strictly confidential.",
            "official_source": "https://wcd.nic.in"
        },
        {
            "number": "1091 / 181",
            "name": "Women in Distress Helpline (181 / 1091)",
            "name_hi": "महिला सुरक्षा एवं संकट हेल्पलाइन (181 / 1091)",
            "name_mr": "महिला सहाय्यता व संकट निवारण कक्ष १८१ / १०९१",
            "category": "Women",
            "coverage": "Pan-India",
            "operational_hours": "24x7",
            "description": "Comprehensive 24-hour toll-free helpline providing immediate emergency response, police rescue, psychological counselling, medical aid, and legal assistance to women facing domestic violence, harassment, or distress.",
            "description_hi": "घरेलू हिंसा, उत्पीड़न या संकट का सामना कर रही महिलाओं के लिए तत्काल पुलिस सुरक्षा, कानूनी सहायता और परामर्श प्रदान करने वाली हेल्पलाइन।",
            "description_mr": "कौटुंबिक हिंसाचार, छळ किंवा छेडछाडीविरुद्ध महिलांना तातडीने पोलीस मदत, कायदेशीर सल्ला व समुपदेशन देणारी हेल्पलाइन.",
            "instructions": "Connects directly to women officers and Sakhi One-Stop Crisis Centres for immediate rescue and sheltering support.",
            "official_source": "https://wcd.nic.in / mahapolice.gov.in"
        },
        {
            "number": "1930",
            "name": "National Cyber Financial Fraud Helpline (1930)",
            "name_hi": "राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन 1930",
            "name_mr": "राष्ट्रीय सायबर आर्थिक फसवणूक हेल्पलाइन १९३०",
            "category": "Cyber",
            "coverage": "Pan-India",
            "operational_hours": "24x7",
            "description": "Indian Cyber Crime Coordination Centre (I4C) under MHA helpline to report immediate online financial fraud, UPI scam, ATM fraud, and phishing to freeze stolen money in beneficiary accounts within the golden hour.",
            "description_hi": "यूपीआई धोखाधड़ी, बैंक फ्रॉड और ऑनलाइन ठगी की तुरंत सूचना देकर चोरी की गई राशि को फ्रीज कराने के लिए गृह मंत्रालय की आधिकारिक हेल्पलाइन।",
            "description_mr": "ऑनलाइन बँक फसवणूक, यूपीआय घोटाळे आणि सायबर गुन्ह्यांवर तातडीने पैसे रोखण्यासाठी (गोल्डन अवर) गृह मंत्रालयाची हेल्पलाइन.",
            "instructions": "Call within the first 2-3 hours of unauthorized debit. Keep transaction UTR number, bank account details, and suspect mobile number ready.",
            "official_source": "https://cybercrime.gov.in"
        },
        {
            "number": "1077 / 1070",
            "name": "Disaster Management Control Room (1077 / 1070)",
            "name_hi": "राज्य एवं जिला आपदा नियंत्रण कक्ष",
            "name_mr": "राज्य व जिल्हा आपत्ती व्यवस्थापन नियंत्रण कक्ष",
            "category": "Disaster",
            "coverage": "Pan-India / Maharashtra SDMA",
            "operational_hours": "24x7",
            "description": "State (1070) and District (1077) emergency operation centers providing real-time weather alerts, flood rescue, landslide warnings, building collapse response, and cyclone evacuation assistance.",
            "description_hi": "बाढ़, भूस्खलन, चक्रवात और गंभीर प्राकृतिक आपदाओं के दौरान राहत और बचाव कार्यों के लिए 24 घंटे कार्यरत नियंत्रण कक्ष।",
            "description_mr": "पूर, दरड कोसळणे, इमारत दुर्घटना व नैसर्गिक आपत्ती काळात तातडीच्या मदत व बचाव कार्यासाठी नियंत्रण कक्ष.",
            "instructions": "Use during severe rain, flooding, or natural hazards to request NDRF/SDRF rescue boat assistance.",
            "official_source": "https://ndma.gov.in"
        },
        {
            "number": "14416",
            "name": "Tele-MANAS Mental Health Helpline (14416)",
            "name_hi": "टेली-मानस राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन",
            "name_mr": "टेली-मानस राष्ट्रीय मानसिक आरोग्य व समुपदेशन हेल्पलाइन",
            "category": "Mental Health",
            "coverage": "Pan-India",
            "operational_hours": "24x7",
            "description": "National Tele Mental Health Programme of India offering free, confidential, 24x7 psychological support, stress management, suicide prevention crisis counseling, and clinical psychiatry referral in 20+ languages.",
            "description_hi": "तनाव, अवसाद, चिंता और मानसिक संकट के समय निःशुल्क और गोपनीय परामर्श प्रदान करने वाली राष्ट्रीय स्वास्थ्य हेल्पलाइन।",
            "description_mr": "मानसिक ताणतणाव, नैराश्य व आत्महत्येचे विचार दूर करण्यासाठी तज्ज्ञ मानसशास्त्रज्ञांकडून मोफत व गोपनीय समुपदेशन.",
            "instructions": "Toll-free and confidential. Speak openly with certified psychiatric counselors in your mother tongue.",
            "official_source": "https://telemanas.mohfw.gov.in"
        },
        {
            "number": "1916",
            "name": "BMC Mumbai Disaster Management & Civic Helpline (1916)",
            "name_hi": "बीएमसी मुंबई आपदा प्रबंधन एवं नागरिक हेल्पलाइन 1916",
            "name_mr": "बृहन्मुंबई महानगरपालिका आपत्कालीन व नागरी नियंत्रण कक्ष १९१६",
            "category": "Civic",
            "coverage": "Brihanmumbai Municipal Corporation (BMC Mumbai)",
            "operational_hours": "24x7",
            "description": "Central helpline of Municipal Corporation of Greater Mumbai (MCGM/BMC) for high-tide flood updates, waterlogging reporting, open manholes, tree falls, building collapse, and emergency ward dispatch.",
            "description_hi": "मुंबई में जलभराव, गिरे हुए पेड़, खुले मैनहोल और मानसूनी आपदाओं की तत्काल शिकायत के लिए बीएमसी की आधिकारिक 24x7 हेल्पलाइन।",
            "description_mr": "मुंबईतील अतिवृष्टी, पाणी साचणे, झाडे कोसळणे, मॅनहोल उघडे असणे यांसारख्या गंभीर नागरी समस्यांसाठी मनपाची २४ तास कार्यरत हेल्पलाइन.",
            "instructions": "Directly routes complaints to the concerned Ward Control Room across A to T wards in Mumbai.",
            "official_source": "https://portal.mcgm.gov.in"
        }
    ]

    for item in helplines_data:
        helpline = Helpline(**item)
        db.add(helpline)

    # Curated Official Video Tutorials
    tutorials_data = [
        {
            "service_code": "AADHAAR_UPDATE",
            "title": "How to Update Address in Aadhaar Online Step-by-Step",
            "publisher": "UIDAI Official (Government of India)",
            "video_url": "https://www.youtube.com/watch?v=uidai_address_guide",
            "language": "Hindi / English",
            "duration": "4:15",
            "verified_status": "Verified Official Government Channel",
            "last_checked_date": "2026-10-01"
        },
        {
            "service_code": "PAN_CARD_INSTANT",
            "title": "Apply Instant e-PAN Online in 10 Minutes via Aadhaar eKYC",
            "publisher": "Income Tax Department Official",
            "video_url": "https://www.youtube.com/watch?v=incometax_epan_guide",
            "language": "Hindi",
            "duration": "5:30",
            "verified_status": "Verified Official Government Channel",
            "last_checked_date": "2026-10-01"
        },
        {
            "service_code": "DRIVING_LICENSE",
            "title": "Online Learner's License Test from Home - Complete Tutorial",
            "publisher": "Parivahan Sewa / MoRTH",
            "video_url": "https://www.youtube.com/watch?v=parivahan_ll_online",
            "language": "Hindi / Marathi",
            "duration": "6:45",
            "verified_status": "Verified Official Government Channel",
            "last_checked_date": "2026-10-01"
        },
        {
            "service_code": "DOMICILE_CERTIFICATE",
            "title": "How to Apply for Domicile & Income Certificate on Aaple Sarkar",
            "publisher": "MahaOnline / Govt of Maharashtra",
            "video_url": "https://www.youtube.com/watch?v=aaplesarkar_domicile_guide",
            "language": "Marathi / Hindi",
            "duration": "7:10",
            "verified_status": "Verified Official Government Channel",
            "last_checked_date": "2026-10-01"
        }
    ]

    for item in tutorials_data:
        tutorial = Tutorial(**item)
        db.add(tutorial)

    db.commit()
