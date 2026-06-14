import { motion } from "framer-motion";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 23) % 100}%`,
  delay: index * 0.35,
  duration: 9 + (index % 6),
}));

const decorLayers = [
  { className: "museum-page-stack stack-left", y: [0, -12, 0], rotate: [-8, -6, -8], duration: 14 },
  { className: "museum-page-stack stack-right", y: [0, 10, 0], rotate: [9, 7, 9], duration: 16 },
  { className: "museum-feather feather-left", y: [0, -16, 0], rotate: [-18, -14, -18], duration: 18 },
  { className: "museum-feather feather-right", y: [0, 14, 0], rotate: [17, 21, 17], duration: 19 },
  { className: "museum-inkwell inkwell-left", y: [0, -8, 0], rotate: [-4, -2, -4], duration: 15 },
  { className: "museum-ornament ornament-right", y: [0, 12, 0], rotate: [0, 1.6, 0], duration: 21 },
];

export function MuseumBackdrop() {
  return (
    <div className="museum-backdrop" aria-hidden="true">
      <div className="museum-vignette" />
      <div className="museum-manuscript manuscript-a" />
      <div className="museum-manuscript manuscript-b" />
      {decorLayers.map((layer) => (
        <motion.div
          key={layer.className}
          className={layer.className}
          animate={{ y: layer.y, rotate: layer.rotate }}
          transition={{ duration: layer.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="museum-particle"
          style={{ left: particle.left, top: particle.top }}
          animate={{ opacity: [0.08, 0.32, 0.08], y: [0, -24, 0], x: [0, 8, -4, 0] }}
          transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
