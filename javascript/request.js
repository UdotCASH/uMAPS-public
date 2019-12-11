var server = "https://gentle-peak-60588.herokuapp.com"

async function testRequest(from, to) {

  var params = "?" + "from=" + from.toString() + "&to=" + to.toString()
   var xhttp = await createCORSRequest('GET', server + "/one" + params);
   await sendRequest(xhttp)
}

async function fetchConverters(){

  var xhttp = await createCORSRequest('GET', server + "/converters");
  await sendRequest(xhttp,"converters",750)
  if(converters!=null){
  console.log("got converters")
}

  return new Promise(function(resolve) {

		setTimeout(resolve, 0);

		});

}

async function fetchCoords(){

  var xhttp = await createCORSRequest('GET', server + "/coords");
  await sendRequest(xhttp,"coords",200)
  if(converters!=null){
  console.log("got coords")
}
  return new Promise(function(resolve) {

		setTimeout(resolve, 0);

		});
}

async function fetchHashes(){

  var xhttp = await createCORSRequest('GET', server + "/hashes");
  await sendRequest(xhttp,"hashes",200)
  if(converters!=null){
  console.log("got hashes")
}  return new Promise(function(resolve) {

    setTimeout(resolve, 0);


    });
}

async function sendRequest(xhttp,requestType,data){
  if (!xhttp) {
    throw new Error('CORS not supported');
  }
  xhttp.onload = function() {
   var responseText = xhttp.responseText;
   if(requestType=="converters"){
   converters = JSON.parse(responseText)
 } else if(requestType=="coords"){
   coords= JSON.parse(responseText)
 } else if(requestType=="hashes"){
   hashes=  JSON.parse(responseText)
 }

   // process the response.
  };

  xhttp.onerror = function() {
    console.log('There was an error!');
  };

    var data = {fname:"asdfasdf",lname:"assdo"}
    xhttp.send(data);
    return new Promise(function(resolve) {

      (function waitForData(){
        let data;
        if(requestType=="converters"){
        data = converters
      } else if(requestType=="coords"){
        data = coords
      } else if(requestType=="hashes"){
        data = hashes
      }
          if (data!=null) return resolve();
          console.log(requestType)
          setTimeout(waitForData, 30);
      })();
      // setTimeout(resolve,2000);
      //
      // });
})
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

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(xhr);
    }, 200);
  });

}
