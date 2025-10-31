// 3D Data Orb using Three.js
let scene, camera, renderer, orb, particles;
let orbRotationSpeed = 0.002;

function initOrb() {
    const container = document.getElementById('orb-container');
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Create main orb
    createOrb();
    
    // Create particle field
    createParticles();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animateOrb();
}

function createOrb() {
    // Icosahedron geometry for the main orb
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Shader material for glowing effect
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });
    
    orb = new THREE.Mesh(geometry, material);
    scene.add(orb);
    
    // Add inner glow sphere
    const glowGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    orb.add(glowSphere);
    
    // Add pulsing effect
    orb.userData = { pulsePhase: 0 };
}

function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Random positions in a sphere
        const radius = Math.random() * 10 + 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function animateOrb() {
    requestAnimationFrame(animateOrb);
    
    // Rotate orb
    orb.rotation.x += orbRotationSpeed;
    orb.rotation.y += orbRotationSpeed * 1.5;
    
    // Pulse effect
    orb.userData.pulsePhase += 0.02;
    const pulse = Math.sin(orb.userData.pulsePhase) * 0.1 + 1;
    orb.scale.set(pulse, pulse, pulse);
    
    // Rotate particles slowly
    particles.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateOrbColor(color) {
    if (orb) {
        orb.material.color.setHex(color);
        particles.material.color.setHex(color);
    }
}

function updateOrbSpeed(speed) {
    orbRotationSpeed = speed;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOrb);
} else {
    initOrb();
}
