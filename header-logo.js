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
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 60" width="180" height="40">
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
            </defs>
            <style>
                .header-letter { fill: none; stroke: url(#headerArrowGradient); stroke-width: 3; }
                .header-arrow { fill: none; stroke: url(#headerArrowGradient); stroke-width: 2.5; }
                .header-arrow-shaft { fill: url(#headerShaftGradient); }
                .header-arrow-head { fill: url(#headerArrowGradient); }
                .header-arrow-feather { fill: url(#headerArrowGradient); }
                .header-arrow-nock { fill: url(#headerArrowGradient); }
                .header-analytics-text { font-family: Arial, sans-serif; font-size: 10px; fill: #6366f1; font-weight: bold; }
                
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
                
                .header-arrow-shaft-shine {
                    opacity: 0;
                    animation: headerShaftShine 3s ease-in-out infinite;
                }
                
                .header-logo-group {
                    animation: headerPulse 4s ease-in-out infinite;
                }
                
                .header-logo-link:hover .header-logo-group {
                    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.9));
                    transition: filter 0.3s ease;
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
                
                <!-- ANALYTICS text -->
                <text class="header-analytics-text" x="125" y="53" text-anchor="middle" filter="url(#headerGlow)">ANALYTICS</text>
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
