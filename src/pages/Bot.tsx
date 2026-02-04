import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, TrendingUp, TrendingDown, Shield, Clock, Bot, 
  MessageSquare, Camera, Bell, CheckCircle2, Zap, LineChart,
  DollarSign, Percent, Activity, Play, Star, Users, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import saifTrading from '@/assets/saif-trading.webp';
import saifDesk from '@/assets/saif-desk.webp';
import saifPhone from '@/assets/saif-phone.webp';

// Real performance data based on the provided stats (3 months: Nov 17 - Feb 4)
const yieldData = [
  { date: '17 Nov', yield: 2.1 },
  { date: '25 Nov', yield: 3.8 },
  { date: '3 Dec', yield: 5.2 },
  { date: '10 Dec', yield: 6.1 },
  { date: '17 Dec', yield: 7.4 },
  { date: '24 Dec', yield: 8.8 },
  { date: '2 Jan', yield: 9.5 },
  { date: '9 Jan', yield: 10.2 },
  { date: '15 Jan', yield: 11.8 },
  { date: '22 Jan', yield: 12.4 },
  { date: '29 Jan', yield: 13.1 },
  { date: '4 Feb', yield: 14.2 },
];

const profitData = [
  { date: '17 Nov', profit: 5 },
  { date: '25 Nov', profit: 18 },
  { date: '3 Dec', profit: 35 },
  { date: '10 Dec', profit: 48 },
  { date: '17 Dec', profit: 62 },
  { date: '24 Dec', profit: 78 },
  { date: '2 Jan', profit: 88 },
  { date: '9 Jan', profit: 98 },
  { date: '15 Jan', profit: 115 },
  { date: '22 Jan', profit: 128 },
  { date: '29 Jan', profit: 142 },
  { date: '4 Feb', profit: 156 },
];

const balanceData = [
  { date: '13 Nov', balance: 1200, equity: 1200 },
  { date: '26 Nov', balance: 1220, equity: 1225 },
  { date: '1 Dec', balance: 1235, equity: 1240 },
  { date: '8 Dec', balance: 1255, equity: 1260 },
  { date: '15 Dec', balance: 1270, equity: 1265 },
  { date: '22 Dec', balance: 1285, equity: 1290 },
  { date: '30 Dec', balance: 1300, equity: 1305 },
  { date: '7 Jan', balance: 1310, equity: 1315 },
  { date: '14 Jan', balance: 1320, equity: 1328 },
  { date: '21 Jan', balance: 1335, equity: 1340 },
  { date: '28 Jan', balance: 1348, equity: 1352 },
  { date: '4 Feb', balance: 1358, equity: 1362 },
];

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', prefix = '', decimals = 0 }: { 
  value: number; 
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: 'easeOut' });
      const unsubscribe = count.on('change', (v) => setDisplayValue(v));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};

// Stat Card Component
const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  suffix = '', 
  prefix = '',
  trend,
  description 
}: { 
  icon: typeof TrendingUp;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: 'up' | 'down';
  description?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
      }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />}
          </div>
        )}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={suffix === '%' ? 1 : 0} />
      </div>
      {description && (
        <p className="text-[10px] sm:text-xs text-muted-foreground">{description}</p>
      )}
    </motion.div>
  );
};

// Chart Card Component  
const ChartCard = ({ 
  title, 
  subtitle,
  data, 
  dataKey, 
  color = 'hsl(45 93% 58%)',
  yAxisDomain,
  valuePrefix = '',
  valueSuffix = ''
}: { 
  title: string;
  subtitle?: string;
  data: any[];
  dataKey: string;
  color?: string;
  yAxisDomain?: [number, number];
  valuePrefix?: string;
  valueSuffix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: false });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 20,
      }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="text-left sm:text-right">
          <div className="font-mono text-lg sm:text-xl font-bold text-primary">
            {valuePrefix}{data[data.length - 1][dataKey]}{valueSuffix}
          </div>
          <div className="text-[10px] sm:text-xs text-muted-foreground">Aktuell</div>
        </div>
      </div>
      <div className="h-36 sm:h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(0 0% 60%)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={yAxisDomain}
            tick={{ fill: 'hsl(0 0% 60%)', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(0 0% 8%)',
              border: '1px solid hsl(0 0% 18%)',
              borderRadius: '8px',
              color: 'hsl(0 0% 98%)',
            }}
            formatter={(value: number) => [`${valuePrefix}${value}${valueSuffix}`, title]}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    </motion.div>
  );
};

// Video Placeholder Component
const VideoPlaceholder = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden glass"
    >
      {/* Background Image */}
      <img 
        src={saifTrading} 
        alt="Saif erklärt den Trading Bot" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-background/20" />
      
      {/* Play Button */}
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
        whileHover={{ scale: 1.02 }}
      >
        <motion.div 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full glass flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary fill-primary ml-1" />
        </motion.div>
        <span className="text-sm sm:text-base text-foreground font-medium">Video starten</span>
        <span className="text-xs text-muted-foreground mt-1">Bot-Demo ansehen</span>
      </motion.div>
      
      {/* Corner badges */}
      <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-foreground">Live Demo</span>
      </div>
      
      <div className="absolute top-4 right-4 glass rounded-full px-3 py-1.5">
        <span className="text-xs text-muted-foreground">12:34</span>
      </div>
    </motion.div>
  );
};

// Testimonial Component
const BotTestimonial = ({ 
  name, 
  role, 
  quote, 
  profit 
}: { 
  name: string; 
  role: string; 
  quote: string;
  profit: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass rounded-2xl p-6"
  >
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-primary fill-primary" />
      ))}
    </div>
    <p className="text-muted-foreground mb-4 italic">"{quote}"</p>
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{role}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-lg font-bold text-green-500">{profit}</div>
        <div className="text-xs text-muted-foreground">mit dem Bot</div>
      </div>
    </div>
  </motion.div>
);

const BotPage = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Telegram Integration',
      description: 'Erhalte Signale und kommuniziere direkt über Telegram mit dem Bot.',
    },
    {
      icon: Camera,
      title: 'Screenshot-Analyse',
      description: 'Schicke einen Chart-Screenshot und erhalte sofortige KI-Analyse.',
    },
    {
      icon: Bell,
      title: 'Setup-Benachrichtigungen',
      description: 'Werde benachrichtigt, sobald der Bot ein profitables Setup erkennt.',
    },
    {
      icon: Shield,
      title: 'Risikomanagement',
      description: 'Automatische Position-Sizing und Stop-Loss Berechnungen.',
    },
    {
      icon: Clock,
      title: '24/7 Überwachung',
      description: 'Der Bot analysiert die Märkte rund um die Uhr, auch wenn du schläfst.',
    },
    {
      icon: LineChart,
      title: 'Multi-Timeframe',
      description: 'Analyse über mehrere Zeitebenen für optimale Entry-Punkte.',
    },
  ];

  const testimonials = [
    {
      name: 'Michael S.',
      role: 'Daytrader seit 2 Jahren',
      quote: 'Der Bot hat meine Trading-Routine komplett verändert. Endlich verpasse ich keine Setups mehr.',
      profit: '+€2.340',
    },
    {
      name: 'Laura K.',
      role: 'Berufstätige Traderin',
      quote: 'Perfekt für Berufstätige. Der Bot überwacht alles, während ich arbeite.',
      profit: '+€1.890',
    },
    {
      name: 'Thomas B.',
      role: 'Swing Trader',
      quote: 'Die Telegram-Integration ist genial. Bekomme Alerts direkt aufs Handy.',
      profit: '+€3.120',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, hsl(45 93% 58% / 0.2), transparent 70%)',
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="section-container relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
              >
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Smart Trading Bot</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6"
              >
                KI-Trading auf
                <br />
                <span className="text-gradient-primary">Autopilot</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              >
                Unser KI-Bot analysiert die Märkte 24/7, erkennt profitable Setups und 
                unterstützt dich bei deinen Trading-Entscheidungen — via Telegram.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/quiz">
                  <Button variant="hero" size="xl" className="group">
                    Bot aktivieren — $499
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button variant="heroOutline" size="xl">
                  <Play className="w-5 h-5" />
                  Demo anschauen
                </Button>
              </motion.div>
            </div>

            {/* Video Placeholder - Full Width */}
            <VideoPlaceholder />
          </div>
        </section>

        {/* Saif Introduction Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass p-2">
                  <img 
                    src={saifDesk} 
                    alt="Saif am Trading Desk" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-2xl" />
                </div>
                
                {/* Floating Stats */}
                <motion.div
                  className="absolute -bottom-4 -right-4 glass rounded-2xl p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xl font-bold text-primary">800%+</div>
                      <div className="text-xs text-muted-foreground">Bot Rendite gesamt</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
                  Entwickelt von Saif
                </span>
                
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  "Dieser Bot ist das Ergebnis von
                  <span className="text-gradient-primary"> 3 Jahren Entwicklung."</span>
                </h2>
                
                <div className="space-y-4 text-muted-foreground mb-8">
                  <p>
                    Ich habe unzählige Strategien getestet, tausende Stunden in Backtesting investiert 
                    und den Bot immer weiter optimiert — bis er konstant profitabel wurde.
                  </p>
                  <p>
                    Das Ergebnis: Ein KI-System, das die Märkte 24/7 analysiert und dir die 
                    besten Setups direkt aufs Handy schickt.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: TrendingUp, value: '+14.2%', label: 'Letzte 3 Monate' },
                    { icon: Shield, value: '-10%', label: 'Max Drawdown' },
                    { icon: Clock, value: '24/7', label: 'Aktiv' },
                    { icon: Users, value: '200+', label: 'Nutzer' },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-xl p-3 flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <div className="font-mono font-bold text-foreground">{item.value}</div>
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="font-display font-bold text-lg text-foreground">Saif Al-Nasiri</div>
                    <div className="text-sm text-muted-foreground">Bot-Entwickler & Head Trader</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Live Stats Section */}
        <section className="py-12 md:py-16">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Echte Performance-Daten
              </h2>
              <p className="text-muted-foreground">
                Live-Statistiken der letzten 3 Monate (Nov 2025 - Feb 2026)
              </p>
            </motion.div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={Percent}
                label="Rendite"
                value={14.2}
                suffix="%"
                prefix="+"
                trend="up"
                description="Letzte 3 Monate"
              />
              <StatCard 
                icon={DollarSign}
                label="Profit"
                value={156}
                prefix="$"
                trend="up"
                description="Absoluter Gewinn"
              />
              <StatCard 
                icon={TrendingDown}
                label="Max. Drawdown"
                value={-10}
                suffix="%"
                description="Maximaler Verlust"
              />
              <StatCard 
                icon={Activity}
                label="Account Balance"
                value={1358}
                prefix="$"
                trend="up"
                description="Aktueller Stand"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <ChartCard 
                title="Yield"
                subtitle="Prozentuale Rendite"
                data={yieldData}
                dataKey="yield"
                valueSuffix="%"
              />
              <ChartCard 
                title="Profit"
                subtitle="Absoluter Gewinn in USD"
                data={profitData}
                dataKey="profit"
                valuePrefix="$"
                color="hsl(142 76% 36%)"
              />
            </div>

            {/* Balance Chart - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 mt-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">Account Balance & Equity</h3>
                  <p className="text-sm text-muted-foreground">Kontoverlauf über 3 Monate</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Balance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Equity</span>
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={balanceData}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(45 93% 58%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(45 93% 58%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(142 76% 36%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: 'hsl(0 0% 60%)', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[1180, 1400]}
                      tick={{ fill: 'hsl(0 0% 60%)', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      width={50}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(0 0% 8%)',
                        border: '1px solid hsl(0 0% 18%)',
                        borderRadius: '8px',
                        color: 'hsl(0 0% 98%)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="balance"
                      stroke="hsl(45 93% 58%)"
                      strokeWidth={2}
                      fill="url(#balanceGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="equity"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth={2}
                      fill="url(#equityGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works with Saif Image */}
        <section className="py-16 md:py-24 relative">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
                  So funktioniert's
                </span>
                
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8">
                  In 3 Schritten zum
                  <span className="text-gradient-primary"> automatisierten Trading</span>
                </h2>

                <div className="space-y-6">
                  {[
                    {
                      step: '01',
                      title: 'Bot aktivieren',
                      description: 'Verbinde den Bot mit deinem Telegram und konfiguriere deine Präferenzen.',
                    },
                    {
                      step: '02',
                      title: 'Signale empfangen',
                      description: 'Der Bot analysiert die Märkte 24/7 und sendet dir profitable Setups.',
                    },
                    {
                      step: '03',
                      title: 'Trades ausführen',
                      description: 'Entscheide selbst, welche Trades du nimmst — volle Kontrolle behältst du.',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-mono text-sm font-bold text-primary">{item.step}</span>
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden glass p-2">
                  <img 
                    src={saifPhone} 
                    alt="Saif zeigt den Bot auf dem Smartphone" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-2xl" />
                </div>
                
                {/* Telegram Badge */}
                <motion.div
                  className="absolute -top-4 -left-4 glass rounded-2xl p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[#0088cc]" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Telegram</div>
                      <div className="text-xs text-muted-foreground">Direkte Signale</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Was der Bot kann
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Leistungsstarke Features, die dein Trading auf das nächste Level bringen.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                Was unsere Bot-Nutzer sagen
              </h2>
              <p className="text-muted-foreground">
                Echte Ergebnisse von echten Tradern
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <BotTestimonial key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Einmalige Zahlung</span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Starte jetzt mit dem Bot
                </h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-6">
                  Einmaliger Kauf, lebenslanger Zugang. Keine monatlichen Gebühren.
                </p>

                <div className="flex items-center justify-center gap-2 mb-8">
                  <span className="text-4xl md:text-5xl font-bold text-foreground font-mono">$499</span>
                  <span className="text-muted-foreground">einmalig</span>
                </div>

                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm">
                  {[
                    'Lebenslanger Zugang',
                    'Telegram Integration',
                    'Alle Updates inklusive',
                    'Setup-Unterstützung',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link to="/quiz">
                  <Button variant="hero" size="xl" className="group">
                    Bot jetzt aktivieren
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BotPage;
