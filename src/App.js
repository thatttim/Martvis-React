import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomTabBar from './components/BottomTabBar';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Quiz from './pages/Quiz';
import Exam from './pages/Exam';
import { useFontLoader } from './hooks/useFontLoader';
import './App.scss';

function AppContent() {
  const fontsLoaded = useFontLoader();

  return (
    <Router>
      <div className="App">
        <Preloader isLoading={!fontsLoaded} />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/exam" element={<Exam />} />
          </Routes>
        </main>
        <Footer />
        <BottomTabBar />
      </div>
    </Router>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
