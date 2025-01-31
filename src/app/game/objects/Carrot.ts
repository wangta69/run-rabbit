
import * as THREE from 'three';
import { pinkMat, greenMat } from './Constants';

export class Carrot {

  public angle = 0;
  public mesh = new THREE.Group();

  constructor() {
    this.create();
  }

  private create() {
  
    this.angle = 0;
    this.mesh = new THREE.Group();

    const bodyGeom = new THREE.CylinderGeometry(5, 3, 10, 4, 1);
    const bodyGeompositionAttribute = bodyGeom.getAttribute('position');
    const bodyGeomVertex = new THREE.Vector3();
    bodyGeomVertex.fromBufferAttribute(bodyGeompositionAttribute, 8).y += 2;
    bodyGeomVertex.fromBufferAttribute(bodyGeompositionAttribute, 9).y -= 3;


    const body = new THREE.Mesh(bodyGeom, pinkMat);

    const leafGeom = new THREE.BoxGeometry(5, 10, 1, 1);
    const positionAttribute = leafGeom.getAttribute('position');
    const vertex = new THREE.Vector3();

    leafGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 5, 0));
    vertex.fromBufferAttribute(positionAttribute, 2).x -= 1;
    vertex.fromBufferAttribute(positionAttribute, 3).x -= 1;
    vertex.fromBufferAttribute(positionAttribute, 6).x -= 1;
    vertex.fromBufferAttribute(positionAttribute, 7).x -= 1;

    const leaf1 = new THREE.Mesh(leafGeom, greenMat);
    leaf1.position.y = 7;
    leaf1.rotation.z = .3;
    leaf1.rotation.x = .2;

    const leaf2 = leaf1.clone();
    leaf2.scale.set(1, 1.3, 1);
    leaf2.position.y = 7;
    leaf2.rotation.z = -.3;
    leaf2.rotation.x = -.2;

    this.mesh.add(body);
    this.mesh.add(leaf1);
    this.mesh.add(leaf2);

    body.traverse(function (object: any) {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }
}
