import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Type declarations für embed.js
interface FunnelConfig {
  funnelId: string;
  type: 'widget' | 'modal' | 'inline' | 'fullscreen';
  container?: string;
  height?: string;
  position?: string;
  autoOpen?: boolean;
}

declare global {
  interface Window {
    FunnelEmbed?: {
      init: (config: FunnelConfig) => void;
      open: () => void;
      close: () => void;
    };
    FUNNEL_EMBED_CONFIG?: FunnelConfig;
  }
}

export const VideoFunnel = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Inline-Embed initialisieren wenn Script geladen
    const initFunnel = () => {
      if (window.FunnelEmbed) {
        window.FunnelEmbed.init({
          funnelId: "smart-trading-v6",
          type: "inline",
          container: "funnel-preview"
        });
      }
    };

    // Script könnte schon geladen sein oder noch laden
    if (window.FunnelEmbed) {
      initFunnel();
    } else {
      // Warten bis Script geladen ist
      const checkInterval = setInterval(() => {
        if (window.FunnelEmbed) {
          initFunnel();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup nach 10 Sekunden falls Script nie lädt
      setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // Auf Funnel-Start hören (CustomEvent)
    const handleFunnelEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.funnelId === "smart-trading-v6") {
        setIsOpen(true);
      }
    };

    // Auch postMessage abfangen (Cross-Origin)
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'funnel_started') {
        setIsOpen(true);
      }
    };

    window.addEventListener('funnel_started', handleFunnelEvent);
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('funnel_started', handleFunnelEvent);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <>
      {/* Preview-Tile mit Live-Funnel (inline iFrame) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="justify-self-center lg:justify-self-start order-2 lg:order-1 lg:row-span-2"
      >
        <div className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden glass border border-border/50 hover:border-primary/50 transition-all duration-300">
          {/* Inline-Funnel Container - hier rendert embed.js den iFrame */}
          <div 
            id="funnel-preview" 
            className="absolute inset-0 w-full h-full"
          />

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
