import * as THREE from "../../lib/three/build/three.module.js";
import {MyAmmoBase} from "./MyAmmoBase.js";

export class MyPhysicsHinge extends MyAmmoBase
{
	constructor(ammoPhysicsWorld)
	{
		super();

		this.ammoPhysicsWorld = ammoPhysicsWorld;
		this.boardRotAngle = 0;
		this.boardRotAxis = {x: 1, y:0, z: 0};
		this.IMPULSE_FORCE_STICK = 150;

		this.rbLeftAnchor = undefined;
		this.leftSpheremesh = undefined;

		this.rbLeftStick = undefined;
		this.leftStickMesh = undefined;

		this.rbRightAnchor = undefined;
		this.RightSpheremesh = undefined;

		this.rbRightStick = undefined;
		this.RightStickMesh = undefined;
	}

	create()
	{
		let posStickLeft = {x: -2, y: 2, z: 0};
		let sizeStickLeft = {x: 3, y: 2, z: 0.5};
		let massStickLeft = 50;

		let posAnchorLeft = {x: -8, y: 0, z: 23};
		let radiusAnchorLeft = 0.5;
		let massAnchorLeft = 0;

		//ThreeJS, kule:
		let sphereLeft = new THREE.Quaternion();  // Roterer i forhold til planet (dersom satt).
		sphereLeft.setFromAxisAngle( new THREE.Vector3( this.boardRotAxis.x, this.boardRotAxis.y, this.boardRotAxis.z ), this.boardRotAngle);
		this.leftSpheremesh = new THREE.Mesh(new THREE.SphereGeometry(radiusAnchorLeft), new THREE.MeshPhongMaterial({color: 0xb846db, transparent: true, opacity: 0.5}));
		this.leftSpheremesh.position.set(posAnchorLeft.x, posAnchorLeft.y, posAnchorLeft.z);
		this.leftSpheremesh.castShadow = true;
		this.leftSpheremesh.receiveShadow = true;

		//AmmoJS, kule:
		let anchorSphereLeft = new Ammo.btSphereShape( radiusAnchorLeft );
		this.rbLeftAnchor =this.createAmmoRigidBody(anchorSphereLeft, this.leftSpheremesh, 0.4, 0.6, massAnchorLeft);
		// Legger objektet til MyPhysicsWorld.
		this.ammoPhysicsWorld.addPhysicsObject(this.rbLeftAnchor, this.leftSpheremesh, true, this.ammoPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE);

		//ThreeJS, kube/stick:
		this.leftStickMesh = new THREE.Mesh(new THREE.BoxGeometry(sizeStickLeft.x, sizeStickLeft.y, sizeStickLeft.z), new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		this.leftStickMesh.position.set(posStickLeft.x, posStickLeft.y, posStickLeft.z);
		this.leftStickMesh.castShadow = true;
		this.leftStickMesh.receiveShadow = true;

		//AmmoJS, kube/stick:
		let stickColShape = new Ammo.btBoxShape( new Ammo.btVector3( sizeStickLeft.x * 0.5, sizeStickLeft.y * 0.5, sizeStickLeft.z * 0.5 ) );
		this.rbLeftStick =this.createAmmoRigidBody(stickColShape, this.leftStickMesh, 0.4, 0.6, massStickLeft);
		// Legger objektet til MyPhysicsWorld.
		this.ammoPhysicsWorld.addPhysicsObject(this.rbLeftStick, this.leftStickMesh, true, this.ammoPhysicsWorld.COLLISION_GROUP_BOX, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE | this.ammoPhysicsWorld.COLLISION_GROUP_BOX);

		//Ammo, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
		let anchorPivotLeft = new Ammo.btVector3( 0, 1, 0 );
		let stickPivotLeft = new Ammo.btVector3( - sizeStickLeft.x * 0.5, 0, 0 );
		const anchorAxisLeft = new Ammo.btVector3(0,1,0);
		const stickAxisLeft = new Ammo.btVector3(0,1,0);
		let hingeConstraintLeft = new Ammo.btHingeConstraint(this.rbLeftAnchor, this.rbLeftStick, anchorPivotLeft, stickPivotLeft, anchorAxisLeft, stickAxisLeft, false);
		this.ammoPhysicsWorld.ammoPhysicsWorld.addConstraint( hingeConstraintLeft, false );

		//****************** HØYRE STIKK****************************
		let posStickRight = {x: -4, y: 2, z: 0};
		let sizeStickRight = {x: 3, y: 2, z: 0.5};
		let massStickRight = 50;

		let posAnchorRight = {x: 3, y: 0, z: 23};
		let radiusAnchorRight = 0.5;
		let massAnchorRight = 0;

		//ThreeJS, kule høyre:
		let sphereRight = new THREE.Quaternion();  // Roterer i forhold til planet (dersom satt).
		sphereRight.setFromAxisAngle( new THREE.Vector3( this.boardRotAxis.x, this.boardRotAxis.y, this.boardRotAxis.z ), this.boardRotAngle);
		this.rightSpheremesh = new THREE.Mesh(new THREE.SphereGeometry(radiusAnchorRight), new THREE.MeshPhongMaterial({color: 0xb846db, transparent: true, opacity: 0.5}));
		this.rightSpheremesh.position.set(posAnchorRight.x, posAnchorRight.y, posAnchorRight.z);
		this.rightSpheremesh.castShadow = true;
		this.rightSpheremesh.receiveShadow = true;

		//AmmoJS, kule høyre:
		let anchorSphereRight = new Ammo.btSphereShape( radiusAnchorRight );
		this.rbRightAnchor =this.createAmmoRigidBody(anchorSphereRight, this.rightSpheremesh, 0.4, 0.6, massAnchorRight);
		this.ammoPhysicsWorld.addPhysicsObject(this.rbRightAnchor, this.rightSpheremesh, true, this.ammoPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE);

		//ThreeJS, kube/stick høyre:
		this.rightStickMesh = new THREE.Mesh(new THREE.BoxGeometry(sizeStickRight.x, sizeStickRight.y, sizeStickRight.z), new THREE.MeshPhongMaterial({color: 0xf78a1d}));
		this.rightStickMesh.position.set(posStickRight.x, posStickRight.y, posStickRight.z);
		this.rightStickMesh.castShadow = true;
		this.rightStickMesh.receiveShadow = true;

		//AmmoJS, kube/stick:
		let stickColShapeRight = new Ammo.btBoxShape( new Ammo.btVector3( sizeStickRight.x * 0.5, sizeStickRight.y * 0.5, sizeStickRight.z * 0.5 ) );
		this.rbRightStick = this.createAmmoRigidBody(stickColShapeRight, this.rightStickMesh, 0.4, 0.6, massStickRight);
		// Legger objektet til MyPhysicsWorld.
		this.ammoPhysicsWorld.addPhysicsObject(this.rbRightStick, this.rightStickMesh, true, this.ammoPhysicsWorld.COLLISION_GROUP_BOX, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE | this.ammoPhysicsWorld.COLLISION_GROUP_BOX);

		//Ammo, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
		let anchorPivotRight = new Ammo.btVector3( 0, 1, 0 );
		let stickPivotRight = new Ammo.btVector3( - sizeStickLeft.x * 0.5, 0, 0 );
		const anchorAxisRight = new Ammo.btVector3(0,1,0);
		const stickAxisRight = new Ammo.btVector3(0,1,0);
		let hingeConstraintRight = new Ammo.btHingeConstraint(this.rbRightAnchor, this.rbRightStick, anchorPivotRight, stickPivotRight, anchorAxisRight, stickAxisRight, false);
		this.ammoPhysicsWorld.ammoPhysicsWorld.addConstraint( hingeConstraintRight, false );

	}

	keyCheck(deltaTime, currentlyPressedKeys)
	{
		//Venstre
		if (!this.rbLeftStick || !this.rbLeftAnchor)
			return;
		if (!this.leftSpheremesh || !this.leftStickMesh)
			return;
		//Høyre
		if (!this.rbRightStick || !this.rbRightAnchor)
			return;
		if (!this.rightSpheremesh || !this.rightStickMesh)
			return;

		//Venstre
		this.rbLeftStick.activate(true);
		this.rbLeftAnchor.activate(true);
		//Høyre
		this.rbRightStick.activate(true);
		this.rbRightAnchor.activate(true);

		//Venstre
		let threeQuat = new THREE.Quaternion();
		threeQuat.setFromAxisAngle( new THREE.Vector3( this.boardRotAxis.x, this.boardRotAxis.y, this.boardRotAxis.z ), this.boardRotAngle);
		//Høyre
		let threeQuat2 = new THREE.Quaternion();
		threeQuat2.setFromAxisAngle( new THREE.Vector3( this.boardRotAxis.x, this.boardRotAxis.y, this.boardRotAxis.z ), this.boardRotAngle);

		//Venstre
		let tmpTrans = new Ammo.btTransform();
		let ms1 = this.rbLeftStick.getMotionState();
		ms1.getWorldTransform( tmpTrans );
		let q1 = tmpTrans.getRotation();
		//Høyre
		let tmpTrans2 = new Ammo.btTransform();
		let ms2 = this.rbRightStick.getMotionState();
		ms2.getWorldTransform( tmpTrans );
		let q2 = tmpTrans2.getRotation();

		//Venstre
		let threeDirectionVectorStick = new THREE.Vector3(1,0,0);
		let threeQuaternionStick = new THREE.Quaternion(q1.x(), q1.y(), q1.z(), q1.w());
		threeDirectionVectorStick.applyQuaternion(threeQuaternionStick);
		//Høyre
		let threeDirectionVectorStick2 = new THREE.Vector3(1,0,0);
		let threeQuaternionStick2 = new THREE.Quaternion(q2.x(), q2.y(), q2.z(), q2.w());
		threeDirectionVectorStick2.applyQuaternion(threeQuaternionStick2);


		let threeDir2 = new THREE.Vector3();
		this.leftStickMesh.getWorldDirection(threeDir2);  // NB! worldDIRECTION! Gir en vektor som peker mot Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
		let threeDir3 = new THREE.Vector3(-threeDir2.x, -threeDir2.y, -threeDir2.z);

		let threeDir2Two = new THREE.Vector3();
		this.rightStickMesh.getWorldDirection(threeDir2Two);  // NB! worldDIRECTION! Gir en vektor som peker mot Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
		let threeDir3Two = new THREE.Vector3(-threeDir2Two.x, -threeDir2Two.y, -threeDir2Two.z);

		// 6. "Dytter" sticken:
		if (currentlyPressedKeys[86])
		{	//V
			let rdv1 = new Ammo.btVector3(threeDir2.x*this.IMPULSE_FORCE_STICK , threeDir2.y*this.IMPULSE_FORCE_STICK , threeDir2.z*this.IMPULSE_FORCE_STICK );
			this.rbLeftStick.applyCentralImpulse( rdv1, this.IMPULSE_FORCE_STICK );
		}
		if (currentlyPressedKeys[66])
		{	//B
			let rdv2 = new Ammo.btVector3(threeDir3.x*this.IMPULSE_FORCE_STICK , threeDir3.y*this.IMPULSE_FORCE_STICK , threeDir3.z*this.IMPULSE_FORCE_STICK );
			this.rbLeftStick.applyCentralImpulse( rdv2, this.IMPULSE_FORCE_STICK );
		}

		if (currentlyPressedKeys[77])
		{	//M
			let rdv3 = new Ammo.btVector3(threeDir2Two.x*this.IMPULSE_FORCE_STICK , threeDir2Two.y*this.IMPULSE_FORCE_STICK , threeDir2Two.z*this.IMPULSE_FORCE_STICK );
			this.rbRightStick.applyCentralImpulse( rdv3, this.IMPULSE_FORCE_STICK );
		}
		if (currentlyPressedKeys[78])
		{	//N
			let rdv4 = new Ammo.btVector3(threeDir3Two.x*this.IMPULSE_FORCE_STICK , threeDir3Two.y*this.IMPULSE_FORCE_STICK , threeDir3Two.z*this.IMPULSE_FORCE_STICK );
			this.rbRightStick.applyCentralImpulse( rdv4, this.IMPULSE_FORCE_STICK );
		}
	}
}
