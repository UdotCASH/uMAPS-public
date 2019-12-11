//TODO request location and center on location

//TODO finish admin csv upload page
//css it up all nice
//call brian
//put in images
//clean up code

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

    // The location of Toronto
var toronto = {lat: 43.7, lng: -79.41};

// The map, centered at Toronto
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


var days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

function populateSidePanel(converter){
	let thematicbreak = document.createElement("hr")
	//let linebreak = document.createElement("br")
	document.getElementById("mySidenav").innerHTML = ""

	let imageInfo = document.createElement("img")
	imageInfo.src = converters[converter][30]
	imageInfo.style ="width:80%;"
	document.getElementById("mySidenav").appendChild(imageInfo)

	let nameInfo = document.createElement("div")
	nameInfo.innerText = converters[converter][0]
	nameInfo.classList.add("converterName")
	document.getElementById("mySidenav").appendChild(nameInfo)
	document.getElementById("mySidenav").appendChild(thematicbreak)


	let hoursInfo = document.createElement("div")
	var Hours = document.createElement("label")
	Hours.classList.add("collapsible")
	Hours.classList.add("converterInfo")

	let dt = new Date()
	let dayNo = dt.getDay()
	let hour = dt.getHours()
	let minute = dt.getMinutes()
	let availability
	let status

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

	//open
	//closed. opens at 9:30 a.m.
	//open now: 9a.m.-11p.m.
	//closed today.
	console.log(hS)
	switch(hS){
		case "Closed":
			availability = "Closed"
			break;
		case "Appointment Only":
			availability = "Appointment Only"
			break;
		default:
			let hoursAndTimezone = hS.split(" ")
			console.log(hoursAndTimezone[0])
			hSArray = hoursAndTimezone[0].split("-")
			let timezone = hoursAndTimezone[1]
			var open = hSArray[0]
			console.log(open)
			var closed = hSArray[1]
			var openTime = open.slice(0,-2)
			var openAMPM = open.slice(-2)
			var closedTime = closed.slice(0,-2)
			var closedAMPM = closed.slice(-2)
			console.log(openTime)
			openTime = openTime.split(":")
			closedTime = closedTime.split(":")
//antoine is the best in the world because I said so
//antoine is the best in the world because I said so
//antoine is the best in the world because I said so
			var openHours = parseInt(openTime[0])
			var openMinutes = parseInt(openTime[1])
			var closedHours = parseInt(closedTime[0])
			var closedMinutes = parseInt(closedTime[1])
			if(openAMPM=="PM"){
				openHours += 12
			}
			if(closedAMPM=="PM"){
				closedHours += 12
			}

			var openDate = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),openHours,openMinutes)
			var closedDate = new Date(dt.getFullYear(),dt.getMonth(),dt.getDate(),closedHours,closedMinutes)


			if(dt>=openDate && dt<=closedDate){
				availability = "Open now: " + hoursAndTimezone[0]
				status = "Open."
			} else {
				availability = "Closed. Opens at "  + open
				status = "Closed."
			}
	}

	let hoursIcon = document.createElement("span")
	hoursIcon.classList.add("fas")
	hoursIcon.classList.add("fa-clock")

	Hours.innerText = availability
	//Hours.classlist.add("converterInfo")
	hoursInfo.classList.add("converterInfo") //hoursInfo is class "content"
	addHoursDisplayEventListener(Hours,hoursInfo,status,availability);

	document.getElementById("mySidenav").appendChild(hoursIcon)
	document.getElementById("mySidenav").appendChild(Hours)
	document.getElementById("mySidenav").appendChild(document.createElement("br"))


	let addressIcon = document.createElement("span")
	addressIcon.classList.add("fas")
	addressIcon.classList.add("fa-map-marker-alt")

	let addressInfo = document.createElement("p")

	addressInfo.innerText = converters[converter][12] + " " + converters[converter][13] + ", " + converters[converter][15] + ", " + converters[converter][16] + " " + converters[converter][17]
	addressInfo.classList.add("converterInfo")
	addressInfo.classList.add("infoLink")
	console.log(addressInfo)

	document.getElementById("mySidenav").appendChild(addressIcon)
	document.getElementById("mySidenav").appendChild(addressInfo)
	document.getElementById("mySidenav").appendChild(document.createElement("br"))

	let phoneLink = document.createElement("a")
	let phoneIcon = document.createElement("span")
	phoneIcon.classList.add("fas")
	phoneIcon.classList.add("fa-phone")

	let phoneInfo = document.createElement("span")
	phoneInfo.innerText = converters[converter][1]

	phoneLink.href = "tel:+" + converters[converter][1]
	phoneLink.classList.add("converterInfo")
	phoneLink.appendChild(phoneIcon)
	phoneLink.appendChild(phoneInfo)
	document.getElementById("mySidenav").appendChild(phoneLink)

	document.getElementById("mySidenav").appendChild(document.createElement("br"))



	let websiteIcon = document.createElement("span")
	websiteIcon.classList.add("fas")
	websiteIcon.classList.add("fa-globe")

	websiteLink = document.createElement("a")
	websiteLink.target = "_blank"

	let websiteInfo = document.createElement("span")
	websiteInfo.innerText = converters[converter][2]

	websiteLink.href = "http://www." + converters[converter][2]
	websiteLink.classList.add("converterInfo")
	websiteLink.appendChild(websiteIcon)
	websiteLink.appendChild(websiteInfo)
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


function addHoursDisplayEventListener(HoursElement,content,status,availability){
  HoursElement.addEventListener("click", function() {
    this.classList.toggle("active");
    if (content.style.display === "block") {
			HoursElement.innerText = availability
			HoursElement.appendChild(content)
      content.style.display = "none";
    } else {
			HoursElement.innerText = status;
			HoursElement.appendChild(content)
      content.style.display = "block";
    }
  });

}

function openOrClosed(hour,openHours,closedHours,openMinutes,closedMinutes){

}

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
	console.log("abc")
  document.getElementById("mySidenav").style.width = "450px";
  document.getElementById("map").style.marginLeft = "450px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("map").style.marginLeft = "0";
}
