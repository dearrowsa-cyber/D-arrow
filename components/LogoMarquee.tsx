'use client';

import Image from 'next/image';

const LogoMarquee = () => {
  const images = [
   '/beedco-main.png',
    '/connects2.png',
    '/connects3.png',
    '/connects4.png',
  ];

  return (
    <div className="w-full overflow-hidden py-4">
      <style>{`
        @keyframes logoMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .logo-marquee-container {
          display: flex;
          gap: 2rem;
          animation: logoMarquee 40s linear infinite;
          width: fit-content;
        }

        .logo-marquee-item {
          flex-shrink: 0;
          width: 140px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      
      <div className="logo-marquee-container">
        {/* First set of images */}
        {images.map((image, index) => (
          <div key={index} className="logo-marquee-item">
            <Image
              src={image}
              alt={`Logo ${index + 1}`}
              width={140}
              height={70}
              className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
        
        {/* Duplicate set for infinite loop */}
        {images.map((image, index) => (
          <div key={`duplicate-${index}`} className="logo-marquee-item">
            <Image
              src={image}
              alt={`Logo ${index + 1}`}
              width={140}
              height={70}
              className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
