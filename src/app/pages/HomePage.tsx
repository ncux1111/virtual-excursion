import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, MapPinned, Play } from "lucide-react";
import { InteractiveMap } from "../components/InteractiveMap";
import { MuseumBackdrop } from "../components/MuseumBackdrop";
import { stops, totalTasks } from "../data/stopsData";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="museum-page min-h-screen text-[#2E2116]">
      <MuseumBackdrop />

      <main className="relative z-10 mx-auto flex w-full max-w-[1540px] flex-col gap-8 px-3 py-5 sm:px-5 lg:px-6">
        <motion.header
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="grid gap-6 pt-2 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
        >
          <div className="space-y-6">
            <div className="glass-chip inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#704214]">
              <BookOpen className="h-4 w-4" />
              Музей М. Е. Салтыкова-Щедрина
            </div>

            <div className="space-y-4">
              <p className="section-kicker">Цифровой архивный маршрут</p>
              <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                Виртуальная экскурсия
              </h1>
              <p className="max-w-3xl text-xl leading-relaxed text-[#6B4423] md:text-2xl">
                По творчеству М. Е. Салтыкова-Щедрина: четыре музейные остановки, видео-залы, задания и карта, будто найденная среди рукописей XIX века.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                onClick={() => navigate("/route")}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="museum-button inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold"
              >
                <Play className="h-5 w-5" />
                Начать виртуальную экскурсию
              </motion.button>
              <motion.button
                onClick={() => document.getElementById("map")?.scrollIntoView({ behavior: "smooth", block: "center" })}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="paper-button inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold"
              >
                <MapPinned className="h-5 w-5" />
                Открыть карту
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, rotate: 1.5, y: 18 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            transition={{ delay: 0.22, duration: 0.7 }}
            className="archive-panel p-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-plate">
                <div className="text-3xl font-bold text-[#8B2F39]">4</div>
                <p>остановки маршрута</p>
              </div>
              <div className="stat-plate">
                <div className="text-3xl font-bold text-[#1E9F9B]">{totalTasks}</div>
                <p>интерактивных заданий</p>
              </div>
              <div className="stat-plate">
                <div className="text-3xl font-bold text-[#704214]">XIX</div>
                <p>век и сатира</p>
              </div>
              <div className="stat-plate">
                <div className="text-3xl font-bold text-[#2D7FA0]">4</div>
                <p>видео-зала</p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        <motion.div
          id="map"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.75 }}
          className="parallax-map -mx-1 sm:-mx-3 lg:-mx-8 xl:-mx-14 2xl:-mx-20"
        >
          <InteractiveMap />
        </motion.div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Остановки экскурсии">
          {stops.map((stop, index) => (
            <motion.button
              key={stop.id}
              onClick={() => navigate(`/stop/${stop.id}`)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + index * 0.08 }}
              className="archive-panel group p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(70,39,17,0.22)]"
            >
              <div className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-[#8B2F39]">
                Остановка {stop.id}
              </div>
              <h2 className="mb-2 text-xl font-bold transition group-hover:text-[#0B7E7A]" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
                {stop.shortTitle}
              </h2>
              <p className="text-sm leading-relaxed text-[#6B4423]">{stop.description}</p>
            </motion.button>
          ))}
        </section>
      </main>
    </div>
  );
}
