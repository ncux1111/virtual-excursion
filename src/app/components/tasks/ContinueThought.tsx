import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Question {
  id: number;
  beginning: string;
  expectedKeywords: string[];
  hint?: string;
}

interface ContinueThoughtProps {
  questions: Question[];
  onComplete: () => void;
}

export function ContinueThought({ questions, onComplete }: ContinueThoughtProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId: number, value: string) => {
    if (!submitted) {
      setAnswers({ ...answers, [questionId]: value });
    }
  };

  const checkAnswer = (questionId: number): boolean => {
    const answer = answers[questionId]?.toLowerCase() || "";
    const question = questions.find((q) => q.id === questionId);
    if (!question) return false;

    return question.expectedKeywords.some((keyword) =>
      answer.includes(keyword.toLowerCase())
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = questions.every((q) => checkAnswer(q.id));
    if (allCorrect) {
      setTimeout(onComplete, 2000);
    }
  };

  const allAnswered = questions.every((q) => {
    const answer = answers[q.id];
    return answer && answer.trim().length > 0;
  });
  const allCorrect = submitted && questions.every((q) => checkAnswer(q.id));

  return (
    <div className="space-y-6">
      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
        <p className="text-[#3D2817] font-serif text-center">
          Продолжите мысль автора
        </p>
        <p className="text-sm text-[#6B5542] text-center mt-2">
          Дополните фразы своими словами, передав смысл произведения
        </p>
      </div>

      {questions.map((question, index) => {
        const isCorrect = submitted && checkAnswer(question.id);
        const isIncorrect = submitted && !checkAnswer(question.id);

        return (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border-2 rounded-lg p-6 ${
              isCorrect
                ? "bg-green-50 border-green-600"
                : isIncorrect
                ? "bg-red-50 border-red-600"
                : "bg-white border-[#C9A961]"
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-8 h-8 bg-[#8B2F39] text-white rounded-full flex items-center justify-center font-serif flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-[#3D2817] font-serif text-lg flex-1">
                {question.beginning}
              </p>
            </div>

            <Textarea
              value={answers[question.id] || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              disabled={submitted}
              placeholder="Продолжите мысль..."
              className="min-h-[100px] font-serif border-[#C9A961] focus:border-[#8B2F39] disabled:bg-gray-100"
            />

            {submitted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 flex items-start gap-2"
              >
                {isCorrect ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-serif">Отлично! Вы уловили суть.</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 text-red-700">
                    <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm font-serif">
                      <p className="mb-1">Попробуйте ещё раз.</p>
                      {question.hint && (
                        <p className="text-yellow-700 italic">Подсказка: {question.hint}</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
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


