import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TestQuestion, { QuestionOption } from '@/components/TestQuestion';
import { toast } from 'sonner';

interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

const testQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Do you enjoy working with numbers and data?',
    options: [
      { id: 'q1_a', text: 'Yes, I love analyzing data and finding patterns' },
      { id: 'q1_b', text: 'I can work with numbers but prefer other tasks' },
      { id: 'q1_c', text: 'No, I prefer working with people or creative tasks' },
      { id: 'q1_d', text: 'I\'m not sure / It depends on the context' },
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
  {
    id: 'q3',
    text: 'Would you prefer a creative or technical role?',
    options: [
      { id: 'q3_a', text: 'Strongly prefer creative roles' },
      { id: 'q3_b', text: 'Slightly prefer creative over technical' },
      { id: 'q3_c', text: 'Slightly prefer technical over creative' },
      { id: 'q3_d', text: 'Strongly prefer technical roles' },
    ],
  },
  {
    id: 'q4',
    text: 'How comfortable are you with taking risks in your career?',
    options: [
      { id: 'q4_a', text: 'Very comfortable, I enjoy taking risks' },
      { id: 'q4_b', text: 'Somewhat comfortable with calculated risks' },
      { id: 'q4_c', text: 'Prefer stability but can handle some change' },
      { id: 'q4_d', text: 'Uncomfortable, I prefer security and stability' },
    ],
  },
  {
    id: 'q5',
    text: 'Do you like solving complex problems?',
    options: [
      { id: 'q5_a', text: 'Yes, complex problems are intellectually stimulating' },
      { id: 'q5_b', text: 'I enjoy moderately challenging problems' },
      { id: 'q5_c', text: 'I prefer straightforward tasks with clear solutions' },
      { id: 'q5_d', text: 'It depends on the type of problem' },
    ],
  },
];

const Test = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = testQuestions[currentQuestionIndex];

  useEffect(() => {
    // Reset selected option when question changes
    setSelectedOption(answers[currentQuestion?.id] || null);
  }, [currentQuestionIndex, answers, currentQuestion?.id]);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (selectedOption) {
      // Save the answer
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOption,
      }));

      // If there are more questions, go to the next one
      if (currentQuestionIndex < testQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Otherwise, complete the test
        handleComplete();
      }
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    
    // Simulate API call or processing
    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);
      toast.success("Assessment completed successfully!");
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Assessment Completed!</h2>
                  <p className="text-foreground/70 mb-4">
                    Thank you for completing the career assessment.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl bg-secondary/50 mb-8">
                  <h3 className="font-semibold mb-4">Your Results Summary</h3>
                  <p className="text-foreground/70 mb-4">
                    Based on your responses, we'll generate a personalized career report that highlights career paths aligned with your preferences, skills, and interests.
                  </p>
                  <div className="flex justify-center mt-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="#e6e6e6" 
                          strokeWidth="10" 
                        />
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="10" 
                          strokeDasharray="283" 
                          strokeDashoffset="70" 
                          className="text-primary"
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl font-bold">
                        75%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/" 
                    className="px-6 py-2.5 rounded-full border border-border bg-white hover:bg-secondary transition-colors duration-300 font-medium text-center"
                  >
                    Return Home
                  </Link>
                  <button 
                    className="px-6 py-2.5 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:translate-y-[-2px] active:translate-y-0 transition-all duration-300 button-shine"
                  >
                    View Detailed Results
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="rounded-2xl bg-white border border-border shadow-sm p-8 text-center animate-pulse-soft">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                </div>
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
