import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePageTitle } from '../hooks/usePageTitle';
import { apiService } from '../services/apiService';
import '../styles/Practice.scss';

const Practice = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedVehicle] = useLocalStorage('selectedVehicle', 2);
  const [, setSelectedCategory] = useLocalStorage('selectedCategory', null);

  // Set page title
  usePageTitle('pageTitlePractice');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCategories(language);
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate('/quiz');
  };

  if (loading) {
    return (
      <div className="practice-container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="practice-container">
        <div className="error">{t('error')}: {error}</div>
      </div>
    );
  }

  return (
    <div className="practice-container">
      <div className="practice-content">

        {selectedVehicle && (
          <div className="category-selection">
            <h2 className="category-title">{t('selectCategory')}</h2>
            <div className="category-grid">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="category-icon">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="icon icon-tabler icons-tabler-filled icon-tabler-folder"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M9 3a1 1 0 0 1 .608 .206l.1 .087l2.706 2.707h6.586a3 3 0 0 1 2.995 2.824l.005 .176v8a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-11a3 3 0 0 1 2.824 -2.995l.176 -.005h4z" />
                    </svg>
                  </div>
                  <div className="category-info">
                    <div className="category-name">{category.name}</div>
                    <div className="category-description">{category.description || ''}</div>
                  </div>
                  <div className="category-arrow">→</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice; 