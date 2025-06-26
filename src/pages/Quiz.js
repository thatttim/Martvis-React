import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePageTitle } from '../hooks/usePageTitle';
import { apiService } from '../services/apiService';
import '../styles/Quiz.scss';

const Quiz = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const [selectedVehicle] = useLocalStorage('selectedVehicle', 2);
  const [selectedCategory] = useLocalStorage('selectedCategory', null);

  // Set page title
  usePageTitle('pageTitleQuiz');

  useEffect(() => {
    if (!selectedVehicle || !selectedCategory) {
      navigate('/');
      return null;
    }

    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTickets(selectedVehicle, selectedCategory, language);
        setTickets(data.tickets || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [selectedVehicle, selectedCategory, language, navigate]);

  const handleAnswerSelect = (answerIndex) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === tickets[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion < tickets.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error">{t('error')}: {error}</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="quiz-container">
        <div className="no-tickets">{t('noTickets')}</div>
        <button className="back-button" onClick={() => navigate('/')}>
          {t('home')}
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <div className="quiz-completed">
          <h2>{t('quiz')} {t('completed')}</h2>
          <div className="final-score">
            {t('score')}: {score} / {tickets.length}
          </div>
          <div className="score-percentage">
            {Math.round((score / tickets.length) * 100)}%
          </div>
          <div className="quiz-actions">
            <button className="restart-button" onClick={handleRestart}>
              {t('restart')}
            </button>
            <button className="home-button" onClick={() => navigate('/')}>
              {t('home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTicket = tickets[currentQuestion];
  const isCorrect = selectedAnswer === currentTicket.correct;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress">
          {t('question')} {currentQuestion + 1} / {tickets.length}
        </div>
        <div className="score">
          {t('score')}: {score}
        </div>
      </div>

      <div className="question-container">
        <h2 className="question-text">{currentTicket.question}</h2>
        
        {currentTicket.image && (
          <div className="question-image">
            <img src={currentTicket.image} alt="Question" />
          </div>
        )}

        <div className="answers-container">
          {currentTicket.answers.map((answer, index) => (
            <button
              key={index}
              className={`answer-button ${
                selectedAnswer === index
                  ? isCorrect
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
            >
              {answer}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="result-section">
            <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? t('correct') : t('incorrect')}
            </div>
            
            {currentTicket.explanation && (
              <div className="explanation">
                <h3>{t('explanation')}</h3>
                <p>{currentTicket.explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quiz-navigation">
        <button
          className="nav-button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          {t('previous')}
        </button>
        
        <button
          className="nav-button"
          onClick={handleNext}
          disabled={selectedAnswer === null}
        >
          {currentQuestion === tickets.length - 1 ? t('finish') : t('next')}
        </button>
      </div>
    </div>
  );
};

export default Quiz; 