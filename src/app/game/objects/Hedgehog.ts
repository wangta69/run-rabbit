import * as THREE from 'three';
import * as GSAP from 'gsap';

export class Hedgehog {
  private angle = 0;
  private status = "ready";
  private mesh = new THREE.Group();
  private bodyGeom = new THREE.BoxGeometry(6, 6, 6, 1);
  private body: any;// = new THREE.Mesh(bodyGeom, blackMat);

  private headGeom = new THREE.BoxGeometry(5, 5, 7, 1);
  private head: any;// = new THREE.Mesh(headGeom, lightBrownMat);


  private noseGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1);
  private nose: any;// = new THREE.Mesh(noseGeom, blackMat);


  private eyeGeom = new THREE.BoxGeometry(1, 3, 3);

  private eyeL: any;// = new THREE.Mesh(eyeGeom, whiteMat);


  private irisGeom = new THREE.BoxGeometry(.5, 1, 1);

  private iris: any;// = new THREE.Mesh(irisGeom, blackMat);


  private eyeR: any;// = this.eyeL.clone();


  private spikeGeom = new THREE.BoxGeometry(.5, 2, .5, 1);


  private earGeom = new THREE.BoxGeometry(2, 2, .5, 1);
  private earL: any;// = new THREE.Mesh(earGeom, this.lightBrownMat);


  private earR: any;// = this.earL.clone();


  private mouthGeom = new THREE.BoxGeometry(1, 1, .5, 1);
  private mouth: any;// = new THREE.Mesh(mouthGeom, blackMat);



  private blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    flatShading: true,
  // shading: THREE.FlatShading,
  });

  private lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
    flatShading: true,
  // shading: THREE.FlatShading,
  });

  private whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
    flatShading: true,
  // shading: THREE.FlatShading,
  });

  constructor() {
    this.create();
  }

  private create() {
    this.angle = 0;
    this.status = "ready";
    this.mesh = new THREE.Group();
    const bodyGeom = new THREE.BoxGeometry(6, 6, 6, 1);
    this.body = new THREE.Mesh(bodyGeom, this.blackMat);

    const headGeom = new THREE.BoxGeometry(5, 5, 7, 1);
    this.head = new THREE.Mesh(headGeom, this.lightBrownMat);
    this.head.position.z = 6;
    this.head.position.y = -.5;

    const noseGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1);
    this.nose = new THREE.Mesh(noseGeom, this.blackMat);
    this.nose.position.z = 4;
    this.nose.position.y = 2;

    const eyeGeom = new THREE.BoxGeometry(1, 3, 3);

    this.eyeL = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.eyeL.position.x = 2.2;
    this.eyeL.position.z = -.5;
    this.eyeL.position.y = .8;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    const irisGeom = new THREE.BoxGeometry(.5, 1, 1);

    this.iris = new THREE.Mesh(irisGeom, this.blackMat);
    this.iris.position.x = .5;
    this.iris.position.y = .8;
    this.iris.position.z = .8;
    this.eyeL.add(this.iris);

    this.eyeR = this.eyeL.clone();
    this.eyeR.children[0].position.x = -this.iris.position.x;
    this.eyeR.position.x = -this.eyeL.position.x;

    const spikeGeom = new THREE.BoxGeometry(.5, 2, .5, 1);
    spikeGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0));

    for (let i = 0; i < 9; i++) {
      const row = (i % 3);
      const col = Math.floor(i / 3);
      const sb = new THREE.Mesh(spikeGeom, this.blackMat);
      sb.rotation.x = -Math.PI / 2 + (Math.PI / 12 * row) - .5 + Math.random();
      sb.position.z = -3;
      sb.position.y = -2 + row * 2;
      sb.position.x = -2 + col * 2;
      this.body.add(sb);

      const st = new THREE.Mesh(spikeGeom, this.blackMat);
      st.position.y = 3;
      st.position.x = -2 + row * 2;
      st.position.z = -2 + col * 2;
      st.rotation.z = Math.PI / 6 - (Math.PI / 6 * row) - .5 + Math.random();
      this.body.add(st);

      const sr = new THREE.Mesh(spikeGeom, this.blackMat);
      sr.position.x = 3;
      sr.position.y = -2 + row * 2;
      sr.position.z = -2 + col * 2;
      sr.rotation.z = -Math.PI / 2 + (Math.PI / 12 * row) - .5 + Math.random();
      this.body.add(sr);

      const sl = new THREE.Mesh(spikeGeom, this.blackMat);
      sl.position.x = -3;
      sl.position.y = -2 + row * 2;
      sl.position.z = -2 + col * 2;
      sl.rotation.z = Math.PI / 2 - (Math.PI / 12 * row) - .5 + Math.random();;
      this.body.add(sl);
    }

    this.head.add(this.eyeR);
    const earGeom = new THREE.BoxGeometry(2, 2, .5, 1);
    this.earL = new THREE.Mesh(earGeom, this.lightBrownMat);
    this.earL.position.x = 2.5;
    this.earL.position.z = -2.5;
    this.earL.position.y = 2.5;
    this.earL.rotation.z = -Math.PI / 12;
    this.earL.castShadow = true;
    this.head.add(this.earL);

    this.earR = this.earL.clone();
    this.earR.position.x = -this.earL.position.x;
    this.earR.rotation.z = -this.earL.rotation.z;
    this.earR.castShadow = true;
    this.head.add(this.earR);

    const mouthGeom = new THREE.BoxGeometry(1, 1, .5, 1);
    this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
    this.mouth.position.z = 3.5;
    this.mouth.position.y = -1.5;
    this.head.add(this.mouth);


    this.mesh.add(this.body);
    this.body.add(this.head);
    this.head.add(this.nose);

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
