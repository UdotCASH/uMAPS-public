let markers

async function populateMarkers(){
	console.log("populate markers")
	markers = new Array()
  await createMarkers()
	await createMarkerCluster()
}

async function createMarkerCluster(){
	markerCluster = new MarkerClusterer(map, markers,
            {imagePath: '../images'});
					console.log("createdMarkerCluster")
}

async function createMarkers(){
	let t;

numConverters = converters.length;

try{
	positions = JSON.parse(localStorage.getItem("positions"))
		if(positions==null){
			positions = new Array()
		}
} catch {
	positions = new Array()
}


	for(t = 0;t<numConverters;t++){
		 await createMarker(t)
  }

	return new Promise(function(resolve) {

		setTimeout(resolve, 0);
		});
}

async function createMarker(t) {

		let verifiedHash

		try{
			verifiedHash = verifiedHashes[t]
		} catch {
			verifiedHash = ""
		}

    var LatLng = {lat: parseFloat(coords[t][0]), lng: parseFloat(coords[t][1])};

				marker = new google.maps.Marker({
						map: map,
						position: LatLng
				});

				var infoNode = document.createElement("div")

				var UCASHT = document.createElement("p")
				infoNode.appendChild(UCASHT)


				if(hashes[t]==verifiedHash){
					UCASHT.innerText = "Verified U.CASH Converter"
			} else {
				UCASHT.innerText = "Unverified Converter"
			}


				let name = converters[t][0]
				var nameT = document.createElement("p")   //name Text
				nameT.innerText = name
				infoNode.appendChild(nameT)


				let telephone = converters[t][1]
				var telephoneT = document.createElement("p")
				telephoneT.innerText = telephone
				infoNode.appendChild(telephoneT)

				// let location = converters[t][2]
				// var locationT = document.createElement("p")
				// locationT.innerText = location
				// infoNode.appendChild(locationT)

				// let streetNo = converters[t][2]
				// var streetNoT = document.createElement("p")
				// streetNoT.innerText = streetNo
				// infoNode.appendChild(streetNoT)
				//
				let street = converters[t][12] + " " + converters[t][13]
				var streetT = document.createElement("p")
				streetT.innerText = street
				infoNode.appendChild(streetT)


				// let unit = converters[t][4]
				// var unitT = document.createElement("p")
				// unitT.innerText = unitT
				// infoNode.appendChild(unitT)

				let city = converters[t][15] + " , " + converters[t][16]
				var cityT = document.createElement("p")
				cityT.innerText = city
				infoNode.appendChild(cityT)

				// let province = converters[t][6]
				// var provinceT = document.createElement("p")
				// provinceT.innerText = province
				// infoNode.appendChild(provinceT)
				//
			// let postal = converters[t][7]
			// var postalT = document.createElement("p")
			// postalT.innerText = postal
			// infoNode.appendChild	(postalT)

			// let Country = converters[t][8]
			// var CountryT = document.createElement("p")
			// CountryT.innerText = Country
			// infoNode.appendChild(streetNoT)

			let telegram = converters[t][19]
			var telegramLink = document.createElement("a")
			telegramLink.innerText = "Chat on Telegram"
			telegramLink.href = "https://t.me/" + telegram
			infoNode.appendChild(telegramLink)
			infoNode.appendChild(document.createElement("div"))
			infoNode.appendChild(document.createElement("div"))


			// let email = converters[t][10]
			// var emailT = document.createElement("p")
			// emailT.innerText = email
			// infoNode.appendChild(emailT)
			//
			// let ensName = converters[t][11]
			// var ensNameT = document.createElement("p")
			// ensNameT.innerText = ensName
			// infoNode.appendChild(ensNameT)

			let mapsString = name + " " + street + " " + city
			let mapsLink = document.createElement("a")
			mapsLink.innerText = "View on Google Maps"
			mapsLink.href = "https://www.google.com/maps/search/?api=1&query=" + mapsString
			infoNode.appendChild(mapsLink)



			var loadFeeText
			var unloadFeeText
			var hoursText

			var infowindow = new google.maps.InfoWindow({
				content:infoNode,
			});

			//map.setCenter(positions[t+2]);
			markers.push(marker)
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,markers[t]);
				openNav()
				populateSidePanel(t)
			});

	return new Promise(function(resolve) {

		setTimeout(resolve, 0);
		});

}
