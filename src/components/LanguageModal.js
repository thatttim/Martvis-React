import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiService } from '../services/apiService';
import '../styles/LanguageModal.scss';

const LanguageModal = ({ isOpen, onClose, onLanguageSelect }) => {
  const { t, language, setLanguage } = useLanguage();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchLanguages();
    }
  }, [isOpen]);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getLanguages();
      setLanguages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang.code);
    if (onLanguageSelect) {
      onLanguageSelect(lang);
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getLanguageDisplayName = (lang) => {
    // Use the name property from the API response
    return lang.name || lang.code.toUpperCase();
  };

  const getUILanguage = (langCode) => {
    // UI language logic: Georgian and English show native UI, others show English
    if (langCode === 'ka') {
      return t('georgianMenu');
    } else if (langCode === 'en') {
      return t('englishMenu');
    } else {
      return t('englishMenu');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="language-modal-overlay" onClick={handleBackdropClick}>
      <div className="language-modal">
        <div className="modal-header">
          <h2 className="modal-title">{t('selectLanguage')}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {loading && (
            <div className="modal-loading">
              <div className="spinner"></div>
            </div>
          )}

          {error && (
            <div className="modal-error">
              {t('error')}: {error}
            </div>
          )}

          {!loading && !error && (
            <div className="language-grid">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`language-card ${language === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  <div className="language-info">
                    <div className="language-name">{getLanguageDisplayName(lang)}</div>
                    <div className="language-ui">
                      {getUILanguage(lang.code)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageModal; 