// Allows Background.js to receive event that the popup was opened
chrome.runtime.sendMessage({popupOpen: true});
//Once Message is sent from Background.js, returns src uri for image
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  switch (request.method) 
	{
	case 'setScreenshotUrl':
		//handles the image being set in the form
		document.getElementById('target').src = request.data;
		sendResponse({result: 'success'});
		break;
	case 'getAppName':
		//parses the url from background.js and reveals Application Name
		var full = request.data;
		var newUrl =  full.split('/');
		var appNameTemp =  newUrl[3];
	    function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		document.querySelector('#applicationName').value =capitalizeFirstLetter(appNameTemp);
		sendResponse({result: 'success'});
		break;
	}
});
//adds event listener to the submit button
document.querySelector('#optionsSubmit').addEventListener('click',sendRequester);
//handles XMLHttp requst, POST
function sendRequester(){
	//values taken from form data including issue description and application name
	var requestDescription=document.querySelector('#issueDescription').value;
	var requestAppName=document.querySelector('#applicationName').value;
	//request template
	var tempRequest ={
		"caller_id":"681ccaf9c0a8016400b98a06818d57c7",
		"business_service": "27d32778c0a8000b00db970eeaa60f16",
		"short_description" :requestDescription

	}
	
	//return back as string to send to ServiceNow API
	var sendRequest = JSON.stringify(tempRequest);
	
	var client=new XMLHttpRequest();
	//opening connect to API at servicenow 
	client.open("post","https://dev43365.service-now.com/api/now/table/incident");
		
	client.setRequestHeader('Accept','application/json');
	client.setRequestHeader('Content-Type','application/json');
		
	//UserName="admin", Password="admin" for servicenow api
	client.setRequestHeader('Authorization', 'Basic '+btoa('admin'+':'+'HufDQJWj8ne8'));

		
	client.onreadystatechange = function() {
					 if(this.readyState = this.DONE) {
										if(this.response != null)
										{
											var item =JSON.parse(this.response);
											document.querySelector("#sendInfo").innerHTML ="Ticket Created: "+ item.result.number;
										}
									

										
					 }
	};
	client.send(sendRequest);
}





