// Particle Network Animation for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Particle network animation initialized');
    initParticleNetwork();
});

function initParticleNetwork() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found');
        return;
    }
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Center the canvas in the container
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';
    
    container.appendChild(canvas);
    
    // Create particles
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    
    // Particle material with gradient
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Create particles
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Define colors for the gradient
    const color1 = new THREE.Color(0x6366f1); // Indigo
    const color2 = new THREE.Color(0x8b5cf6); // Purple
    
    // Create particles with random positions
    for (let i = 0; i < particleCount; i++) {
        // Position
        const x = (Math.random() - 0.5) * 60;
        const y = (Math.random() - 0.5) * 40;
        const z = (Math.random() - 0.5) * 30;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Color - gradient between color1 and color2
        const mixFactor = Math.random();
        const particleColor = new THREE.Color().lerpColors(color1, color2, mixFactor);
        
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
        
        // Size - varying sizes for depth perception
        sizes[i] = Math.random() * 1.5 + 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particlesGroup.add(particleSystem);
    
    // Create connections between particles
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const maxDistance = 15; // Maximum distance for connections
    
    // Find connections between particles that are close to each other
    for (let i = 0; i < particleCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];
        
        for (let j = i + 1; j < particleCount; j++) {
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];
            
            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) + 
                Math.pow(y2 - y1, 2) + 
                Math.pow(z2 - z1, 2)
            );
            
            if (distance < maxDistance) {
                linePositions.push(x1, y1, z1);
                linePositions.push(x2, y2, z2);
            }
        }
    }
    
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    particlesGroup.add(lines);
    
    // Animation properties
    const particleVelocities = [];
    for (let i = 0; i < particleCount; i++) {
        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the entire particle group
        particlesGroup.rotation.y += 0.001;
        particlesGroup.rotation.x += 0.0005;
        
        // Update particle positions
        const positions = particleGeometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            // Update positions based on velocities
            positions[i * 3] += particleVelocities[i].x;
            positions[i * 3 + 1] += particleVelocities[i].y;
            positions[i * 3 + 2] += particleVelocities[i].z;
            
            // Boundary check and bounce
            if (Math.abs(positions[i * 3]) > 30) {
                particleVelocities[i].x *= -1;
            }
            if (Math.abs(positions[i * 3 + 1]) > 20) {
                particleVelocities[i].y *= -1;
            }
            if (Math.abs(positions[i * 3 + 2]) > 15) {
                particleVelocities[i].z *= -1;
            }
        }
        
        particleGeometry.attributes.position.needsUpdate = true;
        
        // Update line connections
        // This is computationally expensive, so we'll update less frequently
        if (Math.random() < 0.05) { // Update ~5% of the time
            updateConnections();
        }
        
        renderer.render(scene, camera);
    }
    
    function updateConnections() {
        const positions = particleGeometry.attributes.position.array;
        const linePositions = [];
        
        for (let i = 0; i < particleCount; i++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];
            
            for (let j = i + 1; j < particleCount; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];
                
                const distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) + 
                    Math.pow(y2 - y1, 2) + 
                    Math.pow(z2 - z1, 2)
                );
                
                if (distance < maxDistance) {
                    linePositions.push(x1, y1, z1);
                    linePositions.push(x2, y2, z2);
                }
            }
        }
        
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        linesGeometry.attributes.position.needsUpdate = true;
    }
    
    // Start animation
    animate();
}
