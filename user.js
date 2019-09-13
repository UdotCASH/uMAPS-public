let contract
let contractAddress =  "0x1b3567f96aa45341d9634779f5c4c615619cf8a6"
let contractABI = [
	{
		"constant": false,
		"inputs": [],
		"name": "addAdmin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "converterHashes",
				"type": "bytes32[]"
			}
		],
		"name": "addConverters",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "converters",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lastUpdated",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numConverters",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

var geocoder;
var map;
var hashes
var converters
var coords
var numConverters
var markers
var positions


 async function initialize() {

  provider = ethers.getDefaultProvider('rinkeby');

  utils = ethers.utils;

	contract = new ethers.Contract(contractAddress, contractABI, provider);

	let lastUpdated = await contract.lastUpdated()
	lastUpdated = lastUpdated.toNumber()
	var lastRead = localStorage.getItem("lastRead");
	console.log(lastUpdated,lastRead)

	converters = JSON.parse(localStorage.getItem("converters"))

	if(converters==null){
		converters = new Array()
	}

	if(hashes==null){
		hashes = new Array()
	}


    await fetchConverters()
    await fetchCoords()
		await fetchHashes()
		await populateMarkers()

}

  function initMap() {
    geocoder = new google.maps.Geocoder();

    // The location of Uluru
var toronto = {lat: 43.7, lng: -79.41};
// The map, centered at Uluru

// The marker, positioned at Uluru
    map = new google.maps.Map(document.getElementById('map'), {
      center: toronto,
      zoom: 8
    });

    //var marker = new google.maps.Marker({position: uluru, map: map});

  }

async function addConverter(){

	var name = document.getElementById('name').value;

  var address = document.getElementById('address').value;
	var telegram = document.getElementById('telegram').value;

  await contract.addConverter(name,address,telegram);


}

async function populateMarkers(){

	markers = new Array()
  console.log(converters)
  console.log(coords)
  await createMarkers()
	console.log(markers)
	await createMarkerCluster()

}

async function createMarkerCluster(){
	markerCluster = new MarkerClusterer(map, markers,
            {imagePath: '../images'});
					console.log("createdMarkerCluster")
}

async function createMarkers(){
	let t;


console.log(converters)

numConverters = converters.length;
console.log(numConverters)

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
			verifiedHash = await contract.converters(t)
		}

		catch{
			verifiedHash = ""
		}
		console.log(t)
		console.log(verifiedHash)
		console.log(hashes[t])


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

			// let email = converters[t][10]
			// var emailT = document.createElement("p")
			// emailT.innerText = email
			// infoNode.appendChild(emailT)
			//
			// let ensName = converters[t][11]
			// var ensNameT = document.createElement("p")
			// ensNameT.innerText = ensName
			// infoNode.appendChild(ensNameT)


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
			});




	return new Promise(function(resolve) {

		setTimeout(resolve, 0);
		});

}


async function geocodeTHIS(location, i) {

}

function teste() {

	for(let r=0;r<100;r++){
		setTimeout(function(){
			console.log(r)
		}, 1000*r);
}

}

function testCSV() {
	let longs = new Array()


	let rows = new Array()
	rows.push(["lat","lng"])
	rows.push(["string","string"])

	for (let r = 2;r<positions.length;r++){
		let lat = positions[r].lat()
		let lng = positions[r].lng()
		let coords = [lat,lng]
		rows.push(coords)

	}


let csvContent = "data:text/csv;charset=utf-8,"
    + rows.map(e => e.join(",")).join("\n");
var encodedUri = encodeURI(csvContent);
window.open(encodedUri);
}
