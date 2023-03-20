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
				console.log(`Removed element with xpath: ${xpath}`);
				found_not_hidden = 1;
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
					console.log("Removed one channel recommendation");
				}

			});
		}

		NUMBER_OF_RECOMENDATIONS = 0;
		return true;
	}

	return false;
}

const channel_innerhtml = '<div><div class="Layout-sc-1xcs6mc-0 bZVrjx side-nav-card" data-test-selector="side-nav-card"><a data-a-id="recommended-channel-1" data-test-selector="recommended-channel" class="ScCoreLink-sc-16kq0mq-0 jKBAWW InjectLayout-sc-1i43xsx-0 fpJafq side-nav-card__link tw-link" href="/bebe872"><div class="Layout-sc-1xcs6mc-0 dutbes side-nav-card__avatar"><figure aria-label="bebe872" class="ScAvatar-sc-144b42z-0 fUKwUf tw-avatar"><img class="InjectLayout-sc-1i43xsx-0 bEwPpb tw-image tw-image-avatar" alt="bebe872" src="https://static-cdn.jtvnw.net/jtv_user_pictures/bbc6e857-1557-477e-aea7-d10550dd9ca2-profile_image-70x70.png"></figure></div><div class="Layout-sc-1xcs6mc-0 jQTQnr"><div data-a-target="side-nav-card-metadata" class="Layout-sc-1xcs6mc-0 eCunGK"><div class="Layout-sc-1xcs6mc-0 beAYWq side-nav-card__title"><p title="bebe872" data-a-target="side-nav-title" class="CoreText-sc-1txzju1-0 iQYdBM InjectLayout-sc-1i43xsx-0 gaLyxR">bebe872</p></div><div class="Layout-sc-1xcs6mc-0 fFENuB side-nav-card__metadata" data-a-target="side-nav-game-title"><p title="Teamfight Tactics" class="CoreText-sc-1txzju1-0 bApHMU">Teamfight Tactics</p></div></div><div class="Layout-sc-1xcs6mc-0 kzjhVk side-nav-card__live-status" data-a-target="side-nav-live-status"><div class="Layout-sc-1xcs6mc-0 beAYWq"><div class="ScChannelStatusIndicator-sc-bjn067-0 dMXHmM tw-channel-status-indicator" aria-label="Live"></div><div class="Layout-sc-1xcs6mc-0 kaXoQh"><span aria-label="1.5K viewers" class="CoreText-sc-1txzju1-0 grGUPN">1.5K</span></div></div></div></div></a></div></div>';

function check_recommendations(parentElement)
{
	const newDiv = document.createElement('div');
	newDiv.innerHTML = channel_innerhtml.replace(/recommended-channel-\d+/g, `recommended-channel-${NUMBER_OF_RECOMENDATIONS}`);
	parentElement.appendChild(newDiv);
	console.log("Added custom recommended channel");

	NUMBER_OF_RECOMENDATIONS += 1;
}

// Observer for the recommended channels
const channels = new MutationObserver(() => {
	// Get the parent element that contains all the recommended channels
	const parentElement = document.evaluate('/html/body/div[1]/div/div[2]/div/div[1]/div/div/div/div[3]/div/div/div[2]/nav/div/div/div[1]/div/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (clear_recommendations(parentElement)) {
		channels.disconnect();

		check_recommendations(parentElement);
		setInterval(check_recommendations, 20000, parentElement);
	}
});

channels.observe(document.body, { childList: true, subtree: true });