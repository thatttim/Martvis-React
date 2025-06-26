import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Footer.scss';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © {currentYear} Martvis. {t('footerRights')} 
          <a 
            href="https://framework.ge" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            Framework Holding
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 