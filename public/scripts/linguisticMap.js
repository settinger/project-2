function startMap() {
  // Define default coordinates
  const euroCenter = { lat: 50,  lng: 10 };

  // Initialize the map
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
      icon: icons[iconset][response[2]],
      clickable: false
    }))
  }
  return markerArray;
}

function drawLegend() {
  // Draw the legend
  const $legend = document.getElementById('legend');
  $legend.innerHTML = '';
  for (let i=0; i<options.length; i++) {
    option = options[i];
    icon = icons[iconset][i];
    let $newLegendItem = document.createElement("div");
    $newLegendItem.setAttribute("style", "background-color: white;")
    $newLegendItem.innerHTML = `<img src="${icon}"/>${option}`;
    $legend.appendChild($newLegendItem);
  }
  return $legend;
}

const map = startMap();
let markerArray = drawMarkers([]);
let $legend = drawLegend();


const $iconSelector = document.getElementById("icon-selector");
$iconSelector.addEventListener('change', () => {
  iconset = parseInt($iconSelector.value);
  markerArray = drawMarkers(markerArray);
  $legend = drawLegend();
});