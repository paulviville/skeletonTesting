import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import { DualQuaternion } from './DualQuaternion.js';
import * as DAT from './CMapJS/Libs/dat.gui.module.js';



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 1000.0);
camera.position.set(0, 0, 3);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 1);
pointLight0.position.set(10,8,5);
scene.add(pointLight0);

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enablePan = false;
// orbitControls.mouseButtons.LEFT = null;

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const vOrigin = new THREE.Vector3();

const geometryCone = new THREE.ConeGeometry(0.07, 0.35, 16, 1);
const geometryBlendCone = new THREE.ConeGeometry(0.07, 0.35, 4, 1);
geometryCone.translate(0, 0.175, 0)
geometryBlendCone.translate(0, 0.175, 0)
const geometrySmallCone = new THREE.ConeGeometry(0.00625, 0.1, 3, 1);
geometrySmallCone.translate(0, 0.05, 0)
const white = new THREE.MeshLambertMaterial({wireframe: true, wireframeLinewidth: 1});
const red = new THREE.MeshLambertMaterial({color: 0xff0000});
const green = new THREE.MeshLambertMaterial({color: 0x00ff00});
const blue = new THREE.MeshLambertMaterial({color: 0x0000ff});
const black = new THREE.MeshLambertMaterial({color: 0x000000});
const blendColor = new THREE.MeshLambertMaterial();

const geometryOrigin = new THREE.SphereGeometry(0.025, 32, 32);
const origin = new THREE.Mesh(geometryOrigin, white)
const redCone = new THREE.Mesh(geometryCone, red)
const greenCone = new THREE.Mesh(geometryCone, green)
const blueCone = new THREE.Mesh(geometryCone, blue)
const blackCone = new THREE.Mesh(geometryCone, black)
const blendedCone = new THREE.Mesh(geometryBlendCone, blendColor)
blendedCone.scale.set(0.75, 0.75, 0.75)


const geometrySphere = new THREE.SphereGeometry(1, 128, 128);
const bigSphere = new THREE.Mesh(geometrySphere, white);
const smallSphere = new THREE.Mesh(geometrySphere, white);
// smallSphere.scale.set(0.05, 0.05, 0.05);

// scene.add(bigSphere).add(smallSphere)




scene.add(origin)

scene.add(redCone);
scene.add(greenCone);
scene.add(blueCone);
scene.add(blackCone);
scene.add(blendedCone);

const zAxis = new THREE.Vector3(0, 0, 1);
const xAxis = new THREE.Vector3(1, 0, 0);
const xzAxis = new THREE.Vector3(-1, 0, 1).normalize();


const qRed = new THREE.Quaternion;
const tRed = new THREE.Vector3(0, 1, 0);
const dqRed = DualQuaternion.setFromRotationTranslation( qRed, tRed );

const qGreen = new THREE.Quaternion().setFromAxisAngle(zAxis, -Math.PI/3);
const tGreen = new THREE.Vector3(0, -1, 0);
const dqGreen = DualQuaternion.setFromRotationTranslation( qGreen, tGreen );

const qBlue = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI/2);
const tBlue = new THREE.Vector3(0, -1, 0);
const dqBlue = DualQuaternion.setFromRotationTranslation( qBlue, tBlue );

const qBlack = new THREE.Quaternion().setFromAxisAngle(xzAxis,0.85*Math.PI/2);
const tBlack = new THREE.Vector3(0, -1, 0);
const dqBlack = DualQuaternion.setFromRotationTranslation( qBlack, tBlack );


redCone.position.copy(dqRed.transform(vOrigin));
redCone.quaternion.copy(dqRed.real);
greenCone.position.copy(dqGreen.transform(vOrigin));
greenCone.quaternion.copy(dqGreen.real);
blueCone.position.copy(dqBlue.transform(vOrigin));
blueCone.quaternion.copy(dqBlue.real);
blackCone.position.copy(dqBlack.transform(vOrigin));
blackCone.quaternion.copy(dqBlack.real);



const blendWeights = new THREE.Vector4(0.25,0.25,0.25,0.);
const dqBlend = dqRed.clone().multiplyScalar(blendWeights.x);
dqBlend.addScaledDualQuaternion(dqGreen, blendWeights.y);
dqBlend.addScaledDualQuaternion(dqBlue, blendWeights.z);
dqBlend.addScaledDualQuaternion(dqBlack, blendWeights.w);
dqBlend.normalize();


blendedCone.position.copy(dqBlend.transform(vOrigin));
blendedCone.quaternion.copy(dqBlend.real);

const grid = [];
const dqGrid = new DualQuaternion;
const gridWeights = new THREE.Vector4;
let id = 0;
const gridDivs = 15;
const gridDivsSize = 1 / gridDivs;
for(let i = 0; i <= gridDivs; ++i) {
	for(let j = 0; j <= i; ++j) {
		for(let k = 0; k <= i - j; ++k) {
			grid[id] = new THREE.Mesh(geometrySmallCone, white);
			scene.add(grid[id]);
			++id;
		}
	}	
}

function setGrid() {
	let id = 0;
	for(let i = 0; i <= gridDivs; ++i) {
		for(let j = 0; j <= i; ++j) {
			for(let k = 0; k <= i - j; ++k) {
				gridWeights.set(1 - gridDivsSize * i, gridDivsSize * (i - j - k), gridDivsSize * j, gridDivsSize * k);
				const dqGrid = dqRed.clone().multiplyScalar(gridWeights.x);
				dqGrid.addScaledDualQuaternion(dqGreen, gridWeights.y);
				dqGrid.addScaledDualQuaternion(dqBlue, gridWeights.z);
				dqGrid.addScaledDualQuaternion(dqBlack, gridWeights.w);
				dqGrid.normalize();
				grid[id].position.copy(dqGrid.transform(vOrigin));
				grid[id].quaternion.copy(dqGrid.real)
				++id;
			}
		}	
	}
	
	
}

setGrid()


window.test = function(i, j, k) {
	console.log(1-0.1*i, 0.1*(i-j-k), 0.1*j, 0.1*k)
}

function blend() {
	// const color = 0xff0000 * blendWeights.x + 0x00ff00 * blendWeights.y + 0x0000ff * blendWeights.z;
	// blendColor.color.copy(new THREE.Color(color));
	blendColor.color.r = blendWeights.x * (1-blendWeights.w);
	blendColor.color.g = blendWeights.y * (1-blendWeights.w);
	blendColor.color.b = blendWeights.z * (1-blendWeights.w);

	dqBlend.copy(dqRed).multiplyScalar(blendWeights.x);
	dqBlend.addScaledDualQuaternion(dqGreen, blendWeights.y);
	dqBlend.addScaledDualQuaternion(dqBlue, blendWeights.z);
	dqBlend.addScaledDualQuaternion(dqBlack, blendWeights.w);
	dqBlend.normalize();


	blendedCone.position.copy(dqBlend.transform(vOrigin));
	blendedCone.quaternion.copy(dqBlend.real);

	smallSphere.scale.set(blendWeights.w+0.01, blendWeights.w+0.01, blendWeights.w+0.01);

	smallSphere.position.set(blendWeights.y, blendWeights.x, blendWeights.z)
}

function normalize4Locked(v0) {
    const v = new THREE.Vector3(v0.x, v0.y, v0.z);    
	v.normalize();
    if(v.length() == 0) v.x = 1;
	v.multiplyScalar(Math.sqrt(1 - v0.w*v0.w));
	v0.set(v.x, v.y, v.z, v0.w);
	return v0;
}

function normalizeRedLocked(red) {
	const v = new THREE.Vector4(blendWeights.y, blendWeights.z, blendWeights.w, red);
	normalize4Locked(v);
	blendWeights.set(red, v.x, v.y, v.z);
	blend();
}

function normalizeGreenLocked(green) {
    const v = new THREE.Vector4(blendWeights.x, blendWeights.z, blendWeights.w, green);    
	normalize4Locked(v);
	blendWeights.set(v.x, green, v.y, v.z);
	blend();
}

function normalizeBlueLocked(blue) {
    const v = new THREE.Vector4(blendWeights.x, blendWeights.y, blendWeights.w, blue);    
	normalize4Locked(v);
	blendWeights.set(v.x, v.y, blue, v.z);
	blend();
}

function normalizeBlackLocked(black) {
    const v = new THREE.Vector4(blendWeights.x, blendWeights.y, blendWeights.z, black);    
	normalize4Locked(v);
	blendWeights.set(v.x, v.y, v.z, black);
	blend();
}

let bufferQ = qRed.clone();
let bufferT = tRed.clone();
let bufferDQ = new DualQuaternion;
let selectedQ = qRed;
let selectedT = tRed;
let selectedDQ = dqRed;
let selectedCone = redCone;


let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
function onMouseDown(event) {
    if(event.buttons == 2){
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
        let intersections = raycaster.intersectObjects([redCone, blueCone, greenCone, blackCone]);
        if(intersections.length){
			select(intersections[0].object)
        }
        
    }
}

window.addEventListener('pointerdown', onMouseDown, false)

function select(color) {
	switch(color) {
		case redCone:
			selectedQ = qRed;
			selectedT = tRed;
			selectedDQ = dqRed;
			selectedCone = redCone;
			break;
		case greenCone:
			selectedQ = qGreen;
			selectedT = tGreen;
			selectedDQ = dqGreen;
			selectedCone = greenCone;
			break;
		case blueCone:
			selectedQ = qBlue;
			selectedT = tBlue;
			selectedDQ = dqBlue;
			selectedCone = blueCone;
			break;
		case blackCone:
			selectedQ = qBlack;
			selectedT = tBlack;
			selectedDQ = dqBlack;
			selectedCone = blackCone;
			break;
	}

	bufferQ.copy(selectedQ);
	bufferT.copy(selectedT);
}



function normalizeXLocked(x) {
	const v = new THREE.Vector4(qRed.y, qRed.z, qRed.w, x);
	normalize4Locked(v);
	bufferQ.set(x, v.x, v.y, v.z);
	updateAll()
}

function normalizeYLocked(y) {
    const v = new THREE.Vector4(selectedDQ.real.x, selectedDQ.real.z, selectedDQ.real.w, y);    
	normalize4Locked(v);
	bufferQ.set(v.x, y, v.y, v.z);
	updateAll()
}

function normalizeZLocked(z) {
    const v = new THREE.Vector4(selectedDQ.real.x, selectedDQ.real.y, selectedDQ.real.w, z);    
	normalize4Locked(v);
	bufferQ.set(v.x, v.y, z, v.z);
	updateAll()
}

function normalizeWLocked(w) {
    const v = new THREE.Vector4(selectedDQ.real.x, selectedDQ.real.y, selectedDQ.real.z, w);    
	normalize4Locked(v);
	bufferQ.set(v.x, v.y, v.z, w);
	updateAll()
}

function updateAll() {
	bufferDQ = DualQuaternion.setFromRotationTranslation(bufferQ, bufferT);
	selectedCone.position.copy(bufferDQ.transform(vOrigin));
	selectedCone.quaternion.copy(bufferDQ.real)
	selectedDQ.copy(bufferDQ);
	selectedQ.copy(bufferQ);
	selectedT.copy(bufferT);
	setGrid();
	blend();
}


const gui = new DAT.GUI();
const folderWeights = gui.addFolder("weights");
folderWeights.open();
folderWeights.add(blendWeights, 'x').name('red').step(0.0001).min(0).max(1).listen().onChange(normalizeRedLocked);
folderWeights.add(blendWeights, 'y').name('green').step(0.0001).min(0).max(1).listen().onChange(normalizeGreenLocked);
folderWeights.add(blendWeights, 'z').name('blue').step(0.0001).min(0).max(1).listen().onChange(normalizeBlueLocked);
folderWeights.add(blendWeights, 'w').name('black').step(0.0001).min(0).max(1).listen().onChange(normalizeBlackLocked);
const folderQuat = gui.addFolder("Quat");
folderQuat.open();
const folderQuatR = folderQuat.addFolder("real");
const folderQuatD = folderQuat.addFolder("dual");
folderQuatR.add(bufferQ, 'x').name('i').step(0.0001).min(-1).max(1).listen().onChange(normalizeXLocked);
folderQuatR.add(bufferQ, 'y').name('j').step(0.0001).min(-1).max(1).listen().onChange(normalizeYLocked);
folderQuatR.add(bufferQ, 'z').name('k').step(0.0001).min(-1).max(1).listen().onChange(normalizeZLocked);
folderQuatR.add(bufferQ, 'w').name('w').step(0.0001).min(-1).max(1).listen().onChange(normalizeWLocked);
folderQuatD.add(bufferT, 'x').name('i').step(0.01).min(-1).max(1).listen().onChange(updateAll);
folderQuatD.add(bufferT, 'y').name('j').step(0.01).min(-1).max(1).listen().onChange(updateAll);
folderQuatD.add(bufferT, 'z').name('k').step(0.01).min(-1).max(1).listen().onChange(updateAll);



let frameCount = 0;
function update (t)
{



}

function render()
{
	renderer.render(scene, camera);
}

function mainloop(t)
{
    update(t);
    render();
	requestAnimationFrame(mainloop);
}

mainloop(0);