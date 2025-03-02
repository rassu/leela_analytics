// Global Team Map Visualization
document.addEventListener('DOMContentLoaded', function() {
    initGlobalMap();
});

function initGlobalMap() {
    const mapContainer = document.getElementById('world-map');
    if (!mapContainer) return;
    
    console.log('Initializing global team map');
    
    // Set up SVG
    const width = mapContainer.clientWidth;
    const height = mapContainer.clientHeight;
    
    // Create SVG element
    const svg = d3.select('#world-map')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create a group for the map
    const g = svg.append('g');
    
    // Define map projection - using a simple Mercator projection
    const projection = d3.geoMercator()
        .scale((width) / 2 / Math.PI)
        .translate([width / 2, height / 1.5]);
    
    // Define path generator
    const path = d3.geoPath()
        .projection(projection);
    
    // Load world map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(function(world) {
            // Convert TopoJSON to GeoJSON
            const countries = topojson.feature(world, world.objects.countries).features;
            
            // Draw countries
            g.selectAll('path')
                .data(countries)
                .enter()
                .append('path')
                .attr('d', path)
                .attr('class', 'country-path')
                .attr('id', d => `country-${d.id}`);
            
            // Add markers for team locations
            const teamLocations = [
                {
                    name: 'United States',
                    id: 'us',
                    coordinates: [-95.7129, 37.0902], // Center of US
                    radius: 8
                },
                {
                    name: 'India',
                    id: 'india',
                    coordinates: [78.9629, 20.5937], // Center of India
                    radius: 8
                },
                {
                    name: 'Thailand',
                    id: 'thailand',
                    coordinates: [100.9925, 15.8700], // Center of Thailand
                    radius: 8
                }
            ];
            
            // Add markers
            g.selectAll('circle')
                .data(teamLocations)
                .enter()
                .append('circle')
                .attr('cx', d => projection(d.coordinates)[0])
                .attr('cy', d => projection(d.coordinates)[1])
                .attr('r', d => d.radius)
                .attr('class', 'map-marker')
                .attr('id', d => `marker-${d.id}`)
                .attr('fill', '#6366f1')
                .attr('stroke', '#ffffff')
                .attr('stroke-width', 2)
                .attr('opacity', 0.8)
                .on('mouseover', function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', d.radius * 1.3)
                        .attr('opacity', 1);
                })
                .on('mouseout', function(event, d) {
                    if (!d3.select(this).classed('active')) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr('r', d.radius)
                            .attr('opacity', 0.8);
                    }
                })
                .on('click', function(event, d) {
                    // Reset all markers and country paths
                    d3.selectAll('.map-marker')
                        .classed('active', false)
                        .transition()
                        .duration(200)
                        .attr('r', loc => loc.radius)
                        .attr('opacity', 0.8);
                    
                    d3.selectAll('.country-path')
                        .classed('active', false);
                    
                    // Hide all info panels
                    document.querySelectorAll('.map-country-info').forEach(el => {
                        el.style.display = 'none';
                    });
                    
                    // Activate clicked marker
                    d3.select(this)
                        .classed('active', true)
                        .transition()
                        .duration(200)
                        .attr('r', d.radius * 1.3)
                        .attr('opacity', 1);
                    
                    // Show corresponding info panel
                    const infoPanel = document.getElementById(`${d.id}-info`);
                    if (infoPanel) {
                        infoPanel.style.display = 'block';
                    }
                    
                    // Highlight corresponding country
                    const countryId = getCountryIdForTeam(d.id);
                    if (countryId) {
                        d3.select(`#country-${countryId}`)
                            .classed('active', true);
                    }
                });
            
            // Add country labels
            g.selectAll('text')
                .data(teamLocations)
                .enter()
                .append('text')
                .attr('x', d => projection(d.coordinates)[0])
                .attr('y', d => projection(d.coordinates)[1] - d.radius - 5)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .attr('fill', '#333')
                .text(d => d.name);
            
            // Add zoom and pan functionality
            const zoom = d3.zoom()
                .scaleExtent([1, 8])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                    
                    // Adjust marker size based on zoom level
                    g.selectAll('.map-marker')
                        .attr('r', d => d.radius / Math.sqrt(event.transform.k))
                        .attr('stroke-width', 2 / Math.sqrt(event.transform.k));
                    
                    // Adjust text size based on zoom level
                    g.selectAll('text')
                        .attr('font-size', `${10 / Math.sqrt(event.transform.k)}px`);
                });
            
            svg.call(zoom);
            
            // Set default selected location (US)
            setTimeout(() => {
                document.getElementById('marker-us').dispatchEvent(new Event('click'));
            }, 500);
        })
        .catch(function(error) {
            console.error('Error loading world map data:', error);
            
            // Fallback if map loading fails
            createFallbackMap(mapContainer);
        });
}

function getCountryIdForTeam(teamId) {
    // Map team IDs to country IDs in the GeoJSON
    const countryMapping = {
        'us': 840,    // United States
        'india': 356, // India
        'thailand': 764 // Thailand
    };
    
    return countryMapping[teamId];
}

function createFallbackMap(container) {
    // Create a simple fallback if the map fails to load
    container.innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px;">
            <i class="fas fa-globe" style="font-size: 48px; color: #6366f1; margin-bottom: 20px;"></i>
            <h3>Our Global Presence</h3>
            <p>Leela Analytics operates in the United States, India, and Thailand.</p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 20px;">
                <button class="location-btn" data-location="us">United States</button>
                <button class="location-btn" data-location="india">India</button>
                <button class="location-btn" data-location="thailand">Thailand</button>
            </div>
        </div>
    `;
    
    // Add event listeners to the fallback buttons
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const locationId = this.getAttribute('data-location');
            
            // Reset all buttons
            document.querySelectorAll('.location-btn').forEach(el => {
                el.classList.remove('active');
            });
            
            // Activate clicked button
            this.classList.add('active');
            
            // Hide all info panels
            document.querySelectorAll('.map-country-info').forEach(el => {
                el.style.display = 'none';
            });
            
            // Show corresponding info panel
            const infoPanel = document.getElementById(`${locationId}-info`);
            if (infoPanel) {
                infoPanel.style.display = 'block';
            }
        });
    });
    
    // Set default selected location (US)
    document.querySelector('.location-btn[data-location="us"]').click();
}
