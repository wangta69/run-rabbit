import * as THREE from 'three';
import * as GSAP from 'gsap';
import { blackMat,  whiteMat,  pinkMat } from './Constants';
export class Monster {
  private parent: any;
  private runningCycle = 0;

  private mesh = new THREE.Group();
  private body = new THREE.Group();

  // private torsoGeom = new THREE.BoxGeometry(15, 15, 20, 1);
  private torso: any; // = new THREE.Mesh(torsoGeom, blackMat);

  // private headGeom = new THREE.BoxGeometry(20, 20, 40, 1);
  private head: any; // = new THREE.Mesh(headGeom, blackMat);


  // private mouthGeom = new THREE.BoxGeometry(10, 4, 20, 1);
  private mouth: any; // = new THREE.Mesh(mouthGeom, blackMat);


  private heroHolder = new THREE.Group();


  // private toothGeom = new THREE.BoxGeometry(2, 2, 1, 1);




  // private tongueGeometry = new THREE.BoxGeometry(6, 1, 14);

  private tongue: any; // = new THREE.Mesh(tongueGeometry, pinkMat);


  // private noseGeom = new THREE.BoxGeometry(4, 4, 4, 1);
  private nose: any; // = new THREE.Mesh(noseGeom, pinkMat);



  // private eyeGeom = new THREE.BoxGeometry(2, 3, 3);

  private eyeL: any; // = new THREE.Mesh(eyeGeom, whiteMat);
  private eyeR: any; // = this.eyeL.clone();
  // private irisGeom = new THREE.BoxGeometry(.6, 1, 1);

  private iris: any; // = new THREE.Mesh(irisGeom, blackMat);


  



  // private earGeom = new THREE.BoxGeometry(8, 6, 2, 1);



  private earL: any; // = new THREE.Mesh(earGeom, blackMat);


  private earR: any; // = this.earL.clone();


  // private eyeGeom = new THREE.BoxGeometry(2, 4, 4);

  // private tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1);


  private tail: any; // = new THREE.Mesh(tailGeom, blackMat);



  // private pawGeom = new THREE.CylinderGeometry(1.5, 0, 10);

  private pawFL: any; // = new THREE.Mesh(pawGeom, blackMat);


  private pawFR: any; // = this.pawFL.clone();


  private pawBR: any; // = this.pawFR.clone();


  private pawBL: any; // = this.pawBR.clone();


  constructor(parent: any) {
    this.parent = parent;
    // 클래스 프로퍼티의 선언과 초기화
    this.create();
  }

  private create() {

    this.runningCycle = 0;

    this.mesh = new THREE.Group();
    this.body = new THREE.Group();

    const torsoGeom = new THREE.BoxGeometry(15, 15, 20, 1);
    this.torso = new THREE.Mesh(torsoGeom, blackMat);

    const headGeom = new THREE.BoxGeometry(20, 20, 40, 1);
    headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 20));
    this.head = new THREE.Mesh(headGeom, blackMat);
    this.head.position.z = 12;
    this.head.position.y = 2;

    const mouthGeom = new THREE.BoxGeometry(10, 4, 20, 1);
    mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -2, 10));
    this.mouth = new THREE.Mesh(mouthGeom, blackMat);
    this.mouth.position.y = -8;
    this.mouth.rotation.x = .4;
    this.mouth.position.z = 4;

    this.heroHolder = new THREE.Group();
    this.heroHolder.position.z = 20;
    this.mouth.add(this.heroHolder);

    const toothGeom = new THREE.BoxGeometry(2, 2, 1, 1);
    const toothGeompositionAttribute = toothGeom.getAttribute('position');
    const toothGeomvertex = new THREE.Vector3();

    toothGeomvertex.fromBufferAttribute(toothGeompositionAttribute, 1).x -= 1;
    toothGeomvertex.fromBufferAttribute(toothGeompositionAttribute, 4).x += 1;
    toothGeomvertex.fromBufferAttribute(toothGeompositionAttribute, 5).x += 1;
    toothGeomvertex.fromBufferAttribute(toothGeompositionAttribute, 0).x -= 1;


    for (let i = 0; i < 3; i++) {
      const toothf = new THREE.Mesh(toothGeom, whiteMat);
      toothf.position.x = -2.8 + i * 2.5;
      toothf.position.y = 1;
      toothf.position.z = 19;

      const toothl = new THREE.Mesh(toothGeom, whiteMat);
      toothl.rotation.y = Math.PI / 2;
      toothl.position.z = 12 + i * 2.5;
      toothl.position.y = 1;
      toothl.position.x = 4;

      const toothr = toothl.clone();
      toothl.position.x = -4;

      this.mouth.add(toothf);
      this.mouth.add(toothl);
      this.mouth.add(toothr);
    }

    const tongueGeometry = new THREE.BoxGeometry(6, 1, 14);
    tongueGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7));

    this.tongue = new THREE.Mesh(tongueGeometry, pinkMat);
    this.tongue.position.z = 2;
    this.tongue.rotation.x = -.2;
    this.mouth.add(this.tongue);

    const noseGeom = new THREE.BoxGeometry(4, 4, 4, 1);
    this.nose = new THREE.Mesh(noseGeom, pinkMat);
    this.nose.position.z = 39.5;
    this.nose.position.y = 9;
    this.head.add(this.nose);

    this.head.add(this.mouth);

    const eyeGeomL = new THREE.BoxGeometry(2, 3, 3);

    this.eyeL = new THREE.Mesh(eyeGeomL, whiteMat);
    this.eyeL.position.x = 10;
    this.eyeL.position.z = 5;
    this.eyeL.position.y = 5;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    const irisGeom = new THREE.BoxGeometry(.6, 1, 1);

    this.iris = new THREE.Mesh(irisGeom, blackMat);
    this.iris.position.x = 1.2;
    this.iris.position.y = -1;
    this.iris.position.z = 1;
    this.eyeL.add(this.iris);

    this.eyeR = this.eyeL.clone();
    this.eyeR.children[0].position.x = -this.iris.position.x;
    this.eyeR.position.x = -this.eyeL.position.x;
    this.head.add(this.eyeR);


    const earGeom = new THREE.BoxGeometry(8, 6, 2, 1);
    const earGeompositionAttribute = earGeom.getAttribute('position');
    const earGeomvertex = new THREE.Vector3();
    earGeomvertex.fromBufferAttribute(earGeompositionAttribute, 1).x -= 4;
    earGeomvertex.fromBufferAttribute(earGeompositionAttribute, 4).x += 4;
    earGeomvertex.fromBufferAttribute(earGeompositionAttribute, 5).x += 4;
    earGeomvertex.fromBufferAttribute(earGeompositionAttribute, 5).z -= 2;
    earGeomvertex.fromBufferAttribute(earGeompositionAttribute, 0).x -= 4;
    earGeomvertex.fromBufferAttribute(earGeompositionAttribute, 0).z -= 2;



    earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 3, 0));

    this.earL = new THREE.Mesh(earGeom, blackMat);
    this.earL.position.x = 6;
    this.earL.position.z = 1;
    this.earL.position.y = 10;
    this.earL.castShadow = true;
    this.head.add(this.earL);

    this.earR = this.earL.clone();
    this.earR.position.x = -this.earL.position.x;
    this.earR.rotation.z = -this.earL.rotation.z;
    this.head.add(this.earR);

    // const eyeGeom = new THREE.BoxGeometry(2, 4, 4);

    const tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1);
    tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 10, 0));
    tailGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    tailGeom.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 4));

    this.tail = new THREE.Mesh(tailGeom, blackMat);
    this.tail.position.z = -10;
    this.tail.position.y = 4;
    this.torso.add(this.tail);


    const pawGeom = new THREE.CylinderGeometry(1.5, 0, 10);
    pawGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -5, 0));
    this.pawFL = new THREE.Mesh(pawGeom, blackMat);
    this.pawFL.position.y = -7.5;
    this.pawFL.position.z = 8.5;
    this.pawFL.position.x = 5.5;
    this.torso.add(this.pawFL);

    this.pawFR = this.pawFL.clone();
    this.pawFR.position.x = - this.pawFL.position.x;
    this.torso.add(this.pawFR);

    this.pawBR = this.pawFR.clone();
    this.pawBR.position.z = - this.pawFL.position.z;
    this.torso.add(this.pawBR);

    this.pawBL = this.pawBR.clone();
    this.pawBL.position.x = this.pawFL.position.x;
    this.torso.add(this.pawBL);

    this.mesh.add(this.body);
    this.torso.add(this.head);
    this.body.add(this.torso);

    this.torso.castShadow = true;
    this.head.castShadow = true;
    this.pawFL.castShadow = true;
    this.pawFR.castShadow = true;
    this.pawBL.castShadow = true;
    this.pawBR.castShadow = true;

    this.body.rotation.y = Math.PI / 2;
  }

  private sit () {
    const sp = 1.2;
    const ease = GSAP.Power4.easeOut;

    GSAP.gsap.to(this.torso.rotation, { duration: sp, x: -1.3, ease: ease });
    GSAP.gsap.to(this.torso.position, {
      duration: sp, 
      y: -5, ease: ease, onComplete: () => {
        this.nod();
        this.parent.gameStatus = "readyToReplay";
      }
    });

    GSAP.gsap.to(this.head.rotation, { duration: sp, x: Math.PI / 3, y: -Math.PI / 3, ease: ease });
    GSAP.gsap.to(this.tail.rotation, { duration: sp, x: 2, y: Math.PI / 4, ease: ease });
    GSAP.gsap.to(this.pawBL.rotation, { duration: sp, x: -.1, ease: ease });
    GSAP.gsap.to(this.pawBR.rotation, { duration: sp, x: -.1, ease: ease });
    GSAP.gsap.to(this.pawFL.rotation, { duration: sp, x: 1, ease: ease });
    GSAP.gsap.to(this.pawFR.rotation, { duration: sp, x: 1, ease: ease });
    GSAP.gsap.to(this.mouth.rotation, { duration: sp, x: .3, ease: ease });
    GSAP.gsap.to(this.eyeL.scale, { duration: sp, y: 1, ease: ease });
    GSAP.gsap.to(this.eyeR.scale, { duration: sp, y: 1, ease: ease });



  }

  private nod() {
    const sp = 1 + Math.random() * 2;

    // HEAD
    const tHeadRotY = -Math.PI / 3 + Math.random() * .5;
    const tHeadRotX = Math.PI / 3 - .2 + Math.random() * .4;
    GSAP.gsap.to(this.head.rotation, { duration: sp, x: tHeadRotX, y: tHeadRotY, ease: GSAP.Power4.easeInOut, onComplete: () => { this.nod() } });

    // TAIL

    const tTailRotY = -Math.PI / 4;
    GSAP.gsap.to(this.tail.rotation, { duration: sp / 8, y: tTailRotY, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 8 });

    // EYES

    GSAP.gsap.to([this.eyeR.scale, this.eyeL.scale], { duration: sp / 20, y: 0, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 1 });
  }

  private run () {
    const s = Math.min(this.parent.speed, this.parent.maxSpeed);
    this.runningCycle += this.parent.delta * s * .7;
    this.runningCycle = this.runningCycle % (Math.PI * 2);
    const t = this.runningCycle;

    this.pawFR.rotation.x = Math.sin(t) * Math.PI / 4;
    this.pawFR.position.y = -5.5 - Math.sin(t);
    this.pawFR.position.z = 7.5 + Math.cos(t);

    this.pawFL.rotation.x = Math.sin(t + .4) * Math.PI / 4;
    this.pawFL.position.y = -5.5 - Math.sin(t + .4);
    this.pawFL.position.z = 7.5 + Math.cos(t + .4);

    this.pawBL.rotation.x = Math.sin(t + 2) * Math.PI / 4;
    this.pawBL.position.y = -5.5 - Math.sin(t + 3.8);
    this.pawBL.position.z = -7.5 + Math.cos(t + 3.8);

    this.pawBR.rotation.x = Math.sin(t + 2.4) * Math.PI / 4;
    this.pawBR.position.y = -5.5 - Math.sin(t + 3.4);
    this.pawBR.position.z = -7.5 + Math.cos(t + 3.4);

    this.torso.rotation.x = Math.sin(t) * Math.PI / 8;
    this.torso.position.y = 3 - Math.sin(t + Math.PI / 2) * 3;

    //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
    this.head.rotation.x = -.1 + Math.sin(-t - 1) * .4;
    this.mouth.rotation.x = .2 + Math.sin(t + Math.PI + .3) * .4;

    this.tail.rotation.x = .2 + Math.sin(t - Math.PI / 2);

    this.eyeR.scale.y = .5 + Math.sin(t + Math.PI) * .5;
 }

}