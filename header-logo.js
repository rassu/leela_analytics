// Header Logo Animation for Leela Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header logo animation script initialized');
    
    // Find all logo containers in the header
    const logoContainers = document.querySelectorAll('header .logo');
    
    if (logoContainers.length === 0) {
        console.error('No logo container found in header');
        return;
    }
    
    logoContainers.forEach(logoContainer => {
        // Clear existing content
        logoContainer.innerHTML = '';
        
        // Create a link to the home page
        const homeLink = document.createElement('a');
        homeLink.href = 'index.html';
        homeLink.className = 'header-logo-link';
        
        // Create SVG container
        const svgContainer = document.createElement('div');
        svgContainer.className = 'header-logo-svg';
        
        // Embedded SVG animation with arrow design - simplified version of loading animation
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 80" width="320" height="60">
            <defs>
                <linearGradient id="headerArrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="headerShaftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#a78bfa;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                </linearGradient>
                <filter id="headerGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="strongGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <filter id="subtleBlur">
                    <feGaussianBlur stdDeviation="1" result="blur"/>
                    <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <clipPath id="dataStreamClip">
                    <rect x="50" y="58" width="250" height="15" rx="7.5" />
                </clipPath>
                <pattern id="analyticsMesh" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <rect width="10" height="10" fill="none"/>
                    <circle cx="5" cy="5" r="0.5" fill="#6366f1" opacity="0.3"/>
                    <line x1="0" y1="5" x2="10" y2="5" stroke="#6366f1" stroke-width="0.2" opacity="0.15"/>
                    <line x1="5" y1="0" x2="5" y2="10" stroke="#6366f1" stroke-width="0.2" opacity="0.15"/>
                </pattern>
                <mask id="analyticsMask">
                    <rect x="0" y="0" width="300" height="80" fill="white"/>
                    <text x="150" y="58" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" letter-spacing="2" fill="black">ANALYTICS</text>
                </mask>
            </defs>
            <style>
                .header-letter { fill: none; stroke: url(#headerArrowGradient); stroke-width: 3; }
                .header-arrow { fill: none; stroke: url(#headerArrowGradient); stroke-width: 2.5; }
                .header-arrow-shaft { fill: url(#headerShaftGradient); }
                .header-arrow-head { fill: url(#headerArrowGradient); }
                .header-arrow-feather { fill: url(#headerArrowGradient); }
                .header-arrow-nock { fill: url(#headerArrowGradient); }
                .analytics-text-small { font-family: Arial, sans-serif; font-size: 12px; fill: #6366f1; font-weight: bold; letter-spacing: 1px; opacity: 0.9; }
                
                @keyframes headerShaftShine {
                    0% { opacity: 0; transform: translateX(-170px); }
                    50% { opacity: 0.7; }
                    100% { opacity: 0; transform: translateX(170px); }
                }
                
                @keyframes headerPulse {
                    0% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.5)); }
                    50% { filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.8)); }
                    100% { filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.5)); }
                }
                
                @keyframes dataFlow {
                    0% { transform: translateX(-300px); }
                    100% { transform: translateX(300px); }
                }
                
                @keyframes dataNodePulse {
                    0%, 100% { r: 1.2; opacity: 0.6; }
                    50% { r: 1.8; opacity: 0.9; }
                }
                
                @keyframes dataNodeTravel {
                    0% { offset-distance: 0%; }
                    100% { offset-distance: 100%; }
                }
                
                @keyframes meshFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-1px); }
                }
                
                .header-arrow-shaft-shine {
                    opacity: 0;
                    animation: headerShaftShine 3s ease-in-out infinite;
                }
                
                .header-logo-group {
                    animation: headerPulse 4s ease-in-out infinite;
                }
                
                .data-stream {
                    animation: dataFlow 15s linear infinite;
                }
                
                .data-node {
                    offset-path: path('M50,65 C100,60 150,70 200,65 S250,60 300,65');
                }
                
                .data-node-1 {
                    animation: dataNodeTravel 12s linear infinite, dataNodePulse 3s ease-in-out infinite;
                }
                
                .data-node-2 {
                    animation: dataNodeTravel 15s linear infinite, dataNodePulse 4s ease-in-out infinite;
                    animation-delay: -3s, -1s;
                }
                
                .data-node-3 {
                    animation: dataNodeTravel 10s linear infinite, dataNodePulse 2.5s ease-in-out infinite;
                    animation-delay: -6s, -2s;
                }
                
                .data-node-4 {
                    animation: dataNodeTravel 18s linear infinite, dataNodePulse 3.5s ease-in-out infinite;
                    animation-delay: -9s, -1.5s;
                }
                
                .data-node-5 {
                    animation: dataNodeTravel 14s linear infinite, dataNodePulse 3s ease-in-out infinite;
                    animation-delay: -4.5s, -0.5s;
                }
                
                .data-stream-bg {
                    opacity: 0.1;
                }
                
                .analytics-mesh {
                    animation: meshFloat 5s ease-in-out infinite;
                }
                
                .header-logo-link:hover .header-logo-group {
                    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.9));
                    transition: filter 0.3s ease;
                }
                
                .header-logo-link:hover .data-node-1,
                .header-logo-link:hover .data-node-2,
                .header-logo-link:hover .data-node-3,
                .header-logo-link:hover .data-node-4,
                .header-logo-link:hover .data-node-5 {
                    animation-duration: 8s, 1.5s;
                }
                
                .header-logo-link:hover .analytics-mesh {
                    filter: brightness(1.2);
                    transition: filter 0.3s ease;
                }
                
                @keyframes navDotPulse {
                    0%, 100% { opacity: 0.05; }
                    50% { opacity: 0.2; }
                }
                
                .nav-dot {
                    animation: navDotPulse 3s ease-in-out infinite;
                }
                
                .nav-dot-1 {
                    animation-delay: 0s;
                }
                
                .nav-dot-2 {
                    animation-delay: 0.5s;
                }
                
                .nav-dot-3 {
                    animation-delay: 1s;
                }
                
                .nav-dot-4 {
                    animation-delay: 1.5s;
                }
            </style>
            
            <g class="header-logo-group">
                <!-- Arrow Shaft -->
                <rect class="header-arrow-shaft" x="40" y="30" width="170" height="4" rx="2" filter="url(#strongGlow)" />
                
                <!-- Arrow Shaft Shine Effect -->
                <rect class="header-arrow-shaft-shine" x="40" y="30" width="30" height="4" rx="2" fill="rgba(255,255,255,0.8)" filter="url(#headerGlow)" />
                
                <!-- Arrow Head (Bullet Point) -->
                <path class="header-arrow-head" d="M210,31.5 L195,22 L202.5,31.5 L195,41 Z" filter="url(#strongGlow)" />
                
                <!-- Arrow Fletching (Feathers) - Simplified -->
                <g class="header-arrow-feather">
                    <path d="M55,31.5 L47.5,21.5 C45,19 42.5,21.5 40,21.5 L40,31.5" fill="#6366f1" filter="url(#headerGlow)" />
                    <path d="M55,31.5 L47.5,41.5 C45,44 42.5,41.5 40,41.5 L40,31.5" fill="#6366f1" filter="url(#headerGlow)" />
                    <path d="M47.5,31.5 L37.5,31.5 C35,34 35,29 32.5,31.5 L40,31.5" fill="#8b5cf6" filter="url(#headerGlow)" />
                </g>
                
                <!-- Arrow Nock (End) -->
                <g class="header-arrow-nock">
                    <circle cx="40" cy="31.5" r="4" fill="#6366f1" />
                    <circle cx="40" cy="31.5" r="2" fill="white" />
                    <circle cx="40" cy="31.5" r="1" fill="#6366f1" />
                </g>
                
                <!-- L -->
                <path class="header-letter" d="M70,20 L70,43 L80,43" />
                
                <!-- E -->
                <path class="header-letter" d="M90,20 L90,43 L100,43 M90,31.5 L97.5,31.5 M90,20 L100,20" />
                
                <!-- E -->
                <path class="header-letter" d="M110,20 L110,43 L120,43 M110,31.5 L117.5,31.5 M110,20 L120,20" />
                
                <!-- L -->
                <path class="header-letter" d="M130,20 L130,43 L140,43" />
                
                <!-- A -->
                <path class="header-letter" d="M150,43 L157.5,20 L165,43 M153.5,35 L161.5,35" />
                
                <!-- ANALYTICS as mesh background -->
                <g class="analytics-mesh">
                    <!-- Mesh background with ANALYTICS text as mask -->
                    <rect x="40" y="40" width="220" height="30" fill="url(#analyticsMesh)" mask="url(#analyticsMask)" filter="url(#subtleBlur)" />
                    
                    <!-- Small ANALYTICS text for better visibility -->
                    <text class="analytics-text-small" x="125" y="53" text-anchor="middle" filter="url(#headerGlow)">ANALYTICS</text>
                </g>
                
                <!-- Data Stream Background -->
                <rect class="data-stream-bg" x="50" y="58" width="250" height="15" rx="7.5" fill="#6366f1" opacity="0.05" />
                
                <!-- Data Stream Path -->
                <g clip-path="url(#dataStreamClip)">
                    <path class="data-stream" d="M50,65 L300,65" stroke="#6366f1" stroke-width="1" stroke-dasharray="4 2" opacity="0.2" />
                    
                    <!-- Data Nodes -->
                    <circle class="data-node data-node-1" cx="0" cy="0" r="1.5" fill="#6366f1" />
                    <circle class="data-node data-node-2" cx="0" cy="0" r="1.5" fill="#8b5cf6" />
                    <circle class="data-node data-node-3" cx="0" cy="0" r="1.5" fill="#a78bfa" />
                    <circle class="data-node data-node-4" cx="0" cy="0" r="1.5" fill="#6366f1" />
                    <circle class="data-node data-node-5" cx="0" cy="0" r="1.5" fill="#8b5cf6" />
                </g>
                
                <!-- Extended connection to navigation -->
                <path class="nav-connection" d="M300,65 C320,65 330,50 350,50 S380,45 400,45" stroke="#6366f1" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.1" />
                <circle class="nav-dot nav-dot-1" cx="320" cy="60" r="0.8" fill="#6366f1" opacity="0.15" />
                <circle class="nav-dot nav-dot-2" cx="340" cy="53" r="0.6" fill="#6366f1" opacity="0.12" />
                <circle class="nav-dot nav-dot-3" cx="360" cy="48" r="0.5" fill="#6366f1" opacity="0.1" />
                <circle class="nav-dot nav-dot-4" cx="380" cy="45" r="0.4" fill="#6366f1" opacity="0.08" />
            </g>
        </svg>`;
        
        // Set the SVG content
        svgContainer.innerHTML = svgContent;
        
        // Append SVG container to the link
        homeLink.appendChild(svgContainer);
        
        // Append link to logo container
        logoContainer.appendChild(homeLink);
        
        console.log('Header logo animation added');
    });
});
