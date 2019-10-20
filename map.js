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

var verifiedHashes

var coll = document.getElementsByClassName("collapsible"); //Collapsible Hours Element

 async function initialize() {

  provider = ethers.getDefaultProvider('rinkeby');
  utils = ethers.utils;
	contract = new ethers.Contract(contractAddress, contractABI, provider);

	let lastUpdated = await contract.lastUpdated()
	lastUpdated = lastUpdated.toNumber()*1000
	var lastRead = localStorage.getItem("lastRead");
	console.log(lastUpdated,parseInt(lastRead))

if(lastRead<lastUpdated||lastRead=="null"){
	console.log("getContractData")
	await getContractData()
} else {
	verifiedHashes = JSON.parse(localStorage.getItem("verifiedHashes"))
	if(verifiedHashes==null){
		verifiedHashes = new Array()
	}
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
	console.log("begin populate markers")
	markers = new Array()
  await createMarkers()
	await createMarkerCluster()
	console.log("end populate markers")
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
				console.log(hashes)
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

var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

function populateSidePanel(converter){
document.getElementById("mySidenav").innerHTML = ""

	let imageInfo = document.createElement("img")
	imageInfo.src = converters[converter][30]
	imageInfo.style ="width:80%;"
	document.getElementById("mySidenav").appendChild(imageInfo)

	let nameInfo = document.createElement("div")
	nameInfo.innerText = converters[converter][0]
	document.getElementById("mySidenav").appendChild(nameInfo)

	let hoursInfo = document.createElement("div")
	var Hours = document.createElement("p")
	Hours.classList.add("collapsible")
	Hours.innerText = "Converter Hours"

	var dt = new Date()
	var dayNo = dt.getDay()
	var hour = dt.getHours()
	var minute = dt.getMinutes()
	var availability

	for(var t = 0;t < 7;t++){
		let s
		s = (t+dayNo-1)%7
		var Day = document.createElement("p")
		Day.innerText = days[s] + ": " + converters[converter][s+21]
		hoursInfo.appendChild(Day)
	}

	//TODO: manage timezones
	var hS = converters[converter][dayNo + 21] //hours String
	var split1 = hS.split(" ")

	var tz = split1[1]

	console.log(hS)
	switch(hS){
		case "Closed":
			availability = "Closed"
			break;
		case "Appointment Only":
			availability = "Appointment Only"
			break;
		default:
			let hSArray = hS.split("-")
			var open = hSArray[0]
			var closed = hSArray[1]
			console.log(open)
			console.log(closed)

	}



	hoursInfo.classList.add("content")
	Hours.appendChild(hoursInfo)
	collapseHours(Hours,hoursInfo);
	document.getElementById("mySidenav").appendChild(Hours)

	let addressInfo = document.createElement("div")
	addressInfo.innerText = converters[converter][12] + " " + converters[converter][13]
	document.getElementById("mySidenav").appendChild(addressInfo)

	let phoneInfo = document.createElement("a")
	phoneInfo.innerText = converters[converter][1]
	phoneInfo.href = "tel:+" + converters[converter][1]
	document.getElementById("mySidenav").appendChild(phoneInfo)

	let websiteInfo = document.createElement("div")
	websiteLink = document.createElement("a")
	websiteLink.target = "_blank"
	websiteLink.innerText = converters[converter][2]
	websiteLink.href = "http://www." + converters[converter][2]
	document.getElementById("mySidenav").appendChild(websiteLink)







}


async function geocodeTHIS(location, i) {

}

function test() {
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

async function getContractData(){
	verifiedHashes = new Array()

	let numHashes = await contract.numConverters()

	for (var l = 0;l<numHashes;l++){
		console.log(l)
		verifiedHashes.push(await contract.converters(l))
	}

	localStorage.setItem("verifiedHashes",JSON.stringify(verifiedHashes))
	localStorage.setItem("lastRead",Date.now());
}


function collapseHours(HoursElement,content){
	console.log(HoursElement)
	console.log(content)
  HoursElement.addEventListener("click", function() {
    this.classList.toggle("active");
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });

}


/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
	console.log("abc")
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("map").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("map").style.marginLeft = "0";
}
