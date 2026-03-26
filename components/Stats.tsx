"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from './LanguageProvider';

const stats = [
  { value: 2, key: 'yearsOfExperience' },
  { value: 8, key: 'teamMembers' },
  { value: 5, key: 'projectsCompleted' },
  { value: 5, key: 'satisfiedCustomers' },
];

const CounterNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const duration = 2500; // 2.5 seconds
    const increment = end / (duration / 50);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return <span ref={containerRef}>{displayValue}</span>;
};

const StatCard = ({ 
  value, 
  label, 
  index 
}: { 
  value: number; 
  label: string; 
  index: number 
}) => {
  return (
    <div
      className="relative group"
    >
      {/* Gradient background blur effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF4D6D] via-[#FF6F4F] to-[#FF9A3C] rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
      
      {/* Card container */}
      <div 
        className="relative overflow-hidden p-8 rounded-2xl bg-[#14162E] border border-transparent group-hover:border-brand-pink/70 transition-all duration-500 backdrop-blur-md hover:shadow-lg"
        style={{
          backgroundImage: 'linear-gradient(#14162E, #14162E), linear-gradient(135deg, rgba(255, 77, 109, 0.3), rgba(255, 154, 60, 0.1))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          boxShadow: '0 4px 20px rgba(255, 77, 109, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-pink/8 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-brand-pink/15 transition-all duration-500"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-pink/8 rounded-full blur-2xl -ml-16 -mb-16 group-hover:bg-brand-pink/15 transition-all duration-500"></div>

        {/* Content */}
        <div className="relative z-10 text-center">
        {/* Number with counter animation */}
          <div className="text-white text-6xl md:text-7xl lg:text-8xl font-black leading-tight tabular-nums" style={{ fontFamily: 'var(--font-gilroy)' }}>
            <CounterNumber value={value} />
          </div>
          
          {/* Label */}
          <div className="mt-4 md:mt-6 text-white font-semibold text-base md:text-lg tracking-wider uppercase" style={{ fontFamily: 'var(--font-tt-hoves)' }}>
            {label}
          </div>

          {/* Bottom accent line */}
          <div 
            className="mt-4 h-1 w-12 bg-gradient-to-r from-[#FF6F4F] to-[#FF9A3C] mx-auto rounded-full"
          ></div>
        </div>
      </div>
    </div>
  );
};

const Stats = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 lg:py-12 border-t border-gray-800/50 bg-gradient-to-b from-white/0 via-white/50 to-white/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 !bg-brand-pink/5 rounded-full blur-3xl -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 !bg-brand-orange/5 rounded-full blur-3xl -mr-48 -mb-48"></div>

      <div 
        className="w-full px-6 md:px-12 relative z-10"
      >
        {/* Stats cards */}
        <div 
          className="grid grid-cols-1 text-white sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16"
        >
          {stats.map((s, idx) => (
            <StatCard key={idx} value={s.value} label={t(s.key)} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
