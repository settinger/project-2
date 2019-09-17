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

const map = startMap();

const iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
for (let response of results) {
  let lat = response[0];
  let lng = response[1];
  new google.maps.Marker({
    position: {
      lat: lat,
      lng: lng
    },
    map: map,
    icon: iconBase + 'blu-blank-lv.png'
  })
}