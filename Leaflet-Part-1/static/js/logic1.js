// Set the dimensions of the map container
const width = 960;
const height = 500;


// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
const myMap = L.map("map").setView([33, -115], 5);

// Adjusting the center of the map to the "Ring of Fire"
// myMap.panTo(new L.LatLng(0, -150));

//topographical map
// L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
//   attribution: "Map data: &copy; OpenTopoMap",
// }).addTo(myMap);

// L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
//   attribution: "Map data: &copy; CartoDB",
// }).addTo(myMap);

//black on white
// L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png", {
//   attribution: "Map data: &copy; Stamen",
// }).addTo(myMap);

// streetMap Adding a tile layer (the background map image) to our map:
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data &copy; OpenStreetMap contributors",
  maxZoom: 18,
}).addTo(myMap);

//function to define the color of the depth
function getColor(depth) {
  if (depth < 2) {
    return "#00FF00"; // green for shallow depth
  } else if (depth < 5) {
    return "#FFFF00"; // yellow for moderate depth
  } else if (depth < 10) {
    return "#FFF500"; // orange for moderate depth

  } else if (depth < 30) {
    return "#FF0000"; // red for intermediate depth
  } else if (depth < 50) {
    return "#800080"; // purple for moderate depth
  } else if (depth < 100) {
      return "#0000FF"; // blue for moderate depth
  
  } else {
    return "#0000FF"; // blue for deep depth
  }
}

// Add the fault line layer to the map
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(data) {
  const faultLines = L.geoJSON(data, {
    style: function(feature) {
      return {
        color: "black",
        weight: 1
      };
    }
  });

  faultLines.addTo(myMap);
});










// Use d3 to read the JSON file.
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
  console.log(data);
  
  // Add circles to the map to represent the data points
  data.features.forEach(function(feature) {
    const magnitude = feature.properties.mag;
    const longitude = feature.geometry.coordinates[0];
    const latitude = feature.geometry.coordinates[1];
    const depth = feature.geometry.coordinates[2];

    const marker = L.circleMarker([latitude, longitude], {
      radius: magnitude * 2,
      fillColor: getColor(depth),
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    });

    // Add a popup to the marker with some information
    var popupContent = `<p><strong>Magnitude:</strong> ${feature.properties.mag}</p>
                        <p><strong>Location:</strong> ${feature.properties.place}</p>
                        <p><strong>Time:</strong> ${new Date(feature.properties.time)}</p>`;
    marker.bindPopup(popupContent);
    
    // Add the marker to the map
    marker.addTo(myMap);
  });
}).catch(function(error) {
  console.log(error);
});

//create legend
const legend = L.control({ position: "bottomright" });

//add legend to map- function 
legend.onAdd = function(map) {
  const div = L.DomUtil.create("div", "legend");
  const labels = ["0-5", "5-10", "10-30", "30-50", "50-100", "100+"];
  const colors = ["#00FF00", "#FFFF00", "#FFF500", "#FF0000", "#800080", "#0000FF"];
  
  // loop through our density intervals and generate a label with a colored square for each interval
  for (let i = 0; i < labels.length; i++) {
    div.innerHTML += `<i style="background:${colors[i]}"></i>${labels[i]}<br>`;
  }

  return div;
};

legend.addTo(myMap);