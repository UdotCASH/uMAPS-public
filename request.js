var server = "https://gentle-peak-60588.herokuapp.com"

function testRequest(from, to) {

  var params = "?" + "from=" + from.toString() + "&to=" + to.toString()
   var xhttp = createCORSRequest('GET', server + "/one" + params);
   sendRequest(xhttp)
}

async function fetchConverters(){
  var xhttp = createCORSRequest('GET', server + "/converters");
  await sendRequest(xhttp,"converters")
  return new Promise(function(resolve) {

		setTimeout(resolve, 0);
		});
}

async function fetchCoords(){
  var xhttp = createCORSRequest('GET', server + "/coords");
  await sendRequest(xhttp,"coords")
  return new Promise(function(resolve) {

		setTimeout(resolve, 0);
		});
}

async function fetchHashes(){
  var xhttp = createCORSRequest('GET', server + "/hashes");
  await sendRequest(xhttp,"hashes")
  return new Promise(function(resolve) {

    setTimeout(resolve, 0);
    });
}

async function sendRequest(xhttp,requestType){
  if (!xhttp) {
    throw new Error('CORS not supported');
  }

  xhttp.onload = function() {
   var responseText = xhttp.responseText;
   if(requestType=="converters"){
   converters = JSON.parse(responseText)
 } else if(requestType=="coords"){
   coords=JSON.parse(responseText)
 } else if(requestType=="hashes"){
   hashes=JSON.parse(responseText)
 }
   // process the response.
  };

  xhttp.onerror = function() {
    console.log('There was an error!');
  };

    var data = {fname:"asdfasdf",lname:"assdo"}
    xhttp.send(data);

    return new Promise(function(resolve) {

      setTimeout(resolve, 0);
      });
}



function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);


  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}
