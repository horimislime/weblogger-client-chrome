var apiUrl='http://localhost:8080/weblogger';
var counterUrl='http://localhost:8080/weblogger/count';

function getUserId(){
	return localStorage["weblogger_id"];
}

function updateBadge(userId){
	var request=new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState==4){
			chrome.browserAction.setBadgeText({text:request.responseText});
		}
	};
	request.open("GET",apiUrl+"/count?userId="+userId,true);
	request.send(null);
	
	return;
}

function commitUrl(userId,curUrl,pageTitle,pageReferrer){
	//Schema to ignore
	["https","chrome","about","file"].forEach(function(scheme){
		if(scheme==curUrl.split(":",2)){
			return;
		}
	});

	var request = new XMLHttpRequest();
	request.onreadystatechange=function(){
		if(request.readyState==4){
			console.log('request success');
		}
	};

	request.open("POST",apiUrl+"/upload",true);
	request.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
	request.send(encodeURIComponent('{"userid":' + userId + ',"url":"' + curUrl + '","title":"' + 
		pageTitle + '", "time":' + new Date().getTime() + '}'));
}

function run(){
	chrome.tabs.onUpdated.addListener(function(tabId,info,tab){
		if(info.status=="complete"){
			var con=chrome.tabs.connect(tabId);
			con.postMessage({requestType:"pageInfo"});
		}
	});

	chrome.self.onConnect.addListener(function(port,name){
		port.onMessage.addListener(function(info,con){
			if(info.responseType=="pageInfo"){
				var userId=getUserId();

				if(! userId){
					alert("Weblogger userID isn't set!");

				}else{
					updateBadge(userId);
					commitUrl(userId,info.url,info.title,info.referrer);
				}
			}
		});
	});
}