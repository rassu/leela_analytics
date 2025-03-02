// Simple Three.js fractal background for About Us page
document.addEventListener('DOMContentLoaded', function() {
    console.log('About fractal script loaded');
    initAboutFractal();
});

function initAboutFractal() {
    console.log('Initializing about fractal');
    
    // Initialize hero fractal
    createHeroFractal();
    
    // Initialize divider fractals
    for (let i = 1; i <= 5; i++) {
        createDividerFractal(i);
    }
}

function createHeroFractal() {
    const container = document.getElementById('hero-fractal-background');
    if (!container) {
        console.error('Hero fractal container not found');
        return;
    }
    
    console.log('Creating hero fractal');
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create fractal material - more subtle and enterprise-like
    const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        zoom: { value: 2.5 },
        center: { value: new THREE.Vector2(-0.2, 0.0) },
        colorOffset: { value: 0.3 }
    };
    
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform float zoom;
        uniform vec2 center;
        uniform float colorOffset;
        
        // Subtle enterprise color palette
        vec3 getEnterpriseColor(float t) {
            // More professional color scheme - blues, purples, and teals
            vec3 color1 = vec3(0.1, 0.2, 0.4); // Dark blue
            vec3 color2 = vec3(0.2, 0.4, 0.6); // Medium blue
            vec3 color3 = vec3(0.3, 0.5, 0.7); // Light blue
            vec3 color4 = vec3(0.4, 0.3, 0.6); // Purple accent
            
            float step1 = 0.3;
            float step2 = 0.6;
            float step3 = 0.9;
            
            if (t < step1) {
                return mix(color1, color2, t / step1);
            } else if (t < step2) {
                return mix(color2, color3, (t - step1) / (step2 - step1));
            } else if (t < step3) {
                return mix(color3, color4, (t - step2) / (step3 - step2));
            } else {
                return color4;
            }
        }
        
        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            uv = uv * zoom + center;
            
            // Create a more subtle pattern
            vec2 c = uv;
            vec2 z = vec2(0.0);
            float n = 0.0;
            const float maxIter = 100.0;
            
            for (float i = 0.0; i < maxIter; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                if (dot(z, z) > 4.0) break;
                n++;
            }
            
            float t = n / maxIter;
            
            // Use enterprise color palette
            vec3 color = getEnterpriseColor(t);
            
            // Add very subtle animation
            color += 0.02 * sin(time * 0.2 + uv.xyx + vec3(0, 2, 4));
            
            // Add vignette effect for more professional look
            float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv * 0.5));
            color = mix(color, color * 0.6, 1.0 - vignette);
            
            gl_FragColor = vec4(color, 0.9); // Slightly transparent
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,
        transparent: true
    });
    
    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Create animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Update uniforms - slower animation for subtlety
        uniforms.time.value = clock.getElapsedTime() * 0.5;
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        uniforms.resolution.value.set(container.clientWidth, container.clientHeight);
    });
    
    // Start animation
    animate();
}

function createDividerFractal(index) {
    const container = document.getElementById(`fractal-divider-${index}`);
    if (!container) {
        console.error(`Divider fractal container ${index} not found`);
        return;
    }
    
    console.log(`Creating divider fractal ${index}`);
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create fractal material with a different pattern for each divider - more subtle
    const uniforms = {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        index: { value: index },
        colorOffset: { value: index * 0.1 }
    };
    
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform float index;
        uniform float colorOffset;
        
        // Subtle hash function
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // Enterprise color palette
        vec3 getEnterpriseColor(float t, float offset) {
            // Professional color scheme with blues and purples
            vec3 baseColor = vec3(0.2, 0.3, 0.5); // Base blue
            vec3 accentColor = vec3(0.3, 0.2, 0.5); // Purple accent
            
            // Subtle color variation
            return mix(baseColor, accentColor, sin(t * 3.14159 + offset) * 0.5 + 0.5);
        }
        
        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            
            // Different subtle pattern based on index
            float pattern = 0.0;
            
            if (mod(index, 3.0) < 1.0) {
                // Subtle horizontal lines
                pattern = smoothstep(0.0, 0.1, abs(sin(uv.y * 20.0 + time * 0.1)));
                pattern += hash(uv + time * 0.05) * 0.05;
            } else if (mod(index, 3.0) < 2.0) {
                // Subtle grid pattern
                vec2 grid = fract(uv * 15.0);
                float line = smoothstep(0.0, 0.05, min(grid.x, grid.y));
                pattern = line * 0.3 + 0.7;
            } else {
                // Subtle wave pattern
                pattern = sin(uv.x * 5.0 + time * 0.1) * sin(uv.y * 5.0 + time * 0.05) * 0.5 + 0.5;
            }
            
            // Create color from pattern - more subtle
            vec3 color = getEnterpriseColor(pattern, colorOffset);
            
            // Add gradient for depth
            color = mix(color, color * 0.8, abs(uv.y));
            
            // Add vignette for professional look
            float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv));
            color = mix(color, color * 0.7, 1.0 - vignette);
            
            gl_FragColor = vec4(color, 0.7); // More transparent for subtlety
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `,
        transparent: true
    });
    
    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Create animation loop
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Update uniforms - slower animation for subtlety
        uniforms.time.value = clock.getElapsedTime() * 0.3;
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        uniforms.resolution.value.set(container.clientWidth, container.clientHeight);
    });
    
    // Start animation
    animate();
}
