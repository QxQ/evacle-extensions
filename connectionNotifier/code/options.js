//chrome.storage.sync.clear()

function beforeUnload(){
	return 'your changes are still being saved. are you sure you want to navigate away?'
}

function save(name, value) { //auto saves every time
	window.onbeforeunload = beforeUnload
	set = {}
	set[name] = value
	chrome.storage.sync.set(set, function() {
		window.onbeforeunload = null
	});
}
function initSettings() { //initializes code before checkBox function can be used
	var group = document.createElement('div')
	group.style.marginTop = '55px'
	group.id = 'options'
	/* storage isn't an optional permission, this code can't be used.
	chrome.permissions.contains({permissions: ['storage'] },  //requests optional permisions to use "storage"
		function(result) {
			if (!result) {
				document.getElementById('additional-permisions').addEventListener('click', function(event) {
  					chrome.permissions.request({ permissions: ['storage'] }, function(granted) {
    					if (granted) {
    						document.getElementById('overlay').style.display='none'
							document.getElementById('overlay-box').style.display='none'
    					}
  					});
				});
				document.getElementById('overlay').style.display='block'
				document.getElementById('overlay-box').style.display='block'
			}
		});
	*/
	document.body.appendChild(group)
}
function checkBox(name, text, defaultValue) { //creates a checkbox
	chrome.storage.sync.get([name], function(reply) {
		if (defaultValue == null)
			defaultValue = false;
		var label = document.createElement('label')
			var checkbox = document.createElement('input')
			checkbox.type = 'checkBox'
			checkbox.name = name
			checkbox.id = name
			checkbox.checked = (reply[name]!=undefined)?reply[name]:defaultValue
			checkbox.onchange = function() {save(this.id,this.checked)}
		label.appendChild(checkbox)
			var par = document.createElement('p')
			par.style.display = 'inline'
			par.innerHTML = text
		label.appendChild(par)
		label.appendChild( document.createElement('br') )
		document.getElementById('options').appendChild(label)
	});
}
function radio(name, texts, defaultValue) { //creates a radio button
	chrome.storage.sync.get([name], function(reply) {
		if (defaultValue == null)
			defaultValue = 0;
		for (i=0;i<texts.length;++i) {
			var label = document.createElement('label')
				var radio = document.createElement('input')
				radio.type = 'radio'
				radio.name = name
				radio.id = name+' - '+i
				radio.checked = ( i == ((reply[name]!=undefined)? reply[name]:defaultValue) )
				radio.onchange = function(j){  return function(){save(this.name,j)}  }(i)
			label.appendChild(radio)
				var par = document.createElement('p')
				par.style.display = 'inline'
				par.innerHTML = texts[i]
			label.appendChild(par)
			label.appendChild( document.createElement('br') )
			document.getElementById('options').appendChild(label)
		}
	});
}

//creating the options

initSettings()
radio('display', ['show both the popup and address bar icon', "don't show a popup when internet connection is found or lost", "don't show icon in addres bar when internet conection can't be found"])
