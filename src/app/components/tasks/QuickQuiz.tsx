import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Clock } from "lucide-react";
import { Button } from "../ui/button";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuickQuizProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export function QuickQuiz({ questions, onComplete }: QuickQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    setAnswers({ ...answers, [questions[currentQuestion].id]: selectedOption });
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowResult(false);
      } else {
        const correctCount = Object.entries(answers).filter(([qId, answer]) => {
          const q = questions.find((q) => q.id === parseInt(qId));
          return q && answer === q.correctAnswer;
        }).length + (selectedOption === questions[currentQuestion].correctAnswer ? 1 : 0);

        if (correctCount === questions.length) {
          setTimeout(onComplete, 1000);
        }
      }
    }, 1500);
  };

  const question = questions[currentQuestion];
  const isCorrect = showResult && selectedOption === question.correctAnswer;
  const correctCount =
    Object.entries(answers).filter(([qId, answer]) => {
      const q = questions.find((q) => q.id === parseInt(qId));
      return q && answer === q.correctAnswer;
    }).length + (showResult && isCorrect ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="bg-[#8B2F39] text-white rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span className="font-serif">Быстрая викторина</span>
          </div>
          <div className="font-serif">
            Вопрос {currentQuestion + 1} из {questions.length}
          </div>
        </div>
      </div>

      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-serif text-[#3D2817] text-center">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = showResult && index === question.correctAnswer;
              const isWrongSelection = showResult && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showResult}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                  className={`w-full p-4 border-2 rounded-lg font-serif text-left transition-all ${
                    isCorrectOption
                      ? "bg-green-50 border-green-600 text-green-900"
                      : isWrongSelection
                      ? "bg-red-50 border-red-600 text-red-900"
                      : isSelected
                      ? "bg-[#8B2F39] text-white border-[#8B2F39]"
                      : "bg-white border-[#C9A961] hover:border-[#8B2F39] hover:shadow-md"
                  } ${!showResult ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <span>
                        {isCorrectOption ? (
                          <Check className="w-5 h-5" />
                        ) : isWrongSelection ? (
                          <X className="w-5 h-5" />
                        ) : null}
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {!showResult && (
        <Button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="w-full bg-[#8B2F39] hover:bg-[#6B2329] text-white font-serif text-lg py-6"
        >
          {currentQuestion < questions.length - 1 ? "Следующий вопрос" : "Завершить викторину"}
        </Button>
      )}

      {showResult && currentQuestion === questions.length - 1 && (
        <div className="space-y-4 bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6 text-center">
          <p className="text-[#3D2817] font-serif text-lg">
            Викторина завершена! Вы ответили правильно на{" "}
            {correctCount}{" "}
            из {questions.length} вопросов.
          </p>
          {correctCount < questions.length && (
            <Button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setSelectedOption(null);
                setShowResult(false);
              }}
              className="bg-[#2C8C99] hover:bg-[#247580] text-white font-serif"
            >
              Попробовать ещё раз
            </Button>
          )}
        </div>
      )}
    </div>
  );
}


