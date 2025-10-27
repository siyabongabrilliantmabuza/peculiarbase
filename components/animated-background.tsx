'use client';

import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  theme: string;
}

export function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const themes = {
    cosmic: (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    ),
    ocean: (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-700">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    ),
    sunset: (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-orange-600 via-pink-500 to-purple-600">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: Math.random() * 300 + 200,
              height: Math.random() * 300 + 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['rgba(255,200,0,0.3)', 'rgba(255,100,150,0.3)', 'rgba(150,50,255,0.3)'][
                  Math.floor(Math.random() * 3)
                ]
              } 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    ),
    forest: (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-green-400/10"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transformOrigin: 'top',
            }}
            animate={{
              rotate: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    ),
    aurora: (
      <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-32 blur-3xl"
            style={{
              top: `${i * 20}%`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                ${['rgba(0,255,150,0.3)', 'rgba(100,150,255,0.3)', 'rgba(255,100,200,0.3)'][i % 3]} 50%, 
                transparent 100%)`,
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    ),
  };

  return themes[theme as keyof typeof themes] || themes.cosmic;
}
