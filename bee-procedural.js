// Procedural 3D Bee using Three.js geometry
// No GLB files needed - creates bee from basic shapes

export function createProceduralBee(scene) {
    const beeGroup = new THREE.Group();

    // Materials
    const blackMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7,
        metalness: 0.2
    });

    const yellowMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.6,
        metalness: 0.1
    });

    const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1,
        metalness: 0.5,
        side: THREE.DoubleSide
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 0.3,
        metalness: 0.8
    });

    // Body segments with stripes
    const bodySegments = [
        { z: 0, radius: 0.15, color: yellowMaterial },
        { z: 0.2, radius: 0.13, color: blackMaterial },
        { z: 0.35, radius: 0.11, color: yellowMaterial },
        { z: 0.48, radius: 0.09, color: blackMaterial }
    ];

    bodySegments.forEach(seg => {
        const geometry = new THREE.SphereGeometry(seg.radius, 16, 16);
        const segment = new THREE.Mesh(geometry, seg.color);
        segment.position.z = seg.z;
        segment.scale.z = 0.8;
        beeGroup.add(segment);
    });

    // Head
    const headGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const head = new THREE.Mesh(headGeometry, blackMaterial);
    head.position.z = -0.15;
    beeGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.06, 0.05, -0.2);
    beeGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.06, 0.05, -0.2);
    beeGroup.add(rightEye);

    // Antennae
    const antennaGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 4);
    const leftAntenna = new THREE.Mesh(antennaGeometry, blackMaterial);
    leftAntenna.position.set(-0.04, 0.12, -0.15);
    leftAntenna.rotation.z = Math.PI / 6;
    beeGroup.add(leftAntenna);

    const rightAntenna = new THREE.Mesh(antennaGeometry, blackMaterial);
    rightAntenna.position.set(0.04, 0.12, -0.15);
    rightAntenna.rotation.z = -Math.PI / 6;
    beeGroup.add(rightAntenna);

    // Wings (4 wings)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.3, 0.1, 0.4, 0);
    wingShape.quadraticCurveTo(0.3, -0.1, 0, 0);

    const wingGeometry = new THREE.ShapeGeometry(wingShape);

    // Left front wing
    const leftFrontWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftFrontWing.position.set(-0.15, 0.05, 0.1);
    leftFrontWing.rotation.y = Math.PI / 2;
    leftFrontWing.rotation.x = -Math.PI / 12;
    beeGroup.add(leftFrontWing);

    // Right front wing
    const rightFrontWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightFrontWing.position.set(0.15, 0.05, 0.1);
    rightFrontWing.rotation.y = -Math.PI / 2;
    rightFrontWing.rotation.x = -Math.PI / 12;
    rightFrontWing.scale.x = -1;
    beeGroup.add(rightFrontWing);

    // Left back wing (smaller)
    const leftBackWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftBackWing.position.set(-0.15, 0.03, 0.25);
    leftBackWing.rotation.y = Math.PI / 2;
    leftBackWing.rotation.x = -Math.PI / 12;
    leftBackWing.scale.set(0.7, 0.7, 0.7);
    beeGroup.add(leftBackWing);

    // Right back wing (smaller)
    const rightBackWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightBackWing.position.set(0.15, 0.03, 0.25);
    rightBackWing.rotation.y = -Math.PI / 2;
    rightBackWing.rotation.x = -Math.PI / 12;
    rightBackWing.scale.set(-0.7, 0.7, 0.7);
    beeGroup.add(rightBackWing);

    // Legs (6 legs)
    const legGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 4);
    const legPositions = [
        { x: -0.12, z: 0 },
        { x: -0.12, z: 0.2 },
        { x: -0.12, z: 0.35 },
        { x: 0.12, z: 0 },
        { x: 0.12, z: 0.2 },
        { x: 0.12, z: 0.35 }
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, blackMaterial);
        leg.position.set(pos.x, -0.12, pos.z);
        leg.rotation.z = pos.x < 0 ? Math.PI / 6 : -Math.PI / 6;
        beeGroup.add(leg);
    });

    // Stinger
    const stingerGeometry = new THREE.ConeGeometry(0.03, 0.1, 8);
    const stinger = new THREE.Mesh(stingerGeometry, blackMaterial);
    stinger.position.z = 0.58;
    stinger.rotation.x = -Math.PI / 2;
    beeGroup.add(stinger);

    // Center the bee
    beeGroup.rotation.y = Math.PI;
    beeGroup.position.y = 0.2;

    scene.add(beeGroup);
    return beeGroup;
}

// Animation function
export function animateBee(beeGroup, time) {
    // Gentle bobbing motion
    beeGroup.position.y = 0.2 + Math.sin(time * 2) * 0.05;

    // Slight rotation
    beeGroup.rotation.x = Math.sin(time * 1.5) * 0.1;

    // Optional: wing flutter (rotate wings)
    // This would require storing wing references
}
