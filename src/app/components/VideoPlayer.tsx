import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Film, Play } from "lucide-react";
import type { Stop } from "../data/stopsData";

interface VideoPlayerProps {
  stop: Stop;
}

export function VideoPlayer({ stop }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
  }, [stop.video.src]);

  return (
    <div className="video-shell">
      <div className="video-heading">
        <div>
          <p className="section-kicker">Архивный зал {stop.id}</p>
          <h2>{stop.video.title}</h2>
        </div>
        <Film className="h-6 w-6 text-[#9FE7E2]" />
      </div>

      <div className="video-frame">
        {(!loaded || hasError) && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="video-loading"
          >
            <div className="video-play-mark">
              <Play className="h-8 w-8" />
            </div>
            <p>{hasError ? "Видео временно недоступно" : stop.shortTitle}</p>
            {hasError && <span>Файл можно заменить в public/videos</span>}
          </motion.div>
        )}

        {stop.video.kind === "youtube" ? (
          <motion.iframe
            key={stop.video.src}
            src={stop.video.src}
            title={stop.video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <motion.video
            key={stop.video.src}
            className="h-full w-full object-cover"
            src={stop.video.src}
            poster={stop.image}
            controls
            preload="metadata"
            onLoadedMetadata={() => setLoaded(true)}
            onLoadedData={() => setLoaded(true)}
            onError={() => {
              setHasError(true);
              setLoaded(false);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded && !hasError ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </div>
    </div>
  );
}
