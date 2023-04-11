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

const orbit_controls = new OrbitControls(camera, renderer.domElement)

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

const vOrigin = new THREE.Vector3();

const geometryCone = new THREE.ConeGeometry(0.07, 0.35, 16, 1);
geometryCone.translate(0, 0.175, 0)
const geometrySmallCone = new THREE.ConeGeometry(0.0125, 0.1, 3, 1);
geometrySmallCone.translate(0, 0.05, 0)
const white = new THREE.MeshLambertMaterial({wireframe: true, wireframeLinewidth: 1});
const red = new THREE.MeshLambertMaterial({color: 0xff0000});
const green = new THREE.MeshLambertMaterial({color: 0x00ff00});
const blue = new THREE.MeshLambertMaterial({color: 0x0000ff});
const yellow = new THREE.MeshLambertMaterial({color: 0xffff00});
const blendColor = new THREE.MeshLambertMaterial();

const geometryOrigin = new THREE.SphereGeometry(0.025, 32, 32);
const origin = new THREE.Mesh(geometryOrigin, white)
const s1 = new THREE.Mesh(geometryCone, red)
const redCone = new THREE.Mesh(geometryCone, red)
const s2 = new THREE.Mesh(geometryCone, green)
const greenCone = new THREE.Mesh(geometryCone, green)
const s3 = new THREE.Mesh(geometryCone, blue)
const blueCone = new THREE.Mesh(geometryCone, blue)
const cone = new THREE.Mesh(geometryCone, white)
const blendedCone = new THREE.Mesh(geometryCone, blendColor)
blendedCone.scale.set(0.75, 0.75, 0.75)


scene.add(origin)

scene.add(redCone);
scene.add(greenCone);
scene.add(blueCone);
scene.add(blendedCone);

const zAxis = new THREE.Vector3(0, 0, 1);
const xAxis = new THREE.Vector3(1, 0, 0);


const qRed = new THREE.Quaternion;
const tRed = new THREE.Vector3(0, 1, 0);
const dqRed = DualQuaternion.setFromRotationTranslation( qRed, tRed );

const qGreen = new THREE.Quaternion().setFromAxisAngle(zAxis, -Math.PI/2);
const tGreen = new THREE.Vector3(0, -1, -1);
const dqGreen = DualQuaternion.setFromRotationTranslation( qGreen, tGreen );

const qBlue = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI/2);
const tBlue = new THREE.Vector3(0, -1, 0);
const dqBlue = DualQuaternion.setFromRotationTranslation( qBlue, tBlue );

redCone.position.copy(dqRed.transform(vOrigin));
redCone.quaternion.copy(dqRed.real);
greenCone.position.copy(dqGreen.transform(vOrigin));
greenCone.quaternion.copy(dqGreen.real);
blueCone.position.copy(dqBlue.transform(vOrigin));
blueCone.quaternion.copy(dqBlue.real);



const blendWeights = new THREE.Vector3(0.95,0.5,0.5).normalize();
const dqBlend = dqRed.clone().multiplyScalar(blendWeights.x);
dqBlend.addScaledDualQuaternion(dqGreen, blendWeights.y);
dqBlend.addScaledDualQuaternion(dqBlue, blendWeights.z);
dqBlend.normalize();

console.log(dqBlend, dqBlue)

blendedCone.position.copy(dqBlend.transform(vOrigin));
blendedCone.quaternion.copy(dqBlend.real);

const grid = [];
const dqGrid = new DualQuaternion;
const gridWeights = new THREE.Vector3;
let id = 0;
const gridDivs = 20;
const gridDivsSize = 1 / gridDivs;
for(let i = 0; i <= gridDivs; ++i) {
	for(let j = 0; j <= i; ++j) {
		gridWeights.set(1 - gridDivsSize * i, gridDivsSize * (i - j), gridDivsSize * j);
		// console.log(gridWeights)
		const dqGrid = dqRed.clone().multiplyScalar(gridWeights.x);
		dqGrid.addScaledDualQuaternion(dqGreen, gridWeights.y);
		dqGrid.addScaledDualQuaternion(dqBlue, gridWeights.z);
		dqGrid.normalize();

		grid[id] = new THREE.Mesh(geometrySmallCone, white);
		scene.add(grid[id]);

		grid[id].position.copy(dqGrid.transform(vOrigin));
		grid[id].quaternion.copy(dqGrid.real)
		++id;
	}	
}

function blend() {
	// const color = 0xff0000 * blendWeights.x + 0x00ff00 * blendWeights.y + 0x0000ff * blendWeights.z;
	// blendColor.color.copy(new THREE.Color(color));
	blendColor.color.r = blendWeights.x;
	blendColor.color.g = blendWeights.y;
	blendColor.color.b = blendWeights.z;
	console.log(blendColor)

	dqBlend.copy(dqRed).multiplyScalar(blendWeights.x);
	dqBlend.addScaledDualQuaternion(dqGreen, blendWeights.y);
	dqBlend.addScaledDualQuaternion(dqBlue, blendWeights.z);
	dqBlend.normalize();


	blendedCone.position.copy(dqBlend.transform(vOrigin));
	blendedCone.quaternion.copy(dqBlend.real);
}

function normalizeRedLocked(red) {
    const v = new THREE.Vector2(blendWeights.y, blendWeights.z);    
    v.normalize();
    if(v.length() == 0) v.x = 1;
    v.multiplyScalar(Math.sqrt(1 - red*red));
    blendWeights.x = red;
    blendWeights.y = v.x;
    blendWeights.z = v.y;
	console.log(v.lengthSq(), red*red)
	blend();
}

function normalizeGreenLocked(green) {
    const v = new THREE.Vector2(blendWeights.x, blendWeights.z);    
    v.normalize();
    if(v.length() == 0) v.y = 1;
    v.multiplyScalar(Math.sqrt(1 - green*green));
    blendWeights.x = v.x;
    blendWeights.y = green;
    blendWeights.z = v.y;

	blend();
}

function normalizeBlueLocked(blue) {
    const v = new THREE.Vector2(blendWeights.x, blendWeights.y);    
    v.normalize();
    if(v.length() == 0) v.x = 1;
    v.multiplyScalar(Math.sqrt(1 - blue*blue));
    blendWeights.x = v.x;
    blendWeights.y = v.y;
    blendWeights.z = blue;

	blend();
}

const gui = new DAT.GUI();
const folderWeights = gui.addFolder("weights");
folderWeights.open();
folderWeights.add(blendWeights, 'x').name('red').step(0.001).min(0).max(1).listen().onChange(normalizeRedLocked);
folderWeights.add(blendWeights, 'y').name('green').step(0.001).min(0).max(1).listen().onChange(normalizeGreenLocked);
folderWeights.add(blendWeights, 'z').name('blue').step(0.001).min(0).max(1).listen().onChange(normalizeBlueLocked);


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