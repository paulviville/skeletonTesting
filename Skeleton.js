import AttributesContainer from './CMapJS/CMap/AttributeContainer.js';
import Graph from './CMapJS/CMap/Graph.js';
import { Matrix4, Vector3 } from './CMapJS/Libs/three.module.js';
import * as THREE from './CMapJS/Libs/three.module.js';

const root = null;

function KeyFrame (t, mat) {
	this.t = t;
	this.mat = mat;
}

export default function Skeleton () {
	const attributes = new AttributesContainer;
	const bones = attributes.createAttribute("bones");
	const labels = attributes.createAttribute("labels");
	const parents = attributes.createAttribute("parents");
	const bindTransforms = attributes.createAttribute("bindTransforms");
	const localTransforms = attributes.createAttribute("localTransforms");
	const worldTransforms = attributes.createAttribute("worldTransforms");
	const keys = attributes.createAttribute("keys");

	// const

	this.foreachBone = function (func) {
		bones.forEach(bone => func(bone));
	}

	const labelDictionary = {};
	function getBoneFromLabel (label) {
		return labelDictionary[label];
	}

	this.newBone = function (label) {
	// this.newBone = function (label, parentLabel, localTransform) {
		const bone = attributes.newElement();
		bones[bone] = bone;
		labels[bone] = label ?? ("bone_" + bone);
		labelDictionary[labels[bone]] = bone;
		parents[bone] = root;
		bindTransforms[bone] = new Matrix4;
		localTransforms[bone] = new Matrix4;
		worldTransforms[bone] = new Matrix4;
		keys[bone] = [];
		return bone;
	}

	this.nbBones = function () {
		return attributes.nbElements();
	}

	this.setParent = function (bone, parent) {
		parents[bone] = parent;
	}

	this.getParent = function (bone) {
		return parents[bone];
	}

	this.getLocalTransform = function (bone) {
		return localTransforms[bone];
	}

	this.setLocalTransform = function (bone, mat) {
		localTransforms[bone].copy(mat);
	}

	this.getWorldTransform = function (bone) {
		return worldTransforms[bone];
	}

	let computedWorldTransforms = false;
	this.computeWorldTransforms = function () {
		this.foreachBone(bone => {
			const localM = localTransforms[bone];
			const worldM = worldTransforms[bone];
			worldM.identity();

			const parent = parents[bone];
			if(parent != root)
				worldM.copy(worldTransforms[parent]);

			worldM.multiply(localM);
		});
	}

	this.setBindTransforms = function () {
		if(!computedWorldTransforms) {
			this.computeWorldTransforms();
			computedWorldTransforms = true;
		}

		this.foreachBone(bone => {
			const worldM = worldTransforms[bone];
			bindTransforms[bone].copy(worldM);
			bindTransforms[bone].invert();
		});
	}

	this.newBoneAttribute = function (name) {
		return attributes.createAttribute(name);
	}
}

// import 

export function SkeletonGraph (skeleton) {
	const graph = new Graph;
	const vertex = graph.vertex;
	graph.setEmbeddings(vertex);
	const position = graph.addAttribute(vertex, "position");

	const gvd = skeleton.newBoneAttribute("gvd");
	skeleton.computeWorldTransforms();
	skeleton.foreachBone(bone => {
		const v = graph.addVertex();
		gvd[bone] = v;

		const parent = skeleton.getParent(bone);
		if(parent != root) {
			graph.connectVertices(gvd[parent], v);
		}

		const transform = skeleton.getWorldTransform(bone);
		position[graph.cell(vertex, v)] = new Vector3().applyMatrix4(transform);
	});

	return graph;
}

export function SkeletonRenderer (skeleton) {
	const positions = skeleton.newBoneAttribute("position");

	this.computePositions = function() {
		skeleton.computeWorldTransforms();
		skeleton.foreachBone(bone => {
			const mat = skeleton.getWorldTransform(bone);
			positions[bone] = new THREE.Vector3().applyMatrix4(mat);
		})
	}

	this.createVertices = function () {
		const geometry = new THREE.SphereGeometry(1, 32, 32);
		const material = new THREE.MeshLambertMaterial();
		this.vertices =  new THREE.InstancedMesh(geometry, material, skeleton.nbBones());
		
		this.vertices.instanceId = skeleton.newBoneAttribute("vertexInstanceId");
		this.vertices.bones = [];

		const size = 0.00625;
		const scale = new THREE.Vector3(size, size, size);

		let id = 0;
		skeleton.foreachBone(bone => {
			const matrix = new THREE.Matrix4;
			matrix.setPosition(positions[bone]);
			matrix.scale(scale);
			this.vertices.bones[id] = bone;
			this.vertices.instanceId[bone] = id;
			this.vertices.setColorAt(id, new THREE.Color(0xBB1111));
			this.vertices.setMatrixAt(id, matrix);
			++id;
		});
	}

	this.createEdges = function () {
		const geometry = new THREE.CylinderGeometry(0.0025, 0.0025, 1, 8);
		const material = new THREE.MeshLambertMaterial();

		this.edges = new THREE.InstancedMesh(geometry, material, skeleton.nbBones());
		this.edges.instanceId = skeleton.newBoneAttribute("edgeInstanceId");
		this.edges.bones = [];

		
	}

	this.computePositions();
}