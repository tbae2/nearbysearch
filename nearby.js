// //dynamically load and add google maps api support to main page.
//
let currentPosition = {
    lat: 0,
    lng: 0

}
// navigator.geolocation.getCurrentPosition((position) => {
//       currentPosition.latitude = position.coords.latitude;
//       currentPosition.longitude = position.coords.longitude;
// });

document.addEventListener('DOMContentLoaded', function() {

    var maps_file = document.createElement('script');
    maps_file.type = 'text/javascript';
    //source for map file, add the places library so you can search places
    maps_file.src = "https://maps.googleapis.com/maps/api/js?libraries=places&callback=initMap&key=AIzaSyAYzBUsoyit6PKN0XCpQLg0RcYSs9seE_A";
    document.getElementsByTagName('head')[0].appendChild(maps_file);

});

//map variable that can be used for map call backs
let map;
let service;
let places = [];
let detailedPlaces = [];
//initialize map object and assign to map variable
function initMap() {
    //console.log(currentPosition);
    map = new google.maps.Map(document.querySelector('.map'), {
        center: {
            lat: 24.0686755,
            lng: -34.4854967
        },
        zoom: 13
    });
    //if geolocation is available use it
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            currentPosition.lat = position.coords.latitude;
            currentPosition.lng = position.coords.longitude;
            new google.maps.Marker({position: currentPosition, map: map});
            map.setCenter(currentPosition);
        });
    };

    //attach the Places service to this map
    service = new google.maps.places.PlacesService(map);

    const searchQuery = document.querySelector('.search-locations');
    let searchBox = new google.maps.places.SearchBox(searchQuery);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(searchQuery);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    //listener to figure out what the user selected.
    searchBox.addListener('places_changed', function() {

        let sectionedPlaces = [];
        places = searchBox.getPlaces();
        //console.log(places.length);
        // search(places);
        if (places.length === 0) {
            console.log('places empty');
            return;
        }
        for (var i = 0; i < places.length; i += 4) {
            sectionedPlaces.push(places.slice(i, i + 4));
        }

        sectionedPlaces.forEach(function(placeSection) {
            //work around the 5 queries a second limit imposed by Google
            setTimeout(function() {
                // build an array of promises
                let placePromises = placeSection.map(function(place) {
                    return searchPlaces(place);
                });
                //takes an array of promises, maps over them and returns only when they're all complete
                Promise.all(placePromises).then(function(result) {
                    renderList(result);
                })
            }, sectionedPlaces.indexOf(placeSection) * 1400);
        });

    });
};

function searchPlaces(placeQuery) {
    //return a promise object
    return new Promise(function(resolve, reject) {
        service.getDetails({
            placeId: placeQuery.place_id
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(place);
            } else {
                reject(status);
            }
        });
    });
};

function renderList(locations) {
    console.log(locations);
    let addResult = document.createElement('div');
    let resultLocations = document.querySelector('.locations');

    addResult.innerHTML = locations.map(location => {
        addMarkers(location);
        return `<div class="resultitem">
               <div class="resultcontent"><img src=${location.icon} /></div>
               <div class="resultcontent"><p>${location.name}</p></div>
               <div class="resultcontent"><p>${location.formatted_address}</p></div>
               </div>`;
    }).join('');

    resultLocations.appendChild(addResult);
};

function addMarkers(place) {
    let marker = new google.maps.Marker({
        title: place.name,
        map: map,
        animation: google.maps.Animation.DROP,
        position: place.geometry.location,
        icon: {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        }
    });

};
