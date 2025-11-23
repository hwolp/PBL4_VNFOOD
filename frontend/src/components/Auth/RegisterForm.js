import React, { useState } from 'react';
import { Card, Form, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const RegisterForm = ({ onNavigate }) => {
  const { register, loading } = useAuth();
  const { darkMode, language, t } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(username, password, t, language);
    if (result.success) {
      onNavigate('login');
    }
  };

  return (
    <Card className={`shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : ''}`} style={{ border: 'none', borderRadius: '12px' }}>
      <Card.Header className={`text-center border-0 pt-4 pb-2 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
        <h3 className="mb-0" style={{ fontWeight: '600', color: darkMode ? '#fff' : '#333' }}>{t('registerTitle')}</h3>
      </Card.Header>
      <Card.Body className="px-4 pb-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '500', fontSize: '0.9rem', color: darkMode ? '#ccc' : '#555' }}>{t('username')}</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              style={{ borderRadius: '8px', padding: '10px 12px', border: darkMode ? '1.5px solid #555' : '1.5px solid #ddd' }}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '500', fontSize: '0.9rem', color: darkMode ? '#ccc' : '#555' }}>{t('password')}</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
              style={{ borderRadius: '8px', padding: '10px 12px', border: darkMode ? '1.5px solid #555' : '1.5px solid #ddd' }}
            />
          </Form.Group>
          <div className="d-flex gap-2 mb-3">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="flex-fill"
              style={{ borderRadius: '8px', padding: '10px', fontWeight: '500' }}
            >
              {loading ? <Spinner as="span" size="sm" /> : t('register')}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => onNavigate('main')}
              style={{ borderRadius: '8px', padding: '10px', fontWeight: '500' }}
            >
              {t('back')}
            </Button>
          </div>
          <div className="text-center">
            <p className={`mb-0 ${darkMode ? 'text-light' : 'text-muted'}`} style={{ fontSize: '0.9rem', opacity: darkMode ? 0.8 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>{t('haveAccount')}</span>
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => onNavigate('login')}
                style={{ fontWeight: '500', color: darkMode ? '#6c9eff' : undefined, fontSize: '0.9rem', padding: 0, lineHeight: '1.5' }}
              >
                {t('login')}
              </Button>
            </p>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterForm;

