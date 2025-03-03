// Loading Animation for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading animation script initialized');
    
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
            <path class="letter" d="M10,20 L10,80 L40,80 C55,80 70,65 70,50 C70,35 55,20 40,20 L10,20" 
                  style="stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 0.5s ease forwards, fill 0.3s ease 0.5s forwards;"></path>
            <path class="letter" d="M80,20 L80,80 L110,80" 
                  style="stroke-dasharray: 90; stroke-dashoffset: 90; animation: draw 0.5s ease 0.2s forwards, fill 0.3s ease 0.7s forwards;"></path>
            <path class="letter" d="M120,20 L120,80 L150,80" 
                  style="stroke-dasharray: 90; stroke-dashoffset: 90; animation: draw 0.5s ease 0.4s forwards, fill 0.3s ease 0.9s forwards;"></path>
            <path class="letter" d="M160,20 L160,80 L190,80 C205,80 220,65 220,50 C220,35 205,20 190,20 L160,20" 
                  style="stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 0.5s ease 0.6s forwards, fill 0.3s ease 1.1s forwards;"></path>
            <path class="letter" d="M230,20 L230,80 L260,80 C275,80 290,65 290,50 C290,35 275,20 260,20 L230,20" 
                  style="stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 0.5s ease 0.8s forwards, fill 0.3s ease 1.3s forwards;"></path>
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
            }, 500);
        }
    }, 15000); // 15 seconds
});
