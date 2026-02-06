import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Play } from 'lucide-react';
import saifTrading from '@/assets/saif-trading.webp';

export const VideoFunnel = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Preview-Tile mit Thumbnail + Play Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="justify-self-center lg:justify-self-start order-2 lg:order-1 lg:row-span-2"
      >
        <div 
          onClick={() => setIsOpen(true)}
          className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden glass border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
        >
          {/* Thumbnail */}
          <img 
            src={saifTrading} 
            alt="Video Preview" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50 transition-opacity duration-300 group-hover:opacity-80" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Pulsing Ring */}
              <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
              {/* Button */}
              <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
                <Play className="w-6 h-6 lg:w-7 lg:h-7 text-primary-foreground fill-current ml-1" />
              </div>
            </div>
            <span className="mt-3 text-xs lg:text-sm font-medium text-white/90 tracking-wide">
              Jetzt ansehen
            </span>
          </div>

          {/* Corner Accents (Deko) */}
          <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl-lg pointer-events-none z-10" />
          <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr-lg pointer-events-none z-10" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50 rounded-bl-lg pointer-events-none z-10" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 rounded-br-lg pointer-events-none z-10" />
        </div>
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
