---
---

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

//populate the locs object with the locations from the site data
let locs = {};

//loop through the locations
{% for location in site.locations %}

//unified name generation
{% assign loc = location.location_visible_name | slugify %}

//generate the marker
var mrk = L.marker([{{location.location_coordinates.lat}}, {{location.location_coordinates.lon}}], {icon: myIcon});

//function to adjust styles on hover
var mrk_enter = function(){
    locs["{{loc}}"]["marker"].setIcon(myIconHover);
    document.getElementById("{{loc}}").classList.add("darken");    
};

//funciton to adjust styles on leave
var mrk_leave = function(){
    locs["{{loc}}"]["marker"].setIcon(myIcon);
    document.getElementById("{{loc}}").classList.remove("darken");
};
//generate event listeners for location list hover
document.getElementById("{{loc}}").addEventListener("mouseenter", mrk_enter);
document.getElementById("{{loc}}").addEventListener("mouseleave", mrk_leave);

mrk.addEventListener("mouseover", mrk_enter);
mrk.addEventListener("mouseout", mrk_leave);

locs[ "{{loc}}" ] = {
    "lat": {{location.location_coordinates.lat}},
    "lon": {{location.location_coordinates.lon}},
    "html_obj": document.getElementById("{{loc}}"),
    "visible": true,
    "marker" : mrk,
};


{% endfor %}



//create the map
var map = L.map('map').setView([42.360, -71.059], 13);

//trigger events to update which markers are visible
map.on("move", updateMarkers);
map.on("zoom", updateMarkers);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add the markers (and store them in the locs object)
for (loc in locs){
    locs[loc]["marker"].addTo(map);
}

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


