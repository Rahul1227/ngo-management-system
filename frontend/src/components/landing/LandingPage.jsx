import Hero from './Hero';
import Features from './Features';
import About from './About';
import Chatbot from '../common/Chatbot';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <About />
      <Chatbot/>
    </div>
  );
};

export default LandingPage;