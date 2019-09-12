var ethers = require('ethers')
let utils = ethers.utils;
const csv = require('csv-parser');
const fs = require('fs');

const http = require('http')
const port = 3000

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

let i = 0
let types

let converters = new Array();
let coords = new Array();

fs.readFile('../msb3.csv', function read(err, data) {

    if (err) {
        throw err;
    }
    var rows = data.toString().split("\n");

    var cells = rows[1].split(",");

    let types = new Array()
    for (var j = 0; j < cells.length; j++) {
          var cell = cells[j];
          types.push(cell)
        }

    for(let r=2;r<rows.length-1;r++){
        var cells;

        cells = rows[r].split(",");
        let converter = new Array()

        for (var j = 0; j < cells.length; j++) {
            var cell = cells[j];
            converter.push(cell)
        }

        let hash = utils.solidityKeccak256(types,converter)


        let location = converter[12] + " "
         + converter[13] + " , "
         + converter[15] + " , "
         + converter[16] + " , "
         + converter[18]

				converters.push(converter)
      }

});

fs.readFile('../coords.csv', function read(err, data) {

    if (err) {
        throw err;
    }
    var rows = data.toString().split("\n");

    var cells = rows[1].split(",");

    let types = new Array()
    for (var j = 0; j < cells.length; j++) {
          var cell = cells[j];
          types.push(cell)
        }

    for(let r=2;r<rows.length-1;r++){
        var cells;

        cells = rows[r].split(",");
        let coord = new Array()

        for (var j = 0; j < cells.length; j++) {
            var cell = cells[j];
            coord.push(cell)
        }

        let lat = coord[0]
        let lng = coord[1]

				coords.push(coord)
      }
});

var geocoder;
var map;
var hashes
var numConverters
var markers
var positions

//initialize()
async function initialize() {

 provider = ethers.getDefaultProvider('rinkeby');

 contract = new ethers.Contract(contractAddress, contractABI, provider);

 let lastUpdated = await contract.lastUpdated()
 lastUpdated = lastUpdated.toNumber()

 let numConverters = await contract.numConverters()
 for (let m = 0; m<numConverters; m++){
   let converter = await contract.converters(m)
 }
}

async function Upload() {

	let Converters = new Array()
	let Hashes = new Array()
	positions = new Array()

			var csvUpload = document.getElementById("csvUpload");
			var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
 			if (regex.test(csvUpload.value.toLowerCase())) {

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

									cells = rows[r].split(",");
									let converter = new Array()
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
													localStorage.setItem("converters",JSON.stringify(Converters))
													localStorage.setItem("hashes",JSON.stringify(Hashes))
													localStorage.setItem("positions",JSON.stringify(positions))
										 		})
								}, 1000*r);
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

//
// upload csv
// load converter info
//
// serve marker locations and converter info

const requestHandler = (request, response) => {
  console.log(request.url)

	const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    /** add other headers as per requirement */
  };

  if (request.method === 'OPTIONS') {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  if (['GET', 'POST'].indexOf(request.method) > -1) {
    response.writeHead(200, headers);
		let requestSplit = request.url.split("?")

		if(requestSplit[0]=="/one"){

			let responseString = new String()

			let params = requestSplit[1].split("&")
				for (let i = 0;i<params.length;i++){
					let keyValue = params[i].split("=")
					let key = keyValue[0]
					let value = keyValue[1]
					responseString += key + ": " + value + "\n"
				}
				response.end(responseString)
				return;
			} else if(requestSplit[0]=="/converters"){
					response.end(JSON.stringify(converters))
			} else if(requestSplit[0]=="/coords"){
					response.end(JSON.stringify(coords))
			}else {

		response.writeHead(200, headers);
		response.end(" method is not allowed for the request.")

		return;
		}


}
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
