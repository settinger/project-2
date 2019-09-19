let $langSelector = document.getElementById("register-language");
let $langSpan = document.getElementById("selected-language");
$langSelector.addEventListener('change', () => {
  $langSpan.innerText = $langSelector.value;
})

const $latitude = document.getElementById("register-latitude");
let currLat = $latitude.value;
const $longitude = document.getElementById("register-longitude");
let currLng = $longitude.value;

function startMap() {

  // Default coordinates to user's previously-submitted location
  const center = { lat: parseFloat(currLat),  lng: parseFloat(currLng) };

  // Initialize the map
  const map = new google.maps.Map(document.getElementById('map'), 
    {
      zoom: 5,
      center: center
    }
  );

  // Add a marker
  const langMarker = new google.maps.Marker({
    position: {
      lat: center.lat,
      lng: center.lng
    },
    map: map
  });
  
  map.addListener('center_changed', () => {
    // console.log(map.getCenter().lat());
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
}

startMap();