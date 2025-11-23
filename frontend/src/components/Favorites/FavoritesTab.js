import React from 'react';
import { Button, Spinner, Card, Image } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const FavoritesTab = ({ favorites, loading, onItemClick, onRemoveFavorite }) => {
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
      {!loading && favorites.length === 0 && (
        <div className="text-center py-5">
          <p className="mb-3 fs-1">❤️</p>
          <p className={`fs-4 ${darkMode ? 'text-secondary' : 'text-muted'}`}>{t('noFavorites')}</p>
        </div>
      )}
      {!loading && favorites.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {favorites.map((item) => (
            <Card
              key={item.id}
              className={`shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border-0'}`}
              style={{ borderRadius: '1rem' }}
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
                      {t('addedAt')} {new Date(item.created_at).toLocaleString()}
                    </small>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onItemClick(item)}
                      className="rounded-4 px-3 py-2"
                    >
                      {t('viewDetail')}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onRemoveFavorite(item.dish_id)}
                      className="rounded-4 px-3 py-2"
                    >
                      ❤️ {t('remove')}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default FavoritesTab;

