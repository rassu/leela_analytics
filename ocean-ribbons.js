// Ocean Ribbons Animation for About Us page
// Modern, flowing ribbon animation with WebGL

document.addEventListener('DOMContentLoaded', function() {
    console.log('Ocean ribbons script loaded');
    initOceanRibbons();
});

function initOceanRibbons() {
    console.log('Initializing ocean ribbons');
    
    // Initialize hero ribbons
    createHeroRibbons();
    
    // Initialize section divider ribbons
    for (let i = 1; i <= 5; i++) {
        createDividerRibbons(i);
    }
}

function createHeroRibbons() {
    const container = document.getElementById('hero-ribbon-background');
    if (!container) {
        console.error('Hero ribbon container not found');
        return;
    }
    
    console.log('Creating hero ribbons');
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera with wider field of view for more dramatic effect
    const camera = new THREE.PerspectiveCamera(85, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 0;
    
    // Create renderer with better quality
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create ribbon group
    const ribbonGroup = new THREE.Group();
    scene.add(ribbonGroup);
    
    // Create multiple flowing ribbons with different parameters
    const ribbonCount = 8;
    const ribbons = [];
    
    // Brand colors with transparency
    const colors = [
        new THREE.Color('#6366f1').convertSRGBToLinear(), // Indigo
        new THREE.Color('#8b5cf6').convertSRGBToLinear(), // Purple
        new THREE.Color('#4f46e5').convertSRGBToLinear(), // Darker indigo
        new THREE.Color('#a78bfa').convertSRGBToLinear(), // Lighter purple
        new THREE.Color('#818cf8').convertSRGBToLinear()  // Light indigo
    ];
    
    for (let i = 0; i < ribbonCount; i++) {
        // Create ribbon curve
        const points = [];
        const segments = 100;
        const curveRadius = 15 + Math.random() * 10;
        const height = 2 + Math.random() * 4;
        const waves = 3 + Math.random() * 2;
        const phase = Math.random() * Math.PI * 2;
        
        for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI * 2;
            const x = curveRadius * Math.cos(theta);
            const z = curveRadius * Math.sin(theta);
            const y = height * Math.sin(theta * waves + phase);
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        curve.closed = true;
        
        // Create ribbon geometry
        const tubeRadius = 0.2 + Math.random() * 0.3;
        const tubeSegments = 64;
        const geometry = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, 8, true);
        
        // Create ribbon material with gradient and glow
        const colorIndex = i % colors.length;
        const material = new THREE.MeshPhongMaterial({
            color: colors[colorIndex],
            emissive: colors[colorIndex].clone().multiplyScalar(0.2),
            specular: new THREE.Color(0xffffff),
            shininess: 50,
            transparent: true,
            opacity: 0.7 + Math.random() * 0.3,
            side: THREE.DoubleSide
        });
        
        // Create ribbon mesh
        const ribbon = new THREE.Mesh(geometry, material);
        ribbon.rotation.x = Math.random() * Math.PI;
        ribbon.rotation.y = Math.random() * Math.PI;
        ribbon.rotation.z = Math.random() * Math.PI;
        ribbon.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.001,
                y: (Math.random() - 0.5) * 0.001,
                z: (Math.random() - 0.5) * 0.001
            }
        };
        
        ribbonGroup.add(ribbon);
        ribbons.push(ribbon);
    }
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x6366f1, 2, 50);
    pointLight1.position.set(10, 5, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 50);
    pointLight2.position.set(-10, -5, -10);
    scene.add(pointLight2);
    
    // Create animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Rotate ribbon group slowly
        ribbonGroup.rotation.y = time * 0.05;
        
        // Animate each ribbon individually
        ribbons.forEach((ribbon, index) => {
            ribbon.rotation.x += ribbon.userData.rotationSpeed.x;
            ribbon.rotation.y += ribbon.userData.rotationSpeed.y;
            ribbon.rotation.z += ribbon.userData.rotationSpeed.z;
            
            // Pulse the opacity slightly
            const opacityPulse = Math.sin(time * 0.5 + index) * 0.1 + 0.9;
            ribbon.material.opacity = opacityPulse * (0.7 + Math.random() * 0.3);
            
            // Pulse the emissive intensity
            ribbon.material.emissiveIntensity = 0.2 + Math.sin(time * 0.3 + index) * 0.1;
        });
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Start animation
    animate();
}

function createDividerRibbons(index) {
    const container = document.getElementById(`ribbon-divider-${index}`);
    if (!container) {
        console.error(`Divider ribbon container ${index} not found`);
        return;
    }
    
    console.log(`Creating divider ribbon ${index}`);
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create flowing ribbons
    const ribbonCount = 3 + (index % 3); // Vary count by divider
    const ribbons = [];
    
    // Brand colors with transparency
    const colors = [
        new THREE.Color('#6366f1').convertSRGBToLinear(), // Indigo
        new THREE.Color('#8b5cf6').convertSRGBToLinear(), // Purple
        new THREE.Color('#4f46e5').convertSRGBToLinear(), // Darker indigo
        new THREE.Color('#a78bfa').convertSRGBToLinear(), // Lighter purple
        new THREE.Color('#818cf8').convertSRGBToLinear()  // Light indigo
    ];
    
    // Create unique pattern for each divider
    let pattern;
    
    switch(index % 5) {
        case 1: // Horizontal wave
            pattern = (t, i) => {
                const amplitude = 2 + (i % 2);
                const frequency = 1 + (i % 3) * 0.5;
                return [
                    (t - 0.5) * 20,
                    amplitude * Math.sin(t * Math.PI * frequency),
                    0
                ];
            };
            break;
        case 2: // Spiral
            pattern = (t, i) => {
                const radius = 3 + (i % 3);
                const height = 1 + (i % 2);
                return [
                    radius * Math.cos(t * Math.PI * 4),
                    height * (t - 0.5) * 5,
                    radius * Math.sin(t * Math.PI * 4)
                ];
            };
            break;
        case 3: // Figure 8
            pattern = (t, i) => {
                const scale = 4 + (i % 3);
                return [
                    scale * Math.sin(t * Math.PI * 2),
                    scale * 0.5 * Math.sin(t * Math.PI * 4),
                    0
                ];
            };
            break;
        case 4: // Infinity
            pattern = (t, i) => {
                const scale = 4 + (i % 2);
                const a = 2;
                const b = 1;
                const x = scale * (a * Math.cos(t * Math.PI * 2)) / (1 + b * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI * 2));
                const y = scale * (a * Math.cos(t * Math.PI * 2) * Math.sin(t * Math.PI * 2)) / (1 + b * Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI * 2));
                return [x, y, 0];
            };
            break;
        default: // DNA-like double helix
            pattern = (t, i) => {
                const radius = 3;
                const offset = (i % 2) * Math.PI;
                return [
                    radius * Math.cos(t * Math.PI * 4 + offset),
                    (t - 0.5) * 10,
                    radius * Math.sin(t * Math.PI * 4 + offset)
                ];
            };
    }
    
    for (let i = 0; i < ribbonCount; i++) {
        // Create ribbon curve based on pattern
        const points = [];
        const segments = 100;
        
        for (let j = 0; j <= segments; j++) {
            const t = j / segments;
            const [x, y, z] = pattern(t, i);
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(points);
        
        // Create ribbon geometry
        const tubeRadius = 0.15 + Math.random() * 0.2;
        const tubeSegments = 64;
        const geometry = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, 8, false);
        
        // Create ribbon material
        const colorIndex = (i + index) % colors.length;
        const material = new THREE.MeshPhongMaterial({
            color: colors[colorIndex],
            emissive: colors[colorIndex].clone().multiplyScalar(0.2),
            specular: new THREE.Color(0xffffff),
            shininess: 50,
            transparent: true,
            opacity: 0.6 + Math.random() * 0.4,
            side: THREE.DoubleSide
        });
        
        // Create ribbon mesh
        const ribbon = new THREE.Mesh(geometry, material);
        ribbon.userData = {
            speed: 0.2 + Math.random() * 0.3,
            offset: Math.random() * Math.PI * 2
        };
        
        scene.add(ribbon);
        ribbons.push(ribbon);
    }
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add point light for glow effect
    const pointLight = new THREE.PointLight(colors[index % colors.length], 2, 20);
    pointLight.position.set(5, 0, 5);
    scene.add(pointLight);
    
    // Create animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime();
        
        // Animate each ribbon
        ribbons.forEach((ribbon, i) => {
            ribbon.rotation.y = time * ribbon.userData.speed + ribbon.userData.offset;
            
            // Pulse the opacity slightly
            const opacityPulse = Math.sin(time * 0.5 + i) * 0.1 + 0.9;
            ribbon.material.opacity = opacityPulse * (0.6 + Math.random() * 0.4);
            
            // Pulse the emissive intensity
            ribbon.material.emissiveIntensity = 0.2 + Math.sin(time * 0.3 + i) * 0.1;
        });
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // Start animation
    animate();
}
