import * as THREE from 'three';

export class Carrot {

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
