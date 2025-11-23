import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, ListGroup, Image, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { favoritesApi } from '../../services/api';
import VideoPlayer from '../Video/VideoPlayer';
import AddToShoppingList from '../Shopping/AddToShoppingList';

const ResultCard = ({ loading, error, dishData, onSaveToHistory, onLoginRequest, onToggleFavorite }) => {
  const { isLoggedIn } = useAuth();
  const { darkMode, t } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkingFavorite, setCheckingFavorite] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
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

    checkFavorite();
  }, [dishData]);

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>{t('processing')}</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  if (!dishData) return null;

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(dishData.dish.id, dishData.dish.name, isFavorite, (newState) => {
        setIsFavorite(newState);
      });
    }
  };

  return (
    <Card 
      className={`mt-4 shadow-sm ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border-0'}`}
      style={{
        borderRadius: '1.5rem',
        overflow: 'hidden'
      }}
    >
      <Card.Header 
        as="h3" 
        className="bg-gradient-primary text-white border-0 p-4"
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span>{dishData.dish.name}</span>
          {dishData.confidence !== undefined && dishData.confidence !== null && (
            <Badge 
              bg={dishData.confidence >= 90 ? 'success' : dishData.confidence >= 70 ? 'warning' : 'danger'} 
              className="px-3 py-2 rounded-pill"
              style={{ fontSize: '0.9rem' }}
            >
              <span className="fw-bold">{dishData.confidence}%</span>
              <span className="ms-1">{t('confidence')}</span>
            </Badge>
          )}
        </div>
      </Card.Header>

      <div className={`d-flex gap-3 p-4 flex-wrap border-bottom ${darkMode ? 'border-secondary' : 'border'}`}>
        {isLoggedIn && (
          <>
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={onSaveToHistory}
              className="rounded-4 px-3 py-2 fw-medium transition-all"
            >
              🔖 {t('saveToHistory')}
            </Button>
            <Button
              variant={isFavorite ? "danger" : "outline-danger"}
              size="sm"
              onClick={handleFavoriteClick}
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
        {!isLoggedIn && (
          <>
            <Button variant="outline-secondary" size="sm" onClick={onLoginRequest} className="rounded-4 px-3 py-2">
              🔖 {t('loginToSave')}
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={onLoginRequest} className="rounded-4 px-3 py-2">
              🤍 {t('loginToFavorite')}
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={onLoginRequest} className="rounded-4 px-3 py-2">
              🛒 {t('loginToAddShoppingList') || 'Đăng nhập để thêm vào danh sách mua sắm'}
            </Button>
          </>
        )}
      </div>

      <div className="d-flex justify-content-center p-4" style={{ backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa' }}>
        <Card.Img
          variant="top"
          src={dishData.dish.image_url || 'https://via.placeholder.com/600x300.png?text=Ảnh+món+ăn'}
          alt={dishData.dish.name}
          style={{
            maxWidth: '500px',
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '1rem'
          }}
        />
      </div>

      <Card.Body className="p-4 p-lg-5">
        <Card.Text className="fs-5 mb-4">{dishData.dish.description}</Card.Text>
        
        {dishData.dish.video_url && (
          <div className="mb-5">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setShowVideo(true);
              }}
              className="bg-gradient-primary border-0 d-flex align-items-center justify-content-center gap-3 rounded-5 fw-bold fs-5 py-3"
              style={{
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                width: 'auto',
                minWidth: '300px'
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>▶️</span>
              <span>{t('watchVideo') || 'Xem video hướng dẫn nấu món ăn'}</span>
            </Button>
          </div>
        )}
        
        <hr className={`my-5 ${darkMode ? 'border-secondary' : 'border'}`} />

        <h4 className="fw-bold mb-4">{t('ingredients')}</h4>
        <ListGroup variant="flush" className={darkMode ? 'bg-dark' : 'bg-white'}>
          {dishData.ingredients.map((item, index) => (
            <ListGroup.Item
              key={`ingredient-${dishData.dish.id}-${index}-${item.name}`}
              className={`p-3 ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white border'}`}
            >
              <strong className="fw-semibold">{item.name}:</strong> {item.quantity || '-'}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <hr className={`my-5 ${darkMode ? 'border-secondary' : 'border'}`} />

        <h4 className="fw-bold mb-4">{t('steps')}</h4>
        {dishData.instructions
          .filter((step, index, self) => 
            index === self.findIndex(s => s.step_number === step.step_number)
          )
          .map((step, index) => (
            <div key={`step-${dishData.dish.id}-${step.step_number}-${index}`} className="mb-5">
              <h5 className="fw-semibold mb-3">{t('step')} {step.step_number}</h5>
              <p className="mb-3">{step.description}</p>
              {step.image_url && (
                <Image
                  src={step.image_url}
                  rounded
                  fluid
                  alt={`Ảnh minh họa bước ${step.step_number}`}
                  className="rounded-4"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              )}
            </div>
          ))}
      </Card.Body>

      <VideoPlayer
        show={showVideo}
        videoUrl={dishData.dish.video_url}
        title={`${dishData.dish.name} - ${t('videoInstructions') || 'Video hướng dẫn'}`}
        onClose={() => {
          setShowVideo(false);
        }}
      />

      <AddToShoppingList
        show={showAddToShoppingList}
        onClose={() => setShowAddToShoppingList(false)}
        dishData={dishData}
        onSuccess={() => {
          setShowAddToShoppingList(false);
        }}
        autoClose={true}
      />
    </Card>
  );
};

export default ResultCard;

