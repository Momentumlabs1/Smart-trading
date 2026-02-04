import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

declare global {
  interface Window {
    FUNNEL_EMBED_CONFIG?: {
      funnelId: string;
      type: string;
      position: string;
      autoOpen: boolean;
    };
    openFunnel?: () => void;
  }
}

export const VideoFunnel = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set config before loading script
    window.FUNNEL_EMBED_CONFIG = {
      funnelId: "smart-trading-v6",
      type: "widget",
      position: "bottom-right",
      autoOpen: false
    };

    // Check if script already loaded
    if (document.querySelector('script[src="https://vid-path-builder-65.lovable.app/embed.js"]')) {
      setIsLoaded(true);
      return;
    }

    // Load the embed script
    const script = document.createElement('script');
    script.src = 'https://vid-path-builder-65.lovable.app/embed.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleClick = () => {
    // Try to open the funnel widget
    if (window.openFunnel) {
      window.openFunnel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="justify-self-center lg:justify-self-start order-2 lg:order-1 lg:row-span-2"
    >
      <div 
        onClick={handleClick}
        className="relative w-[180px] lg:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden glass border border-border/50 group cursor-pointer hover:border-primary/50 transition-all duration-300"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
        
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
            Video starten
          </p>
          <span className="text-[10px] text-muted-foreground">
            {isLoaded ? 'Interaktiv' : 'Lädt...'}
          </span>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />

        {/* Hover Glow */}
        <motion.div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
