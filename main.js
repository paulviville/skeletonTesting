import CMap0 from './CMapJS/CMap/CMap0.js';
import Graph from './CMapJS/CMap/Graph.js';
import IncidenceGraph from './CMapJS/CMap/IncidenceGraph.js';
import Renderer from './CMapJS/Rendering/Renderer.js';
import * as THREE from './CMapJS/Libs/three.module.js';
import { OrbitControls } from './CMapJS/Libs/OrbitsControls.js';
import Skeleton, {Key, SkeletonRenderer } from './Skeleton.js';
import SkeletonLBS, {KeyLBS, SkeletonRendererLBS } from './SkeletonLBS.js';
// import DualQuaternion from './DualQuaternion.js';
import {DualQuaternion} from './DualQuaternion.js';

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





// let skel = new Skeleton()

const worldUp = new THREE.Vector3(0, 0, 1);
const worldY = new THREE.Vector3(0, 1, 0);

///DQ rotation error

const translation = new THREE.Quaternion(0, 0.1, 0, 0);
const translationLBS = new THREE.Vector3(0, 0.1, 0);

const rotation = new THREE.Quaternion().setFromAxisAngle(worldY, Math.PI / 2);
const transform = DualQuaternion.setFromRotationTranslation(rotation.clone(), translation.clone());
transform.normalize();
const key0 = new Key(0, transform);

let mR = new THREE.Matrix4().makeRotationFromQuaternion(rotation.invert());
let mT = new THREE.Matrix4().makeTranslation(translationLBS.x, translationLBS.y, translationLBS.z);
const keyLBS0 = new KeyLBS(0, mR.clone().multiply(mT));

const rotation1 = new THREE.Quaternion().setFromAxisAngle(worldUp, Math.PI / 6);
// const rotation1 = new THREE.Quaternion().setFromAxisAngle(worldUp, 0);
const transform1 = DualQuaternion.setFromRotationTranslation(rotation1.clone(), translation.clone());
transform1.normalize();
const key1 = new Key(100, transform1);

rotation1.invert()
let mR1 = new THREE.Matrix4().makeRotationFromQuaternion(rotation1);
const keyLBS1 = new KeyLBS(100, mR1.clone().multiply(mT));

const translationroot = new THREE.Quaternion(0, 0, -0.25, 0);
const transformRoot = DualQuaternion.setFromRotationTranslation(new THREE.Quaternion, translationroot)
const keyroot = new Key(100, transformRoot);


const translationLBSroot = new THREE.Vector3(0, 0, 0.25);
let mTroot = new THREE.Matrix4().makeTranslation(translationLBSroot.x, translationLBSroot.y, translationLBSroot.z);
const keyLBSroot = new KeyLBS(100, mTroot);


const skeletonLBS = new SkeletonLBS;
const rootLBS = skeletonLBS.newBone("root");
skeletonLBS.addKey(rootLBS, keyLBSroot);
const boneLBS0 = skeletonLBS.newBone();
skeletonLBS.setParent(boneLBS0, rootLBS);
skeletonLBS.addKey(boneLBS0, keyLBS0);
skeletonLBS.addKey(boneLBS0, keyLBS1);
const boneLBS1 = skeletonLBS.newBone();
skeletonLBS.setParent(boneLBS1, boneLBS0);
skeletonLBS.addKey(boneLBS1, keyLBS0);
skeletonLBS.addKey(boneLBS1, keyLBS1);
const boneLBS2 = skeletonLBS.newBone();
skeletonLBS.setParent(boneLBS2, boneLBS1);
skeletonLBS.addKey(boneLBS2, keyLBS0);
skeletonLBS.addKey(boneLBS2, keyLBS1);
const boneLBS3 = skeletonLBS.newBone();
skeletonLBS.setParent(boneLBS3, boneLBS2);
skeletonLBS.addKey(boneLBS3, keyLBS0);
skeletonLBS.addKey(boneLBS3, keyLBS1);

const skeleton = new Skeleton;
const root = skeleton.newBone("root");
skeleton.addKey(root, keyroot);
const bone0 = skeleton.newBone();
skeleton.setParent(bone0, root);
skeleton.addKey(bone0, key0);
skeleton.addKey(bone0, key1);
const bone1 = skeleton.newBone();
skeleton.setParent(bone1, bone0);
skeleton.addKey(bone1, key0);
skeleton.addKey(bone1, key1);
const bone2 = skeleton.newBone();
skeleton.setParent(bone2, bone1);
skeleton.addKey(bone2, key0);
skeleton.addKey(bone2, key1);
const bone3 = skeleton.newBone();
skeleton.setParent(bone3, bone2);
skeleton.addKey(bone3, key0);
skeleton.addKey(bone3, key1);

skeleton.setBindTransforms();
skeleton.computeWorldTransforms(0);
skeleton.computeOffsets();

const sRenderer = new SkeletonRenderer(skeleton);
sRenderer.createVertices();
sRenderer.createEdges();
scene.add(sRenderer.vertices)
scene.add(sRenderer.edges)

skeletonLBS.computeWorldTransforms(0);
skeletonLBS.setBindTransforms();
// skeletonLBS.computeOffsets();

const sRendererLBS = new SkeletonRendererLBS(skeletonLBS);
sRendererLBS.createVertices();
sRendererLBS.createEdges();
scene.add(sRendererLBS.vertices)
scene.add(sRendererLBS.edges)

const skin = new IncidenceGraph;
skin.createEmbedding(skin.vertex);
const skinPos = skin.addAttribute(skin.vertex, "position");
const skinBind = skin.addAttribute(skin.vertex, "bind");
const skinWeights = skin.addAttribute(skin.vertex, "weights");

const skinLBS = new IncidenceGraph;
skinLBS.createEmbedding(skinLBS.vertex);
const skinLBSPos = skinLBS.addAttribute(skinLBS.vertex, "position");
const skinLBSBind = skinLBS.addAttribute(skinLBS.vertex, "bind");
const skinLBSWeights = skinLBS.addAttribute(skinLBS.vertex, "weights");


const weights = [
	[{b: 0, w: 0.5}, {b: 1, w: 0.5}],
	[{b: 0, w: 0.25}, {b: 1, w: 0.5}, {b: 2, w: 0.25}],
	[{b: 1, w: 0.5}, {b: 2, w: 0.5}],
	[{b: 1, w: 0.25}, {b: 2, w: 0.5}, {b: 3, w: 0.25}],
	[{b: 2, w: 0.5}, {b: 3, w: 0.5}],
	[{b: 2, w: 0.25}, {b: 3, w: 0.5}, {b: 4, w: 0.25}],
	[{b: 3, w: 0.5}, {b: 4, w: 0.5}],
	[{b: 3, w: 0.25}, {b: 4, w: 0.75}],
	[{b: 4, w: 1}]
]

const upVector = new THREE.Vector3(0, 0.05, 0);
const radiusVector = new THREE.Vector3(0.075, 0, 0);

const nbVerts = 10;
const angle = 2*Math.PI/nbVerts;

for(let w = 0; w < weights.length; ++w) {
	const tempVector = radiusVector.clone();
	tempVector.addScaledVector(upVector, w);

	for(let i = 0; i < nbVerts; ++i){
		let id = skin.addVertex();
		if(i != 0) skin.addEdge(id, id - 1);
		if(i == nbVerts - 1) skin.addEdge(id, id - i);
		if(w > 0) skin.addEdge(id, id - nbVerts);
		
		skinPos[id] = tempVector.clone().addScaledVector(translationLBSroot, -1);
		skinBind[id] = skinPos[id].clone();
		skinWeights[id] = weights[w];
		
		tempVector.applyAxisAngle(worldY, angle);
	}
}

/// LBS
for(let w = 0; w < weights.length; ++w) {
	const tempVector = radiusVector.clone();
	tempVector.addScaledVector(upVector, w);

	for(let i = 0; i < nbVerts; ++i){
		let id = skinLBS.addVertex();
		if(i != 0) skinLBS.addEdge(id, id - 1);
		if(i == nbVerts - 1) skinLBS.addEdge(id, id - i);
		if(w > 0) skinLBS.addEdge(id, id - nbVerts);
		
		skinLBSPos[id] = tempVector.clone().add(translationLBSroot);
		skinLBSBind[id] = skinLBSPos[id].clone();
		skinLBSWeights[id] = weights[w];
		
		tempVector.applyAxisAngle(worldY, angle);
	}
}

const skinRenderer = new Renderer(skin);
skinRenderer.vertices.create();
skinRenderer.vertices.addTo(scene)
skinRenderer.edges.create({color: new THREE.Color(0x550000)});
skinRenderer.edges.addTo(scene)

const skinLBSRenderer = new Renderer(skinLBS);
skinLBSRenderer.vertices.create({color: new THREE.Color(0x00FF00)});
skinLBSRenderer.vertices.addTo(scene)
skinLBSRenderer.edges.create({color: new THREE.Color(0x005500)});
skinLBSRenderer.edges.addTo(scene)

// const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshLambertMaterial);
// scene.add(sphere)
const grid = new THREE.GridHelper(1, 10)
scene.add(grid)
window.checkLocals = function() 
{
	skeleton.foreachBone(b => {
		console.log(skeleton.getLocalTransform(b));
	});
}

window.checkworlds = function() 
{
	skeleton.foreachBone(b => {
		console.log(skeleton.getLocalTransform(b));
	});
}

window.updateRenderer = function(t) {
	sRenderer.computePositions(t);
	sRenderer.updateVertices();
}

let frameCount = 0;
function update (t)
{
	let s = 100 * (Math.sin(t / 1000) / 2 + 0.5);
	sRenderer.computePositions(s);
	sRenderer.updateVertices();
	sRenderer.updateEdges();

	sRendererLBS.computePositions(s);
	sRendererLBS.updateVertices();
	sRendererLBS.updateEdges();

	let dqId = new DualQuaternion;
	// console.log(dqId)
	skin.foreach(skin.vertex, v => {
		let pb = skinBind[v].clone();
		let dqBlend = new DualQuaternion(new THREE.Quaternion(0,0,0,0), new THREE.Quaternion(0,0,0,0));
		for(let w = 0; w < skinWeights[v].length; ++w) {
			let b = skinWeights[v][w];
			let bw = skeleton.getWorldTransform(b.b).clone();
			bw.multiply(skeleton.getBindTransform(b.b));
			dqBlend.addScaledDualQuaternion(bw, b.w);
		}
		// console.log(v, dqBlend, )
		dqBlend.normalize();
		// skinPos[v].copy(dqId.transform(skinBind[v].clone()));
		let pdq = DualQuaternion.setFromTranslation(pb);
		pdq.multiplyDualQuaternions(dqBlend, pdq)

		skinPos[v].copy(pdq.transform(new THREE.Vector3));

	});
	skinRenderer.vertices.update();
	skinRenderer.edges.update();

	skinLBS.foreach(skinLBS.vertex, v => {
		let p0 = new THREE.Vector3();
		let pb = skinLBSBind[v].clone();
		for(let w = 0; w < skinLBSWeights[v].length; ++w) {
			let b = skinLBSWeights[v][w];
			let bw = skeletonLBS.getWorldTransform(b.b).clone();
			bw.multiply(skeletonLBS.getBindTransform(b.b));
			p0.addScaledVector(pb.clone().applyMatrix4(bw), b.w);
		}
		skinLBSPos[v].copy(p0);
	})
	skinLBSRenderer.vertices.update();
	skinLBSRenderer.edges.update();
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