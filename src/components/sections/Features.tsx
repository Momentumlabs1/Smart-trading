import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Play, 
  Bot, 
  Users, 
  Calendar, 
  LineChart, 
  MessageSquare,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface Feature {
  icon: typeof Play;
  title: string;
  description: string;
  demo?: React.ReactNode;
}

// Mini demo components - simplified for mobile
const VideoLessonDemo = () => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="w-full bg-muted rounded-full h-1">
        <motion.div 
          className="bg-primary h-1 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '65%' }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>
      <span>65%</span>
    </div>
    <div className="grid grid-cols-4 gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i }}
          className={`aspect-video rounded ${i <= 5 ? 'bg-primary/30' : 'bg-muted/50'}`}
        />
      ))}
    </div>
  </div>
);

const BotDemo = () => (
  <div className="flex items-end gap-1 h-12">
    {[40, 45, 35, 60, 55, 70, 65, 85, 80, 95].map((height, i) => (
      <motion.div
        key={i}
        className="flex-1 bg-primary/20 rounded-t relative overflow-hidden"
        style={{ height: `${height}%` }}
        initial={{ height: 0 }}
        animate={{ height: `${height}%` }}
        transition={{ delay: 0.1 * i, duration: 0.4 }}
      >
        <motion.div
          className="absolute inset-0 bg-primary"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          transition={{ delay: 0.1 * i + 0.2, duration: 0.4 }}
        />
      </motion.div>
    ))}
  </div>
);

const CommunityDemo = () => (
  <div className="flex items-center justify-center gap-1">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 * i }}
        className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-green-500"
        />
      </motion.div>
    ))}
    <span className="text-xs text-green-500 ml-2">Live</span>
  </div>
);

const LiveCallDemo = () => (
  <div className="relative">
    <div className="flex items-center gap-2">
      <motion.div 
        className="w-8 h-8 rounded-full bg-primary/30"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div className="flex-1">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute -top-1 -right-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full"
    >
      LIVE
    </motion.div>
  </div>
);

const ChartAnalysisDemo = () => (
  <svg viewBox="0 0 100 40" className="w-full h-10">
    <motion.path
      d="M 0 35 L 15 30 L 30 32 L 45 20 L 60 25 L 75 15 L 100 10"
      fill="none"
      stroke="hsl(45 93% 58%)"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5 }}
    />
    <motion.circle
      cx="100"
      cy="10"
      r="3"
      fill="hsl(45 93% 58%)"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ delay: 1.5, duration: 0.3 }}
    />
  </svg>
);

const TelegramBotDemo = () => (
  <div className="space-y-1.5">
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-lg rounded-bl-none px-2 py-1 text-[10px] inline-block"
    >
      Was ist ein Stop Loss?
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-primary/20 rounded-lg rounded-br-none px-2 py-1 text-[10px] text-right ml-auto inline-block"
    >
      Ein Stop Loss ist eine Order...
    </motion.div>
  </div>
);

const features: Feature[] = [
  {
    icon: Play,
    title: '78+ Video Lektionen',
    description: 'Von den Grundlagen bis zu fortgeschrittenen Strategien.',
    demo: <VideoLessonDemo />,
  },
  {
    icon: Bot,
    title: 'Trading Bot inklusive',
    description: 'Unser KI-Bot arbeitet 24/7 für dich.',
    demo: <BotDemo />,
  },
  {
    icon: Users,
    title: 'Elite Community',
    description: 'Tausche dich mit 480+ Tradern aus.',
    demo: <CommunityDemo />,
  },
  {
    icon: Calendar,
    title: 'Wöchentliche Live-Calls',
    description: 'Jeden Donnerstag Q&A mit Saif.',
    demo: <LiveCallDemo />,
  },
  {
    icon: LineChart,
    title: 'Trade Analyse Tool',
    description: 'KI analysiert dein Setup in Sekunden.',
    demo: <ChartAnalysisDemo />,
  },
  {
    icon: MessageSquare,
    title: 'Telegram Bot Assistent',
    description: '24/7 Antworten auf deine Fragen.',
    demo: <TelegramBotDemo />,
  },
];

// Feature Card with scroll-triggered animation
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });
  const [showDemo, setShowDemo] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 30,
      }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onViewportEnter={() => setShowDemo(true)}
      onViewportLeave={() => setShowDemo(false)}
      className="relative group"
    >
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 h-full cursor-pointer overflow-hidden"
      >
        {/* Glow effect */}
        <motion.div
          animate={{ opacity: isInView ? 0.5 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Icon */}
        <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
          <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3 flex items-center gap-2">
            {feature.title}
            <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
            {feature.description}
          </p>

          {/* Demo - visible on mobile when in view, on desktop on hover */}
          <AnimatePresence>
            {(showDemo || isInView) && feature.demo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-3 sm:pt-4 border-t border-border"
              >
                {feature.demo}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </motion.div>
    </motion.div>
  );
};

export const Features = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { amount: 0.3, once: false });

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isHeaderInView ? 1 : 0,
            y: isHeaderInView ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.div
            animate={{
              scale: isHeaderInView ? 1 : 0.9,
              opacity: isHeaderInView ? 1 : 0,
            }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground">Was du bekommst</span>
          </motion.div>
          
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-2">
            Alles was du brauchst.
            <br />
            <span className="text-gradient-primary">Nichts was du nicht brauchst.</span>
          </h2>
          
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Wir haben alle überflüssigen Features rausgeworfen. Was bleibt, ist das Wesentliche.
          </p>
        </motion.div>

        {/* Features Grid - 1 column on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};