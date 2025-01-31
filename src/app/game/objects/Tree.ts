import * as THREE from 'three';
import {Trunc} from './Trunc';
export class Tree {

  public mesh = new THREE.Object3D();
  private trunc: any

  constructor() {
    this.mesh = new THREE.Object3D();
    this.trunc = new Trunc();
    this.mesh.add(this.trunc.mesh);
  }
  
}