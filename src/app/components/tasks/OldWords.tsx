import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";

interface OldWord {
  id: number;
  word: string;
  modernEquivalent: string;
  context?: string;
}

interface OldWordsProps {
  words: OldWord[];
  onComplete: () => void;
}

export function OldWords({ words, onComplete }: OldWordsProps) {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});

  const shuffledModern = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const allCorrect = submitted && words.every((word) => matches[word.id] === word.id);

  const handleWordClick = (wordId: number) => {
    if (submitted) return;
    setSelectedWord(wordId);
  };

  const handleModernClick = (modernId: number) => {
    if (submitted || selectedWord === null) return;
    setMatches({ ...matches, [selectedWord]: modernId });
    setSelectedWord(null);
  };

  const toggleHint = (wordId: number) => {
    setShowHints({ ...showHints, [wordId]: !showHints[wordId] });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = words.every((word) => matches[word.id] === word.id);
    if (allCorrect) {
      setTimeout(onComplete, 1500);
    }
  };

  const allMatched = words.every((word) => matches[word.id] !== undefined);

  return (
    <div className="space-y-6">
      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
        <h3 className="text-xl font-serif text-[#3D2817] text-center mb-2">
          Старинные слова в современном мире
        </h3>
        <p className="text-sm text-[#6B5542] text-center">
          Соедините устаревшие слова с современными эквивалентами
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Old Words Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-serif text-white text-center bg-[#8B2F39] py-2 rounded-lg">
            Старинные слова
          </h4>
          {words.map((word, index) => {
            const isSelected = selectedWord === word.id;
            const isMatched = matches[word.id] !== undefined;
            const isCorrect = submitted && matches[word.id] === word.id;
            const isIncorrect = submitted && matches[word.id] !== word.id;

            return (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <button
                  onClick={() => handleWordClick(word.id)}
                  disabled={submitted || isMatched}
                  className={`w-full p-4 border-2 rounded-lg font-serif text-left transition-all ${
                    isCorrect
                      ? "bg-green-50 border-green-600"
                      : isIncorrect
                      ? "bg-red-50 border-red-600"
                      : isSelected
                      ? "bg-[#8B2F39] text-white border-[#8B2F39] scale-105 shadow-lg"
                      : isMatched
                      ? "bg-[#D4B896] border-[#C9A961]"
                      : "bg-[#F5EFE7] border-[#C9A961] hover:border-[#8B2F39] hover:shadow-md"
                  } ${!submitted && !isMatched ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{word.word}</span>
                    <div className="flex items-center gap-2">
                      {word.context && !submitted && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHint(word.id);
                          }}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>
                      )}
                      {submitted && (
                        <>
                          {isCorrect ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {showHints[word.id] && word.context && !submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3"
                  >
                    <p className="text-sm text-yellow-800 italic font-serif">
                      💡 {word.context}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Modern Equivalents Column */}
        <div className="space-y-3">
          <h4 className="text-lg font-serif text-[#3D2817] text-center bg-[#D4B896] py-2 rounded-lg">
            Современные слова
          </h4>
          {shuffledModern.map((word, index) => {
            const isMatchedTo = Object.entries(matches).find(([_, modernId]) => modernId === word.id)?.[0];
            const isMatched = isMatchedTo !== undefined;

            return (
              <motion.button
                key={word.id}
                onClick={() => handleModernClick(word.id)}
                disabled={submitted || isMatched || selectedWord === null}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full p-4 border-2 rounded-lg font-serif text-left transition-all ${
                  isMatched
                    ? "bg-[#D4B896] border-[#C9A961]"
                    : selectedWord !== null
                    ? "bg-white border-[#C9A961] hover:border-[#8B2F39] hover:shadow-md cursor-pointer"
                    : "bg-gray-100 border-gray-300 cursor-not-allowed"
                }`}
              >
                <span className="text-lg">{word.modernEquivalent}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          disabled={!allMatched}
          className="w-full bg-[#8B2F39] hover:bg-[#6B2329] text-white font-serif text-lg py-6"
        >
          Проверить соответствия
        </Button>
      )}

      {submitted && !allCorrect && (
        <Button
          onClick={() => {
            setMatches({});
            setSelectedWord(null);
            setSubmitted(false);
          }}
          className="w-full bg-[#2C8C99] hover:bg-[#247580] text-white font-serif text-lg py-6"
        >
          Попробовать ещё раз
        </Button>
      )}
    </div>
  );
}


