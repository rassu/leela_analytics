// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });

    // Reset nav display on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
});

// Three.js Scene Setup
let scene, camera, renderer, controls;
let particles, particleSystem;
const particleCount = 1000;

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(document.querySelector('#canvas-container').offsetWidth, document.querySelector('#canvas-container').offsetHeight);
    renderer.setClearColor(0x000000, 0);
    document.querySelector('#canvas-container').appendChild(renderer.domElement);
    
    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    
    // Create particles
    createParticles();
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

function createParticles() {
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    // Set random positions and colors for particles
    for (let i = 0; i < particleCount; i++) {
        // Position
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        
        // Color (gradient from primary to secondary color)
        const ratio = Math.random();
        const r = 0.4 + ratio * 0.2; // Indigo to teal
        const g = 0.4 + ratio * 0.3;
        const b = 0.9 - ratio * 0.3;
        
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Create particle system
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Create a network of lines connecting some particles
    createNetworkLines();
}

function createNetworkLines() {
    // Create lines connecting some particles
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineCount = 200; // Number of lines
    
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
        }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.2
    });
    
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particle system
    particleSystem.rotation.x += 0.0005;
    particleSystem.rotation.y += 0.001;
    
    // Update controls
    controls.update();
    
    // Render scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = document.querySelector('#canvas-container').offsetWidth / document.querySelector('#canvas-container').offsetHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    renderer.setSize(document.querySelector('#canvas-container').offsetWidth, document.querySelector('#canvas-container').offsetHeight);
}

// Initialize Three.js scene when the page is loaded
window.addEventListener('load', initThreeJS);

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', { name, email, company, message });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
});
