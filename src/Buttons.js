import * as THREE from 'three';

export class Buttons {
	constructor(info) {
    this.x = info.x;
    this.y = info.y;
		this.z = info.z;

    this.index = info.index;
    
    this.playBtnTex = info.playBtnTex;
    this.pauseBtnTex = info.pauseBtnTex;
    this.stopBtnTex = info.stopBtnTex;

    if (this.index == 0) {this.color = "yellow"}
    else if (this.index == 1) { this.color = "salmon" }
    else if (this.index == 2) { this.color = "purple" }
    else if (this.index == 3) { this.color = "gray" }
    else if (this.index == 4) {this.color = "skyblue"}

		
		this.geometry = new THREE.CircleGeometry(0.3, 32);
    this.playMaterial = new THREE.MeshStandardMaterial({
      map: this.playBtnTex,
      color: this.color
    });
    this.pauseMaterial = new THREE.MeshStandardMaterial({
      map: this.pauseBtnTex,
      color: this.color
    });
    this.stopMaterial = new THREE.MeshStandardMaterial({
      map: this.stopBtnTex,
      color: this.color
    });

    this.playMesh = new THREE.Mesh(this.geometry, this.playMaterial);
    this.pauseMesh = new THREE.Mesh(this.geometry, this.pauseMaterial);
    this.stopMesh = new THREE.Mesh(this.geometry, this.stopMaterial);

    this.playMesh.position.set(this.x-3, this.y + 3.0, this.z+1);
    this.pauseMesh.position.set(this.x-3, this.y + 1.7, this.z+1);
    this.stopMesh.position.set(this.x-3, this.y + 0.4, this.z+1);
    
		// this.mesh.scale.set(1, 1, 1);
		// this.mesh.rotation.y = Math.PI * 0.04;
    this.playMesh.name = `${this.index}번째 play버튼`;
    this.pauseMesh.name = `${this.index}번째 pause버튼`;
    this.stopMesh.name = `${this.index}번째 stop버튼`;
		info.scene.add(this.playMesh,this.pauseMesh,this.stopMesh);
	}
}