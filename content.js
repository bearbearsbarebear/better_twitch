console.log("Better Twitch is running");

// Define the list of xpaths for the elements to remove
const xpaths = [
  "/html/body/div[1]/div/div[2]/nav/div/div[3]/div[3]/div/div[1]/div[1]", 	// Login
  "/html/body/div[1]/div/div[2]/nav/div/div[3]/div[3]/div/div[1]/div[2]", 	// Signup
  "/html/body/div[1]/div/div[2]/nav/div/div[3]/div[2]", 					// Prime
  "/html/body/div[1]/div/div[2]/footer/div", 								// Register purple bar
  "/html/body/div[1]/div/div[2]/nav/div/div[1]/a",							// Home button
  "/html/body/div[1]/div/div[2]/nav/div/div[3]/div[3]/div/div[2]/div/div",	// User Icon
  "/html/body/div[1]/div/div[2]/div/div[1]/div/div/div/div[3]/div/div/div[2]/nav/div/div/div[1]/div[2]/div[1]", 		// Channel also recommends
  "/html/body/div[1]/div/div[2]/div/div[1]/div/div/div/div[3]/div/div/div[2]/nav/div/div/div[1]/div[2]/div[2]",			// Recommendations 2
  "/html/body/div[1]/div/div[2]/div/div[1]/div/div/div/div[3]/div/div/div[2]/nav/div/div/div[1]/div[2]/div[3]/button", 	// See More
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[2]/div/div[2]/div/div[1]/div/div/div[4]/div/div[1]/div[2]/div/div", 											// Prime Crown on Stream
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div/div/div/div/div[2]/div[1]/div[2]/div[2]/div[1]", 							// React
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div/div/div/div/div[2]/div[1]/div[2]/div[2]/div[2]/div/div/div/div[1]/div/div", // Follow
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div[2]/div[1]/div[2]/div[1]/div[2]/div/div/div/div[1]/div/div", 				// Offline Follow
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div/div/div/div/div[2]/div[1]/div[2]/div[2]/div[3]/div/div/div/button", 		// Subscribe
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div[2]/div[1]/div[2]/div[1]/div[3]/div/div/div/button",							// Offline Subscribe
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div/div/div/div/div[2]/div[2]/div[2]/div/div[2]/div[2]/button", 				// Report
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div[2]/div[1]/div[2]/div[2]", 													// Report offline
  "/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[2]/div/div[2]/div/div[1]/div/div/div[4]/div/div[2]/div[3]/div/div" 											// Random Buttons on the stream
];

let NUMBER_OF_RECOMENDATIONS;

// Observer for the xpaths
// This Observer will keep running searching for any xpaths that are re-added to the UI
const observer = new MutationObserver(() => 
{
	xpaths.forEach((xpath) => {
		const div = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		if (div) {
			const displayValue = window.getComputedStyle(div).getPropertyValue("display");
			if (displayValue != "none") {
				div.style.display = "none";
			}
		}
	});
});

// Observe changes to the body element
observer.observe(document.body, { childList: true, subtree: true });

function clear_recommendations(parentElement)
{
	if (parentElement) {
		while (parentElement.querySelectorAll('div').length > 0) {
			const childElements = parentElement.querySelectorAll('div');
			// Remove each child element
			childElements.forEach((child) => {
				if (parentElement != child) {
					child.remove();
				}

			});
		}

		NUMBER_OF_RECOMENDATIONS = 0;
		return true;
	}

	return false;
}

function clear_custom_recommendations()
{
	const custom_recomm = document.evaluate('//*[@id="channels-list"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	const clone = document.evaluate('//*[@id="cleared-channels-list-copy"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	let recomms_new = clone.cloneNode(true);
	recomms_new.id = 'channels-list';
	recomms_new.style.display = 'initial';
	custom_recomm.after(recomms_new);
	custom_recomm.remove();
}

function checkIfUserIsStreaming(username) 
{
	const url = "https://gql.twitch.tv/gql";
	const query = `query {
		user(login: "${username}") {
			stream {
				id
				title
				viewersCount
				createdAt
				game {
					name
				}
			}
		}
	}`;

	const headers = {
		"client-id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
		"Content-Type": "application/json",
	};

	return fetch(url, {
		method: "POST",
		headers: headers,
		body: JSON.stringify({ query: query, variables: {} }),
	})
	.then((response) => response.json())
	.then((data) => {
		return data;
	})
	.catch((error) => {
		console.error(error);
		return false;
	});
}

function format_views(num) {
	if (num >= 1000) {
		return (num / 1000).toLocaleString('en-US', {maximumFractionDigits:1}) + 'k';
	} else {
		return num.toLocaleString('en-US');
	}
}

const channel_innerhtml = '<div><div class="Layout-sc-1xcs6mc-0 bZVrjx side-nav-card" data-test-selector="side-nav-card"><a data-a-id="recommended-channel-1" data-test-selector="recommended-channel" class="ScCoreLink-sc-16kq0mq-0 jKBAWW InjectLayout-sc-1i43xsx-0 fpJafq side-nav-card__link tw-link" href="/streamer_user"><div class="Layout-sc-1xcs6mc-0 dutbes side-nav-card__avatar"><figure aria-label="streamer_user" class="ScAvatar-sc-144b42z-0 fUKwUf tw-avatar"><img class="InjectLayout-sc-1i43xsx-0 bEwPpb tw-image tw-image-avatar" alt="streamer_user" src="avatar_url"></figure></div><div class="Layout-sc-1xcs6mc-0 jQTQnr"><div data-a-target="side-nav-card-metadata" class="Layout-sc-1xcs6mc-0 eCunGK"><div class="Layout-sc-1xcs6mc-0 beAYWq side-nav-card__title"><p title="streamer_user" data-a-target="side-nav-title" class="CoreText-sc-1txzju1-0 iQYdBM InjectLayout-sc-1i43xsx-0 gaLyxR">streamer_user</p></div><div class="Layout-sc-1xcs6mc-0 fFENuB side-nav-card__metadata" data-a-target="side-nav-game-title"><p title="game_name" class="CoreText-sc-1txzju1-0 bApHMU">game_name</p></div></div><div class="Layout-sc-1xcs6mc-0 kzjhVk side-nav-card__live-status" data-a-target="side-nav-live-status"><div class="Layout-sc-1xcs6mc-0 beAYWq"><div class="ScChannelStatusIndicator-sc-bjn067-0 dMXHmM tw-channel-status-indicator" aria-label="Live"></div><div class="Layout-sc-1xcs6mc-0 kaXoQh"><span aria-label="viewers_num viewers" class="CoreText-sc-1txzju1-0 grGUPN">viewers_num</span></div></div></div></div></a></div></div>';
let followed_channels = [];
function execute_recommendations()
{
	if (followed_channels.length > 0) {
		clear_custom_recommendations();

		const parentElement = document.evaluate('//*[@id="channels-list"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

		followed_channels.forEach(channel => {
			if (channel[0]) {
				const username = channel[0].replace('https://www.twitch.tv/', '').replace('/', '');
				checkIfUserIsStreaming(username).then((result) => {
					if (result.data.user.stream) {
						const game_name = result.data.user.stream.game.name;
						let views = format_views(parseInt(result.data.user.stream.viewersCount));

						const avi_url = channel[1];

						const new_div = document.createElement('div');

						// This can potentially lead to XSS
						let div_innerhtml = channel_innerhtml.replace(/recommended-channel-\d+/g, `recommended-channel-${NUMBER_OF_RECOMENDATIONS}`);
						div_innerhtml = div_innerhtml.replace(/streamer_user/g, `${username}`);
						div_innerhtml = div_innerhtml.replace(/avatar_url/g, `${avi_url}`);
						div_innerhtml = div_innerhtml.replace(/viewers_num/g, `${views}`);
						div_innerhtml = div_innerhtml.replace(/game_name/g, `${game_name}`);

						new_div.innerHTML = div_innerhtml;
						parentElement.appendChild(new_div);

						NUMBER_OF_RECOMENDATIONS += 1;
					}
				});
			}
		});
	}
}

// Observer for the recommended channels
const channels = new MutationObserver(() => {
	// Get the parent element that contains all the recommended channels
	// This is inside side-nav
	// The goal is to clear it, copy it and hide the original (twitch changes it every now and then)
	const parentElement = document.evaluate('/html/body/div[1]/div/div[2]/div/div[1]/div/div/div/div[3]/div/div/div[2]/nav/div/div/div[1]/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (clear_recommendations(parentElement)) {
		channels.disconnect();

		const side_nav = document.evaluate('/html/body/div[1]/div/div[2]/div/div[1]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		let side_nav_2 = side_nav.cloneNode(true);
		side_nav_2.id = 'side-nav-2';
		side_nav.after(side_nav_2);
		side_nav.style.display = 'none';

		const parentElement = document.evaluate('/html/body/div[1]/div/div[2]/div/div[1]/div[2]/div/div/div[3]/div/div/div[2]/nav/div/div/div[1]/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

		let recomms_list = parentElement.cloneNode(true);
		recomms_list.id = 'channels-list';
		parentElement.after(recomms_list);

		let cleared_copy = parentElement.cloneNode(true);
		cleared_copy.id = 'cleared-channels-list-copy';
		cleared_copy.style.display = 'none';
		parentElement.after(cleared_copy);

		parentElement.remove();

		execute_recommendations();
		setInterval(execute_recommendations, 60000);
	}
});

channels.observe(document.body, { childList: true, subtree: true });

// Retrieve followed channels from the background script
browser.runtime.onMessage.addListener((message) => 
{
	if (message.command == "channel_list") {
		followed_channels = message.channels;
	} else if (message.command == "clicked") {
		execute_recommendations();
	} else if (message.command == "getAvatarUrl") {
		const parentElement = document.evaluate('/html/body/div[1]/div/div[2]/div/main/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/section/div/div/div/div/div[1]/div/div/div/a/div[1]/figure/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
		const avatarUrl = parentElement.getAttribute('src');
		if (avatarUrl) {
			browser.runtime.sendMessage({
				command: 'updateAvatar',
				channel: message.url,
				avatar: avatarUrl
			});
		}
	}
});
