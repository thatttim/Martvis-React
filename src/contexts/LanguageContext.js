import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'ka';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Get the UI language based on the selected language
  const getUILanguage = () => {
    // Georgian and English show native UI, others show English
    if (language === 'ka') {
      return 'ka';
    } else if (language === 'en') {
      return 'en';
    } else {
      return 'en'; // Default to English for other languages
    }
  };

  const uiLanguage = getUILanguage();

  const translations = {
    en: {
      home: 'Home',
      vehicles: 'Vehicles',
      categories: 'Categories',
      category: 'Category',
      georgianMenu: 'Georgian menu',
      englishMenu: 'English menu',
      tickets: 'Tickets',
      selectVehicle: 'Select Vehicle Type',
      selectLanguage: 'Select Language',
      selectCategory: 'Select Category',
      startQuiz: 'Start Quiz',
      startExam: 'Start Exam',
      question: 'Question',
      next: 'Next',
      previous: 'Previous',
      correct: 'Correct!',
      incorrect: 'Incorrect!',
      explanation: 'Explanation',
      score: 'Score',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      loading: 'Loading...',
      error: 'Error loading data',
      noTickets: 'No tickets available',
      quiz: 'Quiz',
      completed: 'Completed',
      restart: 'Restart',
      finish: 'Finish',
      back: 'Back',
      practiceMode: 'Practice Mode',
      examMode: 'Exam Mode',
      vehicleType: 'Vehicle Type',
      totalQuestions: 'Total Questions',
      timeLimit: 'Time Limit',
      thirtyMinutes: '30 minutes',
      passingScore: 'Passing Score',
      timeRemaining: 'Time Remaining',
      examPassed: 'Exam Passed!',
      examFailed: 'Exam Failed',
      examFailedMistakes: 'Exam Failed - Too Many Mistakes',
      congratulations: 'Congratulations! You have passed the exam.',
      betterLuckNextTime: 'Better luck next time. Keep practicing!',
      tooManyMistakes: 'You have made too many mistakes. Better luck next time!',
      retakeExam: 'Retake Exam',
      vehicle: 'Vehicle',
      cancel: 'Cancel',
      selectVehicleFirst: 'Select Vehicle First',
      selectVehicleFromHeader: 'Click the vehicle button in the header to select your vehicle type.',
      welcomeMessage: 'Welcome to your driving test preparation platform',
      pageTitleHome: 'Martvis - Driving Practice & Exam',
      pageTitlePractice: 'Practice - Martvis',
      pageTitleQuiz: 'Quiz - Martvis',
      pageTitleExam: 'Exam - Martvis',
      footerRights: 'All rights reserved.',
      maxMistakes: 'Maximum Mistakes',
      mistakes: 'Mistakes',
      mistakesMade: 'Mistakes Made'
    },
    ka: {
      home: 'მთავარი',
      vehicles: 'ტრანსპორტი',
      categories: 'კატეგორიები',
      category: 'კატეგორია',
      georgianMenu: 'ქართული მენიუ',
      englishMenu: 'ინგლისური მენიუ',
      tickets: 'ბილეთები',
      selectVehicle: 'აირჩიე კატეგორია',
      selectLanguage: 'აირჩიე ენა',
      selectCategory: 'აირჩიე კატეგორია',
      startQuiz: 'ქვიზის დაწყება',
      startExam: 'გამოცდის დაწყება',
      question: 'ბილეთი',
      next: 'შემდეგი',
      previous: 'წინა',
      correct: 'სწორია!',
      incorrect: 'არასწორია!',
      explanation: 'ახსნა',
      score: 'ქულა',
      darkMode: 'მუქი რეჟიმი',
      lightMode: 'ღია რეჟიმი',
      loading: 'იტვირთება...',
      error: 'მონაცემების ჩატვირთვის შეცდომა',
      noTickets: 'ბილეთები მიუწვდომელია',
      quiz: 'ტესტი',
      completed: 'დასრულებული',
      restart: 'ხელახლა დაწყება',
      finish: 'დასრულება',
      back: 'უკან',
      practiceMode: 'ბილეთები',
      examMode: 'გამოცდა',
      vehicleType: 'ტრანსპორტის კატეგორია',
      totalQuestions: 'სულ კითხვები',
      timeLimit: 'დროის ლიმიტი',
      thirtyMinutes: '30 წუთი',
      passingScore: 'მინიმალური ბარიერი',
      timeRemaining: 'დარჩენილი დრო',
      examPassed: 'გამოცდა ჩააბარე!',
      examFailed: 'გამოცდა ვერ ჩააბარე',
      examFailedMistakes: 'გამოცდა ვერ ჩააბარე',
      congratulations: 'გილოცავ! გამოცდა ჩააბარე',
      betterLuckNextTime: 'წარმატებებს გისურვებ შემდეგ ჯერზე. გააგრძელე ვარჯიში!',
      tooManyMistakes: 'ცუდია... კიდევ სცადე',
      retakeExam: 'ხელახლა ცდა',
      vehicle: 'ტრანსპორტი',
      cancel: 'გაუქმება',
      selectVehicleFirst: 'ჯერ აირჩიე ტრანსპორტი',
      selectVehicleFromHeader: 'დააჭირე ტრანსპორტის ღილაკს სათაურში თქვენი ტრანსპორტის ტიპის ასარჩევად.',
      welcomeMessage: 'თეორიის გამოცდის სავარჯიშო პლატფორმა ფრეიმვორკისგან',
      pageTitleHome: 'Martvis - სავარძლო ვარჯიში და გამოცდა',
      pageTitlePractice: 'ვარჯიში - Martvis',
      pageTitleQuiz: 'ქვიზი - Martvis',
      pageTitleExam: 'გამოცდა - Martvis',
      footerRights: 'ყველა უფლება დაცულია.',
      maxMistakes: 'მაქსიმუმ შეცდომები',
      mistakes: 'შეცდომები',
      mistakesMade: 'შეცდომები შექცეთ'
    }
  };

  const t = (key) => {
    return translations[uiLanguage][key] || key;
  };

  const value = {
    language,
    setLanguage,
    uiLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 