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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

// LLM Ticker Animation
function setupLLMTicker() {
    const tickerTrack = document.querySelector('.ticker-track');
    if (!tickerTrack) return; // Exit if element doesn't exist
    
    // Clone the ticker items to create a continuous loop
    const tickerItems = tickerTrack.querySelectorAll('.ticker-item');
    const itemsArray = Array.from(tickerItems);
    
    // Clone each item and append to create a seamless loop
    itemsArray.forEach(item => {
        const clone = item.cloneNode(true);
        tickerTrack.appendChild(clone);
    });
    
    // Adjust animation duration based on number of items
    const totalItems = tickerTrack.querySelectorAll('.ticker-item').length;
    tickerTrack.style.animationDuration = `${totalItems * 3}s`;
    
    // Add dynamic 3D tilt effect on mouse move
    const modelTags = document.querySelectorAll('.model-tag');
    modelTags.forEach(tag => {
        tag.addEventListener('mousemove', (e) => {
            // Get position of cursor relative to the element
            const rect = tag.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element
            
            // Calculate rotation based on cursor position
            // The closer to the edge, the more tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10; // Divide by 10 to reduce the effect
            const rotateY = (centerX - x) / 10;
            
            // Apply the transform
            tag.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            
            // Add dynamic shadow based on tilt
            const shadowX = (x - centerX) / 10;
            const shadowY = (y - centerY) / 10;
            tag.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.2), 0 0 15px var(--primary-color)`;
        });
        
        // Reset transform when mouse leaves
        tag.addEventListener('mouseleave', () => {
            tag.style.transform = '';
            tag.style.boxShadow = '';
        });
        
        // Add random animation delay to each tag for more organic movement
        const animations = tag.getAnimations();
        animations.forEach(animation => {
            const randomDelay = Math.random() * -5; // Random delay between 0 and -5s
            animation.effect.updateTiming({ delay: randomDelay });
        });
        
        // Generate random accent color on hover
        tag.addEventListener('mouseenter', () => {
            const colors = [
                '#6366f1', // Indigo
                '#8b5cf6', // Violet
                '#ec4899', // Pink
                '#f43f5e', // Rose
                '#10b981', // Emerald
                '#06b6d4', // Cyan
                '#3b82f6'  // Blue
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            tag.style.borderLeftColor = randomColor;
            
            // Add glowing effect
            const modelName = tag.querySelector('.model-name');
            if (modelName) {
                modelName.style.textShadow = `0 0 10px ${randomColor}`;
            }
        });
    });
    
    // Add parallax effect on mouse move for the entire ticker section
    const tickerSection = document.querySelector('.llm-ticker');
    const tickerWrapper = document.querySelector('.ticker-wrapper');
    
    if (tickerSection && tickerWrapper) {
        tickerSection.addEventListener('mousemove', (e) => {
            // Calculate mouse position as percentage of the viewport
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Apply subtle parallax effect to the ticker track
            if (tickerTrack) {
                const moveX = (mouseX - 0.5) * 20; // Move up to 20px
                tickerTrack.style.transform = `translateX(${moveX}px)`;
            }
            
            // Apply subtle parallax to the background
            const moveBackgroundX = (mouseX - 0.5) * 30;
            const moveBackgroundY = (mouseY - 0.5) * 30;
            tickerSection.style.backgroundPosition = `${moveBackgroundX}px ${moveBackgroundY}px`;
        });
        
        tickerSection.addEventListener('mouseleave', () => {
            tickerTrack.style.transform = '';
            tickerSection.style.backgroundPosition = '';
        });
    }
}

// LLM Cards Horizontal Scrolling
function setupLLMScroll() {
    const scrollContainer = document.querySelector('.llm-cards-container');
    const scrollLeftBtn = document.querySelector('.llm-scroll-left');
    const scrollRightBtn = document.querySelector('.llm-scroll-right');
    const progressBar = document.querySelector('.llm-scroll-progress-bar');
    
    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn || !progressBar) return;
    
    // Update progress bar based on scroll position
    function updateProgressBar() {
        const scrollPercentage = (scrollContainer.scrollLeft / (scrollContainer.scrollWidth - scrollContainer.clientWidth)) * 100;
        progressBar.style.width = `${scrollPercentage}%`;
    }
    
    // Scroll left button click
    scrollLeftBtn.addEventListener('click', () => {
        const cardWidth = scrollContainer.querySelector('.llm-card').offsetWidth + 24; // Card width + gap
        scrollContainer.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });
    
    // Scroll right button click
    scrollRightBtn.addEventListener('click', () => {
        const cardWidth = scrollContainer.querySelector('.llm-card').offsetWidth + 24; // Card width + gap
        scrollContainer.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });
    
    // Update progress bar on scroll
    scrollContainer.addEventListener('scroll', () => {
        updateProgressBar();
    });
    
    // Initialize progress bar
    updateProgressBar();
    
    // Add keyboard navigation
    scrollContainer.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            scrollLeftBtn.click();
        } else if (e.key === 'ArrowRight') {
            scrollRightBtn.click();
        }
    });
    
    // Make container focusable for keyboard navigation
    scrollContainer.setAttribute('tabindex', '0');
    
    // Add touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    scrollContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left, scroll right
            scrollRightBtn.click();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right, scroll left
            scrollLeftBtn.click();
        }
    }
    
    // Add hover effects for cards
    const llmCards = document.querySelectorAll('.llm-card');
    llmCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add hover effect
            card.classList.add('active');
            
            // Reduce opacity of other cards
            llmCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove hover effect
            card.classList.remove('active');
            
            // Reset opacity of all cards
            llmCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
            });
        });
    });
}

// Blog Horizontal Scrolling
function setupBlogScroll() {
    // Get all scroll content elements (could be multiple on different pages)
    const scrollContents = document.querySelectorAll('.scroll-content');
    
    if (scrollContents.length === 0) return;
    
    // Store auto-scroll intervals for each scroll section
    const autoScrollIntervals = new Map();
    // Store auto-scroll state (paused or playing)
    const autoScrollState = new Map();
    
    scrollContents.forEach(scrollContent => {
        const scrollSection = scrollContent.closest('.horizontal-scroll-section');
        if (!scrollSection) return;
        
        const prevBtn = scrollSection.querySelector('.prev-btn');
        const nextBtn = scrollSection.querySelector('.next-btn');
        const pauseBtn = scrollSection.querySelector('.pause-btn');
        const scrollProgress = scrollSection.querySelector('.scroll-progress');
        
        if (!prevBtn || !nextBtn || !scrollProgress) return;
        
        // Set initial state to playing
        autoScrollState.set(scrollSection, true);
        
        // Calculate the total scroll width
        const updateScrollProgress = () => {
            const scrollLeft = scrollContent.scrollLeft;
            const maxScrollLeft = scrollContent.scrollWidth - scrollContent.clientWidth;
            const progress = (scrollLeft / maxScrollLeft) * 100;
            scrollProgress.style.width = `${progress}%`;
        };
        
        // Function to scroll to next item
        const scrollToNext = () => {
            const cardWidth = scrollContent.querySelector('.article-card').offsetWidth;
            const gap = 32; // 2rem gap in pixels
            const maxScrollLeft = scrollContent.scrollWidth - scrollContent.clientWidth;
            
            // If we're at the end, scroll back to start
            if (scrollContent.scrollLeft >= maxScrollLeft - 10) {
                scrollContent.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                scrollContent.scrollBy({
                    left: cardWidth + gap,
                    behavior: 'smooth'
                });
            }
        };
        
        // Scroll to previous item
        prevBtn.addEventListener('click', () => {
            const cardWidth = scrollContent.querySelector('.article-card').offsetWidth;
            const gap = 32; // 2rem gap in pixels
            scrollContent.scrollBy({
                left: -1 * (cardWidth + gap),
                behavior: 'smooth'
            });
            
            // Reset auto-scroll timer when manually navigating
            resetAutoScroll(scrollSection);
        });
        
        // Scroll to next item
        nextBtn.addEventListener('click', () => {
            scrollToNext();
            
            // Reset auto-scroll timer when manually navigating
            resetAutoScroll(scrollSection);
        });
        
        // Toggle pause/play
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                const isPaused = !autoScrollState.get(scrollSection);
                autoScrollState.set(scrollSection, isPaused);
                
                // Update button icon
                pauseBtn.innerHTML = isPaused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
                
                if (isPaused) {
                    // Pause auto-scroll
                    if (autoScrollIntervals.has(scrollSection)) {
                        clearInterval(autoScrollIntervals.get(scrollSection));
                    }
                } else {
                    // Resume auto-scroll
                    startAutoScroll();
                }
            });
        }
        
        // Update progress bar on scroll
        scrollContent.addEventListener('scroll', updateScrollProgress);
        
        // Initialize progress bar
        updateScrollProgress();
        
        // Set up auto-scrolling
        const startAutoScroll = () => {
            // Only start if not paused
            if (!autoScrollState.get(scrollSection)) return;
            
            // Clear any existing interval
            if (autoScrollIntervals.has(scrollSection)) {
                clearInterval(autoScrollIntervals.get(scrollSection));
            }
            
            // Set new interval - scroll every 5 seconds
            const interval = setInterval(scrollToNext, 5000);
            autoScrollIntervals.set(scrollSection, interval);
        };
        
        // Reset auto-scroll timer
        const resetAutoScroll = () => {
            // Only reset if not paused
            if (!autoScrollState.get(scrollSection)) return;
            
            if (autoScrollIntervals.has(scrollSection)) {
                clearInterval(autoScrollIntervals.get(scrollSection));
                startAutoScroll();
            }
        };
        
        // Pause auto-scroll on hover
        scrollSection.addEventListener('mouseenter', () => {
            // Only pause if not manually paused
            if (!autoScrollState.get(scrollSection)) return;
            
            if (autoScrollIntervals.has(scrollSection)) {
                clearInterval(autoScrollIntervals.get(scrollSection));
            }
        });
        
        // Resume auto-scroll when mouse leaves
        scrollSection.addEventListener('mouseleave', () => {
            // Only resume if not manually paused
            if (!autoScrollState.get(scrollSection)) return;
            
            startAutoScroll();
        });
        
        // Start auto-scrolling initially
        startAutoScroll();
        
        // Add parallax effect on mouse move
        scrollSection.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            // Apply subtle parallax to article cards
            const cards = scrollSection.querySelectorAll('.article-card');
            cards.forEach((card, index) => {
                const depth = 0.05 + (index % 3) * 0.02; // Vary depth for each card
                const moveX = (mouseX - 0.5) * depth * 50;
                const moveY = (mouseY - 0.5) * depth * 30;
                card.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        scrollSection.addEventListener('mouseleave', () => {
            const cards = scrollSection.querySelectorAll('.article-card');
            cards.forEach(card => {
                card.style.transform = '';
            });
        });
        
        // Add hover effect for article cards
        const articleCards = scrollSection.querySelectorAll('.article-card');
        articleCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add hover effect
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
                
                // Highlight other elements
                const link = card.querySelector('.article-link') || card.querySelector('.read-more');
                if (link) {
                    link.style.textDecoration = 'underline';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
                
                const link = card.querySelector('.article-link') || card.querySelector('.read-more');
                if (link) {
                    link.style.textDecoration = 'none';
                }
            });
        });
    });
}

// Newsletter Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            
            // Create a mailto link with the form data
            const subject = `Newsletter Subscription`;
            const body = `New newsletter subscription from: ${email}`;
            const mailtoLink = `mailto:babu@leelaanalytics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open the email client
            window.location.href = mailtoLink;
            
            // Reset the form
            newsletterForm.reset();
            
            // Show a success message
            alert('Thank you for subscribing to our newsletter!');
        });
    }
});

// Sales Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const salesForm = document.getElementById('salesForm');
    
    if (salesForm) {
        salesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server endpoint
            // For now, we'll simulate a successful submission
            
            // Create a mailto link with the form data
            const subject = `Sales Inquiry from ${name} at ${company}`;
            const body = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nMessage:\n${message}`;
            const mailtoLink = `mailto:babu@leelaanalytics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open the email client
            window.location.href = mailtoLink;
            
            // Reset the form
            salesForm.reset();
            
            // Show a success message
            alert('Thank you for your inquiry! Your email client should open shortly.');
        });
    }
});

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

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && !event.target.closest('.menu-toggle') && navMenu && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    });
});

// Initialize all functions when DOM is loaded
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

    // Initialize Three.js if canvas container exists
    if (document.querySelector('#canvas-container')) {
        initThreeJS();
        createNetworkLines();
    }
    
    // Setup LLM ticker
    if (document.querySelector('.ticker-track')) {
        setupLLMTicker();
    }
    
    // Setup LLM horizontal scrolling
    if (document.querySelector('.llm-cards-container')) {
        setupLLMScroll();
    }
    
    // Setup blog scroll
    if (document.querySelector('.horizontal-scroll-section')) {
        setupBlogScroll();
    }
});
