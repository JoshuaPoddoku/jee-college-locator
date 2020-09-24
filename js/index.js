var map;
var markers = [];
var infoWindow;
function initMap() {
    
    
    
    var losAngeles = {
        lat: 25.429702849999998,
        lng: 81.77283717818167
    }

map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 8,
    styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
});



var marker = new google.maps.Marker({
    position: losAngeles,
    map: map,
    title: 'Hello World!'
    });

    infoWindow = new google.maps.InfoWindow();
    searchStores();
    setOnClickListener();
}

function searchStores() {
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        stores.forEach(function(store){
            var postal = store.city.substring(0,5);
            if(postal == zipCode){
                foundStores.push(store);
            }
        });
    }
    else{
        foundStores = stores;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;

}



function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}
   


function displayStores(stores){

    var storesHtml = "";

    stores.forEach(function(store, index){

        var address = store.addressLines;
        var phone =  store.phoneNumber;
        storesHtml+= `
    <div class="store-container">
      <div class="store-container-background">
        <div class="store-info">
            <div class="address">
            <span> ${address[0]}</span>
                   <span>${address[1]}</span>
            </div>
            <div class="phone-number">${phone}</div>
        </div>
        <div class="store-number-container">
            <div class="store-number">
                ${index+1}
            </div>
        </div>
      </div>      
    </div>`
    });

    document.querySelector('.stores-list').innerHTML = storesHtml;

    
}


function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function (store, index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);  
        var name = store.name;
        var address = store.addressLines[0];
        var statusText = store.openStatusText;
        var phone = store.phoneNumber;
        var website = store.website;
        bounds.extend(latlng);
        createMarker(latlng, name, address, statusText, website, phone, index);
        
})
map.fitBounds(bounds);
}

function createMarker(latlng, name, address, statusText, website, phone, index){
    var html = `
    <div class="store-info-window">
        <div class="store-info-name">
            ${name}
        </div>
        <div class="store-info-status">
            ${statusText}
        </div>
        <a class="store-info-website" href="${website}"  target="_blank">
            <div class="circle">
            <i class="fas fa-globe"></i>
            </div>
            ${website}
        </a>
        <div class="store-info-address">
            <div class="circle">
                <i class="fas fa-location-arrow"></i>
            </div>    
            ${address}
        </div>
        <div class="store-info-phone">
        <div class="circle">
            <i class="fas fa-phone-alt"></i>
        </div>    
            ${phone}
        </div>
    </div>
    `;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      label: `${index+1}`
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
  }
