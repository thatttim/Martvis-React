import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { apiService } from '../services/apiService';
import '../styles/VehicleModal.scss';

const VehicleModal = ({ isOpen, onClose, onVehicleSelect }) => {
  const { t, language } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useLocalStorage('selectedVehicle', 2);

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle.id);
    if (onVehicleSelect) {
      onVehicleSelect(vehicle);
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="vehicle-modal-overlay" onClick={handleBackdropClick}>
      <div className="vehicle-modal">
        <div className="modal-header">
          <h2 className="modal-title">{t('selectVehicle')}</h2>
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
            <div className="vehicle-grid">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  className={`vehicle-card ${selectedVehicle === vehicle.id ? 'selected' : ''}`}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <div className="vehicle-info">
                    <div className="vehicle-code">{vehicle.code}</div>
                    <div className="vehicle-type">
                      {t('category')}
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

export default VehicleModal; 