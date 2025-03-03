// Loading Animation for Leela Analytics with Arrow Design
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
    
    // Embedded SVG animation with arrow design
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" width="500" height="150">
        <defs>
            <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="shaftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#a78bfa;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <style>
            .letter { fill: none; stroke: url(#arrowGradient); stroke-width: 2.5; }
            .arrow { fill: none; stroke: url(#arrowGradient); stroke-width: 2.5; }
            .arrow-shaft { fill: url(#shaftGradient); }
            .arrow-head { fill: url(#arrowGradient); }
            .arrow-feather { fill: url(#arrowGradient); }
            .arrow-nock { fill: url(#arrowGradient); }
            .analytics-text { font-family: Arial, sans-serif; font-size: 14px; fill: #6366f1; font-weight: bold; }
            
            @keyframes drawLetter {
                0% { stroke-dashoffset: 200; }
                100% { stroke-dashoffset: 0; }
            }
            
            @keyframes drawArrow {
                0% { stroke-dashoffset: 1000; }
                100% { stroke-dashoffset: 0; }
            }
            
            @keyframes fillArrowHead {
                0% { opacity: 0; transform: scale(0.8) translateX(-10px); }
                70% { opacity: 0; transform: scale(0.8) translateX(-10px); }
                100% { opacity: 1; transform: scale(1) translateX(0); }
            }
            
            @keyframes fillFeathers {
                0% { opacity: 0; transform: translateX(10px); }
                50% { opacity: 0; transform: translateX(10px); }
                100% { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes fillNock {
                0% { opacity: 0; }
                30% { opacity: 0; }
                100% { opacity: 1; }
            }
            
            @keyframes fadeInAnalytics {
                0% { opacity: 0; }
                80% { opacity: 0; }
                100% { opacity: 1; }
            }
            
            @keyframes pulse {
                0% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.5)); }
                50% { filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.8)); }
                100% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.5)); }
            }
            
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-8px); }
                100% { transform: translateY(0px); }
            }
            
            @keyframes glow {
                0% { filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.7)); }
                50% { filter: drop-shadow(0 0 15px rgba(99, 102, 241, 1)); }
                100% { filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.7)); }
            }
            
            @keyframes rotate {
                0% { transform: rotate(0deg); }
                25% { transform: rotate(2deg); }
                75% { transform: rotate(-2deg); }
                100% { transform: rotate(0deg); }
            }
            
            @keyframes flicker {
                0% { opacity: 0.9; }
                25% { opacity: 1; }
                50% { opacity: 0.9; }
                75% { opacity: 1; }
                100% { opacity: 0.9; }
            }
            
            @keyframes shaftShine {
                0% { opacity: 0; transform: translateX(-340px); }
                50% { opacity: 0.7; }
                100% { opacity: 0; transform: translateX(340px); }
            }
            
            .arrow-line {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: drawArrow 1.5s ease forwards;
            }
            
            .arrow-shaft-rect {
                opacity: 0;
                animation: fillFeathers 1.8s ease forwards;
            }
            
            .arrow-shaft-shine {
                opacity: 0;
                animation: shaftShine 3s ease-in-out 2s infinite;
            }
            
            .arrow-head-shape {
                opacity: 0;
                animation: fillArrowHead 2s ease forwards, glow 3s ease-in-out 2s infinite;
                transform-origin: center;
            }
            
            .arrow-feather-shape {
                opacity: 0;
                animation: fillFeathers 2.5s ease forwards, rotate 8s ease-in-out 3s infinite;
                transform-origin: 80px 75px;
            }
            
            .arrow-nock-shape {
                opacity: 0;
                animation: fillNock 2s ease forwards, flicker 4s ease-in-out 3s infinite;
            }
            
            .l1 {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: drawLetter 0.8s ease 0.2s forwards;
            }
            
            .e1 {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: drawLetter 0.8s ease 0.4s forwards;
            }
            
            .e2 {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: drawLetter 0.8s ease 0.6s forwards;
            }
            
            .l2 {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: drawLetter 0.8s ease 0.8s forwards;
            }
            
            .a1 {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: drawLetter 0.8s ease 1s forwards;
            }
            
            .analytics-text {
                opacity: 0;
                animation: fadeInAnalytics 2s ease forwards;
            }
            
            .logo-group {
                animation: pulse 3s ease-in-out 2s infinite, float 6s ease-in-out infinite;
            }
        </style>
        
        <g class="logo-group">
            <!-- Arrow Shaft Line (thin line for animation) -->
            <path class="arrow arrow-line" d="M80,75 L420,75" filter="url(#glow)" />
            
            <!-- Arrow Shaft (thicker rectangle) -->
            <rect class="arrow-shaft arrow-shaft-rect" x="80" y="72" width="340" height="6" rx="3" filter="url(#glow)" />
            
            <!-- Arrow Shaft Shine Effect -->
            <rect class="arrow-shaft-shine" x="80" y="72" width="60" height="6" rx="3" fill="rgba(255,255,255,0.7)" filter="url(#glow)" />
            
            <!-- Arrow Head (Bullet Point) -->
            <path class="arrow-head arrow-head-shape" d="M420,75 L390,60 L405,75 L390,90 Z" filter="url(#glow)" />
            
            <!-- Arrow Fletching (Feathers) -->
            <g class="arrow-feather-shape">
                <!-- Index Fletching (Top) -->
                <path class="arrow-feather" d="M110,75 L95,55 C90,50 85,55 80,55 L80,75" fill="#6366f1" stroke="#6366f1" stroke-width="0.5" filter="url(#glow)" />
                
                <!-- Hen Fletching (Bottom) -->
                <path class="arrow-feather" d="M110,75 L95,95 C90,100 85,95 80,95 L80,75" fill="#6366f1" stroke="#6366f1" stroke-width="0.5" filter="url(#glow)" />
                
                <!-- Cock Fletching (Side) -->
                <path class="arrow-feather" d="M95,75 L75,75 C70,80 70,70 65,75 L80,75" fill="#8b5cf6" stroke="#6366f1" stroke-width="0.5" filter="url(#glow)" />
            </g>
            
            <!-- Arrow Nock (End) -->
            <g class="arrow-nock-shape">
                <circle cx="80" cy="75" r="8" fill="#6366f1" />
                <circle cx="80" cy="75" r="4" fill="white" />
                <circle cx="80" cy="75" r="2" fill="#6366f1" />
            </g>
            
            <!-- L -->
            <path class="letter l1" d="M140,55 L140,95 L160,95" />
            
            <!-- E -->
            <path class="letter e1" d="M180,55 L180,95 L200,95 M180,75 L195,75 M180,55 L200,55" />
            
            <!-- E -->
            <path class="letter e2" d="M220,55 L220,95 L240,95 M220,75 L235,75 M220,55 L240,55" />
            
            <!-- L -->
            <path class="letter l2" d="M260,55 L260,95 L280,95" />
            
            <!-- A -->
            <path class="letter a1" d="M300,95 L315,55 L330,95 M307,80 L323,80" />
            
            <!-- ANALYTICS text -->
            <text class="analytics-text" x="250" y="115" text-anchor="middle">ANALYTICS</text>
        </g>
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
    
    // Track loading progress
    let loadedResources = 0;
    let totalResources = 0;
    
    // Count total resources to load
    function countResources() {
        // Count images, scripts, stylesheets, and other resources
        const images = document.querySelectorAll('img');
        const scripts = document.querySelectorAll('script[src]');
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        const iframes = document.querySelectorAll('iframe');
        
        return images.length + scripts.length + links.length + iframes.length;
    }
    
    // Update progress bar based on loaded resources
    function updateProgress() {
        if (totalResources === 0) {
            totalResources = countResources() || 1; // Ensure at least 1 to avoid division by zero
        }
        
        loadedResources++;
        const percentage = Math.min((loadedResources / totalResources) * 100, 100);
        progressBar.style.width = percentage + '%';
        
        // If all resources are loaded, remove the overlay
        if (loadedResources >= totalResources) {
            completeLoading();
        }
    }
    
    // Function to handle resource load events
    function resourceLoaded() {
        updateProgress();
    }
    
    // Listen for resource load events
    window.addEventListener('load', function() {
        // When window.load fires, we know the initial page is loaded
        // but there might be dynamic content still loading
        updateProgress();
        
        // Give a small delay to allow any final resources to complete
        setTimeout(function() {
            completeLoading();
        }, 500);
    });
    
    // Function to complete the loading process
    function completeLoading() {
        loadingOverlay.classList.add('fade-out');
        setTimeout(function() {
            if (document.body.contains(loadingOverlay)) {
                document.body.removeChild(loadingOverlay);
                document.body.classList.add('content-visible');
                console.log('Loading animation removed, content now visible');
            }
        }, 500); // Wait for fade-out animation to complete
    }
    
    // Add listeners for resource loading
    document.querySelectorAll('img, script[src], link[rel="stylesheet"], iframe').forEach(function(element) {
        if (element.complete || element.readyState === 'complete') {
            // Already loaded
            resourceLoaded();
        } else {
            // Wait for load
            element.addEventListener('load', resourceLoaded);
            element.addEventListener('error', resourceLoaded); // Count errors as "loaded" to avoid hanging
        }
    });
    
    // If the page takes too long to load, force remove the overlay after 8 seconds
    setTimeout(function() {
        if (document.body.contains(loadingOverlay)) {
            console.log('Loading timeout reached, forcing completion');
            completeLoading();
        }
    }, 8000);
});
