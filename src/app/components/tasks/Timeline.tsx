import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Check, X } from "lucide-react";
import { Button } from "../ui/button";

interface TimelineEvent {
  id: number;
  year: string;
  text: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  onComplete: () => void;
}

export function Timeline({ events, onComplete }: TimelineProps) {
  const [orderedEvents, setOrderedEvents] = useState<TimelineEvent[]>([...events].sort(() => Math.random() - 0.5));
  const [submitted, setSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newEvents = [...orderedEvents];
    const draggedEvent = newEvents[draggedItem];
    newEvents.splice(draggedItem, 1);
    newEvents.splice(index, 0, draggedEvent);

    setOrderedEvents(newEvents);
    setDraggedItem(index);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = orderedEvents.every((event, index) => event.id === events[index].id);
    if (isCorrect) {
      setTimeout(onComplete, 1500);
    }
  };

  const isCorrect = submitted && orderedEvents.every((event, index) => event.id === events[index].id);

  return (
    <div className="space-y-6">
      <div className="bg-[#F5EFE7] border-2 border-[#C9A961] rounded-lg p-6">
        <p className="text-[#3D2817] font-serif text-center mb-2">
          Расставьте события в хронологическом порядке
        </p>
        <p className="text-sm text-[#6B5542] text-center">
          Перетащите карточки, чтобы упорядочить их по годам
        </p>
      </div>

      <div className="space-y-3">
        {orderedEvents.map((event, index) => {
          const correctPosition = submitted && event.id === events[index].id;
          const incorrectPosition = submitted && event.id !== events[index].id;

          return (
            <motion.div
              key={event.id}
              draggable={!submitted}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              layout
              className={`bg-white border-2 rounded-lg p-4 shadow-md cursor-move ${
                correctPosition
                  ? "border-green-600 bg-green-50"
                  : incorrectPosition
                  ? "border-red-600 bg-red-50"
                  : "border-[#C9A961] hover:border-[#8B2F39] hover:shadow-lg"
              } ${!submitted ? "active:scale-95" : ""} transition-all`}
            >
              <div className="flex items-center gap-4">
                {!submitted && (
                  <GripVertical className="w-5 h-5 text-[#6B5542] flex-shrink-0" />
                )}

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#8B2F39] text-white px-4 py-1 rounded-full font-serif text-sm">
                      {event.year}
                    </div>
                    <p className="text-[#3D2817] font-serif">{event.text}</p>
                  </div>
                </div>

                {submitted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    {correctPosition ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {!submitted && (
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#8B2F39] hover:bg-[#6B2329] text-white font-serif text-lg py-6"
        >
          Проверить порядок
        </Button>
      )}

      {submitted && !isCorrect && (
        <div className="space-y-3 bg-yellow-50 border-2 border-yellow-600 rounded-lg p-4 text-center">
          <p className="text-yellow-800 font-serif">
            Попробуйте ещё раз! Проверьте хронологию событий.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-[#2C8C99] hover:bg-[#247580] text-white font-serif"
          >
            Вернуться к сортировке
          </Button>
        </div>
      )}
    </div>
  );
}


