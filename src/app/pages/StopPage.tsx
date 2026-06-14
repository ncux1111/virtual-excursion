import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronDown } from "lucide-react";
import { MuseumBackdrop } from "../components/MuseumBackdrop";
import { VideoPlayer } from "../components/VideoPlayer";
import { TrueFalseQuiz } from "../components/tasks/TrueFalseQuiz";
import { Timeline } from "../components/tasks/Timeline";
import { MatchTerms } from "../components/tasks/MatchTerms";
import { ContinueThought } from "../components/tasks/ContinueThought";
import { QuickQuiz } from "../components/tasks/QuickQuiz";
import { Crossword } from "../components/tasks/Crossword";
import { OldWords } from "../components/tasks/OldWords";
import { ComprehensionQuestions } from "../components/tasks/ComprehensionQuestions";
import { ConceptsTask } from "../components/tasks/ConceptsTask";
import { ComparisonTable } from "../components/tasks/ComparisonTable";
import { getStopById, stops } from "../data/stopsData";
import {
  stop1TimelineEvents,
  stop1TrueFalseQuestions,
  stop2ContinueThought,
  stop2MatchTerms,
  stop2QuickQuiz,
  stop3Crossword,
  stop3LectureTerms,
  stop3OldWords,
  stop4ComparisonTable,
  stop4ComprehensionQuestions,
  stop4Concepts,
} from "../data/tasksData";

function readCompletedTasks(stopId: number) {
  try {
    const saved = localStorage.getItem(`stop${stopId}Tasks`);
    return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
  } catch {
    return new Set<number>();
  }
}

function addCompletedStop(stopId: number) {
  try {
    const completed = JSON.parse(localStorage.getItem("completedStops") || "[]") as number[];
    if (!completed.includes(stopId)) {
      localStorage.setItem("completedStops", JSON.stringify([...completed, stopId].sort((a, b) => a - b)));
    }
  } catch {
    localStorage.setItem("completedStops", JSON.stringify([stopId]));
  }
}

export default function StopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stopId = Number(id || "1");
  const stop = getStopById(stopId);
  const [expandedTask, setExpandedTask] = useState<number | null>(0);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCompletedTasks(readCompletedTasks(stopId));
    setExpandedTask(0);
  }, [stopId]);

  if (!stop) {
    return (
      <div className="museum-page flex min-h-screen items-center justify-center p-6 text-[#2E2116]">
        <MuseumBackdrop />
        <div className="archive-panel relative z-10 max-w-md p-8 text-center">
          <h1 className="mb-3 text-2xl font-bold">Остановка не найдена</h1>
          <p className="mb-6 text-[#6B4423]">В маршруте есть остановки с 1 по 4.</p>
          <button onClick={() => navigate("/route")} className="museum-button px-5 py-3">
            Вернуться к маршруту
          </button>
        </div>
      </div>
    );
  }

  const handleTaskComplete = (taskIndex: number) => {
    setCompletedTasks((current) => {
      const next = new Set(current);
      next.add(taskIndex);
      localStorage.setItem(`stop${stopId}Tasks`, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const renderTaskComponent = (taskIndex: number) => {
    const task = stop.tasks[taskIndex];

    switch (task.component) {
      case "TrueFalseQuiz":
        return <TrueFalseQuiz questions={stop1TrueFalseQuestions} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "Timeline":
        return <Timeline events={stop1TimelineEvents} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "MatchTerms":
        return (
          <MatchTerms
            terms={stopId === 3 ? stop3LectureTerms : stop2MatchTerms}
            onComplete={() => handleTaskComplete(taskIndex)}
          />
        );
      case "ContinueThought":
        return <ContinueThought questions={stop2ContinueThought} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "QuickQuiz":
        return <QuickQuiz questions={stop2QuickQuiz} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "Crossword":
        return <Crossword clues={stop3Crossword} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "OldWords":
        return <OldWords words={stop3OldWords} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "ComprehensionQuestions":
        return <ComprehensionQuestions questions={stop4ComprehensionQuestions} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "ConceptsTask":
        return <ConceptsTask concepts={stop4Concepts} onComplete={() => handleTaskComplete(taskIndex)} />;
      case "ComparisonTable":
        return <ComparisonTable rows={stop4ComparisonTable} onComplete={() => handleTaskComplete(taskIndex)} />;
      default:
        return <p className="text-[#6B4423]">Задание готовится.</p>;
    }
  };

  const allTasksCompleted = completedTasks.size === stop.tasks.length;
  const nextStop = stops.find((item) => item.id === stopId + 1);
  const progress = Math.round((completedTasks.size / stop.tasks.length) * 100);

  const handleContinue = () => {
    addCompletedStop(stopId);
    navigate(nextStop ? `/stop/${nextStop.id}` : "/final");
  };

  return (
    <div className="museum-page min-h-screen text-[#2E2116]">
      <MuseumBackdrop />
      <header className="museum-topbar sticky top-0 z-30 p-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button onClick={() => navigate("/route")} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/15">
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">К маршруту</span>
          </button>
          <div className="text-sm font-semibold md:text-base">Остановка {stopId} из {stops.length}</div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="archive-panel mb-6 p-6">
          <div className="section-kicker mb-2">Остановка {stopId}</div>
          <h1 className="mb-4 text-3xl font-bold md:text-5xl" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            {stop.title}
          </h1>
          <p className="text-lg leading-relaxed text-[#6B4423]">{stop.description}</p>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-6">
          <VideoPlayer stop={stop} />
        </motion.section>

        <section className="mb-6">
          <div className="archive-ribbon mb-4 p-4 text-white">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                Интерактивные задания
              </h2>
              <div className="text-sm font-semibold">{completedTasks.size} из {stop.tasks.length} выполнено</div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/25">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full bg-[#8FE3DD]" />
            </div>
          </div>

          <div className="space-y-4">
            {stop.tasks.map((task, index) => {
              const done = completedTasks.has(index);
              const expanded = expandedTask === index;

              return (
                <article key={task.name} className="archive-panel overflow-hidden">
                  <button
                    onClick={() => setExpandedTask(expanded ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-[#F5E5C8]/70"
                  >
                    <div className="flex items-center gap-4">
                      <span className="task-number flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold text-white">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-bold">{task.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {done && <CheckCircle2 className="h-6 w-6 text-[#1E9F9B]" />}
                      <ChevronDown className={`h-6 w-6 transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#D8B98D] bg-[#F7EBD5]/78 p-5">{renderTaskComponent(index)}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })}
          </div>
        </section>

        <motion.button
          onClick={handleContinue}
          disabled={!allTasksCompleted}
          whileHover={allTasksCompleted ? { y: -2 } : {}}
          whileTap={allTasksCompleted ? { scale: 0.98 } : {}}
          className={`w-full rounded-lg px-6 py-4 text-lg font-bold shadow-lg transition ${
            allTasksCompleted
              ? "museum-button"
              : "cursor-not-allowed bg-[#CBBCA6] text-[#6B5542]"
          }`}
        >
          {allTasksCompleted
            ? nextStop
              ? "Следующая остановка"
              : "Завершить экскурсию"
            : `Выполните все задания (${completedTasks.size}/${stop.tasks.length})`}
        </motion.button>
      </main>
    </div>
  );
}
