/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Telemetry, FlightPhase } from './types/flight';
import { soundEngine } from './audio/soundEngine';
import { IndiaSkyline } from './components/IndiaSkyline';
import { SanDiegoSkyline } from './components/SanDiegoSkyline';
import { Airplane2D } from './components/Airplane2D';
import { ParallaxLandscape } from './components/ParallaxLandscape';
import './flight-odyssey.css';

// Total animation duration: 6.5 seconds (strictly 6-7 seconds)
const FLIGHT_DURATION_SECONDS = 6.5;

export default function FlightOdyssey({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const [progress, setProgress] = useState(0); // 0 to 100
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const completedRef = useRef(false);

  const prevProgressRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Responsive container observer for seamless embedding in any website layout
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDimensions({ width: clientWidth, height: clientHeight });
          return;
        }
      }
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getPhase = (pct: number): FlightPhase => {
    if (pct < 36) return 'takeoff';
    if (pct < 74) return 'cruise';
    if (pct < 89) return 'descent';
    if (pct < 98) return 'landing';
    return 'arrived';
  };

  // Real flight physics calculations:
  // 1. Takeoff roll (0% - 18%): Slow acceleration, level on runway wheels
  // 2. Eagle Climb (18% - 36%): Front part rotates UP first (-13° to 0°), smooth climb
  // 3. Constant Cruise (36% - 74%): Constant speed (550 kts), perfectly level (0°)
  // 4. Smooth Descent (74% - 89%): Gentle glide slope, nose tilts slightly down (+2.8°)
  // 5. Flare (89% - 92%): Levels out smoothly to 0° right before touchdown
  // 6. Touchdown & Rollout (92% - 100%): Tire screech, smooth deceleration, stops dead center
  const computeTelemetry = (pct: number): Telemetry => {
    let alt = 0;
    let spd = 0;
    let pitch = 0;
    let gear = true;

    if (pct < 18) {
      // Slow takeoff start on India runway - gradual quadratic acceleration
      const t = pct / 18;
      alt = 0;
      spd = Math.round(Math.pow(t, 1.8) * 165);
      pitch = 0;
      gear = true;
    } else if (pct < 36) {
      // Liftoff & Eagle climb: Front part goes up first (-13° to 0°)
      const t = (pct - 18) / 18;
      const smoothT = t * t * (3 - 2 * t);
      alt = Math.round(smoothT * 38000);
      spd = Math.round(165 + t * 385);
      // Nose-up pitch: front part rotates up first like an eagle, smoothly leveling out
      pitch = -13.0 * Math.cos(t * (Math.PI / 2));
      gear = pct < 25; // Gear retracts after positive rate of climb
    } else if (pct < 74) {
      // Constant Cruise: Stable altitude, constant speed, completely level
      alt = 38000;
      spd = 550;
      pitch = 0;
      gear = false;
    } else if (pct < 89) {
      // Smooth descent into San Diego: Glide slope with slight nose-down tilt
      const t = (pct - 74) / 15;
      const smoothT = 0.5 - 0.5 * Math.cos(t * Math.PI);
      alt = Math.round(38000 * (1 - smoothT * 0.88));
      spd = Math.round(550 - t * 320);
      pitch = 2.8 * Math.sin(t * Math.PI); // Front tilts slightly downward along glide path
      gear = pct >= 82; // Gear extends on final approach
    } else if (pct < 92) {
      // Smooth landing flare: Nose gently levels out from descent pitch to 0°
      const t = (pct - 89) / 3;
      alt = Math.round(4560 * (1 - t));
      spd = Math.round(230 - t * 85);
      pitch = 2.8 * (1 - t); // Levels to 0°
      gear = true;
    } else {
      // Touchdown & Rollout: Flat on wheels (0°), decelerating smoothly to stop
      const t = (pct - 92) / 8;
      alt = 0;
      spd = Math.max(0, Math.round(145 * Math.pow(1 - t, 1.6)));
      pitch = 0;
      gear = true;
    }

    const dist = Math.round((pct / 100) * 13840);

    return {
      progress: pct,
      phase: getPhase(pct),
      altitudeFeet: alt,
      groundSpeedKnots: spd,
      distanceKm: dist,
      pitchDeg: pitch,
      gearDown: gear,
    };
  };

  const telemetry = computeTelemetry(progress);

  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      const landingDelay = window.setTimeout(onComplete, 1000);
      return () => window.clearTimeout(landingDelay);
    }
  }, [progress, onComplete]);

  useEffect(() => () => soundEngine.stop(), []);

  // Real flight & landing audio synchronization (A320 takeoff, cruise airflow, KLM reverse thrust, tire screech)
  useEffect(() => {
    const prev = prevProgressRef.current;
    prevProgressRef.current = progress;

    if (!isMuted && isPlaying) {
      soundEngine.startFlightAudio(progress);
      soundEngine.updateAcoustics(progress);
    }
  }, [progress, isMuted, isPlaying]);

  // Main 6.5-second animation loop
  const updateLoop = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        const increment = (dt / FLIGHT_DURATION_SECONDS) * 100;
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            setIsPlaying(false);
            soundEngine.stop();
            return 100;
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(updateLoop);
    },
    [isPlaying]
  );

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateLoop]);

  // ================= RESPONSIVE GEOMETRY & BREAKPOINTS =================
  const { width, height } = dimensions;

  // Responsive plane scaling:
  // Mobile (<480px): ~189px width
  // Small tablet / phablet (480-768px): ~243px width
  // Tablet (768-1024px): ~302px width
  // Desktop (1024px+): ~357px width
  const planeScale = useMemo(() => {
    if (width < 480) return 0.45;
    if (width < 768) return 0.58;
    if (width < 1024) return 0.72;
    return 0.85;
  }, [width]);

  // Responsive skyline height: scales proportionally with container height
  const skylineHeight = useMemo(() => {
    return Math.min(520, Math.max(260, height * 0.52));
  }, [height]);

  // Mathematical ground alignment:
  // In the 520px SVG, the runway edge line is at y = 344 (176px from bottom).
  // The plane's transform origin is at (55% 65%) = (231, 107.25).
  // The bottom of the wheels is at y = 151, which is 43.75px below origin.
  // When scaled, the wheel contact sits exactly on runwaySurfaceY with zero offset error!
  const runwayHeightFromBottom = 176 * (skylineHeight / 520);
  const runwaySurfaceY = height - runwayHeightFromBottom;
  const planeOriginYOffset = 107.25;
  const tireBottomOffset = 43.75 * planeScale;
  const groundPlaneY = runwaySurfaceY - planeOriginYOffset - tireBottomOffset;

  // Cruise altitude in the upper third of the sky
  const cruisePlaneY = Math.max(40, height * 0.20) - planeOriginYOffset;

  // Visual screen center for landing (transforms around origin at x = 231)
  const centerLandingX = width * 0.5 - 231;

  let planeX = width * 0.14;
  let planeY = groundPlaneY;

  if (progress < 18) {
    // 1. Slow takeoff roll in India with smooth quadratic acceleration
    const t = progress / 18;
    const accelT = Math.pow(t, 1.8);
    const startX = width < 640 ? width * 0.03 : width * 0.05;
    const rollDistance = width < 640 ? width * 0.14 : width * 0.16;
    planeX = startX + accelT * rollDistance;
    planeY = groundPlaneY;
  } else if (progress < 36) {
    // 2. Liftoff & Eagle climb: Front part goes up first, climbing gracefully
    const t = (progress - 18) / 18;
    const smoothT = t * t * (3 - 2 * t);
    const startClimbX = width < 640 ? width * 0.17 : width * 0.21;
    const targetCruiseX = width < 640 ? width * 0.28 : width * 0.33;
    planeX = startClimbX + (targetCruiseX - startClimbX) * t;
    planeY = groundPlaneY - (groundPlaneY - cruisePlaneY) * smoothT;
  } else if (progress < 74) {
    // 3. Constant Cruise: Constant speed, steady position with subtle aerodynamic air cushion
    planeX = width < 640 ? width * 0.28 : width * 0.33;
    const t = (progress - 36) / 38;
    planeY = cruisePlaneY + Math.sin(t * 7.5) * 3.5;
  } else if (progress < 89) {
    // 4. Smooth descent: Gliding smoothly toward San Diego runway
    const t = (progress - 74) / 15;
    const smoothT = t * t * (3 - 2 * t);
    const startX = width < 640 ? width * 0.28 : width * 0.33;
    const approachX = centerLandingX - (width < 640 ? 35 : 55);
    planeX = startX + (approachX - startX) * smoothT;
    planeY = cruisePlaneY + (groundPlaneY - cruisePlaneY) * 0.76 * smoothT;
  } else if (progress < 92) {
    // 5. Landing flare: Gentle cushioning down to the runway surface
    const t = (progress - 89) / 3;
    const smoothT = 0.5 - 0.5 * Math.cos(t * Math.PI);
    const flareStartX = centerLandingX - (width < 640 ? 35 : 55);
    planeX = flareStartX + smoothT * (width < 640 ? 25 : 35);
    planeY = cruisePlaneY + (groundPlaneY - cruisePlaneY) * (0.76 + smoothT * 0.24);
  } else {
    // 6. Touchdown & Rollout: Lands and decelerates smoothly directly to screen center
    const t = (progress - 92) / 8;
    const rollEase = 1 - Math.pow(1 - t, 2.2);
    const rolloutOffset = width < 640 ? 12 : 20;
    planeX = centerLandingX - rolloutOffset + rollEase * rolloutOffset;
    const dampBounce = Math.exp(-t * 9) * Math.sin(t * 22) * 3.2;
    planeY = groundPlaneY + dampBounce;
  }

  // India runway scrolls away smoothly during climb
  const indiaScrollX = Math.min(2400, Math.pow(progress / 18, 1.8) * 320 + Math.max(0, progress - 18) * 140);
  const showIndia = progress < 34;

  // San Diego runway arrives on approach (~81%) to meet plane at touchdown (92%)
  const showSanDiego = progress >= 81;
  const sdProgress = Math.max(0, progress - 81);
  const sanDiegoScrollX = Math.max(0, 880 - Math.pow(sdProgress / 19, 0.88) * 880);

  const parallaxScroll = progress * 1350;
  const altitudeRatio = Math.max(0, Math.min(1, (groundPlaneY - planeY) / (groundPlaneY - cruisePlaneY)));

  return (
    <div
      ref={containerRef}
      className="flight-odyssey relative w-full h-full overflow-hidden select-none bg-sky-600 font-sans"
      style={{
        // Full responsive adaptation whether rendered standalone or embedded in website card/section
        minHeight: '100%',
        height: '100vh',
      }}
    >
      {/* 1. Sky & Parallax Landscape */}
      <ParallaxLandscape
        scrollX={parallaxScroll}
        altitudeRatio={altitudeRatio}
      />

      {/* 2. India Skyline & Runway */}
      {showIndia && (
        <div
          className="transition-opacity duration-300"
          style={{ opacity: progress > 26 ? Math.max(0, 1 - (progress - 26) / 8) : 1 }}
        >
          <IndiaSkyline scrollX={indiaScrollX} height={skylineHeight} width={width} />
        </div>
      )}

      {/* 3. San Diego Skyline & Continuous Runway */}
      {showSanDiego && (
        <div
          className="transition-opacity duration-300"
          style={{ opacity: progress < 85 ? (progress - 81) / 4 : 1 }}
        >
          <SanDiegoSkyline scrollX={sanDiegoScrollX} height={skylineHeight} width={width} />
        </div>
      )}

      {/* 4. Sleek 2D Commercial Airplane */}
      <Airplane2D
        x={planeX}
        y={planeY}
        pitchDeg={telemetry.pitchDeg}
        scale={planeScale}
        gearDown={telemetry.gearDown}
        isTouchdown={progress >= 91.8 && progress <= 95.0}
        thrustRatio={progress < 18 ? 0.3 + (progress / 18) * 0.7 : progress < 36 ? 1 : 0.65}
      />

    </div>
  );
}
