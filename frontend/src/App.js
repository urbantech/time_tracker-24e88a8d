import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AINativeProvider } from '@ainative/react-sdk';
import Auth from './components/Auth';
import TimerControl from './components/TimerControl';
import LogManagement from './components/LogManagement';
import TimeSummary from './components/TimeSummary';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('ainative_token') || '');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('ainative_token', token);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('ainative_token');
  };

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AINativeProvider apiKey={process.env.REACT_APP_AINATIVE_API_KEY || ''}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-navy text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <span className="text-xl font-bold">Time Tracker</span>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link to="/timer" className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Timer
                    </Link>
                    <Link to="/logs" className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Logs
                    </Link>
                    <Link to="/summary" className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">
                      Summary
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  {token ? (
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link to="/login" className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/login" element={<Auth onLogin={handleLogin} />} />
              <Route
                path="/timer"
                element={
                  <ProtectedRoute>
                    <TimerControl />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logs"
                element={
                  <ProtectedRoute>
                    <LogManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/summary"
                element={
                  <ProtectedRoute>
                    <TimeSummary />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AINativeProvider>
  );
};

export default App;