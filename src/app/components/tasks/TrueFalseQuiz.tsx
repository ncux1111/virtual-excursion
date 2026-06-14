import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

interface Question {
  id: number;
  text: string;
  correct: boolean;
}

interface TrueFalseQuizProps {
  questions: Question[];
  onComplete: () => void;
}

export function TrueFalseQuiz({ questions, onComplete }: TrueFalseQuizProps) {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: number, answer: boolean) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: answer });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = questions.every((q) => answers[q.id] === q.correct);
    if (allCorrect) {
      setTimeout(onComplete, 1500);
    }
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);
  const allCorrect = submitted && questions.every((q) => answers[q.id] === q.correct);

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correct;
        const showResult = submitted && userAnswer !== null && userAnswer !== undefined;

        return (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-[#F5EFE7] border-2 rounded-lg p-6 shadow-md ${
              showResult
                ? isCorrect
                  ? "border-green-600 bg-green-50"
                  : "border-red-600 bg-red-50"
                : "border-[#C9A961]"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-[#8B2F39] text-white rounded-full flex items-center justify-center font-serif flex-shrink-0">
                {index + 1}
              </div>
              
              <div className="flex-1">
                <p className="text-[#3D2817] mb-4 font-serif text-lg">
                  {question.text}
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAnswer(question.id, true)}
                    disabled={submitted}
                    className={`flex-1 font-serif ${
                      userAnswer === true
                        ? showResult && isCorrect
                          ? "bg-green-600 hover:bg-green-700"
                          : showResult && !isCorrect
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-[#8B2F39] hover:bg-[#6B2329]"
                        : "bg-[#D4B896] hover:bg-[#C9A961] text-[#3D2817]"
                    }`}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Верно
                  </Button>
                  
                  <Button
                    onClick={() => handleAnswer(question.id, false)}
                    disabled={submitted}
                    className={`flex-1 font-serif ${
                      userAnswer === false
                        ? showResult && isCorrect
                          ? "bg-green-600 hover:bg-green-700"
                          : showResult && !isCorrect
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-[#8B2F39] hover:bg-[#6B2329]"
                        : "bg-[#D4B896] hover:bg-[#C9A961] text-[#3D2817]"
                    }`}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Неверно
                  </Button>
                </div>
              </div>

              {showResult && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex-shrink-0"
                >
                  {isCorrect ? (
                    <Check className="w-8 h-8 text-green-600" />
                  ) : (
                    <X className="w-8 h-8 text-red-600" />
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-[#8B2F39] hover:bg-[#6B2329] text-white font-serif text-lg py-6"
        >
          Проверить ответы
        </Button>
      )}

      {submitted && !allCorrect && (
        <Button
          onClick={() => setSubmitted(false)}
          className="w-full bg-[#2C8C99] hover:bg-[#247580] text-white font-serif text-lg py-6"
        >
          Попробовать ещё раз
        </Button>
      )}
    </div>
  );
}


