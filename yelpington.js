let name;
let restaurantName;
let restaurantStreet;
let restaurantCity;
let restaurantState;
let restaurantPhoneNumber;
let restaurantEmail;
let restaurantWebSite;
let restaurantHours;
let restaurantNotes;


let map;
let openStreetMapURL;

function initialize() {
    name = document.location.pathname.slice(1);
    restaurantName = document.getElementById('name');
    restaurantStreet = document.getElementById('street');
    restaurantCity = document.getElementById('city');
    restaurantState = document.getElementById('state');
    restaurantPhoneNumber = document.getElementById('phonenumber');
    restaurantEmail = document.getElementById('email');
    restaurantWebSite = document.getElementById('website');
    restaurantHours = document.getElementById('hours');
    restaurantNotes = document.getElementById('notes');

    map = L.map('mapid').setView([44.4758492, -73.2137881], 15);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox.run-bike-hike',
        accessToken: 'pk.eyJ1IjoiY2ZyYW5rIiwiYSI6ImNqamVxdHdkdDFlZTIzcG9sY3B4N3BjdTQifQ.rLOdddfG8A4S-BWgcXj8dA'
    }).addTo(map);

    L.marker([44.4758492, -73.2137881]).addTo(map)
        .bindPopup('Downtown Burlington')
        .openPopup();
    fetchAllAndPopulateNavbar();
}


function fetchAllAndPopulateNavbar() {
    fetch('all.json')
        .then(function (restaurantList) {
            return restaurantList.json();
        })
        .then(function (restaurantList) {
            populateNavbar(restaurantList)
        })
}

function populateNavbar(restaurantList) {

    for (restID of restaurantList) {
        let currentRestID = restID;
        $('<a id="' + restID + '" class="dropdown-item" href="#">' + restID + '</a>').appendTo('#dynamicRestList');
        let restaurantLink = document.getElementById(restID)
        
        restaurantLink.addEventListener('click', () => {
            getRestaurantDetailsFromJSON(currentRestID)
            
        })
    }

}

function getRestaurantDetailsFromJSON(restaurantID) {

    fetch(restaurantID + '.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (restData) {
        
            displayRestaurantDetails(restData)
            return restData;
        })
        .catch(function (error) {
            console.error('Yikes! I should handle this better:\n', error);
        });
}

function displayRestaurantDetails(restaurantInfo) {
    restaurantName.textContent = restaurantInfo.name;
    restaurantStreet.textContent = restaurantInfo.street;
    restaurantCity.textContent = restaurantInfo.city;
    restaurantState.textContent = restaurantInfo.state;
    restaurantPhoneNumber.textContent = restaurantInfo.phonenumber;
    restaurantEmail.textContent = restaurantInfo.email;
    restaurantWebSite.textContent = restaurantInfo.website;
    restaurantHours.textContent = restaurantInfo.hours;
    restaurantNotes.textContent = restaurantInfo.notes;
    getRestaurantLocation(restaurantInfo)
}

function getRestaurantLocation(restaurantInfo) {
    baseMapURL = "https://nominatim.openstreetmap.org/search/?q=";
    formatJson = '&format=json'
    mapRequestURL = `${baseMapURL}${restaurantInfo.street}+${restaurantInfo.city}+${restaurantInfo.state}+${restaurantInfo.country}${formatJson}`
    displayMap(mapRequestURL, restaurantInfo)

}

function displayMap(restaurantLoc, restaurantDetails) {
    fetch(restaurantLoc)
        .then(function (result) {
            return result.json()
        })
        .then(function (theResult) {
            let lat = theResult[0].lat
            let lon = theResult[0].lon
            let name = restaurantDetails.name;
            map.setView([lat, lon], 19);

            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.run-bike-hike',
                accessToken: 'pk.eyJ1IjoiY2ZyYW5rIiwiYSI6ImNqamVxdHdkdDFlZTIzcG9sY3B4N3BjdTQifQ.rLOdddfG8A4S-BWgcXj8dA'
            }).addTo(map);

            L.marker([lat, lon]).addTo(map)
                .bindPopup(name)
                .openPopup();
        })
}


