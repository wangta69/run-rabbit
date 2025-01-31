import * as THREE from 'three';
import * as GSAP from 'gsap';

export class BonusParticles {
  private mesh = new THREE.Group();
  private parts: any[] = [];

  private pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
    flatShading: true,
  // shading: THREE.FlatShading,
  });

  private greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
    flatShading: true,
    // shading: THREE.FlatShading,
  });

  constructor() {
    this.create();
  }

  private create(){
    this.mesh = new THREE.Group();
    const bigParticleGeom = new THREE.BoxGeometry(10, 10, 10, 1);
    const smallParticleGeom = new THREE.BoxGeometry(5, 5, 5, 1);
    this.parts = [];
    for (let i = 0; i < 10; i++) {
        const partPink = new THREE.Mesh(bigParticleGeom, this.pinkMat);
        const partGreen = new THREE.Mesh(smallParticleGeom, this.greenMat);
        partGreen.scale.set(.5, .5, .5);
        this.parts.push(partPink);
        this.parts.push(partGreen);
        this.mesh.add(partPink);
        this.mesh.add(partGreen);
    }
  }

  private explose() {
    const explosionSpeed = .5;
    for (let i = 0; i < this.parts.length; i++) {
      const tx = -50 + Math.random() * 100;
      const ty = -50 + Math.random() * 100;
      const tz = -50 + Math.random() * 100;
      const p = this.parts[i];
      p.position.set(0, 0, 0);
      p.scale.set(1, 1, 1);
      p.visible = true;
      const s = explosionSpeed + Math.random() * .5;
      GSAP.gsap.to(p.position, { duration: s, x: tx, y: ty, z: tz, ease: GSAP.Power4.easeOut });
      // GSAP.gsap.to(p.scale, { duration: s, x: .01, y: .01, z: .01, ease: GSAP.Power4.easeOut, onComplete: this.removeParticle, onCompleteParams: [p] });
    }
  }
}
