import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePageTitle } from '../hooks/usePageTitle';
import '../styles/Home.scss';

const Home = () => {
  const { t } = useLanguage();
  const [selectedVehicle] = useLocalStorage('selectedVehicle', 2);
  
  // Set page title
  usePageTitle('pageTitleHome');

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-banner">
          <div className="banner-content">
            <h1 className="banner-title">Martvis</h1>
            <p className="banner-subtitle">{t('welcomeMessage')}</p>
          </div>
        </div>

        {!selectedVehicle && (
          <div className="vehicle-reminder">
            <div className="reminder-card">
              <div className="reminder-icon">🚗</div>
              <h3>{t('selectVehicleFirst')}</h3>
              <p>{t('selectVehicleFromHeader')}</p>
            </div>
          </div>
        )}

        {selectedVehicle && (
          <div className="mode-cards">
            <Link to="/practice" className="mode-card practice-card">
              <div className="mode-overlay">
                <h3 className="mode-title">{t('practiceMode')}</h3>
              </div>
            </Link>

            <Link to="/exam" className="mode-card exam-card">
              <div className="mode-overlay">
                <h3 className="mode-title">{t('examMode')}</h3>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 