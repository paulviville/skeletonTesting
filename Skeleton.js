import AttributesContainer from './CMapJS/CMap/AttributeContainer.js';
import { Matrix4 } from './CMapJS/Libs/three.module.js';

const root = null;

function KeyFrame (t, mat) {
	this.t = t;
	this.mat = mat;
}

export default function Skeleton () {
	const attributes = new AttributesContainer;

	const labels = attributes.createAttribute("labels");
	const parents = attributes.createAttribute("parents");
	const bindTransforms = attributes.createAttribute("bindTransforms");
	const localTransforms = attributes.createAttribute("localTransforms");
	const worldTransforms = attributes.createAttribute("worldTransforms");
	const keys = attributes.createAttribute("keys");

	// const

	function foreachBone (func) {
		attributes.forEach(bone => func(bone));
	}

	const labelDictionary = {};
	function getBoneFromLabel (label) {
		return labelDictionary[label];
	}

	let boneId = 0;
	this.newBone = function (label) {
	// this.newBone = function (label, parentLabel, localTransform) {
		const bone = attributes.newElement();
		labels[bone] = label ?? ("bone" + boneId++);
		labelDictionary[labels[bone]] = bone;
		parents[bone] = root;
		// parents[bone] = parent ?? root; /// change to getBoneFromLabel? TBD with import
		bindTransforms[bone] = new Matrix4;
		// localTransforms[bone] = localTransform ?? new Matrix4;
		localTransforms[bone] = new Matrix4;
		worldTransforms[bone] = new Matrix4;
		return bone;
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

	let computedWorldTransforms = false;
	this.computeWorldTransforms = function () {
		foreachBone(bone => {
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

		foreachBone(bone => {
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

}
