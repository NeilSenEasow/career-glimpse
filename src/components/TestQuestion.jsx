import React from 'react';
import { cn } from '@/lib/utils';

const TestQuestion = ({
  question,
  options,
  selectedOption,
  onSelectOption,
  onNext,
  currentQuestion,
  totalQuestions,
}) => {
  return (
    <div className="animate-scale-in">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground/60">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round((currentQuestion / totalQuestions) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8">{question}</h2>
      
      <div className="space-y-4 mb-8">
        {options.map((option) => (
          <button
            key={option.id}
            className={cn(
              "w-full p-4 text-left rounded-lg border transition-all duration-300",
              selectedOption === option.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            )}
            onClick={() => onSelectOption(option.id)}
          >
            <div className="flex items-center">
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center mr-3 transition-all duration-300",
                selectedOption === option.id
                  ? "border-primary"
                  : "border-muted-foreground"
              )}>
                {selectedOption === option.id && (
                  <div className="w-3 h-3 rounded-full bg-primary animate-scale-in"></div>
                )}
              </div>
              <span>{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={selectedOption === null}
          className={cn(
            "px-6 py-2.5 rounded-full font-medium transition-all duration-300 button-shine",
            selectedOption === null
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-0"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default TestQuestion;
