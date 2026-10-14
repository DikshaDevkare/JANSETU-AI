from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeOut, EligibilityCheckRequest, EligibilityCheckResponse, RequirementEvaluation

router = APIRouter(prefix="/schemes", tags=["Schemes & Benefits"])

@router.get("", response_model=list[SchemeOut])
def get_schemes(
    category: Optional[str] = Query(None, description="Filter by category"),
    level: Optional[str] = Query(None, description="Filter by Central or State"),
    state: Optional[str] = Query(None, description="Filter by State"),
    search: Optional[str] = Query(None, description="Keyword search"),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.is_active == True)

    if category and category.lower() != "all":
        query = query.filter(Scheme.category.ilike(f"%{category}%"))
    if level and level.lower() != "all":
        query = query.filter(Scheme.level.ilike(f"%{level}%"))
    if state and state.lower() != "all":
        query = query.filter((Scheme.state.ilike(f"%{state}%")) | (Scheme.state == "Pan-India"))

    schemes = query.all()

    if search:
        search_lower = search.lower()
        schemes = [
            s for s in schemes
            if search_lower in s.title.lower()
            or (s.title_hi and search_lower in s.title_hi.lower())
            or (s.title_mr and search_lower in s.title_mr.lower())
            or search_lower in s.description.lower()
            or search_lower in s.category.lower()
            or any(search_lower in b.lower() for b in (s.key_benefits or []))
        ]

    return schemes

@router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme_by_id(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme

@router.post("/eligibility-check", response_model=EligibilityCheckResponse)
def check_eligibility(req: EligibilityCheckRequest, db: Session = Depends(get_db)):
    scheme = None
    if req.scheme_id:
        scheme = db.query(Scheme).filter(Scheme.id == req.scheme_id).first()
    elif req.scheme_code:
        scheme = db.query(Scheme).filter(Scheme.code == req.scheme_code).first()

    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found for eligibility check")

    criteria = scheme.eligibility_criteria or {}
    satisfied: list[RequirementEvaluation] = []
    clarification: list[RequirementEvaluation] = []
    unverified: list[RequirementEvaluation] = []

    # 1. State check
    if scheme.level == "State" and scheme.state != "Pan-India":
        if req.state and req.state.lower() == scheme.state.lower():
            satisfied.append(RequirementEvaluation(
                condition=f"State Residency in {scheme.state}",
                status="satisfied",
                details=f"Citizen resides in {req.state}, fulfilling state jurisdiction requirement."
            ))
        elif req.state:
            clarification.append(RequirementEvaluation(
                condition=f"State Residency in {scheme.state}",
                status="needs_clarification",
                details=f"Scheme is restricted to residents of {scheme.state}. Provided state: {req.state}. 15-year domicile proof required."
            ))
    else:
        satisfied.append(RequirementEvaluation(
            condition="Pan-India National Scope",
            status="satisfied",
            details="Open to Indian citizens residing in any State or Union Territory."
        ))

    # 2. Gender check
    allowed_genders = criteria.get("gender")
    if allowed_genders:
        if req.gender and req.gender in allowed_genders:
            satisfied.append(RequirementEvaluation(
                condition="Gender Requirement",
                status="satisfied",
                details=f"Applicant gender ({req.gender}) matches requirement ({', '.join(allowed_genders)})."
            ))
        elif req.gender:
            clarification.append(RequirementEvaluation(
                condition="Gender Requirement",
                status="needs_clarification",
                details=f"Scheme specifically targets {', '.join(allowed_genders)} applicants."
            ))

    # 3. Age checks
    min_age = criteria.get("min_age")
    max_age = criteria.get("max_age")
    if req.age is not None:
        if min_age and req.age < min_age:
            clarification.append(RequirementEvaluation(
                condition=f"Minimum Age ({min_age} years)",
                status="needs_clarification",
                details=f"Current age ({req.age}) is below the prescribed threshold of {min_age} years."
            ))
        elif min_age:
            satisfied.append(RequirementEvaluation(
                condition=f"Minimum Age ({min_age} years)",
                status="satisfied",
                details=f"Age ({req.age} yrs) meets the minimum requirement of {min_age} years."
            ))

        if max_age and req.age > max_age:
            clarification.append(RequirementEvaluation(
                condition=f"Maximum Age Limit ({max_age} years)",
                status="needs_clarification",
                details=f"Current age ({req.age}) exceeds the maximum eligible age of {max_age} years."
            ))
        elif max_age:
            satisfied.append(RequirementEvaluation(
                condition=f"Maximum Age Limit ({max_age} years)",
                status="satisfied",
                details=f"Age ({req.age} yrs) is within the eligible age ceiling of {max_age} years."
            ))
    else:
        if min_age or max_age:
            unverified.append(RequirementEvaluation(
                condition="Age Verification",
                status="unverified",
                details="Age was not provided; requires verification with Aadhaar / School Certificate."
            ))

    # 4. Income check
    max_income = criteria.get("max_annual_income")
    if max_income and req.annual_income is not None:
        if req.annual_income <= max_income:
            satisfied.append(RequirementEvaluation(
                condition=f"Income Ceiling (Below ₹{max_income:,.0f}/year)",
                status="satisfied",
                details=f"Reported income ₹{req.annual_income:,.0f} is within the required ceiling of ₹{max_income:,.0f}."
            ))
        else:
            clarification.append(RequirementEvaluation(
                condition=f"Income Ceiling (Below ₹{max_income:,.0f}/year)",
                status="needs_clarification",
                details=f"Reported income ₹{req.annual_income:,.0f} exceeds maximum threshold of ₹{max_income:,.0f}."
            ))
    elif max_income:
        unverified.append(RequirementEvaluation(
            condition=f"Annual Family Income (Must be under ₹{max_income:,.0f})",
            status="unverified",
            details="Income certificate issued by competent authority (Tahsildar / Form 16) must be submitted."
        ))

    # 5. Landholding & Occupation check
    if criteria.get("landholding_required"):
        if req.occupation and ("farmer" in req.occupation.lower() or "agri" in req.occupation.lower()):
            satisfied.append(RequirementEvaluation(
                condition="Farmer / Landholder Status",
                status="satisfied",
                details="Applicant identifies as farmer with agricultural landholding."
            ))
        else:
            clarification.append(RequirementEvaluation(
                condition="Cultivable Land Ownership",
                status="needs_clarification",
                details="Scheme requires cultivable landholding recorded in official 7/12 / RoR records."
            ))

    # 6. Traditional craft check
    if criteria.get("occupation_traditional_artisan"):
        if req.occupation and any(craft in req.occupation.lower() for craft in ["artisan", "carpenter", "blacksmith", "craftsman", "potter", "mason", "tailor"]):
            satisfied.append(RequirementEvaluation(
                condition="Traditional Artisan Trade",
                status="satisfied",
                details=f"Engaged in eligible artisan trade ({req.occupation})."
            ))
        else:
            unverified.append(RequirementEvaluation(
                condition="Traditional Trade Verification",
                status="unverified",
                details="Trade must be verified by Gram Panchayat or Urban Local Body (ULB) Committee."
            ))

    # Determine overall status
    if len(clarification) == 0 and len(satisfied) >= 2:
        overall = "Likely Eligible"
    elif len(clarification) > 1:
        overall = "Ineligible (Conditions Not Met)"
    else:
        overall = "Needs Verification"

    return EligibilityCheckResponse(
        scheme_title=scheme.title,
        scheme_code=scheme.code,
        overall_status=overall,
        satisfied_requirements=satisfied,
        needs_clarification=clarification,
        unverified_requirements=unverified,
        official_source=scheme.source_citation,
        last_verified_date=scheme.last_verified_date,
        official_portal_url=scheme.official_url
    )
