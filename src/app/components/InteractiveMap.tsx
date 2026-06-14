import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Landmark, PenLine, UserRound } from "lucide-react";
import { stops } from "../data/stopsData";

const pointStyles = {
  orange: "from-[#F08A24] to-[#B95A18] shadow-[#F08A24]/45",
  pink: "from-[#EC4F82] to-[#8B2F39] shadow-[#EC4F82]/45",
  teal: "from-[#23C7B8] to-[#137E7A] shadow-[#23C7B8]/45",
  blue: "from-[#31A8D8] to-[#215B91] shadow-[#31A8D8]/45",
};

const pointIcons = {
  museum: Landmark,
  pen: PenLine,
  book: BookOpen,
  person: UserRound,
};

const routeSegments = stops.slice(0, -1).map((stop, index) => ({
  id: `${stop.id}-${stops[index + 1].id}`,
  from: stop.mapPoint,
  to: stops[index + 1].mapPoint,
  delay: 0.9 + index * 7.2,
}));

const routeFootsteps = routeSegments.flatMap((segment, segmentIndex) => {
  const angle =
    (Math.atan2(segment.to.y - segment.from.y, segment.to.x - segment.from.x) * 180) / Math.PI;

  return [0.22, 0.44, 0.66, 0.84].map((progress, stepIndex) => {
    const side = stepIndex % 2 === 0 ? -0.34 : 0.34;
    const normal = angle + 90;
    const normalRad = (normal * Math.PI) / 180;

    return {
      id: `${segment.id}-${stepIndex}`,
      x: segment.from.x + (segment.to.x - segment.from.x) * progress + Math.cos(normalRad) * side,
      y: segment.from.y + (segment.to.y - segment.from.y) * progress + Math.sin(normalRad) * side,
      rotate: angle + (stepIndex % 2 === 0 ? -9 : 9),
      delay: segment.delay + 1.25 + stepIndex * 0.82,
    };
  });
});

const labelClasses: Record<number, string> = {
  1: "map-label-east",
  2: "map-label-north",
  3: "map-label-west",
  4: "map-label-south",
};

export function InteractiveMap() {
  return (
    <section className="museum-map mx-auto w-full" aria-label="Главная интерактивная карта маршрута">
      <div className="map-caption">
        <span>Маршрут</span>
        <strong>Биография - Сказки - Мини-лекторий - Образ русского мужика</strong>
      </div>

      <div className="map-surface">
        <img
          src="images/museum-map.webp"
          alt="Карта виртуальной экскурсии по музею М. Е. Салтыкова-Щедрина"
          className="map-image"
        />

        <div className="map-sepia-glow" />

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="map-route-svg pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {routeSegments.map((segment) => (
            <g key={segment.id}>
              <motion.line
                x1={segment.from.x}
                y1={segment.from.y}
                x2={segment.to.x}
                y2={segment.to.y}
                className="museum-route-shadow"
                strokeDasharray="2.2 3.8"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.62, 0.44] }}
                transition={{
                  duration: 7.6,
                  delay: segment.delay,
                  ease: "easeInOut",
                  times: [0, 0.68, 1],
                }}
              />
              <motion.line
                x1={segment.from.x}
                y1={segment.from.y}
                x2={segment.to.x}
                y2={segment.to.y}
                className="museum-route-trail"
                strokeDasharray="1 3.4"
                strokeDashoffset="0"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.72, 0.48] }}
                transition={{
                  duration: 7.9,
                  delay: segment.delay + 0.06,
                  ease: "easeInOut",
                  times: [0, 0.72, 1],
                }}
              />
              <motion.line
                x1={segment.from.x}
                y1={segment.from.y}
                x2={segment.to.x}
                y2={segment.to.y}
                className="museum-route-ink"
                strokeDasharray="2.1 3.8"
                initial={{ pathLength: 0, opacity: 0, strokeDashoffset: 21 }}
                animate={{ pathLength: 1, opacity: 0.95, strokeDashoffset: [21, 16, 12] }}
                transition={{
                  duration: 8.2,
                  delay: segment.delay + 0.35,
                  ease: "easeInOut",
                  strokeDashoffset: {
                    duration: 28,
                    delay: segment.delay + 0.35,
                    ease: "easeInOut",
                  },
                }}
              />
            </g>
          ))}

          {routeSegments.map((segment) => (
            <motion.circle
              key={`traveler-${segment.id}`}
              className="route-traveler-dot"
              r="0.56"
              initial={{ cx: segment.from.x, cy: segment.from.y, opacity: 0, scale: 0.72 }}
              animate={{
                cx: [segment.from.x, segment.from.x, segment.to.x, segment.to.x],
                cy: [segment.from.y, segment.from.y, segment.to.y, segment.to.y],
                opacity: [0, 0.88, 0.8, 0],
                scale: [0.72, 1, 0.92, 0.66],
              }}
              transition={{
                duration: 7.4,
                delay: segment.delay + 0.9,
                repeat: Infinity,
                repeatDelay: 18,
                ease: "easeInOut",
                times: [0, 0.15, 0.82, 1],
              }}
            />
          ))}

          {routeFootsteps.map((step) => (
            <motion.g
              key={step.id}
              className="route-footstep"
              initial={{ opacity: 0, scale: 0.74 }}
              animate={{ opacity: [0, 0.62, 0.34, 0.18], scale: [0.74, 1, 1, 0.96] }}
              transition={{
                duration: 6.8,
                delay: step.delay,
                repeat: Infinity,
                repeatDelay: 18,
                ease: "easeInOut",
                times: [0, 0.28, 0.72, 1],
              }}
              transform={`translate(${step.x} ${step.y}) rotate(${step.rotate})`}
            >
              <ellipse cx="-0.18" cy="-0.12" rx="0.22" ry="0.07" />
              <ellipse cx="0.2" cy="0.13" rx="0.22" ry="0.07" />
            </motion.g>
          ))}
        </svg>

        {stops.map((stop) => {
          const Icon = pointIcons[stop.mapPoint.icon];
          const labelAbove = stop.mapPoint.y > 62;
          const labelClass = labelClasses[stop.id] ?? "map-label-east";

          return (
            <motion.div
              key={stop.id}
              className="absolute z-10"
              style={{
                left: `${stop.mapPoint.x}%`,
                top: `${stop.mapPoint.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.42 + stop.id * 0.12, type: "spring", stiffness: 220, damping: 16 }}
            >
              <Link
                to={`/stop/${stop.id}`}
                aria-label={`Открыть остановку ${stop.id}: ${stop.shortTitle}`}
                className={`map-point group relative flex items-center justify-center ${stop.id === 1 ? "map-point-active" : ""}`}
              >
                <span className="map-pulse" />
                <span className="map-orbit" />
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-2xl transition duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-focus-visible:outline group-focus-visible:outline-4 group-focus-visible:outline-white sm:h-16 sm:w-16 ${pointStyles[stop.mapPoint.color]}`}
                >
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.6} />
                </span>
                <span className={`map-label ${labelClass}`}>
                  <span>Остановка {stop.id}</span>
                  {stop.shortTitle}
                </span>
                <span className={`map-tooltip ${labelAbove ? "bottom-full mb-3" : "top-full mt-3"}`}>
                  <span>Остановка {stop.id}</span>
                  {stop.shortTitle}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
