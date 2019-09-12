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
var numConverters
var markers
var positions


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

	hashes = JSON.parse(localStorage.getItem("hashes"))
	converters = JSON.parse(localStorage.getItem("converters"))

	if(converters==null){
		converters = new Array()
	}

	if(hashes==null){
		hashes = new Array()
	}

	if(lastUpdated*1000>lastRead||lastRead==null){
		console.log("getcontractData")
		await getContractData()
	}

		populateMarkers()

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

	try{
	converters = JSON.parse(localStorage.getItem("converters"))
		if(converters==null){
			converters = new Array()
		}
} catch {
	converters = new Array()
}

console.log(converters)

numConverters = converters.length;
console.log(numConverters)

try{
	hashes = JSON.parse(localStorage.getItem("hashes"))
		if(hashes==null){
			hashes = new Array()
		}
} catch {
	hashes = new Array()
}

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


		let location = converters[t][12] + " "
		 + converters[t][13] + " , "
		 + converters[t][15] + " , "
		 + converters[t][16] + " , "
		 + converters[t][18]


		let verifiedHash

		try{
			verifiedHash = await contract.converters(t)
		}

		catch{
			verifiedHash = ""
		}

				marker = new google.maps.Marker({
						map: map,
						position: positions[t+2]
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

async function getContractData(){
	console.log("aaa")


	let converters = new Array()
	// for(t = 0;t<numConverters;t++){
	// 	let converter = await contract.converters(t)
	// 	// let location = converter._address
	// 	// let name = converter.name
	// 	// let telegram = converter.telegram
	// 	converters.push(converter)
	// }
localStorage.setItem("lastRead", Date.now())

	return new Promise(function(resolve) {

		setTimeout(resolve, 0);
    });
}

async function Upload() {

	let Converters = new Array()
	let Hashes = new Array()
	positions = new Array()

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

					var cells = rows[1].split(",");

					let types = new Array()
					for (var j = 0; j < cells.length; j++) {
								var cell = cells[j];
								types.push(cell)
							}

							for(let r=2;r<tnum-1;r++){
								var cells;

								setTimeout(function(){

									console.log(r)
									cells = rows[r].split(",");
									let converter = new Array()
											console.log(cells)
											for (var j = 0; j < cells.length; j++) {
														var cell = cells[j];
														converter.push(cell)
											 		}
											let hash = utils.solidityKeccak256(types,converter)
											Converters.push(converter)
											Hashes.push(hash)

											let location = converter[12] + " "
											 + converter[13] + " , "
											 + converter[15] + " , "
											 + converter[16] + " , "
											 + converter[18]

											 geocoder.geocode( { 'address': location}, function(results, status) {
										 			positions[r] = results[0].geometry.location
													console.log(location)
													localStorage.setItem("converters",JSON.stringify(Converters))
													localStorage.setItem("hashes",JSON.stringify(Hashes))
													localStorage.setItem("positions",JSON.stringify(positions))
										 		})
								}, 1000*r);
						}
						console.log(Converters)
						console.log(Hashes)




		}

		reader.readAsText(csvUpload.files[0]);

		} else {
			alert("This browser does not support HTML5.");
		}
		} else {
			alert("Please upload a valid CSV file.");
		}

}

async function geocodeTHIS(location, i) {

}

async function addConverters() {

	let overrides = {
		gasLimit:4000000
	}

	hashes = JSON.parse(localStorage.getItem("hashes"))

	await contract.addConverters(hashes,overrides)

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
