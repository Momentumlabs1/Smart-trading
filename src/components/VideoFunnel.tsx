import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import saifThumb from '@/assets/saif-phone.webp';

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
        <motion.div
          onClick={() => setIsOpen(true)}
          className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden glass border border-border/50 group cursor-pointer hover:border-primary/50 transition-all duration-300"
        >
          {/* Fallback Thumbnail (immer da, auch als Fallback für langsamen iframe) */}
          <img
            src={saifThumb}
            alt="Video Vorschau"
            className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
          />

          {/* DESKTOP: Live-iframe Preview (über dem Thumbnail) */}
          <div className="hidden lg:block absolute inset-0 overflow-hidden rounded-2xl">
            <iframe
              src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
              className="absolute inset-0 w-full h-full pointer-events-none scale-[1.2] -translate-y-[10%]"
              title="Video Preview"
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          {/* Dark Overlay für bessere Lesbarkeit des Play-Buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {/* Pulsing ring behind button */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: '100%', height: '100%' }}
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/40 group-hover:shadow-primary/60 transition-all duration-300 border-2 border-primary-foreground/20"
              >
                <Play className="w-6 h-6 lg:w-7 lg:h-7 text-primary-foreground ml-1" fill="currentColor" />
              </motion.div>
            </div>
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
         </motion.div>
       </motion.div>

      {/* Fullscreen Modal with Zoom Animation */}
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-0 z-50 bg-black/80"
                />
              </DialogPrimitive.Overlay>

              {/* Fullscreen centering wrapper */}
              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="relative w-[95vw] max-w-[1100px] h-[90vh] max-h-[90vh] border border-border/50 bg-background rounded-2xl overflow-hidden shadow-2xl">
                    <iframe
                      src="https://vid-path-builder-65.lovable.app/embed/smart-trading-v6"
                      className="w-full h-full"
                      allow="camera; microphone; autoplay; fullscreen"
                      allowFullScreen
                      loading="eager"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Smart Trading Video Funnel"
                    />
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full w-12 h-12 bg-background/90 backdrop-blur-md flex items-center justify-center hover:bg-background transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10 border border-border/50 shadow-lg">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        )}
      </AnimatePresence>
      </>
  );
};
