export interface Declaration {
  value: string;
  confidence: number;
  status?: "detected" | "needs_review" | "not_detected";
}

export interface EvidenceRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FindingStatus = "POTENTIAL_ISSUE" | "NEEDS_REVIEW" | "CLEAR" | "NOT_CONFIRMED";
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type InspectionStatus = "PENDING" | "IN_PROGRESS" | "NEEDS_REVIEW" | "COMPLETED" | "FAILED";
export type ReviewStatus = "PENDING" | "VERIFIED" | "NOT_CONFIRMED" | "NEEDS_FURTHER";

export interface Finding {
  id: string;
  field: string;
  field_label: string;
  status: FindingStatus;
  confidence: number;
  reason: string;
  rule_reference: string;
  evidence_region?: EvidenceRegion;
  inspector_decision?: ReviewStatus;
  inspector_note?: string;
}

export interface InspectionDeclarations {
  mrp?: Declaration;
  net_quantity?: Declaration;
  manufacturer?: Declaration;
  batch?: Declaration;
  date?: Declaration;
  consumer_information?: Declaration;
  country_of_origin?: Declaration;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  breakdown: {
    potential_findings: number;
    low_confidence_fields: number;
    high_priority_findings: number;
  };
  factors: string[];
}

export interface InspectorReview {
  status: ReviewStatus | "PENDING";
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface InspectionProduct {
  name: string;
  category: string;
  pack_size: string;
  brand?: string;
}

export interface AnalysisStage {
  id: string;
  label: string;
  status: "pending" | "running" | "done" | "error";
}

export interface Inspection {
  inspection_id: string;
  date: string;
  location: string;
  inspector: string;
  inspection_type: string;
  product: InspectionProduct;
  declarations: InspectionDeclarations;
  findings: Finding[];
  risk: RiskAssessment;
  inspector_review: InspectorReview;
  status: InspectionStatus;
  image_url?: string;
  analysis_completed?: boolean;
}

export interface Notification {
  id: string;
  type: "info" | "warning" | "danger" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  inspection_id?: string;
}

export interface Inspector {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  employee_id: string;
  last_login: string;
  location: string;
}

export interface DashboardStats {
  today_inspections: number;
  pending_review: number;
  high_risk: number;
  completed: number;
}
