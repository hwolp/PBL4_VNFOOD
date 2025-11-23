import React, { useState, useEffect } from 'react';
import { Modal, Button, Image, ListGroup } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { favoritesApi } from '../../services/api';
import { toast } from 'react-toastify';
import { translations } from '../../utils/translations';
import AddToShoppingList from '../Shopping/AddToShoppingList';

const DishDetail = ({ show, dishData, onClose, onOpenVideo }) => {
  const { darkMode, language, t } = useTheme();
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);
  const [showAddToShoppingList, setShowAddToShoppingList] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!dishData || !dishData.dish || !dishData.dish.id) {
        setIsFavorite(false);
        return;
      }

      setCheckingFavorite(true);
      try {
        const response = await favoritesApi.check(dishData.dish.id);
        setIsFavorite(response.data.is_favorite);
      } catch (err) {
        setIsFavorite(false);
      } finally {
        setCheckingFavorite(false);
      }
    };

    if (show && dishData) {
      checkFavorite();
    }
  }, [show, dishData]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      toast.warn(translations[language]?.pleaseLoginToFavorite || 'Vui lòng đăng nhập');
      return;
    }

    if (!dishData || !dishData.dish) return;

    setCheckingFavorite(true);
    try {
      if (isFavorite) {
        await favoritesApi.remove(dishData.dish.id);
        setIsFavorite(false);
        toast.success(`"${dishData.dish.name}" ${translations[language]?.removedFromFavorites || 'đã được xóa khỏi yêu thích'}`);
      } else {
        await favoritesApi.add(dishData.dish.id);
        setIsFavorite(true);
        toast.success(`"${dishData.dish.name}" ${translations[language]?.addedToFavorites || 'đã được thêm vào yêu thích'}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Có lỗi xảy ra');
    } finally {
      setCheckingFavorite(false);
    }
  };

  if (!dishData) return null;

  return (
    <Modal
      show={show}
      onHide={onClose}
      size="lg"
      centered
    >
      <Modal.Header
        closeButton
        className={`bg-gradient-primary text-white border-0 p-4 ${darkMode ? '' : ''}`}
      >
        <Modal.Title className="fw-bold fs-4">{dishData.dish.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`p-4 p-lg-5 ${darkMode ? 'bg-dark text-light' : 'bg-white'}`} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <div className="d-flex gap-3 mb-4 flex-wrap">
          {isLoggedIn && (
            <>
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
            </>
          )}
        </div>

        <Image
          src={dishData.dish.image_url || 'https://via.placeholder.com/600x300.png?text=Ảnh+món+ăn'}
          fluid
          rounded
          className="mb-4 rounded-4"
          alt={dishData.dish.name}
        />

        {dishData.dish.description && (
          <>
            <p className="fs-5 mb-4">{dishData.dish.description}</p>
            {dishData.dish.video_url && (
              <div className="mb-5">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (onOpenVideo && dishData.dish.video_url) {
                      onOpenVideo(dishData.dish.video_url, dishData.dish.name);
                      onClose();
                    }
                  }}
                  className="bg-gradient-primary border-0 d-flex align-items-center justify-content-center gap-3 rounded-5 fw-bold fs-5 py-3"
                  style={{
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    width: 'auto',
                    minWidth: '300px'
                  }}
                >
                  <span className="fs-3">▶️</span>
                  <span>{t('watchVideo') || 'Xem video hướng dẫn nấu món ăn'}</span>
                </Button>
              </div>
            )}
            <hr className={`my-5 ${darkMode ? 'border-secondary' : 'border'}`} />
          </>
        )}

        {dishData.ingredients && Array.isArray(dishData.ingredients) && dishData.ingredients.length > 0 ? (
          <>
            <h5 className="fw-bold mb-4">{t('ingredients')}</h5>
            <div className={`p-3 rounded-4 mb-5 ${darkMode ? 'bg-dark border border-secondary' : 'bg-light border'}`}>
              {dishData.ingredients.map((ing, idx) => (
                <div key={`dish-ingredient-${dishData.dish.id}-${idx}-${ing.name}`} className="mb-2">
                  <strong className="fw-semibold">{ing.name}:</strong> {ing.quantity || '-'}
                </div>
              ))}
            </div>
            <hr className={`my-5 ${darkMode ? 'border-secondary' : 'border'}`} />
          </>
        ) : null}

        {dishData.instructions && Array.isArray(dishData.instructions) && dishData.instructions.length > 0 ? (
          <>
            <h5 className="fw-bold mb-4">{t('steps')}</h5>
            {dishData.instructions
              .filter((step, index, self) => 
                index === self.findIndex(s => s.step_number === step.step_number)
              )
              .map((step, idx) => (
                <div key={`dish-step-${dishData.dish.id}-${step.step_number}-${idx}`} className="mb-5">
                  <h6 className="fw-semibold mb-3">{t('step')} {step.step_number}</h6>
                  <p className="mb-3">{step.description}</p>
                  {step.image_url && (
                    <Image
                      src={step.image_url}
                      rounded
                      fluid
                      alt={`${t('step')} ${step.step_number}`}
                      className="rounded-4"
                      style={{ maxHeight: '350px', objectFit: 'contain' }}
                    />
                  )}
                </div>
              ))}
          </>
        ) : null}
      </Modal.Body>
      <Modal.Footer className={`p-4 ${darkMode ? 'bg-dark border-secondary' : 'bg-white border-top'}`}>
        <Button variant="secondary" onClick={onClose} className="rounded-4 px-4 py-2">
          {t('back')}
        </Button>
      </Modal.Footer>

      <AddToShoppingList
        show={showAddToShoppingList}
        onClose={() => setShowAddToShoppingList(false)}
        dishData={dishData}
        onSuccess={() => {
          setShowAddToShoppingList(false);
        }}
        autoClose={true}
      />
    </Modal>
  );
};

export default DishDetail;

