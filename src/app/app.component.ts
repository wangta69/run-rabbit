import { Component,OnInit,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import * as THREE from 'three';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit{
  @ViewChild('domContainer', {
    static: true
  }) domContainer!: ElementRef < HTMLDivElement > ;
  // title = 'run-rabbit';

  //THREEJS RELATED VARIABLES 

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private fieldOfView: any;
  private aspectRatio: any;
  private nearPlane: any;
  private farPlane: any;
  private gobalLight: any;
  private shadowLight: any;
  private backLight: any;
  
  private container: any;
  private controls: any;
  private clock: any;
  private delta = 0;
  private floorRadius = 200;
  private speed = 6;
  private distance = 0;
  private level = 1;
  private levelInterval: any;
  private levelUpdateFreq = 3000;
  private initSpeed = 5;
  private maxSpeed = 48;

  private monster: any;
  private monsterPos = .65;
  private monsterPosTarget = .65;
  private floorRotation = 0;
  private collisionObstacle = 10;
  private collisionBonus = 20;
  private gameStatus = "play";
  private cameraPosGame = 160;
  private cameraPosGameOver = 260;
  private monsterAcceleration = 0.004;
  private malusClearColor = 0xb44b39;
  private malusClearAlpha = 0;
  private audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3');


  private carrot: any;
  private obstacle: any;
  private floor: any; //new THREE.Group();
  private fieldGameOver: any;
  private fieldDistance: any;
  private bonusParticles: any;

  //SCREEN & MOUSE VARIABLES

  private HEIGHT!: number;
  private WIDTH!: number;
  private windowHalfX: any;
  private windowHalfY: any;
  private mousePos = {
      x: 0,
      y: 0
  };

  //3D OBJECTS VARIABLES

  private hero: any;

  // Materials
  private greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
    // shading: THREE.FlatShading,
  });

  private skinMat = new THREE.MeshPhongMaterial({
  color: 0xff9ea5,
  // shading: THREE.FlatShading
  });


  // OTHER VARIABLES

  private PI = Math.PI;

  constructor(
  ) { 
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.initScreenAnd3D();
    this.createLights();
    this.createFloor()
    this.createHero();
    this.createMonster();
    this.createFirs();
    this.createCarrot();
    this.createBonusParticles();
    this.createObstacle();
    this.initUI();
    this.resetGame();
    this.loop();
  }

  private initScreenAnd3D() {
    // this.HEIGHT = window.innerHeight;
    // this.WIDTH = window.innerWidth;
    this.WIDTH = this.domContainer.nativeElement.offsetWidth;
    this.HEIGHT = this.domContainer.nativeElement.offsetHeight;

    this.windowHalfX = this.WIDTH / 2;
    this.windowHalfY = this.HEIGHT / 2;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xd6eae6, 160, 350);

    // 카메라 환경설정
    this.aspectRatio = this.WIDTH / this.HEIGHT;
    this.fieldOfView = 50;
    this.nearPlane = 1;
    this.farPlane = 2000;
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.aspectRatio,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.x = 0;
    this.camera.position.z = this.cameraPosGame;
    this.camera.position.y = 30;
    this.camera.lookAt(new THREE.Vector3(0, 30, 0));


    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(this.malusClearColor, this.malusClearAlpha);

    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    // this.renderer.shadowMap.enabled = true;

    // this.container = document.getElementById('world');
    // this.container.appendChild(this.renderer.domElement);
    this.domContainer.nativeElement.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.handleWindowResize, false);
    document.addEventListener('mousedown', this.handleMouseDown, false);
    document.addEventListener("touchend", this.handleMouseDown, false);

    

    // this.controls.noPan = true;


    this.clock = new THREE.Clock();
  }

  private createLights() {
    const globalLight = new THREE.AmbientLight(0xffffff, .9);

    const shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(-30, 40, 20);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 2000;
    shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;

    this.scene.add(globalLight);
    this.scene.add(shadowLight);
  }
  private createFloor() {
    const floorShadow = new THREE.Mesh(new THREE.SphereGeometry(this.floorRadius, 50, 50), new THREE.MeshPhongMaterial({
      color: 0x7abf8e,
      specular: 0x000000,
      shininess: 1,
      transparent: true,
      opacity: .5
    }));
    //floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.receiveShadow = true;

    const floorGrass = new THREE.Mesh(new THREE.SphereGeometry(this.floorRadius - .5, 50, 50), new THREE.MeshBasicMaterial({
        color: 0x7abf8e
    }));
    //floor.rotation.x = -Math.PI / 2;
    floorGrass.receiveShadow = false;

    this.floor = new THREE.Group();
    this.floor.position.y = -this.floorRadius;

    this.floor.add(floorShadow);
    this.floor.add(floorGrass);
    this.scene.add(this.floor);
  }
  
  private createHero() {
    this.hero = new Hero(this);
    this.hero.mesh.rotation.y = Math.PI / 2;
    this.scene.add(this.hero.mesh);
    this.hero.nod();
  }

  private createMonster() {
    this.monster = new Monster();
    this.monster.mesh.position.z = 20;
    //monster.mesh.scale.set(1.2,1.2,1.2);
    this.scene.add(this.monster.mesh);
    this.updateMonsterPosition();
  }

  private updateMonsterPosition() {
    this.monster.run();
    this.monsterPosTarget -= this.delta * this.monsterAcceleration;
    this.monsterPos += (this.monsterPosTarget - this.monsterPos) * this.delta;
    if (this.monsterPos < .56) {
      this.gameOver();
    }

    var angle = Math.PI * this.monsterPos;
    this.monster.mesh.position.y = - this.floorRadius + Math.sin(angle) * (this.floorRadius + 12);
    this.monster.mesh.position.x = Math.cos(angle) * (this.floorRadius + 15);
    this.monster.mesh.rotation.z = -Math.PI / 2 + angle;
  }

  private gameOver() {
    this.fieldGameOver.className = "show";
    this.gameStatus = "gameOver";
    this.monster.sit();
    this.hero.hang();
    this.monster.heroHolder.add(this.hero.mesh);
    // this.TweenMax.to(this, 1, { speed: 0 });
    // this.TweenMax.to(camera.position, 3, { z: this.cameraPosGameOver, y: 60, x: -30 });
    this.carrot.mesh.visible = false;
    this.obstacle.mesh.visible = false;
    clearInterval(this.levelInterval);
}

  private createFirs() {
    var nTrees = 100;
    for (var i = 0; i < nTrees; i++) {
        var phi = i * (Math.PI * 2) / nTrees;
        var theta = Math.PI / 2;
        //theta += .25 + Math.random()*.3; 
        theta += (Math.random() > .05) ? .25 + Math.random() * .3 : - .35 - Math.random() * .1;

        var fir = new Tree();
        fir.mesh.position.x = Math.sin(theta) * Math.cos(phi) * this.floorRadius;
        fir.mesh.position.y = Math.sin(theta) * Math.sin(phi) * (this.floorRadius - 10);
        fir.mesh.position.z = Math.cos(theta) * this.floorRadius;

        var vec = fir.mesh.position.clone();
        var axis = new THREE.Vector3(0, 1, 0);
        fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
        this.floor.add(fir.mesh);
    }
  }
  private createCarrot() {
    this.carrot = new Carrot();
    this.scene.add(this.carrot.mesh);
  }
  private createBonusParticles() {
    this.bonusParticles = new BonusParticles();
    this.bonusParticles.mesh.visible = false;
    this.scene.add(this.bonusParticles.mesh);
  }
  private createObstacle() {
    this.obstacle = new Hedgehog();
    this.obstacle.body.rotation.y = -Math.PI / 2;
    this.obstacle.mesh.scale.set(1.1, 1.1, 1.1);
    this.obstacle.mesh.position.y = this.floorRadius + 4;
    this.obstacle.nod();
    this.scene.add(this.obstacle.mesh);
  }
  private initUI() {
    this.fieldDistance = document.getElementById("distValue");
    this.fieldGameOver = document.getElementById("gameoverInstructions");
  }
  private resetGame() {
    this.scene.add(this.hero.mesh);
    this.hero.mesh.rotation.y = Math.PI / 2;
    this.hero.mesh.position.y = 0;
    this.hero.mesh.position.z = 0;
    this.hero.mesh.position.x = 0;

    this.monsterPos = .56;
    this.monsterPosTarget = .65;
    this.speed = this.initSpeed;
    this.level = 0;
    this.distance = 0;
    this.carrot.mesh.visible = true;
    this.obstacle.mesh.visible = true;
    this.gameStatus = "play";
    this.hero.status = "running";
    this.hero.nod();
    this.audio.play();
    this.updateLevel();
    this.levelInterval = setInterval(this.updateLevel, this.levelUpdateFreq);
  }
  private loop() {
    this.delta = this.clock.getDelta();
    this.updateFloorRotation();

    if (this.gameStatus == "play") {

        if (this.hero.status == "running") {
          this.hero.run();
        }
        this.updateDistance();
        this.updateMonsterPosition();
        this.updateCarrotPosition();
        this.updateObstaclePosition();
        this.checkCollision();
    }

    this.render();
    requestAnimationFrame(this.loop);
  }
  private updateFloorRotation() {
    this.floorRotation += this.delta * .03 * this.speed;
    this.floorRotation = this.floorRotation % (Math.PI * 2);
    this.floor.rotation.z = this.floorRotation;
  }

  private updateDistance() {
    this.distance += this.delta * this.speed;
    var d = this.distance / 2;
    this.fieldDistance.innerHTML = Math.floor(d);
  }

  private updateCarrotPosition() {
    this.carrot.mesh.rotation.y += this.delta * 6;
    this.carrot.mesh.rotation.z = Math.PI / 2 - (this.floorRotation + this.carrot.angle);
    this.carrot.mesh.position.y = -this.floorRadius + Math.sin(this.floorRotation + this.carrot.angle) * (this.floorRadius + 50);
    this.carrot.mesh.position.x = Math.cos(this.floorRotation + this.carrot.angle) * (this.floorRadius + 50);

  }

  private updateObstaclePosition() {
    if (this.obstacle.status == "flying") return;

    // TODO fix this,
    if (this.floorRotation + this.obstacle.angle > 2.5) {
      this.obstacle.angle = -this.floorRotation + Math.random() * .3;
      this.obstacle.body.rotation.y = Math.random() * Math.PI * 2;
    }

    this.obstacle.mesh.rotation.z = this.floorRotation + this.obstacle.angle - Math.PI / 2;
    this.obstacle.mesh.position.y = -this.floorRadius + Math.sin(this.floorRotation + this.obstacle.angle) * (this.floorRadius + 3);
    this.obstacle.mesh.position.x = Math.cos(this.floorRotation + this.obstacle.angle) * (this.floorRadius + 3);

  }


  private checkCollision() {
    var db = this.hero.mesh.position.clone().sub(this.carrot.mesh.position.clone());
    var dm = this.hero.mesh.position.clone().sub(this.obstacle.mesh.position.clone());

    if (db.length() < this.collisionBonus) {
      this.getBonus();
    }

    if (dm.length() < this.collisionObstacle && this.obstacle.status != "flying") {
      this.getMalus();
    }
  }

  private getBonus() {
    this.bonusParticles.mesh.position.copy(this.carrot.mesh.position);
    this.bonusParticles.mesh.visible = true;
    this.bonusParticles.explose();
    this.carrot.angle += Math.PI / 2;
    //speed*=.95;
    this.monsterPosTarget += .025;

  }

  private getMalus() {
    this.obstacle.status = "flying";
    var tx = (Math.random() > .5) ? -20 - Math.random() * 10 : 20 + Math.random() * 5;
    // TweenMax.to(obstacle.mesh.position, 4, { x: tx, y: Math.random() * 50, z: 350, ease: Power4.easeOut });
    // TweenMax.to(obstacle.mesh.rotation, 4, {
    //     x: Math.PI * 3, z: Math.PI * 3, y: Math.PI * 6, ease: Power4.easeOut, onComplete: function () {
    //         obstacle.status = "ready";
    //         obstacle.body.rotation.y = Math.random() * Math.PI * 2;
    //         obstacle.angle = -floorRotation - Math.random() * .4;

    //         obstacle.angle = obstacle.angle % (Math.PI * 2);
    //         obstacle.mesh.rotation.x = 0;
    //         obstacle.mesh.rotation.y = 0;
    //         obstacle.mesh.rotation.z = 0;
    //         obstacle.mesh.position.z = 0;

    //     }
    // });
    //
    this.monsterPosTarget -= .04;
    // TweenMax.from(this, .5, {
    //     malusClearAlpha: .5, onUpdate: function () {
    //         renderer.setClearColor(malusClearColor, malusClearAlpha);
    //     }
    // })
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private handleWindowResize() {
    this.HEIGHT = window.innerHeight;
    this.WIDTH = window.innerWidth;
    this.windowHalfX = this.WIDTH / 2;
    this.windowHalfY = this.HEIGHT / 2;
    this.renderer.setSize(this.WIDTH, this.HEIGHT);
    this.camera.aspect = this.WIDTH / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }
  


  private handleMouseDown(event:any) {
    if (this.gameStatus == "play") this.hero.jump();
    else if (this.gameStatus == "readyToReplay") {
      this.replay();
    }
  }


  private updateLevel() {
    if (this.speed >= this.maxSpeed) return;
    this.level++;
    this.speed += 2;
  }

  private replay() {
/*
    gameStatus = "preparingToReplay"

    fieldGameOver.className = "";

    TweenMax.killTweensOf(monster.pawFL.position);
    TweenMax.killTweensOf(monster.pawFR.position);
    TweenMax.killTweensOf(monster.pawBL.position);
    TweenMax.killTweensOf(monster.pawBR.position);

    TweenMax.killTweensOf(monster.pawFL.rotation);
    TweenMax.killTweensOf(monster.pawFR.rotation);
    TweenMax.killTweensOf(monster.pawBL.rotation);
    TweenMax.killTweensOf(monster.pawBR.rotation);

    TweenMax.killTweensOf(monster.tail.rotation);
    TweenMax.killTweensOf(monster.head.rotation);
    TweenMax.killTweensOf(monster.eyeL.scale);
    TweenMax.killTweensOf(monster.eyeR.scale);

    //TweenMax.killTweensOf(hero.head.rotation);

    monster.tail.rotation.y = 0;

    TweenMax.to(camera.position, 3, { z: cameraPosGame, x: 0, y: 30, ease: Power4.easeInOut });
    TweenMax.to(monster.torso.rotation, 2, { x: 0, ease: Power4.easeInOut });
    TweenMax.to(monster.torso.position, 2, { y: 0, ease: Power4.easeInOut });
    TweenMax.to(monster.pawFL.rotation, 2, { x: 0, ease: Power4.easeInOut });
    TweenMax.to(monster.pawFR.rotation, 2, { x: 0, ease: Power4.easeInOut });
    TweenMax.to(monster.mouth.rotation, 2, { x: .5, ease: Power4.easeInOut });


    TweenMax.to(monster.head.rotation, 2, { y: 0, x: -.3, ease: Power4.easeInOut });

    TweenMax.to(hero.mesh.position, 2, { x: 20, ease: Power4.easeInOut });
    TweenMax.to(hero.head.rotation, 2, { x: 0, y: 0, ease: Power4.easeInOut });
    TweenMax.to(monster.mouth.rotation, 2, { x: .2, ease: Power4.easeInOut });
    TweenMax.to(monster.mouth.rotation, 1, {
        x: .4, ease: Power4.easeIn, delay: 1, onComplete: function () {

            resetGame();
        }
    });
*/
  }
  

}

class Hero {

  private parent: AppComponent;


  private status = '';
  private runningCycle = 0;
  public mesh: any;
  private body: any;

  private torsoGeom: any;
  private torso: any;

  private pantsGeom: any;
  private pants: any;

  private tailGeom: any;
  private tail: any;

  private headGeom: any;
  private head: any;

  private cheekGeom: any;
  private cheekR: any;
  private cheekL: any;

  private noseGeom: any;
  private nose: any;

  private mouthGeom: any;
  private mouth: any;

  private pawFGeom: any;
  private pawFR: any;

  private pawFL: any;

  private pawBGeom: any;
  private pawBL: any;
  private pawBR: any;

  private earGeom: any;
  private earL: any;
  private earR: any;

  private eyeGeom: any;
  private eyeL: any;
  private eyeR: any;

  private irisGeom: any;
  private iris: any;

  private blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
  // shading: THREE.FlatShading,
  });
  
  private brownMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess: 0,
  // shading: THREE.FlatShading,
  });

  private whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
  // shading: THREE.FlatShading,
  });

  private lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
  // shading: THREE.FlatShading,
  });

  private pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
  // shading: THREE.FlatShading,
  });

  constructor(parent: AppComponent) {
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

    // var torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1);
    var torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1);
    this.torso = new THREE.Mesh(torsoGeom, this.brownMat);
    this.torso.position.z = 0;
    this.torso.position.y = 7;
    this.torso.castShadow = true;
    this.body.add(this.torso);

    var pantsGeom = new THREE.BoxGeometry(9, 9, 5, 1);
    this.pants = new THREE.Mesh(pantsGeom, this.whiteMat);
    this.pants.position.z = -3;
    this.pants.position.y = 0;
    this.pants.castShadow = true;
    this.torso.add(this.pants);

    var tailGeom = new THREE.BoxGeometry(3, 3, 3, 1);
    // tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -2));
    this.tail = new THREE.Mesh(tailGeom, this.lightBrownMat);
    this.tail.position.z = -4;
    this.tail.position.y = 5;
    this.tail.castShadow = true;
    this.torso.add(this.tail);

    this.torso.rotation.x = -Math.PI / 8;

    var headGeom = new THREE.BoxGeometry(10, 10, 13, 1);

    // headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
    this.head = new THREE.Mesh(headGeom, this.brownMat);
    this.head.position.z = 2;
    this.head.position.y = 11;
    this.head.castShadow = true;
    this.body.add(this.head);

    var cheekGeom = new THREE.BoxGeometry(1, 4, 4, 1);
    this.cheekR = new THREE.Mesh(cheekGeom, this.pinkMat);
    this.cheekR.position.x = -5;
    this.cheekR.position.z = 7;
    this.cheekR.position.y = -2.5;
    this.cheekR.castShadow = true;
    this.head.add(this.cheekR);

    this.cheekL = this.cheekR.clone();
    this.cheekL.position.x = - this.cheekR.position.x;
    this.head.add(this.cheekL);


    var noseGeom = new THREE.BoxGeometry(6, 6, 3, 1);
    this.nose = new THREE.Mesh(noseGeom, this.lightBrownMat);
    this.nose.position.z = 13.5;
    this.nose.position.y = 2.6;
    this.nose.castShadow = true;
    this.head.add(this.nose);

    var mouthGeom = new THREE.BoxGeometry(4, 2, 4, 1);
    // mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 3));
    // mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 12));
    this.mouth = new THREE.Mesh(mouthGeom, this.brownMat);
    this.mouth.position.z = 8;
    this.mouth.position.y = -4;
    this.mouth.castShadow = true;
    this.head.add(this.mouth);


    var pawFGeom = new THREE.BoxGeometry(3, 3, 3, 1);
    this.pawFR = new THREE.Mesh(pawFGeom, this.lightBrownMat);
    this.pawFR.position.x = -2;
    this.pawFR.position.z = 6;
    this.pawFR.position.y = 1.5;
    this.pawFR.castShadow = true;
    this.body.add(this.pawFR);

    this.pawFL = this.pawFR.clone();
    this.pawFL.position.x = - this.pawFR.position.x;
    this.pawFL.castShadow = true;
    this.body.add(this.pawFL);

    var pawBGeom = new THREE.BoxGeometry(3, 3, 6, 1);
    this.pawBL = new THREE.Mesh(pawBGeom, this.lightBrownMat);
    this.pawBL.position.y = 1.5;
    this.pawBL.position.z = 0;
    this.pawBL.position.x = 5;
    this.pawBL.castShadow = true;
    this.body.add(this.pawBL);

    this.pawBR = this.pawBL.clone();
    this.pawBR.position.x = - this.pawBL.position.x;
    this.pawBR.castShadow = true;
    this.body.add(this.pawBR);

    var earGeom = new THREE.BoxGeometry(7, 18, 2, 1);
    // earGeom.vertices[6].x += 2;
    // earGeom.vertices[6].z += .5;

    // earGeom.vertices[7].x += 2;
    // earGeom.vertices[7].z -= .5;

    // earGeom.vertices[2].x -= 2;
    // earGeom.vertices[2].z -= .5;

    // earGeom.vertices[3].x -= 2;
    // earGeom.vertices[3].z += .5;
    // earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 9, 0));

    this.earL = new THREE.Mesh(earGeom, this.brownMat);
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

    var eyeGeom = new THREE.BoxGeometry(2, 4, 4);

    this.eyeL = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.eyeL.position.x = 5;
    this.eyeL.position.z = 5.5;
    this.eyeL.position.y = 2.9;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    var irisGeom = new THREE.BoxGeometry(.6, 2, 2);

    this.iris = new THREE.Mesh(irisGeom, this.blackMat);
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

  private hang() {
    var _this = this;
    var sp = 1;
    // var ease = Power4.easeOut;

    // TweenMax.killTweensOf(this.eyeL.scale);
    // TweenMax.killTweensOf(this.eyeR.scale);

    this.body.rotation.x = 0;
    this.torso.rotation.x = 0;
    this.body.position.y = 0;
    this.torso.position.y = 7;

    // TweenMax.to(this.mesh.rotation, sp, { y: 0, ease: ease });
    // TweenMax.to(this.mesh.position, sp, { y: -7, z: 6, ease: ease });
    // TweenMax.to(this.head.rotation, sp, { x: Math.PI / 6, ease: ease, onComplete: function () { _this.nod(); } });

    // TweenMax.to(this.earL.rotation, sp, { x: Math.PI / 3, ease: ease });
    // TweenMax.to(this.earR.rotation, sp, { x: Math.PI / 3, ease: ease });

    // TweenMax.to(this.pawFL.position, sp, { y: -1, z: 3, ease: ease });
    // TweenMax.to(this.pawFR.position, sp, { y: -1, z: 3, ease: ease });
    // TweenMax.to(this.pawBL.position, sp, { y: -2, z: -3, ease: ease });
    // TweenMax.to(this.pawBR.position, sp, { y: -2, z: -3, ease: ease });

    // TweenMax.to(this.eyeL.scale, sp, { y: 1, ease: ease });
    // TweenMax.to(this.eyeR.scale, sp, { y: 1, ease: ease });
  }

  private nod() {
    var _this = this;
    var sp = .5 + Math.random();

    // HEAD
    var tHeadRotY = -Math.PI / 6 + Math.random() * Math.PI / 3;
    // TweenMax.to(this.head.rotation, sp, { y: tHeadRotY, ease: Power4.easeInOut, onComplete: function () { _this.nod() } });

    // // EARS
    // var tEarLRotX = Math.PI / 4 + Math.random() * Math.PI / 6;
    // var tEarRRotX = Math.PI / 4 + Math.random() * Math.PI / 6;

    // TweenMax.to(this.earL.rotation, sp, { x: tEarLRotX, ease: Power4.easeInOut });
    // TweenMax.to(this.earR.rotation, sp, { x: tEarRRotX, ease: Power4.easeInOut });


    // // PAWS BACK LEFT

    // var tPawBLRot = Math.random() * Math.PI / 2;
    // var tPawBLY = -4 + Math.random() * 8;

    // TweenMax.to(this.pawBL.rotation, sp / 2, { x: tPawBLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });
    // TweenMax.to(this.pawBL.position, sp / 2, { y: tPawBLY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });


    // // PAWS BACK RIGHT

    // var tPawBRRot = Math.random() * Math.PI / 2;
    // var tPawBRY = -4 + Math.random() * 8;
    // TweenMax.to(this.pawBR.rotation, sp / 2, { x: tPawBRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });
    // TweenMax.to(this.pawBR.position, sp / 2, { y: tPawBRY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

    // // PAWS FRONT LEFT

    // var tPawFLRot = Math.random() * Math.PI / 2;
    // var tPawFLY = -4 + Math.random() * 8;

    // TweenMax.to(this.pawFL.rotation, sp / 2, { x: tPawFLRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

    // TweenMax.to(this.pawFL.position, sp / 2, { y: tPawFLY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

    // // PAWS FRONT RIGHT

    // var tPawFRRot = Math.random() * Math.PI / 2;
    // var tPawFRY = -4 + Math.random() * 8;

    // TweenMax.to(this.pawFR.rotation, sp / 2, { x: tPawFRRot, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

    // TweenMax.to(this.pawFR.position, sp / 2, { y: tPawFRY, ease: Power1.easeInOut, yoyo: true, repeat: 2 });

    // // MOUTH
    // var tMouthRot = Math.random() * Math.PI / 8;
    // TweenMax.to(this.mouth.rotation, sp, { x: tMouthRot, ease: Power1.easeInOut });
    // // IRIS
    // var tIrisY = -1 + Math.random() * 2;
    // var tIrisZ = -1 + Math.random() * 2;
    // var iris1 = this.iris;
    // var iris2 = this.eyeR.children[0];
    // TweenMax.to([iris1.position, iris2.position], sp, { y: tIrisY, z: tIrisZ, ease: Power1.easeInOut });

    // //EYES
    // if (Math.random() > .2) TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 8, { y: 0, ease: Power1.easeInOut, yoyo: true, repeat: 1 });

  }


  private run () {
    this.status = "running";

    // var s = Math.min(speed, maxSpeed);

    // this.runningCycle += delta * s * .7;
    // this.runningCycle = this.runningCycle % (Math.PI * 2);
    // var t = this.runningCycle;

    // var amp = 4;
    // var disp = .2;

    // // BODY

    // this.body.position.y = 6 + Math.sin(t - Math.PI / 2) * amp;
    // this.body.rotation.x = .2 + Math.sin(t - Math.PI / 2) * amp * .1;

    // this.torso.rotation.x = Math.sin(t - Math.PI / 2) * amp * .1;
    // this.torso.position.y = 7 + Math.sin(t - Math.PI / 2) * amp * .5;

    // // MOUTH
    // this.mouth.rotation.x = Math.PI / 16 + Math.cos(t) * amp * .05;

    // // HEAD
    // this.head.position.z = 2 + Math.sin(t - Math.PI / 2) * amp * .5;
    // this.head.position.y = 8 + Math.cos(t - Math.PI / 2) * amp * .7;
    // this.head.rotation.x = -.2 + Math.sin(t + Math.PI) * amp * .1;

    // // EARS
    // this.earL.rotation.x = Math.cos(-Math.PI / 2 + t) * (amp * .2);
    // this.earR.rotation.x = Math.cos(-Math.PI / 2 + .2 + t) * (amp * .3);

    // // EYES
    // this.eyeR.scale.y = this.eyeL.scale.y = .7 + Math.abs(Math.cos(-Math.PI / 4 + t * .5)) * .6;

    // // TAIL
    // this.tail.rotation.x = Math.cos(Math.PI / 2 + t) * amp * .3;

    // // FRONT RIGHT PAW
    // this.pawFR.position.y = 1.5 + Math.sin(t) * amp;
    // this.pawFR.rotation.x = Math.cos(t) * Math.PI / 4;


    // this.pawFR.position.z = 6 - Math.cos(t) * amp * 2;

    // // FRONT LEFT PAW

    // this.pawFL.position.y = 1.5 + Math.sin(disp + t) * amp;
    // this.pawFL.rotation.x = Math.cos(t) * Math.PI / 4;


    // this.pawFL.position.z = 6 - Math.cos(disp + t) * amp * 2;

    // // BACK RIGHT PAW
    // this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
    // this.pawBR.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


    // this.pawBR.position.z = - Math.cos(Math.PI + t) * amp;

    // // BACK LEFT PAW
    // this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t) * amp;
    // this.pawBL.rotation.x = Math.cos(t + Math.PI * 1.5) * Math.PI / 3;


    // this.pawBL.position.z = - Math.cos(Math.PI + t) * amp;


}

private jump() {
    if (this.status == "jumping") return;
    this.status = "jumping";
    /*
    var _this = this;
    var totalSpeed = 10 / speed;
    var jumpHeight = 45;

    TweenMax.to(this.earL.rotation, totalSpeed, { x: "+=.3", ease: Back.easeOut });
    TweenMax.to(this.earR.rotation, totalSpeed, { x: "-=.3", ease: Back.easeOut });

    TweenMax.to(this.pawFL.rotation, totalSpeed, { x: "+=.7", ease: Back.easeOut });
    TweenMax.to(this.pawFR.rotation, totalSpeed, { x: "-=.7", ease: Back.easeOut });
    TweenMax.to(this.pawBL.rotation, totalSpeed, { x: "+=.7", ease: Back.easeOut });
    TweenMax.to(this.pawBR.rotation, totalSpeed, { x: "-=.7", ease: Back.easeOut });

    TweenMax.to(this.tail.rotation, totalSpeed, { x: "+=1", ease: Back.easeOut });

    TweenMax.to(this.mouth.rotation, totalSpeed, { x: .5, ease: Back.easeOut });

    TweenMax.to(this.mesh.position, totalSpeed / 2, { y: jumpHeight, ease: Power2.easeOut });
    TweenMax.to(this.mesh.position, totalSpeed / 2, {
        y: 0, ease: Power4.easeIn, delay: totalSpeed / 2, onComplete: function () {
            //t = 0;
            _this.status = "running";
        }
    });
    */

  }




}


class Monster {
  private runningCycle = 0;

  private mesh = new THREE.Group();
  private body = new THREE.Group();

  private torsoGeom = new THREE.BoxGeometry(15, 15, 20, 1);
  private torso: any; // = new THREE.Mesh(torsoGeom, blackMat);

  private headGeom = new THREE.BoxGeometry(20, 20, 40, 1);
  private head: any; // = new THREE.Mesh(headGeom, blackMat);


  private mouthGeom = new THREE.BoxGeometry(10, 4, 20, 1);
  private mouth: any; // = new THREE.Mesh(mouthGeom, blackMat);


  private heroHolder = new THREE.Group();


  private toothGeom = new THREE.BoxGeometry(2, 2, 1, 1);




  private tongueGeometry = new THREE.BoxGeometry(6, 1, 14);

  private tongue: any; // = new THREE.Mesh(tongueGeometry, pinkMat);


  private noseGeom = new THREE.BoxGeometry(4, 4, 4, 1);
  private nose: any; // = new THREE.Mesh(noseGeom, pinkMat);



  private eyeGeom = new THREE.BoxGeometry(2, 3, 3);

  private eyeL: any; // = new THREE.Mesh(eyeGeom, whiteMat);
  private eyeR: any; // = this.eyeL.clone();
  private irisGeom = new THREE.BoxGeometry(.6, 1, 1);

  private iris: any; // = new THREE.Mesh(irisGeom, blackMat);


  



  private earGeom = new THREE.BoxGeometry(8, 6, 2, 1);



  private earL: any; // = new THREE.Mesh(earGeom, blackMat);


  private earR: any; // = this.earL.clone();


  // private eyeGeom = new THREE.BoxGeometry(2, 4, 4);

  private tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1);


  private tail: any; // = new THREE.Mesh(tailGeom, blackMat);



  private pawGeom = new THREE.CylinderGeometry(1.5, 0, 10);

  private pawFL: any; // = new THREE.Mesh(pawGeom, blackMat);


  private pawFR: any; // = this.pawFL.clone();


  private pawBR: any; // = this.pawFR.clone();


  private pawBL: any; // = this.pawBR.clone();


  private blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
  // shading: THREE.FlatShading,
  });

  private whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
  // shading: THREE.FlatShading,
  });

  private pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
  // shading: THREE.FlatShading,
  });


  constructor() {
    // 클래스 프로퍼티의 선언과 초기화
    this.create();
  }

  private create() {

    this.runningCycle = 0;

    this.mesh = new THREE.Group();
    this.body = new THREE.Group();

    var torsoGeom = new THREE.BoxGeometry(15, 15, 20, 1);
    this.torso = new THREE.Mesh(torsoGeom, this.blackMat);

    var headGeom = new THREE.BoxGeometry(20, 20, 40, 1);
    // headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 20));
    this.head = new THREE.Mesh(headGeom, this.blackMat);
    this.head.position.z = 12;
    this.head.position.y = 2;

    var mouthGeom = new THREE.BoxGeometry(10, 4, 20, 1);
    // mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -2, 10));
    this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
    this.mouth.position.y = -8;
    this.mouth.rotation.x = .4;
    this.mouth.position.z = 4;

    this.heroHolder = new THREE.Group();
    this.heroHolder.position.z = 20;
    this.mouth.add(this.heroHolder);

    var toothGeom = new THREE.BoxGeometry(2, 2, 1, 1);

    // toothGeom.vertices[1].x -= 1;
    // toothGeom.vertices[4].x += 1;
    // toothGeom.vertices[5].x += 1;
    // toothGeom.vertices[0].x -= 1;

    for (var i = 0; i < 3; i++) {
        var toothf = new THREE.Mesh(toothGeom, this.whiteMat);
        toothf.position.x = -2.8 + i * 2.5;
        toothf.position.y = 1;
        toothf.position.z = 19;

        var toothl = new THREE.Mesh(toothGeom, this.whiteMat);
        toothl.rotation.y = Math.PI / 2;
        toothl.position.z = 12 + i * 2.5;
        toothl.position.y = 1;
        toothl.position.x = 4;

        var toothr = toothl.clone();
        toothl.position.x = -4;

        this.mouth.add(toothf);
        this.mouth.add(toothl);
        this.mouth.add(toothr);
    }

    var tongueGeometry = new THREE.BoxGeometry(6, 1, 14);
    // tongueGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 7));

    this.tongue = new THREE.Mesh(tongueGeometry, this.pinkMat);
    this.tongue.position.z = 2;
    this.tongue.rotation.x = -.2;
    this.mouth.add(this.tongue);

    var noseGeom = new THREE.BoxGeometry(4, 4, 4, 1);
    this.nose = new THREE.Mesh(noseGeom, this.pinkMat);
    this.nose.position.z = 39.5;
    this.nose.position.y = 9;
    this.head.add(this.nose);

    this.head.add(this.mouth);

    var eyeGeom = new THREE.BoxGeometry(2, 3, 3);

    this.eyeL = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.eyeL.position.x = 10;
    this.eyeL.position.z = 5;
    this.eyeL.position.y = 5;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    var irisGeom = new THREE.BoxGeometry(.6, 1, 1);

    this.iris = new THREE.Mesh(irisGeom, this.blackMat);
    this.iris.position.x = 1.2;
    this.iris.position.y = -1;
    this.iris.position.z = 1;
    this.eyeL.add(this.iris);

    this.eyeR = this.eyeL.clone();
    this.eyeR.children[0].position.x = -this.iris.position.x;
    this.eyeR.position.x = -this.eyeL.position.x;
    this.head.add(this.eyeR);


    var earGeom = new THREE.BoxGeometry(8, 6, 2, 1);
    // earGeom.vertices[1].x -= 4;
    // earGeom.vertices[4].x += 4;
    // earGeom.vertices[5].x += 4;
    // earGeom.vertices[5].z -= 2;
    // earGeom.vertices[0].x -= 4;
    // earGeom.vertices[0].z -= 2;


    // earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 3, 0));

    this.earL = new THREE.Mesh(earGeom, this.blackMat);
    this.earL.position.x = 6;
    this.earL.position.z = 1;
    this.earL.position.y = 10;
    this.earL.castShadow = true;
    this.head.add(this.earL);

    this.earR = this.earL.clone();
    this.earR.position.x = -this.earL.position.x;
    this.earR.rotation.z = -this.earL.rotation.z;
    this.head.add(this.earR);

    var eyeGeom = new THREE.BoxGeometry(2, 4, 4);

    var tailGeom = new THREE.CylinderGeometry(5, 2, 20, 4, 1);
    // tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 10, 0));
    // tailGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    // tailGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 4));

    this.tail = new THREE.Mesh(tailGeom, this.blackMat);
    this.tail.position.z = -10;
    this.tail.position.y = 4;
    this.torso.add(this.tail);


    var pawGeom = new THREE.CylinderGeometry(1.5, 0, 10);
    // pawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, -5, 0));
    this.pawFL = new THREE.Mesh(pawGeom, this.blackMat);
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
    var sp = 1.2;
    // var ease = Power4.easeOut;
    // var _this = this;
    // TweenMax.to(this.torso.rotation, sp, { x: -1.3, ease: ease });
    // TweenMax.to(this.torso.position, sp, {
    //     y: -5, ease: ease, onComplete: function () {
    //         _this.nod();
    //         gameStatus = "readyToReplay";
    //     }
    // });

    // TweenMax.to(this.head.rotation, sp, { x: Math.PI / 3, y: -Math.PI / 3, ease: ease });
    // TweenMax.to(this.tail.rotation, sp, { x: 2, y: Math.PI / 4, ease: ease });
    // TweenMax.to(this.pawBL.rotation, sp, { x: -.1, ease: ease });
    // TweenMax.to(this.pawBR.rotation, sp, { x: -.1, ease: ease });
    // TweenMax.to(this.pawFL.rotation, sp, { x: 1, ease: ease });
    // TweenMax.to(this.pawFR.rotation, sp, { x: 1, ease: ease });
    // TweenMax.to(this.mouth.rotation, sp, { x: .3, ease: ease });
    // TweenMax.to(this.eyeL.scale, sp, { y: 1, ease: ease });
    // TweenMax.to(this.eyeR.scale, sp, { y: 1, ease: ease });



  }

  private nod() {
    var _this = this;
    var sp = 1 + Math.random() * 2;

    // HEAD
    var tHeadRotY = -Math.PI / 3 + Math.random() * .5;
    var tHeadRotX = Math.PI / 3 - .2 + Math.random() * .4;
    // TweenMax.to(this.head.rotation, sp, { x: tHeadRotX, y: tHeadRotY, ease: Power4.easeInOut, onComplete: function () { _this.nod() } });

    // // TAIL

    // var tTailRotY = -Math.PI / 4;
    // TweenMax.to(this.tail.rotation, sp / 8, { y: tTailRotY, ease: Power1.easeInOut, yoyo: true, repeat: 8 });

    // // EYES

    // TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp / 20, { y: 0, ease: Power1.easeInOut, yoyo: true, repeat: 1 });
  }

  private run () {
    // var s = Math.min(this.speed, this.maxSpeed);
    // this.runningCycle += delta * s * .7;
    // this.runningCycle = this.runningCycle % (Math.PI * 2);
    // var t = this.runningCycle;

    // this.pawFR.rotation.x = Math.sin(t) * Math.PI / 4;
    // this.pawFR.position.y = -5.5 - Math.sin(t);
    // this.pawFR.position.z = 7.5 + Math.cos(t);

    // this.pawFL.rotation.x = Math.sin(t + .4) * Math.PI / 4;
    // this.pawFL.position.y = -5.5 - Math.sin(t + .4);
    // this.pawFL.position.z = 7.5 + Math.cos(t + .4);

    // this.pawBL.rotation.x = Math.sin(t + 2) * Math.PI / 4;
    // this.pawBL.position.y = -5.5 - Math.sin(t + 3.8);
    // this.pawBL.position.z = -7.5 + Math.cos(t + 3.8);

    // this.pawBR.rotation.x = Math.sin(t + 2.4) * Math.PI / 4;
    // this.pawBR.position.y = -5.5 - Math.sin(t + 3.4);
    // this.pawBR.position.z = -7.5 + Math.cos(t + 3.4);

    // this.torso.rotation.x = Math.sin(t) * Math.PI / 8;
    // this.torso.position.y = 3 - Math.sin(t + Math.PI / 2) * 3;

    // //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
    // this.head.rotation.x = -.1 + Math.sin(-t - 1) * .4;
    // this.mouth.rotation.x = .2 + Math.sin(t + Math.PI + .3) * .4;

    // this.tail.rotation.x = .2 + Math.sin(t - Math.PI / 2);

    // this.eyeR.scale.y = .5 + Math.sin(t + Math.PI) * .5;
 }

}

// 지금 부터 tree 관련 시작
class Tree {

  public mesh = new THREE.Object3D();
  private trunc: any

  constructor() {
    this.mesh = new THREE.Object3D();
    this.trunc = new Trunc();
    this.mesh.add(this.trunc.mesh);
  }
  
}

class Trunc {

  private mesh: any; // = new THREE.Mesh(geom, matTrunc)
  private blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
  // shading: THREE.FlatShading,
  });
  
  private brownMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess: 0,
  // shading: THREE.FlatShading,
  });

  private whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
  // shading: THREE.FlatShading,
  });

  private lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
  // shading: THREE.FlatShading,
  });

  private pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
  // shading: THREE.FlatShading,
  });

  private greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
    // shading: THREE.FlatShading,
  });
  constructor() {
    this.create();
  }

  private create() {

 
    var truncHeight = 50 + Math.random() * 150;
    var topRadius = 1 + Math.random() * 5;
    var bottomRadius = 5 + Math.random() * 5;
    var mats = [this.blackMat, this.brownMat, this.pinkMat, this.whiteMat, this.greenMat, this.lightBrownMat, this.pinkMat];
    var matTrunc = this.blackMat;//mats[Math.floor(Math.random()*mats.length)];
    var nhSegments = 3;//Math.ceil(2 + Math.random()*6);
    var nvSegments = 3;//Math.ceil(2 + Math.random()*6);
    var geom = new THREE.CylinderGeometry(topRadius, bottomRadius, truncHeight, nhSegments, nvSegments);
    // geom.applyMatrix(new THREE.Matrix4().makeTranslation(0, truncHeight / 2, 0));

    this.mesh = new THREE.Mesh(geom, matTrunc);
/*
    for (var i = 0; i < geom.vertices.length; i++) {
        var noise = Math.random();
        var v = geom.vertices[i];
        v.x += -noise + Math.random() * noise * 2;
        v.y += -noise + Math.random() * noise * 2;
        v.z += -noise + Math.random() * noise * 2;

        geom.computeVertexNormals();

        // FRUITS

        if (Math.random() > .7) {
            var size = Math.random() * 3;
            var fruitGeometry = new THREE.BoxGeometry(size, size, size, 1);
            var matFruit = mats[Math.floor(Math.random() * mats.length)];
            var fruit = new THREE.Mesh(fruitGeometry, matFruit);
            fruit.position.x = v.x;
            fruit.position.y = v.y + 3;
            fruit.position.z = v.z;
            fruit.rotation.x = Math.random() * Math.PI;
            fruit.rotation.y = Math.random() * Math.PI;

            this.mesh.add(fruit);
        }

        // BRANCHES

        if (Math.random() > .5 && v.y > 10 && v.y < truncHeight - 10) {
            var h = 3 + Math.random() * 5;
            var thickness = .2 + Math.random();

            var branchGeometry = new THREE.CylinderGeometry(thickness / 2, thickness, h, 3, 1);
            branchGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, h / 2, 0));
            var branch = new THREE.Mesh(branchGeometry, matTrunc);
            branch.position.x = v.x;
            branch.position.y = v.y;
            branch.position.z = v.z;

            var vec = new THREE.Vector3(v.x, 2, v.z);
            var axis = new THREE.Vector3(0, 1, 0);
            branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize());


            this.mesh.add(branch);
        }

    }
    */


    this.mesh.castShadow = true;
  }
}


class Carrot {

  private angle = 0;
  private mesh = new THREE.Group();

  private bodyGeom = new THREE.CylinderGeometry(5, 3, 10, 4, 1);


  private body: any; // = new THREE.Mesh(bodyGeom, pinkMat);

  private leafGeom = new THREE.BoxGeometry(5, 10, 1, 1);


  private leaf1: any; // = new THREE.Mesh(leafGeom, greenMat);


  private leaf2: any; // = this.leaf1.clone();



  private pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
  // shading: THREE.FlatShading,
  });

  private greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
    // shading: THREE.FlatShading,
  });
  constructor() {
    this.create();
  }

  private create() {
  
    this.angle = 0;
    this.mesh = new THREE.Group();

    var bodyGeom = new THREE.CylinderGeometry(5, 3, 10, 4, 1);
    // bodyGeom.vertices[8].y += 2;
    // bodyGeom.vertices[9].y -= 3;

    this.body = new THREE.Mesh(bodyGeom, this.pinkMat);

    var leafGeom = new THREE.BoxGeometry(5, 10, 1, 1);
    // leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, 0));
    // leafGeom.vertices[2].x -= 1;
    // leafGeom.vertices[3].x -= 1;
    // leafGeom.vertices[6].x += 1;
    // leafGeom.vertices[7].x += 1;

    this.leaf1 = new THREE.Mesh(leafGeom, this.greenMat);
    this.leaf1.position.y = 7;
    this.leaf1.rotation.z = .3;
    this.leaf1.rotation.x = .2;

    this.leaf2 = this.leaf1.clone();
    this.leaf2.scale.set(1, 1.3, 1);
    this.leaf2.position.y = 7;
    this.leaf2.rotation.z = -.3;
    this.leaf2.rotation.x = -.2;

    this.mesh.add(this.body);
    this.mesh.add(this.leaf1);
    this.mesh.add(this.leaf2);

    this.body.traverse(function (object: any) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
  }
}


class Hedgehog {
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
  // shading: THREE.FlatShading,
  });

  private lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
  // shading: THREE.FlatShading,
  });

  private whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789,
  // shading: THREE.FlatShading,
  });

  constructor() {
    this.create();
  }

  private create() {
    this.angle = 0;
    this.status = "ready";
    this.mesh = new THREE.Group();
    var bodyGeom = new THREE.BoxGeometry(6, 6, 6, 1);
    this.body = new THREE.Mesh(bodyGeom, this.blackMat);

    var headGeom = new THREE.BoxGeometry(5, 5, 7, 1);
    this.head = new THREE.Mesh(headGeom, this.lightBrownMat);
    this.head.position.z = 6;
    this.head.position.y = -.5;

    var noseGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5, 1);
    this.nose = new THREE.Mesh(noseGeom, this.blackMat);
    this.nose.position.z = 4;
    this.nose.position.y = 2;

    var eyeGeom = new THREE.BoxGeometry(1, 3, 3);

    this.eyeL = new THREE.Mesh(eyeGeom, this.whiteMat);
    this.eyeL.position.x = 2.2;
    this.eyeL.position.z = -.5;
    this.eyeL.position.y = .8;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    var irisGeom = new THREE.BoxGeometry(.5, 1, 1);

    this.iris = new THREE.Mesh(irisGeom, this.blackMat);
    this.iris.position.x = .5;
    this.iris.position.y = .8;
    this.iris.position.z = .8;
    this.eyeL.add(this.iris);

    this.eyeR = this.eyeL.clone();
    this.eyeR.children[0].position.x = -this.iris.position.x;
    this.eyeR.position.x = -this.eyeL.position.x;

    var spikeGeom = new THREE.BoxGeometry(.5, 2, .5, 1);
    // spikeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, 0));

    for (var i = 0; i < 9; i++) {
        var row = (i % 3);
        var col = Math.floor(i / 3);
        var sb = new THREE.Mesh(spikeGeom, this.blackMat);
        sb.rotation.x = -Math.PI / 2 + (Math.PI / 12 * row) - .5 + Math.random();
        sb.position.z = -3;
        sb.position.y = -2 + row * 2;
        sb.position.x = -2 + col * 2;
        this.body.add(sb);
        var st = new THREE.Mesh(spikeGeom, this.blackMat);
        st.position.y = 3;
        st.position.x = -2 + row * 2;
        st.position.z = -2 + col * 2;
        st.rotation.z = Math.PI / 6 - (Math.PI / 6 * row) - .5 + Math.random();
        this.body.add(st);

        var sr = new THREE.Mesh(spikeGeom, this.blackMat);
        sr.position.x = 3;
        sr.position.y = -2 + row * 2;
        sr.position.z = -2 + col * 2;
        sr.rotation.z = -Math.PI / 2 + (Math.PI / 12 * row) - .5 + Math.random();
        this.body.add(sr);

        var sl = new THREE.Mesh(spikeGeom, this.blackMat);
        sl.position.x = -3;
        sl.position.y = -2 + row * 2;
        sl.position.z = -2 + col * 2;
        sl.rotation.z = Math.PI / 2 - (Math.PI / 12 * row) - .5 + Math.random();;
        this.body.add(sl);
    }

    this.head.add(this.eyeR);
    var earGeom = new THREE.BoxGeometry(2, 2, .5, 1);
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

    var mouthGeom = new THREE.BoxGeometry(1, 1, .5, 1);
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
    var _this = this;
    var speed = .1 + Math.random() * .5;
    var angle = -Math.PI / 4 + Math.random() * Math.PI / 2;
    // TweenMax.to(this.head.rotation, speed, {
    //     y: angle, onComplete: function () {
    //         _this.nod();
    //     }
    // });
  }

}



class BonusParticles {
  private mesh = new THREE.Group();
  private parts: any[] = [];

  private pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess: 0,
  // shading: THREE.FlatShading,
  });

  private greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess: 0,
    // shading: THREE.FlatShading,
  });

  constructor() {
    this.create();
  }

  private create(){
    this.mesh = new THREE.Group();
    var bigParticleGeom = new THREE.BoxGeometry(10, 10, 10, 1);
    var smallParticleGeom = new THREE.BoxGeometry(5, 5, 5, 1);
    this.parts = [];
    for (var i = 0; i < 10; i++) {
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
    var _this = this;
    var explosionSpeed = .5;
    for (var i = 0; i < this.parts.length; i++) {
        var tx = -50 + Math.random() * 100;
        var ty = -50 + Math.random() * 100;
        var tz = -50 + Math.random() * 100;
        var p = this.parts[i];
        p.position.set(0, 0, 0);
        p.scale.set(1, 1, 1);
        p.visible = true;
        var s = explosionSpeed + Math.random() * .5;
        // TweenMax.to(p.position, s, { x: tx, y: ty, z: tz, ease: Power4.easeOut });
        // TweenMax.to(p.scale, s, { x: .01, y: .01, z: .01, ease: Power4.easeOut, onComplete: removeParticle, onCompleteParams: [p] });
    }
  }
}




/*


//INIT THREE JS, SCREEN AND MOUSE EVENTS

function initScreenAnd3D() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog(0xd6eae6, 160, 350);

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = 1;
    farPlane = 2000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.x = 0;
    camera.position.z = cameraPosGame;
    camera.position.y = 30;
    camera.lookAt(new THREE.Vector3(0, 30, 0));

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(malusClearColor, malusClearAlpha);

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
    document.addEventListener('mousedown', handleMouseDown, false);
    document.addEventListener("touchend", handleMouseDown, false);

    
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.minPolarAngle = -Math.PI / 2; 
    //controls.maxPolarAngle = Math.PI / 2;
    //controls.noZoom = true;
    controls.noPan = true;
    //

    clock = new THREE.Clock();

}

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}


function handleMouseDown(event) {
    if (gameStatus == "play") hero.jump();
    else if (gameStatus == "readyToReplay") {
        replay();
    }
}

function createLights() {
    globalLight = new THREE.AmbientLight(0xffffff, .9);

    shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(-30, 40, 20);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 2000;
    shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;

    scene.add(globalLight);
    scene.add(shadowLight);

}

function createFloor() {

    floorShadow = new THREE.Mesh(new THREE.SphereGeometry(floorRadius, 50, 50), new THREE.MeshPhongMaterial({
        color: 0x7abf8e,
        specular: 0x000000,
        shininess: 1,
        transparent: true,
        opacity: .5
    }));
    //floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.receiveShadow = true;

    floorGrass = new THREE.Mesh(new THREE.SphereGeometry(floorRadius - .5, 50, 50), new THREE.MeshBasicMaterial({
        color: 0x7abf8e
    }));
    //floor.rotation.x = -Math.PI / 2;
    floorGrass.receiveShadow = false;

    floor = new THREE.Group();
    floor.position.y = -floorRadius;

    floor.add(floorShadow);
    floor.add(floorGrass);
    scene.add(floor);

}

Hero = function () {
    this.status = "running";
    this.runningCycle = 0;
    this.mesh = new THREE.Group();
    this.body = new THREE.Group();
    this.mesh.add(this.body);

    var torsoGeom = new THREE.BoxGeometry(7, 7, 10, 1);

    this.torso = new THREE.Mesh(torsoGeom, brownMat);
    this.torso.position.z = 0;
    this.torso.position.y = 7;
    this.torso.castShadow = true;
    this.body.add(this.torso);

    var pantsGeom = new THREE.BoxGeometry(9, 9, 5, 1);
    this.pants = new THREE.Mesh(pantsGeom, whiteMat);
    this.pants.position.z = -3;
    this.pants.position.y = 0;
    this.pants.castShadow = true;
    this.torso.add(this.pants);

    var tailGeom = new THREE.BoxGeometry(3, 3, 3, 1);
    tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -2));
    this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
    this.tail.position.z = -4;
    this.tail.position.y = 5;
    this.tail.castShadow = true;
    this.torso.add(this.tail);

    this.torso.rotation.x = -Math.PI / 8;

    var headGeom = new THREE.BoxGeometry(10, 10, 13, 1);

    headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 7.5));
    this.head = new THREE.Mesh(headGeom, brownMat);
    this.head.position.z = 2;
    this.head.position.y = 11;
    this.head.castShadow = true;
    this.body.add(this.head);

    var cheekGeom = new THREE.BoxGeometry(1, 4, 4, 1);
    this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
    this.cheekR.position.x = -5;
    this.cheekR.position.z = 7;
    this.cheekR.position.y = -2.5;
    this.cheekR.castShadow = true;
    this.head.add(this.cheekR);

    this.cheekL = this.cheekR.clone();
    this.cheekL.position.x = - this.cheekR.position.x;
    this.head.add(this.cheekL);


    var noseGeom = new THREE.BoxGeometry(6, 6, 3, 1);
    this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
    this.nose.position.z = 13.5;
    this.nose.position.y = 2.6;
    this.nose.castShadow = true;
    this.head.add(this.nose);

    var mouthGeom = new THREE.BoxGeometry(4, 2, 4, 1);
    mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 3));
    mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 12));
    this.mouth = new THREE.Mesh(mouthGeom, brownMat);
    this.mouth.position.z = 8;
    this.mouth.position.y = -4;
    this.mouth.castShadow = true;
    this.head.add(this.mouth);


    var pawFGeom = new THREE.BoxGeometry(3, 3, 3, 1);
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

    var pawBGeom = new THREE.BoxGeometry(3, 3, 6, 1);
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

    var earGeom = new THREE.BoxGeometry(7, 18, 2, 1);
    earGeom.vertices[6].x += 2;
    earGeom.vertices[6].z += .5;

    earGeom.vertices[7].x += 2;
    earGeom.vertices[7].z -= .5;

    earGeom.vertices[2].x -= 2;
    earGeom.vertices[2].z -= .5;

    earGeom.vertices[3].x -= 2;
    earGeom.vertices[3].z += .5;
    earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 9, 0));

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

    var eyeGeom = new THREE.BoxGeometry(2, 4, 4);

    this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
    this.eyeL.position.x = 5;
    this.eyeL.position.z = 5.5;
    this.eyeL.position.y = 2.9;
    this.eyeL.castShadow = true;
    this.head.add(this.eyeL);

    var irisGeom = new THREE.BoxGeometry(.6, 2, 2);

    this.iris = new THREE.Mesh(irisGeom, blackMat);
    this.iris.position.x = 1.2;
    this.iris.position.y = 1;
    this.iris.position.z = 1;
    this.eyeL.add(this.iris);

    this.eyeR = this.eyeL.clone();
    this.eyeR.children[0].position.x = -this.iris.position.x;


    this.eyeR.position.x = -this.eyeL.position.x;
    this.head.add(this.eyeR);

    this.body.traverse(function (object) {
        if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
        }
    });
}



function removeParticle(p) {
    p.visible = false;
}
























Fir = function () {
    var height = 200;
    var truncGeom = new THREE.CylinderGeometry(2, 2, height, 6, 1);
    truncGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, height / 2, 0));
    this.mesh = new THREE.Mesh(truncGeom, greenMat);
    this.mesh.castShadow = true;
}

var firs = new THREE.Group();


























window.addEventListener('load', init, false);






////////////////////////////////////////////////
//                                        MODELS
////////////////////////////////////////////////





*/
