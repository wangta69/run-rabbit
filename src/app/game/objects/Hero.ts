import * as THREE from 'three';
import * as GSAP from 'gsap';
import { blackMat, brownMat, whiteMat, lightBrownMat, pinkMat } from './Constants';

export class Hero {

  private parent: any;


  private status = '';
  private runningCycle = 0;
  public mesh: any;
  private body: any;

  // private torsoGeom: any;
  private torso: any;

  // private pantsGeom: any;
  private pants: any;

  // private tailGeom: any;
  private tail: any;

  // private headGeom: any;
  private head: any;

  // private cheekGeom: any;
  private cheekR: any;
  private cheekL: any;

  // private noseGeom: any;
  private nose: any;

  // private mouthGeom: any;
  private mouth: any;

  // private pawFGeom: any;
  private pawFR: any;

  private pawFL: any;

  // private pawBGeom: any;
  private pawBL: any;
  private pawBR: any;

  // private earGeom: any;
  private earL: any;
  private earR: any;

  // private eyeGeom: any;
  private eyeL: any;
  private eyeR: any;

  // private irisGeom: any;
  private iris: any;
  




  constructor(parent: any) { // parent: GameComponent
    // 클래스 프로퍼티의 선언과 초기화
    this.parent = parent;

    this.create();

  }

  private create() {

  
    this.status = "running";
    this.runningCycle = 0;
    this.mesh = new THREE.Group();
    this.body = new THREE.Group();
    this.mesh.add(this.body);

    // const torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1);
    const torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1);
    this.torso = new THREE.Mesh(torsoGeom, brownMat);
    this.torso.position.z = 0;
    this.torso.position.y = 7;
    this.torso.castShadow = true;
    this.body.add(this.torso);

    const pantsGeom = new THREE.BoxGeometry(9, 9, 5, 1);
    this.pants = new THREE.Mesh(pantsGeom, whiteMat);
    this.pants.position.z = -3;
    this.pants.position.y = 0;
    this.pants.castShadow = true;
    this.torso.add(this.pants);

    const tailGeom = new THREE.BoxGeometry(3, 3, 3, 1);
    tailGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -2));
    this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
    this.tail.position.z = -4;
    this.tail.position.y = 5;
    this.tail.castShadow = true;
    this.torso.add(this.tail);

    this.torso.rotation.x = -Math.PI / 8;

    const headGeom = new THREE.BoxGeometry(10, 10, 13, 1);

    headGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
    this.head = new THREE.Mesh(headGeom, brownMat);
    this.head.position.z = 2;
    this.head.position.y = 11;
    this.head.castShadow = true;
    this.body.add(this.head);

    const cheekGeom = new THREE.BoxGeometry(1, 4, 4, 1);
    this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
    this.cheekR.position.x = -5;
    this.cheekR.position.z = 7;
    this.cheekR.position.y = -2.5;
    this.cheekR.castShadow = true;
    this.head.add(this.cheekR);

    this.cheekL = this.cheekR.clone();
    this.cheekL.position.x = - this.cheekR.position.x;
    this.head.add(this.cheekL);


    const noseGeom = new THREE.BoxGeometry(6, 6, 3, 1);
    this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
    this.nose.position.z = 13.5;
    this.nose.position.y = 2.6;
    this.nose.castShadow = true;
    this.head.add(this.nose);

    const mouthGeom = new THREE.BoxGeometry(4, 2, 4, 1);
    mouthGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, 3));
    mouthGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 12));
    this.mouth = new THREE.Mesh(mouthGeom, brownMat);
    this.mouth.position.z = 8;
    this.mouth.position.y = -4;
    this.mouth.castShadow = true;
    this.head.add(this.mouth);


    const pawFGeom = new THREE.BoxGeometry(3, 3, 3, 1);
    this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
    this.pawFR.position.x = -2;
    this.pawFR.position.z = 6;
    this.pawFR.position.y = 1.5;
    this.pawFR.castShadow = true;
    this.body.add(this.pawFR);

    this.pawFL = this.pawFR.clone();
    this.pawFL.position.x = - this.pawFR.position.x;
    this.pawFL.castShadow = true;
    this.body.add(this.pawFL);

    const pawBGeom = new THREE.BoxGeometry(3, 3, 6, 1);
    this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
    this.pawBL.position.y = 1.5;
    this.pawBL.position.z = 0;
    this.pawBL.position.x = 5;
    this.pawBL.castShadow = true;
    this.body.add(this.pawBL);

    this.pawBR = this.pawBL.clone();
    this.pawBR.position.x = - this.pawBL.position.x;
    this.pawBR.castShadow = true;
    this.body.add(this.pawBR);

    const earGeom = new THREE.BoxGeometry(7, 18, 2, 1);
    const positionAttribute = earGeom.getAttribute('position');
    const vertex = new THREE.Vector3();

    vertex.fromBufferAttribute(positionAttribute, 6).x += 2;
    vertex.fromBufferAttribute(positionAttribute, 6).z += .5;

    vertex.fromBufferAttribute(positionAttribute, 7).x += 2;
    vertex.fromBufferAttribute(positionAttribute, 7).z -= .5;

    vertex.fromBufferAttribute(positionAttribute, 2).x -= 2;
    vertex.fromBufferAttribute(positionAttribute, 2).z -= .5;

    vertex.fromBufferAttribute(positionAttribute, 3).x -= 2;
    vertex.fromBufferAttribute(positionAttribute, 3).z += .5;

    earGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 9, 0));

    this.earL = new THREE.Mesh(earGeom, brownMat);
    this.earL.position.x = 2;
    this.earL.position.z = 2.5;
    this.earL.position.y = 5;
    this.earL.rotation.z = -Math.PI / 12;
    this.earL.castShadow = true;
    this.head.add(this.earL);

    this.earR = this.earL.clone();
    this.earR.position.x = -this.earL.position.x;
    this.earR.rotation.z = -this.earL.rotation.z;
    this.earR.castShadow = true;
    this.head.add(this.earR);

    const eyeGeom = new THREE.BoxGeometry(2, 4, 4);

    this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
    this.eyeL.position.x = 5;
    this.eyeL.position.z = 5.5;
    this.eyeL.position.y = 2.9;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    const irisGeom = new THREE.BoxGeometry(.6, 2, 2);

    this.iris = new THREE.Mesh(irisGeom, blackMat);
    this.iris.position.x = 1.2;
    this.iris.position.y = 1;
    this.iris.position.z = 1;
    this.eyeL.add(this.iris);

    this.eyeR = this.eyeL.clone();
    this.eyeR.children[0].position.x = -this.iris.position.x;


    this.eyeR.position.x = -this.eyeL.position.x;
    this.head.add(this.eyeR);

    this.body.traverse(function (object: any) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
  }

  public hang() {
    const sp = 1;
    const ease = GSAP.Power4.easeOut;

    GSAP.gsap.killTweensOf(this.eyeL.scale);
    GSAP.gsap.killTweensOf(this.eyeR.scale);

    this.body.rotation.x = 0;
    this.torso.rotation.x = 0;
    this.body.position.y = 0;
    this.torso.position.y = 7;

    GSAP.gsap.to(this.mesh.rotation, { duration: sp, y: 0, ease: ease });
    GSAP.gsap.to(this.mesh.position, { duration: sp, y: -7, z: 6, ease: ease });
    GSAP.gsap.to(this.head.rotation, { duration: sp, x: Math.PI / 6, ease: ease, onComplete: () => { this.nod(); } });

    GSAP.gsap.to(this.earL.rotation, { duration: sp, x: Math.PI / 3, ease: ease });
    GSAP.gsap.to(this.earR.rotation, { duration: sp, x: Math.PI / 3, ease: ease });

    GSAP.gsap.to(this.pawFL.position, { duration: sp, y: -1, z: 3, ease: ease });
    GSAP.gsap.to(this.pawFR.position, { duration: sp, y: -1, z: 3, ease: ease });
    GSAP.gsap.to(this.pawBL.position, { duration: sp, y: -2, z: -3, ease: ease });
    GSAP.gsap.to(this.pawBR.position, { duration: sp, y: -2, z: -3, ease: ease });

    GSAP.gsap.to(this.eyeL.scale, { duration: sp, y: 1, ease: ease });
    GSAP.gsap.to(this.eyeR.scale, { duration: sp, y: 1, ease: ease });
  }

  private nod() {
    const sp = .5 + Math.random();

    // HEAD
    const tHeadRotY = -Math.PI / 6 + Math.random() * Math.PI / 3;
    GSAP.gsap.to(this.head.rotation, { duration: sp, y: tHeadRotY, ease: GSAP.Power4.easeInOut, onComplete: () => { this.nod() } });

    // EARS
    const tEarLRotX = Math.PI / 4 + Math.random() * Math.PI / 6;
    const tEarRRotX = Math.PI / 4 + Math.random() * Math.PI / 6;

    GSAP.gsap.to(this.earL.rotation, { duration: sp, x: tEarLRotX, ease: GSAP.Power4.easeInOut });
    GSAP.gsap.to(this.earR.rotation, { duration: sp, x: tEarRRotX, ease: GSAP.Power4.easeInOut });


    // PAWS BACK LEFT

    const tPawBLRot = Math.random() * Math.PI / 2;
    const tPawBLY = -4 + Math.random() * 8;

    GSAP.gsap.to(this.pawBL.rotation, { duration: sp / 2, x: tPawBLRot, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });
    GSAP.gsap.to(this.pawBL.position, { duration: sp / 2, y: tPawBLY, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });


    // PAWS BACK RIGHT

    const tPawBRRot = Math.random() * Math.PI / 2;
    const tPawBRY = -4 + Math.random() * 8;
    GSAP.gsap.to(this.pawBR.rotation, { duration: sp / 2, x: tPawBRRot, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });
    GSAP.gsap.to(this.pawBR.position, { duration: sp / 2, y: tPawBRY, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });

    // PAWS FRONT LEFT

    const tPawFLRot = Math.random() * Math.PI / 2;
    const tPawFLY = -4 + Math.random() * 8;

    GSAP.gsap.to(this.pawFL.rotation, { duration: sp / 2, x: tPawFLRot, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });

    GSAP.gsap.to(this.pawFL.position, { duration: sp / 2, y: tPawFLY, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });

    // PAWS FRONT RIGHT

    const tPawFRRot = Math.random() * Math.PI / 2;
    const tPawFRY = -4 + Math.random() * 8;

    GSAP.gsap.to(this.pawFR.rotation, { duration: sp / 2, x: tPawFRRot, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });

    GSAP.gsap.to(this.pawFR.position, { duration: sp / 2, y: tPawFRY, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 2 });

    // MOUTH
    const tMouthRot = Math.random() * Math.PI / 8;
    GSAP.gsap.to(this.mouth.rotation, { duration: sp, x: tMouthRot, ease: GSAP.Power1.easeInOut });
    // IRIS
    const tIrisY = -1 + Math.random() * 2;
    const tIrisZ = -1 + Math.random() * 2;
    const iris1 = this.iris;
    const iris2 = this.eyeR.children[0];
    GSAP.gsap.to([iris1.position, iris2.position], { duration: sp, y: tIrisY, z: tIrisZ, ease: GSAP.Power1.easeInOut });

    //EYES
    if (Math.random() > .2) GSAP.gsap.to([this.eyeR.scale, this.eyeL.scale], { duration: sp / 8, y: 0, ease: GSAP.Power1.easeInOut, yoyo: true, repeat: 1 });

  }


  private run () {
    this.status = "running";

    const s = Math.min(this.parent.speed, this.parent.maxSpeed);

    this.runningCycle += this.parent.delta * s * .7;
    this.runningCycle = this.runningCycle % (Math.PI * 2);
    const t = this.runningCycle;

    const amp = 4;
    const disp = .2;

    // BODY

    this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
    this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1;

    this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1;
    this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5;

    // MOUTH
    this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * .05;

    // HEAD
    this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * .5;
    this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * .7;
    this.head.rotation.x = -.2 + Math.sin(t + Math.PI) * amp * .1;

    // EARS
    this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * .2);
    this.earR.rotation.x = Math.cos(-Math.PI / 2 + .2 + t) * (amp * .3);

    // EYES
    this.eyeR.scale.y = this.eyeL.scale.y = .7 + Math.abs(Math.cos(-Math.PI / 4 + t * .5)) * .6;

    // TAIL
    this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * .3;

    // FRONT RIGHT PAW
    this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
    this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4;


    this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

    // FRONT LEFT PAW

    this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
    this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4;


    this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

    // BACK RIGHT PAW
    this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
    this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


    this.pawBR.position.z = - Math.cos(Math.PI + t) * amp;

    // BACK LEFT PAW
    this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
    this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


    this.pawBL.position.z = - Math.cos(Math.PI + t) * amp;


}

private jump() {
    if (this.status == "jumping") return;
    this.status = "jumping";


    const totalSpeed = 10 / this.parent.speed;
    const jumpHeight = 45;

    GSAP.gsap.to(this.earL.rotation, { duration: totalSpeed, x: "+=.3", ease: GSAP.Back.easeOut });
    GSAP.gsap.to(this.earR.rotation, { duration: totalSpeed, x: "-=.3", ease: GSAP.Back.easeOut });

    GSAP.gsap.to(this.pawFL.rotation, { duration: totalSpeed, x: "+=.7", ease: GSAP.Back.easeOut });
    GSAP.gsap.to(this.pawFR.rotation, { duration: totalSpeed, x: "-=.7", ease: GSAP.Back.easeOut });
    GSAP.gsap.to(this.pawBL.rotation, { duration: totalSpeed, x: "+=.7", ease: GSAP.Back.easeOut });
    GSAP.gsap.to(this.pawBR.rotation, { duration: totalSpeed, x: "-=.7", ease: GSAP.Back.easeOut });

    GSAP.gsap.to(this.tail.rotation, { duration: totalSpeed, x: "+=1", ease: GSAP.Back.easeOut });

    GSAP.gsap.to(this.mouth.rotation, { duration: totalSpeed, x: .5, ease: GSAP.Back.easeOut });

    GSAP.gsap.to(this.mesh.position, { duration: totalSpeed / 2, y: jumpHeight, ease: GSAP.Power2.easeOut });
    GSAP.gsap.to(this.mesh.position, {
      duration: totalSpeed / 2, 
      y: 0, ease: GSAP.Power4.easeIn, delay: totalSpeed / 2, onComplete: () => {
          //t = 0;
        this.status = "running";
      }
    });

  }
}