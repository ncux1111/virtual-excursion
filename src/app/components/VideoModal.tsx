import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string;
}

export function VideoModal({ isOpen, onClose, title, videoUrl }: VideoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-[#E8DCC4] border-2 border-[#6B4423]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-[#3D2817] flex items-center justify-between">
            <span>{title}</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#D4B896] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-video w-full bg-black rounded-md overflow-hidden"
        >
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

