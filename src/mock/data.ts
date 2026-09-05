import type { Inspection, Notification, Inspector, DashboardStats } from "../types";

export const mockInspector: Inspector = {
  id: "INS-USR-001",
  name: "Rajiv Sharma",
  designation: "Senior Legal Metrology Inspector",
  department: "Department of Legal Metrology",
  email: "r.sharma@legalmetrology.gov.in",
  phone: "+91 98765 43210",
  employee_id: "LMI-2019-0042",
  last_login: "05 Sep 2026, 09:14 AM",
  location: "Delhi NCR Region",
};

export const demoInspection: Inspection = {
  inspection_id: "INS-10024",
  date: "05 Sep 2026",
  location: "Delhi NCR Region — Sector 18, Noida",
  inspector: "Rajiv Sharma",
  inspection_type: "Routine Market Inspection",
  product: {
    name: "Parle-G Gold Biscuits",
    category: "Packaged Food",
    pack_size: "800 g",
    brand: "Parle Products Pvt. Ltd.",
  },
  declarations: {
    mrp: { value: "₹50", confidence: 0.96, status: "detected" },
    net_quantity: { value: "800 g", confidence: 0.98, status: "detected" },
    manufacturer: { value: "Parle Products Pvt. Ltd., Mumbai", confidence: 0.91, status: "detected" },
    batch: { value: "B24SEP-009", confidence: 0.93, status: "detected" },
    date: { value: "MFG: 09/2024 | EXP: 09/2025", confidence: 0.89, status: "detected" },
    consumer_information: { value: "Not Detected", confidence: 0.41, status: "needs_review" },
  },
  findings: [
    {
      id: "F001",
      field: "consumer_information",
      field_label: "Consumer Information",
      status: "POTENTIAL_ISSUE",
      confidence: 0.41,
      reason: "Required consumer information could not be confidently detected on the package label. The field appears partially obscured or absent.",
      rule_reference: "RULE-LM-2011-S7(1)",
      evidence_region: { x: 120, y: 300, width: 400, height: 100 },
      inspector_decision: undefined,
    },
    {
      id: "F002",
      field: "date",
      field_label: "Date Information",
      status: "NEEDS_REVIEW",
      confidence: 0.89,
      reason: "Date information detected but format may require inspector verification against applicable standards.",
      rule_reference: "RULE-LM-2011-S6(2)",
      evidence_region: { x: 220, y: 180, width: 280, height: 60 },
      inspector_decision: undefined,
    },
  ],
  risk: {
    score: 72,
    level: "HIGH",
    breakdown: { potential_findings: 2, low_confidence_fields: 1, high_priority_findings: 1 },
    factors: [
      "Consumer information could not be detected (high priority field)",
      "Date format requires inspector verification",
      "Low confidence on 1 extracted field",
    ],
  },
  inspector_review: { status: "PENDING" },
  status: "NEEDS_REVIEW",
  image_url: "https://images.unsplash.com/photo-1700727448575-6f1680cd7d75?w=600&h=800&fit=crop&auto=format",
  analysis_completed: true,
};

export const mockInspections: Inspection[] = [
  demoInspection,
  {
    inspection_id: "INS-10023",
    date: "05 Sep 2026",
    location: "Delhi NCR Region",
    inspector: "Rajiv Sharma",
    inspection_type: "Complaint-Based",
    product: { name: "Fortune Refined Oil", category: "Edible Oil", pack_size: "1 L", brand: "Adani Wilmar" },
    declarations: {
      mrp: { value: "₹145", confidence: 0.97, status: "detected" },
      net_quantity: { value: "1 L", confidence: 0.99, status: "detected" },
      manufacturer: { value: "Adani Wilmar Ltd.", confidence: 0.95, status: "detected" },
      batch: { value: "OIL240905", confidence: 0.94, status: "detected" },
      date: { value: "MFG: Aug 2024", confidence: 0.92, status: "detected" },
      consumer_information: { value: "FSSAI Lic. No. 10013022000207", confidence: 0.88, status: "detected" },
    },
    findings: [],
    risk: { score: 18, level: "LOW", breakdown: { potential_findings: 0, low_confidence_fields: 0, high_priority_findings: 0 }, factors: [] },
    inspector_review: { status: "VERIFIED", reviewed_at: "05 Sep 2026", reviewed_by: "Rajiv Sharma" },
    status: "COMPLETED",
    analysis_completed: true,
  },
  {
    inspection_id: "INS-10022",
    date: "04 Sep 2026",
    location: "Delhi NCR Region",
    inspector: "Rajiv Sharma",
    inspection_type: "Routine Market Inspection",
    product: { name: "Tata Salt", category: "Packaged Salt", pack_size: "1 kg", brand: "Tata Consumer Products" },
    declarations: {
      mrp: { value: "₹24", confidence: 0.98, status: "detected" },
      net_quantity: { value: "1 kg", confidence: 0.99, status: "detected" },
      manufacturer: { value: "Tata Consumer Products Ltd.", confidence: 0.96, status: "detected" },
    },
    findings: [
      { id: "F003", field: "net_quantity", field_label: "Net Quantity", status: "POTENTIAL_ISSUE", confidence: 0.62, reason: "Declared net quantity may not match actual quantity. Inspector verification required.", rule_reference: "RULE-LM-2011-S8", evidence_region: { x: 80, y: 120, width: 300, height: 60 } },
    ],
    risk: { score: 55, level: "MEDIUM", breakdown: { potential_findings: 1, low_confidence_fields: 0, high_priority_findings: 0 }, factors: ["Net quantity declaration requires verification"] },
    inspector_review: { status: "PENDING" },
    status: "NEEDS_REVIEW",
    analysis_completed: true,
  },
  {
    inspection_id: "INS-10021",
    date: "04 Sep 2026",
    location: "South Delhi Region",
    inspector: "Priya Mehta",
    inspection_type: "Special Drive",
    product: { name: "Horlicks Chocolate", category: "Health Drink", pack_size: "500 g", brand: "HUL" },
    declarations: {
      mrp: { value: "₹220", confidence: 0.95, status: "detected" },
      net_quantity: { value: "500 g", confidence: 0.97, status: "detected" },
    },
    findings: [],
    risk: { score: 12, level: "LOW", breakdown: { potential_findings: 0, low_confidence_fields: 0, high_priority_findings: 0 }, factors: [] },
    inspector_review: { status: "VERIFIED" },
    status: "COMPLETED",
    analysis_completed: true,
  },
  {
    inspection_id: "INS-10020",
    date: "03 Sep 2026",
    location: "West Delhi Region",
    inspector: "Amit Verma",
    inspection_type: "Routine Market Inspection",
    product: { name: "Maggi 2-Minute Noodles", category: "Packaged Food", pack_size: "70 g", brand: "Nestlé India" },
    declarations: {
      mrp: { value: "₹14", confidence: 0.99, status: "detected" },
      net_quantity: { value: "70 g", confidence: 0.98, status: "detected" },
    },
    findings: [],
    risk: { score: 8, level: "LOW", breakdown: { potential_findings: 0, low_confidence_fields: 0, high_priority_findings: 0 }, factors: [] },
    inspector_review: { status: "VERIFIED" },
    status: "COMPLETED",
    analysis_completed: true,
  },
];

export const mockNotifications: Notification[] = [
  { id: "N001", type: "warning", title: "High-Risk Inspection Detected", message: "Inspection INS-10024 has been flagged as HIGH risk. Inspector review required.", timestamp: "5 minutes ago", read: false, inspection_id: "INS-10024" },
  { id: "N002", type: "info", title: "AI Analysis Completed", message: "Analysis for INS-10024 (Parle-G Gold Biscuits) has been completed. 2 potential findings identified.", timestamp: "8 minutes ago", read: false, inspection_id: "INS-10024" },
  { id: "N003", type: "success", title: "Inspection Verified", message: "Inspection INS-10023 (Fortune Refined Oil) has been verified and marked complete.", timestamp: "2 hours ago", read: true, inspection_id: "INS-10023" },
  { id: "N004", type: "info", title: "Inspection INS-10022 Requires Review", message: "Net quantity finding in Tata Salt inspection requires your review and verification.", timestamp: "4 hours ago", read: true, inspection_id: "INS-10022" },
  { id: "N005", type: "success", title: "Report Generated", message: "Inspection report for INS-10021 has been generated and is ready for download.", timestamp: "Yesterday", read: true },
  { id: "N006", type: "danger", title: "Analysis Failed", message: "Image quality too low for INS-10019. Please capture a clearer image to proceed.", timestamp: "Yesterday", read: true },
];

export const mockDashboardStats: DashboardStats = {
  today_inspections: 24,
  pending_review: 7,
  high_risk: 3,
  completed: 17,
};

export const mockAnalyticsData = {
  inspections_over_time: [
    { month: "Mar", inspections: 142, completed: 128, pending: 14 },
    { month: "Apr", inspections: 168, completed: 150, pending: 18 },
    { month: "May", inspections: 195, completed: 180, pending: 15 },
    { month: "Jun", inspections: 210, completed: 188, pending: 22 },
    { month: "Jul", inspections: 178, completed: 162, pending: 16 },
    { month: "Aug", inspections: 225, completed: 205, pending: 20 },
    { month: "Sep", inspections: 89, completed: 72, pending: 17 },
  ],
  risk_distribution: [
    { name: "Low Risk", value: 312, fill: "#16803C" },
    { name: "Medium Risk", value: 148, fill: "#C77C02" },
    { name: "High Risk", value: 47, fill: "#C62828" },
  ],
  finding_categories: [
    { category: "Consumer Info", count: 78 },
    { category: "Net Quantity", count: 52 },
    { category: "MRP", count: 31 },
    { category: "Date Info", count: 44 },
    { category: "Manufacturer", count: 23 },
    { category: "Batch No.", count: 19 },
  ],
  compliance_status: [
    { name: "Clear", value: 401 },
    { name: "Potential Issue", value: 68 },
    { name: "Needs Review", value: 38 },
  ],
  totals: { total: 507, completed: 449, pending_review: 38, potential_issues: 68, high_risk: 47, avg_processing: "4.2 min" },
};
