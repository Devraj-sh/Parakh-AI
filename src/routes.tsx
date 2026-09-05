import { createBrowserRouter } from "react-router";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Dashboard from "./pages/app/Dashboard";
import NewInspection from "./pages/app/NewInspection";
import AIAnalysis from "./pages/app/AIAnalysis";
import ComplianceResults from "./pages/app/ComplianceResults";
import EvidenceLens from "./pages/app/EvidenceLens";
import RiskAssessment from "./pages/app/RiskAssessment";
import InspectorReview from "./pages/app/InspectorReview";
import InspectionReport from "./pages/app/InspectionReport";
import InspectionHistory from "./pages/app/InspectionHistory";
import Analytics from "./pages/app/Analytics";
import Reports from "./pages/app/Reports";
import Notifications from "./pages/app/Notifications";
import Profile from "./pages/app/Profile";
import Settings from "./pages/app/Settings";
import Help from "./pages/app/Help";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
    ],
  },
  {
    path: "/app",
    Component: AppLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "new-inspection", Component: NewInspection },
      { path: "analysis/:id", Component: AIAnalysis },
      { path: "compliance/:id", Component: ComplianceResults },
      { path: "evidence/:id", Component: EvidenceLens },
      { path: "risk/:id", Component: RiskAssessment },
      { path: "review/:id", Component: InspectorReview },
      { path: "report/:id", Component: InspectionReport },
      { path: "history", Component: InspectionHistory },
      { path: "analytics", Component: Analytics },
      { path: "reports", Component: Reports },
      { path: "notifications", Component: Notifications },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings },
      { path: "help", Component: Help },
    ],
  },
]);
