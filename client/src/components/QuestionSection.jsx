import React from 'react';
import { Target, SkipForward, ChevronRight, Loader2 } from 'lucide-react';

function QuestionSection({
  question,
  currentAnswer,
  handleSelectAnswer,
  handleSkipQuestion,
  handleNextQuestion,
  isLoading,
  isGeneratingQuestion,
  answers
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl animate-float">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-6 h-6 text-indigo-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800">
            {question.question || 'No questions available.'}
          </h2>
        </div>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={isLoading}
              className={`w-full p-4 text-left rounded-xl transition-all duration-300 transform hover:scale-102 hover:shadow-md flex items-center space-x-3 ${currentAnswer === option
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white hover:bg-gray-50 text-gray-700'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentAnswer === option ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                {index + 1}
              </div>
              <span>{option}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-8 space-x-4">
          <button
            onClick={handleSkipQuestion}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <SkipForward className="w-4 h-4 mr-2 group-hover:animate-bounce" />
            Skip
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={!currentAnswer || isLoading}
            className={`flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 group ${!currentAnswer || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isGeneratingQuestion ? 'Generating...' : 'Loading...'}
              </>
            ) : answers.length < 10 ? (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              'Complete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionSection;