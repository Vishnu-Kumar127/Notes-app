import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/Home';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ProtectedRoute from './Components/protectedRoute';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  // if someone registering means we must clear local storage so that it don't end up subbmitting access tokens to the Registered route
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {/* You can't go to Home page unless you have access token */}
                <Home /> 
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
