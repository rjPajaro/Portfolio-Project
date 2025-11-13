export interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

export interface ParticleOptions {
  quantity?: number;
  staticity?: number;
  ease?: number;
}

export interface CanvasSize {
  w: number;
  h: number;
}

export interface MousePosition {
  x: number;
  y: number;
}


