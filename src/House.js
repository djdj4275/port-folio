export class House {
	constructor(info) {
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;

    this.index = info.index;

		info.gltfLoader.load(
			info.modelSrc,
			glb => {
				this.mesh = glb.scene.children[0];
				this.mesh.castShadow = true;
        this.mesh.position.set(this.x, this.y, this.z);
        this.mesh.rotation.y = Math.PI*0.04;
        this.mesh.scale.set(5, 5, 5);
        this.mesh.name = `${this.index}번째 tv`
				info.scene.add(this.mesh);
			}
		);
	}
}