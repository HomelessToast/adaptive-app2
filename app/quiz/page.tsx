"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


type Question = {
  question: string;
  options?: string[];
  inputType?: "number";
  validate?: (value: string) => boolean;
  correct: number;
};

const questions: Question[] = [
  {
    question: "How old are you?",
    options: [
      "18–25", "26–35", "36–45", "46–60", "Over 60"
    ],
    correct: -1,
  },
  {
    question: "What is your gender?",
    options: ["Male", "Female", "Other"],
    correct: -1,
  },
  {
    question: "What's your preferred method of fitness?",
    options: [
      "Endurance Sports (Running, Cycling, Swimming)",
      "Power Sports (Football, Wrestling)",
      "Hybrid Sports (Basketball, Soccer)",
      "Bodybuilding",
      "Powerlifting",
      "HIIT / Weightlifting",
    ],
    correct: -1,
  },
  {
    question: "What is your bodyweight in lbs?",
    inputType: "number",
    validate: (value: string) => {
      const num = parseInt(value, 10);
      return num >= 80 && num <= 500;
    },
    correct: -1,
  },
  {
    question: "When do you workout?",
    options: [
      "Morning (5am–11am)",
      "Midday (11am–4pm)",
      "Evening (5pm–7pm)",
      "Night (8pm–12am)",
    ],
    correct: -1,
  },
  {
    question: "Do you like beta-alanine? (This is the compound that gives you the tingles)",
    options: ["I dont feel my pre anymore", "I like it", "Its ok", "Don't like it"],
    correct: -1,
  },
  {
    question: "Caffeine Preference",
    options: ["Very High", "High", "Moderate", "Low", "Stim Free"],
    correct: -1,
  },
  {
    question: "Choose your flavor",
    options: ["Blue Raz", "Fruit Punch Slam", "Lemon Lime Twist", "Pina Colada", "Blood Orange"],
    correct: -1,
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const q = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
  const updatedAnswers = [...userAnswers, answer];
  setUserAnswers(updatedAnswers);

  if (currentQuestion + 1 < questions.length) {
    setCurrentQuestion((prev) => prev + 1);
  } else {
    const queryString = encodeURIComponent(JSON.stringify(updatedAnswers));
    router.push(`/results?answers=${queryString}`);
  }
};

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-8 py-3 border-b border-gray-200 w-full bg-white text-black">
        <a href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition">ADAPTIV</a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 lg:gap-8 text-sm font-medium text-gray-600">
          <a href="/quiz" className="hover:text-black transition">QUIZ</a>
          <a href="/start-from-scratch" className="hover:text-black transition">START FROM SCRATCH</a>
          <a href="/products" className="hover:text-black transition">PRODUCTS</a>
          <a href="/contact" className="hover:text-black transition">CONTACT</a>
        </nav>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="bg-black text-white px-3 md:px-4 py-2 rounded font-semibold text-sm">
          <a href="/cart" className="text-white">CART</a>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
          <nav className="flex flex-col gap-4 text-sm font-medium text-gray-600">
            <a href="/quiz" className="hover:text-black transition py-2">QUIZ</a>
            <a href="/start-from-scratch" className="hover:text-black transition py-2">START FROM SCRATCH</a>
            <a href="/products" className="hover:text-black transition py-2">PRODUCTS</a>
            <a href="/contact" className="hover:text-black transition py-2">CONTACT</a>
          </nav>
        </div>
      )}

      {/* Quiz content */}
      <main className="relative flex flex-col items-center bg-white text-black font-sans px-2 py-16 min-h-screen overflow-hidden">
        {/* Soft radial gradient background accent */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle at 50% 20%, #e5e7eb 40%, transparent 80%)",
            opacity: 0.5,
          }}
        />
        {/* Faint ADAPTIV logo background for branding */}
        <span className="hidden md:block select-none pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-extrabold tracking-tight text-gray-200 opacity-30 z-0" aria-hidden="true">
          ADAPTIV
        </span>
        {/* Quiz content (z-10) */}
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Friendly Intro */}
          {currentQuestion === 0 && userAnswers.length === 0 && (
            <div className="mb-1 text-center px-4">
              <h2 className="text-xl md:text-2xl font-bold mb-2">Let's personalize your pre-workout!</h2>
              <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">Answer a few quick questions and we'll build a formula just for you.</p>
            </div>
          )}
          {/* Progress Indicator */}
          <div className="w-full max-w-md mb-2 px-4">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          {/* Quiz Card */}
          <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-md flex flex-col items-center border border-blue-100 animate-fade-in mx-4">
            {!showResult ? (
              <>
                <h1 className="text-lg md:text-xl font-bold mb-4 text-center">{q.question}</h1>
                {q.options ? (
                  <div className="flex flex-col gap-3 md:gap-4 w-full">
                    {q.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className="bg-black text-white px-4 md:px-6 py-3 md:py-3 rounded-full text-sm md:text-base hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition relative overflow-hidden group min-h-[44px]"
                        style={{ outline: 'none' }}
                      >
                        <span className="group-active:scale-95 group-hover:opacity-90 transition-transform">{option}</span>
                        {/* Click effect */}
                        <span className="absolute inset-0 bg-blue-100 opacity-0 group-active:opacity-30 rounded-full transition-opacity"></span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = (e.currentTarget.elements[0] as HTMLInputElement).value;
                      if (q.validate && !q.validate(input)) {
                        alert("Please enter a weight between 80 and 500 lbs.");
                        return;
                      }
                      handleAnswer(input);
                    }}
                    className="flex flex-col items-center gap-4 w-full"
                  >
                    <input
                      type={q.inputType || "text"}
                      className="bg-white text-black p-3 md:p-2 rounded w-full max-w-48 text-center placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                      placeholder="Enter your answer"
                    />
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-3 rounded-full text-base hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition min-h-[44px]"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-4">Quiz Completed!</h1>
                <p className="text-base md:text-lg">Your Answers:</p>
                <ul className="mt-2 text-sm md:text-base">
                  {userAnswers.map((a, i) => (
                    <li key={i}>
                      <strong>Q{i + 1}:</strong> {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      
    </>
  );
}
