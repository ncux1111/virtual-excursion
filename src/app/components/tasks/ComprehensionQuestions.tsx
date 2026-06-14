import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Question {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
}

interface ComprehensionQuestionsProps {
  questions: Question[];
  onComplete: () => void;
}

export function ComprehensionQuestions({ questions, onComplete }: ComprehensionQuestionsProps) {
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

    const matchedKeywords = question.keywords.filter((keyword) =>
      answer.includes(keyword.toLowerCase())
    );

    return matchedKeywords.length >= Math.ceil(question.keywords.length / 2);
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
    return answer && answer.trim().length > 10;
  });
  const allCorrect = submitted && questions.every((q) => checkAnswer(q.id));

  return (
    <div className="space-y-6">
      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
        <h3 className="text-xl font-serif text-[#3D2817] text-center mb-2">
          Вопросы на понимание содержания
        </h3>
        <p className="text-sm text-[#6B5542] text-center">
          Ответьте на вопросы своими словами, опираясь на текст произведения
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
              <div className="w-10 h-10 bg-[#8B2F39] text-white rounded-full flex items-center justify-center font-serif text-lg flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-[#3D2817] font-serif text-lg mb-4">
                  {question.question}
                </p>

                <Textarea
                  value={answers[question.id] || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  disabled={submitted}
                  placeholder="Ваш ответ..."
                  className="min-h-[120px] font-serif border-[#C9A961] focus:border-[#8B2F39] disabled:bg-gray-100"
                />

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-4 rounded-lg bg-[#F5EFE7] border border-[#C9A961]"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <p className="font-serif text-sm font-semibold text-[#3D2817]">
                        {isCorrect ? "Отличный ответ!" : "Ответ неполный"}
                      </p>
                    </div>
                    <p className="text-sm font-serif text-[#6B5542] ml-7">
                      <strong>Эталонный ответ:</strong> {question.answer}
                    </p>
                  </motion.div>
                )}
              </div>
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


