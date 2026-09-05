import type { Inspection, Notification, Inspector, DashboardStats } from "../types";
import {
  mockInspections,
  mockNotifications,
  mockInspector,
  mockDashboardStats,
  demoInspection,
} from "../mock/data";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// Auth Service
export const authService = {
  login: async (email: string, _password: string) => {
    await delay(800);
    if (email) return { success: true, token: "mock-jwt-token", inspector: mockInspector };
    throw new Error("Invalid credentials");
  },
  logout: async () => { await delay(200); return { success: true }; },
  getProfile: async (): Promise<Inspector> => { await delay(300); return mockInspector; },
};

// Inspection Service
export const inspectionService = {
  getAll: async (): Promise<Inspection[]> => { await delay(500); return mockInspections; },
  getById: async (id: string): Promise<Inspection> => {
    await delay(400);
    const found = mockInspections.find((i) => i.inspection_id === id);
    return found || demoInspection;
  },
  create: async (data: Partial<Inspection>): Promise<Inspection> => {
    await delay(600);
    return { ...demoInspection, ...data, inspection_id: `INS-${Date.now()}` };
  },
  getDashboardStats: async (): Promise<DashboardStats> => { await delay(400); return mockDashboardStats; },
};

// OCR Service
export const ocrService = {
  extractDeclarations: async (_imageFile: File | string) => {
    await delay(2000);
    return demoInspection.declarations;
  },
};

// Compliance Service
export const complianceService = {
  analyze: async (inspectionId: string) => {
    await delay(1500);
    const inspection = mockInspections.find((i) => i.inspection_id === inspectionId) || demoInspection;
    return { findings: inspection.findings, declarations: inspection.declarations };
  },
};

// Evidence Service
export const evidenceService = {
  getByInspectionId: async (inspectionId: string) => {
    await delay(400);
    const inspection = mockInspections.find((i) => i.inspection_id === inspectionId) || demoInspection;
    return inspection.findings.filter((f) => f.evidence_region);
  },
};

// Risk Service
export const riskService = {
  assess: async (inspectionId: string) => {
    await delay(800);
    const inspection = mockInspections.find((i) => i.inspection_id === inspectionId) || demoInspection;
    return inspection.risk;
  },
};

// Report Service
export const reportService = {
  generate: async (inspectionId: string) => {
    await delay(1200);
    return { report_url: `/reports/${inspectionId}.pdf`, generated_at: new Date().toISOString() };
  },
  download: async (inspectionId: string) => {
    await delay(600);
    return { download_url: `/api/reports/${inspectionId}/download` };
  },
};

// Notification Service
export const notificationService = {
  getAll: async (): Promise<Notification[]> => { await delay(300); return mockNotifications; },
  markRead: async (id: string) => { await delay(200); return { success: true, id }; },
  markAllRead: async () => { await delay(300); return { success: true }; },
};
