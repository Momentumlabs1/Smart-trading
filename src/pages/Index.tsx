import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { JourneySection } from '@/components/sections/JourneySection';
import { BotSection } from '@/components/sections/BotSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { AboutSaif } from '@/components/sections/AboutSaif';
import { SaifShowcase } from '@/components/sections/SaifShowcase';
import { Pricing } from '@/components/sections/Pricing';
import { CTA } from '@/components/sections/CTA';
import { HomepageQuizTeaser } from '@/components/sections/HomepageQuizTeaser';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <JourneySection />
        <Features />
        <HomepageQuizTeaser />
        <BotSection />
        <AboutSaif />
        <SaifShowcase />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
