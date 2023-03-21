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
			let index = followed_channels.findIndex(info => info[0] === current_tab);

			extension_icon = "icons/follow.png";

			if (index != -1) {
				extension_icon = "icons/unfollow.png";
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

			if (extension_icon != "icons/invalid.png") {
				let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
				// Send messsage to content.js with the localStorage
				browser.tabs.sendMessage(tabs[0].id, {
					command: 'channel_list',
					channels: followed_channels,
				});
			}
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

// TODO:
// Need to check if page is properly loaded
// Add cooldown between follows to avoid spam
// Check if followed channel is truly a channel
function follow_channel()
{
	browser.tabs.query({active: true, currentWindow: true}).then(tabs => 
	{
		if (tabs.length > 0) {
			let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
			// Send messsage to content.js with the localStorage
			browser.tabs.sendMessage(tabs[0].id, {
				command: 'channel_list',
				channels: followed_channels,
			});

			// Send messsage to content.js that addon has been clicked
			browser.tabs.sendMessage(tabs[0].id, {
				command: 'clicked',
			});
		}
	});

	if (extension_icon == "icons/follow.png") {
		let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];

		followed_channels.push([current_tab, null]);

		localStorage.setItem('followed_channels', JSON.stringify(followed_channels));

		update_icon();

		// Ask content.js for the avatar element
		browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				command: 'getAvatarUrl',
				url: tabs[0].url,
			});
		});
	} else if (extension_icon == "icons/unfollow.png") {
		let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
		let index = followed_channels.findIndex(info => info[0] === current_tab);

		if (index != -1) {
			followed_channels.splice(index, 1);
		}

		localStorage.setItem('followed_channels', JSON.stringify([followed_channels]));

		update_icon();
	}
}

browser.browserAction.onClicked.addListener(follow_channel);

// Update avatar
browser.runtime.onMessage.addListener(function(message) 
{
	if (message.command == 'updateAvatar') {
		let followed_channels = JSON.parse(localStorage.getItem('followed_channels')) || [];
		let index = followed_channels.findIndex(info => info[0] === message.channel);

		// If the object is found, update its avatarUrl property
		if (index !== -1) {
			followed_channels[index][1] = message.avatar;
		}

		localStorage.setItem('followed_channels', JSON.stringify(followed_channels));
	}
});
