import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface CrosswordClue {
  id: number;
  number: number;
  clue: string;
  answer: string;
  direction: "across" | "down";
}

interface CrosswordProps {
  clues: CrosswordClue[];
  onComplete: () => void;
}

export function Crossword({ clues, onComplete }: CrosswordProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (clueId: number, value: string) => {
    if (!submitted) {
      setAnswers({ ...answers, [clueId]: value.toUpperCase() });
    }
  };

  const checkAnswer = (clueId: number): boolean => {
    const answer = answers[clueId]?.trim() || "";
    const clue = clues.find((c) => c.id === clueId);
    return answer === clue?.answer.toUpperCase();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = clues.every((c) => checkAnswer(c.id));
    if (allCorrect) {
      setTimeout(onComplete, 1500);
    }
  };

  const allAnswered = clues.every((c) => {
    const answer = answers[c.id];
    return answer && answer.trim().length > 0;
  });

  const acrossClues = clues.filter((c) => c.direction === "across");
  const downClues = clues.filter((c) => c.direction === "down");
  const allCorrect = submitted && clues.every((c) => checkAnswer(c.id));

  return (
    <div className="space-y-6">
      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
        <h3 className="text-xl font-serif text-[#3D2817] text-center mb-2">
          Интерактивный кроссворд
        </h3>
        <p className="text-sm text-[#6B5542] text-center">
          Заполните пустые клетки, используя подсказки
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* По горизонтали */}
        {acrossClues.length > 0 && (
          <div className="bg-white border-2 border-[#C9A961] rounded-lg p-6">
            <h4 className="font-serif text-lg text-[#8B2F39] mb-4 text-center">
              По горизонтали →
            </h4>
            <div className="space-y-4">
              {acrossClues.map((clue) => {
                const isCorrect = submitted && checkAnswer(clue.id);
                const isIncorrect = submitted && !checkAnswer(clue.id);

                return (
                  <div key={clue.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-serif font-bold text-[#8B2F39] min-w-[24px]">
                        {clue.number}.
                      </span>
                      <p className="text-sm font-serif text-[#3D2817]">{clue.clue}</p>
                    </div>
                    <div className="relative">
                      <Input
                        value={answers[clue.id] || ""}
                        onChange={(e) => handleAnswer(clue.id, e.target.value)}
                        disabled={submitted}
                        maxLength={clue.answer.length}
                        className={`font-serif uppercase text-center tracking-widest ${
                          isCorrect
                            ? "border-green-600 bg-green-50"
                            : isIncorrect
                            ? "border-red-600 bg-red-50"
                            : "border-[#C9A961]"
                        }`}
                        placeholder={`${clue.answer.length} букв`}
                      />
                      {submitted && isCorrect && (
                        <Check className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* По вертикали */}
        {downClues.length > 0 && (
          <div className="bg-white border-2 border-[#C9A961] rounded-lg p-6">
            <h4 className="font-serif text-lg text-[#8B2F39] mb-4 text-center">
              По вертикали ↓
            </h4>
            <div className="space-y-4">
              {downClues.map((clue) => {
                const isCorrect = submitted && checkAnswer(clue.id);
                const isIncorrect = submitted && !checkAnswer(clue.id);

                return (
                  <div key={clue.id} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-serif font-bold text-[#8B2F39] min-w-[24px]">
                        {clue.number}.
                      </span>
                      <p className="text-sm font-serif text-[#3D2817]">{clue.clue}</p>
                    </div>
                    <div className="relative">
                      <Input
                        value={answers[clue.id] || ""}
                        onChange={(e) => handleAnswer(clue.id, e.target.value)}
                        disabled={submitted}
                        maxLength={clue.answer.length}
                        className={`font-serif uppercase text-center tracking-widest ${
                          isCorrect
                            ? "border-green-600 bg-green-50"
                            : isIncorrect
                            ? "border-red-600 bg-red-50"
                            : "border-[#C9A961]"
                        }`}
                        placeholder={`${clue.answer.length} букв`}
                      />
                      {submitted && isCorrect && (
                        <Check className="w-5 h-5 text-green-600 absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-[#8B2F39] hover:bg-[#6B2329] text-white font-serif text-lg py-6"
        >
          Проверить кроссворд
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


