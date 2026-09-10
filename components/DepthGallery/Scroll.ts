import * as THREE from 'three';

export class Scroll {
  private camera: THREE.PerspectiveCamera;
  private gallery: { getDepthRange: () => { nearestZ: number; deepestZ: number } };

  // Scroll state
  private scrollTarget = 0;
  private scrollCurrent = 0;
  private scrollSmoothing = 0.08;
  private scrollToWorldFactor = 0.01;
  private wheelScrollSpeed = 1;
  private touchScrollSpeed = 1.8;
  private previousScrollCurrent = 0;
  private invertScroll = false;

  // Velocity
  private rawVelocity = 0;
  private velocity = 0;
  private velocityDamping = 0.12;
  private velocityMax = 1.5;
  private velocityStopThreshold = 0.0001;

  // Bounds
  private useScrollBounds = true;
  private firstPlaneViewOffset = 5;
  private lastPlaneViewOffset = 5;
  private minCameraZ = -Infinity;
  private maxCameraZ = Infinity;
  private cameraStartZ = 0;

  // Viewport
  private isHeroInView = false;
  private touchY = 0;
  private totalPlanes = 4;

  // Callbacks
  private onActiveIndexChange: ((index: number) => void) | null = null;
  private getActivePlaneIndex: (() => number) | null = null;

  private isAtStartBound = false;
  private isAtEndBound = false;

  private onWheel = (event: WheelEvent) => {
    if (!this.isHeroInView) return;

    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;

    // At last product scrolling down → release to page scroll
    if (this.isAtEndBound && isScrollingDown) return;
    // At first product scrolling up → release to page scroll
    if (this.isAtStartBound && isScrollingUp) return;

    event.preventDefault();
    const normalizedWheelDelta = this.normalizeWheelDelta(event) * this.wheelScrollSpeed;
    this.addScrollInput(normalizedWheelDelta);
  };

  private onTouchStart = (event: TouchEvent) => {
    this.touchY = event.touches[0]?.clientY ?? 0;
  };

  private onTouchMove = (event: TouchEvent) => {
    if (!this.isHeroInView) return;

    const currentTouchY = event.touches[0]?.clientY ?? this.touchY;
    const deltaY = this.touchY - currentTouchY;
    const isSwipingDown = deltaY > 0;
    const isSwipingUp = deltaY < 0;

    if (this.isAtEndBound && isSwipingDown) return;
    if (this.isAtStartBound && isSwipingUp) return;

    event.preventDefault();
    this.addScrollInput(deltaY * this.touchScrollSpeed);
    this.touchY = currentTouchY;
  };

  constructor(
    camera: THREE.PerspectiveCamera,
    gallery: { getDepthRange: () => { nearestZ: number; deepestZ: number } },
  ) {
    this.camera = camera;
    this.gallery = gallery;
  }

  setCallbacks(getActivePlaneIndex: () => number, onActiveIndexChange: (index: number) => void) {
    this.getActivePlaneIndex = getActivePlaneIndex;
    this.onActiveIndexChange = onActiveIndexChange;
  }

  setTotalPlanes(count: number) {
    this.totalPlanes = count;
  }

  init() {
    this.updateCameraBounds();
    this.cameraStartZ = this.maxCameraZ;
    this.camera.position.z = this.cameraStartZ;
    this.scrollTarget = 0;
    this.scrollCurrent = 0;
    this.previousScrollCurrent = this.scrollCurrent;
    this.rawVelocity = 0;
    this.velocity = 0;
  }

  setHeroInView(inView: boolean) {
    this.isHeroInView = inView;
  }

  bindEvents() {
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
  }

  updateCameraBounds() {
    const depthRange = this.gallery.getDepthRange();
    this.maxCameraZ = depthRange.nearestZ + this.firstPlaneViewOffset;
    this.minCameraZ = depthRange.deepestZ + this.lastPlaneViewOffset;

    if (this.minCameraZ > this.maxCameraZ) {
      this.minCameraZ = this.maxCameraZ;
    }
  }

  private cameraZFromScroll(scrollAmount: number) {
    return this.cameraStartZ - scrollAmount * this.scrollToWorldFactor;
  }

  private scrollFromCameraZ(cameraZ: number) {
    if (this.scrollToWorldFactor === 0) return 0;
    return (this.cameraStartZ - cameraZ) / this.scrollToWorldFactor;
  }

  private normalizeWheelDelta(event: WheelEvent) {
    if (event.deltaMode === 1) return event.deltaY * 16;
    if (event.deltaMode === 2) return event.deltaY * window.innerHeight;
    return event.deltaY;
  }

  private addScrollInput(deltaY: number) {
    const scrollDirection = this.invertScroll ? -1 : 1;
    this.scrollTarget += deltaY * scrollDirection;
  }

  private updateVelocity() {
    this.rawVelocity = this.scrollCurrent - this.previousScrollCurrent;
    this.velocity = THREE.MathUtils.lerp(this.velocity, this.rawVelocity, this.velocityDamping);
    this.velocity = THREE.MathUtils.clamp(this.velocity, -this.velocityMax, this.velocityMax);

    if (Math.abs(this.velocity) < this.velocityStopThreshold) {
      this.velocity = 0;
    }

    this.previousScrollCurrent = this.scrollCurrent;
  }

  update() {
    this.updateCameraBounds();
    this.scrollCurrent = THREE.MathUtils.lerp(
      this.scrollCurrent,
      this.scrollTarget,
      this.scrollSmoothing,
    );

    if (this.useScrollBounds) {
      const minimumScroll = this.scrollFromCameraZ(this.maxCameraZ);
      const maximumScroll = this.scrollFromCameraZ(this.minCameraZ);

      this.scrollTarget = THREE.MathUtils.clamp(this.scrollTarget, minimumScroll, maximumScroll);
      this.scrollCurrent = THREE.MathUtils.clamp(this.scrollCurrent, minimumScroll, maximumScroll);
    }

    this.updateVelocity();

    const nextCameraZ = this.cameraZFromScroll(this.scrollCurrent);
    if (this.useScrollBounds) {
      this.camera.position.z = THREE.MathUtils.clamp(nextCameraZ, this.minCameraZ, this.maxCameraZ);
    } else {
      this.camera.position.z = nextCameraZ;
    }

    // Check bounds — when at last plane, release scroll down to page
    // When at first plane, release scroll up to page
    const tolerance = 0.5;
    const maxScroll = this.scrollFromCameraZ(this.minCameraZ);
    const minScroll = this.scrollFromCameraZ(this.maxCameraZ);
    this.isAtEndBound = this.scrollCurrent >= maxScroll - tolerance;
    this.isAtStartBound = this.scrollCurrent <= minScroll + tolerance;
  }

  getVelocity() {
    return this.velocity;
  }

  getVelocityMax() {
    return this.velocityMax;
  }

  dispose() {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
  }
}
