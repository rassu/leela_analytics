// Loading Animation for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    // Create the loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    
    // Create the loading content container
    const loadingContent = document.createElement('div');
    loadingContent.className = 'loading-content';
    
    // Create logo element
    const logoElement = document.createElement('div');
    logoElement.className = 'loading-logo';
    logoElement.innerHTML = '<span>L</span>';
    
    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.className = 'loading-text';
    loadingText.innerHTML = '<h2>Leela Analytics</h2><p>Customizing LLMs for Vertical AI Solutions</p>';
    
    // Create loading progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'loading-progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress-bar';
    
    // Assemble the loading elements
    progressContainer.appendChild(progressBar);
    loadingContent.appendChild(logoElement);
    loadingContent.appendChild(loadingText);
    loadingContent.appendChild(progressContainer);
    loadingOverlay.appendChild(loadingContent);
    
    // Add to body as the first child
    document.body.insertBefore(loadingOverlay, document.body.firstChild);
    
    // Function to animate the progress bar
    function animateProgress() {
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
    
    // Start animating after a short delay
    setTimeout(animateProgress, 300);
    
    // If the page takes too long to load, force remove the overlay after 5 seconds
    setTimeout(function() {
        if (document.body.contains(loadingOverlay)) {
            loadingOverlay.classList.add('fade-out');
            setTimeout(function() {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
                document.body.classList.add('content-visible');
            }, 500);
        }
    }, 5000);
});
