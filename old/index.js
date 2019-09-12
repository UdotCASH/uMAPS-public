let contract
let contractAddress =  "0xd4c39831c9095d936594cd96ed457a4183243fe4"
let contractABI = [
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
				"name": "name",
				"type": "string"
			},
			{
				"name": "phoneNumber",
				"type": "string"
			},
			{
				"name": "_address",
				"type": "string"
			},
			{
				"name": "city",
				"type": "string"
			},
			{
				"name": "telegram",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
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
				"name": "numNewConverters",
				"type": "uint256"
			},
			{
				"name": "names",
				"type": "string[]"
			},
			{
				"name": "phoneNumbers",
				"type": "string[]"
			},
			{
				"name": "_address",
				"type": "string[]"
			},
			{
				"name": "cities",
				"type": "string[]"
			},
			{
				"name": "telegrams",
				"type": "string[]"
			}
		],
		"name": "addConverters",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
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
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	}
]

var geocoder;
var map;
var converters
var numConverters
var markers

 async function initialize(web3) {

  provider = new ethers.providers.Web3Provider(web3.currentProvider);

  utils = ethers.utils;

  let accounts = await provider.listAccounts()
  signer = provider.getSigner(accounts[0])
	contract = new ethers.Contract(contractAddress, contractABI, signer);

	let lastUpdated = await contract.lastUpdated()
	lastUpdated = lastUpdated.toNumber()
	var lastRead = localStorage.getItem("lastRead");
	console.log(lastUpdated,lastRead)

	if(lastUpdated*1000>lastRead||lastRead==null){
		console.log("getcontractData")
		await getContractData()
	}

		populateMarkers()



}

  function initMap() {
    geocoder = new google.maps.Geocoder();

    // The location of Uluru
var uluru = {lat: -25.344, lng: 131.036};
// The map, centered at Uluru

// The marker, positioned at Uluru
    map = new google.maps.Map(document.getElementById('map'), {
      center: uluru,
      zoom: 8
    });

    //var marker = new google.maps.Marker({position: uluru, map: map});

  }

async function addConverter(){

	var name = document.getElementById('name').value;

  var address = document.getElementById('address').value;
	var telegram = document.getElementById('telegram').value;
	console.log(name)
	console.log(address)
  await contract.addConverter(name,address,telegram);


}

async function populateMarkers(){
	markers = new Array()
  await createMarkers()
	console.log(markers)
  console.log("asdfasdfasdlfkjasldkfj;asldkfj;alskj")
	await createMarkerCluster()

}

async function createMarkerCluster(){
	markerCluster = new MarkerClusterer(map, markers,
            {imagePath: '../images'});
}
async function createMarkers(){
	let t;
	numConverters = localStorage.getItem("numConverters");

	try{
	converters = JSON.parse(localStorage.getItem("converters"))
} catch {
	converters = new Array()
}

	for(t = 0;t<numConverters;t++){
		 await createMarker(t)
  }

	return new Promise((resolve, reject) =>{})

}

async function createMarker(t) {
	console.log(numConverters)
	console.log(converters)

		let name = converters[t][0]

		let location = converters[t][2] + " , " + converters[t][3]


		console.log("Name: ", name)
		console.log("Location: ", location)


		geocoder.geocode( { 'address': location}, function(results, status) {
			if (status == 'OK') {

				marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
				});

				var infoNode = document.createElement("div")

				var UCASHT = document.createElement("p")
				infoNode.appendChild(UCASHT)
				UCASHT.innerText = "Verified U.CASH Converter"

				let name = converters[t][0]
				var nameT = document.createElement("p")   //name Text
				nameT.innerText = name
				infoNode.appendChild(nameT)


				let telephone = converters[t][1]
				var telephoneT = document.createElement("p")
				telephoneT.innerText = telephone
				infoNode.appendChild(telephoneT)

				let location = converters[t][2]
				var locationT = document.createElement("p")
				locationT.innerText = location
				infoNode.appendChild(locationT)

				// let streetNo = converters[t][2]
				// var streetNoT = document.createElement("p")
				// streetNoT.innerText = streetNo
				// infoNode.appendChild(streetNoT)
				//
				// let street = converters[t][3]
				// var streetT = document.createElement("p")
				// streetT.innerText = street
				// infoNode.appendChild(streetT)


				// let unit = converters[t][4]
				// var unitT = document.createElement("p")
				// unitT.innerText = unitT
				// infoNode.appendChild(unitT)

				let city = converters[t][3]
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

			let telegram = converters[t][4]
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

			map.setCenter(results[0].geometry.location);
			markers.push(marker)
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.open(map,markers[t]);
			});

		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}

	});
}

async function getContractData(){
	console.log("aaa")

	let numConverters = await contract.numConverters()
	localStorage.setItem("numConverters",numConverters)
	let converters = new Array()
	for(t = 0;t<numConverters;t++){
		let converter = await contract.converters(t)
		let location = converter._address
		let name = converter.name
		let telegram = converter.telegram
		converters.push(converter)
	}
localStorage.setItem("converters", JSON.stringify(converters))
localStorage.setItem("lastRead", Date.now())
console.log(localStorage.getItem("lastRead"))

	return new Promise(function(resolve) {


		console.log("Converters: ",localStorage.getItem("converters"))

		setTimeout(resolve, 0);
    });
}

function testtest(){

}


let tnum
let tnames = new Array()
let ttelephones = new Array()
let taddresses = new Array()
let tcities = new Array()
let ttelegrams = new Array()

function Upload() {

	let newConverters = new Array()

			var csvUpload = document.getElementById("csvUpload");
			var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
			if (regex.test(csvUpload.value.toLowerCase())) {

				// if (typeof (FileReader) != "undefined") {
				// 	var reader = new FileReader();
				// 	reader.onload = function (e) {
				// 	var table = document.createElement("table");
				// 	var rows = e.target.result.split("\n");
				// 	for (var i = 0; i < rows.length; i++) {
				// 			var row = table.insertRow(-1);
				// 			var cells = rows[i].split(",");
				// 		for (var j = 0; j < cells.length; j++) {
				// 			var cell = row.insertCell(-1);
				// 			cell.innerHTML = cells[j];
				// 		}
				// 	}
				// 	var dvCSV = document.getElementById("dvCSV");
				// 	dvCSV.innerHTML = "";
				// 	dvCSV.appendChild(table);
				localStorage.setItem("converters","")
				if (typeof (FileReader) != "undefined") {
					var reader = new FileReader();
					reader.onload = function (e) {
					var rows = e.target.result.split("\n");
					tnum = rows.length
					for (var i = 0; i < tnum; i++) {
							var cells = rows[i].split(",");
							console.log(cells)



						// try{
						// 	ttelegrams.push(cells[0].toString())
						// } catch {
						// 	ttelegrams.push("")
						// }


					}

		}

		reader.readAsText(csvUpload.files[0]);

		} else {
			alert("This browser does not support HTML5.");
		}
		} else {
			alert("Please upload a valid CSV file.");
		}


}

async function addConverters() {

	let overrides = {
		gasLimit:4000000
	}
	console.log(tnames)
	console.log(ttelephones)
	console.log(taddresses)
	console.log(tcities)
	console.log(ttelegrams)


	await contract.addConverters(tnum-3,tnames,ttelephones,taddresses,tcities,ttelegrams,overrides)

}
