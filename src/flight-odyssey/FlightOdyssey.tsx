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

// Total animation duration: 6.0 seconds (strictly 6 seconds)
const FLIGHT_DURATION_SECONDS = 6.0;

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
    if (pct < 42) return 'takeoff';
    if (pct < 70) return 'cruise';
    if (pct < 88) return 'descent';
    if (pct < 98) return 'landing';
    return 'arrived';
  };

  // Real flight physics calculations:
  // 1. Full Takeoff roll (0% - 26%): Accelerates across India runway to the very last edge
  // 2. Eagle Climb (26% - 42%): Liftoff right at the edge, front rotates UP first (-13° to 0°)
  // 3. Constant Cruise (42% - 70%): Constant speed (550 kts), perfectly level (0°)
  // 4. Smooth Descent (70% - 88%): Gentle glide slope toward San Diego runway ahead
  // 5. Flare (88% - 92%): Levels out smoothly to 0° right before touchdown
  // 6. Touchdown & Rollout (92% - 100%): Flat on wheels (0°), uniform deceleration to dead center
  const computeTelemetry = (pct: number): Telemetry => {
    let alt = 0;
    let spd = 0;
    let pitch = 0;
    let gear = true;

    if (pct < 26) {
      // Long takeoff roll across India runway tarmac towards the very edge
      const t = pct / 26;
      const accelT = Math.pow(t, 1.6);
      alt = 0;
      spd = Math.round(accelT * 175);
      pitch = 0;
      gear = true;
    } else if (pct < 42) {
      // Eagle Liftoff & climb right at the very edge of the runway
      const t = (pct - 26) / 16;
      const smoothT = t * t * (3 - 2 * t);
      alt = Math.round(smoothT * 38000);
      spd = Math.round(175 + t * 375);
      // Nose-up pitch: front part rotates up first like an eagle, smoothly leveling out
      pitch = -13.0 * Math.cos(t * (Math.PI / 2));
      gear = pct < 33; // Gear retracts after positive rate of climb
    } else if (pct < 70) {
      // Constant Cruise: Stable altitude, constant speed, completely level
      alt = 38000;
      spd = 550;
      pitch = 0;
      gear = false;
    } else if (pct < 88) {
      // Smooth descent into San Diego: Glide slope with slight nose-down tilt
      const t = (pct - 70) / 18;
      const smoothT = 0.5 - 0.5 * Math.cos(t * Math.PI);
      alt = Math.round(38000 * (1 - smoothT * 0.88));
      spd = Math.round(550 - t * 320);
      pitch = 2.5 * Math.sin(t * Math.PI);
      gear = pct >= 80;
    } else if (pct < 92) {
      // Smooth landing flare: Nose gently levels out from descent pitch to 0°
      const t = (pct - 88) / 4;
      alt = Math.round(4560 * (1 - t));
      spd = Math.round(230 - t * 85);
      pitch = 2.5 * (1 - t); // Levels to 0°
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
            soundEngine.onFlightComplete();
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

  const handleReplay = () => {
    setProgress(0);
    setIsPlaying(true);
    soundEngine.stop();
    if (!isMuted) {
      soundEngine.startFlightAudio(0);
    }
  };

  // Spacebar and mute hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (progress >= 99) {
          handleReplay();
        } else {
          setIsPlaying((p) => {
            if (!p && !isMuted) soundEngine.startFlightAudio(progress);
            if (p) soundEngine.stop();
            return !p;
          });
        }
      } else if (e.code === 'KeyM') {
        const nextMuted = soundEngine.toggleMute();
        setIsMuted(nextMuted);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progress, isMuted]);

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

  const startX = width < 640 ? width * 0.02 : width * 0.04;
  const rollDistance = width < 640 ? width * 0.28 : width * 0.33;
  const liftoffX = startX + rollDistance;
  const targetCruiseX = width < 640 ? width * 0.28 : width * 0.34;
  const approachX = centerLandingX - (width < 640 ? 35 : 55);

  if (progress < 26) {
    // 1. Takeoff roll across India runway tarmac towards the very edge
    const t = progress / 26;
    const accelT = Math.pow(t, 1.6);
    planeX = startX + accelT * rollDistance;
    planeY = groundPlaneY;
  } else if (progress < 42) {
    // 2. Liftoff at the very edge of runway & Eagle climb: Front part rotates UP first
    const t = (progress - 26) / 16;
    const smoothT = t * t * (3 - 2 * t);
    planeX = liftoffX + (targetCruiseX - liftoffX) * t;
    planeY = groundPlaneY - (groundPlaneY - cruisePlaneY) * smoothT;
  } else if (progress < 70) {
    // 3. Constant Cruise: Constant speed, steady position with subtle aerodynamic cushioning
    planeX = targetCruiseX;
    const t = (progress - 42) / 28;
    planeY = cruisePlaneY + Math.sin(t * 6.28) * 2.5;
  } else if (progress < 88) {
    // 4. Smooth descent toward San Diego runway ahead (new forward-approaching version)
    const t = (progress - 70) / 18;
    const smoothT = t * t * (3 - 2 * t);
    planeX = targetCruiseX + (approachX - targetCruiseX) * smoothT;
    planeY = cruisePlaneY + (groundPlaneY - cruisePlaneY) * 0.78 * smoothT;
  } else if (progress < 92) {
    // 5. Landing flare: Gentle cushioning down to the runway surface
    const t = (progress - 88) / 4;
    const smoothT = 0.5 - 0.5 * Math.cos(t * Math.PI);
    const flareStartY = cruisePlaneY + (groundPlaneY - cruisePlaneY) * 0.78;
    planeX = approachX + (centerLandingX - approachX) * (0.25 * t);
    planeY = flareStartY + (groundPlaneY - flareStartY) * smoothT;
  } else {
    // 6. Touchdown & Rollout: Lands and decelerates smoothly directly to screen center
    const t = (progress - 92) / 8;
    const rollEase = 1 - Math.pow(1 - t, 2.0);
    planeX = approachX + (centerLandingX - approachX) * (0.25 + 0.75 * rollEase);
    const dampBounce = Math.exp(-t * 12) * Math.sin(t * 24) * 2.5;
    planeY = groundPlaneY + dampBounce;
  }

  // India runway scrolls under wheels towards the very edge before liftoff
  const rollT = progress / 26;
  const accelT = Math.pow(Math.min(1, rollT), 1.6);
  const indiaScrollX = progress < 26
    ? accelT * 1400
    : 1400 + ((progress - 26) / 16) * 1000;
  const showIndia = progress < 42;

  // San Diego landscape emerges ahead of the plane from the forward future (on the right)
  // and smoothly streams from right to left as the airplane lands on it uniformly (new version)
  const showSanDiego = progress >= 70;
  const initialForwardOffset = width < 640 ? Math.min(300, width * 0.65) : Math.min(750, width * 0.52);
  const sdT = Math.max(0, Math.min(1, (progress - 70) / 30));
  const easeRemaining = Math.pow(1 - sdT, 1.35);
  const sanDiegoTranslateX = initialForwardOffset * easeRemaining;

  const parallaxScroll = progress * 1350;
  const altitudeRatio = Math.max(0, Math.min(1, (groundPlaneY - planeY) / (groundPlaneY - cruisePlaneY)));

  return (
    <div
      ref={containerRef}
      onClick={() => {
        if (progress >= 99) {
          handleReplay();
        } else {
          setIsPlaying((p) => {
            if (!p && !isMuted) soundEngine.startFlightAudio(progress);
            if (p) soundEngine.stop();
            return !p;
          });
        }
      }}
      className="flight-odyssey relative w-full h-full min-h-[420px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[660px] overflow-hidden select-none bg-sky-600 font-sans cursor-pointer"
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
          style={{ opacity: progress > 34 ? Math.max(0, 1 - (progress - 34) / 8) : 1 }}
        >
          <IndiaSkyline scrollX={indiaScrollX} height={skylineHeight} width={width} />
        </div>
      )}

      {/* 3. San Diego Skyline & Continuous Runway (Approaches from ahead in the future) */}
      {showSanDiego && (
        <div
          className="transition-opacity duration-300"
          style={{ opacity: progress < 76 ? (progress - 70) / 6 : 1 }}
        >
          <SanDiegoSkyline translateX={sanDiegoTranslateX} height={skylineHeight} width={width} />
        </div>
      )}

      {/* 4. Sleek 2D Commercial Airplane */}
      <Airplane2D
        x={planeX}
        y={planeY}
        pitchDeg={telemetry.pitchDeg}
        scale={planeScale}
        gearDown={telemetry.gearDown}
        isTouchdown={progress >= 91.5 && progress <= 94.5}
        thrustRatio={progress < 26 ? 0.3 + (progress / 26) * 0.7 : progress < 42 ? 1 : 0.65}
      />

    </div>
  );
}
