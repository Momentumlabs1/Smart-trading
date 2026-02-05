 import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
 import { Dialog, DialogContent } from '@/components/ui/dialog';

export const VideoFunnel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Kleiner Platzhalter im Hero */}
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.6, delay: 0.2 }}
         className="justify-self-center lg:justify-self-start order-2 lg:order-1 lg:row-span-2"
      >
        <div 
           onClick={() => setIsOpen(true)}
           className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden glass border border-border/50 group cursor-pointer hover:border-primary/50 transition-all duration-300"
         >
          {/* Mini-Iframe Preview */}
          <iframe
            src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
            className="absolute inset-0 w-full h-full pointer-events-none"
            title="Video Preview"
            loading="lazy"
          />
          
          {/* Dark Overlay für bessere Lesbarkeit */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
             <motion.div
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow"
             >
               <Play className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground ml-0.5" fill="currentColor" />
             </motion.div>
             <p className="text-xs lg:text-sm font-medium text-foreground text-center px-4">
              Jetzt ansehen
             </p>
           </div>

           {/* Corner Accents */}
           <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl-lg pointer-events-none" />
           <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr-lg pointer-events-none" />
           <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50 rounded-bl-lg pointer-events-none" />
           <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 rounded-br-lg pointer-events-none" />

          {/* Hover Glow */}
          <motion.div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
         </div>
       </motion.div>

      {/* Fullscreen Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 border-border/50 bg-background overflow-hidden">
           {isOpen && (
             <iframe
               src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
               className="w-full h-full rounded-lg"
               allow="camera; microphone; autoplay"
               title="Smart Trading Video Funnel"
             />
           )}
         </DialogContent>
      </Dialog>
    </>
  );
};
