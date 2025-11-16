import { Component, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ParticleOptions, Circle, MousePosition, CanvasSize } from '../_shared/models/animation.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements AfterViewInit, OnDestroy {
  bannerOpen: boolean = true;
  canvas!: HTMLCanvasElement;
  canvasContainer!: HTMLElement;
  context!: CanvasRenderingContext2D;
  dpr!: number;
  settings!: Required<ParticleOptions>;
  circles: Circle[] = [];
  mouse: MousePosition = { x: 0, y: 0 };
  canvasSize: CanvasSize = { w: 0, h: 0 };

  // typewriter effects
  typewriterTexts: string[] = ['Full Stack Developer', 'Software Engineer', 'Backend Developer'];
  typewriterIndex: number = 0;
  charIndex: number = 0;
  isDeleting: boolean = false;
  typewriterElement!: HTMLElement | null;
  typewriterTimeout?: number;

  // configurable speeds
  typeSpeed: number = 80;
  deleteSpeed: number = 40;
  pauseAfterComplete: number = 1000;
  pauseAfterDelete: number = 250;

  constructor(
    private elRef: ElementRef
  ) { }

  ngAfterViewInit(): void {
    const canvas = this.elRef.nativeElement.querySelector('[data-particle-animation]') as HTMLCanvasElement;
    if (!canvas) return;

    this.typewriterElement = this.elRef.nativeElement.querySelector('.typewriter');

    this.canvas = canvas;
    this.canvasContainer = canvas.parentElement as HTMLElement;
    this.context = canvas.getContext('2d')!;
    this.dpr = window.devicePixelRatio || 1;
    this.settings = {
      quantity: Number(canvas.dataset['particleQuantity']) || 30,
      staticity: Number(canvas.dataset['particleStaticity']) || 50,
      ease: Number(canvas.dataset['particleEase']) || 50,
    };

    this.bindMethods();
    this.init();
  }

  ngOnDestroy(): void {
    if (this.typewriterTimeout) clearTimeout(this.typewriterTimeout);
    window.removeEventListener('resize', this.initCanvas);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private bindMethods(): void {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.initCanvas = this.initCanvas.bind(this);
    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.drawCircle = this.drawCircle.bind(this);
    this.drawParticles = this.drawParticles.bind(this);
    this.remapValue = this.remapValue.bind(this);
    this.animate = this.animate.bind(this);
    this.type = this.type.bind(this);
  }

  private init(): void {
    this.initCanvas();
    this.animate();
    this.startTypewriter();
    window.addEventListener('resize', this.initCanvas);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private initCanvas(): void {
    this.resizeCanvas();
    this.drawParticles();
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - this.canvasSize.w / 2;
    const y = event.clientY - rect.top - this.canvasSize.h / 2;
    const inside = x < this.canvasSize.w / 2 && x > -this.canvasSize.w / 2 &&
      y < this.canvasSize.h / 2 && y > -this.canvasSize.h / 2;
    if (inside) {
      this.mouse.x = x;
      this.mouse.y = y;
    }
  }

  private resizeCanvas(): void {
    this.circles.length = 0;
    this.canvasSize.w = window.innerWidth;
    this.canvasSize.h = window.innerHeight;
    this.canvas.width = this.canvasSize.w * this.dpr;
    this.canvas.height = this.canvasSize.h * this.dpr;
    this.canvas.style.width = `${this.canvasSize.w}px`;
    this.canvas.style.height = `${this.canvasSize.h}px`;
    this.context.scale(this.dpr, this.dpr);
  }

  private circleParams(): Circle {
    const x = Math.floor(Math.random() * this.canvasSize.w);
    const y = Math.floor(Math.random() * this.canvasSize.h);
    const size = Math.floor(Math.random() * 2) + 1;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    return {
      x, y, translateX: 0, translateY: 0, size,
      alpha: 0, targetAlpha,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      magnetism: 0.1 + Math.random() * 4,
    };
  }

  private drawCircle(circle: Circle, update = false): void {
    const { x, y, translateX, translateY, size, alpha } = circle;
    this.context.translate(translateX, translateY);
    this.context.beginPath();
    this.context.arc(x, y, size, 0, 2 * Math.PI);
    this.context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    this.context.fill();
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (!update) this.circles.push(circle);
  }

  private clearContext(): void {
    this.context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
  }

  private drawParticles(): void {
    this.clearContext();
    for (let i = 0; i < this.settings.quantity; i++) {
      const circle = this.circleParams();
      this.drawCircle(circle);
    }
  }

  private remapValue(value: number, start1: number, end1: number, start2: number, end2: number): number {
    const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  }

  private animate(): void {
    this.clearContext();
    this.circles.forEach((circle, i) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        this.canvasSize.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        this.canvasSize.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = Math.min(...edge);
      const remapClosestEdge = parseFloat(this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

      circle.alpha = remapClosestEdge > 1
        ? Math.min(circle.alpha + 0.02, circle.targetAlpha)
        : circle.targetAlpha * remapClosestEdge;

      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX += ((this.mouse.x / (this.settings.staticity / circle.magnetism)) - circle.translateX) / this.settings.ease;
      circle.translateY += ((this.mouse.y / (this.settings.staticity / circle.magnetism)) - circle.translateY) / this.settings.ease;

      if (
        circle.x < -circle.size || circle.x > this.canvasSize.w + circle.size ||
        circle.y < -circle.size || circle.y > this.canvasSize.h + circle.size
      ) {
        this.circles.splice(i, 1);
        this.drawCircle(this.circleParams());
      } else {
        this.drawCircle({ ...circle }, true);
      }
    });

    window.requestAnimationFrame(this.animate);
  }

  private startTypewriter(): void {
    this.type();
  }

  private type(): void {
    if (!this.typewriterElement) return;

    const currentText = this.typewriterTexts[this.typewriterIndex];

    if (this.isDeleting) {
      this.typewriterElement.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.typewriterElement.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      this.isDeleting = true;
      this.typewriterTimeout = window.setTimeout(this.type, this.pauseAfterComplete);
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.typewriterIndex = (this.typewriterIndex + 1) % this.typewriterTexts.length;
      this.typewriterTimeout = window.setTimeout(this.type, this.pauseAfterDelete);
    } else {
      this.typewriterTimeout = window.setTimeout(this.type, this.isDeleting ? this.deleteSpeed : this.typeSpeed);
    }
  }
}