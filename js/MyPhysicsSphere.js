import * as THREE from "../../lib/three/build/three.module.js";
import {MyAmmoBase} from "./MyAmmoBase.js";

export class MyPhysicsSphere extends MyAmmoBase
{
	constructor(ammoPhysicsWorld)
	{
		super();
		this.ammoPhysicsWorld = ammoPhysicsWorld;
		this.meshPinnballBall = undefined;
		this.rigidBodyPinnballBall = undefined;
		this.IMPULSE_FORCE = 4;
	}

	create(radius=0.75, position={x:9, y:0.5, z:25}, color=0X0000FF, mass=1)
	{
		mass = mass * radius;   // Gjør massen proporsjonal med størrelsen.

		//ThreeJS:
		this.meshPinnballBall = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, 32, 32), new THREE.MeshPhongMaterial({color: color}));
		this.meshPinnballBall.position.set(position.x, position.y, position.z);
		this.meshPinnballBall.castShadow = true;
		this.meshPinnballBall.receiveShadow = true;
		this.meshPinnballBall.userData.name = 'pinnball';

		//Ammojs:
		let sphereShape = new Ammo.btSphereShape( radius );
		this.rigidBodyPinnballBall = this.createAmmoRigidBody(sphereShape, this.meshPinnballBall, 0.7, 0.5, mass)

		// Legger objektet til MyPhysicsWorld.
		// Kollisjonsfiltrering: Denne RB tilhører gruppa COLLISION_GROUP_SPHERE og skal kunne
		// kollidere med objekter i gruppene COLLISION_GROUP_SPHERE, COLLISION_GROUP_PLANE m.fl.
		this.ammoPhysicsWorld.addPhysicsObject(this.rigidBodyPinnballBall, this.meshPinnballBall, true, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE | this.ammoPhysicsWorld.COLLISION_GROUP_PLANE | this.ammoPhysicsWorld.COLLISION_GROUP_BOX | this.ammoPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE);
	}


	keyCheck(deltaTime, currentlyPressedKeys)
	{
		if (!this.rigidBodyPinnballBall || !this.meshPinnballBall)
			return;

		this.rigidBodyPinnballBall.activate(true);

		let direction = undefined;
		let impulse = undefined;
		if (currentlyPressedKeys[65])
		{	//A
			direction = {x:-1, y:0, z:0};
		}
		if (currentlyPressedKeys[68])
		{	//D
			direction = {x:1, y:0, z:0};
		}
		if (currentlyPressedKeys[87])
		{	//W
			direction = {x:0, y:0, z:-1};
		}
		if (currentlyPressedKeys[83])
		{	//S
			direction = {x:0, y:0, z:1};
		}
		if (direction)  //<== NB! Viktig å sjekke!
			impulse = new Ammo.btVector3(direction.x*this.IMPULSE_FORCE, direction.y*this.IMPULSE_FORCE, direction.z*this.IMPULSE_FORCE);


		this.rigidBodyPinnballBall.applyCentralImpulse( impulse );
	}
}
