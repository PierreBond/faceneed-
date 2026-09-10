import * as THREE from 'three';
import { galleryPlaneData, GalleryPlaneData, getGalleryProduct } from './galleryData';

export class Gallery {
  private scene: THREE.Scene | null = null;

  // Planes
  planes: THREE.Mesh[] = [];
  private texturesBySource = new Map<string, THREE.Texture>();
  private useTextures = true;
  private planeGap = 5;
  private desktopPlaneScale = 0.8;
  private mobilePlaneScale = 0.55;
  private mobileXSpreadFactor = 0.25;
  private mobileBreakpoint = 768;
  private planeConfig = galleryPlaneData;
  private moodSampleOffset = 1;
  private planeFadeSampleOffset = 1;
  private planeFadeSmoothing = 0.14;

  // Parallax
  private parallaxEnabled = true;
  private parallaxAmountX = 0.16;
  private parallaxAmountY = 0.08;
  private parallaxSmoothing = 0.08;
  private pointerTarget = new THREE.Vector2(0, 0);
  private pointerCurrent = new THREE.Vector2(0, 0);

  // Breath
  private breathEnabled = true;
  private breathTiltAmount = 0.045;
  private breathScaleAmount = 0.03;
  private breathSmoothing = 0.14;
  private breathGain = 1.1;
  private breathIntensity = 0;
  private targetBreathIntensity = 0;

  // Gesture drift
  private gestureParallaxEnabled = true;
  private gestureParallaxAmountY = 0.05;
  private gestureParallaxSmoothing = 0.05;
  private driftCurrent = 0;
  private driftTarget = 0;

  // Pointer events
  private onPointerMove = (event: PointerEvent) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;
    this.pointerTarget.set(x, -y);
  };

  private onPointerLeave = () => {
    this.pointerTarget.set(0, 0);
  };

  getTextureSources(): string[] {
    const textureSources = this.planeConfig
      .map((planeDefinition) => {
        const product = getGalleryProduct(planeDefinition);
        return product?.image;
      })
      .filter((img): img is string => Boolean(img));

    return [...new Set(textureSources)];
  }

  setPreloadedTextures(texturesBySource: Map<string, THREE.Texture>) {
    this.texturesBySource = texturesBySource instanceof Map ? texturesBySource : new Map();
  }

  async init(scene: THREE.Scene) {
    this.scene = scene;
    this.setPlanes(scene);
    this.updatePlaneMaterialMode();
    this.updatePlaneScale();
    this.layoutPlanes();
    this.bindPointerEvents();
  }

  private setPlanes(scene: THREE.Scene) {
    const planeGeometry = new THREE.PlaneGeometry(3, 3);

    this.planeConfig.forEach((plane, index) => {
      const product = getGalleryProduct(plane);
      const textureSrc = product?.image || '';
      const texture = this.texturesBySource.get(textureSrc) || null;
      const textureImage = texture?.image as HTMLImageElement | undefined;
      const aspectRatio =
        textureImage && textureImage.width > 0 && textureImage.height > 0
          ? textureImage.width / textureImage.height
          : 1;
      const fallbackColor = plane.backgroundColor || '#ffffff';
      const accentColor = plane.blob1Color || fallbackColor;
      const backgroundColor = plane.backgroundColor || fallbackColor;
      const blob1Color = plane.blob1Color || fallbackColor;
      const blob2Color = plane.blob2Color || fallbackColor;

      const labelData = {
        word: plane.label || `product ${index + 1}`,
        color: '#2e2e2e',
      };

      const planeMaterial = new THREE.MeshBasicMaterial({
        color: fallbackColor,
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        opacity: index === 0 ? 1 : 0,
      });

      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.userData.basePosition = plane.position;
      planeMesh.userData.baseColor = fallbackColor;
      planeMesh.userData.accentColor = accentColor;
      planeMesh.userData.backgroundColor = backgroundColor;
      planeMesh.userData.blob1Color = blob1Color;
      planeMesh.userData.blob2Color = blob2Color;
      planeMesh.userData.label = labelData;
      planeMesh.userData.texture = texture;
      planeMesh.userData.aspectRatio = aspectRatio;

      scene.add(planeMesh);
      this.planes.push(planeMesh);
    });
  }

  private updatePlaneScale() {
    const isMobileViewport = window.innerWidth <= this.mobileBreakpoint;
    const scale = isMobileViewport ? this.mobilePlaneScale : this.desktopPlaneScale;

    this.planes.forEach((plane) => {
      const aspectRatio = plane.userData.aspectRatio || 1;
      plane.scale.set(scale * aspectRatio, scale, 1);
    });
  }

  private layoutPlanes() {
    const xSpreadFactor = this.getXSpreadFactor();

    this.planes.forEach((plane, index) => {
      const basePosition = plane.userData.basePosition || { x: 0, y: 0 };
      const xPosition = basePosition.x * xSpreadFactor;
      plane.position.set(xPosition, basePosition.y, -index * this.planeGap);
    });
  }

  private getXSpreadFactor() {
    const isMobileViewport = window.innerWidth <= this.mobileBreakpoint;
    return isMobileViewport ? this.mobileXSpreadFactor : 1;
  }

  getDepthRange() {
    if (!this.planes.length) {
      return { nearestZ: 0, deepestZ: 0 };
    }

    const zPositions = this.planes.map((plane) => plane.position.z);
    return {
      nearestZ: Math.max(...zPositions),
      deepestZ: Math.min(...zPositions),
    };
  }

  getDepthProgress(cameraZ: number) {
    const { nearestZ, deepestZ } = this.getDepthRange();
    const depthSpan = nearestZ - deepestZ;
    if (depthSpan <= 0) return 0;

    return THREE.MathUtils.clamp((nearestZ - cameraZ) / depthSpan, 0, 1);
  }

  getActivePlaneIndex(cameraZ: number) {
    if (!this.planes.length) return -1;

    let closestPlaneIndex = 0;
    let smallestDistance = Infinity;

    this.planes.forEach((plane, index) => {
      const distanceToPlane = Math.abs(cameraZ - plane.position.z);
      if (distanceToPlane < smallestDistance) {
        smallestDistance = distanceToPlane;
        closestPlaneIndex = index;
      }
    });

    return closestPlaneIndex;
  }

  getMoodColorsByIndex(index: number) {
    if (index < 0 || index >= this.planes.length) return null;

    const { backgroundColor, blob1Color, blob2Color } = this.planes[index].userData;
    if (!backgroundColor) return null;

    return { background: backgroundColor, blob1: blob1Color, blob2: blob2Color };
  }

  getMoodBlendData(cameraZ: number) {
    if (!this.planes.length) return null;

    const safeCameraZ = Number.isFinite(cameraZ) ? cameraZ : this.planes[0].position.z;
    const moodSampleZ = safeCameraZ - this.planeGap * this.moodSampleOffset;
    const lastPlaneIndex = this.planes.length - 1;

    if (lastPlaneIndex === 0 || this.planeGap <= 0) {
      const singleMood = this.getMoodColorsByIndex(0);
      if (!singleMood) return null;

      return {
        currentMood: singleMood,
        nextMood: singleMood,
        blend: 0,
      };
    }

    const firstPlaneZ = this.planes[0].position.z;
    const normalizedDepth = THREE.MathUtils.clamp(
      (firstPlaneZ - moodSampleZ) / this.planeGap,
      0,
      lastPlaneIndex
    );
    const currentPlaneIndex = Math.floor(normalizedDepth);
    const nextPlaneIndex = Math.min(currentPlaneIndex + 1, lastPlaneIndex);
    const blend = normalizedDepth - currentPlaneIndex;

    const currentMood = this.getMoodColorsByIndex(currentPlaneIndex);
    const nextMood = this.getMoodColorsByIndex(nextPlaneIndex) || currentMood;
    if (!currentMood || !nextMood) return null;

    return {
      currentMood,
      nextMood,
      blend,
    };
  }

  getPlaneBlendData(cameraZ: number) {
    if (!this.planes.length) return null;

    const planeGap = Math.max(this.planeGap, 0.0001);
    const firstPlaneZ = this.planes[0].position.z;
    const lastPlaneIndex = this.planes.length - 1;
    const sampledCameraZ = cameraZ - planeGap * this.planeFadeSampleOffset;
    const normalizedDepth = THREE.MathUtils.clamp(
      (firstPlaneZ - sampledCameraZ) / planeGap,
      0,
      lastPlaneIndex
    );
    const currentPlaneIndex = Math.floor(normalizedDepth);
    const nextPlaneIndex = Math.min(currentPlaneIndex + 1, lastPlaneIndex);
    const blend = normalizedDepth - currentPlaneIndex;

    return {
      currentPlaneIndex,
      nextPlaneIndex,
      blend,
    };
  }

  getActiveMoodColors(cameraZ: number) {
    const moodBlendData = this.getMoodBlendData(cameraZ);
    return moodBlendData?.currentMood || null;
  }

  getPlaneConfig(index: number): GalleryPlaneData | undefined {
    return this.planeConfig[index];
  }

  private updatePlaneMaterialMode() {
    this.planes.forEach((plane) => {
      const planeMaterial = plane.material as THREE.MeshBasicMaterial;
      const texture = plane.userData.texture || null;
      const hasTexture = Boolean(texture);

      planeMaterial.map = this.useTextures && hasTexture ? texture : null;
      planeMaterial.color.set(this.useTextures && hasTexture ? '#ffffff' : plane.userData.baseColor);
      planeMaterial.needsUpdate = true;
    });
  }

  private bindPointerEvents() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
  }

  private updatePlaneVisibility(cameraZ: number) {
    const blendData = this.getPlaneBlendData(cameraZ);
    if (!blendData) return;

    const { currentPlaneIndex, nextPlaneIndex, blend } = blendData;

    this.planes.forEach((plane, index) => {
      let targetOpacity = 0;

      if (index === currentPlaneIndex) {
        targetOpacity = 1 - blend;
      }
      if (index === nextPlaneIndex) {
        targetOpacity = Math.max(targetOpacity, blend);
      }

      const currentOpacity = Number.isFinite(plane.material.opacity) ? plane.material.opacity : 0;
      plane.material.opacity = THREE.MathUtils.lerp(
        currentOpacity,
        targetOpacity,
        this.planeFadeSmoothing
      );
      plane.material.needsUpdate = true;
    });
  }

  private updatePlaneMotion(velocity: number, velocityMax: number) {
    // Smooth pointer toward target
    this.pointerCurrent.lerp(this.pointerTarget, this.parallaxSmoothing);

    // Velocity → breath + drift
    const velocityMaxSafe = Math.max(velocityMax, 0.0001);
    const velocityNormalized = THREE.MathUtils.clamp(
      Math.abs(velocity) / velocityMaxSafe,
      0,
      1
    );
    const scrollDrift = THREE.MathUtils.clamp(velocity / velocityMaxSafe, -1, 1);
    this.targetBreathIntensity = this.breathEnabled
      ? THREE.MathUtils.clamp(velocityNormalized * this.breathGain, 0, 1)
      : 0;
    this.breathIntensity = THREE.MathUtils.lerp(
      this.breathIntensity,
      this.targetBreathIntensity,
      this.breathSmoothing
    );
    this.driftTarget = this.gestureParallaxEnabled ? scrollDrift : 0;
    this.driftCurrent = THREE.MathUtils.lerp(
      this.driftCurrent,
      this.driftTarget,
      this.gestureParallaxSmoothing
    );

    // Per-plane: position, rotation, scale
    const xSpreadFactor = this.getXSpreadFactor();

    this.planes.forEach((plane, index) => {
      const basePosition = plane.userData.basePosition || { x: 0, y: 0 };
      const xPosition = basePosition.x * xSpreadFactor;
      const yPosition = basePosition.y;
      const zPosition = -index * this.planeGap;
      const opacity = Number.isFinite(plane.material.opacity) ? plane.material.opacity : 0;
      const depthInfluence = 1 + index * 0.05;
      const parallaxInfluence = this.parallaxEnabled ? opacity * depthInfluence : 0;

      const parallaxOffsetX = this.pointerCurrent.x * this.parallaxAmountX * parallaxInfluence;
      const parallaxOffsetY = this.pointerCurrent.y * this.parallaxAmountY * parallaxInfluence;
      const gestureOffsetY = this.driftCurrent * this.gestureParallaxAmountY;

      plane.position.x = xPosition + parallaxOffsetX;
      plane.position.y = yPosition + parallaxOffsetY + gestureOffsetY;
      plane.position.z = zPosition;

      const breathInfluence = this.breathEnabled ? this.breathIntensity * opacity : 0;
      const tiltX = -this.pointerCurrent.y * this.breathTiltAmount * breathInfluence;
      const tiltY = this.pointerCurrent.x * this.breathTiltAmount * breathInfluence;
      plane.rotation.x = tiltX;
      plane.rotation.y = tiltY;
      plane.rotation.z = 0;

      const aspectRatio = plane.userData.aspectRatio || 1;
      const baseScale =
        window.innerWidth <= this.mobileBreakpoint ? this.mobilePlaneScale : this.desktopPlaneScale;
      const scalePulse = 1 + this.breathScaleAmount * breathInfluence;
      plane.scale.x = baseScale * aspectRatio * scalePulse;
      plane.scale.y = baseScale * scalePulse;
      plane.scale.z = 1;
    });
  }

  update(camera: THREE.PerspectiveCamera, velocity: number, velocityMax: number) {
    if (!camera) return;
    this.updatePlaneVisibility(camera.position.z);
    this.updatePlaneMotion(velocity, velocityMax);
  }

  dispose() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
  }
}
