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

const MAP_ZOOMED_IN = 15;

//create the map
//maybe change where .setView is centered
var map = L.map('map').setView([42.360, -71.059], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//populate the locs object with the locations from the site data
// will be populated by fetchData.js
let locs = {};

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

function mapFocus(location_id, previous_state){
    if (previous_state["zoom"] > MAP_ZOOMED_IN) {
        //give the previous state
        map.setView(previous_state["latlon"], previous_state["zoom"]);
        return
    } else if (map.getZoom() > MAP_ZOOMED_IN) {
        //do nothing too zoomed in 
        return
    }

    let lat = locs[location_id]["lat"];
    let lon = locs[location_id]["lon"];
    map.setView([lat, lon], MAP_ZOOMED_IN);
}



