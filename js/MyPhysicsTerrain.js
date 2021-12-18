import * as THREE from '../../lib/three/build/three.module.js';
import {MyAmmoBase} from "./MyAmmoBase.js";

export class MyPhysicsTerrain  extends MyAmmoBase
{
	constructor(ammoPhysicsWorld)
	{
		super();
		this.ammoPhysicsWorld = ammoPhysicsWorld;
		this.rigidBody = undefined;
		this.mesh = undefined;
		this.TERRAIN_SIZE = 100;
		this.create();
	}

	create()
	{
		let mass = 0;
		let textureLoader = new THREE.TextureLoader();
		textureLoader.load( '../assets/images/heightmap3.png', ( texture ) =>
		{   //<== NB! Arrow Function!! Kan dermed bruke this. inne i funksjonen.
			// ThreeJS:
			let geometry = new THREE.PlaneBufferGeometry( this.TERRAIN_SIZE, this.TERRAIN_SIZE);
			geometry.rotateX( - Math.PI / 2 );

			let material = new THREE.MeshPhongMaterial( { color: 0xC7C7C7, side: THREE.DoubleSide } );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.x = 10;
			texture.repeat.y = 10;

			material.map = texture;
			material.needsUpdate = true;

			this.mesh = new THREE.Mesh( geometry, material );
			this.mesh.position.set(0,0,0);
			this.mesh.userData.name = 'terrain';
			this.mesh.receiveShadow = true;

			// AmmoJS for terreng:
			let terrainShape = new Ammo.btBoxShape( new Ammo.btVector3( this.TERRAIN_SIZE/2, 0, this.TERRAIN_SIZE/2 ) );
			this.rigidBody = this.createAmmoRigidBody(terrainShape, this.mesh, 0.8, 0.5, mass);
			// Legger objektet til MyPhysicsWorld.
			this.ammoPhysicsWorld.addPhysicsObject(this.rigidBody, this.mesh, true, this.ammoPhysicsWorld.COLLISION_GROUP_PLANE, this.ammoPhysicsWorld.COLLISION_GROUP_SPHERE | this.ammoPhysicsWorld.COLLISION_GROUP_BOX | this.ammoPhysicsWorld.COLLISION_GROUP_HINGE_SPHERE);
		});
	}

	keyCheck(deltaTime, currentlyPressedKeys)
	{
		if (!this.rigidBody || !this.mesh)
			return;
		this.rigidBody.activate(true);
	}
}
