export class MyAmmoBase
{
	constructor() {}

	createAmmoRigidBody(shape, threeMesh, restitution=0.7, friction=0.8, mass=1)
	{

		let transform = new Ammo.btTransform();
		transform.setIdentity();
		transform.setOrigin(new Ammo.btVector3(threeMesh.position.x, threeMesh.position.y, threeMesh.position.z));

		let quaternion = threeMesh.quaternion;
		transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

		let scale = threeMesh.scale;
		shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

		let motionState = new Ammo.btDefaultMotionState(transform);
		let localInertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia(mass, localInertia);

		let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
		let rigidBody = new Ammo.btRigidBody(rbInfo);
		rigidBody.setRestitution(restitution);
		rigidBody.setFriction(friction);

		return rigidBody;
	}
}
