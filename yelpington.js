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
let listDiv;
let restaurantDetailsDiv;
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
    listDiv = document.getElementById('restaurantList');
    restaurantDetailsDiv = document.getElementById('restaurantDetails');
    restaurantDetailsDiv.setAttribute("style", "visibility: hidden;")
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
        fetchAllAndPopulateList();
}

function fetchAllAndPopulateList() {
    fetch('all.json')
        .then(function (response) {
            return response.text();
        })
        .then(function (myText) {
            allList = JSON.parse(myText)
            for (i = 0; i < allList.length; i++) {
                fetch(allList[i] + '.json')
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (restaurantData) {

                        restaurantJson = JSON.parse(restaurantData)

                        function populateList(divName, jsonListNumberID, jsonListNumberNames) {
                            // document.getElementById(divName).innerHTML += "<a href=/" + jsonListNumberID + "><div class='navList'>" + jsonListNumberNames + "</div></a>"
                            let htmlString = "<div onclick= " + "getRestaurantDetailsFromJSON(" + "'" + jsonListNumberID + "'" + ")>" + jsonListNumberID + "</div >"
                            listDiv.innerHTML += htmlString
                        }

                        populateList("restaurantList", restaurantJson.id, restaurantJson.name)
                        getRestaurantDetailsFromJSON(restaurantJson.id)
                    })
            }
        })
}

function getRestaurantDetailsFromJSON(restaurantName) {
    
    fetch(restaurantName + '.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (RestaurantDetails) {
            
            displayRestaurantDetails(RestaurantDetails)
            let RestaurantLocation = getRestaurantLocation(RestaurantDetails)
            displayMap(RestaurantLocation, RestaurantDetails)
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
    restaurantDetailsDiv.setAttribute("style", "visibility: visible;")
    return restaurantInfo
}

function getRestaurantLocation(restaurantInfo) {
    baseMapURL = "https://nominatim.openstreetmap.org/search/?q=";
    formatJson = '&format=json'
    mapRequestURL = `${baseMapURL}${restaurantInfo.street}+${restaurantInfo.city}+${restaurantInfo.state}+${restaurantInfo.country}${formatJson}`
    return mapRequestURL
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


