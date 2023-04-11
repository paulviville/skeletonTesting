import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import { DualQuaternion } from './DualQuaternion.js';

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
const geometrySmallCone = new THREE.ConeGeometry(0.05, 0.025, 6, 1);
const white = new THREE.MeshLambertMaterial();
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


scene.add(origin)

scene.add(redCone);
scene.add(greenCone);
scene.add(blueCone);
scene.add(blendedCone);

const zAxis = new THREE.Vector3(0, 0, 1);
const xAxis = new THREE.Vector3(1, 0, 0);


const qRed = new THREE.Quaternion;
const tRed = new THREE.Vector3(0, 0.5, 0);
const dqRed = DualQuaternion.setFromRotationTranslation( qRed, tRed );

const qGreen = new THREE.Quaternion().setFromAxisAngle(zAxis, Math.PI/2);
const tGreen = new THREE.Vector3(0, -0.5, 0);
const dqGreen = DualQuaternion.setFromRotationTranslation( qGreen, tGreen );

const qBlue = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI/2);
const tBlue = new THREE.Vector3(0, -0.5, 0);
const dqBlue = DualQuaternion.setFromRotationTranslation( qBlue, tBlue );

redCone.position.copy(dqRed.transform(vOrigin));
redCone.quaternion.copy(dqRed.real);
greenCone.position.copy(dqGreen.transform(vOrigin));
greenCone.quaternion.copy(dqGreen.real);

blueCone.position.copy(dqBlue.transform(vOrigin));
blueCone.quaternion.copy(dqBlue.real);

const blendWeights = new THREE.Vector3(0.5,0.5,0.5).normalize();
const dqBlend = dqRed.clone().multiplyScalar(blendWeights.x);
dqBlend.addScaledDualQuaternion(dqGreen, blendWeights.y);
dqBlend.addScaledDualQuaternion(dqBlue, blendWeights.z);
dqBlend.normalize();

console.log(dqBlend, dqBlue)

blendedCone.position.copy(dqBlend.transform(vOrigin));
blendedCone.quaternion.copy(dqBlend.real);

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