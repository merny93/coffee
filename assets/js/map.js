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

{% comment %} Loop through the locations {% endcomment %}
{% for location in site.locations %}

    //unified name generation
    {% assign loc = location.location_visible_name | slugify %}
    {% assign ns = loc | replace: "-", "_" %}

    let {{ns}} = {};
    //generate the marker
    {{ns}}.mrk = L.marker([{{location.location_coordinates.lat}}, {{location.location_coordinates.lon}}], {icon: myIcon});

    //function to adjust styles on hover
    {{ns}}.mrk_enter = function(){
        locs["{{loc}}"]["marker"].setIcon(myIconHover);
        document.getElementById("{{loc}}").classList.add("darken");
    };

    //function to adjust styles on leave
    {{ns}}.mrk_leave = function(){
        locs["{{loc}}"]["marker"].setIcon(myIcon);
        document.getElementById("{{loc}}").classList.remove("darken");
    };

    //function to open the location preview with click on marker
    {{ns}}.mrk_click = function(){
        document.getElementById("{{loc}}").click();
    }

    //generate event listeners for location list hover
    {{ns}}.create_hover = function(){
        document.getElementById("{{loc}}").addEventListener("mouseenter", {{ns}}.mrk_enter);
        document.getElementById("{{loc}}").addEventListener("mouseleave", {{ns}}.mrk_leave);

        //event listeners for hover color
        {{ns}}.mrk.addEventListener("mouseover", {{ns}}.mrk_enter);
        {{ns}}.mrk.addEventListener("mouseout", {{ns}}.mrk_leave);
    }

    //generate event listeners for location list hover
    {{ns}}.delete_hover = function(){
        document.getElementById("{{loc}}").removeEventListener("mouseenter", {{ns}}.mrk_enter);
        document.getElementById("{{loc}}").removeEventListener("mouseleave", {{ns}}.mrk_leave);

        //event listeners for hover color
        {{ns}}.mrk.removeEventListener("mouseover", {{ns}}.mrk_enter);
        {{ns}}.mrk.removeEventListener("mouseout", {{ns}}.mrk_leave);
    }

    {{ns}}.create_hover();

    //event listener for click
    {{ns}}.mrk.addEventListener("click", {{ns}}.mrk_click);

    locs[ "{{loc}}" ] = {
        "lat": {{location.location_coordinates.lat}},
        "lon": {{location.location_coordinates.lon}},
        "html_obj": document.getElementById("{{loc}}"),
        "visible": true,
        "marker" : {{ns}}.mrk,
        "hover_create": {{ns}}.create_hover,
        "hover_abort": {{ns}}.delete_hover,
    };

{% endfor %}

addEventListener("popstate", function(e) {
    for (loc in locs){
        if (loc != e.state.id){
            locs[loc].html_obj.classList.remove("darken");
        }
    }
});

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


