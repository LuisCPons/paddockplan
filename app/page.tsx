import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { GPGuides } from '@/components/GPGuides';
import { HowItWorks } from '@/components/HowItWorks';
import { QuickPlanner } from '@/components/QuickPlanner';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';

 
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <GPGuides />
        <HowItWorks />
        <QuickPlanner />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
