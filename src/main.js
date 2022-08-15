import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { House } from './House';
import { Board } from './Board';
import { Buttons } from './Buttons';
import gsap from 'gsap';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import dat from 'dat.gui';
import { PreventDragClick } from './PreventDragClick';
import { Stack } from './Stack';
import * as CANNON from 'cannon-es';
import _ from 'lodash';
import data from './models/project.json';

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
scene.fog = new THREE.Fog("black", 0.1, 30);

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
camera.position.set(-0.5, 2, 5);
camera.rotation.y = Math.PI;
scene.add(camera);


// Light
const ambientLight = new THREE.AmbientLight('white', 1);
scene.add(ambientLight);

// const reallight1 = new THREE.SpotLight('orange', 10, 50, Math.PI / 5);
const reallight2 = new THREE.SpotLight('skyblue', 10, 40, Math.PI / 4.5);
// reallight1.castShadow = true;
// reallight1.position.set(5, 1, 1.5);
reallight2.castShadow = true;
reallight2.position.set(2, 1, 0);
// reallight1.shadow.mapSize.width = 1024;
// reallight1.shadow.mapSize.height = 1024;
reallight2.shadow.mapSize.width = 1024;
reallight2.shadow.mapSize.height = 1024;
scene.add(reallight2);

// const spotLight = new THREE.SpotLight('white', 1, 30, Math.PI / 6);
// scene.add(spotLight);

// const gui = new dat.GUI();
//    gui.add(reallight2.position, "y", -300, 300, 0.01).name('메쉬의 y위치');
//    gui.add(reallight2.position, "z", -200, 200, 0.01).name('메쉬의 z위치');
//    gui.add(reallight2.position, "x", -200, 200, 0.01).name('카메라의 x위치');


const gltfLoader = new GLTFLoader();

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const LogoGeometry = new THREE.CircleGeometry(1, 32);
const LogoTexture = textureLoader.load('./models/logo.jpg');
let rgb1 = 0;
let rgb2 = 255;
let rgb3 = 255;
let LogoRandomColor = new THREE.Color(`rgb(${rgb1},${rgb2},${rgb3})`);
const LogoMaterial = new THREE.MeshStandardMaterial({
	map: LogoTexture,
	side: THREE.DoubleSide,
	color: LogoRandomColor
})
const LogoMesh = new THREE.Mesh(LogoGeometry, LogoMaterial);
LogoMesh.position.set(5.2, 4.2, 10);
LogoMesh.rotation.y = Math.PI;
LogoMesh.material.color.needsUpdate = true;
scene.add(LogoMesh);

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
let newSection = 0;

let videos = document.querySelectorAll('#video');

const houses = [];
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: -5,y: 0, z: -5, index: 0}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: 7,y: 0, z: -25, index: 1}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: -10,y: 0, z: -45, index: 2}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: 10,y: 0, z: -65, index: 3}));
houses.push(new House({ gltfLoader, scene, modelSrc: '/models/tv.glb', x: -5, y: 0, z: -85, index: 4}));

const boards = [];
boards.push(new Board({ video: videos[0], scene, x: -5,y: 0, z: -5, index: 0}));
boards.push(new Board({ video: videos[1], scene, x: 7,y: 0, z: -25, index: 1}));
boards.push(new Board({ video: videos[2], scene, x: -10,y: 0, z: -45, index: 2}));
boards.push(new Board({ video: videos[3], scene, x: 10,y: 0, z: -65, index: 3}));
boards.push(new Board({ video: videos[4], scene, x: -5, y: 0, z: -85, index: 4 }));

const playBtnTex = textureLoader.load("./models/play.png");
const pauseBtnTex = textureLoader.load("./models/pause.png");
const stopBtnTex = textureLoader.load("./models/stop.png");

const buttons = [];
buttons.push(new Buttons({ playBtnTex,pauseBtnTex,stopBtnTex, scene, x: -5,y: 0, z: -5, index: 0}));
buttons.push(new Buttons({ playBtnTex,pauseBtnTex,stopBtnTex, scene, x: 7,y: 0, z: -25, index: 1}));
buttons.push(new Buttons({ playBtnTex,pauseBtnTex,stopBtnTex, scene, x: -10,y: 0, z: -45, index: 2}));
buttons.push(new Buttons({ playBtnTex,pauseBtnTex,stopBtnTex, scene, x: 10,y: 0, z: -65, index: 3}));
buttons.push(new Buttons({ playBtnTex,pauseBtnTex,stopBtnTex, scene, x: -5, y: 0, z: -85, index: 4}));

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
		const practiceMesh = gltf.scene;
		practiceMesh.position.set(3, 1, 10);
		practiceMesh.rotation.y = Math.PI*0.2;
		practiceMesh.scale.set(4, 4, 4);
		practiceMesh.traverse(function (child) {
			if (child.isMesh) {
				child.material.shading = THREE.SmoothShading;
				child.castShadow = true;
				child.receiveShadow = true;
			}
		})
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
			reallight2.target = plane1;
		}, 1000);
	});

// const floorTexture = textureLoader.load('/models/checkboard.jpg');
const planeGeometry1 = new THREE.PlaneGeometry(1000, 20);
const planeGeometry2 = new THREE.PlaneGeometry(1000, 1000);
const floorMaterial = new THREE.MeshStandardMaterial({
	side: THREE.DoubleSide,
	color: "skyblue",
	transparent: true,
	opacity: 0.7,
});
const plane1 = new THREE.Mesh(planeGeometry1, floorMaterial);
plane1.receiveShadow = true;
const plane2 = new THREE.Mesh(planeGeometry2, floorMaterial);
plane2.receiveShadow = true;
plane1.rotation.x = -Math.PI * 0.5;
plane1.position.set(0, -1, 15);
plane2.position.set(0, 499, 20);
plane1.receiveShadow = true;
scene.add(plane1, plane2);

const loader = new FontLoader();
const fontJson = require("./models/NanumMyeongjo_Regular.json");
const font = loader.parse(fontJson);

const textGeometry1 = new TextGeometry(
	'사이트에 방문해주셔서 감사합니다\n\n현재 보고계시는 사이트는\n\n포트폴리오 목적으로 제작된 사이트이며\n\n저에 대한 설명과 제가 참여한 프로젝트들을\n\n보여드리기 위하여 제작되었습니다.\n\n상단에 보이는 프로젝트 보러가기 버튼을\n\n통하여 프로젝트를 확인 하실 수 있으며\n\n하단의 버튼을 통하여\n\n간단한 저의 소개와 보유기술을 확인 하실 수 있습니다.',
	{
		font: font,
		size: 0.1,
		height: 0,
		curveSegments: 6,
		bevelEnabled: true,
		bevelThickness: 0.002,
		bevelSize: 0.001,
		bevelOffset: 0.001,
		bevelSegments: 12
	}
);
textGeometry1.center();

const textMaterial1 = new THREE.MeshStandardMaterial({
	color: "black",
	roughness: 0.1,
	metalness: 0.1,
	transparent: true,
});
const textMesh1 = new THREE.Mesh(textGeometry1, textMaterial1);
		textMesh1.scale.set(1.8, 1.8, 1.8);
		textMesh1.position.set(-3, 2, 10);
		textMesh1.rotation.y = Math.PI;

scene.add(textMesh1);

const textGeometry2 = new TextGeometry(
	'안녕하십니까\n\n성장을 멈추지않는 개발자 김준용입니다.\n\n저는 평소 새로운 기술을 배우는것에 거리낌에 없고\n\n다른 사람들과의 관계에서 낯가림이 없어\n\n타인과의 의사소통적인 부분에 대해서도 항상 적극적입니다.\n\n또한 국비지원 프론트엔드 양성과정을 진행중에도\n\n개인 시간을 할애하여 공부할 정도로 진취적이며\n\n배움이 습관화 되어있습니다\n\n현재로서는 개발자로서 갖춰야할 기술과 CS지식의 공부를 병행하며\n\n현업에 종사하기 위해 노력하고 있습니다.',
	{
		font: font,
		size: 0.15,
		height: 0,
		curveSegments: 6,
		bevelEnabled: true,
		bevelThickness: 0.001,
		bevelSize: 0.001,
		bevelOffset: 0.001,
		bevelSegments: 12
	}
);
textGeometry2.center();

const textMaterial2 = new THREE.MeshBasicMaterial({
	color: "black",
	transparent: true,
	opacity: 0,
});
const textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);
		textMesh2.scale.set(1, 1, 1);
		textMesh2.position.set(-4, 2, 10);
		textMesh2.rotation.y = Math.PI;

scene.add(textMesh2);



// raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const preventDragClick = new PreventDragClick(canvas);

canvas.addEventListener('click', (e) => {
	if (preventDragClick.mouseMoved) return;
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);

	checkIntersects();
});

canvas.addEventListener('mousemove', (e) => {
	mouse.x = e.clientX / canvas.clientWidth * 2 - 1;
	mouse.y = -(e.clientY / canvas.clientHeight * 2 - 1);

	let raycaster2 = new THREE.Raycaster();
	raycaster2.setFromCamera(mouse, camera);
	let intersects = raycaster2.intersectObjects(scene.children);
	if (intersects.length > 0) {
		if (intersects[0].object.name.slice(-2) == "버튼") {
			document.body.style.cursor = "pointer";
		}
		else {
			document.body.style.cursor = "default";
		}
	}
});

function checkIntersects() {
	raycaster.setFromCamera(mouse, camera);

	const intersects = raycaster.intersectObjects(scene.children);
	let btnIndex = Number(intersects[0].object.name.substring(0, 1));
	let btnType = intersects[0].object.name.substring(4);
	if (btnType === "play버튼") {
		videos[btnIndex].play();
	}
	if (btnType === "pause버튼") {
		videos[btnIndex].pause();
	}
	if (btnType === "stop버튼") {
		videos[btnIndex].pause();
		videos[btnIndex].currentTime = 0;
	}
}

let currentSection = 0;
const Modals = document.querySelectorAll('.projectModal');
const projects = document.querySelectorAll('.projectBtn');

function setSection(e) {
	for (const video of videos) {
		video.currentTime = 0;
		video.play();
	}
	let vh = window.innerHeight;
	newSection = Math.ceil(window.scrollY / window.innerHeight);
	if (newSection > 4) {
		newSection = 4;
	}

	if (window.scrollY != 0) {
		if (e.wheelDelta <= 0) { // wheel down
			for (const project of projects) {
				project.classList.remove(`project${newSection - 1}`);
			}
			window.scrollTo(0, vh * newSection);
		}
		else if (e.wheelDelta >= 0) { // wheel up
			newSection -= 1;
			for (const project of projects) {
				project.classList.remove(`project${newSection + 1}`);
			}
			window.scrollTo(0, vh * newSection);
		}
	}
	

	if (currentSection !== newSection) {
		for (const Modal of Modals) {
			Modal.style.right = "-100%";
		}
		for (const project of projects) {
			project.classList.add(`project${newSection}`);
		}
		document.querySelector(`.modal${newSection}`).style.right = "0%";
		gsap.to(camera.position,
			{
				duration: 1,
				x: houses[newSection].x + 3,
				y: houses[newSection].y+2,
				z: houses[newSection].z+6,
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

const sourceBtn = document.querySelector('.sourceBtn');
const pageBtn = document.querySelector('.pageBtn');

sourceBtn.onclick = () => {
	window.open(data[newSection].sourcecord);
}
pageBtn.onclick = () => {
	window.open(data[newSection].page);
}

const btnContainer1 = document.createElement('div');
btnContainer1.classList.add('fixbtnContainer');
document.body.append(btnContainer1);

const btnContainer2 = document.createElement('div');
btnContainer2.classList.add('btnContainer');
const Btn3 = document.createElement("button");
const Btn4 = document.createElement("button");
const Btn5 = document.createElement("button");
Btn3.classList.add('btn', 'stackDelete');
Btn4.classList.add('btn', 'stackDelete');
Btn5.classList.add('btn');
Btn3.innerHTML = '사이트 소개';
Btn4.innerHTML = '자기 소개';
Btn5.innerHTML = '보유기술 보기';
btnContainer2.append(Btn3, Btn4, Btn5);
document.body.append(btnContainer2);

const Btn1 = document.createElement("button");
Btn1.classList.add('fixbtn', 'stackDelete');
Btn1.innerHTML = '처음으로';
Btn1.style.opacity = 0;
Btn1.onclick = () => {
	sourceBtn.style.top = "-100%";
	pageBtn.style.top = "-100%";
	for (const project of projects) { 
		project.classList.remove(`project${newSection}`);
	}
	for (const Modal of Modals) {
		Modal.style.right = "-100%";
	}
	btnContainer2.style.opacity = 1;
	btnContainer2.style.zIndex = 1;
	Btn1.style.opacity = 0;
	Btn2.style.opacity = 1;
	Btn1.style.zIndex = -1;
	Btn2.style.zIndex = 1;
	document.body.style.overflow = "hidden";
	// gsap.to(camera.rotation,{duration: 1,y: Math.PI,});
	camera.rotation.y = Math.PI;
	gsap.to(camera.position, { duration: 1, x: -0.5, y: 2, z: 5, });
	textMesh1.position.y = 6;
	gsap.to(textMesh1.position, { duration: 0.3, y: 2 });
	gsap.to(textMesh2.position, { duration: 0.3, y: -2 });
	gsap.to(textMesh1.material, { duration: 0.3, opacity: 1, });
	gsap.to(textMesh2.material,{duration: 0.3,opacity: 0,});
}
	
btnContainer1.append(Btn1);

const Btn2 = document.createElement("button");
Btn2.classList.add('fixbtn', 'stackDelete');
Btn2.innerHTML = '프로젝트 보러가기';
btnContainer1.append(Btn2);

const overlay = document.querySelector('.projectOverlay');

Btn2.onclick = () => {
	for (const video of videos) {
		video.currentTime = 0;
		video.play();
	}
	for (const project of projects) {
		project.classList.add('project0');
	}
	overlay.style.zIndex = 1;
	overlay.style.opacity = 1;
	sourceBtn.style.top = "25px";
	setTimeout(() => {
		pageBtn.style.top = "25px";
	}, 300);
	document.body.style.overflow = "visible";
	document.getElementsByClassName('projectModal')[0].style.right = "0%"
	btnContainer2.style.opacity = 0;
	btnContainer2.style.zIndex = -1;
	Btn1.style.opacity = 1;
	Btn2.style.opacity = 0;
	Btn1.style.zIndex = 1;
	Btn2.style.zIndex = -1;
	window.scrollTo(0,0);
	camera.rotation.y = 0;
	// gsap.to(camera.rotation,{duration: 1,y: 0,});
	gsap.to(camera.position, { duration: 1, x: -2, y: 2, z: 1, });
}

overlay.onclick = () => {
	overlay.style.display = 'none';
}

const stacks = [];

Btn3.onclick = () => {
	textMesh1.position.y = 6;
	gsap.to(textMesh1.position, { duration: 0.3, y: 2 });
	gsap.to(textMesh2.position, { duration: 0.3, y: -2 });
	gsap.to(textMesh1.material, { duration: 0.3, opacity: 1, });
	gsap.to(textMesh2.material,{duration: 0.3,opacity: 0,});
}

Btn4.onclick = () => {
	textMesh2.position.y = 6;
	gsap.to(textMesh1.position, { duration: 0.3, y: -3 });
	gsap.to(textMesh2.position,{duration: 0.3,y: 2});
	gsap.to(textMesh1.material, { duration: 0.3, opacity: 0, });
	gsap.to(textMesh2.material, { duration: 0.3, opacity: 1, });
}

const cannonWorld = new CANNON.World();
cannonWorld.gravity.set(0, -9.8, 0);

const defaultMaterial = new CANNON.Material('default');

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
	mass: 0,
	position: new CANNON.Vec3(0, -1, 15),
	shape: floorShape,
	material: defaultMaterial
});
floorBody.quaternion.setFromAxisAngle(
	new CANNON.Vec3(-1, 0, 0),
	Math.PI / 2
);
cannonWorld.addBody(floorBody);

// math.random = 0~1의 난수
// math.random() * (최댓값-최소값+1) + 최소값
const stackGeometry = new THREE.BoxGeometry(1, 1, 1);
let stack;

const stackDeletes = document.querySelectorAll('.stackDelete');

for (const stackDelete of stackDeletes) {
	stackDelete.addEventListener('click', () => {
		document.getElementsByClassName('stackInformation')[0].style.left = "100%"
		stacks.forEach(item => {
			cannonWorld.removeBody(item.cannonBody);
			scene.remove(item.mesh);
		});
	})
}

Btn5.onclick = () => {
	document.getElementsByClassName('stackInformation')[0].style.left = "50%"
	gsap.to(textMesh1.position, { duration: 0.5, y: -2 });
	gsap.to(textMesh2.position, { duration: 0.5, y: -2 });
	gsap.to(textMesh1.material, { duration: 0.3, opacity: 0, });
	gsap.to(textMesh2.material, { duration: 0.3, opacity: 0, });
	for (let i = 0; i < 17; i++) {
		stack = new Stack({
			scene: scene,
      cannonWorld,
			geometry: stackGeometry,
			index: i,
      x: Math.random() * -8,
      y: Math.random() * (10-6+1) + 6,
			z: Math.random() * (15 - 10 + 1) + 10,
			rotation: Math.PI*Math.random()
		});
		stacks.push(stack);
	}
}

// 그리기 (시간)
const clock = new THREE.Clock();

function draw() {
	const delta = clock.getDelta();

	let cannonStepTime = 1 / 60;

	if (delta < 0.01) cannonStepTime = 1 / 120;

	cannonWorld.step(cannonStepTime, delta, 3);
	plane1.position.copy(floorBody.position);

	stacks.forEach(item => {
		item.mesh.position.copy(item.cannonBody.position);
		item.mesh.quaternion.copy(item.cannonBody.quaternion);
	})

	if (mixer) mixer.update(delta);

	renderer.render(scene, camera);
	renderer.setAnimationLoop(draw);
}

// 이벤트
// window.addEventListener('mousewheel',
// 	setSection);
window.onwheel = _.debounce((e) => {
	setSection(e);
}, 200);
window.addEventListener('resize', setSize);
window.addEventListener('beforeunload', () => { 
	window.scrollTo(0,0);
});

draw();
