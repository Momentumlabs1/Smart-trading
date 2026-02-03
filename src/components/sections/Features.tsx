import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Bot, 
  Users, 
  Calendar, 
  LineChart, 
  MessageSquare,
  ChevronRight,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

interface Feature {
  icon: typeof Play;
  title: string;
  description: string;
  demo?: React.ReactNode;
}

// Mini demo components
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

const BotDemo = () => {
  const [value, setValue] = useState(0);
  
  return (
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
};

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
    description: 'Von den Grundlagen bis zu fortgeschrittenen Strategien. Lerne in deinem Tempo.',
    demo: <VideoLessonDemo />,
  },
  {
    icon: Bot,
    title: 'Trading Bot inklusive',
    description: 'Unser KI-Bot arbeitet 24/7 für dich. 800%+ Rendite in den letzten 2 Jahren.',
    demo: <BotDemo />,
  },
  {
    icon: Users,
    title: 'Elite Community',
    description: 'Tausche dich mit 480+ gleichgesinnten Tradern aus. Gemeinsam stärker.',
    demo: <CommunityDemo />,
  },
  {
    icon: Calendar,
    title: 'Wöchentliche Live-Calls',
    description: 'Jeden Donnerstag Q&A Session mit Saif. Stelle deine Fragen direkt.',
    demo: <LiveCallDemo />,
  },
  {
    icon: LineChart,
    title: 'Trade Analyse Tool',
    description: 'Lade deine Charts hoch. Die KI analysiert dein Setup in Sekunden.',
    demo: <ChartAnalysisDemo />,
  },
  {
    icon: MessageSquare,
    title: 'Telegram Bot Assistent',
    description: '24/7 Antworten auf deine Fragen. Von Basics bis Strategie-Tipps.',
    demo: <TelegramBotDemo />,
  },
];

export const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Was du bekommst</span>
          </motion.div>
          
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Alles was du brauchst.
            <br />
            <span className="text-gradient-primary">Nichts was du nicht brauchst.</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir haben alle überflüssigen Features rausgeworfen. Was bleibt, ist das Wesentliche.
          </p>
        </motion.div>

        {/* Interactive Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative group"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass rounded-3xl p-8 h-full cursor-pointer overflow-hidden"
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Icon */}
                <div className="relative z-10 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    {feature.title}
                    <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Interactive Demo */}
                  <AnimatePresence>
                    {hoveredIndex === index && feature.demo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 border-t border-border"
                      >
                        {feature.demo}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
