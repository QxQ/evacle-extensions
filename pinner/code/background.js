//-- some easaly changed variabled --//
_changeIcon = true //change this variable to false if you don't like the icon changing. (default true, may change to false in the future)

if (!_changeIcon) { //changed default icon to logo if _changeIcon is false
	chrome.browserAction.setIcon({path:'pin_without_tab.png'})
}

//-- this is a small easter egg, used to create a simple widget with awesome new tab page --//
//! there is a bug in the widget, that gives a "page not found error" inside the widget when developing it.

var info = {
  "poke"    :   3,              // poke version 2
  "width"   :   1,              // 406 px default width
  "height"  :   1,              // 200 px default height
  "path"    :   "widget.html",
  "v2"      :   {
                  "resize"    :   true,  // Set to true ONLY if you create a range below.
                  "min_width" :   1,     // 200 px min width
                  "max_width" :   2,     // 406 px max width
                  "min_height":   1,     // 200 px min height
                  "max_height":   2      // 200 px max height
                },
   "v3"      :   {
                  "multi_placement": false // Allows the widget to be placed more than once
                                          // Set to false unless you allow users to customize each one
                },
};

// Below is the required poke listener
// do not modify
chrome.extension.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if(request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke") {
    chrome.extension.sendMessage(
      sender.id,
      {
        head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
        body: info,
      }
    );
  }
});
// Above is the required poke listener

//this code is what is ran when the widget is clicked
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	if (sender.tab.url=='chrome://newtab/') {
		if (request.pinTab==true) {
			chrome.tabs.update(sender.tab.id, { pinned:(!sender.tab.pinned) }, function(){
				changeIcon(sender.tab.id,{})
			});
		}
	}
  });

//-- this is the actual extension --//

function changeIcon(tabId, selectInfo) { //this function is used to update icon image on the button
	chrome.tabs.get(tabId, function(tab){
		if (tab.pinned) {
				if (_changeIcon)
					{ chrome.browserAction.setIcon({path:"unpin.png"}) }
				chrome.browserAction.setTitle({title:"unpin tab (ALT P)"})
		} else {
				if (_changeIcon)
					{ chrome.browserAction.setIcon({path:"pin.png"}) }
				chrome.browserAction.setTitle({title:"pin tab (ALT P)"})
		}
	});
}

chrome.tabs.query({active:true}, function(tabs) { //used to find wither the current tab is pinned or not when extension is first ran, and updates icon accordingly
	changeIcon(tabs[0].id)
});

chrome.tabs.onActiveChanged.addListener(changeIcon); //updates icon everytime a tab is pinned or unpinned

chrome.browserAction.onClicked.addListener(function(tab) { //pins/unpins a tab when button is clicked
	chrome.tabs.update(tab.id, { pinned:(!tab.pinned) }, function(){} )
	changeIcon(tab.id)
});

//set the badge text to tell user about hotkey. this is temporary and will be removed later.
chrome.browserAction.setBadgeText({text:"alt p"})
