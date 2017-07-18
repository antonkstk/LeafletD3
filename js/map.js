(function() {
	// initialize the map
	var map = L.map('map', {
		// set Konstanz coordinates
		center: [47.6779496, 9.1732384], 
		zoom: 14
	});

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoiYW50b24ta29zIiwiYSI6ImNqNTNveWk2ZDA5b2IyeXA2dTQ4bzA0dWgifQ.w1ZeN0IpuUIKB3xsYHILfQ'
	}).addTo(map);

	// points coordinates
	var coordinates = [
		[47.68076, 9.19024],
		[47.69122, 9.14792],
		[47.67961, 9.14852],
		[47.66587, 9.16672],
		[47.65712, 9.18079],
		[47.66799, 9.18985],
		[47.68076, 9.19024]
	];

	// add marker to the map
	var marker = L.marker([47.6779496, 9.1732384]).addTo(map);
	marker.bindPopup('<b>Konstanz</b>');

	// add an SVG element to Leaflet’s overlay pane
	var svg = d3.select(map.getPanes().overlayPane).append('svg');
    g = svg.append('g').attr('class', 'leaflet-zoom-hide');

    var line = d3.line()
	    .x(function(d){return projectOnLeaflet(d).x;})
	    .y(function(d){return projectOnLeaflet(d).y;})
	    .curve(d3.curveLinear); 
   
	var lines = g.selectAll('path')
		.data(coordinates)
		.enter()
		.append('path');
	var points = g.selectAll('circle')
		.data(coordinates)
		.enter()
		.append('circle');

	// transform the coordinates into the d3 layer pixel space
	var projectOnLeaflet = function(lnglat) {
      return map.latLngToLayerPoint(L.latLng(lnglat));
    }

    // display all the elements on the map
	var render = function() {
        
		var bounds = map.getBounds();

		var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
        var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

        // set svg size
		svg.attr('width', map.getSize().x + 'px')
			.attr('height', map.getSize().y + 'px')
			.style('left', topLeft.x + 'px')
			.style('top', topLeft.y + 'px');

		g.attr('transform', 'translate(' + -topLeft.x + ',' + -topLeft.y + ')');

		// set lines' and points' params
		lines
			.attr('d', function(d) {return line(coordinates)})
		    .attr('transform', 'translate(0,0)')
            .style('stroke', 'steelblue')
            .style('fill', 'none')
            .style('stroke-width', 2);
        points
        	.attr('r', 8)
			.attr('cx', function(d){return projectOnLeaflet(d).x;})
			.attr('cy', function(d){return projectOnLeaflet(d).y;})
			.attr('fill', 'red');
	} 

	render();

	map.on('zoom', render);
	map.on('move', render);
})();