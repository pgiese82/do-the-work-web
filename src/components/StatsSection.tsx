import React, { useState, useEffect, useRef } from 'react';
import { Users, Award, Target, Clock } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
interface StatItemProps {
  icon: React.ReactNode;
  endValue: number;
  suffix: string;
  title: string;
  description: string;
  inView: boolean;
  index: number;
}
const StatItem = ({
  icon,
  endValue,
  suffix,
  title,
  description,
  inView,
  index
}: StatItemProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const {
    ref,
    isVisible
  } = useScrollAnimation({
    delay: index * 200
  });
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
  return <div ref={ref} className={`text-center p-6 md:p-8 lg:p-10 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 scroll-fade-in scroll-stagger-${index + 1} ${isVisible ? 'visible' : ''}`}>
      <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6 md:mb-8 mx-auto">
        <div className="text-orange-600">
          {icon}
        </div>
      </div>
      <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-orange-600 mb-2 md:mb-4">
        {currentValue}{suffix}
      </div>
      <div className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-2 md:mb-4">{title}</div>
      <div className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed">{description}</div>
    </div>;
};
const StatsSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const {
    ref: titleRef,
    isVisible: titleVisible
  } = useScrollAnimation();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    }, {
      threshold: 0.3
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const stats = [{
    icon: <Users size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />,
    endValue: 500,
    suffix: '+',
    title: 'Tevreden klanten',
    description: 'Mensen die hun doelen hebben bereikt met onze begeleiding'
  }, {
    icon: <Award size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />,
    endValue: 5,
    suffix: '+',
    title: 'Jaar ervaring',
    description: 'Bewezen expertise in personal training en coaching'
  }, {
    icon: <Target size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />,
    endValue: 95,
    suffix: '%',
    title: 'Behaalt doelen',
    description: 'Van onze klanten bereikt hun gewenste resultaten'
  }, {
    icon: <Clock size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" />,
    endValue: 24,
    suffix: '/7',
    title: 'Ondersteuning',
    description: 'Altijd bereikbaar voor vragen en motivatie'
  }];
  return <section ref={sectionRef} className="bg-slate-50 py-16 md:py-20 lg:py-24 xl:py-32" id="stats">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 lg:mb-20 xl:mb-24 scroll-fade-in ${titleVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 md:mb-8 text-slate-900">
            Resultaten die
            <span className="block text-orange-600">spreken voor zich</span>
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto">Mijn aanpak werkt. Deze cijfers tonen aan waarom zoveel mensen kiezen voor mijn begeleiding.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
          {stats.map((stat, index) => <StatItem key={index} icon={stat.icon} endValue={stat.endValue} suffix={stat.suffix} title={stat.title} description={stat.description} inView={inView} index={index} />)}
        </div>
      </div>
    </section>;
};
export default StatsSection;