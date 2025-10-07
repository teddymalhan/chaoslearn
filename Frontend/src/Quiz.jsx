import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams

const MCQQuiz = () => {
  const { youtubeId } = useParams(); // Extract youtubeId from the URL
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz data from the Flask backend
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch("http://localhost:5000/quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ youtubeId }), // Send youtubeId to the backend

        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }

        const data = await response.json();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [youtubeId]);

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    if (!isSubmitted) {
      setSelectedAnswer(option[0]); // Extracting only the option letter (e.g., "A", "B", etc.)
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setIsSubmitted(true);
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsSubmitted(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (loading) return <p className="text-center">Loading questions...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (questions.length === 0) return <p className="text-center">No questions available.</p>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-purple">React MCQ Quiz</h1>

      <p className="text-lg text-center font-semibold mb-4">{currentQuestion.question}</p>

      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = isSubmitted && currentQuestion.answer === option[0];
          const isSelected = selectedAnswer === option[0];

          return (
            <button
              key={index}
              className={`block w-full text-left px-4 py-2 rounded-md border transition-all duration-200
                ${
                  isSubmitted
                    ? isCorrect
                      ? "bg-green-500 text-white border-green-600"
                      : isSelected
                      ? "bg-red-500 text-white border-red-600"
                      : "bg-gray-100"
                    : isSelected
                    ? "bg-gray-500 text-white border-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={isSubmitted}
            >
              {option}
            </button>
          );
        })}
      </div>

      {!isSubmitted ? (
        <button
          className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
        >
          Submit Answer
        </button>
      ) : (
        <button
          className={`w-full mt-4 py-2 rounded-md ${
            currentQuestionIndex < questions.length - 1
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
          onClick={currentQuestionIndex < questions.length - 1 ? handleNextQuestion : undefined}
        >
          {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Quiz Over!"}
        </button>
      )}
    </div>
  );
};

export default MCQQuiz;