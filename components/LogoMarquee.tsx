'use client';

import Image from 'next/image';

const LogoMarquee = () => {
  const logos = [
    { src: '/beedco-main.png', alt: 'Beedco' },
    { src: '/connects1.png', alt: 'Connects 1' },
    { src: '/connects2.png', alt: 'Connects 2' },
    { src: '/pro1.png', alt: 'Partner 1' },
    { src: '/connects3.png', alt: 'Connects 3' },
    { src: '/pro2.png', alt: 'Partner 2' },
    { src: '/connects4.png', alt: 'Connects 4' },
    { src: '/connect2.png', alt: 'Connect 2' },
    { src: '/pro3.png', alt: 'Partner 3' },
  ];

  return (
    <div className="w-full overflow-hidden py-6">
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 3rem;
          animation: marqueeScroll 25s linear infinite;
          width: max-content;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        .marquee-logo-card {
          flex-shrink: 0;
          width: 180px;
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .marquee-logo-card:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 154, 60, 0.3);
          box-shadow: 0 4px 20px rgba(255, 154, 60, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
      
      <div className="marquee-track">
        {/* First set */}
        {logos.map((logo, i) => (
          <div key={i} className="marquee-logo-card">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={80}
              className="w-full h-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
        
        {/* Duplicate set for seamless infinite loop */}
        {logos.map((logo, i) => (
          <div key={`dup-${i}`} className="marquee-logo-card">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={80}
              className="w-full h-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
