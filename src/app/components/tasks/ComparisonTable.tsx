import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface TableRow {
  id: number;
  criterion: string;
  historicalAnswer: string;
  literaryAnswer: string;
}

interface ComparisonTableProps {
  rows: TableRow[];
  onComplete: () => void;
}

export function ComparisonTable({ rows, onComplete }: ComparisonTableProps) {
  const [answers, setAnswers] = useState<Record<number, { historical: string; literary: string }>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (rowId: number, column: "historical" | "literary", value: string) => {
    if (!submitted) {
      setAnswers({
        ...answers,
        [rowId]: {
          ...answers[rowId],
          [column]: value,
        },
      });
    }
  };

  const checkAnswer = (rowId: number, column: "historical" | "literary"): boolean => {
    const answer = answers[rowId]?.[column]?.toLowerCase().trim() || "";
    const row = rows.find((r) => r.id === rowId);
    if (!row) return false;

    const correctAnswer = column === "historical" ? row.historicalAnswer : row.literaryAnswer;
    const keywords = correctAnswer.toLowerCase().split(" ");

    return keywords.some((keyword) => answer.includes(keyword));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = rows.every(
      (row) => checkAnswer(row.id, "historical") && checkAnswer(row.id, "literary")
    );
    if (allCorrect) {
      setTimeout(onComplete, 2000);
    }
  };

  const allAnswered = rows.every((row) => {
    const rowAnswer = answers[row.id];
    return (
      rowAnswer &&
      rowAnswer.historical?.trim().length > 0 &&
      rowAnswer.literary?.trim().length > 0
    );
  });
  const allCorrect =
    submitted &&
    rows.every((row) => checkAnswer(row.id, "historical") && checkAnswer(row.id, "literary"));

  return (
    <div className="space-y-6">
      <div className="bg-[#8B2F39] text-white rounded-lg p-6">
        <h3 className="text-xl font-serif text-center mb-2">
          Сравнительная таблица
        </h3>
        <p className="text-sm text-center opacity-90">
          Сравните образ русского мужика XIX века и героя произведения
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-[#C9A961] p-4 rounded-lg text-center">
              <p className="font-serif font-bold text-[#3D2817]">Критерий сравнения</p>
            </div>
            <div className="bg-[#8B2F39] p-4 rounded-lg text-center">
              <p className="font-serif font-bold text-white">Исторический мужик XIX века</p>
            </div>
            <div className="bg-[#6B4423] p-4 rounded-lg text-center">
              <p className="font-serif font-bold text-white">Мужик в произведении</p>
            </div>
          </div>

          {/* Table Rows */}
          {rows.map((row, index) => {
            const historicalCorrect = submitted && checkAnswer(row.id, "historical");
            const historicalIncorrect = submitted && !checkAnswer(row.id, "historical");
            const literaryCorrect = submitted && checkAnswer(row.id, "literary");
            const literaryIncorrect = submitted && !checkAnswer(row.id, "literary");

            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 gap-3 mb-3"
              >
                {/* Criterion */}
                <div className="bg-[#F5EFE7] border-2 border-[#C9A961] p-4 rounded-lg flex items-center">
                  <p className="font-serif text-[#3D2817] font-semibold">{row.criterion}</p>
                </div>

                {/* Historical Answer */}
                <div className="relative">
                  <Input
                    value={answers[row.id]?.historical || ""}
                    onChange={(e) => handleAnswer(row.id, "historical", e.target.value)}
                    disabled={submitted}
                    placeholder="Впишите характеристику..."
                    className={`h-full font-serif ${
                      historicalCorrect
                        ? "border-green-600 bg-green-50"
                        : historicalIncorrect
                        ? "border-red-600 bg-red-50"
                        : "border-[#C9A961]"
                    }`}
                  />
                  {submitted && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {historicalCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>

                {/* Literary Answer */}
                <div className="relative">
                  <Input
                    value={answers[row.id]?.literary || ""}
                    onChange={(e) => handleAnswer(row.id, "literary", e.target.value)}
                    disabled={submitted}
                    placeholder="Впишите характеристику..."
                    className={`h-full font-serif ${
                      literaryCorrect
                        ? "border-green-600 bg-green-50"
                        : literaryIncorrect
                        ? "border-red-600 bg-red-50"
                        : "border-[#C9A961]"
                    }`}
                  />
                  {submitted && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {literaryCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {submitted && (
        <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
          <h4 className="font-serif font-bold text-[#3D2817] mb-4 text-center">
            Правильные ответы:
          </h4>
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.id} className="text-sm">
                <p className="font-serif font-semibold text-[#8B2F39] mb-1">
                  {row.criterion}:
                </p>
                <div className="grid md:grid-cols-2 gap-3 ml-4">
                  <p className="font-serif text-[#3D2817]">
                    <span className="text-[#6B5542]">XIX век:</span> {row.historicalAnswer}
                  </p>
                  <p className="font-serif text-[#3D2817]">
                    <span className="text-[#6B5542]">В произведении:</span> {row.literaryAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-[#8B2F39] hover:bg-[#6B2329] text-white font-serif text-lg py-6"
        >
          Проверить таблицу
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


