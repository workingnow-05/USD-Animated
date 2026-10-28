import React from 'react';

interface IndiaSkylineProps {
  scrollX: number;
  height?: number;
  width?: number;
}

export const IndiaSkyline: React.FC<IndiaSkylineProps> = ({ scrollX, height = 520, width = 1200 }) => {
  const silhouetteFill = '#034373';
  const midFill = '#075985';
  const backFill = '#0284c7';

  // Responsive center for the cloud formation
  const cloudCenterX = width < 640
    ? Math.round(Math.min(220, Math.max(160, width * 0.5)))
    : Math.round(Math.min(480, Math.max(340, width * 0.32)));
  const cloudCenterY = 72;

  return (
    <div
      className="absolute bottom-0 left-0 w-[2400px] pointer-events-none select-none will-change-transform"
      style={{
        height: `${height}px`,
        transform: `translate3d(${-scrollX}px, 0, 0)`,
      }}
    >
      <svg
        viewBox="0 0 2400 520"
        className="w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyTarmacIndia" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          <filter id="textShadowIndia" x="-20%" y="-30%" width="140%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#034373" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ================= SKY TYPOGRAPHY: "INDIA" WRITTEN IN WHITE IN THE SKY ================= */}
        {/* Clean white INDIA text in sky */}
        <g id="sky-india-text">
          <text
            x={cloudCenterX}
            y={cloudCenterY}
            textAnchor="middle"
            fontFamily="'Sofia Sans', system-ui, sans-serif"
            fontSize={width < 640 ? '28' : '38'}
            fontWeight="700"
            letterSpacing={width < 640 ? '8' : '12'}
            fill="#ffffff"
            filter="url(#textShadowIndia)"
            opacity="1"
          >
            INDIA
          </text>
        </g>

        {/* ================= INDIAN LANDMARKS ================= */}
        <g fill={backFill} opacity="0.65">
          <polygon points="745,130 755,130 757,330 743,330" />
          <polygon points="747,130 750,105 753,130" />
          <rect x="742" y="160" width="16" height="5" />
          <rect x="741" y="210" width="18" height="6" />
          <rect x="740" y="260" width="20" height="7" />
          <path d="M 960,290 L 960,250 Q 980,220 1000,250 L 1000,290 Z" />
        </g>

        {/* India Gate Silhouette */}
        <g fill={midFill}>
          <rect x="1100" y="230" width="150" height="100" rx="2" />
          <rect x="1115" y="130" width="34" height="100" />
          <rect x="1201" y="130" width="34" height="100" />
          <path d="M 1149,230 L 1149,165 C 1149,140 1201,140 1201,165 L 1201,230 Z" fill="#38bdf8" opacity="0.75" />
          <rect x="1110" y="115" width="130" height="15" />
          <rect x="1120" y="102" width="110" height="13" />
          <rect x="1135" y="92" width="80" height="10" />
        </g>

        {/* Lotus Temple Silhouette */}
        <g fill={silhouetteFill}>
          <path d="M 1440,320 C 1460,240 1490,210 1510,210 C 1530,210 1560,240 1580,320 Z" />
          <path d="M 1410,320 C 1435,250 1465,225 1485,225 C 1495,250 1502,285 1510,320 Z" opacity="0.85" />
          <path d="M 1610,320 C 1585,250 1555,225 1535,225 C 1525,250 1518,285 1510,320 Z" opacity="0.85" />
        </g>

        {/* Airport Control Tower */}
        <g fill={silhouetteFill}>
          <polygon points="338,125 348,125 352,330 334,330" />
          <polygon points="324,125 362,125 366,95 320,95" fill={midFill} />
          <rect x="324" y="100" width="38" height="15" fill="#bae6fd" opacity="0.8" />
          <circle cx="343" cy="75" r="8" fill="#e0f2fe" />
          <line x1="343" y1="67" x2="343" y2="56" stroke="#ef4444" strokeWidth="2" />
          <circle cx="343" cy="55" r="3.5" fill="#ef4444">
            <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Terminal Building */}
        <g fill={silhouetteFill}>
          <rect x="60" y="240" width="270" height="90" rx="3" />
          {Array.from({ length: 9 }).map((_, i) => (
            <rect
              key={i}
              x={80 + i * 26}
              y={260}
              width={16}
              height={30}
              rx={1}
              fill="#bae6fd"
              opacity="0.65"
            />
          ))}
        </g>

        {/* Palms */}
        {[30, 390, 440, 680, 890, 1060, 1280, 1640, 1800].map((px, idx) => (
          <g key={idx} fill={silhouetteFill} opacity="0.85">
            <path d={`M ${px},330 Q ${px + 5},280 ${px + 2},250 Q ${px + 3},280 ${px + 4},330 Z`} />
            <circle cx={px + 2} cy={245} r={14} />
            <path d={`M ${px + 2},245 Q ${px - 18},225 ${px - 28},245 Q ${px - 10},238 ${px + 2},245 Z`} />
            <path d={`M ${px + 2},245 Q ${px + 22},225 ${px + 32},245 Q ${px + 14},238 ${px + 2},245 Z`} />
          </g>
        ))}

        {/* ================= CONTINUOUS RUNWAY WITH CLEAN DASHED CENTERLINE ================= */}
        <rect x="0" y="330" width="2400" height="190" fill="url(#skyTarmacIndia)" />
        <line x1="0" y1="344" x2="2400" y2="344" stroke="#ffffff" strokeWidth="3" opacity="0.85" />

        {/* Continuous dashed centerline across runway (clean dashes) */}
        {Array.from({ length: 38 }).map((_, i) => (
          <line
            key={i}
            x1={i * 65}
            y1="380"
            x2={i * 65 + 40}
            y2="380"
            stroke="#ffffff"
            strokeWidth="5"
            strokeDasharray="40 25"
            opacity="0.85"
            strokeLinecap="round"
          />
        ))}

        {/* Inset Lights */}
        {Array.from({ length: 32 }).map((_, i) => (
          <circle
            key={i}
            cx={i * 75 + 30}
            cy={342}
            r={2.5}
            fill={i < 4 ? '#22c55e' : '#bae6fd'}
          />
        ))}
      </svg>
    </div>
  );
};
