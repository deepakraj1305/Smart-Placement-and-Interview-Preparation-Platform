import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { handleGoogleRedirect } from './lib/googleAuth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewWorkstation } from './pages/InterviewWorkstation';
import { InterviewReport } from './pages/InterviewReport';
import { PracticeHistory } from './pages/PracticeHistory';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';

// Call once outside component to handle Google auth popup fallback
handleGoogleRedirect();

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#fbfbfb] text-[#18181b] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/setup" element={<InterviewSetup />} />
              <Route path="/workstation/:sessionId" element={<InterviewWorkstation />} />
              <Route path="/report/:sessionId" element={<InterviewReport />} />
              <Route path="/history" element={<PracticeHistory />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
