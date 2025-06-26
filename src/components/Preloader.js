import React from 'react';
import './Preloader.scss';

const Preloader = ({ isLoading }) => {
  return (
    <div className={`preloader ${!isLoading ? 'preloader--hidden' : ''}`}>
      <div className="preloader__container">
        <div className="preloader__logo">
          <div className="preloader__logo-text">MARTVIS</div>
        </div>
        <div className="preloader__spinner">
          <div className="preloader__spinner-ring"></div>
          <div className="preloader__spinner-ring"></div>
          <div className="preloader__spinner-ring"></div>
        </div>
        <div className="preloader__text">Loading...</div>
      </div>
    </div>
  );
};

export default Preloader; 