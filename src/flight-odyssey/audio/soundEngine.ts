/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Intelligent Smooth Flight Acoustic Engine
 * Seamlessly plays the microsecond-aligned, equal-power blended master audio
 * created directly from the three user-provided airplane recordings:
 * 1. Takeoff: southbaysounds-airplane-taking-off-214796_cc192e9a.mp3
 * 2. Flying: freesound_community-airplane-fly-by-26222_fd9ad37f.mp3
 * 3. Landing: freesound_community-airplane-landing-6732_f10569bb.mp3
 *
 * Designed with a pure, transparent signal chain (no compressor pumping or
 * abrupt filter cutoff snapping) to ensure buttery smooth audio from liftoff to touchdown.
 */

const FLIGHT_DURATION = 6.0; // seconds (strictly 6 seconds)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  // Master Buffer
  private masterBuffer: AudioBuffer | null = null;

  // Transparent, artifact-free gain node
  private masterGain: GainNode | null = null;
  private activeSourceNode: AudioBufferSourceNode | null = null;

  private startTime: number = 0;
  private startOffset: number = 0;
  private isLoaded: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadAudio();
    }
  }

  private initContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Preload and decode the smoothly blended master audio
   */
  private async preloadAudio() {
    try {
      const res = await fetch('/audio/flight_journey_master.mp3');
      if (!res.ok) return;
      const arrayBuf = await res.arrayBuffer();
      const ctx = this.initContext();
      if (!ctx) return;
      this.masterBuffer = await ctx.decodeAudioData(arrayBuf);
      this.isLoaded = true;

      // If user started flight before decode finished, start smoothly
      if (this.isPlaying && !this.isMuted) {
        this.startAt(this.startOffset);
      }
    } catch {
      // Graceful error recovery
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
      }
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(0.8, this.ctx.currentTime, 0.04);
      }
      if (!this.isPlaying) {
        this.startFlightAudio();
      }
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Start or resume flight audio synchronized with current progress
   */
  public startFlightAudio(progressPct: number = 0) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    if (this.isPlaying && this.activeSourceNode) {
      return;
    }

    const offsetSec = Math.max(0, Math.min(FLIGHT_DURATION, (progressPct / 100) * FLIGHT_DURATION));
    this.isPlaying = true;
    this.startAt(offsetSec);
  }

  /**
   * Smoothly start playback at a specific offset with anti-click envelope
   */
  private startAt(offsetSeconds: number) {
    if (!this.ctx || !this.isLoaded || this.isMuted || !this.masterBuffer) return;

    try {
      this.stopActiveNode(0.02);

      const now = this.ctx.currentTime;

      // Clean, uncompressed transparent Master Gain
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
      }

      // Smooth anti-pop fade in
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.8, now + 0.05);

      const source = this.ctx.createBufferSource();
      source.buffer = this.masterBuffer;
      // Play at natural 1.0x rate (1 sec flight = 1 sec master audio)
      source.playbackRate.value = 1.0;
      source.connect(this.masterGain);

      const bufferOffset = Math.min(offsetSeconds, Math.max(0, this.masterBuffer.duration - 0.1));
      source.start(now, bufferOffset);
      this.activeSourceNode = source;
      this.startTime = now - offsetSeconds;
      this.startOffset = offsetSeconds;
    } catch {
      // Audio fallback
    }
  }

  /**
   * Modulate acoustic atmosphere dynamically based on flight progress
   * Keeps audio rich, clear, and unmuted throughout touchdown and rollout
   */
  public updateAcoustics(progress: number) {
    if (!this.ctx || !this.isPlaying || this.isMuted || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      // Maintain full presence during the San Diego landing and touchdown
      if (progress < 99) {
        this.masterGain.gain.setTargetAtTime(0.8, now, 0.05);
      }
    } catch {
      // safe fallback
    }
  }

  /**
   * Called when flight reaches 100%: gracefully and slowly fades out the
   * lingering runway rollout noise and jet turbine idle sound over 2.2 seconds.
   */
  public onFlightComplete() {
    if (!this.ctx || !this.activeSourceNode || !this.masterGain) return;
    this.isPlaying = false;

    try {
      const now = this.ctx.currentTime;
      const currentVol = Math.max(0.001, this.masterGain.gain.value || 0.8);
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(currentVol, now);
      // Gentle, slow exponential decay trailing into silence as jet comes to a stop
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      const nodeToClean = this.activeSourceNode;
      setTimeout(() => {
        try {
          if (this.activeSourceNode === nodeToClean) {
            this.activeSourceNode = null;
          }
          nodeToClean.stop();
          nodeToClean.disconnect();
        } catch {}
      }, 2300);
    } catch {}
  }

  /**
   * Stop active source node with anti-click fade
   */
  private stopActiveNode(fadeDuration: number = 0.03) {
    if (!this.activeSourceNode || !this.ctx) return;

    try {
      const node = this.activeSourceNode;
      this.activeSourceNode = null;
      if (this.masterGain) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, fadeDuration);
      }
      setTimeout(() => {
        try {
          node.stop();
          node.disconnect();
        } catch {}
      }, fadeDuration * 1000 + 10);
    } catch {}
  }

  /**
   * Immediate stop for pausing or resetting to beginning
   */
  public stop() {
    this.isPlaying = false;
    this.stopActiveNode(0.04);
  }

  public playTouchdownScreech() {
    // Already seamlessly integrated in the master audio without rough bursts
  }
}

export const soundEngine = new SoundEngine();
