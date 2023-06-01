//icon for map`
var myIcon = L.icon({
    iconUrl: 'assets/icons/map-pin.svg',
    iconSize: [25, 50],
    iconAnchor: [12, 40],
});

var myIconHover = L.icon({
  iconUrl: 'assets/icons/map-pin-light.svg',
  iconSize: [25, 50],
  iconAnchor: [12, 40],

});


//create the map
var map = L.map('map').setView([42.360, -71.059], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//populate the locs object with the locations from the site data
// will be populated by fetchData.js
let locs = {};




// This function does not seem to do anything. on the chopping block... somehow related to the back/forward functionality
// addEventListener("popstate", function(e) {
//     for (loc in locs){
//         if (loc != e.state.id){
//             locs[loc].html_obj.classList.remove("darken");
//         }
//     }
// });







//update which markers are visible in locs
function updateMarkers(){
    for (loc in locs){
        if (map.getBounds().contains(locs[loc]["marker"].getLatLng())){
            locs[loc]["visible"] = true;
            locs[loc].html_obj.style.display = "flex";
        } else {
            locs[loc]["visible"] = false;
            locs[loc].html_obj.style.display = "none";
        }
    }
}

//trigger events to update which markers are visible
map.on("move", updateMarkers);
map.on("zoom", updateMarkers);




