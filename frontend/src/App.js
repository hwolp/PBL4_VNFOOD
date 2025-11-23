
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import AppNavbar from './components/Navbar/AppNavbar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import MainLayout from './components/Layout/MainLayout';
import DishList from './components/Dishes/DishList';

function App() {
  const [currentView, setCurrentView] = useState('main');
  const [mainLayoutTab, setMainLayoutTab] = useState('upload');

  const handleNavigate = (view, tab = null) => {
    setCurrentView(view);
    if (tab && view === 'main') {
      setMainLayoutTab(tab);
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastContainer autoClose={3000} hideProgressBar />

        <AppNavbar onNavigate={handleNavigate} />

        <Container fluid className="px-3 px-md-4" style={{ maxWidth: '100%' }}>
          <Row className="m-0">
            {currentView === 'main' && (
              <Col xs={12}>
                <MainLayout 
                  onNavigate={handleNavigate} 
                  initialTab={mainLayoutTab}
                  onTabChange={(tab) => {
                    if (currentView === 'main') {
                      setMainLayoutTab(tab);
                    }
                  }}
                />
              </Col>
            )}

            {currentView === 'login' && (
              <Col md={6} lg={5} xl={4} className="mx-auto" style={{ marginTop: '2rem' }}>
                <LoginForm onNavigate={handleNavigate} />
              </Col>
            )}

            {currentView === 'register' && (
              <Col md={6} lg={5} xl={4} className="mx-auto" style={{ marginTop: '2rem' }}>
                <RegisterForm onNavigate={handleNavigate} />
              </Col>
            )}

            {currentView === 'dishes' && (
              <Col xs={12}>
                <DishList onNavigate={handleNavigate} />
              </Col>
            )}
          </Row>
        </Container>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

