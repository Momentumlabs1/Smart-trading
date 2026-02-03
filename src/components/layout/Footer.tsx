import { Link } from 'react-router-dom';
import { TrendingUp, Instagram, Youtube, MessageCircle } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Academy', href: '/academy' },
    { label: 'Elite Mentoring', href: '/elite' },
    { label: 'Trading Bot', href: '/bot' },
    { label: 'Erfolge', href: '/success' },
  ],
  company: [
    { label: 'Über uns', href: '/about' },
    { label: 'Kontakt', href: '/contact' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/smarttrading', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/smarttrading', label: 'YouTube' },
  { icon: MessageCircle, href: 'https://t.me/smarttrading', label: 'Telegram' },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Smart<span className="text-primary">Trading</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
              Trading ist keine Glückssache. Lerne von profitablen Tradern mit bewährten 
              Strategien, einem intelligenten Trading Bot und einer starken Community.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Produkte</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Unternehmen</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Rechtliches</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Disclaimer */}
      <div className="border-t border-border">
        <div className="section-container py-6">
          <div className="glass rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Risikohinweis:</strong> Der Handel mit Finanzinstrumenten 
            birgt erhebliche Risiken und ist nicht für jeden Anleger geeignet. Sie könnten einen Teil 
            oder Ihr gesamtes investiertes Kapital verlieren. Bevor Sie handeln, sollten Sie Ihre 
            Anlageziele, Ihre Erfahrung und Ihre Risikobereitschaft sorgfältig abwägen. Die auf dieser 
            Website bereitgestellten Informationen stellen keine Anlageberatung dar und ersetzen keine 
            professionelle Finanzberatung. Vergangene Ergebnisse garantieren keine zukünftigen Gewinne. 
            Smart Trading übernimmt keine Haftung für etwaige Verluste.
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Smart Trading. Alle Rechte vorbehalten.</p>
            <p>
              Erstellt mit 💙 in Linz, Österreich
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
