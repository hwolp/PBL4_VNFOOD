import React from 'react';
import { Card, Form, Button, Spinner, Image } from 'react-bootstrap';
import { useTheme } from '../../contexts/ThemeContext';

const UploadTab = ({
  selectedFile,
  capturedImagePreview,
  loading,
  fileInputRef,
  handleFileChange,
  handleUpload
}) => {
  const { darkMode, t } = useTheme();

  return (
    <>
      <Form.Group controlId="formFile" className="mb-4">
        <Form.Label className={`fw-medium mb-3 ${darkMode ? 'text-secondary' : 'text-dark'}`}>
          {t('chooseFile')}
        </Form.Label>
        <div className="position-relative">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className={`w-100 p-3 rounded-4 cursor-pointer transition-all ${darkMode ? 'bg-dark text-light border-secondary' : 'bg-white text-dark border'}`}
          />
        </div>
      </Form.Group>

      {selectedFile && (
        <div className="mb-4">
          <Image
            src={capturedImagePreview}
            alt="Preview"
            fluid
            rounded
            className="rounded-4 mx-auto d-block"
            style={{ maxHeight: '350px' }}
          />
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className="px-4 py-2 rounded-4 fw-medium transition-all"
        style={{ fontSize: '0.95rem' }}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            {t('recognizing')}
          </>
        ) : (
          t('recognize')
        )}
      </Button>
    </>
  );
};

export default UploadTab;
