import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TestQuestion from '@/components/TestQuestion';
import { toast } from 'sonner';

const testQuestions = [
  {
    id: 'q1',
    text: 'Do you enjoy working with numbers and data?',
    options: [
      { id: 'q1_a', text: 'Yes, I love analyzing data and finding patterns' },
      { id: 'q1_b', text: 'I can work with numbers but prefer other tasks' },
      { id: 'q1_c', text: 'No, I prefer working with people or creative tasks' },
      { id: 'q1_d', text: "I'm not sure / It depends on the context" },
    ],
  },
  {
    id: 'q2',
    text: 'How do you prefer to solve problems?',
    options: [
      { id: 'q2_a', text: 'Analytically, by breaking down the components' },
      { id: 'q2_b', text: 'Creatively, by thinking outside the box' },
      { id: 'q2_c', text: 'Collaboratively, by discussing with others' },
      { id: 'q2_d', text: 'Methodically, by following established procedures' },
    ],
  },
];

const Test = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = testQuestions[currentQuestionIndex];

  useEffect(() => {
    setSelectedOption(answers[currentQuestion?.id] || null);
  }, [currentQuestionIndex, answers, currentQuestion?.id]);

  const handleSelectOption = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOption,
      }));

      if (currentQuestionIndex < testQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);
      toast.success('Assessment completed successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <Navbar />

      <div className="pt-28 pb-16">
        <div className="container px-6 md:px-8 mx-auto">
          <div className="max-w-2xl mx-auto">
            {isCompleted ? (
              <div className="rounded-2xl bg-white border border-border shadow-sm p-8 animate-scale-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">Assessment Completed!</h2>
                  <p className="text-foreground/70 mb-4">
                    Thank you for completing the career assessment.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/" 
                    className="px-6 py-2.5 rounded-full border border-border bg-white hover:bg-secondary transition-colors duration-300 font-medium text-center"
                  >
                    Return Home
                  </Link>
                  <button 
                    className="px-6 py-2.5 rounded-full bg-primary text-white font-medium shadow-lg"
                  >
                    View Detailed Results
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="rounded-2xl bg-white border border-border shadow-sm p-8 text-center animate-pulse-soft">
                <h2 className="text-2xl font-bold mb-2">Analyzing Your Responses</h2>
                <p className="text-foreground/70">
                  Please wait while we process your assessment results...
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-border shadow-sm p-8">
                <TestQuestion
                  question={currentQuestion.text}
                  options={currentQuestion.options}
                  selectedOption={selectedOption}
                  onSelectOption={handleSelectOption}
                  onNext={handleNext}
                  currentQuestion={currentQuestionIndex + 1}
                  totalQuestions={testQuestions.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
