import { Body, Vec3, Sphere } from 'cannon-es';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Mesh } from 'three';

export class Stack {
  constructor(info) {
    this.index = info.index;
    this.rotation = info.rotation;

    this.loader = new THREE.TextureLoader();

    this.materialArray = [
      new THREE.MeshBasicMaterial({ map: this.loader.load(`./models/로고사진/${this.index}.jpg`) }),
      new THREE.MeshBasicMaterial({ map: this.loader.load(`./models/로고사진/${this.index}.jpg`) }),
      new THREE.MeshBasicMaterial({ map: this.loader.load(`./models/로고사진/${this.index}.jpg`) }),
      new THREE.MeshBasicMaterial({ map: this.loader.load(`./models/로고사진/${this.index}.jpg`) }),
      new THREE.MeshBasicMaterial({ map: this.loader.load(`./models/로고사진/${this.index}.jpg`) }),
      new THREE.MeshBasicMaterial( {map: this.loader.load(`./models/로고사진/${this.index}.jpg`)})
    ]

    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;
    this.geometry = info.geometry;
    
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scale = info.scale;

    this.mesh = new Mesh(this.geometry, this.materialArray);
    this.mesh.castShadow = true;
    this.mesh.position.set(this.x, this.y, this.z);
    this.scene.add(this.mesh);

    this.setCannonBody();
    console.log(this.rotation);
  }

  setCannonBody() {
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape: shape
    });
    this.cannonBody.quaternion.setFromAxisAngle(
			new Vec3(1, 1, 1),
			this.rotation
		);
    this.cannonWorld.addBody(this.cannonBody);
  }
}