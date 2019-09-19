
const $iconSelector = document.getElementById("icon-selector");


function startMap() {
  // Define default coordinates
  const euroCenter = { lat: 50,  lng: 10 };

  // Initialize the map, apply stark styling
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: euroCenter,
    styles: [{
      "stylers": [
        { "visibility": "off" }
      ]},
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" },
          { "hue": "#ffffff" },
          { "saturation": -100 },
          { "lightness": 100 }
        ]
      },
      {
        "featureType": "water",
        "stylers": [
          { "visibility": "on" },
          { "lightness": -35 },
          { "saturation": -100 }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
          { "visibility": "on" }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
          { "visibility": "off" }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          { "visibility": "on" },
          { "color": "#000000" },
          { "lightness": 90 }
        ]
      }
    ]
  })
  return map;
}

// Draw each response as a colored marker
function drawMarkers(markerArray) {
  // Delete existing markers
  for (let marker of markerArray) {
    marker.setMap(null);
  }
  markerArray = [];
  for (let response of results) {
    let lat = response[0];
    let lng = response[1];
    markerArray.push(new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: map,
      icon: {
        url: icons[iconset][response[2]],
        anchor: new google.maps.Point(5,5)
      },
      clickable: false
    }))
  }
  return markerArray;
}

function drawLegend() {
  // Draw the legend
  const $legend = document.getElementById('legend');
  // Remove current legend entries (but not legend title or selector)
  for (let i=0; i<options.length; i++) {
    if($legend.lastChild === $iconSelector) break;
    $legend.removeChild($legend.lastChild);
  }
  // Add new legend entries
  for (let i=0; i<options.length; i++) {
    option = options[i];
    icon = icons[iconset][i];
    let $newLegendItem = document.createElement("div");
    $newLegendItem.setAttribute("style", "background-color: white; padding: 5px; margin: 3px; border-radius: 3px;")
    $newLegendItem.innerHTML = `<img src="${icon}"/> ${option}`;
    $legend.appendChild($newLegendItem);
  }
  return $legend;
}

const map = startMap();
let markerArray = drawMarkers([]);
let $legend = drawLegend();


$iconSelector.addEventListener('change', () => {
  iconset = parseInt($iconSelector.value);
  markerArray = drawMarkers(markerArray);
  $legend = drawLegend();
});