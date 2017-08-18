var tempUnit = "C";
var temp, highTemp, lowTemp;
var x = document.getElementById("location");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callWeather, showError);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
	
	console.log("get location");
}

function callWeather(position) {
	var urlWeather = "https://api.darksky.net/forecast/46c3ceebdd6667475c48899be8b1efb9/" 
	        + position.coords.latitude + "," + position.coords.longitude 
			+ "?exclude=minutely,hourly,alerts&units=si&callback=showWeather";//daily,
	var scriptWeather = document.createElement('script');
    scriptWeather.src = urlWeather;
 
    // after the script is loaded (and executed), remove it
    scriptWeather.onload = function () {
        this.remove();
    };
	
    // insert script tag into the DOM (append to <head>)
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(scriptWeather, null);
	
	codeLatLng(position.coords.latitude, position.coords.longitude);
}

function codeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(lat, lng);
	var city = "", province = "", country = "";
	
    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
        console.log(results)
            if (results[0]) {
                //formatted address
                x.innerHTML = results[0].formatted_address;
             
			    //find country name
                for (var i=0; i<results[0].address_components.length; i++) {
                    for (var b=0;b<results[0].address_components[i].types.length;b++) {

                        //there are different types that might hold a city admin_area_lvl_1 
						//usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "administrative_area_level_2") {
                            //this is the object you are looking for
                            city= results[0].address_components[i].long_name;
                        } else if(results[0].address_components[i].types[b] == "country") {
                            //this is the object you are looking for
                            country = results[0].address_components[i].short_name;
                            break;
						}
                    }
                }
                //city data
				
				if(city) {
                    x.innerHTML = city;
					if(country) {
						x.innerHTML += ", " + country;
					}
                } else if(province) {
					x.innerHTML = province;
				    if(country) {
						x.innerHTML += ", " + country;
					}
				} else if(country) {
					x.innerHTML = country;
				}

            } else {
                x.innerHTML = "No results found";
            }
        } else {
            x.innerHTML = "Geocoder failed due to: " + status;
        }
    });
}

function showWeather(data) {
	console.log(data);
	
	var skycons = new Skycons({"color": "DarkSlateGrey"});
	var iconW = data.currently.icon;
    temp = data.currently.temperature.toFixed(0);
	highTemp = data.daily.data[0].apparentTemperatureMax.toFixed(0);
	lowTemp = data.daily.data[0].apparentTemperatureMin.toFixed(0);
	console.log(iconW);			
	document.getElementById("temp").innerHTML = temp + "&#176;";
	document.getElementById("tempUnit").innerHTML =  tempUnit;
	document.getElementById("today").innerHTML = lowTemp + " / " + highTemp + "&#176;";
	
	document.getElementById("summary").innerHTML = data.currently.summary;
	
	switch(iconW) {
		case "clear-day": 
		    skycons.set("icon", Skycons.CLEAR_DAY);
			break;
		case "clear-night":
		    skycons.set("icon", Skycons.CLEAR_NIGHT);
			break;
		case "rain":
		    skycons.set("icon", Skycons.RAIN);
			break;
		case "snow":
		    skycons.set("icon", Skycons.SNOW);
			break;
		case "sleet":
		    skycons.set("icon", Skycons.SLEET);
			break;
		case "wind":
		    skycons.set("icon", Skycons.WIDE);
			break;
        case "fog":
		    skycons.set("icon", Skycons.FOG);
			break;
		case "cloudy":
		    skycons.set("icon", Skycons.CLOUDY);
			break;
		case "partly-cloudy-day":
		    skycons.set("icon", Skycons.PARTLY_CLOUDY_DAY);
			break;
		case "partly-cloudy-night":
		    skycons.set("icon",  Skycons.PARTLY_CLOUDY_NIGHT);
			break;
		default:
		    console.log(icon);
	}
	//skycons.set("icon", Skycons.PARTLY_CLOUDY_DAY);
    skycons.play();
}

function changeTempUnit() {
	if(tempUnit === "C") {
		tempUnit = "F";
		temp =  temp * 9/5 + 32;
		highTemp = highTemp * 9/5 + 32;
		lowTemp = lowTemp * 9/5 + 32;
	} else if(tempUnit === "F") {
		tempUnit = "C";
		temp = (temp - 32) * 5/9;
		highTemp = (highTemp - 32) * 5/9;
		lowTemp = (lowTemp - 32) * 5/9;
	}
	
	temp = temp.toFixed(0);
	highTemp = highTemp.toFixed(0);
	lowTemp = lowTemp.toFixed(0);
	document.getElementById("temp").innerHTML = temp + "&#176;";
	document.getElementById("tempUnit").innerHTML =  tempUnit;
	document.getElementById("today").innerHTML = lowTemp + " / " + highTemp + "&#176;";
	
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

getLocation();
