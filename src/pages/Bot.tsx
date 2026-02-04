import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, TrendingUp, TrendingDown, Shield, Clock, Bot, 
  MessageSquare, Camera, Bell, CheckCircle2, Zap, LineChart,
  DollarSign, Percent, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass rounded-2xl p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        </div>
      )}
    </div>
    <div className="text-sm text-muted-foreground mb-1">{label}</div>
    <div className="text-3xl font-bold text-foreground mb-1">
      <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={suffix === '%' ? 1 : 0} />
    </div>
    {description && (
      <p className="text-xs text-muted-foreground">{description}</p>
    )}
  </motion.div>
);

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
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="glass rounded-2xl p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="text-right">
        <div className="font-mono text-xl font-bold text-primary">
          {valuePrefix}{data[data.length - 1][dataKey]}{valueSuffix}
        </div>
        <div className="text-xs text-muted-foreground">Aktuell</div>
      </div>
    </div>
    <div className="h-48">
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

const BotPage = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | '3months'>('3months');

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
            <div className="max-w-4xl mx-auto text-center">
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
                  Demo anschauen
                </Button>
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