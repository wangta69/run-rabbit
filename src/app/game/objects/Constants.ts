import * as THREE from 'three';

export const pinkMat = new THREE.MeshPhongMaterial({
  color: 0xdc5f45,//0xb43b29,//0xff5b49,
  shininess: 0,
  flatShading: true,
// shading: THREE.FlatShading,
});

export const greenMat = new THREE.MeshPhongMaterial({
  color: 0x7abf8e,
  shininess: 0,
  flatShading: true,
  // shading: THREE.FlatShading,
});

export const blackMat = new THREE.MeshPhongMaterial({
  color: 0x100707,
  flatShading: true,
// shading: THREE.FlatShading,
});

export const brownMat = new THREE.MeshPhongMaterial({
  color: 0xb44b39,
  shininess: 0,
  flatShading: true,
// shading: THREE.FlatShading,
});

export const whiteMat = new THREE.MeshPhongMaterial({
  color: 0xa49789,
  flatShading: true,
// shading: THREE.FlatShading,
});

export const lightBrownMat = new THREE.MeshPhongMaterial({
  color: 0xe07a57,
  flatShading: true,
// shading: THREE.FlatShading,
});
