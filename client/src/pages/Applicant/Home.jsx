import React, { useState } from 'react';
import { Home, FileText, CreditCard, HelpCircle, LogIn, BookOpen, MessageCircle } from 'lucide-react';

const ResearchSystemHomePage = () => {
  const [activeLink, setActiveLink] = useState('Home');

  const features = [
    { icon: FileText, title: 'Submit an Application' },
    { icon: Home, title: 'Track Application Status' },
    { icon: CreditCard, title: 'Payments' },
    { icon: HelpCircle, title: 'Help & Support' }
  ];

  return (
    <div className="w-full max-w-screen-2xl mx-auto">

      {/* Hero Section */}
      <section 
        className="relative h-[648px] bg-cover bg-center flex items-center"
        style={{backgroundImage: "url('/placeholder-hero.jpg')"}}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-white text-5xl font-bold mb-4">
            Streamlined Ethical Clearance
            <br />
            <span className="text-white">For Medical Research</span>
          </h1>
          <button className="mt-6 px-8 py-3 bg-gradient-to-r from-[#112951] via-[#20549f] to-[#2f80ed] text-white rounded-full hover:scale-105 transition-transform">
            Get Started
          </button>
        </div>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center text-4xl font-bold mb-12">Key Features</h2>
        <div className="grid grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-black/60 rounded-lg p-6 text-center text-white hover:bg-black/70 transition group"
            >
              <feature.icon className="mx-auto h-12 w-12 group-hover:scale-110 transition" />
              <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Remaining sections remain the same as in the previous implementation */}
    </div>
  );
};

export default ResearchSystemHomePage;