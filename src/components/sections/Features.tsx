import { motion } from 'framer-motion';
import { 
  Play, 
  Bot, 
  Users, 
  Calendar, 
  LineChart, 
  MessageSquare 
} from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

const features = [
  {
    icon: Play,
    title: '78+ Video Lektionen',
    description: 'Von den Grundlagen bis zu fortgeschrittenen Strategien. Lerne in deinem Tempo.',
    color: 'primary',
  },
  {
    icon: Bot,
    title: 'Trading Bot inklusive',
    description: 'Unser KI-Bot arbeitet 24/7 für dich. 800%+ Rendite in den letzten 2 Jahren.',
    color: 'accent',
  },
  {
    icon: Users,
    title: 'Elite Community',
    description: 'Tausche dich mit 480+ gleichgesinnten Tradern aus. Gemeinsam stärker.',
    color: 'secondary',
  },
  {
    icon: Calendar,
    title: 'Wöchentliche Live-Calls',
    description: 'Jeden Donnerstag Q&A Session mit Saif. Stelle deine Fragen direkt.',
    color: 'primary',
  },
  {
    icon: LineChart,
    title: 'Trade Analyse Tool',
    description: 'Lade deine Charts hoch. Die KI analysiert dein Setup in Sekunden.',
    color: 'accent',
  },
  {
    icon: MessageSquare,
    title: 'Telegram Bot Assistent',
    description: '24/7 Antworten auf deine Fragen. Von Basics bis Strategie-Tipps.',
    color: 'secondary',
  },
];

const getColorClasses = (color: string) => {
  switch (color) {
    case 'accent':
      return {
        bg: 'bg-accent/10',
        text: 'text-accent',
        glow: 'group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)]',
      };
    case 'secondary':
      return {
        bg: 'bg-secondary/10',
        text: 'text-secondary',
        glow: 'group-hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)]',
      };
    default:
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
        glow: 'group-hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)]',
      };
  }
};

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="section-container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block glass rounded-full px-4 py-2 text-sm text-muted-foreground mb-6">
            Was du bekommst
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Alles was du brauchst.
            <br />
            <span className="text-gradient-primary">Nichts was du nicht brauchst.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Wir haben alle überflüssigen Features rausgeworfen. Was bleibt, ist das Wesentliche.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            
            return (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                custom={index}
              >
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`group glass glass-hover rounded-3xl p-8 h-full transition-shadow ${colors.glow}`}
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
