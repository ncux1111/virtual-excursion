import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, Home, Video } from "lucide-react";
import { MuseumBackdrop } from "../components/MuseumBackdrop";
import { stops } from "../data/stopsData";

function readCompletedStops() {
  try {
    const saved = localStorage.getItem("completedStops");
    return saved ? (JSON.parse(saved) as number[]) : [];
  } catch {
    return [];
  }
}

export default function RoutePage() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    setCompleted(readCompletedStops());
  }, []);

  const progress = Math.round((completed.length / stops.length) * 100);

  return (
    <div className="museum-page min-h-screen text-[#2E2116]">
      <MuseumBackdrop />
      <header className="museum-topbar sticky top-0 z-30 p-4 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 transition hover:bg-white/15">
            <Home className="h-5 w-5" />
            <span className="hidden sm:inline">На главную</span>
          </button>
          <h1 className="text-center text-xl font-bold md:text-2xl" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            Маршрут виртуальной экскурсии
          </h1>
          <div className="w-11 sm:w-32" />
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="archive-panel mb-8 p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="section-kicker mb-2">Лист прохождения</p>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                Прогресс маршрута
              </h2>
              <p className="text-sm text-[#6B4423]">Остановки отмечаются после выполнения всех заданий.</p>
            </div>
            <div className="glass-chip px-4 py-2 text-sm font-bold text-[#704214]">
              {completed.length} из {stops.length} остановок
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#D7BE9C]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-[#1E9F9B] to-[#2D7FA0]"
            />
          </div>
        </motion.section>

        <section className="grid gap-5 md:grid-cols-2" aria-label="Список остановок">
          {stops.map((stop, index) => {
            const isCompleted = completed.includes(stop.id);

            return (
              <motion.article
                key={stop.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="archive-panel overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(70,39,17,0.22)]"
              >
                <div className="archive-ribbon p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-1 text-sm opacity-85">Остановка {stop.id}</div>
                      <h2 className="text-xl font-bold" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                        {stop.title}
                      </h2>
                    </div>
                    {isCompleted && <CheckCircle2 className="h-7 w-7 flex-shrink-0 text-[#8FE3DD]" />}
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <p className="leading-relaxed text-[#6B4423]">{stop.description}</p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="archive-mini">
                      <Video className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#704214]" />
                      <div>
                        <div className="font-semibold">Видео-зал</div>
                        <div className="text-xs text-[#6B4423]">{stop.video.fileName}</div>
                      </div>
                    </div>
                    <div className="archive-mini">
                      <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#1E9F9B]" />
                      <div>
                        <div className="font-semibold">Задания</div>
                        <div className="text-xs text-[#6B4423]">{stop.tasks.length} интерактива</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/stop/${stop.id}`)}
                    className="museum-button inline-flex w-full items-center justify-center gap-2 px-5 py-3 font-bold"
                  >
                    Открыть остановку
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
