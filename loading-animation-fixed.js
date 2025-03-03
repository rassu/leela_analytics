// Loading Animation for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading animation script initialized');
    
    // Set body to visible immediately to prevent white screen
    document.body.style.opacity = "1";
    
    // Create the loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    // Create the loading content container
    const loadingContent = document.createElement('div');
    loadingContent.className = 'loading-content';
    
    // Create SVG animation container
    const svgContainer = document.createElement('div');
    svgContainer.className = 'svg-animation-container';
    
    // Embedded SVG animation - no need to load external file
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
        <style>
            .letter { fill: none; stroke: #6366f1; stroke-width: 2; }
            @keyframes draw {
                to { stroke-dashoffset: 0; }
            }
            @keyframes fill {
                to { fill: #6366f1; }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes pulse {
                0% { filter: drop-shadow(0 0 2px #6366f1); }
                50% { filter: drop-shadow(0 0 8px #6366f1); }
                100% { filter: drop-shadow(0 0 2px #6366f1); }
            }
            .analytics-text {
                font-family: Arial, sans-serif;
                font-size: 12px;
                fill: #6366f1;
                opacity: 0;
                animation: fadeIn 0.5s ease 1.5s forwards;
            }
            .letter-group {
                animation: pulse 2s ease-in-out 1.8s infinite;
            }
        </style>
        <g class="letter-group">
            <!-- L -->
            <path class="letter" d="M10,20 L10,80 L40,80" 
                  style="stroke-dasharray: 130; stroke-dashoffset: 130; animation: draw 0.5s ease forwards, fill 0.3s ease 0.5s forwards;"></path>
            <!-- E -->
            <path class="letter" d="M60,20 L60,80 L90,80 M60,50 L85,50 M60,20 L90,20" 
                  style="stroke-dasharray: 170; stroke-dashoffset: 170; animation: draw 0.5s ease 0.2s forwards, fill 0.3s ease 0.7s forwards;"></path>
            <!-- E -->
            <path class="letter" d="M110,20 L110,80 L140,80 M110,50 L135,50 M110,20 L140,20" 
                  style="stroke-dasharray: 170; stroke-dashoffset: 170; animation: draw 0.5s ease 0.4s forwards, fill 0.3s ease 0.9s forwards;"></path>
            <!-- L -->
            <path class="letter" d="M160,20 L160,80 L190,80" 
                  style="stroke-dasharray: 130; stroke-dashoffset: 130; animation: draw 0.5s ease 0.6s forwards, fill 0.3s ease 1.1s forwards;"></path>
            <!-- A -->
            <path class="letter" d="M210,80 L225,20 L240,80 M215,60 L235,60" 
                  style="stroke-dasharray: 140; stroke-dashoffset: 140; animation: draw 0.5s ease 0.8s forwards, fill 0.3s ease 1.3s forwards;"></path>
        </g>
        <text class="analytics-text" x="150" y="95" text-anchor="middle">ANALYTICS</text>
    </svg>`;
    
    // Set the SVG content
    svgContainer.innerHTML = svgContent;
    console.log('Embedded SVG animation added to container');
    
    // Create loading progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'loading-progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress-bar';
    
    // Assemble the loading elements
    progressContainer.appendChild(progressBar);
    loadingContent.appendChild(svgContainer);
    loadingContent.appendChild(progressContainer);
    loadingOverlay.appendChild(loadingContent);
    
    // Add to body as the first child
    document.body.insertBefore(loadingOverlay, document.body.firstChild);
    
    // Start progress bar after SVG animation completes
    setTimeout(() => {
        startProgressBar();
    }, 2000);
    
    // Fallback logo creation function (not used with embedded SVG)
    function createFallbackLogo() {
        const fallbackLogo = document.createElement('div');
        fallbackLogo.className = 'fallback-logo';
        fallbackLogo.innerHTML = '<h1>LEELA</h1><p>ANALYTICS</p>';
        svgContainer.appendChild(fallbackLogo);
    }
    
    // Function to animate the progress bar
    function startProgressBar() {
        console.log('Starting progress bar animation');
        let width = 0;
        const maxWidth = 100;
        const duration = 3000; // 3 seconds
        const interval = 50; // Update every 50ms
        const increment = (maxWidth / duration) * interval;
        
        const progressInterval = setInterval(function() {
            if (width >= maxWidth) {
                clearInterval(progressInterval);
                loadingOverlay.classList.add('fade-out');
                setTimeout(function() {
                    if (document.body.contains(loadingOverlay)) {
                        document.body.removeChild(loadingOverlay);
                    }
                    // Add content-visible class to body to show the main content
                    document.body.classList.add('content-visible');
                    
                    // Trigger a window resize event to ensure Three.js initializes properly
                    const resizeEvent = new Event('resize');
                    window.dispatchEvent(resizeEvent);
                }, 500);
            } else {
                width += increment;
                progressBar.style.width = width + '%';
            }
        }, interval);
    }
    
    // If the page takes too long to load, force remove the overlay after 15 seconds
    setTimeout(function() {
        if (document.body.contains(loadingOverlay)) {
            loadingOverlay.classList.add('fade-out');
            setTimeout(function() {
                if (document.body.contains(loadingOverlay)) {
                    document.body.removeChild(loadingOverlay);
                }
                // Add content-visible class to body to show the main content
                document.body.classList.add('content-visible');
                
                // Trigger a window resize event to ensure Three.js initializes properly
                const resizeEvent = new Event('resize');
                window.dispatchEvent(resizeEvent);
            }, 500);
        }
    }, 15000); // 15 seconds
});
