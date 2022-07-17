import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { House } from './House';
import { Board } from './Board';
import gsap from 'gsap';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white');

//fog
scene.fog = new THREE.Fog("white", 5, 30);

// texture loaders
const cubeTextureLoader = new THREE.CubeTextureLoader();
	const cubeTexture = cubeTextureLoader
		.setPath("./models/")
		.load([
   		"px.png",
    	"nx.png",
    	"py.png",
    	"ny.png",
    	"pz.png",
   		"nz.png",
		]);
scene.background = cubeTexture;

// Camera
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
camera.position.set(-11, 21, -10);
camera.rotation.y = Math.PI;
scene.add(camera);


// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight('white', 3);
spotLight.position.set(0, 15, -100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

const gltfLoader = new GLTFLoader();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// const floorMesh = new THREE.Mesh(
// 	new THREE.PlaneGeometry(1000, 1000),
// 	new THREE.MeshStandardMaterial({
// 		map : spaceTexture
// 	})
// );
// floorMesh.rotation.x = -Math.PI / 2;
// floorMesh.receiveShadow = true;
// floorMesh.position.set(0, -10, 0);
// scene.add(floorMesh);

const houses = [];
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: -5,y: 1, z: -5}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: 7,y: 1, z: -25}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: -10,y: 1, z: -45}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: 10,y: 1, z: -65}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: -5, y: 1, z: -85 }));

const boards = [];
boards.push(new Board({ textureLoader, modelSrc: '/models/3.jpg', scene, x: -5,y: 1, z: -5}));
boards.push(new Board({ textureLoader, modelSrc: '/models/3.jpg', scene, x: 7,y: 1, z: -25}));
boards.push(new Board({ textureLoader, modelSrc: '/models/3.jpg', scene, x: -10,y: 1, z: -45}));
boards.push(new Board({ textureLoader, modelSrc: '/models/3.jpg', scene, x: 10,y: 1, z: -65}));
boards.push(new Board({ textureLoader, modelSrc: '/models/3.jpg', scene, x: -5, y: 1, z: -85}));

let mixer;

	gltfLoader.load("/models/practiceblended.glb", (gltf) => {
		const practiceMesh = gltf.scene.children[0];
		practiceMesh.position.set(-8, 20, -5);
		practiceMesh.rotation.y = Math.PI*0.2;
    practiceMesh.scale.set(4, 4, 4);
    scene.add(practiceMesh);

    mixer = new THREE.AnimationMixer(practiceMesh);
    const actions = [];
    actions[0] = mixer.clipAction(gltf.animations[0]);
    actions[1] = mixer.clipAction(gltf.animations[1]);
    actions[2] = mixer.clipAction(gltf.animations[2]);
    actions[1].repetitions = 1;
    actions[1].clampWhenFinished = true;
		actions[1].play();
	});
	
const loader = new FontLoader();
loader.load('./models/Dongle_Bold.json',
	(font) => {
		const textGeometry = new TextGeometry("안녕하세요",
			{
				font: font,
				size: 0.3,
				height: 0.2,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.03,
				bevelOffset: 0.005,
				bevelSegments: 24
			}
		);
		const material = new THREE.MeshStandardMaterial({
			color: "blue",
			roughness: 0.3,
			metalness: 0.7
		});
	}
);

// 그리기
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	if (mixer) mixer.update(delta);

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

let currentSection = 0;
function setSection() {
	// window.pageYOffset
	const newSection = Math.round(window.scrollY / window.innerHeight);

	if (currentSection !== newSection) {
		gsap.to(
			camera.position,
			{
				duration: 1,
				x: houses[newSection].x-2,
				y: houses[newSection].y+1,
				z: houses[newSection].z-5,
			}
		);
		currentSection = newSection;
	}
}

function setSize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('scroll', setSection);
window.addEventListener('resize', setSize);

draw();
