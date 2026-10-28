import React from 'react';

interface SanDiegoSkylineProps {
  scrollX?: number;
  translateX?: number;
  height?: number;
  width?: number;
}

export const SanDiegoSkyline: React.FC<SanDiegoSkylineProps> = ({
  scrollX = 0,
  translateX,
  height = 520,
  width = 1200,
}) => {
  const silhouetteFill = '#034373';
  const midFill = '#075985';
  const backFill = '#0284c7';
  const windowGlow = '#bae6fd';

  // Responsive center for the San Diego text in the sky
  const cloudCenterX = width < 640
    ? Math.round(Math.min(210, Math.max(170, width * 0.5)))
    : Math.round(Math.min(840, Math.max(520, width * 0.52)));
  const cloudCenterY = 72;

  const actualTranslateX = translateX !== undefined ? translateX : -scrollX;

  return (
    <div
      className="absolute bottom-0 left-[-1200px] w-[4000px] pointer-events-none select-none will-change-transform"
      style={{
        height: `${height}px`,
        transform: `translate3d(${actualTranslateX}px, 0, 0)`,
      }}
    >
      <svg
        viewBox="-1200 0 4000 520"
        className="w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sdTarmacBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          <linearGradient id="sdWaterBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#082f49" stopOpacity="0.9" />
          </linearGradient>
          <filter id="textShadowSD" x="-20%" y="-30%" width="140%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#034373" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ================= SKY TYPOGRAPHY: "SAN DIEGO" WRITTEN IN WHITE IN THE SKY ================= */}
        <g id="sky-sandiego-text">
          <text
            x={cloudCenterX}
            y={cloudCenterY}
            textAnchor="middle"
            fontFamily="'Sofia Sans', system-ui, sans-serif"
            fontSize={width < 640 ? '26' : '36'}
            fontWeight="700"
            letterSpacing={width < 640 ? '7' : '10'}
            fill="#ffffff"
            filter="url(#textShadowSD)"
            opacity="1"
          >
            SAN DIEGO
          </text>
        </g>

        {/* Coastal California Mountains */}
        <path
          d="M-1200,280 Q-600,230 0,280 Q350,210 700,240 T1400,200 T2100,230 L2800,250 L2800,340 L-1200,340 Z"
          fill={backFill}
          opacity="0.4"
        />

        {/* San Diego Skyline (One America Plaza pyramid roof, towers) */}
        <g fill={midFill}>
          <rect x="510" y="160" width="45" height="170" />
          <polygon points="510,160 532,130 555,160" />
          <rect x="565" y="170" width="45" height="160" />
          <polygon points="565,170 587,140 610,170" />

          {/* One America Plaza crystal pyramid obelisk */}
          <rect x="670" y="140" width="60" height="190" />
          <polygon points="670,140 700,80 730,140" fill={silhouetteFill} />
          <polygon points="685,140 700,90 715,140" fill={windowGlow} opacity="0.6" />

          {/* Emerald Plaza towers */}
          <rect x="760" y="180" width="35" height="150" />
          <polygon points="760,180 777,155 795,180" />
          <rect x="800" y="165" width="40" height="165" />
          <polygon points="800,165 820,138 840,165" />

          {/* Harbor Drive high-rises */}
          <rect x="860" y="175" width="55" height="155" />
          <rect x="930" y="150" width="50" height="180" />
          <rect x="990" y="190" width="65" height="140" />
          <rect x="1070" y="160" width="55" height="170" />
          <rect x="1140" y="175" width="70" height="155" />
        </g>

        {/* Office window glints */}
        <g fill={windowGlow} opacity="0.65">
          {Array.from({ length: 7 }).map((_, r) => (
            <React.Fragment key={r}>
              <rect x="520" y={175 + r * 16} width="25" height="5" />
              <rect x="575" y={185 + r * 15} width="25" height="5" />
              <rect x="682" y={155 + r * 17} width="36" height="6" />
              <rect x="770" y={195 + r * 14} width="16" height="5" />
              <rect x="872" y={190 + r * 15} width="32" height="5" />
              <rect x="942" y={165 + r * 17} width="26" height="5" />
            </React.Fragment>
          ))}
        </g>

        {/* Coronado Bay Bridge sweeping over San Diego Bay */}
        <g fill={silhouetteFill}>
          <path d="M0,285 Q260,255 520,295 L520,305 Q260,265 0,295 Z" fill="#0369a1" />
          {[90, 180, 270, 360, 440].map((bx, i) => (
            <polygon key={i} points={`${bx - 6},${280 - i * 2} ${bx + 6},${280 - i * 2} ${bx + 9},340 ${bx - 9},340`} fill={midFill} />
          ))}
          {/* Bridge deck lights */}
          {[45, 90, 135, 180, 225, 270, 315, 360, 405, 450].map((lx, i) => (
            <circle
              key={i}
              cx={lx}
              cy={280 - Math.sin((lx / 520) * Math.PI) * 18}
              r={1.8}
              fill="#bae6fd"
              opacity="0.85"
            />
          ))}
        </g>

        {/* San Diego Bay Water & Marina Sailboats */}
        <rect x="-1200" y="325" width="4000" height="30" fill="url(#sdWaterBlue)" />
        {[180, 300, 420].map((sx, i) => (
          <g key={i} fill={silhouetteFill} opacity="0.85">
            <path d={`M${sx - 12},330 L${sx + 15},330 L${sx + 11},335 L${sx - 9},335 Z`} />
            <line x1={sx} y1="330" x2={sx} y2="308" stroke="#64748b" strokeWidth="1" />
            <polygon points={`${sx},309 ${sx + 11},328 ${sx},328`} fill="#ffffff" opacity="0.85" />
          </g>
        ))}

        {/* California Fan Palms */}
        {[880, 1120, 1370, 1400, 1640, 2040, 2220, 2480].map((px, idx) => (
          <g key={idx} fill={silhouetteFill} opacity="0.85">
            <path d={`M${px},330 Q${px + 8},270 ${px + 5},230 Q${px + 6},270 ${px + 2},330 Z`} />
            <circle cx={px + 5} cy={230} r={14} />
            <path d={`M${px + 5},230 Q${px - 22},210 ${px - 34},232 Q${px - 14},222 ${px + 5},230 Z`} />
            <path d={`M${px + 5},230 Q${px + 26},210 ${px + 38},232 Q${px + 18},222 ${px + 5},230 Z`} />
          </g>
        ))}

        {/* ================= CONTINUOUS RUNWAY WITH CLEAN DASHED CENTERLINE ================= */}
        {/* Runway Tarmac base */}
        <rect x="-1200" y="330" width="4000" height="190" fill="url(#sdTarmacBlue)" />
        {/* Solid Runway edge line */}
        <line x1="-1200" y1="344" x2="2800" y2="344" stroke="#ffffff" strokeWidth="3" opacity="0.85" />

        {/* Clean, continuous dashed centerline across the entire runway */}
        {Array.from({ length: 62 }).map((_, idx) => {
          const i = idx - 18;
          return (
            <line
              key={idx}
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
          );
        })}

        {/* Continuous Runway Edge Inset Lights */}
        {Array.from({ length: 54 }).map((_, idx) => {
          const i = idx - 16;
          return (
            <circle
              key={idx}
              cx={i * 74 + 30}
              cy={342}
              r={2.5}
              fill={i < 4 && i >= 0 ? '#22c55e' : '#bae6fd'}
            />
          );
        })}
      </svg>
    </div>
  );
};
