import * as THREE from 'three';
import { Gallery } from './Gallery';
import { Scroll } from './Scroll';
import { Background } from './Background';

export type OnActiveIndexChange = (index: number) => void;

export class Engine {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private gallery: Gallery;
  private scroll: Scroll;
  private background: Background;
  private animationFrameRequestId: number | null = null;
  private isRunning = false;
  private preloadedTextures = new Map<string, THREE.Texture>();
  private onActiveIndexChange: OnActiveIndexChange;
  private activePlaneIndex = 0;
  private onResizeBound: (() => void) | null = null;

  constructor(canvas: HTMLCanvasElement, onActiveIndexChange: OnActiveIndexChange) {
    this.canvas = canvas;
    this.onActiveIndexChange = onActiveIndexChange;
    this.scene = new THREE.Scene();

    // Camera — matches Codrops exactly: position (0, 0, 6), FOV 45
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, 6);

    this.gallery = new Gallery();
    this.scroll = new Scroll(this.camera, this.gallery);
    this.background = new Background();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.autoClear = false;
  }

  async init() {
    document.body.classList.add('loading');

    try {
      this.preloadedTextures = await this.preloadTextures();
      this.gallery.setPreloadedTextures(this.preloadedTextures);

      await this.gallery.init(this.scene);

      this.scroll.setCallbacks(
        () => this.gallery.getActivePlaneIndex(this.camera.position.z),
        (index: number) => {
          if (index !== this.activePlaneIndex) {
            this.activePlaneIndex = index;
            this.onActiveIndexChange(index);
          }
        },
      );

      this.scroll.setTotalPlanes(4);
      this.scroll.init();
      this.background.init();
      this.resize();

      this.onResizeBound = () => this.resize();
      window.addEventListener('resize', this.onResizeBound);
      this.scroll.bindEvents();
      this.start();
    } finally {
      document.body.classList.remove('loading');
    }
  }

  private async preloadTextures(): Promise<Map<string, THREE.Texture>> {
    const textureSources = this.gallery.getTextureSources();
    if (!textureSources.length) return new Map();

    const textureLoader = new THREE.TextureLoader();
    const loaded = new Map<string, THREE.Texture>();

    await Promise.all(
      textureSources.map(async (src) => {
        try {
          const texture = await textureLoader.loadAsync(src);
          texture.colorSpace = THREE.SRGBColorSpace;
          loaded.set(src, texture);
        } catch (e) {
          console.warn(`Texture failed to load: ${src}`, e);
        }
      }),
    );

    return loaded;
  }

  setHeroInView(inView: boolean) {
    this.scroll.setHeroInView(inView);
  }

  private resize() {
    const width = this.canvas.clientWidth || window.innerWidth || 1;
    const height = this.canvas.clientHeight || window.innerHeight || 1;
    if (width <= 0 || height <= 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.update();
  }

  // Exact Codrops render loop order
  private update = () => {
    if (!this.isRunning) return;
    this.animationFrameRequestId = requestAnimationFrame(this.update);

    const time = performance.now();

    // 1. Update scroll
    this.scroll.update();

    // 2. Update gallery + background
    this.gallery.update(this.camera, this.scroll.getVelocity(), this.scroll.getVelocityMax());

    // 3. Camera-driven updates: mood colors
    const moodBlendData = this.gallery.getMoodBlendData(this.camera.position.z);
    if (moodBlendData) {
      this.background.setMoodBlend(moodBlendData);
    }

    // 4. Depth + velocity → background motion response
    const depthProgress = this.gallery.getDepthProgress(this.camera.position.z);
    const velocityMax = this.scroll.getVelocityMax();
    const velocityIntensity = THREE.MathUtils.clamp(
      Math.abs(this.scroll.getVelocity()) / Math.max(velocityMax, 0.0001),
      0,
      1
    );
    const blendData = this.gallery.getPlaneBlendData(this.camera.position.z);
    const blend = blendData?.blend ?? 0;
    const distanceFromBlendCenter = Math.abs(blend - 0.5) * 2;
    const transitionStability = THREE.MathUtils.smoothstep(distanceFromBlendCenter, 0.35, 1);
    const stabilizedVelocityIntensity = velocityIntensity * transitionStability;

    this.background.setMotionResponse({
      depthProgress,
      velocityIntensity: stabilizedVelocityIntensity,
    });

    // 5. Background tick
    this.background.update(time);

    // 6. Render: clear → background → clearDepth → scene
    this.renderer.clear(true, true, true);
    this.background.render(this.renderer);
    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);
  };

  getActivePlaneConfig() {
    return this.gallery.getPlaneConfig(this.activePlaneIndex);
  }

  dispose() {
    this.isRunning = false;
    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId);
      this.animationFrameRequestId = null;
    }
    if (this.onResizeBound) {
      window.removeEventListener('resize', this.onResizeBound);
    }
    this.scroll.dispose();
    this.gallery.dispose();
    this.background.dispose();
    this.preloadedTextures.forEach((t) => t.dispose());
    this.preloadedTextures.clear();
    this.renderer.dispose();
  }
}
