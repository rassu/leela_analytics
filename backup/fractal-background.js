// Fractal Background using Three.js
// This script creates dynamic fractal-inspired backgrounds that change on each page load

let scene, camera, renderer, controls;
let fractalMesh, uniforms;
let fractalType;
let animationFrameId;
let container;
let performanceLevel = 'high'; // Default to high quality
let controlsVisible = false; // Hide controls by default

// Initialize the fractal background
function initFractalBackground() {
    console.log('Initializing fractal background');
    
    // Create the main background fractal
    createFractalBackground();
    
    // Create the hero section fractal if the element exists
    if (document.getElementById('hero-fractal-background')) {
        createHeroFractal();
    }
    
    // Create fractal dividers
    createFractalDividers();
    
    // Create fractal accents
    createFractalAccents();
    
    // Add fractal controls
    setupFractalControls();
}

// Create the hero section fractal
function createHeroFractal() {
    console.log("Creating hero fractal...");
    
    const container = document.getElementById('hero-fractal-background');
    if (!container) {
        console.error("Hero fractal container not found!");
        return;
    }
    
    console.log("Hero container dimensions:", container.clientWidth, "x", container.clientHeight);
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    console.log("Hero fractal renderer created");
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera - use orthographic for 2D fractals
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    console.log("Hero fractal camera created");
    
    // Create a plane for the fractal
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Use Julia set for hero with more vibrant colors
    const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        zoom: { value: 1.0 },
        center: { value: new THREE.Vector2(0.0, 0.0) },
        juliaConstant: { value: new THREE.Vector2(-0.8, 0.156) },
        colorScale: { value: 3.0 },
        colorOffset: { value: 0.0 },
        colorCycles: { value: 5.0 },
        contrast: { value: 1.5 }
    };
    
    // Use a more vibrant shader for the hero section
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform float zoom;
        uniform vec2 center;
        uniform vec2 juliaConstant;
        uniform float colorScale;
        uniform float colorOffset;
        uniform float colorCycles;
        uniform float contrast;
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            
            // Add some warping effect
            uv.x += 0.03 * sin(uv.y * 10.0 + time);
            uv.y += 0.03 * cos(uv.x * 10.0 + time * 0.7);
            
            uv = uv / zoom + center;
            
            vec2 c = juliaConstant + vec2(sin(time * 0.1) * 0.15, cos(time * 0.15) * 0.15);
            vec2 z = uv;
            
            float iter = 0.0;
            const float maxIter = 300.0;
            const float escapeRadius = 4.0;
            
            for (float i = 0.0; i < maxIter; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                
                if (dot(z, z) > escapeRadius) {
                    iter = i;
                    break;
                }
            }
            
            if (iter >= maxIter) {
                // Make interior points more interesting
                float glow = 0.05 * (sin(time + uv.x * 20.0) * sin(time * 0.7 + uv.y * 20.0) + 1.0);
                gl_FragColor = vec4(glow * vec3(0.1, 0.2, 0.5), 1.0);
            } else {
                float smoothColor = iter - log2(log2(dot(z, z))) + 4.0;
                
                // More vibrant coloring for hero section
                float hue = mod(smoothColor * 0.02 * colorScale + colorOffset + time * 0.05, 1.0);
                float sat = 0.9 + 0.1 * sin(smoothColor * 0.1 + time);
                float val = pow(smoothColor / maxIter, contrast * 0.7) * 0.9 + 0.1;
                
                // Add some pulsing glow
                val += 0.15 * sin(time * 2.0 + uv.x * 10.0) * sin(time * 3.0 + uv.y * 10.0);
                
                vec3 color = hsv2rgb(vec3(hue, sat, val));
                
                // Add some subtle patterns
                color += 0.1 * sin(uv.x * 50.0 + time) * sin(uv.y * 50.0 + time);
                
                // Add glow effect
                float glow = 0.15 * (1.0 / (1.0 + 0.01 * smoothColor));
                color += glow * vec3(0.5, 0.8, 1.0);
                
                gl_FragColor = vec4(color, 1.0);
            }
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    console.log("Hero fractal mesh created");
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update time uniform
        uniforms.time.value += 0.01;
        
        // Slowly change Julia constant for animation
        const t = uniforms.time.value * 0.1;
        uniforms.juliaConstant.value.x = -0.8 + 0.2 * Math.sin(t * 0.3);
        uniforms.juliaConstant.value.y = 0.156 + 0.1 * Math.cos(t * 0.5);
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle resize
    function onWindowResize() {
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
    console.log("Hero fractal animation started");
}

// Create the main background fractal
function createFractalBackground() {
    console.log('createFractalBackground called');
    
    // Set up the scene
    scene = new THREE.Scene();
    console.log('Scene created');
    
    // Set up the camera (orthographic for 2D fractals)
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    console.log('Camera created');
    
    // Set up the renderer with better quality settings
    const container = document.getElementById('fractal-background');
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance'
    });
    
    // Set pixel ratio based on device performance
    const performanceLevel = getDevicePerformanceLevel();
    let pixelRatio = window.devicePixelRatio;
    if (performanceLevel === 'low') {
        pixelRatio = Math.min(pixelRatio, 1.0);
    } else if (performanceLevel === 'medium') {
        pixelRatio = Math.min(pixelRatio, 1.5);
    } else {
        pixelRatio = Math.min(pixelRatio, 2.0);
    }
    
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    console.log('Renderer created with pixel ratio: ' + pixelRatio);
    
    // Set up controls for debugging
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.5;
    controls.maxDistance = 2;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Create a plane for the fractal
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Select a random fractal type if not specified
    if (!fractalType) {
        const types = ['mandelbrot', 'julia', 'burningship'];
        fractalType = types[Math.floor(Math.random() * types.length)];
    }
    console.log('Selected fractal type:', fractalType);
    
    // Create the fractal
    createFractal();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start the animation loop
    animate();
}

// Handle window resize
function onWindowResize() {
    console.log('Window resized');
    
    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Update uniforms if they exist
    if (uniforms && uniforms.resolution) {
        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;
    }
    
    // Force a re-render
    if (scene && camera) {
        renderer.render(scene, camera);
    }
}

// Create the fractal based on the selected type
function createFractal() {
    console.log('createFractal called with type:', fractalType);
    
    // Clean up existing mesh if any
    if (fractalMesh) {
        scene.remove(fractalMesh);
        fractalMesh.geometry.dispose();
        fractalMesh.material.dispose();
        console.log('Existing fractal mesh cleaned up');
    }
    
    // Create a plane geometry that fills the viewport
    const geometry = new THREE.PlaneGeometry(2, 2);
    console.log('Plane geometry created');
    
    // Get the appropriate shader based on fractal type
    let fragmentShader;
    switch (fractalType) {
        case 'mandelbrot':
            fragmentShader = getMandelbrotShader();
            break;
        case 'julia':
            fragmentShader = getJuliaShader();
            break;
        case 'burningship':
            fragmentShader = getBurningShipShader();
            break;
        default:
            fragmentShader = getMandelbrotShader();
            break;
    }
    console.log('Fragment shader selected for type:', fractalType);
    
    // Set up uniforms for the shader with more dynamic and impressive values
    const colorScheme = Math.floor(Math.random() * 5); // 5 different color schemes
    
    uniforms = {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        colorOffset: { value: Math.random() * 6.28 }, // Random color offset
        zoom: { value: Math.random() * 2.0 + 2.0 }, // Random zoom level
        centerX: { value: Math.random() * 0.5 - 0.25 }, // More varied center X position
        centerY: { value: Math.random() * 0.5 - 0.25 }, // More varied center Y position
        colorFactor: { value: Math.random() * 5.0 + 3.0 }, // More vibrant colors
        iterationLimit: { value: getIterationLimit() }, // Iteration limit based on performance level
        juliaX: { value: Math.random() * 1.2 - 0.6 }, // More varied Julia set parameters
        juliaY: { value: Math.random() * 1.2 - 0.6 },
        colorScheme: { value: colorScheme }, // Color scheme selection
        pulseSpeed: { value: Math.random() * 0.5 + 0.1 }, // Speed of pulsing effect
        rotationSpeed: { value: Math.random() * 0.01 - 0.005 }, // Rotation speed
        zoomPulse: { value: Math.random() * 0.2 + 0.1 } // Zoom pulsing amount
    };
    console.log('Uniforms set up:', uniforms);
    
    // Create material with shaders
    const material = new THREE.ShaderMaterial({
        vertexShader: getVertexShader(),
        fragmentShader: fragmentShader,
        uniforms: uniforms,
        transparent: true
    });
    console.log('Shader material created');
    
    // Create mesh and add to scene
    fractalMesh = new THREE.Mesh(geometry, material);
    scene.add(fractalMesh);
    console.log('Fractal mesh added to scene');
    
    // Log the fractal parameters
    console.log(`Fractal type: ${fractalType}`);
    console.log(`Zoom: ${uniforms.zoom.value.toFixed(2)}`);
    console.log(`Center: (${uniforms.centerX.value.toFixed(2)}, ${uniforms.centerY.value.toFixed(2)})`);
    console.log(`Iterations: ${uniforms.iterationLimit.value}`);
    console.log(`Color Scheme: ${uniforms.colorScheme.value}`);
}

// Animation loop
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Update time uniform for animation effects
    if (uniforms && uniforms.time) {
        uniforms.time.value = performance.now() / 1000;
        
        // Add dynamic zoom pulsing effect
        if (uniforms.zoom && uniforms.zoomPulse) {
            const pulseFactor = Math.sin(uniforms.time.value * uniforms.pulseSpeed.value) * uniforms.zoomPulse.value;
            uniforms.zoom.value = uniforms.zoom.value * (1.0 + pulseFactor * 0.01);
        }
        
        // Add subtle rotation effect
        if (uniforms.centerX && uniforms.centerY && uniforms.rotationSpeed) {
            const angle = uniforms.time.value * uniforms.rotationSpeed.value;
            const centerX = uniforms.centerX.value;
            const centerY = uniforms.centerY.value;
            const radius = Math.sqrt(centerX * centerX + centerY * centerY);
            const currentAngle = Math.atan2(centerY, centerX);
            const newAngle = currentAngle + angle;
            
            uniforms.centerX.value = radius * Math.cos(newAngle);
            uniforms.centerY.value = radius * Math.sin(newAngle);
        }
        
        // Slowly shift color offset for a flowing color effect
        if (uniforms.colorOffset) {
            uniforms.colorOffset.value += 0.001;
        }
    }
    
    // Update controls if they exist
    if (controls) {
        controls.update();
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Detect device performance capabilities
function detectPerformance() {
    // Check if running on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check GPU capabilities by creating a test canvas and checking max texture size
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
        // WebGL not supported, set to lowest performance
        performanceLevel = 'low';
        console.log('WebGL not supported, using low performance settings');
        return;
    }
    
    // Check max texture size as an indicator of GPU capability
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    
    // Set performance level based on device and GPU capabilities
    if (isMobile || maxTextureSize < 8192) {
        performanceLevel = 'low';
        console.log('Mobile device or limited GPU detected, using low performance settings');
    } else if (maxTextureSize < 16384) {
        performanceLevel = 'medium';
        console.log('Medium performance GPU detected');
    } else {
        performanceLevel = 'high';
        console.log('High performance GPU detected');
    }
    
    // Clean up test context
    if (gl.getExtension('WEBGL_lose_context')) {
        gl.getExtension('WEBGL_lose_context').loseContext();
    }
}

// Get iteration limit based on performance level
function getIterationLimit() {
    switch (performanceLevel) {
        case 'low':
            return Math.floor(Math.random() * 50) + 100; // 100-150 iterations
        case 'medium':
            return Math.floor(Math.random() * 100) + 150; // 150-250 iterations
        case 'high':
            return Math.floor(Math.random() * 150) + 250; // 250-400 iterations
        default:
            return Math.floor(Math.random() * 100) + 150; // Default
    }
}

// Vertex shader (simple pass-through)
function getVertexShader() {
    return `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
}

// Mandelbrot set fragment shader
function getMandelbrotShader() {
    return `
        precision highp float;
        
        uniform float time;
        uniform vec2 resolution;
        uniform float zoom;
        uniform float centerX;
        uniform float centerY;
        uniform float colorOffset;
        uniform float colorFactor;
        uniform int iterationLimit;
        uniform float pulseSpeed;
        uniform float rotationSpeed;
        uniform float zoomPulse;
        uniform int colorScheme;
        
        varying vec2 vUv;
        
        // HSV to RGB conversion
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        // Complex number multiplication
        vec2 cmul(vec2 a, vec2 b) {
            return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
        }
        
        // Complex number power
        vec2 cpow(vec2 z, float n) {
            float r = length(z);
            float theta = atan(z.y, z.x);
            return pow(r, n) * vec2(cos(n * theta), sin(n * theta));
        }
        
        void main() {
            // Normalized pixel coordinates
            vec2 uv = vUv * 2.0 - 1.0;
            
            // Adjust aspect ratio
            float aspectRatio = resolution.x / resolution.y;
            uv.x *= aspectRatio;
            
            // Apply zoom and center
            float dynamicZoom = zoom * (1.0 + 0.1 * sin(time * pulseSpeed));
            float angle = time * rotationSpeed;
            vec2 rotatedUV = vec2(
                uv.x * cos(angle) - uv.y * sin(angle),
                uv.x * sin(angle) + uv.y * cos(angle)
            );
            
            vec2 c = rotatedUV / dynamicZoom + vec2(centerX, centerY);
            
            // Add some dynamic warping based on time
            float warpFactor = 0.03 * sin(time * 0.2);
            c += warpFactor * vec2(sin(uv.y * 5.0 + time), cos(uv.x * 5.0 + time));
            
            // Mandelbrot iteration
            vec2 z = vec2(0.0);
            int iter = 0;
            float smoothIter = 0.0;
            
            for (int i = 0; i < 1000; i++) {
                if (i >= iterationLimit) break;
                
                // z = z^2 + c
                z = cmul(z, z) + c;
                
                // Add some variation based on time
                float variation = 0.01 * sin(time * 0.3);
                if (mod(float(i), 2.0) < 0.5) {
                    z += variation * vec2(sin(time), cos(time));
                }
                
                // Check if point escapes
                if (length(z) > 2.0) {
                    // Smooth coloring
                    smoothIter = float(i) - log(log(length(z))) / log(2.0);
                    break;
                }
                
                iter++;
            }
            
            if (iter < iterationLimit) {
                float normalizedIter = smoothIter / float(iterationLimit);
                
                // Create a color based on iteration count
                vec3 color;
                if (colorScheme == 0) {
                    color = hsv2rgb(vec3(
                        normalizedIter * colorFactor + colorOffset + time * 0.05,
                        0.8 + 0.2 * sin(time * 0.1),
                        1.0
                    ));
                } else if (colorScheme == 1) {
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05),
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05),
                        1.0 - 0.5 * sin(normalizedIter * 3.14 + time * 0.1)
                    );
                } else if (colorScheme == 2) {
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        sin(normalizedIter * colorFactor * 2.0 + time * 0.2) * 0.5 + 0.5
                    );
                } else if (colorScheme == 3) {
                    float pulse = 0.5 + 0.5 * sin(time * 0.2);
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        pulse,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5
                    );
                } else if (colorScheme == 4) {
                    // Electric plasma effect
                    float electric = pow(normalizedIter, 0.5 + 0.5 * sin(time * 0.1));
                    color = vec3(
                        electric,
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5
                    );
                }
                
                // Add subtle pulsing glow
                float glow = 0.05 * sin(time * 0.5 + normalizedIter * 10.0);
                color += glow;
                
                gl_FragColor = vec4(color, 1.0);
            } else {
                // Interior points
                float interiorEffect = 0.05 * sin(length(c) * 50.0 + time);
                vec3 interiorColor = vec3(0.0, interiorEffect, interiorEffect * 2.0);
                gl_FragColor = vec4(interiorColor, 1.0);
            }
        }
    `;
}

// Julia set fragment shader
function getJuliaShader() {
    return `
        precision highp float;
        
        uniform float time;
        uniform vec2 resolution;
        uniform float zoom;
        uniform float centerX;
        uniform float centerY;
        uniform float colorOffset;
        uniform float colorFactor;
        uniform int iterationLimit;
        uniform float juliaX;
        uniform float juliaY;
        uniform float pulseSpeed;
        uniform float rotationSpeed;
        uniform float zoomPulse;
        uniform int colorScheme;
        
        varying vec2 vUv;
        
        // HSV to RGB conversion
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        // Complex number multiplication
        vec2 cmul(vec2 a, vec2 b) {
            return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
        }
        
        void main() {
            // Normalized pixel coordinates
            vec2 uv = vUv * 2.0 - 1.0;
            
            // Adjust aspect ratio
            float aspectRatio = resolution.x / resolution.y;
            uv.x *= aspectRatio;
            
            // Apply zoom and center
            float dynamicZoom = zoom * (1.0 + 0.1 * sin(time * pulseSpeed));
            float angle = time * rotationSpeed;
            vec2 rotatedUV = vec2(
                uv.x * cos(angle) - uv.y * sin(angle),
                uv.x * sin(angle) + uv.y * cos(angle)
            );
            
            vec2 z = rotatedUV / dynamicZoom + vec2(centerX, centerY);
            
            // Dynamic Julia constant - make it move in a figure-8 pattern
            float juliaTime = time * 0.2;
            vec2 c = vec2(
                juliaX + 0.1 * sin(juliaTime) * cos(juliaTime * 0.5),
                juliaY + 0.1 * sin(juliaTime * 0.7) * sin(juliaTime * 0.3)
            );
            
            // Add some dynamic warping
            float warpFactor = 0.02 * sin(time * 0.3);
            z += warpFactor * vec2(sin(z.y * 4.0 + time), cos(z.x * 4.0 + time));
            
            // Julia set iteration
            int iter = 0;
            float smoothIter = 0.0;
            
            for (int i = 0; i < 1000; i++) {
                if (i >= iterationLimit) break;
                
                // z = z^2 + c
                z = cmul(z, z) + c;
                
                // Add some variation based on time
                float variation = 0.01 * sin(time * 0.4);
                if (mod(float(i), 3.0) < 0.5) {
                    z += variation * vec2(sin(time * 0.7), cos(time * 0.9));
                }
                
                // Check if point escapes
                if (length(z) > 2.0) {
                    // Smooth coloring
                    smoothIter = float(i) - log(log(length(z))) / log(2.0);
                    break;
                }
                
                iter++;
            }
            
            if (iter < iterationLimit) {
                float normalizedIter = smoothIter / float(iterationLimit);
                
                // Create a color based on iteration count with dynamic effects
                vec3 color;
                if (colorScheme == 0) {
                    color = hsv2rgb(vec3(
                        normalizedIter * colorFactor + colorOffset + time * 0.05,
                        0.8 + 0.2 * sin(time * 0.1),
                        1.0
                    ));
                } else if (colorScheme == 1) {
                    // Swirling color effect
                    float swirl = sin(normalizedIter * 10.0 + time * 0.2);
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05),
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05),
                        0.5 + 0.5 * swirl
                    );
                } else if (colorScheme == 2) {
                    // Rainbow pulse
                    float pulse = 0.5 + 0.5 * sin(time * 0.3);
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        pulse
                    );
                } else if (colorScheme == 3) {
                    // Electric blue theme
                    color = vec3(
                        0.1 + 0.2 * sin(normalizedIter * 20.0 + time),
                        0.4 + 0.4 * sin(normalizedIter * colorFactor + time * 0.1),
                        0.7 + 0.3 * cos(normalizedIter * colorFactor + time * 0.2)
                    );
                } else if (colorScheme == 4) {
                    // Fire and ice
                    float fireIce = sin(normalizedIter * 5.0 + time * 0.1);
                    if (fireIce > 0.0) {
                        // Fire colors
                        color = vec3(
                            0.8 + 0.2 * sin(normalizedIter * 10.0),
                            0.4 * normalizedIter,
                            0.1 * normalizedIter
                        );
                    } else {
                        // Ice colors
                        color = vec3(
                            0.1 * normalizedIter,
                            0.4 * normalizedIter,
                            0.8 + 0.2 * sin(normalizedIter * 10.0)
                        );
                    }
                }
                
                // Add subtle pulsing glow
                float glow = 0.05 * sin(time * 0.5 + normalizedIter * 10.0);
                color += glow;
                
                gl_FragColor = vec4(color, 1.0);
            } else {
                // Interior points with subtle animation
                float interiorEffect = 0.05 * sin(length(z) * 50.0 + time);
                vec3 interiorColor = vec3(interiorEffect, 0.0, interiorEffect * 2.0);
                gl_FragColor = vec4(interiorColor, 1.0);
            }
        }
    `;
}

// Burning Ship fractal fragment shader
function getBurningShipShader() {
    return `
        uniform float time;
        uniform vec2 resolution;
        uniform float zoom;
        uniform float centerX;
        uniform float centerY;
        uniform float colorOffset;
        uniform float colorFactor;
        uniform int iterationLimit;
        uniform float pulseSpeed;
        uniform float rotationSpeed;
        uniform float zoomPulse;
        uniform int colorScheme;
        
        varying vec2 vUv;
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
            // Convert UV to complex plane coordinates
            vec2 uv = vUv * 2.0 - 1.0;
            uv.x *= resolution.x / resolution.y; // Aspect ratio correction
            
            // Apply zoom and center position
            vec2 c = uv / zoom + vec2(centerX, centerY);
            
            // Burning Ship iteration variables
            vec2 z = vec2(0.0);
            float iter = 0.0;
            
            // Iterate the Burning Ship formula: z = (|Re(z)| + i|Im(z)|)² + c
            for (int i = 0; i < 1000; i++) {
                if (i >= iterationLimit) break;
                
                // Take absolute values of real and imaginary parts
                z = vec2(abs(z.x), abs(z.y));
                
                // z² = (a+bi)² = a² + 2abi - b²
                vec2 z2 = vec2(
                    z.x * z.x - z.y * z.y,
                    2.0 * z.x * z.y
                );
                
                z = z2 + c;
                
                // Check if point escapes
                if (dot(z, z) > 4.0) {
                    break;
                }
                
                iter++;
            }
            
            // Smooth coloring
            if (iter < float(iterationLimit)) {
                // Normalized iteration count with smooth coloring
                float smoothIter = iter + 1.0 - log(log(dot(z, z))) / log(2.0);
                float normalizedIter = smoothIter / float(iterationLimit);
                
                // Create a color based on iteration count
                vec3 color;
                if (colorScheme == 0) {
                    color = hsv2rgb(vec3(
                        normalizedIter * colorFactor + colorOffset + time * 0.05,
                        0.8,
                        1.0
                    ));
                } else if (colorScheme == 1) {
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05),
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05),
                        1.0
                    );
                } else if (colorScheme == 2) {
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        1.0
                    );
                } else if (colorScheme == 3) {
                    color = vec3(
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        1.0,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5
                    );
                } else if (colorScheme == 4) {
                    color = vec3(
                        1.0,
                        sin(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5,
                        cos(normalizedIter * colorFactor + colorOffset + time * 0.05) * 0.5 + 0.5
                    );
                }
                
                gl_FragColor = vec4(color, 1.0);
            } else {
                // Points inside the Burning Ship set
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            }
        }
    `;
}

// Clean up resources when switching to a different background
function cleanup() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    if (fractalMesh) {
        scene.remove(fractalMesh);
        fractalMesh.geometry.dispose();
        fractalMesh.material.dispose();
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    window.removeEventListener('resize', onWindowResize);
}

// Generate a new fractal with the selected type
function generateNewFractal(selectedType = 'random') {
    // Clean up existing fractal
    if (fractalMesh) {
        scene.remove(fractalMesh);
        fractalMesh.geometry.dispose();
        fractalMesh.material.dispose();
    }
    
    // Set fractal type based on selection
    if (selectedType === 'random') {
        const randomValue = Math.random();
        if (randomValue < 0.33) {
            fractalType = 'mandelbrot';
        } else if (randomValue < 0.66) {
            fractalType = 'julia';
        } else {
            fractalType = 'burningship';
        }
    } else {
        fractalType = selectedType;
    }
    
    // Create the new fractal
    createFractal();
}

// Initialize L-System fractal (Dragon Curve)
function createDragonCurve() {
    // This is a placeholder for a more complex implementation
    // A full L-system would require more complex geometry generation
    console.log("Dragon Curve L-system would be implemented here");
    // For now, we'll just use the Julia/Mandelbrot fractals
}

// Set up control panel event listeners
function setupFractalControls() {
    console.log('Setting up fractal controls');
    
    // Create controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'fractal-controls';
    controlsContainer.style.position = 'fixed';
    controlsContainer.style.bottom = '20px';
    controlsContainer.style.right = '20px';
    controlsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    controlsContainer.style.padding = '15px';
    controlsContainer.style.borderRadius = '8px';
    controlsContainer.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    controlsContainer.style.zIndex = '1000';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.flexDirection = 'column';
    controlsContainer.style.gap = '10px';
    
    // Create generate button
    const generateButton = document.createElement('button');
    generateButton.id = 'generate-fractal';
    generateButton.textContent = 'Generate New Fractal';
    generateButton.addEventListener('click', function() {
        // Randomly select a new fractal type
        const types = ['mandelbrot', 'julia', 'burningship'];
        fractalType = types[Math.floor(Math.random() * types.length)];
        
        // Regenerate the fractal
        createFractal();
    });
    
    // Create fractal type selector
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'fractal-type-selector';
    
    const selectorLabel = document.createElement('label');
    selectorLabel.textContent = 'Fractal Type:';
    selectorLabel.htmlFor = 'fractal-type-select';
    
    const selector = document.createElement('select');
    selector.id = 'fractal-type-select';
    
    const types = [
        { value: 'mandelbrot', text: 'Mandelbrot Set' },
        { value: 'julia', text: 'Julia Set' },
        { value: 'burningship', text: 'Burning Ship' }
    ];
    
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.value;
        option.textContent = type.text;
        if (type.value === fractalType) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
    
    selector.addEventListener('change', function() {
        fractalType = this.value;
        createFractal();
    });
    
    selectorContainer.appendChild(selectorLabel);
    selectorContainer.appendChild(selector);
    
    // Add elements to container
    controlsContainer.appendChild(generateButton);
    controlsContainer.appendChild(selectorContainer);
    
    // Add container to body
    document.body.appendChild(controlsContainer);
}

// Create fractal dividers
function createFractalDividers() {
    console.log("Creating fractal dividers...");
    
    const dividerIds = [
        'services-divider',
        'expertise-divider',
        'testimonials-divider',
        'about-divider',
        'contact-divider'
    ];
    
    dividerIds.forEach((id, index) => {
        const divider = document.getElementById(id);
        if (!divider) {
            console.warn(`Divider with id ${id} not found`);
            return;
        }
        
        createFractalDivider(divider, index);
    });
}

// Create a single fractal divider
function createFractalDivider(container, index) {
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Create a plane for the fractal
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Different parameters for each divider
    const params = [
        { seed: 0.42, speed: 0.5, colorOffset: 0.0 },
        { seed: 0.38, speed: 0.7, colorOffset: 0.2 },
        { seed: 0.35, speed: 0.6, colorOffset: 0.4 },
        { seed: 0.31, speed: 0.8, colorOffset: 0.6 },
        { seed: 0.28, speed: 0.9, colorOffset: 0.8 }
    ];
    
    const param = params[index % params.length];
    
    // Use a linear fractal pattern for dividers
    const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        seed: { value: param.seed },
        colorOffset: { value: param.colorOffset }
    };
    
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform float seed;
        uniform float colorOffset;
        
        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        
        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            
            // Create a linear fractal pattern
            float noise1 = snoise(vec2(uv.x * 10.0, uv.y * 2.0 + time * 0.1)) * 0.5 + 0.5;
            float noise2 = snoise(vec2(uv.x * 20.0 + seed, uv.y * 4.0 - time * 0.15)) * 0.5 + 0.5;
            float noise3 = snoise(vec2(uv.x * 5.0 - time * 0.05, uv.y * 10.0)) * 0.5 + 0.5;
            
            float pattern = noise1 * noise2 * noise3;
            
            // Create flowing lines
            float lines = sin(uv.x * 50.0 + uv.y * 20.0 + time * 0.2) * 0.5 + 0.5;
            lines *= sin(uv.x * 30.0 - uv.y * 10.0 - time * 0.1) * 0.5 + 0.5;
            
            // Combine patterns
            float combined = mix(pattern, lines, 0.5);
            
            // Create color
            float hue = mod(combined * 0.2 + colorOffset + time * 0.05, 1.0);
            float sat = 0.7 + 0.3 * sin(combined * 10.0);
            float val = 0.8 + 0.2 * combined;
            
            vec3 color = hsv2rgb(vec3(hue, sat, val));
            
            // Add highlights
            color += 0.2 * vec3(1.0, 1.0, 1.0) * pow(lines, 3.0);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update time uniform
        uniforms.time.value += param.speed * 0.01;
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle resize
    function onWindowResize() {
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

// Create fractal accents
function createFractalAccents() {
    console.log("Creating fractal accents...");
    
    const accentIds = [
        'services-accent',
        'expertise-accent',
        'about-accent',
        'contact-accent'
    ];
    
    accentIds.forEach((id, index) => {
        const accent = document.getElementById(id);
        if (!accent) {
            console.warn(`Accent with id ${id} not found`);
            return;
        }
        
        createFractalAccent(accent, index);
    });
}

// Create a single fractal accent
function createFractalAccent(container, index) {
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Create a plane for the fractal
    const geometry = new THREE.PlaneGeometry(2, 2);
    
    // Different parameters for each accent
    const params = [
        { c: new THREE.Vector2(-0.7, 0.27), zoom: 0.8, speed: 0.3 },
        { c: new THREE.Vector2(-0.8, 0.156), zoom: 0.9, speed: 0.4 },
        { c: new THREE.Vector2(-0.75, -0.14), zoom: 0.7, speed: 0.5 },
        { c: new THREE.Vector2(-0.4, 0.6), zoom: 0.6, speed: 0.6 }
    ];
    
    const param = params[index % params.length];
    
    // Use Julia set for accents
    const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
        juliaConstant: { value: param.c },
        zoom: { value: param.zoom },
        center: { value: new THREE.Vector2(0.0, 0.0) }
    };
    
    const fragmentShader = `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 juliaConstant;
        uniform float zoom;
        uniform vec2 center;
        
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        
        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            uv = uv / zoom + center;
            
            vec2 c = juliaConstant + vec2(sin(time * 0.1) * 0.1, cos(time * 0.15) * 0.1);
            vec2 z = uv;
            
            float iter = 0.0;
            const float maxIter = 100.0;
            
            for (float i = 0.0; i < maxIter; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                
                if (dot(z, z) > 4.0) {
                    iter = i;
                    break;
                }
            }
            
            if (iter >= maxIter) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            } else {
                float smoothColor = iter - log2(log2(dot(z, z))) + 4.0;
                
                float hue = mod(smoothColor * 0.1 + time * 0.1, 1.0);
                float sat = 0.7 + 0.3 * sin(time);
                float val = 0.6 + 0.4 * sin(time * 0.2);
                
                vec3 color = hsv2rgb(vec3(hue, sat, val));
                
                gl_FragColor = vec4(color, 1.0);
            }
        }
    `;
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader,
        vertexShader: `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Update time uniform
        uniforms.time.value += param.speed * 0.01;
        
        // Render
        renderer.render(scene, camera);
    }
    
    // Handle resize
    function onWindowResize() {
        if (!container) return;
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        renderer.setSize(width, height);
        uniforms.resolution.value.x = width;
        uniforms.resolution.value.y = height;
    }
    
    window.addEventListener('resize', onWindowResize);
    
    // Start animation
    animate();
}

// Export functions for external use
window.fractalBackground = {
    init: initFractalBackground,
    cleanup: cleanup,
    generateNewFractal: generateNewFractal
};

// Start everything when the DOM is loaded
window.addEventListener('load', function() {
    console.log('Window load event fired');
    if (typeof THREE === 'undefined') {
        console.log('THREE is undefined, loading from CDN');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = function() {
            console.log('THREE loaded from CDN');
            initFractalBackground();
        };
        document.head.appendChild(script);
    } else {
        console.log('THREE already loaded');
        initFractalBackground();
    }
});
