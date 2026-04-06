'use client';

import Image from 'next/image';

const LogoMarquee = () => {
  const logos = [
    { src: '/beedco-main.png', alt: 'Beedco' },
    { src: '/connects1.png', alt: 'Connects 1' },
    { src: '/pro1.png', alt: 'Partner 1' },
    { src: '/connects2.png', alt: 'Connects 2' },
    { src: '/pro2.png', alt: 'Partner 2' },
    { src: '/connects3.png', alt: 'Connects 3' },
    { src: '/pro3.png', alt: 'Partner 3' },
    { src: '/connects4.png', alt: 'Connects 4' },
  ];

  return (
    <div className="w-full overflow-hidden py-10 relative">
      {/* Edge Fade effect for a seamless look without a sharp cutoff */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0D1F] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0D1F] to-transparent z-10 pointer-events-none"></div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 3rem;
          padding-right: 3rem; /* The gap is inside the track width, ensuring flawless loop */
          width: max-content;
          animation: scroll 30s linear infinite;
        }

        .marquee-wrapper {
          display: flex;
          width: 100%;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="marquee-wrapper" dir="ltr">
        {/* We use 3 parallel tracks to guarantee absolute seamless loop on ANY screen size */}
        {[1, 2, 3].map((setIdx) => (
          <div key={setIdx} className="marquee-track" aria-hidden={setIdx !== 1}>
            {logos.map((logo, i) => (
              <div 
                key={`logo-${setIdx}-${i}`} 
                className="shrink-0 flex items-center justify-center w-[180px] h-[90px] bg-white rounded-xl shadow-lg p-2 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-[#FF9A3C]/50 hover:shadow-[0_8px_25px_rgba(255,154,60,0.3)] group"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={70}
                  className="w-full h-full object-contain grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
