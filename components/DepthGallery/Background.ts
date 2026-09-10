import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export class Background {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private isInitialized = false;

  private backgroundColor = new THREE.Color('#FFF5E6');
  private blob1Color = new THREE.Color('#F5D0A9');
  private blob2Color = new THREE.Color('#E8C5A0');
  private nextBackgroundColor = new THREE.Color();
  private nextBlob1Color = new THREE.Color();
  private nextBlob2Color = new THREE.Color();

  private baseBlobRadius = 0.65;
  private secondaryBlobRadiusRatio = 0.78;
  private baseBlobStrength = 0.9;

  private depthToRadiusAmount = 0.08;
  private velocityToStrengthAmount = 0.1;
  private motionSmoothing = 0.1;
  private motionDepthProgress = 0;
  private motionVelocityIntensity = 0;
  private smoothedDepthProgress = 0;
  private smoothedVelocityIntensity = 0;

  private blobRadius: number;
  private blobStrength: number;
  private noiseStrength = 0.04;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.blobRadius = this.baseBlobRadius;
    this.blobStrength = this.baseBlobStrength;
  }

  init() {
    if (this.isInitialized) return;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      uniforms: {
        uBackgroundColor: { value: this.backgroundColor },
        uBlob1Color: { value: this.blob1Color },
        uBlob2Color: { value: this.blob2Color },
        uNoiseStrength: { value: this.noiseStrength },
        uBlobRadius: { value: this.blobRadius },
        uBlobRadiusSecondary: { value: this.blobRadius * this.secondaryBlobRadiusRatio },
        uBlobStrength: { value: this.blobStrength },
        uTime: { value: 0 },
        uVelocityIntensity: { value: 0 },
      },
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
    this.isInitialized = true;
  }

  setMoodColors({ background, blob1, blob2 }: { background?: string; blob1?: string; blob2?: string }) {
    if (background) this.backgroundColor.set(background);
    if (blob1) this.blob1Color.set(blob1);
    if (blob2) this.blob2Color.set(blob2);
    this.updateUniformColors();
  }

  setMoodBlend({ currentMood, nextMood, blend }: { currentMood: { background: string; blob1: string; blob2: string }; nextMood: { background: string; blob1: string; blob2: string }; blend: number }) {
    if (!currentMood) return;

    const safeBlend = THREE.MathUtils.clamp(blend ?? 0, 0, 1);
    if (!nextMood || safeBlend <= 0) {
      this.setMoodColors(currentMood);
      return;
    }

    this.backgroundColor
      .set(currentMood.background)
      .lerp(this.nextBackgroundColor.set(nextMood.background), safeBlend);
    this.blob1Color.set(currentMood.blob1).lerp(this.nextBlob1Color.set(nextMood.blob1), safeBlend);
    this.blob2Color.set(currentMood.blob2).lerp(this.nextBlob2Color.set(nextMood.blob2), safeBlend);

    this.updateUniformColors();
  }

  private updateUniformColors() {
    if (!this.material) return;

    this.material.uniforms.uBackgroundColor.value.copy(this.backgroundColor);
    this.material.uniforms.uBlob1Color.value.copy(this.blob1Color);
    this.material.uniforms.uBlob2Color.value.copy(this.blob2Color);
    this.material.uniforms.uNoiseStrength.value = this.noiseStrength;
  }

  private updateBlobUniforms() {
    if (!this.material) return;

    this.material.uniforms.uBlobRadius.value = this.blobRadius;
    this.material.uniforms.uBlobRadiusSecondary.value =
      this.blobRadius * this.secondaryBlobRadiusRatio;
    this.material.uniforms.uBlobStrength.value = this.blobStrength;
  }

  setMotionResponse({ depthProgress, velocityIntensity }: { depthProgress: number; velocityIntensity: number }) {
    if (Number.isFinite(depthProgress)) {
      this.motionDepthProgress = THREE.MathUtils.clamp(depthProgress, 0, 1);
    }
    if (Number.isFinite(velocityIntensity)) {
      this.motionVelocityIntensity = THREE.MathUtils.clamp(velocityIntensity, 0, 1);
    }
  }

  private applyMotionToBlob() {
    const nextBlobRadius =
      this.baseBlobRadius + this.smoothedDepthProgress * this.depthToRadiusAmount;
    const nextBlobStrength =
      this.baseBlobStrength + this.smoothedVelocityIntensity * this.velocityToStrengthAmount;

    this.blobRadius = THREE.MathUtils.clamp(nextBlobRadius, 0.05, 1);
    this.blobStrength = THREE.MathUtils.clamp(nextBlobStrength, 0, 1);

    this.updateBlobUniforms();
  }

  update(time = 0) {
    this.smoothedDepthProgress = THREE.MathUtils.lerp(
      this.smoothedDepthProgress,
      this.motionDepthProgress,
      this.motionSmoothing
    );
    this.smoothedVelocityIntensity = THREE.MathUtils.lerp(
      this.smoothedVelocityIntensity,
      this.motionVelocityIntensity,
      this.motionSmoothing
    );

    if (this.material) {
      this.material.uniforms.uTime.value = time;
      this.material.uniforms.uVelocityIntensity.value = this.smoothedVelocityIntensity;
    }

    this.applyMotionToBlob();
  }

  render(renderer: THREE.WebGLRenderer) {
    if (!this.isInitialized) return;
    renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (!this.isInitialized) return;

    this.mesh.geometry.dispose();
    this.material.dispose();
    this.scene.clear();
    this.isInitialized = false;
  }
}
