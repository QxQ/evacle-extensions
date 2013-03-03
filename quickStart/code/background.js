enabled = true
function disable(enabled) {
	if (enabled) {
		chrome.browserAction.setIcon({path:"enabled.png"})
		chrome.browserAction.setTitle({title:"enable extenstions"})
		chrome.management.getAll( function(extenstions) {
			
			store = ""
			proceed = false
			for (var i=0;i<extenstions.length-1;++i) {
				store = store + extenstions[i].id+","+((extenstions[i].enabled)?1:0)+"|"
				if (extenstions[i].enabled && extenstions[i].name != "Quick Start") {
					proceed = true
				}
			}
			store += extenstions[extenstions.length-1].id+","+((extenstions[extenstions.length-1].enabled)?1:0)
			
			if (proceed) {
				localStorage["extenstions"] = store
			}
			
			for (var i=0;i<extenstions.length;++i) {
				if (extenstions[i].enabled && extenstions[i].name != "Quick Start") {
					chrome.management.setEnabled(extenstions[i].id,false)
				}
			}
		});
		
	} else {
	
		chrome.browserAction.setIcon({path:"disabled.png"})
		chrome.browserAction.setTitle({title:"disable extenstions"})
		
		store = localStorage["extenstions"].split("|")
		oldExtenstions = []
		for (var i=0;i<store.length;++i) {
			oldExtenstions[oldExtenstions.length] = store[i].split(",")
		}
		
		chrome.management.getAll( function(extenstions) {
			for (var i=0;i<extenstions.length;++i) {
				for (var j=0;j<oldExtenstions.length;++j) {
					if (extenstions[i].id == oldExtenstions[j][0] && oldExtenstions[j][1] != 0 && extenstions[i].name != "Quick Start") {
						chrome.management.setEnabled(extenstions[i].id,true)
					}
				}
			}
		});

		
		
	}
}
chrome.browserAction.onClicked.addListener(function(tab) {
	enabled = !(enabled)
	disable(enabled)
});

startUp = true
setTimeout(function() {startUp=false},1500);
chrome.management.onEnabled.addListener(function(info){
	if (enabled && startUp)
		chrome.management.setEnabled(info.id,false);
});

disable(true)
