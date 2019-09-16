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

  // map.addListener('click', () => {
  //   console.log("map clicked");
  // })

  // Add a marker
  const langMarker = new google.maps.Marker({
    position: {
      lat: euroCenter.lat,
      lng: euroCenter.lng
    },
    map: map
  });
  
  map.addListener('center_changed', () => {
    // console.log(map.getCenter().lat());
    const $latitude = document.getElementById("lat-span");
    const $longitude = document.getElementById("lon-span");
    langMarker.setPosition(map.getCenter());
    $latitude.innerText = map.getCenter().lat().toFixed(2);
    $longitude.innerText = map.getCenter().lng().toFixed(2);
  });


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // Center map with user location
      // map.setCenter(user_location);


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