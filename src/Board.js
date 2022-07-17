import * as THREE from 'three';

export class Board {
	constructor(info) {
    this.x = info.x;
    this.y = info.y;
		this.z = info.z;

		this.boardTexture = info.textureLoader.load(info.modelSrc);
		
		this.geometry = new THREE.PlaneGeometry(6, 5);
		this.material = new THREE.MeshStandardMaterial({map: this.boardTexture})

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.castShadow = true;
    this.mesh.position.set(this.x, this.y+1.7, this.z);
		this.mesh.scale.set(1, 1, 1);
		this.mesh.rotation.y = Math.PI*1.04;
		info.scene.add(this.mesh);
	}
}