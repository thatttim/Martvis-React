import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiService } from '../services/apiService';
import VehicleModal from './VehicleModal';
import LanguageModal from './LanguageModal';
import logo from '../logo.svg';
import '../styles/Header.scss';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useLocalStorage('selectedVehicle', 2);
  const [vehicles, setVehicles] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    // Fetch vehicles and languages to get their names
    const fetchData = async () => {
      try {
        const [vehiclesData, languagesData] = await Promise.all([
          apiService.getVehicles(),
          apiService.getLanguages()
        ]);
        setVehicles(vehiclesData || []);
        setLanguages(languagesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays as fallback to prevent breaking
        setVehicles([]);
        setLanguages([]);
      }
    };
    fetchData();
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle.id);
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang.code);
  };

  const getVehicleDisplayName = () => {
    if (!selectedVehicle) return t('selectVehicle');
    
    // Find the selected vehicle from the fetched vehicles
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    if (vehicle) {
      return vehicle.code;
    }
    
    // Fallback to hardcoded mapping if vehicle not found
    const vehicleNames = {
      1: 'A, A1',
      2: 'B, B1'
    };
    
    return vehicleNames[selectedVehicle] || t('vehicle');
  };

  const getLanguageDisplayName = () => {
    // Find the selected language from the fetched languages
    const lang = languages.find(l => l.code === language);
    if (lang) {
      if (lang.code === 'ka') {
        return lang.native_name || 'ქართული';
      } else if (lang.code === 'en') {
        return lang.native_name || 'English';
      } else {
        return lang.english_name || lang.native_name || lang.code.toUpperCase();
      }
    }
    
    // Fallback to hardcoded mapping
    const languageNames = {
      'en': 'English',
      'ka': 'ქართული'
    };
    
    return languageNames[language] || language.toUpperCase();
  };

  const getLanguageFlag = () => {
    const flagMap = {
      'ka': '🇬🇪',
      'en': '🇺🇸',
      'ru': '🇷🇺',
      'az': '🇦🇿',
      'tr': '🇹🇷'
    };
    return flagMap[language] || '🌐';
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="logo">
              <img src={logo} alt="Martvis Logo" className="logo-image" />
              <span className="logo-text">Martvis</span>
            </Link>
          </div>

          <nav className="header-nav">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              {t('home')}
            </Link>
            <Link
              to="/practice"
              className={`nav-link ${isActive('/practice') ? 'active' : ''}`}
            >
              {t('practiceMode')}
            </Link>
            <Link
              to="/exam"
              className={`nav-link ${isActive('/exam') ? 'active' : ''}`}
            >
              {t('examMode')}
            </Link>
          </nav>

          <div className="header-right">
            <button
              className="vehicle-selector"
              onClick={() => setIsVehicleModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="vehicle-icon">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M14 5a1 1 0 0 1 .694 .28l.087 .095l3.699 4.625h.52a3 3 0 0 1 2.995 2.824l.005 .176v4a1 1 0 0 1 -1 1h-1.171a3.001 3.001 0 0 1 -5.658 0h-4.342a3.001 3.001 0 0 1 -5.658 0h-1.171a1 1 0 0 1 -1 -1v-6l.007 -.117l.008 -.056l.017 -.078l.012 -.036l.014 -.05l2.014 -5.034a1 1 0 0 1 .928 -.629zm-7 11a1 1 0 1 0 0 2a1 1 0 0 0 0 -2m10 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2m-6 -9h-5.324l-1.2 3h6.524zm2.52 0h-.52v3h2.92z" />
              </svg>
              <span className="vehicle-text">{getVehicleDisplayName()}</span>
            </button>

            <button
              className="language-selector"
              onClick={() => setIsLanguageModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="language-icon">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 5h7" />
                <path d="M9 3v2c0 4.418 -2.239 8 -5 8" />
                <path d="M5 9c0 2.144 2.952 3.908 6.7 4" />
                <path d="M12 20l4 -9l4 9" />
                <path d="M19.1 18h-6.2" />
              </svg>
              <span className="language-text">{getLanguageDisplayName()}</span>
            </button>

            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? t('lightMode') : t('darkMode')}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" />
                  <path d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z" />
                  <path d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" />
                  <path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
                  <path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
                  <path d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z" />
                  <path d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z" />
                  <path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" />
                  <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onVehicleSelect={handleVehicleSelect}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onLanguageSelect={handleLanguageSelect}
      />
    </>
  );
};

export default Header; 