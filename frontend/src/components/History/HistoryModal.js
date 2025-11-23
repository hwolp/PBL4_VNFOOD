import React, { useState, useEffect } from 'react';
import { Modal, Button, Image, ListGroup } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { favoritesApi } from '../../services/api';
import { toast } from 'react-toastify';
import { translations } from '../../utils/translations';
import AddToShoppingList from '../Shopping/AddToShoppingList';

const HistoryModal = ({ show, item, onClose, onOpenVideo }) => {
  const { darkMode, language, t } = useTheme();
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);
  const [showAddToShoppingList, setShowAddToShoppingList] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!item || !item.dish_id || !isLoggedIn) {
        setIsFavorite(false);
        return;
      }

      setCheckingFavorite(true);
      try {
        const response = await favoritesApi.check(item.dish_id);
        setIsFavorite(response.data.is_favorite);
      } catch (err) {
        setIsFavorite(false);
      } finally {
        setCheckingFavorite(false);
      }
    };

    if (show && item) {
      checkFavorite();
    }
  }, [show, item, isLoggedIn]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.warn(translations[language]?.pleaseLoginToFavorite || 'Vui lòng đăng nhập');
      return;
    }

    if (!item || !item.dish_id) return;

    setCheckingFavorite(true);
    try {
      if (isFavorite) {
        await favoritesApi.remove(item.dish_id);
        setIsFavorite(false);
        toast.success(`"${item.name}" ${translations[language]?.removedFromFavorites || 'đã được xóa khỏi yêu thích'}`);
      } else {
        await favoritesApi.add(item.dish_id);
        setIsFavorite(true);
        toast.success(`"${item.name}" ${translations[language]?.addedToFavorites || 'đã được thêm vào yêu thích'}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Có lỗi xảy ra');
    } finally {
      setCheckingFavorite(false);
    }
  };

  const convertHistoryItemToDishData = () => {
    if (!item) return null;
    return {
      dish: {
        id: item.dish_id,
        name: item.name,
        image_url: item.image_url,
        description: item.description
      },
      ingredients: item.ingredients || [],
      instructions: item.instructions || []
    };
  };

  if (!item) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
    >
      <Modal.Header
        closeButton
        className={darkMode ? 'bg-dark text-light border-secondary' : ''}
      >
        <Modal.Title>{item.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={darkMode ? 'bg-dark text-light' : ''} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {isLoggedIn && (
          <div className="d-flex gap-3 mb-4 flex-wrap">
            <Button
              variant={isFavorite ? "danger" : "outline-danger"}
              size="sm"
              onClick={handleToggleFavorite}
              disabled={checkingFavorite}
              className="rounded-4 px-3 py-2 fw-medium transition-all"
            >
              {isFavorite ? '❤️' : '🤍'} {isFavorite ? t('removeFavorite') : t('addFavorite')}
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setShowAddToShoppingList(true)}
              className="rounded-4 px-3 py-2 fw-medium transition-all"
            >
              🛒 {t('addToShoppingList') || 'Thêm vào danh sách mua sắm'}
            </Button>
          </div>
        )}

        <Image
          src={item.image_url || 'https://via.placeholder.com/600x300.png?text=Ảnh+món+ăn'}
          fluid
          rounded
          className="mb-3"
          alt={item.name}
        />

        {item.description && (
          <>
            <p className="mb-3">{item.description}</p>
            {item.video_url && (
              <div className="mb-4 mt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (onOpenVideo && item.video_url) {
                      onOpenVideo(item.video_url, item.name);
                      onClose();
                    }
                  }}
                  style={{
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: 'auto',
                    minWidth: '300px',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>▶️</span>
                  <span>{t('watchVideo') || 'Xem video hướng dẫn nấu món ăn'}</span>
                </Button>
              </div>
            )}
            <hr className={darkMode ? 'border-secondary' : ''} />
          </>
        )}

        {item.ingredients && Array.isArray(item.ingredients) && item.ingredients.length > 0 ? (
          <>
            <h5 className="mb-3">{t('ingredients')}</h5>
            <ListGroup variant="flush" className={darkMode ? 'bg-dark' : ''}>
              {item.ingredients.map((ing, idx) => (
                <ListGroup.Item
                  key={`history-ingredient-${item.history_id}-${idx}-${ing.name}`}
                  className={darkMode ? 'bg-dark text-light border-secondary' : ''}
                >
                  <strong>{ing.name}:</strong> {ing.quantity || '-'}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <hr className={darkMode ? 'border-secondary' : ''} />
          </>
        ) : (
          <div className="mb-3">
            <p className="text-muted">{language === 'vi' ? 'Đang tải nguyên liệu...' : 'Loading ingredients...'}</p>
          </div>
        )}

        {item.instructions && Array.isArray(item.instructions) && item.instructions.length > 0 ? (
          <>
            <h5 className="mb-3">{t('steps')}</h5>
            {item.instructions
              .filter((step, index, self) => 
                index === self.findIndex(s => s.step_number === step.step_number)
              )
              .map((step, idx) => (
                <div key={`history-step-${item.history_id}-${step.step_number}-${idx}`} className="mb-4">
                  <h6>{t('step')} {step.step_number}</h6>
                  <p>{step.description}</p>
                  {step.image_url && (
                    <Image
                      src={step.image_url}
                      rounded
                      fluid
                      alt={`${t('step')} ${step.step_number}`}
                      className="mt-2"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                  )}
                </div>
              ))}
          </>
        ) : (
          <div className="mb-3">
            <p className="text-muted">{language === 'vi' ? 'Đang tải các bước thực hiện...' : 'Loading steps...'}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className={darkMode ? 'bg-dark border-secondary' : ''}>
        <Button variant="secondary" onClick={onClose}>
          {t('back')}
        </Button>
      </Modal.Footer>

      <AddToShoppingList
        show={showAddToShoppingList}
        onClose={() => setShowAddToShoppingList(false)}
        dishData={convertHistoryItemToDishData()}
        onSuccess={() => {
          setShowAddToShoppingList(false);
        }}
        autoClose={true}
      />
    </Modal>
  );
};

export default HistoryModal;

