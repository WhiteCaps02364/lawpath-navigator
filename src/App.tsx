import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SignUp from "./pages/SignUp.tsx";
import SignIn from "./pages/SignIn.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PostAuthRouter from "./pages/PostAuthRouter.tsx";
import IntakePage from "./pages/IntakePage.tsx";
import ReportPage from "./pages/ReportPage.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import { AdvisorDemoProvider } from "./contexts/AdvisorDemoContext";
import AdvisorRegister from "./pages/AdvisorRegister.tsx";
import AdvisorRegisterDetails from "./pages/AdvisorRegisterDetails.tsx";
import AdvisorPublicProfile from "./pages/AdvisorPublicProfile.tsx";
import AdvisorDashboardLayout from "./pages/advisor/AdvisorDashboardLayout.tsx";
import MyStudents from "./pages/advisor/MyStudents.tsx";
import PreviewStudentExperience from "./pages/advisor/PreviewStudentExperience.tsx";
import DemoDashboard from "./pages/advisor/DemoDashboard.tsx";
import UnderstandingReport from "./pages/advisor/UnderstandingReport.tsx";
import ShareableLink from "./pages/advisor/ShareableLink.tsx";
import AdvisorProfileSettings from "./pages/advisor/AdvisorProfileSettings.tsx";
import AdvisorStudentReport from "./pages/advisor/AdvisorStudentReport.tsx";
import DemoStudentReport from "./pages/advisor/DemoStudentReport.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AdvisorDemoProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<PostAuthRouter />} />
            <Route path="/post-auth" element={<PostAuthRouter />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/report" element={<ReportPage />} />
            {/* Advisor flow */}
            <Route path="/advisor-register" element={<AdvisorRegister />} />
            <Route path="/advisor-register/details" element={<AdvisorRegisterDetails />} />
            <Route path="/advisor/:slug" element={<AdvisorPublicProfile />} />
            <Route path="/advisor-dashboard" element={<AdvisorDashboardLayout />}>
              <Route index element={<MyStudents />} />
              <Route path="preview" element={<PreviewStudentExperience />} />
              <Route path="demo" element={<DemoDashboard />} />
              <Route path="tutorial" element={<UnderstandingReport />} />
              <Route path="link" element={<ShareableLink />} />
              <Route path="profile" element={<AdvisorProfileSettings />} />
              <Route path="student/:id" element={<AdvisorStudentReport />} />
              <Route path="demo-student/:id" element={<DemoStudentReport />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AdvisorDemoProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
