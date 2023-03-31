import { Quaternion, Vector3 } from './CMapJS/Libs/three.module.js';

// export default class DualQuaternion {
// 	constructor(real = new Quaternion, dual = new Quaternion) {
// 	  this.real = real;
// 	  this.dual = dual;
// 	}

// 	multiply(other) {
// 	  	this.real = this.real.multiply(other.real);
// 		const d0 = this.real.multiply(other.dual);
// 		const d1 = this.dual.multiply(other.real)
// 	  	this.dual.set(d0.x + d1.x, d0.y + d1.y, d0.z + d1.z, d0.w + d1.w);
// 	}

// 	clone() {
// 		return new DualQuaternion(this.real.clone(), this.dual.clone());
// 	}

// 	conjugate() {
// 		this.real.conjugate();
// 		this.dual.conjugate();
// 		return this;
// 	}

// 	// getRotation() {
// 	//   const q = this.real.normalize();
// 	//   const angle = 2 * Math.acos(q.w);
// 	//   const axis = new Vector3(q.x, q.y, q.z).normalize();
// 	//   return { angle, axis };
// 	// }
  
// 	// getTranslation() {
// 	//   const d = this.dual.multiply(Quaternion.fromValues(0, -0.5, -0.5, -0.5));
// 	//   return new Vector3(d.x, d.y, d.z);
// 	// }

// 	length() {
// 		return Math.sqrt(this.real.lengthSq() + this.dual.lengthSq());
// 	}

// 	normalize() {
// 		const len = this.length();
// 		this.real = new Quaternion(this.real.x / len, this.real.y / len, this.real.z / len, this.real.w / len);
// 		this.dual = new Quaternion(this.dual.x / len, this.dual.y / len, this.dual.z / len, this.dual.w / len);
// 	}

// 	preMultiplyQuat(q) {
// 		this.real = q.clone().multiply(this.real);
// 		const qp0 = q.clone().multiply(this.dual);
// 		const qp1 = q.clone().multiply(this.real.clone().conjugate());
// 		qp1.set(qp1.x * 0.5, qp1.y * 0.5, qp1.z * 0.5, qp1.w * 0.5);
// 		this.dual = new Quaternion(qp0.x + qp1.x, qp0.y + qp1.y, qp0.z + qp1.z, qp0.w + qp1.w);
		
// 		// const Pq05 = new Quaternion(p.x / 2, p.y / 2, p.z / 2, 0);
// 		// const qp1 = this.dual.clone().multiply(Pq);
// 		// qp1.set(qp1.x / 2, qp1.y / 2, qp1.z / 2, qp1.w / 2)
// 		// this.dual = 
// 		return this;
// 	} 

// 	multiplyQuat(q) {
// 		this.real.multiply(q);
// 		this.dual.multiply(q);
// 		return this;
// 	}

// 	transform(p) {
// 		const Pq = new Quaternion(p.x, p.y, p.z, 0);
// 		// const qp0 = this.real.clone().multiply(Pq);
// 		// // const Pq05 = new Quaternion(p.x / 2, p.y / 2, p.z / 2, 0);
// 		// const qp1 = this.dual.clone().multiply(Pq);
// 		// // qp1.set(qp1.x / 2, qp1.y / 2, qp1.z / 2, qp1.w / 2)
// 		// const qp = new Quaternion(qp0.x + qp1.x, qp0.y + qp1.y, qp0.z + qp1.z, qp0.w + qp1.w);
// 		// console.log(qp)
// 		// const qConj = this.real.clone().conjugate();
// 		// const trans = qp.multiply(qConj);
// 		// const dq = this.clone();
// 		// dq.multiplyQuat(Pq).multiply(dq.clone().conjugate())
// 		// dq.preMultiplyQuat(Pq);
// 		// return new Vector3(dq.real.x, dq.real.y, dq.real.z);

// 		// const 

// 		// const 
// 	}
//   }
  


export default class DualQuaternion {
	constructor(real = new Quaternion, dual = new Quaternion) {
	  this.real = real;
	  this.dual = dual;
	}

	static fromRotTrans (q, t) {
		// const norm = q.le
		const w = -0.5*( t.x * q.x + t.y * q.y + t.z * q.z);
        const x =  0.5*( t.x * q.w + t.y * q.z - t.z * q.y);
        const y =  0.5*(-t.x * q.z + t.y * q.w + t.z * q.x);
        const z =  0.5*( t.x * q.y - t.y * q.x + t.z * q.w);
		// console.log(x, y, z, w)
		return new DualQuaternion(q, new Quaternion(x, y, z, w));
	}

	transform(p) {
		const norm = this.real.length();
		const qr = new Quaternion(this.real.x / norm, this.real.y / norm, this.real.z / norm, this.real.w / norm);
		const qd = new Quaternion(this.dual.x / norm, this.dual.y / norm, this.dual.z / norm, this.dual.w / norm)
	
		const vr = new Vector3(qr.x, qr.y, qr.z);
		const vd = new Vector3(qd.x, qd.y, qd.z);

		const trans = new Vector3().crossVectors(vr, vd);
		trans.add(vd.multiplyScalar(qr.w));
		trans.add(vr.multiplyScalar(-qd.w));
		trans.multiplyScalar(2);

		const transP = p.clone();
		console.log(trans)
		transP.applyQuaternion(qr);
		transP.add(trans);
		return transP
		
	}

	normalize() {

	}
  }
  //https://github.com/brainexcerpts/Dual-Quaternion-Skinning-Sample-Codes