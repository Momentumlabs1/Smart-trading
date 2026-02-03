import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { JourneySection } from '@/components/sections/JourneySection';
import { BotSection } from '@/components/sections/BotSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { AboutSaif } from '@/components/sections/AboutSaif';
import { Pricing } from '@/components/sections/Pricing';
import { CTA } from '@/components/sections/CTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <JourneySection />
        <BotSection />
        <AboutSaif />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
