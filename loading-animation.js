// Loading Animation for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    // Create the loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    // Create the loading content container
    const loadingContent = document.createElement('div');
    loadingContent.className = 'loading-content';
    
    // Create SVG animation container
    const svgContainer = document.createElement('div');
    svgContainer.className = 'svg-animation-container';
    
    // Determine the correct base URL
    const baseUrl = window.location.hostname.includes('www.') ? 
        'https://www.leelaanalytics.com' : 
        window.location.origin;
    
    // Try multiple paths for the SVG to handle redirects and different domain formats
    const svgPaths = [
        '/leela-animation.svg',
        'leela-animation.svg',
        `${baseUrl}/leela-animation.svg`,
        'https://www.leelaanalytics.com/leela-animation.svg',
        'https://leelaanalytics.com/leela-animation.svg'
    ];
    
    // Function to try loading SVG from different paths
    function tryLoadSvg(pathIndex) {
        if (pathIndex >= svgPaths.length) {
            console.error('Failed to load SVG from all paths');
            createFallbackLogo();
            startProgressBar();
            return;
        }
        
        console.log('Trying to load SVG from:', svgPaths[pathIndex]);
        
        fetch(svgPaths[pathIndex])
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(svgContent => {
                console.log('SVG loaded successfully from:', svgPaths[pathIndex]);
                svgContainer.innerHTML = svgContent;
                
                // Add animation complete event listener
                setTimeout(() => {
                    // Animation is complete, proceed with page load
                    startProgressBar();
                }, 2000); // Wait for SVG animation to complete
            })
            .catch(error => {
                console.error('Error loading SVG from ' + svgPaths[pathIndex] + ':', error);
                // Try the next path
                tryLoadSvg(pathIndex + 1);
            });
    }
    
    // Start trying to load the SVG
    tryLoadSvg(0);
    
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
    
    // Fallback logo creation function
    function createFallbackLogo() {
        const logoElement = document.createElement('div');
        logoElement.className = 'loading-logo';
        logoElement.innerHTML = '<span>L</span>';
        
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.innerHTML = '<h2>Leela Analytics</h2><p>Customizing LLMs for Vertical AI Solutions</p>';
        
        svgContainer.appendChild(logoElement);
        svgContainer.appendChild(loadingText);
    }
    
    // Function to animate the progress bar
    function startProgressBar() {
        let width = 0;
        const interval = setInterval(function() {
            if (width >= 100) {
                clearInterval(interval);
                
                // Add fade-out class
                loadingOverlay.classList.add('fade-out');
                
                // Remove the overlay after animation completes
                setTimeout(function() {
                    if (loadingOverlay.parentNode) {
                        loadingOverlay.parentNode.removeChild(loadingOverlay);
                    }
                    // Reveal the main content with a fade-in effect
                    document.body.classList.add('content-visible');
                }, 500);
            } else {
                width += Math.random() * 3;
                if (width > 100) width = 100;
                progressBar.style.width = width + '%';
            }
        }, 50);
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
    }, 15000); // Increased to 15 seconds
});
