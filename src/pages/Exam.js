import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePageTitle } from '../hooks/usePageTitle';
import { apiService } from '../services/apiService';
import '../styles/Exam.scss';

const Exam = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examInfo, setExamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [maxMistakes] = useState(3);
  const [vehicles, setVehicles] = useState([]);
  const [answerFeedback, setAnswerFeedback] = useState(null);

  const [selectedVehicle] = useLocalStorage('selectedVehicle', 2);

  // Set page title
  usePageTitle('pageTitleExam');

  useEffect(() => {
    if (!selectedVehicle) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [examData, vehiclesData] = await Promise.all([
          apiService.getExam(selectedVehicle, language),
          apiService.getVehicles()
        ]);
        setTickets(examData.tickets || []);
        setExamInfo(examData);
        setVehicles(vehiclesData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedVehicle, language, navigate]);

  // Get vehicle display name
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

  // Timer effect
  useEffect(() => {
    if (!examStarted || examCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examCompleted]);

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (examCompleted) return;
    
    // Check if this is a new answer or changing an existing one
    const previousAnswer = selectedAnswers[currentQuestion];
    const isNewAnswer = previousAnswer === undefined;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));

    // Show feedback for the selected answer
    const isCorrect = answerIndex === tickets[currentQuestion].correct;
    setAnswerFeedback({
      isCorrect,
      selectedAnswer: answerIndex,
      correctAnswer: tickets[currentQuestion].correct
    });

    // Only count mistakes for new answers, not when changing answers
    if (isNewAnswer && !isCorrect) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      // If max mistakes reached, end exam immediately
      if (newMistakes >= maxMistakes) {
        setTimeout(() => {
          handleFinishExam();
        }, 2000); // Give user 2 seconds to see the feedback
        return;
      }
    }

    // Auto-navigate to next question after 2 seconds
    setTimeout(() => {
      setAnswerFeedback(null);
      if (currentQuestion < tickets.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 2000);
  };

  const handleNext = () => {
    if (currentQuestion < tickets.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswerFeedback(null); // Clear feedback when changing questions
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswerFeedback(null); // Clear feedback when changing questions
    }
  };

  const handleFinishExam = () => {
    setExamCompleted(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setExamCompleted(false);
    setTimeRemaining(30 * 60);
    setExamStarted(false);
    setMistakes(0);
    setAnswerFeedback(null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let correct = 0;
    tickets.forEach((ticket, index) => {
      if (selectedAnswers[index] === ticket.correct) {
        correct++;
      }
    });
    return correct;
  };

  const getPassStatus = (score) => {
    const percentage = (score / tickets.length) * 100;
    return percentage >= 90; // 90% passing threshold
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
      <div className="exam-container">
        <div className="error">{t('error')}: {error}</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="exam-container">
        <div className="no-tickets">{t('noTickets')}</div>
        <button className="back-button" onClick={() => navigate('/')}>
          {t('home')}
        </button>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="exam-container">
        <div className="exam-intro">
          <h2 className="exam-instructions-title">ინსტრუქცია</h2>
          <div className="exam-info">
            <div className="exam-details">
              <p><strong>{t('vehicleType')}:</strong> {getVehicleDisplayName()}</p>
              <p><strong>{t('totalQuestions')}:</strong> {tickets.length}</p>
              <p><strong>{t('timeLimit')}:</strong> {t('thirtyMinutes')}</p>
              <p><strong>{t('passingScore')}:</strong> 90%</p>
              <p><strong>{t('maxMistakes')}:</strong> {maxMistakes}</p>
            </div>
            <button className="start-exam-button" onClick={handleStartExam}>
              {t('startExam')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (examCompleted) {
    const score = calculateScore();
    const passed = getPassStatus(score);
    const failedDueToMistakes = mistakes >= maxMistakes;
    
    return (
      <div className="exam-container">
        <div className="exam-completed">
          <h2 className="result-title">
            {failedDueToMistakes ? t('examFailedMistakes') : (passed ? t('examPassed') : t('examFailed'))}
          </h2>
          <div className="final-score">
            {t('score')}: {score} / {tickets.length}
          </div>
          <div className="score-percentage">
            {Math.round((score / tickets.length) * 100)}%
          </div>
          {failedDueToMistakes && (
            <div className="mistakes-info">
              {t('mistakesMade')}: {mistakes} / {maxMistakes}
            </div>
          )}
          <div className="pass-status">
            {failedDueToMistakes ? t('tooManyMistakes') : (passed ? t('congratulations') : t('betterLuckNextTime'))}
          </div>
          <div className="exam-actions">
            <button className="restart-button" onClick={handleRestart}>
              {t('retakeExam')}
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
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="exam-container">
      <div className="question-indicators">
        {tickets.map((_, index) => {
          const isAnswered = selectedAnswers[index] !== undefined;
          const isCorrect = isAnswered && selectedAnswers[index] === tickets[index].correct;
          const isIncorrect = isAnswered && selectedAnswers[index] !== tickets[index].correct;
          
          let indicatorClass = 'indicator';
          if (index === currentQuestion) indicatorClass += ' current';
          if (isAnswered) indicatorClass += ' answered';
          if (isCorrect) indicatorClass += ' correct';
          if (isIncorrect) indicatorClass += ' incorrect';
          
          return (
            <button
              key={index}
              className={indicatorClass}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="exam-header">
        <div className="exam-progress">
          <div className="progress-info">
            {t('question')} {currentQuestion + 1} / {tickets.length}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestion + 1) / tickets.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="exam-timer">
          <div className="timer-label">{t('timeRemaining')}</div>
          <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
        <div className="mistakes-counter">
          <div className="mistakes-label">{t('mistakes')}</div>
          <div className={`mistakes ${mistakes >= maxMistakes ? 'danger' : ''}`}>
            {mistakes} / {maxMistakes}
          </div>
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
          {currentTicket.answers.map((answer, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentTicket.correct;
            const showFeedback = answerFeedback && (isSelected || isCorrect);
            
            let buttonClass = 'answer-button';
            if (isSelected) buttonClass += ' selected';
            if (showFeedback) {
              if (isCorrect) {
                buttonClass += ' correct';
              } else if (isSelected) {
                buttonClass += ' incorrect';
              }
            }
            
            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleAnswerSelect(index)}
              >
                {answer}
              </button>
            );
          })}
        </div>

        {answerFeedback && (
          <div className={`answer-feedback ${answerFeedback.isCorrect ? 'correct' : 'incorrect'}`}>
            {answerFeedback.isCorrect ? t('correct') : t('incorrect')}
          </div>
        )}
      </div>

      <div className="exam-navigation">
        <button
          className="nav-button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          {t('previous')}
        </button>
        
        <button
          className="nav-button"
          onClick={currentQuestion === tickets.length - 1 ? handleFinishExam : handleNext}
          disabled={currentQuestion === tickets.length - 1}
        >
          {currentQuestion === tickets.length - 1 ? t('finish') : t('next')}
        </button>
      </div>
    </div>
  );
};

export default Exam; 