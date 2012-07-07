//Listen message from extension pages
chrome.self.onConnect.addListener(function(port,name){

	port.onMessage.addListener(function(info,con){
		console.log("message from server received.type="+info.requestType);
		if(info.requestType=="pageInfo"){
			console.log("type=pageinfo");
			var con=chrome.extension.connect();
			con.postMessage({responseType:"pageInfo",
									url:location.href,
									title:document.title,
									referrer:document.referrer});
		}
	});
});