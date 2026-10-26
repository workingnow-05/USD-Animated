export type FlightPhase = 'takeoff' | 'cruise' | 'descent' | 'landing' | 'arrived';

export interface Telemetry {
  progress: number; // 0 to 100
  phase: FlightPhase;
  altitudeFeet: number;
  groundSpeedKnots: number;
  distanceKm: number;
  pitchDeg: number;
  gearDown: boolean;
}
