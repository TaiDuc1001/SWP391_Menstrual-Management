import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ManageProfile from './pages/Doctor/ManageProfile';
import SetupProfile from './pages/Doctor/SetupProfile';
import MyProfile from './pages/Doctor/MyProfile';
import DebugPage from './pages/DebugPage';
import TestProfileForm from './pages/TestProfileForm';
import DoctorProfileGuard from './components/DoctorProfileGuard';
import AppWithProviders from './components/AppWithProviders';
import ErrorBoundary from './components/ErrorBoundary';

function TestApp() {
  return (
    <ErrorBoundary>
      <AppWithProviders>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/debug" />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/test-form" element={<TestProfileForm />} />
            <Route path="/doctor/setup-profile" element={<SetupProfile />} />
            <Route path="/doctor/manage-profile" element={<ManageProfile />} />
            <Route 
              path="/doctor/profile" 
              element={
                <DoctorProfileGuard>
                  <MyProfile />
                </DoctorProfileGuard>
              } 
            />
            <Route 
              path="/doctor/dashboard" 
              element={
                <DoctorProfileGuard>
                  <div className="p-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
                    <p className="text-gray-600 mt-4">Chào mừng bạn đến với dashboard!</p>
                    <div className="mt-6 space-y-4">
                      <div>
                        <a 
                          href="/doctor/profile" 
                          className="text-blue-600 hover:text-blue-800 underline mr-4"
                        >
                          Xem hồ sơ của bạn
                        </a>
                        <a 
                          href="/doctor/manage-profile" 
                          className="text-green-600 hover:text-green-800 underline"
                        >
                          Quản lý hồ sơ
                        </a>
                      </div>
                      <div className="mt-4 p-4 bg-green-50 rounded">
                        <p className="text-sm text-gray-600">
                          ✅ Lỗi đã được sửa: Đăng ký tài khoản doctor → Nhập profile → Logout → Login lại → Profile sẽ được khôi phục và giữ nguyên thông tin
                        </p>
                      </div>
                    </div>
                  </div>
                </DoctorProfileGuard>
              } 
            />
          </Routes>
        </div>
      </AppWithProviders>
    </ErrorBoundary>
  );
}

export default TestApp;
