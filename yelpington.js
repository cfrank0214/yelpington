let params = new URLSearchParams(document.location.search.slice(1));
let name = params.get("name");
let restaurantName = document.getElementById('name');
let restaurantStreet = document.getElementById('street');
let restaurantCity = document.getElementById('city');
let restaurantState = document.getElementById('state');
let restaurantPhoneNumber = document.getElementById('phonenumber');
let restaurantEmail = document.getElementById('email');
let restaurantWebSite = document.getElementById('website');
let restaurantHours = document.getElementById('hours');
let restaurantNotes = document.getElementById('notes');
let map = document.getElementById('map');
let openStreetMapURL;
let openStreetPinURL;

function getYelpingtonData(name) {
    fetch(name + '.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            displayYelpingtonData(json)
            let RequestURL = createMapRequestURL(json)
            makeAPICall(RequestURL)
        })
        .catch(function (error) {
            console.error('Yikes! I should handle this better:\n', error);
        });
}

function displayYelpingtonData(restaurantInfo) {
    restaurantName.textContent = restaurantInfo.name;
    restaurantStreet.textContent = restaurantInfo.street;
    restaurantCity.textContent = restaurantInfo.city;
    restaurantState.textContent = restaurantInfo.state;
    restaurantPhoneNumber.textContent = restaurantInfo.phonenumber;
    restaurantEmail.textContent = restaurantInfo.email;
    restaurantWebSite.textContent = restaurantInfo.website;
    restaurantHours.textContent = restaurantInfo.hours;
    restaurantNotes.textContent = restaurantInfo.notes;
    return restaurantInfo
}

function createMapRequestURL(restaurantInfo) {
    baseMapURL = "https://nominatim.openstreetmap.org/search/?q=";
    formatJson = '&format=json'
    mapRequestURL = `${baseMapURL}${restaurantInfo.street}+${restaurantInfo.city}+${restaurantInfo.state}+${restaurantInfo.country}${formatJson}`
    console.log(mapRequestURL)
    return mapRequestURL

}

function makeAPICall(RequestURL) {
    console.log({ RequestURL })
    fetch(RequestURL)
        .then(function (result) {
            return result.json()
        })
        .then(function (theResult) {
            let lat = theResult[0].lat
            let lon = theResult[0].lon
            let boundingbox = theResult[0].boundingbox
             openStreetMapURL = `https://www.openstreetmap.org/export/embed.html?bbox=${boundingbox[2]}%2C${boundingbox[0]}%2C${boundingbox[3]}%2C${boundingbox[1]}&layer=mapnik&marker=${lat}%2C${lon}`
          
             let iFrame = document.getElementById('MapIframe')
             iFrame.src=openStreetMapURL
            console.log(openStreetMapURL)
            console.log(openStreetPinURL)
    
            map.textContent = JSON.stringify(theResult[0])
        })
}


