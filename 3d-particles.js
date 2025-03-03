// 3D Particle Animation for Leela Analytics
// This script creates an interactive 3D particle system with connecting lines

// Initialize the 3D particle animation
function init3DParticles() {
    console.log('Initializing 3D particle animation');
    
    // Get the containers
    const homeContainer = document.getElementById('canvas-container');
    const aboutContainer = document.getElementById('about-canvas-container');
    
    // Initialize for home page if container exists
    if (homeContainer) {
        initParticleSystem(homeContainer);
    }
    
    // Initialize for about page if container exists
    if (aboutContainer) {
        initParticleSystem(aboutContainer);
    }
    
    // If neither container exists, log an error
    if (!homeContainer && !aboutContainer) {
        console.error('No canvas container found');
    }
}

// Initialize a particle system in the specified container
function initParticleSystem(container) {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Center the canvas in the container
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';

    container.appendChild(renderer.domElement);

    // Add OrbitControls with restricted zoom
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.3;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.5;
    
    // Create particles and lines
    const { particleSystem, lines } = createParticlesAndLines(scene);
    
    // Add window resize handler
    const resizeHandler = () => {
        // Update camera aspect ratio
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer size
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', resizeHandler);
    
    // Start animation loop
    let animationFrameId;
    
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        
        // Rotate particle system
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;
        
        // Rotate lines
        if (lines) {
            lines.rotation.x += 0.0005;
            lines.rotation.y += 0.001;
        }
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Return cleanup function
    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        window.removeEventListener('resize', resizeHandler);
        
        // Dispose of all geometries and materials
        scene.traverse(object => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        container.removeChild(renderer.domElement);
        renderer.dispose();
    };
}

function createParticlesAndLines(scene) {
    const particleCount = 2000;
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create particle material with custom shader
    const particleMaterial = new THREE.PointsMaterial({
        size: 1.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    // Set random positions and colors for particles
    for (let i = 0; i < particleCount; i++) {
        // Position - create a sphere of particles
        const radius = 25 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Color (gradient from indigo to purple)
        const ratio = Math.random();
        // Indigo: #6366f1, Purple: #8b5cf6
        const r = 0.39 + ratio * 0.15;
        const g = 0.4 + ratio * -0.04;
        const b = 0.95 - ratio * 0.05;
        
        // Update the color to match the enterprise design
        const enterpriseColor = {
            r: 0.18,
            g: 0.36,
            b: 0.64
        };
        colors[i * 3] = enterpriseColor.r;
        colors[i * 3 + 1] = enterpriseColor.g;
        colors[i * 3 + 2] = enterpriseColor.b;
        
        // Random size variation
        sizes[i] = Math.random() * 0.5 + 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Create lines connecting some particles
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    const lineCount = 500;
    
    for (let i = 0; i < lineCount; i++) {
        // Select two random particles
        const particleIndex1 = Math.floor(Math.random() * particleCount);
        const particleIndex2 = Math.floor(Math.random() * particleCount);
        
        // Get positions of these particles
        const x1 = particleSystem.geometry.attributes.position.array[particleIndex1 * 3];
        const y1 = particleSystem.geometry.attributes.position.array[particleIndex1 * 3 + 1];
        const z1 = particleSystem.geometry.attributes.position.array[particleIndex1 * 3 + 2];
        
        const x2 = particleSystem.geometry.attributes.position.array[particleIndex2 * 3];
        const y2 = particleSystem.geometry.attributes.position.array[particleIndex2 * 3 + 1];
        const z2 = particleSystem.geometry.attributes.position.array[particleIndex2 * 3 + 2];
        
        // Only connect if they're close enough
        const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + 
            Math.pow(y2 - y1, 2) + 
            Math.pow(z2 - z1, 2)
        );
        
        if (distance < 15) {
            linePositions.push(x1, y1, z1);
            linePositions.push(x2, y2, z2);
            
            // Get colors from the particles
            const r1 = particleSystem.geometry.attributes.color.array[particleIndex1 * 3];
            const g1 = particleSystem.geometry.attributes.color.array[particleIndex1 * 3 + 1];
            const b1 = particleSystem.geometry.attributes.color.array[particleIndex1 * 3 + 2];
            
            const r2 = particleSystem.geometry.attributes.color.array[particleIndex2 * 3];
            const g2 = particleSystem.geometry.attributes.color.array[particleIndex2 * 3 + 1];
            const b2 = particleSystem.geometry.attributes.color.array[particleIndex2 * 3 + 2];
            
            // Use average of the two particle colors
            lineColors.push(r1, g1, b1);
            lineColors.push(r2, g2, b2);
        }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    
    return { particleSystem, lines };
}

// Load Three.js if not already loaded
if (typeof THREE === 'undefined') {
    console.log('Loading THREE.js...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = function() {
        console.log('THREE.js loaded');
        // Load OrbitControls
        const controlsScript = document.createElement('script');
        controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.min.js';
        controlsScript.onload = function() {
            console.log('OrbitControls loaded');
            // Initialize after both scripts are loaded
            document.addEventListener('DOMContentLoaded', init3DParticles);
            // If DOM is already loaded, initialize now
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                init3DParticles();
            }
        };
        document.head.appendChild(controlsScript);
    };
    document.head.appendChild(script);
} else {
    console.log('THREE already loaded');
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', init3DParticles);
    // If DOM is already loaded, initialize now
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init3DParticles();
    }
}

// Export functions for external use
window.particleAnimation3D = {
    init: init3DParticles,
    cleanup: () => {}
};
