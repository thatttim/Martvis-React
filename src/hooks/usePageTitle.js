import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const usePageTitle = (titleKey) => {
  const { t } = useLanguage();
  
  useEffect(() => {
    const previousTitle = document.title;
    const localizedTitle = t(titleKey);
    document.title = localizedTitle;
    
    // Cleanup function to restore previous title when component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [titleKey, t]);
}; 