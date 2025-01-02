
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
// let maptoken = mapToken;
// YOUR_MAPBOX_ACCESS_TOKEN
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  center: listing.geometry.coordinates, // starting position [longutide, latitude]. Note that lat must be set between -90 and 90
  zoom: 9 // starting zoom
});

// map marker
// Create a new marker.
const marker = new mapboxgl.Marker()({ color: "red" })
  .setLngLat(listing.geometrycoordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h4>${listing.title}</h4><p>Exact Location proviede after booking!</P>`))
  .addTo(map);
