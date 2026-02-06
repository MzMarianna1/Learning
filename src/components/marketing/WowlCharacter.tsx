/**
 * Wowl Character Visual Component
 * SVG-based AI tutor character with circuit patterns
 */

import { motion } from 'motion/react';

export default function WowlCharacter() {
  return (
    <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500/30 flex items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wowlBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          
          <linearGradient id="wowlBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>

          <radialGradient id="eyeGlow">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>

          <pattern id="circuitWowl" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L5 10 L5 5 L10 5" stroke="#d97706" strokeWidth="0.5" fill="none" opacity="0.3" />
            <circle cx="5" cy="5" r="0.5" fill="#f59e0b" opacity="0.4" />
          </pattern>
        </defs>

        {/* Background circuit glow */}
        <motion.circle
          cx="200"
          cy="200"
          r="150"
          fill="#f59e0b"
          opacity="0.1"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Owl Body */}
        <g transform="translate(200, 220)">
          {/* Main body */}
          <motion.ellipse
            cx="0"
            cy="0"
            rx="90"
            ry="110"
            fill="url(#wowlBody)"
            animate={{ scaleY: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Belly */}
          <ellipse
            cx="0"
            cy="20"
            rx="55"
            ry="70"
            fill="url(#wowlBelly)"
          />

          {/* Circuit pattern overlay */}
          <ellipse
            cx="0"
            cy="0"
            rx="90"
            ry="110"
            fill="url(#circuitWowl)"
            opacity="0.4"
          />

          {/* Wings */}
          <motion.ellipse
            cx="-70"
            cy="10"
            rx="35"
            ry="60"
            fill="#d97706"
            transform="rotate(-20 -70 10)"
            animate={{ rotate: [-20, -10, -20] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.ellipse
            cx="70"
            cy="10"
            rx="35"
            ry="60"
            fill="#d97706"
            transform="rotate(20 70 10)"
            animate={{ rotate: [20, 10, 20] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Feather details on wings */}
          <path d="M -70 -30 Q -75 -10 -70 10" stroke="#b45309" strokeWidth="2" fill="none" />
          <path d="M -70 -20 Q -80 0 -70 20" stroke="#b45309" strokeWidth="2" fill="none" />
          <path d="M 70 -30 Q 75 -10 70 10" stroke="#b45309" strokeWidth="2" fill="none" />
          <path d="M 70 -20 Q 80 0 70 20" stroke="#b45309" strokeWidth="2" fill="none" />
        </g>

        {/* Head */}
        <g transform="translate(200, 140)">
          {/* Head base */}
          <circle cx="0" cy="0" r="70" fill="url(#wowlBody)" />
          
          {/* Circuit pattern on head */}
          <circle cx="0" cy="0" r="70" fill="url(#circuitWowl)" opacity="0.4" />

          {/* Ear tufts */}
          <motion.path
            d="M -40 -50 L -50 -80 L -30 -60 Z"
            fill="#d97706"
            animate={{ rotate: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transformOrigin: '-40px -50px' }}
          />
          <motion.path
            d="M 40 -50 L 50 -80 L 30 -60 Z"
            fill="#d97706"
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transformOrigin: '40px -50px' }}
          />

          {/* Eyes - Large wise owl eyes */}
          <g>
            {/* Eye glow effect */}
            <motion.circle
              cx="-25"
              cy="0"
              r="30"
              fill="url(#eyeGlow)"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="25"
              cy="0"
              r="30"
              fill="url(#eyeGlow)"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Eye whites */}
            <circle cx="-25" cy="0" r="22" fill="#ffffff" />
            <circle cx="25" cy="0" r="22" fill="#ffffff" />
            
            {/* Iris - cyan tech color */}
            <circle cx="-25" cy="0" r="16" fill="#06b6d4" />
            <circle cx="25" cy="0" r="16" fill="#06b6d4" />
            
            {/* Pupils with animation */}
            <motion.circle
              cx="-25"
              cy="0"
              r="8"
              fill="#0c4a6e"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx="25"
              cy="0"
              r="8"
              fill="#0c4a6e"
              animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Eye highlights */}
            <circle cx="-22" cy="-3" r="4" fill="#ffffff" opacity="0.8" />
            <circle cx="28" cy="-3" r="4" fill="#ffffff" opacity="0.8" />
          </g>

          {/* Beak */}
          <path
            d="M 0 20 L -8 35 L 8 35 Z"
            fill="#fb923c"
            stroke="#ea580c"
            strokeWidth="1"
          />

          {/* Circuit lines on face (tech element) */}
          <g opacity="0.4">
            <motion.path
              d="M -50 -10 L -60 -10 L -60 0"
              stroke="#22d3ee"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M 50 -10 L 60 -10 L 60 0"
              stroke="#22d3ee"
              strokeWidth="1"
              fill="none"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <circle cx="-60" cy="0" r="2" fill="#22d3ee" />
            <circle cx="60" cy="0" r="2" fill="#22d3ee" />
          </g>
        </g>

        {/* Feet */}
        <g transform="translate(200, 330)">
          {/* Left foot */}
          <g transform="translate(-30, 0)">
            <ellipse cx="0" cy="0" rx="15" ry="8" fill="#f97316" />
            <path d="M -10 0 L -12 8 M 0 0 L 0 10 M 10 0 L 12 8" stroke="#ea580c" strokeWidth="2" fill="none" />
          </g>
          {/* Right foot */}
          <g transform="translate(30, 0)">
            <ellipse cx="0" cy="0" rx="15" ry="8" fill="#f97316" />
            <path d="M -10 0 L -12 8 M 0 0 L 0 10 M 10 0 L 12 8" stroke="#ea580c" strokeWidth="2" fill="none" />
          </g>
        </g>

        {/* Floating particles/sparkles around Wowl */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const radius = 170;
          const x = 200 + Math.cos(angle) * radius;
          const y = 200 + Math.sin(angle) * radius;
          
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#fbbf24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
              }}
            />
          );
        })}
      </svg>

      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-4 -right-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl px-6 py-3 shadow-xl"
      >
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-amber-500 border-b-8 border-b-transparent" />
        <p className="text-white font-bold text-lg whitespace-nowrap">Hoot hoot! Ready to unlock your genius?</p>
      </motion.div>
    </div>
  );
}
