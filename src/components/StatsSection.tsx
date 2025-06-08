
import React, { useState, useEffect, useRef } from 'react';
import { Users, Award, Target, Clock } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  endValue: number;
  suffix: string;
  title: string;
  description: string;
  inView: boolean;
}

const StatItem = ({ icon, endValue, suffix, title, description, inView }: StatItemProps) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = endValue / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newValue = Math.min(currentStep * increment, endValue);
      setCurrentValue(Math.floor(newValue));

      if (currentStep >= steps) {
        clearInterval(timer);
        setCurrentValue(endValue);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [inView, endValue]);

  return (
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 mx-auto">
        <div className="text-orange-600">
          {icon}
        </div>
      </div>
      <div className="text-5xl md:text-6xl font-black text-orange-600 mb-2">
        {currentValue}{suffix}
      </div>
      <div className="text-xl font-bold text-slate-900 mb-2">{title}</div>
      <div className="text-slate-600 text-sm leading-relaxed">{description}</div>
    </div>
  );
};

const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: <Users size={32} />,
      endValue: 500,
      suffix: '+',
      title: 'Tevreden klanten',
      description: 'Mensen die hun doelen hebben bereikt met onze begeleiding'
    },
    {
      icon: <Award size={32} />,
      endValue: 5,
      suffix: '+',
      title: 'Jaar ervaring',
      description: 'Bewezen expertise in personal training en coaching'
    },
    {
      icon: <Target size={32} />,
      endValue: 95,
      suffix: '%',
      title: 'Behaalt doelen',
      description: 'Van onze klanten bereikt hun gewenste resultaten'
    },
    {
      icon: <Clock size={32} />,
      endValue: 24,
      suffix: '/7',
      title: 'Ondersteuning',
      description: 'Altijd bereikbaar voor vragen en motivatie'
    }
  ];

  return (
    <section ref={sectionRef} className="bg-slate-50 py-20" id="stats">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-slate-900">
            Resultaten die
            <span className="block text-orange-600">spreken voor zich</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Onze aanpak werkt. Deze cijfers tonen aan waarom zoveel mensen kiezen voor onze begeleiding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              endValue={stat.endValue}
              suffix={stat.suffix}
              title={stat.title}
              description={stat.description}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
