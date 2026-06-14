import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";

interface Term {
  id: number;
  term: string;
  definition: string;
}

interface MatchTermsProps {
  terms: Term[];
  onComplete: () => void;
}

export function MatchTerms({ terms, onComplete }: MatchTermsProps) {
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);

  const shuffledDefinitions = useMemo(() => [...terms].sort(() => Math.random() - 0.5), [terms]);
  const allCorrect = submitted && terms.every((term) => matches[term.id] === term.id);

  const handleTermClick = (termId: number) => {
    if (submitted) return;
    setSelectedTerm(termId);
  };

  const handleDefinitionClick = (definitionId: number) => {
    if (submitted || selectedTerm === null) return;
    setMatches({ ...matches, [selectedTerm]: definitionId });
    setSelectedTerm(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const allCorrect = terms.every((term) => matches[term.id] === term.id);
    if (allCorrect) {
      setTimeout(onComplete, 1500);
    }
  };

  const allMatched = terms.every((term) => matches[term.id] !== undefined);

  return (
    <div className="space-y-6">
      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
        <p className="text-[#3D2817] font-serif text-center">
          Соедините термины с их определениями
        </p>
        <p className="text-sm text-[#6B5542] text-center mt-2">
          Нажмите на термин, затем на соответствующее определение
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Terms Column */}
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-[#3D2817] text-center mb-3 bg-[#8B2F39] text-white py-2 rounded-lg">
            Термины
          </h3>
          {terms.map((term, index) => {
            const isSelected = selectedTerm === term.id;
            const isMatched = matches[term.id] !== undefined;
            const isCorrect = submitted && matches[term.id] === term.id;
            const isIncorrect = submitted && matches[term.id] !== term.id;

            return (
              <motion.button
                key={term.id}
                onClick={() => handleTermClick(term.id)}
                disabled={submitted || isMatched}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full p-4 border-2 rounded-lg font-serif text-left transition-all ${
                  isCorrect
                    ? "bg-green-50 border-green-600"
                    : isIncorrect
                    ? "bg-red-50 border-red-600"
                    : isSelected
                    ? "bg-[#8B2F39] text-white border-[#8B2F39] scale-105 shadow-lg"
                    : isMatched
                    ? "bg-[#D4B896] border-[#C9A961]"
                    : "bg-white border-[#C9A961] hover:border-[#8B2F39] hover:shadow-md"
                } ${!submitted && !isMatched ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div className="flex items-center justify-between">
                  <span>{term.term}</span>
                  {submitted && (
                    <span>
                      {isCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Definitions Column */}
        <div className="space-y-3">
          <h3 className="text-lg font-serif text-[#3D2817] text-center mb-3 bg-[#C9A961] text-[#3D2817] py-2 rounded-lg">
            Определения
          </h3>
          {shuffledDefinitions.map((term, index) => {
            const isMatchedTo = Object.entries(matches).find(([_, defId]) => defId === term.id)?.[0];
            const isMatched = isMatchedTo !== undefined;

            return (
              <motion.button
                key={term.id}
                onClick={() => handleDefinitionClick(term.id)}
                disabled={submitted || isMatched || selectedTerm === null}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full p-4 border-2 rounded-lg text-sm font-serif text-left transition-all ${
                  isMatched
                    ? "bg-[#D4B896] border-[#C9A961]"
                    : selectedTerm !== null
                    ? "bg-white border-[#C9A961] hover:border-[#8B2F39] hover:shadow-md cursor-pointer"
                    : "bg-gray-100 border-gray-300 cursor-not-allowed"
                }`}
              >
                {term.definition}
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
            setSelectedTerm(null);
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


