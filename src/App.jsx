import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import JuniorDashboard from './components/JuniorDashboard';
import EventForm from './components/EventForm';
import EditEvent from './components/EditEvent';
import Feedback from './components/Feedback';
import ViewFeedback from './components/ViewFeedback';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['eb-ec', 'core']}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/junior-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <JuniorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/form" 
              element={
                <ProtectedRoute allowedRoles={['eb-ec', 'core']}>
                  <EventForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/edit" 
              element={
                <ProtectedRoute allowedRoles={['eb-ec', 'core']}>
                  <EditEvent />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/feedback" 
              element={
                <ProtectedRoute allowedRoles={['member']}>
                  <Feedback />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/view-feedback" 
              element={
                <ProtectedRoute allowedRoles={['eb-ec', 'core']}>
                  <ViewFeedback />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;