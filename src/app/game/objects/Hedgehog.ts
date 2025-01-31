import * as THREE from 'three';
import * as GSAP from 'gsap';
import { blackMat, lightBrownMat, whiteMat } from './Constants';
export class Hedgehog {
  public angle = 0;
  public status = "ready";
  public mesh = new THREE.Group();
  private body: any;// = new THREE.Mesh(bodyGeom, blackMat);

  private head: any;// = new THREE.Mesh(headGeom, lightBrownMat);

  constructor() {
    this.create();
  }

  private create() {
    this.angle = 0;
    this.status = "ready";
    this.mesh = new THREE.Group();
    const bodyGeom = new THREE.BoxGeometry(6, 6, 6, 1);
    this.body = new THREE.Mesh(bodyGeom, blackMat);

    const headGeom = new THREE.BoxGeometry(5, 5, 7, 1);
    this.head = new THREE.Mesh(headGeom, lightBrownMat);
    this.head.position.z = 6;
    this.head.position.y = -.5;

    const noseGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1);
    const nose = new THREE.Mesh(noseGeom, blackMat);
    nose.position.z = 4;
    nose.position.y = 2;

    const eyeGeom = new THREE.BoxGeometry(1, 3, 3);

    const eyeL = new THREE.Mesh(eyeGeom, whiteMat);
    eyeL.position.x = 2.2;
    eyeL.position.z = -.5;
    eyeL.position.y = .8;
    eyeL.castShadow = true;
    this.head.add(eyeL);

    const irisGeom = new THREE.BoxGeometry(.5, 1, 1);

    const iris = new THREE.Mesh(irisGeom, blackMat);
    iris.position.x = .5;
    iris.position.y = .8;
    iris.position.z = .8;
    eyeL.add(iris);

    const eyeR = eyeL.clone();
    eyeR.children[0].position.x = - iris.position.x;
    eyeR.position.x = - eyeL.position.x;

    const spikeGeom = new THREE.BoxGeometry(.5, 2, .5, 1);
    spikeGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0));

    for (let i = 0; i < 9; i++) {
      const row = (i % 3);
      const col = Math.floor(i / 3);
      const sb = new THREE.Mesh(spikeGeom, blackMat);
      sb.rotation.x = -Math.PI / 2 + (Math.PI / 12 * row) - .5 + Math.random();
      sb.position.z = -3;
      sb.position.y = -2 + row * 2;
      sb.position.x = -2 + col * 2;
      this.body.add(sb);

      const st = new THREE.Mesh(spikeGeom, blackMat);
      st.position.y = 3;
      st.position.x = -2 + row * 2;
      st.position.z = -2 + col * 2;
      st.rotation.z = Math.PI / 6 - (Math.PI / 6 * row) - .5 + Math.random();
      this.body.add(st);

      const sr = new THREE.Mesh(spikeGeom, blackMat);
      sr.position.x = 3;
      sr.position.y = -2 + row * 2;
      sr.position.z = -2 + col * 2;
      sr.rotation.z = -Math.PI / 2 + (Math.PI / 12 * row) - .5 + Math.random();
      this.body.add(sr);

      const sl = new THREE.Mesh(spikeGeom, blackMat);
      sl.position.x = -3;
      sl.position.y = -2 + row * 2;
      sl.position.z = -2 + col * 2;
      sl.rotation.z = Math.PI / 2 - (Math.PI / 12 * row) - .5 + Math.random();;
      this.body.add(sl);
    }

    this.head.add(eyeR);
    const earGeom = new THREE.BoxGeometry(2, 2, .5, 1);
    const earL = new THREE.Mesh(earGeom, lightBrownMat);
    earL.position.x = 2.5;
    earL.position.z = -2.5;
    earL.position.y = 2.5;
    earL.rotation.z = -Math.PI / 12;
    earL.castShadow = true;
    this.head.add(earL);

    const earR = earL.clone();
    earR.position.x = - earL.position.x;
    earR.rotation.z = - earL.rotation.z;
    earR.castShadow = true;
    this.head.add(earR);

    const mouthGeom = new THREE.BoxGeometry(1, 1, .5, 1);
    const mouth = new THREE.Mesh(mouthGeom, blackMat);
    mouth.position.z = 3.5;
    mouth.position.y = -1.5;
    this.head.add(mouth);


    this.mesh.add(this.body);
    this.body.add(this.head);
    this.head.add(nose);

    this.mesh.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }

  private nod() {
    const speed = .1 + Math.random() * .5;
    const angle = -Math.PI / 4 + Math.random() * Math.PI / 2;
    GSAP.gsap.to(this.head.rotation, {
      duration: speed, 
      y: angle, onComplete: () => {
          this.nod();
      }
    });
  }

}
