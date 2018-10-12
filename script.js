$(document).ready(function() {
console.log("hi")


	//Начнем-с
	if ($("#location")[0]) {
		var input = $('#location')[0];
	}
	//намечаем переменные
	var autocomplete = new google.maps.places.Autocomplete(input);
	var lat = '';
	var lng = '';
	var locationToggled = false;
	var beenHere = 0;
	var offset = 0;
	var running = false;
	var celsius;
	var temp;


	$("#location-submit").on("click", function(e) {
		e.preventDefault();
		if (locationToggled) {
				$("#location-holder").css("position", "relative");
				$("#location-holder").css("top", "0");
			$("#location-holder").css("background-color", "#f3f3f3");

				$("#weather").css("margin-top", "0");
				locationToggled = false;
				}

		else if (locationToggled === false) {
			submitLocation();
			locationToggled = true;
		}
	});

	//конверт гугл в широту/долготу
	function geocode(location) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
			"address": location,
		}, function(results, status) {
			//console.log(location);
			//console.log(status);
			// console.log(results[0].geometry);
			if (status == "OK") {
				var namedLocation = results[0].formatted_address;
				//console.log(namedLocation);
				lat = results[0].geometry.location.lat();
				lng = results[0].geometry.location.lng();
				weather(lat, lng, namedLocation);

				//console.log(lat);
						
				running = true;
				lookupTimezone(lat, lng, results, status);
			}
		}); 
	} 



//а вот тут подключаюсь к АПИ гугла
	function lookupTimezone(lat, lng, timestamp, response, status) {

		//УРЛ для запроса
		var url = "https://maps.googleapis.com/maps/api/timezone/json?";
		url += "location=" + lat + "," + lng
		url += "&timestamp=" + timestamp;
 }

//подтверждение коорд

	function submitLocation() {
		var location = $("#location").val();
		if (location != "") {
		geocode(location);
		} 
	}

	//наконец обращаюсь к АПИшке погодной
	function weather(lat, lng, namedLocation) {
		var namedLocation = namedLocation;
		//да-да, аякс ))) 
		$.ajax({
			url: 'http://api.openweathermap.org/data/2.5/weather?&APPID=79f968106b20734a2235e27dfa6b051e',
			dataType: 'jsonp',
			data: {
				lat: lat,
				lon: lng,
				units: "imperial",
			},
			cache: false,
			success: function(response) {
				console.log(response);
				var icon = response.weather[0].icon
				display(response, namedLocation, icon);
			},
			error: function(error) {
				console.log("error " + error);
				console.log(error);
			}
		});
	} 

	function display(response, namedLocation) {
		
		//применяю
		$("#weather").fadeOut(1000, function(){
			$("#location-submit").html("Посмотреть другой город");
			// $("#location-submit").css("margin-left", "-220px");
			
			
			temp = response.main.temp;
			temp = (temp-32)/1.8;
			console.log(temp);
			
		
			$("#temp").html(Math.round(temp) + "°C");
			$("#humidity").html(response.main.humidity + "%");
			$("#weather-name").html(response.weather[0].main);
			$("#namedLocation").html(namedLocation);
			$("#location-holder").css("position", "realtive");
			$("#location-holder").css("background-color", "transparent");
			// $("#location-holder").css("top", "250px");
			$("#location").val("");
		});


		$("#weather").fadeIn(500);
		//console.log(response.name);
		//console.log(locationToggled);

	}
});
