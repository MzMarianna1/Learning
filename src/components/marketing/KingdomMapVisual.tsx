/**
 * Kingdom Map Visual Component
 * SVG-based interactive kingdom map showing different learning zones
 */

import { motion } from 'motion/react';

export default function KingdomMapVisual() {
  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-gradient-to-br from-slate-900 via-purple-900 to-cyan-900">
      {/* SVG Kingdom Map */}
      <svg
        viewBox="0 0 1200 675"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Sky/Space */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
          
          <linearGradient id="castleGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="mountainGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="pathGlow">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>

          {/* Circuit pattern */}
          <pattern id="circuitPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 L10 20 L10 10 L20 10" stroke="#06b6d4" strokeWidth="0.5" fill="none" opacity="0.2" />
            <path d="M20 30 L30 30 L30 20 L40 20" stroke="#06b6d4" strokeWidth="0.5" fill="none" opacity="0.2" />
            <circle cx="10" cy="10" r="1" fill="#22d3ee" opacity="0.4" />
            <circle cx="30" cy="30" r="1" fill="#22d3ee" opacity="0.4" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="1200" height="675" fill="url(#skyGradient)" />
        
        {/* Circuit pattern overlay */}
        <rect width="1200" height="675" fill="url(#circuitPattern)" opacity="0.3" />

        {/* Stars/Particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={Math.random() * 1200}
            cy={Math.random() * 400}
            r={Math.random() * 2 + 0.5}
            fill="#ffffff"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Paths connecting zones - Glowing */}
        <g opacity="0.6">
          <motion.path
            d="M 200 550 Q 400 450 600 500"
            stroke="#22d3ee"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8,8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 600 500 Q 800 450 1000 550"
            stroke="#a855f7"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8,8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
          />
        </g>

        {/* Code Castle (Left) */}
        <g className="cursor-pointer" transform="translate(150, 350)">
          <motion.g
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Castle base */}
            <rect x="0" y="100" width="100" height="120" fill="#1e3a8a" stroke="#06b6d4" strokeWidth="2" />
            {/* Towers */}
            <rect x="-20" y="80" width="35" height="80" fill="#1e40af" stroke="#06b6d4" strokeWidth="2" />
            <rect x="85" y="80" width="35" height="80" fill="#1e40af" stroke="#06b6d4" strokeWidth="2" />
            {/* Tower tops */}
            <polygon points="-20,80 -2.5,50 15,80" fill="#3b82f6" stroke="#22d3ee" strokeWidth="2" />
            <polygon points="85,80 102.5,50 120,80" fill="#3b82f6" stroke="#22d3ee" strokeWidth="2" />
            {/* Door */}
            <rect x="35" y="160" width="30" height="60" fill="#0c1e3a" stroke="#06b6d4" strokeWidth="2" />
            {/* Windows */}
            <rect x="15" y="120" width="15" height="20" fill="#22d3ee" opacity="0.6" />
            <rect x="70" y="120" width="15" height="20" fill="#22d3ee" opacity="0.6" />
            {/* Glow effect */}
            <motion.circle
              cx="50"
              cy="160"
              r="80"
              fill="url(#castleGlow)"
              opacity="0.3"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.g>
          {/* Label */}
          <text x="50" y="260" textAnchor="middle" fill="#22d3ee" fontSize="20" fontWeight="bold">
            CODE CASTLE
          </text>
        </g>

        {/* Math Mountains (Center) */}
        <g className="cursor-pointer" transform="translate(520, 250)">
          <motion.g
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Mountain peaks */}
            <polygon points="80,200 140,80 200,200" fill="#581c87" stroke="#a855f7" strokeWidth="2" />
            <polygon points="20,250 80,150 140,250" fill="#6b21a8" stroke="#a855f7" strokeWidth="2" />
            <polygon points="140,250 200,130 260,250" fill="#7c3aed" stroke="#c084fc" strokeWidth="2" />
            {/* Snow caps */}
            <polygon points="140,80 120,110 160,110" fill="#ffffff" opacity="0.8" />
            <polygon points="80,150 65,175 95,175" fill="#ffffff" opacity="0.8" />
            <polygon points="200,130 185,155 215,155" fill="#ffffff" opacity="0.8" />
            {/* Glow effect */}
            <motion.ellipse
              cx="140"
              cy="180"
              rx="100"
              ry="60"
              fill="url(#mountainGlow)"
              opacity="0.3"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
          </motion.g>
          {/* Label */}
          <text x="140" y="290" textAnchor="middle" fill="#c084fc" fontSize="20" fontWeight="bold">
            MATH MOUNTAINS
          </text>
        </g>

        {/* Reading Realm (Right) */}
        <g className="cursor-pointer" transform="translate(850, 350)">
          <motion.g
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Book/Library structure */}
            <rect x="10" y="120" width="80" height="100" fill="#be185d" stroke="#ec4899" strokeWidth="2" />
            <rect x="30" y="100" width="80" height="100" fill="#db2777" stroke="#f472b6" strokeWidth="2" />
            <rect x="50" y="80" width="80" height="100" fill="#ec4899" stroke="#f9a8d4" strokeWidth="2" />
            {/* Book spines */}
            <line x1="50" y1="80" x2="50" y2="180" stroke="#9f1239" strokeWidth="2" />
            <line x1="90" y1="80" x2="90" y2="180" stroke="#9f1239" strokeWidth="2" />
            {/* Magical glow */}
            <motion.circle
              cx="90"
              cy="140"
              r="70"
              fill="#ec4899"
              opacity="0.2"
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </motion.g>
          {/* Label */}
          <text x="90" y="240" textAnchor="middle" fill="#f472b6" fontSize="20" fontWeight="bold">
            READING REALM
          </text>
        </g>

        {/* Central Hub/Portal */}
        <g transform="translate(550, 450)">
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <circle cx="50" cy="50" r="20" fill="#22d3ee" opacity="0.3" />
          <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
            START
          </text>
        </g>

        {/* Floating Quest Markers */}
        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="300" cy="450" r="8" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
          <text x="300" y="435" textAnchor="middle" fill="#fbbf24" fontSize="14">!</text>
        </motion.g>

        <motion.g
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <circle cx="750" cy="400" r="8" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
          <text x="750" y="385" textAnchor="middle" fill="#fbbf24" fontSize="14">!</text>
        </motion.g>

        {/* Title overlay */}
        <text x="600" y="50" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="bold" opacity="0.9">
          THE LEARNING KINGDOM
        </text>
      </svg>

      {/* Overlay Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
    </div>
  );
}
