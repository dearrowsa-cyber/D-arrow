'use client';

import Image from 'next/image';

const ImageMarquee = () => {
  const images = [
    '/beedco-main.png',
    '/connects2.png',
    '/connects3.png',
    '/connects4.png',
  ];

  return (
    <div className="w-full bg-gradient-to-b from-black/20 to-black/40 py-16 lg:py-20 overflow-hidden border-t border-b border-gray-800/50">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 2));
          }
        }

        .marquee-container {
          display: flex;
          gap: 1.5rem;
          animation: marquee 45s linear infinite;
          width: fit-content;
        }

        .marquee-item {
          flex-shrink: 0;
          width: 200px;
          height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marquee-item img {
          transition: transform 0.3s ease;
        }

        .marquee-item:hover img {
          transform: scale(1.08);
        }
      `}</style>
      
      <div className="w-full">
        <div className="marquee-container">
          {/* First set of images */}
          {images.map((image, index) => (
            <div key={index} className="marquee-item">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl hover:shadow-brand-pink/20 transition-shadow duration-300 border border-gray-700/50\">
                <Image
                  src={image}
                  alt={`Portfolio item ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          ))}
          
          {/* Duplicate set for infinite loop */}
          {images.map((image, index) => (
            <div key={`duplicate-${index}`} className="marquee-item">
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl hover:shadow-brand-pink/20 transition-shadow duration-300 border border-gray-700/50\">
                <Image
                  src={image}
                  alt={`Portfolio item ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageMarquee;
