import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Award, Home, RotateCcw } from "lucide-react";
import { MuseumBackdrop } from "../components/MuseumBackdrop";
import { stops, totalTasks } from "../data/stopsData";

export default function FinalPage() {
  const navigate = useNavigate();

  const handleRestart = () => {
    localStorage.removeItem("completedStops");
    stops.forEach((stop) => localStorage.removeItem(`stop${stop.id}Tasks`));
    navigate("/");
  };

  return (
    <div className="museum-page flex min-h-screen items-center justify-center p-4 text-[#2E2116]">
      <MuseumBackdrop />
      <motion.main initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="archive-panel relative z-10 w-full max-w-3xl overflow-hidden">
        <section className="archive-ribbon p-8 text-center text-white md:p-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.18, type: "spring" }}>
            <Award className="mx-auto mb-4 h-20 w-20 md:h-24 md:w-24" />
          </motion.div>
          <h1 className="mb-4 text-4xl font-bold md:text-5xl" style={{ fontFamily: "Playfair Display, Georgia, serif" }}>
            Экскурсия завершена!
          </h1>
          <p className="mx-auto max-w-2xl text-white/88">
            Вы прошли маршрут по творчеству М. Е. Салтыкова-Щедрина, открыли четыре зала и собрали собственную архивную карту впечатлений.
          </p>
        </section>

        <section className="space-y-8 p-6 md:p-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { value: String(stops.length), title: "остановки" },
              { value: String(totalTasks), title: "заданий" },
              { value: "4", title: "видео-зала" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + index * 0.08 }}
                className="stat-plate text-center"
              >
                <div className="text-3xl font-bold text-[#8B2F39]">{item.value}</div>
                <p>{item.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => navigate("/")} className="museum-button inline-flex items-center justify-center gap-2 px-5 py-4 font-bold">
              <Home className="h-5 w-5" />
              На главную
            </button>
            <button onClick={handleRestart} className="paper-button inline-flex items-center justify-center gap-2 px-5 py-4 font-bold">
              <RotateCcw className="h-5 w-5" />
              Пройти ещё раз
            </button>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
