import React from 'react';
import { Card, Button, Spinner, Image } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';
import { PI_STREAM_URL } from '../../services/api';

const WebcamTab = ({
  videoStreamRef,
  canvasRef,
  capturedImagePreview,
  capturedImageBlob,
  loading,
  handleCaptureFrame,
  handleRecognizeCaptured,
  resetCapture,
  setError
}) => {
  const { darkMode, t } = useTheme();

  return (
    <>
      <div className={`mb-4 position-relative rounded-5 overflow-hidden d-flex align-items-center justify-content-center ${darkMode ? 'bg-dark border-secondary' : 'bg-light border'}`}
        style={{ 
          minHeight: '350px',
          border: `2px dashed ${darkMode ? '#555' : '#ddd'}`
        }}
      >
        <Image
          ref={videoStreamRef}
          src={`${PI_STREAM_URL}/video_feed`}
          alt="Live webcam feed"
          fluid
          rounded
          crossOrigin="anonymous"
          className={`w-100 img-contain ${capturedImagePreview ? 'd-none' : 'd-block'}`}
          style={{ maxHeight: '450px' }}
          onError={(e) => {
            e.target.style.display = 'none';
            setError('Không thể tải video stream. Kiểm tra kết nối và webcam trên Pi.');
          }}
          onLoad={() => { if (!capturedImagePreview) setError(''); }}
        />
        {capturedImagePreview && (
          <Image
            src={capturedImagePreview}
            alt="Captured frame"
            fluid
            rounded
            className="w-100 img-contain rounded-4"
            style={{ maxHeight: '450px' }}
          />
        )}
        <canvas ref={canvasRef} className="d-none" />
      </div>

      {!capturedImageBlob ? (
        <Button
          variant="info"
          onClick={handleCaptureFrame}
          disabled={loading}
          className="rounded-4 px-3 py-2 fw-medium transition-all"
          style={{ fontSize: '0.95rem' }}
        >
          📸 {t('capture')}
        </Button>
      ) : (
        <div className="d-flex gap-3 justify-content-center">
          <Button
            variant="secondary"
            onClick={resetCapture}
            disabled={loading}
            className="rounded-4 px-3 py-2 fw-medium transition-all"
            style={{ fontSize: '0.95rem' }}
          >
            🔄 {t('recapture')}
          </Button>
          <Button
            variant="success"
            onClick={handleRecognizeCaptured}
            disabled={loading}
            className="rounded-4 px-3 py-2 fw-medium shadow-sm transition-all"
            style={{ fontSize: '0.95rem' }}
          >
            {loading ? (
              <>
                <Spinner as="span" size="sm" className="me-2" />
                {t('recognizing')}
              </>
            ) : (
              `🔍 ${t('recognizeThis')}`
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default WebcamTab;

