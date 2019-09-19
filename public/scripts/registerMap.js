let $langSelector = document.getElementById("register-language");
let $langSpan = document.getElementById("selected-language");
$langSpan.innerText = $langSelector.value;
$langSelector.addEventListener('change', () => {
  $langSpan.innerText = $langSelector.value;
})

function startMap() {

  // Default coordinates to European geocenter
  const euroCenter = { lat: 50,  lng: 10 };

  // Initialize the map
  const map = new google.maps.Map(document.getElementById('map'), 
    {
      zoom: 5,
      center: euroCenter
    }
  );

  // Add a marker
  const langMarker = new google.maps.Marker({
    position: {
      lat: euroCenter.lat,
      lng: euroCenter.lng
    },
    map: map
  });
  
  map.addListener('center_changed', () => {
    const $latitude = document.getElementById("register-latitude");
    const $longitude = document.getElementById("register-longitude");
    langMarker.setPosition(map.getCenter());
    let lat = map.getCenter().lat();
    let lon = map.getCenter().lng();
    // Keep lat within range [-90.00, 90.00]
    while(lat < -90) { lat += 180; };
    while(lat > 90) {lat -= 180; };
    // Keep lon within range [-180, 180]
    while(lon < -180) { lon += 360; };
    while(lon > 180) {lon -= 360; };

    $latitude.value = lat.toFixed(2);
    $longitude.value = lon.toFixed(2);
  });


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      map.setCenter(user_location);

    }, function () {
      map.setCenter(euroCenter)
      console.log('Error in the geolocation service.');
    });
  } else {
    map.setCenter(euroCenter)
    console.log('Browser does not support geolocation.');
  }
}

startMap();