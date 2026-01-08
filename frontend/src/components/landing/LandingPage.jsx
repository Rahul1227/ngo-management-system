import Hero from './Hero';
import Features from './Features';
import About from './About';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <About />
    </div>
  );
};

export default LandingPage;