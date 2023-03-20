// Listen for the "onCommitted" event, which is triggered when a new page is loaded
browser.webNavigation.onCommitted.addListener((details) => 
{
	// Check if the URL is the Twitch homepage
	if (details.url === "https://www.twitch.tv/") {
		// Redirect to the Twitch directory page
		browser.tabs.update(details.tabId, { url: "https://www.twitch.tv/directory" });
	}
});

let current_tab;
let extension_icon = "icons/invalid.png";

// Updates the icon to reflect whether the current channel is already followed.
function update_icon()
{
	const twitch_regex = /^https?:\/\/(www\.)twitch\.tv\/.*$/;

	if (current_tab) {
		if (twitch_regex.test(current_tab)) {
			let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
			if (followed_channels.includes(current_tab)) {
				extension_icon = "icons/unfollow.png";
			} else {
				extension_icon = "icons/follow.png";
			}
		} else {
			extension_icon = "icons/invalid.png";
		}
	}

	browser.browserAction.setIcon({path: extension_icon});
}

function update_active_tab()
{
	browser.tabs.query({active: true, currentWindow: true}).then(tabs => 
	{
		if (tabs.length > 0) {
			current_tab = tabs[0].url;
			update_icon();
			console.log(current_tab);
		}
	});
}

// listen to tab URL changes
browser.tabs.onUpdated.addListener(update_active_tab);
// listen to tab closing
browser.tabs.onRemoved.addListener(update_active_tab);
// listen to tab switching
browser.tabs.onActivated.addListener(update_active_tab);

// listen for window switching
browser.windows.onFocusChanged.addListener(update_active_tab);

function follow_channel()
{
	if (extension_icon == "icons/follow.png") {
		let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
		followed_channels.push(current_tab);
		
		localStorage.setItem('followed_channels', JSON.stringify(followed_channels));

		update_icon();
		console.log("Channel followed: ", current_tab);
	} else if (extension_icon == "icons/unfollow.png") {
		let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
		let index = followed_channels.indexOf(current_tab);

		if (index != -1) {
			followed_channels.splice(index, 1);
		}

		localStorage.setItem('followed_channels', JSON.stringify(followed_channels));

		update_icon();

		console.log("Channel unfollowed: ", current_tab);

		/*
		console.log("Channels List:");
		followed_channels.forEach(channel => {
		    console.log(channel);
		});
		*/
	}
}

browser.browserAction.onClicked.addListener(follow_channel);