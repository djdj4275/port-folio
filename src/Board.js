import * as THREE from 'three';
import data from './models/project.json';

export class Board {
	constructor(info) {
    this.x = info.x;
    this.y = info.y;
		this.z = info.z;

		this.index = info.index;
		this.video = info.video;
		this.video.src = data[this.index].videosrc;

		let videoTexture = new THREE.VideoTexture(this.video);
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.maxFilter = THREE.LinearFilter;
		
		this.geometry = new THREE.PlaneGeometry(6, 5);
		this.material = new THREE.MeshStandardMaterial({
			map: videoTexture,
			side: THREE.DoubleSide,
			toneMapped: false,
		})

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.castShadow = true;
    this.mesh.position.set(this.x, this.y+1.7, this.z);
		this.mesh.scale.set(1, 1, 1);
		this.mesh.rotation.y = Math.PI * 0.04;
		this.mesh.name = `${this.index}번째 보드`;
		info.scene.add(this.mesh);
	}
}