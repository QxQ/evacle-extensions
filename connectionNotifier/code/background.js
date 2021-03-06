//initialiaing variables
var notifications = []
var conected = navigator.onLine

settings = {}

displayConvert = {both:0, noPopup:1, noIcon:2}

function notify(lost) {//shows a message based on weather you have internet connection and how soon the last message was sent
	chrome.storage.sync.get(['display'], function(settings) {
		if (settings.display == undefined) {
			settings.display = 0
		}
		if (settings.display != displayConvert['noPopup']) {
			if (lost && notifications.length==0) {
				var notification = webkitNotifications.createNotification(
					  "lost.png",
					  "connection lost",
					  "oh no! chrome can't reach the internet right now. try googling for help."
				);
			} else if (notifications.length==0) {
				var notification = webkitNotifications.createNotification(
					  "found.png",
					  "connection found!",
					  "yes! now you can google."
				);
			} else if (lost) {
				var notification = webkitNotifications.createNotification(
					  "lost.png",
					  "never mind",
					  "ignore that last message"
				);
			} else {
				var notification = webkitNotifications.createNotification(
					  "found.png",
					  "never mind",
					  "ignore that last message"
				);
			}
			notification.onclick = function(){removeNotification(notifications.length)} //remove notification when clicked
			notification.show() //shows the notificatino
			notifications[notifications.length] = {'notification':notification,'timer':setTimeout(removeNotification,5000)}; //removes notification after an amount of time
		}
	});
}
function removeNotification(index) {
	if (index == null) index=0;
	notifications[0].notification.cancel() //hides the notification
	clearTimeout(notifications[0].timer) //removes the timer for the notification that can call this function
	notifications.splice(0,1) //removes notification from list
}

function showIcon(tab) { //show icon in address bar if there is no internet
	chrome.storage.sync.get(['display'], function(settings) {
		if (settings.display == undefined) {
			settings.display = 0
		}
		if (conected==false && settings.display != displayConvert['noIcon']) {
			chrome.pageAction.show(tab.id)
		} else {
			chrome.pageAction.hide(tab.id)
		}
	});
}

chrome.tabs.onActiveChanged.addListener(function(tabId) { chrome.tabs.get(tabId,function(tab){showIcon(tab)}) }); //updates icon in address bar if tab is changed
chrome.tabs.onUpdated.addListener(function(tabId){ chrome.tabs.get(tabId,function(tab){showIcon(tab)}) });// updates icon when webpage changes

window.addEventListener('online', function(){ //tells user when their is internet connection
	if (conected==false) notify(false);
	conected=true
	chrome.tabs.getSelected(null,showIcon)
});

window.addEventListener('offline', function(){ //tells user when their isn't internet connection
	notify(true)
	conected=false
	chrome.tabs.getSelected(null,showIcon)
});

chrome.pageAction.onClicked.addListener(function() { //hides icon in addressbar when clicked
	conected=null
	chrome.tabs.getSelected(null, showIcon)	
});

chrome.tabs.getSelected(null, showIcon) //show/hide icon in address bar when extension first loads.
