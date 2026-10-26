import React from 'react';

interface Airplane2DProps {
  x: number;
  y: number;
  pitchDeg: number;
  scale: number;
  gearDown: boolean;
  isTouchdown: boolean;
  thrustRatio?: number;
}

export const Airplane2D: React.FC<Airplane2DProps> = ({
  x,
  y,
  pitchDeg,
  scale,
  gearDown,
  isTouchdown,
  thrustRatio = 0.8,
}) => {
  return (
    <div
      className="absolute top-0 left-0 w-[420px] h-[165px] pointer-events-none select-none will-change-transform z-20"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${pitchDeg}deg) scale(${scale})`,
        transformOrigin: '55% 65%',
        transition: 'transform 0.08s linear',
      }}
    >
      <svg
        viewBox="0 0 420 165"
        className="w-full h-full drop-shadow-xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fuselage pearl white gradient */}
          <linearGradient id="fuselageBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f8fafc" />
            <stop offset="85%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          {/* Wing gradient */}
          <linearGradient id="wingSkin" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Engine Nacelle */}
          <linearGradient id="engineBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="35%" stopColor="#f8fafc" />
            <stop offset="80%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Contrail trail */}
          <linearGradient id="vaporTrail" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
            <stop offset="45%" stopColor="rgba(224, 242, 254, 0.4)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>

          {/* Beacon light glow */}
          <filter id="lightGlowFx" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ================= CONTRAILS & ENGINE EXHAUST ================= */}
        {thrustRatio > 0.3 && (
          <g opacity={thrustRatio * 0.85}>
            {/* Engine core vapor trail */}
            <path
              d="M 120,108 L -150,104 L -150,113 L 120,111 Z"
              fill="url(#vaporTrail)"
            />
            {/* Wingtip vortex trail */}
            <path
              d="M 100,58 L -180,54 L -180,59 L 100,58 Z"
              fill="url(#vaporTrail)"
              opacity="0.6"
            />
          </g>
        )}

        {/* ================= TOUCHDOWN TIRE SMOKE EFFECT ================= */}
        {isTouchdown && (
          <g>
            <circle cx="210" cy="144" r="14" fill="#ffffff" opacity="0.85">
              <animate attributeName="r" values="8;28;44" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.85;0.3;0" dur="0.5s" repeatCount="indefinite" />
              <animate attributeName="cx" values="210;180;150" dur="0.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="205" cy="146" r="12" fill="#cbd5e1" opacity="0.8">
              <animate attributeName="r" values="6;22;36" dur="0.45s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.25;0" dur="0.45s" repeatCount="indefinite" />
              <animate attributeName="cx" values="205;175;145" dur="0.45s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* ================= FAR WING (Background Wing) ================= */}
        <path
          d="M 235,76 L 275,50 L 290,52 L 255,80 Z"
          fill="#94a3b8"
          opacity="0.85"
        />

        {/* ================= HORIZONTAL STABILIZER (Tail Wing) ================= */}
        <path
          d="M 45,74 L 10,65 L 20,64 L 55,75 Z"
          fill="#94a3b8"
        />

        {/* ================= VERTICAL FIN / TAIL STABILIZER ================= */}
        <path
          d="M 75,76 L 22,12 L 48,12 L 105,76 Z"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />
        {/* Deep Sapphire & Sky Blue Airline Tail Livery */}
        <path
          d="M 52,76 L 27,20 L 46,20 L 88,76 Z"
          fill="#0284c7"
        />
        <path
          d="M 68,76 L 40,32 L 48,32 L 80,76 Z"
          fill="#38bdf8"
        />
        {/* White tail flashing strobe */}
        <circle cx="23" cy="14" r="2.5" fill="#ffffff" filter="url(#lightGlowFx)">
          <animate attributeName="opacity" values="1;0.05;1" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* ================= MAIN FUSELAGE ================= */}
        {/* Aerodynamic commercial airliner fuselage */}
        <path
          d="M 370,82 
             C 350,70 320,68 250,68 
             L 90,68 
             C 50,68 20,74 15,78 
             C 12,82 25,86 45,88 
             L 280,94 
             C 330,94 365,92 370,82 Z"
          fill="url(#fuselageBody)"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />

        {/* Livery aerodynamic accent stripes */}
        <path
          d="M 120,83 L 345,83 C 352,83 358,84 362,85 L 120,87 Z"
          fill="#0284c7"
        />
        <path
          d="M 140,87 L 350,87 C 353,87 355,87.5 357,88 L 140,89 Z"
          fill="#38bdf8"
        />

        {/* Cockpit Windshield (wraparound glass) */}
        <path
          d="M 345,74 L 358,76 C 362,78 362,80 357,80 L 344,79 Z"
          fill="#0f172a"
          stroke="#38bdf8"
          strokeWidth="0.6"
        />
        {/* Cockpit glass reflection */}
        <line x1="347" y1="75" x2="353" y2="78" stroke="#bae6fd" strokeWidth="0.8" opacity="0.8" />

        {/* Passenger Cabin Windows */}
        {Array.from({ length: 18 }).map((_, i) => {
          const wx = 130 + i * 11;
          return (
            <rect
              key={i}
              x={wx}
              y={74}
              width={4.5}
              height={7}
              rx={2.2}
              fill="#0284c7"
              opacity="0.85"
            />
          );
        })}

        {/* Anti-Collision Beacon (Top of fuselage) */}
        <circle cx="215" cy="67" r="2.8" fill="#ef4444" filter="url(#lightGlowFx)">
          <animate attributeName="opacity" values="1;0.1;1" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* Anti-Collision Beacon (Belly of fuselage) */}
        <circle cx="225" cy="94" r="2.8" fill="#ef4444" filter="url(#lightGlowFx)">
          <animate attributeName="opacity" values="0.1;1;0.1" dur="1.2s" repeatCount="indefinite" />
        </circle>

        {/* ================= NEAR WING (Foreground Swept Wing) ================= */}
        <path
          d="M 240,84 
             L 155,108 
             L 142,106 
             L 210,83 Z"
          fill="url(#wingSkin)"
          stroke="#cbd5e1"
          strokeWidth="0.8"
        />

        {/* Upward Blended Winglet */}
        <path
          d="M 142,106 L 138,94 L 144,95 L 146,106 Z"
          fill="#0284c7"
        />
        {/* Wingtip Navigation Strobe & Position Light */}
        <circle cx="138" cy="94" r="2.2" fill="#22c55e" filter="url(#lightGlowFx)" />
        <circle cx="138" cy="94" r="3.5" fill="#ffffff" filter="url(#lightGlowFx)">
          <animate attributeName="opacity" values="1;0.05;1" dur="0.9s" repeatCount="indefinite" />
        </circle>

        {/* ================= HIGH-BYPASS TURBOFAN ENGINE ================= */}
        {/* Pylon mounting */}
        <path d="M 215,86 L 210,98 L 225,98 L 225,86 Z" fill="#64748b" />

        {/* Jet Engine Pod */}
        <g>
          {/* Main nacelle housing */}
          <ellipse cx="205" cy="108" rx="35" ry="14" fill="url(#engineBody)" stroke="#475569" strokeWidth="0.8" />
          {/* Intake front lip */}
          <ellipse cx="236" cy="108" rx="5" ry="13" fill="#1e293b" />
          {/* Spinner cone */}
          <ellipse cx="236" cy="108" rx="2.5" ry="5" fill="#0f172a" />
          {/* Animated spinner spiral reflection */}
          <circle cx="236" cy="108" r="1.6" fill="#f8fafc">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="0.12s" repeatCount="indefinite" />
          </circle>
          {/* Exhaust nozzle at rear */}
          <ellipse cx="172" cy="108" rx="4" ry="9" fill="#1e293b" />
          {/* Silver intake cowl ring */}
          <path
            d="M 233,95 C 238,95 241,101 241,108 C 241,115 238,121 233,121 L 236,121 C 241,121 244,115 244,108 C 244,101 241,95 236,95 Z"
            fill="#e2e8f0"
          />
        </g>

        {/* ================= LANDING GEAR ================= */}
        {gearDown ? (
          <g className="transition-opacity duration-300">
            {/* Nose Gear (Front) */}
            <g transform="translate(325, 92)">
              <rect x="0" y="0" width="3" height="32" fill="#64748b" />
              <rect x="-1" y="24" width="5" height="4" fill="#334155" />
              <circle cx="0" cy="35" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="0" cy="35" r="3" fill="#cbd5e1" />
            </g>

            {/* Main Gear (Center under wing) */}
            <g transform="translate(205, 106)">
              <polygon points="0,0 4,0 2,30 -2,30" fill="#475569" />
              <rect x="-10" y="28" width="22" height="4" rx="1" fill="#334155" />
              <circle cx="-6" cy="36" r="9" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
              <circle cx="-6" cy="36" r="3.8" fill="#cbd5e1" />
              <circle cx="8" cy="36" r="9" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
              <circle cx="8" cy="36" r="3.8" fill="#cbd5e1" />
            </g>
          </g>
        ) : (
          /* Gear retracted flush */
          <g opacity="0.7">
            <line x1="322" y1="92" x2="330" y2="92" stroke="#64748b" strokeWidth="1.5" />
            <line x1="200" y1="97" x2="216" y2="97" stroke="#64748b" strokeWidth="1.8" />
          </g>
        )}
      </svg>
    </div>
  );
};
