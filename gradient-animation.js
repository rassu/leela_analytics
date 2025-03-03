// Gradient Animation Background for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Gradient animation initialized');
    
    // Get the hero sections (both main hero and about-hero)
    const heroSections = document.querySelectorAll('.hero, .about-hero');
    if (heroSections.length === 0) {
        console.error('No hero sections found');
        return;
    }
    
    // Apply gradient background to each hero section
    heroSections.forEach(heroSection => {
        // Create the gradient background container
        const gradientBg = document.createElement('div');
        gradientBg.className = 'gradient-bg';
        
        // Create multiple gradient orbs
        for (let i = 0; i < 6; i++) {
            const orb = document.createElement('div');
            orb.className = 'gradient-orb';
            
            // Randomize position and size - make orbs larger
            const size = Math.random() * 40 + 30; // 30-70% of viewport width
            const posX = Math.random() * 80 + 10; // 10-90% of container width
            const posY = Math.random() * 80 + 10; // 10-90% of container height
            
            // Set styles
            orb.style.width = `${size}vw`;
            orb.style.height = `${size}vw`;
            orb.style.left = `${posX}%`;
            orb.style.top = `${posY}%`;
            
            // Add animation delay
            orb.style.animationDelay = `${i * 0.5}s`;
            
            // Add to container
            gradientBg.appendChild(orb);
        }
        
        // Insert gradient background as first child of hero section
        heroSection.insertBefore(gradientBg, heroSection.firstChild);
        
        // Add floating particles
        addFloatingParticles(heroSection);
    });
});

function addFloatingParticles(container) {
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    
    // Create particles - increase count
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Randomize position, size and opacity
        const size = Math.random() * 12 + 3; // 3-15px
        const posX = Math.random() * 100; // 0-100% of container width
        const posY = Math.random() * 100; // 0-100% of container height
        const opacity = Math.random() * 0.6 + 0.2; // 0.2-0.8
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        
        // Set animation duration and delay
        const duration = Math.random() * 20 + 10; // 10-30s
        const delay = Math.random() * 5; // 0-5s
        
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        // Add to container
        particlesContainer.appendChild(particle);
    }
    
    // Insert particles container after gradient background
    container.insertBefore(particlesContainer, container.firstChild.nextSibling);
}
