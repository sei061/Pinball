/*
	Collision margin (.setMargin(0.04) under:
	Fra: Bullet_User_manual.pdf
	Bullet uses a small collision margin for collision shapes, to improve performance and reliability of the collision detection.
	It is best not to modify the default collision margin, and if you do use a positive value: zero margin might introduce problems.
	By default this collision margin is set to 0.04

	Local inertia (treghetsmoment):
	Fra: Bullet_User_manual.pdf
	The world transform of a rigid body is in Bullet always equal to its center of mass, and its basis also defines its
	local frame for inertia. The local inertia tensor depends on the shape, and the btCollisionShape class provides a
	method to calculate the local inertia, given a mass.

 */
export class AmmoPhysicsWorld
{
	constructor()
	{
		this.ammoPhysicsWorld = undefined;
		this.scene = undefined,
		this.rigidBodies = [],
		this.tmpTrans = undefined;
		this.rigidBodies = [];
		this.COLLISION_GROUP_PLANE = 1;
		this.COLLISION_GROUP_SPHERE = 2;
		this.COLLISION_GROUP_CONVEX = 4;
		this.COLLISION_GROUP_COMPOUND = 8;
		this.COLLISION_GROUP_MOVEABLE = 16;
		this.COLLISION_GROUP_TRIANGLE = 32;
		this.COLLISION_GROUP_HINGE_SPHERE =  64;
		this.COLLISION_GROUP_BOX =  128;       //..osv. Binært 1, 10, 100, 1000, 10000, 100000 osv
	}

	init(scene)
	{
		if (!scene)
		{
			console.log("Mangler three-sceneobjekt.")
			return;
		}
		this.scene = scene;
		this.tmpTrans = new Ammo.btTransform();

		let collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
			dispatcher          = new Ammo.btCollisionDispatcher(collisionConfiguration),
			overlappingPairCache= new Ammo.btDbvtBroadphase(),
			solver              = new Ammo.btSequentialImpulseConstraintSolver();

		this.ammoPhysicsWorld   = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
		this.ammoPhysicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));
	}

	updatePhysics( deltaTime )
	{
		if (!this.tmpTrans)
			return;

		// Step physics world:
		this.ammoPhysicsWorld.stepSimulation( deltaTime, 10 );

		// Update rigid bodies
		for ( let i = 0; i < this.rigidBodies.length; i++ )
		{
			let objThree = this.rigidBodies[ i ];
			let objAmmo = objThree.userData.physicsBody;
			let ms = objAmmo.getMotionState();
			if ( ms )
			{
				ms.getWorldTransform( this.tmpTrans );
				let p = this.tmpTrans.getOrigin();
				let q = this.tmpTrans.getRotation();
				objThree.position.set( p.x(), p.y(), p.z() );
				objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
			}
		}
	}

	addPhysicsObject(rb, mesh, setCollisionMask, collisionGroup, collisionMask)
	{
		if (setCollisionMask)
		{
			this.ammoPhysicsWorld.addRigidBody(rb, collisionGroup, collisionMask);
		}
		else
		{
			this.ammoPhysicsWorld.addRigidBody(rb);
		}
		this.scene.add(mesh);
		this.rigidBodies.push(mesh);
		mesh.userData.physicsBody = rb;
	}

	addConstraint(constraint, disableCollisions)
	{
		this.ammoPhysicsWorld.addConstraint(constraint, disableCollisions);
	}
}
