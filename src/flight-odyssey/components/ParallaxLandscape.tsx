import React from 'react';

interface ParallaxLandscapeProps {
  scrollX: number;
  altitudeRatio: number;
}

export const ParallaxLandscape: React.FC<ParallaxLandscapeProps> = ({
  scrollX,
  altitudeRatio,
}) => {
  const SEGMENT_WIDTH = 1920;

  // Very subtle parallax rates
  const distMtnOffset = (scrollX * 0.12) % SEGMENT_WIDTH;
  const rareCloudsOffset = (scrollX * 0.28) % SEGMENT_WIDTH;
  const midHillsOffset = (scrollX * 0.5) % SEGMENT_WIDTH;
  const oceanOffset = (scrollX * 0.75) % SEGMENT_WIDTH;

  const terrainDropY = altitudeRatio * 140;

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none pointer-events-none"
      style={{
        // Vibrant azure / sky blue gradient matching the reference screenshot
        background: 'linear-gradient(to bottom, #0284c7 0%, #0ea5e9 40%, #38bdf8 75%, #7dd3fc 100%)',
      }}
    >
      {/* Radiant natural sunlight in upper sky */}
      <div
        className="absolute top-0 right-1/4 w-[800px] h-[500px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, #ffffff 0%, rgba(255, 255, 255, 0.4) 40%, transparent 75%)',
        }}
      />

      {/* ================= LAYER 1: Distant Mountain Silhouettes ================= */}
      <div
        className="absolute bottom-0 left-0 w-[3840px] h-[320px] will-change-transform"
        style={{
          transform: `translate3d(${-distMtnOffset}px, ${terrainDropY * 0.35}px, 0)`,
        }}
      >
        <svg viewBox="0 0 3840 320" className="w-full h-full" preserveAspectRatio="none">
          <g fill="#0369a1" opacity="0.45">
            {[0, 1920].map((baseX) => (
              <polygon
                key={baseX}
                points={`
                  ${baseX + 0},320 
                  ${baseX + 0},200 
                  ${baseX + 280},120 
                  ${baseX + 540},195 
                  ${baseX + 800},105 
                  ${baseX + 1060},180 
                  ${baseX + 1300},95 
                  ${baseX + 1560},170 
                  ${baseX + 1780},110 
                  ${baseX + 1920},195 
                  ${baseX + 1920},320
                `}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* ================= LAYER 2: Very Little and Rare Subtle Clouds (As Requested) ================= */}
      <div
        className="absolute bottom-40 left-0 w-[3840px] h-[160px] will-change-transform"
        style={{
          transform: `translate3d(${-rareCloudsOffset}px, ${terrainDropY * 0.2}px, 0)`,
        }}
      >
        <svg viewBox="0 0 3840 160" className="w-full h-full" preserveAspectRatio="none">
          {[0, 1920].map((baseX) => (
            <g key={baseX} fill="#ffffff" opacity="0.65">
              {/* Rare cloud formation 1: A single gentle wisp */}
              <g transform={`translate(${baseX + 380}, 50)`}>
                <ellipse cx="120" cy="40" rx="110" ry="22" />
                <ellipse cx="170" cy="28" rx="70" ry="28" />
                <ellipse cx="80" cy="44" rx="55" ry="16" opacity="0.5" />
              </g>

              {/* Rare cloud formation 2: Another distant wisp far away */}
              <g transform={`translate(${baseX + 1340}, 45)`}>
                <ellipse cx="140" cy="42" rx="125" ry="24" />
                <ellipse cx="200" cy="30" rx="80" ry="30" />
                <ellipse cx="270" cy="44" rx="65" ry="18" opacity="0.5" />
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* ================= LAYER 3: Coastal Hills ================= */}
      <div
        className="absolute bottom-0 left-0 w-[3840px] h-[240px] will-change-transform"
        style={{
          transform: `translate3d(${-midHillsOffset}px, ${terrainDropY * 0.65}px, 0)`,
        }}
      >
        <svg viewBox="0 0 3840 240" className="w-full h-full" preserveAspectRatio="none">
          <g fill="#0284c7" opacity="0.6">
            {[0, 1920].map((baseX) => (
              <path
                key={baseX}
                d={`
                  M ${baseX + 0},240 
                  L ${baseX + 0},140 
                  Q ${baseX + 240},80 ${baseX + 480},125 
                  T ${baseX + 960},110 
                  T ${baseX + 1440},120 
                  T ${baseX + 1920},135 
                  L ${baseX + 1920},240 Z
                `}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* ================= LAYER 4: Sparkling Blue Ocean Water ================= */}
      <div
        className="absolute bottom-0 left-0 w-[3840px] h-[110px] will-change-transform"
        style={{
          transform: `translate3d(${-oceanOffset}px, ${terrainDropY}px, 0)`,
        }}
      >
        <svg viewBox="0 0 3840 110" className="w-full h-full" preserveAspectRatio="none">
          <rect x="0" y="28" width="3840" height="82" fill="#0369a1" opacity="0.8" />
          {[0, 1920].map((baseX) => (
            <g key={baseX} fill="none" stroke="#bae6fd" strokeWidth="1.2" opacity="0.5">
              <path d={`M ${baseX + 140},44 Q ${baseX + 210},40 ${baseX + 280},44`} />
              <path d={`M ${baseX + 540},55 Q ${baseX + 620},51 ${baseX + 700},55`} />
              <path d={`M ${baseX + 980},46 Q ${baseX + 1060},42 ${baseX + 1140},46`} />
              <path d={`M ${baseX + 1450},58 Q ${baseX + 1530},54 ${baseX + 1610},58`} />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
