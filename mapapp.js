document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([35.6895, 139.6917], 5); // Default view set to Tokyo, Japan
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    var marker;

    map.on('click', function(e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
        document.getElementById('epicenter').value = e.latlng.lat + ', ' + e.latlng.lng;
        console.log('Updated coordinates');
    });

    document.querySelector('#earthquake-form button[type="submit"]').addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Button clicked!');
        var epicenter = document.getElementById('epicenter').value;
        var magnitude = parseFloat(document.getElementById('magnitude').value);

        console.log('Sending AJAX request to the server...');
        // Make an AJAX request to the Flask backend
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/calculate-earthquake");
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    console.log('Response received from server:', response);
                    // Handle the response data, e.g., update the map
                    drawRing(response.epicenter, response.diameter_km, response.intensity);
                } else {
                    console.error('Error: Failed to receive response from server');
                }
            }
        };
        var data = JSON.stringify({ "epicenter": epicenter, "magnitude": magnitude });
        console.log('Sending data to server:', data);
        xhr.send(data);
    });

    function drawRing(epicenter, diameter, intensity) {
        var ringColor;
        if (intensity === 'Strong') {
            ringColor = 'red';
        } else if (intensity === 'Medium') {
            ringColor = 'orange';
        } else {
            ringColor = 'yellow';
        }

        var circle = L.circle(epicenter, {
            color: ringColor,
            fillColor: ringColor,
            fillOpacity: 0.3,
            radius: diameter * 1000, // Convert kilometers to meters
        }).addTo(map);
    }
});
