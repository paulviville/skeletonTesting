import CMap0 from './CMapJS/CMap/CMap0.js';
import Graph from './CMapJS/CMap/Graph.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import Skeleton, {Key, SkeletonRenderer } from './Skeleton.js';
import DualQuaternion from './DualQuaternion.js';

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

const geometry = new THREE.ConeGeometry(0.1, 0.1, 16, 1);
const material = new THREE.MeshLambertMaterial();
const material0 = new THREE.MeshLambertMaterial({color: 0xff0000});
const cone = new THREE.Mesh(geometry, material)

const geoSphere = new THREE.SphereGeometry(0.025, 32, 32);
const s0 = new THREE.Mesh(geometry, material)
const s1 = new THREE.Mesh(geometry, material0)
s1.position.set(0, 0, 0)



// const trans = new THREE.Vector3(1,2,3);
// const rot = new THREE.Quaternion(0, 0, 0, 1);
// const point = new THREE.Vector3(1,2,3);

// const rot = new THREE.Quaternion(0, 0, 0, 1);
// const trans = new THREE.Vector3(0,0.5, 0);
// const axis = new THREE.Vector3(1, 0, 0);
// // const angle = Math.PI/2;
// const angle = 0;

// const realPart = new THREE.Quaternion().setFromAxisAngle(axis, angle);
// // const dualPart = new THREE.Quaternion().copy(rot).multiply(new THREE.Quaternion(0, trans.x, trans.y, trans.z));
// // // const tempQ = dualPart.clone().multiply(realPart.clone().conjugate()).multiplyScalar(0.5)
// // // dualPart.multiply(realPart.clone().conjugate())
// // // dualPart.x *= 0.5; dualPart.y *= 0.5; dualPart.z *= 0.5; dualPart.w *= 0.5;
// // // const dualQuaternion = new THREE.Quaternion().copy(realPart).add(dualPart);
// // const dualQuaternion = realPart.clone();
// // dualQuaternion.x += dualPart.x;
// // dualQuaternion.y += dualPart.y;
// // dualQuaternion.z += dualPart.z;
// // dualQuaternion.w += dualPart.w;

// const point = new THREE.Vector3();
// // point.applyQuaternion(dualQuaternion);
// console.log(point)
// console.log(realPart)
// const dqq = DualQuaternion.fromRotTrans(realPart, trans);
// console.log(dqq);
// console.log(dqq.transform(point))
// // const dq = new DualQuaternion(new THREE.Quaternion(0,0,0,1), new THREE.Quaternion(0, 0, 1, 0));
// // dq.normalize()
// // console.log(dq)

// s1.position.copy(dqq.transform(point))
// console.log(s1.position.length(), trans.length())
// const testP = dq.transform(trans);
// console.log(testP)

scene.add(cone)
scene.add(s0)
scene.add(s1)

window.addEventListener('resize', function() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});





// let skel = new Skeleton()

const worldUp = new THREE.Vector3(0, 0, 1);
const scale1 = new THREE.Vector3(1, 1, 1);
const Vec0 = new THREE.Vector3;

const m0 = new THREE.Matrix4();
const m1 = new THREE.Matrix4();
const m2 = new THREE.Matrix4();
const m3 = new THREE.Matrix4();
const m4 = new THREE.Matrix4();

const t0 = new THREE.Vector3(0, 0, 0);
const q0 = new THREE.Quaternion();
// q0.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 3);
m0.compose(t0, q0, scale1);

const t1l = new THREE.Matrix4().makeTranslation(0, 0.1, 0);
const q1 = new THREE.Quaternion();
// q1.setFromAxisAngle(worldUp, Math.PI / 12);
const q1l = new THREE.Matrix4().makeRotationFromQuaternion(q1);
m1.multiplyMatrices(q1l, t1l)

const t2 = new THREE.Vector3(0, 0.1, 0);
const t2l = new THREE.Matrix4().makeTranslation(t2.x, t2.y, t2.z);
const q2 = new THREE.Quaternion();
// q2.setFromAxisAngle(worldUp, -Math.PI / 4);
const q2l = new THREE.Matrix4().makeRotationFromQuaternion(q2);
m2.multiplyMatrices(q2l, t2l)

const t3 = new THREE.Vector3(0, 0.1, 0);
const t3l = new THREE.Matrix4().makeTranslation(t3.x, t3.y, t3.z);
const q3 = new THREE.Quaternion();
// q3.setFromAxisAngle(worldUp, Math.PI / 3);
const q3l = new THREE.Matrix4().makeRotationFromQuaternion(q3);
m3.multiplyMatrices(q3l, t3l)

const t4 = new THREE.Vector3(0, 0.1, 0);
const t4l = new THREE.Matrix4().makeTranslation(t4.x, t4.y, t4.z);
const q4 = new THREE.Quaternion();
// q4.setFromAxisAngle(worldUp, -Math.PI / 3);
const q4l = new THREE.Matrix4().makeRotationFromQuaternion(q4);
m4.multiplyMatrices(q4l, t4l)



const bones = [m0, m1, m2, m3, m4];
const boneParent = [null, 0, 1, 2, 3];
const boneVert = [null, null, null, null, null];
const boneLocal = [m0.clone(), m1.clone(), m2.clone(), m3.clone(), m4.clone()];
const boneWorld = [m0.clone(), m1.clone(), m2.clone(), m3.clone(), m4.clone()];
const bonesBind = [m0.clone(), m1.clone(), m2.clone(), m3.clone(), m4.clone()];
const bonesOffset = [m0.clone(), m1.clone(), m2.clone(), m3.clone(), m4.clone()];
const bonesTarget = [m0.clone(), m1.clone(), m2.clone(), m3.clone(), m4.clone()];

console.log(boneLocal, bonesTarget)

const qT = new THREE.Quaternion();
qT.setFromAxisAngle(worldUp, Math.PI / 6);
const qTm = new THREE.Matrix4().makeRotationFromQuaternion(qT);
bonesTarget[1].multiplyMatrices(qTm, t1l);
qT.setFromAxisAngle(worldUp, Math.PI / 3);
qTm.makeRotationFromQuaternion(qT);
bonesTarget[2].multiplyMatrices(qTm, t2l);
qT.setFromAxisAngle(worldUp, Math.PI / 3);
qTm.makeRotationFromQuaternion(qT);
bonesTarget[3].multiplyMatrices(qTm, t3l);
qT.setFromAxisAngle(worldUp, Math.PI / 3);
qTm.makeRotationFromQuaternion(qT);
bonesTarget[4].multiplyMatrices(qTm, t4l);

// qT.setFromAxisAngle(worldUp, -Math.PI / 3);
// qTm.makeRotationFromQuaternion(qT);
// console.log(qTm, q1l)

window.testFunc = function(test = new THREE.Matrix4) {
	console.log(test)
}

const skeletonGraph = new Graph;
skeletonGraph.createEmbedding(skeletonGraph.vertex);
skeletonGraph.createEmbedding(skeletonGraph.edge);
const position = skeletonGraph.addAttribute(skeletonGraph.vertex, "position");
const boneId = skeletonGraph.addAttribute(skeletonGraph.vertex, "bone");

for(let i = 0; i < bones.length; ++i) {
	const vb = skeletonGraph.addVertex();
	position[skeletonGraph.cell(skeletonGraph.vertex, vb)] = new THREE.Vector3;
	boneVert[i] = vb;
}

for(let i = 0; i < bones.length; ++i) {
	const p = boneParent[i];
	if(p != null) {
		const vb = boneVert[i];
		const vp = boneVert[p];
		skeletonGraph.connectVertices(vb, vp);	
	}
}

for(let i = 0; i < bones.length; ++i) {
	const p = boneParent[i];
	if(p != null) {
		const mb = boneLocal[i].clone();
		const mp = boneWorld[p].clone();
		mp.multiply(mb);
		boneWorld[i].copy(mp);
		bonesBind[i].copy(mp).invert();

		// const q = new THREE.Quaternion();
		// q.setFromAxisAngle(worldUp, Math.PI / 6);
		// const qm = new THREE.Matrix4().makeRotationFromQuaternion(q);
		// mb.multiply(qm);
		// boneWorld[i].compose()
	}
}




for(let i = 0; i < bones.length; ++i) {
	let vb = boneVert[i];
	position[skeletonGraph.cell(skeletonGraph.vertex, vb)].applyMatrix4(boneWorld[i]);
	console.log(position[skeletonGraph.cell(skeletonGraph.vertex, vb)])
}



const points = new CMap0;
points.createEmbedding(points.vertex);
const ppos = points.addAttribute(points.vertex, "position");
const pbind = points.addAttribute(points.vertex, "bind");
const pweights = points.addAttribute(points.vertex, "weights") // {b: id, w:}

ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.05, 0);
ppos[points.newCell(points.vertex)] =  new THREE.Vector3(0.05, 0.1, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.15, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.2, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.25, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.3, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.35, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(0.05, 0.4, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.05, 0);
ppos[points.newCell(points.vertex)] =  new THREE.Vector3(-0.05, 0.1, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.15, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.2, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.25, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.3, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.35, 0);
ppos[points.newCell(points.vertex)] = new THREE.Vector3(-0.05, 0.4, 0);
points.setEmbedding(points.vertex, points.newDart(), 0)
points.setEmbedding(points.vertex, points.newDart(), 1)
points.setEmbedding(points.vertex, points.newDart(), 2)
points.setEmbedding(points.vertex, points.newDart(), 3)
points.setEmbedding(points.vertex, points.newDart(), 4)
points.setEmbedding(points.vertex, points.newDart(), 5)
points.setEmbedding(points.vertex, points.newDart(), 6)
points.setEmbedding(points.vertex, points.newDart(), 7)
points.setEmbedding(points.vertex, points.newDart(), 8)
points.setEmbedding(points.vertex, points.newDart(), 9)
points.setEmbedding(points.vertex, points.newDart(), 10)
points.setEmbedding(points.vertex, points.newDart(), 11)
points.setEmbedding(points.vertex, points.newDart(), 12)
points.setEmbedding(points.vertex, points.newDart(), 13)
points.setEmbedding(points.vertex, points.newDart(), 14)
points.setEmbedding(points.vertex, points.newDart(), 15)
points.setEmbedding(points.vertex, points.newDart(), 16)
points.setEmbedding(points.vertex, points.newDart(), 17)
pbind[0] = ppos[0].clone();
pbind[1] = ppos[1].clone();
pbind[2] = ppos[2].clone();
pbind[3] = ppos[3].clone();
pbind[4] = ppos[4].clone();
pbind[5] = ppos[5].clone();
pbind[6] = ppos[6].clone();
pbind[7] = ppos[7].clone();
pbind[8] = ppos[8].clone();
pbind[9] = ppos[9].clone();
pbind[10] = ppos[10].clone();
pbind[11] = ppos[11].clone();
pbind[12] = ppos[12].clone();
pbind[13] = ppos[13].clone();
pbind[14] = ppos[14].clone();
pbind[15] = ppos[15].clone();
pbind[16] = ppos[16].clone();
pbind[17] = ppos[17].clone();

// pweights[0] = [{b: 0, w: 1}]
pweights[0] = [{b: 0, w: 0.5}, {b: 1, w: 0.5}]
pweights[1] = [{b: 0, w: 0.25}, {b: 1, w: 0.5}, {b: 2, w: 0.25}]
pweights[2] = [{b: 1, w: 0.5}, {b: 2, w: 0.5}]
pweights[3] = [{b: 1, w: 0.25}, {b: 2, w: 0.5}, {b: 3, w: 0.25}]
pweights[4] = [{b: 2, w: 0.5}, {b: 3, w: 0.5}]
pweights[5] = [{b: 2, w: 0.25}, {b: 3, w: 0.5}, {b: 4, w: 0.25}]
pweights[6] = [{b: 3, w: 0.5}, {b: 4, w: 0.5}]
pweights[7] = [{b: 3, w: 0.25}, {b: 4, w: 0.75}]
pweights[8] = [{b: 3, w: 0.0}, {b: 4, w: 1}]

pweights[9] = pweights[0];
pweights[10] = pweights[1];
pweights[11] = pweights[2];
pweights[12] = pweights[3];
pweights[13] = pweights[4];
pweights[14] = pweights[5];
pweights[15] = pweights[6];
pweights[16] = pweights[7];
pweights[17] = pweights[8];

for(let i = 0; i < 18; ++i){
	let p0 = new THREE.Vector3();
	let pb = pbind[i].clone();
	for(let j = 0; j < pweights[i].length; ++j){
		let b = pweights[i][j];
		let bw = boneWorld[b.b].clone();
		bw.multiply(bonesBind[b.b]);
		p0.addScaledVector(pb.clone().applyMatrix4(bw), b.w);
	}
	ppos[i].copy(p0);
}



const translation = new THREE.Matrix4().makeTranslation(0, 0.1, 0);

const rotation = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(worldUp, Math.PI / 8));
const transform = new THREE.Matrix4().multiplyMatrices(rotation, translation)
const key0 = new Key(0, transform);

const rotation1 = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(worldUp, -Math.PI / 8));
const transform1 = new THREE.Matrix4().multiplyMatrices(rotation1, translation)
const key1 = new Key(100, transform1);

const rotation2 = new THREE.Matrix4().makeRotationFromQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI / 6));
const transform2 = new THREE.Matrix4().multiplyMatrices(rotation2, translation)
const key2 = new Key(50, transform2);

const skeleton = new Skeleton;
console.log(skeleton);
const root = skeleton.newBone("root");
const bone0 = skeleton.newBone();
skeleton.setParent(bone0, root);
skeleton.setLocalTransform(bone0, transform);
skeleton.addKey(bone0, key0);
skeleton.addKey(bone0, key1);
const bone1 = skeleton.newBone();
skeleton.setParent(bone1, bone0);
skeleton.addKey(bone1, key0);
skeleton.addKey(bone1, key1);
skeleton.addKey(bone1, key2);
skeleton.setLocalTransform(bone1, transform);
const bone2 = skeleton.newBone();
skeleton.setParent(bone2, bone1);
skeleton.addKey(bone2, key0);
skeleton.addKey(bone2, key1);
skeleton.setLocalTransform(bone2, transform);
const bone3 = skeleton.newBone();
skeleton.setParent(bone3, bone2);
skeleton.addKey(bone3, key0);
skeleton.addKey(bone3, key1);
skeleton.setLocalTransform(bone3, transform);


// skeleton.getLocalTest(bone1, 1)

// const sGraph = SkeletonGraph(skeleton);
// const renderer2 = new Renderer(sGraph);
// renderer2.vertices.create();
// renderer2.vertices.addTo(scene);
// renderer2.edges.create();
// renderer2.edges.addTo(scene);

const sRenderer = new SkeletonRenderer(skeleton);
sRenderer.createVertices();
sRenderer.createEdges();
scene.add(sRenderer.vertices)
scene.add(sRenderer.edges)

// sRenderer.computePositions(17);
// sRenderer.updateVertices()

window.updateRenderer = function(t) {
	sRenderer.computePositions(t);
	sRenderer.updateVertices();
}

console.log(s1)
let frameCount = 0;
function update (t)
{
		let s = 100 * (Math.sin(t / 1000) / 2 + 0.5);
		sRenderer.computePositions(s);
		sRenderer.updateVertices();
		sRenderer.updateEdges();




		const rot = new THREE.Quaternion(0, 0, 0, 1);
		const trans = new THREE.Vector3(0, 1, 1);
		const axis = new THREE.Vector3(0, 1, 0);
		// const angle = Math.PI/2;
		const angle = t / 1000;
		// const angle = 0;

		const realPart = new THREE.Quaternion().setFromAxisAngle(axis, angle);


const point = new THREE.Vector3(0, 0, 1);
const dqq = DualQuaternion.fromRotTrans(realPart, trans);
// console.log(dqq);
// console.log(dqq.transform(point))
	s0.position.copy(point.clone().applyQuaternion(realPart))
	s1.position.copy(dqq.transform(point))
	s1.quaternion.copy(realPart)
	s0.quaternion.copy(realPart)
	// console.log(s1.position.length(), trans.length())
}

function render()
{
	renderer.render(scene, camera);
}

// let prevT = 0;
function mainloop(t)
{
    update(t);
    render();
	requestAnimationFrame(mainloop);
	// console.log((1)/((t - prevT)/1000))
	// prevT = t
}

mainloop(0);