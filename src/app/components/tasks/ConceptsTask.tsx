import { useState } from "react";
import { motion } from "framer-motion";
import { Check, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Concept {
  id: number;
  title: string;
  description: string;
  question: string;
  keywords: string[];
}

interface ConceptsTaskProps {
  concepts: Concept[];
  onComplete: () => void;
}

export function ConceptsTask({ concepts, onComplete }: ConceptsTaskProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedConcept, setExpandedConcept] = useState<number | null>(null);

  const handleAnswer = (conceptId: number, value: string) => {
    if (!submitted) {
      setAnswers({ ...answers, [conceptId]: value });
    }
  };

  const checkAnswer = (conceptId: number): boolean => {
    const answer = answers[conceptId]?.toLowerCase() || "";
    const concept = concepts.find((c) => c.id === conceptId);
    if (!concept) return false;

    const matchedKeywords = concept.keywords.filter((keyword) =>
      answer.includes(keyword.toLowerCase())
    );

    return matchedKeywords.length >= Math.ceil(concept.keywords.length / 2);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = concepts.every((c) => checkAnswer(c.id));
    if (allCorrect) {
      setTimeout(onComplete, 2000);
    }
  };

  const allAnswered = concepts.every((c) => {
    const answer = answers[c.id];
    return answer && answer.trim().length > 10;
  });
  const allCorrect = submitted && concepts.every((c) => checkAnswer(c.id));

  return (
    <div className="space-y-6">
      <div className="bg-[#8B2F39] text-white rounded-lg p-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookOpen className="w-6 h-6" />
          <h3 className="text-xl font-serif text-center">
            Работа с понятиями
          </h3>
        </div>
        <p className="text-sm text-center opacity-90">
          Изучите определения и ответьте на вопросы
        </p>
      </div>

      {concepts.map((concept, index) => {
        const isCorrect = submitted && checkAnswer(concept.id);
        const isIncorrect = submitted && !checkAnswer(concept.id);
        const isExpanded = expandedConcept === concept.id;

        return (
          <motion.div
            key={concept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border-2 rounded-lg overflow-hidden ${
              isCorrect
                ? "border-green-600"
                : isIncorrect
                ? "border-red-600"
                : "border-[#C9A961]"
            }`}
          >
            {/* Concept Header */}
            <button
              onClick={() => setExpandedConcept(isExpanded ? null : concept.id)}
              className="w-full bg-[#F5EFE7] p-5 text-left hover:bg-[#E8DCC4] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#8B2F39] text-white rounded-full flex items-center justify-center font-serif text-lg flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-serif text-[#3D2817] font-bold">
                    {concept.title}
                  </h4>
                  <p className="text-sm text-[#6B5542] mt-1">
                    Нажмите, чтобы {isExpanded ? "скрыть" : "прочитать"} определение
                  </p>
                </div>
                {submitted && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-red-600" />
                    )}
                  </div>
                )}
              </div>
            </button>

            {/* Concept Definition */}
            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              className="overflow-hidden"
            >
              <div className="bg-white border-t-2 border-[#C9A961] p-5">
                <p className="text-[#3D2817] font-serif leading-relaxed mb-4">
                  {concept.description}
                </p>
              </div>
            </motion.div>

            {/* Question and Answer */}
            <div className={`p-5 ${isCorrect ? "bg-green-50" : isIncorrect ? "bg-red-50" : "bg-white"}`}>
              <p className="text-[#3D2817] font-serif mb-3 font-semibold">
                {concept.question}
              </p>

              <Textarea
                value={answers[concept.id] || ""}
                onChange={(e) => handleAnswer(concept.id, e.target.value)}
                disabled={submitted}
                placeholder="Ваш ответ..."
                className={`min-h-[100px] font-serif ${
                  isCorrect
                    ? "border-green-600"
                    : isIncorrect
                    ? "border-red-600"
                    : "border-[#C9A961]"
                } focus:border-[#8B2F39] disabled:bg-gray-100`}
              />

              {submitted && isIncorrect && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 text-sm text-red-700 font-serif"
                >
                  Попробуйте использовать ключевые понятия из определения
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


