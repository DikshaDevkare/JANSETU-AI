export type Language = 'en' | 'hi' | 'mr' | 'hinglish';

export interface Scheme {
  id: number;
  code: string;
  title: string;
  title_hi?: string;
  title_mr?: string;
  category: string;
  level: string; // Central, State
  state: string; // Pan-India, Maharashtra
  ministry?: string;
  description: string;
  description_hi?: string;
  description_mr?: string;
  key_benefits: string[];
  eligibility_criteria: Record<string, any>;
  required_documents: {
    name: string;
    mandatory: boolean;
    description: string;
  }[];
  application_steps: string[];
  official_url: string;
  source_citation: string;
  last_verified_date: string;
  is_active: boolean;
}

export interface RequirementEvaluation {
  condition: string;
  status: 'satisfied' | 'needs_clarification' | 'unverified';
  details: string;
}

export interface EligibilityResult {
  scheme_title: string;
  scheme_code: string;
  overall_status: string; // Likely Eligible, Needs Verification, Ineligible
  satisfied_requirements: RequirementEvaluation[];
  needs_clarification: RequirementEvaluation[];
  unverified_requirements: RequirementEvaluation[];
  official_source: string;
  last_verified_date: string;
  official_portal_url: string;
  disclaimer: string;
}

export interface Service {
  id: number;
  code: string;
  title: string;
  title_hi?: string;
  title_mr?: string;
  category: string;
  department?: string;
  description: string;
  purpose?: string;
  prerequisites: string[];
  required_documents: {
    name: string;
    mandatory: boolean;
    alternatives?: string[];
  }[];
  alternative_documents: Record<string, string[]>;
  step_by_step: string[];
  verified_fees: string;
  timeline: string;
  official_portal_url: string;
  source_citation: string;
  last_verified_date: string;
}

export interface CivicDraft {
  tracking_code: string;
  category: string;
  urgency_level: string;
  subject: string;
  letter_body: string;
  routed_authority: string;
  official_portal_link: string;
  contact_helpline: string;
  instructions: string[];
  disclaimer: string;
}

export interface Helpline {
  id: number;
  number: string;
  name: string;
  name_hi?: string;
  name_mr?: string;
  category: string;
  coverage: string;
  operational_hours: string;
  description: string;
  description_hi?: string;
  description_mr?: string;
  instructions?: string;
  official_source: string;
}

export interface Tutorial {
  id: number;
  service_code: string;
  title: string;
  publisher: string;
  video_url: string;
  language: string;
  duration: string;
  verified_status: string;
  last_checked_date: string;
}

export interface SavedTask {
  id?: number;
  task_type: 'scheme' | 'service' | 'civic_draft';
  reference_id: string;
  reference_title: string;
  checklist_state: Record<string, boolean>;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SourceCitation {
  title: string;
  url: string;
  publisher: string;
  verified_date: string;
}

export interface SuggestedAction {
  label: string;
  action_type: 'navigate' | 'check_eligibility' | 'draft_complaint' | 'open_link' | 'call_helpline';
  payload: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  citations?: SourceCitation[];
  suggested_actions?: SuggestedAction[];
  isSpeaking?: boolean;
}
