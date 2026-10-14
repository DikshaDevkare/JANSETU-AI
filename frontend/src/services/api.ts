import axios from 'axios';
import {
  Scheme,
  Service,
  EligibilityResult,
  CivicDraft,
  Helpline,
  Tutorial,
  SavedTask,
  SourceCitation,
  SuggestedAction
} from '../types';

const API_BASE = '/api';

export const api = {
  // Schemes
  async getSchemes(params?: { category?: string; level?: string; state?: string; search?: string }): Promise<Scheme[]> {
    const res = await axios.get(`${API_BASE}/schemes`, { params });
    return res.data;
  },

  async getSchemeById(id: number): Promise<Scheme> {
    const res = await axios.get(`${API_BASE}/schemes/${id}`);
    return res.data;
  },

  async checkEligibility(payload: {
    scheme_code?: string;
    scheme_id?: number;
    age?: number;
    gender?: string;
    annual_income?: number;
    occupation?: string;
    state?: string;
    landholding_acres?: number;
    has_disability?: boolean;
  }): Promise<EligibilityResult> {
    const res = await axios.post(`${API_BASE}/schemes/eligibility-check`, payload);
    return res.data;
  },

  // Services
  async getServices(params?: { category?: string; search?: string }): Promise<Service[]> {
    const res = await axios.get(`${API_BASE}/services`, { params });
    return res.data;
  },

  async getServiceById(id: number): Promise<Service> {
    const res = await axios.get(`${API_BASE}/services/${id}`);
    return res.data;
  },

  // Civic Complaints
  async classifyCivic(payload: { description: string; location?: string }): Promise<{
    category: string;
    urgency_level: string;
    identified_keywords: string[];
    recommended_ward?: string;
    confidence_score: number;
  }> {
    const res = await axios.post(`${API_BASE}/civic/classify`, payload);
    return res.data;
  },

  async generateCivicDraft(payload: {
    category: string;
    description: string;
    ward_id?: string;
    location_address?: string;
    landmark?: string;
    citizen_name?: string;
    contact_phone?: string;
    language?: string;
  }): Promise<CivicDraft> {
    const res = await axios.post(`${API_BASE}/civic/draft`, payload);
    return res.data;
  },

  async getAuthorities(): Promise<any> {
    const res = await axios.get(`${API_BASE}/civic/authorities`);
    return res.data;
  },

  async saveCivicDraft(payload: any): Promise<any> {
    const res = await axios.post(`${API_BASE}/civic/drafts`, payload);
    return res.data;
  },

  async getCivicDrafts(): Promise<any[]> {
    const res = await axios.get(`${API_BASE}/civic/drafts`);
    return res.data;
  },

  // Helplines
  async getHelplines(params?: { category?: string; search?: string }): Promise<Helpline[]> {
    const res = await axios.get(`${API_BASE}/helplines`, { params });
    return res.data;
  },

  // Tutorials
  async getTutorials(serviceCode?: string): Promise<Tutorial[]> {
    const res = await axios.get(`${API_BASE}/tutorials`, {
      params: serviceCode ? { service_code: serviceCode } : undefined
    });
    return res.data;
  },

  // AI Assistant (Grounded RAG)
  async chatAssistant(payload: {
    message: string;
    language?: string;
    conversation_history?: Array<{ role: string; content: string }>;
    context_module?: string;
  }): Promise<{
    reply: string;
    language: string;
    citations: SourceCitation[];
    suggested_actions: SuggestedAction[];
    confidence: number;
  }> {
    const res = await axios.post(`${API_BASE}/assistant/chat`, payload);
    return res.data;
  },

  // Voice capabilities
  async getVoiceCapabilities(): Promise<any> {
    const res = await axios.get(`${API_BASE}/voice/capabilities`);
    return res.data;
  },

  // Saved Tasks & Checklists
  async getSavedTasks(): Promise<SavedTask[]> {
    const res = await axios.get(`${API_BASE}/saved-tasks`);
    return res.data;
  },

  async saveTask(task: SavedTask): Promise<SavedTask> {
    const res = await axios.post(`${API_BASE}/saved-tasks`, task);
    return res.data;
  },

  async deleteSavedTask(id: number): Promise<void> {
    await axios.delete(`${API_BASE}/saved-tasks/${id}`);
  }
};
