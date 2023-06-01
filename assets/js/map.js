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
let locs = {};

async function initMap(){

    const resp = await fetch("assets/database/locations.json");
    const locs_loaded = await resp.json();
    for (loc in locs_loaded){
        let mrk = L.marker([locs_loaded[loc]["lat"], locs_loaded[loc]["lon"]], {icon: myIcon});
        let obj = document.getElementById(loc);

        //function to adjust styles on hover
        let mrk_enter = function(){
            mrk.setIcon(myIconHover);
            obj.classList.add("darken");
        };

        //function to adjust styles on leave
        let mrk_leave = function(){
            mrk.setIcon(myIcon);
            obj.classList.remove("darken");
        };

        //function to open the location preview with click on marker
        let mrk_click = function(){
            obj.click();
        }

        //generate event listeners for location list hover
        let create_hover = function(){
            obj.addEventListener("mouseenter", mrk_enter);
            obj.addEventListener("mouseleave", mrk_leave);

            //event listeners for hover color
            mrk.addEventListener("mouseover", mrk_enter);
            mrk.addEventListener("mouseout", mrk_leave);
        }

        //generate event listeners for location list hover
        let delete_hover = function(){
            obj.removeEventListener("mouseenter", mrk_enter);
            obj.removeEventListener("mouseleave", mrk_leave);

            //event listeners for hover color
            mrk.removeEventListener("mouseover", mrk_enter);
            mrk.removeEventListener("mouseout", mrk_leave);
        }
        create_hover();

        //event listener for click
        mrk.addEventListener("click", mrk_click);

        //add the markers (and store them in the locs object)
        mrk.addTo(map);


        locs[ loc] = {
            "lat": locs_loaded[loc]["lat"],
            "lon": locs_loaded[loc]["lon"],
            "html_obj": obj,
            "visible": true,
            "marker" : mrk,
            "hover_create": create_hover,
            "hover_abort": delete_hover,
        };

    }
}
initMap();

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




