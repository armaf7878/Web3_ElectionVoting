import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import { LanguageProvider } from './context/LanguageContext';
import { Layout } from './components/layout/Layout';
// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { OrgList } from './pages/Organization/OrgList';
import { CreateOrg } from './pages/Organization/CreateOrg';
import { OrgDetail } from './pages/Organization/OrgDetail';
import { ElectionList } from './pages/Election/ElectionList';
import { CreateElection } from './pages/Election/CreateElection';
import { VotingPage } from './pages/Election/VotingPage';
import { Results } from './pages/Election/Results';
import { CompleteProfile } from './pages/CompleteProfile';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <Web3Provider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes (requires Auth) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/complete-profile" element={<CompleteProfile />} />
                
                {/* Authenticated Routes wrapped in Layout */}
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Organizations */}
                  <Route path="/organizations" element={<OrgList />} />
                  <Route path="/organizations/create" element={<CreateOrg />} />
                  <Route path="/organizations/:id" element={<OrgDetail />} />

                  {/* Elections */}
                  <Route path="/elections" element={<ElectionList />} />
                  <Route path="/elections/create" element={<CreateElection />} />
                  <Route path="/elections/:id/vote" element={<VotingPage />} />
                  <Route path="/elections/:id/results" element={<Results />} />

                  {/* Profile */}
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </Web3Provider>);


}