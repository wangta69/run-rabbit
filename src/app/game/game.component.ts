import { Component,OnInit,AfterViewInit,ViewChild,ElementRef } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

import * as THREE from 'three';

import { Hero } from './objects/Hero';
import { Monster } from './objects/Monster';
import { Tree } from './objects/Tree';
import { Hedgehog } from './objects/Hedgehog';
import { Carrot } from './objects/Carrot';
import { BonusParticles } from './objects/BonusParticles';


@Component({
  selector: 'app-root',
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class GameComponent implements OnInit, AfterViewInit{
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
    this.hero = new Hero();
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
  private loop = () => {  
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






// 지금 부터 tree 관련 시작












/*











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
