import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { House } from './House';
import { Board } from './Board';
import gsap from 'gsap';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import dat from 'dat.gui';

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
scene.fog = new THREE.Fog("black", 0.1, 40);

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
camera.position.set(-11, 201, -10);
camera.rotation.y = Math.PI;
scene.add(camera);


// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight('white')

const gui = new dat.GUI();
   gui.add(light.position, "y", -300, 300, 0.01).name('메쉬의 y위치');
   gui.add(light.position, "z", -200, 200, 0.01).name('메쉬의 z위치');
   gui.add(light.position, "x", -200, 200, 0.01).name('카메라의 x위치');


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
boards.push(new Board({ textureLoader, modelSrc: '/models/Plumbago.jpg', scene, x: -5,y: 1, z: -5}));
boards.push(new Board({ textureLoader, modelSrc: '/models/Plumbago.jpg', scene, x: 7,y: 1, z: -25}));
boards.push(new Board({ textureLoader, modelSrc: '/models/Plumbago.jpg', scene, x: -10,y: 1, z: -45}));
boards.push(new Board({ textureLoader, modelSrc: '/models/Plumbago.jpg', scene, x: 10,y: 1, z: -65}));
boards.push(new Board({ textureLoader, modelSrc: '/models/Plumbago.jpg', scene, x: -5, y: 1, z: -85}));

// const cubeMaterial = new THREE.MeshBasicMaterial({
// 	envMap: cubeTexture,
// 	metalness: 2,
// 	roughness: 0.1
// });

// const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
// const boxMesh = new THREE.Mesh(boxGeometry, cubeMaterial);
// boxMesh.position.set(-7, -52, -10);
// scene.add(boxMesh);

let mixer;

	gltfLoader.load("/models/practiceblended.glb", (gltf) => {
		const practiceMesh = gltf.scene.children[0];
		practiceMesh.position.set(-8, 200, -5);
		practiceMesh.rotation.y = Math.PI*0.2;
		practiceMesh.scale.set(4, 4, 4);
		practiceMesh.castShadow = true;
    scene.add(practiceMesh);

    mixer = new THREE.AnimationMixer(practiceMesh);
    const actions = [];
    actions[0] = mixer.clipAction(gltf.animations[0]);
    actions[1] = mixer.clipAction(gltf.animations[1]);
    actions[2] = mixer.clipAction(gltf.animations[2]);
    actions[1].repetitions = 1;
		actions[1].clampWhenFinished = true;
		setTimeout(() => {
			actions[1].play();
		}, 1000);
	});

const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
const planeMaterial = new THREE.MeshStandardMaterial({ color: "royalblue" });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI * 0.5;
plane.position.set(-8,198,-5)
plane.receiveShadow = true;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(20, 16, 16);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: "royalblue",
	side: THREE.DoubleSide
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.position.set(-8, 195, -5)
scene.add(sphere);
	
const loader = new FontLoader();
loader.load('./models/Dongle Light.json',
	(font) => {
		const textGeometry = new TextGeometry('안녕하세요\n저는 웹 프론트엔드 개발자\n김준용입니다.',
			{
				font: font,
				size: 0.3,
				height: 0,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.01,
				bevelSize: 0.001,
				bevelOffset: 0.01,
				bevelSegments: 24
			}
		);
		textGeometry.center();

		const material = new THREE.MeshStandardMaterial({
			color: "white",
			roughness: 0.3,
			metalness: 0.5
		});
		const mesh = new THREE.Mesh(textGeometry, material);
		mesh.scale.set(2, 2, 2);
		mesh.position.set(-13, 202, -5);
		mesh.rotation.y = Math.PI;

		scene.add(mesh);
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
