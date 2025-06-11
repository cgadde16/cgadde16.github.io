// ProjectModal.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '8px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  width: '90%',
  maxWidth: '700px',
  maxHeight: '90vh',
  overflowY: 'auto',
  position: 'relative',
  animation: 'modalFadeIn 0.3s ease-out',
};

const modalCloseButtonStyle = {
  position: 'absolute',
  top: '15px',
  right: '15px',
  background: 'none',
  border: 'none',
  fontSize: '1.8rem',
  color: '#888',
  cursor: 'pointer',
  padding: '5px',
  lineHeight: '1',
};

const modalImageStyle = {
  width: '100%',
  maxHeight: '350px',
  objectFit: 'contain',
  borderRadius: '6px',
  marginBottom: '15px',
};

const modalTitleStyle = {
  fontSize: '2em',
  color: '#333',
  marginBottom: '15px',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
};

const modalDescriptionStyle = {
  fontSize: '1.1em',
  color: '#555',
  lineHeight: '1.7',
  whiteSpace: 'pre-line',
};

// Styles für die Navigationspunkte
const dotsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '20px',
};

const dotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: '#ccc',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: 'none',
  padding: '0',
};

const activeDotStyle = {
  ...dotStyle,
  backgroundColor: '#007bff',
  transform: 'scale(1.2)',
};

const animationStyles = `
  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

function ProjectModal({ project, onClose }) {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

  if (!project) return null;
  const longDescription = t(`projectsData.${project.id}.longDescription`, project.description);

  return (
    <>
      <style>{animationStyles}</style>
      <div style={modalOverlayStyle} onClick={onClose}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <button style={modalCloseButtonStyle} onClick={onClose} aria-label={t('modal.close', 'Schließen')}>
            ×
          </button>

          {project.images && project.images.length > 0 && (
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} ${currentImageIndex + 1}`}
                style={modalImageStyle}
              />
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '10px',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                    }}
                    aria-label="Vorheriges Bild"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % project.images.length)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                    }}
                    aria-label="Nächstes Bild"
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Navigationspunkte */}
              {project.images.length > 1 && (
                <div style={dotsContainerStyle}>
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={index === currentImageIndex ? activeDotStyle : dotStyle}
                      aria-label={`Bild ${index + 1} anzeigen`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <h2 style={modalTitleStyle}>{project.title}</h2>
          <p style={modalDescriptionStyle}>{longDescription}</p>
        </div>
      </div>
    </>
  );
}

export default ProjectModal;