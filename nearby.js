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
        zoom: 15
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

        places = searchBox.getPlaces();
        console.log(places);
        // search(places);
        detailedPlaces = places.map(function(placeQuery){
              search(placeQuery.place_id).then(function(result){
                  console.log(result);
              })
        });


      });
};

// function search(places){
//
//   let resultList = document.querySelector('.locations');
//   places.forEach(location => {
//
//       setTimeout(function(){
//         service.getDetails({placeId: location.place_id}, (place, status) =>
//               {
//                 console.log(place);
//                 if(status === google.maps.places.PlacesServiceStatus.OK){
//                     detailedPlaces.push(place)
//                   }
//             });
//           }, places.indexOf(location)*280);
//   });
//
//   // resultList.innerHTML = places.map(location => {
//   //     return `<div class="resultitem">
//   //                                       <div class="resultcontent"><img src=${location.icon} /></div>
//   //                                       <div class="resultcontent"><p>${location.name}</p></div>
//   //                                       <div class="resultcontent"><p>${location.formatted_address}</p></div>
//   //                                     </div>`;
//   // }).join('');
//
//
// };

function search(placeQuery, resolve){

  // let resultList = document.querySelector('.locations');

  return new Promise(function(resolve){
      setTimeout(function(){
        service.getDetails({placeId: placeQuery}, (place, status) =>
              {
                if(status === google.maps.places.PlacesServiceStatus.OK){
                      // return place;
                        resolve(place);
                  }

            });
          }, places.indexOf(location)*280);

  // places.forEach(location => {
  //
  //     setTimeout(function(){
  //       service.getDetails({placeId: location.place_id}, (place, status) =>
  //             {
  //               console.log(place);
  //               if(status === google.maps.places.PlacesServiceStatus.OK){
  //                   detailedPlaces.push(place)
  //                 }
  //           });
  //         }, places.indexOf(location)*280);
  // });

  // resultList.innerHTML = places.map(location => {
  //     return `<div class="resultitem">
  //                                       <div class="resultcontent"><img src=${location.icon} /></div>
  //                                       <div class="resultcontent"><p>${location.name}</p></div>
  //                                       <div class="resultcontent"><p>${location.formatted_address}</p></div>
  //                                     </div>`;
  // }).join('');

})
};
