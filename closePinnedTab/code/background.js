function showIcon(tabId,selectInfo) {//checks if tab is pinned, and if so, show the icon, otherwise, hide it.
	chrome.tabs.get(tabId, function(tab){
		if (tab.pinned) {
				chrome.pageAction.show(tab.id)
		} else {
				chrome.pageAction.hide(tab.id)
		}
	});
}
chrome.tabs.query({active:true}, function(tabs) { //show/hide the icon on the active page when the extension first loads
	showIcon(tabs[0].id)
});

chrome.tabs.onActiveChanged.addListener(showIcon); //show/hide the icon everytime you change the tab you are viewing
chrome.tabs.onUpdated.addListener(function(tabID,changeInfo,tab){showIcon(tab.id)}); //shows/hide the icon when you pin/unpin a tab

chrome.pageAction.onClicked.addListener(function(tab) { //closes the tab when the icon is clicked
	chrome.tabs.remove(tab.id);
});
