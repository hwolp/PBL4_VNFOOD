import React from 'react';
import { Button, Spinner, Card, Image } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const HistoryTab = ({ history, loading, onItemClick }) => {
  const { isLoggedIn } = useAuth();
  const { darkMode, t } = useTheme();

  if (!isLoggedIn) {
    return (
      <div className="text-center py-5">
        <p>{t('pleaseLogin')}</p>
        <Button variant="primary" onClick={() => window.location.hash = 'login'}>{t('login')}</Button>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {!loading && history.length === 0 && (
        <div className="text-center py-5">
          <p className={`fs-4 ${darkMode ? 'text-secondary' : 'text-muted'}`}>{t('noHistory')}</p>
        </div>
      )}
      {!loading && history.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {history.map((item) => (
            <Card
              key={item.history_id}
              className={`shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border-0'}`}
              style={{ borderRadius: '1rem', cursor: 'pointer' }}
              onClick={() => onItemClick(item)}
            >
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-4">
                  <Image
                    src={item.image_url}
                    thumbnail
                    className="img-cover rounded-4"
                    style={{ width: '100px', height: '100px', minWidth: '100px' }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-2">{item.name}</h5>
                    <small className={`opacity-75 ${darkMode ? 'text-secondary' : 'text-muted'}`}>
                      {t('recognizedAt')} {new Date(item.recognized_at).toLocaleString()}
                    </small>
                  </div>
                  <span className={`fs-6 ${darkMode ? 'text-secondary' : 'text-muted'}`}>Xem chi tiết →</span>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default HistoryTab;

